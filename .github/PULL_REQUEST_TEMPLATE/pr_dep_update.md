---

name: "Dependencies/Maintenance PR"  
about: "Routine upkeep: dependency bumps, lint/format, low-risk hygiene"  
title: "chore(deps): {packages}"  
labels: ["status:needs-review", "area:dependencies"]  

---

# Dependencies/Maintenance Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/main/AUTOMATION_GOVERNANCE.md) for required rules.

## Linked issues

<!--
List any related issues by number (e.g. closes #123, relates to #789).
-->

Relates to #

## Maintenance summary

- Packages bumped: (list)
- Rationale: (security / compatibility / hygiene)

## Impact assessment

- Build/bundle deltas: <sizes/time>
- Risk notes: <breaking changes / peer deps>

## Test scope

- [ ] Install & build
- [ ] Smoke tests
- [ ] Key pages/components checked

## Changelog

<!--
Required for release automation.
Format: Keep a Changelog.
Categories: Added, Changed, Fixed, Removed.
User-facing notes only. Internal-only PRs (rare) may use the skip-changelog label.
Example:
### Changed
- Updated WooCommerce dependency to v8.1 for compatibility. (Relates to #123)
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
