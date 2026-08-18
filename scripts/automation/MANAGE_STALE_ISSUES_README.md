---
file_type: automation-script-readme
title: manage-stale-issues.js - Stale Issue Management
description: Automatically apply meta:stale label and handle inactive issue archiving
version: 1.0.1
created_date: 2026-08-10T00:00:00.000Z
last_updated: '2026-08-18'
status: draft
authors:
  - lightspeedwp/maintainers
---

# manage-stale-issues.js — Stale Issue Management

Automatically manages inactive issues by applying `meta:stale` labels, posting warning comments, and optionally closing and archiving stale issues.

## Purpose

- **Activity Detection:** Identify issues with no activity for N days
- **Automation:** Auto-apply `meta:stale` label to inactive issues
- **Notification:** Post warning comments before archiving
- **Lifecycle:** Optional auto-close and archive capabilities
- **Safety:** Respects exclusion rules (epics, active work, critical priority)

## Features

### Core Functionality

- 📊 **Activity Analysis:** Detects inactive issues using commit/comment history
- 🏷️ **Label Management:** Applies `meta:stale` label to inactive issues
- 💬 **Notifications:** Posts warning comments before closing
- 🔒 **Smart Exclusions:** Skips epics, in-progress, and critical issues
- 📋 **Milestone Protection:** Excludes issues linked to milestones
- 🧪 **Dry-Run Mode:** Preview changes before applying
- 📊 **Reporting:** JSON, CSV, Markdown output formats

### Operating Modes

#### Dry-Run Preview

```bash
node scripts/automation/manage-stale-issues.js --dry-run
```

Shows what stale issues would be found without applying changes.

#### Apply with Labeling

```bash
node scripts/automation/manage-stale-issues.js --label
```

Automatically applies `meta:stale` label to inactive issues.

#### With Warning Comments

```bash
node scripts/automation/manage-stale-issues.js --label --comment
```

Labels inactive issues AND posts a 7-day warning comment.

#### Custom Threshold

```bash
node scripts/automation/manage-stale-issues.js --label --days 45
```

Find issues inactive for 45+ days instead of default 30.

#### Auto-Close Stale Issues

```bash
node scripts/automation/manage-stale-issues.js --label --comment --close
```

Labels, comments, AND automatically closes stale issues.

## Usage

### Installation

Requires:

- Node.js 18+
- `GITHUB_TOKEN` environment variable with repo access
- Octokit library (for GitHub API)

### Basic Commands

```bash
# Preview stale issues (no changes)
node scripts/automation/manage-stale-issues.js --dry-run

# Find stale issues (verbose output)
node scripts/automation/manage-stale-issues.js --dry-run --verbose

# Apply stale label (30+ days)
node scripts/automation/manage-stale-issues.js --label

# Label + comment warning
node scripts/automation/manage-stale-issues.js --label --comment

# Label + comment + close
node scripts/automation/manage-stale-issues.js --label --comment --close

# Custom threshold (45 days)
node scripts/automation/manage-stale-issues.js --label --days 45

# Export report
node scripts/automation/manage-stale-issues.js --dry-run --output ./stale-report.json

# CSV export
node scripts/automation/manage-stale-issues.js --dry-run --format csv --output ./stale.csv
```

### Output Formats

#### JSON (Default)

```json
{
  "management_date": "2026-08-10T19:00:00.000Z",
  "total_issues_analyzed": 350,
  "stale_threshold_days": 30,
  "dry_run": false,
  "actions": {
    "labeled": 45,
    "commented": 45,
    "closed": 0,
    "total": 90
  },
  "summary": {
    "stale_issues_found": 45,
    "issues_processed": 350,
    "errors": 0
  },
  "stale_issues": [
    {
      "number": 123,
      "title": "Old feature request",
      "daysSinceActivity": 45
    }
  ]
}
```

#### CSV

```csv
number,title,daysSinceActivity,action,status
123,Old feature request,45,labeled,success
124,Another stale issue,60,labeled,success
125,Critical issue,35,skipped,excluded (priority:critical)
```

#### Markdown

```markdown
# Stale Issues Management Report

**Date:** 2026-08-10T19:00:00Z  
**Mode:** Apply  
**Threshold:** 30 days  

## Summary

- **Issues Analyzed:** 350
- **Stale Found:** 45
- **Labeled:** 45
- **Commented:** 45
- **Errors:** 0

## Stale Issues

| # | Title | Inactive | Action |
|-|-|-|-|
| 123 | Old feature request | 45 days | labeled |
| 124 | Another stale issue | 60 days | labeled |
```

## Exclusion Rules

Issues are **automatically excluded** from stale management if they have:

- `type:epic` label
- `status:in-progress` label
- `priority:critical` label
- Any milestone assigned

**Rationale:** These represent active, important, or strategic work that should not be archived regardless of comment activity.

## How It Works

### Activity Detection

1. **Analyze Commits:** Last commit on issue/related PR
2. **Analyze Comments:** Last comment by anyone
3. **Calculate Age:** Days since most recent activity
4. **Compare Threshold:** If age ≥ threshold → stale

### Label Decision

```
Issue is Stale? (inactive ≥ N days)
  ├─ Yes → Check Exclusions
  │  ├─ Excluded? → Skip
  │  └─ Not Excluded?
  │     ├─ Has meta:stale? → Skip
  │     └─ No Label? → Apply + Optional Actions
```

### Optional Actions

Once labeled as stale, script can optionally:

1. **Post Comment** — 7-day warning before closure
2. **Close Issue** — Archive after 7 days of warning
3. **Label Only** — Just mark for visibility (safe default)

## Integration with GitHub Workflows

### Scheduled Weekly Stale Check

```yaml
name: Manage Stale Issues (Weekly)

on:
  schedule:
    - cron: '0 9 * * MON'  # 9 AM UTC Monday
  workflow_dispatch:

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: node scripts/automation/manage-stale-issues.js --label --days 30
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Manual Trigger with Options

```yaml
name: Manage Stale Issues (Manual)

on:
  workflow_dispatch:
    inputs:
      days:
        description: 'Inactivity threshold (days)'
        required: true
        default: '30'
      dry-run:
        description: 'Preview only?'
        required: true
        default: 'true'
      actions:
        description: 'Actions to take'
        required: true
        type: choice
        options:
          - label-only
          - label-and-comment
          - label-comment-close

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: |
          node scripts/automation/manage-stale-issues.js \
            ${{ inputs.dry-run == 'true' && '--dry-run' || '' }} \
            --days ${{ inputs.days }} \
            ${{ inputs.actions == 'label-only' && '--label' || '' }} \
            ${{ inputs.actions == 'label-and-comment' && '--label --comment' || '' }} \
            ${{ inputs.actions == 'label-comment-close' && '--label --comment --close' || '' }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Performance

### Typical Execution Time

- **350 issues:** ~2-3 minutes (analysis + actions)
- **Dry-run:** ~2-3 minutes (same as apply)
- **With comments/close:** +30 seconds per action

### Resource Usage

- **Memory:** <100 MB
- **CPU:** Minimal (mostly I/O bound)
- **API Rate Limit:** ~350-400 calls per run

## Troubleshooting

### Issue: "GITHUB_TOKEN not found"

```bash
export GITHUB_TOKEN=ghp_your_token_here
node scripts/automation/manage-stale-issues.js --dry-run
```

### Issue: "Rate limit exceeded"

Script has built-in rate limiting with exponential backoff. If you hit hard limits, wait 1 hour for reset or use a higher-permission token.

### Issue: "Dry-run shows stale but none labeled"

This is expected. Dry-run:

1. Identifies stale issues
2. Plans actions
3. Doesn't apply them

Run without `--dry-run` to actually apply labels.

### Issue: "Some issues not processed"

Check errors in report:

```bash
node scripts/automation/manage-stale-issues.js --output ./report.json
jq '.errors' ./report.json
```

## Testing

Run unit tests:

```bash
npm test -- scripts/automation/__tests__/manage-stale-issues.test.js
```

Test with specific threshold:

```bash
node scripts/automation/manage-stale-issues.js --dry-run --days 45 --verbose
```

## Acceptance Criteria (Phase 1.3)

- ✅ Finds inactive issues correctly
- ✅ Respects exclusion rules (epic, in-progress, critical, milestone)
- ✅ Posts warning comments before closing
- ✅ Optional auto-close capability
- ✅ 12+ unit tests covering all scenarios

## Related Scripts

- [`review-meta-labels.js`](./REVIEW_META_LABELS_README.md) — Audit meta label coverage
- [`sync-pr-labels.js`](./SYNC_PR_LABELS_README.md) — Sync PR status labels
- [`label-orchestrator.js`](./LABEL_ORCHESTRATOR_README.md) — Unified label management CLI

## Future Enhancements

- [ ] Custom exclusion rules via config file
- [ ] Archive to separate project instead of closing
- [ ] Gradual notifications (1st warning → 2nd warning → close)
- [ ] Metrics export (Prometheus format)
- [ ] Integration with GitHub Projects board updates

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
