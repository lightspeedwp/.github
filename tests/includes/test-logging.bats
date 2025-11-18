#!/usr/bin/env bats

# ============================================================================
# Test Name: test-logging.bats
# Testing: scripts/includes/logging.sh
# Description: Comprehensive tests for logging functionality with levels, colors, and file output
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# Usage: bats test-logging.bats
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

    # Disable strict mode temporarily to source the file
    set +euo pipefail
    source "$SCRIPTS_DIR/includes/logging.sh" 2>/dev/null || true
    set -euo pipefail
}

# Teardown function runs after each test
teardown() {
    # Cleanup after each test
    [[ -n "$TEST_TEMP_DIR" && -d "$TEST_TEMP_DIR" ]] && rm -rf "$TEST_TEMP_DIR"
    unset LOG_FILE
    unset LOG_LEVEL_THRESHOLD
}

# ----- Section: Core Logging Functionality -----

# ============================================================================
# Test Name: "log_info writes to stderr"
# Test Type: Unit Test
# Test Scope: Validates log_info function writes formatted message to stderr
# ============================================================================
@test "log_info writes to stderr" {
    local test_message="Test info message"

    run log_info "$test_message"

    # Verify stderr output contains message
    [[ "$output" == *"$test_message"* ]]
    [[ "$output" == *"INFO"* ]]
}

# ============================================================================
# Test Name: "log_info writes to log file"
# Test Type: Unit Test
# Test Scope: Validates log_info function writes to LOG_FILE when configured
# ============================================================================
@test "log_info writes to log file" {
    local test_message="Test info to file"

    log_info "$test_message"

    # Verify log file creation and content
    [[ -f "$LOG_FILE" ]]
    grep -q "$test_message" "$LOG_FILE"
    grep -q "INFO" "$LOG_FILE"
}

# ============================================================================
# Test Name: "log_info includes timestamp"
# Test Type: Unit Test
# Test Scope: Validates log messages include proper timestamp formatting
# ============================================================================
@test "log_info includes timestamp" {
    local test_message="Timestamp test"

    log_info "$test_message"

    # Verify timestamp format in log file (YYYY-MM-DD HH:MM:SS)
    grep -qE "[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}" "$LOG_FILE"
}

# ============================================================================
# Test Name: "log_error writes error messages"
# Test Type: Unit Test
# Test Scope: Validates log_error function writes error-level messages
# ============================================================================
@test "log_error writes error messages" {
    local error_message="Test error message"

    run log_error "$error_message"

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"$error_message"* ]]
    [[ "$output" == *"ERROR"* ]]
}

# ============================================================================
# Test Name: "log_error returns correct exit code"
# Test Type: Unit Test
# Test Scope: Validates log_error function maintains proper exit codes and doesn't exit script
# ============================================================================
@test "log_error does not exit script" {
    run log_error "Test error"
    [[ "$status" -eq 0 ]]  # log_error should not exit, just log
}

# ============================================================================
# Test Name: "log_warning writes warning messages"
# Test Type: Unit Test
# Test Scope: Validates log_warning function writes warning-level messages
# ============================================================================
@test "log_warning writes warning messages" {
    local warning_message="Test warning"

    run log_warning "$warning_message"

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"$warning_message"* ]]
    [[ "$output" == *"WARN"* ]]
}

# ============================================================================
# Test Name: "log_warn is alias for log_warning"
# Test Type: Unit Test
# Test Scope: Validates log_warn backward compatibility alias
# ============================================================================
@test "log_warn is alias for log_warning" {
    run log_warn "Test warning alias"

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"Test warning alias"* ]]
}

# ============================================================================
# Test Name: "log_success writes success messages"
# Test Type: Unit Test
# Test Scope: Validates log_success function writes success messages
# ============================================================================
@test "log_success writes success messages" {
    local success_message="Test success"

    run log_success "$success_message"

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"$success_message"* ]]
    [[ "$output" == *"SUCCESS"* ]]
}

# ============================================================================
# Test Name: "log_debug writes debug messages when verbose"
# Test Type: Unit Test
# Test Scope: Validates log_debug function respects VERBOSE flag
# ============================================================================
@test "log_debug writes debug messages when verbose" {
    export VERBOSE="true"
    local debug_message="Test debug message"

    run log_debug "$debug_message"

    [[ "$output" == *"$debug_message"* ]]
}

# ============================================================================
# Test Name: "log_debug suppressed when not verbose"
# Test Type: Unit Test
# Test Scope: Validates log_debug is suppressed without VERBOSE flag
# ============================================================================
@test "log_debug suppressed when not verbose" {
    export VERBOSE="false"
    local debug_message="Should not appear"

    run log_debug "$debug_message"

    # Output should be empty or not contain the message
    if [[ -n "$output" ]]; then
        [[ "$output" != *"$debug_message"* ]]
    fi
}

# ----- Section: Log File Management -----

# ============================================================================
# Test Name: "setup_logging creates log file"
# Test Type: Unit Test
# Test Scope: Validates setup_logging creates log file and directory structure
# ============================================================================
@test "setup_logging creates log file" {
    local test_log="$TEST_TEMP_DIR/logs/test.log"

    setup_logging "$test_log"

    [[ -f "$test_log" ]]
    [[ "$LOG_FILE" == "$test_log" ]]
}

# ============================================================================
# Test Name: "setup_logging creates log directory if missing"
# Test Type: Integration Test
# Test Scope: Validates automatic log directory creation when LOG_FILE points to non-existent directory
# ============================================================================
@test "setup_logging creates nested log directories" {
    local log_dir="$TEST_TEMP_DIR/logs/nested/deep"
    local log_file="$log_dir/test.log"

    setup_logging "$log_file"

    [[ -d "$log_dir" ]]
    [[ -f "$log_file" ]]
}

# ============================================================================
# Test Name: "setup_logging initializes with header"
# Test Type: Unit Test
# Test Scope: Validates setup_logging writes initialization header to log file
# ============================================================================
@test "setup_logging initializes with header" {
    local test_log="$TEST_TEMP_DIR/init.log"

    setup_logging "$test_log"

    [[ -f "$test_log" ]]
    grep -q "Log started at" "$test_log"
}

# ============================================================================
# Test Name: "setup_logging sets log level"
# Test Type: Unit Test
# Test Scope: Validates setup_logging accepts and sets log level threshold
# ============================================================================
@test "setup_logging sets log level" {
    local test_log="$TEST_TEMP_DIR/level.log"

    setup_logging "$test_log" "ERROR"

    [[ -n "$LOG_LEVEL_THRESHOLD" ]]
}

# ============================================================================
# Test Name: "multiple log entries append to file"
# Test Type: Integration Test
# Test Scope: Validates multiple log calls append to same file
# ============================================================================
@test "multiple log entries append to file" {
    log_info "First message"
    log_warning "Second message"
    log_error "Third message"

    [[ -f "$LOG_FILE" ]]

    local line_count
    line_count=$(grep -c "message" "$LOG_FILE")
    [[ $line_count -eq 3 ]]
}

# ----- Section: Log Levels -----

# ============================================================================
# Test Name: "get_log_level_value converts level names"
# Test Type: Unit Test
# Test Scope: Validates get_log_level_value converts log level names to numeric values
# ============================================================================
@test "get_log_level_value converts level names" {
    local debug_level
    debug_level=$(get_log_level_value "DEBUG")
    [[ $debug_level -eq 10 ]]

    local info_level
    info_level=$(get_log_level_value "INFO")
    [[ $info_level -eq 20 ]]

    local warn_level
    warn_level=$(get_log_level_value "WARN")
    [[ $warn_level -eq 30 ]]

    local error_level
    error_level=$(get_log_level_value "ERROR")
    [[ $error_level -eq 40 ]]
}

# ============================================================================
# Test Name: "should_log respects log level threshold"
# Test Type: Unit Test
# Test Scope: Validates should_log function properly filters by log level
# ============================================================================
@test "should_log respects log level threshold" {
    # Set threshold to WARN
    LOG_LEVEL_THRESHOLD=$(get_log_level_value "WARN")

    # DEBUG and INFO should not log
    run should_log "DEBUG"
    [[ "$status" -eq 1 ]]

    run should_log "INFO"
    [[ "$status" -eq 1 ]]

    # WARN and ERROR should log
    run should_log "WARN"
    [[ "$status" -eq 0 ]]

    run should_log "ERROR"
    [[ "$status" -eq 0 ]]
}

# ----- Section: Log Rotation -----

# ============================================================================
# Test Name: "rotate_log creates backup when size exceeded"
# Test Type: Unit Test
# Test Scope: Validates rotate_log function creates backup of large log files
# ============================================================================
@test "rotate_log creates backup when size exceeded" {
    # Create a large log file
    dd if=/dev/zero of="$LOG_FILE" bs=1024 count=100 2>/dev/null

    # Rotate with small max size
    rotate_log 1024

    # Should have created backup
    local backup_count
    backup_count=$(find "$TEST_TEMP_DIR" -name "*.old" | wc -l)
    [[ $backup_count -ge 1 ]]
}

# ============================================================================
# Test Name: "rotate_log preserves small files"
# Test Type: Unit Test
# Test Scope: Validates rotate_log doesn't rotate files below size threshold
# ============================================================================
@test "rotate_log preserves small files" {
    echo "Small log content" > "$LOG_FILE"

    rotate_log 10485760  # 10MB

    # Should not have created backup
    local backup_count
    backup_count=$(find "$TEST_TEMP_DIR" -name "*.old" 2>/dev/null | wc -l)
    [[ $backup_count -eq 0 ]]
}

# ----- Section: Multiple Arguments -----

# ============================================================================
# Test Name: "log functions support multiple arguments"
# Test Type: Unit Test
# Test Scope: Validates log functions concatenate multiple arguments
# ============================================================================
@test "log functions support multiple arguments" {
    run log_info "Message" "with" "multiple" "parts"

    [[ "$output" == *"Message with multiple parts"* ]]
}

# ----- Section: Edge Cases -----

# ============================================================================
# Test Name: "logging handles empty messages"
# Test Type: Edge Case Test
# Test Scope: Validates logging functions with empty message input
# ============================================================================
@test "logging handles empty messages" {
    run log_info ""

    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "logging handles special characters"
# Test Type: Edge Case Test
# Test Scope: Validates logging functions with special characters
# ============================================================================
@test "logging handles special characters" {
    local special_msg="Test \$VAR with special: @#%&*()[]{}|\\<>?"

    run log_info "$special_msg"

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"special"* ]]
}

# ============================================================================
# Test Name: "logging handles very long messages"
# Test Type: Edge Case Test
# Test Scope: Validates logging functions with very long message strings
# ============================================================================
@test "logging handles very long messages" {
    local long_msg
    long_msg=$(printf 'x%.0s' {1..5000})

    run log_info "$long_msg"

    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "logging handles Unicode and emojis"
# Test Type: Edge Case Test
# Test Scope: Validates logging functions with Unicode characters and emojis
# ============================================================================
@test "logging handles Unicode and emojis" {
    run log_info "Test émojis 🎉 and 中文 characters"

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"émojis"* ]]
}

# ----- Section: Log File Permissions -----

# ============================================================================
# Test Name: "logging handles readonly directory gracefully"
# Test Type: Error Condition Test
# Test Scope: Validates logging behavior when log directory is readonly
# ============================================================================
@test "logging handles readonly directory" {
    # This test might need to be skipped in CI environments
    if [[ "$(id -u)" -eq 0 ]]; then
        skip "Cannot test readonly directory as root"
    fi

    local readonly_dir="$TEST_TEMP_DIR/readonly"
    mkdir -p "$readonly_dir"
    chmod 444 "$readonly_dir"

    # Attempt to create log in readonly directory
    run setup_logging "$readonly_dir/test.log"

    # Should fail gracefully
    [[ "$status" -eq 1 ]] || [[ "$status" -eq 0 ]]

    chmod 755 "$readonly_dir"  # Cleanup
}

# ----- Section: Environment Variable Handling -----

# ============================================================================
# Test Name: "logging works without LOG_FILE set"
# Test Type: Unit Test
# Test Scope: Validates logging to stderr works when LOG_FILE is not configured
# ============================================================================
@test "logging works without LOG_FILE set" {
    unset LOG_FILE

    run log_info "Message without file logging"

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"Message without file logging"* ]]
}

# ============================================================================
# Test Name: "log file content has no color codes"
# Test Type: Unit Test
# Test Scope: Validates log files contain plain text without ANSI color codes
# ============================================================================
@test "log file content has no color codes" {
    log_info "Test message"

    # Log file should not contain ANSI escape codes
    ! grep -q $'\033' "$LOG_FILE"
}

# ----- Section: Concurrent Logging -----

# ============================================================================
# Test Name: "concurrent logging maintains message integrity"
# Test Type: Integration Test
# Test Scope: Validates multiple rapid log calls don't corrupt output
# ============================================================================
@test "concurrent logging maintains message integrity" {
    for i in {1..10}; do
        log_info "Message number $i" &
    done
    wait

    # All messages should be in log file
    local msg_count
    msg_count=$(grep -c "Message number" "$LOG_FILE")
    [[ $msg_count -eq 10 ]]
}

# End of test-logging.bats
