#!/bin/bash

# PR merge governance validator hook
# Blocks merges without: (1) correct template, (2) linked issues
# Portable governance guardrail for the LightSpeed .github repository
#
# References:
# - AGENTS.md: PR template routing by branch prefix
# - CLAUDE.md: Branch naming and PR governance rules
# - docs/BRANCHING_STRATEGY.md: Complete branching rules
#
# Reads hook input from stdin

set -e

# Parse hook input from stdin
hook_input=$(cat)
command=$(echo "$hook_input" | jq -r '.tool_input.command // ""')

# Only validate gh pr merge commands
if ! echo "$command" | grep -q "gh pr merge"; then
  exit 0
fi

# Extract PR number from command (e.g., "gh pr merge 1234")
pr_number=$(echo "$command" | grep -oE '\s[0-9]+(\s|$)' | tr -d ' ' | head -1)

# If no explicit PR, get current PR
if [ -z "$pr_number" ]; then
  pr_number=$(gh pr view --json number --jq '.number' 2>/dev/null || echo "")
  if [ -z "$pr_number" ]; then
    # Not in a PR context, let it through
    exit 0
  fi
fi

# Fetch PR details
pr_json=$(gh pr view "$pr_number" --json body,headRefName,template --jq . 2>/dev/null || echo "")
if [ -z "$pr_json" ]; then
  exit 0
fi

pr_body=$(echo "$pr_json" | jq -r '.body // ""')
pr_branch=$(echo "$pr_json" | jq -r '.headRefName // ""')

# Extract branch prefix (e.g., "feat" from "feat/issue-triage")
branch_prefix=$(echo "$pr_branch" | cut -d'/' -f1)

# ─────────────────────────────────────────────────────────────────────────────
# Validation Check 1: Template Correctness
# Maps branch prefix to expected template signature sections per AGENTS.md
# ─────────────────────────────────────────────────────────────────────────────

template_valid=false

case "$branch_prefix" in
  feat|feature|perf|api|design|a11y|ux|i18n|ops|proto|ds|telemetry|content|seo|research)
    # feat/ → pr_feature.md requires "## Summary"
    if echo "$pr_body" | grep -qE "^## Summary"; then
      template_valid=true
    fi
    ;;
  fix|hotfix|security|revert)
    # fix/ → pr_bug.md requires "## Root" or "## Problem"
    if echo "$pr_body" | grep -qE "^## (Root|Problem)"; then
      template_valid=true
    fi
    ;;
  refactor|chore|test|build|ci|deps|migrate|qa|uat|config)
    # refactor/chore → pr_chore.md requires "## Motivation" or "## Changes"
    if echo "$pr_body" | grep -qE "^## (Motivation|Changes)"; then
      template_valid=true
    fi
    ;;
  docs)
    # docs → pr_docs.md requires meaningful body
    if [ ${#pr_body} -gt 20 ]; then
      template_valid=true
    fi
    ;;
  release)
    # release → pr_release.md requires version
    if echo "$pr_body" | grep -qE "v[0-9]"; then
      template_valid=true
    fi
    ;;
  *)
    # Unmapped prefixes must have markdown headers
    if echo "$pr_body" | grep -qE "^##"; then
      template_valid=true
    fi
    ;;
esac

# ─────────────────────────────────────────────────────────────────────────────
# Validation Check 2: Linked Issues
# AGENTS.md requires: "Fixes #XXX" or "Relates to #XXX" in PR body
# ─────────────────────────────────────────────────────────────────────────────

has_linked_issues=false

if echo "$pr_body" | grep -qiE "(fixes|resolves|closes|relates to)[[:space:]]+#[0-9]+"; then
  has_linked_issues=true
fi

# ─────────────────────────────────────────────────────────────────────────────
# Output validation result as JSON
# ─────────────────────────────────────────────────────────────────────────────

if [ "$template_valid" = false ] || [ "$has_linked_issues" = false ]; then
  reasons=()
  [ "$template_valid" = false ] && reasons+=("PR template not correct for branch prefix '$branch_prefix'")
  [ "$has_linked_issues" = false ] && reasons+=("No linked issues found (use 'Fixes #123' or 'Relates to #456')")

  cat <<EOF
{
  "continue": false,
  "stopReason": "PR merge blocked: $(printf '%s; ' "${reasons[@]}" | sed 's/; $//')",
  "systemMessage": "⛔ PR #$pr_number merge blocked - governance rules violated:\n$(printf '  • %s\n' "${reasons[@]}")\n\nFix the PR by:\n1. Updating the PR body to match the $branch_prefix branch template (see AGENTS.md PR routing)\n2. Adding linked issues (Fixes #XXX or Relates to #XXX) in the PR body"
}
EOF
  exit 0
fi

# All validations passed
exit 0
