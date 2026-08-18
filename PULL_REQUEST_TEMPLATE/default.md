---
file_type: "documentation"
description: "PR template router"
name: "Which PR template should I use?"
about: "Branch-to-template routing for consistent PR governance"
title: "PR: {short summary}"
labels: ["status:needs-review"]
---

# Which PR template should I use?

Use this file as a router. Copy the matching template from the GitHub
`.github/PULL_REQUEST_TEMPLATE/` folder based on your branch prefix, then
replace this body with that template.

## Quick selector

| Branch prefix | Template |
| --- | --- |
| `feat/` | `pr_feature.md` |
| `fix/` | `pr_bug.md` |
| `hotfix/` | `pr_hotfix.md` |
| `refactor/` | `pr_refactor.md` |
| `chore/` | `pr_chore.md` |
| `docs/` | `pr_docs.md` |
| `test/` | `pr_chore.md` |
| `perf/` | `pr_feature.md` |
| `ci/` | `pr_ci.md` |
| `build/` | `pr_ci.md` |
| `deps/` | `pr_dep_update.md` |
| `security/` | `pr_bug.md` |
| `design/` | `pr_feature.md` |
| `a11y/` | `pr_feature.md` |
| `ux/` | `pr_feature.md` |
| `release/` | `pr_release.md` |
| `research/` | `pr_feature.md` |
| `revert/` | `pr_chore.md` |
| `i18n/` | `pr_feature.md` |
| `ops/` | `pr_chore.md` |
| `proto/` | `pr_feature.md` |
| `ds/` | `pr_feature.md` |
| `api/` | `pr_feature.md` |
| `.schemas/` | `pr_feature.md` |
| `telemetry/` | `pr_feature.md` |
| `content/` | `pr_docs.md` |
| `seo/` | `pr_docs.md` |
| `config/` | `pr_chore.md` |
| `migrate/` | `pr_chore.md` |
| `qa/` | `pr_chore.md` |
| `uat/` | `pr_chore.md` |

## Template links

- [Feature](./PULL_REQUEST_TEMPLATE/pr_feature.md)
- [Bug](./PULL_REQUEST_TEMPLATE/pr_bug.md)
- [Hotfix](./PULL_REQUEST_TEMPLATE/pr_hotfix.md)
- [Refactor](./PULL_REQUEST_TEMPLATE/pr_refactor.md)
- [Chore](./PULL_REQUEST_TEMPLATE/pr_chore.md)
- [Docs](./PULL_REQUEST_TEMPLATE/pr_docs.md)
- [CI](./PULL_REQUEST_TEMPLATE/pr_ci.md)
- [Dependency update](./PULL_REQUEST_TEMPLATE/pr_dep_update.md)
- [Release](./PULL_REQUEST_TEMPLATE/pr_release.md)

## Why this matters

Correct template selection improves label automation, changelog quality, and
review consistency. The routing rules are defined in
`.github/PULL_REQUEST_TEMPLATE/config.yml`.

## Linked issues

<!--
List related issues by number (e.g. closes #123, fixes #456, relates to #789).
-->

Closes #

## Changelog

<!--
Required for release automation.
Add at least one bullet under Added, Changed, Fixed, or Removed.
-->

### Added

### Changed

### Fixed

### Removed

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
- [ ] Docs/readme/changelog updated (if user-facing)
- [ ] Risk assessment completed above
- [ ] Testing instructions provided above

---

## References

- [Contribution Guidelines](../CONTRIBUTING.md)
- [Branching Strategy](../docs/BRANCHING_STRATEGY.md)
- [Automation & Workflows](../docs/AUTOMATION.md)
- [PR template routes](./PULL_REQUEST_TEMPLATE/config.yml)
- [Pull Request Labelling](../docs/LABELING.md#pull-request-labelling)
- [Saved Replies](./SAVED_REPLIES/README.md)
- [Labeler Config](./labeler.yml)
- [Labels](./labels.yml)
- [Issue Types](./issue-types.yml)

---
