---
file_type: "pr-template"
title: "PR Template - CI"
description: "Pull request template for CI changes"
version: "1.0.2"
last_updated: "2026-06-18"
category: "github-templates"
---

# Build/CI Pull Request

This PR updates the build or CI configuration for Pipelines, linting, packaging, or release automation.
Please review the summary, baseline/target, and changelog below.

> This PR Template enforces pipelines, linting, changelog, release, and label automation for all PRs and issues.
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/HEAD/docs/AUTOMATION.md) for required rules.

## Linked issues

<!--
List any related issues by number (e.g. closes #123, relates to #789).
-->

Relates to #

## Build/CI change

<!--
- What: (summarise)
- Why: (reliability/speed/consistency)
-->

## Baseline & Target

<!--
- Before: <times/flakes>
- After: <times/flakes>
-->

## Rollback

<!--
- Plan: (how to revert)
-->

## Notes

<!--
- Secrets/permissions considerations: (details)
-->

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
