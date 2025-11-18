#!/usr/bin/env bats
# tests/includes/performance/test-resource-management.bats

# ============================================================================
# Test Suite: resource-management.sh
# Description: Tests for performance and resource management functions
# ============================================================================

load "../../includes/enhanced-test-helpers.bash"

setup() {
    setup_enhanced_test_environment
    source "${BATS_TEST_DIRNAME}/../../../scripts/includes/performance/resource-management.sh"
}

teardown() {
    cleanup_enhanced_test_environment
}

# ============================================================================
# Memory Management Tests
# ============================================================================

@test "optimise_memory_usage: should complete without errors" {
    run optimise_memory_usage
    assert_success
}

@test "monitor_memory_consumption: should return memory usage for current process" {
    run monitor_memory_consumption $$
    assert_success
}

@test "monitor_memory_consumption: should warn for high memory usage" {
    # Set very low threshold to trigger warning
    run monitor_memory_consumption $$ 1
    # Should fail (return 1) when memory exceeds threshold
    assert_failure
}

# ============================================================================
# Process Management Tests
# ============================================================================

@test "wait_for_process_completion: should handle empty process list" {
    active_processes=()
    run wait_for_process_completion
    assert_success
}

@test "wait_for_all_processes: should wait for all active processes" {
    # Start some background processes
    sleep 0.1 &
    local pid1=$!
    sleep 0.1 &
    local pid2=$!

    active_processes=("$pid1" "$pid2")

    run wait_for_all_processes
    assert_success

    # Verify process list is cleared
    [[ ${#active_processes[@]} -eq 0 ]]
}

# ============================================================================
# File Operations Tests
# ============================================================================

@test "batch_file_operations: should process files in batches" {
    # Create test files
    for i in {1..5}; do
        echo "test content" > "${TEST_TEMP_DIR}/test_${i}.txt"
    done

    # Define simple operation function
    test_operation() {
        local file="$1"
        echo "Processing: $file"
        return 0
    }
    export -f test_operation

    cd "$TEST_TEMP_DIR" || exit 1

    run batch_file_operations "test_*.txt" "test_operation" 2
    assert_success
}

@test "optimise_large_file_processing: should split and process large files" {
    # Create a test file with multiple lines
    local test_file="${TEST_TEMP_DIR}/large_file.txt"
    for i in {1..100}; do
        echo "Line $i" >> "$test_file"
    done

    run optimise_large_file_processing "$test_file" 25 ""
    assert_success
}

@test "optimise_large_file_processing: should fail for non-existent file" {
    run optimise_large_file_processing "/nonexistent/file.txt"
    assert_failure
}

# ============================================================================
# Cleanup Tests
# ============================================================================

@test "setup_periodic_cleanup: should initialise cleanup process" {
    skip "Skipping periodic cleanup test to avoid background processes in test suite"

    run setup_periodic_cleanup 60
    assert_success
}
