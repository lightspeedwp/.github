---
name: Agent Skills Standards — Comprehensive
title: Agent Skills Consolidation & Standardization Framework
description: Comprehensive standardization of 368 skill directories (123→70 active skills) across 16 agents with Tier-based governance, override system, and unified skill manifest validation
status: in-progress
created: 2026-07-24
last_updated: 2026-07-24
version: 1.0.0
owners:
  - lightspeedwp/maintainers
related_issues:
  - '#1197'
  - '#1221'
  - '#1079'
parent_project: agent-standards-initiative
tags:
  - skills
  - consolidation
  - governance
  - standardization
  - audit
---

# Agent Skills Standards — Comprehensive Framework

Comprehensive consolidation and standardization of 368 skill directories across 16 agents, establishing Tier-based governance (Tier 0-3), unified skill manifests, and dependency mapping.

## Quick Facts

| Metric | Value |
|--------|-------|
| **Total Skill Directories** | 368 |
| **Total Files** | 10,332 |
| **Root Skills** | 123 total (70 active, 53 deprecated) |
| **Agents Audited** | 5 (Batch 1 complete) |
| **Agents Remaining** | 11 (Batch 2-3 in progress) |
| **Conflicts Identified** | 13 (4 HIGH, 6 MEDIUM, 3 LOW) |
| **Consolidation Candidates** | 25-30 Tier 1 skills |
| **Effort Estimate** | 40-60 hours (4-5 weeks) |
| **Status** | Phase A (Audit) — 50% complete |

## Project Goals

1. **Audit & Inventory** — Complete skills audit for all 16 agents
2. **Classify & Tier** — Tier-based classification (Tier 0-3)
3. **Resolve Conflicts** — Address version/compatibility issues
4. **Consolidate** — Move shared skills to root, implement overrides
5. **Standardize** — Unified skill manifest format and validation
6. **Document** — Governance rules, override contracts, dependency maps

## Phase A: Audit & Evaluation (IN PROGRESS — 50% complete)

### Batch 1: Complete ✅ (5 agents audited)

- ✅ **AI Readiness Estimator** — 25 skills inventoried
- ✅ **Website Content Strategist** — 24 skills inventoried
- ✅ **Website Scope Estimator** — 22 skills inventoried
- ✅ **Zendesk Support Agent** — 26 skills inventoried
- ✅ **Client Website Discovery Assistant** — 28 skills inventoried
- **Total:** 125 skills documented

**Deliverables:**

- ✅ Skills inventory per agent
- ✅ Root skills classification (Tier 0-3)
- ✅ Conflict matrix (13 conflicts identified)
- ✅ Consolidation strategy outlined

### Batch 2-3: In Progress 🟡 (8 agents remaining)

- 🟡 **PRD Factory Planner Agent** — Audit in progress
- 🟡 **Tour Operator Config Agent** — Queued
- 🟡 **WooCommerce Config Agent** — Queued
- 🟡 **Design Partner Agent** — Queued
- 🟡 **AI Documentation Generator** — Queued
- 🟡 **Linear Advisor Agent** — Queued
- 🟡 **PageSpeed Agent** — Queued
- 🟡 **Proposal Desk Agent** — Queued
- 🟡 **Harvest Analytical Agent** — Queued (3 agents queued)

**Status:** Batch 2-3 audit expected completion: End of Week 2

## Phase B: Inventory & Planning (UPCOMING)

### Deliverables

1. **Skill Dependency Map**
   - Graph of skill usage across agents
   - Tier 1 consolidation candidates (used by 2+ agents)
   - Override patterns needed

2. **Architecture Plan**
   - Override system interface definition
   - Agent-local vs shared skill contract
   - Governance rules documentation

3. **Implementation Roadmap**
   - Per-phase consolidation tasks
   - Effort estimates (Phase C: 40-60h)
   - Risk mitigation strategies
   - Testing approach

## Phase C: Implementation & Rollout (PLANNED)

### Consolidation Strategy

#### Tier 0: Universal Skills (Cross-cutting utilities)

- **Rule:** No agent overrides allowed (use as-is)
- **Count:** ~15 skills
- **Priority:** Phase C1 (Week 1-2)

#### Tier 1: Reusable Domain Skills (2+ agents)

- **Rule:** Override contract enforced (maintain interface)
- **Count:** ~25-30 skills
- **Priority:** Phase C2 (Week 3-4)

#### Tier 2: Agency-Specific Skills

- **Rule:** May be archived or agent-local
- **Count:** ~25 skills
- **Priority:** Phase C3 (Week 5)

#### Tier 3: Niche/WordPress Skills

- **Rule:** Low priority, evaluate usage
- **Count:** ~10 skills
- **Priority:** Phase C4 (Week 6+)

### Consolidation Workflow

For each Tier 1 consolidation candidate:

1. ✅ Validate compatibility across agents
2. ✅ Create base implementation in root (if not exists)
3. ✅ Extract agent customizations to override layer
4. ✅ Update all agents to reference consolidated skill
5. ✅ Test thoroughly (no functionality loss)
6. ✅ Document override contract
7. ✅ Validate via CI/CD automation

## Audit Findings

### Root Skills Inventory

| Tier | Count | % | Status | Examples |
|------|-------|---|--------|----------|
| **Tier 0** | ~15 | 12% | 🟢 Active | Core utilities, helpers |
| **Tier 1** | ~30 | 24% | 🟡 Review | Figma, Google Drive integrations |
| **Tier 2** | ~25 | 20% | 🟡 Archive? | Agency workflows |
| **Tier 3** | ~10 | 8% | ⏳ Evaluate | WordPress plugins, niche |
| **Deprecated** | ~43 | 36% | ⏳ Remove | Old versions, unused |

### Major Issues Identified

1. **Manifest Accuracy Discrepancies** (HIGH)
   - PRD Agent: ±45 skills variance
   - Root manifest missing agent-attached skills
   - Impact: 80+ hours to resolve

2. **Absolute Paths Not Portable** (HIGH)
   - Many skills reference `/Users/*/...` or `/home/*/...`
   - Non-portable across environments
   - Impact: 40+ hours to convert to relative paths

3. **Inconsistent Skill Categorization** (MEDIUM)
   - 2-5 categories per agent
   - No standardized taxonomy
   - Impact: 20+ hours to unify

4. **Missing SKILL.md Entrypoints** (MEDIUM)
   - ~15-20 skills lack SKILL.md
   - Reduces discoverability
   - Impact: 15+ hours to create

5. **Redundant Skill Copies** (MEDIUM)
   - ~10-15 candidate duplicates
   - Same logic in multiple locations
   - Impact: 30+ hours to consolidate

## Conflict Resolution Matrix

| Conflict | Severity | Status | Agents | Resolution |
|----------|----------|--------|--------|------------|
| Figma 2023 vs 2026 | HIGH | 🟡 Assess | 3 agents | Version governance |
| AI Readiness variants | MEDIUM | 🟡 Assess | 2 agents | Generic + override |
| Design system dual | MEDIUM | 🟡 Assess | 2 agents | Single version |
| Skill naming inconsistent | LOW | 🟡 Assess | All | Standardize naming |
| Skill organization differs | LOW | 🟡 Assess | All | Unified taxonomy |
| Missing documentation | LOW | 🟡 Assess | 20+ | SKILL.md templates |

## Technical Implementation

### Skill Structure (Root)

```
skills/{skill-name}/
├── SKILL.md                    # Entrypoint & metadata
├── {provider}/
│   └── agent.md               # Provider-specific guide
└── docs/
    └── usage-guide.md         # Implementation guide
```

### Agent Override (Customization)

```
agents/{agent-slug}/skills/{skill-name}-override/
├── SKILL.md                    # Override specification
├── implementation/
│   └── custom-logic.js        # Custom logic
└── docs/
    └── customization-guide.md # Override guide
```

### Governance Rules

1. **Tier 0 Skills** — No overrides; mandatory for all agents
2. **Tier 1 Skills** — Override contract enforced; interface maintained
3. **Tier 2-3 Skills** — Agent-local or archived; no root reference

### CI/CD Validation

New validation rules required:

- ✅ Verify all agent skills reference root versions (if applicable)
- ✅ Check for orphaned skills (no agents using)
- ✅ Validate override contracts (interface compliance)
- ✅ Test skill resolution (root + override priority)
- ⏳ Automated dependency mapping
- ⏳ Conflict detection and reporting

## Success Metrics

### Quantitative

- ✅ Audit complete for all 16 agents
- ✅ 368 skills categorised into Tier 0-3
- ✅ 13 conflicts identified and prioritised
- ⏳ 25-30 Tier 1 skills consolidated to root
- ⏳ ~80 lines of duplication eliminated per skill
- ⏳ Override system tested and documented

### Qualitative

- ✅ Clear audit methodology established
- ⏳ Architecture plan for skill consolidation
- ⏳ Governance rules documented
- ⏳ Team confidence in skill standardization
- ⏳ Reduced maintenance burden for shared skills

## Related Issues & Documentation

### GitHub Issues

- **Phase B Planning:** [#1197](https://github.com/lightspeedwp/.github/issues/1197)
- **Phase 2B Audit:** [#1221](https://github.com/lightspeedwp/.github/issues/1221)
- **Agent Standards:** [#1079](https://github.com/lightspeedwp/.github/issues/1079)

### Audit Reports

- [PHASE-2B-SKILLS-AUDIT.md](../../../../PHASE-2B-SKILLS-AUDIT.md) — Root-level audit report
- [.github/reports/agents/SKILLS_AUDIT_2026-07-23.md](.github/reports/agents/SKILLS_AUDIT_2026-07-23.md) — Detailed analysis

### Project Documentation

- [IMPLEMENTATION_NOTES.md](./IMPLEMENTATION_NOTES.md) — Technical specifications
- [Phase 2B Audit Project](../phase-2b-skills-audit/README.md) — Related project

## Timeline

| Phase | Timeline | Status | Effort |
|-------|----------|--------|--------|
| **Phase A: Audit** | Week 1-2 | 🟡 50% | 20h |
| **Phase B: Planning** | Week 2-3 | ⏳ Upcoming | 15h |
| **Phase C: Implementation** | Week 4-8 | ⏳ Planned | 40-60h |
| **Total** | 8 weeks | 🟡 In Progress | **75-95h** |

## Notes

- **Batch 1 Complete:** 5 agents audited, inventory and conflict matrix ready
- **Batch 2-3 Upcoming:** 11 agents in queue for audit completion
- **Phase C Skills Consolidation:** Deferred to Phase 2C (post-Phase 2B)
- **Tier Governance:** Three-tier system with strict override contracts
- **Shared Skills:** 25-30 candidates for root consolidation

---

**Project Lead:** Ash Shaw  
**Created:** 2026-07-24  
**Last Updated:** 2026-07-24  
**Parent Epic:** #1079 (Agent Standards Initiative)  
**Related Issue:** #1197 (Skills Audit & Refactoring Plan)  
**Status:** 🟡 In Progress (Phase A — 50% audit complete)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
