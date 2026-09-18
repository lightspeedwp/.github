# Implementation Plan: Agent Structure Standardization & Skill Consolidation

**Branch**: `refactor/agents-restructure-consolidate` | **Date**: 2026-09-18 | **Spec**: [014-agents-restructure-consolidate/spec.md](./spec.md)

**Input**: Feature specification from feature spec with 7 user stories, 10 functional requirements, and 10 success criteria across 4-phase 30-day timeline.

## Summary

Restructure all agents in the `agents/` folder to follow standardized folder patterns (agent definition, skills, tests, configuration), consolidate duplicate skills, create machine-readable registries for discovery and compliance validation, and plan phased agent-by-agent restructuring. Scope covers P1 work (audit, broken references, standardization) and P2 work (registries, compliance, planning). P3 (script migration, root agent movement) deferred to future specs.

## Technical Context

**Language/Version**: Node.js/JavaScript (monorepo scripts), Git + GitHub as operational platform

**Primary Dependencies**:

- agentskills.io specification (external authority for skill validation)
- Existing agent structures (changelog-agent, issue-agent, release-agent, reviewer-agent with subfolders)
- Root `agents/` folder containing 50+ agents at various structure maturity levels

**Storage**: Filesystem-based (agent folders, skill folders, registry JSON files); Git for versioning and traceability

**Testing**:

- Unit: Audit script validation, registry generation correctness
- Integration: Broken reference identification, end-to-end restructuring workflows
- Validation: Acceptance scenario testing per user story, compliance gate validation

**Target Platform**: GitHub repository automation; runs on CI/CD workflows and local developer machines

**Project Type**: Repository automation & governance tooling; produces audits, registries, and migration plans

**Performance Goals**:

- Audit script: complete scan of 50+ agents + 1000+ skills in <5 minutes
- Registry generation: produce consolidated registry from filesystem state in <1 minute
- Compliance validation: validate all agent skills against agentskills.io spec in <2 minutes

**Constraints**:

- No breaking changes to existing agent functionality during restructuring (backward compatibility)
- Registry updates must be automatic/on-demand (no manual curation)
- Skill versioning: only version-pinned copies allowed when versions differ; identical versions must share root skill
- Missing skill dependencies must block agent restructuring completion
- All decisions must be reversible (can roll back agent restructuring if issues discovered)

**Scale/Scope**:

- ~50 agents in `agents/` folder (varying structure maturity)
- ~1000+ skills across agent folders + root `skills/` folder
- ~200+ scripts in root `scripts/` folder (to be mapped, migrated in Phase 3)
- 30-day timeline with 4 concurrent/sequential phases

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**LightSpeed .github Control Plane Governance Constraints:**

1. ✅ **Specification-First Process (Principle VII)**: This work follows SpecKit workflow (Specify → Clarify → Plan → Tasks → Implement). Specification quality validated before planning.

2. ✅ **Asset Boundaries (Principle III)**: Agents, skills, workflows are **portable reusable assets** and MUST live in top-level `agents/`, `skills/`, `workflows/` folders, NOT under `.github/`. Plan ensures this is preserved/enforced.

3. ✅ **Technology-Agnostic Guidance (Principle IV)**: Registry structure, standardized folder patterns, skill consolidation rules apply universally across all agent types and agent implementations (no language-specific prescriptions).

4. ✅ **Requirements Quality Standards (Principle VII)**: Specification passes 8-dimension quality validation checklist (Completeness, Clarity, Consistency, Measurability, Scenario Coverage, Edge Cases, Dependencies, Ambiguities).

5. ✅ **Automated Validation & Metrics (Principle X)**: Plan includes automated audit scripts for broken references, deduplication detection, compliance validation, and registry generation. Manual audits used only to verify automation accuracy.

**No violations identified.** Plan aligns with all governance principles.

## Project Structure

### Documentation (this feature)

```text
specs/014-agents-restructure-consolidate/
├── spec.md              # Feature specification
├── plan.md              # This file (planning phase output)
├── research.md          # Phase 0 research findings (TO BE GENERATED)
├── data-model.md        # Phase 1 data model & registries (TO BE GENERATED)
├── quickstart.md        # Phase 1 validation guide (TO BE GENERATED)
├── contracts/           # Phase 1 interface contracts (TO BE GENERATED)
└── tasks.md             # Phase 2 task decomposition (via /speckit-tasks command)
```

### Source Code (repository root)

```text
agents/
├── {50+ agents}/           # Agents to be restructured
│   ├── *.agent.md         # Agent definition
│   ├── skills/            # Agent-specific skills (to be consolidated)
│   ├── tests/             # Agent tests
│   └── README.md          # Agent documentation
├── registry.json          # Consolidated agent registry (TO BE GENERATED)

skills/
├── {shared skills}/       # Root shared skills (to be consolidated)
├── registry.json          # Consolidated skills registry (TO BE GENERATED)

scripts/
├── {200+ scripts}/        # Scripts to be mapped to agents (Phase 3)
└── validation/
    ├── audit-agents.js    # Audit broken references (Phase 1)
    ├── dedup-skills.js    # Identify duplicate skills (Phase 2)
    ├── validate-compliance.js  # Validate agentskills.io compliance (Phase 3)
    └── generate-registry.js    # Generate registries (Phase 2-3)
```

**Structure Decision**: Distributed agent-based structure with consolidated root registries. Each agent is a self-contained module in `agents/{agent-name}/` with standardized folder layout. Shared skills in root `skills/` folder. Registries in JSON format at both `agents/registry.json` and `agents/{agent}/registry.json` for consolidated and per-agent views.

## Complexity Tracking

No constraint violations requiring justification. Plan follows all governance principles without compromise.

---

## Phase 0: Research & Unknowns Resolution

**Output**: `research.md` resolving all technical unknowns

### Research Tasks

1. **Agent Structure Standardization Reference**
   - Decision needed: Exact folder structure to enforce across all agents (building on prd-agent pattern)
   - Research: Document prd-agent structure, identify inconsistencies in existing agents, propose standardized pattern
   - Questions: What should be in `{agent}/config/`, `{agent}/includes/` vs `{agent}/skills/`?

2. **agentskills.io Specification Compliance Requirements**
   - Decision needed: Which agentskills.io fields are mandatory vs optional for this project
   - Research: Review agentskills.io specification, identify required and recommended fields, create validation checklist
   - Questions: How strict should validation be? Should we auto-fix or block on violations?

3. **Skill Deduplication Algorithm & Scoring**
   - Decision needed: How to identify "duplicate" skills (exact match vs semantic similarity)
   - Research: Define deduplication scoring (file content hash for exact, cosine similarity for semantic), determine threshold
   - Questions: Should we flag near-duplicates (90% similar) as potential consolidation candidates?

4. **Registry Auto-Generation Strategy**
   - Decision needed: Which metadata should be auto-generated vs manually maintained
   - Research: Document registry schema, identify generation triggers (filesystem changes, CI pipeline, scheduled), determine refresh strategy
   - Questions: Should registry generation run on every commit, or on-demand via CLI command?

5. **Broken Reference Identification Scope**
   - Decision needed: What counts as a "broken reference" (import paths, script references, workflow references)
   - Research: Map all reference types across repository (JS imports, shell script paths, GitHub Actions workflow references), identify scanning approach
   - Questions: Should we scan GitHub Actions workflows for hardcoded agent paths, or just repository source files?

6. **Skill Versioning & Conflict Resolution**
   - Decision needed: How to store skill versions; how to handle version conflicts between agents (clarified: version-pinned copies allowed only for conflicts)
   - Research: Document versioning strategy in registry, define version pinning mechanism, document conflict resolution workflow
   - Questions: Should version pinning be in skill metadata or registry entry?

---

## Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete with all technical decisions

### Phase 1A: Data Model

**Output**: `data-model.md` documenting entities, relationships, and state

#### Core Entities

**Agent**

- Attributes: name, description, version, folder_path, status (active|deprecated|in-restructure|needs-remediation)
- Metadata: created_date, last_modified, restructure_priority (P1|P2|P3), owner_team
- Relationships: has_skills (1..many), depends_on (0..many), references_scripts (0..many)
- Validation: name matches folder name; version follows semantic versioning; status is one of canonical values
- Lifecycle: PENDING → IN_RESTRUCTURE → NEEDS_REMEDIATION | COMPLETED

**Skill**

- Attributes: name, agent (nullable, null for root), version, schema_version, description, status
- Compliance: agentskills_compliant (yes|no), violations (string array), last_validated_date
- Relationships: used_by (agents), depends_on (skills), has_tests
- Deduplication: content_hash (for exact match), semantic_similarity_score (for near-duplicates)
- Validation: skill_type matches agentskills specification; required fields present

**Registry (Agent)**

- Attributes: timestamp, generated_from_commit, total_agents, agents_in_scope, status_breakdown
- Entries: [{ agent metadata, restructure_status, skill_count, missing_dependencies, validation_errors }]
- Generation: Automatic from filesystem scan of `agents/` folder
- Format: JSON at `agents/registry.json` (consolidated) + `agents/{agent}/registry.json` (per-agent)

**Registry (Skills)**

- Attributes: timestamp, total_skills, root_skills_count, agent_specific_count, compliance_summary
- Entries: [{ skill metadata, location, usage_count, duplicates_found, compliance_status }]
- Generation: Automatic from filesystem scan of `agents/*/skills/` + `skills/` folders
- Format: JSON at `skills/registry.json`

**Script Mapping** (Phase 3 planning only)

- Attributes: script_path, agent_owner, owner_type (primary|secondary|shared), migration_status
- Relationships: references_agents (1..many), depends_on_scripts (0..many)
- Validation: Every script maps to at least one agent owner

#### State Transitions

Agent Restructuring States:

- PENDING → IN_RESTRUCTURE → (COMPLETED | NEEDS_REMEDIATION)
- NEEDS_REMEDIATION → IN_RESTRUCTURE | BLOCKED

Registry Generation States:

- STALE → GENERATING → (VALID | INVALID)

---

### Phase 1B: Interface Contracts

**Output**: `contracts/` directory documenting all external interfaces

#### `contracts/registry-schema.json`

Defines JSON schema for both agent and skill registries:

- Required fields per entry (name, version, status, timestamps)
- Optional fields (descriptions, metadata, relationships)
- Validation rules (semantic versioning for versions, enum values for status)
- Examples of valid/invalid entries

#### `contracts/audit-report-format.md`

Defines structure of broken reference audit report:

- Report header (timestamp, scope, summary counts)
- Reference categories (import paths, script paths, workflow references)
- Per-reference entry format (file location, line number, reference type, severity)
- Remediation guidance per severity level

#### `contracts/compliance-validation-report.md`

Defines structure of agentskills compliance validation output:

- Compliance summary (pass/fail, violation count)
- Per-skill validation (compliance status, missing fields, invalid values)
- Violation severity levels (critical, warning, info)
- Auto-fixable vs manual remediation items

---

### Phase 1C: Quickstart Validation Guide

**Output**: `quickstart.md` documenting end-to-end validation scenarios

#### Scenario 1: Audit Broken References

Prerequisites: Repository with renamed agents, scripts with broken imports

Steps:

1. Run audit script: `npm run audit:agents -- --broken-references`
2. Review audit report: `agents/reports/broken-references-audit.json`
3. Validate report identifies all broken imports
4. Remediate sample reference; re-run audit to confirm fix

Expected: Audit report lists all broken references with locations

#### Scenario 2: Consolidate Duplicate Skills

Prerequisites: Multiple agents with duplicate skill implementations

Steps:

1. Run deduplication audit: `npm run audit:agents -- --dedup-skills`
2. Review deduplication report: `agents/reports/skill-deduplication.json`
3. Identify duplicate skills with similarity scores
4. Create consolidation plan: move duplicates to root, update references
5. Validate all references updated; no duplicates remain

Expected: Deduplication audit shows consolidated skills, agents reference root version

#### Scenario 3: Generate & Validate Registries

Prerequisites: Agents in standardized structure; skills comply with agentskills

Steps:

1. Generate agent registry: `npm run registry:generate -- agents`
2. Generate skills registry: `npm run registry:generate -- skills`
3. Validate registries: `npm run registry:validate`
4. Review compliance report: `agents/reports/compliance-validation.json`
5. Address violations; re-run validation

Expected: Registries generated successfully; compliance validation passes

#### Scenario 4: Dependency Analysis

Prerequisites: Agents restructured; registries generated

Steps:

1. Generate dependency graph: `npm run audit:agents -- --dependency-graph`
2. Review graph for circular dependencies
3. Identify shared skills used across agents
4. Validate no agent-specific duplicates of shared skills

Expected: Dependency graph shows relationships; no circular dependencies

---

## Phase Summary

| Phase | Duration | Deliverable | Gate | Notes |
|-------|----------|-------------|------|-------|
| 0 (Research) | Days 1–5 | research.md | Constitution compliance | Resolve unknowns; establish decisions |
| 1 (Design) | Days 6–12 | data-model.md, contracts/, quickstart.md | Spec quality re-check | Define entities, contracts, validation |
| 2 (Tasks) | Days 13–20 | tasks.md (via /speckit-tasks) | Task decomposition validation | Break into 96 actionable tasks |
| 3 (Implement) | Days 21–30 | Agent restructuring work | Acceptance scenario validation | Execute per-agent restructuring |

**Next Command**: `/speckit-tasks` (Phase 2) to decompose plan into 96 actionable tasks with clear acceptance criteria.

---

**Document Status**: READY FOR PHASE 0 RESEARCH

All gates passed. Technical decisions documented. Ready to proceed with research and design phases.
