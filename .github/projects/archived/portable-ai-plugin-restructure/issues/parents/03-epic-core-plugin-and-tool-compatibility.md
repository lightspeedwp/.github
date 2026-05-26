---
name: "Epic"
about: "Propose/manage a large, multi-part initiative or project grouping stories/features/tasks"
title: "[Epic] Portable AI plugin restructure: core plugin and compatibility"
labels: [status:needs-planning, priority:important, area:core, type:ai-ops, type:compatibility]
github_issue: "https://github.com/lightspeedwp/.github/issues/284"
---

## Epic Summary

Build the smallest useful installable LightSpeed plugin first:
`plugins/lightspeed-github-ops`. Add the plugin package, manifests, selected
agent and skill content, and local installation documentation for supported AI
tools.

## Linked Stories/Tasks

- Batch 04: pilot plugin.
- Batch 06 compatibility smoke tests also link back here.
- Child issue links:
  - [#305](https://github.com/lightspeedwp/.github/issues/305) [Feature] Create plugins/lightspeed-github-ops pilot plugin skeleton
  - [#306](https://github.com/lightspeedwp/.github/issues/306) [Compatibility] Add VS Code and GitHub Copilot plugin manifest metadata
  - [#307](https://github.com/lightspeedwp/.github/issues/307) [Compatibility] Add Codex/OpenAI plugin manifest for pilot package
  - [#308](https://github.com/lightspeedwp/.github/issues/308) [Compatibility] Add Claude Code plugin manifest for pilot package
  - [#309](https://github.com/lightspeedwp/.github/issues/309) [Feature] Package selected agent and pilot skills into lightspeed-github-ops
  - [#310](https://github.com/lightspeedwp/.github/issues/310) [Documentation] Write pilot plugin installation and update guide
  - [#317](https://github.com/lightspeedwp/.github/issues/317) [Compatibility] Run local tool smoke tests for the pilot plugin

## Milestones & Timeline

- Milestone: Portable AI Plugin Restructure - Pilot Plugin.
- Sequence: starts after pilot skills exist.

## Acceptance Criteria

- [ ] `plugins/lightspeed-github-ops` package exists.
- [ ] Plugin manifest references only existing package files.
- [ ] Codex/OpenAI, Claude Code, and VS Code/GitHub Copilot compatibility notes are drafted.
- [ ] Pilot plugin includes selected governance agent and skills.
- [ ] Local install guide is written.
- [ ] Documentation and changelog updated.
- [ ] Tests/QA complete.
- [ ] Milestone closed.

## Dependencies / Blockers

- Needs selected portable agents and skills from parent epic 02.
- Tool-specific manifest details should stay conservative until tested locally.

## Additional Context

Do not create block theme or block plugin packages in this epic beyond backlog
or placeholder planning files.

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
