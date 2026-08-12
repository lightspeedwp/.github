/**
 * Jest suite verifying the behaviour of `metrics.agent.js`.
 *
 * @see ../metrics.agent.js
 */
const agent = require("../metrics.agent");

describe("metrics.agent", () => {
  const issueFixture = [
    {
      number: 1,
      state: "open",
      createdAt: "2026-06-01T10:00:00Z",
      firstResponseAt: "2026-06-01T12:30:00Z",
      labels: [{ name: "bug" }, { name: "help wanted" }],
    },
    {
      number: 2,
      state: "closed",
      createdAt: "2026-05-30T09:00:00Z",
      closedAt: "2026-06-01T09:00:00Z",
      comments: [{ createdAt: "2026-05-30T10:00:00Z" }],
      labels: ["documentation"],
    },
    {
      number: 3,
      state: "closed",
      created_at: "2026-04-01T08:00:00Z",
      closed_at: "2026-04-03T08:00:00Z",
      labels: [],
    },
    {
      number: 4,
      state: "open",
      createdAt: "invalid-date",
      labels: ["ignored"],
    },
  ];

  const pullRequestFixture = [
    {
      number: 11,
      state: "open",
      createdAt: "2026-06-01T09:00:00Z",
      firstReviewAt: "2026-06-01T12:00:00Z",
      reviews: [{ submittedAt: "2026-06-01T12:00:00Z" }],
    },
    {
      number: 12,
      state: "closed",
      createdAt: "2026-05-28T10:00:00Z",
      mergedAt: "2026-05-29T10:00:00Z",
      closedAt: "2026-05-29T10:00:00Z",
      reviews: [{ submittedAt: "2026-05-28T18:00:00Z" }],
    },
    {
      number: 13,
      state: "closed",
      created_at: "2026-05-20T10:00:00Z",
      closed_at: "2026-05-21T10:00:00Z",
      reviews: [],
    },
  ];

  it("exports the helper surface", () => {
    expect(agent).toEqual(
      expect.objectContaining({
        aggregateRepositoryMetrics: expect.any(Function),
        collectIssueMetrics: expect.any(Function),
        collectPullRequestMetrics: expect.any(Function),
        createReport: expect.any(Function),
        diffDays: expect.any(Function),
        diffHours: expect.any(Function),
        formatDate: expect.any(Function),
        formatDateTime: expect.any(Function),
        generateCsvReport: expect.any(Function),
        generateMarkdownReport: expect.any(Function),
        isWithinRange: expect.any(Function),
        normaliseDate: expect.any(Function),
      }),
    );
  });

  describe("date helpers", () => {
    it("normalises valid dates and rejects invalid ones", () => {
      expect(agent.normaliseDate("2026-06-08T10:00:00Z")).toBeInstanceOf(Date);
      expect(
        agent.normaliseDate(new Date("2026-06-08T10:00:00Z")),
      ).toBeInstanceOf(Date);
      expect(agent.normaliseDate("not-a-date")).toBeNull();
      expect(agent.normaliseDate(null)).toBeNull();
    });

    it("formats dates consistently", () => {
      expect(agent.formatDate("2026-06-08T10:00:00Z")).toBe("2026-06-08");
      expect(agent.formatDateTime("2026-06-08T10:00:00Z")).toBe(
        "2026-06-08T10:00:00.000Z",
      );
      expect(agent.formatDate("invalid")).toBe("");
      expect(agent.formatDateTime(undefined)).toBe("");
    });

    it("calculates time deltas and range checks", () => {
      expect(
        agent.diffHours("2026-06-01T00:00:00Z", "2026-06-01T03:30:00Z"),
      ).toBe(3.5);
      expect(
        agent.diffDays("2026-06-01T00:00:00Z", "2026-06-03T12:00:00Z"),
      ).toBe(2.5);
      expect(
        agent.isWithinRange(
          "2026-06-02T00:00:00Z",
          "2026-06-01T00:00:00Z",
          "2026-06-03T00:00:00Z",
        ),
      ).toBe(true);
      expect(
        agent.isWithinRange(
          "2026-06-04T00:00:00Z",
          "2026-06-01T00:00:00Z",
          "2026-06-03T00:00:00Z",
        ),
      ).toBe(false);
      expect(agent.diffHours("invalid", "2026-06-01T03:30:00Z")).toBeNull();
    });
  });

  describe("collectIssueMetrics", () => {
    it("aggregates open and closed issue data", () => {
      const metrics = agent.collectIssueMetrics(issueFixture, {
        now: "2026-06-08T00:00:00Z",
      });

      expect(metrics).toMatchObject({
        total: 3,
        open: 1,
        closed: 2,
        statusCounts: { open: 1, closed: 2 },
        labelCounts: {
          bug: 1,
          "help wanted": 1,
          documentation: 1,
        },
      });
      expect(metrics.averageAgeDays).toBe(3.53);
      expect(metrics.averageFirstResponseHours).toBe(1.75);
    });

    it("ignores blank and malformed labels while still counting valid ones", () => {
      const metrics = agent.collectIssueMetrics(
        [
          {
            state: "open",
            createdAt: "2026-06-01T10:00:00Z",
            labels: [null, { name: "triage" }, { name: 123 }, ""],
          },
        ],
        { now: "2026-06-08T00:00:00Z" },
      );

      expect(metrics.labelCounts).toEqual({ triage: 1 });
    });

    it("filters issue metrics by date range", () => {
      const metrics = agent.collectIssueMetrics(issueFixture, {
        startDate: "2026-05-31T00:00:00Z",
        endDate: "2026-06-02T23:59:59Z",
        now: "2026-06-08T00:00:00Z",
      });

      expect(metrics.total).toBe(1);
      expect(metrics.closed).toBe(0);
      expect(metrics.open).toBe(1);
    });

    it("handles empty and invalid issue inputs", () => {
      expect(
        agent.collectIssueMetrics([], { now: "2026-06-08T00:00:00Z" }),
      ).toEqual(
        expect.objectContaining({
          total: 0,
          averageAgeDays: 0,
          averageFirstResponseHours: 0,
        }),
      );
      expect(() => agent.collectIssueMetrics(null)).toThrow(
        "issues must be an array",
      );
    });
  });

  describe("collectPullRequestMetrics", () => {
    it("aggregates pull request data", () => {
      const metrics = agent.collectPullRequestMetrics(pullRequestFixture, {
        now: "2026-06-08T00:00:00Z",
      });

      expect(metrics).toMatchObject({
        total: 3,
        merged: 1,
        open: 1,
        closed: 2,
        mergeRate: 33.33,
        stateCounts: { open: 1, closed: 2 },
      });
      expect(metrics.averageReviewLeadHours).toBe(5.5);
      expect(metrics.averageLeadTimeHours).toBe(69);
    });

    it("filters pull requests by date range and handles empty input", () => {
      const metrics = agent.collectPullRequestMetrics(pullRequestFixture, {
        startDate: "2026-05-31T00:00:00Z",
        endDate: "2026-06-02T23:59:59Z",
        now: "2026-06-08T00:00:00Z",
      });

      expect(metrics.total).toBe(1);
      expect(metrics.merged).toBe(0);
      expect(
        agent.collectPullRequestMetrics([], { now: "2026-06-08T00:00:00Z" }),
      ).toEqual(
        expect.objectContaining({
          total: 0,
          mergeRate: 0,
        }),
      );
      expect(() => agent.collectPullRequestMetrics("nope")).toThrow(
        "pullRequests must be an array",
      );
    });
  });

  describe("aggregateRepositoryMetrics", () => {
    it("aggregates multiple repositories from an array input", () => {
      const report = agent.aggregateRepositoryMetrics(
        [
          {
            name: "alpha",
            issues: issueFixture.slice(0, 2),
            pullRequests: pullRequestFixture.slice(0, 2),
          },
          {
            name: "beta",
            issues: issueFixture.slice(2),
            pullRequests: pullRequestFixture.slice(2),
          },
        ],
        { now: "2026-06-08T00:00:00Z" },
      );

      expect(report.summary).toMatchObject({
        repositoryCount: 2,
        issueCount: 3,
        pullRequestCount: 3,
        mergedPullRequestCount: 1,
        mergeRate: 33.33,
      });
      expect(report.repositories).toHaveLength(2);
      expect(report.repositories[0]).toMatchObject({ name: "alpha" });
    });

    it("uses raw samples rather than averaging per-repository averages", () => {
      const report = agent.aggregateRepositoryMetrics(
        [
          {
            name: "small-repo",
            issues: [
              {
                state: "closed",
                createdAt: "2026-06-01T00:00:00Z",
                closedAt: "2026-06-02T00:00:00Z",
                firstResponseAt: "2026-06-01T01:00:00Z",
              },
            ],
            pullRequests: [
              {
                state: "closed",
                createdAt: "2026-06-01T00:00:00Z",
                closedAt: "2026-06-01T04:00:00Z",
                reviews: [{ submittedAt: "2026-06-01T01:00:00Z" }],
              },
            ],
          },
          {
            name: "large-repo",
            issues: [
              {
                state: "closed",
                createdAt: "2026-06-01T00:00:00Z",
                closedAt: "2026-06-02T00:00:00Z",
                firstResponseAt: "2026-06-01T09:00:00Z",
              },
              {
                state: "closed",
                createdAt: "2026-06-01T00:00:00Z",
                closedAt: "2026-06-02T00:00:00Z",
                firstResponseAt: "2026-06-01T09:00:00Z",
              },
            ],
            pullRequests: [
              {
                state: "closed",
                createdAt: "2026-06-01T00:00:00Z",
                closedAt: "2026-06-01T10:00:00Z",
                reviews: [{ submittedAt: "2026-06-01T09:00:00Z" }],
              },
              {
                state: "closed",
                createdAt: "2026-06-01T00:00:00Z",
                closedAt: "2026-06-01T10:00:00Z",
                reviews: [{ submittedAt: "2026-06-01T09:00:00Z" }],
              },
            ],
          },
        ],
        { now: "2026-06-08T00:00:00Z" },
      );

      expect(report.summary.averageIssueFirstResponseHours).toBe(6.33);
      expect(report.summary.averagePullRequestLeadTimeHours).toBe(8);
    });

    it("accepts repository maps and surfaces zero-data repositories", () => {
      const report = agent.aggregateRepositoryMetrics(
        {
          gamma: { issues: [], pullRequests: [] },
        },
        { now: "2026-06-08T00:00:00Z" },
      );

      expect(report.repositories).toHaveLength(1);
      expect(report.repositories[0]).toMatchObject({
        name: "gamma",
        issues: expect.objectContaining({ total: 0 }),
        pullRequests: expect.objectContaining({ total: 0 }),
      });
      expect(() => agent.aggregateRepositoryMetrics(null)).toThrow(
        "repositories must be an array or object map",
      );
    });

    it("supports repository maps with quoted values for CSV escaping", () => {
      const report = agent.aggregateRepositoryMetrics(
        {
          'alpha, "core"': {
            issues: issueFixture.slice(0, 1),
            pullRequests: pullRequestFixture.slice(0, 1),
          },
        },
        { now: "2026-06-08T00:00:00Z" },
      );

      const csv = agent.generateCsvReport(report);
      expect(csv).toContain('"alpha, ""core"""');
    });
  });

  describe("report generation", () => {
    const report = agent.aggregateRepositoryMetrics(
      [
        {
          name: "alpha",
          issues: issueFixture.slice(0, 2),
          pullRequests: pullRequestFixture.slice(0, 2),
        },
      ],
      { now: "2026-06-08T00:00:00Z" },
    );

    it("generates markdown output", () => {
      const markdown = agent.generateMarkdownReport({
        ...report,
        generatedAt: "2026-06-08T10:00:00Z",
      });

      expect(markdown).toContain("# Metrics Report");
      expect(markdown).toContain("Generated: 2026-06-08T10:00:00.000Z");
      expect(markdown).toContain(
        "| Repository | Issues | PRs | Merged PRs | Merge Rate | Avg issue first response (h) |",
      );
      expect(markdown).toContain("| alpha | 2 | 2 | 1 | 50%");
    });

    it("generates CSV output", () => {
      const csv = agent.generateCsvReport(report);

      expect(csv.split("\n")[0]).toBe(
        "repository,issue_count,open_issues,closed_issues,pr_count,merged_prs,merge_rate,issue_first_response_hours,pr_lead_time_hours",
      );
      expect(csv).toContain("alpha,2,1,1,2,1,50");
    });

    it("escapes carriage returns in CSV values", () => {
      const csv = agent.generateCsvReport({
        repositories: [
          {
            name: 'alpha,\r"core"',
            issues: {
              total: 1,
              open: 0,
              closed: 1,
              averageFirstResponseHours: 2,
            },
            pullRequests: {
              total: 1,
              merged: 1,
              mergeRate: 100,
              averageLeadTimeHours: 4,
            },
          },
        ],
      });

      expect(csv).toContain('"alpha,\r""core"""');
    });

    it("renders the empty repository table branch", () => {
      const markdown = agent.generateMarkdownReport({
        repositories: [],
        summary: {},
        generatedAt: "2026-06-08T10:00:00Z",
      });

      expect(markdown).toContain("_No repository data available._");
    });

    it("creates a combined report bundle", () => {
      const bundle = agent.createReport(
        [
          {
            name: "alpha",
            issues: issueFixture.slice(0, 2),
            pullRequests: pullRequestFixture.slice(0, 2),
          },
        ],
        { generatedAt: "2026-06-08T10:00:00Z", now: "2026-06-08T00:00:00Z" },
      );

      expect(bundle.markdown).toContain("# Metrics Report");
      expect(bundle.csv).toContain("repository,issue_count");
      expect(bundle.summary.repositoryCount).toBe(1);
      expect(bundle.generatedAt).toBe("2026-06-08T10:00:00Z");
    });
  });
});
