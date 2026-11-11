#!/bin/bash
# preflight-check.sh — Verify all dependencies before migration
# Usage: ./preflight-check.sh

set -e

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
        ((CHECKS_PASSED++))
        return 0
    else
        echo "❌ $display_name — NOT FOUND"
        echo "   Install it to proceed (check the README)"
        ((CHECKS_FAILED++))
        return 1
    fi
}

# Function to check a directory exists
check_directory() {
    local path="$1"
    local display_name="${2:-$path}"

    if [ -d "$path" ]; then
        echo "✅ $display_name"
        ((CHECKS_PASSED++))
        return 0
    else
        echo "❌ $display_name — NOT FOUND at $path"
        ((CHECKS_FAILED++))
        return 1
    fi
}

echo "📦 Required Commands:"
check_command "studio" "WordPress Studio CLI"
check_command "wp" "WordPress CLI"
check_command "bash" "Bash shell"
check_command "grep" "grep"
check_command "sed" "sed"

echo ""
echo "📍 Directories:"
check_directory "$HOME/.studio" "Studio config directory"

echo ""
echo "🧪 Optional (but recommended):"
check_command "git" "Git" || true
check_command "jq" "jq (JSON processor)" || true

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
