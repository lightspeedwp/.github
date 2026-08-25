# Batch 1 Execution Summary

**Date:** 2026-07-31  
**Batch:** 1 (Critical Documentation Consolidation Issues)  
**Status:** 🟢 Ready for Execution  
**Timeline Target:** 2026-08-04 (Team review) → 2026-08-05 (Execution)

---

## What This Batch Does

Rewrites 5 critical GitHub issues (#904, #916-920) to align with Phase 3B Documentation Update Strategy. These issues are the primary drivers of documentation consolidation work in Phase 3.

---

## Issues Being Updated

### 1. **Issue #904** — Documentation Consolidation (Parent)

- **Current Title:** Documentation Consolidation - Reduce Duplication Across Docs
- **New Title:** [Phase 3B] Documentation Consolidation - Reduce Duplication Across Docs
- **Changes:**
  - Add Phase 3B context and timeline
  - Replace generic "audit" scope with 3 specific consolidation areas
  - Add detailed tasks for Branch & PR, Labeling, and Issue Triage areas
  - Define dependencies (#916-918 as child issues)
  - Lines: 112

### 2. **Issue #916** — Issue Creation Docs Consolidation

- **Current Title:** Issue Creation Docs - Consolidate Overlapping Files
- **New Title:** [Phase 3B Task 1] Issue Creation Docs - Consolidate Overlapping Files
- **Changes:**
  - Link to Phase 3B consolidation plan
  - Add specific file pairs to analyze (ISSUE_CREATION_GUIDE.md ↔ ISSUE_TYPES.md)
  - Define decision tasks
  - Add Phase 3B timeline (Days 5-6)
  - Lines: 49

### 3. **Issue #917** — PR Creation Docs Consolidation

- **Current Title:** PR Creation Docs - Consolidate Overlapping Files
- **New Title:** [Phase 3B Task 2] PR Creation Docs - Consolidate Overlapping Files
- **Changes:**
  - Link to Phase 3B consolidation plan
  - Add specific file pairs (PR_CREATION_PROCESS.md ↔ BRANCHING_STRATEGY.md)
  - Define branch naming duplication removal tasks
  - Add cross-reference implementation steps
  - Lines: 52

### 4. **Issue #918** — Labeling Docs Consolidation

- **Current Title:** Labeling Docs - Consolidate Overlapping Files
- **New Title:** [Phase 3B Task 3] Labeling Docs - Consolidate Overlapping Files
- **Changes:**
  - Link to Phase 3B consolidation plan
  - Add 3-file analysis tasks (LABELING.md ↔ LABEL_STRATEGY.md ↔ LABEL_COLOR_STRATEGY.md)
  - Define consolidation decision options (A/B/C)
  - Add 3-phase approach: Analysis → Decision → Implementation
  - Lines: 88

### 5. **Issue #920** — Documentation Index

- **Current Title:** Documentation Index (docs/index.md) - Complete & Current
- **New Title:** [Phase 3D] Documentation Index (docs/index.md) - Complete & Current
- **Changes:**
  - Move to Phase 3D context
  - Replace generic task with 5 detailed sub-tasks
  - Add specific index structure sections
  - Define testing and validation approach
  - Lines: 91

---

## Total Changes

- **Issues Updated:** 5
- **Total Lines Added:** 392 lines of new issue content
- **Phase Coverage:** Phase 3B (primary), Phase 3D (secondary)
- **Dependencies Added:** Child issue links (#916-918 under #904)

---

## Execution Instructions

### Prerequisites

1. GitHub CLI (`gh`) is installed and authenticated
2. You have write access to `lightspeedwp/.github` repository
3. Navigate to the execution directory: `.github/projects/active/wave-5-documentation-audit/batch-1-execution/`

### Step 1: Review (DRY RUN)

```bash
# Navigate to the execution directory
cd .github/projects/active/wave-5-documentation-audit/batch-1-execution/

# See what will be updated without making changes
bash execute-batch-1-rewrites.sh --dry-run
```

**Output shows:**

- Issue numbers being updated
- New titles that will be set
- File sizes (lines of new content)

### Step 2: Execute

```bash
# Apply all changes to GitHub issues
bash execute-batch-1-rewrites.sh --execute
```

**This will:**

- Update issue #904 with new title and body
- Update issue #916 with new title and body
- Update issue #917 with new title and body
- Update issue #918 with new title and body
- Update issue #920 with new title and body

### Step 3: Verify

After execution, verify changes on GitHub:

- Open each issue (#904, #916, #917, #918, #920)
- Confirm new titles are set
- Confirm new content is displayed
- Check that relationships (parent/child links) are correct

---

## What to Expect After Execution

### In GitHub Issues

✅ **Issue #904:**

- Title updated to show Phase 3B context
- Body shows 3 consolidation areas with specific tasks
- Child issues (#916-918) listed in "Related Issues"
- Timeline shows 2026-08-05 to 2026-08-12

✅ **Issues #916-918:**

- Titles updated with Phase 3B Task numbering
- Bodies show specific file pairs and consolidation tasks
- Parent issue (#904) linked
- Timeline shows Days 5-11 of Phase 3

✅ **Issue #920:**

- Title updated to show Phase 3D context
- Body shows 5 detailed sub-tasks for documentation index
- Dependencies on #904, #916-918 documented
- Timeline shows Days 12-16 of Phase 3

### In GitHub Project Board

- Issues should be tagged with "phase-3" label (if applicable)
- Issues should be added to Phase 3 milestone (if milestone exists)
- Related issues should show parent-child relationships

---

## Timeline

| Step | When | Who |
|------|------|-----|
| Review & Approval | 2026-08-04 | Team |
| Dry Run | 2026-08-04 (evening) | Executor |
| Execution | 2026-08-05 (morning) | Executor |
| Verification | 2026-08-05 (afternoon) | Team |
| Phase 3 Execution Begins | 2026-08-05 | Team |

---

## Rollback Plan

If changes need to be reverted:

1. **Manual Revert:** Restore original issue bodies from GitHub's edit history
2. **Script Revert:** Create inverse script with original content (stored in issue-seed files)
3. **Timeline:** Rollback can be done at any point; Phase 3 execution can be delayed if needed

---

## Post-Execution Steps

After Batch 1 is complete:

1. **Commit History:** Create commit documenting the issue rewrites

   ```bash
   git add .github/projects/active/wave-5-documentation-audit/batch-1-execution/
   git commit -m "docs(wave-5): execute Batch 1 issue rewrites for Phase 3 alignment"
   ```

2. **Next Batch:** Proceed with Batch 2 on 2026-08-06
   - File Organization issues (#906, #925, #927)

3. **Documentation:** Update project INDEX.md with execution status

---

## Notes

- Issue body files are preserved locally for reference and potential future batches
- Script can be re-run if needed (idempotent)
- Changes are non-destructive (replaces content, doesn't delete)
- All changes maintain GitHub history (edit history preserved)

---

**Ready to proceed?** Review the dry-run output above, then run the execute command when team approval is obtained.

---

*Prepared: 2026-07-31*  
*For: Batch 1 of 4 GitHub Issue Rewrites*  
*Part of: Wave 5 Documentation Audit Phase 3 Execution*
