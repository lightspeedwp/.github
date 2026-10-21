# WordPress Schema Audit Agent

Check the structured data (JSON-LD) a WordPress site publishes against the
[schema.org vocabulary](https://github.com/schemaorg/schemaorg) and Google's
rich-result rules.

| You want to…                                              | Use                                                                      |
| --------------------------------------------------------- | ------------------------------------------------------------------------ |
| Get a list of URLs that covers every kind of page         | [`schema-test-urls`](./skills/schema-test-urls/SKILL.md)                 |
| Validate the schema on a site, or spot-check a few pages | [`schema-markup-validation`](./skills/schema-markup-validation/SKILL.md) |
| Turn the results into fixes someone can act on           | [`schema-audit-report`](./skills/schema-audit-report/SKILL.md)           |

## Quick start

### In Claude Code (this repository)

Ask for the agent by name, for example:

> Use the wp-schema-audit-agent to audit the schema on https://beta.local/.

> Use the wp-schema-audit-agent to check the specials on the dev site again.

The generated definition in `.claude/agents/wp-schema-audit-agent.md` points
Claude Code at the [canonical specification](./wp-schema-audit.agent.md).

### In any other AI assistant

Paste the relevant `SKILL.md` into the conversation along with the site URL.
Each skill works on its own; the tool commands need a clone of this repository
and Node.js 20+.

### Without an assistant

```bash
# One URL per post type, archive, taxonomy, key page, author and search
node agents/wp-schema-audit-agent/lib/schema-tool.cjs urls https://beta.local/ --list > urls.txt

# Validate them against the latest schema.org release
node agents/wp-schema-audit-agent/lib/schema-tool.cjs validate --urls-file urls.txt

# Spot-check a page, with every finding listed
node agents/wp-schema-audit-agent/lib/schema-tool.cjs validate https://beta.local/special/a/ --details

# Client deliverables: discover, validate, and write a Markdown report and a CSV
node agents/wp-schema-audit-agent/lib/schema-tool.cjs audit https://beta.local/ \
  --format report --client "Client name" --out schema-report.md --csv schema-findings.csv
```

Add `--json` for machine-readable output. Exit codes: `0` no errors or
warnings, `1` findings to review, `2` tool error.

## Client reports

| Output | Option | For |
| --- | --- | --- |
| Developer summary | `--format summary` (default) | The team: page table and grouped findings with technical detail. |
| Client report (Markdown) | `--format report` | The site owner: summary by priority (Must fix, Should fix, Could improve), what each page describes in plain names, each issue with why it matters and what to do, and how the check was made. |
| Findings spreadsheet (CSV) | `--format csv`, or `--csv <file>` with any format | Tracking fixes: one row per finding, plus one per clean page, in the same plain wording. Opens in Excel, Numbers or Google Sheets. |
| Data | `--format json` | Comparing runs or feeding other tools. |

Reports never repeat values from a page's structured data other than URLs,
type and property names and dates, so they carry no personal data.

## What it checks

| Check                                   | Severity | Source                                         |
| --------------------------------------- | -------- | ---------------------------------------------- |
| Unknown types or properties             | error    | schema.org vocabulary                          |
| JSON that does not parse; HTTP errors   | error    | The page                                       |
| Property on the wrong type; value of the wrong type; invalid enumeration value | warn | schema.org vocabulary |
| Superseded or retired terms             | warn     | schema.org vocabulary                          |
| References to nodes nobody defines; one `@id` with two types | warn | The page              |
| Missing properties Google needs for a rich result | warn | Google Search Central (summarised) |
| Expired offers still marked available; reversed date ranges; malformed dates; empty values | warn | The page |
| Pages that redirect, or have no JSON-LD | warn     | The page                                       |
| Pending terms; recommended properties; text where an object is expected; HTML entities in text | info | Both |

Local development hosts (`*.local`, `*.test`, `localhost`) are fetched without
certificate checks, because their certificates are self-signed. Every other
host is checked normally.

## Safety

- Read-only: GET requests to public pages, no cookies, no credentials.
- The site is never changed; fixes are reported for someone to make.
- Personal data in structured data is reported as present, never repeated.

## Development

```bash
npx jest agents/wp-schema-audit-agent
```

Design documents: [spec 023](../../.github/specs/023-wp-schema-audit-agent/).

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
