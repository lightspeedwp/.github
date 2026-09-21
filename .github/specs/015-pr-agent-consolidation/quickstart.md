# Quickstart: Validating PR Agent Consolidation & Portability

A runnable guide proving the feature works end-to-end. Validation guide only — see `contracts/` for the exact guarantees and `data-model.md` for field detail.

## Prerequisites

- `agents/pr-agent/` exists with `agents/pr-creation-agent/` removed.
- `gh` CLI authenticated against `lightspeedwp/.github` (and, for Scenario 5, a second LightSpeedWP repository).
- A branch exists with committed, pushed changes.

## Scenario 1 — Consolidation is complete and the verified bug is fixed (User Story 1)

1. Confirm `agents/pr-creation-agent/` no longer exists: `test -d agents/pr-creation-agent && echo FAIL || echo PASS`.
2. Confirm `agents/pr-agent/AGENT.md` and `package.json` contain no reference to `pr-creation-agent`: `grep -r pr-creation-agent agents/pr-agent/` returns nothing.
3. Confirm `validate-branch-name.js`'s forbidden list matches `docs/BRANCHING_STRATEGY.md` exactly: `claude/`, `copilot/`, `openai/` — no others.
4. Expected: all four checks pass.

## Scenario 2 — Validated behaviour is present (User Story 2)

1. On a prepared branch, invoke `pr-agent` to create a PR.
2. Expected: base branch correct for the branch's type; title/body derived from commits/diff; exactly one changelog-decision label; assignee set; review-budget note present if oversized.
3. Push an additional commit, invoke again.
4. Expected: the existing PR is updated in place (`gh pr list --head <branch>` still shows exactly one PR), not duplicated.

## Scenario 3 — Portability (User Story 3)

1. Invoke `pr-agent` against a branch in a second, different LightSpeedWP repository (one you have access to, with a different assignee-in-practice and, ideally, a different default branch name than `.github`'s).
2. Expected: the assignee on the resulting PR is whoever ran the command, not `brandonmarshal` or any other fixed name; the base branch matches that repository's actual default branch; the review-budget thresholds and prefix list applied are the organisation-wide defaults.
3. Add a `.github/pr-agent.config.json` to that second repository overriding `reviewBudget.preferredFiles` to a smaller number, and run a PR that would only exceed the *override*, not the default.
4. Expected: the PR body notes it as oversized, proving the override was read and applied instead of the default.

## Scenario 4 — Agent Skills structure, tests, and lint (User Story 4)

1. `! grep -R -n --include='SKILL.md' 'template-skill' agents/pr-agent/skills` — no matches.
2. `npm test` from `agents/pr-agent/` — passes, with a test count at or above the pre-restructuring count.
3. Introduce a deliberate lint violation in one skill's `.js` file, run `npm run lint` from `agents/pr-agent/` — fails, confirming coverage.
4. `agents/pr-agent/README.md` exists and references `docs/BRANCHING_*.md`/`docs/PR_*.md`/`docs/LABEL*.md`/`docs/ISSUE*.md` by pattern, not by inlining their rules.

## Scenario 5 — LOCKED-file boundary is respected

1. `git diff` (or the eventual PR's file list) for this feature includes no changes under `.github/PULL_REQUEST_TEMPLATE/`, `.github/labels.yml`, `.github/issue-types.yml`, or `.github/ISSUE_TEMPLATE/`.
2. Expected: zero changes to any LOCKED file, confirming the five-missing-routing-entries discrepancy was deferred, not fixed inline.

## Pass/fail

All five scenarios passing constitutes this feature working end-to-end. Any scenario the agent can't yet satisfy becomes a `tasks.md` item during `/speckit-tasks`.
