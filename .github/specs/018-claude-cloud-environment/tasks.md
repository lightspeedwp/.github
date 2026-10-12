---
description: "Task list for 018 Standardised Claude Code Cloud Environment"
---

# Tasks: Standardised Claude Code Cloud Environment

**Input**: Design documents from `.github/specs/018-claude-cloud-environment/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: The plan and quickstart ask for them, so they're included. They are black-box Jest contract tests that
spawn the hook with JSON on stdin.

**Where the work lands**:

- US1 and US2 shipped in `config/claude-cloud-environment` (lightspeedwp/.github#3524, merged 2026-09-30).
- Spec reconciliation and the convergence work that doesn't touch the guard's files go in
  `docs/claude-cloud-spec-reconcile` (lightspeedwp/.github#3726, closes lightspeedwp/.github#3727).
- Guard follow-ups (T045, T049, T052, T054, T055 and the guard halves of T056 and T058) go in a separate guard PR,
  made by a person or in a session an Owner starts with `LS_ENFORCE_BRANCH_NAMES=0`.
- The US3 cleanup work goes in spec 009 / `task/branch-cleanup-refactor` (lightspeedwp/.github#3358).
- The spec amendment (T001) went in `docs/claude-cloud-environment-spec` (lightspeedwp/.github#3525).
- The organisation-wide rollout (Phase 12) is planned in `docs/cloud-env-org-rollout` (lightspeedwp/.github#3878). The
  hook half (T070, T071) goes in a guard PR made by a person or in a session an Owner starts with
  `LS_ENFORCE_BRANCH_NAMES=0`.
- The Linear issue close-out (Phase 13) maps GIT-2532, GIT-2530, GIT-2581, GIT-2571, GIT-2514 and the epic GIT-2524 to
  tasks. Most of it is documentation and housekeeping.

**Task labels (refreshed 2026-10-12)**: every open task carries one label so `/speckit-implement` knows who does it.
`[Agent]` is work Claude can do. `[Guard-protected]` is work in `.claude/hooks/**`, which the guard protects, so a
person or an Owner session started with `LS_ENFORCE_BRANCH_NAMES=0` does it. `[Owner]` is the admin console, branch
protection, the team announcement, evidence runs and Linear or GitHub housekeeping. `[Superseded]` and
`[Out of scope]` mark tasks that `/speckit-implement` must skip (T029 and T034). Some `[Agent]` tasks are blocked until
something else happens (T073, T079 and T081). Each phase's "Execution split" names the blocker, and
`/speckit-implement` must skip a blocked task until it clears.

A task is ticked only once its change is on `develop` or in the PR that delivers this spec's reconciliation
(#3726). This reconciliation preserves every existing tick, T033 included. New work delivered on #3358 is noted
against its task and ticked when #3358 merges; T033's status is revisited once T053 lands (see T060). This keeps the baseline
for `/speckit-converge` and `/speckit-implement` accurate (refreshed 2026-10-02).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on unfinished tasks)
- **[Story]**: The user story the task belongs to (US1, US2 or US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align the spec with the plan, and put the test harness in place.

- [x] T001 Amend FR-013a in `.github/specs/018-claude-cloud-environment/spec.md` so the protected guard files also include `.claude/settings.local.json` and `~/.claude/settings.json`, which can disable hooks (research R12). Update the matching clarification bullet, acceptance scenario 11 and edge case.
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
- [x] T007 Extend the PreToolUse matcher in `.claude/settings.json` to `Bash|Edit|Write|MultiEdit|NotebookEdit|mcp__github__(create_branch|create_pull_request|push_files|create_or_update_file|delete_file)`, as in `contracts/hooks.md`.

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
- [x] T009 [P] [US1] Add documentation-exception cases to `scripts/__tests__/enforce-branch-name-hook.test.js`:
  - commit on `develop` with only `docs/**` and `.github/specs/**` staged → exit 0
  - with any other file staged → exit 2, and stderr lists the file
  - `git add package.json && git commit` on `develop` → exit 2
  - push to `develop` whose diff touches only allowed paths → exit 0
  - commit on `main` with only `docs/**` staged → exit 2 (no exception on `main`)
  - push to `main` (including `git push origin HEAD:main`) whose diff touches only `docs/**` → exit 2
  - MCP `push_files` to `main` with only `docs/` paths → exit 2
  - an empty or unknown path set → exit 2
- [x] T010 [P] [US1] Add legacy PR exception cases to `scripts/__tests__/enforce-branch-name-hook.test.js`:
  - push to an existing remote `copilot/fix-login` with the `gh` stub returning an open PR → exit 0
  - `gh` returning `[]`, exiting non-zero or timing out → exit 2
  - commit on that branch with an open PR → exit 0
  - creating a new `copilot/*` branch → exit 2
  - the `gh` stub returning an open PR whose head is in a fork (`head.repo.full_name` differs from `base.repo.full_name`) → exit 2 (FR-006)
- [x] T011 [P] [US1] Add GitHub MCP cases to `scripts/__tests__/enforce-branch-name-hook.test.js`:
  - `create_pull_request` from `feat/a-b` into `main` on `.github` → exit 2
  - head `claude/x-y` → exit 2
  - owner other than `lightspeedwp` → exit 0
  - `push_files` to `develop` with only `docs/` paths → exit 0
  - Bash `gh pr create --head claude/x-y` → exit 2, and `gh pr create --base main --head feat/a-b` on `.github` → exit 2 (FR-009, scenario 14)
  - Bash `gh api` writes to `repos/lightspeedwp/.github/contents/…` on `main` → exit 2 (FR-008)
- [x] T012 [P] [US1] Add self-protection cases to `scripts/__tests__/enforce-branch-name-hook.test.js`:
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
- [x] T013 [P] [US1] Add guard-fault cases to `scripts/__tests__/enforce-branch-name-hook.test.js`, forcing the validator import to fail with `LS_GUARD_FORCE_FAULT=1` (honoured only when `NODE_ENV=test`):
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
- [x] T020 [US1] Implement the documentation exception in `.claude/hooks/enforce-branch-name.mjs`:
  - collect paths for a commit (`git diff --cached --name-only`, plus `git diff --name-only` for `-a`/`--all`, plus paths from an earlier `git add` in the same command, where `-A`/`.`/`--all` means all of `git status --porcelain`)
  - collect paths for a push (`git diff --name-only origin/<target>...<source>`)
  - collect paths for an MCP write (`path` / `files[].path`)
  - apply the exception only when the target is the configured base branch (`LS_BASE_BRANCH`, default `develop`); never for `main`, which is always refused (FR-005, FR-006, FR-008)
  - allow only when every normalised path starts with `.github/specs/` or `docs/`
  - normalise each path to repository-relative form (resolve `.`, `..` and, for existing files, symlinks) and compare case-sensitively; a path that leaves the allowed folders is not covered (FR-005)
  - an empty or unknown set fails closed, and the refusal lists the offending files (research R4)
  - judge commits during a rebase, merge, cherry-pick or revert by the branch being worked on; refuse a commit on a detached HEAD with none in progress; judge refspec pushes by their target; allow force-pushes to a compliant, unprotected branch (FR-005, FR-006)
- [x] T021 [US1] Implement the legacy PR exception in `.claude/hooks/enforce-branch-name.mjs`. On the refusal path only, for a non-compliant commit, push or MCP write branch, run `git ls-remote --exit-code --heads origin <branch>` and then `gh api repos/{owner}/{repo}/pulls?head={owner}:<branch>&state=open&per_page=1` (REST, because cloud sessions can't use GraphQL), each with a 5-second timeout. Allow only when both confirm an open PR whose head is in this repository; any error, non-zero exit, empty result or timeout means refuse (FR-006, research R9).
- [x] T022 [US1] Implement guard self-protection in `.claude/hooks/enforce-branch-name.mjs`:
  - for `Edit`/`Write`/`MultiEdit`/`NotebookEdit`: resolve `file_path`/`notebook_path` against the project directory, using `realpath` when the file exists
  - for Bash: detect write verbs (`sed -i`, `perl -i`, `mv`, `rm`, `cp` to the destination, `tee`, `truncate`, `chmod`, `ln`, `>`/`>>`, `git checkout … --`, `git restore`, `git rm`, `git mv`, `git apply`) that name a protected path
  - protected paths: `.claude/hooks/**`, `.claude/settings.json`, `.claude/settings.local.json`, `~/.claude/settings.json`, `/etc/claude-code/managed-settings.json`
  - evaluate redirection operators outside quotes only (FR-012)
  - refuse while `LS_ENFORCE_BRANCH_NAMES` is not `0`; reads are allowed (FR-013a, research R12)
- [x] T023 [US1] Implement the fault handler in `.claude/hooks/enforce-branch-name.mjs`:
  - on a caught error with enforcement on, classify without the validator: Bash `git commit`, `git push`, a branch operation that creates, renames, deletes or force-resets a branch (`git branch -m/-M/-d/-D/-f`, `checkout -b/-B`, `switch -c/-C`), `gh pr create` or a `gh api` write, or a matched GitHub MCP tool, gets exit 2 and "Branch guard unavailable: {error}. Open an issue on lightspeedwp/.github"
  - anything else gets exit 0 with a `systemMessage` warning
  - when enforcement is off, downgrade the fault refusal to a visible `systemMessage` warning and allow the write with exit 0 (FR-013)
  - keep malformed-stdin handling silent (FR-012a, research R11)
- [x] T044 [US1] Police the `gh` command-line tool in `.claude/hooks/enforce-branch-name.mjs`: apply the `create_pull_request` rules to Bash `gh pr create` (head from `--head` or the current branch, base from `--base`, repository from `--repo` or `origin`), and the MCP file-write rules to `gh api` calls that create or update refs, file contents or PRs. Owners other than `lightspeedwp` are ignored (FR-008, FR-009, scenario 14).
- [x] T045 [US1] Update the protected-files list in the `.claude/hooks/session-start.sh` context text and `scripts/__tests__/session-start-hook.test.js` to add `/etc/claude-code/managed-settings.json` (FR-013a).
- [x] T046 [US1] Make every enforcing refusal start with "Branch guard:", so the SC-007 transcript search for "Branch guard" finds refusals as well as warnings, and suggest a name only when the validator's suggestion itself passes the validator (FR-011, SC-007). Add both to the refusal-message test.
- [x] T050 [P] [US1] Add an SC-005 case to `scripts/__tests__/session-start-hook.test.js`: run `session-start.sh` as a cloud `startup` with dependencies already current (installed tree newer than the lockfile, `npm` stubbed, local `origin`) and assert it exits 0 within 30 seconds of wall-clock time and doesn't call `npm install` (SC-005).
- [x] T049 [US1] Limit the guard's protected-branch rules, documentation exception and `main` base rule in `.claude/hooks/enforce-branch-name.mjs` to `lightspeedwp/.github`. On other `lightspeedwp` repositories (MCP tools, `gh pr create`, `gh api`), check names (branch creation, the target branch of file writes, and PR heads) and refuse direct writes to `main`, which FR-009 protects on every LightSpeed repository (2026-10-01). Add cases to `scripts/__tests__/enforce-branch-name-hook.test.js`: `push_files` to `main` on `lightspeedwp/other` → exit 2; `push_files` to `develop` on `lightspeedwp/other` → exit 0 (base-branch protection applies only to this repository); to `claude/x` on `lightspeedwp/other` → exit 2; a PR from `feat/a-b` into `main` on `lightspeedwp/other` → exit 0 (FR-009 scope).
- [x] T051 [US1] Fix the shell-parsing and session-start gaps from the CodeRabbit review of #3524 (research R14) in `.claude/hooks/enforce-branch-name.mjs`, `.claude/hooks/session-start.sh`, `.github/workflows/claude-guard-tests.yml` and `docs/CLAUDE_CLOUD_ENVIRONMENT.md`, with tests: `cat <<'EOF' > .claude/settings.json` → exit 2; `git push origin feat/good-name main` and `git push --tags origin main` → exit 2; `git push --tags` → exit 0; `--all`, `--branches` and `--mirror` → exit 2; a clean `main` is never hard-reset; `package.json` newer than the installed tree runs `npm install`; the CI filter also matches `package.json`, `package-lock.json`, `.nvmrc` and `.jest.config.cjs`.
- [x] T024 [US1] Add `/.claude/ @ashleyshaw @lightspeedwp/lightspeed` to `CODEOWNERS` under the "AI and Copilot Instructions" block (FR-013a).
- [x] T025 [US1] Run `npx jest -c .jest.config.cjs scripts/__tests__/enforce-branch-name-hook.test.js scripts/__tests__/session-start-hook.test.js` (including the T041 speed test), `shellcheck .claude/hooks/session-start.sh` and `npx eslint .claude/hooks/enforce-branch-name.mjs`. Fix everything until it's green.

**Checkpoint**: US1 is fully enforceable and tested. This is the MVP.

---

## Phase 4: User Story 2 - Every team member starts from the same environment (Priority: P2)

**Goal**: One shared **LightSpeed** environment, set as the organisation default, gives sessions without a saved
environment selection the same toolchain and variables.

**Independent Test**: Two members without saved selections start sessions without touching the selector. Both
report the Node version from `.nvmrc`, `shellcheck`, `actionlint` and authenticated `gh` available, and
`LS_BASE_BRANCH=develop`. A member with a saved selection confirms their choice persists (quickstart §3, §4).

- [x] T026 [P] [US2] Update the existing setup script `.claude/cloud/setup.sh` (initial version in #3524) to install or confirm `gh` alongside Node from `.nvmrc`, `shellcheck` and `actionlint`, and retain the system git defaults. It must exit 0, finish in under 5 minutes and be safe to rerun. Cloud hook sessions must have proxy-authenticated `gh`; local hook sessions need an authenticated developer `gh` login.
- [x] T027 [P] [US2] Create `.claude/cloud/environment.env` with `LS_BASE_BRANCH=develop`, `LS_ENFORCE_BRANCH_NAMES=1`, `LS_NODE_VERSION`, npm quiet flags and locale. No secrets (done in #3524).
- [ ] T028 [US2] [Owner] Owner action (US2 scenario 1, FR-019): create the shared **LightSpeed** environment in claude.ai admin settings → Cloud environments, with Trusted network access and the contents of `.claude/cloud/environment.env` and `.claude/cloud/setup.sh`. Set it as the organisation default at claude.ai/admin-settings/claude-code; this applies when members have no saved selection and does not override their choice.
- [ ] T029 [US2] [Superseded] **Superseded by FR-026 and T075 (2026-10-12): do not implement.** The CLI default is delivered through server-managed settings, so `.claude/settings.json` isn't edited. Original text: Optional, after T028: add `"remote": { "defaultEnvironmentId": "env_..." }` to `.claude/settings.json` with the shared environment's ID, for `claude --cloud` sessions.
  - Superseded by T075 (2026-10-09, research R20): deliver the key through server-managed settings instead. Do this only as a fallback.
- [ ] T030 [US2] [Owner] (SC-004) Run quickstart §3 and §4 in a fresh cloud session. Record the selected environment, Node version, tool availability, cloud `gh auth status` and branch behaviour in the evidence report `.github/reports/audit/claude-cloud-rollout-2026-10.md` (#3524 is merged, so its description is no longer the target; T077 uses the same report). In a local session, confirm `gh` is installed and `gh auth status` succeeds with the developer's login.

**Checkpoint**: A new team member without a saved selection gets an identical, compliant session with no setup.

---

## Phase 5: User Story 3 - Configuration is documented, versioned and maintainable (Priority: P3)

**Goal**: The environment, guard and cleanup are documented and versioned. Empty `claude/*` branches follow spec
009's cleanup route: auto-deletion is deferred under FR-020, and a maintainer may promote an empty, merged one from
DISCUSS to DELETE for the draft-PR approval (FR-021).

**Independent Test**: Using only `docs/CLAUDE_CLOUD_ENVIRONMENT.md`, a maintainer recreates the environment and
passes every quickstart step. The spec 009 cleanup report auto-approves nothing while FR-020's deferral holds,
and every `claude/*` branch without an open PR goes to DISCUSS (quickstart §5).

- [x] T031 [P] [US3] Write `docs/CLAUDE_CLOUD_ENVIRONMENT.md`, covering the problem, the layers, Owner setup, usage, checks, maintenance and limitations (done in #3524).
- [x] T032 [US3] Update `docs/CLAUDE_CLOUD_ENVIRONMENT.md` with:
  - the documentation exception, on `develop` only (every direct commit or push to `main` is refused)
  - the legacy PR exception
  - that the guard applies in local sessions too
  - the threat model (accidents plus obvious self-bypasses; CI and CODEOWNERS are the final gate)
  - that the enforcement switch is read only from the environment a session starts with, and can't be changed from inside the session
  - the five protected files: `.claude/hooks/**`, `.claude/settings.json`, `.claude/settings.local.json`, `~/.claude/settings.json` and `/etc/claude-code/managed-settings.json`
  - self-protection, the CODEOWNERS entry, and the required "Require review from Code Owners" setting on `develop` and `main`
  - the guard's speed target (150 ms or less per call; the legacy PR check runs only when a write would otherwise be refused, SC-008)
  - the guard-unavailable behaviour, and which commands count as git writes during a fault
  - who may turn the switch off and where, the defaults (`LS_ENFORCE_BRANCH_NAMES` unset means on, `LS_BASE_BRANCH` unset means `develop`), and that turning it off leaves no record
  - known limitations: the guard fails open if Node is missing, and pushes from renamed branches depend on the platform's push protection
  - the fifth protected file, `/etc/claude-code/managed-settings.json`
  - the emergency procedure: with enforcement off in a new session, guard faults warn and allow writes; with enforcement on, they block git and GitHub writes
  - measurement (branch metrics plus the monthly review of 10 sessions, SC-007)
  - cleanup through spec 009's report-only audit, with auto-approval deferred under FR-020
- [x] T033 [P] [US3] Report-only scope: spec 009's shared categoriser, report fields and shared validator in `scripts/lib/branch-categorization.js`, `scripts/lib/constants.js` and `scripts/cleanup-branches.js` (spec 009 T071, T072 and T074, done in #3358). The `claude/*` auto-approval rule is NOT part of this task's completed scope: it is deferred under FR-020 and blocked on branch-age and branch-origin signals, tracked by T034.
  - Note (T060, 2026-10-05): #3358 is merged (`2261125c89`). Its report-only CLI and categoriser are on `develop`, but the `claude/*` auto-approval rule is not: under FR-020 it stays switched off until a branch-age signal exists, and spec 009 T070 removed its constants. The shared validator (T074), the `autoApproved` report fields (T072) and the shared categoriser are delivered; the auto-approval rule itself is not.
- [ ] T034 [US3] [Out of scope] **Out of scope for spec 018 (2026-10-12): `/speckit-implement` skips it.** Spec 009 owns it (T073, after T046) and it stays blocked on the branch-age and branch-origin signals under FR-020. Original text: Spec 009 T073, the daily auto-delete step in `.github/workflows/branch-audit.yml`, after spec 009 T046 creates the workflow. #3358 is merged but did not deliver `branch-audit.yml`: T046 is still open in spec 009, and T073 is deferred under FR-020 until branch-age and branch-origin signals exist. Blocked on both.
- [x] T035 [US3] Run quickstart §5 against `develop` once #3358 merges. Done 2026-10-05 against `2261125c89`: 415 remote branches, 0 deletion candidates, 0 `autoApproved`, 11 open-PR branches kept, `main` and `develop` kept, 48 forbidden-prefix and 21 invalid-name branches sent to DISCUSS. While the FR-020 deferral holds, confirm the auto-approved list is empty (`[]`) and every `claude/*` branch without an open PR or matching exclusion is DISCUSS for its forbidden prefix. Repeat the original check (only platform placeholders with no commits of their own and no open PR, observable for at least a day) only after the deferral is lifted.
- [x] T036 [US3] Add the CHANGELOG entry for the environment and guard (done in #3524).
- [x] T037 [US3] Update the CHANGELOG entry in `CHANGELOG.md` under Unreleased/Added for the new guard behaviours. It must be 250 characters or less, linked to #3524, and pass `node scripts/validation/validate-changelog.cjs CHANGELOG.md`.
- [ ] T042 [US3] [Owner] Owner action: turn on "Require review from Code Owners" in branch protection (or the ruleset) for both `develop` and `main`, so the `/.claude/` CODEOWNERS entry from T024 blocks unreviewed changes to the guard (FR-013a, US3 scenario 3).
- [ ] T043 [US3] [Owner] (FR-013a, FR-019) After T042, run quickstart §4 step 7 and record both `true` results in the evidence report `.github/reports/audit/claude-cloud-rollout-2026-10.md` (#3524 is merged). Add the same check to the Owner setup and verification sections of `docs/CLAUDE_CLOUD_ENVIRONMENT.md`.
- [x] T047 [US3] Add a workflow (for example `.github/workflows/claude-guard-tests.yml`, actions pinned by SHA, read-only permissions) that runs `npx jest -c .jest.config.cjs scripts/__tests__/enforce-branch-name-hook.test.js scripts/__tests__/session-start-hook.test.js tests/js/claude-cloud-environment-docs.test.js` on PRs that change `.claude/**`, those tests or `.github/specs/018-claude-cloud-environment/**`, with `jq` and `git` available. It must pass `actionlint` (FR-023).
- [ ] T048 [US3] [Owner] Owner action: after T047 merges, mark its check as required in branch protection (or the ruleset) for `develop` and `main`, and add the step to the Owner setup and verification sections of `docs/CLAUDE_CLOUD_ENVIRONMENT.md` (FR-023, FR-019, US3 scenario 7).

**Checkpoint**: Everything is documented, and the cleanup report runs report-only with auto-deletion deferred under FR-020.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T038 [P] Run `npm run lint:md` on changed Markdown and `npx prettier --check` on changed JS and JSON files, and fix any findings.
- [x] T039 Run `/speckit-analyze` for 018 and resolve any CRITICAL or HIGH findings before #3726 is approved. Done 2026-10-02: no CRITICAL findings, and the HIGH findings I1 (T049), I2 (quickstart §5, T035) and I3 (plan) are resolved in #3726.
- [x] T040 Update the #3726 PR description with the final behaviour list and test evidence once its review comments are resolved, and confirm #3727 is linked to close on merge.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 is independent (spec branch). T002 and T003 have no dependencies.
- **Foundational (Phase 2)**: T006 and T007 block all US1 rule implementation (T020–T023).
- **US1 (Phase 3)**: Needs Phase 2.
  - Tests T008–T014 and T041 are written first and should fail where behaviour is missing.
  - T020–T023 all edit the same file, so do them one after another.
  - Once T007 and T022 are live, the guard refuses the agent's own edits to `.claude/hooks/**` and the settings
    files while enforcement is on (FR-013a). So T021, T045, T049, T050 and T051 are delivered as one change that
    an Owner applies (or a session an Owner starts with `LS_ENFORCE_BRANCH_NAMES=0`), never by the agent
    working around the guard.
- **US2 (Phase 4)**: Independent of US1 code. T028 is an Owner action. T030 needs T028 and ideally the US1 merge.
- **US3 (Phase 5)**:
  - T032 needs the US1 behaviour to be settled.
  - T042 is an Owner action that needs T024 merged. T043 needs T042.
  - T034, T035 and T063 depend on lightspeedwp/.github#3358 merging. T034 also waits for the FR-020 deferral to
    be lifted.
  - T061, T062 and T064 are documentation only (done in #3726).
  - T065 depends on merge order. If #3726 merges before #3358, qualify the cleanup note. If #3358 merges first,
    tick T065 with no change.
- **Polish (Phase 6)**: After the stories you intend to ship.
- **Rollout (Phase 12)**: US2, after the spec amendment (T066, done). The `[Agent]` tasks and the `[Guard-protected]`
  tasks follow Phase 12's own dependency notes. The `[Owner]` tasks can start in parallel and need a re-paste if T068
  merges later.
- **Close-out (Phase 13)**: After the Phase 12 evidence run (T077) for T083 and T087. T084 to T086 can start now.
  T090 is last and needs every related Linear issue complete. T029 is superseded and T034 is out of scope, so neither
  blocks it.

### User Story Dependencies

- **US1 (P1)**: None beyond Phase 2. This is the MVP.
- **US2 (P2)**: None in code. It depends on an Owner action.
- **US3 (P3)**: The docs depend on US1. The Code Owners check depends on an Owner action (T042). The cleanup depends on spec 009 and #3358.

## Parallel Opportunities

- T002 and T003 (different test files).
- T008–T013 and T041 (independent `describe` blocks; if two people edit the file at once, merge them in order).
- T014 alongside T008–T013 (a different file).
- T027 and T031 are done. T026 (setup script) and T024 (CODEOWNERS) can run alongside any US1 task.
- Rollout: T067 to T069 and T072 can run in parallel (different files). The Owner track (T074 to T076) and the
  housekeeping tasks T084 to T086 can run alongside the code work.
- Documentation tasks that edit `docs/CLAUDE_CLOUD_ENVIRONMENT.md` (T072, T078, T081, T082) should run one after the
  other, because they share a file.

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

1. US1 → shipped in #3524. The remaining guard follow-ups (T045, T049, T052, T054, T055) go in one guard PR made
   with enforcement off.
2. US2 → Owner creates the environment (T028), then verification (T030).
3. US3 → docs (T032) shipped in #3524. The deferral and promotion notes (T056, T061, T062), the guard-can't-start
   contract rows (T064) and the merge-order qualifier (T065) go in #3726. The Code
   Owners settings (T042, T043, T048) are Owner actions. Cleanup (T035, T063) ran after #3358; T034 is out of scope for this spec
   (spec 009 owns it, and it waits for the FR-020 deferral to be lifted).
4. Rollout (FR-024 to FR-026, SC-010) → Phase 12. The spec amendment (T066) is done. `/speckit-implement` runs, in
   order: T089 first (the principle VII gate), then T067 → T068 → T069, then T072, T078 and T082 one after the other.
   T073 waits for the PR number and T079 waits for T070 and T071. A person or an Owner session with enforcement off
   does T070 and T071. Owners do T074 to T077 and T080.
5. Close-out → Phase 13. T081 waits for the Owner task T086, so `/speckit-implement` skips it until then. T088 is
   safe to run any time after T089, because it edits only `contracts/hooks.md`. Owners do the Linear and GitHub
   housekeeping (T083 to T087), T091, and T090 last. T029 is superseded by T075.

## Phase 7: Convergence

- [x] T052 Change `.claude/hooks/run-guard.sh` so that, with enforcement on, a guard that cannot start (Node not on `PATH`, or the guard script missing) refuses only git commit, push and branch operations and the GitHub branch, file and PR tools with "Branch guard unavailable", and allows every other call with a visible warning; add contract tests in `scripts/__tests__/enforce-branch-name-hook.test.js` for both cases per FR-012a (contradicts)
- [x] T053 (Delivered on #3358 in `f4fcec75`, with CLI tests corrected in `c69a3c52`; merged as `2261125c89` on 2026-10-05.) Before lightspeedwp/.github#3358 merges, switch off spec 009's `claude/*` auto-approval on that branch (no branch marked `autoApproved`, and `age_days` never used as the 24-hour gate) and align spec 009 T070 and its spec text with the deferral per FR-020 (contradicts)
- [x] T054 Refuse REST `POST repos/…/git/refs` that creates `main` or the configured base branch, and GraphQL `mergeBranch` whose `base` is `main` or the base branch, in `.claude/hooks/enforce-branch-name.mjs`, with refusal and compliant-allow tests, and record the fix against gaps 6 and 7 in lightspeedwp/.github#3691 per FR-008 and FR-009 (missing)
  - Note (2026-10-04): gap 6 (REST `git/refs` creation) was delivered in #3745, and gap 7 (`mergeBranch` writing to `base`) in #3726, with refusal, compliant-allow, variable, input-object and fault-path tests.
- [x] T055 Close or individually track the remaining lightspeedwp/.github#3691 gaps 1–5 (input-object variable, per-document check, `/graphql` leading slash, `--input` variables map, first-wins flag reading) in `.claude/hooks/enforce-branch-name.mjs` with tests per FR-007 and FR-008 (missing)
  - Note (2026-10-04): gaps 1 to 5 were all delivered in #3745, each with tests (gap 1 whole-input variable, gap 2 per-document check, gap 3 leading-slash `/graphql`, gap 4 `--input` variables map, gap 5 last-flag-wins). #3691 is closed.
- [x] T056 Update `docs/CLAUDE_CLOUD_ENVIRONMENT.md` so the cleanup note says auto-deletion of empty `claude/*` branches is deferred under FR-020, and the Node-missing note matches the T052 behaviour, per FR-019 (partial)
- [x] T057 Add `scripts/__tests__/setup-node-install.test.js` to the path filter and test list in `.github/workflows/claude-guard-tests.yml` per FR-023 (missing)
- [x] T058 Replace the stale "spec 016" references with "spec 018" in `.claude/hooks/enforce-branch-name.mjs`, `.claude/cloud/setup.sh`, `.github/workflows/claude-guard-tests.yml`, `scripts/__tests__/helpers/claude-hook-harness.js`, `scripts/__tests__/enforce-branch-name-hook.test.js` and `scripts/__tests__/session-start-hook.test.js` per plan: spec identity (partial)

## Phase 8: Convergence

- [x] T059 Add `scripts/__tests__/setup-node-install.test.js` to the quickstart §1 test command in `.github/specs/018-claude-cloud-environment/quickstart.md`, so a local run covers the same suites as Claude Guard Tests per FR-023 (partial)
- [x] T060 Record against T033 that spec 009's `claude/*` auto-approval isn't on `develop` and stays switched off under FR-020 until a branch-age signal exists, and update T033's status once T053 lands per FR-020 (contradicts)

## Phase 9: Regenerated tasks (2026-10-02 clarifications and plan refresh)

- [x] T061 [P] [US3] Update the cleanup note in `docs/CLAUDE_CLOUD_ENVIRONMENT.md` (the "Empty `claude/*` branches" bullet under "Maintain it"). It should say that while FR-020 defers auto-deletion, spec 009's scheduled cleanup sends every `claude/*` branch to DISCUSS for its forbidden prefix. A maintainer may promote an empty, merged one with no open PR to DELETE, and it is then removed only through spec 009's draft-PR approval; one carrying its own commits is never promoted. Per FR-019, FR-021 and research R16.
- [x] T062 [P] [US3] Add to the "Branch types come from `lib/validate-branch-name.js`" bullet in `docs/CLAUDE_CLOUD_ENVIRONMENT.md`: hotfixes use `hotfix/{scope}-{title}`, and `hotfix/vX.Y.Z` is refused by both the guard and CI. Only `release/vX.Y.Z` has a version-number form. Per FR-009, FR-010 and research R17.
- [x] T063 [US3] After #3358 merges, record the DISCUSS-to-DELETE promotion route for empty `claude/*` branches in spec 009's manual review guidance (`.github/specs/009-audit-branch-cleanup/quickstart.md`, and spec 009 FR-012's manual review process). Promotion needs an empty, merged branch with no open PR, and deletion still goes through the draft-PR approval. Per FR-021 and research R16.

## Phase 10: Convergence

- [x] T064 Add rows for a guard that can't start (Node not on `PATH`, or the guard script missing) to the PreToolUse outcome table in `.github/specs/018-claude-cloud-environment/contracts/hooks.md`, and matching cases to the quickstart §1 table in `.github/specs/018-claude-cloud-environment/quickstart.md`. With enforcement on, a git write or GitHub branch, file or PR tool exits 2 with "Branch guard unavailable", and any other call exits 0 with a warning. With `LS_ENFORCE_BRANCH_NAMES=0`, both exit 0 with a warning. Per FR-012a and research R15 (partial)

## Phase 11: Convergence

- [x] T065 Qualify the cleanup note in `docs/CLAUDE_CLOUD_ENVIRONMENT.md` (the "Empty `claude/*` branches" bullet under "Maintain it"). Until lightspeedwp/.github#3358 merges, `develop` still has the old `scripts/cleanup-branches.js`, which doesn't categorise `claude/*` branches as DISCUSS. So the bullet should say the DISCUSS and promotion behaviour applies once spec 009's report-only CLI lands, or this qualifier should be dropped if #3358 merges first. Per FR-019 and FR-020 (partial)

## Phase 12: Organisation-wide rollout (User Story 2, 2026-10-09)

**Goal**: every team member's cloud sessions run in the organisation-shared **LightSpeed** environment without
setup on their part. The repository stays its source of truth, and any session outside it, or any drift from the
repository, shows a warning. Source: plan.md "Increment: organisation-wide rollout", research R18 to R22,
[contracts/cloud-environment.md](./contracts/cloud-environment.md) and data-model.md "Session environment state".

**Independent Test**: quickstart §6. A member with no saved selection lands in **LightSpeed** with no
`Cloud environment:` warning. A member with a saved selection sees the "isn't using the shared LightSpeed
environment" warning until they switch once. `claude --cloud` uses **LightSpeed** without `/remote-env`. A merged
change to `setup.sh` that hasn't been re-pasted shows the "out of date" warning.

**Execution split (refreshed 2026-10-12)**: `/speckit-implement` runs only the `[Agent]` tasks that are safe now, in
this order:

1. **T089** (Phase 13): re-run the requirements checklist against the amended spec. This is the principle VII gate, so
   it runs before any other implementation task.
2. **T067 → T068 → T069**: the revision helper, the stamp, then the CI test.
3. **T072, then T078, then T082**: all three edit `docs/CLAUDE_CLOUD_ENVIRONMENT.md`, so run them one after the
   other, never in parallel.
4. **T088** (Phase 13): reword the SC-009 citation in `contracts/hooks.md` to FR-012. It edits only that file, so it
   can run any time after T089.

Blocked `[Agent]` tasks, which `/speckit-implement` must skip until the blocker clears:

- **T073**: the changelog entry must link the PR that ships the code, so it needs that PR's number.
- **T079**: it runs the session-start tests and `shellcheck` on `session-start.sh`, so it needs the guard-protected
  T070 and T071 done first.
- **T081** (Phase 13): needs the Owner task T086 first, so it reconciles against #3727's final state.

The `[Guard-protected]` tasks (T070, T071) need a person or an Owner session started with
`LS_ENFORCE_BRANCH_NAMES=0`. The `[Owner]` tasks (T074 to T077, T080 and most of Phase 13) are the admin console,
evidence and housekeeping. T066 is done.

Requirement IDs for this phase: P1 is **FR-024**, P2 is **FR-025**, P3 is **FR-026** and P4 is **SC-010**.

### Spec first

- [x] T066 [US2] [Agent] Amend `.github/specs/018-claude-cloud-environment/spec.md` with plan proposals P1 to P4. Add them
  as the next three free FR numbers after FR-023 and the next free SC number (`contracts/hooks.md` already cites an
  undeclared SC number, so check it first):
  - P1: a non-blocking warning when a cloud session isn't in the shared environment
  - P2: a content-derived revision stamp, enforced by CI, with a warning when the session's stamp differs from
    the repository's
  - P3: the CLI default delivered through server-managed settings (SHOULD)
  - P4: 14 days after rollout, the SC-007 sample shows no `Cloud environment:` warnings

  Also add the FR-019 documentation items and a `### Session 2026-10-09` clarification block recording R19 (the
  organisation default fills only an empty selection) and R22 (organisation-wide effect). Update US2 acceptance
  scenario 1, add a scenario for each warning, and add `LS_CLOUD_ENV`/`LS_CLOUD_ENV_REVISION` to the Shared cloud
  environment entity. Then replace "P1 (proposed FR)" to "P4 (proposed SC)" in `plan.md` with the new IDs. Done
  when `npx jest -c .jest.config.cjs tests/js/claude-cloud-environment-docs.test.js` passes.

  Note (2026-10-12): done through `/speckit-clarify`. FR-024, FR-025, FR-026 and SC-010 are declared in `spec.md`.
  The adoption criterion is SC-010, not SC-009, because `contracts/hooks.md` already cites SC-009 for nested
  interpreters (tracked by T088). US2 scenario 1 and FR-019 are updated, and the clarification block is
  `### Session 2026-10-12`. The contract test's expected FR count was raised from 23 to 26, and the `plan.md`
  placeholders were replaced with the real IDs. The extra per-warning scenarios mentioned above weren't added;
  the warnings are covered by FR-024 and FR-025 and by T071.

### Environment definition and CI stamp (agent)

- [x] T067 [US2] [Agent] (Done 2026-10-12: script created and run; `shellcheck` not run locally because it isn't installed, so CI is to verify.) Create `.claude/cloud/revision.sh` (FR-025). It prints the 12-character revision of the shared environment
  for the repository root given as `$1` (default: two directories above the script), computed exactly as
  `contracts/cloud-environment.md` states: the first 12 hex characters of the SHA-256 of the exact bytes of
  `setup.sh`, followed by the lines of `environment.env` that remain once every line starting
  `LS_CLOUD_ENV_REVISION=` is removed, **each remaining line newline-terminated**, including a final line with no
  trailing newline. It's equivalent to
  `{ cat setup.sh; grep -v '^LS_CLOUD_ENV_REVISION=' environment.env; } | sha256sum | cut -c1-12`. When
  `sha256sum` is missing or a file is unreadable, it prints nothing and exits 0. It must pass
  `shellcheck .claude/cloud/revision.sh`. The byte rule is confirmed (plan.md "Decisions confirmed 2026-10-12").
- [x] T068 [US2] [Agent] (Done 2026-10-12: stamp `6436a819b85f` written and cross-checked with an independent Node recomputation, with and without a trailing newline.) Add a "Shared environment identity" block (FR-025) to `.claude/cloud/environment.env`, with
  `LS_CLOUD_ENV=LightSpeed` and `LS_CLOUD_ENV_REVISION=<output of bash .claude/cloud/revision.sh>`, and a comment
  that any change to this file or `setup.sh` must refresh the stamp (CI enforces it). Run T067's script after the
  block is written, because the comment lines are part of the hash.
- [x] T069 [P] [US2] [Agent] (Done 2026-10-12: edited and syntax-checked; Jest not run locally because `node_modules` isn't installed, so CI is to verify.) Add a `describe('shared environment revision stamp')` block (FR-025) to
  `tests/js/claude-cloud-environment-docs.test.js`. It asserts that:
  - `environment.env` contains exactly one `LS_CLOUD_ENV=LightSpeed` line and one
    `LS_CLOUD_ENV_REVISION=` line matching `^[0-9a-f]{12}$`
  - the stamp equals a Node `crypto` recomputation that follows the contract's byte rule: split `environment.env` on
    `\n`, drop a trailing empty element, filter out the `LS_CLOUD_ENV_REVISION=` line, append `\n` to each remaining
    line, hash `setup.sh`'s bytes followed by those lines, and take the first 12 hex characters. The failure message
    includes the expected value and the command to refresh it
  - the same recomputation matches `bash .claude/cloud/revision.sh` for an `environment.env` **with** a trailing
    newline and for one **without** (use temporary copies of the files)
  - `bash .claude/cloud/revision.sh` prints the same value for the real files

  No change is needed in `.github/workflows/claude-guard-tests.yml`, because its filter already covers `.claude/**`
  and this test file. Confirm that by reading the filter.

### Session-start drift check (guard-protected: a person or an Owner session with `LS_ENFORCE_BRANCH_NAMES=0`)

- [ ] T070 [US2] [Guard-protected] Add the drift check (FR-024, FR-025) to `.claude/hooks/session-start.sh`, exactly as the contract's "SessionStart
  drift check" table states:
  - Run it only when `CLAUDE_CODE_REMOTE=true` and the source is `startup` or `resume`, after the branch handling.
  - Compute the repository revision with `bash "$REPO_ROOT/.claude/cloud/revision.sh" "$REPO_ROOT"`.
  - Use the contract's two `systemMessage` texts verbatim, both starting `Cloud environment:`.
  - Skip silently when the helper prints nothing.
  - A `LS_CLOUD_ENV_REVISION` that is missing or empty in a LightSpeed session counts as differing: show the "out of
    date" warning, with the session value read as `unset` (FR-025, `contracts/cloud-environment.md`).
  - Emit one JSON object holding the existing `hookSpecificOutput.additionalContext` plus `systemMessage` when a
    warning applies.
  - Always exit 0.

  It must pass `shellcheck .claude/hooks/session-start.sh`.
- [ ] T071 [US2] [Guard-protected] Add cases (FR-024, FR-025) to `scripts/__tests__/session-start-hook.test.js` for the data-model states, using the
  existing harness with a fixture repository containing copies of `.claude/cloud/`:
  - current: no `systemMessage`
  - stale revision: the "out of date" message names both revisions
  - `LS_CLOUD_ENV=LightSpeed` with `LS_CLOUD_ENV_REVISION` missing or empty: the "out of date" message, with the
    session revision read as `unset`
  - `LS_CLOUD_ENV` unset: the "isn't using the shared LightSpeed environment" message
  - `CLAUDE_CODE_REMOTE` unset (local): no message
  - helper prints nothing: no message

  Every case must exit 0, emit one valid JSON object and keep the branching rules in `additionalContext`. Keep the
  SC-005 30-second case green.

### Documentation (agent)

- [x] T072 [P] [US2] [Agent] (Done 2026-10-12: docs updated; the docs test wasn't run locally because Jest isn't installed, so CI is to verify. I checked the new text by search against the wording the test rejects.) Update `docs/CLAUDE_CLOUD_ENVIRONMENT.md` (FR-019, FR-024 to FR-026):
  - "Set up the shared environment": replace step 9's project-settings route with server-managed settings
    (`{"remote": {"defaultEnvironmentId": "env_..."}}` under Organisation settings → Claude Code → Managed
    settings), keeping `.claude/settings.json` as a fallback.
  - Add an "Organisation-wide scope" note (R22): the default applies to every LightSpeed repository, Node 24
    replaces the image's Node 22 on `PATH`, and a repository can override with `/opt/node<major>/bin`.
  - "Use it": members with a saved selection switch to **LightSpeed** once, and the doc explains both
    `Cloud environment:` warnings.
  - "Maintain it": the contract's Owner change procedure (refresh the stamp in the PR, re-paste after the merge).
  - "Check it works": link quickstart §6.

  Run the docs test afterwards.
- [ ] T073 [US2] [Agent] Add a `CHANGELOG.md` entry under Unreleased (250 characters or less, linked to the PR that ships
  T067 to T072), for the shared-environment revision stamp and drift warnings. It must pass
  `node scripts/validation/validate-changelog.cjs CHANGELOG.md`. **Blocked until the PR that ships T067 to T072 exists,**
  because the entry must link that PR's number.

### Owner actions (admin console)

- [ ] T074 [US2] [Owner] Owner (FR-025): complete T028. Paste the merged `.claude/cloud/environment.env` (with T068's stamp) and
  `.claude/cloud/setup.sh` into **LightSpeed**, and set it as the organisation default. If T028 was done before T068
  merged, re-paste both files.
- [ ] T075 [US2] [Owner] Owner (FR-026): in Organisation settings → Claude Code → Managed settings, merge
  `{"remote": {"defaultEnvironmentId": "<LightSpeed env_ ID>"}}` into the existing JSON and save. Then ask one
  member to run `claude doctor` and confirm the `Managed settings (remote)` line shows the settings loaded
  (research R20; supersedes T029).
- [ ] T076 [US2] [Owner] Owner: post the one-time switch to the team (US2 scenario 1). New members are told the same, because their onboarding Default environment is treated as a saved selection (R19, decided 2026-10-12). Members open the environment selector at
  claude.ai/code or in the desktop app, pick **LightSpeed** under **Organization** for new sessions, and treat a
  `Cloud environment:` warning as a reminder to switch. Terminal users need do nothing once T075 is live.
- [ ] T077 [US2] [Owner] Owner (SC-010, FR-024, FR-025) plus one existing member and, if possible, one new member:
  run quickstart §6 checks (a) to (f), including (b2), and record the results in
  `.github/reports/audit/claude-cloud-rollout-2026-10.md` (date, environment, checkout SHA, outcome per check). The
  (b2) outcome is whether a brand-new member keeps their Default and sees the warning, or lands in **LightSpeed**
  automatically. If they land in **LightSpeed** automatically, record that in `research.md` R19 so T078 can be
  dropped. This extends T030; tick T030 too when §3 and §4 pass in the same session.
- [x] T078 [US2] [Agent] (Done 2026-10-12; the docs test wasn't run locally, so CI is to verify.) Add a "new members: pick LightSpeed once" line to "Use it" in
  `docs/CLAUDE_CLOUD_ENVIRONMENT.md`, because a new member's **Default** environment is treated as a saved selection
  (decided 2026-10-12, R19), keeping **Quick setup** as it is. This doesn't need to wait for T077. Drop the line only
  if T077's (b2) check shows that a new member lands in **LightSpeed** without switching, and record that in R19.
  Run it after T072 and before T082, because all three edit the same file.

### Phase 12 polish

- [ ] T079 [Agent] Run `npx jest -c .jest.config.cjs scripts/__tests__/session-start-hook.test.js tests/js/claude-cloud-environment-docs.test.js`,
  `shellcheck .claude/cloud/revision.sh .claude/hooks/session-start.sh`, and `npx markdownlint-cli2` on the changed
  Markdown, and fix everything until it's green. **Blocked until the guard-protected T070 and T071 are done,** because
  it runs the session-start tests and `shellcheck` on `session-start.sh`.
- [ ] T080 [Owner] (GIT-2524) Once T074 to T077 pass and T042, T043 and T048 are done, comment on lightspeedwp/.github#3736 with
  the T077 report link (comment only; don't close the epic), leaving T034 noted as out of scope (spec 009). The
  `**Status**:` change in `.github/specs/018-claude-cloud-environment/spec.md` is no longer made here. It is T090,
  which waits for every related Linear issue, and moves the Status from `Draft` to Ready for Review (not
  `Implemented`).

### Phase 12 dependencies

- T066 comes first (spec-first). T067 → T068 → T069 (the stamp needs the helper, and the test needs the stamp).
- T070 and T071 need T067, and land in one guard PR (the guard protects `.claude/hooks/**`). They can follow T067
  to T069 in the same PR if an Owner makes it with enforcement off; otherwise they go in a second PR.
- T072 can run alongside T067 to T071 (a different file). T078 follows T072, because they share
  `docs/CLAUDE_CLOUD_ENVIRONMENT.md`. T073 goes in whichever PR ships the code, and is blocked until that PR's number
  exists. T079 is blocked until T070 and T071 are done.
- T074 needs T068 merged. It can be done earlier, but then needs a re-paste. T075 needs T074 (the env ID). T076
  needs T074. T077 needs T070, T074, T075 and T076. T078 doesn't need T077: only dropping its line does.

### Phase 12 parallel opportunities

```text
After T066:  T067 → T068 → T069     ‖  T072 → T078 (docs, one after the other)
Owner track: T074 → T075 → T076   (can start before the code merges; re-paste after T068)
Guard PR:    T070 + T071           (after T067)
```

## Phase 13: Linear issue close-out (2026-10-12)

**Purpose**: Map every Linear issue that relates to spec 018 to a task, so nothing is left untracked. The spec's
**Status** stays `Draft` until every task here and every related Linear issue is complete (clarification session
2026-10-12). Most of this is documentation and housekeeping, and none of it needs new guard code. Source: plan.md
"Linear issue mapping".

**Execution split**: safe now: **T089** (before any implementation task), **T088** (any time after T089, because it
edits only `contracts/hooks.md`) and **T082** (after T072 and T078, never alongside them, because they share one docs
file). Blocked `[Agent]` task: **T081** needs the Owner task T086 first, so `/speckit-implement` must skip it until
then. `[Owner]` tasks: T083 to T087, T090 and T091.

### GIT-2532 (#3742): document Spec 018 and contract checks

- [ ] T081 [US3] [Agent] Update `docs/CLAUDE_CLOUD_ENVIRONMENT.md` so it links the current Spec 018 artefacts
  (`.github/specs/018-claude-cloud-environment/spec.md`, the supporting artefacts in the same folder,
  `.github/specs/CATALOG.md` and `tests/js/claude-cloud-environment-docs.test.js`), distinguishes the historical
  `.github/specs/016-claude-cloud-environment/` path from spec 018 (spec 016 now identifies the changelog-agent
  quality specification), and states the branch-guard limitations and dependencies accurately. Reconcile the wording
  with #3727 (GIT-2514) and don't duplicate the epic's verification scope (#3736). Run
  `npx jest -c .jest.config.cjs tests/js/claude-cloud-environment-docs.test.js` afterwards. Per GIT-2532, FR-019.
  **Blocked until the Owner task T086 is done,** so the wording reconciles against #3727's final state.

### GIT-2530 (#3740): enforce branch naming in shared sessions

- [x] T082 [US3] [Agent] (Done 2026-10-12; the docs test wasn't run locally, so CI is to verify. The note also says the session-start warnings aren't shipped yet, so the docs don't overstate what exists.) Add a short "Delivered and remaining" note to `docs/CLAUDE_CLOUD_ENVIRONMENT.md` that
  separates what shipped (#3524, #3745, #3726) from what is still a limitation. Draw on the existing "Known
  limitations" section and the spec's edge cases, and refer to #3691 as closed (all seven gaps fixed in #3745 and
  #3726). No new guard code. Per GIT-2530, FR-007, FR-008, FR-019. Run it after T072 and T078, never alongside them,
  because they edit the same file.
- [ ] T083 [US3] [Owner] After T077, link the shared-session verification evidence
  (`.github/reports/audit/claude-cloud-rollout-2026-10.md`) from #3740 and GIT-2530. Do this by comment, with no
  closing link to the epic. Per GIT-2530 acceptance criteria.

### GIT-2581 (#3818), GIT-2571 (#3802), GIT-2514 (#3727): housekeeping only

- [ ] T084 [US3] [Owner] GIT-2581 / #3818: confirm nothing is outstanding (its PR #3813 merged on 2026-10-05), set the
  Linear status, and close GitHub issue #3818. No spec work.
- [ ] T085 [US3] [Owner] GIT-2571 / #3802: confirm nothing is outstanding (its PR #3726 merged on 2026-10-05), set the
  Linear status, and close GitHub issue #3802. No spec work.
- [ ] T086 [US3] [Owner] GIT-2514 / #3727: confirm nothing is outstanding, find out why it was reopened on 2026-10-09
  (no reason was recorded), set the Linear status, and close GitHub issue #3727. No spec work.

### GIT-2524 (#3736): the epic

- [ ] T087 [US2] [Owner] Update the epic GIT-2524 / #3736 so its stale "remaining work" text matches reality
  (#3726 and #3358 have merged, and the guard gaps in #3691 are closed), and comment on it with the T077 report
  link. Don't close the epic: its Definition of Done says to update it with a comment instead.

### Open consistency items

- [x] T088 [US3] [Agent] (Done 2026-10-12. The docs contract test asserted the old "SC-009" wording in `contracts/hooks.md`, so its one assertion in `tests/js/claude-cloud-environment-docs.test.js` was changed to expect "Nested interpreters (FR-012)" in the same step. Jest wasn't run locally, so CI is to verify.) In `.github/specs/018-claude-cloud-environment/contracts/hooks.md`, reword the "Nested
  interpreters" paragraph (around line 117) so its citation reads **FR-012** (the shell-parsing requirement) instead
  of **SC-009**, which `spec.md` doesn't declare. Decided 2026-10-12: don't declare SC-009 in `spec.md`, and don't add
  a success criterion. SC-010 is already taken by the adoption criterion, so don't reuse it. Edit only that file. Then
  run `npx jest -c .jest.config.cjs tests/js/claude-cloud-environment-docs.test.js` and confirm no undeclared
  FR or SC ID remains in the spec 018 artefacts.
- [x] T089 [US3] [Agent] (Done 2026-10-12: re-run complete, 14 of 16 items pass, and two fail. They are listed in the checklist's Notes. Fix them with `/speckit-clarify` before the spec leaves Draft.) Re-run the requirements checklist `.github/specs/018-claude-cloud-environment/checklists/requirements.md`
  (currently 16/16) against the amended spec (FR-024 to FR-026, SC-010) and record the result, with any item that
  now fails, in the checklist's Notes. Constitution principle VII needs this before implementation, so **run it first,
  before any other implementation task**. T088 doesn't change the spec, so it doesn't need a second run.

### Changelog decision (principle IX)

- [ ] T091 [US3] [Owner] Decide whether the docs-only Phase 13 PR (T078, T081, T082) needs a `CHANGELOG.md` entry.
  If it does, the entry is an `[Agent]` follow-up inside this task: add it under Unreleased in `CHANGELOG.md`, 250
  characters or less, linked to that PR, and make it pass `node scripts/validation/validate-changelog.cjs CHANGELOG.md`.
  If it doesn't, record why in that PR's description. It needs the PR's number, so it follows T078, T081 and T082.
  Per constitution principle IX.

### Final status change

- [ ] T090 [US3] [Owner] (GIT-2524) Once **all** spec 018 work is complete (every task above, T080 and T091 included,
  and T034 left to spec 009) **and every related Linear issue is complete** (GIT-2532, GIT-2530, GIT-2581, GIT-2571, GIT-2514 and
  the epic's work), move `**Status**:` in `.github/specs/018-claude-cloud-environment/spec.md` and the matching row
  in `.github/specs/CATALOG.md` from `Draft` to Ready for Review. The docs contract test currently requires the
  literal `**Status**: Draft` (`tests/js/claude-cloud-environment-docs.test.js`, the catalogue test), so update that
  assertion in the same change. This replaces the `Implemented` wording that T080 used to carry.

### Phase 13 dependencies

- T072, T078, T081 and T082 all edit `docs/CLAUDE_CLOUD_ENVIRONMENT.md`, so run them one after the other, never in
  parallel. Order: T072, T078 and T082 now, then T081 once T086 is done.
- T083 needs T077. T087 needs T077 and T080.
- T084 to T086 need nothing, because their PRs have merged. Do T086 before T081, so T081 reconciles against #3727's
  final state.
- Run T089 first, before any implementation task. T088 can run any time after T089, because it edits only
  `contracts/hooks.md` and doesn't change the spec.
- T091 needs the docs-only PR (T078, T081, T082) to exist, so it has that PR's number.
- T090 is last: it needs every task above, T091 included, every Phase 12 task except the out-of-scope T034, T029's replacement
  (T075), and every related Linear issue complete.
