---
title: "Stacked PR Plan — Reports & Projects Restructuring"
description: "Detailed plan for creating and managing stacked pull requests for Phases 2-4"
type: "implementation-plan"
created_date: "2026-08-11"
status: "active"
---

# Stacked PR Plan — Reports & Projects Restructuring

## Overview

This document outlines the stacked PR strategy for implementing Phases 2-4 of the Reports & Projects Restructuring Initiative. Uses GitHub's [Stacked Pull Requests](https://docs.github.com/en/pull-requests/how-tos/stacked-pull-requests) feature for clean dependency management.

---

## PR Structure

```
develop (main branch)
  ↓
PR #1730 (Phase 1: Planning) ← MERGED
  ↓
PR Phase 2 (Folder Structure & Linking) [Based on Phase 1]
  ↓
PR Phase 3 (Archive Workflow & Automation) [Based on Phase 2]
  ↓
PR Phase 4 (Cleanup & Documentation) [Based on Phase 3]
```

---

## Phase 2 PR: Folder Structure & Linking

**Timeline:** 2026-08-18 to 2026-08-31  
**Related Issues:** [#1733](https://github.com/lightspeedwp/.github/issues/1733), [#1736](https://github.com/lightspeedwp/.github/issues/1736), [#1737](https://github.com/lightspeedwp/.github/issues/1737)

### Branch Setup

```bash
# After Phase 1 PR #1730 is merged
git checkout develop
git pull origin develop
git checkout -b phase-2/reports-restructuring
```

### Deliverables

1. **Folder Structure Creation**
   - Create `.github/reports/active/` folder
   - Create `.github/reports/archive/` with subfolders:
     - `weekly-summaries/` (25 weekly summary reports)
     - `deprecated-audits/` (40+ old audit reports)
     - `workflow-artifacts/` (3 workflow report files)
     - `a11y-completed/` (4 a11y audit reports)
     - `historical/` (2 old migration guides)

2. **Report Migrations** (via `git mv`)
   - Move 25 weekly summaries to `archive/weekly-summaries/`
   - Move 40+ audits from June 2026 to `archive/deprecated-audits/`
   - Move workflow artifacts to `archive/workflow-artifacts/`
   - Move a11y reports to `archive/a11y-completed/`
   - Move old migrations to `archive/historical/`
   - Keep 25 active reports in appropriate `active/` subfolders

3. **Project Linking**
   - Update openspec project with "Related Issues" section
   - Link to issues #1739-1742 (agent-tool-permission-alignment)
   - Determine status of markdown-audit-ci-optimization
   - Update README for linking project or mark for archival

4. **Update All Projects** (31 total)
   - Add "Related Issues" section to all project READMEs
   - Use format from [LINKING_STANDARD.md](./LINKING_STANDARD.md)
   - Link to relevant GitHub issues
   - Validate all links work

5. **Update GitHub Issues**
   - Add "Related Projects" comments to all linked issues
   - Update issue descriptions with links back to projects

### Git Commit Pattern

```bash
git add .github/reports/active/
git add .github/reports/archive/
git commit -m "chore: Create new reports folder structure

Create active/ and archive/ folders with proper categorization.

- Create active/ for current reports
- Create archive/weekly-summaries/ for 25 weekly summaries
- Create archive/deprecated-audits/ for 40+ old audits
- Create archive/workflow-artifacts/ for 3 workflow reports
- Create archive/a11y-completed/ for 4 a11y reports
- Create archive/historical/ for 2 old migrations

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

git add .github/projects/active/
git commit -m "chore: Link all 31 projects to GitHub issues

Add 'Related Issues' section to all project READMEs using linking standard.

- openspec linked to #1739-1742
- markdown-audit-ci-optimization reviewed and linked or archived
- All 29 other projects verified for issue links
- Update 31 issues with 'Related Projects' comments

Resolves #1733, #1736, #1737

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

### PR Description

```markdown
## Summary

Phase 2 of Reports & Projects Restructuring: folder structure reorganization
and complete project-to-issue linking.

## Changes

### Folder Structure
- Created `.github/reports/active/` for current reports (25 files)
- Created `.github/reports/archive/` with 5 subcategories:
  - `weekly-summaries/` (25 files)
  - `deprecated-audits/` (40+ files)
  - `workflow-artifacts/` (3 files)
  - `a11y-completed/` (4 files)
  - `historical/` (2 files)

### Project Linking
- Added "Related Issues" to all 31 projects
- Linked openspec to #1739-1742 (agent-tool-permission-alignment)
- Reviewed markdown-audit-ci-optimization status
- Updated all 31 related issues with "Related Projects" comments

## Validation

✅ All reports migrated (0 in root except README.md)
✅ All 31 projects have ≥1 linked issue
✅ Bidirectional linking complete
✅ GitHub preview validates all links

## Related Issues

Resolves:
- [#1733](https://github.com/lightspeedwp/.github/issues/1733) — Phase 2 task
- [#1736](https://github.com/lightspeedwp/.github/issues/1736) — Link openspec
- [#1737](https://github.com/lightspeedwp/.github/issues/1737) — Link markdown-audit

Related to:
- [#1731](https://github.com/lightspeedwp/.github/issues/1731) — Master epic
- [#1732](https://github.com/lightspeedwp/.github/issues/1732) — Phase 1 (completed by #1730)

Enables:
- Phase 3 PR (Archive Workflow)
- Phase 4 PR (Cleanup & Documentation)

---

🤖 Generated with Claude Code
```

---

## Phase 3 PR: Archive Workflow & Automation

**Timeline:** 2026-09-01 to 2026-09-14  
**Related Issues:** [#1734](https://github.com/lightspeedwp/.github/issues/1734)  
**Base Branch:** `phase-2/reports-restructuring` (after Phase 2 PR is merged)

### Deliverables

1. **Archive Workflow Design & Implementation**
   - Document manual archive process (Option A, recommended)
   - Create `.archive-status.md` template
   - Example: Archive first completed project with template

2. **CI Validation for Project Linking**
   - Create workflow: `validate-project-linking.yml`
   - Rule: All projects in `.github/projects/active/` must have ≥1 linked issue
   - Flag orphaned projects in PR comments

3. **Documentation Updates**
   - Update `CLAUDE.md` with archive process
   - Document `.archive-status.md` format
   - Create archive process guide in project folder

4. **Testing**
   - Test on completed project (dry run)
   - Verify link preservation
   - Document any issues found

### Branch Setup

```bash
# After Phase 2 PR is merged
git checkout develop
git pull origin develop
git checkout -b phase-3/archive-workflow
```

---

## Phase 4 PR: Cleanup & Documentation

**Timeline:** 2026-09-15 to 2026-09-21  
**Related Issues:** [#1735](https://github.com/lightspeedwp/.github/issues/1735)  
**Base Branch:** `phase-3/archive-workflow` (after Phase 3 PR is merged)

### Deliverables

1. **Final Cleanup**
   - Remove temporary files/artifacts
   - Verify zero reports in root (except README.md)
   - Final validation of all links

2. **Documentation Updates**
   - Update `.github/reports/README.md` with lifecycle policy
   - Create `docs/LINKING_STANDARD.md` (public reference)
   - Update `CLAUDE.md` with full structure reference
   - Create `.github/projects/active/README.md` index

3. **Team Communication**
   - Document archive process for team
   - Create FAQ for common questions
   - Training notes for future projects

4. **Project Completion**
   - Mark this project as complete
   - Document outcomes & lessons learned
   - Archive this project folder (if complete)

---

## Workflow & Merge Process

### Creating Each Stacked PR

```bash
# After previous phase PR is merged into develop:
git checkout develop
git pull origin develop
git checkout -b phase-N/description

# Make changes
git commit -m "..."

# Push and create PR
git push -u origin phase-N/description
gh pr create --title "Phase N: ..." --body "..." \
  --base develop \
  --label type:task --label priority:important
```

### Merging & Rebasing

GitHub automatically handles rebasing when a stacked PR's base is merged:

1. **Merge Phase 2 PR:**
   - `git merge --squash phase-2/reports-restructuring` into develop
   - Phase 3 PR automatically rebases on new develop

2. **Merge Phase 3 PR:**
   - `git merge --squash phase-3/archive-workflow` into develop
   - Phase 4 PR automatically rebases

3. **Merge Phase 4 PR:**
   - `git merge --squash phase-4/cleanup-docs` into develop
   - Initiative complete!

### Merge Command

```bash
gh pr merge PHASE_PR_NUMBER --squash
```

---

## Timeline Summary

| Phase | PR | Base | Start | End | Status |
|-------|----|----|-------|-----|--------|
| 1 | [#1730](https://github.com/lightspeedwp/.github/pull/1730) | develop | 2026-08-11 | Now | 🔄 Merge pending |
| 2 | TBD | Phase 1 | 2026-08-18 | 2026-08-31 | 📋 Ready to create |
| 3 | TBD | Phase 2 | 2026-09-01 | 2026-09-14 | 📋 Ready to create |
| 4 | TBD | Phase 3 | 2026-09-15 | 2026-09-21 | 📋 Ready to create |

---

## Success Criteria

✅ All 4 phases merged to develop by 2026-09-21  
✅ Each PR focused on single phase (no scope creep)  
✅ All related issues closed by corresponding PR  
✅ Bidirectional linking maintained throughout  
✅ Clean git history with squash merges  
✅ Team trained on new structure  

---

## Related Documents

- [README.md](./README.md) — Project overview
- [PLANNING.md](./PLANNING.md) — Phase-by-phase detailed planning
- [LINKING_STANDARD.md](./LINKING_STANDARD.md) — Linking patterns
- [AUDIT_RESULTS.md](./AUDIT_RESULTS.md) — Detailed audit findings

---

**Plan Status:** 📋 Ready to execute  
**Target Start Phase 2:** 2026-08-18  
**Target Completion:** 2026-09-21
