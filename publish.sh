#!/usr/bin/env bash
# Publish the built site to the durable serve root that systemd points at.
# The git worktree this was built in can disappear; /home/beckett/sites cannot.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="${V6_ROOT:-$HOME/sites/v6-vision}"

mkdir -p "$DEST"
cp "$HERE"/site/index.html "$HERE"/site/style.css "$HERE"/site/main.js "$DEST"/
cp "$HERE"/serve.py "$DEST"/serve.py

echo "published -> $DEST"
