---
name: studio-export-preflight
description: Check a database export from a WordPress Studio local site (phpMyAdmin, studio export or WP-CLI) before it is imported into a MySQL or MariaDB staging or live site. Use before any Studio-to-staging or Studio-to-live database move. Reports internal SQLite tables, unsupported collations, database and prefix problems, and leftover local URLs, without changing any file or database.
---

# Studio Export Pre-flight Check

Check a database export taken from a WordPress Studio local site before anyone
imports it into a MySQL or MariaDB staging or live site. The check is
read-only; it produces a pass, warn or fail report and a backup-first import
checklist.

Importing into staging or live is the user's action. This skill never connects
to, imports into or changes a remote database.

## When to use this skill

- Before importing a Studio export into a staging or live site.
- After running the `wp-url-replacement` skill, to confirm no local URLs remain.

## Procedure

### 1. Gather the facts

Ask the user, if not already known:

1. The export file path. If it is compressed, extract it to a new file first.
2. The target server and version: `mysql-5.7`, `mysql-8`, `mariadb-10` or
   `mariadb-11`. The host's control panel or `SELECT VERSION();` shows it.
3. The target site's table prefix (`$table_prefix` in its `wp-config.php`).

### 2. Run the check

In a clone of `lightspeedwp/.github` (Node.js 20+):

```bash
node agents/wp-db-migration-agent/lib/sql-tool.cjs preflight <export.sql> --target <version> --prefix <prefix>
```

Exit code `0` means every check passed, `1` means findings to review, and `2`
means an error such as an unreadable file. If the tool is not available, run
the checks in step 3 by hand with byte-safe tools (`LC_ALL=C grep`).

### 3. What is checked

| Check                                                 | Severity                                                    | Why it matters                                                                                                                           |
| ----------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `internal-table`                                      | fail                                                        | Tables named `_wp_sqlite_*`, `_mysql_data_types_cache` or `sqlite_*` belong to the SQLite Database Integration and must not reach MySQL. |
| `collation-0900`                                      | fail on MySQL 5.7 or MariaDB; warn if the target is unknown | `utf8mb4_0900_*` collations exist only in MySQL 8; older servers abort the import with "Unknown collation".                              |
| `create-database`, `use-database`                     | fail                                                        | The file would create or switch to a database by name, which may not be the target's database.                                           |
| `global-variable`, `delimiter`                        | fail                                                        | Server-wide settings and delimiter changes usually fail on shared hosting.                                                               |
| `definer`, `trigger`, `routine`, `view`, `event`      | warn                                                        | Need privileges shared hosts rarely grant, and name a user that may not exist.                                                           |
| `fulltext-index`, `spatial-index`, `generated-column` | warn                                                        | Supported by modern MySQL, but check the target version.                                                                                 |
| `prefix-mismatch`                                     | warn                                                        | Tables whose prefix differs from the target's are ignored by the target site.                                                            |
| `drop-table`                                          | warn                                                        | The import replaces existing tables on the target.                                                                                       |
| `local-url`                                           | warn                                                        | `*.local`, `localhost` or `127.0.0.1` URLs, including the JSON-escaped `https:\/\/` form, would break links and media on the target.     |
| `legacy-charset`                                      | info                                                        | `utf8mb3` or `latin1` tables; usually harmless.                                                                                          |
| `no-tables`                                           | fail                                                        | No `CREATE TABLE` statements; the file is partial or not a database export.                                                              |

### 4. Explain and fix on request

Present the findings table, then explain each `fail` and `warn` in plain
English. Offer fixes, but apply them only when the user asks, and always to a
new file, never the export itself:

- **Internal tables**: remove each table's `DROP TABLE`, `CREATE TABLE` and
  `INSERT` statements.
- **`0900` collation on an older target**: replace it with
  `utf8mb4_unicode_520_ci`.
- **`CREATE DATABASE` / `USE`**: remove the statements so the import goes
  into whichever database the user selects.
- **Prefix mismatch**: either rename the tables, or change `$table_prefix` on
  the target to match, plus the `<prefix>user_roles` option and the
  `<prefix>capabilities` / `<prefix>user_level` user meta keys.
- **Local URLs**: hand off to the `wp-url-replacement` skill; re-run this
  check on its output.

After any fix, run the check again on the new file.

### 5. Import checklist for the user

When the check passes, give the user this checklist. They run it; the agent
does not.

1. Back up the target database (host backup, or `wp db export` on the target)
   and confirm the backup restores.
2. Put the target site into maintenance mode if it is live.
3. Import the checked file into the target database (phpMyAdmin, host tool,
   or `wp db import`).
4. Flush caches: `wp cache flush`, then any page cache or CDN.
5. Check the home page, an inner page, media, the admin login and permalinks
   (re-save Settings → Permalinks if links 404).

## Rules

- Read-only: never modify the export, and never connect to a remote database.
- Never print data rows, password hashes, email addresses or API keys; refer to
  tables and counts. URLs may be shown.
- If the user asks the agent to import into staging or live, decline, explain
  that the action is hard to reverse, and give them the checklist above.

---

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
