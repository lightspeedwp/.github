---
file_type: "index"
title: "Portable Skills"
description: "Ownership index for self-contained LightSpeed AI skills."
version: "v0.2.0"
last_updated: "2026-05-26"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["skills", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
---

# Portable Skills

This folder owns self-contained skills that teach an AI agent a repeatable
LightSpeed capability.

## Structure

| Path | Purpose |
| --- | --- |
| `skills/<skill-id>/SKILL.md` | Required skill entry point. |
| `skills/<skill-id>/assets/` | Optional skill-owned images, fixtures, or support files. |
| `skills/<skill-id>/scripts/` | Optional skill-owned helper scripts. |
| `skills/<skill-id>/templates/` | Optional reusable output templates. |
| `skills/<skill-id>/examples/` | Optional examples and fixtures. |
| `skills/README.md` | This ownership index. |

## Favourite Skills Backlog

| Skill | Source | Licence | Trust notes | Priority | Target plugin |
| --- | --- | --- | --- | --- | --- |
| `lightspeed-frontmatter-audit` | Legacy prompt + validation scripts | GPL-3.0 | Internal standards aligned | P0 | `lightspeed-github-ops` |
| `lightspeed-pr-review` | PR review prompt + review instructions | GPL-3.0 | Internal standards aligned | P0 | `lightspeed-github-ops` |
| `lightspeed-label-governance` | Labeling docs and reports | GPL-3.0 | Internal standards aligned | P0 | `lightspeed-github-ops` |
| `lightspeed-block-theme-quality` | Block theme QA ideas | GPL-3.0 | Needs curation | P1 | `lightspeed-wordpress-block-theme` |
| `lightspeed-block-plugin-quality` | Block plugin QA ideas | GPL-3.0 | Needs curation | P1 | `lightspeed-wordpress-block-plugin` |
