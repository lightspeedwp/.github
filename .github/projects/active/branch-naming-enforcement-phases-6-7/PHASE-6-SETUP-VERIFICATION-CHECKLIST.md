---
name: phase-6-setup-verification
description: Team setup verification checklist for branch naming enforcement hook installation
---

# Phase 6 — Setup Verification Checklist

## Team Member Verification Steps

Follow these steps to verify your environment is set up correctly:

### Step 1: Install Hook

```bash
npm run setup:hooks
```

**Expected output:**
```
✓ .husky/pre-commit hook installed
✓ Branch validation enabled
```

**If this fails:** See [TROUBLESHOOTING.md](./BRANCH_VALIDATION_TROUBLESHOOTING.md)

---

### Step 2: Verify Hook Works

Try creating a branch with an **invalid** name:

```bash
git checkout -b invalid-branch-name
```

**Expected behavior:** Pre-commit hook should **block** the creation with error:

```
❌ Branch Name Validation Failed
Branch 'invalid-branch-name' does not follow the format: {type}/{scope}-{short-title}
```

If you see this error, your hook is working! ✅

---

### Step 3: Create Valid Branch

Now create a branch with a **valid** name:

```bash
git checkout -b feat/test-branch-naming
```

**Expected behavior:** Branch creation succeeds ✅

---

## Team Verification Status

| Team Member | Status | Hook Installed | Test Passed | Approved By |
|---|---|---|---|---|
| [Name] | ✅ | ✅ | ✅ | Date |
| [Name] | 🔄 In Progress | | | |
| [Name] | ❌ Blocked | | | See notes |

---

## Troubleshooting Quick Links

- **Hook not installing?** → [Install Issues](./BRANCH_VALIDATION_TROUBLESHOOTING.md#installation-fails)
- **Invalid branch still created?** → [Hook Not Running](./BRANCH_VALIDATION_TROUBLESHOOTING.md#hook-not-executing)
- **Husky/Node issues?** → [Environment Issues](./BRANCH_VALIDATION_TROUBLESHOOTING.md#environment-problems)

---

## When All Team Members Are Verified

Once 80%+ of team confirms:
1. ✅ Hook installed successfully
2. ✅ Test branch validation works
3. ✅ Valid branch creation succeeds

**Phase 6 is complete** → Move to **Phase 7 (Metrics & Monitoring)**
