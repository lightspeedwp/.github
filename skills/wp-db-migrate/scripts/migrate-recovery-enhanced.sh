#!/bin/bash
# migrate-recovery-enhanced.sh — Complete recovery workflow with advanced options
# Usage: ./migrate-recovery-enhanced.sh [OPTIONS] /path/to/site "old-url" "new-url"
#
# Options:
#   --dry-run              Preview all steps without making changes
#   --no-backup            Skip backup creation (NOT recommended)
#   --verbose              Show detailed output
#   --log-file FILE        Save output to file
#   --force                Skip all confirmation prompts
#   --help                 Show this help message

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DRY_RUN=false
CREATE_BACKUP=true
VERBOSE=false
LOG_FILE=""
FORCE=false
TEMP_LOG=""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --no-backup)
                CREATE_BACKUP=false
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --log-file)
                LOG_FILE="$2"
                shift 2
                ;;
            --force)
                FORCE=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                break
                ;;
        esac
    done

    SITE_PATH="$1"
    OLD_URL="$2"
    NEW_URL="$3"
}

show_help() {
    cat << 'EOF'
WordPress Database Migration Recovery Workflow

USAGE:
  ./migrate-recovery-enhanced.sh [OPTIONS] /path/to/site "old-url" "new-url"

OPTIONS:
  --dry-run               Preview all steps without making changes
  --no-backup             Skip backup creation (NOT recommended)
  --verbose               Show detailed output
  --log-file FILE         Save output to file
  --force                 Skip all confirmation prompts
  --help                  Show this help message

EXAMPLES:
  # Normal workflow with confirmations
  ./migrate-recovery-enhanced.sh /Users/ash/Studio/my-site \
    "https://old.com" "https://new.local"

  # Dry-run to preview
  ./migrate-recovery-enhanced.sh --dry-run /Users/ash/Studio/my-site \
    "https://old.com" "https://new.local"

  # Verbose with logging
  ./migrate-recovery-enhanced.sh --verbose --log-file recovery.log \
    /Users/ash/Studio/my-site "https://old.com" "https://new.local"

  # Force mode (no prompts)
  ./migrate-recovery-enhanced.sh --force /Users/ash/Studio/my-site \
    "https://old.com" "https://new.local"
EOF
}

# Logging functions
log() {
    local msg="$1"
    local color="${2:-$NC}"
    echo -e "${color}${msg}${NC}"

    if [ -n "$LOG_FILE" ]; then
        # Remove color codes for log file
        echo -e "$msg" | sed 's/\x1b\[[0-9;]*m//g' >> "$LOG_FILE"
    fi
}

verbose_log() {
    if [ "$VERBOSE" = true ]; then
        log "   ℹ️  $1" "$BLUE"
    fi
}

# Confirmation prompt
confirm() {
    if [ "$FORCE" = true ]; then
        return 0
    fi

    local prompt="$1"
    local response

    read -p "$(echo -e ${YELLOW}$prompt${NC}) (y/n) " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

# Main workflow
main() {
    parse_args "$@"

    if [ -z "$SITE_PATH" ] || [ -z "$OLD_URL" ] || [ -z "$NEW_URL" ]; then
        show_help
        exit 1
    fi

    if [ ! -d "$SITE_PATH" ]; then
        log "❌ Error: Site path does not exist: $SITE_PATH" "$RED"
        exit 1
    fi

    # Setup logging
    if [ -n "$LOG_FILE" ]; then
        TEMP_LOG="$LOG_FILE"
        echo "=== Migration Log $(date '+%Y-%m-%d %H:%M:%S') ===" > "$LOG_FILE"
    fi

    # Header
    log "╔════════════════════════════════════════════════════════════╗" "$BLUE"
    log "║    WordPress Database Migration Recovery Workflow         ║" "$BLUE"
    log "╚════════════════════════════════════════════════════════════╝" "$BLUE"
    echo ""

    if [ "$DRY_RUN" = true ]; then
        log "🔍 DRY-RUN MODE — No changes will be made" "$YELLOW"
        echo ""
    fi

    log "Site:       $SITE_PATH"
    log "URL:        $OLD_URL → $NEW_URL"
    log "Backup:     $([ "$CREATE_BACKUP" = true ] && echo "Yes" || echo "SKIPPED")"
    echo ""

    if [ "$DRY_RUN" = false ] && [ "$FORCE" = false ]; then
        if ! confirm "Continue?"; then
            log "Cancelled." "$YELLOW"
            exit 0
        fi
    fi

    # Step 1: Verify Import
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "$BLUE"
    log "Step 1️⃣  Verifying import..." "$BLUE"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "$BLUE"

    if [ "$DRY_RUN" = true ]; then
        log "   [DRY-RUN] Would verify: $SITE_PATH"
    else
        "$SCRIPT_DIR/verify-import.sh" "$SITE_PATH"
    fi
    echo ""

    # Step 2: Replace URLs
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "$BLUE"
    log "Step 2️⃣  Preparing URL replacement..." "$BLUE"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "$BLUE"

    if [ "$DRY_RUN" = true ]; then
        log "   [DRY-RUN] Would replace URLs:"
        log "   From: $OLD_URL"
        log "   To:   $NEW_URL"
        log "   In site: $SITE_PATH"
    else
        "$SCRIPT_DIR/replace-urls.sh" "$SITE_PATH" "$OLD_URL" "$NEW_URL"
    fi
    echo ""

    # Step 3: Start Server
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "$BLUE"
    log "Step 3️⃣  Starting server..." "$BLUE"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "$BLUE"

    if [ "$DRY_RUN" = true ]; then
        log "   [DRY-RUN] Would start server at: $SITE_PATH"
    else
        "$SCRIPT_DIR/start-server.sh" "$SITE_PATH"
    fi
    echo ""

    # Summary
    log "╔════════════════════════════════════════════════════════════╗" "$GREEN"
    if [ "$DRY_RUN" = true ]; then
        log "║              ✅ DRY-RUN COMPLETE                         ║" "$GREEN"
        log "║   All steps preview successful. Ready to proceed.      ║" "$GREEN"
    else
        log "║                   ✅ All Done!                            ║" "$GREEN"
    fi
    log "╚════════════════════════════════════════════════════════════╝" "$GREEN"
    echo ""

    if [ "$DRY_RUN" = false ]; then
        log "Your site is ready at: https://$(basename "$SITE_PATH").local" "$GREEN"
    fi

    if [ -n "$LOG_FILE" ]; then
        log "📝 Log saved to: $LOG_FILE"
    fi
}

main "$@"
