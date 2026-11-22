# Personal Website

A private, invite-only personal site: a newsletter, a travel map, a reading list and coding projects, with an admin page for editing all of it.

None of the actual content lives in this repository. Text, photos, books and projects are stored in Postgres and private object storage, and the original files are gitignored.

---

## Development

The site is a React (Vite) frontend and a FastAPI + Postgres backend, all run with Docker Compose.

```
browser ──► web (Vite :5173) ──/api──► api (FastAPI :8000) ──► db (Postgres 17)
   │                                          │
   └──── signed photo URLs ──► storage (S3-compatible, :8333) ◄─┘
```

All content (books, newsletter issues, coding projects, travel map) lives in Postgres and every API endpoint requires login. Photos live in a private S3-compatible bucket (SeaweedFS locally, Cloudflare R2 in production); the API hands the browser signed links that expire, so photos are only viewable by logged-in users.

### First-time setup

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and start it.
2. Create your env file and fill in secrets:
   ```sh
   cp .env.example .env
   # generate each JWT secret (they must differ):
   python -c "import secrets; print(secrets.token_urlsafe(64))"
   ```
3. Start everything:
   ```sh
   docker compose up --build
   ```
   Database migrations run automatically when the API starts.
4. Create your admin account (prompts for a password, min 12 chars):
   ```sh
   docker compose exec api python -m app.cli create-admin --email you@example.com --name "Your Name"
   ```
5. Import your content (see below).

Then open http://localhost:5173 and log in. As an admin you'll see an **Admin** link in the navbar. API docs are at http://localhost:8000/api/docs.

### Editing content (admin page)

The admin page has a tab for each kind of content:

- **Newsletters**: write an issue from sections (paragraphs, subheadings, wide photos, photo + text, rows of up to three photos, quotes), reorder them, and save as a draft. Drafts are only visible to admins (use *Preview*); *Publish* makes it visible to everyone, and new issues show first.
- **Map**: add countries (two-letter ISO codes, e.g. `ES`) or US states, mark them visited or lived, add a description and photo, and link newsletters to them. Renaming a newsletter's URL keeps its map links working.
- **Books**: add or edit books with a half-star rating, review, date read and cover (upload one, or *Find cover by ISBN*). The reading page ranks by rating.
- **Projects**: add or edit coding projects with a main image and extra captioned images, and set the carousel order.
- **People**: invite links, users, and password reset links.

Uploaded photos are resized to WebP with all metadata (including GPS location) removed, and stored privately like the imported ones.

### Importing content

Your newsletters, photos, travel data and site text live in `client/src/assets/`, and books and projects in `content/`. Both folders are gitignored and private. Loading them into the database is two commands:

```sh
docker compose exec web node scripts/export-content.mjs   # read the JS/JSON files -> client/src/assets/_export/content.json
docker compose exec api python -m app.importer            # load into Postgres + upload photos
```

- Safe to re-run any time: photos are de-duplicated by content, and records that already exist are **left alone**, so edits made on the admin page are never overwritten. Only new records from the files are added (site-wide copy such as the landing page text is always updated).
- `--overwrite` replaces existing records with the files' version (this undoes admin-page edits to them).
- Photos are resized (1600px and 640px WebP) and **all metadata is stripped**, including the GPS location phones embed in every photo. Originals are never uploaded.
- Book covers are downloaded once from Open Library / Google Books and stored privately (no hotlinking).
- `--overwrite --prune` also deletes records that aren't in the files, **including anything added on the admin page**; `--skip-covers` skips the cover download.

### Everyday commands

| Task | Command |
|---|---|
| Start / stop | `docker compose up -d` / `docker compose down` |
| API logs | `docker compose logs -f api` |
| Run backend tests | `docker compose exec api pytest` |
| New migration after editing `api/app/models.py` | `docker compose exec api alembic revision --autogenerate -m "describe change"` (then review the file in `api/alembic/versions/`) |
| Apply migrations | `docker compose exec api alembic upgrade head` |
| Postgres shell | `docker compose exec db psql -U app -d app` |
| Re-import content | see *Importing content* above |
| Wipe the database and photos | `docker compose down -v` (deletes all data; re-run `create-admin` and the import) |

### Authentication design

- **Passwords**: Argon2id (64 MiB, t=3, p=4). Hashes upgrade automatically on login if parameters change.
- **Access token**: HS512 JWT, 15 minutes, held only in memory by the frontend and sent as `Authorization: Bearer`.
- **Refresh token**: HS512 JWT, 14 days, in an `HttpOnly; Secure; SameSite=Strict` cookie scoped to `/api/auth`. Each refresh rotates it; re-using an old refresh token revokes that whole session family (theft detection). Cookie endpoints also require a trusted `Origin` header.
  - *Grace window (20s):* if a tab reloads mid-refresh, the browser can lose the new cookie and re-send the old token. Within 20s, and only if the replacement was never used, that's accepted and the orphaned replacement is revoked. Anything else is treated as theft.
- **Frontend** (`client/src/auth/`): the access token is kept only in memory, never in localStorage. Every page except `/login`, `/register` and `/reset-password` requires login. A 401 triggers one automatic refresh and retry. Refreshes are serialized across tabs with the Web Locks API, and logging in or out in one tab updates the others.
- Access and refresh tokens use separate secrets and a `typ` claim so one can't be used as the other.
- **Signup is invite-only.** From the admin account you can create:
  - an *email invite*: single-use, only works for that address
  - a *shareable link*: up to N signups before an expiry date, revocable anytime

  The admin gets the link once at creation (only a hash is stored) and sends it themselves. Email delivery will be added in a later phase.
- **Password resets**: the admin generates a one-time link (valid 24h, newest link only). Using it logs the user out everywhere.
- **Deactivating a user** cuts off access immediately and revokes all their sessions.
- **Rate limits** (in-memory, per API process): login 20/min per IP plus a 15-minute lockout after 5 failed attempts for an email; register 10/hour per IP; invite/reset link checks 30/15min per IP.
- Login, register, refresh, logout and password reset all require a trusted `Origin` header (CSRF and login-CSRF protection).
- **Post-quantum**: only symmetric primitives (Argon2id, HMAC-SHA512) are used for auth, which remain secure against quantum attacks; no RSA/ECDSA signatures. In production, TLS will use hybrid X25519+ML-KEM key exchange.

### Project layout

```
api/            FastAPI backend
  app/          config, db, models, security, routers, media/storage, importer
  alembic/      database migrations
  tests/        pytest suite (runs against the app_test database)
client/src/     React frontend
content/        books and coding projects source data (JSON, gitignored)
scripts/        export-content.mjs (legacy content files -> JSON for the importer)
compose.yaml            base services
compose.override.yaml   local dev additions (auto-loaded)
```
