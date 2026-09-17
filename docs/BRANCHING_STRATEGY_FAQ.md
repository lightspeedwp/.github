# Branch Naming Strategy — Frequently Asked Questions

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

## Type Selection Questions

### Q: What's the difference between `task` and `feat`?

**A:** Use `feat` for user-facing features or new capabilities. Use `task` for larger project-scope work that might span multiple features or components. Examples:

- ✅ `feat/add-dark-mode` — single feature
- ✅ `task/authentication-refactor` — large multi-phase project spanning multiple features

**Rule of thumb:** If the work fits in one PR, use `feat`. If it requires multiple PRs or spans an epic, use `task`.

---

### Q: When should I use `proto` vs `feat`?

**A:** Use `proto` for experimental, throwaway, or proof-of-concept work that **won't** go to production. Use `feat` for features that **will** be deployed.

- ✅ `proto/new-caching-strategy-experiment` — experimental, may be discarded
- ✅ `feat/implement-redis-caching` — production-ready feature

**Rule of thumb:** After `proto` work, you might create a `feat` branch based on the learnings. Never merge `proto` to production without converting to `feat` first.

---

### Q: What's the difference between `fix` and `hotfix`?

**A:** Use `fix` for standard bug fixes that can follow normal review process. Use `hotfix` for critical production issues that need immediate deployment.

- ✅ `fix/login-timeout-after-30-minutes` — normal priority, can wait for review
- ✅ `hotfix/payment-processing-failure` — critical, needs immediate deployment

**Rule of thumb:** `hotfix` should only be used for issues affecting many users or causing data loss. Everything else is `fix`.

---

### Q: What's the difference between `ci`, `build`, and `ops`?

**A:** These three types handle different infrastructure concerns:

- **`ci`** — GitHub Actions workflows, CI/CD pipeline changes, testing automation
  - ✅ `ci/add-test-matrix`
  - ✅ `ci/github-actions-workflow-update`

- **`build`** — Build tooling, webpack/vite configuration, bundling, build scripts
  - ✅ `build/webpack-update`
  - ✅ `build/npm-scripts-modernization`

- **`ops`** — Operational infrastructure, deployments, database migrations, server config
  - ✅ `ops/database-migration`
  - ✅ `ops/kubernetes-config-update`

**Rule of thumb:** If it affects the CI pipeline, use `ci`. If it affects how code is bundled, use `build`. If it affects how code is deployed or run, use `ops`.

---

### Q: When should I use `docs` vs `content`?

**A:** Use `docs` for technical documentation and guides. Use `content` for website copy, blog posts, and marketing materials.

- ✅ `docs/api-endpoint-reference` — technical documentation
- ✅ `docs/getting-started-guide` — technical guide
- ✅ `content/blog-post-wordpress-best-practices` — blog post
- ✅ `content/landing-page-copy-update` — marketing copy

**Rule of thumb:** If developers will read it, use `docs`. If customers or end-users will read it, use `content`.

---

### Q: When should I use `refactor` vs `task`?

**A:** Use `refactor` for code restructuring that improves code quality without changing behaviour. Use `task` for large project work that might include refactoring plus new features or major changes.

- ✅ `refactor/extract-validation-helpers` — pure code improvement
- ✅ `task/authentication-refactor` — large project that includes refactoring + new features

**Rule of thumb:** If the work is purely improving existing code without adding functionality, use `refactor`. If it's a larger project work, use `task`.

---

### Q: What's the difference between `a11y` and `ux`?

**A:** Use `a11y` for accessibility improvements (WCAG compliance, screen readers, keyboard navigation). Use `ux` for user experience improvements (usability, workflow optimization, reducing friction).

- ✅ `a11y/add-aria-labels-to-forms` — accessibility
- ✅ `ux/reduce-checkout-form-steps` — UX improvement

**Rule of thumb:** `a11y` is about making the system usable for people with disabilities. `ux` is about making the system easier or more pleasant to use for everyone.

---

### Q: When should I use `design` vs `ds` vs `ux`?

**A:** Use `design` for component or styling changes. Use `ds` for design system framework or documentation. Use `ux` for user experience/workflow improvements.

- ✅ `design/button-hover-animation` — component styling
- ✅ `ds/component-library-documentation` — design system documentation
- ✅ `ux/reduce-form-complexity` — user experience improvement

**Rule of thumb:** If you're changing how components look/behave, use `design`. If you're building the design system itself, use `ds`. If you're improving workflow, use `ux`.

---

### Q: What types should I use for database work?

**A:** Use `schema` for schema changes and data models. Use `migrate` for data migration scripts and content migrations.

- ✅ `schema/add-index-to-orders-table` — schema change
- ✅ `migrate/backfill-user-preferences` — data migration

**Rule of thumb:** `schema` is structural changes. `migrate` is operational changes that move/transform data.

---

## Naming & Validation Questions

### Q: My branch name was rejected during validation. What's wrong?

**A:** Check these common issues:

1. **Using forbidden prefix:**  
   ❌ `claude/my-feature`, `copilot/my-fix`, `openai/experiment`  
   ✅ Use correct type: `feat/my-feature`, `fix/my-fix`, `proto/experiment`

2. **Using wrong type:**  
   ❌ `feature/my-work` or `bugfix/something`  
   ✅ Use exact type: `feat/my-work` or `fix/something`

3. **Using uppercase:**  
   ❌ `Feat/My-Feature` or `FEAT/my-feature`  
   ✅ Use lowercase: `feat/my-feature`

4. **Using underscores:**  
   ❌ `feat/my_feature` or `feat/my_work_here`  
   ✅ Use hyphens: `feat/my-feature` or `feat/my-work-here`

5. **Missing scope/title:**  
   ❌ `feat/` or just `feat`  
   ✅ Add scope and title: `feat/user-authentication`

6. **Too generic scope:**  
   ❌ `feat/stuff` or `fix/thing`  
   ✅ Be specific: `feat/user-authentication` or `fix/null-pointer-error`

Run `npm run validate:branch-name -- --branch <your-branch>` to see the specific error.

---

### Q: Can I have hyphens in the scope and title parts?

**A:** Yes! Use hyphens to separate words within the scope/title.

- ✅ `feat/user-authentication-system` — multiple hyphens okay
- ✅ `fix/null-pointer-in-payment-validation` — multiple hyphens okay
- ❌ `feat/userAuthenticationSystem` — don't use camelCase

---

### Q: What if I already created a branch with the wrong name?

**A:** Rename it locally and push:

```bash
# Rename the branch locally
git branch -m old-name new-name

# Push the new name
git push -u origin new-name

# Delete the old remote branch
git push origin --delete old-name

# Update your PR (GitHub might do this automatically)
```

Or, if the PR is already open, close it and create a new one with the correct branch name.

---

### Q: Can I use numbers in branch names?

**A:** Yes, numbers are allowed in the scope/title:

- ✅ `task/react-18-upgrade` — version number okay
- ✅ `feat/add-v2-api-endpoints` — version indicator okay
- ✅ `fix/issue-2345-regression` — issue number okay

---

### Q: How specific should my scope/title be?

**A:** Be specific enough that someone can understand what the branch does without seeing the actual code.

- ❌ Too vague: `feat/auth`, `fix/bug`, `docs/guide`
- ✅ Good: `feat/oauth2-social-login`, `fix/null-pointer-in-payment`, `docs/api-authentication-guide`

**Rule of thumb:** Aim for 2-4 words total (type + scope + title combined).

---

## Process Questions

### Q: Should I create a separate branch for tests?

**A:** Usually no. Include tests in the same branch as your feature/fix:

- ✅ `feat/dark-mode` (includes tests for dark mode)
- ❌ `feat/dark-mode` + separate `test/dark-mode-tests`

Create a separate `test/` branch only for test infrastructure improvements:

- ✅ `test/integration-test-framework` (test infrastructure)
- ✅ `test/add-e2e-test-suite` (test infrastructure)

---

### Q: What if my work involves multiple concerns (e.g., feature + performance optimization)?

**A:** Create separate branches for each concern:

- `feat/new-reporting-feature`
- `perf/query-optimization-for-reports` (or `perf/reporting-query-optimization`)

This keeps changes focused and makes reviews easier.

---

### Q: Can I create a branch for work that hasn't been assigned yet?

**A:** Not recommended. Wait for work to be assigned or use a descriptive scope that makes it clear what you're working on. If you're spiking or exploring:

- ✅ `research/performance-benchmarking`
- ✅ `proto/new-auth-approach`

---

### Q: Should the branch name match the PR title?

**A:** The PR title can be more descriptive than the branch name:

- **Branch:** `feat/user-auth` (follows naming rules)
- **PR Title:** "Implement OAuth2 social authentication (GitHub, Google, GitHub)"

The branch name identifies the type of work; the PR title describes the specific implementation.

---

### Q: How long should I keep a branch open?

**A:** Keep branches short-lived (ideally <1 day of work):

- ✅ Open PR early, merge when complete
- ❌ Keep a branch open for weeks waiting for review

If a branch stays open >2 days without progress, consider splitting it into smaller chunks.

---

## Automation & Workflows Questions

### Q: How does my branch name affect PR templates?

**A:** The branch type determines which PR template is auto-selected:

- `feat/` → `pr_feature.md`
- `fix/` → `pr_bug.md`
- `docs/` → `pr_docs.md`
- `security/` → `pr_security.md`
- etc.

The correct PR template helps reviewers understand the work and ensures consistency.

---

### Q: How does my branch name affect labels?

**A:** The branch type determines default labels:

- `feat/` → `type:feature` label
- `fix/` → `type:bug` label
- `security/` → `type:security`, `priority:critical` labels
- etc.

Area labels are auto-detected from scope keywords:

- `feat/api-endpoint` → `area:api` label
- `feat/auth-system` → `area:security` label
- `ci/github-actions` → `area:ci` label

---

### Q: What if I don't want the auto-assigned labels?

**A:** The auto-assigned labels are defaults. You can:

1. Add additional labels in the PR
2. Remove labels if they're incorrect

But the defaults are designed to be helpful. Question them if they seem wrong, but usually they're correct.

---

## Support Questions

### Q: Who can I ask for help?

**A:**

1. **Quick questions?** → Check this FAQ or the [one-pager](./BRANCHING_STRATEGY_ONE_PAGER.md)
2. **Need more detail?** → Read the [full branching strategy guide](./BRANCHING_STRATEGY.md)
3. **Still stuck?** → Ask your team lead or ping on Slack
4. **Validation error?** → Run `npm run validate:branch-name -- --branch <your-branch>` for specific feedback

---

### Q: What if there's a use case not covered here?

**A:** Open an issue in the `.github` repo or discuss with your team lead. We can:

1. Add the use case to this FAQ
2. Add a new branch type if needed
3. Update documentation to be clearer

---

## Rules & Enforcement Questions

### Q: Can there be exceptions to the naming rules?

**A:** No. The naming rules are strictly enforced via:

1. **Pre-push hook** — validates before you can push
2. **GitHub Actions workflow** — validates during PR
3. **CI system** — prevents merge if validation fails

If you genuinely believe an exception is needed, escalate to leadership. Don't try to work around the validation.

---

### Q: What happens if I bypass the validation?

**A:** The pre-push hook can be bypassed with `git push --no-verify`, but:

1. **GitHub validation still runs** — PR will show validation failure
2. **PR can't merge** — branch validation blocks merge
3. **Wasted time** — you'll need to fix the branch anyway

**Never bypass validation.** Fix the branch name instead.

---

### Q: Will the naming rules ever change?

**A:** Unlikely. The 24 types cover virtually all work types. If changes are needed:

1. Announcement will be made
2. Old branches won't be retroactively rejected
3. New branches must follow updated rules
4. Transition period will be provided

Check [CHANGELOG.md](../CHANGELOG.md) for any updates.

---

## Still Have Questions?

- **General:** Read the [full branching strategy guide](./BRANCHING_STRATEGY.md)
- **Quick reference:** See the [one-pager](./BRANCHING_STRATEGY_ONE_PAGER.md)
- **Types overview:** Check [CLAUDE.md](../CLAUDE.md#allowed-type-values-use-exactly)
- **Validation error:** Run `npm run validate:branch-name -- --branch <your-branch>`
- **Need help:** Ask your team lead or raise an issue in `.github` repo

---

*Last Updated: September 2026*  
*For suggestions or improvements, open an issue in the `.github` repository.*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
