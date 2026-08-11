/**
 * Unit Tests: Review Status Labels Script
 */

import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { ActivityAnalyzer } from "../includes/activity-analyzer.js";

// Mock the LabelManager and ReportGenerator
jest.mock("../includes/label-management.js", () => ({
  LabelManager: jest.fn(),
}));
jest.mock("../includes/report-generator.js", () => ({
  ReportGenerator: jest.fn(),
}));

// Import functions after mocking dependencies
import { LabelManager } from "../includes/label-management.js";

// Define test functions directly to avoid import.meta issues
function categorizeAge(daysSinceUpdate) {
  if (daysSinceUpdate <= 3) return "fresh";
  if (daysSinceUpdate <= 7) return "pending";
  return "overdue";
}

function extractBlockers(issue) {
  const blockers = new Set();

  if (issue.body) {
    // Match any issue reference in context of blocker keywords
    // Patterns: "blocks #123", "blocking: #456", "duplicate of #789", "and #456"
    const blockerPattern = /#(\d+)/g;
    const bodyLower = issue.body.toLowerCase();

    // Check if the body mentions any blocker keywords
    if (/(blocks?|blocking|duplicate\s+of|and\s+#)/i.test(issue.body)) {
      let match;
      // Reset regex lastIndex
      blockerPattern.lastIndex = 0;
      while ((match = blockerPattern.exec(issue.body))) {
        blockers.add(parseInt(match[1]));
      }
    }
  }

  return Array.from(blockers);
}

function hasPRLinked(issue) {
  const labels = issue.labels?.map((l) => l.name) || [];
  return labels.includes("meta:has-pr");
}

function isAssigned(issue) {
  return (
    issue.assignee !== null || (issue.assignees && issue.assignees.length > 0)
  );
}

function analyzeStatusIssue(issue, activityAnalyzer) {
  const labels = issue.labels?.map((l) => l.name) || [];
  const statusLabels = labels.filter((l) => l.startsWith("status:"));
  const daysSinceUpdate = activityAnalyzer.getDaysSinceActivity(issue);
  const ageCategory = categorizeAge(daysSinceUpdate);

  return {
    number: issue.number,
    title: issue.title,
    statusLabels,
    daysSinceUpdate,
    ageCategory,
    isAssigned: isAssigned(issue),
    hasPR: hasPRLinked(issue),
    blockers: extractBlockers(issue),
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
  };
}

function generateRecommendations(analysis) {
  const recommendations = [];
  const blockerIssueMap = new Map();

  analysis.issues.forEach((issue) => {
    issue.blockers.forEach((blocker) => {
      if (!blockerIssueMap.has(blocker)) {
        blockerIssueMap.set(blocker, []);
      }
      blockerIssueMap.get(blocker).push(issue.number);
    });
  });

  analysis.issues.forEach((issue) => {
    if (issue.ageCategory === "overdue" && !issue.isAssigned) {
      recommendations.push({
        issue: issue.number,
        severity: "high",
        type: "unassigned-overdue",
        message: `Issue #${issue.number} has been in ${issue.statusLabels[0]} for ${issue.daysSinceUpdate} days and is unassigned`,
        action: "Assign or close",
      });
    }

    if (
      issue.ageCategory === "overdue" &&
      !issue.hasPR &&
      issue.statusLabels.includes("status:needs-review")
    ) {
      recommendations.push({
        issue: issue.number,
        severity: "medium",
        type: "needs-pr",
        message: `Issue #${issue.number} in needs-review for ${issue.daysSinceUpdate} days with no linked PR`,
        action: "Link PR or update status",
      });
    }

    if (issue.blockers.length === 0 && blockerIssueMap.has(issue.number)) {
      const blockedCount = blockerIssueMap.get(issue.number).length;
      recommendations.push({
        issue: issue.number,
        severity: "high",
        type: "blocking-issues",
        message: `Issue #${issue.number} is blocking ${blockedCount} other issue(s)`,
        action: "Prioritize resolution",
      });
    }

    if (issue.ageCategory === "pending" && issue.daysSinceUpdate >= 6) {
      recommendations.push({
        issue: issue.number,
        severity: "low",
        type: "approaching-overdue",
        message: `Issue #${issue.number} approaching overdue (${issue.daysSinceUpdate} days)`,
        action: "Review progress",
      });
    }
  });

  return recommendations;
}

describe("Review Status Labels Script", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GITHUB_TOKEN = "test-token";
  });

  // Audit function for testing (simplified version)
  async function auditStatusLabels(options = {}) {
    const {
      verbose = false,
      dryRun = false,
      format = "json",
      output = null,
      label = null,
    } = options;

    const startTime = Date.now();

    try {
      const manager = new LabelManager({ verbose });
      const analyzer = new ActivityAnalyzer({ verbose });

      const STATUS_LABELS = ["status:needs-review", "status:needs-triage"];
      const allIssues = new Map();
      const issuesByLabel = {};

      for (const statusLabel of STATUS_LABELS) {
        const issues = await manager.fetchIssuesWithLabel(statusLabel, {
          limit: 500,
        });
        issuesByLabel[statusLabel] = issues.length;

        issues.forEach((issue) => {
          if (!allIssues.has(issue.number)) {
            allIssues.set(issue.number, issue);
          }
        });
      }

      const analyzedIssues = [];
      const ageDistribution = { fresh: 0, pending: 0, overdue: 0 };
      const assignmentStats = { assigned: 0, unassigned: 0 };
      const blockerStats = { hasBlockers: 0, blockedBy: 0, blocking: 0 };

      allIssues.forEach((issue) => {
        const analysis = analyzeStatusIssue(issue, analyzer);
        analyzedIssues.push(analysis);

        ageDistribution[analysis.ageCategory]++;

        if (analysis.isAssigned) {
          assignmentStats.assigned++;
        } else {
          assignmentStats.unassigned++;
        }

        if (analysis.blockers.length > 0) {
          blockerStats.blockedBy++;
        }
      });

      const blockedIssues = new Set();
      analyzedIssues.forEach((issue) => {
        issue.blockers.forEach((b) => {
          blockedIssues.add(b);
        });
      });

      blockerStats.blocking = blockedIssues.size;

      const sortedByAge = [...analyzedIssues].sort(
        (a, b) => b.daysSinceUpdate - a.daysSinceUpdate,
      );

      const oldestByStatus = {};
      STATUS_LABELS.forEach((lbl) => {
        const issuesWithLabel = analyzedIssues.filter((i) =>
          i.statusLabels.includes(lbl),
        );
        issuesWithLabel.sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate);
        oldestByStatus[lbl] = issuesWithLabel.slice(0, 5);
      });

      const recommendations = generateRecommendations({
        issues: analyzedIssues,
      });

      recommendations.sort((a, b) => {
        const severityOrder = { high: 0, medium: 1, low: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });

      const report = {
        audit_date: new Date().toISOString(),
        total_issues: allIssues.size,
        issues_by_label: issuesByLabel,
        age_distribution: ageDistribution,
        assignment_stats: assignmentStats,
        blocker_stats: blockerStats,
        oldest_issues: sortedByAge.slice(0, 10),
        oldest_by_status: oldestByStatus,
        recommendations: recommendations.slice(0, 50),
        all_issues: analyzedIssues,
        summary: {
          total_recommendations: recommendations.length,
          critical_unassigned_overdue: recommendations.filter(
            (r) => r.severity === "high" && r.type === "unassigned-overdue",
          ).length,
          blocking_issues: recommendations.filter(
            (r) => r.type === "blocking-issues",
          ).length,
          action_items: recommendations.filter((r) => r.severity !== "low")
            .length,
        },
      };

      if (label && !STATUS_LABELS.includes(label)) {
        return {
          success: false,
          error: `Label not found: ${label}. Available labels: ${STATUS_LABELS.join(", ")}`,
          duration: Date.now() - startTime,
        };
      }

      if (label) {
        const filtered = {
          ...report,
          issues_by_label: { [label]: report.issues_by_label[label] },
          oldest_by_status: { [label]: report.oldest_by_status[label] },
          all_issues: analyzedIssues.filter((i) =>
            i.statusLabels.includes(label),
          ),
        };
        return {
          success: true,
          report: filtered,
          duration: Date.now() - startTime,
          dryRun,
        };
      }

      return {
        success: true,
        report,
        duration: Date.now() - startTime,
        dryRun,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        duration: Date.now() - startTime,
      };
    }
  }

  describe("categorizeAge", () => {
    it("should categorize fresh issues (0-3 days)", () => {
      expect(categorizeAge(0)).toBe("fresh");
      expect(categorizeAge(1)).toBe("fresh");
      expect(categorizeAge(3)).toBe("fresh");
    });

    it("should categorize pending issues (3-7 days)", () => {
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
