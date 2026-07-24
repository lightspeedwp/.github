---
name: Agent Standards Initiative — Implementation Notes
description: Technical implementation roadmap, standardization phases, and validation framework
created: 2026-07-22
last_updated: 2026-07-24
status: active
---

# Agent Standards Initiative — Implementation Notes

## Project Structure

### Phase 1: Foundation & Validation (COMPLETE ✅)

**Timeline:** 2026-07-15 to 2026-07-22  
**Status:** ✅ Complete  
**Effort:** 40 hours

#### Deliverables

1. ✅ **Standardization Checklist** — 12-phase framework for agent standardization
2. ✅ **Multi-Provider Contract** — Specification for Claude, Copilot, OpenAI support
3. ✅ **Provider-Specific Schemas** — JSON schemas for tools, skills, configurations
4. ✅ **Validation Hooks** — 4 hooks for CI/CD integration:
   - agent-spec-validator (lint agent metadata)
   - multi-provider-consistency-checker (cross-provider validation)
   - plugin-integrity-checker (plugin structure validation)
   - agent-security-auditor (security guardrails)
5. ✅ **CI Workflows** — Automated validation in GitHub Actions
6. ✅ **Documentation** — Canonical instruction files and guides

#### Key Artifacts

- ✅ `.github/instructions/agents.instructions.md` — Agent standardization guide
- ✅ `schema/multi-provider-agent.schema.json` — Agent spec schema
- ✅ `schema/provider-config.schema.json` — Provider config schema
- ✅ `hooks/agent-spec-validator.cjs` — Validation hook (+ tests)
- ✅ `hooks/multi-provider-consistency-checker.cjs` — Consistency check
- ✅ `.github/workflows/agent-validation.yml` — CI workflow

### Phase 2A: PRD Agent Standardization (COMPLETE ✅)

**Timeline:** 2026-07-22 to 2026-07-23  
**Status:** ✅ Complete  
**Effort:** 35 hours  
**PR:** #1199

#### Agent: PRD Factory Planner Agent

**Deliverables:**

1. ✅ **Complete AGENT.md** — Metadata, capabilities, skills documentation
2. ✅ **Provider Configs**
   - `claude/agent.md` + `claude/tools.json` (8 tools, extended thinking)
   - `copilot/agent.md` + `copilot/skills.yaml` (7 skills, GitHub integration)
   - `openai/agent.md` + `openai/tools.json` (8 functions, API calling)
   - `shared/core-prompt.md` (provider-agnostic, 7 phases)

3. ✅ **Skills Documentation** — 39 available skills with workflow patterns
4. ✅ **Checksums** — Regenerated for 932 files
5. ✅ **CI Validation** — All checks passing:
   - ✅ Markdown linting
   - ✅ YAML validation
   - ✅ Schema validation
   - ✅ Skill manifest validation

**Key Artifacts:**

- ✅ `agents/prd-factory-planner-agent/AGENT.md` (standardized)
- ✅ `agents/prd-factory-planner-agent/claude/` (provider-specific)
- ✅ `agents/prd-factory-planner-agent/copilot/skills.yaml` (new)
- ✅ `agents/prd-factory-planner-agent/checksums.sha256` (regenerated)

### Phase 2B: Batch 1-3 Standardization (IN PROGRESS 🟡)

**Timeline:** 2026-07-23 to 2026-08-06  
**Status:** 🟡 In Progress (31% complete)  
**Effort:** 60 hours (allocated)  
**Related Issues:** #1094, #1095, #1197, #1221

#### Batch 1: Agent Audit Complete ✅ (5 agents)

1. ✅ **Playwright Testing Agent** (PR #1108)
   - Multi-provider: Claude, Copilot, OpenAI
   - Skills: 55 documented
   - Validation: ✅ All passing

2. ✅ **WooCommerce Config Agent** (PR #1141)
   - Multi-provider: Claude, Copilot, OpenAI
   - Skills: 45+ documented
   - Security: ✅ PCI DSS compliance

3. ✅ **PRD Factory Planner Agent** (PR #1198)
   - Multi-provider: Claude, Copilot, OpenAI
   - Consolidated: prd-agent + prd-factory-planner-agent (917 files)
   - Skills: 39 documented
   - Validation: ✅ All passing

4. ✅ **Tour Operator Config Agent** (Phase 2B finalized)
   - Multi-provider ready

5. ✅ **Client Website Discovery Assistant** (Audit complete)

#### Batch 2-3: Queue (8 agents, 5 immediate)

**Batch 2 (Queued for standardization):**

1. 🟡 **AI Readiness Estimator**
   - Batch 1 audit ✅ complete
   - Phase 2 standardization pending

2. 🟡 **Website Content Strategist**
   - Batch 1 audit ✅ complete
   - Phase 2 standardization pending

3. 🟡 **Website Scope Estimator**
   - Batch 1 audit ✅ complete
   - Phase 2 standardization pending

4. 🟡 **Zendesk Support Agent**
   - Batch 1 audit ✅ complete
   - Phase 2 standardization pending

**Batch 3 (Additional agents):**

1. 🟡 **Linear Advisor Agent** — Queued
2. 🟡 **PageSpeed Agent** — Queued
3. 🟡 **Proposal Desk Agent** — Queued
4. 🟡 **Harvest Analytical Agent** — Queued
5. ⏳ **Design Partner Agent** — Planned
6. ⏳ **AI Documentation Generator** — Planned

#### Phase 2B Deliverables

1. ✅ **Skills Audit** (Batch 1 complete)
   - Inventory of 125 skills (Batch 1: 5 agents)
   - Tier classification (Tier 0-3)
   - Conflict matrix (13 conflicts identified)
   - Consolidation strategy drafted

2. ✅ **Audit Report** (#1197, #1221)
   - PHASE-2B-SKILLS-AUDIT.md
   - Detailed analysis and roadmap

3. 🟡 **Batch 2-3 Agent Standardization** (In Progress)
   - Expected completion: Week 5
   - 8 agents → standardized structure
   - All passing CI validation

4. ⏳ **Skills Consolidation Planning**
   - Phase B: Inventory & Planning
   - Dependency maps, architecture, roadmap

### Phase 2C: Skills Consolidation (PLANNED)

**Timeline:** 2026-08-07 to 2026-09-10  
**Status:** ⏳ Planned  
**Effort:** 80 hours (estimated)  
**Related Project:** agent-skills-standards-comprehensive

#### Objectives

1. **Consolidate Shared Skills**
   - Move 25-30 Tier 1 skills to root
   - Implement skill override system
   - Establish governance rules

2. **Standardize Skill Manifests**
   - Unified SKILL.md template
   - Provider-specific documentation
   - Dependency mapping

3. **Update All Agents**
   - Reference consolidated skills
   - Implement overrides where needed
   - Pass validation checks

#### Deliverables

1. ⏳ **Root Skills Library** (70 active skills)
   - Tier 0: 15 universal
   - Tier 1: 25-30 reusable
   - Tier 2-3: 20-25 agency/niche

2. ⏳ **Agent Skill Overrides** (per agent)
   - Override system structure
   - Override contracts (Tier 1)
   - Testing framework

3. ⏳ **Governance Documentation**
   - Tier-based rules
   - Override contracts
   - Maintenance procedures

4. ⏳ **CI/CD Validation**
   - Skill dependency validation
   - Override contract enforcement
   - Automated consistency checks

### Phase 3: Remaining Agents (PLANNED)

**Timeline:** 2026-09-11 onwards  
**Status:** ⏳ Planned  
**Effort:** 45 hours (estimated)

#### Agents (3 remaining)

1. ⏳ **Design Partner Agent**
2. ⏳ **AI Documentation Generator Agent**
3. ⏳ **1 additional agent**

#### Deliverables

1. ⏳ Complete standardization of remaining agents
2. ⏳ All 16 agents in production-ready state
3. ⏳ Comprehensive agent registry created
4. ⏳ Organization-wide standards established

## Implementation Pattern (12-Phase Checklist)

The standardization process follows a consistent 12-phase pattern:

### Phase 1: Audit

- [ ] Inventory agent structure
- [ ] Document existing configs
- [ ] List all skills/tools

### Phase 2: Plan

- [ ] Define target structure
- [ ] Identify provider mappings
- [ ] Plan tool/skill configs

### Phase 3: Structure

- [ ] Create folder structure
- [ ] Set up provider directories
- [ ] Create metadata files

### Phase 4: Core Prompt

- [ ] Write shared core-prompt.md
- [ ] Provider-agnostic guidelines
- [ ] Document behavior rules

### Phase 5: Claude Configuration

- [ ] Create claude/agent.md
- [ ] Define claude/tools.json
- [ ] Add input schemas

### Phase 6: Copilot Configuration

- [ ] Create copilot/agent.md
- [ ] Define copilot/skills.yaml
- [ ] Map to GitHub integration

### Phase 7: OpenAI Configuration

- [ ] Create openai/agent.md
- [ ] Define openai/tools.json (functions)
- [ ] Configure API calling

### Phase 8: Skills Documentation

- [ ] Inventory available skills
- [ ] Document skill workflows
- [ ] Map to capabilities

### Phase 9: AGENT.md

- [ ] Complete AGENT.md metadata
- [ ] Document capabilities
- [ ] Add provider matrix

### Phase 10: Security & Validation

- [ ] Add security guardrails
- [ ] Validate all schemas
- [ ] Run security audit

### Phase 11: Checksums

- [ ] Generate checksums.sha256
- [ ] Exclude temporary files
- [ ] Validate file integrity

### Phase 12: CI & Documentation

- [ ] Pass all CI checks
- [ ] Update documentation
- [ ] Verify compliance

## Validation Framework

### Agent-Spec Validator Hook

**Location:** `hooks/agent-spec-validator.cjs`  
**Purpose:** Lint AGENT.md metadata  
**Checks:**

- ✅ Metadata completeness (name, slug, version)
- ✅ Provider declarations (claude, copilot, openai)
- ✅ Capabilities array (non-empty)
- ✅ Skills section presence
- ✅ Workflow documentation
- ✅ Provider matrix table

### Multi-Provider Consistency Checker

**Location:** `hooks/multi-provider-consistency-checker.cjs`  
**Purpose:** Cross-provider configuration validation  
**Checks:**

- ✅ Provider directories exist (claude/, copilot/, openai/)
- ✅ Provider-specific config files present
- ✅ Input schema/skills.yaml consistency
- ✅ Tool/skill naming conventions
- ✅ Documentation completeness per provider

### Plugin Integrity Checker

**Location:** `hooks/plugin-integrity-checker.cjs`  
**Purpose:** Validate plugin structure  
**Checks:**

- ✅ Plugin manifest (PLUGIN_MANIFEST.json)
- ✅ Required files (README, LICENSE, MANIFEST)
- ✅ Provider bindings correct
- ✅ Skill references valid

### Agent Security Auditor

**Location:** `hooks/agent-security-auditor.cjs`  
**Purpose:** Security guardrails validation  
**Checks:**

- ✅ No hardcoded secrets/API keys
- ✅ Input validation patterns
- ✅ Output escaping rules
- ✅ Privilege check patterns
- ✅ Nonce/capability requirements

### CI Workflows

**Location:** `.github/workflows/agent-validation.yml`  
**Purpose:** Automated validation in CI/CD  
**Runs:**

- ✅ All validation hooks
- ✅ Schema validation (JSON, YAML)
- ✅ Markdown linting
- ✅ Skill manifest validation

## Key Metrics & KPIs

### Phase 1 (Complete ✅)

- ✅ 1 standardization framework created
- ✅ 1 multi-provider contract defined
- ✅ 4 validation hooks implemented
- ✅ 1 CI workflow created

### Phase 2A (Complete ✅)

- ✅ 1 agent standardized (PRD agent)
- ✅ 3 provider configs created
- ✅ 39 skills documented
- ✅ 932 files checksummed

### Phase 2B (In Progress 🟡)

- ✅ 5 agents audited
- ✅ 125 skills inventoried
- ✅ 13 conflicts identified
- 🟡 8 agents queued
- ⏳ Consolidation plan drafted

### Phase 2C (Planned ⏳)

- ⏳ 25-30 Tier 1 skills consolidated
- ⏳ Override system implemented
- ⏳ Governance rules enforced

### Phase 3 (Planned ⏳)

- ⏳ 3 remaining agents standardized
- ⏳ All 16 agents in production-ready state
- ⏳ Comprehensive agent registry

## Related Issues

### Epic

- **#1079** — Agent Standards Phase 2 (Parent epic for all work)

### Phase 1

- **#1087** — Multi-provider agent architecture
- **#1104** — Provider-specific configuration patterns
- **#1105** — Validation & testing framework
- **#1106** — CI/CD integration

### Phase 2A

- **#1094** — PRD Factory Planner standardization
- **#1095** — Agent skills audit (Phase 2B)

### Phase 2B

- **#1197** — Skills audit & refactoring plan
- **#1221** — Phase 2B audit completion

### Merged PRs

- **#1108** — Playwright Testing Agent (Phase 1)
- **#1141** — WooCommerce Config Agent (Phase 1)
- **#1199** — PRD Agent Phase 2A standardization
- **#1198** — Phase 2B agent finalization & skills audit

## Success Criteria

### Phase 1 ✅ Complete

- ✅ Framework established
- ✅ Validation tools built
- ✅ CI integration working
- ✅ Documentation ready

### Phase 2 🟡 In Progress

- ✅ 5 agents audited
- 🟡 Standardization in progress (3/16 complete)
- 🟡 Skills audit underway
- ⏳ Consolidation plan ready

### Phase 3 ⏳ Planned

- ⏳ All 16 agents standardized
- ⏳ Skills consolidated
- ⏳ Governance enforced
- ⏳ Registry complete

## Notes

- **Multi-Provider Contract:** Essential for supporting diverse development environments (Claude, Copilot, OpenAI)
- **Shared Skills:** Consolidation deferred to Phase 2C to avoid blocking agent standardization
- **Validation:** All agents pass CI checks including schema, provider consistency, and security audits
- **Documentation:** Standards documented in canonical instruction files for organization-wide consistency
- **Batching Strategy:** Agents processed in batches (1-3) to balance workload and enable parallel work

---

**Project Lead:** Ash Shaw  
**Created:** 2026-07-22  
**Last Updated:** 2026-07-24  
**Current Phase:** Phase 2B (Standardization — 31% complete)  
**Total Effort:** 260 hours (3 phases, 16 weeks)  
**Next Milestone:** Phase 2B Batch 2-3 completion (End of Week 5)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
