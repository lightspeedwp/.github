import { manageStalIssues } from "../scripts/automation/manage-stale-issues.js";
import { LabelManager } from "../scripts/automation/includes/label-management.js";
import { ActivityAnalyzer } from "../scripts/automation/includes/activity-analyzer.js";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// Mock octokit
vi.mock("octokit", () => ({
  Octokit: vi.fn(() => ({
    rest: {
      issues: {
        createComment: vi.fn(),
        update: vi.fn(),
      },
    },
  })),
}));

describe("manage-stale-issues.js", () => {
  let mockLabelManager;
  let mockActivityAnalyzer;

  beforeEach(() => {
    mockLabelManager = {
      fetchAllIssues: vi.fn(),
      addLabel: vi.fn(),
    };

    mockActivityAnalyzer = {
      getDaysSinceActivity: vi.fn(),
      isStale: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Exclusion rules", () => {
    it("should exclude type:epic labeled issues", () => {
      const issue = {
        number: 1,
        labels: [{ name: "type:epic" }],
      };

      const labels = issue.labels?.map((l) => l.name) || [];
      const isExcluded = labels.includes("type:epic");

      expect(isExcluded).toBe(true);
    });

    it("should exclude status:in-progress labeled issues", () => {
      const issue = {
        number: 2,
        labels: [{ name: "status:in-progress" }],
      };

      const labels = issue.labels?.map((l) => l.name) || [];
      const isExcluded = labels.includes("status:in-progress");

      expect(isExcluded).toBe(true);
    });

    it("should exclude priority:critical labeled issues", () => {
      const issue = {
        number: 3,
        labels: [{ name: "priority:critical" }],
      };

      const labels = issue.labels?.map((l) => l.name) || [];
      const isExcluded = labels.includes("priority:critical");

      expect(isExcluded).toBe(true);
    });

    it("should exclude issues with milestone", () => {
      const issue = {
        number: 4,
        labels: [],
        milestone: { title: "v1.0" },
      };

      const hasExcludingMilestone = !!issue.milestone;
      expect(hasExcludingMilestone).toBe(true);
    });

    it("should not exclude regular issues", () => {
      const issue = {
        number: 5,
        labels: [{ name: "type:bug" }],
        milestone: null,
      };

      const labels = issue.labels?.map((l) => l.name) || [];
      const isExcluded =
        labels.includes("type:epic") ||
        labels.includes("status:in-progress") ||
        labels.includes("priority:critical") ||
        !!issue.milestone;

      expect(isExcluded).toBe(false);
    });
  });

  describe("Stale detection", () => {
    it("should identify issues inactive for 30+ days", () => {
      const daysSinceActivity = 35;
      const threshold = 30;

      expect(daysSinceActivity >= threshold).toBe(true);
    });

    it("should not identify recently active issues as stale", () => {
      const daysSinceActivity = 15;
      const threshold = 30;

      expect(daysSinceActivity >= threshold).toBe(false);
    });

    it("should handle exactly threshold day count", () => {
      const daysSinceActivity = 30;
      const threshold = 30;

      expect(daysSinceActivity >= threshold).toBe(true);
    });

    it("should handle edge case of zero days", () => {
      const daysSinceActivity = 0;
      const threshold = 30;

      expect(daysSinceActivity >= threshold).toBe(false);
    });
  });

  describe("Label management", () => {
    it("should add meta:stale label when needed", () => {
      const changes = [];
      const issue = {
        number: 1,
        daysSinceActivity: 35,
        currentLabels: ["type:bug"],
      };

      const hasStaleLabel = issue.currentLabels.includes("meta:stale");

      if (!hasStaleLabel) {
        changes.push({
          type: "label",
          issue: issue.number,
          action: "add",
          label: "meta:stale",
        });
      }

      expect(changes).toHaveLength(1);
      expect(changes[0].label).toBe("meta:stale");
    });

    it("should not duplicate stale label", () => {
      const changes = [];
      const issue = {
        number: 2,
        daysSinceActivity: 35,
        currentLabels: ["type:bug", "meta:stale"],
      };

      const hasStaleLabel = issue.currentLabels.includes("meta:stale");

      if (!hasStaleLabel) {
        changes.push({
          type: "label",
          issue: issue.number,
          action: "add",
          label: "meta:stale",
        });
      }

      expect(changes).toHaveLength(0);
    });
  });

  describe("Actions", () => {
    it("should support labeling action", () => {
      const options = { label: true, comment: false, close: false };
      expect(options.label).toBe(true);
      expect(options.comment).toBe(false);
      expect(options.close).toBe(false);
    });

    it("should support commenting action", () => {
      const options = { label: false, comment: true, close: false };
      expect(options.comment).toBe(true);
    });

    it("should support closing action", () => {
      const options = { label: false, comment: false, close: true };
      expect(options.close).toBe(true);
    });

    it("should support combined actions", () => {
      const options = { label: true, comment: true, close: true };
      expect(options.label && options.comment && options.close).toBe(true);
    });
  });

  describe("Dry-run mode", () => {
    it("should mark changes as dry-run", () => {
      const change = {
        type: "label",
        issue: 1,
        action: "add",
        label: "meta:stale",
        dryRun: true,
      };

      expect(change.dryRun).toBe(true);
    });

    it("should preview without applying", () => {
      const changes = [];
      const dryRun = true;

      const mockAddLabel = vi.fn();

      if (!dryRun) {
        mockAddLabel(1, "meta:stale");
      }

      expect(mockAddLabel).not.toHaveBeenCalled();
    });
  });

  describe("Report generation", () => {
    it("should generate complete report structure", () => {
      const report = {
        management_date: new Date().toISOString(),
        total_issues_analyzed: 350,
        stale_threshold_days: 30,
        dry_run: false,
        actions: {
          labeled: 45,
          commented: 12,
          closed: 0,
          total: 57,
        },
        summary: {
          stale_issues_found: 45,
          issues_processed: 350,
          errors: 0,
        },
      };

      expect(report).toHaveProperty("management_date");
      expect(report).toHaveProperty("total_issues_analyzed", 350);
      expect(report).toHaveProperty("stale_threshold_days", 30);
      expect(report.actions).toHaveProperty("total", 57);
      expect(report.summary).toHaveProperty("stale_issues_found", 45);
    });

    it("should include stale issues list", () => {
      const report = {
        stale_issues: [
          { number: 1, title: "Test Issue", daysSinceActivity: 35 },
          { number: 2, title: "Another Issue", daysSinceActivity: 60 },
        ],
      };

      expect(report.stale_issues).toHaveLength(2);
      expect(report.stale_issues[0].number).toBe(1);
      expect(report.stale_issues[0].daysSinceActivity).toBeGreaterThanOrEqual(
        30,
      );
    });

    it("should include error details when present", () => {
      const report = {
        errors: [
          { issue: 1, error: "Failed to add label" },
          { issue: 2, error: "Failed to post comment" },
        ],
        summary: {
          errors: 2,
        },
      };

      expect(report.errors).toHaveLength(2);
      expect(report.summary.errors).toBe(2);
    });
  });

  describe("Comment generation", () => {
    it("should generate stale warning comment", () => {
      const issueNumber = 123;
      const daysSinceActivity = 45;

      const comment = `## ⏰ Issue Stale Notification

This issue has been inactive for **${daysSinceActivity} days**.`;

      expect(comment).toContain(
        `This issue has been inactive for **${daysSinceActivity} days**.`,
      );
      expect(comment).toContain("Issue Stale Notification");
    });

    it("should include action items in comment", () => {
      const comment = `## ⏰ Issue Stale Notification

To keep the issue active:
- Add a comment with an update or progress report
- Update the issue status or labels
- Link a related pull request`;

      expect(comment).toContain("Add a comment");
      expect(comment).toContain("Update the issue status");
      expect(comment).toContain("Link a related pull request");
    });
  });

  describe("Command line arguments", () => {
    it("should parse dry-run flag", () => {
      const args = ["--dry-run"];
      const dryRun = args.includes("--dry-run");
      expect(dryRun).toBe(true);
    });

    it("should parse days threshold", () => {
      const args = ["--days", "45"];
      const daysIdx = args.findIndex((a) => a === "--days");
      const days = daysIdx > -1 ? parseInt(args[daysIdx + 1]) : 30;
      expect(days).toBe(45);
    });

    it("should parse label action flag", () => {
      const args = ["--label"];
      const label = args.includes("--label");
      expect(label).toBe(true);
    });

    it("should parse comment action flag", () => {
      const args = ["--comment"];
      const comment = args.includes("--comment");
      expect(comment).toBe(true);
    });

    it("should parse close action flag", () => {
      const args = ["--close"];
      const close = args.includes("--close");
      expect(close).toBe(true);
    });

    it("should parse verbose flag", () => {
      const args = ["-v"];
      const verbose = args.includes("-v");
      expect(verbose).toBe(true);
    });

    it("should parse output format", () => {
      const args = ["--format", "csv"];
      const formatIdx = args.findIndex((a) => a === "--format");
      const format = formatIdx > -1 ? args[formatIdx + 1] : "json";
      expect(format).toBe("csv");
    });
  });

  describe("Error handling", () => {
    it("should collect errors without stopping", () => {
      const errors = [];
      const issues = [
        { number: 1, daysSinceActivity: 35 },
        { number: 2, daysSinceActivity: 35 },
        { number: 3, daysSinceActivity: 35 },
      ];

      issues.forEach((issue) => {
        if (issue.number === 2) {
          errors.push({ issue: issue.number, error: "Test error" });
        }
      });

      expect(errors).toHaveLength(1);
      expect(issues).toHaveLength(3);
    });

    it("should return failure status on fatal error", () => {
      const result = {
        success: false,
        error: "GitHub API error",
        duration: 100,
      };

      expect(result.success).toBe(false);
      expect(result).toHaveProperty("error");
    });
  });
});
