---
title: "Spec-only Agents Issue Conversion"
description: "Execution record for converting spec-only agents into tracked issues with template-aligned structure and project sync labels."
version: "v1.0.1"
last_updated: "2026-05-28"
file_type: "project"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["agents", "issues", "project-mapping", "automation"]
domain: "governance"
stability: "active"
---

## Scope

Implements issue `#61` by converting spec-only agents into tracked GitHub issues
using the active task template structure and project-sync labels.

## Canonical Created Issues

- `agents/adr.agent.md` -> #464
- `agents/issues.agent.md` -> #465
- `agents/labeling.agent.md` -> #466
- `agents/linting.agent.md` -> #467
- `agents/meta.agent.md` -> #468
- `agents/metrics.agent.md` -> #469
- `agents/mode-demonstrate-understanding.agent.md` -> #470
- `agents/mode-document-reviewer.agent.md` -> #471
- `agents/mode-prd.agent.md` -> #473
- `agents/mode-thinking.agent.md` -> #475
- `agents/project-meta-sync.agent.md` -> #476
- `agents/prompt-engineer.agent.md` -> #478
- `agents/release.agent.md` -> #480
- `agents/reporting.agent.md` -> #482
- `agents/reviewer.agent.md` -> #474
- `agents/task-planner.agent.md` -> #484
- `agents/task-researcher.agent.md` -> #486
- `agents/template.agent.md` -> #488
- `agents/testing.agent.md` -> #490

## Label and Field Mapping Strategy

All created issues were labelled with:

- `status:needs-triage`
- `priority:normal`
- `type:task`
- `area:automation`

These labels are used by existing repo automation to sync issues into the org
project and populate status and type fields.

## Duplicate Cleanup

During bulk creation, transient GitHub indexing lag created duplicate titles for
some agents. Duplicates were closed immediately and linked back to canonical
issues.

## Completion Notes

- Parent tracker: #61 (closed 2026-05-28)
- All 19 canonical issues created and labelled.
- Next step: triage and execution sequencing across #464–#490 in the project board.
- Confirm all canonical issues are assigned to the active milestone.
