# WordPress Migration Quickstart

A quick reference guide for the most common database migration workflows. Every command is copy-paste ready — just replace the variables and run.

**Variables you'll need:**
- `STUDIO_SITE_PATH` = Full path to your WordPress Studio site (e.g., `/Users/ash/Studio/my-site`)
- `EXPORT_FILE` = Path to your database backup file (e.g., `~/Downloads/backup.sql.gz`)
- `OLD_URL` = Current site URL in the database (e.g., `https://staging.dev`)
- `NEW_URL` = New local URL (e.g., `https://my-site.local`)
- `SITE_NAME` = Your Studio site name (e.g., `my-site`)

---

## 1. Sync Staging to Local Studio

**When to use:** Pull a production or staging backup into your local WordPress Studio environment for testing, debugging, or development.

**Time:** 5–15 minutes (depends on database size)

### Step 1: Verify Studio CLI is installed
```bash
which studio
studio --version
```

**Expected output:**
```
/usr/local/bin/studio
WordPress Studio CLI v1.2.0 (or similar)
```

**Troubleshooting:**
- `studio: command not found` — Install WordPress Studio CLI from https://developer.wordpress.com/docs/developer-tools/studio/
- Make sure it's in your PATH

### Step 2: List your Studio sites
```bash
studio site list
```

**Expected output:**
```
Available Studio sites:
  • SITE_NAME                     /Users/ash/Studio/SITE_NAME
```

Copy the full path you want to import into (you'll use it in step 4).

### Step 3: Create a new Studio site (or use an existing one)

If you already have a Studio site ready, skip to step 4. Otherwise, create a new one:

```bash
studio site create SITE_NAME
```

Replace `SITE_NAME` with your desired site name (e.g., `my-staging-copy`).

**Expected output:**
```
Creating Studio site: my-staging-copy
✓ Site created successfully
Site path: /Users/ash/Studio/my-staging-copy
```

### Step 4: Navigate to the skill directory
```bash
cd /Users/ash/.github/skills/wp-db-migrate
```

Or, if you've added the scripts to your PATH:
```bash
# Scripts are available from anywhere
```

### Step 5: Run the complete recovery workflow
```bash
./scripts/migrate-recovery.sh \
  /Users/ash/Studio/SITE_NAME \
  "https://staging.example.dev" \
  "https://SITE_NAME.local"
```

**Example:**
```bash
./scripts/migrate-recovery.sh \
  /Users/ash/Studio/my-staging-copy \
  "https://my-site.staging.lightspeedwp.dev" \
  "https://my-staging-copy.local"
```

**Expected output (during workflow):**
```
✓ Verifying import...
  Posts: 245 | Users: 3 | Tables: 15
  Current URLs: https://my-site.staging.lightspeedwp.dev

✓ Replacing URLs...
  From: https://my-site.staging.lightspeedwp.dev
  To: https://my-staging-copy.local
  Estimated replacements: 12,450 database links

✓ Starting WordPress server...
  Site available at: https://my-staging-copy.local
  Login: wp-admin username (from imported backup)
```

**Troubleshooting:**

- **Error: "Studio site path does not exist"**
  - Run `studio site list` to see available sites
  - Verify the path is correct (copy directly from the list)

- **Error: "Case statements followed by a semicolon are deprecated"**
  - This is a WordPress notice, not an error — safe to ignore

- **Import times out after 10 minutes**
  - The database often imports successfully even if the server startup times out
  - Run step 1 of "Post-Migration Validation" below to verify:
    ```bash
    ./scripts/verify-import.sh /Users/ash/Studio/SITE_NAME
    ```

- **Site won't load after import**
  - Check the URLs were replaced correctly:
    ```bash
    studio wp option get siteurl --path /Users/ash/Studio/SITE_NAME
    ```
  - If URLs are wrong, run step 3 below (Safe URL Replacement)

---

## 2. Run Pre-Migration Checks

**When to use:** Before migrating a large or production database, verify that your backup is valid and your WordPress Studio environment is ready.

**Time:** 2–3 minutes

### Step 1: Run the pre-flight check
```bash
cd /Users/ash/.github/skills/wp-db-migrate
./scripts/preflight-check.sh
```

**Expected output:**
```
🔍 Running pre-flight checks...

📦 Required Commands:
✅ WordPress Studio CLI
✅ WordPress CLI
✅ Bash shell
✅ grep

📁 Required Directories:
✅ Studio directory exists

📊 Summary:
✅ All checks passed! Ready to migrate.
```

**Troubleshooting:**
- If any command is missing, install it:
  - `studio` — https://developer.wordpress.com/docs/developer-tools/studio/
  - `wp` (WP-CLI) — https://wp-cli.org/#installing

### Step 2: Verify your backup file
```bash
ls -lh /path/to/EXPORT_FILE
wc -l /path/to/EXPORT_FILE  # Count lines (takes a few seconds)
```

**Example:**
```bash
ls -lh ~/Downloads/backup-2026-10-29.sql.gz
wc -l ~/Downloads/backup-2026-10-29.sql.gz
```

**Expected output:**
```
-rw-r--r--  1 ash  staff  250M Oct 29 10:30 backup-2026-10-29.sql.gz
1234567 total
```

Verify:
- ✅ File size is > 1 MB (not corrupted)
- ✅ File is readable by your user

### Step 3: Check WordPress health (optional, for existing sites)

If you're importing into an existing Studio site, check its current state:

```bash
studio wp core check-db --path /Users/ash/Studio/SITE_NAME
studio wp plugin status --path /Users/ash/Studio/SITE_NAME
```

**Expected output:**
```
WordPress database is optimized

| Name              | Status   | Activation |
|-------------------|----------|------------|
| Plugin Name       | Active   | Must-Use   |
```

**What to look for:**
- ✅ Database is not corrupted (no errors in output)
- ⚠️ Deactivate problematic plugins before migration if needed

### Step 4: Create a backup of the target site (safety measure)
```bash
studio backup create --path /Users/ash/Studio/SITE_NAME
```

**Expected output:**
```
Backup created: backup-2026-10-29-143022
Location: /Users/ash/Studio/SITE_NAME/.backups/backup-2026-10-29-143022
```

Store this backup ID — you can restore from it if needed:
```bash
studio backup restore backup-2026-10-29-143022 --path /Users/ash/Studio/SITE_NAME
```

---

## 3. Safe URL Replacement

**When to use:** After importing a database, replace old site URLs with new ones (e.g., staging.dev → my-site.local, or http → https).

**Time:** 1–3 minutes

### Step 1: Preview changes with --dry-run (ALWAYS DO THIS FIRST)

Never apply changes without seeing them first:

```bash
cd /Users/ash/.github/skills/wp-db-migrate
./scripts/wp-cli-search-replace.sh --dry-run \
  /Users/ash/Studio/SITE_NAME \
  "https://old-domain.com" \
  "https://new-domain.local"
```

**Example:**
```bash
./scripts/wp-cli-search-replace.sh --dry-run \
  /Users/ash/Studio/my-site \
  "https://my-site.staging.lightspeedwp.dev" \
  "https://my-site.local"
```

**Expected output:**
```
🔍 Preview mode (no changes will be applied)

Searching for: https://my-site.staging.lightspeedwp.dev
Replacing with: https://my-site.local

✓ Search completed
  Total matches: 12,450
  
Tables that will be updated:
  • wp_options: 47 matches
  • wp_postmeta: 8,234 matches
  • wp_posts: 3,891 matches
  • wp_termmeta: 288 matches

🚀 To apply these changes, run without --dry-run:
./scripts/wp-cli-search-replace.sh /Users/ash/Studio/my-site \
  "https://my-site.staging.lightspeedwp.dev" \
  "https://my-site.local"
```

### Step 2: Review the preview

Check that:
- ✅ Match count looks reasonable (50+ is typical; 0 means URLs don't exist)
- ✅ The tables being updated are correct
- ✅ From/To URLs are exactly what you want

If anything looks wrong, **stop** — don't proceed to step 3.

### Step 3: Apply the replacement
```bash
./scripts/wp-cli-search-replace.sh \
  /Users/ash/Studio/SITE_NAME \
  "https://old-domain.com" \
  "https://new-domain.local"
```

**Example:**
```bash
./scripts/wp-cli-search-replace.sh \
  /Users/ash/Studio/my-site \
  "https://my-site.staging.lightspeedwp.dev" \
  "https://my-site.local"
```

**Expected output:**
```
🔄 Applying replacements (WP-CLI)

Searching for: https://my-site.staging.lightspeedwp.dev
Replacing with: https://my-site.local

✓ Replacement completed
  Total replacements: 12,450
  
Tables updated:
  • wp_options: 47 replacements
  • wp_postmeta: 8,234 replacements
  • wp_posts: 3,891 replacements
  • wp_termmeta: 288 replacements

✓ URLs updated successfully
Current siteurl: https://my-site.local
```

### Step 4: Verify the replacement worked
```bash
studio wp option get siteurl --path /Users/ash/Studio/SITE_NAME
studio wp option get home --path /Users/ash/Studio/SITE_NAME
```

**Expected output:**
```
https://my-site.local
https://my-site.local
```

Both should match your `NEW_URL`. If not, the replacement failed.

**Troubleshooting:**

- **Output shows "0 replacements made"**
  - The old URL doesn't exist in the database
  - Check what URLs are actually in the database:
    ```bash
    studio wp option get siteurl --path /Users/ash/Studio/SITE_NAME
    ```
  - Use the actual URL from the database in your search

- **Only some tables were updated**
  - This is normal — not all tables contain URLs
  - Check the specific table if you think data is missing:
    ```bash
    studio wp db query "SELECT COUNT(*) FROM wp_postmeta WHERE meta_value LIKE '%old-url%'" --path /Users/ash/Studio/SITE_NAME
    ```

- **"WP-CLI not found" warning**
  - The script falls back to bash, which is slower but works
  - To use WP-CLI, install it: https://wp-cli.org/#installing

- **Need to rollback?**
  - Restore from the backup you created in section 2:
    ```bash
    studio backup restore BACKUP_ID --path /Users/ash/Studio/SITE_NAME
    ```

---

## 4. Post-Migration Validation

**When to use:** After importing and replacing URLs, verify that everything worked and the site is ready to use.

**Time:** 2–5 minutes

### Step 1: Verify the import succeeded
```bash
cd /Users/ash/.github/skills/wp-db-migrate
./scripts/verify-import.sh /Users/ash/Studio/SITE_NAME
```

**Example:**
```bash
./scripts/verify-import.sh /Users/ash/Studio/my-site
```

**Expected output:**
```
✓ Verifying import for site: /Users/ash/Studio/my-site

📊 Database Statistics:
  Posts: 245
  Postmeta: 1,290
  Users: 3
  Terms: 87
  Options: 156
  Total tables: 15
  Database size: ~120 MB

🔗 Current URLs:
  siteurl: https://my-site.local
  home: https://my-site.local

✓ Site appears to be healthy
```

**What to check:**
- ✅ Post count matches what you expect from the original site
- ✅ User count is correct
- ✅ URLs are set correctly
- ❌ If "Total tables: 0" or "Posts: 0", the import failed

### Step 2: Check for any errors in WordPress logs
```bash
studio wp db query "SELECT * FROM wp_options WHERE option_name='siteurl' OR option_name='home'" --path /Users/ash/Studio/SITE_NAME
```

**Expected output:**
```
+-------+---------+-------------------+---------+
| ID    | option_name | option_value | autoload |
+-------+---------+-------------------+---------+
| 1     | siteurl | https://my-site.local | yes |
| 2     | home    | https://my-site.local | yes |
+-------+---------+-------------------+---------+
```

Verify both `siteurl` and `home` are set correctly.

### Step 3: Start the WordPress server and test the site
```bash
./scripts/start-server.sh /Users/ash/Studio/SITE_NAME
```

**Example:**
```bash
./scripts/start-server.sh /Users/ash/Studio/my-site
```

**Expected output:**
```
🚀 Starting WordPress server...

✓ Server started successfully
  Site URL: https://my-site.local
  WP-Admin: https://my-site.local/wp-admin
  
Log in with your imported credentials (same username/password from the backup)

Press Ctrl+C to stop the server
```

### Step 4: Manual verification (in your browser)

1. **Open the site:** Visit `https://my-site.local` in your browser
   - ✅ Should load without errors
   - ⚠️ May show SSL certificate warning (normal for local dev) — click "Proceed"

2. **Check wp-admin:** Visit `https://my-site.local/wp-admin`
   - ✅ Should load login screen
   - ✅ Log in with the same credentials as the original site

3. **Spot-check content:** 
   - ✅ Posts appear in the dashboard
   - ✅ Media library shows uploaded files
   - ✅ Plugins/themes list looks complete
   - ✅ No "broken images" or 404 errors on the homepage

4. **Check for console errors:** Open browser developer tools (F12 or Cmd+Option+I)
   - ✅ Should show < 5 errors (some theme/plugin warnings are normal)
   - ❌ "Cannot POST /wp-admin/admin-ajax.php" errors suggest URL replacement failed

### Step 5: Compare row counts (optional, for large sites)

If you want to verify that no data was lost during import:

```bash
# Count posts
studio wp db query "SELECT COUNT(*) as total FROM wp_posts" --path /Users/ash/Studio/SITE_NAME

# Count postmeta
studio wp db query "SELECT COUNT(*) as total FROM wp_postmeta" --path /Users/ash/Studio/SITE_NAME

# Count users
studio wp db query "SELECT COUNT(*) as total FROM wp_users" --path /Users/ash/Studio/SITE_NAME
```

Compare the output to what you got in step 1 of this section — they should match.

**Troubleshooting:**

- **Site won't load (error 500)**
  - Check the WordPress debug log:
    ```bash
    tail -50 /Users/ash/Studio/SITE_NAME/wp-content/debug.log
    ```
  - Common causes: URL replacement didn't work, corrupted option values

- **"Cannot POST /wp-admin/admin-ajax.php"**
  - This means `siteurl` is wrong
  - Check step 4 above:
    ```bash
    studio wp option get siteurl --path /Users/ash/Studio/SITE_NAME
    ```
  - If it's wrong, run section 3 (Safe URL Replacement) again

- **Images show as broken (404)**
  - URLs in postmeta weren't updated
  - Search for remaining old URLs:
    ```bash
    studio wp db query "SELECT * FROM wp_postmeta WHERE meta_value LIKE '%old-domain%' LIMIT 5" --path /Users/ash/Studio/SITE_NAME
    ```
  - If found, run section 3 again with the old domain

- **Plugins won't activate**
  - This sometimes happens with serialized plugin options
  - Try deactivating all plugins and reactivating one by one:
    ```bash
    studio wp plugin deactivate --all --path /Users/ash/Studio/SITE_NAME
    studio wp plugin activate PLUGIN_NAME --path /Users/ash/Studio/SITE_NAME
    ```

---

## Common Issues & Solutions

### Database import fails partway through

**Symptom:** Error like "Error in table `wp_postmeta`"

**Solution:**
1. Restore from backup (see section 2, step 4)
2. Exclude the problematic table:
   ```bash
   # Edit the migrate-recovery.sh script and add to EXCLUDE_TABLES
   # Or contact support with the full error message
   ```
3. Try importing again

### Site is very slow after import

**Symptom:** Pages take 5+ seconds to load

**Solution:**
1. Rebuild WordPress caches:
   ```bash
   studio wp db optimize --path /Users/ash/Studio/SITE_NAME
   ```

2. Deactivate all plugins and test:
   ```bash
   studio wp plugin deactivate --all --path /Users/ash/Studio/SITE_NAME
   ```
   Then activate them one by one to find the slow one.

3. Clear any plugin caches (WP Rocket, W3 Total Cache, etc.)

### Large tables were excluded but I need them

**Scenario:** You excluded `wp_actionscheduler_logs` (which is 200+ MB) but now you need it

**Solution:**
1. Re-export from the original site with just that table:
   ```bash
   # On the original server:
   mysqldump DATABASE wp_actionscheduler_logs > actionscheduler.sql
   ```

2. Import the partial file into the Studio site:
   ```bash
   studio import actionscheduler.sql --path /Users/ash/Studio/SITE_NAME
   ```

3. Replace URLs if needed:
   ```bash
   ./scripts/wp-cli-search-replace.sh /Users/ash/Studio/SITE_NAME "https://old" "https://new"
   ```

### Still having issues?

Check the full documentation:
- **Full SKILL.md:** `/Users/ash/.github/skills/wp-db-migrate/SKILL.md`
- **WP-CLI Guide:** `/Users/ash/.github/skills/wp-db-migrate/prompts/wp-cli-integration.md`

---

## Environment Variables

These are set automatically by the scripts, but you can override them:

| Variable | Default | Purpose |
|----------|---------|---------|
| `STUDIO_PATH` | `~/Studio` | Where your Studio sites are stored |
| `WP_CLI` | `wp` | Command to run WordPress CLI |
| `DRY_RUN` | `0` | Set to `1` to preview without applying |
| `VERBOSE` | `0` | Set to `1` for detailed output |

Example: Run with verbose output
```bash
VERBOSE=1 ./scripts/migrate-recovery.sh /path/to/site "old" "new"
```

---

## Quick Command Reference

| Task | Command |
|------|---------|
| Verify import succeeded | `./scripts/verify-import.sh /path/to/site` |
| Preview URL changes | `./scripts/wp-cli-search-replace.sh --dry-run /path/to/site "old" "new"` |
| Apply URL changes | `./scripts/wp-cli-search-replace.sh /path/to/site "old" "new"` |
| Start the site | `./scripts/start-server.sh /path/to/site` |
| Complete workflow | `./scripts/migrate-recovery.sh /path/to/site "old" "new"` |
| Pre-flight checks | `./scripts/preflight-check.sh` |
| List Studio sites | `studio site list` |
| Create a backup | `studio backup create --path /path/to/site` |
| Check WordPress health | `studio wp core check-db --path /path/to/site` |

---

## Next Steps

- **Need to migrate a specific table?** See "Partial table import" in the full SKILL.md
- **Using WP-CLI?** Check the detailed guide in `prompts/wp-cli-integration.md`
- **Troubleshooting serialized data issues?** Read "WP-CLI for URL Replacement" in SKILL.md
- **Want to automate this?** Use the `--force` flag in the enhanced recovery script

---

**Last updated:** 2026-10-29  
**For help:** See the full `SKILL.md` or run `./scripts/preflight-check.sh` to diagnose issues
