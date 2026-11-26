#!/bin/bash
# replace-urls.sh — Replace URLs in WordPress database
# Usage: ./replace-urls.sh /path/to/studio/site "old-url" "new-url"

set -e

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

echo "🔄 Replacing URLs in database"
echo ""
echo "   From: $OLD_URL"
echo "   To:   $NEW_URL"
echo "   Site: $SITE_PATH"
echo ""

# Run the search-replace
echo "⏳ Running search-replace (this may take a minute)..."
studio wp search-replace "$OLD_URL" "$NEW_URL" --all-tables --path "$SITE_PATH" --quiet

echo ""
echo "✅ URL replacement complete!"
echo ""

# Verify
echo "🔍 Verifying replacement..."
NEW_SITEURL=$(studio wp option get siteurl --path "$SITE_PATH" 2>/dev/null)
echo "   siteurl is now: $NEW_SITEURL"

if [[ "$NEW_SITEURL" == "$NEW_URL"* ]]; then
    echo "   ✅ URLs updated successfully!"
else
    echo "   ⚠️  URLs may not have updated correctly. Check manually."
fi
