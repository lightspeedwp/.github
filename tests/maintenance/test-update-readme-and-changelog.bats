
#!/usr/bin/env bats
# ============================================================================
# Test name: test-update-readme-and-changelog.bats
# Testing: update-readme-and-changelog.sh script
# Description: Bats test suite for update-readme-and-changelog.sh. Validates script execution, output, and error handling. Ensures compliance with LightSpeed WP standards for shell script documentation and test coverage.
# Version: v0.1.0
# Date: 2025-10-15
# Author: LightSpeedWP
# Author URI: https://lightspeedwp.agency/
# License: GPL v3 or later
# License URI: https://www.gnu.org/licenses/gpl-3.0.html
# Github Author: @lightspeedwp
# Requirements:
#   - bats-core         # The testing framework
#   - test-helper.bash  # Shared test helpers
# Usage:
#   - bats tests/maintenance/test-update-readme-and-changelog.bats
# Options:
#   - None
# Test Scope:
#   - Validates existence and executability of update-readme-and-changelog.sh
#   - Tests: script runs without error, updates README.md, outputs expected message
# ============================================================================

# Load test helpers
load '../test-helper.bash'

# ----- Section: Setup and Path Resolution -----
# ============================================================================
# Function: setup
# Description: Sets up the test environment for update-readme-and-changelog.sh tests.
# Arguments: None
# Output: Sets REPO_ROOT, SCRIPT path, ensures script exists and is executable.
# Notes: Ensures script path is correct for all tests.
# ============================================================================
setup() {
    local REPO_ROOT
    REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../.." && pwd)"
    SCRIPT="$REPO_ROOT/scripts/maintenance/update-readme-and-changelog.sh"
    [ -f "$SCRIPT" ]
    [ -x "$SCRIPT" ]
}

# ----- Section: Script Execution Tests -----
# ============================================================================
# Test Name: "update-readme-and-changelog.sh runs without error"
# Test Type: Functional
# Test Scope: Verifies that the update-readme-and-changelog.sh script runs without error.
# ============================================================================
@test "update-readme-and-changelog.sh runs without error" {
  run "$SCRIPT"
  [ "$status" -eq 0 ]
}

# ============================================================================
# Test Name: "update-readme-and-changelog.sh updates README.md"
# Test Type: Functional
# Test Scope: Verifies that the script runs and outputs the expected message.
# ============================================================================
@test "update-readme-and-changelog.sh updates README.md" {
  run "$SCRIPT"
  [ "$status" -eq 0 ]
  [[ "$output" == *"README and CHANGELOG update process executed."* ]]
}
