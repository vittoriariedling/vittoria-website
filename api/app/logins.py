"""Login history: who logged in (or tried to), from which IP, and when."""

from datetime import timedelta

from fastapi import Request
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import LoginEvent, User
from app.ratelimit import client_ip
from app.security import utcnow

# IP addresses are personal data, so don't keep them forever.
LOGIN_HISTORY_DAYS = 180


def record_login(session: AsyncSession, user: User, request: Request, success: bool) -> None:
    """Add a login event to the session. The caller commits."""
    session.add(LoginEvent(
        user_id=user.id,
        ip=client_ip(request)[:64],
        user_agent=(request.headers.get("user-agent") or "")[:512] or None,
        success=success,
    ))


async def prune_old(session: AsyncSession) -> None:
    cutoff = utcnow() - timedelta(days=LOGIN_HISTORY_DAYS)
    await session.execute(delete(LoginEvent).where(LoginEvent.created_at < cutoff))
