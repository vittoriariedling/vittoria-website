#!/usr/bin/env bash
# rclone for R2, run from a pinned Docker image. (Ubuntu 24.04's packaged
# rclone 1.60 is too old for R2: uploads fail with 501 Not Implemented.)
# Reads the R2 settings from deploy/backup.env. Files are read from and
# written to your local backups folder, which is /backups inside rclone:
#
#   ./deploy/rclone.sh lsf r2:backups/db/
#   ./deploy/rclone.sh copy r2:backups/db/<file> /backups/    # -> ~/backups/<file>
set -euo pipefail
cd "$(dirname "$0")/.."

IMAGE=rclone/rclone:1.76@sha256:7cbeec24a44f206067597c0368be4de90ae19a64d5113c7d1938bd737a81e466

set -a
# shellcheck source=/dev/null
. deploy/backup.env
set +a
LOCAL_DIR="${LOCAL_DIR:-$HOME/backups}"
mkdir -p "$LOCAL_DIR"

# Pass every RCLONE_* setting by name, so keys never appear in `ps` output.
env_args=()
while IFS= read -r name; do env_args+=(-e "$name"); done < <(compgen -e | grep '^RCLONE_')

exec docker run --rm -i --user "$(id -u):$(id -g)" "${env_args[@]}" \
  -v "$LOCAL_DIR:/backups" "$IMAGE" --config "" "$@"
