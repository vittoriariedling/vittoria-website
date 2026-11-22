import time
import urllib.error
import urllib.request

import pytest
from sqlalchemy import func, select

from app import storage
from app.media import image_json, process_image, store_image
from app.models import Media
from tests.images import GPS_IFD, jpeg, open_bytes, png_with_alpha

INTERNAL = "http://storage:8333"


def _get(url: str) -> bytes:
    with urllib.request.urlopen(url, timeout=10) as r:
        return r.read()


@pytest.fixture(scope="module", autouse=True)
def _bucket():
    storage.ensure_bucket()


def test_original_test_image_really_has_gps():
    assert open_bytes(jpeg(gps=True)).getexif().get_ifd(GPS_IFD)


def test_processing_strips_all_metadata_including_gps():
    p = process_image(jpeg(gps=True))
    for data in (p.lg, p.sm):
        img = open_bytes(data)
        assert img.format == "WEBP"
        assert len(img.getexif()) == 0
        assert "exif" not in img.info and "xmp" not in img.info


def test_processing_resizes_to_two_variants():
    p = process_image(jpeg(size=(4032, 3024)))
    assert (p.width, p.height) == (1600, 1200)
    assert open_bytes(p.lg).size == (1600, 1200)
    assert max(open_bytes(p.sm).size) == 640
    small = process_image(jpeg(size=(300, 200)))
    assert (small.width, small.height) == (300, 200)  # never upscaled


def test_processing_applies_exif_rotation():
    # Orientation 6 = "rotate 90° CW to display": a landscape file shown as portrait.
    p = process_image(jpeg(size=(2000, 1000), orientation=6))
    assert p.width < p.height


def test_processing_keeps_transparency():
    assert open_bytes(process_image(png_with_alpha()).lg).mode == "RGBA"


async def test_store_image_uploads_and_dedupes(session):
    data = jpeg(gps=True, color=(1, 2, 3))
    first = await store_image(session, data, "IMG_0001.jpg")
    second = await store_image(session, data, "copy.jpg")
    await session.commit()
    assert first.id == second.id
    assert await session.scalar(select(func.count()).select_from(Media)) == 1

    body = _get(storage.signed_url(first.key_lg, base_url=INTERNAL))
    assert len(open_bytes(body).getexif()) == 0


async def test_signed_urls_are_stable_scoped_and_expire(session):
    media = await store_image(session, jpeg(color=(9, 9, 9)), "x.jpg")
    await session.commit()
    url = storage.signed_url(media.key_lg, base_url=INTERNAL)
    assert url == storage.signed_url(media.key_lg, base_url=INTERNAL)  # cacheable

    for bad in (
        url.replace("lg.webp", "sm.webp"),  # signature is for one object only
        storage.signed_url(media.key_lg, base_url=INTERNAL, now=time.time() - 3 * 86400),  # expired
        f"{INTERNAL}/test-media/{media.key_lg}",  # unsigned
    ):
        with pytest.raises(urllib.error.HTTPError) as e:
            _get(bad)
        assert e.value.code == 403


async def test_image_json_sizes(session):
    media = await store_image(session, jpeg(size=(4000, 2000)), "wide.jpg")
    lg, sm = image_json(media), image_json(media, "sm")
    assert (lg["width"], lg["height"]) == (1600, 800)
    assert (sm["width"], sm["height"]) == (640, 320)
    assert "lg.webp" in lg["src"] and "sm.webp" in sm["src"]
    assert lg["src"].startswith("http://localhost:8333/test-media/")
    assert image_json(None) is None
