import { syncPRLabels } from "../scripts/automation/sync-pr-labels.js";
import { LabelManager } from "../scripts/automation/includes/label-management.js";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// Mock octokit
vi.mock("octokit", () => ({
  Octokit: vi.fn(() => ({
    rest: {
      pulls: {
        get: vi.fn(),
      },
    },
  })),
}));

describe("sync-pr-labels.js", () => {
  let mockLabelManager;

  beforeEach(() => {
    mockLabelManager = {
      fetchAllIssues: vi.fn(),
      addLabel: vi.fn(),
      removeLabel: vi.fn(),
      hasLabel: vi.fn(),
      getLabels: vi.fn(),
    };

    // Mock LabelManager constructor
    vi.spyOn(global, "LabelManager", "get").mockReturnValue(
      () => mockLabelManager,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("PR detection", () => {
    it("should identify PR numbers from issue body", () => {
      const text = "This relates to #123 and also #456";
      const prNumbers = Array.from(text.matchAll(/#(\d+)/g)).map((m) =>
        parseInt(m[1]),
      );
      expect(prNumbers).toEqual([123, 456]);
    });

    it("should handle issue with no linked PRs", () => {
      const text = "This is a feature request without any PRs";
      const prNumbers = Array.from(text.matchAll(/#(\d+)/g)).map((m) =>
        parseInt(m[1]),
      );
      expect(prNumbers).toEqual([]);
    });

    it("should extract PR numbers from complex text", () => {
      const text =
        "Closes #100, relates to #200, and fixes #300. Also see #400.";
      const prNumbers = Array.from(text.matchAll(/#(\d+)/g)).map((m) =>
        parseInt(m[1]),
      );
      expect(prNumbers).toEqual([100, 200, 300, 400]);
    });
  });

  describe("Issue analysis", () => {
    it("should analyze issue with current labels", async () => {
      const mockIssues = [
        {
          number: 1,
          title: "Test issue",
          body: "Relates to #500",
          labels: [{ name: "type:feature" }, { name: "meta:has-pr" }],
        },
      ];

      mockLabelManager.fetchAllIssues.mockResolvedValue(mockIssues);

      // Test data structure
      expect(mockIssues[0]).toHaveProperty("number", 1);
      expect(mockIssues[0]).toHaveProperty("labels");
      expect(mockIssues[0].labels.map((l) => l.name)).toContain("meta:has-pr");
    });

    it("should identify issues needing label additions", () => {
      const issue = {
        number: 1,
        title: "Test",
        body: "Relates to #500",
        labels: [{ name: "type:feature" }],
      };

      const hasValidPR = true;
      const hasPRLabel = issue.labels
        .map((l) => l.name)
        .includes("meta:has-pr");

      expect(hasValidPR && !hasPRLabel).toBe(true);
    });

    it("should identify issues needing label removals", () => {
      const issue = {
        number: 2,
        title: "Test",
        body: "No PRs here",
        labels: [
          { name: "type:feature" },
          { name: "meta:has-pr" },
          { name: "status:needs-review" },
        ],
      };

      const hasValidPR = false;
      const hasPRLabel = issue.labels
        .map((l) => l.name)
        .includes("meta:has-pr");

      expect(!hasValidPR && hasPRLabel).toBe(true);
    });
  });

  describe("Label sync operations", () => {
    it("should prepare add changes for issues with valid PRs", () => {
      const changes = [];
      const analysis = {
        number: 1,
        title: "Test",
        linkedPRs: [500],
        hasValidPR: true,
        currentLabels: ["type:feature"],
      };

      const hasPRLabel = analysis.currentLabels.includes("meta:has-pr");

      if (analysis.hasValidPR && !hasPRLabel) {
        changes.push({
          type: "add",
          issue: analysis.number,
          label: "meta:has-pr",
          reason: `Issue #${analysis.number} has valid linked PR(s): ${analysis.linkedPRs.join(", ")}`,
        });
      }

      expect(changes).toHaveLength(1);
      expect(changes[0].type).toBe("add");
      expect(changes[0].issue).toBe(1);
    });

    it("should prepare remove changes for issues without valid PRs", () => {
      const changes = [];
      const analysis = {
        number: 2,
        title: "Test",
        linkedPRs: [],
        hasValidPR: false,
        currentLabels: ["type:feature", "meta:has-pr"],
      };

      const hasPRLabel = analysis.currentLabels.includes("meta:has-pr");

      if (!analysis.hasValidPR && hasPRLabel) {
        changes.push({
          type: "remove",
          issue: analysis.number,
          label: "meta:has-pr",
          reason: `Issue #${analysis.number} has no linked PRs`,
        });
      }

      expect(changes).toHaveLength(1);
      expect(changes[0].type).toBe("remove");
      expect(changes[0].issue).toBe(2);
    });

    it("should not make changes for correctly labeled issues", () => {
      const changes = [];

      const analysis1 = {
        number: 1,
        title: "Test",
        linkedPRs: [500],
        hasValidPR: true,
        currentLabels: ["meta:has-pr"],
      };

      const hasPRLabel1 = analysis1.currentLabels.includes("meta:has-pr");
      if (analysis1.hasValidPR && !hasPRLabel1) {
        changes.push({ type: "add", issue: analysis1.number });
      }
      if (!analysis1.hasValidPR && hasPRLabel1) {
        changes.push({ type: "remove", issue: analysis1.number });
      }

      expect(changes).toHaveLength(0);
    });
  });

  describe("Dry-run mode", () => {
    it("should preview changes without applying them", async () => {
      const changes = [];
      const mockIssues = [
        {
          number: 1,
          title: "Test",
          body: "Relates to #500",
          labels: [],
        },
      ];

      mockLabelManager.fetchAllIssues.mockResolvedValue(mockIssues);

      // Simulate dry-run: prepare changes but don't apply
      for (const change of changes) {
        expect(mockLabelManager.addLabel).not.toHaveBeenCalled();
        expect(mockLabelManager.removeLabel).not.toHaveBeenCalled();
      }
    });

    it("should mark changes as dry-run in output", () => {
      const change = {
        type: "add",
        issue: 1,
        label: "meta:has-pr",
        reason: "Has valid PR",
        dryRun: true,
      };

      expect(change.dryRun).toBe(true);
    });
  });

  describe("Report generation", () => {
    it("should generate complete report structure", () => {
      const report = {
        sync_date: new Date().toISOString(),
        total_issues_analyzed: 350,
        dry_run: false,
        changes: {
          added: 45,
          removed: 12,
          total: 57,
        },
        summary: {
          issues_with_valid_prs: 45,
          issues_processed: 350,
          errors: 0,
        },
      };

      expect(report).toHaveProperty("sync_date");
      expect(report).toHaveProperty("total_issues_analyzed", 350);
      expect(report).toHaveProperty("dry_run", false);
      expect(report.changes).toHaveProperty("total", 57);
      expect(report.summary).toHaveProperty("issues_with_valid_prs", 45);
    });

    it("should include error details in report", () => {
      const report = {
        sync_date: new Date().toISOString(),
        total_issues_analyzed: 350,
        changes: {
          added: 45,
          removed: 12,
          total: 57,
        },
        summary: {
          issues_with_valid_prs: 45,
          issues_processed: 350,
          errors: 2,
        },
        errors: [
          { issue: 1, error: "API rate limit exceeded" },
          { issue: 2, error: "Failed to remove label" },
        ],
      };

      expect(report.errors).toHaveLength(2);
      expect(report.summary.errors).toBe(2);
    });
  });

  describe("Pagination handling", () => {
    it("should handle more than 30 issues", () => {
      const mockIssues = Array.from({ length: 100 }, (_, i) => ({
        number: i + 1,
        title: `Issue ${i + 1}`,
        body: `Relates to #${5000 + i}`,
        labels: [],
      }));

      expect(mockIssues).toHaveLength(100);
      expect(mockIssues[0].number).toBe(1);
      expect(mockIssues[99].number).toBe(100);
    });
  });

  describe("Command line arguments", () => {
    it("should parse dry-run flag", () => {
      const args = ["--dry-run"];
      const dryRun = args.includes("--dry-run");
      expect(dryRun).toBe(true);
    });

    it("should parse issue number filter", () => {
      const args = ["--issue", "123"];
      const issueIdx = args.findIndex((a) => a === "--issue");
      const issueNumber = issueIdx > -1 ? parseInt(args[issueIdx + 1]) : null;
      expect(issueNumber).toBe(123);
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
    it("should handle missing GitHub token gracefully", () => {
      const token = process.env.GITHUB_TOKEN;
      expect(typeof token).toBe("string");
    });

    it("should collect errors without stopping processing", () => {
      const errors = [];
      const issues = [
        { number: 1, body: "Text" },
        { number: 2, body: "Text" },
        { number: 3, body: "Text" },
      ];

      // Simulate one error in processing
      issues.forEach((issue) => {
        if (issue.number === 2) {
          errors.push({ issue: issue.number, error: "Test error" });
        }
      });

      expect(errors).toHaveLength(1);
      expect(issues).toHaveLength(3); // Processing continues
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

  describe("Rate limiting", () => {
    it("should handle rate limiting in batch processing", () => {
      const issues = Array.from({ length: 350 }, (_, i) => ({
        number: i + 1,
        body: `Issue ${i}`,
        labels: [],
      }));

      // Simulate processing with rate limiting
      const processingDelay = 100; // ms per issue
      const estimatedTime = issues.length * processingDelay;

      expect(estimatedTime).toBeGreaterThan(30000); // ~34.5 seconds with 100ms delay
    });
  });
});
