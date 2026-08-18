---
title: Day 3 — Blocker Diagnosis & Fix
description: Diagnose and fix checks.yml failures preventing Node.js 22 sign-off
created_date: 2026-08-04
---

# Day 3: Blocker Diagnosis & Infrastructure Fix

**Objective:** Diagnose and fix checks.yml failures to unblock Node.js 22 post-merge monitoring sign-off.

## Quick Status

**Current Blocker:** checks.yml workflow failing on develop  
**Impact:** Cannot proceed with Day 3 sign-off; blocks release workflow testing  
**Target:** All checks.yml jobs passing on develop (lint, test, validate)

## Diagnosis Steps

### 1. Check Recent Workflow Failures

```bash
# List last 5 checks.yml runs
gh run list --workflow=checks.yml --limit=5 --json number,status,conclusion,updatedAt

# View detailed logs of most recent failure
gh run view <RUN_NUMBER> --log | tail -200
```

**Expected findings:**

- Lint failures (ESLint, Markdown, JSON validation)
- Test failures (Jest/Mocha test count or exit code)
- Validation failures (branch name, footers, frontmatter, issue fields)

### 2. Local Test Execution (Node 22)

```bash
node -v  # Verify v22.x.x
npm ci
npm run lint:all
npm run test
npm run validate:frontmatter:changed
```

**Success criteria:**

- ESLint: 0 errors
- Markdown lint: 0 errors
- Tests: ≥822 passing, exit 0
- Validation: all pass

### 3. Branch-Specific Checks

```bash
# Check branch name format
git branch --show-current
# Expected: chore/nodejs-22-day-3-blocker (no claude/ prefix)

# Validate branch name format
npm run validate:branch-name

# Check for stale references
git log --oneline -5
```

## Common Fixes

### Fix A: ESLint / Code Style Issues

**Symptom:** lint job fails with "X errors"

**Fix:**

```bash
npm run format
git add .
git commit -m "fix(lint): resolve code style issues"
```

**Validate:**

```bash
npm run lint:js
npm run lint:md
```

### Fix B: Test Failures

**Symptom:** test job fails; <822 tests or exit ≠ 0

**Investigation:**

```bash
npm test -- --verbose 2>&1 | tail -50  # See which tests fail
npm test -- --coverage  # Check coverage gaps
```

**Common causes:**

- Node 22 incompatibility in test setup
- Missing dependencies (run `npm ci` again)
- Stale .nvmrc file (should specify Node 22 or lts/*)

**Fix:**

```bash
cat .nvmrc  # Check Node version
npm ci
npm test
```

### Fix C: Validation Failures (branch name, footers, frontmatter)

**Symptom:** validate job fails on branch name, footers, or frontmatter

**For branch name:**

```bash
npm run validate:branch-name
# If fails: Rename branch to match {type}/{scope}-{short-title}
```

**For footers (missing Co-Authored-By):**

```bash
git log -1 --format=%B
# Should end with: Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>

# If missing, amend:
git commit --amend --no-edit
# (Add footer during edit)
```

**For frontmatter (YAML validation):**

```bash
npm run validate:frontmatter:changed -- --base develop --head HEAD
# Review output for invalid frontmatter fields
# Fix YAML in affected files
```

### Fix D: paths-ignore Configuration

**Symptom:** checks.yml triggering on `.github/projects/**` or `.github/reports/**` changes

**Check:**

```bash
git diff develop..HEAD --name-only | grep -E "\.github/(projects|reports|tmp)/"
```

**If found:** These should NOT trigger checks.yml. Verify paths-ignore in .github/workflows/checks.yml (lines 6-9).

## Full Diagnosis Workflow

Run in order:

```bash
# Step 1: Verify branch name
echo "Current branch: $(git branch --show-current)"

# Step 2: Check Node version
node -v
npm -v

# Step 3: Install dependencies
npm ci

# Step 4: Run all checks locally
echo "=== LINTING ===" && npm run lint:all
echo "=== TESTING ===" && npm test
echo "=== VALIDATION ===" && npm run validate:branch-name

# Step 5: Check for uncommitted issues
git status

# Step 6: Check recent commits
git log --oneline -5
```

## When to Escalate

**Escalate if:**

- Node 22 incompatibility in dependencies (e.g., native modules failing)
- Multiple validation rules conflicting
- Test failures in code unrelated to Node.js upgrade
- GitHub Actions setup issues (e.g., actions/setup-node@v7 incompatibility)

**Escalation path:**

```bash
gh issue create \
  --title "Day 3 Blocker: checks.yml validation failures — Node.js 22" \
  --label=type:investigation \
  --label=area:infrastructure \
  --label=priority:high \
  --body "## Blocker Analysis

**Failing job(s):** [lint/test/validate]

**Error evidence:**
\`\`\`
[Paste workflow log]
\`\`\`

**Attempted fixes:**
- [List fixes tried]

**Next steps:**
- [Proposed escalation]

**Related:** #1432 (Node.js 22 upgrade epic)"
```

## Success Criteria

All of the following must be true to proceed with Day 3 sign-off:

- ✅ Branch renamed to follow convention (no claude/ prefix)
- ✅ Local npm test: exit 0, ≥822 tests passing
- ✅ Local npm run lint:all: 0 errors
- ✅ Local npm run validate:branch-name: passes
- ✅ checks.yml latest run on develop: all jobs pass (lint, test, validate, all-checks)
- ✅ No Node 22 version-related issues in error logs
- ✅ .nvmrc or Node setup uses v22 or lts/* without issues

---

**Project Status:** Diagnostics in progress  
**Target:** Unblock Day 3 sign-off by fixing checks.yml failures
