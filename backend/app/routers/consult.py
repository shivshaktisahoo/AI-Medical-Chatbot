import logging

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile

from app.schemas import ConsultResponse, HealthResponse
from app.services import llm, stt, tts
from app.config import settings
from app.ratelimit import limiter

logger = logging.getLogger("consult")
router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        vision_model=settings.vision_model,
        text_model=settings.text_model,
        whisper_model=settings.whisper_model,
    )


@router.post("/consult", response_model=ConsultResponse)
@limiter.limit(settings.rate_limit)
async def consult(
    request: Request,
    text: str = Form(default=""),
    voice: str = Form(default="female"),
    audio: UploadFile | None = File(default=None),
    image: UploadFile | None = File(default=None),
) -> ConsultResponse:
    voice = voice if voice in ("male", "female") else "female"

    if not text.strip() and audio is None:
        raise HTTPException(status_code=400, detail="Provide text or an audio recording.")

    transcript: str | None = None
    user_text = text.strip()
    notices: list[str] = []

    if audio is not None:
        audio_bytes = await audio.read()
        if audio_bytes:
            try:
                transcript = stt.transcribe(audio_bytes, audio.filename or "audio.webm")
                user_text = transcript if not user_text else f"{user_text}\n\n{transcript}"
            except Exception as exc:  # network/service errors — degrade, don't fail the request
                logger.warning("Transcription unavailable, continuing without it: %s", exc)
                notices.append("Voice transcription is temporarily unavailable, so this reply is based on general guidance.")

    image_bytes: bytes | None = None
    if image is not None:
        image_bytes = await image.read()
        if not image_bytes:
            image_bytes = None

    try:
        reply_text, fallback_notice = llm.generate_reply(user_text, image_bytes)
    except Exception:  # generate_reply already has its own fallback chain; this is a last resort
        logger.exception("Unexpected failure in generate_reply, using hardcoded response")
        reply_text = (
            "I'm having trouble reaching the AI service right now. Please try again in a moment, "
            "and remember to consult a licensed doctor for anything urgent."
        )
        fallback_notice = "An unexpected error occurred; showing a hardcoded fallback response."
    if fallback_notice:
        notices.append(fallback_notice)

    audio_b64: str | None = None
    try:
        audio_b64, tts_notice = await tts.synthesize_base64(reply_text, voice)
        if tts_notice:
            notices.append(tts_notice)
    except Exception:  # tts is best-effort; text-only replies are still a full success
        logger.exception("TTS synthesis failed, returning text-only reply")
        notices.append("Spoken audio is temporarily unavailable; showing text only.")

    return ConsultResponse(
        transcript=transcript,
        reply_text=reply_text,
        audio_base64=audio_b64,
        notice=" ".join(notices) or None,
    )
