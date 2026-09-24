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

## Branch classification (used by the guard)

| Class | Rule | Create / rename | Commit / push / MCP write |
| --- | --- | --- | --- |
| Compliant | `validateBranchName(name).valid` and not in another class | allowed | allowed |
| Placeholder | `^chore/session-[a-z0-9]+$` | refused | refused |
| Forbidden or invalid | the validator fails (for example `claude/*`, unknown type, malformed) | refused | refused |
| Protected | `main` or `LS_BASE_BRANCH` | refused (rename target) | `main`: always refused. Base branch: allowed only under the documentation exception, otherwise refused |
| Bot-owned | `dependabot/*`, `renovate/*` (validator exemption) | allowed | allowed |
| Legacy PR branch | Forbidden or invalid, but exists on GitHub **and** is the head of an open PR (checked through `git ls-remote` and `gh pr list`, and fails closed) | refused | allowed (FR-006) |

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
claude/<...> with commits (existing PR)  --(SessionStart)-->  unchanged; writes allowed only as a legacy PR branch
chore/session-<hash>   --(git branch -m, validated)-->  <type>/<scope>-<title>
<type>/<scope>-<title> --(git push -u)-->  remote branch  --(draft PR)-->  develop
remote claude/<...>  (empty, left by platform)  --(daily cleanup, tip ≥24 h old, no open PR)-->  deleted
```

When the tree is clean and has no local commits, SessionStart also resets the branch to `origin/<LS_BASE_BRANCH>`
(FR-002).

## Cleanup decision (per remote `claude/*` branch)

The cleanup is implemented in spec 009's categoriser (lightspeedwp/.github#3358). Its rules are checked in order,
and the first match wins:

1. Protected branch → KEEP.
2. Matches an exclusion pattern → KEEP.
3. Has an open PR → KEEP.
4. **New (016)**: prefix `claude/`, merged to a base branch, open-PR check succeeded, tip at least 1 day old →
   **DELETE, auto-approved** (`auto_delete_empty_agent_branch`).
5. Invalid name (including `claude/*` branches with their own commits) → DISCUSS (unchanged 009 rule).
6. All later 009 rules are unchanged.

If open-PR verification is unavailable, rule 4 never applies. The branch falls through to 009's existing
"verification unavailable" DISCUSS rule.

**Deletion step** (in 009's scheduled workflow) for each auto-approved branch:

1. Re-check that the branch is still merged and has no open PR.
2. Delete it.
3. Record the result.

Any failure → carry on with the other branches; the job ends with 009's partial-failure status (exit 2).
