# Data Model: WordPress DB Migration Agent

**Feature**: [spec.md](./spec.md) | **Date**: 2026-10-13

All entities are JSON objects emitted by `lib/sql-tool.cjs` with `--json`, and rendered as
Markdown tables by the skills. No data rows from the dump are ever included.

## SqlExport

| Field | Type | Rules |
| --- | --- | --- |
| `path` | string | Absolute path of the input. Never written. |
| `bytes` | integer | Size of the input. |
| `lines` | integer | Newline count. |
| `createTables` | integer | Count of `CREATE TABLE` statements. |
| `inserts` | integer | Count of `INSERT INTO` statements. |
| `tables` | string[] | Table names in order of `CREATE TABLE`. |
| `prefixes` | string[] | Distinct prefixes inferred from `*_options` tables. |

## Edit (sanitise)

| Field | Type | Rules |
| --- | --- | --- |
| `rule` | enum | `gtid-purged`, `gtid-comment`, `sql-log-bin`, `binary-literal`. |
| `line` | integer | 1-based line in the input. |
| `table` | string \| null | Table for `binary-literal` edits. |
| `count` | integer | Literals converted on that line (`binary-literal` only). |
| `reason` | string | Plain-English why. |

## Finding (sanitise scan and preflight)

| Field | Type | Rules |
| --- | --- | --- |
| `check` | string | Check id, for example `internal-table`, `collation-0900`, `create-database`, `definer`, `local-url`. |
| `severity` | enum | `fail`, `warn`, `info`. |
| `line` | integer \| null | 1-based line, when the finding is a statement. |
| `table` | string \| null | Table involved. |
| `detail` | string | What was found, without data values. |
| `fix` | string | Suggested fix. |
| `autoFixable` | boolean | Whether the tool can apply it on request. |

State transitions: a finding is `reported` → (user approves) `fixed` | (user declines) `accepted`.
Only `reported` is tracked by the tool; the skill records the user's decision in its report.

## SiteUrl

| Field | Type | Rules |
| --- | --- | --- |
| `table` | string | The `*_options` table it came from. |
| `option` | enum | `siteurl`, `home`. |
| `value` | string | The URL. URLs are not personal data and may be shown. |

## UrlPair

| Field | Type | Rules |
| --- | --- | --- |
| `from` | string | Source URL, from `SiteUrl` or added by the user. |
| `to` | string | Destination URL the user confirmed. |
| `previewCount` | integer | Replacements reported by the dry run. |
| `applied` | boolean | True only after the user confirms the real run. |

## Result envelope

```json
{
  "command": "sanitise | preflight | site-urls",
  "status": "ok | findings | error",
  "input": { "...SqlExport" },
  "output": { "path": "...", "bytes": 0, "lines": 0, "createTables": 0, "inserts": 0 },
  "edits": [],
  "findings": [],
  "siteUrls": [],
  "error": null
}
```

Validation rules: `output.createTables` MUST equal `input.createTables` and `output.inserts` MUST
equal `input.inserts` for `sanitise`, otherwise `status` is `error` and no output file is kept.
