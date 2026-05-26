---
name: "Feature"
about: "Propose a net-new capability, enhancement, or workflow improvement."
title: "[Feature] Create `lightspeed-pr-review` skill"
labels: [status:needs-triage, priority:important, type:ai-ops]
github_issue: "https://github.com/lightspeedwp/.github/issues/302"
github_parent: "https://github.com/lightspeedwp/.github/issues/283"
---

## Summary

Create a P0 skill for preparing or reviewing pull requests against LightSpeed
standards, including security, accessibility, performance, tests, and
documentation.

Parent epic: #283 (<https://github.com/lightspeedwp/.github/issues/283>).

## Proposed Solution

Add `/skills/lightspeed-pr-review/SKILL.md` with review workflow, evidence
requirements, output format, and links to standards.

## Acceptance Criteria

- [ ] Skill folder exists with `SKILL.md`.
- [ ] Skill name matches folder name.
- [ ] Skill includes review priorities and evidence requirements.
- [ ] Skill covers security, accessibility, performance, tests, and docs.
- [ ] Skill is eligible for inclusion in `plugins/lightspeed-github-ops`.
- [ ] Documentation/changelog updated.
- [ ] PR uses correct branch prefix `feat/`.

## Designs / References

May draw from existing PR review prompts and reviewer agent specs.

## Dependencies

Depends on prompt classification and `/skills` library index.

## Testing Approach

Run `validate:skills` once available; manually verify folder shape first.

## Additional Context

Keep automated write actions out of the skill. This is a review/prep workflow.

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
