---
feature: "Workflow Consolidation Phase 2 — Unified Workflow Implementation"
date_created: "2026-09-14"
phase: 2
parent_epic: "Workflow Consolidation Initiative 2026-Q4"
related_issue: "#2902"
status: "planning"
---

# Phase 2: Unified Workflow Implementation

## Overview

Phase 2 consolidates 71 archived workflows into 5 unified consolidated workflows, eliminating duplicate code and reducing GitHub Actions minutes by 15-20% (hard requirement: ≤15% reduction minimum).

## Clarifications

### Session 2026-09-14

- Q: What is "Option A" and the GitHub Actions minute baseline? → A: Phase 1 baseline: ~2,500 minutes/month. Option A is alternative consolidation pattern (not selected). Success criterion: maintain or reduce to ≤2,500 minutes/month.
- Q: What does "full test coverage" mean? → A: Functional coverage (all critical paths execute), integration coverage (routes events correctly), scenario coverage (primary/error/edge cases). No hard line-coverage target.
- Q: What is the rollback strategy and error boundary? → A: Rollback to archived Phase 1 versions (preserved in archived/2026-09-11/). Error boundary: single workflow type fails safely without cascading. Max failure impact: one workflow type fails, others continue.
- Q: Is 15-20% reduction a hard requirement? → A: Hard requirement—must achieve ≤15% reduction (target: 2,125 minutes/month max). If not met, defer Phase 2 and revisit architecture. Acceptance gate: PR cannot merge unless minutes target met.
- Q: What does "passing CI" mean? → A: All GitHub Actions checks green on feature branch. Workflows tested on actual PR/issue events. Production readiness: Phase 2 cannot merge until all 5 unified workflows pass CI for ≥3 consecutive runs on feature branch.

## Deliverables

1. **labeling-unified.yml** — Unified labeling engine (9 archived workflows)
2. **validation-unified.yml** — Unified validation gate (12 archived workflows)
3. **linting-unified.yml** — Unified code quality linting (2 archived workflows)
4. **quality-gates.yml** — Unified security and quality gates (5 utilities)
5. **testing-unified.yml** — Unified test orchestration (8 archived workflows)

## Success Criteria

### Measurable Outcomes

1. **Performance Target (Hard Requirement):** Achieve ≤15% reduction in GitHub Actions minutes (baseline: 2,500/month → target: ≤2,125/month)
2. **All 5 Unified Workflows Passing CI:** GitHub Actions checks green on feature branch for ≥3 consecutive runs
3. **Functional Coverage:** All critical workflow paths (labeling, validation, testing) execute successfully
4. **Integration Coverage:** Each unified workflow correctly routes events to downstream systems
5. **Scenario Coverage:** Primary flows, error cases, and edge cases all addressed in test suite
6. **Rollback Capability:** Documented rollback procedure to Phase 1 archived versions; tested and validated
7. **Error Isolation:** Single workflow type failure does not cascade to other automation
8. **Complete Documentation:** Architecture guide, consolidation mapping, rollback procedure, operational runbook

## Timeline

- Oct 1-5: New workflow development
- Oct 6-10: Integration testing
- Oct 11-15: Cutover preparation
- Oct 16-31: Production deployment and monitoring

## Risk Assessment

- **Critical:** Unified workflows must not introduce new failure modes; error isolation tested and validated
- **Critical:** Performance target (≤15% reduction) is hard merge requirement—Phase 2 deferred if not achievable
- **Critical:** Rollback procedure documented, tested, and callable within 15 minutes
- **High:** Ensure backward compatibility with existing automation; all archived workflows behavior preserved
- **High:** GitHub Actions minutes baseline must be measured before and after consolidation
- **Medium:** Performance optimization under concurrent load; no performance regression allowed
- **Medium:** Composite actions reused; coupling with Phase 1 architecture must be explicit
