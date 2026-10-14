---
name: schema-markup-validation
description: Validate the JSON-LD structured data on WordPress pages against the official schema.org vocabulary (from the schemaorg/schemaorg GitHub release files) and Google's rich-result requirements. Use to audit a site's schema, spot-check a few pages after a change, or re-test one post type. Reports unknown terms, wrong property placement, missing required properties, expired offers, redirects and broken references, without changing the site.
---

# Schema Markup Validation

Fetch each page, extract every `<script type="application/ld+json">` block,
and check it against the schema.org vocabulary and Google's rich-result
rules. The check is read-only.

## When to use this skill

- A full audit, after [`schema-test-urls`](../schema-test-urls/SKILL.md) has
  produced a URL list.
- A spot check of named pages ("check the specials again", "test the tour
  page").
- Before and after a schema change, to compare runs.

## Procedure

### 1. Gather the facts

- The URLs, or the URL file from `schema-test-urls`.
- Whether the user wants a particular schema.org release (default: the latest
  release in `schemaorg/schemaorg`).
- For offers and events: whether "today" should be a different date, for
  example to test what happens after a special ends.

### 2. Run the check

In a clone of `lightspeedwp/.github` (Node.js 20+):

```bash
node agents/wp-schema-audit-agent/lib/schema-tool.cjs validate --urls-file urls.txt
node agents/wp-schema-audit-agent/lib/schema-tool.cjs validate <url> <url> --details
```

| Option                  | Use                                                            |
| ----------------------- | -------------------------------------------------------------- |
| `--details`             | List every finding per page, with the path to the node.        |
| `--json`                | Machine-readable report, to save or compare between runs.      |
| `--vocab-version 30.1`  | Check against a specific schema.org release.                   |
| `--vocab <file>`        | Use a local vocabulary file; no network needed.                |
| `--today 2026-12-01`    | Treat this date as today for expired-offer checks.             |

The first run downloads the release file
(`data/releases/<version>/schemaorg-all-https.jsonld`) and caches it in
`~/.cache/lightspeedwp/schemaorg/`. Exit code `0` means no errors or
warnings, `1` findings to review, `2` a tool error.

### 3. What is checked

| Check                                    | Severity | Meaning                                                                                       |
| ---------------------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `unknown-type`, `unknown-property`       | error    | Not a schema.org term; usually a typo or a made-up name.                                      |
| `invalid-json`, `http-status`, `fetch-failed` | error | The block or page could not be read.                                                     |
| `property-domain`                        | warn     | The property is not defined for this type (for example `additionalProperty` on a `Review`).  |
| `property-range`                         | warn     | The value is the wrong type (for example a `LodgingBusiness` as an Offer's `itemOffered`).   |
| `enum-value`                             | warn     | Not a member of the enumeration (for example a misspelt `availability`).                     |
| `superseded-*`, `retired-*`              | warn     | The term has been replaced or retired.                                                        |
| `unresolved-reference`                   | warn     | `{"@id": …}` points to a node no block on the page defines.                                   |
| `duplicate-id`                           | warn     | Two blocks define the same `@id` with different types, usually two plugins.                  |
| `rich-result-required`                   | warn     | Google needs this property to show a rich result (for example a Review's `itemReviewed`).    |
| `expired-offer`                          | warn     | The offer ended but still says it is available.                                               |
| `date-order`, `date-format`, `empty-value` | warn   | Reversed date ranges, non-ISO dates, empty strings or lists.                                  |
| `redirected`                             | warn     | The URL redirects; crawlers see the destination's schema.                                     |
| `no-structured-data`                     | warn     | The page has no JSON-LD at all.                                                               |
| `pending-*`                              | info     | Valid, but still in schema.org's pending section; Google may ignore it.                       |
| `rich-result-recommended`, `address-text`, `text-for-thing`, `html-entity` | info | Improvements, not faults.                      |

The page table also shows which plugin produced the JSON-LD (`Yoast SEO`,
`Rank Math`, `All in One SEO` or `unattributed` for anything else, such as a
custom plugin).

### 4. Hand over

Pass the report to [`schema-audit-report`](../schema-audit-report/SKILL.md)
to turn it into fixes. For a quick spot check, summarise directly: what
changed since the last run, and what still fails.

## Known false alarms

- `query-input` on a `SearchAction` is a schema.org Action annotation, not a
  property; the tool accepts it.
- A URL string where schema.org expects an object (for example a breadcrumb
  `item`) is accepted; Google reads it as a reference.

## Rules

- GET requests only, to the URLs agreed with the user.
- Never repeat personal data from the markup (staff email addresses or
  telephone numbers) in the summary; say it is present.
- The rich-result rules summarise Google's documentation as of the date in
  the tool; tell the user to confirm eligibility with Google's Rich Results
  Test (https://search.google.com/test/rich-results) for public URLs.

---

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
