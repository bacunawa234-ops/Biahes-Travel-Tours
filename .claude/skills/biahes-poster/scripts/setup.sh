#!/bin/bash
# One-time setup: installs poster fonts next to the templates (skill/fonts).
set -e
D="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$D/fonts" && cp "$D/scripts/fonts-package.json" "$D/fonts/package.json"
cd "$D/fonts" && npm install --silent
node -e "require('playwright')" 2>/dev/null || NODE_PATH=$(npm root -g) node -e "require('playwright')" || npm install -g playwright
echo "Ready. Render: NODE_PATH=\$(npm root -g) node $D/scripts/render-poster.js <poster.html> <out.png>"
