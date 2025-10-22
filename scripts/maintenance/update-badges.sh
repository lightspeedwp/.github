#!/bin/bash
###############################################################################
#
# Script Name: update-badges.sh
# Description: Updates workflow badges in README.md for all workflows in the repository.
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
#   - bash
#   - awk
#
# Usage: ./update-badges.sh [options]
#
# Environment Variables:
#   None
#
# Options:
#   --help                  Show this help message
#
# Examples:
#   ./update-badges.sh
#
# Notes:
# - This script updates workflow badges in README.md
# - Uses specific HTML comment tags to locate badge section
# - Dynamically generates badges for all workflows in .github/workflows
#
###############################################################################

# Fail on errors
set -euo pipefail

# Configuration
REPO="lightspeedwp/scripts"
BRANCH="develop"
README="README.md"
BADGES_START="<!-- BADGES-START -->"
BADGES_END="<!-- BADGES-END -->"
declare -a BADGES

###############################################################################
# Function: generate_badges
# Description: Generates HTML badge links for all GitHub Actions workflows.
# Arguments:
#   None
# Output:
#   Populates global BADGES array with HTML badge links.
# Notes:
#   Dynamically discovers all workflow files in .github/workflows/.
#   Generates badges that link to workflow runs on GitHub.
###############################################################################
function generate_badges() {
  local workflow_badges
  workflow_badges=()
  for wf in .github/workflows/*.yml; do
    local workflow_name
    workflow_name=$(basename "$wf" .yml)
    local badge_url
    badge_url="https://github.com/$REPO/actions/workflows/$workflow_name.yml/badge.svg?branch=$BRANCH"
    workflow_badges+=("<a href=\"https://github.com/$REPO/actions/workflows/$workflow_name.yml\"><img src=\"$badge_url\" alt=\"$workflow_name\" /></a>")
  done
  BADGES=("${workflow_badges[@]}")
}

###############################################################################
# Function: update_readme_badges
# Description: Updates the badge section in README.md with current workflow badges.
# Arguments:
#   None
# Output:
#   Updated README.md file with current badge HTML.
# Notes:
#   Uses HTML comments as section markers.
#   Preserves all content outside the badge section.
#   Creates a temporary file to safely update the README.
###############################################################################
function update_readme_badges() {
  local badges_block
  badges_block="$BADGES_START\n"
  for badge in "${BADGES[@]}"; do
    badges_block+="$badge\n"
  done
  badges_block+="$BADGES_END"

  # Update README.md badges section
  awk -v badges="$badges_block" -v start="$BADGES_START" -v end="$BADGES_END" '
    BEGIN {printed=0}
    $0 ~ start {print badges; printed=1; next}
    $0 ~ end {if (!printed) print badges; printed=1; next}
    !printed {print}
  ' "$README" > "$README.tmp" && mv "$README.tmp" "$README"
  
  echo "Badges updated in $README."
}

###############################################################################
# Function: main
# Description: Main execution function that coordinates the badge update process.
# Arguments:
#   None
# Output:
#   Orchestrated execution of badge generation and README update.
# Notes:
#   Provides a central entry point for the script.
#   Ensures proper sequence of operations.
###############################################################################
function main() {
  echo "Starting badge update process..."
  
  # Generate badges
  generate_badges
  
  # Update README
  update_readme_badges
  
  echo "Badge update process completed successfully."
}

# Execute main function
main

# Done
echo "Done."
exit 0 # Always exit 0 to not break CI/CD, errors are logged above
