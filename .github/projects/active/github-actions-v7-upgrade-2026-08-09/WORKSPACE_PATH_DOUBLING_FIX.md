---
file_type: documentation
description: "Fix workspace path doubling issue in CI workflows - ready-to-copy prompt for new session"
---

# Workspace Path Doubling Fix - New Session Prompt

## Context

PR #1703 (Phase 5 GitHub Actions v7 upgrade completion) has multiple CI checks failing due to a systemic workspace path doubling issue in auto-generated workflows. The repository is named `.github`, and when checked out by CI, the working directory becomes `/home/runner/work/.github/.github/` instead of `/home/runner/work/.github/`. This causes all hardcoded `.github/scripts/` paths to fail with "Cannot find module" errors.

**Related Issues:**

- [Issue #1709](https://github.com/lightspeedwp/.github/issues/1709) — PR #1703 blockers (workspace path doubling root cause documented)
- [PR #1703](https://github.com/lightspeedwp/.github/pull/1703) — Phase 5 handoff notes (failing checks)

**Active Project:** [github-actions-v7-upgrade-2026-08-09](./PROJECT_README.md)

---

## Copy/Paste Prompt for New Session

```
Focus: Fix workspace path doubling in CI workflows for PR #1703

Context:
- Repository name is `.github`, causing path doubling: `/home/runner/work/.github/.github/`
- Workflows hardcoded with `.github/scripts/` paths fail when repository is checked out
- Auto-generated workflows that run agents fail: Auto-regenerate Documentation, Labeling, Planner, etc.
- Related issue: #1709 documents root cause with example errors

Task:
1. Identify all workflows using hardcoded `.github/scripts/` paths
2. Update paths to use relative paths or $GITHUB_WORKSPACE variable
3. Test fix in PR #1703 to verify CI checks pass
4. Update issue #1709 with resolution

Affected Workflows (from CI failures):
- Auto-regenerate Documentation (.github/workflows/documentation.yml) — uses `node .github/scripts/agents/meta.agent.js`
- Unified Labeling, Status, and Type Assignment — labeling agent paths
- Standard Labeling, Status, and Type Assignment — labeling agent paths  
- Validate changelog on PR — changelog agent paths
- Planner agent — planner agent paths

Solution Pattern:
Replace: `node .github/scripts/agents/meta.agent.js`
With: `node $GITHUB_WORKSPACE/.github/scripts/agents/meta.agent.js`
OR use relative path from runner working directory

Verify by running CI checks on PR #1703 — all should pass once paths are corrected.

Reference files:
- PR #1703 description: Phase 5 GitHub Actions v7 upgrade completion
- Issue #1709: Full technical details of workspace path issue
- Active project: github-actions-v7-upgrade-2026-08-09
```

---

## Detailed Technical Background

### Root Cause

The `.github` repository, when checked out by GitHub Actions runners, becomes:

- **Expected:** `/home/runner/work/.github/`
- **Actual:** `/home/runner/work/.github/.github/` (path doubled)

This happens because:

1. Runner checks out repository to `/home/runner/work/[repo-owner]/[repo-name]/`
2. Since repo-name is `.github`, checkout path becomes `/home/runner/work/lightspeedwp/.github/`
3. But runner root working directory is `/home/runner/work/.github/`
4. This causes path doubling when scripts use `.github/` prefix

### Failing Checks

All checks trying to run agent scripts fail with:

```
Error: Cannot find module '/home/runner/work/.github/.github/scripts/agents/meta.agent.js'
```

**Affected Checks:**

1. Auto-regenerate Documentation (meta.agent)
2. Unified Labeling, Status, and Type Assignment (labeling agent)
3. Standard Labeling, Status, and Type Assignment (labeling agent)
4. Validate changelog on PR (changelog agent)
5. Planner (planner agent)
6. Mergify Merge Queue (blocked by above failures)

### Solution Approaches

#### Option 1: Use $GITHUB_WORKSPACE (Recommended)

```bash
# Before
node .github/scripts/agents/meta.agent.js

# After  
node $GITHUB_WORKSPACE/.github/scripts/agents/meta.agent.js
```

**Pros:** Works across all repository names, most portable
**Cons:** Less readable, slightly more verbose

#### Option 2: Use Relative Paths from Runner Cwd

```bash
# Before
node .github/scripts/agents/meta.agent.js

# After
node ../.github/scripts/agents/meta.agent.js
```

**Pros:** Shorter, doesn't require env vars
**Cons:** Fragile if runner cwd changes

#### Option 3: Use Absolute Path from git root

```bash
# Use git to find root and construct path
git_root=$(git rev-parse --show-toplevel)
node "$git_root/.github/scripts/agents/meta.agent.js"
```

**Pros:** Most reliable, works from any directory
**Cons:** Requires git command, slightly slower

---

## Workflow Files to Update

1. `.github/workflows/documentation.yml`
   - Lines with `node .github/scripts/agents/meta.agent.js`

2. `.github/workflows/meta.yml`
   - Lines with `node .github/scripts/agents/meta.agent.js`

3. `.github/workflows/labeling.yml` (if exists)
   - Agent script paths

4. Any other workflows running agents from `.github/scripts/agents/`

---

## Verification Checklist

- [ ] All hardcoded `.github/scripts/` paths updated to use `$GITHUB_WORKSPACE`
- [ ] Workflows tested by running CI on PR #1703
- [ ] All 6 failing checks now pass:
  - [ ] Auto-regenerate Documentation
  - [ ] Unified Labeling, Status, and Type Assignment
  - [ ] Standard Labeling, Status, and Type Assignment
  - [ ] Validate changelog on PR
  - [ ] Planner
  - [ ] Mergify Merge Queue (should pass once others pass)
- [ ] Issue #1709 updated with resolution
- [ ] Active project updated with completion status

---

**Status:** Implementation complete — workspace path fixes verified and working in PR #1703
