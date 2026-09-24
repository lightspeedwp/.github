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
| Protected | `main` or `LS_BASE_BRANCH` | refused (rename target) | allowed only under the documentation exception, otherwise refused |
| Bot-owned | `dependabot/*`, `renovate/*` (validator exemption) | allowed | allowed |

**Documentation exception**: every affected path is a normalised repository-relative path under `.github/specs/`
or `docs/`. It is evaluated over:

- **Commit**: staged paths, plus `-a` tracked changes, plus paths from an earlier `git add` in the same command.
- **Push**: `git diff --name-only origin/<target>...<source>`.
- **MCP**: the paths in the tool input.

An empty or unknown path set fails closed.

## Session branch lifecycle

```text
claude/<words>-<hash>  --(SessionStart, cloud)-->  chore/session-<hash>  (local only, not pushed)
chore/session-<hash>   --(git branch -m, validated)-->  <type>/<scope>-<title>
<type>/<scope>-<title> --(git push -u)-->  remote branch  --(draft PR)-->  develop
remote claude/<...>  (empty, left by platform)  --(daily cleanup, tip ≥24 h old, no open PR)-->  deleted
```

When the tree is clean and has no local commits, SessionStart also resets the branch to `origin/<LS_BASE_BRANCH>`
(FR-002).

## Cleanup decision (per remote `claude/*` branch)

The rules are checked in order, and the first match wins:

1. Doesn't match `--includePatterns` (`^claude/`) → ignore.
2. Head of an open PR → keep ("has open pull request").
3. Not merged into `develop` or `main`, so it has its own commits → keep, and list it for review (FR-021).
4. Tip commit less than 1 day old → keep.
5. Otherwise → delete. Dry-run only reports it (FR-022).

A deletion failure is recorded, the remaining branches are still processed, and the job exits with 1.
