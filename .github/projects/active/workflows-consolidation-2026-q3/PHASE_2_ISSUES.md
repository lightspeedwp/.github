---
name: Phase 2 Issues Template
title: GitHub Issues for Phase 2 Documentation Consolidation
description: Issue templates and tracking for Phase 2 work items
metadata:
  created: 2026-07-24
  phase: 2
  epic: "#1227"
---

# Phase 2 Issues — Documentation Workflows Consolidation

## Overview

Phase 2 of the GitHub Workflows Consolidation Initiative consolidates 4 documentation-related workflows into 2 streamlined workflows.

**Epic:** [#1227](https://github.com/lightspeedwp/.github/issues/1227) — GitHub Workflows Consolidation Initiative

---

## Issue #2.1: Create `docs-validation.yml` Workflow

**Type:** Task  
**Epic:** #1227  
**Phase:** 2 (Documentation Consolidation)  
**Effort:** 2 hours  
**Dependencies:** Phase 1B complete ✅  

### Description

Create a new consolidated workflow that handles all documentation validation on PRs, consolidating validation logic from:

- `validate-mermaid-pr.yml` — Mermaid diagram validation
- `readme-audit.yml` — README structure validation

### Definition of Ready (DoR)

- [x] Source workflows analyzed
- [x] Validation logic documented
- [x] Conditional job structure designed
- [x] Test scenarios identified

### Work Breakdown

1. **Workflow Creation**
   - Create `.github/workflows/docs-validation.yml`
   - Add job 1: `validate-mermaid` (from `validate-mermaid-pr.yml`)
   - Add job 2: `validate-readme` (from `readme-audit.yml`)
   - Configure path-based triggers for `.md` and mermaid files
   - Set up PR commenting for validation results

2. **Job 1: Mermaid Validation**
   - Copy all steps from `validate-mermaid-pr.yml`
   - Add condition: `contains(github.event.pull_request.files.*.filename, '.mmd')` or similar
   - Verify node version consistency
   - Ensure all dependencies installed

3. **Job 2: README Validation**
   - Extract validation logic from `readme-audit.yml`
   - Add condition: `contains(github.event.pull_request.files.*.filename, 'README')`
   - Check frontmatter validity
   - Validate section structure
   - Post results to PR

4. **Integration**
   - Ensure both jobs can run independently
   - Verify proper error handling
   - Test conditional logic

### Definition of Done (DoD)

- [ ] Workflow file created and YAML valid
- [ ] Both validation jobs migrated
- [ ] Conditional logic working correctly
- [ ] Path filters configured for docs changes
- [ ] Manual dispatch option available
- [ ] Tested on sample PR with mermaid changes
- [ ] Tested on sample PR with README changes
- [ ] All validations produce expected output
- [ ] Comments posted to PR with proper format
- [ ] No linting errors (`npm run lint:yaml`)
- [ ] Code review approved
- [ ] Merged to develop

---

## Issue #2.2: Create `docs-maintenance.yml` Workflow

**Type:** Task  
**Epic:** #1227  
**Phase:** 2 (Documentation Consolidation)  
**Effort:** 2.5 hours  
**Dependencies:** Phase 1B complete ✅  

### Description

Create a new consolidated workflow that handles all documentation maintenance tasks, consolidating logic from:

- `readme-regen.yml` — Auto-regenerate README on docs changes
- `readme-update.yml` — Manual README and Mermaid updates
- `readme-audit.yml` — Scheduled README audit

### Definition of Ready (DoR)

- [x] Source workflows analyzed
- [x] Maintenance logic documented
- [x] Scheduling strategy defined
- [x] Conditional job structure designed

### Work Breakdown

1. **Auto-Regenerate Job**
   - Copy all steps from `readme-regen.yml`
   - Add condition: `github.event_name == 'push' && github.ref == 'refs/heads/develop'`
   - Configure to trigger on docs-related file changes
   - Create PR if changes detected

2. **Manual Update Job**
   - Copy all steps from `readme-update.yml`
   - Add condition: `github.event_name == 'workflow_dispatch' && github.event.inputs.action == 'update'`
   - Add input parameter for update scope: `all`, `mermaid`, `staleness` (preserve existing values from original workflow)
   - Execute selected update logic

3. **Scheduled Audit Job**
   - Copy all steps from `readme-audit.yml`
   - Add condition: `github.event_name == 'schedule' || (github.event_name == 'workflow_dispatch' && github.event.inputs.action == 'audit')`
   - Configure schedule: Weekly (e.g., Monday 9 AM UTC)
   - **IMPORTANT:** When `schedule` event fires, `inputs.scope` and `inputs.output_format` are not provided
     - Define default values in workflow: `scope: 'all'`, `output_format: 'markdown'`
     - Use: `${{ inputs.scope || 'all' }}` and `${{ inputs.output_format || 'markdown' }}` in steps
   - Generate comprehensive audit report
   - Post results to discussions or issue

4. **Integration**
   - All jobs can run independently
   - Proper error handling and notifications
   - Concurrency management to prevent conflicts

### Definition of Done (DoD)

- [ ] Workflow file created and YAML valid
- [ ] All three jobs migrated (auto-regen, manual-update, audit)
- [ ] Conditional logic working correctly
- [ ] Auto-regen triggers on develop push
- [ ] Manual update accessible via dispatch
- [ ] Audit scheduled and also manual-dispatchable
- [ ] Tested auto-regen on sample docs change
- [ ] Tested manual dispatch with update action
- [ ] Tested manual dispatch with audit action
- [ ] Schedule doesn't conflict with other workflows
- [ ] No linting errors (`npm run lint:yaml`)
- [ ] Code review approved
- [ ] Merged to develop

---

## Issue #2.3: Integration Testing — Documentation Workflows

**Type:** Task  
**Epic:** #1227  
**Phase:** 2 (Documentation Consolidation)  
**Effort:** 4 hours  
**Dependencies:** #2.1, #2.2 completed  

### Description

Comprehensive integration testing to verify new documentation workflows function correctly and existing behavior is preserved.

### Definition of Ready (DoR)

- [x] docs-validation.yml created and reviewed
- [x] docs-maintenance.yml created and reviewed
- [x] Test scenarios identified
- [x] Sample test files prepared

### Test Scenarios

#### docs-validation.yml Tests

1. **Mermaid Validation Test**
   - Create test PR with `.mmd` file change
   - Verify: `validate-mermaid` job runs
   - Verify: Validation error message posted to PR
   - Verify: Success message posted if valid

2. **README Validation Test**
   - Create test PR with README change
   - Verify: `validate-readme` job runs
   - Verify: Structure validation executed
   - Verify: Results posted to PR

3. **Combined Validation Test**
   - Create test PR with both `.mmd` and README changes
   - Verify: Both jobs run
   - Verify: Both validation results posted

4. **Manual Dispatch Test**
   - Manually dispatch docs-validation.yml
   - Verify: Validation runs correctly

#### docs-maintenance.yml Tests

1. **Auto-Regen Test**
   - Push docs/ file change to develop
   - Verify: readme-regen job triggers
   - Verify: README regenerated or PR created

2. **Manual Update Test**
   - Dispatch docs-maintenance.yml with update action
   - Verify: README/Mermaid updated correctly
   - Verify: Changes committed/PR created

3. **Audit Test**
   - Dispatch docs-maintenance.yml with audit action
   - Verify: Comprehensive audit runs
   - Verify: Report generated and posted

4. **Schedule Test**
   - Verify: Audit job scheduled correctly
   - Check: No scheduling conflicts
   - Confirm: Schedule cron syntax valid

#### Regression Tests

- [ ] All existing validation checks still work
- [ ] Error message format unchanged
- [ ] Comment format and content unchanged
- [ ] Performance comparable to originals (<20% regression)
- [ ] No new errors in workflow logs

### Definition of Done (DoD)

- [ ] All test scenarios executed
- [ ] All validations passing
- [ ] No regressions detected
- [ ] Performance within acceptable range
- [ ] Test results documented
- [ ] Any issues reported as follow-up tasks
- [ ] Code review approved
- [ ] Ready for production deployment

---

## Issue #2.4: Cleanup Old Workflows — Disable & Delete

**Type:** Task  
**Epic:** #1227  
**Phase:** 2 (Documentation Consolidation)  
**Effort:** 1.5 hours  
**Dependencies:** #2.1, #2.2, #2.3 completed and tested  

### Description

Disable and delete the legacy documentation workflows that have been consolidated into the new workflows.

### Definition of Ready (DoR)

- [x] New workflows created and tested
- [x] All functionality verified in new workflows
- [x] 24+ hour monitoring period recommended
- [x] Old workflows backed up in git history

### Work Breakdown

1. **Phase 1: Disable Legacy Workflows** (2 hours prior to deletion)
   - Add `if: false` to top of each workflow file:
     - `.github/workflows/validate-mermaid-pr.yml`
     - `.github/workflows/readme-regen.yml`
     - `.github/workflows/readme-update.yml`
     - `.github/workflows/readme-audit.yml`
   - Commit: `chore(docs): disable legacy workflows during Phase 2 consolidation`
   - Wait 24-48 hours for any issues

2. **Phase 2: Delete Legacy Workflows**
   - Delete files:
     - `.github/workflows/validate-mermaid-pr.yml`
     - `.github/workflows/readme-regen.yml`
     - `.github/workflows/readme-update.yml`
     - `.github/workflows/readme-audit.yml`
   - Commit: `refactor(docs): remove consolidated documentation workflows`

3. **Update Documentation**
   - Update `.github/workflows/README.md`
     - Document removed workflows
     - Reference new consolidated workflows
   - Create `docs/DOCUMENTATION_WORKFLOWS.md` if needed
     - Guide for using new workflows
     - Troubleshooting section
   - Update `CHANGELOG.md`:
     - Document workflow consolidation
     - Link to Phase 2 issue
   - Commit: `docs(workflows): update documentation for Phase 2 consolidation`

### Definition of Done (DoD)

- [ ] All four legacy workflows disabled with `if: false`
- [ ] Commit created and merged
- [ ] Monitoring period completed (24-48 hours)
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

## Issue #2.5: Code Review & Merge Phase 2 Changes

**Type:** Task  
**Epic:** #1227  
**Phase:** 2 (Documentation Consolidation)  
**Effort:** 1.5 hours  
**Dependencies:** #2.1, #2.2, #2.3, #2.4 completed  

### Description

Final code review and merge of all Phase 2 changes to develop branch.

### Definition of Ready (DoR)

- [x] All Phase 2 work items completed
- [x] All tests passing
- [x] All documentation updated
- [x] No blocking issues

### Review Checklist

- [ ] **Workflow Files**
  - [ ] docs-validation.yml syntax valid
  - [ ] docs-maintenance.yml syntax valid
  - [ ] All jobs properly structured
  - [ ] Conditional logic correct
  - [ ] Triggers configured appropriately
  - [ ] Permissions minimal and correct
  - [ ] Concurrency handling proper

- [ ] **Legacy Workflows**
  - [ ] All old workflows disabled or deleted
  - [ ] No broken references in other workflows
  - [ ] Git history preserved for reference

- [ ] **Testing**
  - [ ] All integration tests passing
  - [ ] Regression tests verified
  - [ ] No performance regressions
  - [ ] Sample test PRs show expected behavior

- [ ] **Documentation**
  - [ ] Workflow README updated
  - [ ] Phase 2 documentation complete
  - [ ] CHANGELOG.md entries added
  - [ ] Links correct and verified

- [ ] **Quality**
  - [ ] YAML linting passes
  - [ ] Markdown formatting valid
  - [ ] No unresolved comments
  - [ ] All conversations resolved

### Definition of Done (DoD)

- [ ] PR created: `refactor/docs-workflow-consolidation-phase-2`
- [ ] Base branch: `develop`
- [ ] All commits squashed or properly organized
- [ ] PR description complete with testing notes
- [ ] Code review approved
- [ ] All checks passing
- [ ] Merged to develop
- [ ] Branch deleted after merge
- [ ] Issue closed with Phase 2 summary

---

## Summary

### Phase 2 Work Items

| Issue | Title | Effort | Status |
|-------|-------|--------|--------|
| #2.1 | Create `docs-validation.yml` | 2h | 📋 Ready |
| #2.2 | Create `docs-maintenance.yml` | 2.5h | 📋 Ready |
| #2.3 | Integration Testing | 4h | 📋 Ready |
| #2.4 | Cleanup Old Workflows | 1.5h | 📋 Ready |
| #2.5 | Code Review & Merge | 1.5h | 📋 Ready |
| **Total** | **Phase 2 Completion** | **~12h** | **📋 READY** |

### Success Criteria (Phase 2)

- ✅ 4 workflows consolidated to 2
- ✅ ~150 lines of duplication eliminated
- ✅ All tests passing
- ✅ No breaking changes
- ✅ Documentation updated
- ✅ Changes merged to develop

---

**Epic:** [#1227](https://github.com/lightspeedwp/.github/issues/1227)  
**Timeline:** Weeks 5-7  
**Status:** Ready for Implementation  

*Created: 2026-07-24*  
*Last Updated: 2026-07-24*

*Built by 🧱 LightSpeedWP with ★, 🚀, and open-source spirit!*
