#!/usr/bin/env bats
# ============================================================================
# Test Name: test-prune-labels.bats
# Description: Tests prune-labels.sh for dry-run and canonical label mapping.
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
#   - bats test-prune-labels.bats
# Test Scope: dry-run, canonical mapping, error handling.
# ============================================================================


# Load test helpers
load ../test-helper.bash

# ----- Section: Setup function -----
# ============================================================================
# Function Name: setup
# Function Type: Setup
# Function Scope: Prepares environment and resolves script path for prune-labels.sh.
# ============================================================================
setup() {
	# Get the root directory of the repository
	local REPO_ROOT
	REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../.." && pwd)"
	# Path to the script being tested
	SCRIPT="$REPO_ROOT/scripts/maintenance/prune-labels.sh"

	# Ensure script exists and is executable
	[ -f "$SCRIPT" ]
	[ -x "$SCRIPT" ]
}

# ----- Section: Label Pruning Tests -----
# ============================================================================
# Test Name: prune-labels.sh runs in dry-run mode and outputs canonical label sync
# Test Type: Functional
# Test Scope: Verifies that the prune-labels.sh script runs in dry-run mode and outputs canonical label sync.
# ============================================================================
@test "prune-labels.sh runs in dry-run mode and outputs canonical label sync" {
  export DRY_RUN=true
  run "$SCRIPT"
  [ "$status" -eq 0 ]
  [[ $output =~ Fetching\ canonical\ labels ]]
  [[ $output =~ Syncing ]]
}

# ============================================================================
# Test Name: prune-labels.sh maps non-standard labels to canonical
# Test Type: Functional
# Test Scope: Verifies that the prune-labels.sh script maps non-standard labels to canonical.
# ============================================================================
@test "prune-labels.sh maps non-standard labels to canonical" {
  export DRY_RUN=true
  run "$SCRIPT"
  [ "$status" -eq 0 ]
  [[ $output =~ lang:php ]]
  [[ $output =~ area:documentation ]]
}
