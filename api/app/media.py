"""Image processing and media URLs.

Every image is re-encoded to WebP in two sizes. Re-encoding strips all
metadata: phone photos carry EXIF, including the GPS coordinates of where
they were taken, which must never reach the site. The colour profile is kept
so iPhone (Display P3) photos don't look washed out.
"""

import asyncio
import hashlib
import io
import uuid
import warnings
from collections.abc import Iterable
from dataclasses import dataclass

from PIL import Image, ImageOps
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import storage
from app.models import Media

LG_MAX = 1600
SM_MAX = 640
WEBP_QUALITY = 82
# Refuse absurdly large images (decompression bombs): ~50 megapixels is plenty.
Image.MAX_IMAGE_PIXELS = 50_000_000


class BadImage(ValueError):
    pass


@dataclass
class Processed:
    lg: bytes
    sm: bytes
    width: int
    height: int


def _encode(img: Image.Image, max_px: int, icc: bytes | None) -> tuple[bytes, tuple[int, int]]:
    im = img.copy()
    im.thumbnail((max_px, max_px), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    # No exif=/xmp= arguments, so none is written.
    im.save(buf, "WEBP", quality=WEBP_QUALITY, method=4, icc_profile=icc or b"")
    return buf.getvalue(), im.size


def process_image(data: bytes) -> Processed:
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            return _process(data)
    except (OSError, SyntaxError, ValueError, Image.DecompressionBombError, Image.DecompressionBombWarning) as e:
        raise BadImage(f"Not a usable image: {e}") from e


def _process(data: bytes) -> Processed:
    with Image.open(io.BytesIO(data)) as raw:
        icc = raw.info.get("icc_profile")
        img = ImageOps.exif_transpose(raw)  # apply rotation before dropping EXIF
        has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
        img = img.convert("RGBA" if has_alpha else "RGB")
        lg, (w, h) = _encode(img, LG_MAX, icc)
        sm, _ = _encode(img, SM_MAX, icc)
    return Processed(lg=lg, sm=sm, width=w, height=h)


def sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def process_and_upload(data: bytes, original_name: str, uploaded_by: uuid.UUID | None = None) -> Media:
    """CPU + network work, safe to run in a worker thread. Returns an unsaved Media row."""
    sha = sha256_hex(data)
    p = process_image(data)
    prefix = f"media/{sha[:2]}/{sha}"
    key_lg, key_sm = f"{prefix}/lg.webp", f"{prefix}/sm.webp"
    storage.put(key_lg, p.lg, "image/webp")
    storage.put(key_sm, p.sm, "image/webp")
    return Media(sha256=sha, original_name=original_name[:255], width=p.width, height=p.height,
                 key_lg=key_lg, key_sm=key_sm, bytes_lg=len(p.lg), uploaded_by=uploaded_by)


async def store_image(
    session: AsyncSession, data: bytes, original_name: str, uploaded_by: uuid.UUID | None = None
) -> Media:
    """Process and upload an image, or return the existing row for identical bytes."""
    existing = await session.scalar(select(Media).where(Media.sha256 == sha256_hex(data)))
    if existing:
        return existing
    media = await asyncio.to_thread(process_and_upload, data, original_name, uploaded_by)
    session.add(media)
    await session.flush()
    return media


# ── Serving ──────────────────────────────────────────────────────────


def image_json(media: Media | None, size: str = "lg") -> dict | None:
    """{src, width, height} for a media row; dimensions let the page reserve space."""
    if media is None:
        return None
    if size == "sm":
        scale = min(1.0, SM_MAX / max(media.width, media.height))
        return {"src": storage.signed_url(media.key_sm),
                "width": round(media.width * scale), "height": round(media.height * scale)}
    return {"src": storage.signed_url(media.key_lg), "width": media.width, "height": media.height}


async def load_media(session: AsyncSession, ids: Iterable[uuid.UUID | str | None]) -> dict[uuid.UUID, Media]:
    wanted = {uuid.UUID(str(i)) for i in ids if i}
    if not wanted:
        return {}
    rows = await session.scalars(select(Media).where(Media.id.in_(wanted)))
    return {m.id: m for m in rows}


def _get(media_map: dict[uuid.UUID, Media], media_id) -> Media | None:
    return media_map.get(uuid.UUID(str(media_id))) if media_id else None


def resolve_image(media_map, media_id, size: str = "lg") -> dict | None:
    return image_json(_get(media_map, media_id), size)
