"""Import the site's legacy content into Postgres + object storage.

    docker compose exec web node scripts/export-content.mjs   # 1. JS/JSON -> content.json
    docker compose exec api python -m app.importer            # 2. content.json -> database

Safe to re-run: records are matched by their natural keys (Goodreads id,
project id, country/state code, post slug) and photos are de-duplicated by
content hash. Existing records are left alone, so edits made on the admin
page are never overwritten; pass --overwrite to replace them with the files'
version (and --prune to also delete records that aren't in the files).
"""

import argparse
import asyncio
import json
import mimetypes
import os
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime
from pathlib import Path
from typing import Any

from sqlalchemy import delete, select, text
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app import storage
from app.countries import ALPHA3_TO_ALPHA2
from app.db import SessionLocal, engine
from app.media import process_and_upload, sha256_hex, store_image
from app.models import Book, Media, Place, PlaceKind, PlaceStatus, Post, Project, SiteContent

USER_AGENT = "personal-website-importer/1.0"
POST_FIELDS = {"id", "title", "date", "slug", "region", "tags", "previewDescription", "sections",
               "heroImage", "heroAlt", "coverPhoto", "coverAlt", "coverCaption", "position"}


class ImportFailed(Exception):
    pass


def log(msg: str) -> None:
    print(msg, flush=True)


# ── Images ───────────────────────────────────────────────────────────


class Images:
    """Resolves image references from content.json to Media ids.

    References are {"$image": "relative/path.jpg"} (from JS imports) or bare
    filenames relative to a per-collection folder (e.g. coding projects).
    """

    def __init__(self, assets: Path):
        self.assets = assets.resolve()
        self.ids: dict[Path, Any] = {}
        self.warned: set[str] = set()

    def path_for(self, ref: Any, folder: str = "") -> Path | None:
        if ref is None or ref == "":
            return None
        if isinstance(ref, str) and ref.startswith(("http://", "https://")):
            if ref not in self.warned:
                log(f"    note: skipping external image URL {ref} (only local files are imported)")
                self.warned.add(ref)
            return None
        if isinstance(ref, dict) and "$image" in ref:
            rel = ref["$image"]
        elif isinstance(ref, str):
            rel = f"{folder}/{ref}" if folder else ref
        else:
            raise ImportFailed(f"unsupported image reference: {ref!r}")
        path = (self.assets / rel).resolve()
        if not path.is_relative_to(self.assets):
            raise ImportFailed(f"image path escapes the assets folder: {rel}")
        if not path.is_file():
            raise ImportFailed(f"image not found: {rel}")
        return path

    async def ingest(self, session: AsyncSession, paths: set[Path]) -> None:
        """Process + upload every new image in parallel, then record them."""
        data = {p: p.read_bytes() for p in paths}
        shas = {p: sha256_hex(b) for p, b in data.items()}
        existing = {m.sha256: m.id for m in await session.scalars(
            select(Media).where(Media.sha256.in_(set(shas.values()))))}

        todo: dict[str, Path] = {}
        for p, sha in shas.items():
            if sha not in existing:
                todo.setdefault(sha, p)  # same photo in two folders: process once
        unique = len(set(shas.values()))
        log(f"  images: {unique} unique photos referenced, {unique - len(todo)} already stored, {len(todo)} to process")

        started = time.monotonic()
        with ThreadPoolExecutor(max_workers=min(8, (os.cpu_count() or 2))) as pool:
            futures = {sha: pool.submit(process_and_upload, data[p], p.name) for sha, p in todo.items()}
            for i, (sha, fut) in enumerate(futures.items(), 1):
                try:
                    media = fut.result()
                except Exception as e:
                    raise ImportFailed(f"could not process {todo[sha].relative_to(self.assets)}: {e}") from e
                session.add(media)
                await session.flush()
                existing[sha] = media.id
                if i % 25 == 0 or i == len(futures):
                    log(f"    {i}/{len(futures)} processed ({time.monotonic() - started:.0f}s)")
        self.ids.update({p: existing[shas[p]] for p in paths})

    def id(self, ref: Any, folder: str = ""):
        path = self.path_for(ref, folder)
        return self.ids[path] if path else None


# ── Book covers ──────────────────────────────────────────────────────


def _fetch(url: str, timeout: float = 10) -> tuple[int, bytes]:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read()
    except Exception:
        return 0, b""


def fetch_cover(isbn13: str) -> bytes | None:
    """Open Library first, then Google Books. Returns image bytes or None."""
    status, body = _fetch(f"https://covers.openlibrary.org/b/isbn/{isbn13}-L.jpg?default=false")
    if status == 200 and len(body) > 1000:
        return body
    status, body = _fetch(
        f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn13}&fields=items/volumeInfo/imageLinks")
    try:
        links = json.loads(body)["items"][0]["volumeInfo"]["imageLinks"]
    except Exception:
        return None
    url = links.get("thumbnail") or links.get("smallThumbnail")
    if not url:
        return None
    url = url.replace("http://", "https://").replace("&zoom=1", "").replace("zoom=1&", "")
    status, body = _fetch(url)
    return body if status == 200 and len(body) > 1000 else None


# ── Helpers ──────────────────────────────────────────────────────────


async def upsert(session: AsyncSession, model, key: list[str], rows: list[dict], overwrite: bool = True) -> int:
    """Insert rows; existing ones (same key) are updated if `overwrite`, else skipped.
    Returns how many rows were written."""
    written = 0
    for row in rows:
        stmt = insert(model).values(**row)
        if overwrite:
            stmt = stmt.on_conflict_do_update(
                index_elements=key, set_={k: stmt.excluded[k] for k in row if k not in key})
        else:
            stmt = stmt.on_conflict_do_nothing(index_elements=key)
        written += (await session.execute(stmt)).rowcount
    return written


def country_code(code: str) -> str:
    """Two-letter ISO code; older data used three-letter codes (ESP -> ES)."""
    code = code.strip().upper()
    if len(code) == 3:
        if code not in ALPHA3_TO_ALPHA2:
            raise ImportFailed(f"unknown country code {code!r}; use the two-letter ISO code")
        return ALPHA3_TO_ALPHA2[code]
    return code


def parse_date(value: str | None) -> date | None:
    if not value:
        return None
    for fmt in ("%Y/%m/%d", "%Y-%m-%d"):
        try:
            return datetime.strptime(value, fmt).date()
        except ValueError:
            pass
    raise ImportFailed(f"unrecognised date: {value!r}")


def convert_sections(sections: list[dict], images: Images) -> list[dict]:
    out = []
    for s in sections:
        s = dict(s)
        if "src" in s:
            s["media_id"] = str(images.id(s.pop("src")))
        if "photos" in s:
            s["photos"] = [
                {**{k: v for k, v in p.items() if k != "src"}, "media_id": str(images.id(p.get("src")))}
                for p in s["photos"]
            ]
        out.append(s)
    return out


def _walk_refs(obj, key: str):
    """Yield every {key: ...} reference dict nested anywhere in obj."""
    if isinstance(obj, dict):
        if key in obj:
            yield obj
        else:
            for v in obj.values():
                yield from _walk_refs(v, key)
    elif isinstance(obj, list):
        for v in obj:
            yield from _walk_refs(v, key)


def upload_file(path: Path) -> dict:
    """Upload a file as-is (e.g. a video), content-addressed. Thread-safe."""
    data = path.read_bytes()
    sha = sha256_hex(data)
    content_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    key = f"site/{sha[:2]}/{sha}{path.suffix.lower()}"
    storage.put(key, data, content_type)
    return {"storage_key": key, "content_type": content_type}


def convert_site(obj, images: Images, files: dict[str, dict]):
    if isinstance(obj, dict):
        if "$image" in obj:
            return {"media_id": str(images.id(obj))}
        if "$file" in obj:
            return files[obj["$file"]]
        return {k: convert_site(v, images, files) for k, v in obj.items()}
    if isinstance(obj, list):
        return [convert_site(v, images, files) for v in obj]
    return obj


def collect_refs(content: dict, images: Images) -> set[Path]:
    paths: set[Path] = set()

    def add(ref, folder=""):
        if (p := images.path_for(ref, folder)) is not None:
            paths.add(p)

    for ref in _walk_refs(content.get("site") or {}, "$image"):
        add(ref)

    for proj in content["projects"]:
        add(proj.get("imageURL"), "coding projects")
        for extra in proj.get("extraImages") or []:
            add(extra.get("src"), "coding projects")
    for place in content["countries"] + content["states"]:
        add(place.get("photo"))
    for post in content["posts"]:
        add(post.get("heroImage"))
        add(post.get("coverPhoto"))
        for s in post.get("sections", []):
            add(s.get("src"))
            for p in s.get("photos") or []:
                add(p.get("src"))
    return paths


# ── Import ───────────────────────────────────────────────────────────


async def run(assets: Path, skip_covers: bool, prune: bool, overwrite: bool = False) -> None:
    if prune and not overwrite:
        raise ImportFailed("--prune deletes anything added on the admin page; it needs --overwrite too")
    export = assets / "_export" / "content.json"
    if not export.is_file():
        raise ImportFailed(f"{export} not found. Run `docker compose exec web node scripts/export-content.mjs` first.")
    content = json.loads(export.read_text(encoding="utf-8"))
    log(f"Importing {export} (exported {content.get('exportedAt')})")

    await asyncio.to_thread(storage.ensure_bucket)
    images = Images(assets)

    async with SessionLocal() as session:
        # Photos first, so everything else can reference them.
        await images.ingest(session, collect_refs(content, images))
        await session.commit()

        # Books
        n = await upsert(session, Book, ["goodreads_id"], overwrite=overwrite, rows=[{
            "goodreads_id": str(b["id"]),
            "title": b["title"].strip(),
            "author": b["author"].strip(),
            "isbn13": (b.get("isbn13") or "").strip() or None,
            "rating": b["rating"],
            "review": (b.get("review") or "").strip(),
            "date_read": parse_date(b.get("dateRead")),
        } for b in content["books"]])
        await session.commit()
        log(f"  books: {n} of {len(content['books'])} written")

        if not skip_covers:
            need = (await session.scalars(
                select(Book).where(Book.cover_media_id.is_(None), Book.isbn13.is_not(None)))).all()
            if need:
                log(f"  fetching {len(need)} book covers (Open Library, then Google Books)...")
                with ThreadPoolExecutor(max_workers=8) as pool:
                    covers = list(pool.map(fetch_cover, [b.isbn13 for b in need]))
                found = 0
                for book, data in zip(need, covers):
                    if data:
                        try:
                            book.cover_media_id = (await store_image(session, data, f"cover-{book.isbn13}.jpg")).id
                            found += 1
                        except Exception as e:
                            log(f"    skipped cover for {book.title!r}: {e}")
                await session.commit()
                log(f"  covers: {found} found, {len(need) - found} unavailable")

        # Coding projects
        n = await upsert(session, Project, ["id"], overwrite=overwrite, rows=[{
            "id": int(p["id"]),
            "title": p["title"],
            "tag": p.get("tag") or "",
            "description": p.get("description") or "",
            "long_description": p.get("longDescription"),
            "github_url": p.get("githubURL"),
            "year": str(p["year"]) if p.get("year") else None,
            "tech": p["tech"] if isinstance(p.get("tech"), list) else
                    [t.strip() for t in p["tech"].split(",")] if p.get("tech") else [],
            "team": p.get("team"),
            "image_media_id": images.id(p.get("imageURL"), "coding projects"),
            "extra_images": [{"media_id": str(images.id(e.get("src"), "coding projects")),
                              "caption": e.get("caption")} for e in p.get("extraImages") or []],
            "position": i,
        } for i, p in enumerate(content["projects"])])
        # Keep the id sequence ahead of the imported ids for future inserts.
        await session.execute(text(
            "SELECT setval(pg_get_serial_sequence('projects', 'id'), GREATEST((SELECT MAX(id) FROM projects), 1))"))
        await session.commit()
        log(f"  projects: {n} of {len(content['projects'])} written")

        # Travel map
        place_rows = [{
            "kind": kind, "code": country_code(p["id"]) if kind == PlaceKind.country else p["id"], "name": p["name"], "continent": p.get("continent"),
            "status": PlaceStatus(p.get("status", "visited")), "description": p.get("description") or "",
            "newsletter_slugs": [s for s in p.get("newsletterSlugs") or [] if s],
            "photo_media_id": images.id(p.get("photo")),
        } for kind, places in ((PlaceKind.country, content["countries"]), (PlaceKind.state, content["states"]))
          for p in places]
        n = await upsert(session, Place, ["kind", "code"], place_rows, overwrite)
        await session.commit()
        log(f"  places: {n} of {len(place_rows)} written")

        # Newsletter posts
        post_rows = []
        for p in content["posts"]:
            unknown = set(p) - POST_FIELDS
            if unknown:
                log(f"    note: post {p['slug']!r} has fields the site doesn't use: {sorted(unknown)}")
            post_rows.append({
                "slug": p["slug"],
                "title": p["title"],
                "date_label": p.get("date") or "",
                "position": p["position"],
                "region": p.get("region"),
                "tags": p.get("tags") or [],
                "preview_description": p.get("previewDescription"),
                "hero_media_id": images.id(p.get("heroImage")),
                "hero_alt": p.get("heroAlt"),
                "cover_media_id": images.id(p.get("coverPhoto")),
                "cover_alt": p.get("coverAlt"),
                "cover_caption": p.get("coverCaption"),
                "sections": convert_sections(p.get("sections", []), images),
            })
        n = await upsert(session, Post, ["slug"], post_rows, overwrite)
        await session.commit()
        log(f"  posts: {n} of {len(post_rows)} written")

        # Site-wide copy (landing page, page intros...) + its files
        if site := content.get("site"):
            files = {}
            for ref in _walk_refs(site, "$file"):
                rel = ref["$file"]
                if rel not in files:
                    path = images.path_for({"$image": rel})  # same safety checks
                    files[rel] = await asyncio.to_thread(upload_file, path)
            await upsert(session, SiteContent, ["id"], [{"id": 1, "data": convert_site(site, images, files)}])
            await session.commit()
            log(f"  site content: {len(site)} sections, {len(files)} files")

        if prune:
            removed = 0
            for model, col, keep in (
                (Book, Book.goodreads_id, {str(b["id"]) for b in content["books"]}),
                (Project, Project.id, {int(p["id"]) for p in content["projects"]}),
                (Post, Post.slug, {p["slug"] for p in content["posts"]}),
            ):
                removed += (await session.execute(delete(model).where(col.not_in(keep)))).rowcount
            keep_places = {(r["kind"], r["code"]) for r in place_rows}
            for place in (await session.scalars(select(Place))).all():
                if (place.kind, place.code) not in keep_places:
                    await session.delete(place)
                    removed += 1
            await session.commit()
            log(f"  pruned {removed} records no longer in the export")

    await engine.dispose()
    log("Done.")


def main() -> None:
    parser = argparse.ArgumentParser(prog="python -m app.importer", description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--assets", type=Path, default=Path("/import/assets"),
                        help="folder containing _export/content.json and the photos (default: /import/assets)")
    parser.add_argument("--skip-covers", action="store_true", help="don't fetch book covers from the internet")
    parser.add_argument("--overwrite", action="store_true",
                        help="replace existing records with the files' version (undoes admin-page edits)")
    parser.add_argument("--prune", action="store_true",
                        help="with --overwrite: also delete books/projects/posts/places not in the files")
    args = parser.parse_args()
    try:
        asyncio.run(run(args.assets, args.skip_covers, args.prune, args.overwrite))
    except ImportFailed as e:
        sys.exit(f"Import failed: {e}")


if __name__ == "__main__":
    main()
