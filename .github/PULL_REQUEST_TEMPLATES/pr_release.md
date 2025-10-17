---

name: "Release PR"  
about: "Release new features or enhancements"  
title: "release: {short summary}"  
labels: ["status:needs-review", "area:release"]  

---

# Release Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/main/AUTOMATION_GOVERNANCE.md) for contributor rules.

## Linked issues & merged PRs

<!--
List all issues and PRs included in this release (e.g. closes #123, includes #456).
-->

Includes:

- (PRs/Issues)

## Changelog

<!--
Required for release automation.
Format: Keep a Changelog.
Categories: Added, Changed, Fixed, Removed.
User-facing notes only. Internal-only PRs (rare) may use the `skip-changelog` label.
Example:
### Added
- New VAT support for EU regions.
### Fixed
- Corrected shipping fee rounding. (Fixes #789)
-->

### Added

- [placeholder]

### Changed

- [placeholder]

### Fixed

- [placeholder]

### Removed

- [placeholder]

<!--
If no user-facing changelog entry is needed, apply the skip-changelog label to this PR.
-->

---


### Checklist (Global DoD / PR)

- [ ] All AC met and demonstrated
- [ ] Tests added/updated (unit/E2E as appropriate)
- [ ] A11y considerations addressed where relevant
- [ ] Docs/readme/changelog updated (if user-facing)
- [ ] Security/perf impact reviewed where relevant
- [ ] Code/design reviews approved
- [ ] CI green; linked issues closed; release notes prepared (if shipping)