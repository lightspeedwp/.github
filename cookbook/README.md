---
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

## Structure

| Path | Purpose |
| --- | --- |
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
