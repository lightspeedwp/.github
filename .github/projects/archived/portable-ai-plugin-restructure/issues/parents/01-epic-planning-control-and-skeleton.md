---
name: "Epic"
about: "Propose/manage a large, multi-part initiative or project grouping stories/features/tasks"
title: "[Epic] Portable AI plugin restructure: planning control and target skeleton"
labels: [status:needs-planning, priority:important, area:core, type:ai-ops]
github_issue: "https://github.com/lightspeedwp/.github/issues/282"
---

## Epic Summary

Plan and prepare the portable AI plugin restructure before moving production
assets. This parent covers the freeze, current-state inventory, migration
decision map, target folder skeleton, and the new `.github` boundary.

## Linked Stories/Tasks

- Batch 00: planning control and baseline.
- Batch 01: target skeleton and `.github` boundary.
- Child issue links:
  - [#286](https://github.com/lightspeedwp/.github/issues/286) [Audit] Inventory AI assets and create the migration decision map
  - [#287](https://github.com/lightspeedwp/.github/issues/287) [Audit] Capture baseline validation, test, and dependency state
  - [#288](https://github.com/lightspeedwp/.github/issues/288) [Task] Create milestone, label, and parent-child issue linking plan
  - [#289](https://github.com/lightspeedwp/.github/issues/289) [Task] Create target top-level folder skeleton
  - [#290](https://github.com/lightspeedwp/.github/issues/290) [Documentation] Add ownership indexes for new top-level folders
  - [#291](https://github.com/lightspeedwp/.github/issues/291) [Refactor] Update file organisation rules for GitHub-native vs portable assets
  - [#292](https://github.com/lightspeedwp/.github/issues/292) [Refactor] Scope .github Copilot instructions to this repo only

## Milestones & Timeline

- Milestone: Portable AI Plugin Restructure - Foundation.
- Sequence: must complete before portable asset migration begins.

## Acceptance Criteria

- [ ] Current asset inventory and migration decision map completed.
- [ ] Baseline validation and dependency findings documented.
- [ ] Target top-level folders created with ownership indexes.
- [ ] `.github` boundary rules updated for repo-local governance vs portable AI assets.
- [ ] Documentation and changelog updated.
- [ ] Tests/QA complete.
- [ ] Milestone closed.

## Dependencies / Blockers

- Active PRD: `.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md`.
- Requires agreement that `.github` remains GitHub-native and repo-local.

## Additional Context

Use this epic to prevent big-bang moves. No file migration should happen until
the migration map defines the source, target, and decision for each asset.

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
