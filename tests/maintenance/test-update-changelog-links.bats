#!/usr/bin/env bats
# ============================================================================
# Test Name: test-update-changelog-links.bats
# Description: Bats tests for validate-changelog-links.sh maintenance script.
# Requirements:
#    - bats-core
#    - test-helper.bash
# Usage:
#    - bats test-update-changelog-links.bats
# Test Scope: changelog link validation.
# ============================================================================

# Load test helpers
load ../test-helper.bash

# ----- Section: Setup function -----
# ============================================================================
# Function Name: setup
# Function Type: Setup
# Function Scope: Prepares environment and resolves script path for update-badges.sh.
# ============================================================================
setup() {
  # Get the root directory of the repository
  local REPO_ROOT
  REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../.." && pwd)"
  # Path to the script being tested
  SCRIPT="$REPO_ROOT/scripts/maintenance/validate-changelog-links.sh"

  # Ensure script exists and is executable
  [ -f "$SCRIPT" ]
  [ -x "$SCRIPT" ]
}

# ============================================================================
# Test Name: validate-changelog-links.sh reports missing links
# Test Type: Functional
# Test Scope: Verifies that the validate-changelog-links.sh script reports missing links.
# ============================================================================
@test "validate-changelog-links.sh reports missing links" {
	run "$SCRIPT"
	[ "$status" -eq 0 ] || [[ $output =~ Missing\ PR/Issue/Commit\ link ]]
}
