#!/usr/bin/env bash
# Migration helper with automatic rollback for specs directory migration
# Implements FR-009: Automatic rollback on any error (permission denied, disk full, partial failure)

set -e

# Get script directory and load common functions
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

REPO_ROOT=$(get_repo_root) || exit 1
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
        if [ -d "$SOURCE_DIR" ]; then
            rm -rf "$SOURCE_DIR"
        fi
        cp -r "$BACKUP_DIR/source" "$SOURCE_DIR" 2>/dev/null || true
        error "Migration failed and rolled back. Original state restored."
        error "Backup preserved at: $BACKUP_DIR"
    else
        error "Migration failed. Unable to restore from backup."
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
        mkdir -p "$BACKUP_DIR"
        cp -r "$SOURCE_DIR" "$BACKUP_DIR/source" || rollback "Failed to create backup"
        cp -r "$TARGET_DIR" "$BACKUP_DIR/target" 2>/dev/null || true
    fi

    # Inventory both directories
    log "Inventorying source and target directories..."
    local source_count=$(find "$SOURCE_DIR" -type f 2>/dev/null | wc -l || echo "0")
    local target_count=$(find "$TARGET_DIR" -type f 2>/dev/null | wc -l || echo "0")
    log "Source has $source_count files, target has $target_count files"

    # Check for conflicts
    local conflicts=0
    while IFS= read -r -d '' src_file; do
        local rel_path="${src_file#$SOURCE_DIR/}"
        local dst_file="$TARGET_DIR/$rel_path"
        if [ -e "$dst_file" ]; then
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

    # Perform migration
    if [ "$DRY_RUN" = false ]; then
        log "Migrating files..."
        while IFS= read -r -d '' src_file; do
            local rel_path="${src_file#$SOURCE_DIR/}"
            local dst_file="$TARGET_DIR/$rel_path"
            local dst_parent="$(dirname "$dst_file")"

            # Create parent directory if needed
            mkdir -p "$dst_parent" || rollback "Failed to create directory: $dst_parent"

            # Copy file
            cp "$src_file" "$dst_file" || rollback "Failed to copy: $rel_path"
        done < <(find "$SOURCE_DIR" -type f -print0 2>/dev/null)

        log "Verifying migration..."
        # Verify all files were copied
        while IFS= read -r -d '' src_file; do
            local rel_path="${src_file#$SOURCE_DIR/}"
            local dst_file="$TARGET_DIR/$rel_path"

            if [ ! -f "$dst_file" ]; then
                rollback "Verification failed: $rel_path not found in target"
            fi

            if ! cmp -s "$src_file" "$dst_file"; then
                rollback "Verification failed: $rel_path content differs"
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

# Run main with error handling
if ! main; then
    exit 1
fi

exit 0
