#!/bin/bash
# Check for Mermaid diagrams in changed files
# Reads changed file list from stdin, outputs has_diagrams

HAS_MERMAID=false

while IFS= read -r file; do
  [ -z "$file" ] && continue
  if grep -q '```mermaid' "$file" 2>/dev/null; then
    HAS_MERMAID=true
    break
  fi
done

if [ "$HAS_MERMAID" = true ]; then
  echo "true"
else
  echo "false"
fi
