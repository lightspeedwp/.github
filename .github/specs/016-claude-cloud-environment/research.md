# Research: Standardised Claude Code Cloud Environment

**Feature**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md) · **Date**: 2026-09-24

Each entry records a decision, why it was made, and what else was considered. The baseline is the draft
implementation in lightspeedwp/.github#3524.

## R1. Where the branch rule can be enforced

- **Decision**: Enforce in Claude Code hooks committed to the repository: a SessionStart hook for context, and a
  PreToolUse hook as a hard gate. The cloud environment's settings only provide tooling and variables.
- **Rationale**: The platform creates the `claude/*` branch and tells the agent to use it, and no environment
  setting changes either. Repository hooks run in every single-repository session, cloud and local (FR-014), and
  are version-controlled.
- **Alternatives considered**:
  - The setup script: it is cached, runs before the clone may exist and doesn't run every session, so it was rejected.
  - A git `pre-push` hook: the repo sets `core.hooksPath=.husky/_`, a second hook system would affect human pushes,
    and it can't see GitHub MCP calls, so it was rejected.
  - CI only: it catches problems after the push, which is too late for template routing, so it stays as the final
    backstop only.

## R2. Can a renamed branch be pushed from a cloud session?

- **Decision**: Yes. The session renames locally and pushes the new name.
- **Rationale**: The platform's push protection only allows pushes to "the session's current working branch". This
  was checked in practice: the renamed `config/claude-cloud-environment` branch pushed successfully. Deleting
  another remote branch was refused.
- **Consequence**: The session can't delete its own `claude/*` remote branch. That work goes to the scheduled
  cleanup (R6).

## R3. Validating branch names

- **Decision**: Import `validateBranchName` from `lib/validate-branch-name.js` in the guard.
- **Rationale**: This is the same library CI uses (FR-010), so there is no second list of types to drift.
- **Alternatives considered**: Calling `npm run validate:branch-name` in a subprocess was slower (about 300 ms per
  tool call), so it was rejected.

## R4. Documentation exception: working out which files a commit or push touches

- **Decision**:
  - `git commit`:
    - Files staged at hook time (`git diff --cached --name-only`).
    - Tracked changes too (`git diff --name-only`) when `-a`/`--all` is present.
    - Files named by any earlier `git add <paths>` in the same command. `git add -A`/`.`/`--all` means every path
      in `git status --porcelain`.
  - `git push` to a protected branch: `git diff --name-only origin/<target>...<source ref>`.
  - GitHub MCP writes: the `path` field of `create_or_update_file` and `delete_file`, and `files[].path` of
    `push_files`.
- **Covered paths**: `.github/specs/**` and `docs/**`, matched as repository-relative prefixes. `docs/../x` is
  rejected after normalisation.
- **Rationale**: The PreToolUse hook runs before the command, so any `git add` in the same command hasn't happened
  yet. Parsing it keeps the check honest. When in doubt (an unknown file set or an unreadable diff), the guard
  fails closed and refuses.
- **Alternatives considered**: Allowing all commits on protected branches and relying on GitHub branch protection
  was rejected: Q1 asked for code to be blocked by the guard itself.

## R5. Parsing Bash commands

- **Decision**: Keep the lightweight tokeniser:
  - It strips quoted strings and here-document bodies.
  - It splits on `&&`, `||`, `;`, `|` and newlines.
  - It tracks the effective branch across `git branch -m`, `checkout -b` and `switch -c`/`switch`/`checkout` within
    one command.
- **Rationale**: This covers the forms agents actually use (17 cases verified in #3524), and CI branch validation
  remains the final gate. A full shell parser would add a dependency for little gain.
- **Known gaps (documented)**: `cd other && git commit`, aliases, and `eval`.

## R6. Cleaning up empty `claude/*` branches

- **Decision** (revised after `/speckit-analyze`, option B): Don't build a separate job. Spec 009 and
  lightspeedwp/.github#3358 get an auto-approval exception:
  - **Categorisation**: `scripts/lib/branch-categorization.js` returns `DELETE` with `autoApproved: true` and the
    reason code `auto_delete_empty_agent_branch` for a `claude/*` branch when all of these hold:
    - it is merged to a base branch
    - open-PR verification succeeded and found no open PR
    - its tip is at least 1 day old

    This check runs before the naming-violation check.
  - **Audit command**: `cleanup-branches.js` stays report-only, as 009 FR-011 requires. The JSON report lists the
    auto-approved branches.
  - **Scheduled workflow**: 009's workflow gains a deletion step. It reads the JSON report, re-checks each
    auto-approved branch (still merged, still no open PR), then deletes it. Everything else goes to the draft PR as
    before.
- **Rationale**:
  - A branch with no commits of its own holds no work, so 009's zero-data-loss goal holds.
  - Keeping one categoriser and one workflow avoids duplication (constitution III).
  - The audit command never deletes, so 009's command-line contract is unchanged.
- **Consequences**:
  - FR-020 to FR-022 depend on #3358 merging first.
  - The exit codes follow 009: 0 for success, 1 for fatal, 2 for partial failure.
- **"Age"**: the tip commit's date, as in 009 FR-005. The spec's edge case accepts that an empty branch can go
  within a day of its session starting.
- **Alternatives considered**:
  - A: route `claude/*` through the draft PR. This needs a person to approve every day to meet SC-002, so it was
    rejected.
  - C: a separate deleter that calls the GitHub API. This duplicates logic and sidesteps 009, so it was rejected.
  - The original plan, reusing the current script with `--dryRun=false`: #3358 makes that a fatal error, so it was
    withdrawn.

## R7. Tooling in the cloud environment

- **Decision**: The setup script installs:
  - Node from `.nvmrc` into `/opt/node<major>`, symlinked into `/root/.local/bin`, which is first on `PATH`.
  - `shellcheck`, via apt.
  - `actionlint`, via `go install`.
  It also sets system-level git defaults.
- **Rationale**: The image ships Node 22 on `PATH` from `/opt/node22/bin`. GitHub release assets from repositories
  not attached to the session return 403, so actionlint comes from the Go module proxy. A measured run took about
  22 s, well under the 5-minute limit (FR-016).

## R8. Measuring success

- **Decision**: No refusal telemetry (Q5). SC-001 to SC-003 come from `branch-validation-metrics-aggregator.yml`
  and PR-template routing. SC-007 is a monthly manual review of 10 sessions.
- **Rationale**: It collects no data from people's sessions and adds nothing to build or store.
