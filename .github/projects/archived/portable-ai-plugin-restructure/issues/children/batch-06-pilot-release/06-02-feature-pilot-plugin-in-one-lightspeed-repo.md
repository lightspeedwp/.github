---
name: "Feature"
about: "Propose a net-new capability, enhancement, or workflow improvement."
title: "[Feature] Pilot `lightspeed-github-ops` in one LightSpeed repository"
labels: [status:needs-triage, priority:important, type:ai-ops, type:compatibility]
github_issue: "https://github.com/lightspeedwp/.github/issues/318"
github_parent: "https://github.com/lightspeedwp/.github/issues/285"
---

## Summary

Test the pilot plugin in one real LightSpeed repository before broader rollout.

Parent epic: #285 (<https://github.com/lightspeedwp/.github/issues/285>).

## Proposed Solution

Install the plugin locally in one chosen LightSpeed repo, run a small workflow
using the packaged skills, and record findings.

## Acceptance Criteria

- [ ] Pilot repository is selected.
- [ ] Plugin is installed or loaded using the documented flow.
- [ ] At least one packaged skill is used against the pilot repo.
- [ ] Gaps and improvements are recorded.
- [ ] Rollback or uninstall path is documented.
- [ ] Documentation/changelog updated.
- [ ] PR uses correct branch prefix `feat/`.

## Designs / References

Reference installation guide and compatibility smoke test results.

## Dependencies

Depends on the pilot plugin package and install docs.

## Testing Approach

Use real maintainer workflow notes rather than only synthetic validation.

## Additional Context

Keep the first pilot small. The goal is to prove the install model, not migrate
every repo.

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
