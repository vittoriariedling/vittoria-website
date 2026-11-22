import uuid
from datetime import timedelta
from urllib.parse import urlencode

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select, update

from app import sessions
from app.config import get_settings
from app.deps import AdminUser, SessionDep, require_admin
from app.models import Invite, InviteKind, LoginEvent, PasswordReset, Role, User
from app.schemas import (
    AdminUserOut,
    AdminUserUpdate,
    InviteCreate,
    InviteCreated,
    InviteOut,
    LoginEventOut,
    LoginSummaryOut,
    ResetLinkOut,
)
from app.security import generate_opaque_token, hash_opaque_token, utcnow
from app.tokens import invite_status

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(require_admin)])


def _link(path: str, **params: str) -> str:
    return f"{get_settings().public_base_url.rstrip('/')}{path}?{urlencode(params)}"


def _invite_out(invite: Invite) -> InviteOut:
    fields = {f: getattr(invite, f) for f in InviteOut.model_fields if f != "status"}
    return InviteOut(**fields, status=invite_status(invite))


async def _get_user(session: SessionDep, user_id: uuid.UUID) -> User:
    user = await session.get(User, user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return user


# ── Invites ──────────────────────────────────────────────────────────


@router.post("/invites", response_model=InviteCreated, status_code=status.HTTP_201_CREATED)
async def create_invite(body: InviteCreate, admin: AdminUser, session: SessionDep):
    if body.kind == InviteKind.email and await session.scalar(select(User.id).where(User.email == body.email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "That email already has an account")

    token = generate_opaque_token()
    invite = Invite(
        token_hash=hash_opaque_token(token),
        kind=body.kind,
        email=body.email,
        note=body.note or None,
        max_uses=body.max_uses,
        use_count=0,
        expires_at=utcnow() + timedelta(days=body.expires_in_days),
        created_by=admin.id,
    )
    session.add(invite)
    await session.commit()
    await session.refresh(invite)
    return InviteCreated(**_invite_out(invite).model_dump(), token=token, url=_link("/register", invite=token))


@router.get("/invites", response_model=list[InviteOut])
async def list_invites(session: SessionDep):
    invites = await session.scalars(select(Invite).order_by(Invite.created_at.desc()))
    return [_invite_out(i) for i in invites]


@router.post("/invites/{invite_id}/revoke", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_invite(invite_id: uuid.UUID, session: SessionDep):
    invite = await session.get(Invite, invite_id)
    if invite is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Invite not found")
    if invite.revoked_at is None:
        invite.revoked_at = utcnow()
        await session.commit()


# ── Users ────────────────────────────────────────────────────────────


@router.get("/users", response_model=list[AdminUserOut])
async def list_users(session: SessionDep):
    return (await session.scalars(select(User).order_by(User.created_at))).all()


@router.patch("/users/{user_id}", response_model=AdminUserOut)
async def update_user(user_id: uuid.UUID, body: AdminUserUpdate, admin: AdminUser, session: SessionDep):
    user = await _get_user(session, user_id)
    if user.id == admin.id and (body.is_active is False or body.role == Role.member):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "You can't deactivate or demote yourself")

    if body.role is not None:
        user.role = body.role
    if body.is_active is not None:
        user.is_active = body.is_active
        if not body.is_active:
            await sessions.revoke_all_for_user(session, user.id)
    await session.commit()
    await session.refresh(user)
    return user


@router.post("/users/{user_id}/password-reset", response_model=ResetLinkOut, status_code=status.HTTP_201_CREATED)
async def create_reset_link(user_id: uuid.UUID, admin: AdminUser, session: SessionDep):
    user = await _get_user(session, user_id)
    if not user.is_active:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "User is deactivated")

    now = utcnow()
    # Only the newest reset link for a user is ever valid.
    await session.execute(
        update(PasswordReset)
        .where(PasswordReset.user_id == user.id, PasswordReset.used_at.is_(None))
        .values(used_at=now)
    )
    token = generate_opaque_token()
    expires_at = now + timedelta(hours=get_settings().password_reset_ttl_hours)
    session.add(PasswordReset(token_hash=hash_opaque_token(token), user_id=user.id,
                              expires_at=expires_at, created_by=admin.id))
    await session.commit()
    return ResetLinkOut(url=_link("/reset-password", token=token), expires_at=expires_at)


# ── Login history ────────────────────────────────────────────────────


@router.get("/logins", response_model=list[LoginEventOut])
async def list_logins(
    session: SessionDep,
    user_id: uuid.UUID | None = None,
    ip: Annotated[str | None, Query(max_length=64)] = None,
    limit: Annotated[int, Query(ge=1, le=500)] = 100,
):
    """Most recent login attempts first, optionally for one account and/or IP."""
    q = (
        select(LoginEvent, User.display_name, User.email)
        .join(User, User.id == LoginEvent.user_id)
        .order_by(LoginEvent.created_at.desc())
        .limit(limit)
    )
    if user_id is not None:
        q = q.where(LoginEvent.user_id == user_id)
    if ip is not None:
        q = q.where(LoginEvent.ip == ip)
    rows = await session.execute(q)
    return [
        LoginEventOut(id=e.id, user_id=e.user_id, display_name=name, email=email, ip=e.ip,
                      user_agent=e.user_agent, success=e.success, created_at=e.created_at)
        for e, name, email in rows
    ]


@router.get("/logins/summary", response_model=list[LoginSummaryOut])
async def login_summary(session: SessionDep):
    """One row per (account, IP) pair, most recently seen first."""
    q = (
        select(
            LoginEvent.user_id,
            User.display_name,
            User.email,
            LoginEvent.ip,
            func.count().filter(LoginEvent.success).label("successes"),
            func.count().filter(~LoginEvent.success).label("failures"),
            func.min(LoginEvent.created_at).label("first_seen"),
            func.max(LoginEvent.created_at).label("last_seen"),
        )
        .join(User, User.id == LoginEvent.user_id)
        .group_by(LoginEvent.user_id, User.display_name, User.email, LoginEvent.ip)
        .order_by(func.max(LoginEvent.created_at).desc())
    )
    return [LoginSummaryOut.model_validate(r, from_attributes=True) for r in await session.execute(q)]
