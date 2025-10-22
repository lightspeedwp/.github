#!/bin/bash
###############################################################################
#
# Script Name: standardize-logging.sh
# Description: Adds or updates standardized logging to script files
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
# Usage: ./standardize-logging.sh [--dry-run] [--verbose] [script_file]
#
# Environment Variables:
#   None
#
# Options:
#   --dry-run      Preview changes without applying them
#   --verbose      Show detailed debug information
#   --help         Show this help message
#   script_file    Specific script file to update (default: all scripts in scripts directory)
#
# Examples:
#   ./standardize-logging.sh                # Update all scripts in the scripts directory
#   ./standardize-logging.sh --help         # Show help message
#   ./standardize-logging.sh --dry-run ../project/update-projects.sh    # Preview changes to a specific script
#   ./standardize-logging.sh --verbose      # Show detailed debug information
#
# Notes:
# - This script modifies other scripts to include standardized logging.
#
###############################################################################

# Strict mode
set -euo pipefail


# Set up script and logging directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="${REPO_ROOT}/logs"
SCRIPT_NAME="standardize-logging"
LOG_FILE="${LOG_DIR}/${SCRIPT_NAME}.log"
mkdir -p "${LOG_DIR}"

readonly SCRIPT_DIR
readonly REPO_ROOT
readonly LOG_DIR
readonly SCRIPT_NAME
readonly LOG_FILE

# Script defaults
DRY_RUN=false
VERBOSE=false

# Colors for terminal output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[0;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Create log directory if it doesn't exist
mkdir -p "${LOG_DIR}"

#############################################################################
# Function: log_info
# Description: Logs an informational message.
# Arguments:
#   $* - The message to log.
# Output: Prints the message to stderr and logs to file.
###############################################################################
# Logging functions
function log_info() {
    local timestamp
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo -e "${GREEN}[INFO]${NC} $*" >&2
    echo "[INFO] ${timestamp}: $*" >> "${LOG_FILE}"
}

#############################################################################
# Function: log_warn
# Description: Logs a warning message.
# Arguments:
#   $* - The message to log.
# Output: Prints the message to stderr and logs to file.
###############################################################################
# Logging function
function log_warn() {
    local timestamp
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo -e "${YELLOW}[WARNING]${NC} $*" >&2
    echo "[WARNING] ${timestamp}: $*" >> "${LOG_FILE}"
}

#############################################################################
# Function: log_error
# Description: Logs an error message.
# Arguments:
#   $* - The message to log.
# Output: Prints the message to stderr and logs to file.
###############################################################################
# Logging function
function log_error() {
    local timestamp
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo -e "${RED}[ERROR]${NC} $*" >&2
    echo "[ERROR] ${timestamp}: $*" >> "${LOG_FILE}"
}

#############################################################################
# Function: log_debug
# Description: Logs a debug message if verbose mode is enabled.
# Arguments:
#   $* - The message to log.
# Output: Prints the message to stderr and logs to file.
###############################################################################
# Logging function
function log_debug() {
    if [[ "${VERBOSE}" == "true" ]]; then
        local timestamp
        timestamp=$(date "+%Y-%m-%d %H:%M:%S")
        echo -e "${BLUE}[DEBUG]${NC} $*" >&2
        echo "[DEBUG] ${timestamp}: $*" >> "${LOG_FILE}"
    fi
}

#############################################################################
# Function: show_help
# Description: Displays the help message for the script.
# Arguments:
#   None
# Output: Prints the help message to stdout.
###############################################################################
# Show help message
function show_help() {
    cat << EOF
Usage: ${0} [OPTIONS] [SCRIPT_FILE]

Adds or updates standardized logging to script files in the repository.
If no script file is specified, scans the entire scripts directory.

Options:
  --dry-run      Preview changes without applying them
  --verbose      Show detailed debug information
  --help         Show this help message

Example:
  ${0} --dry-run ../project/update-projects.sh
  ${0} --verbose
EOF
}

#############################################################################
# Function: parse_arguments
# Description: Parses command-line arguments.
# Arguments:
#   $@ - The command-line arguments.
# Output: Sets global variables based on arguments.
###############################################################################
# Parse command-line arguments
function parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            -* )
                echo "Unknown option: $1"
                show_help
                exit 1
                ;;
            *)
                SCRIPT_FILE="$1"
                shift
                ;;
        esac
    done
}

#############################################################################
# Function: generate_logging_code
# Description: Generates the standard logging code block to be inserted into other scripts.
# Arguments:
#   None
# Output: Prints the logging code block to stdout.
###############################################################################
# Generates the logging code to be inserted
function generate_logging_code() {
    cat << 'EOF'
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
EOF
}

#############################################################################
# Function: update_script_file
# Description: Updates a given script file with standardized logging code.
# Arguments:
#   $1 - The path to the script file.
# Output: Modifies the script file in place.
###############################################################################
# Update a single script file
function update_script_file() {
    local script_file="$1"
    local temp_file
    temp_file=$(mktemp)

    # Debugging information
    log_debug "Updating script file: ${script_file}"
    log_info "Processing ${script_file}"

    # Check if file exists
    if [[ ! -f "${script_file}" ]]; then
        log_error "File not found: ${script_file}"
        echo "File not found"
        return 1
    fi

    # Check if file is a shell script
    if ! head -n1 "${script_file}" | grep -q '#!/bin/bash'; then
        log_debug "Skipping non-bash file: ${script_file}"
        return 0
    fi

    # Check if logging is already set up
    if grep -q "Standardized logging" "${script_file}" || grep -q "LOG_FILE" "${script_file}"; then
        log_warn "Logging already set up in ${script_file}. Skipping."
        echo "already set up"
        return 0
    fi

    # Find position after shebang and initial comments
    local insert_line
    insert_line=$(awk '
        /^#!/ {next}
        /^#/ {next}
        /^$/ {next}
        {print NR; exit}
    ' "${script_file}")

    # If position not found, use line 1
    if [[ -z "${insert_line}" ]]; then
        insert_line=1
    fi

    # Insert logging code
    log_debug "Inserting logging code at line ${insert_line}"

    # Handle dry run
    if [[ "${DRY_RUN}" == "true" ]]; then
        log_info "[DRY RUN] Would update ${script_file} at line ${insert_line}"
        echo "[DRY RUN]"
        return 0
    fi

    # Create a backup
    cp "${script_file}" "${script_file}.bak"
    if [[ ! -f "${script_file}.bak" ]]; then
        log_error "Backup file not created: ${script_file}.bak"
    fi

    # Generate the new file with logging code
    {
        head -n "$((insert_line-1))" "${script_file}"
        echo ""
        generate_logging_code
        echo ""
        tail -n "+${insert_line}" "${script_file}"
    } > "${temp_file}"

    # Replace the original file
    mv "${temp_file}" "${script_file}"

    # Log the update
    log_info "Updated ${script_file} with standardized logging"
    echo "Updated"
}

#############################################################################
# Function: scan_directory
# Description: Scans a directory for shell scripts and updates them.
# Arguments:
#   $1 - The path to the directory.
# Output: Calls update_script_file for each script found.
###############################################################################
function scan_directory() {
    local dir="$1"

    # Debugging information
    log_debug "Scanning directory: ${dir}"

    # Find all shell scripts and update them
    find "${dir}" -type f -name "*.sh" | while read -r script_file; do
        update_script_file "${script_file}"
    done
}

#############################################################################
# Function: main
# Description: The main function of the script.
# Arguments:
#   $@ - The command-line arguments.
# Output: Orchestrates the script's execution.
###############################################################################
# Main function
function main() {
    parse_arguments "$@"

    # Initialize logging
    log_info "Starting standardized logging setup"
    # Create log directory if it doesn't exist
    log_debug "Dry Run: ${DRY_RUN}, Verbose: ${VERBOSE}"

    # Process specific script file if provided
    if [[ -n "${SCRIPT_FILE:-}" ]]; then
        update_script_file "${SCRIPT_FILE}"
    # Process all script directories
    else
        # Process all script directories
        scan_directory "${SCRIPT_DIR}/.."
    fi

    # Finalize logging setup
    log_info "Standardized logging setup complete"
}

# Execute main function
main "$@"

# Done
echo "Done."
exit 0 # Always exit 0 to not break CI/CD, errors are logged above
