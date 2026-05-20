---
<<<<<<< HEAD
file_type: "index"
title: "AI Cookbook"
description: "Ownership index for reusable recipes, examples, playbooks, and implementation guides."
version: "v0.1.0"
last_updated: "2026-05-16"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["cookbook", "recipes", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Portable AI plugin restructure PRD."
  - path: "../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md"
    description: "Issue #290 local source draft."
---

# AI Cookbook

This folder owns durable recipes, examples, playbooks, and implementation guides that are useful across projects but are not strict installable skills.

## Ownership

- Owns worked examples, recipe-style guidance, decision playbooks, and reusable implementation notes.
- Does not own prompt dumps, temporary project reports, or source files that should become skills.
- Keeps examples safe to redistribute by default, with no secrets, customer data, or production-only assumptions.
=======
file_type: "documentation"
title: "Portable Cookbook"
description: "Ownership and migration rules for portable LightSpeed recipes and examples."
version: "v0.1.0"
last_updated: "2026-05-18"
author: "Codex"
maintainer: "LightSpeed Team"
owners: ["LightSpeed Team"]
tags: ["cookbook", "recipes", "examples", "ai-ops"]
status: "active"
---

# Portable Cookbook

## Overview

`cookbook/` stores recipes, examples, playbooks, and implementation guides that
teach reusable LightSpeed AI operations patterns. It is for durable guidance
that is useful, but not structured enough to be an installable skill.

## Ownership

LightSpeed Team owns this folder. Keep active project notes in
`.github/projects/` and permanent governance documentation in `docs/`.
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b

## Structure

| Path | Purpose |
| --- | --- |
<<<<<<< HEAD
| `cookbook/<recipe-id>.md` | A single reusable recipe or playbook. |
| `cookbook/<topic>/README.md` | Topic index for a larger recipe group. |
| `cookbook/README.md` | This ownership index. |

## Migration rules

- Convert legacy prompts into cookbook recipes when they are explanatory examples rather than repeatable skills.
- Prefer `/skills/<skill-id>/SKILL.md` when the content gives an agent a repeatable capability.
- Keep active project reports in `.github/projects/active/` until they become permanent documentation.
- Link back to the migration decision map for converted legacy prompts.

## Usage

Use cookbook entries to show patterns, trade-offs, and examples. Keep each recipe focused enough to scan quickly, with clear prerequisites and expected outcomes.

## Validation

- Run Markdown linting for changed recipe files.
- Check internal links when moving examples from `.github/prompts/`.
- Confirm examples use UK English and do not expose sensitive data.

## Governance links

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Prompt instructions](../instructions/prompt.instructions.md)
- [README standards](../instructions/readme.instructions.md)

## References

- [Issue #290 draft](../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md)
- [Migration decision map](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-migration-map-2026-05-15.csv)
=======
| `cookbook/README.md` | Ownership and migration rules for this folder. |
| `cookbook/<recipe-id>.md` | A focused recipe, example, or playbook. |
| `cookbook/<topic>/README.md` | Optional topic index when several recipes share a domain. |

## Usage

- Convert legacy prompts into cookbook recipes when they teach a pattern but do
  not need a strict skill workflow.
- Keep each recipe practical, reproducible, and linked to source evidence.
- Prefer short examples over broad tutorials.
- Promote repeatable operational workflows to `skills/` instead.

## Validation

Validate changed Markdown files before a PR.

```bash
npx markdownlint-cli2 "cookbook/**/*.md"
```

## Migration Rules

- Move example prompts from `.github/prompts/` only after reviewing whether they
  should become a skill, recipe, archive item, or deletion candidate.
- Preserve the original prompt path in the migration map.
- Remove stale `.github` path assumptions during conversion.

## Related Documentation

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Issue #290: Add ownership indexes for new top-level folders](https://github.com/lightspeedwp/.github/issues/290)
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b
