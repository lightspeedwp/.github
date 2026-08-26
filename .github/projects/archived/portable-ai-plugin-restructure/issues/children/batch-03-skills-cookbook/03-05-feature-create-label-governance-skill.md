---
name: "Feature"
about: "Propose a net-new capability, enhancement, or workflow improvement."
title: "[Feature] Create `lightspeed-label-governance` skill"
labels: [status:needs-triage, priority:important, type:ai-ops]
github_issue: "https://github.com/lightspeedwp/.github/issues/303"
github_parent: "https://github.com/lightspeedwp/.github/issues/283"
---

## Summary

Create a P0 skill for reviewing labels, issue templates, saved replies, and
triage conventions across LightSpeed repositories.

Parent epic: #283 (<https://github.com/lightspeedwp/.github/issues/283>).

## Proposed Solution

Add `/skills/lightspeed-label-governance/SKILL.md` with governance checks,
expected inputs, findings format, and remediation guidance.

## Acceptance Criteria

- [ ] Skill folder exists with `SKILL.md`.
- [ ] Skill name matches folder name.
- [ ] Skill covers labels, issue types, templates, saved replies, and triage conventions.
- [ ] Skill references canonical `.github` files without moving them.
- [ ] Skill is eligible for inclusion in `plugins/lightspeed-github-ops`.
- [ ] Documentation/changelog updated.
- [ ] PR uses correct branch prefix `feat/`.

## Designs / References

May draw from existing labeling agent docs and label governance reports.

## Dependencies

Depends on prompt classification and `/skills` library index.

## Testing Approach

Run `validate:skills` once available; manually verify folder shape first.

## Additional Context

The skill should be safe by default and should not mutate labels unless a
future automation explicitly adds that mode.

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
