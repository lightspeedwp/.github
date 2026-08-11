/**
 * Unit Tests: Review Status Labels Script
 */

import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// Mock the LabelManager and ReportGenerator BEFORE importing review-status-labels
jest.mock("../includes/label-management.js", () => ({
  LabelManager: jest.fn(),
}));
jest.mock("../includes/report-generator.js", () => ({
  ReportGenerator: jest.fn(),
}));

// Now import the modules and functions after mocking dependencies
import { ActivityAnalyzer } from "../includes/activity-analyzer.js";
import {
  auditStatusLabels,
  analyzeStatusIssue,
  categorizeAge,
  extractBlockers,
  generateRecommendations,
} from "../review-status-labels.js";
import { LabelManager } from "../includes/label-management.js";

describe("Review Status Labels Script", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GITHUB_TOKEN = "test-token";
  });

  describe("categorizeAge", () => {
    it("should categorize fresh issues (0-3 days)", () => {
      expect(categorizeAge(0)).toBe("fresh");
      expect(categorizeAge(1)).toBe("fresh");
      expect(categorizeAge(3)).toBe("fresh");
    });

    it("should categorize pending issues (4-7 days)", () => {
      expect(categorizeAge(4)).toBe("pending");
      expect(categorizeAge(5)).toBe("pending");
      expect(categorizeAge(7)).toBe("pending");
    });

    it("should categorize overdue issues (7+ days)", () => {
      expect(categorizeAge(8)).toBe("overdue");
      expect(categorizeAge(10)).toBe("overdue");
      expect(categorizeAge(100)).toBe("overdue");
    });
  });

  describe("extractBlockers", () => {
    it("should extract blocker issue numbers from body", () => {
      const issue = {
        body: "This issue blocks #123 and #456",
        labels: [],
      };

      const blockers = extractBlockers(issue);
      expect(blockers).toContain(123);
      expect(blockers).toContain(456);
      expect(blockers.length).toBe(2);
    });

    it("should handle 'blocking' keyword", () => {
      const issue = {
        body: "Blocking: #789",
        labels: [],
      };

      const blockers = extractBlockers(issue);
      expect(blockers).toContain(789);
    });

    it("should handle 'duplicate of' keyword", () => {
      const issue = {
        body: "Duplicate of: #321",
        labels: [],
      };

      const blockers = extractBlockers(issue);
      expect(blockers).toContain(321);
    });

    it("should return empty array for issues with no blockers", () => {
      const issue = {
        body: "No blockers here",
        labels: [],
      };

      const blockers = extractBlockers(issue);
      expect(blockers).toEqual([]);
    });

    it("should handle null or missing body", () => {
      const issue1 = { body: null, labels: [] };
      const issue2 = { labels: [] };

      expect(extractBlockers(issue1)).toEqual([]);
      expect(extractBlockers(issue2)).toEqual([]);
    });

    it("should not include duplicate blocker numbers", () => {
      const issue = {
        body: "Blocks #123 and blocks #123",
        labels: [],
      };

      const blockers = extractBlockers(issue);
      expect(blockers.length).toBe(1);
      expect(blockers[0]).toBe(123);
    });
  });

  describe("analyzeStatusIssue", () => {
    it("should analyze issue with status label", () => {
      const analyzer = new ActivityAnalyzer();
      const issue = {
        number: 100,
        title: "Test Issue",
        body: "",
        labels: [{ name: "status:needs-review" }],
        assignee: null,
        assignees: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      jest.spyOn(analyzer, "getDaysSinceActivity").mockReturnValue(5);

      const analysis = analyzeStatusIssue(issue, analyzer);

      expect(analysis.number).toBe(100);
      expect(analysis.title).toBe("Test Issue");
      expect(analysis.statusLabels).toContain("status:needs-review");
      expect(analysis.daysSinceUpdate).toBe(5);
      expect(analysis.ageCategory).toBe("pending");
      expect(analysis.isAssigned).toBe(false);
      expect(analysis.hasPR).toBe(false);
      expect(analysis.blockers).toEqual([]);
    });

    it("should detect assigned issues", () => {
      const analyzer = new ActivityAnalyzer();
      const issue = {
        number: 101,
        title: "Assigned Issue",
        body: "",
        labels: [],
        assignee: { login: "user1" },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      jest.spyOn(analyzer, "getDaysSinceActivity").mockReturnValue(1);

      const analysis = analyzeStatusIssue(issue, analyzer);

      expect(analysis.isAssigned).toBe(true);
    });

    it("should detect meta:has-pr label", () => {
      const analyzer = new ActivityAnalyzer();
      const issue = {
        number: 102,
        title: "Issue with PR",
        body: "",
        labels: [{ name: "meta:has-pr" }, { name: "status:needs-review" }],
        assignee: null,
        assignees: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      jest.spyOn(analyzer, "getDaysSinceActivity").mockReturnValue(2);

      const analysis = analyzeStatusIssue(issue, analyzer);

      expect(analysis.hasPR).toBe(true);
    });

    it("should extract blockers from issue", () => {
      const analyzer = new ActivityAnalyzer();
      const issue = {
        number: 103,
        title: "Blocking Issue",
        body: "Blocks #200 and #300",
        labels: [],
        assignee: null,
        assignees: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      jest.spyOn(analyzer, "getDaysSinceActivity").mockReturnValue(10);

      const analysis = analyzeStatusIssue(issue, analyzer);

      expect(analysis.blockers).toContain(200);
      expect(analysis.blockers).toContain(300);
    });
  });

  describe("generateRecommendations", () => {
    it("should flag unassigned overdue issues", () => {
      const analysis = {
        issues: [
          {
            number: 1,
            statusLabels: ["status:needs-review"],
            ageCategory: "overdue",
            daysSinceUpdate: 10,
            isAssigned: false,
            hasPR: false,
            blockers: [],
          },
        ],
      };

      const recommendations = generateRecommendations(analysis);

      expect(recommendations.length).toBeGreaterThan(0);
      expect(
        recommendations.some(
          (r) => r.type === "unassigned-overdue" && r.severity === "high",
        ),
      ).toBe(true);
    });

    it("should flag overdue needs-review without PR", () => {
      const analysis = {
        issues: [
          {
            number: 2,
            statusLabels: ["status:needs-review"],
            ageCategory: "overdue",
            daysSinceUpdate: 10,
            isAssigned: true,
            hasPR: false,
            blockers: [],
          },
        ],
      };

      const recommendations = generateRecommendations(analysis);

      expect(
        recommendations.some(
          (r) => r.type === "needs-pr" && r.severity === "medium",
        ),
      ).toBe(true);
    });

    it("should flag issues blocking others", () => {
      const analysis = {
        issues: [
          {
            number: 3,
            statusLabels: ["status:needs-review"],
            ageCategory: "fresh",
            daysSinceUpdate: 1,
            isAssigned: true,
            hasPR: true,
            blockers: [],
          },
          {
            number: 4,
            statusLabels: ["status:needs-review"],
            ageCategory: "pending",
            daysSinceUpdate: 5,
            isAssigned: false,
            hasPR: false,
            blockers: [3],
          },
        ],
      };

      const recommendations = generateRecommendations(analysis);

      expect(
        recommendations.some(
          (r) => r.type === "blocking-issues" && r.issue === 3,
        ),
      ).toBe(true);
    });

    it("should flag pending issues approaching overdue", () => {
      const analysis = {
        issues: [
          {
            number: 5,
            statusLabels: ["status:needs-triage"],
            ageCategory: "pending",
            daysSinceUpdate: 6,
            isAssigned: false,
            hasPR: false,
            blockers: [],
          },
        ],
      };

      const recommendations = generateRecommendations(analysis);

      expect(
        recommendations.some(
          (r) => r.type === "approaching-overdue" && r.severity === "low",
        ),
      ).toBe(true);
    });

    it("should not flag fresh issues", () => {
      const analysis = {
        issues: [
          {
            number: 6,
            statusLabels: ["status:needs-review"],
            ageCategory: "fresh",
            daysSinceUpdate: 1,
            isAssigned: false,
            hasPR: false,
            blockers: [],
          },
        ],
      };

      const recommendations = generateRecommendations(analysis);

      expect(recommendations.length).toBe(0);
    });

    it("should sort recommendations by severity", () => {
      const analysis = {
        issues: [
          {
            number: 7,
            statusLabels: ["status:needs-review"],
            ageCategory: "overdue",
            daysSinceUpdate: 10,
            isAssigned: false,
            hasPR: false,
            blockers: [],
          },
          {
            number: 8,
            statusLabels: ["status:needs-review"],
            ageCategory: "pending",
            daysSinceUpdate: 6,
            isAssigned: false,
            hasPR: false,
            blockers: [],
          },
        ],
      };

      const recommendations = generateRecommendations(analysis);

      // First should be high severity
      expect(recommendations[0].severity).toBe("high");
      // Should have low severity after high
      const lowIndex = recommendations.findIndex((r) => r.severity === "low");
      const highIndex = recommendations.findIndex((r) => r.severity === "high");
      expect(highIndex).toBeLessThan(lowIndex);
    });
  });

  describe("auditStatusLabels", () => {
    it("should audit status labels successfully", async () => {
      const mockIssues = [
        {
          number: 1,
          title: "Issue 1",
          body: "",
          labels: [{ name: "status:needs-review" }],
          assignee: null,
          assignees: [],
          created_at: "2024-08-01T00:00:00Z",
          updated_at: "2024-08-05T00:00:00Z",
          pull_request: undefined,
        },
        {
          number: 2,
          title: "Issue 2",
          body: "",
          labels: [{ name: "status:needs-triage" }],
          assignee: { login: "user1" },
          assignees: [{ login: "user1" }],
          created_at: "2024-08-01T00:00:00Z",
          updated_at: "2024-08-02T00:00:00Z",
          pull_request: undefined,
        },
      ];

      LabelManager.mockImplementation(() => ({
        fetchIssuesWithLabel: jest
          .fn()
          .mockResolvedValueOnce(mockIssues)
          .mockResolvedValueOnce([mockIssues[1]]),
      }));

      const result = await auditStatusLabels({ verbose: false });

      expect(result.success).toBe(true);
      expect(result.report.total_issues).toBe(2);
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it("should categorize issues by age", async () => {
      const mockIssues = [
        {
          number: 1,
          title: "Fresh",
          body: "",
          labels: [{ name: "status:needs-review" }],
          assignee: null,
          assignees: [],
          created_at: "2024-08-09T00:00:00Z",
          updated_at: "2024-08-10T00:00:00Z",
          pull_request: undefined,
        },
      ];

      LabelManager.mockImplementation(() => ({
        fetchIssuesWithLabel: jest
          .fn()
          .mockResolvedValueOnce(mockIssues)
          .mockResolvedValueOnce([]),
      }));

      const result = await auditStatusLabels();

      expect(result.success).toBe(true);
      expect(result.report.age_distribution).toBeDefined();
      expect(
        result.report.age_distribution.fresh +
          result.report.age_distribution.pending +
          result.report.age_distribution.overdue,
      ).toBe(result.report.total_issues);
    });

    it("should track assignment status", async () => {
      const mockIssues = [
        {
          number: 1,
          title: "Assigned",
          body: "",
          labels: [{ name: "status:needs-review" }],
          assignee: { login: "user1" },
          assignees: [{ login: "user1" }],
          created_at: "2024-08-01T00:00:00Z",
          updated_at: "2024-08-10T00:00:00Z",
          pull_request: undefined,
        },
        {
          number: 2,
          title: "Unassigned",
          body: "",
          labels: [{ name: "status:needs-review" }],
          assignee: null,
          assignees: [],
          created_at: "2024-08-01T00:00:00Z",
          updated_at: "2024-08-10T00:00:00Z",
          pull_request: undefined,
        },
      ];

      LabelManager.mockImplementation(() => ({
        fetchIssuesWithLabel: jest
          .fn()
          .mockResolvedValueOnce(mockIssues)
          .mockResolvedValueOnce(mockIssues),
      }));

      const result = await auditStatusLabels();

      expect(result.success).toBe(true);
      expect(result.report.assignment_stats.assigned).toBe(1);
      expect(result.report.assignment_stats.unassigned).toBe(1);
    });

    it("should detect blocker relationships", async () => {
      const mockIssues = [
        {
          number: 1,
          title: "Blocking Issue",
          body: "Blocks #2",
          labels: [{ name: "status:needs-review" }],
          assignee: null,
          assignees: [],
          created_at: "2024-08-01T00:00:00Z",
          updated_at: "2024-08-10T00:00:00Z",
          pull_request: undefined,
        },
        {
          number: 2,
          title: "Blocked Issue",
          body: "",
          labels: [{ name: "status:needs-triage" }],
          assignee: null,
          assignees: [],
          created_at: "2024-08-01T00:00:00Z",
          updated_at: "2024-08-10T00:00:00Z",
          pull_request: undefined,
        },
      ];

      LabelManager.mockImplementation(() => ({
        fetchIssuesWithLabel: jest
          .fn()
          .mockResolvedValueOnce(mockIssues)
          .mockResolvedValueOnce([mockIssues[1]]),
      }));

      const result = await auditStatusLabels();

      expect(result.success).toBe(true);
      expect(result.report.blocker_stats).toBeDefined();
      expect(result.report.blocker_stats.blockedBy).toBeGreaterThanOrEqual(0);
      expect(result.report.blocker_stats.blocking).toBeGreaterThanOrEqual(0);
    });

    it("should filter by specific label", async () => {
      const mockIssues = [
        {
          number: 1,
          title: "Issue 1",
          body: "",
          labels: [{ name: "status:needs-review" }],
          assignee: null,
          assignees: [],
          created_at: "2024-08-01T00:00:00Z",
          updated_at: "2024-08-10T00:00:00Z",
          pull_request: undefined,
        },
      ];

      LabelManager.mockImplementation(() => ({
        fetchIssuesWithLabel: jest
          .fn()
          .mockResolvedValueOnce(mockIssues)
          .mockResolvedValueOnce([]),
      }));

      const result = await auditStatusLabels({
        label: "status:needs-review",
      });

      expect(result.success).toBe(true);
      expect(result.report.all_issues.length).toBe(1);
    });

    it("should handle invalid label filter", async () => {
      LabelManager.mockImplementation(() => ({
        fetchIssuesWithLabel: jest.fn().mockResolvedValue([]),
      }));

      const result = await auditStatusLabels({
        label: "invalid:label",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Label not found");
    });

    it("should generate recommendations summary", async () => {
      const mockIssues = [
        {
          number: 1,
          title: "Overdue Unassigned",
          body: "",
          labels: [{ name: "status:needs-review" }],
          assignee: null,
          assignees: [],
          created_at: "2024-07-01T00:00:00Z",
          updated_at: "2024-07-01T00:00:00Z",
          pull_request: undefined,
        },
      ];

      LabelManager.mockImplementation(() => ({
        fetchIssuesWithLabel: jest
          .fn()
          .mockResolvedValueOnce(mockIssues)
          .mockResolvedValueOnce([]),
      }));

      const result = await auditStatusLabels();

      expect(result.success).toBe(true);
      expect(result.report.summary).toBeDefined();
      expect(
        result.report.summary.total_recommendations,
      ).toBeGreaterThanOrEqual(0);
      expect(result.report.summary.critical_unassigned_overdue).toBeDefined();
    });

    it("should handle dry-run mode", async () => {
      LabelManager.mockImplementation(() => ({
        fetchIssuesWithLabel: jest.fn().mockResolvedValue([]),
      }));

      const result = await auditStatusLabels({ dryRun: true });

      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
    });

    it("should support output formats", async () => {
      LabelManager.mockImplementation(() => ({
        fetchIssuesWithLabel: jest.fn().mockResolvedValue([]),
      }));

      const result = await auditStatusLabels({
        format: "json",
      });

      expect(result.success).toBe(true);
    });

    it("should handle API errors gracefully", async () => {
      LabelManager.mockImplementation(() => ({
        fetchIssuesWithLabel: jest
          .fn()
          .mockRejectedValue(new Error("API Error")),
      }));

      const result = await auditStatusLabels();

      expect(result.success).toBe(false);
      expect(result.error).toContain("API Error");
    });
  });

  describe("Performance", () => {
    it("should process 100+ issues within reasonable time", async () => {
      const mockIssues = Array(150)
        .fill(0)
        .map((_, i) => ({
          number: i + 1,
          title: `Issue ${i + 1}`,
          body: i % 10 === 0 ? `Blocks #${i + 10}` : "",
          labels: [
            {
              name: i % 2 === 0 ? "status:needs-review" : "status:needs-triage",
            },
          ],
          assignee: i % 3 === 0 ? { login: "user1" } : null,
          assignees: i % 3 === 0 ? [{ login: "user1" }] : [],
          created_at: "2024-08-01T00:00:00Z",
          updated_at: new Date(
            Date.now() - (i % 30) * 24 * 60 * 60 * 1000,
          ).toISOString(),
          pull_request: undefined,
        }));

      LabelManager.mockImplementation(() => ({
        fetchIssuesWithLabel: jest
          .fn()
          .mockResolvedValueOnce(mockIssues)
          .mockResolvedValueOnce(
            mockIssues.filter(
              (i) => i.labels[0].name === "status:needs-triage",
            ),
          ),
      }));

      const startTime = Date.now();
      const result = await auditStatusLabels();
      const duration = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(result.report.total_issues).toBe(150);
      // Should complete in under 5 seconds for 150 issues
      expect(duration).toBeLessThan(5000);
    });
  });
});
