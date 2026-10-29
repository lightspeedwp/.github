---
title: WordPress Studio CLI Guide for Database Migrations
description: Complete guide to using the WordPress Studio CLI with wp-db-migrate skill for database operations, site management, and migrations.
---

# WordPress Studio CLI Guide

Comprehensive guide for integrating WordPress Studio CLI with the `wp-db-migrate` skill for managing WordPress sites, databases, and migrations.

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [CLI Fundamentals](#cli-fundamentals)
3. [Using lib-studio.sh](#using-lib-studiosh)
4. [Interactive Site Manager](#interactive-site-manager)
5. [Database Operations](#database-operations)
6. [Common Workflows](#common-workflows)
7. [Troubleshooting](#troubleshooting)
8. [Reference](#reference)

---

## Installation & Setup

### Prerequisites

Before using Studio CLI with the wp-db-migrate skill, install:

1. **WordPress Studio CLI**
   ```bash
   curl -fsSL https://developer.wordpress.com/studio/cli/install.sh | bash
   ```
   Or see full instructions: https://developer.wordpress.com/docs/developer-tools/studio/cli/

2. **WordPress CLI**
   ```bash
   curl -fsSL https://wp-cli.org/installer.sh | bash
   ```

3. **Bash 4+** (macOS ships with Bash 3, update with Homebrew)
   ```bash
   brew install bash
   ```

### Verify Installation

```bash
# Check all required tools
./skill/scripts/preflight-check.sh
```

Expected output:
```
✅ WordPress Studio CLI
✅ WordPress CLI (wp)
✅ Bash shell
✅ grep, sed
✅ All checks passed! You're ready to migrate.
```

---

## CLI Fundamentals

### Basic Command Structure

```bash
studio <command> [subcommand] [options] [--path <site-path>]
```

### Key Commands Quick Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `studio create` | Create a new site | `studio create --name my-site` |
| `studio list` | List all local sites | `studio list` |
| `studio status` | Show site info | `studio status --path /path/to/site` |
| `studio start` | Start the server | `studio start --path /path/to/site` |
| `studio stop` | Stop the server | `studio stop --path /path/to/site` |
| `studio delete` | Remove a site | `studio delete /path/to/site` |
| `studio export` | Export site/database | `studio export backup.sql --mode db` |
| `studio import` | Import database/site | `studio import backup.sql` |
| `studio wp` | Run WP-CLI commands | `studio wp plugin list` |
| `studio config get/set` | View/change settings | `studio config set --php 8.2` |

### Global Options

```bash
# Set site path (no need to cd)
studio <command> --path /path/to/site

# Show help for any command
studio <command> --help
studio wp <command> --help
```

---

## Using lib-studio.sh

The `lib-studio.sh` library provides reusable functions for common Studio operations. Source it in your scripts:

```bash
#!/bin/bash
source ./skill/scripts/lib-studio.sh

# Now use library functions
studio_create_site "my-site" "/Users/ash/Studio/my-site" "my-site.local"
studio_backup_database "/Users/ash/Studio/my-site"
studio_replace_urls "/Users/ash/Studio/my-site" "old.dev" "new.dev"
```

### Available Functions

#### Validation & Checks

```bash
# Check if Studio CLI is available
check_studio_available

# Validate a site path
validate_site_path "/path/to/site"

# Check if path contains a Studio site
site_exists "/path/to/site"
```

#### Site Management

```bash
# List all sites
studio_list_sites

# Get site information
studio_get_site_info "/path/to/site"

# Get site URL
studio_get_site_url "/path/to/site"

# Get WordPress version
studio_get_wp_version "/path/to/site"

# Create new site
studio_create_site "site-name" "/path/to/site" "domain.local"

# Delete site
studio_delete_site "/path/to/site" false  # true = also delete files
```

#### Server Management

```bash
# Start/stop server
studio_start_server "/path/to/site"
studio_stop_server "/path/to/site"

# Get status
studio_server_status "/path/to/site"
```

#### Database Operations

```bash
# Backup database
studio_backup_database "/path/to/site" "backup.sql"

# Export database
studio_export_database "/path/to/site" "export.sql"

# Import database
studio_import_database "backup.sql" "/path/to/site"

# Replace URLs
studio_replace_urls "/path/to/site" "old-url.com" "new-url.com"

# Get table row counts
studio_get_table_counts "/path/to/site"
```

#### Plugin & Theme Management

```bash
# List plugins/themes
studio_list_plugins "/path/to/site"
studio_list_themes "/path/to/site"

# Activate/deactivate
studio_activate_plugin "hello-dolly" "/path/to/site"
studio_deactivate_plugin "hello-dolly" "/path/to/site"
studio_activate_theme "twentytwentyfour" "/path/to/site"
```

#### Configuration

```bash
# View config
studio_get_config "/path/to/site"

# Set versions
studio_set_wp_version "6.4.3" "/path/to/site"
studio_set_php_version "8.2" "/path/to/site"
```

#### WP-CLI Passthrough

```bash
# Run any WP-CLI command through Studio
studio_wp "/path/to/site" plugin list
studio_wp "/path/to/site" db query "SELECT COUNT(*) FROM wp_posts"
```

#### Logging Functions

The library includes colored output functions:

```bash
log_info "Informational message"
log_success "✅ Operation completed"
log_warning "⚠️  Be careful"
log_error "❌ Something failed"
log_debug "🔍 Debug info (if STUDIO_DEBUG=true)"
log_section "=== Major Section ==="
```

---

## Interactive Site Manager

The `studio-site-manager.sh` script provides a menu-driven interface for common tasks.

### Launch the Manager

```bash
# For current directory
./skill/scripts/studio-site-manager.sh

# For a specific site
./skill/scripts/studio-site-manager.sh /Users/ash/Studio/my-site
```

### Available Options

The menu includes:

| Category | Options |
|----------|---------|
| **Site Information** | Details, Configuration, List all sites |
| **Server Management** | Start, Stop, Status |
| **Database Operations** | Backup, Export, Import, Replace URLs, Row counts |
| **Plugin Management** | List, Activate, Deactivate |
| **Theme Management** | List, Activate |
| **Configuration** | Set WordPress version, Set PHP version |
| **Site Management** | Create new, Delete |
| **Export/Import** | Export full site, Import full site |

### Example Usage

```bash
# Open manager for a site
./skill/scripts/studio-site-manager.sh /Users/ash/Studio/staging

# Choose option 7 (Backup database)
# Follow the prompts
# Backup created: backup-20261029-143022.sql
```

---

## Database Operations

The `studio-db-operations.sh` script handles database-specific tasks with integration for migrations.

### Operations

#### Backup & Export

```bash
# Backup database (for recovery)
./studio-db-operations.sh backup /path/to/site [output-file]

# Export database (for processing)
./studio-db-operations.sh export /path/to/site [output-file]
```

#### Restore & Import

```bash
# Restore from backup
./studio-db-operations.sh restore /path/to/site backup.sql

# Preview before applying
./studio-db-operations.sh restore --dry-run /path/to/site backup.sql
```

#### Pre-Migration

```bash
# Create backup and show statistics before migration
./studio-db-operations.sh pre-migration /path/to/site [backup-file]

# Complete pre-migration checks (backup + counts + integrity)
./studio-db-operations.sh pre-migrate-check /path/to/site
```

#### Post-Migration Verification

```bash
# Verify migration success
./studio-db-operations.sh verify /path/to/site [original-export]

# Complete verification with row count comparison
./studio-db-operations.sh post-migrate-verify /path/to/site export.sql old.dev new.dev
```

#### URL Management

```bash
# Preview URL replacements (safe, read-only)
./studio-db-operations.sh dry-run-replace /path/to/site old-url.com new-url.com

# Apply URL replacements (requires confirmation)
./studio-db-operations.sh replace-urls /path/to/site old-url.com new-url.com

# Skip confirmation
./studio-db-operations.sh replace-urls /path/to/site old-url.com new-url.com --no-confirm
```

#### Analysis & Comparison

```bash
# Show row counts for key tables
./studio-db-operations.sh table-counts /path/to/site

# Compare current vs original counts
./studio-db-operations.sh compare-counts /path/to/site original-export.sql
```

---

## Common Workflows

### Workflow 1: Sync Staging to Local Studio

**Goal:** Bring staging database into local Studio for testing

```bash
# 1. Get staging backup
scp user@staging.example.com:/backups/staging-2026-10-29.sql.gz .

# 2. Create Studio site
studio create --name staging-test --path ~/Studio/staging-test

# 3. Pre-migration check
./studio-db-operations.sh pre-migrate-check ~/Studio/staging-test

# 4. Sanitize and import (using migrate-recovery.sh from skill)
./skill/scripts/migrate-recovery.sh \
  ~/Studio/staging-test \
  staging-2026-10-29.sql.gz \
  "https://staging.example.com" \
  "https://staging-test.local"

# 5. Post-migration verification
./studio-db-operations.sh post-migrate-verify \
  ~/Studio/staging-test \
  staging-2026-10-29.sql \
  "https://staging.example.com" \
  "https://staging-test.local"

# 6. Verify site loads
studio start --path ~/Studio/staging-test
# Open https://staging-test.local in browser
```

### Workflow 2: Local Development with Real Data

**Goal:** Work on site features with production data (sanitized)

```bash
# 1. Export production database
# (Do this on production server or through backup service)

# 2. Download backup locally
cd ~/Downloads
wget https://backups.example.com/prod-2026-10-29.sql.gz

# 3. Create development site
studio create --name prod-dev --path ~/Studio/prod-dev

# 4. Analyze before import
file prod-2026-10-29.sql.gz  # Check size
gunzip -l prod-2026-10-29.sql.gz  # Check uncompressed size

# 5. Pre-flight checks
./skill/scripts/preflight-check.sh

# 6. Run migration
./skill/scripts/create-and-migrate.sh \
  prod-dev \
  ~/Downloads/prod-2026-10-29.sql.gz \
  "https://example.com" \
  "https://prod-dev.local"

# 7. Start working
cd ~/Studio/prod-dev
# Edit code, test features
```

### Workflow 3: Backup Before Feature Testing

**Goal:** Create a restore point before testing risky changes

```bash
# 1. Open site manager
./studio-site-manager.sh ~/Studio/my-site

# 2. Choose option 7 (Backup database)
# Saves: backup-20261029-143022.sql

# 3. Make your changes, test features

# 4. If something breaks, restore:
./studio-db-operations.sh restore ~/Studio/my-site backup-20261029-143022.sql

# 5. Try again
```

### Workflow 4: Export for Staging Review

**Goal:** Export local changes to staging for review

```bash
# 1. Export database from local
./studio-db-operations.sh export ~/Studio/my-site local-changes.sql

# 2. Prepare for import on staging
# (May need to run sanitization if different DB structure)

# 3. Import on staging
# (Handled by staging admin or DevOps)

# 4. Test on staging, get feedback

# 5. If issues, export again and re-test
```

---

## Troubleshooting

### "WordPress Studio CLI not found"

**Problem:** Studio CLI is not installed or not in PATH

**Solution:**
```bash
# Install Studio CLI
curl -fsSL https://developer.wordpress.com/studio/cli/install.sh | bash

# Verify installation
studio --help

# If still not found, add to PATH
export PATH="$HOME/.studio/bin:$PATH"
```

### "Not a valid WordPress Studio site"

**Problem:** Path doesn't contain a Studio site

**Solution:**
```bash
# Check what's in the path
ls -la /path/to/site

# If empty or missing wp-config.php, create the site:
studio create --name my-site --path /path/to/site

# Verify
studio status --path /path/to/site
```

### "Import failed: Error in table wp_postmeta"

**Problem:** Large table causes import to fail

**Solution:**
```bash
# 1. Restore from backup (if available)
./studio-db-operations.sh restore /path/to/site backup.sql

# 2. Re-run migration excluding problem table
./skill/scripts/migrate-recovery.sh \
  /path/to/site \
  export.sql.gz \
  "old.com" \
  "new.local" \
  --exclude "wp_postmeta"

# 3. If still fails, try smaller batches or contact support
```

### "URL replacement didn't work"

**Problem:** Site still shows old URLs after replacement

**Solution:**
```bash
# 1. Check what's in the database
studio wp option get siteurl --path /path/to/site
studio wp option get home --path /path/to/site

# 2. Try dry-run first to see what would change
./studio-db-operations.sh dry-run-replace /path/to/site old.com new.local

# 3. If counts look right, apply it
./studio-db-operations.sh replace-urls /path/to/site old.com new.local

# 4. Check again
studio wp option get siteurl --path /path/to/site
```

### "Database corruption detected"

**Problem:** Import failed partway through, database may be corrupted

**Solution:**
```bash
# 1. Stop the server
studio stop --path /path/to/site

# 2. Restore from backup
./studio-db-operations.sh restore /path/to/site pre-migration-backup.sql

# 3. Verify restoration
./studio-db-operations.sh table-counts /path/to/site

# 4. Try import again with smaller table exclusions
# Or contact support with backup file
```

### "Too slow to start server"

**Problem:** Site takes forever to start (likely plugin issue)

**Solution:**
```bash
# 1. Try disabling all plugins
studio wp plugin deactivate --all --path /path/to/site

# 2. Start server
studio start --path /path/to/site

# 3. Re-enable plugins one by one
studio wp plugin activate plugin-name --path /path/to/site

# 4. Find which plugin is causing slowness, deactivate it
```

---

## Reference

### Environment Variables

```bash
# Enable debug output in lib-studio.sh functions
export STUDIO_DEBUG=true

# Custom Studio path (if not in default location)
export STUDIO_PATH="/path/to/studio"
```

### Common Flag Combinations

```bash
# Verbose output with debug
./studio-db-operations.sh backup /path/to/site --verbose --debug

# Dry run without confirmations
./studio-db-operations.sh replace-urls /path/to/site old.com new.local \
  --dry-run --no-confirm

# Restore without asking
./studio-db-operations.sh restore /path/to/site backup.sql --no-confirm
```

### File Locations

| File | Purpose |
|------|---------|
| `./skill/scripts/lib-studio.sh` | Reusable functions library |
| `./skill/scripts/studio-site-manager.sh` | Interactive menu |
| `./skill/scripts/studio-db-operations.sh` | Database operations |
| `./skill/scripts/create-and-migrate.sh` | Auto create + migrate |
| `./skill/scripts/migrate-recovery.sh` | Migration with recovery |
| `./skill/scripts/migrate-recovery-enhanced.sh` | Advanced migration |
| `./skill/scripts/replace-urls.sh` | URL replacement only |
| `./skill/scripts/verify-import.sh` | Post-import validation |

### Studio CLI Documentation

- **Official Docs:** https://developer.wordpress.com/docs/developer-tools/studio/cli/
- **Installation:** https://developer.wordpress.com/docs/developer-tools/studio/cli/install/
- **Commands:** `studio --help` or `studio <command> --help`

### Related Guides

- [WordPress Database Migration (MySQL to SQLite)](./skill/SKILL.md)
- [Pre-Flight Checks](./skill/scripts/README.md)
- [Testing Guide](./TESTING.md)

---

## Tips & Best Practices

1. **Always backup before migrations**
   ```bash
   ./studio-db-operations.sh backup /path/to/site pre-migration.sql
   ```

2. **Use dry-run for URL replacements**
   ```bash
   ./studio-db-operations.sh dry-run-replace /path/to/site old.com new.local
   ```

3. **Compare row counts before/after**
   ```bash
   ./studio-db-operations.sh table-counts /path/to/site
   ```

4. **Keep backups organized**
   ```bash
   # Backup to timestamped file
   ./studio-db-operations.sh backup /path/to/site \
     backups/backup-$(date +%Y%m%d-%H%M%S).sql
   ```

5. **Test on staging first**
   - Migrate to staging Studio site
   - Verify thoroughly
   - Then migrate production

6. **Document your workflow**
   - Keep notes of backup files
   - Record URL mappings
   - Log any issues

---

*Last updated: 2026-10-29*
*For issues or questions, see [Troubleshooting](#troubleshooting) or check the skill SKILL.md*
