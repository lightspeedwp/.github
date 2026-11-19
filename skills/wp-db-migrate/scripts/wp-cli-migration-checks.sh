#!/bin/bash
# wp-cli-migration-checks.sh — Pre/post migration validation checks
# Validates WordPress health before and after migration
# Usage: ./wp-cli-migration-checks.sh [--pre|--post] /path/to/site [baseline.json]

set -o pipefail

# Source the WP-CLI library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/lib-wp-cli.sh"

# Parse arguments
CHECK_MODE="post"  # Default to post-migration checks
SITE_PATH=""
BASELINE_FILE=""

# Helper function for usage
usage() {
    echo "Usage: $0 [--pre|--post] /path/to/site [baseline.json]"
    echo ""
    echo "Options:"
    echo "  --pre          Run pre-migration checks (saves baseline)"
    echo "  --post         Run post-migration checks (default)"
    echo ""
    echo "Examples:"
    echo "  # Save baseline before migration"
    echo "  $0 --pre /Users/ash/Studio/my-site baseline.json"
    echo ""
    echo "  # Validate after migration using baseline"
    echo "  $0 --post /Users/ash/Studio/my-site baseline.json"
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --pre)
            CHECK_MODE="pre"
            shift
            ;;
        --post)
            CHECK_MODE="post"
            shift
            ;;
        -*)
            wpcli_error "Unknown option: $1"
            usage
            ;;
        *)
            if [ -z "$SITE_PATH" ]; then
                SITE_PATH="$1"
            elif [ -z "$BASELINE_FILE" ]; then
                BASELINE_FILE="$1"
            else
                wpcli_error "Too many arguments"
                usage
            fi
            shift
            ;;
    esac
done

# Validate arguments
if [ -z "$SITE_PATH" ]; then
    wpcli_error "Missing site path argument"
    usage
fi

if [ ! -d "$SITE_PATH" ]; then
    wpcli_error "Site path does not exist: $SITE_PATH"
    exit 1
fi

# Initialize WP-CLI
wpcli_init

# Color codes (already defined in lib-wp-cli.sh, but make sure)
readonly CHECK_SUCCESS='\033[0;32m'
readonly CHECK_ERROR='\033[0;31m'
readonly CHECK_WARN='\033[1;33m'
readonly CHECK_INFO='\033[0;34m'
readonly CHECK_RESET='\033[0m'

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNED=0

# Helper to track check results
check_result() {
    local status="$1"
    local message="$2"

    case "$status" in
        pass)
            echo -e "${CHECK_SUCCESS}✓${CHECK_RESET} $message"
            ((CHECKS_PASSED++))
            ;;
        fail)
            echo -e "${CHECK_ERROR}✗${CHECK_RESET} $message"
            ((CHECKS_FAILED++))
            ;;
        warn)
            echo -e "${CHECK_WARN}⚠${CHECK_RESET} $message"
            ((CHECKS_WARNED++))
            ;;
        info)
            echo -e "${CHECK_INFO}ℹ${CHECK_RESET} $message"
            ;;
    esac
}

# ============================================================================
# PRE-MIGRATION CHECKS
# ============================================================================

run_pre_migration_checks() {
    echo "📋 PRE-MIGRATION HEALTH CHECKS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Check 1: WordPress installation
    echo "1️⃣  WordPress Installation"
    if wpcli_check_health "$SITE_PATH"; then
        check_result "pass" "WordPress installed and healthy"
    else
        check_result "fail" "WordPress installation has issues"
    fi
    echo ""

    # Check 2: Database connectivity
    echo "2️⃣  Database Connectivity"
    if wp db check --path="$SITE_PATH" &> /dev/null; then
        check_result "pass" "Database connection OK"
    else
        check_result "fail" "Database connection failed"
    fi
    echo ""

    # Check 3: Get WordPress version
    echo "3️⃣  WordPress Version"
    local wp_version
    wp_version=$(wpcli_get_wp_version "$SITE_PATH") || wp_version="unknown"
    check_result "info" "WordPress version: $wp_version"
    echo ""

    # Check 4: Active plugins
    echo "4️⃣  Active Plugins"
    local plugin_count
    plugin_count=$(wp plugin list --status=active --path="$SITE_PATH" --format=count 2>/dev/null || echo "unknown")
    if [ "$plugin_count" != "0" ]; then
        check_result "info" "Active plugins: $plugin_count"
        wp plugin list --status=active --path="$SITE_PATH" --format=table 2>/dev/null | head -n 5 | sed 's/^/   /'
    else
        check_result "warn" "No active plugins found"
    fi
    echo ""

    # Check 5: Disk space
    echo "5️⃣  Disk Space"
    local available_space
    available_space=$(df "$SITE_PATH" | awk 'NR==2 {print $4}')
    if [ "$available_space" -gt 1048576 ]; then  # >1GB available
        check_result "pass" "Disk space available: $(numfmt --to=iec-i --suffix=B "$available_space" 2>/dev/null || echo "${available_space} KB")"
    else
        check_result "warn" "Low disk space: $(numfmt --to=iec-i --suffix=B "$available_space" 2>/dev/null || echo "${available_space} KB")"
    fi
    echo ""

    # Check 6: Backup capability
    echo "6️⃣  Backup Capability"
    # Check if wp-content is writable (needed for backups)
    if [ -w "$SITE_PATH/wp-content" ]; then
        check_result "pass" "wp-content is writable (backups possible)"
    else
        check_result "warn" "wp-content is not writable (backups may fail)"
    fi
    echo ""

    # Collect baseline metrics
    echo "📊 Collecting Baseline Metrics"
    echo ""

    local -A baseline_data
    baseline_data["wordpress_version"]="$wp_version"
    baseline_data["timestamp"]="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    baseline_data["site_path"]="$SITE_PATH"

    # Get table counts
    local prefix
    prefix=$(wpcli_get_table_prefix "$SITE_PATH") || prefix="wp_"
    baseline_data["table_prefix"]="$prefix"

    # Get row counts for key tables
    for table in "posts" "postmeta" "users" "usermeta" "terms" "termmeta" "options" "comments"; do
        local table_name="${prefix}${table}"
        local row_count
        row_count=$(wpcli_count_table_rows "$table_name" "$SITE_PATH" 2>/dev/null || echo "0")
        baseline_data["${table}_rows"]="$row_count"
        check_result "info" "Table ${table_name}: $row_count rows"
    done
    echo ""

    # Save baseline if file specified
    if [ -n "$BASELINE_FILE" ]; then
        echo "💾 Saving Baseline to: $BASELINE_FILE"

        # Create JSON output using bash (no jq required)
        {
            echo "{"
            echo "  \"timestamp\": \"${baseline_data[timestamp]}\","
            echo "  \"site_path\": \"${baseline_data[site_path]}\","
            echo "  \"wordpress_version\": \"${baseline_data[wordpress_version]}\","
            echo "  \"table_prefix\": \"${baseline_data[table_prefix]}\","
            echo "  \"metrics\": {"
            local first=true
            for key in "${!baseline_data[@]}"; do
                if [[ "$key" == *"_rows" ]]; then
                    if [ "$first" = true ]; then
                        first=false
                    else
                        echo ","
                    fi
                    echo -n "    \"$key\": ${baseline_data[$key]}"
                fi
            done
            echo ""
            echo "  }"
            echo "}"
        } > "$BASELINE_FILE" || {
            wpcli_error "Failed to save baseline file"
            exit 1
        }

        check_result "pass" "Baseline saved successfully"
    fi
    echo ""
}

# ============================================================================
# POST-MIGRATION CHECKS
# ============================================================================

run_post_migration_checks() {
    echo "✅ POST-MIGRATION VALIDATION CHECKS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Check 1: WordPress installation still healthy
    echo "1️⃣  WordPress Installation"
    if wpcli_check_health "$SITE_PATH"; then
        check_result "pass" "WordPress installation OK"
    else
        check_result "fail" "WordPress installation has issues"
    fi
    echo ""

    # Check 2: Database integrity
    echo "2️⃣  Database Integrity"
    if wpcli_check_db_integrity "$SITE_PATH"; then
        check_result "pass" "Database integrity check passed"
    else
        check_result "fail" "Database integrity check failed"
    fi
    echo ""

    # Check 3: WordPress version (should be same or newer)
    echo "3️⃣  WordPress Version"
    local wp_version_after
    wp_version_after=$(wpcli_get_wp_version "$SITE_PATH") || wp_version_after="unknown"
    check_result "info" "WordPress version: $wp_version_after"
    echo ""

    # Check 4: Active plugins status
    echo "4️⃣  Active Plugins Status"
    local active_plugins
    active_plugins=$(wp plugin list --status=active --path="$SITE_PATH" --format=count 2>/dev/null || echo "unknown")
    check_result "info" "Active plugins: $active_plugins"

    # Check for broken plugins
    local broken_plugins
    broken_plugins=$(wp plugin list --status=inactive --path="$SITE_PATH" --format=count 2>/dev/null || echo "unknown")
    if [ "$broken_plugins" != "0" ] && [ "$broken_plugins" != "unknown" ]; then
        check_result "warn" "Inactive plugins detected: $broken_plugins (may indicate issues)"
    fi
    echo ""

    # Check 5: Site options
    echo "5️⃣  Site Configuration"
    local siteurl home_url
    siteurl=$(wpcli_get_siteurl "$SITE_PATH") || siteurl="(unable to retrieve)"
    home_url=$(wpcli_get_option "home" "$SITE_PATH" 2>/dev/null) || home_url="(unable to retrieve)"

    check_result "info" "siteurl: $siteurl"
    check_result "info" "home:    $home_url"

    if [[ "$siteurl" == "$home_url" ]]; then
        check_result "pass" "Site URL options are consistent"
    else
        check_result "warn" "Site URL options differ (may be intentional)"
    fi
    echo ""

    # Check 6: User counts
    echo "6️⃣  User Accounts"
    local user_count
    user_count=$(wp user list --path="$SITE_PATH" --format=count 2>/dev/null || echo "unknown")
    check_result "info" "Total users: $user_count"

    # Check for at least one admin user
    local admin_count
    admin_count=$(wp user list --role=administrator --path="$SITE_PATH" --format=count 2>/dev/null || echo "unknown")
    if [ "$admin_count" != "0" ]; then
        check_result "pass" "Administrator accounts present: $admin_count"
    else
        check_result "fail" "No administrator accounts found"
    fi
    echo ""

    # Check 7: Post/content counts
    echo "7️⃣  Content Status"
    local post_count published_count
    post_count=$(wp post list --path="$SITE_PATH" --format=count 2>/dev/null || echo "unknown")
    published_count=$(wp post list --post_status=publish --path="$SITE_PATH" --format=count 2>/dev/null || echo "unknown")

    check_result "info" "Total posts: $post_count"
    check_result "info" "Published posts: $published_count"

    if [ "$post_count" != "0" ]; then
        check_result "pass" "Content found in database"
    else
        check_result "warn" "No posts found (may be expected for fresh migrations)"
    fi
    echo ""

    # Check 8: Media library
    echo "8️⃣  Media Library"
    local attachment_count
    attachment_count=$(wp post list --post_type=attachment --path="$SITE_PATH" --format=count 2>/dev/null || echo "unknown")
    check_result "info" "Attachments: $attachment_count"
    echo ""

    # Compare with baseline if provided
    if [ -n "$BASELINE_FILE" ] && [ -f "$BASELINE_FILE" ]; then
        echo "📊 Comparing Against Baseline"
        echo ""
        check_result "info" "Baseline file: $BASELINE_FILE"

        # Extract values from baseline (simple parsing, no jq)
        local baseline_posts_rows baseline_users_rows baseline_posts_count
        baseline_posts_rows=$(grep -o '"posts_rows": [0-9]*' "$BASELINE_FILE" | cut -d: -f2 | tr -d ' ' 2>/dev/null || echo "0")
        baseline_users_rows=$(grep -o '"users_rows": [0-9]*' "$BASELINE_FILE" | cut -d: -f2 | tr -d ' ' 2>/dev/null || echo "0")

        if [ -n "$baseline_posts_rows" ] && [ "$baseline_posts_rows" != "0" ]; then
            local diff=$((post_count - baseline_posts_rows))
            if [ $diff -eq 0 ]; then
                check_result "pass" "Post count matches baseline: $post_count rows"
            elif [ $((diff * 100 / baseline_posts_rows)) -lt 5 ]; then
                check_result "warn" "Post count differs slightly: $post_count (baseline: $baseline_posts_rows)"
            else
                check_result "fail" "Post count differs significantly: $post_count (baseline: $baseline_posts_rows)"
            fi
        fi

        if [ -n "$baseline_users_rows" ] && [ "$baseline_users_rows" != "0" ]; then
            local user_diff=$((user_count - baseline_users_rows))
            if [ $user_diff -eq 0 ]; then
                check_result "pass" "User count matches baseline: $user_count rows"
            elif [ $((user_diff * 100 / baseline_users_rows)) -lt 10 ]; then
                check_result "warn" "User count differs slightly: $user_count (baseline: $baseline_users_rows)"
            else
                check_result "fail" "User count differs significantly: $user_count (baseline: $baseline_users_rows)"
            fi
        fi
        echo ""
    fi

    # Final summary
    echo "🔍 Common Issues to Check Manually"
    echo ""
    echo "If you see warnings, verify:"
    echo "  1. Images/media display correctly (broken images = URL replacement issue)"
    echo "  2. Plugin functionality works as expected"
    echo "  3. Custom post types and taxonomies display correctly"
    echo "  4. Search functionality works"
    echo "  5. Admin interface loads without JavaScript errors"
    echo ""
    echo "To run a deeper check:"
    echo "  wp core verify-checksums --path=$SITE_PATH"
    echo "  wp db tables --path=$SITE_PATH"
    echo ""
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

echo ""
echo "🚀 WordPress Migration Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Site: $SITE_PATH"
echo "Mode: $(echo $CHECK_MODE | tr 'a-z' 'A-Z')"
echo ""

case "$CHECK_MODE" in
    pre)
        run_pre_migration_checks
        ;;
    post)
        run_post_migration_checks
        ;;
    *)
        wpcli_error "Unknown check mode: $CHECK_MODE"
        exit 1
        ;;
esac

# Print final summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📈 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "  ${CHECK_SUCCESS}Passed:${CHECK_RESET}   $CHECKS_PASSED"
echo -e "  ${CHECK_ERROR}Failed:${CHECK_RESET}   $CHECKS_FAILED"
echo -e "  ${CHECK_WARN}Warned:${CHECK_RESET}   $CHECKS_WARNED"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    wpcli_success "All checks passed!"
    exit 0
else
    wpcli_error "Some checks failed. Review above for details."
    exit 1
fi
