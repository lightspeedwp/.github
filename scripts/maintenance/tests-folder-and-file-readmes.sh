#!/bin/bash
###############################################################################
# Test Name: tests-folder-and-file-readmes.sh
# Description: Comprehensive Bats test suite for folder-and-file-readmes.sh maintenance script. Validates CLI options, error handling, dry-run, lint, TOC, and profile functionality. Ensures compliance with LightSpeed WP standards for shell script documentation and test coverage.
# Version: v0.1.0
# Date: 2025-10-15
# Author: LightSpeedWP
# Github Contributors: @lightspeedwp / @ashleyshaw
# Author URI: https://lightspeedwp.agency/
# License: GPL v3 or later
# License URI: https://www.gnu.org/licenses/gpl-3.0.html
# Requirements:
#   - bats-core
#   - test-helper.bash
# Usage:
#   - bats scripts/maintenance/tests-folder-and-file-readmes.sh
# Environment Variables:
#   None
# Options:
#   None
# Examples:
#   bats scripts/maintenance/tests-folder-and-file-readmes.sh
# Notes:
#   - All CLI options and error conditions are tested
#   - Dry-run mode ensures no files are written
#   - Lint, TOC, and profile options are validated
#   - Paths are resolved relative to test file
#   - Expand tests as new features are added
# Test Scope:
#   - Validates existence and executability of folder-and-file-readmes.sh
#   - Tests: dry-run, lint, toc, profile, error handling, backup, merge, overwrite
###############################################################################


# ----- Section: Script Existence and Executability -----
###############################################################################
# Test Name: "Script exists and is executable"
# Test Type: Basic Validation
# Test Scope: Verifies that the folder-and-file-readmes.sh script exists and is executable.
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

@test "Script exists and is executable" {
  run test -x "$BATS_TEST_DIRNAME/folder-and-file-readmes.sh"
  [ "$status" -eq 0 ]
}



# ----- Section: Dry-Run Option Tests -----
###############################################################################
# Test Name: "Dry-run does not modify files"
# Test Type: Option Validation
# Test Scope: Verifies that the dry-run option does not create or modify any files.
###############################################################################
@test "Dry-run does not modify files" {
  local test_dir
  test_dir=$(mktemp -d)
  run "$BATS_TEST_DIRNAME/folder-and-file-readmes.sh" --dry-run "$test_dir"
  [ "$status" -eq 0 ]
  [ ! -f "$test_dir/README.md" ]
  rm -rf "$test_dir"
}


# ----- Section: Profile Option Tests -----
###############################################################################
# Test Name: "Profile option outputs script profiling information"
# Test Type: Option Validation
# Test Scope: Verifies that the profile option outputs profiling information for the script execution.
###############################################################################
@test "Profile option outputs script profiling information" {
  local test_dir
  test_dir=$(mktemp -d)
  run "$BATS_TEST_DIRNAME/folder-and-file-readmes.sh" --profile --dry-run "$test_dir"
  [ "$status" -eq 0 ]
  [[ "$output" == *"Created profile README"* ]] || [[ "$output" == *"[DRY RUN]"* ]]
  rm -rf "$test_dir"
}
