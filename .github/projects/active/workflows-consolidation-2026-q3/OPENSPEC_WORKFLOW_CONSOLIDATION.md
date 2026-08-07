---
title: "OpenSpec: GitHub Workflows Consolidation & Governance"
description: "Specification for workflow consolidation, from 41 to 25 workflows, with governance and best practices"
file_type: "documentation"
version: "1.0.0"
status: "draft"
created_date: "2026-08-07"
last_updated: "2026-08-07"
authors: ["Claude Code", "Ash Shaw"]
---

# OpenSpec: GitHub Workflows Consolidation Initiative

**Version**: 1.0 (Initial Specification)  
**Status**: Draft  
**Date**: 2026-08-07  
**Authors**: LightSpeed Engineering Team  
**Epic**: #1227

---

## Executive Summary

This specification defines a systematic approach to consolidating 41 GitHub workflows down to a target of 25 workflows. The consolidation improves:

1. **Efficiency** — 15-20% reduction in GitHub Actions minutes
2. **Maintainability** — Single source of truth for common patterns
3. **Clarity** — Reduced duplication and complexity
4. **Governance** — Clear architecture and naming conventions

**Key Metric:** 41 → 25 workflows (−16, 39% reduction)  
**Total Effort:** 13-16 hours (Phase 4 execution)  
**Duration:** 4-6 weeks (Phase 4 only)  
**Dependencies:** Phase 3.3 completion (labeling consolidation)

---

## 1. Problem Statement

### Current State (2026-08-07)

**Inventory:** 41 workflows across multiple categories

| Category | Count | Candidates for Consolidation |
|----------|-------|-----|
| Testing & Validation | 8 | Partially (Phase 4.4) |
| Changelog & Release | 4 | Partially (Phase 1B complete) |
| Documentation | 5 | Partially (Phase 2 complete) |
| Labeling & Automation | 6 | Partially (Phase 3.3 in progress) |
| CI/CD Pipeline | 8 | Partially (Phase 4) |
| Issue Governance | 8 | YES (Phase 4.2, 4.5, 4.6) |
| Project Management | 3 | YES (Phase 4.3) |
| Security & Maintenance | 3 | Under Review |
| Miscellaneous | 2 | Under Review |

**Root Causes of Duplication:**

1. **Overlapping Triggers** — Multiple workflows respond to same events (e.g., `issues: [closed]`)
2. **Repeated Logic** — Similar GitHub API calls in multiple workflows
3. **Organic Growth** — Workflows added ad-hoc as needs emerged
4. **Lack of Architecture** — No clear consolidation guidelines for new workflows
5. **Active Projects** — 6+ concurrent projects creating/modifying workflows simultaneously

### Constraints

- Cannot break existing functionality
- Must maintain backward compatibility
- Testing and validation required before/after
- Coordination needed with 6 active projects
- Phase 3.3 must complete first

### Success Definition

**Quantitative:**

- ✅ Reduce from 41 to 25 workflows (−16, 39%)
- ✅ Eliminate ~500 lines of duplicate code
- ✅ 15-20% reduction in GitHub Actions minutes
- ✅ All existing behavior preserved
- ✅ Zero regressions in CI/CD

**Qualitative:**

- ✅ Clear, understandable workflow architecture
- ✅ Single source of truth for common patterns
- ✅ Easy to add new workflows following established patterns
- ✅ Team confidence in CI/CD system

---

## 2. Consolidation Strategy

### 2.1 Workflow Categorization & Targets

**KEEP (24-25 workflows) — No consolidation**

These workflows serve unique purposes with no overlap:

- actions-minute-savings-watch.yml
- awesome-github-site.yml
- changelog-management.yml (Phase 1B consolidated result)
- checks.yml
- cleanup-branches.yml
- docs-maintenance.yml
- docs-validation.yml
- documentation.yml
- issues.yml
- labeling-governance.yml (Phase 3.1 consolidated result)
- main-branch-guard.yml
- meta.yml
- metadata-governance.yml
- metrics-reporting.yml (Phase 1B consolidated result)
- planner.yml
- project-archival.yml
- project-meta-sync.yml
- release.yml
- reporting.yml
- reviewer.yml
- validate-pr-template.yml
- issue-create-enhanced.yml (Phase 1B result, replaces old version)
- +2-3 others

**CONSOLIDATE (8 workflows across 6 sub-phases)**

| Phase | Current | Target | Consolidation Type | Effort |
|-------|---------|--------|---|---|
| 4.1 | validate-mermaid-pr.yml<br/>metrics-pipeline.yml | DELETE | Cleanup | 1h |
| 4.2 | template-enforcement.yml<br/>checklist-finalisation.yml<br/>validate-issue-dod-before-close.yml | issue-compliance.yml | Consolidation | 4-5h |
| 4.3 | issue-fields-backfill.yml<br/>issue-project-field-sync.yml | project-field-sync.yml | Consolidation | 3-4h |
| 4.4 | flaky-test-detection.yml | absorb into checks.yml | Absorption | 1-2h |
| 4.5 | issue-create-from-template.yml | DELETE | Cleanup | 0.5h |
| 4.6 | issue-health-audit.yml<br/>issue-remediation-bulk.yml | issue-audit-remediation.yml | Consolidation | 3-4h |

**Total:** −8 workflows, +3 new consolidated workflows (net −5)  
**Net Result:** 41 → 33 (after Phase 3.3 also deletes 3 labeling workflows) → 25 ✅

### 2.2 Consolidation Patterns

**Pattern 1: Cleanup (Phases 4.1, 4.5)**

- Remove deprecated/superseded workflows
- Verify replacement functionality
- 0.5-1 hour per cleanup

**Pattern 2: Trigger Consolidation (Phase 4.2)**

- Workflows sharing same trigger event (`issues: [closed]`)
- Create single workflow with conditional jobs
- Each condition handles specific behavior
- 4-5 hours complexity due to testing

**Pattern 3: Configuration Unification (Phase 4.3)**

- Workflows with same underlying operations but different interfaces
- Merge into single workflow with input parameters
- Support multiple modes (`bulk`, `targeted`, etc.)
- 3-4 hours complexity due to parameter design

**Pattern 4: Absorption (Phase 4.4)**

- Small workflow (<100 lines) merged into larger related workflow
- Add conditional job in target workflow
- 1-2 hours simplicity

**Pattern 5: Logical Consolidation (Phase 4.6)**

- Workflows performing related but distinct operations
- Merge into single workflow with mode selection
- Support `dry-run` for safe testing
- 3-4 hours complexity

---

## 3. Phase 4 Execution Plan

### Pre-Execution Requirements

- [ ] Phase 3.3 (labeling consolidation) must be complete
- [ ] All active projects must finalize workflow plans
- [ ] GitHub issues #1406-#1411 created and ready
- [ ] Team members assigned to each phase
- [ ] Coordination checkpoints scheduled with active project owners

### Phase 4.1: Delete Deprecated Workflows (1 hour)

**Scope:** Remove 2 fully deprecated workflows

**Workflows Deleted:**

- `validate-mermaid-pr.yml` — Already consolidated into docs-validation.yml
- `metrics-pipeline.yml` — Superseded by metrics-reporting.yml

**Verification Steps:**

1. Confirm metrics-reporting.yml covers all metrics-pipeline.yml jobs
2. Verify docs-validation.yml covers Mermaid checks
3. Check no external references to deleted workflows

**Dependency:** None (independent)

**Issue:** #1406

---

### Phase 4.2: Issue-Close Governance Consolidation (4-5 hours)

**Scope:** Merge 3 issue-close workflows into single issue-compliance.yml

**Current Workflows:**

- template-enforcement.yml (388 lines) — Template validation
- checklist-finalisation.yml (222 lines) — Checklist handling
- validate-issue-dod-before-close.yml (113 lines) — DoD validation

**New Workflow:** issue-compliance.yml

```yaml
on:
  issues:
    types: [opened, edited, reopened, closed]
  pull_request_target:
    types: [closed]
  push:
    branches: [develop]

jobs:
  enforce-template:        # Template validation (all events except closed)
  validate-dod-on-close:  # DoD validation on close only
  finalise-checklists:    # Checklist finalization on close
```

**Testing Protocol:**

- [ ] Open new issue → enforce-template fires
- [ ] Close issue with incomplete DoD → validate-dod-on-close blocks
- [ ] Close PR → finalise-checklists fires
- [ ] Push to develop → template validation fires
- [ ] Monitor 24h with old workflows disabled

**Issue:** #1407  
**Dependency:** None (can run in parallel with 4.3, 4.4, 4.6)

---

### Phase 4.3: Project Sync Unification (3-4 hours)

**Scope:** Merge 2 project field sync workflows with unified interface

**Current Workflows:**

- issue-fields-backfill.yml (342 lines) — Bulk sync all open issues
- issue-project-field-sync.yml (386 lines) — Targeted sync specific issues

**New Workflow:** project-field-sync.yml

```yaml
on:
  workflow_dispatch:
    inputs:
      mode:
        type: choice
        options: [bulk, targeted, dry-run]
      sync_native_types:
        type: choice
        default: "true"
      sync_project_fields:
        type: choice
        default: "true"
```

**Pre-Consolidation Requirements:**

- [ ] Standardize auth from PAT to GitHub App token
- [ ] Test unified interface in both modes
- [ ] Validate dry-run functionality

**Testing Protocol:**

- [ ] Test bulk mode with dry-run
- [ ] Test targeted mode with dry-run
- [ ] Verify GraphQL operation parity
- [ ] Monitor 24h with old workflows disabled

**Issue:** #1408  
**Dependency:** None (parallel with 4.2, 4.4, 4.6)

---

### Phase 4.4: Flaky Test Absorption (1-2 hours)

**Scope:** Absorb flaky-test-detection.yml (42 lines) into checks.yml

**Current Workflow:**

- flaky-test-detection.yml (42 lines) — Detects non-deterministic tests

**Consolidation:**

1. Review checks.yml current size (must be ≤350 lines after addition)
2. Add flaky-detection job with schedule trigger
3. Preserve all test logic from flaky-test-detection.yml
4. Conditional guard: `if: github.event_name == 'schedule'`

**Testing Protocol:**

- [ ] Verify checks.yml still under 400 lines
- [ ] Test schedule trigger fires every 12h Mon-Fri
- [ ] Run flaky detection tests successfully
- [ ] Monitor one full 12-hour cycle with old workflow disabled

**Issue:** #1409  
**Dependency:** None (parallel with 4.2, 4.3, 4.6)

---

### Phase 4.5: Delete Superseded Issue-Create (0.5 hours)

**Scope:** Remove old issue creation workflow superseded by enhanced version

**Workflow Deleted:**

- issue-create-from-template.yml (superseded by issue-create-enhanced.yml)

**Verification Steps:**

1. Confirm issue-create-enhanced.yml covers all old inputs
2. Search for references in agents/prompts/docs
3. Update any references to use enhanced version
4. Verify GitHub Actions shows no references

**Issue:** #1410  
**Dependency:** None (independent)

---

### Phase 4.6: Issue Audit & Remediation Consolidation (3-4 hours)

**Scope:** Merge 2 issue audit workflows with mode selection

**Current Workflows:**

- issue-health-audit.yml (267 lines) — Weekly audit, reopen issues with unchecked DoD
- issue-remediation-bulk.yml (260 lines) — Fix labels/milestones/templates

**New Workflow:** issue-audit-remediation.yml

```yaml
on:
  schedule:
    - cron: "0 8 * * 1"  # Weekly Monday
  workflow_dispatch:
    inputs:
      mode:
        type: choice
        options: [audit, remediate, full]
      days:
        description: Scope (remediate mode only)
      dry_run:
        default: "true"

jobs:
  audit:      # Audit mode: reopen with unchecked DoD
  remediate:  # Remediate mode: fix missing labels/milestones
```

**Interaction Chain:**

- When audit-remediation applies `type:` label → metadata-governance.yml fires (labeled event)
- metadata-governance.yml syncs native issue type → expected, no conflict

**Testing Protocol:**

- [ ] Verify both source workflows had 1+ production run (PR #1399, #1377)
- [ ] Test audit mode with dry-run
- [ ] Test remediate mode with dry-run (last 3 days)
- [ ] Verify no close/reopen loops
- [ ] Monitor one full weekly cycle

**Issue:** #1411  
**Dependency:** Both source workflows must have 1+ production run before consolidation

---

## 4. Governance & Best Practices

### 4.1 Workflow Naming Convention

**Format:** `{category}-{primary-purpose}-{optional-qualifier}.yml`

**Examples:**

- `issue-compliance.yml` — Issue governance family
- `project-field-sync.yml` — Project management family
- `labeling-governance.yml` — Labeling family
- `docs-validation.yml` — Documentation family
- `changelog-management.yml` — Release family

**Forbidden:**

- ❌ Bare names: `validation.yml`, `sync.yml`
- ❌ Vague names: `automation.yml`, `management.yml` (without category)
- ❌ Redundant suffixes: `workflow.yml` (implicit)

### 4.2 Consolidation Decision Matrix

Before creating a new workflow or adding to existing, evaluate against consolidation criteria:

| Criterion | Keep Separate | Consolidate |
|-----------|---|---|
| **Shared Triggers** | Different events | Same events (e.g., `issues: [closed]`) |
| **Shared Logic** | Unrelated logic | Same GitHub API calls/patterns |
| **Testing** | Independent test suites | Shared testing concerns |
| **Scheduling** | Different cadences | Same schedule |
| **Size** | >400 lines | <100 lines (candidate for absorption) |
| **Trust Boundary** | Different security concerns | Same authorization |
| **Ownership** | Different teams | Same team |

### 4.3 Testing Protocol (Post-Consolidation)

Every consolidated workflow must pass:

1. **Functional Testing**
   - All conditions/jobs fire correctly
   - All inputs work as expected
   - All outputs match originals

2. **Integration Testing**
   - No broken dependencies
   - Downstream workflows still function
   - GitHub Projects/milestones unaffected

3. **Monitoring (24-72 hours)**
   - Old workflow disabled, new one running
   - No errors in Action logs
   - Performance metrics unchanged
   - Team feedback positive

4. **Safety Valve**
   - If issues found, revert and file bug
   - Document what failed
   - Schedule fix for next iteration

---

## 5. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Consolidation breaks existing behavior** | MEDIUM | HIGH | Comprehensive testing before merge, parallel disable period |
| **Active projects add workflows after consolidation** | MEDIUM | MEDIUM | Coordinate with all active projects, establish governance rules |
| **Team not trained on new structure** | LOW | MEDIUM | Documentation, internal training session |
| **Performance regression** | LOW | HIGH | Monitor GitHub Actions minute usage before/after |
| **Unaccounted workflows create new conflicts** | MEDIUM | MEDIUM | Complete audit first, assess 8+ discovered workflows |

---

## 6. Success Criteria

**Quantitative (Must achieve):**

- ✅ Reduce from 41 to 25 workflows (−16, 39%)
- ✅ All 6 Phase 4 sub-phases complete successfully
- ✅ 0 regressions in existing functionality
- ✅ 15-20% reduction in GitHub Actions minutes (measured month-over-month)

**Qualitative (Target achievement):**

- ✅ All workflows follow naming convention
- ✅ All consolidations follow documented patterns
- ✅ All new workflows have clear ownership/documentation
- ✅ Team can easily understand workflow architecture

---

## 7. Dependency Graph & Execution Order

```text
Phase 3.3 (Labeling consolidation) — MUST COMPLETE FIRST
    │
    ├─► Phase 4.1 (Delete deprecated) ✅ Independent
    │   └─► Phase 4.2 (Issue compliance) ✅ Independent (parallel with 4.3, 4.4, 4.6)
    │
    ├─► Phase 4.3 (Project sync) ✅ Independent (parallel with 4.2, 4.4, 4.6)
    │
    ├─► Phase 4.4 (Flaky test absorption) ✅ Independent (parallel with 4.2, 4.3, 4.6)
    │
    ├─► Phase 4.5 (Delete issue-create) ✅ Independent
    │
    └─► Phase 4.6 (Issue audit + remediation) ⚠️ Depends on both source workflows having 1+ production run

Final Verification (after all phases) — Integration testing, metrics validation
```

**Recommended Execution:**

1. Day 1: Complete Phase 4.1 and 4.5 (quick wins, 1.5h total)
2. Days 2-4: Run Phases 4.2, 4.3, 4.4, 4.6 in parallel (each team member owns one phase)
3. Days 5-6: Integration testing, monitoring, metrics compilation

**Total Execution Time:** 5-6 days (4-6 weeks of calendar time for testing/stabilization)

---

## 8. Related Active Projects Coordination

**CRITICAL:** All active projects must be informed of Phase 4 consolidation targets

### Projects to Coordinate With

1. **release-process-redesign-2026-08-05**
   - Affects: release.yml, changelog-management.yml
   - Phase 4 Status: Keep (not consolidating)
   - Coordination: Ensure new release workflows follow naming convention

2. **issue-type-workflow-automation**
   - Affects: issue-labeling-automation.yml, template-enforcement.yml
   - Phase 4 Status: template-enforcement.yml is Phase 4.2 target
   - Coordination: Finalize template changes before Phase 4.2

3. **template-enforcement-governance**
   - Affects: template-enforcement.yml
   - Phase 4 Status: Phase 4.2 consolidation target
   - Coordination: Must coordinate timing with Phase 4.2

4. **changelog-automation-hardening**
   - Affects: changelog-management.yml
   - Phase 4 Status: Keep (not consolidating)
   - Coordination: Document new changelog workflows

5. **github-projects-creation-system**
   - Affects: Project automation workflows
   - Phase 4 Status: Phase 4.3 targets project-field-sync consolidation
   - Coordination: New project workflows must follow established patterns

6. **issue-triage-automation-system** (COMPLETE)
   - Added: issue-create-enhanced.yml, issue-remediation-bulk.yml
   - Phase 4 Status: Phase 4.6 consolidates issue-remediation-bulk.yml
   - Coordination: ✅ Already accounted for in Phase 4 plan

---

## 9. Unaccounted Workflows (TBD)

**8+ Workflows discovered in current repository not mentioned in Phase 4 plan:**

| Workflow | Category | Purpose | Consolidation Candidate? |
|----------|----------|---------|---|
| gitleaks-reusable.yml | Security | Reusable secret scanning | ❓ Assess |
| gitleaks-update.yml | Security | Gitleaks maintenance | ❓ Assess |
| gitleaks.yml | Security | Main gitleaks scanning | ❓ Assess |
| issue-labeling-automation.yml | Issue Governance | Automated issue labeling | ❓ Assess |
| manage-blocking-status-labels.yml | Issue Governance | Blocking status management | ❓ Assess |
| validate-blocking-issue-before-close.yml | Issue Governance | Blocking issue validation | ❓ Assess |
| validate-blocking-status-before-close.yml | Issue Governance | Blocking status validation | ❓ Assess |
| TBD | TBD | TBD | ❓ TBD |

**Assessment needed:** These must be evaluated for consolidation or absorbed into Phase 4.

---

## 10. Implementation Checklist

- [ ] Phase 3.3 (labeling consolidation) complete and stable
- [ ] All active project owners briefed on Phase 4 consolidation
- [ ] GitHub issues #1406-#1411 created with full details
- [ ] Team members assigned to each Phase 4 sub-phase
- [ ] Audit agent completes assessment of 8+ unaccounted workflows
- [ ] Testing environment ready
- [ ] Rollback procedures documented
- [ ] Team training on new workflow architecture completed

---

## 11. Metrics & Monitoring

**Pre-Consolidation Baseline (Week of 2026-08-07):**

- [ ] Current GitHub Actions minute usage
- [ ] Workflow execution time per workflow
- [ ] Error rate and failure recovery time
- [ ] Team satisfaction score (survey)

**Post-Consolidation Measurement (Week of 2026-08-28):**

- [ ] New GitHub Actions minute usage
- [ ] Consolidated workflow execution time
- [ ] Error rate (should stay same or improve)
- [ ] Team satisfaction score (survey)

**Success Targets:**

- 15-20% reduction in Actions minutes
- <5% increase in consolidated workflow execution time
- ≥95% team satisfaction
- 0 regressions

---

## Conclusion

This specification provides a systematic, risk-mitigated approach to consolidating 41 workflows down to 25, achieving 39% reduction in workflow count and 15-20% improvement in GitHub Actions efficiency.

The consolidation is achievable in 4-6 weeks with 13-16 hours of direct effort, following established patterns and best practices.

**Next Action:** Review this specification, approve Phase 4 execution, brief active project owners, create GitHub issues #1406-#1411.

---

**Specification Owner:** Ash Shaw  
**Version:** 1.0.0  
**Date:** 2026-08-07  
**Epic:** #1227  
**Status:** Ready for Approval
