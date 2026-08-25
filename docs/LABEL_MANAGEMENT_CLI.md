# Label Management CLI Reference

Complete reference for the `label-orchestrator.js` unified CLI and individual automation scripts.

## Quick Start

```bash
# Audit label coverage
node scripts/automation/label-orchestrator.js audit --all --verbose

# Sync PR labels
node scripts/automation/label-orchestrator.js sync --verbose

# Mark stale issues
node scripts/automation/label-orchestrator.js stale --days 30 --verbose

# Dry-run before applying
node scripts/automation/label-orchestrator.js stale --days 30 --dry-run --verbose
```

## label-orchestrator.js

Unified CLI coordinator for all label management operations.

### Syntax

```bash
node scripts/automation/label-orchestrator.js <MODE> [OPTIONS]
```

### Modes

#### audit

Run all audit scripts and generate reports.

```bash
node scripts/automation/label-orchestrator.js audit [OPTIONS]
```

**Options**:

- `--all` - Run all audits (meta labels + status labels)
- `--verbose` - Enable detailed logging
- `--format [markdown|json|csv]` - Output format (default: markdown)
- `-o <file>` - Output file path

**Examples**:

```bash
# Generate markdown audit report
node scripts/automation/label-orchestrator.js audit --all --format markdown -o audit.md

# Generate JSON report with verbose logging
node scripts/automation/label-orchestrator.js audit --all --format json --verbose
```

#### sync

Synchronise PR labels on issues.

```bash
node scripts/automation/label-orchestrator.js sync [OPTIONS]
```

**Options**:

- `--verbose` - Enable detailed logging
- `--dry-run` - Preview changes without applying

**Examples**:

```bash
# Preview PR label sync
node scripts/automation/label-orchestrator.js sync --dry-run --verbose

# Apply PR label sync
node scripts/automation/label-orchestrator.js sync --verbose
```

#### stale

Mark inactive issues as stale.

```bash
node scripts/automation/label-orchestrator.js stale [OPTIONS]
```

**Options**:

- `--days <N>` - Inactivity threshold in days (default: 30)
- `--verbose` - Enable detailed logging
- `--dry-run` - Preview changes without applying

**Examples**:

```bash
# Find issues inactive > 30 days (dry-run)
node scripts/automation/label-orchestrator.js stale --days 30 --dry-run --verbose

# Find issues inactive > 14 days (apply)
node scripts/automation/label-orchestrator.js stale --days 14 --verbose
```

## Individual Scripts

### sync-pr-labels.js

Synchronise `meta:has-pr` label based on linked PRs.

```bash
node scripts/automation/sync-pr-labels.js [OPTIONS]
```

**Options**:

- `--verbose` - Enable detailed logging
- `--dry-run` - Preview changes without applying

**Output**: Console log of additions/removals

**Example**:

```bash
# Sync PR labels with verbose output
node scripts/automation/sync-pr-labels.js --verbose

# Preview without applying
node scripts/automation/sync-pr-labels.js --dry-run --verbose
```

### manage-stale-issues.js

Mark inactive issues as stale.

```bash
node scripts/automation/manage-stale-issues.js [OPTIONS]
```

**Options**:

- `--days <N>` - Inactivity threshold (default: 30)
- `--verbose` - Enable detailed logging
- `--dry-run` - Preview without applying

**Output**: Console log of marked issues

**Example**:

```bash
# Mark issues inactive > 30 days
node scripts/automation/manage-stale-issues.js --days 30 --verbose

# Test with 14-day threshold (dry-run)
node scripts/automation/manage-stale-issues.js --days 14 --dry-run --verbose

# Verbose dry-run to see exactly what would change
node scripts/automation/manage-stale-issues.js --days 30 --dry-run --verbose
```

### review-meta-labels.js

Audit meta label coverage.

```bash
node scripts/automation/review-meta-labels.js [OPTIONS]
```

**Options**:

- `--format [json|csv|markdown]` - Output format (default: markdown)
- `--verbose` - Enable detailed logging
- `-o <file>` - Output file path

**Output**: Report in specified format

**Example**:

```bash
# Generate markdown report
node scripts/automation/review-meta-labels.js --format markdown -o meta-audit.md

# Display JSON report
node scripts/automation/review-meta-labels.js --format json

# CSV for spreadsheet analysis
node scripts/automation/review-meta-labels.js --format csv -o meta-audit.csv
```

### review-status-labels.js

Audit status label distribution.

```bash
node scripts/automation/review-status-labels.js [OPTIONS]
```

**Options**:

- `--format [json|csv|markdown]` - Output format (default: markdown)
- `--verbose` - Enable detailed logging
- `-o <file>` - Output file path

**Output**: Report in specified format

**Example**:

```bash
# Generate status audit report
node scripts/automation/review-status-labels.js --format markdown -o status-audit.md

# Display JSON
node scripts/automation/review-status-labels.js --format json --verbose
```

## Output Formats

### Markdown

Human-readable format for documentation and comments.

**Example**:

```markdown
# Meta Label Audit Report
Date: 2026-08-11

## Summary
- Total issues: 347
- Issues with meta:has-pr: 89 (25.6%)
- Issues with meta:stale: 12 (3.5%)
- Issues with meta:no-changelog: 5 (1.4%)

## Recommendations
- Consider stricter PR linking enforcement
- Review stale issue aging
```

### JSON

Structured format for programmatic processing.

**Example**:

```json
{
  "timestamp": "2026-08-11T16:00:00Z",
  "total_issues": 347,
  "meta_labels": {
    "meta:has-pr": {
      "count": 89,
      "percentage": 25.6
    },
    "meta:stale": {
      "count": 12,
      "percentage": 3.5
    }
  }
}
```

### CSV

Spreadsheet format for data analysis.

**Example**:

```csv
Label,Count,Percentage
meta:has-pr,89,25.6
meta:stale,12,3.5
meta:no-changelog,5,1.4
```

## GitHub Actions Integration

### meta-labels-sync.yml

Daily workflow for PR label sync and stale marking.

**Manual Dispatch**:

```bash
gh workflow run meta-labels-sync.yml \
  -f dryRun=false \
  -f stalenessThreshold=30 \
  -f verbose=true
```

**Parameters**:

- `dryRun` (default: true) - Run in preview mode
- `stalenessThreshold` (default: 30) - Days of inactivity
- `verbose` (default: false) - Detailed logging

### label-audit-report.yml

Monthly workflow for comprehensive auditing.

**Manual Dispatch**:

```bash
gh workflow run label-audit-report.yml \
  -f format=markdown \
  -f verbose=true
```

**Parameters**:

- `format` (default: markdown) - Output format (markdown/json/csv)
- `verbose` (default: false) - Detailed logging

## Common Patterns

### Pattern 1: Safe Testing with Dry-Run

```bash
# Preview what would happen
node scripts/automation/manage-stale-issues.js --days 14 --dry-run --verbose

# If output looks good, apply
node scripts/automation/manage-stale-issues.js --days 14 --verbose
```

### Pattern 2: Generate Audit Report

```bash
# Generate markdown report
node scripts/automation/label-orchestrator.js audit --all --format markdown -o audit-2026-08-11.md

# Generate JSON for processing
node scripts/automation/label-orchestrator.js audit --all --format json > audit-2026-08-11.json
```

### Pattern 3: Monthly Scheduled Audit

```bash
# Cron job (runs 1st of month at 4 AM UTC)
0 4 1 * * /usr/bin/node /path/to/scripts/automation/label-orchestrator.js audit --all --format markdown -o "/tmp/audit-$(date +\%Y-\%m-\%d).md"
```

### Pattern 4: Interactive Exploration

```bash
# Check current stale issues (14-day threshold)
node scripts/automation/manage-stale-issues.js --days 14 --dry-run --verbose

# Check current PR label sync status
node scripts/automation/sync-pr-labels.js --dry-run --verbose

# Audit meta label coverage
node scripts/automation/review-meta-labels.js --format markdown
```

## Exit Codes

Scripts use standard exit codes:

- `0` - Success
- `1` - General error (API error, validation failure)
- `2` - Configuration error (invalid arguments)
- `3` - No issues to process

## Environment Variables

### GitHub API

Scripts read `GITHUB_TOKEN` from environment for GitHub API access:

```bash
export GITHUB_TOKEN=ghp_xxxx...
node scripts/automation/label-orchestrator.js audit --all
```

### Repository Settings

Scripts use hardcoded repository for safety:

- Owner: `lightspeedwp`
- Repo: `.github`

To target a different repository, fork and modify the script.

## Performance Metrics

Typical execution times for 350+ issues:

- **sync-pr-labels.js**: 30-45 seconds
- **manage-stale-issues.js**: 20-30 seconds
- **review-meta-labels.js**: 15-20 seconds
- **review-status-labels.js**: 15-20 seconds

Full audit via `label-orchestrator.js`: 1-2 minutes

## Troubleshooting

### Error: "GITHUB_TOKEN not found"

**Cause**: GitHub API token not set  
**Solution**: Set environment variable

```bash
export GITHUB_TOKEN=ghp_xxxx...
```

### Error: "API rate limit exceeded"

**Cause**: GitHub API rate limit reached  
**Solution**: Wait for reset (typically 1 hour); retry or reduce scope

### Error: "Invalid --days value"

**Cause**: Non-integer or negative value for days  
**Solution**: Use positive integer (e.g., `--days 30`)

### No output/changes

**Cause**: Already in sync or no stale issues found  
**Solution**: Check with `--verbose` flag for details

## Related Documentation

- [ISSUE_MAINTENANCE_SCRIPTS.md](./ISSUE_MAINTENANCE_SCRIPTS.md) — Full system guide
- [GitHub Actions Workflows](../.github/workflows/meta-labels-sync.yml) — Scheduled automation
- [Phase 4 Issue #1771](https://github.com/lightspeedwp/.github/issues/1771) — Documentation tracking

---

*Last updated: 2026-08-11 | Part of Issue Maintenance Scripts Phase 1-4 delivery*

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
