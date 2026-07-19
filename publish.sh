#!/usr/bin/env bash
# Publish dist/ to the durable serve root that systemd --user points at.
# The git worktree this was built in can disappear; /home/beckett/sites cannot.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="${V6_ROOT:-$HOME/sites/v6-vision}"
DIST="${V6_DIST:-$HERE/dist}"

[ -f "$DIST/index.html" ] || { echo "no build at $DIST — run npm run build first" >&2; exit 1; }

mkdir -p "$DEST"
rsync -a --delete --exclude serve.py "$DIST"/ "$DEST"/
cp "$HERE/serve.py" "$DEST/serve.py"

systemctl --user restart v6-vision.service

echo "published -> $DEST (port 8762)"
