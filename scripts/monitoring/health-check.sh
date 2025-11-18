#!/usr/bin/env bash
#
# Script Name: health-check.sh
# Description: Post-deployment health check for modular shell scripts
# Usage: ./health-check.sh [--environment <env>] [--verbose]
# Version: 1.0.0
# Author: LightSpeedWP Team
#
# Options:
#   --environment <env>  - Target environment (staging|production)
#   --verbose           - Enable verbose output
#   --json              - Output results in JSON format
#
# Exit Codes:
#   0 - All health checks passed
#   1 - One or more health checks failed
#
# Examples:
#   ./health-check.sh
#   ./health-check.sh --environment staging --verbose
#   ./health-check.sh --json > health-report.json
#

set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Load common functions if available
if [[ -f "$PROJECT_ROOT/scripts/includes/core/logging.sh" ]]; then
    # shellcheck source=../includes/core/logging.sh
    source "$PROJECT_ROOT/scripts/includes/core/logging.sh"
else
    # Fallback logging functions
    log_info() { echo "[INFO] $*"; }
    log_success() { echo "[SUCCESS] $*"; }
    log_error() { echo "[ERROR] $*" >&2; }
    log_warning() { echo "[WARNING] $*"; }
fi

# Configuration
ENVIRONMENT="${ENVIRONMENT:-local}"
VERBOSE=false
JSON_OUTPUT=false
HEALTH_STATUS="healthy"
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNED=0

# Parse command-line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --environment)
                ENVIRONMENT="$2"
                shift 2
                ;;
            --verbose|-v)
                VERBOSE=true
                shift
                ;;
            --json)
                JSON_OUTPUT=true
                shift
                ;;
            --help|-h)
                show_usage
                exit 0
                ;;
            *)
                log_error "Unknown argument: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

show_usage() {
    cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Run health checks on deployed modular shell scripts.

OPTIONS:
    --environment <env>  Target environment (staging|production|local)
    --verbose, -v        Enable verbose output
    --json               Output results in JSON format
    -h, --help           Show this help message

EXIT CODES:
    0  All health checks passed
    1  One or more health checks failed

EXAMPLES:
    $(basename "$0")                                    # Check local environment
    $(basename "$0") --environment staging --verbose    # Verbose staging check
    $(basename "$0") --json > health-report.json       # JSON output

EOF
}

# Record check result
record_check() {
    local check_name="$1"
    local status="$2"
    local message="${3:-}"

    case "$status" in
        "pass")
            ((CHECKS_PASSED++))
            if [[ "$VERBOSE" == true ]]; then
                log_success "✅ $check_name: $message"
            fi
            ;;
        "fail")
            ((CHECKS_FAILED++))
            HEALTH_STATUS="unhealthy"
            log_error "❌ $check_name: $message"
            ;;
        "warn")
            ((CHECKS_WARNED++))
            if [[ "$HEALTH_STATUS" == "healthy" ]]; then
                HEALTH_STATUS="degraded"
            fi
            log_warning "⚠️  $check_name: $message"
            ;;
    esac
}

# Check script syntax
check_script_syntax() {
    local target_path="$1"

    [[ "$VERBOSE" == true ]] && log_info "Checking script syntax..."

    local invalid_count=0
    local total_count=0

    while IFS= read -r script; do
        ((total_count++))
        if ! bash -n "$script" 2>/dev/null; then
            ((invalid_count++))
            [[ "$VERBOSE" == true ]] && log_error "Syntax error: $script"
        fi
    done < <(find "$target_path/scripts" -name "*.sh" -type f 2>/dev/null || true)

    if [[ $total_count -eq 0 ]]; then
        record_check "Script Syntax" "warn" "No scripts found to check"
    elif [[ $invalid_count -eq 0 ]]; then
        record_check "Script Syntax" "pass" "All $total_count scripts valid"
    else
        record_check "Script Syntax" "fail" "$invalid_count/$total_count scripts have syntax errors"
    fi
}

# Check file permissions
check_file_permissions() {
    local target_path="$1"

    [[ "$VERBOSE" == true ]] && log_info "Checking file permissions..."

    local incorrect_count=0
    local total_count=0

    while IFS= read -r script; do
        ((total_count++))
        if [[ ! -x "$script" ]]; then
            ((incorrect_count++))
            [[ "$VERBOSE" == true ]] && log_warning "Not executable: $script"
        fi
    done < <(find "$target_path/scripts" -name "*.sh" -type f 2>/dev/null || true)

    if [[ $total_count -eq 0 ]]; then
        record_check "File Permissions" "warn" "No scripts found"
    elif [[ $incorrect_count -eq 0 ]]; then
        record_check "File Permissions" "pass" "All $total_count scripts executable"
    else
        record_check "File Permissions" "warn" "$incorrect_count/$total_count scripts not executable"
    fi
}

# Check required includes
check_required_includes() {
    local target_path="$1"

    [[ "$VERBOSE" == true ]] && log_info "Checking required includes..."

    local required_includes=(
        "core/logging.sh"
        "core/validation.sh"
        "core/common-functions.sh"
    )

    local missing_count=0

    for include in "${required_includes[@]}"; do
        local include_path="${target_path}/scripts/includes/${include}"
        if [[ ! -f "$include_path" ]]; then
            ((missing_count++))
            [[ "$VERBOSE" == true ]] && log_error "Missing include: $include"
        fi
    done

    if [[ $missing_count -eq 0 ]]; then
        record_check "Required Includes" "pass" "All ${#required_includes[@]} required includes present"
    else
        record_check "Required Includes" "fail" "$missing_count/${#required_includes[@]} required includes missing"
    fi
}

# Check disk space
check_disk_space() {
    local target_path="$1"

    [[ "$VERBOSE" == true ]] && log_info "Checking disk space..."

    if [[ ! -d "$target_path" ]]; then
        record_check "Disk Space" "warn" "Target path does not exist"
        return
    fi

    # Get disk usage percentage
    local usage
    usage=$(df -h "$target_path" | awk 'NR==2 {print $5}' | sed 's/%//')

    if [[ -z "$usage" ]]; then
        record_check "Disk Space" "warn" "Unable to determine disk usage"
    elif [[ $usage -lt 80 ]]; then
        record_check "Disk Space" "pass" "${usage}% used"
    elif [[ $usage -lt 90 ]]; then
        record_check "Disk Space" "warn" "${usage}% used (approaching limit)"
    else
        record_check "Disk Space" "fail" "${usage}% used (critical)"
    fi
}

# Check deployment metadata
check_deployment_metadata() {
    local target_path="$1"

    [[ "$VERBOSE" == true ]] && log_info "Checking deployment metadata..."

    # Look for deployment registry
    if [[ -f "deployment-registry.json" ]]; then
        local last_deployment
        last_deployment=$(jq -r '.deployments[-1] | "\(.environment) @ \(.timestamp)"' deployment-registry.json 2>/dev/null || echo "")

        if [[ -n "$last_deployment" ]]; then
            record_check "Deployment Metadata" "pass" "Last deployment: $last_deployment"
        else
            record_check "Deployment Metadata" "warn" "Registry exists but no deployments recorded"
        fi
    else
        record_check "Deployment Metadata" "warn" "No deployment registry found"
    fi
}

# Get target path based on environment
get_target_path() {
    case "$ENVIRONMENT" in
        "staging")
            echo "/opt/lightspeed-wp/staging"
            ;;
        "production")
            echo "/opt/lightspeed-wp/production"
            ;;
        "local"|*)
            echo "$PROJECT_ROOT"
            ;;
    esac
}

# Run all health checks
run_health_checks() {
    local target_path
    target_path=$(get_target_path)

    log_info "Running health checks for environment: $ENVIRONMENT"
    log_info "Target path: $target_path"
    echo ""

    # Run checks
    check_script_syntax "$target_path"
    check_file_permissions "$target_path"
    check_required_includes "$target_path"
    check_disk_space "$target_path"
    check_deployment_metadata "$target_path"

    echo ""
}

# Output results
output_results() {
    if [[ "$JSON_OUTPUT" == true ]]; then
        # Output JSON format
        jq -n \
            --arg status "$HEALTH_STATUS" \
            --arg environment "$ENVIRONMENT" \
            --argjson passed "$CHECKS_PASSED" \
            --argjson failed "$CHECKS_FAILED" \
            --argjson warned "$CHECKS_WARNED" \
            --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
            '{
                status: $status,
                environment: $environment,
                timestamp: $timestamp,
                checks: {
                    passed: $passed,
                    failed: $failed,
                    warned: $warned,
                    total: ($passed + $failed + $warned)
                }
            }'
    else
        # Output human-readable format
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Health Check Results"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Environment: $ENVIRONMENT"
        echo "Status: $HEALTH_STATUS"
        echo ""
        echo "Checks Passed:  $CHECKS_PASSED"
        echo "Checks Failed:  $CHECKS_FAILED"
        echo "Checks Warned:  $CHECKS_WARNED"
        echo "Total Checks:   $((CHECKS_PASSED + CHECKS_FAILED + CHECKS_WARNED))"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

        case "$HEALTH_STATUS" in
            "healthy")
                log_success "System is healthy ✅"
                ;;
            "degraded")
                log_warning "System is degraded ⚠️"
                ;;
            "unhealthy")
                log_error "System is unhealthy ❌"
                ;;
        esac
    fi
}

# Script entry point
main() {
    parse_arguments "$@"

    run_health_checks

    output_results

    # Exit with appropriate code
    if [[ "$HEALTH_STATUS" == "unhealthy" ]]; then
        exit 1
    fi

    exit 0
}

# Run main function
main "$@"
