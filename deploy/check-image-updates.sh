#!/usr/bin/env bash
# Read-only: lists every pinned image (tag@sha256:...) in the repo and checks
# whether the tag now points to a newer image on Docker Hub. Changes nothing.
#
#   ./deploy/check-image-updates.sh
#
# To update one, replace its old digest with the new one everywhere it appears
# (same files listed below), commit, merge, and run ./deploy/deploy.sh.
set -euo pipefail
cd "$(dirname "$0")/.."

files=(compose.yaml compose.prod.yaml compose.override.yaml Dockerfile.web api/Dockerfile
       deploy/export-dev-content.sh deploy/rclone.sh)

pins=$(grep -hoE '[a-z0-9./_-]+:[A-Za-z0-9._-]+@sha256:[0-9a-f]{64}' "${files[@]}" | sort -u)
updates=0
while IFS= read -r pin; do
  ref=${pin%@*}
  pinned=${pin#*@}
  latest=$(docker buildx imagetools inspect "$ref" 2>/dev/null | awk '/^Digest:/{print $2; exit}')
  if [ -z "$latest" ]; then
    printf '%-45s  could not check\n' "$ref"
  elif [ "$latest" = "$pinned" ]; then
    printf '%-45s  up to date\n' "$ref"
  else
    printf '%-45s  UPDATE AVAILABLE\n    old %s\n    new %s\n    in: %s\n' \
      "$ref" "$pinned" "$latest" "$(grep -lF "$pinned" "${files[@]}" | tr '\n' ' ')"
    updates=$((updates + 1))
  fi
done <<< "$pins"
echo
echo "$updates update(s) available."
