#!/bin/bash
# scripts/includes/testing/test-helpers.sh

# ============================================================================
# Script Name: test-helpers.sh
# Description: Testing support functions for shell script test suites
# Usage: source scripts/includes/testing/test-helpers.sh
# Examples:
#   setup_test_environment
#   cleanup_test_environment
#   create_test_fixture "config.yml" "$content"
#   mock_command "git" "echo 'mocked git'"
# ============================================================================

set -euo pipefail

readonly TEST_TEMP_DIR="${TEST_TEMP_DIR:-/tmp/shell_tests_$$}"
readonly TEST_FIXTURES_DIR="${TEST_FIXTURES_DIR:-$TEST_TEMP_DIR/fixtures}"
readonly TEST_MOCKS_DIR="${TEST_MOCKS_DIR:-$TEST_TEMP_DIR/mocks}"

setup_test_environment() {
    # Create test directories
    mkdir -p "$TEST_TEMP_DIR"
    mkdir -p "$TEST_FIXTURES_DIR"
    mkdir -p "$TEST_MOCKS_DIR"

    # Set up test PATH to prioritise mocks
    export PATH="$TEST_MOCKS_DIR:$PATH"

    # Save original directory
    export TEST_ORIGINAL_DIR="$PWD"

    # Change to test directory
    cd "$TEST_TEMP_DIR" || return 1

    log_debug "Test environment set up: $TEST_TEMP_DIR"
}

cleanup_test_environment() {
    # Return to original directory
    if [[ -n "${TEST_ORIGINAL_DIR:-}" ]]; then
        cd "$TEST_ORIGINAL_DIR" || true
    fi

    # Clean up test directories
    if [[ -d "$TEST_TEMP_DIR" ]]; then
        rm -rf "$TEST_TEMP_DIR"
    fi

    # Restore PATH
    export PATH="${TEST_ORIGINAL_PATH:-$PATH}"

    log_debug "Test environment cleaned up"
}

create_test_fixture() {
    local fixture_name="$1"
    local fixture_content="$2"
    local fixture_path="$TEST_FIXTURES_DIR/$fixture_name"

    # Create parent directory if needed
    local fixture_dir
    fixture_dir=$(dirname "$fixture_path")
    mkdir -p "$fixture_dir"

    # Write fixture content
    echo "$fixture_content" > "$fixture_path"

    echo "$fixture_path"
}

load_test_fixture() {
    local fixture_name="$1"
    local fixture_path="$TEST_FIXTURES_DIR/$fixture_name"

    if [[ -f "$fixture_path" ]]; then
        cat "$fixture_path"
    else
        log_error "Fixture not found: $fixture_name"
        return 1
    fi
}

mock_command() {
    local command_name="$1"
    local mock_behaviour="$2"
    local mock_path="$TEST_MOCKS_DIR/$command_name"

    # Create mock script
    cat > "$mock_path" << EOF
#!/bin/bash
$mock_behaviour
EOF

    chmod +x "$mock_path"

    log_debug "Mocked command: $command_name"
}

unmock_command() {
    local command_name="$1"
    local mock_path="$TEST_MOCKS_DIR/$command_name"

    if [[ -f "$mock_path" ]]; then
        rm -f "$mock_path"
        log_debug "Unmocked command: $command_name"
    fi
}

create_test_git_repo() {
    local repo_path="${1:-$TEST_TEMP_DIR/test_repo}"

    mkdir -p "$repo_path"
    cd "$repo_path" || return 1

    git init
    git config user.email "test@example.com"
    git config user.name "Test User"

    # Create initial commit
    echo "# Test Repository" > README.md
    git add README.md
    git commit -m "Initial commit"

    cd "$TEST_TEMP_DIR" || return 1

    echo "$repo_path"
}

assert_file_exists() {
    local file_path="$1"
    local message="${2:-File should exist: $file_path}"

    if [[ ! -f "$file_path" ]]; then
        log_error "$message"
        return 1
    fi

    return 0
}

assert_directory_exists() {
    local dir_path="$1"
    local message="${2:-Directory should exist: $dir_path}"

    if [[ ! -d "$dir_path" ]]; then
        log_error "$message"
        return 1
    fi

    return 0
}

assert_command_exists() {
    local command_name="$1"
    local message="${2:-Command should exist: $command_name}"

    if ! command -v "$command_name" >/dev/null 2>&1; then
        log_error "$message"
        return 1
    fi

    return 0
}

assert_string_contains() {
    local haystack="$1"
    local needle="$2"
    local message="${3:-String should contain: $needle}"

    if [[ ! "$haystack" == *"$needle"* ]]; then
        log_error "$message"
        log_error "Haystack: $haystack"
        return 1
    fi

    return 0
}

assert_equals() {
    local expected="$1"
    local actual="$2"
    local message="${3:-Values should be equal}"

    if [[ "$expected" != "$actual" ]]; then
        log_error "$message"
        log_error "Expected: $expected"
        log_error "Actual: $actual"
        return 1
    fi

    return 0
}

assert_not_equals() {
    local unexpected="$1"
    local actual="$2"
    local message="${3:-Values should not be equal}"

    if [[ "$unexpected" == "$actual" ]]; then
        log_error "$message"
        log_error "Unexpected value: $unexpected"
        return 1
    fi

    return 0
}

run_with_timeout() {
    local timeout_seconds="$1"
    shift
    local command=("$@")

    timeout "$timeout_seconds" "${command[@]}"
}

capture_output() {
    local output_var="$1"
    shift
    local command=("$@")

    local output
    output=$("${command[@]}" 2>&1)

    eval "$output_var=\"$output\""
}

# Helper function stubs (require logging.sh to be sourced)
log_debug() {
    [[ "${VERBOSE:-false}" == "true" ]] && echo "[DEBUG] $*" >&2
}

log_error() {
    echo "[ERROR] $*" >&2
}
