---
name: "Epic"
about: "Propose/manage a large, multi-part initiative or project grouping stories/features/tasks"
title: "[Epic] Portable AI plugin restructure: source asset migration"
labels: [status:needs-planning, priority:important, area:core, type:ai-ops]
github_issue: "https://github.com/lightspeedwp/.github/issues/283"
---

## Epic Summary

Move reusable AI operations assets out of `.github` into portable source
folders. This covers instructions, agent specs, active schemas, portable
workflow specs, prompt classification, first skills, and cookbook material.

## Linked Stories/Tasks

- Batch 02: portable migration.
- Batch 03: skills and cookbook.
- Child issue links:
  - [#293](https://github.com/lightspeedwp/.github/issues/293) [Audit] Classify GitHub-native files that must remain in .github
  - [#294](https://github.com/lightspeedwp/.github/issues/294) [Maintenance] Clean stale path references before migration
  - [#295](https://github.com/lightspeedwp/.github/issues/295) [Refactor] Migrate reusable instructions to /instructions
  - [#296](https://github.com/lightspeedwp/.github/issues/296) [Refactor] Migrate reusable agent specs to /agents
  - [#297](https://github.com/lightspeedwp/.github/issues/297) [Refactor] Move active portable schemas to /.schemas
  - [#298](https://github.com/lightspeedwp/.github/issues/298) [Feature] Define /workflows as portable agentic workflow source
  - [#299](https://github.com/lightspeedwp/.github/issues/299) [Audit] Classify legacy prompts as skill, cookbook, archive, or delete
  - [#300](https://github.com/lightspeedwp/.github/issues/300) [Feature] Create the portable /skills library index
  - [#301](https://github.com/lightspeedwp/.github/issues/301) [Feature] Create lightspeed-frontmatter-audit skill
  - [#302](https://github.com/lightspeedwp/.github/issues/302) [Feature] Create lightspeed-pr-review skill
  - [#303](https://github.com/lightspeedwp/.github/issues/303) [Feature] Create lightspeed-label-governance skill
  - [#304](https://github.com/lightspeedwp/.github/issues/304) [Documentation] Create cookbook and favourite skills backlog

## Milestones & Timeline

- Milestone: Portable AI Plugin Restructure - Source Migration.
- Sequence: starts after the target skeleton and migration map are approved.

## Acceptance Criteria

- [ ] Reusable instructions moved or copied to `/instructions`.
- [ ] Reusable agent specs moved or copied to `/agents`.
- [ ] Active portable schemas moved or copied to `/.schemas`.
- [ ] Durable prompt workflows classified as skill, cookbook, archive, or delete.
- [ ] First three pilot skills drafted.
- [ ] Documentation and changelog updated.
- [ ] Tests/QA complete.
- [ ] Milestone closed.

## Dependencies / Blockers

- Parent epic 01 must define folder ownership and migration-map policy.
- Link validation must be available before deleting old paths.

## Additional Context

This epic should avoid rewriting JavaScript runners. Existing `scripts/agents`
remain legacy runtime until each runner is intentionally rewritten.

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
