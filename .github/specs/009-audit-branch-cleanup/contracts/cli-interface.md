# Contract: CLI Interface

**Interface**: Command-line entry point for branch cleanup operations  
**Module**: `scripts/cleanup-branches.js`  
**Type**: CLI Tool  
**Status**: Specification

## Invocation

```bash
node scripts/cleanup-branches.js [options]
```

## Command-Line Options

| Option              | Type    | Default             | Description                                                                                                                                                          | Example                                     |
| ------------------- | ------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `--dryRun`          | boolean | true                | Preview deletion candidates without executing. Direct `--dryRun=false` runs are rejected; execution belongs to the draft-PR workflow after human approval and merge. | `--dryRun=true`                             |
| `--deleteLocal`     | boolean | false               | Include local branch inventory in the preview                                                                                                                        | `--deleteLocal`                             |
| `--verbose`         | boolean | false               | Enable debug output                                                                                                                                                  | `--verbose`                                 |
| `--inactiveDays`    | number  | 30                  | Inactivity threshold in days                                                                                                                                         | `--inactiveDays=60`                         |
| `--excludePatterns` | string  | "release/\|hotfix/" | Pipe-separated regex patterns to preserve                                                                                                                            | `--excludePatterns="release/.*\|hotfix/.*"` |
| `--preserveAuthors` | string  | ""                  | Pipe-separated author patterns to preserve                                                                                                                           | `--preserveAuthors="dependabot\|renovate"`  |
| `--reportFormat`    | enum    | "markdown"          | Output format: `markdown` or `json`                                                                                                                                  | `--reportFormat=json`                       |
| `--reportDir`       | string  | ".github/reports"   | Directory to write report                                                                                                                                            | `--reportDir=.github/reports`               |

## Exit Codes

| Code | Meaning         | Conditions                                                                                |
| ---- | --------------- | ----------------------------------------------------------------------------------------- |
| 0    | Success         | Categorisation complete and report generated                                              |
| 1    | Fatal error     | Direct live mode, or repository access failure (including a failed remote branch listing) |
| 2    | Partial failure | Some branches processed, some errors (see report for details)                             |

## Standard Output

### Dry-Run Mode (default)

```
[HH:MM:SS] ℹ️  Starting branch cleanup audit...
[HH:MM:SS] ℹ️  Found 127 branches to evaluate
[HH:MM:SS] ℹ️  Categorising branches...
[HH:MM:SS] ✅ Dry-run complete: 85 KEEP, 32 DELETE, 10 DISCUSS
[HH:MM:SS] ℹ️  Report written to: .github/reports/branch-cleanup-2026-09-16T14-30-45.md
[HH:MM:SS] ℹ️  Submit deletion candidates through the draft-PR approval workflow
```

### Approval-Gated Execution

The CLI does not execute remote or local deletion directly. Passing
`--dryRun=false` is a fatal error (exit code 1). The scheduled/manual workflow
creates a draft PR containing the reviewed candidates; only human approval and
merge may trigger the separate deletion step.

### Verbose Mode

Additional debug output:

- Branch processing details
- Git command outputs
- GitHub API queries
- Categorisation gate evaluation

## Error Handling

### Git CLI Errors

```
❌ Error: 'git' command not found
   Install git: https://git-scm.com/
   Exit code: 1
```

### GitHub API Errors

```
⚠️  GitHub API unavailable; open-PR verification could not complete
   Deletion candidates are downgraded to DISCUSS; no deletion can proceed
```

### Invalid Arguments

```
❌ Error: Invalid --inactiveDays value; defaulting to 30.
   Provided: "invalid"
   The run continues with the default value.
```

## Report Generation

Reports are written to `{reportDir}/branch-cleanup-{timestamp}.{format}` where:

- `timestamp` format: ISO8601 (e.g., `2026-09-16T14-30-45`)
- `format` extension: `.md` (Markdown) or `.json` (JSON)

### Markdown Report Structure

The writer is `writeMarkdownReport()` in `scripts/cleanup-branches.js`. Sections for deleted, KEEP, DISCUSS and error branches appear only when they have entries.

```markdown
# Branch Cleanup Report

**Date:** 2026-09-16T14:30:45.000Z
**Mode:** Dry run (no deletions)
**Threshold:** 30 days inactive

## Summary

| Metric                                                 | Value  |
| ------------------------------------------------------ | ------ |
| Branches considered for deletion                       | 32     |
| Auto-approved deletions (empty agent-session branches) | 0      |
| Branches deleted                                       | 32     |
| Branches preserved                                     | 95     |
| Errors                                                 | 0      |
| Deletion success rate                                  | 100.0% |
| Preserved:Deleted ratio                                | 2.97:1 |
| Total commits removed (estimate)                       | 118    |
| Estimated storage freed                                | 4.1 MB |

## Metrics

### Branches deleted by type

- **bugfix**: 12
- **feat**: 20

### Authors affected (notification list)

- author@example.com

## Deleted Branches

### `feat/old-experiment`

- **Author:** author@example.com
- **Last commit:** 2026-07-30T09:12:00+00:00
- **Age:** 45 days
- **Hash:** `abc1234`
- **Type:** feat
- **Commits removed (estimate):** 3
- **Storage freed (estimate):** 120 KB
- **Reason:** Merged and inactive
- **Local deleted:** No

## KEEP Branches

- `feat/user-auth` — Open PR exists

## DISCUSS Branches

- `claude/experiment` — Invalid branch name: forbidden prefix
- `ref-incomplete-work` — Unmerged and stale
```

In a dry run, "Branches deleted" counts the branches the report lists as deletion candidates; nothing is deleted. The CLI writes no `| KEEP |` row: KEEP and DISCUSS branches are listed under their own headings, not in the summary table.

### JSON Report Structure

The writer is `writeJsonReport()` in `scripts/cleanup-branches.js`.

```json
{
  "timestamp": "2026-09-16T14:30:45.000Z",
  "dryRun": true,
  "inactiveDays": 30,
  "summary": {
    "candidates": 32,
    "autoApprovedDelete": 0,
    "deleted": 32,
    "preserved": 95,
    "errors": 0,
    "deletionSuccessRate": "100.0%",
    "preservedDeletedRatio": "2.97:1",
    "totalCommitsRemoved": 118,
    "estimatedStorageFreedBytes": 4300000,
    "estimatedStorageFreedHuman": "4.1 MB"
  },
  "metrics": {
    "deletedByType": { "bugfix": 12, "feat": 20 },
    "authorsAffected": ["author@example.com"]
  },
  "deleted": [
    {
      "branch": "feat/old-experiment",
      "author": "author@example.com",
      "lastCommitDate": "2026-07-30T09:12:00+00:00",
      "age": 45,
      "hash": "abc1234",
      "type": "feat",
      "commitCount": 3,
      "estimatedStorageBytes": 122880,
      "reason": "Merged and inactive",
      "autoApproved": false
    }
  ],
  "preserved": [
    { "branch": "feat/user-auth", "category": "KEEP", "reason": "Open PR exists" },
    {
      "branch": "claude/experiment",
      "category": "DISCUSS",
      "reason": "Invalid branch name: forbidden prefix"
    }
  ],
  "errors": []
}
```

Consumers read `.summary` for totals, `.deleted` for deletion candidates and `.preserved` for KEEP and DISCUSS branches (each carries its `category`). There are no `stats`, `branches` or `generator` fields.

## Validation Test Cases

See `quickstart.md` for runnable test scenarios.

---

**Contract Status**: ✅ Complete
