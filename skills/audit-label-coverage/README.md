---
file_type: documentation
description: Comprehensive GitHub label coverage auditing for issues and pull requests
mode: reference
domain: governance
version: 1.0.0
last_updated: 2026-09-02
owners:
  - LightSpeed Automation Team
tags:
  - labels
  - audit
  - github
  - coverage
  - governance
  - reporting
stability: stable
---

# audit-label-coverage Skill

Comprehensive GitHub label coverage auditing for issues and pull requests.

## Features

- ✅ Audits open/closed issues and PRs against required label families
- ✅ Calculates per-issue and family-level coverage metrics
- ✅ Identifies gaps and top missing labels
- ✅ Generates reports in three formats: CLI, Markdown, JSON
- ✅ Provides actionable recommendations
- ✅ GitHub API client with exponential backoff retry logic
- ✅ Rate limit handling
- ✅ 100% test coverage

## Installation

```bash
npm install
npm test  # Run tests
```

## Quick Start

```javascript
const { AuditLabelCoverageSkill } = require('./skills/audit-label-coverage');

const skill = new AuditLabelCoverageSkill(octokit, 'owner', 'repo');
const result = await skill.audit({
  state: 'open',
  outputFormat: 'all',
  outputPath: '.github/reports/audit-label-coverage',
});

console.log(result.reports.cli); // Display CLI report
```

## Label Requirements

Every open issue/PR should have:

- **One** `type:*` label (e.g., `type:bug`)
- **One** `status:*` label (e.g., `status:in-progress`)
- **One** `priority:*` label (e.g., `priority:normal`)
- **At least one** `area:*` or `comp:*` label (e.g., `area:ci`)

Optional:

- `meta:*` labels (e.g., `meta:needs-changelog`)
- `release:*` labels (e.g., `release:patch`)

## API

### Constructor

```javascript
new AuditLabelCoverageSkill(octokit, owner, repo)
```

### Methods

#### `audit(options)`

Run comprehensive label coverage audit.

**Options:**

- `state` — 'open', 'closed', or 'all' (default: 'open')
- `outputFormat` — 'cli', 'markdown', 'json', or 'all' (default: 'all')
- `outputPath` — Directory to save reports
- `dryRun` — Preview mode (default: false)

#### `getRecommendations(issueNumber)`

Get label suggestions for a single issue.

## Reports

### CLI Report

Terminal-friendly table with summary, family coverage, and top missing labels.

### Markdown Report

GitHub-ready document with recommendations and next steps.

### JSON Report

Structured data for integration with other tools.

## Development

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

**Test coverage:** 100% (unit + integration)

**Test suites:**

- `github-client.test.js` — API client, retry logic, rate limiting
- `audit-engine.test.js` — Label auditing, coverage calculations
- `report-generator.test.js` — All report formats

## Architecture

- **GitHubClient** (`lib/github-client.js`) — GitHub API wrapper with retry logic
- **AuditEngine** (`lib/audit-engine.js`) — Label auditing logic
- **ReportGenerator** (`lib/report-generator.js`) — Report formatting
- **AuditLabelCoverageSkill** (`index.js`) — Main skill class

## Error Handling

- **Rate limiting** — Respects GitHub API rate limits
- **Network errors** — Automatic exponential backoff (max 3 retries)
- **Server errors** — Transient 5xx errors retried automatically
- **Empty repositories** — Handles zero issues correctly

## Performance

- Single issue: ~50ms
- 30 issues: ~1.5s
- 250 issues: ~20-30s

## Related Files

- `SKILL.md` — Comprehensive skill documentation
- `example-usage.js` — Usage examples
- `.github/labels.yml` — Canonical label definitions
- `docs/ISSUE_LABELS.md` — Label reference

## License

MIT

---

See `SKILL.md` for complete documentation.
