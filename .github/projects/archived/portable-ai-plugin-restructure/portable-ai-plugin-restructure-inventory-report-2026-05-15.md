---
title: "Portable AI Plugin Restructure Inventory And Migration Map"
description: "Issue #286 audit output for current AI, automation, governance, schema, prompt, and validation assets before portable plugin restructuring."
version: "v0.1.0"
last_updated: "2026-05-15"
file_type: "project-audit"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["audit", "migration-map", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Active PRD defining the phased restructure."
  - path: "issues/children/batch-00-planning-control/00-01-audit-current-asset-inventory-and-migration-map.md"
    description: "GitHub issue #286 local source draft."
  - path: "portable-ai-plugin-restructure-migration-map-2026-05-15.csv"
    description: "Machine-readable migration decision map."
---

# Portable AI Plugin Restructure Inventory And Migration Map

Parent epic: #282. Child issue: #286.

## Scope

This audit inventories the current files under `.github/agents`, `.github/instructions`, `.github/prompts`, `.github/schemas`, `.github/workflows`, `scripts/agents`, `scripts/validation`, `.github/ISSUE_TEMPLATE`, and `.github/SAVED_REPLIES`, excluding vendored `node_modules` content.

## Summary

- Total inventoried files: **385**.
- Files with hard-coded `.github/*` references: **150**.
- Files without detected hard-coded `.github/*` references: **235**.

### Files By Asset Type

| Asset type | Count |
| --- | ---: |
| `agent-spec` | 21 |
| `github-action-workflow` | 14 |
| `github-issue-template` | 29 |
| `instruction` | 54 |
| `legacy-agent-runtime` | 82 |
| `legacy-validation-runtime` | 25 |
| `prompt` | 73 |
| `saved-reply` | 81 |
| `schema` | 6 |

### Files By Migration Decision

| Decision | Count | Meaning |
| --- | ---: | --- |
| `archive` | 21 | Keep archived unless later reviewed. |
| `convert` | 74 | Convert into a skill, cookbook entry, or split repo-local/portable asset. |
| `defer` | 107 | Keep in place until a later scoped rewrite or validation reset. |
| `delete` | 7 | Remove after confirmation. |
| `keep` | 117 | Remain in the current path. |
| `move` | 59 | Move to the new top-level source collection after references are updated. |

## Key Findings

- `.github` contains both GitHub-native governance content and portable AI operations content, so migration must be decision-led rather than a bulk move.
- Issue templates, saved replies, and GitHub Actions should remain under `.github` because they provide repository and organisation governance behaviour.
- Agent specs, instruction files, prompt workflows, and schemas are the strongest candidates for top-level portable source collections, but most require reference updates before moving.
- Legacy JavaScript runners and validators should be deferred and rewritten selectively; moving them as-is would preserve the current complexity that the PRD wants to reduce.
- Zero-byte macOS `Icon` metadata files are flagged for deletion after the link audit confirms no references.

## Remediation Links

- Use issue #287 to capture the command and dependency baseline before changing validation behaviour.
- Use issues #289 and #290 for the top-level skeleton and ownership indexes.
- Use issues #293-#298 for portable instruction, agent, schema, and workflow migration slices.
- Use issues #299-#304 for prompt-to-skill/cookbook conversion decisions.
- Use issues #311-#316 for the smaller non-mutating validation reset.

## Migration Map

The canonical row-level decision map is stored in [`portable-ai-plugin-restructure-migration-map-2026-05-15.csv`](portable-ai-plugin-restructure-migration-map-2026-05-15.csv).

## Acceptance Criteria Status

- [x] Inventory `.github/agents`, `.github/instructions`, `.github/prompts`, `.github/schemas`, `.github/workflows`, `scripts/agents`, and `scripts/validation`.
- [x] Record decision for each item: keep, move, convert, archive, delete, or defer.
- [x] Capture target path for every moved or converted asset.
- [x] Flag assets with hard-coded `.github/*` paths.
- [x] Store the table in the active project folder.
