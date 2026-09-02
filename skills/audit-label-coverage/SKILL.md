---
type: skill
title: audit-label-coverage
description: Audit and report on GitHub issue/PR label coverage with actionable recommendations
version: 1.0
status: beta
author: LightSpeed Automation Team
tags:
  - labels
  - audit
  - issues
  - prs
  - coverage
  - governance
---

# audit-label-coverage Skill

Comprehensive label coverage auditing for GitHub issues and pull requests with automated recommendations and multi-format reporting.

## Overview

This skill audits which issues and PRs are missing required labels (`type:*`, `status:*`, `priority:*`, `area:*`) and generates actionable reports in three formats:

- **CLI Report** — Terminal-friendly table view
- **Markdown Report** — GitHub-ready documentation with recommendations
- **JSON Report** — Structured data for integration and tooling

## Installation

```bash
npm install
```

## Quick Start

### Programmatic Usage

```javascript
const { AuditLabelCoverageSkill } = require('./skills/audit-label-coverage');

const skill = new AuditLabelCoverageSkill(octokit, 'owner', 'repo');

// Audit all open issues/PRs
const result = await skill.audit({
  state: 'open',
  outputFormat: 'all',
  outputPath: '.github/reports/audit-label-coverage',
});

// Print CLI report
console.log(result.reports.cli);

// Save to files
// - .github/reports/audit-label-coverage/audit-report.txt
// - .github/reports/audit-label-coverage/audit-report.md
// - .github/reports/audit-label-coverage/audit-report.json
```

### Workflow Integration

```yaml
name: Label Coverage Audit
on:
  schedule:
    - cron: '0 2 * * 1' # Weekly Monday at 2 AM UTC
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Audit label coverage
        run: |
          npm install
          node scripts/audit-label-coverage.js \
            --owner lightspeedwp \
            --repo .github \
            --format all \
            --output .github/reports/audit-label-coverage

      - name: Create issue with results
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('.github/reports/audit-label-coverage/audit-report.md', 'utf-8');
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Weekly Label Coverage Audit',
              body: report,
              labels: ['type:audit', 'area:governance', 'meta:bot-generated']
            });
```

## API Reference

### Constructor

```javascript
new AuditLabelCoverageSkill(octokit, owner, repo)
```

**Parameters:**

- `octokit` — Authenticated Octokit GitHub API client
- `owner` — Repository owner (string)
- `repo` — Repository name (string)

### Methods

#### `audit(options)`

Runs comprehensive label coverage audit.

**Options:**

- `state` (string, default: `'open'`) — Issue state filter (`'open'`, `'closed'`, `'all'`)
- `outputFormat` (string, default: `'all'`) — Report format (`'cli'`, `'markdown'`, `'json'`, `'all'`)
- `outputPath` (string, optional) — Directory to save reports
- `dryRun` (boolean, default: `false'`) — Preview mode (no changes)

**Returns:** Promise resolving to:

```javascript
{
  success: true,
  auditResult: {
    total: number,
    fullyLabeled: number,
    partiallyLabeled: number,
    unlabeled: number,
    averageCoverage: number,
    familyCoverage: { family: { labeled: number, coverage: number } },
    topMissingLabels: [{ family: string, count: number, percentage: number }],
    topSuggestedLabels: [{ label: string, count: number }],
    issues: [{ number, title, coverage, labels, missing, suggestions }]
  },
  reports: { cli: string, markdown: string, json: string },
  dryRun: boolean
}
```

**Example:**

```javascript
const result = await skill.audit({
  state: 'open',
  outputFormat: 'markdown',
  outputPath: './reports'
});

console.log(`Audit complete: ${result.auditResult.fullyLabeled} fully labeled`);
```

#### `getRecommendations(issueNumber)`

Get label recommendations for a single issue.

**Parameters:**

- `issueNumber` (number) — GitHub issue/PR number

**Returns:** Promise resolving to:

```javascript
{
  number: number,
  coverage: number,
  missing: { family: true },
  suggestions: [string]
}
```

**Example:**

```javascript
const rec = await skill.getRecommendations(123);
console.log(`Issue #${rec.number}: ${rec.coverage}% coverage`);
console.log('Suggested labels:', rec.suggestions);
```

## Label Requirements

### Required (Every Issue)

| Family | Count | Example | Status |
|--------|-------|---------|--------|
| `type:*` | 1 | `type:bug` | Must have exactly one |
| `status:*` | 1 | `status:in-progress` | Must have exactly one |
| `priority:*` | 1 | `priority:normal` | Must have exactly one |
| `area:*` | 1+ | `area:ci` | Must have at least one |

### Optional

- `meta:*` — Meta labels (e.g., `meta:needs-changelog`)
- `release:*` — Release scope (e.g., `release:patch`)
- `comp:*` — Component labels (e.g., `comp:block-editor`)

## Report Examples

### CLI Report

```
════════════════════════════════════════════════════════════════════════════════
Label Coverage Audit Report
════════════════════════════════════════════════════════════════════════════════

SUMMARY
────────────────────────────────────────────────────────────────────────────────
Total Issues: 245
Fully Labeled (100%): 18 (7%)
Partially Labeled: 187 (76%)
Unlabeled (0%): 40 (16%)
Average Coverage: 68.5%

FAMILY COVERAGE
────────────────────────────────────────────────────────────────────────────────
Family      Labeled  Coverage  Status
────────────────────────────────────────────────────────────────────────────────
type        245      100%      ✓ Complete
status      203      82%       ✗ Incomplete
priority    145      59%       ✗ Incomplete
area        187      76%       ✗ Incomplete

TOP MISSING LABEL FAMILIES
────────────────────────────────────────────────────────────────────────────────
Family     Count  %
────────────────────────────────────────────────────────────────────────────────
priority   100    40%
area        58    23%
status      42    17%

TOP SUGGESTED LABELS
────────────────────────────────────────────────────────────────────────────────
Label                      Count
────────────────────────────────────────────────────────────────────────────────
status:needs-triage           58
priority:normal               85
area:ci                       42
════════════════════════════════════════════════════════════════════════════════
```

### Markdown Report

```markdown
# Label Coverage Audit Report

> Generated: 2026-09-02T14:35:00Z

## Summary

**Total Issues:** 245
**Fully Labeled:** 18 (7%)
**Partially Labeled:** 187 (76%)
**Unlabeled:** 40 (16%)
**Average Coverage:** 68.5%

## Family Coverage

| Family | Labeled | Coverage | Status |
|--------|---------|----------|--------|
| type | 245 | 100% | ✓ |
| status | 203 | 82% | ✗ |
| priority | 145 | 59% | ✗ |
| area | 187 | 76% | ✗ |

## Recommendations

### High Priority Gaps

- **priority**: 40% missing (100 issues)
- **area**: 23% missing (58 issues)
- **status**: 17% missing (42 issues)

### Most Common Suggestions

Most common suggestion: `status:needs-triage` (58 issues)

**Suggested bulk labels:**
- `status:needs-triage` (58 issues)
- `priority:normal` (85 issues)
- `area:ci` (42 issues)

## Next Steps

1. **Review low-coverage issues** — Start with issues at 0-50% coverage
2. **Apply suggested labels** — Use the automation tools to bulk-apply recommended labels
3. **Monitor progress** — Re-run audit weekly to track improvements
4. **Close gaps** — Focus on the highest-impact missing label families

---

*For detailed issue-by-issue data, use `--format json` flag.*
```

### JSON Report

```json
{
  "metadata": {
    "timestamp": "2026-09-02T14:35:00Z",
    "format": "json",
    "version": "1.0"
  },
  "summary": {
    "total": 245,
    "fullyLabeled": 18,
    "partiallyLabeled": 187,
    "unlabeled": 40,
    "averageCoverage": 68.5
  },
  "familyCoverage": {
    "type": { "labeled": 245, "coverage": 100 },
    "status": { "labeled": 203, "coverage": 82 },
    "priority": { "labeled": 145, "coverage": 59 },
    "area": { "labeled": 187, "coverage": 76 }
  },
  "topMissingLabels": [
    { "family": "priority", "count": 100, "percentage": 40 },
    { "family": "area", "count": 58, "percentage": 23 },
    { "family": "status", "count": 42, "percentage": 17 }
  ],
  "issues": [
    {
      "number": 1,
      "title": "Fix authentication timeout",
      "coverage": 100,
      "labels": {
        "type": ["type:bug"],
        "status": ["status:in-progress"],
        "priority": ["priority:high"],
        "area": ["area:security"]
      },
      "missing": [],
      "suggestions": []
    },
    {
      "number": 2,
      "title": "Add two-factor authentication",
      "coverage": 50,
      "labels": {
        "type": ["type:feature"]
      },
      "missing": ["status", "priority", "area"],
      "suggestions": ["status:*", "priority:*", "area:*"]
    }
  ]
}
```

## Features

### ✅ Implemented

- [x] Fetch open/closed issues and PRs
- [x] Audit against required label families
- [x] Calculate per-issue coverage percentage
- [x] Calculate family-level coverage metrics
- [x] Identify top missing labels
- [x] Identify top suggested labels
- [x] Generate CLI report
- [x] Generate Markdown report
- [x] Generate JSON report
- [x] GitHub API client with retry logic
- [x] Exponential backoff (2s, 4s, 8s)
- [x] Rate limit handling
- [x] Label validation against canonical set
- [x] 100% test coverage (unit + integration)

### 🔄 Future Enhancements

- [ ] Auto-apply suggestions (with approval)
- [ ] Trend tracking over time
- [ ] Compliance scoring (A-F grades)
- [ ] Label conflict detection
- [ ] Custom label requirements per issue type
- [ ] Slack notifications
- [ ] Scheduled audit workflow
- [ ] GitHub Issue template auto-updates

## Testing

```bash
# Run all tests
npm test -- skills/audit-label-coverage/__tests__

# Run with coverage
npm test -- skills/audit-label-coverage/__tests__ --coverage

# Watch mode
npm test -- skills/audit-label-coverage/__tests__ --watch
```

**Coverage:** 100% unit + integration tests

**Test suites:**

- `github-client.test.js` — API client, retry logic, rate limiting
- `audit-engine.test.js` — Label auditing, coverage calculations
- `report-generator.test.js` — All three report formats

## Error Handling

The skill handles:

- **Rate limiting** — Respects GitHub API rate limit reset times
- **Network errors** — Automatic exponential backoff retry (max 3 retries)
- **Server errors** — Transient 5xx errors retried automatically
- **Missing labels.yml** — Gracefully degrades without validation
- **Empty repositories** — Handles zero issues correctly
- **Invalid issue data** — Skips malformed records with logging

## Performance

- **Single issue audit:** ~50ms
- **Batch of 30 issues:** ~1.5s
- **250 issues (8 batches):** ~20-30s
- **Rate-limited:** Respects GitHub rate limits (60 req/min for REST API)

## Troubleshooting

### "401 Unauthorized"

Verify GITHUB_TOKEN is set and has `issues:read` permission:

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

### "403 Rate Limited"

Skill automatically handles rate limiting. If you hit limits:

1. Wait for reset time (shown in error)
2. Reduce batch size in workflow config
3. Run during off-peak hours

### Reports not saved

Ensure output directory is writable:

```bash
chmod 755 .github/reports
```

## Related Documentation

- [ISSUE_LABELS.md](../../docs/ISSUE_LABELS.md) — Label reference
- [ISSUE_TRIAGE_LABELING.md](../../docs/ISSUE_TRIAGE_LABELING.md) — Labeling automation
- [labels.yml](../../.github/labels.yml) — Canonical label definitions
- [Issue #1592](https://github.com/lightspeedwp/.github/issues/1592) — Label prefix governance
- [Issue #1786](https://github.com/lightspeedwp/.github/issues/1786) — This skill implementation

## License

MIT

---

**Built with ❤️ by LightSpeed Automation Team**  
*Last updated: 2026-09-02*
