# Quickstart: Branch Naming Validation

**Phase**: Phase 1 | **Created**: 2026-09-12

## Quick Reference

### Pattern

```
{type}/{scope}-{title}

Examples:
✅ feat/payment-processing-timeout      (feature type)
✅ fix/auth-bug-mobile-safari           (bug fix)
✅ docs/branching-strategy-guide        (documentation)
✅ security/xss-vulnerability-fix       (security)
❌ claude/my-feature                    (FORBIDDEN: claude/ prefix)
❌ feature/my-change                    (WRONG: should be feat/)
❌ my_feature                           (WRONG: missing type/)
```

### 38 Authorised Types

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat/dark-mode-support` |
| `fix` | Bug fix | `fix/auth-timeout-mobile` |
| `hotfix` | Urgent production fix | `hotfix/critical-security-patch` |
| `release` | Release | `release/v1.2.3` |
| `refactor` | Code refactoring | `refactor/api-response-structure` |
| `chore` | Repository maintenance | `chore/dependency-cleanup` |
| `task` | Scoped unit of work | `task/authentication-refactor` |
| `doc` | Single documentation change | `doc/readme-typo-fix` |
| `docs` | Documentation | `docs/branching-guide` |
| `test` | Tests/test infrastructure | `test/integration-tests` |
| `perf` | Performance improvement | `perf/query-optimization` |
| `ci` | CI/CD pipelines | `ci/github-actions-workflow` |
| `build` | Build system changes | `build/webpack-config-update` |
| `deps` | Dependency updates | `deps/upgrade-npm-packages` |
| `security` | Security vulnerability | `security/xss-vulnerability` |
| `revert` | Revert a previous change | `revert/pr-2345-bad-merge` |
| `research` | Research or investigation | `research/performance-benchmarks` |
| `design` | Product or visual design | `design/button-component-update` |
| `a11y` | Accessibility | `a11y/wcag-compliance-audit` |
| `ux` | User experience | `ux/form-validation-feedback` |
| `i18n` | Internationalisation | `i18n/german-translation-pack` |
| `ops` | Operations and deployment | `ops/database-migration-script` |
| `proto` | Prototype or experiment | `proto/new-caching-strategy` |
| `ds` | Design system | `ds/component-library-update` |
| `api` | API changes | `api/rest-endpoint-versioning` |
| `schema` | Data schema | `schema/user-model-changes` |
| `telemetry` | Analytics and monitoring | `telemetry/event-tracking-setup` |
| `content` | Content changes | `content/homepage-copy-update` |
| `seo` | Search optimisation | `seo/meta-tag-improvements` |
| `config` | Configuration | `config/environment-variables` |
| `migrate` | Data or schema migration | `migrate/user-table-migration` |
| `qa` | Quality assurance | `qa/test-automation-framework` |
| `uat` | User acceptance testing | `uat/staging-validation-suite` |
| `audit` | Audit or compliance review | `audit/security-code-review` |
| `codex` | AI-assisted code work | `codex/auto-documentation-tool` |
| `aiops` | AI operations | `aiops/model-monitoring-update` |
| `automation` | Workflow automation | `automation/issue-routing-update` |
| `epic` | Multi-part initiative | `epic/platform-modernisation` |

### Forbidden Prefixes (ABSOLUTE)

- ❌ `claude/` — Reserved for Claude Code internal sessions
- ❌ `copilot/` — Reserved for GitHub Copilot
- ❌ `openai/` — Reserved for OpenAI integration

---

## Validation Workflow

### Step 1: Create Branch

```bash
git checkout -b feat/payment-processing-timeout
# Branch name: feat / payment-processing / timeout
#              type / scope               / title
```

### Step 2: Push and Create PR

```bash
git push origin feat/payment-processing-timeout
gh pr create --title "feat: payment timeout fix"
```

### Step 3: Validation Runs (Automatic)

```
✅ Branch naming validation
   - Type: feat (authorized) ✅
   - Scope: payment-processing (kebab-case) ✅
   - No forbidden prefixes ✅
   - Template: pr_feature.md (auto-routed) ✅
   - Labels: type:feature, area:core (auto-applied) ✅

✅ PR created with correct template
✅ Ready to merge
```

### Step 4: Template Routes Automatically

PR template `pr_feature.md` auto-applies based on `feat/` prefix.

---

## Common Scenarios

### Scenario: Invalid Branch Name

```bash
git checkout -b claude/my-feature
git push origin claude/my-feature
```

**CI Output**:

```
❌ Branch naming validation FAILED

Branch name: claude/my-feature
Violation: Forbidden prefix 'claude/'
Reason: Reserved for Claude Code internal sessions

✏️ Suggested fix:
   git branch -m feat/my-feature

Resources:
- Naming guide: docs/BRANCH_NAMING.md
- Type list: https://repo.github.io/branch-types
```

**Fix**:

```bash
git branch -m feat/my-feature
git push origin -u feat/my-feature
```

### Scenario: Wrong Type

```bash
git checkout -b feature/user-auth  # ❌ "feature" should be "feat"
```

**Fix**:

```bash
git branch -m feat/user-auth
git push origin feat/user-auth --force-with-lease
```

---

## Compliance Dashboard

**URL**: `.github/reports/branch-naming-metrics/`

**Display**:

- Current compliance: 95.2%
- Violations this week: 3
- Top violation: Invalid type format
- Trend: Improving (+2.5% vs. last week)

---

## Quick Validation

Before pushing, verify your branch name:

```bash
# Reuse the canonical validator for type, format, forbidden-prefix, and release checks.
# BRANCH_NAME may be release/v1.2.3, release/1.2.3, or a standard typed branch.
BRANCH_NAME="${BRANCH_NAME:-$(git branch --show-current)}"
node scripts/validation/validate-branch-name.cjs --branch "$BRANCH_NAME"
```

---

## Phase 1 Complete

Quickstart guide for branch naming validation and PR template routing.
