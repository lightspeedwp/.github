# GitHub Workflows Consolidation Initiative

## Quick Facts

| Metric | Value |
|--------|-------|
| **Current Workflows** | 31 → 29 |
| **Target Workflows** | 25 |
| **Reduction Progress** | 6% (2 workflows consolidated) |
| **Code Duplication Eliminated** | ~150 lines (Phase 2.1) |
| **Actions Minutes Savings Achieved** | ~40/week (~170/month) |
| **Total Effort** | 60-85 hours |
| **Timeline** | 12 weeks (5-7h/week) |
| **Start Date** | 2026-07-24 |
| **Epic Issue** | [#1227](https://github.com/lightspeedwp/.github/issues/1227) |
| **Current Status** | 🟡 Phase 2.1 ✅ MERGED; Phase 2.2 ⏳ MONITORING (24-48h) |

---

## Phase Status Dashboard

| Phase | Title | Status | PR | Issues |
|-------|-------|--------|-----|--------|
| **1A** | Quick Wins | ✅ COMPLETE | - | - |
| **1B** | Medium-Impact | ✅ COMPLETE | - | - |
| **2.1** | Create Workflows | ✅ MERGED | #1306 | #1307, #1308 ✅ |
| **2.2** | Monitoring Period | ⏳ ACTIVE (24-48h) | - | #1309 ✅ |
| **2.3** | Cleanup & Delete | 🟢 READY | - | #1310 ✅ |
| **2.4** | Final Review | ✅ APPROVED | - | #1311 ✅ |
| **3** | Labeling Workflows | 📋 NEXT | - | - |
| **4** | Future Work | 📋 PLANNING | - | - |

---

## Navigation Guide

This project is organized into **4 phases** with supporting documentation:

### 📋 Core Documents

1. **IMPLEMENTATION_SUMMARY.md**
   - Executive overview of the consolidation strategy
   - High-level roadmap and phase breakdown
   - Success metrics and risk mitigation

2. **EXECUTION_PLAYBOOK.md**
   - Step-by-step implementation guide
   - Issue creation templates
   - Testing and verification checklist

3. **PROJECT_INDEX.md**
   - Complete file index and navigation
   - Reading guide by role
   - Cross-references by consolidation type

### 🎯 Phase-Specific Documents

- **PHASE_1A_QUICK_WINS.md** - Quick wins (Remove testing.yml, Extract helpers)
- **PHASE_1B_CHANGELOG_CONSOLIDATION.md** - Merge changelog workflows
- **PHASE_1B_METRICS_CONSOLIDATION.md** - Consolidate metrics pipeline
- **PHASE_2_DOCS_CONSOLIDATION.md** - Documentation & README consolidation
- **PHASE_3_LABELING_CONSOLIDATION.md** - Labeling workflows consolidation

### 📊 Supporting Documents

- **TESTING_STRATEGY.md** - Test coverage requirements
- **EFFICIENCY_IMPROVEMENTS.md** - GitHub Actions minutes optimization details
- **PROJECT_INDEX.md** - Complete file index with cross-references

### 🔗 GitHub Issue Templates

- **GITHUB_ISSUE_EPIC.md** - Epic issue (✅ Already created: #1227)
- **GITHUB_ISSUE_PHASE_1A.md** - Phase 1A issues template

---

## Success Criteria

**Quantitative:**

- ✅ Workflow count: 31 → 25
- ✅ Code duplication: Eliminate ~500 lines
- ✅ GitHub Actions minutes: 15-20% reduction
- ✅ Test coverage: Maintain or improve
- ✅ Scheduled run collisions: Reduce from 4+ to 2

**Qualitative:**

- ✅ Single source of truth for validation logic
- ✅ Clear separation of concerns across workflows
- ✅ Improved developer experience
- ✅ Eliminated time-coupling assumptions

---

## Phase Timeline

| Phase | Duration | Effort | Status |
|-------|----------|--------|--------|
| **1A: Quick Wins** | Week 1 | 4h | 🟢 Ready to start |
| **1B: Medium-Impact** | Weeks 2-3 | 14-20h | ⏳ Depends on 1A |
| **2: Documentation** | Weeks 5-8 | 12-16h | ⏳ Design-heavy |
| **3: Labeling** | Weeks 5-8 | 6-8h | ⏳ Independent |
| **4: Future** | Month 3+ | TBD | 📋 Planning phase |

---

## Related Links

- **Epic Issue:** [#1227](https://github.com/lightspeedwp/.github/issues/1227)
- **Audit Report:** `.github/reports/workflows/WORKFLOWS-CONSOLIDATION-AUDIT.md`
- **Branching Guide:** `docs/BRANCHING_STRATEGY.md`
- **Issue Templates:** `.github/ISSUE_TEMPLATE/`

---

## Recent Updates

- **2026-07-24:** Project initiated, audit completed, implementation plan created, Epic issue #1227 created

---

**Project Owner:** Ash Shaw  
**Last Updated:** 2026-07-24
