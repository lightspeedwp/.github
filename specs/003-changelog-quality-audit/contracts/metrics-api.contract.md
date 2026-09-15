# Contract: Metrics API

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

**Status**: Phase 1 Design
**Version**: 1.0
**Date**: 2026-09-13

## Overview

The Metrics API provides queryable access to changelog quality metrics for trending analysis, compliance reporting, and business intelligence. This contract defines the interface for collecting, storing, and retrieving metrics data.

---

## Data Collection API

### Snapshot Collection

**Endpoint** (CLI): `changelog-validator metrics snapshot`

**Trigger**: Daily via GitHub Actions scheduled workflow (00:00 UTC)

**Input**:

- Scope: `full_repo` (all entries in repository)
- Rule version: Current active rule set

**Process**:

1. Query all changelog entries
2. Apply current validation ruleset
3. Aggregate results into MetricsSnapshot
4. Commit JSON to `.github/reports/changelog-metrics/YYYYMMDD.json`
5. Return snapshot object

**Output**:

```json
{
  "id": "metrics_20260913",
  "snapshot_date": "2026-09-13T00:00:00Z",
  "summary": {
    "total_entries": 247,
    "compliant_entries": 235,
    "compliance_percentage": 95.14
  },
  "violations": {
    "most_common": [
      { "rule_id": "R010", "count": 3 },
      { "rule_id": "R009", "count": 8 }
    ]
  },
  "metadata": {
    "rule_version": "1.0",
    "generation_timestamp": "2026-09-13T00:00:30Z"
  }
}
```

**Error Handling**:

- If any entry validation fails: log error, continue with others, note partial results
- If storage fails: return error with option to retry
- If GitHub API unavailable: skip reference validation, complete with content checks only

**Idempotency**: Daily snapshot replaces previous day's snapshot (not cumulative)

---

### Release Audit API

**Endpoint** (CLI): `changelog-validator audit --release <version>`

**Input**:

- Release version (e.g., "v1.2.0")
- Optional: Rule version override (defaults to latest)
- Optional: Include/exclude pre-release entries

**Process**:

1. Query all entries for specified version
2. Apply validation ruleset
3. Generate ValidationReport
4. Save report to `.github/reports/release-audits/v<VERSION>.json`
5. Generate Markdown summary

**Output**:

```json
{
  "id": "report_v1_2_0_20260913",
  "report_date": "2026-09-13T10:30:00Z",
  "scope": {
    "type": "release",
    "value": "v1.2.0",
    "entry_count": 45
  },
  "summary": {
    "total_entries_audited": 45,
    "passed_count": 42,
    "failed_count": 1,
    "compliance_percentage": 93.33,
    "compliance_status": "CONDITIONAL_PASS"
  },
  "failing_entries": [
    {
      "title": "Fixed webhook API response",
      "issues": [
        {
          "rule_id": "R001",
          "message": "Contains 'API' (code reference detected)"
        }
      ]
    }
  ]
}
```

**Markdown Output** (auto-generated):

```markdown
# Release Audit Report: v1.2.0

**Compliance**: 93.33% (42/45 entries passed)

## Summary
- Total entries: 45
- Passing: 42 ✓
- Failing: 1 ✗
- Status: **CONDITIONAL_PASS** (can proceed with remediation or override)

## Failing Entries
1. **Fixed webhook API response**
   - Issue: Contains 'API' (code reference detected)
   - Fix: Replace 'API' with user-facing language

## Recommendations
- Fix 1 failing entry (5 min fix)
- All other 42 entries pass
```

---

## Metrics Query API

### Get Daily Snapshot

**Endpoint** (CLI): `changelog-validator metrics get --date YYYY-MM-DD`

**Input**:

- Date: ISO 8601 date string
- Optional: Full details (boolean)

**Output**:

```json
{
  "id": "metrics_20260913",
  "snapshot_date": "2026-09-13T00:00:00Z",
  "summary": { ... },
  "violations": { ... },
  "trends": {
    "compliance_trend_7_days": [95.1, 94.8, 95.3, ...],
    "compliance_trend_30_days": [89.5, 90.2, ...]
  }
}
```

**Error Handling**:

- If date not found: return 404 with list of available dates
- If date in future: return error

---

### Get Trend Data

**Endpoint** (CLI): `changelog-validator metrics trend --days 30`

**Input**:

- Days: Number of days to look back (default 30, max 365)
- Optional: Metrics filter (compliance|violations|velocity)

**Output**:

```json
{
  "period": "2026-08-14 to 2026-09-13",
  "days": 30,
  "metrics": [
    {
      "date": "2026-08-14",
      "compliance_percentage": 92.1,
      "total_entries": 210,
      "compliant_entries": 193
    },
    ...
  ],
  "summary": {
    "average_compliance": 93.5,
    "max_compliance": 95.2,
    "min_compliance": 89.1,
    "trend_direction": "improving",
    "trend_change": "+2.1%"
  }
}
```

---

### Export to CSV

**Endpoint** (CLI): `changelog-validator metrics export --format csv --output report.csv`

**Input**:

- Format: `csv` or `json`
- Days: Number of days (default 30)
- Output file path

**Process**:

1. Query trend data for specified period
2. Transform to CSV format (headers: Date, Compliance%, Total, Compliant, Violations)
3. Write to file
4. Return file path and record count

**CSV Output**:

```csv
Date,Compliance%,Total Entries,Compliant,Warnings,Failures,Most Common Violation
2026-08-14,92.1,210,193,8,9,R010_valid_pr_reference
2026-08-15,92.4,213,196,7,10,R010_valid_pr_reference
2026-08-16,93.0,217,202,8,7,R009_has_pr_reference
...
```

---

## Storage Format

### Daily Snapshot File

**Location**: `.github/reports/changelog-metrics/YYYYMMDD.json`

**Example Path**: `.github/reports/changelog-metrics/20260913.json`

**File Lifecycle**:

- Created: Daily at 00:00 UTC
- Updated: Never (one file per day)
- Archived: 365 days history kept
- Deleted: Beyond 1 year (optional cleanup)

**Git Storage**:

- All snapshots committed to git
- Immutable history in git log
- No overwriting or force-push
- Queries can span git history if needed

---

### Release Audit Report File

**Location**: `.github/reports/release-audits/v<VERSION>.json`

**Example Path**: `.github/reports/release-audits/v1.2.0.json`

**File Lifecycle**:

- Created: On-demand when `audit --release` runs
- Updated: Each time audit re-runs (append version suffix: v1.2.0_20260913_1430.json)
- Archived: All versions kept for audit trail
- Immutable: Never modified, only new files created

---

## Query Performance

| Query Type | Target | Notes |
|-----------|--------|-------|
| Single day snapshot | <10ms | File read only |
| Trend (30 days) | <100ms | Multiple file reads |
| Export CSV (1 year) | <1s | Full history scan |
| Release audit | <2 min | Includes GitHub API calls |

---

## Aggregation & Summarization

### Compliance Percentage Calculation

```
compliance_percentage = (compliant_entries / total_entries) * 100

where:
- compliant_entries: entries with validation_score >= 90 and no error-severity failures
- total_entries: all entries in scope
```

### Most Common Violations

**Algorithm**:

1. Collect all rule failures from all entries
2. Count frequency of each rule ID
3. Sort by frequency (descending)
4. Return top 5

**Example Output**:

```json
"most_common": [
  {
    "rule_id": "R010",
    "rule_name": "valid_pr_reference",
    "count": 3,
    "percentage": 1.2
  },
  {
    "rule_id": "R009",
    "rule_name": "has_pr_reference",
    "count": 8,
    "percentage": 3.2
  }
]
```

### Trend Direction

**Algorithm**:

1. Calculate compliance_percentage for each day
2. Fit linear regression to last 30 days
3. Return slope + direction

**Output**:

- `improving`: positive slope
- `stable`: slope near zero
- `degrading`: negative slope

---

## Error Handling

### Partial Failures

**Scenario**: 3 of 250 entries fail validation during snapshot

**Handling**:

1. Validate all entries that can be validated
2. Log errors for failed entries
3. Return snapshot with success count and error list
4. Mark snapshot as "partial" in metadata

**Output**:

```json
{
  "metadata": {
    "status": "partial",
    "errors": [
      {
        "entry_id": "entry_001",
        "error": "YAML parse error"
      }
    ],
    "success_count": 247,
    "error_count": 3
  }
}
```

### File System Errors

**Scenario**: Cannot write to `.github/reports/changelog-metrics/`

**Handling**:

1. Check directory permissions
2. Attempt to create directory if missing
3. Return error with recovery options
4. Do not fail snapshot, store in-memory buffer
5. Retry on next run

---

## Retention Policy

**Daily Snapshots**:

- Keep: 1 year of daily snapshots (365 files)
- Delete: Snapshots older than 1 year (optional cleanup task)
- Archive: Optional: compress snapshots older than 90 days

**Release Audits**:

- Keep: All release audits indefinitely
- Rationale: Audit trail for compliance/certification

**Total Storage**:

- Daily snapshots: ~365 KB/year (1KB per file)
- Release audits: ~500 KB/year (assumes ~50 releases, 10KB each)
- **Total**: ~1 MB per year

---

## Access Control

**Who can collect metrics**:

- Automated: GitHub Actions workflow (scheduled)
- Manual: Any contributor (CI/CD machine or local)

**Who can query metrics**:

- Public read: All metrics readable from git
- Private queries: None (all metrics in public repo)

**Who can override/modify**:

- None: Metrics are immutable (new commits only)
- Corrections: Create new snapshot with corrections, link both

---

## Integration Examples

### GitHub Actions Workflow

```yaml
name: Collect Changelog Metrics
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at 00:00 UTC

jobs:
  metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: |
          npm install
          npx changelog-validator metrics snapshot
      - run: |
          git config user.name "changelog-bot"
          git config user.email "changelog@lightspeedwp.agency"
          git add .github/reports/changelog-metrics/
          git commit -m "chore: daily changelog metrics snapshot" || true
          git push
```

### BI Tool Integration

```bash
# Export last 90 days to CSV for external BI tool
changelog-validator metrics export \
  --format csv \
  --days 90 \
  --output changelog-metrics.csv

# Upload to data warehouse
aws s3 cp changelog-metrics.csv s3://data-warehouse/changelog/
```

### Compliance Monitoring

```bash
# Check daily compliance doesn't drop below 90%
compliance=$(changelog-validator metrics get --date $(date +%Y-%m-%d) | jq '.summary.compliance_percentage')

if (( $(echo "$compliance < 90" | bc -l) )); then
  echo "WARNING: Compliance dropped below 90%: $compliance%"
  exit 1
fi
```

---

## Testing Strategy

### Unit Tests

```javascript
// Test metrics aggregation
test('compliance_percentage calculated correctly', () => {
  const snapshot = {
    total_entries: 100,
    compliant_entries: 95
  };
  const result = calculateCompliancePercentage(snapshot);
  assert.equal(result, 95.0);
});

// Test trend calculation
test('trend direction determined correctly', () => {
  const trend = calculateTrendDirection([92, 93, 94, 95, 96]);
  assert.equal(trend, 'improving');
});
```

### Integration Tests

```javascript
// Test full metrics collection
test('daily metrics snapshot collected and stored', async () => {
  const snapshot = await collectMetrics();
  assert.equal(snapshot.summary.total_entries, 247);
  
  const file = await fs.readFile(snapshot.file_path);
  assert(file.length > 0);
});

// Test query API
test('trend data retrieved correctly', async () => {
  const trend = await queryTrend({ days: 30 });
  assert.equal(trend.metrics.length, 30);
  assert(trend.summary.average_compliance > 0);
});
```

---

## Summary

The Metrics API is:

- **Autonomous**: Automatic daily collection via scheduled workflow
- **Queryable**: Multiple query options for analysis
- **Exportable**: CSV export for BI tool integration
- **Immutable**: All data git-committed for audit trail
- **Low-overhead**: <1MB per year storage
- **Extensible**: New metrics can be added to schema

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
