#!/usr/bin/env bats
# ============================================================================
# Test Name: test-run-utility-tests.bats
# Description: Main test suite for utility test runners (run-utility-tests.sh). Validates utility runner script functionality: listing, running, dry-run, verbose/quiet, summary reporting.
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
#    - bats test-run-utility-tests.bats
# Test Scope: Script validation, CLI invocation, bats references, main runner logic. Ensures all utility runner output and help text reference 'utility' not 'project'.
# ============================================================================

# Load test helpers
load '../test-helper.bash'

# ============================================================================
# Function: setup
# Description: Sets up the test environment for each test.
# Arguments: None
# Output: Defines DIR and SCRIPT variables, checks script existence and executability.
# Notes: Follows LightSpeed WP Bats standards for environment setup and path resolution.
# ============================================================================
setup() {
    DIR="$( cd "$( dirname "$BATS_TEST_FILENAME" )" >/dev/null 2>&1 && pwd )"
    SCRIPT="$DIR/../../scripts/utility/run-utility-tests.sh"
    [ -f "$SCRIPT" ]
    [ -x "$SCRIPT" ]
}

# ============================================================================
# Function: setup
# Description: Sets up the test environment for each test.
# Arguments: None
# Output: Defines DIR and SCRIPT variables, checks script existence and executability.
# Notes: Follows LightSpeed WP Bats standards for environment setup and path resolution.
# ============================================================================
setup() {
        DIR="$( cd "$( dirname "$BATS_TEST_FILENAME" )" >/dev/null 2>&1 && pwd )"
        SCRIPT="$DIR/../../scripts/utility/run-utility-tests.sh"
        [ -f "$SCRIPT" ]
        [ -x "$SCRIPT" ]

# ============================================================================
# Test Name: "script has proper shebang"
# Test Type: Basic Validation
# Test Scope: Validates that the script starts with the correct shebang line.
# ============================================================================
@test "script has proper shebang" {
    head -n1 "$SCRIPT" | grep -q "#!/bin/bash"
}

# ============================================================================
# Test Name: "script uses set -euo pipefail for safety"
# Test Type: Basic Validation
# Test Scope: Ensures the script enforces strict error handling.
# ============================================================================
@test "script uses set -euo pipefail for safety" {
    grep -q "set -euo pipefail" "$SCRIPT"
}

# ============================================================================
# Test Name: "script references bats testing framework"
# Test Type: Dependency Validation
# Test Scope: Checks that the script references the bats testing framework.
# ============================================================================
@test "script references bats testing framework" {
    grep -q "bats" "$SCRIPT"
}

# ============================================================================
# Test Name: "script can run basic test validation"
# Test Type: Help and Usage
# Test Scope: Validates that the script responds to --help and outputs usage info.
# ============================================================================
@test "script can run basic test validation" {
    run "$SCRIPT" --help
    [ "$status" -eq 0 ]
    [[ "$output" == *"Usage:"* ]]
}

# ============================================================================
# Test Name: "script runs all utility bats tests and reports summary"
# Test Type: Main Runner Logic
# Test Scope: Ensures the runner script executes all utility tests and prints a summary.
# ============================================================================
@test "script runs all utility bats tests and reports summary" {
    run "$SCRIPT"
    # Should print summary and not error out
    [[ "$output" == *"Running all utility Bats tests..."* ]]
    [[ "$output" == *"Some utility tests failed!"* || "$output" == *"All utility tests passed!"* ]]
}


# ============================================================================
# Test Name: "script lists all test files with --list"
# Test Type: Listing
# Test Scope: Validates that the runner script lists all available utility test files.
# ============================================================================
@test "script lists all test files with --list" {
    run "$SCRIPT" --list
    [ "$status" -eq 0 ]
    [[ "$output" =~ Listing\ all\ utility\ test\ files: ]]
    [[ "$output" =~ test-run-utility-tests\.bats ]]
}

# ============================================================================
# Test Name: "script runs a specific test file with --test"
# Test Type: Filtering
# Test Scope: Ensures the runner script can execute a specific test file by name.
# ============================================================================
@test "script runs a specific test file with --test" {
    # Use a known test file
    run "$SCRIPT" --test test-run-utility-tests
    [ "$status" -eq 0 ] || [ "$status" -eq 1 ]
    [[ "$output" =~ Running\ test-run-utility-tests\.bats ]]
}

# ============================================================================
# Test Name: "script supports --verbose and --quiet flags"
# Test Type: Output Modes
# Test Scope: Validates that the runner script supports verbose and quiet output modes.
# ============================================================================
@test "script supports --verbose and --quiet flags" {
    run "$SCRIPT" --verbose
    [ "$status" -eq 0 ] || [ "$status" -eq 1 ]
    [[ "$output" == *"Running"* ]]
    run "$SCRIPT" --quiet
    [ "$status" -eq 0 ] || [ "$status" -eq 1 ]
}

# ============================================================================
# Test Name: "script supports --dry-run mode"
# Test Type: Dry-Run
# Test Scope: Ensures the runner script can preview actions without executing tests.
# ============================================================================
@test "script supports --dry-run mode" {
    run "$SCRIPT" --dry-run
    [ "$status" -eq 0 ]
    [[ "$output" == *"DRY-RUN mode"* ]]
}

# ============================================================================
# Test Name: "script handles unknown options gracefully"
# Test Type: Error Handling
# Test Scope: Validates that the runner script exits with error and prints a message for unknown options.
# ============================================================================
@test "script handles unknown options gracefully" {
    run "$SCRIPT" --unknown-option
    [ "$status" -eq 1 ]
    [[ "$output" == *"Unknown option"* ]]
}
