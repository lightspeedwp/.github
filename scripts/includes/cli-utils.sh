#!/bin/bash
# ============================================================================
# Script Name: cli-utils.sh
# Description: CLI argument parsing and help utilities for LightSpeed WP scripts
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: bash 4.0+, logging.sh, colors.sh
# Usage: source scripts/includes/cli/cli-utils.sh
# Environment Variables:
#   VERBOSE (set by parsing) - Enable verbose output
#   DRY_RUN (set by parsing) - Enable dry-run mode
#   HELP_REQUESTED (set by parsing) - Help was requested
# Options: None - this is a library file
# Examples:
#   source scripts/includes/cli/cli-utils.sh
#   parse_common_args "$@"
#   show_standard_help "script.sh" "Description" "Usage pattern" "options"
# Notes:
#   - Provides standardized argument parsing across all scripts
#   - Consistent help formatting and color support
#   - Sets global variables for common options
# ============================================================================
# Strict mode for safety
set -euo pipefail

# Source required includes
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../core/new-feature.sh"  # New feature added
# shellcheck source=../core/logging.sh
source "${SCRIPT_DIR}/../core/logging.sh"
# shellcheck source=../core/colors.sh
source "${SCRIPT_DIR}/../core/colors.sh"

# Global variables for common CLI options
VERBOSE="${VERBOSE:-false}"
DRY_RUN="${DRY_RUN:-false}"
HELP_REQUESTED="${HELP_REQUESTED:-false}"
QUIET="${QUIET:-false}"
FORCE="${FORCE:-false}"

# ============================================================================
# Function: show_standard_help
# Description: Display standardized help message with consistent formatting
# Arguments: $1 - Script name, $2 - Description, $3 - Usage pattern, $4+ - Options array
# Output: Formatted help message to stdout
# Notes: Uses colors if terminal supports them
# ============================================================================
show_standard_help() {
    local script_name="$1"
    local description="$2"
    local usage_pattern="$3"
    shift 3
    local options=("$@")

    # Header
    if check_color_support; then
        echo -e "${BOLD}${GREEN}${script_name}${NC}${BOLD} - ${description}${NC}"
        echo ""
        echo -e "${BOLD}USAGE:${NC}"
        echo -e "  ${CYAN}${usage_pattern}${NC}"
        echo ""
        echo -e "${BOLD}OPTIONS:${NC}"
    else
        echo "${script_name} - ${description}"
        echo ""
        echo "USAGE:"
        echo "  ${usage_pattern}"
        echo ""
        echo "OPTIONS:"
    fi

    # Standard options (if no custom options provided)
    if [[ ${#options[@]} -eq 0 ]]; then
        options=(
            "-h, --help              Show this help message and exit"
            "-v, --verbose           Enable verbose output"
            "-q, --quiet             Suppress non-error output"
            "-d, --dry-run           Show what would be done without executing"
            "-f, --force             Force execution without confirmation prompts"
            "--version               Show version information"
        )
    fi

    # Display options
    for option in "${options[@]}"; do
        if check_color_support; then
            # Parse option line to colorize option names
            local opt_name opt_desc
            opt_name=$(echo "$option" | cut -d' ' -f1-2)
            opt_desc=$(echo "$option" | cut -d' ' -f3-)
            echo -e "  ${YELLOW}${opt_name}${NC}  ${opt_desc}"
        else
            echo "  $option"
        fi
    done

    echo ""

    # Footer
    if check_color_support; then
        echo -e "${BOLD}EXAMPLES:${NC}"
        echo -e "  ${CYAN}${script_name} --help${NC}                   Show this help"
        echo -e "  ${CYAN}${script_name} --verbose --dry-run${NC}      Run in verbose dry-run mode"
        echo ""
        echo -e "${DIM}For more information, see the documentation or use --verbose for detailed output.${NC}"
    else
        echo "EXAMPLES:"
        echo "  ${script_name} --help                   Show this help"
        echo "  ${script_name} --verbose --dry-run      Run in verbose dry-run mode"
        echo ""
        echo "For more information, see the documentation or use --verbose for detailed output."
    fi
}

# ============================================================================
# Function: parse_common_args
# Description: Parse standard command line arguments
# Arguments: $@ - All command line arguments
# Output: Sets global variables (VERBOSE, DRY_RUN, HELP_REQUESTED, etc.)
# Notes: Modifies global state, call early in script execution
# ============================================================================
parse_common_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                HELP_REQUESTED="true"
                export HELP_REQUESTED
                shift
                ;;
            -v|--verbose)
                VERBOSE="true"
                export VERBOSE
                log_debug "Verbose mode enabled"
                shift
                ;;
            -q|--quiet)
                QUIET="true"
                export QUIET
                shift
                ;;
            -d|--dry-run)
                DRY_RUN="true"
                export DRY_RUN
                log_info "Dry-run mode enabled"
                shift
                ;;
            -f|--force)
                FORCE="true"
                export FORCE
                log_debug "Force mode enabled"
                shift
                ;;
            --version)
                show_version
                exit 0
                ;;
            --)
                # End of options
                shift
                break
                ;;
            -*)
                log_error "Unknown option: $1"
                log_error "Use --help to see available options"
                return 1
                ;;
            *)
                # Positional argument, stop parsing options
                break
                ;;
        esac
    done

    # Return remaining arguments
    return 0
}

# ============================================================================
# Function: validate_required_args
# Description: Validate that required positional arguments are provided
# Arguments: $1 - Number of required args, $2 - Actual number of args, $3+ - Argument descriptions
# Output: Error message if insufficient arguments
# Notes: Returns 0 if sufficient args, 1 otherwise
# ============================================================================
validate_required_args() {
    local required_count="$1"
    local actual_count="$2"
    shift 2
    local arg_descriptions=("$@")

    if [[ $actual_count -lt $required_count ]]; then
        log_error "Insufficient arguments provided"
        log_error "Required: $required_count, provided: $actual_count"

        if [[ ${#arg_descriptions[@]} -gt 0 ]]; then
            log_error "Expected arguments:"
            for i in $(seq 0 $((required_count - 1))); do
                if [[ $i -lt ${#arg_descriptions[@]} ]]; then
                    log_error "  $((i + 1)). ${arg_descriptions[$i]}"
                else
                    log_error "  $((i + 1)). <argument $((i + 1))>"
                fi
            done
        fi

        return 1
    fi

    return 0
}

# ============================================================================
# Function: show_version
# Description: Display version information for the script
# Arguments: None
# Output: Version information with formatting
# Notes: Looks for VERSION file or uses git information
# ============================================================================
show_version() {
    local script_name
    script_name=$(basename "${0}")
    local version="unknown"

    # Try to get version from VERSION file
    if [[ -f "VERSION" ]]; then
        version=$(cat VERSION 2>/dev/null || echo "unknown")
    elif [[ -f "../VERSION" ]]; then
        version=$(cat ../VERSION 2>/dev/null || echo "unknown")
    elif command_exists git; then
        # Try to get version from git tag
        version=$(git describe --tags --always 2>/dev/null || echo "unknown")
    fi

    if check_color_support; then
        echo -e "${BOLD}${script_name}${NC} version ${GREEN}${version}${NC}"
        echo -e "${DIM}LightSpeed WP Automation Scripts${NC}"
        echo -e "${DIM}https://lightspeedwp.agency/${NC}"
    else
        echo "${script_name} version ${version}"
        echo "LightSpeed WP Automation Scripts"
        echo "https://lightspeedwp.agency/"
    fi
}

# ============================================================================
# Function: confirm_action
# Description: Prompt user for confirmation before proceeding
# Arguments: $1 - Message to display for confirmation, $2 (optional) - Default (y/n)
# Output: User prompt and response
# Notes: Returns 0 if user confirms, 1 otherwise. Respects FORCE mode.
# ============================================================================
confirm_action() {
    local message="$1"
    local default="${2:-n}"
    local response

    # Skip confirmation in force mode
    if [[ "$FORCE" == "true" ]]; then
        log_debug "Skipping confirmation (force mode): $message"
        return 0
    fi

    # Skip confirmation in non-interactive mode
    if [[ ! -t 0 ]]; then
        log_warning "Non-interactive mode, using default ($default) for: $message"
        case "$default" in
            [yY]*) return 0 ;;
            *) return 1 ;;
        esac
    fi

    # Display confirmation prompt
    if check_color_support; then
        echo -e "${YELLOW}${message}${NC}"
        if [[ "$default" == "y" ]]; then
            echo -n "Do you want to continue? [Y/n]: "
        else
            echo -n "Do you want to continue? [y/N]: "
        fi
    else
        echo "$message"
        if [[ "$default" == "y" ]]; then
            echo -n "Do you want to continue? [Y/n]: "
        else
            echo -n "Do you want to continue? [y/N]: "
        fi
    fi

    read -r response

    # Handle empty response (use default)
    if [[ -z "$response" ]]; then
        response="$default"
    fi

    case "$response" in
        [yY][eE][sS]|[yY])
            return 0
            ;;
        *)
            log_info "Operation cancelled by user"
            return 1
            ;;
    esac
}

# ============================================================================
# Function: prompt_for_input
# Description: Prompt user for input with validation
# Arguments: $1 - Prompt message, $2 (optional) - Default value, $3 (optional) - Validation pattern
# Output: User input on stdout
# Notes: Validates input against pattern if provided
# ============================================================================
prompt_for_input() {
    local prompt="$1"
    local default="${2:-}"
    local pattern="${3:-}"
    local input

    while true; do
        if check_color_support; then
            if [[ -n "$default" ]]; then
                echo -ne "${CYAN}${prompt}${NC} [${DIM}${default}${NC}]: "
            else
                echo -ne "${CYAN}${prompt}${NC}: "
            fi
        else
            if [[ -n "$default" ]]; then
                echo -n "${prompt} [${default}]: "
            else
                echo -n "${prompt}: "
            fi
        fi

        read -r input

        # Use default if input is empty
        if [[ -z "$input" && -n "$default" ]]; then
            input="$default"
        fi

        # Validate input if pattern provided
        if [[ -n "$pattern" ]]; then
            if [[ "$input" =~ $pattern ]]; then
                echo "$input"
                return 0
            else
                log_error "Invalid input format. Please try again."
                continue
            fi
        else
            echo "$input"
            return 0
        fi
    done
}

# ============================================================================
# Function: show_progress
# Description: Display progress indicator for long-running operations
# Arguments: $1 - Current step, $2 - Total steps, $3 - Operation description
# Output: Progress bar or percentage
# Notes: Uses colors if available, simple text otherwise
# ============================================================================
show_progress() {
    local current="$1"
    local total="$2"
    local description="$3"
    local percentage
    percentage=$(( (current * 100) / total ))

    if [[ "$QUIET" == "true" ]]; then
        return 0
    fi

    if check_color_support; then
        # Create progress bar
        local bar_length=40
        local filled_length=$(( (current * bar_length) / total ))
        local bar=""

        for ((i=0; i<filled_length; i++)); do
            bar+="█"
        done

        for ((i=filled_length; i<bar_length; i++)); do
            bar+="░"
        done

        echo -ne "\r${BLUE}[${bar}]${NC} ${percentage}% - ${description}"

        if [[ $current -eq $total ]]; then
            echo -e " ${GREEN}✓${NC}"
        fi
    else
        echo "Progress: ${current}/${total} (${percentage}%) - ${description}"
    fi
}

# ============================================================================
# Function: check_dry_run
# Description: Check if script is running in dry-run mode
# Arguments: None
# Output: None
# Notes: Returns 0 if DRY_RUN=true, 1 otherwise
# ============================================================================
check_dry_run() {
    [[ "$DRY_RUN" == "true" ]]
}

# ============================================================================
# Function: execute_with_dry_run
# Description: Execute command or show what would be executed in dry-run mode
# Arguments: $* - Command to execute
# Output: Command execution or dry-run message
# Notes: Respects DRY_RUN environment variable
# ============================================================================
execute_with_dry_run() {
    if check_dry_run; then
        if check_color_support; then
            echo -e "${YELLOW}[DRY RUN]${NC} Would execute: $*"
        else
            echo "[DRY RUN] Would execute: $*"
        fi
    else
        log_debug "Executing: $*"
        "$@"
    fi
}

# End of cli-utils.sh
