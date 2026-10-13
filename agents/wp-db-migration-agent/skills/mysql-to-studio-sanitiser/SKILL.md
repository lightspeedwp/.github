---
name: mysql-to-studio-sanitiser
description: Make a MySQL database export (mysqldump, host backup or phpMyAdmin on a MySQL server) importable into a WordPress Studio local site, which runs on SQLite. Use when a Studio import fails with "Could not execute statement", or before importing a live or staging database into Studio. Writes a cleaned copy, never changes the original, and lists every edit.
---

# MySQL to Studio Sanitiser

Make a MySQL export of a WordPress database importable into a WordPress Studio
local site (SQLite through the SQLite Database Integration plugin). This skill
writes a cleaned copy beside the original and reports every change.

It packages the fix for a real failed import on 2026-10-13: Studio rejected a
GTID replication statement, then raw `_binary` literals in WP All Import's
`wp_pmxi_hash` table. After these edits the import succeeded.

## When to use this skill

- A Studio import fails and `~/Library/Logs/Studio/` shows
  `Error during import of ... Could not execute statement: ...`.
- Before importing a live or staging export into Studio, to catch the known
  problems first.

## Rules

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

### 1. Prepare the input

- If the export is compressed (`.sql.gz`, `.zip`), extract it to a new file
  first (for example `gunzip -k export.sql.gz`). Never overwrite the archive.
- Note the input's size and line count.

### 2. Run the sanitiser

In a clone of `lightspeedwp/.github` (Node.js 20+), run:

```bash
node agents/wp-db-migration-agent/lib/sql-tool.cjs sanitise <path/to/export.sql>
```

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

Leave these alone; the importer handles them: the `/*!40101 SET ... */` header
and footer lines, `LOCK TABLES`, `DISABLE KEYS`, `ENGINE=InnoDB`, character
set and collation clauses, and `ON UPDATE CURRENT_TIMESTAMP`.

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
- zero remaining matches for `GTID`, `SQL_LOG_BIN`, `@@GLOBAL` and `_binary`;
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

Ask the user for the Studio error log (`~/Library/Logs/Studio/`). Find the
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
