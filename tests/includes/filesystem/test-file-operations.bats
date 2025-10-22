#!/usr/bin/env bats
# ============================================================================
# Test name: test-file-operations.bats
# Testing: scripts/includes/filesystem/file-operations.sh
# Description: Test suite for safe file and directory operations
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: bats, scripts/includes/filesystem/file-operations.sh, test-helper.bash
# Usage: bats tests/includes/filesystem/test-file-operations.bats
# Environment Variables: None
# Options: None
# Examples:
#   bats tests/includes/filesystem/test-file-operations.bats
# Notes:
#   - Tests all file operation functions
#   - Tests backup creation and atomic operations
#   - Tests error handling and edge cases
# ============================================================================

# Load test helpers
load "$(dirname "$BATS_TEST_FILENAME")/../../test-helper.bash"

# Setup function - runs before each test
setup() {
    # Get the repository root and resolve paths
    TEST_REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../.." && pwd)"
    FILE_OPS_SCRIPT="${TEST_REPO_ROOT}/scripts/includes/filesystem/file-operations.sh"
    
    # Create temporary directory for test files
    TEST_TEMP_DIR=$(mktemp -d)
    TEST_SOURCE_FILE="${TEST_TEMP_DIR}/source.txt"
    TEST_TARGET_FILE="${TEST_TEMP_DIR}/target.txt"
    TEST_SUBDIR="${TEST_TEMP_DIR}/subdir"
    
    # Create test files and directories
    echo "source content" > "$TEST_SOURCE_FILE"
    mkdir -p "$TEST_SUBDIR"
    
    # Verify the file operations script exists
    [[ -f "$FILE_OPS_SCRIPT" ]]
}

# Teardown function - runs after each test
teardown() {
    # Clean up temporary files
    [[ -d "$TEST_TEMP_DIR" ]] && rm -rf "$TEST_TEMP_DIR"
}

# ----- Section: Basic Script Tests -----

# ============================================================================
# Test Name: "file operations script sources without errors"
# Test Type: Basic Functionality
# Test Scope: Validates that the file operations script can be sourced successfully
# ============================================================================
@test "file operations script sources without errors" {
    run bash -c "source '$FILE_OPS_SCRIPT'"
    [ "$status" -eq 0 ]
}

# ----- Section: Backup Functions Tests -----

# ============================================================================
# Test Name: "create_backup creates timestamped backup"
# Test Type: Backup Creation
# Test Scope: Validates that create_backup function creates properly timestamped backups
# ============================================================================
@test "create_backup creates timestamped backup" {
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        backup_file=\$(create_backup '$TEST_SOURCE_FILE')
        [[ -f \"\$backup_file\" ]]
        echo \"\$backup_file\"
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ \.backup\.[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{6} ]]
}

# ============================================================================
# Test Name: "create_backup preserves file content"
# Test Type: Content Preservation
# Test Scope: Validates that backup files contain identical content to source
# ============================================================================
@test "create_backup preserves file content" {
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        backup_file=\$(create_backup '$TEST_SOURCE_FILE')
        diff '$TEST_SOURCE_FILE' \"\$backup_file\"
    "
    [ "$status" -eq 0 ]
}

# ============================================================================
# Test Name: "create_backup fails for non-existent files"
# Test Type: Error Handling
# Test Scope: Validates proper error handling when trying to backup non-existent files
# ============================================================================
@test "create_backup fails for non-existent files" {
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        create_backup '/non/existent/file.txt'
    "
    [ "$status" -eq 1 ]
    [[ "$output" =~ "does not exist" ]]
}

# ============================================================================
# Test Name: "create_backup uses custom backup directory"
# Test Type: Directory Customization
# Test Scope: Validates that backups can be created in specified directories
# ============================================================================
@test "create_backup uses custom backup directory" {
    local backup_dir="${TEST_TEMP_DIR}/backups"
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        backup_file=\$(create_backup '$TEST_SOURCE_FILE' '$backup_dir')
        [[ \"\$backup_file\" =~ ^$backup_dir ]]
        [[ -f \"\$backup_file\" ]]
    "
    [ "$status" -eq 0 ]
}

# ----- Section: Safe Write Functions Tests -----

# ============================================================================
# Test Name: "safe_write_file creates new file with content"
# Test Type: File Creation
# Test Scope: Validates that safe_write_file creates new files with specified content
# ============================================================================
@test "safe_write_file creates new file with content" {
    local new_file="${TEST_TEMP_DIR}/new_file.txt"
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        safe_write_file '$new_file' 'test content'
        cat '$new_file'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "test content" ]]
}

# ============================================================================
# Test Name: "safe_write_file creates backup of existing file"
# Test Type: Backup During Write
# Test Scope: Validates that existing files are backed up before being overwritten
# ============================================================================
@test "safe_write_file creates backup of existing file" {
    echo "original content" > "$TEST_TARGET_FILE"
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        safe_write_file '$TEST_TARGET_FILE' 'new content'
        # Check if backup was created
        ls '${TEST_TEMP_DIR}'/*.backup.* 2>/dev/null | wc -l
    "
    [ "$status" -eq 0 ]
    [[ "$output" -ge 1 ]]
}

# ============================================================================
# Test Name: "safe_write_file reads from stdin when no content provided"
# Test Type: Input Handling
# Test Scope: Validates that safe_write_file can read content from stdin
# ============================================================================
@test "safe_write_file reads from stdin when no content provided" {
    local new_file="${TEST_TEMP_DIR}/stdin_file.txt"
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        echo 'stdin content' | safe_write_file '$new_file'
        cat '$new_file'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "stdin content" ]]
}

# ============================================================================
# Test Name: "safe_write_file creates directory structure"
# Test Type: Directory Creation
# Test Scope: Validates that parent directories are created if they don't exist
# ============================================================================
@test "safe_write_file creates directory structure" {
    local nested_file="${TEST_TEMP_DIR}/deep/nested/path/file.txt"
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        safe_write_file '$nested_file' 'nested content'
        [[ -f '$nested_file' ]]
        cat '$nested_file'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "nested content" ]]
}

# ----- Section: Copy and Move Functions Tests -----

# ============================================================================
# Test Name: "safe_copy_file copies file successfully"
# Test Type: File Copy
# Test Scope: Validates that safe_copy_file copies files with proper content preservation
# ============================================================================
@test "safe_copy_file copies file successfully" {
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        safe_copy_file '$TEST_SOURCE_FILE' '$TEST_TARGET_FILE'
        diff '$TEST_SOURCE_FILE' '$TEST_TARGET_FILE'
    "
    [ "$status" -eq 0 ]
}

# ============================================================================
# Test Name: "safe_copy_file creates backup of destination"
# Test Type: Backup During Copy
# Test Scope: Validates that existing destination files are backed up
# ============================================================================
@test "safe_copy_file creates backup of destination" {
    echo "original destination" > "$TEST_TARGET_FILE"
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        safe_copy_file '$TEST_SOURCE_FILE' '$TEST_TARGET_FILE'
        # Check if backup was created
        ls '${TEST_TEMP_DIR}'/*.backup.* 2>/dev/null | wc -l
    "
    [ "$status" -eq 0 ]
    [[ "$output" -ge 1 ]]
}

# ============================================================================
# Test Name: "safe_move_file moves file successfully"
# Test Type: File Move
# Test Scope: Validates that safe_move_file moves files correctly
# ============================================================================
@test "safe_move_file moves file successfully" {
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        safe_move_file '$TEST_SOURCE_FILE' '$TEST_TARGET_FILE'
        [[ ! -f '$TEST_SOURCE_FILE' ]]
        [[ -f '$TEST_TARGET_FILE' ]]
        cat '$TEST_TARGET_FILE'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "source content" ]]
}

# ============================================================================
# Test Name: "safe_move_file creates backup of destination"
# Test Type: Backup During Move
# Test Scope: Validates that existing destination files are backed up during move
# ============================================================================
@test "safe_move_file creates backup of destination" {
    echo "destination content" > "$TEST_TARGET_FILE"
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        safe_move_file '$TEST_SOURCE_FILE' '$TEST_TARGET_FILE'
        # Check if backup was created
        ls '${TEST_TEMP_DIR}'/*.backup.* 2>/dev/null | wc -l
    "
    [ "$status" -eq 0 ]
    [[ "$output" -ge 1 ]]
}

# ----- Section: Temporary File Functions Tests -----

# ============================================================================
# Test Name: "create_temp_file creates secure temporary file"
# Test Type: Temporary File Creation
# Test Scope: Validates that temporary files are created with proper security
# ============================================================================
@test "create_temp_file creates secure temporary file" {
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        temp_file=\$(create_temp_file)
        [[ -f \"\$temp_file\" ]]
        # Check permissions (should be 600)
        ls -l \"\$temp_file\" | cut -d' ' -f1
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ ^-rw------- ]]
}

# ============================================================================
# Test Name: "create_temp_dir creates secure temporary directory"
# Test Type: Temporary Directory Creation
# Test Scope: Validates that temporary directories are created with proper security
# ============================================================================
@test "create_temp_dir creates secure temporary directory" {
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        temp_dir=\$(create_temp_dir)
        [[ -d \"\$temp_dir\" ]]
        # Check permissions (should be 700)
        ls -ld \"\$temp_dir\" | cut -d' ' -f1
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ ^drwx------ ]]
}

# ============================================================================
# Test Name: "cleanup_temp_files removes specified files"
# Test Type: Cleanup Functionality
# Test Scope: Validates that temporary files and directories are properly cleaned up
# ============================================================================
@test "cleanup_temp_files removes specified files" {
    local temp_file="${TEST_TEMP_DIR}/temp_file.txt"
    local temp_dir="${TEST_TEMP_DIR}/temp_dir"
    
    echo "temp content" > "$temp_file"
    mkdir -p "$temp_dir"
    
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        cleanup_temp_files '$temp_file' '$temp_dir'
        [[ ! -f '$temp_file' ]]
        [[ ! -d '$temp_dir' ]]
    "
    [ "$status" -eq 0 ]
}

# ----- Section: Directory Management Tests -----

# ============================================================================
# Test Name: "ensure_directory creates missing directory"
# Test Type: Directory Creation
# Test Scope: Validates that ensure_directory creates directories with proper permissions
# ============================================================================
@test "ensure_directory creates missing directory" {
    local new_dir="${TEST_TEMP_DIR}/new_directory"
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        ensure_directory '$new_dir' '755'
        [[ -d '$new_dir' ]]
        ls -ld '$new_dir' | cut -d' ' -f1
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ ^drwxr-xr-x ]]
}

# ============================================================================
# Test Name: "ensure_directory does nothing for existing directory"
# Test Type: Idempotent Operation
# Test Scope: Validates that ensure_directory is idempotent for existing directories
# ============================================================================
@test "ensure_directory does nothing for existing directory" {
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        ensure_directory '$TEST_SUBDIR'
        [[ -d '$TEST_SUBDIR' ]]
        echo 'directory exists'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "directory exists" ]]
}

# ----- Section: File Size and Rotation Tests -----

# ============================================================================
# Test Name: "get_file_size returns correct size"
# Test Type: File Size Detection
# Test Scope: Validates that file size detection works correctly
# ============================================================================
@test "get_file_size returns correct size" {
    # Create file with known size
    dd if=/dev/zero of="$TEST_TARGET_FILE" bs=1024 count=5 2>/dev/null
    
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        get_file_size '$TEST_TARGET_FILE'
    "
    [ "$status" -eq 0 ]
    [[ "$output" == "5120" ]] # 5 KB
}

# ============================================================================
# Test Name: "rotate_file creates backup for large files"
# Test Type: File Rotation
# Test Scope: Validates that large files are rotated and backed up
# ============================================================================
@test "rotate_file creates backup for large files" {
    # Create large file
    dd if=/dev/zero of="$TEST_TARGET_FILE" bs=1024 count=20 2>/dev/null
    
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        rotate_file '$TEST_TARGET_FILE' 1024  # 1KB threshold
        # Check if backup was created
        ls '${TEST_TEMP_DIR}'/*.backup.* 2>/dev/null | wc -l
    "
    [ "$status" -eq 0 ]
    [[ "$output" -ge 1 ]]
}

# ============================================================================
# Test Name: "rotate_file leaves small files unchanged"
# Test Type: File Rotation
# Test Scope: Validates that small files are not rotated unnecessarily
# ============================================================================
@test "rotate_file leaves small files unchanged" {
    echo "small content" > "$TEST_TARGET_FILE"
    
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        rotate_file '$TEST_TARGET_FILE' 10485760  # 10MB threshold
        # Check no backup was created
        ls '${TEST_TEMP_DIR}'/*.backup.* 2>/dev/null | wc -l || echo '0'
    "
    [ "$status" -eq 0 ]
    [[ "$output" == "0" ]]
}

# ----- Section: Error Handling Tests -----

# ============================================================================
# Test Name: "file operations handle permission errors gracefully"
# Test Type: Error Handling
# Test Scope: Validates graceful handling of permission-related errors
# ============================================================================
@test "file operations handle permission errors gracefully" {
    # This test might not work in all environments, so we'll keep it simple
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        # Try to write to a read-only directory (simulated)
        safe_write_file '/dev/null/impossible' 'content' 2>/dev/null || echo 'error handled'
    "
    [ "$status" -eq 0 ]
    [[ "$output" =~ "error handled" ]]
}

# ============================================================================
# Test Name: "timestamp function generates valid format"
# Test Type: Utility Function
# Test Scope: Validates timestamp generation for backup filenames
# ============================================================================
@test "timestamp function generates valid format" {
    run bash -c "
        source '$FILE_OPS_SCRIPT'
        timestamp
    "
    [ "$status" -eq 0 ]
    # Should match YYYY-MM-DD-HHMMSS format
    [[ "$output" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{6}$ ]]
}

# End of test-file-operations.bats