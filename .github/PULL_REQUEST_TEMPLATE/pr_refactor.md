---

name: "Refactor PR"  
about: "Internal code improvement; no external behaviour change"  
title: "refactor: {scope}"  
labels: ["status:needs-review"]  

---

# Refactor Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/main/AUTOMATION_GOVERNANCE.md) for required rules.

## Linked issues

<!--
List any related issues by number (e.g. closes #123, relates to #456).
-->

Closes #

## Summary

## Safety Nets

- Existing tests covering behaviour:
- New/refined tests added:
- Static analysis/lint rules touched:

## Approach

- Structural changes (APIs, patterns):
- Dead code removed? <Yes/No>

## Metrics / Benchmarks (if applicable)

- Before: (numbers)
- After: (numbers)

## Verification

- [ ] Unit tests pass locally
- [ ] Key flows smoke-tested (list)
- [ ] No user-visible diffs observed

## Risk & Rollback

- Risk level: Low / Medium / High
- Rollback plan: <revert commit / guarded behind no-ops>

## Changelog

<!--
Required for release automation.
Format: Keep a Changelog.
Categories: Added, Changed, Fixed, Removed.
User-facing notes only. Internal-only PRs (rare) may use the skip-changelog label.
Example:
### Changed
- Refactored cart logic for maintainability. No user-facing change. (Relates to #789)
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
