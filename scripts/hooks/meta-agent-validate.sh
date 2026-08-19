#!/bin/bash
# Meta Agent Pre-commit Validation Hook
# Validates frontmatter and schema compliance before commit

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
HOOK_NAME="meta-agent-validate"
REPO_ROOT=$(git rev-parse --show-toplevel)
AGENT_PATH="agents/meta-agent"
SCRIPTS_PATH="scripts"

# Check if meta-agent exists
if [ ! -d "$REPO_ROOT/$AGENT_PATH" ]; then
  echo -e "${YELLOW}⊘ Meta Agent not found in this repository${NC}"
  exit 0
fi

echo -e "${YELLOW}🔍 Running Meta Agent validation...${NC}"

# Get staged Markdown files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep "\.md$" || true)

if [ -z "$STAGED_FILES" ]; then
  echo -e "${GREEN}✓ No Markdown files to validate${NC}"
  exit 0
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
  echo -e "${YELLOW}⚠ Node.js not found. Skipping validation.${NC}"
  exit 0
fi

# Validate each file
ERRORS=0
for FILE in $STAGED_FILES; do
  # Skip if file doesn't exist (deleted file)
  if [ ! -f "$REPO_ROOT/$FILE" ]; then
    continue
  fi

  echo -n "  Checking: $FILE ... "

  # Run validation using Node.js
  VALIDATION_OUTPUT=$(node -e "
    const fs = require('fs');
    const path = require('path');

    // Import validation skill
    const { validateFrontmatter } = require('./$AGENT_PATH/skills/frontmatter-validation.js');
    const { detectRepoType } = require('./$AGENT_PATH/skills/repo-type-detection.js');

    // Detect repo type
    const repoType = detectRepoType('.');

    // Get schema if available
    let schema = {};
    const schemaPath = \`./schemas/\${repoType}.frontmatter.schema.json\`;
    if (fs.existsSync(schemaPath)) {
      try {
        schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      } catch (e) {
        // Schema parsing failed, continue with empty schema
      }
    }

    // Validate file
    const result = validateFrontmatter('$FILE', schema);

    if (result.valid) {
      console.log('VALID');
    } else {
      console.log('INVALID');
      console.error('ERRORS:', result.errors.join('|'));
    }
  " 2>&1 || echo "ERROR")

  if echo "$VALIDATION_OUTPUT" | grep -q "INVALID"; then
    echo -e "${RED}✗${NC}"
    ERRORS=$((ERRORS + 1))

    # Extract and display errors
    ERROR_MSG=$(echo "$VALIDATION_OUTPUT" | grep "^ERRORS:" | cut -d: -f2-)
    if [ -n "$ERROR_MSG" ]; then
      echo "$ERROR_MSG" | tr '|' '\n' | sed 's/^/    ❌ /'
    fi
  elif echo "$VALIDATION_OUTPUT" | grep -q "VALID"; then
    echo -e "${GREEN}✓${NC}"
  else
    echo -e "${YELLOW}⚠${NC}"
    echo "    (Validation skipped: $VALIDATION_OUTPUT)"
  fi
done

# Report results
echo ""
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ All frontmatter validations passed${NC}"
  exit 0
else
  echo -e "${RED}❌ $ERRORS file(s) failed validation${NC}"
  echo ""
  echo "Suggestions:"
  echo "  1. Fix the frontmatter errors listed above"
  echo "  2. Stage the corrected files: git add <file>"
  echo "  3. Try committing again"
  echo ""
  echo "To bypass this check (not recommended):"
  echo "  git commit --no-verify"
  echo ""
  exit 1
fi
