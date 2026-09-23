"""Per-IP rate limiting so one abusive user can't burn through the shared
free-tier AI quota (or get the free API keys flagged) for everyone else.

In-memory by design — this app runs as a single instance on the free tiers
it's meant for (Render, Hugging Face Spaces); no Redis needed. Limits reset
if the process restarts, which is fine for this use case.
"""

from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config import settings


def real_client_ip(request: Request) -> str:
    """Render/Vercel-style deployments sit behind a reverse proxy, so
    request.client.host is the proxy's IP, not the visitor's — prefer the
    first hop of X-Forwarded-For when present."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return get_remote_address(request)


# No `default_limits` here on purpose — that would apply globally via
# SlowAPIMiddleware, including to /api/health (which Render's own uptime
# monitor polls, and must never get blocked). The limit is applied explicitly
# with @limiter.limit(settings.rate_limit) only on the /api/consult route.
limiter = Limiter(key_func=real_client_ip)
