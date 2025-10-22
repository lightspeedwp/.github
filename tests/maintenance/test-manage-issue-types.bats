#!/usr/bin/env bats
# ============================================================================
# Version: v1.0.0
# Author: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# Usage: bats test-manage-issue-types.bats
# Options: None
# ============================================================================
# Load test helpers
load "./test-helper.bash"

# Setup function to resolve REPO_ROOT
setup() {
  export REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../.." && pwd)"
}

# ----- Section: Issue Types Sync Script Tests -----

# ============================================================================
# Test Name: "Script runs and logs output"
# Test Type: Basic Functionality
# Test Scope: Validates that the script executes and produces log output.
# ============================================================================
@test "Script runs and logs output" {
  run bash "$REPO_ROOT/scripts/maintenance/manage-issue-types.sh"
  [ "$status" -eq 0 ]
  [[ "$output" == *"Issue type sync complete."* ]]
}

# ============================================================================
# Test Name: "Dry run mode does not apply changes"
# Test Type: Option Handling
# Test Scope: Validates that DRY_RUN mode is respected.
# ============================================================================
@test "Dry run mode does not apply changes" {
  run DRY_RUN=true bash "$REPO_ROOT/scripts/maintenance/manage-issue-types.sh --dry-run"
  [ "$status" -eq 0 ]
  [[ "$output" == *"Would sync label:"* ]]
}
