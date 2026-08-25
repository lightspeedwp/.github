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

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
