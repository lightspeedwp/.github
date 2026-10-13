---
name: 'WP DB Migration Agent'
description: 'Moves WordPress databases between MySQL live or staging sites and WordPress Studio local sites: cleans MySQL exports for Studio, checks Studio exports before staging or live, and replaces site URLs safely.'
file_type: 'agent'
category: 'wordpress-operations'
status: 'draft'
visibility: 'public'
tags:
  - wordpress
  - wordpress-studio
  - database
  - migration
version: 'v1.0.0'
created_date: '2026-10-13'
last_updated: '2026-10-13'
author: 'LightSpeedWP'
maintainer: 'LightSpeedWP'
owners: ['lightspeedwp/maintainers']
language: 'en'
implementation: 'agents/wp-db-migration-agent/'
permissions:
  - read
  - write
  - filesystem
  - shell
---

# WordPress DB Migration Agent

## Purpose

Move a WordPress database between a MySQL live or staging site and a
WordPress Studio local site (SQLite) without failed imports, broken
serialised data or leftover URLs.

## Core responsibilities

1. **MySQL → Studio**: make a MySQL export importable into Studio
   ([`mysql-to-studio-sanitiser`](./skills/mysql-to-studio-sanitiser/SKILL.md)).
2. **Studio → staging/live**: check a Studio export before it is imported
   into MySQL ([`studio-export-preflight`](./skills/studio-export-preflight/SKILL.md)).
3. **Site URL**: find the current `siteurl`, ask for the destination, and
   replace it serialisation-safely
   ([`wp-url-replacement`](./skills/wp-url-replacement/SKILL.md)).

## Operating rules

- Read-only by default; outputs are new files beside the input.
- Changes to the local Studio site only after the user confirms.
- Never touches a staging or live database.
- Never prints personal data or credentials from a dump.

## Implementation reference

- **Canonical specification**: [wp-db-migration.agent.md](./wp-db-migration.agent.md)
- **Usage guide**: [README.md](./README.md)
- **Tool**: [lib/sql-tool.cjs](./lib/sql-tool.cjs)
- **Feature specification**: [spec 020](../../.github/specs/020-wp-db-migration-agent/spec.md)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
