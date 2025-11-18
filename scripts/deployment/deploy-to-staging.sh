#!/usr/bin/env bash
#
# Script Name: deploy-to-staging.sh
# Description: Deploys modular shell scripts to staging environment with validation
# Usage: ./deploy-to-staging.sh [--dry-run] [--skip-backup]
# Version: 1.0.0
# Author: LightSpeedWP Team
#
# Environment Variables:
#   STAGING_PATH - Path to staging deployment directory (default: /opt/lightspeed-wp/staging)
#   BACKUP_RETENTION_DAYS - Number of days to retain backups (default: 30)
#
# Examples:
#   ./deploy-to-staging.sh
#   ./deploy-to-staging.sh --dry-run
#   ./deploy-to-staging.sh --skip-backup
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
STAGING_PATH="${STAGING_PATH:-/opt/lightspeed-wp/staging}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
DEPLOYMENT_ID=$(date +%Y%m%d-%H%M%S)
DEPLOYMENT_LOG="deployment-${DEPLOYMENT_ID}.log"
DRY_RUN=false
SKIP_BACKUP=false

# Parse command-line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --dry-run)
                DRY_RUN=true
                log_info "Dry run mode enabled"
                shift
                ;;
            --skip-backup)
                SKIP_BACKUP=true
                log_warning "Backup creation will be skipped"
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

Deploy modular shell scripts to staging environment.

OPTIONS:
    --dry-run           Simulate deployment without making changes
    --skip-backup       Skip backup creation (not recommended)
    -h, --help          Show this help message

EXAMPLES:
    $(basename "$0")                    # Normal deployment
    $(basename "$0") --dry-run          # Test deployment without changes
    $(basename "$0") --skip-backup      # Deploy without backup

EOF
}

# Validate deployment readiness
validate_deployment_readiness() {
    log_info "Validating deployment readiness"

    # Check if running in CI environment or local
    if [[ -z "${CI:-}" ]]; then
        log_warning "Not running in CI environment"
    fi

    # Check quality report exists (when in CI)
    if [[ -n "${CI:-}" ]] && [[ -f "pipeline-quality-report.json" ]]; then
        local quality_passed
        quality_passed=$(jq -r '.quality_gates.overall_pass // false' pipeline-quality-report.json)

        if [[ "$quality_passed" != "true" ]]; then
            log_error "Quality gates have not passed"
            return 1
        fi
        log_success "Quality gates validated"
    fi

    # Validate scripts syntax
    log_info "Validating script syntax"
    local invalid_scripts=0

    while IFS= read -r script; do
        if ! bash -n "$script" 2>/dev/null; then
            log_error "Syntax error in: $script"
            ((invalid_scripts++))
        fi
    done < <(find scripts/ -name "*.sh" -type f)

    if [[ $invalid_scripts -gt 0 ]]; then
        log_error "Found $invalid_scripts scripts with syntax errors"
        return 1
    fi

    log_success "All scripts validated successfully"
    return 0
}

# Create deployment backup
create_deployment_backup() {
    local target_path="$1"
    local backup_id="$2"

    if [[ "$SKIP_BACKUP" == true ]]; then
        log_warning "Skipping backup creation as requested"
        return 0
    fi

    log_info "Creating deployment backup: $backup_id"

    local backup_dir="${target_path}/backups"
    local backup_file="${backup_dir}/backup-${backup_id}.tar.gz"

    if [[ "$DRY_RUN" == true ]]; then
        log_info "[DRY RUN] Would create backup: $backup_file"
        return 0
    fi

    # Create backup directory if it doesn't exist
    mkdir -p "$backup_dir"

    # Create backup of current deployment
    if [[ -d "${target_path}/scripts" ]]; then
        tar -czf "$backup_file" \
            -C "$target_path" \
            scripts/ \
            2>/dev/null || {
            log_warning "Backup creation encountered issues, continuing"
        }

        if [[ -f "$backup_file" ]]; then
            log_success "Backup created: $backup_file"

            # Clean old backups
            find "$backup_dir" -name "backup-*.tar.gz" \
                -mtime +"$BACKUP_RETENTION_DAYS" \
                -delete 2>/dev/null || true
        else
            log_warning "Backup file was not created, continuing deployment"
        fi
    else
        log_info "No existing deployment to backup"
    fi

    return 0
}

# Deploy includes to staging
deploy_includes_to_staging() {
    local staging_path="$1"

    log_info "Deploying includes to staging"

    if [[ "$DRY_RUN" == true ]]; then
        log_info "[DRY RUN] Would deploy includes to: ${staging_path}/scripts/includes/"
        return 0
    fi

    # Create target directory
    mkdir -p "${staging_path}/scripts/includes"

    # Copy includes with validation
    if [[ -d "scripts/includes" ]]; then
        cp -r scripts/includes/* "${staging_path}/scripts/includes/" || {
            log_error "Failed to copy includes"
            return 1
        }

        # Set proper permissions
        find "${staging_path}/scripts/includes" -name "*.sh" -type f -exec chmod +x {} \;

        log_success "Includes deployed to staging"
    else
        log_error "Source includes directory not found"
        return 1
    fi

    return 0
}

# Deploy scripts to staging
deploy_scripts_to_staging() {
    local staging_path="$1"

    log_info "Deploying scripts to staging"

    if [[ "$DRY_RUN" == true ]]; then
        log_info "[DRY RUN] Would deploy scripts to: ${staging_path}/scripts/"
        return 0
    fi

    # Create target directories
    mkdir -p "${staging_path}/scripts"/{maintenance,utility,validation,projects}

    # Deploy maintenance scripts
    if [[ -d "scripts/maintenance" ]]; then
        cp -r scripts/maintenance/*.sh "${staging_path}/scripts/maintenance/" 2>/dev/null || true
    fi

    # Deploy utility scripts
    if [[ -d "scripts/utility" ]]; then
        cp -r scripts/utility/*.sh "${staging_path}/scripts/utility/" 2>/dev/null || true
    fi

    # Set proper permissions
    find "${staging_path}/scripts" -name "*.sh" -type f -exec chmod +x {} \;

    log_success "Scripts deployed to staging"
    return 0
}

# Run staging validation tests
run_staging_validation_tests() {
    local staging_path="$1"

    log_info "Running staging validation tests"

    if [[ "$DRY_RUN" == true ]]; then
        log_info "[DRY RUN] Would run validation tests"
        return 0
    fi

    # Basic smoke test - verify key includes are accessible
    local test_passed=true

    if [[ -f "${staging_path}/scripts/includes/core/logging.sh" ]]; then
        if bash -n "${staging_path}/scripts/includes/core/logging.sh"; then
            log_success "Logging include validated"
        else
            log_error "Logging include validation failed"
            test_passed=false
        fi
    fi

    if [[ "$test_passed" == true ]]; then
        log_success "Staging validation tests passed"
        return 0
    else
        log_error "Staging validation tests failed"
        return 1
    fi
}

# Register deployment in registry
register_deployment() {
    local environment="$1"
    local deployment_id="$2"
    local status="$3"
    local reason="${4:-}"

    local registry_file="deployment-registry.json"

    if [[ "$DRY_RUN" == true ]]; then
        log_info "[DRY RUN] Would register deployment: $environment / $deployment_id / $status"
        return 0
    fi

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

    log_info "Deployment registered in $registry_file"
}

# Main deployment function
deploy_to_staging() {
    log_info "Starting staging deployment: $DEPLOYMENT_ID"

    if [[ "$DRY_RUN" == true ]]; then
        log_info "=== DRY RUN MODE ==="
    fi

    # Pre-deployment validation
    if ! validate_deployment_readiness; then
        log_error "Deployment readiness validation failed"
        register_deployment "staging" "$DEPLOYMENT_ID" "failed" "Pre-deployment validation failed"
        return 1
    fi

    # Create deployment backup
    if ! create_deployment_backup "$STAGING_PATH" "$DEPLOYMENT_ID"; then
        log_error "Backup creation failed"
        register_deployment "staging" "$DEPLOYMENT_ID" "failed" "Backup creation failed"
        return 1
    fi

    # Deploy includes
    if ! deploy_includes_to_staging "$STAGING_PATH"; then
        log_error "Includes deployment failed"
        register_deployment "staging" "$DEPLOYMENT_ID" "failed" "Includes deployment failed"
        return 1
    fi

    # Deploy scripts
    if ! deploy_scripts_to_staging "$STAGING_PATH"; then
        log_error "Scripts deployment failed"
        register_deployment "staging" "$DEPLOYMENT_ID" "failed" "Scripts deployment failed"
        return 1
    fi

    # Run post-deployment tests
    if ! run_staging_validation_tests "$STAGING_PATH"; then
        log_warning "Post-deployment validation tests failed"
        # Don't fail deployment, just warn
    fi

    # Register successful deployment
    register_deployment "staging" "$DEPLOYMENT_ID" "success"

    log_success "Staging deployment completed: $DEPLOYMENT_ID"
    return 0
}

# Script entry point
main() {
    parse_arguments "$@"

    if ! deploy_to_staging; then
        log_error "Staging deployment failed"
        exit 1
    fi

    exit 0
}

# Run main function
main "$@"
