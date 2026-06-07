---
file_type: documentation
title: Issue Template to Automation Trigger Mapping Audit
description: Mapping of issue templates to expected and actual automation triggers, with gap analysis and remediation steps.
created_date: "2026-06-03"
last_updated: "2026-06-07"
version: "1.0.1"
domain: governance
status: deprecated
tags: [audit, automation, issue-templates, labeling, workflows, wave-5]
---

# Issue Template to Automation Trigger Mapping Audit (#655)

## Historical Notice

This report is a historical snapshot from Wave 5 and is no longer the live governance source of truth.

Use these canonical live sources instead:

- `.github/labels.yml`
- `.github/labeler.yml`
- `.github/label-governance-policy.yml`
- `.github/issue-types.yml`
- `.github/issue-fields.yml`
- `scripts/validation/validate-labeling-configs.cjs`
- `scripts/validation/validate-issue-fields.cjs`

## Executive Summary

Issue templates are structurally standardised, but they do not currently provide deterministic label/type triggers in frontmatter. Automation is therefore primarily workflow-driven and heuristic-driven after issue creation.

Key result:

- Expected: template metadata should deterministically map to labels/type.
- Actual: template selection itself does not directly set labels; labeling is applied by workflow and agent heuristics.

## Mapping Model

### Inputs Reviewed

- `.github/ISSUE_TEMPLATE/*.md` (numbered templates)
- `.github/PULL_REQUEST_TEMPLATE/*.md`
- `.github/labeler.yml`
- `.github/workflows/labeling.yml`
- `scripts/agents/labeling.agent.js`

### Actual Trigger Path for Issues

1. User creates issue from template.
2. `labeling.yml` runs on `issues` events (`opened`, `edited`, `reopened`, `labeled`, `unlabeled`, `transferred`).
3. `scripts/agents/labeling.agent.js` executes.
4. Agent applies:
   - labeler rules from `.github/labeler.yml` (limited for issues)
   - defaults/one-hot normalization
   - content-based type detection from issue title/body

## Template Metadata Readiness

Across 26 numbered issue templates:

- `name`: 26/26
- `description`: 26/26
- `labels`: 0/26
- `title`: 0/26
- `assignees`: 0/26

Impact: template files provide guidance text, but do not deterministically encode expected labels/type at creation time.

## PR Template Comparison

PR automation is stronger because PR context carries branch and file-diff signals used by `.github/labeler.yml`:

- `head-branch` mappings drive many `type:*`, `status:*`, and `priority:*` outcomes.
- `changed-files` mappings drive `area:*` and `lang:*` labels.

Issue context has no branch or changed-files signals, so the current `.github/labeler.yml` rule design naturally favours PR events.

## Template-to-Automation Mapping Status

| Template Set | Expected Automation | Current Status | Missing Pieces |
|---|---|---|---|
| Numbered issue templates (`01`-`26`) | Deterministic `type:*` and baseline triage labels on create | Partial (agent infers from text) | No template `labels`, no deterministic per-template mapping in config |
| Issue templates for support/triage flows | Consistent intake labels (area/priority/type) | Partial | No explicit issue-template label maps in `.github/labeler.yml` |
| PR templates (`pr_*`) | Type/area/lang/status automation | Strong | N/A (already branch/file powered) |

## Gap Analysis

1. Determinism gap:
   Issue template selection does not directly map to canonical labels.

2. Signal gap:
   `.github/labeler.yml` depends heavily on branch/file signals unavailable for issues.

3. Consistency gap:
   Issue outcomes rely more on keyword heuristics than explicit template intent.

## Recommendations

1. Add `labels` keys to issue template frontmatter for canonical type labels where safe.
2. Add issue-focused rule blocks (title/body pattern maps) to complement current PR-centric rules.
3. Document a canonical mapping table in docs: `template file -> type label -> default area/priority`.
4. Keep heuristics as fallback, not primary path, for template-created issues.

## Validation Notes

- Workflow trigger coverage verified in `.github/workflows/labeling.yml`.
- Rule source verified in `.github/labeler.yml`.
- Heuristic source verified in `scripts/agents/labeling.agent.js`.

## Related Issue

- Closes #655
