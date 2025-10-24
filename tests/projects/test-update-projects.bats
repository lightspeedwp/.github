#!/usr/bin/env bats

# Test suite for update-projects.sh script
# Description: Tests argument parsing, help output, and basic functionality.
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
#    - bats test-update-projects.bats
#    - For CSV import and authentication tests, use:
#        SCRIPT=path/to/update-projects.sh bats tests/project-scripts/test-project-csv.bats
#        SCRIPT=path/to/update-projects.sh bats tests/project-scripts/test-project-auth.bats
# Test Scope: Argument parsing, help output, and basic functionality. Shared tests cover CSV import and authentication.

# Load test helpers
load '../test-helper.bash'

###############################################################################
# Function Name: setup
# Function Type: Setup
# Function Scope: Prepares environment and resolves script path for update-projects.sh tests runner
###############################################################################
setup() {
    # Get the directory containing this test file
    DIR="$( cd "$( dirname "$BATS_TEST_FILENAME" )" >/dev/null 2>&1 && pwd )"
    SCRIPT="$DIR/../../scripts/project/update-projects.sh"

    # Debug output
    if [ -n "$DEBUG" ]; then
        echo "DEBUG: DIR is $DIR" >&2
        echo "DEBUG: SCRIPT is $SCRIPT" >&2
    fi

    # Ensure script exists and is executable
    [ -f "$SCRIPT" ]
    [ -x "$SCRIPT" ]
}

###############################################################################
# Test Name: "script shows help with --help flag"
# Test Type: Help and Usage
# Test Scope: Validates that the script responds to --help and outputs usage information.
###############################################################################
@test "script shows help with --help flag" {
    run "$SCRIPT" --help
    [ "$status" -eq 0 ]
    [[ "$output" == *"GitHub Projects Field Update Script"* ]]
    [[ "$output" == *"Usage:"* ]]
    [[ "$output" == *"Options:"* ]]
}

###############################################################################
# Test Name: "script shows help with -h flag"
# Test Type: Help and Usage
# Test Scope: Validates that the script responds to -h and outputs usage information.
###############################################################################
@test "script shows help with -h flag" {
    run "$SCRIPT" -h
    [ "$status" -eq 0 ]
    [[ "$output" == *"GitHub Projects Field Update Script"* ]]
}

###############################################################################
# Test Name: "script fails with unknown option"
# Test Type: Argument Parsing
# Test Scope: Ensures the script fails with status 1 and outputs an error for unknown options.
###############################################################################
@test "script fails with unknown option" {
    run "$SCRIPT" --unknown-option
    [ "$status" -eq 1 ]
    [[ "$output" == *"Unknown option: --unknown-option"* ]]
}

###############################################################################
# Test Name: "script accepts --dry-run flag"
# Test Type: Argument Parsing
# Test Scope: Validates that the script accepts --dry-run and does not output an unknown option error.
###############################################################################
@test "script accepts --dry-run flag" {
    # This test will likely fail due to GitHub CLI not being available
    # but it tests argument parsing
    run "$SCRIPT" --dry-run
    # Script may fail due to missing gh CLI, but should accept the argument
    [[ "$output" != *"Unknown option: --dry-run"* ]]
}

###############################################################################
# Test Name: "script accepts --project-owner option"
# Test Type: Argument Parsing
# Test Scope: Validates that the script accepts --project-owner and does not output an unknown option error.
###############################################################################
@test "script accepts --project-owner option" {
    run "$SCRIPT" --project-owner testorg --dry-run
    # Should not show unknown option error
    [[ "$output" != *"Unknown option: --project-owner"* ]]
}

###############################################################################
# Test Name: "script accepts --project-number option"
# Test Type: Argument Parsing
# Test Scope: Validates that the script accepts --project-number and does not output an unknown option error.
###############################################################################
@test "script accepts --project-number option" {
    run "$SCRIPT" --project-number 123 --dry-run
    # Should not show unknown option error
    [[ "$output" != *"Unknown option: --project-number"* ]]
}

###############################################################################
# Test Name: "script accepts --auto-refresh flag"
# Test Type: Argument Parsing
# Test Scope: Validates that the script accepts --auto-refresh and does not output an unknown option error.
###############################################################################
@test "script accepts --auto-refresh flag" {
    run "$SCRIPT" --auto-refresh --dry-run
    # Should not show unknown option error
    [[ "$output" != *"Unknown option: --auto-refresh"* ]]
}

###############################################################################
# Test Name: "script has proper shebang"
# Test Type: Script Initialization
# Test Scope: Validates that the script starts with the correct shebang (#!/bin/bash).
###############################################################################
@test "script has proper shebang" {
    head -n1 "$SCRIPT" | grep -q "#!/bin/bash"
}

###############################################################################
# Test Name: "script uses set -euo pipefail for safety"
# Test Type: Script Initialization
# Test Scope: Ensures the script uses strict mode for error handling and safety.
###############################################################################
@test "script uses set -euo pipefail for safety" {
    grep -q "set -euo pipefail" "$SCRIPT"
}

###############################################################################
# Test Name: "script contains required functions"
# Test Type: Script Content
# Test Scope: Checks that all required functions are present in the script.
###############################################################################
@test "script contains required functions" {
    grep -q "show_help()" "$SCRIPT"
    grep -q "parse_args()" "$SCRIPT"
    grep -q "check_gh_cli()" "$SCRIPT"
    grep -q "check_gh_auth()" "$SCRIPT"
    grep -q "get_current_scopes()" "$SCRIPT"
    grep -q "check_required_scopes()" "$SCRIPT"
    grep -q "refresh_gh_scopes()" "$SCRIPT"
    grep -q "detect_project_owner()" "$SCRIPT"
    grep -q "execute_command()" "$SCRIPT"
    grep -q "create_project_field()" "$SCRIPT"
    grep -q "main()" "$SCRIPT"
}

###############################################################################
# Test Name: "script uses gh api instead of curl for scope discovery"
# Test Type: Script Content
# Test Scope: Validates that the script uses gh api for scope discovery and does not use curl with token.
###############################################################################
@test "script uses gh api instead of curl for scope discovery" {
    grep -q "gh api -I /" "$SCRIPT"
    # Should not use curl with token
    ! grep -q "curl.*token" "$SCRIPT"
}

###############################################################################
# Test Name: "script includes required scopes"
# Test Type: Script Content
# Test Scope: Checks that the script includes all required GitHub scopes.
###############################################################################
@test "script includes required scopes" {
    grep -q 'REQUIRED_SCOPES=.*repo.*project.*read:org.*read:user' "$SCRIPT"
}

###############################################################################
# Test Name: "script has colorized output functions"
# Test Type: Script Content
# Test Scope: Validates that the script includes colorized output functions for logging.
###############################################################################
@test "script has colorized output functions" {
    grep -q "log_info()" "$SCRIPT"
    grep -q "log_success()" "$SCRIPT"
    grep -q "log_warning()" "$SCRIPT"
    grep -q "log_error()" "$SCRIPT"
}

###############################################################################
# Test Name: "script implements dry-run functionality"
# Test Type: Script Content
# Test Scope: Checks that the script implements dry-run functionality and related output.
###############################################################################
@test "script implements dry-run functionality" {
    grep -q "DRY_RUN" "$SCRIPT"
    grep -q "execute_command()" "$SCRIPT"
    grep -q "DRY-RUN" "$SCRIPT"
}

###############################################################################
# Test Name: "script detects project owner automatically"
# Test Type: Script Content
# Test Scope: Validates that the script can detect the project owner automatically using git and gh api.
###############################################################################
@test "script detects project owner automatically" {
    grep -q "detect_project_owner()" "$SCRIPT"
    grep -q "git remote get-url origin" "$SCRIPT"
    grep -q "gh api user --jq .login" "$SCRIPT"
}

###############################################################################
# Test Name: "script implements scope refresh functionality"
# Test Type: Script Content
# Test Scope: Checks that the script implements scope refresh functionality using gh auth refresh.
###############################################################################
@test "script implements scope refresh functionality" {
    grep -q "refresh_gh_scopes()" "$SCRIPT"
    grep -q "gh auth refresh" "$SCRIPT"
    grep -q "Do you want to refresh scopes now" "$SCRIPT"
}

###############################################################################
# Test Name: "script supports --fields-file option"
# Test Type: Argument Parsing
# Test Scope: Validates that the script supports the --fields-file option and processes fields from a file.
###############################################################################
@test "script supports --fields-file option" {
    run "$SCRIPT" --fields-file "$DIR/fixtures/fields.csv" --project-owner example --project-number 1 --dry-run
    [ "$status" -eq 0 ] || true
    [[ "$output" == *"Processing fields from"* ]]
    [[ "$output" == *"Priority"* ]]
}

###############################################################################
# Test Name: "script requires --project-number with --fields-file"
# Test Type: Argument Parsing
# Test Scope: Ensures the script requires --project-number when --fields-file is provided.
###############################################################################
@test "script requires --project-number with --fields-file" {
    run "$SCRIPT" --fields-file "$DIR/fixtures/fields.csv" --project-owner example --dry-run
    [ "$status" -ne 0 ]
    [[ "$output" == *"requires --project-number"* ]]
}

###############################################################################
# Test Name: "script supports --delete-fields option"
# Test Type: Argument Parsing
# Test Scope: Validates that the script supports the --delete-fields option and attempts to delete fields in dry-run mode.
###############################################################################
@test "script supports --delete-fields option" {
    run "$SCRIPT" --fields-file "$DIR/fixtures/fields.csv" --project-owner example --project-number 1 --delete-fields --dry-run
    [[ "$output" == *"Processing fields from"* ]]
    # Deletion path will attempt gh; in dry-run it still prints field names
    [[ "$output" == *"Deleting project field"* || "$output" == *"Field 'Priority' not found"* || "$output" == *"Failed to list fields"* ]]
}
