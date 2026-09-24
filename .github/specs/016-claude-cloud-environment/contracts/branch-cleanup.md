# Contract: `claude/*` Branch Cleanup

**Feature**: [../spec.md](../spec.md) · Requirements FR-020 to FR-022

## Workflow: `.github/workflows/claude-branch-cleanup.yml`

| Aspect | Value |
| --- | --- |
| Triggers | `schedule` (daily, off-peak UTC minute) and `workflow_dispatch` |
| Dispatch input | `dry_run` (boolean, default `true`) |
| Scheduled mode | Deletes for real (`dry_run=false`) |
| Permissions | `contents: write` (delete refs), `pull-requests: read` (open-PR check) |
| Concurrency | One run at a time (`cancel-in-progress: false`) |
| Actions | Pinned to full commit SHAs, as in the rest of the repo |
| Output | A job summary listing the deleted, kept-for-review and failed branches |
| Exit status | Fails if any deletion failed |

## Script: `scripts/cleanup-branches.js` (extended)

New option:

| Option | Default | Meaning |
| --- | --- | --- |
| `--includePatterns=RE` | empty (all branches) | Pipe-separated regexes. When set, only matching remote branches are considered |

The workflow's invocation:

```text
node scripts/cleanup-branches.js --includePatterns="^claude/" --inactiveDays=1 --dryRun=<input> --reportFormat=markdown
```

Existing behaviour relied on, without changes:

- protected branches are kept
- branches with open PRs are kept (checked through `gh`)
- only merged branches are deleted
- the last-commit-age threshold applies
- dry-run defaults to on
- a report is written
- the exit code is 1 on any deletion error

Backwards compatibility: callers that don't pass `--includePatterns` see no change.
