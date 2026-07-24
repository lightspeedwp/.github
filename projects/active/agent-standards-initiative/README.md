---
name: Agent Standards Initiative
title: Multi-Provider Agent Standardization — Epic #1079
description: Organization-wide standardization of 16 AI agents to support Claude, GitHub Copilot, and OpenAI with consistent configurations, provider-specific tools/skills, and comprehensive documentation
status: in-progress
created: 2026-07-22
last_updated: 2026-07-24
version: 1.0.0
owners:
  - lightspeedwp/maintainers
epic: 1079
related_issues:
  - '#1087'
  - '#1104'
  - '#1105'
  - '#1106'
  - '#1197'
tags:
  - agents
  - multi-provider
  - standardization
  - claude
  - copilot
  - openai
---

# Agent Standards Initiative — Epic #1079

Organization-wide standardization of 16 AI agents to a unified multi-provider architecture supporting Claude, GitHub Copilot, and OpenAI platforms.

## Quick Facts

| Metric | Value |
|--------|-------|
| **Total Agents** | 16 |
| **Completed (Phase 1)** | 5 |
| **In Progress (Phase 2)** | 8 |
| **Remaining** | 3 |
| **Completion %** | 31% (5/16) |
| **Phases** | 3 (Planning → Standardization → Consolidation) |
| **Key Epic** | #1079 |

## Phase Status

### ✅ Phase 1: Foundation & Validation (COMPLETE)

- Created standardization checklist and validation framework
- Established multi-provider configuration patterns
- Implemented provider-specific tool/skill schemas
- Created validation hooks and CI integration
- **Completed:** 2026-07-22

### 🟡 Phase 2: Agent Standardization (IN PROGRESS — 62% complete)

- **Batch 1 (Complete ✅):** 5 agents standardized
  - playwright-testing-agent (PR #1108)
  - woo-config-agent (PR #1141)
  - prd-factory-planner-agent + prd-agent consolidated (PR #1196)
  
- **Batch 2-3 (In Progress 🟡):** 8 agents remaining
  - prd-factory-planner-agent — finalized Phase 2B (PR #1198)
  - 7 more agents queued for standardization
  
### ⏳ Phase 3: Skills Consolidation (PLANNED)

- Consolidate 368 shared skills across agents (70 active)
- Establish skill override system (Tier 0-3 governance)
- Create skill dependency maps
- Implement unified skill manifest validation

## Agent Inventory

### ✅ Standardized Agents (5)

1. **Playwright Testing Agent** — PR #1108
   - Status: ✅ Complete
   - Multi-provider support: Claude, Copilot, OpenAI
   - Skills: 55 documented

2. **WooCommerce Config Agent** — PR #1141
   - Status: ✅ Complete
   - Multi-provider support: Claude, Copilot, OpenAI
   - Skills: 45+ documented
   - Security: PCI DSS compliance

3. **PRD Factory Planner Agent** — PR #1198
   - Status: ✅ Complete
   - Multi-provider support: Claude, Copilot, OpenAI
   - Consolidated with PRD Agent (917 files)
   - Skills: 39 documented

4. **Tour Operator Config Agent** — Multi-provider ready
   - Status: ✅ Finalized in Phase 2B
   - Configuration verified

5. **Client Website Discovery Assistant** — Batch 1 audit complete
   - Status: ✅ Audit complete

### 🟡 In Progress (8)

- AI Readiness Estimator — Batch 1 audit complete, Phase 2 pending
- Website Content Strategist — Batch 1 audit complete, Phase 2 pending
- Website Scope Estimator — Batch 1 audit complete, Phase 2 pending
- Zendesk Support Agent — Batch 1 audit complete, Phase 2 pending
- Linear Advisor Agent — Queued for standardization
- PageSpeed Agent — Queued for standardization
- Proposal Desk Agent — Queued for standardization
- Harvest Analytical Agent — Queued for standardization

### ⏳ Remaining (3)

- Design Partner Agent
- AI Documentation Generator Agent
- 1 additional agent

## Key Deliverables

### Documentation

- ✅ Agent Standards Framework (docs/AGENT_STANDARDS.md)
- ✅ Multi-Provider Contract Specification (docs/MULTI_PROVIDER_AGENT_SPEC.md)
- ✅ Validation & Testing Guide (docs/VALIDATION_TESTING_GUIDE.md)
- ⏳ Provider-Specific Implementation Guides
- ⏳ Skills Consolidation Roadmap

### Tooling & Automation

- ✅ agent-spec-validator hook (lint agent metadata)
- ✅ multi-provider-consistency-checker hook (cross-provider validation)
- ✅ plugin-integrity-checker hook (plugin structure validation)
- ✅ agent-security-auditor hook (security guardrail validation)
- ✅ CI validation workflows
- ⏳ Automated skill dependency mapping
- ⏳ Provider-specific tool contract validation

### Code Artifacts

- ✅ Standardized AGENT.md templates (16 agents)
- ✅ Provider-specific configs (claude/, copilot/, openai/)
- ✅ Shared core-prompt.md files (provider-agnostic guidelines)
- ✅ Provider-specific tools/skills definitions
- ✅ Checksums validation (integrity verification)
- ⏳ Skill override system (Tier governance)
- ⏳ Unified skill manifest validation

## Related Projects

- [Phase 2B Skills Audit](./phase-2b-skills-audit/README.md) — Comprehensive audit of 368 skill directories
- [Workflows Consolidation](./workflows-consolidation-2026-q3/README.md) — CI/CD optimization
- [PRD Combined Agent](./prd-combined-agent/README.md) — Agent consolidation example

## GitHub Links

- **Epic:** [#1079 — Agent Standards Phase 2](https://github.com/lightspeedwp/.github/issues/1079)
- **Phase 1 Issues:** [#1087](https://github.com/lightspeedwp/.github/issues/1087), [#1104](https://github.com/lightspeedwp/.github/issues/1104), [#1105](https://github.com/lightspeedwp/.github/issues/1105), [#1106](https://github.com/lightspeedwp/.github/issues/1106)
- **Phase 2 Issues:** [#1094](https://github.com/lightspeedwp/.github/issues/1094), [#1095](https://github.com/lightspeedwp/.github/issues/1095)
- **Skills Audit:** [#1197](https://github.com/lightspeedwp/.github/issues/1197)

## Success Criteria

### Phase 1 (Complete ✅)

- ✅ Standardization framework documented
- ✅ Multi-provider contract defined
- ✅ Validation hooks implemented
- ✅ CI integration working

### Phase 2 (In Progress)

- ✅ 5 agents standardized
- ⏳ 8 more agents queued
- ⏳ All 16 agents with consistent structure
- ⏳ Comprehensive agent registry created

### Phase 3 (Planned)

- ⏳ 368 skills audited (123 → 70 active)
- ⏳ Skill override system implemented
- ⏳ Unified governance applied
- ⏳ Dependency maps created

## Timeline

| Phase | Timeline | Status | Effort |
|-------|----------|--------|--------|
| **Phase 1: Foundation** | Week 1-2 | ✅ Complete | 40h |
| **Phase 2A: PRD Agent** | Week 2-3 | ✅ Complete | 35h |
| **Phase 2B: Batch 1-3** | Week 3-5 | 🟡 In Progress | 60h |
| **Phase 2C: Remaining** | Week 6-8 | ⏳ Planned | 45h |
| **Phase 3: Skills** | Week 9-16 | ⏳ Planned | 80h |
| **Total** | 16 weeks | 🟡 31% | **260h** |

## Notes

- **Multi-Provider Contract:** Each agent must support Claude, GitHub Copilot, and OpenAI
- **Shared Skills:** Consolidation effort tracked separately in Phase 2B Skills Audit project
- **Validation:** All agents pass CI checks including schema, provider consistency, and security audits
- **Documentation:** Standards are documented in canonical instruction files (.github/instructions/)

---

**Project Lead:** Ash Shaw  
**Created:** 2026-07-22  
**Last Updated:** 2026-07-24  
**Effort:** 260 hours (3 phases, 16 weeks)  
**Status:** 🟡 In Progress (Phase 2 — 31% complete)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
