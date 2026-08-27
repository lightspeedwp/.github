---
name: Phase 3 Issues Template
title: GitHub Issues for Phase 3 Labeling & Metadata Consolidation
description: Issue templates and tracking for Phase 3 work items
metadata:
  created: 2026-07-24
  phase: 3
  epic: "#1227"
---

# Phase 3 Issues — Labeling & Metadata Workflows Consolidation

## Overview

Phase 3 of the GitHub Workflows Consolidation Initiative consolidates 4 labeling-related workflows into 2 streamlined workflows while maintaining all label governance and metadata functionality.

**Epic:** [#1227](https://github.com/lightspeedwp/.github/issues/1227) — GitHub Workflows Consolidation Initiative

---

## Issue #3.1: Create `labeling-governance.yml` Workflow

**Type:** Task  
**Epic:** #1227  
**Phase:** 3 (Labeling & Metadata Consolidation)  
**Effort:** 2 hours  
**Dependencies:** Phase 2 complete ✅  

### Description

Create a new consolidated workflow that handles all labeling operations for PRs and issues, consolidating logic from:

- `labeling.yml` — Standard PR/issue labeling by branch/content patterns
- `dependabot-security-label.yml` — Add security label to Dependabot PRs
- `issue-close-label-hygiene.yml` — Remove in-progress labels on issue close

### Definition of Ready (DoR)

- [x] Source workflows analyzed
- [x] Labeling logic documented
- [x] Conditional job structure designed
- [x] Test scenarios identified

### Work Breakdown

1. **Workflow Creation**
   - Create `.github/workflows/labeling-governance.yml`
   - Add job 1: `label-pr` (from `labeling.yml` for PRs)
   - Add job 2: `label-dependabot-security` (from `dependabot-security-label.yml`)
   - Add job 3: `label-issue` (from `labeling.yml` for issues)
   - Add job 4: `cleanup-on-close` (from `issue-close-label-hygiene.yml`)
   - Configure conditional logic for each job

2. **Job 1: PR Labeling**
   - Copy all steps from `labeling.yml` (PR section)
   - Apply labels based on branch prefix (`feat/`, `fix/`, `docs/`, etc.)
   - Verify node version consistency
   - Ensure all dependencies installed

3. **Job 2: Dependabot Security Labeling**
   - Copy all steps from `dependabot-security-label.yml`
   - Add condition: `github.actor == 'dependabot[bot]'`
   - Apply labels: `type:security`, `deps:automatic`
   - Post comment on PR if needed

4. **Job 3: Issue Labeling**
   - Copy logic from `labeling.yml` (issue section)
   - Apply labels by issue type
   - Apply priority labels if mentioned in body

5. **Job 4: Label Cleanup**
   - Copy all steps from `issue-close-label-hygiene.yml`
   - Remove `status:in-progress` on close
   - Remove `status:needs-review` on close
   - Verify cleanup executes only on close action

6. **Integration**
   - Ensure all jobs can run independently
   - Verify proper conditional logic
   - Test label operations via GitHub API

### Definition of Done (DoD)

- [ ] Workflow file created and YAML valid
- [ ] All labeling jobs migrated from source workflows
- [ ] Conditional logic working correctly
- [ ] PR triggers working for labeling
- [ ] Issue triggers working for labeling
- [ ] Label cleanup triggers on close
- [ ] Manual dispatch option available
- [ ] Tested on sample PR with feature branch
- [ ] Tested on sample issue opened
- [ ] Tested on issue close with labels
- [ ] All labels applied with correct format
- [ ] No linting errors (`npm run lint:yaml`)
- [ ] Code review approved
- [ ] Merged to develop

---

## Issue #3.2: Integration Testing — Labeling Workflows

**Type:** Task  
**Epic:** #1227  
**Phase:** 3 (Labeling & Metadata Consolidation)  
**Effort:** 2.5 hours  
**Dependencies:** #3.1 completed  

### Description

Comprehensive integration testing to verify new labeling workflow functions correctly and existing label behavior is preserved.

### Definition of Ready (DoR)

- [x] labeling-governance.yml created and reviewed
- [x] Test scenarios identified
- [x] Sample test branches prepared

### Test Scenarios

#### labeling-governance.yml Tests

1. **PR Branch-Based Labeling Test**
   - Create test PR from `feat/new-widget` → verify `type:feature` label applied
   - Create test PR from `fix/bug-fix` → verify `type:bug` label applied
   - Create test PR from `docs/readme` → verify `type:documentation` label applied
   - Create test PR from `refactor/cleanup` → verify `type:refactor` label applied

2. **Dependabot Security Labeling Test**
   - Verify Dependabot PR → automatically labeled `type:security`, `deps:automatic`
   - Check that standard labeling still applies if Dependabot PR matches pattern
   - Verify Dependabot-specific logic doesn't interfere with other jobs

3. **Issue Type Labeling Test**
   - Create test issue with title containing "bug:" → verify `type:bug` label applied
   - Create test issue with title containing "feature:" → verify `type:feature` label applied
   - Create test issue with priority mention → verify `priority:*` label applied

4. **Label Cleanup on Close Test**
   - Create issue, apply `status:in-progress` label
   - Close the issue → verify `status:in-progress` label removed
   - Create PR, apply `status:needs-review` label
   - Close PR → verify `status:needs-review` label removed

5. **Manual Dispatch Test**
   - Manually dispatch labeling-governance.yml
   - Verify: Workflow runs without errors
   - Verify: Can override labels if needed

#### Regression Tests

- [ ] All existing label rules still work
- [ ] Label names unchanged
- [ ] Trigger behavior consistent (same events trigger labeling)
- [ ] Performance comparable to originals (<20% regression)
- [ ] No new errors in workflow logs
- [ ] PR/issue operations don't fail or timeout

### Definition of Done (DoD)

- [ ] All test scenarios executed
- [ ] All labeling working correctly
- [ ] No regressions detected
- [ ] Performance within acceptable range
- [ ] Test results documented
- [ ] Any issues reported as follow-up tasks
- [ ] Code review approved
- [ ] Ready for production deployment

---

## Issue #3.3: Cleanup & Deprecate Legacy Labeling Workflows

**Type:** Task  
**Epic:** #1227  
**Phase:** 3 (Labeling & Metadata Consolidation)  
**Effort:** 1.5 hours  
**Dependencies:** #3.1, #3.2 completed and tested  

### Description

Disable and delete the legacy labeling workflows that have been consolidated into the new workflow.

### Definition of Ready (DoR)

- [x] New labeling workflow created and tested
- [x] All functionality verified in new workflow
- [x] 24-hour monitoring period planned
- [x] Old workflows backed up in git history

### Work Breakdown

1. **Phase 1: Disable Legacy Workflows** (24 hours before deletion)
   - Add `if: false` to top of each workflow file:
     - `.github/workflows/dependabot-security-label.yml`
     - `.github/workflows/issue-close-label-hygiene.yml`
   - Keep `labeling.yml` but archive (consolidation complete)
   - Commit: `chore(labels): disable legacy labeling workflows during Phase 3`
   - Wait 24 hours for any issues

2. **Phase 2: Delete Legacy Workflows**
   - Delete files:
     - `.github/workflows/dependabot-security-label.yml`
     - `.github/workflows/issue-close-label-hygiene.yml`
   - Archive `labeling.yml` reference in comments/docs
   - Commit: `refactor(labels): remove consolidated labeling workflows`

3. **Update Documentation**
   - Update `.github/workflows/README.md`
     - Document removed workflows
     - Reference new consolidated workflow
   - Create `docs/LABELING_GOVERNANCE.md` if needed
     - Guide for all labeling rules
     - Troubleshooting section
   - Update `CHANGELOG.md`:
     - Document workflow consolidation
     - Link to Phase 3 issue
   - Commit: `docs(workflows): update documentation for Phase 3 consolidation`

### Definition of Done (DoD)

- [ ] All legacy labeling workflows disabled with `if: false`
- [ ] Commit created and merged
- [ ] Monitoring period completed (24 hours)
- [ ] No issues reported from disabling
- [ ] Legacy workflow files deleted
- [ ] Cleanup commit created and merged
- [ ] `.github/workflows/README.md` updated
- [ ] Documentation files updated or created
- [ ] `CHANGELOG.md` entries added
- [ ] All linting passes
- [ ] Code review approved
- [ ] Changes merged to develop

---

## Issue #3.4: Code Review & Merge Phase 3 Changes

**Type:** Task  
**Epic:** #1227  
**Phase:** 3 (Labeling & Metadata Consolidation)  
**Effort:** 1.5 hours  
**Dependencies:** #3.1, #3.2, #3.3 completed  

### Description

Final code review and merge of all Phase 3 changes to develop branch.

### Definition of Ready (DoR)

- [x] All Phase 3 work items completed
- [x] All tests passing
- [x] All documentation updated
- [x] No blocking issues

### Review Checklist

- [ ] **Workflow Files**
  - [ ] labeling-governance.yml syntax valid
  - [ ] All jobs properly structured
  - [ ] Conditional logic correct for each job
  - [ ] Triggers configured appropriately (PR, issues, dispatch)
  - [ ] Permissions minimal and correct
  - [ ] GitHub API usage correct

- [ ] **Legacy Workflows**
  - [ ] All old workflows disabled or deleted
  - [ ] No broken references in other workflows
  - [ ] Git history preserved for reference

- [ ] **Testing**
  - [ ] All integration tests passing
  - [ ] Regression tests verified
  - [ ] No performance regressions
  - [ ] Sample test PRs show expected labeling

- [ ] **Documentation**
  - [ ] Workflow README updated
  - [ ] Phase 3 documentation complete
  - [ ] CHANGELOG.md entries added
  - [ ] Links correct and verified

- [ ] **Quality**
  - [ ] YAML linting passes
  - [ ] Markdown formatting valid
  - [ ] No unresolved comments
  - [ ] All conversations resolved

### Definition of Done (DoD)

- [ ] PR created: `refactor/labeling-consolidation-phase-3`
- [ ] Base branch: `develop`
- [ ] All commits squashed or properly organized
- [ ] PR description complete with testing notes
- [ ] Code review approved
- [ ] All checks passing
- [ ] Merged to develop
- [ ] Branch deleted after merge
- [ ] Issue closed with Phase 3 summary

---

## Summary

### Phase 3 Work Items

| Issue | Title | Effort | Status |
|-------|-------|--------|--------|
| #3.1 | Create `labeling-governance.yml` | 2h | 📋 Ready |
| #3.2 | Integration Testing | 2.5h | 📋 Ready |
| #3.3 | Cleanup & Deprecate | 1.5h | 📋 Ready |
| #3.4 | Code Review & Merge | 1.5h | 📋 Ready |
| **Total** | **Phase 3 Completion** | **~9h** | **📋 READY** |

### Success Criteria (Phase 3)

- ✅ 3-4 workflows consolidated to 2
- ✅ ~180 lines of duplication eliminated
- ✅ All tests passing
- ✅ No breaking changes to labeling behavior
- ✅ Documentation updated
- ✅ Changes merged to develop

---

**Epic:** [#1227](https://github.com/lightspeedwp/.github/issues/1227)  
**Timeline:** Weeks 9-10  
**Status:** Ready for Implementation  
**Dependencies:** Phase 2 completion (expected 2026-07-26)

*Created: 2026-07-24*  
*Last Updated: 2026-07-24*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
