"""Lookup and validation for opaque single-purpose tokens (invites, resets)."""

from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Invite, PasswordReset, User
from app.security import hash_opaque_token, utcnow


def invite_status(invite: Invite, now: datetime | None = None) -> str:
    now = now or utcnow()
    if invite.revoked_at is not None:
        return "revoked"
    if invite.use_count >= invite.max_uses:
        return "used"
    if invite.expires_at <= now:
        return "expired"
    return "active"


async def find_active_invite(session: AsyncSession, token: str, *, lock: bool = False) -> Invite | None:
    stmt = select(Invite).where(Invite.token_hash == hash_opaque_token(token))
    if lock:
        stmt = stmt.with_for_update()
    invite = await session.scalar(stmt)
    if invite is None or invite_status(invite) != "active":
        return None
    return invite


async def find_active_reset(
    session: AsyncSession, token: str, *, lock: bool = False
) -> tuple[PasswordReset, User] | None:
    stmt = (
        select(PasswordReset, User)
        .join(User, User.id == PasswordReset.user_id)
        .where(PasswordReset.token_hash == hash_opaque_token(token))
    )
    if lock:
        stmt = stmt.with_for_update(of=PasswordReset)
    row = (await session.execute(stmt)).first()
    if row is None:
        return None
    reset, user = row
    if reset.used_at is not None or reset.expires_at <= utcnow() or not user.is_active:
        return None
    return reset, user
