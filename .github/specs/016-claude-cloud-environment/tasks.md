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
- [x] T002 [P] Create the black-box test harness in `scripts/__tests__/enforce-branch-name-hook.test.js`. It needs:
  - a helper that spawns `node .claude/hooks/enforce-branch-name.mjs` with a JSON payload `{ tool_name, tool_input, cwd }` on stdin
  - a temporary git repository fixture (`git init`, a `develop` branch, a bare `origin` remote)
  - a `PATH` stub for `gh`, so the open-PR result can be controlled
- [x] T003 [P] Create `scripts/__tests__/session-start-hook.test.js`. It runs `bash .claude/hooks/session-start.sh` with `CLAUDE_CODE_REMOTE` and `source` variants in a temporary repository, and asserts that stdout is a single valid JSON object.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The guard's skeleton, which every rule depends on.

**⚠️ CRITICAL**: Finish this phase before any US1 rule work.

- [x] T004 Register the SessionStart and PreToolUse hooks in `.claude/settings.json` (done in #3524)
- [x] T005 Create the guard skeleton in `.claude/hooks/enforce-branch-name.mjs`. It parses Bash commands (quote and here-document stripping, segment splitting, effective-branch tracking) and returns exit 2 with stderr when refusing (done in #3524).
- [x] T006 Restructure `.claude/hooks/enforce-branch-name.mjs` to load `lib/validate-branch-name.js` with a dynamic `await import()` inside a single `try` around all evaluation, so a load or internal error reaches the fault handler instead of crashing Node (research R11).
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

- [x] T008 [P] [US1] Add naming and placeholder cases to `scripts/__tests__/enforce-branch-name-hook.test.js`:
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
  - commit on `main` with only `docs/**` staged → exit 2 (no exception on `main`)
  - push to `main` (including `git push origin HEAD:main`) whose diff touches only `docs/**` → exit 2
  - MCP `push_files` to `main` with only `docs/` paths → exit 2
  - an empty or unknown path set → exit 2
- [ ] T010 [P] [US1] Add legacy PR exception cases to `scripts/__tests__/enforce-branch-name-hook.test.js`:
  - push to an existing remote `copilot/fix-login` with the `gh` stub returning an open PR → exit 0
  - `gh` returning `[]`, exiting non-zero or timing out → exit 2
  - commit on that branch with an open PR → exit 0
  - creating a new `copilot/*` branch → exit 2
  - the `gh` stub returning an open PR whose head is in a fork (`isCrossRepository: true`) → exit 2 (FR-006)
- [ ] T011 [P] [US1] Add GitHub MCP cases to `scripts/__tests__/enforce-branch-name-hook.test.js`:
  - `create_pull_request` from `feat/a-b` into `main` on `.github` → exit 2
  - head `claude/x-y` → exit 2
  - owner other than `lightspeedwp` → exit 0
  - `push_files` to `develop` with only `docs/` paths → exit 0
  - Bash `gh pr create --head claude/x-y` → exit 2, and `gh pr create --base main --head feat/a-b` on `.github` → exit 2 (FR-009, scenario 14)
  - Bash `gh api` writes to `repos/lightspeedwp/.github/contents/…` on `main` → exit 2 (FR-008)
- [ ] T012 [P] [US1] Add self-protection cases to `scripts/__tests__/enforce-branch-name-hook.test.js`:
  - `Edit` of `.claude/hooks/enforce-branch-name.mjs` → exit 2
  - `Write` to `.claude/settings.local.json` → exit 2
  - `sed -i … .claude/settings.json`, `rm .claude/hooks/x`, `echo {} > .claude/settings.json` and `git restore .claude/settings.json` → exit 2
  - `cat .claude/settings.json` → exit 0
  - every refusal with `LS_ENFORCE_BRANCH_NAMES=0` set in the hook's own environment → exit 0 plus a `systemMessage`
  - switch set inside the command, e.g. `LS_ENFORCE_BRANCH_NAMES=0 git commit -m x` or `export LS_ENFORCE_BRANCH_NAMES=0 && git commit -m x` on `chore/session-abc123`, with the hook environment enforcing → exit 2 (FR-013)
  - `Edit` of `.claude/settings.local.json` adding `"env": {"LS_ENFORCE_BRANCH_NAMES": "0"}` or `"disableAllHooks": true` → exit 2
  - `Write` to `~/.claude/settings.json` (resolved against `$HOME`) → exit 2
  - `Write` to `/etc/claude-code/managed-settings.json` → exit 2
  - `echo "> .claude/settings.json"` → exit 0 (redirection inside quotes, FR-012)
- [ ] T013 [P] [US1] Add guard-fault cases to `scripts/__tests__/enforce-branch-name-hook.test.js`, forcing the validator import to fail with `LS_GUARD_FORCE_FAULT=1` (honoured only when `NODE_ENV=test`):
  - `git commit` → exit 2, and stderr contains "Branch guard unavailable"
  - `git commit` with `LS_ENFORCE_BRANCH_NAMES=0` in the hook environment → exit 0, visible `systemMessage` warning, write proceeds
  - `ls` → exit 0 plus a `systemMessage` warning
  - `git switch develop` (an existing branch) → exit 0 plus a warning; `git branch -D x` → exit 2 (FR-012a branch operations)
  - MCP `create_pull_request` → exit 2
  - malformed stdin → exit 0, silent
- [x] T014 [P] [US1] Add SessionStart cases to `scripts/__tests__/session-start-hook.test.js`:
  - a fresh `claude/x-abc123` with 0 commits ahead → renamed to `chore/session-abc123` and not pushed
  - `claude/x-abc123` with its own commits → unchanged
  - on `compact` → no rename, but the context is still emitted
  - the context contains the documentation exception, the legacy PR exception, the protected-files note and "OVERRIDE"
  - on cloud `startup` and `resume`, `node_modules` missing with an old lockfile timestamp → `npm install` runs; with an installed tree newer than the lockfile, it is skipped
- [x] T041 [P] [US1] Add a speed test for SC-008 to `scripts/__tests__/enforce-branch-name-hook.test.js`: spawn the guard 20 times on normal-path calls that need no network check (`git status`, and `git commit -m x` on `feat/good-name`), and assert the median wall-clock time is 150 ms or less. Use the `gh` and `git ls-remote` `PATH` stubs to count calls, and assert neither runs on an allowed call; they run only on a write that would otherwise be refused (SC-008).

### Implementation for User Story 1

- [x] T015 [US1] Rename a forbidden-prefix branch to a local placeholder, sync fresh sessions with `origin/<LS_BASE_BRANCH>`, and skip `npm install` when current, in `.claude/hooks/session-start.sh` (done in #3524)
- [x] T016 [US1] Limit the rename in `.claude/hooks/session-start.sh` to branches where `git rev-list --count origin/${BASE_BRANCH}..HEAD` is `0`, and leave a forbidden-prefix branch that has commits unchanged (FR-001, research R10).
- [x] T017 [US1] Update the context text in `.claude/hooks/session-start.sh` to add:
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
  - apply the exception only when the target is the configured base branch (`LS_BASE_BRANCH`, default `develop`); never for `main`, which is always refused (FR-005, FR-006, FR-008)
  - allow only when every normalised path starts with `.github/specs/` or `docs/`
  - normalise each path to repository-relative form (resolve `.`, `..` and, for existing files, symlinks) and compare case-sensitively; a path that leaves the allowed folders is not covered (FR-005)
  - an empty or unknown set fails closed, and the refusal lists the offending files (research R4)
  - judge commits during a rebase, merge, cherry-pick or revert by the branch being worked on; refuse a commit on a detached HEAD with none in progress; judge refspec pushes by their target; allow force-pushes to a compliant, unprotected branch (FR-005, FR-006)
- [ ] T021 [US1] Implement the legacy PR exception in `.claude/hooks/enforce-branch-name.mjs`. On the refusal path only, for a non-compliant commit, push or MCP write branch, run `git ls-remote --exit-code --heads origin <branch>` and then `gh pr list --head <branch> --state open --json number,isCrossRepository --limit 1`, each with a 5-second timeout. Allow only when both confirm an open PR whose head is in this repository; any error, non-zero exit, empty result or timeout means refuse (FR-006, research R9).
- [ ] T022 [US1] Implement guard self-protection in `.claude/hooks/enforce-branch-name.mjs`:
  - for `Edit`/`Write`/`MultiEdit`/`NotebookEdit`: resolve `file_path`/`notebook_path` against the project directory, using `realpath` when the file exists
  - for Bash: detect write verbs (`sed -i`, `perl -i`, `mv`, `rm`, `cp` to the destination, `tee`, `truncate`, `chmod`, `ln`, `>`/`>>`, `git checkout … --`, `git restore`, `git rm`, `git mv`, `git apply`) that name a protected path
  - protected paths: `.claude/hooks/**`, `.claude/settings.json`, `.claude/settings.local.json`, `~/.claude/settings.json`, `/etc/claude-code/managed-settings.json`
  - evaluate redirection operators outside quotes only (FR-012)
  - refuse while `LS_ENFORCE_BRANCH_NAMES` is not `0`; reads are allowed (FR-013a, research R12)
- [ ] T023 [US1] Implement the fault handler in `.claude/hooks/enforce-branch-name.mjs`:
  - on a caught error with enforcement on, classify without the validator: Bash `git commit`, `git push`, a branch operation that creates, renames, deletes or force-resets a branch (`git branch -m/-M/-d/-D/-f`, `checkout -b/-B`, `switch -c/-C`), `gh pr create` or a `gh api` write, or a matched GitHub MCP tool, gets exit 2 and "Branch guard unavailable: {error}. Open an issue on lightspeedwp/.github"
  - anything else gets exit 0 with a `systemMessage` warning
  - when enforcement is off, downgrade the fault refusal to a visible `systemMessage` warning and allow the write with exit 0 (FR-013)
  - keep malformed-stdin handling silent (FR-012a, research R11)
- [ ] T044 [US1] Police the `gh` command-line tool in `.claude/hooks/enforce-branch-name.mjs`: apply the `create_pull_request` rules to Bash `gh pr create` (head from `--head` or the current branch, base from `--base`, repository from `--repo` or `origin`), and the MCP file-write rules to `gh api` calls that create or update refs, file contents or PRs. Owners other than `lightspeedwp` are ignored (FR-008, FR-009, scenario 14).
- [ ] T045 [US1] Update the protected-files list in the `.claude/hooks/session-start.sh` context text and `scripts/__tests__/session-start-hook.test.js` to add `/etc/claude-code/managed-settings.json` (FR-013a).
- [ ] T046 [US1] Make every enforcing refusal start with "Branch guard:", so the SC-007 transcript search for "Branch guard" finds refusals as well as warnings, and suggest a name only when the validator's suggestion itself passes the validator (FR-011, SC-007). Add both to the refusal-message test.
- [ ] T024 [US1] Add `/.claude/ @ashleyshaw @lightspeedwp/lightspeed` to `CODEOWNERS` under the "AI and Copilot Instructions" block (FR-013a).
- [ ] T025 [US1] Run `npx jest -c .jest.config.cjs scripts/__tests__/enforce-branch-name-hook.test.js scripts/__tests__/session-start-hook.test.js` (including the T041 speed test), `shellcheck .claude/hooks/session-start.sh` and `npx eslint .claude/hooks/enforce-branch-name.mjs`. Fix everything until it's green.

**Checkpoint**: US1 is fully enforceable and tested. This is the MVP.

---

## Phase 4: User Story 2 - Every team member starts from the same environment (Priority: P2)

**Goal**: One shared **LightSpeed** environment, set as the organisation default, gives sessions without a saved
environment selection the same toolchain and variables.

**Independent Test**: Two members without saved selections start sessions without touching the selector. Both
report the Node version from `.nvmrc`, `shellcheck`, `actionlint` and authenticated `gh` available, and
`LS_BASE_BRANCH=develop`. A member with a saved selection confirms their choice persists (quickstart §3, §4).

- [ ] T026 [P] [US2] Update the existing setup script `.claude/cloud/setup.sh` (initial version in #3524) to install or confirm `gh` alongside Node from `.nvmrc`, `shellcheck` and `actionlint`, and retain the system git defaults. It must exit 0, finish in under 5 minutes and be safe to rerun. Cloud hook sessions must have proxy-authenticated `gh`; local hook sessions need an authenticated developer `gh` login.
- [x] T027 [P] [US2] Create `.claude/cloud/environment.env` with `LS_BASE_BRANCH=develop`, `LS_ENFORCE_BRANCH_NAMES=1`, `LS_NODE_VERSION`, npm quiet flags and locale. No secrets (done in #3524).
- [ ] T028 [US2] Owner action: create the shared **LightSpeed** environment in claude.ai admin settings → Cloud environments, with Trusted network access and the contents of `.claude/cloud/environment.env` and `.claude/cloud/setup.sh`. Set it as the organisation default at claude.ai/admin-settings/claude-code; this applies when members have no saved selection and does not override their choice.
- [ ] T029 [US2] Optional, after T028: add `"remote": { "defaultEnvironmentId": "env_..." }` to `.claude/settings.json` with the shared environment's ID, for `claude --cloud` sessions.
- [ ] T030 [US2] Run quickstart §3 and §4 in a fresh cloud session. Record the selected environment, Node version, tool availability, cloud `gh auth status` and branch behaviour in the #3524 PR description. In a local session, confirm `gh` is installed and `gh auth status` succeeds with the developer's login.

**Checkpoint**: A new team member without a saved selection gets an identical, compliant session with no setup.

---

## Phase 5: User Story 3 - Configuration is documented, versioned and maintainable (Priority: P3)

**Goal**: The environment, guard and cleanup are documented and versioned, and the empty `claude/*` branches are
removed automatically.

**Independent Test**: Using only `docs/CLAUDE_CLOUD_ENVIRONMENT.md`, a maintainer recreates the environment and
passes every quickstart step. The spec 009 cleanup report auto-approves only empty `claude/*` branches
(quickstart §5).

- [x] T031 [P] [US3] Write `docs/CLAUDE_CLOUD_ENVIRONMENT.md`, covering the problem, the layers, Owner setup, usage, checks, maintenance and limitations (done in #3524).
- [ ] T032 [US3] Update `docs/CLAUDE_CLOUD_ENVIRONMENT.md` with:
  - the documentation exception, on `develop` only (every direct commit or push to `main` is refused)
  - the legacy PR exception
  - that the guard applies in local sessions too
  - the threat model (accidents plus obvious self-bypasses; CI and CODEOWNERS are the final gate)
  - that the enforcement switch is read only from the environment a session starts with, and can't be changed from inside the session
  - the four protected files: `.claude/hooks/**`, `.claude/settings.json`, `.claude/settings.local.json` and `~/.claude/settings.json`
  - self-protection, the CODEOWNERS entry, and the required "Require review from Code Owners" setting on `develop` and `main`
  - the guard's speed target (150 ms or less per call; the legacy PR check runs only when a write would otherwise be refused, SC-008)
  - the guard-unavailable behaviour, and which commands count as git writes during a fault
  - who may turn the switch off and where, the defaults (`LS_ENFORCE_BRANCH_NAMES` unset means on, `LS_BASE_BRANCH` unset means `develop`), and that turning it off leaves no record
  - known limitations: the guard fails open if Node is missing, and pushes from renamed branches depend on the platform's push protection
  - the fifth protected file, `/etc/claude-code/managed-settings.json`
  - the emergency procedure: with enforcement off in a new session, guard faults warn and allow writes; with enforcement on, they block git and GitHub writes
  - measurement (branch metrics plus the monthly review of 10 sessions, SC-007)
  - cleanup through spec 009's auto-approval
- [x] T033 [P] [US3] Spec 009 auto-approval rule, config, report fields and shared validator in `scripts/lib/branch-categorization.js`, `scripts/lib/constants.js` and `scripts/cleanup-branches.js` (spec 009 T070–T072 and T074, done in #3358)
- [ ] T034 [US3] Spec 009 T073, the daily auto-delete step in `.github/workflows/branch-audit.yml`, after spec 009 T046 creates the workflow (delivered in #3358 or its follow-up). Depends on #3358 merging.
- [ ] T035 [US3] Run quickstart §5 against `develop` once #3358 merges, and confirm the auto-approved list only contains merged `claude/*` branches with no open PR that are at least a day old.
- [x] T036 [US3] Add the CHANGELOG entry for the environment and guard (done in #3524).
- [ ] T037 [US3] Update the CHANGELOG entry in `CHANGELOG.md` under Unreleased/Added for the new guard behaviours. It must be 250 characters or less, linked to #3524, and pass `node scripts/validation/validate-changelog.cjs CHANGELOG.md`.
- [ ] T042 [US3] Owner action: turn on "Require review from Code Owners" in branch protection (or the ruleset) for both `develop` and `main`, so the `/.claude/` CODEOWNERS entry from T024 blocks unreviewed changes to the guard (FR-013a, US3 scenario 3).
- [ ] T043 [US3] After T042, run quickstart §4 step 7 and record both `true` results in the #3524 PR description. Add the same check to the Owner setup and verification sections of `docs/CLAUDE_CLOUD_ENVIRONMENT.md`.

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
  - Tests T008–T014 and T041 are written first and should fail where behaviour is missing.
  - T020–T023 all edit the same file, so do them one after another.
- **US2 (Phase 4)**: Independent of US1 code. T028 is an Owner action. T030 needs T028 and ideally the US1 merge.
- **US3 (Phase 5)**:
  - T032 needs the US1 behaviour to be settled.
  - T042 is an Owner action that needs T024 merged. T043 needs T042.
  - T034 and T035 depend on lightspeedwp/.github#3358 merging.
- **Polish (Phase 6)**: After the stories you intend to ship.

### User Story Dependencies

- **US1 (P1)**: None beyond Phase 2. This is the MVP.
- **US2 (P2)**: None in code. It depends on an Owner action.
- **US3 (P3)**: The docs depend on US1. The Code Owners check depends on an Owner action (T042). The cleanup depends on spec 009 and #3358.

## Parallel Opportunities

- T002 and T003 (different test files).
- T008–T013 and T041 (independent `describe` blocks; if two people edit the file at once, merge them in order).
- T014 alongside T008–T013 (a different file).
- T027 and T031 are done. T026 (setup script) and T024 (CODEOWNERS) can run alongside any US1 task.

```text
# US1 tests, written together before implementation:
T008 naming/placeholder   T009 documentation exception   T010 legacy PR
T011 MCP                  T012 self-protection           T013 guard fault
T041 SC-008 speed        T014 SessionStart (separate file)
```

## Implementation Strategy

### MVP first (User Story 1)

1. T001 (spec alignment) and T002 and T003 (test harness).
2. T006 and T007 (safe loading, wider matcher).
3. T008–T014 and T041 tests, then T016, T017 and T020–T024.
4. T025, which must be green. Push to #3524. **Stop and validate** with quickstart §1–§2.

### Incremental delivery

1. US1 → #3524 ready for review.
2. US2 → Owner creates the environment (T028), then verification (T030).
3. US3 → docs update (T032) in #3524, Code Owners setting (T042, T043) after T024 merges, cleanup (T034 and T035) after #3358.
