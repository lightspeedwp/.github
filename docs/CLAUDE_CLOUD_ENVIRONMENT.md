---
file_type: documentation
title: Claude Code Cloud Environment
description: Shared cloud environment configuration for Claude Code sessions on lightspeedwp/.github, tuned to the organisation branching strategy
created_date: 2026-09-23
last_updated: 2026-09-23
author: LightSpeed Team
language: en
version: 1.0.0
status: active
---

# Claude Code Cloud Environment

Every Claude Code cloud session (claude.ai/code, the desktop and mobile apps, `claude --cloud`, routines) runs in a
[cloud environment](https://code.claude.com/docs/en/cloud-environments). This guide sets up one shared
**LightSpeed** environment so everyone on the team starts from the same configuration, and so Claude follows the
[branching strategy](./BRANCHING_STRATEGY.md) instead of the platform defaults.

## The problem this solves

When a cloud session starts, the platform checks out an auto-generated branch such as
`claude/affectionate-gauss-x2ahdr`, and its system prompt tells Claude to develop on and push to that branch. That
instruction is set by the platform, so no environment setting can rename it. Left alone, Claude pushes `claude/*`
branches, which breaks PR template routing, labelling and the `branch-name-validation` workflow.

The fix is layered, so the rule holds even when one layer is skipped:

| Layer                 | Lives in                                                                                           | Runs                                                  | What it does                                                                                                                                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Setup script          | Environment settings (copy in [`.claude/cloud/setup.sh`](../.claude/cloud/setup.sh))               | Once per environment cache build (about every 7 days) | Installs Node matching `.nvmrc`, `shellcheck` and `actionlint`; sets git defaults                                                                                                                            |
| Environment variables | Environment settings (copy in [`.claude/cloud/environment.env`](../.claude/cloud/environment.env)) | Every session                                         | `LS_BASE_BRANCH=develop`, enforcement switch, npm and locale defaults                                                                                                                                        |
| SessionStart hook     | [`.claude/hooks/session-start.sh`](../.claude/hooks/session-start.sh)                              | Every session, cloud and local                        | Moves off `claude/*` onto a local placeholder, syncs with `develop`, runs `npm install`, and injects the branching rules into Claude's context, stating that they override the platform's branch instruction |
| Branch guard          | [`.claude/hooks/enforce-branch-name.mjs`](../.claude/hooks/enforce-branch-name.mjs) (PreToolUse)   | Before every Bash and GitHub tool call                | Blocks commits, pushes, branch creation and PRs that use an invalid name, a `chore/session-*` placeholder or a protected branch                                                                              |

The hooks are committed to the repository, so they apply to every cloud session on this repository, whichever
environment it uses. The environment adds the toolchain and the shared variables.

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
   default environment to **LightSpeed**. New sessions then use it unless someone picks another.
8. Optional, for `claude --cloud`: copy the environment's ID (`env_...`) and add
   `"remote": { "defaultEnvironmentId": "env_..." }` to `.claude/settings.json` in a follow-up PR. Project settings take
   precedence over each person's `/remote-env` choice, so terminal-started cloud sessions from this repository use it too.

On a Pro or Max plan without admin settings, create the same environment yourself: in claude.ai/code open the
environment selector → **Add cloud environment**, and fill in the same fields.

## Use it (everyone)

- In claude.ai/code or the desktop app, check the environment selector shows **LightSpeed** (under **Organization**)
  before starting a session.
- From the terminal, run `/remote-env` once and pick **LightSpeed**; `claude --cloud` then uses it.
- Start sessions on this repository on its own. A session with several repositories does not load any repository's
  `.claude/settings.json`, so the hooks do not run there.

## What a session looks like

1. The session starts on `claude/<random>-<hash>`.
2. The SessionStart hook renames it locally to `chore/session-<hash>` (not pushed), resets it to `origin/develop` if
   it has no work yet, installs npm dependencies, and hands Claude the branching rules.
3. Before its first commit, Claude renames the branch to match the task, for example
   `git branch -m feat/issue-triage-labels`, then validates it with `npm run validate:branch-name -- --current`.
4. If Claude tries to commit or push on the placeholder, a `claude/*` name or `develop`/`main`, the guard blocks the
   call and says how to fix it.
5. Claude pushes with `git push -u origin <name>` and opens a draft PR against `develop`. The platform's push
   protection allows pushing the renamed current branch.

## Check it works

In a new session, ask Claude to run:

```bash
git branch --show-current                     # chore/session-<hash>, not claude/...
node -v                                       # v24.x (from .nvmrc)
command -v shellcheck actionlint              # both present
echo "$LS_BASE_BRANCH"                        # develop
npm run validate:branch-name -- --current     # fails on the placeholder, as intended
```

Then ask it to make a trivial commit without renaming. The guard should block the commit.

## Maintain it

- Change the environment in the admin page (or your own environment settings), then update the copy in
  `.claude/cloud/` in the same PR so the repository stays the source of truth.
- Changing the setup script triggers a cache rebuild on the next session. The cache also expires after about seven days.
- When `.nvmrc` changes, update `LS_NODE_VERSION` in both the environment variables and `setup.sh`.
- Branch types come from `lib/validate-branch-name.js`, so the guard and CI always agree. Add new types there.
- In an emergency, set `LS_ENFORCE_BRANCH_NAMES=0` in the environment to turn guard blocks into warnings.

## Limitations

- The platform still creates the `claude/*` branch on GitHub when a session starts. The hook does not delete it,
  because pushes are limited to the current branch. A maintainer should prune stale `claude/*` branches periodically.
- The guard parses shell commands with simple heuristics. It catches the usual `git commit`, `git push`,
  `git branch -m`, `git checkout -b` and `git switch -c` forms, but not every creative variant (for example
  `cd other-repo && git commit`).
- Cloud sessions do not read your personal `~/.claude/` settings. Anything the team relies on must live in the
  repository or the shared environment.

## Related

- [Branching strategy](./BRANCHING_STRATEGY.md)
- [PR creation process](./PR_CREATION_PROCESS.md)
- [Claude Code cloud environments](https://code.claude.com/docs/en/cloud-environments)
- [Claude Code hooks](https://code.claude.com/docs/en/hooks)
