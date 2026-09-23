# Quickstart: Validating PR Agent Consolidation & Portability

A runnable guide proving the feature works end-to-end. Validation guide only — see `contracts/` for the exact guarantees and `data-model.md` for field detail.

## Prerequisites

- `agents/pr-agent/` exists with `agents/pr-creation-agent/` removed.
- `gh` CLI authenticated against `lightspeedwp/.github` (and, for Scenario 5, a second LightSpeedWP repository).
- A branch exists with committed, pushed changes.

## Scenario 1 — Consolidation is complete and the verified bug is fixed (User Story 1)

1. Confirm `agents/pr-creation-agent/` no longer exists:

   ```bash
   if [ -d agents/pr-creation-agent ]; then
     echo FAIL
     exit 1
   else
     echo PASS
   fi
   ```

2. Confirm `agents/pr-agent/AGENT.md` and `package.json` contain no reference to `pr-creation-agent`: `grep -r pr-creation-agent agents/pr-agent/` returns nothing.
3. Confirm `.github/branch-types.yml`, consumed by `validate-branch-name.js`, matches `docs/BRANCHING_STRATEGY.md` exactly: forbidden prefixes are `claude/`, `copilot/`, and `openai/`, and all 38 allowed types are present.
4. Expected: all three checks pass.

## Scenario 2 — Validated behaviour is present (User Story 2)

1. In a repository whose authoritative branch-policy metadata designates different live production and integration branches, invoke `pr-agent` from prepared `hotfix/`, `release/`, and standard-type branches.
2. Expected: `hotfix/` and `release/` target the designated production branch; every other type targets the designated integration branch. Title/body are derived from commits/diff, exactly one changelog-decision label and the assignee are set, and an informational oversized-PR note (with the documented-exception mention) is present if the review budget is exceeded — with no accompanying recommendation to restructure the branch into a stack or parallel PRs.
3. Remove one role's designation while keeping a live `defaultBranchRef`, then repeat for a branch type routed to that role. Expected: that role alone falls back to `defaultBranchRef`; an explicit designation for the other role is unaffected.
4. Test a malformed, non-live, and ambiguous designation. Expected: each fails before PR creation rather than falling back. Also confirm fallback fails when required and `defaultBranchRef` is missing or non-live.
5. Push an additional commit to a valid prepared branch and invoke again.
6. Expected: the existing PR is updated in place (`gh pr list --head <branch>` still shows exactly one PR), not duplicated.
7. Inspect the generated title against `docs/ISSUE_PR_TITLE_GOVERNANCE.md` §7's regex: `^(feat|fix|hotfix|docs?|refactor|chore|test|perf|ci|build|deps|security|design|a11y|audit|aiops|automation|research|release)(/[a-z0-9]+(?:-[a-z0-9]+)*)?:\s.+$`. Expected: match, and no issue/ticket reference present in the title itself.
8. Inspect the generated labels. Expected: one `status:*`, one `type:*`, one `priority:*`, at least one `area:*`/`comp:*`, one `release:*`, plus exactly one changelog-decision label — all present in the same create/update action, none invented beyond the repository's real label set.
9. From a `feat/` branch, inspect the generated PR body against `docs/PR_GOVERNANCE.md`'s `feat/` required sections. Expected: a `Linked Issues` line matching `^(Closes|Fixes|Relates to) #\d+`, a non-placeholder `Description` ≥50 characters, a `Changes Made` section with ≥2 items, and ≥2 measurable `Acceptance Criteria`.
10. Prepare (or simulate) a stack of 6 dependent branches. Expected: the agent flags that the stack exceeds the 5-PR limit and recommends splitting into multiple stacks under an epic, rather than silently proceeding.

## Scenario 3 — Portability (User Story 3)

1. Invoke `pr-agent` against a branch in a second, different LightSpeedWP repository (one you have access to, with a different assignee-in-practice and, ideally, production and integration role names different from `.github`'s).
2. Expected: the assignee on the resulting PR is whoever ran the command, not `brandonmarshal` or any other fixed name; the base branch matches the role designated by that repository's authoritative branch-policy metadata, using its live default branch only when that role is undesignated; the review-budget thresholds and prefix list applied are the organisation-wide defaults.
3. Add a `.github/pr-agent.config.json` to that second repository overriding `reviewBudget.preferredFiles` to a smaller number, and run a PR that would only exceed the *override*, not the default.
4. Expected: the PR body notes it as oversized, proving the override was read and applied instead of the default.

## Scenario 4 — Agent Skills structure, tests, and lint (User Story 4)

1. `! grep -R -n --include='SKILL.md' 'template-skill' agents/pr-agent/skills` — no matches.
2. `npm test` from `agents/pr-agent/` — passes, with a test count at or above the pre-restructuring count.
3. Introduce a deliberate lint violation in one skill's `.js` file, run `npm run lint` from `agents/pr-agent/` — fails, confirming coverage.
4. `agents/pr-agent/README.md` exists and references `docs/BRANCHING_*.md`/`docs/PR_*.md`/`docs/LABEL*.md`/`docs/ISSUE*.md` by pattern, not by inlining their rules.

## Scenario 5 — LOCKED-file boundary is respected

1. Check the actual PR file list rather than the working-tree diff:

   ```bash
   pr_files="$(gh pr diff --name-only)" || exit 1
   if grep -Eq \
     '^(\.github/PULL_REQUEST_TEMPLATE/|\.github/labels\.yml$|\.github/issue-types\.yml$|\.github/ISSUE_TEMPLATE/)' \
     <<<"$pr_files"; then
     echo FAIL
   else
     echo PASS
   fi
   ```

   Before a PR exists, compare `HEAD` with the merge base of the dynamically resolved base ref instead.

2. Expected: zero changes to any LOCKED file, confirming the five-missing-routing-entries discrepancy was deferred, not fixed inline.

## Pass/fail

All five scenarios passing constitutes this feature working end-to-end. Any scenario the agent can't yet satisfy becomes a `tasks.md` item during `/speckit-tasks`.
