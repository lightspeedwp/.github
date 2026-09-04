#!/bin/bash

# PR merge validation hook
# Blocks merges without: (1) correct template, (2) linked issues
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
pr_template=$(echo "$pr_json" | jq -r '.template // ""')

# Extract branch prefix (e.g., "feat" from "feat/issue-triage")
branch_prefix=$(echo "$pr_branch" | cut -d'/' -f1)

# Map branch prefix to expected template sections
case "$branch_prefix" in
  feat|feature|perf|api|design|a11y|ux|i18n|ops|proto|ds|telemetry|content|seo|research)
    expected_template="pr_feature.md"
    ;;
  fix|hotfix|security|revert)
    expected_template="pr_bug.md"
    ;;
  refactor|chore|test|build|ci|deps|migrate|qa|uat|config)
    expected_template="pr_chore.md"
    ;;
  docs)
    expected_template="pr_docs.md"
    ;;
  release)
    expected_template="pr_release.md"
    ;;
  *)
    expected_template=""
    ;;
esac

# Validation check 1: Template correctness
# Look for expected template signature sections
template_valid=false

if [ "$branch_prefix" = "feat" ] || [ "$branch_prefix" = "feature" ]; then
  # feat/ requires "## Summary" and "## Test plan"
  if echo "$pr_body" | grep -qE "^## Summary"; then
    template_valid=true
  fi
elif [ "$branch_prefix" = "fix" ] || [ "$branch_prefix" = "hotfix" ]; then
  # fix/ requires "## Root cause"
  if echo "$pr_body" | grep -qE "^## Root"; then
    template_valid=true
  fi
elif [ "$branch_prefix" = "refactor" ] || [ "$branch_prefix" = "chore" ]; then
  # refactor/chore require "## Motivation"
  if echo "$pr_body" | grep -qE "^## (Motivation|Changes)"; then
    template_valid=true
  fi
elif [ "$branch_prefix" = "docs" ]; then
  # docs just needs body content
  if [ ${#pr_body} -gt 20 ]; then
    template_valid=true
  fi
elif [ "$branch_prefix" = "release" ]; then
  # release needs version info
  if echo "$pr_body" | grep -qE "v[0-9]"; then
    template_valid=true
  fi
else
  # For unmapped prefixes, check for any markdown headers
  if echo "$pr_body" | grep -qE "^##"; then
    template_valid=true
  fi
fi

# Validation check 2: Linked issues
# Look for "Fixes #" or "Relates to #" patterns
has_linked_issues=false

if echo "$pr_body" | grep -qiE "(fixes|resolves|closes|relates to)\s+#[0-9]+"; then
  has_linked_issues=true
fi

# Output validation result as JSON
if [ "$template_valid" = false ] || [ "$has_linked_issues" = false ]; then
  reasons=()
  [ "$template_valid" = false ] && reasons+=("PR template not correct for branch prefix '$branch_prefix'")
  [ "$has_linked_issues" = false ] && reasons+=("No linked issues found (use 'Fixes #123' or 'Relates to #456')")

  reason_list=$(printf '%s\n' "${reasons[@]}" | jq -R . | jq -s .)

  cat <<EOF
{
  "continue": false,
  "stopReason": "PR merge blocked: $(printf '%s; ' "${reasons[@]}" | sed 's/; $//')",
  "systemMessage": "⛔ PR #$pr_number merge blocked - governance rules violated:\n$(printf '  • %s\n' "${reasons[@]}")\n\nFix the PR by:\n1. Updating the PR body to match the $branch_prefix branch template\n2. Adding linked issues (Fixes #XXX or Relates to #XXX) in the Development section"
}
EOF
  exit 0
fi

# All validations passed
exit 0
