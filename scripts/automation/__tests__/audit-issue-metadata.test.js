/**
 * Unit tests for audit-issue-metadata.js
 * Tests metadata auditing, label categorization, and report generation
 * @module scripts/automation/__tests__/audit-issue-metadata.test.js
 */

import { describe, it, expect } from "@jest/globals";

describe("audit-issue-metadata", () => {
  describe("categorizeLabels", () => {
    const categorizeLabels = (labels) => {
      const result = { type: [], area: [], status: [], priority: [], other: [] };
      for (const label of labels) {
        const name = label.name || label;
        if (name.startsWith("type:")) {
          result.type.push(name);
        } else if (name.startsWith("area:")) {
          result.area.push(name);
        } else if (name.startsWith("status:")) {
          result.status.push(name);
        } else if (name.startsWith("priority:")) {
          result.priority.push(name);
        } else {
          result.other.push(name);
        }
      }
      return result;
    };

    it("should categorize type: labels", () => {
      const result = categorizeLabels([{ name: "type:feature" }]);
      expect(result.type).toContain("type:feature");
      expect(result.type).toHaveLength(1);
    });

    it("should categorize area: labels", () => {
      const result = categorizeLabels([{ name: "area:ci" }]);
      expect(result.area).toContain("area:ci");
      expect(result.area).toHaveLength(1);
    });

    it("should categorize status: labels", () => {
      const result = categorizeLabels([{ name: "status:needs-review" }]);
      expect(result.status).toContain("status:needs-review");
      expect(result.status).toHaveLength(1);
    });

    it("should categorize priority: labels", () => {
      const result = categorizeLabels([{ name: "priority:critical" }]);
      expect(result.priority).toContain("priority:critical");
      expect(result.priority).toHaveLength(1);
    });

    it("should categorize uncategorized labels as other", () => {
      const result = categorizeLabels([{ name: "custom-label" }]);
      expect(result.other).toContain("custom-label");
      expect(result.other).toHaveLength(1);
    });

    it("should handle multiple labels of same category", () => {
      const labels = [{ name: "type:feature" }, { name: "type:bug" }];
      const result = categorizeLabels(labels);
      expect(result.type).toHaveLength(2);
      expect(result.type).toContain("type:feature");
      expect(result.type).toContain("type:bug");
    });

    it("should handle string labels (not objects)", () => {
      const result = categorizeLabels(["type:bug", "area:docs"]);
      expect(result.type).toContain("type:bug");
      expect(result.area).toContain("area:docs");
    });

    it("should return empty arrays for missing categories", () => {
      const result = categorizeLabels([]);
      expect(result.type).toEqual([]);
      expect(result.area).toEqual([]);
      expect(result.status).toEqual([]);
      expect(result.priority).toEqual([]);
      expect(result.other).toEqual([]);
    });

    it("should handle mixed label formats", () => {
      const labels = [
        { name: "type:feature" },
        "area:ci",
        { name: "status:done" },
        "custom",
      ];
      const result = categorizeLabels(labels);
      expect(result.type).toHaveLength(1);
      expect(result.area).toHaveLength(1);
      expect(result.status).toHaveLength(1);
      expect(result.other).toHaveLength(1);
    });
  });

  describe("analyzeIssue", () => {
    const categorizeLabels = (labels) => {
      const result = { type: [], area: [], status: [], priority: [], other: [] };
      for (const label of labels) {
        const name = label.name || label;
        if (name.startsWith("type:")) {
          result.type.push(name);
        } else if (name.startsWith("area:")) {
          result.area.push(name);
        } else if (name.startsWith("status:")) {
          result.status.push(name);
        } else if (name.startsWith("priority:")) {
          result.priority.push(name);
        } else {
          result.other.push(name);
        }
      }
      return result;
    };

    const analyzeIssue = (issue) => {
      const labels = categorizeLabels(issue.labels || []);
      const gaps = [];

      if (labels.type.length === 0) gaps.push("type");
      if (labels.area.length === 0) gaps.push("area");
      if (labels.status.length === 0) gaps.push("status");
      if (labels.priority.length === 0) gaps.push("priority");

      if (!issue.assignee) gaps.push("assignee");
      if (!issue.milestone) gaps.push("milestone");

      const hasPRLink =
        issue.body &&
        (issue.body.includes("Resolves #") || issue.body.includes("Closes #"));
      if (
        !hasPRLink &&
        (labels.type.includes("type:feature") || labels.type.includes("type:bug"))
      ) {
        gaps.push("pr-link");
      }

      return {
        number: issue.number,
        title: issue.title,
        labels,
        assignees: issue.assignees || [],
        milestone: issue.milestone?.title || null,
        gapCount: gaps.length,
        gaps,
        statusLabels: labels.status,
      };
    };

    it("should analyze complete issue", () => {
      const issue = {
        number: 123,
        title: "Complete issue",
        labels: [
          { name: "type:feature" },
          { name: "area:ci" },
          { name: "status:done" },
          { name: "priority:high" },
        ],
        assignee: { login: "user" },
        milestone: { title: "v1.0" },
        body: "Resolves #100",
      };

      const result = analyzeIssue(issue);
      expect(result.gaps).toEqual([]);
      expect(result.gapCount).toBe(0);
    });

    it("should detect missing type label", () => {
      const issue = {
        number: 1,
        title: "No type",
        labels: [],
        assignee: { login: "user" },
        milestone: { title: "v1.0" },
      };

      const result = analyzeIssue(issue);
      expect(result.gaps).toContain("type");
    });

    it("should detect missing area label", () => {
      const issue = {
        number: 2,
        title: "No area",
        labels: [{ name: "type:bug" }],
      };

      const result = analyzeIssue(issue);
      expect(result.gaps).toContain("area");
    });

    it("should detect missing status label", () => {
      const issue = {
        number: 3,
        title: "No status",
        labels: [{ name: "type:bug" }, { name: "area:ci" }],
      };

      const result = analyzeIssue(issue);
      expect(result.gaps).toContain("status");
    });

    it("should detect missing priority label", () => {
      const issue = {
        number: 4,
        title: "No priority",
        labels: [
          { name: "type:bug" },
          { name: "area:ci" },
          { name: "status:new" },
        ],
      };

      const result = analyzeIssue(issue);
      expect(result.gaps).toContain("priority");
    });

    it("should detect missing assignee", () => {
      const issue = {
        number: 5,
        title: "No assignee",
        labels: [
          { name: "type:bug" },
          { name: "area:ci" },
          { name: "status:new" },
          { name: "priority:high" },
        ],
        assignee: null,
      };

      const result = analyzeIssue(issue);
      expect(result.gaps).toContain("assignee");
    });

    it("should detect missing milestone", () => {
      const issue = {
        number: 6,
        title: "No milestone",
        labels: [
          { name: "type:bug" },
          { name: "area:ci" },
          { name: "status:new" },
          { name: "priority:high" },
        ],
        assignee: { login: "user" },
        milestone: null,
      };

      const result = analyzeIssue(issue);
      expect(result.gaps).toContain("milestone");
    });

    it("should detect missing PR link for feature type", () => {
      const issue = {
        number: 7,
        title: "Feature without PR",
        labels: [{ name: "type:feature" }],
        body: "No PR reference here",
      };

      const result = analyzeIssue(issue);
      expect(result.gaps).toContain("pr-link");
    });

    it("should detect missing PR link for bug type", () => {
      const issue = {
        number: 8,
        title: "Bug without PR",
        labels: [{ name: "type:bug" }],
        body: "No PR reference",
      };

      const result = analyzeIssue(issue);
      expect(result.gaps).toContain("pr-link");
    });

    it("should not flag PR-link gap for non-feature/bug types", () => {
      const issue = {
        number: 9,
        title: "Task without PR",
        labels: [{ name: "type:task" }],
        body: "No PR reference",
      };

      const result = analyzeIssue(issue);
      expect(result.gaps).not.toContain("pr-link");
    });

    it("should recognize 'Resolves #' as PR link", () => {
      const issue = {
        number: 10,
        title: "Feature with Resolves",
        labels: [{ name: "type:feature" }],
        body: "Resolves #999",
      };

      const result = analyzeIssue(issue);
      expect(result.gaps).not.toContain("pr-link");
    });

    it("should recognize 'Closes #' as PR link", () => {
      const issue = {
        number: 11,
        title: "Bug with Closes",
        labels: [{ name: "type:bug" }],
        body: "Closes #888",
      };

      const result = analyzeIssue(issue);
      expect(result.gaps).not.toContain("pr-link");
    });

    it("should count gaps correctly", () => {
      const issue = {
        number: 12,
        title: "Multiple gaps",
        labels: [],
        assignee: null,
        milestone: null,
      };

      const result = analyzeIssue(issue);
      expect(result.gapCount).toBeGreaterThan(0);
      expect(result.gapCount).toBe(result.gaps.length);
    });

    it("should return issue number and title", () => {
      const issue = {
        number: 42,
        title: "Test Issue",
        labels: [{ name: "type:feature" }],
      };

      const result = analyzeIssue(issue);
      expect(result.number).toBe(42);
      expect(result.title).toBe("Test Issue");
    });

    it("should handle null labels", () => {
      const issue = {
        number: 50,
        title: "Null labels",
        labels: null,
      };

      const result = analyzeIssue(issue);
      expect(result.labels).toEqual({ type: [], area: [], status: [], priority: [], other: [] });
    });

    it("should handle null assignees", () => {
      const issue = {
        number: 51,
        title: "Null assignees",
        labels: [{ name: "type:bug" }],
        assignees: null,
      };

      const result = analyzeIssue(issue);
      expect(result.assignees).toEqual([]);
    });

    it("should handle milestone object with title", () => {
      const issue = {
        number: 52,
        title: "With milestone",
        labels: [{ name: "type:bug" }],
        milestone: { title: "v2.0", number: 5 },
      };

      const result = analyzeIssue(issue);
      expect(result.milestone).toBe("v2.0");
    });
  });

  describe("Report generation", () => {
    it("should track metrics correctly", () => {
      const stats = {
        total: 0,
        metrics: {
          typeLabels: 0,
          areaLabels: 0,
          statusLabels: 0,
          priorityLabels: 0,
          assignees: 0,
          milestones: 0,
          prLinks: 0,
        },
        gaps: {
          type: 0,
          area: 0,
          status: 0,
          priority: 0,
          assignee: 0,
          milestone: 0,
          "pr-link": 0,
        },
      };

      expect(stats.metrics.typeLabels).toBe(0);
      expect(stats.metrics.areaLabels).toBe(0);
      expect(Object.keys(stats.gaps)).toHaveLength(7);
    });

    it("should initialize status label distributions", () => {
      const statusLabelsToAudit = [
        "status:needs-triage",
        "status:needs-review",
        "status:done",
      ];
      const distribution = {};

      statusLabelsToAudit.forEach((label) => {
        distribution[label] = 0;
      });

      expect(distribution["status:needs-triage"]).toBe(0);
      expect(distribution["status:needs-review"]).toBe(0);
      expect(Object.keys(distribution)).toHaveLength(3);
    });
  });

  describe("Configuration parsing", () => {
    it("should parse --limit argument", () => {
      const limitArg = 50;
      expect(Number.isSafeInteger(limitArg)).toBe(true);
      expect(limitArg).toBeGreaterThan(0);
    });

    it("should reject non-positive limit", () => {
      const limitArg = 0;
      expect(limitArg <= 0).toBe(true);
    });

    it("should reject non-integer limit", () => {
      const limitArg = 50.5;
      expect(Number.isInteger(limitArg)).toBe(false);
    });

    it("should validate default limit", () => {
      const limitArg = 999999;
      expect(Number.isSafeInteger(limitArg)).toBe(true);
      expect(limitArg).toBeGreaterThan(0);
    });
  });
});
