# Feature Specification: Agent Structure Standardization & Skill Consolidation

**Feature Branch**: `refactor/agents-restructure-consolidate`

**Created**: 2026-09-18

**Status**: Draft

**Input**: User description: Review branch refactor/agents-resturcturing with major agent restructuring, skills consolidation, registry creation, and breaking reference remediation.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Audit & Remediate Broken References (Priority: P1)

As an automation engineer, I need to identify and fix all broken script references and imports throughout the repository that resulted from agent file and folder renames, so that all agent-related scripts and workflows continue to function correctly.

**Why this priority**: Breaking changes from renaming files cascades as silent failures in CI, automation workflows, and script execution. P1 because it must be resolved before any further restructuring work can proceed safely.

**Independent Test**: Can run reference audit script on entire repository, identify all broken references to renamed agents, validate fixes by re-running dependent scripts and CI workflows successfully.

**Acceptance Scenarios**:

1. **Given** agent files have been renamed/reorganized, **When** repository is scanned for broken references, **Then** audit report lists all broken imports, script paths, and workflow references with file locations and line numbers
2. **Given** broken references are identified, **When** fixes are applied, **Then** all dependent scripts execute successfully and CI workflows pass without import/path errors
3. **Given** reference fixes are complete, **When** integration tests run, **Then** all agent-related functionality works as expected

---

### User Story 2 - Standardize Agent Folder Structure Across All Agents (Priority: P1)

As a platform architect, I need to establish a standardized folder structure for all agents in the `agents/` directory (following the prd-agent pattern), so that all agents have consistent, discoverable structure and clear boundaries between agent definition, skills, tests, and configuration.

**Why this priority**: Inconsistent agent structure makes onboarding difficult, complicates skill management, and creates maintenance debt. P1 because it's foundational to all subsequent consolidation work.

**Independent Test**: Can audit each agent folder against standardized structure checklist; validate that agents with subfolders (changelog-agent, issue-agent, etc.) have correct structure; document any deviations.

**Acceptance Scenarios**:

1. **Given** an agent is moved to standardized structure, **When** folder is audited, **Then** it contains required elements: agent definition file, skills subfolder, tests subfolder, configuration files, README
2. **Given** multiple agents have been restructured, **When** comparison audit runs, **Then** all agents follow identical structural pattern with no deviations
3. **Given** standardized structure is in place, **When** new agent is created, **Then** it automatically follows the established pattern with clear folder organization

---

### User Story 3 - Consolidate & Deduplicate Agent Skills (Priority: P1)

As a skills maintainer, I need to audit all agent skills across `agents/*/skills/` folders and the root `skills/` folder to identify duplicates, deconflict overlapping implementations, and establish a single source of truth for shared skills, so that skill definitions are not duplicated and agents reuse common skills where appropriate.

**Why this priority**: Skill duplication creates maintenance burden and inconsistency. P1 because deduplication must happen before creating registries and establishing clear skill ownership.

**Independent Test**: Can run deduplication audit comparing all agent skills to root skills; identify exact duplicates, near-duplicates, and overlapping implementations; generate consolidation recommendations with impact analysis.

**Acceptance Scenarios**:

1. **Given** all agent skills and root skills are catalogued, **When** deduplication audit runs, **Then** report identifies all duplicate skills with locations and similarity scores
2. **Given** duplicate skills are identified, **When** consolidation plan is created, **Then** plan specifies which agents will use shared root skill vs. maintain agent-specific variant with justification
3. **Given** consolidation is complete, **When** deduplication audit re-runs, **Then** no true duplicates remain (only intentional agent-specific variations with clear rationale)

---

### User Story 4 - Create Agent Skills Registry for Compliance Validation (Priority: P2)

As a skills governance manager, I need to create a registry of all agent skills across the `agents/` folder that tracks compliance with agentskills.io specification, current schema version, and required fields, so that all agent skills meet external specification requirements and can be validated automatically.

**Why this priority**: Registry enables automated compliance validation. P2 because it depends on agent structure being standardized first and skills being consolidated.

**Independent Test**: Can generate registry from all agent skills folders; validate each skill against agentskills.io specification schema; run compliance check showing pass/fail status for each skill with specific violation details.

**Acceptance Scenarios**:

1. **Given** agent skills have been consolidated, **When** registry generation runs, **Then** registry contains all skills with metadata: agent, skill name, version, agentskills.io compliance status, schema version, missing/invalid fields
2. **Given** registry is generated, **When** compliance validation runs, **Then** each skill is checked against agentskills.io specification and violations are reported with clear remediation steps
3. **Given** compliance violations exist, **When** fixes are applied, **Then** registry can be regenerated and show 100% compliance (or document intentional deviations with rationale)

---

### User Story 5 - Create Agent Registry with Metadata & Dependencies (Priority: P2)

As a platform architect, I need to create a registry of all agents in the `agents/` folder that tracks agent metadata (name, description, version), skill dependencies, script dependencies, and implementation status, so that agent relationships, skill usage, and dependencies across agents are documented and discoverable.

**Why this priority**: Registry enables orchestration, discovery, and dependency management across agents. P2 because it builds on standardized structure and skill consolidation.

**Independent Test**: Can generate agent registry from all agent folders; validate that all agents are discoverable, metadata is complete, skill dependencies are traced correctly, and registry can be used to identify cross-agent dependencies.

**Acceptance Scenarios**:

1. **Given** all agents are in standardized structure, **When** registry generation runs, **Then** registry contains all agents with metadata: name, description, version, skills used, scripts referenced, status (active/deprecated), dependencies on other agents
2. **Given** agent registry is complete, **When** dependency analysis runs, **Then** circular dependencies are identified, shared skill usage is documented, and script dependencies are traced
3. **Given** registry exists, **When** new agent is created, **Then** it can be automatically added to registry and existing agents can discover it

---

### User Story 6 - Plan Phased Agent-by-Agent Restructuring (Priority: P2)

As a project lead, I need to create a detailed plan for restructuring each agent in the `agents/` folder individually, with clear scope, priorities (starting with agents that have subfolders already), and dependencies, so that restructuring can be executed systematically without breaking existing functionality.

**Why this priority**: Systematic planning prevents rework and ensures no agent is missed. P2 because it depends on audit results and registry generation.

**Independent Test**: Can generate agent restructuring plan identifying each agent, required changes, impact on dependent scripts/workflows, testing strategy, and estimated effort. Plan must be decomposable into individual agent specs.

**Acceptance Scenarios**:

1. **Given** agent audit and registry are complete, **When** restructuring plan is generated, **Then** plan lists all agents with current state assessment, required changes per agent, and priority ranking
2. **Given** restructuring plan exists, **When** individual agent specs are created, **Then** each spec references the master plan and covers: current state, target structure, skill compliance work, testing approach
3. **Given** plan is in place, **When** agents are restructured, **Then** work can proceed agent-by-agent independently without blocking other agents

---

### User Story 7 - Migrate Root Scripts Into Agent Folders with Tests (Priority: P3)

As a system maintainer, I need to plan the reconstruction of root-level scripts (from `scripts/` folder) as agent-native components with proper tests and documentation, so that agents are self-contained and don't depend on external scripts, with a deprecation path for root scripts.

**Why this priority**: Consolidation of scripts into agents improves maintainability and reduces external dependencies. P3 because it's a refactoring that can happen after P1/P2 work is complete; root scripts can continue to work during restructuring.

**Independent Test**: Can identify scripts that logically belong to specific agents, map each script to target agent, plan test coverage, and generate migration roadmap with deprecation timeline.

**Acceptance Scenarios**:

1. **Given** agents have been restructured, **When** script audit runs, **Then** audit identifies all scripts in `scripts/` folder and maps each to the agent it logically belongs to
2. **Given** script-to-agent mapping is complete, **When** migration plan is created, **Then** plan specifies: target agent for each script, required test coverage, deprecation timeline for root script
3. **Given** scripts are moved into agents, **When** root scripts are marked for deprecation, **Then** deprecation notices are added with migration instructions and timeline

---

### Edge Cases & Resolutions

- **Missing skill dependencies**: Agents with missing skill dependencies are flagged and treated as incomplete. Restructuring cannot complete for that agent until the missing dependency is created or the reference is removed.
- **Skill version conflicts**: When two agents need different versions of the same skill, agent-specific version-pinned copies are permitted in the agent folder. If versions are identical, agents MUST use the shared root skill to avoid duplication.
- **Multi-agent script dependencies**: Scripts that logically depend on multiple agents are decomposed into agent-specific subscripts. If logic is truly shared across agents, it becomes a reusable library/utility that each agent references rather than duplicates.
- **Cross-repository script dependencies**: Deprecation of root scripts follows a timeline documented in User Story 7. Consuming repositories are notified via changelog and migration guide before deprecation.
- **Registry consistency**: Agent registries are auto-generated from filesystem state and regenerated on demand. No manual registry maintenance required; registry format is machine-parseable JSON to support automation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST audit all agent files and identify breaking references from renames/moves, generating a report with file locations, line numbers, and severity
- **FR-002**: System MUST enforce standardized folder structure for all agents. Each agent MUST contain: `AGENT.md` (definition), `CHANGELOG.md` (version history), `package.json` (dependencies), `README.md` (documentation), `skills/` (subfolder), `tests/` (subfolder), `config/` (subfolder). Tests MUST use framework matching agent type (Jest for JS agents, Bats for shell scripts, Playwright for UI agents)
- **FR-003**: System MUST identify all agent skills and root skills, organized by category subfolders (skills/{category}/{scope}-{title} pattern), compare them for duplication, and generate consolidation recommendations with duplication scores
- **FR-004**: System MUST create an agents registry listing all agents with metadata (name, description, version, folder path, status), discoverable and machine-parseable
- **FR-005**: System MUST create a skills registry for each agent documenting all skills used, their agentskills.io specification compliance status, schema version, and missing/invalid fields
- **FR-006**: System MUST validate all agent skills against agentskills.io specification and report compliance violations with specific, actionable remediation steps
- **FR-007**: System MUST trace and document skill dependencies across agents and identify shared skills that should be consolidated into root skills folder
- **FR-008**: System MUST map all root scripts to their logically-related agents and generate migration/deprecation plan with timeline
- **FR-009**: System MUST generate decomposed, agent-by-agent restructuring specifications that can be worked in parallel with clear acceptance criteria
- **FR-010**: System MUST track status of each agent's restructuring (pending, in-progress, completed, needs-remediation) in registry

### Key Entities

- **Agent**: A self-contained module with standardized folder structure: AGENT.md (definition), CHANGELOG.md (version history), package.json (dependencies), README.md (documentation), skills/ (agent-specific skills), tests/ (test files using Jest/Bats/Playwright per agent type), config/ (configuration files). Contains metadata (name, description, version, status)
- **Skill**: A reusable component that can be used by one or more agents. Has agentskills.io specification compliance status and schema version
- **AgentRegistry**: Machine-readable catalog of all agents with metadata, dependencies, skills, and restructuring status
- **SkillRegistry**: Catalog of all skills (root and agent-specific) with compliance status, usage count, duplication analysis
- **Script**: Executable utility in root `scripts/` folder; can be mapped to a logical owner agent for migration planning
- **Restructuring Plan**: Detailed specification for agent-by-agent restructuring with scope, timeline, and dependencies

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of broken references from agent renames/moves are identified and fixed; CI passes with no import/path errors
- **SC-002**: 100% of agents in `agents/` folder conform to standardized folder structure as defined in standardization spec
- **SC-003**: Deduplication audit identifies all duplicate and near-duplicate skills; consolidation plan achieves zero true duplicates post-implementation
- **SC-004**: Agent registry and skills registry are generated in JSON format and validated; registries are at `agents/registry.json` (consolidated) and `agents/{agent}/registry.json` (per-agent); both are auto-generated from filesystem state on demand
- **SC-005**: 100% of agent skills pass agentskills.io specification compliance or have documented, justified exceptions
- **SC-006**: Skill dependency graph is complete and accurate; shared skills in root folder are used by all agents that need them (no local copies of shared skills)
- **SC-007**: All root scripts have been mapped to logical agent owners; migration/deprecation plan is created with zero unmapped scripts
- **SC-008**: Agent restructuring can be decomposed into individual agent specs with clear priority order and no circular dependencies
- **SC-009**: All reference breakages from renames are fixed; dependent workflows and scripts execute successfully on first run
- **SC-010**: Phase 1 (this spec): 30-day completion broken into 4 phases: Phase 1 (Days 1–5) audit & broken reference remediation; Phase 2 (Days 6–12) standardization & deduplication; Phase 3 (Days 13–20) registry generation & compliance validation; Phase 4 (Days 21–30) agent restructuring specifications & planning. Linting, test creation, and comprehensive documentation phases are deferred to Phase 2 spec

## Assumptions

- **Scope boundaries**: This specification focuses on agents in `agents/` folder only (not root-level spec-based agents yet - that's Phase 2/lower priority). Root scripts will be mapped but not migrated until Phase 3.
- **Breaking changes**: Agent file renames in the branch have already occurred; this spec focuses on identifying and remediating the resulting broken references, not preventing future renames
- **Skills compliance**: All agent skills should eventually comply with agentskills.io specification; until then, deviations will be documented with rationale
- **Shared vs. agent-specific skills**: Skills that are used by 2+ agents should be consolidated to root `skills/` folder; skills used by 1 agent can stay in agent folder if agent-specific customization is justified. Version-pinned skill copies are permitted in agent folders ONLY when versions differ from root; identical versions must use the shared root skill.
- **Missing skill dependencies**: Agents with missing skill dependencies are treated as incomplete and block restructuring completion until the dependency is created or reference removed.
- **Registry format & automation**: Registries are machine-generated from filesystem state in JSON format: `agents/registry.json` (consolidated) and `agents/{agent}/registry.json` (per-agent). Registries are auto-generated on demand and never manually maintained. Regeneration is triggered during audit, consolidation, and validation phases.
- **Multi-agent script ownership**: Scripts with dependencies on multiple agents are decomposed into agent-specific subscripts or elevated to shared utilities rather than duplicated across agents.
- **Backward compatibility**: Root scripts continue to work during restructuring; deprecation happens after agents are self-contained. Consuming repositories receive migration guidance before deprecation.
- **External dependencies**: agentskills.io specification is authoritative; any conflicts with current agent skill structure should be resolved in favor of specification compliance
- **Testing framework selection**: Testing uses context-appropriate frameworks: Jest (JavaScript agents/skills, `__tests__/` folder convention), Bats (shell scripts, `tests/` folder), Playwright (UI-heavy agents, `tests/e2e/` folder). Each agent documents its chosen framework in README.md. Minimum target is 80% coverage; actual implementation deferred to Phase 2 spec with dedicated test creation phase
- **Skills naming convention**: All skills MUST follow naming pattern `{category}/{scope}-{title}` where category is a categorical subfolder in `skills/` (e.g., `skills/validation/broken-refs-finder`, `skills/audit/structure-checker`). Categories organize skills functionally (validation, audit, reporting, registry, etc.)
- **Phase 1 scope**: This specification covers Phase 1 work (audit, standardization, skill consolidation, registry generation, planning). Linting phase, test creation phase, and comprehensive documentation phase are explicitly deferred to Phase 2 spec to keep Phase 1 30-day timeline realistic and enable shipping Phase 1 PR without linting/test gates
- **Deferred user stories**: Plugin creation for Claude/Copilot (User Story 8) and SpecKit skill integration (User Story 9) are deferred to Phase 2 spec. Phase 1 focuses on core restructuring infrastructure (7 user stories)
- **Timeline**: 30-day execution target for Phase 1 across 4 phases: Phase 1 (Days 1–5) audit & broken references; Phase 2 (Days 6–12) standardization & deduplication; Phase 3 (Days 13–20) registries & compliance; Phase 4 (Days 21–30) restructuring planning & decomposition

## Clarifications

### Session 2026-09-18 (Initial Specification Clarifications)

- Q: How should the system handle agents requiring different versions of the same skill? → A: Option B - Allow version-pinned skill copies in individual agents only when versions differ; identical versions must use root shared skill
- Q: How should broken or missing skill dependencies be handled during restructuring? → A: Option A - Flag missing dependencies; agent restructuring is incomplete until dependency is created or reference removed
- Q: What is the authoritative format and location for the agent registry and skills registry? → A: Option A - JSON registries in agent folders (`agents/{agent}/registry.json`) plus consolidated root registry (`agents/registry.json`); auto-generated from filesystem
- Q: How should scripts that logically depend on multiple agents be handled during migration? → A: Option B - Decompose multi-agent scripts into agent-specific subscripts; each agent owns relevant portion; shared logic becomes reusable library/utility
- Q: What is the minimum viable timeline and phasing for the 30-day completion estimate? → A: Phase 1 (Days 1–5) Audit & broken reference remediation; Phase 2 (Days 6–12) Standardize structure & deduplication; Phase 3 (Days 13–20) Registries & compliance; Phase 4 (Days 21–30) Agent restructuring specs & planning

### Session 2026-09-18 (Critical Gap Resolution via /speckit-analyze)

- Q: Should we extend the 30-day timeline to add dedicated Linting, Test Creation, and Documentation phases, or defer them to Phase 2? → A: Option C - Phased rollout: Phase 1 (this spec) delivers core restructuring in 30 days; Linting, Test Creation, and Documentation phases deferred to Phase 2 spec
- Q: What files and folder structure should EVERY agent contain? → A: Option B - Recommended: AGENT.md, CHANGELOG.md, package.json, README.md, skills/, tests/, config/
- Q: Which testing framework should agents mandate for test coverage? → A: Option D - Mixed (context-dependent): Jest for JavaScript agents (__tests__/ folders), Bats for shell scripts (tests/ folder), Playwright for UI agents (tests/e2e/ folder)
- Q: Should skills adopt a categorical naming convention {category}/{scope}-{title} with categorical subfolders? → A: Yes - Adopt pattern with example categories: skills/validation/, skills/audit/, skills/reporting/, skills/registry/
- Q: Should we add User Stories 8 (Plugins) & 9 (SpecKit Integration) to this spec, or defer to Phase 2? → A: Option A - Defer both to Phase 2 spec; Phase 1 focuses on core restructuring infrastructure (7 user stories)

## Notes

This is an exceptionally large initiative that will likely require decomposition into multiple phase-based specifications per agent. The scope here is P1/P2 work (audit, consolidation, registry creation, planning). P3 work (script migration, root agent movement) will be planned but deferred to later specifications.
