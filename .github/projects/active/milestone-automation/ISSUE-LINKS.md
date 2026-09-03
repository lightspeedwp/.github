---
title: Phase 2 Follow-Up — Issue Links & Tracking
description: Central registry linking milestone-automation project to related GitHub issues
type: tracker
file_type: documentation
status: active
version: "1.0.0"
owner: lightspeedwp/maintainers
owners:
  - lightspeedwp/maintainers
tags:
  - phase-2
  - issue-tracking
  - cross-project
---

# Phase 2 Follow-Up — Issue Links & Tracking

This document maintains the relationship between the `milestone-automation` active project and related GitHub issues.

## Active Project Hub

**Project:** [milestone-automation/](./README.md)  
**Type:** Automation & Monitoring System  
**Status:** Phase 2 Follow-Up (In Progress)  
**Owner:** lightspeedwp/maintainers  
**Created:** 2026-08-29  
**Updated:** 2026-09-03  

---

## Phase 2 — CodeRabbit Review Findings (28 Items)

### Epic: Phase 2 Final Validation & Merge Preparation

**Issue:** [#1852](https://github.com/lightspeedwp/.github/issues/1852)  
**Title:** Phase 2 Final Validation & Merge Preparation  
**Status:** 🟡 Open  
**Label:** `type:feature`, `area:ai`  
**Milestone:** v1.1  

**Relationship:**
- This issue umbrella-covers all Phase 2 CodeRabbit findings
- FOLLOW-UP-FIXES.md documents the 28 findings discovered by CodeRabbit review
- PR #2629 merged 10 findings; 18 remain under investigation

**Linked Documentation:**
- [FOLLOW-UP-FIXES.md](./FOLLOW-UP-FIXES.md) — 28-item tracker
- [OPENSPEC.md](./OPENSPEC.md) — Technical spec with Phase 2 progress
- [STATUS.md](./STATUS.md) — Completion evidence

---

## Functional Area Issues

### Labeling Automation & Governance

**Issue:** [#1524](https://github.com/lightspeedwp/.github/issues/1524)  
**Title:** Create integration tests for Phase 3 labeling automation  
**Status:** 🟡 Open  
**Label:** `type:task`, `area:automation`  
**Milestone:** v1.1  

**Relationship:**
- Depends on Phase 2 follow-up CI checks passing
- CI check #13 validates "Unified Labeling, Status, Type"
- Project provides label taxonomy documentation in FOLLOW-UP-FIXES.md

**Linked Documentation:**
- FOLLOW-UP-FIXES.md § CI Failures (Check #13)

---

### Labeling Schema & Configuration

**Issue:** [#786](https://github.com/lightspeedwp/.github/issues/786)  
**Title:** docs: CodeRabbit v2 schema validation and configuration cleanup  
**Status:** 🟡 Open  
**Label:** `type:documentation`, `type:test`, `type:improve`  
**Milestone:** v1.1  

**Relationship:**
- CI check #12 validates Mermaid diagram accessibility
- Project OPENSPEC.md contains Mermaid diagrams requiring accTitle/accDescr
- CodeRabbit findings ENH-001, ENH-002, ENH-003 relate to documentation quality

**Linked Documentation:**
- FOLLOW-UP-FIXES.md § CI Failures (Checks #12, #14)
- OPENSPEC.md § 1.1 High-Level Design (contains Mermaid diagram)

---

### Workflow Automation Upgrade

**Issue:** [#1673](https://github.com/lightspeedwp/.github/issues/1673)  
**Title:** Phase 3A: Automation Workflows Upgrade - GitHub Actions v7  
**Status:** 🟡 Open  
**Label:** `type:task`, `area:ci`, `priority:high`  
**Milestone:** v1.1  

**Relationship:**
- Depends on Phase 2 workflow validation (CI checks #19-24)
- MON-001 and MON-002 findings address workflow reliability
- Phase 2 CI investigation validates current workflow state

**Linked Documentation:**
- FOLLOW-UP-FIXES.md § CI Failures (Checks #19-24)
- MON-001-WORKFLOW-ALERTS.md
- MON-002-RATE-LIMIT-MONITORING.md

---

### Agent Hooks & Standards

**Issue:** [#1129](https://github.com/lightspeedwp/.github/issues/1129)  
**Title:** chore: complete pending CodeRabbit improvements for agent hooks (#1126 Phase 2)  
**Status:** 🟡 Open  
**Label:** `type:documentation`, `type:test`, `type:improve`  
**Milestone:** v1.1  

**Relationship:**
- Related Phase 2 effort with similar CodeRabbit review findings
- Cross-project coordination: both addressing CodeRabbit recommendations
- AGENTS.md specifications may reference milestone-automation patterns

**Linked Documentation:**
- None currently (sibling project)

---

## CI Investigation & Infrastructure

### Node.js Requirement Blocking

**Dependency:** Node 24+ required  
**Current:** Node 22  
**Blocker:** npm ci fails on Node 22  
**Impact:** Checks #25-28 cannot run  
**Resolution:** Upgrade GitHub Actions runner (planned for Phase 3, Step 3)

**Timeline:**
- ⏳ 2026-09-04: GitHub Actions runner upgrade to Node 24+
- ⏳ 2026-09-05: Re-run CI suite validation
- ✅ 2026-09-10: All 28 findings addressed

---

## Cross-Project References

### Automation Monitoring System (Related)

**Project:** [ai-governance-audit-implementation/](../ai-governance-audit-implementation/)  
**Relation:** Parallel Phase 2 effort  
**Shared:** CodeRabbit review patterns, documentation standards  

### Agent Standards Initiative (Related)

**Project:** [agent-standards-initiative/](../agent-standards-initiative/)  
**Relation:** Architecture alignment  
**Shared:** Specifications, API patterns  

---

## Link Maintenance

**How to Update This Document:**

1. When a related GitHub issue is created, add entry with:
   - Issue number and title
   - Current status
   - Relationship to milestone-automation
   - Linked documentation reference

2. When CI checks are resolved, update:
   - Status (⏳ → 🟢)
   - Resolution notes
   - Related issue closure

3. Synchronize daily with:
   - [FOLLOW-UP-FIXES.md](./FOLLOW-UP-FIXES.md) — CI check status
   - [STATUS.md](./STATUS.md) — Completion evidence
   - [OPENSPEC.md](./OPENSPEC.md) — Technical progress

---

**Last Updated:** 2026-09-03  
**Maintained By:** lightspeedwp/maintainers  
**Review Frequency:** Daily (during Phase 2 follow-up)  
**Target Review Date:** 2026-09-10

---

## Quick Reference

| Issue | Title | Type | Status | Progress |
|-------|-------|------|--------|----------|
| [#1852](https://github.com/lightspeedwp/.github/issues/1852) | Phase 2 Final Validation & Merge Preparation | Epic | 🟡 Open | 36% (10/28) |
| [#1524](https://github.com/lightspeedwp/.github/issues/1524) | Create integration tests for Phase 3 labeling automation | Task | 🟡 Open | Blocked by #1852 |
| [#786](https://github.com/lightspeedwp/.github/issues/786) | CodeRabbit v2 schema validation and configuration cleanup | Docs | 🟡 Open | Ongoing |
| [#1673](https://github.com/lightspeedwp/.github/issues/1673) | Phase 3A: Automation Workflows Upgrade | Task | 🟡 Open | Blocked by #1852 |
| [#1129](https://github.com/lightspeedwp/.github/issues/1129) | Complete pending CodeRabbit improvements for agent hooks | Task | 🟡 Open | Related effort |

