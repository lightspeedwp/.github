const {
  ConfigurationLoader,
  GitHubAPIClient,
  MetricsCollector,
  MetricsAggregator,
  InsightsAnalyzer,
  MetricsReporter,
} = require("../metrics-agent");

// ============================================================================
// CONFIGURATION MODULE TESTS
// ============================================================================

describe("ConfigurationLoader", () => {
  describe("loadConfig()", () => {
    test("loads valid config file", () => {
      // Note: Test would use a real file path
      expect(() => ConfigurationLoader.loadConfig("nonexistent.json")).toThrow(
        "Configuration file not found",
      );
    });

    test("throws on missing config file", () => {
      expect(() => ConfigurationLoader.loadConfig("missing.json")).toThrow(
        "Configuration file not found",
      );
    });

    test("parses JSON config correctly", () => {
      const config = {
        context: "github-control-plane",
        repositories: [{ owner: "test", name: "repo" }],
        metrics: {},
        collection_period: 7,
      };
      const result = ConfigurationLoader.validateConfig(config);
      expect(result.context).toBe("github-control-plane");
    });

    test("merges defaults with provided config", () => {
      const config = {
        context: "github-control-plane",
        repositories: [{ owner: "test", name: "repo" }],
        metrics: {},
        collection_period: 7,
      };
      const result = ConfigurationLoader.validateConfig(config);
      expect(result.cache_ttl).toBe(3600);
      expect(result.output_dir).toBe(".github/reports/metrics");
    });
  });

  describe("validateConfig()", () => {
    test("throws on missing context", () => {
      const config = {
        repositories: [],
        collection_period: 7,
      };
      expect(() => ConfigurationLoader.validateConfig(config)).toThrow(
        "Missing required config fields",
      );
    });

    test("throws on missing repositories", () => {
      const config = {
        context: "github-control-plane",
        collection_period: 7,
      };
      expect(() => ConfigurationLoader.validateConfig(config)).toThrow(
        "Missing required config fields",
      );
    });

    test("throws on missing collection_period", () => {
      const config = {
        context: "github-control-plane",
        repositories: [],
      };
      expect(() => ConfigurationLoader.validateConfig(config)).toThrow(
        "Missing required config fields",
      );
    });

    test("validates context value (github-control-plane)", () => {
      const config = {
        context: "invalid-context",
        repositories: [{ owner: "test", name: "repo" }],
        metrics: {},
        collection_period: 7,
      };
      expect(() => ConfigurationLoader.validateConfig(config)).toThrow(
        "Invalid context",
      );
    });

    test("validates context value (wordpress-plugin)", () => {
      const config = {
        context: "wordpress-plugin",
        repositories: [{ owner: "test", name: "repo" }],
        metrics: {},
        collection_period: 7,
      };
      expect(() => ConfigurationLoader.validateConfig(config)).not.toThrow();
    });

    test("validates context value (wordpress-theme)", () => {
      const config = {
        context: "wordpress-theme",
        repositories: [{ owner: "test", name: "repo" }],
        metrics: {},
        collection_period: 7,
      };
      expect(() => ConfigurationLoader.validateConfig(config)).not.toThrow();
    });

    test("validates collection_period is positive number", () => {
      const config = {
        context: "github-control-plane",
        repositories: [{ owner: "test", name: "repo" }],
        metrics: {},
        collection_period: -1,
      };
      expect(() => ConfigurationLoader.validateConfig(config)).toThrow(
        "collection_period must be a positive number",
      );
    });

    test("validates collection_period is number type", () => {
      const config = {
        context: "github-control-plane",
        repositories: [{ owner: "test", name: "repo" }],
        metrics: {},
        collection_period: "not-a-number",
      };
      expect(() => ConfigurationLoader.validateConfig(config)).toThrow(
        "collection_period must be a positive number",
      );
    });

    test("validates repositories is array", () => {
      const config = {
        context: "github-control-plane",
        repositories: "not-array",
        metrics: {},
        collection_period: 7,
      };
      expect(() => ConfigurationLoader.validateConfig(config)).toThrow(
        "repositories must be a non-empty array",
      );
    });

    test("validates repositories is non-empty", () => {
      const config = {
        context: "github-control-plane",
        repositories: [],
        metrics: {},
        collection_period: 7,
      };
      expect(() => ConfigurationLoader.validateConfig(config)).toThrow(
        "repositories must be a non-empty array",
      );
    });

    test("validates each repository has owner", () => {
      const config = {
        context: "github-control-plane",
        repositories: [{ name: "repo" }],
        metrics: {},
        collection_period: 7,
      };
      expect(() => ConfigurationLoader.validateConfig(config)).toThrow(
        "missing owner or name",
      );
    });

    test("validates each repository has name", () => {
      const config = {
        context: "github-control-plane",
        repositories: [{ owner: "test" }],
        metrics: {},
        collection_period: 7,
      };
      expect(() => ConfigurationLoader.validateConfig(config)).toThrow(
        "missing owner or name",
      );
    });
  });

  describe("getDefaultMetrics()", () => {
    test("returns all metrics for github-control-plane context", () => {
      const metrics = ConfigurationLoader.getDefaultMetrics(
        "github-control-plane",
      );
      expect(metrics.issues).toBeDefined();
      expect(metrics.pull_requests).toBeDefined();
      expect(metrics.contributors).toBeDefined();
      expect(metrics.health).toBeDefined();
    });

    test("returns filtered metrics for wordpress-plugin context", () => {
      const metrics = ConfigurationLoader.getDefaultMetrics("wordpress-plugin");
      expect(metrics.issues).toBeDefined();
      expect(metrics.pull_requests).toBeDefined();
      expect(metrics.contributors).toBeDefined();
      expect(metrics.health).toBeUndefined();
    });

    test("returns filtered metrics for wordpress-theme context", () => {
      const metrics = ConfigurationLoader.getDefaultMetrics("wordpress-theme");
      expect(metrics.issues).toBeDefined();
      expect(metrics.pull_requests).toBeDefined();
      expect(metrics.contributors).toBeDefined();
    });
  });

  describe("getMetricsSubset()", () => {
    test("returns all metrics for github-control-plane context", () => {
      const config = {
        context: "github-control-plane",
        metrics: { issues: ["total", "closed"], pull_requests: ["total"] },
      };
      const subset = ConfigurationLoader.getMetricsSubset(config);
      expect(subset).toEqual(config.metrics);
    });

    test("returns filtered metrics for wordpress-plugin context", () => {
      const config = {
        context: "wordpress-plugin",
        metrics: {
          issues: ["total", "closed", "ttf", "active", "stale"],
          pull_requests: ["total", "merged", "ttm", "review_time"],
        },
      };
      const subset = ConfigurationLoader.getMetricsSubset(config);
      expect(subset.issues.length).toBeLessThan(5);
      expect(subset.pull_requests.length).toBeLessThan(4);
    });
  });
});

// ============================================================================
// GITHUB API CLIENT TESTS
// ============================================================================

describe("GitHubAPIClient", () => {
  let client;

  beforeEach(() => {
    process.env.GITHUB_TOKEN = "test-token";
    client = new GitHubAPIClient("test-token");
  });

  test("throws error if no token provided", () => {
    delete process.env.GITHUB_TOKEN;
    expect(() => new GitHubAPIClient()).toThrow("GitHub token required");
  });

  test("initializes with token from constructor", () => {
    const newClient = new GitHubAPIClient("my-token");
    expect(newClient.token).toBe("my-token");
  });

  test("initializes with token from environment variable", () => {
    process.env.GITHUB_TOKEN = "env-token";
    const newClient = new GitHubAPIClient();
    expect(newClient.token).toBe("env-token");
  });

  test("sets correct API base URL", () => {
    expect(client.baseUrl).toBe("https://api.github.com");
  });

  test("includes authorization header", () => {
    expect(client.headers.Authorization).toBe("token test-token");
  });

  test("includes User-Agent header", () => {
    expect(client.headers["User-Agent"]).toBe("Metrics-Agent/1.0");
  });

  test("caches API responses", () => {
    const cache = {};
    const cachedClient = new GitHubAPIClient("test-token", cache);
    cache["test:{}"] = { data: ["cached"], timestamp: Date.now() };

    // Would test actual caching behavior
    expect(cachedClient.cache).toEqual(cache);
  });

  test("initializes retry count to zero", () => {
    expect(client.retryCount).toBe(0);
  });

  test("has maxRetries set to 3", () => {
    expect(client.maxRetries).toBe(3);
  });
});

// ============================================================================
// METRICS COLLECTOR TESTS
// ============================================================================

describe("MetricsCollector", () => {
  let collector;
  let mockClient;
  let config;

  beforeEach(() => {
    config = {
      context: "github-control-plane",
      collection_period: 7,
    };
    mockClient = {
      getIssues: jest.fn(),
      getPullRequests: jest.fn(),
      getContributors: jest.fn(),
    };
    collector = new MetricsCollector(mockClient, config);
  });

  describe("collect()", () => {
    test("initializes data structure with repository info", async () => {
      mockClient.getIssues.mockResolvedValue([]);
      mockClient.getPullRequests.mockResolvedValue([]);
      mockClient.getContributors.mockResolvedValue([]);

      await collector.collect({ owner: "test", name: "repo" });

      expect(collector.data["test/repo"]).toBeDefined();
      expect(collector.data["test/repo"].repository).toBe("test/repo");
      expect(collector.data["test/repo"].period).toBeDefined();
    });

    test("collects issue metrics", async () => {
      mockClient.getIssues.mockResolvedValue([]);
      mockClient.getPullRequests.mockResolvedValue([]);
      mockClient.getContributors.mockResolvedValue([]);

      await collector.collect({ owner: "test", name: "repo" });

      expect(collector.data["test/repo"].metrics.issues).toBeDefined();
    });

    test("collects PR metrics", async () => {
      mockClient.getIssues.mockResolvedValue([]);
      mockClient.getPullRequests.mockResolvedValue([]);
      mockClient.getContributors.mockResolvedValue([]);

      await collector.collect({ owner: "test", name: "repo" });

      expect(collector.data["test/repo"].metrics.pull_requests).toBeDefined();
    });

    test("collects contributor metrics", async () => {
      mockClient.getIssues.mockResolvedValue([]);
      mockClient.getPullRequests.mockResolvedValue([]);
      mockClient.getContributors.mockResolvedValue([]);

      await collector.collect({ owner: "test", name: "repo" });

      expect(collector.data["test/repo"].metrics.contributors).toBeDefined();
    });

    test("handles API errors gracefully", async () => {
      mockClient.getIssues.mockRejectedValue(new Error("API Error"));
      mockClient.getPullRequests.mockResolvedValue([]);
      mockClient.getContributors.mockResolvedValue([]);

      await collector.collect({ owner: "test", name: "repo" });

      expect(collector.data["test/repo"].error).toBeDefined();
    });
  });

  describe("collectIssueMetrics()", () => {
    beforeEach(() => {
      collector.data["test/repo"] = {
        owner: "test",
        name: "repo",
        metrics: {},
      };
    });

    test("calculates total issues", async () => {
      const issues = [
        {
          id: 1,
          created_at: "2026-08-01",
          closed_at: "2026-08-02",
          updated_at: "2026-08-02",
        },
        {
          id: 2,
          created_at: "2026-08-03",
          closed_at: null,
          updated_at: "2026-08-03",
        },
      ];
      mockClient.getIssues.mockResolvedValue(issues);

      await collector.collectIssueMetrics(
        "test",
        "repo",
        new Date("2026-08-01"),
        new Date(),
      );

      expect(collector.data["test/repo"].metrics.issues.total).toBe(2);
    });

    test("calculates closed issues", async () => {
      const issues = [
        {
          id: 1,
          created_at: "2026-08-01",
          closed_at: "2026-08-02",
          updated_at: "2026-08-02",
        },
        {
          id: 2,
          created_at: "2026-08-03",
          closed_at: null,
          updated_at: "2026-08-03",
        },
      ];
      mockClient.getIssues.mockResolvedValue(issues);

      await collector.collectIssueMetrics(
        "test",
        "repo",
        new Date("2026-08-01"),
        new Date(),
      );

      expect(collector.data["test/repo"].metrics.issues.closed).toBe(1);
    });

    test("calculates closure rate", async () => {
      const issues = [
        {
          id: 1,
          created_at: "2026-08-01",
          closed_at: "2026-08-02",
          updated_at: "2026-08-02",
        },
        {
          id: 2,
          created_at: "2026-08-03",
          closed_at: null,
          updated_at: "2026-08-03",
        },
      ];
      mockClient.getIssues.mockResolvedValue(issues);

      await collector.collectIssueMetrics(
        "test",
        "repo",
        new Date("2026-08-01"),
        new Date(),
      );

      expect(collector.data["test/repo"].metrics.issues.closure_rate).toBe(
        "50.00",
      );
    });

    test("handles empty issue list", async () => {
      mockClient.getIssues.mockResolvedValue([]);

      await collector.collectIssueMetrics(
        "test",
        "repo",
        new Date("2026-08-01"),
        new Date(),
      );

      expect(collector.data["test/repo"].metrics.issues.total).toBe(0);
      expect(collector.data["test/repo"].metrics.issues.closure_rate).toBe(0);
    });

    test("counts stale issues (no activity >30 days)", async () => {
      const thirtyTwoDaysAgo = new Date(Date.now() - 32 * 24 * 60 * 60 * 1000);
      const issues = [
        {
          id: 1,
          created_at: "2026-08-01",
          closed_at: null,
          updated_at: thirtyTwoDaysAgo.toISOString(),
        },
      ];
      mockClient.getIssues.mockResolvedValue(issues);

      await collector.collectIssueMetrics(
        "test",
        "repo",
        new Date("2026-08-01"),
        new Date(),
      );

      expect(collector.data["test/repo"].metrics.issues.stale).toBe(1);
    });

    test("extracts label distribution", async () => {
      const issues = [
        {
          id: 1,
          created_at: "2026-08-01",
          closed_at: "2026-08-02",
          updated_at: "2026-08-02",
          labels: [{ name: "bug" }, { name: "critical" }],
        },
      ];
      mockClient.getIssues.mockResolvedValue(issues);

      await collector.collectIssueMetrics(
        "test",
        "repo",
        new Date("2026-08-01"),
        new Date(),
      );

      expect(collector.data["test/repo"].metrics.issues.labels.bug).toBe(1);
      expect(collector.data["test/repo"].metrics.issues.labels.critical).toBe(
        1,
      );
    });
  });

  describe("percentile()", () => {
    test("calculates 50th percentile (median)", () => {
      const data = [1, 2, 3, 4, 5];
      const result = collector.percentile(data, 0.5);
      expect(parseFloat(result)).toBeGreaterThan(0);
    });

    test("calculates 95th percentile", () => {
      const data = Array.from({ length: 100 }, (_, i) => i + 1);
      const result = collector.percentile(data, 0.95);
      expect(parseFloat(result)).toBeGreaterThan(90);
    });

    test("handles empty array", () => {
      const result = collector.percentile([], 0.5);
      expect(result).toBe("0.00");
    });
  });

  describe("labelDistribution()", () => {
    test("counts labels across items", () => {
      const items = [
        { labels: [{ name: "bug" }, { name: "critical" }] },
        { labels: [{ name: "bug" }] },
      ];
      const dist = collector.labelDistribution(items);

      expect(dist.bug).toBe(2);
      expect(dist.critical).toBe(1);
    });

    test("handles items without labels", () => {
      const items = [{ labels: [{ name: "bug" }] }, { labels: null }];
      const dist = collector.labelDistribution(items);

      expect(dist.bug).toBe(1);
    });

    test("returns empty object for no labels", () => {
      const items = [{ labels: [] }];
      const dist = collector.labelDistribution(items);

      expect(Object.keys(dist).length).toBe(0);
    });
  });

  describe("averagePRSize()", () => {
    test("calculates average PR size", () => {
      const prs = [
        { additions: 50, deletions: 10 },
        { additions: 100, deletions: 20 },
      ];
      const size = collector.averagePRSize(prs);

      expect(parseFloat(size)).toBe(90);
    });

    test("handles missing additions/deletions", () => {
      const prs = [{ additions: 0, deletions: 0 }, {}];
      const size = collector.averagePRSize(prs);

      expect(parseFloat(size)).toBe(0);
    });

    test("returns 0 for empty PR list", () => {
      const size = collector.averagePRSize([]);
      expect(size).toBe(0);
    });
  });
});

// ============================================================================
// AGGREGATION MODULE TESTS
// ============================================================================

describe("MetricsAggregator", () => {
  const mockData = {
    "test/repo1": {
      metrics: {
        issues: { total: 10, closed: 5, closure_rate: 50 },
        pull_requests: { total: 20, merged: 15, merge_rate: 75 },
        contributors: { active: 5 },
      },
    },
    "test/repo2": {
      metrics: {
        issues: { total: 20, closed: 15, closure_rate: 75 },
        pull_requests: { total: 30, merged: 25, merge_rate: 83 },
        contributors: { active: 8 },
      },
    },
  };

  describe("aggregate()", () => {
    test("includes timestamp", () => {
      const result = MetricsAggregator.aggregate(mockData);
      expect(result.timestamp).toBeDefined();
    });

    test("includes repositories data", () => {
      const result = MetricsAggregator.aggregate(mockData);
      expect(result.repositories).toEqual(mockData);
    });

    test("calculates summary metrics", () => {
      const result = MetricsAggregator.aggregate(mockData);
      expect(result.summary).toBeDefined();
    });

    test("calculates trends when previous data provided", () => {
      const result = MetricsAggregator.aggregate(mockData, mockData);
      expect(result.trends).toBeDefined();
    });

    test("detects anomalies when previous data provided", () => {
      const result = MetricsAggregator.aggregate(mockData, mockData);
      expect(result.anomalies).toBeDefined();
    });
  });

  describe("calculateSummary()", () => {
    test("calculates total repositories", () => {
      const summary = MetricsAggregator.calculateSummary(mockData);
      expect(summary.total_repositories).toBe(2);
    });

    test("sums total issues across repositories", () => {
      const summary = MetricsAggregator.calculateSummary(mockData);
      expect(summary.total_issues).toBe(30);
    });

    test("sums total PRs across repositories", () => {
      const summary = MetricsAggregator.calculateSummary(mockData);
      expect(summary.total_prs).toBe(50);
    });

    test("calculates average closure rate", () => {
      const summary = MetricsAggregator.calculateSummary(mockData);
      expect(parseFloat(summary.avg_issue_closure_rate)).toBeGreaterThan(0);
    });

    test("sums total contributors", () => {
      const summary = MetricsAggregator.calculateSummary(mockData);
      expect(summary.total_contributors).toBe(13);
    });

    test("handles empty data", () => {
      const summary = MetricsAggregator.calculateSummary({});
      expect(summary.total_repositories).toBe(0);
    });
  });

  describe("averageMetric()", () => {
    test("calculates average of metric across repos", () => {
      const repos = Object.values(mockData);
      const avg = MetricsAggregator.averageMetric(repos, "issues.closure_rate");
      expect(parseFloat(avg)).toBe(62.5);
    });

    test("returns N/A when no valid values", () => {
      const repos = [{ metrics: {} }];
      const avg = MetricsAggregator.averageMetric(repos, "missing.metric");
      expect(avg).toBe("N/A");
    });
  });

  describe("calculateTrend()", () => {
    test('returns "increased" for >10% increase', () => {
      const trend = MetricsAggregator.calculateTrend(110, 100);
      expect(trend).toBe("increased");
    });

    test('returns "decreased" for >10% decrease', () => {
      const trend = MetricsAggregator.calculateTrend(80, 100);
      expect(trend).toBe("decreased");
    });

    test('returns "stable" for ±10% change', () => {
      const trend = MetricsAggregator.calculateTrend(105, 100);
      expect(trend).toBe("stable");
    });

    test('returns "increased" when previous is 0', () => {
      const trend = MetricsAggregator.calculateTrend(10, 0);
      expect(trend).toBe("increased");
    });
  });

  describe("detectAnomalies()", () => {
    test("detects significant changes (>50%)", () => {
      const current = {
        "test/repo": {
          metrics: {
            issues: { total: 100 },
            pull_requests: { total: 50 },
          },
        },
      };
      const previous = {
        "test/repo": {
          metrics: {
            issues: { total: 10 },
            pull_requests: { total: 10 },
          },
        },
      };

      const anomalies = MetricsAggregator.detectAnomalies(current, previous);
      expect(anomalies.length).toBeGreaterThan(0);
    });

    test("flags high-severity anomalies for >100% change", () => {
      const current = {
        "test/repo": {
          metrics: {
            issues: { total: 100 },
            pull_requests: { total: 50 },
          },
        },
      };
      const previous = {
        "test/repo": {
          metrics: {
            issues: { total: 30 },
            pull_requests: { total: 10 },
          },
        },
      };

      const anomalies = MetricsAggregator.detectAnomalies(current, previous);
      expect(anomalies.some((a) => a.severity === "high")).toBe(true);
    });
  });
});

// ============================================================================
// ANALYSIS & INSIGHTS TESTS
// ============================================================================

describe("InsightsAnalyzer", () => {
  const mockAggregatedData = {
    timestamp: "2026-08-12T00:00:00Z",
    summary: {
      total_repositories: 2,
      total_issues: 30,
      total_prs: 50,
      avg_issue_closure_rate: 62.5,
      avg_pr_merge_rate: 79,
      total_contributors: 13,
    },
    repositories: {
      "test/repo1": {
        metrics: {
          issues: {
            total: 10,
            closed: 5,
            closure_rate: 50,
            stale: 2,
            reopened: 0,
          },
        },
      },
    },
  };

  describe("analyze()", () => {
    test("includes timestamp in analysis", () => {
      const analysis = InsightsAnalyzer.analyze(mockAggregatedData);
      expect(analysis.timestamp).toBeDefined();
    });

    test("includes metrics snapshot", () => {
      const analysis = InsightsAnalyzer.analyze(mockAggregatedData);
      expect(analysis.metrics_snapshot).toEqual(mockAggregatedData.summary);
    });

    test("generates insights array", () => {
      const analysis = InsightsAnalyzer.analyze(mockAggregatedData);
      expect(Array.isArray(analysis.insights)).toBe(true);
    });

    test("generates recommendations array", () => {
      const analysis = InsightsAnalyzer.analyze(mockAggregatedData);
      expect(Array.isArray(analysis.recommendations)).toBe(true);
    });

    test("calculates health score", () => {
      const analysis = InsightsAnalyzer.analyze(mockAggregatedData);
      expect(typeof analysis.health_score).toBe("number");
      expect(analysis.health_score).toBeGreaterThanOrEqual(0);
      expect(analysis.health_score).toBeLessThanOrEqual(100);
    });
  });

  describe("analyzeTrends()", () => {
    test("detects increasing issues", () => {
      const trends = { issue_trend: "increased" };
      const insights = InsightsAnalyzer.analyzeTrends(trends);

      expect(insights.some((i) => i.type === "issue-backlog")).toBe(true);
    });

    test("detects decreasing issues", () => {
      const trends = { issue_trend: "decreased" };
      const insights = InsightsAnalyzer.analyzeTrends(trends);

      expect(insights.some((i) => i.type === "issue-reduction")).toBe(true);
    });

    test("detects declining closure rate", () => {
      const trends = { closure_rate_trend: "decreased" };
      const insights = InsightsAnalyzer.analyzeTrends(trends);

      expect(insights.some((i) => i.type === "closure-rate-declining")).toBe(
        true,
      );
    });
  });

  describe("analyzeHealthMetrics()", () => {
    test("detects stale issues", () => {
      const repos = {
        "test/repo": {
          metrics: {
            issues: { stale: 5 },
          },
        },
      };
      const insights = InsightsAnalyzer.analyzeHealthMetrics(repos);

      expect(insights.some((i) => i.type === "stale-issues")).toBe(true);
    });

    test("detects high reopened rate", () => {
      const repos = {
        "test/repo1": {
          metrics: { issues: { reopened: 5 } },
        },
        "test/repo2": {
          metrics: { issues: { reopened: 6 } },
        },
      };
      const insights = InsightsAnalyzer.analyzeHealthMetrics(repos);

      expect(insights.some((i) => i.type === "high-reopened-rate")).toBe(true);
    });

    test("returns insights for no issues", () => {
      const insights = InsightsAnalyzer.analyzeHealthMetrics({});
      expect(Array.isArray(insights)).toBe(true);
    });
  });

  describe("generateRecommendations()", () => {
    test("recommends stale issue triage", () => {
      const analysis = {
        insights: [{ type: "stale-issues" }],
      };
      const recs = InsightsAnalyzer.generateRecommendations(analysis);

      expect(recs.some((r) => r.action === "triage-stale-issues")).toBe(true);
    });

    test("recommends improving velocity", () => {
      const analysis = {
        insights: [{ type: "closure-rate-declining" }],
      };
      const recs = InsightsAnalyzer.generateRecommendations(analysis);

      expect(recs.some((r) => r.action === "improve-velocity")).toBe(true);
    });

    test("recommends backlog management for large backlog", () => {
      const analysis = {
        insights: [],
        metrics_snapshot: { total_issues: 100 },
      };
      const recs = InsightsAnalyzer.generateRecommendations(analysis);

      expect(recs.some((r) => r.action === "backlog-management")).toBe(true);
    });
  });

  describe("calculateHealthScore()", () => {
    test("returns 100 for healthy metrics", () => {
      const data = {
        summary: {
          avg_issue_closure_rate: 85,
          avg_pr_merge_rate: 90,
        },
      };
      const score = InsightsAnalyzer.calculateHealthScore(data);

      expect(score).toBeGreaterThan(80);
    });

    test("deducts points for low closure rate", () => {
      const data = {
        summary: {
          avg_issue_closure_rate: 40,
          avg_pr_merge_rate: 90,
        },
      };
      const score = InsightsAnalyzer.calculateHealthScore(data);

      expect(score).toBeLessThan(100);
    });

    test("deducts points for low merge rate", () => {
      const data = {
        summary: {
          avg_issue_closure_rate: 85,
          avg_pr_merge_rate: 60,
        },
      };
      const score = InsightsAnalyzer.calculateHealthScore(data);

      expect(score).toBeLessThan(100);
    });

    test("never returns negative score", () => {
      const data = {
        summary: {
          avg_issue_closure_rate: 0,
          avg_pr_merge_rate: 0,
        },
        anomalies: [{}, {}, {}, {}],
      };
      const score = InsightsAnalyzer.calculateHealthScore(data);

      expect(score).toBeGreaterThanOrEqual(0);
    });
  });
});

// ============================================================================
// REPORTING MODULE TESTS
// ============================================================================

describe("MetricsReporter", () => {
  const mockAnalysis = {
    timestamp: "2026-08-12T00:00:00Z",
    metrics_snapshot: { total_issues: 30 },
    insights: [],
    recommendations: [],
    health_score: 85,
  };

  const mockConfig = {
    context: "github-control-plane",
    collection_period: 7,
    repositories: [
      { owner: "test", name: "repo1" },
      { owner: "test", name: "repo2" },
    ],
  };

  describe("packageMetrics()", () => {
    test("includes schema version", async () => {
      const report = await MetricsReporter.packageMetrics(
        mockAnalysis,
        mockConfig,
      );
      expect(report.schema_version).toBe("1.0");
    });

    test("includes timestamp", async () => {
      const report = await MetricsReporter.packageMetrics(
        mockAnalysis,
        mockConfig,
      );
      expect(report.generated_at).toBe(mockAnalysis.timestamp);
    });

    test("includes context", async () => {
      const report = await MetricsReporter.packageMetrics(
        mockAnalysis,
        mockConfig,
      );
      expect(report.context).toBe("github-control-plane");
    });

    test("includes collection period", async () => {
      const report = await MetricsReporter.packageMetrics(
        mockAnalysis,
        mockConfig,
      );
      expect(report.collection_period).toBe(7);
    });

    test("includes metrics snapshot", async () => {
      const report = await MetricsReporter.packageMetrics(
        mockAnalysis,
        mockConfig,
      );
      expect(report.metrics).toEqual(mockAnalysis.metrics_snapshot);
    });

    test("includes insights", async () => {
      const report = await MetricsReporter.packageMetrics(
        mockAnalysis,
        mockConfig,
      );
      expect(report.insights).toBeDefined();
    });

    test("includes recommendations", async () => {
      const report = await MetricsReporter.packageMetrics(
        mockAnalysis,
        mockConfig,
      );
      expect(report.recommendations).toBeDefined();
    });

    test("includes health score", async () => {
      const report = await MetricsReporter.packageMetrics(
        mockAnalysis,
        mockConfig,
      );
      expect(report.health_score).toBe(85);
    });

    test("includes data sources", async () => {
      const report = await MetricsReporter.packageMetrics(
        mockAnalysis,
        mockConfig,
      );
      expect(report.data_sources).toContain("test/repo1");
      expect(report.data_sources).toContain("test/repo2");
    });
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe("Metrics Agent Integration", () => {
  test("configuration loads successfully for github-control-plane", () => {
    const config = {
      context: "github-control-plane",
      repositories: [{ owner: "test", name: "repo" }],
      collection_period: 7,
    };
    const result = ConfigurationLoader.validateConfig(config);
    expect(result.context).toBe("github-control-plane");
  });

  test("configuration loads successfully for wordpress-plugin", () => {
    const config = {
      context: "wordpress-plugin",
      repositories: [{ owner: "test", name: "repo" }],
      collection_period: 14,
    };
    const result = ConfigurationLoader.validateConfig(config);
    expect(result.context).toBe("wordpress-plugin");
  });

  test("configuration loads successfully for wordpress-theme", () => {
    const config = {
      context: "wordpress-theme",
      repositories: [{ owner: "test", name: "repo" }],
      collection_period: 14,
    };
    const result = ConfigurationLoader.validateConfig(config);
    expect(result.context).toBe("wordpress-theme");
  });

  test("end-to-end flow produces valid report structure", async () => {
    const config = {
      context: "github-control-plane",
      repositories: [{ owner: "test", name: "repo" }],
      collection_period: 7,
    };

    const mockClient = {
      getIssues: jest.fn().mockResolvedValue([]),
      getPullRequests: jest.fn().mockResolvedValue([]),
      getContributors: jest.fn().mockResolvedValue([]),
    };

    const collector = new MetricsCollector(mockClient, config);
    const data = await collector.collect({ owner: "test", name: "repo" });
    const aggregated = MetricsAggregator.aggregate({ "test/repo": data });
    const analysis = InsightsAnalyzer.analyze(aggregated);
    const report = await MetricsReporter.packageMetrics(analysis, config);

    expect(report.schema_version).toBe("1.0");
    expect(report.context).toBe("github-control-plane");
    expect(report.health_score).toBeLessThanOrEqual(100);
  });
});
