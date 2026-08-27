#!/bin/bash
# Report changelog merge action
# Reads HAS_ENTRIES and PR_NUMBER from environment variables

if [ "$HAS_ENTRIES" = "true" ]; then
  echo "✅ Changelog entries merged from PR #${PR_NUMBER}"
else
  echo "ℹ️  No changelog entries to merge from PR #${PR_NUMBER}"
fi
