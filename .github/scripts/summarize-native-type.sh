#!/bin/bash
# Summarize native issue type sync results for GitHub step summary
# Reads APP_CONFIGURED and NATIVE_TYPE from environment variables

{
  echo "### Native issue type sync"
  if [ "${APP_CONFIGURED}" != "true" ]; then
    echo "- Status: ⚠️ Skipped (LS_APP_ID or LS_APP_PRIVATE_KEY not configured)"
    echo "- Setup: add vars.LS_APP_ID and secrets.LS_APP_PRIVATE_KEY to enable"
  elif [ -n "${NATIVE_TYPE}" ]; then
    echo "- Status: ✅ Set to **${NATIVE_TYPE}**"
  else
    echo "- Status: — No matching type:* label found"
  fi
} >> "$GITHUB_STEP_SUMMARY"
