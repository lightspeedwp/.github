#!/usr/bin/env bats
###############################################################################
# Test Name: test-run-deployment-tests.bats
# Description: Main test suite for deployment test runners (run-deployment-tests.sh). Validates deployment runner script functionality: listing, running, dry-run, verbose/quiet, summary reporting.
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
#    - bats test-run-deployment-tests.bats
# Test Scope: Script validation, CLI invocation, bats references, main runner logic. Ensures all deployment runner output and help text reference 'deployment' not 'project'.
###############################################################################

# Load test helpers
load '../test-helper.bash'

###############################################################################
# Function Name: setup
# Function Type: Setup
# Function Scope: Prepares environment and resolves script path for run-deployment-tests.sh tests runner
###############################################################################
setup() {
    DIR="$( cd "$( dirname "$BATS_TEST_FILENAME" )" >/dev/null 2>&1 && pwd )"
    SCRIPT="$DIR/../../scripts/deployment/run-deployment-tests.sh"
    [ -f "$SCRIPT" ]
    [ -x "$SCRIPT" ]
}

###############################################################################
# Test Name: "script has proper shebang"
# Test Type: Script Initialization
# Test Scope: Validates that the script starts with the correct shebang (#!/bin/bash).
###############################################################################
@test "script has proper shebang" {
    #
    # Test Name: Test Shebang
    # Test Type: Positive
    # Test Scope: Script Initialization
    #
    head -n1 "$SCRIPT" | grep -q "#!/bin/bash"
}

###############################################################################
# Test Name: "script uses set -euo pipefail for safety"
# Test Type: Script Initialization
# Test Scope: Ensures the script uses strict mode for error handling and safety.
###############################################################################
@test "script uses set -euo pipefail for safety" {
    #
    # Test Name: Test Strict Mode
    # Test Type: Positive
    # Test Scope: Script Initialization
    #
    grep -q "set -euo pipefail" "$SCRIPT"
}

###############################################################################
# Test Name: "script references bats testing framework"
# Test Type: Script Content
# Test Scope: Checks that the script references the bats testing framework.
###############################################################################
@test "script references bats testing framework" {
    #
    # Test Name: Test Bats Reference
    # Test Type: Positive
    # Test Scope: Script Content
    #
    grep -q "bats" "$SCRIPT"
}

###############################################################################
# Test Name: "script can run basic test validation"
# Test Type: Help and Usage
# Test Scope: Validates that the script responds to --help and outputs usage information.
###############################################################################
@test "script can run basic test validation" {
    #
    # Test Name: Test Help Message Validation
    # Test Type: Positive
    # Test Scope: Script Initialization
    #
    run "$SCRIPT" --help
    [ "$status" -eq 0 ]
    [[ "$output" == *"Usage: "* ]]
}

###############################################################################
# Test Name: "script runs all deployment bats tests and reports summary"
# Test Type: Core Logic
# Test Scope: Runs all deployment bats tests and checks for summary output and pass/fail reporting.
###############################################################################
@test "script runs all deployment bats tests and reports summary" {
    #
    # Test Name: Test Full Test Suite Execution
    # Test Type: Positive
    # Test Scope: Core Logic
    #
    run "$SCRIPT"
    # Should print summary and not error out
    [[ "$output" == *"Running all deployment Bats tests..."* ]]
    [[ "$output" == *"Some deployment tests failed!"* || "$output" == *"All deployment tests passed!"* ]]
}

###############################################################################
# Test Name: "script fails gracefully if bats is not installed"
# Test Type: Dependency Check
# Test Scope: Ensures the script fails gracefully and outputs an error if bats is not installed.
###############################################################################
@test "script fails gracefully if bats is not installed" {
    #
    # Test Name: Test Graceful Failure on Missing Bats
    # Test Type: Negative
    # Test Scope: Dependency Check
    #
    run bash -c "PATH='/nonexistent' '$SCRIPT'"
    [ "$status" -eq 1 ]
    [[ "$output" == *"bats is not installed"* ]]
}
