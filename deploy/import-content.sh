#!/usr/bin/env bash
# Run on the SERVER. Replaces the production database with a dump of your
# dev database (made by deploy/export-dev-content.sh on your computer).
#
#   ./deploy/import-content.sh ~/dev.dump
#
# Your account comes across too, so log in with your dev email and password.
# Dev sessions and login history are dropped, and any unused invite or
# password-reset links from dev are cancelled.
set -euo pipefail
cd "$(dirname "$0")/.."

dump="${1:?usage: $0 path/to/dev.dump}"
[ -f "$dump" ] || { echo "No such file: $dump" >&2; exit 1; }
compose() { docker compose -f compose.yaml -f compose.prod.yaml "$@"; }

read -r -p "This REPLACES everything in the production database with $dump. Type 'replace' to continue: " answer
[ "$answer" = replace ] || { echo "Cancelled."; exit 1; }

# Keep a copy of whatever is there now, just in case.
umask 077
mkdir -p "$HOME/backups"
before="$HOME/backups/before-import-$(date -u +%Y%m%dT%H%M%SZ).dump"
# shellcheck disable=SC2016  # expanded inside the db container
compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom' > "$before"
echo "Saved the current database to $before"

compose stop api
# shellcheck disable=SC2016
compose exec -T db sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner --single-transaction' < "$dump"
# shellcheck disable=SC2016
compose exec -T db sh -c 'psql -q -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
DELETE FROM refresh_tokens;
DELETE FROM login_events;
UPDATE invites SET revoked_at = now() WHERE revoked_at IS NULL;
UPDATE password_resets SET used_at = now() WHERE used_at IS NULL;
SQL
compose start api
echo "Done. Log in with your dev account."
