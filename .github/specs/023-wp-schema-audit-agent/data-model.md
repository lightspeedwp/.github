# Data Model: WordPress Schema Audit Agent

The tool's JSON output (`--json`) uses these shapes. Field names are stable; new fields may be
added.

## TestUrl

| Field   | Type   | Notes                                                              |
| ------- | ------ | ------------------------------------------------------------------ |
| `kind`  | string | `home`, `single`, `archive`, `term`, `page`, `author` or `search`  |
| `label` | string | Post type or taxonomy name, page slug, or a description            |
| `url`   | string | Absolute URL                                                       |
| `note`  | string | Empty, or `redirects to <url>`                                     |

## SkippedCandidate

| Field    | Type   | Notes                                                                      |
| -------- | ------ | -------------------------------------------------------------------------- |
| `kind`   | string | As TestUrl                                                                 |
| `label`  | string | As TestUrl                                                                 |
| `url`    | string | The candidate URL, or empty when there was none                            |
| `reason` | string | `HTTP <status>`, `no published items`, `no terms in use`, or an error      |

## Discovery result (`urls --json`)

```json
{ "site": "https://beta.local", "urls": [TestUrl], "skipped": [SkippedCandidate], "notes": ["…"] }
```

## Finding

| Field      | Type   | Notes                                                                 |
| ---------- | ------ | --------------------------------------------------------------------- |
| `severity` | string | `error`, `warn` or `info`                                             |
| `check`    | string | Check name, for example `property-domain` (see the validation skill)  |
| `path`     | string | Location, for example `block0.@graph[3]<Review>.additionalProperty`, or the URL for page-level checks |
| `detail`   | string | One sentence; never contains personal data from the markup            |

## PageResult

| Field         | Type                  | Notes                                                      |
| ------------- | --------------------- | ---------------------------------------------------------- |
| `kind`        | string                | From discovery (`audit`), or empty for `validate`          |
| `label`       | string                | From discovery (`audit`), or empty for `validate`          |
| `url`         | string                | As requested                                               |
| `finalUrl`    | string                | After redirects                                            |
| `status`      | number or null        | Final HTTP status; null when the request failed            |
| `redirects`   | array                 | `{ status, from, to }` per hop                             |
| `generators`  | string[]              | `Yoast SEO`, `Rank Math`, `All in One SEO`, `unattributed` |
| `yoastActive` | boolean               | Yoast's HTML comment is present                            |
| `blocks`      | number                | JSON-LD blocks found                                       |
| `types`       | object                | Type name → count                                          |
| `findings`    | Finding[]             | Errors first, then warnings, then notes                    |

## Report envelope (`validate --json`)

```json
{
  "vocabulary": { "version": "30.1" },
  "pages": [PageResult],
  "totals": { "error": 0, "warn": 3, "info": 12 },
  "notes": ["Using cached release 30.0; the latest release could not be checked."]
}
```

`audit` adds `"site"` (the site origin) and `"skipped"` ([SkippedCandidate]) to the envelope.

## Client report (`--format report`)

Markdown, in this order: title with the client name; site, date, pages checked and schema.org
release; Summary (plain explanation, counts of distinct issues by priority, and any issue that
affects every page); What each page describes (path, kind of page, main types with plain names,
status); Issues to fix (one section per distinct finding: priority, what we found, why it matters,
what to do, pages affected); Suggestions for improvement; How this check was made (including what
was skipped and why).

| Severity | Priority shown |
| -------- | -------------- |
| `error`  | Must fix       |
| `warn`   | Should fix     |
| `info`   | Could improve  |

## Findings CSV (`--format csv`, `--csv`)

One row per finding, plus one row per page without findings (priority `None`, issue
`No issues found`), so every page checked appears.

| Column           | Content                                              |
| ---------------- | ---------------------------------------------------- |
| `page_url`       | PageResult `url`                                     |
| `page_path`      | Path and query of the URL                            |
| `page_kind`      | Plain kind, for example `Tours: single item`         |
| `http_status`    | PageResult `status`                                  |
| `priority`       | `Must fix`, `Should fix`, `Could improve` or `None`  |
| `severity`       | Finding `severity`                                   |
| `check`          | Finding `check`                                      |
| `issue`          | Plain title of the check                             |
| `detail`         | Finding `detail`                                     |
| `why_it_matters` | Plain explanation of the check                       |
| `what_to_do`     | Plain fix for the check                              |
| `location`       | Finding `path`                                       |
