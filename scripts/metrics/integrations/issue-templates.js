/**
 * Issue Templates Generator - Creates GitHub issues from metrics
 *
 * Automatically generates actionable GitHub issues based on metric anomalies.
 * Issues are templated with clear problem statements, impact analysis,
 * and recommended actions.
 */

class IssueTemplateGenerator {
  constructor(options = {}) {
    this.org = options.org || 'lightspeedwp';
    this.repo = options.repo || '.github';
    this.thresholds = options.thresholds || this.getDefaultThresholds();
  }

  /**
   * Get default anomaly thresholds
   * @returns {Object} Threshold configuration
   */
  getDefaultThresholds() {
    return {
      staleIssues: { absolute: 5, percentChange: 30 },
      reviewTime: { absolute: 2.0, percentChange: 20 },
      ciPassRate: { absolute: 0.90, percentChange: 5 },
      testCoverage: { absolute: 0.80, percentChange: 5 },
      healthScore: { absolute: 70, percentChange: 10 }
    };
  }

  /**
   * Check if issue should be created based on metric
   * @param {Object} metric - Metric data
   * @returns {boolean} Whether issue should be created
   */
  shouldCreateIssue(metric) {
    const thresholdConfig = this.thresholds[metric.name];
    if (!thresholdConfig) return false;

    const meetsAbsoluteThreshold = metric.current >= thresholdConfig.absolute;
    const meetsPercentChange = Math.abs(metric.percentChange) >= thresholdConfig.percentChange;

    return meetsAbsoluteThreshold || meetsPercentChange;
  }

  /**
   * Generate stale issues alert template
   * @param {Object} metrics - Raw metrics
   * @returns {Object|null} Issue object or null if shouldn't create
   */
  generateStaleIssuesAlert(metrics) {
    if (!metrics.repositories || !metrics.repositories[0]) return null;

    const repo = metrics.repositories[0];
    const issueMetrics = repo.metrics?.issues || {};
    const staleCount = issueMetrics.staleIssues || 0;

    const metric = {
      name: 'staleIssues',
      current: staleCount,
      percentChange: ((staleCount - 5) / 5) * 100 // Assuming 5 was baseline
    };

    if (!this.shouldCreateIssue(metric)) return null;

    return {
      title: '🚨 Metrics Alert: Stale Issues Accumulating',
      body: `## Metric Alert: Stale Issue Accumulation

**Metric:** Stale Issues (>30 days)
**Current:** ${staleCount} issues
**Baseline:** 5 issues
**Change:** +${staleCount - 5} (+${metric.percentChange.toFixed(0)}%)
**Severity:** HIGH

### Issue
We have ${staleCount} issues that haven't been reviewed in over 30 days. This indicates potential response time challenges and can lead to loss of context or outdated information.

### Impact
- Reduced visibility into important issues
- Potential loss of context
- Possible duplicate work
- Team morale impact

### Root Cause Analysis
- [ ] Team capacity reduced?
- [ ] Issue intake increased?
- [ ] Review process changed?
- [ ] Prioritization unclear?

### Recommended Actions
1. **Review Stale Issues** (this week)
   - [ ] Audit the ${staleCount} stale issues
   - [ ] Close duplicates or out-of-date issues
   - [ ] Prioritize and assign high-value issues
   - [ ] Add labels (status:backlog, priority:*, etc.)

2. **Improve Response SLA** (next week)
   - [ ] Establish response time SLA (target: 5 days first response)
   - [ ] Schedule team sync on priorities
   - [ ] Implement automated stale issue workflow

3. **Capacity Planning** (next sprint)
   - [ ] Assess team capacity vs. issue volume
   - [ ] Identify bottlenecks
   - [ ] Plan hiring or process improvements

### Related Report
[Weekly Metrics Summary](https://github.com/${this.org}/${this.repo}/blob/develop/.github/reports/metrics/weekly-summary-latest.md)`,
      labels: ['type:task', 'priority:important', 'area:analytics']
    };
  }

  /**
   * Generate PR review time degradation alert
   * @param {Object} metrics - Raw metrics
   * @returns {Object|null} Issue object or null if shouldn't create
   */
  generatePRReviewDegradation(metrics) {
    if (!metrics.repositories || !metrics.repositories[0]) return null;

    const repo = metrics.repositories[0];
    const prMetrics = repo.metrics?.pullRequests || {};
    const reviewTime = prMetrics.averageReviewTime || 0;

    const metric = {
      name: 'reviewTime',
      current: reviewTime,
      percentChange: ((reviewTime - 1.2) / 1.2) * 100 // Assuming 1.2 was baseline
    };

    if (!this.shouldCreateIssue(metric)) return null;

    return {
      title: '⏱️ Metrics Alert: PR Review Time Increasing',
      body: `## Metric Alert: PR Review Time Degradation

**Metric:** Average PR Review Time
**Current:** ${reviewTime.toFixed(1)} days
**Target:** 1.2 days
**Change:** +${(reviewTime - 1.2).toFixed(1)} days (+${metric.percentChange.toFixed(0)}%)
**Severity:** MODERATE

### Issue
Pull request review time has increased by ${metric.percentChange.toFixed(0)}%. This slows down development velocity and can impact team morale.

### Impact
- Slower feature delivery
- Increased PR merge time
- Potential for stale PRs
- Developer frustration

### Root Cause Analysis
- [ ] Reviewer availability reduced?
- [ ] PR complexity increased?
- [ ] Review queue built up?
- [ ] Process bottleneck?

### Recommended Actions
1. **Quick Win: Establish Review SLA** (this week)
   - [ ] Target: 24-hour first response on all PRs
   - [ ] Establish review rotation
   - [ ] Use GitHub auto-assignment

2. **Improve Review Efficiency** (next 2 weeks)
   - [ ] Implement smaller PR requirements
   - [ ] Use draft PRs for early feedback
   - [ ] Create code review guidelines
   - [ ] Schedule daily review sync (15 min)

3. **Capacity Assessment** (next sprint)
   - [ ] Review reviewer workload
   - [ ] Identify bottleneck reviewers
   - [ ] Plan knowledge transfer

### Related Report
[Weekly Metrics Summary](https://github.com/${this.org}/${this.repo}/blob/develop/.github/reports/metrics/weekly-summary-latest.md)`,
      labels: ['type:task', 'priority:important', 'area:analytics']
    };
  }

  /**
   * Generate health score alert
   * @param {Object} metrics - Raw metrics
   * @returns {Object|null} Issue object or null if shouldn't create
   */
  generateHealthAlert(metrics) {
    const healthScore = metrics.healthScore?.overall ?? 100;

    if (healthScore > 70) return null; // Only alert if below 70

    return {
      title: '⚠️ Metrics Alert: Repository Health Below Target',
      body: `## Metric Alert: Repository Health Score Low

**Metric:** Overall Health Score
**Current:** ${healthScore}
**Target:** 80
**Gap:** -${(80 - healthScore)} points
**Severity:** ${healthScore < 60 ? 'CRITICAL' : 'HIGH'}

### Issue
Repository health score has dropped to ${healthScore}. This indicates systemic issues across multiple metrics.

### Health Breakdown
${this.formatHealthBreakdown(metrics.healthScore?.components || {})}

### Impact
- Increased technical debt
- Quality concerns
- Team productivity impact
- Release readiness questions

### Recommended Actions
1. **Immediate (this week)**
   - [ ] Review all components scoring < 70
   - [ ] Identify top 3 improvements needed
   - [ ] Create action plan

2. **Short-term (next 2 weeks)**
   - [ ] Address high-impact items
   - [ ] Improve test coverage
   - [ ] Reduce stale issues

3. **Long-term (next sprint)**
   - [ ] Implement systematic improvements
   - [ ] Establish health score SLA
   - [ ] Regular monitoring

### Related Report
[Weekly Metrics Summary](https://github.com/${this.org}/${this.repo}/blob/develop/.github/reports/metrics/weekly-summary-latest.md)

`,
      labels: ['type:task', 'priority:critical', 'area:analytics']
    };
  }

  /**
   * Generate team capacity alert
   * @param {Object} metrics - Raw metrics
   * @returns {Object|null} Issue object or null if shouldn't create
   */
  generateTeamCapacityAlert(metrics) {
    if (!metrics.repositories || !metrics.repositories[0]) return null;

    const repo = metrics.repositories[0];
    const contributors = repo.metrics?.contributors?.active || 0;

    // Only alert if capacity low (< 8 contributors typically means low capacity)
    if (contributors >= 10) return null;

    return {
      title: '👥 Metrics Alert: Team Capacity Low',
      body: `## Metric Alert: Team Capacity Below Target

**Metric:** Active Contributors
**Current:** ${contributors} engineers
**Target:** 12+ engineers
**Gap:** -${(12 - contributors)} engineers
**Severity:** MODERATE

### Issue
Active contributor count is lower than optimal. This may indicate capacity constraints or reduced team size.

### Impact
- Limited code review capacity
- Longer issue resolution times
- Risk of key person dependencies
- Potential for knowledge gaps

### Recommended Actions
1. **Immediate Assessment** (this week)
   - [ ] Review contributor changes
   - [ ] Identify any recent departures
   - [ ] Assess workload distribution

2. **Capacity Planning** (next 2 weeks)
   - [ ] Review hiring plans
   - [ ] Identify cross-training needs
   - [ ] Plan knowledge transfer sessions

3. **Interim Measures** (this sprint)
   - [ ] Prioritize critical work
   - [ ] Focus on high-value features
   - [ ] Consider external support if needed

### Related Report
[Weekly Metrics Summary](https://github.com/${this.org}/${this.repo}/blob/develop/.github/reports/metrics/weekly-summary-latest.md)

`,
      labels: ['type:task', 'priority:important', 'area:analytics']
    };
  }

  /**
   * Generate all applicable issues from metrics
   * @param {Object} metrics - Raw metrics
   * @returns {Array} Array of issue objects
   */
  generateAllIssues(metrics) {
    const issues = [];

    const generators = [
      this.generateStaleIssuesAlert.bind(this),
      this.generatePRReviewDegradation.bind(this),
      this.generateHealthAlert.bind(this),
      this.generateTeamCapacityAlert.bind(this)
    ];

    generators.forEach((generator) => {
      const issue = generator(metrics);
      if (issue) {
        issues.push(issue);
      }
    });

    return issues;
  }

  /**
   * Format health breakdown as markdown table
   * @param {Object} components - Health components
   * @returns {string} Markdown table
   */
  formatHealthBreakdown(components) {
    let table = '| Component | Score | Status |\n|-----------|-------|--------|\n';

    Object.entries(components).forEach(([key, score]) => {
      const status = score >= 80 ? '✅ Healthy' : score >= 70 ? '⚠️ At Risk' : '❌ Below Target';
      table += `| ${key} | ${score} | ${status} |\n`;
    });

    return table;
  }
}

module.exports = IssueTemplateGenerator;
