# Changelog Metrics Archival Strategy

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

> Retention policy, historical analysis, and compression strategy for changelog quality metrics

## Overview

The Changelog Quality Audit system collects daily metrics snapshots to track compliance trends over time. This document defines the retention policy, archival procedures, and strategies for historical analysis.

---

## Retention Policy

### Timeline

| Period | Retention | Format | Storage |
|--------|-----------|--------|---------|
| **0-30 days** | Active | JSON (full) | `.github/reports/changelog-metrics/` |
| **31-90 days** | Warm | JSON (full) | `.github/reports/changelog-metrics/` |
| **91-365 days** | Cold | JSON (compressed) | `.github/reports/changelog-metrics-archive/` |
| **365+ days** | Archived | CSV export | `.github/reports/changelog-metrics-archive/yearly/` |

### Rationale

- **0-30 days**: Current performance tracking and immediate trend analysis
- **31-90 days**: Release cycle retrospectives and milestone analysis
- **91-365 days**: Year-over-year trend analysis and capability roadmap
- **365+ days**: Historical benchmark and multi-year compliance tracking

---

## Daily Snapshot Structure

### File Location and Naming

```
.github/reports/changelog-metrics/
├── 20260901.json          # September 1, 2026 snapshot
├── 20260902.json          # September 2, 2026 snapshot
├── ...
└── YYYYMMDD.json          # One per day, immutable
```

### Snapshot Content

```json
{
  "snapshot_date": "2026-09-14T00:00:00Z",
  "snapshot_timestamp": 1726272000000,
  "scope": "full",
  "version": null,
  
  "total_entries": 156,
  "compliant_entries": 142,
  "non_compliant_entries": 14,
  "compliance_percentage": 91.0,
  
  "warning_count": 8,
  "error_count": 6,
  
  "violations_by_rule": [
    {
      "rule_id": "R001",
      "rule_name": "no_implementation_details",
      "count": 4,
      "percentage": 50.0
    }
  ],
  "most_common_violations": [...],
  "total_violations": 8,
  
  "entries_by_category": {
    "Added": { "total": 45, "compliant": 43, "non_compliant": 2, "warnings": 0 },
    "Fixed": { "total": 67, "compliant": 62, "non_compliant": 5, "warnings": 3 }
  },
  
  "average_quality_score": 87.5,
  "quality_trend": "stable"
}
```

---

## Archival Procedures

### Automatic Archival Process

The system automatically archives metrics on the following schedule:

#### Daily Ingestion (Cron: 00:00 UTC)

```bash
changelog-validator metrics snapshot
```

- Collects all changelog entries
- Calculates compliance metrics
- Stores as `YYYYMMDD.json` in `.github/reports/changelog-metrics/`
- Immutable once written (no modifications)

#### Weekly Export (Cron: Sunday 02:00 UTC)

```bash
changelog-validator metrics export --format csv --days 7 --output weekly_export.csv
```

- Exports last 7 days to CSV
- Uploaded to artifact storage for external analysis
- Includes compliance trend, velocity, and violation summary

#### Monthly Archival (Cron: 1st of month 03:00 UTC)

```bash
# Compress snapshots >90 days old
for file in .github/reports/changelog-metrics/*.json; do
  DATE_NUM=$(basename "$file" .json)
  FILE_DATE=$(date -d "${DATE_NUM:0:4}-${DATE_NUM:4:2}-${DATE_NUM:6:2}" +%s)
  CUTOFF_DATE=$(date -d "now - 90 days" +%s)
  
  if [ "$FILE_DATE" -lt "$CUTOFF_DATE" ]; then
    gzip "$file"
    mv "$file.gz" ".github/reports/changelog-metrics-archive/$file.gz"
  fi
done
```

#### Yearly Archive (Cron: January 2nd 04:00 UTC)

```bash
# Export previous year to CSV
PREV_YEAR=$(date -d "last year" +%Y)
changelog-validator metrics export --format csv \
  --from "${PREV_YEAR}-01-01" \
  --to "${PREV_YEAR}-12-31" \
  --output ".github/reports/changelog-metrics-archive/yearly/${PREV_YEAR}_metrics.csv"
```

---

## Storage Structure

### Active Metrics Directory

```
.github/reports/changelog-metrics/
├── 20260814.json          # 31+ days old (warm)
├── 20260901.json          # 14 days old (active)
├── ...
└── 20260914.json          # Today (active)
```

**Retention**: 365 days (automatic deletion after 1 year)

### Archive Directory

```
.github/reports/changelog-metrics-archive/
├── 20260101.json.gz       # Compressed (>90 days old)
├── 20260102.json.gz
├── ...
└── yearly/
    ├── 2025_metrics.csv   # Full year export
    └── 2024_metrics.csv
```

**Retention**: 7 years (permanent archive for compliance)

---

## Compression Strategy

### When to Compress

- Automatically when snapshot is >90 days old
- Reduces disk space by ~60-70% (JSON compresses well)
- Decompression on-demand when needed for analysis

### Compression Command

```bash
gzip YYYYMMDD.json
# Produces: YYYYMMDD.json.gz (compressed)
```

### Decompression for Analysis

```bash
gunzip YYYYMMDD.json.gz
# Restores: YYYYMMDD.json (original)
```

### Storage Space Estimates

| Period | Snapshots | Uncompressed | Compressed | Savings |
|--------|-----------|--------------|------------|---------|
| 30 days (active) | 30 | ~1.5 MB | - | - |
| 90 days (warm) | 60 | ~3.0 MB | - | - |
| 1 year (archive) | 270 | ~13.5 MB | ~4 MB | ~70% |
| 7 years (cold) | 1890 | ~94.5 MB | ~28 MB | ~70% |

---

## Querying Historical Metrics

### Query Recent Trends (0-90 days)

```bash
# Query last 30 days of trends
changelog-validator metrics trend --days 30

# Output:
# {
#   "compliance_trend": {
#     "trend": "improving",
#     "slope": 0.523,
#     "days_analyzed": 30
#   },
#   "velocity": {
#     "entries_per_day": 2.3,
#     "entries_per_week": 16.1
#   },
#   "common_violations": [...]
# }
```

### Export for Analysis (Any period)

```bash
# Export specific date range to CSV
changelog-validator metrics export \
  --format csv \
  --from 2026-07-01 \
  --to 2026-09-14 \
  --output Q3_2026_metrics.csv
```

### Load Archived Snapshot (>90 days)

```javascript
const metricsBuilder = require('./includes/metricsSnapshotBuilder.cjs');
const fs = require('fs');

// If file is compressed, decompress first
const exec = require('child_process').execSync;
exec('gunzip .github/reports/changelog-metrics-archive/20260301.json.gz');

// Load snapshot
const snapshot = metricsBuilder.loadMetricsSnapshot(
  '20260301',
  '.github/reports/changelog-metrics-archive'
);
```

### Generate Year-over-Year Report

```bash
# Compare Q3 2026 vs Q3 2025
changelog-validator metrics export --format csv --from 2025-07-01 --to 2025-09-30 --output Q3_2025.csv
changelog-validator metrics export --format csv --from 2026-07-01 --to 2026-09-30 --output Q3_2026.csv

# Analyze differences using external tools
# (e.g., spreadsheet, BI tool, custom analysis script)
```

---

## Use Cases

### 1. Weekly Team Standup

**Query**: Last 7 days trend

```bash
changelog-validator metrics trend --days 7
```

**Decision**: Should we increase focus on quality? Any patterns emerging?

---

### 2. Release Retrospective

**Query**: Last 30 days trend + common violations

```bash
changelog-validator metrics trend --days 30 | grep -A5 "common_violations"
```

**Decision**: What quality issues should we address before next release?

---

### 3. Quarterly Planning

**Query**: Last 90 days trend + velocity

```bash
changelog-validator metrics export --format csv --days 90 --output Q3_review.csv
```

**Analysis**: Spreadsheet/BI tool analysis

**Decision**: Are we trending toward better or worse quality? What's our velocity trajectory?

---

### 4. Year-over-Year Audit

**Query**: Last year export + previous year export

```bash
changelog-validator metrics export --format csv \
  --from 2025-01-01 --to 2025-12-31 \
  --output 2025_full_year.csv
```

**Analysis**: Compare against previous years

**Decision**: How has our changelog quality matured? Are we consistent?

---

### 5. Compliance Audit

**Query**: All snapshots (>365 days) + archive exports

**Evidence**: CSV exports stored in `.github/reports/changelog-metrics-archive/yearly/`

**Output**: Compliance report showing: "Maintained ≥90% compliance for 347/365 days"

---

## Maintenance

### Manual Cleanup

If manual archival is needed:

```bash
# Compress all snapshots >90 days old
find .github/reports/changelog-metrics \
  -name "*.json" \
  -mtime +90 \
  -exec gzip {} \; \
  -exec mv {}.gz .github/reports/changelog-metrics-archive/ \;

# Delete snapshots >365 days old
find .github/reports/changelog-metrics \
  -name "*.json" \
  -mtime +365 \
  -delete
```

### Backup Strategy

Archive directory should be backed up:

1. **Daily**: Include in standard repo backups
2. **Monthly**: Export to external S3/cloud storage
3. **Yearly**: Long-term archive (compliant with data retention policy)

### Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Snapshot file missing | >365 days, deleted | Use yearly CSV export from archive |
| Compressed file corrupt | Corruption during gzip | Restore from backup |
| Trend query insufficient data | <2 snapshots in range | Expand date range or wait for more snapshots |
| Archive disk full | Too many years of data | Delete oldest yearly exports (>7 years) |

---

## Integration with CI/CD

### GitHub Actions Workflow

```yaml
name: Metrics Collection

on:
  schedule:
    # Daily snapshot at 00:00 UTC
    - cron: '0 0 * * *'
    # Weekly export (Sunday 02:00 UTC)
    - cron: '0 2 * * 0'
    # Monthly archival (1st of month 03:00 UTC)
    - cron: '0 3 1 * *'
    # Yearly archive (Jan 2 04:00 UTC)
    - cron: '0 4 2 1 *'

jobs:
  metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Collect daily snapshot
        run: npm run validate:metrics-snapshot
      - name: Archive old snapshots
        run: npm run validate:metrics-archive
      - name: Commit archived metrics
        run: |
          git config user.name "Metrics Bot"
          git config user.email "metrics@lightspeedwp.agency"
          git add .github/reports/changelog-metrics*
          git commit -m "chore: archive changelog metrics [skip ci]"
          git push
```

---

## Related Documentation

- [Metrics Collection Overview](./CHANGELOG_QUALITY_AUDIT.md#metrics-collection)
- [Trend Analysis Guide](./CHANGELOG_QUALITY_AUDIT.md#trend-analysis)
- [CSV Export Format](./CHANGELOG_QUALITY_AUDIT.md#csv-export-format)
- [Data Model Reference](./specs/003-changelog-quality-audit/data-model.md)

---

## Appendix: CSV Format Reference

### Export Columns

```csv
Date,Compliance %,Total Entries,Compliant,Warnings,Failures,Most Common Issue,R001 Count,R002 Count,...
2026-09-01,89.5,100,89,5,6,R001 (5),5,0,...
2026-09-02,91.2,102,93,4,5,R001 (4),4,0,...
```

### Column Definitions

- **Date**: YYYY-MM-DD format
- **Compliance %**: Daily compliance percentage (0-100)
- **Total Entries**: Total changelog entries validated
- **Compliant**: Entries with 100% compliance
- **Warnings**: Entries with warnings but passing
- **Failures**: Entries below passing threshold
- **Most Common Issue**: Highest-frequency violation rule
- **R001-R020 Count**: Per-rule violation count for each rule

---

**Last Updated**: 2026-09-14  
**Status**: Active  
**Review Cycle**: Quarterly

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_
