# Quickstart: WordPress DB Migration Agent

**Feature**: [spec.md](./spec.md) | **CLI contract**: [contracts/sql-tool-cli.md](./contracts/sql-tool-cli.md)

## Prerequisites

- Node.js 20+, repository dependencies installed (`npm ci`).
- WordPress Studio 1.24+ with at least one local site, for the end-to-end checks.

## 1. Unit tests

```bash
npx jest agents/wp-db-migration-agent
```

Expected: all tests pass, covering each known fix, the length guard, byte preservation, scan
findings, preflight checks and `siteurl` lookup across prefixes.

## 2. Sanitise a MySQL export (Story 1)

```bash
node agents/wp-db-migration-agent/lib/sql-tool.cjs sanitise ~/Desktop/my-backup.sql
```

Expected: `~/Desktop/my-backup-sqlite.sql` is written; the report lists five removed lines and the
`wp_pmxi_hash` binary-literal conversion (48 literals); counts match; original unchanged
(`shasum` before and after is identical). Importing the output in Studio succeeds.

## 3. Preflight a Studio export (Story 2)

```bash
node agents/wp-db-migration-agent/lib/sql-tool.cjs preflight studio-export.sql --target mysql-5.7 --prefix wp_
```

Expected: a pass/warn/fail table; internal `_wp_sqlite_*` tables, `0900` collations and `.local`
URLs are flagged when present; exit code 1 when anything is flagged.

## 4. Find and replace the site URL (Story 3)

```bash
node agents/wp-db-migration-agent/lib/sql-tool.cjs site-urls studio-export.sql
studio wp --path ~/Studio/<site> search-replace 'https://<site>.local' 'https://staging.example.com' --all-tables --dry-run --report-changed-only
```

Expected: the `siteurl`/`home` values and their table are reported; the dry run reports counts per
table without changing anything.

## 5. Repository validators

```bash
npm run validate:agents && npm run validate:skills && npx markdownlint-cli2 "agents/wp-db-migration-agent/**/*.md"
node scripts/agents/generate-agent-defs.cjs --check
```

Expected: no new findings; the generated `.claude/agents/wp-db-migration-agent.md` is in sync.
