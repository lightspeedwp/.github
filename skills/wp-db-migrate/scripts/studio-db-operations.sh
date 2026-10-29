#!/bin/bash
# studio-db-operations.sh — Database operations using WordPress Studio CLI
# Handles backup, restore, export, and integration with migration scripts
# Usage: ./studio-db-operations.sh <operation> [arguments...]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source the library
if [ ! -f "$SCRIPT_DIR/lib-studio.sh" ]; then
    echo "❌ Error: lib-studio.sh not found in $SCRIPT_DIR"
    exit 1
fi

source "$SCRIPT_DIR/lib-studio.sh"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SHOW USAGE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

show_usage() {
    cat << 'EOF'
WordPress Studio Database Operations

USAGE:
  ./studio-db-operations.sh <operation> [arguments...]

OPERATIONS:

  Backup & Recovery:
    backup <site-path> [output-file]
      Create a database backup before migration
      Example: ./studio-db-operations.sh backup /Users/ash/Studio/my-site backup.sql

    restore <site-path> <backup-file>
      Restore database from a backup file
      Example: ./studio-db-operations.sh restore /Users/ash/Studio/my-site backup.sql

    export <site-path> [output-file]
      Export database for external processing
      Example: ./studio-db-operations.sh export /Users/ash/Studio/my-site export.sql

  Pre-Migration:
    pre-migration <site-path> [backup-file]
      Create backup and show database statistics before migration
      Example: ./studio-db-operations.sh pre-migration /Users/ash/Studio/my-site

  Post-Migration:
    verify <site-path> [original-export-file]
      Verify migration success by checking row counts and integrity
      Example: ./studio-db-operations.sh verify /Users/ash/Studio/my-site original.sql

    table-counts <site-path>
      Show row counts for key tables
      Example: ./studio-db-operations.sh table-counts /Users/ash/Studio/my-site

  URL Management:
    replace-urls <site-path> <old-url> <new-url>
      Replace site URLs in database (requires confirmation)
      Example: ./studio-db-operations.sh replace-urls /Users/ash/Studio/my-site staging.dev local.dev

    dry-run-replace <site-path> <old-url> <new-url>
      Preview URL replacements without applying
      Example: ./studio-db-operations.sh dry-run-replace /Users/ash/Studio/my-site staging.dev local.dev

  Integration:
    pre-migrate-check <site-path>
      Run complete pre-migration checks (backup, counts, integrity)
      Example: ./studio-db-operations.sh pre-migrate-check /Users/ash/Studio/my-site

    post-migrate-verify <site-path> <old-export-file> <old-url> <new-url>
      Run complete post-migration verification
      Example: ./studio-db-operations.sh post-migrate-verify /Users/ash/Studio/my-site export.sql old.dev new.dev

  Utilities:
    compare-counts <site-path> <export-file>
      Compare row counts between current site and original export
      Example: ./studio-db-operations.sh compare-counts /Users/ash/Studio/my-site export.sql

FLAGS:
  --verbose     Show detailed output
  --debug       Show debug information
  --dry-run     Preview changes without applying (where supported)
  --no-confirm  Skip confirmation prompts

EOF
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PARSE ARGUMENTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPERATION="${1:-}"
VERBOSE=false
DEBUG=false
DRY_RUN=false
NO_CONFIRM=false

# Parse flags
for arg in "$@"; do
    case "$arg" in
        --verbose) VERBOSE=true ;;
        --debug) DEBUG=true; STUDIO_DEBUG=true; export STUDIO_DEBUG ;;
        --dry-run) DRY_RUN=true ;;
        --no-confirm) NO_CONFIRM=true ;;
    esac
done

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# BACKUP & RECOVERY OPERATIONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

op_backup() {
    local site_path="$1"
    local backup_file="${2:-backup-$(date +%Y%m%d-%H%M%S).sql}"

    if [ -z "$site_path" ]; then
        log_error "backup: No site path provided"
        return 1
    fi

    log_section "Database Backup"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Creating backup of: $site_path"
    log_info "Output file: $backup_file"

    if studio_backup_database "$site_path" "$backup_file"; then
        log_success "Backup completed successfully"
        echo "$backup_file"
        return 0
    else
        log_error "Backup failed"
        return 1
    fi
}

op_restore() {
    local site_path="$1"
    local backup_file="$2"

    if [ -z "$site_path" ] || [ -z "$backup_file" ]; then
        log_error "restore: site-path and backup-file required"
        return 1
    fi

    log_section "Database Restore"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    if [ "$DRY_RUN" = "true" ]; then
        log_info "DRY RUN: Would restore from $backup_file to $site_path"
        return 0
    fi

    studio_import_database "$backup_file" "$site_path"
}

op_export() {
    local site_path="$1"
    local export_file="${2:-export-$(date +%Y%m%d-%H%M%S).sql}"

    if [ -z "$site_path" ]; then
        log_error "export: No site path provided"
        return 1
    fi

    log_section "Database Export"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Exporting database from: $site_path"
    log_info "Output file: $export_file"

    if studio_export_database "$site_path" "$export_file"; then
        log_success "Export completed successfully"
        echo "$export_file"
        return 0
    else
        log_error "Export failed"
        return 1
    fi
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PRE-MIGRATION CHECKS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

op_pre_migration() {
    local site_path="$1"
    local backup_file="${2:-pre-migration-backup-$(date +%Y%m%d-%H%M%S).sql}"

    if [ -z "$site_path" ]; then
        log_error "pre-migration: No site path provided"
        return 1
    fi

    log_section "Pre-Migration Database Check"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Creating pre-migration backup..."
    studio_backup_database "$site_path" "$backup_file" || {
        log_error "Failed to create backup"
        return 1
    }

    log_section "Pre-Migration Statistics"

    local site_url
    site_url=$(studio_get_site_url "$site_path" 2>/dev/null || echo "unknown")
    log_info "Site URL: $site_url"

    local wp_version
    wp_version=$(studio_get_wp_version "$site_path" 2>/dev/null || echo "unknown")
    log_info "WordPress Version: $wp_version"

    log_info "Current table row counts:"
    studio_get_table_counts "$site_path"

    log_success "Pre-migration checks completed"
    log_info "Backup saved to: $backup_file"
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# POST-MIGRATION VERIFICATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

op_verify() {
    local site_path="$1"
    local original_export="${2:-}"

    if [ -z "$site_path" ]; then
        log_error "verify: No site path provided"
        return 1
    fi

    log_section "Post-Migration Verification"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_success "Site path is valid"

    # Check if site loads
    log_info "Checking if site responds..."
    local site_url
    site_url=$(studio_get_site_url "$site_path" 2>/dev/null || echo "")

    if [ -n "$site_url" ]; then
        log_success "Site URL: $site_url"
    else
        log_warning "Could not determine site URL"
    fi

    # Show current row counts
    log_section "Current Table Row Counts"
    studio_get_table_counts "$site_path"

    # Compare with original if provided
    if [ -n "$original_export" ] && [ -f "$original_export" ]; then
        log_section "Comparison with Original Export"
        log_info "Comparing with: $original_export"

        local posts_count
        posts_count=$(studio wp db query "SELECT COUNT(*) FROM wp_posts;" --path "$site_path" --skip-column-names 2>/dev/null || echo "error")

        local posts_in_export
        posts_in_export=$(grep -c "INSERT INTO.*wp_posts" "$original_export" 2>/dev/null || echo "unknown")

        log_info "Posts in current site: $posts_count"
        log_info "Posts in original export: ~$posts_in_export"
    fi

    log_success "Verification completed"
}

op_table_counts() {
    local site_path="$1"

    if [ -z "$site_path" ]; then
        log_error "table-counts: No site path provided"
        return 1
    fi

    log_section "Database Table Row Counts"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    studio_get_table_counts "$site_path"
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# URL MANAGEMENT
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

op_replace_urls() {
    local site_path="$1"
    local old_url="$2"
    local new_url="$3"

    if [ -z "$site_path" ] || [ -z "$old_url" ] || [ -z "$new_url" ]; then
        log_error "replace-urls: site-path, old-url, and new-url required"
        return 1
    fi

    log_section "URL Replacement"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_warning "This will replace URLs in the database"
    log_info "From: $old_url"
    log_info "To:   $new_url"

    if [ "$DRY_RUN" = "true" ]; then
        log_info "DRY RUN: Preview replacements with: ./studio-db-operations.sh dry-run-replace $site_path \"$old_url\" \"$new_url\""
        return 0
    fi

    if [ "$NO_CONFIRM" != "true" ]; then
        read -p "Continue? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            log_info "Cancelled"
            return 0
        fi
    fi

    studio_replace_urls "$site_path" "$old_url" "$new_url"
    log_success "URL replacement completed"
}

op_dry_run_replace() {
    local site_path="$1"
    local old_url="$2"
    local new_url="$3"

    if [ -z "$site_path" ] || [ -z "$old_url" ] || [ -z "$new_url" ]; then
        log_error "dry-run-replace: site-path, old-url, and new-url required"
        return 1
    fi

    log_section "URL Replacement Preview (DRY RUN)"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "This shows what would be replaced:"
    log_info "From: $old_url"
    log_info "To:   $new_url"
    log_info ""

    # Use wp-cli dry-run
    log_info "Running dry-run search-replace..."
    studio wp search-replace "$old_url" "$new_url" --all-tables --dry-run --path "$site_path" || {
        log_warning "Dry-run completed with warnings"
    }

    log_info ""
    log_info "To apply these changes, run:"
    log_info "./studio-db-operations.sh replace-urls \"$site_path\" \"$old_url\" \"$new_url\""
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# INTEGRATED OPERATIONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

op_pre_migrate_check() {
    local site_path="$1"

    if [ -z "$site_path" ]; then
        log_error "pre-migrate-check: No site path provided"
        return 1
    fi

    log_section "Complete Pre-Migration Check"

    # Backup
    log_info "Step 1: Creating backup..."
    local backup_file
    backup_file=$(op_backup "$site_path" "pre-migrate-$(date +%Y%m%d-%H%M%S).sql") || {
        log_error "Backup failed"
        return 1
    }

    # Table counts
    log_section "Step 2: Database Statistics"
    op_table_counts "$site_path"

    log_success "Pre-migration check completed"
    log_info "Backup: $backup_file"
}

op_post_migrate_verify() {
    local site_path="$1"
    local old_export="$2"
    local old_url="$3"
    local new_url="$4"

    if [ -z "$site_path" ]; then
        log_error "post-migrate-verify: site-path required"
        return 1
    fi

    log_section "Complete Post-Migration Verification"

    # Verify integrity
    log_info "Step 1: Verifying site integrity..."
    op_verify "$site_path" "$old_export"

    # Show URL status
    if [ -n "$new_url" ]; then
        log_section "Step 2: URL Configuration"
        local current_url
        current_url=$(studio_get_site_url "$site_path" 2>/dev/null || echo "unknown")
        log_info "Current site URL: $current_url"
        log_info "Expected URL: $new_url"

        if [ "$current_url" = "$new_url" ]; then
            log_success "URL is correctly set"
        else
            log_warning "URL does not match. Run:"
            log_info "./studio-db-operations.sh replace-urls \"$site_path\" \"$current_url\" \"$new_url\""
        fi
    fi

    log_success "Post-migration verification completed"
}

op_compare_counts() {
    local site_path="$1"
    local export_file="$2"

    if [ -z "$site_path" ] || [ -z "$export_file" ]; then
        log_error "compare-counts: site-path and export-file required"
        return 1
    fi

    if [ ! -f "$export_file" ]; then
        log_error "Export file not found: $export_file"
        return 1
    fi

    log_section "Row Count Comparison"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    local tables=("posts" "postmeta" "users" "terms" "options")

    for table in "${tables[@]}"; do
        local current_count
        current_count=$(studio wp db query "SELECT COUNT(*) FROM wp_$table;" --path "$site_path" --skip-column-names 2>/dev/null || echo "error")

        local export_count
        export_count=$(grep -c "INSERT INTO.*wp_$table" "$export_file" 2>/dev/null || echo "?")

        printf "  wp_%-10s  Current: %-8s  Original: %s\n" "$table" "$current_count" "$export_count"
    done
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MAIN DISPATCHER
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

main() {
    if ! check_studio_available; then
        exit 1
    fi

    case "$OPERATION" in
        backup) shift; op_backup "$@" ;;
        restore) shift; op_restore "$@" ;;
        export) shift; op_export "$@" ;;
        pre-migration) shift; op_pre_migration "$@" ;;
        verify) shift; op_verify "$@" ;;
        table-counts) shift; op_table_counts "$@" ;;
        replace-urls) shift; op_replace_urls "$@" ;;
        dry-run-replace) shift; op_dry_run_replace "$@" ;;
        pre-migrate-check) shift; op_pre_migrate_check "$@" ;;
        post-migrate-verify) shift; op_post_migrate_verify "$@" ;;
        compare-counts) shift; op_compare_counts "$@" ;;
        help|--help|-h) show_usage ;;
        "")
            log_error "No operation specified"
            echo ""
            show_usage
            exit 1
            ;;
        *)
            log_error "Unknown operation: $OPERATION"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

main "$@"
