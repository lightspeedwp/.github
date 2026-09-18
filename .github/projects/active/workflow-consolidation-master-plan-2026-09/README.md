---
file_type: project-readme
title: "Workflow Consolidation Master Plan 2026-Q4"
description: "Strategic consolidation of 76+ GitHub workflows into 14 core unified workflows"
status: "planning"
created: "2026-09-11"
owners:
  - ashley@lightspeedwp.agency
effort_hours: 65-80
timeline_weeks: 4-5
---

# Workflow Consolidation Master Plan — 2026-Q4 Execution

**Status:** 📋 PLANNING COMPLETE — Ready for Phase 1 Execution  
**Owner:** Ashley Shaw (ashley@lightspeedwp.agency)  
**Created:** Sep 11, 2026  
**Effort:** 65-80 hours across 4-5 weeks

---

## Quick Start

1. **Start Here** → [`EXECUTION_SUMMARY.md`](./EXECUTION_SUMMARY.md) (5-min overview)
2. **Full Strategy** → [`WORKFLOW_CONSOLIDATION_MASTER_PLAN.md`](./WORKFLOW_CONSOLIDATION_MASTER_PLAN.md) (comprehensive plan)
3. **Formal Spec** → [`.github/specs/workflow-consolidation-2026-q4.spec.md`](../../specs/workflow-consolidation-2026-q4.spec.md)

---

## The Problem

You have **76+ active GitHub workflows** that:
- ❌ Run in parallel causing collisions
- ❌ Contain duplicate logic (15-20 workflows overlap)
- ❌ Block PR merges (15-20+ checks per PR)
- ❌ Consume excessive GitHub Actions minutes
- ❌ Are nearly impossible to maintain

**Result:** Slow merges, unpredictable automation, technical debt

---

## The Solution

Consolidate 76 workflows into **14 core unified workflows** that:
- ✅ Handle all current functionality
- ✅ Eliminate duplicate code (~500 lines)
- ✅ Reduce GitHub Actions minutes by 15-20%
- ✅ Speed up PR merges (4-6 min vs. 8-12 min)
- ✅ Single clear check gate
- ✅ Easier to maintain & extend

---

## The Plan

### Phase 1: Backup & Archive (Week 1-2)
- Archive 62 non-essential workflows
- Document consolidation mapping
- **Effort:** 8-10 hours
- **Deliverable:** PR with archived workflows

### Phase 2: Build Consolidated Workflows (Week 3-5)
- Implement 14 core workflows
- Preserve all 76 existing features
- **Effort:** 45-55 hours
- **Deliverable:** PR with consolidated workflows

### Phase 3: Testing & Validation (Week 6-7)
- Parallel execution testing
- Performance benchmarking
- **Effort:** 10-15 hours
- **Deliverable:** Production-ready validation report

**Total Effort:** ~65-80 hours  
**Timeline:** 4-5 weeks

---

## 14 Core Workflows

### Critical Path (Build First)

```
1️⃣  labeling-unified.yml              Auto-label, issue type, validation
2️⃣  validation-unified.yml            Branch names, PR templates, changelog
3️⃣  quality-gates.yml                 CodeQL, GitLeaks, accessibility
4️⃣  linting-unified.yml               All code quality checks
5️⃣  testing-unified.yml               All test runners
```

### Secondary Workflows (5 more)

```
6️⃣  events-issue-pr-metadata.yml      Issue/PR creation automation
7️⃣  changelog-management.yml          Changelog handling
8️⃣  pr-workflow.yml                   Issue linking, Mergify
9️⃣  documentation.yml                 README generation
🔟 branch-management.yml              Branch cleanup
```

### Supporting Workflows (4 more)

```
1️⃣1️⃣ issue-management.yml             Issue triage & lifecycle
1️⃣2️⃣ release-orchestration.yml        Release agent (agentic)
1️⃣3️⃣ reporting-metrics.yml            Metrics & dashboards
1️⃣4️⃣ project-management.yml           Project field sync
```

---

## What Gets Consolidated

### From 76 Workflows to 14

| Category | Before | After | Reduction |
|----------|--------|-------|-----------|
| Labeling | 9 | 1 | 89% |
| Validation | 12 | 1 | 92% |
| Documentation | 8 | 1 | 88% |
| Issue Management | 10 | 2 | 80% |
| PR Management | 7 | 2 | 71% |
| Testing | 8 | 1 | 88% |
| CI/CD | 8 | 1-2 | 75-88% |
| Project Management | 8 | 1 | 88% |
| Utilities | 8 | 0 | 100% |
| **Total** | **76** | **14** | **82%** |

---

## Key Features Preserved

✅ Issue type allocation (`type:` labels)  
✅ PR template-based labeling (frontmatter)  
✅ PR template validation  
✅ Linting (markdown, JavaScript, JSON, YAML, Mermaid)  
✅ Test verification  
✅ Changelog automation & validation  
✅ CodeRabbit reviews  
✅ Enforce PR-issue linking  
✅ README auto-generation & validation  
✅ CodeQL scanning  
✅ Branch name validation (with exceptions)  
✅ Mermaid diagram validation & accessibility  
✅ GitLeaks secret scanning  
✅ Mergify support  

---

## Success Metrics

### Quantitative
- [ ] Workflows: 76 → 14 (82% reduction)
- [ ] GitHub Actions minutes: -15-20%
- [ ] PR merge time: 8-12 min → 4-6 min
- [ ] Scheduled collisions: 4+ → 0
- [ ] Duplicate code: ~500 lines eliminated

### Qualitative
- [ ] Single unified check gate
- [ ] Clear workflow documentation
- [ ] Team confidence in CI/CD
- [ ] No breaking changes

---

## Project Files

```
.github/projects/active/workflow-consolidation-master-plan-2026-09/
├── README.md (THIS FILE)
├── EXECUTION_SUMMARY.md ⭐ (5-min overview)
├── WORKFLOW_CONSOLIDATION_MASTER_PLAN.md ⭐ (comprehensive plan)
├── PHASE_1_BACKUP_STRATEGY.md (TBD)
├── PHASE_2_IMPLEMENTATION_PLAN.md (TBD)
├── PHASE_3_TESTING_PLAN.md (TBD)
├── ARCHIVED_WORKFLOWS_MANIFEST.md (TBD)
└── WORKFLOW_FEATURES_MAPPING.md (TBD)

.github/specs/
└── workflow-consolidation-2026-q4.spec.md ⭐ (formal specification)
```

⭐ = Start here

---

## How This Coordinates With Active Work

This plan incorporates findings from 5 active consolidation projects:

| Project | Status | Integration |
|---------|--------|-------------|
| **workflows-consolidation-2026-q3** | Phase 3 ✅ | Use labeling findings |
| **issue-type-workflow-automation** | Phases 1-4 ✅ | Integrate skill |
| **automation-consolidation-agentic** | Phase 1 ✅ | Plan agent integration |
| **pr-finalisation-workflow** | Phase 1 📋 | Depends on labeling |
| **release-agentic-workflows** | Phase 5A ✅ | Use release agent |

---

## Next Steps (Week of Sep 11)

### For Approval (This Week)
- [ ] Review EXECUTION_SUMMARY.md
- [ ] Review WORKFLOW_CONSOLIDATION_MASTER_PLAN.md
- [ ] Team discusses and approves consolidation approach
- [ ] Assign team member to Phase 1

### For Phase 1 Execution (Sep 16-30)
- [ ] Create detailed Phase 1 backup strategy
- [ ] Backup & archive 62 workflows
- [ ] Merge Phase 1 PR

### For Phase 2 Execution (Oct 1-15)
- [ ] Implement labeling-unified.yml (critical path)
- [ ] Implement validation-unified.yml
- [ ] Implement quality-gates.yml
- [ ] Implement remaining 11 workflows

### For Phase 3 Execution (Oct 16-22)
- [ ] Parallel testing validation
- [ ] Performance benchmarking
- [ ] Team approval
- [ ] Production merge

---

## Risk & Mitigation

| Risk | Mitigation |
|------|-----------|
| Edge cases lost | 1-week parallel testing |
| Breaking change | Test on branch before merge |
| Increased complexity | Clear documentation |
| Performance regression | Benchmark before/after |
| Merge conflicts | Sequential implementation |

**Rollback Plan:** Keep archived workflows for 2 weeks; can restore in < 30 minutes if needed.

---

## Questions?

- **Quick overview?** → [`EXECUTION_SUMMARY.md`](./EXECUTION_SUMMARY.md)
- **Full strategy?** → [`WORKFLOW_CONSOLIDATION_MASTER_PLAN.md`](./WORKFLOW_CONSOLIDATION_MASTER_PLAN.md)
- **Formal spec?** → [`.github/specs/workflow-consolidation-2026-q4.spec.md`](../../specs/workflow-consolidation-2026-q4.spec.md)
- **Related projects?** → See links above
- **Status?** → Check this directory for phase-specific plans

---

## Document Index

### Planning Documents (Ready Now)
- ✅ EXECUTION_SUMMARY.md
- ✅ WORKFLOW_CONSOLIDATION_MASTER_PLAN.md
- ✅ README.md (this file)
- ✅ `.github/specs/workflow-consolidation-2026-q4.spec.md`

### Phase-Specific Docs (TBD)
- ⏳ PHASE_1_BACKUP_STRATEGY.md
- ⏳ PHASE_2_IMPLEMENTATION_PLAN.md
- ⏳ PHASE_3_TESTING_PLAN.md
- ⏳ ARCHIVED_WORKFLOWS_MANIFEST.md
- ⏳ WORKFLOW_FEATURES_MAPPING.md
- ⏳ WORKFLOW_CONSOLIDATION_MAPPING.md (`.github/docs/`)

---

**Status:** 📋 PLANNING COMPLETE  
**Owner:** Ashley Shaw (ashley@lightspeedwp.agency)  
**Created:** Sep 11, 2026  
**Next:** Phase 1 Execution (Sep 16)

*This master plan is the result of auditing 76+ workflows, 20+ documentation files, and 9 active consolidation projects. It provides a clear, 3-phase roadmap to simplify your automation infrastructure while preserving all critical functionality.*
