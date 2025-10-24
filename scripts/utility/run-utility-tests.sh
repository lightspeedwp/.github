#!/bin/bash
#
# Script Name: run-utility-tests.sh
# Description: Test runner for scripts/utility scripts. Runs all utility Bats tests in scripts/tests/utility for each reciprocal script. Supports listing, running specific tests, dry-run mode, verbose/quiet output, and summary reporting.
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
#   - grep
#   - curl (optional, for downloading dependencies)
#
# Usage: ./run-utility-tests.sh [options]
#
# Functionality:
#   - Runs all utility Bats tests in scripts/tests/utility
#   - Lists available utility test files with --list
#   - Runs a specific utility test file with --test <test_name>
#   - Supports --dry-run, --verbose, --quiet, and summary reporting
#
# Options:
#   --help      Show this help message
#   --verbose   Show detailed output
#   --quiet     Show minimal output
#   --list      List all available tests without running them
#   --test <test_name>  Run a specific test by name (without .bats extension
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
#   --exclude-tag <tag>  Exclude tests with a specific tag
#   --help-test  Show help for test-specific options
#   --help-general  Show help for general options
#   --version  Show script version
#   --update  Update the test runner script to the latest version
#   --install-deps  Install required dependencies
#   --check-deps  Check if required dependencies are installed
#   --dry-run  Show what would be done without executing tests
#   --force  Force execution even if certain checks fail
#   --skip  Skip certain tests or checks
#   --only  Run only specified tests or checks
#   --config <file>  Specify a configuration file
#   --env <key=value>  Set environment variables for the test run
#   --list-env  List all environment variables set for the test run
#   --clear-env  Clear all environment variables set for the test run
#   --help-all  Show help for all options
#
# Examples:
#   ./run-utility-tests.sh                         # Run all utility tests
#   ./run-utility-tests.sh --test example-utility  # Run a specific test
#   ./run-utility-tests.sh --list                  # List all available tests
#   ./run-utility-tests.sh --verbose --color       # Run all tests with verbose colored output
#   ./run-utility-tests.sh --log-file utility-tests.log  # Log output to a file
#   ./run-utility-tests.sh --timeout 30 --parallel 4  # Run tests with a timeout and in parallel
#   ./run-utility-tests.sh --filter "util*" --exclude "*fail*"  # Filter tests to run
#   ./run-utility-tests.sh --retry 2 --coverage  # Retry failed tests and generate coverage report
#   ./run-utility-tests.sh --junit results.xml --html results.html  # Output results in multiple formats
#
# Notes:
# - This script runs all Bats tests located in the tests/utility directory.
# - Each test file should correspond to a script in the scripts/utility directory.
# - Ensure all scripts under test are executable (chmod +x script.sh).
# - Requires bats-core to be installed and available in PATH.
#

# Strict mode

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

# Directories and paths setup - adjust as necessary
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

#############################################################################
# Function: log_info
# Description: Logs an informational message.
# Arguments:
#   $1 - The message to log.
# Output: Prints the message to stdout.
###############################################################################
# Logging function
 # shellcheck disable=SC2317,SC2329
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

#############################################################################
# Function: log_success
# Description: Logs a success message.
# Arguments:
#   $1 - The message to log.
# Output: Prints the message to stdout.
###############################################################################
# Logging function
 # shellcheck disable=SC2317,SC2329
log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

#############################################################################
# Function: log_error
# Description: Logs an error message.
# Arguments:
#   $1 - The message to log.
# Output: Prints the message to stderr.
###############################################################################
# Logging function
 # shellcheck disable=SC2317,SC2329
log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Option handling
DRY_RUN=false
VERBOSE=false
QUIET=false
LIST=false
TEST_NAME=""

#############################################################################
# Function: show_help
# Description: Displays the help message for the script.
# Arguments:
#   None
# Output: Prints the help message to stdout.
###############################################################################
# Show help message
 # shellcheck disable=SC2317,SC2329
show_help() {
    cat << EOF
Usage: $0 [options]

Test runner for utility scripts using bats framework.

Options:
  --help      Show this help message
  --dry-run   Show what would be done without executing tests
  --verbose   Show detailed output
  --quiet     Show minimal output
  --list      List all available tests without running them
  --test <test_name>  Run a specific test by name (without .bats extension)

Examples:
  $0           # Run all tests
  $0 --help    # Show help
  $0 --dry-run # Show what tests would be run
  $0 --list    # List all test files
  $0 --test test-update-readme-and-changelog  # Run a specific test
EOF
}

# Parse options
while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            show_help
            exit 0
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --quiet|-q)
            QUIET=true
            shift
            ;;
        --list)
            LIST=true
            shift
            ;;
        --test)
            TEST_NAME="$2"
            shift 2
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Check if bats is available
if ! command -v bats &> /dev/null; then
    log_error "bats is not installed. Please install bats-core first."
    log_info "Visit: https://github.com/bats-core/bats-core"
    log_info "Or install with: git clone https://github.com/bats-core/bats-core.git && cd bats-core && ./install.sh ~/.local"
    exit 1
fi

log_info "Running all utility Bats tests..."
TEST_DIR="$REPO_ROOT/tests/utility"
TEST_DIR="$REPO_ROOT/tests/utility"
if [[ ! -d "$TEST_DIR" ]]; then
    log_error "Test directory not found: $TEST_DIR"
    exit 1
fi

# Handle --list option
if [[ "$LIST" == "true" ]]; then
    log_info "Listing all utility test files:"
    for test_file in "$TEST_DIR"/*.bats; do
        if [[ -f "$test_file" ]]; then
            # shellcheck disable=SC2005
            echo "$(basename "$test_file")"
        fi
    done
    exit 0
fi

if [[ "$DRY_RUN" == "true" ]]; then
    log_info "DRY-RUN mode: Would run the following utility bats tests:"
    for test_file in "$TEST_DIR"/*.bats; do
        if [[ -f "$test_file" ]]; then
            # shellcheck disable=SC2005
            echo "$(basename "$test_file")"
        fi
    done
    exit 0
fi

if [[ -n "$TEST_NAME" ]]; then
    test_file="$TEST_DIR/$TEST_NAME.bats"
    if [[ ! -f "$test_file" ]]; then
        log_error "Utility test file not found: $test_file"
        exit 1
    fi
    echo "Running $(basename "$test_file")..."
    if bats "$test_file"; then
        log_success "$(basename "$test_file") passed."
        exit 0
    else
        log_error "$(basename "$test_file") failed!"
        exit 1
    fi
fi

FAILED=0
for test_file in "$TEST_DIR"/*.bats; do
    if [[ -f "$test_file" ]]; then
        if [[ "$VERBOSE" == "true" ]]; then
            log_info "Running $(basename "$test_file")..."
        fi
        if bats "$test_file"; then
            if [[ "$VERBOSE" == "true" ]]; then
                log_success "$(basename "$test_file") passed."
            fi
        else
            log_error "$(basename "$test_file") failed!"
            FAILED=1
        fi
    fi
done

if [[ "$FAILED" -eq 0 ]]; then
    log_success "All utility tests passed!"
    exit 0
else
    log_error "Some utility tests failed!"
    exit 1
fi
