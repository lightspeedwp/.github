---
file_type: "documentation"
title: "Phase 4: Automation & Metrics Implementation Guide"
description: "GitHub Actions automation and metrics tracking for issue remediation system with scheduled triggers and batch processing"
version: "1.0"
last_updated: "2026-08-09"
category: "docs"
---

# Phase 4: Automation & Metrics Implementation Guide

**Status:** Phase 4 scaffold implementation. Workflow structure and metrics tracking foundation ready for Phase 2-3 implementation.

## Overview

Phase 4 automates the issue remediation process through GitHub Actions, enabling continuous improvement of issue metadata across the portfolio. The system processes issues on a schedule, tracks progress metrics, and generates reports.

## Architecture

```text
Schedule/Event → Orchestrator → Batch Processing → GitHub Updates
                                                         ↓
                                    Metrics Tracking ← Reports
```

## Components

### 1. GitHub Actions Workflow (`issue-remediation-automation.yml`)

**Triggers:**

- **Scheduled:** Nightly at 2 AM UTC (via cron: `0 2 * * *`)
- **Manual:** Workflow dispatch with options
- **Event-based:** Can be extended for issue creation/modification

**Execution Modes:**

**Mode 1: Single Issue (Manual)**

```bash
# UI: Workflow Dispatch
Inputs:
  - issue_number: 1234
  - dry_run: false
```

**Mode 2: Batch by Label (Manual)**

```bash
Inputs:
  - label: status:needs-triage
  - batch_size: 10
  - dry_run: false
```

**Mode 3: Default Nightly (Scheduled)**

- Automatically processes: `status:needs-triage`, `status:needs-template-fix`, `status:needs-assignee`
- Batch size: 10
- Generates reports

**Workflow Steps:**

1. **Checkout** — Clone repository
2. **Setup Node.js** — Install v22 with npm cache
3. **Install** — `npm ci --omit=dev`
4. **Determine Target** — Parse input to find which issues to process
5. **Remediate** — Run orchestrator for single issue or batch
6. **Aggregate Results** — Summarize remediation results
7. **Track Metrics** — Update progress metrics
8. **Upload Reports** — Store remediation logs as artifacts
9. **Summary** — Post results to job summary
10. **Notify** — Alert on failures

**Key Features:**

- ✅ Dry-run mode for safe testing
- ✅ Batch processing with pagination
- ✅ Automatic GitHub API token via `secrets.GITHUB_TOKEN`
- ✅ Artifact retention: 30 days
- ✅ Timeout: 30 minutes per workflow run
- ✅ Detailed logging and reporting

### 2. Results Aggregator (`aggregate-remediation-results.cjs`)

**Purpose:** Summarizes batch remediation results

**Processing:**

1. Reads all `.log` files from `reports/` directory
2. Parses remediation outcomes
3. Extracts metrics and statistics
4. Generates JSON summary

**Output Structure:**

```json
{
  "timestamp": "2026-08-09T15:10:00Z",
  "execution_summary": {
    "total_issues": 35,
    "successfully_remediated": 32,
    "failed": 2,
    "skipped": 1,
    "success_rate": 91
  },
  "quality_metrics": {
    "average_confidence": 84,
    "auto_apply_eligible": 25,
    "auto_apply_rate": 71
  },
  "recommendations_summary": {
    "type_labels": 28,
    "area_labels": 31,
    "priority_labels": 24,
    "assignee_suggestions": 22,
    "milestone_assignments": 18,
    "template_fixes": 8,
    "total": 131
  },
  "labels_processed": ["status:needs-triage", "status:needs-template-fix"],
  "errors": []
}
```

### 3. Metrics Tracker (`track-remediation-metrics.cjs`)

**Purpose:** Maintains historical metrics for trend analysis

**Functions:**

1. Reads latest remediation summary
2. Appends entry to metrics history
3. Calculates trends vs. previous run
4. Generates progress report markdown
5. Maintains 30-day rolling window

**Metrics Tracked:**

- Total issues processed
- Success rate (%)
- Auto-apply rate (%)
- Average confidence score (%)
- Recommendation counts by type
- Trend deltas (change vs. previous)

**Output Files:**

- `.github/data/remediation-metrics.json` — Historical metrics (JSON)
- `.githu./.github/reports/remediation-progress.md` — Human-readable report (Markdown)

**Example Report:**

```markdown
# Issue Remediation Progress Report

**Last Updated:** 2026-08-09T15:10:00Z

## Current Metrics

| Metric | Value |
|--------|-------|
| Total Issues Processed | 352 |
| Successfully Remediated | 312 |
| Success Rate | 89% |
| Auto-Apply Eligible | 275 |
| Auto-Apply Rate | 78% |
| Average Confidence | 84% |

## Trends (vs. previous run)

- Success Rate: 📈 +2%
- Auto-Apply Rate: 📈 +3%
- Total Issues: ➡️ 0
- Average Confidence: 📈 +1%

## Recent History

| Date | Issues | Success Rate | Confidence |
|------|--------|--------------|------------|
| Aug 09, 2026 | 35 | 91% | 84% |
| Aug 08, 2026 | 32 | 88% | 83% |
| ...
```

## Usage

### Scheduled Execution

The workflow runs automatically every night at 2 AM UTC. No action needed.

### Manual Single-Issue Remediation

1. Go to GitHub Actions → Issue Remediation Automation
2. Click "Run workflow"
3. Enter issue number (e.g., `1234`)
4. Click "Run workflow"
5. Monitor execution in workflow logs
6. Review results in job summary

### Manual Batch Processing

1. Go to GitHub Actions → Issue Remediation Automation
2. Click "Run workflow"
3. Enter label (e.g., `status:needs-triage`)
4. Set batch size (default: 10)
5. Click "Run workflow"
6. Monitor execution
7. Download remediation logs from artifacts

### Dry-Run Testing

Before applying changes to production issues:

1. Go to GitHub Actions → Issue Remediation Automation
2. Click "Run workflow"
3. Enter issue or label
4. Check "Dry run" ✓
5. Click "Run workflow"
6. Review what would be changed
7. Run again without dry-run to apply

## Monitoring & Reporting

### Real-time Monitoring

- **Job Summary:** Results posted to workflow job summary
- **Artifacts:** Remediation logs stored for 30 days
- **Logs:** Full workflow logs in Actions tab

### Progress Dashboard

Access progress over time:

- **File:** `.githu./.github/reports/remediation-progress.md`
- **Updated:** After each workflow run
- **Content:** Metrics, trends, recent history
- **Retention:** Last 30 days of data

### Metrics Data

- **File:** `.github/data/remediation-metrics.json`
- **Updated:** After each workflow run
- **Format:** JSON with historical entries
- **Usage:** For dashboards, notifications, analysis

## Configuration

### Change Schedule

Edit `.github/workflows/issue-remediation-automation.yml`:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Change time here
```

Cron format: `minute hour day month weekday`

- `0 2 * * *` = 2:00 AM every day
- `0 0 * * 0` = midnight every Sunday
- `*/30 * * * *` = every 30 minutes

### Change Default Labels

Edit workflow file, section "Determine remediation target":

```yaml
- name: Determine remediation target
  run: |
    ...
    # Change these labels:
    echo "label=status:needs-triage,status:needs-template-fix" >> $GITHUB_OUTPUT
```

### Adjust Batch Size

Default is 10 issues per batch. Adjust via:

- Workflow dispatch input
- Scheduled job step parameter
- Orchestrator `--batch=<N>` flag

## Extending Phase 4

### Add Custom Reporting

Extend `track-remediation-metrics.cjs`:

```javascript
// Add custom metric
metrics.custom = {
  largest_improvement: findLargestImprovement(metrics.history),
  most_common_issue_type: findMostCommon(...)
};
```

### Add Slack Notifications

Create new workflow step:

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Issue remediation complete: ${{ steps.results.outputs.success_rate }}% success"
      }
```

### Add PRs with Remediation Reports

Extend workflow to create pull requests with metrics:

```yaml
- name: Create metrics PR
  uses: peter-evans/create-pull-request@v5
  with:
    commit-message: 'chore: Update remediation metrics'
    branch: report/remediation-metrics
```

## Metrics Interpretation

**Success Rate:**

- 90%+ → Excellent, system working as designed
- 70-89% → Good, some manual review needed
- <70% → Review failures, may need handler adjustments

**Auto-Apply Rate:**

- 80%+ → High confidence suggestions, minimal review needed
- 60-79% → Balanced, good mix of auto + reviewed
- <60% → Many low-confidence suggestions, review Phase 2 detection

**Average Confidence:**

- 85%+ → High quality recommendations
- 70-84% → Good quality, some variance
- <70% → Recommendations need tuning

**Trend Indicators:**

- 📈 Improving = System getting better at detection
- 📉 Declining = May indicate data quality issues
- ➡️ Stable = Consistent performance

## Troubleshooting

**Workflow fails with API errors:**

- Check `secrets.GITHUB_TOKEN` is configured
- Verify token has `issues: write` permission
- Check GitHub API rate limits

**Low success rates:**

- Review failed handler logs
- Check Phase 2 analysis accuracy
- May indicate GitHub API changes

**Metrics not updating:**

- Verify `.github/data/` directory exists
- Check permissions on `.githu./.github/reports/`
- Review aggregator script output

## Next Steps (Phase 5)

Future enhancements:

1. **Dashboard Integration** — Real-time metrics dashboard
2. **Webhooks** — Trigger on issue creation/modification
3. **Custom Handlers** — Domain-specific remediation rules
4. **ML Feedback Loop** — Improve detection based on results
5. **Cost Optimization** — Batch scheduling for efficiency

## References

- **Phase 1:** Audit system
- **Phase 2:** Analysis modules
- **Phase 3:** Remediation handlers
- **Phase 4:** Automation (this guide)
- **Epic:** [Issue #1679](https://github.com/lightspeedwp/.github/issues/1679)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
