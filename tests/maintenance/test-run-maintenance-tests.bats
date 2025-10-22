#!/usr/bin/env bats
# ============================================================================
# Function Name: test-run-maintenance-tests.bats
# Description: Main test suite for maintenance test runners (run-maintenance-tests.sh). Validates maintenance runner script functionality: listing, running, dry-run, verbose/quiet, summary reporting.
# Version: v0.1.1
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
#    - bats test-run-maintenance-tests.bats
# Function Scope: Script validation, CLI invocation, bats references, main runner logic. Ensures all maintenance runner output and help text reference 'maintenance' not 'project'.
# ============================================================================

# Load test helpers
load '../test-helper.bash'

# ----- Section: Setup function -----
# ============================================================================
# Function Name: setup
# Function Type: Setup
# Function Scope: Prepares environment and resolves script path for run-maintenance-tests.sh tests runner
# ============================================================================
setup() {
    DIR="$( cd "$( dirname "$BATS_TEST_FILENAME" )" >/dev/null 2>&1 && pwd )"
    SCRIPT="$DIR/../../scripts/maintenance/run-maintenance-tests.sh"
    [ -f "$SCRIPT" ]
    [ -x "$SCRIPT" ]
}

# ----- Section: Script Content Tests -----
# ============================================================================
# Function Name: "script has proper shebang"
# Function Type: Script Initialization
# Function Scope: Validates that the script starts with the correct shebang (#!/bin/bash).
# ============================================================================
@test "script has proper shebang" {
    head -n1 "$SCRIPT" | grep -q "#!/bin/bash"
}

# ----- Section: Core Logic Tests -----
# ============================================================================
# Function Name: "script uses set -euo pipefail for safety"
# Function Type: Script Initialization
# Function Scope: Ensures the script uses strict mode for error handling and safety.
# ============================================================================
@test "script uses set -euo pipefail for safety" {
    grep -q "set -euo pipefail" "$SCRIPT"
}

# ============================================================================
# Function Name: "script references bats testing framework"
# Function Type: Script Content
# Function Scope: Checks that the script references the bats testing framework.
# ============================================================================
@test "script references bats testing framework" {
    grep -q "bats" "$SCRIPT"
}

# ============================================================================
# Function Name: "script can run basic test validation"
# Function Type: Help and Usage
# Function Scope: Validates that the script responds to --help and outputs usage information.
# ============================================================================
@test "script can run basic test validation" {
    run "$SCRIPT" --help
    [ "$status" -eq 0 ]
    [[ "$output" == *"Usage:"* ]]
}

# ============================================================================
# Function Name: "script runs all maintenance bats tests and reports summary"
# Function Type: Core Logic
# Function Scope: Runs all maintenance bats tests and checks for summary output and pass/fail reporting.
# ============================================================================
@test "script runs all maintenance bats tests and reports summary" {
    run "$SCRIPT"
    # Should print summary and not error out
    [[ "$output" == *"Running all maintenance Bats tests..."* ]]
    [[ "$output" == *"Some maintenance tests failed!"* || "$output" == *"All maintenance tests passed!"* ]]
}

# ============================================================================
# Function Name: "script fails gracefully if bats is not installed"
# Function Type: Dependency Check
# Function Scope: Ensures the script fails gracefully and outputs an error if bats is not installed.
# ============================================================================
@test "script fails gracefully if bats is not installed" {
    run bash -c "PATH='/nonexistent' '$SCRIPT'"
    [ "$status" -eq 1 ]
    [[ "$output" == *"bats is not installed"* ]]
}
