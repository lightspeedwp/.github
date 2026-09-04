#!/bin/bash

# Test Runner for Phase 5 Validation Tests
# Runs all test suites and generates coverage report

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test results tracking
TOTAL_SUITES=0
PASSED_SUITES=0
FAILED_SUITES=0
OVERALL_TESTS_PASSED=0
OVERALL_TESTS_FAILED=0

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/../../../" && pwd )"

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "Phase 5 Validation Test Suite Runner"
echo "════════════════════════════════════════════════════════════════════"
echo ""
echo "Repository Root: $REPO_ROOT"
echo "Test Directory: $SCRIPT_DIR"
echo ""

# Function to run a test suite
function run_test_suite() {
  local suite_name="$1"
  local test_file="$2"

  TOTAL_SUITES=$((TOTAL_SUITES + 1))
  echo ""
  echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo "${BLUE}Suite $TOTAL_SUITES: $suite_name${NC}"
  echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""

  if [ ! -f "$test_file" ]; then
    echo -e "${RED}❌ Test file not found: $test_file${NC}"
    FAILED_SUITES=$((FAILED_SUITES + 1))
    return 1
  fi

  # Determine how to run the test based on file extension
  if [[ "$test_file" == *.sh ]]; then
    echo "Running bash test suite..."
    if bash "$test_file"; then
      echo -e "${GREEN}✅ Suite passed${NC}"
      PASSED_SUITES=$((PASSED_SUITES + 1))
      return 0
    else
      echo -e "${RED}❌ Suite failed${NC}"
      FAILED_SUITES=$((FAILED_SUITES + 1))
      return 1
    fi
  elif [[ "$test_file" == *.js ]]; then
    echo "Running Node.js test suite..."
    if cd "$REPO_ROOT" && node "$test_file"; then
      echo -e "${GREEN}✅ Suite passed${NC}"
      PASSED_SUITES=$((PASSED_SUITES + 1))
      return 0
    else
      echo -e "${RED}❌ Suite failed${NC}"
      FAILED_SUITES=$((FAILED_SUITES + 1))
      return 1
    fi
  else
    echo -e "${RED}❌ Unknown test file type: $test_file${NC}"
    FAILED_SUITES=$((FAILED_SUITES + 1))
    return 1
  fi
}

# Run all test suites
echo -e "${YELLOW}Running test suites...${NC}"
echo ""

run_test_suite \
  "Workflow Integration Tests" \
  "$SCRIPT_DIR/workflow-integration.test.js"

run_test_suite \
  "Pre-commit Hook Validation Tests" \
  "$SCRIPT_DIR/../../../hooks/__tests__/pre-commit-agent-spec-validation.test.sh"

run_test_suite \
  "Validation Script Unit Tests" \
  "$SCRIPT_DIR/validate-agent-specs.test.js"

run_test_suite \
  "Index Generator Unit Tests" \
  "$SCRIPT_DIR/generate-agent-index.test.js"

run_test_suite \
  "Agent Spec Generator CLI Tests" \
  "$SCRIPT_DIR/create-agent-spec.test.js"

# Summary
echo ""
echo "${BLUE}════════════════════════════════════════════════════════════════════${NC}"
echo "${BLUE}Test Execution Summary${NC}"
echo "${BLUE}════════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Total Test Suites: $TOTAL_SUITES"
echo -e "${GREEN}Passed: $PASSED_SUITES${NC}"
echo -e "${RED}Failed: $FAILED_SUITES${NC}"
echo ""

# Fixture coverage summary
echo -e "${YELLOW}Test Fixtures:${NC}"
FIXTURE_COUNT=$(find "$SCRIPT_DIR/fixtures" -name "*.agent.md" 2>/dev/null | wc -l)
echo "  Total fixture specs: $FIXTURE_COUNT"
echo ""

# Success/failure determination
if [ $FAILED_SUITES -eq 0 ]; then
  echo -e "${GREEN}✅ All test suites passed!${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}❌ Some test suites failed${NC}"
  echo ""
  exit 1
fi
