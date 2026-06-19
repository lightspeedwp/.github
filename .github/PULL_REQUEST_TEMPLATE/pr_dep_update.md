---
file_type: "pr-template"
title: "PR Template - DEP_UPDATE"
description: "Pull request template for DEP_UPDATE changes"
version: "1.0.2"
last_updated: "2026-06-18"
category: "github-templates"
---

# Dependencies / Maintenance Pull Request

This PR updates dependencies or performs routine maintenance (lint, formatting, hygiene).
Please review the summary, impact, and changelog below.

> This repository enforces changelog, release, and label automation for all PRs and issues.
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/HEAD/docs/AUTOMATION.md) for required rules.

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
User-facing notes only. Internal-only PRs (rare) may use the `meta:no-changelog` label.
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
If no user-facing changelog entry is needed, apply the `meta:no-changelog` label to this PR.
-->

---

### Checklist (Global DoD / PR)

- [ ] All AC met and demonstrated
- [ ] Tests added/updated (unit/E2E as appropriate)
- [ ] Accessibility checklist completed (where relevant):
  - [ ] Semantic HTML and heading order verified
  - [ ] Keyboard navigation and visible focus states verified
  - [ ] ARIA used only where needed
  - [ ] Contrast and non-colour cues reviewed (WCAG 2.2 AA or higher)
- [ ] Docs/readme/changelog updated (if user-facing)
- [ ] Security checklist completed (where relevant):
  - [ ] Untrusted input validated and sanitised
  - [ ] Output escaped for its rendering context
  - [ ] Privileged actions enforce nonce and capability checks
  - [ ] No secrets/sensitive data introduced; OWASP risks reviewed
- [ ] Code/design reviews approved
- [ ] CI green; linked issues closed; release notes prepared (if shipping)

---
