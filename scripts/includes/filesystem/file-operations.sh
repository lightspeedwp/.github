#!/bin/bash
# ============================================================================
# Script Name: file-operations.sh
# Description: Safe file and directory operations for LightSpeed WP scripts
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: bash 4.0+, logging.sh, validation.sh
# Usage: source scripts/includes/filesystem/file-operations.sh
# Environment Variables: None
# Options: None - this is a library file
# Examples:
#   source scripts/includes/filesystem/file-operations.sh
#   backup_file="/tmp/backup"
#   create_backup "/path/to/file" "$backup_file"
#   safe_write_file "/path/to/file" "content"
# Notes:
#   - All operations include safety checks and error handling
#   - Backup functions create timestamped copies
#   - Atomic operations prevent partial writes
# ============================================================================

# Strict mode for safety
set -euo pipefail

# Source required includes
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../core/logging.sh
source "${SCRIPT_DIR}/../core/logging.sh"
# shellcheck source=../core/validation.sh
source "${SCRIPT_DIR}/../core/validation.sh"

# ============================================================================
# Function: timestamp
# Description: Generate consistent timestamp for filenames
# Arguments: None
# Output: Timestamp string in format YYYY-MM-DD-HHMMSS
# Notes: Used for creating unique backup filenames
# ============================================================================
timestamp() {
    date +"%Y-%m-%d-%H%M%S"
}

# ============================================================================
# Function: create_backup
# Description: Create a timestamped backup of a file
# Arguments: $1 - File to backup, $2 (optional) - Backup directory
# Output: Path to backup file on stdout
# Notes: Creates backup in same directory with .backup.timestamp suffix
# ============================================================================
create_backup() {
    local file="$1"
    local backup_dir="${2:-$(dirname "$file")}"
    local filename
    filename=$(basename "$file")
    local backup_file
    backup_file="${backup_dir}/${filename}.backup.$(timestamp)"
    
    # Validate source file exists
    if ! validate_file_exists "$file" "Source file"; then
        return 1
    fi
    
    # Create backup directory if needed
    if [[ ! -d "$backup_dir" ]]; then
        if ! mkdir -p "$backup_dir"; then
            log_error "Failed to create backup directory: $backup_dir"
            return 1
        fi
        log_debug "Created backup directory: $backup_dir"
    fi
    
    # Create the backup
    if cp "$file" "$backup_file"; then
        log_info "Created backup: $backup_file"
        echo "$backup_file"
        return 0
    else
        log_error "Failed to create backup of $file"
        return 1
    fi
}

# ============================================================================
# Function: safe_write_file
# Description: Write content to file with automatic backup and atomic operation
# Arguments: $1 - Target file path, $2 (optional) - Content (reads from stdin if not provided)
# Output: Success/error messages
# Notes: Creates backup if file exists, writes atomically using temp file
# ============================================================================
safe_write_file() {
    local target_file="$1"
    local content="${2:-}"
    local temp_file
    temp_file="${target_file}.tmp.$(timestamp)"
    local backup_file
    backup_file=""
    
    # Create backup if target file exists
    if [[ -f "$target_file" ]]; then
        if ! backup_file=$(create_backup "$target_file"); then
            log_error "Failed to create backup before writing to $target_file"
            return 1
        fi
    fi
    
    # Create target directory if needed
    local target_dir
    target_dir=$(dirname "$target_file")
    if [[ ! -d "$target_dir" ]]; then
        if ! mkdir -p "$target_dir"; then
            log_error "Failed to create target directory: $target_dir"
            return 1
        fi
        log_debug "Created target directory: $target_dir"
    fi
    
    # Write content to temporary file
    if [[ -n "$content" ]]; then
        # Content provided as argument
        if ! echo "$content" > "$temp_file"; then
            log_error "Failed to write content to temporary file: $temp_file"
            [[ -f "$temp_file" ]] && rm -f "$temp_file"
            return 1
        fi
    else
        # Read from stdin
        if ! cat > "$temp_file"; then
            log_error "Failed to write stdin to temporary file: $temp_file"
            [[ -f "$temp_file" ]] && rm -f "$temp_file"
            return 1
        fi
    fi
    
    # Atomically move temp file to target
    if mv "$temp_file" "$target_file"; then
        log_info "Successfully wrote file: $target_file"
        if [[ -n "$backup_file" ]]; then
            log_debug "Original backed up as: $backup_file"
        fi
        return 0
    else
        log_error "Failed to move temporary file to target: $target_file"
        [[ -f "$temp_file" ]] && rm -f "$temp_file"
        return 1
    fi
}

# ============================================================================
# Function: safe_copy_file
# Description: Copy file with backup of destination if it exists
# Arguments: $1 - Source file, $2 - Destination file
# Output: Success/error messages
# Notes: Creates backup of destination, preserves permissions
# ============================================================================
safe_copy_file() {
    local source_file="$1"
    local dest_file="$2"
    local backup_file
    backup_file=""
    
    # Validate source file
    if ! validate_file_exists "$source_file" "Source file"; then
        return 1
    fi
    
    # Create backup of destination if it exists
    if [[ -f "$dest_file" ]]; then
        if ! backup_file=$(create_backup "$dest_file"); then
            log_error "Failed to create backup before copying to $dest_file"
            return 1
        fi
    fi
    
    # Create destination directory if needed
    local dest_dir
    dest_dir=$(dirname "$dest_file")
    if [[ ! -d "$dest_dir" ]]; then
        if ! mkdir -p "$dest_dir"; then
            log_error "Failed to create destination directory: $dest_dir"
            return 1
        fi
        log_debug "Created destination directory: $dest_dir"
    fi
    
    # Copy the file
    if cp "$source_file" "$dest_file"; then
        log_info "Successfully copied: $source_file -> $dest_file"
        if [[ -n "$backup_file" ]]; then
            log_debug "Original backed up as: $backup_file"
        fi
        return 0
    else
        log_error "Failed to copy file: $source_file -> $dest_file"
        return 1
    fi
}

# ============================================================================
# Function: safe_move_file
# Description: Move file with backup of destination if it exists
# Arguments: $1 - Source file, $2 - Destination file
# Output: Success/error messages
# Notes: Creates backup of destination before moving
# ============================================================================
safe_move_file() {
    local source_file="$1"
    local dest_file="$2"
    local backup_file
    backup_file=""
    
    # Validate source file
    if ! validate_file_exists "$source_file" "Source file"; then
        return 1
    fi
    
    # Create backup of destination if it exists
    if [[ -f "$dest_file" ]]; then
        if ! backup_file=$(create_backup "$dest_file"); then
            log_error "Failed to create backup before moving to $dest_file"
            return 1
        fi
    fi
    
    # Create destination directory if needed
    local dest_dir
    dest_dir=$(dirname "$dest_file")
    if [[ ! -d "$dest_dir" ]]; then
        if ! mkdir -p "$dest_dir"; then
            log_error "Failed to create destination directory: $dest_dir"
            return 1
        fi
        log_debug "Created destination directory: $dest_dir"
    fi
    
    # Move the file
    if mv "$source_file" "$dest_file"; then
        log_info "Successfully moved: $source_file -> $dest_file"
        if [[ -n "$backup_file" ]]; then
            log_debug "Original backed up as: $backup_file"
        fi
        return 0
    else
        log_error "Failed to move file: $source_file -> $dest_file"
        return 1
    fi
}

# ============================================================================
# Function: cleanup_temp_files
# Description: Clean up temporary files and directories safely
# Arguments: $* - List of temporary files/directories to clean
# Output: Log messages about cleanup operations
# Notes: Designed to be safe and idempotent
# ============================================================================
cleanup_temp_files() {
    for item in "$@"; do
        if [[ -e "$item" ]]; then
            log_debug "Cleaning up: $item"
            if rm -rf "$item"; then
                log_debug "Successfully removed: $item"
            else
                log_warning "Failed to remove: $item"
            fi
        fi
    done
}

# ============================================================================
# Function: create_temp_file
# Description: Create a secure temporary file
# Arguments: $1 (optional) - Template for mktemp
# Output: Path to temporary file on stdout
# Notes: Creates secure temporary file with proper permissions
# ============================================================================
create_temp_file() {
    local template="${1:-tmp.XXXXXXXXXX}"
    local temp_file
    temp_file=""
    if temp_file=$(mktemp "$template"); then
        # Set secure permissions (readable/writable by owner only)
        chmod 600 "$temp_file"
        log_debug "Created temporary file: $temp_file"
        echo "$temp_file"
        return 0
    else
        log_error "Failed to create temporary file with template: $template"
        return 1
    fi
}

# ============================================================================
# Function: create_temp_dir
# Description: Create a secure temporary directory
# Arguments: $1 (optional) - Template for mktemp
# Output: Path to temporary directory on stdout
# Notes: Creates secure temporary directory with proper permissions
# ============================================================================
create_temp_dir() {
    local template="${1:-tmp.XXXXXXXXXX}"
    local temp_dir
    temp_dir=""
    if temp_dir=$(mktemp -d "$template"); then
        # Set secure permissions (accessible by owner only)
        chmod 700 "$temp_dir"
        log_debug "Created temporary directory: $temp_dir"
        echo "$temp_dir"
        return 0
    else
        log_error "Failed to create temporary directory with template: $template"
        return 1
    fi
}

# ============================================================================
# Function: ensure_directory
# Description: Ensure directory exists, create if necessary
# Arguments: $1 - Directory path, $2 (optional) - Permissions (default: 755)
# Output: Success/error messages
# Notes: Creates directory with specified permissions if it doesn't exist
# ============================================================================
ensure_directory() {
    local dir_path="$1"
    local permissions="${2:-755}"
    
    if [[ -d "$dir_path" ]]; then
        log_debug "Directory already exists: $dir_path"
        return 0
    fi
    
    if mkdir -p "$dir_path"; then
        chmod "$permissions" "$dir_path"
        log_info "Created directory: $dir_path (permissions: $permissions)"
        return 0
    else
        log_error "Failed to create directory: $dir_path"
        return 1
    fi
}

# ============================================================================
# Function: get_file_size
# Description: Get file size in bytes
# Arguments: $1 - File path
# Output: File size in bytes on stdout
# Notes: Cross-platform compatible implementation
# ============================================================================
get_file_size() {
    local file="$1"
    
    if ! validate_file_exists "$file" "File"; then
        return 1
    fi
    
    # Cross-platform file size detection
    if stat -f%z "$file" 2>/dev/null; then
        # BSD/macOS
        return 0
    elif stat -c%s "$file" 2>/dev/null; then
        # GNU/Linux
        return 0
    else
        log_error "Unable to determine file size for: $file"
        return 1
    fi
}

# ============================================================================
# Function: rotate_file
# Description: Rotate file if it exceeds specified size
# Arguments: $1 - File path, $2 (optional) - Max size in bytes (default: 10MB)
# Output: Creates backup and starts new file if rotation occurs
# Notes: Keeps one backup copy of the rotated file
# ============================================================================
rotate_file() {
    local file_path="$1"
    local max_size="${2:-10485760}" # 10MB default
    
    if [[ ! -f "$file_path" ]]; then
        log_debug "File doesn't exist, no rotation needed: $file_path"
        return 0
    fi
    
    local file_size
    if ! file_size=$(get_file_size "$file_path"); then
        return 1
    fi
    
    if [[ $file_size -gt $max_size ]]; then
        local backup_file
        if backup_file=$(create_backup "$file_path"); then
            # Clear the original file
            : > "$file_path"
            log_info "File rotated (size: $file_size bytes): $backup_file"
            return 0
        else
            log_error "Failed to rotate file: $file_path"
            return 1
        fi
    else
        log_debug "File size ($file_size bytes) below rotation threshold ($max_size bytes)"
        return 0
    fi
}

# End of file-operations.sh