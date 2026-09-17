---
description: "Task list for fixing specs directory configuration"
---

# Tasks: Fix Specs Directory Configuration

**Input**: Design documents from `.github/specs/007-specs-directory-fix/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Project Type**: Repository governance and configuration tooling (Bash shell scripts + JSON configuration + Markdown documentation)

**Platform**: Linux (bash), cross-platform compatible

**Key Files to Modify**:

- `.specify/init-options.json` — Add specs_directory configuration
- `.specify/scripts/bash/create-new-feature.sh` — Read config, use configured path
- `.specify/scripts/bash/common.sh` — Add helper function to read config
- CLAUDE.md — Document specs location in Repository Boundaries
- Migration: specs/002-coderabbit-config-improvements → .github/specs/002-coderabbit-config-improvements

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare directory structure and configuration framework

**Expected Outcome**: .github/specs/ directory created and ready to receive specs

- [ ] T001 Create `.github/specs/` directory if it doesn't exist
- [ ] T002 Verify `.github/` directory structure and permissions
- [ ] T003 Backup existing `/specs/` directory contents for safe migration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core configuration changes that MUST be complete before any spec workflow can use the new location

**⚠️ CRITICAL**: No user story work can begin until this phase is complete. Speckit scripts must have access to the specs directory configuration before they can be modified to use it.

- [ ] T004 Add `specs_directory` field to `.specify/init-options.json` with value `.github/specs` in `.specify/init-options.json`
- [ ] T005 Create helper function `read_specs_directory()` in `.specify/scripts/bash/common.sh` to read `specs_directory` from config with fallback default `.github/specs`
- [ ] T006 Validate JSON schema: `.specify/init-options.json` must parse correctly with new field
- [ ] T007 Verify common.sh is sourced correctly by create-new-feature.sh and other speckit scripts
- [ ] T008 Document the `specs_directory` field purpose, default, validation rules, and valid examples in `.github/specs/007-specs-directory-fix/contracts/init-options-schema.md`

**Checkpoint**: Configuration infrastructure ready — scripts can now read specs_directory from config ✅

---

## Phase 3: User Story 1 - Developer Creates Feature Spec (Priority: P1) 🎯 MVP

**Goal**: Ensure `/speckit-specify` creates new feature specs in `.github/specs/` instead of root `specs/` directory

**Dependency**: Phase 2 (Foundational) must be complete — common.sh helper function must exist

**Independent Test**: Running `/speckit-specify "test feature"` should create spec in `.github/specs/NNN-test-feature/` not `specs/NNN-test-feature/`

### Implementation for User Story 1

- [ ] T009 [P] [US1] Update `create-new-feature.sh` line 200 to call `read_specs_directory()` helper instead of hardcoding `SPECS_DIR="$REPO_ROOT/specs"` in `.specify/scripts/bash/create-new-feature.sh`
- [ ] T010 [US1] Verify `create-new-feature.sh` correctly assigns: `SPECS_DIR="$REPO_ROOT/$(read_specs_directory)"` with proper error handling if config read fails in `.specify/scripts/bash/create-new-feature.sh`
- [ ] T011 [US1] Test `/speckit-specify --dry-run "add user authentication"` outputs SPEC_FILE path under `.github/specs/` in `.specify/scripts/bash/create-new-feature.sh`
- [ ] T012 [US1] Verify feature numbering continues sequentially (004, 005, 006...) when specs are created in new location in `.specify/scripts/bash/create-new-feature.sh`
- [ ] T013 [P] [US1] Update `setup-plan.sh` to use configured specs_directory when resolving FEATURE_DIR in `.specify/scripts/bash/setup-plan.sh`
- [ ] T014 [P] [US1] Update `setup-tasks.sh` to use configured specs_directory when resolving FEATURE_DIR in `.specify/scripts/bash/setup-tasks.sh`
- [ ] T015 [US1] Test `/speckit-plan` resolves spec location correctly from `.github/specs/` (requires T009-T010 complete) in `.specify/scripts/bash/setup-plan.sh`
- [ ] T016 [US1] Test `/speckit-tasks` resolves spec location correctly from `.github/specs/` (requires T009-T010 complete) in `.specify/scripts/bash/setup-tasks.sh`

**Checkpoint**: Developer workflow fixed — new specs created in `.github/specs/`, all speckit commands resolve paths correctly ✅

---

## Phase 4: User Story 2 - Repository Structure Compliance (Priority: P2)

**Goal**: Document specs location in CLAUDE.md and ensure repository structure follows governance principles

**Dependency**: Phase 2 (Foundational) must be complete

**Independent Test**: Audit CLAUDE.md Repository Boundaries section and verify `.github/specs` is explicitly documented as the correct location for specs

### Implementation for User Story 2

- [ ] T017 [US2] Update CLAUDE.md Repository Boundaries section to add row: `| Specification files (features, plans, etc.) |`.github/specs/`|` in `./CLAUDE.md`
- [ ] T018 [P] [US2] Add reference to specs location in CLAUDE.md "Related Files" section linking to `.specify/README.md` or similar in `./CLAUDE.md`
- [ ] T019 [US2] Verify no other CLAUDE.md sections conflict with or contradict the new specs location in `./CLAUDE.md`
- [ ] T020 [P] [US2] Update `.specify/` documentation or README (if exists) to reference `.github/specs` as canonical location in `.specify/README.md` or inline comments
- [ ] T021 [US2] Verify `specs_directory` is documented with valid examples in `.github/specs/007-specs-directory-fix/contracts/init-options-schema.md` without adding comments to `.specify/init-options.json`
- [ ] T022 [US2] Add comment to `create-new-feature.sh` explaining that specs_directory is configurable and defaults to `.github/specs` in `.specify/scripts/bash/create-new-feature.sh`

**Checkpoint**: Documentation aligned — CLAUDE.md and code comments clearly document `.github/specs` as canonical location ✅

---

## Phase 4B: Rollback Mechanism (FR-009 Implementation)

**Purpose**: Implement automatic rollback capability for migration failures

**Dependency**: Phase 2 (Foundational) must be complete

**⚠️ CRITICAL**: Rollback mechanism MUST be in place before T023-T028 migration runs

### Implementation for Rollback (FR-009)

- [ ] T023A [P] Create migration helper script `.specify/scripts/bash/migrate-specs.sh` with rollback capability: (a) pre-migration backup of both locations to temp directory, (b) error detection on any file operation failure, (c) automatic restoration from backup on error, (d) detailed error logging with troubleshooting guidance
- [ ] T023B [P] Define rollback trigger logic: Any `cp`, `mv`, `mkdir` error detected during migration → immediately trigger rollback, verify original state restored, log error with context (permission denied, disk full, path issues)
- [ ] T023C Document rollback behavior in quickstart.md: What happens on rollback, how to verify original state preserved, error message format and interpretation

**Checkpoint**: Rollback infrastructure ready — migration can proceed safely with automatic error recovery ✅

---

## Phase 5: User Story 3 - Migrate Existing Specs (Priority: P3)

**Goal**: Move existing specs from root `specs/` directory to `.github/specs/` with 100% content preservation

**Dependency**: Phase 2 (Foundational) + Phase 3 (US1) must be complete — new workflow established before migration

**Independent Test**: Verify all specs migrated, no data loss, old location empty, downstream workflows still find specs

### Implementation for User Story 3

- [ ] T023 [US3] Inventory and recursively compare the complete `specs/` and `.github/specs/` trees, including hidden entries, before migration; record every matching destination path as a potential conflict
- [ ] T024 [US3] Resolve every conflicting file or directory explicitly, then copy all source entries to `.github/specs/` without allowing unresolved destination content to be overwritten
- [ ] T025 [US3] Recursively compare each source entry with its migrated destination to verify 100% content preservation; after verification, update `.specify/feature.json` to the migrated path if it is version-controlled, or document its ignored, auto-populated status
- [ ] T026 [US3] Only after T025 succeeds, remove the root `specs/` tree or confirm it is empty, and verify no source content remains unmigrated
- [ ] T027 [US3] Verify `/speckit-plan` and `/speckit-tasks` can still find migrated spec in `.github/specs/002-coderabbit-config-improvements/` (run against existing spec to confirm paths resolve) in `.specify/scripts/bash/setup-plan.sh` and `.specify/scripts/bash/setup-tasks.sh`
- [ ] T028 [US3] Run quickstart.md validation scenarios (from `.github/specs/007-specs-directory-fix/quickstart.md`) to confirm all changes working end-to-end in `./quickstart.md`

**Checkpoint**: All specs migrated — zero specs in root `specs/`, all specs in `.github/specs/`, all downstream workflows functional ✅ (Already complete - all specs were already in correct location)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, testing, and documentation cleanup

**Dependency**: All user stories complete (US1, US2, US3)

- [ ] T029 [P] Run full test suite: Verify create-new-feature.sh dry-run creates specs in correct location via `.specify/scripts/bash/create-new-feature.sh --json --dry-run "test migration verification"`
- [ ] T030 [P] Verify all speckit integration scripts (setup-plan.sh, setup-tasks.sh, check-prerequisites.sh) correctly resolve specs directory from config in `.specify/scripts/bash/`
- [ ] T031 Code review: Ensure all hardcoded `/specs` or `$REPO_ROOT/specs` paths have been replaced with config-driven logic via grep search for "SPECS_DIR" in `.specify/scripts/bash/`
- [ ] T032 [P] Security check: Verify `read_specs_directory()` function validates input (no parent directory traversal, no special characters) in `.specify/scripts/bash/common.sh`
- [ ] T033 Update any project-specific `.specify/` documentation or wiki entries that reference old specs location via docs/ or inline comments
- [ ] T034 Commit final changes with message explaining completion of all three user stories in git
- [ ] T035 [P] Final validation: Run /speckit-specify, /speckit-plan, /speckit-tasks on a new feature to verify entire workflow uses .github/specs/ in bash/shell
- [ ] T036 Verify no residual references to root-level `specs/` directory in CI/CD workflows, GitHub Actions, or automation scripts via grep in `.github/workflows/`

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)** → No dependencies
   - Can start immediately
   - Creates physical directory structure

2. **Foundational (Phase 2)** → Depends on Setup completion (T001-T003)
   - BLOCKS all user stories
   - Adds configuration field + helper functions
   - All scripts must have access to this before modification

3. **User Story 1 (Phase 3)** → Depends on Foundational completion (T004-T008)
   - Core functionality fix
   - Modifies create-new-feature.sh and other scripts to use config
   - Can run in parallel with US2 once Foundation done (if staffed)

4. **User Story 2 (Phase 4)** → Depends on Foundational completion (T004-T008)
   - Documentation/governance alignment
   - Can run in parallel with US1 once Foundation done (if staffed)

5. **Rollback Mechanism (Phase 4B)** → Depends on Foundational completion (T004-T008)
   - Implements FR-009 automatic rollback capability
   - MUST be complete before User Story 3 migration runs
   - Can run in parallel with US1, US2 once Foundation done

6. **User Story 3 (Phase 5)** → Depends on US1 completion (T009-T016) AND Rollback completion (T023A-T023C)
   - Uses the fixed workflow to verify migration
   - Rollback mechanism must be in place before migration starts
   - Cannot run until both new workflow AND rollback are ready

7. **Polish (Phase 6)** → Depends on US1, US2, Rollback, US3 completion
   - Final validation and cleanup

### Within User Story Dependencies

**US1 Task Dependencies**:

- T009-T010 (update create-new-feature.sh) before T011-T012 (test it)
- T009-T010 before T013-T014 (update other scripts)
- T013-T014 before T015-T016 (test plan/tasks)

**US2 Task Dependencies**:

- T017 (main doc update) before T018-T022 (supporting docs)

**Rollback Task Dependencies** (Phase 4B):

- T023A (create migrate script with rollback) before T023B (define triggers)
- T023B (define triggers) before T023C (document in quickstart)

**US3 Task Dependencies**:

- T023A-T023C (rollback complete) BEFORE T023 (inventory starts)
- T023 (inventory and compare trees) before T024 (resolve conflicts and copy)
- T024 (copy content) before T025 (verify migration)
- T025 (verify migration) before T026 (clean up)
- T023-T026 (migration complete) before T027-T028 (verify workflow still works)

### Parallel Opportunities

**Within Setup (Phase 1)**:

- All tasks sequential (directory must exist before other operations)

**Within Foundational (Phase 2)**:

- T005 (create helper) can run with T006 (validate JSON) - different files
- T004 (add config field) should complete before T006

**Within US1 (Phase 3)** - Once Foundational done:

- T009-T010 (update create-new-feature.sh) in sequence
- T013-T014 (update other scripts) can run in parallel with T009-T010 (different files)
- T011-T012 (test) after T009-T010 complete

**Within US2 (Phase 4)** - Once Foundational done:

- T017 (CLAUDE.md) sequentially first
- T018-T022 (other docs) can run in parallel (different files)

**Within Rollback (Phase 4B)** - Once Foundational done:

- T023A, T023B, T023C must run sequentially (each depends on previous)

**US1, US2, & Rollback in Parallel**:

- Once Foundational (T004-T008) complete
- Developer A: Work on US1 (T009-T016)
- Developer B: Work on US2 (T017-T022)
- Developer C (or B after US2): Implement Rollback (T023A-T023C)
- All can proceed independently

**US3 Sequence** (must wait for US1 + Rollback):

- After US1 AND Rollback complete, migrate (T023-T028) sequentially

**Polish & Testing (Phase 6)**:

- T029-T032 can run in parallel (different files, different scripts)
- T033 (docs) can run in parallel with code testing
- T034 (commit) must wait for all code changes
- T035-T036 (final validation) after commit

---

## Parallel Example: Two-Developer Execution

### Timeline with 2 developers

**Day 1**:

- Developer A + B: Complete Phase 1 Setup together (T001-T003)
- Developer A + B: Complete Phase 2 Foundational together (T004-T008)

**Day 2** (Both working in parallel):

- Developer A: User Story 1 (T009-T016) — Update and test spec creation workflow
- Developer B: User Story 2 (T017-T022) — Update documentation and governance

**Day 3**:

- Developer A (or A+B together): Verify US1 complete and working
- Developer A + B: User Story 3 (T023-T028) — Migrate existing specs

**Day 4**:

- Developer A + B: Polish & Validation (T029-T036) — Final testing and verification
- Developer A: Commit and push final changes

---

## Implementation Strategy

### MVP First (User Story 1 + Rollback Mechanism)

1. ✅ Complete Phase 1: Setup (T001-T003)
2. ✅ Complete Phase 2: Foundational (T004-T008)
3. ✅ Complete Phase 4B: Rollback Mechanism (T023A-T023C) — CRITICAL for migration safety
4. ✅ Complete Phase 3: User Story 1 (T009-T016)
5. **STOP and VALIDATE**: Test `/speckit-specify` creates specs in `.github/specs/` (T011-T012)
6. Proceed to US2 & US3 if validation passes

**MVP Deliverable**: Developers can create new feature specs in `.github/specs/` with safe migration infrastructure in place

### Incremental Delivery (Full Feature)

1. MVP: User Story 1 (Phase 1-3) → New specs in correct location
2. Add User Story 2 (Phase 4) → Documentation updated, governance aligned
3. Add User Story 3 (Phase 5) → Legacy specs migrated, structure complete
4. Polish (Phase 6) → All validation complete, ready for production

### Risk Mitigation

- **Backup before migration** (T003): Preserve original specs in case of issues
- **Test dry-run first** (T011): Confirm script changes work before actual spec creation
- **Conflict-safe migration** (T023-T024): Inventory both trees and resolve conflicts before copying
- **Verify after migration** (T025): Confirm 100% content preservation before cleanup
- **Final validation** (T028, T035): Confirm all workflows still functional after changes

---

## Format Reference

**Checklist Format**:

- ✅ `- [ ] [TaskID] [P?] [Story?] Description with file path`
  - [P]: Parallelizable (can run simultaneously with other [P] tasks in same phase)
  - [Story]: User story label (US1, US2, US3) — only for user story phase tasks
  - File path: Exact location of file being modified

**Execution Markers**:

- [P] = Parallelizable within phase
- [US1] / [US2] / [US3] = User story assignment

---

## Notes

- All tasks reference exact file paths for clarity
- Tests are provided via quickstart.md (separate validation document)
- No new code libraries or dependencies required — shell scripts, JSON, Markdown only
- Backward compatibility: Old configs without `specs_directory` field default to `.github/specs`
- All changes version-controlled (git) and reversible until final migration cleanup
