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

load ../test-helper.bash
load ../includes/enhanced-test-helpers.bash

# ============================================================================
# Function Name: setup
# Function Type: Setup
# Function Scope: Prepares environment and resolves script path for manage-labels.sh
# ============================================================================
setup() {
  # Get the root directory of the repository
     SCRIPT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../scripts/maintenance" && pwd)/manage-labels.sh"
  echo "[DEBUG] BATS_TEST_FILENAME: $BATS_TEST_FILENAME" >&2
  echo "[DEBUG] SCRIPT: $SCRIPT" >&2
  echo "[DEBUG] Listing parent dir of SCRIPT: $(dirname "$SCRIPT")" >&2
  ls -l "$(dirname "$SCRIPT")" >&2
  [ -f "$SCRIPT" ]
  chmod +x "$SCRIPT"
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
