from pydantic import BaseModel


class ConsultResponse(BaseModel):
    transcript: str | None = None
    reply_text: str
    audio_base64: str | None = None
    audio_mime: str = "audio/mpeg"
    notice: str | None = None


class HealthResponse(BaseModel):
    status: str
    vision_model: str
    text_model: str
    whisper_model: str
