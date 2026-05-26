---
name: "Feature"
about: "Propose a net-new capability, enhancement, or workflow improvement."
title: "[Feature] Create `plugins/lightspeed-github-ops` pilot plugin skeleton"
labels: [status:needs-triage, priority:important, type:ai-ops, area:core]
github_issue: "https://github.com/lightspeedwp/.github/issues/305"
github_parent: "https://github.com/lightspeedwp/.github/issues/284"
---

## Summary

Create the first installable pilot plugin package for LightSpeed GitHub
governance and AI operations.

Parent epic: #284 (<https://github.com/lightspeedwp/.github/issues/284>).

## Proposed Solution

Add `plugins/lightspeed-github-ops` with README, package folders, and
placeholder manifests. Keep content minimal until selected skills and agents
are ready.

## Acceptance Criteria

- [ ] `plugins/lightspeed-github-ops/README.md` exists.
- [ ] Plugin folders for `agents`, `skills`, and optional `hooks` exist.
- [ ] Placeholder manifest paths are documented.
- [ ] Package scope excludes block theme and block plugin guidance.
- [ ] Documentation/changelog updated.
- [ ] PR uses correct branch prefix `feat/`.

## Designs / References

Reference PRD section 9.2, First Plugin Scope.

## Dependencies

Depends on folder skeleton and selected pilot skills.

## Testing Approach

Run structure validation once available.

## Additional Context

This issue creates the package shell only. Tool-specific manifests are separate
child issues.

## Definition of Ready (DoR)

- [ ] Problem statement and outcome defined.
- [ ] Acceptance criteria written.
- [ ] Designs/specs/references attached if relevant.
- [ ] Dependencies mapped.
- [ ] Estimate added.
- [ ] Stakeholders/approvers listed.
- [ ] Milestone/iteration assigned if applicable.

## Definition of Done (DoD)

- [ ] All acceptance criteria met.
- [ ] Tests added/updated; CI green.
- [ ] Accessibility, performance, security checks where relevant.
- [ ] Docs/changelog updated.
- [ ] Feature toggles/rollout considered.
- [ ] QA verified/UAT approved if applicable.
- [ ] Release notes prepared; monitoring/alerts set.
