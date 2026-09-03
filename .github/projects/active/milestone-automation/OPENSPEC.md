---
title: Milestone Automation — OpenSpec
description: Technical specifications and architecture documentation
type: spec
file_type: project-documentation
status: in-progress
version: "1.1.0"
owner: lightspeedwp/maintainers
owners:
  - lightspeedwp/maintainers
tags:
  - automation
  - specification
  - technical
  - phase-2
  - coderabbit-review
---

# Milestone Automation — Technical Specification

## Document Purpose

This OpenSpec document provides a structured technical reference for the milestone automation system. It documents:

- Architecture and design decisions
- Component specifications
- API integration patterns
- Configuration requirements
- Error handling strategies
- Testing requirements
- Deployment procedures

## 1. System Architecture

### 1.1 High-Level Design

```
GitHub Event
    ↓
GitHub Actions Workflow (.github/workflows/milestone-distribution.yml)
    ↓
  ┌─────────────────────────────┐
  │  Job: Process Event         │
  └─────────────────────────────┘
    ├─ Get active milestone (by due date)
    ├─ Find linked issues
    ├─ Update milestone on PR/issue
    └─ Post confirmation comment
    ↓
  ┌─────────────────────────────┐
  │  Job: Run Scripts           │
  └─────────────────────────────┘
    ├─ distribute-unallocated-milestones.js
    ├─ reassign-v1-to-v1-1.js
    └─ Post summary to Step Summary
    ↓
Result Logging & Reporting
```

### 1.2 Component Hierarchy

```
milestone-automation/
├── .github/workflows/
│   └── milestone-distribution.yml
├── scripts/automation/
│   ├── distribute-unallocated-milestones.js
│   ├── reassign-v1-to-v1-1.js
│   └── shared/
│       ├── github-api.js
│       ├── logger.js
│       └── config.js
├── .github/projects/active/milestone-automation/
│   ├── README.md
│   ├── PLANNING.md
│   ├── ROADMAP.md
│   ├── OPENSPEC.md (this file)
│   ├── TROUBLESHOOTING.md
│   └── RUNBOOK.md
```

## 2. Workflow Specification

### 2.1 Trigger Conditions

| Trigger | Event | Condition |
|---------|-------|-----------|
| PR Merge | `pull_request` | action: `closed`, merged: `true` |
| Issue Close | `issues` | action: `closed`, reason: `completed` |
| Manual Trigger | `workflow_dispatch` | Manual trigger via GitHub UI |
| Scheduled | `schedule` | Cron schedule (optional) |

### 2.2 Workflow Steps

#### Step 1: Setup & Authentication

```yaml
- name: Checkout code
  uses: actions/checkout@v4

- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'

- name: Install dependencies
  run: npm ci

- name: Validate environment
  run: node scripts/automation/validate-env.js
```

**Responsibilities:**
- Validate Node.js version ≥20
- Validate GitHub token available
- Validate Anthropic API key (optional, with fallback)

**Error Handling:**
- Fail if Node.js version < 20
- Fail if GITHUB_TOKEN unavailable
- Warn if ANTHROPIC_API_KEY unavailable (log fallback to local processing)

#### Step 2: Identify Active Milestone

```javascript
const milestones = await github.paginate('GET /repos/{owner}/{repo}/milestones', {
  state: 'open',
  per_page: 100
});

const activeMilestone = milestones
  .filter(m => m.due_date)
  .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))[0];
```

**Algorithm:**
1. Fetch all open milestones
2. Filter to those with due dates
3. Sort by due date (ascending)
4. Select first (earliest due date = current)

**Validation:**
- Error if no open milestones
- Warn if multiple milestones share same due date (use first)
- Log selected milestone with due date

#### Step 3: Find Linked Issues

```javascript
const payload = github.context.payload;
const linkedIssues = [];

// From PR description
if (payload.pull_request?.body) {
  const matches = payload.pull_request.body.matchAll(/#(\d+)/g);
  for (const match of matches) {
    linkedIssues.push(parseInt(match[1]));
  }
}

// From PR commits
const commits = await github.paginate('GET /repos/{owner}/{repo}/pulls/{pull_number}/commits');
// Parse commit messages for issue references
```

**Detection Methods:**
- PR description: `Fixes #123`, `Closes #456`
- Commit messages: `#789`
- PR-issue link API (if available)

**Validation:**
- Skip invalid issue numbers
- Skip issues not found (log warning)
- Deduplicate issue list

#### Step 4: Update Milestones

```javascript
for (const issueNumber of linkedIssues) {
  try {
    await github.rest.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      milestone: activeMilestone.number
    });
    
    logger.info(`Updated issue #${issueNumber} to ${activeMilestone.title}`);
  } catch (error) {
    logger.error(`Failed to update #${issueNumber}:`, error.message);
    // Retry logic here
  }
}
```

**Error Handling:**
- Retry up to 3 times on network errors
- Log but don't fail on permission errors
- Fail workflow on critical errors (auth, repo access)

#### Step 5: Post Confirmation

```javascript
const summary = `
✅ Milestone Allocation Summary
- Milestone: ${activeMilestone.title}
- Issues updated: ${successCount}
- Failed: ${failCount}
- Processing time: ${duration}ms
`;

await github.rest.issues.createComment({
  owner, repo,
  issue_number: payload.pull_request.number,
  body: summary
});
```

**Format:**
- Emoji indicators (✅, ⚠️, ❌)
- Count of successful and failed updates
- Processing time and resource usage
- Links to milestone

## 3. Script Specifications

### 3.1 distribute-unallocated-milestones.js

**Purpose:** Allocate all unallocated issues to the current milestone

**Input:**
```javascript
{
  owner: "lightspeedwp",
  repo: ".github",
  milestone: "v1.1",  // optional; if omitted, uses active
  dryRun: false,      // optional; if true, logs only
  batchSize: 50,      // optional; API batch size
  apiKey: "...",      // ANTHROPIC_API_KEY (optional)
}
```

**Algorithm:**
1. Fetch all issues with no milestone
2. Filter closed vs open (configurable)
3. For each issue, assign to current milestone
4. Log results and summary

**Output:**
```javascript
{
  totalProcessed: 234,
  successCount: 232,
  failureCount: 2,
  errorDetails: [
    { issueNumber: 45, error: "Permission denied" }
  ],
  processingTime: 3000,
  apiCallsUsed: 45,
  rateLimit: {
    remaining: 4955,
    resetAt: "2026-08-30T15:32:00Z"
  }
}
```

**Error Handling:**
- Graceful degradation: continue on individual failures
- Batch retry with exponential backoff
- Log all errors with issue number and reason
- Report rate limit status

### 3.2 reassign-v1-to-v1-1.js

**Purpose:** Migrate all v1 milestone allocations to v1.1

**Input:**
```javascript
{
  owner: "lightspeedwp",
  repo: ".github",
  fromMilestone: "v1",
  toMilestone: "v1.1",
  dryRun: false,
  batchSize: 50
}
```

**Algorithm:**
1. Find all issues with milestone = "v1"
2. Update each to milestone = "v1.1"
3. Skip issues that already have v1.1

**Validation:**
- Warn if v1.1 milestone doesn't exist
- Confirm before executing (dry-run first)

**Output:**
```javascript
{
  migrated: 89,
  skipped: 12,
  failed: 0,
  warnings: ["v1.1 milestone not found"]
}
```

### 3.3 Shared Modules

#### github-api.js

```javascript
class GitHubAPIClient {
  constructor(token, options = {}) {
    this.octokit = new Octokit({ auth: token });
    this.rateLimit = options.rateLimit || true;
  }
  
  async getMilestones(owner, repo, state = 'open') { }
  async getUnallocatedIssues(owner, repo, limit = Infinity) { }
  async updateIssue(owner, repo, issueNumber, updates) { }
  async postComment(owner, repo, issueNumber, body) { }
  async getRateLimit() { }
}
```

**Features:**
- Automatic rate limit handling
- Retry logic with exponential backoff
- Pagination support
- Request/response logging

#### logger.js

```javascript
class Logger {
  info(msg, meta = {}) { }
  warn(msg, meta = {}) { }
  error(msg, meta = {}) { }
  debug(msg, meta = {}) { }
  
  setLevel(level) { }  // INFO, WARN, ERROR, DEBUG
}
```

**Output:**
- Console (development)
- GitHub Actions Step Summary (production)
- Optional file logging

#### config.js

```javascript
module.exports = {
  github: {
    owner: process.env.GITHUB_REPOSITORY_OWNER || 'lightspeedwp',
    repo: process.env.GITHUB_REPOSITORY.split('/')[1] || '.github',
  },
  api: {
    baseUrl: 'https://api.github.com',
    timeout: 30000,
    retries: 3,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || null,
    fallbackToLocal: true,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'INFO',
    format: 'json',
  }
};
```

## 4. API Integration

### 4.1 GitHub REST API v3

**Endpoints Used:**

| Endpoint | Method | Purpose | Rate Limit |
|----------|--------|---------|-----------|
| `/repos/{owner}/{repo}/milestones` | GET | List milestones | 60/hour |
| `/repos/{owner}/{repo}/issues` | GET | List issues | 60/hour |
| `/repos/{owner}/{repo}/issues/{number}` | PATCH | Update issue | 5000/hour |
| `/repos/{owner}/{repo}/issues/{number}/comments` | POST | Post comment | 5000/hour |
| `/rate_limit` | GET | Check rate limit | counts toward limit |

**Rate Limit Handling:**

```javascript
async handleRateLimit(error) {
  if (error.status === 403 && error.message.includes('API rate limit')) {
    const resetTime = error.response.headers['x-ratelimit-reset'];
    const waitMs = (resetTime * 1000) - Date.now();
    
    if (waitMs > 0) {
      logger.warn(`Rate limited. Waiting ${waitMs}ms`);
      await delay(waitMs + 1000);  // Add buffer
      return true;  // Signal retry
    }
  }
  return false;
}
```

### 4.2 Anthropic API (Optional)

**Purpose:** Enhanced issue analysis and allocation (future)

**Key:**
- `ANTHROPIC_API_KEY` environment variable
- Optional; workflow continues with fallback

**Fallback Strategy:**
- Local deterministic allocation if API unavailable
- Log warning but don't fail
- Document fallback behavior in runbook

## 5. Configuration

### 5.1 Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `GITHUB_TOKEN` | string | Required | GitHub API token |
| `GITHUB_REPOSITORY` | string | Required | Repo in `owner/name` format |
| `ANTHROPIC_API_KEY` | string | Optional | Anthropic API key (optional) |
| `LOG_LEVEL` | string | `INFO` | Logging level |
| `DRY_RUN` | boolean | `false` | Test mode (logs only) |
| `BATCH_SIZE` | number | `50` | Issues per API batch |
| `MAX_RETRIES` | number | `3` | Retry attempts |
| `TIMEOUT_MS` | number | `30000` | API call timeout |

### 5.2 Workflow Configuration

```yaml
env:
  LOG_LEVEL: INFO
  DRY_RUN: false
  BATCH_SIZE: 50

jobs:
  milestone-distribution:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: write
      contents: read
    
    steps:
      # ... workflow steps ...
```

## 6. Error Handling & Recovery

### 6.1 Error Classification

| Category | Examples | Recovery |
|----------|----------|----------|
| **Transient** | Network timeout, rate limit | Exponential backoff + retry |
| **Permanent** | Invalid repo, bad milestone | Log and continue |
| **Critical** | No auth token, missing node | Fail workflow |
| **User** | Issue not found, bad input | Skip and log warning |

### 6.2 Retry Strategy

```
Attempt 1: Immediate
Attempt 2: Wait 2s
Attempt 3: Wait 4s
Max Attempts: 3
Failure: Log and continue
```

### 6.3 Logging Strategy

```javascript
logger.info('Started milestone distribution', {
  timestamp: new Date().toISOString(),
  repository: `${owner}/${repo}`,
  event: context.eventName,
  isDryRun: dryRun
});

// ... processing ...

logger.info('Completed milestone distribution', {
  duration: endTime - startTime,
  processed: successCount + failCount,
  succeeded: successCount,
  failed: failCount,
  rateLimit: remainingCalls
});
```

## 7. Testing Requirements

### 7.1 Unit Tests

- [ ] GitHub API client initialization
- [ ] Milestone selection algorithm
- [ ] Issue linking detection
- [ ] Error classification
- [ ] Logger output formatting
- [ ] Config loading

### 7.2 Integration Tests

- [ ] Full workflow run (dry-run mode)
- [ ] PR merge trigger
- [ ] Issue close trigger
- [ ] Comment posting
- [ ] Rate limit handling

### 7.3 Edge Case Tests

- [ ] Zero unallocated issues
- [ ] 100+ unallocated issues
- [ ] Missing ANTHROPIC_API_KEY
- [ ] Dry-run mode operation
- [ ] Rate limit exhaustion
- [ ] Missing milestone
- [ ] Deleted issues
- [ ] Duplicate issue links

### 7.4 Performance Tests

- [ ] Process 1000 issues
- [ ] Handle high API concurrency
- [ ] Memory usage stability
- [ ] Timeout handling

## 8. Deployment

### 8.1 Deployment Checklist

- [ ] Scripts tested locally
- [ ] Workflow syntax validated
- [ ] Permissions configured
- [ ] Environment variables set
- [ ] Rate limit monitoring active
- [ ] Logging configured
- [ ] Rollback plan ready
- [ ] Team briefed

### 8.2 Rollback Procedure

```bash
# Disable workflow
git revert <workflow-commit>

# Manually fix milestones if needed
node scripts/automation/reassign-v1-to-v1-1.js --from v1.1 --to v1
```

## 9. Monitoring & Observability

### 9.1 Key Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Workflow success rate | 99%+ | <95% |
| Mean response time | <5s | >10s |
| API errors | <1% | >5% |
| Issues updated/run | 1-200 | 0 or >500 |

### 9.2 Logging Points

1. **Start** — Workflow triggered, params logged
2. **Milestone selection** — Which milestone chosen, why
3. **Issue fetching** — Count, filters applied
4. **Update attempts** — Each issue, success/failure
5. **Completion** — Summary stats, timing
6. **Errors** — Detailed error info with context

### 9.3 Alerting

- ❌ Workflow failure → Immediate notification
- ⚠️ Slow runs (>10s) → Debug notification
- ⚠️ High error rate (>5%) → Alert team
- 📊 Rate limit critical (<100 remaining) → Warn

## 10. Phase 2 Follow-Up Status

### 10.1 CodeRabbit Review Findings (28 Total)

**✅ Completed (10/28):**
- ENH-003: Security vulnerabilities fixed
- ENH-002: Slack error handling fixed
- ENH-001: Metrics persistence fixed
- MON-002: Rate limit response parsing fixed
- DOC-004: Transaction documentation clarified
- MON-001: Job failure status corrected
- STATUS.md: Evidence alignment updated
- ENH-001: Calculation errors corrected
- ENH-002: Block Kit formatting fixed
- README/STATUS: Alignment synchronized

**⏳ Remaining (18/28):**
- 9 CI Investigation checks (infrastructure validation, Node 24+ required)
- See [FOLLOW-UP-FIXES.md](./FOLLOW-UP-FIXES.md) for detailed tracking

### 10.2 Related Documentation

- **Tracker:** [FOLLOW-UP-FIXES.md](./FOLLOW-UP-FIXES.md) — 28-item tracker with priority organization
- **API Strategy:** [DOC-003-API-RATE-LIMITS-STRATEGY.md](./DOC-003-API-RATE-LIMITS-STRATEGY.md) — Comprehensive rate limiting guide
- **Edge Cases:** [DOC-004-EDGE-CASES.md](./DOC-004-EDGE-CASES.md) — Transaction semantics and recovery procedures

## References

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [Phase 2 Follow-Up Tracker](./FOLLOW-UP-FIXES.md)

---

**Document Owner:** lightspeedwp/maintainers  
**Last Updated:** 2026-09-03  
**Status:** In Progress (Phase 2 Follow-Up)  
**Target Completion:** 2026-09-10  
**Progress:** 10/28 findings resolved (36%)
