---
file_type: "issue-template"
name: "🚀 Release"
about: "Propose or track release management, versioning, or deployment tasks."
version: "1.1.0"
last_updated: "2026-06-19"
category: "github-templates"
---

## Release Summary

<!-- Briefly describe the release: version, scope (patch/minor/major), and key themes. -->

## Full Changelog Entry Summary

<!-- Summarise the [Unreleased] entries that will be promoted in this release. -->

## Milestones / Checklist

<!-- The release flow is: develop → release/vX.Y.Z → main
     All feature/fix/chore branches merge to develop.
     The release branch is created FROM develop and its PR targets main. -->

- [ ] All in-flight PRs confirmed merged to `develop`
- [ ] `CHANGELOG.md` unreleased entries reviewed and finalised
- [ ] `[X.Y.Z]` section cut in `CHANGELOG.md` with release date
- [ ] Release branch `release/vX.Y.Z` created **from** `develop`
- [ ] `release/vX.Y.Z` PR opened **against** `main` using `pr_release.md` template
- [ ] CI green on release PR
- [ ] Release PR reviewed and approved
- [ ] Release PR merged → `main`; tag `vX.Y.Z` created

## Acceptance Criteria

<!-- List requirements for completion. Use checkboxes. -->

- [ ] Release completed and verified
- [ ] `CHANGELOG.md` section published with full entry list
- [ ] Release tag `vX.Y.Z` exists on `main`
- [ ] GitHub Release published with compiled notes
- [ ] `develop` synced with `main` after merge (no drift)

## Additional Context

<!-- Add any extra info, links, screenshots, or references. -->

---

## Definition of Ready (DoR)

- [ ] Release goal and scope defined
- [ ] Milestones and checklist mapped
- [ ] All changelog entries catalogued
- [ ] Open PRs identified for pre-tag merge

## Definition of Done (DoD)

- [ ] All checklist and acceptance criteria completed
- [ ] CHANGELOG section published
- [ ] Release tag on `main`
- [ ] Approved by maintainer

---

---

Related issues: {related_issues}
