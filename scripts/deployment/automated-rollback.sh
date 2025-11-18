#!/bin/bash
# Script Name: automated-rollback.sh
# Description: Automated rollback for failed deployments
# Usage: ./automated-rollback.sh <environment> [reason]
# Examples:
#   ./automated-rollback.sh staging
#   ./automated-rollback.sh staging "Failed health check"

set -euo pipefail

# Source common functions if available
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$SCRIPT_DIR/../includes/logging.sh" ]]; then
    # shellcheck source=../includes/logging.sh
    source "$SCRIPT_DIR/../includes/logging.sh"
else
    # Fallback logging functions
    log_info() { echo "[INFO] $*" >&2; }
    log_error() { echo "[ERROR] $*" >&2; }
    log_success() { echo "[SUCCESS] $*" >&2; }
    log_warning() { echo "[WARNING] $*" >&2; }
fi

# Automated rollback function
automated_rollback() {
    local environment="$1"
    local rollback_reason="${2:-Automated rollback triggered}"

    log_warning "Initiating automated rollback for $environment"
    log_info "Rollback reason: $rollback_reason"

    # Get last successful deployment
    local last_deployment
    last_deployment=$(get_last_successful_deployment "$environment")

    if [[ -z "$last_deployment" ]]; then
        log_error "No previous deployment found for rollback"
        return 1
    fi

    log_info "Rolling back to deployment: $last_deployment"

    # Execute rollback
    case "$environment" in
        "staging")
            rollback_staging_deployment "$last_deployment"
            ;;
        "production")
            rollback_production_deployment "$last_deployment"
            ;;
        *)
            log_error "Unknown environment: $environment"
            return 1
            ;;
    esac

    # Verify rollback success
    if ! verify_rollback_success "$environment" "$last_deployment"; then
        log_error "Rollback verification failed"
        return 1
    fi

    # Update deployment registry
    register_rollback "$environment" "$last_deployment" "rollback" "$rollback_reason"

    log_success "Automated rollback completed for $environment"
}

# Get last successful deployment
get_last_successful_deployment() {
    local environment="$1"
    local deployment_log="deployment-registry.json"

    if [[ ! -f "$deployment_log" ]]; then
        return 1
    fi

    if command -v jq >/dev/null 2>&1; then
        jq -r ".deployments[] |
               select(.environment == \"$environment\" and .status == \"success\") |
               .deployment_id" "$deployment_log" |
        tail -1
    fi
}

# Rollback staging deployment
rollback_staging_deployment() {
    local deployment_id="$1"
    local staging_path="${STAGING_PATH:-./staging-deploy}"
    local backup_dir="backups/staging-${deployment_id}"

    log_info "Rolling back staging deployment"

    if [[ -d "$backup_dir" ]]; then
        # Restore from backup
        rm -rf "$staging_path"
        cp -r "$backup_dir"/* "$staging_path/" || true
        log_success "Staging deployment rolled back"
        return 0
    else
        log_error "Backup not found: $backup_dir"
        return 1
    fi
}

# Rollback production deployment
rollback_production_deployment() {
    local deployment_id="$1"
    local production_path="${PRODUCTION_PATH:-./production-deploy}"
    local backup_dir="backups/production-${deployment_id}"

    log_info "Rolling back production deployment"

    if [[ -d "$backup_dir" ]]; then
        # Restore from backup
        rm -rf "$production_path"
        cp -r "$backup_dir"/* "$production_path/" || true
        log_success "Production deployment rolled back"
        return 0
    else
        log_error "Backup not found: $backup_dir"
        return 1
    fi
}

# Verify rollback success
verify_rollback_success() {
    local environment="$1"
    local deployment_id="$2"

    log_info "Verifying rollback success"

    # Basic health check
    case "$environment" in
        "staging")
            if [[ -d "${STAGING_PATH:-./staging-deploy}" ]]; then
                log_success "Staging environment health check passed"
                return 0
            fi
            ;;
        "production")
            if [[ -d "${PRODUCTION_PATH:-./production-deploy}" ]]; then
                log_success "Production environment health check passed"
                return 0
            fi
            ;;
    esac

    log_error "Health check failed after rollback"
    return 1
}

# Register rollback in deployment registry
register_rollback() {
    local environment="$1"
    local deployment_id="$2"
    local status="$3"
    local reason="$4"

    log_info "Registering rollback: $environment/$deployment_id"

    local registry_file="deployment-registry.json"

    # Create registry if it doesn't exist
    if [[ ! -f "$registry_file" ]]; then
        echo '{"deployments":[],"rollbacks":[]}' > "$registry_file"
    fi

    # Add rollback record
    if command -v jq >/dev/null 2>&1; then
        local timestamp
        timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)

        jq --arg env "$environment" \
           --arg id "$deployment_id" \
           --arg status "$status" \
           --arg ts "$timestamp" \
           --arg reason "$reason" \
           '.rollbacks += [{
               "environment": $env,
               "deployment_id": $id,
               "status": $status,
               "timestamp": $ts,
               "reason": $reason
           }]' "$registry_file" > "$registry_file.tmp" && mv "$registry_file.tmp" "$registry_file"
    fi

    log_success "Rollback registered"
}

# Main execution
main() {
    if [[ $# -lt 1 ]]; then
        log_error "Usage: $0 <environment> [reason]"
        exit 1
    fi

    local environment="$1"
    local reason="${2:-Automated rollback triggered}"

    # Ensure we're in the repository root
    if [[ ! -d "scripts" ]]; then
        log_error "Must be run from repository root"
        exit 1
    fi

    automated_rollback "$environment" "$reason"
}

# Run main if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
