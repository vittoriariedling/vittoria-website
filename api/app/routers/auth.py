import asyncio
from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app import logins, sessions
from app.config import get_settings
from app.deps import CurrentUser, SessionDep, require_trusted_origin
from app.models import InviteKind, User
from app.ratelimit import client_ip, limit_by_ip, limiter
from app.schemas import (
    InviteCheckResponse,
    LoginRequest,
    RegisterRequest,
    ResetCheckResponse,
    ResetPasswordRequest,
    TokenCheck,
    TokenResponse,
    UserOut,
)
from app.security import TokenError, create_access_token, decode_token, hash_password, utcnow, verify_password
from app.tokens import find_active_invite, find_active_reset

router = APIRouter(prefix="/api/auth", tags=["auth"])

REFRESH_COOKIE = "refresh_token"
# The cookie is only ever sent to the auth endpoints, never to content APIs.
REFRESH_COOKIE_PATH = "/api/auth"

INVALID_CREDENTIALS = "Invalid email or password"
INVALID_INVITE = "This invite link is invalid or has expired"
INVALID_RESET = "This reset link is invalid or has expired"

# Login attempts allowed per email *from one IP* before that IP is locked out
# for that email. Keyed on the IP so nobody can lock someone else out.
LOGIN_ATTEMPTS_PER_IP = (5, 15 * 60)
# Across all IPs, attempts on one email past this many in the window are slowed
# down (never refused), so guessing from many machines stays slow while the
# real owner can always still log in.
LOGIN_SLOWDOWN_AFTER = 10
LOGIN_SLOWDOWN_WINDOW = 15 * 60
LOGIN_SLOWDOWN_MAX_SECONDS = 8
# Refreshes allowed per login session (token family) per minute.
REFRESH_PER_SESSION = (60, 60)

# Every endpoint that sets the refresh cookie or acts on it checks Origin.
# On login/register this blocks "login CSRF" (signing a victim into an
# attacker-controlled account), which SameSite alone does not prevent.
trusted_origin = Depends(require_trusted_origin)


def _set_refresh_cookie(response: Response, token: str) -> None:
    s = get_settings()
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=token,
        max_age=s.refresh_token_ttl_days * 24 * 3600,
        path=REFRESH_COOKIE_PATH,
        httponly=True,
        secure=s.cookie_secure,
        samesite="strict",
    )


def _clear_refresh_cookie(response: Response) -> None:
    s = get_settings()
    response.delete_cookie(
        key=REFRESH_COOKIE,
        path=REFRESH_COOKIE_PATH,
        httponly=True,
        secure=s.cookie_secure,
        samesite="strict",
    )


def _token_response(user: User) -> TokenResponse:
    return TokenResponse(
        access_token=create_access_token(user.id, user.role.value),
        expires_in=get_settings().access_token_ttl_minutes * 60,
        user=UserOut.model_validate(user),
    )


def _no_store(response: Response) -> None:
    response.headers["Cache-Control"] = "no-store"


async def _logged_in(session, user: User, request: Request, response: Response) -> TokenResponse:
    logins.record_login(session, user, request, success=True)
    await logins.prune_old(session)
    refresh = await sessions.start_session(session, user, request)  # commits
    _set_refresh_cookie(response, refresh)
    _no_store(response)
    return _token_response(user)


# ── Login / session ──────────────────────────────────────────────────


@router.post(
    "/login",
    response_model=TokenResponse,
    dependencies=[trusted_origin, Depends(limit_by_ip("login", 20, 60))],
)
async def login(body: LoginRequest, request: Request, response: Response, session: SessionDep):
    email_key = f"login-fail:{body.email}"
    ip_key = f"{email_key}:{client_ip(request)}"
    # Check and count this attempt in one synchronous step, before any await, so
    # a burst of parallel requests can't all slip past the limit.
    limiter.hit(ip_key, *LOGIN_ATTEMPTS_PER_IP)
    recent = limiter.count(email_key, LOGIN_SLOWDOWN_WINDOW)
    limiter.record(email_key)
    if recent >= LOGIN_SLOWDOWN_AFTER:
        await asyncio.sleep(min(2 ** (recent - LOGIN_SLOWDOWN_AFTER), LOGIN_SLOWDOWN_MAX_SECONDS))

    user = await session.scalar(select(User).where(User.email == body.email))
    ok, new_hash = verify_password(body.password, user.password_hash if user else None)
    if not ok or user is None or not user.is_active:
        if user is not None:
            logins.record_login(session, user, request, success=False)
            await session.commit()
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, INVALID_CREDENTIALS)
    # A successful login clears this email's attempt counters.
    limiter.forget(email_key)
    limiter.forget_prefix(f"{email_key}:")
    if new_hash:  # hashing parameters were upgraded since this hash was made
        user.password_hash = new_hash
    return await _logged_in(session, user, request, response)


@router.post(
    "/refresh",
    response_model=TokenResponse,
    # Every full page load refreshes, and many people can share one IP (campus,
    # office), so the real limit is per session; the IP cap only stops floods.
    dependencies=[trusted_origin, Depends(limit_by_ip("refresh", 600, 60))],
)
async def refresh(
    request: Request,
    response: Response,
    session: SessionDep,
    refresh_token: Annotated[str | None, Cookie(alias=REFRESH_COOKIE)] = None,
):
    if not refresh_token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "No session")
    try:
        family = decode_token(refresh_token, "refresh")["fam"]
        limiter.hit(f"refresh-family:{family}", *REFRESH_PER_SESSION)
    except TokenError:
        pass  # invalid tokens are rejected (and the cookie cleared) by rotate() below
    try:
        user, new_refresh = await sessions.rotate(session, refresh_token, request)
    except sessions.SessionError:
        # Raising would discard headers set on `response`, so build the 401
        # ourselves to make sure the dead cookie is cleared.
        resp = Response(status_code=status.HTTP_401_UNAUTHORIZED, content='{"detail":"Session expired"}',
                        media_type="application/json")
        _clear_refresh_cookie(resp)
        return resp
    _set_refresh_cookie(response, new_refresh)
    _no_store(response)
    return _token_response(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT, dependencies=[trusted_origin])
async def logout(
    response: Response,
    session: SessionDep,
    refresh_token: Annotated[str | None, Cookie(alias=REFRESH_COOKIE)] = None,
):
    await sessions.end_session(session, refresh_token)
    _clear_refresh_cookie(response)


@router.post("/logout-all", status_code=status.HTTP_204_NO_CONTENT)
async def logout_all(user: CurrentUser, response: Response, session: SessionDep):
    await sessions.revoke_all_for_user(session, user.id)
    await session.commit()
    _clear_refresh_cookie(response)


# ── Invites / registration ───────────────────────────────────────────

_token_check_limit = Depends(limit_by_ip("token-check", 30, 15 * 60))


@router.post("/invites/check", response_model=InviteCheckResponse, dependencies=[_token_check_limit])
async def check_invite(body: TokenCheck, session: SessionDep):
    """Lets the register page validate a link and prefill the email.

    Tokens are sent in the body (not the URL path) so they don't end up in
    access logs.
    """
    invite = await find_active_invite(session, body.token)
    if invite is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, INVALID_INVITE)
    return InviteCheckResponse(kind=invite.kind, email=invite.email, expires_at=invite.expires_at)


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[trusted_origin, Depends(limit_by_ip("register", 10, 3600))],
)
async def register(body: RegisterRequest, request: Request, response: Response, session: SessionDep):
    # Lock the invite row so concurrent signups can't exceed max_uses.
    invite = await find_active_invite(session, body.invite_token, lock=True)
    if invite is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, INVALID_INVITE)
    if invite.kind == InviteKind.email and invite.email != body.email:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "This invite is for a different email address")

    if await session.scalar(select(User.id).where(User.email == body.email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")

    user = User(
        email=body.email,
        display_name=body.display_name,
        password_hash=hash_password(body.password),
        invited_by_invite_id=invite.id,
    )
    session.add(user)
    invite.use_count += 1
    try:
        await session.flush()
    except IntegrityError:  # lost a race on the unique email
        await session.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")
    return await _logged_in(session, user, request, response)


# ── Password reset (links generated by an admin) ─────────────────────


@router.post("/password-reset/check", response_model=ResetCheckResponse, dependencies=[_token_check_limit])
async def check_reset(body: TokenCheck, session: SessionDep):
    found = await find_active_reset(session, body.token)
    if found is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, INVALID_RESET)
    return ResetCheckResponse(email=found[1].email)


@router.post(
    "/password-reset",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[trusted_origin, Depends(limit_by_ip("reset", 10, 15 * 60))],
)
async def reset_password(body: ResetPasswordRequest, session: SessionDep):
    found = await find_active_reset(session, body.token, lock=True)
    if found is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, INVALID_RESET)
    reset, user = found
    reset.used_at = utcnow()
    user.password_hash = hash_password(body.password)
    # A password change logs out every existing session.
    await sessions.revoke_all_for_user(session, user.id)
    await session.commit()
    # Clear any lockout or slowdown from failed attempts before the reset.
    limiter.forget(f"login-fail:{user.email}")
    limiter.forget_prefix(f"login-fail:{user.email}:")
