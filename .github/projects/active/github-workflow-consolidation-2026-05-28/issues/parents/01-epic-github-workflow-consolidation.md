---
name: "Epic"
about: "Propose/manage a large, multi-part initiative or project grouping stories/features/tasks"
title: "[Epic] Consolidate GitHub workflow docs and active project pack"
labels: [status:needs-planning, priority:important, type:task, area:documentation]
github_issue: "https://github.com/lightspeedwp/.github/issues/503"
---

## Epic Objective

Deliver a lean, current, and automation-aligned GitHub workflow documentation baseline plus an active project issue pack that can be posted directly.

## Linked Stories/Tasks

- [x] [#504](https://github.com/lightspeedwp/.github/issues/504) 01 Docs unify project template and governance spec
- [x] [#505](https://github.com/lightspeedwp/.github/issues/505) 02 Branching strategy slimdown and alignment
- [x] [#506](https://github.com/lightspeedwp/.github/issues/506) 03 Project-meta-sync contract (current-state)
- [x] [#507](https://github.com/lightspeedwp/.github/issues/507) 04 Issue/PR metadata automation contract
- [x] [#508](https://github.com/lightspeedwp/.github/issues/508) 05 PR template changelog-label wording alignment
- [x] [#509](https://github.com/lightspeedwp/.github/issues/509) 06 Validation run and drift report

## Acceptance Criteria

- [x] Canonical operations spec exists and is the primary reference.
- [x] Existing docs are updated to reference the canonical spec.
- [x] Branching guidance clearly separates required core prefixes from optional profile prefixes.
- [x] PR templates consistently use canonical `meta:no-changelog` wording.
- [x] Active project issue pack exists under `.github/projects/active/`.
- [x] Validation commands pass and evidence is captured.

## Dependencies / Blockers

- Canonical labels and mappings remain sourced from `.github/labels.yml`, `.github/labeler.yml`, and `.github/issue-fields.yml`.
- No structural refactor of `labeling.yml` or `project-meta-sync.yml` in this epic.

## Definition of Ready (DoR)

- [x] Objective and boundaries documented.
- [x] Child task list complete.
- [x] Validation plan defined.
- [x] Canonical source files identified.

## Definition of Done (DoD)

- [x] All child tasks complete.
- [x] Docs and templates updated and validated.
- [x] Drift report added.
- [x] Workstream ready for issue posting and execution.
