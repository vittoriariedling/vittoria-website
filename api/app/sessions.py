"""Refresh-token session management: issue, rotate, revoke."""

import logging
import uuid
from datetime import timedelta

from fastapi import Request
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models import RefreshToken, User
from app.security import TokenError, create_refresh_token, decode_token, utcnow

log = logging.getLogger("app.sessions")


class SessionError(Exception):
    pass


def _client_meta(request: Request | None) -> dict:
    if request is None:
        return {}
    return {
        "user_agent": (request.headers.get("user-agent") or "")[:512] or None,
        "ip": request.client.host if request.client else None,
    }


async def _new_refresh(
    session: AsyncSession, user_id: uuid.UUID, family_id: uuid.UUID, request: Request | None
) -> tuple[str, RefreshToken]:
    token, jti, expires_at = create_refresh_token(user_id, family_id)
    row = RefreshToken(
        jti=jti, user_id=user_id, family_id=family_id, expires_at=expires_at, **_client_meta(request)
    )
    session.add(row)
    return token, row


async def start_session(session: AsyncSession, user: User, request: Request | None) -> str:
    """Create a new token family for a fresh login. Returns the refresh JWT."""
    token, _ = await _new_refresh(session, user.id, uuid.uuid4(), request)
    await session.commit()
    return token


async def revoke_family(session: AsyncSession, family_id: uuid.UUID) -> None:
    await session.execute(
        update(RefreshToken)
        .where(RefreshToken.family_id == family_id, RefreshToken.revoked_at.is_(None))
        .values(revoked_at=utcnow())
    )


async def revoke_all_for_user(session: AsyncSession, user_id: uuid.UUID) -> None:
    await session.execute(
        update(RefreshToken)
        .where(RefreshToken.user_id == user_id, RefreshToken.revoked_at.is_(None))
        .values(revoked_at=utcnow())
    )


async def rotate(session: AsyncSession, refresh_jwt: str, request: Request | None) -> tuple[User, str]:
    """Exchange a refresh JWT for a new one. Returns (user, new_refresh_jwt).

    Raises SessionError on any failure. Theft detection: presenting a token
    that was already used (outside the grace window below) or was revoked
    revokes the entire family before raising.

    Grace window: if a tab reloads or closes while its refresh request is in
    flight, the server rotates the token but the browser never stores the new
    cookie, so the next request re-sends the old one. Within a few seconds of
    first use, and only while its successor has never been used, we treat
    that as a lost response: revoke the orphaned successor and issue a fresh
    token. If an attacker were to win that race instead, the real user's next
    refresh presents the revoked successor, which revokes the whole family.
    """
    try:
        claims = decode_token(refresh_jwt, "refresh")
    except TokenError as e:
        raise SessionError("invalid token") from e

    # Row lock so two concurrent refreshes with the same token are serialized.
    row = await session.scalar(
        select(RefreshToken).where(RefreshToken.jti == claims["jti"]).with_for_update()
    )
    if row is None or row.user_id != claims["sub"] or row.family_id != claims["fam"]:
        raise SessionError("unknown token")

    now = utcnow()

    async def _theft(reason: str, level: int = logging.WARNING) -> SessionError:
        await revoke_family(session, row.family_id)
        await session.commit()
        log.log(level, "refresh rejected (%s); revoked family %s (user %s)", reason, row.family_id, row.user_id)
        return SessionError(reason)

    if row.revoked_at is not None:
        # Usually just an old tab after logout/password reset, so not a warning;
        # still revoke the family in case this was a grace-window orphan.
        raise await _theft("revoked token presented", logging.INFO)
    if row.used_at is not None:
        grace = timedelta(seconds=get_settings().refresh_reuse_grace_seconds)
        successor = await session.scalar(
            select(RefreshToken).where(RefreshToken.jti == row.replaced_by).with_for_update()
        )
        orphaned = successor is not None and successor.used_at is None and successor.revoked_at is None
        if now - row.used_at > grace or not orphaned:
            raise await _theft("reuse detected")
        successor.revoked_at = now
    if row.expires_at <= now:
        raise SessionError("expired")

    user = await session.get(User, row.user_id)
    if user is None or not user.is_active:
        await revoke_family(session, row.family_id)
        await session.commit()
        raise SessionError("inactive user")

    token, new_row = await _new_refresh(session, user.id, row.family_id, request)
    if row.used_at is None:  # keep the original time so the grace window never extends
        row.used_at = now
    row.replaced_by = new_row.jti
    await session.commit()
    return user, token


async def end_session(session: AsyncSession, refresh_jwt: str | None) -> None:
    """Best-effort logout: revoke the family of a valid refresh token."""
    if not refresh_jwt:
        return
    try:
        claims = decode_token(refresh_jwt, "refresh")
    except TokenError:
        return
    await revoke_family(session, claims["fam"])
    await session.commit()
