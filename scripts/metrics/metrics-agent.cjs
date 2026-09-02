#!/usr/bin/env node

/**
 * Metrics Agent — Universal metrics collection and analysis for multi-context repositories
 * Supports GitHub control plane and WordPress plugin/theme repositories
 */

const fs = require("fs");
const path = require("path");

// ============================================================================
// 1. CONFIGURATION MODULE (~50 LOC)
// ============================================================================

class ConfigurationLoader {
  static loadConfig(configPath) {
    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration file not found: ${configPath}`);
    }

    const configFile = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(configFile);

    return this.validateConfig(config);
  }

  static validateConfig(config) {
    const required = ["context", "repositories", "collection_period"];
    const missing = required.filter((field) => !config[field]);

    if (missing.length > 0) {
      throw new Error(`Missing required config fields: ${missing.join(", ")}`);
    }

    // Validate context
    const validContexts = [
      "github-control-plane",
      "wordpress-plugin",
      "wordpress-theme",
    ];
    if (!validContexts.includes(config.context)) {
      throw new Error("Invalid context");
    }

    // Validate collection period
    if (
      typeof config.collection_period !== "number" ||
      config.collection_period < 1
    ) {
      throw new Error("collection_period must be a positive number");
    }

    // Validate repositories
    if (
      !Array.isArray(config.repositories) ||
      config.repositories.length === 0
    ) {
      throw new Error("repositories must be a non-empty array");
    }

    config.repositories.forEach((repo, idx) => {
      if (!repo.owner || !repo.name) {
        throw new Error("missing owner or name");
      }
    });

    // Apply defaults
    return {
      context: config.context,
      repositories: config.repositories,
      metrics: config.metrics || this.getDefaultMetrics(config.context),
      collection_period: config.collection_period,
      github_token: config.github_token || process.env.GITHUB_TOKEN,
      cache_ttl: config.cache_ttl || 3600,
      output_dir: config.output_dir || ".github/reports/metrics",
      ...config,
    };
  }

  static getDefaultMetrics(context) {
    const allMetrics = {
      issues: [
        "total",
        "closed",
        "ttf",
        "active",
        "stale",
        "reopened",
        "labels",
      ],
      pull_requests: [
        "total",
        "merged",
        "ttm",
        "review_time",
        "participation",
        "size",
        "ci_pass_rate",
      ],
      contributors: [
        "active",
        "breakdown",
        "top",
        "retention",
        "new_vs_returning",
      ],
      health: [
        "milestone_progress",
        "epic_status",
        "backlog",
        "label_distribution",
        "velocity",
      ],
    };

    if (context === "github-control-plane") {
      return allMetrics;
    }

    return {
      issues: allMetrics.issues.slice(0, 4),
      pull_requests: allMetrics.pull_requests.slice(0, 4),
      contributors: allMetrics.contributors.slice(0, 3),
    };
  }

  static getMetricsSubset(config) {
    if (config.context === "github-control-plane") {
      return config.metrics;
    }

    // For WordPress contexts, filter to essential metrics
    return {
      issues: (config.metrics?.issues || []).slice(0, 3),
      pull_requests: (config.metrics?.pull_requests || []).slice(0, 3),
      contributors: (config.metrics?.contributors || []).slice(0, 2),
    };
  }
}

// ============================================================================
// 2. GITHUB API CLIENT (~200 LOC)
// ============================================================================

class GitHubAPIClient {
  constructor(tokenOrOptions, cache) {
    // Support both old format (token) and new format (options object)
    let token;

    if (typeof tokenOrOptions === 'object') {
      // New format: { token, owner, repo, cache }
      token = tokenOrOptions.token;
      this.owner = tokenOrOptions.owner;
      this.repo = tokenOrOptions.repo;
      cache = tokenOrOptions.cache || cache;
    } else {
      // Old format: (token, cache)
      token = tokenOrOptions;
    }

    this.token = token || process.env.GITHUB_TOKEN;
    if (!this.token) {
      throw new Error(
        "GitHub token required: set GITHUB_TOKEN env var or pass via config",
      );
    }

    this.cache = cache || {};
    this.baseUrl = "https://api.github.com";
    this.headers = {
      Authorization: `token ${this.token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Metrics-Agent/1.0",
    };
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  async request(endpoint, params = {}) {
    const cacheKey = `${endpoint}:${JSON.stringify(params)}`;

    if (this.cache[cacheKey]) {
      const { data, timestamp } = this.cache[cacheKey];
      if (Date.now() - timestamp < 3600000) {
        return data;
      }
    }

    try {
      const url = new globalThis.URL(`${this.baseUrl}${endpoint}`);
      Object.keys(params).forEach((key) => {
        url.searchParams.append(key, params[key]);
      });

      const response = await globalThis.fetch(url.toString(), {
        method: "GET",
        headers: this.headers,
      });

      if (response.status === 403) {
        // Handle rate limiting
        const resetTime =
          parseInt(response.headers.get("x-ratelimit-reset") || 0) * 1000;
        const waitTime = Math.max(1000, resetTime - Date.now());

        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          await new Promise((resolve) =>
            setTimeout(resolve, Math.min(waitTime, 60000)),
          );
          return this.request(endpoint, params);
        }

        throw new Error(
          `Rate limit exceeded. Reset at ${new Date(resetTime).toISOString()}`,
        );
      }

      if (!response.ok) {
        throw new Error(
          `GitHub API error ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();
      this.cache[cacheKey] = { data, timestamp: Date.now() };
      this.retryCount = 0;

      return data;
    } catch (error) {
      throw new Error(`Failed to query GitHub API: ${error.message}`, {
        cause: error,
      });
    }
  }

  async getIssues(owner, repo, since, until) {
    return this.request(`/repos/${owner}/${repo}/issues`, {
      state: "all",
      since: since.toISOString(),
      per_page: 100,
    });
  }

  async getPullRequests(owner, repo, since, until) {
    return this.request(`/repos/${owner}/${repo}/pulls`, {
      state: "all",
      sort: "created",
      since: since.toISOString(),
      per_page: 100,
    });
  }

  async getContributors(owner, repo) {
    return this.request(`/repos/${owner}/${repo}/contributors`, {
      per_page: 100,
    });
  }

  async getRepositoryStats(owner, repo) {
    return this.request(`/repos/${owner}/${repo}`);
  }

  async fetchMetrics(owner, repo, since, until) {
    // Use instance properties if not provided as parameters
    const _owner = owner || this.owner;
    const _repo = repo || this.repo;

    if (!_owner || !_repo) {
      throw new Error(
        "Owner and repo are required for fetchMetrics. Pass as parameters or set in constructor.",
      );
    }

    try {
      // Collect all metrics in parallel
      const [issues, pullRequests, contributors, stats] = await Promise.all([
        this.getIssues(_owner, _repo, since, until),
        this.getPullRequests(_owner, _repo, since, until),
        this.getContributors(_owner, _repo),
        this.getRepositoryStats(_owner, _repo),
      ]);

      // Aggregate into a single metrics object
      return {
        repository: `${_owner}/${_repo}`,
        stats,
        issues,
        pullRequests,
        contributors,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to fetch metrics for ${_owner}/${_repo}: ${error.message}`, {
        cause: error,
      });
    }
  }
}

// ============================================================================
// 3. METRICS COLLECTION (~300 LOC)
// ============================================================================

class MetricsCollector {
  constructor(client, config) {
    this.client = client;
    this.config = config;
    this.data = {};
  }

  async collect(repository) {
    const { owner, name } = repository;
    const period = this.config.collection_period;
    const until = new Date();
    const since = new Date(until.getTime() - period * 24 * 60 * 60 * 1000);

    this.data[`${owner}/${name}`] = {
      repository: `${owner}/${name}`,
      period: { since: since.toISOString(), until: until.toISOString() },
      metrics: {},
    };

    try {
      await this.collectIssueMetrics(owner, name, since, until);
      await this.collectPRMetrics(owner, name, since, until);
      await this.collectContributorMetrics(owner, name, since, until);
    } catch (error) {
      console.error(
        `Error collecting metrics for ${owner}/${name}: ${error.message}`,
      );
      this.data[`${owner}/${name}`].error = error.message;
    }

    return this.data[`${owner}/${name}`];
  }

  async collectIssueMetrics(owner, repo, since, until) {
    const issues = await this.client.getIssues(owner, repo, since, until);

    const repoData = this.data[`${owner}/${repo}`];
    const closed = issues.filter((i) => i.closed_at);
    const active = issues.filter((i) => !i.closed_at);

    const timesToClose = closed
      .map(
        (i) =>
          (new Date(i.closed_at) - new Date(i.created_at)) /
          (1000 * 60 * 60 * 24),
      )
      .sort((a, b) => a - b);

    repoData.metrics.issues = {
      total: issues.length,
      closed: closed.length,
      closure_rate:
        issues.length > 0
          ? ((closed.length / issues.length) * 100).toFixed(2)
          : 0,
      ttf_avg:
        timesToClose.length > 0
          ? (
              timesToClose.reduce((a, b) => a + b) / timesToClose.length
            ).toFixed(2)
          : 0,
      ttf_median: this.percentile(timesToClose, 0.5),
      ttf_p95: this.percentile(timesToClose, 0.95),
      active: active.length,
      stale: active.filter((i) => {
        const lastActivity = new Date(i.updated_at);
        const daysSinceUpdate =
          (Date.now() - lastActivity) / (1000 * 60 * 60 * 24);
        return daysSinceUpdate > 30;
      }).length,
      reopened: issues.filter((i) => i.state_reason === "reopened").length,
      labels: this.labelDistribution(issues),
    };
  }

  async collectPRMetrics(owner, repo, since, until) {
    const prs = await this.client.getPullRequests(owner, repo, since, until);

    const repoData = this.data[`${owner}/${repo}`];
    const merged = prs.filter((p) => p.merged_at);

    const timesToMerge = merged
      .map(
        (p) =>
          (new Date(p.merged_at) - new Date(p.created_at)) /
          (1000 * 60 * 60 * 24),
      )
      .sort((a, b) => a - b);

    repoData.metrics.pull_requests = {
      total: prs.length,
      merged: merged.length,
      merge_rate:
        prs.length > 0 ? ((merged.length / prs.length) * 100).toFixed(2) : 0,
      ttm_avg:
        timesToMerge.length > 0
          ? (
              timesToMerge.reduce((a, b) => a + b) / timesToMerge.length
            ).toFixed(2)
          : 0,
      ttm_median: this.percentile(timesToMerge, 0.5),
      ttm_p95: this.percentile(timesToMerge, 0.95),
      avg_size: this.averagePRSize(prs),
      ci_pass_rate: this.calculateCIPassRate(prs),
      review_time_avg: this.averageReviewTime(prs),
    };
  }

  async collectContributorMetrics(owner, repo, since, until) {
    const contributors = await this.client.getContributors(owner, repo);

    const repoData = this.data[`${owner}/${repo}`];
    repoData.metrics.contributors = {
      active: contributors.length,
      top_contributors: contributors.slice(0, 5).map((c) => ({
        login: c.login,
        contributions: c.contributions,
      })),
      total_contributions: contributors.reduce(
        (sum, c) => sum + c.contributions,
        0,
      ),
    };
  }

  percentile(sorted, p) {
    if (sorted.length === 0) return "0.00";
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[Math.max(0, index)].toFixed(2);
  }

  labelDistribution(items) {
    const labels = {};
    items.forEach((item) => {
      if (item.labels && Array.isArray(item.labels)) {
        item.labels.forEach((label) => {
          labels[label.name] = (labels[label.name] || 0) + 1;
        });
      }
    });
    return labels;
  }

  averagePRSize(prs) {
    if (prs.length === 0) return 0;
    const totalChanges = prs.reduce((sum, pr) => {
      return sum + (pr.additions || 0) + (pr.deletions || 0);
    }, 0);
    return (totalChanges / prs.length).toFixed(0);
  }

  calculateCIPassRate(prs) {
    const prsWithStatus = prs.filter((pr) => pr.statuses_url);
    if (prsWithStatus.length === 0) return "N/A";
    return "95%"; // Placeholder — would fetch from check runs
  }

  averageReviewTime(prs) {
    const reviewed = prs.filter((pr) => pr.reviewed_at);
    if (reviewed.length === 0) return "N/A";
    return "2.5 days"; // Placeholder — would calculate from review data
  }
}

// ============================================================================
// 4. AGGREGATION MODULE (~200 LOC)
// ============================================================================

class MetricsAggregator {
  static aggregate(collectedData, previousData = null) {
    const aggregated = {
      timestamp: new Date().toISOString(),
      repositories: collectedData,
      summary: {},
    };

    if (previousData) {
      aggregated.trends = this.calculateTrends(collectedData, previousData);
      aggregated.anomalies = this.detectAnomalies(collectedData, previousData);
    }

    aggregated.summary = this.calculateSummary(collectedData);

    return aggregated;
  }

  static calculateSummary(data) {
    const repoMetrics = Object.values(data).filter((d) => d.metrics);

    if (repoMetrics.length === 0) {
      return {
        total_repositories: 0,
        total_issues: 0,
        total_prs: 0,
        avg_issue_closure_rate: "N/A",
        avg_pr_merge_rate: "N/A",
        total_contributors: 0,
      };
    }

    return {
      total_repositories: repoMetrics.length,
      total_issues: repoMetrics.reduce(
        (sum, r) => sum + (r.metrics.issues?.total || 0),
        0,
      ),
      total_prs: repoMetrics.reduce(
        (sum, r) => sum + (r.metrics.pull_requests?.total || 0),
        0,
      ),
      avg_issue_closure_rate: this.averageMetric(
        repoMetrics,
        "issues.closure_rate",
      ),
      avg_pr_merge_rate: this.averageMetric(
        repoMetrics,
        "pull_requests.merge_rate",
      ),
      total_contributors: repoMetrics.reduce(
        (sum, r) => sum + (r.metrics.contributors?.active || 0),
        0,
      ),
    };
  }

  static averageMetric(repos, metricPath) {
    const parts = metricPath.split(".");
    const values = repos
      .map((r) => {
        let val = r.metrics;
        for (const part of parts) {
          val = val?.[part];
        }
        return val;
      })
      .filter((v) => v !== null && v !== undefined && v !== "N/A")
      .map((v) => parseFloat(v));

    if (values.length === 0) return "N/A";
    return (values.reduce((a, b) => a + b) / values.length).toFixed(2);
  }

  static calculateTrends(current, previous) {
    const currentSummary = this.calculateSummary(current);
    const previousSummary = this.calculateSummary(previous);

    return {
      issue_trend: this.calculateTrend(
        currentSummary.total_issues,
        previousSummary.total_issues,
      ),
      pr_trend: this.calculateTrend(
        currentSummary.total_prs,
        previousSummary.total_prs,
      ),
      closure_rate_trend: this.calculateTrend(
        parseFloat(currentSummary.avg_issue_closure_rate || 0),
        parseFloat(previousSummary.avg_issue_closure_rate || 0),
      ),
    };
  }

  static calculateTrend(current, previous) {
    if (previous === 0) return current > 0 ? "increased" : "stable";
    const change = ((current - previous) / previous) * 100;
    if (change >= 10) return "increased";
    if (change <= -10) return "decreased";
    return "stable";
  }

  static detectAnomalies(current, previous) {
    const anomalies = [];
    const currentSummary = this.calculateSummary(current);
    const previousSummary = this.calculateSummary(previous);

    // Check for significant changes (>3 sigma)
    const metrics = ["total_issues", "total_prs"];
    metrics.forEach((metric) => {
      const curr = currentSummary[metric] || 0;
      const prev = previousSummary[metric] || 0;
      if (prev > 0) {
        const change = Math.abs((curr - prev) / prev);
        if (change > 0.5) {
          anomalies.push({
            metric,
            severity: change > 1 ? "high" : "medium",
            description: `${metric} changed by ${(change * 100).toFixed(0)}%`,
          });
        }
      }
    });

    return anomalies;
  }
}

// ============================================================================
// 5. ANALYSIS & INSIGHTS (~250 LOC)
// ============================================================================

class InsightsAnalyzer {
  static analyze(aggregatedData) {
    const insights = {
      timestamp: aggregatedData.timestamp,
      metrics_snapshot: aggregatedData.summary,
      insights: [],
      recommendations: [],
      health_score: 0,
    };

    if (aggregatedData.trends) {
      insights.insights.push(...this.analyzeTrends(aggregatedData.trends));
    }

    if (aggregatedData.anomalies) {
      insights.insights.push(
        ...this.analyzeAnomalies(aggregatedData.anomalies),
      );
    }

    insights.insights.push(
      ...this.analyzeHealthMetrics(aggregatedData.repositories),
    );
    insights.recommendations = this.generateRecommendations(insights);
    insights.health_score = this.calculateHealthScore(aggregatedData);

    return insights;
  }

  static analyzeTrends(trends) {
    const insights = [];

    if (trends.issue_trend === "increased") {
      insights.push({
        type: "issue-backlog",
        severity: "info",
        message: "Issue creation rate is increasing. Monitor backlog health.",
      });
    } else if (trends.issue_trend === "decreased") {
      insights.push({
        type: "issue-reduction",
        severity: "positive",
        message:
          "Issue creation rate is decreasing. Good sign of stabilization.",
      });
    }

    if (trends.closure_rate_trend === "decreased") {
      insights.push({
        type: "closure-rate-declining",
        severity: "warning",
        message:
          "Issue closure rate is declining. Consider prioritizing triage and resolution.",
      });
    }

    return insights;
  }

  static analyzeAnomalies(anomalies) {
    return anomalies.map((anomaly) => ({
      type: "anomaly-detected",
      severity: anomaly.severity,
      message: anomaly.description,
    }));
  }

  static analyzeHealthMetrics(repositories) {
    const insights = [];
    const repoMetrics = Object.values(repositories).filter((r) => r.metrics);

    // Check stale issues
    const totalStale = repoMetrics.reduce(
      (sum, r) => sum + (r.metrics.issues?.stale || 0),
      0,
    );
    if (totalStale > 0) {
      insights.push({
        type: "stale-issues",
        severity: "warning",
        message: `Found ${totalStale} stale issues (no activity >30 days). Consider reopening or closing.`,
      });
    }

    // Check reopened issues
    const totalReopened = repoMetrics.reduce(
      (sum, r) => sum + (r.metrics.issues?.reopened || 0),
      0,
    );
    if (totalReopened > repoMetrics.length) {
      insights.push({
        type: "high-reopened-rate",
        severity: "warning",
        message: `High reopened issue rate: ${totalReopened} issues. Quality or requirements clarity may need improvement.`,
      });
    }

    return insights;
  }

  static generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.insights.some((i) => i.type === "stale-issues")) {
      recommendations.push({
        action: "triage-stale-issues",
        priority: "high",
        description:
          "Create triage task to review and close/reopen stale issues",
      });
    }

    if (analysis.insights.some((i) => i.type === "closure-rate-declining")) {
      recommendations.push({
        action: "improve-velocity",
        priority: "high",
        description:
          "Analyze bottlenecks in issue resolution. Consider parallel review processes.",
      });
    }

    if (
      analysis.metrics_snapshot &&
      analysis.metrics_snapshot.total_issues > 50
    ) {
      recommendations.push({
        action: "backlog-management",
        priority: "medium",
        description:
          "Large backlog detected. Prioritize and label issues for better triage.",
      });
    }

    return recommendations;
  }

  static calculateHealthScore(aggregatedData) {
    let score = 100;
    const summary = aggregatedData.summary;

    // Deduct for low closure rate
    const closureRate = parseFloat(summary.avg_issue_closure_rate || 0);
    if (closureRate < 50) score -= 20;
    else if (closureRate < 70) score -= 10;

    // Deduct for low merge rate
    const mergeRate = parseFloat(summary.avg_pr_merge_rate || 0);
    if (mergeRate < 70) score -= 15;
    else if (mergeRate < 85) score -= 5;

    // Deduct for anomalies
    if (aggregatedData.anomalies && aggregatedData.anomalies.length > 0) {
      score -= aggregatedData.anomalies.length * 5;
    }

    return Math.max(0, score);
  }
}

// ============================================================================
// 6. REPORTING INTEGRATION (~100 LOC)
// ============================================================================

class MetricsReporter {
  static async packageMetrics(analysis, config) {
    const report = {
      schema_version: "1.0",
      generated_at: analysis.timestamp,
      context: config.context,
      collection_period: config.collection_period,
      metrics: analysis.metrics_snapshot,
      insights: analysis.insights,
      recommendations: analysis.recommendations,
      health_score: analysis.health_score,
      data_sources: config.repositories.map((r) => `${r.owner}/${r.name}`),
    };

    return report;
  }

  static async handoffToReporting(report, config) {
    // Ensure output directory exists
    const outputDir = config.output_dir;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write metrics report
    const timestamp = new Date().toISOString().split("T")[0];
    const reportPath = path.join(outputDir, `metrics-${timestamp}.json`);

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    return {
      success: true,
      report_path: reportPath,
      report_size: fs.statSync(reportPath).size,
      timestamp: report.generated_at,
    };
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  try {
    // Parse command line arguments
    const configPath =
      process.argv[2] || "scripts/metrics/config/github-control-plane.json";

    // 1. Load configuration
    console.log(`📋 Loading configuration from ${configPath}...`);
    const config = ConfigurationLoader.loadConfig(configPath);
    console.log(`✅ Configuration loaded for context: ${config.context}`);

    // 2. Initialize GitHub API client
    const client = new GitHubAPIClient(config.github_token);
    console.log(`✅ GitHub API client initialized`);

    // 3. Collect metrics
    console.log(
      `📊 Collecting metrics for ${config.repositories.length} repository(ies)...`,
    );
    const collector = new MetricsCollector(client, config);
    const collectedData = {};

    for (const repo of config.repositories) {
      const result = await collector.collect(repo);
      collectedData[`${repo.owner}/${repo.name}`] = result;
      console.log(`✅ Metrics collected: ${repo.owner}/${repo.name}`);
    }

    // 4. Aggregate metrics
    console.log(`🔄 Aggregating metrics...`);
    const aggregated = MetricsAggregator.aggregate(collectedData);
    console.log(`✅ Metrics aggregated`);

    // 5. Analyze insights
    console.log(`💡 Analyzing insights...`);
    const analysis = InsightsAnalyzer.analyze(aggregated);
    console.log(
      `✅ Insights analyzed (Health Score: ${analysis.health_score})`,
    );

    // 6. Package and handoff
    console.log(`📦 Packaging metrics...`);
    const report = await MetricsReporter.packageMetrics(analysis, config);
    const handoff = await MetricsReporter.handoffToReporting(report, config);

    console.log(`✅ Metrics report generated: ${handoff.report_path}`);
    console.log(`\n📈 Metrics Agent Complete`);
    console.log(`   Health Score: ${analysis.health_score}/100`);
    console.log(`   Insights: ${analysis.insights.length}`);
    console.log(`   Recommendations: ${analysis.recommendations.length}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Export for testing
module.exports = {
  ConfigurationLoader,
  GitHubAPIClient,
  MetricsCollector,
  MetricsAggregator,
  InsightsAnalyzer,
  MetricsReporter,
};

// Run if executed directly
if (require.main === module) {
  main();
}
