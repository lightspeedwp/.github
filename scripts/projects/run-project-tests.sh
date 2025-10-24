#!/bin/bash

###############################################################################
#
# Script Name: run-project-tests.sh
# Description: Test runner for scripts/project scripts. Runs all project Bats tests in scripts/tests/project-scripts for each reciprocal script. Supports listing, running specific tests, dry-run mode, verbose/quiet output, and summary reporting.
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
#   - bats-core
#   - bash
#   - jq (optional, for JSON output)
#   - yq (optional, for YAML output)
#   - grep
#   - curl (optional, for downloading dependencies)
#
# Usage: ./run-project-tests.sh [options]
#
# Environment Variables:
#   None
#
# Options:
#   --help                  Show this help message
#   --verbose               Show detailed output
#   --quiet                 Show minimal output
#   --list                  List all available tests without running them
#   --test <test_name>      Run a specific test by name (without .bats extension)
#   --color                 Enable colored output
#   --no-color              Disable colored output
#   --log-file <file>       Specify a log file to write output
#   --timeout <seconds>     Set a timeout for each test
#   --parallel <number>     Run tests in parallel (specify number of jobs)
#   --filter <pattern>      Run tests matching a specific pattern
#   --exclude <pattern>     Exclude tests matching a specific pattern
#   --retry <number>        Retry failed tests a specified number of times
#   --coverage              Generate a coverage report
#   --junit <file>          Output results in JUnit XML format to specified file
#   --tap <file>            Output results in TAP format to specified file
#   --html <file>           Output results in HTML format to specified file
#   --json <file>           Output results in JSON format to specified file
#   --summary               Show a summary of test results
#   --detailed              Show detailed output for each test
#   --silent                Suppress all output except errors
#   --no-fail-fast          Continue running tests even if some fail
#   --fail-fast             Stop running tests on the first failure
#   --script <script_name>  Run tests for a specific script (without .sh extension)
#   --all                   Run all tests (default behavior)
#   --only-failed           Run only tests that failed in the last run
#   --list-scripts          List all scripts under test
#   --list-tests            List all individual tests in the test files
#   --list-suites           List all test suites (test files)
#   --list-tags             List all tags used in tests
#   --tag <tag>             Run tests with a specific tag
#   --exclude-tag <tag>     Exclude tests with a specific tag
#   --help-test             Show help for test-specific options
#   --help-general          Show help for general options
#   --version               Show script version
#   --update                Update the test runner script to the latest version
#   --install-deps          Install required dependencies
#   --check-deps            Check if required dependencies are installed
#   --dry-run               Show what would be done without executing tests
#   --force                 Force execution even if certain checks fail
#   --skip                  Skip certain tests or checks
#   --only                  Run only specified tests or checks
#   --config <file>         Specify a configuration file
#   --env <key=value>       Set environment variables for the test run
#   --list-env              List all environment variables set for the test run
#   --clear-env             Clear all environment variables set for the test run
#   --help-all              Show help for all options
#
# Examples:
#   ./run-project-tests.sh --test example-utility  # Run a specific test
#   ./run-project-tests.sh --list                  # List all available tests
#   ./run-project-tests.sh --verbose --color       # Run all tests with verbose colored output
#   ./run-project-tests.sh --log-file utility-tests.log  # Log output to a file
#   ./run-project-tests.sh --timeout 30 --parallel 4  # Run tests with a timeout and in parallel
#   ./run-project-tests.sh --filter "util*" --exclude "*fail*"  # Filter tests to run
#   ./run-project-tests.sh --retry 2 --coverage  # Retry failed tests and generate coverage report
#   ./run-project-tests.sh --junit results.xml --html results.html  # Output results in multiple formats
#
# Notes:
# - This script runs all Bats tests located in the scripts/tests/project-scripts directory.
# - Each test file should correspond to a script in the scripts/project directory.
# - Ensure all scripts under test are executable (chmod +x script.sh).
# - Requires bats-core to be installed and available in PATH.
#
###############################################################################

# Set strict mode

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

# Determine script and repo root directories
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
# Description: Logs an informational message.
# Arguments:
#   $1 - The message to log.
# Output: Prints the message to stdout.
###############################################################################
# shellcheck disable=SC2317,SC2329
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

###############################################################################
# Function: log_success
# Description: Logs a success message.
# Arguments:
#   $1 - The message to log.
# Output: Prints the message to stdout.
###############################################################################
# shellcheck disable=SC2317,SC2329
log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

###############################################################################
# Function: log_error
# Description: Logs an error message.
# Arguments:
#   $1 - The message to log.
# Output: Prints the message to stderr.
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

log_info "Running all project Bats tests..."

TEST_DIR="$REPO_ROOT/tests/project-scripts"
FAILED=0

for test_file in "$TEST_DIR"/*.bats; do
    log_info "Running $(basename "$test_file")..."
    if bats "$test_file"; then
        log_success "$(basename "$test_file") passed."
    else
        log_error "$(basename "$test_file") failed!"
        FAILED=1
    fi
done

if [[ "$FAILED" -eq 0 ]]; then
    log_success "All project tests passed!"
    exit 0
else
    log_error "Some project tests failed!"
    exit 1
fi
