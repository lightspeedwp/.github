#!/bin/bash
# Open or update automation PR for meta-agent changes
# This script handles git operations that would use multiline shell control-flow

set -euo pipefail

git config user.name "lightspeed-bot"
git config user.email "ops@lightspeedwp.agency"
git add -A

if git diff --cached --quiet; then
  echo "No content or metrics changes to apply."
  exit 0
fi

BRANCH="chore/meta-agent-sync"
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"
git commit -m "chore(meta): apply frontmatter/badges/references/footer + metrics snapshot"
git push origin "$BRANCH" --force

# Output variables for next steps
echo "pr_branch=$BRANCH" >> "$GITHUB_OUTPUT"
echo "has_changes=true" >> "$GITHUB_OUTPUT"
