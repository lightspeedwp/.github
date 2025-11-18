#!/bin/bash
# scripts/includes/testing/assertions.sh

# ============================================================================
# Script Name: assertions.sh
# Description: Advanced assertion functions for shell script testing
# Usage: source scripts/includes/testing/assertions.sh
# Examples:
#   assert_success "$status" "Command should succeed"
#   assert_output_contains "expected text" "Command output should contain text"
#   assert_json_valid "$json_output"
#   assert_yaml_valid "$yaml_file"
# ============================================================================

set -euo pipefail

assert_success() {
    local status="$1"
    local message="${2:-Command should exit successfully}"

    if [[ $status -ne 0 ]]; then
        log_error "$message"
        log_error "Exit status: $status"
        return 1
    fi

    return 0
}

assert_failure() {
    local status="$1"
    local expected_status="${2:-1}"
    local message="${3:-Command should fail}"

    if [[ $status -eq 0 ]]; then
        log_error "$message"
        log_error "Expected failure but command succeeded"
        return 1
    fi

    if [[ -n "$expected_status" && $status -ne $expected_status ]]; then
        log_error "$message"
        log_error "Expected exit status $expected_status but got $status"
        return 1
    fi

    return 0
}

assert_output_contains() {
    local expected="$1"
    local actual="${2:-${output:-}}"
    local message="${3:-Output should contain expected text}"

    if [[ ! "$actual" == *"$expected"* ]]; then
        log_error "$message"
        log_error "Expected to find: $expected"
        log_error "Actual output: $actual"
        return 1
    fi

    return 0
}

assert_output_not_contains() {
    local unexpected="$1"
    local actual="${2:-${output:-}}"
    local message="${3:-Output should not contain text}"

    if [[ "$actual" == *"$unexpected"* ]]; then
        log_error "$message"
        log_error "Should not find: $unexpected"
        log_error "Actual output: $actual"
        return 1
    fi

    return 0
}

assert_output_matches() {
    local pattern="$1"
    local actual="${2:-${output:-}}"
    local message="${3:-Output should match pattern}"

    if [[ ! "$actual" =~ $pattern ]]; then
        log_error "$message"
        log_error "Expected pattern: $pattern"
        log_error "Actual output: $actual"
        return 1
    fi

    return 0
}

assert_file_contains() {
    local file_path="$1"
    local expected_content="$2"
    local message="${3:-File should contain expected content}"

    if [[ ! -f "$file_path" ]]; then
        log_error "File not found: $file_path"
        return 1
    fi

    local file_content
    file_content=$(cat "$file_path")

    if [[ ! "$file_content" == *"$expected_content"* ]]; then
        log_error "$message"
        log_error "Expected to find: $expected_content"
        log_error "File: $file_path"
        return 1
    fi

    return 0
}

assert_file_mode() {
    local file_path="$1"
    local expected_mode="$2"
    local message="${3:-File should have expected permissions}"

    if [[ ! -e "$file_path" ]]; then
        log_error "File not found: $file_path"
        return 1
    fi

    local actual_mode
    actual_mode=$(stat -c "%a" "$file_path" 2>/dev/null || stat -f "%OLp" "$file_path")

    if [[ "$actual_mode" != "$expected_mode" ]]; then
        log_error "$message"
        log_error "Expected mode: $expected_mode"
        log_error "Actual mode: $actual_mode"
        log_error "File: $file_path"
        return 1
    fi

    return 0
}

assert_json_valid() {
    local json_content="$1"
    local message="${2:-JSON should be valid}"

    if ! command -v jq >/dev/null 2>&1; then
        log_warning "jq not available, skipping JSON validation"
        return 0
    fi

    if ! echo "$json_content" | jq empty 2>/dev/null; then
        log_error "$message"
        log_error "Invalid JSON: $json_content"
        return 1
    fi

    return 0
}

assert_yaml_valid() {
    local yaml_file="$1"
    local message="${2:-YAML should be valid}"

    if ! command -v yq >/dev/null 2>&1; then
        log_warning "yq not available, skipping YAML validation"
        return 0
    fi

    if [[ ! -f "$yaml_file" ]]; then
        log_error "YAML file not found: $yaml_file"
        return 1
    fi

    if ! yq eval '.' "$yaml_file" >/dev/null 2>&1; then
        log_error "$message"
        log_error "Invalid YAML file: $yaml_file"
        return 1
    fi

    return 0
}

assert_json_key_exists() {
    local json_content="$1"
    local key_path="$2"
    local message="${3:-JSON should have key: $key_path}"

    if ! command -v jq >/dev/null 2>&1; then
        log_warning "jq not available, skipping JSON key check"
        return 0
    fi

    local value
    value=$(echo "$json_content" | jq -r "$key_path" 2>/dev/null)

    if [[ "$value" == "null" || -z "$value" ]]; then
        log_error "$message"
        log_error "Key not found: $key_path"
        return 1
    fi

    return 0
}

assert_json_key_equals() {
    local json_content="$1"
    local key_path="$2"
    local expected_value="$3"
    local message="${4:-JSON key should equal expected value}"

    if ! command -v jq >/dev/null 2>&1; then
        log_warning "jq not available, skipping JSON key check"
        return 0
    fi

    local actual_value
    actual_value=$(echo "$json_content" | jq -r "$key_path" 2>/dev/null)

    if [[ "$actual_value" != "$expected_value" ]]; then
        log_error "$message"
        log_error "Key: $key_path"
        log_error "Expected: $expected_value"
        log_error "Actual: $actual_value"
        return 1
    fi

    return 0
}

assert_symlink_target() {
    local link_path="$1"
    local expected_target="$2"
    local message="${3:-Symlink should point to expected target}"

    if [[ ! -L "$link_path" ]]; then
        log_error "Not a symlink: $link_path"
        return 1
    fi

    local actual_target
    actual_target=$(readlink "$link_path")

    if [[ "$actual_target" != "$expected_target" ]]; then
        log_error "$message"
        log_error "Expected target: $expected_target"
        log_error "Actual target: $actual_target"
        return 1
    fi

    return 0
}

assert_environment_variable() {
    local var_name="$1"
    local expected_value="${2:-}"
    local message="${3:-Environment variable should be set}"

    if [[ -z "${!var_name:-}" ]]; then
        log_error "$message"
        log_error "Variable not set: $var_name"
        return 1
    fi

    if [[ -n "$expected_value" && "${!var_name}" != "$expected_value" ]]; then
        log_error "$message"
        log_error "Variable: $var_name"
        log_error "Expected: $expected_value"
        log_error "Actual: ${!var_name}"
        return 1
    fi

    return 0
}

# Helper function stubs (require logging.sh to be sourced)
log_error() {
    echo "[ERROR] $*" >&2
}

log_warning() {
    echo "[WARNING] $*" >&2
}
