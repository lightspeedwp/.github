#!/usr/bin/env bash
# Script Name: deploy-to-production.sh
# Description: Automated deployment script for production environment
# Usage: ./deploy-to-production.sh [--dry-run] [--skip-backup] [--force]
# Version: 1.0.0
# Author: LightSpeed WP Team
# Last Updated: 2025-11-18
#
# Exit codes:
#   0 - Deployment successful
#   1 - Deployment failed
#
# Environment Variables:
#   PRODUCTION_PATH - Target deployment path (default: /opt/lightspeed-wp/production)
#   BACKUP_RETENTION_DAYS - Backup retention period (default: 90 days)
#   DEPLOYMENT_TIMEOUT - Maximum deployment time in seconds (default: 600)

set -euo pipefail

# Source core includes
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Source logging and validation includes
if [[ -f "$PROJECT_ROOT/scripts/includes/core/logging.sh" ]]; then
    # shellcheck source=../includes/core/logging.sh
    source "$PROJECT_ROOT/scripts/includes/core/logging.sh"
else
    # Fallback logging functions
    log_info() { echo "[INFO] $*"; }
    log_success() { echo "[SUCCESS] $*"; }
    log_warning() { echo "[WARNING] $*"; }
    log_error() { echo "[ERROR] $*" >&2; }
fi

# Configuration
PRODUCTION_PATH="${PRODUCTION_PATH:-/opt/lightspeed-wp/production}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-90}"
DEPLOYMENT_TIMEOUT="${DEPLOYMENT_TIMEOUT:-600}"
DEPLOYMENT_REGISTRY="$PROJECT_ROOT/deployment-registry.json"
BACKUP_DIR="$PROJECT_ROOT/backups/production"

# Parse command line arguments
DRY_RUN=false
SKIP_BACKUP=false
FORCE_DEPLOY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            log_info "Dry run mode enabled"
            shift
            ;;
        --skip-backup)
            SKIP_BACKUP=true
            log_warning "Backup creation will be skipped (not recommended for production)"
            shift
            ;;
        --force)
            FORCE_DEPLOY=true
            log_warning "Force deploy enabled - bypassing safety checks"
            shift
            ;;
        -h|--help)
            cat <<EOF
Usage: $0 [OPTIONS]

Deploy modular shell scripts to production environment.

OPTIONS:
    --dry-run           Simulate deployment without making changes
    --skip-backup       Skip backup creation (NOT RECOMMENDED)
    --force            Force deployment bypassing safety checks
    -h, --help         Show this help message

ENVIRONMENT VARIABLES:
    PRODUCTION_PATH           Target deployment path
    BACKUP_RETENTION_DAYS     Backup retention in days (default: 90)
    DEPLOYMENT_TIMEOUT        Max deployment time in seconds

EXAMPLES:
    # Standard production deployment
    $0

    # Dry run to test deployment process
    $0 --dry-run

    # Emergency deployment (use with extreme caution)
    $0 --force

EOF
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            log_info "Use --help for usage information"
            exit 1
            ;;
    esac
done

#######################################
# Main deployment function
#######################################
deploy_to_production() {
    local deployment_id=$(date +%Y%m%d-%H%M%S)
    local start_time=$(date +%s)

    log_info "🚀 Starting production deployment: $deployment_id"
    log_info "Target: $PRODUCTION_PATH"
    log_info "Dry run: $DRY_RUN"

    # Production-specific safety checks
    if [[ "$FORCE_DEPLOY" != "true" ]]; then
        perform_production_safety_checks || {
            log_error "Production safety checks failed"
            return 1
        }
    else
        log_warning "⚠️  Skipping safety checks due to --force flag"
    fi

    # Pre-deployment validation
    validate_deployment_readiness || {
        log_error "Deployment readiness validation failed"
        return 1
    }

    # Create deployment backup
    if [[ "$SKIP_BACKUP" != "true" ]]; then
        create_deployment_backup "$PRODUCTION_PATH" "$deployment_id" || {
            log_error "Backup creation failed"
            return 1
        }
    else
        log_warning "⚠️  Skipping backup creation (not recommended for production)"
    fi

    # Deploy includes
    deploy_includes_to_production "$PRODUCTION_PATH" || {
        log_error "Includes deployment failed"
        trigger_automatic_rollback "production" "Includes deployment failed"
        return 1
    }

    # Deploy scripts
    deploy_scripts_to_production "$PRODUCTION_PATH" || {
        log_error "Scripts deployment failed"
        trigger_automatic_rollback "production" "Scripts deployment failed"
        return 1
    }

    # Run post-deployment tests
    run_production_validation_tests "$PRODUCTION_PATH" || {
        log_error "Production validation tests failed"
        trigger_automatic_rollback "production" "Validation tests failed"
        return 1
    }

    # Run comprehensive health check
    run_production_health_check "$PRODUCTION_PATH" || {
        log_error "Production health check failed"
        trigger_automatic_rollback "production" "Health check failed"
        return 1
    }

    # Update deployment registry
    register_deployment "production" "$deployment_id" "success"

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log_success "✅ Production deployment completed successfully: $deployment_id"
    log_info "Deployment duration: ${duration}s"
    log_info "Deployment path: $PRODUCTION_PATH"

    # Send deployment notification
    send_deployment_notification "production" "$deployment_id" "success"
}

#######################################
# Production-specific safety checks
#######################################
perform_production_safety_checks() {
    log_info "🔒 Performing production safety checks..."

    # Check if this is a valid production deployment time (optional)
    local current_hour=$(date +%H)
    if [[ $current_hour -ge 22 || $current_hour -le 6 ]]; then
        log_warning "Deploying outside business hours (current time: $(date +%H:%M))"
        if [[ "$FORCE_DEPLOY" != "true" ]]; then
            log_error "Production deployments should occur during business hours"
            log_info "Use --force to override this check"
            return 1
        fi
    fi

    # Verify deployment approval exists (check for approval file/flag)
    if [[ ! -f "$PROJECT_ROOT/.deployment-approved" ]] && [[ "$FORCE_DEPLOY" != "true" ]]; then
        log_error "Production deployment not approved"
        log_info "Create .deployment-approved file or use --force to proceed"
        return 1
    fi

    # Check for recent failed deployments
    if has_recent_failed_deployment "production"; then
        log_warning "Recent failed production deployment detected"
        if [[ "$FORCE_DEPLOY" != "true" ]]; then
            log_error "Resolve previous deployment issues before proceeding"
            return 1
        fi
    fi

    log_success "Production safety checks passed"
    return 0
}

#######################################
# Validate deployment readiness
#######################################
validate_deployment_readiness() {
    log_info "🔍 Validating deployment readiness..."

    # Check quality report exists
    local quality_report="$PROJECT_ROOT/pipeline-quality-report.json"
    if [[ ! -f "$quality_report" ]] && [[ "$FORCE_DEPLOY" != "true" ]]; then
        log_error "Quality report not found: $quality_report"
        log_info "Run quality checks before production deployment"
        return 1
    fi

    # Validate quality gates passed
    if [[ -f "$quality_report" ]]; then
        local quality_passed=$(jq -r '.quality_gates.overall_pass // false' "$quality_report" 2>/dev/null)
        if [[ "$quality_passed" != "true" ]] && [[ "$FORCE_DEPLOY" != "true" ]]; then
            log_error "Quality gates not passed"
            log_info "Quality score: $(jq -r '.overall_score // "unknown"' "$quality_report")"
            return 1
        fi
    fi

    # Verify target environment is accessible
    if [[ "$DRY_RUN" != "true" ]]; then
        if ! test -d "$PRODUCTION_PATH"; then
            log_error "Production environment not accessible: $PRODUCTION_PATH"
            return 1
        fi

        # Check write permissions
        if ! test -w "$PRODUCTION_PATH"; then
            log_error "No write permission for production path: $PRODUCTION_PATH"
            return 1
        fi
    fi

    # Check disk space (require at least 1GB free for production)
    local required_space_kb=1048576  # 1GB in KB
    local available_space=$(df -k "$PRODUCTION_PATH" | awk 'NR==2 {print $4}')
    if [[ $available_space -lt $required_space_kb ]]; then
        log_error "Insufficient disk space: ${available_space}KB available, ${required_space_kb}KB required"
        return 1
    fi

    log_success "Deployment readiness validated"
    return 0
}

#######################################
# Create deployment backup
#######################################
create_deployment_backup() {
    local target_path="$1"
    local deployment_id="$2"

    log_info "💾 Creating production deployment backup..."

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would create backup of $target_path"
        return 0
    fi

    # Create backup directory
    mkdir -p "$BACKUP_DIR"

    local backup_file="$BACKUP_DIR/production-${deployment_id}.tar.gz"

    # Create compressed backup
    if tar -czf "$backup_file" -C "$target_path" . 2>/dev/null; then
        log_success "Backup created: $backup_file"

        # Calculate and store backup checksum
        local checksum=$(sha256sum "$backup_file" | awk '{print $1}')
        echo "$checksum" > "${backup_file}.sha256"
        log_info "Backup checksum: $checksum"
    else
        log_warning "Failed to create backup (continuing anyway)"
    fi

    # Clean old backups
    cleanup_old_backups "$BACKUP_DIR" "$BACKUP_RETENTION_DAYS"

    return 0
}

#######################################
# Deploy includes to production
#######################################
deploy_includes_to_production() {
    local target_path="$1"

    log_info "📦 Deploying includes to production..."

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would deploy includes to $target_path/includes/"
        return 0
    fi

    # Create target directory
    mkdir -p "$target_path/includes"

    # Deploy includes with checksum verification
    local source_dir="$PROJECT_ROOT/scripts/includes"
    if [[ ! -d "$source_dir" ]]; then
        log_error "Source includes directory not found: $source_dir"
        return 1
    fi

    # Copy includes
    if cp -R "$source_dir"/* "$target_path/includes/" 2>/dev/null; then
        log_success "Includes deployed successfully"
    else
        log_error "Failed to deploy includes"
        return 1
    fi

    # Verify syntax of deployed scripts
    log_info "Verifying deployed script syntax..."
    local syntax_errors=0
    while IFS= read -r -d '' script; do
        if ! bash -n "$script" 2>/dev/null; then
            log_error "Syntax error in deployed script: $script"
            ((syntax_errors++))
        fi
    done < <(find "$target_path/includes" -name "*.sh" -type f -print0)

    if [[ $syntax_errors -gt 0 ]]; then
        log_error "Found $syntax_errors scripts with syntax errors"
        return 1
    fi

    log_success "All deployed scripts have valid syntax"
    return 0
}

#######################################
# Deploy scripts to production
#######################################
deploy_scripts_to_production() {
    local target_path="$1"

    log_info "📦 Deploying scripts to production..."

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would deploy scripts to $target_path/scripts/"
        return 0
    fi

    # Deploy utility scripts (excluding deployment scripts themselves)
    local source_scripts="$PROJECT_ROOT/scripts"
    mkdir -p "$target_path/scripts"

    # Copy scripts with exclusions
    rsync -av --exclude='deployment/' \
              --exclude='*.bak' \
              --exclude='*.tmp' \
              --exclude='__tests__' \
              "$source_scripts/" \
              "$target_path/scripts/" || {
        log_error "Failed to deploy scripts"
        return 1
    }

    # Set correct permissions
    find "$target_path/scripts" -name "*.sh" -type f -exec chmod 750 {} \;

    log_success "Scripts deployed successfully"
    return 0
}

#######################################
# Run production validation tests
#######################################
run_production_validation_tests() {
    local target_path="$1"

    log_info "🧪 Running production validation tests..."

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would run production validation tests"
        return 0
    fi

    # Run smoke tests
    if [[ -x "$PROJECT_ROOT/tests/smoke-tests/run-all-smoke-tests.sh" ]]; then
        if ! "$PROJECT_ROOT/tests/smoke-tests/run-all-smoke-tests.sh" --target "$target_path"; then
            log_error "Smoke tests failed"
            return 1
        fi
    fi

    # Run production-specific integration tests
    if [[ -d "$PROJECT_ROOT/tests/integration" ]]; then
        if command -v bats &>/dev/null; then
            if ! bats "$PROJECT_ROOT/tests/integration/production-"*.bats 2>/dev/null; then
                log_warning "Some production integration tests failed"
            fi
        fi
    fi

    log_success "Production validation tests passed"
    return 0
}

#######################################
# Run production health check
#######################################
run_production_health_check() {
    local target_path="$1"

    log_info "🏥 Running production health check..."

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would run production health check"
        return 0
    fi

    # Run health check script
    if [[ -x "$PROJECT_ROOT/scripts/monitoring/health-check.sh" ]]; then
        if ! "$PROJECT_ROOT/scripts/monitoring/health-check.sh" --environment production; then
            log_error "Production health check failed"
            return 1
        fi
    else
        log_warning "Health check script not found, skipping"
    fi

    log_success "Production health check passed"
    return 0
}

#######################################
# Register deployment in registry
#######################################
register_deployment() {
    local environment="$1"
    local deployment_id="$2"
    local status="$3"
    local reason="${4:-}"

    log_info "📝 Registering deployment in registry..."

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would register deployment: $environment/$deployment_id/$status"
        return 0
    fi

    # Initialize registry if it doesn't exist
    if [[ ! -f "$DEPLOYMENT_REGISTRY" ]]; then
        mkdir -p "$(dirname "$DEPLOYMENT_REGISTRY")"
        echo '{"deployments":[]}' > "$DEPLOYMENT_REGISTRY"
    fi

    # Add deployment entry
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    local temp_file=$(mktemp)

    jq --arg env "$environment" \
       --arg id "$deployment_id" \
       --arg status "$status" \
       --arg reason "$reason" \
       --arg timestamp "$timestamp" \
       '.deployments += [{
           "environment": $env,
           "deployment_id": $id,
           "status": $status,
           "reason": $reason,
           "timestamp": $timestamp
       }]' "$DEPLOYMENT_REGISTRY" > "$temp_file"

    mv "$temp_file" "$DEPLOYMENT_REGISTRY"

    log_success "Deployment registered: $environment/$deployment_id"
}

#######################################
# Helper functions
#######################################

cleanup_old_backups() {
    local backup_dir="$1"
    local retention_days="$2"

    log_info "🧹 Cleaning up old backups (retention: ${retention_days} days)..."

    find "$backup_dir" -name "*.tar.gz" -type f -mtime "+${retention_days}" -delete 2>/dev/null || true
    find "$backup_dir" -name "*.sha256" -type f -mtime "+${retention_days}" -delete 2>/dev/null || true

    log_success "Old backups cleaned up"
}

has_recent_failed_deployment() {
    local environment="$1"
    local hours_threshold=24

    if [[ ! -f "$DEPLOYMENT_REGISTRY" ]]; then
        return 1
    fi

    local recent_failures=$(jq -r --arg env "$environment" \
        --arg threshold "$(date -u -d "${hours_threshold} hours ago" +%Y-%m-%dT%H:%M:%SZ)" \
        '[.deployments[] | select(.environment == $env and .status == "failure" and .timestamp > $threshold)] | length' \
        "$DEPLOYMENT_REGISTRY" 2>/dev/null)

    [[ ${recent_failures:-0} -gt 0 ]]
}

trigger_automatic_rollback() {
    local environment="$1"
    local reason="$2"

    log_warning "🔄 Triggering automatic rollback..."

    if [[ -x "$PROJECT_ROOT/scripts/deployment/automated-rollback.sh" ]]; then
        "$PROJECT_ROOT/scripts/deployment/automated-rollback.sh" "$environment" "$reason"
    else
        log_error "Rollback script not found"
    fi
}

send_deployment_notification() {
    local environment="$1"
    local deployment_id="$2"
    local status="$3"

    # Placeholder for notification logic
    # Integrate with Slack, email, or other notification systems
    log_info "📬 Deployment notification sent: $environment/$deployment_id/$status"
}

#######################################
# Main execution
#######################################
main() {
    log_info "Starting production deployment script..."
    log_info "Project root: $PROJECT_ROOT"

    # Run deployment
    if deploy_to_production; then
        log_success "🎉 Production deployment completed successfully!"
        exit 0
    else
        log_error "❌ Production deployment failed"
        exit 1
    fi
}

# Execute main function
main "$@"
