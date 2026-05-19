---
name: "Feature"
about: "Propose a net-new capability, enhancement, or workflow improvement."
title: "[Feature] Create the portable `/skills` library index"
labels: [status:needs-triage, priority:important, type:ai-ops]
github_issue: "https://github.com/lightspeedwp/.github/issues/300"
github_parent: "https://github.com/lightspeedwp/.github/issues/283"
---

## Summary

Create the canonical `/skills` library entrypoint and rules for self-contained
LightSpeed skill folders.

Parent epic: #283 (<https://github.com/lightspeedwp/.github/issues/283>).

## Proposed Solution

Add `/skills/README.md` with naming, metadata, `SKILL.md`, assets, scripts,
templates, examples, and plugin-packaging guidance.

## Acceptance Criteria

- [ ] `/skills/README.md` defines skill folder shape.
- [ ] Each skill must use kebab-case and include `SKILL.md`.
- [ ] Guidance covers assets, scripts, templates, examples, and tests.
- [ ] Guidance explains how canonical skills are copied or referenced by plugin packages.
- [ ] Documentation/changelog updated.
- [ ] PR uses correct branch prefix `feat/`.

## Designs / References

Reference PRD section 15, Favourite Skills Backlog.

## Dependencies

Depends on target folder skeleton.

## Testing Approach

Run structure validation once available.

## Additional Context

Keep tool-specific adapter details out of the canonical skill source where
possible.

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
