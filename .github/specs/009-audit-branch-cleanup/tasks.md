# Tasks: Branch Cleanup Infrastructure (009-audit-branch-cleanup)

**Input**: Design documents from `/specs/009-audit-branch-cleanup/`  
**Status**: Report-only implementation delivered; follow-up work outstanding | **Updated**: 2026-10-02

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US6)
- Include exact file paths in descriptions

## Path Conventions

All paths are relative to the repository root. Shared code is in `scripts/lib/`,
with Jest tests in `scripts/lib/__tests__/` and `scripts/validation/__tests__/`.
The CLI creates its report directory on demand (default `.github/reports/`).

## Implementation status for #3358

Checked tasks reflect the delivered implementation; descriptions below name its
actual functions and paths where these differ from the original plan. Unchecked
tasks remain incomplete, including broader tests, performance checks and the
workflow/deletion work (T046, T047, T073). Partially covered tasks stay unchecked.
Spec 018 FR-020 defers auto-approval until branch-age and branch-origin signals
exist. T070/T071 record disabling that rule and testing the deferral; T072 retains
the report fields for compatibility, with no auto-approved candidates.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create shared library and Jest test directories in scripts/lib/, `scripts/lib/__tests__/` and `scripts/validation/__tests__/`
- [x] T002 [P] Create constants.js in scripts/lib/ with PROTECTED_BRANCHES, FORBIDDEN_PREFIXES, ALLOWED_BRANCH_TYPES, REASON_CODES
- [x] T003 [P] Add audit:branches and audit:branches:json scripts to the existing root package.json; no new runtime dependencies
- [x] T004 [P] Setup test framework (Node.js built-in `test` runner or Jest)
- [x] T005 Create the configured report directory on demand via ensureReportDir() in scripts/cleanup-branches.js (default .github/reports/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Implement age-calculator.js: getAgeInDays(isoDate), meetsAgeThreshold(ageInDays, thresholdDays), formatAge(ageInDays) in scripts/lib/age-calculator.js
- [x] T007 [P] Implement merge detection via getMergeStatus(), isMergedToDevelop() and isMergedToMain() in scripts/lib/git-merge-utils.js using Git remote refs and merged-branch queries
- [x] T008 [P] Implement getOpenPRs() with error handling and an unavailable-verification result in scripts/lib/github-pr-utils.js
- [x] T009 [P] Implement exclusion-patterns.js: buildExclusionRegex(userPatterns), matchesExclusionPattern(branch, pattern), filterByExclusionPattern() in scripts/lib/exclusion-patterns.js
- [x] T010 [P] Add inline mock Git responses and test data in `scripts/lib/__tests__/git-and-pr-utils.test.js`
- [x] T011 Implement timestamped error logging and verbose debug output in scripts/cleanup-branches.js

**Checkpoint**: All foundational utilities complete - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Automated Branch Categorisation (Priority: P1) 🎯 MVP

**Goal**: Implement 8-gate decision tree to categorise branches as KEEP, DELETE, or DISCUSS

**Independent Test**: Branch categorisation works correctly on diverse branch set (protected, excluded, merged, unmerged, invalid names, stale)

### Implementation for User Story 1

- [x] T012 [P] [US1] Implement validateBranchName(branch) function in scripts/lib/branch-categorization.js with forbidden prefix check, pattern validation, type check
- [x] T013 [US1] Implement extractMetadata(branch, metadata) helper in scripts/lib/branch-categorization.js to extract type, author, age, merge status
- [x] T014 [US1] Implement categorizeBranch(branch, metadata, openPRs, excludePattern, inactiveDays) function in scripts/lib/branch-categorization.js with 8-gate decision tree
- [x] T015 [US1] Implement categorizeBranches(branches[], branchMetadata, openPRs, excludePattern, inactiveDays) wrapper in scripts/lib/branch-categorization.js to categorise multiple branches
- [x] T016 [P] [US1] Write branch-name validation tests in `scripts/lib/__tests__/branch-categorization.test.js` and `scripts/validation/__tests__/validate-branch-name.test.js`
- [x] T017 [P] [US1] Write unit tests for 8-gate categorisation in `scripts/lib/__tests__/branch-categorization.test.js` (test each gate independently and in sequence)
- [ ] T018 [P] [US1] Write integration test for full categorisation workflow in scripts/tests/integration/test-categorisation-workflow.js

**Checkpoint**: Branch categorisation complete and tested independently

---

## Phase 4: User Story 2 - Branch Metadata Collection (Priority: P1)

**Goal**: Collect metadata for each branch (age, author, merge status, last commit date) with graceful handling of missing data

**Independent Test**: Metadata collection from git returns accurate age, author, and merge status; handles missing/invalid dates gracefully

### Implementation for User Story 2

- [x] T019 [P] [US2] Collect per-branch metadata in the main() orchestrator in scripts/cleanup-branches.js
- [x] T020 [P] [US2] Extract author and last commit date via getLastCommitAuthor() and getLastCommitDate() in scripts/cleanup-branches.js
- [x] T021 [US2] Integrate merge status into the metadata passed to categorisation in scripts/cleanup-branches.js
- [x] T022 [US2] Add graceful error handling and default values for missing/invalid dates in scripts/lib/age-calculator.js
- [ ] T023 [P] [US2] Write unit tests for git log parsing in scripts/tests/unit/test-git-metadata.js
- [ ] T024 [P] [US2] Write unit tests for date handling edge cases in scripts/tests/unit/test-age-calculator.js — Partial: CLI daysSince() edge cases are tested in `scripts/validation/__tests__/cleanup-branches.test.js`.
- [ ] T025 [US2] Write integration test for full metadata collection workflow in scripts/tests/integration/test-metadata-collection.js

**Checkpoint**: Branch metadata collection complete and tested independently

---

## Phase 5: User Story 3 - GitHub Integration (Priority: P1)

**Goal**: Detect branches with open PRs via GitHub API with error handling and performance optimisation

**Independent Test**: GitHub API integration correctly identifies open PRs; handles API errors gracefully with fallback to conservative estimate

### Implementation for User Story 3

- [x] T026 [US3] Implement GitHub API querying in scripts/lib/github-pr-utils.js: use `gh pr list` to fetch all open PRs efficiently (single query, not per-branch)
- [ ] T027 [US3] Add retry logic and exponential backoff for GitHub API errors in scripts/lib/github-pr-utils.js
- [x] T028 [US3] Reuse the fetched open-PR Set across branches in scripts/cleanup-branches.js and accept a cached Set in hasOpenPR() in scripts/lib/github-pr-utils.js
- [x] T029 [US3] Return unavailable verification and log warnings in scripts/lib/github-pr-utils.js; downgrade DELETE candidates to DISCUSS in scripts/cleanup-branches.js
- [x] T030 [P] [US3] Test PR-query failures, confirmed empty results and unavailable verification in `scripts/lib/__tests__/git-and-pr-utils.test.js`
- [ ] T031 [US3] Write integration test for GitHub API error handling and fallback in scripts/tests/integration/test-github-integration.js
- [x] T032 [US3] Add inline mock GitHub CLI responses for offline testing in `scripts/lib/__tests__/git-and-pr-utils.test.js`

**Checkpoint**: GitHub PR detection complete, API errors handled gracefully

---

## Phase 6: User Story 4 - Flexible Exclusion Patterns (Priority: P2)

**Goal**: Support user-defined regex patterns to preserve branches (`release/*`, `hotfix/*`, custom patterns)

**Independent Test**: Exclusion patterns correctly match branches; default patterns preserve `release/*` and `hotfix/*`; invalid regex handled gracefully

### Implementation for User Story 4

- [x] T033 [US4] Extend exclusion-patterns.js with support for combining default patterns with user patterns in scripts/lib/exclusion-patterns.js
- [x] T034 [US4] Implement error handling for invalid regex in buildExclusionRegex() in scripts/lib/exclusion-patterns.js (log warning, use defaults)
- [x] T035 [US4] Integrate exclusion pattern matching into branch categorisation workflow in scripts/lib/branch-categorization.js
- [x] T036 [P] [US4] Write unit tests for regex pattern matching in `scripts/lib/__tests__/branch-audit-helpers.test.js` (test valid/invalid patterns, default patterns, combinations)
- [ ] T037 [US4] Write integration test for exclusion patterns in categorisation workflow in scripts/tests/integration/test-exclusion-integration.js

**Checkpoint**: Exclusion patterns working correctly with error handling

---

## Phase 7: User Story 5 - Branch Deletion with Safety (Priority: P2)

**Goal**: Produce safe deletion candidates in dry-run mode and execute them only through a draft-PR approval gate

**Independent Test**: Dry-run mode shows candidates without executing; direct live mode is rejected; an approved and merged draft PR is required before the workflow can delete remote branches

### Implementation for User Story 5

- [ ] T038 [P] [US5] Create a deletion-candidate module in scripts/lib/branch-deletion.js that serialises verified candidates for draft-PR review
- [ ] T039 [US5] Implement remote branch deletion using `git push origin --delete` only in the post-approval workflow invoked after the draft PR is approved and merged
- [x] T040 [US5] Keep direct CLI and local branch deletion disabled; local cleanup remains an explicit maintainer action
- [x] T041 [US5] Keep dry-run mode as the CLI default and reject direct `--dryRun=false` execution
- [ ] T042 [US5] Implement per-branch error handling and success/failure reporting in the approval-gated workflow
- [ ] T043 [P] [US5] Write unit tests for candidate generation and approval-gate enforcement in scripts/tests/unit/test-branch-deletion.js
- [ ] T044 [US5] Write an integration test proving direct deletion is rejected and only the approved workflow can perform remote git operations — Partial: CLI rejection is tested in `scripts/validation/__tests__/cleanup-branches.test.js`; approval workflow coverage is deferred.
- [ ] T046 [US5] Create .github/workflows/branch-audit.yml GitHub Actions workflow with: trigger events (schedule: `0 9 * * 1` = every Monday 09:00 UTC; gate the "first business day" condition in workflow code if a stricter rule is needed, since cron cannot express it directly, manual workflow_dispatch), inputs (--dryRun default true, --inactiveDays default 30, --excludePatterns, --createIssue default false)
- [ ] T047 [US5] [P] Implement workflow job: checkout repository (actions/checkout), setup Node.js (actions/setup-node with node-version-file: '.nvmrc'), run audit command (npm run audit:branches -- $OPTS), upload report artifact (actions/upload-artifact with separate path entries for `.github/reports/branch-cleanup-*.md` and `.github/reports/branch-cleanup-*.json`)
- [x] T070 [US5] Disable the claude/* auto-approval gate and remove its constants from scripts/lib/branch-categorization.js and scripts/lib/constants.js under spec 018 FR-020; tip-commit age is not branch age, so candidates follow normal categorisation
- [x] T071 [P] [US5] Test the auto-approval deferral (old/recent merged tips, unmerged work, open PRs, exclusions and other forbidden prefixes) in `scripts/lib/__tests__/branch-categorization.test.js`
- [x] T072 [US5] Carry `autoApproved` into the JSON and Markdown reports (per-branch field and `autoApprovedDelete` summary count) in scripts/cleanup-branches.js
- [ ] T073 [US5] **Deferred under spec 018 FR-020 until branch-age and branch-origin signals exist.** Add a daily schedule (for example `0 6 * * *`) and an auto-delete step to .github/workflows/branch-audit.yml, alongside the weekly full audit from T046. The daily run only auto-deletes, and never opens a draft PR: for each auto-approved entry in the JSON report, re-check it is merged and has no open PR, then `git push origin --delete`; skip when a manual run selects report-only; exit with partial-failure status if any deletion fails
- [x] T074 [P] Replace the local branch-name rules in scripts/lib/constants.js and scripts/lib/branch-categorization.js with imports from lib/validate-branch-name.js (removes the drifted copy that lacked `doc`, `aiops`, `automation` and `epic`)
- [ ] T048 [US5] Create scripts/lib/issue-generator.js (no task previously owned this file) and add the optional workflow step: if --createIssue is enabled, parse DISCUSS candidates from JSON report and invoke it to create summarising GitHub issue with team review link

**Checkpoint**: Safe branch deletion with dry-run mode working correctly

---

## Phase 8: User Story 6 - Comprehensive Reporting (Priority: P1)

**Goal**: Generate reports in Markdown and JSON formats with categorisation summaries, metadata per branch, and saved to reports directory

**Independent Test**: Reports generated in both Markdown and JSON formats; counts accurate; metadata included; saved to reports directory with timestamp naming

### Implementation for User Story 6

- [x] T045 [P] [US6] Implement Markdown report generation with writeMarkdownReport() in scripts/cleanup-branches.js and formatting helpers in scripts/lib/report-formatter.js
- [x] T075 [P] [US6] Implement formatAuditReportJSON() in scripts/lib/report-formatter.js and writeJsonReport() in scripts/cleanup-branches.js
- [x] T076 [US6] Write reports with writeMarkdownReport(), writeJsonReport() and ensureReportDir() in scripts/cleanup-branches.js
- [x] T077 [US6] Implement Markdown header, summary table, candidate details and KEEP/DISCUSS sections in scripts/cleanup-branches.js
- [x] T049 [US6] Implement JSON summary, metrics and branch records with writeJsonReport() in scripts/cleanup-branches.js
- [x] T050 [US6] Generate timestamped report filenames in scripts/cleanup-branches.js
- [x] T051 [P] [US6] Test Markdown summary fields and report sections in `scripts/validation/__tests__/cleanup-branches.test.js`
- [x] T052 [P] [US6] Test JSON summary, metrics and branch records in `scripts/validation/__tests__/cleanup-branches.test.js`
- [ ] T053 [US6] Write integration test for full report generation workflow in scripts/tests/integration/test-report-generation.js

**Checkpoint**: Report generation complete with both formats

---

## Phase 9: CLI Integration & Orchestration

**Goal**: Implement cleanup-branches.js CLI entry point that orchestrates all modules

**Independent Test**: CLI accepts all options, calls appropriate modules, produces correct output, respects dry-run mode, handles errors gracefully

- [x] T054 Implement CLI argument parsing in scripts/cleanup-branches.js (dryRun, deleteLocal, verbose, inactiveDays, excludePatterns, preserveAuthors, reportFormat, reportDir)
- [x] T055 Implement report-only orchestration in scripts/cleanup-branches.js: fetch branches → collect metadata → detect PRs → categorise → generate report
- [x] T056 Implement logging and progress output in scripts/cleanup-branches.js with timestamp, log levels, emoji indicators
- [ ] T057 Add error handling and exit codes in scripts/cleanup-branches.js (0: success, 1: fatal, 2: partial, 127: missing dependency) — Partial: statuses 0, 1 and 2 are implemented and tested; the dedicated missing-dependency status remains outstanding.
- [x] T058 [P] Implement option validation and defaults in scripts/cleanup-branches.js
- [ ] T059 Write integration test for full CLI workflow in scripts/tests/integration/test-cli-workflow.js

**Checkpoint**: CLI fully functional with all options

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and optimisation

- [ ] T060 [P] Run quickstart.md validation tests: Test 1 (dry-run), Test 2 (invalid names), Test 3 (protected branches), Test 4 (exclusion patterns)
- [ ] T061 [P] Run quickstart.md validation tests: Test 5 (age-based), Test 6 (report formats), Test 7 (custom options), Test 8 (error handling)
- [ ] T062 [P] Run quickstart.md validation tests: Test 9 (GitHub integration), Test 10 (library API)
- [x] T063 [P] Code cleanup: Remove debug code, ensure consistent formatting, run linter if configured
- [ ] T064 [P] Performance testing: Verify cleanup-branches.js processes 100+ branches in <10 seconds in scripts/tests/performance/
- [ ] T065 [P] Memory footprint testing: Verify <50 MB memory usage in scripts/tests/performance/
- [x] T066 Documentation: Add detailed comments to all library modules in scripts/lib/
- [ ] T067 Documentation: Create USAGE.md guide with examples for different scenarios in scripts/
- [ ] T068 Final validation: Run all tests (unit, integration, performance) in scripts/tests/
- [ ] T069 README: Update main .github/README.md to reference branch cleanup feature

**Checkpoint**: Feature complete, tested, documented, validated

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies - can start immediately
2. **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
3. **User Stories (Phases 3–8)**: All depend on Foundational phase completion
   - US1, US2, US3 (P1) can proceed in parallel after Foundational (US6 starts after US1, since reporting requires categorised data — see User Story Dependencies)
   - US4, US5 (P2) follow after P1 stories or in parallel if staffed
4. **CLI Integration (Phase 9)**: Depends on all user stories (3–8) complete
5. **Polish (Phase 10)**: Depends on CLI integration complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational → independently testable
- **US2 (P1)**: Can start after Foundational → independently testable
- **US3 (P1)**: Can start after Foundational → independently testable
- **US4 (P2)**: Depends on US1 (categorisation must exist to apply exclusions)
- **US5 (P2)**: Depends on US1 (must categorise before deleting)
- **US6 (P1)**: Can start after US1 (must categorise to report)

### Within Each User Story

- Tests MUST be written first (T-numbers in each story start with tests)
- Tests MUST be written before implementation
- Models/utilities before higher-level functions
- Core implementation before integration
- Story complete before moving to next

### Parallel Opportunities

**Phase 1 (Setup)**:

- T002, T003, T004, T005 can run in parallel

**Phase 2 (Foundational)**:

- T006, T007, T008, T009, T010, T011 can run in parallel

**Phase 3–8 (User Stories)**:

- Once Foundational completes, P1 stories US1, US2 and US3 can start in parallel; US6 starts after US1, since reporting needs categorised data
- P2 stories (US4, US5) start after P1 stories or in parallel
- Within each user story, tests marked [P] can run in parallel
- Models/utilities marked [P] can run in parallel

**Phase 9 (CLI)**:

- Depends on all user stories, must be sequential

**Phase 10 (Polish)**:

- All [P] tasks can run in parallel
- Final validation (T068) must be last

### Parallel Example: Phase 2 (Foundational)

```
Launch all foundational tasks together:
T006: Age calculator
T007: Git merge utils
T008: GitHub PR utils
T009: Exclusion patterns
T010: Test fixtures
T011: Error logging
(All can complete independently, all must complete before user stories start)
```

### Parallel Example: Phase 3 (User Story 1)

```
Launch tests first (must fail before implementation):
T016: Unit tests for branch validation
T017: Unit tests for 8-gate categorisation
T018: Integration test for categorisation workflow

Then implement core logic:
T012: validateBranchName()
T013: extractMetadata()
T014: categorizeBranch()
T015: categorizeBranches()

(Tests marked [P] can run in parallel)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

Recommended for rapid validation:

1. Complete Phase 1: Setup (T001–T005)
2. Complete Phase 2: Foundational (T006–T011)
3. Complete Phase 3: User Story 1 (T012–T018)
4. **STOP and VALIDATE**: Run quickstart tests manually
5. Deploy/demo if ready

**Result**: Can categorise branches correctly, foundation solid for remaining stories

### Incremental Delivery (All Stories)

Recommended for complete feature:

1. Phase 1 + Phase 2 → Foundation ready
2. Add US1 (P1) → Test independently → Deploy/Demo (MVP!)
3. Add US2 (P1) → Test independently → Enhance MVP
4. Add US3 (P1) → Test independently → Add GitHub integration
5. Add US6 (P1) → Test independently → Add reporting
6. Add US4 (P2) → Test independently → Add exclusion patterns
7. Add US5 (P2) → Test independently → Add safe deletion
8. Phase 9 (CLI) → Orchestrate all
9. Phase 10 (Polish) → Final validation and documentation

**Each increment**: Independently testable, deployable, adds clear value

### Parallel Team Strategy (2–3 developers)

1. Developer A + B: Together complete Phase 1 + Phase 2 (Setup + Foundational)
2. Once Foundational ready:
   - Developer A: US1 (categorisation) + US6 (reporting)
   - Developer B: US2 (metadata) + US3 (GitHub integration)
   - Developer C: US4 (exclusion) + US5 (deletion) [if available]
3. After all stories:
   - Developer A: CLI integration (Phase 9)
   - Developer B: Polish & validation (Phase 10)

---

## Task Checklist Notes

- **[P] tasks**: Different files, no cross-task dependencies → parallelisable
- **[US#] label**: Maps task to specific user story for traceability
- **Commit frequency**: After each task or logical group
- **Test-first approach**: Tests written BEFORE implementation for each story
- **Independent validation**: Run quickstart.md tests at each checkpoint
- **Stop points**: Complete each Phase and User Story independently before proceeding

---

## Total Task Count: 77 Tasks

| Phase                   | Tasks                                | Parallel Opportunities      |
| ----------------------- | ------------------------------------ | --------------------------- |
| Setup                   | T001–T005 (5)                        | 4 of 5 can parallel         |
| Foundational            | T006–T011 (6)                        | 5 of 6 can parallel         |
| US1 Categorisation (P1) | T012–T018 (7)                        | 5 of 7 can parallel (tests) |
| US2 Metadata (P1)       | T019–T025 (7)                        | 4 of 7 can parallel         |
| US3 GitHub (P1)         | T026–T032 (7)                        | 3 of 7 can parallel         |
| US4 Exclusion (P2)      | T033–T037 (5)                        | 2 of 5 can parallel         |
| US5 Deletion (P2)       | T038–T044, T046–T048, T070–T074 (15) | 5 of 15 can parallel        |
| US6 Reporting (P1)      | T045, T049–T053, T075–T077 (9)       | 5 of 9 can parallel         |
| CLI Integration         | T054–T059 (6)                        | 2 of 6 can parallel         |
| Polish                  | T060–T069 (10)                       | 9 of 10 can parallel        |
| **TOTAL**               | **77**                               | **~44 parallelisable**      |

---

**Tasks Generation Status**: ✅ **COMPLETE** | Implementation status reconciled for #3358

Continue with the unchecked follow-up tasks; workflow execution and auto-approval remain deferred.
