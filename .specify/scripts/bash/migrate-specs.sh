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
MIGRATION_MUTATED=false
TARGET_EXISTED=false

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
    local restoration_failed=false
    local source_cleared=true
    local target_cleared=true

    error "Migration failed: $error_msg"

    if [ "$DRY_RUN" = true ]; then
        echo "DRY-RUN: Rollback would restore from backup"
        return 1
    fi

    if [ "$MIGRATION_MUTATED" = false ]; then
        error "Migration stopped before source or target contents were changed."
        if [ -d "$BACKUP_DIR" ]; then
            error "Backup preserved at: $BACKUP_DIR"
        fi
        return 1
    fi

    log "Rolling back: restoring source and target from backup..."

    if ! rm -rf -- "$SOURCE_DIR"; then
        error "Rollback could not remove partial source contents: $SOURCE_DIR"
        restoration_failed=true
        source_cleared=false
    fi
    if ! rm -rf -- "$TARGET_DIR"; then
        error "Rollback could not remove partial target contents: $TARGET_DIR"
        restoration_failed=true
        target_cleared=false
    fi

    if [ "$source_cleared" = true ]; then
        if ! cp -a -- "$BACKUP_DIR/source" "$SOURCE_DIR"; then
            error "Rollback could not restore the source backup."
            restoration_failed=true
        fi
    fi

    if [ "$target_cleared" = true ]; then
        if [ "$TARGET_EXISTED" = true ] && ! cp -a -- "$BACKUP_DIR/target" "$TARGET_DIR"; then
            error "Rollback could not restore the target backup."
            restoration_failed=true
        fi
    fi

    if [ "$restoration_failed" = true ]; then
        error "Rollback failed after migration error: $error_msg"
        error "Backup preserved at: $BACKUP_DIR"
        error "Manual recovery required: remove the current source and target paths, then restore '$BACKUP_DIR/source' to '$SOURCE_DIR' and, when present, '$BACKUP_DIR/target' to '$TARGET_DIR'."
    else
        error "Migration failed and rollback restored the original source and target state: $error_msg"
        error "Backup preserved at: $BACKUP_DIR"
    fi
    return 1
}

entries_match() {
    local source_entry="$1"
    local target_entry="$2"

    if [ -L "$source_entry" ]; then
        [ -L "$target_entry" ] &&
            [ "$(readlink "$source_entry")" = "$(readlink "$target_entry")" ]
    elif [ -d "$source_entry" ]; then
        [ -d "$target_entry" ] && [ ! -L "$target_entry" ]
    elif [ -f "$source_entry" ]; then
        [ -f "$target_entry" ] && [ ! -L "$target_entry" ] &&
            cmp -s -- "$source_entry" "$target_entry"
    elif [ -p "$source_entry" ]; then
        [ -p "$target_entry" ]
    elif [ -b "$source_entry" ]; then
        [ -b "$target_entry" ]
    elif [ -c "$source_entry" ]; then
        [ -c "$target_entry" ]
    elif [ -S "$source_entry" ]; then
        [ -S "$target_entry" ]
    else
        return 1
    fi
}

count_entries() {
    local directory="$1"
    local count=0
    local entry

    while IFS= read -r -d '' entry; do
        count=$((count + 1))
    done < <(find "$directory" -mindepth 1 -print0)

    printf '%s' "$count"
}

# Main migration logic
main() {
    log "Starting specs directory migration..."

    local configured_specs_dir
    if ! configured_specs_dir=$(read_specs_directory "$REPO_ROOT"); then
        error "Unable to read specs_directory configuration. No changes were made."
        return 1
    fi
    if [ "$configured_specs_dir" != ".github/specs" ]; then
        error "Migration requires specs_directory to be '.github/specs'; configured value is '$configured_specs_dir'. No changes were made."
        return 1
    fi

    if [ -L "$SOURCE_DIR" ] || [ -L "$TARGET_DIR" ]; then
        error "Migration requires source and target roots to be real directories, not symlinks. No changes were made."
        return 1
    fi
    if [ -e "$TARGET_DIR" ] && [ ! -d "$TARGET_DIR" ]; then
        error "Migration target exists but is not a directory: $TARGET_DIR. No changes were made."
        return 1
    fi

    # Check if source directory exists
    if [ ! -d "$SOURCE_DIR" ]; then
        log "Source directory $SOURCE_DIR does not exist. Nothing to migrate."
        return 0
    fi

    # Create backup before migration
    log "Creating pre-migration backup..."
    if [ "$DRY_RUN" = false ]; then
        mkdir -p "$BACKUP_DIR" || rollback "Failed to create backup directory"
        cp -a -- "$SOURCE_DIR" "$BACKUP_DIR/source" || rollback "Failed to create source backup"

        if [ -e "$TARGET_DIR" ]; then
            TARGET_EXISTED=true
            cp -a -- "$TARGET_DIR" "$BACKUP_DIR/target" || rollback "Failed to create target backup"
        else
            mkdir -p "$BACKUP_DIR/target" || rollback "Failed to record empty target backup"
        fi
    fi

    # Inventory both directories
    log "Inventorying source and target directories..."
    local source_count
    local target_count=0
    source_count=$(count_entries "$SOURCE_DIR")
    if [ -d "$TARGET_DIR" ]; then
        target_count=$(count_entries "$TARGET_DIR")
    fi
    log "Source has $source_count entries, target has $target_count entries"

    # Check for conflicts
    local conflicts=0
    while IFS= read -r -d '' source_entry; do
        local rel_path="${source_entry#"$SOURCE_DIR"/}"
        local target_entry="$TARGET_DIR/$rel_path"
        if [ -e "$target_entry" ] || [ -L "$target_entry" ]; then
            if ! entries_match "$source_entry" "$target_entry"; then
                error "Conflict: $rel_path differs in both locations"
                conflicts=$((conflicts + 1))
            fi
        fi
    done < <(find "$SOURCE_DIR" -mindepth 1 -print0)

    if [ $conflicts -gt 0 ]; then
        rollback "Found $conflicts conflicting files during pre-migration check"
    fi

    # Perform migration
    if [ "$DRY_RUN" = false ]; then
        MIGRATION_MUTATED=true
        if [ ! -d "$TARGET_DIR" ]; then
            log "Creating target directory: $TARGET_DIR"
            mkdir -p "$TARGET_DIR" || rollback "Failed to create target directory"
        fi

        log "Migrating source tree..."
        while IFS= read -r -d '' source_entry; do
            cp -a -- "$source_entry" "$TARGET_DIR/" || rollback "Failed to copy source entry: ${source_entry#"$SOURCE_DIR"/}"
        done < <(find "$SOURCE_DIR" -mindepth 1 -maxdepth 1 -print0)

        log "Verifying migration..."
        while IFS= read -r -d '' source_entry; do
            local rel_path="${source_entry#"$SOURCE_DIR"/}"
            local target_entry="$TARGET_DIR/$rel_path"

            if ! entries_match "$source_entry" "$target_entry"; then
                rollback "Verification failed: $rel_path was not preserved in the target"
            fi
        done < <(find "$SOURCE_DIR" -mindepth 1 -print0)

        log "Removing source directory..."
        rm -rf -- "$SOURCE_DIR" || rollback "Failed to remove source directory"

        log "Migration complete. Cleanup backup in: $BACKUP_DIR"
    else
        echo "DRY-RUN: Would migrate $source_count entries from $SOURCE_DIR to $TARGET_DIR"
    fi

    return 0
}

# Run main directly so errexit applies within the function body.
main
exit 0
