# Implementation Plan: Copilot Branch Naming Enforcement

**Date:** 2026-09-03  
**Goal:** Close the gap between GitHub Copilot and your existing branch naming strategy

---

## Overview

Your repository has robust **post-PR validation** but lacks **pre-session enforcement** for Copilot. This plan adds three layers:

1. **Copilot App Config** — Enforce naming at session creation
2. **Pre-Commit Hook** — Catch invalid branches locally
3. **npm Script** — Quick validation command for developers

---

## Step 1: Create `.github/github-app.yml`

**Purpose:** Configure GitHub Copilot App to enforce branch naming rules

**File Location:** `.github/github-app.yml` (new)

```yaml
name: "lightspeedwp/.github"
version: "1.0"

# Branch naming enforcement for Copilot-created sessions
branchNaming:
  # Regex pattern enforcing: {type}/{scope}-{title}
  # Matches 34 allowed types and kebab-case naming
  pattern: "^(feat|fix|hotfix|release|refactor|chore|docs|test|perf|ci|build|deps|security|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|audit|codex|revert|research)/[a-z0-9]+(?:-[a-z0-9]+)*$"
  
  # Disallow these prefixes (reserved for internal use)
  forbiddenPrefixes:
    - "claude/"
    - "copilot/"
    - "openai/"
  
  # Enforce on new Copilot sessions
  enforceOnSessionCreate: true
  
  # Custom error message
  errorMessage: |
    ❌ Branch name does not match LightSpeed branching strategy.
    
    Required format: {type}/{scope}-{title}
    
    **Allowed types (34 total):**
    feat, fix, hotfix, release, refactor, chore, docs, test, perf, ci, build, deps, 
    security, design, a11y, ux, i18n, ops, proto, ds, api, schema, telemetry, content, 
    seo, config, migrate, qa, uat, audit, codex, revert, research
    
    **Examples:**
    ✅ feat/user-authentication-module
    ✅ fix/login-validation-bug
    ✅ docs/branching-strategy-update
    
    ❌ claude/my-feature (forbidden prefix)
    ❌ Feature/MyBranch (uppercase not allowed)
    ❌ feat/my_feature (underscores not allowed)
    
    **Learn more:** https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md

# Validation settings
validation:
  # Show validation result in session creation summary
  showValidationResult: true
  
  # Block session creation for invalid branch names (strict mode)
  blockOnInvalidName: true
```

**Validation:** 
- ✅ Pattern matches all 34 allowed types
- ✅ Rejects `claude/`, `copilot/`, `openai/` prefixes
- ✅ Enforces kebab-case (no underscores or uppercase)
- ✅ Clear error message with examples

---

## Step 2: Add Pre-Commit Hook for Branch Validation

**Purpose:** Catch invalid branch names before commit (local feedback)

**File Location:** `.husky/prepare-commit-msg` (new)

```bash
#!/usr/bin/env sh
#
# Pre-commit hook: Validate branch name early
# Runs BEFORE commit message is processed
#
# Gives developers immediate feedback if they're on an invalid branch
# Does not block commit (only informational), but will fail on CI/PR
#

# Set strict error handling
set -e

# Color codes for terminal output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Get current branch name
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")

if [ -z "$BRANCH_NAME" ]; then
  exit 0
fi

# Skip validation for protected and bot branches
if [ "$BRANCH_NAME" = "main" ] || [ "$BRANCH_NAME" = "develop" ]; then
  exit 0
fi

if echo "$BRANCH_NAME" | grep -qE "^(dependabot|renovate)/"; then
  exit 0
fi

# Run validation script
if ! node scripts/validation/validate-branch-name.cjs "$BRANCH_NAME" 2>/dev/null; then
  echo ""
  echo "${YELLOW}⚠️  Branch name warning:${NC}"
  echo ""
  node scripts/validation/validate-branch-name.cjs "$BRANCH_NAME" || true
  echo ""
  echo "${YELLOW}This commit will proceed, but the PR will fail validation.${NC}"
  echo "${GREEN}Run 'npm run validate:branch' to check your branch name.${NC}"
  echo ""
fi

exit 0
```

**Behavior:**
- ✅ Runs before commit message editor
- ✅ Gives immediate feedback (non-blocking)
- ⚠️ Warns but allows local commits (blocked at PR stage)
- ✅ Suggests `npm run validate:branch` command

---

## Step 3: Add npm Script for Manual Validation

**Purpose:** Provide quick command for developers to validate branch names

**File Location:** `package.json` (update existing)

**Change:** Add to `"scripts"` section:

```json
{
  "scripts": {
    "validate:branch": "node scripts/validation/validate-branch-name.cjs --verbose",
    "validate:branch:show-pattern": "node scripts/validation/validate-branch-name.cjs --show-pattern"
  }
}
```

**Usage:**
```bash
# Validate current branch
npm run validate:branch

# Show all allowed patterns
npm run validate:branch:show-pattern

# Validate specific branch (from script)
node scripts/validation/validate-branch-name.cjs feat/my-feature
```

---

## Step 4: Enhance Branch Validator with Forbidden Prefix Check

**Purpose:** Explicitly reject reserved prefixes as hard failure

**File Location:** `scripts/validation/validate-branch-name.cjs` (update existing)

**Change:** Add forbidden prefix check before regex validation

**Line ~92, in `validateBranchName()` function, add:**

```javascript
// Forbidden prefixes reserved for internal use
const FORBIDDEN_PREFIXES = new Set(['claude', 'copilot', 'openai']);

// Get the type (first part before '/')
const branchType = branchName.split('/')[0];
if (FORBIDDEN_PREFIXES.has(branchType)) {
  const message = [
    `❌ Branch type '${branchType}/' is not allowed (reserved for internal use).`,
    '',
    'This branch name will be rejected. Please rename your branch:',
    '',
    `  git branch -m ${branchName} feat/my-feature-name`,
    '',
    'For allowed types and more details, see: docs/BRANCHING_STRATEGY.md',
  ].join('\n');
  return { valid: false, message };
}
```

---

## Step 5: Update Documentation

**File Location:** `.github/custom-instructions.md` (update existing)

**Add Section:** Copilot Session Guidelines

```markdown
## Copilot Sessions & Branch Naming

When creating a new Copilot session in this repository:

1. **Automatic Validation:** Your session will validate branch names at creation.
2. **Required Format:** `{type}/{scope}-{title}` (e.g., `feat/user-auth-module`)
3. **Forbidden Prefixes:** Never use `claude/`, `copilot/`, or `openai/` — these are reserved.

### Validate Your Branch Locally

Before pushing:
```bash
npm run validate:branch
```

### Allowed Branch Types (34 total)

feat, fix, hotfix, release, refactor, chore, docs, test, perf, ci, build, deps, 
security, design, a11y, ux, i18n, ops, proto, ds, api, schema, telemetry, content, 
seo, config, migrate, qa, uat, audit, codex, revert, research

### Examples

✅ **Valid:**
- `feat/user-authentication-module`
- `fix/login-validation-bug`
- `docs/branching-strategy-update`
- `hotfix/critical-security-patch`

❌ **Invalid:**
- `claude/my-feature` — forbidden prefix
- `Feature/MyBranch` — uppercase not allowed
- `feat/my_feature` — underscores not allowed
- `feat/MyFeature` — uppercase not allowed

### More Information

- **Strategy Guide:** [docs/BRANCHING_STRATEGY.md](docs/BRANCHING_STRATEGY.md)
- **Validation Script:** `npm run validate:branch --verbose`
```

---

## Step 6: Add Tests for Forbidden Prefixes

**File Location:** `scripts/validation/__tests__/validate-branch-name.test.cjs` (update existing)

**Add Test Cases:**

```javascript
describe('Forbidden Prefixes', () => {
  it('should reject claude/ prefix', () => {
    const result = validateBranchName('claude/my-feature');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('reserved for internal use');
  });

  it('should reject copilot/ prefix', () => {
    const result = validateBranchName('copilot/my-feature');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('reserved for internal use');
  });

  it('should reject openai/ prefix', () => {
    const result = validateBranchName('openai/my-feature');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('reserved for internal use');
  });
});
```

---

## Step 7: Integration Testing

**Test Scenarios:**

1. **Local Validation**
   ```bash
   npm run validate:branch  # Should show current branch status
   node scripts/validation/validate-branch-name.cjs feat/test-feature  # Should pass
   node scripts/validation/validate-branch-name.cjs claude/test  # Should fail
   ```

2. **Pre-Commit Hook**
   ```bash
   git checkout -b claude/test-branch
   git add .
   git commit -m "test"  # Should warn in output
   ```

3. **Copilot Session**
   - Create new session with valid branch name → should accept
   - Manually test if github-app.yml is read → check Copilot logs

4. **Workflow Validation**
   ```bash
   git push origin feat/my-feature
   # PR triggers branch-name-validation.yml
   # Check ✅ or ❌ result
   ```

---

## Deployment Checklist

### Before Commit
- [ ] `.github/github-app.yml` created with correct pattern and forbidden prefixes
- [ ] `.husky/prepare-commit-msg` created with validation logic
- [ ] `package.json` updated with new npm scripts
- [ ] `scripts/validation/validate-branch-name.cjs` updated with forbidden prefix check
- [ ] `.github/custom-instructions.md` updated with Copilot guidelines
- [ ] Tests added for forbidden prefixes
- [ ] All tests passing: `npm test`

### Before Merge
- [ ] PR description explains changes and intent
- [ ] Links to docs/BRANCHING_STRATEGY.md
- [ ] Manual testing completed (see "Integration Testing" above)
- [ ] Workflow validation passes
- [ ] At least one approval from code owner

### After Merge
- [ ] Update CHANGELOG.md with enforcement changes
- [ ] Consider posting team announcement about new Copilot session guidelines
- [ ] Monitor PR validation workflow for any edge cases

---

## Files to Create/Modify

| File | Action | Priority |
|------|--------|----------|
| `.github/github-app.yml` | **Create** | 🔴 High |
| `.husky/prepare-commit-msg` | **Create** | 🟡 Medium |
| `package.json` | **Modify** (add scripts) | 🟡 Medium |
| `scripts/validation/validate-branch-name.cjs` | **Modify** (add forbidden check) | 🟡 Medium |
| `.github/custom-instructions.md` | **Modify** (add section) | 🟡 Medium |
| `scripts/validation/__tests__/validate-branch-name.test.cjs` | **Modify** (add tests) | 🟢 Low |

---

## Timeline

- **Hour 1:** Create `.github/github-app.yml` and test
- **Hour 2:** Add pre-commit hook and npm script
- **Hour 3:** Update validator and tests
- **Hour 4:** Update documentation and manual testing
- **Total:** ~4 hours

---

## Success Criteria

✅ **When done, verify:**
1. Copilot respects branch naming pattern on session creation
2. Pre-commit hook warns about invalid branch names
3. `npm run validate:branch` returns valid result for your branch
4. Workflow validation still works on PR (no regression)
5. All tests pass
6. Documentation is clear and up-to-date

---

*Implementation prepared by the 🤖 LightSpeedWP Automation Team*
