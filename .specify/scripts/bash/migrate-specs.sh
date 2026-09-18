#!/usr/bin/env bash
# Migration helper with automatic rollback for specs directory migration
# Implements FR-009: Automatic rollback on any error (permission denied, disk full, partial failure)

set -e

# Get script directory and load common functions
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

REPO_ROOT=$(get_repo_root) || exit 1

# Read configured specs directory and ensure it's the default
CONFIGURED_SPECS_DIR=$(read_specs_directory "$REPO_ROOT")
if [[ "$CONFIGURED_SPECS_DIR" != ".github/specs" ]]; then
    echo "ERROR: Migration script is designed for one-time migration to .github/specs" >&2
    echo "Current configuration uses: $CONFIGURED_SPECS_DIR" >&2
    echo "Please reset specs_directory to .github/specs before running migration" >&2
    exit 1
fi

SOURCE_DIR="$REPO_ROOT/specs"
TARGET_DIR="$REPO_ROOT/.github/specs"
BACKUP_DIR="$REPO_ROOT/.github/tmp/migration-backup-$(date +%s)"

# Configuration
DRY_RUN=false
VERBOSE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --dry-run)
            DRY_RUN=true
            ;;
        --verbose|-v)
            VERBOSE=true
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --dry-run     Show what would be migrated without making changes"
            echo "  --verbose     Print detailed progress information"
            echo "  --help        Show this help message"
            exit 0
            ;;
        *)
            echo "ERROR: Unknown option '$1'" >&2
            exit 1
            ;;
    esac
    shift
done

log() {
    if [ "$VERBOSE" = true ]; then
        echo "[migrate-specs] $1" >&2
    fi
}

error() {
    echo "ERROR: $1" >&2
}

rollback() {
    local error_msg="$1"
    error "$error_msg"

    if [ "$DRY_RUN" = true ]; then
        echo "DRY-RUN: Rollback would restore from backup"
        return 1
    fi

    if [ -d "$BACKUP_DIR" ]; then
        log "Rolling back: restoring from backup..."
        local restore_failed=false

        # Restore source directory
        if [ -d "$SOURCE_DIR" ]; then
            rm -rf "$SOURCE_DIR" || restore_failed=true
        fi
        if [ -d "$BACKUP_DIR/source" ]; then
            cp -r "$BACKUP_DIR/source" "$SOURCE_DIR" || restore_failed=true
        fi

        # Restore target directory
        if [ -d "$TARGET_DIR" ]; then
            rm -rf "$TARGET_DIR" || restore_failed=true
        fi
        if [ -d "$BACKUP_DIR/target" ]; then
            cp -r "$BACKUP_DIR/target" "$TARGET_DIR" || restore_failed=true
        fi

        if [ "$restore_failed" = true ]; then
            error "Migration failed with: $error_msg"
            error "Rollback completed with errors. Backup preserved at: $BACKUP_DIR"
            error "Manual recovery may be needed. Review backup contents and restore manually if needed."
        else
            error "Migration failed with: $error_msg"
            error "Rollback completed successfully. Original state restored."
            error "Backup preserved at: $BACKUP_DIR for verification."
        fi
    else
        error "Migration failed with: $error_msg"
        error "Unable to restore from backup (backup directory not found)."
        error "Manual recovery required."
    fi
    return 1
}

# Main migration logic
main() {
    log "Starting specs directory migration..."

    # Check if source directory exists
    if [ ! -d "$SOURCE_DIR" ]; then
        log "Source directory $SOURCE_DIR does not exist. Nothing to migrate."
        return 0
    fi

    # Create target directory if needed
    if [ ! -d "$TARGET_DIR" ]; then
        if [ "$DRY_RUN" = false ]; then
            log "Creating target directory: $TARGET_DIR"
            mkdir -p "$TARGET_DIR" || rollback "Failed to create target directory"
        fi
    fi

    # Create backup before migration
    log "Creating pre-migration backup..."
    if [ "$DRY_RUN" = false ]; then
        mkdir -p "$BACKUP_DIR" || rollback "Failed to create backup directory"
        cp -r "$SOURCE_DIR" "$BACKUP_DIR/source" || rollback "Failed to backup source directory"
        if [ -d "$TARGET_DIR" ]; then
            cp -r "$TARGET_DIR" "$BACKUP_DIR/target" || rollback "Failed to backup target directory"
        fi
    fi

    # Inventory both directories (count all entry types)
    log "Inventorying source and target directories..."
    local source_entries=$(find "$SOURCE_DIR" 2>/dev/null | wc -l || echo "0")
    local target_entries=$(find "$TARGET_DIR" 2>/dev/null | wc -l || echo "0")
    log "Source has $source_entries entries, target has $target_entries entries"

    # Check for conflicts in files (skip directories and symlinks for conflict check)
    local conflicts=0
    while IFS= read -r -d '' src_file; do
        local rel_path="${src_file#$SOURCE_DIR/}"
        local dst_file="$TARGET_DIR/$rel_path"
        if [ -e "$dst_file" ] && [ -f "$dst_file" ]; then
            # Check if files differ
            if ! cmp -s "$src_file" "$dst_file"; then
                error "Conflict: $rel_path differs in both locations"
                ((conflicts++))
            fi
        fi
    done < <(find "$SOURCE_DIR" -type f -print0 2>/dev/null)

    if [ $conflicts -gt 0 ]; then
        rollback "Found $conflicts conflicting files during pre-migration check"
    fi

    # Perform migration (preserve complete directory tree structure)
    if [ "$DRY_RUN" = false ]; then
        log "Migrating directory tree..."
        # Create parent directory for SOURCE_DIR contents
        mkdir -p "$TARGET_DIR" || rollback "Failed to create target directory"
        # Copy entire source tree recursively, preserving symlinks and empty directories
        cp -rP "$SOURCE_DIR"/* "$TARGET_DIR/" 2>/dev/null || rollback "Failed to migrate directory tree"

        log "Verifying migration..."
        # Verify all source entries were copied (check file count and integrity)
        local migrated_count=$(find "$TARGET_DIR" 2>/dev/null | wc -l || echo "0")
        if [ "$migrated_count" -lt "$source_entries" ]; then
            rollback "Verification failed: Migrated $migrated_count entries but source had $source_entries"
        fi

        # Verify files exist and match
        while IFS= read -r -d '' src_file; do
            local rel_path="${src_file#$SOURCE_DIR/}"
            local dst_file="$TARGET_DIR/$rel_path"

            if [ ! -e "$dst_file" ]; then
                rollback "Verification failed: $rel_path not found in target"
            fi

            # For regular files, verify content matches
            if [ -f "$src_file" ] && [ -f "$dst_file" ]; then
                if ! cmp -s "$src_file" "$dst_file"; then
                    rollback "Verification failed: $rel_path content differs"
                fi
            fi
        done < <(find "$SOURCE_DIR" -type f -print0 2>/dev/null)

        log "Removing source directory..."
        rm -rf "$SOURCE_DIR" || rollback "Failed to remove source directory"

        log "Migration complete. Cleanup backup in: $BACKUP_DIR"
    else
        echo "DRY-RUN: Would migrate $source_count files from $SOURCE_DIR to $TARGET_DIR"
    fi

    return 0
}

# Run main function and exit with its status
main
exit $?
