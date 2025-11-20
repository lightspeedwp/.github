#!/usr/bin/env bash
#
# Script Name: automated-rollback.sh
# Description: Automated rollback system for failed deployments
# Usage: ./automated-rollback.sh <environment> [reason]
# Version: 1.0.0
# Author: LightSpeedWP Team
#
# Arguments:
#   environment - Target environment (staging|production)
#   reason      - Optional reason for rollback
#
# Examples:
#   ./automated-rollback.sh staging
#   ./automated-rollback.sh staging "Health check failed"
#   ./automated-rollback.sh production "Critical bug detected"
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

# Get last successful deployment from registry
get_last_successful_deployment() {
    local environment="$1"
    local deployment_log="deployment-registry.json"

    if [[ ! -f "$deployment_log" ]]; then
        log_error "Deployment registry not found: $deployment_log"
        return 1
    fi

    local last_deployment
    last_deployment=$(jq -r ".deployments[] |
           select(.environment == \"$environment\" and .status == \"success\") |
           .deployment_id" "$deployment_log" |
    tail -1)

    if [[ -z "$last_deployment" ]]; then
        log_error "No previous successful deployment found for $environment"
        return 1
    fi

    echo "$last_deployment"
}

# Rollback staging deployment
rollback_staging_deployment() {
    local deployment_id="$1"
    local staging_path="/opt/lightspeed-wp/staging"

    log_info "Rolling back staging to deployment: $deployment_id"

    # Check if backup exists
    local backup_file="${staging_path}/backups/backup-${deployment_id}.tar.gz"

    if [[ ! -f "$backup_file" ]]; then
        log_error "Backup not found: $backup_file"
        return 1
    fi

    # Extract backup
    log_info "Restoring from backup: $backup_file"

    tar -xzf "$backup_file" \
        -C "$staging_path" \
        2>/dev/null || {
        log_error "Failed to extract backup"
        return 1
    }

    # Set proper permissions
    find "${staging_path}/scripts" -name "*.sh" -type f -exec chmod +x {} \;

    log_success "Staging rollback completed"
    return 0
}

# Rollback production deployment
rollback_production_deployment() {
    local deployment_id="$1"
    local production_path="/opt/lightspeed-wp/production"

    log_info "Rolling back production to deployment: $deployment_id"

    # Check if backup exists
    local backup_file="${production_path}/backups/backup-${deployment_id}.tar.gz"

    if [[ ! -f "$backup_file" ]]; then
        log_error "Backup not found: $backup_file"
        return 1
    fi

    # Extract backup
    log_info "Restoring from backup: $backup_file"

    tar -xzf "$backup_file" \
        -C "$production_path" \
        2>/dev/null || {
        log_error "Failed to extract backup"
        return 1
    }

    # Set proper permissions
    find "${production_path}/scripts" -name "*.sh" -type f -exec chmod +x {} \;

    log_success "Production rollback completed"
    return 0
}

# Verify rollback success
verify_rollback_success() {
    local environment="$1"
    local deployment_id="$2"

    log_info "Verifying rollback success for $environment"

    # Basic health check - verify key files exist
    local target_path
    case "$environment" in
        "staging")
            target_path="/opt/lightspeed-wp/staging"
            ;;
        "production")
            target_path="/opt/lightspeed-wp/production"
            ;;
        *)
            log_error "Unknown environment: $environment"
            return 1
            ;;
    esac

    # Check if scripts directory exists and is not empty
    if [[ ! -d "${target_path}/scripts" ]] || [[ -z "$(ls -A "${target_path}/scripts" 2>/dev/null)" ]]; then
        log_error "Scripts directory is missing or empty"
        return 1
    fi

    # Validate script syntax
    local invalid_count=0
    while IFS= read -r script; do
        if ! bash -n "$script" 2>/dev/null; then
            log_error "Syntax error in: $script"
            ((invalid_count++))
        fi
    done < <(find "${target_path}/scripts" -name "*.sh" -type f)

    if [[ $invalid_count -gt 0 ]]; then
        log_error "Found $invalid_count scripts with syntax errors after rollback"
        return 1
    fi

    log_success "Rollback verification successful"
    return 0
}

# Register deployment (reuse from deploy script or implement inline)
register_deployment() {
    local environment="$1"
    local deployment_id="$2"
    local status="$3"
    local reason="${4:-}"

    local registry_file="deployment-registry.json"

    # Initialize registry if it doesn't exist
    if [[ ! -f "$registry_file" ]]; then
        echo '{"deployments":[]}' > "$registry_file"
    fi

    # Add deployment record
    local deployment_record
    deployment_record=$(jq -n \
        --arg env "$environment" \
        --arg id "$deployment_id" \
        --arg status "$status" \
        --arg reason "$reason" \
        --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        '{
            environment: $env,
            deployment_id: $id,
            status: $status,
            reason: $reason,
            timestamp: $timestamp
        }')

    jq ".deployments += [$deployment_record]" "$registry_file" > "${registry_file}.tmp" && \
        mv "${registry_file}.tmp" "$registry_file"

    log_info "Rollback registered in $registry_file"
}

# Main rollback function
automated_rollback() {
    local environment="$1"
    local rollback_reason="${2:-Automated rollback triggered}"

    log_warning "Initiating automated rollback for $environment"
    log_info "Rollback reason: $rollback_reason"

    # Get last successful deployment
    local last_deployment
    if ! last_deployment=$(get_last_successful_deployment "$environment"); then
        log_error "Cannot proceed with rollback - no previous deployment found"
        return 1
    fi

    log_info "Rolling back to deployment: $last_deployment"

    # Execute rollback based on environment
    case "$environment" in
        "staging")
            if ! rollback_staging_deployment "$last_deployment"; then
                log_error "Staging rollback failed"
                return 1
            fi
            ;;
        "production")
            if ! rollback_production_deployment "$last_deployment"; then
                log_error "Production rollback failed"
                return 1
            fi
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

    # Register rollback in deployment registry
    register_deployment "$environment" "$last_deployment" "rollback" "$rollback_reason"

    log_success "Automated rollback completed for $environment"
    return 0
}

# Script entry point
main() {
    if [[ $# -lt 1 ]]; then
        log_error "Usage: $0 <environment> [reason]"
        log_error "  environment: staging or production"
        log_error "  reason: optional reason for rollback"
        exit 1
    fi

    local environment="$1"
    local reason="${2:-Automated rollback triggered}"

    if ! automated_rollback "$environment" "$reason"; then
        log_error "Automated rollback failed"
        exit 1
    fi

    exit 0
}

# Run main function
main "$@"
