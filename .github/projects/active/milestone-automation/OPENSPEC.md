---
title: Milestone Automation — OpenSpec
description: Technical specifications, Phase 2 completion evidence, and Phase 3 roadmap
type: spec
file_type: documentation
status: active
version: "1.2.0"
created_date: "2026-08-29"
last_updated: "2026-09-04"
owner: lightspeedwp/maintainers
owners:
  - lightspeedwp/maintainers
tags:
  - automation
  - specification
  - technical
  - phase-2-complete
  - phase-3-roadmap
  - infrastructure-requirements
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

**✅ Phase 2 Follow-Up Complete (13/28 — 46% as of 2026-09-04):**

**Critical Fixes — RESOLVED (4/4):**
- ✅ ENH-003: Security vulnerabilities (PR #2640, merged 2026-09-04)
- ✅ ENH-002: Slack error handling (PR #2640, merged 2026-09-04)
- ✅ ENH-001: Metrics persistence (PR #2640, merged 2026-09-04)
- ✅ MON-002: Rate limit response handling (PR #2640, merged 2026-09-04)

**Important Fixes — RESOLVED (3/3):**
- ✅ DOC-004: Transaction documentation (PR #2640, merged 2026-09-04)
- ✅ MON-001: Job failure status (PR #2640, merged 2026-09-04)
- ✅ STATUS.md: Evidence alignment (PR #2640, merged 2026-09-04)

**Polish Fixes — RESOLVED (3/3):**
- ✅ ENH-001: Calculation errors (PR #2640, merged 2026-09-04)
- ✅ ENH-002: Block Kit formatting (PR #2640, merged 2026-09-04)
- ✅ README/STATUS: Alignment synchronized (PR #2640, merged 2026-09-04)

**CI Investigation Checks (14/14) — Phase 2 Complete:**
- Check 11: README structure validation ✅ PR #2629
- Check 12: Mermaid diagram accessibility ✅ PR #2640
- Check 13: Label standardization audit ✅ PR #2629
- Check 14: Project-issue linking validation ✅ PR #2629
- Check 15: Documentation auto-generation ✅ PR #2629
- Check 16: OpenSpec validation ✅ PR #2629
- Check 17: FOLLOW-UP-FIXES tracker verification ✅ PR #2629
- Check 18: Phase status synchronization ✅ PR #2640
- Check 19: add-and-sync workflow validation ✅ PR #2678
- Check 20: PR event phase progression ✅ PR #2678
- Check 21: Reviewer workflow validation ✅ PR #2678
- Check 22: Standard labeling consistency ✅ PR #2678
- Check 23: Secrets scanning validation ✅ PR #2678
- Check 24: Workflow event routing validation ✅ PR #2678

**⏳ Phase 3 — Infrastructure-Blocked (4/28 — Requires Node.js 24+ Upgrade):**
- Check 25: Performance metrics validation (Node.js 24+ required)
- Check 26: Dependency analysis (Node.js 24+ required)
- Check 27: API performance benchmarking (Node.js 24+ required)
- Check 28: Extended testing scenarios (Node.js 24+ required)

**Related Issues:**
- [#2761](https://github.com/lightspeedwp/.github/issues/2761) — Recurring CI workflow failures (pre-existing, documented)
- [#2762](https://github.com/lightspeedwp/.github/issues/2762) — Phase 3 Infrastructure: Node.js 24+ upgrade blocker
- [#2763](https://github.com/lightspeedwp/.github/issues/2763) — ENH-001: Metrics Dashboard implementation
- [#2764](https://github.com/lightspeedwp/.github/issues/2764) — ENH-002: Slack notifications implementation
- [#2765](https://github.com/lightspeedwp/.github/issues/2765) — ENH-003: Manual trigger system implementation

### 10.2 Related Documentation

- **Tracker:** [FOLLOW-UP-FIXES.md](./FOLLOW-UP-FIXES.md) — 28-item tracker with completion status
- **Phase 2 Summary:** [PHASE-2-COMPLETION-SUMMARY.md](./PHASE-2-COMPLETION-SUMMARY.md) — Executive summary (13/28 resolved as of 2026-09-04)
- **Phase 2 Follow-Up:** [PHASE-2-FOLLOWUP-SUMMARY.md](./PHASE-2-FOLLOWUP-SUMMARY.md) — PR #2640 implementation details
- **Phase 3 Readiness:** [PHASE-3-READINESS.md](./PHASE-3-READINESS.md) — Phase 3 coordination hub with cross-project linking
- **Phase 3 Planning:** [PHASE-3-ENHANCEMENT-TASKS.md](./PHASE-3-ENHANCEMENT-TASKS.md) — Optional enhancements and timeline
- **CI Investigation:** [CI-INVESTIGATION-SUMMARY.md](./CI-INVESTIGATION-SUMMARY.md) — Comprehensive findings (Checks 11-24)
- **Workflow Validation:** [WORKFLOW-AUTOMATION-VALIDATION.md](./WORKFLOW-AUTOMATION-VALIDATION.md) — Workflow automation checks
- **API Strategy:** [DOC-003-API-RATE-LIMITS-STRATEGY.md](./DOC-003-API-RATE-LIMITS-STRATEGY.md) — Comprehensive rate limiting guide
- **Edge Cases:** [DOC-004-EDGE-CASES.md](./DOC-004-EDGE-CASES.md) — Transaction semantics and recovery procedures

## 11. Phase 3 Implementation Roadmap

### 11.1 Enhancement Initiatives

#### ENH-001: Metrics Dashboard

**Issue:** [#2763](https://github.com/lightspeedwp/.github/issues/2763)  
**Effort:** 8-12 hours  
**Priority:** High  
**Status:** Ready for implementation

**Specification:**
- Real-time workflow metrics collection
- Dashboard UI (HTML/React)
- GitHub API integration for live data
- Alert thresholds and anomaly detection
- Historical data retention and trend analysis

**Success Criteria:**
- Dashboard displays real-time workflow metrics
- Alerts trigger on performance anomalies
- Historical data available for trend analysis
- <5s dashboard load time

**Related Design:** [ENH-001-METRICS-DASHBOARD-DESIGN.md](./ENH-001-METRICS-DASHBOARD-DESIGN.md)

---

#### ENH-002: Slack Notification System

**Issue:** [#2764](https://github.com/lightspeedwp/.github/issues/2764)  
**Effort:** 8-10 hours  
**Priority:** High  
**Status:** Ready for implementation

**Specification:**
- Slack webhook integration for workflow events
- Message templates (Block Kit format)
- Success/failure/warning notifications
- Channel configuration and routing
- Notification preferences and filtering

**Success Criteria:**
- Notifications sent on workflow completion
- Error notifications include troubleshooting info
- Users can configure notification preferences
- No notification delays (real-time)

**Related Design:** [ENH-002-SLACK-NOTIFICATIONS-DESIGN.md](./ENH-002-SLACK-NOTIFICATIONS-DESIGN.md)

---

#### ENH-003: Manual Trigger System

**Issue:** [#2765](https://github.com/lightspeedwp/.github/issues/2765)  
**Effort:** 10-12 hours  
**Priority:** Medium  
**Status:** Ready for implementation

**Specification:**
- GitHub issue label-based workflow triggers
- Issue comment parser for commands
- Workflow dispatcher logic
- Permission validation and security hardening
- Audit trail logging for all manual triggers

**Success Criteria:**
- Users can trigger workflows via issue labels
- Dry-run mode available for testing
- Audit trail logs all triggered runs
- Permission validation prevents unauthorized access

**Related Design:** [ENH-003-MANUAL-TRIGGER-DESIGN.md](./ENH-003-MANUAL-TRIGGER-DESIGN.md)

---

### 11.2 Phase 3 Timeline

| Week | Dates | Tasks | Output |
|------|-------|-------|--------|
| **1** | 2026-09-05 to 2026-09-11 | Infrastructure upgrade, Metrics Dashboard MVP | Unblocked Node.js 24+ |
| **2** | 2026-09-12 to 2026-09-18 | Slack integration, Manual triggers framework | ≥1 enhancement functional |
| **3+** | 2026-09-19 to 2026-09-30 | Polish, security, production readiness | All enhancements production-ready |

---

## 12. Infrastructure Requirements

### 12.1 Node.js Version Requirement

**Current State:**
- Runtime: Node.js 22.22.2
- Requirement: Node.js 24+ for Phase 3 CI validation
- Status: ⏳ Blocker (Checks 25-28 cannot run)

**Impact:**
- Blocks 4 CodeRabbit findings (14% of total)
- Required for performance benchmarking
- Required for dependency analysis
- Affects API performance validation

**Resolution Plan:**

```yaml
Phase 3, Step 1 (2026-09-05):
  - Audit Node.js 24 compatibility
  - Plan GitHub Actions runner updates
  - Create upgrade branch

Phase 3, Step 2 (2026-09-06 to 2026-09-08):
  - Upgrade GitHub Actions environment
  - Test milestone-automation scripts on Node.js 24
  - Verify performance baseline

Phase 3, Step 3 (2026-09-09):
  - Re-run Checks 25-28 with Node.js 24
  - Document any compatibility issues
  - Finalize performance metrics
```

**Upgrade Validation:**
- [ ] Scripts run without errors on Node.js 24
- [ ] Performance metrics collected
- [ ] Dependency analysis complete
- [ ] No breaking changes from Node.js 22 → 24

### 12.2 GitHub Actions Runner Specifications

**Current Requirements:**
- Runner: `ubuntu-latest`
- Permissions: `issues:write`, `pull-requests:write`, `contents:read`
- Timeout: 30 minutes per job
- Memory: ~1GB per job

**Phase 3 Requirements (With Enhancements):**
- Node.js 24+ runtime
- Slack API credentials (ENH-002)
- React build tools (ENH-001 dashboard)
- Performance monitoring tools
- Extended timeout: 45 minutes (for benchmarking)

**Configuration:**

```yaml
jobs:
  milestone-distribution:
    runs-on: ubuntu-latest
    timeout-minutes: 45
    env:
      NODE_VERSION: 24
      ENABLE_METRICS: true
      ENABLE_SLACK: true
    
    permissions:
      issues: write
      pull-requests: write
      contents: read
      statuses: write  # For workflow status updates
```

### 12.3 Environment Variables (Phase 3)

**Existing Variables:**
- `GITHUB_TOKEN` — GitHub API authentication
- `GITHUB_REPOSITORY` — Target repository
- `ANTHROPIC_API_KEY` — Optional AI API key

**Phase 3 Additions:**
- `SLACK_WEBHOOK_URL` — Slack integration endpoint
- `SLACK_CHANNEL` — Notification channel
- `METRICS_ENABLED` — Enable metrics collection
- `DASHBOARD_URL` — Metrics dashboard location
- `PERFORMANCE_BASELINE` — Expected performance benchmark

**Security Considerations:**
- All sensitive variables as GitHub Secrets
- Rotate Slack webhooks regularly
- Audit API key usage
- Log all manual trigger operations

### 12.4 Dependency Updates Required for Phase 3

**Current Dependencies:**
```json
{
  "octokit": "^2.0.0",
  "node": ">=22.0.0"
}
```

**Phase 3 Additions:**
```json
{
  "react": "^18.0.0",        // ENH-001: Dashboard
  "express": "^4.18.0",      // ENH-001: Dashboard API
  "@slack/bolt": "^3.15.0",  // ENH-002: Slack integration
  "node": ">=24.0.0"         // Infrastructure requirement
}
```

**Compatibility Notes:**
- Slack Bolt requires Node.js 18+
- React 18 requires Node.js 14+
- Performance metrics require native Node.js 24 features

---

## References

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js 24 Release Notes](https://nodejs.org/en/blog/release/v24.0.0/)
- [Slack API Documentation](https://api.slack.com/)
- [Phase 2 Follow-Up Tracker](./FOLLOW-UP-FIXES.md)
- [Phase 3 Enhancement Planning](./PHASE-3-ENHANCEMENT-TASKS.md)
- [Phase 3 Readiness Hub](./PHASE-3-READINESS.md)

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [Phase 2 Follow-Up Tracker](./FOLLOW-UP-FIXES.md)
- [Phase 3 Enhancement Planning](./PHASE-3-ENHANCEMENT-TASKS.md)

---

**Document Owner:** lightspeedwp/maintainers  
**Last Updated:** 2026-09-04  
**Status:** ✅ Phase 2 Complete (13/28 findings resolved via PR #2640); 🚀 Phase 3 In Progress (3 enhancements ready, 4 infrastructure-blocked)  
**Target Phase 3 Completion:** 2026-09-30  
**Progress:** 13/28 findings resolved (46%); 4 infrastructure-blocked (Node.js 24+ required); 3 enhancements ready for implementation

**Key Links:**
- [Phase 3 Readiness Hub](./PHASE-3-READINESS.md) — Coordination and cross-project linking
- [Phase 2 Follow-Up (PR #2640)](https://github.com/lightspeedwp/.github/pull/2640) — Merged 2026-09-04
- [Phase 3 Enhancement Issues](#112-github-api-endpoint-lists) — #2763, #2764, #2765
- [Node.js 24+ Blocker](#121-nodejs-version-requirement) — Required for Phase 3 completion
