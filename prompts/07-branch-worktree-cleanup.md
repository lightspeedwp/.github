---
file_type: "prompt"
title: "Branch and Worktree Cleanup"
description: "Clean up local branches and worktrees based on merge status, staleness (2+ weeks), and branch naming validation. Includes safe deletion guidance."
version: "1.0.0"
created: "2026-09-04"
status: "active"
tags: ["git", "cleanup", "maintenance", "branch-management"]
owners: ["ashley@lightspeedwp.agency"]
---

# Prompt: Branch and Worktree Cleanup

## PROMPT: Clean up local branches and worktrees

This prompt safely removes stale or merged branches, validates naming conventions, and cleans up git worktrees after completed work.

### Context

Over time, local repositories accumulate branches:

- **Merged branches** (safe to delete — already in main/develop)
- **Stale branches** (2+ weeks old, no activity)
- **Invalid branches** (wrong naming convention — `claude/*`, `copilot/*`)
- **Orphaned branches** (no corresponding PR, lost history)

Worktrees also accumulate and need cleanup.

This prompt provides a safe, step-by-step process to identify and remove old/invalid branches.

### Task

Execute these steps IN ORDER:

---

## STEP 1: List All Local Branches with Metadata

```bash
# Show all branches with last commit date
git branch -v --list

# Output example:
# * develop                     82477dbe [origin/develop] docs: Update project status
#   feat/auth-hardening         a1b2c3d4 [ahead 2] feat: add auth retry logic
#   fix/cache-invalidation      e5f6g7h8 [gone] fix: cache key collision
#   chore/cleanup-old-sessions  i9j0k1l2 [gone] chore: remove stale sessions
```

**Key indicators:**
- `[origin/{branch}]` — Branch tracked on remote
- `[ahead N]` — Local commits not pushed
- `[gone]` — Remote branch deleted (orphaned local)
- Date shows last commit age

---

## STEP 2: Identify Candidates for Deletion

Create a cleanup checklist:

```markdown
## Branch Cleanup Checklist

### Category 1: Merged Branches (SAFE to delete)

| Branch | Status | PR | Merged | Action |
|--------|--------|----|---------| --------|
| fix/cache-invalidation | [gone] | #100 | Yes | DELETE |
| chore/cleanup | [gone] | #101 | Yes | DELETE |

**Total Merged:** 2 branches

### Category 2: Stale Branches (2+ weeks old, no PR)

| Branch | Last Commit | Days Old | PR? | Action |
|--------|-------------|----------|-----|---------|
| feat/dark-mode | 2 weeks ago | 14 | No | REVIEW |
| proto/experimental-cache | 3 weeks ago | 21 | No | DELETE |

**Total Stale:** 2 branches

### Category 3: Invalid Branch Names (Naming violation)

| Branch | Type | Issue | Action |
|--------|------|-------|--------|
| claude/my-feature | FORBIDDEN | Reserved prefix | RENAME or DELETE |
| copilot/fix-bug | FORBIDDEN | Reserved prefix | RENAME or DELETE |

**Total Invalid:** 2 branches

### Category 4: Active Branches (Keep)

| Branch | Status | PR | Action |
|--------|--------|----|----|
| feat/user-prefs | [ahead 3] | #102 | KEEP |
| develop | — | N/A | KEEP |
| main | — | N/A | KEEP |

**Total Active:** 3 branches
```

---

## STEP 3: Check for Uncommitted Changes

Before deleting any branch, verify no unsaved work:

```bash
# For each branch to delete:
git checkout {branch-name}
git status

# Check for:
# - Untracked files (?)
# - Modified files (M)
# - Deleted files (D)
# - Staged changes (A, M, D in green)

# If uncommitted changes:
# Option 1: Commit the work
#   git add .
#   git commit -m "chore: save work before cleanup"
#   git push origin {branch-name}
# 
# Option 2: Stash the work
#   git stash
#   (come back later to decide)
#
# Option 3: Discard the work (DANGEROUS)
#   git reset --hard origin/{branch-name}
#   (only if certain you don't want changes)
```

---

## STEP 4: Validate Naming Conventions

For branches with invalid names (`claude/*`, `copilot/*`):

```bash
# Check branch naming
npm run validate:branch-name -- --branch {branch-name}

# Example output:
# ✅ Branch 'feat/my-feature' matches the repository branching strategy
# ❌ Branch 'claude/my-feature' INVALID — reserved prefix

# For each invalid branch:
# Option 1: Rename locally (if PR exists)
#   git branch -m old-name new-name
#   git push -u origin new-name
#   git push origin --delete old-name
#
# Option 2: Delete (if no PR or PR already merged)
#   git push origin --delete old-name
#   git branch -D old-name (local)
```

**Reference:** `docs/BRANCHING_STRATEGY.md` for valid prefix list

---

## STEP 5: Check for Open PRs

Don't delete branches with open PRs:

```bash
# List all open PRs
gh pr list --state open --json number,headRefName

# For each branch:
#   Is there an open PR?
#   If YES: Don't delete (PR still in review)
#   If NO but PR merged: Safe to delete
#   If NO PR ever: Safe to delete (orphaned)

# Example:
# #100 | feat/auth-hardening (OPEN PR — keep branch)
# #101 | fix/cache-invalidation (MERGED PR — safe to delete)
# (no PR) | proto/experimental (orphaned — safe to delete)
```

---

## STEP 6: Safe Branch Deletion

Delete only branches that passed all checks:

```bash
# Delete merged/stale/orphaned branches

# Method 1: Delete remote branch (recommended first)
git push origin --delete {branch-name}

# Method 2: Delete local branch
git branch -D {branch-name}

# Method 3: Combined (delete both)
git push origin --delete {branch-name} && git branch -D {branch-name}

# Verify deletion
git branch -v | grep {branch-name}  # Should be empty

# Example script to delete multiple:
for branch in fix/cache proto/experimental chore/cleanup; do
  git push origin --delete "$branch" 2>/dev/null
  git branch -D "$branch" 2>/dev/null
done
```

**Safety rules:**
- ✅ Always delete remote first (safer)
- ✅ Use `-D` for force delete (loses branch history locally)
- ✅ Verify deletion succeeded
- ✅ Commit cleanup log (see STEP 9)

---

## STEP 7: Clean Up Git Worktrees

If using `git worktree`:

```bash
# List all worktrees
git worktree list

# Output example:
# /home/user/.github                        82477dbe [develop]
# /home/user/.github/.git/worktrees/pr-100  a1b2c3d4 [feat/auth-hardening]
# /home/user/.github/.git/worktrees/pr-101  e5f6g7h8 [fix/cache] (detached, locked)

# For stale worktrees:
#   (detached) = branch deleted but worktree not cleaned
#   (locked) = worktree in use elsewhere (don't delete)

# Delete worktree (after deleting branch)
git worktree remove {worktree-path}

# Example:
git worktree remove .git/worktrees/pr-101

# If worktree is locked:
git worktree remove --force {worktree-path}

# Prune dead worktrees
git worktree prune
```

---

## STEP 8: Fetch and Synchronize

Ensure local state matches remote:

```bash
# Fetch all remote changes
git fetch --all --prune

# List all branches (local + remote)
git branch -a

# Verify deleted branches no longer appear in remote
git branch -r | grep {deleted-branch-name}  # Should be empty

# Update tracking info
git remote prune origin
```

---

## STEP 9: Generate Cleanup Report

Document what was cleaned:

```bash
# Create cleanup report
cat > .github/reports/branch-cleanup-{date}.md << 'EOF'
# Branch Cleanup Report — {Date}

## Summary
- Branches Deleted: 5
- Branches Renamed: 0
- Worktrees Removed: 2
- Active Branches Retained: 8
- Total Effort: 30 minutes

## Deleted Branches

### Merged Branches (PR closed)
- fix/cache-invalidation (merged in #100 on 2026-08-28)
- chore/cleanup (merged in #101 on 2026-08-25)

### Stale Branches (no PR, 2+ weeks)
- proto/experimental-cache (last commit 2026-08-20)
- feature/draft-mode (last commit 2026-08-18)
- docs/old-guide (last commit 2026-08-15)

### Invalid/Orphaned
- (none this time)

## Renamed Branches
- (none this time)

## Worktrees Removed
- .git/worktrees/pr-100 (branch merged, worktree stale)
- .git/worktrees/pr-101 (detached, no active work)

## Active Branches Retained
1. main (always keep)
2. develop (always keep)
3. feat/user-prefs (open PR #102)
4. feat/auth-hardening (open PR #103)
5. fix/search-bug (open PR #104)
6. docs/api-update (open PR #105)
7. chore/deps-update (open PR #106)
8. refactor/cache-layer (in progress, no PR yet)

## Validation
- [x] No uncommitted changes lost
- [x] All active branches retained
- [x] All open PRs' branches kept
- [x] Invalid branches removed or renamed
- [x] Worktrees cleaned
- [x] Remote synchronized

## References
- Cleanup script: `scripts/cleanup-branches.js` (if automated)
- Naming strategy: `docs/BRANCHING_STRATEGY.md`
- Related issue: `agents/chat-closure-agent/` (closure agent)

---
Created: {Date}
Performed by: {Your name}
EOF
```

---

## STEP 10: Verify Clean State

```bash
# Final verification
git status
# Should show: "On branch develop" or "On branch main"
# "nothing to commit, working tree clean"

# List branches
git branch -a
# Should show:
# * develop
#   main
#   {active feature branches}
# remotes/origin/develop
# remotes/origin/main
# {remote active branches}

# Count branches
echo "Local branches: $(git branch | wc -l)"
echo "Remote branches: $(git branch -r | wc -l)"
# Should both be LOWER than before cleanup
```

---

## Alternative: Use Cleanup Script

If repository has cleanup script:

```bash
# Use provided script (if it exists)
node scripts/cleanup-branches.js

# This script should:
# - List branches to delete
# - Ask for confirmation
# - Delete safely
# - Generate cleanup report
# - Create commit message
```

**Script reference:** `scripts/cleanup-branches.js` (if available)

---

## Closure Agent Integration

After cleanup, the closure agent can finalize session state:

**Reference:** `.github/agents/chat-closure-agent/`

```bash
# Use closure agent for comprehensive session cleanup:
# - Branch cleanup (above)
# - Commit final state
# - Update active projects
# - Generate session summary report
```

---

## When NOT to Delete a Branch

✋ **Keep these branches:**
- `main` and `develop` (integration branches)
- Branches with open/pending PRs
- Recently active branches (< 1 week)
- Branches with uncommitted work
- Branches with locks or special status
- Release branches (`release/*`)

---

## References

- **Branching Strategy:** `docs/BRANCHING_STRATEGY.md`
- **Branch Cleanup Guide:** `docs/BRANCH_CLEANUP.md`
- **Cleanup Script:** `scripts/cleanup-branches.js`
- **Closure Agent:** `.github/agents/chat-closure-agent/AGENT.md`
- **Closure Prompt:** `.github/agents/chat-closure-agent/claude/prompt.md`
- **Reports Location:** `.github/reports/`

---

**Effort:** 30 min–1 hour  
**Use When:** Session complete, local repo has accumulated many branches  
**Output:** Cleaned local branches, removed stale worktrees, cleanup report  
**Dependencies:** `git`, GitHub CLI (`gh`), access to local branches
