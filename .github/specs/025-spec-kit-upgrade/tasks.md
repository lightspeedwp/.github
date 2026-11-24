# Tasks: Spec Kit Upgrade to v1.4.4

**Input**: Design documents from `.github/specs/025-spec-kit-upgrade/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story the task belongs to

## Phase 1: Setup

- [X] T001 Install `specify-cli` v1.4.4 with `uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git@v1.4.4`
- [X] T002 Create branch `aiops/spec-kit-upgrade-v1-4-4` in an isolated worktree from `origin/develop`
- [X] T003 Record the baseline: `specify integration status` and the list of modified managed files

## Phase 2: Foundational

- [X] T004 Review the git history of each modified managed file to separate deliberate edits from hash mismatches

## Phase 3: User Story 1 - Current release (Priority: P1)

- [X] T005 [US1] Run `specify integration upgrade claude --force`
- [X] T006 [US1] Confirm version `1.4.4` in `.specify/integration.json`, `.specify/init-options.json` and both manifests in `.specify/integrations/`

## Phase 4: User Story 2 - Specifications folder (Priority: P1)

- [X] T007 [US2] Restore `read_specs_directory` in `.specify/scripts/bash/common.sh`
- [X] T008 [US2] Make `.specify/scripts/bash/create-new-feature.sh` resolve the folder from `specs_directory`
- [X] T009 [US2] Check both scripts with `bash -n` and ShellCheck
- [X] T010 [US2] Dry-run `create-new-feature.sh` and confirm the path is under `.github/specs/` and the number is 025

## Phase 5: User Story 3 - No stale task-to-issue skill (Priority: P2)

- [X] T011 [US3] Run `specify extension add github`
- [X] T012 [US3] Confirm `.claude/skills/speckit-taskstoissues/` is gone
- [X] T018 [US3] After review, run `specify extension remove github` and confirm `specify extension list` shows none

## Phase 6: Polish

- [X] T013 [P] Add the specification row and detailed entry to `.github/specs/CATALOG.md`
- [X] T017 [P] Add the Spec Kit managed files to `.markdownlintignore`
- [X] T014 [P] Add the changelog entry to `CHANGELOG.md`
- [X] T015 Run Semgrep on the changed scripts
- [ ] T016 Open the pull request and confirm the required checks pass

## Dependencies & Execution Order

- T001 to T004 come first, in order.
- T005 must finish before T007 and T008, because the upgrade overwrites both scripts.
- T011 depends on T005.
- T013 and T014 are independent of each other.
