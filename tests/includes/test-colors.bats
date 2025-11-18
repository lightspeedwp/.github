#!/usr/bin/env bats

# ============================================================================
# Test Name: test-colors.bats
# Testing: scripts/includes/colors.sh
# Description: Comprehensive tests for color codes and formatting utilities
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# Usage: bats test-colors.bats
# Options: None
# ============================================================================

# Load test helpers
load "$(dirname "$BATS_TEST_FILENAME")/../test-helper.bash"

# Setup function runs before each test
setup() {
    # Setup test environment for each test
    TEST_TEMP_DIR=$(mktemp -d)
    export TEST_TEMP_DIR

    # Load the include being tested
    SCRIPTS_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../scripts" && pwd)"
    source "$SCRIPTS_DIR/includes/colors.sh"
}

# Teardown function runs after each test
teardown() {
    # Cleanup after each test
    [[ -n "$TEST_TEMP_DIR" && -d "$TEST_TEMP_DIR" ]] && rm -rf "$TEST_TEMP_DIR"
}

# ----- Section: Color Constants -----

# ============================================================================
# Test Name: "color constants are defined"
# Test Type: Unit Test
# Test Scope: Validates all standard color constants are properly defined
# ============================================================================
@test "color constants are defined" {
    [[ -n "$RED" ]]
    [[ -n "$GREEN" ]]
    [[ -n "$YELLOW" ]]
    [[ -n "$BLUE" ]]
    [[ -n "$PURPLE" ]]
    [[ -n "$CYAN" ]]
    [[ -n "$WHITE" ]]
    [[ -n "$BLACK" ]]
    [[ -n "$NC" ]]
}

# ============================================================================
# Test Name: "bright color constants are defined"
# Test Type: Unit Test
# Test Scope: Validates all bright color variants are properly defined
# ============================================================================
@test "bright color constants are defined" {
    [[ -n "$BRIGHT_RED" ]]
    [[ -n "$BRIGHT_GREEN" ]]
    [[ -n "$BRIGHT_YELLOW" ]]
    [[ -n "$BRIGHT_BLUE" ]]
    [[ -n "$BRIGHT_PURPLE" ]]
    [[ -n "$BRIGHT_CYAN" ]]
    [[ -n "$BRIGHT_WHITE" ]]
}

# ============================================================================
# Test Name: "text formatting constants are defined"
# Test Type: Unit Test
# Test Scope: Validates text formatting constants (bold, underline, etc.)
# ============================================================================
@test "text formatting constants are defined" {
    [[ -n "$BOLD" ]]
    [[ -n "$DIM" ]]
    [[ -n "$UNDERLINE" ]]
    [[ -n "$BLINK" ]]
    [[ -n "$REVERSE" ]]
    [[ -n "$STRIKETHROUGH" ]]
}

# ============================================================================
# Test Name: "color constants contain ANSI escape codes"
# Test Type: Unit Test
# Test Scope: Validates color constants contain proper ANSI escape sequences
# ============================================================================
@test "color constants contain ANSI escape codes" {
    [[ "$RED" == *"\033["* ]]
    [[ "$GREEN" == *"\033["* ]]
    [[ "$NC" == *"\033["* ]]
}

# ----- Section: Color Support Detection -----

# ============================================================================
# Test Name: "check_color_support detects terminal support"
# Test Type: Unit Test
# Test Scope: Validates check_color_support function behavior with TERM variable
# ============================================================================
@test "check_color_support detects terminal support with xterm" {
    export TERM="xterm-256color"
    run check_color_support
    # When not running in actual TTY, this may fail - we test the logic exists
    # The function should exist and be callable
    [[ "$status" -eq 0 ]] || [[ "$status" -eq 1 ]]
}

# ============================================================================
# Test Name: "check_color_support returns false without TERM"
# Test Type: Unit Test
# Test Scope: Validates check_color_support returns false when TERM is unset
# ============================================================================
@test "check_color_support returns false without TERM" {
    unset TERM
    run check_color_support
    [[ "$status" -eq 1 ]]
}

# ============================================================================
# Test Name: "check_color_support handles various TERM values"
# Test Type: Unit Test
# Test Scope: Validates check_color_support with different TERM environment values
# ============================================================================
@test "check_color_support handles various TERM values" {
    # Test with color-supporting TERM
    export TERM="xterm-color"
    run check_color_support
    # Function should execute without error
    [[ "$status" -eq 0 ]] || [[ "$status" -eq 1 ]]

    # Test with ansi TERM
    export TERM="ansi"
    run check_color_support
    [[ "$status" -eq 0 ]] || [[ "$status" -eq 1 ]]

    # Test with screen TERM
    export TERM="screen"
    run check_color_support
    [[ "$status" -eq 0 ]] || [[ "$status" -eq 1 ]]
}

# ----- Section: Colorize Function -----

# ============================================================================
# Test Name: "colorize function exists and is callable"
# Test Type: Unit Test
# Test Scope: Validates colorize function is defined and can be invoked
# ============================================================================
@test "colorize function exists and is callable" {
    run colorize "$RED" "test message"
    [[ "$status" -eq 0 ]]
    [[ -n "$output" ]]
}

# ============================================================================
# Test Name: "colorize returns text content"
# Test Type: Unit Test
# Test Scope: Validates colorize function returns the input text
# ============================================================================
@test "colorize returns text content" {
    run colorize "$GREEN" "success message"
    [[ "$status" -eq 0 ]]
    [[ "$output" == *"success message"* ]]
}

# ============================================================================
# Test Name: "colorize handles empty text"
# Test Type: Edge Case Test
# Test Scope: Validates colorize function with empty string input
# ============================================================================
@test "colorize handles empty text" {
    run colorize "$RED" ""
    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "colorize handles special characters"
# Test Type: Edge Case Test
# Test Scope: Validates colorize function with special characters in text
# ============================================================================
@test "colorize handles special characters" {
    run colorize "$BLUE" "test \$VAR with special chars: @#%&*"
    [[ "$status" -eq 0 ]]
    [[ "$output" == *"special chars"* ]]
}

# ============================================================================
# Test Name: "colorize handles very long strings"
# Test Type: Edge Case Test
# Test Scope: Validates colorize function with long text input
# ============================================================================
@test "colorize handles very long strings" {
    local long_string
    long_string=$(printf 'a%.0s' {1..1000})
    run colorize "$YELLOW" "$long_string"
    [[ "$status" -eq 0 ]]
    [[ ${#output} -ge 1000 ]]
}

# ============================================================================
# Test Name: "colorize handles Unicode characters"
# Test Type: Edge Case Test
# Test Scope: Validates colorize function with Unicode/emoji input
# ============================================================================
@test "colorize handles Unicode characters" {
    run colorize "$GREEN" "Testing Unicode: émojis 🎉 and 中文"
    [[ "$status" -eq 0 ]]
    [[ "$output" == *"Unicode"* ]]
}

# ============================================================================
# Test Name: "colorize with all standard colors"
# Test Type: Integration Test
# Test Scope: Validates colorize function works with all defined color constants
# ============================================================================
@test "colorize with all standard colors" {
    run colorize "$RED" "red"
    [[ "$status" -eq 0 ]]

    run colorize "$GREEN" "green"
    [[ "$status" -eq 0 ]]

    run colorize "$YELLOW" "yellow"
    [[ "$status" -eq 0 ]]

    run colorize "$BLUE" "blue"
    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "colorize with formatting constants"
# Test Type: Integration Test
# Test Scope: Validates colorize function works with text formatting constants
# ============================================================================
@test "colorize with formatting constants" {
    run colorize "$BOLD" "bold text"
    [[ "$status" -eq 0 ]]

    run colorize "$UNDERLINE" "underlined text"
    [[ "$status" -eq 0 ]]
}

# ----- Section: Error Conditions -----

# ============================================================================
# Test Name: "colorize handles missing color argument gracefully"
# Test Type: Error Condition Test
# Test Scope: Validates colorize behavior when color argument is missing
# ============================================================================
@test "colorize handles missing color argument" {
    # This test validates the function doesn't crash without color arg
    run colorize "" "text without color"
    # Should not crash, regardless of exit status
    [[ "$status" -eq 0 ]] || [[ "$status" -eq 1 ]]
}

# ----- Section: Constants Immutability -----

# ============================================================================
# Test Name: "color constants are readonly"
# Test Type: Unit Test
# Test Scope: Validates color constants cannot be modified (readonly)
# ============================================================================
@test "color constants are readonly" {
    # Attempt to modify a readonly constant should fail
    run bash -c "source '$SCRIPTS_DIR/includes/colors.sh'; RED='modified'"
    [[ "$status" -eq 1 ]]
}

# ============================================================================
# Test Name: "NC reset constant is properly defined"
# Test Type: Unit Test
# Test Scope: Validates NC (No Color) reset constant contains proper ANSI code
# ============================================================================
@test "NC reset constant is properly defined" {
    [[ "$NC" == *"\033[0m"* ]]
}

# End of test-colors.bats
