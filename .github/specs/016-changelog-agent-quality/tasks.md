---
file_type: "documentation"
title: "Tasks: Changelog Agent Quality & Validation Framework"
description: "Lists the tasks for completing the changelog agent around the shipped validation engine."
version: "v1.0"
last_updated: "2026-11-25"
owners: ["LightSpeed Team"]
tags: ["changelog", "agents", "skills", "validation", "spec-kit"]
status: "draft"
stability: "experimental"
domain: "governance"
---

# Tasks: Changelog Agent Quality & Validation Framework

**Input**: Design documents from `.github/specs/016-changelog-agent-quality/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md)

**Supporting documents**: [data-model.md](./data-model.md), [research.md](./research.md), [quickstart.md](./quickstart.md), [contracts/cli-interface.md](./contracts/cli-interface.md), [contracts/rest-api-interface.md](./contracts/rest-api-interface.md)

**Tests**: Included. `plan.md` (Validation and Tests) and SC-008 (coverage of at least 85%) require them.

**Linear record**: [GIT-2308](https://linear.app/lightspeedwp/issue/GIT-2308), under the epic [GIT-2302](https://linear.app/lightspeedwp/issue/GIT-2302).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story the task belongs to (US1 to US4 in `spec.md`)
- Constrained fields are cited as `data-model.md` followed by `Entity.field`; the data model stays the canonical definition.

## Decisions already settled in the specification

These came up as review findings on the earlier specification pull request. The current `spec.md`, `data-model.md` and contracts already answer them, so no task reopens them:

- **Changelog exemption**: the shipped gate's bypasses and the `meta:no-changelog` label; a branch prefix is not a bypass (`spec.md` Clarifications Q1, FR-009).
- **One error payload**: the `ErrorObject` fields in `data-model.md` (`spec.md` FR-005).
- **Link rules per reference type**: a pull request must be merged; an issue only has to exist (`data-model.md`, GitHub Pull Request validation rules).
- **Concurrency**: the reader/writer protocol in `research.md` section 6 (`spec.md` FR-011).
- **Token handling**: pass the token through `GITHUB_TOKEN`, never as a command-line argument (`contracts/cli-interface.md`, Check-Links usage examples). T007 brings the shipped scripts into line.

The optional REST wrapper stays design-only (`plan.md`, Structure Decision), so no task builds it.

## Phase 1: Setup

- [ ] T001 Run each package's test script (`.github/validation/changelog/`, `agents/changelog-agent/`) and record pass counts and the current line coverage of `agents/changelog-agent/` as the SC-008 baseline in `research.md`
- [ ] T002 [P] List every changelog script and test under `scripts/validation/`, `scripts/workflows/changelog/`, `agents/changelog-agent/` and `.github/validation/changelog/`, marking each as keep, move into a skill, or duplicate (FR-010), in `research.md`
- [ ] T003 [P] Count the sections, examples and troubleshooting entries in `docs/agents/prd-agent/` as the SC-004 comparison basis, and record that the prd-agent folder has no `TROUBLESHOOTING.md` or `API.md` while FR-006 requires both, in `research.md`
- [ ] T004 Read the package layout in spec 020 on the open pull request 3883 (`.github/specs/020-portable-changelog-release-agents/contracts/agent-package-layout.md`) and record any conflict with the four skill names and folders in `plan.md`; resolve it before T015

## Phase 2: Foundational (blocks the skill work in Phase 4)

- [ ] T005 [P] Add a repository-relative path module in `agents/changelog-agent/includes/pathConfinement.cjs` that rejects absolute, escaping, Windows-style and escaping-symlink paths, for `data-model.md` `ValidationResult.changelog_path`, with tests in `agents/changelog-agent/tests/unit/path-confinement.test.js`
- [ ] T006 [P] Add the reader/writer lock in `agents/changelog-agent/includes/changelogLock.cjs` following `research.md` section 6 (coordination mutex, writer intent, reader markers, write lock, owner tokens, leases, heartbeats, token check before each write, 5-second wait with the active-owner message)
- [ ] T007 Add stale-owner recovery to `agents/changelog-agent/includes/changelogLock.cjs`: tombstone rename with inode and token comparison, and an OS-released primitive for the recovery mutex, refusing the operation with a clear error where the platform has none
- [ ] T008 Add lock tests in `agents/changelog-agent/tests/unit/changelog-lock.test.js` for concurrent readers, writer intent blocking new readers, merge waiting for readers, active-owner retention, stale-owner recovery, token-safe release and timeout
- [ ] T009 Make the token environment-only: remove the `--github-token` option from `.github/validation/changelog/bin/validate.js` and `.github/validation/changelog/bin/report-check-run.js`, stop `.github/validation/changelog/validate.sh` forwarding it as an argument, switch every caller found with a repository search to `GITHUB_TOKEN`, and drop the flag from the parameter tables and help text in `contracts/cli-interface.md`; add a test in `.github/validation/changelog/test/unit/`

## Phase 3: User Story 1 - Root-level alias for local validation (Priority: P1)

**Goal**: One root command runs the shipped engine and returns its output unchanged.

**Independent test**: `npm run changelog:validate` on a branch with invalid entries exits non-zero and lists failures with line numbers and fix suggestions.

- [ ] T010 [US1] Add regression tests in `.github/validation/changelog/test/unit/` for the eight rules in `.github/validation/changelog/rules.json`, one fixture per acceptance scenario in `spec.md` User Story 1 (length over 250, missing link, all valid, mixed results with no fail-fast)
- [ ] T011 [US1] Add `changelog:validate` to `package.json` as a transparent wrapper for `.github/validation/changelog/bin/validate.js`, keeping `--changelog-path`, `--output text|json`, defaults and exit status (FR-001), and confirm it does not replace the existing `validate:changelog` script
- [ ] T012 [US1] Compare the engine's JSON with `data-model.md` `ErrorObject.error_code`, `ErrorObject.message`, `ErrorObject.entry_id`, `ErrorObject.line_number`, `ErrorObject.suggestion` and `ErrorObject.severity` (plus `ErrorObject.field`, `ErrorObject.expected_format` and `ErrorObject.actual_value` where a failure concerns a value's format), and with `ChangelogEntry.id` (stable hash, never derived from line position), `ChangelogEntry.character_count` (length of content, at most 250) and `ChangelogEntry.line_number` (positive current line number); record each difference and fix it in the engine's reporting, not in a second implementation
- [ ] T013 [US1] Add a shell smoke test for the alias in `agents/changelog-agent/tests/integration/` covering exit code, line numbers, suggestions and parsable output
- [ ] T014 [US1] Measure the alias against `data-model.md` `ValidationResult.validation_time_ms` on the repository `CHANGELOG.md` and record whether SC-001 (5 seconds) holds

## Phase 4: User Story 2 - Skills conformant to the Agent Skills specification (Priority: P2)

**Goal**: Four skills (validate, check-links, merge, format) with valid `SKILL.md` files, each calling shared code and the shipped engine.

**Independent test**: every `agents/changelog-agent/skills/<name>/` has a valid `SKILL.md` whose `name` equals its folder, and each skill runs through its npm command.

- [ ] T015 [US2] Rename `agents/changelog-agent/skills/validate-changelog/` to `agents/changelog-agent/skills/changelog-validate/`, set `name`, and update every reference (the unit test `agents/changelog-agent/tests/unit/validate-changelog-skill.test.js`, the skill registry, agent documents)
- [ ] T016 [US2] Write the `SKILL.md` frontmatter for all four skills from `data-model.md` Skill Definition: `name` (1 to 64 characters, equal to the folder), `description` (1 to 1024), `license`, `compatibility` (1 to 500), `metadata` (string keys and values), `allowed-tools`, and the `lightspeedwp-version`, `lightspeedwp-triggers`, `lightspeedwp-inputs`, `lightspeedwp-outputs`, `lightspeedwp-error-codes`, `lightspeedwp-dependencies` and `lightspeedwp-timeout-ms` entries
- [ ] T017 [P] [US2] Make `changelog-validate` call the shipped engine through its `scripts/` entry, take the reader marker from T006 and the path check from T005, and return `data-model.md` `ValidationResult.id`, `ValidationResult.timestamp`, `ValidationResult.valid`, `ValidationResult.entries_total`, `ValidationResult.entries_valid`, `ValidationResult.entries_invalid`, `ValidationResult.errors`, `ValidationResult.warnings`, `ValidationResult.skill_id` and `ValidationResult.skill_version`
- [ ] T018 [P] [US2] Build `changelog-check-links` in `agents/changelog-agent/skills/changelog-check-links/scripts/` from `agents/changelog-agent/includes/githubClient.cjs`, `prStatusChecker.cjs` and `referenceLinker.cjs`: exit codes 0 to 5, `--strict`, the token from `GITHUB_TOKEN`, a pull request must be merged, an issue must exist, and enforce `data-model.md` `ChangelogEntry.pr_issues` (at least one reference; only `#123` and `issues/#123` are resolved) and GitHub Pull Request validation rules
- [ ] T019 [P] [US2] Build `changelog-merge` in `agents/changelog-agent/skills/changelog-merge/scripts/` from `scripts/workflows/changelog/merge-entries.cjs`: writer lock from T006, blocking until validation completes, atomic write, backup file, `--dry-run`, exit codes 0 to 5, and only entries that passed validation reach the release section (`data-model.md` Changelog Entry lifecycle)
- [ ] T020 [P] [US2] Build `changelog-format` in `agents/changelog-agent/skills/changelog-format/scripts/` from `scripts/validation/fix-changelog-format.cjs`: writer lock from T006, `--dry-run`, Keep a Changelog output for `data-model.md` `ChangelogEntry.category`, `ChangelogEntry.content`, `ChangelogEntry.version` and `ChangelogEntry.release_date`
- [ ] T021 [US2] Add root npm aliases `changelog:check-links`, `changelog:merge` and `changelog:format` to `package.json`, mirroring T011
- [ ] T022 [US2] Test entry handling against `data-model.md` `ChangelogEntry.pr_issues`, `ChangelogEntry.character_count` and `ChangelogEntry.line_number` (a mutable location, not an identifier) in `agents/changelog-agent/tests/unit/`
- [ ] T023 [US2] Add integration tests in `agents/changelog-agent/tests/integration/` for check-links with mocked GitHub responses, merge (atomic write, dry run, backup) and format output
- [ ] T024 [US2] Move or delete the duplicate logic identified in T002 from `scripts/validation/` and `scripts/workflows/changelog/`, update every workflow and test that called it, and confirm no orphaned changelog validation code remains outside the agent folder (SC-009, FR-010)
- [ ] T025 [US2] Confirm the four skills appear in the skill registry search for "changelog" with version metadata; if the registry cannot validate an agents-only entry, record the dependency on GIT-2380 instead of editing locked files
- [ ] T026 [US2] Run the repository skill validator over `agents/changelog-agent/skills/` and fix findings in the new skills; do not add them to the baseline

## Phase 5: User Story 3 - Agent documentation (Priority: P3)

**Goal**: `docs/agents/changelog-agent/` documents the agent at the depth recorded in T003.

**Independent test**: the five files exist, every example runs locally, and the troubleshooting file covers the four cases in `spec.md` User Story 3.

- [ ] T027 [P] [US3] Write `docs/agents/changelog-agent/README.md` (purpose, skills, quick start, expected inputs and outputs, common failures)
- [ ] T028 [P] [US3] Write `docs/agents/changelog-agent/SKILLS.md` (name, purpose, parameters, example, output and error codes for each skill, taken from the contracts)
- [ ] T029 [P] [US3] Write `docs/agents/changelog-agent/INTEGRATION.md` (workflows, other agents, chaining skills, token and permission needs using `GITHUB_TOKEN`)
- [ ] T030 [P] [US3] Write `docs/agents/changelog-agent/TROUBLESHOOTING.md` (validation failures, script not found, workflow integration, common parameter mistakes) and `docs/agents/changelog-agent/API.md` (the npm interface; the REST interface marked design-only)
- [ ] T031 [US3] Run every documented command, check the links, run Markdown lint, and compare section, example and troubleshooting counts with the T003 basis (SC-004)

## Phase 6: User Story 4 - Workflow labelling integration (Priority: P4)

**Goal**: The changelog workflow uses only the two canonical labels and reports validation status.

**Independent test**: the four acceptance scenarios in `spec.md` User Story 4 pass against `.github/workflows/changelog-unified.yml`.

- [ ] T032 [US4] Check `.github/workflows/changelog-unified.yml` and `scripts/workflows/changelog/__tests__/changelog-unified.test.js` against the four acceptance scenarios (clear `meta:needs-changelog` on pass, keep it on failure, only the two canonical labels, automatic application) and list the gaps
- [ ] T033 [US4] Close only the gaps from T032, switching the workflow to the root commands from T011 and T021 and preserving exit codes and the bypasses in FR-009; add tests in `scripts/workflows/changelog/__tests__/`
- [ ] T034 [US4] Check that the pull request templates carry changelog label guidance; if guidance is missing, write a change request for the maintainers instead of editing the locked templates or `.github/labels.yml`

## Phase 7: Polish

- [ ] T035 Run Scenarios 1, 2 and 4 in `quickstart.md` after US1; add Scenario 3 after US2 delivers all four skill directories and the T021 aliases; add Scenario 6 after US3 delivers the documentation. Run the full quickstart (Scenarios 1–8) after US4, the final increment. Record each run in `quickstart.md`
- [ ] T036 Measure coverage of `agents/changelog-agent/` and confirm SC-008 (at least 85%) against the T001 baseline
- [ ] T037 Run targeted ESLint, Markdown lint, actionlint on changed workflows, JSON and schema validation, and `git diff --check`
- [ ] T038 Re-run the constitution table in `plan.md` against the finished work and record any approved exception before merge
- [ ] T039 Update the status in `spec.md` and `.github/specs/CATALOG.md` to match what was delivered, without ticking tasks that were not verified

## Dependencies

- T004 comes before T015.
- Phase 2 comes before Phase 4. T005 and T006 can run together; T007 and T008 follow T006.
- T009 comes before T018 and T029.
- US1 (T010 to T014) needs only the shipped engine and can start after Phase 1.
- T011 comes before T021, T033 and T035.
- US4 depends on T011 and T021.

## Parallel opportunities

- Phase 1: T002 and T003.
- Phase 2: T005 and T006.
- US2: T017, T018, T019 and T020 touch different skill folders.
- US3: T027 to T030 write different files.

## Implementation strategy

1. Finish Phase 1 and Phase 2.
2. Deliver US1 as the first increment (T010 to T014); it needs no new skill.
3. Deliver US2, then US3 and US4 in priority order, each as its own pull request.
4. Run Phase 7 once per delivered increment, not only at the end.
