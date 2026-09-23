"""Speech-to-text via Groq's free-tier hosted Whisper."""

from io import BytesIO

from groq import Groq

from app.config import settings

_client: Groq | None = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=settings.groq_api_key)
    return _client


def transcribe(audio_bytes: bytes, filename: str = "audio.webm") -> str:
    client = _get_client()
    buffer = BytesIO(audio_bytes)
    buffer.name = filename
    result = client.audio.transcriptions.create(
        file=buffer,
        model=settings.whisper_model,
    )
    return result.text.strip()
