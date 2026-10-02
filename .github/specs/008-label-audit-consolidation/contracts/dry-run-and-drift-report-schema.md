# Dry-Run and Drift Report Schema

Defines the per-repository deletion dry run that @ashley approves before anything is deleted (spec FR-016), the two run logs (spec FR-023), and the weekly drift report issue (spec FR-017).

## Per-repository dry run

Saved as `evidence/dry-run/{repo}.json` and summarised in a comment on the gate issue that replaces #95.

```json
{
  "repository": "lightspeedwp/example-repo",
  "generated_at": "2026-09-24T00:00:00Z",
  "approved_set_commit": "<develop commit of labels.yml>",
  "executed_at": null,
  "label_count": 212,
  "pages_read": 3,
  "approved_set_count": 191,
  "to_delete": [
    {
      "name": "migrate:priority:normal",
      "color": "ededed",
      "description": "",
      "open_items": [95],
      "closed_items": [],
      "migrate_to": "priority:normal"
    }
  ],
  "to_create": ["aiops:agents"],
  "to_rename": [{ "from": "ai-ops:agents", "to": "aiops:agents" }],
  "approval": {
    "status": "pending",
    "approved_by": null,
    "approved_at": null,
    "gate_comment_url": null
  }
}
```

### Rules

1. `pages_read` × 100 must be at least `label_count`; a dry run that read one page for a repository with more than 100 labels is invalid.
2. Every `to_delete` entry with `open_items` has a `migrate_to` that exists in `labels.yml`, or is listed for a decision in the gate comment.
3. The snapshot keeps name, colour, description and item numbers, so any deleted label can be recreated and reapplied (research R8).
4. Deletion runs only when `approval.status` is `approved`, `approved_by` is `ashleyshaw`, and `gate_comment_url` points to a comment reading `Approved: <repo> dry run <generated_at>` whose repository and timestamp match this file. Repositories without approval are skipped. If `labels.yml` on `develop` differs from `approved_set_commit`, the dry run is stale and must be regenerated.
5. `destructive_cleanup.enabled` in `label-governance-policy.yml` stays `false`. Deletion requires the run-time flags `--apply --confirm-gate <gate issue number>`, and the tool refuses any repository whose `approval.status` is not `approved`.
6. Before deleting, the tool re-reads the repository's labels and the items carrying each `to_delete` label. If either differs from this file, it skips the repository, records the reason on the gate issue, and needs a new dry run and approval (FR-023 point 4).
7. When the repository's run finishes, the tool sets `executed_at`. A re-run skips any repository with `executed_at` set, and makes no API write for one whose current state already matches the approved set (FR-023 points 1 and 2).

## Run logs (FR-023)

Both files are append-only JSON arrays in `evidence/`. Each change is written twice with the same `op_id`: an `intended` record before the API call and a `done` record after it succeeds.

### `consolidation-log.json` (GitHub, Stages 3 and 4)

```json
[
  {
    "run_by": "ashleyshaw",
    "at": "2026-10-01T00:00:00Z",
    "repository": "lightspeedwp/example-repo",
    "action": "delete",
    "label": "migrate:priority:normal",
    "before": { "name": "migrate:priority:normal", "color": "ededed", "description": "" },
    "after": null,
    "gate_issue": 0,
    "op_id": "example-repo-delete-0001",
    "state": "done"
  }
]
```

`action` is one of `rename`, `create`, `update`, `relabel` or `delete`; a `relabel` record adds `item` (the issue or PR number). Each run also posts one summary comment on the gate issue, with counts per action and repository.

### `linear-writes.json` (Linear, Stage 5)

```json
[
  {
    "issue": "GIT-0000",
    "old_label": { "id": "<label id>", "name": "area:agents", "scope": "workspace" },
    "new_label": { "id": "<label id>", "name": "aiops:agents", "scope": "workspace" },
    "at": "2026-10-01T00:00:00Z",
    "mapping": "area:agents -> aiops:agents",
    "op_id": "GIT-0000-0001",
    "state": "done"
  }
]
```

### Log rules

1. Linear labels are identified by `id` and `scope`, never by name alone.
2. Rolling back reads these logs: a GitHub deletion is reversed from the dry-run snapshot plus its `delete` records; a Linear merge is reversed by reapplying `old_label` and restoring the retired label.
3. Mutating requests run one at a time, at least one second apart, and pause on `Retry-After` or `x-ratelimit-reset`; Linear calls stay within Linear's complexity limits. A paused run resumes as in dry-run rule 7.
4. On resume, every `intended` record without a matching `done` record is checked against the live state before anything else runs: if the change happened, a `done` record is appended; if it did not, the change is retried. A finished run leaves no unmatched `intended` record (research R21).

## Weekly drift report issue

One open issue, updated in place each run (not a new issue per run).

| Element | Value |
| --- | --- |
| Title | `Label drift report` |
| Labels | `type:audit`, `area:governance`, `status:needs-triage` |
| Body sections | `## Summary` (counts), `## GitHub repositories` (table), `## Linear`, `## Run details` |

### Table columns (GitHub and Linear)

| Column | Meaning |
| --- | --- |
| Location | Repository name, or `Linear (workspace)` / `Linear ({team})` |
| Label | Exact name |
| Difference | `unapproved`, `missing`, `colour mismatch`, `description mismatch` |
| First seen | Date the label was first reported |
| Items | Number of issues or PRs carrying it |

### Rules

1. A run with zero differences sets the summary to "No drift" and keeps the issue open for the next run; this is the SC-009 steady state.
2. The workflow never deletes or edits labels (research R7).
3. Documented team-scoped Linear labels (for example `area:flow`) are listed under an "Allowed exceptions" heading, not as drift.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
