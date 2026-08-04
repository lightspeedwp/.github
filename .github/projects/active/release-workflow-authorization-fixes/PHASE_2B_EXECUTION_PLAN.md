---
file_type: project_document
description: Phase 2B (Script Reorganization) execution plan and inventory
date: 2026-08-02
author: Claude Haiku 4.5
status: in-progress-with-issues
---

# Phase 2B Execution Plan

**Initiative:** Script Organization & Validation (Issue #1461)  
**Phase:** 2B (Portable Scripts Migration)  
**Status:** ⚠️ IN PROGRESS WITH CRITICAL ISSUES  
**Target:** Move 117 portable scripts from `.github/scripts/` to root `scripts/` folder

---

## Critical Issues Identified (2026-08-04)

### Issue 1: Dual Path Problem ❌

- **Finding:** Both `.github/scripts/` (107 files) AND `scripts/` (217 files) exist
- **Impact:** Workflows reference both old `.github/` and new `scripts/` locations
- **Root Cause:** Phase 2B migration was incomplete - scripts were copied but not removed from source
- **Status:** BLOCKING further validation

### Issue 2: Inconsistent Workflow References ❌

- **Finding:** 21 workflows still use `.github/scripts/` references
- **Impact:** Running workflows may fail if files moved without updating references
- **Workflows affected:**
  - documentation.yml
  - docs-maintenance.yml
  - docs-validation.yml
  - labeling.yml
  - labeling-governance.yml
  - issue-remediation-bulk.yml
  - metrics-pipeline.yml
  - project-archival.yml
  - issues.yml
  - metrics-reporting.yml
  - reviewer.yml
  - release.yml
  - meta.yml
  - planner.yml
  - (and 7 more)
- **Status:** CRITICAL - must be resolved before merge

### Issue 3: Missing Project Documentation ❌

- **Finding:** PHASE_2B_EXECUTION_PLAN.md and SCRIPTS_INVENTORY.md not in develop
- **Impact:** Phase 2B progress cannot be tracked or verified
- **Root Cause:** Files created in prior worktree but never committed to develop
- **Status:** Blocking Phase 2C completion

---

## Phase 2B Objectives

### Primary Goal

Reorganize 117 portable scripts from `.github/scripts/` to root-level `scripts/` folder structure while maintaining backward compatibility and updating all references.

### Organizational Structure

```
scripts/
├── validation/              # 59 files - general validation scripts
│   ├── validate-*.js       # Individual validators
│   └── __tests__/          # Unit tests
├── workflows/              # 56 files - GitHub Actions workflow integrations
│   ├── changelog/          # 5 files + tests
│   ├── metrics/            # Metrics aggregation & reporting
│   ├── projects/           # Project archival & management
│   ├── release/            # Release automation
│   └── __tests__/          # Integration tests
└── agents/                 # 102 files - portable agent implementations
    └── includes/           # 62 agent utility libraries
        ├── milestone-assignment.js
        ├── issue-pr-metadata.cjs
        ├── allocate-milestone.cjs
        └── ...

.github/scripts/           # GitHub-ONLY scripts (control-plane specific)
├── agents/                # GitHub-specific agents
│   ├── meta.agent.js
│   ├── issues.agent.js
│   ├── reviewer.agent.js
│   ├── planner.agent.js
│   └── run-labeling-agent.cjs
├── workflows/            # GitHub-specific workflow scripts
│   ├── assign-milestones-workflow.js    # SHOULD MOVE OR REFERENCE
│   └── ...
└── *.js                  # Control-plane validation scripts
    ├── identify-changed-markdown.js
    ├── collect-validation-results.js
    ├── validate-markdown-lint.js
    └── ...
```

---

## Script Classification (Portable vs GitHub-Only)

### PORTABLE (Move to `scripts/`)

Scripts that have **no GitHub-specific assumptions** and can be reused outside this repo:

- ✅ Validation scripts (frontmatter, JSON, links, etc.)
- ✅ Agent utility libraries (milestone assignment, metadata handling)
- ✅ Changelog utilities
- ✅ Schema validators

**Total:** ~160 files

### GITHUB-ONLY (Stay in `.github/scripts/`)

Scripts with **GitHub Actions assumptions** or **control-plane specificity**:

- 🔧 Agent implementations using GitHub API directly
  - meta.agent.js (GitHub project metadata)
  - issues.agent.js (GitHub issue operations)
  - reviewer.agent.js (PR reviewer assignment)
  - planner.agent.js (GitHub project planning)
  - run-labeling-agent.cjs (GitHub labeling)

- 🔧 Workflow integrations with GitHub Actions context
  - Scripts that read `github.event`
  - Scripts that use `core.setOutput()`
  - Scripts that require `@actions/*` packages

**Total:** ~107 files

---

## Phase 2B Execution Status

### Stage 1: Inventory & Classification ✅ DONE

- [x] Identified all scripts
- [x] Classified portable vs GitHub-only
- [x] Documented folder structure

### Stage 2: File Migration 🔄 IN PROGRESS

- [x] Copy portable scripts to root `scripts/`
- ❌ **ISSUE:** Did not remove from `.github/scripts/` (dual state)
- ⏳ Fix required: Remove old files or resolve conflicts

### Stage 3: Reference Updates 🔴 NEEDS IMMEDIATE WORK

- [ ] Update all workflow references (21 files)
  - [ ] documentation.yml
  - [ ] docs-maintenance.yml
  - [ ] docs-validation.yml
  - [ ] labeling.yml
  - [ ] labeling-governance.yml
  - [ ] issue-remediation-bulk.yml
  - [ ] metrics-pipeline.yml
  - [ ] project-archival.yml
  - [ ] issues.yml
  - [ ] metrics-reporting.yml
  - [ ] reviewer.yml
  - [ ] release.yml
  - [ ] meta.yml
  - [ ] planner.yml
  - [ ] (and more)
- [ ] Update all documentation references
- [ ] Update schema path references in scripts

### Stage 4: Testing & Validation ⏳ PENDING

- [ ] Unit tests pass (validation scripts)
- [ ] Integration tests pass (workflow scripts)
- [ ] No regressions in existing functionality
- [ ] All paths resolve correctly

### Stage 5: Archive & Closure ⏳ PENDING

- [ ] Close issue #1461, #1464, #1465
- [ ] Merge to develop
- [ ] Update epic #1376

---

## Required Actions (Blocking)

### ACTION 1: Resolve Dual Path Problem

**Priority:** CRITICAL  
**Owner:** Phase 2C Validation

Need to decide:

1. ❓ Keep both copies (doubles maintenance burden)?
2. ✅ RECOMMENDED: Remove `.github/scripts/` for portable files
3. Keep GitHub-only scripts in `.github/scripts/`

### ACTION 2: Update All Workflow References

**Priority:** CRITICAL  
**Owner:** Phase 2C Validation

For each workflow using `.github/scripts/`:

- Determine if file should be portable or GitHub-only
- Update reference path accordingly
- Test in dry-run mode

**Example:**

```yaml
# BEFORE
run: node .github/scripts/workflows/assign-milestones-workflow.js

# AFTER (if portable)
run: node scripts/workflows/assign-milestones-workflow.js

# OR (if stays in .github/scripts/)
run: node .github/scripts/workflows/assign-milestones-workflow.js
```

### ACTION 3: Verify Schema Path References

**Priority:** HIGH  
**Owner:** Phase 2C Validation

All scripts using schema files need correct relative paths:

- From `scripts/validation/` → `../../../schemas/`
- From `scripts/agents/includes/` → `../../../../schemas/`
- From `scripts/workflows/changelog/` → `../../../../schemas/`

**Current Status:** ⚠️ Partially updated, needs full audit

---

## File Location Reference Matrix

| Script Type | Old Location | New Location | Status |
|------------|-------------|------------|--------|
| Validation | `.github/scripts/validate-*.js` | `scripts/validation/` | ✅ Copied |
| Changelog | `.github/scripts/workflows/changelog/` | `scripts/workflows/changelog/` | ✅ Copied |
| Metrics | `.github/scripts/workflows/metrics/` | `scripts/workflows/metrics/` | ✅ Copied |
| Projects | `.github/scripts/workflows/projects/` | `scripts/workflows/projects/` | ✅ Copied |
| Agent Utils | `.github/scripts/agents/includes/` | `scripts/agents/includes/` | ✅ Copied |
| **GitHub Agents** | `.github/scripts/agents/*.js` | **STAYS** | ✅ No change needed |

---

## Path Reference Updates Needed

### Workflows to Update (21 total)

```
Priority 1 (Highest Impact):
- labeling.yml
- labeling-governance.yml
- release.yml
- changelog-management.yml
- metadata-governance.yml

Priority 2 (Medium Impact):
- issue-remediation-bulk.yml
- issues.yml
- reviewer.yml
- planner.yml
- meta.yml
- docs-maintenance.yml
- docs-validation.yml

Priority 3 (Specific Paths):
- metrics-pipeline.yml
- metrics-reporting.yml
- project-archival.yml
- documentation.yml
```

### Documentation to Update (28 files)

All `docs/*.md` files referencing `.github/scripts/` need updates to reflect new structure.

---

## Test Coverage Requirements

### Unit Tests (Must Pass)

```bash
npm test
# Expected: 1,114+ tests passing
```

### Validation Tests (Must Pass)

```bash
npm run validate:all
# Expected: All 13 validators passing
```

### Workflow Tests (Recommended)

```bash
# For each workflow using scripts:
# 1. Verify script path resolution
# 2. Dry-run with test inputs
# 3. Confirm no breaking changes
```

---

## Success Criteria

✅ Phase 2B is COMPLETE when:

- [x] Portable scripts migrated to `scripts/`
- [ ] All workflow references updated ⚠️ BLOCKING
- [ ] All documentation updated
- [ ] All unit tests passing
- [ ] No path resolution errors
- [ ] Zero regressions in existing workflows
- [ ] `.github/scripts/` contains only GitHub-specific code
- [ ] Pull request merged to develop

---

## Timeline

| Phase | Target | Status |
|-------|--------|--------|
| 2B.1 | Inventory & classification | ✅ DONE (2026-08-02) |
| 2B.2 | File migration | ✅ DONE (2026-08-02) |
| 2B.3 | Reference updates | 🔴 **BLOCKED** |
| 2B.4 | Testing & validation | ⏳ WAITING FOR 2B.3 |
| 2B.5 | Merge & archive | ⏳ WAITING FOR 2B.4 |

**Current Status:** Phase 2B is **INCOMPLETE** due to unresolved path references.

---

## Related Issues & Epics

- **Issue #1461:** Script Organization Architecture (parent)
- **Issue #1464:** Phase 2B Execution (THIS PHASE)
- **Issue #1465:** Phase 2C Testing & Documentation
- **Epic #1376:** Script Organization & Validation
- **PR #1482:** Initial script movement (NEEDS REWORK)
- **PR #1483:** Changelog utilities (merged with caveats)
- **PR #1484:** Path reference updates (INCOMPLETE)

---

## Notes & Observations

### What Went Wrong

1. Scripts were copied to `scripts/` but not removed from `.github/scripts/`
2. Not all workflow references were updated
3. Phase 2B was merged to develop before Phase 2C validation completed
4. No comprehensive reference audit was performed before marking complete

### What Needs to Happen Now (Phase 2C Fix)

1. **Resolve dual paths:** Consolidate portable scripts, clean up `.github/scripts/`
2. **Update all references:** 21 workflows + 28 docs need path corrections
3. **Verify execution:** Test each workflow with new paths
4. **Document rationale:** Explain which scripts are portable vs GitHub-only
5. **Complete audit:** Ensure NO orphaned or duplicate scripts

### Prevention for Future Phases

- Run full reference audit BEFORE marking phase complete
- Use automated path validation in CI/CD
- Require workflow dry-run tests before merge
- Maintain clear portable vs GitHub-only classification

---

**Document Status:** ⚠️ This plan reflects CURRENT findings from Phase 2C audit.  
**Last Updated:** 2026-08-04 (by Phase 2C validation)  
**Ready for:** Immediate remediation in Phase 2C.X (scope expansion)

---

*This document was created to address critical gaps identified during Phase 2C validation. Phase 2B marked as INCOMPLETE pending reference updates.*
