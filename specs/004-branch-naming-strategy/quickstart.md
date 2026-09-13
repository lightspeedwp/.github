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

### 24 Authorized Types

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat/dark-mode-support` |
| `fix` | Bug fix | `fix/auth-timeout-mobile` |
| `hotfix` | Urgent production fix | `hotfix/critical-security-patch` |
| `security` | Security vulnerability | `security/xss-vulnerability` |
| `perf` | Performance improvement | `perf/query-optimization` |
| `refactor` | Code refactoring | `refactor/api-response-structure` |
| `test` | Tests/test infrastructure | `test/integration-tests` |
| `docs` | Documentation | `docs/branching-guide` |
| `ci` | CI/CD pipelines | `ci/github-actions-workflow` |
| `chore`, `task`, `build`, `deps`, etc. | Maintenance tasks | See [spec.md](spec.md) |

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
# Pattern check
[[ "$BRANCH_NAME" =~ ^(feat|fix|docs|security|etc)/[a-z0-9-]+-[a-z0-9-]+$ ]] && echo "✅ Valid" || echo "❌ Invalid"

# Forbidden prefix check
[[ ! "$BRANCH_NAME" =~ ^(claude|copilot|openai)/ ]] && echo "✅ No forbidden prefixes" || echo "❌ Forbidden"
```

---

## Phase 1 Complete

Quickstart guide for branch naming validation and PR template routing.
