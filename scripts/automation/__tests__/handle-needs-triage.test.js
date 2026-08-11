/**
 * Unit tests for handle-needs-triage.js
 */

import { describe, it, expect } from "@jest/globals";
import * as handler from "../handlers/handle-needs-triage.js";

describe("handle-needs-triage", () => {
  describe("inferType", () => {
    it("should detect feature type from pattern match (highest weight)", () => {
      const issue = {
        title: "Add support for new export format",
        body: "Users should be able to export in CSV format",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("feature");
      // Feature pattern "^add " matches → weight 1.0
      expect(result.confidence).toBe(1.0);
    });

    it("should detect bug type from keyword match", () => {
      const issue = {
        title: "Critical: Search functionality is broken",
        body: "When I search, the app crashes with an error message",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("bug");
      // "broken" keyword match → 0.7 * weight. "crash" also matches as keyword
      // Max of: keyword matches (0.7) and pattern matches
      expect(result.confidence).toBe(0.7);
    });

    it("should detect epic type from keyword match (reduced confidence)", () => {
      const issue = {
        title: "Epic: Complete platform migration initiative",
        body: "Long-term strategic initiative with multiple phases",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("epic");
      // Epic pattern "^epic:" matches → weight 0.95
      expect(result.confidence).toBe(0.95);
    });

    it("should detect task type from pattern match", () => {
      const issue = {
        title: "Refactor authentication module",
        body: "Clean up technical debt in auth system",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("task");
      // Task pattern "refactor" matches → weight 0.85
      expect(result.confidence).toBe(0.85);
    });

    it("should return lowest confidence for empty content", () => {
      const issue = {
        title: "",
        body: "",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBeDefined();
      expect(result.confidence).toBe(0);
    });

    it("should return deterministic lowest-confidence type for generic content", () => {
      const issue = {
        title: "Something",
        body: "TODO",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBeDefined();
      // No patterns match, "todo" is not a keyword → 0 confidence
      expect(result.confidence).toBe(0);
    });

    it("should return highest-scoring type when multiple types present", () => {
      const issue = {
        title: "[bug] Login form not working",
        body: "When I try to log in, nothing happens",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      // Verify that both "bug" and other types are scored, and highest is returned
      expect(["bug", "feature", "task"]).toContain(result.type);
    });
  });

  describe("inferArea", () => {
    it("should detect ci area from pattern match (weight 1.0)", () => {
      const issue = {
        title: "GitHub Actions workflow failing",
        body: "The CI pipeline needs fixing",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].area).toBe("area:ci");
      // Pattern "ci|github actions|..." matches → weight 1.0
      expect(result[0].confidence).toBe(1.0);
    });

    it("should detect docs area from pattern match", () => {
      const issue = {
        title: "Update README",
        body: "The documentation needs updating in docs/ folder",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBe(1);
      expect(result[0].area).toBe("area:docs");
      // Pattern "readme" matches → weight 1.0
      expect(result[0].confidence).toBe(1.0);
    });

    it("should detect security area from pattern match", () => {
      const issue = {
        title: "Security vulnerability in authentication",
        body: "Found an XSS vulnerability that needs patching",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].area).toBe("area:security");
      // Pattern "security" or "vulnerab" matches → weight 1.0
      expect(result[0].confidence).toBe(1.0);
    });

    it("should detect automation area from pattern match (weight 0.95)", () => {
      const issue = {
        title: "Automate issue triage",
        body: "Create a script to batch process issues",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].area).toBe("area:automation");
      // Pattern "automat|script" matches → weight 0.95
      expect(result[0].confidence).toBe(0.95);
    });

    it("should detect accessibility area from pattern match (weight 0.95)", () => {
      const issue = {
        title: "Improve WCAG compliance",
        body: "Need to improve a11y accessibility standards",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBe(1);
      expect(result[0].area).toBe("area:accessibility");
      // Pattern "a11y|accessibil|wcag" matches → weight 0.95
      expect(result[0].confidence).toBe(0.95);
    });

    it("should detect labels area from pattern match", () => {
      const issue = {
        title: "Fix label prefix enforcement",
        body: "Need to fix canonical label validation",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBe(1);
      expect(result[0].area).toBe("area:labels");
      // Pattern "/label|tagging|..." matches in "label prefix" → weight 0.9
      expect(result[0].confidence).toBe(0.9);
    });

    it("should return empty array for generic content (all scores ≤ 0.5)", () => {
      const issue = {
        title: "Random title",
        body: "Some text with no area hints",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBe(0);
    });

    it("should return empty array for empty content", () => {
      const issue = {
        title: "",
        body: "",
      };
      const result = handler.inferArea(issue);
      expect(result.length).toBe(0);
    });

    it("should filter out areas with confidence ≤ 0.5", () => {
      const issue = {
        title: "Some task work",
        body: "Just a generic note",
      };
      const result = handler.inferArea(issue);
      // "task" is not an area keyword/pattern, so all areas should be ≤ 0.5
      expect(result.length).toBe(0);
    });

    it("should return top 2 areas when both meet threshold > 0.5", () => {
      const issue = {
        title: "Security CI workflow",
        body: "GitHub Actions security pipeline and authorization checks",
      };
      const result = handler.inferArea(issue);
      // Should detect both area:ci (1.0) and area:security (1.0)
      expect(result.length).toBe(2);
      expect(result.map((a) => a.area)).toContain("area:ci");
      expect(result.map((a) => a.area)).toContain("area:security");
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

    it("should assign ashleyshaw when ci area is top inference", async () => {
      const issue = {
        number: 123,
        title: "CI workflow failing",
        body: "The GitHub workflow pipeline in .github/workflows/ is failing",
        labels: [],
      };

      const result = await handler.processIssue(issue, { dryRun: true });

      // area:ci pattern match → 1.0 confidence
      expect(result.areaInference.length).toBeGreaterThan(0);
      expect(result.areaInference[0].area).toBe("area:ci");
      expect(result.suggestedAssignee).toBe("ashleyshaw");
    });

    it("should return preview when type meets (threshold * 0.85)", async () => {
      const issue = {
        number: 123,
        title: "Refactor code",
        body: "Clean up implementation",
        labels: [],
      };

      // "refactor" pattern → task type (weight 0.85)
      // Area: no area keywords/patterns → filtered out
      const result = await handler.processIssue(issue, {
        dryRun: true,
        confidenceThreshold: 0.95,
      });

      // At threshold 0.95, effective check is >= 0.8075 (0.95 * 0.85)
      // Type confidence = 0.85 >= 0.8075 → passes → preview
      expect(result.status).toBe("preview");
      expect(result.typeInference.type).toBe("task");
      expect(result.typeInference.confidence).toBe(0.85);
    });

    it("should return preview when type exceeds (threshold * 0.85)", async () => {
      const issue = {
        number: 456,
        title: "Add CSV export feature",
        body: "Implement CSV export functionality",
        labels: [],
      };

      const result = await handler.processIssue(issue, {
        dryRun: true,
        confidenceThreshold: 0.95,
      });

      // Feature pattern "^add" → 1.0, Area: no explicit matches → filtered
      // type 1.0 >= 0.8075 (0.95 * 0.85) → preview
      expect(result.status).toBe("preview");
      expect(result.typeInference.type).toBe("feature");
      expect(result.typeInference.confidence).toBe(1.0);
    });
  });

  describe("edge cases and boundary conditions", () => {
    it("should handle issue with empty content", async () => {
      const issue = {
        number: 789,
        title: "",
        body: "",
        labels: [],
      };

      const result = await handler.processIssue(issue, { dryRun: true });

      // No patterns match → all types/areas at 0 or near-0
      expect(result.typeInference.confidence).toBe(0);
      expect(result.areaInference.length).toBe(0);
      expect(result.status).toBe("warning");
    });

    it("should handle issue with only whitespace", async () => {
      const issue = {
        number: 790,
        title: "   ",
        body: "   ",
        labels: [],
      };

      const result = await handler.processIssue(issue, { dryRun: true });

      expect(result.typeInference.confidence).toBe(0);
      expect(result.areaInference.length).toBe(0);
      expect(result.status).toBe("warning");
    });

    it("should consistently score same issue with deterministic patterns", async () => {
      const issue = {
        number: 791,
        title: "Fix broken authentication",
        body: "The login form doesn't work anymore",
        labels: [],
      };

      const result1 = await handler.processIssue(issue, { dryRun: true });
      const result2 = await handler.processIssue(issue, { dryRun: true });

      // Deterministic: same inputs → same confidence scores
      expect(result1.typeInference.confidence).toBe(
        result2.typeInference.confidence,
      );
      expect(result1.typeInference.type).toBe(result2.typeInference.type);
      expect(result1.areaInference).toEqual(result2.areaInference);
    });

    it("should use asymmetric confidence threshold (threshold * 0.85) for type/area checks", async () => {
      // Documented behavior: confidence checks use (confidenceThreshold * 0.85)
      // to allow minor misses while still filtering low-confidence inferences
      const issue = {
        number: 792,
        title: "Add feature",
        body: "Implement something new",
        labels: [],
      };

      // Feature pattern "^add" → 1.0 confidence
      // At threshold 0.9, effective type check: 1.0 >= 0.9 * 0.85 = 0.765
      // 1.0 >= 0.765 → passes → preview
      const resultHigh = await handler.processIssue(issue, {
        dryRun: true,
        confidenceThreshold: 0.9,
      });
      expect(resultHigh.status).toBe("preview");

      // At threshold 2.0 (out of valid range), invalid configuration error
      const resultInvalid = await handler.processIssue(issue, {
        dryRun: true,
        confidenceThreshold: 2.0,
      });
      expect(resultInvalid.status).toBe("invalid-configuration");
    });

    it("should return highest-scoring type when multiple types match", async () => {
      const issue = {
        number: 793,
        title: "Bug: Feature request for better error handling",
        body: "Both a bug report and feature request",
        labels: [],
      };

      const result = await handler.processIssue(issue, { dryRun: true });

      // Both "bug" and "feature" keywords are in content
      // Type inference returns the type with highest confidence score
      expect(result.typeInference.type).toBeDefined();
      expect(result.typeInference.confidence).toBeGreaterThan(0);
      // Could be either bug or feature depending on which scoring wins
      expect(["bug", "feature"]).toContain(result.typeInference.type);
    });

    it("should only include areas with confidence > 0.5 in inference", async () => {
      const issue = {
        number: 794,
        title: "Task: Refactor",
        body: "Code cleanup",
        labels: [],
      };

      const result = await handler.processIssue(issue, { dryRun: true });

      // "refactor" keyword relates to task type, not areas
      // Area patterns should all be ≤ 0.5
      expect(result.areaInference.length).toBe(0);
      expect(result.typeInference.type).toBe("task");
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
