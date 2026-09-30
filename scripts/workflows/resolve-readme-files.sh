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
# Single quotes: $TMP must expand when the trap fires, not when set.
trap 'rm -f "$TMP"' EXIT

HAS_SUBDIR_CHANGES=0

# Kept in step with EXCLUDED_README_DIRS in resolve-readme-files.cjs: GitHub
# treats a file directly in .github/workflows/ as a workflow definition and the
# App token that pushes the regeneration branch has no `workflows` permission,
# so a README there can never be pushed. See issue #3687.
EXCLUDED_DIR=".github/workflows"

while IFS= read -r file; do
  [ -z "$file" ] && continue
  dir=$(dirname "$file")

  # Segment-boundary match, so .github/workflows-old/ is NOT excluded.
  case "$dir/README.md" in
    "$EXCLUDED_DIR"/*) ;;
    *)
      if [ -f "$dir/README.md" ]; then
        echo "$dir/README.md" >> "$TMP"
      fi
      ;;
  esac

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
