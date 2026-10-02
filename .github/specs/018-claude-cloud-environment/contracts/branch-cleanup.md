# Contract: `claude/*` Branch Cleanup

**Feature**: [../spec.md](../spec.md) · Requirements FR-020 to FR-022 · Delivered in spec 009 /
lightspeedwp/.github#3358

This feature adds no workflow or script of its own. It extends spec 009's contracts (`cli-interface.md`,
`library-api.md` in `.github/specs/009-audit-branch-cleanup/contracts/`) as follows.

## Categorisation (`scripts/lib/branch-categorization.js`)

| Field | Value |
| --- | --- |
| New rule position | After "has open PR → KEEP", before "invalid name → DISCUSS" |
| Condition | name starts with `claude/` **and** identified as a platform placeholder by a separate branch-origin check, not by merge status (see below) **and** has no commits of its own, re-checked immediately before deletion because a placeholder that received commits stops being one **and** open-PR verification succeeded with no open PR **and** observed as a branch for at least `AUTO_DELETE_MIN_AGE_DAYS` (1) days, measured from a branch-age signal such as a first-observed timestamp and never from the age of the tip commit |
| Result | `{ category: "DELETE", autoApproved: true, reason: REASON_CODES.DELETE.auto_delete_empty_agent_branch }` |
| Configuration | `AUTO_DELETE_PREFIXES = ["claude"]` and `AUTO_DELETE_MIN_AGE_DAYS = 1` in `scripts/lib/constants.js`, once the deferral is lifted. #3358 removed both while it holds (`f4fcec75`). This threshold is measured from the branch-age signal above. Spec 009's `age_days` is contracted as "Days since last commit" in `deletion-candidates.schema.json`, and the shipped audit derives it from `lastCommitDate`. Spec 018 keeps no persistent storage and spec 009 supplies no branch-age signal, so **auto-approved deletion is deferred**: `AUTO_DELETE_MIN_AGE_DAYS` is not yet satisfiable and no branch qualifies until the signal's storage and retention are decided and built. Until then every candidate follows 009's categorisation, which is not always draft-PR approval: a `claude/*` name that is invalid, or that carries its own commits, is routed to DISCUSS by the unchanged 009 naming rule. From DISCUSS, a maintainer may promote an empty, merged one with no open PR to DELETE, and it is then removed only through 009's draft-PR approval; one carrying its own commits is never promoted (R16) |
| Branch-origin check | Not specified, and that is a second blocker on the same rule. A `claude/*` branch that holds real work and was later merged upstream also satisfies spec 009 FR-002's merge test, so "merged" cannot stand in for "is a platform placeholder". FR-021 requires a branch failing an FR-020 condition to follow normal categorisation, so an auto-approval exception resting on the merge test alone would exclude it wrongly. The origin signal, and how it is computed reliably, is an open decision recorded alongside the branch-age signal's storage. Both must exist before this rule can be enabled |

All other results carry `autoApproved: false` (or omit it).

## Audit command (`scripts/cleanup-branches.js`)

- The existing 009 command-line contract is unchanged. `--dryRun=false` is still rejected with exit 1.
- The JSON report adds `autoApproved` to each candidate in `deleted[]`, and a summary count, `summary.autoApprovedDelete`.
- Branch-name checks use `lib/validate-branch-name.js`. The local copy in `scripts/lib/` is removed (analysis finding F5).
- The Markdown report lists auto-approved deletions in their own section.

## Scheduled workflow (spec 009 User Story 5)

| Step | Behaviour |
| --- | --- |
| Audit | Runs `node scripts/cleanup-branches.js --reportFormat=json` |
| Auto-delete (deferred) | Deferred until a branch-age signal exists, so no entry currently qualifies. Once it does: for each `autoApproved` entry, re-check against the same tip the delete will act on: still a platform placeholder per the branch-origin check, still no commits of its own, and still no open PR. Record that tip OID, then delete with `git push origin --delete <branch> --force-with-lease=<branch>:<oid>` so a push landing between the re-check and the delete aborts the deletion instead of discarding work. Skipped when a manual run chooses report-only |
| Draft PR | Unchanged. Covers the remaining `DELETE` candidates, which need a person's approval |
| DISCUSS issue | Unchanged |
| Schedule | At least daily |
| Permissions | `contents: write`, `pull-requests: read` or higher, as 009 already needs |
| Exit status | Fails with partial-failure status if any auto-deletion fails |
