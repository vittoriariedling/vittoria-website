"""Password hashing and token primitives.

Post-quantum notes:
- Argon2id is a symmetric, memory-hard KDF. Quantum computers give at best a
  Grover-style (quadratic) speedup, which these parameters easily absorb.
- JWTs are signed with HS512 (HMAC-SHA512), a symmetric MAC that remains
  secure against quantum attackers. We deliberately avoid RS*/ES*/EdDSA,
  which Shor's algorithm breaks. Only this API signs and verifies tokens,
  so there is no need for public-key signatures.
"""

import hashlib
import secrets
import uuid
from datetime import UTC, datetime, timedelta
from typing import Any, Literal

import jwt
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher

from app.config import get_settings

JWT_ALGORITHM = "HS512"
CLOCK_SKEW_SECONDS = 10
TokenType = Literal["access", "refresh"]

PASSWORD_MIN_LENGTH = 12
# Upper bound keeps a single login request from being a CPU/memory DoS.
PASSWORD_MAX_LENGTH = 128

# Above the OWASP minimum (19 MiB, t=2). Tune memory_cost to your server.
_password_hash = PasswordHash(
    (Argon2Hasher(time_cost=3, memory_cost=64 * 1024, parallelism=4),)
)

# Verified against when the email doesn't exist, so a login for an unknown
# account takes as long as one for a real account (no user enumeration).
_DUMMY_HASH = _password_hash.hash(secrets.token_urlsafe(32))


def utcnow() -> datetime:
    return datetime.now(UTC)


# ── Passwords ────────────────────────────────────────────────────────


def hash_password(password: str) -> str:
    return _password_hash.hash(password)


def verify_password(password: str, password_hash: str | None) -> tuple[bool, str | None]:
    """Return (is_valid, new_hash_if_params_changed).

    Always performs a full Argon2 verification, even when there is no stored
    hash, to keep timing uniform.
    """
    if password_hash is None:
        _password_hash.verify(password, _DUMMY_HASH)
        return False, None
    return _password_hash.verify_and_update(password, password_hash)


# ── Opaque tokens (invites, password resets) ─────────────────────────


def generate_opaque_token() -> str:
    return secrets.token_urlsafe(32)  # 256 bits


def hash_opaque_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


# ── JWTs ─────────────────────────────────────────────────────────────


class TokenError(Exception):
    pass


def _secret(typ: TokenType) -> str:
    s = get_settings()
    secret = s.jwt_access_secret if typ == "access" else s.jwt_refresh_secret
    return secret.get_secret_value()


def _encode(typ: TokenType, sub: uuid.UUID, ttl: timedelta, **claims: Any) -> tuple[str, uuid.UUID, datetime]:
    s = get_settings()
    now = utcnow()
    jti = claims.pop("jti", None) or uuid.uuid4()
    exp = now + ttl
    payload = {
        "iss": s.jwt_issuer,
        "aud": s.jwt_audience,
        "sub": str(sub),
        "typ": typ,
        "jti": str(jti),
        "iat": now,
        "nbf": now,
        "exp": exp,
        **claims,
    }
    return jwt.encode(payload, _secret(typ), algorithm=JWT_ALGORITHM), jti, exp


def create_access_token(user_id: uuid.UUID, role: str) -> str:
    ttl = timedelta(minutes=get_settings().access_token_ttl_minutes)
    token, _, _ = _encode("access", user_id, ttl, role=role)
    return token


def create_refresh_token(user_id: uuid.UUID, family_id: uuid.UUID) -> tuple[str, uuid.UUID, datetime]:
    """Return (token, jti, expires_at)."""
    ttl = timedelta(days=get_settings().refresh_token_ttl_days)
    return _encode("refresh", user_id, ttl, fam=str(family_id))


def decode_token(token: str, typ: TokenType) -> dict[str, Any]:
    """Verify signature, algorithm, issuer, audience, expiry and token type.

    Access and refresh tokens use different secrets *and* carry a `typ`
    claim, so one can never be accepted as the other.
    """
    s = get_settings()
    try:
        payload = jwt.decode(
            token,
            _secret(typ),
            algorithms=[JWT_ALGORITHM],  # pinned: rejects "none" and alg swaps
            audience=s.jwt_audience,
            issuer=s.jwt_issuer,
            options={"require": ["exp", "iat", "nbf", "sub", "jti", "typ", "iss", "aud"]},
            # Tolerate small clock differences (VM clock jumps, multiple servers)
            # so a fresh token isn't rejected as "not yet valid".
            leeway=CLOCK_SKEW_SECONDS,
        )
    except jwt.PyJWTError as e:
        raise TokenError(str(e)) from e
    if payload.get("typ") != typ:
        raise TokenError("wrong token type")
    try:
        payload["sub"] = uuid.UUID(payload["sub"])
        payload["jti"] = uuid.UUID(payload["jti"])
        if typ == "refresh":
            payload["fam"] = uuid.UUID(payload["fam"])
    except (KeyError, ValueError) as e:
        raise TokenError("malformed claims") from e
    return payload
