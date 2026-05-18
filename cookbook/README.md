---
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
stability: "draft"
---

# Portable Cookbook

## Overview

`cookbook/` stores recipes, examples, playbooks, and implementation guides that
teach reusable LightSpeed AI operations patterns. It is for durable guidance
that is useful, but not structured enough to be an installable skill.

## Ownership

LightSpeed Team owns this folder. Keep active project notes in
`.github/projects/` and permanent governance documentation in `docs/`.

## Structure

| Path | Purpose |
| --- | --- |
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
npx markdownlint-cli2 "cookbook/README.md"
```

## Migration Rules

- Move example prompts from `.github/prompts/` only after reviewing whether they
  should become a skill, recipe, archive item, or deletion candidate.
- Preserve the original prompt path in the migration map.
- Remove stale `.github` path assumptions during conversion.

## Related Documentation

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Issue #290: Add ownership indexes for new top-level folders](https://github.com/lightspeedwp/.github/issues/290)
