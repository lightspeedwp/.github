---
file_type: "documentation"
title: "Automation Script Usage Examples"
description: "Command-line examples and integration patterns for the automation scripts in this repository."
version: "v1.0"
created_date: "2026-08-30"
last_updated: "2026-08-30"
owners: ["LightSpeed Engineering"]
tags: ["automation", "scripts", "usage"]
status: "active"
stability: "stable"
domain: "governance"
mode: "information"
---

# Automation Script Usage Examples

Common command-line examples and integration patterns for all automation scripts.

---

## Quick Start

### Basic Dry-Run (Preview Changes)
```bash
export GITHUB_TOKEN="your_github_token"

# Review what handlers would do
node scripts/automation/handlers-orchestrator.js \
  --mode dry-run \
  --handlers template-fix,triage \
  --limit 20
```

### Production Mode (Apply Changes)
```bash
node scripts/automation/handlers-orchestrator.js \
  --mode auto \
  --handlers triage \
  --auto-threshold 85 \
  --limit 50 \
  --batch-size 10
```

### Interactive Mode (Confirm Each Change)
```bash
node scripts/automation/handlers-orchestrator.js \
  --mode interactive \
  --handlers template-fix \
  --limit 10
```

---

## Script-Specific Examples

### handlers-orchestrator.js

**Purpose**: Route issues to Tier 1 handlers (template-fix, triage)

#### Example 1: Dry-run Preview
```bash
node scripts/automation/handlers-orchestrator.js \
  --mode dry-run \
  --handlers template-fix,triage \
  --limit 50 \
  --batch-size 10
```

**Output**: Shows what would be changed without applying anything.

#### Example 2: Auto Mode with Retries
```bash
node scripts/automation/handlers-orchestrator.js \
  --mode auto \
  --handlers triage \
  --limit 100 \
  --batch-size 5 \
  --max-retries 3 \
  --rate-limit 100 \
  --timeout 30000
```

**Configuration**:
- Max 100 issues
- Process 5 at a time
- Retry transient errors up to 3 times
- Rate limit to 100 API calls/minute
- 30 second timeout per issue

#### Example 3: Template Fix Only
```bash
node scripts/automation/handlers-orchestrator.js \
  --mode dry-run \
  --handlers template-fix \
  --limit 25
```

**Use Case**: Fix invalid issue templates only, skip triage.

#### Example 4: High-Confidence Auto Triage
```bash
node scripts/automation/handlers-orchestrator.js \
  --mode auto \
  --handlers triage \
  --auto-threshold 95 \
  --limit 200 \
  --batch-size 20
```

**Use Case**: Auto-apply only high-confidence triage decisions (≥95% confidence).

---

### manage-stale-issues.js

**Purpose**: Identify and process stale issues (no recent activity)

#### Example 1: Notify on Stale Issues (30 days)
```bash
node scripts/automation/manage-stale-issues.js \
  --days 30 \
  --action notify \
  --dry-run
```

**Use Case**: Preview which issues will be notified as stale.

#### Example 2: Apply Stale Labels
```bash
node scripts/automation/manage-stale-issues.js \
  --days 60 \
  --action label \
  --label "status:stale"
```

**Use Case**: Label issues inactive for >60 days.

#### Example 3: Auto-Close Very Stale Issues
```bash
node scripts/automation/manage-stale-issues.js \
  --days 180 \
  --action close \
  --exclude-labels "type:epic,priority:critical"
```

**Use Case**: Close issues inactive >180 days, except epics and critical issues.

#### Example 4: Exclude Multiple Label Types
```bash
node scripts/automation/manage-stale-issues.js \
  --days 30 \
  --action notify \
  --exclude-labels "status:blocked,type:feature-request,priority:high"
```

**Use Case**: Notify on stale issues, but exclude blocked, feature request, and high-priority items.

---

### audit-issue-metadata.js

**Purpose**: Audit and report on issue metadata patterns

#### Example 1: Generate Full Audit Report
```bash
node scripts/automation/audit-issue-metadata.js \
  --output "./audit-report-2026-08-30.csv"
```

**Output**: CSV file with metadata analysis.

#### Example 2: Audit Specific Date Range
```bash
node scripts/automation/audit-issue-metadata.js \
  --output "./q3-audit.csv" \
  --start-date "2026-07-01" \
  --end-date "2026-09-30"
```

**Use Case**: Quarterly audit of issue management practices.

#### Example 3: Audit by Label Filter
```bash
node scripts/automation/audit-issue-metadata.js \
  --output "./type-bug-audit.csv" \
  --filter "label:type:bug"
```

**Use Case**: Audit only bug reports.

---

### allocate-to-milestone.js

**Purpose**: Allocate issues to milestones based on priority and capacity

#### Example 1: Allocate to v2.0 Milestone
```bash
node scripts/automation/allocate-to-milestone.js \
  --milestone "v2.0" \
  --capacity 50 \
  --strategy greedy \
  --dry-run
```

**Use Case**: Preview allocation of 50 high-priority issues to v2.0.

#### Example 2: Balanced Distribution
```bash
node scripts/automation/allocate-to-milestone.js \
  --milestone "Sprint 35" \
  --capacity 30 \
  --strategy balanced \
  --priority-weight 0.7
```

**Use Case**: Distribute issues evenly, weighing priority at 70%.

#### Example 3: Deadline-First Allocation
```bash
node scripts/automation/allocate-to-milestone.js \
  --milestone "Q3-Release" \
  --strategy deadline-first \
  --dry-run
```

**Use Case**: Allocate issues by deadline priority.

---

### sync-pr-labels.js

**Purpose**: Synchronize PR labels with related issue labels

#### Example 1: Sync Single PR
```bash
node scripts/automation/sync-pr-labels.js \
  --pr-number 1234 \
  --strategy merge \
  --dry-run
```

**Use Case**: Preview label sync for PR #1234 (merge strategy).

#### Example 2: Apply Label Sync
```bash
node scripts/automation/sync-pr-labels.js \
  --pr-number 5678 \
  --strategy override \
  --fix
```

**Use Case**: Force PR labels to match issue labels (override strategy).

#### Example 3: Conflict Resolution Only
```bash
node scripts/automation/sync-pr-labels.js \
  --strategy conflict-only
```

**Use Case**: Only sync PRs that have conflicting labels.

---

### review-meta-labels.js

**Purpose**: Review and validate meta label usage

#### Example 1: Validate Meta Labels (No Changes)
```bash
node scripts/automation/review-meta-labels.js \
  --strict \
  --report
```

**Use Case**: Generate report on meta label usage issues.

#### Example 2: Auto-Fix Meta Labels
```bash
node scripts/automation/review-meta-labels.js \
  --fix \
  --report
```

**Use Case**: Auto-correct common meta label issues.

#### Example 3: Strict Validation Report
```bash
node scripts/automation/review-meta-labels.js \
  --strict \
  --report \
  --output "./meta-labels-audit.txt"
```

**Use Case**: Generate detailed audit of all meta label violations.

---

### review-status-labels.js

**Purpose**: Review and validate status label consistency

#### Example 1: Status Label Validation
```bash
node scripts/automation/review-status-labels.js \
  --dry-run \
  --report
```

**Use Case**: Preview status label inconsistencies.

#### Example 2: Fix Status Labels
```bash
node scripts/automation/review-status-labels.js \
  --fix
```

**Use Case**: Auto-correct status label conflicts.

#### Example 3: Filter by Current Status
```bash
node scripts/automation/review-status-labels.js \
  --filter "status:in-progress" \
  --report
```

**Use Case**: Review only in-progress issues.

---

### add-issue-template-sections.js

**Purpose**: Add or update issue template sections

#### Example 1: Add Custom Section
```bash
node scripts/automation/add-issue-template-sections.js \
  --section "Performance Impact" \
  --description "Describe expected performance impact" \
  --required \
  --dry-run
```

**Use Case**: Preview adding a new template section.

#### Example 2: Update Existing Section
```bash
node scripts/automation/add-issue-template-sections.js \
  --section "Acceptance Criteria" \
  --description "Updated acceptance criteria format" \
  --update
```

**Use Case**: Update an existing template section.

---

### pr-triage-orchestrator.js

**Purpose**: Orchestrate PR triage across multiple handlers

#### Example 1: Triage All Open PRs
```bash
node scripts/automation/pr-triage-orchestrator.js \
  --handlers "review,assign,label" \
  --batch-size 5 \
  --dry-run
```

**Use Case**: Preview PR triage for all open PRs.

#### Example 2: Triage Specific PR
```bash
node scripts/automation/pr-triage-orchestrator.js \
  --pr-number 999 \
  --handlers "review,assign"
```

**Use Case**: Triage specific PR with review and assign handlers.

---

### bulk-issue-metadata-updater.js

**Purpose**: Bulk update issue metadata

#### Example 1: Update from CSV
```bash
node scripts/automation/bulk-issue-metadata-updater.js \
  --data-file "./updates.csv" \
  --batch-size 10 \
  --dry-run
```

**CSV Format**:
```csv
issue_number,field,value
1234,assignee,user@example.com
5678,milestone,v2.0
9012,label,type:feature
```

#### Example 2: Add Label to Multiple Issues
```bash
node scripts/automation/bulk-issue-metadata-updater.js \
  --field "label" \
  --value "priority:high" \
  --filter "status:needs-triage" \
  --batch-size 20
```

**Use Case**: Add "priority:high" label to all issues needing triage.

---

### staging-validation.js

**Purpose**: Validate staging/release readiness

#### Example 1: Validate Release Branch
```bash
node scripts/automation/staging-validation.js \
  --branch "release/v2.0" \
  --milestone "v2.0" \
  --report
```

**Use Case**: Validate release branch before deployment.

#### Example 2: Strict Validation
```bash
node scripts/automation/staging-validation.js \
  --branch "staging" \
  --strict \
  --report
```

**Use Case**: Strict validation with no exceptions.

#### Example 3: Generate Validation Report
```bash
node scripts/automation/staging-validation.js \
  --milestone "v2.1" \
  --report \
  --output "./release-validation-2026-08-30.txt"
```

**Use Case**: Generate detailed release validation report.

---

## GitHub Actions Integration

### Example Workflow: Nightly Issue Triage

```yaml
name: Nightly Issue Triage
on:
  schedule:
    - cron: "0 2 * * *"  # 2 AM daily

jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '24'
      - name: Install dependencies
        run: npm ci
      
      - name: Run Handlers Orchestrator
        run: |
          node scripts/automation/handlers-orchestrator.js \
            --mode auto \
            --handlers triage \
            --batch-size 10 \
            --max-retries 3 \
            --rate-limit 100
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Example Workflow: Weekly Stale Issue Check

```yaml
name: Weekly Stale Issues
on:
  schedule:
    - cron: "0 9 * * 1"  # Monday 9 AM

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Notify on Stale Issues
        run: |
          node scripts/automation/manage-stale-issues.js \
            --days 30 \
            --action notify \
            --exclude-labels "type:epic,priority:critical"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Example Workflow: Pre-Release Validation

```yaml
name: Release Validation
on:
  pull_request:
    branches:
      - release/*

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Validate Staging
        run: |
          node scripts/automation/staging-validation.js \
            --branch ${{ github.head_ref }} \
            --strict \
            --report
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Common Patterns

### Batch Processing Pattern
```bash
# Process large dataset in batches
node scripts/automation/handlers-orchestrator.js \
  --limit 1000 \
  --batch-size 50 \
  --max-retries 3
```

Benefits:
- Reduces memory overhead
- Better rate limit compliance
- Easier to resume on failure
- Better progress reporting

### Dry-Run Then Apply Pattern
```bash
# First, preview changes
node scripts/automation/handlers-orchestrator.js \
  --mode dry-run \
  --handlers triage

# Then, apply if preview looks good
node scripts/automation/handlers-orchestrator.js \
  --mode auto \
  --handlers triage
```

### Chained Orchestration Pattern
```bash
# Run handlers first
node scripts/automation/handlers-orchestrator.js --mode auto

# Then review and validate
node scripts/automation/review-meta-labels.js --fix

# Finally, generate report
node scripts/automation/audit-issue-metadata.js --output report.csv
```

---

## Configuration Best Practices

### For CI/CD Environments
```bash
# Conservative settings for automated runs
node scripts/automation/handlers-orchestrator.js \
  --mode auto \
  --batch-size 5 \
  --max-retries 2 \
  --rate-limit 50 \
  --timeout 20000 \
  --auto-threshold 90
```

### For Manual Operations
```bash
# More aggressive settings for interactive runs
node scripts/automation/handlers-orchestrator.js \
  --mode dry-run \
  --batch-size 20 \
  --max-retries 5 \
  --rate-limit 200 \
  --timeout 60000
```

### For Large Datasets
```bash
# Optimized for bulk operations
node scripts/automation/bulk-issue-metadata-updater.js \
  --batch-size 100 \
  --rate-limit 100
```

---

## Troubleshooting Common Issues

### "Rate limit exceeded"
```bash
# Reduce rate limit or batch size
node scripts/automation/handlers-orchestrator.js \
  --rate-limit 50 \
  --batch-size 5
```

### "Timeout errors"
```bash
# Increase timeout and retry limit
node scripts/automation/handlers-orchestrator.js \
  --timeout 60000 \  # Increased from 30000
  --max-retries 5
```

### "Memory usage too high"
```bash
# Reduce batch size
node scripts/automation/handlers-orchestrator.js \
  --batch-size 3 \  # Reduced from 10
  --limit 100
```

---

## Related Documentation

- **Registry**: `REGISTRY.md` — Complete script inventory
- **Integration Guide**: `INTEGRATION_GUIDE.md` — Adding new scripts
- **Troubleshooting**: `TROUBLESHOOTING.md` — Common issues and solutions

---

**Generated By**: Claude Code  
**Date**: 2026-08-30  
**Version**: 1.0
