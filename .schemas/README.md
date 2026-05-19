---
file_type: "documentation"
title: "Portable Schemas"
description: "Ownership and migration rules for portable LightSpeed AI asset schemas."
version: "v0.1.0"
last_updated: "2026-05-18"
author: "Codex"
maintainer: "LightSpeed Team"
owners: ["LightSpeed Team"]
tags: ["schemas", "validation", "ai-ops", "governance"]
status: "active"
---

# Portable Schemas

## Overview

`.schemas/` stores portable JSON, YAML, and frontmatter schemas for reusable
LightSpeed AI assets and plugin metadata. It is for schemas that can travel
outside this repository's GitHub-native `.github` folder.

## Ownership

LightSpeed Team owns this folder. Keep repo-governance schemas in
`.github/schemas/` until a migration issue records the source path, target path,
validation command, and consumer.

## Structure

| Path | Purpose |
| --- | --- |
| `.schemas/README.md` | Ownership and migration rules for this folder. |
| `.schemas/<schema-name>.schema.json` | Portable JSON schemas used by active validators or plugin manifests. |
| `.schemas/<schema-name>.schema.yaml` | Portable YAML schemas where YAML is the source contract. |

## Usage

- Add a schema here only when a portable asset or validator consumes it.
- Keep schemas small and focused on active contracts.
- Document the consuming skill, plugin, hook, workflow, or validation command.
- Avoid carrying legacy schema complexity forward without a current use case.

## Validation

Run targeted syntax checks before opening a PR. Do not treat mutating format
commands as validation evidence.

```bash
npx markdownlint-cli2 ".schemas/README.md"
```

## Migration Rules

- Move schemas from `.github/schemas/` only through a tracked migration issue.
- Preserve the source path in the migration map.
- Update links and validation commands in the same slice.
- Leave obsolete schemas behind for archive or deletion review rather than
  copying them here by default.

## Related Documentation

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Issue #290: Add ownership indexes for new top-level folders](https://github.com/lightspeedwp/.github/issues/290)
