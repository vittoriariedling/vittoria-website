#!/usr/bin/env bash
# Dump the database, check the dump is readable, upload it to a private R2
# bucket and delete old copies. Settings live in deploy/backup.env (see
# deploy/backup.env.example). Scheduled with cron; see deploy/README.md.
set -euo pipefail
cd "$(dirname "$0")/.."

set -a
# shellcheck source=/dev/null
. deploy/backup.env
set +a
: "${BACKUP_BUCKET:?set in deploy/backup.env}"
KEEP_DAYS="${KEEP_DAYS:-30}"
LOCAL_DIR="${LOCAL_DIR:-$HOME/backups}"

compose() { docker compose -f compose.yaml -f compose.prod.yaml "$@"; }

umask 077
mkdir -p "$LOCAL_DIR"
stamp=$(date -u +%Y%m%dT%H%M%SZ)
dump="$LOCAL_DIR/db-$stamp.dump"

# shellcheck disable=SC2016  # expanded inside the db container
compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom' > "$dump"
# A dump that pg_restore can't list is broken; fail loudly rather than upload it.
compose exec -T db pg_restore --list < "$dump" > /dev/null

upload="$dump"
if [ -n "${AGE_RECIPIENT:-}" ]; then
  age --recipient "$AGE_RECIPIENT" --output "$dump.age" "$dump"
  upload="$dump.age"
fi

rclone copyto "$upload" "r2:$BACKUP_BUCKET/db/$(basename "$upload")"
rclone delete --min-age "${KEEP_DAYS}d" "r2:$BACKUP_BUCKET/db/"

# Keep a week of copies on the server too.
find "$LOCAL_DIR" -name 'db-*' -mtime +7 -delete
echo "backup ok: $(basename "$upload") ($(du -h "$upload" | cut -f1))"
