#!/bin/bash
# start-server.sh — Start WordPress Studio server
# Usage: ./start-server.sh /path/to/studio/site

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

echo "🚀 Starting WordPress Studio server"
echo "   Site: $SITE_PATH"
echo ""
echo "⏳ Starting (this may take 30-60 seconds)..."
echo ""

studio start --path "$SITE_PATH"

echo ""
echo "✅ Server started!"
echo ""
echo "Your site should be accessible at:"
echo "   https://$(basename "$SITE_PATH").local"
