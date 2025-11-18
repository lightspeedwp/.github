---
"name": "Bugfix PR"
"about": "Fix a defect/regression with clear repro, fix, and verification"
"title": "fix: {short summary}"
"labels":
  - "type:bug"
  - "status:needs-review"
  - "priority:normal"
"file_type": "pr-template"
---

# Bugfix Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/main/AUTOMATION_GOVERNANCE.md) for required rules.

## Linked issues

<!--
List any related issues by number (e.g. fixes #123, closes #456, relates to #789).
-->

Fixes #

## Context

- Severity/Impact: (High/Medium/Low)
- Affected versions/environments: (list)

## Reproduction

- Steps: 1) … 2) … 3) …
- Expected vs Actual: (summary)

## Root Cause

- (brief analysis and evidence (logs/links))

## Fix Summary

- (what changed and why)

## Verification

- [ ] Tests added/updated to cover the bug
- [ ] Manual verification steps (browsers/devices)
- [ ] Negative/edge cases checked

## Risk & Rollback

- Risk level: Low / Medium / High
- Rollback plan: (revert / feature-flag / config)

## Changelog

<!--
Required for release automation.
Format: Keep a Changelog.
Categories: Added, Changed, Fixed, Removed.
User-facing notes only. Internal-only PRs (rare) may use the skip-changelog label.
Example:
### Changed
- Switched to action/cache@v3 for build speedup. (Relates to #789)
-->

### Added

<!--
- [placeholder]
-->

### Changed

<!--
- [placeholder]
-->

### Fixed

<!--
- [placeholder]
-->

### Removed

<!--
- [placeholder]
-->

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

---

## References

- [Contribution Guidelines](../CONTRIBUTING.md)
- [Branching Strategy](.github/BRANCHING_STRATEGY.md)
- [Automation Governance](.github/AUTOMATION_GOVERNANCE.md)
- [PR Labels](.github/PR_LABELS.md)
- [Saved Replies](.github/SAVED_REPLIES.md)
- [Project Meta](.github/PROJECT_META.md)
- [Labeler Config](.github/labeler.yml)
- [Labels](.github/labels.yml)
- [Issue Types](.github/issue-types.yml)

---
