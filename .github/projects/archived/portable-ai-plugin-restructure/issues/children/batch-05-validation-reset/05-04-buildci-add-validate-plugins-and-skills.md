---
name: "Build & CI"
about: "Propose changes, fixes, or improvements to build tools, CI/CD pipelines, or automation."
title: "[Build/CI] Add read-only plugin and skill validators"
labels: [status:needs-triage, priority:important, area:ci, type:ai-ops]
github_issue: "https://github.com/lightspeedwp/.github/issues/314"
github_parent: "https://github.com/lightspeedwp/.github/issues/285"
---

## Build/CI Summary

Add read-only validators for plugin manifests and skill folder shape.

Parent epic: #285 (<https://github.com/lightspeedwp/.github/issues/285>).

## Steps / Checklist

- [ ] Define manifest validation rules.
- [ ] Define skill folder validation rules.
- [ ] Validate `SKILL.md` presence and naming.
- [ ] Validate manifest references resolve to files inside the plugin package.
- [ ] Add `npm run validate:plugins`.
- [ ] Add `npm run validate:skills`.
- [ ] PR uses correct branch prefix `ci/` or `build/`.

## Acceptance Criteria

- [ ] Invalid plugin manifest fails validation.
- [ ] Missing skill `SKILL.md` fails validation.
- [ ] Missing referenced plugin file fails validation.
- [ ] Commands do not modify files.
- [ ] Documentation/changelog updated.

## Additional Context

This is the safety net for the pilot plugin.

## References

- Active PRD FR-303 and FR-304.

## Definition of Ready (DoR)

- [ ] Build/CI goal and scope defined.
- [ ] Checklist prepared.
- [ ] Estimate added.

## Definition of Done (DoD)

- [ ] All checklist and acceptance criteria completed.
- [ ] Documentation/changelog updated.
- [ ] Approved by maintainer.
