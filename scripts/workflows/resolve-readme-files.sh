#!/bin/bash
# Resolve impacted README files from git diff
# Usage: resolve-readme-files.sh <base-sha> <head-sha>

set -euo pipefail

BASE_SHA="${1:-HEAD~1}"
HEAD_SHA="${2:-.}"

CHANGED=$(git diff --name-only "$BASE_SHA" "$HEAD_SHA" 2>/dev/null || echo "")
if [ -z "$CHANGED" ]; then
  echo ""
  exit 0
fi

TMP=$(mktemp)
while IFS= read -r file; do
  [ -z "$file" ] && continue
  dir=$(dirname "$file")
  if [ -f "$dir/README.md" ]; then
    echo "$dir/README.md" >> "$TMP"
  fi
  if [ "$dir" != "." ] && [ -f "README.md" ]; then
    echo "README.md" >> "$TMP"
  fi
done <<EOF
$CHANGED
EOF

if [ -f "$TMP" ]; then
  sort -u "$TMP" | tr '\n' ','  | sed 's/,$//'
else
  echo ""
fi
rm -f "$TMP"
