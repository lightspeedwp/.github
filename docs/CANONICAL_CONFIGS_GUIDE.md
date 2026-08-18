---
file_type: documentation
title: Canonical Config File Interdependencies Guide
description: Canonical reference for how labels.yml, issue-types.yml, labeler.yml, and issue-fields.yml interact from issue creation through automation completion.
version: v1.0.4
created_date: "2026-06-03"
last_updated: "2026-06-19"
authors:
  - GitHub Copilot
owners:
  - LightSpeed Team
tags:
  - canonical-config
  - governance
  - automation
  - wave-5
  - issue-661
status: active
stability: stable
domain: governance
language: en
---

# Canonical Config File Interdependencies Guide

## Overview

This guide documents the canonical relationship between:

- `.github/labels.yml`
- `.github/issue-types.yml`
- `.github/labeler.yml`
- `.github/issue-fields.yml`

It also maps end-to-end data flow from issue/PR creation to automation completion.

Project metadata sync is label-driven, but it also treats issue type selection
and safe content/branch fallbacks as first-class signals so project fields can
catch up when labels are added after creation.

## Canonical Roles

| File | Canonical Role | Primary Consumers |
| --- | --- | --- |
| `.github/labels.yml` | Source of truth for label names, colours, descriptions, aliases | labeling agent, sync scripts, docs |
| `.github/issue-types.yml` | Source of truth for GitHub Issue Type display names and companion `type:*` label mapping | labeling agent, issue type docs |
| `.github/labeler.yml` | Rule map for branch/file-pattern-based auto-labelling | GitHub labeler workflow and agent helpers |
| `.github/issue-fields.yml` | Source of truth for project field mappings and field policy limits | project-meta sync, validation scripts, issue field docs |

## Interdependency Diagram

```mermaid
flowchart LR
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
    accTitle: Canonical config interdependency map
    accDescr: Flowchart showing the four canonical config files and how labeling workflows and project metadata sync consume them. labels.yml is shared vocabulary, issue-types.yml defines type mapping, labeler.yml applies rules, and issue-fields.yml maps labels to project fields.
    A[labels.yml\nCanonical label vocabulary] --> E[Labeling agent and workflows]
    B[issue-types.yml\nIssue Type to type label map] --> E
    C[labeler.yml\nBranch and file match rules] --> E
    A --> D[issue-fields.yml\nProject field mappings]
    D --> F[Project meta sync\nGitHub Project fields]
    E --> G[Issues and PRs labelled]
    G --> F
```

## Data Flow: Issue Creation to Automation Completion

```mermaid
sequenceDiagram
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
    accTitle: Issue and PR automation data flow
    accDescr: Sequence diagram showing how issue templates and pull request branches trigger labeling automation, which reads canonical config files and then updates labels and project fields.
    participant U as Contributor
    participant GH as GitHub Event
    participant LA as Labeling Agent and Workflow
    participant CF as Canonical Config Files
    participant PM as Project Meta Sync
    participant P as GitHub Project

    U->>GH: Create issue or open PR
    GH->>LA: Trigger labeling workflow
    LA->>CF: Read labels.yml
    LA->>CF: Read issue-types.yml
    LA->>CF: Read labeler.yml
    LA->>GH: Apply or normalise labels
    GH->>PM: Trigger project-meta sync
    PM->>CF: Read issue-fields.yml mappings
    PM->>P: Set Status, Priority, Type fields
    P-->>U: Board state updated
```

## Data Contract Rules

1. `type:*` labels used in `.github/issue-fields.yml` Type mappings must exist in both `.github/labels.yml` and `.github/issue-types.yml`.
2. `status:*` and `priority:*` mappings in `.github/issue-fields.yml` must resolve to labels defined in `.github/labels.yml`.
3. `.github/labeler.yml` may only emit canonical labels defined in `.github/labels.yml`.
4. `.github/issue-types.yml` display types should map to canonical `type:*` labels that can be projected into project field Type values.
5. `project-meta-sync.yml` should reprocess label changes so late `type:*` labels or corrected issue types update the project field projection.

## Current Risks Observed

- Cross-file Type parity is validator-enforced, but downstream documentation can still drift if canonical types are added without matching doc updates.
- Legacy references to deprecated files can still create operator confusion if docs are updated unevenly.

## Recommended Validation Hooks

- `scripts/validation/validate-issue-fields.cjs` enforces strict cross-file parity for `Status`, `Priority`, and `Type` mappings.
- `scripts/validation/validate-labeling-configs.cjs` fails when `.github/labeler.yml` emits labels not defined in `.github/labels.yml`.
- `scripts/validation/validate-branch-name.js` enforces branch naming discipline for pull requests targeting `develop`.
- Run parity checks in CI on every PR touching any canonical config file.

## Related Documentation

- [docs/ISSUE_FIELDS.md](./ISSUE_FIELDS.md)
- [docs/ISSUE_TYPES.md](./ISSUE_TYPES.md)
- [docs/LABEL_STRATEGY.md](./LABEL_STRATEGY.md)
- [docs/LABELING.md](./LABELING.md)
- [docs/BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)
- `.github/reports/audits/2026-06-03-issue-fields-config-vs-github-api-audit-660.md`

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
