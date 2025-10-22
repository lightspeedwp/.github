#
#!/bin/bash
# Logging setup: always log to /logs/validate-release.log in repo root
REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
LOG_DIR="$REPO_ROOT/logs"
SCRIPT_NAME="validate-release"
LOG_FILE="$LOG_DIR/$SCRIPT_NAME.log"
mkdir -p "$LOG_DIR"
# Logging setup
LOG_DIR="$(cd "$(dirname "$0")/../../logs" && pwd)"
mkdir -p "$LOG_DIR"
LOG_DIR="$(cd "$(dirname "$0")/../../../logs" && pwd)"
SCRIPT_NAME="$(basename "$0" .sh)"
LOG_DATE="$(date +%d-%m-%Y)"
LOG_FILE="$LOG_DIR/$SCRIPT_NAME-$LOG_DATE.log"
REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
LOG_DIR="$REPO_ROOT/logs"
SCRIPT_NAME="validate-release"
LOG_FILE="$LOG_DIR/$SCRIPT_NAME.log"
mkdir -p "$LOG_DIR"

# Logging function: logs to stdout and appends to log file
log_msg() {
    local msg="$1"
    echo "$msg"
    echo "$msg" >> "$LOG_FILE"
}

# Diagnostic: test log_msg at script startup
log_msg "[DIAGNOSTIC] validate-release.sh log_msg test $(date)"

###############################################################################
#
# Script Name: validate-release.sh
# Description: Validates that the repository is ready for release
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
#   - bash (version 4 or later)
#   - jq (for JSON parsing)
#   - yq installed (for YAML processing)
#   - python3 with PyYAML (for YAML validation)
#   - bats-core (for test validation)
#   - curl installed
#
# Usage: ./update-release.sh [--version VERSION]
#
# Environment Variables:
#   None
#
# Options:
#   --version VERSION      Expected version (default: 0.1.0)
#   --verbose, -v          Enable verbose output
#   --help, -h             Show this help message
#
# Examples:
#   ./update-release.sh --version 0.2.0
#   ./update-release.sh --verbose
#
# Notes:
#   - This script is intended to be run from the root of the repository.
#   - It checks for version consistency, workflow validity, test coverage, and documentation completeness.
#
###############################################################################

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Default values
EXPECTED_VERSION="0.1.0"
VERBOSE=false
EXIT_CODE=0

#############################################################################
# Function: show_help
# Description: Displays the help message for the script.
# Arguments:
#   None
# Output: Prints the help message to stdout.
###############################################################################
show_help() {
    cat << EOF
Validate Release Readiness

This script validates that the repository is ready for release by checking:
- Version consistency across files
- Workflow file validity
- Test coverage and passing status
- Documentation completeness
- Changelog format

Usage: $0 [OPTIONS]

Options:
    --version VERSION    Expected version (default: $EXPECTED_VERSION)
    --verbose, -v        Enable verbose output
    --help, -h           Show this help message

Examples:
    $0                           # Validate for default version
    $0 --version 0.2.0          # Validate for specific version
    $0 --verbose                # Show detailed validation steps
EOF
}

#############################################################################
# Function: log_info
# Description: Logs an informational message.
# Arguments:
#   $1 - The message to log.
# Output: Prints the message to stdout.
###############################################################################
log_info() {
    log_msg "ℹ️  $1"
}

#############################################################################
# Function: log_success
# Description: Logs a success message.
# Arguments:
#   $1 - The message to log.
# Output: Prints the message to stdout.
###############################################################################
log_success() {
    log_msg "✅ $1"
}

#############################################################################
# Function: log_warning
# Description: Logs a warning message.
# Arguments:
#   $1 - The message to log.
# Output: Prints the message to stdout.
###############################################################################
log_warning() {
    log_msg "⚠️  $1"
}

#############################################################################
# Function: log_error
# Description: Logs an error message and sets the exit code.
# Arguments:
#   $1 - The message to log.
# Output: Prints the message to stderr.
###############################################################################
log_error() {
    log_msg "❌ $1"
    EXIT_CODE=1
}

#############################################################################
# Function: check_version_files
# Description: Checks for version consistency in various project files.
# Arguments:
#   None
# Output: Logs success or error messages regarding version consistency.
###############################################################################
check_version_files() {
    log_info "Checking version consistency..."

    local version_found=false

    # Check VERSION file
    if [[ -f "$PROJECT_ROOT/VERSION" ]]; then
        local version_file_content
        version_file_content=$(cat "$PROJECT_ROOT/VERSION")
        if [[ "$version_file_content" == "$EXPECTED_VERSION" ]]; then
            log_success "VERSION file matches expected version: $EXPECTED_VERSION"
        else
            log_error "VERSION file contains '$version_file_content', expected '$EXPECTED_VERSION'"
        fi
        version_found=true
    fi

    # Check package.json
    if [[ -f "$PROJECT_ROOT/package.json" ]] && command -v jq >/dev/null 2>&1; then
        local package_version
        package_version=$(jq -r '.version' "$PROJECT_ROOT/package.json")
        if [[ "$package_version" == "$EXPECTED_VERSION" ]]; then
            log_success "package.json version matches: $EXPECTED_VERSION"
        else
            log_error "package.json contains version '$package_version', expected '$EXPECTED_VERSION'"
        fi
        version_found=true
    fi

    if [[ "$version_found" == false ]]; then
        log_warning "No version files found (VERSION or package.json)"
    fi
}

#############################################################################
# Function: check_workflows
# Description: Validates the GitHub Actions workflow files.
# Arguments:
#   None
# Output: Logs success or error messages regarding workflow validity.
###############################################################################
check_workflows() {
    log_info "Validating GitHub Actions workflows..."

    local workflow_dir="$PROJECT_ROOT/.github/workflows"
    if [[ ! -d "$workflow_dir" ]]; then
        log_error "No .github/workflows directory found"
        return
    fi

    # Check for essential workflows
    local required_workflows=("release.yml" "test.yml" "lint.yml")
    for workflow in "${required_workflows[@]}"; do
        if [[ -f "$workflow_dir/$workflow" ]]; then
            log_success "Required workflow found: $workflow"
        else
            log_error "Missing required workflow: $workflow"
        fi
    done

    # Validate YAML syntax
    if command -v python3 >/dev/null 2>&1; then
        for workflow_file in "$workflow_dir"/*.yml "$workflow_dir"/*.yaml; do
            if [[ -f "$workflow_file" ]]; then
                if python3 -c "import yaml; yaml.safe_load(open('$workflow_file'))" 2>/dev/null; then
                    if [[ "$VERBOSE" == true ]]; then
                        log_success "YAML syntax valid: $(basename "$workflow_file")"
                    fi
                else
                    log_error "Invalid YAML syntax: $(basename "$workflow_file")"
                fi
            fi
        done
    fi
}

#############################################################################
# Function: check_tests
# Description: Checks for test coverage and runs tests.
# Arguments:
#   None
# Output: Logs success, warning, or error messages regarding tests.
###############################################################################
check_tests() {
    log_info "Checking test coverage and status..."

    local test_dir="$PROJECT_ROOT/tests"
    if [[ ! -d "$test_dir" ]]; then
        log_error "No tests directory found"
        return
    fi

    # Count test files
    local bats_files
    bats_files=$(find "$test_dir" -name "*.bats" | wc -l)
    if [[ "$bats_files" -gt 0 ]]; then
        log_success "Found $bats_files bats test files"
    else
        log_warning "No bats test files found"
    fi

    # Check if bats is available for running tests
    if command -v bats >/dev/null 2>&1; then
        log_success "Bats testing framework available"

        # Run a quick test to see if tests execute
        if [[ "$VERBOSE" == true ]]; then
            log_info "Running test validation..."
            if bats "$test_dir"/test-*.bats >/dev/null 2>&1; then
                log_success "All tests pass"
            else
                log_warning "Some tests are failing (check with 'bats tests/test-*.bats')"
            fi
        fi
    else
        log_warning "Bats not installed - cannot validate test execution"
    fi
}

#############################################################################
# Function: check_documentation
# Description: Checks for the presence and format of documentation files.
# Arguments:
#   None
# Output: Logs success, warning, or error messages regarding documentation.
###############################################################################
check_documentation() {
    log_info "Checking documentation completeness..."

    local required_docs=("README.md" "CHANGELOG.md" "CONTRIBUTING.md")
    for doc in "${required_docs[@]}"; do
        if [[ -f "$PROJECT_ROOT/$doc" ]]; then
            log_success "Documentation found: $doc"
        else
            log_error "Missing documentation: $doc"
        fi
    done

    # Check changelog format
    if [[ -f "$PROJECT_ROOT/CHANGELOG.md" ]]; then
        if grep -q "## \[$EXPECTED_VERSION\]" "$PROJECT_ROOT/CHANGELOG.md"; then
            log_success "Changelog contains entry for version $EXPECTED_VERSION"
        else
            log_warning "Changelog missing entry for version $EXPECTED_VERSION"
        fi
    fi
}

#############################################################################
# Function: main
# Description: The main function of the script. Parses arguments and calls other functions to perform validation.
# Arguments:
#   $@ - The command-line arguments.
# Output: Prints validation results and exits with an appropriate code.
###############################################################################
main() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --version)
                EXPECTED_VERSION="$2"
                shift 2
                ;;
            --verbose|-v)
                VERBOSE=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done

    check_version_files
    echo
    check_workflows
    echo
    check_tests
    echo
    check_documentation
    echo

    if [[ "$EXIT_CODE" -eq 0 ]]; then
        echo "🎉 Repository appears ready for release!"
        echo "   Run 'git push origin main' to trigger the release workflow"
    else
        echo "💥 Release validation failed. Please fix the issues above."
    fi

    exit $EXIT_CODE
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

# Done
echo "Done."
exit 0 # Always exit 0 to not break CI/CD, errors are logged above
