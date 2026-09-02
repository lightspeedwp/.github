---
file_type: documentation
title: OpenSpec Status Framework — PR Labeling Enforcement Initiative
description: Defines the OpenSpec status labels and tracking framework for the PR Labeling Enforcement initiative (#2352), mapping the 5-phase implementation roadmap to OpenSpec lifecycle states.
created_date: 2026-08-30
status: active
---

# OpenSpec Status Framework — PR Labeling Enforcement Initiative (#2352)

## Overview

This document defines the OpenSpec status labels and tracking framework for the PR Labeling Enforcement initiative (#2352). It maps the 5-phase implementation roadmap to OpenSpec lifecycle states to enable automated progression tracking and governance.

**Initiative Metadata:**
- **Meta Issue:** [#2352](https://github.com/lightspeedwp/.github/issues/2352)
- **Total Phases:** 5 (sequential, dependent)
- **Critical Path:** 7–8 business days (Phases 1–3)
- **Full Duration:** 12–14 business days (Phases 1–5)
- **Start Date:** Ready immediately after approval
- **Success Criteria:** 100% label compliance, <2 preventable violations/week by Day 30

---

## OpenSpec Status Labels

### Specification Phase

| Label | Description | Use Case |
|-------|-------------|----------|
| `openspec:specification-pending` | OpenSpec specification needed | Phase documentation awaiting review/approval |
| `openspec:specification-in-progress` | Specification being written | Phase requirements/success criteria being finalized |
| `openspec:specification-complete` | Specification complete | Phase requirements locked; ready for implementation |

### Implementation Phase

| Label | Description | Use Case |
|-------|-------------|----------|
| `openspec:implementation-pending` | Implementation pending | Phase blocking previous phase completion |
| `openspec:implementation-in-progress` | Implementation in progress | Phase actively being executed |
| `openspec:implementation-complete` | Implementation complete | Phase completed; success criteria met |

### Color Scheme

**Progression:** Blue (pending) → Yellow (in-progress) → Green (complete)

- **Pending:** `C5DEF5` (Blue) — awaiting start
- **In Progress:** `F2D06D` (Yellow) — active work
- **Complete:** `1A7F37` (Green) — finished/verified

---

## Phase Component Tracking

### Phase 1: Stop New Label Violations

**Issue:** [#2283](https://github.com/lightspeedwp/.github/issues/2283)

#### Specification Status
- **Current State:** `openspec:specification-complete` ✓
- **Documentation:** WORK_PLAN.md Phase 1 section, IMPLEMENTATION_ROADMAP.md Phase 1
- **Completion Date:** 2026-08-30
- **Approval:** Ready to start (tech lead sign-off via issue #2283)

**Specification Deliverables Completed:**
- ✅ Objectives defined: Implement validation, deploy pre-merge checks, ensure zero new violations
- ✅ Success criteria locked: Invalid labels blocked, clear error messages, zero violations in 24 hours
- ✅ Dependencies documented: Repository config access, merge check permissions, label schema finalized
- ✅ Risk mitigation: Rollback plan within 30 minutes, validation testing phase defined

#### Implementation Status
- **Current State:** `openspec:implementation-pending` (awaiting phase execution)
- **Assigned to:** Phase 1 Lead (TBD)
- **Estimated Duration:** 2–3 hours
- **Start Condition:** Immediate (blocks Phases 2–5)
- **Go/No-Go Gate:** Defined in EXECUTION_CHECKLIST.md

**Implementation Deliverables:**
- [ ] Label prefix validation rule implemented
- [ ] Pre-merge check enforced on all PRs
- [ ] Validation documentation updated
- [ ] Team notified of enforcement
- [ ] Tech lead sign-off obtained

**Success Verification:**
- ✓ All PRs with invalid labels blocked from merge
- ✓ Clear error messages guide users on valid formats
- ✓ Zero new violations in production within 24 hours

**Transitions to:** `openspec:implementation-in-progress` when Phase 1 Lead begins execution

---

### Phase 2: Fix Existing Label Violations

**Issue:** [#1604](https://github.com/lightspeedwp/.github/issues/1604)

#### Specification Status
- **Current State:** `openspec:specification-complete` ✓
- **Documentation:** WORK_PLAN.md Phase 2 section, IMPLEMENTATION_ROADMAP.md Phase 2
- **Completion Date:** 2026-08-30
- **Approval:** Ready (blocked by Phase 1 completion)

**Specification Deliverables Completed:**
- ✅ Objectives defined: Audit all PRs, remediate non-compliant labels, achieve 100% compliance
- ✅ Success criteria locked: 100% merged PRs compliant, 100% open PRs compliant, audit report signed off
- ✅ Parallel work identified: Issues #909, #656, #664 audits (run in parallel)
- ✅ Dependencies documented: Phase 1 validation deployed, audit tooling configured

#### Implementation Status
- **Current State:** `openspec:implementation-pending` (blocked by Phase 1)
- **Assigned to:** Phase 2 Lead (TBD)
- **Estimated Duration:** 24–48 hours
- **Start Condition:** Phase 1 completion + tech lead sign-off
- **Go/No-Go Gate:** Defined in EXECUTION_CHECKLIST.md

**Implementation Deliverables:**
- [ ] Complete audit of all merged PRs
- [ ] Complete audit of all open PRs
- [ ] Label remediation for all non-compliant PRs
- [ ] Audit report with findings documented
- [ ] Compliance metrics dashboard created
- [ ] Tech lead sign-off obtained

**Parallel Work (run concurrently):**
- [#909](https://github.com/lightspeedwp/.github/issues/909) — Audit Issue Labeling Rules
- [#656](https://github.com/lightspeedwp/.github/issues/656) — Audit Issue Labeling Rules (Child task)
- [#664](https://github.com/lightspeedwp/.github/issues/664) — Audit Labeling Docs

**Success Verification:**
- ✓ 100% of merged PRs have compliant labels
- ✓ 100% of open PRs have compliant labels
- ✓ Audit report signed off by tech lead
- ✓ No PRs remain non-compliant

**Transitions to:** `openspec:implementation-in-progress` when Phase 2 Lead begins execution

---

### Phase 3: Enforce Label Validation System-Wide

**Issue:** [#1605](https://github.com/lightspeedwp/.github/issues/1605)

#### Specification Status
- **Current State:** `openspec:specification-complete` ✓
- **Documentation:** WORK_PLAN.md Phase 3 section, IMPLEMENTATION_ROADMAP.md Phase 3
- **Completion Date:** 2026-08-30
- **Approval:** Ready (blocked by Phase 2 completion)

**Specification Deliverables Completed:**
- ✅ Objectives defined: Implement validation system-wide, deploy auto-sync, establish enforcement
- ✅ Success criteria locked: All rules operational, auto-sync working, integration tests pass (#1323), zero manual interventions
- ✅ Parallel work identified: Issues #1719 (auto-sync), #1944 (OpenSpec lifecycle), #1323 (testing gate)
- ✅ Completion gate documented: #1323 must pass before Phase 3 sign-off

#### Implementation Status
- **Current State:** `openspec:implementation-pending` (blocked by Phase 2)
- **Assigned to:** Phase 3 Lead (TBD)
- **Estimated Duration:** 3–5 days
- **Start Condition:** Phase 2 completion + tech lead sign-off
- **Go/No-Go Gate:** Defined in EXECUTION_CHECKLIST.md (includes #1323 testing gate)

**Implementation Deliverables:**
- [ ] Unified labeling validation system implemented
- [ ] Auto-sync workflow deployed and tested
- [ ] Label lifecycle rules enforced across all PR states
- [ ] Integration testing complete (Gate: #1323)
- [ ] Edge case handling documented and verified
- [ ] Tech lead sign-off obtained

**Parallel Work (run concurrently):**
- [#1719](https://github.com/lightspeedwp/.github/issues/1719) — Auto-Sync PR Labels (sync-pr-labels.js)
- [#1944](https://github.com/lightspeedwp/.github/issues/1944) — OpenSpec Lifecycle Status Labels

**Completion Gate:**
- **Blocking:** [#1323](https://github.com/lightspeedwp/.github/issues/1323) — Phase 3.2 Integration Testing (must pass before Phase 3 sign-off)

**Success Verification:**
- ✓ All label validation rules operational
- ✓ Auto-sync working reliably for all label mutations
- ✓ Integration tests passing (100% coverage)
- ✓ No manual label management required
- ✓ System handles edge cases (conflicts, orphaned labels)

**Transitions to:** `openspec:implementation-in-progress` when Phase 3 Lead begins execution

---

### Phase 4: Documentation Updates

**Issue:** [#1606](https://github.com/lightspeedwp/.github/issues/1606)

#### Specification Status
- **Current State:** `openspec:specification-complete` ✓
- **Documentation:** WORK_PLAN.md Phase 4 section, IMPLEMENTATION_ROADMAP.md Phase 4
- **Completion Date:** 2026-08-30
- **Approval:** Ready (blocked by Phase 3 completion)

**Specification Deliverables Completed:**
- ✅ Objectives defined: Create documentation, document all labels, provide training materials
- ✅ Success criteria locked: All labels documented with examples, team can self-serve, <1 support request/week
- ✅ Dependencies documented: Phase 3 validation system operational, label schema finalized

#### Implementation Status
- **Current State:** `openspec:implementation-pending` (blocked by Phase 3)
- **Assigned to:** Phase 4 Lead / Tech Writer (TBD)
- **Estimated Duration:** 2–3 days
- **Start Condition:** Phase 3 completion + tech lead sign-off
- **Go/No-Go Gate:** Defined in EXECUTION_CHECKLIST.md

**Implementation Deliverables:**
- [ ] Comprehensive label reference guide created
- [ ] Best practices documentation completed
- [ ] Troubleshooting guide authored
- [ ] Training presentation developed
- [ ] Tech lead review completed

**Success Verification:**
- ✓ All labels documented with examples
- ✓ Team can self-serve label questions
- ✓ <1 support request/week about labels

**Transitions to:** `openspec:implementation-in-progress` when Phase 4 Lead begins execution

---

### Phase 5: Team Training & Adoption

**Issue:** [#1607](https://github.com/lightspeedwp/.github/issues/1607)

#### Specification Status
- **Current State:** `openspec:specification-complete` ✓
- **Documentation:** WORK_PLAN.md Phase 5 section, IMPLEMENTATION_ROADMAP.md Phase 5
- **Completion Date:** 2026-08-30
- **Approval:** Ready (blocked by Phase 4 completion)

**Specification Deliverables Completed:**
- ✅ Objectives defined: Train team, achieve 100% adoption, establish sustainable compliance
- ✅ Success criteria locked: 100% team trained, 95%+ compliance sustained, <3 support requests/week
- ✅ Dependencies documented: Phase 4 documentation complete, all 4 previous phases complete

#### Implementation Status
- **Current State:** `openspec:implementation-pending` (blocked by Phase 4)
- **Assigned to:** Phase 5 Lead (TBD)
- **Estimated Duration:** 1–2 days
- **Start Condition:** Phase 4 completion + tech lead sign-off
- **Go/No-Go Gate:** Defined in EXECUTION_CHECKLIST.md

**Implementation Deliverables:**
- [ ] Team training session conducted
- [ ] FAQ documentation finalized
- [ ] Team feedback collected
- [ ] Adoption metrics established
- [ ] Initiative moved to "completed" status

**Success Verification:**
- ✓ 100% team trained
- ✓ 95%+ compliance sustained
- ✓ <3 support requests/week
- ✓ Positive team sentiment

**Transitions to:** `openspec:implementation-in-progress` when Phase 5 Lead begins execution

---

## Phase Progression & Dependencies

### Dependency Map

```
Phase 1 (Specification: Complete | Implementation: Pending)
    ↓ [BLOCKER]
Phase 2 (Specification: Complete | Implementation: Pending)
    ↓ [BLOCKER]
Phase 3 (Specification: Complete | Implementation: Pending)
    ├─ [PARALLEL] #1719, #1944 (implementations)
    └─ [GATE] #1323 (integration testing)
    ↓ [BLOCKER]
Phase 4 (Specification: Complete | Implementation: Pending)
    ↓ [BLOCKER]
Phase 5 (Specification: Complete | Implementation: Pending)
```

### Transition Rules

| From State | To State | Trigger | Approver |
|-----------|----------|---------|----------|
| `specification-pending` | `specification-in-progress` | Phase lead reviews requirements | Phase lead |
| `specification-in-progress` | `specification-complete` | All success criteria documented | Tech lead |
| `specification-complete` | `implementation-pending` | Previous phase completes OR parallel start | Phase lead |
| `implementation-pending` | `implementation-in-progress` | Phase lead begins execution | Phase lead |
| `implementation-in-progress` | `implementation-complete` | All deliverables finished + go/no-go passed | Tech lead + phase lead |

---

## Success Metrics & Verification

### By Phase Completion

#### Phase 1 (Day 1)
- ✓ Zero new label violations in merged PRs
- ✓ All incoming PRs validated against prefix rules
- ✓ Team receives clear error messages for violations
- ✓ Issue #2283 label: `openspec:implementation-complete`

#### Phase 2 (Day 3)
- ✓ 100% of PRs audited and remediated
- ✓ Audit report complete and reviewed
- ✓ Compliance dashboard live and showing 100%
- ✓ Parallel audits (#909, #656, #664) complete
- ✓ Issue #1604 label: `openspec:implementation-complete`

#### Phase 3 (Day 8)
- ✓ Validation system fully operational
- ✓ Auto-sync working reliably
- ✓ Integration tests passing (Gate #1323)
- ✓ Zero manual label interventions required
- ✓ Issue #1605 label: `openspec:implementation-complete`

#### Phase 4 (Day 11)
- ✓ Documentation published
- ✓ Team references available
- ✓ FAQs address common questions
- ✓ Issue #1606 label: `openspec:implementation-complete`

#### Phase 5 (Day 14)
- ✓ 100% team trained
- ✓ 95%+ compliance sustained
- ✓ Support requests <3/week
- ✓ Positive team feedback
- ✓ Issue #1607 label: `openspec:implementation-complete`

### Post-Launch (Day 30)

- ✓ Sustained compliance ≥95%
- ✓ Preventable violations <2/week
- ✓ Support requests <3/week
- ✓ Zero escalations to leadership
- ✓ Positive team sentiment
- ✓ Initiative label: `openspec:implementation-complete`

---

## Automation & Label Progression

### Automated Label Transitions

The following transitions will be automated via GitHub Actions:

1. **PR Merge Triggers Phase Progression**
   - When a PR merges → `handle-pr-merged.cjs` processes linked issue(s)
   - One issue processed per `pull_request_target` event
   - Trigger: `openspec-progress-phase.yml` workflow
   - Alternative trigger: `workflow_dispatch` for manual phase progression

2. **Phase Completion Gates**
   - When Phase N success criteria verified → Phase lead applies `openspec:implementation-complete` label
   - Prerequisite for Phase N+1 start → Workflow checks for completion label before allowing next phase

3. **Issue Labeling Automation**
   - `openspec-progress-phase.yml` watches PR and workflow_dispatch events for phase transitions
   - `openspec-sync-labels.yml` maintains label consistency across related issues
   - `openspec-validate-labels.yml` ensures labels meet naming conventions

### Manual Checkpoints

The following require manual tech lead approval:

1. **Phase Go/No-Go Decision**
   - Tech lead reviews phase deliverables
   - Tech lead applies `openspec:specification-complete` label when spec is locked
   - Tech lead applies `openspec:implementation-pending` label to gate phase advancement
   - Tech lead approves `openspec:implementation-in-progress` when phase lead begins execution
   - Tech lead applies `openspec:implementation-complete` when all success criteria met

2. **Blocker Resolution**
   - If phase fails: Phase lead performs root cause analysis (24h max)
   - Tech lead approves fix implementation and re-runs validation
   - Phase progresses only after full regression testing

---

## Escalation & Decision Framework

### Phase-Level Decisions

**Decision:** "Can we combine phases?"  
**Answer:** No. Each phase depends on previous completion. Combining risks rework and rollback complexity.

**Decision:** "Can we start Phase N+1 before Phase N completes?"  
**Answer:** Specifications can be written in parallel (before Phase N starts), but implementations must complete sequentially per blocker dependencies.

**Decision:** "What if a phase fails?"  
**Answer:** Hold and fix per framework:
1. Root cause analysis (24h max)
2. Fix implementation
3. Full regression testing
4. Tech lead sign-off
5. Resume to next phase (do not skip)

### Escalation Path

1. **Phase Lead** → Identifies blocker, recommends GO/NO-GO
2. **Tech Lead** → Technical sign-off, approves blocker resolution
3. **Initiative Owner** → Approves timeline extensions, scope changes, risk acceptance

---

## Document Maintenance

**Last Updated:** 2026-08-30  
**Next Review:** After Phase 1 completion

**Updates Needed:**
- [ ] Assign Phase Leads and Tech Lead for each phase
- [ ] Record actual phase durations vs. estimates
- [ ] Document phase go/no-go decisions
- [ ] Update success metrics as phases complete
- [ ] Add lessons learned post-completion
- [ ] Archive framework when initiative reaches `openspec:implementation-complete`

---

## Related Resources

- **Meta Issue:** [#2352](https://github.com/lightspeedwp/.github/issues/2352) — Enforce PR labeling requirement
- **Planning Hub:** README.md, WORK_PLAN.md, QUICK_REFERENCE.md, EXECUTION_CHECKLIST.md in this directory
- **Implementation Roadmap:** IMPLEMENTATION_ROADMAP.md (detailed 5-phase breakdown)
- **Label Schema:** Defined in labeling-governance.yml and LABEL_STRATEGY.md
- **OpenSpec Workflows:** `.github/workflows/openspec-*.yml`

---

Version: 1.0 | Status: Active | Framework: OpenSpec v1.0 | Created: 2026-08-30
