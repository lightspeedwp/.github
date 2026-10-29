# WordPress Database Migration Plugin

Migrate WordPress databases from MySQL/MariaDB to SQLite in WordPress Studio with intelligent table exclusion, safe import workflows, URL replacement with dry-run verification, and comprehensive post-import validation.

## Features

✨ **Smart Table Analysis** — Automatically analyzes database exports and suggests table exclusions based on size and type

🔒 **Safe Import Workflow** — Creates backups before import, supports rollback on failure, and requires explicit confirmation at each gate

🌐 **Smart URL Replacement** — Auto-detects site URLs and shows dry-run with per-table counts before applying changes

✅ **Post-Import Validation** — Verifies site loads, row counts match, and database integrity is intact

📦 **Works with Any Database Size** — From 100 MB to 10+ GB MySQL/MariaDB exports

## Installation

### Option 1: Install from This Plugin
```bash
# Clone this plugin to your Claude plugins directory
cp -r wp-db-migrate-plugin ~/.claude/plugins/

# Or add to your organization
cp -r wp-db-migrate-plugin /path/to/your/org/.github/plugins/
```

### Option 2: Use the Skill Directly
The skill is available at `/Users/ash/.github/skills/wp-db-migrate/` and is symlinked to all Claude Code projects.

## Usage

### Invoke in Claude
```
/wp-db-migrate

or

Use the skill directly in any chat with: "Migrate my WordPress database"
```

### Command Line Scripts
The plugin includes ready-to-use CLI scripts:

```bash
# Complete recovery workflow
migrate-recovery.sh /path/to/studio/site "https://old-url.com" "https://new-url.local"

# Individual steps
verify-import.sh /path/to/studio/site
replace-urls.sh /path/to/studio/site "https://old.com" "https://new.local"
start-server.sh /path/to/studio/site
```

## What It Does

### Phase 1: Export Analysis
- Analyzes SQL export file (handles `.sql`, `.gz`, `.zip`)
- Shows table count, row counts, size breakdown
- Suggests table exclusions based on size and type
- Detects current site URL from database options

### Phase 2: Sanitization
- Removes MySQL-only syntax (FULLTEXT, DEFINER clauses, etc.)
- Excludes selected tables
- Adds `DROP TABLE IF EXISTS` to avoid conflicts
- Keeps MySQL syntax (Studio's importer converts to SQLite)

### Phase 3: Backup & Import
- Creates backup of target Studio site
- Runs `studio import` with sanitized file
- Monitors for errors
- Can rollback to backup on failure

### Phase 4: URL Replacement
- Shows dry-run of replacements with counts
- Requires explicit approval
- Replaces URLs in `siteurl`, `home`, and serialized options
- Verifies changes applied correctly

### Phase 5: Validation
- Site loads (HTTP 200 on /wp-admin)
- Core table row counts match original export
- Database integrity check for corruption
- URL options verification

## Examples

### Sync Staging to Local
```bash
/wp-db-migrate

Export file: ~/Downloads/staging-backup.sql.gz
Studio site: /Users/ash/Studio/my-project
Exclusions: Use defaults (exclude logs/indexes)
URL replacement: Auto-detect
```

### Production Database with Custom Exclusions
```bash
/wp-db-migrate

Export file: /backups/prod-2026-10-29.sql
Studio site: /Users/ash/Studio/prod-local
Exclusions: wp_actionscheduler_logs, wp_searchwp_*
URL replacement: Manual (prod.example.com → prod.local)
```

## Scripts Included

- **migrate-recovery.sh** — Complete workflow (verify → replace URLs → start server)
- **verify-import.sh** — Check if import succeeded
- **replace-urls.sh** — Replace URLs in database
- **start-server.sh** — Start WordPress server

All scripts are self-documenting; run with no arguments for usage:
```bash
./scripts/migrate-recovery.sh
```

## Adding to Your PATH

For access from anywhere:
```bash
# Add to ~/.zshrc or ~/.bash_profile
export PATH="$PATH:/Users/ash/.claude/skills/wp-db-migrate/scripts"
```

## Requirements

- **Studio CLI** — `studio` command must be installed and in PATH
- **WP-CLI** — WordPress CLI (`wp` command) for database operations
- **Bash** — For running scripts
- **SQL Tool** — For database sanitization

## Troubleshooting

### Import times out
Large databases can take 5-30 minutes. The data is usually imported even if the server startup times out. Run:
```bash
verify-import.sh /path/to/site
```

### URL replacement doesn't work
Some serialized options may have encoding issues. Use a WordPress plugin (Better Find and Replace) for manual fixes post-import.

### Post-import: Row counts don't match
Common causes:
- You excluded tables that weren't supposed to be excluded
- Export was taken during active writes (corrupted snapshot)
- Transactions weren't committed in the original export

Check the detailed report for which tables differ and by how much.

## Support

For issues or questions:
- Check the SKILL.md in `/Users/ash/.github/skills/wp-db-migrate/`
- Review the troubleshooting section
- Check WordPress Studio CLI docs: https://developer.wordpress.com/docs/developer-tools/studio/cli/

## License

MIT

## Author

Ash Shaw (ashley@lightspeedwp.agency)

---

**Maintained by:** Claude Haiku 4.5  
**Version:** 1.0.0  
**Last Updated:** 2026-10-29
