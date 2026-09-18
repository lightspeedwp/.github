---
file_type: master-plan
title: "GitHub Workflows Consolidation Master Plan — Simplified Execution Roadmap"
description: "Strategic consolidation of 76+ GitHub workflows into 14 core workflows with parallel project work reduction"
created: "2026-09-11"
last_updated: "2026-09-11"
status: planning
version: "1.0.0"
owners:
  - ashley@lightspeedwp.agency
tags:
  - workflows
  - consolidation
  - automation
  - ci-cd
  - master-plan
related_projects:
  - workflows-consolidation-2026-q3
  - issue-type-workflow-automation
  - automation-consolidation-agentic-workflows-2026-09
  - pr-finalisation-workflow
  - release-agentic-workflows-2026-08-11
---

# GitHub Workflows Consolidation Master Plan — Simplified Execution Roadmap

## Executive Summary

You currently have **76+ GitHub workflows** running in parallel across the `.github` repository. This creates:
- ❌ Workflow conflicts and race conditions
- ❌ Impossible PR merge cycles (too many checks blocking merges)
- ❌ Duplicate functionality (~15-20 workflows with overlapping logic)
- ❌ ~4+ scheduled workflow collisions
- ❌ 5+ different implementations of similar features

**Outcome:** Consolidate to **14 core workflows** (82% reduction from 76) while maintaining all critical functionality.

---

## The Problem: Current State Analysis

### Workflow Inventory: 76 Active Workflows

**By Category:**

| Category | Count | Status | Priority |
|----------|-------|--------|----------|
| **Labeling & Metadata** | 9 | 🔴 Over-built | HIGH |
| **Validation & Linting** | 12 | 🔴 Duplicate logic | HIGH |
| **Documentation & Reporting** | 8 | 🟡 Some consolidation done | MEDIUM |
| **Issue Management** | 10 | 🔴 Scattered automation | HIGH |
| **PR Management** | 7 | 🟡 Partial standardization | MEDIUM |
| **Testing & Quality** | 8 | 🔴 Multiple test runners | HIGH |
| **Release & Deployment** | 6 | 🟢 Unified via Phase 5A | LOW |
| **CI/CD Pipeline** | 8 | 🔴 Needs refactoring | MEDIUM |
| **Project Management** | 8 | 🟡 Agentic migration in progress | MEDIUM |

**Key Findings:**

1. **9 labeling workflows** doing overlapping work:
   - `labeling.yml`, `labeling-governance.yml`
   - `issue-labeling-automation.yml`, `meta-labels-sync.yml`
   - `batch-label-prs.yml`, `remediate-bare-labels.yml`
   - `validate-issue-labels.yml`, `label-audit-report.yml`
   - `openspec-sync-labels.yml`

2. **12 validation/linting workflows** with duplicate validation:
   - `docs-validation.yml`, `linting.yml`, `markdown-audit-ci-optimization.yml`
   - `workflow-validation.yml`, `pr-template-validation.yml`
   - `validate-*` (5+ validation workflows)
   - `checks.yml` (catch-all)

3. **No unified check gate**: PRs blocked by 15-20+ checks, making merges painful

4. **Scheduled collisions**: 4+ workflows fire at same time (3am UTC)

---

## Target State: 14 Core Workflows

### Consolidated Workflow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│          14 Core Workflows (Unified CI/CD Gate)            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1️⃣  events-issue-pr-metadata.yml                         │
│      ↳ Issue/PR creation, labeling, metadata              │
│                                                             │
│  2️⃣  validation-unified.yml                               │
│      ↳ Branch name, PR template, changelog, frontmatter   │
│                                                             │
│  3️⃣  linting-unified.yml                                  │
│      ↳ Markdown, JavaScript, JSON, YAML, Mermaid          │
│                                                             │
│  4️⃣  testing-unified.yml                                  │
│      ↳ Unit tests, integration tests, coverage            │
│                                                             │
│  5️⃣  quality-gates.yml                                    │
│      ↳ CodeQL, CodeRabbit, GitLeaks, accessibility        │
│                                                             │
│  6️⃣  documentation.yml                                    │
│      ↳ README generation/validation, link checking        │
│                                                             │
│  7️⃣  changelog-management.yml                             │
│      ↳ Changelog validation, automation, versioning       │
│                                                             │
│  8️⃣  labeling-unified.yml                                 │
│      ↳ Auto-label from PR template, validate labels       │
│                                                             │
│  9️⃣  pr-workflow.yml                                      │
│      ↳ Enforce issue linking, status tracking             │
│                                                             │
│  🔟  branch-management.yml                                 │
│      ↳ Branch validation (with exceptions), cleanup        │
│                                                             │
│  1️⃣1️⃣  issue-management.yml                                │
│      ↳ Issue automation, triage, lifecycle                 │
│                                                             │
│  1️⃣2️⃣  release-orchestration.yml                           │
│      ↳ Release agent + safety gates (agentic)             │
│                                                             │
│  1️⃣3️⃣  reporting-metrics.yml                               │
│      ↳ Metrics, reports, dashboards                       │
│                                                             │
│  1️⃣4️⃣  project-management.yml                              │
│      ↳ Project field sync, milestone allocation           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### What Each Workflow Handles

| Workflow | Purpose | Consolidated From | Triggers |
|----------|---------|-------------------|----------|
| **events-issue-pr-metadata.yml** | Issue/PR creation, metadata population | `issues.yml`, `metadata-governance.yml`, `milestone-distribution.yml` | `issues`, `pull_request` |
| **validation-unified.yml** | Branch name, PR template, changelog, frontmatter | `branch-name-validation.yml`, `pr-template-validation.yml`, `changelog-safety-audit.yml`, `validate-dor-dod-sections.yml` | `pull_request`, `workflow_dispatch` |
| **linting-unified.yml** | Markdown, JavaScript, JSON, YAML, Mermaid validation | `linting.yml`, `docs-validation.yml`, `markdown-audit-ci-optimization.yml`, `workflow-validation.yml` | `pull_request` |
| **testing-unified.yml** | Unit, integration tests, coverage | `testing.yml`, `release-e2e-tests.yml`, `checks.yml` (test portions) | `pull_request`, `push:develop` |
| **quality-gates.yml** | CodeQL, CodeRabbit, GitLeaks, accessibility scanning | `gitleaks.yml`, separate security scanning | `pull_request`, scheduled |
| **documentation.yml** | README generation, auto-update, link validation | `docs-validation.yml`, `badges-readme-status.yml`, `badges-documentation-update.yml` | `pull_request`, `push:develop` |
| **changelog-management.yml** | Changelog validation, Keep a Changelog enforcement | `changelog-management.yml`, `changelog-safety-audit.yml` | `pull_request` |
| **labeling-unified.yml** | Auto-label from PR template frontmatter, validate labels | `labeling.yml`, `labeling-governance.yml`, `issue-labeling-automation.yml`, `batch-label-prs.yml`, `remediate-bare-labels.yml` | `pull_request`, `issues` |
| **pr-workflow.yml** | Issue linking enforcement, status tracking, mergify integration | `enforce-pr-issue-linking.yml`, `allocate-pr-issue-to-milestone.yml`, `pr-validation.yml` | `pull_request`, `pull_request_target` |
| **branch-management.yml** | Branch validation (with exceptions), cleanup | `branch-name-validation.yml`, `cleanup-branches.yml` | `push`, scheduled |
| **issue-management.yml** | Issue automation, triage, lifecycle, compliance | `issue-management-orchestration.yml`, `issue-create-enhanced.yml`, `issue-audit-remediation.yml` | `issues`, scheduled |
| **release-orchestration.yml** | Release agent, safety gates, version bumping (agentic) | `release.yml` + agentic Layer | `workflow_dispatch` |
| **reporting-metrics.yml** | Metrics, reports, activity tracking | `metrics-reporting.yml`, `metrics-collection.yml`, `metrics.yml`, `project-maintenance-nightly.yml` | scheduled, `pull_request` |
| **project-management.yml** | Project field sync, milestone allocation | `project-meta-sync.yml`, `project-field-sync.yml`, `project-maintenance-on-demand.yml` | `issues`, `pull_request`, `pull_request_target` |

---

## Required Workflows (Your Explicit Needs)

You specified these must work:

| Feature | Workflow | Status |
|---------|----------|--------|
| ✅ Issue type as `type:` label | **labeling-unified.yml** | Merge existing work |
| ✅ PR template-based labeling | **labeling-unified.yml** (from frontmatter) | Implement extraction |
| ✅ PR template validation | **validation-unified.yml** | Already done (#1313) |
| ✅ Markdown linting | **linting-unified.yml** | Phase 4 complete |
| ✅ JavaScript linting | **linting-unified.yml** | Existing |
| ✅ Test verification | **testing-unified.yml** | Consolidate test runners |
| ✅ Changelog automation | **changelog-management.yml** | Phase 1B complete |
| ✅ Changelog validation | **changelog-management.yml** | Enhance |
| ✅ CodeRabbit reviews | **quality-gates.yml** | External (workflow action) |
| ✅ Enforce PR-issue linking | **pr-workflow.yml** | Implement |
| ✅ README auto-generation | **documentation.yml** | Phase 2 partial |
| ✅ README validation | **documentation.yml** | Enhance |
| ✅ CodeQL scanning | **quality-gates.yml** | Existing |
| ✅ Branch name validation | **validation-unified.yml** | With exceptions support |
| ✅ Mermaid validation & accessibility | **linting-unified.yml** | Add mermaid-cli check |
| ✅ GitLeaks secret scanning | **quality-gates.yml** | Existing |
| ✅ Mergify support | **pr-workflow.yml** | Configuration management |

---

## Phase Roadmap: 3-Phase Implementation

### Phase 1: Backup & Cleanup (Week 1-2)

**Objective:** Archive non-essential workflows, establish backup strategy

**Tasks:**

1. **Identify Keep vs. Archive**
   - Keep: 14 core workflows listed above
   - Archive: 62 workflows → `.github/workflows/archived/` directory
   - Create manifest: `ARCHIVED_WORKFLOWS.md` with decision rationale

2. **Create Backup Archive**
   - Backup: `.github/reports/workflow-backups/2026-09-11/` with all 62 workflows
   - Commit message: "Backup non-essential workflows before consolidation"

3. **Document Consolidation Mapping**
   - Create: `.github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md`
   - Map old workflow → new consolidated workflow
   - Link to archive for historical reference

4. **Deliverable:** PR with archived workflows + mapping documentation

### Phase 2: Build Consolidated Workflows (Week 3-5)

**Objective:** Implement 14 core workflows with full feature coverage

**Workflow Implementation Order:**

1. **Labeling System** (CRITICAL — blocks other workflows)
   - Start: `labeling-unified.yml`
   - Extract frontmatter labels from PR templates
   - Consolidate 9 labeling workflows
   - Test on 5 sample PRs
   - Estimated effort: 6-8 hours

2. **Validation Gate** (CRITICAL — PR blocker)
   - Build: `validation-unified.yml`
   - Branch name validation (with exception rules)
   - PR template validation
   - Changelog validation
   - Estimated effort: 4-6 hours

3. **Quality Gates** (HIGH — security/quality)
   - Build: `quality-gates.yml`
   - CodeQL integration
   - GitLeaks configuration
   - CodeRabbit integration
   - Estimated effort: 3-4 hours

4. **Linting** (HIGH — code quality)
   - Build: `linting-unified.yml`
   - Markdown linting
   - JavaScript/TypeScript linting
   - JSON/YAML linting
   - Mermaid diagram validation
   - Estimated effort: 4-5 hours

5. **Testing** (MEDIUM — already working)
   - Build: `testing-unified.yml`
   - Consolidate test runners
   - Coverage validation
   - Estimated effort: 3-4 hours

6. **Issue/PR Metadata** (MEDIUM — background automation)
   - Build: `events-issue-pr-metadata.yml`
   - Consolidate issue/PR creation automation
   - Estimated effort: 4-5 hours

7. **Documentation** (MEDIUM — lower priority)
   - Build: `documentation.yml`
   - README generation/validation
   - Link checking
   - Estimated effort: 3-4 hours

8. **Remaining Workflows** (6 workflows):
   - `changelog-management.yml`
   - `pr-workflow.yml`
   - `branch-management.yml`
   - `issue-management.yml`
   - `release-orchestration.yml`
   - `reporting-metrics.yml`
   - `project-management.yml`
   - Estimated effort: 8-10 hours

**Phase 2 Deliverables:**
- ✅ 14 consolidated workflow files
- ✅ All features from 76 workflows covered
- ✅ CI passing on new workflows
- ✅ PR with consolidated workflows (ready to merge)

**Phase 2 Effort:** ~45-55 hours

### Phase 3: Testing & Validation (Week 6-7)

**Objective:** Validate consolidated workflows on real workflow runs

**Testing Strategy:**

1. **Parallel Execution** (1 week)
   - Run new consolidated workflows in parallel with old ones
   - Same GitHub Actions environment
   - Compare outputs (should be identical)

2. **Validation Checklist** (Per workflow)
   - [ ] Workflow executes without errors
   - [ ] All output matches old workflow behavior
   - [ ] Execution time ≤ 110% of original
   - [ ] No unexpected side effects
   - [ ] Scheduled jobs still trigger correctly

3. **Real-World Testing**
   - Create 10 test PRs covering all types (feat, fix, docs, etc.)
   - Verify labels applied correctly
   - Verify changelog validation works
   - Verify branch name validation works
   - Verify linting catches errors
   - Verify tests run and report correctly

4. **Performance Metrics**
   - Measure GitHub Actions minutes before/after
   - Measure workflow execution times
   - Compare resource usage
   - Document efficiency gains

5. **Team Validation**
   - Internal team review + approval
   - Identify any edge cases
   - Document exceptions/workarounds

**Phase 3 Deliverables:**
- ✅ Validation report with all checks passed
- ✅ Performance benchmarks
- ✅ Test results from 10 test PRs
- ✅ Ready for production merge

**Phase 3 Effort:** ~10-15 hours

**Total Effort:** ~65-80 hours (distributed over 3-4 weeks)

---

## Active Projects: Coordination Strategy

You have 5 active projects affecting workflow consolidation:

### 1. ✅ Workflows Consolidation 2026-Q3 (Phase 3 Complete)
- **Status:** Phase 3 (Labeling) merged, Phase 4 ready
- **Coordination:** Merged labeling-governance.yml, supports core workflow
- **Action:** Use Phase 3 findings; don't duplicate work

### 2. 🚀 Issue Type Workflow Automation (Phases 1-4 Complete, 5-8 Ready)
- **Status:** Phases 1-4 merged (issue-type-allocator skill)
- **Coordination:** Templates + labels standardization supports labeling-unified.yml
- **Action:** Integrate issue type allocator skill into labeling workflow

### 3. 🏗️ Automation Consolidation Agentic Workflows 2026-09 (Phase 1 Complete, Phase 2 Ready)
- **Status:** Phase 1 audit complete, Phase 2 implementation planned
- **Coordination:** Agentic issue/PR agents coordinate with workflow consolidation
- **Action:** Delay agent implementation until consolidation Phase 2 done; reuse agents in workflows

### 4. 📋 PR Finalisation Workflow (Phase 1 Planning)
- **Status:** Phase 1 planning underway
- **Coordination:** Integrates label audit + changelog validation into PR finalization
- **Action:** Hold until labeling-unified.yml ready (Phase 2 week 1)

### 5. ✅ Release Agentic Workflows 2026-08-11 (Phase 5A Complete)
- **Status:** Phase 5A complete + merged
- **Coordination:** Release agent is production-ready; use in release-orchestration.yml
- **Action:** No changes needed; leverage existing release agent

### Coordination Summary

| Project | Integration Point | Timing |
|---------|-------------------|--------|
| Workflows Consolidation Q3 | Use Phase 3 work on labeling | Week 1 (analysis) |
| Issue Type Workflow | Skill integration in labeling-unified.yml | Week 3 (Phase 2 week 1) |
| Automation Consolidation | Agent integration post-Phase 2 | Week 8+ (Phase 4) |
| PR Finalisation | Depends on labeling-unified.yml | Week 4 (Phase 2 week 2) |
| Release Agentic | Use in release-orchestration.yml | Week 5 (Phase 2 implementation) |

---

## Archived Workflows: What Gets Backed Up

**62 workflows to archive into `.github/workflows/archived/2026-09-11/`**

### Labeling (9 total → 1 consolidated)
- `labeling.yml`
- `labeling-governance.yml`
- `issue-labeling-automation.yml`
- `meta-labels-sync.yml`
- `batch-label-prs.yml`
- `remediate-bare-labels.yml`
- `validate-issue-labels.yml`
- `label-audit-report.yml`
- `openspec-sync-labels.yml`

### Validation (12 total → 1 consolidated)
- `branch-name-validation.yml`
- `pr-template-validation.yml`
- `changelog-safety-audit.yml`
- `validate-dor-dod-sections.yml`
- `docs-validation.yml`
- `linting.yml`
- `markdown-audit-ci-optimization.yml`
- `workflow-validation.yml`
- `validate-blocking-issue-before-close.yml`
- `validate-blocking-status-before-close.yml`
- `validate-project-linking.yml`
- `checks.yml` (merged into multiple)

### Documentation (8 total → 1 consolidated)
- `docs-validation.yml`
- `docs-maintenance.yml`
- `badges-readme-status.yml`
- `badges-documentation-update.yml`
- `badges-verification.yml`
- `badges-health-check.yml`
- `badges-workflow-audit.yml`
- `awesome-github-site.yml`

### Issue Management (10 total → 2 consolidated)
- `issue-management-orchestration.yml`
- `issue-create-enhanced.yml`
- `issue-audit-remediation.yml`
- `issue-compliance.yml`
- `issue-remediation-automation.yml`
- `issues.yml`
- `issues-automation.yml`
- `normalize-titles.yml`
- `meta-agent-validation.yml`
- `metadata-governance.yml` (merged into events workflow)

### PR Management (7 total → 2 consolidated)
- `enforce-pr-issue-linking.yml`
- `allocate-pr-issue-to-milestone.yml`
- `pr-template-validation.yml` (merged into validation)
- `pr-validation.yml`
- `pr-template-resolver.yml`
- `planner.yml`
- `reviewer.yml`

### Testing (8 total → 1 consolidated)
- `testing.yml`
- `release-e2e-tests.yml`
- `checks.yml` (portions)
- (5 others)

### CI/CD (8 total → 1-2 consolidated)
- `build.yml`
- `cleanup-branches.yml`
- `branch-cleanup.yml`
- (5 others)

### Project Management (8 total → 1 consolidated)
- `project-meta-sync.yml`
- `project-field-sync.yml`
- `project-maintenance-on-demand.yml`
- `project-maintenance-nightly.yml`
- `project-archival.yml`
- (3 others)

### Other Utilities (8 total → consolidate or remove)
- `meta.yml`
- `meta-labels-sync.yml`
- `gitleaks.yml`, `gitleaks-update.yml`, `gitleaks-reusable.yml` (3 → 1)
- `actions-minute-savings-watch.yml`
- `agent-spec-validation.yml`
- `openspec-progress-phase.yml`, `openspec-report-progression.yml`, `openspec-validate-labels.yml` (3 → 1)
- `main-branch-guard.yml`

---

## Key Implementation Decisions

### 1. Branch Name Validation with Exceptions

**Current Challenge:** `branch-name-validation.yml` strictly enforces prefixes, but exceptions are needed.

**Decision:** Add configuration file `.github/branch-exceptions.yml` to specify exception patterns:

```yaml
# .github/branch-exceptions.yml
exceptions:
  - pattern: "hotfix/.*"  # Allow hotfix branches
  - pattern: "release/v.*"  # Allow version releases
  - pattern: "archive/.*"  # Allow archive branches
  - user: "dependabot"  # Dependabot can use any prefix
  - user: "renovate"  # Renovate can use any prefix
```

**Implementation:** Update validation-unified.yml to read exceptions and skip validation if matched.

### 2. PR Template Frontmatter Label Extraction

**Current Challenge:** Labels defined in PR template frontmatter (e.g., `pr_task.md`) aren't auto-applied.

**Decision:** Create helper script `.github/scripts/extract-pr-labels.js` that:
1. Reads PR template from frontmatter
2. Extracts `labels:` array
3. Compares with PR's current labels
4. Applies missing labels
5. Validates all labels exist in `.github/labels.yml`

**Implementation:** labeling-unified.yml calls this script on PR events.

### 3. Scheduled Workflow Deduplication

**Current Challenge:** 4+ scheduled workflows fire at 3am UTC causing resource conflicts.

**Decision:** Stagger scheduled jobs:

| Workflow | Time | Frequency |
|----------|------|-----------|
| `issue-management.yml` | 2:00 UTC | Daily |
| `project-management.yml` | 2:30 UTC | Daily |
| `reporting-metrics.yml` | 3:00 UTC | Daily |
| `branch-management.yml` | 3:30 UTC | Daily |
| `quality-gates.yml` (scheduled) | 4:00 UTC | Weekly (Mon) |

**Implementation:** Update all scheduled workflow `schedule:` cron times.

### 4. Mergify Configuration

**Current Challenge:** No unified Mergify configuration for auto-merge rules.

**Decision:** Create `.mergify.yml` or use GitHub native auto-merge with workflow gates:

```yaml
# pr-workflow.yml auto-merge rules
auto_merge:
  - check: "All status checks passed"
  - check: "At least 1 approval"
  - check: "No merge conflicts"
  - type: "patch" # Auto-merge patch releases only
```

**Implementation:** Add auto-merge logic to pr-workflow.yml.

### 5. CodeRabbit Integration

**Current Challenge:** CodeRabbit reviews must be explicitly configured; unclear how to trigger.

**Decision:** CodeRabbit is external service triggered by GitHub API. No workflow changes needed; only ensure:
- `.codrabbit.yml` exists with config
- PR description includes CodeRabbit trigger marker (if needed)
- CodeRabbit app installed on repo

**Implementation:** Use existing CodeRabbit workflow; document in quality-gates.yml.

---

## Success Criteria

### Phase 1 (Backup & Cleanup)
- ✅ 62 workflows archived with backup
- ✅ Consolidation mapping documented
- ✅ No data loss
- ✅ PR reviewed and approved

### Phase 2 (Build Consolidated Workflows)
- ✅ 14 core workflows implemented
- ✅ All 76 original features preserved
- ✅ CI passing on new workflows
- ✅ Execution time ≤ 110% of original
- ✅ No breaking changes

### Phase 3 (Testing & Validation)
- ✅ Parallel testing passed
- ✅ 10 test PRs validated
- ✅ Performance benchmarks documented
- ✅ Team approval
- ✅ Ready for production

### Overall Success
- ✅ Reduce workflow count: 76 → 14 (82% reduction)
- ✅ Reduce GitHub Actions minutes: 15-20% savings
- ✅ Reduce code duplication: ~500 lines eliminated
- ✅ Reduce merge blockage: Single unified check gate
- ✅ Team confident in CI/CD system

---

## Dependencies & Blockers

### Must Be Complete Before Starting

- ✅ Issue Type Workflow (Phases 1-4 merged PR #2686)
- ✅ Workflows Consolidation Phase 3 (PR #1496 merged)
- ✅ Release Agentic Workflows Phase 5A (PR #2016 merged)
- ✅ PR Template Standardization (existing)

### Can Run In Parallel

- Issue Type Phases 5-8 (template fixes + agent integration)
- Automation Consolidation Agentic Workflows Phase 2

### Will Block

- PR Finalisation Workflow (depends on labeling-unified.yml)
- Any new workflow creation until consolidation complete

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Merged workflow loses edge cases | MEDIUM | HIGH | Comprehensive parallel testing, 1-week validation |
| Breaking change to existing automation | MEDIUM | HIGH | Test on branch before production, gradual rollout |
| Increased complexity from consolidation | LOW | MEDIUM | Clear job structure, comprehensive documentation |
| Merge conflicts during development | LOW | LOW | Sequential workflow implementation, early testing |
| Performance regression | LOW | HIGH | Benchmark before/after, monitor GitHub Actions minutes |
| Scheduled job collisions return | LOW | MEDIUM | Document staggered schedule, monitor for conflicts |

---

## Files to Create/Update

### New Files

```
.github/projects/active/workflow-consolidation-master-plan-2026-09/
├── WORKFLOW_CONSOLIDATION_MASTER_PLAN.md (this file)
├── PHASE_1_BACKUP_STRATEGY.md
├── PHASE_2_IMPLEMENTATION_PLAN.md
├── PHASE_3_TESTING_PLAN.md
├── ARCHIVED_WORKFLOWS_MANIFEST.md
└── WORKFLOW_FEATURES_MAPPING.md

.github/
├── branch-exceptions.yml (NEW)
├── scripts/
│   └── extract-pr-labels.js (NEW)
├── workflows/
│   ├── archived/ (NEW DIRECTORY)
│   │   └── 2026-09-11/ (with 62 workflows)
│   └── (14 consolidated workflows replace 76)
└── docs/
    └── WORKFLOW_CONSOLIDATION_MAPPING.md (NEW)
```

### Updated Files

- `.github/AUTOMATION.md` — Update workflow table with 14 consolidated workflows
- `docs/AUTOMATION.md` — Simplified documentation
- Various workflow files — Schedule staggering, consolidation

---

## Next Steps (Immediate Actions)

### This Week (Sep 11-15)
1. ✅ Review this master plan
2. ⏳ Get team approval to proceed
3. ⏳ Create Phase 1 detailed plan
4. ⏳ Start Phase 1 (backup & archive)

### Week 2-3 (Sep 16-30)
1. ⏳ Complete Phase 1 backup + archive
2. ⏳ Merge Phase 1 PR
3. ⏳ Start Phase 2 implementation
4. ⏳ Begin labeling-unified.yml (critical path)

### Week 4-6 (Oct 1-15)
1. ⏳ Complete Phase 2 implementation
2. ⏳ Start Phase 3 parallel testing
3. ⏳ Validate all workflows

### Week 7 (Oct 16-22)
1. ⏳ Complete Phase 3 validation
2. ⏳ Production merge

---

## Document Index

This master plan pulls together findings from:

- `.github/projects/active/workflows-consolidation-2026-q3/README.md` — Phase 3 completion + Phase 4 planning
- `.github/projects/active/issue-type-workflow-automation/README.md` — Issue type standardization (Phases 1-4 merged)
- `.github/projects/active/automation-consolidation-agentic-workflows-2026-09/README.md` — Automation audit (Phase 1 complete)
- `.github/projects/active/pr-finalisation-workflow/README.md` — PR workflow modernization planning
- `.github/projects/active/release-agentic-workflows-2026-08-11/README.md` — Release agent Phase 5A (complete)
- `docs/AUTOMATION.md` — Current automation strategy
- `docs/LABEL_STRATEGY.md` — Label taxonomy

---

## Author & Approval

**Plan Created:** Sep 11, 2026  
**Owner:** Ashley Shaw (ashley@lightspeedwp.agency)  
**Status:** 📋 READY FOR TEAM REVIEW  
**Review Date:** [TBD]  
**Approval Date:** [TBD]  

---

**This master plan is the consolidated strategy for workflow simplification. Next step: Phase 1 detailed planning & backup strategy.**
