---
file_type: documentation
title: "PROJECT TRACKER"
description: "Project documentation"
last_updated: "2026-08-25"
status: active
---

# GitHub Actions v7 Upgrade — Project Tracker

## Epic Overview

**Title:** GitHub Actions v7 Upgrade Initiative  
**Type:** epic  
**Status:** 🔄 PLANNING  
**Created:** 2026-08-09  
**Target completion:** 2026-08-23  
**Owner:** claude  
**Related Epic:** #1641 (Badges Workflow Integration)

---

## Child Issues Checklist

### Phase 1: Audit & Planning ✅

- [x] Audit all 45 workflows
- [x] Document findings in PROJECT_README.md
- [x] Create OpenSpec specification (OPENSPEC_ANALYSIS.md)
- [x] Create upgrade plan (UPGRADE_PLAN.md)
- [ ] Create GitHub issues (Epic + 5 child issues)
- [ ] Rename branch to `feat/github-actions-v7-upgrade`

**Issue:** `#[TBD] - Phase 1: Audit & Planning`

- Type: task
- Status: In Progress
- Assigned to: claude
- Milestone: (TBD)

---

### Phase 2: Badge Workflows Upgrade

- [ ] Review badge workflow changes needed (4 files)
- [ ] Update `badges-readme-status.yml`
- [ ] Update `badges-health-check.yml`
- [ ] Update `badges-documentation-update.yml`
- [ ] Update `badges-workflow-audit.yml`
- [ ] Create PR and validate
- [ ] Merge to develop
- [ ] Verify Phase 4 integration tests pass

**Issue:** `#[TBD] - Phase 2: Badge Workflows Upgrade`

- Type: task
- Status: Planned
- Assigned to: claude
- Milestone: (TBD)
- Labels: type:bug, area:ci, priority:critical
- Blockers: Phase 1 completion

**Scope (4 files):**

```
.github/workflows/badges-readme-status.yml
.github/workflows/badges-health-check.yml
.github/workflows/badges-documentation-update.yml
.github/workflows/badges-workflow-audit.yml
```

**Changes:**

- Invalid SHA → v7 (checkout)
- Invalid SHA → v7 (setup-node)

---

### Phase 3: Standard Workflow Upgrades

#### Phase 3A: Automation Workflows

- [ ] Review automation workflow changes needed (2 files)
- [ ] Update `cleanup-branches.yml`
- [ ] Update `issue-labeling-automation.yml`
- [ ] Create PR and validate
- [ ] Merge to develop

**Issue:** `#[TBD] - Phase 3A: Automation Workflows Upgrade`

- Type: task
- Status: Planned
- Assigned to: claude
- Milestone: (TBD)
- Blockers: Phase 2 completion

**Scope (2 files):**

```
.github/workflows/cleanup-branches.yml
.github/workflows/issue-labeling-automation.yml
```

#### Phase 3B: Release & Template Workflows

- [ ] Review release/template workflow changes needed (3 files)
- [ ] Update `release.yml`
- [ ] Update `template-enforcement.yml`
- [ ] Update `validate-pr-template.yml`
- [ ] Create PR and validate
- [ ] Merge to develop

**Issue:** `#[TBD] - Phase 3B: Release & Template Workflows`

- Type: task
- Status: Planned
- Assigned to: claude
- Milestone: (TBD)
- Blockers: Phase 2 completion

**Scope (3 files):**

```
.github/workflows/release.yml
.github/workflows/template-enforcement.yml
.github/workflows/validate-pr-template.yml
```

#### Phase 3C: Site Generation Workflow

- [ ] Review site generation workflow changes needed (1 file)
- [ ] Update `awesome-github-site.yml`
- [ ] Create PR and validate
- [ ] Merge to develop

**Issue:** `#[TBD] - Phase 3C: Site Generation Workflow`

- Type: task
- Status: Planned
- Assigned to: claude
- Milestone: (TBD)
- Blockers: Phase 2 completion

**Scope (1 file):**

```
.github/workflows/awesome-github-site.yml
```

---

### Phase 4: Consistency & Final Validation

- [ ] Audit edge cases
- [ ] Review `upload-artifact@v4` (22 instances)
- [ ] Review `create-github-app-token` (v2/v3 mix)
- [ ] Review `github-script` (v7/v9 mix)
- [ ] Create consistency report
- [ ] Update any edge cases
- [ ] Full validation audit

**Issue:** `#[TBD] - Phase 4: Consistency & Final Validation`

- Type: task
- Status: Planned
- Assigned to: claude
- Milestone: (TBD)
- Blockers: Phase 3 completion

**Scope:**

- Edge case review
- Final consistency audit
- Validation report

---

### Phase 5: Integration Testing & Closure

- [ ] Run full CI/CD pipeline
- [ ] Verify badges Phase 4 integration tests
- [ ] Verify release workflow
- [ ] Update CHANGELOG.md
- [ ] Update documentation (if applicable)
- [ ] Create final report
- [ ] Archive project
- [ ] Close Epic and all child issues

**Issue:** `#[TBD] - Phase 5: Integration Testing & Closure`

- Type: task
- Status: Planned
- Assigned to: claude
- Milestone: (TBD)
- Blockers: Phase 4 completion

**Deliverables:**

- Final report with metrics
- Updated CHANGELOG
- Archived project folder
- Closed Epic and child issues

---

## Issue Template Reference

### Epic Template

```markdown
# GitHub Actions v7 Upgrade Initiative

## Overview
Systematic upgrade of all GitHub Actions workflows to v7 (or latest stable versions).
See `.github/projects/active/github-actions-v7-upgrade-2026-08-09/` for full details.

## Scope
- 45 workflows total
- 4 critical blockers (invalid SHAs in badge workflows)
- 10+ outdated version references
- Target: 100% v7 compliance

## Status
- Phase 1: ✅ Complete (Audit & Planning)
- Phase 2: 🔄 In Progress (Badge Workflows)
- Phase 3: Planned (Standard Workflows)
- Phase 4: Planned (Consistency & Validation)
- Phase 5: Planned (Integration & Closure)

## Related Issues
- Epic #1641 (Badges Workflow Integration — Phase 4 blocked)
- Epic #1290 (Repository Restructuring Initiative)

## Success Criteria
- [ ] All invalid SHAs fixed
- [ ] All v4/v5 pins upgraded to v7
- [ ] All workflows pass CI/CD
- [ ] Phase 4 integration tests pass
- [ ] Documentation updated
- [ ] Project archived

## Key Documents
- PROJECT_README.md — Overview
- OPENSPEC_ANALYSIS.md — Specification
- UPGRADE_PLAN.md — Execution plan
- PROJECT_TRACKER.md — This tracker

## Definition of Done (DoD)
- ✅ All child issues created with DoR/DoD
- ✅ All phases planned and estimated
- ✅ All PRs merged to develop
- ✅ All workflows validated
- ✅ CHANGELOG updated
- ✅ Project archived
```

### Child Issue Template (Example: Phase 2)

```markdown
# Phase 2: Badge Workflows Upgrade

## Overview
Upgrade 4 badge workflows from invalid SHAs to GitHub Actions v7.
This unblocks Phase 4 integration testing for the badges feature (Epic #1641).

## Scope
- `.github/workflows/badges-readme-status.yml`
- `.github/workflows/badges-health-check.yml`
- `.github/workflows/badges-documentation-update.yml`
- `.github/workflows/badges-workflow-audit.yml`

## Changes Required
```yaml
# Before
uses: actions/checkout@6d0aea72b9a5f25ac9f0adfbbad656007faf0907 # v4.2.0
uses: actions/setup-node@1e60f620b9541d910af73a0410c36514fad91657 # v4.0.3

# After
uses: actions/checkout@v7
uses: actions/setup-node@v7
```

## Definition of Ready (DoR)

- [ ] Audit findings reviewed (PROJECT_README.md)
- [ ] Files identified and verified
- [ ] OpenSpec specification approved
- [ ] Phase 1 complete

## Definition of Done (DoD)

- [ ] All 4 badge files updated
- [ ] No invalid SHA references remain
- [ ] CI/CD passes on develop
- [ ] Phase 4 integration tests pass
- [ ] PR merged to develop
- [ ] Branch deleted

## Acceptance Criteria

- [ ] All workflows use v7 tags
- [ ] No invalid SHAs in final code
- [ ] Badges Phase 4 tests passing
- [ ] CHANGELOG entry added
- [ ] Zero CI/CD failures

## Effort Estimate

2 days

## Blockers

- None (ready to start after Phase 1)

## Related

- Epic: #[TBD]
- Related Epic: #1641 (Badges Phase 4)
- Replaces: PR #1663 (merge conflicts)

```

---

## PR Planning

### PR #1: Phase 2 (Badge Workflows)

**Title:** `fix: Upgrade badge workflows to GitHub Actions v7`

**Template:** `pr_bug.md`

**Files changed:** 4
```

.github/workflows/badges-readme-status.yml
.github/workflows/badges-health-check.yml
.github/workflows/badges-documentation-update.yml
.github/workflows/badges-workflow-audit.yml

```

**Linked issues:** #[TBD-Phase2], #1641 (Badges Phase 4)

**CHANGELOG entry:**
```

- fix: Replace invalid GitHub Actions SHAs with v7 tags in badge workflows

```

---

### PR #2: Phase 3A (Automation Workflows)

**Title:** `chore: Upgrade automation workflows to GitHub Actions v7`

**Template:** `pr_chore.md`

**Files changed:** 2
```

.github/workflows/cleanup-branches.yml
.github/workflows/issue-labeling-automation.yml

```

**Linked issues:** #[TBD-Phase3A]

**CHANGELOG entry:**
```

- chore: Upgrade automation workflows (cleanup-branches, issue-labeling) to GitHub Actions v7

```

---

### PR #3: Phase 3B (Release & Template Workflows)

**Title:** `chore: Upgrade release & template workflows to GitHub Actions v7`

**Template:** `pr_chore.md`

**Files changed:** 3
```

.github/workflows/release.yml
.github/workflows/template-enforcement.yml
.github/workflows/validate-pr-template.yml

```

**Linked issues:** #[TBD-Phase3B]

**CHANGELOG entry:**
```

- chore: Upgrade release & template validation workflows to GitHub Actions v7

```

---

### PR #4: Phase 3C (Site Generation)

**Title:** `chore: Upgrade site generation workflow to GitHub Actions v7`

**Template:** `pr_chore.md`

**Files changed:** 1
```

.github/workflows/awesome-github-site.yml

```

**Linked issues:** #[TBD-Phase3C]

**CHANGELOG entry:**
```

- chore: Upgrade site generation workflow to GitHub Actions v7

```

---

### PR #5: Phase 4-5 (Documentation & Final)

**Title:** `docs: Update CHANGELOG and CI/CD documentation for GitHub Actions v7 upgrade`

**Template:** `pr_docs.md`

**Files changed:** 2
```

CHANGELOG.md
docs/AUTOMATION.md (if applicable)

```

**Linked issues:** #[TBD-Phase4], #[TBD-Phase5], #[TBD-Epic]

**CHANGELOG entry:**
```

## [Unreleased]

### Changed

- chore: Upgrade all GitHub Actions workflows to v7 (#[TBD])
  - Replaced invalid SHA references in badge workflows (Phase 2)
  - Upgraded 6 standard workflows from v4/v5 to v7 (Phase 3)
  - Standardised action versions across 45 total workflows
  - Updated documentation and CI/CD guides

```

---

## Metrics & KPIs

### Phase Completion

| Phase | Files | Issues | PRs | Est. Duration | Status |
|-------|-------|--------|-----|----------------|--------|
| 1 | — | 1 epic + 5 child | — | 2 days | 🔄 In Progress |
| 2 | 4 | — | 1 | 2 days | Planned |
| 3A | 2 | — | 1 | 1 day | Planned |
| 3B | 3 | — | 1 | 1 day | Planned |
| 3C | 1 | — | 1 | 0.5 days | Planned |
| 4 | 0+ | — | 0+ | 2 days | Planned |
| 5 | 0+ | — | 1+ | 3 days | Planned |
| **TOTAL** | **10+** | **6** | **5-7** | **~15 days** | Estimate |

### Workflow Coverage

| Status | Before | After | Target |
|--------|--------|-------|--------|
| v7 (valid) | 31 | 45 | 45 |
| v4/v5 | 7 | 0 | 0 |
| Invalid SHAs | 8 | 0 | 0 |
| **Compliance** | **68%** | **100%** | **100%** |

---

## Progress Updates

### Session 2026-08-09 — 13:53 CEST

**Completed:**
- ✅ Comprehensive audit of 45 workflows
- ✅ Identified 8 invalid SHA references (4 badge workflows)
- ✅ Identified 7+ outdated version references (6 workflows)
- ✅ Created PROJECT_README.md with overview and timeline
- ✅ Created OPENSPEC_ANALYSIS.md with formal specification
- ✅ Created UPGRADE_PLAN.md with detailed execution plan
- ✅ Created PROJECT_TRACKER.md with issue templates

**Pending:**
- 🔄 Create GitHub issues (Epic + 5 child issues)
- 🔄 Rename branch to `feat/github-actions-v7-upgrade`
- 🔄 Begin Phase 2 execution (badge workflow upgrades)

**Next steps:**
1. Create GitHub issues for Epic and all child phases
2. Rename branch following CLAUDE.md conventions
3. Begin Phase 2: Badge Workflow Upgrade

---

## Status Legend

- ✅ Complete
- 🔄 In Progress
- 📋 Planned
- ⚠️ Blocked
- 🔴 Critical
- 🟡 High
- 🟠 Medium

---

**Status:** Active  
**Last updated:** 2026-08-09 13:53 CEST  
**Next update:** After GitHub issues created (Phase 1 completion)
