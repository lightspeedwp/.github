#
###############################################################################
# Test Name: tests-folder-and-file-readmes.bats
# Description: Comprehensive Bats test suite for folder-and-file-readmes.sh maintenance script. Validates CLI options, error handling, dry-run, backup, merge, and overwrite functionality. Ensures compliance with LightSpeed WP standards for shell script documentation and test coverage.
# Version: v0.1.0
# Date: 2025-10-15
# Author: LightSpeedWP
# Github Contributors: @lightspeedwp / @ashleyshaw
# Author URI: https://lightspeedwp.agency/
# License: GPL v3 or later
# License URI: https://www.gnu.org/licenses/gpl-3.0.html
# Requirements:
#    - bats-core
#    - test-helper.bash
# Usage:
#    - bats tests/maintenance/tests-folder-and-file-readmes.bats
# Environment Variables:
#    None
# Options:
#    None
# Examples:
#    bats tests/maintenance/tests-folder-and-file-readmes.bats
# Notes:
#    - All CLI options and error conditions are tested
#    - Dry-run mode ensures no files are written
#    - Backup, merge, and overwrite options are validated
#    - Paths are resolved relative to test file
#    - Expand tests as new features are added
# Test Scope:
#    - Validates existence and executability of folder-and-file-readmes.sh
#    - Tests: dry-run, backup, merge, overwrite, error handling
###############################################################################

# Load test helpers
load '../test-helper.bash'

# ----- Section: Setup and Teardown Functions -----
###############################################################################
# Function: setup
# Description: Sets up the test environment for folder-and-file-readmes.sh tests.
# Arguments: None
# Output: Sets SCRIPT path, creates temp directory, loads test helper.
# Notes: Ensures script path is correct for all tests.
###############################################################################
setup() {
    # Test Setup:
    # - Define REPO_ROOT: Get the root directory of the repository
    # - Define SCRIPT: Define the script path
    # - Load test helper
    REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")" && cd ../.. && pwd)"
    SCRIPT="$REPO_ROOT/scripts/maintenance/folder-and-file-readmes.sh"
    load '../test-helper.bash'
}

###############################################################################
# Function: teardown
# Description: Cleans up the test environment after each test.
# Arguments: None
# Output: Removes temporary test directory, returns to previous directory.
# Notes: Ensures no test artifacts remain.
###############################################################################
teardown() {
    cd -
    rm -rf "$TMP_DIR"
}

# ----- Section: Help and Error Handling Tests -----
###############################################################################
# Test Name: "folder-and-file-readmes.sh: shows help message"
# Test Type: Help and Usage
# Test Scope: Validates that the script exits with status 0 and outputs a usage message when the --help flag is provided.
###############################################################################
@test "folder-and-file-readmes.sh: shows help message" {
    run "$SCRIPT" --help
    [ "$status" -eq 0 ]
    [[ "$output" == *"Usage:"* ]]
}

###############################################################################
# Test Name: "folder-and-file-readmes.sh: handles no target folder"
# Test Type: Error Handling
# Test Scope: Validates that the script exits with status 1 and outputs an error when no target folder is provided.
###############################################################################
@test "folder-and-file-readmes.sh: handles no target folder" {
    run "$SCRIPT"
    [ "$status" -eq 1 ]
    [[ "$output" == *"Error: No target folder specified"* ]]
}

###############################################################################
# Test Name: "folder-and-file-readmes.sh: handles non-existent target folder"
# Test Type: Error Handling
# Test Scope: Validates that the script exits with status 1 and outputs an error when a non-existent folder is provided.
###############################################################################
@test "folder-and-file-readmes.sh: handles non-existent target folder" {
    run "$SCRIPT" non_existent_folder
    [ "$status" -eq 1 ]
    [[ "$output" == *"Error: Target folder does not exist"* ]]
}

###############################################################################

# Test Name: "folder-and-file-readmes.sh: dry-run creates no files and logs actions"
# Test Type: Dry-Run Option
# Test Scope: Validates that dry-run mode does not create or modify any files and logs actions to the log file.
###############################################################################
@test "folder-and-file-readmes.sh: dry-run creates no files and logs actions" {
    local test_dir
    test_dir=$(mktemp -d)
    local log_dir="$PWD/logs"
    run "$SCRIPT" --dry-run "$test_dir"
    [ "$status" -eq 0 ]
    [ ! -f "$test_dir/README.md" ]
    # Find the latest log file
    local log_file
    log_file=$(ls -t "$log_dir"/folder-and-file-readmes.*.log 2>/dev/null | head -n1)
    [ -n "$log_file" ]
    grep "DRY RUN" "$log_file"
    rm -rf "$test_dir"
}

# ----- Section: Backup, Merge, and Overwrite Tests -----
###############################################################################

# Test Name: "folder-and-file-readmes.sh: creates backup before overwrite and logs action"
# Test Type: Backup Option
# Test Scope: Validates that a backup is created before overwriting an existing README.md file and logs the backup action.
###############################################################################
@test "folder-and-file-readmes.sh: creates backup before overwrite and logs action" {
    local test_dir
    test_dir=$(mktemp -d)
    touch "$test_dir/README.md"
    echo "old content" > "$test_dir/README.md"
    local log_dir="$PWD/logs"
    run "$SCRIPT" --overwrite "$test_dir"
    [ "$status" -eq 0 ]
    ls "$test_dir"/README.md.bak.*
    [ -f "$test_dir/README.md.bak."* ]
    local log_file
    log_file=$(ls -t "$log_dir"/folder-and-file-readmes.*.log 2>/dev/null | head -n1)
    [ -n "$log_file" ]
    grep "Backup created" "$log_file"
    rm -rf "$test_dir"
}

# ============================================================================
# @test "folder-and-file-readmes.sh: merges new content with existing README"
# ============================================================================
@test "folder-and-file-readmes.sh: merges new content with existing README" {
    local test_dir
    test_dir=$(mktemp -d)
    echo "old content" > "$test_dir/README.md"
    run "$SCRIPT" --merge "$test_dir"
    [ "$status" -eq 0 ]
    grep "old content" "$test_dir/README.md"
    grep "Folder Contents" "$test_dir/README.md"
    rm -rf "$test_dir"
}

# ============================================================================
# @test "folder-and-file-readmes.sh: file-specific README creates backup and merges"
# ============================================================================
@test "folder-and-file-readmes.sh: file-specific README creates backup and merges" {
    local test_dir
    test_dir=$(mktemp -d)
    local test_file="$test_dir/testfile.sh"
    touch "$test_file"
    echo "old file readme" > "$test_dir/README.testfile.sh.md"
    run "$SCRIPT" --file "$test_file" --merge
    [ "$status" -eq 0 ]
    ls "$test_dir"/README.testfile.sh.md.bak.*
    [ -f "$test_dir/README.testfile.sh.md.bak."* ]
    grep "old file readme" "$test_dir/README.testfile.sh.md"
    grep "Auto-generated documentation stub" "$test_dir/README.testfile.sh.md"
    rm -rf "$test_dir"
}

# ============================================================================
# @test "folder-and-file-readmes.sh: file-specific README overwrites and creates backup"
# ============================================================================
@test "folder-and-file-readmes.sh: file-specific README overwrites and creates backup" {
    local test_dir
    test_dir=$(mktemp -d)
    local test_file="$test_dir/testfile2.sh"
    touch "$test_file"
    echo "old file readme" > "$test_dir/README.testfile2.sh.md"
    run "$SCRIPT" --file "$test_file" --overwrite
    [ "$status" -eq 0 ]
    ls "$test_dir"/README.testfile2.sh.md.bak.*
    [ -f "$test_dir/README.testfile2.sh.md.bak."* ]
    grep "Auto-generated documentation stub" "$test_dir/README.testfile2.sh.md"
    rm -rf "$test_dir"
}
