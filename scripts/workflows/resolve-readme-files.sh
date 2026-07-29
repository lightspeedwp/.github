#!/bin/bash
# Resolve impacted README files from git diff
# Usage: resolve-readme-files.sh <base-sha> <head-sha>
#
# Output format: Comma-separated list of README file paths.
# This script is provided for reference; prefer resolve-readme-files.js
# for security (execFileSync) and consistency.

set -euo pipefail

BASE_SHA="${1:-HEAD~1}"
HEAD_SHA="${2:-.}"

CHANGED=$(git diff --name-only "$BASE_SHA" "$HEAD_SHA" 2>/dev/null || echo "")
if [ -z "$CHANGED" ]; then
  echo ""
  exit 0
fi

TMP=$(mktemp)
trap "rm -f '$TMP'" EXIT

HAS_SUBDIR_CHANGES=0

while IFS= read -r file; do
  [ -z "$file" ] && continue
  dir=$(dirname "$file")

  if [ -f "$dir/README.md" ]; then
    echo "$dir/README.md" >> "$TMP"
  fi

  if [ "$dir" != "." ]; then
    HAS_SUBDIR_CHANGES=1
  fi
done <<EOF
$CHANGED
EOF

# Only add root README if files in subdirectories changed
if [ "$HAS_SUBDIR_CHANGES" = "1" ] && [ -f "README.md" ]; then
  echo "README.md" >> "$TMP"
fi

if [ -f "$TMP" ]; then
  sort -u "$TMP" | tr '\n' ',' | sed 's/,$//'
else
  echo ""
fi
