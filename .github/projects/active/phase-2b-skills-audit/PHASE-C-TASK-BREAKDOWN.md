---
file_type: documentation
title: Phase 2B Phase C - Task Breakdown & Issue Template
description: Detailed breakdown of Phase C consolidation tasks for Linear/GitHub issue creation
created: 2026-07-24
last_updated: 2026-07-29
status: active
related_issues: '#1316'
related_pr: '#1370'
---

# Phase 2B Phase C — Task Breakdown & Issue Template

This document provides structured task definitions for Phase C execution (weeks 5-12). Each section corresponds to a GitHub issue or Linear task to be created at Phase C kickoff.

## Task Status Snapshot (2026-07-29)

- Phase C execution issue set is now active and normalised on GitHub.
- Updated issues: #1326-#1355 (Task 2 through Task 31).
- All updated issues now use task-specific titles, template-compliant bodies, and include both DoR and DoD sections.
- Status labels were moved from `status:needs-more-info` to `status:ready` for all updated tasks.

### Phase C Issue Coverage

| Scope | Issue Range | Status |
|----------|----------|--------|
| Parent epic | #1320 | Open, active |
| Foundation and audit tasks | #1321, #1326-#1330 | Open, ready |
| Batch consolidation tasks | #1331-#1346 | Open, ready |
| Standardisation and governance tasks | #1347-#1353 | Open, ready |
| Integration and completion tasks | #1354-#1355 | Open, ready |

---

## Epic: Phase 2B Skills Consolidation Phase C

**Parent Issue:** #1316 (Phase 2B Planning)
**Epic Description:** Consolidate 65 local agent utilities to Tier 0, implement override system for Tier 1 skills, and resolve HIGH-severity conflicts identified in Phase A/B audit.
**Duration:** 8-10 weeks, 62-84 hours
**Owner:** @code-lead + @agent-specialists

---

## WEEK 5: Foundation & Audit

### Task W5-1: Figma Skills Audit & Promotion Plan

**Type:** Task (Research + Planning)
**Priority:** CRITICAL
**Assignee:** @design-partner-lead
**Hours:** 4

**Definition of Done:**

- [ ] Audit complete: all figma-* skills in design-partner vs. root documented
- [ ] Version comparison: identify which version is current (2026-07 vs. 2023-09)
- [ ] Promotion plan drafted: how to move design-partner versions to root
- [ ] Archive plan drafted: what happens to 2023-09 .zip versions
- [ ] Figma consolidation task created (W5-2 followup)
- [ ] PR linked: figma audit findings documented

**Success Criteria:**

- Clear determination: are design-partner figma implementations the standard going forward?
- Migration path defined for agents currently using root 2023-09 versions
- No breaking changes to agents that depend on figma skills

---

### Task W5-2: Implement Override System Template

**Type:** Task (Implementation)
**Priority:** CRITICAL
**Assignee:** @code-lead
**Hours:** 4

**Definition of Done:**

- [ ] Root skill template created: `skills/_template/skill.md` with override-awareness
- [ ] Config loading logic implemented: `loadConfigIfExists()` utility function
- [ ] Config file location standardized: `agents/{agent}/overrides/{skill}.config.json`
- [ ] Example override config created for wordpress-accessibility-checker
- [ ] Unit tests: config loading works correctly ✓
- [ ] Documentation: override pattern explained in AGENTS.md with examples
- [ ] PR created, linked to epic

**Success Criteria:**

- New root skills can load per-agent overrides without manual branching logic
- Config validation: malformed JSON rejected gracefully
- Backward compatibility: existing root skills still work without override files

---

### Task W5-3: Create skills/frontend-skill (Tier 0)

**Type:** Task (Implementation)
**Priority:** CRITICAL
**Assignee:** @code-lead
**Hours:** 3

**Definition of Done:**

- [ ] `skills/frontend-skill/` created in root
- [ ] All agent-local frontend-skill references audit complete
- [ ] Current canonical implementation selected or merged
- [ ] README documenting frontend-skill purpose & usage
- [ ] PR created; linked to epic
- [ ] Ready for agent consolidation tasks (W6-W7)

**Success Criteria:**

- All agents can reference root `skills/frontend-skill/` without breakage
- No behavioral change vs. current agent-local versions

---

### Task W5-4: Move plugin-creator, skill-creator, skill-installer to Tier 0

**Type:** Task (Implementation)
**Priority:** HIGH
**Assignee:** @code-lead
**Hours:** 5

**Definition of Done:**

- [ ] `skills/plugin-creator/`, `skills/skill-creator/`, `skills/skill-installer/` created in root
- [ ] All agent-local copies identified
- [ ] Agent consolidation tasks created (W6-W7 cleanup)
- [ ] PR created; linked to epic
- [ ] Agents can reference root versions without errors

**Success Criteria:**

- Single source of truth for all 3 utilities
- Agents using local copies can switch to root with 1-line change each
- Tests pass for all 3 utilities

---

## WEEK 5: PRD Agent Investigation

### Task W5-5: PRD Agent Consolidation Decision (Stakeholder Alignment)

**Type:** Epic sub-task (Research + Decision)
**Priority:** CRITICAL
**Assignee:** @ashleyshaw (PM) + @prd-lead
**Hours:** 3 (interview) + 6 (implementation planning, if Option C chosen)

**Definition of Done (Interview Phase):**

- [ ] Stakeholder interviews complete: do both agents still serve distinct purposes?
- [ ] PR #1196 status reviewed: was consolidation attempted before?
- [ ] Decision documented: is Option A (merge), B (specialize), or C (extract base) chosen?
- [ ] Team alignment on choice

**Definition of Done (If Option C chosen — Create Shared Base):**

- [ ] `skills/lightspeed-prd-base/` created in root
- [ ] 23 shared skills moved from both agents to base
- [ ] Override config templates created for agent-specific customizations
- [ ] Both agents tested independently ✓
- [ ] PR created; linked to epic

**Success Criteria:**

- Clear decision on PRD agent strategy
- No functional regression if agents consolidated/extracted
- 23 duplicate skill implementations eliminated

---

### Task W5-6: Assess Design-Partner Hermes Integration

**Type:** Task (Research)
**Priority:** MEDIUM
**Assignee:** @design-partner-lead
**Hours:** 3

**Definition of Done:**

- [ ] Hermes scope documented: is it a design framework, design-partner-specific tool, or agent-agnostic?
- [ ] Customization audit: how do other agents customize hermes?
- [ ] Decision: move to root `skills/hermes/` or keep design-partner-local?
- [ ] If root move needed: plan override configs for other agents
- [ ] Documented in Figma audit findings

**Success Criteria:**

- Clear understanding of hermes role in agent ecosystem
- Decision on root vs. local storage documented

---

## WEEK 6: Batch 1 Consolidation (5 Agents)

Create 5 identical issues (one per agent), scheduled in series:

### Task W6-A1 thru W6-A5: Consolidate Batch 1 Agents to Tier 0

**Agents:** ai-readiness-estimator, website-content-strategist, website-scope-estimator, zendesk-support, client-website-discovery

**Type:** Task (Refactoring)
**Priority:** MEDIUM
**Hours:** 4 per agent
**Sprint:** W6

**Definition of Done (per agent):**

- [ ] Local copies identified: documents, pdf, presentations, spreadsheets (if any)
- [ ] Agent manifest updated: reference root versions
- [ ] Tests pass ✓
- [ ] Commit message: `refactor({agent-name}): consolidate Tier 0 utilities to root`
- [ ] PR created, reviewed, merged to develop

**Success Criteria:**

- Agent boots successfully with consolidated skills
- No skill lookup errors
- CI passes

---

## WEEK 6-7: Batch 2-3 Part A Consolidation (5 Large Agents)

### Task W6-B1: Consolidate linear-advisor-agent

**Type:** Task (Refactoring + Override Implementation)
**Priority:** MEDIUM
**Assignee:** @agent-specialist-2
**Hours:** 6
**Sprint:** W6

**Definition of Done:**

- [ ] Local utility copies removed: plugin-creator, skill-creator, skill-installer, documents, pdf, etc.
- [ ] Agent manifest updated
- [ ] Check: does linear-advisor-agent use wordpress-accessibility-checker? If yes, create override config
- [ ] Tests pass ✓
- [ ] Commit: `refactor(linear-advisor-agent): consolidate Tier 0-1 utilities to root`
- [ ] PR created, reviewed, merged

**Success Criteria:**

- linear-advisor-agent has 42 → fewer skills (consolidated locals removed)
- Skill lookup validation: no missing dependencies
- CI passes

---

### Task W6-B2 / W6-B3: Consolidate PRD Agents + Apply Override Configs

**Agents:** prd-agent, prd-factory-planner-agent

**Type:** Task (Refactoring + Override Implementation)
**Priority:** CRITICAL
**Assignee:** @prd-lead
**Hours:** 6 per agent
**Sprint:** W6-W7

**Definition of Done:**

- [ ] Local utility copies removed: documents, pdf, presentations, spreadsheets, plugin-creator, etc.
- [ ] 23 lightspeed-prd-* skills migrated to root (if Option C) OR consolidated (if Option A/B)
- [ ] `agents/{agent}/overrides/prd-*.config.json` created for agent-specific variants
- [ ] Agent manifest updated
- [ ] Tests pass ✓
- [ ] Commit: `refactor({agent-name}): consolidate Tier 0-1 utilities + lightspeed-prd-base`
- [ ] PR created, reviewed, merged

**Success Criteria:**

- Both agents still function identically (no workflow changes)
- Override configs load correctly
- 23 duplicate implementations eliminated OR consolidated

---

### Task W6-B4 / W6-B5: Consolidate WordPress Config Agents

**Agents:** tour-operator-config-agent, wp-config-agent

**Type:** Task (Refactoring + Override Implementation)
**Priority:** MEDIUM
**Hours:** 5 per agent
**Sprint:** W7

**Definition of Done:**

- [ ] 20 local utility copies removed (highest local reuse of any agent)
- [ ] wordpress-accessibility-checker override config created
- [ ] Override config specifies domain-specific checks (e.g., `domain: "tour-operator"` or `domain: "wp"`)
- [ ] Tests pass ✓
- [ ] Commit: `refactor({agent-name}): consolidate Tier 0 utilities + apply wordpress-accessibility-checker override`
- [ ] PR created, reviewed, merged

**Success Criteria:**

- Agent skill count reduced after consolidation
- Domain-specific behavior preserved via override config
- CI passes

---

## WEEK 7: Batch 2-3 Part B Consolidation (6 Remaining Agents)

### Task W7-C1: Consolidate design-partner-agent (AFTER Figma Audit)

**Type:** Task (Refactoring + Version Migration)
**Priority:** CRITICAL
**Hours:** 6
**Sprint:** W7 (depends on W5-1)

**Definition of Done:**

- [ ] Figma audit complete (W5-1)
- [ ] Local utility copy removed: frontend-skill
- [ ] Figma versions migrated to root per audit plan
- [ ] Hermes integration either moved to root or documented as design-partner-local
- [ ] Agent manifest updated
- [ ] Tests pass ✓
- [ ] Commit: `refactor(design-partner-agent): consolidate Tier 0 utilities + promote figma versions to root`
- [ ] PR created, reviewed, merged

**Success Criteria:**

- design-partner-agent functionality preserved
- Figma skill versions consistent across ecosystem
- No broken design workflows

---

### Tasks W7-C2 thru W7-C6: Consolidate Remaining Batch 2-3 Agents

**Agents:** harvest-analytical, pagespeed, playwright-testing, proposal-desk, woo-config

**Type:** Task (Refactoring)
**Priority:** MEDIUM
**Hours:** 4 per agent
**Sprint:** W7

**Definition of Done (per agent):**

- [ ] Local utility copy removed: frontend-skill
- [ ] Directory-installed utilities verified (if applicable)
- [ ] Agent manifest updated
- [ ] Tests pass ✓
- [ ] Commit: `refactor({agent-name}): consolidate Tier 0 utilities to root`
- [ ] PR created, reviewed, merged

**Note:** woo-config-agent requires wordpress-accessibility-checker override config (same as tour-ops, wp-config agents).

**Success Criteria:**

- Agent boots successfully
- No skill lookup errors
- CI passes

---

## WEEK 8: Standardization & Testing

### Task W8-1: Standardize Plugin Skill Naming

**Type:** Task (Refactoring + Validation)
**Priority:** MEDIUM
**Hours:** 6
**Sprint:** W8

**Definition of Done:**

- [ ] Identify all agents using `plugin-provider-skill` format (non-standard)
- [ ] Grep results: confirm affected agents
- [ ] Rename plugin skills to standard `plugin__provider__skill` format
- [ ] Update agent manifests
- [ ] Tests pass: skill lookup works ✓
- [ ] Commit: `refactor: standardize plugin skill naming to plugin__provider__skill format`
- [ ] PR created, reviewed, merged

**Success Criteria:**

- No inconsistent plugin naming across any agent
- All agent manifests updated
- CI passes

---

### Task W8-2: Comprehensive Agent Boot Testing

**Type:** Task (Testing)
**Priority:** HIGH
**Hours:** 4
**Sprint:** W8 (parallel with W8-1)

**Definition of Done:**

- [ ] Each agent boots successfully: 16/16 ✓
- [ ] No skill lookup errors
- [ ] Override configs load correctly
- [ ] No CI failures
- [ ] Agent functionality spot-check: 3-4 critical workflows tested (prd-agent, linear-advisor, wp-config, design-partner)
- [ ] Test report generated

**Success Criteria:**

- All 16 agents functional post-consolidation
- Override system working as designed
- No breaking changes introduced

---

## WEEK 8-10: Documentation & Governance

### Task W8-3: Document Override Patterns in AGENTS.md

**Type:** Task (Documentation)
**Priority:** HIGH
**Hours:** 3
**Sprint:** W8-W9

**Definition of Done:**

- [ ] AGENTS.md updated with "Override Pattern" section
- [ ] Example: wordpress-accessibility-checker override config
- [ ] Example: lightspeed-prd-base override usage
- [ ] How to add overrides for future Tier 1 skills documented
- [ ] Config JSON schema defined
- [ ] PR created, reviewed, merged

**Success Criteria:**

- Future agent developers understand how to create/customize Tier 1 skills
- Override pattern standardized across repo

---

### Task W8-4: Create Skill Tier Matrix

**Type:** Task (Documentation)
**Priority:** MEDIUM
**Hours:** 2
**Sprint:** W9

**Definition of Done:**

- [ ] Create `.github/projects/active/phase-2b-skills-audit/SKILL-TIER-MATRIX.md`
- [ ] List all ~70 active Tier 0 utilities
- [ ] List all ~15 Tier 1 reusable skills (with agents using each)
- [ ] List all ~108 Tier 2 agent-specific skills (grouped by agent)
- [ ] Note any Tier 3 archived/retiring skills
- [ ] Link to AGENTS.md for governance rules

**Success Criteria:**

- Single source of truth for skill organization
- Agents can self-serve to find which tier a skill belongs to

---

### Task W8-5: Document Figma Version Strategy

**Type:** Task (Documentation)
**Priority:** HIGH
**Hours:** 2
**Sprint:** W9

**Definition of Done:**

- [ ] Create `.github/projects/active/phase-2b-skills-audit/FIGMA-VERSION-STRATEGY.md`
- [ ] Document: which agents use which figma-* version (root vs. design-partner)
- [ ] Rationale: why version differences exist (if any)
- [ ] Deprecation timeline: when will legacy versions be retired?
- [ ] Migration path: how agents move to latest version
- [ ] Linked from AGENTS.md

**Success Criteria:**

- Clear guidance on figma skill usage across agents
- No version confusion for future developers

---

### Task W8-6: Create Phase D Plan (Skills Governance)

**Type:** Task (Planning)
**Priority:** HIGH
**Hours:** 3
**Sprint:** W10

**Definition of Done:**

- [ ] Create `.github/projects/active/phase-2b-skills-consolidation/PHASE-D-GOVERNANCE.md`
- [ ] Define: how are new Tier 0/1/2/3 skills added?
- [ ] Governance: review process for shared (Tier 0/1) skills
- [ ] Maintenance: who owns which skill tier?
- [ ] Conflict resolution: what if agent customization conflicts?
- [ ] Deprecation: how are obsolete skills retired?
- [ ] Roadmap: Phase D initiatives if any

**Success Criteria:**

- Clear governance rules prevent future skill duplication
- Architects understand Tier system well enough to extend it

---

### Task W8-7: Archive Obsolete Skills

**Type:** Task (Refactoring + Housekeeping)
**Priority:** MEDIUM
**Hours:** 2
**Sprint:** W10

**Definition of Done:**

- [ ] Identify 10-20 obsolete/unused skills from Phase A audit findings
- [ ] Move to `.archive/` with deprecation date in filename
- [ ] Document: why each skill is archived (superseded by X, unused by any agent, etc.)
- [ ] Commit: `chore: archive obsolete skills from Phase 2B consolidation`
- [ ] PR created, merged

**Success Criteria:**

- repo cleaner; obsolete code no longer clutters active directory
- Future developers can see deprecation history in `.archive/`

---

## WEEK 10-11: Testing & Validation

### Task W10-1: Comprehensive Integration Testing

**Type:** Task (Testing)
**Priority:** CRITICAL
**Hours:** 8
**Sprint:** W10-W11

**Definition of Done:**

- [ ] Agent boot test: all 16 agents start without errors ✓
- [ ] Skill lookup test: no missing dependencies ✓
- [ ] Override config test: configs load & apply correctly ✓
- [ ] CI/CD validation: all workflows pass ✓
- [ ] Manual workflow testing:
  - [ ] prd-agent: create PRD workflow ✓
  - [ ] linear-advisor-agent: triage workflow ✓
  - [ ] wp-config-agent: WordPress audit workflow ✓
  - [ ] design-partner-agent: design workflow ✓
- [ ] Test report: all tests documented

**Success Criteria:**

- Zero blocking issues blocking Phase C merge
- All 16 agents functional in realistic workflows
- Override system proven to work

---

## WEEK 12: Completion & Merge

### Task W12-1: Create Phase 2B Phase C Completion PR

**Type:** Task (Merge)
**Priority:** CRITICAL
**Hours:** 2-4
**Sprint:** W12

**Definition of Done:**

- [ ] Create summary PR (squash all Phase C work into single meta-commit, or leave individual commits)
- [ ] PR title: `feat: Phase 2B Phase C skills consolidation — Tier 0-1 unification, override system, conflict resolution`
- [ ] PR body documents:
  - [ ] What was consolidated (65 utilities → root)
  - [ ] Override system implemented (Tier 1 customization pattern)
  - [ ] HIGH-severity conflicts resolved (Figma, PRD, naming)
  - [ ] Links to all component PRs
  - [ ] Test results
- [ ] Code review: 1-2 reviewers (48-72h async)
- [ ] Merge to develop ✓
- [ ] Create release notes for Phase 2B Phase C

**Success Criteria:**

- Phase 2B Phase C complete and merged
- Clear documentation for Phase D and future work

---

### Task W12-2: Update Phase Status & Create Phase D Issue

**Type:** Task (Housekeeping)
**Priority:** MEDIUM
**Hours:** 1
**Sprint:** W12

**Definition of Done:**

- [ ] Update PHASE-2B-SKILLS-AUDIT.md frontmatter: `status: complete`
- [ ] Update PHASE-2B-SKILLS-PLANNING.md frontmatter: `status: complete`
- [ ] Create Phase D issue (#TBD): "Phase 2B Phase D — Skills Governance & Future Consolidation" (if needed)
- [ ] Link Phase D issue to Phase 2B epic

**Success Criteria:**

- Phase 2B clearly marked as complete
- Phase D issue ready for future planning (if applicable)

---

## Summary: Phase C Task Count

| Category | Count | Hours | Weeks |
|----------|-------|-------|-------|
| **Foundation & Audit (W5)** | 6 | 15-16 | 1 |
| **Batch 1 Agent Consolidation (W6)** | 5 | 20 | 1 |
| **Batch 2-3 Large Agents (W6-W7)** | 5 | 28-30 | 1.5 |
| **Batch 2-3 Small Agents (W7)** | 6 | 20 | 1 |
| **Standardization & Testing (W8)** | 2 | 10 | 1 |
| **Documentation (W8-W10)** | 5 | 10 | 2 |
| **Integration Testing (W10-W11)** | 1 | 8 | 1 |
| **Completion (W12)** | 2 | 4 | 1 |
| **TOTAL** | **32 tasks** | **115-125 hours** | **8-10 weeks** |

---

**Phase 2B Planning & Task Definition Complete. Ready for Phase C kickoff.**

*Built by 🧱 LightSpeedWP with ☕ & open-source spirit.*
