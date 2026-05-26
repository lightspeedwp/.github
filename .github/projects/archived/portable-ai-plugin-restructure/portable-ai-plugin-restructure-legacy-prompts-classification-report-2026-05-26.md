---
file_type: "project-audit"
title: "Portable AI Plugin Restructure Legacy Prompts Classification Report"
description: "Issue #299 audit output classifying legacy prompts as skill or cookbook conversion targets, with frontmatter and P0 notes."
version: "v0.1.0"
last_updated: "2026-05-26"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["audit", "prompts", "skills", "cookbook", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "issues/children/batch-03-skills-cookbook/03-01-audit-classify-legacy-prompts.md"
    description: "GitHub issue #299 local source draft."
  - path: "portable-ai-plugin-restructure-migration-map-2026-05-15.csv"
    description: "Canonical migration decision map."
  - path: "complete-portable-ai-plugin-restructure.prompt.md"
    description: "Project orchestration prompt and dependency order."
---

# Portable AI Plugin Restructure Legacy Prompts Classification Report

Parent epic: #283. Child issue: #299.

## Summary

All legacy prompt rows in the migration map are now explicitly linked to `#299`
and classified for conversion. The audit confirms this programme does not need
a top-level `/prompts` folder.

## Inventory and Classification

| Measure | Result |
| --- | ---: |
| Prompt rows in migration map (`asset_type=prompt`) | 73 |
| Prompt rows linked to `#299` | 73 |
| `*.prompt.md` files in `.github/prompts/` | 71 |
| Skill conversion targets | 33 |
| Cookbook conversion targets | 40 |

The 73 prompt rows include two non-`*.prompt.md` prompt index assets:
`.github/prompts/README.md` and `.github/prompts/prompts.md`.

## Frontmatter Audit

The following 10 prompt files are missing frontmatter and should be handled in
later conversion issues rather than this classification audit:

- `.github/prompts/agents.prompt.md`
- `.github/prompts/changelog-lines.prompt.md`
- `.github/prompts/changelog.prompt.md`
- `.github/prompts/code-review.prompt.md`
- `.github/prompts/docs-from-comments.prompt.md`
- `.github/prompts/docs-writeup.prompt.md`
- `.github/prompts/generate-changelog.prompt.md`
- `.github/prompts/generate-pr-description.prompt.md`
- `.github/prompts/pr-description.prompt.md`
- `.github/prompts/pr-review.prompt.md`

## P0 Pilot Skill Candidates

The highest-priority conversion candidates align with already-scoped downstream
issues:

- `lightspeed-frontmatter-audit` candidate set for #301.
- `lightspeed-pr-review` candidate set for #302.
- `lightspeed-label-governance` candidate set for #303.

## Findings and Risks

- Bulk migration of every prompt as-is would recreate legacy prompt sprawl.
- Missing frontmatter on 10 prompt files increases conversion risk if moved
  without template normalisation.
- The classification matrix is complete, but implementation should remain in
  issue-scoped conversion slices (#300-#304).

## Remediation Actions

- Keep prompt conversion work staged through #300-#304.
- Handle frontmatter normalisation as part of each prompt-to-skill/cookbook
  conversion slice.
- Keep the migration map as the single source of truth for conversion targets.

## Acceptance Criteria Status

- [x] Inventory all current prompt files.
- [x] Identify files missing frontmatter.
- [x] Classify each prompt as skill, cookbook, archive, delete, or defer.
- [x] Identify P0 pilot skill candidates.
- [x] Add classification linkage to the migration decision map.
