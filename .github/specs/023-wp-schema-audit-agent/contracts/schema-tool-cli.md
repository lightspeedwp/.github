# Contract: `schema-tool.cjs` CLI

```text
node agents/wp-schema-audit-agent/lib/schema-tool.cjs <command> [options]

  urls <site-url>     One test URL per post type, archive, taxonomy, key page, author and search
  validate <url...>   Check each page's JSON-LD against schema.org and rich-result rules
  audit <site-url>    urls, then validate the discovered pages, with each page's kind kept
  vocab               Download or reuse the cached vocabulary and report its release
```

## Options

| Option                   | Commands          | Meaning                                                        |
| ------------------------ | ----------------- | -------------------------------------------------------------- |
| `--list`                 | `urls`            | Print URLs only, one per line                                  |
| `--search <term>`        | `urls`, `audit`   | Search term for the search results URL (default `a`)           |
| `--urls-file <file>`     | `validate`, `audit` | Read URLs from a file; blank lines and `#` comments ignored. For `audit`, adds pages to the discovered set |
| `--vocab <file>`         | `validate`, `audit` | Use this vocabulary file; no download                          |
| `--vocab-version <v>`    | `validate`, `audit`, `vocab` | Use this schema.org release instead of the latest            |
| `--today <YYYY-MM-DD>`   | `validate`, `audit` | Date to treat as today for expired-offer checks                |
| `--details`              | `validate`, `audit` | Add every finding per page to the summary format             |
| `--format <f>`           | `validate`, `audit` | `summary` (default, for developers), `report` (Markdown for a client), `csv`, `json` |
| `--out <file>`           | `validate`, `audit` | Write the chosen format to a file instead of standard output   |
| `--csv <file>`           | `validate`, `audit` | Also write the CSV of findings to a file                       |
| `--client <name>`        | `validate`, `audit` | Name in the client report's title (default: the site's origin) |
| `--force`                | `validate`, `audit` | Replace existing `--out` and `--csv` files                     |
| `--cache-dir <dir>`      | `validate`, `audit`, `vocab` | Vocabulary cache (default `SCHEMA_TOOL_CACHE` or `~/.cache/lightspeedwp/schemaorg`) |
| `--json`                 | all               | Machine-readable output (see data-model.md); same as `--format json` |

## Exit codes

| Code | Meaning                                                                   |
| ---- | ------------------------------------------------------------------------- |
| `0`  | `urls`/`vocab` succeeded; `validate` or `audit` found no errors or warnings |
| `1`  | `validate` or `audit` found errors or warnings to review                  |
| `2`  | Tool error: bad usage, REST API unreachable, no vocabulary available      |

## Guarantees

- Only GET requests; no cookies, credentials or request bodies.
- TLS certificates are verified for every host except `localhost`, `127.0.0.1`, `[::1]`, `*.local`,
  `*.test` and `*.localhost`.
- Responses are capped at 20 MB, 30 seconds and five redirects per URL; a page that exceeds a cap
  is reported and the run continues.
- The tool writes only the vocabulary cache (through a temporary file renamed into place, and only
  after the download parses as JSON) and the files named by `--out` and `--csv`. Those are created
  exclusively and never replace an existing file unless `--force` is given.
- When `--out` or `--csv` is given, standard output carries only the totals and the files written.
- The CSV is RFC 4180 with CRLF line endings and a UTF-8 byte order mark. A field starting with `=`,
  `+`, `-`, `@`, tab or carriage return is prefixed with an apostrophe so a spreadsheet never runs
  it as a formula.
- The client report and CSV repeat no values from a page's structured data other than URLs, type
  and property names and dates.
