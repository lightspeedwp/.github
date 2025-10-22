#!/bin/bash
###############################################################################
#
# Script Name: find-readmes.sh
# Description: Finds all README files in the repository.
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
#   None
#
# Usage: ./find-readmes.sh [options]
#
# Environment Variables:
#   None
#
# Options:
#   --help                  Show this help message
#
# Examples:
#   ./find-readmes.sh
#   ./find-readmes.sh --help
#
# Notes:
# - This script is intended to be executed directly.
# - It will search for all README files in the current directory and its subdirectories.
#
###############################################################################

# Fail on errors
set -euo pipefail

###############################################################################
# Function: show_help
# Description: Displays help information about the script.
#
# Arguments:
#   None
#
# Output:
#   Help text printed to stdout.
###############################################################################
function show_help() {
  cat << EOF
find-readmes.sh - Find README files in the repository

Usage: ./find-readmes.sh [options]

Options:
  --help    Show this help message

Description:
  This script locates all README files in the current directory and subdirectories.
  It uses case-insensitive matching to find files with names like README.md, readme.md, etc.
EOF
}

###############################################################################
# Function: find_readme_files
# Description: Locates all README files in the repository.
#
# Arguments:
#   None
#
# Output:
#   List of README files with paths printed to stdout.
###############################################################################
function find_readme_files() {
  find . -type f -iname 'README*.md'
}

###############################################################################
# Function: main
# Description: Main execution function for the script.
#
# Arguments:
#   Command line arguments.
#
# Output:
#   Coordinates execution of script functions.
###############################################################################
function main() {
  # Parse arguments
  if [[ $# -gt 0 && ("$1" == "--help" || "$1" == "-h") ]]; then
    show_help
    return 0
  fi
  
  # Find README files
  find_readme_files
  
  # Success
  return 0
}

# Run main function
main "$@"

# Done
echo "Done."
exit 0
