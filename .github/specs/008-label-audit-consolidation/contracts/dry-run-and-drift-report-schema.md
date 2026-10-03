# Dry-Run and Drift Report Schema

Defines the per-repository deletion dry run that @ashleyshaw approves before anything is deleted (spec FR-016), the three run logs (spec FR-023), and the weekly drift report issue (spec FR-017).

## Per-repository dry run

Saved as `evidence/dry-run/{repo}.json` and summarised in a comment on the gate issue that replaces #95.

```json
{
  "repository": "lightspeedwp/example-repo",
  "generated_at": "2026-09-24T00:00:00Z",
  "approved_set_commit": "<develop commit of labels.yml>",
  "executed_at": { "3": null, "4": null },
  "label_count": 212,
  "pages_read": 3,
  "approved_set_count": 191,
  "to_delete": [
    {
      "name": "migrate:priority:normal",
      "color": "ededed",
      "description": "",
      "open_items": [{ "kind": "issue", "number": 95 }],
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
2. Every `to_delete` entry with `open_items` has a `migrate_to` that exists in `labels.yml`, or is listed for a decision in the gate comment. For a `migrate:*` label, `migrate_to` is the approved label its name points to: FR-012 keeps `migrate:*` out of the import mapping, not out of this per-repository target.
3. The snapshot keeps name, colour, description and each item's kind (`issue`, `pull_request` or `discussion`) and number, because issues and PRs share one number sequence while Discussions are numbered separately, so any deleted label can be recreated and reapplied to the right items (research R8).
4. Deletion runs only when `approval.status` is `approved`, `approved_by` is `ashleyshaw`, and `gate_comment_url` points to a comment reading `Approved: <repo> dry run <generated_at>` whose repository and timestamp match this file. Repositories without approval are skipped. If `labels.yml` on `develop` differs from `approved_set_commit`, the dry run is stale and must be regenerated.
5. `destructive_cleanup.enabled` in `label-governance-policy.yml` stays `false`. Deletion requires the run-time flags `--apply --confirm-gate <gate issue number>`, and the tool refuses any repository whose `approval.status` is not `approved`.
6. Before deleting, the tool re-reads the repository's labels and the items carrying each `to_delete` label. The expected state is this file plus the changes that this run's own `done` records already show for the repository (partial progress before a stop, while `executed_at` for Stage 4 is unset). If either differs from that expected state, it skips the repository, records the reason on the gate issue, and needs a new dry run and approval (FR-023 point 4).
7. When the repository's run finishes, the tool sets `executed_at` for the stage it ran (`executed_at.3` after Stage 3 renames, creates and relabels; `executed_at.4` after Stage 4 deletion). A re-run skips any repository with `executed_at` set for the stage it is running, so a Stage 3 finish never hides a repository from Stage 4, and makes no API write for one whose current state already matches the approved set (FR-023 points 1 and 2). Generating or regenerating the deletion dry run (T065) leaves `executed_at.3` as the record of Stage 3 and requires `executed_at.4` to be null.

## Run logs (FR-023)

All three files are JSON Lines in `evidence/` (one JSON object per line, UTF-8, every line ending in a newline), so adding a record appends one line and never rewrites an earlier record or a closing delimiter, and a crash can leave at most one partial last line, which readers ignore. Each change is written twice with the same `op_id`: an `intended` record before the API call and a `done` record after it succeeds, each flushed to disk (`fsync`) before the next step happens, so the API call always follows the flush of its `intended` record and a partial or missing `intended` line means the call was never made. Each `op_id` starts with the `run_id` of the run that wrote it, and only the run holding `evidence/run-lock.json` under its current `epoch` may append (FR-023 point 11). Each example below shows one change as its ordered `intended` and `done` pair, one record per line.

### `consolidation-log.jsonl` (GitHub, Stages 3 and 4)

```jsonl
{"run_by":"ashleyshaw","at":"2026-10-01T00:00:01Z","repository":"lightspeedwp/example-repo","action":"delete","label":"migrate:priority:normal","before":{"name":"migrate:priority:normal","color":"ededed","description":""},"after":null,"gate_issue":0,"op_id":"run-20261001T000000-3f9a1c7e-0001","state":"intended"}
{"run_by":"ashleyshaw","at":"2026-10-01T00:00:02Z","repository":"lightspeedwp/example-repo","action":"delete","label":"migrate:priority:normal","before":{"name":"migrate:priority:normal","color":"ededed","description":""},"after":null,"gate_issue":0,"op_id":"run-20261001T000000-3f9a1c7e-0001","state":"done"}
```

`action` is one of `rename`, `create`, `update`, `relabel`, `convert` (an issue converted to a Discussion) or `delete`; a `relabel` or `convert` record carries the item as `{ "kind": ..., "number": ... }` inside `before` and `after`, as in the data model, with no separate top-level `item` field: a `relabel` shows the same item in both, and a `convert` shows the source issue in `before.item` (for example `{ "kind": "issue", "number": 12 }`) and the resulting Discussion in `after.item` (`{ "kind": "discussion", "number": 3 }`). Each run also posts one summary comment on the gate issue, with counts per action and repository.

### `linear-writes.jsonl` (Linear, Stage 5)

```jsonl
{"run_by":"ashleyshaw","issue":"GIT-0000","old_label":{"id":"<label id>","name":"area:agents","scope":"workspace"},"new_label":{"id":"<label id>","name":"aiops:agents","scope":"workspace"},"at":"2026-10-08T09:00:00Z","mapping":"area:agents -> aiops:agents","op_id":"run-20261008T090000-b47e02d1-0001","state":"intended"}
{"run_by":"ashleyshaw","issue":"GIT-0000","old_label":{"id":"<label id>","name":"area:agents","scope":"workspace"},"new_label":{"id":"<label id>","name":"aiops:agents","scope":"workspace"},"at":"2026-10-08T09:00:01Z","mapping":"area:agents -> aiops:agents","op_id":"run-20261008T090000-b47e02d1-0001","state":"done"}
```

### `linear-changes.jsonl` (Linear labels, Stage 5)

```jsonl
{"run_by":"ashleyshaw","at":"2026-10-08T09:01:00Z","action":"retire","label":{"id":"<label id>","name":"area:legacy","scope":"workspace"},"before":{"name":"area:legacy","color":"ededed","description":"","parent":null,"scope":"workspace"},"after":null,"op_id":"run-20261008T090000-b47e02d1-0002","state":"intended"}
{"run_by":"ashleyshaw","at":"2026-10-08T09:01:01Z","action":"retire","label":{"id":"<label id>","name":"area:legacy","scope":"workspace"},"before":{"name":"area:legacy","color":"ededed","description":"","parent":null,"scope":"workspace"},"after":null,"op_id":"run-20261008T090000-b47e02d1-0002","state":"done"}
```

`action` is one of `retire` (archive the label in Linear, where it can be restored), `move_to_team` or `restyle`; `before` holds everything needed to restore the label, so rolling back reads this log.

### Log rules

1. Linear labels are identified by `id` and `scope`, never by name alone.
2. Rolling back reads these logs: a GitHub deletion is reversed from the dry-run snapshot plus its `delete` records; a Linear merge is reversed by reapplying `old_label` and restoring the retired label.
3. Mutating requests run one at a time, at least one second apart, and pause on `Retry-After` or `x-ratelimit-reset`; Linear calls stay within Linear's complexity limits. A paused run resumes as in dry-run rule 7.
4. On resume, every `intended` record without a matching `done` record is checked against the live state before anything else runs: if the change happened, a `done` record is appended; if it did not, the change is retried. A finished run leaves no unmatched `intended` record (research R21).
5. A reader skips a final line that does not parse as JSON and treats it as the interrupted write: the `intended` line is flushed before the call, so nothing happened for a line that is missing or partial.

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
