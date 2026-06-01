---
name: "Feature"
about: "Propose a net-new capability, enhancement, or workflow improvement."
title: "[Feature] Package selected agent and pilot skills into `lightspeed-github-ops`"
labels: [status:needs-triage, priority:important, type:ai-ops]
github_issue: "https://github.com/lightspeedwp/.github/issues/309"
github_parent: "https://github.com/lightspeedwp/.github/issues/284"
---

## Summary

Package the selected governance agent and P0 pilot skills into
`plugins/lightspeed-github-ops` after their canonical source files are ready.

Parent epic: #284 (<https://github.com/lightspeedwp/.github/issues/284>).

## Proposed Solution

Copy or materialise only the approved pilot assets into the plugin package:
frontmatter audit, PR review, label governance, and one governance agent.

## Acceptance Criteria

- [ ] Pilot plugin includes selected governance agent.
- [ ] Pilot plugin includes `lightspeed-frontmatter-audit`.
- [ ] Pilot plugin includes `lightspeed-pr-review`.
- [ ] Pilot plugin includes `lightspeed-label-governance`.
- [ ] Plugin manifests reference packaged paths only.
- [ ] Documentation/changelog updated.
- [ ] Tests added/updated if validators cover packaged content.
- [ ] PR uses correct branch prefix `feat/`.

## Designs / References

Reference PRD section 9.2 and section 15.

## Dependencies

Depends on the three pilot skill issues and plugin skeleton.

## Testing Approach

Run `validate:plugins` and `validate:skills` once available.

## Additional Context

Manual packaging is acceptable for the pilot. Do not build a materialisation
pipeline yet.

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
