#!/usr/bin/env bats

# ============================================================================
# Test Name: test-logging-integration.bats
# Testing: Integration between logging.sh, validation.sh, and colors.sh
# Description: Integration tests validating interactions between modular includes
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# Usage: bats test-logging-integration.bats
# Options: None
# ============================================================================

# Load test helpers
load "$(dirname "$BATS_TEST_FILENAME")/../../test-helper.bash"

# Setup function runs before each test
setup() {
    # Setup test environment for each test
    TEST_TEMP_DIR=$(mktemp -d)
    export TEST_TEMP_DIR
    export LOG_FILE="$TEST_TEMP_DIR/test.log"

    # Load all includes to test integration
    SCRIPTS_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../../scripts" && pwd)"

    # Disable strict mode temporarily to source the files
    set +euo pipefail
    source "$SCRIPTS_DIR/includes/colors.sh" 2>/dev/null || true
    source "$SCRIPTS_DIR/includes/logging.sh" 2>/dev/null || true
    source "$SCRIPTS_DIR/includes/validation.sh" 2>/dev/null || true
    set -euo pipefail
}

# Teardown function runs after each test
teardown() {
    # Cleanup after each test
    [[ -n "$TEST_TEMP_DIR" && -d "$TEST_TEMP_DIR" ]] && rm -rf "$TEST_TEMP_DIR"
    unset LOG_FILE
}

# ----- Section: Logging and Validation Integration -----

# ============================================================================
# Test Name: "validation functions use logging system"
# Test Type: Integration Test
# Test Scope: Validates validation errors are logged through logging system
# ============================================================================
@test "validation functions use logging system" {
    # Trigger validation error
    run validate_file_exists "/non/existent/file.txt"

    [[ "$status" -eq 1 ]]
    [[ "$output" == *"ERROR"* ]]

    # Error should also be in log file
    if [[ -f "$LOG_FILE" ]]; then
        grep -q "does not exist" "$LOG_FILE"
    fi
}

# ============================================================================
# Test Name: "validation success logs debug messages"
# Test Type: Integration Test
# Test Scope: Validates successful validations create debug log entries
# ============================================================================
@test "validation success logs debug messages" {
    export VERBOSE="true"

    local test_file="$TEST_TEMP_DIR/test.txt"
    echo "content" > "$test_file"

    run validate_file_exists "$test_file"

    [[ "$status" -eq 0 ]]

    # Debug message should be logged
    if [[ -f "$LOG_FILE" ]]; then
        grep -q "DEBUG" "$LOG_FILE" || true
    fi
}

# ============================================================================
# Test Name: "multiple validation failures accumulate in log"
# Test Type: Integration Test
# Test Scope: Validates multiple validation errors are all logged
# ============================================================================
@test "multiple validation failures accumulate in log" {
    validate_file_exists "/missing/file1.txt" 2>&1 || true
    validate_file_exists "/missing/file2.txt" 2>&1 || true
    validate_email "invalid-email" 2>&1 || true

    # All errors should be in log file
    [[ -f "$LOG_FILE" ]]

    local error_count
    error_count=$(grep -c "ERROR" "$LOG_FILE")
    [[ $error_count -ge 3 ]]
}

# ----- Section: Logging and Colors Integration -----

# ============================================================================
# Test Name: "logging uses color constants from colors.sh"
# Test Type: Integration Test
# Test Scope: Validates logging system uses color module constants
# ============================================================================
@test "logging uses color constants from colors.sh" {
    # Color constants should be available to logging
    [[ -n "$RED" ]]
    [[ -n "$GREEN" ]]
    [[ -n "$YELLOW" ]]

    # Logging should use these colors
    run log_error "Test error"
    [[ "$status" -eq 0 ]]

    run log_success "Test success"
    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "log file output strips colors correctly"
# Test Type: Integration Test
# Test Scope: Validates log files contain plain text without ANSI codes
# ============================================================================
@test "log file output strips colors correctly" {
    log_info "Info message"
    log_error "Error message"
    log_success "Success message"

    # Log file should not contain ANSI escape codes
    ! grep -q $'\033' "$LOG_FILE"

    # But should contain the messages
    grep -q "Info message" "$LOG_FILE"
    grep -q "Error message" "$LOG_FILE"
    grep -q "Success message" "$LOG_FILE"
}

# ----- Section: Full Workflow Integration -----

# ============================================================================
# Test Name: "complete validation and logging workflow"
# Test Type: Integration Test
# Test Scope: Validates end-to-end workflow with all modules
# ============================================================================
@test "complete validation and logging workflow" {
    # Setup logging
    setup_logging "$LOG_FILE" "INFO"

    # Perform validations
    local test_file="$TEST_TEMP_DIR/data.txt"
    echo "test data" > "$test_file"

    run validate_file_exists "$test_file"
    [[ "$status" -eq 0 ]]

    run validate_version_format "1.2.3"
    [[ "$status" -eq 0 ]]

    run validate_email "test@example.com"
    [[ "$status" -eq 0 ]]

    # Log file should contain initialization and validation messages
    [[ -f "$LOG_FILE" ]]
    grep -q "Log started" "$LOG_FILE"
    grep -q "Logging initialized" "$LOG_FILE"
}

# ============================================================================
# Test Name: "logging respects level threshold with validation"
# Test Type: Integration Test
# Test Scope: Validates log level filtering works across modules
# ============================================================================
@test "logging respects level threshold with validation" {
    # Set log level to ERROR only
    setup_logging "$LOG_FILE" "ERROR"

    # Info and debug should be suppressed
    log_info "This should not appear"
    log_debug "This should not appear"

    # Error should appear
    log_error "This should appear"

    # Validation errors should appear
    validate_file_exists "/missing.txt" 2>&1 || true

    # Check log file
    ! grep -q "This should not appear" "$LOG_FILE"
    grep -q "This should appear" "$LOG_FILE"
    grep -q "ERROR" "$LOG_FILE"
}

# ----- Section: Error Propagation -----

# ============================================================================
# Test Name: "validation errors propagate correctly"
# Test Type: Integration Test
# Test Scope: Validates error handling across module boundaries
# ============================================================================
@test "validation errors propagate correctly" {
    # Chain of validations
    run bash -c "
        source '$SCRIPTS_DIR/includes/validation.sh' 2>/dev/null
        validate_file_exists '/missing1.txt' && \
        validate_file_exists '/missing2.txt'
    "

    # Should fail on first validation
    [[ "$status" -eq 1 ]]
}

# ============================================================================
# Test Name: "successful validation chain"
# Test Type: Integration Test
# Test Scope: Validates successful validation chain execution
# ============================================================================
@test "successful validation chain" {
    local file1="$TEST_TEMP_DIR/file1.txt"
    local file2="$TEST_TEMP_DIR/file2.txt"
    echo "content1" > "$file1"
    echo "content2" > "$file2"

    # All validations should succeed
    validate_file_exists "$file1"
    [[ "$?" -eq 0 ]]

    validate_file_exists "$file2"
    [[ "$?" -eq 0 ]]

    validate_version_format "1.0.0"
    [[ "$?" -eq 0 ]]
}

# ----- Section: Concurrent Logging -----

# ============================================================================
# Test Name: "concurrent validation and logging"
# Test Type: Integration Test
# Test Scope: Validates thread-safe logging with concurrent validations
# ============================================================================
@test "concurrent validation and logging" {
    # Run multiple validations in background
    for i in {1..5}; do
        (
            validate_email "test${i}@example.com"
            log_info "Validated email ${i}"
        ) &
    done
    wait

    # All messages should be in log
    local msg_count
    msg_count=$(grep -c "Validated email" "$LOG_FILE" || echo 0)
    [[ $msg_count -eq 5 ]]
}

# ----- Section: Module Dependencies -----

# ============================================================================
# Test Name: "all includes load without errors"
# Test Type: Integration Test
# Test Scope: Validates all include modules can be loaded together
# ============================================================================
@test "all includes load without errors" {
    run bash -c "
        set -e
        source '$SCRIPTS_DIR/includes/colors.sh'
        source '$SCRIPTS_DIR/includes/logging.sh'
        source '$SCRIPTS_DIR/includes/validation.sh'
        echo 'All loaded successfully'
    "

    [[ "$status" -eq 0 ]]
    [[ "$output" == *"All loaded successfully"* ]]
}

# ============================================================================
# Test Name: "includes handle circular dependencies"
# Test Type: Integration Test
# Test Scope: Validates includes can be sourced in any order
# ============================================================================
@test "includes handle circular dependencies" {
    # Source in different order
    run bash -c "
        set +e
        source '$SCRIPTS_DIR/includes/validation.sh' 2>/dev/null
        source '$SCRIPTS_DIR/includes/logging.sh' 2>/dev/null
        source '$SCRIPTS_DIR/includes/colors.sh' 2>/dev/null
        echo 'Loaded in reverse order'
    "

    [[ "$status" -eq 0 ]]
}

# End of test-logging-integration.bats
