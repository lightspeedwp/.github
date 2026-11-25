# Quickstart: WordPress Schema Audit Agent

How to check the feature works end to end.

## Prerequisites

- A clone of `lightspeedwp/.github` with `npm ci` run, and Node.js 20+.
- A WordPress site to test, for example a local site at `https://beta.local/`.

## 1. Unit tests

```bash
npx jest agents/wp-schema-audit-agent
```

Expected: every test passes with no network access.

## 2. Pick test URLs (Story 1)

```bash
node agents/wp-schema-audit-agent/lib/schema-tool.cjs urls https://beta.local/
```

Expected: a table with the home page, one single per public post type, each archive, one term per
taxonomy in use, key pages, an author archive and a search URL, plus a skipped list with reasons.

## 3. Validate (Story 2)

```bash
node agents/wp-schema-audit-agent/lib/schema-tool.cjs urls https://beta.local/ --list > /tmp/urls.txt
node agents/wp-schema-audit-agent/lib/schema-tool.cjs validate --urls-file /tmp/urls.txt
```

Expected: a page table with generators and types, and a findings table grouped by check. The first
run downloads the latest schema.org release; later runs reuse the cache.

## 4. Report (Story 3)

Ask the agent: "Use the wp-schema-audit-agent to tell me what to fix on `https://beta.local/`".

Expected: site-wide causes first, then a fix table with an owner for each fix, and a reminder to
confirm eligibility with Google's Rich Results Test.

## 5. Client report and CSV (Story 4)

```bash
node agents/wp-schema-audit-agent/lib/schema-tool.cjs audit https://beta.local/ \
  --format report --client "Example client" --out /tmp/schema-report.md --csv /tmp/schema-findings.csv
```

Expected: the totals and two "Wrote" lines. The report opens with the client name and a summary by
priority; the CSV opens in a spreadsheet with one row per finding. Running it again without
`--force` refuses to replace the files.

## 6. Repository validators

```bash
node scripts/agents/generate-agent-defs.cjs --check
npm run validate:agents
npm run validate:frontmatter
npx markdownlint-cli2 "agents/wp-schema-audit-agent/**/*.md" ".github/specs/023-wp-schema-audit-agent/**/*.md"
npx eslint agents/wp-schema-audit-agent
```
