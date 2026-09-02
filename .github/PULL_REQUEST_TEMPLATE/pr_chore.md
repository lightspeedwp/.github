---
name: "Chore PR"
about: "Repo hygiene: configs, scripts, formatting — no behaviour change"
title: "chore: {scope}"
labels: ["status:needs-review", "priority:normal"]
---

# Chore Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/HEAD/docs/AUTOMATION_GOVERNANCE.md) for required rules.

## Linked issues

Link this PR to the issue(s) it addresses. Use keywords to auto-close issues when merged:

- `Closes #123` — use for issues this PR resolves (auto-closes on merge)
- `Fixes #123` — alternative to "Closes"
- `Resolves #123` — alternative to "Closes"
- `Relates to #123` — for related but not directly resolved issues

Example: `Closes #123` (issue 123 auto-closes when this PR merges)

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
