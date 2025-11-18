#!/usr/bin/env bats

# ============================================================================
# Test Name: test-validation.bats
# Testing: scripts/includes/validation.sh
# Description: Comprehensive tests for input and system validation functions
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# Usage: bats test-validation.bats
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

    # Load the include being tested
    SCRIPTS_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../scripts" && pwd)"

    # Disable strict mode temporarily to source the files
    set +euo pipefail
    source "$SCRIPTS_DIR/includes/validation.sh" 2>/dev/null || true
    set -euo pipefail
}

# Teardown function runs after each test
teardown() {
    # Cleanup after each test
    [[ -n "$TEST_TEMP_DIR" && -d "$TEST_TEMP_DIR" ]] && rm -rf "$TEST_TEMP_DIR"
    unset LOG_FILE
}

# ----- Section: Command Existence Validation -----

# ============================================================================
# Test Name: "command_exists returns 0 for existing commands"
# Test Type: Unit Test
# Test Scope: Validates command_exists detects available system commands
# ============================================================================
@test "command_exists returns 0 for existing commands" {
    run command_exists "bash"
    [[ "$status" -eq 0 ]]

    run command_exists "ls"
    [[ "$status" -eq 0 ]]

    run command_exists "cat"
    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "command_exists returns 1 for non-existent commands"
# Test Type: Unit Test
# Test Scope: Validates command_exists returns failure for missing commands
# ============================================================================
@test "command_exists returns 1 for non-existent commands" {
    run command_exists "non_existent_command_12345"
    [[ "$status" -eq 1 ]]

    run command_exists "totally_fake_command_xyz"
    [[ "$status" -eq 1 ]]
}

# ============================================================================
# Test Name: "command_exists handles empty string"
# Test Type: Edge Case Test
# Test Scope: Validates command_exists with empty command name
# ============================================================================
@test "command_exists handles empty string" {
    run command_exists ""
    [[ "$status" -eq 1 ]]
}

# ----- Section: Required Tools Validation -----

# ============================================================================
# Test Name: "validate_required_tools succeeds with available tools"
# Test Type: Unit Test
# Test Scope: Validates validate_required_tools with all available commands
# ============================================================================
@test "validate_required_tools succeeds with available tools" {
    run validate_required_tools "bash" "ls" "cat"
    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "validate_required_tools fails with missing tools"
# Test Type: Unit Test
# Test Scope: Validates validate_required_tools detects missing commands
# ============================================================================
@test "validate_required_tools fails with missing tools" {
    run validate_required_tools "bash" "non_existent_tool_xyz"
    [[ "$status" -eq 1 ]]
    [[ "$output" == *"Missing required tools"* ]]
}

# ============================================================================
# Test Name: "validate_required_tools lists all missing tools"
# Test Type: Unit Test
# Test Scope: Validates validate_required_tools reports all missing commands
# ============================================================================
@test "validate_required_tools lists all missing tools" {
    run validate_required_tools "missing_tool_1" "missing_tool_2"
    [[ "$status" -eq 1 ]]
    [[ "$output" == *"missing_tool_1"* ]]
    [[ "$output" == *"missing_tool_2"* ]]
}

# ============================================================================
# Test Name: "check_dependencies is alias for validate_required_tools"
# Test Type: Unit Test
# Test Scope: Validates backward compatibility alias
# ============================================================================
@test "check_dependencies is alias for validate_required_tools" {
    run check_dependencies "bash" "ls"
    [[ "$status" -eq 0 ]]
}

# ----- Section: File Validation -----

# ============================================================================
# Test Name: "validate_file_exists succeeds for existing files"
# Test Type: Unit Test
# Test Scope: Validates validate_file_exists with actual files
# ============================================================================
@test "validate_file_exists succeeds for existing files" {
    local test_file="$TEST_TEMP_DIR/test.txt"
    echo "content" > "$test_file"

    run validate_file_exists "$test_file"
    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "validate_file_exists fails for missing files"
# Test Type: Unit Test
# Test Scope: Validates validate_file_exists detects missing files
# ============================================================================
@test "validate_file_exists fails for missing files" {
    run validate_file_exists "/non/existent/file.txt"
    [[ "$status" -eq 1 ]]
    [[ "$output" == *"does not exist"* ]]
}

# ============================================================================
# Test Name: "validate_file_exists accepts custom description"
# Test Type: Unit Test
# Test Scope: Validates validate_file_exists uses custom error descriptions
# ============================================================================
@test "validate_file_exists accepts custom description" {
    run validate_file_exists "/missing.txt" "Configuration file"
    [[ "$status" -eq 1 ]]
    [[ "$output" == *"Configuration file"* ]]
}

# ============================================================================
# Test Name: "validate_file_exists fails for unreadable files"
# Test Type: Error Condition Test
# Test Scope: Validates validate_file_exists detects permission issues
# ============================================================================
@test "validate_file_exists fails for unreadable files" {
    if [[ "$(id -u)" -eq 0 ]]; then
        skip "Cannot test unreadable files as root"
    fi

    local unreadable_file="$TEST_TEMP_DIR/unreadable.txt"
    echo "content" > "$unreadable_file"
    chmod 000 "$unreadable_file"

    run validate_file_exists "$unreadable_file"
    [[ "$status" -eq 1 ]]

    chmod 644 "$unreadable_file"  # Cleanup
}

# ============================================================================
# Test Name: "validate_file_exists fails for directories"
# Test Type: Unit Test
# Test Scope: Validates validate_file_exists rejects directories
# ============================================================================
@test "validate_file_exists fails for directories" {
    mkdir -p "$TEST_TEMP_DIR/testdir"

    run validate_file_exists "$TEST_TEMP_DIR/testdir"
    [[ "$status" -eq 1 ]]
}

# ----- Section: Directory Validation -----

# ============================================================================
# Test Name: "validate_directory_exists succeeds for existing directories"
# Test Type: Unit Test
# Test Scope: Validates validate_directory_exists with actual directories
# ============================================================================
@test "validate_directory_exists succeeds for existing directories" {
    mkdir -p "$TEST_TEMP_DIR/testdir"

    run validate_directory_exists "$TEST_TEMP_DIR/testdir"
    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "validate_directory_exists fails for missing directories"
# Test Type: Unit Test
# Test Scope: Validates validate_directory_exists detects missing directories
# ============================================================================
@test "validate_directory_exists fails for missing directories" {
    run validate_directory_exists "/non/existent/directory"
    [[ "$status" -eq 1 ]]
    [[ "$output" == *"does not exist"* ]]
}

# ============================================================================
# Test Name: "validate_directory_exists accepts custom description"
# Test Type: Unit Test
# Test Scope: Validates validate_directory_exists uses custom error descriptions
# ============================================================================
@test "validate_directory_exists accepts custom description" {
    run validate_directory_exists "/missing/dir" "Build directory"
    [[ "$status" -eq 1 ]]
    [[ "$output" == *"Build directory"* ]]
}

# ============================================================================
# Test Name: "validate_directory_exists fails for files"
# Test Type: Unit Test
# Test Scope: Validates validate_directory_exists rejects regular files
# ============================================================================
@test "validate_directory_exists fails for files" {
    local test_file="$TEST_TEMP_DIR/file.txt"
    touch "$test_file"

    run validate_directory_exists "$test_file"
    [[ "$status" -eq 1 ]]
}

# ----- Section: Version Format Validation -----

# ============================================================================
# Test Name: "validate_version_format accepts valid semver"
# Test Type: Unit Test
# Test Scope: Validates validate_version_format accepts semantic versions
# ============================================================================
@test "validate_version_format accepts valid semver" {
    run validate_version_format "1.0.0"
    [[ "$status" -eq 0 ]]

    run validate_version_format "v1.2.3"
    [[ "$status" -eq 0 ]]

    run validate_version_format "2.0.0-alpha.1"
    [[ "$status" -eq 0 ]]

    run validate_version_format "1.0.0+build.123"
    [[ "$status" -eq 0 ]]

    run validate_version_format "v3.2.1-beta.2+build.456"
    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "validate_version_format rejects invalid versions"
# Test Type: Unit Test
# Test Scope: Validates validate_version_format rejects malformed versions
# ============================================================================
@test "validate_version_format rejects invalid versions" {
    run validate_version_format "1"
    [[ "$status" -eq 1 ]]

    run validate_version_format "1.2"
    [[ "$status" -eq 1 ]]

    run validate_version_format "invalid"
    [[ "$status" -eq 1 ]]

    run validate_version_format "v1.2.x"
    [[ "$status" -eq 1 ]]

    run validate_version_format ""
    [[ "$status" -eq 1 ]]
}

# ----- Section: Email Validation -----

# ============================================================================
# Test Name: "validate_email accepts valid emails"
# Test Type: Unit Test
# Test Scope: Validates validate_email accepts properly formatted email addresses
# ============================================================================
@test "validate_email accepts valid emails" {
    run validate_email "user@example.com"
    [[ "$status" -eq 0 ]]

    run validate_email "test.user+tag@example.co.uk"
    [[ "$status" -eq 0 ]]

    run validate_email "user_name@example-domain.com"
    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "validate_email rejects invalid emails"
# Test Type: Unit Test
# Test Scope: Validates validate_email rejects malformed email addresses
# ============================================================================
@test "validate_email rejects invalid emails" {
    run validate_email "invalid"
    [[ "$status" -eq 1 ]]

    run validate_email "no-at-sign.com"
    [[ "$status" -eq 1 ]]

    run validate_email "@example.com"
    [[ "$status" -eq 1 ]]

    run validate_email "user@"
    [[ "$status" -eq 1 ]]

    run validate_email ""
    [[ "$status" -eq 1 ]]
}

# ----- Section: URL Validation -----

# ============================================================================
# Test Name: "validate_url accepts valid URLs"
# Test Type: Unit Test
# Test Scope: Validates validate_url accepts properly formatted URLs
# ============================================================================
@test "validate_url accepts valid URLs" {
    run validate_url "https://example.com"
    [[ "$status" -eq 0 ]]

    run validate_url "http://test.example.com/path"
    [[ "$status" -eq 0 ]]

    run validate_url "https://example.co.uk/path/to/resource?query=value"
    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "validate_url rejects invalid URLs"
# Test Type: Unit Test
# Test Scope: Validates validate_url rejects malformed URLs
# ============================================================================
@test "validate_url rejects invalid URLs" {
    run validate_url "not-a-url"
    [[ "$status" -eq 1 ]]

    run validate_url "ftp://example.com"
    [[ "$status" -eq 1 ]]

    run validate_url "example.com"
    [[ "$status" -eq 1 ]]

    run validate_url ""
    [[ "$status" -eq 1 ]]
}

# ----- Section: Port Validation -----

# ============================================================================
# Test Name: "validate_port accepts valid ports"
# Test Type: Unit Test
# Test Scope: Validates validate_port accepts valid port numbers
# ============================================================================
@test "validate_port accepts valid ports" {
    run validate_port "80"
    [[ "$status" -eq 0 ]]

    run validate_port "443"
    [[ "$status" -eq 0 ]]

    run validate_port "8080"
    [[ "$status" -eq 0 ]]

    run validate_port "1"
    [[ "$status" -eq 0 ]]

    run validate_port "65535"
    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "validate_port rejects invalid ports"
# Test Type: Unit Test
# Test Scope: Validates validate_port rejects invalid port numbers
# ============================================================================
@test "validate_port rejects invalid ports" {
    run validate_port "0"
    [[ "$status" -eq 1 ]]

    run validate_port "65536"
    [[ "$status" -eq 1 ]]

    run validate_port "-1"
    [[ "$status" -eq 1 ]]

    run validate_port "abc"
    [[ "$status" -eq 1 ]]

    run validate_port ""
    [[ "$status" -eq 1 ]]
}

# ----- Section: IP Address Validation -----

# ============================================================================
# Test Name: "validate_ip_address accepts valid IPv4"
# Test Type: Unit Test
# Test Scope: Validates validate_ip_address accepts valid IPv4 addresses
# ============================================================================
@test "validate_ip_address accepts valid IPv4" {
    run validate_ip_address "192.168.1.1"
    [[ "$status" -eq 0 ]]

    run validate_ip_address "10.0.0.1"
    [[ "$status" -eq 0 ]]

    run validate_ip_address "127.0.0.1"
    [[ "$status" -eq 0 ]]

    run validate_ip_address "255.255.255.255"
    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "validate_ip_address rejects invalid IPv4"
# Test Type: Unit Test
# Test Scope: Validates validate_ip_address rejects malformed IP addresses
# ============================================================================
@test "validate_ip_address rejects invalid IPv4" {
    run validate_ip_address "256.1.1.1"
    [[ "$status" -eq 1 ]]

    run validate_ip_address "192.168.1"
    [[ "$status" -eq 1 ]]

    run validate_ip_address "192.168.1.1.1"
    [[ "$status" -eq 1 ]]

    run validate_ip_address "not.an.ip.address"
    [[ "$status" -eq 1 ]]

    run validate_ip_address ""
    [[ "$status" -eq 1 ]]
}

# ----- Section: JSON File Validation -----

# ============================================================================
# Test Name: "validate_json_file succeeds with valid JSON"
# Test Type: Unit Test
# Test Scope: Validates validate_json_file accepts valid JSON files
# ============================================================================
@test "validate_json_file succeeds with valid JSON" {
    # Check if jq is available
    if ! command_exists "jq"; then
        skip "jq not available"
    fi

    local json_file="$TEST_TEMP_DIR/test.json"
    echo '{"key": "value", "number": 123}' > "$json_file"

    run validate_json_file "$json_file"
    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "validate_json_file fails with invalid JSON"
# Test Type: Unit Test
# Test Scope: Validates validate_json_file detects malformed JSON
# ============================================================================
@test "validate_json_file fails with invalid JSON" {
    if ! command_exists "jq"; then
        skip "jq not available"
    fi

    local json_file="$TEST_TEMP_DIR/invalid.json"
    echo '{"key": "value"' > "$json_file"  # Missing closing brace

    run validate_json_file "$json_file"
    [[ "$status" -eq 1 ]]
}

# ============================================================================
# Test Name: "validate_json_file fails for missing file"
# Test Type: Unit Test
# Test Scope: Validates validate_json_file detects missing files
# ============================================================================
@test "validate_json_file fails for missing file" {
    if ! command_exists "jq"; then
        skip "jq not available"
    fi

    run validate_json_file "/non/existent.json"
    [[ "$status" -eq 1 ]]
}

# ----- Section: YAML File Validation -----

# ============================================================================
# Test Name: "validate_yaml_file succeeds with valid YAML"
# Test Type: Unit Test
# Test Scope: Validates validate_yaml_file accepts valid YAML files
# ============================================================================
@test "validate_yaml_file succeeds with valid YAML" {
    if ! command_exists "yq"; then
        skip "yq not available"
    fi

    local yaml_file="$TEST_TEMP_DIR/test.yaml"
    cat > "$yaml_file" <<EOF
key: value
number: 123
list:
  - item1
  - item2
EOF

    run validate_yaml_file "$yaml_file"
    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "validate_yaml_file fails for missing file"
# Test Type: Unit Test
# Test Scope: Validates validate_yaml_file detects missing files
# ============================================================================
@test "validate_yaml_file fails for missing file" {
    if ! command_exists "yq"; then
        skip "yq not available"
    fi

    run validate_yaml_file "/non/existent.yaml"
    [[ "$status" -eq 1 ]]
}

# ----- Section: Path Safety Validation -----

# ============================================================================
# Test Name: "validate_path_safe rejects directory traversal"
# Test Type: Security Test
# Test Scope: Validates validate_path_safe prevents directory traversal attacks
# ============================================================================
@test "validate_path_safe rejects directory traversal" {
    run validate_path_safe "../../../etc/passwd"
    [[ "$status" -eq 1 ]]
    [[ "$output" == *"Unsafe path"* ]]

    run validate_path_safe "data/../../../secret"
    [[ "$status" -eq 1 ]]
}

# ============================================================================
# Test Name: "validate_path_safe accepts safe paths"
# Test Type: Unit Test
# Test Scope: Validates validate_path_safe accepts safe relative paths
# ============================================================================
@test "validate_path_safe accepts safe paths" {
    run validate_path_safe "data/files/test.txt"
    [[ "$status" -eq 0 ]]

    run validate_path_safe "subdir/file.txt"
    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "validate_path_safe warns about absolute paths"
# Test Type: Unit Test
# Test Scope: Validates validate_path_safe warns for absolute paths
# ============================================================================
@test "validate_path_safe warns about absolute paths" {
    run validate_path_safe "/absolute/path/to/file"
    # Should succeed but with warning
    [[ "$status" -eq 0 ]]
    [[ "$output" == *"Absolute path detected"* ]]
}

# ----- Section: Edge Cases -----

# ============================================================================
# Test Name: "validation functions handle empty strings"
# Test Type: Edge Case Test
# Test Scope: Validates all validation functions handle empty input gracefully
# ============================================================================
@test "validation functions handle empty strings" {
    run validate_version_format ""
    [[ "$status" -eq 1 ]]

    run validate_email ""
    [[ "$status" -eq 1 ]]

    run validate_url ""
    [[ "$status" -eq 1 ]]

    run validate_port ""
    [[ "$status" -eq 1 ]]
}

# ============================================================================
# Test Name: "validation functions handle whitespace"
# Test Type: Edge Case Test
# Test Scope: Validates validation functions with whitespace-only input
# ============================================================================
@test "validation functions handle whitespace" {
    run validate_email "   "
    [[ "$status" -eq 1 ]]

    run validate_url "   "
    [[ "$status" -eq 1 ]]
}

# End of test-validation.bats
