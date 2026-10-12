# Contract: Shared Cloud Environment and Drift Check

**Feature**: [spec.md](../spec.md) · **Plan**: [plan.md](../plan.md) · Research R18 to R22

## Canonical files

| File | Rule |
| --- | --- |
| `.claude/cloud/environment.env` | `.env` format, no secrets. Must contain `LS_BASE_BRANCH`, `LS_ENFORCE_BRANCH_NAMES`, `LS_NODE_VERSION`, `LS_CLOUD_ENV=LightSpeed` and `LS_CLOUD_ENV_REVISION` |
| `.claude/cloud/setup.sh` | Bash, exits 0, under 5 minutes, safe to rerun, repository-agnostic (FR-016, R22) |

## Revision stamp

```text
LS_CLOUD_ENV_REVISION = first 12 hex chars of
  sha256( bytes(setup.sh) + bytes(environment.env with every line starting "LS_CLOUD_ENV_REVISION=" removed) )
```

**Byte rule (confirmed 2026-10-12)**: the hashed input is the exact bytes of `setup.sh`, followed by the lines of
`environment.env` that remain once every line starting `LS_CLOUD_ENV_REVISION=` is removed, where **every remaining
line is newline-terminated**, including a final line that had no trailing newline. That is what `grep -v` writes.
`setup.sh` is hashed as stored, with no normalisation.

- The shell helper (`.claude/cloud/revision.sh`) and a Node recomputation in the CI test must follow this rule and
  give the same value:
  - shell: `{ cat setup.sh; grep -v '^LS_CLOUD_ENV_REVISION=' environment.env; } | sha256sum | cut -c1-12`
  - Node: split `environment.env` on `\n`, drop a trailing empty element left by a final newline, filter out the
    revision line, then append `\n` to each remaining line.
- The CI test must cover an `environment.env` with a trailing newline and one without, so the two implementations
  can't disagree on the last line.
- One implementation of the stamp is shared by `session-start.sh` and the helper. Both read the files from the
  repository checkout.
- CI contract: a Jest test fails, with the expected value in the message, when the stamp in `environment.env`
  doesn't match the files.

## SessionStart drift check

It runs only when `CLAUDE_CODE_REMOTE=true` and the source is `startup` or `resume`. It runs after the branch
handling, and it never changes the exit code (always 0) or the existing `additionalContext`.

| Input | Output |
| --- | --- |
| `LS_CLOUD_ENV=LightSpeed`, revision matches | Nothing extra |
| `LS_CLOUD_ENV=LightSpeed`, `LS_CLOUD_ENV_REVISION` differs from the repository's, or is missing or empty (a missing or empty value counts as differing, and `<a>` then reads `unset`) | `systemMessage`: `Cloud environment: LightSpeed is out of date (session <a>, repository <b>). An Owner should update it from .claude/cloud/ — see docs/CLAUDE_CLOUD_ENVIRONMENT.md.` |
| `LS_CLOUD_ENV` unset | `systemMessage`: `Cloud environment: this session isn't using the shared LightSpeed environment. Select LightSpeed (under Organization) in the environment selector for new sessions.` |
| `sha256sum` missing or a file unreadable | Nothing extra (the check is skipped silently) |

Both messages start with `Cloud environment:`, so they can't be confused with the guard's `Branch guard:` text in
the SC-007 transcript search.

## Owner change procedure

1. A PR changes `setup.sh` or `environment.env`, and updates `LS_CLOUD_ENV_REVISION` (CI enforces this).
2. After the merge to `develop`, an Owner pastes both files into **LightSpeed** on the Cloud environments admin page.
   Changing the setup script rebuilds the environment cache.
3. The next new session on the current revision shows no drift warning.
