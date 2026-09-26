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
[spec 016](../.github/specs/016-claude-cloud-environment/spec.md).

## The problem this solves

When a cloud session starts, the platform checks out an auto-generated branch such as
`claude/affectionate-gauss-x2ahdr`, and its system prompt tells Claude to develop on and push to that branch. That
instruction is set by the platform, so no environment setting can rename it. Left alone, Claude pushes `claude/*`
branches, which breaks PR template routing, labelling and the `branch-name-validation` workflow.

The fix is layered, so the rule holds even when one layer is skipped:

| Layer                 | Lives in                                                                                                          | Runs                                                                  | What it does                                                                                                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Setup script          | Environment settings (copy in [`.claude/cloud/setup.sh`](../.claude/cloud/setup.sh))                              | Once per environment cache build (about every 7 days)                 | Installs Node matching `.nvmrc`, `shellcheck`, `actionlint` and `gh`; sets git defaults                                                                                                                                    |
| Environment variables | Environment settings (copy in [`.claude/cloud/environment.env`](../.claude/cloud/environment.env))                | Every session                                                         | `LS_BASE_BRANCH=develop`, the enforcement switch, npm and locale defaults                                                                                                                                                  |
| SessionStart hook     | [`.claude/hooks/session-start.sh`](../.claude/hooks/session-start.sh)                                             | Every session, cloud and local                                        | Moves a fresh `claude/*` branch onto a local placeholder, syncs it with `develop`, runs `npm install`, and injects the branching rules into Claude's context, stating that they override the platform's branch instruction |
| Branch guard          | [`.claude/hooks/enforce-branch-name.mjs`](../.claude/hooks/enforce-branch-name.mjs) (PreToolUse)                  | Before every Bash, file-editing and GitHub tool call, cloud and local | Refuses commits, pushes, branches, file writes and PRs that break the strategy, and protects its own files                                                                                                                 |
| CI                    | [`claude-guard-tests.yml`](../.github/workflows/claude-guard-tests.yml), `branch-name-validation.yml`, CODEOWNERS | Every PR and push                                                     | Runs the guard's contract tests, validates branch names, and requires an Owner's review for `.claude/`                                                                                                                     |

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
  to your own compliant branch and branch deletions are allowed.
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
using unusual shell constructions. CI branch validation and CODEOWNERS review are the final gate.

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
   - add **Claude guard contract tests** (from `claude-guard-tests.yml`) to the required status checks.
9. Optional, for `claude --cloud`: copy the environment's ID (`env_...`) and add
   `"remote": { "defaultEnvironmentId": "env_..." }` to `.claude/settings.json` in a follow-up PR. Project settings take
   precedence over each person's `/remote-env` choice, so terminal-started cloud sessions from this repository use it too.

On a Pro or Max plan without admin settings, create the same environment yourself: in claude.ai/code open the
environment selector → **Add cloud environment**, and fill in the same fields.

## Use it (everyone)

- In claude.ai/code or the desktop app, check the environment selector shows **LightSpeed** (under **Organization**)
  before starting a session.
- From the terminal, run `/remote-env` once and pick **LightSpeed**; `claude --cloud` then uses it.
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

An Owner then confirms branch protection, with each command printing `true`:

```bash
gh api repos/lightspeedwp/.github/branches/develop/protection \
  --jq '.required_pull_request_reviews.require_code_owner_reviews'
gh api repos/lightspeedwp/.github/branches/main/protection \
  --jq '.required_pull_request_reviews.require_code_owner_reviews'
```

and that **Claude guard contract tests** is listed under the required status checks for both branches.

## Measure it

- Branch compliance comes from the existing branch-validation metrics (SC-001 to SC-003).
- Once a month, a maintainer searches the team's Claude Code session history for this repository for
  `Branch guard` and reviews 10 sessions that hit a refusal. At least 9 should show Claude fixing the branch name
  and retrying without help. The same review counts refusals of actions that were correct under the rules; the
  target is 0, and each one found gets a fix and a regression test (SC-007).

## Maintain it

- Change the environment in the admin page (or your own environment settings), then update the copy in
  `.claude/cloud/` in the same PR so the repository stays the source of truth.
- Changing the setup script triggers a cache rebuild on the next session. The cache also expires after about seven days.
- When `.nvmrc` changes, update `LS_NODE_VERSION` in both the environment variables and `setup.sh`.
- Branch types come from `lib/validate-branch-name.js`, so the guard and CI always agree. Add new types there.
- Changes to the guard need an Owner's review (CODEOWNERS) and green contract tests. Claude can't edit the guard's
  files while enforcement is on, so guard changes come from a person, or from a session an Owner started with
  `LS_ENFORCE_BRANCH_NAMES=0`.
- Empty `claude/*` branches left on GitHub by the platform are removed by spec 009's scheduled cleanup, which
  auto-approves them once they are merged, have no open PR and are at least a day old.

## Limitations

- The guard parses shell commands with heuristics. It catches the usual forms, but not every creative variant (for
  example `cd other-repo && git commit`, `eval` or aliases). CI branch validation stays the final gate.
- If Node is missing, the hook can't run and the guard fails open. The setup script installs Node.
- Pushing a renamed branch relies on the platform's push protection allowing the session's current branch. If the
  platform changes this, pushes are rejected (not redirected), and the checks above catch it.
- `release/vX.Y.Z` names are documented in the branching strategy but rejected by the validator today, so release PRs
  into `main` can't be opened from a session until the validator is fixed.
- Cloud sessions do not read your personal `~/.claude/` settings. Anything the team relies on must live in the
  repository or the shared environment.

## Related

- [Branching strategy](./BRANCHING_STRATEGY.md)
- [PR creation process](./PR_CREATION_PROCESS.md)
- [Spec 016](../.github/specs/016-claude-cloud-environment/spec.md)
- [Claude Code cloud environments](https://code.claude.com/docs/en/cloud-environments)
- [Claude Code hooks](https://code.claude.com/docs/en/hooks)
