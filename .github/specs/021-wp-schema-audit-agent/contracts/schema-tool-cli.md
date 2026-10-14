# Contract: `schema-tool.cjs` CLI

```text
node agents/wp-schema-audit-agent/lib/schema-tool.cjs <command> [options]

  urls <site-url>     One test URL per post type, archive, taxonomy, key page, author and search
  validate <url...>   Check each page's JSON-LD against schema.org and rich-result rules
  vocab               Download or reuse the cached vocabulary and report its release
```

## Options

| Option                   | Commands          | Meaning                                                        |
| ------------------------ | ----------------- | -------------------------------------------------------------- |
| `--list`                 | `urls`            | Print URLs only, one per line                                  |
| `--search <term>`        | `urls`            | Search term for the search results URL (default `a`)           |
| `--urls-file <file>`     | `validate`        | Read URLs from a file; blank lines and `#` comments ignored    |
| `--vocab <file>`         | `validate`        | Use this vocabulary file; no download                          |
| `--vocab-version <v>`    | `validate`, `vocab` | Use this schema.org release instead of the latest            |
| `--today <YYYY-MM-DD>`   | `validate`        | Date to treat as today for expired-offer checks                |
| `--details`              | `validate`        | Add every finding per page to the Markdown report              |
| `--cache-dir <dir>`      | `validate`, `vocab` | Vocabulary cache (default `SCHEMA_TOOL_CACHE` or `~/.cache/lightspeedwp/schemaorg`) |
| `--json`                 | all               | Machine-readable output (see data-model.md)                    |

## Exit codes

| Code | Meaning                                                                   |
| ---- | ------------------------------------------------------------------------- |
| `0`  | `urls`/`vocab` succeeded; `validate` found no errors or warnings           |
| `1`  | `validate` found errors or warnings to review                             |
| `2`  | Tool error: bad usage, REST API unreachable, no vocabulary available      |

## Guarantees

- Only GET requests; no cookies, credentials or request bodies.
- TLS certificates are verified for every host except `localhost`, `127.0.0.1`, `[::1]`, `*.local`,
  `*.test` and `*.localhost`.
- Responses are capped at 20 MB, 30 seconds and five redirects per URL; a page that exceeds a cap
  is reported and the run continues.
- The only file written is the vocabulary cache, through a temporary file renamed into place, and
  only after the download parses as JSON.
