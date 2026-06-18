#!/usr/bin/env bash
# Session-start hook for LightSpeedWP/.github
# Runs at the start of every Claude Code remote session.
# - Installs npm dependencies
# - Renames any auto-generated claude/ branch to a valid chore/session-{hash} branch

set -euo pipefail

# Only run in remote Claude Code environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# ── 1. Install npm dependencies ──────────────────────────────────────────────
echo "==> Installing npm dependencies..."
cd "${CLAUDE_PROJECT_DIR:-.}"
npm install --prefer-offline --no-fund --no-audit 2>&1
echo "==> npm install complete."

# ── 2. Enforce branch naming — rename claude/ branches ───────────────────────
CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || true)"

if [[ "$CURRENT_BRANCH" == claude/* ]]; then
  # Extract the short hash from the end of the auto-generated branch name.
  # e.g. "claude/admiring-mendel-nqdk8j" → "nqdk8j"
  HASH_SUFFIX="${CURRENT_BRANCH##*-}"
  NEW_BRANCH="chore/session-${HASH_SUFFIX}"

  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║  BRANCH RENAME: claude/ prefix is forbidden by CLAUDE.md    ║"
  echo "╠══════════════════════════════════════════════════════════════╣"
  printf "║  Old: %-55s ║\n" "${CURRENT_BRANCH}"
  printf "║  New: %-55s ║\n" "${NEW_BRANCH}"
  echo "╠══════════════════════════════════════════════════════════════╣"
  echo "║  ACTION REQUIRED before committing any work:                 ║"
  echo "║  Rename to match your task using:                            ║"
  echo "║    git branch -m <new-name>                                  ║"
  echo "║    git push -u origin <new-name>                             ║"
  echo "║    git push origin --delete ${NEW_BRANCH}                    ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""

  # Rename locally
  git branch -m "${CURRENT_BRANCH}" "${NEW_BRANCH}"

  # Push the new branch name to origin and delete the old remote branch.
  # Use || true on the delete so a pre-deleted remote branch doesn't fail the hook.
  git push -u origin "${NEW_BRANCH}"
  git push origin --delete "${CURRENT_BRANCH}" 2>/dev/null || true

  echo "==> Branch renamed: ${CURRENT_BRANCH} → ${NEW_BRANCH}"
  echo "==> Please rename '${NEW_BRANCH}' to a meaningful {type}/{scope}-{title} branch before committing."
fi
