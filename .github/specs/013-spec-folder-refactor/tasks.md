# Tasks: SpecKit Folder Organization Refactoring & Quality Audit

**Input**: Design documents from `/specs/013-spec-folder-refactor/`

**Prerequisites**: plan.md (✅), spec.md (✅), research.md (✅), data-model.md (✅), contracts/ (✅), quickstart.md (✅)

**Tests**: Not explicitly requested in specification; audit and documentation generation are primary deliverables (manual validation)

**Organization**: Tasks are grouped by user story (5 stories) to enable independent audit/documentation completion.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish foundation for audit tasks (setup scripts, utility functions, directories)

- [ ] T001 Create audit utility script at `.specify/scripts/bash/audit-specs.sh` for scanning `.github/specs/` directory structure
- [ ] T002 Create data export functions for specification metadata (number, slug, status, title) as input to catalog generation
- [ ] T003 [P] Create directory for audit reports at `.github/specs/audit-reports/` (or inline in feature directory)
- [ ] T004 [P] Create template for audit result formatting (pass/fail per dimension per spec)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core audit and documentation infrastructure that MUST complete before any user story can generate deliverables

**⚠️ CRITICAL**: No user story audit/documentation can generate output until this phase is complete

- [x] T005 Document audit methodology in internal notes (8-dimension audit approach, per-spec analysis, gap identification)
- [ ] T006 List all 12 existing specifications by directory scan (001-012) to establish audit target list
- [x] T007 Create template for audit report structure (summary table, per-spec results, remediation priority)
- [x] T008 Establish quality dimension definitions (Completeness, Clarity, Consistency, Measurability, Scenario Coverage, Edge Cases, Dependencies, Ambiguities)
- [x] T009 Create checklist for catalog entry validation (links valid, status accurate, dates consistent)
- [x] T010 [P] Create template for MAINTENANCE.md with section headings (Numbering Scheme, Create New Spec, Update Spec, Archive, Maintenance Procedures, Quality Gates, Governance Authority)

**Checkpoint**: Audit templates ready, specification list established, 8 dimensions documented - user story audits can now begin

---

## Phase 3: User Story 1 - Audit Current SpecKit Folder Structure (Priority: P1)

**Goal**: Execute directory audit to verify 001-012 folder structure, naming compliance, and spec.md presence

**Independent Test**: Script successfully scans `.github/specs/`, lists all 12 directories, reports naming compliance and file presence; output matches expected inventory

### Implementation for User Story 1

- [x] T011 [US1] Implement audit function in `.specify/scripts/bash/audit-specs.sh` to scan `.github/specs/` for all numbered directories (pattern: `[0-9][0-9][0-9]-*`)
- [x] T012 [US1] Implement naming convention check function: verify each directory follows `{NNN}-{slug}` format (3-digit number, lowercase slug, hyphens)
- [x] T013 [US1] Implement spec.md presence check function: verify all directories contain `/spec.md` file (FR-001)
- [x] T014 [US1] Implement sequential numbering verification function: scan all directory numbers and verify 001-012 with no gaps (FR-002)
- [x] T015 [US1] Execute directory audit script and capture complete inventory output (all 12 specs, naming status, file presence, numbering status)
- [x] T016 [US1] Document audit results in `.github/specs/013-spec-folder-refactor/directory-audit-report.txt` (raw output from T015)

**Acceptance Criteria** (SC-001, SC-002):

- ✅ 100% of directories follow `{NNN}-{slug}` naming convention (FR-003)
- ✅ Numbering is fully sequential 001-012 with zero gaps (FR-002)
- ✅ All 12 directories contain spec.md file (FR-001)

**Checkpoint**: Directory audit complete - User Story 1 deliverable ready for validation

---

## Phase 4: User Story 2 - Create Specification Catalog & Index (Priority: P1)

**Goal**: Build centralized CATALOG.md listing all 12 specifications with metadata, status, and navigation links

**Independent Test**: CATALOG.md exists at `.github/specs/CATALOG.md`, lists all 12 specs in index table with title/purpose/status/date, all links are valid and point to correct directories, usable in <30 seconds

### Implementation for User Story 2

- [x] T017 [P] [US2] Extract specification metadata (number, title, slug, status, created_date) for all 12 specs from directory names and spec.md files
- [x] T018 [P] [US2] Validate spec.md file presence for each of 12 specs (confirm all have spec.md, report any missing as audit findings)
- [x] T019 [US2] Create index table structure in `.github/specs/CATALOG.md` with columns: # | Title | Purpose | Status | Created | Link (per CATALOG.md.contract)
- [x] T020 [US2] Populate index table with all 12 specifications in number order (001-012) with valid Markdown links (./NNN-slug/spec.md)
- [x] T021 [US2] Create detailed entry section in CATALOG.md with `### NNN - Title` headings for all 12 specs (per CATALOG.md.contract)
- [x] T022 [US2] Populate detailed entries with 2-3 sentence summaries from each spec.md description field
- [x] T023 [US2] Add link to CATALOG.md from `.github/CLAUDE.md` with navigation instructions (so team discovers catalog)
- [x] T024 [US2] Verify all CATALOG.md links are valid and point to existing directories (using bash: for loop to test each link)

**Acceptance Criteria** (SC-003, SC-007):

- ✅ CATALOG.md exists at `.github/specs/CATALOG.md` with all 12 specifications listed (FR-004)
- ✅ All links are valid and point to correct spec directories
- ✅ Specifications are discoverable in <30 seconds using CATALOG.md (SC-007)
- ✅ CLAUDE.md links to CATALOG.md for navigation

**Checkpoint**: Specification catalog complete - User Story 2 deliverable ready for validation

---

## Phase 5: User Story 3 - Audit Specification Quality Across All 12 Specs (Priority: P1)

**Goal**: Execute 8-dimension quality audit against all 12 specifications; generate comprehensive audit report with per-spec findings and remediation plan

**Independent Test**: audit-report.md exists, covers all 12 specs, shows PASS/FAIL for each 8 dimension per spec with specific examples, remediation plan includes ≥90% of gaps with actionable steps

### Implementation for User Story 3

- [x] T025 [P] [US3] Create audit report template file at `.github/specs/013-spec-folder-refactor/audit-report.md` with structure: Summary, Per-Specification Results, Remediation Plan
- [x] T026 [US3] Execute quality analysis for Spec 001: evaluate against 8 dimensions (Completeness, Clarity, Consistency, Measurability, Scenario Coverage, Edge Cases, Dependencies, Ambiguities) - document PASS/FAIL + examples
- [x] T027 [US3] Execute quality analysis for Spec 002: same 8-dimension analysis
- [x] T028 [US3] Execute quality analysis for Spec 003: same 8-dimension analysis
- [x] T029 [US3] Execute quality analysis for Spec 004: same 8-dimension analysis
- [x] T030 [US3] Execute quality analysis for Spec 005: same 8-dimension analysis
- [x] T031 [US3] Execute quality analysis for Spec 006: same 8-dimension analysis
- [x] T032 [US3] Execute quality analysis for Spec 007: same 8-dimension analysis
- [x] T033 [US3] Execute quality analysis for Spec 008: same 8-dimension analysis
- [x] T034 [US3] Execute quality analysis for Spec 009: same 8-dimension analysis
- [x] T035 [US3] Execute quality analysis for Spec 010: same 8-dimension analysis
- [x] T036 [US3] Execute quality analysis for Spec 011: same 8-dimension analysis
- [x] T037 [US3] Execute quality analysis for Spec 012: same 8-dimension analysis
- [x] T038 [US3] [P] Create summary table in audit-report.md showing average quality score, number of PASS/FAIL results, most common gap dimension (FR-006)
- [x] T039 [US3] Create remediation plan section in audit-report.md: list all identified quality gaps with specific recommendations ordered by impact/effort (FR-008)
- [x] T040 [US3] For each remediation item: include spec number, dimension failed, gap description, suggested fix, estimated effort (FR-007, FR-008)
- [x] T041 [US3] Verify audit accuracy: spot-check 3 random specs' audit findings against actual spec.md content to confirm ≥95% accuracy (SC-004)

**Acceptance Criteria** (SC-004, SC-005):

- ✅ Quality audit report generated covering all 12 specifications with 8-dimension pass/fail status (FR-005, FR-006)
- ✅ Specific quality gaps identified with examples and line references (FR-007)
- ✅ ≥95% accuracy when spot-checked against specifications (SC-004)
- ✅ Remediation plan documented with ≥90% of gaps having actionable steps (SC-005)

**Checkpoint**: Quality audit complete - User Story 3 deliverable ready for validation

---

## Phase 6: User Story 4 - Establish SpecKit Maintenance Process & Governance (Priority: P2)

**Goal**: Document comprehensive maintenance procedures for managing specifications going forward, including numbering, creation, updates, catalog maintenance, and quality gates

**Independent Test**: MAINTENANCE.md exists at `.github/specs/MAINTENANCE.md`, contains procedures for create/update/archive specs, numbering scheme documented, quality gates defined, governance authority (@ashley) documented, procedures are non-technical and actionable

### Implementation for User Story 4

- [x] T042 [P] [US4] Create MAINTENANCE.md at `.github/specs/MAINTENANCE.md` using contract structure from MAINTENANCE.md.contract
- [x] T043 [P] [US4] Document numbering scheme section: current specs preserved (001-012), new specs start at 013, next = highest current + 1 (FR-012, from clarification)
- [x] T044 [P] [US4] Document "Creating a New Specification" procedure with step-by-step instructions: determine number, create directory, use SpecKit workflow, update CATALOG.md, approval gate (FR-009)
- [x] T045 [P] [US4] Document "Updating an Existing Specification" procedure: change request process, quality re-validation, catalog updates, approval gate (FR-010)
- [x] T046 [P] [US4] Document "Archiving a Specification" procedure: marking as archived, preserving in catalog, updating references, no number reuse (from edge cases)
- [x] T047 [P] [US4] Document "Catalog Maintenance" procedures: when to update (7 days after new spec), what fields to refresh, verification checklist
- [x] T048 [US4] Document "Quality Gate Enforcement" section: all 8 dimensions must pass, quality checklist requirement, failure actions, @ashley approval authority (FR-011)
- [x] T049 [US4] Document governance authority: @ashley is approval authority for spec creation/updates/archival (FR-011, from Constitution Principle I)
- [x] T050 [US4] Document SpecKit tools reference: `/speckit-specify`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks` with brief descriptions
- [x] T051 [US4] Add command examples for audit and specification directory operations (bash commands for listing, counting, finding highest number)
- [x] T052 [US4] Write MAINTENANCE.md in plain English suitable for non-technical governance stakeholders (no jargon, step-by-step guidance)
- [x] T053 [US4] Add acceptance checklist to MAINTENANCE.md for common operations (new spec creation, updates, archival) so maintainers can verify compliance

**Acceptance Criteria** (SC-006):

- ✅ Maintenance procedures documented in `specs/MAINTENANCE.md` covering: numbering scheme, new spec creation, update process, quality gates, catalog maintenance, governance authority (FR-009, FR-010, FR-011)
- ✅ Procedures are non-technical and suitable for governance team (SC-006)
- ✅ Quality gates clearly defined (8 dimensions, @ashley approval)
- ✅ Governance authority documented (@ashley)

**Checkpoint**: Maintenance procedures complete - User Story 4 deliverable ready for validation

---

## Phase 7: User Story 5 - Identify Specification Numbering Gaps & Correct if Needed (Priority: P2)

**Goal**: Verify specification numbering is truly sequential (001-012 with no gaps); document findings and confirm no renumbering is needed (historical traceability maintained)

**Independent Test**: Numbering audit confirms 001-012 sequential with zero gaps, findings documented, clarification about preserving current numbers is documented, future numbering strategy (next = highest + 1) is confirmed working

### Implementation for User Story 5

- [x] T054 [US5] Run numbering audit: extract all directory numbers from `.github/specs/[0-9][0-9][0-9]-*/` (T006 should provide list)
- [x] T055 [US5] Build sequential check: verify 001, 002, 003, ..., 012 exist in order with no gaps or duplicates
- [x] T056 [US5] Document numbering audit results in `.github/specs/013-spec-folder-refactor/numbering-audit-report.txt`: current numbers, any gaps found (expected: none), verification of sequential pattern
- [x] T057 [US5] Verify clarification is properly documented: current specs 001-012 preserved as-is, new specs start at 013, next = highest current + 1 (per clarification in spec.md Session 2026-09-16)
- [x] T058 [US5] Document in MAINTENANCE.md that numbering strategy enables predictable future numbering (next spec = 014 after 013, etc.) (FR-012)
- [x] T059 [US5] Verify assumption met: no renumbering executed, historical traceability maintained (specs keep original numbers per acceptance scenario 2)

**Acceptance Criteria** (SC-002, SC-009):

- ✅ Specification numbering is fully sequential with zero gaps (001-012) (SC-002, FR-002)
- ✅ Historical specs preserved with no renumbering (from clarification: preserve 001-012)
- ✅ Next specification numbering strategy clear: 013, then 014, etc. (SC-009, FR-012)
- ✅ Predictable numbering enables automated assignment for future specs

**Checkpoint**: Numbering audit complete - User Story 5 deliverable ready for validation

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and integration of all deliverables

- [x] T060 [P] Add CATALOG.md link to README.md or repo overview (if applicable) for discoverability
- [x] T061 [P] Run quickstart.md validation scenarios (6 scenarios): verify all 5 user stories meet their acceptance criteria
- [x] T062 [US1] Scenario 1: Directory audit results match expected 100% compliance (SC-001, SC-002, SC-003)
- [x] T063 [US2] Scenario 2: CATALOG.md discovery working, <30 second locate time (SC-007)
- [x] T064 [US3] Scenario 3: Quality audit report complete, ≥95% accurate (SC-004, SC-005)
- [x] T065 [US4] Scenario 4: MAINTENANCE.md procedures clear and non-technical (SC-006)
- [x] T066 [US5] Scenario 5: Numbering strategy verified (sequential, no gaps, predictable future numbering) (SC-009)
- [x] T067 Scenario 6: End-to-end validation - all deliverables integrated and working together
- [x] T068 [P] Documentation review: ensure CATALOG.md and MAINTENANCE.md are current as of implementation date
- [x] T069 [P] Update CLAUDE.md to reference CATALOG.md for specification navigation (if not done in T023)
- [x] T070 Commit all audit reports, CATALOG.md, and MAINTENANCE.md to branch
- [x] T071 Create or update PR description with links to all deliverables (CATALOG.md, MAINTENANCE.md, audit-report.md)
- [x] T072 Final verification: all 9 success criteria met, all deliverables complete and validated

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
  - **CRITICAL**: T006 (list all 12 specs) and T008 (8 dimensions documented) are required before user story audits
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User Story 1 (Audit Structure): Can start after T005-T010
  - User Story 2 (Catalog): Can start after T005-T010
  - User Story 3 (Quality Audit): Can start after T005-T010
  - User Story 4 (Maintenance): Can start after T005-T010, includes specification of future numbering
  - User Story 5 (Numbering Gaps): Can start after T006 (list of all specs)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (Audit Structure, P1)**: No dependencies on other stories - can run independently
- **User Story 2 (Catalog, P1)**: No dependencies on other stories - can run independently
  - Depends on T006 (list of specs) to populate catalog
- **User Story 3 (Quality Audit, P1)**: No dependencies on other stories - can run independently
  - Depends on T006 (list of specs) to audit all 12
- **User Story 4 (Maintenance, P2)**: No dependencies on other stories - can run independently
  - Incorporates numbering strategy from US5 and quality gates
- **User Story 5 (Numbering Gaps, P2)**: No dependencies on other stories - can run independently
  - Depends on T006 (list of specs) to verify sequence

### Within User Stories

- T011 (directory scan) before T012 (naming check) and T014 (numbering check)
- T015 (execute audit) depends on T011-T014 (all check functions implemented)
- T017-T018 (metadata extraction) before T019-T024 (catalog population)
- T026-T037 (individual spec audits) before T038-T040 (summary and remediation)
- T042-T051 (MAINTENANCE.md content) before T052-T053 (formatting and checklist)

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003, T004)
- Foundational tasks can proceed sequentially (interdependent on each other)
- Once Foundational complete (T010), all 5 user stories can proceed in parallel:
  - Developer A: User Story 1 (Audit Structure)
  - Developer B: User Story 2 (Catalog Creation)
  - Developer C: User Story 3 (Quality Audit)
  - Developer D: User Story 4 (Maintenance Procedures)
  - Developer E: User Story 5 (Numbering Verification)
- Within each user story:
  - US1: T012-T014 (checks) can be parallel [P] if implemented as separate functions
  - US2: T017-T018 (metadata extraction) marked [P] - can run in parallel
  - US3: Individual spec audits (T026-T037) can be distributed across multiple processors
  - US4: Procedure documentation sections (T043-T047) marked [P] - can be drafted in parallel, integrated serially
  - US5: Depends more on sequential verification

---

## Parallel Example: All User Stories in Parallel (After Foundational)

```bash
# After Phase 2 Foundational complete:
# Developer A: User Story 1 (Audit Structure) - T011 to T016 (6 tasks)
# Developer B: User Story 2 (Catalog) - T017 to T024 (8 tasks)
# Developer C: User Story 3 (Quality Audit) - T025 to T041 (17 tasks)
# Developer D: User Story 4 (Maintenance) - T042 to T053 (12 tasks)
# Developer E: User Story 5 (Numbering) - T054 to T059 (6 tasks)

# All stories are independent and can be worked on simultaneously
# Stories have minimal data dependencies (only from T006 list of specs)
# Each story has independent test criteria (can validate without other stories)
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only) 🎯

**Recommended approach**: Complete essential audit deliverables first

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T010) - CRITICAL
3. Complete Phase 3: User Story 1 (Audit Structure) - T011-T016
4. Complete Phase 4: User Story 2 (Catalog) - T017-T024
5. Complete Phase 5: User Story 3 (Quality Audit) - T025-T041
6. **STOP and VALIDATE**: Run quickstart.md scenarios 1-3 to confirm MVP works
7. **DELIVER MVP**: All 12 specs audited, catalog created, quality report generated
   - Value delivered: Governance team has complete audit results and centralized catalog
   - Can identify quality gaps and create remediation plan separately

### Incremental Delivery (All 5 User Stories)

1. Complete MVP (US1-3 above)
2. Add User Story 4: Maintenance Procedures - T042-T053
3. Add User Story 5: Numbering Gaps - T054-T059
4. Complete Phase 8: Polish & Validation - T060-T072
5. **DONE**: Full refactoring complete with audit, catalog, procedures, and verification

### Parallel Team Strategy (5 Developers)

With 5 developers available:

1. All developers: Phase 1 & 2 together (Setup + Foundational)
2. Once Foundational done:
   - Developer A: US1 (Audit Structure)
   - Developer B: US2 (Catalog Creation)
   - Developer C: US3 (Quality Audit)
   - Developer D: US4 (Maintenance Procedures)
   - Developer E: US5 (Numbering Gaps)
3. All complete in parallel, integrate in Phase 8
4. Total time: ~20% of sequential time (if tasks distributed evenly)

---

## Quality Checkpoints

✅ **After Phase 2 (Foundational)**: Audit templates ready, specification list established, can begin user story work

✅ **After User Story 1 (Audit Structure)**: Directory audit complete, naming compliance verified, all 12 directories confirmed

✅ **After User Story 2 (Catalog)**: CATALOG.md created, all specifications indexed, navigation working

✅ **After User Story 3 (Quality Audit)**: All 12 specs audited for 8 dimensions, report generated, remediation plan created

✅ **After User Story 4 (Maintenance)**: Procedures documented, numbering scheme explained, quality gates defined, governance authority clear

✅ **After User Story 5 (Numbering)**: Numbering verified sequential, future strategy confirmed, historical traceability documented

✅ **After Phase 8 (Polish)**: All deliverables validated against success criteria, all 6 quickstart scenarios pass, ready for production use

---

## Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Naming convention compliance | 100% (SC-001) | T016 validates |
| Numbering sequential (zero gaps) | 0 gaps (SC-002) | T016, T056 validate |
| CATALOG.md exists with all 12 specs | 12/12 (SC-003) | T024 validates |
| Quality audit accuracy | ≥95% (SC-004) | T041 validates |
| Remediation plan completeness | ≥90% with actions (SC-005) | T040 validates |
| Maintenance procedures | Documented & non-technical (SC-006) | T052 validates |
| Specification discoverability | <30 seconds (SC-007) | T061 (Scenario 2) validates |
| Catalog update frequency | 7 days (SC-008) | Process defined in T047 |
| New specs follow procedures | 100% (SC-009) | T058 defines strategy |
| Quality improvement post-remediation | ≥20% (SC-010) | Measured after remediation implementations |

---

## Notes

- All tasks include file paths for exact location of work
- Data model constraints (from data-model.md) are embedded in task descriptions
- Contracts define acceptance criteria (CATALOG.md.contract, MAINTENANCE.md.contract)
- Quickstart.md provides 6 validation scenarios for acceptance testing
- No code/implementation needed - all work is audit, documentation, and analysis
- Tests are not required (governance/documentation project)
- Tests marked as optional in template - validation is via manual scenario testing in Phase 8

---

**Task List Generated**: 2026-09-16 | **Total Tasks**: 72 | **Phases**: 8
