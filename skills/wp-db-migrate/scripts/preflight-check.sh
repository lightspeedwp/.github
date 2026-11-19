#!/bin/bash
# preflight-check.sh — Verify all dependencies before migration
# Usage: ./preflight-check.sh

set -e

REQUIRE_WP=false
case "${1:-}" in
    --require-wp) REQUIRE_WP=true ;;
    "") ;;
    *) echo "Usage: $0 [--require-wp]" >&2; exit 1 ;;
esac

echo "🔍 Running pre-flight checks..."
echo ""

CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check a command exists
check_command() {
    local cmd="$1"
    local display_name="${2:-$cmd}"

    if command -v "$cmd" &> /dev/null; then
        echo "✅ $display_name"
        ((CHECKS_PASSED+=1))
        return 0
    else
        if [ "${3:-required}" = "optional" ]; then
            echo "ℹ️  $display_name — optional, not installed"
            return 0
        fi
        echo "❌ $display_name — NOT FOUND"
        echo "   Install it to proceed (check the README)"
        ((CHECKS_FAILED+=1))
        return 1
    fi
}

# Function to check a directory exists
check_directory() {
    local path="$1"
    local display_name="${2:-$path}"

    if [ -d "$path" ]; then
        echo "✅ $display_name"
        ((CHECKS_PASSED+=1))
        return 0
    else
        echo "❌ $display_name — NOT FOUND at $path"
        ((CHECKS_FAILED+=1))
        return 1
    fi
}

echo "📦 Required Commands:"
check_command "studio" "WordPress Studio CLI"
if [ "$REQUIRE_WP" = "true" ]; then
    check_command "wp" "WordPress CLI"
else
    echo "ℹ️  Standalone WP-CLI is optional; Studio workflows use studio wp."
fi
check_command "bash" "Bash shell"
check_command "grep" "grep"
check_command "sed" "sed"

echo ""
echo "📍 Directories:"
check_directory "$HOME/.studio" "Studio config directory"

echo ""
echo "🧪 Optional (but recommended):"
check_command "git" "Git" optional
check_command "jq" "jq (JSON processor)" optional

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $CHECKS_FAILED -eq 0 ]; then
    echo "✅ All checks passed! You're ready to migrate."
    exit 0
else
    echo "⚠️  $CHECKS_FAILED check(s) failed."
    echo ""
    echo "Missing dependencies? Install them:"
    echo "  - Studio CLI: https://developer.wordpress.com/docs/developer-tools/studio/cli/"
    echo "  - WordPress CLI: https://wp-cli.org/#installing"
    echo ""
    exit 1
fi
