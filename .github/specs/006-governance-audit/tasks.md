# Tasks: Governance Audit Implementation Workflow

**Input**: Design documents from `/specs/006-governance-audit/`

**Status**: Phase 2 Design Complete → Proceeding to Phase 3+ Implementation

**Organisation**: Tasks organized by user story (P1 → P2 → P3) enabling independent implementation, testing, and delivery.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

**Checkpoint Goal**: Foundation ready for user story implementation

- [ ] T001 Create project directory structure: `.specify/scripts/bash/`, `.github/scripts/`, `.github/reports/`, `tests/unit/`, `tests/integration/`, `src/`
- [ ] T002 Initialize Node.js project with package.json (Node.js 18+, dependencies: js-yaml, ajv, chalk, jest)
- [ ] T003 [P] Install dependencies: js-yaml, ajv, chalk, jest, prettier, eslint
- [ ] T004 [P] Configure linting and formatting: .eslintrc.json, .prettierrc.json, npm scripts for lint and format
- [ ] T005 Create governance audit configuration file: `.github/scripts/governance-rules.json` (stub with rule categories)
- [ ] T006 Create documentation directory structure: `.github/specs/006-governance-audit/contracts/`, `.github/specs/006-governance-audit/quickstart.md`

**Checkpoint**: All project scaffolding and dependencies installed, ready for foundational work

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can start

**⚠️ CRITICAL**: No user story work begins until this phase is complete

- [ ] T007 Create TypeScript/JavaScript types definition file: `src/types.ts` with GovernanceFile, GovernanceEntity, AuditRule, AuditViolation, ComplianceReport, RemediationPlan interfaces
- [ ] T008 Implement file loading utility: `src/utils/file-loader.ts` to read YAML and Markdown governance files with error handling
- [ ] T009 Implement file parser: `src/utils/file-parser.ts` to parse `.github/labels.yml`, `.github/issue-types.yml`, templates into GovernanceEntity objects
- [ ] T010 Create audit rules registry: `src/audit-rules/registry.ts` to load and manage all AuditRule definitions (34+ rule types per data-model.md)
- [ ] T011 Implement report generator utility: `src/utils/report-generator.ts` to create ComplianceReport JSON/Markdown output with metrics
- [ ] T012 Create error handling and logging framework: `src/utils/logger.ts` with colored console output via chalk
- [ ] T013 Implement configuration loader: `src/config/loader.ts` to read governance-rules.json and constitution.md for validation rules
- [ ] T014 [P] Create base test utilities: `tests/test-helpers.ts` for fixtures, sample governance files, mock data
- [ ] T015 [P] Set up test configuration: `jest.config.js` with test path patterns, coverage thresholds (>80%)
- [ ] T016 Create helper scripts: `scripts/validate.sh` for pre-commit checks, `scripts/test.sh` for running test suite

**Checkpoint**: Foundation ready — User stories can now be implemented in parallel

---

## Phase 3: User Story 1 - Comprehensive Governance Audit (Priority: P1) 🎯 MVP

**Goal**: Scan all LOCKED governance files, detect violations, generate compliance reports showing audit results with remediation recommendations

**Independent Test**: Run audit against sample governance files and validate ComplianceReport output contains file list, rule count, violations with locations and remediation guidance

### Implementation for User Story 1

- [ ] T017 [P] [US1] Create AuditViolation data structure: `src/types.ts` with location (line/column/path), severity, message, currentValue, expectedValue, remediation fields
- [ ] T018 [P] [US1] Implement audit rule: "label-prefix-check" in `src/audit-rules/label-prefix-check.ts` — Validate all labels include required prefix (type:, status:, priority:, area:, meta:) per FR-002
- [ ] T019 [P] [US1] Implement audit rule: "label-usage-check" in `src/audit-rules/label-usage-check.ts` — Verify each label in canonical set has documented purpose and used at least once per FR-003
- [ ] T020 [P] [US1] Implement audit rule: "duplicate-labels" in `src/audit-rules/duplicate-labels.ts` — Detect duplicate and near-duplicate labels (same meaning, different names) per FR-004
- [ ] T021 [P] [US1] Implement audit rule: "pr-template-routing" in `src/audit-rules/pr-template-routing.ts` — Validate each branch prefix maps to exactly one PR template per FR-005
- [ ] T022 [P] [US1] Implement audit rule: "issue-type-usage" in `src/audit-rules/issue-type-usage.ts` — Verify all issue types used in at least one active template per FR-006
- [ ] T023 [P] [US1] Implement audit rule: "template-content-quality" in `src/audit-rules/template-content-quality.ts` — Check template compliance: UK English, WCAG 2.2 AA guidance, no implementation details per FR-007
- [ ] T024 [US1] Implement audit engine: `src/audit/audit-engine.ts` — Orchestrate file loading, rule application, violation detection (depends on T017-T023)
- [ ] T025 [US1] Implement compliance report generation: `src/audit/report-builder.ts` — Aggregate violations, calculate compliance percentage, create ComplianceReport per FR-008
- [ ] T026 [US1] Create JSON report output: `src/formatters/json-formatter.ts` to serialize ComplianceReport to `.github/reports/governance-audit-[DATE].json`
- [ ] T027 [US1] Create Markdown report output: `src/formatters/markdown-formatter.ts` to generate human-readable `.github/reports/governance-audit-[DATE].md` with summary, violations table, recommendations
- [ ] T028 [US1] Implement audit CLI entrypoint: `.specify/scripts/bash/audit-governance.sh` — Node.js wrapper invoking `src/cli/audit.ts` with <30s performance target per SC-001
- [ ] T029 [US1] Create unit tests for audit rules in `tests/unit/audit-rules/`: test label prefix validation, duplicate detection, template routing, with >80% coverage
- [ ] T030 [US1] Create integration tests for full audit flow: `tests/integration/audit-full-flow.test.ts` — Run audit on sample governance files, validate report completeness and accuracy per SC-002, SC-003, SC-004
- [ ] T031 [US1] Implement report archival: store timestamped reports in `.github/reports/` with automatic file cleanup (keep 90 days) per SC-008

**Checkpoint**: User Story 1 complete and independently testable. Audit system scans files, detects violations, generates compliance reports.

---

## Phase 4: User Story 2 - Governance File Validation & Quality Checks (Priority: P2)

**Goal**: Validate governance file format and quality before commits; prevent inconsistencies via pre-commit hooks

**Independent Test**: Run validation against governance files with errors (invalid YAML, missing prefixes, duplicates) and confirm all violations detected with remediation guidance

### Implementation for User Story 2

- [ ] T032 [P] [US2] Implement YAML syntax validator: `src/validators/yaml-syntax.ts` — Check YAML parsing, required fields, correct structure per FR-009
- [ ] T033 [P] [US2] Implement naming convention validator: `src/validators/naming-conventions.ts` — Enforce lowercase, hyphen-separated names, no spaces
- [ ] T034 [P] [US2] Implement reference validator: `src/validators/reference-validator.ts` — Ensure all referenced labels/issue types exist in canonical set
- [ ] T035 [US2] Create pre-commit hook implementation: `.github/scripts/validate-governance.cjs` — Node.js CommonJS module for git pre-commit hook integration
- [ ] T036 [US2] Implement validation runner: `src/cli/validate.ts` — Execute all validators, report errors with line numbers per FR-010
- [ ] T037 [US2] Create validation output formatter: `src/formatters/validation-formatter.ts` — Output validation errors with file location, specific rule violated, remediation steps
- [ ] T038 [US2] Set up pre-commit hook integration in `.github/scripts/` — Document hook installation, CI/CD integration points
- [ ] T039 [US2] Create validation tests: `tests/unit/validators/` — Test YAML parsing, naming conventions, reference checks per FR-009
- [ ] T040 [US2] Create pre-commit hook integration tests: `tests/integration/pre-commit-validation.test.ts` — Verify hook blocks commits with governance violations
- [ ] T041 [US2] Document validation in `.github/specs/006-governance-audit/contracts/audit-rule.contract.md` — Define validation output schema

**Checkpoint**: User Story 2 complete and independently testable. Pre-commit validation blocks inconsistent governance file commits.

---

## Phase 5: User Story 3 - Remediation Guidance & Implementation Planning (Priority: P3)

**Goal**: Generate step-by-step remediation plans with impact assessment and rollback guidance for fixing governance violations

**Independent Test**: Generate remediation plan from audit findings (label naming violations, template routing issues) and validate plan includes current state, target state, affected repos, effort/risk, rollback procedure

### Implementation for User Story 3

- [ ] T042 [P] [US3] Create RemediationPlan data structure: `src/types.ts` with steps, stepNumber, currentState, targetState, effort, risk, affectedRepositories, verificationSteps, rollbackProcedure fields
- [ ] T043 [P] [US3] Implement remediation plan generator: `src/remediation/plan-generator.ts` — Transform AuditViolation objects into RemediationPlan steps per FR-011
- [ ] T044 [P] [US3] Implement effort estimator: `src/remediation/effort-estimator.ts` — Classify changes as trivial/simple/moderate/complex based on violation type and scope
- [ ] T045 [P] [US3] Implement risk assessor: `src/remediation/risk-assessor.ts` — Classify risk as low/medium/high based on affected systems, change scope, dependencies
- [ ] T046 [P] [US3] Implement affected systems analyzer: `src/remediation/affected-systems.ts` — Identify repositories, workflows, agents impacted by each remediation step
- [ ] T047 [US3] Create remediation plan CLI: `.specify/scripts/bash/generate-remediation.sh` — Invoke `src/cli/remediate.ts` with audit findings input per FR-011
- [ ] T048 [US3] Implement Markdown remediation formatter: `src/formatters/remediation-formatter.ts` — Generate human-readable `.github/reports/remediation-plan-[ID].md` with step-by-step guidance
- [ ] T049 [US3] Implement priority sorting: `src/remediation/priority-sorter.ts` — Order remediation steps (critical blockers first, then quality improvements)
- [ ] T050 [US3] Create remediation tests: `tests/unit/remediation/` — Test plan generation, effort estimation, risk assessment, affected systems identification
- [ ] T051 [US3] Create end-to-end remediation test: `tests/integration/remediation-e2e.test.ts` — Audit → violations → remediation plan → apply changes → re-audit (zero violations)
- [ ] T052 [US3] Document remediation plan in `.github/specs/006-governance-audit/contracts/remediation.contract.md` — Define plan output schema, step structure, approval gates

**Checkpoint**: User Story 3 complete and independently testable. Remediation system generates actionable plans for fixing violations with impact assessment and rollback guidance.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality improvements and integration across all user stories

- [ ] T053 [P] Create comprehensive test suite for all audit rules: `tests/unit/audit-rules/` with >80% coverage of all rule types
- [ ] T054 [P] Create edge case tests: `tests/unit/edge-cases/` — orphaned templates, evolved governance, security violations, multiple truth sources
- [ ] T055 [P] Performance testing: `tests/perf/audit-performance.test.ts` — Verify audit completes in <30s, validation <2s per SC-001
- [ ] T056 [P] Create test fixtures: sample governance files with violations, edge cases, success scenarios in `tests/fixtures/`
- [ ] T057 Create API documentation: `docs/API.md` — Document all exported types, utility functions, rule definitions
- [ ] T058 Create user guide: `docs/USER_GUIDE.md` — How to run audit, interpret reports, use remediation plans
- [ ] T059 Create developer guide: `docs/DEVELOPER_GUIDE.md` — Adding custom audit rules, extending validators, testing approach
- [ ] T060 Set up CI/CD integration: `.github/workflows/governance-audit.yml` — Run audit on every commit, post reports as artifacts
- [ ] T061 Set up pre-commit hook installation: Document setup in `docs/INSTALLATION.md` — How to enable validation in local development
- [ ] T062 Create compliance metrics dashboard setup: `src/cli/metrics.ts` — Generate daily compliance summaries per SC-008
- [ ] T063 Run quickstart validation: Execute scenarios in `.github/specs/006-governance-audit/quickstart.md` and verify all workflows function end-to-end
- [ ] T064 [P] Code cleanup and refactoring: Remove dead code, consolidate utilities, improve error messages
- [ ] T065 Performance optimization: Profile audit engine, optimize file parsing and rule matching for <30s target
- [ ] T066 Security hardening: Validate input sanitization, verify no injection vulnerabilities, audit dependency versions
- [ ] T067 Add example output: Create sample audit reports and remediation plans in `.github/specs/006-governance-audit/examples/`
- [ ] T068 Final validation: Run full test suite (unit + integration + performance) and confirm all pass
- [ ] T069 Documentation review: Update spec.md, plan.md, data-model.md with actual implementation details and decisions

**Checkpoint**: All user stories integrated, tested, documented, and ready for production use

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Phase 1 (Setup)** → Can start immediately
2. **Phase 2 (Foundational)** → Depends on Phase 1 completion — **BLOCKS all user stories**
3. **Phase 3-5 (User Stories)** → Each depends on Phase 2 — Can proceed in parallel or sequentially
4. **Phase 6 (Polish)** → Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - Audit)**: Can start after Phase 2 — No dependencies on US2 or US3
- **User Story 2 (P2 - Validation)**: Can start after Phase 2 — Can run independently, may integrate with US1 validation rules
- **User Story 3 (P3 - Remediation)**: Can start after Phase 2 — Consumes AuditViolation output from US1 audit engine

### Within User Stories

1. Core data models (T017-T023 for US1)
2. Business logic implementation (T024-T027 for US1)
3. Output formatters (T026-T027 for US1)
4. CLI entrypoints (T028 for US1)
5. Testing (T029-T031 for US1)

### Parallel Opportunities

**Within Phase 1:**
- T003, T004 can run in parallel (dependencies, linting config)

**Within Phase 2:**
- T007-T015 can run in parallel (types, utilities, configuration, tests setup)

**Within User Story 1 (Phase 3):**
- T018-T023 can run in parallel (all audit rules are independent)
- All unit tests (T029) can run in parallel

**Within User Story 2 (Phase 4):**
- T032-T034 can run in parallel (all validators are independent)
- T039-T040 can run in parallel (validation tests)

**Within User Story 3 (Phase 5):**
- T042-T046 can run in parallel (remediation system components)

**Across User Stories (after Phase 2):**
- US1, US2, US3 can be worked in parallel by different developers
- Each story is independently testable and deliverable

---

## Parallel Execution Examples

### Example 1: Single Developer Sequential (MVP First)

```bash
# Complete foundation first
Phase 1 (Setup) → Phase 2 (Foundational)
# Then implement MVP (US1 only)
Phase 3 (US1) → Validate & test
# Then add validation (US2)
Phase 4 (US2)
# Then add remediation (US3)
Phase 5 (US3)
# Polish and integrate
Phase 6 (Polish)
```

**Time estimate**: ~4-5 weeks for MVP, +3 weeks per additional user story

### Example 2: Team Parallel (All Three Stories)

```bash
# Day 1: Team completes Setup + Foundational together
Team: Phase 1 + Phase 2 (critical path)

# Days 2-12: Three developers work in parallel
Dev-A: Phase 3 (US1 - Audit)
Dev-B: Phase 4 (US2 - Validation)  
Dev-C: Phase 5 (US3 - Remediation)

# Day 13+: Polish and integrate
Team: Phase 6 (Polish) + Integration tests
```

**Time estimate**: ~2 weeks for full feature with team

---

## Implementation Strategy

### MVP Scope (User Story 1 Only)

**Deliverable**: Audit system that scans governance files and generates compliance reports

**Phases to complete**:
1. Phase 1: Setup (2 days)
2. Phase 2: Foundational (5 days)
3. Phase 3: User Story 1 (7 days)
4. Phase 6: Polish (3 days)

**Total MVP effort**: ~17 days

**Verification**: Full audit runs in <30s, detects 100% of label violations, generates accurate compliance report

### Incremental Delivery

1. **Iteration 1**: Complete MVP (Phases 1-3 + basic polish)
   - Deploy audit system, demonstrate compliance reporting
   - Customers can run audits, view reports, get remediation recommendations

2. **Iteration 2**: Add User Story 2 (Validation)
   - Customers can prevent violations at commit time via pre-commit hooks
   - Integration with GitHub Actions CI/CD

3. **Iteration 3**: Add User Story 3 (Remediation)
   - Customers have full guided remediation workflow
   - Impact assessment and risk analysis for each change

4. **Iteration 4**: Polish & Hardening
   - Comprehensive documentation, examples, CI/CD setup
   - Performance optimization, security hardening
   - Production-ready with 80%+ test coverage

---

## Task Format Validation

All tasks follow the required checklist format:
- ✅ Checkbox: `- [ ]` starts every task
- ✅ Task ID: Sequential T001-T069 in execution order
- ✅ [P] marker: Included only for parallelizable tasks
- ✅ [Story] label: Included for all US1/US2/US3 phase tasks
- ✅ Description: Clear action with exact file path

**Example**:
- ✅ `- [ ] T028 [US1] Implement audit CLI entrypoint: `.specify/scripts/bash/audit-governance.sh`

---

## Notes

- Each task must be specific enough for an LLM to complete independently
- Tests should be written FIRST and FAIL before implementation (TDD approach optional but recommended)
- Commit after each task or logical group for clean history
- Verify tests pass before considering task complete
- Use Phase checkpoints to validate story independence and correctness
- All file paths are relative to `.github/` repository root
- Report any blockers or ambiguities immediately for clarification
