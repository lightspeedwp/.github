# Feature Specification: Standardised Claude Code Cloud Environment

**Feature Branch**: `config/claude-cloud-environment`

**Created**: 2026-09-23

**Status**: Draft

**Input**: User description: "Standardised Claude Code cloud environment for the lightspeedwp/.github repository, so every team member's cloud session starts from the same configuration and follows the organisation branching strategy (docs/BRANCHING_STRATEGY.md: {type}/{scope}-{title}, based on develop, forbidden claude/ copilot/ openai/ prefixes). Problem: cloud sessions start on a platform-generated claude/*branch and the platform prompt tells Claude to push there, so Claude consistently ignores CLAUDE.md and creates wrong branch names in new chats. Scope: (1) a shared cloud environment definition — setup script (bash, runs as root, cached ~7 days, <5 min, must exit 0) and .env environment variables, kept in the repo as source of truth; (2) a SessionStart hook that moves off claude/* branches, syncs with develop, installs deps and injects the branching rules into Claude's context; (3) a PreToolUse guard that blocks commits, pushes, branch creation and PRs on invalid, placeholder or protected branches, reusing lib/validate-branch-name.js; (4) team documentation covering Owner setup (org-shared environment, org default environment, optional remote.defaultEnvironmentId) and verification. A draft implementation already exists on branch config/claude-cloud-environment (PR lightspeedwp/.github#3524); the spec should capture requirements and acceptance criteria for it."

## Context

Every Claude Code cloud session starts on a branch the platform generates (for example `claude/affectionate-gauss-x2ahdr`), and the platform's own instructions tell the agent to develop on and push to that branch. Those instructions are set by the platform and outrank the repository's `CLAUDE.md` in practice, so new sessions keep producing branches that break the branching strategy (constitution principles V and VIII). The results are:

- PR templates routed to the wrong place
- validation failures
- mislabelled PRs
- manual rework

No environment setting can rename the platform's branch. The feature therefore has to correct the agent's behaviour inside the session and block non-compliant actions before they reach GitHub. It also has to give every team member one identical starting configuration.

## Clarifications

### Session 2026-09-24

- Q: When a maintainer explicitly asks Claude to commit straight to `develop` or `main`, should the guard ever allow it? → A: Only for specification and documentation changes: a commit or push to a protected branch is allowed when every changed file is under `.github/specs/` or `docs/`. Code and configuration changes always need a feature branch and PR. (Narrowed on 2026-09-24: the exception covers `develop` only; see the `main` question below.)
- Q: Should the branch guard also apply when team members run Claude Code on their own machines, or only in cloud sessions? → A: Both. The guard blocks in cloud and local sessions alike; the enforcement switch is the only way to downgrade it to warnings.
- Q: Should this setup be built only for `lightspeedwp/.github`, or packaged so other LightSpeed repositories can adopt it? → A: This repository now. Packaging it as a portable plugin for other LightSpeed repositories is a recorded follow-up and out of scope for this spec.
- Q: How should the empty `claude/*` branches that the platform leaves on GitHub after every session be cleaned up? → A: A scheduled job deletes `claude/*` branches that have no commits beyond `develop` and are older than 24 hours. (Replaced on 2026-09-24: cleanup is done by spec 009's auto-approval exception, not a separate job; see the spec 009 question below.)
- Q: How should we measure whether the guard is working, including SC-007? → A: No new recording of refusals. SC-001 to SC-003 use the existing branch-validation metrics, and SC-007 becomes a monthly review of 10 sampled sessions.
- Q: Spec 009 (branch cleanup) requires human approval of every deletion through a draft PR, which conflicts with automatic deletion here. Which spec gives way? → A: Spec 009 gains a narrow exception: an agent-session branch (`claude/*`) with no commits of its own, no open PR and a tip at least 24 hours old is auto-approved for deletion. Everything else still goes through 009's draft-PR approval. The cleanup is implemented by 009's categorisation and scheduled workflow, not by a separate job.
- Q: When a session needs to push fixes to an existing PR whose branch already has a non-compliant name, should the guard allow it? → A: Yes, only when the branch already exists on GitHub and is the head of an open PR (the legacy PR exception). Creating or renaming to a new non-compliant name is still refused, and if the open-PR status can't be verified the push is refused.
- Q: Should Claude be stopped from editing the branch guard's own files (`.claude/hooks/` and `.claude/settings.json`) during a session? → A: Yes. The guard refuses the agent's edits to those files unless the enforcement switch is off, and CODEOWNERS requires an Owner's review for changes under `.claude/`.
- Q: If the guard itself breaks (for example, its branch-name validator can't be loaded), what should happen to Claude's commands? → A: With enforcement on, fail closed for git writes only. Git commit, push and branch operations, and the GitHub branch and PR tools, are refused with a "guard unavailable" message. Other commands are allowed with a visible warning. With enforcement off, warn and allow the writes too (FR-013).
- Q: Is the branch guard meant to stop accidental mistakes by Claude, or to hold up against an agent that's actively trying to get around it? → A: Accidents, plus the obvious ways an agent could switch the guard off: editing the guard's files or any settings file that can disable hooks, or turning off the switch from inside the session. Unusual shell constructions are out of scope, and CI branch validation and CODEOWNERS review remain the final gate.
- Q: Should the docs-only exception also cover `main`, or only `develop`? → A: `develop` only. Every commit or push straight to `main` is refused, including docs-only changes, because `main` receives changes only through releases from `develop`.
- Q: Should the one-time Owner setup be required to turn on "Require review from Code Owners" for `develop`, so the `/.claude/` CODEOWNERS entry actually blocks unreviewed changes to the guard's files? → A: Yes. It is a required Owner setup step for `develop` and `main`, and the verification steps check that it is on.
- Q: Should the spec set a measurable speed limit for the branch guard, so it doesn't noticeably slow down every command the agent runs? → A: Yes. The guard adds 150 ms or less per call in the normal case, and the legacy PR check (up to 10 seconds) runs only when a write would otherwise be refused. An automated test covers it (SC-008).
- Q: FR-009 lets `release/*` and `hotfix/*` branches open PRs into `main`, but the shared validator rejects the documented `release/vX.Y.Z` names. How should spec 016 handle this? → A: As a dependency outside this spec. The validator is fixed to accept `release/vX.Y.Z` and `hotfix/vX.Y.Z`, as `docs/BRANCHING_STRATEGY.md` documents (branch `fix/branch-validator-semver-release`). The guard keeps using the one validator (FR-010).
- Q: Should CI run the hook contract tests and the docs contract test on every PR, given that no workflow runs Jest today? → A: Yes, as a required check. A workflow runs the 016 Jest suites on every PR that touches `.claude/`, those tests or this spec, and branch protection on `develop` and `main` requires it (FR-023).
- Q: Should US1 ship as one complete unit, or in increments, given that the session-start text already describes rules the guard doesn't enforce yet? → A: As one complete unit. The injected rules may only describe behaviour the guard enforces in the same release, so lightspeedwp/.github#3524 doesn't merge until US1 is complete (FR-003).

### Session 2026-09-24 (security checklist review)

The reviewer settled `checklists/security.md` item by item. These are the decisions that changed the requirements:

- Q: Which write paths are in scope? → A: Git commands pushing to any remote, the GitHub MCP tools, and the `gh` command-line tool (`gh pr create`, and `gh api` calls that create or update refs, file contents or pull requests) (FR-006, FR-008, FR-009).
- Q: Which settings files can switch the guard off? → A: The four already listed plus the managed settings file `/etc/claude-code/managed-settings.json`, which takes precedence over all others (FR-013a).
- Q: Who may turn off enforcement, and what are the defaults? → A: Owners in the shared environment; members in a personal environment or their own shell for local sessions, as a deliberate human choice. Unset means enforcement on and base branch `develop` (FR-013).
- Q: Are `release/*` branches protected? → A: No, deliberately. Only `main` and the configured base branch are protected (FR-005).
- Q: What counts as a "branch operation" during a guard fault? → A: Creating, renaming, deleting or force-resetting a branch. Switching to an existing branch is allowed with a warning (FR-012a).
- Q: Does the legacy PR exception cover PRs from forks or other repositories? → A: No. It applies only when the open PR's head branch is in this repository (FR-006).
- Q: How are documentation-exception paths compared? → A: After normalisation to repository-relative paths (resolving `.`, `..` and, for existing files, symlinks), case-sensitively. A path that leaves `.github/specs/` or `docs/` after normalisation isn't covered (FR-005).
- Q: Does quote-stripping hide redirections? → A: No. Shell operators outside quotes still count: `echo "x" > .claude/settings.json` targets the file; `echo "> .claude/settings.json"` doesn't (FR-012).
- Q: How are unusual git states judged? → A: During a rebase, merge, cherry-pick or revert, by the branch being worked on. A commit on a detached HEAD with none of those in progress is refused. A refspec push is judged by its target branch. A force-push to the agent's own compliant, unprotected branch is allowed (FR-005, FR-006).
- Q: What if the guard can't run at all, for example because Node is missing? → A: It fails open. That is a recorded known limitation; the setup script installs Node and CI stays the final gate (Assumptions).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Agent never publishes a non-compliant branch (Priority: P1)

A team member starts a new cloud session on this repository and asks for a change. Before the agent's first commit, it renames its working branch to a compliant `{type}/{scope}-{title}` name that fits the task. It then pushes that branch and opens a draft PR against `develop`. If the agent tries to commit, push, create a branch or open a PR under a non-compliant name, the action is refused with a message explaining how to fix it.

**Why this priority**: This is the problem the team reported. A single non-compliant branch breaks template routing, labelling and validation. Preventing it delivers value even if nothing else in this spec ships.

**Independent Test**: Start a fresh session with no special environment and ask the agent for a trivial documentation change. Check that the pushed branch and PR head pass the branch-name validator and that the PR targets `develop`. Separately, ask the agent to commit without renaming and confirm the commit is refused.

**Acceptance Scenarios**:

1. **Given** a new session on a platform-generated `claude/*` branch, **When** the session starts, **Then** the agent is no longer on a `claude/*` branch, has been told the branching rules, and has been told those rules take precedence over the platform's branch instruction.
2. **Given** the agent is on the session placeholder branch, **When** it attempts to commit, **Then** the commit is refused and the refusal names the rule and the rename command.
3. **Given** the agent has renamed its branch to a compliant name, **When** it commits and pushes, **Then** both succeed without intervention.
4. **Given** any branch, **When** the agent attempts to push to, create, or rename to a name with a forbidden prefix (`claude/`, `copilot/`, `openai/`), an unauthorised type or a malformed pattern, **Then** the action is refused, unless the legacy PR exception (scenario 10) applies to a push or commit.
5. **Given** the agent is on `main`, **When** it attempts to commit or push there, **Then** the action is refused. **Given** the agent is on `develop`, **When** it attempts to commit or push there, **Then** the action is refused unless the documentation exception applies (scenarios 8 and 9).
6. **Given** the agent opens a PR on a LightSpeed repository, **When** the head branch is non-compliant, or the base is `main` and the head is not a `release/*` or `hotfix/*` branch, **Then** PR creation is refused. **Given** the head is `release/v1.2.3` and the base is `main`, **Then** PR creation is allowed; this depends on the validator fix recorded in the Assumptions.
7. **Given** a commit message or file content that merely mentions a forbidden branch name, **When** the agent commits, **Then** the commit is not refused on that basis.
8. **Given** the agent is on `develop` and every changed file is under `.github/specs/` or `docs/`, **When** it commits and pushes, **Then** neither action is refused by the guard.
9. **Given** the agent is on `develop` and at least one changed file is outside `.github/specs/` and `docs/`, **When** it commits or pushes, **Then** the action is refused and the refusal names the files that need a feature branch. **Given** the agent is on `main`, **When** it commits or pushes anything, including a docs-only change, **Then** the action is refused.
10. **Given** a non-compliant branch that already exists on GitHub and is the head of an open PR, **When** the agent commits to it and pushes, **Then** neither action is refused (the legacy PR exception). **Given** the same branch without an open PR, or when open-PR status can't be verified, **Then** the push is refused.
11. **Given** enforcement is on, **When** the agent tries to change, move or delete a file under `.claude/hooks/`, `.claude/settings.json`, `.claude/settings.local.json`, `~/.claude/settings.json` or `/etc/claude-code/managed-settings.json` (through its editing tools or a shell command), **Then** the action is refused. **Given** the enforcement switch is off, **Then** the edit is allowed.
12. **Given** the agent writes files through the GitHub integration (the MCP file tools or `gh api`), **When** the target branch is non-compliant, the placeholder or `main`, **Then** the write is refused, unless the legacy PR exception applies. **When** the target is `develop` and every path is under `.github/specs/` or `docs/`, **Then** the write is allowed.
13. **Given** the guard can't load its validator, **When** enforcement is on and the agent commits, pushes, creates, renames, deletes or force-resets a branch, or uses a GitHub branch, file or PR tool, **Then** the action is refused with "Branch guard unavailable" and how to report it. Other commands, including switching to an existing branch, are allowed with a visible warning. **Given** enforcement is off, **Then** the write is allowed with a visible warning.
14. **Given** the agent runs `gh pr create` in a shell, **When** the head branch is non-compliant, or the base is `main` and the head is not `release/*` or `hotfix/*`, **Then** the command is refused, as for the MCP PR tool.

---

### User Story 2 - Every team member starts from the same environment (Priority: P2)

An Owner defines one shared **LightSpeed** cloud environment and makes it the organisation default. Members without
a saved environment selection start new sessions with the same toolchain, variables and network policy. Members who
have saved another environment keep their selection.

**Why this priority**: The user asked for the team to "start with the same cloud config every time". The protections in Story 1 live in the repository and work without this. The shared environment adds consistent tooling and one switch for the whole team.

**Independent Test**: Two team members without a saved environment selection each start a new session without
touching the selector. Both report the same runtime version, linting tools and base-branch variable. A member with
a saved selection starts a new session and confirms that their selected environment is retained.

**Acceptance Scenarios**:

1. **Given** the Owner has created the shared environment from the repository's canonical definition and set it as
   the organisation default, **When** a member with no saved environment selection starts a new session, **Then**
   that session uses the shared environment. **Given** a member has saved another selection, **When** they start a
   new session, **Then** their choice is retained rather than overridden by the organisation default.
2. **Given** a new session in the shared environment, **When** the member checks the toolchain, **Then** the runtime version matches the repository's pinned version and the linting tools CI relies on are available.
3. **Given** the environment's provisioning step fails on a non-critical install, **When** a session starts, **Then** the session still starts and falls back to the platform defaults for that tool.
4. **Given** a member starting cloud sessions from the terminal, **When** they follow the documented one-time step, **Then** their terminal-started sessions also use the shared environment.

---

### User Story 3 - Configuration is documented, versioned and maintainable (Priority: P3)

A maintainer can find, in the repository, the exact environment definition the team uses, instructions for setting it up, a way to verify a session is configured correctly, and the procedure for changing it. Changes to the environment go through normal PR review.

**Why this priority**: Without a versioned source of truth, the environment drifts from what the team expects, and new Owners can't recreate it.

**Independent Test**: A maintainer who has never seen the environment follows the documentation alone to recreate it in a test organisation and runs the verification steps successfully.

**Acceptance Scenarios**:

1. **Given** the repository, **When** a maintainer looks for the environment definition, **Then** the setup script and variables are both in one documented location and match what is configured in the product.
2. **Given** the documentation, **When** a member runs the verification steps in a new session, **Then** each step has a stated expected result.
3. **Given** the Owner setup is complete, **When** a maintainer checks branch protection on `develop` and `main`, **Then** "Require review from Code Owners" is on, so a PR that changes `.claude/` can't merge without an Owner's review.
4. **Given** an emergency where enforcement blocks legitimate work, **When** an Owner turns off the documented
   switch for a new session, **Then** all refusals, including guard faults on git and GitHub writes, become visible
   warnings and the writes proceed without a code change. With enforcement on, those guard faults still block.
5. **Given** a `claude/*` branch on GitHub that is merged to a base branch (it has no commits of its own), has no open PR and has a tip more than 24 hours old, **When** spec 009's scheduled cleanup runs, **Then** the branch is categorised as auto-approved DELETE, deleted without a draft PR, and the deletion is recorded in the run summary.
6. **Given** a `claude/*` branch that has its own commits, is less than 24 hours old, is the head of an open PR, or whose open-PR status cannot be verified, **When** the scheduled cleanup runs, **Then** it is not auto-deleted: it follows spec 009's normal categorisation (KEEP or DISCUSS) and appears in the report for review.
7. **Given** a PR that changes `.claude/hooks/` and breaks a guard contract test, **When** CI runs, **Then** the required test check fails and the PR can't merge into `develop` or `main` (FR-023).

---

### Edge Cases

- **Resumed or compacted session**: The session must not rename or reset a branch that already has work. The branching rules must still be in the agent's context after compaction.
- **Session with uncommitted or unpushed work**: The session must never be reset to the base branch automatically. Untracked files count as uncommitted work, so they are never discarded.
- **Rebase, merge, cherry-pick or revert in progress**: Commits are judged by the branch being worked on. A commit on a detached HEAD with none of these in progress is refused.
- **Refspec and force pushes**: A push such as `git push origin HEAD:other` is judged by its target branch. A force-push to the agent's own compliant, unprotected branch is allowed.
- **`release/*` and `hotfix/*` branches**: Not protected. Their names are checked like any other branch.
- **PRs from forks or other repositories**: The legacy PR exception doesn't apply to them.
- **Guard can't run at all (for example, Node is missing)**: The hook never starts and Claude Code carries on, so the guard fails open. This is a known limitation: the setup script installs Node, and CI branch validation remains the final gate.
- **Base branch unreachable at session start (network failure)**: Session start continues without syncing.
- **Dependency install fails**: The session still starts, and the failure is reported.
- **Session opened with several repositories**: Repository-level protections do not load, as documented by the platform. This is a known limitation and must be listed in the documentation.
- **Deleting a remote branch**: Pushing a deletion (for example, cleaning up a stale `claude/*` branch) must not be refused by the guard.
- **A session still running when cleanup runs**: The 24-hour minimum age protects it. A session older than 24 hours that has not yet committed may lose its empty remote `claude/*` branch, which is harmless because the work continues on its renamed local branch.
- **Cleanup cannot delete a branch (permissions or branch protection)**: The run continues with the remaining branches, reports the failure and ends unsuccessfully (spec 009's partial-failure status) so a maintainer notices.
- **Branch changes between audit and deletion**: Just before deleting, the workflow re-checks that the branch still has no commits of its own and no open PR. If either has changed, it skips the branch.
- **Chained commands such as "rename then commit"**: These are judged against the branch in effect after the rename.
- **Repositories outside the LightSpeed organisation**: Their GitHub actions are not policed.
- **Bot-owned branches (dependabot, renovate) and protected branches**: They follow the existing validator's exemptions for naming. Protected branches are still refused for direct commits or pushes, except for changes to the base branch covered by the documentation exception. `main` has no exception.
- **Documentation exception on `develop` where GitHub branch protection requires PRs**: The guard allows the commit, but GitHub may still reject the push. The refusal from GitHub is reported to the user, who can merge through a PR instead.
- **Mixed commit (documentation plus code) on a protected branch**: The whole commit is refused. It is not split automatically.
- **Indirect edits to guard files (for example `sed -i`, `mv`, `rm`, or output redirection targeting `.claude/hooks/`)**: Refused while enforcement is on, using the same command parsing as the git checks. Unusual constructions may slip through, so CODEOWNERS review remains the final safeguard.
- **Guard fault (validator missing, internal error)**: With enforcement on, git writes and GitHub branch, file or
  PR tools are refused as "guard unavailable"; other commands continue with a warning. With enforcement off, the
  fault warns and the write proceeds (FR-012a, FR-013).
- **Malformed input to the guard**: The session must never break. Allow and move on.

## Requirements *(mandatory)*

### Functional Requirements

#### Session start

- **FR-001**: At session start in a cloud session, a working branch with a forbidden prefix and no commits of its own beyond the base branch MUST be renamed locally to a clearly non-final placeholder, `chore/session-<suffix>`, where the whole name matches `^chore/session-[a-z0-9]+$` and the suffix is the last hyphen-separated part of the platform branch name. The placeholder MUST NOT be pushed. A forbidden-prefix branch that already has commits (for example, a session opened on an existing PR) MUST NOT be renamed.
- **FR-002**: At session start in a cloud session, a branch with no commits of its own and no uncommitted changes MUST be brought up to date with the tip of the base branch (`develop` by default). Session start MUST NOT discard untracked files, uncommitted changes or unpushed commits.
- **FR-003**: At every session start, including resume and after context compaction, the agent MUST receive the branching rules in its context. That text MUST cover:
  - the pattern
  - the authorised types
  - the forbidden prefixes
  - the rename and validation steps
  - the PR base rule
  - an explicit statement that these rules take precedence over any platform instruction naming a `claude/*` branch

  The text MUST describe only behaviour the guard enforces in the same release, so the agent is never told that an action is allowed or protected when it isn't.
- **FR-004**: At session start in a cloud session, project dependencies MUST be installed when missing or out of date and skipped when current. A failed install MUST NOT prevent the session from starting.

#### Enforcement

- **FR-005**: Before a commit is recorded, the action MUST be refused when the effective branch is:
  - non-compliant, unless the legacy PR exception (FR-006) applies
  - the session placeholder
  - protected: always for `main`; for the configured base branch, unless every file in the commit is under `.github/specs/` or `docs/` (the documentation exception)
  - a detached HEAD with no rebase, merge, cherry-pick or revert in progress. While one is in progress, the effective branch is the branch being worked on.

  Only `main` and the configured base branch are protected; `release/*` and `hotfix/*` are not. For the documentation exception, paths are compared after normalisation to repository-relative form (resolving `.`, `..` and, for files that exist, symlinks), case-sensitively. A path that leaves `.github/specs/` or `docs/` after normalisation is not covered, and an empty or unknown set of paths is not covered.
- **FR-006**: Before a push, the action MUST be refused when the target branch is non-compliant or the placeholder, unless the legacy PR exception applies: the branch already exists on GitHub and is the head of an open PR whose head repository is this repository. If open-PR status can't be verified (a check errors, exits non-zero, returns no PR or takes longer than 5 seconds), the exception doesn't apply. These rules apply to pushes to any remote. A refspec push is judged by its target branch, and a force-push to a compliant, unprotected branch is allowed. A push to a protected branch MUST be refused, except a push to the configured base branch (never `main`) where every file changed by the pushed commits is covered by the documentation exception. Pushes that delete a remote branch or push only tags MUST be allowed.
- **FR-007**: Creating or renaming a branch to a non-compliant or placeholder name MUST be refused, whether it is done locally or through the GitHub integration.
- **FR-008**: Writing files to a non-compliant or placeholder branch through the GitHub integration (the GitHub MCP tools, or `gh api` calls that create or update refs or file contents) MUST be refused, unless the legacy PR exception applies. Writing to a protected branch this way MUST be refused, except writes to the configured base branch (never `main`) where every written file is covered by the documentation exception.
- **FR-009**: Opening a PR on a LightSpeed repository (one whose GitHub owner is `lightspeedwp`, compared case-insensitively), through the GitHub MCP tools, `gh pr create` or `gh api`, MUST be refused when the head branch is non-compliant. On this repository, it MUST also be refused when the base is `main` and the head is not a `release/*` or `hotfix/*` branch.
- **FR-010**: Branch-name compliance MUST be decided by the same validation rules the repository's CI uses, so that the guard and CI can never disagree. The authority is `lib/validate-branch-name.js`, the library the `branch-name-validation` workflow runs through `scripts/validation/validate-branch-name.js`.
- **FR-011**: Every refusal MUST state which rule was broken, suggest a corrected name only when that suggestion itself passes the validator, and give the exact rename and validation steps. The refusal is returned to the agent, and the person sees the same text in the session transcript; there is no separate notification.
- **FR-012**: Text inside quoted strings and here-documents (such as commit messages) MUST NOT trigger a refusal. Shell operators outside quotes, such as `>` and `>>`, MUST still be evaluated: `echo "x" > .claude/settings.json` targets the file, while `echo "> .claude/settings.json"` doesn't.
- **FR-012a**: If the guard can't evaluate a call because of its own fault (for example, the validator fails to load
  or an internal error occurs), it MUST refuse git commit, push and branch operations (creating, renaming, deleting or force-resetting a
  branch) and the GitHub branch, file and PR tools with a message saying the guard is unavailable and how to report it while enforcement is on. It MUST
  allow all other commands, including switching to an existing branch, with a visible warning. When enforcement is off, FR-013 takes precedence: the fault
  MUST produce a visible warning and allow the write. Malformed hook input from the platform is still allowed
  silently.
- **FR-013**: A single configuration switch MUST downgrade all refusals to visible warnings. The agent MUST NOT be able to change the switch from inside a running session; it takes effect only from the environment the session started with. The switch is `LS_ENFORCE_BRANCH_NAMES`, and enforcement is on unless it is `0`. Owners set it in the shared environment; a member may set it in a personal environment or in their own shell for a local session, which is a deliberate human choice outside the threat model. The base branch is `LS_BASE_BRANCH`, `develop` when unset. Turning the switch off leaves no record, by design (no refusal telemetry, Clarification Q5).
- **FR-013a**: While enforcement is on, the agent MUST NOT be able to change, move or delete the guard's own files and any settings file that can disable or override hooks (`.claude/hooks/**`, `.claude/settings.json`, `.claude/settings.local.json`, the user settings file `~/.claude/settings.json` and the managed settings file `/etc/claude-code/managed-settings.json`) through its file-editing tools or shell commands. With the switch off, such edits are allowed. The repository's CODEOWNERS file MUST require an Owner's review for changes under `.claude/`, and branch protection on `develop` and `main` MUST have "Require review from Code Owners" turned on so that review is enforced.
- **FR-014**: Enforcement MUST block in both cloud and local agent sessions on this repository, with identical rules. Only the enforcement switch (FR-013) may downgrade refusals to warnings, in either setting.
- **FR-023**: A CI workflow MUST run the guard and SessionStart contract tests and the spec 016 documentation contract test on every PR that changes `.claude/`, those tests or `.github/specs/016-claude-cloud-environment/`. Branch protection on `develop` and `main` MUST require that check, so a change that breaks the guard can't merge with green CI.

#### Shared environment

- **FR-015**: The repository MUST contain the canonical provisioning script and environment variables for the shared cloud environment, in one documented location.
- **FR-016**: The provisioning script MUST:
  - exit successfully even when an optional install fails
  - finish well within the platform's five-minute limit
  - be safe to run more than once
- **FR-017**: The provisioning script MUST install the runtime version pinned by the repository and the linting tools CI depends on that the platform does not pre-install. It MUST also set system-wide version-control defaults that support the branching strategy.
- **FR-018**: The environment variables MUST include the base branch and the enforcement switch, and MUST NOT contain secrets.

#### Documentation

- **FR-019**: The documentation MUST cover:
  - why the problem occurs
  - each protection layer and where it lives
  - the one-time Owner setup (shared environment, organisation default, optional terminal default, and "Require review from Code Owners" and the required FR-023 test check on `develop` and `main`)
  - the personal-plan alternative
  - how members use it
  - verification steps with expected results
  - maintenance procedure
  - known limitations

#### Branch cleanup

- **FR-020**: Spec 009's branch categorisation MUST mark a remote `claude/*` branch as auto-approved DELETE when all of these hold: it is merged to a base branch (no commits of its own), open-PR verification succeeded and found none, and its tip is at least 24 hours old. Spec 009's scheduled workflow MUST run at least daily and delete auto-approved branches without a draft PR.
- **FR-021**: Any `claude/*` branch that fails an FR-020 condition MUST NOT be auto-deleted. It follows spec 009's normal rules (KEEP, DISCUSS, or DELETE through the draft-PR approval) and MUST appear in the report.
- **FR-022**: Auto-approved deletions MUST respect spec 009's dry-run default: the audit command never deletes. Deletion happens only in the scheduled workflow's deletion step, which re-verifies each branch first. A manual workflow run MUST offer a report-only option.

### Key Entities

- **Shared cloud environment**: The organisation-level configuration every session starts from. It has a name, network access level, environment variables and a provisioning script. It is owned and edited by Owners, and its canonical copy is versioned in the repository.
- **Session placeholder branch**: A temporary, deliberately non-final local branch name that replaces the platform-generated branch, matching `^chore/session-[a-z0-9]+$`. The name passes the validator, so the guard recognises it by this pattern. It must be renamed before any commit.
- **Branching rules**: The pattern, authorised types, forbidden prefixes, protected branches, the documentation exception and the PR base rule. Naming rules are defined once by the existing validator and the branching strategy document.
- **Enforcement switch**: An environment-level setting, `LS_ENFORCE_BRANCH_NAMES`, that toggles between blocking (the default) and warning.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of branches pushed from cloud agent sessions on this repository pass the branch-name validator. This is measured over the first 30 days after rollout via the existing branch-validation metrics.
- **SC-002**: Zero new `chore/session-*` or `claude/*` branches with commits appear on the remote after rollout. No empty `claude/*` branch stays on the remote for more than 48 hours.
- **SC-003**: PR template fallback routing caused by agent-created branches drops to 0% (constitution goal for fallback routing).
- **SC-004**: A team member without a saved environment selection can start a correctly configured session with
  zero manual configuration steps once the Owner has completed setup.
- **SC-005**: Session start adds no more than 30 seconds when dependencies are already current. The first provisioning run completes in under 5 minutes.
- **SC-006**: A maintainer unfamiliar with the setup can recreate the environment and pass every verification step using only the documentation, in under 15 minutes.
- **SC-007**: In a monthly review of 10 agent sessions that hit a refusal, at least 9 show the agent fixing the branch name and retrying successfully without human help. A maintainer picks the sessions from the team's Claude Code session history for this repository by searching transcripts for the guard's refusal text ("Branch guard"); no refusal data is recorded by the guard itself. The same review counts refusals of actions that were correct under the rules (wrongful refusals); the target is 0, and each one found is fixed with a regression test.
- **SC-008**: The guard adds no more than 150 ms per matched tool call (median over the automated contract test run) in the normal case, where no network check is needed. The legacy PR check, which may take up to 10 seconds, runs only when a commit, push or GitHub write would otherwise be refused.

## Assumptions

- The organisation is on a plan that supports organisation-shared cloud environments and an organisation default environment. Personal-plan members can recreate the same environment from the documentation.
- The platform will keep generating `claude/*` branches and instructing the agent to use them. This feature works around that behaviour rather than changing it.
- The platform's push protection allows pushing the session's current branch after it has been renamed. This was verified during the draft implementation. If the platform changes this, pushes from renamed branches fail loudly (the push is rejected, not redirected), CI branch validation still applies, and the verification steps (quickstart §4) catch it; the documentation lists it as a limitation.
- The existing validator (`lib/validate-branch-name.js`) and `docs/BRANCHING_STRATEGY.md` are authoritative. They currently disagree on release names: the strategy documents `release/vX.Y.Z` and `hotfix/vX.Y.Z`, but the validator rejects them. Until the validator is fixed (a dependency outside this spec, on branch `fix/branch-validator-semver-release`), the guard and CI both refuse such branches, so FR-009's `main` rule can't be used for real release PRs. No changes to authorised types are in scope.
- The default network level (Trusted) reaches every host the provisioning script needs.
- Empty `claude/*` branches left by the platform are removed by spec 009's scheduled cleanup under the auto-approval exception (FR-020 to FR-022). Existing `claude/*` branches that have commits are reviewed by maintainers through 009's DISCUSS category, not deleted automatically.
- The cleanup requirements depend on spec 009 and lightspeedwp/.github#3358 (the categorisation library and scheduled workflow). They are delivered after #3358 merges, together with the matching amendment to spec 009.
- Sessions opened with several repositories do not load repository-level protections. This is documented, not solved.
- Threat model: the guard is designed to stop accidental non-compliance and the obvious self-bypasses (editing guard or settings files, or changing the switch in-session). It is not designed to resist a determined adversary using unusual shell constructions; CI branch validation and CODEOWNERS review are the final gate.
- The guard uses command-parsing heuristics. Unusual constructions (for example, committing in another directory after changing into it) may not be caught, and CI's branch-name validation remains the final gate.
- Scope is this repository only. Packaging the environment definition, hooks and guard as a portable plugin (top-level `plugins/`) for other LightSpeed repositories is a follow-up spec. This spec's design should not block that reuse.
- If the guard can't run at all (for example, Node is missing), it fails open. This is a known limitation; the setup script installs Node and CI branch validation remains the final gate.
- The guard does not record or report refusals. Success is measured through the existing branch-validation metrics and the monthly session review (SC-007), so no session telemetry is collected or stored.
- Changes to locked configuration files (labels, issue types, templates) are not required.

## Related

- Draft implementation: lightspeedwp/.github#3524 (branch `config/claude-cloud-environment`)
- [Branching strategy](../../../docs/BRANCHING_STRATEGY.md)
- [Spec 004 — Branch naming strategy](../004-branch-naming-strategy/spec.md)
- [Claude Code cloud environments](https://code.claude.com/docs/en/cloud-environments)
