# WordPress DB Migration Agent

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

# Show siteurl/home from an export
node agents/wp-db-migration-agent/lib/sql-tool.cjs site-urls export.sql
```

Add `--json` for machine-readable output. Exit codes: `0` clean, `1` findings
to review, `2` error (no output written).

## What the sanitiser fixes

| Problem                                                          | Example Studio error                                                  | Fix                                         |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------- |
| GTID replication statement                                       | `Could not execute statement: SET @@GLOBAL.GTID_PURGED=...`           | Statement and its comment removed           |
| Binary-log statements                                            | `SET @@SESSION.SQL_LOG_BIN= 0`                                        | Three statements removed                    |
| Raw binary literals (for example WP All Import's `wp_pmxi_hash`) | `Could not execute statement: INSERT INTO ... VALUES (_binary '...')` | Rewritten as `X'<hex>'` with the same bytes |

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

Design documents: [spec 020](../../.github/specs/020-wp-db-migration-agent/).

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
