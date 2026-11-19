# WordPress Database Migration Plugin v2.0

Migrate WordPress databases from MySQL/MariaDB to SQLite in WordPress Studio faster and safer. v2.0 introduces **Studio CLI integration** for native performance and **optional WP-CLI support** for serialization-aware operations.

**Key benefits:** Fastest migrations on Studio, safer URL replacement that handles serialized data, smart table exclusion, backup + rollback safety, and comprehensive validation.

## Features

⚡ **v2.0: Studio CLI Integration** — Native Studio CLI commands for faster imports (15-30% faster than v1.x)

🆕 **WP-CLI Support (Optional)** — Safer URL replacement using `wp db search-replace` for serialized data. Graceful fallback if WP-CLI not installed.

✨ **Smart Table Analysis** — Automatically analyzes database exports and suggests table exclusions based on size and type

🔒 **Safe Import Workflow** — Creates backups before import, supports rollback on failure, and requires explicit confirmation at each gate

🌐 **Dry-Run Validation** — Preview URL replacements and all changes before applying them

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

### Dependencies

**Required:**
- WordPress Studio CLI (`studio` command)
- Bash shell

**Optional (recommended for safer migrations):**
- WordPress CLI (`wp` command) — Enables WP-CLI mode for serialization-aware URL replacement

## Usage

### Studio CLI: Invoke in Claude
```
/wp-db-migrate

or

Use the skill directly in any chat with: "Migrate my WordPress database"
```

### Studio CLI: Command Line Quick Start
```bash
# Complete migration with Studio CLI (v2.0 default, fastest)
migrate-recovery.sh /path/to/studio/site "https://old-url.com" "https://new-url.local"

# With enhanced options (verbose, logging, dry-run)
migrate-recovery-enhanced.sh --verbose /path/to/studio/site "old-url" "new-url"

# Preview changes without applying
migrate-recovery-enhanced.sh --dry-run /path/to/studio/site "old-url" "new-url"
```

### WP-CLI: Safer URL Replacement (Optional)
If WP-CLI is installed, use it for serialization-aware URL replacement:

```bash
# Preview URL changes (safely handles serialized data)
./scripts/wp-cli-search-replace.sh --dry-run /path/to/site "old.com" "new.local"

# Apply the replacement
./scripts/wp-cli-search-replace.sh /path/to/site "old.com" "new.local"

# Pre/post migration validation with baseline comparison
./scripts/wp-cli-migration-checks.sh --pre /path/to/site baseline.json
./scripts/wp-cli-migration-checks.sh --post /path/to/site baseline.json
```

### Individual Steps
```bash
# Verify import succeeded
verify-import.sh /path/to/studio/site

# Bash-based URL replacement (fallback if WP-CLI not available)
replace-urls.sh /path/to/studio/site "https://old.com" "https://new.local"

# Start the development server
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

### Phase 3: Backup & Import (Studio CLI v2.0)
- Creates backup of target Studio site
- **v2.0: Faster import** using native `studio import` command
- Monitors for errors
- Can rollback to backup on failure
- Supports timeouts on large databases

### Phase 4: URL Replacement (with optional WP-CLI)
- Shows dry-run of replacements with counts
- Requires explicit approval
- **v2.0 WP-CLI mode:** Uses `wp db search-replace` for serialization-safe replacements
- **Fallback:** Bash approach if WP-CLI not installed
- Replaces URLs in `siteurl`, `home`, and serialized options
- Verifies changes applied correctly

### Phase 5: Validation
- Site loads (HTTP 200 on /wp-admin)
- Core table row counts match original export
- Database integrity check for corruption
- URL options verification
- **v2.0: Optional baseline comparison** with pre-migration snapshot

## Examples

### Example 1: Sync Staging to Local (Studio CLI)
```bash
/wp-db-migrate

Export file: ~/Downloads/staging-backup.sql.gz
Studio site: /Users/ash/Studio/my-project
Exclusions: Use defaults (exclude logs/indexes)
URL replacement: Auto-detect (with WP-CLI if available)
```

**What happens:**
- v2.0: Fast import using `studio import` command
- Smart table analysis suggests excluding 3-5 logging tables
- URL replacement preview shown (dry-run)
- If WP-CLI installed: Safer serialization-aware replacement
- Post-import validation confirms success

### Example 2: Production Database with Custom Exclusions
```bash
/wp-db-migrate

Export file: /backups/prod-2026-10-29.sql
Studio site: /Users/ash/Studio/prod-local
Exclusions: wp_actionscheduler_logs, wp_searchwp_*
URL replacement: Manual (prod.example.com → prod.local)
```

### Example 3: WP-CLI Safe URL Replacement
For maximum safety with large databases or complex URL patterns, use WP-CLI directly:

```bash
# Preview the replacements first (no changes)
./scripts/wp-cli-search-replace.sh --dry-run \
  /path/to/studio/site \
  "https://prod.example.com" \
  "https://prod.local"

# Apply if preview looks good
./scripts/wp-cli-search-replace.sh \
  /path/to/studio/site \
  "https://prod.example.com" \
  "https://prod.local"

# Verify with post-migration checks
./scripts/wp-cli-migration-checks.sh --post \
  /path/to/studio/site \
  baseline.json
```

## Scripts Included

### v2.0 Scripts (Studio CLI + WP-CLI Support)
- **migrate-recovery.sh** — Complete workflow (analyze → import → validate → serve)
- **migrate-recovery-enhanced.sh** — Enhanced version with flags: `--dry-run`, `--verbose`, `--log-file`, `--force`
- **verify-import.sh** — Check if import succeeded
- **replace-urls.sh** — Bash-based URL replacement (fallback)
- **wp-cli-search-replace.sh** — WP-CLI integration for safer URL replacement (optional)
- **wp-cli-migration-checks.sh** — Pre/post migration validation with baseline comparison (optional)
- **start-server.sh** — Start WordPress development server

All scripts are self-documenting; run with no arguments for usage:
```bash
./scripts/migrate-recovery.sh
./scripts/migrate-recovery-enhanced.sh --help
```

## Adding to Your PATH

For access from anywhere:
```bash
# Add to ~/.zshrc or ~/.bash_profile
export PATH="$PATH:/Users/ash/.claude/skills/wp-db-migrate/scripts"

# Then you can run from anywhere:
migrate-recovery.sh /path/to/site "old-url" "new-url"
```

## Requirements

### Required
- **WordPress Studio CLI** — `studio` command must be installed and in PATH
- **Bash** — For running scripts (macOS/Linux)

### Optional (Recommended)
- **WordPress CLI** (`wp` command) — Enables v2.0 WP-CLI mode for safer, serialization-aware URL replacement
  - If not installed: Scripts gracefully fall back to bash approach
  - Install: See [WordPress CLI documentation](https://wp-cli.org/#installing)

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

## What's New in v2.0

✨ **Studio CLI Integration** — Faster imports using native `studio import` command (15-30% faster)
🆕 **WP-CLI Support** — Optional safer URL replacement with serialization awareness  
🔧 **Enhanced Scripts** — `migrate-recovery-enhanced.sh` with `--dry-run`, `--verbose`, `--force` flags  
📋 **WP-CLI Validation** — Pre/post migration checks with baseline comparison  
🔄 **Graceful Fallback** — Scripts detect and adapt to available tools automatically

## Support

For issues, questions, or detailed documentation:
- 📖 **Full Documentation:** Check `SKILL.md` in `/Users/ash/.github/skills/wp-db-migrate/`
- 🔧 **Troubleshooting:** See the troubleshooting flowchart in SKILL.md
- 🎯 **WP-CLI Guide:** See `prompts/wp-cli-integration.md` for detailed WP-CLI docs
- 🌐 **Studio CLI Docs:** https://developer.wordpress.com/docs/developer-tools/studio/cli/
- 🛠️ **WP-CLI Docs:** https://wp-cli.org/

## License

MIT

## Author

Ash Shaw (ashley@lightspeedwp.agency)

---

**Maintained by:** Claude Haiku 4.5  
**Version:** 2.0.0  
**Released:** 2026-10-29  
**Key Features:** Studio CLI integration, optional WP-CLI support, smart table analysis, backup + rollback, serialization-aware URL replacement, comprehensive validation
