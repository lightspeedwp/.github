# Issue Maintenance Scripts & Workflows

Automated label management system for consistent issue and PR labeling, stale issue detection, and monthly audit reporting.

## Overview

The Issue Maintenance Scripts initiative provides production-grade automation for label management at scale:

- **Daily Label Sync**: Automatically synchronise PR labels and mark inactive issues
- **Monthly Audits**: Comprehensive reporting on label coverage and compliance
- **Unified CLI**: Control all operations from a single command-line interface
- **GitHub Actions Integration**: Scheduled workflows + manual dispatch support
- **Safety First**: Dry-run mode, verbose logging, comprehensive error handling

## System Architecture

### Components

```
┌─────────────────────────────────────────────────────┐
│         GitHub Workflows (Scheduled + Manual)       │
├──────────────────────┬──────────────────────────────┤
│ meta-labels-sync.yml │  label-audit-report.yml     │
│ (Daily 3 AM UTC)     │  (Monthly 1st, 4 AM UTC)    │
├──────────────────────┴──────────────────────────────┤
│            label-orchestrator.js (CLI)              │
├──────────────────────────────────────────────────────┤
│  Automation Scripts                                  │
│  ├─ sync-pr-labels.js                              │
│  ├─ manage-stale-issues.js                         │
│  ├─ review-meta-labels.js                          │
│  └─ review-status-labels.js                        │
├──────────────────────────────────────────────────────┤
│  Shared Utilities                                    │
│  ├─ label-management.js                            │
│  ├─ report-generator.js                            │
│  └─ activity-analyzer.js                           │
└──────────────────────────────────────────────────────┘
```

## Workflows

### meta-labels-sync.yml

Synchronises PR labels and marks stale issues daily.

**Schedule**: Daily at 3 AM UTC (configurable)  
**Manual Dispatch**: Yes - with dry-run, threshold, and verbose options  
**Duration**: ~2-3 minutes

**Operations**:

- **Sync PR Labels**: Updates `meta:has-pr` labels based on linked PRs
  - Adds label if open PR is referenced
  - Removes label if all linked PRs are closed/merged
  - Handles edge cases (deleted PRs, API errors)

- **Mark Stale Issues**: Identifies and labels inactive issues
  - Default: 30+ days without activity
  - Configurable threshold via workflow dispatch
  - Smart exclusions: epics, in-progress, critical-priority, milestone-assigned
  - Optional warning comments before closing

**Permissions**: `contents:read`, `issues:write`, `pull-requests:read`

**Example - Manual Dispatch**:

```bash
gh workflow run meta-labels-sync.yml \
  -f dryRun=false \
  -f stalenessThreshold=14 \
  -f verbose=true
```

### label-audit-report.yml

Generates comprehensive monthly label audit reports.

**Schedule**: Monthly on 1st at 4 AM UTC (configurable)  
**Manual Dispatch**: Yes - with format and verbose options  
**Duration**: ~1-2 minutes

**Operations**:

- **Meta Label Audit**: Analyzes coverage of meta labels (e.g., `meta:has-pr`)
  - Percentage of issues with each meta label
  - Trends and gaps
  - Recommendations for improvement

- **Status Label Audit**: Analyzes `status:*` label distribution
  - Health metrics: how many issues in each status
  - Stale status detection
  - Blocker analysis

**Output Formats**: Markdown, JSON, CSV (configurable)  
**Artifacts**: Saved to `.github/reports/audits/` (30-day retention)  
**Permissions**: `contents:read`, `issues:read`, `pull-requests:read`

**Example - Manual Dispatch**:

```bash
gh workflow run label-audit-report.yml \
  -f format=markdown \
  -f verbose=true
```

## Scripts

### sync-pr-labels.js

Synchronises PR-related labels on issues.

**Purpose**: Keep `meta:has-pr` label in sync with actual linked PRs  
**Execution**: Automated via workflow or manual CLI  
**Idempotent**: Yes - safe to run multiple times

**Behavior**:

- Fetches all open issues
- Extracts PR references from issue body and comments
- Validates each PR (checks if still open)
- Adds/removes `meta:has-pr` label accordingly
- Handles API errors gracefully (404 for deleted PR vs transient errors)

**Example**:

```bash
node scripts/automation/sync-pr-labels.js --verbose
```

### manage-stale-issues.js

Identifies and marks inactive issues.

**Purpose**: Keep issues tidy by flagging abandoned work  
**Execution**: Automated via workflow or manual CLI  
**Idempotent**: Yes - safe to run multiple times

**Configuration**:

- `--days`: Inactivity threshold (default: 30)
- `--dry-run`: Preview changes without applying
- `--verbose`: Detailed logging

**Smart Exclusions** (never marked stale):

- Epics (`type:epic`)
- In-progress issues (`status:in-progress`)
- Critical priority (`priority:critical`)
- Issues with milestone assigned

**Example**:

```bash
# Preview marking issues stale after 14 days
node scripts/automation/manage-stale-issues.js --days 14 --dry-run --verbose

# Actually mark stale issues
node scripts/automation/manage-stale-issues.js --days 30
```

### review-meta-labels.js

Audits meta label coverage across issues.

**Purpose**: Understand label coverage and identify gaps  
**Execution**: Automated via audit workflow or manual CLI  
**Output**: JSON, CSV, or Markdown reports

**Analyzes**:

- Total issues and their meta label coverage
- Percentage of issues with each meta label
- Trends over time
- Recommendations

**Example**:

```bash
# Generate markdown audit report
node scripts/automation/review-meta-labels.js --format markdown -o audit.md

# Generate JSON report
node scripts/automation/review-meta-labels.js --format json
```

### review-status-labels.js

Audits status label distribution.

**Purpose**: Health check on issue status labels  
**Execution**: Automated via audit workflow or manual CLI  
**Output**: JSON, CSV, or Markdown reports

**Analyzes**:

- Issues in each `status:*` state
- Duration in each status
- Stale statuses (no updates for extended period)
- Blockers and dependencies

## Unified CLI: label-orchestrator.js

Coordinates all label management operations.

**Usage**:

```bash
node scripts/automation/label-orchestrator.js [MODE] [OPTIONS]
```

**Modes**:

- **audit**: Run all audit scripts

  ```bash
  node scripts/automation/label-orchestrator.js audit --all --verbose
  ```

- **sync**: Synchronise PR labels

  ```bash
  node scripts/automation/label-orchestrator.js sync --verbose
  ```

- **stale**: Mark inactive issues

  ```bash
  node scripts/automation/label-orchestrator.js stale --days 30 --verbose
  ```

**Global Options**:

- `--verbose`: Enable detailed logging
- `--dry-run`: Preview changes without applying
- `--format [markdown|json|csv]`: Output format (audit mode only)
- `-o <file>`: Output file path (audit mode only)

## Integration Patterns

### Scheduled Automation

Issues and PRs are automatically processed:

- **Daily** (3 AM UTC): PR labels sync + stale detection
- **Monthly** (1st, 4 AM UTC): Comprehensive audit reports

### Manual Checks

Run audits on-demand:

```bash
# Check current label coverage
node scripts/automation/label-orchestrator.js audit --all --format markdown

# Dry-run stale marking
node scripts/automation/manage-stale-issues.js --days 30 --dry-run --verbose
```

### GitHub Actions

Workflows are available for scheduling and manual dispatch:

```bash
# Trigger sync workflow manually
gh workflow run meta-labels-sync.yml -f dryRun=false

# Trigger audit workflow
gh workflow run label-audit-report.yml -f format=markdown
```

## Troubleshooting

### Issue Not Marked Stale Despite Inactivity

**Cause**: Smart exclusion rule triggered  
**Solution**: Check if issue has `type:epic`, `status:in-progress`, `priority:critical`, or milestone

### Sync Fails with "API Error"

**Cause**: GitHub API rate limit or temporary outage  
**Solution**: Workflow auto-retries; manual runs can be retried after waiting

### Audit Report Missing Columns

**Cause**: Label prefix not in standard configuration  
**Solution**: Check that custom labels follow prefix convention (e.g., `area:docs`, `priority:high`)

### Workflow Not Triggering

**Cause**: Schedule expression misconfigured or branch protection blocking  
**Solution**: Verify cron expression in workflow YAML; check branch protection rules allow workflow changes

## Monitoring & Alerts

### Success Indicators

- Audit reports generate without errors
- Sync completes in < 5 minutes
- No API rate limiting messages
- Zero false positives in stale detection

### Failure Alerts

- CI check failures on workflow runs
- Mergify queue failures
- CodeRabbit review issues

## Security Considerations

### Data Isolation

Scripts only access issues and PRs in the repository they're run against. Cross-repo contamination is impossible due to working directory validation.

### Environment Variables

User inputs from workflow dispatch are passed via environment variables (not command-line arguments) to prevent shell injection.

### Rate Limiting

Scripts respect GitHub API rate limits and fail gracefully when exceeded. Retry logic is built in.

### No Destructive Operations

All scripts support dry-run mode. No labels are deleted, only added/removed as needed.

## Examples

### Scenario 1: Daily Stale Detection

**Time**: 3 AM UTC daily  
**Process**:

1. Sync PR labels (add/remove `meta:has-pr`)
2. Mark issues stale if inactive > 30 days
3. Exclude epics, in-progress, critical-priority issues

**Outcome**: Issues automatically flagged for review; PRs stay in sync

### Scenario 2: Monthly Audit

**Time**: 1st of month, 4 AM UTC  
**Process**:

1. Generate meta label coverage report
2. Generate status label distribution report
3. Save to `.github/reports/audits/` with timestamp

**Outcome**: Archive of label health metrics for trend analysis

### Scenario 3: Manual Dry-Run Before Applying

**Process**:

```bash
# Preview stale marking
node scripts/automation/manage-stale-issues.js --days 14 --dry-run --verbose

# If output looks good, apply
node scripts/automation/manage-stale-issues.js --days 14 --verbose
```

**Outcome**: Safe testing before production changes

## Performance

- **Workflow runtime**: 2-5 minutes (depends on issue count)
- **API calls**: Optimized with pagination and batching
- **Memory**: Constant regardless of issue count
- **Cost**: Minimal (GitHub Actions free tier)

## Related Documentation

- [LABEL_MANAGEMENT_CLI.md](./LABEL_MANAGEMENT_CLI.md) — CLI reference and examples
- [Issue Maintenance Scripts GitHub Issues](https://github.com/lightspeedwp/.github/issues/1771) — Phase 4 tracking
- [Phase 3 PR #1761](https://github.com/lightspeedwp/.github/pull/1761) — Workflows implementation

---

*Last updated: 2026-08-11 | Part of Issue Maintenance Scripts Phase 1-4 delivery*

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
