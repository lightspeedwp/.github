---
name: "Epic"
about: "Propose/manage a large, multi-part initiative or project grouping stories/features/tasks"
title: "[Epic] Portable AI plugin restructure: validation, docs, pilot, and release"
labels: [status:needs-planning, priority:important, area:core, area:ci, area:documentation]
github_issue: "https://github.com/lightspeedwp/.github/issues/285"
---

## Epic Summary

Restart the validation layer smaller, document the architecture, test local
tool compatibility, pilot the plugin in one LightSpeed repository, and prepare
release readiness notes.

## Linked Stories/Tasks

- Batch 05: validation reset.
- Batch 06: pilot and release.
- Child issue links:
  - [#311](https://github.com/lightspeedwp/.github/issues/311) [Maintenance] Fix invalid JSON schema syntax before validator reset
  - [#312](https://github.com/lightspeedwp/.github/issues/312) [Build/CI] Split validation commands from mutating format and fix commands
  - [#313](https://github.com/lightspeedwp/.github/issues/313) [Build/CI] Add read-only validate:structure command
  - [#314](https://github.com/lightspeedwp/.github/issues/314) [Build/CI] Add read-only plugin and skill validators
  - [#315](https://github.com/lightspeedwp/.github/issues/315) [Build/CI] Add read-only frontmatter and local link validators
  - [#316](https://github.com/lightspeedwp/.github/issues/316) [Test Coverage] Fix misleading coverage reporting and noisy import side effects
  - [#317](https://github.com/lightspeedwp/.github/issues/317) [Compatibility] Run local tool smoke tests for the pilot plugin
  - [#318](https://github.com/lightspeedwp/.github/issues/318) [Feature] Pilot lightspeed-github-ops in one LightSpeed repository
  - [#319](https://github.com/lightspeedwp/.github/issues/319) [Documentation] Document pilot findings and follow-up decisions
  - [#320](https://github.com/lightspeedwp/.github/issues/320) [Research] Create future plugin pack backlogs
  - [#321](https://github.com/lightspeedwp/.github/issues/321) [Release] Prepare pilot plugin restructure release readiness checklist

## Milestones & Timeline

- Milestone: Portable AI Plugin Restructure - Stabilisation.
- Sequence: runs after pilot plugin skeleton exists; some validation tasks can
  start earlier if they are read-only.

## Acceptance Criteria

- [ ] Validation commands are non-mutating.
- [ ] Plugin, skill, frontmatter, structure, and link checks exist.
- [ ] Invalid JSON schema syntax fixed.
- [ ] Tool compatibility smoke tests documented.
- [ ] One LightSpeed repo pilot completed.
- [ ] Future plugin pack backlog drafted.
- [ ] Release readiness checklist completed.
- [ ] Milestone closed.

## Dependencies / Blockers

- Needs a stable pilot plugin package.
- Needs local dependencies bootstrapped with `npm ci`.

## Additional Context

This epic owns the safety net. It should prevent the migration from becoming
another large, hard-to-validate JavaScript layer too early.

## Definition of Ready (DoR)

- [ ] Epic goal and scope defined.
- [ ] Linked stories/tasks listed.
- [ ] Milestones and timeline mapped.
- [ ] Dependencies/blockers identified.
- [ ] Estimate added.
- [ ] Stakeholders/approvers listed.

## Definition of Done (DoD)

- [ ] All linked stories/tasks completed and closed.
- [ ] Documentation/changelog updated.
- [ ] QA and testing complete.
- [ ] Milestone closed and release notes prepared.
