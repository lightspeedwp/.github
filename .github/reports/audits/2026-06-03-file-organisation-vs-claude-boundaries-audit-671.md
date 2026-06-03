---
file_type: documentation
title: "#671 Audit - Current File Organisation vs CLAUDE.md Boundaries"
description: "Phase 1 audit mapping root and .github directory structure to control-plane boundaries, identifying GitHub-native vs reusable asset placement issues."
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
  - issue-671
  - file-organisation
  - boundaries
status: active
stability: stable
domain: governance
---

# #671 Audit - Current File Organisation vs CLAUDE.md Boundaries

## Objective

Map current repository structure and classify placements as:

- GitHub-native control-plane assets
- reusable portable assets
- boundary exceptions or misplacements

## Directory Map (Current)

### Root-level directories observed

- `.github`
- `agents`
- `ai`
- `assets`
- `config`
- `cookbook`
- `docs`
- `hooks`
- `instructions`
- `plugins`
- `prompts`
- `scripts`
- `skills`
- `tests`
- `workflows`
- plus support directories (`logs`, `tmp`, `coverage`, etc.)

### `.github` subdirectories observed

- `DISCUSSION_TEMPLATE`
- `ISSUE_TEMPLATE`
- `PULL_REQUEST_TEMPLATE`
- `SAVED_REPLIES`
- `agents`
- `instructions`
- `metrics`
- `projects`
- `prompts`
- `reports`
- `schemas`
- `scripts`
- `tests`
- `workflows`

## Boundary Classification Matrix

| Path | Expected Class | Current Class | Assessment |
| --- | --- | --- | --- |
| `.github/workflows` | GitHub-native | GitHub-native | Aligned |
| `.github/ISSUE_TEMPLATE` | GitHub-native | GitHub-native | Aligned |
| `.github/PULL_REQUEST_TEMPLATE` | GitHub-native | GitHub-native | Aligned |
| `.github/reports` | GitHub-native | GitHub-native | Aligned |
| `.github/projects` | GitHub-native | GitHub-native | Aligned |
| `.github/instructions` | GitHub-local instructions | GitHub-local instructions | Aligned |
| `agents/` | portable reusable | portable reusable | Aligned |
| `instructions/` | portable reusable | portable reusable | Aligned |
| `skills/` | portable reusable | portable reusable | Aligned |
| `workflows/` | portable reusable | portable reusable | Aligned |
| `.github/agents` | ambiguous legacy | local index only (current) | Boundary drift risk |
| `.github/scripts` | ambiguous legacy | contains executable script | Boundary drift risk |

## Key Findings

### F1 - Core structure is largely compliant

The majority of root portable folders and `.github` control-plane folders follow CLAUDE.md boundaries.

### F2 - Legacy overlap remains for agents/scripts under `.github`

- `.github/agents/README.md` still exists despite root `agents/` canonical location.
- `.github/scripts/validate-footers.js` still exists despite root `scripts/` canonical location.

This indicates incomplete boundary normalisation and creates ambiguity for new contributors.

### F3 - Documentation references still point to deprecated docs

Reference drift to retired docs increases perceived boundary inconsistency even where file placement is correct.

## Impact Assessment

| Impact Area | Severity | Description |
| --- | --- | --- |
| Contributor onboarding | Medium | Duplicate path patterns (.github vs root) reduce discoverability. |
| Automation reliability | Low to Medium | Script location ambiguity may lead to duplicated tooling. |
| Governance clarity | Medium | Boundary rules appear inconsistently enforced due to retained legacy paths. |
| Runtime/service risk | Low | No production runtime impact detected; mostly control-plane governance risk. |

## Recommendations

1. Resolve `.github/agents` and `.github/scripts` as explicit exceptions or migrate to canonical root locations.
2. Add boundary compliance checks for duplicate functional locations under root and `.github`.
3. Complete documentation reference remediation to remove deprecated path references.

## Deliverables

- Audit report: complete.
- Mapping document: complete.
- Impact assessment: complete.
