#!/usr/bin/env bats
# ============================================================================
# Test Name: test-run-projects-tests.bats
# Description: Main test suite for project test runners (run-project-tests.sh). Validates project runner script functionality: listing, running, dry-run, verbose/quiet, summary reporting.
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
#    - bats test-run-projects-tests.bats
# Test Scope: Script validation, CLI invocation, bats references, main runner logic. Ensures all project runner output and help text reference 'project' not 'utility'.
# ============================================================================


# ============================================================================
# Section: Test Helper Loading
# Purpose: Loads shared test helpers for all project runner tests.
# ============================================================================
load '../test-helper.bash'

# ============================================================================
# Test Name: setup()
# Test Type: Setup Function
# Test Scope: Sets DIR and SCRIPT variables for path resolution and script existence checks. Ensures script is present and executable before running tests.
# ============================================================================
setup() {
    DIR="$( cd "$( dirname "$BATS_TEST_FILENAME" )" >/dev/null 2>&1 && pwd )"
    SCRIPT="$DIR/../../scripts/project/run-project-tests.sh"
    [ -f "$SCRIPT" ]
    [ -x "$SCRIPT" ]
}


# ============================================================================
# Test Name: "script has proper shebang"
# Test Type: Basic Validation
# Test Scope: Verifies that the runner script starts with a proper bash shebang.
# ============================================================================
@test "script has proper shebang" {
    head -n1 "$SCRIPT" | grep -q "#!/bin/bash"
}


# ============================================================================
# Test Name: "script uses set -euo pipefail for safety"
# Test Type: Safety Validation
# Test Scope: Ensures the runner script uses strict error handling for reliability.
# ============================================================================
@test "script uses set -euo pipefail for safety" {
    grep -q "set -euo pipefail" "$SCRIPT"
}


# ============================================================================
# Test Name: "script references bats testing framework"
# Test Type: Dependency Validation
# Test Scope: Checks that the runner script references the bats testing framework.
# ============================================================================
@test "script references bats testing framework" {
    grep -q "bats" "$SCRIPT"
}


# ============================================================================
# Test Name: "script can run basic test validation"
# Test Type: Help and Usage
# Test Scope: Validates that the runner script responds to --help and outputs usage information.
# ============================================================================
@test "script can run basic test validation" {
    run "$SCRIPT" --help
    [ "$status" -eq 0 ]
    [[ "$output" == *"Usage:"* ]]
}


# ============================================================================
# Test Name: "script runs all project bats tests and reports summary"
# Test Type: Main Runner
# Test Scope: Runs all project bats tests and checks for summary output and error handling.
# ============================================================================
@test "script runs all project bats tests and reports summary" {
    run "$SCRIPT"
    # Should print summary and not error out
    [[ "$output" == *"Running all project Bats tests..."* ]]
    [[ "$output" == *"Some project tests failed!"* || "$output" == *"All project tests passed!"* ]]
}


# ============================================================================
# Test Name: "script fails gracefully if bats is not installed"
# Test Type: Dependency Error Handling
# Test Scope: Ensures the runner script exits with error and outputs message if bats is missing.
# ============================================================================
@test "script fails gracefully if bats is not installed" {
    run bash -c "PATH='/nonexistent' '$SCRIPT'"
    [ "$status" -eq 1 ]
    [[ "$output" == *"bats is not installed"* ]]
}


# ============================================================================
# Test Name: "script lists all test files with --list"
# Test Type: Listing
# Test Scope: Validates that the runner script lists all available test files with --list option.
# ============================================================================
@test "script lists all test files with --list" {
    run "$SCRIPT" --list
    [ "$status" -eq 0 ]
    [[ "$output" == *"test-client-delivery-project.bats"* ]]
    [[ "$output" == *"test-product-dev-project.bats"* ]]
}


# ============================================================================
# Test Name: "script runs a specific test file with --test"
# Test Type: Targeted Test Execution
# Test Scope: Ensures the runner script can run a specific test file by name using --test option.
# ============================================================================
@test "script runs a specific test file with --test" {
    run "$SCRIPT" --test test-client-delivery-project
    [ "$status" -eq 0 ]
    [[ "$output" == *"Running test-client-delivery-project.bats"* ]]
}


# ============================================================================
# Test Name: "script supports --verbose and --quiet flags"
# Test Type: Output Mode
# Test Scope: Validates that the runner script supports verbose and quiet output modes.
# ============================================================================
@test "script supports --verbose and --quiet flags" {
    run "$SCRIPT" --verbose
    [ "$status" -eq 0 ]
    [[ "$output" == *"Running"* ]]
    run "$SCRIPT" --quiet
    [ "$status" -eq 0 ]
}


# ============================================================================
# Test Name: "script supports --dry-run mode"
# Test Type: Dry-Run Option
# Test Scope: Ensures the runner script supports dry-run mode and outputs appropriate message.
# ============================================================================
@test "script supports --dry-run mode" {
    run "$SCRIPT" --dry-run
    [ "$status" -eq 0 ]
    [[ "$output" == *"DRY-RUN mode"* ]]
}
