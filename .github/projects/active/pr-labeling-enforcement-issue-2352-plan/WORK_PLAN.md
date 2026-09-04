---
file_type: documentation
title: PR Labeling Enforcement Initiative (#2352) - Prioritized Work Plan
date: 2026-08-29
status: active
version: 1.0
---

# PR Labeling Enforcement Initiative (#2352) — Prioritized Work Plan

## Executive Summary

Issue #2352 (Enforce PR labeling requirement) represents a critical governance initiative divided into **5 sequential phases** with clear dependencies. The initiative aims to systematically enforce label validation across all pull requests, ensuring consistent metadata practices organisation-wide.

**Timeline:** ~7-10 business days for critical path (Phases 1-3)  
**Critical Blocker:** Phase 1 must complete before any other phase can begin  
**Current Status:** PR #2444 merged; Phase 1 blocking issues resolved

---

## Phase Dependency Map

```
Phase 1 (CRITICAL)
    ↓
Phase 2
    ↓
Phase 3
    ↓
Phase 4
    ↓
Phase 5
```

Each phase **must** complete sequentially. No parallel work possible on core phases.

---

## Detailed Phase Breakdown

### Phase 1: Stop New Label Prefix Violations (CRITICAL BLOCKER)

**Issue:** #2283  
**Estimated Duration:** 2–3 hours  
**Status:** ACTIVE (Ready to start)  
**Dependencies:** None — Can start immediately

#### Objectives
- Audit existing enforcement infrastructure (labeling-governance.yml, run-labeling-agent.js, validation rules)
- Assess current validation path and identify potential job conflicts or duplicate checks
- Decide whether to reuse existing components or build replacement system
- Implement automated validation to prevent new label prefix violations
- Add pre-commit hooks to catch violations before merge
- Update CI/CD pipeline with label validation gates

#### Deliverables
- [ ] Audit report of existing enforcement path (labeling-governance.yml, run-labeling-agent.js, validation rules)
- [ ] Assessment of local pre-commit check feasibility and GitHub API label-data availability
- [ ] Decision document: reuse vs. replace existing enforcement components
- [ ] Validation script (`scripts/validate-labels.js` or similar)
- [ ] GitHub Actions workflow for PR label validation
- [ ] Pre-commit hook configuration (or rationale for CI-only approach)
- [ ] Documentation of validation rules

#### Success Criteria
- All new PRs fail CI if labels violate prefix rules
- Zero false positives in validation
- Developers receive clear error messages

#### Blocker Status
🚫 **BLOCKS** Phases 2, 3, 4, 5  
✅ Can proceed once complete

---

### Phase 2: Fix Existing Label Prefix Violations

**Issue:** #1604  
**Estimated Duration:** 24–48 hours  
**Status:** WAITING for Phase 1  
**Dependencies:** Phase 1 ✓

#### Objectives
- Audit all existing labels in the repository
- Systematically rename/migrate non-compliant labels
- Update all label references in workflows, automations, and documentation

#### Parallel Sub-Tasks (Run in parallel after Phase 1)
- **#909:** Audit Issue Labeling Rules (Discovery)
- **#656:** Audit Issue Labeling Rules (Child task - Implementation)
- **#664:** Audit Labeling Docs (Documentation audit)

#### Key Activities
1. Run label audit script (Phase 1 deliverable)
2. Generate list of all non-compliant labels with usage counts
3. Plan migration strategy (rename vs. retire)
4. Update GitHub organization label settings
5. Migrate labels on all existing issues/PRs
6. Update all workflow references
7. Update team documentation

#### Deliverables
- [ ] Complete audit report of all existing labels
- [ ] Migration mapping document
- [ ] Updated workflow files with corrected labels
- [ ] Updated documentation with correct label names
- [ ] Validation report showing 100% compliance

#### Success Criteria
- All repository labels follow prefix standards
- Zero references to old/non-compliant labels in code
- All workflows and automations use correct labels
- Historical label data preserved/documented

#### Blocker Status
🚫 **BLOCKS** Phases 3, 4, 5  
✅ Can proceed once Phase 1 ✓

---

## Canonical Label Schema (Reconciled across all phases)

**Purpose:** Single source of truth for label validation, compliance audits, and CI enforcement  
**Scope:** Applies to Phases 1-5; referenced in all success criteria and compliance checks  
**Sources:** Reconciles LABEL_STRATEGY.md (strategy layer) with labeling-governance.yml (governance layer)

### Label Categories

| Category | Prefix | Required? | Constraints | Conflicts With | Phase Implementation |
|----------|--------|-----------|-------------|-----------------|-------------------|
| **Status** | `status:` | Yes, one per PR | Exactly one required per PR | Cannot combine multiple `status:` values | Phase 1 validation |
| **Priority** | `priority:` | No (optional) | Zero or one per issue/PR | Cannot combine `priority:critical` with `status:blocked` without justification | Phase 1 validation |
| **Type** | `type:` | Yes, one per issue | Exactly one required per issue | Cannot combine `type:task` with `type:bug` in same item | Phase 2 audit |
| **Area** | `area:` | Optional | Zero or more allowed | None | Phase 1 validation |
| **Component** | `component:` | Optional | Zero or more allowed | None | Phase 1 validation |
| **Lifecycle** | `lifecycle:` | OpenSpec only | Zero or one per OpenSpec proposal | Cannot combine `lifecycle:proposal` with `status:merged` | Phase 3 (#1944) |
| **Audit Flag** | `audit:` | Conditional | Used during Phase 2-3 migrations | None; temporary | Phase 2 (#909, #656, #664) |

### Compliance Rules (All Phases)

1. **Prefix Validation:** All labels must follow `prefix:value` format; no labels with spaces or special chars except hyphens
2. **Required Labels:** Every PR must have `status:` label before merge (enforced Phase 1)
3. **Conflict Prevention:** Validation rules must reject conflicting label combinations at GitHub API level
4. **Backwards Compatibility:** During Phase 2, old label names mapped to new format; no breaking changes to historical data
5. **Documentation Sync:** Any label added/removed requires CONTRIBUTING.md + labeling-governance.yml update

### Validation Checkpoints

| Checkpoint | Phase | Tool/Script | Enforced? |
|-----------|-------|-----------|-----------|
| PR label validation | 1 | GitHub Actions + pre-commit hook | Yes (CI blocks merge) |
| Issue label audit | 2 | Audit script (#909, #656) | No (informational) |
| Label coverage enforcement | 3 | GitHub API enforcement | Yes (merge gate) |
| Documentation audit | 4 | Manual review + #664 | No (documentation gate) |
| Team compliance verification | 5 | Analytics dashboard | No (monitoring) |

---

### Phase 3: Enforce Label Validation

**Issue:** #1605  
**Estimated Duration:** 3–5 days  
**Status:** WAITING for Phase 2  
**Start After:** Phase 2 ✓  
**Completion Gate:** #1323 (Integration Testing) — must pass before Phase 3 sign-off

#### Objectives
- Implement comprehensive validation rules across all label types
- Enforce validation at GitHub API level
- Build label coverage enforcement into PR merge gates

#### Related Implementation Tasks (Execute in parallel with Phase 3)
- **#1719:** Auto-Sync PR Labels (sync-pr-labels.js)
  - Automatically sync related PR labels with linked issues
  - Reduce manual label maintenance
  - Estimated: 4–6 hours
  
- **#1944:** OpenSpec Lifecycle Status Labels
  - Add lifecycle status labels for OpenSpec proposals
  - Integration with OpenSpec labeling system
  - Estimated: 3–4 hours

#### Testing
- **#1323:** Phase 3.2 - Integration Testing (Ready to execute)
  - Comprehensive test suite for validation rules
  - End-to-end workflow validation
  - PR labeling enforcement testing

#### Key Activities
1. Define comprehensive validation schema
2. Implement label validation in GitHub Actions
3. Add PR merge gate checks
4. Configure label coverage requirements per repository
5. Integrate auto-sync functionality
6. Build OpenSpec lifecycle status support
7. Run full integration test suite (#1323)

#### Deliverables
- [ ] Complete validation schema document
- [ ] Label validation GitHub Actions workflow
- [ ] PR merge gate configuration
- [ ] Label coverage enforcement rules
- [ ] Auto-sync PR labels implementation (PR labels ↔ linked issues)
- [ ] OpenSpec lifecycle status label system
- [ ] Integration test report with 100% pass rate

#### Success Criteria
- All PRs automatically validated for label compliance
- Labels automatically sync between related PRs and issues
- OpenSpec proposals have accurate lifecycle status
- CI blocks merge for label violations
- Test suite: 100% pass rate

#### Blocker Status
🚫 **BLOCKS** Phases 4, 5  
✅ Can proceed once Phase 2 ✓

---

### Phase 4: Documentation Updates

**Issue:** #1606  
**Estimated Duration:** 2–3 days  
**Status:** WAITING for Phase 3  
**Dependencies:** Phase 3 ✓

#### Objectives
- Create/update comprehensive label documentation
- Document validation rules and compliance requirements
- Build troubleshooting guides
- Create runbooks for common label operations

#### Related Audits (Inform documentation updates)
- **#664:** Audit Labeling Docs (from Phase 2)

#### Key Activities
1. Audit existing documentation (use #664 findings)
2. Document all label categories and prefixes
3. Create validation rule reference
4. Build PR labeling requirements guide
5. Create troubleshooting guide
6. Build label management runbook
7. Update CONTRIBUTING.md with label requirements
8. Create label glossary/reference

#### Deliverables
- [ ] Label categories and naming conventions guide
- [ ] Validation rules reference document
- [ ] PR labeling requirements guide
- [ ] Label troubleshooting guide
- [ ] Label management runbook
- [ ] Updated CONTRIBUTING.md
- [ ] Label glossary (all org labels documented)
- [ ] FAQ: Label-related questions

#### Success Criteria
- All label documentation is current and accurate
- New developers can understand label system from docs
- Troubleshooting guides cover 90%+ of common issues
- CONTRIBUTING.md explicitly covers label requirements

#### Blocker Status
🚫 **BLOCKS** Phase 5  
✅ Can proceed once Phase 3 ✓

---

### Phase 5: Team Training

**Issue:** #1607  
**Estimated Duration:** 1–2 days  
**Status:** WAITING for Phase 4  
**Dependencies:** Phase 4 ✓

#### Objectives
- Train development team on new labeling requirements
- Build adoption across organisation
- Establish label governance practices
- Monitor compliance and provide ongoing support

#### Key Activities
1. Prepare training materials (slides, videos, guides)
2. Schedule team training sessions
3. Create label reference cards/checklists
4. Set up monitoring/metrics for compliance
5. Establish feedback loop for label improvements
6. Create escalation process for label issues
7. Plan regular label governance reviews

#### Deliverables
- [ ] Training presentation materials
- [ ] Team training session recordings
- [ ] Label quick reference card
- [ ] Compliance monitoring dashboard
- [ ] Label feedback form/process
- [ ] Training completion sign-off documentation
- [ ] 30/60/90 day follow-up plan

#### Success Criteria (By Day 30)
- 100% of team completes training
- Compliance rate ≥ 95%
- Support requests <3/week
- Preventable violations <2/week
- Training feedback score ≥ 4.5/5 stars

#### Blocker Status
✅ Final phase - No blocking dependencies

---

## Critical Path Timeline

| Phase | Issue | Duration | Start Condition | End Date | Critical? |
|-------|-------|----------|-----------------|----------|-----------|
| 1 | #2283 | 2-3h | Immediate | +0.5d | YES |
| 2 | #1604 | 24-48h | After Phase 1 | +2.5d | YES |
| 3 | #1605 | 3-5d | After Phase 2 | +7.5d | YES |
| 4 | #1606 | 2-3d | After Phase 3 | +10.5d | NO |
| 5 | #1607 | 1-2d | After Phase 4 | +12d | NO |

**Total Estimated Timeline:** 7–12 business days (4 business weeks worst case)

---

## Implementation Tasks Matrix

### Parallel Work (After Phase 1 ✓)

| Task | Issue | Duration | Phase | Category |
|------|-------|----------|-------|----------|
| Auto-Sync PR Labels | #1719 | 4-6h | 3 | Implementation |
| Label Coverage Audit | #1786 | 6-8h | 2 | Testing/Audit | ✅ COMPLETED (PR #2623) |
| OpenSpec Lifecycle Labels | #1944 | 3-4h | 3 | Implementation |
| Audit Issue Labels | #909 | 4-6h | 2 | Audit |
| Audit Issue Labels (Child) | #656 | 8-12h | 2 | Audit |
| Audit Documentation | #664 | 2-3h | 2/4 | Audit |
| Integration Testing | #1323 | 4-8h | 3 | Testing |

### Execution Strategy

**Phase 2 Parallel Work:**
- Run #909, #656, #664 audits **simultaneously** after Phase 1 completes
- Total Phase 2 time: 24-48h (audit runs in parallel with label migration)

**Phase 3 Parallel Work:**
- Execute #1719, #1944 while Phase 3 core work progresses
- Run #1323 integration tests before Phase 3 sign-off
- Total Phase 3 time: 3-5d (implementations run in parallel)

---

## Dependency Chain Analysis

### Hard Blockers (Absolute Sequential)
```
Phase 1 (Validation Prevention)
  ↓ [MUST COMPLETE]
Phase 2 (Fix Existing)
  ↓ [MUST COMPLETE]
Phase 3 (Enforce System-Wide)
  ↓ [MUST COMPLETE]
Phase 4 (Document)
  ↓ [MUST COMPLETE]
Phase 5 (Train)
```

### Soft Dependencies (Can start after predecessor, don't block completion)
- Phase 2 audits (#909, #656, #664) can inform Phase 3/4 work
- Phase 3 implementations (#1719, #1944) don't block core Phase 3
- Integration tests (#1323) must pass before Phase 3 sign-off

### Independent Tasks (No dependencies)
- Phase 4/5 documentation and training prep can begin once Phase 3 starts

---

## Issue Status & Readiness

| Issue | Title | Status | Blocker | Ready? |
|-------|-------|--------|---------|--------|
| #2352 | Enforce PR labeling requirement | ACTIVE | Meta | ✓ |
| #2283 | Phase 1: Stop New Violations | READY | YES | ✓ |
| #1604 | Phase 2: Fix Existing | BLOCKED | YES | ⏳ |
| #1605 | Phase 3: Enforce Validation | BLOCKED | YES | ⏳ |
| #1606 | Phase 4: Documentation | BLOCKED | NO | ⏳ |
| #1607 | Phase 5: Team Training | BLOCKED | NO | ⏳ |
| #1719 | Auto-Sync PR Labels | BLOCKED | NO | ⏳ |
| #1786 | Label Coverage Audit | ✅ COMPLETED | NO | ✓ (PR #2623 merged) |
| #1944 | OpenSpec Lifecycle Labels | BLOCKED | NO | ⏳ |
| #1323 | Phase 3.2: Integration Testing | READY | NO | ✓ |
| #909 | Audit Issue Labeling | BLOCKED | NO | ⏳ |
| #656 | Audit Issue Labeling (Child) | BLOCKED | NO | ⏳ |
| #664 | Audit Labeling Docs | BLOCKED | NO | ⏳ |

---

## Milestone Checkpoints

### Milestone 1: Validation Prevention (Phase 1 — Ready to Start)
- [ ] Validation script deployed and tested
- [ ] CI/CD integration verified
- [ ] No new violations can be merged
- [ ] Documentation updated
- [ ] Team notified of change

**Go/No-Go:** Proceed to Phase 2 only if all checks pass

---

### Milestone 2: Compliance Baseline (Phase 2 — Blocked by Phase 1)
- [ ] All existing labels audited
- [ ] Non-compliant labels remediated
- [ ] All workflows updated
- [ ] Documentation synchronized
- [ ] Compliance audit: 100% pass

**Go/No-Go:** Proceed to Phase 3 only if compliance is 100%

---

### Milestone 3: System-Wide Enforcement (Phase 3 — Blocked by Phase 2)
- [ ] Validation schema implemented
- [ ] Auto-sync working (linked issues/PRs)
- [ ] OpenSpec lifecycle labels deployed
- [ ] Integration tests: 100% pass
- [ ] PR merge gates enforcing labels
- [ ] No regressions in existing workflows

**Go/No-Go:** Proceed to Phase 4 only if all systems operational

---

### Milestone 4: Knowledge Base Ready (Phase 4 — Blocked by Phase 3)
- [ ] All documentation current and accurate
- [ ] Label glossary complete
- [ ] Troubleshooting guides published
- [ ] CONTRIBUTING.md updated
- [ ] Developer feedback processed

**Go/No-Go:** Proceed to Phase 5 only if team can self-serve from docs

---

### Milestone 5: Team Adoption (Phase 5 — Blocked by Phase 4)
- [ ] 100% team training completion
- [ ] Compliance rate ≥ 95%
- [ ] Support tickets <5/week
- [ ] Feedback incorporated
- [ ] Governance process established

**Go/No-Go:** Initiative complete; establish ongoing maintenance cycle

---

## Risk Mitigation

### Critical Risks

**Risk 1: Phase 1 Fails → Entire Initiative Blocked**
- **Mitigation:** Extensive testing before merge; pre-production validation
- **Backup:** Revert PR and refactor validation approach

**Risk 2: Migration Complexity in Phase 2 → Delays cascade**
- **Mitigation:** Automate label migration; thorough testing; staged rollout
- **Backup:** Allocate +24h buffer for manual remediation

**Risk 3: Validation Too Strict → Developer friction**
- **Mitigation:** Gather feedback during Phase 1; adjust rules
- **Backup:** Rollback to permissive mode; retrain team

**Risk 4: OpenSpec integration conflicts with Phase 3**
- **Mitigation:** Test #1944 in isolation first; mock dependencies
- **Backup:** Defer #1944 to post-launch if blocking Phase 3

---

## Success Metrics

### Phase 1
- ✓ Zero label prefix violations merged
- ✓ CI validation catches 100% of violations
- ✓ Developer error messages clear and actionable

### Phase 2
- ✓ 100% label compliance across repository
- ✓ 0 dangling references to old labels
- ✓ Audit report generated and reviewed

### Phase 3
- ✓ Auto-sync working for 90%+ of label scenarios
- ✓ Integration tests: 100% pass rate
- ✓ Merge blocked for <30s label-related delays

### Phase 4
- ✓ Onboarding time for new developers: <15 min
- ✓ Support requests about labels: <3/week
- ✓ Documentation completeness: >95%

### Phase 5
- ✓ Team compliance: ≥95%
- ✓ Training satisfaction: ≥4.5/5 stars
- ✓ Preventable violations: <2/month

---

## Recommended Execution Order

### Day 1: Phase 1 Initiation
```
09:00 → Review #2283 requirements
10:00 → Implement validation script
11:00 → Test against known violations
12:00 → Deploy to staging
14:00 → CI/CD integration
15:00 → Production deployment
16:00 → Team notification + documentation
```

### Day 2-3: Phase 2 Parallel Activities
```
Phase 2 Main Track (Parallel)
├─ Issue audit (#909, #656)
├─ Label remediation
├─ Workflow updates
└─ Compliance verification

Estimated: 24-48 hours
```

### Day 4-8: Phase 3 Implementation (Parallel Tasks)
```
Phase 3 Core
├─ Validation schema
├─ Enforcement automation
├─ PR merge gates
└─ Testing & validation

Phase 3 Parallel Tasks
├─ Auto-sync PR labels (#1719)
├─ OpenSpec lifecycle labels (#1944)
└─ Integration test suite (#1323)

Estimated: 3-5 days
```

### Day 9-11: Phase 4 Documentation
```
├─ Audit findings integration (#664)
├─ Label documentation
├─ Troubleshooting guides
├─ CONTRIBUTING.md update
└─ Team review & feedback

Estimated: 2-3 days
```

### Day 12-14: Phase 5 Training
```
├─ Training materials prep
├─ Team training sessions
├─ Compliance monitoring setup
└─ Feedback process establishment

Estimated: 1-2 days
```

---

## Key Contacts & Approvals

- **Initiative Owner:** GitHub Issue #2352
- **Phase Leads:** TBD (assign per phase)
- **Technical Review:** Code review team
- **Product Review:** Product/Governance team
- **Team Lead Sign-off:** Required before Phase 5

---

## Related Documentation

- [Label Prefix Enforcement Project](../label-prefix-enforcement-2026-08-05/README.md)
- [Label Audit Plan](../label-prefix-audit-2026-08-05/README.md)
- [OpenSpec Labels Automation](../openspec-labels-automation/README.md)
- [Contributing Guidelines](../../../../CONTRIBUTING.md)
- [Label Reference](../../../../.github/labels/)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-29 | Claude | Initial comprehensive work plan |

---

## Appendix: Full Issue List

### Phase 1
- **#2283** – Phase 1 - Stop New Label Prefix Violations (CRITICAL)

### Phase 2
- **#1604** – Phase 2 - Fix Existing Label Prefix Violations
- **#909** – Audit Issue Labeling Rules (Parallel audit)
- **#656** – Audit Issue Labeling Rules (Child task, Parallel audit)
- **#664** – Audit Labeling Docs (Parallel audit)

### Phase 3
- **#1605** – Phase 3 - Enforce Label Validation
- **#1719** – Auto-Sync PR Labels (Parallel implementation)
- **#1944** – OpenSpec Lifecycle Status Labels (Parallel implementation)
- **#1323** – Phase 3.2 - Integration Testing

### Phase 4
- **#1606** – Phase 4 - Documentation Updates

### Phase 5
- **#1607** – Phase 5 - Team Training

### Related Meta
- **#2352** – Enforce PR labeling requirement (Initiative meta issue)
- **#2444** – PR that merged blocking issues #2424 and #2423 ✓
