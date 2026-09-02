#!/bin/bash

# Pre-commit Hook Tests
# Test suite for pre-commit-agent-spec-validation.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Test utilities
function test_case() {
  local test_name="$1"
  TESTS_TOTAL=$((TESTS_TOTAL + 1))
  echo -e "${YELLOW}[Test $TESTS_TOTAL] $test_name${NC}"
}

function assert_success() {
  local cmd="$1"
  if eval "$cmd" > /dev/null 2>&1; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✅ PASS${NC}"
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}❌ FAIL: Command failed: $cmd${NC}"
  fi
}

function assert_failure() {
  local cmd="$1"
  if ! eval "$cmd" > /dev/null 2>&1; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✅ PASS${NC}"
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}❌ FAIL: Command succeeded but should have failed: $cmd${NC}"
  fi
}

# Helper to extract and validate frontmatter
function extract_frontmatter() {
  local file="$1"
  sed -n '/^---$/,/^---$/p' "$file" | sed '1d;$d'
}

# Helper to check if field exists in frontmatter
function has_field() {
  local frontmatter="$1"
  local field="$2"
  echo "$frontmatter" | grep -q "^$field:" && echo "true" || echo "false"
}

# Helper to validate date format
function is_valid_date() {
  local date="$1"
  [[ $date =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] && echo "true" || echo "false"
}

echo ""
echo "════════════════════════════════════════════════════════════"
echo "Pre-commit Hook Unit Tests"
echo "════════════════════════════════════════════════════════════"
echo ""

# Test 1: Valid agent spec should pass all validations
test_case "Valid agent spec passes all validations"
valid_spec="/home/user/.github/.github/scripts/__tests__/fixtures/valid-agent.agent.md"
if [ -f "$valid_spec" ]; then
  frontmatter=$(extract_frontmatter "$valid_spec")

  # Check all required fields
  required_fields=("name" "description" "file_type" "category" "status" "version" "created_date" "last_updated" "author" "language")
  all_present=true
  for field in "${required_fields[@]}"; do
    if [ "$(has_field "$frontmatter" "$field")" != "true" ]; then
      all_present=false
      break
    fi
  done

  if [ "$all_present" = "true" ]; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✅ PASS${NC}"
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}❌ FAIL: Not all required fields present${NC}"
  fi
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  echo -e "${RED}❌ FAIL: Test fixture not found${NC}"
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 2: Missing fields should fail validation
test_case "Agent with missing fields fails validation"
missing_spec="/home/user/.github/.github/scripts/__tests__/fixtures/missing-fields.agent.md"
if [ -f "$missing_spec" ]; then
  frontmatter=$(extract_frontmatter "$missing_spec")

  # Should be missing category
  if [ "$(has_field "$frontmatter" "category")" = "false" ]; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✅ PASS${NC}"
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}❌ FAIL: Should have missing category field${NC}"
  fi
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  echo -e "${RED}❌ FAIL: Test fixture not found${NC}"
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 3: Invalid date format should fail
test_case "Agent with invalid date format fails validation"
invalid_date_spec="/home/user/.github/.github/scripts/__tests__/fixtures/invalid-date-format.agent.md"
if [ -f "$invalid_date_spec" ]; then
  frontmatter=$(extract_frontmatter "$invalid_date_spec")
  created_date=$(echo "$frontmatter" | grep "^created_date:" | cut -d' ' -f2)

  if [ "$(is_valid_date "$created_date")" = "false" ]; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✅ PASS${NC}"
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}❌ FAIL: Date should be invalid${NC}"
  fi
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  echo -e "${RED}❌ FAIL: Test fixture not found${NC}"
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 4: Invalid status should fail
test_case "Agent with invalid status value fails validation"
invalid_status_spec="/home/user/.github/.github/scripts/__tests__/fixtures/invalid-status.agent.md"
if [ -f "$invalid_status_spec" ]; then
  frontmatter=$(extract_frontmatter "$invalid_status_spec")

  if grep -q "^status: experimental" <<< "$frontmatter"; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✅ PASS${NC}"
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}❌ FAIL: Status should be invalid${NC}"
  fi
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  echo -e "${RED}❌ FAIL: Test fixture not found${NC}"
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 5: Invalid file_type should fail
test_case "Agent with invalid file_type fails validation"
invalid_type_spec="/home/user/.github/.github/scripts/__tests__/fixtures/invalid-file-type.agent.md"
if [ -f "$invalid_type_spec" ]; then
  frontmatter=$(extract_frontmatter "$invalid_type_spec")

  if grep -q "^file_type: template" <<< "$frontmatter"; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✅ PASS${NC}"
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}❌ FAIL: file_type should be invalid${NC}"
  fi
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  echo -e "${RED}❌ FAIL: Test fixture not found${NC}"
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 6: Draft status is valid
test_case "Agent with draft status passes validation"
draft_spec="/home/user/.github/.github/scripts/__tests__/fixtures/draft-agent.agent.md"
if [ -f "$draft_spec" ]; then
  frontmatter=$(extract_frontmatter "$draft_spec")

  if grep -q "^status: draft" <<< "$frontmatter"; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✅ PASS${NC}"
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}❌ FAIL: Draft status should be valid${NC}"
  fi
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  echo -e "${RED}❌ FAIL: Test fixture not found${NC}"
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 7: Deprecated status is valid
test_case "Agent with deprecated status passes validation"
deprecated_spec="/home/user/.github/.github/scripts/__tests__/fixtures/deprecated-agent.agent.md"
if [ -f "$deprecated_spec" ]; then
  frontmatter=$(extract_frontmatter "$deprecated_spec")

  if grep -q "^status: deprecated" <<< "$frontmatter"; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✅ PASS${NC}"
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}❌ FAIL: Deprecated status should be valid${NC}"
  fi
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  echo -e "${RED}❌ FAIL: Test fixture not found${NC}"
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 8: No frontmatter should fail
test_case "Agent with missing frontmatter delimiter fails validation"
no_frontmatter_spec="/home/user/.github/.github/scripts/__tests__/fixtures/no-frontmatter.agent.md"
if [ -f "$no_frontmatter_spec" ]; then
  if grep -q "^---$" "$no_frontmatter_spec"; then
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}❌ FAIL: Should have missing frontmatter delimiter${NC}"
  else
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✅ PASS${NC}"
  fi
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  echo -e "${RED}❌ FAIL: Test fixture not found${NC}"
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 9: Empty name field validation
test_case "Agent with empty name field validation"
empty_name_spec="/home/user/.github/.github/scripts/__tests__/fixtures/empty-name.agent.md"
if [ -f "$empty_name_spec" ]; then
  frontmatter=$(extract_frontmatter "$empty_name_spec")
  name_value=$(echo "$frontmatter" | grep "^name:" | sed 's/^name:\s*//')

  if [ -z "$name_value" ]; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✅ PASS${NC}"
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}❌ FAIL: Name should be empty${NC}"
  fi
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  echo -e "${RED}❌ FAIL: Test fixture not found${NC}"
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 10: Category field validation
test_case "Category field is required and validated"
config_spec="/home/user/.github/.github/scripts/__tests__/fixtures/config-agent.agent.md"
if [ -f "$config_spec" ]; then
  frontmatter=$(extract_frontmatter "$config_spec")

  if grep -q "^category:" <<< "$frontmatter"; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✅ PASS${NC}"
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}❌ FAIL: Category field should be present and valid${NC}"
  fi
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  echo -e "${RED}❌ FAIL: Test fixture not found${NC}"
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

echo ""
echo "════════════════════════════════════════════════════════════"
echo "Test Summary"
echo "════════════════════════════════════════════════════════════"
echo "Total Tests: $TESTS_TOTAL"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed${NC}"
  exit 1
fi
