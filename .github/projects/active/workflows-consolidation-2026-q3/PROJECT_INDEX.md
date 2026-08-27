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
├── README.md                              # Project overview & quick facts
├── IMPLEMENTATION_SUMMARY.md              # Executive roadmap (4 phases)
├── EXECUTION_PLAYBOOK.md                  # Step-by-step implementation guide
├── PROJECT_INDEX.md                       # This file (navigation & cross-refs)
├── GITHUB_ISSUE_PHASE_1A.md               # Ready-to-use issue templates
├── PHASE_1B_CHANGELOG_CONSOLIDATION.md    # Phase 1B changelog design
├── PHASE_1B_METRICS_CONSOLIDATION.md      # Phase 1B metrics design
├── PHASE_2_DOCS_CONSOLIDATION.md          # Phase 2 documentation design
├── PHASE_2_EXECUTION.md                   # Phase 2 detailed execution plan
├── PHASE_2_ISSUES.md                      # Phase 2 issue templates
├── PHASE_2_2_TEST_RESULTS.md              # Phase 2 integration test scenarios
├── PHASE_3_EXECUTION.md                   # Phase 3 detailed execution plan
├── PHASE_3_ISSUES.md                      # Phase 3 issue templates
├── PHASE_3_KICKOFF.md                     # Phase 3 ready-to-execute kickoff
├── PHASE_3_READINESS.md                   # Phase 3 readiness status report
├── PHASE_3_CONTINUATION_PROMPT.md         # Phase 3 continuation prompt
├── PHASE_4_CI_WORKFLOWS_REFACTORING.md    # Phase 4 shell control-flow refactoring
├── PHASE_4_PLANNING.md                    # Phase 4 detailed planning
├── PHASE_4_COMPLETION.md                  # Phase 4 completion status ✅
├── TESTING_STRATEGY.md                    # Test coverage & verification
└── EFFICIENCY_IMPROVEMENTS.md             # GitHub Actions minute savings details
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
- Estimated effort: 10-16 hours (revised: 3 workflows, not 5)
- Status: 🟡 IMPLEMENTATION IN PROGRESS

**Labeling (Phase 3)**

- Consolidate labeling workflows → See PHASE_3_EXECUTION.md, PHASE_3_ISSUES.md
- Estimated effort: 6-8 hours
- Status: 📋 READY (kickoff on 2026-07-26)

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
| readme-audit.yml | 2 | MERGE → documentation.yml | 🔄 IMPLEMENTATION |
| readme-regen.yml | 2 | MERGE → documentation.yml | 🔄 IMPLEMENTATION |
| readme-update.yml | 2 | MERGE → documentation.yml | 🔄 IMPLEMENTATION |
| validate-mermaid-pr.yml | 2 | KEEP (already consolidated) | ✅ SKIPPED |
| labeling.yml | 3 | MERGE → labeling-governance.yml | 📋 READY |
| dependabot-security-label.yml | 3 | MERGE → labeling-governance.yml | 📋 READY |
| issue-close-label-hygiene.yml | 3 | MERGE → labeling-governance.yml | 📋 READY |

---

## Status Summary

| Phase | Status | Effort | Timeline | Epic/Issues |
|-------|--------|--------|----------|------------|
| **1A: Quick Wins** | ✅ COMPLETE | 4h | Week 1 | Epic #1227, Issues #1231, #1233 |
| **1B-i: Changelog** | ✅ COMPLETE | 8-12h | Weeks 2-3 | PR #1280 |
| **1B-ii: Metrics** | ✅ COMPLETE | 6-8h | Weeks 2-3 | PR #1282 |
| **2: Documentation** | ✅ MERGED | 10-16h | Weeks 5-8 | PR #1306, #1313 |
| **2.2: Monitoring** | ✅ ACTIVE | 0h | 2026-07-24 to 07-26 | #1309 |
| **2.3: Cleanup** | 📋 READY | 2-3h | 2026-07-26 | #1310 |
| **3: Labeling** | 📋 READY | 6-8h | Weeks 9-10 | Issues #3.1-#3.4 (to create) |
| **4: Future** | 📋 PLANNING | TBD | Month 3+ | TBD |

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
**Related PR:** [#1228](https://github.com/lightspeedwp/.github/pull/1228)
