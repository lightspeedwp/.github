---
name: "Build & CI"
about: "Propose changes, fixes, or improvements to build tools, CI/CD pipelines, or automation."
title: "[Build/CI] Add read-only `validate:structure` command"
labels: [status:needs-triage, priority:important, area:ci]
github_issue: "https://github.com/lightspeedwp/.github/issues/313"
github_parent: "https://github.com/lightspeedwp/.github/issues/285"
---

## Build/CI Summary

Add a small read-only structure validator for required top-level folders,
README/index files, and pilot plugin package basics.

Parent epic: #285 (<https://github.com/lightspeedwp/.github/issues/285>).

## Steps / Checklist

- [ ] Define required root folders from the PRD.
- [ ] Validate required folder README/index files.
- [ ] Validate `plugins/lightspeed-github-ops` required package folders once created.
- [ ] Add `npm run validate:structure`.
- [ ] Add tests or fixture checks if practical.
- [ ] PR uses correct branch prefix `ci/` or `build/`.

## Acceptance Criteria

- [ ] Command exits non-zero when required folders are missing.
- [ ] Command does not modify files.
- [ ] Documentation explains what is checked.
- [ ] CI can run the command safely.

## Additional Context

Keep dependency usage minimal.

## References

- Active PRD FR-302.

## Definition of Ready (DoR)

- [ ] Build/CI goal and scope defined.
- [ ] Checklist prepared.
- [ ] Estimate added.

## Definition of Done (DoD)

- [ ] All checklist and acceptance criteria completed.
- [ ] Documentation/changelog updated.
- [ ] Approved by maintainer.
