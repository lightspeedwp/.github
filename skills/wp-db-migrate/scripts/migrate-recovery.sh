#!/bin/bash
# migrate-recovery.sh — Complete recovery workflow after import
# Guides you through: verify → replace URLs → start server
# Usage: ./migrate-recovery.sh /path/to/studio/site "old-url" "new-url"

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: $0 /path/to/studio/site \"https://old-domain.com\" \"https://new-domain.local\""
    echo ""
    echo "Example:"
    echo "  $0 /Users/ash/Studio/the-safari-partners \"https://thesafaripartners.lightspeedwp.dev\" \"https://thesafaripartners.local\""
    exit 1
fi

SITE_PATH="$1"
OLD_URL="$2"
NEW_URL="$3"

if [ ! -d "$SITE_PATH" ]; then
    echo "❌ Error: Site path does not exist: $SITE_PATH"
    exit 1
fi

echo "╔════════════════════════════════════════════════════════════╗"
echo "║    WordPress Database Migration Recovery Workflow         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "This will:"
echo "  1️⃣  Verify the database import"
echo "  2️⃣  Replace URLs in the database"
echo "  3️⃣  Start the WordPress server"
echo ""
echo "Site: $SITE_PATH"
echo "URL:  $OLD_URL → $NEW_URL"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1️⃣  Verifying import..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
"$SCRIPT_DIR/verify-import.sh" "$SITE_PATH"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2️⃣  Replacing URLs..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
"$SCRIPT_DIR/replace-urls.sh" "$SITE_PATH" "$OLD_URL" "$NEW_URL"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3️⃣  Starting server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
"$SCRIPT_DIR/start-server.sh" "$SITE_PATH"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   ✅ All Done!                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Your site is ready! Visit:"
echo "   https://$(basename "$SITE_PATH").local"
