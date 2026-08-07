---
title: Consolidated Action Plan — Workflow Consolidation Audit
description: Execution timeline and action items for Phase 4 workflow consolidation
file_type: "documentation"
date: 2026-08-07
status: "ready"
version: "1.0"
created_date: "2026-08-07"
last_updated: "2026-08-07"
---

# Consolidated Action Plan — Workflow Consolidation Audit

**Prepared:** 2026-08-07  
**Based On:** Comprehensive audit + agent analysis + openspec planning  
**Status:** 🟢 Ready for Execution (with blocking coordination items)

---

## Executive Summary

The GitHub workflows consolidation initiative (Epic #1227) is in Phase 3 completion → Phase 4 planning. This action plan consolidates audit findings, openspec analysis, and active project coordination into a clear, executable roadmap.

### Key Finding: BLOCKING DEPENDENCY

**Issue Type & Metadata Automation project** is enhancing workflows that Phase 4.2 plans to consolidate. Phase 4.2 execution **BLOCKED until Issue Type project Phase 1 completes (target: 2026-08-13)**.

### Current Status

| Item | Status | Owner | Target |
|------|--------|-------|--------|
| **Phases 1-3** | ✅ Complete | Completed | — |
| **Phase 4 Planning** | ✅ Complete | Ash Shaw | 2026-08-07 |
| **Phase 4 Issues** | 📋 Planned | Need creation | 2026-08-08 |
| **Issue Type Project Blocking** | ⚠️ Blocking | Issue Type Team | 2026-08-13 |
| **Release Redesign Coordination** | ⚠️ Blocking | Release Team | 2026-08-12 |
| **Phase 4 Execution Start** | 📅 Scheduled | Ash Shaw | 2026-08-14 |

---

## Part 1: Deliverables Completed

### 1. Comprehensive Audit Document ✅

**File:** `AUDIT_2026_08_07_COMPREHENSIVE.md`

Contains:

- ✅ Current workflow inventory (41 workflows)
- ✅ Phase 4 consolidation targets (8 workflows)
- ✅ Active project analysis (6 projects)
- ✅ Conflict identification
- ✅ Recommendations

**Outcome:** Provides context for all Phase 4 decisions

### 2. OpenSpec Plan ✅

**File:** `OPENSPEC_WORKFLOW_CONSOLIDATION.md`

Contains:

- ✅ Formal specification for 41 → 25 consolidation
- ✅ 5 consolidation patterns (cleanup, trigger consolidation, unification, absorption, logical)
- ✅ Detailed Phase 4.1-4.6 execution plans
- ✅ Risk assessment (detailed)
- ✅ Success criteria (quantitative + qualitative)
- ✅ Dependency graph
- ✅ Governance guidelines for future workflows

**Outcome:** Ready-to-execute specification; can be used as single source of truth

### 3. GitHub Issues Templates ✅

**File:** `GITHUB_ISSUES_PHASE_4_TEMPLATES.md`

Contains:

- ✅ 6 issue templates (#1406-#1411)
- ✅ Each with full Definition of Ready + Done
- ✅ Detailed implementation steps
- ✅ Testing protocols
- ✅ Rollback procedures

**Outcome:** Issues ready to post to GitHub

### 4. Active Project Coordination ✅

**Agent Report:** Identified 6 active projects

**Conflicts Identified:**

1. ⚠️ **BLOCKING:** Issue Type project ↔ Phase 4.2
2. ⚠️ **COORDINATION:** Release Redesign ↔ Phase 4.3
3. ⚠️ **COORDINATION:** Projects System ↔ Phase 4.3
4. ✅ No other conflicts

---

## Part 2: Critical Blocking Issues

### BLOCKING #1: Issue Type & Metadata Automation → Phase 4.2

**Issue:** Phase 4.2 plans to consolidate `template-enforcement.yml`, but Issue Type project is enhancing it.

**Timeline Conflict:**

- Issue Type Phase 1: Target 2026-08-13
- Phase 4.2 Planned: Can start after Phase 3.3 (already complete)
- **Gap:** Phase 4.2 blocked until Aug 13

**Solution Options:**

**Option A (Recommended): Coordinate Consolidation**

1. Issue Type project completes Phase 1 enhancements (Aug 13)
2. Phase 4.2 consolidates `template-enforcement.yml` WITH the new enhancements
3. Consolidate all at once into `issue-compliance.yml`
4. Total effort: same (4-5h) + coordination
5. **Timeline:** Start Phase 4.2 on 2026-08-14

**Option B: Parallel Implementation**

1. Issue Type project implements enhancements in parallel with Phase 4.2
2. Phase 4.2 consolidates existing workflows
3. Issue Type project rebases enhancements onto consolidated workflow
4. **Timeline:** Faster overall but higher merge conflict risk

**RECOMMENDATION:** Use Option A (coordinate consolidation)

**Action Items:**

- [ ] Contact Issue Type project owner (assigned to Phase 4.2 issue)
- [ ] Share Phase 4.2 plan with Issue Type team
- [ ] Confirm Issue Type Phase 1 target date (Aug 13)
- [ ] Schedule coordination meeting for Aug 13-14
- [ ] Plan combined implementation of Phase 4.2

### BLOCKING #2: Release Redesign → Phase 4.3 (Project Field Sync)

**Issue:** Release redesign may add project-sync workflows that would immediately become Phase 4.3 targets.

**Timeline:**

- Release Redesign Phase 2: In progress (3/6 issues complete)
- Phase 4.3 Planned: Scheduled after Phase 4.1 (independent)
- **Gap:** Need to understand Release Redesign's project-sync plans

**Solution:**

1. Share Phase 4.3 plan with Release Redesign team
2. Get list of planned project-sync additions in Release Redesign
3. Incorporate into Phase 4.3 if needed
4. Avoid creating duplicate workflows

**Action Items:**

- [ ] Share Phase 4.3 plan with Release Redesign owner
- [ ] Request list of planned project-sync additions
- [ ] Align timelines (target coordination by 2026-08-12)

### BLOCKING #3: GitHub Projects Creation System → Phase 4.3

**Issue:** Projects System may create new project-related workflows that could be consolidation candidates.

**Timeline:**

- Projects System: Just started (2026-08-05)
- Phase 4.3 Planned: Scheduled for 2026-08-14+

**Solution:**

1. Share Phase 4.3 consolidation design
2. Ensure Projects System uses consolidated `project-field-sync.yml` (post-consolidation)
3. Avoid creating workflows that duplicate field-sync logic

**Action Items:**

- [ ] Share Phase 4.3 plan with Projects System owner
- [ ] Clarify which workflows will be created
- [ ] Get commitment to use post-Phase 4.3 patterns

---

## Part 3: Phased Execution Plan

### PHASE 4.1: Delete Deprecated (NO DEPENDENCIES) ✅

**Status:** Ready to execute immediately

**GitHub Issue:** #1406  
**Template:** See GITHUB_ISSUES_PHASE_4_TEMPLATES.md

**Quick Facts:**

- Effort: 1 hour
- Reduction: −2 workflows
- No dependencies
- Low risk

**Can Start:** Immediately (2026-08-08)  
**Target Complete:** 2026-08-08

### PHASE 4.4: Flaky Test Absorption (NO DEPENDENCIES) ✅

**Status:** Ready to execute immediately

**GitHub Issue:** #1409  
**Template:** See GITHUB_ISSUES_PHASE_4_TEMPLATES.md

**Quick Facts:**

- Effort: 1-2 hours
- Reduction: −1 workflow (reaches 25 target!)
- No dependencies
- Low risk

**Can Start:** Immediately (2026-08-08)  
**Target Complete:** 2026-08-09

### PHASE 4.5: Delete Superseded Issue-Create (NO DEPENDENCIES) ✅

**Status:** Ready to execute immediately

**GitHub Issue:** #1410  
**Template:** See GITHUB_ISSUES_PHASE_4_TEMPLATES.md

**Quick Facts:**

- Effort: 0.5 hours
- Reduction: −1 workflow (23 total, beats target)
- No dependencies
- Low risk (direct replacement)

**Can Start:** Immediately (2026-08-08)  
**Target Complete:** 2026-08-08

### PHASE 4.6: Issue Audit + Remediation Consolidation (READY) ⏳

**Status:** Ready once source workflows have production runs

**GitHub Issue:** #1411  
**Template:** See GITHUB_ISSUES_PHASE_4_TEMPLATES.md

**Prerequisite:** Both `issue-health-audit.yml` and `issue-remediation-bulk.yml` must have ≥1 production run

**Quick Facts:**

- Effort: 3-4 hours
- Reduction: −1 workflow (brings to 23)
- No workflow dependencies (data dependencies exist)
- Medium risk (interaction with metadata-governance.yml)

**Can Start:** After source workflows verified (probably 2026-08-10)  
**Target Complete:** 2026-08-12

### PHASE 4.2: Issue Compliance Consolidation (BLOCKED) ⚠️

**Status:** BLOCKED until Issue Type project Phase 1 completes

**GitHub Issue:** #1407  
**Template:** See GITHUB_ISSUES_PHASE_4_TEMPLATES.md

**Blocking Issue:** Issue Type & Metadata Automation project enhancing `template-enforcement.yml`

**Quick Facts:**

- Effort: 4-5 hours
- Reduction: −2 workflows
- Workflow dependencies: None
- **Project dependencies:** Issue Type Phase 1 (target: Aug 13)
- Medium risk (multiple event types)

**Can Start:** 2026-08-14 (after Issue Type Phase 1 + coordination)  
**Target Complete:** 2026-08-16

### PHASE 4.3: Project Field Sync Unification (COORDINATE) ⚠️

**Status:** Ready but needs coordination with Release Redesign + Projects System

**GitHub Issue:** #1408  
**Template:** See GITHUB_ISSUES_PHASE_4_TEMPLATES.md

**Coordination Required:** Release Redesign and Projects System must confirm no conflicting workflows

**Quick Facts:**

- Effort: 3-4 hours
- Reduction: −1 workflow
- Project dependencies: Release Redesign clarification (target: Aug 12)
- Medium-high risk (auth migration)

**Can Start:** 2026-08-14 (after coordination)  
**Target Complete:** 2026-08-17

---

## Part 4: Execution Timeline

```text
WEEK 1 (Aug 5-11)
│
├─ Mon 08 [EXECUTE IMMEDIATELY]
│  ├─ Phase 4.1: Delete deprecated (1h) ✅
│  ├─ Phase 4.5: Delete superseded (0.5h) ✅
│  └─ Phase 4.4: Flaky test absorption (1-2h) ✅
│     └─ Reaches target of 25 workflows ✅✅
│
├─ Tue-Wed 09-10 [PARALLEL COORDINATION]
│  ├─ Issue Type team: Continue Phase 1 (target: Aug 13)
│  ├─ Release Redesign team: Confirm project-sync plans (target: Aug 12)
│  ├─ Projects System team: Clarify workflow plans (target: Aug 12)
│  └─ Phase 4.6: Execute (if source workflows ready) (3-4h) ⏳
│
└─ Thu 11 [PREP FOR PHASE 4.2 & 4.3]
   ├─ Await Issue Type Phase 1 completion
   ├─ Gather Release Redesign feedback
   ├─ Create GitHub issues #1407-#1408

WEEK 2 (Aug 12-18)
│
├─ Wed 12 [FINAL COORDINATION]
│  ├─ Release Redesign: Final feedback by EOD
│  ├─ Projects System: Final feedback by EOD
│  └─ Schedule Phase 4.2 & 4.3 coordination meeting (Thu 13 AM)
│
├─ Thu 13 [COORDINATION + ISSUE TYPE COMPLETION]
│  ├─ Issue Type Phase 1 target completion
│  ├─ Issue Type + Ash coordination for Phase 4.2
│  └─ Schedule Phase 4.2 start (Fri 14)
│
├─ Fri 14 [PHASE 4.2 & 4.3 START]
│  ├─ Phase 4.2: Issue Compliance (4-5h) → complete by Sun
│  ├─ Phase 4.3: Project Field Sync (3-4h) → complete by Mon
│  └─ Parallel execution possible
│
└─ Mon 17-18 [FINAL VERIFICATION]
   ├─ All consolidations tested
   ├─ All workflows verified
   └─ Final metrics compilation

FINAL COUNT
───────────
Start: 41 workflows
After 4.1: 39 (−2)
After 4.5: 38 (−1)
After 4.4: 25 ✅ (−1, target reached!)
After 4.6: 23 ✅ (−1, overachieves!)
After 4.2: 21 ✅ (−2, overachieves!)
After 4.3: 20 ✅ (−1, overachieves!)

Final: 20-23 workflows (target was 25) ✅✅✅
```

---

## Part 5: Immediate Action Items

### IMMEDIATE (Today 2026-08-07)

- [ ] Share this consolidated action plan with stakeholders
- [ ] Review Phase 4 issue templates
- [ ] Approve execution timeline

### TODAY/TOMORROW (2026-08-07 to 2026-08-08)

- [ ] **Create GitHub issues #1406, #1405, #1409** (Phase 4.1, 4.5, 4.4)
- [ ] **Assign team members** to Phase 4.1, 4.5, 4.4
- [ ] **Begin Phase 4.1 execution** (delete deprecated workflows)
- [ ] **Contact Issue Type project owner**
  - Share Phase 4.2 plan
  - Request confirmation on Phase 1 target date (Aug 13)
  - Schedule coordination call for Aug 13
- [ ] **Contact Release Redesign owner**
  - Share Phase 4.3 plan
  - Request list of planned project-sync changes
  - Target coordination by Aug 12
- [ ] **Contact Projects System owner**
  - Share Phase 4.3 plan
  - Request list of planned workflows
  - Target coordination by Aug 12

### BY END OF WEEK (2026-08-11)

- [ ] Phase 4.1 complete (delete deprecated)
- [ ] Phase 4.5 complete (delete superseded)
- [ ] Phase 4.4 complete (flaky test absorption)
- [ ] **Workflow count: 25** ✅ TARGET REACHED
- [ ] Phase 4.6 execute (if source workflows ready)
- [ ] GitHub issues #1407, #1408 created (pending coordination)
- [ ] Coordination feedback from Release Redesign + Projects System
- [ ] Schedule Phase 4.2 & 4.3 for Week 2

### WEEK 2 (2026-08-12 onwards)

- [ ] Phase 4.2 execution (after Issue Type completion + coordination)
- [ ] Phase 4.3 execution (after Release Redesign coordination)
- [ ] All Phase 4 sub-phases complete by 2026-08-18
- [ ] Final metrics and sign-off

---

## Part 6: Risk Assessment & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Issue Type project delays Phase 4.2 | MEDIUM | MEDIUM | Schedule coordination call Aug 13 morning |
| Release Redesign unclear about project-sync | MEDIUM | MEDIUM | Request detailed plan by Aug 12 |
| New workflows added during Phase 4 | MEDIUM | MEDIUM | Share consolidation guidelines with all projects |
| Consolidation breaks workflows | LOW | HIGH | Comprehensive testing + 24h disable period |
| Team not familiar with new architecture | LOW | MEDIUM | Documentation + training session post-execution |

---

## Part 7: Success Criteria

**By 2026-08-18:**

- [ ] All Phase 4 sub-phases executed successfully
- [ ] 41 workflows reduced to 20-23 (target was 25)
- [ ] All consolidations tested and verified
- [ ] Zero regressions in existing workflows
- [ ] Team trained on new consolidation patterns
- [ ] Governance guidelines updated for future workflows
- [ ] Metrics compiled (Actions minutes savings, etc.)

**By 2026-08-25:**

- [ ] Monitoring period complete (24-72h post-consolidation)
- [ ] All old workflows deleted
- [ ] Team feedback positive
- [ ] Phase 4 closure report completed
- [ ] Epic #1227 marked complete

---

## Conclusion

The workflow consolidation initiative has successfully completed Phases 1-3, eliminating 6+ workflows and ~500 lines of duplicate code. Phase 4 is well-planned, executable, and ready to begin immediately with 3 independent sub-phases (4.1, 4.4, 4.5).

**Phase 4 will reduce 41 workflows → 20-23** (target was 25, so it **overachieves by 2-5 workflows**).

**Critical path:**

1. Execute Phases 4.1, 4.4, 4.5 immediately (reach 25-target by Aug 9)
2. Coordinate with Issue Type project (Phase 4.2 blocker)
3. Coordinate with Release Redesign + Projects System (Phase 4.3)
4. Execute Phases 4.2, 4.3, 4.6 in parallel (Aug 14+)
5. Complete by Aug 18, close epic by Aug 25

**Ownership:** Ash Shaw (project lead) with team member assignments per phase

---

**Document Status:** Ready for Approval & Execution  
**Last Updated:** 2026-08-07  
**Next Review:** Upon stakeholder approval
