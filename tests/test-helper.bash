#!/usr/bin/env bash
# ============================================================================
# Test Name: test-helper.bash
# Testing: Core test helper functions for Bats test suites
# Description: Common utilities used across LightSpeed WP test files
# Version: v1.1.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: bats, bash 4.0+
# Usage: load "$(dirname "$BATS_TEST_FILENAME")/../test-helper.bash"
# Environment Variables: TEST_TEMP_DIR, LOG_FILE
# Options: None - this is a library file
# Examples:
#   load "$(dirname "$BATS_TEST_FILENAME")/../test-helper.bash"
#   setup_test_environment
#   assert_file_contains "test.txt" "expected content"
# Notes:
#   - Provides basic test utilities and environment setup
#   - Extended by enhanced-test-helpers.bash for advanced features
#   - Follows LightSpeed WP testing standards
# ============================================================================

# ============================================================================
# Function: setup_test_environment
# Description: Setup basic test environment with temporary directory
# Arguments: None
# Output: Sets up TEST_TEMP_DIR and PATH
# Notes: Creates isolated test environment for each test run
# ============================================================================
setup_test_environment() {
    export TEST_TEMP_DIR="/tmp/lightspeedwp-test-$$"
    mkdir -p "$TEST_TEMP_DIR"
    export PATH="${BATS_TEST_DIRNAME}/../scripts:$PATH"
    
    # Add includes to PATH for testing
    if [[ -d "${BATS_TEST_DIRNAME}/../scripts/includes" ]]; then
        export PATH="${BATS_TEST_DIRNAME}/../scripts/includes:$PATH"
    fi
}

# ============================================================================
# Function: cleanup_test_environment
# Description: Clean up test environment and temporary files
# Arguments: None
# Output: Removes temporary directory and resets environment
# Notes: Should be called in teardown() function of tests
# ============================================================================
cleanup_test_environment() {
    if [[ -d "$TEST_TEMP_DIR" ]]; then
        rm -rf "$TEST_TEMP_DIR"
    fi
    
    # Reset PATH modifications
    if [[ -n "${ORIGINAL_PATH:-}" ]]; then
        export PATH="$ORIGINAL_PATH"
        unset ORIGINAL_PATH
    fi
}

# ============================================================================
# Function: create_temp_file
# Description: Create a temporary file with specified content
# Arguments: $1 - Content to write, $2 - Filename (optional)
# Output: Path to created temporary file
# Notes: Creates file in TEST_TEMP_DIR with given or default name
# ============================================================================
create_temp_file() {
    local content="$1"
    local filename="${2:-test-file}"
    local temp_file="${TEST_TEMP_DIR}/${filename}"

    echo "$content" > "$temp_file"
    echo "$temp_file"
}

# Mock a command by creating a temporary script in PATH
mock_command() {
    local command_name="$1"
    local mock_behavior="$2"
    local mock_script="${TEST_TEMP_DIR}/mock-${command_name}"

    cat << EOF > "$mock_script"
#!/bin/bash
$mock_behavior
EOF

    chmod +x "$mock_script"
    export PATH="${TEST_TEMP_DIR}:$PATH"
}

# Check if a string contains another string
contains() {
    local haystack="$1"
    local needle="$2"
    [[ "$haystack" == *"$needle"* ]]
}

# Helper: not_contains <output> <unexpected>
not_contains() {
    [[ "$1" != *"$2"* ]]
}

# Verify file exists and has expected content
assert_file_contains() {
    local file="$1"
    local expected_content="$2"

    [ -f "$file" ] || {
        echo "File $file does not exist"
        return 1
    }

    grep -q "$expected_content" "$file" || {
        echo "File $file does not contain expected content: $expected_content"
        echo "Actual content:"
        cat "$file"
        return 1
    }
}

# Verify command exists and is executable
assert_command_exists() {
    local command="$1"
    command -v "$command" >/dev/null 2>&1 || {
        echo "Command '$command' not found"
        return 1
    }
}

# Set up logging for tests
setup_test_logging() {
    export LOG_FILE="${TEST_TEMP_DIR}/test.log"
    touch "$LOG_FILE"
}

# ============================================================================
# Function: get_last_log_entry
# Description: Get the most recent entry from the log file
# Arguments: None
# Output: Last line from LOG_FILE or empty string
# Notes: Uses LOG_FILE environment variable
# ============================================================================
get_last_log_entry() {
    tail -n 1 "$LOG_FILE" 2>/dev/null || echo ""
}

# ============================================================================
# Function: load_includes
# Description: Load common include files for testing
# Arguments: None
# Output: Sources available include files
# Notes: Loads includes from scripts/includes directory
# ============================================================================
load_includes() {
    local includes_dir="${BATS_TEST_DIRNAME}/../scripts/includes"
    
    if [[ -d "$includes_dir" ]]; then
        # Source common functions if available
        if [[ -f "$includes_dir/common-functions.sh" ]]; then
            # shellcheck source=../scripts/includes/common-functions.sh
            source "$includes_dir/common-functions.sh"
        fi
        
        # Source git functions if available
        if [[ -f "$includes_dir/git-functions.sh" ]]; then
            # shellcheck source=../scripts/includes/git-functions.sh
            source "$includes_dir/git-functions.sh"
        fi
    fi
}

# ============================================================================
# Function: setup_test_git_repo
# Description: Create a basic git repository for testing
# Arguments: None
# Output: Initializes git repo in TEST_TEMP_DIR
# Notes: Sets up minimal git configuration for testing
# ============================================================================
setup_test_git_repo() {
    cd "$TEST_TEMP_DIR"
    git init
    git config user.name "Test User"
    git config user.email "test@lightspeedwp.local"
    echo "# Test Repository" > README.md
    git add README.md
    git commit -m "Initial commit"
}

# ============================================================================
# Function: assert_command_succeeds
# Description: Assert that a command executes successfully
# Arguments: $* - Command to execute
# Output: Command execution result
# Notes: Fails test if command returns non-zero exit code
# ============================================================================
assert_command_succeeds() {
    if ! "$@"; then
        echo "Command failed: $*"
        return 1
    fi
}

# ============================================================================
# Function: assert_command_fails
# Description: Assert that a command fails with non-zero exit code
# Arguments: $* - Command to execute
# Output: Command execution result
# Notes: Fails test if command returns zero exit code
# ============================================================================
assert_command_fails() {
    if "$@"; then
        echo "Command unexpectedly succeeded: $*"
        return 1
    fi
}
