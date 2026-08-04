#!/bin/bash
# Check for Mermaid diagrams in changed files
# Reads CHANGED_FILES from input, outputs has_diagrams

CHANGED_FILES="$1"
HAS_MERMAID=false

if [ -z "$CHANGED_FILES" ]; then
  echo "false"
  exit 0
fi

while IFS= read -r file; do
  if grep -q '```mermaid' "$file" 2>/dev/null; then
    HAS_MERMAID=true
    break
  fi
done <<< "$CHANGED_FILES"

if [ "$HAS_MERMAID" = true ]; then
  echo "true"
else
  echo "false"
fi
