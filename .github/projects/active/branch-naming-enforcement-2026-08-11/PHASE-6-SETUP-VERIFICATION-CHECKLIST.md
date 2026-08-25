# Phase 6 Setup Verification Checklist

**Deadline:** August 18, 2026 (before 18:00 UTC)  
**Target:** 100% team completion before Aug 19 enforcement go-live

---

## Instructions

1. **Complete all items below** for your local environment
2. **Reply with your completion status** in the Phase 6 announcement thread
3. **Report any issues** to @governance-team

---

## Setup Verification Checklist

### Step 1: Understand the Branch Format

**Required Format:** `{type}/{scope}-{short-title}`

**Examples of VALID branches:**
- ✅ `feat/user-authentication-system`
- ✅ `fix/login-timeout-issue`
- ✅ `chore/update-dependencies`
- ✅ `docs/api-documentation`
- ✅ `refactor/database-query-optimization`

**Examples of INVALID branches:**
- ❌ `my-feature` (missing type prefix)
- ❌ `Feature/MyFeature` (uppercase not allowed)
- ❌ `feat/my_feature` (underscores not allowed)
- ❌ `feat_my_feature` (missing slash separator)
- ❌ `feature/my-feature` (invalid type; should be `feat`)

**Allowed Type Prefixes:**
feat, fix, hotfix, release, refactor, chore, docs, test, perf, ci, build, deps, security, revert, research, design, a11y, ux, i18n, ops, proto, ds, api, schema, telemetry, content, seo, config, migrate, qa, uat, audit, codex

---

### Step 2: Install the Pre-Commit Hook (Recommended)

This hook runs before commits and warns about invalid branch names during the grace period. **Optional but recommended.**

```bash
# Install the hook
npm run setup:hooks

# Verify hook installation
cat .git/hooks/pre-commit
```

**Expected Output:** Hook script installed and executable

- [ ] Hook installed successfully
- [ ] Hook is executable (`ls -la .git/hooks/pre-commit` shows `x`)

---

### Step 3: Test the Pre-Commit Hook (If Installed)

Create a temporary invalid branch to verify the hook works:

```bash
# Create invalid branch name
git checkout -b invalid-branch-name

# Try to commit (hook should warn/block depending on phase)
git commit --allow-empty -m "test: branch validation"

# During grace period (Aug 12-18): Hook warns but doesn't block
# After Aug 19: Hook blocks commit

# Clean up
git checkout -
git branch -D invalid-branch-name
```

- [ ] Hook ran and displayed validation message
- [ ] Grace period behavior confirmed (warning, not blocking)

---

### Step 4: Verify Valid Branch Names Work

Test that correctly-named branches pass the hook:

```bash
# Create valid branch name
git checkout -b feat/test-feature

# Try to commit (should succeed)
git commit --allow-empty -m "test: verify valid branch"

# Verify branch is created
git branch -v

# Clean up
git checkout develop
git branch -D feat/test-feature
```

- [ ] Valid branch created successfully
- [ ] Commit allowed on valid branch
- [ ] Hook accepted the branch format

---

### Step 5: Rename Any Existing Invalid Branches

Check if you have any existing branches with invalid names (created before Phase 6):

```bash
# List all local branches
git branch -a

# Rename invalid branches to valid format
git branch -m old-branch-name feat/new-branch-name

# Verify rename
git branch -a
```

**Examples:**
- `my-feature` → `feat/my-feature`
- `bug-fix` → `fix/bug-fix`
- `CLEANUP` → `chore/cleanup`

- [ ] All local branches checked
- [ ] Invalid branches renamed to valid format
- [ ] Remote branches also renamed (if you created them)

---

### Step 6: Acknowledge and Confirm Setup

**Team Member Information:**
- Name: _______________
- GitHub Username: _______________
- Completed on (date): _______________

**Acknowledgement:**

I confirm that I have:
- [ ] Read and understood the branch naming requirements ({type}/{scope}-{short-title})
- [ ] Installed the optional pre-commit hook (if desired)
- [ ] Tested the hook with valid and invalid branch names
- [ ] Verified existing branches follow the new naming format
- [ ] Am ready for enforcement go-live on August 19, 2026

**Signature/Confirmation:** _________________

---

## Support & Questions

**If you encounter issues:**

1. **Hook not running?** 
   - Verify hook is executable: `ls -la .git/hooks/pre-commit`
   - Check hook script: `cat .git/hooks/pre-commit`
   - Reinstall if needed: `npm run setup:hooks`

2. **Can't rename branches?**
   - Use: `git branch -m old-name new-name`
   - For remote branches, push the renamed version and delete the old one

3. **Questions about branch format?**
   - Review allowed type prefixes above
   - Ask in the Phase 6 announcement thread
   - DM @governance-team

---

## Completion Status

**Reply in the announcement thread with:**

```
✅ Phase 6 Setup Complete
- [x] Hook installed and tested
- [x] Valid/invalid branches verified
- [x] Existing branches renamed (if needed)
- [x] Ready for enforcement on Aug 19

GitHub Username: @your-username
```

**Deadline:** August 18, 2026 (before 18:00 UTC)
