---
name: "Pull Request"
about: "General changes, refactors, and maintenance"
title: "PR: {short summary}"
labels: ["status:needs-review"]
---

# General Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/main/AUTOMATION_GOVERNANCE.md) for contributor rules.

## Linked issues

<!--
List any related issues by number (e.g. closes #123, fixes #456, relates to #789).
-->

Closes #

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

## Risk Assessment

<!--
Evaluate the risk level of this PR and potential impact on production.
This helps reviewers prioritize and determine the appropriate review rigor.
-->

**Risk Level:** <!-- Choose one: Low | Medium | High | Critical -->

**Potential Impact:**
<!-- Describe what could go wrong if this change has bugs. Examples:
- Low: Typo in documentation, minor style tweak
- Medium: New feature in isolated component, refactor with test coverage
- High: Changes to core authentication, database schema changes
- Critical: Payment processing, security fixes, data migrations
-->

**Mitigation Steps:**
<!-- What steps have been taken to reduce risk? Examples:
- Comprehensive test coverage (unit, integration, E2E)
- Feature flag for gradual rollout
- Tested in staging environment
- Reversible database migration
- Monitoring and alerting in place
-->

---

## How to Test

<!--
Provide clear, step-by-step instructions for testing this PR.
Include:
- Prerequisites (data setup, feature flags, environment variables)
- User flows to test
- Expected results for each step
- Edge cases to verify
- Screenshots or videos demonstrating the changes (for UI changes)
-->

### Prerequisites

<!-- Example:
- Create a test user account
- Enable feature flag: `FEATURE_NEW_DASHBOARD=true`
- Seed database with sample data: `npm run db:seed`
-->

### Test Steps

1. **Step 1:** <!-- Describe action and expected result -->
2. **Step 2:** <!-- Describe action and expected result -->
3. **Step 3:** <!-- Describe action and expected result -->

### Expected Results

<!-- Describe what success looks like. Include screenshots or videos for UI changes. -->

### Edge Cases to Verify

<!-- List edge cases that should be tested. Examples:
- [ ] Empty state (no data)
- [ ] Maximum data (performance test)
- [ ] Error handling (network failure, invalid input)
- [ ] Mobile/responsive design
- [ ] Accessibility (keyboard navigation, screen reader)
- [ ] Browser compatibility (Chrome, Firefox, Safari)
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
- [ ] Risk assessment completed above
- [ ] Testing instructions provided above

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
