---
file_type: "documentation"
description: "Pull Request"
name: "Pull Request"
about: "General changes, refactors, and maintenance"
title: "PR: {short summary}"
labels: ["status:needs-review"]
---

# General Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.
> See the organisation-wide [Automation & Workflows](https://github.com/lightspeedwp/.github/blob/HEAD/docs/AUTOMATION.md) for contributor rules.

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
User-facing notes only. Internal-only PRs (rare) may use `meta:no-changelog`.
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
If no user-facing changelog entry is needed, apply `meta:no-changelog` to this PR.
Do not apply `meta:no-changelog` to `type:feature`, `type:bug`, `type:performance`, `type:security`, `type:release`, or `type:hotfix`.
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
- [ ] Accessibility checklist completed (where relevant):
  - [ ] Semantic HTML and heading order verified
  - [ ] Keyboard navigation and visible focus states verified
  - [ ] ARIA used only where needed
  - [ ] Contrast and non-colour cues reviewed (WCAG 2.2 AA)
- [ ] Docs/readme/changelog updated (if user-facing)
- [ ] Frontmatter updated where applicable (`last_updated` and `version`)
- [ ] I have reviewed and applied the downstream override policy (or linked an approved exception)
- [ ] Security checklist completed (where relevant):
  - [ ] Untrusted input validated and sanitised
  - [ ] Output escaped for its rendering context
  - [ ] Privileged actions enforce nonce and capability checks
  - [ ] No secrets/sensitive data introduced; OWASP risks reviewed
- [ ] Code/design reviews approved
- [ ] CI green; linked issues closed; release notes prepared (if shipping)
- [ ] Risk assessment completed above
- [ ] Testing instructions provided above

---

## References

- [Contribution Guidelines](../CONTRIBUTING.md)
- [Branching Strategy](../docs/BRANCHING_STRATEGY.md)
- [Automation & Workflows](../docs/AUTOMATION.md)
- [Pull Request Labelling](../docs/LABELING.md#pull-request-labelling)
- [Saved Replies](./SAVED_REPLIES/README.md)
- [Labeler Config](./labeler.yml)
- [Labels](./labels.yml)
- [Issue Types](./issue-types.yml)

---
