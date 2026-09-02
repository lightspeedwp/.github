---
title: "Portable AI Plugin Restructure Validation Command Split Report"
description: "Issue #312 report for splitting read-only validation commands from write-capable formatting commands."
version: "v0.1.0"
last_updated: "2026-05-20"
file_type: "project-report"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["build", "ci", "validation", "formatting", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Active PRD requirement FR-301 for non-mutating validation commands."
  - path: "issues/children/batch-05-validation-reset/05-02-buildci-split-validation-from-formatting.md"
    description: "GitHub issue #312 local source draft."
---

# Portable AI Plugin Restructure Validation Command Split Report

Parent epic: #285. Child issue: #312.

## Summary

Validation commands are now configured to run read-only for JSON validation.
Write-capable JSON formatting remains available through explicit `format:*`
commands.

## Script Changes

| Script | Behaviour |
| --- | --- |
| `lint:json` | Runs strict JSON validation with `--validate-only --strict --read-only`. |
| `validate:json` | Runs strict JSON validation with `--validate-only --strict --read-only`. |
| `validate:json:schemas` | Runs strict schema JSON validation with `--validate-only --strict --read-only`. |
| `validate:json:all` | Runs strict all-JSON validation with `--validate-only --strict --read-only`. |
| `validate:all` | Continues to compose validation commands, now using the read-only JSON path. |
| `format:json` | Remains the explicit write-capable formatter for JSON files. |
| `format:json:schemas` | Adds an explicit write-capable formatter for active schema files. |
| `format` | Runs `format:js`, `format:json`, and `format:md` explicitly. |

## Documentation Updates

`scripts/validation/README.md` now distinguishes:

- read-only JSON validation;
- read-only formatting checks;
- write-capable JSON formatting commands.

## Acceptance Criteria Status

- [x] Existing validation commands audited for file writes.
- [x] Read-only validation scripts updated.
- [x] Explicit write-capable formatter scripts added or preserved.
- [x] Package scripts and validation documentation updated.
- [x] `validate:*` JSON commands do not modify files.
- [x] Write-capable JSON commands are named `format:*`.
- [x] Documentation explains the distinction.

## Follow-Up

- #313 adds the read-only `validate:structure` command.
- #314 and #315 should follow this pattern for plugins, skills, frontmatter, and
  link checks.
