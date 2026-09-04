---
file_type: documentation
title: Phase 2+ Enhancement Issues - Future Work Planning
date: 2026-09-04
status: planning
---

# Phase 2+ Enhancement Issues

This document defines the GitHub issues for optional enhancements identified in Phase 2 gap analysis.

---

## Issue #2660: Maintainer Tooling & Bulk Label Operations

**Title:** Implement CLI tool for bulk label management operations  
**Type:** Feature  
**Priority:** Medium  
**Effort:** 5 story points  
**Timeline:** 2-3 days  
**Status:** Ready for creation

### Description

Create a command-line tool for bulk label operations across GitHub issues and PRs. This addresses the gap where maintainers must manually perform repetitive labeling tasks.

### Scope

- Bulk apply/remove labels based on criteria
- Find and replace label patterns
- Generate reports of label changes
- Validate operations before applying
- Audit logging for bulk changes

### Acceptance Criteria

- [ ] CLI tool accepts common label operations (apply, remove, find-replace)
- [ ] Query-based selection (by issue type, state, author, date range)
- [ ] Dry-run mode for validation
- [ ] Generates CSV/JSON reports of changes
- [ ] Logs all operations with timestamp and operator
- [ ] Documentation and examples provided
- [ ] Tests for core operations

### Related

- Parent: #2352 (PR Labeling Enforcement Initiative)
- Depends on: #1786 (Phase 1 - Label Coverage Audit Skill) ✅ Complete
- Related: #2658, #2659 (Phase 2 enhancements)

### Labels

```
type:feature
priority:medium
area:tooling
status:ready-to-create
```

---

## Issue #2661: Enhanced Label Documentation & Decision Tree

**Title:** Create comprehensive labeling guide with interactive decision tree  
**Type:** Documentation  
**Priority:** Medium  
**Effort:** 3 story points  
**Timeline:** 1-2 days  
**Status:** Ready for creation

### Description

Enhance label documentation with clear decision-making guidance. Current documentation is reference-style; this creates decision-tree style guidance for choosing correct labels.

### Scope

- Update `docs/LABEL_STRATEGY.md` with decision trees
- Add flowcharts for label selection (for each label family)
- Provide real-world examples for each label
- FAQ section addressing common mistakes
- Video walkthrough links (external)
- Integration guidance for CI/CD

### Acceptance Criteria

- [ ] Decision tree flowcharts for each label family
- [ ] Real-world examples for 80%+ of labels
- [ ] FAQ with 10+ common questions
- [ ] Updated README with link to decision tree
- [ ] Mermaid diagrams for visual representation
- [ ] Accessible to non-technical users

### Related

- Parent: #2352 (PR Labeling Enforcement Initiative)
- Depends on: #1786 (Phase 1) ✅ Complete
- Complements: #2658, #2659 (Phase 2 enhancements)
- Impacts: New contributor onboarding

### Labels

```
type:documentation
priority:medium
area:docs
status:ready-to-create
```

---

## Issue #2662: Workflow Modernization & Integration Fixes

**Title:** Update GitHub Actions workflows to latest versions and fix integration issues  
**Type:** Maintenance  
**Priority:** High  
**Effort:** 8 story points  
**Timeline:** 3-4 days  
**Status:** Ready for creation

### Description

Modernize 7 GitHub Actions workflows by upgrading to latest action versions and fixing 5 identified integration issues discovered during audit.

### Scope

#### Integration Issues to Fix
1. **Label Sync Workflow** — Add scheduled and event-based triggers
2. **PR Labeling Validation** — Fix overly-permissive regex matching
3. **Release Labeling** — Add pre-release detection logic
4. **Issue Template Routing** — Fix branch name matching with special characters
5. **Metrics Reporting** — Update query for multi-family label items

#### General Improvements
- Upgrade action versions to latest stable
- Implement consistent error handling
- Add logging and diagnostics
- Update documentation for each workflow
- Add tests for critical paths

### Acceptance Criteria

- [ ] All 7 workflows upgraded to latest actions
- [ ] All 5 integration issues resolved
- [ ] Consistent error handling across workflows
- [ ] Workflows documented with examples
- [ ] CI tests for workflow logic passing
- [ ] No breaking changes to existing workflows
- [ ] Performance improvements documented

### Related

- Parent: #2352 (PR Labeling Enforcement Initiative)
- Depends on: #1786 (Phase 1) ✅ Complete
- Blocks: Phase 3 rollout (Issue #1605)
- Documentation: [WORKFLOW_VERIFICATION_AND_PLANNING.md](./WORKFLOW_VERIFICATION_AND_PLANNING.md)

### Labels

```
type:maintenance
priority:high
area:ci
status:ready-to-create
```

---

## Issue #2663: Monitoring & Observability Dashboard

**Title:** Build compliance monitoring and trend tracking dashboard  
**Type:** Feature  
**Priority:** Low  
**Effort:** 5 story points  
**Timeline:** 2-3 days  
**Status:** Ready for creation (Post-Phase 2)

### Description

Create centralized monitoring of label compliance trends. Currently, compliance is measured manually via one-off audits. This creates persistent visibility into compliance health.

### Scope

- Historical storage of audit results
- Compliance trend visualization
- Category-level breakdowns
- Alerting for significant changes
- Export reports for stakeholders
- Integration with existing audit skill

### Acceptance Criteria

- [ ] Audit results stored in database/CSV
- [ ] Compliance trends visible over time (30+ days)
- [ ] Category-level breakdowns by label family
- [ ] Alert configuration for compliance drop
- [ ] Weekly/monthly report generation
- [ ] Dashboard readable in light/dark mode
- [ ] REST API for querying historical data

### Related

- Parent: #2352 (PR Labeling Enforcement Initiative)
- Depends on: #1786 (Phase 1) ✅ Complete
- Uses data from: #2658, #2659 (Phase 2)
- Complements: #2660, #2661, #2662 (Phase 2+ enhancements)

### Labels

```
type:feature
priority:low
area:monitoring
status:ready-to-create
```

---

## Creation Checklist

### Before Creating Issues

- [ ] Verify issue numbers are available (#2660-2663)
- [ ] Review GitHub issue templates
- [ ] Assign labels from canonical set
- [ ] Cross-link to parent issue (#2352)
- [ ] Add to PR Labeling Enforcement Initiative project board

### After Creating Issues

- [ ] Link issues to this planning document
- [ ] Update active project README with new issue links
- [ ] Post comment in parent issue (#2352) with new issues
- [ ] Assign to project milestone (v1.1 or v1.2)
- [ ] Add to team backlog for planning

---

## Issue Dependency Graph

```
Phase 1 Complete (Issue #1786) ✅
    ↓
Phase 2 Complete (Issues #2658, #2659)
    ↓
Phase 2+ Enhancements (Issues #2660-2663)
    ├─ #2660: Maintainer Tooling (independent)
    ├─ #2661: Enhanced Documentation (independent)
    ├─ #2662: Workflow Modernization (blocks Phase 3)
    └─ #2663: Monitoring Dashboard (uses Phase 2 data)
```

---

## Timeline

| Issue | Effort | Can Start | Recommended Phase |
|-------|--------|-----------|-------------------|
| #2660 | 5 pts | After #2659 | Phase 2.5 (Parallel) |
| #2661 | 3 pts | After #2658 | Phase 2 (Parallel) |
| #2662 | 8 pts | After #2659 | Phase 2 (Blocking Phase 3) |
| #2663 | 5 pts | After #2659 | Phase 3 (Post-enforcement) |

**Recommended:** Start #2660, #2661, #2662 in parallel after Phase 2 core work (#2658, #2659) is ~50% complete.

---

Version: 1.0 | Status: Ready for Creation | Created: 2026-09-04
