---
file_type: implementation-plan
title: "Phase 2 Implementation Plan — Unified Workflow Consolidation"
phase: 2
phase_duration: "4 weeks (Oct 1-31, 2026)"
total_workflows_to_build: 5
archived_workflows_consolidated: 45
core_workflows_retained: 9
estimated_effort_hours: "40-50"
status: "planned"
date_created: "2026-09-12"
---

# Phase 2 Implementation Plan — Unified Workflow Consolidation

**Initiative:** Workflow Consolidation Initiative 2026-Q4  
**Phase:** Phase 2 of 3  
**Duration:** 4 weeks (Oct 1-31, 2026)  
**Effort:** 40-50 hours total  
**Status:** Planned (Ready for development)  
**Branch:** `feature/unified-workflows-phase-2` (to be created Oct 1)

---

## Phase 2 Goal

**Transform 62 archived workflows into 5 new unified consolidated workflows** that serve as the backbone of LightSpeed `.github` automation, while retaining 9 existing enhanced workflows.

**Success Metric:** 82% reduction in workflow maintenance burden (76 workflows → 14), with improved:
- PR merge time: 8-12 min → 4-6 min
- GitHub Actions minutes: 15-20% savings
- Check gates per PR: 15-20+ → 1 unified gate
- Code duplication: ~500 lines eliminated

---

## Five Unified Workflows to Build

| # | Workflow | Consolidates | Effort | Priority | Target Date |
|---|----------|-------------|--------|----------|-------------|
| 1 | **labeling-unified.yml** | 9 labeling workflows | 8h | P0 | Oct 5 |
| 2 | **validation-unified.yml** | 12 validation workflows | 12h | P0 | Oct 10 |
| 3 | **linting-unified.yml** | 2 linting workflows | 6h | P1 | Oct 12 |
| 4 | **quality-gates.yml** | 5 security/spec workflows | 10h | P0 | Oct 15 |
| 5 | **testing-unified.yml** | 8 testing workflows | 14h | P0 | Oct 20 |

**Consolidated Total:** 45 archived workflows → 5 unified workflows

---

## Consolidation Strategy by Workflow

### 1. labeling-unified.yml (9 workflows → 1)

**Purpose:** Unified labeling engine for all label operations

**Consolidates From:**
- `labeling.yml` — Auto-label from PR template frontmatter (primary engine)
- `labeling-governance.yml` — Label validation and prefix compliance
- `issue-labeling-automation.yml` — Issue type allocation
- `meta-labels-sync.yml` — Label schema synchronization
- `batch-label-prs.yml` — Batch labeling operations
- `remediate-bare-labels.yml` — Fix bare labels without prefixes
- `validate-issue-labels.yml` — Prefix compliance validation
- `label-audit-report.yml` — Label compliance reporting
- `openspec-sync-labels.yml` — OpenSpec label definitions sync

**Key Features to Consolidate:**
- Auto-label on PR open/edit (frontmatter parsing)
- Label governance enforcement (prefix validation)
- Issue type detection and labeling
- Batch relabeling capability
- Label schema synchronization
- Compliance reporting and audit

**Architecture Decisions:**
- Single entry point with event-triggered jobs for different label operations
- Shared label validation logic (reusable composite action)
- Configurable label rules from `.github/labels.yml`
- Output: unified label compliance metrics

**Effort Breakdown:**
- Analyze 9 workflows and extract logic: 1.5h
- Design unified workflow architecture: 1.5h
- Build core labeling engine: 2h
- Integrate governance checks: 1.5h
- Test and validate: 1.5h

---

### 2. validation-unified.yml (12 workflows → 1)

**Purpose:** Unified validation gate for branch names, PR templates, documentation, and compliance

**Consolidates From:**
- `branch-name-validation.yml` — Branch naming conventions (critical gate)
- `pr-template-validation.yml` — PR template usage validation
- `changelog-safety-audit.yml` — Changelog completeness
- `validate-dor-dod-sections.yml` — Definition of Ready/Done
- `docs-validation.yml` — Documentation completeness
- `workflow-validation.yml` — GitHub Actions workflow syntax
- `validate-blocking-issue-before-close.yml` — Blocking issue enforcement
- `validate-blocking-status-before-close.yml` — Blocking status enforcement
- `validate-project-linking.yml` — Issue/PR project linking
- `checks.yml` (validation portions) — Multi-check orchestration
- Plus 2 partial workflows from testing/utilities

**Key Features to Consolidate:**
- Branch naming validation (strict enforcement)
- PR template section detection (Linked issues, Changelog, Checklist)
- Changelog entry validation (Keep a Changelog format)
- DoR/DoD section validation
- Documentation completeness checks
- Workflow YAML syntax validation
- Blocking issue/status enforcement
- Project linking validation

**Architecture Decisions:**
- Modular validation jobs (one per domain: branch, PR, docs, workflow, issues)
- Shared validation helper utilities (regex patterns, check functions)
- Centralized validation report aggregation
- Single composite check result for CI/CD integration
- Output: detailed validation report with pass/fail per category

**Effort Breakdown:**
- Analyze 12 workflows and extract validation logic: 2h
- Design modular validation architecture: 2h
- Build branch/PR/docs validators: 3h
- Build issue/project/workflow validators: 3h
- Integrate validation report aggregation: 1.5h
- Test coverage and edge cases: 0.5h

---

### 3. linting-unified.yml (2 workflows → 1)

**Purpose:** Unified code quality linting (markdown, JavaScript, Python, etc.)

**Consolidates From:**
- `linting.yml` — Core code quality linting
- `markdown-audit-ci-optimization.yml` — Markdown validation with performance optimization

**Key Features to Consolidate:**
- Markdown linting (markdownlint)
- JavaScript/TypeScript linting (ESLint)
- YAML linting (yamllint)
- Performance-optimized lint runs
- Partial file linting (only changed files)
- Lint report aggregation

**Architecture Decisions:**
- Language-specific lint jobs (run in parallel)
- Cache linter dependencies for performance
- Run linters only on changed files (faster feedback)
- Consolidated lint report with all findings
- Output: unified lint report suitable for automated fixing

**Effort Breakdown:**
- Analyze 2 workflows and extract linting logic: 1h
- Design parallel linting architecture: 1h
- Build language-specific lint jobs: 2.5h
- Optimize for changed-file detection: 1h
- Test and validate: 0.5h

---

### 4. quality-gates.yml (5 workflows → 1)

**Purpose:** Unified security and quality gates (secret scanning, spec validation, compliance)

**Consolidates From:**
- `gitleaks.yml` — Secret scanning (primary engine)
- `gitleaks-update.yml` — Secret scanning signature updates
- `gitleaks-reusable.yml` — Reusable secret scanning component
- `agent-spec-validation.yml` — Agent specification validation
- `openspec-validation.yml` — OpenSpec compliance validation

**Key Features to Consolidate:**
- GitLeaks secret scanning (on-demand + scheduled)
- Secret scanning signature updates
- Reusable secret scanning component for other workflows
- Agent specification validation
- OpenSpec schema compliance validation
- Quality metrics aggregation

**Architecture Decisions:**
- Security gates always blocking (no continue-on-error)
- Separate workflows for secret scanning vs. spec validation
- Reusable composite actions for scanning components
- Secret scan cache management (performance)
- Output: detailed security/compliance report

**Effort Breakdown:**
- Analyze 5 workflows and extract logic: 1.5h
- Design security gate architecture: 1.5h
- Build secret scanning engine: 2h
- Integrate spec validation: 2h
- Cache management and performance: 1.5h
- Test security scenarios: 1.5h

---

### 5. testing-unified.yml (8 workflows → 1)

**Purpose:** Unified test orchestration for all test types (unit, integration, e2e, coverage)

**Consolidates From:**
- `testing.yml` — Main test orchestration (primary engine)
- `release-e2e-tests.yml` — End-to-end release tests
- `checks.yml` (test portions) — Test check orchestration
- `test-runner.yml` — Test runner orchestration
- `integration-tests.yml` — Integration test suite
- `unit-tests.yml` — Unit test suite
- `e2e-tests.yml` — End-to-end test suite
- `test-coverage.yml` — Coverage reporting

**Key Features to Consolidate:**
- Test execution orchestration (unit → integration → e2e)
- Parallel test job execution
- Test coverage reporting and thresholds
- Release-specific e2e tests
- Test result aggregation
- Coverage badge generation

**Architecture Decisions:**
- Sequential test phases: unit → integration → e2e
- Parallel test jobs within each phase
- Coverage thresholds enforced (fail if below threshold)
- Test result reports saved as artifacts
- Coverage badge auto-updated
- Output: unified test report + coverage metrics

**Effort Breakdown:**
- Analyze 8 workflows and extract test logic: 2h
- Design test orchestration architecture: 2h
- Build test execution phases: 3h
- Integrate coverage reporting: 2h
- Build test result aggregation: 2h
- Performance optimization: 1.5h
- Test the test infrastructure: 1.5h

---

## Nine Retained & Enhanced Workflows

These workflows are retained in Phase 2 but may be enhanced to integrate with unified workflows:

| Workflow | Purpose | Integration Notes |
|----------|---------|-------------------|
| `events-issue-pr-metadata.yml` | Event metadata handling | Enhanced to dispatch to unified workflows |
| `documentation.yml` | Documentation generation | Retain as-is; triggered by unified workflows |
| `issue-management.yml` | Issue automation and lifecycle | Enhanced to use unified validation |
| `pr-workflow.yml` | PR automation and routing | Enhanced to use unified validation/labeling |
| `branch-management.yml` | Branch lifecycle and protection | Retain as-is; independent operations |
| `changelog-management.yml` | Changelog automation | Enhanced to use unified validation |
| `release-orchestration.yml` | Release coordination | Enhanced to use unified testing/quality-gates |
| `reporting-metrics.yml` | Metrics and monitoring | Enhanced to aggregate unified workflow metrics |
| `project-management.yml` | Project coordination | Retain as-is; independent operations |

---

## Phase 2 Execution Plan

### Week 1 (Oct 1-5): Setup & labeling-unified.yml

**Tasks:**
- [ ] Create feature branch `feature/unified-workflows-phase-2` from develop
- [ ] Create `.github/workflows/labeling-unified.yml` skeleton
- [ ] Extract and consolidate 9 labeling workflows
- [ ] Write unit tests for label validation logic
- [ ] Create PR with labeling-unified.yml + validation

**Definition of Done:**
- labeling-unified.yml complete and functional
- All 9 labeling features working in unified workflow
- No regressions in existing label operations
- Tests passing: label validation, auto-labeling, governance checks

---

### Week 2 (Oct 6-10): validation-unified.yml

**Tasks:**
- [ ] Create `.github/workflows/validation-unified.yml` skeleton
- [ ] Extract and consolidate 12 validation workflows
- [ ] Build validation helper utilities (shared regex, check functions)
- [ ] Integrate all validation checks into unified workflow
- [ ] Write comprehensive tests for validation gates

**Definition of Done:**
- validation-unified.yml complete and functional
- All 12 validation features working
- No regressions in branch/PR/docs validation
- Tests passing: branch names, PR templates, changelog, docs, etc.

---

### Week 2-3 (Oct 11-15): linting-unified.yml & quality-gates.yml

**Tasks:**
- [ ] Create `.github/workflows/linting-unified.yml` + quality-gates.yml
- [ ] Extract and consolidate 2 linting workflows
- [ ] Extract and consolidate 5 security/spec workflows
- [ ] Optimize linting performance (parallel jobs, caching)
- [ ] Build reusable composite actions for secret scanning

**Definition of Done:**
- linting-unified.yml complete and functional
- quality-gates.yml complete and functional
- All linting + security features working
- No performance regressions

---

### Week 3-4 (Oct 16-31): testing-unified.yml & Integration

**Tasks:**
- [ ] Create `.github/workflows/testing-unified.yml` skeleton
- [ ] Extract and consolidate 8 testing workflows
- [ ] Build test orchestration logic (sequential phases)
- [ ] Integrate coverage reporting and badge generation
- [ ] Enhance retained workflows to use unified workflows

**Definition of Done:**
- testing-unified.yml complete and functional
- All 8 testing features working
- Test orchestration verified (unit → integration → e2e)
- Coverage reporting functional
- All 9 retained workflows integrated

---

## Integration & Testing Strategy

### Pre-Deployment Testing (Parallel Validation)

For each unified workflow:
1. **Unit Tests** — Validate individual components (regex patterns, validation functions, parsing logic)
2. **Integration Tests** — Validate workflow event handling and job orchestration
3. **Regression Tests** — Ensure all features from original 62 workflows work identically
4. **Performance Tests** — Benchmark against original workflows (target: 15-20% savings)
5. **E2E Tests** — Run actual GitHub Actions workflow execution on branch with test events

### Cutover Preparation (Oct 26-31)

- [ ] Mirror testing: Run unified workflows parallel with archived workflows
- [ ] Compare outputs: Ensure identical labeling, validation, test results
- [ ] Performance analysis: Document GitHub Actions minutes savings
- [ ] Rollback procedures: Prepare to revert to archived workflows if needed
- [ ] Team training: Document new unified workflow interfaces

### Production Deployment (Nov 1+)

- [ ] Disable archived workflows in active directory
- [ ] Enable unified workflows as primary automation
- [ ] Monitor CI/CD metrics for 1 week (merge time, failure rates, cost)
- [ ] Gather team feedback
- [ ] Plan Phase 3 optimizations

---

## Architecture Principles

### 1. Modularity

Each unified workflow should be decomposable into independent jobs:
- Jobs can fail independently without blocking other jobs
- Jobs can be reused by calling workflows
- Shared logic extracted into composite actions

### 2. Reusability

All 5 unified workflows should follow common patterns:
- Shared validation helper actions
- Standard input/output contracts
- Consistent error handling and reporting
- Composable job templates

### 3. Performance

Target 15-20% GitHub Actions minutes savings:
- Parallel job execution where possible
- Caching of dependencies and intermediate results
- Skip expensive operations on unchanged files
- Optimize matrix jobs for efficiency

### 4. Observability

Each unified workflow must produce:
- Structured logs for troubleshooting
- Metrics for cost/performance monitoring
- Reports aggregating results across categories
- Integration with metrics reporting workflow

### 5. Governance

Maintain compliance with existing governance:
- Label prefix enforcement (all labels must be from canonical set)
- Issue/PR validation rules (DoR/DoD)
- Changelog requirements
- Branch naming conventions
- Project linking requirements

---

## Risk Mitigation

### Risk 1: Feature Loss During Consolidation

**Mitigation:**
- Maintain comprehensive feature mapping (62 → 5 workflows)
- Regression tests for each original feature
- Mirror testing (new + old workflows in parallel)
- Rollback procedure documented

### Risk 2: Performance Regression

**Mitigation:**
- Benchmark original workflows (baseline)
- Optimize parallel execution
- Cache management strategy
- Performance targets: 15-20% minutes savings

### Risk 3: Integration Issues

**Mitigation:**
- Test unified workflows with all event types
- Validate dispatch to retained workflows
- Test error paths and edge cases
- Load testing with concurrent events

### Risk 4: Team Adoption

**Mitigation:**
- Comprehensive documentation
- Team training session
- Gradual rollout (Phase 2a: single workflow, Phase 2b: remaining)
- Support period for troubleshooting

---

## Success Criteria

### Functionality
- ✅ All 62 archived features replicated in 5 unified workflows
- ✅ No regressions in existing automation
- ✅ All 9 retained workflows integrate seamlessly
- ✅ Zero feature loss

### Performance
- ✅ GitHub Actions minutes: 15-20% reduction
- ✅ PR merge time: 8-12 min → 4-6 min
- ✅ Check gates: 15-20+ → 1 unified gate per category
- ✅ Duplicate code: ~500 lines eliminated

### Quality
- ✅ All unit tests passing (100% coverage of new logic)
- ✅ Integration tests passing
- ✅ Regression tests passing
- ✅ Mirror testing showing identical outputs

### Operations
- ✅ CI green on release PR
- ✅ No regressions in day-1 production
- ✅ Team trained and comfortable with new workflows
- ✅ Documentation complete and accurate

---

## Deliverables

### Workflows (5 files)
- `.github/workflows/labeling-unified.yml` (250-300 lines)
- `.github/workflows/validation-unified.yml` (400-500 lines)
- `.github/workflows/linting-unified.yml` (150-200 lines)
- `.github/workflows/quality-gates.yml` (250-350 lines)
- `.github/workflows/testing-unified.yml` (350-450 lines)

### Documentation
- `.github/docs/PHASE_2_IMPLEMENTATION_SUMMARY.md` — Phase 2 results
- `.github/workflows/UNIFIED_WORKFLOWS_REFERENCE.md` — New workflow interfaces
- `.github/workflows/MIGRATION_GUIDE.md` — Team migration guide

### Tests
- Test suites for each unified workflow (unit + integration)
- Performance benchmarking report
- Regression test results

### Configuration
- Updated `.github/workflows/archived/2026-09-11/README.md` (Phase 2 notes)
- Updated `.github/docs/AUTOMATION.md` (Phase 2 completion notes)

---

## Timeline

| Date | Milestone | Owner | Status |
|------|-----------|-------|--------|
| Oct 1 | Feature branch created; Phase 2 kickoff | Team | Planned |
| Oct 5 | labeling-unified.yml released | Team | Planned |
| Oct 10 | validation-unified.yml released | Team | Planned |
| Oct 15 | linting-unified.yml + quality-gates.yml released | Team | Planned |
| Oct 20 | testing-unified.yml released | Team | Planned |
| Oct 26-31 | Mirror testing + cutover prep | Team | Planned |
| Nov 1+ | Production deployment + monitoring | Team | Planned |

---

## Phase 3 Planning

**Phase 3: Monitoring & Optimization (Nov 2026+)**

- Monitor GitHub Actions minutes usage and cost savings (target: 15-20%)
- Optimize consolidated workflow performance
- Gather team feedback on new unified workflows
- Plan Phase 3 incremental improvements:
  - Deeper consolidation of retained workflows
  - Performance optimizations based on real-world metrics
  - Integration with additional automation systems

---

## Related Documentation

- [WORKFLOW_CONSOLIDATION_MAPPING.md](../../docs/WORKFLOW_CONSOLIDATION_MAPPING.md) — Complete 76-workflow mapping
- [AUTOMATION.md](../../docs/AUTOMATION.md) — Architecture documentation
- [Archive README](../2026-09-11/README.md) — Archive structure and restoration guide
- [Phase 1 Master Plan](./WORKFLOW_CONSOLIDATION_MASTER_PLAN.md) — Strategic overview

---

**Document Status:** Phase 2 Planning Complete ✅  
**Created:** 2026-09-12  
**Last Updated:** 2026-09-12  
**Next Review:** Oct 1, 2026 (Phase 2 kickoff)
