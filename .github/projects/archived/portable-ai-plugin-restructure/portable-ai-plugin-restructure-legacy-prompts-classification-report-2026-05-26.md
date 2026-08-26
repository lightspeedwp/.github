---
title: "Portable AI Plugin Restructure Legacy Prompt Classification Report"
description: "Classification of legacy prompts as skill, cookbook, archive, delete, or defer."
version: "v0.1.0"
last_updated: "2026-05-26"
file_type: "project"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["prompts", "skills", "cookbook", "migration", "governance"]
domain: "governance"
stability: "active"
---

# Legacy Prompt Classification (2026-05-26)

## Summary

- Prompt files reviewed: 70
- P0 skill candidates: `pr-review`, `labeling`, `add-frontmatter`
- Cookbook candidates: 19
- Archive/defer candidates: 48
- Delete candidates: 0

## Decisions

| Pattern | Classification | Notes |
| --- | --- | --- |
| `*review*`, `*label*`, `*frontmatter*` | skill | Directly actionable and repeatable. |
| `*blueprint*`, `*breakdown*`, `*story-time*` | cookbook | Better as examples and playbooks. |
| `my-*`, `remember*`, narrow one-off prompts | defer | Keep until replacement workflows are stable. |

## Risks

- Moving all prompts to skills would recreate prompt sprawl.
- Several legacy prompts still assume `.github`-relative context.

## Remediation

1. Keep durable operational behaviour in `skills/`.
2. Move teaching content to `cookbook/`.
3. Defer low-value one-offs until pilot plugin feedback is complete.
