/**
 * GitHub Issue Creator Tests
 */

const { GitHubIssueCreator } = require("../github-issue-creator");

describe("GitHubIssueCreator", () => {
  let issueCreator;
  let mockOctokit;

  beforeEach(() => {
    mockOctokit = {
      rest: {
        issues: {
          create: jest.fn(),
          listForRepo: jest.fn(),
          update: jest.fn(),
          createComment: jest.fn(),
        },
      },
    };

    issueCreator = new GitHubIssueCreator(mockOctokit);
  });

  describe("Issue Creation", () => {
    test("should create metrics issue with correct properties", async () => {
      const mockIssue = {
        data: {
          number: 123,
          title: "[Metrics] Weekly Report: 2026-08-21",
          body: "Test report",
          labels: ["type:metrics", "area:monitoring"],
        },
      };

      mockOctokit.rest.issues.create.mockResolvedValue(mockIssue);

      const report = "Test metrics report";
      const result = await issueCreator.createMetricsIssue(
        "lightspeedwp",
        ".github",
        report,
      );

      expect(result.number).toBe(123);
      expect(mockOctokit.rest.issues.create).toHaveBeenCalledWith(
        expect.objectContaining({
          owner: "lightspeedwp",
          repo: ".github",
          labels: ["type:metrics", "area:monitoring"],
        }),
      );
    });

    test("should include custom labels in issue creation", async () => {
      const mockIssue = { data: { number: 124 } };
      mockOctokit.rest.issues.create.mockResolvedValue(mockIssue);

      const report = "Test report";
      const customLabels = ["urgent", "review-needed"];

      await issueCreator.createMetricsIssue(
        "lightspeedwp",
        ".github",
        report,
        "weekly",
        {
          labels: customLabels,
        },
      );

      expect(mockOctokit.rest.issues.create).toHaveBeenCalledWith(
        expect.objectContaining({
          labels: expect.arrayContaining([
            "type:metrics",
            "area:monitoring",
            ...customLabels,
          ]),
        }),
      );
    });

    test("should handle issue creation errors", async () => {
      mockOctokit.rest.issues.create.mockRejectedValue(new Error("API error"));

      await expect(
        issueCreator.createMetricsIssue("lightspeedwp", ".github", "report"),
      ).rejects.toThrow("API error");
    });
  });

  describe("Weekly and Monthly Issues", () => {
    test("should create weekly issue with period label", async () => {
      const mockIssue = { data: { number: 125 } };
      mockOctokit.rest.issues.create.mockResolvedValue(mockIssue);

      await issueCreator.createWeeklyMetricsIssue(
        "lightspeedwp",
        ".github",
        "weekly report",
      );

      expect(mockOctokit.rest.issues.create).toHaveBeenCalledWith(
        expect.objectContaining({
          labels: expect.arrayContaining(["period:weekly"]),
        }),
      );
    });

    test("should create monthly issue with period label", async () => {
      const mockIssue = { data: { number: 126 } };
      mockOctokit.rest.issues.create.mockResolvedValue(mockIssue);

      await issueCreator.createMonthlyMetricsIssue(
        "lightspeedwp",
        ".github",
        "monthly report",
      );

      expect(mockOctokit.rest.issues.create).toHaveBeenCalledWith(
        expect.objectContaining({
          labels: expect.arrayContaining(["period:monthly"]),
        }),
      );
    });
  });

  describe("Issue Management", () => {
    test("should fetch metrics issues", async () => {
      const mockIssues = {
        data: [
          { number: 100, title: "[Metrics] Weekly Report: 2026-08-21" },
          { number: 101, title: "[Metrics] Weekly Report: 2026-08-14" },
        ],
      };

      mockOctokit.rest.issues.listForRepo.mockResolvedValue(mockIssues);

      const issues = await issueCreator.getMetricsIssues(
        "lightspeedwp",
        ".github",
      );

      expect(issues).toHaveLength(2);
      expect(issues[0].number).toBe(100);
    });

    test("should close old reports", async () => {
      const oldDate = new Date(
        Date.now() - 100 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const mockIssues = {
        data: [
          { number: 50, created_at: oldDate },
          { number: 51, created_at: new Date().toISOString() },
        ],
      };

      mockOctokit.rest.issues.listForRepo.mockResolvedValue(mockIssues);
      mockOctokit.rest.issues.update.mockResolvedValue({ data: {} });

      const result = await issueCreator.closeOldReports(
        "lightspeedwp",
        ".github",
        90,
      );

      expect(result.closedCount).toBe(1);
      expect(result.totalChecked).toBe(2);
      expect(mockOctokit.rest.issues.update).toHaveBeenCalledWith(
        expect.objectContaining({
          issue_number: 50,
          state: "closed",
          state_reason: "not_planned",
        }),
      );
    });

    test("should add comment to metrics issue", async () => {
      const mockComment = { data: { id: 1, body: "Test comment" } };
      mockOctokit.rest.issues.createComment.mockResolvedValue(mockComment);

      const result = await issueCreator.addCommentToMetricsIssue(
        "lightspeedwp",
        ".github",
        123,
        "Test comment",
      );

      expect(result.id).toBe(1);
      expect(mockOctokit.rest.issues.createComment).toHaveBeenCalledWith(
        expect.objectContaining({
          issue_number: 123,
          body: "Test comment",
        }),
      );
    });
  });

  describe("Report Existence Check", () => {
    test("should detect existing report for date", async () => {
      const mockIssues = {
        data: [
          { title: "[Metrics] Weekly Report: 2026-08-21" },
          { title: "[Metrics] Weekly Report: 2026-08-14" },
        ],
      };

      mockOctokit.rest.issues.listForRepo.mockResolvedValue(mockIssues);

      const testDate = new Date("2026-08-21");
      const exists = await issueCreator.reportExistsForDate(
        "lightspeedwp",
        ".github",
        testDate,
      );

      expect(exists).toBe(true);
    });

    test("should detect missing report for date", async () => {
      const mockIssues = { data: [] };
      mockOctokit.rest.issues.listForRepo.mockResolvedValue(mockIssues);

      const testDate = new Date("2026-08-21");
      const exists = await issueCreator.reportExistsForDate(
        "lightspeedwp",
        ".github",
        testDate,
      );

      expect(exists).toBe(false);
    });
  });

  describe("Template Generation", () => {
    test("should generate issue template", () => {
      const template = issueCreator.generateIssueTemplate("Test report data");

      expect(template).toContain("Metrics Report");
      expect(template).toContain("Test report data");
      expect(template).toContain("Metadata");
      expect(template).toContain("Auto-generated");
    });
  });

  describe("Retry Logic", () => {
    test("should retry on failure", async () => {
      const mockIssue = { data: { number: 150 } };

      mockOctokit.rest.issues.create
        .mockRejectedValueOnce(new Error("Temporary error"))
        .mockResolvedValueOnce(mockIssue);

      const result = await issueCreator.createMetricsIssueWithRetry(
        "lightspeedwp",
        ".github",
        "report",
        "weekly",
        3,
      );

      expect(result.number).toBe(150);
      expect(mockOctokit.rest.issues.create).toHaveBeenCalledTimes(2);
    });

    test("should fail after max retries", async () => {
      mockOctokit.rest.issues.create.mockRejectedValue(
        new Error("Persistent error"),
      );

      await expect(
        issueCreator.createMetricsIssueWithRetry(
          "lightspeedwp",
          ".github",
          "report",
          "weekly",
          2,
        ),
      ).rejects.toThrow("Failed to create metrics issue after 2 attempts");
    });
  });
});
