#!/usr/bin/env bats
# ============================================================================
# Bats Test File: tests-run-all-tests.bats
# Description: Tests the run-all-tests.sh script for correct test discovery, dry-run, verbose, and pattern filtering. Follows LightSpeed WP Bats documentation standards.
# Version: v1.0.0
# Date: 2025-10-15
# Author: LightSpeed WP Team
# Github Contributors: @lightspeedwp / @ashleyshaw
# Author URI: https://lightspeedwp.agency/
# License: GPL v3 or later
# License URI: https://www.gnu.org/licenses/gpl-3.0.html
# Requirements:
#   - bats-core
#   - bash
#   - run-all-tests.sh in repo root
# Usage:
#   bats tests-run-all-tests.bats
# Notes:
#   - Tests dry-run, verbose, and pattern filtering for the test runner script.
#   - See README.md for integration and troubleshooting.
# ============================================================================


# ============================================================================
# Function: setup
# Description: Sets up the test environment for each test.
# Arguments: None
# Output: Sets environment variables and paths.
# ============================================================================
setup() {
    load 'test-helper.bash'
    setup_test_environment
}

# ============================================================================
# Function: teardown
# Description: Cleans up the test environment after each test.
# Arguments: None
# Output: Removes temporary files and directories.
# ============================================================================
teardown() {
    cleanup_test_environment
}

@test "run-all-tests.sh runs all tests and prints summary" {
    run bash scripts/run-all-tests.sh
    [ "$status" -eq 0 ]
    [[ "$output" =~ "Bats" ]]
}

@test "run-all-tests.sh --dry-run previews test files" {
    run bash scripts/run-all-tests.sh --dry-run
    [ "$status" -eq 0 ]
    [[ "$output" =~ "DRY RUN" ]]
    [[ "$output" =~ .bats ]]
}

@test "run-all-tests.sh --verbose shows detailed output" {
    run bash scripts/run-all-tests.sh --verbose
    [ "$status" -eq 0 ]
    [[ "$output" =~ "Bats" ]]
}

@test "run-all-tests.sh --test utility runs only utility tests" {
    run bash scripts/run-all-tests.sh --test utility
    [ "$status" -eq 0 ]
    [[ "$output" =~ "utility" ]]
}
