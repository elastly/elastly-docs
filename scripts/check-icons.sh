#!/usr/bin/env bash
# Mintlify resolves icon names against Font Awesome. A name that does not exist fails silently:
# the card or nav item just renders with no icon. This catches that before it ships.
# Usage: ./scripts/check-icons.sh
set -uo pipefail

cd "$(dirname "$0")/.."

ICONS=$(grep -rhoE '(icon"?[:=] ?)"[a-z0-9-]+"' docs.json ./*.mdx api snippets 2>/dev/null \
  | sed -E 's/.*"([a-z0-9-]+)"/\1/' | sort -u)

if [ -z "$ICONS" ]; then
  echo "no icons found"
  exit 0
fi

fail=0
count=0
while IFS= read -r icon; do
  [ -z "$icon" ] && continue
  count=$((count + 1))
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://mintlify.b-cdn.net/v6.6.0/solid/${icon}.svg")
  if [ "$code" != "200" ]; then
    echo "✗ $icon is not a Font Awesome icon (HTTP $code)"
    fail=1
  fi
done <<< "$ICONS"

if [ "$fail" -eq 0 ]; then
  echo "✓ all $count icons resolve"
else
  echo ""
  echo "Lucide names (sliders-horizontal, list-tree) are not always Font Awesome names."
  echo "Search https://fontawesome.com/icons for the correct one."
fi

exit "$fail"
