# Tasks: Agent Structure Standardization & Skill Consolidation (Enhanced)

**Input**: Clarified specification with 5 resolved gaps and Phase 1 design artifacts

**Prerequisites**: spec.md, plan.md, research.md, data-model.md, contracts/, quickstart.md

**Organization**: Tasks grouped by user story for independent implementation

**Total Tasks**: ~125 tasks across 10 phases

**Timeline**: 30 days across 4 concurrent phases (P1 audit parallel with P2-4 planning)

---

## Format: `- [ ] [TaskID] [P?] [Story?] Description with exact file path`

- **[P]**: Parallelizable (different files, no inter-task dependencies)
- **[Story]**: User story label (US1-US7) - REQUIRED for story phases only
- **File paths**: Exact repository-relative paths

---

## Phase 1: Setup (Shared Infrastructure) — Days 1–2

**Purpose**: Project initialization and audit tooling foundation

- [x] T001 Create scripts/validation/ directory structure for audit and validation tools
- [x] T002 [P] Create agents/reports/ directory for audit and registry output files
- [x] T003 [P] Create .github/specs/014-agents-restructure-consolidate/reports/ for consolidation reports
- [x] T004 [P] Initialize npm workspace for validation scripts (if not already configured)
- [x] T005 [P] Setup logging and reporting utilities in scripts/validation/lib/reporting.js
- [x] T006 Create base configuration file scripts/validation/config.json with agent paths and thresholds
- [x] T007 Setup git hook scripts for pre-commit registry freshness validation in .github/hooks/pre-commit-registry.sh
- [x] T008 [P] Create documentation: RESTRUCTURING_GUIDE.md with overview and execution instructions in .github/docs/

---

## Phase 2: Foundational (Blocking Prerequisites) — Days 2–5

**Purpose**: Core audit and analysis infrastructure that blocks ALL user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Implement audit script core in scripts/validation/audit-agents.js (imports, logging, error handling)
- [x] T010 [P] Implement reference type detection engine in scripts/validation/lib/reference-detector.js (JS imports, shell paths, workflows)
- [x] T011 [P] Implement file scanner in scripts/validation/lib/file-scanner.js to enumerate agents/, skills/, .github/workflows/ recursively
- [x] T012 Implement broken reference identification in scripts/validation/lib/broken-refs-finder.js (compare refs against actual paths, severity levels)
- [x] T013 [P] Implement audit report generator in scripts/validation/lib/audit-report-builder.js (per contracts/audit-report-format.md schema)
- [x] T014 [P] Create registry schema validation in scripts/validation/lib/registry-validator.js (per contracts/registry-schema.json)
- [x] T015 [P] Implement deduplication detection engine in scripts/validation/lib/dedup-engine.js (SHA-256 hashing, cosine similarity @ 85% threshold)
- [x] T016 Implement agent structure checker in scripts/validation/lib/structure-checker.js (verify all 7 components: AGENT.md, CHANGELOG.md, package.json, README.md, skills/, tests/, config/)
- [x] T017 [P] Create npm scripts in package.json for all validation commands (npm run audit:agents, audit:broken-refs, audit:structure, audit:dedup, audit:registry, validate:compliance, audit:all)

---

## Phase 3: User Story 1 - Audit & Remediate Broken References (P1) — Days 3–8

**Goal**: Identify and fix all broken references from agent renames

**Independent Test**: Run reference audit, identify all broken references, apply fixes, verify CI passes

- [x] T018 [P] [US1] Document reference types and detection patterns in .github/docs/REFERENCE_TYPES.md
- [x] T019 [US1] Implement JavaScript import detection in scripts/validation/lib/reference-detector.js (require(), import statements)
- [x] T020 [P] [US1] Implement shell path detection in scripts/validation/lib/reference-detector.js (hardcoded paths in .sh files)
- [x] T021 [P] [US1] Implement workflow reference detection in scripts/validation/lib/reference-detector.js (agent invocations in .github/workflows/*.yml)
- [x] T022 [US1] Generate broken reference audit report and save to agents/reports/broken-references-audit.json
- [x] T023 [P] [US1] Create reference fix recommendations in scripts/validation/lib/fix-suggester.js (suggest correct paths)
- [x] T024 [US1] Implement auto-fix capability for identified broken references in scripts/validation/lib/auto-fixer.js
- [x] T025 [P] [US1] Create validation script to verify all fixes executed successfully in scripts/validation/verify-fixes.js
- [x] T026 [P] [US1] Document broken reference remediation process in .github/docs/BROKEN_REFERENCE_REMEDIATION.md
- [x] T027 [US1] Generate summary report of all broken references fixed (count, types, impact)
- [x] T028 [P] [US1] Create integration tests for reference detection and fixing in scripts/validation/**tests**/reference-detection.test.js
- [x] T029 [US1] Verify all dependent scripts execute successfully after fixes applied
- [x] T030 [P] [US1] Validate CI workflows pass without import/path errors
- [x] T031 [US1] Create CHANGELOG entries for all agents with broken references that were fixed
- [x] T032 [P] [US1] Generate final broken reference audit report and save to agents/reports/broken-references-audit-final.json

---

## Phase 4: User Story 2 - Standardize Agent Folder Structure (P1) — Days 6–12

**Goal**: All agents conform to 7-item folder structure template

**Independent Test**: Audit each agent, verify all 7 components present, document deviations

- [ ] T033 [P] [US2] Create agent folder structure template in .github/templates/agent-structure-template/ with all 7 components
- [ ] T034 [US2] Document standardized agent folder structure in .github/docs/AGENT_FOLDER_STRUCTURE.md (mandate: AGENT.md, CHANGELOG.md, package.json, README.md, skills/, tests/, config/)
- [ ] T035 [P] [US2] Implement folder structure validation in scripts/validation/lib/structure-checker.js
- [ ] T036 [US2] Generate structure audit report and save to agents/reports/structure-audit.json
- [ ] T037 [P] [US2] Identify agents missing required components (per Decision 1: 7-item template)
- [ ] T038 [P] [US2] Create remediation recommendations for non-conformant agents in agents/reports/structure-remediation-recommendations.json
- [ ] T039 [US2] Document agent CHANGELOG.md format requirements in .github/docs/CHANGELOG_FORMAT.md
- [ ] T040 [P] [US2] Document agent package.json requirements in .github/docs/PACKAGE_JSON_REQUIREMENTS.md
- [ ] T041 [US2] Document agent README.md template in .github/templates/agent-structure-template/README.md
- [ ] T042 [P] [US2] Create validation script for package.json compliance in scripts/validation/lib/package-json-validator.js
- [ ] T043 [US2] Generate summary: total agents audited, conformant count, deviations list
- [ ] T044 [P] [US2] Create unit tests for structure validation in scripts/validation/**tests**/structure-validation.test.js

---

## Phase 5: User Story 3 - Consolidate & Deduplicate Skills (P1) — Days 9–15

**Goal**: Identify all duplicate/near-duplicate skills; create consolidation plan

**Independent Test**: Run deduplication audit, identify duplicates with similarity scores, create consolidation recommendations

- [ ] T045 [P] [US3] Implement skills catalog scanner in scripts/validation/lib/skills-catalog.js (enumerate agents/*/skills/ and skills/)
- [ ] T046 [US3] Document skills naming convention in .github/docs/SKILLS_NAMING_CONVENTION.md (mandate: {category}/{scope}-{title} pattern)
- [ ] T047 [P] [US3] Create category subdirectories in skills/ for: validation, audit, reporting, registry, utilities (per Decision 2)
- [ ] T048 [P] [US3] Implement SHA-256 content hashing in scripts/validation/lib/dedup-engine.js
- [ ] T049 [P] [US3] Implement cosine similarity calculation in scripts/validation/lib/dedup-engine.js (85% threshold per Decision 3)
- [ ] T050 [US3] Generate deduplication audit report and save to agents/reports/deduplication-audit.json
- [ ] T051 [P] [US3] Identify exact duplicate skills (100% hash match) in deduplication-audit.json
- [ ] T052 [P] [US3] Identify near-duplicate skills (85%+ similarity) in deduplication-audit.json
- [ ] T053 [US3] Create consolidation recommendations specifying: which agents use shared skill vs agent-specific variant
- [ ] T054 [P] [US3] Document skill consolidation strategy in .github/docs/SKILL_CONSOLIDATION_STRATEGY.md
- [ ] T055 [US3] Create impact analysis for each consolidation recommendation (affected agents, breaking changes if any)
- [ ] T056 [P] [US3] Document skill deduplication process in .github/docs/SKILL_DEDUPLICATION_PROCESS.md
- [ ] T057 [US3] Generate summary: total skills scanned, exact duplicates found, near-duplicates found, consolidation candidates

---

## Phase 6: User Story 4 - Create Skills Registry (P2) — Days 12–18

**Goal**: Generate machine-readable skills registry with agentskills.io compliance tracking

**Independent Test**: Generate registry from filesystem, validate schema, check compliance status

- [ ] T058 [P] [US4] Implement skills registry generator in scripts/validation/lib/skills-registry-generator.js
- [ ] T059 [US4] Scan all agent skills in agents/*/skills/ and root skills/ in scripts/validation/lib/skills-scanner.js
- [ ] T060 [P] [US4] Implement agentskills.io compliance checker in scripts/validation/lib/compliance-checker.js (per Decision 1 research)
- [ ] T061 [P] [US4] Extract skill metadata (id, name, version, location, type, description) and populate registry
- [ ] T062 [US4] Generate consolidated skills registry and save to skills/registry.json
- [ ] T063 [P] [US4] Generate per-category skills registries (skills/{category}/registry.json) per Decision 4
- [ ] T064 [P] [US4] Validate all registry files against contracts/registry-schema.json
- [ ] T065 [US4] Generate compliance validation report and save to .github/specs/014-agents-restructure-consolidate/reports/compliance-validation-report.json
- [ ] T066 [P] [US4] Identify skills with agentskills.io violations (blocking and warning severity)
- [ ] T067 [US4] Create remediation steps for each compliance violation in compliance-validation-report.json
- [ ] T068 [P] [US4] Document skills registry format in .github/docs/SKILLS_REGISTRY_FORMAT.md
- [ ] T069 [US4] Generate summary: total skills registered, compliant count, violation count, compliance percentage

---

## Phase 7: User Story 5 - Create Agent Registry (P2) — Days 15–21

**Goal**: Generate machine-readable agent registry with metadata, dependencies, and restructuring status

**Independent Test**: Generate registry, verify all agents discoverable, trace dependencies

- [ ] T070 [P] [US5] Implement agent registry generator in scripts/validation/lib/agent-registry-generator.js
- [ ] T071 [US5] Scan all agents in agents/ in scripts/validation/lib/agents-scanner.js
- [ ] T072 [P] [US5] Extract agent metadata (id, name, version, folder_path, status, skills, depends_on)
- [ ] T073 [P] [US5] Parse AGENT.md files to populate agent definitions in registry
- [ ] T074 [US5] Generate consolidated agent registry and save to agents/registry.json
- [ ] T075 [P] [US5] Generate per-agent registries (agents/{agent-id}/registry.json) per Decision 4
- [ ] T076 [P] [US5] Validate all registry files against contracts/registry-schema.json
- [ ] T077 [US5] Implement dependency analyzer in scripts/validation/lib/dependency-analyzer.js
- [ ] T078 [P] [US5] Detect circular dependencies in agent registries and flag as errors
- [ ] T079 [P] [US5] Trace skill dependencies across agents and populate used_by field in registry
- [ ] T080 [US5] Document agent registry format in .github/docs/AGENT_REGISTRY_FORMAT.md
- [ ] T081 [P] [US5] Generate agent dependency graph visualization in agents/reports/dependency-graph.json
- [ ] T082 [US5] Generate summary: total agents registered, skills per agent, dependency count

---

## Phase 8: User Story 6 - Plan Agent-by-Agent Restructuring (P2) — Days 18–25

**Goal**: Create detailed restructuring plan per agent with priorities, dependencies, impact analysis

**Independent Test**: Generate agent specs, verify no circular deps, validate all agents covered

- [ ] T083 [P] [US6] Create agent-specific restructuring specification template in .github/templates/agent-restructuring-spec-template.md
- [ ] T084 [US6] Generate individual restructuring spec for each agent in .github/specs/015-agent-{agent-name}-restructuring/spec.md
- [ ] T085 [P] [US6] For each agent spec: document current structure, target structure, required changes
- [ ] T086 [P] [US6] For each agent spec: identify breaking changes and deprecation impacts
- [ ] T087 [US6] For each agent spec: map dependent scripts and workflows (cross-references)
- [ ] T088 [P] [US6] For each agent spec: define testing strategy (framework: Jest/Bats/Playwright per Decision 3)
- [ ] T089 [US6] For each agent spec: estimate effort and timeline
- [ ] T090 [US6] Generate master restructuring plan prioritizing agents (P1: already have subfolders; P2: high impact; P3: low priority)
- [ ] T091 [P] [US6] Create parallel execution plan showing which agents can be restructured concurrently
- [ ] T092 [P] [US6] Document agent restructuring process in .github/docs/AGENT_RESTRUCTURING_PROCESS.md
- [ ] T093 [US6] Generate agent priority matrix in agents/reports/agent-priority-matrix.json

---

## Phase 9: User Story 7 - Plan Script Migration (P3) — Days 22–30

**Goal**: Plan migration of root scripts into agent folders with deprecation path

**Independent Test**: Generate migration plan, verify all scripts mapped, create deprecation timeline

- [ ] T094 [P] [US7] Audit all scripts in scripts/ folder in scripts/validation/lib/scripts-audit.js
- [ ] T095 [US7] Create script-to-agent mapping in scripts/reports/script-to-agent-mapping.json
- [ ] T096 [P] [US7] For each script: identify logically-related agent owner (per Decision 5 research)
- [ ] T097 [P] [US7] For each script: document dependencies and usage across codebase
- [ ] T098 [US7] Generate migration plan with: target agent, required tests, deprecation timeline
- [ ] T099 [P] [US7] Create deprecation notices for scripts in scripts/DEPRECATION_NOTICES.md
- [ ] T100 [P] [US7] Plan migration for multi-agent dependent scripts (decompose into agent-specific subscripts per spec.md edge case)
- [ ] T101 [US7] Generate migration roadmap with timeline for root script deprecation
- [ ] T102 [P] [US7] Document script migration process in .github/docs/SCRIPT_MIGRATION_PROCESS.md

---

## Phase 10: Polish & Cross-Cutting Concerns — Days 25–30

**Purpose**: Validation, documentation, and final reconciliation

- [ ] T103 [P] Create comprehensive RESTRUCTURING_GUIDE.md in .github/docs/ with overview, timeline, phasing
- [ ] T104 [P] Create FAQ document in .github/docs/RESTRUCTURING_FAQ.md addressing common questions
- [ ] T105 Create consolidated metrics report in agents/reports/restructuring-metrics-summary.json (coverage %, completion %, timelines)
- [ ] T106 [P] Validate all generated registries one final time (agents/registry.json, skills/registry.json, per-agent registries)
- [ ] T107 [P] Validate all audit reports are machine-parseable JSON
- [ ] T108 Create implementation validation checklist in .github/specs/014-agents-restructure-consolidate/IMPLEMENTATION_VALIDATION.md
- [ ] T109 [P] Document Phase 2 Roadmap in .github/specs/014-agents-restructure-consolidate/PHASE2_ROADMAP.md (linting, testing, docs, plugins, SpecKit)
- [ ] T110 [P] Create migration guide for consuming repositories in .github/docs/CONSUMING_REPOSITORY_MIGRATION_GUIDE.md
- [ ] T111 Generate final project status report summarizing Phase 1 completion

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| **Total Tasks** | 111 |
| **Parallelizable Tasks [P]** | 58 |
| **User Story Tasks** | 78 (T018-T102) |
| **US1 Tasks** | 15 |
| **US2 Tasks** | 12 |
| **US3 Tasks** | 13 |
| **US4 Tasks** | 12 |
| **US5 Tasks** | 13 |
| **US6 Tasks** | 11 |
| **US7 Tasks** | 9 |

---

## Dependency Graph

```
Phase 1 (Setup) → Phase 2 (Foundational, BLOCKING)
  ↓
Phase 2 → Phase 3 (US1: Broken Refs) ↓
Phase 2 → Phase 4 (US2: Structure) ↓
Phase 2 → Phase 5 (US3: Deduplication) ↓ (can run in parallel)
Phase 2 → Phase 6 (US4: Skills Registry) ↓
Phase 2 → Phase 7 (US5: Agent Registry) ↓
Phase 2 → Phase 8 (US6: Restructuring Plan) ↓
Phase 2 → Phase 9 (US7: Script Migration) ↓
  ↓
Phase 10 (Polish)
```

---

## MVP Scope (First 8 Days)

**Minimum Viable Product** delivers Phase 1 + Phase 2 + Phase 3 (Broken Reference Remediation):

- Phase 1 (Setup): T001–T008 (project initialization)
- Phase 2 (Foundational): T009–T017 (audit infrastructure)
- Phase 3 (US1): T018–T032 (broken references fixed, CI passes)

**MVP Result**: All broken references identified and fixed; dependent scripts execute successfully. High-value delivery that unblocks further work.

---

## Implementation Strategy

1. **Days 1–5**: Complete Phase 1 + 2 (setup and foundational infrastructure)
2. **Days 3–15**: Execute Phases 3–5 in parallel (broken refs, structure, deduplication) after foundational work unblocks them
3. **Days 12–25**: Execute Phases 6–9 in parallel (registries and planning work) after Phases 3–5 stabilize
4. **Days 25–30**: Phase 10 (polish, validation, documentation)

**Parallel Opportunities**:

- After Phase 2 completes: US1, US2, US3 can run in parallel (different file scans)
- After US1, US2, US3: US4, US5 can run in parallel (registry generation from different sources)
- After US4, US5: US6 and US7 can run in parallel (planning work independent)

---

**Status**: ✅ Ready for Phase 1 Implementation
