# Metrics Agent Phase 2 — Continuation Prompt (Tasks 2.3–2.5)

**Status:** Tasks 2.1 & 2.2 complete (merged to develop); Tasks 2.3–2.5 ready to implement  
**Target Completion:** 2026-09-07 (1 week remaining)  
**Current Branch:** Develop (ready for new feature branch)

---

## PHASE 2 COMPLETION STATUS

### ✅ Completed
- **Task 2.1:** Real GitHub API Integration (pagination, error handling, rate limiting)
  - Files: `scripts/metrics/metrics-agent.js`, `scripts/metrics/__tests__/metrics-agent-integration.test.js`, `scripts/metrics/config/github-control-plane.json`
  
- **Task 2.2:** Historical Data Storage (time-series persistence, trend analysis, anomaly detection)
  - Files: `scripts/metrics/metrics-storage.js`, `scripts/metrics/trend-analyzer.js`, `scripts/metrics/anomaly-detector.js`
  - Tests: 30+ unit tests per module
  - Schema: `scripts/metrics/config/storage-schema.json`

### ⏳ Ready to Implement
- **Task 2.3:** GitHub Actions Workflow (2-3 days)
- **Task 2.4:** Reporting Agent Integration (3-4 days)
- **Task 2.5:** Quality & Testing (2-3 days)

---

## TASK 2.3: GITHUB ACTIONS WORKFLOW (2-3 Days)

**Objective:** Automate metrics collection and storage via scheduled GitHub Actions workflow

**Deliverables:**
1. `.github/workflows/metrics-collection.yml` — Scheduled workflow
   - Daily collection at 2 AM UTC (configurable)
   - Manual trigger with parameters
   - Parallel repository processing
   - Results commit with auto-push
   - Notifications on failure

2. `.github/scripts/workflows/metrics-collection-orchestrator.js` — Workflow orchestrator
   - Reads configuration from `scripts/metrics/config/*.json`
   - Instantiates GitHubAPIClient for each repository
   - Calls MetricsStorage to persist results
   - Handles errors and retries
   - Logs execution metrics

3. `scripts/metrics/workflows-config.json` — Workflow configuration
   - Collection schedule (cron expression)
   - Parallel job count
   - Timeout settings
   - Notification settings
   - Storage location

**Implementation Plan:**

**Step 1: Create workflow YAML**
```yaml
name: Metrics Collection Workflow
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:
    inputs:
      context:
        description: Repository context (github-control-plane, wordpress-plugin, wordpress-theme)
        required: false

jobs:
  collect-metrics:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        config: [github-control-plane]  # Can expand to multiple contexts
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Collect metrics
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node .github/scripts/workflows/metrics-collection-orchestrator.js --context ${{ matrix.config }}
      - name: Commit results
        run: |
          git config user.name "Metrics Bot"
          git config user.email "metrics@lightspeedwp.agency"
          git add .github/reports/metrics/
          git commit -m "chore: Update metrics collection (auto)" || true
          git push
```

**Step 2: Create orchestrator script**
- Load configuration
- Instantiate GitHubAPIClient with GITHUB_TOKEN
- Loop through repositories in config
- Call `saveMetrics()` for each repo
- Handle errors (log, notify, continue)
- Generate summary report

**Step 3: Create workflow configuration**
- Schedule cron (customizable)
- Parallel job settings
- Timeout configuration
- Notification preferences

**Tests:**
- Mock GitHub Actions environment variables
- Test orchestrator with test config
- Validate results commit format
- Error handling and retry logic

---

## TASK 2.4: REPORTING AGENT INTEGRATION (3-4 Days)

**Objective:** Generate markdown reports and GitHub issues from metrics data

**Deliverables:**

1. `scripts/metrics/metrics-reporter.js` — Markdown report generator
   - Latest metrics summary
   - Week-over-week and month-over-month trends
   - Anomalies and trend breaks
   - Charts/ASCII graphs (optional: use unicode box-drawing)
   - Top contributors, open issues, PR velocity
   - Health score calculation

2. `scripts/metrics/github-issue-creator.js` — GitHub issue generator
   - Create weekly/monthly metrics reports as GitHub issues
   - Assign appropriate labels (type:metrics, area:monitoring)
   - Link to related PRs/issues
   - Auto-close old metrics issues
   - Template-based issue body generation

3. `.github/scripts/workflows/metrics-reporting.yml` — Reporting workflow
   - Triggered on metrics collection success
   - Generates markdown report
   - Creates GitHub issue
   - Optionally posts to Slack/Discord
   - Stores report in `.github/reports/metrics/`

4. `scripts/metrics/__tests__/metrics-reporter.test.js` — Reporter tests
   - Report generation for various data states
   - Chart rendering
   - Trend calculation accuracy
   - Edge cases (empty data, single data point)

**Implementation Plan:**

**MetricsReporter class:**
```javascript
class MetricsReporter {
  constructor(storage, analyzer, detector) {
    this.storage = storage;
    this.analyzer = analyzer;
    this.detector = detector;
  }

  generateReport(repository) {
    // 1. Load latest metrics
    // 2. Calculate trends (weekly, monthly)
    // 3. Detect anomalies
    // 4. Generate markdown
    // 5. Include charts/graphs
    // 6. Return formatted report
  }

  generateCharts(metrics) {
    // ASCII charts for:
    // - Issues (total, closed, active)
    // - PRs (total, merged, review time)
    // - Contributors (active, new, returning)
    // - Health score trend
  }

  calculateHealthScore(metrics, trends, anomalies) {
    // Overall repository health (0-100)
    // Based on: closure rate, velocity, stability, contributor activity
  }
}
```

**GitHub Issue Creator:**
```javascript
class GitHubIssueCreator {
  constructor(octokit) {
    this.octokit = octokit;
  }

  createMetricsIssue(owner, repo, report, period = 'weekly') {
    // Create issue with:
    // - Title: "[Metrics] Weekly Report: 2026-08-18"
    // - Body: formatted markdown report
    // - Labels: type:metrics, area:monitoring
    // - Auto-assign to metrics team
  }

  closeOldReports(owner, repo, daysOld = 90) {
    // Find and close metrics issues older than 90 days
  }
}
```

**Report Format:**
```markdown
# Metrics Report: lightspeedwp/.github (2026-08-18)

## Summary
- **Health Score:** 85/100 ↑ (+5 from last week)
- **Period:** 2026-08-11 to 2026-08-18

## Issues
- Total: 42 | Closed: 35 (83%) | Active: 7
- Avg. time-to-fix: 3.2 days (↓ 0.5 days)
- New this week: 8

## Pull Requests
- Total: 28 | Merged: 26 (93%) | Active: 2
- Avg. review time: 4.1 hours (↓ 1.2 hours)
- CI pass rate: 98% ✓

## Contributors
- Active: 12 | New: 2 | Returning: 10
- Top contributor: @ashley (8 PRs)

## Anomalies
- ⚠️ Issue closure rate down 15% from baseline
- 🔍 PR review time increased 20%

## Trend Analysis
- **Weekly:** ↑ 8% more PRs merged
- **Monthly:** ↓ 5% fewer new issues
- **Prediction:** 45 issues expected next week
```

---

## TASK 2.5: QUALITY & TESTING (2-3 Days)

**Objective:** Achieve 95%+ test coverage and production readiness

**Deliverables:**

1. **Test Coverage Expansion:**
   - Target: 95%+ for all metrics modules
   - Current: ~86% (Task 2.1), 100% (Task 2.2 tests, may need real behavior validation)
   - Missing coverage areas:
     - Edge cases (empty data, single metric, null values)
     - Error recovery paths
     - Concurrent operations
     - File I/O errors

2. **Integration Tests:**
   - `scripts/metrics/__tests__/integration.test.js`
   - Full workflow: API call → storage → trend analysis → reporting
   - Real GitHub API (with test token, staging repo)
   - Data persistence across operations
   - End-to-end reporting

3. **Performance Benchmarks:**
   - Single repository collection: <30 seconds
   - Multi-repository (10): <5 minutes
   - Trend calculation: <100ms per repository
   - Anomaly detection: <50ms per repository
   - Report generation: <1 second

4. **Security Validation:**
   - Token handling (no logging, no disk exposure)
   - Input validation (metrics structure, file paths)
   - Output sanitization (report generation)
   - Rate limit handling
   - Error messages (no sensitive data leakage)

5. **Documentation:**
   - `scripts/metrics/README.md` — Usage guide
   - `scripts/metrics/ARCHITECTURE.md` — System design
   - `scripts/metrics/TROUBLESHOOTING.md` — Common issues

**Implementation Checklist:**

```javascript
describe("Metrics Agent Phase 2 — Full Integration", () => {
  test("end-to-end: collection → storage → analysis → reporting", async () => {
    // 1. Fetch real metrics from lightspeedwp/.github
    // 2. Store in time-series
    // 3. Calculate trends
    // 4. Detect anomalies
    // 5. Generate report
    // 6. Verify all components worked
  });

  test("handles concurrent repository processing", async () => {
    // Fetch metrics for 5 repos in parallel
    // Verify all complete without conflicts
  });

  test("performance: single repo <30s, 10 repos <5m", async () => {
    // Benchmark actual execution
  });

  test("security: no token exposure in logs/files", () => {
    // Verify token never appears in output
  });
});
```

---

## QUICK START FOR NEW SESSION

### 1. Create Feature Branch
```bash
git checkout -b feat/metrics-phase-2-workflows develop
```

### 2. Implement Tasks in Order
- **Task 2.3 first:** GitHub Actions workflow enables testing of Tasks 2.4 & 2.5
- **Task 2.4 second:** Reporting depends on workflow for data
- **Task 2.5 last:** Quality validation across all

### 3. Test Each Task
```bash
npm test -- scripts/metrics/__tests__/
npm test -- .github/scripts/workflows/__tests__/
```

### 4. Commit & PR Process
- Create one commit per task
- Link to Phase 2 spec in commit message
- PR to develop when all tests pass
- Auto-merge via Mergify when CI passes

---

## KEY FILES REFERENCE

**Existing (Completed):**
- `scripts/metrics/metrics-agent.js` — GitHub API client
- `scripts/metrics/metrics-storage.js` — Time-series storage
- `scripts/metrics/trend-analyzer.js` — Trend calculations
- `scripts/metrics/anomaly-detector.js` — Anomaly detection
- `scripts/metrics/config/github-control-plane.json` — Main config

**To Create (Tasks 2.3–2.5):**
- `.github/workflows/metrics-collection.yml` — Scheduled workflow
- `.github/scripts/workflows/metrics-collection-orchestrator.js` — Orchestrator
- `scripts/metrics/metrics-reporter.js` — Report generation
- `scripts/metrics/github-issue-creator.js` — Issue management
- `.github/workflows/metrics-reporting.yml` — Reporting workflow
- `scripts/metrics/__tests__/integration.test.js` — E2E tests
- Documentation files

---

## SUCCESS CRITERIA

- ✅ Task 2.3: Workflow runs daily, stores metrics to `.github/reports/metrics/`
- ✅ Task 2.4: Weekly metrics issues created automatically
- ✅ Task 2.5: 95%+ test coverage, <30s single-repo performance
- ✅ All CI checks passing
- ✅ Zero security warnings
- ✅ Documentation complete
- ✅ Phase 2 merged to develop

---

**Ready to start Task 2.3? Copy this prompt into a new chat session and continue!**
