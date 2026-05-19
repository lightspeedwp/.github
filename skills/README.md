---
file_type: "documentation"
title: "Portable Skills"
description: "Ownership and migration rules for self-contained LightSpeed skills."
version: "v0.1.0"
last_updated: "2026-05-18"
author: "Codex"
maintainer: "LightSpeed Team"
owners: ["LightSpeed Team"]
tags: ["skills", "ai-ops", "portable-assets", "governance"]
status: "draft"
---

# Portable Skills

## Overview

`skills/` stores self-contained LightSpeed skills. A skill should describe a
repeatable workflow clearly enough that an agent can load `SKILL.md`, follow the
steps, and use any local assets, scripts, templates, or examples safely.

## Ownership

LightSpeed Team owns this folder. Skills should be portable by default and
bundled into plugins only when a plugin needs them.

## Structure

| Path | Purpose |
| --- | --- |
| `skills/README.md` | Ownership, backlog, and migration rules for this folder. |
| `skills/<skill-id>/SKILL.md` | Required entrypoint for a skill. |
| `skills/<skill-id>/assets/` | Optional static assets used by the skill. |
| `skills/<skill-id>/scripts/` | Optional helper scripts owned by the skill. |
| `skills/<skill-id>/templates/` | Optional reusable output templates. |
| `skills/<skill-id>/examples/` | Optional examples and fixtures. |

## Initial Skills Backlog

| Skill | Plugin fit | Priority | Status |
| --- | --- | --- | --- |
| `lightspeed-frontmatter-audit` | `lightspeed-github-ops` | P0 | Planned |
| `lightspeed-pr-review` | `lightspeed-github-ops` | P0 | Planned |
| `lightspeed-label-governance` | `lightspeed-github-ops` | P0 | Planned |
| `lightspeed-release-prep` | `lightspeed-github-ops` | P1 | Backlog |

## Usage

- Convert repeatable prompt workflows into skills when they have clear steps,
  inputs, outputs, and validation.
- Keep examples and teaching material in `cookbook/` unless the skill needs
  them as fixtures.
- Keep scripts small, local to the skill, and documented.
- Do not include secrets, production data, or customer data in examples.

## Validation

Validate changed Markdown files now. Add skill structure checks once the
validation reset introduces skill validation.

```bash
npx markdownlint-cli2 "skills/README.md"
```

## Migration Rules

- Review each legacy prompt before deciding whether it becomes a skill,
  cookbook recipe, archive item, or deletion candidate.
- Record source and target paths in the migration map.
- Keep a skill self-contained once migrated.

## Related Documentation

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Issue #290: Add ownership indexes for new top-level folders](https://github.com/lightspeedwp/.github/issues/290)
