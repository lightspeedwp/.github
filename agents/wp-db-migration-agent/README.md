# WordPress DB Migration Agent

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs%20Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling%20Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main%20Branch%20Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata%20Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template%20Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate%20PR%20Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges:%20Documentation%20Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges:%20Health%20Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges:%20README%20Status%20Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges:%20Workflow%20Inventory%20Audit-OK-success.svg)
[![ai-feedback-validation](https://github.com/lightspeedwp/.github/actions/workflows/ai-feedback-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/ai-feedback-validation.yml)
[![ai-feedback](https://github.com/lightspeedwp/.github/actions/workflows/ai-feedback.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/ai-feedback.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-unified](https://github.com/lightspeedwp/.github/actions/workflows/changelog-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-unified.yml)
[![claude-guard-tests](https://github.com/lightspeedwp/.github/actions/workflows/claude-guard-tests.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/claude-guard-tests.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![keep-pr-current](https://github.com/lightspeedwp/.github/actions/workflows/keep-pr-current.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/keep-pr-current.yml)
[![label-drift-check](https://github.com/lightspeedwp/.github/actions/workflows/label-drift-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-drift-check.yml)
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![linear-review-platform](https://github.com/lightspeedwp/.github/actions/workflows/linear-review-platform.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linear-review-platform.yml)
[![lint](https://github.com/lightspeedwp/.github/actions/workflows/lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/lint.yml)
[![locked-files-guard](https://github.com/lightspeedwp/.github/actions/workflows/locked-files-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/locked-files-guard.yml)
[![orchestrate-phase-progression](https://github.com/lightspeedwp/.github/actions/workflows/orchestrate-phase-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/orchestrate-phase-progression.yml)
[![phase-progression](https://github.com/lightspeedwp/.github/actions/workflows/phase-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/phase-progression.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![qodo-pr-agent-report](https://github.com/lightspeedwp/.github/actions/workflows/qodo-pr-agent-report.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/qodo-pr-agent-report.yml)
[![qodo-pr-agent-reusable](https://github.com/lightspeedwp/.github/actions/workflows/qodo-pr-agent-reusable.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/qodo-pr-agent-reusable.yml)
[![qodo-pr-agent-trigger](https://github.com/lightspeedwp/.github/actions/workflows/qodo-pr-agent-trigger.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/qodo-pr-agent-trigger.yml)
[![qodo-pr-agent](https://github.com/lightspeedwp/.github/actions/workflows/qodo-pr-agent.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/qodo-pr-agent.yml)
[![ruleset-drift](https://github.com/lightspeedwp/.github/actions/workflows/ruleset-drift.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/ruleset-drift.yml)
[![tests](https://github.com/lightspeedwp/.github/actions/workflows/tests.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/tests.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Move WordPress databases between live or staging sites (MySQL) and
[WordPress Studio](https://developer.wordpress.com/studio/) local sites
(SQLite).

| You want to…                                                                 | Use                                                                        |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Import a live or staging database into Studio, or fix a failed Studio import | [`mysql-to-studio-sanitiser`](./skills/mysql-to-studio-sanitiser/SKILL.md) |
| Check a Studio database before it goes to staging or live                    | [`studio-export-preflight`](./skills/studio-export-preflight/SKILL.md)     |
| Change the site URL inside the database                                      | [`wp-url-replacement`](./skills/wp-url-replacement/SKILL.md)               |

## Quick start

### In Claude Code (this repository)

Ask for the agent by name, for example:

> Use the wp-db-migration-agent to get `~/Desktop/staging-backup.sql` into my
> Studio site "beta".

The generated definition in `.claude/agents/wp-db-migration-agent.md` points
Claude Code at the [canonical specification](./wp-db-migration.agent.md).

### In any other AI assistant

Paste the relevant `SKILL.md` into the conversation along with the path to your
export. Each skill works on its own; the tool commands need a clone of this
repository and Node.js 20+, and each skill describes a manual fallback.

### Without an assistant

```bash
# MySQL export → Studio-ready copy (writes <name>-sqlite.sql beside it)
node agents/wp-db-migration-agent/lib/sql-tool.cjs sanitise ~/Desktop/export.sql

# Check a Studio export before staging or live
node agents/wp-db-migration-agent/lib/sql-tool.cjs preflight studio.sql --target mysql-8 --prefix wp_

# Show siteurl/home from an export, and compare its prefix with a Studio site
node agents/wp-db-migration-agent/lib/sql-tool.cjs site-urls export.sql --studio-site ~/Studio/my-site

# List tables with rows, size and group, to choose what to leave out
node agents/wp-db-migration-agent/lib/sql-tool.cjs tables export.sql

# Sanitise for that site: rename to its prefix, keep its accounts, skip a log table
node agents/wp-db-migration-agent/lib/sql-tool.cjs sanitise export.sql --prefix wp_ \
  --keep-users --exclude bad_behavior --studio-site ~/Studio/my-site
```

Wordfence's tables are left out by default (`--keep-wordfence` keeps them).
With `--studio-site`, `site-urls` and `sanitise` also show the Studio site's
custom URL and a ready-to-run WP-CLI preview for replacing the export's URL
after import; the dump's own URLs are never edited.

Add `--json` for machine-readable output. Exit codes: `0` clean, `1` findings
to review, `2` error (no output written).

## What the sanitiser fixes

| Problem                                                          | Example Studio error                                                  | Fix                                         |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------- |
| GTID replication statement                                       | `Could not execute statement: SET @@GLOBAL.GTID_PURGED=...`           | Statement and its comment removed           |
| Binary-log statements                                            | `SET @@SESSION.SQL_LOG_BIN= 0`                                        | Three statements removed                    |
| Raw binary literals (for example WP All Import's `wp_pmxi_hash`) | `Could not execute statement: INSERT INTO ... VALUES (_binary '...')` | Rewritten as `X'<hex>'` with the same bytes |
| MariaDB 11+ binary defaults                                      | ``CREATE TABLE ... DEFAULT x AS `0000...` ``                          | Rewritten as `DEFAULT X'<hex>'`             |
| No `DROP TABLE` before `CREATE TABLE` (phpMyAdmin)               | `Could not execute statement: CREATE TABLE wp_commentmeta`            | `DROP TABLE IF EXISTS` added                |
| File already converted to SQLite syntax                          | `Could not execute statement: PRAGMA foreign_keys=OFF`                | Refused: sanitise the MySQL export instead  |

Anything else risky (triggers, `DEFINER=`, `CREATE DATABASE`, views and so on)
is reported, not changed.

## Safety

- The original export is never modified, and its checksum is verified.
- Staging and live databases are never touched; you get a checked file and a
  backup-first checklist.
- Reports never include data rows or personal data.

## Development

```bash
npx jest agents/wp-db-migration-agent
```

Design documents: [spec 024](../../.github/specs/024-wp-db-migration-agent/).

Made with ❤️ by the LightSpeed team.
