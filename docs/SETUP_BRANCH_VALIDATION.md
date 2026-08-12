---
file_type: documentation
title: Branch Validation Setup Guide
description: Installation and configuration guide for the LightSpeed branch naming validation system
last_updated: '2026-08-11'
owners:
  - LightSpeed Team
version: v1.0.0
status: active
stability: stable
domain: governance
tags:
  - branching
  - git
  - setup
  - hooks
  - validation
language: en
---

# Branch Validation Setup Guide

This guide walks you through installing and using the LightSpeed branch naming validation system.

## Overview

The validation system uses **two layers** to enforce branch naming conventions:

1. **Local Pre-Commit Hook** — Validates branch names before you commit (optional, recommended)
2. **GitHub Actions Workflow** — Blocks PR merge if branch name is invalid (mandatory)

Both layers enforce the same pattern: `{type}/{scope}-{title}` in strict lowercase kebab-case.

---

## Quick Start (2 minutes)

### For Local Development (Optional but Recommended)

```bash
npm run setup:hooks
```

That's it! The pre-commit hook is now installed in your local repository.

**Test it:**

```bash
# Try to commit on an invalid branch
git checkout -b my-invalid-branch
git commit --allow-empty -m "test"

# Output: ❌ Branch validation failed
```

### Remote Validation (Automatic)

When you open a pull request, GitHub Actions automatically validates your branch name. If invalid, your PR will have:

- ❌ Failed status check
- 💬 Comment with naming rules and examples
- 🔒 Blocked merge until fixed

---

## Installation Guide

### macOS & Linux

**Prerequisites:**

- Git 2.9+ (included with modern Git installations)
- Node.js 20+ (for running the validation script)
- npm 9+ (for running setup command)

**Steps:**

1. **Clone/open the repository:**

   ```bash
   cd ~/.github
   ```

2. **Run the setup command:**

   ```bash
   npm run setup:hooks
   ```

   **Output:**

   ```
   ✓ Installed pre-commit hook to .git/hooks/pre-commit
   ✓ Hook is executable

   ✅ Git hooks installed successfully!

   The pre-commit hook will now validate branch names on each commit.
   ```

3. **Verify installation:**

   ```bash
   ls -la .git/hooks/pre-commit
   -rwxr-xr-x  1 user  staff  1675 Aug 11 16:15 .git/hooks/pre-commit
   ```

### Windows (Git Bash)

**Prerequisites:**

- Git Bash (included with Git for Windows)
- Node.js 20+ (Windows installer recommended)
- npm 9+

**Steps:**

1. **Open Git Bash:**
   - Right-click in Explorer → "Git Bash Here" (or search for "Git Bash" in Start Menu)

2. **Navigate to repository:**

   ```bash
   cd /c/path/to/.github
   ```

3. **Run setup:**

   ```bash
   npm run setup:hooks
   ```

4. **Verify:**

   ```bash
   cat .git/hooks/pre-commit
   ```

**Note:** Windows Command Prompt (cmd.exe) is not supported. Use Git Bash instead.

---

## Branch Naming Pattern

### Required Format

```
{type}/{scope}-{title}
```

### Requirements

- **Type**: One of 30+ allowed prefixes (lowercase)
  - `feat`, `fix`, `hotfix`, `release`, `refactor`, `chore`, `docs`, `test`, `perf`, `ci`, `build`, `deps`, `security`, `revert`, `research`, `design`, `a11y`, `ux`, `i18n`, `ops`, `proto`, `ds`, `api`, `schema`, `telemetry`, `content`, `seo`, `config`, `migrate`, `qa`, `uat`, `audit`, `codex`

- **Scope**: Lowercase kebab-case (hyphens only)
  - ✓ Valid: `my-scope`, `feature-1`, `api-v2`
  - ✗ Invalid: `MyScope`, `my_scope`, `my.scope`

- **Title**: Lowercase kebab-case (hyphens only)
  - ✓ Valid: `my-title`, `bug-fix-123`, `add-feature`
  - ✗ Invalid: `MyTitle`, `my_title`, `my.title`

### Valid Examples

```
feat/user-authentication
fix/login-validation-bug
hotfix/critical-security-patch
chore/update-dependencies
docs/branching-strategy-guide
release/v1-5-0
refactor/simplify-validation
test/add-integration-tests
perf/optimize-api-queries
ci/fix-github-actions
```

### Invalid Examples

```
claude/my-branch          # Type "claude" not allowed
Feature/MyBranch          # Uppercase not allowed
fix-bug                   # Missing type prefix
feat/my_feature           # Underscores not allowed
feat/MyFeature            # Uppercase not allowed
feat/my.feature           # Dots not allowed
feat/my feature           # Spaces not allowed
```

---

## Usage & Testing

### Test the Pre-Commit Hook

**Test 1: Valid branch name (should pass)**

```bash
git checkout -b feat/test-feature
git commit --allow-empty -m "test commit"

# Output: (commit succeeds)
```

**Test 2: Invalid branch name (should fail)**

```bash
git checkout -b invalid-branch
git commit --allow-empty -m "test commit"

# Output:
# ❌ Branch 'invalid-branch' does not follow the naming pattern.
# ...
# (commit is blocked)
```

**Test 3: Bypass hook if needed**

```bash
git commit --allow-empty -m "test" --no-verify

# Output: (commit succeeds, hook is skipped)
```

### Manual Validation

Check a branch name without committing:

```bash
npm run validate:branch-name feat/my-feature
# Output: (no output, exit code 0 = valid)

npm run validate:branch-name claude/invalid
# Output: ❌ Branch 'claude/invalid' does not follow the naming pattern.
# (exit code 1 = invalid)
```

Show the validation pattern:

```bash
node scripts/validation/validate-branch-name.cjs --show-pattern
```

---

## Troubleshooting

### Hook Not Running on Commit

**Problem:** Pre-commit hook is not running when you commit.

**Causes & Solutions:**

1. **Hook not installed**

   ```bash
   # Check if hook exists
   ls -la .git/hooks/pre-commit
   
   # If not, run setup
   npm run setup:hooks
   ```

2. **Hook not executable**

   ```bash
   # Make it executable
   chmod +x .git/hooks/pre-commit
   ```

3. **Hook bypassed intentionally**

   ```bash
   # If you used --no-verify, the hook was skipped
   # This is intentional for testing/emergency fixes
   ```

### Branch Name Already Committed (Need to Rename)

**Problem:** You committed on an invalid branch name and now the PR is blocked.

**Solution:**

1. **Rename the branch locally:**

   ```bash
   git branch -m old-name new-name
   ```

2. **Force push to update remote:**

   ```bash
   git push -u origin new-name --force-with-lease
   ```

3. **PR will update automatically** (once branch is renamed on remote, GitHub updates the PR)

4. **Verify the branch name:**

   ```bash
   git branch --show-current
   # Should print: new-name
   ```

**Example:**

```bash
# You have: claude/my-feature (invalid)
# You want: feat/my-feature (valid)

git branch -m claude/my-feature feat/my-feature
git push -u origin feat/my-feature --force-with-lease

# PR now targets the new branch and passes validation
```

### PR Blocked by GitHub Actions Validation

**Problem:** You opened a PR but GitHub Actions says branch name is invalid.

**Why this happens:**

- The pre-commit hook doesn't catch all cases (e.g., if you bypassed it with `--no-verify`)
- The hook is optional; GitHub Actions validation is mandatory

**Solution:**

1. **Rename the branch locally:**

   ```bash
   git branch -m <invalid-name> <valid-name>
   ```

2. **Push the renamed branch:**

   ```bash
   git push -u origin <valid-name> --force-with-lease
   ```

3. **Close the old PR** (with invalid branch name)

4. **Open a new PR** from the renamed branch

5. **Wait for GitHub Actions** to validate the new branch name (~30 seconds)

### Hook Installation Failed

**Problem:** `npm run setup:hooks` failed with an error.

**Possible causes:**

1. **Not in a Git repository:**

   ```bash
   # Verify you're in a Git repo
   git rev-parse --git-dir
   # Should print: .git (or path to git directory)
   ```

2. **Hooks directory doesn't exist:**

   ```bash
   # The setup script should create it, but if it fails:
   mkdir -p .git/hooks
   npm run setup:hooks
   ```

3. **Permission denied:**

   ```bash
   # On macOS/Linux, ensure you have write permission
   ls -la .git/
   # drwxr-xr-x (or similar — you should see 'x' for owner)
   ```

4. **Node.js or npm not installed:**

   ```bash
   # Check versions
   node --version  # Should be 20+
   npm --version   # Should be 9+
   ```

### Uninstall the Hook

To remove the pre-commit hook:

```bash
rm .git/hooks/pre-commit
```

The hook is disabled but the GitHub Actions workflow will still validate PRs.

---

## FAQ

**Q: Is the pre-commit hook mandatory?**
A: No, it's optional. The GitHub Actions workflow will always enforce naming rules on PRs. The hook is a convenience for instant local feedback.

**Q: Can I bypass the hook?**
A: Yes, use `git commit --no-verify`. But the GitHub Actions check will still block the PR, so you'll have to rename the branch eventually.

**Q: Why does the hook skip main and develop?**
A: These are protected branches in the release workflow. The hook skips them to avoid blocking legitimate release operations.

**Q: What if my team doesn't want the pre-commit hook?**
A: That's fine. The GitHub Actions validation is mandatory and sufficient. The hook is just a convenience.

**Q: How do I update the validation pattern?**
A: The pattern is defined in `scripts/validation/validate-branch-name.cjs`. Update the `ALLOWED_TYPES` array and both the hook and workflow will automatically use the new pattern.

**Q: Does the hook work with `git rebase`?**
A: Yes. The hook detects detached HEAD state (which occurs during rebase) and skips validation.

---

## Next Steps

1. **Run `npm run setup:hooks`** to install the local pre-commit hook
2. **Create a test branch** with a valid name and commit to verify it works
3. **Share this guide** with your team
4. **See [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)** for the full branching strategy

---

## Support

For issues or questions:

- Check [Troubleshooting](#troubleshooting) above
- See [BRANCHING_STRATEGY.md § 4](./BRANCHING_STRATEGY.md#4-branch-name-enforcement-via-ci) for implementation details
- Open an issue in the `.github` repository with the `area:ci` label

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
