---
description: "Task list for 016 Standardised Claude Code Cloud Environment"
---

# Tasks: Standardised Claude Code Cloud Environment

**Input**: Design documents from `.github/specs/016-claude-cloud-environment/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: The plan and quickstart ask for them, so they're included. They are black-box Jest contract tests that
spawn the hook with JSON on stdin.

**Where the work lands**:

- US1 and US2 go in `config/claude-cloud-environment` (lightspeedwp/.github#3524).
- The US3 cleanup work goes in spec 009 / `task/branch-cleanup-refactor` (lightspeedwp/.github#3358).
- The spec amendment (T001) goes in `docs/claude-cloud-environment-spec` (lightspeedwp/.github#3525).

Tasks already delivered in #3524 or #3358 are ticked, so `/speckit-converge` and `/speckit-implement` start from
the real baseline.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on unfinished tasks)
- **[Story]**: The user story the task belongs to (US1, US2 or US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align the spec with the plan, and put the test harness in place.

- [x] T001 Amend FR-013a in `.github/specs/016-claude-cloud-environment/spec.md` so the protected guard files also include `.claude/settings.local.json` and `~/.claude/settings.json`, which can disable hooks (research R12). Update the matching clarification bullet, acceptance scenario 11 and edge case.
- [ ] T002 [P] Create the black-box test harness in `scripts/__tests__/enforce-branch-name-hook.test.js`. It needs:
  - a helper that spawns `node .claude/hooks/enforce-branch-name.mjs` with a JSON payload `{ tool_name, tool_input, cwd }` on stdin
  - a temporary git repository fixture (`git init`, a `develop` branch, a bare `origin` remote)
  - a `PATH` stub for `gh`, so the open-PR result can be controlled
- [ ] T003 [P] Create `scripts/__tests__/session-start-hook.test.js`. It runs `bash .claude/hooks/session-start.sh` with `CLAUDE_CODE_REMOTE` and `source` variants in a temporary repository, and asserts that stdout is a single valid JSON object.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The guard's skeleton, which every rule depends on.

**⚠️ CRITICAL**: Finish this phase before any US1 rule work.

- [x] T004 Register the SessionStart and PreToolUse hooks in `.claude/settings.json` (done in #3524)
- [x] T005 Create the guard skeleton in `.claude/hooks/enforce-branch-name.mjs`. It parses Bash commands (quote and here-document stripping, segment splitting, effective-branch tracking) and returns exit 2 with stderr when refusing (done in #3524).
- [ ] T006 Restructure `.claude/hooks/enforce-branch-name.mjs` to load `lib/validate-branch-name.js` with a dynamic `await import()` inside a single `try` around all evaluation, so a load or internal error reaches the fault handler instead of crashing Node (research R11).
- [ ] T007 Extend the PreToolUse matcher in `.claude/settings.json` to `Bash|Edit|Write|MultiEdit|NotebookEdit|mcp__github__(create_branch|create_pull_request|push_files|create_or_update_file|delete_file)`, as in `contracts/hooks.md`.

**Checkpoint**: The guard loads safely and sees every tool it needs to police.

---

## Phase 3: User Story 1 - Agent never publishes a non-compliant branch (Priority: P1) 🎯 MVP

**Goal**: Every commit, push, branch and PR Claude makes follows `{type}/{scope}-{title}` on top of `develop`, with
only the documented exceptions.

**Independent Test**: Start a fresh session and ask for a docs change. Check that the pushed branch passes
`npm run validate:branch-name` and the PR targets `develop`. Then ask for a commit without renaming, and check that
it's refused (quickstart §1, §4).

### Tests for User Story 1

- [ ] T008 [P] [US1] Add naming and placeholder cases to `scripts/__tests__/enforce-branch-name-hook.test.js`:
  - commit on `chore/session-abc123` → exit 2
  - `git push -u origin claude/foo` → exit 2
  - `git push origin --delete claude/foo` → exit 0
  - `git branch -m feat/good-name && git commit -m x` → exit 0
  - quoted and here-document text that mentions `claude/x` → exit 0
  - `git checkout -b feature/thing` → exit 2
- [ ] T009 [P] [US1] Add documentation-exception cases to `scripts/__tests__/enforce-branch-name-hook.test.js`:
  - commit on `develop` with only `docs/**` and `.github/specs/**` staged → exit 0
  - with any other file staged → exit 2, and stderr lists the file
  - `git add package.json && git commit` on `develop` → exit 2
  - push to `develop` whose diff touches only allowed paths → exit 0
  - an empty or unknown path set → exit 2
- [ ] T010 [P] [US1] Add legacy PR exception cases to `scripts/__tests__/enforce-branch-name-hook.test.js`:
  - push to an existing remote `copilot/fix-login` with the `gh` stub returning an open PR → exit 0
  - `gh` returning `[]`, exiting non-zero or timing out → exit 2
  - commit on that branch with an open PR → exit 0
  - creating a new `copilot/*` branch → exit 2
- [ ] T011 [P] [US1] Add GitHub MCP cases to `scripts/__tests__/enforce-branch-name-hook.test.js`:
  - `create_pull_request` from `feat/a-b` into `main` on `.github` → exit 2
  - head `claude/x-y` → exit 2
  - owner other than `lightspeedwp` → exit 0
  - `push_files` to `develop` with only `docs/` paths → exit 0
- [ ] T012 [P] [US1] Add self-protection cases to `scripts/__tests__/enforce-branch-name-hook.test.js`:
  - `Edit` of `.claude/hooks/enforce-branch-name.mjs` → exit 2
  - `Write` to `.claude/settings.local.json` → exit 2
  - `sed -i … .claude/settings.json`, `rm .claude/hooks/x`, `echo {} > .claude/settings.json` and `git restore .claude/settings.json` → exit 2
  - `cat .claude/settings.json` → exit 0
  - every refusal with `LS_ENFORCE_BRANCH_NAMES=0` → exit 0 plus a `systemMessage`
- [ ] T013 [P] [US1] Add guard-fault cases to `scripts/__tests__/enforce-branch-name-hook.test.js`, forcing the validator import to fail (for example with an environment variable that points it at a missing path in test mode):
  - `git commit` → exit 2, and stderr contains "Branch guard unavailable"
  - `ls` → exit 0 plus a `systemMessage` warning
  - MCP `create_pull_request` → exit 2
  - malformed stdin → exit 0, silent
- [ ] T014 [P] [US1] Add SessionStart cases to `scripts/__tests__/session-start-hook.test.js`:
  - a fresh `claude/x-abc123` with 0 commits ahead → renamed to `chore/session-abc123` and not pushed
  - `claude/x-abc123` with its own commits → unchanged
  - on `compact` → no rename, but the context is still emitted
  - the context contains the documentation exception, the legacy PR exception, the protected-files note and "OVERRIDE"

### Implementation for User Story 1

- [x] T015 [US1] Rename a forbidden-prefix branch to a local placeholder, sync fresh sessions with `origin/<LS_BASE_BRANCH>`, and skip `npm install` when current, in `.claude/hooks/session-start.sh` (done in #3524)
- [ ] T016 [US1] Limit the rename in `.claude/hooks/session-start.sh` to branches where `git rev-list --count origin/${BASE_BRANCH}..HEAD` is `0`, and leave a forbidden-prefix branch that has commits unchanged (FR-001, research R10).
- [ ] T017 [US1] Update the context text in `.claude/hooks/session-start.sh` to add:
  - the documentation exception (`.github/specs/**` and `docs/**` only, on `develop`; never on `main`)
  - the legacy PR exception
  - that guard files can't be edited while enforcement is on

  Replace "Never commit directly to main or develop" with the exception wording (contracts/hooks.md, SessionStart output).
- [x] T018 [US1] Implement naming, placeholder and protected-branch refusals for `git branch -m`, `checkout -b`, `switch -c`, `commit` and `push` in `.claude/hooks/enforce-branch-name.mjs` (done in #3524)
- [x] T019 [US1] Implement the GitHub MCP checks (`create_branch`, `push_files`, `create_or_update_file`, `delete_file`, `create_pull_request` including the `main` base rule) in `.claude/hooks/enforce-branch-name.mjs` (done in #3524)
- [ ] T020 [US1] Implement the documentation exception in `.claude/hooks/enforce-branch-name.mjs`:
  - collect paths for a commit (`git diff --cached --name-only`, plus `git diff --name-only` for `-a`/`--all`, plus paths from an earlier `git add` in the same command, where `-A`/`.`/`--all` means all of `git status --porcelain`)
  - collect paths for a push (`git diff --name-only origin/<target>...<source>`)
  - collect paths for an MCP write (`path` / `files[].path`)
  - allow only when every normalised path starts with `.github/specs/` or `docs/`
  - an empty or unknown set fails closed, and the refusal lists the offending files (research R4)
- [ ] T021 [US1] Implement the legacy PR exception in `.claude/hooks/enforce-branch-name.mjs`. On the refusal path only, for a non-compliant commit, push or MCP write branch, run `git ls-remote --exit-code --heads origin <branch>` and then `gh pr list --head <branch> --state open --json number --limit 1`, each with a 5-second timeout. Allow only when both confirm an open PR; any failure means refuse (FR-006, research R9).
- [ ] T022 [US1] Implement guard self-protection in `.claude/hooks/enforce-branch-name.mjs`:
  - for `Edit`/`Write`/`MultiEdit`/`NotebookEdit`: resolve `file_path`/`notebook_path` against the project directory, using `realpath` when the file exists
  - for Bash: detect write verbs (`sed -i`, `perl -i`, `mv`, `rm`, `cp` to the destination, `tee`, `truncate`, `chmod`, `ln`, `>`/`>>`, `git checkout … --`, `git restore`, `git rm`, `git mv`, `git apply`) that name a protected path
  - protected paths: `.claude/hooks/**`, `.claude/settings.json`, `.claude/settings.local.json`, `~/.claude/settings.json`
  - refuse while `LS_ENFORCE_BRANCH_NAMES` is not `0`; reads are allowed (FR-013a, research R12)
- [ ] T023 [US1] Implement the fault handler in `.claude/hooks/enforce-branch-name.mjs`:
  - on a caught error, classify without the validator: Bash matching `\bgit\b[^|;&]*\b(commit|push|branch|checkout|switch)\b`, or a matched GitHub MCP tool, gets exit 2 and "Branch guard unavailable: {error}. Open an issue on lightspeedwp/.github"
  - anything else gets exit 0 with a `systemMessage` warning
  - keep malformed-stdin handling silent (FR-012a, research R11)
- [ ] T024 [US1] Add `/.claude/ @ashleyshaw @lightspeedwp/lightspeed` to `CODEOWNERS` under the "AI and Copilot Instructions" block (FR-013a).
- [ ] T025 [US1] Run `npx jest scripts/__tests__/enforce-branch-name-hook.test.js scripts/__tests__/session-start-hook.test.js`, `shellcheck .claude/hooks/session-start.sh` and `npx eslint .claude/hooks/enforce-branch-name.mjs`. Fix everything until it's green.

**Checkpoint**: US1 is fully enforceable and tested. This is the MVP.

---

## Phase 4: User Story 2 - Every team member starts from the same environment (Priority: P2)

**Goal**: One shared **LightSpeed** environment, set as the organisation default, gives every session the same
toolchain and variables.

**Independent Test**: Two members start sessions without touching the selector. Both report the Node version from
`.nvmrc`, `shellcheck` and `actionlint` present, and `LS_BASE_BRANCH=develop` (quickstart §3, §4).

- [x] T026 [P] [US2] Create the setup script `.claude/cloud/setup.sh`. It installs Node from `.nvmrc` into `/opt/node<major>` symlinked from `/root/.local/bin`, `shellcheck` through apt and `actionlint` through `go install`, and sets system git defaults. It must exit 0 and finish in under 5 minutes (done in #3524).
- [x] T027 [P] [US2] Create `.claude/cloud/environment.env` with `LS_BASE_BRANCH=develop`, `LS_ENFORCE_BRANCH_NAMES=1`, `LS_NODE_VERSION`, npm quiet flags and locale. No secrets (done in #3524).
- [ ] T028 [US2] Owner action: create the shared **LightSpeed** environment in claude.ai admin settings → Cloud environments, with Trusted network access and the contents of `.claude/cloud/environment.env` and `.claude/cloud/setup.sh`. Set it as the organisation default at claude.ai/admin-settings/claude-code.
- [ ] T029 [US2] Optional, after T028: add `"remote": { "defaultEnvironmentId": "env_..." }` to `.claude/settings.json` with the shared environment's ID, for `claude --cloud` sessions.
- [ ] T030 [US2] Run quickstart §3 and §4 in a fresh cloud session, and record the results (the Node version, whether the tools are present, the branch behaviour) in the #3524 PR description.

**Checkpoint**: A new team member gets an identical, compliant session with no setup.

---

## Phase 5: User Story 3 - Configuration is documented, versioned and maintainable (Priority: P3)

**Goal**: The environment, guard and cleanup are documented and versioned, and the empty `claude/*` branches are
removed automatically.

**Independent Test**: Using only `docs/CLAUDE_CLOUD_ENVIRONMENT.md`, a maintainer recreates the environment and
passes every quickstart step. The spec 009 cleanup report auto-approves only empty `claude/*` branches
(quickstart §5).

- [x] T031 [P] [US3] Write `docs/CLAUDE_CLOUD_ENVIRONMENT.md`, covering the problem, the layers, Owner setup, usage, checks, maintenance and limitations (done in #3524).
- [ ] T032 [US3] Update `docs/CLAUDE_CLOUD_ENVIRONMENT.md` with:
  - the documentation exception
  - the legacy PR exception
  - that the guard applies in local sessions too
  - self-protection and the CODEOWNERS entry
  - the guard-unavailable behaviour
  - measurement (branch metrics plus the monthly review of 10 sessions, SC-007)
  - cleanup through spec 009's auto-approval
- [x] T033 [P] [US3] Spec 009 auto-approval rule, config, report fields and shared validator in `scripts/lib/branch-categorization.js`, `scripts/lib/constants.js` and `scripts/cleanup-branches.js` (spec 009 T070–T072 and T074, done in #3358)
- [ ] T034 [US3] Spec 009 T073, the daily auto-delete step in `.github/workflows/branch-audit.yml`, after spec 009 T046 creates the workflow (delivered in #3358 or its follow-up). Depends on #3358 merging.
- [ ] T035 [US3] Run quickstart §5 against `develop` once #3358 merges, and confirm the auto-approved list only contains merged `claude/*` branches with no open PR that are at least a day old.
- [x] T036 [US3] Add the CHANGELOG entry for the environment and guard (done in #3524).
- [ ] T037 [US3] Update the CHANGELOG entry in `CHANGELOG.md` under Unreleased/Added for the new guard behaviours. It must be 250 characters or less, linked to #3524, and pass `node scripts/validation/validate-changelog.cjs CHANGELOG.md`.

**Checkpoint**: Everything is documented and the cleanup is running.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T038 [P] Run `npm run lint:md` on changed Markdown and `npx prettier --check` on changed JS and JSON files, and fix any findings.
- [ ] T039 Run `/speckit-analyze` for 016 and resolve any CRITICAL or HIGH findings before marking #3524 ready for review.
- [ ] T040 Update the #3524 PR description with the final behaviour list and test evidence, then mark it ready for review.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 is independent (spec branch). T002 and T003 have no dependencies.
- **Foundational (Phase 2)**: T006 and T007 block all US1 rule implementation (T020–T023).
- **US1 (Phase 3)**: Needs Phase 2.
  - Tests T008–T014 are written first and should fail where behaviour is missing.
  - T020–T023 all edit the same file, so do them one after another.
- **US2 (Phase 4)**: Independent of US1 code. T028 is an Owner action. T030 needs T028 and ideally the US1 merge.
- **US3 (Phase 5)**:
  - T032 needs the US1 behaviour to be settled.
  - T034 and T035 depend on lightspeedwp/.github#3358 merging.
- **Polish (Phase 6)**: After the stories you intend to ship.

### User Story Dependencies

- **US1 (P1)**: None beyond Phase 2. This is the MVP.
- **US2 (P2)**: None in code. It depends on an Owner action.
- **US3 (P3)**: The docs depend on US1. The cleanup depends on spec 009 and #3358.

## Parallel Opportunities

- T002 and T003 (different test files).
- T008–T013 (independent `describe` blocks; if two people edit the file at once, merge them in order).
- T014 alongside T008–T013 (a different file).
- T026, T027 and T031 are done. T024 (CODEOWNERS) can run alongside any US1 task.

```text
# US1 tests, written together before implementation:
T008 naming/placeholder   T009 documentation exception   T010 legacy PR
T011 MCP                  T012 self-protection           T013 guard fault
T014 SessionStart (separate file)
```

## Implementation Strategy

### MVP first (User Story 1)

1. T001 (spec alignment) and T002 and T003 (test harness).
2. T006 and T007 (safe loading, wider matcher).
3. T008–T014 tests, then T016, T017 and T020–T024.
4. T025, which must be green. Push to #3524. **Stop and validate** with quickstart §1–§2.

### Incremental delivery

1. US1 → #3524 ready for review.
2. US2 → Owner creates the environment (T028), then verification (T030).
3. US3 → docs update (T032) in #3524, cleanup (T034 and T035) after #3358.
