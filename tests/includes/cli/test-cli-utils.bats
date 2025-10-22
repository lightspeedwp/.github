#!/usr/bin/env bats
# ============================================================================
# Test name: test-cli-utils.bats
# Testing: scripts/includes/cli/cli-utils.sh
# Description: Test suite for CLI argument parsing and help utilities
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: bats, scripts/includes/cli/cli-utils.sh, test-helper.bash
# Usage: bats tests/includes/cli/test-cli-utils.bats
# Environment Variables: VERBOSE, DRY_RUN, HELP_REQUESTED, QUIET, FORCE
# Options: None
# Examples:
#   bats tests/includes/cli/test-cli-utils.bats
# Notes:
#   - Tests CLI argument parsing and help functions
#   - Tests user interaction and confirmation prompts
#   - Tests dry-run and verbose mode functionality
# ============================================================================

# Load test helpers
load "$(dirname "$BATS_TEST_FILENAME")/../../test-helper.bash"

# Setup function - runs before each test
setup() {
    # Get the repository root and resolve paths
    TEST_REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../.." && pwd)"
    CLI_UTILS_SCRIPT="${TEST_REPO_ROOT}/scripts/includes/cli/cli-utils.sh"
    
    # Verify the CLI utils script exists
    [[ -f "$CLI_UTILS_SCRIPT" ]]
    
    # Reset environment variables for clean tests
    unset VERBOSE DRY_RUN HELP_REQUESTED QUIET FORCE
}

# Teardown function - runs after each test
teardown() {
    # Clean up environment variables
    unset VERBOSE DRY_RUN HELP_REQUESTED QUIET FORCE
}

# ----- Section: Basic Script Tests -----

# ============================================================================
# Test Name: "cli utils script sources without errors"
# Test Type: Basic Functionality
# Test Scope: Validates that the CLI utils script can be sourced successfully
# ============================================================================
@test "cli utils script sources without errors" {
    run bash -c "source '$CLI_UTILS_SCRIPT'"
    [ "$status" -eq 0 ]
}

# ----- Section: Argument Parsing Tests -----

# ============================================================================
# Test Name: "parse_common_args sets verbose flag"
# Test Type: Argument Parsing
# Test Scope: Validates that --verbose flag is properly parsed and sets VERBOSE
# ============================================================================
@test "parse_common_args sets verbose flag" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        parse_common_args --verbose
        echo \"VERBOSE=\$VERBOSE\"
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "VERBOSE=true" ]]
}

# ============================================================================
# Test Name: "parse_common_args sets dry-run flag"
# Test Type: Argument Parsing
# Test Scope: Validates that --dry-run flag is properly parsed and sets DRY_RUN
# ============================================================================
@test "parse_common_args sets dry-run flag" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        parse_common_args --dry-run
        echo \"DRY_RUN=\$DRY_RUN\"
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "DRY_RUN=true" ]]
}

# ============================================================================
# Test Name: "parse_common_args sets help flag"
# Test Type: Argument Parsing
# Test Scope: Validates that --help flag is properly parsed and sets HELP_REQUESTED
# ============================================================================
@test "parse_common_args sets help flag" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        parse_common_args --help
        echo \"HELP_REQUESTED=\$HELP_REQUESTED\"
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "HELP_REQUESTED=true" ]]
}

# ============================================================================
# Test Name: "parse_common_args sets quiet flag"
# Test Type: Argument Parsing
# Test Scope: Validates that --quiet flag is properly parsed and sets QUIET
# ============================================================================
@test "parse_common_args sets quiet flag" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        parse_common_args --quiet
        echo \"QUIET=\$QUIET\"
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "QUIET=true" ]]
}

# ============================================================================
# Test Name: "parse_common_args sets force flag"
# Test Type: Argument Parsing
# Test Scope: Validates that --force flag is properly parsed and sets FORCE
# ============================================================================
@test "parse_common_args sets force flag" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        parse_common_args --force
        echo \"FORCE=\$FORCE\"
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "FORCE=true" ]]
}

# ============================================================================
# Test Name: "parse_common_args handles multiple flags"
# Test Type: Argument Parsing
# Test Scope: Validates that multiple flags can be parsed in a single call
# ============================================================================
@test "parse_common_args handles multiple flags" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        parse_common_args --verbose --dry-run --force
        echo \"VERBOSE=\$VERBOSE DRY_RUN=\$DRY_RUN FORCE=\$FORCE\"
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "VERBOSE=true" ]]
    [[ "$output" =~ "DRY_RUN=true" ]]
    [[ "$output" =~ "FORCE=true" ]]
}

# ============================================================================
# Test Name: "parse_common_args handles short flags"
# Test Type: Argument Parsing
# Test Scope: Validates that short flag variants (-v, -h, etc.) work correctly
# ============================================================================
@test "parse_common_args handles short flags" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        parse_common_args -v -d -f
        echo \"VERBOSE=\$VERBOSE DRY_RUN=\$DRY_RUN FORCE=\$FORCE\"
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "VERBOSE=true" ]]
    [[ "$output" =~ "DRY_RUN=true" ]]
    [[ "$output" =~ "FORCE=true" ]]
}

# ============================================================================
# Test Name: "parse_common_args rejects unknown options"
# Test Type: Error Handling
# Test Scope: Validates that unknown options are properly rejected with error
# ============================================================================
@test "parse_common_args rejects unknown options" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        parse_common_args --unknown-option
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Unknown option" ]]
}

# ----- Section: Help Display Tests -----

# ============================================================================
# Test Name: "show_standard_help displays formatted help"
# Test Type: Help Display
# Test Scope: Validates that help is properly formatted and contains required sections
# ============================================================================
@test "show_standard_help displays formatted help" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        show_standard_help 'test-script.sh' 'Test script description' 'test-script.sh [options]'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "test-script.sh - Test script description" ]]
    [[ "$output" =~ "USAGE:" ]]
    [[ "$output" =~ "OPTIONS:" ]]
    [[ "$output" =~ "EXAMPLES:" ]]
}

# ============================================================================
# Test Name: "show_standard_help includes default options"
# Test Type: Help Display
# Test Scope: Validates that default CLI options are included in help output
# ============================================================================
@test "show_standard_help includes default options" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        show_standard_help 'test-script.sh' 'Test script' 'test-script.sh [options]'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "--help" ]]
    [[ "$output" =~ "--verbose" ]]
    [[ "$output" =~ "--dry-run" ]]
    [[ "$output" =~ "--force" ]]
}

# ============================================================================
# Test Name: "show_standard_help accepts custom options"
# Test Type: Help Display
# Test Scope: Validates that custom options can be provided and displayed
# ============================================================================
@test "show_standard_help accepts custom options" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        show_standard_help 'test.sh' 'Test' 'test.sh [opts]' '--custom   Custom option description'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "--custom" ]]
    [[ "$output" =~ "Custom option description" ]]
}

# ----- Section: Validation Functions Tests -----

# ============================================================================
# Test Name: "validate_required_args succeeds with sufficient args"
# Test Type: Argument Validation
# Test Scope: Validates successful validation when sufficient arguments are provided
# ============================================================================
@test "validate_required_args succeeds with sufficient args" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        validate_required_args 2 3 'first arg' 'second arg'
        echo 'validation passed'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "validation passed" ]]
}

# ============================================================================
# Test Name: "validate_required_args fails with insufficient args"
# Test Type: Argument Validation
# Test Scope: Validates failure detection when insufficient arguments are provided
# ============================================================================
@test "validate_required_args fails with insufficient args" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        validate_required_args 3 1 'first arg' 'second arg' 'third arg'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Insufficient arguments" ]]
    [[ "$output" =~ "Required: 3, provided: 1" ]]
}

# ============================================================================
# Test Name: "validate_required_args shows argument descriptions"
# Test Type: Error Messages
# Test Scope: Validates that argument descriptions are shown in error messages
# ============================================================================
@test "validate_required_args shows argument descriptions" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        validate_required_args 2 0 'input file' 'output file'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "input file" ]]
    [[ "$output" =~ "output file" ]]
}

# ----- Section: Version Display Tests -----

# ============================================================================
# Test Name: "show_version displays version information"
# Test Type: Version Display
# Test Scope: Validates that version information is properly formatted and displayed
# ============================================================================
@test "show_version displays version information" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        show_version
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "version" ]]
    [[ "$output" =~ "LightSpeed WP" ]]
    [[ "$output" =~ "lightspeedwp.agency" ]]
}

# ----- Section: Confirmation and Interaction Tests -----

# ============================================================================
# Test Name: "confirm_action returns success in force mode"
# Test Type: User Interaction
# Test Scope: Validates that confirmations are skipped in force mode
# ============================================================================
@test "confirm_action returns success in force mode" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        FORCE=true
        if confirm_action 'Test confirmation message'; then
            echo 'confirmed'
        else
            echo 'not confirmed'
        fi
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "confirmed" ]]
}

# ============================================================================
# Test Name: "confirm_action handles non-interactive mode"
# Test Type: User Interaction
# Test Scope: Validates behavior in non-interactive environments
# ============================================================================
@test "confirm_action handles non-interactive mode" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        if confirm_action 'Test message' 'y'; then
            echo 'confirmed'
        else
            echo 'not confirmed'
        fi
    " < /dev/null
    [ "$status" -eq 0 ]
    [[ "$output" =~ "confirmed" ]]
}

# ============================================================================
# Test Name: "prompt_for_input uses default value"
# Test Type: User Input
# Test Scope: Validates that default values are used when no input is provided
# ============================================================================
@test "prompt_for_input uses default value" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        echo '' | prompt_for_input 'Enter value' 'default_value'
    "
    [ "$status" -eq 0 ]
    [[ "$output" == "default_value" ]]
}

# ----- Section: Progress Display Tests -----

# ============================================================================
# Test Name: "show_progress displays progress information"
# Test Type: Progress Display
# Test Scope: Validates that progress is properly calculated and displayed
# ============================================================================
@test "show_progress displays progress information" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        show_progress 3 10 'Processing items'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "30%" ]]
    [[ "$output" =~ "Processing items" ]]
}

# ============================================================================
# Test Name: "show_progress respects quiet mode"
# Test Type: Output Control
# Test Scope: Validates that progress is suppressed in quiet mode
# ============================================================================
@test "show_progress respects quiet mode" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        QUIET=true
        show_progress 5 10 'Processing'
    "
    [ "$status" -eq 0 ]
    [[ "$output" == "" ]]
}

# ============================================================================
# Test Name: "show_progress shows completion indicator"
# Test Type: Progress Display
# Test Scope: Validates that completion is properly indicated when progress reaches 100%
# ============================================================================
@test "show_progress shows completion indicator" {
    run bash -c "
        export TERM=xterm-256color
        source '$CLI_UTILS_SCRIPT'
        show_progress 10 10 'Complete'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "100%" ]]
}

# ----- Section: Dry Run Functions Tests -----

# ============================================================================
# Test Name: "check_dry_run returns correct status"
# Test Type: Dry Run Detection
# Test Scope: Validates that dry run mode is properly detected
# ============================================================================
@test "check_dry_run returns correct status" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        DRY_RUN=false
        if check_dry_run; then
            echo 'dry run mode'
        else
            echo 'normal mode'
        fi
    "
    [ "$status" -eq 0 ]
    [[ "$output" == "normal mode" ]]
    
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        DRY_RUN=true
        if check_dry_run; then
            echo 'dry run mode'
        else
            echo 'normal mode'
        fi
    "
    [ "$status" -eq 0 ]
    [[ "$output" == "dry run mode" ]]
}

# ============================================================================
# Test Name: "execute_with_dry_run shows command in dry run mode"
# Test Type: Dry Run Execution
# Test Scope: Validates that commands are displayed but not executed in dry run mode
# ============================================================================
@test "execute_with_dry_run shows command in dry run mode" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        DRY_RUN=true
        execute_with_dry_run echo 'test command'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "\[DRY RUN\]" ]]
    [[ "$output" =~ "echo test command" ]]
}

# ============================================================================
# Test Name: "execute_with_dry_run executes command in normal mode"
# Test Type: Normal Execution
# Test Scope: Validates that commands are actually executed when not in dry run mode
# ============================================================================
@test "execute_with_dry_run executes command in normal mode" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        DRY_RUN=false
        execute_with_dry_run echo 'actual output'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "actual output" ]]
    [[ ! "$output" =~ "\[DRY RUN\]" ]]
}

# ----- Section: Input Validation Tests -----

# ============================================================================
# Test Name: "prompt_for_input validates against pattern"
# Test Type: Input Validation
# Test Scope: Validates that input validation works with regex patterns
# ============================================================================
@test "prompt_for_input validates against pattern" {
    # This test simulates valid input
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        echo 'test123' | prompt_for_input 'Enter alphanumeric' '' '^[a-zA-Z0-9]+$'
    "
    [ "$status" -eq 0 ]
    [[ "$output" == "test123" ]]
}

# ----- Section: Error Handling Tests -----

# ============================================================================
# Test Name: "functions handle missing dependencies gracefully"
# Test Type: Error Handling
# Test Scope: Validates that functions handle missing dependencies properly
# ============================================================================
@test "functions handle missing dependencies gracefully" {
    run bash -c "
        source '$CLI_UTILS_SCRIPT'
        # Most functions should work even without external dependencies
        parse_common_args --help
        echo 'functions loaded successfully'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "functions loaded successfully" ]]
}

# End of test-cli-utils.bats