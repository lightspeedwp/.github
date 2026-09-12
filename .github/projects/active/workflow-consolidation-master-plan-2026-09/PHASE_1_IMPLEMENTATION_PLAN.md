---
file_type: implementation-plan
title: "Phase 1: Workflow Backup & Archive — Implementation Plan"
description: "Detailed execution plan for backing up and archiving 62 non-essential workflows"
status: planning
created: "2026-09-11"
phase: 1
phase_duration: "2 weeks"
effort_hours: "8-10"
branch: "refactor/workflow-consolidation-and-archiving"
pr_type: "refactor"
related_epic: "[Epic] Workflow Consolidation Initiative (TBD #XXXX)"
---

# Phase 1 Implementation Plan: Workflow Backup & Archive

## Overview

**Phase 1 Goal:** Safely backup all 62 non-essential workflows and prepare repository for Phase 2 consolidation work.

**Duration:** 2 weeks (Sep 16-30, 2026)  
**Effort:** 8-10 hours  
**Branch:** `refactor/workflow-consolidation-and-archiving`  
**PR Type:** `type:refactor` (using refactor PR template)  
**Related Issues:** Epic + 5-6 sub-tasks

---

## Technical Context

### Current State
- **76 active workflows** in `.github/workflows/`
- **Scheduled job collisions** at 3am UTC
- **15-20 duplicate implementations** across labeling, validation, testing
- **No backup** of workflows before consolidation

### Target State
- **62 non-essential workflows archived** to `.github/workflows/archived/2026-09-11/`
- **14 core workflows identified** (ready for Phase 2 implementation)
- **Consolidation mapping documented** (old workflow → new consolidated workflow)
- **Backup manifest created** for historical reference & rollback

### Success Criteria
- ✅ All 62 workflows backed up with original timestamps preserved
- ✅ Consolidation mapping documented (relationship matrix)
- ✅ Archive directory structure clear and organized
- ✅ README guides future maintenance
- ✅ Zero data loss, full restore capability

---

## Execution Steps

### Step 1: Prepare Archive Directory Structure

**File:** `.github/workflows/archived/2026-09-11/README.md`

Create directory structure for archived workflows:

```
.github/workflows/
├── archived/
│   ├── 2026-09-11/
│   │   ├── README.md (index & navigation)
│   │   ├── RESTORE.md (restore instructions)
│   │   ├── labeling/ (9 workflows)
│   │   ├── validation/ (12 workflows)
│   │   ├── documentation/ (8 workflows)
│   │   ├── issue-management/ (10 workflows)
│   │   ├── pr-management/ (7 workflows)
│   │   ├── testing/ (8 workflows)
│   │   ├── ci-cd/ (8 workflows)
│   │   └── utilities/ (8 workflows)
│   └── INDEX.md (archive index by date)
└── (14 core workflows remain here)
```

**Action Items:**
- [ ] Create `.github/workflows/archived/2026-09-11/` directory
- [ ] Create `README.md` with archive purpose and navigation
- [ ] Create subdirectories for each category
- [ ] Create `INDEX.md` for multi-archive tracking

### Step 2: Move & Organize 62 Workflows

**By Category:**

#### Labeling (9 → Archive)
- `labeling.yml`
- `labeling-governance.yml`
- `issue-labeling-automation.yml`
- `meta-labels-sync.yml`
- `batch-label-prs.yml`
- `remediate-bare-labels.yml`
- `validate-issue-labels.yml`
- `label-audit-report.yml`
- `openspec-sync-labels.yml`

**Action Items:**
- [ ] Move all 9 labeling workflows to `.github/workflows/archived/2026-09-11/labeling/`
- [ ] Preserve `.github/workflows/` symlink for Phase 2 (when labeling-unified.yml is created)
- [ ] Document labeling consolidation mapping in ARCHIVED_WORKFLOWS_MANIFEST.md

#### Validation (12 → Archive)
- `branch-name-validation.yml`
- `pr-template-validation.yml`
- `changelog-safety-audit.yml`
- `validate-dor-dod-sections.yml`
- `docs-validation.yml`
- `linting.yml`
- `markdown-audit-ci-optimization.yml`
- `workflow-validation.yml`
- `validate-blocking-issue-before-close.yml`
- `validate-blocking-status-before-close.yml`
- `validate-project-linking.yml`
- `checks.yml` (portions merged into multiple)

**Action Items:**
- [ ] Move all 12 validation workflows to `.github/workflows/archived/2026-09-11/validation/`
- [ ] Document validation consolidation mapping

#### Documentation (8 → Archive)
- `docs-validation.yml`
- `docs-maintenance.yml`
- `badges-readme-status.yml`
- `badges-documentation-update.yml`
- `badges-verification.yml`
- `badges-health-check.yml`
- `badges-workflow-audit.yml`
- `awesome-github-site.yml`

**Action Items:**
- [ ] Move all 8 documentation workflows to `.github/workflows/archived/2026-09-11/documentation/`
- [ ] Document documentation consolidation mapping

#### Issue Management (10 → Archive)
- `issue-management-orchestration.yml`
- `issue-create-enhanced.yml`
- `issue-audit-remediation.yml`
- `issue-compliance.yml`
- `issue-remediation-automation.yml`
- `issues.yml`
- `issues-automation.yml`
- `normalize-titles.yml`
- `meta-agent-validation.yml`
- `metadata-governance.yml` (portions merged into events workflow)

**Action Items:**
- [ ] Move all 10 issue workflows to `.github/workflows/archived/2026-09-11/issue-management/`
- [ ] Document issue management consolidation mapping

#### PR Management (7 → Archive)
- `enforce-pr-issue-linking.yml`
- `allocate-pr-issue-to-milestone.yml`
- `pr-template-validation.yml` (note: also in validation)
- `pr-validation.yml`
- `pr-template-resolver.yml`
- `planner.yml`
- `reviewer.yml`

**Action Items:**
- [ ] Move all 7 PR workflows to `.github/workflows/archived/2026-09-11/pr-management/`
- [ ] Document PR management consolidation mapping

#### Testing (8 → Archive)
- `testing.yml`
- `release-e2e-tests.yml`
- `checks.yml` (test portions)
- (5 additional test-related workflows)

**Action Items:**
- [ ] Move all 8 testing workflows to `.github/workflows/archived/2026-09-11/testing/`
- [ ] Document testing consolidation mapping

#### CI/CD (8 → Archive)
- `build.yml`
- `cleanup-branches.yml`
- `branch-cleanup.yml`
- (5 additional CI/CD workflows)

**Action Items:**
- [ ] Move all 8 CI/CD workflows to `.github/workflows/archived/2026-09-11/ci-cd/`
- [ ] Document CI/CD consolidation mapping

#### Utilities (8 → Archive)
- `meta.yml`
- `meta-labels-sync.yml` (also in labeling)
- `gitleaks.yml`, `gitleaks-update.yml`, `gitleaks-reusable.yml` (3 → 1 in Phase 2)
- `actions-minute-savings-watch.yml`
- `agent-spec-validation.yml`
- `openspec-*.yml` (3 workflows → 1)
- `main-branch-guard.yml`

**Action Items:**
- [ ] Move all 8 utility workflows to `.github/workflows/archived/2026-09-11/utilities/`
- [ ] Document utility consolidation mapping

### Step 3: Create Consolidation Mapping Document

**File:** `.github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md`

Create comprehensive mapping table showing:
- Old workflow name → New consolidated workflow
- Feature coverage & dependencies
- When Phase 2 replacement is ready

**Example Table:**

| Old Workflow | New Workflow (Phase 2) | Category | Status | Notes |
|---|---|---|---|---|
| `labeling.yml` | `labeling-unified.yml` | Labeling | Archived | Auto-label from PR template frontmatter |
| `labeling-governance.yml` | `labeling-unified.yml` | Labeling | Archived | Label validation + governance |
| `issue-labeling-automation.yml` | `labeling-unified.yml` | Labeling | Archived | Issue type allocation |
| ... | ... | ... | ... | ... |

**Action Items:**
- [ ] Create `.github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md`
- [ ] Add all 76 workflows with mappings
- [ ] Add feature coverage matrix
- [ ] Add timeline (when Phase 2 ready)

### Step 4: Create Archive Manifest

**File:** `.github/workflows/archived/2026-09-11/ARCHIVED_WORKFLOWS_MANIFEST.md`

Document:
- Archive date & reason
- Total workflows archived (62)
- Directory structure
- How to restore individual workflows
- How to restore all workflows
- Related issue/PR links

**Action Items:**
- [ ] Create manifest document
- [ ] Add restoration instructions
- [ ] Add directory listing with file sizes
- [ ] Document decision rationale for each category

### Step 5: Create Archive Index

**File:** `.github/workflows/archived/INDEX.md`

Create multi-year archive index:

```markdown
# GitHub Workflows Archive Index

## 2026-09-11 Archive
- **Date:** Sep 11, 2026
- **Reason:** Workflow Consolidation Initiative Phase 1
- **Workflows:** 62 (labeling, validation, documentation, etc.)
- **Epic Issue:** [#XXXX](../../issues/XXXX)
- **PR:** [#YYYY](../../pull/YYYY)
- **Restore Instructions:** See [2026-09-11/RESTORE.md](./2026-09-11/RESTORE.md)

[Additional archives...]
```

**Action Items:**
- [ ] Create `.github/workflows/archived/INDEX.md`
- [ ] Add 2026-09-11 archive entry
- [ ] Add structure for future archives

### Step 6: Create Restore Documentation

**File:** `.github/workflows/archived/2026-09-11/RESTORE.md`

Document how to restore workflows if needed:

```bash
# Restore individual workflow
git show refactor/workflow-consolidation-and-archiving:.github/workflows/archived/2026-09-11/labeling/labeling.yml > .github/workflows/labeling.yml

# Restore all workflows from archive
git checkout refactor/workflow-consolidation-and-archiving .github/workflows/archived/2026-09-11/
# Then move files from archived/ back to .github/workflows/
```

**Action Items:**
- [ ] Create `.github/workflows/archived/2026-09-11/RESTORE.md`
- [ ] Document command-line restore procedures
- [ ] Document Git restore procedures
- [ ] Add rollback decision criteria

### Step 7: Update Main Automation Documentation

**File:** `.github/docs/AUTOMATION.md`

Update main automation strategy document:
- Reflect new 14-workflow architecture
- Link to consolidation mapping
- Update workflow table with new workflows

**Action Items:**
- [ ] Update AUTOMATION.md with new workflow list
- [ ] Add links to consolidation project
- [ ] Add timeline for Phase 2 & Phase 3

### Step 8: Create GitHub Epic Issue

**Template:** `type:epic`

```markdown
# [Epic] Workflow Consolidation Initiative 2026-Q4

Consolidate 76+ GitHub workflows into 14 core unified workflows to eliminate duplication,
reduce GitHub Actions minutes, and improve maintainability.

## Scope
- Phase 1: Backup & Archive 62 non-essential workflows
- Phase 2: Build 14 core consolidated workflows
- Phase 3: Testing & Validation

## Timeline
- Phase 1: Sep 16-30 (Week 1-2)
- Phase 2: Oct 1-15 (Week 3-5)
- Phase 3: Oct 16-22 (Week 6-7)

## Related Issues
- #XXXX Phase 1: Backup & Archive
- #XXXX Phase 1: Create Consolidation Mapping
- #XXXX Phase 1: Create Archive Documentation
- #XXXX Phase 2: Build Labeling Unified Workflow
- #XXXX Phase 2: Build Validation Unified Workflow
- #XXXX Phase 2: Build Quality Gates Workflow
- (Additional issues per phase)

## Success Criteria
- [ ] 62 workflows archived safely
- [ ] Consolidation mapping complete
- [ ] Archive documentation ready
- [ ] Phase 2 preparation underway
```

**Action Items:**
- [ ] Create epic issue with GitHub API or CLI
- [ ] Add to project board
- [ ] Link sub-issues

### Step 9: Create Sub-Issues for Phase 1

**Sub-Issue 1: Backup & Archive Workflows**
```
type:refactor
Area: automation
Related: Epic #XXXX

Tasks:
- [ ] Create archive directory structure
- [ ] Move all labeling workflows (9)
- [ ] Move all validation workflows (12)
- [ ] Move all documentation workflows (8)
- [ ] Move all issue management workflows (10)
- [ ] Move all PR management workflows (7)
- [ ] Move all testing workflows (8)
- [ ] Move all CI/CD workflows (8)
- [ ] Move all utility workflows (8)
```

**Sub-Issue 2: Create Consolidation Mapping**
```
type:refactor
Area: documentation
Related: Epic #XXXX

Tasks:
- [ ] Create WORKFLOW_CONSOLIDATION_MAPPING.md
- [ ] Add all 76 workflows with mappings
- [ ] Add feature coverage matrix
- [ ] Add timeline for Phase 2
- [ ] Add rollback procedures
```

**Sub-Issue 3: Archive Documentation**
```
type:refactor
Area: documentation
Related: Epic #XXXX

Tasks:
- [ ] Create archive README.md
- [ ] Create archive MANIFEST.md
- [ ] Create RESTORE.md procedures
- [ ] Create INDEX.md for multi-year tracking
- [ ] Document decision rationale
```

**Sub-Issue 4: Update Main Automation Docs**
```
type:refactor
Area: documentation
Related: Epic #XXXX

Tasks:
- [ ] Update AUTOMATION.md with new architecture
- [ ] Add workflow consolidation mapping link
- [ ] Update workflow inventory table
- [ ] Add Phase 2 & 3 timeline
- [ ] Add consolidation project links
```

**Sub-Issue 5: Create GitHub Epic + Planning**
```
type:refactor
Area: project-management
Related: Epic #XXXX

Tasks:
- [ ] Create epic issue for workflow consolidation
- [ ] Create sub-issues for Phase 1 (5 issues)
- [ ] Add to project board
- [ ] Link to master plan documentation
- [ ] Add timeline & milestones
```

**Action Items:**
- [ ] Create 5 sub-issues with type:refactor
- [ ] Add to project board
- [ ] Link to epic
- [ ] Assign team members

---

## PR Structure: type:refactor

### PR Template: `pr_refactor.md`

The PR will use the standard refactor template with:

**Title:** `refactor: consolidate workflow archive and mapping — Phase 1 prep`

**Labels (from frontmatter):**
- `type:refactor`
- `status:needs-review`
- `priority:normal`
- `area:automation`
- `area:ci`
- `meta:needs-review`

**Body Sections:**

1. **Linked Issues**
   - Closes #XXXX (Epic)
   - Relates to #YYYY, #ZZZZ (Sub-issues)

2. **Changelog**
   - Archived 62 non-essential workflows to `.github/workflows/archived/2026-09-11/`
   - Created consolidation mapping documentation
   - Added archive restoration procedures
   - Updated AUTOMATION.md with new architecture

3. **Summary**
   - Phase 1 of workflow consolidation initiative
   - Safely archives 62 workflows (labeling, validation, testing, etc.)
   - Prepares repository for Phase 2 (build 14 core workflows)
   - No functionality changes (archived workflows not removed from codebase)

4. **Test Plan**
   - Verify archive directory structure
   - Test restore procedures
   - Verify mappings are accurate
   - Manual testing of consolidation mapping document
   - No CI test coverage needed (documentation + file organization)

5. **Checklist**
   - [ ] All 62 workflows archived with timestamps preserved
   - [ ] Consolidation mapping complete & accurate
   - [ ] Archive documentation created
   - [ ] Restore procedures tested
   - [ ] AUTOMATION.md updated
   - [ ] No breaking changes
   - [ ] All related issues linked
   - [ ] Project board updated

---

## Files to Create/Update

### New Files
```
.github/workflows/archived/
├── 2026-09-11/
│   ├── README.md
│   ├── ARCHIVED_WORKFLOWS_MANIFEST.md
│   ├── RESTORE.md
│   ├── labeling/ (9 workflows)
│   ├── validation/ (12 workflows)
│   ├── documentation/ (8 workflows)
│   ├── issue-management/ (10 workflows)
│   ├── pr-management/ (7 workflows)
│   ├── testing/ (8 workflows)
│   ├── ci-cd/ (8 workflows)
│   └── utilities/ (8 workflows)
└── INDEX.md

.github/docs/
└── WORKFLOW_CONSOLIDATION_MAPPING.md
```

### Updated Files
- `.github/docs/AUTOMATION.md` (add new workflow architecture section)
- `.github/projects/active/workflow-consolidation-master-plan-2026-09/PHASE_1_IMPLEMENTATION_PLAN.md` (this file)

### GitHub Issues (To Create)
- 1 Epic: Workflow Consolidation Initiative 2026-Q4
- 5 Sub-issues (type:refactor):
  - Backup & Archive Workflows
  - Create Consolidation Mapping
  - Archive Documentation
  - Update Main Automation Docs
  - Create GitHub Epic + Planning

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Accidental deletion of archived workflows | Keep on branch; only merge after review; full git history preserved |
| Incomplete mapping | Review consolidation mapping for accuracy; test restore procedures |
| Missing workflows | Manual inventory check before archiving; compare file counts |
| Restore procedure failure | Document & test restore procedures before PR merge |
| Documentation completeness | Create comprehensive README + manifest + restore docs |

---

## Success Criteria (Phase 1)

- ✅ All 62 workflows archived to `.github/workflows/archived/2026-09-11/`
- ✅ Consolidation mapping document created & accurate
- ✅ Archive documentation complete
- ✅ Restore procedures documented & tested
- ✅ AUTOMATION.md updated with new architecture
- ✅ GitHub epic + 5 sub-issues created
- ✅ PR approved & merged to develop
- ✅ Zero data loss, full restore capability

---

## Timeline

| Date | Task | Effort |
|------|------|--------|
| Sep 16 | Setup PR, create archive structure, move workflows | 3-4h |
| Sep 17-20 | Create mapping & documentation | 2-3h |
| Sep 20-21 | Create GitHub issues & test restore procedures | 1-2h |
| Sep 22-25 | PR review & refinement | 1-2h |
| Sep 26-30 | Final approval & merge | 0.5-1h |
| **Total** | **Phase 1 Execution** | **8-12h** |

---

## Post-Phase 1 Handoff

When Phase 1 PR merges:
1. Create detailed Phase 2 implementation plan
2. Identify team member for Phase 2 (build 14 core workflows)
3. Prioritize critical path: labeling, validation, quality, linting, testing
4. Schedule Phase 2 kickoff meeting

---

**Phase 1 Status:** 📋 PLANNING COMPLETE — Ready for Execution  
**Branch:** `refactor/workflow-consolidation-and-archiving`  
**PR Type:** `type:refactor`  
**Related Epic:** [Epic] Workflow Consolidation Initiative 2026-Q4 (TBD #XXXX)
