#!/bin/bash

# Pre-commit hook for agent spec validation
# Prevents commits with invalid agent specifications

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Validating agent specs...${NC}"

# Get staged files
staged_files=$(git diff --cached --name-only --diff-filter=ACM)

# Filter for .agent.md files
agent_specs=$(echo "$staged_files" | grep '\.agent\.md$' || true)

if [ -z "$agent_specs" ]; then
  echo -e "${GREEN}✅ No agent specs to validate${NC}"
  exit 0
fi

failed=0

# Validate each agent spec
while IFS= read -r file; do
  if [ -z "$file" ]; then
    continue
  fi

  echo "Checking: $file"

  # Check if file exists in working tree
  if [ ! -f "$file" ]; then
    echo -e "${RED}❌ File not found: $file${NC}"
    failed=$((failed+1))
    continue
  fi

  # Validate frontmatter exists
  if ! grep -q "^---$" "$file"; then
    echo -e "${RED}❌ Missing frontmatter delimiter in $file${NC}"
    failed=$((failed+1))
    continue
  fi

  # Extract frontmatter
  frontmatter=$(sed -n '/^---$/,/^---$/p' "$file" | sed '1d;$d')

  # Check required fields
  required_fields=("name" "description" "file_type" "category" "status" "version" "created_date" "last_updated" "author" "language")
  for field in "${required_fields[@]}"; do
    if ! echo "$frontmatter" | grep -q "^$field:"; then
      echo -e "${RED}❌ Missing required field '$field' in $file${NC}"
      failed=$((failed+1))
    fi
  done

  # Validate file_type is 'agent'
  if ! echo "$frontmatter" | grep -qE 'file_type:\s*["\']?agent["\']?'; then
    echo -e "${RED}❌ file_type must be 'agent' in $file${NC}"
    failed=$((failed+1))
  fi

  # Validate category exists (don't enforce specific set - allows flexibility for new categories)
  if ! echo "$frontmatter" | grep -qE "^category:\s*\S+"; then
    echo -e "${RED}❌ Missing or invalid category in $file${NC}"
    failed=$((failed+1))
  fi

  # Validate status is valid
  if ! echo "$frontmatter" | grep -qE "^status:\s*(active|draft|deprecated)"; then
    echo -e "${RED}❌ Invalid status in $file (must be one of: active, draft, deprecated)${NC}"
    failed=$((failed+1))
  fi

  # Validate date formats (YYYY-MM-DD)
  if ! echo "$frontmatter" | grep -E "^created_date:\s[0-9]{4}-[0-9]{2}-[0-9]{2}$" > /dev/null; then
    echo -e "${RED}❌ Invalid created_date format in $file (must be YYYY-MM-DD)${NC}"
    failed=$((failed+1))
  fi

  if ! echo "$frontmatter" | grep -E "^last_updated:\s[0-9]{4}-[0-9]{2}-[0-9]{2}$" > /dev/null; then
    echo -e "${RED}❌ Invalid last_updated format in $file (must be YYYY-MM-DD)${NC}"
    failed=$((failed+1))
  fi

  # Validate language is set (usually 'en')
  if ! echo "$frontmatter" | grep -q "^language:"; then
    echo -e "${RED}❌ Missing language field in $file${NC}"
    failed=$((failed+1))
  fi

done <<< "$agent_specs"

if [ $failed -gt 0 ]; then
  echo -e "${RED}❌ Agent spec validation failed with $failed issues${NC}"
  echo -e "${YELLOW}Fix the issues above and try committing again${NC}"
  exit 1
fi

echo -e "${GREEN}✅ All agent specs are valid${NC}"
exit 0
