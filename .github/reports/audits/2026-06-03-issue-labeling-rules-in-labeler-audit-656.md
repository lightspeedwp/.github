---
file_type: documentation
title: Issue Labeling Rules Audit in labeler.yml
description: Audit of issue-specific vs PR-specific labeling coverage in labeler.yml, including gaps and recommendations.
created_date: "2026-06-03"
last_updated: "2026-06-03"
version: "1.0.0"
domain: governance
status: active
tags: [audit, labeler, issues, pull-requests, automation, wave-5]
---

# Issue Labeling Rules Audit in labeler.yml (#656)

## Executive Summary

`.github/labeler.yml` is currently structured around PR-friendly signals (`head-branch`, `changed-files`) and has limited native issue-specific rule expression. Issue labelling exists in practice through the unified labeling workflow and agent heuristics rather than through rich issue-specific config rules.

## Scope and Inputs

- `.github/labeler.yml`
- `.github/workflows/labeling.yml`
- `scripts/agents/labeling.agent.js`
- `scripts/agents/includes/check-template-labels.js`

## Current Rule Inventory

### PR-Centric Rule Families in `.github/labeler.yml`

- `head-branch` mappings:
  - status mapping (`status:needs-review`)
  - type mappings (`type:feature`, `type:bug`, etc.)
  - priority mappings (`priority:critical`, `priority:normal`)
- `changed-files` mappings:
  - area labels (`area:ci`, `area:labels`, `area:documentation`, etc.)
  - language labels (`lang:js`, `lang:md`, `lang:yaml`, etc.)

### Issue-Specific Presence

- No explicit issue-template keyed rule groups in `.github/labeler.yml`.
- No first-class per-template deterministic mapping in this config.
- File contains an explicit note that issue-template-driven automation is planned, not active.

## Heuristics Used for Issues Today

Although `labeler.yml` is PR-oriented, issues are still processed because `labeling.yml` runs on issue events and `labeling.agent.js` applies:

- content-based type detection from title/body keyword maps
- canonicalization and one-hot enforcement
- default-label application logic

This means issue automation currently depends more on code heuristics than on declarative `labeler.yml` issue rules.

## PR vs Issue Comparison Matrix

| Rule Capability | PR Coverage | Issue Coverage |
|---|---|---|
| Branch-prefix type mapping | Strong (`head-branch`) | None (no branch context) |
| Changed-files area/lang mapping | Strong (`changed-files`) | None (no changed files) |
| Declarative deterministic mapping in `labeler.yml` | Strong | Weak |
| Content/title/body heuristic mapping | Moderate (agent fallback) | Strong (primary path) |
| Canonical label normalization | Strong | Strong |

## Findings

1. `labeler.yml` has broad PR coverage and narrow issue-native coverage.
2. Issue labelling works, but largely through procedural logic in `labeling.agent.js`.
3. The current setup is functional but less deterministic for issue templates than for PR workflows.

## Recommendations

1. Introduce declarative issue mapping support in `labeler.yml` (title/body/template pattern blocks).
2. Align issue templates with deterministic labels to reduce heuristic dependency.
3. Keep `labeling.agent.js` keyword detection as fallback for non-template or freeform issues.
4. Add a CI assertion that each numbered issue template maps to at least one canonical `type:*` outcome path.

## Validation Notes

- Issue workflow triggers verified via `.github/workflows/labeling.yml` (`issues` events enabled).
- PR-centric rule bias verified in `.github/labeler.yml`.
- Heuristic enforcement confirmed in `scripts/agents/labeling.agent.js`.

## Related Issue

- Closes #656
