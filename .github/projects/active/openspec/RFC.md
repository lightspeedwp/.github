---
title: "OpenSpec Coordination RFC"
description: "Request for Comments: Establishing OpenSpec as the specification tracking system with GitHub issue coordination"
type: "rfc"
status: "draft"
created_date: "2026-08-11"
version: "1.0"
---

# OpenSpec Coordination RFC

## Overview

This RFC establishes **OpenSpec** as the canonical system for tracking and coordinating specification changes across the LightSpeed `.github` organization, with tight integration to GitHub issues for transparency and team coordination.

## What is OpenSpec?

OpenSpec is a **structured specification system** that captures the "why, what, and how" of significant changes:

```
spec/
├── change-name/
│   ├── proposal.md        # Why & what changes
│   ├── design.md          # Technical design & approach
│   ├── tasks.md           # Implementation tasks & checklist
│   └── specs/
│       └── component-name/
│           └── spec.md    # Formal specification document
└── .openspec.yaml         # Metadata & tracking
```

**Key Principle:** Every spec is tracked, versioned, and linked to GitHub issues so work is discoverable and coordinated.

---

## Problem Statement

### Current State

- Specification changes are scattered across:
  - GitHub issues (primary but lossy)
  - PR descriptions (implicit, temporary)
  - Project documentation (separate from specs)
  - Design documents (not formalized)

- **Gaps:**
  - No canonical "single source of truth" for specifications
  - Specs not linked to implementation issues
  - No structured review/approval process
  - Difficult to track spec evolution and decisions

### What We're Solving

- ✅ **Formalize** how we capture, review, and approve specs
- ✅ **Coordinate** specs with GitHub issues (bidirectional linking)
- ✅ **Track** evolution: proposal → design → implementation → completion
- ✅ **Enable** team transparency: everyone knows what's changing and why

---

## Active Specifications

### 1. Agent-Tool Permission Alignment

**Status:** 🟢 Active — Proposal phase  
**Purpose:** Establish canonical contract for agent tool access & permissions  
**Owner:** [TBD - Link to issue]

**What:**

- Define unified tool/permission contract in agent frontmatter
- Introduce profile tiers (standard, reviewer-only, planning-only, etc.)
- Add automated validation for all agent specs
- Add CI enforcement before merge

**Impact:** All `agents/*.agent.md`, `plugins/**/agents/*.agent.md` files must comply

**Related:**

- Proposal: `openspec/changes/agent-tool-permission-alignment/proposal.md`
- Design: `openspec/changes/agent-tool-permission-alignment/design.md`
- Tasks: `openspec/changes/agent-tool-permission-alignment/tasks.md`
- Spec: `openspec/changes/agent-tool-permission-alignment/specs/agent-tool-permission-contract/spec.md`

---

### 2. Test Coverage Implementation

**Status:** 🟢 Active — Planning phase  
**Purpose:** Expand test coverage to 80%+ with 62-task programme  
**Owner:** [TBD - Link to issue]

**What:**

- Expand test coverage from current baseline to 80%+
- Track 62 implementation tasks across 6 phases
- Create parent epic + 6 phase issues in GitHub
- Each phase issues maps to OpenSpec strict input file

**Timeline:** [6 phases mapped to GitHub issues]

**Related:**

- Source of Truth: `.github/projects/active/test-coverage-implementation/`
- Proposal: `openspec/changes/test-coverage-implementation/proposal.md`
- Design: `openspec/changes/test-coverage-implementation/design.md`
- Tasks: `openspec/changes/test-coverage-implementation/tasks.md`
- Spec: `openspec/changes/test-coverage-implementation/specs/coverage-programme-issue-chain/spec.md`

---

## Proposed Coordination Model

### OpenSpec ↔ GitHub Issue Linking

**Every spec shall have:**

1. **In OpenSpec proposal.md:**
   - Links to related GitHub issues (parent epic, phase issues)
   - Status badges (proposed/approved/implementing/complete)
   - Owner & stakeholders

2. **In GitHub issues:**
   - "Related Spec" comment linking back to OpenSpec proposal
   - Issue body references `.openspec.yaml` metadata
   - Phase-level issues linked to OpenSpec strict input files

**Example:**

**openspec/changes/agent-tool-permission-alignment/proposal.md:**

```markdown
## GitHub Coordination

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1234](../../../issues/1234) | epic | Coordinate agent-tool permission contract work | 🟢 Open |
| [#1235](../../../issues/1235) | task | Phase 1: Audit existing agent specs | 🟢 Open |
| [#1236](../../../issues/1236) | task | Phase 2: Design contract & tiers | ⏳ Planned |
```

**GitHub Issue #1234 (Epic):**

```markdown
## Related Spec

This epic coordinates the agent-tool permission contract specification.

**Spec:** openspec/changes/agent-tool-permission-alignment/

**Documents:**
- Proposal: [proposal.md](openspec/changes/agent-tool-permission-alignment/proposal.md)
- Design: [design.md](openspec/changes/agent-tool-permission-alignment/design.md)
- Formal Spec: [spec.md](openspec/changes/agent-tool-permission-alignment/specs/agent-tool-permission-contract/spec.md)
```

---

## Implementation Plan

### Phase 1: Establish Coordination Standard (This Session)

**Deliverables:**

- [x] RFC document (this file)
- [x] OpenSpec project folder created
- [ ] Coordination guidelines documented
- [ ] GitHub issues created for both active specs
- [ ] Links populated in proposal.md files

**Tasks:**

- [ ] Create GitHub issues for agent-tool-permission-alignment spec
  - Epic: Coordinate agent-tool permission contract work
  - Phase 1: Audit existing agent specs
  - Phase 2: Design contract & tiers
  - Phase 3: Implement validation & CI enforcement
  - Phase 4: Review & approve all agent specs

- [ ] Create GitHub issues for test-coverage-implementation spec
  - Epic: Expand test coverage to 80%+
  - Phase 1-6: One issue per phase (mapped to OpenSpec input files)

- [ ] Update proposal.md files with issue links
- [ ] Update GitHub issues with "Related Spec" comments

### Phase 2: Formalize Spec Review Process (Future)

**Goal:** Establish review & approval gates for specs before implementation

**Deliverables:**

- RFC review process (who approves, timeline)
- Approval tracking in `.openspec.yaml` metadata
- Automated validation for spec completeness

### Phase 3: Expand to Other Specs (Future)

**Goal:** Use OpenSpec for all major changes going forward

**Deliverables:**

- Template for new specs
- Process documentation for creating specs
- Integration into PR templates & CI validation

---

## Benefits

✅ **Transparency:** Everyone sees what's changing and why  
✅ **Coordination:** Issues link to specs, specs link to issues (bidirectional)  
✅ **Traceability:** Full audit trail of decisions, evolution, outcomes  
✅ **Governance:** Approval gates before implementation  
✅ **Discoverability:** Specs not lost in issue comments or PR descriptions  

---

## Open Questions (For Discussion)

1. **Spec Review Approval:** Who approves specs? (Product? Tech leads? Core team?)
2. **Timeline:** What's the timeline from proposal → approved → implementing?
3. **Scope:** Which specs go through OpenSpec vs. inline in issues?
4. **Automation:** Should CI enforce spec completeness (proposal + design + spec)?
5. **Versioning:** How do we handle spec revisions once approved?

---

## Success Criteria

✅ Both active specs have GitHub issues created  
✅ Bidirectional linking established (spec ↔ issue)  
✅ Coordination guidelines documented  
✅ Team understands OpenSpec role in change coordination  
✅ Process sustainable for future specs  

---

## Related Documents

- **README.md** — Project overview & operational notes
- **COORDINATION_PLAN.md** — Detailed execution plan for this RFC
- **Active Specs:**
  - `openspec/changes/agent-tool-permission-alignment/` — Agent permission contract
  - `openspec/changes/test-coverage-implementation/` — Test coverage expansion

---

## Approvals

| Role | Status | Date | Notes |
|------|--------|------|-------|
| Author (Ash Shaw) | ✏️ Draft | 2026-08-11 | RFC created, awaiting feedback |
| [Team Lead] | ⏳ Pending | - | - |
| [Architecture] | ⏳ Pending | - | - |

---

**RFC Status:** 📝 Draft (seeking feedback)  
**Target Approval Date:** 2026-08-17  
**Target Implementation:** 2026-08-18 onwards
