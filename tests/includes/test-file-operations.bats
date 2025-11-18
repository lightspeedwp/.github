#!/usr/bin/env bats

# ============================================================================
# Test Name: test-file-operations.bats
# Testing: scripts/includes/filesystem/file-operations.sh
# Description: Comprehensive tests for safe file and directory operations
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# Usage: bats test-file-operations.bats
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

    # Load the includes being tested
    SCRIPTS_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../scripts" && pwd)"

    # Disable strict mode temporarily to source the files
    set +euo pipefail
    source "$SCRIPTS_DIR/includes/filesystem/file-operations.sh" 2>/dev/null || true
    set -euo pipefail
}

# Teardown function runs after each test
teardown() {
    # Cleanup after each test
    [[ -n "$TEST_TEMP_DIR" && -d "$TEST_TEMP_DIR" ]] && rm -rf "$TEST_TEMP_DIR"
    unset LOG_FILE
}

# ----- Section: Timestamp Function -----

# ============================================================================
# Test Name: "timestamp generates valid format"
# Test Type: Unit Test
# Test Scope: Validates timestamp function generates correct format
# ============================================================================
@test "timestamp generates valid format" {
    run timestamp

    [[ "$status" -eq 0 ]]
    [[ "$output" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{6}$ ]]
}

# ============================================================================
# Test Name: "timestamp generates unique values"
# Test Type: Unit Test
# Test Scope: Validates timestamp function creates unique timestamps
# ============================================================================
@test "timestamp generates unique values" {
    local ts1 ts2
    ts1=$(timestamp)
    sleep 1
    ts2=$(timestamp)

    [[ "$ts1" != "$ts2" ]]
}

# ----- Section: Backup Creation -----

# ============================================================================
# Test Name: "create_backup creates backup file"
# Test Type: Unit Test
# Test Scope: Validates create_backup creates timestamped backup copy
# ============================================================================
@test "create_backup creates backup file" {
    local test_file="$TEST_TEMP_DIR/test.txt"
    echo "original content" > "$test_file"

    run create_backup "$test_file"

    [[ "$status" -eq 0 ]]
    [[ -n "$output" ]]
    # Backup file should exist
    [[ -f "$output" ]]
}

# ============================================================================
# Test Name: "create_backup preserves file content"
# Test Type: Unit Test
# Test Scope: Validates create_backup creates exact copy of original file
# ============================================================================
@test "create_backup preserves file content" {
    local test_file="$TEST_TEMP_DIR/test.txt"
    local content="important data to preserve"
    echo "$content" > "$test_file"

    local backup_file
    backup_file=$(create_backup "$test_file")

    [[ -f "$backup_file" ]]
    local backup_content
    backup_content=$(cat "$backup_file")
    [[ "$backup_content" == "$content" ]]
}

# ============================================================================
# Test Name: "create_backup uses custom backup directory"
# Test Type: Unit Test
# Test Scope: Validates create_backup accepts custom backup location
# ============================================================================
@test "create_backup uses custom backup directory" {
    local test_file="$TEST_TEMP_DIR/source/test.txt"
    mkdir -p "$(dirname "$test_file")"
    echo "content" > "$test_file"

    local backup_dir="$TEST_TEMP_DIR/backups"
    local backup_file
    backup_file=$(create_backup "$test_file" "$backup_dir")

    [[ "$status" -eq 0 ]]
    [[ -f "$backup_file" ]]
    [[ "$backup_file" == "$backup_dir"* ]]
}

# ============================================================================
# Test Name: "create_backup creates backup directory if needed"
# Test Type: Integration Test
# Test Scope: Validates create_backup creates backup directory automatically
# ============================================================================
@test "create_backup creates backup directory if needed" {
    local test_file="$TEST_TEMP_DIR/test.txt"
    echo "content" > "$test_file"

    local backup_dir="$TEST_TEMP_DIR/new/backup/dir"
    run create_backup "$test_file" "$backup_dir"

    [[ "$status" -eq 0 ]]
    [[ -d "$backup_dir" ]]
}

# ============================================================================
# Test Name: "create_backup fails for missing source file"
# Test Type: Error Condition Test
# Test Scope: Validates create_backup detects missing source files
# ============================================================================
@test "create_backup fails for missing source file" {
    run create_backup "/non/existent/file.txt"

    [[ "$status" -eq 1 ]]
}

# ============================================================================
# Test Name: "create_backup includes timestamp in filename"
# Test Type: Unit Test
# Test Scope: Validates create_backup adds timestamp to backup filename
# ============================================================================
@test "create_backup includes timestamp in filename" {
    local test_file="$TEST_TEMP_DIR/test.txt"
    echo "content" > "$test_file"

    local backup_file
    backup_file=$(create_backup "$test_file")

    # Backup filename should contain .backup. and timestamp
    [[ "$backup_file" == *".backup."* ]]
    [[ "$backup_file" =~ [0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{6} ]]
}

# ----- Section: Safe File Writing -----

# ============================================================================
# Test Name: "safe_write_file creates new file"
# Test Type: Unit Test
# Test Scope: Validates safe_write_file creates new files with content
# ============================================================================
@test "safe_write_file creates new file" {
    local target_file="$TEST_TEMP_DIR/newfile.txt"
    local content="test content"

    run safe_write_file "$target_file" "$content"

    [[ "$status" -eq 0 ]]
    [[ -f "$target_file" ]]
    [[ "$(cat "$target_file")" == "$content" ]]
}

# ============================================================================
# Test Name: "safe_write_file creates backup before overwriting"
# Test Type: Integration Test
# Test Scope: Validates safe_write_file backs up existing files
# ============================================================================
@test "safe_write_file creates backup before overwriting" {
    local target_file="$TEST_TEMP_DIR/existing.txt"
    echo "original" > "$target_file"

    run safe_write_file "$target_file" "new content"

    [[ "$status" -eq 0 ]]

    # Should have created a backup
    local backup_count
    backup_count=$(find "$TEST_TEMP_DIR" -name "existing.txt.backup.*" | wc -l)
    [[ $backup_count -ge 1 ]]
}

# ============================================================================
# Test Name: "safe_write_file creates target directory"
# Test Type: Unit Test
# Test Scope: Validates safe_write_file creates parent directories
# ============================================================================
@test "safe_write_file creates target directory" {
    local target_file="$TEST_TEMP_DIR/nested/deep/file.txt"

    run safe_write_file "$target_file" "content"

    [[ "$status" -eq 0 ]]
    [[ -f "$target_file" ]]
    [[ -d "$(dirname "$target_file")" ]]
}

# ============================================================================
# Test Name: "safe_write_file reads from stdin"
# Test Type: Unit Test
# Test Scope: Validates safe_write_file accepts input from stdin
# ============================================================================
@test "safe_write_file reads from stdin" {
    local target_file="$TEST_TEMP_DIR/stdin.txt"
    local content="content from stdin"

    run bash -c "echo '$content' | safe_write_file '$target_file'"

    [[ "$status" -eq 0 ]]
    [[ -f "$target_file" ]]
}

# ============================================================================
# Test Name: "safe_write_file handles empty content"
# Test Type: Edge Case Test
# Test Scope: Validates safe_write_file with empty string content
# ============================================================================
@test "safe_write_file handles empty content" {
    local target_file="$TEST_TEMP_DIR/empty.txt"

    run safe_write_file "$target_file" ""

    [[ "$status" -eq 0 ]]
    [[ -f "$target_file" ]]
}

# ============================================================================
# Test Name: "safe_write_file handles special characters"
# Test Type: Edge Case Test
# Test Scope: Validates safe_write_file with special characters in content
# ============================================================================
@test "safe_write_file handles special characters" {
    local target_file="$TEST_TEMP_DIR/special.txt"
    local content="Special chars: \$VAR @#%&*()[]{}|\\<>?"

    run safe_write_file "$target_file" "$content"

    [[ "$status" -eq 0 ]]
    [[ -f "$target_file" ]]
}

# ============================================================================
# Test Name: "safe_write_file handles multi-line content"
# Test Type: Unit Test
# Test Scope: Validates safe_write_file preserves line breaks
# ============================================================================
@test "safe_write_file handles multi-line content" {
    local target_file="$TEST_TEMP_DIR/multiline.txt"
    local content="Line 1
Line 2
Line 3"

    run safe_write_file "$target_file" "$content"

    [[ "$status" -eq 0 ]]
    [[ -f "$target_file" ]]

    local line_count
    line_count=$(wc -l < "$target_file")
    [[ $line_count -ge 2 ]]
}

# ============================================================================
# Test Name: "safe_write_file atomic operation"
# Test Type: Unit Test
# Test Scope: Validates safe_write_file uses atomic move operation
# ============================================================================
@test "safe_write_file atomic operation" {
    local target_file="$TEST_TEMP_DIR/atomic.txt"

    # File should not exist during write (atomic)
    run safe_write_file "$target_file" "atomic content"

    [[ "$status" -eq 0 ]]
    # No .tmp files should remain
    local tmp_count
    tmp_count=$(find "$TEST_TEMP_DIR" -name "*.tmp.*" | wc -l)
    [[ $tmp_count -eq 0 ]]
}

# ----- Section: Error Conditions -----

# ============================================================================
# Test Name: "create_backup handles readonly backup directory"
# Test Type: Error Condition Test
# Test Scope: Validates create_backup behavior with permission issues
# ============================================================================
@test "create_backup handles readonly backup directory" {
    if [[ "$(id -u)" -eq 0 ]]; then
        skip "Cannot test readonly directory as root"
    fi

    local test_file="$TEST_TEMP_DIR/test.txt"
    echo "content" > "$test_file"

    local readonly_dir="$TEST_TEMP_DIR/readonly"
    mkdir -p "$readonly_dir"
    chmod 444 "$readonly_dir"

    run create_backup "$test_file" "$readonly_dir"

    # Should fail gracefully
    [[ "$status" -eq 1 ]]

    chmod 755 "$readonly_dir"  # Cleanup
}

# ============================================================================
# Test Name: "safe_write_file handles write failures gracefully"
# Test Type: Error Condition Test
# Test Scope: Validates safe_write_file cleans up on failure
# ============================================================================
@test "safe_write_file cleans up temp files on failure" {
    if [[ "$(id -u)" -eq 0 ]]; then
        skip "Cannot test write failures as root"
    fi

    local readonly_dir="$TEST_TEMP_DIR/readonly"
    mkdir -p "$readonly_dir"
    chmod 444 "$readonly_dir"

    local target_file="$readonly_dir/file.txt"

    run safe_write_file "$target_file" "content"

    # Should fail
    [[ "$status" -eq 1 ]]

    # No temp files should remain
    local tmp_count
    tmp_count=$(find "$TEST_TEMP_DIR" -name "*.tmp.*" 2>/dev/null | wc -l)
    [[ $tmp_count -eq 0 ]]

    chmod 755 "$readonly_dir"  # Cleanup
}

# ----- Section: Large Files -----

# ============================================================================
# Test Name: "create_backup handles large files"
# Test Type: Performance Test
# Test Scope: Validates create_backup works with larger file sizes
# ============================================================================
@test "create_backup handles large files" {
    local test_file="$TEST_TEMP_DIR/large.txt"

    # Create 1MB file
    dd if=/dev/zero of="$test_file" bs=1024 count=1024 2>/dev/null

    run create_backup "$test_file"

    [[ "$status" -eq 0 ]]
    [[ -f "$output" ]]

    # Verify file size matches
    local original_size backup_size
    original_size=$(stat -f%z "$test_file" 2>/dev/null || stat -c%s "$test_file" 2>/dev/null)
    backup_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
    [[ $original_size -eq $backup_size ]]
}

# ============================================================================
# Test Name: "safe_write_file handles large content"
# Test Type: Performance Test
# Test Scope: Validates safe_write_file works with large content
# ============================================================================
@test "safe_write_file handles large content" {
    local target_file="$TEST_TEMP_DIR/large-write.txt"

    # Generate large content (1MB of 'a' characters)
    local large_content
    large_content=$(printf 'a%.0s' {1..1048576})

    run safe_write_file "$target_file" "$large_content"

    [[ "$status" -eq 0 ]]
    [[ -f "$target_file" ]]
}

# ----- Section: Edge Cases -----

# ============================================================================
# Test Name: "backup preserves file permissions"
# Test Type: Unit Test
# Test Scope: Validates create_backup preserves original file permissions
# ============================================================================
@test "backup preserves file permissions" {
    local test_file="$TEST_TEMP_DIR/perms.txt"
    echo "content" > "$test_file"
    chmod 600 "$test_file"

    local backup_file
    backup_file=$(create_backup "$test_file")

    # Backup should have same permissions as original
    local orig_perms backup_perms
    orig_perms=$(stat -f%p "$test_file" 2>/dev/null || stat -c%a "$test_file" 2>/dev/null)
    backup_perms=$(stat -f%p "$backup_file" 2>/dev/null || stat -c%a "$backup_file" 2>/dev/null)
    [[ "$orig_perms" == "$backup_perms" ]]
}

# ============================================================================
# Test Name: "safe_write_file handles filenames with spaces"
# Test Type: Edge Case Test
# Test Scope: Validates safe_write_file with spaces in filename
# ============================================================================
@test "safe_write_file handles filenames with spaces" {
    local target_file="$TEST_TEMP_DIR/file with spaces.txt"

    run safe_write_file "$target_file" "content"

    [[ "$status" -eq 0 ]]
    [[ -f "$target_file" ]]
}

# ============================================================================
# Test Name: "safe_write_file handles Unicode filenames"
# Test Type: Edge Case Test
# Test Scope: Validates safe_write_file with Unicode characters in filename
# ============================================================================
@test "safe_write_file handles Unicode filenames" {
    local target_file="$TEST_TEMP_DIR/文件.txt"

    run safe_write_file "$target_file" "content"

    [[ "$status" -eq 0 ]]
    [[ -f "$target_file" ]]
}

# End of test-file-operations.bats
