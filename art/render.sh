#!/usr/bin/env bash
# Render a diagram HTML to a crisp, transparent-background PNG.
# Usage: ./art/render.sh <name>        (renders art/<name>.html -> art/<name>.png)
#        ./art/render.sh                (renders every art/*.html)
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
DIR="$(cd "$(dirname "$0")" && pwd)"
SCALE=2

render_one() {
  local name="$1"
  local html="$DIR/$name.html"
  local png="$DIR/$name.png"
  [ -f "$html" ] || { echo "no $html"; return 1; }

  # Measure the .stage element so the PNG is cropped to the artwork, not the window.
  local dims
  dims=$("$CHROME" --headless --disable-gpu --no-sandbox \
    --window-size=2400,2000 --force-device-scale-factor=1 \
    --virtual-time-budget=1500 \
    --dump-dom "file://$html" 2>/dev/null \
    | grep -o 'data-w="[0-9]*" data-h="[0-9]*"' | head -1 || true)

  local w h
  w=$(printf '%s' "$dims" | sed -n 's/.*data-w="\([0-9]*\)".*/\1/p')
  h=$(printf '%s' "$dims" | sed -n 's/.*data-h="\([0-9]*\)".*/\1/p')
  w=${w:-1440}; h=${h:-600}

  "$CHROME" --headless --disable-gpu --no-sandbox \
    --force-device-scale-factor=$SCALE \
    --default-background-color=00000000 \
    --window-size="$w,$h" \
    --virtual-time-budget=1500 \
    --screenshot="$png" "file://$html" 2>/dev/null

  echo "rendered $name.png (${w}x${h} @${SCALE}x)"
}

if [ $# -ge 1 ]; then
  render_one "$1"
else
  for f in "$DIR"/*.html; do
    render_one "$(basename "$f" .html)"
  done
fi
