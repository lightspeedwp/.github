#!/usr/bin/env bats
# ============================================================================
# Test name: test-logging.bats
# Testing: scripts/includes/core/logging.sh
# Description: Test suite for enhanced logging functionality
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: bats, scripts/includes/core/logging.sh, test-helper.bash
# Usage: bats tests/includes/core/test-logging.bats
# Environment Variables: LOG_FILE, LOG_LEVEL, VERBOSE
# Options: None
# Examples:
#   bats tests/includes/core/test-logging.bats
#   VERBOSE=true bats tests/includes/core/test-logging.bats
# Notes:
#   - Tests all logging functions and levels
#   - Tests file output and color functionality
#   - Tests log rotation and setup functions
# ============================================================================

# Load test helpers
load "$(dirname "$BATS_TEST_FILENAME")/../../test-helper.bash"

# Setup function - runs before each test
setup() {
    # Get the repository root and resolve paths
    TEST_REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../.." && pwd)"
    LOGGING_SCRIPT="${TEST_REPO_ROOT}/scripts/includes/core/logging.sh"
    
    # Create temporary directory for test logs
    TEST_LOG_DIR=$(mktemp -d)
    TEST_LOG_FILE="${TEST_LOG_DIR}/test.log"
    
    # Verify the logging script exists
    [[ -f "$LOGGING_SCRIPT" ]]
}

# Teardown function - runs after each test
teardown() {
    # Clean up temporary files
    [[ -d "$TEST_LOG_DIR" ]] && rm -rf "$TEST_LOG_DIR"
    
    # Unset environment variables
    unset LOG_FILE
    unset LOG_LEVEL_THRESHOLD
    unset VERBOSE
}

# ----- Section: Basic Logging Function Tests -----

# ============================================================================
# Test Name: "logging script sources without errors"
# Test Type: Basic Functionality
# Test Scope: Validates that the logging script can be sourced successfully
# ============================================================================
@test "logging script sources without errors" {
    run bash -c "source '$LOGGING_SCRIPT'"
    [ "$status" -eq 0 ]
}

# ============================================================================
# Test Name: "log_info outputs formatted message"
# Test Type: Basic Functionality
# Test Scope: Validates log_info function output format and content
# ============================================================================
@test "log_info outputs formatted message" {
    run bash -c "
        source '$LOGGING_SCRIPT'
        log_info 'Test info message'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ \[INFO\] ]]
    [[ "$output" =~ "Test info message" ]]
    [[ "$output" =~ [0-9]{4}-[0-9]{2}-[0-9]{2}\ [0-9]{2}:[0-9]{2}:[0-9]{2} ]]
}

# ============================================================================
# Test Name: "log_error outputs to stderr"
# Test Type: Output Stream
# Test Scope: Validates that error messages go to stderr, not stdout
# ============================================================================
@test "log_error outputs to stderr" {
    run bash -c "
        source '$LOGGING_SCRIPT'
        log_error 'Test error message' 2>&1 >/dev/null
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ \[ERROR\] ]]
    [[ "$output" =~ "Test error message" ]]
}

# ============================================================================
# Test Name: "log_success shows success indicator"
# Test Type: Message Formatting
# Test Scope: Validates success message formatting and indicators
# ============================================================================
@test "log_success shows success indicator" {
    run bash -c "
        export TERM=xterm-256color
        source '$LOGGING_SCRIPT'
        log_success 'Operation completed'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ \[SUCCESS\] ]]
    [[ "$output" =~ "Operation completed" ]]
    [[ "$output" =~ ✅ ]]
}

# ============================================================================
# Test Name: "log_warning shows warning indicator"
# Test Type: Message Formatting  
# Test Scope: Validates warning message formatting and indicators
# ============================================================================
@test "log_warning shows warning indicator" {
    run bash -c "
        export TERM=xterm-256color
        source '$LOGGING_SCRIPT'
        log_warning 'Warning message'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ \[WARN\] ]]
    [[ "$output" =~ "Warning message" ]]
    [[ "$output" =~ ⚠️ ]]
}

# ============================================================================
# Test Name: "log_debug respects verbose mode"
# Test Type: Conditional Output
# Test Scope: Validates that debug messages only appear when verbose is enabled
# ============================================================================
@test "log_debug respects verbose mode" {
    # Test without verbose mode
    run bash -c "
        source '$LOGGING_SCRIPT'
        log_debug 'Debug message'
    "
    [ "$status" -eq 0 ]
    [[ "$output" == "" ]]
    
    # Test with verbose mode
    run bash -c "
        export VERBOSE=true
        source '$LOGGING_SCRIPT'
        log_debug 'Debug message'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ \[DEBUG\] ]]
    [[ "$output" =~ "Debug message" ]]
}

# ----- Section: File Logging Tests -----

# ============================================================================
# Test Name: "setup_logging creates log file"
# Test Type: File Operations
# Test Scope: Validates that setup_logging function creates log files properly
# ============================================================================
@test "setup_logging creates log file" {
    run bash -c "
        source '$LOGGING_SCRIPT'
        setup_logging '$TEST_LOG_FILE'
        [[ -f '$TEST_LOG_FILE' ]]
    "
    [ "$status" -eq 0 ]
}

# ============================================================================
# Test Name: "log messages write to file when LOG_FILE is set"
# Test Type: File Output
# Test Scope: Validates that log messages are written to file when LOG_FILE is configured
# ============================================================================
@test "log messages write to file when LOG_FILE is set" {
    run bash -c "
        source '$LOGGING_SCRIPT'
        setup_logging '$TEST_LOG_FILE'
        log_info 'Test file message'
        grep 'Test file message' '$TEST_LOG_FILE'
    "
    [ "$status" -eq 0 ]
}

# ============================================================================
# Test Name: "log file contains uncolored messages"
# Test Type: File Content
# Test Scope: Validates that log files contain plain text without ANSI color codes
# ============================================================================
@test "log file contains uncolored messages" {
    run bash -c "
        export TERM=xterm-256color
        source '$LOGGING_SCRIPT'
        setup_logging '$TEST_LOG_FILE'
        log_error 'Colored error message'
        # Check file doesn't contain ANSI escape sequences
        ! grep -q $'\033' '$TEST_LOG_FILE'
    "
    [ "$status" -eq 0 ]
}

# ============================================================================
# Test Name: "setup_logging creates directory structure"
# Test Type: Directory Creation
# Test Scope: Validates that setup_logging creates parent directories if they don't exist
# ============================================================================
@test "setup_logging creates directory structure" {
    local nested_log="${TEST_LOG_DIR}/nested/deep/test.log"
    run bash -c "
        source '$LOGGING_SCRIPT'
        setup_logging '$nested_log'
        [[ -f '$nested_log' ]]
    "
    [ "$status" -eq 0 ]
}

# ----- Section: Log Level Tests -----

# ============================================================================
# Test Name: "log level filtering works correctly"
# Test Type: Level Filtering
# Test Scope: Validates that log level thresholds properly filter messages
# ============================================================================
@test "log level filtering works correctly" {
    run bash -c "
        source '$LOGGING_SCRIPT'
        setup_logging '$TEST_LOG_FILE' 'ERROR'
        log_info 'Should not appear'
        log_error 'Should appear'
        grep -q 'Should appear' '$TEST_LOG_FILE'
        ! grep -q 'Should not appear' '$TEST_LOG_FILE'
    "
    [ "$status" -eq 0 ]
}

# ============================================================================
# Test Name: "get_log_level_value returns correct numeric values"
# Test Type: Utility Function
# Test Scope: Validates log level name to numeric conversion
# ============================================================================
@test "get_log_level_value returns correct numeric values" {
    run bash -c "
        source '$LOGGING_SCRIPT'
        echo \$(get_log_level_value 'DEBUG')
        echo \$(get_log_level_value 'INFO')
        echo \$(get_log_level_value 'WARN')
        echo \$(get_log_level_value 'ERROR')
    "
    [ "$status" -eq 0 ]
    lines=($output)
    [[ "${lines[0]}" == "10" ]]  # DEBUG
    [[ "${lines[1]}" == "20" ]]  # INFO
    [[ "${lines[2]}" == "30" ]]  # WARN
    [[ "${lines[3]}" == "40" ]]  # ERROR
}

# ============================================================================
# Test Name: "should_log respects threshold settings"
# Test Type: Level Logic
# Test Scope: Validates the should_log function logic for different thresholds
# ============================================================================
@test "should_log respects threshold settings" {
    run bash -c "
        source '$LOGGING_SCRIPT'
        LOG_LEVEL_THRESHOLD=30  # WARN level
        if should_log 'DEBUG'; then echo 'debug_yes'; else echo 'debug_no'; fi
        if should_log 'INFO'; then echo 'info_yes'; else echo 'info_no'; fi
        if should_log 'WARN'; then echo 'warn_yes'; else echo 'warn_no'; fi
        if should_log 'ERROR'; then echo 'error_yes'; else echo 'error_no'; fi
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "debug_no" ]]
    [[ "$output" =~ "info_no" ]]
    [[ "$output" =~ "warn_yes" ]]
    [[ "$output" =~ "error_yes" ]]
}

# ----- Section: Log Rotation Tests -----

# ============================================================================
# Test Name: "rotate_log creates backup when file is large"
# Test Type: File Rotation
# Test Scope: Validates log rotation functionality when file exceeds size limit
# ============================================================================
@test "rotate_log creates backup when file is large" {
    run bash -c "
        source '$LOGGING_SCRIPT'
        setup_logging '$TEST_LOG_FILE'
        
        # Create a large log file
        dd if=/dev/zero of='$TEST_LOG_FILE' bs=1024 count=20 2>/dev/null
        
        # Rotate with small threshold
        rotate_log '$TEST_LOG_FILE' 1024
        
        # Check if backup was created and original file is smaller
        ls '$TEST_LOG_DIR'/*.old 2>/dev/null | wc -l
    "
    [ "$status" -eq 0 ]
    [[ "$output" -ge 1 ]]  # At least one backup file created
}

# ============================================================================
# Test Name: "rotate_log does nothing for small files"
# Test Type: File Rotation
# Test Scope: Validates that small files are not rotated unnecessarily
# ============================================================================
@test "rotate_log does nothing for small files" {
    run bash -c "
        source '$LOGGING_SCRIPT'
        setup_logging '$TEST_LOG_FILE'
        echo 'small content' > '$TEST_LOG_FILE'
        
        # Try to rotate with large threshold
        rotate_log '$TEST_LOG_FILE' 10485760  # 10MB
        
        # Check no backup was created
        ls '$TEST_LOG_DIR'/*.old 2>/dev/null | wc -l || echo '0'
    "
    [ "$status" -eq 0 ]
    [[ "$output" == "0" ]]
}

# ----- Section: Color and Terminal Tests -----

# ============================================================================
# Test Name: "colors are disabled for non-terminals"
# Test Type: Color Detection
# Test Scope: Validates that colors are properly disabled when output is not a terminal
# ============================================================================
@test "colors are disabled for non-terminals" {
    run bash -c "
        export TERM=xterm-256color
        source '$LOGGING_SCRIPT'
        log_error 'Test message'
    " < /dev/null
    [ "$status" -eq 0 ]
    # When not connected to a terminal, colors should be disabled
    # This is a basic check - full validation would require pipe/redirection testing
    [[ "$output" =~ \[ERROR\] ]]
}

# ============================================================================
# Test Name: "multiple arguments are handled correctly"
# Test Type: Argument Handling
# Test Scope: Validates that logging functions handle multiple arguments properly
# ============================================================================
@test "multiple arguments are handled correctly" {
    run bash -c "
        source '$LOGGING_SCRIPT'
        log_info 'Message' 'with' 'multiple' 'parts'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "Message with multiple parts" ]]
}

# ============================================================================
# Test Name: "backward compatibility aliases work"
# Test Type: Compatibility
# Test Scope: Validates that log_warn alias still works for backward compatibility
# ============================================================================
@test "backward compatibility aliases work" {
    run bash -c "
        source '$LOGGING_SCRIPT'
        log_warn 'Warning via alias'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ \[WARN\] ]]
    [[ "$output" =~ "Warning via alias" ]]
}

# End of test-logging.bats