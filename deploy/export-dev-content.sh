#!/usr/bin/env bash
# Run on YOUR COMPUTER, with the dev stack running (`docker compose up`).
#
#   1. Dumps the dev database to migration/dev.dump. Copy that file to the
#      server and run deploy/import-content.sh there.
#   2. Copies every photo and video from local storage (SeaweedFS) straight
#      into the R2 photos bucket.
#
# R2 settings come from deploy/migrate.env (see deploy/migrate.env.example).
set -euo pipefail
cd "$(dirname "$0")/.."
export MSYS_NO_PATHCONV=1  # Git Bash on Windows: don't rewrite docker arguments

RCLONE_IMAGE=rclone/rclone:1.76@sha256:7cbeec24a44f206067597c0368be4de90ae19a64d5113c7d1938bd737a81e466

set -a
# shellcheck source=/dev/null
. deploy/migrate.env
set +a
: "${R2_ENDPOINT:?set in deploy/migrate.env}" "${R2_BUCKET:?}" "${R2_ACCESS_KEY_ID:?}" "${R2_SECRET_ACCESS_KEY:?}"

# ── 1. Database ──────────────────────────────────────────────────────
mkdir -p migration
dump=migration/dev.dump
# shellcheck disable=SC2016  # expanded inside the db container
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --no-owner' > "$dump"
docker compose exec -T db pg_restore --list < "$dump" > /dev/null
echo "Database dumped to $dump ($(du -h "$dump" | cut -f1))"

# ── 2. Photos ────────────────────────────────────────────────────────
storage=$(docker compose ps -q storage)
[ -n "$storage" ] || { echo "The dev storage container isn't running." >&2; exit 1; }
DEV_KEY=$(docker compose exec -T storage printenv S3_ACCESS_KEY | tr -d '\r')
DEV_SECRET=$(docker compose exec -T storage printenv S3_SECRET_KEY | tr -d '\r')
DEV_BUCKET=$(docker compose exec -T api printenv S3_BUCKET | tr -d '\r')
export RCLONE_CONFIG_DEV_TYPE=s3 RCLONE_CONFIG_DEV_PROVIDER=SeaweedFS
export RCLONE_CONFIG_DEV_ENDPOINT=http://localhost:8333
export RCLONE_CONFIG_DEV_ACCESS_KEY_ID="$DEV_KEY" RCLONE_CONFIG_DEV_SECRET_ACCESS_KEY="$DEV_SECRET"
export RCLONE_CONFIG_R2_TYPE=s3 RCLONE_CONFIG_R2_PROVIDER=Cloudflare RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true
export RCLONE_CONFIG_R2_ENDPOINT="$R2_ENDPOINT"
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID" RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"

rclone() {
  # Shares the storage container's network so localhost:8333 is SeaweedFS.
  # Credentials are passed by name (-e VAR), so they never appear in `ps`.
  docker run --rm --network "container:$storage" \
    -e RCLONE_CONFIG_DEV_TYPE -e RCLONE_CONFIG_DEV_PROVIDER -e RCLONE_CONFIG_DEV_ENDPOINT \
    -e RCLONE_CONFIG_DEV_ACCESS_KEY_ID -e RCLONE_CONFIG_DEV_SECRET_ACCESS_KEY \
    -e RCLONE_CONFIG_R2_TYPE -e RCLONE_CONFIG_R2_PROVIDER -e RCLONE_CONFIG_R2_NO_CHECK_BUCKET \
    -e RCLONE_CONFIG_R2_ENDPOINT -e RCLONE_CONFIG_R2_ACCESS_KEY_ID -e RCLONE_CONFIG_R2_SECRET_ACCESS_KEY \
    "$RCLONE_IMAGE" --config "" "$@"
}

echo "Copying photos from dev:$DEV_BUCKET to r2:$R2_BUCKET ..."
# --metadata keeps each file's Content-Type and Cache-Control.
rclone copy --metadata --transfers 8 --stats-one-line --stats 10s "dev:$DEV_BUCKET" "r2:$R2_BUCKET"
echo "Local:"; rclone size "dev:$DEV_BUCKET"
echo "R2:";    rclone size "r2:$R2_BUCKET"
echo
echo "Next: scp $dump deploy@<server>:~/ and run ./deploy/import-content.sh ~/dev.dump on the server."
