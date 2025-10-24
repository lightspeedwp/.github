#!/bin/bash
# ============================================================================
# Script Name: logging.sh
# Description: Enhanced logging functionality for LightSpeed WP automation scripts
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: bash 4.0+, colors.sh
# Usage: source scripts/includes/core/logging.sh
# Environment Variables: 
#   LOG_FILE (optional) - Path to log file
#   LOG_LEVEL (optional) - Minimum log level (DEBUG, INFO, WARN, ERROR)
#   VERBOSE (optional) - Enable verbose output (true/false)
# Options: None - this is a library file
# Examples:
#   source scripts/includes/core/logging.sh
#   setup_logging "/var/log/script.log"
#   log_info "Process started"
#   log_error "Something went wrong"
# Notes:
#   - All log functions support multiple arguments
#   - Colors are automatically disabled for non-terminals
#   - Log files always contain uncolored messages
# ============================================================================

# Strict mode for safety
set -euo pipefail

# Source color definitions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=colors.sh
source "${SCRIPT_DIR}/colors.sh"

# Log level constants
readonly LOG_LEVEL_DEBUG=10
readonly LOG_LEVEL_INFO=20
readonly LOG_LEVEL_WARN=30
readonly LOG_LEVEL_ERROR=40

# Default log level
LOG_LEVEL_THRESHOLD=${LOG_LEVEL_THRESHOLD:-$LOG_LEVEL_INFO}

# ============================================================================
# Function: get_log_level_value
# Description: Convert log level name to numeric value
# Arguments: $1 - Log level name (DEBUG, INFO, WARN, ERROR)
# Output: Numeric log level value
# Notes: Returns appropriate numeric value for comparison
# ============================================================================
get_log_level_value() {
    local level="$1"
    case "${level^^}" in
        DEBUG) echo $LOG_LEVEL_DEBUG ;;
        INFO) echo $LOG_LEVEL_INFO ;;
        WARN|WARNING) echo $LOG_LEVEL_WARN ;;
        ERROR) echo $LOG_LEVEL_ERROR ;;
        *) echo $LOG_LEVEL_INFO ;;
    esac
}

# ============================================================================
# Function: should_log
# Description: Check if message should be logged based on level
# Arguments: $1 - Log level name
# Output: None
# Notes: Returns 0 if should log, 1 otherwise
# ============================================================================
should_log() {
    local level="$1"
    local level_value
    level_value=$(get_log_level_value "$level")
    [[ $level_value -ge $LOG_LEVEL_THRESHOLD ]]
}

# ============================================================================
# Function: log_msg
# Description: Core logging function with level, colors, and file output
# Arguments: $1 - Log level, $2+ - Message to log
# Output: Formatted log message to stderr and optional log file
# Notes: Handles colors, timestamps, and file logging automatically
# ============================================================================
log_msg() {
    local level="$1"
    shift
    local message="$*"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Check if we should log this level
    if ! should_log "$level"; then
        return 0
    fi
    
    # Determine color and symbol based on level
    local color symbol
    case "${level^^}" in
        DEBUG)
            color="$BLUE"
            symbol="🔍"
            ;;
        INFO)
            color="$GREEN"
            symbol="ℹ️ "
            ;;
        WARN|WARNING)
            color="$YELLOW"
            symbol="⚠️ "
            ;;
        ERROR)
            color="$RED"
            symbol="❌"
            ;;
        SUCCESS)
            color="$BRIGHT_GREEN"
            symbol="✅"
            ;;
        *)
            color="$NC"
            symbol=""
            ;;
    esac
    
    # Format message for console (with colors if supported)
    local console_message
    if check_color_support; then
        console_message="${color}[${level^^}] ${timestamp}: ${symbol} ${message}${NC}"
    else
        console_message="[${level^^}] ${timestamp}: ${message}"
    fi
    
    # Format message for file (no colors)
    local file_message="[${level^^}] ${timestamp}: ${message}"
    
    # Output to stderr
    echo -e "$console_message" >&2
    
    # Output to log file if configured
    if [[ -n "${LOG_FILE:-}" ]]; then
        echo "$file_message" >> "$LOG_FILE"
    fi
}

# ============================================================================
# Function: log_info
# Description: Log informational messages
# Arguments: $* - Message to log
# Output: Formatted info message
# Notes: Standard logging for normal operations
# ============================================================================
log_info() {
    log_msg "INFO" "$@"
}

# ============================================================================
# Function: log_success
# Description: Log success messages
# Arguments: $* - Success message to log
# Output: Formatted success message with checkmark
# Notes: Use for completed operations and achievements
# ============================================================================
log_success() {
    log_msg "SUCCESS" "$@"
}

# ============================================================================
# Function: log_warning
# Description: Log warning messages
# Arguments: $* - Warning message to log
# Output: Formatted warning message
# Notes: Use for non-fatal issues that need attention
# ============================================================================
log_warning() {
    log_msg "WARN" "$@"
}

# ============================================================================
# Function: log_warn
# Description: Alias for log_warning for backward compatibility
# Arguments: $* - Warning message to log
# Output: Formatted warning message
# Notes: Backward compatibility alias
# ============================================================================
log_warn() {
    log_warning "$@"
}

# ============================================================================
# Function: log_error
# Description: Log error messages
# Arguments: $* - Error message to log
# Output: Formatted error message
# Notes: Use for errors and failures
# ============================================================================
log_error() {
    log_msg "ERROR" "$@"
}

# ============================================================================
# Function: log_debug
# Description: Log debug messages (only when verbose mode enabled)
# Arguments: $* - Debug message to log
# Output: Formatted debug message if verbose enabled
# Notes: Controlled by VERBOSE environment variable or log level
# ============================================================================
log_debug() {
    if [[ "${VERBOSE:-false}" == "true" ]] || should_log "DEBUG"; then
        log_msg "DEBUG" "$@"
    fi
}

# ============================================================================
# Function: setup_logging
# Description: Initialize logging with specified log file and level
# Arguments: $1 - Log file path, $2 (optional) - Log level
# Output: Creates log file and sets LOG_FILE environment variable
# Notes: Creates directory structure if needed
# ============================================================================
setup_logging() {
    local log_file="$1"
    local log_level="${2:-INFO}"
    local log_dir
    log_dir=$(dirname "$log_file")
    
    # Create log directory if it doesn't exist
    if [[ ! -d "$log_dir" ]]; then
        mkdir -p "$log_dir"
    fi
    
    # Set global log file
    export LOG_FILE="$log_file"
    
    # Set log level threshold
    LOG_LEVEL_THRESHOLD=$(get_log_level_value "$log_level")
    export LOG_LEVEL_THRESHOLD
    
    # Initialize log file with header
    echo "# Log started at $(date)" > "$LOG_FILE"
    log_info "Logging initialized: $LOG_FILE (level: $log_level)"
}

# ============================================================================
# Function: rotate_log
# Description: Rotate log file if it becomes too large
# Arguments: $1 (optional) - Maximum file size in bytes (default: 10MB)
# Output: Creates backup and starts new log file
# Notes: Keeps one backup copy of the log file
# ============================================================================
rotate_log() {
    local max_size="${1:-10485760}" # 10MB default
    
    if [[ -z "${LOG_FILE:-}" ]] || [[ ! -f "$LOG_FILE" ]]; then
        return 0
    fi
    
    local file_size
    file_size=$(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null || echo 0)
    
    if [[ $file_size -gt $max_size ]]; then
        local backup_file
        backup_file="${LOG_FILE}.$(date +%Y%m%d-%H%M%S).old"
        mv "$LOG_FILE" "$backup_file"
        touch "$LOG_FILE"
        log_info "Log rotated: $backup_file"
    fi
}

# End of logging.sh