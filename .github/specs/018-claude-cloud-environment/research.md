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
    - it is a platform placeholder, proven by a **separate branch-origin check** rather than by merge status
    - it has no commits of its own, because a placeholder that received commits after creation stops being empty
    - open-PR verification succeeded and found no open PR
    - it has been continuously observable as a branch for at least 1 day, from a branch-age signal such as a first-observed timestamp, never from the age of its tip commit

    The origin check is deliberately not "merged to a base branch". Spec 009 FR-002 defines merged as the tip appearing
    in a base branch's merge-base history, which is also true of a `claude/*` branch carrying real work that was later
    merged upstream. Deleting those would remove the branch while its work survives, but the category is named for
    empty agent branches and FR-021 promises a branch failing an FR-020 condition is never auto-deleted. Until a
    reliable origin signal exists, the same reasoning that defers the deletion itself defers this condition too.

    This check runs before the naming-violation check. The rule is specified but **cannot fire yet**, and
    it is blocked twice over: the branch-age signal its third condition depends on does not exist, and
    neither does a reliable branch-origin signal. Building only the age signal would still leave the
    condition unsatisfiable, so the rule stays deferred until both exist. Until then the categoriser
    returns the result spec 009 would have produced anyway. See "Age" below.

  - **Audit command**: `cleanup-branches.js` stays report-only, as 009 FR-011 requires. The JSON report lists the
    auto-approved branches, which is an empty set for as long as the deferral holds.
  - **Scheduled workflow (deferred)**: 009's workflow gains a deletion step **once the branch-age signal exists**.
    While the deferral holds the step has nothing to do: it reads the JSON report, finds no `autoApproved` entry,
    and deletes nothing. Everything else follows 009's categorisation as before: its DELETE candidates go to the
    draft PR, while an invalid `claude/*` name or one carrying its own commits goes to DISCUSS. A maintainer
    may promote an empty, merged one with no open PR from DISCUSS to DELETE, and it then goes through that
    approval (R16). When the step is enabled it re-checks each auto-approved
    branch against the tip it is about to act on (still a platform placeholder, still no commits of its own,
    still no open PR -- not merge status, which is no longer a condition), records that tip OID, and deletes
    with `git push origin --delete <branch> --force-with-lease=<branch>:<oid>` so a push landing between the
    re-check and the delete aborts the deletion instead of discarding work.
- **Rationale**:
  - A branch with no commits of its own holds no work, so 009's zero-data-loss goal holds.
  - Keeping one categoriser and one workflow avoids duplication (constitution III).
  - The audit command never deletes, so 009's command-line contract is unchanged.
- **Consequences**:
  - FR-020 to FR-022 depend on #3358 merging first.
  - The exit codes follow 009: 0 for success, 1 for fatal, 2 for partial failure.
- **"Age"**: how long the branch has been continuously observable, measured from a branch-age signal such as a first-observed timestamp. This was originally the tip commit's date by analogy with 009 FR-005, but that is not a safe basis: a branch created moments ago can carry an old tip commit, so a fresh working branch would be auto-deleted within a day of being created. Because no branch-age signal exists to replace it and this spec keeps no persistent storage, the auto-approved deletion is deferred rather than shipped on the flawed basis; candidates fall back to 009's categorisation until the signal's storage is decided. While the deferral holds, no empty branch is auto-deleted at any age; every candidate falls back to 009's normal categorisation instead, which is KEEP, DISCUSS, or a draft-PR-approved DELETE. An invalid `claude/*` name or one carrying its own commits lands in DISCUSS, and this spec defines no route from DISCUSS to draft-PR approval, so "every candidate gets a draft PR" would be wrong.
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
  2. `gh api repos/{owner}/{repo}/pulls?head={owner}:<branch>&state=open&per_page=1`, to confirm an open PR
     exists whose head is in this repository (`head.repo.full_name` equals `base.repo.full_name`). PRs from forks
     don't qualify. It uses the REST API because cloud sessions get HTTP 403 from GitHub's GraphQL API, which
     `gh pr list` needs (found during implementation).

  Each step has a 5-second timeout. Any failure, timeout or empty result means "not verified", and the action is
  refused (FR-006).

- **Rationale**:
  - Cloud sessions authenticate `gh` through the GitHub proxy, so they need no
    separately configured token. Setup must install or confirm `gh` and verify authentication. Local sessions
    require the developer's own authenticated `gh` login.
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
  - With enforcement on, classify a fault without the validator:
    - Bash commands matching `\bgit\b[^|;&]*\b(commit|push)\b`, or a branch operation that creates, renames, deletes or
      force-resets a branch (`git branch -m/-M/-d/-D/-f`, `git checkout -b/-B`, `git switch -c/-C`), or `gh pr create`
      or a `gh api` write, are git writes, and are
      refused with exit 2 and "Branch guard unavailable: {error}. Open an issue on lightspeedwp/.github".
    - Matched GitHub MCP branch, file and PR tools are refused the same way.
    - Everything else is allowed with exit 0 and a warning in `systemMessage`.
  - With enforcement off, FR-013 takes precedence: warn in `systemMessage` and allow the write with exit 0.
  - Malformed stdin JSON is still allowed silently.
- **Rationale**: A static import failure would crash Node before any handler ran. Claude Code treats a non-2 exit
  as a non-blocking error, so that would silently fail open. The dynamic import keeps the fail-closed decision in
  the guard's hands.
- **Test hook**: tests force a fault with `LS_GUARD_FORCE_FAULT=1`, honoured only when `NODE_ENV=test`. It can
  only make the load fail; it can never load a different validator.
- **Known limit (replaced on 2026-10-01, see R15)**: If `node` itself is missing, the guard can't run at all. The
  launcher now applies the same split itself, rather than letting the call through or refusing everything.

## R12. Guard self-protection (FR-013a)

- **Decision**:
  - Extend the PreToolUse matcher to `Edit|Write|MultiEdit|NotebookEdit`.
  - For those tools: resolve `tool_input.file_path` (or `notebook_path`) against the project directory, following
    `..` and symlinks with `realpath` where the file exists. Refuse when the path is protected.
  - For Bash: refuse a command segment that names a protected path together with a write verb. The write verbs
    are:
    - `sed -i`, `perl -i`, `mv`, `rm`, `cp` (when the destination is protected), `tee`, `truncate`, `chmod`, `ln`
    - `>` or `>>` redirection outside quotes (FR-012: quote-stripping never hides an operator)
    - `git checkout … -- <path>`, `git restore`, `git rm`, `git mv`, `git apply`
  - Reading protected files is always allowed.
- **Protected paths**: `.claude/hooks/**` and `.claude/settings.json`, as the spec states. The plan also covers
  three files that can switch the guard off without touching those:
  - `.claude/settings.local.json`
  - the user settings file `~/.claude/settings.json`
  - the managed settings file `/etc/claude-code/managed-settings.json`, which takes precedence over every other settings file. The cloud
    agent runs as root, so it could otherwise write it (security checklist CHK001).

  All three accept `disableAllHooks` or overriding hook entries.

  **Spec**: FR-013a lists all five paths: the four above plus `/etc/claude-code/managed-settings.json` (security checklist review, CHK001).

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

## R14. Shell-parsing gaps found in review (CodeRabbit on #3524)

- **Decision**:
  - Here-documents: remove only the body. The rest of the opening line (redirects, pipes, `&&`) stays, so
    `cat <<'EOF' > .claude/settings.json` is still seen as a write to a protected file.
  - Pushes: check every refspec after the remote. `--tags` skips only tag-only pushes, `refs/tags/*` refspecs
    are allowed, and `--all`, `--branches` and `--mirror` are refused because they push protected branches.
  - Session start never hard-resets `main`, and `package.json` being newer than the installed tree also triggers
    `npm install`.
- **Rationale**: Each was a real bypass or wrong behaviour on the committed guard. Agents often write files with
  `cat <<'EOF' > file`, so the here-document case is the most likely in practice.
- **Alternatives considered**: Restricting the reset to renamed placeholder branches only; rejected because
  FR-002 syncs any clean branch with no commits of its own, and that reset only fast-forwards.

## R15. Guard that can't start (FR-012a, 2026-10-01)

- **Decision**: `.claude/hooks/run-guard.sh` handles a missing `node` or a missing guard script as a guard fault.
  With enforcement on, it refuses git commit, push and branch operations, and the GitHub branch, file and PR
  tools, with "Branch guard unavailable". It allows every other call with a visible warning. With enforcement off,
  it warns and allows everything (FR-013). The launcher can't load the validator, so it classifies the call with
  the same fixed patterns as R11.
- **Rationale**: The current launcher refuses every call, so a session without Node can't even run `ls` to
  diagnose the problem. Failing open would let unchecked writes through. Splitting the calls keeps writes blocked
  and the session usable.
- **Alternatives considered**: Fail open (the original known limit), rejected because it is the case enforcement
  exists for. Refuse everything (the shipped behaviour), rejected because it blocks recovery.

## R16. Removing empty `claude/*` branches while auto-deletion is deferred (FR-020, FR-021, 2026-10-02)

- **Decision**: No new automation. A maintainer reviewing the DISCUSS list may promote an empty, merged
  `claude/*` branch with no open PR to DELETE. It is then removed only through spec 009's draft-PR approval. A
  branch carrying its own commits is never promoted this way.
- **Rationale**: This reuses an approval route that already exists and keeps a person in the loop. It is safe
  under FR-020 because nothing is judged by tip-commit age, and it clears the backlog without waiting for
  branch-age storage.
- **Alternatives considered**: Leave the branches in DISCUSS until the signal exists, rejected because they pile up
  with no removal path. Build the first-observed timestamp now, rejected as out of scope until its storage and
  retention are decided.

## R17. Semantic-version hotfix names (FR-009, FR-010, 2026-10-02)

- **Decision**: Keep the validator as the authority. `release/vX.Y.Z` is the only version-number form it accepts.
  Hotfixes use `hotfix/{scope}-{title}`, and `hotfix/vX.Y.Z` is refused by both the guard and CI.
- **Rationale**: `docs/BRANCHING_STRATEGY.md` already names hotfixes by slug (`hotfix/<slug>`), so only the spec's
  old assumption disagreed. Changing the validator would affect CI in every repository that uses it.
- **Alternatives considered**: Accept `hotfix/vX.Y.Z` in the validator, either as a dependency outside this spec or
  inside it. Both were rejected as unnecessary, because FR-009's `main` rule already works with slug-named
  hotfixes.
