---
file_type: documentation
title: Branch Validation Troubleshooting Guide
description: Common issues and solutions for the LightSpeed branch naming validation system
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
  - troubleshooting
  - validation
  - hooks
language: en
---

# Branch Validation Troubleshooting Guide

Comprehensive solutions for branch naming validation issues.

**Quick Links:**

- [Installation Issues](#installation-issues)
- [Validation Failures](#validation-failures)
- [PR Merge Blocked](#pr-merge-blocked)
- [Hook Behavior](#hook-behavior)
- [Advanced Issues](#advanced-issues)
- [Getting Help](#getting-help)

---

## Installation Issues

### "Hook not found" or "Validation script not found"

**Symptoms:**

```
⚠️ Branch validation script not found at .../scripts/validation/validate-branch-name.cjs
   Skipping validation.
```

**Cause:** The validation script is missing from the repository.

**Solutions:**

1. **Ensure you're on the latest commit:**

   ```bash
   git fetch origin
   git checkout develop
   git pull origin develop
   ```

2. **Verify the script exists:**

   ```bash
   ls -la scripts/validation/validate-branch-name.cjs
   # Should print file info, not "No such file"
   ```

3. **If missing, update your local repository:**

   ```bash
   git status
   # Check for uncommitted changes
   
   git pull origin develop
   # Get the latest changes including the validation script
   ```

---

### "Permission denied" when running setup

**Symptoms:**

```
Error: EACCES: permission denied, open '.git/hooks/pre-commit'
```

**Cause:** Your user doesn't have write permission to the `.git` directory.

**Solutions:**

1. **Check directory ownership:**

   ```bash
   ls -la .git/
   # First column should show your username
   ```

2. **Fix ownership (if needed):**

   ```bash
   # macOS/Linux
   chown -R $USER .git
   
   # Then try setup again
   npm run setup:hooks
   ```

3. **Alternative: Manual installation:**

   ```bash
   # Copy the hook manually
   cp .github/hooks/pre-commit .git/hooks/pre-commit
   chmod +x .git/hooks/pre-commit
   ```

---

### "Node.js or npm not found"

**Symptoms:**

```
command not found: node
command not found: npm
```

**Cause:** Node.js or npm is not installed or not in your PATH.

**Solutions:**

1. **Check if installed:**

   ```bash
   node --version
   npm --version
   ```

2. **Install Node.js:**
   - **macOS:** `brew install node` (requires Homebrew)
   - **Linux:** `apt install nodejs npm` (Ubuntu/Debian) or `yum install nodejs` (Fedora)
   - **Windows:** Download from [nodejs.org](https://nodejs.org/), use installer

3. **Add to PATH (if needed):**
   - If installed but not in PATH, add to `~/.bashrc` or `~/.zshrc`:

   ```bash
   export PATH="$PATH:/path/to/node/bin"
   ```

4. **Verify installation:**

   ```bash
   node --version  # Should be 20+
   npm --version   # Should be 9+
   ```

---

### Hook installed but not running on commit

**Symptoms:**

```
# Commit succeeds even though branch name is invalid
git commit --allow-empty -m "test"
# No validation error
```

**Cause:** Hook is installed but not executable, or Git isn't calling it.

**Solutions:**

1. **Verify hook is executable:**

   ```bash
   ls -la .git/hooks/pre-commit
   # Should show: -rwxr-xr-x (the 'x' means executable)
   
   # If not executable, fix it:
   chmod +x .git/hooks/pre-commit
   ```

2. **Verify hook content:**

   ```bash
   head -1 .git/hooks/pre-commit
   # Should show: #!/bin/bash
   ```

3. **Test the hook manually:**

   ```bash
   .git/hooks/pre-commit
   # Should run without error on valid branches
   ```

4. **Check if you bypassed it:**

   ```bash
   # Did you use --no-verify?
   git commit --allow-empty -m "test" --no-verify
   # This skips ALL hooks, including the pre-commit hook
   ```

---

## Validation Failures

### "Branch name does not follow the required format"

**Symptoms:**

```
❌ Branch 'my-feature' does not follow the naming pattern.

Required format: {type}/{scope}-{short-title}
```

**Cause:** Branch name doesn't match the strict pattern.

**Solutions:**

1. **Check the pattern:**

   ```bash
   node scripts/validation/validate-branch-name.cjs --show-pattern
   ```

2. **Common mistakes:**
   - Missing type prefix: `my-feature` → `feat/my-feature`
   - Uppercase: `Feat/My-Feature` → `feat/my-feature`
   - Underscores: `feat/my_feature` → `feat/my-feature`
   - No separator: `feat/myfeature` → `feat/my-feature`
   - Invalid type: `claude/my-feature` → `feat/my-feature`

3. **Valid branch names:**

   ```
   feat/my-feature
   fix/bug-fix
   chore/update-deps
   docs/readme-update
   ```

4. **Validate before committing:**

   ```bash
   npm run validate:branch-name
   # If no output, branch is valid
   ```

---

### "Type not in allowed list"

**Symptoms:**

```
❌ Branch 'custom/my-branch' does not follow the naming pattern.

Allowed types: feat, fix, hotfix, release, ...
```

**Cause:** You used a branch type that's not in the allowed list.

**Solutions:**

1. **See all allowed types:**

   ```bash
   node scripts/validation/validate-branch-name.cjs --show-pattern
   # Shows: feat, fix, hotfix, release, refactor, chore, docs, ...
   ```

2. **Request a new type:**
   - Open an issue in the `.github` repository with the `area:ci` label
   - Propose the new type and use case
   - Once approved, it will be added to `ALLOWED_TYPES` in the validation script

3. **Work around (temporary):**
   - Use the closest existing type for now
   - `custom/my-feature` → `feat/my-feature`
   - `other/my-work` → `chore/my-work`

---

### "Scope or title contains invalid characters"

**Symptoms:**

```
❌ Branch 'feat/my_feature-name' does not follow the naming pattern.

- scope: lowercase, hyphens only (no underscores or uppercase)
- title: lowercase, hyphens only (no underscores or uppercase)
```

**Cause:** Branch name contains underscores, uppercase, dots, or spaces.

**Solutions:**

Replace invalid characters with hyphens:

| Invalid | Valid |
|---------|-------|
| `feat/my_feature` | `feat/my-feature` |
| `feat/MyFeature` | `feat/my-feature` |
| `feat/my.feature` | `feat/my-feature` |
| `feat/my feature` | `feat/my-feature` |
| `feat/my--feature` | `feat/my-feature` |
| `feat/my-feature_1` | `feat/my-feature-1` |

---

## PR Merge Blocked

### "Status check failed: Branch name validation"

**Symptoms:**

```
❌ Branch Name Validation — FAILED
All status checks must pass before merging.
```

**Cause:** GitHub Actions workflow detected an invalid branch name.

**Solutions:**

1. **Understand why it failed:**
   - Check the PR status check details
   - Look for the comment posted by GitHub Actions with specific error message

2. **Rename the branch:**

   ```bash
   # Check current branch
   git branch --show-current
   
   # Rename to valid name
   git branch -m old-name new-name
   
   # Push the renamed branch
   git push -u origin new-name --force-with-lease
   ```

3. **Close and reopen PR:**
   - Close the old PR with invalid branch name
   - Open a new PR from the renamed branch
   - GitHub will automatically validate the new branch

4. **Wait for validation:**
   - GitHub Actions runs automatically when you push a branch
   - Status check should complete in ~30 seconds
   - If it still fails, check the error message in the PR comment

---

### "PR comment with validation error"

**Symptoms:**

```
## ❌ Branch Name Validation Failed

The branch name 'invalid-branch' does not follow the LightSpeed 
branching strategy.

### Required Format
{type}/{scope}-{short-title}
```

**Cause:** GitHub Actions posted a detailed error comment.

**Solutions:**

1. **Read the error comment** for specific issues
2. **Follow the "Solution" section** in the comment
3. **Rename your branch:**

   ```bash
   git branch -m invalid-name valid-name
   git push -u origin valid-name --force-with-lease
   ```

4. **GitHub will revalidate** when you push

---

## Hook Behavior

### Hook runs on protected branches (main/develop)

**Symptoms:**

```
# On main or develop branch
git commit --allow-empty -m "test"
# Commit succeeds (validation skipped)
```

**Expected behavior:** This is correct!

**Why:** The hook intentionally skips validation on `main` and `develop` to avoid blocking release workflows (which might have temporary branch names).

**If you need validation on these branches:**

- You shouldn't be committing directly to `main` or `develop` (use PRs instead)
- The GitHub Actions workflow validates all PR branches regardless

---

### Hook runs during rebase/merge (detached HEAD)

**Symptoms:**

```
# During rebase
git commit --allow-empty -m "test"
# Validation is skipped (detached HEAD detected)
```

**Expected behavior:** This is correct!

**Why:** The hook detects detached HEAD state (which happens during rebase, merge, bisect) and skips validation to avoid interfering with Git operations.

**Normal operation resumes** when you exit the rebase/merge and return to a normal branch.

---

### Hook shows "No branch detected"

**Symptoms:**

```
❌ No branch detected. Provide one with --branch <name> or ensure 
you are in a Git repository.
```

**Cause:** You're in detached HEAD state or not in a Git repository.

**Solutions:**

1. **Check if you're in a Git repository:**

   ```bash
   git rev-parse --git-dir
   # Should print: .git (or path to git directory)
   ```

2. **Check your current state:**

   ```bash
   git branch --show-current
   # Should print: branch-name (not empty)
   ```

3. **If in detached HEAD, check out a branch:**

   ```bash
   git log --oneline -5
   # Find a commit hash you want to branch from
   
   git checkout -b feat/my-feature
   # Create a new branch at this commit
   ```

---

## Advanced Issues

### Changing branch name after committed

**Scenario:** You committed on `claude/my-branch` (invalid) and pushed it.

**Solution:**

1. **Rename locally:**

   ```bash
   git branch -m claude/my-branch feat/my-branch
   ```

2. **Delete the old remote branch:**

   ```bash
   git push origin --delete claude/my-branch
   ```

3. **Push the new branch:**

   ```bash
   git push -u origin feat/my-branch
   ```

4. **Update PR:**
   - If PR exists for `claude/my-branch`, close it
   - Open new PR for `feat/my-branch`

---

### Multiple branches with similar names

**Scenario:** You have both `feat/my-feature` and `fix/my-feature` (duplicate work).

**Solution:**

1. **Identify which is current:**

   ```bash
   git branch
   # Lists all branches
   ```

2. **Delete the unwanted one:**

   ```bash
   git branch -D unwanted-branch
   git push origin --delete unwanted-branch
   ```

3. **Continue work on the correct branch:**

   ```bash
   git checkout feat/my-feature
   ```

---

### Hook fails with "node: command not found"

**Symptoms:**

```
.git/hooks/pre-commit: line 50: node: command not found
```

**Cause:** Node.js is not in the hook's PATH.

**Solutions:**

1. **Find where Node is installed:**

   ```bash
   which node
   # Usually: /usr/local/bin/node or /opt/homebrew/bin/node
   ```

2. **Update hook with absolute path:**

   ```bash
   # Edit .git/hooks/pre-commit
   # Change: node scripts/validation/...
   # To: /usr/local/bin/node scripts/validation/...
   # (use path from 'which node')
   ```

3. **Or reinstall the hook:**

   ```bash
   rm .git/hooks/pre-commit
   npm run setup:hooks
   ```

---

### Workflow timeout or slow validation

**Symptoms:**

```
GitHub Actions workflow running for >5 minutes on branch validation
```

**Cause:** Rare; usually due to slow GitHub Actions runner or network issues.

**Solutions:**

1. **Rerun the workflow:**

   ```
   - Go to the PR
   - Click "Re-run failed jobs" button
   - GitHub will run validation again
   ```

2. **Check GitHub status:**
   - Visit [GitHub Status](https://www.githubstatus.com/)
   - Check if GitHub Actions is experiencing issues

3. **If persistent:**
   - Open an issue in the `.github` repository
   - Include PR number and timestamp
   - Mention slow validation in title

---

## Getting Help

### Where to report issues

1. **Branch validation doesn't work:**
   - Open issue in `.github` repository
   - Label: `area:ci`
   - Include: branch name, error message, OS/tools versions

2. **Need to add new branch type:**
   - Open issue in `.github` repository
   - Label: `area:ci`
   - Describe: use case and proposed type

3. **Git/GitHub questions:**
   - Check [Git Documentation](https://git-scm.com/doc)
   - Check [GitHub Docs](https://docs.github.com/)
   - Ask in Slack `#engineering` channel

### Debug commands

**Show current branch:**

```bash
git branch --show-current
git rev-parse --abbrev-ref HEAD
```

**Validate a specific branch:**

```bash
npm run validate:branch-name feat/my-feature
node scripts/validation/validate-branch-name.cjs --branch feat/my-feature --verbose
```

**Check hook status:**

```bash
ls -la .git/hooks/pre-commit
echo $?  # Exit code (0 = success, 1 = failure)
```

**View recent commits:**

```bash
git log --oneline -10
```

**Check PR validation status:**

```
- Go to the PR on GitHub
- Scroll to "Checks" section
- Click "Branch Name Validation" to see details
```

---

## See Also

- [SETUP_BRANCH_VALIDATION.md](./SETUP_BRANCH_VALIDATION.md) — Setup and usage guide
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) — Full branching strategy
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Contribution guidelines
- [GitHub Docs: Configuring Git Hooks](https://docs.github.com/en/education/classroom/guides/useful-git-commands#hooks)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
