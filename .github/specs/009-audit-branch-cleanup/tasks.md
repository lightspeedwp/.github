# Tasks: Branch Cleanup Infrastructure (009-audit-branch-cleanup)

**Input**: Design documents from `/specs/009-audit-branch-cleanup/`  
**Status**: Generated | **Date**: 2026-09-16

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US6)
- Include exact file paths in descriptions

## Path Conventions

All paths are repository-relative from `.github/`:

```text
.github/
├── scripts/
│   ├── cleanup-branches.js           # CLI entry point
│   ├── lib/
│   │   ├── constants.js              # Shared constants
│   │   ├── age-calculator.js         # Age calculation utilities
│   │   ├── git-merge-utils.js        # Git merge detection
│   │   ├── github-pr-utils.js        # GitHub PR detection
│   │   ├── exclusion-patterns.js     # Regex exclusion patterns
│   │   ├── branch-categorization.js  # 8-gate decision tree
│   │   └── report-formatter.js       # Report generation
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── fixtures/
├── reports/
│   └── branch-cleanup/               # Generated cleanup reports
```

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create script directory structure with `lib/` and `tests/` subdirectories
- [ ] T002 [P] Create constants.js in scripts/lib/ with PROTECTED_BRANCHES, FORBIDDEN_PREFIXES, ALLOWED_BRANCH_TYPES, REASON_CODES
- [ ] T003 [P] Create package.json with Node.js 22+ metadata, test scripts, no external dependencies
- [ ] T004 [P] Setup test framework (Node.js built-in `test` runner or Jest)
- [ ] T005 Create `.github/reports/branch-cleanup/` directory for report output

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 [P] Implement age-calculator.js: getAgeInDays(isoDate), meetsAgeThreshold(ageInDays, thresholdDays), formatAge(ageInDays) in scripts/lib/age-calculator.js
- [ ] T007 [P] Implement git-merge-utils.js: detectMergeStatus(branch, bases) using `git merge-base --is-ancestor` in scripts/lib/git-merge-utils.js
- [ ] T008 [P] Implement github-pr-utils.js: detectOpenPRs(owner, repo, branch?) with error handling and graceful fallback in scripts/lib/github-pr-utils.js
- [ ] T009 [P] Implement exclusion-patterns.js: buildExclusionRegex(userPatterns), matchesExclusionPattern(branch, pattern), filterByExclusionPattern() in scripts/lib/exclusion-patterns.js
- [ ] T010 [P] Setup test fixtures directory with mock git responses and test data in scripts/tests/fixtures/
- [ ] T011 Implement basic error logging and verbose debug output helper in scripts/lib/constants.js

**Checkpoint**: All foundational utilities complete - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Automated Branch Categorisation (Priority: P1) 🎯 MVP

**Goal**: Implement 8-gate decision tree to categorise branches as KEEP, DELETE, or DISCUSS

**Independent Test**: Branch categorisation works correctly on diverse branch set (protected, excluded, merged, unmerged, invalid names, stale)

### Implementation for User Story 1

- [ ] T012 [P] [US1] Implement validateBranchName(branch) function in scripts/lib/branch-categorization.js with forbidden prefix check, pattern validation, type check
- [ ] T013 [US1] Implement extractMetadata(branch, metadata) helper in scripts/lib/branch-categorization.js to extract type, author, age, merge status
- [ ] T014 [US1] Implement categorizeBranch(branch, metadata, openPRs, excludePattern, inactiveDays) function in scripts/lib/branch-categorization.js with 8-gate decision tree
- [ ] T015 [US1] Implement categorizeBranches(branches[], branchMetadata, openPRs, excludePattern, inactiveDays) wrapper in scripts/lib/branch-categorization.js to categorise multiple branches
- [ ] T016 [P] [US1] Write unit tests for branch name validation in scripts/tests/unit/test-branch-validation.js (test valid/invalid names, forbidden prefixes, format rules)
- [ ] T017 [P] [US1] Write unit tests for 8-gate categorisation in scripts/tests/unit/test-branch-categorization.js (test each gate independently and in sequence)
- [ ] T018 [P] [US1] Write integration test for full categorisation workflow in scripts/tests/integration/test-categorisation-workflow.js

**Checkpoint**: Branch categorisation complete and tested independently

---

## Phase 4: User Story 2 - Branch Metadata Collection (Priority: P1)

**Goal**: Collect metadata for each branch (age, author, merge status, last commit date) with graceful handling of missing data

**Independent Test**: Metadata collection from git returns accurate age, author, and merge status; handles missing/invalid dates gracefully

### Implementation for User Story 2

- [ ] T019 [P] [US2] Create branch metadata collection orchestrator in scripts/lib/branch-metadata.js: collectBranchMetadata(branches, options) function
- [ ] T020 [P] [US2] Implement git log parsing to extract author and last commit date in scripts/lib/git-merge-utils.js (extend existing module)
- [ ] T021 [US2] Integrate merge status detection into metadata collection workflow in scripts/lib/branch-metadata.js
- [ ] T022 [US2] Add graceful error handling and default values for missing/invalid dates in scripts/lib/age-calculator.js
- [ ] T023 [P] [US2] Write unit tests for git log parsing in scripts/tests/unit/test-git-metadata.js
- [ ] T024 [P] [US2] Write unit tests for date handling edge cases in scripts/tests/unit/test-age-calculator.js
- [ ] T025 [US2] Write integration test for full metadata collection workflow in scripts/tests/integration/test-metadata-collection.js

**Checkpoint**: Branch metadata collection complete and tested independently

---

## Phase 5: User Story 3 - GitHub Integration (Priority: P1)

**Goal**: Detect branches with open PRs via GitHub API with error handling and performance optimisation

**Independent Test**: GitHub API integration correctly identifies open PRs; handles API errors gracefully with fallback to conservative estimate

### Implementation for User Story 3

- [ ] T026 [US3] Implement GitHub API querying in scripts/lib/github-pr-utils.js: use `gh pr list` to fetch all open PRs efficiently (single query, not per-branch)
- [ ] T027 [US3] Add retry logic and exponential backoff for GitHub API errors in scripts/lib/github-pr-utils.js
- [ ] T028 [US3] Implement caching mechanism to avoid repeated API calls in scripts/lib/github-pr-utils.js
- [ ] T029 [US3] Add graceful fallback: if API unavailable, assume no open PRs (conservative) and log warning in scripts/lib/github-pr-utils.js
- [ ] T030 [P] [US3] Write unit tests for PR detection in scripts/tests/unit/test-github-pr-utils.js (test PR matching, filtering, edge cases)
- [ ] T031 [US3] Write integration test for GitHub API error handling and fallback in scripts/tests/integration/test-github-integration.js
- [ ] T032 [US3] Add mock GitHub API responses for offline testing in scripts/tests/fixtures/

**Checkpoint**: GitHub PR detection complete, API errors handled gracefully

---

## Phase 6: User Story 4 - Flexible Exclusion Patterns (Priority: P2)

**Goal**: Support user-defined regex patterns to preserve branches (release/*, hotfix/*, custom patterns)

**Independent Test**: Exclusion patterns correctly match branches; default patterns preserve release/*and hotfix/*; invalid regex handled gracefully

### Implementation for User Story 4

- [ ] T033 [US4] Extend exclusion-patterns.js with support for combining default patterns with user patterns in scripts/lib/exclusion-patterns.js
- [ ] T034 [US4] Implement error handling for invalid regex in buildExclusionRegex() in scripts/lib/exclusion-patterns.js (log warning, use defaults)
- [ ] T035 [US4] Integrate exclusion pattern matching into branch categorisation workflow in scripts/lib/branch-categorization.js
- [ ] T036 [P] [US4] Write unit tests for regex pattern matching in scripts/tests/unit/test-exclusion-patterns.js (test valid/invalid patterns, default patterns, combinations)
- [ ] T037 [US4] Write integration test for exclusion patterns in categorisation workflow in scripts/tests/integration/test-exclusion-integration.js

**Checkpoint**: Exclusion patterns working correctly with error handling

---

## Phase 7: User Story 5 - Branch Deletion with Safety (Priority: P2)

**Goal**: Implement safe branch deletion with dry-run mode (default), optional local deletion, and error handling

**Independent Test**: Dry-run mode shows deletions without executing; execution mode deletes remote branches correctly; local deletion optional; errors reported per branch

### Implementation for User Story 5

- [ ] T038 [P] [US5] Create branch deletion module in scripts/lib/branch-deletion.js: deleteBranches(branches[], options) function
- [ ] T039 [US5] Implement remote branch deletion using `git push origin --delete` in scripts/lib/branch-deletion.js
- [ ] T040 [US5] Implement optional local branch deletion using `git branch -d` in scripts/lib/branch-deletion.js
- [ ] T041 [US5] Add dry-run mode (default: true) that logs deletions without executing in scripts/lib/branch-deletion.js
- [ ] T042 [US5] Implement per-branch error handling and success/failure reporting in scripts/lib/branch-deletion.js
- [ ] T043 [P] [US5] Write unit tests for deletion logic in scripts/tests/unit/test-branch-deletion.js (test dry-run, local, remote, error cases)
- [ ] T044 [US5] Write integration test for full deletion workflow with git operations in scripts/tests/integration/test-deletion-workflow.js

**Checkpoint**: Safe branch deletion with dry-run mode working correctly

---

## Phase 8: User Story 6 - Comprehensive Reporting (Priority: P1)

**Goal**: Generate reports in Markdown and JSON formats with categorisation summaries, metadata per branch, and saved to reports directory

**Independent Test**: Reports generated in both Markdown and JSON formats; counts accurate; metadata included; saved to reports directory with timestamp naming

### Implementation for User Story 6

- [ ] T045 [P] [US6] Implement report-formatter.js: formatMarkdownReport(categorised, options) function in scripts/lib/report-formatter.js
- [ ] T046 [P] [US6] Implement report-formatter.js: formatJSONReport(categorised, options) function in scripts/lib/report-formatter.js
- [ ] T047 [US6] Implement report file writing: saveReport(report, reportDir, format, timestamp) in scripts/lib/report-formatter.js
- [ ] T048 [US6] Implement Markdown report structure: header, summary table, KEEP/DELETE/DISCUSS sections, branch details in scripts/lib/report-formatter.js
- [ ] T049 [US6] Implement JSON report structure: stats object, branches array with required fields (name, category, reason, metadata) in scripts/lib/report-formatter.js
- [ ] T050 [US6] Add timestamp generation (ISO8601 format) for report filenames in scripts/lib/report-formatter.js
- [ ] T051 [P] [US6] Write unit tests for Markdown report formatting in scripts/tests/unit/test-markdown-reporter.js
- [ ] T052 [P] [US6] Write unit tests for JSON report formatting in scripts/tests/unit/test-json-reporter.js
- [ ] T053 [US6] Write integration test for full report generation workflow in scripts/tests/integration/test-report-generation.js

**Checkpoint**: Report generation complete with both formats

---

## Phase 9: CLI Integration & Orchestration

**Goal**: Implement cleanup-branches.js CLI entry point that orchestrates all modules

**Independent Test**: CLI accepts all options, calls appropriate modules, produces correct output, respects dry-run mode, handles errors gracefully

- [ ] T054 Implement CLI argument parsing in scripts/cleanup-branches.js (dryRun, deleteLocal, verbose, inactiveDays, excludePatterns, preserveAuthors, reportFormat, reportDir)
- [ ] T055 Implement main orchestration logic in scripts/cleanup-branches.js: fetch branches → collect metadata → detect PRs → categorise → (optionally delete) → generate report
- [ ] T056 Implement logging and progress output in scripts/cleanup-branches.js with timestamp, log levels, emoji indicators
- [ ] T057 Add error handling and exit codes in scripts/cleanup-branches.js (0: success, 1: fatal, 2: partial, 127: missing dependency)
- [ ] T058 [P] Implement option validation and defaults in scripts/cleanup-branches.js
- [ ] T059 Write integration test for full CLI workflow in scripts/tests/integration/test-cli-workflow.js

**Checkpoint**: CLI fully functional with all options

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and optimisation

- [ ] T060 [P] Run quickstart.md validation tests: Test 1 (dry-run), Test 2 (invalid names), Test 3 (protected branches), Test 4 (exclusion patterns)
- [ ] T061 [P] Run quickstart.md validation tests: Test 5 (age-based), Test 6 (report formats), Test 7 (custom options), Test 8 (error handling)
- [ ] T062 [P] Run quickstart.md validation tests: Test 9 (GitHub integration), Test 10 (library API)
- [ ] T063 [P] Code cleanup: Remove debug code, ensure consistent formatting, run linter if configured
- [ ] T064 [P] Performance testing: Verify cleanup-branches.js processes 100+ branches in <10 seconds in scripts/tests/performance/
- [ ] T065 [P] Memory footprint testing: Verify <50 MB memory usage in scripts/tests/performance/
- [ ] T066 Documentation: Add detailed comments to all library modules in scripts/lib/
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
   - US1, US2, US3, US6 (P1) can proceed in parallel after Foundational
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

- Once Foundational completes, all P1 stories (US1, US2, US3, US6) can start in parallel
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

## Total Task Count: 69 Tasks

| Phase | Tasks | Parallel Opportunities |
|-------|-------|------------------------|
| Setup | T001–T005 (5) | 4 of 5 can parallel |
| Foundational | T006–T011 (6) | 5 of 6 can parallel |
| US1 Categorisation (P1) | T012–T018 (7) | 5 of 7 can parallel (tests) |
| US2 Metadata (P1) | T019–T025 (7) | 4 of 7 can parallel |
| US3 GitHub (P1) | T026–T032 (7) | 3 of 7 can parallel |
| US4 Exclusion (P2) | T033–T037 (5) | 2 of 5 can parallel |
| US5 Deletion (P2) | T038–T044 (7) | 3 of 7 can parallel |
| US6 Reporting (P1) | T045–T053 (9) | 5 of 9 can parallel |
| CLI Integration | T054–T059 (6) | 2 of 6 can parallel |
| Polish | T060–T069 (10) | 9 of 10 can parallel |
| **TOTAL** | **69** | **~38 parallelisable** |

---

**Tasks Generation Status**: ✅ **COMPLETE** | Ready for implementation phase

Run `/speckit-implement` to begin Phase 1 (Setup) through Phase 10 (Polish).
