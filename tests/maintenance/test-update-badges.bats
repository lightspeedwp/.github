#!/usr/bin/env bats
# ============================================================================
# Test Name: test-update-badges.bats
# Description: Bats tests for update-badges.sh maintenance script.
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
#   - bats test-update-badges.bats
# Test Scope: badge update in README.md.
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
  SCRIPT="$REPO_ROOT/scripts/maintenance/update-badges.sh"

  # Ensure script exists and is executable
  [ -f "$SCRIPT" ]
  [ -x "$SCRIPT" ]
}

# ----- Section: Badge Update Tests -----
# ============================================================================
# Test Name: update-badges.sh updates badges in README.md
# Test Type: Functional
# Test Scope: Verifies that the update-badges.sh script updates badges in README.md.
# ============================================================================
@test "update-badges.sh updates badges in README.md" {
  run "$SCRIPT"
  [ "$status" -eq 0 ]
  [[ $output =~ Badges\ updated\ in\ README\.md ]]
}
