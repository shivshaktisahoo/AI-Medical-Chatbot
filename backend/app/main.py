import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.config import settings
from app.ratelimit import limiter
from app.routers.consult import router as consult_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Never blocks startup — the app always boots and always answers, even
    # with zero configured providers (a local fallback responder is built in).
    logging.getLogger("startup").info(settings.describe_providers())
    yield


app = FastAPI(
    title="AI Medical Chatbot API",
    description="Multimodal (voice + image + text) health-guidance assistant built entirely on free-tier AI services.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(_: Request, exc: RateLimitExceeded) -> JSONResponse:
    response = JSONResponse(
        status_code=429,
        content={"detail": "You're sending messages a bit too quickly — please wait a moment and try again."},
    )
    retry_after = getattr(exc, "retry_after", None)
    if retry_after:
        response.headers["Retry-After"] = str(retry_after)
    return response


app.include_router(consult_router, prefix="/api")


@app.get("/")
async def root() -> dict:
    return {"name": "AI Medical Chatbot API", "docs": "/docs", "health": "/api/health"}
