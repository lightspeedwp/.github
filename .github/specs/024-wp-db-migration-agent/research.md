# Research: WordPress DB Migration Agent

**Feature**: [spec.md](./spec.md) | **Date**: 2026-10-13

## R1. Why the 2026-10-13 import failed

- **Decision**: The known fixes are (a) remove `SET @@GLOBAL.GTID_PURGED` and its comment, (b)
  remove the three `SQL_LOG_BIN` statements, (c) rewrite `_binary '...'` literals as `X'<hex>'`.
- **Rationale**: Observed directly. Studio 1.24.0 logged `Could not execute statement: SET
  @@GLOBAL.GTID_PURGED=...`; after removal it logged the `INSERT INTO wp_pmxi_hash VALUES
  (_binary '...')` statement; after hex conversion the import succeeded. `mysqldump` adds GTID and
  `SQL_LOG_BIN` lines whenever the source server has GTID replication on, and emits `_binary` for
  `BINARY`/`VARBINARY`/`BLOB` columns (WP All Import's `wp_pmxi_hash.hash` is `binary(16)`).
- **Alternatives considered**: Re-exporting with `--set-gtid-purged=OFF --hex-blob` avoids both
  problems at the source. The skill recommends it when the user controls the export, but most
  exports come from host tools the team cannot configure, so the file fix is still required.

## R2. MySQL escape decoding for binary literals

- **Decision**: Decode `\0 \b \n \r \t \Z` to their bytes and treat backslash followed by any other
  byte as that byte (covers `\\ \' \"`). Validate decoded length against fixed-length columns.
- **Rationale**: Matches MySQL's string-literal escape table. The length check caught nothing on
  2026-10-13 (all 48 values were 16 bytes) but is the only guard against a silent wrong decode.
- **Alternatives considered**: Regex replacement in `sed` — rejected; macOS `sed` aborts on
  non-UTF-8 bytes ("illegal byte sequence") and left a truncated 526 KB file from a 2.9 MB input
  during the original fix.

## R3. What Studio's importer already accepts

- **Decision**: Leave versioned comments (`/*!40101 ... */`), `LOCK TABLES`, `DISABLE KEYS`,
  `ENGINE=`, charset/collation clauses and `ON UPDATE CURRENT_TIMESTAMP` alone.
- **Rationale**: The 2026-10-13 dump contained all of them and imported once the known fixes were
  applied. The SQLite Database Integration 3.x driver (`WP_MySQL_On_SQLite`) parses MySQL syntax
  with a full grammar rather than regex translation.
- **Alternatives considered**: Stripping every MySQL-specific clause defensively — rejected; it
  widens the diff and risks changing column semantics for no benefit.

## R4. SQLite integration internal tables (Studio to remote)

- **Decision**: Flag as must-remove any table named `_wp_sqlite_*`, `_mysql_data_types_cache`, or
  `sqlite_*` in a Studio export.
- **Rationale**: Verified in the local Studio site's `.ht.sqlite` and in the plugin source
  (`RESERVED_PREFIX = '_wp_sqlite_'` in `class-wp-mysql-on-sqlite.php`, SQLite Database
  Integration 3.0.2): `_wp_sqlite_global_variables` and eight
  `_wp_sqlite_mysql_information_schema_*` tables exist alongside `sqlite_sequence`. The legacy
  driver used `_mysql_data_types_cache`. phpMyAdmin may or may not list them depending on driver
  version, so the check looks for them rather than assuming.
- **Alternatives considered**: Hard-coding the nine current names — rejected; prefix matching
  survives driver upgrades.

## R5. Collations on the target server

- **Decision**: Warn on `utf8mb4_0900_*` collations when the user names a MySQL 5.7 or MariaDB
  target, suggesting `utf8mb4_unicode_520_ci` (WordPress's default since 4.6); warn on `utf8mb3`
  and `latin1` tables as an informational finding.
- **Rationale**: MySQL 8 introduced the `0900` collations; MySQL 5.7 and MariaDB reject them with
  "Unknown collation" and abort the import.
- **Alternatives considered**: Rewriting collations automatically — rejected for v1; it changes
  sort behaviour and needs the user's target version, so it is reported, then fixed on request.

## R6. Serialisation-safe URL replacement

- **Decision**: Use WP-CLI `search-replace` through `studio wp` (Studio bundles WP-CLI): always
  `--dry-run` first with `--report-changed-only`, then the real run. For a Studio site, replace in
  place. For a staging or live target, use `--export=<file>` so the local database is untouched
  and the user imports the new file.
- **Rationale**: WP-CLI unserialises, replaces and re-serialises PHP-serialised values, fixing the
  string length prefixes (`s:17:"..."`) that a text replacement breaks. `studio wp search-replace
  --help` on Studio 1.24 lists `--dry-run`, `--export`, `--all-tables-with-prefix` and `--precise`.
- **Alternatives considered**: Byte replacement in the SQL file — rejected (corrupts serialised
  data unless lengths are recalculated); a custom serialised-aware replacer in the Node script —
  rejected for v1, WP-CLI is already present and battle-tested.

## R7. Finding the site URL in an export

- **Decision**: Match `CREATE TABLE` names ending `_options`, then read `siteurl` and `home` from
  that table's `INSERT` rows by parsing the value tuples, never by regex over the whole line.
- **Rationale**: Table prefixes vary (`wp_`, `wp123_`, custom), multisite has `wp_2_options`, and
  a naive regex can match the strings `'siteurl'` inside serialised data in other tables.
- **Observed**: Studio's importer rewrote `siteurl` to `https://beta.local` after the 2026-10-13
  import (the dump held `http://beta.local`), so `siteurl`/`home` are handled by Studio for the
  to-Studio direction; content URLs in posts, postmeta and options still need skill 3.

## R8. Agent layout

- **Decision**: Follow changelog-agent (spec 016): canonical `*.agent.md`, `AGENT.md`, `README.md`,
  `CHANGELOG.md`, `package.json`, `skills/`, `tests/`; generated `.claude/agents/` thin
  definition via `scripts/agents/generate-agent-defs.cjs`.
- **Rationale**: It is the most recent agent brought into line with spec 014 and is the one the
  thin-definition generator already supports.
- **Alternatives considered**: The older `wp-config-agent` layout (`claude/`, `copilot/`,
  `openai/`, `manifests/`) — rejected; spec 014 is consolidating away from it.
