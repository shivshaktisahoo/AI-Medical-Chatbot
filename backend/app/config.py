"""Environment-driven configuration. Every default here maps to a service with a free tier."""

import os
from pathlib import Path

from dotenv import load_dotenv

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)


class Settings:
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")

    # Free, fast Groq-hosted models (see https://console.groq.com/docs/models).
    # Groq periodically retires/renames models, and not every key has access to
    # every model (vision models in particular are gated on some accounts) — if
    # these 404, run `GET /openai/v1/models` with your key to see what you have,
    # or just rely on the OpenRouter / local fallback that kicks in automatically.
    vision_model: str = os.getenv("GROQ_VISION_MODEL", "meta-llama/llama-4-scout-17b-16e-instruct")
    text_model: str = os.getenv("GROQ_TEXT_MODEL", "openai/gpt-oss-20b")
    whisper_model: str = os.getenv("GROQ_WHISPER_MODEL", "whisper-large-v3-turbo")

    # Optional second AI provider — free tier, used only if Groq is unavailable,
    # rate-limited, or a model id goes stale. https://openrouter.ai/keys
    # OpenRouter's free model lineup changes often; check https://openrouter.ai/models?max_price=0
    # if these ever 404 (their error message names the current replacement slug).
    openrouter_api_key: str = os.getenv("OPENROUTER_API_KEY", "")
    openrouter_base_url: str = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1").rstrip("/")
    openrouter_text_model: str = os.getenv("OPENROUTER_TEXT_MODEL", "nvidia/nemotron-3-super-120b-a12b:free")
    openrouter_vision_model: str = os.getenv("OPENROUTER_VISION_MODEL", "google/gemma-4-31b-it:free")

    # edge-tts is free and needs no API key; gTTS is the free fallback if it's blocked
    # (gTTS has no gender-selectable voices, so gender only applies to edge-tts).
    # Full voice list: `edge-tts --list-voices`
    tts_voice_female: str = os.getenv("TTS_VOICE_FEMALE", "en-US-AriaNeural")
    tts_voice_male: str = os.getenv("TTS_VOICE_MALE", "en-US-AndrewNeural")

    def tts_voice_for(self, gender: str) -> str:
        return self.tts_voice_male if gender == "male" else self.tts_voice_female

    # Per-IP limit on /api/consult, in slowapi's "N/period" syntax (e.g. "8/minute").
    # Protects the shared free-tier quota from a single abusive user — not meant
    # to be tight for a normal conversation, just to stop rapid-fire spamming.
    rate_limit: str = os.getenv("RATE_LIMIT", "8/minute")

    max_image_dimension: int = int(os.getenv("MAX_IMAGE_DIMENSION", "1024"))
    allowed_origins: list[str] = [
        origin.strip()
        for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
        if origin.strip()
    ]

    def describe_providers(self) -> str:
        """Never raises — the app must always boot and always answer, even with
        zero configured providers (a built-in local responder is the last resort)."""
        configured = []
        if self.groq_api_key:
            configured.append("Groq")
        if self.openrouter_api_key:
            configured.append("OpenRouter")
        if not configured:
            return (
                "No GROQ_API_KEY or OPENROUTER_API_KEY set — running in local-only demo mode. "
                "Add a free key at https://console.groq.com/keys for real AI responses."
            )
        return f"AI providers configured: {', '.join(configured)} (+ local fallback)"


settings = Settings()
