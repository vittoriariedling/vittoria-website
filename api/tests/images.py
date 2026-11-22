"""Helpers for generating test images in memory."""

import io

from PIL import Image

GPS_IFD = 0x8825
ORIENTATION = 0x0112


def jpeg(size=(3000, 2000), color=(200, 80, 120), gps=False, orientation=None) -> bytes:
    img = Image.new("RGB", size, color)
    exif = Image.Exif()
    exif[0x010F] = "TestCam"  # Make
    if orientation:
        exif[ORIENTATION] = orientation
    if gps:
        exif[GPS_IFD] = {1: "N", 2: (40.0, 25.0, 0.0), 3: "W", 4: (3.0, 42.0, 0.0)}  # somewhere in Europe
    buf = io.BytesIO()
    img.save(buf, "JPEG", exif=exif.tobytes())
    return buf.getvalue()


def png_with_alpha(size=(800, 400)) -> bytes:
    img = Image.new("RGBA", size, (0, 128, 255, 100))
    buf = io.BytesIO()
    img.save(buf, "PNG")
    return buf.getvalue()


def open_bytes(data: bytes) -> Image.Image:
    return Image.open(io.BytesIO(data))
