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

- [ ] [#504](https://github.com/lightspeedwp/.github/issues/504) 01 Docs unify project template and governance spec
- [ ] [#505](https://github.com/lightspeedwp/.github/issues/505) 02 Branching strategy slimdown and alignment
- [ ] [#506](https://github.com/lightspeedwp/.github/issues/506) 03 Project-meta-sync contract (current-state)
- [ ] [#507](https://github.com/lightspeedwp/.github/issues/507) 04 Issue/PR metadata automation contract
- [ ] [#508](https://github.com/lightspeedwp/.github/issues/508) 05 PR template changelog-label wording alignment
- [ ] [#509](https://github.com/lightspeedwp/.github/issues/509) 06 Validation run and drift report

## Acceptance Criteria

- [ ] Canonical operations spec exists and is the primary reference.
- [ ] Existing docs are updated to reference the canonical spec.
- [ ] Branching guidance clearly separates required core prefixes from optional profile prefixes.
- [ ] PR templates consistently use canonical `meta:no-changelog` wording.
- [ ] Active project issue pack exists under `.github/projects/active/`.
- [ ] Validation commands pass and evidence is captured.

## Dependencies / Blockers

- Canonical labels and mappings remain sourced from `.github/labels.yml`, `.github/labeler.yml`, and `.github/issue-fields.yml`.
- No structural refactor of `labeling.yml` or `project-meta-sync.yml` in this epic.

## Definition of Ready (DoR)

- [ ] Objective and boundaries documented.
- [ ] Child task list complete.
- [ ] Validation plan defined.
- [ ] Canonical source files identified.

## Definition of Done (DoD)

- [ ] All child tasks complete.
- [ ] Docs and templates updated and validated.
- [ ] Drift report added.
- [ ] Workstream ready for issue posting and execution.
