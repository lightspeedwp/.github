#!/bin/bash
###############################################################################
#
# Script Name: lint-shell.sh
# Description: Shell script linting utility using ShellCheck for LightSpeed WP scripts
# Version: v1.0.0
# Date: 2025-10-21
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: GPL v3 or later
# License URI: https://www.gnu.org/licenses/gpl-3.0.html
#
# Requirements:
#   - shellcheck
#   - find
#   - bash
#
# Usage: ./lint-shell.sh [options] [directories...]
#
# Environment Variables:
#   SHELLCHECK_OPTS - Additional options to pass to shellcheck
#
# Options:
#   --help, -h          Show this help message
#   --verbose, -v       Enable verbose output
#   --fix               Attempt to fix some issues automatically (if supported)
#   --exclude=CODES     Exclude specific shellcheck codes (comma-separated)
#   --format=FORMAT     Output format (gcc, json, tty, xml)
#   --severity=LEVEL    Minimum severity level (error, warning, info, style)
#
# Examples:
#   ./lint-shell.sh                                    # Lint all scripts in scripts/ directory
#   ./lint-shell.sh scripts/deployment scripts/utility # Lint specific directories
#   ./lint-shell.sh --exclude=SC2034,SC2086            # Exclude specific checks
#   ./lint-shell.sh --format=json                      # Output in JSON format
#   ./lint-shell.sh --severity=error                   # Only show errors
#
# Notes:
#   - By default, lints all .sh files in the scripts/ directory
#   - Uses shellcheck for static analysis
#   - Returns non-zero exit code if any issues are found
#   - Supports configuration via .shellcheckrc file
#
###############################################################################

set -euo pipefail

# Default values
VERBOSE=false
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
EXCLUDE_CODES=""
FORMAT="tty"
SEVERITY="style"
FIX=false

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[0;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

#############################################################################
# Function: show_help
# Description: Display help information for the script
# Arguments: None
# Output: Help text to stdout
#############################################################################
show_help() {
    cat << 'EOF'
Shell Script Linting Utility

This script uses ShellCheck to analyze shell scripts for common issues,
portability problems, and style violations.

Usage: ./lint-shell.sh [options] [directories...]

Options:
    --help, -h          Show this help message
    --verbose, -v       Enable verbose output
    --fix               Attempt to fix some issues automatically (if supported)
    --exclude=CODES     Exclude specific shellcheck codes (comma-separated)
    --format=FORMAT     Output format (gcc, json, tty, xml)
    --severity=LEVEL    Minimum severity level (error, warning, info, style)

Examples:
    ./lint-shell.sh                                    # Lint all scripts
    ./lint-shell.sh scripts/deployment scripts/utility # Lint specific directories
    ./lint-shell.sh --exclude=SC2034,SC2086            # Exclude specific checks
    ./lint-shell.sh --format=json                      # Output in JSON format
    ./lint-shell.sh --severity=error                   # Only show errors

Environment Variables:
    SHELLCHECK_OPTS     Additional options to pass to shellcheck

Exit Codes:
    0   No issues found
    1   Issues found or script error
    2   Invalid arguments

EOF
}

#############################################################################
# Function: log_info
# Description: Log informational message
# Arguments: $* - Message to log
# Output: Formatted message to stderr
#############################################################################
log_info() {
    echo -e "${BLUE}[INFO]${NC} $*" >&2
}

#############################################################################
# Function: log_success
# Description: Log success message
# Arguments: $* - Message to log
# Output: Formatted message to stderr
#############################################################################
log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*" >&2
}

#############################################################################
# Function: log_warning
# Description: Log warning message
# Arguments: $* - Message to log
# Output: Formatted message to stderr
#############################################################################
log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $*" >&2
}

#############################################################################
# Function: log_error
# Description: Log error message
# Arguments: $* - Message to log
# Output: Formatted message to stderr
#############################################################################
log_error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

#############################################################################
# Function: find_shell_scripts
# Description: Find all shell scripts in specified directories
# Arguments: $* - Directories to search (defaults to scripts/)
# Output: List of shell script files
#############################################################################
find_shell_scripts() {
    local directories=("$@")
    local files=()
    
    # Default to scripts directory if no directories specified
    if [[ ${#directories[@]} -eq 0 ]]; then
        directories=("$REPO_ROOT/scripts")
    fi
    
    # Find all .sh files in specified directories
    for dir in "${directories[@]}"; do
        if [[ -d "$dir" ]]; then
            while IFS= read -r -d '' file; do
                files+=("$file")
            done < <(find "$dir" -type f -name "*.sh" -print0)
        else
            log_warning "Directory not found: $dir"
        fi
    done
    
    # Also find files with shell shebangs (but not .sh extension)
    for dir in "${directories[@]}"; do
        if [[ -d "$dir" ]]; then
            while IFS= read -r -d '' file; do
                if [[ ! "$file" =~ \.sh$ ]] && [[ -x "$file" ]] && head -1 "$file" 2>/dev/null | grep -q '^#!/.*sh\b'; then
                    files+=("$file")
                fi
            done < <(find "$dir" -type f -print0)
        fi
    done
    
    # Remove duplicates and print
    printf '%s\n' "${files[@]}" | sort -u
}

#############################################################################
# Function: check_shellcheck
# Description: Check if shellcheck is available
# Arguments: None
# Output: None
# Returns: 0 if available, 1 if not
#############################################################################
check_shellcheck() {
    if ! command -v shellcheck >/dev/null 2>&1; then
        log_error "shellcheck is not installed or not in PATH"
        log_info "Install shellcheck:"
        log_info "  - macOS: brew install shellcheck"
        log_info "  - Ubuntu/Debian: apt-get install shellcheck"
        log_info "  - Alpine: apk add shellcheck"
        log_info "  - From source: https://github.com/koalaman/shellcheck"
        return 1
    fi
    return 0
}

#############################################################################
# Function: run_shellcheck
# Description: Run shellcheck on specified files
# Arguments: $* - Files to check
# Output: ShellCheck results
# Returns: ShellCheck exit code
#############################################################################
run_shellcheck() {
    local files=("$@")
    local shellcheck_args=()
    
    # Add format option
    shellcheck_args+=("--format=$FORMAT")
    
    # Add severity option
    shellcheck_args+=("--severity=$SEVERITY")
    
    # Add exclude codes if specified
    if [[ -n "$EXCLUDE_CODES" ]]; then
        shellcheck_args+=("--exclude=$EXCLUDE_CODES")
    fi
    
    # Add any additional options from environment
    if [[ -n "${SHELLCHECK_OPTS:-}" ]]; then
        # shellcheck disable=SC2086
        shellcheck_args+=($SHELLCHECK_OPTS)
    fi
    
    # Run shellcheck
    if [[ "$VERBOSE" == "true" ]]; then
        log_info "Running: shellcheck ${shellcheck_args[*]} ${files[*]}"
    fi
    
    shellcheck "${shellcheck_args[@]}" "${files[@]}"
}

#############################################################################
# Function: main
# Description: Main function that orchestrates the linting process
# Arguments: $* - Command line arguments
# Output: Linting results and summary
# Returns: 0 on success, 1 on failure, 2 on invalid arguments
#############################################################################
main() {
    local directories=()
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                exit 0
                ;;
            --verbose|-v)
                VERBOSE=true
                shift
                ;;
            --fix)
                FIX=true
                log_warning "Auto-fix is not yet implemented for shellcheck"
                shift
                ;;
            --exclude=*)
                EXCLUDE_CODES="${1#*=}"
                shift
                ;;
            --format=*)
                FORMAT="${1#*=}"
                shift
                ;;
            --severity=*)
                SEVERITY="${1#*=}"
                shift
                ;;
            -*)
                log_error "Unknown option: $1"
                echo "Use --help for usage information" >&2
                exit 2
                ;;
            *)
                directories+=("$1")
                shift
                ;;
        esac
    done
    
    # Check if shellcheck is available
    if ! check_shellcheck; then
        exit 1
    fi
    
    # Find shell scripts
    log_info "Finding shell scripts..."
    local script_files=()
    
    # Use mapfile if available, otherwise use while loop
    if command -v mapfile >/dev/null 2>&1; then
        mapfile -t script_files < <(find_shell_scripts "${directories[@]+"${directories[@]}"}")
    else
        while IFS= read -r file; do
            script_files+=("$file")
        done < <(find_shell_scripts "${directories[@]+"${directories[@]}"}")
    fi
    
    if [[ ${#script_files[@]} -eq 0 ]]; then
        log_warning "No shell scripts found"
        exit 0
    fi
    
    log_info "Found ${#script_files[@]} shell script(s)"
    
    if [[ "$VERBOSE" == "true" ]]; then
        printf '  %s\n' "${script_files[@]}" >&2
    fi
    
    # Run shellcheck
    log_info "Running shellcheck analysis..."
    local exit_code=0
    
    if run_shellcheck "${script_files[@]}"; then
        log_success "All shell scripts passed linting"
    else
        exit_code=$?
        log_error "Shell script linting found issues"
    fi
    
    exit $exit_code
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi