---
file_type: planning-alignment
title: "Project Meta Sync Agent v2 — OpenSpec Alignment & Cross-Reference"
description: ""Master index showing how all planning documents align with OPENSPEC authority""
created_date: 2026-08-12
last_updated: "2026-08-25"
status: active
---

# OpenSpec Alignment & Cross-Reference Guide

This document ensures complete traceability: **OPENSPEC.md is the authority**; all other planning documents derive from and support it.

---

## Document Hierarchy

```
OPENSPEC.md (Authority)
    ├── Executive Summary (success criteria)
    ├── Problem Statement (root cause)
    ├── Solution Design (7 components)
    ├── Deliverables (scope)
    ├── Acceptance Criteria (40+ checkpoints)
    ├── Timeline & Dependencies
    └── Sign-Off

Supporting Documents (All trace to OPENSPEC):
    ├── OPENSPEC_FLESHED_OUT.md (Implementation spec + sign-off)
    ├── QUESTIONS.md (7 design Q&As)
    ├── DESIGN_DECISIONS.md (7 locked decisions)
    ├── INTEGRATION_GUIDE.md (Phase 3-4 & 5A integration)
    ├── VALIDATION_SCENARIOS.md (8 test scenarios)
    ├── OPENSPEC_IMPLEMENTATION_VALIDATION.md (Test specs + code)
    ├── IMPLEMENTATION_PLAN.md (4-5 day roadmap)
    └── TEST_MANIFEST.md (Testing roadmap & CI integration)
```

---

## Complete Alignment Map

### 1. OPENSPEC.md § Executive Summary → All Documents

| OpenSpec Success Criteria | Supporting Document | Section |
|---------------------------|-------------------|---------|
| Agent modernized & active | OPENSPEC_FLESHED_OUT.md | §2 (Implementation Spec) |
| v2.0 deployed to control plane | IMPLEMENTATION_PLAN.md | §1 (Timeline: Day 5) |
| Phase 3-4 workflows integrated | INTEGRATION_GUIDE.md | §1 (Phase 3-4 Integration) |
| Phase 5A ready (Release Agent) | INTEGRATION_GUIDE.md | §2 (Phase 5A Integration) |
| 80%+ test coverage | TEST_MANIFEST.md | §1 (Test Pyramid) |
| Complete documentation | IMPLEMENTATION_PLAN.md | §5 (Documentation: 3 files) |

---

### 2. OPENSPEC.md § Problem Statement → Design Decisions

**Problem:** Deprecated agent, no spec, unclear scope

| Problem Aspect | Design Decision | Rationale |
|----------------|-----------------|-----------|
| "Unclear agent scope" | #1: Thin Orchestrator | Clear, bounded, testable |
| "No label taxonomy integration" | #2: Tiered + Delegated | Scales, single source of truth |
| "Unclear workflow invocation" | #3: Prefer orchestrator | Consistent, transparent |
| "No error recovery" | #4: Graceful + Recovery | Robust, builds trust |
| "No Phase 5A readiness" | #5: Structured Result | Release Agent can act |
| "Unclear escalation" | #6: Handoff to Specialists | Clean separation |
| "No discovery strategy" | #7: Multi-channel | Users find organically |

**Supporting Document:** DESIGN_DECISIONS.md (7 decisions with rationale)

---

### 3. OPENSPEC.md § Solution Design (7 Components) → Implementation Documents

**Component 1: Agent Specification**

| OpenSpec Requirement | Implementation | Document |
|---------------------|-----------------|----------|
| Modernized spec | `.github/agents/project-meta-sync.agent.md` (v2.0) | IMPLEMENTATION_PLAN.md §2.1 |
| Clear scope | Thin orchestrator pattern | DESIGN_DECISIONS.md §1 |
| Phase 3-4 integration | Links to helper scripts | INTEGRATION_GUIDE.md §1 |

**Component 2: Agent Prompt**

| OpenSpec Requirement | Implementation | Document |
|---------------------|-----------------|----------|
| LLM instructions | `.github/agents/project-meta-sync-prompt.md` (250–300 lines) | IMPLEMENTATION_PLAN.md §2.2 |
| Label taxonomy | Tiered structure (Tier 1/2/3) | QUESTIONS.md §2 |
| Operational patterns | Audit → Diagnose → Options → Execute → Summarize | INTEGRATION_GUIDE.md §1.2 |
| Handoff triggers | Specialist escalation defined | DESIGN_DECISIONS.md §6 |

**Component 3: Orchestrator Integration**

| OpenSpec Requirement | Implementation | Document |
|---------------------|-----------------|----------|
| Thin orchestrator | Use `label-orchestrator.js` CLI | DESIGN_DECISIONS.md §3 |
| Helper scripts | Review, sync, stale-marking helpers | INTEGRATION_GUIDE.md §1.1 |
| Workflow invocation | Prefer orchestrator → GitHub Actions | DESIGN_DECISIONS.md §3 |

**Component 4: Phase 3-4 Integration**

| OpenSpec Requirement | Implementation | Document |
|---------------------|-----------------|----------|
| Helper scripts available | `review-meta-labels.cjs`, `sync-pr-labels.cjs`, `manage-stale-issues.cjs` | INTEGRATION_GUIDE.md §1.1 |
| Workflows available | `meta-labels-sync.yml`, `label-audit-report.yml` | INTEGRATION_GUIDE.md §1.1 |
| Operational patterns | Documented walkthroughs | INTEGRATION_GUIDE.md §1.2–1.3 |

**Component 5: Phase 5A Integration**

| OpenSpec Requirement | Implementation | Document |
|---------------------|-----------------|----------|
| Release validation contract | Structured validation result (Tier 1/2/3) | INTEGRATION_GUIDE.md §2.1 |
| Tier 1 blockers | Must pass (detailed list) | INTEGRATION_GUIDE.md §2.2 |
| Tier 2 warnings | Should pass (detailed list) | INTEGRATION_GUIDE.md §2.2 |
| Handoff to Release Agent | Clear trigger points | DESIGN_DECISIONS.md §6 |

**Component 6: Test Strategy**

| OpenSpec Requirement | Implementation | Document |
|---------------------|-----------------|----------|
| 80%+ coverage target | Test pyramid (60/20/10) | TEST_MANIFEST.md §1–2 |
| 100–130 tests | Unit/integration/E2E split | TEST_MANIFEST.md §2 |
| 8 validation scenarios | Core/advanced/error scenarios | VALIDATION_SCENARIOS.md |
| Test specifications | Code examples for all layers | OPENSPEC_IMPLEMENTATION_VALIDATION.md §4 |

**Component 7: Documentation**

| OpenSpec Requirement | Implementation | Document |
|---------------------|-----------------|----------|
| Agent spec modernized | `.github/agents/project-meta-sync.agent.md` (v2.0) | IMPLEMENTATION_PLAN.md §5.1 |
| Agent prompt documented | `.github/agents/project-meta-sync-prompt.md` | IMPLEMENTATION_PLAN.md §5.1 |
| Integration guide | `INTEGRATION_GUIDE.md` (405 lines) | IMPLEMENTATION_PLAN.md §5.2 |

---

### 4. OPENSPEC.md § Deliverables (§4) → Implementation Breakdown

**Deliverable A: Agent Spec (Modernized)**

```
File: .github/agents/project-meta-sync.agent.md
Status: active → v2.0 (in Phase 5B.2)
Lines: 200–250
Authority: OPENSPEC.md §4.1
References: DESIGN_DECISIONS.md (7 decisions), QUESTIONS.md (Q1)
Timeline: Phase 5B.2, Day 1
```

**Deliverable B: Agent Prompt (LLM Instructions)**

```
File: .github/agents/project-meta-sync-prompt.md
Lines: 250–300
Authority: OPENSPEC.md §4.2
Sections:
  - Role & Context (10 lines) → QUESTIONS.md §1
  - Core Workflows (30 lines) → INTEGRATION_GUIDE.md §1.2
  - Label Taxonomy (80 lines) → QUESTIONS.md §2
  - Project Fields (20 lines) → OPENSPEC.md §2 (problem statement)
  - Operational Patterns (40 lines) → DESIGN_DECISIONS.md §1
  - Handoff Triggers (30 lines) → DESIGN_DECISIONS.md §6
  - Commands & Error Handling (60+ lines) → VALIDATION_SCENARIOS.md §6–8
  - Example Conversations (50 lines) → VALIDATION_SCENARIOS.md §1–5
Timeline: Phase 5B.2, Day 1
```

**Deliverable C: npm Package (@lightspeedwp/metadata-agent)**

```
Package: @lightspeedwp/metadata-agent
Exports:
  - label-utils (validation, parsing, formatting)
  - audit (analysis engine)
  - sync (execution engine)
  - api-client (GitHub integration)
Authority: OPENSPEC.md §4.3
Timeline: Phase 5B.3–5B.4 (Days 2–3)
```

**Deliverable D: Portable Agent**

```
Location: agents/metadata-agent/
Extensions:
  - Base agent (shared npm package)
  - Control plane extension (.github/agents/project-meta-sync.agent.md)
  - WordPress theme extension (agents/metadata-agent/extensions/theme/)
  - WordPress block plugin extension (agents/metadata-agent/extensions/plugin/)
Authority: OPENSPEC.md §4.4
Timeline: Phase 5B.4 (Day 3)
```

**Deliverable E: Test Suite (100–130 tests)**

```
Unit: 60–80 tests
Integration: 20–26 tests
E2E: 10–13 tests
Coverage: 80%+ (all layers)
Authority: OPENSPEC.md §4.5, VALIDATION_SCENARIOS.md
Timeline: Phase 5B.2–5B.4 (Days 2–4)
```

**Deliverable F: Documentation (3 files)**

```
1. Agent spec update: .github/agents/project-meta-sync.agent.md (v2.0)
2. Agent prompt: .github/agents/project-meta-sync-prompt.md
3. Integration guide: docs/PROJECT_META_SYNC_AGENT_V2.md (or INTEGRATION_GUIDE.md deployed)
Authority: OPENSPEC.md §4.6
Timeline: Throughout Phase 5B.2–5B.5
```

---

### 5. OPENSPEC.md § Acceptance Criteria (§5) → Validation Mapping

**Every acceptance criterion maps to validation:**

| OpenSpec Criterion | Validation Method | Document | Scenario |
|------------------|------------------|----------|----------|
| Audit labels correctly | Integration test + Scenario 1 | VALIDATION_SCENARIOS.md §1 | Label Inconsistency Audit |
| Sync project fields | Integration test + Scenario 2 | VALIDATION_SCENARIOS.md §2 | Project Field Sync |
| Validate releases (Tier 1/2/3) | E2E test + Scenario 3 | VALIDATION_SCENARIOS.md §3 | Release Metadata Validation |
| Teach label taxonomy | Unit test + Scenario 4 | VALIDATION_SCENARIOS.md §4 | Label Taxonomy Discovery |
| Handoff to specialists | Unit test + Scenario 5 | VALIDATION_SCENARIOS.md §5 | Handoff Trigger |
| Handle API rate limits | Integration test + Error 1 | VALIDATION_SCENARIOS.md §6 | Error Recovery |
| Handle missing labels | Unit test + Error 2 | VALIDATION_SCENARIOS.md §7 | Label Validation |
| Handle ambiguous input | Unit test + Error 3 | VALIDATION_SCENARIOS.md §8 | User Clarification |
| 80%+ code coverage | Coverage report | TEST_MANIFEST.md §2 | Automated CI check |
| Sub-5-second response | Integration/E2E test | OPENSPEC_IMPLEMENTATION_VALIDATION.md §4 | Performance validation |
| Phase 3-4 integration | Integration test | INTEGRATION_GUIDE.md §1 | Orchestrator patterns |
| Phase 5A handoff ready | E2E test | INTEGRATION_GUIDE.md §2 | Release Agent contract |

---

### 6. OPENSPEC.md § Timeline → Implementation Plan

**OPENSPEC Timeline (§6):**

- Phase 5B.1: Analysis & Specification (Complete)
- Phase 5B.2–5B.5: Implementation (4–5 days)

**IMPLEMENTATION_PLAN.md Timeline:**

| Phase | What | Days | Authority |
|-------|------|------|-----------|
| 5B.2 | Agent spec + prompt rewrite | 1–2 | OPENSPEC §4.1–4.2 |
| 5B.3 | npm package + unit tests | 1 | OPENSPEC §4.3, §4.5 |
| 5B.4 | Portable agent + integration/E2E | 1 | OPENSPEC §4.4, §4.5 |
| 5B.5 | Documentation + QA | 1 | OPENSPEC §4.6 |

---

### 7. OPENSPEC.md § Dependencies → Active Project Links

**OpenSpec Dependencies:**

| Dependency | Status | Link | Impact |
|-----------|--------|------|--------|
| Phase 3-4 complete | ✅ Complete | [PR #1761](../../../pull/1761), [PR #1773](../../../pull/1773) | Unblocks 5B.2 |
| Issue #1680 epic | ✅ Open | [#1680](../../../issues/1680) | Parent epic |
| Phase 5A planning | ✅ Blocked on 5B | [.github/agents/release-agentic-workflows.agent.md](../.github/agents/release-agentic-workflows.agent.md) | Depends on agent spec |

---

### 8. OPENSPEC.md § Sign-Off → Approval Gates

**OpenSpec Sign-Off Section (§7):**

Three approval gates:

1. **Architecture Approval** (Design Decisions)
   - [ ] 7 design decisions approved
   - [ ] Trade-offs accepted
   - Document: DESIGN_DECISIONS.md
   - Approver: Tech lead

2. **Specification Approval** (OpenSpec Document)
   - [ ] Acceptance criteria clear
   - [ ] Deliverables scoped correctly
   - [ ] Timeline realistic
   - Document: OPENSPEC.md §5–6
   - Approver: Project manager

3. **Implementation Approval** (Fleshed Out Spec)
   - [ ] Test strategy complete
   - [ ] Integration points clear
   - [ ] Success metrics defined
   - Document: OPENSPEC_FLESHED_OUT.md
   - Approver: Implementation lead

---

## Quality Gates Checklist

**Before Phase 5B.2 Starts:**

- [ ] OPENSPEC.md approved by architecture
- [ ] DESIGN_DECISIONS.md approved by tech lead
- [ ] OPENSPEC_FLESHED_OUT.md approved by project manager
- [ ] All 7 design decisions locked in
- [ ] Phase 3-4 artifacts available (helper scripts, workflows)
- [ ] Test environment ready
- [ ] GitHub test repository configured
- [ ] CI/CD pipelines configured

**During Phase 5B.2–5B.5:**

- [ ] All code changes trace to OPENSPEC acceptance criteria
- [ ] All tests validate OPENSPEC requirements
- [ ] Design decisions honored in implementation
- [ ] Phase 3-4 integration confirmed working
- [ ] Phase 5A handoff contract implemented

**Before PR Merge:**

- [ ] 100% of OPENSPEC acceptance criteria met
- [ ] All 8 validation scenarios pass
- [ ] 80%+ code coverage achieved
- [ ] All CI checks green
- [ ] Code review approved
- [ ] Sign-off obtained from all three approvers

---

## Cross-Reference Quick Links

### By Document

| Document | Purpose | Traces To |
|----------|---------|-----------|
| OPENSPEC.md | Authority | All other docs |
| OPENSPEC_FLESHED_OUT.md | Implementation spec | OPENSPEC success criteria |
| QUESTIONS.md | Design Q&As | Design decisions |
| DESIGN_DECISIONS.md | 7 locked decisions | OPENSPEC solution design |
| INTEGRATION_GUIDE.md | Phase 3-4 & 5A | OPENSPEC §2 (problem) + §4 (deliverables) |
| VALIDATION_SCENARIOS.md | 8 test scenarios | OPENSPEC §5 (acceptance criteria) |
| OPENSPEC_IMPLEMENTATION_VALIDATION.md | Test specifications | VALIDATION_SCENARIOS.md + TEST_MANIFEST.md |
| IMPLEMENTATION_PLAN.md | 4–5 day roadmap | OPENSPEC §6 (timeline) |
| TEST_MANIFEST.md | Testing roadmap | OPENSPEC §5 (acceptance), TEST_MANIFEST |

### By Topic

**Agent Architecture**
→ DESIGN_DECISIONS.md §1–3, OPENSPEC.md §3 (Solution Design)

**Label Taxonomy**
→ QUESTIONS.md §2, INTEGRATION_GUIDE.md §1.2, VALIDATION_SCENARIOS.md §4

**Phase 3-4 Integration**
→ INTEGRATION_GUIDE.md §1, DESIGN_DECISIONS.md §3

**Phase 5A Integration**
→ INTEGRATION_GUIDE.md §2, DESIGN_DECISIONS.md §5–6

**Testing Strategy**
→ TEST_MANIFEST.md, OPENSPEC_IMPLEMENTATION_VALIDATION.md, VALIDATION_SCENARIOS.md

**Implementation Roadmap**
→ IMPLEMENTATION_PLAN.md, OPENSPEC_FLESHED_OUT.md §2

---

## Integrity Checks

**To verify alignment, run these checks:**

### 1. Acceptance Criteria Coverage

```bash
# All OPENSPEC.md §5 criteria appear in VALIDATION_SCENARIOS.md
grep -c "Acceptance Criteria" VALIDATION_SCENARIOS.md  # Should be 8+
```

### 2. Deliverables Traceability

```bash
# All OPENSPEC.md §4 deliverables in IMPLEMENTATION_PLAN.md
grep -c "Deliverable" IMPLEMENTATION_PLAN.md  # Should be 6+
```

### 3. Design Decision Traceability

```bash
# All DESIGN_DECISIONS.md decisions referenced in other docs
grep -r "Decision [1-7]:" .  # Should appear in IMPLEMENTATION_PLAN.md, agent prompt, etc.
```

### 4. Integration Point Coverage

```bash
# All Phase 3-4 + Phase 5A integration points documented
grep -c "Phase [34567]" INTEGRATION_GUIDE.md  # Should be comprehensive
```

---

## Final Sign-Off Template

```markdown
## Phase 5B.1 Planning Sign-Off

**Project:** Project Meta Sync Agent v2  
**OpenSpec Version:** 1.0  
**Date:** 2026-08-12

### Alignment Verification

- [ ] All OPENSPEC acceptance criteria (§5) → VALIDATION_SCENARIOS.md
- [ ] All OPENSPEC deliverables (§4) → IMPLEMENTATION_PLAN.md
- [ ] All OPENSPEC timeline (§6) → IMPLEMENTATION_PLAN.md §5 (timeline)
- [ ] All 7 design decisions → DESIGN_DECISIONS.md
- [ ] Phase 3-4 integration → INTEGRATION_GUIDE.md §1
- [ ] Phase 5A integration → INTEGRATION_GUIDE.md §2
- [ ] Test strategy → TEST_MANIFEST.md + OPENSPEC_IMPLEMENTATION_VALIDATION.md
- [ ] Documentation plan → IMPLEMENTATION_PLAN.md §5

### Approvals

**Architecture Lead:**
- [ ] Design decisions locked in
- [ ] Solution design complete
- Signature: ________________  Date: __________

**Project Manager:**
- [ ] Timeline realistic
- [ ] Scope approved
- Signature: ________________  Date: __________

**Implementation Lead:**
- [ ] Ready to start Phase 5B.2
- [ ] Test environment configured
- Signature: ________________  Date: __________

### Approval Status
**READY FOR PHASE 5B.2** / **BLOCKED (list issues below)**

Issues/Blockers:
[none]

---

Approved by: [names]  
Date: 2026-08-12
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
