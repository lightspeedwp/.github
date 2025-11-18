#!/usr/bin/env bats

# ============================================================================
# Test Name: test-cli-utils.bats
# Testing: scripts/includes/cli-utils.sh
# Description: Comprehensive tests for CLI argument parsing and help utilities
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# Usage: bats test-cli-utils.bats
# Options: None
# ============================================================================

# Load test helpers
load "$(dirname "$BATS_TEST_FILENAME")/../test-helper.bash"

# Setup function runs before each test
setup() {
    # Setup test environment for each test
    TEST_TEMP_DIR=$(mktemp -d)
    export TEST_TEMP_DIR
    export LOG_FILE="$TEST_TEMP_DIR/test.log"

    # Reset CLI flags
    export VERBOSE="false"
    export DRY_RUN="false"
    export HELP_REQUESTED="false"
    export QUIET="false"
    export FORCE="false"

    # Load the includes being tested
    SCRIPTS_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../scripts" && pwd)"

    # Disable strict mode temporarily to source the files
    set +euo pipefail
    # Source dependencies first
    source "$SCRIPTS_DIR/includes/colors.sh" 2>/dev/null || true
    source "$SCRIPTS_DIR/includes/logging.sh" 2>/dev/null || true

    # Create mock new-feature.sh if it doesn't exist (cli-utils.sh references it)
    if [[ ! -f "$SCRIPTS_DIR/includes/core/new-feature.sh" ]]; then
        mkdir -p "$SCRIPTS_DIR/includes/core"
        touch "$SCRIPTS_DIR/includes/core/new-feature.sh"
    fi

    source "$SCRIPTS_DIR/includes/cli/cli-utils.sh" 2>/dev/null || true
    set -euo pipefail
}

# Teardown function runs after each test
teardown() {
    # Cleanup after each test
    [[ -n "$TEST_TEMP_DIR" && -d "$TEST_TEMP_DIR" ]] && rm -rf "$TEST_TEMP_DIR"
    unset LOG_FILE
    unset VERBOSE DRY_RUN HELP_REQUESTED QUIET FORCE
}

# ----- Section: Help Display -----

# ============================================================================
# Test Name: "show_standard_help displays help message"
# Test Type: Unit Test
# Test Scope: Validates show_standard_help outputs formatted help text
# ============================================================================
@test "show_standard_help displays help message" {
    run show_standard_help "test-script" "Test description" "test-script [options]"

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"test-script"* ]]
    [[ "$output" == *"Test description"* ]]
    [[ "$output" == *"USAGE"* ]]
}

# ============================================================================
# Test Name: "show_standard_help displays default options"
# Test Type: Unit Test
# Test Scope: Validates show_standard_help includes standard CLI options
# ============================================================================
@test "show_standard_help displays default options" {
    run show_standard_help "test-script" "Description" "Usage"

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"--help"* ]]
    [[ "$output" == *"--verbose"* ]]
    [[ "$output" == *"--dry-run"* ]]
    [[ "$output" == *"--force"* ]]
}

# ============================================================================
# Test Name: "show_standard_help accepts custom options"
# Test Type: Unit Test
# Test Scope: Validates show_standard_help with custom option array
# ============================================================================
@test "show_standard_help accepts custom options" {
    run show_standard_help "script" "Desc" "Usage" \
        "--custom    Custom option" \
        "--another   Another option"

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"--custom"* ]]
    [[ "$output" == *"--another"* ]]
}

# ----- Section: Argument Parsing -----

# ============================================================================
# Test Name: "parse_common_args sets VERBOSE flag"
# Test Type: Unit Test
# Test Scope: Validates parse_common_args recognizes --verbose flag
# ============================================================================
@test "parse_common_args sets VERBOSE flag" {
    parse_common_args "--verbose"

    [[ "$VERBOSE" == "true" ]]
}

# ============================================================================
# Test Name: "parse_common_args sets DRY_RUN flag"
# Test Type: Unit Test
# Test Scope: Validates parse_common_args recognizes --dry-run flag
# ============================================================================
@test "parse_common_args sets DRY_RUN flag" {
    parse_common_args "--dry-run"

    [[ "$DRY_RUN" == "true" ]]
}

# ============================================================================
# Test Name: "parse_common_args sets HELP_REQUESTED flag"
# Test Type: Unit Test
# Test Scope: Validates parse_common_args recognizes --help flag
# ============================================================================
@test "parse_common_args sets HELP_REQUESTED flag" {
    parse_common_args "--help"

    [[ "$HELP_REQUESTED" == "true" ]]
}

# ============================================================================
# Test Name: "parse_common_args sets QUIET flag"
# Test Type: Unit Test
# Test Scope: Validates parse_common_args recognizes --quiet flag
# ============================================================================
@test "parse_common_args sets QUIET flag" {
    parse_common_args "--quiet"

    [[ "$QUIET" == "true" ]]
}

# ============================================================================
# Test Name: "parse_common_args sets FORCE flag"
# Test Type: Unit Test
# Test Scope: Validates parse_common_args recognizes --force flag
# ============================================================================
@test "parse_common_args sets FORCE flag" {
    parse_common_args "--force"

    [[ "$FORCE" == "true" ]]
}

# ============================================================================
# Test Name: "parse_common_args handles short options"
# Test Type: Unit Test
# Test Scope: Validates parse_common_args recognizes short flag variants
# ============================================================================
@test "parse_common_args handles short options" {
    parse_common_args "-v"
    [[ "$VERBOSE" == "true" ]]

    VERBOSE="false"
    parse_common_args "-d"
    [[ "$DRY_RUN" == "true" ]]

    DRY_RUN="false"
    parse_common_args "-h"
    [[ "$HELP_REQUESTED" == "true" ]]
}

# ============================================================================
# Test Name: "parse_common_args handles multiple flags"
# Test Type: Unit Test
# Test Scope: Validates parse_common_args processes multiple flags correctly
# ============================================================================
@test "parse_common_args handles multiple flags" {
    parse_common_args "--verbose" "--dry-run" "--force"

    [[ "$VERBOSE" == "true" ]]
    [[ "$DRY_RUN" == "true" ]]
    [[ "$FORCE" == "true" ]]
}

# ============================================================================
# Test Name: "parse_common_args handles unknown options"
# Test Type: Error Condition Test
# Test Scope: Validates parse_common_args rejects unknown flags
# ============================================================================
@test "parse_common_args handles unknown options" {
    run parse_common_args "--unknown-option"

    [[ "$status" -eq 1 ]]
}

# ============================================================================
# Test Name: "parse_common_args stops at positional arguments"
# Test Type: Unit Test
# Test Scope: Validates parse_common_args correctly handles positional args
# ============================================================================
@test "parse_common_args stops at positional arguments" {
    run parse_common_args "--verbose" "arg1" "arg2"

    [[ "$status" -eq 0 ]]
    [[ "$VERBOSE" == "true" ]]
}

# ============================================================================
# Test Name: "parse_common_args handles double dash separator"
# Test Type: Unit Test
# Test Scope: Validates parse_common_args respects -- separator
# ============================================================================
@test "parse_common_args handles double dash separator" {
    run parse_common_args "--verbose" "--" "--not-an-option"

    [[ "$status" -eq 0 ]]
    [[ "$VERBOSE" == "true" ]]
}

# ----- Section: Argument Validation -----

# ============================================================================
# Test Name: "validate_required_args succeeds with sufficient args"
# Test Type: Unit Test
# Test Scope: Validates validate_required_args accepts correct arg count
# ============================================================================
@test "validate_required_args succeeds with sufficient args" {
    run validate_required_args 2 3 "arg1" "arg2"

    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "validate_required_args fails with insufficient args"
# Test Type: Unit Test
# Test Scope: Validates validate_required_args rejects insufficient arg count
# ============================================================================
@test "validate_required_args fails with insufficient args" {
    run validate_required_args 3 1 "arg1" "arg2" "arg3"

    [[ "$status" -eq 1 ]]
    [[ "$output" == *"Insufficient arguments"* ]]
}

# ============================================================================
# Test Name: "validate_required_args displays argument descriptions"
# Test Type: Unit Test
# Test Scope: Validates validate_required_args shows helpful error messages
# ============================================================================
@test "validate_required_args displays argument descriptions" {
    run validate_required_args 2 0 "Input file" "Output file"

    [[ "$status" -eq 1 ]]
    [[ "$output" == *"Input file"* ]]
    [[ "$output" == *"Output file"* ]]
}

# ----- Section: Version Display -----

# ============================================================================
# Test Name: "show_version displays version information"
# Test Type: Unit Test
# Test Scope: Validates show_version outputs script version
# ============================================================================
@test "show_version displays version information" {
    run show_version

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"version"* ]]
    [[ "$output" == *"LightSpeed WP"* ]]
}

# ============================================================================
# Test Name: "show_version reads VERSION file"
# Test Type: Integration Test
# Test Scope: Validates show_version reads from VERSION file when present
# ============================================================================
@test "show_version reads VERSION file" {
    echo "1.2.3" > "$TEST_TEMP_DIR/VERSION"
    cd "$TEST_TEMP_DIR"

    run show_version

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"1.2.3"* ]]
}

# ----- Section: Confirmation Prompts -----

# ============================================================================
# Test Name: "confirm_action skips in FORCE mode"
# Test Type: Unit Test
# Test Scope: Validates confirm_action bypasses prompts when FORCE=true
# ============================================================================
@test "confirm_action skips in FORCE mode" {
    export FORCE="true"

    run confirm_action "Test confirmation message"

    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "confirm_action uses default in non-interactive mode"
# Test Type: Unit Test
# Test Scope: Validates confirm_action behavior without TTY
# ============================================================================
@test "confirm_action uses default in non-interactive mode" {
    export FORCE="false"

    # Non-interactive with default 'y'
    run confirm_action "Test message" "y" < /dev/null

    [[ "$status" -eq 0 ]]

    # Non-interactive with default 'n'
    run confirm_action "Test message" "n" < /dev/null

    [[ "$status" -eq 1 ]]
}

# ----- Section: Input Prompts -----

# ============================================================================
# Test Name: "prompt_for_input returns default value"
# Test Type: Unit Test
# Test Scope: Validates prompt_for_input uses default when input is empty
# ============================================================================
@test "prompt_for_input returns default value" {
    run bash -c "source '$SCRIPTS_DIR/includes/cli/cli-utils.sh' 2>/dev/null; echo '' | prompt_for_input 'Test prompt' 'default_value'"

    [[ "$output" == *"default_value"* ]]
}

# ============================================================================
# Test Name: "prompt_for_input validates against pattern"
# Test Type: Unit Test
# Test Scope: Validates prompt_for_input rejects input not matching pattern
# ============================================================================
@test "prompt_for_input validates against pattern" {
    # This test validates the validation logic exists
    # Actual interactive testing would require expect or similar tools
    skip "Interactive input testing requires expect tool"
}

# ----- Section: Progress Display -----

# ============================================================================
# Test Name: "show_progress displays progress information"
# Test Type: Unit Test
# Test Scope: Validates show_progress outputs progress indicators
# ============================================================================
@test "show_progress displays progress information" {
    run show_progress 5 10 "Processing files"

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"50"* ]]
    [[ "$output" == *"Processing files"* ]]
}

# ============================================================================
# Test Name: "show_progress shows completion"
# Test Type: Unit Test
# Test Scope: Validates show_progress indicates 100% completion
# ============================================================================
@test "show_progress shows completion" {
    run show_progress 10 10 "Complete"

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"100"* ]]
}

# ============================================================================
# Test Name: "show_progress respects QUIET mode"
# Test Type: Unit Test
# Test Scope: Validates show_progress suppresses output when QUIET=true
# ============================================================================
@test "show_progress respects QUIET mode" {
    export QUIET="true"

    run show_progress 5 10 "Should be quiet"

    [[ "$status" -eq 0 ]]
    [[ -z "$output" ]]
}

# ----- Section: Dry Run Mode -----

# ============================================================================
# Test Name: "check_dry_run returns true when DRY_RUN set"
# Test Type: Unit Test
# Test Scope: Validates check_dry_run detects DRY_RUN flag
# ============================================================================
@test "check_dry_run returns true when DRY_RUN set" {
    export DRY_RUN="true"

    run check_dry_run

    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "check_dry_run returns false when DRY_RUN not set"
# Test Type: Unit Test
# Test Scope: Validates check_dry_run returns false without DRY_RUN
# ============================================================================
@test "check_dry_run returns false when DRY_RUN not set" {
    export DRY_RUN="false"

    run check_dry_run

    [[ "$status" -eq 1 ]]
}

# ============================================================================
# Test Name: "execute_with_dry_run shows command in dry run mode"
# Test Type: Unit Test
# Test Scope: Validates execute_with_dry_run displays commands without executing
# ============================================================================
@test "execute_with_dry_run shows command in dry run mode" {
    export DRY_RUN="true"

    run execute_with_dry_run echo "test command"

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"DRY RUN"* ]]
    [[ "$output" == *"Would execute"* ]]
}

# ============================================================================
# Test Name: "execute_with_dry_run executes normally without dry run"
# Test Type: Unit Test
# Test Scope: Validates execute_with_dry_run runs commands when DRY_RUN=false
# ============================================================================
@test "execute_with_dry_run executes normally without dry run" {
    export DRY_RUN="false"

    run execute_with_dry_run echo "actual output"

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"actual output"* ]]
    [[ "$output" != *"DRY RUN"* ]]
}

# ----- Section: Edge Cases -----

# ============================================================================
# Test Name: "parse_common_args handles empty arguments"
# Test Type: Edge Case Test
# Test Scope: Validates parse_common_args with no arguments
# ============================================================================
@test "parse_common_args handles empty arguments" {
    run parse_common_args

    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "show_standard_help handles empty option array"
# Test Type: Edge Case Test
# Test Scope: Validates show_standard_help with no custom options
# ============================================================================
@test "show_standard_help handles empty option array" {
    run show_standard_help "script" "Description" "Usage"

    [[ "$status" -eq 0 ]]
    # Should show default options
    [[ "$output" == *"--help"* ]]
}

# ============================================================================
# Test Name: "validate_required_args handles zero requirements"
# Test Type: Edge Case Test
# Test Scope: Validates validate_required_args when no args required
# ============================================================================
@test "validate_required_args handles zero requirements" {
    run validate_required_args 0 0

    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "show_progress handles edge percentages"
# Test Type: Edge Case Test
# Test Scope: Validates show_progress with 0% and 100%
# ============================================================================
@test "show_progress handles edge percentages" {
    run show_progress 0 10 "Starting"
    [[ "$status" -eq 0 ]]

    run show_progress 10 10 "Finished"
    [[ "$status" -eq 0 ]]
}

# ----- Section: Environment Variable Handling -----

# ============================================================================
# Test Name: "CLI flags are exported globally"
# Test Type: Integration Test
# Test Scope: Validates parse_common_args exports environment variables
# ============================================================================
@test "CLI flags are exported globally" {
    parse_common_args "--verbose" "--force"

    # Variables should be exported for subshells
    run bash -c 'echo "$VERBOSE $FORCE"'
    [[ "$output" == "true true" ]]
}

# ============================================================================
# Test Name: "parse_common_args preserves existing flags"
# Test Type: Unit Test
# Test Scope: Validates parse_common_args doesn't reset unspecified flags
# ============================================================================
@test "parse_common_args preserves existing flags" {
    export VERBOSE="true"

    parse_common_args "--dry-run"

    [[ "$VERBOSE" == "true" ]]
    [[ "$DRY_RUN" == "true" ]]
}

# End of test-cli-utils.bats
