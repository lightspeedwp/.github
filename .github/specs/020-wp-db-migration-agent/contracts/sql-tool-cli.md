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

## Options

| Option | Commands | Meaning |
| --- | --- | --- |
| `--out <path>` | `sanitise` | Output path. Refuses to equal the input path. Refuses to overwrite an existing file unless `--force`. |
| `--force` | `sanitise` | Allow overwriting an existing output file (never the input). |
| `--target <mysql-5.7\|mysql-8\|mariadb-10\|mariadb-11>` | `preflight` | Target server, for collation checks. Default: report as `warn`. |
| `--prefix <prefix>` | `preflight` | Target table prefix; differing tables are flagged. |
| `--json` | all | Print the result envelope as JSON instead of Markdown. |

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | `ok`: no findings above `info` (for `sanitise`, output written and verified). |
| 1 | `findings`: at least one `warn` or `fail` finding (for `sanitise`, output still written). |
| 2 | `error`: bad arguments, unreadable input, failed verification, or a binary literal whose decoded length disagrees with its column. No output file is left behind. |

## Guarantees

- The input file is opened read-only and its bytes are never changed.
- All processing is byte-based; non-UTF-8 content passes through unchanged.
- Output for `sanitise` differs from input only on lines named in `edits`.
- No data values are printed except `siteurl`/`home` URLs.
