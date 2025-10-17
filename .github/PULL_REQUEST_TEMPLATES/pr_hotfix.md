---

name: "Hotfix PR"  
about: "Critical fixes for production issues"  
title: "fix: {short summary}"  
labels: ["status:needs-review", "area:hotfix"]  

---

# Hotfix Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/main/AUTOMATION_GOVERNANCE.md) for contributor rules.

## Linked issues

<!--
List any related issues by number (e.g. fixes #456, incident ref #789).
-->

Fixes #

## Incident / Root Cause

<!--
Summarise the incident or bug and the root cause (add links if needed).
-->

## Changelog

<!--
Required for release automation.
Format: Keep a Changelog.
Categories: Added, Changed, Fixed, Removed.
User-facing notes only. Internal-only PRs (rare) may use the `skip-changelog` label.
Example:
### Fixed
- Checkout fails when shipping method changes on mobile. (Fixes #456)
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