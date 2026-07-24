---
name: Project Index
description: Complete navigation map and cross-reference guide for the workflows consolidation initiative
file_type: documentation
metadata:
  status: active
  phase: planning
---

# Workflows Consolidation — Project Index

## File Organization

```
.github/projects/active/workflows-consolidation-2026-q3/
├── README.md                                   # Project overview & quick facts
├── IMPLEMENTATION_SUMMARY.md                   # Executive roadmap (4 phases)
├── EXECUTION_PLAYBOOK.md                       # Step-by-step implementation guide
├── PROJECT_INDEX.md                            # This file (navigation & cross-refs)
├── GITHUB_ISSUE_PHASE_1A.md                    # Ready-to-use issue templates
├── PHASE_1B_CHANGELOG_CONSOLIDATION.md         # Phase 1B changelog design
├── PHASE_1B_METRICS_CONSOLIDATION.md           # Phase 1B metrics design
├── PHASE_2_DOCS_CONSOLIDATION.md               # Phase 2 documentation design
├── PHASE_2_3_INTEGRATION_TESTING.md            # Phase 2.3 testing framework
├── PHASE_3_LABELING_CONSOLIDATION_PLAN.md      # Phase 3 labeling consolidation design
├── TESTING_STRATEGY.md                         # Test coverage & verification
└── EFFICIENCY_IMPROVEMENTS.md                  # GitHub Actions minute savings details
```

## Quick Navigation by Role

### 📋 Project Managers

**Understanding the big picture:**

1. Start: `README.md` (overview, quick facts, timeline)
2. Then: `IMPLEMENTATION_SUMMARY.md` (4-phase breakdown, effort estimates)
3. Reference: `EXECUTION_PLAYBOOK.md` (tracking progress per phase)

**Tracking progress:**

- Check `PROJECT_INDEX.md` (status table below)
- Reference related GitHub issues (links in README)

### 👨‍💻 Engineers/Implementers

**Before starting a phase:**

1. Read: `EXECUTION_PLAYBOOK.md` (step-by-step guide for your phase)
2. Reference: Phase-specific consolidation document (e.g., `PHASE_1B_CHANGELOG_CONSOLIDATION.md`)
3. Check: `TESTING_STRATEGY.md` (test coverage requirements)

**During implementation:**

- Follow EXECUTION_PLAYBOOK.md step-by-step
- Refer to audit report: `.github/reports/workflows/WORKFLOWS-CONSOLIDATION-AUDIT.md`
- Use GitHub issue template: `GITHUB_ISSUE_PHASE_1A.md` (if Phase 1A)

### 🔍 Code Reviewers

**Understanding what changed:**

1. Read: Relevant phase document (e.g., `PHASE_1B_CHANGELOG_CONSOLIDATION.md`)
2. Reference: Audit report for context (overlaps, why consolidating)
3. Check: `TESTING_STRATEGY.md` for coverage expectations

**Verifying implementation:**

- Test checklist in EXECUTION_PLAYBOOK.md
- Performance expectations in `EFFICIENCY_IMPROVEMENTS.md`
- Success criteria in EXECUTION_PLAYBOOK.md

### ✅ QA / Test Leads

**Understanding verification strategy:**

1. Read: `TESTING_STRATEGY.md` (comprehensive approach)
2. Then: EXECUTION_PLAYBOOK.md (per-phase testing checklist)
3. Reference: `EFFICIENCY_IMPROVEMENTS.md` (performance expectations)

**Verifying a consolidation:**

- Manual testing steps in EXECUTION_PLAYBOOK.md
- Performance regression thresholds
- Integration test requirements

---

## Consolidation Cross-Reference

### By Type

**Quick Wins (Phase 1A) — ✅ COMPLETE**

- Remove `testing.yml` → See GITHUB_ISSUE_PHASE_1A.md
- Extract template helpers → See GITHUB_ISSUE_PHASE_1A.md
- Status: Merged to develop

**Changelog (Phase 1B-i)**

- Consolidate changelog workflows → See PHASE_1B_CHANGELOG_CONSOLIDATION.md
- Estimated effort: 8-12 hours
- Status: Ready to start

**Metrics (Phase 1B-ii)**

- Consolidate metrics pipeline → See PHASE_1B_METRICS_CONSOLIDATION.md
- Estimated effort: 6-8 hours
- Status: Ready to start

**Documentation (Phase 2)**

- Consolidate README/docs workflows → See PHASE_2_DOCS_CONSOLIDATION.md
- Actual effort: ~12 hours (3 workflows, 449 lines consolidated)
- Deliverables: ✅ Consolidated documentation.yml, ✅ PR #1313 merged, ✅ Phase 2.3 testing plan, ✅ PR #1317 cleanup
- Status: ✅ COMPLETE (Phase 2.4 cleanup in progress)

**Labeling (Phase 3)**

- Consolidate labeling workflows → See PHASE_3_LABELING_CONSOLIDATION_PLAN.md
- Estimated effort: 6-8 hours (3 workflows, ~234 lines to consolidate)
- Status: 📋 DESIGN COMPLETE (implementation pending)

### By Workflow

| Workflow | Phase | Consolidation Action | Status |
|----------|-------|----------------------|--------|
| testing.yml | 1A | DELETE | ✅ COMPLETE |
| validate-pr-template.yml | 1A | Extract helpers → shared module | ✅ COMPLETE |
| template-enforcement.yml | 1A | Extract helpers → shared module | ✅ COMPLETE |
| changelog-validate.yml | 1B-i | MERGE → changelog-management.yml | ⏳ READY |
| changelog-auto-update.yml | 1B-i | MERGE → changelog-management.yml | ⏳ READY |
| metrics.yml | 1B-ii | MERGE → metrics-reporting.yml | ⏳ READY |
| metrics-summary.yml | 1B-ii | MERGE → metrics-reporting.yml | ⏳ READY |
| meta.yml | 2 | SPLIT (validation vs. maintenance) | 📋 DESIGN |
| readme-audit.yml | 2 | MERGE → documentation.yml | ✅ COMPLETE (deleted in PR #1317) |
| readme-regen.yml | 2 | MERGE → documentation.yml | ✅ COMPLETE (deleted in PR #1317) |
| readme-update.yml | 2 | MERGE → documentation.yml | ✅ COMPLETE (deleted in PR #1317) |
| validate-mermaid-pr.yml | 2 | KEEP (already consolidated) | ✅ SKIPPED |
| labeling.yml | 3 | ABSORB label logic (2 others) | 📋 DESIGN (PHASE_3_PLAN ready) |
| dependabot-security-label.yml | 3 | MERGE → labeling.yml | 📋 DESIGN (PHASE_3_PLAN ready) |
| issue-close-label-hygiene.yml | 3 | MERGE → labeling.yml | 📋 DESIGN (PHASE_3_PLAN ready) |

---

## Status Summary

| Phase | Status | Effort | Timeline | Epic/Issues |
|-------|--------|--------|----------|------------|
| **1A: Quick Wins** | ✅ COMPLETE | 4h | Week 1 | Epic #1227, Issues #1231, #1233 |
| **1B-i: Changelog** | ⏳ READY | 8-12h | Weeks 2-3 | Issue #1.B.1 (TBD) |
| **1B-ii: Metrics** | ⏳ READY | 6-8h | Weeks 2-3 | Issue #1.B.2 (TBD) |
| **2.1: Consolidation** | ✅ COMPLETE | 10-16h | Weeks 5-8 | PR #1313 (merged) |
| **2.2: Review** | ✅ COMPLETE | — | — | PR #1313 (merged) |
| **2.3: Integration Testing** | 🟡 TESTING PLAN | 4h | Week 8-9 | Issue #1309 (testing framework ready) |
| **2.4: Cleanup Old Workflows** | ✅ IN PROGRESS | 2h | Week 9 | PR #1317 (cleanup merged) |
| **3: Labeling Consolidation** | 📋 DESIGN | 6-8h | Weeks 9-10 | PHASE_3_LABELING_CONSOLIDATION_PLAN.md (design complete) |
| **4: Future** | 📋 FUTURE | TBD | Month 3+ | TBD |

---

## Key Documents

### Audit & Analysis

- **Workflow Audit:** `.github/reports/workflows/WORKFLOWS-CONSOLIDATION-AUDIT.md`
  - Analysis of 31 workflows
  - Overlap identification
  - Consolidation recommendations

### Planning & Strategy

- **Implementation Summary:** `IMPLEMENTATION_SUMMARY.md`
  - 4-phase breakdown
  - Effort estimates
  - Success metrics

- **Execution Playbook:** `EXECUTION_PLAYBOOK.md`
  - Step-by-step guides
  - Testing strategies
  - Rollback procedures

### Phase-Specific Designs

- **Phase 1B Changelog:** `PHASE_1B_CHANGELOG_CONSOLIDATION.md`
- **Phase 1B Metrics:** `PHASE_1B_METRICS_CONSOLIDATION.md`
- **Phase 2 Docs:** `PHASE_2_DOCS_CONSOLIDATION.md`
- **Phase 3 Labeling:** `PHASE_3_LABELING_CONSOLIDATION.md`

### Testing & Verification

- **Testing Strategy:** `TESTING_STRATEGY.md` (comprehensive approach)
- **Efficiency Details:** `EFFICIENCY_IMPROVEMENTS.md` (minute savings breakdown)

### Issue Templates

- **Phase 1A Issues:** `GITHUB_ISSUE_PHASE_1A.md` (ready-to-use)

---

## Frequently Referenced Items

### Metrics

- **Target reduction:** 31 → 25 workflows (-19%)
- **Code duplication:** ~500 lines to eliminate
- **Actions minutes saved:** 15-20% estimated
- **Total effort:** 60-85 hours across 12 weeks

### GitHub Links

- **Epic:** [#1227](https://github.com/lightspeedwp/.github/issues/1227)
- **PR (Phase 1A):** [#1228](https://github.com/lightspeedwp/.github/pull/1228)
- **Phase 1A Issues:** #1231, #1233

### GitHub Artifacts

- **Audit report:** `.github/reports/workflows/WORKFLOWS-CONSOLIDATION-AUDIT.md`
- **Branch protection rules:** Enforce pr-template validation
- **Mergify config:** Auto-merge rules

---

## How to Use This Index

1. **Finding a specific consolidation:** See "Consolidation Cross-Reference" section
2. **Understanding a phase:** See "Quick Navigation by Role"
3. **Getting step-by-step instructions:** Go to EXECUTION_PLAYBOOK.md
4. **Understanding why we're consolidating:** Read the audit report
5. **Tracking project progress:** Check "Status Summary" table above

---

**Last Updated:** 2026-07-24  
**Epic:** [#1227](https://github.com/lightspeedwp/.github/issues/1227)  
**Phase 2 PR:** [#1313](https://github.com/lightspeedwp/.github/pull/1313) (consolidated documentation.yml) — ✅ Merged  
**Phase 2.4 PR:** [#1317](https://github.com/lightspeedwp/.github/pull/1317) (cleanup legacy workflows) — ✅ Merged  
**Phase 3 Status:** Design complete (PHASE_3_LABELING_CONSOLIDATION_PLAN.md), ready for implementation
