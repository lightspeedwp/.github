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

### Edge Cases

- What happens when an agent has skill dependencies on skills that don't exist in root or agent folders?
- How should we handle agents that have conflicting skill dependencies (two agents need different versions of same skill)?
- What should we do if a script references multiple agents (belongs to none of them specifically)?
- How should deprecation of root scripts work when other repositories depend on them?
- How do we ensure registry updates stay in sync when agents are modified outside the consolidation workflow?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST audit all agent files and identify breaking references from renames/moves, generating a report with file locations, line numbers, and severity
- **FR-002**: System MUST enforce standardized folder structure for all agents: agent definition files, skills subfolder, tests subfolder, configuration files, README documentation
- **FR-003**: System MUST identify all agent skills and root skills, compare them for duplication, and generate consolidation recommendations with duplication scores
- **FR-004**: System MUST create an agents registry listing all agents with metadata (name, description, version, folder path, status), discoverable and machine-parseable
- **FR-005**: System MUST create a skills registry for each agent documenting all skills used, their agentskills.io specification compliance status, schema version, and missing/invalid fields
- **FR-006**: System MUST validate all agent skills against agentskills.io specification and report compliance violations with specific, actionable remediation steps
- **FR-007**: System MUST trace and document skill dependencies across agents and identify shared skills that should be consolidated into root skills folder
- **FR-008**: System MUST map all root scripts to their logically-related agents and generate migration/deprecation plan with timeline
- **FR-009**: System MUST generate decomposed, agent-by-agent restructuring specifications that can be worked in parallel with clear acceptance criteria
- **FR-010**: System MUST track status of each agent's restructuring (pending, in-progress, completed, needs-remediation) in registry

### Key Entities

- **Agent**: A self-contained module with definition, skills, tests, configuration, and documentation. Contains metadata (name, description, version, status)
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
- **SC-004**: Agent registry and skills registry are generated and validated; both are machine-parseable and can be auto-generated from filesystem state
- **SC-005**: 100% of agent skills pass agentskills.io specification compliance or have documented, justified exceptions
- **SC-006**: Skill dependency graph is complete and accurate; shared skills in root folder are used by all agents that need them (no local copies of shared skills)
- **SC-007**: All root scripts have been mapped to logical agent owners; migration/deprecation plan is created with zero unmapped scripts
- **SC-008**: Agent restructuring can be decomposed into individual agent specs with clear priority order and no circular dependencies
- **SC-009**: All reference breakages from renames are fixed; dependent workflows and scripts execute successfully on first run
- **SC-010**: Restructuring plan shows 30-day completion estimate with clear phase breakdown (audit/consolidation/migration/validation)

## Assumptions

- **Scope boundaries**: This specification focuses on agents in `agents/` folder only (not root-level spec-based agents yet - that's Phase 2/lower priority). Root scripts will be mapped but not migrated until Phase 3.
- **Breaking changes**: Agent file renames in the branch have already occurred; this spec focuses on identifying and remediating the resulting broken references, not preventing future renames
- **Skills compliance**: All agent skills should eventually comply with agentskills.io specification; until then, deviations will be documented with rationale
- **Shared vs. agent-specific skills**: Skills that are used by 2+ agents should be consolidated to root `skills/` folder; skills used by 1 agent can stay in agent folder if agent-specific customization is justified
- **Registry automation**: Registries should be machine-generated from filesystem state (agent folders, skill folders, metadata files) rather than manually maintained; updates should be automatic
- **Backward compatibility**: Root scripts continue to work during restructuring; deprecation happens after agents are self-contained
- **External dependencies**: agentskills.io specification is authoritative; any conflicts with current agent skill structure should be resolved in favor of specification compliance
- **Testing coverage**: Each agent should have unit tests for its skills and integration tests for cross-agent interactions; test coverage should be at least 80%

## Notes

This is an exceptionally large initiative that will likely require decomposition into multiple phase-based specifications per agent. The scope here is P1/P2 work (audit, consolidation, registry creation, planning). P3 work (script migration, root agent movement) will be planned but deferred to later specifications.
