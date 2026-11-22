"""S3-compatible object storage for media (SeaweedFS in dev, Cloudflare R2 in prod).

The bucket is private. Browsers get photos through short-lived signed URLs
that the API puts into its JSON responses; `<img>` tags can't send our
Authorization header, so this is how login-gated images work.
"""

import hashlib
import hmac
import time
from functools import lru_cache
from urllib.parse import quote, urlsplit

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

from app.config import get_settings

# Objects are content-addressed (the key includes a hash), so they never change.
CACHE_CONTROL = "private, max-age=31536000, immutable"


@lru_cache
def _client():
    s = get_settings()
    return boto3.client(
        "s3",
        endpoint_url=s.s3_endpoint_url,
        region_name=s.s3_region,
        aws_access_key_id=s.s3_access_key,
        aws_secret_access_key=s.s3_secret_key.get_secret_value(),
        config=Config(s3={"addressing_style": "path"}, signature_version="s3v4"),
    )


def ensure_bucket() -> None:
    bucket = get_settings().s3_bucket
    try:
        _client().head_bucket(Bucket=bucket)
    except ClientError:
        _client().create_bucket(Bucket=bucket)


def put(key: str, data: bytes, content_type: str) -> None:
    _client().put_object(
        Bucket=get_settings().s3_bucket, Key=key, Body=data,
        ContentType=content_type, CacheControl=CACHE_CONTROL,
    )


# ── Signed GET URLs ──────────────────────────────────────────────────
#
# A hand-rolled AWS SigV4 query-string presign (the same scheme boto3 uses),
# so we can pin the signing time to the start of a time window. Every request
# in that window gets the *identical* URL, so the browser cache works; a
# boto3-generated URL changes every second and would re-download each photo
# on every page view.


def _hmac(key: bytes, msg: str) -> bytes:
    return hmac.new(key, msg.encode(), hashlib.sha256).digest()


def signed_url(key: str, *, now: float | None = None, base_url: str | None = None) -> str:
    s = get_settings()
    window = s.media_url_window_hours * 3600
    signed_at = int((time.time() if now is None else now) // window * window)
    amz_date = time.strftime("%Y%m%dT%H%M%SZ", time.gmtime(signed_at))
    datestamp = amz_date[:8]

    base = urlsplit(base_url or s.s3_public_url)
    host = base.netloc
    path = f"{base.path.rstrip('/')}/{quote(s.s3_bucket, safe='')}/{quote(key, safe='/')}"
    scope = f"{datestamp}/{s.s3_region}/s3/aws4_request"
    params = {
        "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
        "X-Amz-Credential": f"{s.s3_access_key}/{scope}",
        "X-Amz-Date": amz_date,
        "X-Amz-Expires": str(2 * window),
        "X-Amz-SignedHeaders": "host",
    }
    query = "&".join(f"{quote(k, safe='')}={quote(v, safe='')}" for k, v in sorted(params.items()))
    canonical_request = "\n".join(["GET", path, query, f"host:{host}\n", "host", "UNSIGNED-PAYLOAD"])
    string_to_sign = "\n".join(
        ["AWS4-HMAC-SHA256", amz_date, scope, hashlib.sha256(canonical_request.encode()).hexdigest()]
    )
    k = _hmac(("AWS4" + s.s3_secret_key.get_secret_value()).encode(), datestamp)
    for part in (s.s3_region, "s3", "aws4_request"):
        k = _hmac(k, part)
    signature = hmac.new(k, string_to_sign.encode(), hashlib.sha256).hexdigest()
    return f"{base.scheme}://{host}{path}?{query}&X-Amz-Signature={signature}"
