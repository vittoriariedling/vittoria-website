import time
import uuid
from datetime import timedelta

import jwt
import pytest

from app.config import get_settings
from app.security import (
    TokenError,
    _encode,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)


def test_password_hash_is_argon2id():
    h = hash_password("a very long password")
    assert h.startswith("$argon2id$")
    assert "m=65536,t=3,p=4" in h
    assert verify_password("a very long password", h)[0]
    assert not verify_password("wrong", h)[0]


def test_verify_without_hash_is_false():
    assert verify_password("anything", None) == (False, None)


def test_tokens_are_hs512_and_typed():
    uid = uuid.uuid4()
    access = create_access_token(uid, "member")
    assert jwt.get_unverified_header(access)["alg"] == "HS512"
    assert decode_token(access, "access")["sub"] == uid

    refresh, jti, _ = create_refresh_token(uid, uuid.uuid4())
    assert decode_token(refresh, "refresh")["jti"] == jti


def test_access_token_rejected_as_refresh_and_vice_versa():
    uid = uuid.uuid4()
    with pytest.raises(TokenError):
        decode_token(create_access_token(uid, "member"), "refresh")
    with pytest.raises(TokenError):
        decode_token(create_refresh_token(uid, uuid.uuid4())[0], "access")


def test_expired_token_rejected():
    token, _, _ = _encode("access", uuid.uuid4(), timedelta(seconds=-60), role="member")
    with pytest.raises(TokenError):
        decode_token(token, "access")


def test_small_clock_skew_tolerated_but_not_large():
    s = get_settings()
    secret = s.jwt_access_secret.get_secret_value()

    def token(skew):
        now = int(time.time())
        claims = {"sub": str(uuid.uuid4()), "typ": "access", "jti": str(uuid.uuid4()), "iss": s.jwt_issuer,
                  "aud": s.jwt_audience, "iat": now + skew, "nbf": now + skew, "exp": now + 900}
        return jwt.encode(claims, secret, algorithm="HS512")

    decode_token(token(5), "access")  # issued "5s in the future" by a slightly-off clock
    with pytest.raises(TokenError):
        decode_token(token(60), "access")


def test_alg_none_and_wrong_key_rejected():
    s = get_settings()
    claims = {"sub": str(uuid.uuid4()), "typ": "access", "jti": str(uuid.uuid4()),
              "iss": s.jwt_issuer, "aud": s.jwt_audience, "iat": 0, "nbf": 0, "exp": 9999999999}
    unsigned = jwt.encode(claims, key=None, algorithm="none")
    with pytest.raises(TokenError):
        decode_token(unsigned, "access")
    forged = jwt.encode(claims, "x" * 100, algorithm="HS512")
    with pytest.raises(TokenError):
        decode_token(forged, "access")


def test_wrong_audience_rejected():
    s = get_settings()
    claims = {"sub": str(uuid.uuid4()), "typ": "access", "jti": str(uuid.uuid4()),
              "iss": s.jwt_issuer, "aud": "someone-else", "iat": 0, "nbf": 0, "exp": 9999999999}
    token = jwt.encode(claims, s.jwt_access_secret.get_secret_value(), algorithm="HS512")
    with pytest.raises(TokenError):
        decode_token(token, "access")
