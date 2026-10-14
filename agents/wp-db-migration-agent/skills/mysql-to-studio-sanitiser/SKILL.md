---
name: mysql-to-studio-sanitiser
description: Make a MySQL database export (mysqldump, host backup or phpMyAdmin on a MySQL server) importable into a WordPress Studio local site, which runs on SQLite. Use when a Studio import fails with "Could not execute statement", or before importing a live or staging database into Studio. Writes a cleaned copy, never changes the original, and lists every edit.
---

# MySQL to Studio Sanitiser

Make a MySQL export of a WordPress database importable into a WordPress Studio
local site (SQLite through the SQLite Database Integration plugin). This skill
writes a cleaned copy beside the original and reports every change.

It packages the fixes for real failed imports:

- **2026-10-13**: Studio rejected a GTID replication statement, then raw
  `_binary` literals in WP All Import's `wp_pmxi_hash` table.
- **2026-10-14**: a phpMyAdmin export from MariaDB 13 failed on
  ``DEFAULT x AS `0000...` `` in ten Wordfence tables. A hand-made native
  SQLite conversion of the same dump then failed on its first line,
  `PRAGMA foreign_keys=OFF`.

## When to use this skill

- A Studio import fails and `~/Library/Logs/Studio/` shows
  `Error during import of ... Could not execute statement: ...`.
- Before importing a live or staging export into Studio, to catch the known
  problems first.

## Rules

- **The output must stay MySQL syntax.** Studio's importer (and the
  phpMyAdmin bundled with Studio) send every statement through the SQLite
  Database Integration plugin, which parses MySQL and translates it to SQLite
  itself. Never convert a dump to SQLite's own dialect (`PRAGMA`,
  `AUTOINCREMENT`, `BEGIN TRANSACTION`, `INSERT OR ...`, `replace(...,char(13))`,
  a `sqlite3 .dump`), and never write a custom converter: it fails with
  `Could not execute statement: PRAGMA ...`. The `-sqlite.sql` output name
  means "ready for Studio", not "SQLite syntax".
- **Never modify the original file.** Write the cleaned copy beside it as
  `<name>-sqlite.sql`.
- Change only statements SQLite or the Studio importer cannot run. Everything
  else stays byte-for-byte identical.
- Treat the dump as bytes. It may contain non-UTF-8 data. On macOS, plain `sed`
  stops with "illegal byte sequence" and silently leaves a truncated file. Use
  `LC_ALL=C` for `sed`, `grep` and `diff`, or Python in `rb`/`wb` mode, and
  always compare line counts afterwards.
- Never print data rows, password hashes, email addresses or API keys from the
  dump. Refer to tables, lines and counts.
- Ask before changing anything outside the known fixes below.

## Procedure

### 1. Prepare the input and ask the user

- If the export is compressed (`.sql.gz`, `.zip`), extract it to a new file
  first (for example `gunzip -k export.sql.gz`). Never overwrite the archive.
- Note the input's size and line count.
- Confirm which Studio site the export is for (`~/Studio/<site>`). The import
  replaces that site's database, so the name matters.
- Read the export and the site together:

  ```bash
  node agents/wp-db-migration-agent/lib/sql-tool.cjs site-urls <export.sql> --studio-site ~/Studio/<site>
  ```

  The report shows the export's WordPress table prefix next to the site's
  `$table_prefix`, plus `siteurl` and `home`.

Then ask these questions **before** running the sanitiser, one message with
the facts you found, and wait for the answers:

1. **Table prefix.** Say what the export uses and what the Studio site uses.
   If they differ (`prefix-differs`), ask: "Rename the tables to `<site
prefix>` (recommended), keep `<export prefix>` and change `$table_prefix`
   in the site's `wp-config.php`, or another prefix?" If they already match,
   say so and ask only if the user wants a different prefix. Never guess: an
   import under the wrong prefix leaves WordPress unable to see the data.

### 2. Run the sanitiser

In a clone of `lightspeedwp/.github` (Node.js 20+), run:

```bash
node agents/wp-db-migration-agent/lib/sql-tool.cjs sanitise <path/to/export.sql>
```

Add the options that match the user's answers from step 1, and always pass
`--studio-site ~/Studio/<site>` so the report confirms the prefixes match.

To change the table prefix (the user's answer to question 1), add
`--prefix <prefix>`. It renames every table and the
keys WordPress looks up by prefix (`<prefix>user_roles` in options and
`<prefix>*` keys in usermeta, such as `<prefix>capabilities`). It refuses an
export with more than one WordPress prefix (multisite) or a rename that would
collide with an existing table. Do the site URL afterwards on the imported
site with the [`wp-url-replacement`](../wp-url-replacement/SKILL.md) skill,
never by editing the dump.

The tool applies the known fixes, verifies the result, and prints the edit
table, findings and site URLs. Exit code `0` means done, `1` means there are
findings to review (the output is still written), and `2` means an error (no
output is left behind).

If the tool is not available, apply the known fixes by hand (step 3), then
verify (step 4).

### 3. Known fixes (what the tool does)

1. **Delete the GTID replication lines.** These only exist on a MySQL server
   with replication on:
   - `SET @@GLOBAL.GTID_PURGED=...;`
   - the `-- GTID state at the beginning of the backup` comment
2. **Delete the binary-log lines:**
   - `SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;`
   - `SET @@SESSION.SQL_LOG_BIN= 0;`
   - `SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;`
3. **Convert every `_binary '...'` literal to a hex literal `X'<hex>'`.**
   Decode the MySQL escapes first: `\0`→0x00, `\b`→0x08, `\n`→0x0A,
   `\r`→0x0D, `\t`→0x09, `\Z`→0x1A. A backslash followed by any other byte
   means that byte, which covers `\\`, `\'` and `\"`. Check that each decoded
   value's length matches its column (for example `binary(16)` → 16 bytes) and
   that primary-key values stay unique. If any length disagrees, stop and write
   nothing: a wrong decode corrupts data silently.
4. **Rewrite MariaDB's broken binary defaults.** MariaDB 11+ dumps a binary
   column's default as ``DEFAULT x AS `<hex>` ``, which no parser accepts
   (Studio, MySQL or MariaDB). Rewrite it as `DEFAULT X'<hex>'`, checking the
   byte count matches `binary(N)`. Seen on Wordfence tables (`wfblocks7`,
   `wfcrawlers`, `wffilemods`, `wflocs` and others).

5. **Add `DROP TABLE IF EXISTS` before each `CREATE TABLE` that has none.**
   phpMyAdmin exports often leave it out. Every Studio site already has
   WordPress's own tables, so without it the import stops at the first clash
   (for example `Could not execute statement: CREATE TABLE wp_commentmeta`).
   mysqldump adds these by default.

### Tables left out by default

**Wordfence** (`<prefix>wf*` and `<prefix>wfls_*`, such as `wfconfig`, `wfhits`
and `wfls_settings`): its logs, scan results and blocks are not needed locally,
and we don't run Wordfence on Studio sites. The tool reports each table left
out. Wordfence's settings in the options table stay, so keep the plugin
deactivated locally (`studio wp --path ~/Studio/<site> plugin deactivate
wordfence`). Pass `--keep-wordfence` only if the user asks for its tables.

The tool refuses (exit 2, nothing written) a file that is already in SQLite's
own dialect. Go back to the original MySQL export and sanitise that.

Leave these alone; the importer handles them: the `/*!40101 SET ... */` header
and footer lines, `LOCK TABLES`, `DISABLE KEYS`, `ENGINE=InnoDB`, character
set and collation clauses (including MariaDB-only ones such as
`utf8mb4_general1400_as_ci`), `ALTER TABLE ... ADD PRIMARY KEY` / `MODIFY ...
AUTO_INCREMENT` blocks from phpMyAdmin, and `ON UPDATE CURRENT_TIMESTAMP`.

### 4. Scan and verify

Report, before changing, anything else SQLite is likely to reject: other
`SET @@GLOBAL` statements, `CREATE DATABASE` / `USE`, `DELIMITER`,
`DEFINER=`, triggers, stored procedures or functions, views, events,
`FULLTEXT` / `SPATIAL` indexes and generated columns.

Then verify and report:

- a byte-safe diff (`LC_ALL=C diff`) between the original and the cleaned file,
  showing only the intended lines changed;
- the count of `CREATE TABLE` and `INSERT INTO` statements in both files (they
  must match);
- zero remaining matches for `GTID`, `SQL_LOG_BIN`, `@@GLOBAL`, `_binary` and
  `DEFAULT x AS`;
- the original file's checksum is unchanged (`shasum -a 256` before and after).

### 5. Report

End with a table of every edit:

| #   | Edit                                   | Line | Why                                   |
| --- | -------------------------------------- | ---- | ------------------------------------- |
| 1   | Removed `SET @@GLOBAL.GTID_PURGED=...` | 24   | Replication setting SQLite cannot run |

Then tell the user:

- **Import**: in the Studio app (site → Import / Export → Import), or
  `studio import <file> --path ~/Studio/<site>`. Importing replaces the site's
  database, so confirm the site first.
- **Site URL**: report `siteurl` and `home` from the `*_options` table. In the
  2026-10-13 import, Studio set these two options to the local site's URL, but
  URLs inside posts, postmeta and other options still point at the source.
  Check `siteurl` after import and offer the `wp-url-replacement` skill.
- **Accounts**: if the dump contains a `*_users` table, the import replaces the
  local site's accounts; log in with an account from the source site.

### 6. If the import still fails

Ask the user for the Studio error log (`~/Library/Logs/Studio/`). Check the
`[CLI - <id>]` on the error line and the theme path logged beside it to confirm
the import went to the intended site. If the
statement it names is `PRAGMA`, `BEGIN TRANSACTION` or similar SQLite syntax,
the file was converted to the wrong dialect: sanitise the original MySQL export
instead of patching the converted file. Find the
`Could not execute statement:` line, identify the statement it names, explain
why SQLite rejects it, and propose a targeted fix. Apply it only after the user
agrees, verify again (step 4), and add it to the edit table. If the fix is
generic, suggest adding it to this skill's known fixes.

## Prevention

When the user controls the export, these `mysqldump` options avoid both known
problems at the source:

```bash
mysqldump --set-gtid-purged=OFF --hex-blob <database> > export.sql
```

---

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
