# Contract: Metrics API Interface

**Phase**: Phase 1 (Design & Contracts)  
**Version**: 1.0  
**Audience**: Metrics dashboard developers; CI/CD engineers; reporting tools

---

## Overview

The Metrics API provides read/write access to changelog compliance metrics and historical trend data. It's the contract between the validation engine (writer) and the metrics dashboard (reader).

---

## Data Format

### MetricsSnapshot Structure

```json
{
  "snapshot_id": "2026-09-12T00:00:00Z",
  "timestamp": "2026-09-12T00:00:00Z",
  "snapshot_period": "daily",
  
  "summary": {
    "total_entries": 185,
    "compliant_entries": 176,
    "non_compliant_entries": 6,
    "review_required_entries": 3,
    "compliance_percent": 95.1
  },
  
  "distribution": {
    "by_length": {
      "0_to_100": 12,
      "100_to_250": 164,
      "250_to_500": 8,
      "500_plus": 1
    },
    "by_severity": {
      "critical_violations": 8,
      "high_violations": 4,
      "medium_violations": 2,
      "low_violations": 0
    }
  },
  
  "quality_metrics": {
    "impl_detail_rate": 3.2,
    "pr_link_coverage": 98.9,
    "format_compliance": 99.5,
    "avg_length_chars": 187
  },
  
  "violations_by_rule": {
    "CHK_MAX_LENGTH": 1,
    "CHK_NO_IMPL_DETAILS": 6,
    "CHK_HAS_PR_LINK": 2,
    "CHK_FORMAT_MARKDOWN": 0,
    "CHK_LINK_VALIDITY": 0
  },
  
  "trend": {
    "vs_previous_snapshot": {
      "compliance_delta_percent": 2.1,
      "entries_added": 8,
      "entries_refactored": 3
    },
    "vs_7_day_average": {
      "compliance_delta_percent": 1.8
    },
    "vs_30_day_average": {
      "compliance_delta_percent": 5.3
    }
  },
  
  "metadata": {
    "changelog_file": "CHANGELOG.md",
    "changelog_format": "keep-a-changelog-1.1.0",
    "validation_rule_count": 8,
    "last_entry_date": "2026-09-12",
    "last_entry_version": "[Unreleased]"
  }
}
```

---

## API Endpoints

### 1. Write Metrics Snapshot

**Endpoint**: `POST .github/reports/changelog-metrics/record`

**Purpose**: Record compliance metrics at a point in time

**Request**:
```javascript
{
  snapshot: MetricsSnapshot,      // Full snapshot structure
  metadata: {
    triggered_by: string,          // "scheduled" | "pr_validation" | "manual_audit"
    pr_number?: number,            // If triggered by PR validation
    workflow_run_id?: string,      // GitHub Actions run ID
    duration_ms: number            // Validation duration
  }
}
```

**Response**:
```javascript
{
  success: boolean,
  snapshot_id: string,
  timestamp: string,
  message: string,
  file_path: string  // Path to stored JSON file
}
```

**Error Cases**:
- Invalid snapshot structure → 400 Bad Request
- Duplicate snapshot_id → 409 Conflict (idempotent; return existing)
- File system error → 500 Internal Server Error
- Storage quota exceeded → 507 Insufficient Storage

**Implementation**:
- Store to `.github/reports/changelog-metrics/history/{YYYY}/{MM}/{DD}/{snapshot_id}.json`
- Keep latest snapshot at `.github/reports/changelog-metrics/latest.json` (symlink or copy)
- Maintain rolling 90-day window (delete snapshots older than 90 days daily)

---

### 2. Query Metrics (Date Range)

**Endpoint**: `GET .github/reports/changelog-metrics/query`

**Purpose**: Retrieve metrics for a date range for trend analysis

**Query Parameters**:
- `start_date`: ISO 8601 date (e.g., `2026-08-13`) — default: 90 days ago
- `end_date`: ISO 8601 date (e.g., `2026-09-12`) — default: today
- `period`: `daily` | `weekly` | `monthly` — default: `daily`
- `fields`: comma-separated list of snapshot fields to return (default: all)

**Response**:
```javascript
{
  success: boolean,
  snapshots: MetricsSnapshot[],    // Ordered by timestamp
  date_range: {
    start: string,
    end: string
  },
  period: string,
  summary: {
    count: number,
    earliest_compliance: number,
    latest_compliance: number,
    trend: "improving" | "stable" | "declining"
  }
}
```

**Example Request**:
```
GET /reports/changelog-metrics/query?start_date=2026-08-13&end_date=2026-09-12&period=daily
```

**Example Response**:
```json
{
  "success": true,
  "snapshots": [
    { "snapshot_id": "2026-08-13T00:00:00Z", "compliance_percent": 82.5, ... },
    { "snapshot_id": "2026-08-14T00:00:00Z", "compliance_percent": 83.1, ... },
    ...
    { "snapshot_id": "2026-09-12T00:00:00Z", "compliance_percent": 95.1, ... }
  ],
  "summary": {
    "count": 31,
    "earliest_compliance": 82.5,
    "latest_compliance": 95.1,
    "trend": "improving"
  }
}
```

---

### 3. Get Latest Metrics

**Endpoint**: `GET .github/reports/changelog-metrics/latest`

**Purpose**: Quickly fetch current compliance status (used by dashboard)

**Response**:
```javascript
{
  success: boolean,
  snapshot: MetricsSnapshot,
  age_seconds: number,          // Seconds since snapshot was recorded
  is_stale: boolean             // true if >24 hours old
}
```

---

### 4. Dashboard Data (Aggregated)

**Endpoint**: `GET .github/reports/changelog-metrics/dashboard`

**Purpose**: Fetch pre-aggregated data for dashboard visualization

**Query Parameters**:
- `days`: number of days to include (default: 30)
- `include_tables`: boolean (include raw violation tables; default: false)

**Response**:
```javascript
{
  summary: {
    current_compliance: number,
    target_compliance: number,      // 95% goal
    entries_total: number,
    entries_compliant: number,
    entries_non_compliant: number,
    last_updated: ISO 8601
  },
  
  trends: [
    {
      date: string,
      compliance_percent: number,
      entries_added: number,
      entries_refactored: number
    }
  ],
  
  violations_summary: {
    total_violations: number,
    by_rule: [
      { rule: "CHK_MAX_LENGTH", count: 1, percent: 12.5 },
      { rule: "CHK_NO_IMPL_DETAILS", count: 6, percent: 75 },
      { rule: "CHK_LINK_VALIDITY", count: 1, percent: 12.5 }
    ]
  },
  
  length_distribution: [
    { range: "0-100", count: 12, percent: 6.5 },
    { range: "100-250", count: 164, percent: 88.6 },
    { range: "250-500", count: 8, percent: 4.3 },
    { range: "500+", count: 1, percent: 0.5 }
  ],
  
  status_badge: {
    text: "95.1% Compliant",
    color: "green",  // green/yellow/red
    url: "https://img.shields.io/badge/changelog-95.1%25-green"
  }
}
```

---

## Dashboard Requirements

### Display Components

1. **Compliance Gauge** (current snapshot)
   - Large number: `95.1%`
   - Visual gauge: 0-100% scale, color-coded (red <80%, yellow 80-94%, green 95-100%)
   - Goal line: 95% target

2. **Compliance Trend** (30-day line chart)
   - X-axis: Date (daily)
   - Y-axis: Compliance % (0-100%)
   - Line: Historical trend showing improvement over time
   - Goal line: 95% target (horizontal reference)

3. **Violations Breakdown** (pie chart)
   - By rule: CHK_MAX_LENGTH, CHK_NO_IMPL_DETAILS, etc.
   - Show % distribution of violations

4. **Length Distribution** (histogram)
   - Buckets: 0-100, 100-250, 250-500, 500+
   - Show distribution of entry lengths
   - Highlight entries >250 in red

5. **Top Violations** (table)
   - Rule, Count, % of Total
   - Actionable information for maintainers

6. **Status Badge**
   - Embed-ready Shields.io badge: `![Changelog Status](https://img.shields.io/badge/changelog-95.1%25-green)`

---

## Update Schedule

### Automatic Updates

- **Daily Metrics**: Calculated every day at 00:00 UTC
- **Trigger**: GitHub Actions scheduled workflow (`changelog-metrics-update.yml`)
- **Duration**: Must complete within 1 hour
- **Retention**: Keep 90-day rolling window (delete older snapshots daily)

### Event-Triggered Updates

- **PR Validation**: When CHANGELOG.md is modified in a PR, calculate and store ValidationReport metrics
- **Manual Audit**: When maintainer runs manual `npm run audit:changelog`

---

## Storage Location & Format

### File Structure

```
.github/reports/changelog-metrics/
├── history/
│   ├── 2026/
│   │   ├── 08/
│   │   │   ├── 13/
│   │   │   │   ├── 2026-08-13T00:00:00Z.json
│   │   │   │   └── 2026-08-13T12:00:00Z.json
│   │   │   └── 14/
│   │   │       └── 2026-08-14T00:00:00Z.json
│   │   └── 09/
│   │       ├── 11/
│   │       │   └── 2026-09-11T00:00:00Z.json
│   │       └── 12/
│   │           └── 2026-09-12T00:00:00Z.json
├── latest.json              # Symlink to most recent snapshot
├── 90-day-average.json      # Pre-calculated rolling average
└── README.md                # Data dictionary and access guide
```

### JSON Schema

Every snapshot file must validate against this schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["snapshot_id", "timestamp", "summary", "distribution"],
  "properties": {
    "snapshot_id": { "type": "string", "format": "date-time" },
    "timestamp": { "type": "string", "format": "date-time" },
    "snapshot_period": { "enum": ["daily", "weekly", "monthly"] },
    "summary": {
      "type": "object",
      "required": ["total_entries", "compliant_entries", "compliance_percent"],
      "properties": {
        "compliance_percent": { "type": "number", "minimum": 0, "maximum": 100 }
      }
    }
  }
}
```

---

## Contract: Guaranteed Behaviors

✅ **Metrics API MUST**:
- Guarantee idempotent writes (same snapshot_id, same result)
- Maintain data consistency across concurrent reads/writes
- Preserve historical data (no retroactive changes)
- Complete daily recalculation within 1 hour
- Support 90-day rolling window queries
- Return consistent trend calculations

✅ **Dashboard MUST**:
- Refresh every 5 minutes (pull latest snapshot)
- Display "Last updated: {timestamp}" with auto-refresh indicator
- Support mobile viewport (responsive design)
- Cache data locally (reduce API calls)
- Provide shareable links (with embedded snapshot date)

❌ **API MUST NOT**:
- Delete or modify snapshots (write-once, read-many)
- Recalculate historical data retroactively
- Expose raw entry content (privacy)
- Allow dashboard to filter/hide violations (transparency)

---

## Error Handling

### Common Error Responses

**400 Bad Request**: Invalid query parameters or malformed snapshot
```json
{
  "success": false,
  "error": "bad_request",
  "message": "Invalid date format. Use ISO 8601 (YYYY-MM-DD).",
  "field": "start_date"
}
```

**409 Conflict**: Duplicate snapshot_id (idempotent response)
```json
{
  "success": true,
  "message": "Snapshot already exists (idempotent)",
  "snapshot_id": "2026-09-12T00:00:00Z"
}
```

**500 Internal Server Error**: File system or processing failure
```json
{
  "success": false,
  "error": "internal_error",
  "message": "Failed to write metrics snapshot",
  "request_id": "req_2026-09-12_abc123"
}
```

---

## Phase 1 Complete

Metrics API contract defined. Implements write (record), read (query/latest), and dashboard interfaces.

**Next**: quickstart.md (validation workflow end-to-end guide)
