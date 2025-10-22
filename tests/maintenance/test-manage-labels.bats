#!/usr/bin/env bats
#
# Function Name: test-manage-labels.bats
# Description: Tests manage-labels.sh for dry-run and label sync output
# Version: v0.1.0
# Date: 14-10-2025
# Author: LightSpeedWP
# Author URI: https://lightspeedwp.agency/
# License: GPL v3 or later
# License URI: https://www.gnu.org/licenses/gpl-3.0.html
# Github Author: @lightspeedwp / @ashleyshaw
# Requirements:
#    - bats-core
#    - test-helper.bash
# Usage:
#    - bats test-manage-labels.bats
# Function Scope: dry-run, label sync, error handling.

# Load test helpers
load ../test-helper.bash

# ============================================================================
# Function Name: setup
# Function Type: Setup
# Function Scope: Prepares environment and resolves script path for manage-labels.sh
# ============================================================================
setup() {
  # Get the root directory of the repository
  local REPO_ROOT
  REPO_ROOT="$(cd \"$(dirname \"$BATS_TEST_FILENAME\")/../..\" && pwd)"
  # Path to the script being tested
  SCRIPT="$REPO_ROOT/scripts/maintenance/manage-labels.sh"

  # Ensure script exists and is executable
  [ -f "$SCRIPT" ]
  [ -x "$SCRIPT" ]
}

# ============================================================================
# Function Name: manage-labels.sh runs in dry-run mode and outputs label sync
# Function Type: Functional
# Function Scope: Verifies that the manage-labels.sh script runs in dry-run mode and outputs label sync.
# ============================================================================
@test "manage-labels.sh runs in dry-run mode and outputs label sync" {
    export DRY_RUN=true
    run "$SCRIPT"
    [ "$status" -eq 0 ]
        [[ $output =~ Fetching ]]
        [[ $output =~ Syncing ]]
}
