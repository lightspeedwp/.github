---
file_type: documentation
title: Claude Code Cloud Environment
description: Shared cloud environment configuration for Claude Code sessions on lightspeedwp/.github, tuned to the organisation branching strategy
created_date: 2026-09-23
last_updated: 2026-09-24
author: LightSpeed Team
language: en
version: 1.1.0
status: active
---

# Claude Code Cloud Environment

Every Claude Code cloud session (claude.ai/code, the desktop and mobile apps, `claude --cloud`, routines) runs in a
[cloud environment](https://code.claude.com/docs/en/cloud-environments). This guide sets up one shared
**LightSpeed** environment so everyone on the team starts from the same configuration, and so Claude follows the
[branching strategy](./BRANCHING_STRATEGY.md) instead of the platform defaults. The requirements behind it are in
[spec 018](../.github/specs/018-claude-cloud-environment/spec.md).

## The problem this solves

When a cloud session starts, the platform checks out an auto-generated branch such as
`claude/affectionate-gauss-x2ahdr`, and its system prompt tells Claude to develop on and push to that branch. That
instruction is set by the platform, so no environment setting can rename it. Left alone, Claude pushes `claude/*`
branches, which breaks PR template routing, labelling and the `branch-name-validation` workflow.

The fix is layered, so the rule holds even when one layer is skipped:

| Layer                 | Lives in                                                                                                          | Runs                                                                           | What it does                                                                                                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Setup script          | Environment settings (copy in [`.claude/cloud/setup.sh`](../.claude/cloud/setup.sh))                              | Once per environment cache build (about every 7 days)                          | Installs Node matching `.nvmrc`, `shellcheck`, `actionlint` and `gh`; sets git defaults                                                                                                                                    |
| Environment variables | Environment settings (copy in [`.claude/cloud/environment.env`](../.claude/cloud/environment.env))                | Every session                                                                  | `LS_BASE_BRANCH=develop`, the enforcement switch, npm and locale defaults                                                                                                                                                  |
| SessionStart hook     | [`.claude/hooks/session-start.sh`](../.claude/hooks/session-start.sh)                                             | Every session, cloud and local                                                 | Moves a fresh `claude/*` branch onto a local placeholder, syncs it with `develop`, runs `npm install`, and injects the branching rules into Claude's context, stating that they override the platform's branch instruction |
| Branch guard          | [`.claude/hooks/enforce-branch-name.mjs`](../.claude/hooks/enforce-branch-name.mjs) (PreToolUse)                  | Before every Bash, file-editing and GitHub tool call, cloud and local          | Refuses commits, pushes, branches, file writes and PRs that break the strategy, and protects its own files                                                                                                                 |
| CI                    | [`claude-guard-tests.yml`](../.github/workflows/claude-guard-tests.yml), `branch-name-validation.yml`, CODEOWNERS | Every PR on `develop` and `main`, and merge-queue batches on the same branches | Runs the guard's contract tests, validates branch names, and requires an Owner's review for `.claude/`                                                                                                                     |

The hooks are committed to the repository, so they apply to every session on this repository, in the cloud and on
your own machine, whichever environment it uses. The environment adds the toolchain and the shared variables.

## What the guard enforces

- **Names**: every branch Claude creates, renames, commits to or pushes must match `{type}/{scope}-{title}`, using the
  same validator as CI (`lib/validate-branch-name.js`). `claude/`, `copilot/` and `openai/` are always refused, and so
  is the `chore/session-*` placeholder.
- **Protected branches**: `main` never takes direct commits or pushes. `develop` takes them only under the
  documentation exception: every changed file is under `.github/specs/` or `docs/`. Paths are normalised first, so
  `docs/../package.json` isn't covered. A mixed commit is refused and the refusal lists the files that need a feature
  branch. `release/*` and `hotfix/*` aren't protected.
- **Legacy PR exception**: an existing non-compliant branch (for example `copilot/fix-login`) may still receive
  commits and pushes when it exists on GitHub and is the head of an open PR in this repository. The guard checks with
  `git ls-remote` and the GitHub REST API, 5 seconds per check, and only when the action would otherwise be refused.
  Any failure, fork head or timeout means the exception doesn't apply. New branches with such names are always refused.
- **PRs**: the head must be compliant. On this repository only `release/*` and `hotfix/*` may target `main`. This
  applies to the GitHub MCP tools, `gh pr create` and `gh api`. Repositories owned by anyone other than
  `lightspeedwp` aren't policed.
- **Git states**: commits during a rebase are judged by the branch being rebased. A commit on a detached HEAD with no
  rebase, merge, cherry-pick or revert in progress is refused. A refspec push is judged by its target. Force-pushes
  to your own compliant branch are allowed. Branch deletions are allowed, except for `main` and the base branch, which are
  refused both locally and on the remote, since a remote deletion is the one that cannot be undone by re-creating
  the branch.
- **Self-protection**: while enforcement is on, Claude can't change, move or delete `.claude/hooks/**`,
  `.claude/settings.json`, `.claude/settings.local.json`, `~/.claude/settings.json` or
  `/etc/claude-code/managed-settings.json`, through its editing tools or shell commands such as `sed -i`, `rm`,
  `mv`, `cp`, `tee`, `git restore` or `>` redirection. Reading them is always allowed.
- **Quoted text**: branch names inside commit messages, quoted strings and here-documents never trigger a refusal,
  but redirections outside quotes still count.
- **Speed**: the guard adds 150 ms or less per call in the normal case (about 45 ms measured). Network checks run
  only on the refusal path.

Every refusal starts with `Branch guard:`, names the rule, suggests a valid name when there is one, and gives the
rename and validation commands. Claude sees it, and so do you in the session transcript.

### Threat model

The guard is built to stop accidental non-compliance and the obvious self-bypasses: editing its own files or
settings, or changing the enforcement switch from inside a session. It is not built to stop a determined adversary
using unusual shell constructions. For branch names, CI branch validation and CODEOWNERS review are the final gate;
neither enforces the protected-branch policy for every transport, and the limits below say where that does not hold.

### The enforcement switch

`LS_ENFORCE_BRANCH_NAMES` is read only from the environment the session started with. Setting it inside a Bash
command, or exporting it, has no effect, and the settings files that could override it are protected.

- Unset or anything other than `0`: refusals block. This is the default. `LS_BASE_BRANCH` defaults to `develop`.
- `0`: every refusal becomes a visible warning and the action goes ahead.
- Owners set it in the shared environment. A member may set it in a personal environment, or in their own shell
  before starting a local session. That is a deliberate human choice, outside the threat model.
- Turning it off leaves no record. The guard records no telemetry by design.

### When the guard itself fails

If the guard can't evaluate a call because of its own fault, for example its validator fails to load:

- With enforcement on, git commits, pushes and branch operations (creating, renaming, deleting or force-resetting a
  branch), `gh pr create`, `gh api` writes and the GitHub MCP tools are refused with
  `Branch guard unavailable: <error>. Open an issue on lightspeedwp/.github`. Everything else, including switching to
  an existing branch, is allowed with a warning.
- With enforcement off, the fault is a warning and the action goes ahead.
- The same split applies when the guard can't start at all, because Node isn't on `PATH` or the guard script is
  missing. The launcher (`.claude/hooks/run-guard.sh`) classifies the call itself, without Node. With enforcement on it
  refuses the writes above with `Branch guard unavailable: <reason>` and allows every other call, so a session without
  Node can still run `ls` and read the tree to find out why.

**Emergency procedure**: if the guard blocks legitimate work, an Owner sets `LS_ENFORCE_BRANCH_NAMES=0` in the
environment and starts a new session (running sessions keep their setting). Open an issue, fix the guard in a PR,
then set the switch back.

## Set up the shared environment (once, by an Owner)

An organisation-shared environment gives the whole team one configuration that only Owners can change.

1. Open [admin settings](https://claude.ai/admin-settings) → **Cloud environments** → create an environment.
2. **Name:** `LightSpeed`
3. **Network access:** `Trusted`. The setup script only needs nodejs.org, the Ubuntu mirrors and the Go module proxy,
   which are all on the default list. GitHub and MCP connectors work at any level.
4. **Environment variables:** paste the contents of [`.claude/cloud/environment.env`](../.claude/cloud/environment.env).
   Everyone who uses the environment can read these values, so never add secrets.
5. **Setup script:** paste the contents of [`.claude/cloud/setup.sh`](../.claude/cloud/setup.sh).
6. Save.
7. Make it the default for everyone: at
   [claude.ai/admin-settings/claude-code](https://claude.ai/admin-settings/claude-code), set the organisation's
   default environment to **LightSpeed**. New sessions use it when a member has no saved selection; a member's own
   choice is kept.
8. In branch protection (or the ruleset) for both `develop` and `main`:
   - turn on **Require review from Code Owners**, so the `/.claude/` entry in `CODEOWNERS` blocks unreviewed changes
     to the guard;
   - add **Claude guard contract tests** (from `claude-guard-tests.yml`) to the required status checks. The
     workflow also runs on `merge_group`, because a check that only runs on a pull request is never reported for a
     merge-queue batch and the requirement would then block every queued merge.
9. For `claude --cloud`: copy the environment's ID (`env_...`) and add
   `{"remote": {"defaultEnvironmentId": "env_..."}}` at
   [claude.ai/admin-settings/claude-code](https://claude.ai/admin-settings/claude-code) → **Managed settings**, merging
   it into any JSON already there (spec 018 FR-026). Server-managed settings are edited only by Owners and apply to
   every member's CLI, so terminal-started cloud sessions use **LightSpeed** without a step from each member. Ask one
   member to run `claude doctor` and confirm the `Managed settings (remote)` line shows the settings loaded. Only a
   client that doesn't fetch server-managed settings (for example one using a third-party provider variable or a
   custom base URL) falls back to the project's `.claude/settings.json`, which isn't edited for this, or to the
   member's own `/remote-env` choice.

On a Pro or Max plan without admin settings, create the same environment yourself: in claude.ai/code open the
environment selector → **Add cloud environment**, and fill in the same fields.

**Organisation-wide scope**: the organisation default applies to cloud sessions on every LightSpeed repository, not
only this one. `setup.sh` makes no assumptions about the repository, and the `LS_*` variables do nothing where the
hooks are absent. The one visible change elsewhere is that Node 24 replaces the image's Node 22 as the default on
`PATH`. A repository that needs another version can prepend `/opt/node<major>/bin` or add its own SessionStart step.

## Use it (everyone)

- In claude.ai/code or the desktop app, check the environment selector shows **LightSpeed** (under **Organization**)
  before starting a session. The organisation default only fills an empty selection, so a member who already has a
  saved selection keeps it, and needs to pick **LightSpeed** once.
- New members: pick **LightSpeed** once before your first session. The Default environment that onboarding creates
  counts as a saved selection, so the organisation default doesn't move you. This stays until the rollout check
  ([quickstart §6](../.github/specs/018-claude-cloud-environment/quickstart.md), check b2) shows that a new member lands
  in **LightSpeed** on their own.
- From the terminal, once the Owner has set the managed default (step 9 above) you need do nothing. If a session
  shows the warning below, run `/remote-env` and pick **LightSpeed**.
- Once the session-start check ships (spec 018 FR-024; see Delivered and remaining), a session that isn't in the
  shared environment shows `Cloud environment: this session isn't using the shared LightSpeed environment. Select
  LightSpeed (under Organization) in the environment selector for new sessions.` Switch once, and new sessions use
  **LightSpeed**. The warning never blocks the session.
- Once the same check ships (spec 018 FR-025), a session in **LightSpeed** whose revision stamp doesn't match the
  repository shows `Cloud environment: LightSpeed is out of date (session <a>, repository <b>). An Owner should update
  it from .claude/cloud/`. Tell an Owner, who re-pastes the files (see Maintain it).
- Local sessions run the same guard. Install `gh` and log in with `gh auth login`, or the legacy PR exception can't be
  verified and is refused.
- Start sessions on this repository on its own. A session with several repositories does not load any repository's
  `.claude/settings.json`, so the hooks do not run there.

## What a session looks like

1. The session starts on `claude/<random>-<hash>`.
2. If that branch has no commits of its own, the SessionStart hook renames it locally to `chore/session-<hash>` (not
   pushed), resets it to `origin/develop`, installs npm dependencies, and hands Claude the branching rules. A
   `claude/*` branch that already has commits, such as a session opened on an existing PR, is left alone, and
   untracked files or unpushed work are never discarded.
3. Before its first commit, Claude renames the branch to match the task, for example
   `git branch -m feat/issue-triage-labels`, then validates it with `npm run validate:branch-name -- --current`.
4. If Claude tries to commit or push on the placeholder, a `claude/*` name, `main`, or `develop` outside the
   documentation exception, the guard refuses the call and says how to fix it.
5. Claude pushes with `git push -u origin <name>` and opens a draft PR against `develop`. The platform's push
   protection allows pushing the renamed current branch.

## Check it works

In a new session, ask Claude to run:

```bash
git branch --show-current                     # chore/session-<hash>, not claude/...
node -v                                       # v24.x (from .nvmrc)
command -v shellcheck actionlint gh           # all present
gh auth status                                # logged in (through the GitHub proxy in the cloud)
echo "$LS_BASE_BRANCH"                        # develop
npm run validate:branch-name -- --current     # fails on the placeholder, as intended
```

Then ask it to make a trivial commit without renaming, and to edit `.claude/settings.json`. The guard should refuse
both, and each refusal should start with `Branch guard:`.

For the organisation-wide rollout (the organisation default, the managed CLI default and the two `Cloud environment:`
warnings), follow [quickstart §6](../.github/specs/018-claude-cloud-environment/quickstart.md) and record the results
in `.github/reports/audit/`.

An Owner then confirms the review requirement on both `develop` and `main`. Which command to use depends on
whether the repository protects its branches with classic branch protection or with a ruleset, because the two
are configured separately and the branch-protection API only reports the first.

For a repository using classic branch protection, each command prints `true`:

```bash
gh api repos/lightspeedwp/.github/branches/develop/protection \
  --jq '.required_pull_request_reviews.require_code_owner_reviews'
gh api repos/lightspeedwp/.github/branches/main/protection \
  --jq '.required_pull_request_reviews.require_code_owner_reviews'
```

A ruleset repository reports nothing useful from that call, because a ruleset is not branch protection. Check the
ruleset API instead, and confirm that a rule targeting both branches requires a code-owner review:

```bash
gh api repos/lightspeedwp/.github/rulesets --jq '.[] | {id, name, target, enforcement}'
gh api repos/lightspeedwp/.github/rulesets/<ruleset-id> \
  --jq '.rules[] | select(.type == "pull_request") | .parameters.require_code_owner_review'
```

That last command prints `true` when the rule requires a Code Owners review. `required_reviewers` is a different
setting and is usually an empty list, so read `require_code_owner_review` instead.

A ruleset applies to the branches its conditions name, so also confirm it covers both branches, and confirm the
required status check on the rule:

```bash
gh api repos/lightspeedwp/.github/rulesets/<ruleset-id> --jq '.conditions.ref_name'
gh api repos/lightspeedwp/.github/rulesets/<ruleset-id> \
  --jq '.rules[] | select(.type == "required_status_checks") | .parameters.required_status_checks[].context'
```

`ref_name` lists the branches the ruleset covers, and the second command lists the required check contexts.
**Claude guard contract tests** has to appear in that list. On a ruleset repository both of these are rule
settings, not branch-protection fields.

## Measure it

- Branch compliance comes from the existing branch-validation metrics (SC-001 to SC-003).
- Once a month, a maintainer searches the team's Claude Code session history for this repository for
  `Branch guard` and reviews 10 sessions that hit a refusal. At least 9 should show Claude fixing the branch name
  and retrying without help. The same review counts refusals of actions that were correct under the rules; the
  target is 0, and each one found gets a fix and a regression test (SC-007).

## Maintain it

- Change the environment in the admin page (or your own environment settings), then update the copy in
  `.claude/cloud/` in the same PR so the repository stays the source of truth.
- Owner change procedure for the shared environment (spec 018 FR-025):
  1. The PR that changes `.claude/cloud/setup.sh` or `.claude/cloud/environment.env` refreshes
     `LS_CLOUD_ENV_REVISION`: run `bash .claude/cloud/revision.sh` and paste the result into
     `.claude/cloud/environment.env`. A CI test fails when the stamp is stale.
  2. After the merge to `develop`, an Owner pastes both files into **LightSpeed** on the Cloud environments admin page.
  3. The next new session on the current revision shows no `Cloud environment:` warning.
- Changing the setup script triggers a cache rebuild on the next session. The cache also expires after about seven days.
- When `.nvmrc` changes, update `LS_NODE_VERSION` in both the environment variables and `setup.sh`.
- Branch types come from `lib/validate-branch-name.js`, which both the guard and CI call, so they agree on everything the library accepts. That includes the semantic-version release form `release/v1.2.3`, which the library matches ahead of the general pattern. The guard's carve-out for `release/*` and `hotfix/*` targets for `main` is keyed on the prefix alone, so a `release/*` branch that is not a semantic version is still checked for its name. Only releases have a version-number form: hotfixes use `hotfix/{scope}-{title}` (for example `hotfix/auth-token-expiry`), and both the guard and CI refuse `hotfix/vX.Y.Z`. Add new types in the library.
- Changes to the guard need an Owner's review (CODEOWNERS) and green contract tests. Claude can't edit the guard's
  files while enforcement is on, so guard changes come from a person, or from a session an Owner started with
  `LS_ENFORCE_BRANCH_NAMES=0`.
- Empty `claude/*` branches left on GitHub by the platform are not deleted automatically yet. Spec 018 FR-020 defers
  auto-deletion until both a branch-age signal, such as a first-observed timestamp, and a branch-origin check that
  confirms the branch is a platform placeholder exist, because the age of a branch's last commit says nothing about
  how long the branch itself has existed. Until then, spec 009's cleanup (the
  report-only CLI from lightspeedwp/.github#3358) sends every `claude/*` branch without an open PR or matching exclusion to DISCUSS for its forbidden prefix. A
  maintainer reviewing DISCUSS can promote an empty, merged one with no open PR to DELETE (spec 009's manual review
  guidance records the route), and it is then removed only through spec 009's draft-PR approval. A `claude/*` branch with commits of its own is never promoted this way.

## Limitations

- The guard reads a command handed to another interpreter, up to three levels deep. `sh -c '...'`, `bash -c '...'`,
  `zsh -c '...'`, `dash -c '...'`, `ksh -c '...'`, `busybox sh -c '...'` and `eval '...'` are parsed as the shell
  command they carry and checked the same way as an unquoted one, because the quoting is the only thing that
  distinguishes them. Beyond the depth limit the guard refuses the command rather than allowing something it has
  not read. Two limits remain: a payload assembled at run time (`eval "git $cmd"`) is only as checkable as the
  variable it expands to, and a command written in another language entirely — `python -c`, `node -e` — is still
  out of scope, because the guard reads shell syntax and not those. For branch names specifically, CI branch
  validation remains the final gate for anything a command could construct at run time. That covers the naming
  convention only; the protected-branch policy for direct `git` and `gh` writes is enforced by the guard itself.
- The guard parses shell commands with heuristics. It catches the usual forms — plain commands, pipelines, background
  and list operators, `if`/`while`/`for`/`case` arms, parenthesised groups, redirects, here-documents and nested
  interpreters — and a `cd` in the same command list moves the directory the following git commands are judged
  against, so `cd other-repo && git commit` resolves to the directory it runs in. A `cd` inside a subshell is the
  exception: `(cd other-repo && git commit)` cannot change the parent's directory, so that command is judged against
  the branch the session is actually on, which is the stricter reading rather than a gap.
- The guard reads `gh api graphql` as well as the REST API, because GraphQL reaches the same branch writes. The
  document is read from `--query`, from a field and from an `--input` body (the body wins when `--input` is present,
  because `gh` then puts field flags in the URL query string where GraphQL ignores them), the branch names in it are
  judged by the same rules — including a whole input object passed as one variable, whose branch and repository leaves
  are resolved — and a document the guard cannot read is refused. A repeated flag is judged on its last occurrence, as
  `gh` sends the last one. A name bound to a GraphQL variable is resolved from
  the value sent with it. A foreign repository exempts only the name it scopes, for literals and variables alike, and
  every branch-writing mutation must resolve its own target. That includes `mergeBranch`, which writes to the branch
  in its `base`: a merge into a protected branch is refused, as the
  [hooks contract](../.github/specs/018-claude-cloud-environment/contracts/hooks.md) records.
- The guard reads shell syntax. It does not follow aliases, and it cannot know a name the shell builds at run time.
  A command substitution is read, so a command hidden inside `$(...)` or backticks is checked, and a wrapper such as
  `timeout` or `env` is stepped through to the command behind it.
- If Node is missing, the launcher can't run the guard, and a hook that cannot start is treated as non-blocking, so
  the launcher decides the call itself. With enforcement on it refuses git commits, pushes, branch operations and the
  GitHub tools with `Branch guard unavailable`, and allows everything else with a warning. It judges a call by the
  same patterns the guard uses on its own fault path, which is coarser than the guard: it does not read nested shells
  or guard-file writes. Start the session with `LS_ENFORCE_BRANCH_NAMES=0` to turn the refusals into warnings. The
  switch is honoured by the launcher whenever the guard cannot run at all, which is a missing interpreter and a
  missing guard file, so a session can be recovered deliberately. The setup script installs Node.
- Pushing a renamed branch relies on the platform's push protection allowing the session's current branch. If the
  platform changes this, pushes are rejected (not redirected), and the checks above catch it.
- `release/vX.Y.Z` names are accepted by the validator, so a release branch into `main` opens normally. The guard's
  allowance for a `release/*` or `hotfix/*` target is keyed on the prefix, so a release branch whose name is not a
  semantic version is still checked against the convention.
- Cloud sessions do not read your personal `~/.claude/` settings. Anything the team relies on must live in the
  repository or the shared environment.

## Delivered and remaining

**Delivered**

- The shared environment definition and the branch guard (lightspeedwp/.github#3524, merged 2026-09-30).
- The guard gaps tracked in lightspeedwp/.github#3691: all seven are fixed (#3745 and #3726), and that issue is closed.
- The spec 018 clarifications and convergence fixes (#3726), and the cleanup documentation close-out (#3813).
- The revision stamp for the shared environment definition (`.claude/cloud/revision.sh` and `LS_CLOUD_ENV_REVISION`),
  checked by a CI test (spec 018 FR-025).

**Remaining, and still limitations**

- The Owner setup is not yet verified live: the shared **LightSpeed** environment, the organisation default, the
  managed CLI default, and the Code Owners review and required check on `develop` and `main`. The evidence is tracked in
  lightspeedwp/.github#3736.
- The session-start warnings (`Cloud environment:`, spec 018 FR-024 and FR-025) are specified and documented here, but
  the session-start change that shows them isn't shipped yet. It edits the guard's own files, so a person makes it.
- Automatic deletion of empty `claude/*` branches is deferred (spec 018 FR-020) until a branch-age signal and a
  branch-origin check exist. Until then a maintainer promotes empty branches by hand.
- The limits listed under Limitations still apply: the guard reads shell syntax with heuristics, sessions with several
  repositories don't load repository settings, and pushing a renamed branch relies on the platform's push protection.
  CI branch validation and Code Owners review remain the final gate.

## Depends on

- `lib/validate-branch-name.js`, which the guard and CI both call, so they agree on every branch name.
- GitHub branch protection or a ruleset on `develop` and `main`: **Require review from Code Owners** and the
  **Claude guard contract tests** check. An Owner sets both, and they aren't verified live yet (see Delivered and
  remaining).
- Spec 009's branch cleanup, for the route that removes empty `claude/*` branches by hand.
- The platform: cloud sessions authenticate `gh` through the GitHub proxy, and the platform's push protection allows
  pushing the renamed current branch.

## Related

- [Branching strategy](./BRANCHING_STRATEGY.md)
- [PR creation process](./PR_CREATION_PROCESS.md)
- [Spec 018](../.github/specs/018-claude-cloud-environment/spec.md), the requirements. Its supporting artefacts are in
  the same folder: the [plan](../.github/specs/018-claude-cloud-environment/plan.md),
  [research](../.github/specs/018-claude-cloud-environment/research.md),
  [data model](../.github/specs/018-claude-cloud-environment/data-model.md),
  [quickstart](../.github/specs/018-claude-cloud-environment/quickstart.md),
  [tasks](../.github/specs/018-claude-cloud-environment/tasks.md), the
  [hooks contract](../.github/specs/018-claude-cloud-environment/contracts/hooks.md), the
  [cloud environment contract](../.github/specs/018-claude-cloud-environment/contracts/cloud-environment.md), the
  [branch cleanup contract](../.github/specs/018-claude-cloud-environment/contracts/branch-cleanup.md) and the
  [requirements](../.github/specs/018-claude-cloud-environment/checklists/requirements.md) and
  [security](../.github/specs/018-claude-cloud-environment/checklists/security.md) checklists.
- [Specification catalogue](../.github/specs/CATALOG.md)
- Contract checks, run in CI by [Claude Guard Tests](../.github/workflows/claude-guard-tests.yml):
  the [documentation contract test](../tests/js/claude-cloud-environment-docs.test.js), the
  [guard tests](../scripts/__tests__/enforce-branch-name-hook.test.js), the
  [session-start tests](../scripts/__tests__/session-start-hook.test.js) and the
  [setup script test](../scripts/__tests__/setup-node-install.test.js).
- **Spec numbering**: this work was first requested as spec 016, and its first specification was delivered in
  lightspeedwp/.github#3525 under a `016-claude-cloud-environment` folder. It is now **spec 018**. That older folder
  doesn't exist on `develop`, and spec 016 is now the changelog-agent quality specification. Use the spec 018 links
  above.
- [Claude Code cloud environments](https://code.claude.com/docs/en/cloud-environments)
- [Claude Code hooks](https://code.claude.com/docs/en/hooks)
