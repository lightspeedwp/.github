#!/usr/bin/env bash
# ============================================================================
# Test Name: enhanced-test-helpers.bash
# Testing: Enhanced test helpers for Bats test suites
# Description: Advanced test helper functions for LightSpeed WP automation testing
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: bats, bash 4.0+
# Usage: load "$(dirname "$BATS_TEST_FILENAME")/../includes/enhanced-test-helpers.bash"
# Environment Variables: TEST_TEMP_DIR, LOG_FILE
# Options: None - this is a library file
# Examples:
#   load "$(dirname "$BATS_TEST_FILENAME")/../includes/enhanced-test-helpers.bash"
#   setup_enhanced_test_environment
#   mock_git_command "status" "echo 'clean'"
# Notes:
#   - Extends basic test-helper.bash functionality
#   - Provides advanced mocking and validation capabilities
#   - Integrates with LightSpeed WP includes structure
# ============================================================================

# Load test helpers from parent directory if available
if [[ -f "$(dirname "${BASH_SOURCE[0]}")/../test-helper.bash" ]]; then
    # shellcheck source=../test-helper.bash
    source "$(dirname "${BASH_SOURCE[0]}")/../test-helper.bash"
fi

# ============================================================================
# Function: setup_enhanced_test_environment
# Description: Enhanced test environment setup with includes support
# Arguments: None
# Output: Sets up test environment with enhanced capabilities
# Notes: Extends basic setup_test_environment function
# ============================================================================
setup_enhanced_test_environment() {
    # Call basic setup if available
    if declare -f setup_test_environment >/dev/null; then
        setup_test_environment
    else
        export TEST_TEMP_DIR="/tmp/lightspeedwp-test-$$"
        mkdir -p "$TEST_TEMP_DIR"
        export PATH="${BATS_TEST_DIRNAME}/../scripts:$PATH"
    fi

    # Add scripts/includes to PATH for testing
    export PATH="${BATS_TEST_DIRNAME}/../scripts/includes:$PATH"

    # Setup enhanced logging
    export LOG_FILE="${TEST_TEMP_DIR}/test.log"
    touch "$LOG_FILE"

    # Create mock directories
    mkdir -p "${TEST_TEMP_DIR}/mocks"
    mkdir -p "${TEST_TEMP_DIR}/fixtures"
}

# ============================================================================
# Function: cleanup_enhanced_test_environment
# Description: Enhanced cleanup with includes support
# Arguments: None
# Output: Cleans up enhanced test environment
# Notes: Extends basic cleanup_test_environment function
# ============================================================================
cleanup_enhanced_test_environment() {
    # Call basic cleanup if available
    if declare -f cleanup_test_environment >/dev/null; then
        cleanup_test_environment
    else
        if [[ -d "$TEST_TEMP_DIR" ]]; then
            rm -rf "$TEST_TEMP_DIR"
        fi
    fi

    # Additional cleanup for enhanced features
    unset LOG_FILE
}

# ============================================================================
# Function: mock_git_command
# Description: Mock specific git commands for testing
# Arguments: $1 - Git subcommand to mock, $2 - Mock behavior
# Output: Creates mock git command
# Notes: Creates targeted git command mocks
# ============================================================================
mock_git_command() {
    local git_subcommand="$1"
    local mock_behavior="$2"
    local mock_script="${TEST_TEMP_DIR}/mocks/git"

    # Create git mock script that handles specific subcommands
    cat << EOF > "$mock_script"
#!/bin/bash
if [[ "\$1" == "$git_subcommand" ]]; then
    shift
    $mock_behavior
else
    # Call real git for other commands
    command git "\$@"
fi
EOF

    chmod +x "$mock_script"
    export PATH="${TEST_TEMP_DIR}/mocks:$PATH"
}

# ============================================================================
# Function: create_test_git_repo
# Description: Create a test git repository with basic setup
# Arguments: $1 (optional) - Directory path for repo
# Output: Path to created test repository
# Notes: Creates a minimal git repo for testing
# ============================================================================
create_test_git_repo() {
    local repo_dir="${1:-${TEST_TEMP_DIR}/test-repo}"

    mkdir -p "$repo_dir"
    cd "$repo_dir"

    git init
    git config user.name "Test User"
    git config user.email "test@example.com"

    echo "# Test Repository" > README.md
    git add README.md
    git commit -m "Initial commit"

    echo "$repo_dir"
}

# ============================================================================
# Function: assert_log_contains
# Description: Assert that log file contains specific message
# Arguments: $1 - Expected log message
# Output: Test assertion result
# Notes: Checks LOG_FILE for expected content
# ============================================================================
assert_log_contains() {
    local expected_message="$1"

    if [[ ! -f "$LOG_FILE" ]]; then
        echo "Log file does not exist: $LOG_FILE"
        return 1
    fi

    if ! grep -q "$expected_message" "$LOG_FILE"; then
        echo "Log file does not contain expected message: $expected_message"
        echo "Log file contents:"
        cat "$LOG_FILE"
        return 1
    fi
}

# ============================================================================
# Function: assert_function_exists
# Description: Assert that a bash function is defined
# Arguments: $1 - Function name to check
# Output: Test assertion result
# Notes: Checks if function is available in current shell
# ============================================================================
assert_function_exists() {
    local function_name="$1"

    if ! declare -f "$function_name" >/dev/null; then
        echo "Function '$function_name' is not defined"
        return 1
    fi
}

# ============================================================================
# Function: source_includes
# Description: Source all include files for testing
# Arguments: None
# Output: Sources common include files
# Notes: Loads includes relative to test directory
# ============================================================================
source_includes() {
    local includes_dir="${BATS_TEST_DIRNAME}/../scripts/includes"

    if [[ -d "$includes_dir" ]]; then
        # Source common functions if available
            if [[ -f "$includes_dir/core/common-functions.sh" ]]; then
                # shellcheck source=../scripts/includes/core/common-functions.sh
                source "$includes_dir/core/common-functions.sh"
        fi

        # Source git functions if available
            if [[ -f "$includes_dir/network/git-functions.sh" ]]; then
                # shellcheck source=../scripts/includes/network/git-functions.sh
                source "$includes_dir/network/git-functions.sh"
        fi
    fi
}

# ============================================================================
# Function: create_test_script
# Description: Create a test script with includes
# Arguments: $1 - Script name, $2 - Script content
# Output: Path to created test script
# Notes: Creates script that sources includes
# ============================================================================
create_test_script() {
    local script_name="$1"
    local script_content="$2"
    local script_path="${TEST_TEMP_DIR}/${script_name}"

    cat << EOF > "$script_path"
#!/bin/bash
set -euo pipefail

# Source includes
SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "\${SCRIPT_DIR}/../scripts/includes/common-functions.sh" ]]; then
    source "\${SCRIPT_DIR}/../scripts/includes/common-functions.sh"
fi

$script_content
EOF

    chmod +x "$script_path"
    echo "$script_path"
}

# ============================================================================
# Function: run_with_timeout
# Description: Run command with timeout for testing
# Arguments: $1 - Timeout in seconds, $2+ - Command to run
# Output: Command output with timeout handling
# Notes: Prevents hanging tests
# ============================================================================
run_with_timeout() {
    local timeout_seconds="$1"
    shift

    timeout "$timeout_seconds" "$@" || {
        local exit_code=$?
        if [[ $exit_code -eq 124 ]]; then
            echo "Command timed out after $timeout_seconds seconds"
        fi
        return $exit_code
    }
}

# ============================================================================
# Function: assert_script_follows_standards
# Description: Assert that a script follows LightSpeed WP standards
# Arguments: $1 - Script path to validate
# Output: Validation results
# Notes: Checks for proper headers, functions, etc.
# ============================================================================
assert_script_follows_standards() {
    local script_path="$1"

    if [[ ! -f "$script_path" ]]; then
        echo "Script file does not exist: $script_path"
        return 1
    fi

    # Check for shebang
    if ! head -n 1 "$script_path" | grep -q '^#!/'; then
        echo "Script missing shebang: $script_path"
        return 1
    fi

    # Check for header block
    if ! grep -q "Script Name:" "$script_path"; then
        echo "Script missing header block: $script_path"
        return 1
    fi

    # Check for strict mode
    if ! grep -q "set -euo pipefail" "$script_path"; then
        echo "Script missing strict mode: $script_path"
        return 1
    fi
}

# ============================================================================
# Function: create_fixture_file
# Description: Create a test fixture file with content
# Arguments: $1 - Fixture name, $2 - Content
# Output: Path to created fixture file
# Notes: Creates reusable test fixtures
# ============================================================================
create_fixture_file() {
    local fixture_name="$1"
    local content="$2"
    local fixture_path="${TEST_TEMP_DIR}/fixtures/${fixture_name}"

    mkdir -p "$(dirname "$fixture_path")"
    echo "$content" > "$fixture_path"
    echo "$fixture_path"
}

# ============================================================================
# Function: load_fixture
# Description: Load content from a fixture file
# Arguments: $1 - Fixture name
# Output: Fixture file content
# Notes: Reads content from test fixtures
# ============================================================================
load_fixture() {
    local fixture_name="$1"
    local fixture_path="${TEST_TEMP_DIR}/fixtures/${fixture_name}"

    if [[ -f "$fixture_path" ]]; then
        cat "$fixture_path"
    else
        echo "Fixture not found: $fixture_name"
        return 1
    fi
}

# ============================================================================
# Function: assert_no_shellcheck_errors
# Description: Assert that script passes ShellCheck validation
# Arguments: $1 - Script path to check
# Output: ShellCheck results
# Notes: Requires ShellCheck to be installed
# ============================================================================
assert_no_shellcheck_errors() {
    local script_path="$1"

    if ! command -v shellcheck >/dev/null 2>&1; then
        echo "ShellCheck not available, skipping validation"
        return 0
    fi

    if ! shellcheck "$script_path"; then
        echo "ShellCheck found errors in: $script_path"
        return 1
    fi
}
