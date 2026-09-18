# Branch Naming Enforcement Audit
**Date:** 2026-09-03  
**Repository:** lightspeedwp/.github  
**Scope:** GitHub Workflows, Husky Hooks, and Branch Validation Infrastructure

---

## Executive Summary

Your repository has **comprehensive, multi-layered branch naming enforcement** in place:

✅ **GitHub Workflows** (post-commit, on PR creation)  
✅ **Husky Hooks** (pre-commit)  
✅ **Validation Scripts** (reusable, testable)  
✅ **Special Rules** (release/hotfix on main, bot exemptions)  
✅ **Clear Documentation** (BRANCHING_STRATEGY.md)  

**Gap:** ⚠️ **Copilot App Integration** — No `.github/github-app.yml` to enforce naming at session creation.

---

## 1. Workflow Infrastructure (Post-Commit Enforcement)

### 1.1 Branch Name Validation Workflow
**File:** `.github/workflows/branch-name-validation.yml`

**Trigger:** Pull request opened, reopened, or pushed  
**Scope:** All branches except `release/*`, `hotfix/*` (on main), and bot branches  

**Enforcement Points:**
1. **Validation Script** — Runs `scripts/validation/validate-branch-name.cjs`
2. **Check Run** — Creates/updates a GitHub check with ✅ or ❌ status
3. **PR Comment** — Posts detailed error with format guide and examples
4. **Exit Status** — Blocks PR merge if validation fails (protected branch rule)

**Exemptions:**
- `release/*` and `hotfix/*` on `main` branch
- `dependabot/*` and `renovate/*` branches (automated PRs)
- Bot authors: `dependabot[bot]`, `app/dependabot`, `renovate[bot]`, `app/renovate`

**Error Message Quality:** ⭐ Excellent
- Shows required format
- Lists all 34 allowed types
- Provides valid and invalid examples
- Links to documentation

### 1.2 Main Branch Guard Workflow
**File:** `.github/workflows/main-branch-guard.yml`

**Trigger:** PR targeting `main` branch  
**Validation:** Ensures only `release/*` and `hotfix/*` branches target `main`

**Script:** `scripts/workflows/branch-policy/validate-main-branch-pr.cjs`

### 1.3 PR Template Resolver Workflow
**File:** `.github/workflows/pr-template-resolver.yml`

**Trigger:** PR opened/synchronized on branches matching `claude/*` or `copilot/*`

**Purpose:** Detects and handles special branch prefixes  
**Mapping:** Branch type → PR template (e.g., `feat/` → `pr_feature.md`)

⚠️ **Note:** This catches invalid prefixes but doesn't prevent them—it works around them.

---

## 2. Local Enforcement (Pre-Commit / Husky)

### 2.1 Husky Hook Setup
**File:** `.husky/pre-commit`

```bash
#!/usr/bin/env sh
npx lint-staged
```

**Current Behavior:**
- ✅ Runs `lint-staged` (ESLint, Prettier, Markdownlint on staged files)
- ❌ **No branch name validation in pre-commit hook**

**Gap:** Users can commit locally to invalid branches; validation only happens on PR push.

### 2.2 Lint-Staged Configuration
**File:** `.lintstagedrc.cjs`

**Scope:** Lints staged files (JS, TS, MD, JSON, YAML)  
**Does NOT:** Validate branch names

---

## 3. Validation Scripts (Reusable Logic)

### 3.1 Main Branch Validator
**File:** `scripts/validation/validate-branch-name.cjs` (373 lines)

**Functionality:**
- **34 Allowed Types:** feat, fix, hotfix, release, refactor, chore, docs, test, perf, ci, build, deps, security, revert, research, design, a11y, ux, i18n, ops, proto, ds, api, schema, telemetry, content, seo, config, migrate, qa, uat, audit, codex
- **Regex Patterns:**
  - **Release SemVer:** `release/v1.2.3` or `release/1.2.3-beta`
  - **Release Standard:** `release/{scope}-{title}`
  - **Standard:** `{type}/{scope}-{title}` (all other types)
- **Exemptions:** main, develop, dependabot/*, renovate/*

**Usage:**
```bash
# CLI
node scripts/validation/validate-branch-name.cjs feat/my-feature
node scripts/validation/validate-branch-name.cjs --branch fix/bug --verbose
node scripts/validation/validate-branch-name.cjs --show-pattern

# Programmatic
const { validateBranchName } = require('./validate-branch-name.cjs');
const result = validateBranchName('feat/my-branch');
```

**Error Format:** Structured, user-friendly with examples and links to docs.

### 3.2 Main Branch Policy Validator
**File:** `scripts/workflows/branch-policy/validate-main-branch-pr.cjs`

**Purpose:** Ensures only `release/*` and `hotfix/*` can target `main`  
**Used By:** `main-branch-guard.yml`

---

## 4. Testing Infrastructure

### 4.1 Branch Name Validation Tests
**Files:**
- `scripts/validation/__tests__/validate-branch-name.test.cjs`
- `scripts/validation/__tests__/validate-branch-name.test.js`

**Coverage:** Allowed types, regex patterns, exemptions, error messaging

### 4.2 Main Branch Policy Tests
**File:** `scripts/workflows/branch-policy/__tests__/validate-main-branch-pr.test.js`

---

## 5. Documentation

### 5.1 BRANCHING_STRATEGY.md
**Location:** `docs/BRANCHING_STRATEGY.md`

**Sections:**
1. High-level rules
2. Branch protection settings
3. Branch naming convention (`{type}/{scope}-{title}`)
4. Core prefixes (feat, fix, hotfix, release, etc.)
5. Scope and title guidelines
6. Examples of valid/invalid names
7. Integration with GitHub automation

**Quality:** ⭐ Comprehensive and well-structured

### 5.2 Custom Instructions
**Files:**
- `.github/custom-instructions.md`
- `CLAUDE.md`
- `AGENTS.md`

**Coverage:** Branch naming rules, forbidden prefixes, validation command

---

## 6. Current State Assessment

### ✅ Strengths

| Area | Status | Notes |
|------|--------|-------|
| **Post-PR Validation** | ✅ Strong | Workflow blocks invalid names, posts helpful comment |
| **Branch Types** | ✅ Comprehensive | 34 allowed types cover all scenarios |
| **Special Cases** | ✅ Handled | Release/hotfix exemptions, bot branches |
| **Error Messages** | ✅ Excellent | Examples, links to docs, clear format |
| **Reusable Scripts** | ✅ Modular | .cjs exports for programmatic use |
| **Testing** | ✅ Present | Unit tests for validation logic |
| **Documentation** | ✅ Clear | BRANCHING_STRATEGY.md, custom instructions |

### ⚠️ Gaps & Improvement Opportunities

| Gap | Impact | Priority | Solution |
|-----|--------|----------|----------|
| **No pre-commit branch validation** | Allows invalid branches locally | Medium | Add husky hook for local validation |
| **No Copilot App config** | Copilot doesn't enforce naming at session creation | High | Create `.github/github-app.yml` |
| **PR Template Resolver catches but doesn't prevent** | Invalid branches still create PRs (just with wrong template) | Low | Could validate earlier in PR workflow |
| **No npm script for validation** | Users must know the script path | Low | Add `npm run validate:branch` |
| **Forbidden prefixes only in docs/comments** | Not enforced as hard rule in regex | Low | Add explicit rejection in validator |

---

## 7. Recommended Actions

### Immediate (High Priority)

**1. Create `.github/github-app.yml`**
```yaml
name: "lightspeedwp/.github"

branchNaming:
  pattern: "^(feat|fix|hotfix|release|refactor|chore|docs|test|perf|ci|build|deps|security|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|audit|codex|revert|research)/[a-z0-9]+([-][a-z0-9]+)*$"
  forbiddenPrefixes: ["claude/", "copilot/", "openai/"]
  enforceOnSessionCreate: true
```

**2. Add Pre-Commit Hook for Branch Validation**

Create `.husky/prepare-commit-msg` or update `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
# Validate branch name at commit time (early warning)
node scripts/validation/validate-branch-name.cjs --verbose
```

**3. Add npm Script**

In `package.json`:
```json
{
  "scripts": {
    "validate:branch": "node scripts/validation/validate-branch-name.cjs --verbose"
  }
}
```

### Short Term (Medium Priority)

**4. Enhance Error Message for Forbidden Prefixes**

Update `validate-branch-name.cjs` to explicitly reject `claude/`, `copilot/`, `openai/`:
```javascript
const FORBIDDEN_PREFIXES = new Set(['claude', 'copilot', 'openai']);
// Add check before regex validation
```

**5. Add Branch Validation to GitHub App Config**

Link Copilot's branch creation to your validation logic.

### Long Term (Low Priority)

**6. Extend PR Template Resolver**

Could trigger automated branch rename (with confirmation) instead of just routing template.

**7. Dashboard/Metrics**

Track branch naming compliance across all repos in org.

---

## 8. Integration Checklist

- [ ] Create `.github/github-app.yml` with branch naming rules
- [ ] Add `prepare-commit-msg` or update `.husky/pre-commit` for local validation
- [ ] Add `npm run validate:branch` script
- [ ] Update `.github/custom-instructions.md` with Copilot session guidance
- [ ] Test with a sample branch: `git checkout -b test/branch-enforcement`
- [ ] Document Copilot workflow in DEVELOPMENT.md
- [ ] Communicate changes to team via PR and/or docs update

---

## 9. Workflow Dependency Map

```
┌─ User Creates Branch (Local)
│  ├─ ⚠️ [GAP] No pre-commit validation
│  └─ Branch created: feat/my-feature
│
├─ User Pushes Branch
│  └─ GitHub receives push
│
├─ User Opens PR
│  ├─ ✅ branch-name-validation.yml triggers
│  ├─ Runs validate-branch-name.cjs
│  ├─ Posts check run result (✅ or ❌)
│  ├─ Posts PR comment (if ❌)
│  └─ [Blocks merge if branch protection requires this check]
│
├─ PR Template Routing
│  ├─ pr-template-resolver.yml checks for claude/* or copilot/*
│  ├─ Routes to appropriate template
│  └─ ⚠️ [Accepts invalid branch names; doesn't prevent]
│
└─ Main Branch Merge
   ├─ main-branch-guard.yml ensures only release/* or hotfix/*
   └─ ✅ Blocks non-release PRs targeting main
```

---

## 10. Files Reference

| Path | Type | Purpose | Lines |
|------|------|---------|-------|
| `.github/workflows/branch-name-validation.yml` | Workflow | Post-PR validation | 230 |
| `.github/workflows/main-branch-guard.yml` | Workflow | Main branch protection | 36 |
| `.github/workflows/pr-template-resolver.yml` | Workflow | Template routing | ~100 |
| `scripts/validation/validate-branch-name.cjs` | Script | Core validation logic | 373 |
| `scripts/workflows/branch-policy/validate-main-branch-pr.cjs` | Script | Main branch policy | ~80 |
| `scripts/validation/__tests__/validate-branch-name.test.cjs` | Test | Validation tests | ~200 |
| `docs/BRANCHING_STRATEGY.md` | Docs | Strategy guide | ~300 |
| `.husky/pre-commit` | Hook | Linting hook | 2 |
| `CLAUDE.md` | Docs | Claude instructions | ~400 |

**Total Enforcement Code:** ~1,400+ lines across workflows, scripts, and tests

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
