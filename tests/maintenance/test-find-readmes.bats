#!/usr/bin/env bats
# ============================================================================
# Test Name: test-find-readmes.bats
# Description: Tests find-readmes.sh for listing all README files
# Version: v0.1.0
# Date: 14-10-2025
# Author: LightSpeedWP
# Author URI: https://lightspeedwp.agency/
# License: GPL v3 or later
# License URI: https://www.gnu.org/licenses/gpl-3.0.html
# Github Author: @lightspeedwp / @ashleyshaw
# Requirements:
#   - bats-core
#   - test-helper.bash
# Usage:
#   - bats test-find-readmes.bats
# Test Scope: README file listing.
# ============================================================================


# Load test helpers
load ../test-helper.bash

# ----- Section: Setup function -----
# ============================================================================
# Function Name: setup
# Function Type: Setup
# Function Scope: Prepares environment and resolves script path for find-readmes.sh.
# ============================================================================
setup() {
  # Get the root directory of the repository
  local REPO_ROOT
  REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../.." && pwd)"
  # Path to the script being tested
  SCRIPT="$REPO_ROOT/scripts/maintenance/find-readmes.sh"

  # Ensure script exists and is executable
  [ -f "$SCRIPT" ]
  [ -x "$SCRIPT" ]
}

# ----- Section: README Listing Tests -----
# ============================================================================
# Test Name: find-readmes.sh lists all README files
# Test Type: Functional
# Test Scope: Verifies that the find-readmes.sh script correctly lists README files.
# ============================================================================
@test "find-readmes.sh lists all README files" {
  run "$SCRIPT"
  [ "$status" -eq 0 ]
  [[ "$output" =~ "README.md" ]]
}
