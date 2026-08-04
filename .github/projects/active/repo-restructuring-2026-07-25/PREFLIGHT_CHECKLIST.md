# Pre-flight Checklist

## Repository Restructuring — Phase 0

**Date Initiated:** 2026-07-26  
**Initiated By:** Ash Shaw  
**Status:** Pending Execution

---

## ✅ Environment Validation

### Node.js Version Check

Verify Node.js is v18 or later (required for modern JavaScript features in validation scripts).

**Command:**

```bash
node --version
```

**Expected Output:** `v18.0.0` or higher  
**Result:**

```
[ ] PASS — Version: _______________
[ ] FAIL — Version too old, please upgrade to v18+
```

---

### npm Version Check

Verify npm is v9 or later (required for workspace and dependency management).

**Command:**

```bash
npm --version
```

**Expected Output:** `9.0.0` or higher  
**Result:**

```
[ ] PASS — Version: _______________
[ ] FAIL — Version too old, please upgrade to v9+
```

---

### Git Version Check

Verify Git is v2 or later (required for proper branch operations and tagging).

**Command:**

```bash
git --version
```

**Expected Output:** `git version 2.0.0` or higher  
**Result:**

```
[ ] PASS — Version: _______________
[ ] FAIL — Version too old, please upgrade to v2+
```

---

### Current Branch Verification

Verify you are on the correct working branch (not `main` or `develop`).

**Command:**

```bash
git branch --show-current
```

**Expected Output:** `pr-merge-request-bc86aa` or similar feature branch  
**Result:**

```
[ ] PASS — Current branch: _______________
[ ] FAIL — You are on main or develop; please switch to a feature branch
```

---

## ✅ Repository Integrity

### Repository Status Check

Verify the working tree is clean (no uncommitted changes).

**Command:**

```bash
git status
```

**Expected Output:**

```
On branch [branch-name]
Your branch is up to date with 'origin/[branch-name]'.

nothing to commit, working tree clean
```

**Result:**

```
[ ] PASS — No uncommitted changes
[ ] FAIL — Please commit or stash uncommitted changes before proceeding
    Changes detected: _________________________________________
```

---

### Recent Commit Verification

Verify recent commits are as expected.

**Command:**

```bash
git log --oneline -5
```

**Expected Output:**

```
[5 most recent commits, no unexpected changes]
```

**Result:**

```
[ ] PASS — Recent history looks correct
[ ] FAIL — Unexpected commits detected; please review
```

---

## ✅ Existing Test Suites

### Install Dependencies

Install all project dependencies (required for test execution).

**Command:**

```bash
npm ci
```

**Expected Output:**

```
added [X] packages in [Y]s
```

**Result:**

```
[ ] PASS — All dependencies installed successfully
[ ] FAIL — Dependency installation failed; see error above
    Error: ___________________________________________________
```

---

### Run All Tests

Run the complete test suite to ensure baseline functionality.

**Command:**

```bash
npm test
```

**Expected Output:**

```
[X passed, 0 failed]
```

**Result:**

```
[ ] PASS — All tests passed
    Tests Passed: _____________ / _____________
    Tests Failed: _____________ / _____________
[ ] FAIL — Some tests failed; please investigate
    Failed Tests: _________________________________________________
    Issue Summary: ________________________________________________
```

---

## ✅ Validation Scripts

### Validate Frontmatter

Verify frontmatter validation script runs without errors.

**Command:**

```bash
npm run validate:frontmatter
```

**Expected Output:**

```
Validation passed: [X] files checked, 0 errors
```

**Result:**

```
[ ] PASS — Frontmatter validation successful
    Files Checked: _____________ 
    Errors Found: _____________
[ ] FAIL — Frontmatter validation failed
    Error Summary: _________________________________________________
```

---

### Validate Branch Names

Verify branch naming validation script runs without errors.

**Command:**

```bash
npm run validate:branch-name -- --branch $(git branch --show-current)
```

**Expected Output:**

```
✓ Branch name is valid
```

**Result:**

```
[ ] PASS — Branch name validation successful
[ ] FAIL — Branch name is invalid
    Issue: ___________________________________________________
    Fix: Run: git branch -m <old-name> <new-name>
```

---

### Validate Agents (if applicable)

Verify agent validation script runs without errors.

**Command:**

```bash
npm run validate:agents
```

**Expected Output:**

```
Validation passed: [X] agents checked, 0 errors
```

**Result:**

```
[ ] PASS — Agent validation successful
    Agents Checked: _____________ 
    Errors Found: _____________
[ ] FAIL — Agent validation failed
    Error Summary: _________________________________________________
```

---

### Lint Markdown Files

Verify Markdown linting passes.

**Command:**

```bash
npm run lint:md
```

**Expected Output:**

```
All files are good
```

**Result:**

```
[ ] PASS — Markdown linting passed
[ ] FAIL — Markdown linting failed
    Files with Issues: ____________________________________________
    Issue Details: ________________________________________________
```

---

### Lint JavaScript/TypeScript Files

Verify JavaScript/TypeScript linting passes.

**Command:**

```bash
npm run lint:js
```

**Expected Output:**

```
0 errors and 0 warnings
```

**Result:**

```
[ ] PASS — JS/TS linting passed
[ ] FAIL — JS/TS linting failed
    Files with Issues: ____________________________________________
    Issue Details: ________________________________________________
```

---

## ✅ Backup Protocol

### Create Backup Tag

Create a Git tag to mark this pre-restructure state. **DO NOT skip this step** — it provides a safety net if anything goes wrong.

**Command:**

```bash
git tag backup/pre-restructure-2026-07-26 --message "Backup before repository restructuring on 2026-07-26"
```

**Expected Output:**

```
[No output on success]
```

**Result:**

```
[ ] PASS — Backup tag created locally
```

---

### Verify Backup Tag Created

Verify the tag was created successfully.

**Command:**

```bash
git tag --list | grep backup/pre-restructure
```

**Expected Output:**

```
backup/pre-restructure-2026-07-26
```

**Result:**

```
[ ] PASS — Backup tag verified: backup/pre-restructure-2026-07-26
[ ] FAIL — Backup tag not found; please re-create
```

---

### Push Backup Tag to Remote

Push the backup tag to the remote repository for safety.

**Command:**

```bash
git push origin backup/pre-restructure-2026-07-26
```

**Expected Output:**

```
* [new tag]         backup/pre-restructure-2026-07-26 -> backup/pre-restructure-2026-07-26
```

**Result:**

```
[ ] PASS — Backup tag pushed to remote successfully
[ ] FAIL — Failed to push backup tag
    Error: ___________________________________________________
```

---

## ✅ Readiness Confirmation

### Summary of Validation Results

**All environment checks:** [ ] PASS [ ] FAIL  
**All repository integrity checks:** [ ] PASS [ ] FAIL  
**All test suites:** [ ] PASS [ ] FAIL  
**All validation scripts:** [ ] PASS [ ] FAIL  
**Backup created & pushed:** [ ] YES [ ] NO  

---

### Issues Found (if any)

List any issues discovered during validation that need resolution before proceeding:

1. Issue: ____________________________________________________________
2. Issue: ____________________________________________________________
3. Issue: ____________________________________________________________

**Resolution Status:**

- [ ] All issues resolved
- [ ] Issues pending (describe):
  Details: ___________________________________________________________

---

### Pre-flight Sign-Off

**I certify that:**

- [ ] I have reviewed the SPECIFICATION.md document and understand the project goals and approach
- [ ] I have run all environment validation checks and they pass
- [ ] I have verified the repository is in a clean state (no uncommitted changes)
- [ ] I have run all test suites and validation scripts — all passed
- [ ] I have created a backup tag and pushed it to the remote repository
- [ ] I understand the risks and reversibility of Phase 1 (folder moves)
- [ ] I am ready to proceed to Phase 1.A (manual folder moves via Finder)

**Signed By:** Ash Shaw  
**Date:** ___________________________  
**Time:** ___________________________  

---

### Ready to Proceed?

**Status:** [ ] READY FOR PHASE 1.A [ ] NOT READY — ISSUES PENDING

**If not ready, describe blocking issues:**

Blocking issues: ____________________________________________________

**If ready, next step:** Execute Phase 1.A — Manual folder moves via macOS Finder

**Estimated timeline for Phase 1.A:** 1–2 hours (manual Finder operations)

---

## Troubleshooting

### Common Issues & Resolutions

#### Issue: `npm ci` fails with permission error

**Resolution:**

1. Verify ownership: `ls -ld ~/Studio/LightSpeedWP.Agency/.github`
2. Fix if needed: `sudo chown -R $(whoami) ~/Studio/LightSpeedWP.Agency/.github`
3. Retry: `npm ci`

#### Issue: Tests fail with unexpected errors

**Resolution:**

1. Run tests with verbose output: `npm test -- --verbose`
2. Check for stale dependencies: `npm clean-install`
3. Check for missing environment variables: `env | grep -i test`
4. If issue persists, commit your changes and investigate on a fresh clone

#### Issue: Validation scripts missing or not found

**Resolution:**

1. Verify scripts exist: `ls -la .github/scripts/validate-*.js`
2. Verify npm scripts are defined: `npm run | grep validate`
3. If missing, check recent commits: `git log --oneline -- .github/scripts/`

#### Issue: Git tag creation fails

**Resolution:**

1. Verify tag doesn't already exist: `git tag --list | grep backup`
2. If it exists, delete and recreate: `git tag -d backup/pre-restructure-2026-07-26`
3. Retry tag creation: `git tag backup/pre-restructure-2026-07-26 --message "..."`

#### Issue: Branch name validation fails

**Resolution:**

1. Check current branch name: `git branch --show-current`
2. Verify it matches the pattern: `{type}/{scope}-{short-title}`
3. Rename if needed: `git branch -m <new-name>`
4. Retry validation

---

## References

- [SPECIFICATION.md](./SPECIFICATION.md) — Project specification and architecture
- [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md) — Branch naming and protection rules
- [DETAILED-RESTRUCTURING-PLAN-FINAL.md](./DETAILED-RESTRUCTURING-PLAN-FINAL.md) — Full implementation plan

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-26  
**Status:** Phase 0 — Awaiting Execution
