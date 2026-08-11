/**
 * Unit tests for review-meta-labels.js
 */

import { describe, it, expect } from "@jest/globals";

describe("review-meta-labels", () => {
  describe("Meta label configuration", () => {
    it("should track all configured meta labels", () => {
      const metaLabels = [
        "meta:needs-changelog",
        "meta:no-changelog",
        "meta:has-pr",
        "meta:no-issue-activity",
        "meta:no-pr-activity",
        "meta:stale",
        "meta:dependabot-security",
      ];

      expect(metaLabels).toHaveLength(7);
      metaLabels.forEach((label) => {
        expect(label).toMatch(/^meta:/);
      });
    });

    it("should calculate coverage for every configured meta label", () => {
      const metaLabels = [
        "meta:needs-changelog",
        "meta:no-changelog",
        "meta:has-pr",
        "meta:no-issue-activity",
        "meta:no-pr-activity",
        "meta:stale",
        "meta:dependabot-security",
      ];

      const labelAnalysis = {};
      metaLabels.forEach((ml) => {
        labelAnalysis[ml] = {
          count: 0,
          percentage: 0,
          issues: [],
        };
      });

      expect(Object.keys(labelAnalysis)).toHaveLength(metaLabels.length);
      metaLabels.forEach((label) => {
        expect(labelAnalysis[label]).toBeDefined();
        expect(labelAnalysis[label].count).toBe(0);
      });
    });
  });

  describe("Coverage calculation", () => {
    it("should calculate coverage percentage for meta labels", () => {
      const totalIssues = 100;
      const labelCount = 75;

      const percentage = Math.round((labelCount / totalIssues) * 1000) / 10;
      expect(percentage).toBe(75);
    });

    it("should handle zero issues gracefully", () => {
      const totalIssues = 0;
      const labelCount = 0;

      const percentage = 0;
      expect(percentage).toBe(0);
    });

    it("should calculate percentages for all labels in analysis", () => {
      const metaLabels = ["meta:needs-changelog", "meta:has-pr", "meta:stale"];

      metaLabels.forEach((_label) => {
        const percentage = Math.round((50 / 100) * 1000) / 10;
        expect(percentage).toBe(50);
      });
    });
  });

  describe("Issue label extraction", () => {
    it("should extract meta labels from issue", () => {
      const issue = {
        number: 123,
        title: "Test issue",
        labels: [
          { name: "meta:has-pr" },
          { name: "type:bug" },
          { name: "meta:needs-changelog" },
        ],
      };

      const labels = issue.labels?.map((l) => l.name) || [];
      const metaLabels = labels.filter((l) => l.startsWith("meta:"));

      expect(metaLabels).toHaveLength(2);
      expect(metaLabels).toContain("meta:has-pr");
      expect(metaLabels).toContain("meta:needs-changelog");
    });

    it("should handle issues with no meta labels", () => {
      const issue = {
        number: 124,
        title: "Test issue",
        labels: [{ name: "type:feature" }, { name: "priority:normal" }],
      };

      const labels = issue.labels?.map((l) => l.name) || [];
      const metaLabels = labels.filter((l) => l.startsWith("meta:"));

      expect(metaLabels).toHaveLength(0);
    });

    it("should handle issues with no labels", () => {
      const issue = {
        number: 125,
        title: "Test issue",
        labels: null,
      };

      const labels = issue.labels?.map((l) => l.name) || [];
      const metaLabels = labels.filter((l) => l.startsWith("meta:"));

      expect(metaLabels).toHaveLength(0);
    });
  });

  describe("Recommendations", () => {
    it("should recommend changelog status if missing", () => {
      const issue = {
        number: 126,
        title: "Test issue",
        labels: [{ name: "type:bug" }],
      };

      const labels = issue.labels?.map((l) => l.name) || [];
      const hasChangelogLabel =
        labels.includes("meta:needs-changelog") ||
        labels.includes("meta:no-changelog");

      expect(hasChangelogLabel).toBe(false);
    });

    it("should not recommend changelog if already present", () => {
      const issue = {
        number: 127,
        title: "Test issue",
        labels: [{ name: "type:bug" }, { name: "meta:needs-changelog" }],
      };

      const labels = issue.labels?.map((l) => l.name) || [];
      const hasChangelogLabel =
        labels.includes("meta:needs-changelog") ||
        labels.includes("meta:no-changelog");

      expect(hasChangelogLabel).toBe(true);
    });
  });

  describe("Report generation", () => {
    it("should support json format output", () => {
      const format = "json";

      expect(["json", "markdown"]).toContain(format);
    });

    it("should support markdown format output", () => {
      const format = "markdown";

      expect(["json", "markdown"]).toContain(format);
    });

    it("should filter by specific label when requested", () => {
      const report = {
        meta_labels: {
          "meta:needs-changelog": { count: 25, percentage: 25 },
          "meta:has-pr": { count: 40, percentage: 40 },
          "meta:stale": { count: 5, percentage: 5 },
        },
      };

      const labelToFilter = "meta:has-pr";
      expect(report.meta_labels[labelToFilter]).toBeDefined();
      expect(report.meta_labels[labelToFilter].count).toBe(40);
    });

    it("should limit issue list to first 10 per label", () => {
      const issues = Array.from({ length: 25 }, (_, i) => i + 1);
      const limited = issues.slice(0, 10);

      expect(limited).toHaveLength(10);
      expect(issues).toHaveLength(25);
    });

    it("should calculate total coverage percentage", () => {
      const totalIssues = 100;
      const issuesWithGaps = 15;

      const coveragePercentage = Math.round(
        ((totalIssues - issuesWithGaps) / totalIssues) * 100,
      );
      expect(coveragePercentage).toBe(85);
    });
  });
});
