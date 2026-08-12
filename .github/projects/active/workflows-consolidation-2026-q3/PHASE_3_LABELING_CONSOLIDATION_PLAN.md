---
name: Phase 3 Labeling Consolidation Plan
description: Design and planning for consolidating GitHub labeling workflows into a unified system
file_type: documentation
metadata:
  status: planning
  phase: 3
  created: 2026-07-24
  target_completion: 2026-08-31
---

# Phase 3: Labeling Consolidation Initiative

## Overview

Phase 3 consolidates 3 separate GitHub labeling workflows into a unified labeling system that centralizes label assignment logic, reduces duplication, and provides a single source of truth for issue/PR classification across the organisation.

**Goal:** Consolidate labeling workflows by ~45% code deduplication while maintaining all current functionality.

---

## Phase 3 Scope

### Workflows to Consolidate

| Workflow | File | Lines | Purpose | Trigger |
|----------|------|-------|---------|---------|
| **dependabot-security-label** | `.github/workflows/dependabot-security-label.yml` | ~89 | Label security updates from Dependabot | PR (opened, reopened, edited, synchronize) |
| **issue-close-label-hygiene** | `.github/workflows/issue-close-label-hygiene.yml` | ~37 | Apply/remove labels when issues are closed | Issue (closed) |
| **labeling-unified** | `.github/workflows/labeling.yml` | ~108 | Main labeling engine for discussions, issues, PRs | Push/PR (opened, edited, synchronize, reopened, ready_for_review) |
| **Total** | — | **234 lines** | — | — |

### Key Observations

1. **Unified Labeling Already Exists:** `labeling.yml` is already named "Labeling • Discussions, Issues & PRs (Unified)" but does not consolidate the other 2 specialized workflows
2. **Separate Concerns:** Each workflow handles different event types:
   - dependabot-security-label: PR-specific Dependabot security labeling
   - issue-close-label-hygiene: Issue closure label cleanup
   - labeling.yml: General issue/PR/discussion labeling
3. **Opportunity:** Consolidate all 3 into a single labeling system with conditional job execution based on event type

---

## Phase 3 Design

### Consolidated Workflow Structure

**File:** `.github/workflows/labeling.yml` (unified, expanded)

**Event Triggers:**

```yaml
on:
  pull_request:
    types: [opened, edited, synchronize, reopened, ready_for_review]
    branches: [develop]
  issues:
    types: [opened, edited, closed]
    branches: [develop]
  push:
    branches: [develop]
  discussions:
    types: [opened, edited]
```

**Jobs (Conditional Execution):**

| Job | Trigger | Purpose | Source |
|-----|---------|---------|--------|
| **label-pr-general** | `pull_request` (except Dependabot) | Apply labels to regular PRs | `labeling.yml` (existing) |
| **label-pr-dependabot** | `pull_request` (from Dependabot) | Apply security/dependency labels | `dependabot-security-label.yml` |
| **label-issues** | `issues` (opened/edited) | Apply labels to issues | `labeling.yml` (existing) |
| **label-issue-close-cleanup** | `issues` (closed) | Remove/apply labels on closure | `issue-close-label-hygiene.yml` |
| **label-discussions** | `discussions` (opened/edited) | Apply labels to discussions | `labeling.yml` (existing) |

### Design Rationale

1. **Single Source of Truth:** All labeling logic in one consolidated workflow file
2. **Conditional Job Execution:** Event type determines which jobs execute
3. **Clear Separation:** Each job handles a distinct concern (Dependabot, closure, general)
4. **Maintained Functionality:** All existing label assignment rules preserved
5. **Performance:** Reduced GitHub Actions concurrent runs (fewer workflows triggered)

---

## Phase 3 Deliverables

### 3.1: Design Document ✅

- [x] **Completed:** `PHASE_3_LABELING_CONSOLIDATION_PLAN.md` (this document)
- Scope: 3 workflows, 234 lines
- Design: 5 conditional jobs with clear separation of concerns
- Risk analysis: Minimal (event-driven, no external dependencies)

### 3.2: Consolidated Workflow Implementation (📋 Pending)

- [ ] Merge `dependabot-security-label.yml` logic into `labeling.yml`
- [ ] Merge `issue-close-label-hygiene.yml` logic into `labeling.yml`
- [ ] Update event triggers to cover all cases
- [ ] Implement conditional job execution
- [ ] Add validation steps
- [ ] Test dry-run mode

### 3.3: Integration Testing (📋 Pending)

- [ ] Test PR labeling (general)
- [ ] Test PR labeling (Dependabot-specific)
- [ ] Test issue labeling (opened/edited)
- [ ] Test issue labeling (closed event)
- [ ] Test discussion labeling
- [ ] Verify no label conflicts

### 3.4: Legacy Workflow Cleanup (📋 Pending)

- [ ] Delete `.github/workflows/dependabot-security-label.yml`
- [ ] Delete `.github/workflows/issue-close-label-hygiene.yml`
- [ ] Verify GitHub workflow triggers still function
- [ ] Update any documentation references

### 3.5: Verification & Sign-Off (📋 Pending)

- [ ] Code review and approval
- [ ] Integration test results documented
- [ ] Performance metrics verified
- [ ] No regressions in label assignment
- [ ] PR merged to develop

---

## Phase 3 Dependencies

### Prerequisites

- ✅ Phase 2 (Documentation Consolidation) complete
- ✅ Phase 2.3 (Integration Testing) plan established
- ✅ Phase 2.4 (Cleanup) execution initiated
- ✅ GitHub Actions workflow validation infrastructure stable

### Blockers

- None identified at planning stage

---

## Phase 3 Risk Analysis

### Low Risk

| Risk | Mitigation |
|------|-----------|
| Label conflicts during consolidation | Preserve all existing label assignment logic; test each trigger type independently |
| Event trigger overlap | Implement clear conditional logic based on event type and actor (Dependabot vs. user) |
| Performance impact | Consolidation should reduce concurrent workflow runs (net positive) |
| Accidentally remove labels on closure | Test closure logic thoroughly; verify label removal rules |

### Failure Scenarios

| Scenario | Detection | Recovery |
|----------|-----------|----------|
| PR labeling breaks | CI checks fail; user reports missing labels | Revert consolidated workflow; keep legacy workflows active |
| Dependabot detection fails | PRs from Dependabot missing security labels | Add fallback detection logic; verify actor context |
| Issue closure removes wrong labels | Test reports show unexpected label removal | Verify closure conditions; add label protection rules |
| Workflow disabled accidentally | GitHub Actions UI shows disabled workflow | Re-enable consolidated workflow; verify triggers |

---

## Phase 3 Timeline

| Phase | Milestone | Target Date | Status |
|-------|-----------|-------------|--------|
| **3.0** | Planning & Design | 2026-07-24 | ✅ Complete |
| **3.1** | Design Document | 2026-07-24 | ✅ Complete |
| **3.2** | Implementation | 2026-07-31 | 📋 Pending |
| **3.3** | Integration Testing | 2026-08-07 | 📋 Pending |
| **3.4** | Legacy Cleanup | 2026-08-14 | 📋 Pending |
| **3.5** | Verification & Merge | 2026-08-21 | 📋 Pending |
| **3.6** | Monitoring (1 week) | 2026-08-28 | 📋 Pending |

---

## Phase 3 Effort Estimate

| Component | Effort | Notes |
|-----------|--------|-------|
| Design & Planning | 2h | ✅ Complete |
| Implementation | 4h | Merge logic, implement conditionals, test dry-run |
| Integration Testing | 4h | 5 test scenarios, manual verification |
| Cleanup & Verification | 2h | Delete legacy files, verify triggers, sign-off |
| **Total** | **12h** | ~1-2 working days |

---

## Phase 3 Success Criteria

- ✅ All 3 workflows consolidated into 1 unified workflow
- ✅ ~45% code deduplication (234 → ~130 lines)
- ✅ All existing labeling functionality preserved
- ✅ Zero regressions in label assignment
- ✅ Integration tests pass (5/5 scenarios)
- ✅ Legacy workflows deleted
- ✅ PR merged to develop

---

## Related Issues

- **Epic #1227:** GitHub Workflows Consolidation Initiative
- **Phase 2.1:** #1307 (docs-validation) — ✅ Resolved
- **Phase 2.2:** #1308 (docs-maintenance) — ✅ Resolved
- **Phase 2.3:** #1309 (Integration Testing) — 🟡 Testing Pending
- **Phase 2.4:** #1310 (Cleanup Old Workflows) — ✅ In Progress (PR #1317)
- **Phase 2.5:** #1311 (Code Review & Merge) — ✅ Complete
- **Phase 3.0:** #[TBD] (Labeling Consolidation Design) — 📋 Pending Issue Creation
- **Phase 3.1:** #[TBD] (Labeling Consolidation Implementation) — 📋 Pending Issue Creation
- **Phase 3.2:** #[TBD] (Labeling Integration Testing) — 📋 Pending Issue Creation
- **Phase 3.3:** #[TBD] (Labeling Cleanup) — 📋 Pending Issue Creation

---

## Next Steps

1. **Immediate (Today):**
   - ✅ Create Phase 3 planning document (PHASE_3_LABELING_CONSOLIDATION_PLAN.md)
   - 📋 Create Phase 3 GitHub issues (#3.1–#3.4)
   - 📋 Update Epic #1227 with Phase 3 status
   - 📋 Update PROJECT_INDEX.md with Phase 3 timeline

2. **This Week:**
   - 📋 Implement consolidated labeling workflow
   - 📋 Conduct integration testing
   - 📋 Create PR for Phase 3.2 consolidation

3. **Next Week:**
   - 📋 Execute legacy workflow cleanup (Phase 3.3)
   - 📋 Verify no regressions
   - 📋 Sign-off and merge to develop

4. **Post-Merge (1 week monitoring):**
   - 📋 Monitor GitHub Actions for issues
   - 📋 Verify label assignment accuracy
   - 📋 Close all Phase 3 issues

---

## Notes

- **Dependency on Phase 2.3:** Phase 2.3 (Integration Testing) provides the template for Phase 3 testing strategy
- **Documentation:** Keep all integration test results in `PHASE_3_TESTING_RESULTS.md` for reference
- **Rollback Plan:** Legacy workflows will be retained in git history; can be restored if needed
- **Future Phases:** After Phase 3 completes, evaluate other workflow consolidation opportunities (release, metrics, etc.)

---

**Status:** 🟢 Ready for Phase 3 Implementation  
**Last Updated:** 2026-07-24  
**Next Checkpoint:** 2026-07-31 (Implementation Start)
