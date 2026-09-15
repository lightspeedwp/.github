# Branch Naming Strategy — Support Runbook for Team Leads

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

**Quick Links:**

- [Full Branching Strategy Guide](./BRANCHING_STRATEGY.md)
- [FAQ](./BRANCHING_STRATEGY_FAQ.md)
- [One-Pager](./BRANCHING_STRATEGY_ONE_PAGER.md)

## Overview for Team Leads

This runbook provides guidance for supporting developers with branch naming strategy questions and issues. As a team lead, you'll be the first line of support.

**Support SLA:**

- Questions: Response within 1 business day
- Validation errors: Resolution within same day if possible
- Critical issues: Escalate to engineering lead

---

## Common Issues & Resolution Steps

### Issue 1: Branch Validation Fails During Push

**Symptoms:**

- Developer gets error when running `git push`
- Message indicates branch name doesn't match allowed pattern
- Push is blocked

**Diagnosis Steps:**

1. Ask developer to run validation:

   ```bash
   npm run validate:branch-name -- --branch <branch-name>
   ```

2. Check error message for specific violation (see Issue Categories below)

3. Verify branch name pattern: `{type}/{scope}-{title}`

**Common Root Causes:**

| Error | Cause | Solution |
|-------|-------|----------|
| "forbidden prefix" | Using `claude/`, `copilot/`, `openai/` | Rename branch to use correct type |
| "invalid type" | Using wrong type (e.g., `feature/` instead of `feat/`) | Rename to correct type from allowed list |
| "invalid characters" | Underscores, uppercase, special chars | Use lowercase + hyphens only |
| "missing scope" | Branch name has no scope/title | Add scope and title |

**Resolution:**

1. Correct the branch name locally:

   ```bash
   git branch -m old-name new-name
   ```

2. Push the corrected branch:

   ```bash
   git push -u origin new-name
   ```

3. Delete the old remote branch:

   ```bash
   git push origin --delete old-name
   ```

4. Have developer update their PR (GitHub usually handles this automatically)

5. Verify validation passes:

   ```bash
   npm run validate:branch-name -- --branch new-name
   ```

---

### Issue 2: Incorrect PR Template Applied

**Symptoms:**

- Wrong PR template was used for the PR
- Wrong template = wrong template content/fields for the work type
- Developer's PR has template intended for different work type

**Root Cause:**

- Incorrect branch type selected
- Branch type → PR template mapping issue

**Resolution:**

1. Identify the actual work type (is it a feature, bug fix, documentation, etc.?)

2. Determine the correct branch type from [Type Reference](./BRANCHING_STRATEGY.md#95-complete-type-reference-guide)

3. Have developer rename the branch to use correct type:

   ```bash
   git branch -m feat/something fix/something
   git push -u origin fix/something
   git push origin --delete feat/something
   ```

4. GitHub should automatically update the PR and apply correct template

5. Have developer update PR description with correct template format

**Example:**

- Developer created: `feat/null-pointer-fix` (chose feat by mistake)
- Correct type: `fix/null-pointer-in-payment` (it's a bug fix, not a feature)
- After rename, correct PR template (`pr_bug.md`) will auto-apply

---

### Issue 3: Wrong Labels Applied to PR

**Symptoms:**

- PR has incorrect labels or missing labels
- Labels don't match the work type
- Label automation didn't trigger correctly

**Root Cause:**

- Incorrect branch type
- Area keyword detection issue
- Label not in canonical label set

**Resolution:**

1. Check branch type is correct using Type Reference

2. If branch type is wrong, have developer rename it (see Issue 2)

3. If branch type is correct but labels still wrong:
   - Manually add/remove labels as needed
   - File an issue if there's a pattern (e.g., area keyword not detected)

4. Verify labels are from canonical set:
   - All labels should have family prefix: `type:`, `status:`, `priority:`, `area:`, etc.
   - See [Labels Guide](../docs/LABEL_STRATEGY.md) for canonical label list

---

### Issue 4: Developer Unsure Which Type to Use

**Symptoms:**

- Developer asks "Should I use feat or task?"
- Developer created wrong type because uncertain
- Work spans multiple concerns

**Resolution:**

1. Review the [Decision Tree](./BRANCHING_STRATEGY.md#92-decision-tree-choosing-the-right-type)

2. Ask clarifying questions:
   - Is this new functionality? → `feat`
   - Is this fixing a bug? → `fix`
   - Is this refactoring/code improvement? → `refactor`
   - Is this testing infrastructure? → `test`
   - Is this documentation? → `docs`
   - Is this a large project spanning multiple things? → `task`

3. Direct developer to reference materials:
   - [One-Pager](./BRANCHING_STRATEGY_ONE_PAGER.md) for quick selection
   - [Type Reference](./BRANCHING_STRATEGY.md#95-complete-type-reference-guide) for detailed info
   - [FAQ](./BRANCHING_STRATEGY_FAQ.md) for specific type comparisons

4. For common confusions, see FAQ sections:
   - `task` vs `feat` — FAQ: Type Selection
   - `ci` vs `build` vs `ops` — FAQ: Type Selection
   - `docs` vs `content` — FAQ: Type Selection
   - `design` vs `ds` vs `ux` — FAQ: Type Selection

---

### Issue 5: PR Has Invalid Commit

**Symptoms:**

- PR has commit in it that breaks something
- Developer didn't validate before pushing
- Validation passed for branch but not for content

**Note:** Branch name validation only checks the **name**, not the contents. Content validation happens via CI (tests, linting, etc.).

**Resolution:**

1. Have developer review CI failures for specific errors

2. Have developer fix the code/content

3. Push the corrected commit

4. Re-run CI to verify it passes

This is separate from branch naming issues.

---

## Escalation Scenarios

### When to Escalate to Engineering Lead

**Escalate if:**

1. **Validation error doesn't match any known issue** — may indicate a bug in validation system
2. **Developer needs exception to naming rules** — only leadership can approve
3. **New branch type needed** — requires design decision and system update
4. **Repeated validation failures** — may indicate system misconfiguration
5. **Multiple developers reporting same issue** — indicates wider problem

**How to escalate:**

1. Gather specific error messages and reproduction steps
2. Open issue in `.github` repo with `[BRANCH-NAMING-ERROR]` label
3. Tag engineering lead
4. Provide context on why this couldn't be resolved locally

---

## Quick Reference: Type Selection Guide for Team Leads

When helping developers choose a type:

| Developer Says | Type | Branch Example |
|---|---|---|
| "Adding new feature" | `feat` | `feat/dark-mode` |
| "Fixing a bug" | `fix` | `fix/login-timeout` |
| "Critical production issue" | `hotfix` | `hotfix/payment-down` |
| "Cleaning up code" | `refactor` | `refactor/extract-helpers` |
| "Housekeeping" | `chore` | `chore/update-deps` |
| "Large project work" | `task` | `task/auth-refactor` |
| "Writing tests" | `test` | `test/api-tests` |
| "Writing documentation" | `docs` | `docs/api-guide` |
| "Making it faster" | `perf` | `perf/query-optimization` |
| "CI/CD changes" | `ci` | `ci/github-actions` |
| "Security fix" | `security` | `security/xss-fix` |
| "Design/UI changes" | `design` | `design/button-update` |

---

## Validation Command Reference

**For developers:**

```bash
npm run validate:branch-name -- --branch <branch-name>
```

**For team leads (debugging):**

```bash
# Check if validation script exists
ls -la scripts/validation/validate-branch-name.js

# View validation rules
grep -A 20 "VALID_TYPES" .github/branch-types.yml
grep -A 5 "forbidden" scripts/validation/validate-branch-name.js
```

---

## Common Mistakes to Prevent

Help developers avoid these mistakes:

| ❌ Mistake | ✅ Prevention |
|---|---|
| Using `claude/`, `copilot/`, `openai/` | Review allowed types before pushing |
| Using `feature/` or `bugfix/` | Emphasize exact type names: `feat`, `fix` |
| Using underscores: `user_auth` | Remind: hyphens only, no underscores |
| Too generic scope: `feat/stuff` | Ask "What specifically?" and make more specific |
| Creating branch without type | Run validation **before** opening PR |
| Renaming branch wrong | Have them use full rename command, not just local |

---

## Training Tips for Team Leads

When onboarding developers:

1. **Show them the one-pager first** — Quick reference with all 24 types
2. **Demo the validation command** — Run it with good and bad examples
3. **Walk through decision tree** — Help them understand how to pick a type
4. **Show PR template routing** — Explain how type affects template/labels
5. **Emphasize forbidden prefixes** — Warn against `claude/`, `copilot/`, `openai/`
6. **Point to FAQ** — For answers to common questions

**Demo Workflow:**

```bash
# Show validation with good branch
npm run validate:branch-name -- --branch feat/user-auth

# Show validation failure
npm run validate:branch-name -- --branch claude/my-feature

# Show how to fix it
git branch -m claude/my-feature feat/my-feature
npm run validate:branch-name -- --branch feat/my-feature
```

---

## Monitoring & Reporting

### Weekly Check-ins

Review validation metrics if available:

1. **Invalid branch attempts** — How many developers hit validation error?
2. **Type distribution** — Which types are most common?
3. **Common errors** — Are there patterns (e.g., many `claude/` attempts)?
4. **Support load** — How many questions/issues per week?

### Monthly Review

1. Identify training gaps — If many developers struggle with type selection, provide additional training
2. Check FAQ adequacy — Are most questions already in FAQ?
3. Review escalations — Any patterns that need process changes?
4. Update guidance — Adjust runbook based on real-world issues

---

## Support Contact Info

**Quick support questions:**

- Point to: [One-Pager](./BRANCHING_STRATEGY_ONE_PAGER.md)
- Point to: [FAQ](./BRANCHING_STRATEGY_FAQ.md)

**Detailed guidance:**

- Reference: [Full Branching Strategy Guide](./BRANCHING_STRATEGY.md)

**Escalation:**

- Create issue in `.github` repo with `[BRANCH-NAMING-ERROR]` label
- Tag: Engineering lead / DevOps team

---

## Appendix: All 24 Branch Types

**Reference table** for quick lookups:

| Type | Use For | Example |
|------|---------|---------|
| `feat` | New feature | `feat/dark-mode` |
| `fix` | Bug fix | `fix/login-timeout` |
| `hotfix` | Urgent fix | `hotfix/payment-down` |
| `release` | Release branch | `release/v1.2.0` |
| `refactor` | Code restructure | `refactor/extract-helpers` |
| `chore` | Maintenance | `chore/update-deps` |
| `task` | Project work | `task/auth-refactor` |
| `docs` | Documentation | `docs/api-guide` |
| `test` | Tests | `test/unit-tests` |
| `perf` | Performance | `perf/query-optimization` |
| `ci` | CI/CD | `ci/github-actions` |
| `build` | Build system | `build/webpack-update` |
| `deps` | Dependencies | `deps/npm-upgrade` |
| `security` | Security fix | `security/xss-fix` |
| `design` | Design changes | `design/button-update` |
| `a11y` | Accessibility | `a11y/wcag-audit` |
| `ux` | UX improvements | `ux/checkout-flow` |
| `i18n` | Internationalization | `i18n/german-translation` |
| `ops` | Operations | `ops/database-migration` |
| `proto` | Prototype | `proto/caching-strategy` |
| `ds` | Design system | `ds/component-library` |
| `api` | API changes | `api/v2-endpoint` |
| `schema` | Database schema | `schema/user-table` |
| `telemetry` | Analytics | `telemetry/event-tracking` |
| `content` | Content updates | `content/blog-post` |
| `seo` | SEO | `seo/meta-tags` |
| `config` | Configuration | `config/environment-vars` |
| `migrate` | Data migration | `migrate/user-data` |
| `qa` | QA processes | `qa/test-automation` |
| `uat` | UAT changes | `uat/staging-validation` |
| `audit` | Code audit | `audit/security-review` |
| `codex` | Code generation | `codex/auto-documentation` |
| `revert` | Revert commit | `revert/pr-2345` |
| `research` | Research | `research/performance-bench` |

---

*Last Updated: September 2026*  
*For questions or improvements, contact your engineering lead or open an issue in the `.github` repository.*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
