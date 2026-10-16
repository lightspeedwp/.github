# Data Model: Standardised Claude Code Cloud Environment

**Feature**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

There is no persistent storage. The "entities" are configuration values and the branch states that the hooks
and the cleanup job act on.

## Shared cloud environment

Configured in claude.ai. The canonical copy is kept in `.claude/cloud/`.

| Field | Value / rule | Source |
| --- | --- | --- |
| Name | `LightSpeed` | docs |
| Network access | `Trusted` | docs |
| Environment variables | `.env` format, no secrets (FR-018) | `.claude/cloud/environment.env` |
| Setup script | Bash, exits 0, under 5 min, idempotent (FR-016) | `.claude/cloud/setup.sh` |

### Environment variables

| Variable | Default | Meaning |
| --- | --- | --- |
| `LS_BASE_BRANCH` | `develop` | The integration branch. It is protected, the base for sync, and the PR base |
| `LS_ENFORCE_BRANCH_NAMES` | `1` | `0` turns every guard refusal into a warning (FR-013) |
| `LS_NODE_VERSION` | from `.nvmrc` | The Node version the setup script installs |
| `LS_CLOUD_ENV` | `LightSpeed` | Marks a session as running in the shared environment (R21). Unset means another environment |
| `LS_CLOUD_ENV_REVISION` | 12 hex characters | Hash of the separate digests of `setup.sh` and of `environment.env` without this line (R21). CI fails when it's stale |

### Organisation placement (R18 to R20)

| Setting | Where | Who | Value |
| --- | --- | --- | --- |
| Shared environment | claude.ai/admin-settings → Cloud environments | Owner | **LightSpeed**, from `.claude/cloud/` |
| Organisation default environment | claude.ai/admin-settings/claude-code | Owner | **LightSpeed**. It fills only an empty selection |
| CLI default (`remote.defaultEnvironmentId`) | Server-managed settings | Owner | The **LightSpeed** `env_` ID |
| Member's saved selection | Environment selector, or `/remote-env` for the CLI | Member | Changed once to **LightSpeed** |

### Session environment state (checked by `session-start.sh` in cloud sessions)

| State | Condition | Outcome |
| --- | --- | --- |
| Current | `LS_CLOUD_ENV=LightSpeed` and the revision matches the repository | No message |
| Stale | `LS_CLOUD_ENV=LightSpeed`, revision differs, or is missing or empty (which counts as differing) | Warning: an Owner should update the shared environment from `.claude/cloud/` |
| Other environment | `LS_CLOUD_ENV` unset | Warning: select **LightSpeed** in the environment selector |
| Local session | `CLAUDE_CODE_REMOTE` isn't `true` | Not checked |

In every state, session start still exits 0 and emits the branching rules (FR-003, FR-004).

## Branch classification (used by the guard)

| Class | Rule | Create / rename | Commit / push / MCP write |
| --- | --- | --- | --- |
| Compliant | `validateBranchName(name).valid` and not in another class | allowed | allowed |
| Placeholder | `^chore/session-[a-z0-9]+$` | refused | refused |
| Forbidden or invalid | the validator fails (for example `claude/*`, unknown type, malformed) | refused | refused |
| Protected | `main` or `LS_BASE_BRANCH` | refused (rename target) | `main`: always refused. Base branch: allowed only under the documentation exception, otherwise refused |
| Bot-owned | `dependabot/*`, `renovate/*` (validator exemption) | allowed | allowed |
| Open-PR head (formerly the legacy PR branch) | Forbidden or invalid, even when it exists on GitHub and is the head of an open PR. An open PR is not an exception (decision of 2026-10-15, superseding the earlier FR-006 exception). The delivered guard still allows pushes to such a branch until the follow-up change | refused | refused (FR-005, FR-006, FR-008) |

**Protected guard files** (FR-013a): `.claude/hooks/**`, `.claude/settings.json`, `.claude/settings.local.json`,
`~/.claude/settings.json` and `/etc/claude-code/managed-settings.json`. Edits through the Edit, Write, MultiEdit or NotebookEdit tools, or through Bash write
commands, are refused while `LS_ENFORCE_BRANCH_NAMES` is not `0`. Reads are always allowed. See research R12 for
why the last two paths are included.

**Documentation exception**: every affected path is a normalised repository-relative path under `.github/specs/`
or `docs/`. It is evaluated over:

- **Commit**: staged paths, plus `-a` tracked changes, plus paths from an earlier `git add` in the same command.
- **Push**: `git diff --name-only origin/<target>...<source>`.
- **MCP**: the paths in the tool input.

An empty or unknown path set fails closed.

## Session branch lifecycle

```text
claude/<words>-<hash>  --(SessionStart, cloud, 0 commits ahead of base)-->  chore/session-<hash>  (local only, not pushed)
claude/<...> with commits (existing PR)  --(SessionStart)-->  unchanged (FR-001); writes are refused until the work moves to a compliant branch and PR, which a maintainer approves
chore/session-<hash>   --(git branch -m, validated)-->  <type>/<scope>-<title>
<type>/<scope>-<title> --(git push -u)-->  remote branch  --(draft PR)-->  develop
remote claude/<...>  (empty, left by platform)  --(daily cleanup)-->  009 categorisation; auto-approved deletion is deferred until a branch-age signal exists, so the ≥24 h threshold applies only to that deferred rule
```

SessionStart resets only a placeholder it renamed itself in that invocation, on startup or resume, to
`origin/<LS_BASE_BRANCH>`, after a successful base fetch and only when it has no commits of its own and no
uncommitted or untracked changes. It never resets a branch it did not rename, even when that branch is clean and
behind the base (FR-002).

## Cleanup decision (per remote `claude/*` branch)

The cleanup is implemented in spec 009's categoriser (lightspeedwp/.github#3358). Its rules are checked in order,
and the first match wins:

1. Protected branch → KEEP.
2. Matches an exclusion pattern → KEEP.
3. Has an open PR → KEEP.
4. **New (018), deferred**: prefix `claude/`, identified as a platform placeholder by a separate branch-origin check and carrying no commits of its own, open-PR check succeeded, and observable as a branch for at least 1 day, measured from a branch-age signal rather than the age of the tip commit →
   **DELETE, auto-approved** (`auto_delete_empty_agent_branch`). This rule is not yet satisfiable: none of the three prerequisites exists (branch-age storage, retention and measurement; reliable branch-origin verification; and a delivered and verified scheduled deletion workflow; `branch-audit.yml` is absent), so no branch currently qualifies and candidates fall through to 009's categorisation. That fall-through is not always a draft PR: rule 5 sends a `claude/*` name that is invalid, or that carries its own commits, to DISCUSS. From there a maintainer may promote an empty, merged one with no open PR to DELETE, which then goes through draft-PR approval (R16); one carrying its own commits is never promoted. Spec 009 does not define the promotion route yet; T063 records it there after #3358 merges.
5. Invalid name (including `claude/*` branches with their own commits) → DISCUSS (unchanged 009 rule).
6. All later 009 rules are unchanged.

If open-PR verification is unavailable, rule 4 never applies. The branch falls through to 009's existing
"verification unavailable" DISCUSS rule.

**Deletion step** (in 009's scheduled workflow) for each auto-approved branch:

1. Re-check, against the tip the delete will act on, that the branch is still a platform placeholder, still has no commits of its own, and still has no open PR. Merge status is deliberately not re-checked: it is no longer an eligibility condition.
2. Delete it.
3. Record the result.

Any failure → carry on with the other branches; the job ends with 009's partial-failure status (exit 2).
