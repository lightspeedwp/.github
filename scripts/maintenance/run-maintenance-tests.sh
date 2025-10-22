#!/bin/bash
###############################################################################
#
# Script Name: run-maintenance-tests.sh
# Description: Test runner for scripts/maintenance scripts. Runs all maintenance Bats tests in scripts/tests/maintenance for each reciprocal script. Supports listing, running specific tests, dry-run mode, verbose/quiet output, and summary reporting.
#
# Version: v0.1.1
# Date: 2025-10-14
# Author: LightSpeedWP
# Github Contributors: @lightspeedwp / @ashleyshaw
# Author URI: https://lightspeedwp.agency/
# License: GPL v3 or later
# License URI: https://www.gnu.org/licenses/gpl-3.0.html
#
# Requirements:
#   - bats-core
#   - bash
#   - jq (optional, for JSON output)
#   - yq (optional, for YAML output)
#
# Usage: ./run-maintenance-tests.sh [options]
#
# Environment Variables:
#   None
#
# Options:
#   --help      Show this help message
#   --verbose   Show detailed output
#   --quiet     Show minimal output
#   --list      List all available tests without running them
#   --test <test_name>  Run a specific test by name (without .bats extension)
#   --color     Enable colored output
#   --no-color  Disable colored output
#   --log-file <file>  Specify a log file to write output
#   --timeout <seconds>  Set a timeout for each test
#   --parallel <number>  Run tests in parallel (specify number of jobs)
#   --filter <pattern>  Run tests matching a specific pattern
#   --exclude <pattern>  Exclude tests matching a specific pattern
#   --retry <number>  Retry failed tests a specified number of times
#   --coverage  Generate a coverage report
#   --junit <file>  Output results in JUnit XML format to specified file
#   --tap <file>  Output results in TAP format to specified file
#   --html <file>  Output results in HTML format to specified file
#   --json <file>  Output results in JSON format to specified file
#   --summary  Show a summary of test results
#   --detailed  Show detailed output for each test
#   --list-tests  List all individual tests in the test files
#   --list-suites  List all test suites (test files)
#   --list-tags  List all tags used in tests
#   --tag <tag>  Run tests with a specific tag
#
# Examples:
#   ./run-maintenance-tests.sh
#   ./run-maintenance-tests.sh --test find-readmes
#   ./run-maintenance-tests.sh --verbose --summary
#
# Notes:
# - This script finds and runs all maintenance Bats tests
# - Tests are expected to be in the tests/maintenance directory
# - Can be used for continuous integration testing
#
###############################################################################

# Fail on errors

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

# Determine script and repo paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

###############################################################################
# Function: log_info
# Description: Logs an informational message with blue color highlighting.
#
# Arguments:
#   $1 - The message to log.
#
# Output:
#   Prints a formatted info message to stdout.
###############################################################################
# shellcheck disable=SC2317,SC2329
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

###############################################################################
# Function: log_success
# Description: Logs a success message with green color highlighting.
#
# Arguments:
#   $1 - The success message to log.
#
# Output:
#   Prints a formatted success message to stdout.
###############################################################################
# shellcheck disable=SC2317,SC2329
log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

###############################################################################
# Function: log_error
# Description: Logs an error message with red color highlighting.
#
# Arguments:
#   $1 - The error message to log.
#
# Output:
#   Prints a formatted error message to stderr.
###############################################################################
# shellcheck disable=SC2317,SC2329
log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Check if bats is available
if ! command -v bats &> /dev/null; then
    log_error "bats is not installed. Please install bats-core first."
    log_info "Visit: https://github.com/bats-core/bats-core"
    log_info "Or install with: git clone https://github.com/bats-core/bats-core.git && cd bats-core && ./install.sh ~/.local"
    exit 1
fi

###############################################################################
# Function: main
# Description: Main function that runs all maintenance tests and reports results.
#              Finds and executes all Bats test files in the maintenance test
#              directory.
#
# Arguments:
#   None
#
# Output:
#   Test execution results with appropriate formatting.
###############################################################################
main() {
    # Start running tests
    log_info "Running all maintenance Bats tests..."

    # Directory containing test files
    TEST_DIR="$REPO_ROOT/tests/maintenance"
    FAILED=0

    # Loop through each .bats file in the test directory
    for test_file in "$TEST_DIR"/*.bats; do
        log_info "Running $(basename "$test_file")..."
        if bats "$test_file"; then
            log_success "$(basename "$test_file") passed."
        else
            log_error "$(basename "$test_file") failed!"
            FAILED=1
        fi
    done

    # Final summary
    # Show the final result of the test run
    if [[ "$FAILED" -eq 0 ]]; then
        log_success "All maintenance tests passed!"
        return 0 # Success
    else
        log_error "Some maintenance tests failed!"
        return 1 # Failure
    fi
}

# Call the main function and capture its return value
main
status=$?

# Cleanup if needed
# (Add any necessary cleanup commands here)

# Done
log_info "Tests completed."
exit $status
