---
file_type: summary
title: "Workflow Consolidation Planning — Execution Summary"
status: "planning-complete"
created: "2026-09-11"
---

# Workflow Consolidation Planning — Execution Summary

## What Was Audited

You have **76+ active GitHub workflows** causing workflow collisions, duplicate logic, and impossible PR merge cycles. The audit reviewed:

✅ **Active Project Folders (9 projects)**
- workflows-consolidation-2026-q3 (Phase 3 complete)
- issue-type-workflow-automation (Phases 1-4 complete, 5-8 ready)
- automation-consolidation-agentic-workflows-2026-09 (Phase 1 complete)
- pr-finalisation-workflow (Phase 1 planning)
- release-agentic-workflows-2026-08-11 (Phase 5A complete)
- 4 other related consolidation initiatives

✅ **Documentation Files (20+ files)**
- Labeling strategy, issue types, automation governance
- PR templates, branch naming, release process
- All consolidation planning documents

✅ **Workflow Inventory (76 workflows)**
- Labeling (9), Validation (12), Documentation (8)
- Issue Management (10), PR Management (7)
- Testing (8), CI/CD (8), Project Management (8)
- Utilities (8)

---

## Key Findings

### Problem Severity: CRITICAL

| Issue | Current State | Impact |
|-------|---------------|--------|
| Workflow Count | 76 active | Impossible to manage |
| Duplicate Logic | 15-20 workflows | Maintenance nightmare |
| Scheduled Collisions | 4+ at 3am UTC | Resource contention |
| PR Merge Blockers | 15-20+ checks | Slow merge cycles |
| Code Duplication | ~500 lines | Technical debt |
| Team Confidence | Low | CI/CD is unpredictable |

### What You Actually Need (14 Workflows)

The consolidated set provides all required features:

✅ Issue type allocation (`type:` labels)  
✅ PR template-based labeling (frontmatter extraction)  
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

## The Solution: 14 Core Workflows

### Critical Path (Build First)

1. **labeling-unified.yml** — Auto-label, issue type allocation, validation
2. **validation-unified.yml** — Branch names, PR template, changelog, frontmatter
3. **quality-gates.yml** — CodeQL, GitLeaks, accessibility
4. **linting-unified.yml** — All code quality checks
5. **testing-unified.yml** — All test runners

### Secondary Workflows (5 more)

6. **events-issue-pr-metadata.yml** — Issue/PR automation
7. **changelog-management.yml** — Changelog handling
8. **pr-workflow.yml** — Issue linking, Mergify
9. **documentation.yml** — README generation
10. **branch-management.yml** — Branch cleanup

### Supporting Workflows (4 more)

11. **issue-management.yml** — Issue triage & lifecycle
12. **release-orchestration.yml** — Release agent (agentic)
13. **reporting-metrics.yml** — Metrics & dashboards
14. **project-management.yml** — Project field sync

---

## Implementation Roadmap: 3 Phases

### Phase 1: Backup & Archive (Week 1-2)
- Backup 62 non-essential workflows
- Create archive directory
- Document consolidation mapping
- **Effort:** 8-10 hours
- **Deliverable:** PR with archived workflows

### Phase 2: Build Consolidated Workflows (Week 3-5)
- Implement 14 core workflows
- Critical path: labeling, validation, quality, linting, testing
- All 76 original features preserved
- **Effort:** 45-55 hours
- **Deliverable:** PR with consolidated workflows

### Phase 3: Testing & Validation (Week 6-7)
- Parallel execution testing
- 10 test PRs (all types)
- Performance benchmarking
- Team validation & approval
- **Effort:** 10-15 hours
- **Deliverable:** Validation report + production readiness

**Total Effort:** ~65-80 hours (4-5 weeks)

---

## Key Decisions Made

### 1. Branch Name Validation with Exceptions
- Create `.github/branch-exceptions.yml` for exception patterns
- Support for: hotfix/*, release/*, dependabot, renovate
- No breaking changes to existing branch names

### 2. PR Template Label Auto-Extraction
- Create `.github/scripts/extract-pr-labels.js`
- Reads frontmatter from PR templates
- Auto-applies labels from template metadata
- Validates against `.github/labels.yml`

### 3. Scheduled Workflow Staggering
- Eliminate 4+ 3am UTC collisions
- Stagger workflows: 2:00, 2:30, 3:00, 3:30 UTC
- Reduces resource contention

### 4. Unified Check Gate
- Replace 15-20+ separate checks with single gate
- Faster PR merges (4-6 min vs. 8-12 min)
- Clear pass/fail status

---

## How This Coordinates With Active Projects

| Active Project | Coordination | Timeline |
|---|---|---|
| **workflows-consolidation-2026-q3** (Phase 3 ✅) | Use labeling work; don't duplicate | Week 1 analysis |
| **issue-type-workflow-automation** (Phases 1-4 ✅) | Integrate skill into labeling-unified.yml | Week 3 (Phase 2 week 1) |
| **automation-consolidation-agentic** (Phase 1 ✅) | Agent integration post-Phase 2 | Week 8+ (Phase 4) |
| **pr-finalisation-workflow** (Phase 1 📋) | Depends on labeling-unified.yml | Week 4 (Phase 2 week 2) |
| **release-agentic-workflows** (Phase 5A ✅) | Use existing release agent | Week 5 (Phase 2) |

---

## Documents Created

### Master Planning Documents

📄 **WORKFLOW_CONSOLIDATION_MASTER_PLAN.md** (This Directory)
- Comprehensive 750+ line plan
- Current state analysis (76 workflows)
- Consolidated architecture (14 workflows)
- Phase roadmap with effort estimates
- Risk mitigation strategies
- Implementation decisions
- Success criteria

📄 **workflow-consolidation-2026-q4.spec.md** (.github/specs/)
- Formal OpenSpec specification
- Structured requirements
- Configuration files to create
- Acceptance criteria
- Success metrics

### To Be Created (Phase 1-3)

- PHASE_1_BACKUP_STRATEGY.md
- PHASE_2_IMPLEMENTATION_PLAN.md
- PHASE_3_TESTING_PLAN.md
- ARCHIVED_WORKFLOWS_MANIFEST.md
- WORKFLOW_FEATURES_MAPPING.md
- WORKFLOW_CONSOLIDATION_MAPPING.md

---

## Success Metrics

### Quantitative Targets
- ✅ Reduce workflows: 76 → 14 (82% reduction)
- ✅ GitHub Actions minutes: -15-20%
- ✅ Merge time: 8-12 min → 4-6 min
- ✅ Scheduled collisions: 4+ → 0
- ✅ Duplicate code: 500 lines eliminated

### Qualitative Targets
- ✅ Single unified check gate
- ✅ Clear workflow documentation
- ✅ Team confidence in CI/CD
- ✅ No breaking changes

---

## What's Next (Immediate Actions)

### This Week (Sep 11-15)
1. ✅ Review this planning summary
2. ⏳ **Get team approval to proceed** ← YOU ARE HERE
3. ⏳ Create Phase 1 detailed plan
4. ⏳ Identify team member for Phase 1

### Week 2-3 (Sep 16-30)
1. ⏳ Execute Phase 1 (backup & archive)
2. ⏳ Merge Phase 1 PR
3. ⏳ Start Phase 2 implementation
4. ⏳ Focus on critical path: labeling → validation → quality

### Week 4-6 (Oct 1-15)
1. ⏳ Complete Phase 2 (14 consolidated workflows)
2. ⏳ Start Phase 3 (parallel testing)
3. ⏳ Validate all workflows

### Week 7 (Oct 16-22)
1. ⏳ Complete Phase 3 validation
2. ⏳ Production merge

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Edge cases lost in merge | MEDIUM | HIGH | 1-week parallel testing |
| Breaking change | MEDIUM | HIGH | Test on branch first |
| Increased complexity | LOW | MEDIUM | Clear documentation |
| Performance regression | LOW | HIGH | Benchmark before/after |
| Merge conflicts | LOW | LOW | Sequential implementation |

---

## Questions to Address Before Phase 1

1. **Team Capacity:** Who owns Phase 1-3?
2. **Timeline:** Can you commit 4-5 weeks?
3. **Approvals:** Who approves consolidation strategy?
4. **Rollback:** Is 30-minute rollback acceptable?
5. **Testing:** Can we run parallel workflows for 1 week?

---

## Reference Files

**Planning Documents:**
- `.github/projects/active/workflow-consolidation-master-plan-2026-09/WORKFLOW_CONSOLIDATION_MASTER_PLAN.md`
- `.github/specs/workflow-consolidation-2026-q4.spec.md`

**Active Project References:**
- `.github/projects/active/workflows-consolidation-2026-q3/` — Phase 3 findings
- `.github/projects/active/issue-type-workflow-automation/` — Issue type automation
- `.github/projects/active/automation-consolidation-agentic-workflows-2026-09/` — Agentic workflow audit

**Existing Documentation:**
- `docs/AUTOMATION.md` — Current automation strategy
- `docs/LABEL_STRATEGY.md` — Label taxonomy
- `.github/PULL_REQUEST_TEMPLATE/README.md` — PR template guide

---

**Planning Status:** ✅ COMPLETE & READY FOR TEAM REVIEW  
**Owner:** Ashley Shaw (ashley@lightspeedwp.agency)  
**Created:** Sep 11, 2026  
**Next Step:** Approve Phase 1 execution

---

*This consolidation plan reduces 76 workflows to 14 core unified workflows while preserving all critical functionality. The 3-phase approach (backup, build, test) minimizes risk while delivering massive efficiency gains.*
