---
file_type: documentation
title: "Release Process Redesign Project"
description: "Complete audit, redesign, and implementation of release workflow, documentation, and governance"
status: complete
version: "2.0"
last_updated: "2026-08-19"
owners: ["Ash Shaw"]
tags: ["release", "automation", "documentation", "project"]
category: "release-engineering"
---

# Release Process Redesign Project

## Project Overview

**Objective:** Audit, redesign, and implement a complete release process that aligns workflow implementation with documentation, clarifies governance, and establishes clear automation for versioning, changelog management, release tagging, and GitHub Releases.

**Scope:** Release workflows (.github/workflows/release.yml, changelog-management.yml), release agents (scripts/agents/release.agent.js), related documentation (RELEASE_PROCESS.md, BRANCHING_STRATEGY.md, CHANGELOG_AUTOMATION.md, VERSIONING.md), and integration with broader governance systems.

**Duration:** 2-3 sprints (Phase 1-4: ~8 days actual; Phase 5-7: estimated 7-9 days; Total ~15-17 days vs initial 20-30 day estimate)

**Stakeholders:** Engineering leads, release manager, documentation team

---

## Current Status

### Phase 1: Critical Fixes ✅ COMPLETE

- [x] Authorization gating for release workflow (CHILD-001)
- [x] Implement develop-first release flow (CHILD-002)
- [x] Remove broken workflow badges (CHILD-003)

### Phase 2: Major Issues ✅ COMPLETE (6/6)

**Priority 1: No Dependencies** ✅

- [x] CHILD-006: Change dry-run default to false
- [x] CHILD-010: Improve release notes preview

**Priority 2: Depends on Phase 1** ✅

- [x] CHILD-009: Fix trigger telemetry authorization

**Priority 3: Major Fixes** ✅

- [x] CHILD-004: Implement post-release sync automation
- [x] CHILD-005: Clarify changelog validation timing
- [x] CHILD-007: Enforce pre-release checklist
- [x] CHILD-008: Create rollback.cjs automation

### Phase 3: Design & Documentation ✅ COMPLETE

- [x] Document desired release flow with diagrams (ADRs created)
- [x] Define workflow gates and validation requirements
- [x] Create ADR-001 through ADR-004 (all major decisions)
- [x] Comprehensive OpenSpec analysis (47 implementation tasks derived)
- [x] Requirements specification with tradeoff analysis

### Phase 4: Implementation & Testing ✅ COMPLETE

**Completed:** 2026-08-08 to 2026-08-09 (1 day, ahead of 18-day estimate)

**Implementation Tasks (18 planned, delivered in 1 day):**

- [x] CHILD-020: Update release.yml for develop-first flow + stacked PRs (PR #1658)
- [x] CHILD-021: Modify release.agent.js for two-PR creation logic (PR #1658)
- [x] Authorization gates + dry-run validation implemented
- [x] Mergify sequential configuration deployed (batch_size: 1, max_parallel_checks: 1)
- [x] CLAUDE.md v2.0 documentation updated

**Key Deliverables:**

- ✅ Develop-first release flow implemented (2-PR stacked architecture)
- ✅ Sequential PR processing via Mergify (no circular dependencies)
- ✅ Authorization gates enforced (telemetry validation)
- ✅ Dry-run validation available
- ✅ All CodeRabbit + Copilot feedback addressed and resolved

**Merged PRs:** #1656 (docs), #1658 (implementation)  
**Status:** Phase 4 SHIPPED to develop (2026-08-09)

### Phase 5A: Agentic Workflows ✅ COMPLETE

**Completed:** 2026-08-18 (Week 3)

**Implementation:**

- ✅ 7-layer safety gates (445 LOC)
- ✅ Phase 4 wrapper integration (140 LOC)
- ✅ 41/41 tests passing (82% coverage)
- ✅ GitHub Actions workflow updated
- ✅ Dry-run validation & audit logging

**Merged:** PR #2016 to develop (commit f2b07bc9c)

**Status:** Production-ready, soft launch Sep 9, 2026

**See:** [Release Agentic Workflows project](../release-agentic-workflows-2026-08-11/) for full details

### Phase 5: Portable Agent Architecture ⏸️ DEFERRED

**Reason:** Phase 5A agentic workflows provide primary interface; portable agents (Phase 5) remain optional for future multi-repo integration (Phase 8+)

**Decision:** Focus on soft launch (Sep 9); portable agents planned for Phase 8

### Phase 6: WordPress Support ✅ COMPLETE

**Completed:** 2026-08-19

**Implementation:**

- ✅ pluginHeader.js (WordPress plugin header parsing)
- ✅ themeCss.js (WordPress theme style.css parsing)
- ✅ readmeTxt.js (WordPress readme.txt parsing)
- ✅ 2,189 LOC, 75+ tests, >85% coverage
- ✅ Full integration with release workflow

**Merged:** PR #2115 to develop

**Status:** Production-ready, integrated with Phase 5A

### Phase 7: Documentation & Training ✅ COMPLETE

**Completed:** 2026-08-19

**Documentation Delivered:**

- ✅ RELEASE_PROCESS.md v4.0 (600+ lines, comprehensive flow)
- ✅ BRANCHING_STRATEGY.md enhancements (agentic workflows integration)
- ✅ RELEASE_WORDPRESS.md (new guide for WordPress releases)
- ✅ 4 Mermaid diagrams (workflow flows, gate architecture)
- ✅ 17+ FAQ items addressing common scenarios

**Training Materials:**

- ✅ Team training guide (internal)
- ✅ Approval flow documentation
- ✅ Dry-run procedure documentation

**Merged:** PR #2116 to develop

**Status:** Production-ready documentation, team training ready

---

## Key Artifacts

### Specification Documents

**File:** [OPENSPEC_ANALYSIS_REPORT.md](./OPENSPEC_ANALYSIS_REPORT.md)  
**Status:** ✅ COMPLETE  
**Content:** Full specification with 47 implementation tasks, timelines, ADRs, risk analysis

### Questionnaire (Completed)

**File:** [QUESTIONNAIRE_PREPOPULATED.md](./QUESTIONNAIRE_PREPOPULATED.md)  
**Status:** ✅ COMPLETE  
**Content:** 50 questions answered, all requirements gathered

### Audit Report

**File:** [AUDIT_REPORT.md](./AUDIT_REPORT.md)  
**Status:** ✅ COMPLETE  
**Findings:** 3 critical, 7 major, 5 medium issues → all addressed in Phase 1-2

### Supporting Documentation

- [ADDITIONAL_DOCS_AUDIT.md](./ADDITIONAL_DOCS_AUDIT.md) — Audit of ARCHITECTURE.md, AUTOMATION.md, DECISIONS.md, etc.
- [RFC_RELEASE_PROCESS_V2.md](./RFC_RELEASE_PROCESS_V2.md) — Release Process V2 proposal
- [MULTI_REPO_AGENT_STRATEGY.md](./MULTI_REPO_AGENT_STRATEGY.md) — Portable agents architecture

---

## Implementation Plan (Phases 4-7)

### Phase 4: Core Implementation ✅ COMPLETE (1 day actual vs 18 days planned)

**Delivered (2026-08-08 to 2026-08-09):**

- ✅ CHILD-020: Updated `.github/workflows/release.yml` (develop-first flow, stacked PRs)
- ✅ CHILD-021: Modified `scripts/agents/release.agent.js` (two-PR creation logic)
- ✅ Authorization gates implemented and enforced
- ✅ Mergify sequential configuration deployed
- ✅ Pre-release checklist validation in place

**PRs Merged:** #1656 (docs), #1658 (implementation)

**What This Enables:** Develop-first release flow now live in production (develop branch)

### Phase 5A: Agentic Workflows ✅ COMPLETE

**Completed:** 2026-08-18 (concurrent with Phase 5 planning)

**Deliverables:**

- ✅ 7-layer safety gates (445 LOC)
- ✅ Phase 4 integration wrapper (140 LOC)
- ✅ 41/41 tests passing (82% coverage)
- ✅ GitHub Actions workflow integration
- ✅ Dry-run validation & audit logging

**Merged:** PR #2016 (commit f2b07bc9c)

**Status:** Ready for soft launch Sep 9, 2026

### Phase 5: Portable Agent Architecture ⏸️ DEFERRED

**Planned Implementation (Days 1-4)** → **Deferred to Phase 8**

**Rationale:** Phase 5A agentic workflows provide primary interface. Portable agents (Phase 5) remain optional for future multi-repo expansion. Soft launch Sep 9 prioritizes agentic workflows.

### Phase 6: WordPress Support ✅ COMPLETE

**Completed:** 2026-08-19

**Deliverables:**

- ✅ pluginHeader.js (plugin header parsing)
- ✅ themeCss.js (theme CSS version parsing)
- ✅ readmeTxt.js (readme.txt version parsing)
- ✅ 2,189 LOC, 75+ unit tests, 15+ integration tests
- ✅ >85% code coverage
- ✅ Full integration with release workflow

**Merged:** PR #2115 (commit 4e1a3dd2e)

**Status:** Production-ready, integrated with Phase 5A

### Phase 7: Documentation & Training ✅ COMPLETE

**Completed:** 2026-08-19

**Deliverables:**

**Documentation:**

- ✅ RELEASE_PROCESS.md v4.0 (600+ lines)
  - Complete flow diagrams (Mermaid)
  - Step-by-step guide
  - Troubleshooting section
  - 17+ FAQ items

- ✅ BRANCHING_STRATEGY.md enhancements
  - Develop-first release flow explanation
  - Stacked PR explanation
  - Agentic workflows integration

- ✅ RELEASE_WORDPRESS.md (new)
  - WordPress plugin release process
  - WordPress theme release process
  - Examples with before/after

- ✅ 4 Mermaid diagrams (workflow flows, gate architecture)

**Training Materials:**

- ✅ Team training guide (internal)
- ✅ Approval flow documentation
- ✅ Dry-run procedure documentation
- ✅ Troubleshooting guide

**Merged:** PR #2116 (commit b4fcdaa1c)

**Status:** Production-ready documentation, team training ready

---

## Architectural Decisions (Finalized)

### ADR-001: Release Flow (Develop-First) ✅

**Decision:** Release PRs target `develop` first, then `main`

**Rationale:** Develop is primary integration branch; two-stage validation; version consistency

**Implementation:** Stacked PRs (develop PR + main PR)

### ADR-002: Multi-Repo Support (Portable Agents) ⏸️ DEFERRED

**Decision:** Portable agents architecture planned for Phase 5 (deferred to Phase 8 for multi-repo expansion)

**Current Status:** Phase 5A agentic workflows provide primary interface; Phase 5 portable agents remain optional for future multi-repo support

**Rationale:** Agentic workflows (Phase 5A) deliver full release orchestration; portable agents planned as optional library for Phase 8+ multi-repo scenarios

### ADR-003: Authorization (Single Decision-Maker) ✅

**Decision:** Only authorized user (Ash) can trigger releases

**Rationale:** Clear governance; audit trail; security

### ADR-004: Error Handling (Fail-Fast + Rollback) ✅

**Decision:** Strict pre-release validation; automated rollback recovery

**Rationale:** Prevents bad releases; clear error messages; safe recovery

---

## Success Criteria

Release process redesign is successful when:

1. ✅ Release workflow and implementation are fully aligned
2. ✅ Documentation accurately describes actual workflow
3. ✅ All broken links and badges are fixed
4. ✅ Pre-release checklist is enforced by workflow
5. ✅ Authorization gating actually blocks unauthorized releases
6. ✅ Develop-first flow works (two stacked PRs)
7. ✅ Rollback automation is in place and tested
8. ✅ Developers can execute a complete release with one workflow trigger
9. ✅ Release process is auditable (logs, decision records)
10. ✅ Multi-repo support (control plane, plugins, themes)

---

## Communication Plan

- **Decisions:** Documented in ADRs + GitHub issues
- **Progress:** Updated in this README (daily)
- **Blockers:** Escalated to stakeholders immediately
- **Completion:** Announced to team + changelog entry

---

## Key Deliverables

### Phase 1-4: Completed ✅

- ✅ OPENSPEC_ANALYSIS_REPORT.md (47 tasks specified)
- ✅ QUESTIONNAIRE_PREPOPULATED.md (50 questions answered)
- ✅ AUDIT_REPORT.md (all issues traced to requirements)
- ✅ Updated release.yml (develop-first flow + stacked PRs) — PR #1656
- ✅ Updated release.agent.js (two-PR creation logic) — PR #1658
- ✅ Authorization gates enforced
- ✅ Mergify sequential configuration (batch_size: 1, max_parallel_checks: 1)
- ✅ CLAUDE.md v2.0 documentation

### Phase 5-7: Planned 🔄

- 🔄 PHASE_5_IMPLEMENTATION_PLAN.md (Portable agents)
- 🔄 PHASE_6_IMPLEMENTATION_PLAN.md (WordPress support)
- 🔄 PHASE_7_IMPLEMENTATION_PLAN.md (Documentation & training)
- 🔄 Portable agents (agents/release/, agents/changelog/)
- 🔄 Rewritten RELEASE_PROCESS.md (with flow diagrams)
- 🔄 Updated BRANCHING_STRATEGY.md
- 🔄 Created RELEASE_WORDPRESS.md
- 🔄 Training documentation (RELEASE_TRAINING.md, RELEASE_TROUBLESHOOTING.md)
- 🔄 Comprehensive testing & validation
- 🔄 Updated CHILD_ISSUES_TEMPLATES.md (CHILD-022 through CHILD-047)

---

## Files in This Project Folder

```
.github/projects/active/release-process-redesign-2026-08-05/
├── README.md (this file, updated 2026-08-08)
├── PROJECT_INDEX.md (navigation guide)
├── QUESTIONNAIRE.md (50-question requirements gathering)
├── QUESTIONNAIRE_PREPOPULATED.md (answered questionnaire)
├── ADDITIONAL_DOCS_AUDIT.md (audit of related docs)
├── OPENSPEC_ANALYSIS_REPORT.md (✅ COMPLETE specification)
├── OPENSPEC_SETUP.md (analysis methodology)
├── RFC_RELEASE_PROCESS_V2.md (request for comments + proposal)
├── AUDIT_REPORT.md (audit findings, all resolved)
├── MULTI_REPO_AGENT_STRATEGY.md (portable agents architecture)
├── QUESTIONNAIRE_ANSWERING_GUIDE.md (how to answer)
├── PHASE_2_IMPLEMENTATION_PLAN.md (Phase 2 tasks)
├── EPIC_PARENT_ISSUE.md (epic issue template)
├── CHILD_ISSUES_TEMPLATES.md (47 child issue templates)
└── DELIVERY_SUMMARY.txt (project overview)
```

---

## Implementation Branch

**Branch:** `docs/release-process-phase-4-implementation`  
**Status:** Active (created 2026-08-08)  
**Target:** Develop

---

## References

- **Specification:** [OPENSPEC_ANALYSIS_REPORT.md](./OPENSPEC_ANALYSIS_REPORT.md)
- **Current Release Process:** [RELEASE_PROCESS.md](../../../../docs/RELEASE_PROCESS.md)
- **Branching Strategy:** [BRANCHING_STRATEGY.md](../../../../docs/BRANCHING_STRATEGY.md)
- **ADRs:** See OPENSPEC_ANALYSIS_REPORT.md (ADR-001 through ADR-004)

---

*Project Created: 2026-08-05*  
*Phase 4 Started: 2026-08-08*  
*Status: IMPLEMENTATION IN PROGRESS*

## Related Projects

This project coordinates with:

1. **[Release Agentic Workflows (2026-08-11)](../release-agentic-workflows-2026-08-11/)**
   - **Status:** Phase 5A (NEW), runs in parallel with Phase 5
   - **What:** GitHub Agentic Workflows for release orchestration
   - **Relationship:** Augments Phase 4; uses Phase 5 portable agents (optional); provides LLM-driven UX

2. **[Release Workflow Authorization Fixes (2026-08-04)](../release-workflow-authorization-fixes/)**
   - **Status:** Fix complete; testing pending
   - **What:** Authorization gating for trigger-telemetry job
   - **Relationship:** Foundation for both Phase 5 portable agents and Phase 5A agentic workflows

---

## Project Completion Summary

**All Phases Complete & Merged (2026-08-19):**

✅ **Phases 1-4 (Aug 8-9):** Develop-first flow + authorization gating
✅ **Phase 5A (Aug 18):** Agentic workflows MVP (PR #2016)
✅ **Phase 6 (Aug 19):** WordPress utilities (PR #2115)
✅ **Phase 7 (Aug 19):** Documentation v4.0 (PR #2116)

**Total Deliverables:**

- 5 merged PRs (#1656, #1658, #2016, #2115, #2116)
- 4,400+ LOC of implementation code
- 200+ automated tests (85%+ coverage)
- 4 Mermaid diagrams
- 600+ lines of new documentation
- 17+ FAQ items

**Release Status:**

🚀 **PRODUCTION-READY** — Soft launch Sep 9, 2026

---

## Related Issues

This project is coordinated with:

- [#1733](https://github.com/lightspeedwp/.github/issues/1733) — Phase 2: Folder Structure & Linking

See [Linking Standard](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/reports-projects-restructuring-2026-08-11/LINKING_STANDARD.md) for linking patterns.
## Visual Workflow

```mermaid
flowchart TD
  A[Start Here] --> B[Read Scope and Prerequisites]
  B --> C[Run the Documented Workflow]
  C --> D[Validate with Repo Tooling]
  D --> E[Open PR or Hand-off]

  classDef start fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#1B5E20;
  classDef prep fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#0D47A1;
  classDef run fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px,color:#E65100;
  classDef gate fill:#F3E5F5,stroke:#6A1B9A,stroke-width:2px,color:#4A148C;
  classDef done fill:#E0F2F1,stroke:#00695C,stroke-width:2px,color:#004D40;

  class A start;
  class B prep;
  class C run;
  class D gate;
  class E done;
```
