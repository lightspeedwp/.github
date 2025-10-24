#!/bin/bash

# Frontmatter Validation Runner
#
# This script runs the frontmatter validation with proper logging and error handling.
# It ensures the logs directory exists and provides user-friendly output.

set -euo pipefail

# TODO: Implement consistent logging to /Users/ash/Studio/.github/logs/ folder
# TODO: Add log rotation and cleanup functionality
# TODO: Add email notifications for validation failures in CI/CD

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$PROJECT_ROOT/logs/validation"
VALIDATION_SCRIPT="$SCRIPT_DIR/validate-frontmatter.js"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case "$level" in
        "INFO")
            echo -e "${BLUE}[INFO]${NC} $message"
            ;;
        "WARN")
            echo -e "${YELLOW}[WARN]${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $message"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[SUCCESS]${NC} $message"
            ;;
    esac

    # Log to file
    echo "[$timestamp] $level: $message" >> "$LOG_DIR/validation-runner.log"
}

# Create log directory if it doesn't exist
create_log_dir() {
    if [[ ! -d "$LOG_DIR" ]]; then
        mkdir -p "$LOG_DIR"
        log "INFO" "Created log directory: $LOG_DIR"
    fi
}

# Check if Node.js is available
check_node() {
    if ! command -v node &> /dev/null; then
        log "ERROR" "Node.js is not installed or not in PATH"
        exit 1
    fi
}

# Check if validation script exists
check_validation_script() {
    if [[ ! -f "$VALIDATION_SCRIPT" ]]; then
        log "ERROR" "Validation script not found: $VALIDATION_SCRIPT"
        exit 1
    fi
}

# Install dependencies if needed
install_dependencies() {
    local package_json="$SCRIPT_DIR/package.json"
    local node_modules="$SCRIPT_DIR/node_modules"

    if [[ -f "$package_json" && ! -d "$node_modules" ]]; then
        log "INFO" "Installing validation dependencies..."
        cd "$SCRIPT_DIR"
        npm install
        cd - > /dev/null
        log "SUCCESS" "Dependencies installed successfully"
    fi
}

# Run the validation
run_validation() {
    log "INFO" "Starting frontmatter validation..."
    log "INFO" "Project root: $PROJECT_ROOT"
    log "INFO" "Log directory: $LOG_DIR"

    # Run the validation script with all arguments passed through
    if node "$VALIDATION_SCRIPT" "$@"; then
        log "SUCCESS" "Frontmatter validation completed successfully"
        return 0
    else
        local exit_code=$?
        log "ERROR" "Frontmatter validation failed with exit code: $exit_code"
        return $exit_code
    fi
}

# Show help
show_help() {
    echo "Frontmatter Validation Runner"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --help, -h         Show this help message"
    echo "  --schema PATH      Custom schema file path"
    echo "  --root PATH        Custom root directory"
    echo "  --output PATH      Custom output log file"
    echo "  --install-deps     Install dependencies only"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Run with default settings"
    echo "  $0 --schema ./custom-schema.json     # Use custom schema"
    echo "  $0 --root /path/to/repo              # Different root directory"
    echo "  $0 --install-deps                    # Install dependencies only"
    echo ""
    echo "Logs are written to: $LOG_DIR"
}

# Main function
main() {
    # Handle help option
    if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
        show_help
        exit 0
    fi

    # Handle install-deps option
    if [[ "${1:-}" == "--install-deps" ]]; then
        create_log_dir
        check_node
        install_dependencies
        exit 0
    fi

    # Setup
    create_log_dir
    check_node
    check_validation_script
    install_dependencies

    # Run validation
    run_validation "$@"
}

# Error handling
trap 'log "ERROR" "Script failed at line $LINENO"' ERR

# Run main function with all arguments
main "$@"
