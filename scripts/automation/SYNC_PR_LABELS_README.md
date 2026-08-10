---
file_type: automation-script-readme
title: sync-pr-labels.js - PR Label Synchronization
description: Automatically manage meta:has-pr label based on linked PRs in issue descriptions
version: 1.0.0
created_date: 2026-08-10
last_updated: 2026-08-10
status: draft
authors:
  - lightspeedwp/maintainers
---

# sync-pr-labels.js — PR Label Synchronization

Automatically manages the `meta:has-pr` label by scanning issue descriptions for linked PRs and syncing label state based on PR status.

## Purpose

- **Automation:** Remove manual label management overhead
- **Consistency:** Ensure every issue with an open linked PR has the `meta:has-pr` label
- **Cleanup:** Automatically remove stale labels when PRs are closed
- **Reporting:** Generate audit reports with change summaries

## Features

### Core Functionality

- 🔍 **PR Detection:** Scans issue descriptions for linked PR references (`#123`)
- 🔄 **Label Sync:** Adds/removes `meta:has-pr` based on PR state
- 📊 **Reporting:** JSON, CSV, Markdown output formats
- 🧪 **Dry-Run Mode:** Preview changes before applying
- 🔐 **Safe Operations:** All changes logged and reversible
- ⚡ **Rate Limiting:** Built-in GitHub API rate limit handling

### Operating Modes

#### Dry-Run (Preview)

```bash
node scripts/automation/sync-pr-labels.js --dry-run
```

Shows what changes would be made without applying them. Perfect for validation.

#### Apply Changes

```bash
node scripts/automation/sync-pr-labels.js
```

Applies all identified changes to issues.

#### Specific Issue

```bash
node scripts/automation/sync-pr-labels.js --issue 1710
```

Process only a single issue (useful for testing or fixing specific issues).

#### Verbose Mode

```bash
node scripts/automation/sync-pr-labels.js --dry-run --verbose
```

Detailed logging of all operations.

## Usage

### Installation

Requires:

- Node.js 18+
- `GITHUB_TOKEN` environment variable with repo access
- Octokit library (for GitHub API)

### Basic Commands

```bash
# Dry-run preview
node scripts/automation/sync-pr-labels.js --dry-run

# Apply changes
node scripts/automation/sync-pr-labels.js

# Single issue
node scripts/automation/sync-pr-labels.js --issue 1710

# Export report
node scripts/automation/sync-pr-labels.js --dry-run --output ./report.json

# CSV export
node scripts/automation/sync-pr-labels.js --dry-run --format csv --output ./changes.csv
```

### Output Formats

#### JSON (Default)

```json
{
  "sync_date": "2026-08-10T19:00:00.000Z",
  "total_issues_analyzed": 350,
  "dry_run": true,
  "changes": {
    "added": 45,
    "removed": 12,
    "total": 57
  },
  "summary": {
    "issues_with_valid_prs": 45,
    "issues_processed": 350,
    "errors": 0
  },
  "changes_detail": [
    {
      "type": "add",
      "issue": 1710,
      "label": "meta:has-pr",
      "reason": "Issue #1710 has valid linked PR(s): 1700",
      "dryRun": true
    }
  ]
}
```

#### CSV

```csv
type,issue,label,reason,dry_run
add,1710,meta:has-pr,Issue #1710 has valid linked PR(s): 1700,true
remove,1711,meta:has-pr,Issue #1711's linked PR(s) are not open,true
```

#### Markdown

```markdown
# PR Labels Sync Report

**Date:** 2026-08-10T19:00:00Z  
**Issues Analyzed:** 350  
**Mode:** Dry-Run

## Changes Summary

- **Added:** 45 labels
- **Removed:** 12 labels
- **Total:** 57 changes

## Sample Changes

1. Issue #1710: ADD meta:has-pr
   - Reason: Issue #1710 has valid linked PR(s): 1700
2. Issue #1711: REMOVE meta:has-pr
   - Reason: Issue #1711's linked PR(s) are not open
```

## How It Works

### Detection Logic

1. **Extract PR References:** Looks for `#NNN` patterns in issue body
2. **Validate PR Status:** Checks each PR to see if it's open
3. **Identify Valid PRs:** A PR is valid if it's open and linked
4. **Determine Label State:** Based on PR validity, add or remove label

### Label Decision Tree

```
Issue Has Body Text?
  ├─ Yes → Extract PR Numbers
  │  ├─ Has PR References?
  │  │  ├─ Yes → Check PR Status
  │  │  │  ├─ PR is Open?
  │  │  │  │  ├─ Yes → ADD meta:has-pr
  │  │  │  │  └─ No → REMOVE meta:has-pr
  │  │  │  └─ PR not found → REMOVE meta:has-pr
  │  │  └─ No → REMOVE meta:has-pr
  │  └─ No body → REMOVE meta:has-pr
```

### Safety Features

- ✅ **Dry-run preview** before any changes
- ✅ **Detailed logging** of all operations
- ✅ **Error collection** without stopping process
- ✅ **Rate limit handling** with automatic backoff
- ✅ **Reversible changes** (can add/remove labels as needed)

## Integration with GitHub Workflows

### Scheduled Daily Sync

```yaml
name: Sync PR Labels (Daily)

on:
  schedule:
    - cron: '0 3 * * *'  # 3 AM UTC daily
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: node scripts/automation/sync-pr-labels.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Manual Trigger

```yaml
name: Sync PR Labels (Manual)

on:
  workflow_dispatch:
    inputs:
      dry-run:
        description: 'Run in dry-run mode?'
        required: true
        default: 'true'
      issue:
        description: 'Specific issue number (optional)'
        required: false

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: |
          node scripts/automation/sync-pr-labels.js \
            ${{ inputs.dry-run == 'true' && '--dry-run' || '' }} \
            ${{ inputs.issue && format('--issue {0}', inputs.issue) || '' }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Performance

### Typical Execution Time

- **350 issues:** ~2-3 minutes
- **Dry-run:** ~2-3 minutes (same as apply)
- **Single issue:** <1 second

### Resource Usage

- **Memory:** <100 MB
- **CPU:** Minimal (mostly I/O bound)
- **API Rate Limit:** ~350 calls per run (paginated fetches + PR checks)

## Troubleshooting

### Issue: "GITHUB_TOKEN not found"

```bash
export GITHUB_TOKEN=ghp_your_token_here
node scripts/automation/sync-pr-labels.js
```

### Issue: "Rate limit exceeded"

Script automatically handles rate limiting with exponential backoff. If you hit hard limits, wait 1 hour for reset or use a higher-permission token.

### Issue: "Dry-run shows many changes but nothing applies"

This is expected. The script:

1. Prepares all changes in dry-run
2. Doesn't apply them
3. Only applies when you run without `--dry-run`

### Issue: "Some issues not processed"

Check the errors in the report:

```bash
node scripts/automation/sync-pr-labels.js --output ./report.json
jq '.errors' ./report.json
```

## Testing

Run unit tests:

```bash
npm test -- .jest-skip/sync-pr-labels.test.js
```

Test with a single issue:

```bash
node scripts/automation/sync-pr-labels.js --dry-run --issue 1710 --verbose
```

## Acceptance Criteria (Phase 1.2)

- ✅ Correctly identifies PR status (open/closed/merged)
- ✅ Adds/removes `meta:has-pr` based on state
- ✅ Dry-run mode works perfectly
- ✅ 10+ unit tests passing
- ✅ Handles rate limiting

## Related Scripts

- [`review-meta-labels.js`](./REVIEW_META_LABELS_README.md) — Audit meta label coverage
- [`manage-stale-issues.js`](./MANAGE_STALE_ISSUES_README.md) — Auto-apply stale labels
- [`label-orchestrator.js`](./LABEL_ORCHESTRATOR_README.md) — Unified label management CLI

## Future Enhancements

- [ ] Support for filtering by label (e.g., `--has-label type:feature`)
- [ ] Batch mode with progress bar
- [ ] Email/Slack notifications of changes
- [ ] Configuration file support
- [ ] Custom PR validation rules
- [ ] Metrics export (Prometheus format)

---

**Status:** Phase 1.2 Implementation (In Progress)  
**Last Updated:** 2026-08-10  
**Owner:** LightSpeedWP Maintainers
