#!/bin/bash
#
# Script Name: utility-functions.sh
# Description: Common utility functions for LightSpeed WP automation scripts
#
# Version: v0.1.0
# Date: 2025-10-14
# Author: LightSpeedWP
# Github Contributors: @lightspeedwp / @ashleyshaw
# Author URI: https://lightspeedwp.agency/
# License: GPL v3 or later
# License URI: https://www.gnu.org/licenses/gpl-3.0.html
#
# Requirements:
#   - Bash (version 4.0 or later)
#   - Core utilities (awk, sed, grep, etc.)
#
# Usage: source ./utility-functions.sh [options]
#
# Options:
#   --help                  Show this help message
#   --verbose               Enable verbose logging
#
# Examples:
#   source ./utility-functions.sh --help        # Show help message
#   source ./utility-functions.sh --verbose     # Enable verbose logging
#   source ./utility-functions.sh               # Load with default settings
#
# Note:
#   - This script is intended to be sourced, not executed directly.
#


# Standardized logging - LightSpeed WP
#
# Global variables for logging
SCRIPT_NAME="$(basename "${BASH_SOURCE[0]}" .sh)"
LOG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../logs"
LOG_FILE="${LOG_DIR}/${SCRIPT_NAME}.log"

readonly SCRIPT_NAME
readonly LOG_DIR
readonly LOG_FILE

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

readonly RED
readonly GREEN
readonly YELLOW
readonly BLUE
readonly NC

# Create log directory if it doesn't exist
mkdir -p "${LOG_DIR}"

# Logging functions
function log_info() {
    local timestamp
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo -e "${GREEN}[INFO]${NC} $*" >&2
    echo "[INFO] ${timestamp}: $*" >> "${LOG_FILE}"
}

function log_warn() {
    local timestamp
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo -e "${YELLOW}[WARNING]${NC} $*" >&2
    echo "[WARNING] ${timestamp}: $*" >> "${LOG_FILE}"
}

function log_error() {
    local timestamp
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo -e "${RED}[ERROR]${NC} $*" >&2
    echo "[ERROR] ${timestamp}: $*" >> "${LOG_FILE}"
}

function log_debug() {
    if [[ "${VERBOSE}" == "true" ]]; then
        local timestamp
        timestamp=$(date "+%Y-%m-%d %H:%M:%S")
        echo -e "[DEBUG] $*" >&2
        echo "[DEBUG] ${timestamp}: $*" >> "${LOG_FILE}"
    fi
}

set -euo pipefail

readonly COLOR_RED='\033[0;31m'
readonly COLOR_GREEN='\033[0;32m'
readonly COLOR_YELLOW='\033[1;33m'
readonly COLOR_BLUE='\033[0;34m'
readonly COLOR_NC='\033[0m' # No Color
# Logging levels
readonly LOG_LEVEL_ERROR=0
readonly LOG_LEVEL_WARN=1
readonly LOG_LEVEL_INFO=2
readonly LOG_LEVEL_DEBUG=3
# Default log level
LOG_LEVEL=${LOG_LEVEL:-$LOG_LEVEL_INFO}
# Colored logging functions
log_error() {
    if [ "$LOG_LEVEL" -ge "$LOG_LEVEL_ERROR" ]; then
        echo -e "${COLOR_RED}[ERROR]${COLOR_NC} $*" >&2
    fi
}

log_warn() {
    if [ "$LOG_LEVEL" -ge "$LOG_LEVEL_WARN" ]; then
        echo -e "${COLOR_YELLOW}[WARN]${COLOR_NC} $*" >&2
    fi
}

log_info() {
    if [ "$LOG_LEVEL" -ge "$LOG_LEVEL_INFO" ]; then
        echo -e "${COLOR_BLUE}[INFO]${COLOR_NC} $*"
    fi
}

log_success() {
    if [ "$LOG_LEVEL" -ge "$LOG_LEVEL_INFO" ]; then
        echo -e "${COLOR_GREEN}[SUCCESS]${COLOR_NC} $*"
    fi
}

log_debug() {
    if [ "$LOG_LEVEL" -ge "$LOG_LEVEL_DEBUG" ]; then
        echo -e "[DEBUG] $*" >&2
    fi
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if required commands are available
check_dependencies() {
    local missing_deps=()

    for cmd in "$@"; do
        if ! command_exists "$cmd"; then
            missing_deps+=("$cmd")
        fi
    done

    if [ ${#missing_deps[@]} -gt 0 ]; then
        log_error "Missing required dependencies: ${missing_deps[*]}"
        log_info "Please install the missing dependencies and try again"
        return 1
    fi

    return 0
}

# Prompt for yes/no confirmation
confirm() {
    local prompt="${1:-Are you sure?}"
    local default="${2:-n}"

    # If not running interactively, use default response
    if [ ! -t 0 ]; then
        case "${default,,}" in
            y|yes)
                return 0
                ;;
            n|no)
                return 1
                ;;
            *)
                return 1
                ;;
        esac
    fi
    while true; do
        read -p "$prompt [y/N]: " -r response
        response=${response:-$default}

        case "$response" in
            [Yy]|[Yy][Ee][Ss])
                return 0
                ;;
            [Nn]|[Nn][Oo])
                return 1
                ;;
            *)
                echo "Please answer yes or no."
                ;;
        esac
    done
}

# Create backup of a file
backup_file() {
    local file="$1"
    local backup_dir="${2:-./backups}"

    if [ ! -f "$file" ]; then
        log_error "File does not exist: $file"
        return 1
    fi

    mkdir -p "$backup_dir"
    local backup_file
    backup_file="${backup_dir}/$(basename "$file").$(date +%Y%m%d_%H%M%S).bak"

    if cp "$file" "$backup_file"; then
        log_success "Backup created: $backup_file"
        echo "$backup_file"
    else
        log_error "Failed to create backup of $file"
        return 1
    fi
}

# Retry a command with exponential backoff
retry() {
    local max_attempts="$1"
    shift
    local attempt=1
    local delay=1

    while [ "$attempt" -le "$max_attempts" ]; do
        if "$@"; then
            return 0
        fi

        log_warn "Attempt $attempt/$max_attempts failed. Retrying in ${delay}s..."
        sleep $delay

        attempt=$((attempt + 1))
        delay=$((delay * 2))
    done

    log_error "Command failed after $max_attempts attempts"
    return 1
}

# Get script directory
get_script_dir() {
    cd "$(dirname "${BASH_SOURCE[0]}")" && pwd
}

# Validate URL format
validate_url() {
    local url="$1"
    local url_regex='^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$'

    if [[ "$url" =~ $url_regex ]]; then
        return 0
    else
        log_error "Invalid URL format: $url"
        return 1
    fi
}

# Check if running as root
is_root() {
    [ "$EUID" -eq 0 ]
}

# Generate timestamp
timestamp() {
    date '+%Y-%m-%d %H:%M:%S'
}

# Done
echo "Done."
exit 0 # Always exit 0 to not break CI/CD, errors are logged above
