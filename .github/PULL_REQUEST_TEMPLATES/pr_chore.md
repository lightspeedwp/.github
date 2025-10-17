---

name: "Chore PR"  
about: "Repo hygiene: configs, scripts, formatting — no behaviour change"  
title: "chore: {scope}"  
labels: ["status:needs-review"]  

---

# Chore Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/main/AUTOMATION_GOVERNANCE.md) for required rules.


## Linked issues

<!--
List any related issues by number (e.g. closes #123, relates to #789).
-->

Closes #

## Summary

## Changes

- (list)

## Impact / Compatibility

- Runtime/behaviour changes: (None expected)
- Build/dev-experience impact: (notes)

## Verification

- [ ] CI passes
- [ ] Local build and smoke tests
- [ ] Docs updated if developer-facing

## Risk & Rollback

- Risk level: Low / Medium / High
- Rollback plan: (revert commit)

## Changelog

<!--
Required for release automation.
Format: Keep a Changelog.
Categories: Added, Changed, Fixed, Removed.
User-facing notes only. Internal-only PRs (rare) may use the skip-changelog label.
Example:
### Changed
- Updated CI config for improved cache usage. (Relates to #789)
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
