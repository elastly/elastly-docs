#!/usr/bin/env bash
# Sync openapi.json from the private monorepo, which is the source of truth.
# Usage: ./scripts/sync-openapi.sh [path-to-elastly-monorepo]
set -euo pipefail

MONOREPO="${1:-$HOME/Sites/elastly}"
SOURCE="$MONOREPO/packages/api-contract/openapi.json"
DEST="$(cd "$(dirname "$0")/.." && pwd)/openapi.json"

if [ ! -f "$SOURCE" ]; then
  echo "error: no spec at $SOURCE" >&2
  echo "pass the monorepo path: ./scripts/sync-openapi.sh /path/to/elastly" >&2
  exit 1
fi

if ! node -e "JSON.parse(require('fs').readFileSync('$SOURCE','utf8'))" 2>/dev/null; then
  echo "error: $SOURCE is not valid JSON" >&2
  exit 1
fi

if cmp -s "$SOURCE" "$DEST"; then
  echo "openapi.json already up to date"
else
  cp "$SOURCE" "$DEST"
  echo "synced openapi.json from $SOURCE"
fi

# Any endpoint page whose operation vanished from the spec would 404 in the nav.
node - "$DEST" <<'EOF'
const fs = require("node:fs")
const path = require("node:path")
const spec = JSON.parse(fs.readFileSync(process.argv[2], "utf8"))
const inSpec = new Set()
for (const [p, ops] of Object.entries(spec.paths ?? {})) {
  for (const [method, op] of Object.entries(ops)) {
    if (op && typeof op === "object" && op.operationId) inSpec.add(`${method.toUpperCase()} ${p}`)
  }
}
const dir = path.join(path.dirname(process.argv[2]), "api", "endpoints")
const referenced = new Set()
for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
  if (!f.endsWith(".mdx")) continue
  const m = fs.readFileSync(path.join(dir, f), "utf8").match(/^openapi:\s*"?([^"\n]+)"?/m)
  if (!m) continue
  const op = m[1].trim()
  referenced.add(op)
  if (!inSpec.has(op)) console.log(`⚠️  api/endpoints/${f} points at "${op}", which is not in the spec`)
}
for (const op of inSpec) {
  if (!referenced.has(op)) console.log(`⚠️  "${op}" is in the spec but has no page in api/endpoints/`)
}
console.log(`checked ${inSpec.size} operations against ${referenced.size} pages`)
EOF
