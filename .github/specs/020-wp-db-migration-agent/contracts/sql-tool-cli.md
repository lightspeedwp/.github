# Contract: `sql-tool.cjs` CLI

**Feature**: [../spec.md](../spec.md) | **Entities**: [../data-model.md](../data-model.md)

```text
node agents/wp-db-migration-agent/lib/sql-tool.cjs <command> <input.sql> [options]
```

| Command | Purpose | Writes |
| --- | --- | --- |
| `sanitise` | Apply the known MySQL-to-Studio fixes and scan for other risks. | `<input>-sqlite.sql` (or `--out`) |
| `preflight` | Check a Studio export before import into MySQL/MariaDB. | Nothing |
| `site-urls` | Report `siteurl`/`home` from every `*_options` table. | Nothing |
| `tables` | List every table with rows, size and group (core, users, wordfence, plugin), to choose exclusions. | Nothing |

## Options

| Option | Commands | Meaning |
| --- | --- | --- |
| `--out <path>` | `sanitise` | Output path. Refuses to equal the input path. Refuses to overwrite an existing file unless `--force`. |
| `--force` | `sanitise` | Allow overwriting an existing output file (never the input). |
| `--target <mysql-5.7\|mysql-8\|mariadb-10\|mariadb-11>` | `preflight` | Target server, for collation checks. Default: report as `warn`. |
| `--prefix <prefix>` | `preflight` | Target table prefix; differing tables are flagged. |
| `--prefix <prefix>` | `sanitise` | Rename the export's tables to this prefix, plus `<prefix>user_roles` in options and `<prefix>*` keys in usermeta. Needs exactly one WordPress prefix in the export; refuses collisions. |
| `--keep-wordfence` | `sanitise` | Keep Wordfence's tables (`<prefix>wf*`, `<prefix>wfls_*`), which are left out by default. |
| `--exclude <pattern>` | `sanitise` | Leave out tables matching the pattern (repeatable or comma-separated; `*` and `?`; matched with or without the WordPress prefix). Warns on patterns that match nothing and on core tables. |
| `--keep-users` | `sanitise` | Leave out the export's `<prefix>users` and `<prefix>usermeta` tables so the Studio site keeps its accounts. With `--studio-site`, exit 2 unless the output prefix matches the site's. |
| `--studio-site <path>` | `sanitise`, `site-urls` | Studio site folder. Reads `$table_prefix` from its `wp-config.php` and warns (`prefix-differs`) when the export's prefix, after any `--prefix` rename, differs. Reads the site's custom URL from `~/.studio/cli.json` (override with `STUDIO_CLI_CONFIG`) and adds `urlReplacement` (sources, destination, WP-CLI regex and replacement, link count, preview command) to the result. The dump's URLs are never changed. |
| `--json` | all | Print the result envelope as JSON instead of Markdown. |

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | `ok`: no findings above `info` (for `sanitise`, output written and verified). |
| 1 | `findings`: at least one `warn` or `fail` finding (for `sanitise`, output still written). |
| 2 | `error`: bad arguments, unreadable input, failed verification, a binary literal or binary default whose length disagrees with its column, or (`sanitise`) an input already in SQLite's own dialect. No output file is left behind. |

## Guarantees

- The input file is opened read-only and its bytes are never changed.
- All processing is byte-based; non-UTF-8 content passes through unchanged.
- Output for `sanitise` differs from input only on lines named in `edits` (a `drop-table` edit adds one `DROP TABLE IF EXISTS` line before the named `CREATE TABLE`), plus table names (and the prefixed option and usermeta keys) when `--prefix` is given.
- Output for `sanitise` stays MySQL syntax: the Studio importer translates MySQL to SQLite itself and rejects SQLite's own dialect.
- No data values are printed except `siteurl`/`home` URLs.
