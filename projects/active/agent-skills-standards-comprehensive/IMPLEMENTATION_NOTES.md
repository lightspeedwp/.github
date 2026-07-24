---
name: Agent Skills Standards — Implementation Notes
description: Technical implementation details, audit methodology, and consolidation strategy
created: 2026-07-24
status: active
---

# Agent Skills Standards — Implementation Notes

## Audit Documents & References

### Root Audit Report

**Location:** `PHASE-2B-SKILLS-AUDIT.md`  
**Purpose:** Comprehensive audit with detailed skills inventory and analysis  
**Status:** ✅ Complete (Batch 1), 🟡 In Progress (Batch 2-3)

### Audit Methodology

#### Phase A: Audit & Evaluation

**Step 1: Agent Skills Inventory**

For each agent, enumerate skills in `agents/{agent-slug}/skills/`:

1. Classify by type:
   - **Agent-attached:** Custom implementations in agent folder
   - **Local:** Built-in utilities (documents, reports, templates, export-tools)
   - **Plugin-provided:** External services (github, linear, zendesk, figma, google-drive)
   - **Platform-managed:** Extended capabilities (extended thinking, vision)

2. Document count and implementation details
3. Note any conflicts with root skills

**Step 2: Root Skills Classification**

For each item in `skills/`:

1. Assess portability and reusability
2. Classify into tier:
   - **Tier 0:** Cross-cutting utilities (mandatory for all)
   - **Tier 1:** Domain-specific reusable (2+ agents)
   - **Tier 2:** Agency-specific (low reuse)
   - **Tier 3:** WordPress/niche (evaluate)

3. Identify current version and agent-specific versions
4. Flag conflicts and version differences

**Step 3: Conflict Identification**

For each conflict:

1. Document root version details
2. Document agent-specific version(s)
3. Assess severity (HIGH/MEDIUM/LOW)
4. Recommend resolution strategy
5. Estimate effort for consolidation

#### Phase B: Inventory & Planning

**Deliverable 1: Skill Dependency Map**

- Create graph of skill usage across agents
- Identify Tier 1 consolidation candidates (2+ agents)
- Document override patterns needed

**Deliverable 2: Architecture Plan**

- Define override system interface
- Document agent-local vs shared skill contract
- Plan governance rules

**Deliverable 3: Implementation Roadmap**

- Per-phase consolidation tasks
- Effort estimates
- Risk mitigation strategies
- Testing approach

#### Phase C: Implementation & Rollout

For each consolidation candidate:

1. **Validate compatibility** across agents using skill
2. **Create base implementation** in root (if not exists)
3. **Extract agent customizations** to override layer
4. **Update all agents** to reference consolidated skill
5. **Test thoroughly** (no functionality loss)
6. **Document override contract** for maintainers
7. **Validate via CI/CD** automation

## Audit Statistics (Batch 1)

| Agent | Skills | Type Mix | Conflicts |
|-------|--------|----------|-----------|
| AI Readiness Estimator | 25 | 18A + 5L + 2P | 2 |
| Website Content Strategist | 24 | 16A + 6L + 2P | 1 |
| Website Scope Estimator | 22 | 15A + 5L + 2P | 2 |
| Zendesk Support Agent | 26 | 18A + 6L + 2P | 3 |
| Client Website Discovery | 28 | 20A + 6L + 2P | 5 |
| **Batch 1 Total** | **125** | **87A + 28L + 10P** | **13** |

**Legend:** A = Agent-attached, L = Local, P = Plugin-provided

## Root Skills Inventory (123 items)

### Tier 0: Universal (15 skills)

- Core utilities and helpers
- Required by all or most agents
- No overrides allowed
- Examples: text-helpers, markdown-utils, path-utils

### Tier 1: Reusable Domain (30 skills)

- Used by 2-5 agents
- Override contract enforced
- Examples:
  - figma-integration (AI Readiness, Design Partner)
  - google-drive-integration (Website Discovery, Content Strategist)
  - github-integration (Linear Advisor, Proposal Desk)

### Tier 2: Agency-Specific (25 skills)

- Used by single agent or internal workflows
- May be archived or retained locally
- Examples: lightspeed-specific workflows, custom templates

### Tier 3: Niche/WordPress (10 skills)

- WordPress-specific or low-use skills
- Evaluate for archival
- Examples: woocommerce-extensions, wordpress-hooks

### Deprecated (43 skills)

- Old versions (v1.0, v2023)
- Unused or superseded
- Candidates for archival

## Conflict Matrix (Batch 1)

### HIGH Severity (4 conflicts)

| Conflict | Agents | Issue | Resolution |
|----------|--------|-------|------------|
| Figma 2023 vs 2026 | 3 | Version incompatibility | Version governance |
| AI Readiness generic vs specialized | 2 | Feature overlap | Generic + override |
| Design system dual | 2 | Conflicting schemas | Single canonical |
| Absolute paths in manifests | All | Non-portable | Convert to relative |

### MEDIUM Severity (6 conflicts)

| Conflict | Agents | Issue | Resolution |
|----------|--------|-------|------------|
| Skill naming inconsistent | 5 | Different naming | Standardize naming |
| Category structure differs | 8 | No taxonomy | Unified taxonomy |
| Missing SKILL.md | 20+ | No entrypoints | Create templates |
| Version variance (±45 skills) | PRD Agent | Manifest inaccuracy | Audit manifests |
| Local implementation dupes | 3 | Code duplication | Consolidate |
| Documentation gaps | All | Unclear usage | Write guides |

### LOW Severity (3 conflicts)

| Conflict | Agents | Issue | Resolution |
|----------|--------|-------|------------|
| Metadata inconsistency | All | Different fields | Standardize format |
| Skill organization | All | Different structures | Align structure |
| Provider-specific variants | 2 | Multiple implementations | Document clearly |

## Technical Specifications

### Skill Consolidation Structure

#### Root Skill (Shared Base)

```
skills/{skill-name}/
├── SKILL.md
│   ├── name: {skill-name}
│   ├── version: X.Y.Z
│   ├── tier: 0-3
│   ├── agents: [list of agents using]
│   ├── providers: [claude, copilot, openai, ...]
│   ├── contract: {override contract if Tier 1}
│   └── documentation link
│
├── {provider}/
│   ├── agent.md (implementation guide)
│   └── example.json (usage example)
│
└── docs/
    ├── usage-guide.md
    ├── api-reference.md
    └── migration-guide.md
```

#### Agent Override (Customization)

```
agents/{agent-slug}/skills/{skill-name}-override/
├── SKILL.md
│   ├── base: skills/{skill-name}
│   ├── customization: [what's changed]
│   ├── compatibility: {version match}
│   └── testing: [tests for override]
│
├── implementation/
│   ├── custom-logic.js
│   ├── agent-config.yaml
│   └── __tests__/
│
└── docs/
    └── customization-guide.md
```

### Governance Rules

1. **Tier 0 Skills (Universal)**
   - No agent overrides allowed
   - All agents must use root version
   - CI validation enforces usage

2. **Tier 1 Skills (Reusable Domain)**
   - Override contract enforced
   - Override must maintain interface
   - Test compatibility across agents
   - Document override contract

3. **Tier 2-3 Skills (Agency/Niche)**
   - Retain as agent-local or archive
   - No root reference expected
   - Optional documentation

### CI/CD Validation Rules

New validation for CI/CD integration:

```javascript
// Verify all agent skills reference root versions (if applicable)
validateAgentSkillReferences() {
  // For each agent:
  // - Check if skill should reference root (Tier 0-1)
  // - Verify reference exists and is correct
  // - Report any orphaned or incorrect references
}

// Check for orphaned skills
detectOrphanedSkills() {
  // For each root skill:
  // - Count agents using it
  // - If count = 0, flag as orphaned
  // - Suggest archival
}

// Validate override contracts
validateOverrideContracts() {
  // For each Tier 1 override:
  // - Check contract compliance
  // - Verify interface maintained
  // - Run contract tests
}

// Test skill resolution
testSkillResolution() {
  // For each agent:
  // - Load root skill
  // - Load agent overrides
  // - Test resolution priority
  // - Verify functionality
}
```

## Key Metrics

### Audit Progress

- **Phase A Status:** 50% complete (Batch 1 ✅, Batch 2-3 in progress)
- **Skills Inventoried:** 125 / 368 (34%)
- **Conflicts Identified:** 13 (4H, 6M, 3L)
- **Consolidation Candidates:** 25-30 Tier 1 skills

### Consolidation Effort

- **Phase B (Planning):** 15 hours (Week 2-3)
- **Phase C (Implementation):** 40-60 hours (Week 4-8)
- **Total Effort:** 75-95 hours

### Expected Savings

- **Code Duplication Eliminated:** ~500-800 lines per Tier 1 skill
- **Maintenance Overhead:** 25% reduction
- **Skill Discovery:** Improved via standardized SKILL.md

## Related Resources

### Git References

- **Branch:** `feat/agents-phase-2b-skills-audit`
- **Parent PR:** #1221
- **Related PR:** #1198
- **Epic:** #1079

### Documentation Files

- `PHASE-2B-SKILLS-AUDIT.md` — Full audit report
- `.github/reports/agents/SKILLS_AUDIT_2026-07-23.md` — Detailed analysis
- `agents/*/AGENT.md` — Individual agent specifications
- `skills/*/SKILL.md` — Skill specifications

### Team References

- **Project Lead:** Ash Shaw (@ashleyshaw)
- **Epic Owner:** LightSpeed Team
- **Stakeholders:** Agent maintainers, platform team

## Implementation Checklist

### Batch 1 Audit (Complete ✅)

- ✅ Inventory 5 agents' skills
- ✅ Classify root skills (Tier 0-3)
- ✅ Identify initial conflicts
- ✅ Document in audit report

### Batch 2-3 Audit (In Progress 🟡)

- 🟡 Inventory remaining 11 agents
- 🟡 Document all conflicts
- 🟡 Finalize root skills classification
- ⏳ Create consolidation strategy

### Phase B Planning (Upcoming ⏳)

- ⏳ Create dependency map
- ⏳ Design override system
- ⏳ Document governance rules
- ⏳ Create per-agent roadmap

### Phase C Rollout (Future ⏳)

- ⏳ Tier 0 consolidation (Mandatory)
- ⏳ Tier 1 consolidation with overrides (Primary)
- ⏳ Tier 2-3 archival/integration (Secondary)
- ⏳ Validation and testing (Ongoing)

## Success Criteria

### Phase A (Audit) ✅ In Progress

- ✅ Clear methodology established
- ✅ Batch 1 audit complete
- ✅ Tier classification system working
- ✅ Conflict identification process proven
- 🟡 Batch 2-3 audit in progress
- 🟡 Complete conflict matrix

### Phase B (Planning) ⏳ Upcoming

- ⏳ Dependency map created
- ⏳ Architecture plan documented
- ⏳ Governance rules defined
- ⏳ Implementation roadmap ready

### Phase C (Implementation) ⏳ Future

- ⏳ Tier 0 consolidation complete
- ⏳ Tier 1 consolidation with overrides
- ⏳ All agents using consolidated skills
- ⏳ CI/CD validation passing
- ⏳ Documentation complete

---

**Last Updated:** 2026-07-24  
**Status:** Phase A (Audit) — 50% complete  
**Next Milestone:** Batch 2-3 completion (End of Week 2)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
