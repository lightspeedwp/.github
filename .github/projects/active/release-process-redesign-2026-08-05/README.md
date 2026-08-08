---
file_type: markdown
title: "Release Process Redesign Project"
description: "Complete audit, redesign, and implementation of release workflow, documentation, and governance"
status: active
version: "1.0"
last_updated: "2026-08-08"
owners: ["Ash Shaw"]
tags: ["release", "automation", "documentation", "project"]
stability: stable
domain: "Release Engineering"
---

# Release Process Redesign Project

## Project Overview

**Objective:** Audit, redesign, and implement a complete release process that aligns workflow implementation with documentation, clarifies governance, and establishes clear automation for versioning, changelog management, release tagging, and GitHub Releases.

**Scope:** Release workflows (.github/workflows/release.yml, changelog-management.yml), release agents (scripts/agents/release.agent.js), related documentation (RELEASE_PROCESS.md, BRANCHING_STRATEGY.md, CHANGELOG_AUTOMATION.md, VERSIONING.md), and integration with broader governance systems.

**Duration:** 2-3 sprints (estimated 20-30 days)

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

### Phase 4: Implementation & Testing 🔄 IN PROGRESS

**Current:** Implementing Phase 4 core tasks

**Implementation Tasks (18 days):**

- [ ] CHILD-020: Update release.yml for develop-first flow + stacked PRs
- [ ] CHILD-021: Modify release.agent.js for two-PR creation logic
- [ ] CHILD-022: Create rollback.cjs automation script
- [ ] CHILD-023: Build portable release agent (agents/release/)
- [ ] CHILD-024: Build changelog agent (agents/changelog/)
- [ ] CHILD-025/026: WordPress support (plugin headers, theme CSS, readme.txt)
- [ ] CHILD-027 through CHILD-032: Documentation rewrite (RELEASE_PROCESS.md, diagrams, guides)

**Status:** Phase 4 implementation commencing (2026-08-08)

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

## Implementation Plan (Phase 4)

### Critical Implementation Tasks

**Priority 1: Workflow Refactoring (Days 1-3)**

- [ ] CHILD-020: Update `.github/workflows/release.yml`
  - Implement develop-first flow (PR to develop, then main)
  - Add stacked PR creation logic
  - Enforce pre-release checklist validation
  - Update authorization gates

- [ ] CHILD-021: Modify `scripts/agents/release.agent.js`
  - Implement two-PR creation logic
  - Update PR targeting: develop → main
  - Add version file multi-repo detection
  - Integrate changelog validation

- [ ] CHILD-022: Create `scripts/workflows/release/rollback.cjs`
  - Delete git tags (local + remote)
  - Revert VERSION, CHANGELOG.md
  - Delete GitHub Release
  - Audit trail logging

**Priority 2: Portable Agent Architecture (Days 4-7)**

- [ ] CHILD-023: Build `agents/release/` (portable agent)
  - Create agent structure with includes/
  - Move versionManager.cjs, gitOps.cjs, githubOps.cjs
  - Implement repo-type detection
  - Multi-repo version file support

- [ ] CHILD-024: Build `agents/changelog/` (changelog agent)
  - Move changelog utilities
  - Implement changelog validation & formatting

**Priority 3: WordPress Support (Days 8-9)**

- [ ] CHILD-025/026: WordPress utilities
  - Create wordpressUtils.cjs
  - Handle plugin headers (Version:)
  - Handle theme CSS headers (Version:)
  - Handle readme.txt (Stable tag:)

**Priority 4: Documentation (Days 10-13)**

- [ ] CHILD-027 through CHILD-032
  - Rewrite RELEASE_PROCESS.md (with flow diagrams)
  - Update BRANCHING_STRATEGY.md
  - Create RELEASE_WORDPRESS.md
  - Fix all broken badges
  - Add CI validation for doc/code drift

**Priority 5: Testing & Validation (Days 14-18)**

- [ ] CHILD-040 through CHILD-047
  - Test all repo types (control plane, plugins, themes)
  - Test rollback procedure
  - Test authorization gates
  - Team training & documentation

---

## Architectural Decisions (Finalized)

### ADR-001: Release Flow (Develop-First) ✅

**Decision:** Release PRs target `develop` first, then `main`

**Rationale:** Develop is primary integration branch; two-stage validation; version consistency

**Implementation:** Stacked PRs (develop PR + main PR)

### ADR-002: Multi-Repo Support (Portable Agents) ✅

**Decision:** Create portable release agents in `agents/release/`

**Rationale:** Single agent for all repo types; consistent process; reusable

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

- ✅ OPENSPEC_ANALYSIS_REPORT.md (47 tasks, 18-23 day timeline)
- ✅ QUESTIONNAIRE_PREPOPULATED.md (50 questions answered)
- ✅ AUDIT_REPORT.md (all issues traced to requirements)
- 🔄 Updated release.yml (develop-first flow + stacked PRs)
- 🔄 Updated release.agent.js (two-PR creation logic)
- 🔄 Portable agents (agents/release/, agents/changelog/)
- 🔄 Updated RELEASE_PROCESS.md (with flow diagrams)
- 🔄 Comprehensive testing & validation

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
