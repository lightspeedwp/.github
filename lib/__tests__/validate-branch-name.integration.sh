#!/bin/bash

##
# Integration tests for branch name validation
# Tests the CLI, hook installation, and basic hook behavior
##

set +e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CLI_PATH="$PROJECT_ROOT/scripts/validation/validate-branch-name.js"
HOOK_PATH="$PROJECT_ROOT/lib/hooks/pre-push"
HUSKY_HOOK_PATH="$PROJECT_ROOT/.husky/pre-push"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_case() {
  local name="$1"
  local expected="$2"
  local actual="$3"

  if [ "$expected" = "$actual" ]; then
    echo -e "${GREEN}✓${NC} $name"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗${NC} $name (expected: $expected, got: $actual)"
    ((TESTS_FAILED++))
  fi
}

echo "=== Branch Name Validation Integration Tests ==="
echo

# Test 1: Hook file exists
echo "Testing hook files..."
if [ -f "$HOOK_PATH" ]; then
  echo -e "${GREEN}✓${NC} Pre-push hook exists at $HOOK_PATH"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗${NC} Pre-push hook not found at $HOOK_PATH"
  ((TESTS_FAILED++))
fi

# Test 2: Husky runs the hook (#3493)
if grep -q "lib/hooks/pre-push" "$HUSKY_HOOK_PATH" 2>/dev/null; then
  echo -e "${GREEN}✓${NC} $HUSKY_HOOK_PATH runs the pre-push hook"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗${NC} $HUSKY_HOOK_PATH does not run lib/hooks/pre-push"
  ((TESTS_FAILED++))
fi

echo

# Test 3-5: CLI validation tests
echo "Testing CLI validation..."

# Test 3: Valid branch
if node "$CLI_PATH" --branch feat/test-validation > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} CLI accepts valid branch (feat/test-validation)"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗${NC} CLI rejected valid branch"
  ((TESTS_FAILED++))
fi

# Test 4: Invalid branch type
if ! node "$CLI_PATH" --branch feature/test > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} CLI rejects invalid type (feature/test)"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗${NC} CLI accepted invalid type"
  ((TESTS_FAILED++))
fi

# Test 5: Forbidden prefix
if ! node "$CLI_PATH" --branch claude/test > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} CLI rejects forbidden prefix (claude/)"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗${NC} CLI accepted forbidden prefix"
  ((TESTS_FAILED++))
fi

echo

# Test 6-8: Exit codes
echo "Testing CLI exit codes..."

# Test 6: Exit code 0 for valid
node "$CLI_PATH" --branch feat/valid-name > /dev/null 2>&1
EXIT_CODE=$?
if [ "$EXIT_CODE" -eq 0 ]; then
  echo -e "${GREEN}✓${NC} Exit code 0 for valid branch"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗${NC} Exit code $EXIT_CODE for valid branch (expected 0)"
  ((TESTS_FAILED++))
fi

# Test 7: Exit code 1 for invalid
node "$CLI_PATH" --branch invalid > /dev/null 2>&1
EXIT_CODE=$?
if [ "$EXIT_CODE" -eq 1 ]; then
  echo -e "${GREEN}✓${NC} Exit code 1 for invalid branch"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗${NC} Exit code $EXIT_CODE for invalid branch (expected 1)"
  ((TESTS_FAILED++))
fi

# Test 8: Exit code 0 for help
node "$CLI_PATH" --help > /dev/null 2>&1
EXIT_CODE=$?
if [ "$EXIT_CODE" -eq 0 ]; then
  echo -e "${GREEN}✓${NC} Exit code 0 for --help"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗${NC} Exit code $EXIT_CODE for --help (expected 0)"
  ((TESTS_FAILED++))
fi

echo

# Test 9-11: CLI options
echo "Testing CLI options..."

# Test 9: JSON output
JSON_OUTPUT=$(node "$CLI_PATH" --branch feat/test-validation --json)
if echo "$JSON_OUTPUT" | grep -q '"valid": true'; then
  echo -e "${GREEN}✓${NC} JSON output contains valid status"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗${NC} JSON output invalid"
  ((TESTS_FAILED++))
fi

# Test 10: Help output
HELP_OUTPUT=$(node "$CLI_PATH" --help)
if echo "$HELP_OUTPUT" | grep -q "Usage"; then
  echo -e "${GREEN}✓${NC} Help output contains usage information"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗${NC} Help output missing usage information"
  ((TESTS_FAILED++))
fi

# Test 11: Current branch validation
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if node "$CLI_PATH" --current > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} Current branch validation works (branch: $CURRENT_BRANCH)"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗${NC} Current branch validation failed"
  ((TESTS_FAILED++))
fi

echo

# Summary
echo "=== Test Summary ==="
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ "$TESTS_FAILED" -eq 0 ]; then
  echo -e "\n${GREEN}All tests passed!${NC}"
  exit 0
else
  echo -e "\n${RED}Some tests failed!${NC}"
  exit 1
fi
