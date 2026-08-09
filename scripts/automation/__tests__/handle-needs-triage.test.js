/**
 * Unit tests for handle-needs-triage.js
 */

import { describe, it, expect } from "@jest/globals";
import * as handler from "../handlers/handle-needs-triage.js";

describe("handle-needs-triage", () => {
  describe("inferType", () => {
    it("should detect feature type from keywords", () => {
      const issue = {
        title: "Add new dashboard widget",
        body: "Feature request: Users would like a new widget",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("feature");
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it("should detect bug type from keywords", () => {
      const issue = {
        title: "Bug: Login form crashes",
        body: "When I try to login, the form crashes with an error",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("bug");
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it("should detect epic type", () => {
      const issue = {
        title: "Epic: Database migration initiative",
        body: "Large initiative spanning multiple quarters",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("epic");
      expect(result.confidence).toBeGreaterThan(0.4);
    });

    it("should detect story type", () => {
      const issue = {
        title: "As a user, I want to export data",
        body: "So that I can use it in other tools",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("story");
      expect(result.confidence).toBeGreaterThan(0.4);
    });

    it("should detect task type", () => {
      const issue = {
        title: "Task: Refactor authentication module",
        body: "Cleanup and modernize auth code",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("task");
      expect(result.confidence).toBeGreaterThan(0.4);
    });

    it("should detect design type", () => {
      const issue = {
        title: "Design: New UI for dashboard",
        body: "Figma prototype attached",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("design");
      expect(result.confidence).toBeGreaterThan(0.4);
    });

    it("should handle empty body", () => {
      const issue = {
        title: "Add new feature",
        body: null,
      };
      const result = handler.inferType(issue);
      expect(result.type).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
    });

    it("should return scores for all types", () => {
      const issue = {
        title: "Add new feature",
        body: "Implementation details",
      };
      const result = handler.inferType(issue);
      expect(result.scores).toBeDefined();
      expect(Object.keys(result.scores).length).toBeGreaterThan(0);
    });
  });

  describe("inferArea", () => {
    it("should detect CI area", () => {
      const issue = {
        title: "Fix GitHub Actions workflow",
        body: "CI pipeline failing on PRs",
      };
      const result = handler.inferArea(issue);
      expect(result.some((a) => a.area === "area:ci")).toBe(true);
    });

    it("should detect docs area", () => {
      const issue = {
        title: "Update README documentation",
        body: "Add getting started guide",
      };
      const result = handler.inferArea(issue);
      expect(result.some((a) => a.area === "area:docs")).toBe(true);
    });

    it("should detect security area", () => {
      const issue = {
        title: "Security vulnerability in auth",
        body: "Permission bypass in authentication",
      };
      const result = handler.inferArea(issue);
      expect(result.some((a) => a.area === "area:security")).toBe(true);
    });

    it("should detect automation area", () => {
      const issue = {
        title: "Automate label assignment",
        body: "Create workflow for automated tagging",
      };
      const result = handler.inferArea(issue);
      expect(result.some((a) => a.area === "area:automation")).toBe(true);
    });

    it("should detect tests area", () => {
      const issue = {
        title: "Add unit tests for API",
        body: "Improve test coverage",
      };
      const result = handler.inferArea(issue);
      expect(result.some((a) => a.area === "area:tests")).toBe(true);
    });

    it("should detect scripts area", () => {
      const issue = {
        title: "Create migration script",
        body: "Utility for data migration",
      };
      const result = handler.inferArea(issue);
      expect(result.some((a) => a.area === "area:scripts")).toBe(true);
    });

    it("should detect accessibility area", () => {
      const issue = {
        title: "Fix accessibility issues",
        body: "WCAG 2.2 AA compliance improvements needed",
      };
      const result = handler.inferArea(issue);
      expect(result.some((a) => a.area === "area:accessibility")).toBe(true);
    });

    it("should return multiple areas if high confidence", () => {
      const issue = {
        title: "Add automated tests for CI workflow",
        body: "Create GitHub Actions test coverage",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it("should handle empty body", () => {
      const issue = {
        title: "Update README",
        body: null,
      };
      const result = handler.inferArea(issue);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("suggestAssignee", () => {
    it("should suggest assignee for detected area", () => {
      const areas = [{ area: "area:ci", confidence: 0.95 }];
      const result = handler.suggestAssignee(areas);
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should return null for empty areas", () => {
      const result = handler.suggestAssignee([]);
      expect(result).toBeNull();
    });

    it("should return null for null input", () => {
      const result = handler.suggestAssignee(null);
      expect(result).toBeNull();
    });

    it("should prioritize first area", () => {
      const areas = [
        { area: "area:ci", confidence: 0.95 },
        { area: "area:docs", confidence: 0.85 },
      ];
      const result = handler.suggestAssignee(areas);
      expect(result).toBeDefined();
    });
  });

  describe("processIssue", () => {
    const mockIssueNeedsTriaging = {
      number: 123,
      title: "Add new dashboard widget",
      body: "Feature request for better visualisation",
      labels: [],
    };

    const mockIssueAlreadyTriaged = {
      number: 124,
      title: "Some issue",
      body: "Already has labels",
      labels: [{ name: "type:feature" }, { name: "area:ci" }],
    };

    it("should return preview in dry-run mode", async () => {
      const result = await handler.processIssue(mockIssueNeedsTriaging, {
        dryRun: true,
      });
      expect(result.status).toBe("preview");
      expect(result.dryRun).toBe(true);
      expect(result.issueNumber).toBe(123);
      expect(result.typeInference).toBeDefined();
      expect(result.areaInference).toBeDefined();
    });

    it("should suggest labels and assignee in preview mode", async () => {
      const result = await handler.processIssue(mockIssueNeedsTriaging, {
        dryRun: true,
      });
      expect(["preview", "warning"]).toContain(result.status);
      if (result.status === "preview") {
        expect(result.labelsToAdd).toBeDefined();
        expect(Array.isArray(result.labelsToAdd)).toBe(true);
        expect(result.labelsToAdd.length).toBeGreaterThan(0);
      }
    });

    it("should skip already triaged issues", async () => {
      const result = await handler.processIssue(mockIssueAlreadyTriaged, {
        dryRun: true,
      });
      expect(result.status).toBe("skipped");
      expect(result.reason).toContain("already has");
    });

    it("should handle low confidence gracefully", async () => {
      const lowConfidenceIssue = {
        number: 125,
        title: "Some unclear issue",
        body: "Not enough information",
        labels: [],
      };
      const result = await handler.processIssue(lowConfidenceIssue, {
        dryRun: true,
        confidenceThreshold: 0.99,
      });
      expect(["warning", "preview"]).toContain(result.status);
    });

    it("should return error if githubRequest not provided in apply mode", async () => {
      const result = await handler.processIssue(mockIssueNeedsTriaging, {
        dryRun: false,
        confidenceThreshold: 0.5, // Lower threshold to ensure we get past confidence checks
      });
      expect(result.status).toBe("error");
      expect(result.reason).toContain("githubRequest");
    });

    it("should respect confidence threshold", async () => {
      const result = await handler.processIssue(mockIssueNeedsTriaging, {
        dryRun: true,
        confidenceThreshold: 0.85,
      });
      expect(["preview", "warning"]).toContain(result.status);
    });
  });

  describe("processBatch", () => {
    const mockIssues = [
      {
        number: 1,
        title: "Add new feature",
        body: "Feature request",
        labels: [],
      },
      {
        number: 2,
        title: "Fix CI workflow",
        body: "GitHub Actions bug",
        labels: [],
      },
      {
        number: 3,
        title: "Update documentation",
        body: "Add API docs",
        labels: [{ name: "type:feature" }],
      },
    ];

    it("should process multiple issues", async () => {
      const result = await handler.processBatch(mockIssues, { dryRun: true });
      expect(result.results).toHaveLength(3);
      expect(result.stats).toBeDefined();
    });

    it("should track statistics correctly", async () => {
      const result = await handler.processBatch(mockIssues, {
        dryRun: true,
        confidenceThreshold: 0.5,
      });
      expect(result.stats.preview + result.stats.warnings).toBeGreaterThan(0);
      expect(
        result.stats.preview + result.stats.skipped + result.stats.warnings,
      ).toBe(3);
    });

    it("should handle empty batch", async () => {
      const result = await handler.processBatch([], { dryRun: true });
      expect(result.results).toHaveLength(0);
      expect(result.stats.preview).toBe(0);
    });

    it("should count warnings in statistics", async () => {
      const result = await handler.processBatch(mockIssues, {
        dryRun: true,
        confidenceThreshold: 0.99,
      });
      expect(result.stats.warnings + result.stats.preview).toBeLessThanOrEqual(
        3,
      );
    });
  });
});
