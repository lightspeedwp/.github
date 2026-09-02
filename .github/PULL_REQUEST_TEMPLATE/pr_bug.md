---
file_type: "pr-template"
title: "Bugfix PR"
description: "Fix a defect/regression with clear repro, fix, and verification"
labels: ["status:needs-review", "priority:normal"]
---

# Bugfix Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/main/docs/AUTOMATION_GOVERNANCE.md) for required rules.

## Linked issues

Link this PR to the issue(s) it addresses. Use keywords to auto-close issues when merged:

- `Closes #123` — use for issues this PR resolves (auto-closes on merge)
- `Fixes #123` — alternative to "Closes"
- `Resolves #123` — alternative to "Closes"
- `Relates to #123` — for related but not directly resolved issues

Example: `Fixes #123` (issue 123 auto-closes when this PR merges)

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
- [ ] Accessibility checklist completed (where relevant):
  - [ ] Semantic HTML and heading order verified
  - [ ] Keyboard navigation and visible focus states verified
  - [ ] ARIA used only where needed
  - [ ] Contrast and non-colour cues reviewed (WCAG 2.1 AA or higher)
- [ ] Docs/readme/changelog updated (if user-facing)
- [ ] Security checklist completed (where relevant):
  - [ ] Untrusted input validated and sanitised
  - [ ] Output escaped for its rendering context
  - [ ] Privileged actions enforce nonce and capability checks
  - [ ] No secrets/sensitive data introduced; OWASP risks reviewed
- [ ] Code/design reviews approved
- [ ] CI green; linked issues closed; release notes prepared (if shipping)

---
