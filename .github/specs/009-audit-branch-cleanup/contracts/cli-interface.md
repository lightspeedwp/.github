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

| Option | Type | Default | Description | Example |
|--------|------|---------|-------------|---------|
| `--dryRun` | boolean | true | Preview deletions without executing | `--dryRun=false` |
| `--deleteLocal` | boolean | false | Also delete local branches (remote only by default) | `--deleteLocal` |
| `--verbose` | boolean | false | Enable debug output | `--verbose` |
| `--inactiveDays` | number | 30 | Inactivity threshold in days | `--inactiveDays=60` |
| `--excludePatterns` | string | "release/\|hotfix/" | Pipe-separated regex patterns to preserve | `--excludePatterns="release/.*\|hotfix/.*"` |
| `--preserveAuthors` | string | "" | Pipe-separated author patterns to preserve | `--preserveAuthors="dependabot\|renovate"` |
| `--reportFormat` | enum | "markdown" | Output format: `markdown` or `json` | `--reportFormat=json` |
| `--reportDir` | string | ".github/reports" | Directory to write report | `--reportDir=.github/reports` |

## Exit Codes

| Code | Meaning | Conditions |
|------|---------|-----------|
| 0 | Success | Categorisation complete, report generated (dry-run or executed) |
| 1 | Fatal error | Invalid arguments, missing git/gh CLI, cannot read local branches |
| 2 | Partial failure | Some branches processed, some errors (see report for details) |
| 127 | Missing dependency | `git` or `gh` CLI not found in PATH |

## Standard Output

### Dry-Run Mode (default)

```
[HH:MM:SS] ℹ️  Starting branch cleanup audit...
[HH:MM:SS] ℹ️  Found 127 branches to evaluate
[HH:MM:SS] ℹ️  Categorising branches...
[HH:MM:SS] ✅ Dry-run complete: 85 KEEP, 32 DELETE, 10 DISCUSS
[HH:MM:SS] ℹ️  Report written to: .github/reports/branch-cleanup-2026-09-16T14-30-45.md
[HH:MM:SS] ℹ️  To execute: node scripts/cleanup-branches.js --dryRun=false
```

### Execution Mode

```
[HH:MM:SS] ℹ️  Starting branch cleanup...
[HH:MM:SS] ℹ️  Found 127 branches to evaluate
[HH:MM:SS] ℹ️  Categorising branches...
[HH:MM:SS] ✅ Deleted 32 remote branches
[HH:MM:SS] ⚠️  5 branches failed to delete (see report)
[HH:MM:SS] ℹ️  Report written to: .github/reports/branch-cleanup-2026-09-16T14-30-45.md
[HH:MM:SS] ℹ️  Summary: 85 KEEP, 27 DELETED, 10 DISCUSS
```

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
   Exit code: 127
```

### GitHub API Errors

```
⚠️  GitHub API unavailable (assuming no open PRs)
   Continuing with conservative estimate...
   Affected count: 5 branches
```

### Invalid Arguments

```
❌ Error: Invalid --inactiveDays value; defaulting to 30.
   Provided: "invalid"
   Exit code: 1
```

## Report Generation

Reports are written to `{reportDir}/branch-cleanup-{timestamp}.{format}` where:

- `timestamp` format: ISO8601 (e.g., `2026-09-16T14-30-45`)
- `format` extension: `.md` (Markdown) or `.json` (JSON)

### Markdown Report Structure

```markdown
# Branch Cleanup Report

**Generated**: 2026-09-16T14:30:45Z  
**Branches Evaluated**: 127  
**Result**: ✅ Dry-run (no deletions executed)

## Summary

| Category | Count | Action |
|----------|-------|--------|
| KEEP | 85 | Preserved |
| DELETE | 32 | Ready for deletion |
| DISCUSS | 10 | Requires review |

## Details

### KEEP Branches (85)

- `main` — Protected branch
- `develop` — Protected branch
- `feat/user-auth` — Active PR #1234

### DELETE Branches (32)

- `feat/old-experiment` — Merged 45 days ago
- `bugfix/typo-fix` — Merged 60 days ago

### DISCUSS Branches (10)

- `claude/experiment` — Invalid branch name (forbidden prefix)
- `ref-incomplete-work` — Unmerged but 35 days old
```

### JSON Report Structure

```json
{
  "timestamp": "2026-09-16T14:30:45Z",
  "generator": "cleanup-branches.js v1.0.0",
  "dryRun": true,
  "stats": {
    "totalBranches": 127,
    "keepCount": 85,
    "deleteCount": 32,
    "discussCount": 10
  },
  "branches": [
    {
      "name": "main",
      "category": "KEEP",
      "reason": "protected_branch",
      "type": "main",
      "author": "unknown",
      "ageInDays": 0,
      "lastCommitDate": "2026-09-16T14:30:00Z",
      "mergeStatus": {
        "merged": true,
        "state": "merged",
        "mergedToBranches": ["main"]
      }
    }
  ]
}
```

## Validation Test Cases

See `quickstart.md` for runnable test scenarios.

---

**Contract Status**: ✅ Complete
