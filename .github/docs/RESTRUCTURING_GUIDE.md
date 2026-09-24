# Agent Structure Standardization & Skill Consolidation — Implementation Guide

**Spec**: [`.github/specs/014-agents-restructure-consolidate/spec.md`](../specs/014-agents-restructure-consolidate/spec.md)

**Timeline**: 30 days across 4 concurrent phases (P1 audit, P2-4 planning)

**Status**: Phase 1 (Setup) — In Progress

---

## Overview

This guide documents the systematic restructuring of all agents in `agents/` to follow a standardized folder structure, consolidate duplicate skills, and create machine-readable registries for governance and discovery.

### What This Achieves

- ✅ **Audits** all ~50 agents and ~1000+ skills for structure conformance and duplicates
- ✅ **Fixes** broken references from prior agent renames across CI workflows and scripts
- ✅ **Standardizes** agent folder structure to 7-item template (AGENT.md, CHANGELOG.md, package.json, README.md, skills/, tests/, config/)
- ✅ **Consolidates** duplicate skills and creates deduplication recommendations
- ✅ **Generates** machine-readable registries (agents/registry.json, skills/registry.json) with agentskills.io compliance tracking
- ✅ **Plans** agent-by-agent restructuring with dependencies, impacts, and migration timelines

### Why This Matters

1. **Governance**: Automated audit and validation ensure all agents conform to org standards
2. **Discovery**: Registries enable automation tools, agent discovery, and dependency analysis
3. **Maintenance**: Standardized structure reduces cognitive load and improves onboarding
4. **Compliance**: Skills registry tracks agentskills.io specification compliance

---

## Phased Approach (30 Days)

### Phase 1: Setup (Days 1–2) — Infrastructure Foundation

**Goal**: Initialize project structure, audit tooling, and documentation

**Deliverables**:

- Directory structure for validation scripts and reports
- Logging and reporting utilities
- Base configuration file
- Git hooks for registry freshness validation
- Documentation overview

**Tasks**: T001–T008

---

### Phase 2: Foundational (Days 2–5) — Blocking Prerequisites ⚠️ CRITICAL

**Goal**: Build core audit and analysis infrastructure that blocks ALL user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Deliverables**:

- Audit script core with error handling
- Reference type detection (JS imports, shell paths, workflows)
- File scanner for agent/skill enumeration
- Broken reference identification engine
- Audit report generator (per schema)
- Registry schema validator
- Deduplication detection engine (SHA-256 + cosine similarity @ 85%)
- Agent structure checker (7-component verification)
- npm scripts for all validation commands

**Tasks**: T009–T017

**Dependencies**: Phase 1 complete

---

### Phase 3: User Story 1 — Audit & Remediate Broken References (Days 3–8)

**Goal**: Identify and fix all broken references from agent renames

**Deliverables**:

- Reference type documentation
- Reference detection implementation (JS, shell, workflows)
- Broken reference audit report
- Auto-fix capability for identified references
- Verification script for fixes
- Integration tests (15+ test cases)
- Final broken reference report

**Tasks**: T018–T032

**Independent Test**: Run reference audit, identify broken refs, apply fixes, verify CI passes

**Dependencies**: Phase 2 complete

---

### Phase 4: User Story 2 — Standardize Agent Structure (Days 6–12)

**Goal**: All agents conform to 7-item folder structure template

**Deliverables**:

- Agent folder structure template
- Structure audit documentation
- Structure validation implementation
- Structure audit report
- Remediation recommendations for non-conformant agents
- CHANGELOG format requirements
- package.json requirements documentation
- Structure validation tests

**Tasks**: T033–T044

**Independent Test**: Audit agents, verify all 7 components present, document deviations

**Dependencies**: Phase 2 complete

---

### Phase 5: User Story 3 — Consolidate & Deduplicate Skills (Days 9–15)

**Goal**: Identify all duplicate/near-duplicate skills; create consolidation plan

**Deliverables**:

- Skills catalog scanner
- Skills naming convention documentation
- Category subdirectories created
- SHA-256 content hashing implementation
- Cosine similarity calculation (85% threshold)
- Deduplication audit report
- Exact duplicate identification
- Near-duplicate identification
- Consolidation recommendations
- Impact analysis per recommendation

**Tasks**: T045–T057

**Independent Test**: Run deduplication audit, identify duplicates with similarity scores

**Dependencies**: Phase 2 complete

---

### Phase 6: User Story 4 — Create Skills Registry (Days 12–18)

**Goal**: Generate machine-readable skills registry with agentskills.io compliance

**Deliverables**:

- Skills registry generator
- Skills scanner implementation
- agentskills.io compliance checker
- Consolidated skills registry (skills/registry.json)
- Per-category skills registries
- Registry schema validation
- Compliance validation report
- Registry format documentation

**Tasks**: T058–T069

**Independent Test**: Generate registry from filesystem, validate schema, check compliance

**Dependencies**: Phase 2 complete, Phase 5 complete (deduplication audit)

---

### Phase 7: User Story 5 — Create Agent Registry (Days 15–21)

**Goal**: Generate machine-readable agent registry with metadata and dependencies

**Deliverables**:

- Agent registry generator
- Agents scanner implementation
- Agent metadata extraction
- Consolidated agent registry (agents/registry.json)
- Per-agent registries
- Registry schema validation
- Dependency analyzer
- Circular dependency detection
- Skill dependency tracing
- Agent dependency graph visualization

**Tasks**: T070–T082

**Independent Test**: Generate registry, verify all agents discoverable, trace dependencies

**Dependencies**: Phase 2 complete

---

### Phase 8: User Story 6 — Plan Agent-by-Agent Restructuring (Days 18–25)

**Goal**: Create detailed restructuring plan per agent with priorities and impacts

**Deliverables**:

- Agent restructuring spec template
- Individual specs for each agent (in `.github/specs/015-agent-{name}-restructuring/`)
- Breaking change identification per agent
- Cross-reference mapping (dependent scripts/workflows)
- Testing strategy per agent
- Effort and timeline estimates
- Master restructuring plan with priorities
- Parallel execution plan
- Agent priority matrix

**Tasks**: T083–T093

**Independent Test**: Generate agent specs, verify no circular deps, validate all covered

**Dependencies**: Phase 2, 4, 6, 7 complete

---

### Phase 9: User Story 7 — Plan Script Migration (Days 22–30)

**Goal**: Plan migration of root scripts into agent folders with deprecation path

**Deliverables**:

- Scripts audit
- Script-to-agent mapping
- Dependencies documentation
- Migration plan with target agents, tests, deprecation timeline
- Deprecation notices
- Multi-agent script decomposition plan
- Migration roadmap and timeline
- Script migration process documentation

**Tasks**: T094–T102

**Independent Test**: Generate migration plan, verify all scripts mapped

**Dependencies**: Phase 2 complete, Phase 8 complete (agent specs generated)

---

### Phase 10: Polish & Cross-Cutting Concerns (Days 25–30)

**Goal**: Validation, documentation, and final reconciliation

**Deliverables**:

- Comprehensive RESTRUCTURING_GUIDE.md (this file, updated)
- FAQ document
- Consolidated metrics report
- Registry validation (final)
- Audit report validation
- Implementation validation checklist
- Phase 2 roadmap (linting, testing, docs, plugins, SpecKit)
- Migration guide for consuming repositories
- Final project status report

**Tasks**: T103–T111

**Dependencies**: All phases 1–9 complete

---

## Running the Audit

### Prerequisites

```bash
# Install dependencies
npm ci

# Verify Node version (>= 18.0.0)
node --version
```

### Phase 1: Setup

```bash
# Initialize directories and configuration
npm run setup:restructuring  # (to be implemented in Phase 1)

# Verify git hook is in place
ls -la .github/hooks/pre-commit-registry.sh
```

### Phase 2: Foundational (Execute in Order)

```bash
# Run foundational audit suite
npm run audit:all  # (to be implemented in Phase 2)

# Individual commands:
npm run audit:agents
npm run audit:structure
npm run audit:broken-refs
npm run audit:dedup
npm run audit:registry
npm run validate:compliance
```

### View Reports

All reports are saved to:

- **Audit Reports**: `agents/reports/`
- **Spec Reports**: `.github/specs/014-agents-restructure-consolidate/reports/`

Example:

```bash
cat agents/reports/broken-references-audit.json
cat agents/reports/structure-audit.json
cat agents/reports/deduplication-audit.json
```

---

## Key Decisions & Assumptions

1. **Skill Versioning**: Version-pinned copies only for conflicts (Option B) — identical versions share root skill
2. **Missing Dependencies**: Flag and block until resolved (Option A)
3. **Registry Format**: JSON in `agents/registry.json` and `agents/{agent}/registry.json` (Option A)
4. **Multi-Agent Scripts**: Decompose into agent-specific subscripts (Option B)
5. **Timeline**: 4 phases over 30 days with parallel work opportunities

**Assumptions**:

- Breaking changes for P1 stories are acceptable
- Registry generation will be fully automated
- All agents will use standardized structure post-Phase 4
- Skill versions can be pinned when necessary
- Testing will use framework appropriate to agent type

---

## Handling Errors & Edge Cases

### Circular Dependencies

- Detected during agent registry generation (Phase 7)
- Flagged as errors; agent restructuring blocked until resolved
- Manual review required to break cycle

### Missing Skill Dependencies

- Identified during compliance validation (Phase 6)
- Blocks agent registry generation and consolidation
- Added to compliance violation report with remediation steps

### Binary Files in Reference Detection

- Skipped during reference scanning (Phase 3)
- Documented in edge cases; manual review recommended
- Severity level: INFO (not blocking)

### Zero-State Scenario

- If repository has 0 agents before restructuring, audit runs successfully but reports 0 agents
- All registries generated as empty arrays
- No action needed; safe to proceed

### Registry Generation Rollback

- If registry generation produces incorrect output:
  1. Restore previous registry version: `git restore agents/registry.json`
  2. Re-run audit to identify issue: `npm run audit:registry`
  3. File issue with error details for debugging

---

## FAQs

**Q: Can user story phases run in parallel?**  
A: Yes! Phase 3–9 can run concurrently after Phase 2 is complete. 47 tasks marked [P] are parallelizable.

**Q: What if an agent has no skills?**  
A: Agent is still restructured; skills registry will show empty `skills: []` for that agent.

**Q: How long does a full audit run?**  
A: ~5 minutes for 50+ agents and 1000+ skills (performance goal in plan.md).

**Q: Can I run restructuring on a subset of agents?**  
A: Yes, but audit runs on all agents. Individual agent restructuring specs can be executed selectively.

**Q: What's the rollback strategy?**  
A: All changes are Git-tracked. Use `git revert` or `git reset` to undo. Registry changes can be rolled back independently.

---

## Next Steps

1. ✅ Phase 1 (Setup) — Infrastructure foundation
2. → **Phase 2 (Foundational)** — Core audit tooling (next)
3. Phase 3–9 (User Stories) — Parallel implementation
4. Phase 10 (Polish) — Final validation and documentation

---

**Last Updated**: 2026-09-18  
**Spec Branch**: `refactor/agents-restructure-consolidate`  
**Status**: Phase 1 — In Progress
