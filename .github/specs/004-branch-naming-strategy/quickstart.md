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

### 38 Authorized Types (Constitution Section VIII)

**Feature Types**: `feat`, `task`, `epic`
**Bugfix Types**: `fix`, `hotfix`, `revert`
**Quality Types**: `refactor`, `chore`, `audit`, `test`, `qa`, `uat`
**Documentation**: `doc`, `docs`, `content`, `seo`
**Infrastructure**: `ci`, `build`, `ops`, `automation`
**Design**: `design`, `ds`, `a11y`, `ux`
**Technical**: `api`, `schema`, `config`, `migrate`, `telemetry`
**Dependencies**: `deps`
**Speciality**: `security`, `perf`, `proto`, `research`, `codex`, `aiops`, `i18n`, `release`

See [contracts/branch-naming.contract.md](contracts/branch-naming.contract.md) for complete mapping.

### Forbidden Prefixes (ABSOLUTE)
- ❌ `claude/` — Reserved for Claude Code internal sessions
- ❌ `copilot/` — Reserved for GitHub Copilot
- ❌ `openai/` — Reserved for OpenAI integration

### Branch Exemptions (No Validation Required)

The following branches bypass naming pattern validation:

| Branch | Reason |
|--------|--------|
| `main` | Production release branch |
| `develop` | Development integration branch |
| `dependabot/*` | Automated dependency updates (Dependabot) |
| `renovate/*` | Automated dependency updates (Renovate) |

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
# Type validation (against all 34 authorized types)
TYPE=$(echo "$BRANCH_NAME" | cut -d'/' -f1)
VALID_TYPES="feat|fix|hotfix|release|refactor|chore|task|docs|test|perf|ci|build|deps|security|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|audit|codex|revert|research"
[[ "$TYPE" =~ ^($VALID_TYPES)$ ]] && echo "✅ Type valid" || echo "❌ Type invalid"

# Scope and title validation
[[ "$BRANCH_NAME" =~ ^[a-z0-9]+/[a-z0-9][a-z0-9-]{0,48}[a-z0-9]-[a-z0-9][a-z0-9-]+[a-z0-9]$ ]] && echo "✅ Scope/title valid" || echo "❌ Scope/title invalid"

# Forbidden prefix check
[[ ! "$BRANCH_NAME" =~ ^(claude|copilot|openai)/ ]] && echo "✅ No forbidden prefixes" || echo "❌ Forbidden"
```

---

## Phase 1 Complete

Quickstart guide for branch naming validation and PR template routing.
