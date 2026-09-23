"""Vision + text reasoning with automatic failover.

Tries Groq (free tier) first, then OpenRouter's free-tier models, then falls
back to a built-in, rule-based responder that needs no network access at all.
This means /api/consult always returns a usable answer — even with no API key
configured, an expired/renamed model id, or a provider outage — so the app is
always demoable.
"""

import base64
import logging
import re
from io import BytesIO

import httpx
from groq import Groq
from PIL import Image

from app.config import settings

logger = logging.getLogger("llm")

SYSTEM_PROMPT = (
    "You are an AI health assistant that gives general, educational information about "
    "visible symptoms and skin concerns from a description and/or photo. "
    "You are NOT a licensed doctor and this is NOT a diagnosis. "
    "Rules:\n"
    "1. Keep the reply under 120 words, plain conversational language, no markdown, no bullet points "
    "   (it will be read aloud by a text-to-speech engine).\n"
    "2. Describe what you observe, 2-3 plausible general explanations, and simple self-care advice.\n"
    "3. Always end by recommending an in-person visit to a licensed doctor or dermatologist "
    "   for an actual diagnosis, especially if symptoms are severe, spreading, or persistent.\n"
    "4. Never invent a definitive diagnosis or prescribe medication."
)

_groq_client: Groq | None = None


def _get_groq_client() -> Groq:
    global _groq_client
    if _groq_client is None:
        _groq_client = Groq(api_key=settings.groq_api_key)
    return _groq_client


def _encode_image(image_bytes: bytes) -> str:
    image = Image.open(BytesIO(image_bytes))
    image.thumbnail((settings.max_image_dimension, settings.max_image_dimension))
    buffer = BytesIO()
    image.convert("RGB").save(buffer, format="JPEG", quality=80)
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


def _build_messages(user_text: str, image_b64: str | None) -> list[dict]:
    content: str | list[dict] = user_text
    if image_b64:
        content = [
            {"type": "text", "text": user_text},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}},
        ]
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": content},
    ]


def _try_groq(user_text: str, image_b64: str | None) -> str:
    if not settings.groq_api_key:
        raise RuntimeError("GROQ_API_KEY not configured")
    client = _get_groq_client()
    model = settings.vision_model if image_b64 else settings.text_model
    response = client.chat.completions.create(
        model=model,
        max_completion_tokens=400,
        temperature=0.4,
        messages=_build_messages(user_text, image_b64),
    )
    return response.choices[0].message.content.strip()


def _try_openrouter(user_text: str, image_b64: str | None) -> str:
    if not settings.openrouter_api_key:
        raise RuntimeError("OPENROUTER_API_KEY not configured")
    model = settings.openrouter_vision_model if image_b64 else settings.openrouter_text_model
    resp = httpx.post(
        f"{settings.openrouter_base_url}/chat/completions",
        headers={"Authorization": f"Bearer {settings.openrouter_api_key}"},
        json={
            "model": model,
            "messages": _build_messages(user_text, image_b64),
            "max_tokens": 400,
            "temperature": 0.4,
        },
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"].strip()


# --- local, always-available fallback (no network, no key) -----------------

_TOPIC_RESPONSES: list[tuple[re.Pattern, str]] = [
    (
        re.compile(r"\b(skin|rash|acne|itch|mole|bump|eczema|dry patch)\b", re.I),
        "Based on what you've described, this sounds like it could be a common skin irritation such "
        "as contact dermatitis, mild eczema, or an allergic reaction. Keep the area clean and dry, "
        "avoid scratching, and try a fragrance-free moisturizer. If it spreads, blisters, or doesn't "
        "improve in a few days, please see a dermatologist in person.",
    ),
    (
        re.compile(r"\b(fever|temperature|chills)\b", re.I),
        "A fever is usually your body fighting an infection. Rest, stay hydrated, and monitor your "
        "temperature. If it goes above 103°F (39.4°C), lasts more than three days, or comes with a "
        "stiff neck, confusion, or trouble breathing, seek medical care right away.",
    ),
    (
        re.compile(r"\b(headache|migraine)\b", re.I),
        "Headaches are often caused by stress, dehydration, or poor sleep. Try resting in a dark "
        "room, drinking water, and a mild over-the-counter pain reliever if that's appropriate for "
        "you. A sudden, severe headache unlike any you've had before, or one with vision changes, "
        "needs urgent medical attention.",
    ),
    (
        re.compile(r"\b(cough|cold|throat|congestion|sneeze)\b", re.I),
        "This sounds like a common cold or mild respiratory irritation. Rest, fluids, and throat "
        "lozenges usually help. See a doctor if you have trouble breathing, chest pain, or symptoms "
        "lasting more than ten days.",
    ),
    (
        re.compile(r"\b(stomach|nausea|vomit|diarrhea|cramp)\b", re.I),
        "Stomach upset is often from something you ate or a mild bug. Stick to bland food, sip water "
        "or an electrolyte drink, and rest. See a doctor if there's severe pain, blood, or symptoms "
        "lasting more than two days.",
    ),
]

_GENERIC_FALLBACK = (
    "Thanks for sharing that. In general, mild symptoms often improve with rest, hydration, and "
    "basic over-the-counter care, but I can't examine you directly, so keep an eye on how things "
    "progress. If symptoms are severe, worsening, or unusual for you, please see a licensed doctor."
)

_IMAGE_FALLBACK = (
    "I can see you've attached a photo. Live image analysis isn't available right now, so here's "
    "general guidance instead: note the size, color, and whether it's changing or spreading, and "
    "share that with a doctor or dermatologist for a proper in-person look."
)


def _local_fallback(user_text: str, image_present: bool) -> str:
    for pattern, reply in _TOPIC_RESPONSES:
        if pattern.search(user_text):
            return reply
    return _IMAGE_FALLBACK if image_present else _GENERIC_FALLBACK


def generate_reply(user_text: str, image_bytes: bytes | None) -> tuple[str, str | None]:
    """Returns (reply_text, notice). `notice` is set only when live providers
    were unavailable and we had to use the local fallback responder."""
    user_text = user_text.strip() or (
        "Please look at the attached photo and describe what you observe."
        if image_bytes
        else "The user wants general health guidance but gave no further details."
    )
    image_b64 = _encode_image(image_bytes) if image_bytes else None

    for name, fn in (("Groq", _try_groq), ("OpenRouter", _try_openrouter)):
        try:
            return fn(user_text, image_b64), None
        except Exception as exc:
            logger.warning("%s provider unavailable, trying next: %s", name, exc)

    return (
        _local_fallback(user_text, image_bytes is not None),
        "Live AI providers are unavailable right now, so this reply is a canned offline demo response.",
    )
