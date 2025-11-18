#!/usr/bin/env bats
# tests/includes/utilities/test-string-utils.bats

# ============================================================================
# Test Suite: string-utils.sh
# Description: Tests for string manipulation utilities
# ============================================================================

load "../../includes/enhanced-test-helpers.bash"

setup() {
    setup_enhanced_test_environment
    source "${BATS_TEST_DIRNAME}/../../../scripts/includes/utilities/string-utils.sh"
}

teardown() {
    cleanup_enhanced_test_environment
}

# ============================================================================
# Trimming Tests
# ============================================================================

@test "trim_whitespace: should remove leading and trailing whitespace" {
    result=$(trim_whitespace "  hello world  ")
    [[ "$result" == "hello world" ]]
}

@test "trim_whitespace: should handle string with no whitespace" {
    result=$(trim_whitespace "hello")
    [[ "$result" == "hello" ]]
}

# ============================================================================
# Case Conversion Tests
# ============================================================================

@test "to_uppercase: should convert string to uppercase" {
    result=$(to_uppercase "hello world")
    [[ "$result" == "HELLO WORLD" ]]
}

@test "to_lowercase: should convert string to lowercase" {
    result=$(to_lowercase "HELLO WORLD")
    [[ "$result" == "hello world" ]]
}

# ============================================================================
# String Matching Tests
# ============================================================================

@test "string_contains: should return true when substring exists" {
    run string_contains "hello world" "world"
    assert_success
}

@test "string_contains: should return false when substring does not exist" {
    run string_contains "hello world" "xyz"
    assert_failure
}

@test "string_starts_with: should return true for matching prefix" {
    run string_starts_with "hello world" "hello"
    assert_success
}

@test "string_starts_with: should return false for non-matching prefix" {
    run string_starts_with "hello world" "world"
    assert_failure
}

@test "string_ends_with: should return true for matching suffix" {
    run string_ends_with "hello world" "world"
    assert_success
}

@test "string_ends_with: should return false for non-matching suffix" {
    run string_ends_with "hello world" "hello"
    assert_failure
}

# ============================================================================
# String Manipulation Tests
# ============================================================================

@test "string_replace: should replace all occurrences" {
    result=$(string_replace "hello world world" "world" "bash")
    [[ "$result" == "hello bash bash" ]]
}

@test "string_length: should return correct length" {
    result=$(string_length "hello")
    [[ "$result" == "5" ]]
}

@test "string_repeat: should repeat string specified times" {
    result=$(string_repeat "ab" 3)
    [[ "$result" == "ababab" ]]
}

@test "string_truncate: should truncate long strings" {
    result=$(string_truncate "hello world this is a test" 10)
    [[ "$result" == "hello w..." ]]
}

@test "string_truncate: should not truncate short strings" {
    result=$(string_truncate "hello" 10)
    [[ "$result" == "hello" ]]
}

# ============================================================================
# Padding Tests
# ============================================================================

@test "string_pad_left: should pad string on the left" {
    result=$(string_pad_left "test" 8)
    [[ "${#result}" == "8" ]]
    [[ "$result" == *"test" ]]
}

@test "string_pad_right: should pad string on the right" {
    result=$(string_pad_right "test" 8)
    [[ "${#result}" == "8" ]]
    [[ "$result" == "test"* ]]
}

# ============================================================================
# Formatting Tests
# ============================================================================

@test "slugify: should convert string to slug" {
    result=$(slugify "Hello World Test")
    [[ "$result" == "hello-world-test" ]]
}

@test "slugify: should remove special characters" {
    result=$(slugify "Hello@World!Test#")
    [[ "$result" == "helloworldtest" ]]
}

@test "slugify: should handle consecutive spaces" {
    result=$(slugify "hello   world")
    [[ "$result" == "hello-world" ]]
}

@test "camel_to_snake: should convert camelCase to snake_case" {
    result=$(camel_to_snake "camelCaseString")
    [[ "$result" == "camel_case_string" ]]
}

@test "snake_to_camel: should convert snake_case to camelCase" {
    result=$(snake_to_camel "snake_case_string")
    [[ "$result" == "snakeCaseString" ]]
}
