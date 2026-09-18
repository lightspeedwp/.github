---
description: "Implementation task list for branch cleanup audit and refactoring"
---

# Tasks: Branch Cleanup Audit & Refactoring Infrastructure

**Input**: Specification and design from `.github/specs/009-audit-branch-cleanup/`

**Prerequisites**:

- spec.md (✅ Complete)
- plan.md (✅ Complete)
- research.md (✅ Complete)
- data-model.md (✅ Complete)
- contracts/ (✅ Complete)
- quickstart.md (✅ Complete)

**Total Task Count**: 56 implementation tasks across 8 phases

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Unit tests are included (T041) and required to pass in Phase 8 validation (T050); additional exploratory testing beyond the listed test tasks is optional per specification.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Exact file paths included in all descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic script framework

**Goal**: Establish the foundation for all audit and cleanup functionality

- [ ] T001 Create base module for cleanup-branches.js with command-line argument parsing in scripts/cleanup-branches.js (support --dryRun, --reportFormat, --inactiveDays, --excludePatterns options)
- [ ] T002 [P] Import validate-branch-name.js module into scripts/cleanup-branches.js for centralised branch name validation
- [ ] T003 [P] Create scripts/lib/branch-utils.js with shared utilities: branch type extraction, age calculation, merge status helper functions
- [ ] T004 [P] Create scripts/lib/report-formatter.js with functions to format audit results as Markdown and JSON output
- [ ] T005 Create .github/reports/ directory structure for generated audit report storage
- [ ] T006 Add npm script in package.json: "audit:branches" → "node scripts/cleanup-branches.js --dryRun=true --reportFormat=markdown"
- [ ] T007 Add npm script in package.json: "audit:branches:json" → "node scripts/cleanup-branches.js --dryRun=true --reportFormat=json"

**Checkpoint**: Framework is in place - user story implementation can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure MUST be complete before any audit work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 [P] Create scripts/lib/git-merge-utils.js implementing merge detection via git merge-base: isMergedToDevelop(branch), isMergedToMain(branch), getMergeStatus(branch) functions
- [ ] T009 [P] Create scripts/lib/github-pr-utils.js implementing PR detection via GitHub CLI: getOpenPRs(repo), findOpenPRForBranch(branch) functions with error handling for gh CLI availability
- [ ] T010 [P] Create scripts/lib/branch-categorization.js implementing the 8-gate decision tree from data-model.md with categorizeBranch(branch, metadata) function returning {category: 'KEEP'|'DELETE'|'DISCUSS', reason: string}
- [ ] T011 [P] Create scripts/lib/age-calculator.js implementing age calculation with getAgeInDays(lastCommitDate) function using ISO8601 timestamps
- [ ] T012 [P] Create scripts/lib/exclusion-patterns.js implementing regex-based branch exclusion: matchesExclusionPattern(branch, patterns) with support for comma-separated patterns on CLI
- [ ] T013 Create scripts/lib/constants.js with protected branch patterns, forbidden prefixes (claude, copilot, openai), and default inactivity threshold (30 days)
- [ ] T014 Add error handling and logging to scripts/cleanup-branches.js with graceful failures for missing gh CLI or git errors

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Audit Current Branch State (Priority: P1) 🎯 MVP

**Goal**: Generate comprehensive audit report categorising all branches as KEEP/DELETE/DISCUSS

**Independent Test**: Run audit script against repository and verify report categorises all branches correctly by type, merge status, age, and PR association. Report must include all metadata fields from data-model.md Branch entity.

### Implementation for User Story 1

- [ ] T015 [US1] Create scripts/lib/branch-collector.js implementing getAllBranches(repo) using git branch -r to collect all remote branches with metadata
- [ ] T016 [US1] [P] Enhance scripts/lib/branch-collector.js to enrich each branch with: type (from validate-branch-name), author (from git log), last commit date (from git log), merge status (using git-merge-utils from T008)
- [ ] T017 [US1] Create scripts/lib/audit-generator.js implementing generateAuditReport(branches, options) that categorises all branches using branch-categorization.js (T010) and produces structured report object with summary counts (keep_count, delete_count, discuss_count) and categories object per audit-report.schema.json
- [ ] T018 [US1] Implement Markdown report formatting in scripts/lib/report-formatter.js: formatAuditReportMarkdown(auditReport) producing human-readable Markdown with Summary table, KEEP section (subsections: protected, active_pr, recent, excluded), DELETE section (merged & stale candidates), DISCUSS section (with reasons and recommendations)
- [ ] T019 [US1] Implement JSON report formatting in scripts/lib/report-formatter.js: formatAuditReportJSON(auditReport) producing machine-readable JSON matching audit-report.schema.json with all required fields: timestamp, repository, branch_count, summary, categories, execution metadata
- [ ] T020 [US1] Update scripts/cleanup-branches.js main function to: fetch all branches → enrich with metadata → generate audit report → format as Markdown or JSON → write to .github/reports/stale-branches-{timestamp}.md/.json (T005) → display summary to console
- [ ] T021 [US1] Add --reportFormat option to scripts/cleanup-branches.js supporting "markdown" (default), "json", and "both" values (generates both files when "both" selected)
- [ ] T022 [US1] Add --dryRun option to scripts/cleanup-branches.js (default true) that prevents any branch deletions, ensuring safe preview mode
- [ ] T023 [US1] Validate audit report generation completes in <5 seconds for test repository with 50+ branches (SC-004 performance target)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Running audit script produces categorised report with all branches.

---

## Phase 4: User Story 2 - Generate Safe Deletion Candidates List (Priority: P2)

**Goal**: Produce verified list of branches that meet ALL deletion safety criteria

**Independent Test**: Generate deletion candidates list, verify each branch in the list is: (1) fully merged to develop or main, (2) no open PR, (3) older than 30 days threshold, (4) not in protected set, (5) valid name, (6) not in exclusion patterns.

### Implementation for User Story 2

- [ ] T024 [US2] Create scripts/lib/deletion-verifier.js implementing verifyDeletionCandidates(branches, options) function that applies all 7 safety checks from deletion-candidates.schema.json verification_checks section: branch_exists, is_merged, no_open_pr, not_protected, valid_name, meets_age_threshold, not_excluded
- [ ] T025 [US2] [P] Implement safety check functions in scripts/lib/deletion-verifier.js: checkBranchExists(branch), checkIsMerged(branch), checkNoOpenPR(branch, prList), checkNotProtected(branch), checkValidName(branch), checkMeetsAgeThreshold(age, threshold), checkNotExcluded(branch, patterns) each returning {passed: boolean, reason?: string}
- [ ] T026 [US2] Create scripts/lib/deletion-candidates.js implementing filterDeletionCandidates(auditReport, options) that: (1) starts with DELETE category branches, (2) applies 7 safety verifications, (3) builds deletion candidates list with verification_checks details, (4) calculates verification_passed (true only if all checks pass)
- [ ] T027 [US2] Implement JSON formatting in scripts/lib/report-formatter.js: formatDeletionCandidatesJSON(candidates, summary) producing machine-readable JSON matching deletion-candidates.schema.json with all required fields: timestamp, repository, candidates array with verification details, summary (total_candidates, verified_safe, verification_failed, estimated_storage_freed_mb), execution metadata
- [ ] T028 [US2] Add generateDeletionCandidatesList(options) command to scripts/cleanup-branches.js that generates deletion candidates independently of audit (users can focus on safe-to-delete list)
- [ ] T029 [US2] Add --verificationReportPath option to output detailed verification results showing which safety checks passed/failed for each candidate
- [ ] T030 [US2] Create scripts/lib/branch-deleter.js implementing safeBranchDeletion(candidates, dryRun) function that: (1) if dryRun=true: preview deletions with detailed list, (2) if dryRun=false: execute deleteRemoteBranch(candidate) (`git push origin --delete {branch}`) for each candidate as the primary deletion target, with `git branch -d` for the local ref treated as optional cleanup only, with error handling for "already deleted" scenario (T99 edge case), (3) return deletion_report with success/failure count

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Audit script identifies candidates, deletion command produces verified safe list.

---

## Phase 5: User Story 3 - Identify Branches Requiring Discussion (Priority: P2)

**Goal**: Flag edge cases and ambiguous branches requiring human decision-making

**Independent Test**: Generate DISCUSS candidates list with proper categorisation by reason (naming_violation, unmerged_stale, orphaned, excluded_policy, unclear_status). Verify each branch has context and recommendation for team review.

### Implementation for User Story 3

- [ ] T031 [US3] Enhance scripts/lib/branch-categorization.js to populate reason field with detailed context: "naming_violation: Branch prefix {prefix} is forbidden. Recommendation: Rename to valid type or delete", "unmerged_stale: Unmerged for {age} days. Recommendation: Verify intent or delete", etc. per data-model.md reason codes
- [ ] T032 [US3] [P] Create scripts/lib/discuss-analyzer.js implementing analyzeDISCUSSBranches(discussBranches) that enriches each branch with: (1) detailed reason explanation, (2) context (e.g., age, last commit, author), (3) specific recommendation for action, (4) reference to relevant policy (CLAUDE.md branch naming, exclusion patterns, etc.)
- [ ] T033 [US3] Add scripts/lib/discuss-recommendations.js implementing getRecommendation(branch, reason) with specific guidance for each reason code: naming_violation ("Rename branch to {suggested-type}/{scope} or delete"), unmerged_stale ("Verify if work should be merged or abandoned"), orphaned ("Confirm purpose or delete"), excluded_policy ("Policy decision: Should bot branches be auto-deleted or preserved?"), unclear_status ("Verify merge and PR status manually")
- [ ] T034 [US3] Implement Markdown formatting for DISCUSS candidates in scripts/lib/report-formatter.js: formatDISCUSSSection(discussBranches) creating detailed table with: Branch | Type | Reason | Age | Recommendation columns
- [ ] T035 [US3] Add generateDISCUSSList(options) command to scripts/cleanup-branches.js that produces DISCUSS candidates report independently (users can focus on edge cases requiring discussion)
- [ ] T036 [US3] Create optional GitHub issue generation in scripts/lib/issue-generator.js implementing createDISCUSSIssue(discussBranches, repo) that generates formatted issue template summarizing DISCUSS branches with links for team review (invoke if --createIssue flag provided)

**Checkpoint**: All user stories 1-3 should now work independently. Audit categorises, deletion identifies safe branches, discussion flags edge cases.

---

## Phase 6: User Story 4 - Refactor Cleanup Scripts and Documentation (Priority: P3)

**Goal**: Harmonise cleanup infrastructure for consistency, maintainability, and alignment with current standards

**Independent Test**: Validate that all cleanup-related assets (scripts, documentation, prompts, agents) are current, cross-referenced correctly, include working examples, and follow project standards (UK English, branch naming validation, etc.).

### Implementation for User Story 4

- [ ] T037 [US4] Review and refactor docs/BRANCH_CLEANUP.md: update command examples for new audit CLI options, include new --reportFormat and --excludePatterns examples, update decision matrix to reflect KEEP/DELETE/DISCUSS categories, add troubleshooting section for common scenarios (FR-014)
- [ ] T038 [US4] [P] Update docs/BRANCHING_STRATEGY.md with cross-references to cleanup process in BRANCH_CLEANUP.md section, clarify when branches should be cleaned up, reference CLAUDE.md branch naming standards (FR-015)
- [ ] T039 [US4] [P] Update docs/PR_CREATION_PROCESS.md with link to cleanup guidance (PR #3128 cleanup) and note about branch naming validation
- [ ] T040 [US4] [P] Refactor scripts/validation/validate-branch-name.js to ensure: (1) validates all 30+ branch types from CLAUDE.md exactly as defined (feat, fix, hotfix, release, refactor, chore, task, docs, test, perf, ci, build, deps, security, design, a11y, ux, i18n, ops, proto, ds, api, schema, telemetry, content, seo, config, migrate, qa, uat, audit, codex, revert, research), (2) rejects all 3 forbidden prefixes (claude, copilot, openai), (3) validates pattern {type}/{scope}-{title} (FR-008, FR-015)
- [ ] T041 [US4] Create scripts/validation/validate-branch-name.test.js with comprehensive tests: 30+ valid branch type examples, 3 forbidden prefix rejections, pattern validation for valid and invalid formats (FR-015)
- [ ] T042 [US4] Refactor prompts/07-branch-worktree-cleanup.md to align with new audit/cleanup workflow, update cleanup examples, reference new audit reports and DISCUSS categories
- [ ] T043 [US4] [P] Update agents/chat-closure-agent/ references to branch cleanup (search for "branch" or "cleanup" in AGENT.md/README.md, update any cleanup workflow references to use new audit structure)
- [ ] T044 [US4] Add comprehensive code comments to scripts/cleanup-branches.js explaining: 8-gate categorisation logic, safety verification steps, dry-run vs. live deletion modes, performance optimisations (merge-base caching, batched gh CLI queries)
- [ ] T045 [US4] Ensure all documentation uses UK English spelling and conventions (color → colour, optimize → optimise, organization → organisation, behavior → behaviour, etc.) (FR-014 requirement)

**Checkpoint**: All cleanup infrastructure is harmonised, current, and well-documented for team adoption.

---

## Phase 7: User Story 5 - Implement Automated Branch Audit Workflow (Priority: P3)

**Goal**: Deploy GitHub Actions workflow for periodic branch audits without manual intervention

**Independent Test**: Execute workflow via manual trigger or scheduled event, verify it generates audit report artifact, optionally creates GitHub issue for DISCUSS branches, and completes successfully.

### Implementation for User Story 5

- [ ] T046 [US5] Create .github/workflows/branch-audit.yml GitHub Actions workflow with: trigger events (schedule: "0 9 * * 1" = every Monday 09:00 UTC; gate the "first business day" condition in workflow code if a stricter rule is needed, since cron cannot express it directly, manual workflow_dispatch), inputs (--dryRun default true, --inactiveDays default 30, --excludePatterns, --createIssue default false)
- [ ] T047 [US5] [P] Implement workflow job: checkout repository (actions/checkout), setup Node.js (actions/setup-node with node-version-file: '.nvmrc'), run audit command (npm run audit:branches -- $OPTS), upload report artifact (actions/upload-artifact with separate path entries for `.github/reports/stale-branches-*.md` and `.github/reports/stale-branches-*.json` — not the invalid `*.md/.json` glob)
- [ ] T048 [US5] Add optional workflow step: if --createIssue is enabled, parse DISCUSS candidates from JSON report and invoke scripts/lib/issue-generator.js (T036) to create summarising GitHub issue with team review link

**Checkpoint**: Workflow is deployed and ready for scheduled/manual execution. Audit reports generated automatically without human intervention.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, testing, and integration

- [ ] T049 [P] Run quickstart.md validation scenarios 1-6 against enhanced cleanup-branches.js to verify all documented examples work correctly
- [ ] T050 [P] Execute npm test to validate all new modules (branch-utils, merge-utils, github-pr-utils, categorization, deletion-verifier, report-formatter, issue-generator) with comprehensive test coverage
- [ ] T051 [P] Validate performance: run audit against test repository with 50+ branches, measure execution time <5 seconds (SC-004), identify and optimise any bottlenecks
- [ ] T052 Performance optimisation: implement merge-base result caching to avoid repeated git operations for same branches
- [ ] T053 Security review: ensure no command injection vulnerabilities in branch deletion operations, validate all CLI parameters are properly escaped
- [ ] T054 Integration test: run complete workflow from audit → deletion candidates → discussion candidates → optional issue generation with sample repository
- [ ] T055 Documentation validation: spot-check all example commands in docs/ execute successfully and produce expected output
- [ ] T056 Acceptance criteria validation: verify SC-001 through SC-008 success criteria are met (categorisation accuracy, branch count reduction, deletion safety, performance, documentation, team confidence, workflow automation, naming validation)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase (Phase 2) completion
  - User stories can proceed in parallel (if team capacity allows)
  - Or sequentially in priority order (US1 → US2 → US3 → US4 → US5)
  - Each story is independently testable and deliverable
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

**Independent Delivery Path (MVP)**:

1. Complete Phase 1: Setup ✓
2. Complete Phase 2: Foundational ✓
3. Complete Phase 3: User Story 1 (Audit) → **Can deploy as MVP**
4. Complete Phase 4: User Story 2 (Deletion Candidates) → Extends MVP
5. Complete Phase 5: User Story 3 (Discussion Candidates) → Extends further
6. Complete Phase 6: User Story 4 (Documentation/Scripts) → Supports team adoption
7. Complete Phase 7: User Story 5 (Automated Workflow) → Enables sustainability

**Parallel Opportunities**:

- All Setup tasks marked [P] (T002, T003, T004) can run in parallel
- All Foundational tasks marked [P] (T008, T009, T010, T011, T012) can run in parallel within Phase 2
- Once Foundational phase completes, User Stories 1-5 can begin in parallel (if team capacity allows):
  - Developer A: User Story 1 (Audit generation)
  - Developer B: User Story 2 (Deletion candidates)
  - Developer C: User Story 3 (Discussion candidates)
  - Developer D: User Story 4 (Documentation)
  - Developer E: User Story 5 (Workflow automation)

### Within Each User Story

- Models/utilities before higher-level functions
- Core functionality before formatting/output
- Independent features before integration

---

## Parallel Execution Examples

### Example 1: Foundational Phase Parallel Tasks

```bash
# Run in parallel:
Task T008: Create git-merge-utils.js
Task T009: Create github-pr-utils.js
Task T010: Create branch-categorization.js
Task T011: Create age-calculator.js
Task T012: Create exclusion-patterns.js

# These tasks operate on different modules, no dependencies
# Total phase time ≈ longest single task (not sum of all)
```

### Example 2: User Story 1 & 2 Parallel After Foundational

```bash
# Once Foundational (Phase 2) complete, start both in parallel:

Developer A: User Story 1 (Audit)
  ├── T015: branch-collector.js
  ├── T016: branch-collector.js enrichment
  ├── T017: audit-generator.js
  ├── T018: Markdown formatting
  ├── T019: JSON formatting
  ├── T020: main script integration
  ├── T021: --reportFormat option
  ├── T022: --dryRun option
  └── T023: Performance validation

Developer B: User Story 2 (Deletion Candidates)
  ├── T024: deletion-verifier.js
  ├── T025: Safety check functions
  ├── T026: filter deletion candidates
  ├── T027: JSON formatting
  ├── T028: Deletion candidates command
  ├── T029: --verificationReportPath
  └── T030: branch-deleter.js

# Both run independently after Phase 2 completes
# Merge when both complete → integrated audit + deletion workflow
```

---

## Implementation Strategy

### MVP (User Story 1 Only) - Minimum Viable Product

**Timeline**: ~1-2 days

1. Complete Phase 1: Setup (Framework foundation)
2. Complete Phase 2: Foundational (Core utilities) ← CRITICAL BLOCKING STEP
3. Complete Phase 3: User Story 1 (Audit generation)
4. **STOP and VALIDATE**: Test audit script against actual .github repository
5. **DEMO**: Show audit report categorising 300+ branches
6. Deploy/merge if ready

**Outcome**: Basic audit capability - shows branch health without deletion

---

### Incremental Delivery (All User Stories)

1. Deploy MVP (Phase 1-3) → Audit reports working
2. Add Phase 4 (US2) → Deletion candidates ready
3. Add Phase 5 (US3) → Discussion flags edge cases
4. Add Phase 6 (US4) → Documentation & scripts harmonised
5. Add Phase 7 (US5) → Automated workflow deployed
6. Run Phase 8 (Polish) → Full validation and release

**Each phase** is independently valuable and testable

---

### Parallel Team Strategy (5 Developers)

With 5 team members:

1. **Team together**: Complete Phase 1 (Setup) + Phase 2 (Foundational)
2. **Once Foundational done** → Branch into parallel streams:
   - Developer 1: User Story 1 (Audit) — T015-T023
   - Developer 2: User Story 2 (Deletion) — T024-T030
   - Developer 3: User Story 3 (Discussion) — T031-T036
   - Developer 4: User Story 4 (Documentation) — T037-T045
   - Developer 5: User Story 5 (Workflow) — T046-T048

3. **Merge and validate**: Complete Phase 8 (Polish) when ready

**Estimated completion**: ~3-4 days with full team (Phase 1-2: 1-2 days, Phase 3-7 parallel: 1-2 days, Phase 8: 1 day)

---

## Notes

- [P] tasks = different files, no inter-task dependencies
- [Story] label maps task to specific user story (US1-US5) for traceability
- Each user story is independently completable, testable, and deployable
- File paths are exact to enable immediate implementation
- Stop at any checkpoint to validate story independently
- All 56 tasks are immediately actionable by an engineer with Node.js and git knowledge
- Constraints: Safe by default (dry-run), zero accidental deletions, <5 second performance
