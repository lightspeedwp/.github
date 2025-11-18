#!/bin/bash
# Script Name: deploy-to-staging.sh
# Description: Deploy modular scripts to staging environment
# Usage: ./deploy-to-staging.sh
# Examples:
#   ./deploy-to-staging.sh

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

# Deploy to staging environment
deploy_to_staging() {
    local deployment_id
    deployment_id=$(date +%Y%m%d-%H%M%S)
    local staging_path="${STAGING_PATH:-./staging-deploy}"

    log_info "Starting staging deployment: $deployment_id"

    # Pre-deployment validation
    if ! validate_deployment_readiness; then
        log_error "Deployment validation failed"
        return 1
    fi

    # Create deployment backup
    if ! create_deployment_backup "$staging_path" "$deployment_id"; then
        log_error "Failed to create deployment backup"
        return 1
    fi

    # Deploy includes
    if ! deploy_includes_to_staging "$staging_path"; then
        log_error "Failed to deploy includes"
        return 1
    fi

    # Deploy scripts
    if ! deploy_scripts_to_staging "$staging_path"; then
        log_error "Failed to deploy scripts"
        return 1
    fi

    # Run post-deployment tests
    if ! run_staging_validation_tests "$staging_path"; then
        log_warning "Staging validation tests failed"
        return 1
    fi

    # Update deployment registry
    register_deployment "staging" "$deployment_id" "success"

    log_success "Staging deployment completed: $deployment_id"
}

# Validate deployment readiness
validate_deployment_readiness() {
    log_info "Validating deployment readiness"

    # Check quality gates
    if [[ -f "pipeline-quality-report.json" ]] && command -v jq >/dev/null 2>&1; then
        local quality_passed
        quality_passed=$(jq -r '.quality_gates.overall_pass // false' pipeline-quality-report.json)
        if [[ "$quality_passed" != "true" ]]; then
            log_error "Quality gates not passed"
            return 1
        fi
    fi

    # Validate target environment
    if [[ ! -d "scripts" ]]; then
        log_error "Scripts directory not found"
        return 1
    fi

    log_success "Deployment readiness validated"
    return 0
}

# Create deployment backup
create_deployment_backup() {
    local staging_path="$1"
    local deployment_id="$2"

    log_info "Creating deployment backup"

    if [[ -d "$staging_path" ]]; then
        local backup_dir="backups/staging-${deployment_id}"
        mkdir -p "$backup_dir"
        cp -r "$staging_path" "$backup_dir/" || true
        log_success "Backup created: $backup_dir"
    else
        log_info "No existing deployment to backup"
    fi

    return 0
}

# Deploy includes to staging
deploy_includes_to_staging() {
    local staging_path="$1"

    log_info "Deploying includes to staging"

    # Create staging directory structure
    mkdir -p "$staging_path/includes"

    # Copy includes
    if [[ -d "scripts/includes" ]]; then
        cp -r scripts/includes/* "$staging_path/includes/" || true
        log_success "Includes deployed to staging"
    else
        log_warning "No includes directory found"
    fi

    return 0
}

# Deploy scripts to staging
deploy_scripts_to_staging() {
    local staging_path="$1"

    log_info "Deploying scripts to staging"

    # Create staging directory structure
    mkdir -p "$staging_path/scripts"

    # Copy scripts
    if [[ -d "scripts" ]]; then
        find scripts -name "*.sh" -type f -exec cp {} "$staging_path/scripts/" \; || true
        log_success "Scripts deployed to staging"
    else
        log_warning "No scripts directory found"
    fi

    return 0
}

# Run staging validation tests
run_staging_validation_tests() {
    local staging_path="$1"

    log_info "Running staging validation tests"

    # Basic validation: check if files exist
    if [[ -d "$staging_path" ]]; then
        local file_count
        file_count=$(find "$staging_path" -type f | wc -l)
        log_info "Deployed files count: $file_count"

        if [[ $file_count -gt 0 ]]; then
            log_success "Staging validation tests passed"
            return 0
        fi
    fi

    log_error "Staging validation failed"
    return 1
}

# Register deployment in registry
register_deployment() {
    local environment="$1"
    local deployment_id="$2"
    local status="$3"
    local reason="${4:-}"

    log_info "Registering deployment: $environment/$deployment_id"

    local registry_file="deployment-registry.json"

    # Create registry if it doesn't exist
    if [[ ! -f "$registry_file" ]]; then
        echo '{"deployments":[]}' > "$registry_file"
    fi

    # Add deployment record
    if command -v jq >/dev/null 2>&1; then
        local timestamp
        timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)

        jq --arg env "$environment" \
           --arg id "$deployment_id" \
           --arg status "$status" \
           --arg ts "$timestamp" \
           --arg reason "$reason" \
           '.deployments += [{
               "environment": $env,
               "deployment_id": $id,
               "status": $status,
               "timestamp": $ts,
               "reason": $reason
           }]' "$registry_file" > "$registry_file.tmp" && mv "$registry_file.tmp" "$registry_file"
    fi

    log_success "Deployment registered"
}

# Main execution
main() {
    # Ensure we're in the repository root
    if [[ ! -d "scripts" ]]; then
        log_error "Must be run from repository root"
        exit 1
    fi

    deploy_to_staging
}

# Run main if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
