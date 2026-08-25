---
file_type: openspec
title: "Project Meta Sync Agent v2 — OpenSpec Specification"
description: ""Formal specification for modernizing the project-meta-sync agent to reflect current metadata governance workflows and integrate with Phase 3-4 and Phase 5A initiatives""
created_date: 2026-08-12
last_updated: "2026-08-25"
status: draft
---

# OpenSpec: Project Meta Sync Agent v2 Modernization

## 1. Executive Summary

**Project:** Project Meta Sync Agent v2 — Modernization & Integration  
**Phase:** 5B  
**Duration:** 5 days (2026-08-12 to 2026-08-16)  
**Status:** SPECIFICATION (DRAFT)  
**Owner:** Ash Shaw

### Purpose

Modernize the deprecated `project-meta-sync.agent.md` specification to reflect the current state of metadata governance workflows, create a comprehensive agent prompt for LLM-driven orchestration, and establish integration patterns that unify Phase 3-4 (Issue Maintenance Scripts) and Phase 5A (Release Agentic Workflows) work.

### Success Criteria

| Criterion | Metric | Owner |
|-----------|--------|-------|
| **Spec Quality** | Agent spec rewritten, status: active, v2.0 | Ash Shaw |
| **Prompt Completeness** | 250-300 line prompt with taxonomy, commands, patterns | Ash Shaw |
| **Integration Clarity** | Phase 3-4 & Phase 5A relationships documented & validated | Ash Shaw |
| **User Validation** | 3 core scenarios tested with agent prompt | Ash Shaw |
| **Process Quality** | PR merged to develop with clean history, issues linked | Ash Shaw |

---

## 2. Problem Statement

### Current Issues

1. **Deprecated Specification**
   - `project-meta-sync.agent.md` marked as "deprecated compatibility spec"
   - Spec says "active automation now lives in workflows and helper scripts"
   - But workflows/scripts lack unified agent guidance

2. **Fragmented User Experience**
   - 3 workflows exist (metadata-governance, meta-labels-sync, label-audit-report)
   - 5+ helper scripts exist (issue-pr-metadata, label-sync, derive-project-fields, etc.)
   - Users unclear on when/how to use each
   - No single entry point for guidance

3. **Blocked Phase 5A Work**
   - Release Agentic Workflows (Phase 5A) depends on metadata agent being ready
   - Release Agent needs to call Metadata Agent to validate metadata before release
   - Metadata Agent spec unclear, preventing Phase 5A from proceeding

4. **Inconsistent Infrastructure Messaging**
   - Phase 3-4 delivered label-orchestrator.js + documentation
   - Workflows reference orchestrator, but agent doesn't teach it
   - Gap between what infrastructure offers and what agent explains

### Root Cause

The `project-meta-sync` agent was marked deprecated but never replaced with an active spec. Meanwhile, the infrastructure around it evolved (Phase 3-4 issue maintenance scripts, Release Agentic Workflows initiative) without corresponding agent guidance updates.

### Scope

**In Scope:**

- Modernize agent spec (status: active, v2.0)
- Create comprehensive agent prompt (LLM instructions)
- Document integration with Phase 3-4 (Issue Maintenance Scripts)
- Document handoff to Phase 5A (Release Agentic Workflows)
- Validate with 3+ real scenarios

**Out of Scope:**

- Modifying workflows or scripts
- Releasing Phase 5A (Release Agentic Workflows)
- Redesigning label taxonomy
- Creating new helper scripts

---

## 3. Solution Design

### 3.1 Agent Architecture

**Agent Role:** Metadata Governance Orchestrator

```
┌─────────────────────────────────────────────┐
│   Project Meta Sync Agent v2                │
│   (LLM-driven orchestration layer)          │
└────────┬────────────────────────────────────┘
         │ Guides & orchestrates
         │
    ┌────┴────────────────────────────────────┐
    │                                         │
┌───▼──────────────────┐      ┌──────────────▼────┐
│ Workflows            │      │ Helper Scripts      │
│ • metadata-gov.      │      │ • label-orchestr.js│
│ • meta-labels-sync   │      │ • label-sync.js    │
│ • label-audit-report │      │ • derive-fields.cjs│
└──────────────────────┘      └─────────────────────┘
         │                            │
         └────────────┬───────────────┘
                      │
              ┌───────▼────────┐
              │  GitHub        │
              │  • Issues      │
              │  • PRs         │
              │  • Projects    │
              │  • Labels      │
              └────────────────┘
```

**Agent Responsibilities:**

1. **Orchestration** — Call workflows, scripts, and APIs in logical sequence
2. **Guidance** — Explain what's happening, why, and trade-offs
3. **Options** — Present 2-3 choices (auto, interactive, dry-run) for user to select
4. **Validation** — Check results match expectations; report outcomes
5. **Escalation** — Detect when request is out-of-scope; handoff to specialized agent

### 3.2 Core Workflows & Integration

**Active Workflows:**

| Workflow | Trigger | Agent Guidance |
|----------|---------|---|
| `metadata-governance.yml` | Issue/PR event | Runs automatically; explain results in comment |
| `meta-labels-sync.yml` | Daily schedule | Run audit; show daily report in agent |
| `label-audit-report.yml` | Monthly schedule | Show audit findings; recommend actions |

**Key Principle:** Agent doesn't invoke workflows directly. Instead, agent teaches users to use `label-orchestrator.js` CLI (unified entry point from Phase 3-4).

### 3.3 Label Taxonomy Presentation

**Tiered Approach:**

- **Tier 1 (Essential):** 3-5 core labels (type:*, status:*)
- **Tier 2 (Common):** area:*, priority:* based on context
- **Tier 3 (Advanced):** meta:* labels for specific workflows
- **Tier 4 (Full Reference):** Point to `.github/labels.yml` and docs

**Agent teaches discovery, not memorization:**

```markdown
# Agent Prompt Excerpt
You can explore labels via:
- Full taxonomy: docs/LABEL_STRATEGY.md
- Canonical source: .github/labels.yml
- CLI query: node scripts/automation/label-orchestrator.js --list-taxonomy
```

### 3.4 Error Handling Strategy

**Graceful degradation** for all error scenarios:

| Error | Detection | Recovery | Agent Says |
|-------|-----------|----------|---|
| API rate limit | HTTP 403 | Wait & retry | "Quota exceeded. Waiting 60s…" |
| Missing label | Not in labels.yml | Suggest alternative | "Did you mean `area:ci`?" |
| Missing field | GraphQL fail | Regenerate | "Regenerating project fields…" |
| Ambiguous input | Multiple matches | Ask user | "Which did you mean?" |
| Out of scope | Request type | Handoff | "That's Label Strategy. Calling specialist…" |

### 3.5 Phase 5A Integration (Release Metadata Validation)

**Release Agent workflow:**

```
Release Agent
  └─ "Validate metadata for release"
      └─ Metadata Agent (this spec)
          ├─ Check Tier 1 (blockers)
          ├─ Check Tier 2 (warnings)
          └─ Return { status, blockers, warnings, recommendation }
      └─ Release Agent makes go/no-go decision
```

**Metadata requirements by release type:**

- **Patch:** Tier 1 validation (blockers only)
- **Minor:** Tier 1 + Tier 2 (blockers + warnings)
- **Major:** Tier 1 + Tier 2 + full audit

---

## 4. Deliverables

### 4.1 Agent Specification

**File:** `.github/agents/project-meta-sync.agent.md`

**Changes:**

- [ ] Update frontmatter: `status: active`, `version: v2.0`
- [ ] Replace "deprecated" note with "modernized v2"
- [ ] Add section: "Workflows You Orchestrate" (3 workflows)
- [ ] Add section: "Helper Scripts You Use" (5+ scripts)
- [ ] Add section: "Label Taxonomy Reference" (tiered)
- [ ] Add section: "Handoff Patterns" (Release Agent, Label Strategy, etc.)
- [ ] Add section: "Phase 3-4 Integration"
- [ ] Add section: "Phase 5A Integration"

**Target:** 200-250 lines (concise but comprehensive)

### 4.2 Agent Prompt

**File:** `.github/agents/project-meta-sync-prompt.md`

**Sections:**

- [ ] Role & Context (10 lines)
- [ ] Core Workflows (30 lines)
- [ ] Label Taxonomy (80 lines)
- [ ] GitHub Project Fields (20 lines)
- [ ] Operational Patterns (40 lines)
- [ ] Handoff Triggers (30 lines)
- [ ] Commands You Can Execute (40 lines)
- [ ] Error Handling (30 lines)
- [ ] Example Conversations (50 lines)

**Target:** 250-300 lines (actionable, concrete, comprehensive)

### 4.3 Project Documentation

**File:** `.github/projects/active/project-meta-sync-agent-v2-2026-08-12/`

Files:

- [ ] `README.md` — Project overview, phased delivery, success criteria
- [ ] `QUESTIONS.md` — 7 design decisions with best practice answers
- [ ] `OPENSPEC.md` — This specification
- [ ] `INTEGRATION_GUIDE.md` — Phase 3-4 & 5A integration walkthroughs
- [ ] `VALIDATION_SCENARIOS.md` — Test cases & acceptance criteria
- [ ] `DESIGN_DECISIONS.md` — Architecture rationale & trade-offs

**Target:** 2000+ lines of project documentation (reference-quality)

### 4.4 PR Documentation

**Branch:** `feat/project-meta-sync-agent-v2-prompt`

**PR Title:** `feat: Project Meta Sync Agent v2 — Modernization & Integration (Phase 5B)`

**PR Body:**

```markdown
## Summary
Modernize the deprecated project-meta-sync agent to reflect current metadata governance 
infrastructure and integrate with Phase 3-4 (Issue Maintenance Scripts) and Phase 5A 
(Release Agentic Workflows).

## Changes
- [ ] Update `.github/agents/project-meta-sync.agent.md` (status: active, v2.0)
- [ ] Create `.github/agents/project-meta-sync-prompt.md` (250-300 lines)
- [ ] Add project folder: `.github/projects/active/project-meta-sync-agent-v2-2026-08-12/`
- [ ] 5+ supporting docs (OPENSPEC, QUESTIONS, INTEGRATION_GUIDE, etc.)

## Related Issues
- Resolves #1680 (Issue Metadata Triage Expansion — this is Phase 5B)
- Builds on #1761 (Phase 3 Workflows, meta-labels-sync.yml)
- Builds on #1773 (Phase 4 Documentation)
- Enables #XXXX (Phase 5A Release Agentic Workflows)

## Test Plan
- Validated core scenarios: label sync, project fields, release prep
- Error handling tested: API limits, missing labels, ambiguous input
- Handoff patterns tested: Release Agent, Label Strategy Agent
```

---

## 5. Acceptance Criteria

### Agent Specification

- [ ] Spec clearly states agent is ACTIVE (not deprecated)
- [ ] Version updated to v2.0
- [ ] Spec references all 3 active workflows
- [ ] Spec references label-orchestrator.js as entry point
- [ ] Label taxonomy is present (tiered approach)
- [ ] Error handling patterns documented
- [ ] Phase 5A integration documented
- [ ] No circular dependencies (spec doesn't reference things that don't exist)

### Agent Prompt

- [ ] LLM instructions are clear and unambiguous
- [ ] All core workflows are explained
- [ ] Label taxonomy is comprehensive (50+ labels) yet readable
- [ ] GitHub Project fields mapping is correct
- [ ] Operational patterns match real-world use cases
- [ ] Handoff triggers are well-defined
- [ ] Error handling is graceful for all common scenarios
- [ ] Example conversations work end-to-end

### Project Documentation

- [ ] QUESTIONS.md has 7 Q&A pairs with best practice answers
- [ ] OPENSPEC.md is self-contained and detailed
- [ ] INTEGRATION_GUIDE.md has 5+ real-world walkthroughs
- [ ] VALIDATION_SCENARIOS.md has acceptance criteria for each scenario
- [ ] DESIGN_DECISIONS.md explains architecture trade-offs
- [ ] All docs follow org conventions (frontmatter, Markdown, etc.)

### Process Quality

- [ ] Git history is clean (no merge commits on feat branch)
- [ ] All files follow org naming/structure conventions
- [ ] PR links to related issues (#1680, #1761, #1773)
- [ ] Commit messages are clear and reference the phase/epic
- [ ] No changes to package.json or package-lock.json (per user request)
- [ ] PR reviewed and merged to develop

---

## 6. Timeline & Phased Delivery

| Phase | Duration | Component | Status |
|-------|----------|-----------|--------|
| **5B.1** | 1 day | Analysis, Design, QUESTIONS | 🟢 DONE (2026-08-12) |
| **5B.2** | 2 days | Agent Spec & Prompt | 📋 IN PROGRESS |
| **5B.3** | 1 day | Integration Guide, DESIGN_DECISIONS | 📋 PLANNED |
| **5B.4** | 1 day | Validation Scenarios, Testing | 📋 PLANNED |
| **5B.5** | 1 day | PR, Review, Merge | 📋 PLANNED |
| **TOTAL** | 5 days | All deliverables | 📋 2026-08-16 |

---

## 7. Dependencies & Relationships

### Depends On

- ✅ Phase 3-4 (Issue Maintenance Scripts) — COMPLETE
  - label-orchestrator.js (released in Phase 4)
  - Documentation (ISSUE_MAINTENANCE_SCRIPTS.md, LABEL_MANAGEMENT_CLI.md)
- ✅ Release Process Redesign Phase 1-4 — COMPLETE
  - Workflows, scripts, utilities exist
- ⏳ Phase 5A (Release Agentic Workflows) — PLANNING
  - Needs this spec to be active before Phase 5A can start

### Blocks

- ⏳ Phase 5A (Release Agentic Workflows)
  - Release Agent needs Metadata Agent to validate metadata before release
  - This spec unblocks Phase 5A

### Related Projects

- [Issue Maintenance Scripts](../issue-maintenance-scripts-2026-08-10/) — Phase 3-4
- [Release Agentic Workflows](../release-agentic-workflows-2026-08-11/) — Phase 5A
- [Release Process Redesign](../release-process-redesign-2026-08-05/) — Phase 1-4

---

## 8. Success Metrics

### Specification Quality

- [ ] No ambiguous language (acceptance criteria clear)
- [ ] All referenced files/scripts exist and are active
- [ ] No circular dependencies or forward references
- [ ] Consistent with AGENTS.md governance standards

### Integration Quality

- [ ] Phase 3-4 relationships clear (orchestrator, CLI, docs)
- [ ] Phase 5A handoff contract documented (validation result format)
- [ ] All error scenarios have defined recovery paths
- [ ] User journey is clear (audit → diagnose → options → execute → summarize)

### Documentation Quality

- [ ] OPENSPEC is self-contained (can understand project without reading code)
- [ ] QUESTIONS has concrete answers (not wishy-washy)
- [ ] INTEGRATION_GUIDE has working examples
- [ ] VALIDATION_SCENARIOS have measurable acceptance criteria

### User Validation

- [ ] Core scenario 1: "My labels are inconsistent" — works end-to-end
- [ ] Core scenario 2: "How do I sync project fields?" — works end-to-end
- [ ] Core scenario 3: "Help me prepare for release" — works end-to-end
- [ ] Advanced scenario: Handoff to Label Strategy Agent — works smoothly

---

## 9. References & Related Materials

### Project Assets

- Phase 3-4 Deliverables: [Issue Maintenance Scripts](../issue-maintenance-scripts-2026-08-10/)
- Phase 5A Planning: [Release Agentic Workflows](../release-agentic-workflows-2026-08-11/)
- Current Agent Spec: `.github/agents/project-meta-sync.agent.md`

### Code Assets

- Workflows: `.github/workflows/metadata-governance.yml`, `meta-labels-sync.yml`, `label-audit-report.yml`
- Scripts: `scripts/agents/includes/issue-pr-metadata.cjs`, `label-sync.js`, `derive-project-fields.cjs`
- Orchestrator: `scripts/automation/label-orchestrator.js` (Phase 4 deliverable)
- Labels: `.github/labels.yml` (canonical source)

### Documentation

- `docs/ISSUE_MAINTENANCE_SCRIPTS.md` (Phase 3-4)
- `docs/LABEL_MANAGEMENT_CLI.md` (Phase 3-4)
- `docs/LABEL_STRATEGY.md` (Canonical label taxonomy)
- `AGENTS.md` (Organization-wide agent governance)

### Governance

- Branch naming: `feat/project-meta-sync-agent-v2-prompt`
- PR template: `pr_feature.md`
- Related epic: #1680 (Issue Metadata Triage Expansion)

---

## 10. Sign-Off

**Specification Author:** Ash Shaw  
**Created:** 2026-08-12  
**Status:** DRAFT (awaiting implementation)  
**Next Review:** Upon Phase 5B.2 completion (agent spec & prompt)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
