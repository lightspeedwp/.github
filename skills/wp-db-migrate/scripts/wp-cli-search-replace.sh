#!/bin/bash
# wp-cli-search-replace.sh — Safe WordPress URL replacement with serialization handling
# Uses WP-CLI's db search-replace for serialization-aware replacement
# Falls back to bash sed approach if WP-CLI unavailable
# Usage: ./wp-cli-search-replace.sh [--dry-run] /path/to/site "old-url" "new-url"

set -o pipefail

# Source the WP-CLI library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/lib-wp-cli.sh"

# Parse arguments
DRY_RUN=0
SITE_PATH=""
OLD_URL=""
NEW_URL=""

# Helper function for usage
usage() {
    echo "Usage: $0 [--dry-run] /path/to/site \"https://old-domain.com\" \"https://new-domain.local\""
    echo ""
    echo "Options:"
    echo "  --dry-run       Preview changes without applying them"
    echo ""
    echo "Examples:"
    echo "  # Preview URL replacement"
    echo "  $0 --dry-run /Users/ash/Studio/my-site \"https://old.dev\" \"https://new.local\""
    echo ""
    echo "  # Apply URL replacement"
    echo "  $0 /Users/ash/Studio/my-site \"https://old.dev\" \"https://new.local\""
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --dry-run)
            DRY_RUN=1
            shift
            ;;
        -*)
            wpcli_error "Unknown option: $1"
            usage
            ;;
        *)
            if [ -z "$SITE_PATH" ]; then
                SITE_PATH="$1"
            elif [ -z "$OLD_URL" ]; then
                OLD_URL="$1"
            elif [ -z "$NEW_URL" ]; then
                NEW_URL="$1"
            else
                wpcli_error "Too many arguments"
                usage
            fi
            shift
            ;;
    esac
done

# Validate arguments
if [ -z "$SITE_PATH" ] || [ -z "$OLD_URL" ] || [ -z "$NEW_URL" ]; then
    wpcli_error "Missing required arguments"
    usage
fi

if [ ! -d "$SITE_PATH" ]; then
    wpcli_error "Site path does not exist: $SITE_PATH"
    exit 1
fi

# Initialize WP-CLI detection
wpcli_init

echo "🔄 WordPress URL Replacement Tool"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Site Path:  $SITE_PATH"
echo "From:       $OLD_URL"
echo "To:         $NEW_URL"
if [ $DRY_RUN -eq 1 ]; then
    echo "Mode:       DRY RUN (no changes will be made)"
fi
echo ""

# Validate site path
if ! wpcli_check_health "$SITE_PATH"; then
    wpcli_error "Site health check failed. Is this a valid WordPress installation?"
    exit 1
fi

# Function to perform search-replace using WP-CLI
do_wpcli_search_replace() {
    local dry_run_flag=""
    if [ $DRY_RUN -eq 1 ]; then
        dry_run_flag="--dry-run"
    fi

    wpcli_log "Using WP-CLI search-replace (serialization-safe)..."

    # Use bash array to build command safely (no eval, no string concatenation)
    local -a sr_args=("db" "search-replace" "$OLD_URL" "$NEW_URL" "--all-tables" "--path=$SITE_PATH")

    if [ $DRY_RUN -eq 1 ]; then
        sr_args+=("--dry-run")
    fi

    # Execute command and capture output
    if wp "${sr_args[@]}" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to perform search-replace using bash sed (fallback)
do_bash_search_replace() {
    wpcli_warn "Falling back to bash sed approach (may not handle serialized data correctly)..."

    local db_name
    local db_file

    # Try to find the SQLite database file
    # Studio sites typically have: wp-content/database.sqlite or data/database.sqlite
    if [ -f "$SITE_PATH/wp-content/database.sqlite" ]; then
        db_file="$SITE_PATH/wp-content/database.sqlite"
    elif [ -f "$SITE_PATH/data/database.sqlite" ]; then
        db_file="$SITE_PATH/data/database.sqlite"
    else
        wpcli_error "Could not find SQLite database file"
        return 1
    fi

    if [ $DRY_RUN -eq 1 ]; then
        wpcli_log "Dry run mode: showing what would be replaced..."
        # Count occurrences
        local count
        count=$(grep -o "$OLD_URL" "$db_file" 2>/dev/null | wc -l)
        echo ""
        echo "Estimated replacements: $count occurrences"
        echo ""
        echo "⚠️  Note: Bash sed cannot handle serialized data correctly."
        echo "   For production use, install WP-CLI for safe serialization."
        return 0
    fi

    wpcli_log "Creating backup before replacement..."
    local backup_file="${db_file}.backup.$(date +%s)"
    cp "$db_file" "$backup_file" || {
        wpcli_error "Failed to create backup"
        return 1
    }
    wpcli_success "Backup created: $backup_file"

    wpcli_log "Replacing URLs in database..."
    # Use sed with -i flag for in-place replacement
    # Escape slashes and special characters in URLs
    local old_url_escaped=$(printf '%s\n' "$OLD_URL" | sed -e 's/[\/&]/\\&/g')
    local new_url_escaped=$(printf '%s\n' "$NEW_URL" | sed -e 's/[\/&]/\\&/g')

    sed -i.bak "s/$old_url_escaped/$new_url_escaped/g" "$db_file" || {
        wpcli_error "Sed replacement failed"
        wpcli_warn "Restoring from backup..."
        mv "$backup_file" "$db_file"
        return 1
    }

    wpcli_success "URLs replaced in database"

    # Clean up sed backup
    [ -f "${db_file}.bak" ] && rm -f "${db_file}.bak"

    return 0
}

# Execute search-replace
echo "🔍 Performing URL search-replace..."
echo ""

if [ "${WP_CLI_AVAILABLE:-0}" -eq 1 ]; then
    # Use WP-CLI approach (preferred)
    if do_wpcli_search_replace; then
        search_replace_success=1
    else
        wpcli_error "WP-CLI search-replace failed"
        search_replace_success=0
    fi
else
    # Fall back to bash approach
    if do_bash_search_replace; then
        search_replace_success=1
    else
        wpcli_error "Bash search-replace failed"
        search_replace_success=0
    fi
fi

if [ $search_replace_success -ne 1 ]; then
    exit 1
fi

# If dry-run mode, stop here
if [ $DRY_RUN -eq 1 ]; then
    echo ""
    echo "✅ Dry run complete. No changes were made."
    echo ""
    echo "To apply these changes, run:"
    echo "  $0 $SITE_PATH \"$OLD_URL\" \"$NEW_URL\""
    exit 0
fi

# Verify replacement (only for actual replacements)
echo ""
echo "🔍 Verifying replacement..."
echo ""

# Get current siteurl
current_siteurl=$(wpcli_get_siteurl "$SITE_PATH") || {
    wpcli_warn "Could not retrieve current siteurl"
    current_siteurl="(unable to verify)"
}

echo "Current siteurl: $current_siteurl"

# Check if replacement was successful
if [[ "$current_siteurl" == "$NEW_URL"* ]]; then
    wpcli_success "URL replacement successful!"
    echo ""
    echo "✅ Database updated:"
    echo "   Old URL: $OLD_URL"
    echo "   New URL: $NEW_URL"
    echo ""
    exit 0
else
    wpcli_warn "URL replacement may not have completed successfully"
    echo ""
    echo "⚠️  Current siteurl: $current_siteurl"
    echo "   Expected:        $NEW_URL"
    echo ""
    echo "Troubleshooting:"
    echo "1. Run a dry-run to see what would be replaced:"
    echo "   $0 --dry-run $SITE_PATH \"$OLD_URL\" \"$NEW_URL\""
    echo ""
    echo "2. If using WP-CLI, verify it's working:"
    echo "   wp --info --path=$SITE_PATH"
    echo ""
    echo "3. For manual verification, check the options table:"
    echo "   wp option get siteurl --path=$SITE_PATH"
    echo ""
    exit 1
fi
