"""Small in-memory sliding-window rate limiter.

Good for a single API process. If the API is ever scaled to multiple
workers/containers, move this state to Redis so limits are shared.

Note on client IPs: behind a reverse proxy, uvicorn only trusts
X-Forwarded-For from FORWARDED_ALLOW_IPS. In local dev every request arrives
from the Vite container, so all browsers share one IP bucket.
"""

import math
import time
from collections import deque

from fastapi import HTTPException, Request, status

_MAX_KEYS = 50_000


class RateLimiter:
    def __init__(self) -> None:
        self._hits: dict[str, deque[float]] = {}

    def _window(self, key: str, window: float, now: float) -> deque[float]:
        q = self._hits.get(key)
        if q is None:
            if len(self._hits) >= _MAX_KEYS:
                self._prune(now)
            q = self._hits[key] = deque()
        while q and q[0] <= now - window:
            q.popleft()
        return q

    def _prune(self, now: float, max_window: float = 24 * 3600) -> None:
        for k in [k for k, q in self._hits.items() if not q or q[-1] <= now - max_window]:
            del self._hits[k]

    def retry_after(self, key: str, limit: int, window: float) -> int | None:
        """Seconds until a slot frees up, or None if under the limit."""
        now = time.monotonic()
        q = self._window(key, window, now)
        if len(q) < limit:
            return None
        return max(1, math.ceil(q[0] + window - now))

    def record(self, key: str) -> None:
        self._hits.setdefault(key, deque()).append(time.monotonic())

    def hit(self, key: str, limit: int, window: float) -> None:
        """Count one request against `key`; raise 429 if over the limit."""
        retry = self.retry_after(key, limit, window)
        if retry is not None:
            raise too_many(retry)
        self.record(key)

    def forget(self, key: str) -> None:
        self._hits.pop(key, None)

    def reset(self) -> None:
        self._hits.clear()


limiter = RateLimiter()


def too_many(retry_after: int) -> HTTPException:
    return HTTPException(
        status.HTTP_429_TOO_MANY_REQUESTS,
        "Too many attempts. Please wait and try again.",
        headers={"Retry-After": str(retry_after)},
    )


def client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


def limit_by_ip(name: str, limit: int, window_seconds: float):
    """FastAPI dependency: at most `limit` requests per IP per window."""

    def dep(request: Request) -> None:
        limiter.hit(f"{name}:{client_ip(request)}", limit, window_seconds)

    return dep
