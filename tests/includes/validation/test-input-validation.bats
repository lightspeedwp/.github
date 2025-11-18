#!/usr/bin/env bats
# tests/includes/validation/test-input-validation.bats

# ============================================================================
# Test Suite: input-validation.sh
# Description: Tests for input validation functions
# ============================================================================

load "../../includes/enhanced-test-helpers.bash"

setup() {
    setup_enhanced_test_environment
    source "${BATS_TEST_DIRNAME}/../../../scripts/includes/validation/input-validation.sh"
}

teardown() {
    cleanup_enhanced_test_environment
}

# ============================================================================
# Basic Parameter Validation Tests
# ============================================================================

@test "validate_required_param: should pass for non-empty value" {
    run validate_required_param "test_value" "test_param"
    assert_success
}

@test "validate_required_param: should fail for empty value" {
    run validate_required_param "" "test_param"
    assert_failure
}

@test "validate_required_param: should fail for unset value" {
    run validate_required_param "" "test_param"
    assert_failure
}

# ============================================================================
# Email Validation Tests
# ============================================================================

@test "validate_email_format: should pass for valid email" {
    run validate_email_format "user@example.com"
    assert_success
}

@test "validate_email_format: should pass for email with plus" {
    run validate_email_format "user+tag@example.com"
    assert_success
}

@test "validate_email_format: should fail for invalid email without @" {
    run validate_email_format "userexample.com"
    assert_failure
}

@test "validate_email_format: should fail for invalid email without domain" {
    run validate_email_format "user@"
    assert_failure
}

@test "validate_email_format: should fail for invalid email without user" {
    run validate_email_format "@example.com"
    assert_failure
}

# ============================================================================
# File Validation Tests
# ============================================================================

@test "validate_file_exists: should pass for existing file" {
    local test_file="${TEST_TEMP_DIR}/test_file.txt"
    echo "test content" > "$test_file"

    run validate_file_exists "$test_file"
    assert_success
}

@test "validate_file_exists: should fail for non-existent file" {
    run validate_file_exists "/nonexistent/file.txt"
    assert_failure
}

@test "validate_file_exists: should check readability when requested" {
    local test_file="${TEST_TEMP_DIR}/test_file.txt"
    echo "test content" > "$test_file"
    chmod 000 "$test_file"

    run validate_file_exists "$test_file" "test_file" "true"
    assert_failure

    chmod 644 "$test_file"
}

# ============================================================================
# Directory Validation Tests
# ============================================================================

@test "validate_directory_exists: should pass for existing directory" {
    local test_dir="${TEST_TEMP_DIR}/test_dir"
    mkdir -p "$test_dir"

    run validate_directory_exists "$test_dir"
    assert_success
}

@test "validate_directory_exists: should fail for non-existent directory" {
    run validate_directory_exists "/nonexistent/directory"
    assert_failure
}

@test "validate_directory_exists: should check writability when requested" {
    local test_dir="${TEST_TEMP_DIR}/test_dir"
    mkdir -p "$test_dir"
    chmod 555 "$test_dir"

    run validate_directory_exists "$test_dir" "test_dir" "true"
    assert_failure

    chmod 755 "$test_dir"
}

# ============================================================================
# Pattern Validation Tests
# ============================================================================

@test "validate_with_pattern: should pass for matching pattern" {
    run validate_with_pattern "test123" "^[a-z0-9]+$" "alphanumeric"
    assert_success
}

@test "validate_with_pattern: should fail for non-matching pattern" {
    run validate_with_pattern "test@123" "^[a-z0-9]+$" "alphanumeric"
    assert_failure
}

# ============================================================================
# Number Range Validation Tests
# ============================================================================

@test "validate_number_range: should pass for valid number in range" {
    run validate_number_range "50" "1" "100" "test number"
    assert_success
}

@test "validate_number_range: should fail for number below range" {
    run validate_number_range "0" "1" "100" "test number"
    assert_failure
}

@test "validate_number_range: should fail for number above range" {
    run validate_number_range "101" "1" "100" "test number"
    assert_failure
}

@test "validate_number_range: should fail for non-numeric value" {
    run validate_number_range "abc" "1" "100" "test number"
    assert_failure
}

# ============================================================================
# URL Validation Tests
# ============================================================================

@test "validate_url_format: should pass for valid HTTP URL" {
    run validate_url_format "http://example.com"
    assert_success
}

@test "validate_url_format: should pass for valid HTTPS URL" {
    run validate_url_format "https://example.com"
    assert_success
}

@test "validate_url_format: should pass for URL with port" {
    run validate_url_format "https://example.com:8080"
    assert_success
}

@test "validate_url_format: should pass for URL with path" {
    run validate_url_format "https://example.com/path/to/resource"
    assert_success
}

@test "validate_url_format: should fail for invalid URL without protocol" {
    run validate_url_format "example.com"
    assert_failure
}

# ============================================================================
# Batch Validation Tests
# ============================================================================

@test "validate_params_batch: should pass for all valid parameters" {
    local test_file="${TEST_TEMP_DIR}/test.txt"
    echo "test" > "$test_file"

    run validate_params_batch \
        "username:testuser" \
        "user_email:test@example.com" \
        "config_file:$test_file"

    assert_success
}

@test "validate_params_batch: should fail if any parameter is invalid" {
    run validate_params_batch \
        "username:testuser" \
        "user_email:invalid_email"

    assert_failure
}

# ============================================================================
# Error Management Tests
# ============================================================================

@test "clear_validation_errors: should reset error count" {
    validate_required_param "" "test" || true

    run get_validation_errors
    [[ "$output" == *"Validation Errors"* ]]

    clear_validation_errors

    run get_validation_errors
    [[ "$output" == "No validation errors" ]]
}

@test "get_validation_errors: should return errors in text format" {
    validate_required_param "" "test_param" || true

    run get_validation_errors "text"
    [[ "$output" == *"Validation Errors"* ]]
    [[ "$output" == *"test_param"* ]]
}

@test "get_validation_errors: should return errors in JSON format" {
    VALIDATION_STRICT_MODE=false
    validate_required_param "" "test_param" || true

    run get_validation_errors "json"
    [[ "$output" == *"error_count"* ]]
    [[ "$output" == *"test_param"* ]]
}
