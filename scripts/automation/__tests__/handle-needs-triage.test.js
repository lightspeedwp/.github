/**
 * Unit tests for handle-needs-triage.js
 */

import { describe, it, expect } from "@jest/globals";
import * as handler from "../handlers/handle-needs-triage.js";

describe("handle-needs-triage", () => {
  describe("inferType", () => {
    it("should detect feature type from keywords", () => {
      const issue = {
        title: "Add support for new export format",
        body: "Users should be able to export in CSV format",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("feature");
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it("should detect bug type from error keywords", () => {
      const issue = {
        title: "Critical: Search functionality is broken",
        body: "When I search, the app crashes with an error message",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("bug");
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it("should detect epic type from scope keywords", () => {
      const issue = {
        title: "Epic: Complete platform migration initiative",
        body: "Long-term strategic initiative with multiple phases",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("epic");
      expect(result.confidence).toBeGreaterThan(0.3);
    });

    it("should detect task type from cleanup keywords", () => {
      const issue = {
        title: "Refactor authentication module",
        body: "Clean up technical debt in auth system",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("task");
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it("should return lowest confidence type for completely generic content", () => {
      const issue = {
        title: "Something",
        body: "TODO",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBeDefined();
      expect(result.confidence).toBeLessThan(0.3);
    });

    it("should prioritize bug type when error keywords present", () => {
      const issue = {
        title: "[bug] Login form not working",
        body: "When I try to log in, nothing happens",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("bug");
      expect(result.confidence).toBeGreaterThan(0.5);
    });
  });

  describe("inferArea", () => {
    it("should detect ci area from workflow keywords", () => {
      const issue = {
        title: "GitHub Actions workflow failing",
        body: "The CI pipeline needs fixing",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].area).toBe("area:ci");
      expect(result[0].confidence).toBeGreaterThan(0.6);
    });

    it("should detect docs area", () => {
      const issue = {
        title: "Update README",
        body: "The documentation needs updating in docs/ folder",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].area).toBe("area:docs");
      expect(result[0].confidence).toBeGreaterThan(0.6);
    });

    it("should detect security area", () => {
      const issue = {
        title: "Security vulnerability in authentication",
        body: "Found an XSS vulnerability that needs patching",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].area).toBe("area:security");
      expect(result[0].confidence).toBeGreaterThan(0.6);
    });

    it("should detect automation area from script keywords", () => {
      const issue = {
        title: "Automate issue triage",
        body: "Create a script to batch process issues",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].area).toBe("area:automation");
      expect(result[0].confidence).toBeGreaterThan(0.6);
    });

    it("should detect accessibility area from a11y keywords", () => {
      const issue = {
        title: "Improve WCAG compliance",
        body: "Need to improve a11y accessibility standards",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].area).toBe("area:accessibility");
      expect(result[0].confidence).toBeGreaterThan(0.5);
    });

    it("should detect labels area from label keywords", () => {
      const issue = {
        title: "Fix label prefix enforcement",
        body: "Need to fix canonical label validation",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].area).toBe("area:labels");
      expect(result[0].confidence).toBeGreaterThan(0.6);
    });

    it("should return empty array for generic content", () => {
      const issue = {
        title: "Random title",
        body: "Some text with no area hints",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBe(0);
    });
  });

  describe("suggestAssignee", () => {
    it("should suggest ashleyshaw for ci area", () => {
      const areaInference = [{ area: "area:ci", confidence: 0.95 }];
      const assignee = handler.suggestAssignee(areaInference);
      expect(assignee).toBe("ashleyshaw");
    });

    it("should suggest ashleyshaw for security area", () => {
      const areaInference = [{ area: "area:security", confidence: 0.92 }];
      const assignee = handler.suggestAssignee(areaInference);
      expect(assignee).toBe("ashleyshaw");
    });

    it("should return null for unknown area", () => {
      const areaInference = [{ area: "area:unknown", confidence: 0.85 }];
      const assignee = handler.suggestAssignee(areaInference);
      expect(assignee).toBeNull();
    });

    it("should return null for empty area inference", () => {
      const assignee = handler.suggestAssignee([]);
      expect(assignee).toBeNull();
    });
  });

  describe("processIssue", () => {
    it("should return preview in dry-run mode", async () => {
      const issue = {
        number: 123,
        title: "Add new feature",
        body: "Implement CSV export",
        labels: [{ name: "status:needs-triage" }],
      };

      const result = await handler.processIssue(issue, { dryRun: true });

      expect(result.status).toBe("preview");
      expect(result.dryRun).toBe(true);
      expect(result.issueNumber).toBe(123);
      expect(result.typeInference).toBeDefined();
      expect(result.typeInference.type).toBe("feature");
      expect(result.labelsToAdd).toBeDefined();
    });

    it("should skip issues already triaged", async () => {
      const issue = {
        number: 123,
        title: "Add new feature",
        body: "Implement CSV export",
        labels: [{ name: "type:feature" }, { name: "area:ci" }],
      };

      const result = await handler.processIssue(issue, { dryRun: true });

      expect(result.status).toBe("skipped");
      expect(result.reason).toContain("already has type and area labels");
    });

    it("should process issues with only type label", async () => {
      const issue = {
        number: 123,
        title: "Add new feature",
        body: "Implement CSV export",
        labels: [{ name: "type:feature" }],
      };

      const result = await handler.processIssue(issue, { dryRun: true });

      expect(result.status).toBe("preview");
      expect(result.areaInference).toBeDefined();
    });

    it("should process issues with only area label", async () => {
      const issue = {
        number: 123,
        title: "Add new feature",
        body: "Implement CSV export",
        labels: [{ name: "area:automation" }],
      };

      const result = await handler.processIssue(issue, { dryRun: true });

      expect(result.status).toBe("preview");
      expect(result.typeInference).toBeDefined();
    });

    it("should return warning when confidence is below threshold", async () => {
      const issue = {
        number: 123,
        title: "TODO",
        body: "Something here",
        labels: [],
      };

      const result = await handler.processIssue(issue, {
        dryRun: true,
        confidenceThreshold: 0.95,
      });

      // Low-confidence, unlabeled fixture must return warning at 0.95 threshold
      expect(result.status).toBe("warning");
    });

    it("should return error when githubRequest not provided in update mode", async () => {
      const issue = {
        number: 123,
        title: "Add new feature",
        body: "Implement CSV export",
        labels: [],
      };

      const result = await handler.processIssue(issue, { dryRun: false });

      expect(result.status).toBe("error");
      expect(result.reason).toContain("githubRequest");
    });

    it("should include assignee in preview when area detected", async () => {
      const issue = {
        number: 123,
        title: "CI workflow failing",
        body: "The GitHub workflow pipeline in .github/workflows/ is failing",
        labels: [],
      };

      const result = await handler.processIssue(issue, { dryRun: true });

      // Assignee is set if area is detected
      if (result.areaInference && result.areaInference.length > 0) {
        expect(result.suggestedAssignee).toBe("ashleyshaw");
      }
    });

    it("should respect confidence threshold", async () => {
      const issue = {
        number: 123,
        title: "Refactor code",
        body: "Clean up implementation",
        labels: [],
      };

      const result = await handler.processIssue(issue, {
        dryRun: true,
        confidenceThreshold: 0.85,
      });

      // Derive expected status from inference confidences
      const hasHighConfidenceInference =
        (result.typeInference && result.typeInference.confidence >= 0.85) ||
        (result.areaInference &&
          result.areaInference.some((a) => a.confidence >= 0.85));

      if (hasHighConfidenceInference) {
        expect(result.status).toBe("preview");
      } else {
        expect(result.status).toBe("warning");
      }
    });
  });

  describe("processBatch", () => {
    it("should process multiple issues and return stats", async () => {
      const issues = [
        {
          number: 1,
          title: "Add new feature",
          body: "Implement CSV export",
          labels: [{ name: "status:needs-triage" }],
        },
        {
          number: 2,
          title: "Fix broken feature",
          body: "Search crashes on startup",
          labels: [],
        },
        {
          number: 3,
          title: "Update docs",
          body: "Documentation is outdated",
          labels: [{ name: "type:task" }, { name: "area:documentation" }],
        },
      ];

      const result = await handler.processBatch(issues, { dryRun: true });

      expect(result.results).toHaveLength(3);
      expect(result.stats).toBeDefined();
      expect(result.stats.preview || result.stats.skipped).toBeGreaterThan(0);
    });

    it("should count different result statuses", async () => {
      const issues = [
        {
          number: 1,
          title: "Add new feature",
          body: "Implement feature",
          labels: [],
        },
        {
          number: 2,
          title: "Random",
          body: "No hints",
          labels: [],
        },
      ];

      const result = await handler.processBatch(issues, {
        dryRun: true,
        confidenceThreshold: 0.9,
      });

      expect(result.stats.preview + result.stats.warnings).toBeGreaterThan(0);
    });
  });
});
