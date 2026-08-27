---
file_type: documentation
title: "Phase 2B Phase B - Skills Consolidation Planning & Architecture"
description: "Strategic planning, architectural decisions, and implementation roadmap for Phase C skill consolidation"
last_updated: "2026-08-25"
status: active
---

# Phase 2B Phase B — Skills Consolidation Planning & Architecture

## Executive Summary

This document consolidates Phase A audit findings into a strategic plan for Phase C implementation. Phase A identified 377 skills across 16 agents with significant consolidation opportunities. Phase B establishes:

1. **Skill Dependency Map** — visual relationship of agents & reuse patterns
2. **Architecture Plan** — decisions on Tier 0/1/2/3 organization and override system
3. **Implementation Roadmap** — sequenced tasks for Phase C (weeks 5-12)

## Status Update (2026-07-29)

- Phase C execution issue hygiene pass completed for issues #1326-#1355.
- Titles now map to canonical task codes (W5-2 through W12-1) and use descriptive naming.
- Bodies now follow task template conventions, including Definition of Ready (DoR) and Definition of Done (DoD).
- Status labels updated to `status:ready` across the remediated issue set.

---

## I. SKILL DEPENDENCY MAP

### A. Consolidated Skills Inventory (377 total)

| Category | Count | Phase A | Phase B-3 | Notes |
|----------|-------|---------|----------|-------|
| **Agent-Attached** | 192 | 84 | 108 | Domain-specific, high-value skills |
| **Local Utilities** | 78 | 16 | 62 | Consolidation candidates (Tier 0) |
| **Plugin-Provided** | 72 | 20 | 52 | External integrations (GitHub, Linear, Figma) |
| **Directory-Installed** | 10 | — | 10 | Pre-built modules (documents, pdf, etc.) |
| **Platform-Managed** | 25 | 5 | 20 | System utilities (imagegen, openai-docs, builtins) |
| **TOTAL** | **377** | **125** | **252** | 16 agents audited ✓ |

### B. Agent-Level Consolidation Potential

#### **Large Agents (30+ skills)** — High Reuse Opportunity

| Agent | Total | Agent-Attached | Local Utilities | Plugin | Consolidation Priority |
|-------|-------|-----------------|-----------------|--------|------------------------|
| linear-advisor-agent | 42 | 16 | 10 | 16 | MEDIUM (already clean) |
| prd-agent | 43 | 25 | 13 | 5 | **HIGH** (PRD conflict with factory-planner) |
| prd-factory-planner-agent | 39 | 24 | 10 | 5 | **HIGH** (PRD conflict with prd-agent) |
| tour-operator-config-agent | 30 | 10 | 20 | 0 | **HIGH** (local utility reuse) |
| wp-config-agent | 31 | 11 | 9 | 10 | MEDIUM (plugin-heavy) |

#### **Medium Agents (20-30 skills)** — Moderate Consolidation

| Agent | Total | Agent-Attached | Local Utilities | Plugin | Consolidation Priority |
|-------|-------|-----------------|-----------------|--------|------------------------|
| woo-config-agent | 21 | 10 | 4 | 7 | MEDIUM (domain-specific) |
| client-website-discovery-assistant-agent | 28 | 18 | 4 | 4 | LOW (specialized discovery) |
| website-content-strategist-agent | 24 | 16 | 4 | 4 | LOW (content domain) |
| website-scope-estimator-agent | 22 | 14 | 3 | 4 | LOW (scope expertise) |
| ai-readiness-estimator-agent | 25 | 19 | 1 | 4 | LOW (assessment domain) |
| zendesk-support-agent | 26 | 17 | 4 | 4 | LOW (support domain) |
| proposal-desk-agent | 16 | 6 | 3 | 7 | LOW (proposal-specific) |

#### **Small Agents (5-15 skills)** — Focused Scope

| Agent | Total | Agent-Attached | Local Utilities | Plugin | Consolidation Priority |
|-------|-------|-----------------|-----------------|--------|------------------------|
| design-partner-agent | 8 | 1 | 1 | 4 | **HIGH** (Figma version conflict) |
| pagespeed-agent | 5 | 3 | 0 | 1 | LOW (specialized) |
| playwright-testing-agent | 4 | 2 | 0 | 0 | LOW (test-focused) |
| harvest-analytical-agent | 13 | 0 | 5 | 3 | MEDIUM (directory-installed reuse) |

### C. Cross-Agent Reuse Matrix (Top 15 Shared Skills)

These 15 skills appear in 2+ agents and are consolidation targets:

| Skill | Agents Using | Count | Reuse Type | Tier Target | Severity |
|-------|--------------|-------|-----------|------------|----------|
| **frontend-skill** | ALL 16 | 16/16 | Identical | Tier 0 | **CRITICAL** |
| **documents** | 6+ agents | 6 | Mix: root + local | Tier 0 | CRITICAL |
| **pdf, presentations, spreadsheets** | 6+ agents | 6 each | Mix: directory + local | Tier 0 | CRITICAL |
| **plugin-creator, skill-creator, skill-installer** | 3+ agents | 3 each | Mix: local + platform | Tier 0 | HIGH |
| **wordpress-accessibility-checker** | wp-config, woo, tour-ops | 3 | Identical | Tier 1 | HIGH |
| **hermes** (design skills) | design-partner, pagespeed, playwright, prd | 4 | Mixed customization | Tier 1 | MEDIUM |
| **Lightspeed-* (23 shared)** | prd-agent, prd-factory | 2 | Near-identical | Tier 1 | **CRITICAL** |
| **imagegen, openai-docs** | 3+ agents | 3 | Platform-managed | Tier 0 (reference) | MEDIUM |

### D. Skills-to-Consolidate Summary

#### **Tier 0 — Move to Root (65 utilities)**

- **frontend-skill** (currently scattered, needs centralization)
- **documents, pdf, presentations, spreadsheets** (directory-installed, remove local copies)
- **plugin-creator, skill-creator, skill-installer** (used by 3+ agents)
- **openai-docs, imagegen** (platform-managed reference)

**Subtotal Tier 0: ~65 local utility instances across agents**

#### **Tier 1 — Consolidate with Agent Overrides (15-20 skills)**

- **wordpress-accessibility-checker** (3 agents, needs domain config)
- **hermes** (4 agents, design-focused)
- **lightspeed-prd-* cluster** (23 skills in prd-agent & prd-factory)
- **[TBD] figma-* versions** (design-partner vs. root conflict)

#### **Tier 2 — Keep Local (108 agent-attached skills)**

- domain-specific, high-value, maintained by agent-owning team

#### **Tier 3 — Archive/Retire (20-30 obsolete skills)**

- Agency legacy skills not actively maintained
- Identify during Phase B evaluation

---

## II. ARCHITECTURE PLAN

### Resolution: 3 Critical Architectural Decisions

#### **DECISION 1: Tier 0 Consolidation Scope (65 Local Utilities)**

**Question:** Which 65 utilities consolidate to Tier 0? How stable must they be?

**Criteria for Tier 0 Acceptance:**

- ✅ Used by **2+ agents** (reuse frequency)
- ✅ **No agent-specific customization** (identical implementations)
- ✅ **Maintenance ownership defined** (who updates when)
- ✅ **Backward compatibility** (existing agents won't break)

**Tier 0 Utilities — Confirmed List:**

| Utility | Agents | Stability | Status | Action |
|---------|--------|-----------|--------|--------|
| frontend-skill | 16/16 | Stable | IN PROGRESS | Move to root immediately |
| documents | 6+ | Stable | EXISTS in root | Remove agent-local copies |
| pdf | 6 | Stable | EXISTS in root | Remove agent-local copies |
| presentations | 5 | Stable | EXISTS in root | Remove agent-local copies |
| spreadsheets | 5 | Stable | EXISTS in root | Remove agent-local copies |
| plugin-creator | 3 | Stable | EXISTS locally | Move to root (batch consolidate) |
| skill-creator | 3 | Stable | EXISTS locally | Move to root (batch consolidate) |
| skill-installer | 3 | Stable | EXISTS locally | Move to root (batch consolidate) |

**Acceptance Criteria: "Stable Enough to Share"**

- No pending bug reports
- Used by 2+ agents with identical expectations
- Test coverage exists (if applicable)
- Maintenance plan in place (assigned owner, update cadence)

**Phase B Decision:** ✅ **APPROVED** — All 8 utility families consolidate to Tier 0. Agent-local copies retired after Phase C implementation.

**Phase C Impact:** Each agent removing local copies requires:

- 1-2 lines per agent (~16 agents × 30 min = 8 hours total cleanup)
- Git commit + testing per agent
- CI/CD validation

---

#### **DECISION 2: Override System Design (Tier 1 Customization)**

**Question:** How do agents customize shared Tier 1 skills? What's the interface?

**Tier 1 Use Case — wordpress-accessibility-checker:**

- **Problem:** Three agents use wordpress-accessibility-checker identically, BUT:
  - wp-config-agent: standard checks, all reports required
  - woo-config-agent: WooCommerce-specific checks, fewer reports
  - tour-operator-config-agent: tour operator-specific checks, custom reports

**Override System Options:**

| Option | Mechanism | Complexity | Maintenance | Example |
|--------|-----------|-----------|-------------|---------|
| **A: Environment Variables** | Agent sets `WORDPRESS_DOMAIN=woo` before invoking | LOW | Fragile | ❌ Limited expressiveness |
| **B: Config JSON per Agent** | `agents/woo/wordpress-accessibility-checker.config.json` | MEDIUM | Moderate | ✅ **RECOMMENDED** |
| **C: Skill Parameters** | Skill accepts override object: `{ domain: "woo", skipChecks: [...] }` | MEDIUM | Good | ✅ Also viable |
| **D: Skill Branching** | Root skill contains `if (agent === "woo") { ... }` | HIGH | Hard to maintain | ❌ Avoid |

**SELECTED APPROACH: Hybrid B + C**

1. **Config JSON per agent** (when skill behavior differs significantly)
2. **Skill parameters** (for fine-grained customization at call time)

**Example: wordpress-accessibility-checker with overrides**

```
Root Skill: skills/wordpress-accessibility-checker/
├── skill.md (shared interface)
├── implementation.js (shared logic)
├── default-config.json (defaults)
└── [NO agent-specific code]

Agent Override Pattern: agents/{agent-name}/overrides/
├── wordpress-accessibility-checker.config.json
└── README.md (documents why override exists)

Config File Example (agents/woo-config-agent/overrides/wordpress-accessibility-checker.config.json):
{
  "domain": "woocommerce",
  "skipChecks": ["custom-post-types", "advanced-cpt"],
  "extraReports": ["woo-product-accessibility", "checkout-flow"]
}
```

**Skill Invocation Pattern:**

```javascript
// Root skill loads agent config if it exists
const agentConfig = loadConfigIfExists(`agents/${agentName}/overrides/wordpress-accessibility-checker.config.json`);
const mergedConfig = { ...defaultConfig, ...agentConfig };
// Run checks with merged config
```

**Tier 1 Skills Requiring Overrides:**

| Skill | Base Agents | Override Type | Config Complexity |
|-------|-----------|---------------|-------------------|
| wordpress-accessibility-checker | wp, woo, tour-ops | Domain-specific checks | LOW (3 domains) |
| hermes | design-partner, pagespeed, playwright, prd | Design context | MEDIUM (4 variants) |
| lightspeed-prd-* (23 skills) | prd-agent, prd-factory | Workflow phase | HIGH (different pipelines) |

**Phase B Decision:** ✅ **APPROVED** — Override system uses Config JSON + skill parameters. Agent-specific overrides stored in `agents/{agent}/overrides/` directory.

**Phase C Impact:** Implement override loading in root skill templates + document pattern in AGENTS.md

---

#### **DECISION 3: HIGH-Severity Conflicts Resolution**

**Conflict #1: Figma Integration Versions**

```
ROOT:     skills/figma-use/ (2023-09, archived as .zip)
AGENT:    design-partner-agent/hermes (2026-07, active)
ISSUE:    Root version outdated; agent version is current
SEVERITY: HIGH — blocking design work if root is used
```

**Resolution:**

1. **Audit** design-partner-agent hermes against root skills (2-3 hours)
2. **Promote** active design-partner implementations to root (replace .zip)
3. **Archive** 2023-09 versions in `.archive/` subdirectory
4. **Document** which agents should reference which version
5. **Timeline:** Phase C Week 5

---

**Conflict #2: PRD Agent Duplication (prd-agent vs. prd-factory-planner-agent)**

```
prd-agent: 43 skills (25 agent-attached, 13 local, 5 plugin)
prd-factory-planner-agent: 39 skills (24 agent-attached, 10 local, 5 plugin)

OVERLAP: 23/25 skills identical (92% overlap)
DIFFERENCE: prd-agent has "hermes" design skill; prd-factory doesn't
SEVERITY: CRITICAL — Suggests incomplete consolidation from prior PR #1196
```

**Investigation Required (Phase B):**

- [ ] Are both agents still needed, or was one meant to replace the other?
- [ ] Does prd-agent's "hermes" serve a function prd-factory doesn't need?
- [ ] Can they share a single base with conditional hermes inclusion?

**Resolution Options:**

1. **Option A: Merge** — Keep prd-agent only; prd-factory becomes alias/wrapper
2. **Option B: Specialize** — Clear role division (prd-agent = design review; factory = generation)
3. **Option C: Extract** — Create shared `prd-base` skill with both agents referencing it

**Recommendation:** **Option C** — Extract shared 23 skills to root `skills/lightspeed-prd-base/`; both agents reference + override as needed.

**Phase B Decision:** ✅ **APPROVED** — Investigate status of PR #1196; implement Option C if agents are both active. Assign to @ashleyshaw for stakeholder alignment.

---

**Conflict #3: figma-code-connect Archival**

```
ROOT:     skills/figma-code-connect/ (archived as .zip)
AGENT:    design-partner-agent (uses 2026-07 active version)
ISSUE:    Root version inaccessible; agent version is de-facto standard
SEVERITY: MEDIUM — not blocking, but creates version confusion
```

**Resolution:** Same as Conflict #1 — promote design-partner version to root during Figma audit.

---

**Conflict #4: linea-* vs. linear__ Naming Inconsistency**

```
linear-advisor-agent:     github__gh-fix-ci (double underscore)
tour-operator-config:     github-gh-fix-ci (single dash)
wp-config-agent:          github__gh-fix-ci (double underscore)

ISSUE: Inconsistent separator for plugin-provided skills
SEVERITY: MEDIUM — causes confusion, not functional breakage
```

**Resolution:** **Standardize to `plugin__provider__skill` format** across all agents.

**Phase C Impact:** Rename skills in agents using single-dash format (tour-operator-config-agent, others)

---

### Summary: Architecture Decisions

| Decision | Status | Impact | Phase C |
|----------|--------|--------|---------|
| **Tier 0 Consolidation (65 utilities)** | ✅ APPROVED | Move 8 utility families to root | 8h cleanup |
| **Override System (Config JSON + params)** | ✅ APPROVED | Implement in root skill templates | 12-16h |
| **Figma Conflicts (#1, #3)** | ✅ APPROVED (audit req'd) | Promote design-partner versions to root | 6-8h |
| **PRD Agent Duplication (#2)** | ⏳ PENDING | Stakeholder alignment on specialization | 8-12h investigation |
| **Plugin Naming Standardization (#4)** | ✅ APPROVED | Rename to `plugin__provider__skill` | 4-6h |

---

## III. IMPLEMENTATION ROADMAP (Phase C: Weeks 5-12)

### A. Phase C Overview

**Duration:** 40–60 hours (8 weeks, ~5-7.5h/week)
**Scope:** Execute consolidation tasks sequenced by agent and tier
**Success Criteria:** All 65 local utilities → root; override system in place; conflicts resolved

### B. Per-Agent Consolidation Tasks

#### **Week 5: Tier 0 Foundation & Figma Audit**

**Hours: 16 (Mon-Tue)**

| Task | Owner | Hours | Deliverable |
|------|-------|-------|------------|
| **Figma Audit (conflicts #1, #3)** | @design-partner lead | 4 | Design-partner figma-* validated + promotion plan |
| **Implement Override System Template** | @code lead | 4 | Root skill template with config loading logic |
| **Create `skills/frontend-skill` (Tier 0)** | @code lead | 3 | Root canonical skill; all agents reference |
| **Create `skills/plugin-creator/`, etc.** | @code lead | 5 | Move 3 utility families to root |

**Blockers:** None — Phase B foundation in place

---

#### **Week 5: PRD Agent Investigation & Consolidation Plan**

**Hours: 12 (Wed-Thu)**

| Task | Owner | Hours | Deliverable |
|------|-------|-------|------------|
| **Interview PRD agent owners** | @ashleyshaw | 3 | Decision on Option A/B/C for PRD agents |
| **Create `skills/lightspeed-prd-base` (if Option C)** | @prd lead | 6 | Shared skill base + override config template |
| **Assess design-partner hermes integration** | @design-partner lead | 3 | Can hermes live in root or is it design-partner-only? |

**Output:** PRD consolidation plan finalized

---

#### **Week 6: Batch 1 Utility Consolidation (5 agents)**

**Hours: 20 (all week)**

Per-agent cleanup (4 hours each):

- ai-readiness-estimator-agent
- website-content-strategist-agent
- website-scope-estimator-agent
- zendesk-support-agent
- client-website-discovery-assistant-agent

**Per-agent checklist:**

- [ ] Remove local copies of documents, pdf, presentations, spreadsheets
- [ ] Update agent manifest to reference root
- [ ] Run tests (if applicable)
- [ ] Commit: `refactor(agent-name): consolidate Tier 0 utilities to root`
- [ ] Verify CI passes

---

#### **Week 6-7: Batch 2-3 Consolidation Part A (5 large agents)**

**Hours: 24 (all week + 2 days week 7)**

Per-agent cleanup (5-6 hours each due to higher complexity):

- linear-advisor-agent (42 skills)
- prd-agent (43 skills) — **WITH PRD override config**
- prd-factory-planner-agent (39 skills) — **WITH PRD override config**
- tour-operator-config-agent (30 skills)
- wp-config-agent (31 skills)

**Key additions:**

- Create `agents/{agent}/overrides/` directory if overrides needed
- Add config files for wordpress-accessibility-checker (wp-config, woo, tour-ops)
- Add config files for Lightspeed skills (prd agents)
- Test override loading

---

#### **Week 7: Batch 2-3 Consolidation Part B (6 remaining agents)**

**Hours: 16 (Wed-Fri)**

- design-partner-agent (8 skills) — **AFTER figma audit complete**
- harvest-analytical-agent (13 skills)
- pagespeed-agent (5 skills)
- playwright-testing-agent (4 skills)
- proposal-desk-agent (16 skills)
- woo-config-agent (21 skills)

---

#### **Week 8: Plugin Naming Standardization & Testing**

**Hours: 12 (Mon-Wed)**

| Task | Hours | Notes |
|------|-------|-------|
| Identify all agents using `plugin-provider-skill` format | 2 | Grep for pattern |
| Rename plugin skills to `plugin__provider__skill` format | 6 | tour-operator-config-agent, others |
| Update agent manifests | 2 | Consistent naming across all agents |
| CI/CD validation | 2 | Ensure all agents still boot correctly |

---

#### **Weeks 8-10: Documentation & Governance**

**Hours: 12**

| Task | Hours | Deliverable |
|------|-------|------------|
| Document override patterns in AGENTS.md | 3 | How to add overrides for existing & new Tier 1 skills |
| Create skill tier matrix (Tier 0/1/2/3) | 2 | Public mapping: which skill goes where |
| Document Figma version strategy | 2 | Which agents use which figma-* version and why |
| Create Phase D plan (skills governance going forward) | 3 | Architecture for future skill additions |
| Archive obsolete skills | 2 | Move unused skills to `.archive/` with deprecation notes |

---

#### **Week 10-11: Testing & Validation**

**Hours: 8**

- Agent boot tests: All 16 agents start successfully ✓
- Skill override tests: Config loading works correctly ✓
- CI/CD validation: All workflows pass ✓
- Manual testing: 3-4 critical agent workflows (prd-agent, linear-advisor, wp-config) ✓

---

#### **Week 12: Final PR & Merge**

**Hours: 4**

- Create Phase C completion PR
- Code review (async, 1-2 days)
- Merge to develop
- Tag Phase 2B complete

---

### C. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| **PRD agents still in flux** | MEDIUM | HIGH | Week 5 investigation + stakeholder decision |
| **Figma skills contain agent-specific code** | MEDIUM | MEDIUM | Audit in Week 5; fallback to keep design-partner local if needed |
| **Agents fail to boot after consolidation** | LOW | CRITICAL | Comprehensive testing in Week 10-11; rollback plan in place |
| **Override config syntax varies** | MEDIUM | LOW | Define JSON schema; validate during Phase C testing |
| **Local skill copies missed during cleanup** | MEDIUM | MEDIUM | Grep for residual copies before Week 12 merge |

---

### D. Phase C Budget Summary

| Category | Hours | Notes |
|----------|-------|-------|
| **Tier 0 Consolidation** | 20-24 | Move 8 utility families; remove local copies |
| **Override System** | 12-16 | Implement + document |
| **Conflict Resolution** | 14-18 | Figma audit, PRD agents, naming standardization |
| **Testing & Validation** | 8 | Comprehensive agent boot + workflow tests |
| **Documentation** | 8-10 | Tier matrix, override patterns, governance plan |
| **TOTAL PHASE C** | **62-84 hours** | **8-10.5 weeks** |

**Recommended Pace:** 6-8h/week with 2-person team (code lead + agent specialist)

---

## IV. SUCCESS CRITERIA & VALIDATION

### Phase C Completion Checklist

**Structural:**

- [ ] All 65 local utilities consolidated to Tier 0 or cached at root
- [ ] Override system implemented in all Tier 1 skills
- [ ] Agent-specific override configs created where needed
- [ ] Plugin skill naming standardized (`plugin__provider__skill`)
- [ ] Figma versions audited + root versions promoted

**Functional:**

- [ ] All 16 agents boot successfully with consolidated skills
- [ ] Override configs load without errors
- [ ] No breaking changes to agent workflows
- [ ] CI/CD passes for all agent manifests

**Documentation:**

- [ ] Skill tier matrix published (Tier 0/1/2/3 mapping)
- [ ] Override pattern documented in AGENTS.md
- [ ] Phase C completion PR merged to develop
- [ ] Phase D governance plan drafted

---

## V. NEXT STEPS

### Immediate (Before Phase B Closure)

1. ✅ Share Phase B planning with team (Issue #1316)
2. ✅ Request decision on PRD agents (Option A/B/C) — 2-3 day discussion window
3. ✅ Finalize Figma audit plan scope

### Phase C Kickoff (Week 5)

1. Create per-agent consolidation issues (1 per agent or batch)
2. Assign owners (code lead + agent specialists)
3. Set up tracking board (Linear or GitHub Projects)
4. Begin Tier 0 foundation work (frontend-skill, override system)

---

**Phase 2B Planning Complete. Ready for team review & Phase C kickoff.**

*Built by 🧱 LightSpeedWP with ☕ & open-source spirit.*
