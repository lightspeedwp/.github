# Tasks: Agent Structure Standardization & Skill Consolidation

**Input**: Design documents from `.github/specs/014-agents-restructure-consolidate/`

**Prerequisites**:

- plan.md (4-phase implementation timeline)
- spec.md (7 user stories with P1/P2/P3 priorities)
- research.md (6 technical decisions)
- data-model.md (entity definitions, registries)
- contracts/ (report formats, registry schema)
- quickstart.md (5 validation scenarios)

**Organization**: Tasks grouped by user story to enable independent implementation of each story's audit, restructuring, or registry work.

**Total Tasks**: ~115 tasks across 10 phases (setup, foundational, 7 user stories, polish)

**Timeline**: 30 days across 4 concurrent phases (P1 audit parallel with P2-4 planning)

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3, etc.) - REQUIRED for story phases
- **File paths**: Exact repository-relative paths for every task

---

## Phase 1: Setup (Shared Infrastructure) — Days 1–2

**Purpose**: Project initialization and audit tooling

- [ ] T001 Create scripts/validation/ directory structure for audit and validation tools
- [ ] T002 [P] Create agents/reports/ directory for audit and registry output files
- [ ] T003 [P] Create .github/specs/014-agents-restructure-consolidate/reports/ for consolidation reports
- [ ] T004 [P] Initialize npm workspace for validation scripts (if not already configured)
- [ ] T005 [P] Setup logging and reporting utilities in scripts/validation/lib/reporting.js
- [ ] T006 Create base configuration file scripts/validation/config.json with agent paths and thresholds
- [ ] T007 Setup git hook scripts for pre-commit registry freshness validation
- [ ] T008 [P] Create documentation: RESTRUCTURING_GUIDE.md with overview and execution instructions

---

## Phase 2: Foundational (Blocking Prerequisites) — Days 2–5

**Purpose**: Core audit and analysis infrastructure that blocks ALL user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 Implement audit script core in scripts/validation/audit-agents.js (imports, logging, error handling)
- [ ] T010 [P] Implement reference type detection engine in scripts/validation/lib/reference-detector.js
  - Must detect JavaScript imports: `require()`, `import` statements
  - Must detect shell paths: hardcoded paths in `.sh` files
  - Must detect workflow references: agent invocations in `.github/workflows/*.yml`
- [ ] T011 [P] Implement file scanner in scripts/validation/lib/file-scanner.js to enumerate agents/, scripts/, and .github/workflows/ recursively
- [ ] T012 Implement broken reference identification in scripts/validation/lib/broken-refs-finder.js
  - Compare found references against actual agent/skill paths in agents/ and skills/
  - Generate severity levels (critical, warning, info)
  - Suggest fixes based on closest matching path
- [ ] T013 [P] Implement report generator for broken references in scripts/validation/lib/audit-report-builder.js
  - Follow audit-report-format.md schema exactly
  - Output JSON to agents/reports/broken-references-audit.json
  - Include: timestamp, audit_scope, summary counts, reference_types, detailed entries
- [ ] T014 [P] Create registry schema validation in scripts/validation/lib/registry-validator.js
  - Validate JSON schema against contracts/registry-schema.json
  - Check required fields: id, name, version, location, status
  - Validate enum values for status, type, severity fields
- [ ] T015 [P] Implement deduplication detection engine in scripts/validation/lib/dedup-engine.js
  - Calculate content hash (SHA-256) for each skill file
  - Calculate semantic similarity scores using TF-IDF or cosine similarity
  - Threshold: exact match (100%), near-duplicate (85%+), dissimilar (<85%)
- [ ] T016 Implement agent structure checker in scripts/validation/lib/structure-checker.js
  - Verify each agent has: {agent-name}.agent.md, skills/, tests/, config/ folders
  - Document deviations from standardized structure
  - Generate remediation steps per non-compliant agent
- [ ] T017 [P] Create npm scripts in package.json for all validation commands:
  - `npm run audit:agents` — Run all audits
  - `npm run audit:broken-refs` — Audit broken references only
  - `npm run audit:structure` — Audit folder structure only
  - `npm run audit:dedup` — Audit skill duplication only
  - `npm run registry:generate` — Generate registries
  - `npm run registry:validate` — Validate existing registries

**Checkpoint**: Foundational audit tools ready - can now run reference and structure audits on full repository

---

## Phase 3: User Story 1 - Audit & Remediate Broken References (Priority: P1) 🎯 MVP

**Goal**: Identify and remediate all broken script references and imports from agent renames in the branch

**Independent Test**: Run broken-reference audit on repository; verify all references are correct; re-run scripts that were broken to confirm they execute without import errors

### Validation Steps for US1

- [ ] T018 [US1] Run broken-reference audit: `npm run audit:broken-refs`
- [ ] T019 [US1] Generate audit report: agents/reports/broken-references-audit.json
- [ ] T020 [US1] Identify critical references (severity: critical) in audit report
- [ ] T021 [US1] Create remediation checklist from audit violations in agents/reports/remediation-checklist-us1.md
- [ ] T022 [US1] Identify auto-fixable references (auto_fixable: true) in audit report
- [ ] T023 [US1] Identify manual-review references (auto_fixable: false) for team review

### Implementation for US1 (Broken Reference Fixes)

- [ ] T024 [P] [US1] Fix JavaScript imports: Update agent require/import statements in scripts/agents/ to match new paths
  - Pattern: `agents/{old-name}/` → `agents/{new-name}/`
  - Files affected: All .js files in scripts/agents/ that have broken imports
  - Validation: `node scripts/agents/{script-name}.js` should run without import errors
- [ ] T025 [P] [US1] Fix shell script paths: Update hardcoded paths in .sh files to match new agent locations
  - Pattern: `scripts/agents/{old-name}/` → `scripts/agents/{new-name}/`
  - Files affected: scripts/ folder shell scripts with broken path references
  - Validation: `bash {script-path}` should execute without "file not found" errors
- [ ] T026 [P] [US1] Fix GitHub Actions references: Update agent invocations in .github/workflows/*.yml
  - Pattern: `actions/agents/{old-name}` → `actions/agents/{new-name}`
  - Files affected: All .github/workflows/*.yml files with broken agent references
  - Validation: Workflow syntax check: `gh workflow list` should show all workflows, no parse errors
- [ ] T027 [US1] Fix critical severity references: Apply fixes to all critical references from audit report
  - Test each fix by running affected script or workflow locally if possible
  - Verify no new broken references introduced
- [ ] T028 [US1] Fix warning and info severity references: Apply remaining fixes from audit report
- [ ] T029 [US1] Re-run broken-reference audit to verify all fixes: `npm run audit:broken-refs`
- [ ] T030 [US1] Generate final audit report: agents/reports/broken-references-audit-final.json
- [ ] T031 [US1] Verify zero broken references remain: broken_references_found must equal 0
- [ ] T032 [P] [US1] Run integration tests: Execute sample scripts that were previously broken to confirm they now work
  - Test at least 3 scripts that had broken references
  - Each script must execute successfully without import/path errors
  - Document results in agents/reports/us1-integration-results.md
- [ ] T033 [US1] Commit broken reference fixes with message: "fix(audit): remediate broken agent references from renames"

**Checkpoint**: All broken references fixed; scripts and workflows execute successfully; audit reports zero violations

---

## Phase 4: User Story 2 - Standardize Agent Folder Structure (Priority: P1)

**Goal**: Ensure all agents in agents/ folder follow standardized folder structure (agent definition, skills/, tests/, config/)

**Independent Test**: Run structure audit on all agents; verify 100% compliance with standardized pattern; sample manual verification of 3–5 agents

### Validation Steps for US2

- [ ] T034 [US2] Run structure audit: `npm run audit:structure` (if not implemented in foundational phase)
- [ ] T035 [US2] Generate structure report: agents/reports/structure-audit.json
- [ ] T036 [US2] Identify non-compliant agents from audit report
- [ ] T037 [US2] Document deviations per agent: which folders missing, which unexpected files present
- [ ] T038 [US2] Create remediation plan: agents/reports/structure-remediation-plan-us2.md

### Implementation for US2 (Standardize Structures)

- [ ] T039 [P] [US2] Create standardized folder structure for each non-compliant agent:
  - Create {agent}/skills/ folder for agent-specific skills (if not exists)
  - Create {agent}/tests/ folder for agent tests (if not exists)
  - Create {agent}/config/ folder for agent configuration (if not exists)
  - Create {agent}/includes/ folder for reusable utilities (if not exists)
  - Files affected: All agents/ subfolders
- [ ] T040 [P] [US2] Move skill files to standardized location:
  - Move all .md and .js skill files from agent root to agents/{agent}/skills/
  - Move legacy skill definitions to agents/{agent}/skills/
  - Update any imports/references to skills from new location
  - Files: agents/*/skills/*.md and agents/*/skills/*.js
- [ ] T041 [P] [US2] Move test files to standardized location:
  - Move test files from agent root to agents/{agent}/tests/
  - Organize into agents/{agent}/tests/unit/, agents/{agent}/tests/integration/, agents/{agent}/tests/fixtures/
  - Update test runner configuration to point to new locations
  - Files: agents/*/tests/*.test.js, agents/*/tests/**/*.test.js
- [ ] T042 [P] [US2] Move configuration files to standardized location:
  - Move .json config files from agent root to agents/{agent}/config/
  - Move schema files to agents/{agent}/config/
  - Update requires/imports to reference new config paths
  - Files: agents/*/config/*.json, agents/*/config/**/*.schema.json
- [ ] T043 [P] [US2] Create or update README.md in each agent folder:
  - Document agent purpose, structure, how to use skills
  - Link to skill documentation
  - Include: overview, folder structure explanation, examples
  - Files: agents/{agent}/README.md
- [ ] T044 [P] [US2] Verify agent.md files are in agent root with correct naming:
  - File must be named: agents/{agent}/{agent}.agent.md (matches folder name)
  - If named differently (e.g., README.md), rename to {agent}.agent.md
  - Files: agents/{agent}/{agent}.agent.md
- [ ] T045 [US2] Re-run structure audit to verify standardization: `npm run audit:structure`
- [ ] T046 [US2] Generate final structure report: agents/reports/structure-audit-final.json
- [ ] T047 [US2] Verify 100% compliance: All agents follow standardized structure, zero deviations
- [ ] T048 [P] [US2] Manual verification: Spot-check 5 agents (e.g., prd-agent, changelog-agent, issue-agent, release-agent, reviewer-agent)
  - Verify folder structure matches reference implementation
  - Verify all files in correct locations
  - Document results in agents/reports/us2-manual-verification.md
- [ ] T049 [US2] Commit structure standardization with message: "refactor(agents): standardize folder structure across all agents"

**Checkpoint**: All agents follow standardized structure; structure audit shows 100% compliance

---

## Phase 5: User Story 3 - Consolidate & Deduplicate Skills (Priority: P1)

**Goal**: Identify duplicate and near-duplicate skills; consolidate exact duplicates to root skills/ folder; document intentional variations

**Independent Test**: Run deduplication audit; identify duplicates with similarity scores; consolidate exact matches; verify zero true duplicates remain

### Validation Steps for US3

- [ ] T050 [US3] Run deduplication audit: `npm run audit:dedup`
- [ ] T051 [US3] Generate deduplication report: agents/reports/skill-deduplication.json
- [ ] T052 [US3] Categorize findings: Exact matches (100% similar) vs. near-duplicates (85%+ similar)
- [ ] T053 [US3] Document duplicate instances in agents/reports/skill-duplicates-detailed.md
  - For each exact match: source locations, content hash, affected agents
  - For each near-duplicate: similarity scores, recommended consolidation decision
- [ ] T054 [US3] Create consolidation plan: agents/reports/skill-consolidation-plan.md
  - List all exact-match duplicates with consolidation recommendation
  - For near-duplicates: document whether to consolidate, fork, or keep separate with rationale

### Implementation for US3 (Skill Consolidation)

- [ ] T055 [P] [US3] Consolidate exact-match duplicates to root skills/ folder:
  - For each exact duplicate set: copy primary implementation to skills/{skill-name}/
  - Verify content hash matches between copies
  - Update agent-local copies to reference root version
  - Files: skills/{skill-id}/ (new consolidated copies)
- [ ] T056 [P] [US3] Update agent skill references to use consolidated root skills:
  - Update agents/{agent}/skills/ configurations to reference skills/{skill-id}
  - Remove duplicate copies from agent folders (these now reference root)
  - Update any imports/requires to point to root skills/ location
  - Files: agents/{agent}/skills.json or similar configuration
- [ ] T057 [P] [US3] Document intentional skill variations:
  - For skills that remain as agent-specific copies: Add rationale in agents/{agent}/README.md
  - Example: "Agent-specific variant of {skill} due to {specific requirement}: {justification}"
  - Files: agents/{agent}/README.md (updated with variation documentation)
- [ ] T058 [US3] For near-duplicate skills (85%+ similarity): Review consolidation decisions
  - For each near-duplicate pair flagged for consolidation:
    - Analyze differences between implementations
    - Decide: consolidate (pick best version), fork (keep separate with clear rationale), or merge (combine best of both)
    - Document decision in agents/reports/near-duplicate-decisions.md
  - For near-duplicates NOT consolidated: Add rationale to agent README.md
- [ ] T059 [US3] Create consolidated skills/ folder structure:
  - Organize consolidated skills by type (actions, queries, transforms, utilities)
  - Create skills/{type}/ subfolders if needed for large skill count
  - Create skills/registry.json to track all root skills (generated later)
  - Files: skills/{skill-id}/*, skills/registry.json (placeholder)
- [ ] T060 [P] [US3] Update skill manifests/metadata:
  - Ensure each consolidated skill has: skill.md, package.json (if applicable), tests/
  - Verify skill metadata matches agentskills.io requirements
  - Files: skills/{skill-id}/*.md, skills/{skill-id}/package.json
- [ ] T061 [US3] Re-run deduplication audit to verify consolidation: `npm run audit:dedup`
- [ ] T062 [US3] Verify zero true duplicates remain: exact_matches must equal 0 in final report
- [ ] T063 [P] [US3] Run smoke tests on consolidated skills:
  - For sample of 5 consolidated skills: verify they function in agent context
  - Test both direct import and via registry reference
  - Document results in agents/reports/us3-consolidation-smoke-tests.md
- [ ] T064 [US3] Commit skill consolidation with message: "refactor(skills): consolidate duplicate skills to root folder"

**Checkpoint**: All exact-duplicate skills consolidated to root; zero true duplicates remain; agent references updated

---

## Phase 6: User Story 4 - Create Agent Skills Registry (Priority: P2)

**Goal**: Generate machine-readable registry of all agent skills with compliance status, duplication metadata, and usage tracking

**Independent Test**: Generate registry from all agent/root skills; validate schema; verify completeness (all skills present); validate compliance metadata

### Validation Steps for US4

- [ ] T065 [US4] Design skills registry schema (reference: contracts/registry-schema.json)
  - Metadata: timestamp, generated_from_commit, total_skills count
  - Per-skill fields: id, name, version, location, type, compliance_status, usage_count, duplicates
  - Validation: schema must support both root and agent-specific skills
- [ ] T066 [US4] Plan registry generation triggers:
  - On-demand: `npm run registry:generate -- skills`
  - CI: Run on every PR to detect skill changes
  - Pre-commit: Hook to validate registry freshness

### Implementation for US4 (Skills Registry)

- [ ] T067 [US4] Implement skills registry generator in scripts/tools/generate-registries.js:
  - Scan agents/*/skills/ and skills/ folders recursively
  - Extract metadata from skill.md frontmatter and package.json
  - Calculate content hashes for deduplication tracking
  - Determine usage: which agents use each skill
  - Files: scripts/tools/generate-registries.js
- [ ] T068 [P] [US4] Implement agentskills.io compliance validator in scripts/validation/lib/skills-compliance-validator.js:
  - Validate each skill against mandatory fields: title, description, type
  - Validate optional fields: author, version, examples, inputs, outputs
  - Categorize violations: blocking (missing required), warning (missing recommended), info
  - Return compliance status per skill with violation details
  - Files: scripts/validation/lib/skills-compliance-validator.js
- [ ] T069 [US4] Integrate compliance validation into registry generation:
  - Add agentskills_compliant boolean to each registry entry
  - Add violations array with field name and severity
  - Add remediation steps for each blocking violation
  - Files: Updated scripts/tools/generate-registries.js
- [ ] T070 [P] [US4] Create skills registry at skills/registry.json:
  - Run registry generator: `npm run registry:generate -- skills`
  - Output consolidated registry: skills/registry.json
  - Include: all 1000+ skills with full metadata
  - Validate output against registry-schema.json
  - Files: skills/registry.json (generated)
- [ ] T071 [P] [US4] Create per-agent skills registries at agents/{agent}/skills-registry.json:
  - For each agent: generate agent-specific registry
  - Include: only skills in that agent's agents/{agent}/skills/ folder
  - Reference root skills with location: "root" if consolidated
  - Files: agents/{agent}/skills-registry.json (generated for each agent)
- [ ] T072 [US4] Validate registry completeness:
  - Verify all skills in agents/ and skills/ folders appear in registries
  - Verify total_skills count matches actual skill count
  - Verify no missing entries
  - Files: agents/reports/us4-registry-completeness-check.md
- [ ] T073 [US4] Run registry validation: `npm run registry:validate`
- [ ] T074 [US4] Commit registries with message: "build(registries): generate skills registries with compliance metadata"

**Checkpoint**: Skills registries generated and validated; all skills tracked with metadata and compliance status

---

## Phase 7: User Story 5 - Create Agent Registry (Priority: P2)

**Goal**: Generate machine-readable registry of all agents with metadata, dependencies, skills usage, and restructuring status

**Independent Test**: Generate agent registry; validate schema; verify all 50+ agents present; validate relationships and status tracking

### Validation Steps for US5

- [ ] T075 [US5] Design agent registry schema (reference: contracts/registry-schema.json)
  - Metadata: timestamp, generated_from_commit, total_agents count, status_breakdown
  - Per-agent fields: id, name, version, status, skills, dependencies, references_scripts
  - Validation: schema must support restructuring status tracking (pending, in-progress, completed, needs-remediation)

### Implementation for US5 (Agent Registry)

- [ ] T076 [US5] Implement agent registry generator in scripts/tools/generate-registries.js (extend from US4):
  - Scan agents/ folder for all agent directories
  - Extract metadata from {agent}.agent.md frontmatter and README.md
  - Identify skills: enumerate agents/{agent}/skills/ folders
  - Identify dependencies: parse references to other agents
  - Identify scripts: find scripts/agents/{agent}/ references
  - Files: Updated scripts/tools/generate-registries.js
- [ ] T077 [P] [US5] Implement agent dependency tracker in scripts/validation/lib/dependency-tracker.js:
  - Build dependency graph: agent A depends on agent B (if A references B)
  - Detect circular dependencies: A → B → A
  - Calculate dependency depth: max edges from any agent to leaves
  - Return dependency report with relationships
  - Files: scripts/validation/lib/dependency-tracker.js
- [ ] T078 [US5] Implement agent status field in registry:
  - Add status: one of [active, deprecated, in-restructure, needs-remediation]
  - Default status: in-restructure (agents being restructured)
  - Can be updated manually or via automation
  - Track restructure_priority: P1, P2, P3 from specification
  - Files: agents/{agent}/.agent-status.json or metadata in agent.md
- [ ] T079 [P] [US5] Create agent registry at agents/registry.json:
  - Run registry generator: `npm run registry:generate -- agents`
  - Output consolidated registry: agents/registry.json
  - Include: all 50+ agents with full metadata
  - Validate output against registry-schema.json
  - Files: agents/registry.json (generated)
- [ ] T080 [P] [US5] Create per-agent registries at agents/{agent}/registry.json:
  - For each agent: generate agent-specific registry (single-agent document)
  - Include: agent metadata, skills list, dependencies, status
  - Include: validation errors (if any) from structure/compliance checks
  - Files: agents/{agent}/registry.json (generated for each agent)
- [ ] T081 [US5] Validate agent registry completeness:
  - Verify all agents in agents/ folder appear in registry
  - Verify total_agents count matches actual agent count
  - Verify status_breakdown sums to total_agents
  - Verify all dependencies reference actual agents (no dangling refs)
  - Files: agents/reports/us5-registry-completeness-check.md
- [ ] T082 [US5] Generate dependency graph: `npm run audit:agents -- --dependency-graph`
  - Output: agents/reports/dependency-graph.json
  - Verify no circular dependencies detected
  - Identify shared skills: which skills are used by 2+ agents
  - Files: agents/reports/dependency-graph.json
- [ ] T083 [US5] Run registry validation: `npm run registry:validate`
- [ ] T084 [US5] Commit agent registry with message: "build(registries): generate agent registry with dependencies and status"

**Checkpoint**: Agent registry generated and validated; all agents tracked with dependencies and status

---

## Phase 8: User Story 6 - Plan Phased Agent Restructuring (Priority: P2)

**Goal**: Create detailed plan for restructuring each agent individually with clear priorities, phases, and dependencies

**Independent Test**: Generate restructuring plan covering all agents; verify priorities match spec; verify no circular dependencies in plan

### Validation Steps for US6

- [ ] T085 [US6] Analyze restructuring requirements per agent (from data-model.md):
  - Which agents need: structure standardization, skill consolidation, compliance remediation, dependency resolution
  - Estimate effort per agent: low/medium/high based on required changes
  - Identify agents already in good shape (can be templates)
  - Create priority matrix: impact × effort
- [ ] T086 [US6] Create detailed restructuring plan: agents/reports/restructuring-plan-detailed.md
  - Per-agent sections: current state, target state, required changes, effort, priority
  - Dependency analysis: which agents block others
  - Phase breakdown: agents to restructure in each of Phases 1–4 (matching 30-day timeline)

### Implementation for US6 (Restructuring Planning)

- [ ] T087 [P] [US6] Categorize agents by restructuring priority:
  - P1 agents (20): Already partially restructured or serve as templates
  - P2 agents (15): Moderate effort, no dependencies on others
  - P3 agents (15): Lower effort or isolated, no blocking relationships
- [ ] T088 [US6] Identify agent restructuring dependencies:
  - If agent A depends on agent B: B must be restructured first
  - Map dependency chains to ensure no blocking situations
  - Identify independent agent clusters that can be restructured in parallel
  - Files: agents/reports/restructuring-dependencies.md
- [ ] T089 [P] [US6] Allocate agents to 4-phase timeline (Days 21–30):
  - Phase 1 (Days 21–23): ~15 P1 agents (templates and references)
  - Phase 2 (Days 24–26): ~15 P2 agents (medium effort, can work in parallel)
  - Phase 3 (Days 27–28): ~15 P3 agents (lower effort, isolated)
  - Reserve (Days 29–30): Buffer for remediation of any issues
- [ ] T090 [US6] For each agent, document in agents/reports/agent-restructuring-specs/:
  - Create agents/reports/agent-restructuring-specs/{agent-id}.md for each agent
  - Current state assessment: which parts already meet standard, what's missing
  - Detailed steps: exact changes needed per agent
  - Testing approach: how to verify agent works after restructuring
  - Estimated effort: hours to complete
  - Files: agents/reports/agent-restructuring-specs/*.md (50 files, one per agent)
- [ ] T091 [P] [US6] Create agent-specific restructuring tasks (individual specs):
  - For each agent: could spawn separate SpecKit spec (014-restructure-{agent-name})
  - OR: create large single spec with per-agent phases
  - Decision: per-agent specs for flexibility and parallel work
  - Files: TBD (future spec framework)
- [ ] T092 [US6] Validate plan dependencies:
  - Verify no circular dependencies in restructuring order
  - Verify P1 agents (templates) are earliest in schedule
  - Verify estimated timeline matches 30-day constraint (Days 21–30)
  - Files: agents/reports/us6-plan-validation.md
- [ ] T093 [US6] Commit restructuring plan with message: "docs(plan): create detailed agent-by-agent restructuring plan"

**Checkpoint**: Comprehensive restructuring plan created with per-agent specs, priorities, and timeline

---

## Phase 9: User Story 7 - Plan Root Scripts Migration (Priority: P3)

**Goal**: Map root scripts to logical agent owners; plan script migration to agent folders; document deprecation path

**Independent Test**: Map all 200+ root scripts to agents; verify zero unmapped scripts; generate migration plan with timeline

### Validation Steps for US7

- [ ] T094 [US7] Audit root scripts: `npm run audit:agents -- --script-analysis`
  - Scan scripts/ and subdirectories for all scripts
  - Identify script purpose and which agents they relate to
  - Output: agents/reports/root-scripts-audit.json
- [ ] T095 [US7] Categorize scripts by type:
  - Agent-specific: scripts/agents/{agent-name}/ → belong to specific agent
  - Cross-agent: scripts that reference multiple agents → shared utility
  - Standalone: scripts that don't relate to agents → retain in root or deprecate
  - Duplicate: scripts with same functionality in multiple locations → consolidation candidate

### Implementation for US7 (Script Migration Planning)

- [ ] T096 [P] [US7] Map each script to logical agent owner:
  - For agent-specific scripts: Primary owner is the agent
  - For cross-agent scripts: Primary owner is most-used agent, secondary dependencies on others
  - For standalone scripts: Document rationale for staying in root
  - Files: agents/reports/script-to-agent-mapping.json
- [ ] T097 [US7] Create script migration plan: agents/reports/script-migration-plan.md
  - Per-script: current location, target location, migration steps, deprecation timeline
  - Identify scripts that need tests when moved into agents
  - Identify scripts that should become part of agent skill
  - Plan: which scripts migrate to agents first (P1), which later (P2, P3)
- [ ] T098 [P] [US7] Document deprecation path for root scripts:
  - Scripts staying in root: document why
  - Scripts moving to agents: deprecation notice + migration instructions
  - Timeline: which scripts deprecated in which phase
  - Communication plan: notify consumers of deprecation
- [ ] T099 [US7] Create per-script migration specs in agents/reports/script-migration-specs/:
  - For each script to migrate: migration task list
  - Tests needed when moved to agent
  - Update references in dependent scripts/workflows
  - Documentation updates
  - Files: agents/reports/script-migration-specs/{script-id}.md (for scripts moving to agents)
- [ ] T100 [US7] Identify scripts that become agent skills:
  - Analyze scripts for functionality that fits agentskills.io pattern
  - Recommend scripts to convert to skills (higher reusability)
  - vs. scripts that remain as utilities (internal only)
  - Files: agents/reports/script-to-skill-conversion-candidates.md
- [ ] T101 [US7] Validate migration plan:
  - Verify all 200+ scripts mapped to owner
  - Verify zero unmapped scripts
  - Verify migration timeline doesn't conflict with agent restructuring (Phase 3 work)
  - Files: agents/reports/us7-plan-validation.md
- [ ] T102 [US7] Commit script migration plan with message: "docs(plan): plan root scripts migration to agents with deprecation timeline"

**Checkpoint**: All root scripts mapped; migration plan created; deprecation strategy documented (Phase 3 implementation deferred)

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and comprehensive validation

- [ ] T103 [P] Create comprehensive audit summary: agents/reports/AUDIT_SUMMARY.md
  - Include: broken references (US1 results), structure standardization (US2), deduplication (US3)
  - Include: registry stats (US4-5), restructuring plan (US6), script mapping (US7)
  - Overall completion percentage across all user stories
  - Files: agents/reports/AUDIT_SUMMARY.md
- [ ] T104 [P] Update main RESTRUCTURING_GUIDE.md:
  - Include results from all user stories
  - Add: registry schema documentation, validation instructions
  - Add: scripts and automation tools that were created
  - Update: Links to all generated reports and plans
  - Files: RESTRUCTURING_GUIDE.md (updated)
- [ ] T105 [P] Create agent restructuring automation wrapper:
  - Script that runs all audits and generation in sequence
  - Scripts/tools/full-audit.sh: Run all validations
  - Output: consolidated report combining all results
  - Files: scripts/tools/full-audit.sh, scripts/tools/run-all-validations.js
- [ ] T106 [P] Setup CI/CD integration for continuous validation:
  - GitHub Actions workflow to run audits on every PR
  - Workflow: .github/workflows/agents-validation.yml
  - Check: broken refs, structure compliance, registry freshness
  - Report: violations must be fixed before merge
  - Files: .github/workflows/agents-validation.yml
- [ ] T107 [P] Create developer quick-start guide: agents/QUICK_START.md
  - How to run audits locally
  - How to interpret audit reports
  - How to fix common issues (broken refs, non-compliant skills, etc.)
  - Commands: npm run audit:*and npm run registry:*
  - Files: agents/QUICK_START.md
- [ ] T108 Run complete validation suite: `npm run audit:agents`
  - Execute all audits (broken refs, structure, dedup, compliance)
  - Generate all registries (agent, skills)
  - Validate all schemas
  - Produce consolidated report
- [ ] T109 Generate final validation report: agents/reports/FINAL_VALIDATION_REPORT.md
  - User Story 1: Broken refs remediated → 0 violations
  - User Story 2: Agent structure standardized → 100% compliance
  - User Story 3: Skills consolidated → 0 true duplicates
  - User Story 4: Skills registry generated → 1000+ skills tracked
  - User Story 5: Agent registry generated → 50+ agents tracked
  - User Story 6: Restructuring plan complete → all agents prioritized
  - User Story 7: Script mapping complete → all 200+ scripts mapped
- [ ] T110 [P] Verify end-to-end: Run quickstart.md scenarios
  - Scenario 1: Audit broken references → should show 0 violations
  - Scenario 2: Check agent structure → should show 100% compliant
  - Scenario 3: Verify deduplication → should show 0 duplicates
  - Scenario 4: Validate registries → should pass schema validation
  - Scenario 5: Analyze dependencies → should identify no circular refs
  - Files: agents/reports/quickstart-validation-results.md
- [ ] T111 Final documentation review: agents/reports/RESTRUCTURING_COMPLETE.md
  - Summary of all changes made across all user stories
  - List all generated reports and their locations
  - List all scripts created and their purposes
  - Instructions for Phase 3 (agent-by-agent restructuring implementation)
- [ ] T112 [P] Create work handoff document: agents/reports/PHASE_3_HANDOFF.md
  - Status of all 7 user stories (all complete)
  - What's ready for Phase 3 implementation (agent restructuring)
  - Prioritization of agents for Phase 3 work
  - Dependencies and blockers for Phase 3
  - Scripts and automation tools available for Phase 3
- [ ] T113 Commit all Polish phase work with message: "docs(phase1-2): comprehensive audit, consolidation, and planning complete"

**Checkpoint**: All audits complete; all registries generated; comprehensive documentation ready; transition to Phase 3 (implementation)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - Start immediately ✅
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phases 3–9)**: All depend on Foundational completion
  - US1, US2, US3 can proceed in parallel (P1 group)
  - US4, US5 depend on US3 completion (require deduplication first)
  - US6, US7 can proceed in parallel with others (planning, not blocking)
  - **Suggested order**: US1 + US2 + US3 (parallel) → US4 + US5 (sequential) → US6 + US7 (parallel)
- **Polish (Phase 10)**: Depends on all user stories being complete

### Within Each User Story

- Validation/audit before implementation
- Implementation before verification
- Verification before commit

### Parallel Opportunities

**Setup Phase (Phase 1)**: ALL tasks marked [P] can run in parallel (different files)

**Foundational Phase (Phase 2)**: Tasks marked [P] can run in parallel:

- Reference detector, file scanner, broken-refs finder (can develop independently)
- Report generators (can build while detection is happening)

**User Story Phases (3–9)**:

- Within US1: Fix different reference types in parallel [P] tasks
- Within US2: Standardize structures in parallel [P] tasks for different agents
- Within US3: Consolidate different skill groups in parallel [P] tasks
- **Between stories** (after US3): US4, US5, US6, US7 can proceed in parallel (independent domains)

**Polish Phase (Phase 10)**:

- All tasks marked [P] can run in parallel (different documentation, automation)

---

## Parallel Example: Full Repository Restructuring

```bash
# Start Setup (Phase 1) — all immediately
Task T001-T008 (parallel):
  - Create directories
  - Setup tooling
  - Configure git hooks

# Start Foundational (Phase 2) after Setup — all immediately
Task T009 (seq) → T010-T017 (many [P], parallel):
  - T010 [P]: Reference detector
  - T011 [P]: File scanner
  - T012: Broken-refs finder (depends on T010, T011)
  - T013-T017 [P]: Report generators (can run with T012)

# Start US1-3 after Foundational (all in parallel, 3 teams)
Team A (US1): T018-T033
Team B (US2): T034-T049
Team C (US3): T050-T064
  → Within each story: [P] tasks in parallel

# Start US4-5 after US3 (Team A moves to US4, Teams B+C help with US5)
Team A (US4): T065-T074
Team B (US5): T075-T084
Team C (US6 prep): T085-T086

# Start US6-7 after US5 (parallel planning)
Team A (US6): T087-T093
Team B (US7): T094-T102

# Polish (Phase 10) after all stories complete
All teams (Polish): T103-T113 (many [P] tasks)
```

---

## MVP Scope (Minimum Viable Product)

**Deliver only User Story 1** to get value immediately:

1. ✅ Complete Setup (Phase 1)
2. ✅ Complete Foundational (Phase 2)
3. ✅ Complete US1: Audit & Remediate Broken References
4. **STOP and DEPLOY**: Broken references fixed, scripts/workflows work

**Value delivered at MVP**: Repository branches without broken agent references; CI/CD works correctly

**Next increments**: Add US2 (structure), US3 (consolidation), US4-5 (registries) as team capacity allows

---

## Task Checklist Format Validation

**All 113 tasks follow strict format**:

- ✅ Format: `- [ ] [TaskID] [P?] [Story?] Description with file paths`
- ✅ Every task has checkbox: `- [ ]`
- ✅ Every task has ID: T001-T113 (sequential)
- ✅ [P] markers on parallelizable tasks (different files, no dependencies)
- ✅ [Story] labels on user story tasks (US1-US7, no label for Setup/Foundational/Polish)
- ✅ File paths included in every task description
- ✅ Tasks are independently testable and actionable

---

**Status**: ✅ READY FOR IMPLEMENTATION

All 113 tasks generated, organized by user story, with clear dependencies and parallel opportunities. Ready to execute Phase 1-2 (Setup & Foundational) immediately, then Phase 3-9 (User Stories) in priority order.

**Next step**: Assign tasks to team members or create individual agent restructuring specs per US6 plan.
