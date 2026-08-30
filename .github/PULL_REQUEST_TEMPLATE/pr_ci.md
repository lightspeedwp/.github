---
file_type: "pr-template"
title: "Build/CI PR"
description: "Pipelines, linting, packaging, or release automation"
labels: ["status:needs-review", "area:ci"]
---

# Build/CI Pull Request

This PR updates the build or CI configuration for Pipelines, linting, packaging, or release automation.  
Please review the summary, baseline/target, and changelog below.

> This PR Template enforces pipelines, linting, changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/HEAD/docs/AUTOMATION_GOVERNANCE.md) for required rules.

## Linked issues

Link this PR to the issue(s) it addresses. Use keywords to auto-close issues when merged:

- `Closes #123` — use for issues this PR resolves (auto-closes on merge)
- `Fixes #123` — alternative to "Closes"
- `Resolves #123` — alternative to "Closes"
- `Relates to #123` — for related but not directly resolved issues

Example: `Relates to #123` (related but not directly resolving)

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
