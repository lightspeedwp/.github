# Tasks: Governance Audit Implementation Workflow

**Input**: Design documents from `.github/specs/006-governance-audit/`

**Prerequisites**: plan.md ✓, spec.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

**Total Tasks**: 51 | **Setup**: 3 | **Foundational**: 4 | **P1 Audit**: 13 | **P2 Validation**: 12 | **P3 Remediation**: 11 | **Integration**: 3 | **Polish**: 5

**Organization**: Tasks grouped by user story for independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable (different files, no dependencies)
- **[Story]**: User story (US1, US2, US3)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic governance audit structure

- [ ] T001 Initialize audit framework directory structure at `.specify/scripts/bash/` and `.github/scripts/`
- [ ] T002 [P] Create audit configuration file at `.github/scripts/governance-rules.json` with default rules (label-prefix-check, duplicate-detection, template-routing-validation)
- [ ] T003 [P] Setup Node.js dependencies in `.github/package.json`: js-yaml, ajv, chalk (or ensure already present in root package.json)

**Checkpoint**: Audit framework structure ready - foundational infrastructure can now begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data structures and utilities that ALL user stories depend on

⚠️ **CRITICAL**: No user story work can begin until this phase completes

- [ ] T004 Implement GovernanceFile parser in `.github/scripts/governance-file-parser.cjs` — reads YAML/Markdown, returns structured {id, path, type, format, content, locked}
- [ ] T005 [P] Create AuditRule loader in `.github/scripts/audit-rule-loader.cjs` — loads rules from governance-rules.json, validates schema per audit-rule.contract.md
- [ ] T006 [P] Implement AuditViolation builder in `.github/scripts/audit-violation-builder.cjs` — creates violations with id, location, message, remediation, affectedSystems per data-model.md
- [ ] T007 Implement report generation utilities in `.github/scripts/report-generator.cjs` — formats ComplianceReport JSON and Markdown per audit-report.contract.md

**Checkpoint**: All user stories can now proceed in parallel — foundational data structures ready

---

## Phase 3: User Story 1 - Comprehensive Governance Audit (Priority: P1) 🎯 MVP

**Goal**: Scan LOCKED governance files, validate against constitutional principles, generate compliance reports with violations and trends

**Independent Test**: Run full audit on `.github/labels.yml`, `.github/issue-types.yml`, templates → generates report with violations, trends, recommendations

**Test Scenarios** (from quickstart.md - run these to validate):

- Scenario 1: Run full audit and verify report structure matches audit-report.contract.md
- Scenario 2: Re-run audit and verify trend comparison (violations fixed/new, trend direction)
- Scenario 3: Verify <30 second performance requirement met

### Implementation for User Story 1

- [ ] T008 [P] [US1] Implement label validation logic in `.github/scripts/validate-labels.cjs` — checks prefix (type:/status:/priority:/area:/meta:), validates against canonical set, detects duplicates per FR-002, FR-004
- [ ] T009 [P] [US1] Implement issue-types validation logic in `.github/scripts/validate-issue-types.cjs` — verifies all issue types defined, checks usage in templates per FR-006
- [ ] T010 [P] [US1] Implement template validation logic in `.github/scripts/validate-templates.cjs` — checks syntax, validates content against constitution (UK English, WCAG 2.2 AA, no implementation details) per FR-007
- [ ] T011 [P] [US1] Implement PR template routing validation in `.github/scripts/validate-template-routing.cjs` — verifies each branch prefix maps to exactly one PR template per FR-005
- [ ] T012 [US1] Create main audit entrypoint at `.specify/scripts/bash/audit-governance.sh` — orchestrates all validations, calls parser/validator/reporter utilities, outputs JSON and Markdown reports
- [ ] T013 [US1] Implement compliance metrics calculator in `.github/scripts/compliance-metrics.cjs` — computes compliancePercentage, summary statistics, violationsBySeverity per audit-report.contract.md schema
- [ ] T014 [US1] Implement audit report writer in `.github/scripts/write-audit-report.cjs` — saves JSON report to `.github/reports/governance-audit-[DATE].json` and Markdown summary to `.github/reports/governance-audit-[DATE].md` per FR-008
- [ ] T015 [US1] Implement trend analysis in `.github/scripts/analyze-audit-trends.cjs` — compares current report to prior report (if exists), calculates violationsTrend (improving/stable/declining), tracks violationsFixed and newViolations per audit-report.contract.md
- [ ] T016 [US1] Add logging and verbosity control to audit script — output audit progress to console, respects --verbose flag, detailed logs to `.github/reports/audit-[DATE].log`
- [ ] T017 [US1] Implement file scanning with skip/defer options in audit entrypoint — supports `--files labels,issue-types` flag, `--rules` flag to run only specific rules, `--defer-violations` to exclude known deferred issues from compliance %
- [ ] T018 [US1] Implement performance optimization — ensure <30 second audit per SC-001 (profile and optimize hotspots if needed)
- [ ] T019 [US1] Create audit documentation at `.github/scripts/AUDIT_IMPLEMENTATION.md` — explains audit architecture, how to add new rules, troubleshooting
- [ ] T020 [US1] Run full quickstart.md Scenario 1-3 validation — verify audit execution, report structure, performance targets, trend comparison

**Checkpoint**: User Story 1 complete and tested independently — governance audit capability fully functional

---

## Phase 4: User Story 2 - Governance File Validation & Quality Checks (Priority: P2)

**Goal**: Automated validation to prevent inconsistencies before commit; pre-commit hook or CI gate that blocks non-compliant changes

**Independent Test**: Add violations to governance files → run validation → validation detects and reports with actionable feedback → user can fix immediately

**Test Scenarios** (from quickstart.md):

- Scenario 2: Validate labels file with invalid YAML
- Scenario 2: Validate label missing prefix (e.g., `bug` instead of `type:bug`) → validation flags with remediation
- Scenario 2: Validate duplicate labels → validation detects with merge recommendations
- Scenario 2: Validate template routing misconfiguration → validation surfaces errors

### Implementation for User Story 2

- [ ] T021 [P] [US2] Create validation CLI at `.github/scripts/validate-governance.cjs` — command-line entry point, accepts `--file` (labels|issue-types|templates), `--format` (yaml|markdown), `--rules` optional filter
- [ ] T022 [P] [US2] Implement YAML syntax validation in `.github/scripts/yaml-syntax-validator.cjs` — uses js-yaml, reports line numbers and specific errors per FR-009
- [ ] T023 [P] [US2] Implement semantic validation engine in `.github/scripts/semantic-validator.cjs` — executes all enabled rules, collects violations, groups by file and severity
- [ ] T024 [P] [US2] Implement naming convention checker in `.github/scripts/naming-convention-validator.cjs` — validates labels follow lowercase-hyphenated format, issue types consistent, templates named per taxonomy
- [ ] T025 [P] [US2] Implement duplicate detector in `.github/scripts/duplicate-detector.cjs` — identifies labels with identical meaning, near-duplicate templates, warns of accidental duplication per FR-004
- [ ] T026 [US2] Implement violation report formatter in `.github/scripts/validation-report-formatter.cjs` — formats validation output for CI and pre-commit hooks, includes file path, line number, violation message, remediation guidance per FR-010 acceptance
- [ ] T027 [US2] Create pre-commit hook integration at `.github/hooks/pre-commit-validate.sh` — runs validation on staged governance files, blocks commit if violations found, displays remediation guidance
- [ ] T028 [US2] Create GitHub Actions workflow at `.github/workflows/validate-governance.yml` — runs full validation on every PR, leaves comment with violations if found, prevents merge if critical violations
- [ ] T029 [US2] Implement caching for validation performance in `.github/scripts/validation-cache.cjs` — cache rule results to speed up repeated validation runs on same files
- [ ] T030 [US2] Add configuration merging in `.github/scripts/merge-validation-rules.cjs` — supports custom rules per-repo while maintaining canonical base rules
- [ ] T031 [US2] Create validation documentation at `.github/scripts/VALIDATION_IMPLEMENTATION.md` — usage examples, custom rule creation guide, integration with CI/CD, troubleshooting
- [ ] T032 [US2] Run full quickstart.md Scenario 2 validation — test YAML errors, naming violations, duplicates, template routing mismatches with intentional errors

**Checkpoint**: User Story 2 complete and tested independently — validation automation prevents issues before commit

---

## Phase 5: User Story 3 - Remediation Guidance & Implementation Planning (Priority: P3)

**Goal**: Generate clear, step-by-step remediation plans; explain what needs fixing, why, how to fix it, impact assessment, verification and rollback

**Independent Test**: Audit discovers violations → generate remediation plan → plan includes steps with current/target state, effort estimates, verification steps, rollback procedures → user can follow steps accurately

**Test Scenarios** (from quickstart.md):

- Scenario 3: Generate remediation plan from audit violations
- Scenario 3: Review plan steps with specific file paths, effort, risk, verification
- Scenario 3: Apply remediation and re-run audit → verify violations fixed

### Implementation for User Story 3

- [ ] T033 [P] [US3] Create remediation entrypoint at `.specify/scripts/bash/generate-remediation.sh` — reads audit report, generates remediation plan, outputs JSON and Markdown
- [ ] T034 [P] [US3] Implement violation-to-step mapper in `.github/scripts/violation-to-step-mapper.cjs` — converts each violation into remediation step with changeType (add/remove/modify/rename), currentState, targetState per remediation.contract.md
- [ ] T035 [P] [US3] Implement step prioritizer in `.github/scripts/remediation-step-prioritizer.cjs` — orders steps by dependency, severity, effort; critical violations first, then high, then medium, then low
- [ ] T036 [US3] Implement affected-systems analyzer in `.github/scripts/affected-systems-analyzer.cjs` — determines which repos/workflows/agents impacted by each change, maps violations to downstream effects (e.g., "label change affects CodeRabbit, PR routing, metrics")
- [ ] T037 [US3] Create step effort/risk estimator in `.github/scripts/step-estimator.cjs` — assigns effort (trivial/simple/moderate/complex) and risk (low/medium/high) per step based on violation type, file size, dependency count
- [ ] T038 [US3] Implement verification step generator in `.github/scripts/verification-generator.cjs` — creates testable verification steps for each remediation (e.g., "Run `npm run validate:labels`", "Push to branch", "Verify CI passes")
- [ ] T039 [US3] Create rollback procedure generator in `.github/scripts/rollback-generator.cjs` — generates undo instructions for each step (e.g., "Revert the commit", "Restore labels.yml to prior version")
- [ ] T040 [US3] Implement approval gate mapper in `.github/scripts/approval-gate-mapper.cjs` — identifies steps requiring approval (e.g., LOCKED file changes), specifies approvers (GitHub admin, @ashley)
- [ ] T041 [US3] Create remediation report writer in `.github/scripts/write-remediation-plan.cjs` — saves JSON plan to `.github/reports/remediation-plan-[ID].json` and Markdown guide to `.github/reports/remediation-plan-[ID].md` per remediation.contract.md schema
- [ ] T042 [US3] Implement remediation plan formatter in `.github/scripts/remediation-formatter.cjs` — formats steps as numbered list, includes before/after code blocks, inline remediation guidance, effort/risk badges
- [ ] T043 [US3] Create remediation documentation at `.github/scripts/REMEDIATION_IMPLEMENTATION.md` — explains plan structure, how to apply steps, handling approval gates, rollback procedures
- [ ] T044 [US3] Run full quickstart.md Scenario 3 validation — generate plan from violations, review steps, apply remediation, re-run audit to confirm fixes

**Checkpoint**: User Story 3 complete and tested independently — remediation planning enables clear governance fixes

---

## Phase 6: Integration & Cross-Story Validation

**Purpose**: Verify all three user stories work together in complete governance audit workflow

- [ ] T045 Run full quickstart.md Scenario 4 (integration test) — execute complete workflow: audit → validation → remediation → re-audit to confirm compliance improvement
- [ ] T046 Verify metrics-driven governance — ensure audit generates daily compliance reports, archival location documented, retention policy enforced (90 days detail, summarize older)
- [ ] T047 Create compliance dashboard query at `.github/scripts/dashboard-queries.cjs` — supports querying compliance trends, generates metrics for 30+ day history as per SC-008

**Checkpoint**: All user stories integrated — complete governance audit system functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements, documentation, and operational readiness

- [ ] T048 [P] Create comprehensive GOVERNANCE_AUDIT_GUIDE.md at `docs/` — user-facing guide covering: why audit matters (constitution compliance), how to run audit, interpreting reports, applying remediation, common scenarios
- [ ] T049 [P] Add inline documentation and JSDoc comments to all `.cjs` scripts — explain data flow, configuration options, integration points, troubleshooting
- [ ] T050 Create security hardening checklist — audit script validation (prevent injection), report file permissions, secrets handling if any
- [ ] T051 Performance profiling and optimization — ensure all performance targets met (audit <30s, validation <2s, report generation <5s) per SC-001

**Checkpoint**: Governance audit system production-ready — fully documented, optimized, secure

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies → can start immediately ✓
2. **Foundational (Phase 2)**: Depends on Setup ✓ → BLOCKS all user stories
3. **User Stories (Phase 3-5)**: All depend on Foundational ✓
   - US1 (Audit): Can start after Foundational — No story dependencies
   - US2 (Validation): Can start after Foundational — Can build independently
   - US3 (Remediation): Can start after Foundational — Can build independently
4. **Integration (Phase 6)**: Depends on all user stories (T020, T032, T044) ✓
5. **Polish (Phase 7)**: Depends on all user stories being functional ✓

### Within User Stories

- Validation utilities (T004-T007) must complete before any US tasks (US1/US2/US3 cannot proceed without them)
- Within US1: Label/issue-type/template validators (T008-T011) can run in parallel, then main audit script (T012) depends on all validators
- Within US2: Syntax/semantic/naming validators (T022-T025) can run in parallel, then formatter and integration (T026-T030) depends on all validators
- Within US3: Mappers (T033-T041) mostly independent, plan writer (T041) depends on all mappers

### Parallel Opportunities

**Setup Phase**: All Setup tasks marked [P] (T002, T003) can run in parallel

**Foundational Phase**: All Foundational tasks marked [P] (T005, T006) can run in parallel

**After Foundational completes**: All user stories (US1, US2, US3) can proceed in parallel by different team members:
- Developer A: T008-T020 (User Story 1 - Audit)
- Developer B: T021-T032 (User Story 2 - Validation)
- Developer C: T033-T044 (User Story 3 - Remediation)

**Within each user story**:
- US1: T008-T011 validators can run in parallel
- US2: T022-T025 validators can run in parallel
- US3: T033-T041 mappers can run in parallel

---

## Parallel Example: US1 Starting After Foundational

```bash
# After T007 completes, launch US1 validators in parallel:
Task: T008 Label validation logic
Task: T009 Issue-types validation logic
Task: T010 Template validation logic
Task: T011 PR template routing validation

# After T008-T011 complete, T012 main audit script depends on all:
Task: T012 Main audit entrypoint (depends on T008-T011 validators)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Goal**: Deliver governance audit capability in minimum viable form, then expand

1. **Phase 1: Setup** (T001-T003)
2. **Phase 2: Foundational** (T004-T007) ← CRITICAL
3. **Phase 3: User Story 1** (T008-T020) — Audit capability only
4. **Stop and Validate**: Run quickstart Scenario 1-3, verify audit works
5. **Deploy/Demo**: Show team governance audit in action
6. ✅ **MVP Complete** — Audit capability delivers user story 1 value

### Then Extend with User Stories 2 & 3

7. **Phase 4: User Story 2** (T021-T032) — Add pre-commit validation
8. **Phase 5: User Story 3** (T033-T044) — Add remediation planning
9. **Phase 6: Integration** (T045-T047) — Complete workflow
10. **Phase 7: Polish** (T048-T051) — Documentation, optimization

### Incremental Delivery (All Three Stories)

```
Week 1:
  - Setup + Foundational (Phases 1-2)
  - MVP: User Story 1 complete (Phase 3)
  - Demo audit capability

Week 2:
  - Add User Story 2 (Phase 4)
  - Test US1 + US2 together
  - Demo validation automation

Week 3:
  - Add User Story 3 (Phase 5)
  - Integration testing (Phase 6)
  - Polish & documentation (Phase 7)
  - Ready for production
```

### Parallel Team Strategy (3 Developers)

```
Developer A (Audit - US1):
  - Setup contribution (T001-T003)
  - Foundational (T004-T007)
  - User Story 1 (T008-T020)
  - Validation: run Scenario 1-3

Developer B (Validation - US2):
  - After Foundational ready (T004-T007)
  - User Story 2 (T021-T032)
  - Validation: run Scenario 2

Developer C (Remediation - US3):
  - After Foundational ready (T004-T007)
  - User Story 3 (T033-T044)
  - Validation: run Scenario 3

All Together:
  - Phase 6: Integration testing
  - Phase 7: Polish & documentation
```

---

## Task Checklist Format Validation

All tasks follow required format: `- [ ] [ID] [P?] [Story?] Description`

✅ Setup tasks: `- [ ] T001` through `- [ ] T003` (no [P] or [Story] in foundational setup)
✅ Foundational tasks: `- [ ] T004` through `- [ ] T007` (marked [P] where parallelizable, no [Story])
✅ US1 tasks: `- [ ] T008 [P] [US1]` through `- [ ] T020 [US1]` (all have [US1] label)
✅ US2 tasks: `- [ ] T021 [P] [US2]` through `- [ ] T032 [US2]` (all have [US2] label)
✅ US3 tasks: `- [ ] T033 [P] [US3]` through `- [ ] T044 [US3]` (all have [US3] label)
✅ Polish tasks: `- [ ] T048 [P]` through `- [ ] T051` (no [Story] in polish phase)

---

## Notes for Implementation

**Task Scoping**:
- Each task is specific enough for LLM to complete without additional context
- File paths are exact (`.github/scripts/`, `.specify/scripts/bash/`, `docs/`)
- Deliverables clearly defined
- Acceptance criteria reference contract schema or requirement ID

**Data Model Constraints** (from data-model.md):
- Label prefixes MUST be one of: `type:`, `status:`, `priority:`, `area:`, `meta:`
- Label names MUST be lowercase-hyphenated (no spaces)
- Compliance percentage = (rules passed / total rules) * 100
- Violation IDs MUST follow format: `violation-[DATE]-[###]`
- Report IDs MUST follow format: `audit-[YYYYMMDD]-[HHMMSS]`
- Remediation IDs MUST follow format: `remediation-[YYYYMMDD]-[###]`

**Constitutional Alignment** (from constitution.md):
- Section V: Branch naming strategy (audit validates per spec)
- Section VIII: Branch type to template mapping (validate routing per FR-005)
- Section IX: Changelog compliance (audit checks ≤250 chars, 100% linked)
- Section X: Automated validation & metrics-driven governance (audit generates daily metrics dashboard)

**Performance Targets** (from spec.md success criteria):
- SC-001: Audit <30 seconds (all LOCKED files)
- SC-002: 100% label naming violations detected
- SC-003: 95%+ duplicate/near-duplicate detection
- SC-004: 100% template routing accuracy
- SC-005: All violations include location, line number, remediation
- SC-006: 80% time-to-fix improvement via remediation plans
- SC-007: Post-remediation audit = 100% compliance
- SC-008: Compliance dashboard updates daily, tracks 30+ days history

---

## Validation Checkpoints

- ✅ **After T007**: Foundational infrastructure ready — all utilities available
- ✅ **After T020**: User Story 1 complete — audit capability functional, run Scenario 1-3
- ✅ **After T032**: User Story 2 complete — validation automation operational, run Scenario 2
- ✅ **After T044**: User Story 3 complete — remediation planning ready, run Scenario 3
- ✅ **After T047**: Integration complete — all stories work together, run Scenario 4
- ✅ **After T051**: Production ready — documented, optimized, tested

---

**Generated**: 2026-09-14 | **Total Tasks**: 51 | **MVP Tasks**: T001-T020 (Phase 1-3) | **Full Tasks**: T001-T051 (All Phases)
