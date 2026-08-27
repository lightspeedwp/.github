---
name: "Feature"
about: "Propose a net-new capability, enhancement, or workflow improvement."
title: "[Feature] Define `/workflows` as portable agentic workflow source"
labels: [status:needs-triage, priority:normal, type:ai-ops, area:core]
github_issue: "https://github.com/lightspeedwp/.github/issues/298"
github_parent: "https://github.com/lightspeedwp/.github/issues/283"
---

## Summary

Create the first portable workflow source model under `/workflows`, distinct
from executable GitHub Actions in `.github/workflows`.

Parent epic: #283 (<https://github.com/lightspeedwp/.github/issues/283>).

## Proposed Solution

Add `/workflows/README.md` plus one or two placeholder workflow specs showing
how portable AI workflows should be documented and later packaged into plugins
or skills.

## Acceptance Criteria

- [ ] `/workflows` is documented as agentic workflow source, not GitHub Actions.
- [ ] `.github/workflows` remains the executable GitHub Actions folder.
- [ ] At least one example portable workflow spec exists.
- [ ] Links to related skills or agents are included.
- [ ] Documentation/changelog updated.
- [ ] Tests added/updated if validation covers workflow specs.
- [ ] PR uses correct branch prefix `feat/`.

## Designs / References

Reference PRD decision AD-006.

## Dependencies

Depends on folder skeleton and ownership indexes.

## Testing Approach

Run link and structure validation once available.

## Additional Context

Keep this small. Do not migrate every GitHub Action workflow here.

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
