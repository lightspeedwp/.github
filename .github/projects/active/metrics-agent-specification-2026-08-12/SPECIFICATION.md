---
name: Metrics Agent Specification
description: Detailed requirements and design for universal metrics agent
type: specification
version: '2.0'
---

# Metrics Agent Specification

## Executive Summary

A multi-context metrics agent that collects, aggregates, and analyzes repository health data. Designed as a universal component with configuration-driven behavior to support GitHub control plane and WordPress repositories.

**Key Features:**

- Multi-repository metric collection
- Context-aware metric filtering (GitHub control plane vs WordPress)
- Real-time data aggregation
- Trend analysis and insights generation
- Integration with Reporting agent for output formatting
- Comprehensive test coverage (80%+)
- Full documentation with architecture diagrams

## Requirements

### Functional Requirements

#### FR1: Metric Collection

**FR1.1 Issue Metrics**

- Total issues created in period
- Issues closed (resolution count and %)
- Time to close (average, median, p95)
- Issues still open/active
- Stale issues (no activity >N days)
- Reopened issues (quality indicator)
- Issue labels and distribution

**FR1.2 Pull Request Metrics**

- Total PRs created
- PRs merged/closed
- Time to merge (average, median, p95)
- PR review times
- Code review participation rate
- PR size metrics (lines changed, files modified)
- CI/CD pass rates

**FR1.3 Contributor Metrics**

- Active contributors (by period)
- Contributor breakdown (issues, PRs, reviews)
- Top contributors ranking
- Contributor retention/engagement trends
- New vs returning contributors

**FR1.4 Project Health Metrics**

- Milestone progress (% complete)
- Epic status tracking
- Backlog size and age
- Label distribution (type:*, status:*, priority:*)
- Dependencies and blockers
- Project velocity (issues/PRs per sprint or period)

**FR1.5 Quality Metrics**

- Test coverage (if available)
- CI/CD success rates
- Lint/validation pass rates
- Code review approval rates
- Bug vs feature ratio

#### FR2: Data Aggregation

**FR2.1 Multi-Repository Aggregation**

- Collect metrics from multiple repositories
- Keep per-repo and aggregated metrics separate
- Support organization-wide dashboards
- Document aggregation methodology

**FR2.2 Trend Analysis**

- Compare current period to previous (week-over-week, month-over-month)
- Calculate deltas and percentage changes
- Identify anomalies and outliers
- Flag significant changes (>10% variation)

**FR2.3 Context-Aware Filtering**

- GitHub control plane: All metrics
- WordPress plugin: Plugin-specific metrics (downloads, compatibility, etc. if available)
- WordPress theme: Theme-specific metrics (similar to plugin)
- Support custom metric subsets via configuration

#### FR3: Output & Handoff

**FR3.1 Metrics Packaging**

- Package complete dataset with metadata
- Include collection timestamp and period
- Calculate and include key insights
- Format for Reporting agent handoff

**FR3.2 Integration with Reporting Agent**

- Hand off to Reporting agent (not report-writer)
- Use `metrics` category for report storage
- Provide structured data JSON + insights
- Support auto-generation of report title

#### FR4: Data Quality

**FR4.1 Validation**

- Validate all API responses
- Check data completeness
- Flag missing or incomplete data
- Gracefully handle API rate limits

**FR4.2 Logging & Audit**

- Log all collection runs with timestamp
- Record data sources and queries
- Track any data transformations
- Maintain audit trail for compliance

### Non-Functional Requirements

#### NFR1: Performance

- Collect metrics for single repo: <30 seconds
- Collect metrics for 5 repos: <2 minutes
- Support background/async execution
- Efficient API call usage (batch where possible)

#### NFR2: Reliability

- Handle GitHub API rate limiting gracefully
- Retry transient failures (exponential backoff)
- Fail safely with clear error messages
- Support partial data collection on failure

#### NFR3: Security

- Do NOT expose sensitive data (tokens, credentials)
- Do NOT store personal identifying information
- Support organization privacy settings
- Validate all input (repo names, date ranges, etc.)

#### NFR4: Maintainability

- Well-documented code with clear examples
- Comprehensive test coverage (80%+)
- Configuration-driven behavior
- No hardcoded values in code

#### NFR5: Scalability

- Support growth from 1 to 100+ repositories
- Efficient database/cache usage if needed
- Modular design for future extensions

## Design

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Metrics Agent                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Configuration Layer                             │  │
│  │  - Load repo context (GitHub/WordPress)          │  │
│  │  - Determine metrics subset                       │  │
│  │  - Set collection period                         │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↓                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Collection Module                               │  │
│  │  - Query GitHub API for issues/PRs               │  │
│  │  - Extract timestamps and metadata               │  │
│  │  - Handle rate limiting & retries                │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↓                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Aggregation Module                              │  │
│  │  - Calculate derived metrics (TTF, TTM)          │  │
│  │  - Compute aggregates (sum, avg, median)         │  │
│  │  - Calculate trends vs previous period           │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↓                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Analysis Module                                 │  │
│  │  - Identify patterns and anomalies               │  │
│  │  - Generate insights and recommendations         │  │
│  │  - Flag concerning trends                        │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↓                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Packaging Module                                │  │
│  │  - Format metrics dataset                        │  │
│  │  - Add metadata and insights                     │  │
│  │  - Prepare for Reporting agent                   │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↓                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Handoff to Reporting Agent                      │  │
│  │  - Send formatted metrics                        │  │
│  │  - Request metrics category report               │  │
│  │  - Output: .github/reports/metrics/*.md          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Configuration Structure

```json
{
  "context": "github-control-plane|wordpress-plugin|wordpress-theme",
  "collection_period": {
    "type": "days|weeks|since_last_report",
    "value": 7
  },
  "metrics": {
    "issues": true,
    "pull_requests": true,
    "contributors": true,
    "project_health": true,
    "quality": true
  },
  "repositories": [
    {
      "owner": "lightspeedwp",
      "name": ".github"
    }
  ],
  "analysis": {
    "trend_analysis": true,
    "anomaly_detection": true,
    "compare_to_previous": true
  },
  "output": {
    "format": "json|markdown",
    "include_insights": true,
    "include_recommendations": true
  }
}
```

### Data Model

**Metrics Dataset:**

```json
{
  "metadata": {
    "collection_period": "2026-08-05T00:00:00Z to 2026-08-12T23:59:59Z",
    "collected_at": "2026-08-12T14:30:00Z",
    "context": "github-control-plane",
    "repositories": ["lightspeedwp/.github"]
  },
  "metrics": {
    "issues": {
      "created": 24,
      "closed": 18,
      "closure_rate": 0.75,
      "avg_time_to_close_hours": 48.5,
      "median_ttf_hours": 42,
      "active_issues": 6,
      "stale_issues": 2,
      "reopened": 1
    },
    "pull_requests": {
      "created": 12,
      "merged": 11,
      "merge_rate": 0.917,
      "avg_time_to_merge_hours": 8.2,
      "median_ttm_hours": 6.5,
      "avg_review_time_hours": 4.1,
      "avg_size_lines_changed": 245,
      "ci_pass_rate": 0.95
    },
    "contributors": {
      "active_contributors": 8,
      "new_contributors": 1,
      "top_contributors": [
        {"name": "user1", "prs": 5, "reviews": 12},
        {"name": "user2", "prs": 3, "reviews": 8}
      ]
    },
    "project_health": {
      "open_issues": 6,
      "backlog_age_days": 15,
      "label_distribution": {
        "type:feature": 4,
        "type:bug": 2,
        "priority:high": 1
      }
    },
    "quality": {
      "ci_success_rate": 0.95,
      "code_review_approval_rate": 0.92
    }
  },
  "trends": [
    {
      "metric": "closure_rate",
      "current": 0.75,
      "previous": 0.72,
      "change_percent": 4.2,
      "direction": "up",
      "significant": false
    }
  ],
  "insights": [
    {
      "category": "performance",
      "finding": "Response times improving",
      "detail": "First response time down 12% vs last week",
      "trend": "positive",
      "action_recommended": "Continue current process improvements"
    }
  ]
}
```

## Context-Specific Adaptations

### GitHub Control Plane (`.github`)

- All metrics enabled
- Focus on governance and process health
- Label taxonomy: type:*, status:*, priority:*, area:*, meta:*
- Project tracking via GitHub Projects

### WordPress Plugin Repository

- Core metrics: Issues, PRs, contributors
- Additional: Plugin-specific metrics if available (downloads, compatibility)
- Focus on community engagement and release cadence
- May have separate documentation and support workflows

### WordPress Theme Repository

- Similar to plugin repository
- Theme-specific metrics (CSS metrics, performance, accessibility)
- Focus on visual consistency and documentation

## Success Criteria

### Phase 1 (Specification) ✅

- [ ] Agent specification document (this file) complete
- [ ] Architecture diagrams created
- [ ] Test plan defined
- [ ] Configuration structure documented
- [ ] Data model specified

### Phase 2 (Implementation)

- [ ] Agent code implemented with >80% test coverage
- [ ] Configuration files created for all contexts
- [ ] Integration with Reporting agent tested
- [ ] Error handling and edge cases covered
- [ ] Performance benchmarks met

### Phase 3 (Documentation)

- [ ] User guide with examples
- [ ] API reference documentation
- [ ] Configuration guide for each context
- [ ] Example outputs and reports
- [ ] Troubleshooting guide

### Phase 4 (Rollout)

- [ ] Tested in GitHub control plane
- [ ] Tested in WordPress plugin repository
- [ ] Tested in WordPress theme repository
- [ ] Team training completed
- [ ] Monitoring and alerts configured

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
