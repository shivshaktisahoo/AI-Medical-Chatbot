"""Text-to-speech with automatic failover: edge-tts (free, no key) first,
gTTS (free, no key) if that's blocked on the network. Both are best-effort —
callers should treat a total failure as "no audio" rather than an error, so a
consult reply is still delivered as text."""

import asyncio
import base64
import logging
from io import BytesIO

import edge_tts
from gtts import gTTS

from app.config import settings

logger = logging.getLogger("tts")


async def _edge_tts_bytes(text: str, voice: str) -> bytes:
    communicate = edge_tts.Communicate(text, voice)
    buffer = BytesIO()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            buffer.write(chunk["data"])
    data = buffer.getvalue()
    if not data:
        raise RuntimeError("edge-tts returned no audio data")
    return data


def _gtts_bytes(text: str) -> bytes:
    buffer = BytesIO()
    gTTS(text=text, lang="en").write_to_fp(buffer)
    return buffer.getvalue()


async def synthesize_base64(text: str, gender: str = "female") -> tuple[str, str | None]:
    """Returns (audio_base64, notice). `notice` is set only when edge-tts's
    natural per-gender voice was unavailable and we had to fall back to
    gTTS, whose single generic voice doesn't vary by gender."""
    voice = settings.tts_voice_for(gender)

    # edge-tts occasionally fails a single request transiently (a brief hiccup
    # talking to Microsoft's endpoint) — one quick retry clears most of those
    # without ever falling back to the lower-quality, gender-invariant gTTS voice.
    for attempt in range(2):
        try:
            data = await _edge_tts_bytes(text, voice)
            return base64.b64encode(data).decode("utf-8"), None
        except Exception as exc:
            logger.warning("edge-tts attempt %d failed (%s)", attempt + 1, exc)

    logger.warning("edge-tts unavailable after retry, falling back to gTTS")
    data = await asyncio.to_thread(_gtts_bytes, text)
    return (
        base64.b64encode(data).decode("utf-8"),
        "Using a generic backup voice right now — the natural per-doctor voice is temporarily unavailable.",
    )
