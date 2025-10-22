#!/usr/bin/env bats
# ============================================================================
# Test name: test-colors.bats
# Testing: scripts/includes/core/colors.sh
# Description: Test suite for color constants and terminal support functions
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: bats, scripts/includes/core/colors.sh
# Usage: bats tests/includes/core/test-colors.bats
# Environment Variables: TERM - Terminal type for color support testing
# Options: None
# Examples:
#   bats tests/includes/core/test-colors.bats
#   TERM=xterm bats tests/includes/core/test-colors.bats
# Notes:
#   - Tests color constants definition
#   - Tests terminal color support detection
#   - Tests colorize function with and without color support
# ============================================================================

# Load test helpers
load "$(dirname "$BATS_TEST_FILENAME")/../../test-helper.bash"

# Setup function - runs before each test
setup() {
    # Get the repository root and resolve paths
    TEST_REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../.." && pwd)"
    COLORS_SCRIPT="${TEST_REPO_ROOT}/scripts/includes/core/colors.sh"
    
    # Verify the colors script exists
    [[ -f "$COLORS_SCRIPT" ]]
}

# ----- Section: Color Constants Tests -----

# ============================================================================
# Test Name: "colors script sources without errors"
# Test Type: Basic Functionality
# Test Scope: Validates that the colors script can be sourced successfully without syntax errors
# ============================================================================
@test "colors script sources without errors" {
    run bash -c "source '$COLORS_SCRIPT'"
    [ "$status" -eq 0 ]
}

# ============================================================================
# Test Name: "color constants are defined"
# Test Type: Constant Definition
# Test Scope: Validates that all essential color constants are properly defined
# ============================================================================
@test "color constants are defined" {
    run bash -c "
        source '$COLORS_SCRIPT'
        echo \"\${RED}\${GREEN}\${YELLOW}\${BLUE}\${NC}\"
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ $'\033' ]] # Should contain ANSI escape sequences
}

# ============================================================================
# Test Name: "bright color constants are defined"
# Test Type: Constant Definition
# Test Scope: Validates that bright/bold color variants are properly defined
# ============================================================================
@test "bright color constants are defined" {
    run bash -c "
        source '$COLORS_SCRIPT'
        echo \"\${BRIGHT_RED}\${BRIGHT_GREEN}\${BRIGHT_YELLOW}\${BRIGHT_BLUE}\"
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ $'\033\[1;' ]] # Should contain bright color codes
}

# ============================================================================
# Test Name: "text formatting constants are defined"
# Test Type: Constant Definition
# Test Scope: Validates that text formatting constants (bold, underline, etc.) are defined
# ============================================================================
@test "text formatting constants are defined" {
    run bash -c "
        source '$COLORS_SCRIPT'
        echo \"\${BOLD}\${DIM}\${UNDERLINE}\${REVERSE}\"
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ $'\033' ]] # Should contain ANSI escape sequences
}

# ============================================================================
# Test Name: "NC (no color) constant resets formatting"
# Test Type: Reset Functionality
# Test Scope: Validates that the NC constant properly resets all formatting
# ============================================================================
@test "NC (no color) constant resets formatting" {
    run bash -c "
        source '$COLORS_SCRIPT'
        echo -n \"\${NC}\"
    "
    [ "$status" -eq 0 ]
    [[ "$output" == $'\033[0m' ]]
}

# ----- Section: Color Support Detection Tests -----

# ============================================================================
# Test Name: "check_color_support detects xterm support"
# Test Type: Support Detection
# Test Scope: Validates color support detection for xterm terminals
# ============================================================================
@test "check_color_support detects xterm support" {
    run bash -c "
        export TERM=xterm-256color
        source '$COLORS_SCRIPT'
        if check_color_support; then
            echo 'supported'
        else
            echo 'not supported'
        fi
    "
    [ "$status" -eq 0 ]
    [[ "$output" == "supported" ]]
}

# ============================================================================
# Test Name: "check_color_support handles unsupported terminals"
# Test Type: Support Detection
# Test Scope: Validates that color support is correctly denied for unsupported terminals
# ============================================================================
@test "check_color_support handles unsupported terminals" {
    run bash -c "
        export TERM=dumb
        source '$COLORS_SCRIPT'
        if check_color_support; then
            echo 'supported'
        else
            echo 'not supported'
        fi
    " < /dev/null # Ensure stdin is not a terminal
    [ "$status" -eq 0 ]
    [[ "$output" == "not supported" ]]
}

# ============================================================================
# Test Name: "check_color_support handles missing TERM"
# Test Type: Edge Case
# Test Scope: Validates behavior when TERM environment variable is not set
# ============================================================================
@test "check_color_support handles missing TERM" {
    run bash -c "
        unset TERM
        source '$COLORS_SCRIPT'
        if check_color_support; then
            echo 'supported'
        else
            echo 'not supported'
        fi
    " < /dev/null # Ensure stdin is not a terminal
    [ "$status" -eq 0 ]
    [[ "$output" == "not supported" ]]
}

# ----- Section: Colorize Function Tests -----

# ============================================================================
# Test Name: "colorize function applies colors when supported"
# Test Type: Function Behavior
# Test Scope: Validates that colorize function applies colors in supported terminals
# ============================================================================
@test "colorize function applies colors when supported" {
    run bash -c "
        export TERM=xterm-256color
        source '$COLORS_SCRIPT'
        colorize \"\${RED}\" 'test message'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ $'\033\[0;31m'.*"test message".*$'\033\[0m' ]]
}

# ============================================================================
# Test Name: "colorize function returns plain text when unsupported"
# Test Type: Function Behavior
# Test Scope: Validates that colorize function returns plain text in unsupported terminals
# ============================================================================
@test "colorize function returns plain text when unsupported" {
    run bash -c "
        export TERM=dumb
        source '$COLORS_SCRIPT'
        colorize \"\${RED}\" 'test message'
    " < /dev/null
    [ "$status" -eq 0 ]
    [[ "$output" == "test message" ]]
}

# ============================================================================
# Test Name: "colorize function handles empty text"
# Test Type: Edge Case
# Test Scope: Validates that colorize function handles empty or whitespace-only text
# ============================================================================
@test "colorize function handles empty text" {
    run bash -c "
        export TERM=xterm-256color
        source '$COLORS_SCRIPT'
        colorize \"\${GREEN}\" ''
    "
    [ "$status" -eq 0 ]
    # Should output color codes with empty content
    [[ "$output" =~ $'\033\[0;32m'.*$'\033\[0m' ]]
}

# ----- Section: Integration and Performance Tests -----

# ============================================================================
# Test Name: "color constants work in combination"
# Test Type: Integration
# Test Scope: Validates that multiple color constants can be used together
# ============================================================================
@test "color constants work in combination" {
    run bash -c "
        export TERM=xterm-256color
        source '$COLORS_SCRIPT'
        echo -e \"\${RED}\${BOLD}Error:\${NC} \${GREEN}Success\${NC}\"
    "
    [ "$status" -eq 0 ]
    # Should contain both red bold and green sequences
    [[ "$output" =~ $'\033\[0;31m\033\[1m' ]]
    [[ "$output" =~ $'\033\[0;32m' ]]
}

# ============================================================================
# Test Name: "performance test for color detection"
# Test Type: Performance
# Test Scope: Validates that color support detection performs reasonably
# ============================================================================
@test "performance test for color detection" {
    # Run color detection multiple times to ensure it's not slow
    run bash -c "
        export TERM=xterm-256color
        source '$COLORS_SCRIPT'
        for i in {1..100}; do
            check_color_support > /dev/null
        done
        echo 'completed'
    "
    [ "$status" -eq 0 ]
    [[ "$output" == "completed" ]]
}

# ============================================================================
# Test Name: "readonly constants cannot be modified"
# Test Type: Security
# Test Scope: Validates that color constants are properly protected as readonly
# ============================================================================
@test "readonly constants cannot be modified" {
    run bash -c "
        source '$COLORS_SCRIPT'
        RED='modified' 2>&1 && echo 'modified' || echo 'readonly protected'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "readonly" ]]
}

# End of test-colors.bats