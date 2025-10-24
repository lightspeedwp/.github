#!/bin/bash
###############################################################################
#
# Script Name: update-readme-and-changelog.sh
# Description: Updates all README.md files in the repository to ensure they
#              contain a license badge and a link to the CONTRIBUTING.md file.
#              It also contains a stub for CHANGELOG updates.
#
# Version: v0.2.0
# Date: 2025-10-14
# Author: LightSpeedWP
# Github Contributors: @lightspeedwp / @ashleyshaw
# Author URI: https://lightspeedwp.agency/
# License: GPL v3 or later
# License URI: https://www.gnu.org/licenses/gpl-3.0.html
#
# Requirements:
#   - find
#   - grep
#   - sed
#
# Usage: ./update-readme-and-changelog.sh [options]
#
# Environment Variables:
#   None
#
# Options:
#   --help                  Show this help message
#
# Examples:
#   ./update-readme-and-changelog.sh
#
# Notes:
# - This script is intended to be executed directly.
# - It will update all README.md files in the repository.
#
###############################################################################


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
# shellcheck disable=SC2317,SC2329
function log_info() {
    local timestamp
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo -e "${GREEN}[INFO]${NC} $*" >&2
    echo "[INFO] ${timestamp}: $*" >> "${LOG_FILE}"
}

# shellcheck disable=SC2317,SC2329
function log_warn() {
    local timestamp
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo -e "${YELLOW}[WARNING]${NC} $*" >&2
    echo "[WARNING] ${timestamp}: $*" >> "${LOG_FILE}"
}

# shellcheck disable=SC2317,SC2329
# shellcheck disable=SC2317,SC2329
function log_error() {
    local timestamp
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo -e "${RED}[ERROR]${NC} $*" >&2
    echo "[ERROR] ${timestamp}: $*" >> "${LOG_FILE}"
}

# shellcheck disable=SC2317,SC2329
function log_debug() {
    if [[ "${VERBOSE}" == "true" ]]; then
        local timestamp
        timestamp=$(date "+%Y-%m-%d %H:%M:%S")
        echo -e "[DEBUG] $*" >&2
        echo "[DEBUG] ${timestamp}: $*" >> "${LOG_FILE}"
    fi
}

set -euo pipefail

###############################################################################
# Function: show_help
# Description: Displays the help message for the script.
#
# Arguments:
#   None
#
# Output:
#   Prints the help message to stdout.
###############################################################################
show_help() {
    cat << EOF
Usage: $0 [options]

Updates all README.md files to ensure they contain a license badge and a link to CONTRIBUTING.md.
Options:
  --help      Show this help message
EOF
}

###############################################################################
# Function: update_readme_files
# Description: Finds all README.md files and adds a license badge and
#              contributing link if they are missing.
#
# Arguments:
#   None
#
# Output:
#   Prints messages indicating which files are being updated.
###############################################################################
update_readme_files() {
    echo "Searching for README.md files to update..."
    find . -type f -name "README.md" | while read -r readme; do
        echo "Checking $readme..."

        # Check for license badge
        if ! grep -q "License: GPL v3 or later" "$readme"; then
            echo "  Adding license badge to $readme"
            # Add the badge after the first line (usually the main header)
            sed -i.bak '2a\
[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)\
' "$readme"
        else
            echo "  License badge already exists in $readme"
        fi

        # Check for contributing link
        if ! grep -q "CONTRIBUTING.md" "$readme"; then
            echo "  Adding contributing link to $readme"
            # Add the link at the end of the file
            echo -e "\n## Contributing\n\nPlease see [CONTRIBUTING.md](CONTRIBUTING.md) for details." >> "$readme"
        else
            echo "  Contributing link already exists in $readme"
        fi
    done
    # Cleanup backup files
    find . -name "README.md.bak" -delete
}

###############################################################################
# Function: main
# Description: Main execution function for the script.
#
# Arguments:
#   $@ - Command line arguments.
#
# Output:
#   Coordinates execution of script functions.
###############################################################################
main() {
    if [[ "${1:-}" == "--help" ]]; then
        show_help
        exit 0
    fi

    echo "Starting README and CHANGELOG update..."

    update_readme_files

    echo "README and CHANGELOG update process executed."
}

main "$@"

# Done
echo "Done."
exit 0 # Always exit 0 to not break CI/CD, errors are logged above
