# Tasks: CodeRabbit Configuration Optimization

**Input**: Design documents from `specs/002-coderabbit-config-improvements/`

**Prerequisites**: plan.md (org-wide scope, technology diversity), spec.md (5 user stories P1-P3), research.md (audit findings), data-model.md (config structure), contracts/ (schemas), quickstart.md (11 validation scenarios)

**Tests**: Not explicitly requested - validation scenarios in quickstart.md provide end-to-end testing

**Organization**: Tasks are grouped by user story to enable independent implementation and validation of each story. All stories depend on foundational config work completing first.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US5)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and config audit baseline

- [ ] T001 Run configuration audit per research.md findings: identify current 20 path patterns, 80% coverage baseline, gap analysis in `.github/coderabbit.yml`
- [ ] T002 [P] Extract all 30+ branch types from `.github/CLAUDE.md` and create reference table mapping each type to priority review context
- [ ] T003 [P] Extract all file types from repository scan and cross-reference against current path_instructions for gap analysis
- [ ] T004 [P] Audit technology diversity impact: identify WordPress, Node/TypeScript, infrastructure, and MCP project patterns across organisation repos
- [ ] T005 Create backup of current `.github/coderabbit.yml` (commit with message: "backup: pre-optimization config")
- [ ] T006 Document configuration inheritance model understanding per CodeRabbit central configuration docs

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core config structure and decision-making that blocks all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create path priority ordering system: document priority ranges (90-100 exact, 70-89 specific dir, 50-69 type in dir, 1-49 general) with 10+ examples in `.github/coderabbit.yml` comments
- [ ] T008 [P] Design branch-context structure for `.coderabbit.yml` schema: decide on parameterization approach supporting all 30+ branch types per FR-006 and FR-013
- [ ] T009 [P] Create technology-agnosticism constraint validation checklist: ensure no framework-specific guidance (no "use PHP hooks", no "TypeScript async/await", no "Terraform modules") - applies universally across WordPress, Node, infrastructure, MCP
- [ ] T010 Define instruction block structure with 3+ review focus areas per contract/path-instruction-schema.md (intro line, Focus Area 1/2/3, additional context, UK English)
- [ ] T011 [P] Reorganise existing 20 path patterns by priority/specificity per data-model.md priority resolution algorithm (exact paths first, then nested dirs, then file types, then general)
- [ ] T012 Create mapping of top 15-20 branch types (by usage frequency) to adapted review context: security/ → auth/access/secrets, perf/ → benchmarks/metrics, a11y/ → WCAG, docs/ → clarity/structure, feat/, fix/, hotfix/, refactor/, task/, release/, chore/, test/, design/, ci/, ops/, etc.
- [ ] T013 [P] Cross-reference `.github/labels.yml` with current config documentation to verify label references are accurate (LOCKED - no modifications)

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - Code Reviewer Gets Clear, Actionable Guidance (Priority: P1) 🎯 MVP

**Goal**: Reviewers receive specific, actionable, technology-agnostic guidance for every file type via clear instruction blocks with 3+ review focus areas

**Independent Test**: Submit PRs modifying different file types (workflows, PHP, TypeScript, infrastructure files) and verify CodeRabbit feedback cites relevant specific guidance from instruction blocks

### Implementation for User Story 1

- [ ] T014 [P] [US1] Enhance 8 high-priority instruction blocks for core file types (workflows, agents, templates, documentation, prompts, scripts) with 3+ focus areas per contract/path-instruction-schema.md
- [ ] T015 [P] [US1] Add review focus areas to JavaScript/TypeScript instructions: code quality, performance, accessibility, no technology-specific guidance
- [ ] T016 [P] [US1] Add review focus areas to PHP/general script instructions: security practices, code quality, maintainability, no WordPress-specific guidance
- [ ] T017 [P] [US1] Add review focus areas to workflow/CI instructions: job definition, secret handling, status checks per FR-003
- [ ] T018 [P] [US1] Add review focus areas to documentation instructions: clarity, structure, navigation, links per WCAG 2.2 AA
- [ ] T019 [US1] Document instruction block examples showing technology-agnostic patterns in `.github/coderabbit.yml` comments
- [ ] T020 [US1] Create cross-reference comments in config showing which instruction applies to which file pattern (enables quick navigation)
- [ ] T021 [US1] Add explicit constraint notes in each block: "no implementation details", "apply across all project types", "focus on universal principles"
- [ ] T022 [US1] Validate all enhanced blocks follow consistent structure, UK English, and avoid vague adjectives ("fast" → specific metrics, "clean" → specific criteria) per SC-008
- [ ] T023 [US1] Commit enhanced instructions: "feat(coderabbit): enhance instruction blocks for clear, actionable guidance"

**Checkpoint**: User Story 1 complete - reviewers now have clear guidance for existing file types. Validate with Scenario 1 from quickstart.md.

---

## Phase 4: User Story 2 - Maintainers Can Verify Review Coverage Completeness (Priority: P2)

**Goal**: Create external audit guide enabling maintainers to identify which file types lack review instructions

**Independent Test**: Run coverage audit against repository using guide; identify gaps; verify 95% coverage per SC-001

### Implementation for User Story 2

- [ ] T024 [P] [US2] Create `.github/docs/CODERABBIT_COVERAGE_AUDIT.md` audit guide per FR-015 and SC-013 with:
  - Step-by-step checklist for verifying coverage completeness
  - Instructions for identifying gaps vs actual repository file types
  - Process for adding new file type instructions
  - Examples of common coverage gaps
  - Maintenance guidelines
- [ ] T025 [US2] Document audit process: run `find . -type f | sort | uniq` → cross-reference against path_instructions → identify under-covered types
- [ ] T026 [P] [US2] Add 5-8 new path instruction blocks for identified gaps (SpecKit files, workflow docs, plugin documentation, reports, config) per FR-007 and FR-008
  - `.specify/spec.md` — specification completeness review
  - `.specify/plan.md` — planning rigor review
  - `.specify/tasks.md` — task clarity review
  - `workflows/*.md` — workflow structure and clarity
  - `plugins/*/SKILL.md` — plugin documentation usability
  - `.github/reports/**` — report completeness
  - `.coderabbit.yml` — meta: reviewing the config itself
- [ ] T027 [US2] Set priority levels for new blocks: 85 for exact paths, 75 for specific nested dirs, 60 for file type patterns per data-model.md priority ranges
- [ ] T028 [US2] Create coverage statistics section in audit guide: "Current: X% coverage (N file types covered, M gaps identified) → Target: 95%"
- [ ] T029 [US2] Document how to use guide for ongoing maintenance and quarterly audits
- [ ] T030 [US2] Commit audit guide and new blocks: "feat(coderabbit): add coverage audit guide and new file type instructions"

**Checkpoint**: User Story 2 complete - maintainers can now verify coverage and identify gaps. Validate with Scenarios 3, 4, 5 from quickstart.md.

---

## Phase 5: User Story 3 - Branch Strategy Enforcement Aligns with Reviews (Priority: P2)

**Goal**: Each of 30+ branch types (feat/, fix/, security/, perf/, a11y/, etc.) receives adapted review context in instruction blocks

**Independent Test**: Create PRs from security/, perf/, a11y/, feat/, docs/ branches and verify CodeRabbit feedback adapts to branch-specific context

### Implementation for User Story 3

- [ ] T031 [P] [US3] Add branch_context to 10-15 high-value instruction blocks supporting top branch types (feat/, fix/, security/, perf/, a11y/, ci/, hotfix/, docs/, refactor/, task/, release/, etc.) per FR-006, FR-013:
  - `**/*.php` → context for security/, perf/, refactor/
  - `**/*.{js,ts}` → context for feat/, perf/, a11y/
  - `**/.github/workflows/*.yml` → context for ci/, security/, ops/
  - `**/.github/agents/**` → context for security/
  - `.coderabbit.yml` → context for config/
  - `**/*.md` (documentation) → context for docs/, a11y/
  - `**/tests/**` → context for test/, perf/
- [ ] T032 [P] [US3] Create branch_context values for security/ branch type: emphasise authentication, access control, secrets handling, threat model per FR-003
- [ ] T033 [P] [US3] Create branch_context values for perf/ branch type: emphasise benchmarking, performance metrics, efficiency trade-offs per SC-011
- [ ] T034 [P] [US3] Create branch_context values for a11y/ branch type: emphasise WCAG 2.2 AA, keyboard navigation, contrast, semantics per FR-005
- [ ] T035 [P] [US3] Create branch_context values for docs/ branch type: emphasise clarity, structure, completeness, navigation per acceptance scenario
- [ ] T036 [P] [US3] Create branch_context values for 5-10 additional branch types (feat/, fix/, refactor/, test/, release/, design/, task/) for comprehensive coverage of top 15-20 by usage frequency per SC-011
- [ ] T037 [US3] Test branch-context logic: manually verify that feat/ branch gets feature-specific guidance, security/ gets security-specific guidance, etc.
- [ ] T038 [US3] Document branch-type mapping in config comments showing which branches get which context guidance
- [ ] T039 [US3] Commit branch context implementation: "feat(coderabbit): add branch-type-specific review context for 15+ branch types"

**Checkpoint**: User Story 3 complete - branch-type-specific guidance now applied. Validate with Scenarios 1, 8 from quickstart.md.

---

## Phase 6: User Story 4 - New File Types and Tooling Are Covered (Priority: P3)

**Goal**: SpecKit, workflow documentation, and plugin files receive appropriate review instructions

**Independent Test**: Modify `.specify/spec.md`, `workflows/*.md`, and `plugins/*/SKILL.md` files; verify CodeRabbit provides relevant feedback per acceptance scenarios

### Implementation for User Story 4

- [ ] T040 [P] [US4] Write instruction block for `.specify/spec.md` with 3+ focus areas: specification completeness, requirement testability, success criteria measurability, clarity per FR-007
- [ ] T041 [P] [US4] Write instruction block for `.specify/plan.md` with 3+ focus areas: plan structure, technical context completeness, decision rationale clarity
- [ ] T042 [P] [US4] Write instruction block for `.specify/tasks.md` with 3+ focus areas: task specificity, independence, testability, dependency clarity
- [ ] T043 [P] [US4] Write instruction block for `workflows/*.md` (agentic workflows) with 3+ focus areas: workflow structure, phase definitions, agent task descriptions, validation criteria per FR-008
- [ ] T044 [P] [US4] Write instruction block for `plugins/*/SKILL.md` with 3+ focus areas: plugin documentation, usability guidelines, example coverage, configuration clarity
- [ ] T045 [P] [US4] Set appropriate priorities for new blocks: 85 for exact `.specify/` paths, 75 for `workflows/`, 75 for `plugins/*/` per specificity rules
- [ ] T046 [US4] Test new blocks: create or modify sample files in each category and verify CodeRabbit references the new instructions
- [ ] T047 [US4] Commit new file type coverage: "feat(coderabbit): add instruction blocks for SpecKit, workflows, and plugin files"

**Checkpoint**: User Story 4 complete - new file types now have dedicated instructions. Validate with Scenarios 3, 4 from quickstart.md.

---

## Phase 7: User Story 5 - Consistency Across Instructions Improves Usability (Priority: P3)

**Goal**: All instruction blocks follow consistent structure, terminology, formatting, and style

**Independent Test**: Analyze all instruction blocks for structural consistency, term usage consistency, formatting patterns per SC-008

### Implementation for User Story 5

- [ ] T048 [P] [US5] Audit all instruction blocks for structural consistency: each has intro line, 3+ focus areas with bold titles, specific criteria, additional context, UK English per contract/path-instruction-schema.md
- [ ] T049 [P] [US5] Standardise terminology across all blocks: decide canonical terms (e.g., "validate" vs "verify" - standardise to one), apply globally
- [ ] T050 [P] [US5] Standardise bullet structure and indentation: all blocks use same markdown format, emphasis patterns, link styles
- [ ] T051 [P] [US5] Convert all vague adjectives to measurable criteria: "efficient" → specific time/space complexity, "robust" → specific error handling scenarios, "clear" → specific documentation requirements
- [ ] T052 [P] [US5] Standardise references and links: use consistent markdown link format, consistent reference to WCAG/WordPress standards/CLAUDE.md
- [ ] T053 [US5] Create style guide comment block in `.github/coderabbit.yml` documenting instruction block structure template (intro, focus areas, criteria, context) with 2-3 examples
- [ ] T054 [US5] Audit all 30+ blocks for UK English consistency: colour (not color), optimise (not optimize), accessible (not accessable), behaviour (not behavior)
- [ ] T055 [US5] Commit consistency improvements: "refactor(coderabbit): standardise instruction block structure, terminology, and formatting across all blocks"

**Checkpoint**: User Story 5 complete - config is now consistent and maintainable. Validate with Scenario 6 from quickstart.md.

---

## Phase 8: Cross-Technology Validation (Critical Org-Wide Requirement)

**Purpose**: Ensure technology-agnostic instructions apply consistently across WordPress, Node.js, infrastructure, and MCP projects

- [ ] T056 [P] Test instruction blocks across 4 technology categories:
  - WordPress project (block theme or plugin repo): modify PHP files, verify guidance is not PHP-specific but universally applicable
  - Node.js/TypeScript project (ls-flow or MCP repo): modify `.ts` files, verify guidance is not TypeScript/async-specific but universally applicable
  - Infrastructure project (hosting-infra repo): modify IaC files, verify guidance applies to configuration management
  - MCP server project (e.g., playwright-mcp): modify TypeScript/server files, verify guidance applies to API/integration patterns
- [ ] T057 [US4] Create Scenario 11 test from quickstart.md: cross-technology stack compatibility validation
- [ ] T058 [P] Verify no instruction blocks reference framework-specific patterns (WordPress hooks, Node modules, Terraform resources, etc.)
- [ ] T059 Commit cross-technology validation: "test(coderabbit): validate technology-agnostic instruction application across WordPress, Node, infrastructure, and MCP projects"

**Checkpoint**: Instructions verified as technology-agnostic and universally applicable.

---

## Phase 9: Pattern Priority Documentation & Validation

**Purpose**: Ensure pattern priority rules are clear and correctly implemented

- [ ] T060 [P] Document pattern priority rules extensively in `.github/coderabbit.yml`:
  - Explain 90-100 (exact paths), 70-89 (specific directories), 50-69 (file types in directories), 1-49 (general patterns)
  - Show concrete examples: `**/*.md` (priority 30) vs `.github/workflows/*.yml` (priority 90)
  - Document that first matching pattern wins (no cascading)
- [ ] T061 [P] Test pattern priority with conflicting patterns: verify `**/e2e/*.spec.ts` (priority 85) takes precedence over `**/*.ts` (priority 40)
- [ ] T062 Re-order all path_instructions in config by priority descending (highest first) per data-model.md pattern resolution flow
- [ ] T063 Add comments before each instruction block showing its priority and why (e.g., "# PRIORITY 90: Exact path to critical config file")
- [ ] T064 Validate all instructions match between config and audit guide - no discrepancies per SC-005
- [ ] T065 Commit pattern priority documentation: "docs(coderabbit): document and validate pattern priority ordering and specificity rules"

**Checkpoint**: Pattern priority is clear, documented, and validated.

---

## Phase 10: Label Automation & Template Standards Validation

**Purpose**: Verify config references match actual GitHub automation (per FR-011, FR-012, SC-005)

- [ ] T066 [P] Cross-reference all label references in config against `.github/labels.yml` (LOCKED): verify all cited labels exist and use correct family prefix (type:, status:, priority:, area:, meta:)
- [ ] T067 [P] Audit PR and issue template documentation in config: verify against actual files in `.github/PULL_REQUEST_TEMPLATE/` and `.github/ISSUE_TEMPLATE/` - zero discrepancies per SC-005
- [ ] T068 Add comments in config linking to template files and label definitions so config serves as accurate documentation
- [ ] T069 Create validation checklist in audit guide: verify labels exist, verify templates match documentation, verify workflows reference correct labels
- [ ] T070 Commit label/template validation: "fix(coderabbit): verify label and template references match actual GitHub configuration"

**Checkpoint**: Config accurately documents GitHub automation behavior.

---

## Phase 11: Backward Compatibility Validation

**Purpose**: Ensure changes don't break existing CodeRabbit workflows

- [ ] T071 [P] Validate no breaking changes to existing 20 path patterns: new instructions enhance but don't conflict with prior patterns per Assumption: Backward Compatibility
- [ ] T072 [P] Test existing PRs against new config: examine 5-10 recent PRs, verify CodeRabbit feedback quality doesn't degrade
- [ ] T073 Test configuration inheritance: verify central config applies correctly and allows repo-specific overrides per CodeRabbit architecture
- [ ] T074 Commit backward compatibility verification: "test(coderabbit): validate backward compatibility with existing CodeRabbit workflows"

**Checkpoint**: Changes are backward compatible.

---

## Phase 12: Full Quickstart Validation (11 Scenarios)

**Purpose**: End-to-end validation per quickstart.md scenarios

- [ ] T075 Run Scenario 1: Branch-type-specific guidance (security/ branch) → Verify security context applied per T031+
- [ ] T076 Run Scenario 2: Pattern priority ordering → Verify highest-priority pattern used, no cascading per T060+
- [ ] T077 Run Scenario 3: SpecKit file coverage → Verify spec.md review includes SpecKit guidance per T040
- [ ] T078 Run Scenario 4: Workflow documentation coverage → Verify workflows/*.md review includes workflow guidance per T043
- [ ] T079 Run Scenario 5: Coverage audit completeness → Verify ≥95% file type coverage identified per T024+
- [ ] T080 Run Scenario 6: Instruction block quality → Verify all blocks have 3+ focus areas, no vague language per T022
- [ ] T081 Run Scenario 7: Backward compatibility → Existing PRs produce similar feedback per T071+
- [ ] T082 Run Scenario 8: Branch type context (5 types) → Verify feat/, fix/, security/, perf/, a11y/ show distinct context per T036+
- [ ] T083 Run Scenario 9: Audit guide usability → Verify maintainer can identify gaps in <15 min without context per T024+
- [ ] T084 Run Scenario 10: Pattern priority documentation → Verify rules clearly explained in config per T060+
- [ ] T085 Run Scenario 11: Cross-technology compatibility → Test across WordPress, Node, infrastructure, MCP projects per T056+
- [ ] T086 Document results: Success = 10/11+ scenarios pass per quickstart.md
- [ ] T087 Commit validation results: "test(coderabbit): complete quickstart validation - all 11 scenarios passing"

**Checkpoint**: All validation scenarios passing.

---

## Phase 13: Polish & Documentation

**Purpose**: Final improvements, documentation, and deployment preparation

- [ ] T088 [P] Create comprehensive comments in `.github/coderabbit.yml` at config root:
  - Central configuration deployment scope (organisation-wide)
  - Technology-agnosticism constraint
  - Pattern priority rules
  - Branch context approach
  - Maintenance guidelines
  - Reference to audit guide
- [ ] T089 [P] Update `.github/docs/CODERABBIT_COVERAGE_AUDIT.md` with latest findings, examples, and quarterly audit checklist
- [ ] T090 [P] Create `.github/docs/CODERABBIT_CONFIG_GUIDE.md` for developers: "How to understand CodeRabbit review guidance" (explain path patterns, branch context, priority rules, where to find relevant instruction)
- [ ] T091 [P] Add inline links in CLAUDE.md referencing `.github/docs/CODERABBIT_COVERAGE_AUDIT.md` for maintainers
- [ ] T092 Review entire `.github/coderabbit.yml` for readability: no TODO markers, clear formatting, comments guide understanding
- [ ] T093 Final code review of config: verify all requirements met, all user stories complete, all acceptance scenarios passing
- [ ] T094 Commit polish: "docs(coderabbit): add comprehensive configuration guide and documentation"
- [ ] T095 Create PR for `.github/coderabbit.yml` changes with detailed description referencing all 5 user stories and success criteria
- [ ] T096 Merge PR after approval: CodeRabbit configuration optimization complete, deployed organisation-wide via central configuration

**Checkpoint**: Configuration complete, documented, validated, and deployed.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately (baseline audit work)
- **Foundational (Phase 2)**: Depends on Setup completion - establishes config structure, priorities, branch context approach - BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
  - US1 (P1) → T014-T023: Can start after Foundational (no story dependencies)
  - US2 (P2) → T024-T030: Can start after US1 or in parallel (independent audit work)
  - US3 (P2) → T031-T039: Can start after Foundational (independent branch context work)
  - US4 (P3) → T040-T047: Can start after Foundational (new file type instructions)
  - US5 (P3) → T048-T055: Can start after US1, US2, US3, US4 (consistency cleanup across all blocks)
- **Cross-Tech Validation (Phase 8)**: Depends on Phase 5 complete (after all user stories have created/modified instructions)
- **Pattern Priority (Phase 9)**: Depends on Foundational + all user stories creating blocks
- **Label/Template (Phase 10)**: Depends on config stabilization (can start mid-user-stories but validate at end)
- **Backward Compat (Phase 11)**: Depends on Phases 3-10 complete (pre-deployment validation)
- **Quickstart (Phase 12)**: Final validation after all implementation complete
- **Polish (Phase 13)**: Final documentation and deployment

### User Story Dependencies

- **US1 (P1)**: Enhancement of existing instruction blocks - can start after Foundational
- **US2 (P2)**: Coverage audit and new file types - independent of US1, can parallel
- **US3 (P2)**: Branch context - independent of US1/US2, can parallel
- **US4 (P3)**: New file type coverage - independent, can parallel after Foundational
- **US5 (P3)**: Consistency cleanup - DEPENDS on US1, US2, US3, US4 complete (cleanup all enhanced blocks)

### Parallel Opportunities

**Phase 1 Setup** (can run in parallel):
- T002: Extract branch types
- T003: Scan repository file types
- T004: Audit technology diversity
- T001, T005, T006: Can run after parallel tasks complete

**Phase 2 Foundational** (can run in parallel):
- T007: Priority ordering (blocks others - do first)
- T008, T009: Design decisions (can run in parallel)
- T011, T013: Org infrastructure (can run in parallel)
- T010, T012: Depend on T007/T008 complete

**After Foundational** (user stories can run in parallel):
- US1 (T014-T023): Enhance existing blocks
- US2 (T024-T030): Coverage audit and new blocks
- US3 (T031-T039): Branch context implementation
- US4 (T040-T047): New file type blocks
- US5 (T048-T055): Consistency cleanup - SEQUENCE after others

**Phase 8 Cross-Tech** (can run in parallel):
- T056: Test across 4 project types (can parallelize by project type)
- T058: Verify no framework-specific patterns

**Phase 9 Pattern Priority** (can run in parallel):
- T060, T061: Document and test priority rules
- T062, T063, T064, T065: Validate and commit

**Phase 10 Label/Template** (can run in parallel):
- T066, T067: Cross-reference labels and templates

---

## Parallel Example: User Story 1 (MVP)

```
AFTER Foundational Phase 2 completes:

Parallel - Enhancement blocks for core file types:
  T014: Enhance workflow instruction blocks
  T015: Enhance JS/TS instruction blocks
  T016: Enhance PHP/script instruction blocks
  T017: Enhance workflow/CI instruction blocks
  T018: Enhance documentation instruction blocks

Sequential - Documentation and validation:
  T019: Document instruction block examples
  T020: Create cross-reference comments
  T021: Add constraint notes
  T022: Validate consistency (UK English, no vague language)
  T023: Commit
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - unlocks all stories)
3. Complete Phase 3: User Story 1 (clear, actionable guidance for reviewers)
4. **STOP and VALIDATE**: Test with 3-5 PRs to verify CodeRabbit feedback cites new instructions
5. **DEPLOY**: Merge to production, monitor CodeRabbit review quality

### Incremental Delivery

After MVP (US1) deployed:

1. Add US2: Coverage audit guide + gap identification (maintainers can verify completeness)
2. Add US3: Branch context (security/, perf/, a11y/ guidance adaptation)
3. Add US4: New file type coverage (SpecKit, workflows, plugins)
4. Add US5: Consistency polish (final quality improvements)
5. Each story adds value independently - can pause at any checkpoint

### Estimated Effort per Phase

- Phase 1 Setup: 2-3 hours (audit, reference table creation)
- Phase 2 Foundational: 4-6 hours (design decisions, schema, reorganization)
- Phase 3 US1: 6-8 hours (enhance 8+ blocks, documentation)
- Phase 4 US2: 6-8 hours (audit guide, 5-8 new blocks, coverage analysis)
- Phase 5 US3: 8-10 hours (branch context for 15+ types, testing)
- Phase 6 US4: 4-6 hours (5 new file type blocks)
- Phase 7 US5: 6-8 hours (consistency audit and standardization)
- Phase 8-13: 8-12 hours (validation, documentation, deployment)
- **Total: 44-61 hours** (~1.5-2 week effort depending on team parallelization)

### Staffing Recommendation

- **1 person**: 2-3 weeks sequential
- **2 people**: 1-1.5 weeks (Foundational together, then US1+US2 parallel, US3+US4 parallel, US5 sequential)
- **3+ people**: 1 week (Foundational together, then all stories in parallel, US5 cleanup at end)

---

## Quality Gates

- [ ] Phase 2 Foundational complete before ANY user story work
- [ ] All task descriptions include exact file paths (per spec)
- [ ] Pattern priority rules documented and tested before deployment
- [ ] Technology-agnosticism validated across 4 project types before deployment
- [ ] All 11 quickstart scenarios passing before production deployment
- [ ] Backward compatibility verified before deployment
- [ ] 95%+ file type coverage achieved per SC-001
- [ ] Every instruction block has 3+ focus areas per SC-002
- [ ] Zero label/template discrepancies per SC-005
- [ ] Audit guide created and usable in <15 min per SC-013

---

## Notes

- [P] tasks = can run in parallel (different files, no blocking dependencies)
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Configuration changes are backwards compatible - no breaking changes
- Technology-agnosticism is CRITICAL for organisation-wide central configuration deployment
- Commit frequently (after each phase or logical task group) to maintain audit trail
- Stop at any checkpoint to validate story independently before proceeding
- Maintain feature branch `feat/coderabbit-config-optimization` throughout implementation
