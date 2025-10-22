#!/usr/bin/env bats
# ============================================================================
# Test name: test-validation.bats
# Testing: scripts/includes/core/validation.sh
# Description: Test suite for input and system validation functions
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: bats, scripts/includes/core/validation.sh, test-helper.bash
# Usage: bats tests/includes/core/test-validation.bats
# Environment Variables: None
# Options: None
# Examples:
#   bats tests/includes/core/test-validation.bats
# Notes:
#   - Tests all validation functions
#   - Tests both success and failure cases
#   - Tests edge cases and error handling
# ============================================================================

# Load test helpers
load "$(dirname "$BATS_TEST_FILENAME")/../../test-helper.bash"

# Setup function - runs before each test
setup() {
    # Get the repository root and resolve paths
    TEST_REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../.." && pwd)"
    VALIDATION_SCRIPT="${TEST_REPO_ROOT}/scripts/includes/core/validation.sh"
    
    # Create temporary directory for test files
    TEST_TEMP_DIR=$(mktemp -d)
    TEST_FILE="${TEST_TEMP_DIR}/test-file.txt"
    TEST_DIR="${TEST_TEMP_DIR}/test-dir"
    
    # Create test file and directory
    echo "test content" > "$TEST_FILE"
    mkdir -p "$TEST_DIR"
    
    # Verify the validation script exists
    [[ -f "$VALIDATION_SCRIPT" ]]
}

# Teardown function - runs after each test
teardown() {
    # Clean up temporary files
    [[ -d "$TEST_TEMP_DIR" ]] && rm -rf "$TEST_TEMP_DIR"
}

# ----- Section: Basic Script Tests -----

# ============================================================================
# Test Name: "validation script sources without errors"
# Test Type: Basic Functionality
# Test Scope: Validates that the validation script can be sourced successfully
# ============================================================================
@test "validation script sources without errors" {
    run bash -c "source '$VALIDATION_SCRIPT'"
    [ "$status" -eq 0 ]
}

# ----- Section: Command Existence Tests -----

# ============================================================================
# Test Name: "command_exists detects existing commands"
# Test Type: Command Detection
# Test Scope: Validates that command_exists correctly identifies available commands
# ============================================================================
@test "command_exists detects existing commands" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        if command_exists 'bash'; then
            echo 'bash exists'
        fi
        if command_exists 'ls'; then
            echo 'ls exists'
        fi
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "bash exists" ]]
    [[ "$output" =~ "ls exists" ]]
}

# ============================================================================
# Test Name: "command_exists returns false for non-existent commands"
# Test Type: Command Detection
# Test Scope: Validates that command_exists correctly identifies missing commands
# ============================================================================
@test "command_exists returns false for non-existent commands" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        if command_exists 'non-existent-command-xyz'; then
            echo 'found'
        else
            echo 'not found'
        fi
    "
    [ "$status" -eq 0 ]
    [[ "$output" == "not found" ]]
}

# ============================================================================
# Test Name: "validate_required_tools succeeds with available tools"
# Test Type: Tool Validation
# Test Scope: Validates successful validation when all required tools are available
# ============================================================================
@test "validate_required_tools succeeds with available tools" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_required_tools 'bash' 'ls' 'cat'
        echo 'validation passed'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "validation passed" ]]
}

# ============================================================================
# Test Name: "validate_required_tools fails with missing tools"
# Test Type: Tool Validation
# Test Scope: Validates failure detection when required tools are missing
# ============================================================================
@test "validate_required_tools fails with missing tools" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_required_tools 'bash' 'non-existent-tool-xyz'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Missing required tools" ]]
    [[ "$output" =~ "non-existent-tool-xyz" ]]
}

# ----- Section: File Validation Tests -----

# ============================================================================
# Test Name: "validate_file_exists succeeds for existing files"
# Test Type: File Validation
# Test Scope: Validates successful validation of existing, readable files
# ============================================================================
@test "validate_file_exists succeeds for existing files" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_file_exists '$TEST_FILE' 'Test file'
        echo 'file validation passed'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "file validation passed" ]]
}

# ============================================================================
# Test Name: "validate_file_exists fails for non-existent files"
# Test Type: File Validation
# Test Scope: Validates error handling for non-existent files
# ============================================================================
@test "validate_file_exists fails for non-existent files" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_file_exists '/non/existent/file.txt' 'Missing file'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Missing file does not exist" ]]
}

# ============================================================================
# Test Name: "validate_directory_exists succeeds for existing directories"
# Test Type: Directory Validation
# Test Scope: Validates successful validation of existing, accessible directories
# ============================================================================
@test "validate_directory_exists succeeds for existing directories" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_directory_exists '$TEST_DIR' 'Test directory'
        echo 'directory validation passed'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "directory validation passed" ]]
}

# ============================================================================
# Test Name: "validate_directory_exists fails for non-existent directories"
# Test Type: Directory Validation
# Test Scope: Validates error handling for non-existent directories
# ============================================================================
@test "validate_directory_exists fails for non-existent directories" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_directory_exists '/non/existent/directory' 'Missing directory'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Missing directory does not exist" ]]
}

# ----- Section: Version Format Tests -----

# ============================================================================
# Test Name: "validate_version_format accepts valid semantic versions"
# Test Type: Version Validation
# Test Scope: Validates acceptance of properly formatted semantic version strings
# ============================================================================
@test "validate_version_format accepts valid semantic versions" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_version_format '1.0.0' && echo 'v1'
        validate_version_format 'v2.1.3' && echo 'v2'
        validate_version_format '1.2.3-alpha.1' && echo 'v3'
        validate_version_format '1.2.3+build.123' && echo 'v4'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "v1" ]]
    [[ "$output" =~ "v2" ]]
    [[ "$output" =~ "v3" ]]
    [[ "$output" =~ "v4" ]]
}

# ============================================================================
# Test Name: "validate_version_format rejects invalid versions"
# Test Type: Version Validation
# Test Scope: Validates rejection of improperly formatted version strings
# ============================================================================
@test "validate_version_format rejects invalid versions" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_version_format '1.0'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Invalid version format" ]]
    
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_version_format 'invalid'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Invalid version format" ]]
}

# ----- Section: Email Validation Tests -----

# ============================================================================
# Test Name: "validate_email accepts valid email addresses"
# Test Type: Email Validation
# Test Scope: Validates acceptance of properly formatted email addresses
# ============================================================================
@test "validate_email accepts valid email addresses" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_email 'user@example.com' && echo 'email1'
        validate_email 'test.user+tag@domain.co.uk' && echo 'email2'
        validate_email 'user123@test-domain.org' && echo 'email3'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "email1" ]]
    [[ "$output" =~ "email2" ]]
    [[ "$output" =~ "email3" ]]
}

# ============================================================================
# Test Name: "validate_email rejects invalid email addresses"
# Test Type: Email Validation
# Test Scope: Validates rejection of improperly formatted email addresses
# ============================================================================
@test "validate_email rejects invalid email addresses" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_email 'invalid-email'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Invalid email format" ]]
    
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_email '@domain.com'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Invalid email format" ]]
}

# ----- Section: URL Validation Tests -----

# ============================================================================
# Test Name: "validate_url accepts valid URLs"
# Test Type: URL Validation
# Test Scope: Validates acceptance of properly formatted HTTP/HTTPS URLs
# ============================================================================
@test "validate_url accepts valid URLs" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_url 'https://example.com' && echo 'url1'
        validate_url 'http://test.domain.org/path' && echo 'url2'
        validate_url 'https://sub.domain.com:8080/path?query=value' && echo 'url3'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "url1" ]]
    [[ "$output" =~ "url2" ]]
    [[ "$output" =~ "url3" ]]
}

# ============================================================================
# Test Name: "validate_url rejects invalid URLs"
# Test Type: URL Validation
# Test Scope: Validates rejection of improperly formatted URLs
# ============================================================================
@test "validate_url rejects invalid URLs" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_url 'invalid-url'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Invalid URL format" ]]
    
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_url 'ftp://example.com'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Invalid URL format" ]]
}

# ----- Section: Port Validation Tests -----

# ============================================================================
# Test Name: "validate_port accepts valid port numbers"
# Test Type: Port Validation
# Test Scope: Validates acceptance of valid port numbers within allowed range
# ============================================================================
@test "validate_port accepts valid port numbers" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_port '80' && echo 'port1'
        validate_port '443' && echo 'port2'
        validate_port '8080' && echo 'port3'
        validate_port '65535' && echo 'port4'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "port1" ]]
    [[ "$output" =~ "port2" ]]
    [[ "$output" =~ "port3" ]]
    [[ "$output" =~ "port4" ]]
}

# ============================================================================
# Test Name: "validate_port rejects invalid port numbers"
# Test Type: Port Validation
# Test Scope: Validates rejection of invalid port numbers and out-of-range values
# ============================================================================
@test "validate_port rejects invalid port numbers" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_port '0'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Port must be between 1 and 65535" ]]
    
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_port '65536'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Port must be between 1 and 65535" ]]
    
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_port 'abc'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Port must be a number" ]]
}

# ----- Section: IP Address Validation Tests -----

# ============================================================================
# Test Name: "validate_ip_address accepts valid IPv4 addresses"
# Test Type: IP Validation
# Test Scope: Validates acceptance of properly formatted IPv4 addresses
# ============================================================================
@test "validate_ip_address accepts valid IPv4 addresses" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_ip_address '192.168.1.1' && echo 'ip1'
        validate_ip_address '10.0.0.1' && echo 'ip2'
        validate_ip_address '127.0.0.1' && echo 'ip3'
        validate_ip_address '255.255.255.255' && echo 'ip4'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "ip1" ]]
    [[ "$output" =~ "ip2" ]]
    [[ "$output" =~ "ip3" ]]
    [[ "$output" =~ "ip4" ]]
}

# ============================================================================
# Test Name: "validate_ip_address rejects invalid IPv4 addresses"
# Test Type: IP Validation
# Test Scope: Validates rejection of improperly formatted IPv4 addresses
# ============================================================================
@test "validate_ip_address rejects invalid IPv4 addresses" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_ip_address '256.1.1.1'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Invalid IP address" ]]
    
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_ip_address '192.168.1'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Invalid IP address format" ]]
}

# ----- Section: Path Safety Tests -----

# ============================================================================
# Test Name: "validate_path_safe accepts safe paths"
# Test Type: Path Security
# Test Scope: Validates acceptance of safe paths without directory traversal
# ============================================================================
@test "validate_path_safe accepts safe paths" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_path_safe 'safe/path/file.txt' && echo 'safe1'
        validate_path_safe 'relative/path' && echo 'safe2'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "safe1" ]]
    [[ "$output" =~ "safe2" ]]
}

# ============================================================================
# Test Name: "validate_path_safe detects directory traversal"
# Test Type: Path Security
# Test Scope: Validates detection and rejection of directory traversal attempts
# ============================================================================
@test "validate_path_safe detects directory traversal" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_path_safe '../../../etc/passwd'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Unsafe path" ]]
    [[ "$output" =~ ".." ]]
}

# ----- Section: JSON and YAML Validation Tests -----

# ============================================================================
# Test Name: "validate_json_file works when jq is available"
# Test Type: Conditional Validation
# Test Scope: Validates JSON file validation when jq command is available
# ============================================================================
@test "validate_json_file works when jq is available" {
    if ! command -v jq >/dev/null 2>&1; then
        skip "jq not available for testing"
    fi
    
    # Create valid JSON file
    local json_file="${TEST_TEMP_DIR}/valid.json"
    echo '{"key": "value", "number": 123}' > "$json_file"
    
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_json_file '$json_file'
        echo 'json validation passed'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "json validation passed" ]]
}

# ============================================================================
# Test Name: "validate_json_file detects invalid JSON"
# Test Type: JSON Validation
# Test Scope: Validates detection of invalid JSON syntax
# ============================================================================
@test "validate_json_file detects invalid JSON" {
    if ! command -v jq >/dev/null 2>&1; then
        skip "jq not available for testing"
    fi
    
    # Create invalid JSON file
    local json_file="${TEST_TEMP_DIR}/invalid.json"
    echo '{"key": "value", "invalid": }' > "$json_file"
    
    run bash -c "
        source '$VALIDATION_SCRIPT'
        validate_json_file '$json_file'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Invalid JSON syntax" ]]
}

# ============================================================================
# Test Name: "validate_json_file handles missing jq"
# Test Type: Dependency Handling
# Test Scope: Validates proper error handling when jq command is not available
# ============================================================================
@test "validate_json_file handles missing jq" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        PATH='' validate_json_file '$TEST_FILE'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "jq command required" ]]
}

# ----- Section: Backward Compatibility Tests -----

# ============================================================================
# Test Name: "check_dependencies is alias for validate_required_tools"
# Test Type: Backward Compatibility
# Test Scope: Validates that old function name still works as expected
# ============================================================================
@test "check_dependencies is alias for validate_required_tools" {
    run bash -c "
        source '$VALIDATION_SCRIPT'
        check_dependencies 'bash' 'ls'
        echo 'compatibility check passed'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "compatibility check passed" ]]
}

# End of test-validation.bats