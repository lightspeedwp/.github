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

## R9. Legacy PR exception: confirming an open PR from inside the guard

- **Decision**: Check for an open PR only on the rare path where a push, commit or MCP write would otherwise be
  refused for a non-compliant branch. The check has two steps:
  1. `git ls-remote --exit-code --heads origin <branch>`, to confirm the branch exists on GitHub.
  2. `gh pr list --head <branch> --state open --json number --limit 1`, to confirm an open PR exists.

  Each step has a 5-second timeout. Any failure, timeout or empty result means "not verified", and the action is
  refused (FR-006).
- **Rationale**:
  - `gh` is pre-installed in cloud sessions and authenticates through the GitHub proxy (`GH_TOKEN=proxy-injected`),
    so it needs no token. Locally it uses the developer's own `gh` login.
  - Running the check only on the refusal path keeps compliant pushes fast (performance goal of 150 ms or less).
- **Alternatives considered**:
  - The GitHub MCP tools: hooks can't call them, so this was rejected.
  - Caching PR state for the session: that risks stale "open" answers after a merge, so it was rejected.

## R10. Session start on an existing `claude/*` branch (FR-001)

- **Decision**: Rename a `claude/*` branch only when `git rev-list --count origin/<base>..HEAD` is 0 (a fresh
  platform branch). If the branch has commits, leave it alone. Commits and pushes on it are then judged by the
  guard, and allowed only under the legacy PR exception.
- **Rationale**: A session opened on an existing PR shouldn't have its branch renamed away from the PR head.
  This check needs only git, with no network access.
- **Alternatives considered**: Asking GitHub whether the branch has a PR at session start adds network latency to
  every session, so it was rejected.

## R11. Guard faults (FR-012a)

- **Decision**:
  - Load the validator with a dynamic `await import()` inside a `try`, and wrap all evaluation in the same `try`.
  - On a fault, classify the call without the validator:
    - Bash commands matching `\bgit\b[^|;&]*\b(commit|push|branch|checkout|switch)\b` are git writes, and are
      refused with exit 2 and "Branch guard unavailable: {error}. Open an issue on lightspeedwp/.github".
    - Matched GitHub MCP branch, file and PR tools are refused the same way.
    - Everything else is allowed with exit 0 and a warning in `systemMessage`.
  - Malformed stdin JSON is still allowed silently.
- **Rationale**: A static import failure would crash Node before any handler ran. Claude Code treats a non-2 exit
  as a non-blocking error, so that would silently fail open. The dynamic import keeps the fail-closed decision in
  the guard's hands.
- **Known limit**: If `node` itself is missing, the hook can't run at all, and Claude Code carries on. The setup
  script installs Node, and the quickstart checks for it.

## R12. Guard self-protection (FR-013a)

- **Decision**:
  - Extend the PreToolUse matcher to `Edit|Write|MultiEdit|NotebookEdit`.
  - For those tools: resolve `tool_input.file_path` (or `notebook_path`) against the project directory, following
    `..` and symlinks with `realpath` where the file exists. Refuse when the path is protected.
  - For Bash: refuse a command segment that names a protected path together with a write verb. The write verbs
    are:
    - `sed -i`, `perl -i`, `mv`, `rm`, `cp` (when the destination is protected), `tee`, `truncate`, `chmod`, `ln`
    - `>` or `>>` redirection
    - `git checkout … -- <path>`, `git restore`, `git rm`, `git mv`, `git apply`
  - Reading protected files is always allowed.
- **Protected paths**: `.claude/hooks/**` and `.claude/settings.json`, as the spec states. The plan also covers
  two files that can switch the guard off without touching those:
  - `.claude/settings.local.json`
  - the user settings file `~/.claude/settings.json`

  Both accept `disableAllHooks` or overriding hook entries.

  **Spec**: FR-013a now lists all four paths (third clarification session, threat-model question).
- **CODEOWNERS**: Add `/.claude/ @ashleyshaw @lightspeedwp/lightspeed`, following the existing explicit-path
  convention. The global `*` rule already covers it, but an explicit line makes the requirement visible and
  survives changes to the fallback.
- **Rationale**: Hook and settings changes are picked up during the session, so self-edits are the cheapest way
  around the guard. CODEOWNERS review is the backstop for anything the parser misses.
- **Alternatives considered**: Making the files read-only in the setup script was rejected. It only applies in
  the cloud, and the agent runs as root, so it can undo it.

## R13. Threat model and the enforcement switch (FR-013, third clarification session)

- **Decision**: The guard targets accidental non-compliance and the obvious self-bypasses. The enforcement switch
  (`LS_ENFORCE_BRANCH_NAMES`) is read only from the hook's own process environment. Claude Code passes that
  environment down from how the session started: the cloud environment's variables, or the developer's shell
  when they launched Claude locally.
- **Why the agent can't flip it in a session**:
  - Hooks run as children of the Claude Code process, not of the agent's Bash tool. So `export
    LS_ENFORCE_BRANCH_NAMES=0` or `LS_ENFORCE_BRANCH_NAMES=0 git commit` in a Bash call never reaches the hook.
  - The only in-session route is a settings file `env` block or `disableAllHooks`, and R12 already protects those
    files.
- **Local developers**: someone who launches Claude with the switch set to `0` in their own shell is making a
  deliberate human choice. That's outside the threat model, and CI branch validation still applies to anything
  they push.
- **Validator authority (FR-010)**: `.github/workflows/branch-name-validation.yml` runs
  `scripts/validation/validate-branch-name.js`, which imports `lib/validate-branch-name.js`. The guard imports the
  same library (R3), so the guard and CI can't disagree. `scripts/validation/validate-branch-name.cjs` is a
  separate CommonJS copy that CI doesn't run. Merging the two is out of scope here (see spec 009 finding F5).
