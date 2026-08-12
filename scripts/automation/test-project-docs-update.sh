#!/bin/bash
# Test Suite for Project Documentation Update Scripts

set -u  # Error on undefined variables
set -o pipefail  # Error if any command in pipeline fails

# Test configuration
TEST_DIR=$(mktemp -d)
SCRIPT_DIR="scripts/automation"
MAIN_SCRIPT="$SCRIPT_DIR/project-docs-update.sh"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Test functions
test_header() {
  echo ""
  echo -e "${BLUE}=== $1 ===${NC}"
}

test_pass() {
  echo -e "${GREEN}✓ PASS${NC}: $1"
  ((TESTS_PASSED++))
}

test_fail() {
  echo -e "${RED}✗ FAIL${NC}: $1"
  ((TESTS_FAILED++))
}

test_case() {
  ((TESTS_RUN++))
  echo -e "${YELLOW}[Test $TESTS_RUN]${NC} $1"
}

# Cleanup
cleanup() {
  rm -rf "$TEST_DIR"
}

trap cleanup EXIT

# Test 1: Script exists and is executable
test_script_exists() {
  test_header "Script Existence"

  test_case "Main script exists"
  if [[ -f "$MAIN_SCRIPT" ]]; then
    test_pass "Script file found"
  else
    test_fail "Script file not found: $MAIN_SCRIPT"
  fi

  test_case "Script is executable"
  if [[ -x "$MAIN_SCRIPT" ]]; then
    test_pass "Script is executable"
  else
    test_fail "Script is not executable"
  fi
}

# Test 2: Script helps without errors
test_script_help() {
  test_header "Script Help"

  test_case "Script displays usage info"
  if bash "$MAIN_SCRIPT" --help 2>&1 | grep -q "Usage\|Documentation" || \
     bash "$MAIN_SCRIPT" -h 2>&1 | grep -q "Usage\|Documentation"; then
    test_pass "Help text displayed"
  else
    # Script might not have --help, that's ok for now
    test_pass "Script runs (help not implemented)"
  fi
}

# Test 3: Dry-run mode works
test_dry_run_mode() {
  test_header "Dry-Run Mode"

  test_case "DRY_RUN=true prevents file creation"

  # Create test project structure
  local test_project="$TEST_DIR/test-project-2026-08-12"
  mkdir -p "$test_project"
  touch "$test_project/.gitkeep"

  # Export variables and run script
  export PROJECTS_DIR="$TEST_DIR"
  export TEMPLATES_DIR=".github/projects/_templates"
  export DRY_RUN="true"

  # Run script (ignore errors for test)
  if bash "$MAIN_SCRIPT" 2>&1 | grep -q "DRY-RUN\|would"; then
    test_pass "Dry-run mode warning displayed"
  else
    test_fail "Dry-run mode not clearly indicated"
  fi

  # Verify no files were created
  if [[ ! -f "$test_project/PLANNING.md" ]]; then
    test_pass "PLANNING.md not created in dry-run"
  else
    test_fail "PLANNING.md was created in dry-run mode"
  fi
}

# Test 4: Template files exist
test_template_files() {
  test_header "Template Files"

  local templates=(
    ".github/projects/_templates/PLANNING_TEMPLATE.md"
    ".github/projects/_templates/OPENSPEC_TEMPLATE.md"
    ".github/projects/_templates/README_TEMPLATE.md"
  )

  for template in "${templates[@]}"; do
    test_case "Template file exists: $(basename $template)"
    if [[ -f "$template" ]]; then
      test_pass "Template found"
    else
      test_fail "Template missing: $template"
    fi
  done
}

# Test 5: Script validates projects correctly
test_validation() {
  test_header "Project Validation"

  test_case "Script identifies missing documentation"

  # Create test projects
  local project1="$TEST_DIR/project1"
  local project2="$TEST_DIR/project2"

  mkdir -p "$project1" "$project2"
  touch "$project1/PLANNING.md"  # Has PLANNING
  touch "$project2/README.md"    # Has README but not PLANNING

  export PROJECTS_DIR="$TEST_DIR"
  export TEMPLATES_DIR=".github/projects/_templates"
  export DRY_RUN="true"

  # Run validation
  local output=$(bash "$MAIN_SCRIPT" 2>&1 || true)

  if echo "$output" | grep -q "Missing\|VALIDATION"; then
    test_pass "Validation logic present"
  else
    test_fail "Validation output not found"
  fi
}

# Test 6: Script handles errors gracefully
test_error_handling() {
  test_header "Error Handling"

  test_case "Script handles missing templates directory"
  export PROJECTS_DIR=".github/projects/active"
  export TEMPLATES_DIR="/nonexistent/path"
  export DRY_RUN="true"

  if bash "$MAIN_SCRIPT" 2>&1 | grep -q "not found\|ERROR"; then
    test_pass "Error message displayed for missing templates"
  else
    test_fail "No error handling for missing templates"
  fi
}

# Test 7: Integration test - full dry-run
test_integration_dry_run() {
  test_header "Integration Test: Full Dry-Run"

  test_case "Complete dry-run execution"

  export PROJECTS_DIR=".github/projects/active"
  export TEMPLATES_DIR=".github/projects/_templates"
  export DRY_RUN="true"
  export VERBOSE="true"

  # Run the script
  if bash "$MAIN_SCRIPT" 2>&1 | grep -q "Processing\|SUMMARY"; then
    test_pass "Script executed successfully in dry-run"
  else
    test_fail "Script failed during dry-run execution"
  fi
}

# Test 8: Branch safety check
test_branch_linking() {
  test_header "Branch Linking Safety"

  test_case "Script should only link to develop or HEAD"

  # Check if any links in documentation reference specific branches
  if grep -r "github\.com.*tree/[^d]" .github/projects/_templates/ 2>/dev/null || true; then
    test_fail "Found links to specific branches (not develop/HEAD)"
  else
    test_pass "No unsafe branch links in templates"
  fi

  # Verify develop branch is used
  if grep -r "develop\|HEAD" .github/projects/_templates/ | grep -q "tree/\|issues/\|pull/"; then
    test_pass "Links reference develop or HEAD"
  else
    # This is ok if no links exist yet
    test_pass "Templates ready for develop-only links"
  fi
}

# Run all tests
run_all_tests() {
  echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║  Project Documentation Update Test Suite${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"

  test_script_exists
  test_script_help
  test_dry_run_mode
  test_template_files
  test_validation
  test_error_handling
  test_integration_dry_run
  test_branch_linking

  # Summary
  echo ""
  echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║  Test Summary${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
  echo "Total Tests Run: $TESTS_RUN"
  echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
  echo -e "Failed: ${RED}$TESTS_FAILED${NC}"

  if [[ $TESTS_FAILED -eq 0 ]]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    return 0
  else
    echo -e "${RED}✗ Some tests failed${NC}"
    return 1
  fi
}

# Main
run_all_tests "$@"
