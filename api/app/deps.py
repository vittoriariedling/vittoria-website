import logging
from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.db import get_session
from app.models import Role, User
from app.security import TokenError, decode_token

log = logging.getLogger("app.auth")

SessionDep = Annotated[AsyncSession, Depends(get_session)]

_bearer = HTTPBearer(auto_error=False)


def _unauthorized(detail: str = "Not authenticated") -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


async def get_current_user(
    session: SessionDep,
    creds: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
) -> User:
    if creds is None:
        raise _unauthorized()
    try:
        payload = decode_token(creds.credentials, "access")
    except TokenError as e:
        log.info("access token rejected: %s", e)
        raise _unauthorized("Invalid or expired token")
    # Load the user on every request so deactivation takes effect immediately
    # rather than when the access token expires.
    user = await session.get(User, payload["sub"])
    if user is None or not user.is_active:
        raise _unauthorized("Invalid or expired token")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


async def require_admin(user: CurrentUser) -> User:
    if user.role != Role.admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Admin only")
    return user


AdminUser = Annotated[User, Depends(require_admin)]


def require_trusted_origin(request: Request) -> None:
    """CSRF defence for endpoints authenticated by cookie.

    The refresh cookie is already SameSite=Strict; this is a second layer.
    Browsers always send Origin on cross-origin and same-origin POSTs, so a
    missing or unknown Origin is rejected.
    """
    origin = request.headers.get("origin")
    if origin is None or origin not in get_settings().cors_origins:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Untrusted origin")
