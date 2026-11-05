# WP-CLI Integration for WordPress Database Migration

This document explains the WP-CLI enhancement to the wp-db-migrate skill, including when to use it, how it works, and troubleshooting.

## Overview

The WP-CLI integration provides **safer URL replacement** and **comprehensive migration validation** by leveraging WordPress's native command-line tools. It complements the existing Studio CLI and bash-based migration scripts.

### Key Benefits

1. **Serialization-Safe URL Replacement**: `wp db search-replace` handles WordPress serialized data (arrays, objects) correctly, preventing corruption
2. **Pre/Post Migration Validation**: Automated health checks catch issues early
3. **Graceful Fallback**: If WP-CLI unavailable, scripts fall back to bash approach
4. **Dry-Run Mode**: Preview changes before applying them
5. **Safety-First Design**: All bash arrays (no eval, no string concatenation)

---

## When to Use WP-CLI

### Use WP-CLI When:

- **URL replacement is complex** — domain change, subpath changes, HTTP ↔ HTTPS transitions
- **You need serialization-safe handling** — plugins store URLs in serialized options
- **Validating migration health** — pre-flight checks, post-import verification
- **Plugin management during migration** — deactivate/activate plugins as needed
- **Working with WordPress Studio** — WP-CLI works alongside Studio CLI

### Fallback to Bash When:

- **WP-CLI not installed** (scripts automatically detect and warn)
- **Quick URL replacement** on simple http → https changes
- **Minimal dependencies** required

---

## File Structure

```
scripts/
├── lib-wp-cli.sh                    # Reusable WP-CLI wrapper library
├── wp-cli-search-replace.sh         # Safe URL replacement with dry-run
├── wp-cli-migration-checks.sh       # Pre/post migration validation
├── replace-urls.sh                  # Existing bash-based replacement
├── migrate-recovery.sh              # Existing migration workflow
└── preflight-check.sh               # Existing dependency check

prompts/
└── wp-cli-integration.md            # This file
```

---

## 1. WP-CLI Library (`lib-wp-cli.sh`)

### What It Does

Provides reusable functions for WP-CLI operations with safe bash array construction, error handling, and graceful fallback detection.

### Key Functions

```bash
# Initialization
wpcli_init                          # Initialize WP-CLI detection
wpcli_detect                        # Check if WP-CLI is available
wpcli_require                       # Require WP-CLI or fail

# WordPress checks
wpcli_check_health <site_path>      # Verify WordPress is healthy
wpcli_check_db_integrity <site>     # Check database integrity
wpcli_get_wp_version <site>         # Get WordPress version
wpcli_get_siteurl <site>            # Get site URL option

# Option management
wpcli_get_option <name> <site>      # Get option value
wpcli_set_option <name> <value> <site>  # Set option value

# Table management
wpcli_get_table_prefix <site>       # Get database table prefix
wpcli_get_tables <site>             # List all tables
wpcli_count_table_rows <table> <site>   # Count rows in table

# Plugin management
wpcli_plugin_exists <slug> <site>   # Check if plugin installed
wpcli_activate_plugin <slug> <site> # Activate plugin
wpcli_deactivate_plugin <slug> <site>   # Deactivate plugin

# Database operations
wpcli_export_db <file> <site>       # Export database
wpcli_import_db <file> <site>       # Import database
```

### Usage Example

```bash
#!/bin/bash
source "scripts/lib-wp-cli.sh"

# Initialize
wpcli_init

# Check WordPress health
if wpcli_check_health "/path/to/site"; then
    echo "WordPress is healthy"
fi

# Get table prefix
prefix=$(wpcli_get_table_prefix "/path/to/site")
echo "Table prefix: $prefix"

# Get row count
count=$(wpcli_count_table_rows "${prefix}posts" "/path/to/site")
echo "Post count: $count"
```

---

## 2. URL Search-Replace Script (`wp-cli-search-replace.sh`)

### What It Does

Safely replaces URLs in WordPress database using `wp db search-replace`, with dry-run mode and fallback to bash.

### Why WP-CLI for URL Replacement?

WordPress stores some data as **serialized PHP objects**:

```php
a:3:{
  s:9:"thumbnail";
  s:29:"https://example.old/image.jpg";
  s:5:"large";
  s:29:"https://example.old/image-lg.jpg";
}
```

**Bash `sed`** cannot safely update these (character count changes break serialization).

**WP-CLI `db search-replace`** detects serialization and updates safely.

### Usage

```bash
# Dry-run: preview what would change
./scripts/wp-cli-search-replace.sh --dry-run \
    /Users/ash/Studio/my-site \
    "https://old.dev" \
    "https://new.local"

# Apply the replacement
./scripts/wp-cli-search-replace.sh \
    /Users/ash/Studio/my-site \
    "https://old.dev" \
    "https://new.local"
```

### Output Examples

#### Dry-Run Mode

```
🔄 WordPress URL Replacement Tool
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Site Path:  /Users/ash/Studio/my-site
From:       https://old.dev
To:         https://new.local
Mode:       DRY RUN (no changes will be made)

🔍 Performing URL search-replace...

✓ wp_options: 47 replacements
✓ wp_posts: 1,234 replacements
✓ wp_postmeta: 5,678 replacements
...

✅ Dry run complete. No changes were made.

To apply these changes, run:
  ./scripts/wp-cli-search-replace.sh /Users/ash/Studio/my-site "https://old.dev" "https://new.local"
```

#### Actual Replacement

```
✅ Database updated:
   Old URL: https://old.dev
   New URL: https://new.local

Current siteurl: https://new.local
✓ URL replacement successful!
```

### Error Handling

- **WP-CLI not available**: Falls back to bash sed (with warning about serialization)
- **Site not found**: Validates path exists before operating
- **Database unreachable**: Detects connection issues
- **Verification failed**: Shows current siteurl and prompts to check manually

---

## 3. Migration Checks Script (`wp-cli-migration-checks.sh`)

### What It Does

Validates WordPress health before and after migration with optional baseline comparison.

### Pre-Migration Checks

Runs before importing the database:

1. ✅ WordPress installation healthy?
2. ✅ Database connection working?
3. ℹ WordPress version
4. ℹ Active plugin count
5. ✅ Disk space sufficient? (>1 GB recommended)
6. ✅ wp-content writable? (needed for backups)
7. 📊 Collects baseline metrics (post counts, user counts, etc.)

### Post-Migration Checks

Runs after importing:

1. ✅ WordPress still healthy?
2. ✅ Database integrity OK?
3. ℹ WordPress version
4. ℹ Plugin status
5. ℹ Site configuration (siteurl, home)
6. ✅ Administrator accounts present?
7. ℹ Content counts (posts, attachments)
8. 📊 Compares against baseline

### Usage

```bash
# Save baseline before migration
./scripts/wp-cli-migration-checks.sh --pre \
    /Users/ash/Studio/staging-copy \
    baseline-before.json

# After migration completes
./scripts/wp-cli-migration-checks.sh --post \
    /Users/ash/Studio/staging-copy \
    baseline-before.json
```

### Output Example

```
📋 PRE-MIGRATION HEALTH CHECKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  WordPress Installation
✓ WordPress installed and healthy

2️⃣  Database Connectivity
✓ Database connection OK

3️⃣  WordPress Version
ℹ WordPress version: 6.4.1

4️⃣  Active Plugins
ℹ Active plugins: 23
   Plugin Name          Status  Update
   Yoast SEO            active  -
   WooCommerce          active  -
   ...

5️⃣  Disk Space
✓ Disk space available: 156 GiB

6️⃣  Backup Capability
✓ wp-content is writable (backups possible)

📊 Collecting Baseline Metrics

ℹ Table wp_posts: 1,256 rows
ℹ Table wp_postmeta: 12,450 rows
ℹ Table wp_users: 42 rows
ℹ Table wp_usermeta: 108 rows
ℹ Table wp_terms: 234 rows
ℹ Table wp_termmeta: 89 rows
ℹ Table wp_options: 987 rows
ℹ Table wp_comments: 456 rows

💾 Saving Baseline to: baseline-before.json
✓ Baseline saved successfully
```

---

## 4. Integration Workflow

### Complete Migration with WP-CLI

```bash
#!/bin/bash

SITE_PATH="/Users/ash/Studio/production-local"
OLD_URL="https://production.example.com"
NEW_URL="https://production.local"

# Step 1: Pre-migration checks (saves baseline)
echo "🔍 Running pre-migration checks..."
./scripts/wp-cli-migration-checks.sh --pre "$SITE_PATH" baseline.json
if [ $? -ne 0 ]; then
    echo "Pre-migration checks failed!"
    exit 1
fi
echo ""

# Step 2: Standard migration (export → sanitize → import)
echo "📦 Importing database..."
./scripts/migrate-recovery.sh "$SITE_PATH" "$OLD_URL" "$NEW_URL"
if [ $? -ne 0 ]; then
    echo "Migration failed!"
    exit 1
fi
echo ""

# Step 3: URL replacement (WP-CLI, with dry-run first)
echo "🔄 Previewing URL replacement..."
./scripts/wp-cli-search-replace.sh --dry-run "$SITE_PATH" "$OLD_URL" "$NEW_URL"
echo ""

echo "Apply URL replacement? (y/n)"
read -r response
if [[ "$response" == "y" ]]; then
    ./scripts/wp-cli-search-replace.sh "$SITE_PATH" "$OLD_URL" "$NEW_URL"
fi
echo ""

# Step 4: Post-migration validation
echo "✅ Running post-migration checks..."
./scripts/wp-cli-migration-checks.sh --post "$SITE_PATH" baseline.json
if [ $? -ne 0 ]; then
    echo "Post-migration validation found issues. Review above."
fi
echo ""

echo "✨ Migration complete!"
```

---

## How URL Replacement Works

### The Problem: Serialized Data

WordPress options table stores arrays as **serialized PHP**:

```sql
mysql> SELECT option_name, option_value FROM wp_options WHERE option_name = 'my_urls';

+--------------+-------------------------------------------------------------------------------+
| option_name  | option_value                                                                  |
+--------------+-------------------------------------------------------------------------------+
| my_urls      | a:2:{s:3:"old";s:20:"https://example.old/"; s:3:"new";s:20:"https://new/"}   |
+--------------+-------------------------------------------------------------------------------+
```

### Why Bash `sed` Fails

If we use `sed 's|https://example.old|https://new.local|'`:

```
a:2:{s:3:"old";s:20:"https://new.local/"; s:3:"new";s:20:"https://new/"}
                      ↑ Length changed! Serialization is now broken
```

The `s:20:` says "this string is 20 bytes" but we changed it to 18. WordPress throws an error when decoding.

### How WP-CLI Handles It

`wp db search-replace` is WordPress-aware:

1. Detects serialized values
2. Decodes them to PHP
3. Replaces strings
4. Re-encodes with correct length markers
5. Stores back safely

---

## Troubleshooting

### WP-CLI Not Found

```
⚠ WP-CLI not found in PATH. Fallback to bash approach.
```

**Solution**: Install WP-CLI or add to PATH

```bash
# Install WP-CLI
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp

# Verify
wp --version
```

### WordPress Not Installed in Site

```
✗ WordPress installation has issues
```

**Troubleshooting**:

```bash
# Check if WordPress files exist
ls -la /path/to/site/wp-config.php

# Check database connection
wp db check --path=/path/to/site

# Check installation
wp core is-installed --path=/path/to/site
```

### URL Replacement Didn't Work

```
⚠ Current siteurl: https://old.dev
   Expected:        https://new.local
```

**Troubleshooting**:

```bash
# Run with verbose output
WP_DEBUG=1 ./scripts/wp-cli-search-replace.sh \
    /path/to/site \
    "https://old.dev" \
    "https://new.local"

# Manually check what's in database
wp option get siteurl --path=/path/to/site

# Try with only key tables first
wp db search-replace "https://old.dev" "https://new.local" \
    wp_options wp_posts wp_postmeta \
    --path=/path/to/site
```

### Baseline Comparison Failed

```
Post count differs significantly: 1,200 (baseline: 1,256)
```

**Possible causes**:

1. **Excluded tables during migration** — Check if `wp_posts` was excluded
2. **Incomplete import** — Re-run with `--force` flag
3. **Corrupted export** — Export was made during active writes

**Solution**:

```bash
# Check which tables were excluded
./scripts/migrate-recovery.sh /path/to/site "old" "new" --verbose

# Compare table contents manually
wp db tables --path=/path/to/site | grep -c "posts"
wp post count --path=/path/to/site
```

---

## Best Practices

### 1. Always Use Dry-Run First

```bash
# Preview before applying
./scripts/wp-cli-search-replace.sh --dry-run $SITE "$OLD" "$NEW"

# Review output carefully
# Then apply
./scripts/wp-cli-search-replace.sh $SITE "$OLD" "$NEW"
```

### 2. Save Baselines for Large Sites

```bash
# For databases >500 MB, baseline comparison is valuable
./scripts/wp-cli-migration-checks.sh --pre $SITE baseline.json

# After migration
./scripts/wp-cli-migration-checks.sh --post $SITE baseline.json
```

### 3. Deactivate Problematic Plugins During Migration

```bash
# From lib-wp-cli.sh
wpcli_deactivate_plugin "plugin-slug" "/path/to/site"

# Do migration
# Then re-activate
wpcli_activate_plugin "plugin-slug" "/path/to/site"
```

### 4. Test URL Replacement on Copy First

```bash
# Don't test on production
# Make a copy: cp -r /Studio/production /Studio/production-test

# Test on copy
./scripts/wp-cli-search-replace.sh --dry-run /Studio/production-test "$OLD" "$NEW"
```

### 5. Handle Subpath URLs Carefully

```bash
# Subpaths need careful handling
# OLD: https://example.com/staging
# NEW: https://staging.example.local

# Use exact URLs to avoid partial replacements
./scripts/wp-cli-search-replace.sh /path/to/site \
    "https://example.com/staging" \
    "https://staging.example.local"
```

---

## Examples

### Example 1: Production → Local

```bash
# Migrate production database to Studio local

# 1. Export from production (via SSH or backup download)
# 2. Prepare baseline
./scripts/wp-cli-migration-checks.sh --pre /Users/ash/Studio/prod baseline-prod.json

# 3. Import using standard migration
./scripts/migrate-recovery.sh \
    /Users/ash/Studio/prod \
    "https://production.example.com" \
    "https://production.local"

# 4. Preview URL changes
./scripts/wp-cli-search-replace.sh --dry-run \
    /Users/ash/Studio/prod \
    "https://production.example.com" \
    "https://production.local"

# 5. Apply URL replacement
./scripts/wp-cli-search-replace.sh \
    /Users/ash/Studio/prod \
    "https://production.example.com" \
    "https://production.local"

# 6. Validate migration
./scripts/wp-cli-migration-checks.sh --post /Users/ash/Studio/prod baseline-prod.json
```

### Example 2: Staging → Development

```bash
# Migrate staging to dev with plugin deactivation

# 1. Check pre-migration state
./scripts/wp-cli-migration-checks.sh --pre /Users/ash/Studio/dev-copy baseline-dev.json

# 2. Temporarily deactivate problematic plugins
source scripts/lib-wp-cli.sh
wpcli_init
wpcli_deactivate_plugin "woocommerce-subscriptions" "/Users/ash/Studio/dev-copy"

# 3. Standard migration
./scripts/migrate-recovery.sh \
    /Users/ash/Studio/dev-copy \
    "https://staging.lightspeedwp.dev" \
    "https://dev.local"

# 4. URL replacement with verification
./scripts/wp-cli-search-replace.sh \
    /Users/ash/Studio/dev-copy \
    "https://staging.lightspeedwp.dev" \
    "https://dev.local"

# 5. Re-activate plugins
wpcli_activate_plugin "woocommerce-subscriptions" "/Users/ash/Studio/dev-copy"

# 6. Final validation
./scripts/wp-cli-migration-checks.sh --post /Users/ash/Studio/dev-copy baseline-dev.json
```

### Example 3: HTTPS Migration Only

```bash
# Just adding HTTPS (same domain)

# FROM: http://example.local
# TO:   https://example.local

./scripts/wp-cli-search-replace.sh \
    /Users/ash/Studio/my-site \
    "http://example.local" \
    "https://example.local"
```

---

## Related Skills & References

- [WordPress Studio CLI docs](https://developer.wordpress.com/docs/developer-tools/studio/cli/)
- [WP-CLI official docs](https://developer.wordpress.com/docs/developer-tools/studio/cli/)
- [WP-CLI db search-replace](https://developer.wordpress.com/docs/developer-tools/studio/cli/) — Full reference
- [WordPress serialization](https://developer.wordpress.com/docs/wordpress-development/using-wordpress/data/)

---

*Last updated: 2026-10-29*
*Version: 1.0.0*
