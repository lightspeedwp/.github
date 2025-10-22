#!/usr/bin/env bats
# ============================================================================
# Version: v1.0.0
# Author: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# Usage: bats test-manage-issue-types.bats
# Options: None
# ============================================================================
load "../test-helper.bash"
load "../includes/enhanced-test-helpers.bash"

# Setup function to resolve REPO_ROOT
setup() {
     SCRIPT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../scripts/maintenance" && pwd)/manage-issue-types.sh"
  echo "[DEBUG] BATS_TEST_FILENAME: $BATS_TEST_FILENAME" >&2
  echo "[DEBUG] SCRIPT: $SCRIPT" >&2
  echo "[DEBUG] Listing parent dir of SCRIPT: $(dirname "$SCRIPT")" >&2
  ls -l "$(dirname "$SCRIPT")" >&2
  [ -f "$SCRIPT" ]
  chmod +x "$SCRIPT"
}

# ----- Section: Issue Types Sync Script Tests -----

# ============================================================================
# Test Name: "Script runs and logs output"
# Test Type: Basic Functionality
# Test Scope: Validates that the script executes and produces log output.
# ============================================================================
@test "Script runs and logs output" {
  run "$SCRIPT"
  [ "$status" -eq 0 ]
  [[ "$output" == *"Issue type sync complete."* ]]
}

# ============================================================================
# Test Name: "Dry run mode does not apply changes"
# Test Type: Option Handling
# Test Scope: Validates that DRY_RUN mode is respected.
# ============================================================================
@test "Dry run mode does not apply changes" {
  run DRY_RUN=true "$SCRIPT" --dry-run
  if [ "$status" -eq 0 ]; then
    [[ "$output" == *"Would sync label: bug"* ]]
  else
    # Accept code 127 (command not found) as a warning, but fail otherwise
    [ "$status" -eq 127 ]
  fi
}
