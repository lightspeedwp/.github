---
name: GitHub Workflows Consolidation Initiative
title: Consolidate 31 GitHub Workflows → 25 for Efficiency & Maintainability
description: Strategic consolidation of workflows to eliminate duplication, reduce GitHub Actions minutes, and improve maintainability
status: active
created: 2026-07-24
last_updated: 2026-07-24
version: 1.0.0
owners:
  - lightspeedwp/maintainers
tags:
  - workflows
  - ci-cd
  - github-actions
  - consolidation
  - automation
  - efficiency
related_issues:
  - '#1227'
related_branches:
  - audit/workflows-consolidation-audit
---

# GitHub Workflows Consolidation Initiative

## Quick Facts

| Metric | Value |
|--------|-------|
| **Current Workflows** | 31 |
| **Target Workflows** | 25 |
| **Reduction** | 19% (6 workflows) |
| **Code Duplication** | ~500 lines to eliminate |
| **Estimated Actions Minutes Savings** | 15-20% |
| **Total Effort** | 60-85 hours |
| **Timeline** | 12 weeks (5-7h/week) |
| **Start Date** | 2026-07-24 |
| **Epic Issue** | [#1227](https://github.com/lightspeedwp/.github/issues/1227) |

## Project Goals

1. **Eliminate Code Duplication** — Consolidate repetitive workflow logic (~500 lines)
2. **Reduce GitHub Actions Minutes** — 15-20% efficiency improvement through consolidation
3. **Improve Maintainability** — Single source of truth for common patterns
4. **Streamline CI/CD** — Reduce workflow count from 31 to 25
5. **Resolve Scheduling Conflicts** — Fix 4+ scheduled workflow collisions
6. **Enable Team Scaling** — Reusable patterns for future workflows

## Current State Analysis

### Workflow Inventory (31 Total)

#### By Category

**Testing & Validation (8 workflows)**

- testing.yml
- validate-frontmatter.yml
- validate-pr-template.yml
- template-enforcement.yml
- branch-validation.yml
- coderabbit-reviews.yml
- lint-workflows.yml
- lighthouse-ci.yml

**Changelog & Release (4 workflows)**

- changelog-validation.yml
- changelog-consolidation.yml (duplicate logic)
- release-notes-generation.yml
- version-bump.yml

**Documentation & Reporting (5 workflows)**

- docs-validation.yml
- markdown-linting.yml
- readme-generation.yml
- metrics-collection.yml
- reporting.yml

**Labelling & Automation (6 workflows)**

- issue-labeller.yml
- pr-labeller.yml
- auto-assignment.yml
- stale-issue-handler.yml
- dependency-labeller.yml
- release-labeller.yml

**CI/CD Pipeline (8 workflows)**

- build.yml
- deploy-staging.yml
- deploy-production.yml
- merge-validation.yml
- github-env-sync.yml
- mergify-integration.yml
- branch-cleanup.yml
- dependency-updates.yml

### Identified Consolidation Opportunities

#### **Phase 1A: Quick Wins** (~15 hours)

- Remove `testing.yml` (superseded by other test runners)
- Extract common helpers from validation workflows
- Consolidate validation utilities into single file

#### **Phase 1B: Changelog Consolidation** (~12 hours)

- Merge `changelog-validation.yml` + `changelog-consolidation.yml`
- Single workflow for changelog management
- Reduces duplication (~60 lines)

#### **Phase 1B: Metrics Pipeline** (~18 hours)

- Consolidate metrics collection workflows
- Single source for reporting data
- Improves consistency

#### **Phase 2: Documentation Workflows** (~15 hours)

- Merge docs-validation, markdown-linting, readme-generation
- Single documentation workflow with multiple jobs
- Reduces scheduling conflicts

#### **Phase 3: Labelling Consolidation** (~12 hours)

- Consolidate issue + PR labelling logic
- Single workflow with conditional jobs
- Shared label management rules

### Scheduling Conflicts

**Current Issues:**

- Testing workflows run at same time (duplicate GHA runners)
- Changelog + metrics workflows compete for scheduler
- Labelling workflows create 4+ concurrent runs during PR creation

**Target:** Reduce to 2 scheduled conflicts maximum

## Three-Phase Implementation

### **PHASE 1A: Quick Wins** (Week 1-2)

**Effort:** 15 hours | **Complexity:** Low  
**Deliverables:**

- Remove obsolete testing.yml
- Extract validation helpers to shared file
- Document common patterns
- Save ~100 GHA minutes/week

**Issues to Create:**

- Remove testing.yml
- Extract shared validation helpers
- Update dependent workflows

### **PHASE 1B: Changelog & Metrics** (Week 2-3)

**Effort:** 30 hours | **Complexity:** Medium  
**Deliverables:**

- Merged changelog workflow
- Consolidated metrics pipeline
- Shared reporting format
- Save ~75 GHA minutes/week

**Issues to Create:**

- Consolidate changelog workflows
- Consolidate metrics workflows
- Update related CI/CD integrations

### **PHASE 2: Documentation & Validation** (Week 4-6)

**Effort:** 20 hours | **Complexity:** Medium  
**Deliverables:**

- Single documentation workflow (3 conditional jobs)
- Reduced scheduling conflicts
- Shared validation rules
- Save ~40 GHA minutes/week

**Issues to Create:**

- Merge docs/markdown/readme workflows
- Consolidate validation patterns
- Update scheduling

### **PHASE 3: Labelling & Automation** (Week 7-12)

**Effort:** 20 hours | **Complexity:** Medium  
**Deliverables:**

- Single labelling workflow (conditional jobs per event)
- Shared label management rules
- Reduced concurrent runs
- Save ~50 GHA minutes/week

**Issues to Create:**

- Consolidate labelling workflows
- Create shared rules engine
- Testing and validation

## Expected Outcomes

### Efficiency Improvements

- **GitHub Actions Minutes:** 15-20% reduction (est. 200-250 min/month savings)
- **Workflow File Count:** 31 → 25 (19% reduction)
- **Code Duplication:** Eliminate ~500 lines (cleanup)
- **Maintenance Overhead:** Reduce by ~25%

### Operational Benefits

- Single source of truth for common patterns
- Easier onboarding for new workflows
- Faster updates to CI/CD rules
- Better visibility into workflow execution
- Reduced scheduler conflicts

### Developer Experience

- Clearer workflow organization
- More intuitive job names and structure
- Better documentation and examples
- Self-service workflow creation

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Breaking existing workflows | MEDIUM | HIGH | Comprehensive testing before merge, parallel runs |
| Increased complexity from consolidation | MEDIUM | MEDIUM | Clear job structure, documentation |
| Merge conflicts during development | LOW | LOW | Early coordination, serial merging |
| Performance regression | LOW | HIGH | Benchmark before/after runs, CI validation |

## Success Criteria

**Quantitative:**

- ✅ Reduce workflow count from 31 to 25
- ✅ Eliminate ~500 lines of duplicate code
- ✅ 15-20% reduction in GitHub Actions minutes
- ✅ Maintain or improve test coverage
- ✅ Reduce scheduled run collisions from 4+ to 2

**Qualitative:**

- ✅ Single source of truth for common patterns
- ✅ Clear documentation for workflow structure
- ✅ Team confidence in CI/CD system
- ✅ Reduced maintenance burden

## Implementation Timeline

| Phase | Timeline | Status | Hours | Savings |
|-------|----------|--------|-------|---------|
| **Phase 1A: Quick Wins** | Week 1-2 | ✅ Complete | 15 | ~100 min/week |
| **Phase 1B: Changelog & Metrics** | Week 2-3 | ✅ Complete | 30 | ~75 min/week |
| **Phase 2: Documentation** | Week 4-6 | ⏳ Upcoming | 20 | ~40 min/week |
| **Phase 3: Labelling** | Week 7-12 | ⏳ Upcoming | 20 | ~50 min/week |
| **Total** | 12 weeks | | **85 hours** | **~265 min/week** (15-20% savings) |

## Related Issues & Documentation

### GitHub Issues

- **Epic #1227** — GitHub Workflows Consolidation Initiative
- **Phase 1A Issues** — Quick wins (TBD)
- **Phase 1B Issues** — Changelog & metrics (TBD)
- **Phase 2 Issues** — Documentation (TBD)
- **Phase 3 Issues** — Labelling (TBD)

### Related PRs

- **PR #1228** — Workflows consolidation audit and project documentation
- **PR #1280** — Phase 1B.i: Consolidate changelog management workflows
- **PR #1282** — Phase 1B.ii: Consolidate metrics collection and reporting workflows
- **PR #1286** — Phase 1B: Consolidate changelog & metrics workflows (unified PR)

### Documentation

- `.github/reports/workflows/WORKFLOWS-CONSOLIDATION-AUDIT.md` — Detailed audit findings
- `projects/active/workflows-consolidation-2026-q3/IMPLEMENTATION_NOTES.md` — Technical details
- Phase-specific implementation guides (created per phase)

## Next Steps

1. **Kick Off Phase 1A** (This week)
   - Review testing.yml removal impact
   - Identify shared validation patterns
   - Create first consolidation PRs

2. **Create Phase 1A Issues** (Next 2 days)
   - Quick wins checklist
   - Helper extraction tasks
   - Testing plan

3. **Begin Phase 1B Planning** (Week 2)
   - Analyze changelog workflows
   - Map metrics data flow
   - Design consolidated structure

4. **Track Progress** (Ongoing)
   - Monitor GitHub Actions minutes savings
   - Collect team feedback
   - Adjust timeline based on complexity

---

**Project Lead**: Ash Shaw  
**Started**: 2026-07-24  
**Status**: Actively Building  
**Epic**: #1227  
**Related PR**: #1228  
**Next Review**: End of Week 1 (Phase 1A progress)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
