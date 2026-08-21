---
file_type: documentation
title: Pull Request Creation Process
description: Process and best practices for creating pull requests in the LightSpeed organization.
---

*Note: This file follows LightSpeedWP governance, frontmatter, naming, and versioning conventions as described in [VERSIONING.md](./VERSIONING.md) and [FRONTMATTER_SCHEMA.md](./FRONTMATTER_SCHEMA.md).*

# LightSpeed Pull Request (PR) Creation Guide

This guide explains how to create actionable, well-labeled pull requests (PRs) in LightSpeed projects—ensuring automation, traceability, and contributor clarity. Following these steps helps maintain quality and makes the review and release process efficient for everyone.

---

## 1. **Before You Open a PR**

- **Ensure your changes are linked to an actionable issue.**
  Reference the related issue number in your PR description (e.g., “Closes #123”).
- **Rebase or update your branch to the latest `main` (or target) branch.**
- **Run all tests and linting locally.**
  See [Testing Guide](TESTING.md).
- **Update documentation as needed.**
  If you’ve changed behaviors or APIs, update relevant docs.

---

## 2. **Branch Naming**

Use a branch prefix that matches your change type:

- `feat/` for features
- `fix/` for bug fixes
- `docs/` for documentation
- `chore/` for chores and maintenance
- `refactor/`, `test/`, `perf/`, `ci/`, etc. as appropriate

Example:
`feat/header-block-responsive-layout`

> **Tip:** Branch prefixes determine automation, label application, and PR template selection.

---

## 3. **Choose the Correct PR Template**

When you open a PR, GitHub will prompt you to pick a template matching your change:

- **Bugfix**
- **Feature**
- **Docs**
- **Chore**
- **Build/CI**
- **Hotfix**
- **Release**
- **Refactor**
- **General**

> Each template includes required fields and checklists. Fill these in thoroughly.

### PR Template Assignment using Branch Prefixes

Every PR should use a standard branch prefix for correct label and template automation:

The machine-readable route map lives in
[`.github/PULL_REQUEST_TEMPLATE/config.yml`](../.github/PULL_REQUEST_TEMPLATE/config.yml).
The table below mirrors that contract so the guide, routing config, and
branching policy stay aligned.

| Prefix | Purpose | Maps to Type / Label | PR Template |
| --- | --- | --- | --- |
| `feat/` | New feature or enhancement | feature | `.github/PULL_REQUEST_TEMPLATE/pr_feature.md` |
| `fix/` | Bugfix or regression | bug | `.github/PULL_REQUEST_TEMPLATE/pr_bug.md` |
| `hotfix/` | Emergency production fix | hotfix / bug | `.github/PULL_REQUEST_TEMPLATE/pr_hotfix.md` |
| `refactor/` | Internal code refactoring | refactor | `.github/PULL_REQUEST_TEMPLATE/pr_refactor.md` |
| `chore/` | Maintenance/hygiene tasks | chore | `.github/PULL_REQUEST_TEMPLATE/pr_chore.md` |
| `docs/` | Documentation changes | documentation | `.github/PULL_REQUEST_TEMPLATE/pr_docs.md` |
| `test/` | Test-only work | test | `.github/PULL_REQUEST_TEMPLATE/pr_chore.md` |
| `perf/` | Performance improvements | performance | `.github/PULL_REQUEST_TEMPLATE/pr_feature.md` |
| `ci/` | CI/CD or workflow changes | ci | `.github/PULL_REQUEST_TEMPLATE/pr_ci.md` |
| `build/` | Build process changes | build | `.github/PULL_REQUEST_TEMPLATE/pr_ci.md` |
| `deps/` | Dependency updates | dependency | `.github/PULL_REQUEST_TEMPLATE/pr_dep_update.md` |
| `security/` | Security-related work | security | `.github/PULL_REQUEST_TEMPLATE/pr_bug.md` |
| `design/` | Design changes | design | `.github/PULL_REQUEST_TEMPLATE/pr_feature.md` |
| `a11y/` | Accessibility changes | accessibility | `.github/PULL_REQUEST_TEMPLATE/pr_feature.md` |
| `ux/` | User experience work | ux | `.github/PULL_REQUEST_TEMPLATE/pr_feature.md` |
| `release/` | Release prep/deployment | release | `.github/PULL_REQUEST_TEMPLATE/pr_release.md` |
| `research/` | Research spikes | research | `.github/PULL_REQUEST_TEMPLATE/pr_feature.md` |
| `revert/` | Revert previous changes | revert | `.github/PULL_REQUEST_TEMPLATE/pr_chore.md` |
| `i18n/` | Internationalisation work | i18n | `.github/PULL_REQUEST_TEMPLATE/pr_feature.md` |
| `ops/` | Operations work | ops | `.github/PULL_REQUEST_TEMPLATE/pr_chore.md` |
| `proto/` | Prototypes / experiments | proto | `.github/PULL_REQUEST_TEMPLATE/pr_feature.md` |
| `ds/` | Design system work | design system | `.github/PULL_REQUEST_TEMPLATE/pr_feature.md` |
| `api/` | API surface changes | api | `.github/PULL_REQUEST_TEMPLATE/pr_feature.md` |
| `.schemas/` | Schema or database changes | schema | `.github/PULL_REQUEST_TEMPLATE/pr_feature.md` |
| `telemetry/` | Analytics / metrics work | telemetry | `.github/PULL_REQUEST_TEMPLATE/pr_feature.md` |
| `content/` | Content / IA changes | content | `.github/PULL_REQUEST_TEMPLATE/pr_docs.md` |
| `seo/` | SEO / metadata changes | seo | `.github/PULL_REQUEST_TEMPLATE/pr_docs.md` |
| `config/` | Site or plugin configuration | config | `.github/PULL_REQUEST_TEMPLATE/pr_chore.md` |
| `migrate/` | Content or data migrations | migrate | `.github/PULL_REQUEST_TEMPLATE/pr_chore.md` |
| `qa/` | Test harnesses / UAT scaffolding | qa | `.github/PULL_REQUEST_TEMPLATE/pr_chore.md` |
| `uat/` | UAT-only changes | uat | `.github/PULL_REQUEST_TEMPLATE/pr_chore.md` |

---

## 4. **Write a Clear PR Title**

Format:
`[Type] Area/Component: Brief summary (Closes #issue)`

Examples:

- `[Feature] Block Patterns: Add new testimonial pattern (Closes #201)`
- `[Bugfix] Theme JSON: Fix color palette regression (Closes #198)`
- `[Docs] README: Add setup instructions`

---

## 5. **Complete the PR Description**

- **Describe what changed and why.**
- **Reference related issues** with `Closes #`, `Fixes #`, or `Related to #`.
- **Provide test instructions** (manual steps, screenshots, videos for UI changes).
- **List any skipped tests or known limitations.**
- **Note documentation updates** or required follow-up issues.

---

## 6. **Apply Labels and Milestones**

- Labels are set automatically based on branch prefix and file changes, but review and add as needed:
- **Type:** `type:feature`, `type:bug`, `type:documentation`, etc.
  - **Area/Component:** `area:ci`, `comp:block-editor`, etc.
  - **Status:** `status:needs-review`, `status:needs-qa`, etc.
  - **Release:** `release:minor`, `release:patch`, `release:major`, etc.
  - **Meta:** `meta:needs-changelog`, `contrib:help-wanted`, etc.

- **Assign to the relevant milestone** (e.g., "Phase 6 - GC & Production") and project board if applicable.
- **Assignee:** the PR author is auto-assigned unless a stronger repository rule applies.
- **Linked development:** reference related issues or PRs with `Closes #`, `Fixes #`, or `Related to #` so metadata governance can capture the relation.

---

## 7. **Check PR Checklist**

Each PR template includes a checklist. Ensure you:

- [ ] Ran all tests and linters
- [ ] Updated documentation (if needed)
- [ ] Added/updated tests
- [ ] Completed accessibility checks (semantic structure, keyboard/focus, ARIA only when needed, contrast/non-colour cues; WCAG 2.2 AA)
- [ ] Completed security checks (validation/sanitisation, context-specific escaping, nonce/capability checks where relevant, and OWASP risk review)
- [ ] Linked issues
- [ ] Provided screenshots or video (for UI changes)
- [ ] Selected appropriate labels
- [ ] Ensured CI passes

---

## 8. **Submit and Respond to Review**

- Open the PR and monitor CI status checks.
- **Respond promptly to reviewer feedback.**
- Make changes via additional commits; avoid force-push unless requested.
- **Update your PR description or checklist** if necessary.

---

## 9. **Merging and Release**

- Only maintainers can merge.
- PRs are merged after:
  - All status checks pass (tests, lint, a11y, etc.)
  - At least one reviewer approves
  - Changelog/release labels are set and docs/tests are updated
- PRs linked to issues with `Closes #issue` will auto-close the issue upon merge.
- After merge, `checklist-finalisation.yml` rewrites the PR body checklist section so the merged description reflects the final completed state.

---

## 10. **Release Notes and Changelog**

- PRs affecting user-facing features or fixes must include a [CHANGELOG.md](../CHANGELOG.md) entry.
- Label with `meta:needs-changelog` if your PR should be included in release notes.
- Release workflow will group and publish notes based on labels and PR templates.

---

## 11. **References**

- [Pull Request Template](https://github.com/lightspeedwp/.github/tree/HEAD/.github/PULL_REQUEST_TEMPLATE)
- [GitHub PR Templates](../.github/PULL_REQUEST_TEMPLATE/)
- [Issue Types Guide](./ISSUE_TYPES.md)
- [Label Guide](./LABELING.md#pull-request-labelling)
- [Automated Label Rules](../.github/labeler.yml)
- [Branching Strategy](./BRANCHING_STRATEGY.md)
- [Testing Guide](./TESTING.md)
- [Contribution Guidelines](../CONTRIBUTING.md)
- [Roadmap](./ROADMAP.md)

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
