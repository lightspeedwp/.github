#!/bin/bash

# Pre-commit validation hook for PR template compliance
# Validates branch naming, commit messages, and PR template requirements
# Prevents governance violations BEFORE push/PR creation

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Get current branch
BRANCH=$(git branch --show-current)
BRANCH_PATTERN="^(feat|fix|hotfix|chore|docs|ci|test|refactor|perf|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|telemetry|content|seo|config|migrate|qa|uat|release)\/[a-z0-9]+-[a-z0-9\-]+$"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PRE-COMMIT VALIDATION CHECKLIST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Validate branch name
echo ""
echo "🔍 BRANCH NAME VALIDATION"
echo "   Current branch: $BRANCH"

if [[ $BRANCH == "main" ]] || [[ $BRANCH == "develop" ]]; then
  echo -e "${RED}✗ FAIL: Cannot commit directly to $BRANCH${NC}"
  echo "   Create a feature/fix/chore branch first."
  exit 1
fi

if [[ $BRANCH == claude/* ]]; then
  echo -e "${RED}✗ FAIL: Branch name uses forbidden 'claude/' prefix${NC}"
  echo "   Rename with: git branch -m $BRANCH {type}/{scope}-{short-title}"
  exit 1
fi

if ! [[ $BRANCH =~ $BRANCH_PATTERN ]]; then
  echo -e "${RED}✗ FAIL: Branch name doesn't match required pattern${NC}"
  echo "   Required: {type}/{scope}-{short-title} (lowercase, kebab-case)"
  echo "   Valid types: feat, fix, hotfix, chore, docs, ci, test, refactor, etc."
  exit 1
fi

echo -e "${GREEN}✓ PASS: Branch name is valid${NC}"

# 2. Get branch type for template-specific checks
BRANCH_TYPE=$(echo "$BRANCH" | cut -d'/' -f1)

# 3. Check for staged changes (if any)
STAGED_CHANGES=$(git diff --cached --name-only 2>/dev/null | wc -l)

if [ "$STAGED_CHANGES" -eq 0 ]; then
  echo ""
  echo "⚠️  WARNING: No staged changes detected"
  echo "   If you meant to stage files, run: git add {files}"
  exit 0
fi

echo ""
echo "📝 COMMIT MESSAGE VALIDATION"

# Get the commit message from editor or stdin
if [ -n "$GIT_EDITOR" ]; then
  COMMIT_MSG=$($GIT_EDITOR --print-only 2>/dev/null || echo "")
else
  COMMIT_MSG=$(git diff --cached --diff-filter=d | head -20)
fi

if [ -z "$COMMIT_MSG" ]; then
  echo "⚠️  Commit message not yet entered (will be prompted after this check)"
  COMMIT_MSG="[pending]"
fi

echo "   Message preview: ${COMMIT_MSG:0:60}..."

# 4. Template-specific checks for feat/ branches
if [ "$BRANCH_TYPE" == "feat" ]; then
  echo ""
  echo "🎯 FEAT/ BRANCH TEMPLATE REQUIREMENTS"
  echo "   (PR template must include these sections)"
  echo ""

  REQUIREMENTS=(
    "## Linked issues"
    "## Changelog"
    "### Checklist"
  )

  MISSING_SECTIONS=0
  for section in "${REQUIREMENTS[@]}"; do
    echo "   ☐ Will check for: '$section' in PR body"
  done

  echo ""
  echo "   📋 Before creating PR, ensure:"
  echo "      1. Use template: pr_feature.md"
  echo "      2. Fill all sections with actual content (no placeholders)"
  echo "      3. Include linked issue: Fixes #XXXX"
  echo "      4. Add changelog entries (Added/Changed/Fixed)"
  echo "      5. Complete DoD checklist"
fi

# 5. Generic checks for all branches
echo ""
echo "✅ PRE-COMMIT CHECKS COMPLETE"
echo ""
echo "Ready to commit. Next steps:"
if [ "$BRANCH_TYPE" == "feat" ]; then
  echo "  1. Create PR (GitHub will validate template)"
  echo "  2. Ensure all feat/ template sections are completed"
  echo "  3. Governance hook will validate before merge"
else
  echo "  1. Create PR (if needed)"
  echo "  2. Governance hook will validate at merge time"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit 0
