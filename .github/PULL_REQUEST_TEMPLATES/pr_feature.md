---

name: "Feature PR"  
about: "New features or enhancements"  
title: "feat: {short summary}"  
labels: ["status:needs-review", "area:feature"]  

---

# Feature Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/main/AUTOMATION_GOVERNANCE.md) for contributor rules.

## Linked issues

<!--
List any related issues by number (e.g. closes #123, fixes #456, relates to #789).
-->

Closes #

## Changelog

<!--
Required for release automation.
Format: Keep a Changelog.
Categories: Added, Changed, Fixed, Removed.
User-facing notes only. Internal-only PRs (rare) may use the `skip-changelog` label.
Example:
### Added
- Express PayPal checkout for cart and order. (Closes #123, @author)
### Fixed
- Resolved checkout validation for NL postcodes. (Fixes #456)
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