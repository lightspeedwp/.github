# Branch Naming Validation Audit — Specification & Methodology
**Date:** 2026-08-22  
**Initiated by:** Ashley (ashley@lightspeedwp.agency)  
**Status:** In Progress  
**Audit Period:** Ongoing (systematic root-cause analysis)

---

## Executive Problem Statement

**Critical Issue:** Claude Code sessions are consistently creating branches with the **explicitly forbidden `claude/` prefix**, in direct violation of governance rules documented in `CLAUDE.md`, `docs/BRANCHING_STRATEGY.md`, and PR template routing logic. This has been causing:

- Duplicate PRs and closed PRs
- Wasted token credits (months of repeated failures)
- Violation of the main-branch-guard workflow
- Cascading failures in release/hotfix pipeline

**Root Cause (Confirmed):** Claude Code has `claude/` hardcoded as a default branch prefix in its application settings. This cannot be overridden by the user or disabled in the session configuration.

**Secondary Issues:** 
- Validation scripts don't reliably catch violations on newly created branches
- Agent instructions in `.github/agents/` and root `agents/` have conflicting branch guidance (or none)
- Release agent created `chore/release` instead of `release/vX.Y.Z`
- CLAUDE.md branch naming section lacks visibility and agent cross-links

---

## Audit Scope

### 1. **Claude Code Environment Configuration** (CRITICAL — ROOT CAUSE)
- Location: Claude Code settings (application-level)
- What's being audited:
  - Default branch prefix setting (`claude/`)
  - Whether this is hardcoded vs. configurable
  - Session-level overrides (if any exist)
  - User settings in `.claude/settings.json` (if applicable)
- Deliverable: Document the exact setting, whether it's overridable, and fallback options

### 2. **Branch Naming Validation Scripts** (FOUNDATIONAL)
- Locations to audit:
  - `.github/scripts/workflows/branch-policy/validate-main-branch-pr.cjs`
  - `.github/scripts/` folder (all branch-related scripts)
  - `scripts/` root folder (where they should be per restructuring)
  - `npm run validate:branch-name` command
- What's being audited:
  - Whether scripts actually run on new branch creation
  - Whether they run on every PR
  - Coverage gaps (newly created branches vs. PR validation)
  - Regex patterns used
  - Error handling and reporting
  - Whether scripts are in the right location (`.github/scripts/` vs `scripts/`)
- Deliverable: Current coverage matrix, gaps identified, location restructuring needed

### 3. **Agent Instruction Conflicts** (DOCUMENTATION)
- Locations to audit:
  - All 19 spec-based agents in `.github/agents/`
  - All 16 portable agents in `agents/` root
  - Release agent specifically
  - `.github/agents/release.agent.md` and `agents/release/` 
- What's being audited:
  - Which agents create branches and what branch names they use
  - Whether agents reference branch naming rules
  - Conflicts between `.github/agents/` and `agents/` for same agent
  - Whether agents are aware of the `claude/` forbidden prefix
  - Release agent: why it created `chore/release` instead of `release/vX.Y.Z`
- Deliverable: Agent inventory with branch creation patterns, instruction gaps, conflicts

### 4. **Workflow Analysis** (PIPELINE & AUTOMATION)
- Locations to audit:
  - All `.github/workflows/` files (focus on: release, steward, branch creation, labeling)
  - `workflows/` root folder (portable workflows, if any)
  - main-branch-guard workflow
  - branch-validation workflow
  - Mergify configuration (`.github/mergify.yml`)
- What's being audited:
  - Which workflows trigger branch creation
  - Which workflows validate branches
  - Whether validation happens before or after branch is pushed
  - Error messaging and failure recovery
  - Release/hotfix pipeline specifically
- Deliverable: Workflow topology, validation points, failure modes

### 5. **Documentation & Cross-References** (READABILITY & DISCOVERABILITY)
- Locations to audit:
  - `CLAUDE.md` (branch naming section placement, agent links)
  - `docs/BRANCHING_STRATEGY.md` (canonical reference)
  - `.github/PULL_REQUEST_TEMPLATE/config.yml` (routing based on branch names)
  - `.github/agents/*/` (do they reference branch rules?)
  - `agents/*/` (do they reference branch rules?)
  - `AGENTS.md` (branch governance references)
- What's being audited:
  - Whether branch naming rules are discoverable at the start of CLAUDE.md
  - Whether agents are instructed about branch naming
  - Whether documentation is consistent across all sources
  - Whether PR templates are correctly routed based on branch prefix
- Deliverable: Documentation gap map, visibility improvements needed

### 6. **Release/Hotfix Pipeline Deep Dive** (HIGHEST IMPACT)
- Locations to audit:
  - Release agent that created `chore/release`
  - `.github/workflows/release.yml` or equivalent
  - `agents/release/` (if exists)
  - `.github/agents/release.agent.md`
  - Release process documentation
  - AGENTIC_RELEASE_USER_GUIDE.md
- What's being audited:
  - Why `chore/release` was created instead of `release/vX.Y.Z`
  - Whether release agent reads branch naming rules
  - Whether it checks the Claude Code default prefix issue
  - Whether there's a hardcoded branch prefix in release logic
- Deliverable: Root cause of release branch failure, fix recommendations

### 7. **PR Template Routing Validation** (CONFIGURATION)
- Locations to audit:
  - `.github/PULL_REQUEST_TEMPLATE/config.yml`
  - All PR template files (pr_*.md)
  - Whether template routing is based on correct branch prefixes
  - Whether routing catches the `claude/` prefix as invalid
- What's being audited:
  - Template routing rules vs. actual branch names being created
  - Whether `claude/` prefix has a fallback template (it shouldn't)
  - Whether routing validates prefix correctness
- Deliverable: Template routing matrix, validation gaps

---

## Audit Methodology

### Phase 1: Static Analysis (Current)
- **Read all relevant files** (scripts, agents, workflows, documentation)
- **Map the current state** without modifications
- **Identify conflicts and gaps**

### Phase 2: Validation Coverage Check
- **Run validation scripts locally** to test their actual behavior
- **Create test branches** with various naming patterns and see what gets caught
- **Check whether validation runs automatically** on new branch creation

### Phase 3: Agent Instruction Cross-Reference
- **Create an inventory** of all agents that create branches
- **Check each agent's instructions** for branch naming guidance
- **Identify missing or conflicting guidance**

### Phase 4: Release Pipeline Trace
- **Trace the exact execution** that created `chore/release`
- **Identify the decision point** where the wrong prefix was chosen
- **Determine whether it's hardcoded or derived from settings**

### Phase 5: Root Cause Documentation
- **Document findings** by category
- **Link each finding to its source** (file, line number)
- **Rate severity** (critical, high, medium, low)

### Phase 6: Remediation Planning
- **Propose ordered fixes** with effort estimates
- **Prioritize by impact** (e.g., Claude Code settings first, then validation)
- **Assign ownership** where applicable

---

## Key Questions the Audit Must Answer

### About Claude Code Settings
1. Is `claude/` hardcoded as the default prefix?
2. Can it be overridden in `.claude/settings.json`?
3. Can it be set to empty/null to disable the prefix?
4. Is there a Claude Code configuration option to change this?

### About Validation
1. Which scripts validate branches and when do they run?
2. Do they catch newly created branches before they're pushed?
3. Are there gaps in validation coverage?
4. Where should scripts be located (`.github/scripts/` vs `scripts/`)?

### About Agents
1. Which agents create branches?
2. Do they receive explicit branch naming instructions?
3. Are there conflicts between `.github/agents/` and `agents/` versions?
4. Does the release agent have access to branch naming rules?

### About Release Pipeline
1. Why did release agent use `chore/release`?
2. Is there a hardcoded branch name in release logic?
3. Should it reference a master branch template?
4. Is there validation on the branch name before it's created?

### About Documentation
1. Is branch naming guidance discoverable in CLAUDE.md?
2. Are agents explicitly told not to use `claude/` prefix?
3. Is PR template routing correct for all branch prefixes?
4. Are there consistency gaps across documentation?

---

## Expected Deliverables

1. **Current State Map** — All branch-related files, scripts, agents, workflows, and documentation
2. **Conflict Matrix** — Where `.github/agents/` conflicts with `agents/`, scripts are misplaced, etc.
3. **Validation Gap Analysis** — Coverage matrix showing what's validated, when, and by what
4. **Agent Instruction Inventory** — Which agents create branches, what names they use, whether they're instructed correctly
5. **Release Pipeline Root Cause** — Why `chore/release` was created, exact decision point
6. **Documentation Visibility Report** — Whether branch rules are discoverable, whether agents are instructed
7. **Ordered Remediation Plan** — Fixes ranked by impact, effort, and dependency order
8. **Implementation Checklist** — Specific actions with owners and timeline

---

## Success Criteria

✅ **Audit is complete when:**
- Claude Code settings are documented and solutions identified
- All validation scripts are mapped and gaps are closed
- All agents creating branches are identified and instructed
- Release/hotfix pipeline root cause is documented
- Documentation is reorganized for visibility
- A detailed remediation plan exists with specific actions

✅ **Follow-up session will:**
- Implement fixes in order of priority
- Close gaps in validation scripts
- Update agent instructions across all agents
- Reorganize CLAUDE.md for discoverability
- Fix release/hotfix pipeline
- Verify branch naming enforcement works end-to-end

---

## Audit Progress Log

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1: Static Analysis | In Progress | Starting with file inventory and mapping |
| Phase 2: Validation Coverage | Pending | Will run after Phase 1 |
| Phase 3: Agent Cross-Reference | Pending | Will check all 35 agents |
| Phase 4: Release Pipeline Trace | Pending | Will analyze exact execution |
| Phase 5: Root Cause Documentation | Pending | Will synthesize findings |
| Phase 6: Remediation Planning | Pending | Will propose ordered fixes |

---

**Audit Owner:** Claude Code (this session)  
**Review Owner:** Ashley (ashley@lightspeedwp.agency)  
**Related Issues:**
- [Branch Governance Hardening](https://github.com/lightspeedwp/.github/tree/develop/.github/projects/active/branch-governance-hardening)
- [Branch Naming Enforcement 2026-08-11](https://github.com/lightspeedwp/.github/tree/develop/.github/projects/active/branch-naming-enforcement-2026-08-11)
- [Branch Naming Enforcement Phases 6-7](https://github.com/lightspeedwp/.github/tree/develop/.github/projects/active/branch-naming-enforcement-phases-6-7)
