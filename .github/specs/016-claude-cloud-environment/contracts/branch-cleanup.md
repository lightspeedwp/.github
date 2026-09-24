# Contract: `claude/*` Branch Cleanup

**Feature**: [../spec.md](../spec.md) · Requirements FR-020 to FR-022 · Delivered in spec 009 /
lightspeedwp/.github#3358

This feature adds no workflow or script of its own. It extends spec 009's contracts (`cli-interface.md`,
`library-api.md` in `.github/specs/009-audit-branch-cleanup/contracts/`) as follows.

## Categorisation (`scripts/lib/branch-categorization.js`)

| Field | Value |
| --- | --- |
| New rule position | After "has open PR → KEEP", before "invalid name → DISCUSS" |
| Condition | name starts with `claude/` **and** merged to a base branch **and** open-PR verification succeeded with no open PR **and** tip age of at least `AUTO_DELETE_MIN_AGE_DAYS` (1) |
| Result | `{ category: "DELETE", autoApproved: true, reason: REASON_CODES.DELETE.auto_delete_empty_agent_branch }` |
| Configuration | `AUTO_DELETE_PREFIXES = ["claude"]` and `AUTO_DELETE_MIN_AGE_DAYS = 1` in `scripts/lib/constants.js` |

All other results carry `autoApproved: false` (or omit it).

## Audit command (`scripts/cleanup-branches.js`)

- The existing 009 command-line contract is unchanged. `--dryRun=false` is still rejected with exit 1.
- The JSON report adds `autoApproved` to each branch entry, and a summary count, `autoApprovedDelete`.
- The Markdown report lists auto-approved deletions in their own section.

## Scheduled workflow (spec 009 User Story 5)

| Step | Behaviour |
| --- | --- |
| Audit | Runs `node scripts/cleanup-branches.js --reportFormat=json` |
| Auto-delete (new) | For each `autoApproved` entry: re-check merged and no open PR, then `git push origin --delete <branch>`. Skipped when a manual run chooses report-only |
| Draft PR | Unchanged. Covers the remaining `DELETE` candidates, which need a person's approval |
| DISCUSS issue | Unchanged |
| Schedule | At least daily |
| Permissions | `contents: write`, `pull-requests: read` or higher, as 009 already needs |
| Exit status | Fails with partial-failure status if any auto-deletion fails |
