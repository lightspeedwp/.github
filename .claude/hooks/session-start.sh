#!/usr/bin/env bash
# Session-start hook for LightSpeedWP/.github
# Runs at the start of every Claude Code remote session.
# - Renames any auto-generated claude/ branch to a valid chore/session-{hash} branch
# - Installs npm dependencies

set -euo pipefail

# Only run in remote Claude Code environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Skip on clear/compact — branch rename and dep install are only needed at startup/resume
HOOK_INPUT="$(cat)"
if echo "$HOOK_INPUT" | grep -qE '"source"\s*:\s*"(clear|compact)"'; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# ── 1. Enforce branch naming — rename claude/ branches ───────────────────────
# Runs before npm install so a failing install can't prevent the rename.
CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || true)"

if [[ "$CURRENT_BRANCH" == claude/* ]]; then
  # Extract the short hash from the end of the auto-generated branch name.
  # e.g. "claude/admiring-mendel-nqdk8j" → "nqdk8j"
  # Falls back to stripping the "claude/" prefix if the name has no hyphen.
  if [[ "$CURRENT_BRANCH" == *-* ]]; then
    HASH_SUFFIX="${CURRENT_BRANCH##*-}"
  else
    HASH_SUFFIX="${CURRENT_BRANCH#claude/}"
  fi
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

  # Push the new branch name to origin; non-fatal so network issues don't block the session.
  git push -u origin "${NEW_BRANCH}" || echo "==> Warning: Could not push the renamed branch to origin."
  # Delete the old remote branch; non-fatal (may already be gone or push may have failed).
  git push origin --delete "${CURRENT_BRANCH}" 2>/dev/null || true

  echo "==> Branch renamed: ${CURRENT_BRANCH} → ${NEW_BRANCH}"
  echo "==> Please rename '${NEW_BRANCH}' to a meaningful {type}/{scope}-{title} branch before committing."
fi

# ── 2. Install npm dependencies ──────────────────────────────────────────────
echo "==> Installing npm dependencies..."
npm install --prefer-offline --no-fund --no-audit 2>&1
echo "==> npm install complete."
