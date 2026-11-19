#!/bin/bash
# verify-import.sh — Verify database import success
# Usage: ./verify-import.sh /path/to/studio/site

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 /path/to/studio/site"
    echo ""
    echo "Example: $0 /Users/ash/Studio/the-safari-partners"
    exit 1
fi

SITE_PATH="$1"

if [ ! -d "$SITE_PATH" ]; then
    echo "❌ Error: Site path does not exist: $SITE_PATH"
    exit 1
fi

echo "🔍 Verifying database import at: $SITE_PATH"
echo ""

# Check post count
echo "📝 Checking post count..."
POST_COUNT=$(studio wp post count --path "$SITE_PATH" 2>/dev/null || echo "0")
echo "   Posts: $POST_COUNT"

# Check user count
echo "👤 Checking user count..."
USER_COUNT=$(studio wp user list --field=ID --path "$SITE_PATH" 2>/dev/null | wc -l)
echo "   Users: $USER_COUNT"

# Check table count
echo "📊 Checking database tables..."
TABLE_COUNT=$(studio wp db tables --path "$SITE_PATH" 2>/dev/null | wc -l)
echo "   Tables: $TABLE_COUNT"

# Check site URL
echo "🌐 Checking site URLs..."
SITEURL=$(studio wp option get siteurl --path "$SITE_PATH" 2>/dev/null || echo "unknown")
HOME=$(studio wp option get home --path "$SITE_PATH" 2>/dev/null || echo "unknown")
echo "   siteurl: $SITEURL"
echo "   home:    $HOME"

echo ""
echo "✅ Import verification complete!"
echo ""
echo "If the counts look right and URLs are set correctly, your import succeeded!"
