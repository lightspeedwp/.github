---
file_type: documentation
title: "#664 Audit - Labeling Documentation Consolidation"
description: "Phase 1 audit of overlapping labeling documentation and references, including deprecated and missing files, with consolidation matrix and unified structure proposal."
category: audits
created_date: "2026-06-03"
last_updated: "2026-06-03"
version: "v1.0.0"
owners:
  - LightSpeed Team
authors:
  - GitHub Copilot
tags:
  - wave-5
  - phase-1
  - issue-664
  - labeling
  - documentation
  - consolidation
status: active
stability: stable
domain: governance
---

# #664 Audit - Labeling Documentation Consolidation

## Scope

Requested overlap set:

- `docs/LABEL_STRATEGY.md`
- `docs/LABELING.md`
- `docs/ISSUE_LABELS.md` (expected in scope)
- `docs/PR_LABELS.md` (expected in scope)
- `docs/AUTOMATION_GOVERNANCE.md` (expected in scope)
- Agent specs and automation references related to labeling

## Executive Findings

1. `docs/LABEL_STRATEGY.md` and `docs/LABELING.md` overlap on taxonomy, lifecycle, and governance content.
2. `docs/ISSUE_LABELS.md`, `docs/PR_LABELS.md`, and `docs/AUTOMATION_GOVERNANCE.md` are not present, but many references still point to them.
3. Labeling policy now spans docs plus executable config (`.github/labels.yml`, `.github/labeler.yml`, `.github/issue-types.yml`) and agent spec references, but documentation links are not fully normalised.

## File Presence and Role Matrix

| File | Exists | Current Role | Risk |
| --- | --- | --- | --- |
| `docs/LABEL_STRATEGY.md` | Yes | Strategic taxonomy and governance rationale | Duplicates practical usage sections from LABELING.md |
| `docs/LABELING.md` | Yes | Operational how-to for issues/PRs/discussions | Contains legacy examples and stale terminology in places |
| `docs/ISSUE_LABELS.md` | No | Deprecated/merged into LABELING.md | Broken references remain across templates/docs |
| `docs/PR_LABELS.md` | No | Deprecated/merged into LABELING.md | Broken references remain across templates/docs |
| `docs/AUTOMATION_GOVERNANCE.md` | No | Deprecated/merged into docs/AUTOMATION.md | Broken references remain across templates/docs |

## Duplication Matrix (Topic-Level)

| Topic | LABEL_STRATEGY.md | LABELING.md | Recommended Source of Truth |
| --- | --- | --- | --- |
| Label families and taxonomy | Strong | Strong | `docs/LABEL_STRATEGY.md` |
| Day-to-day issue labelling | Moderate | Strong | `docs/LABELING.md` |
| PR branch-to-type mapping | Moderate | Strong | `docs/LABELING.md` + `.github/labeler.yml` |
| Automation/agent integration | Moderate | Strong | `docs/LABELING.md` with config links |
| Colour rationale and governance posture | Strong | Light | `docs/LABEL_STRATEGY.md` |
| Change process for adding/retiring labels | Strong | Moderate | `docs/LABEL_STRATEGY.md` |

## Broken/Legacy Reference Evidence

Observed references still targeting deprecated or missing files include:

- `docs/PR_LABELS.md`
- `docs/ISSUE_LABELS.md`
- `docs/AUTOMATION_GOVERNANCE.md`

Common locations include:

- `.github/pull_request_template.md`
- `.github/PULL_REQUEST_TEMPLATE/*.md`
- `.github/ISSUE_TEMPLATE/README.md`
- `.github/README.md`
- `instructions/pull-requests.instructions.md`
- `instructions/issues.instructions.md`
- `docs/README.md` (naming inconsistency on `ISSUE-FIELDS.md`)

## Unified Structure Proposal

### 1. Canonical documentation split

- `docs/LABEL_STRATEGY.md`: governance model, taxonomy, colour rationale, lifecycle policies.
- `docs/LABELING.md`: operational usage for issue/PR/discussion labelling and automation behaviour.
- `docs/AUTOMATION.md`: automation governance, workflows, and enforcement policy.
- `docs/ISSUE_TYPES.md`: type semantics and decision tree.

### 2. Canonical executable sources

- `.github/labels.yml`: label vocabulary.
- `.github/labeler.yml`: matching and auto-apply rules.
- `.github/issue-types.yml`: issue type display and label linkage.

### 3. Link normalisation policy

- Replace all references to `ISSUE_LABELS.md` and `PR_LABELS.md` with `docs/LABELING.md` anchors.
- Replace all references to `AUTOMATION_GOVERNANCE.md` with `docs/AUTOMATION.md`.
- Align issue fields naming to `docs/ISSUE_FIELDS.md` consistently.

## Recommended Follow-up Actions

1. Run a repository-wide reference remediation PR for all broken links above.
2. Add CI guardrails to fail on links to known retired docs.
3. Trim duplicated explanatory sections between `LABEL_STRATEGY.md` and `LABELING.md` so each file has one explicit audience.

## Deliverable Summary

- Audit report: complete.
- Consolidation matrix: complete (presence, duplication, source-of-truth mapping).
- Unified structure proposal: complete.
