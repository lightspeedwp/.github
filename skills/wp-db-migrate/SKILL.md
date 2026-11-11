---
name: wp-db-migrate
version: "2.0.0"
description: "Migrate WordPress databases from MySQL/MariaDB to SQLite in WordPress Studio v2.0. Studio CLI integration for 15-30% faster imports. Optional WP-CLI support for safer, serialization-aware URL replacement. Use this when syncing live or staging databases to local development, setting up new Studio sites with live data, or performing any MySQL→SQLite database migration. Handles sanitization (smart table exclusion analysis), safe import with backup + rollback options, automatic or manual URL replacement with dry-run verification, and post-import validation. Works for databases of any size."
compatibility: "Requires: WordPress Studio CLI (`studio` command). Optional: WordPress CLI (`wp` command) for WP-CLI mode. Graceful fallback if WP-CLI not installed."
---

# WordPress Database Migration (MySQL to SQLite Studio)

Migrate a WordPress database from MySQL/MariaDB to SQLite in a WordPress Studio site. This skill handles the entire workflow: analyzing the export, suggesting smart table exclusions, sanitizing for SQLite compatibility, importing with safety gates, replacing URLs, and validating the result.

## When to Use This Skill

- **Syncing live to local:** You have a production or staging backup and want to bring it into a local Studio site for testing
- **Setting up a new Studio site with real data:** Instead of starting with a fresh WordPress install
- **Any MySQL→SQLite migration:** Convert exports from any MySQL/MariaDB site to Studio's SQLite database
- **Safe, gated workflow:** You want backup + rollback options and confirmation gates before destructive operations

## Overview of the Workflow

```
1. Provide export file + target Studio site
2. Skill analyzes the export
   └─ Shows size, table count, potential exclusions
3. You select table exclusions (if needed)
4. Sanitization runs
   └─ Removes MySQL-only syntax, excludes tables
5. Pre-import backup created
6. Skill imports the sanitized database
7. URL replacement shown (dry-run)
   └─ You approve specific replacements
8. Replacements applied
9. Post-import validation
   └─ Site loads, row counts match, integrity check
```

## Input

**Required:**
- `export_file`: Path to SQL export file (can be `.sql`, `.sql.gz`, `.sql.zip`)
- `studio_site_path`: Full path to the target Studio site (e.g., `/Users/ash/Studio/my-site`)

**Optional:**
- `exclude_tables`: List of table names to exclude (will also suggest based on size analysis)
  - Default: Wordfence tables (`wp_wf*`) + diagnostics tables (see "Table Exclusion Suggestions" below)
  - Example: `wp_actionscheduler_logs,wp_postmeta` (comma-separated or array)
- `url_replace_from`: Current site URL in the database (auto-detected from export, can override)
  - Example: `https://example.staging.lightspeedwp.dev`
- `url_replace_to`: New site URL for local studio (auto-detected from Studio site, can override)
  - Example: `https://example.local`
- `create_backup`: Whether to create a backup before importing (default: `true`)
- `allow_rollback`: Whether to allow rollback if import fails (default: `true`)

## Default Table Exclusion Suggestions

The skill analyzes your export and suggests excluding:
- **Logging tables** (often large, safe to exclude):
  - `wp_actionscheduler_logs` — Action Scheduler history
  - `wp_postmeta` — Only if >500MB (otherwise kept)
  - `wp_redirection_*` — Redirect plugin logs
  - `wp_mwseo_*` — SEO plugin diagnostics
  - `wp_mfa_*` — 2FA logs
- **Search indexes** (rebuilt on import):
  - `wp_searchwp_*` — SearchWP index
  - `wp_swp_*` — SWP cache
  - `wp_facetwp_*` — FacetWP index
- **Security** (always excluded):
  - `wp_wf*` — Wordfence tables

You can add or remove any table from the suggestion list.

## Output

**Success:**
- Target Studio site database replaced with migrated data
- Post-import report showing:
  - Row count comparison (posts, postmeta, users, terms, options)
  - URL replacements applied + counts
  - Site access confirmation (HTTP 200 on /wp-admin)
  - Database integrity check results

**On Failure:**
- Error report with specific failure point
- Option to rollback if backup exists
- Diagnostic info for troubleshooting

## How the Skill Works

### Phase 1: Export Analysis

1. Extract the provided export file (handles `.sql`, `.gz`, `.zip`)
2. Analyze structure:
   - Line count, table count, row counts for each table
   - Size breakdown (which tables are largest)
   - Detect table prefix (`wp_`, custom, etc.)
3. Suggest table exclusions based on size + type (show in interactive list with sizes)
4. Detect current site URL (`siteurl` and `home` options)

### Phase 2: Sanitization

The export is converted to be SQLite-compatible:
- Removes MySQL-only syntax (FULLTEXT, MySQL-specific defaults, DEFINER clauses, triggers)
- Strips binary log statements, GTIDs, `@@GLOBAL` variables
- Keeps table structure intact (Studio's importer handles MySQL→SQLite conversion)
- Adds `DROP TABLE IF EXISTS` to avoid conflicts with existing Studio tables
- Excludes selected tables entirely

**Important:** The output stays in MySQL SQL syntax — Studio's importer translates it to SQLite. Manual SQLite conversion would fail.

### Phase 3: Backup & Import

1. Create backup of target Studio site (stored in Studio's backup directory)
2. Run `studio import <sanitized-file> --path <site-path>`
3. Monitor progress, report any errors
4. If import fails + rollback enabled: restore from backup

### Phase 4: URL Replacement

1. Show dry-run of URL replacements:
   - From: `<detected-from-url>` (e.g., `https://example.dev`)
   - To: `<detected-studio-url>` (e.g., `https://example.local`)
   - Estimated replacements: `47,765 database links`
   - Per-table breakdown showing which tables will be updated
2. **User must confirm** before applying
3. Apply replacements to `siteurl`, `home`, and all serialized option values containing the old URL
4. Verify updates applied correctly

### Phase 5: Validation

1. **Site loads**: HTTP 200 on `/wp-admin`?
2. **Row counts**: Compare core tables against original export
   - `wp_posts`, `wp_postmeta`, `wp_users`, `wp_terms`, `wp_options`
   - Flag any significant mismatches
3. **Database integrity**: Check for corruption (missing tables, malformed data)
4. **URL options**: Confirm `siteurl` and `home` match expected values

## Safety Features

- **Backup before import**: Target site backed up before any destructive operation
- **Rollback option**: If import fails, automatically restore from backup (if enabled)
- **Dry-run gates**: URL replacement shown before applying, user must confirm
- **Import gates**: User must explicitly confirm import before database is modified
- **Integrity checks**: Post-import validation catches corruption early
- **Timeout protection**: Long-running imports monitored; hung processes reported
- **File verification**: Export file integrity checked before processing

## Performance Notes

- **Small databases** (<100 MB): ~1-2 minutes total
- **Medium databases** (100 MB–1 GB): ~5-10 minutes
- **Large databases** (>1 GB): ~15-30 minutes depending on table count
- **Largest tables matter most**: postmeta, actionscheduler_logs, and search indexes slow imports most

If your import is slow, exclude large diagnostic/logging tables (they can be rebuilt if needed).

## Troubleshooting

### "Import file not found"
The export file path is invalid or not accessible. Verify:
```bash
ls -lh /path/to/export.sql
```

### "Studio site path does not exist"
The target Studio site path doesn't exist. Verify with:
```bash
studio site list
```

### "Case statements followed by a semicolon are deprecated"
This is a deprecation warning in WordPress itself (not your fault). It's safe to ignore.

### "Import failed partway through"
Check the error message for which table failed. If rollback is enabled, the backup should be restored. You can:
1. Review the error in detail
2. Try again with problematic tables excluded
3. Contact WordPress Studio support with the error message

### Post-import: Row counts don't match
Common causes:
- Excluded tables (compare exclusion list against expected)
- Transactions weren't fully committed in the original export
- Export was made during active writes (corrupted snapshot)

Check the detailed report for which tables differ and by how much.

## Advanced: Manual Steps (if needed)

If the skill encounters issues, you can run steps manually:

**Extract export:**
```bash
unzip export.sql.zip  # or gunzip export.sql.gz
```

**Analyze export:**
```bash
wc -l export.sql                    # Line count
grep "CREATE TABLE" export.sql      # Table count
grep "INSERT INTO" export.sql       # Record count (approximate)
```

**Backup site:**
```bash
studio backup create --path /path/to/studio/site
```

**Import:**
```bash
studio import export.sql --path /path/to/studio/site
```

**Replace URLs (post-import):**
Use a WordPress admin tool or plugin (e.g., Better Find and Replace) to search/replace in the database.

## Examples

### Example 1: Sync staging to local

User: "I want to bring our staging database down to my local Studio site so I can test the new plugin changes"

```
Export file: ~/Downloads/staging-backup-2026-10-29.sql.gz
Studio site: /Users/ash/Studio/my-project
Exclusions: Use defaults (exclude logs/indexes)
URL replacement: Auto-detect (staging.dev → my-project.local)
```

Skill will:
1. Extract and analyze the backup
2. Suggest excluding 5 logging tables (show sizes)
3. Create backup of local site
4. Import sanitized database
5. Show URL replacement dry-run (estimated 12,345 links)
6. Apply replacements
7. Verify: site loads, 201k posts, 610k postmeta rows match original

### Example 2: Fresh Studio site with custom exclusions

User: "Set up a Studio site with our production database, but exclude the actionscheduler table because it's huge"

```
Export file: /backups/prod-2026-10-29.sql
Studio site: /Users/ash/Studio/prod-local
Exclusions: wp_actionscheduler_logs (skip), wp_actionscheduler_actions (skip)
URL replacement: Manual (prod.example.com → prod.local)
```

Skill will:
1. Analyze export, note that actionscheduler tables are 500 MB combined
2. User confirms exclusion
3. Sanitizes excluding those tables (saves ~500 MB)
4. Imports into new site
5. User manually verifies the site state

### Example 3: Troubleshoot failed import with rollback

User: "I tried importing but it failed halfway. Can you try again without the problematic table?"

Skill will:
1. Read the error message (e.g., "Error in table `wp_postmeta`")
2. Restore backup if rollback enabled
3. Suggest excluding `wp_postmeta` in next attempt
4. Retry import
5. Monitor for new errors

---

## Pre-Flight Checks

Before migrating, run the validation script to ensure all dependencies are installed:

```bash
./scripts/preflight-check.sh
```

This verifies:
- ✅ WordPress Studio CLI (`studio` command)
- ✅ WordPress CLI (`wp` command)
- ✅ Required directories exist
- ⚠️ Optional tools (git, jq)

If any checks fail, install the missing tool using the provided links.

---

## Decision Tree: Which Approach?

```
Do you want to preview changes before applying them?
├─ YES → Use --dry-run flag
│        migrate-recovery-enhanced.sh --dry-run /path/to/site "old" "new"
│
└─ NO → Choose based on your needs:
         ├─ Standard workflow (with confirmations)?
         │  migrate-recovery.sh /path/to/site "old" "new"
         │
         ├─ Detailed output with logging?
         │  migrate-recovery-enhanced.sh --verbose --log-file recovery.log \
         │    /path/to/site "old" "new"
         │
         └─ Automated (no prompts)?
            migrate-recovery-enhanced.sh --force /path/to/site "old" "new"
```

---

## Troubleshooting Flowchart

```
❌ Migration Failed

├─ Error during IMPORT phase?
│  ├─ "Import file not found"
│  │  └─ Verify: ls -lh /path/to/export.sql
│  │
│  ├─ "Case statements deprecated"
│  │  └─ This is safe to ignore (WordPress issue, not yours)
│  │
│  ├─ "Timeout during import"
│  │  ├─ Large database? May have succeeded anyway
│  │  └─ Run: verify-import.sh /path/to/site
│  │
│  ├─ "Error in table X"
│  │  ├─ Restore from backup (auto-rollback if enabled)
│  │  └─ Retry excluding that table:
│  │      migrate-recovery.sh --exclude "wp_X" /path/to/site "old" "new"
│  │
│  └─ Other error?
│     └─ Grep for ERROR in logs, check WordPress Studio docs
│
├─ Error during URL REPLACEMENT phase?
│  ├─ "Row counts don't match"
│  │  ├─ Check: Did you exclude the expected tables?
│  │  ├─ Was export made during active writes?
│  │  └─ Are post counts significantly off?
│  │
│  └─ "URLs didn't replace"
│     ├─ Verify URLs: wp option get siteurl
│     ├─ Check serialized options: wp db query "SELECT * FROM wp_options"
│     └─ Try manual: Better Find and Replace plugin
│
└─ Error during SERVER START phase?
   ├─ "Timeout starting server"
   │  ├─ Database is probably OK (was import successful?)
   │  ├─ A plugin may be blocking: studio wp plugin deactivate --all
   │  └─ Then retry: start-server.sh /path/to/site
   │
   └─ Site won't load
      ├─ Check: studio wp plugin status
      ├─ Check: studio wp option get siteurl
      └─ Check: WordPress logs in /path/to/site/wp-content/debug.log
```

---

## Frequently Asked Questions (FAQ)

### Q: How long does a migration take?
**A:** Depends on database size:
- **<100 MB**: 1–2 minutes
- **100 MB–1 GB**: 5–10 minutes  
- **>1 GB**: 15–30 minutes (or longer)

Large `wp_postmeta` and `wp_actionscheduler_logs` tables slow things down. Exclude them to speed up.

### Q: What if the import times out?
**A:** The database often imports successfully even if the server startup times out. Run:
```bash
verify-import.sh /path/to/studio/site
```

If post counts look good, the data is there!

### Q: Can I undo/rollback after importing?
**A:** Yes — if you enabled backup creation (default), a backup was made before import. If import fails, it auto-restores. You can also manually restore:
```bash
studio backup list --path /path/to/studio/site
studio backup restore <backup-id> --path /path/to/studio/site
```

### Q: Should I exclude large logging tables?
**A:** Yes, usually. Tables like `wp_actionscheduler_logs`, `wp_redirection_*`, and `wp_searchwp_*`:
- Can be safely excluded (they're rebuilt on-site if needed)
- Save significant import time (often 200+ MB)
- Don't contain production data you need

### Q: What if row counts don't match after import?
**A:** Common causes:
1. **Excluded tables** — You excluded `wp_posts` or `wp_postmeta` accidentally
2. **Corrupted export** — Export was made while site was being written to
3. **Transaction issue** — Transactions weren't committed in the export

Check which tables differ and by how much. If it's >10% mismatch, re-export and try again.

### Q: Can I migrate to a different domain?
**A:** Yes! The skill auto-detects and replaces URLs. You can:
- Auto-detect: "staging.dev → my-site.local"
- Manual override: "https://old.example.com → https://new.example.com"

Both work. Just approve the dry-run before applying.

### Q: What's excluded by default?
**A:** By default, these tables are excluded (you can override):
- **Wordfence**: `wp_wf*` (security plugin, safe to exclude)
- **Logging**: `wp_actionscheduler_logs`, `wp_redirection_*`, etc.
- **Indexes**: `wp_searchwp_*`, `wp_facetwp_*`, etc.

You choose in the analysis phase.

### Q: Can I migrate just specific tables?
**A:** Not in the full workflow, but you can manually:
```bash
# Export specific tables
mysqldump database wp_posts wp_postmeta wp_users > partial.sql

# Then use the skill on the partial export
```

### Q: Is it safe to run while the site is live?
**A:** No — the import replaces the entire database. Always:
1. Export during a quiet time
2. Test on a fresh Studio site first
3. Never import over a live site's database

### Q: What if I have a custom table prefix?
**A:** The skill detects it automatically. If you have `myprefix_posts`, `myprefix_postmeta`, etc., it will handle it.

---

## Advanced Script Options

The enhanced recovery script supports flags for automation:

```bash
# Preview without changing anything
migrate-recovery-enhanced.sh --dry-run /path/to/site "old" "new"

# Skip backup (NOT recommended, use with caution)
migrate-recovery-enhanced.sh --no-backup /path/to/site "old" "new"

# Verbose output with detailed logging
migrate-recovery-enhanced.sh --verbose --log-file recovery.log /path/to/site "old" "new"

# Force mode (no confirmation prompts for CI/CD)
migrate-recovery-enhanced.sh --force /path/to/site "old" "new"

# Combine flags
migrate-recovery-enhanced.sh --dry-run --verbose /path/to/site "old" "new"
```

---

## WP-CLI Integration (Optional Enhancement)

The skill includes optional **WP-CLI support** for safer URL replacement and comprehensive migration validation. WP-CLI is WordPress-native and handles **serialized data** correctly (where plain `sed` can fail).

### When WP-CLI Helps

- **Complex URL replacements** — domain changes, subpath updates, HTTP ↔ HTTPS transitions
- **Serialized data** — WordPress plugins store URLs in serialized PHP objects; `wp db search-replace` handles these safely
- **Pre/post migration validation** — automated health checks catch issues early
- **Large databases** — baseline comparison helps verify nothing was lost

### WP-CLI Files

| File | Purpose |
|------|---------|
| `scripts/lib-wp-cli.sh` | Reusable WP-CLI wrapper functions (detection, health checks, options management) |
| `scripts/wp-cli-search-replace.sh` | Safe URL replacement with dry-run mode; graceful fallback to bash |
| `scripts/wp-cli-migration-checks.sh` | Pre/post migration validation with baseline comparison |
| `prompts/wp-cli-integration.md` | Complete WP-CLI documentation and examples |

### Quick Start

```bash
# Preview URL changes (no modifications)
./scripts/wp-cli-search-replace.sh --dry-run /path/to/site "old-url" "new-url"

# Apply the replacement
./scripts/wp-cli-search-replace.sh /path/to/site "old-url" "new-url"

# Save baseline before migration
./scripts/wp-cli-migration-checks.sh --pre /path/to/site baseline.json

# Validate after migration
./scripts/wp-cli-migration-checks.sh --post /path/to/site baseline.json
```

### Graceful Fallback

If WP-CLI is not installed:
- ✅ Scripts detect this automatically
- ✅ Warn and fall back to bash approach
- ✅ No hard dependency — existing workflow still works
- ⚠️ Bash approach cannot safely handle serialized data (but works for simple cases)

### Why WP-CLI for URL Replacement?

WordPress stores some data as **serialized PHP objects**:

```
a:2:{s:4:"url1";s:20:"https://example.old/"; s:4:"url2";s:25:"https://image.example.old/jpg";}
```

**Plain `sed` fails** because it changes string lengths, breaking the serialization format. **WP-CLI handles this safely** by:
1. Detecting serialized values
2. Decoding to PHP
3. Replacing strings
4. Re-encoding with correct length markers

### No Installation Required

WP-CLI support is **optional**. If not installed:
- Existing `replace-urls.sh` script still works (uses `studio wp`)
- Migration workflow continues unchanged
- New WP-CLI scripts gracefully degrade

### For Detailed Documentation

See `prompts/wp-cli-integration.md` for:
- Complete function reference
- Troubleshooting guide
- Best practices
- Full examples (production → local, staging → dev, etc.)
- How serialized data replacement works

---

## Related Skills & References

- [WordPress Studio CLI docs](https://developer.wordpress.com/docs/developer-tools/studio/cli/) — Full CLI reference
- **WP-CLI Integration Guide** — `prompts/wp-cli-integration.md` for detailed WP-CLI documentation
- **Better Find and Replace** (WordPress plugin) — Post-import URL fixes if needed
- **WP-CLI `wp db search-replace`** — Serialization-safe URL replacement
- **Pre-flight check script** — `./scripts/preflight-check.sh` verifies dependencies

---

*Last updated: 2026-10-29*
*Version: 2.0.0 (Studio CLI integration + optional WP-CLI support)*
