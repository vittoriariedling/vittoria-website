#!/usr/bin/env bash
# Pull the latest code and (re)start everything. Run on the server from the repo.
set -euo pipefail
cd "$(dirname "$0")/.."

git pull --ff-only
docker compose -f compose.yaml -f compose.prod.yaml up -d --build --remove-orphans
docker image prune -f
docker compose -f compose.yaml -f compose.prod.yaml ps
