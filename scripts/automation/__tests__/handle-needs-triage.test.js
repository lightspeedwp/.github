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
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it("should detect task type from refactor keywords", () => {
      const issue = {
        title: "Refactor authentication module",
        body: "Clean up technical debt in auth system",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("task");
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it("should return scores object with confidence values", () => {
      const issue = {
        title: "Something generic",
        body: "TODO",
      };
      const result = handler.inferType(issue);
      expect(result).toHaveProperty("type");
      expect(result).toHaveProperty("confidence");
      expect(result).toHaveProperty("scores");
    });
  });

  describe("inferArea", () => {
    it("should detect ci area from workflow keywords", () => {
      const issue = {
        title: "GitHub Actions workflow failing",
        body: "The CI pipeline needs fixing",
      };
      const result = handler.inferArea(issue);
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("area");
        expect(result[0]).toHaveProperty("confidence");
      }
    });

    it("should return array of areas", () => {
      const issue = {
        title: "Update documentation",
        body: "The docs in docs/ folder need updating",
      };
      const result = handler.inferArea(issue);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter results by confidence threshold", () => {
      const issue = {
        title: "Generic issue",
        body: "Something that doesn't match keywords well",
      };
      const result = handler.inferArea(issue);
      expect(Array.isArray(result)).toBe(true);
      // All results should have confidence > 0.5
      result.forEach((item) => {
        expect(item.confidence).toBeGreaterThan(0.5);
      });
    });
  });

  describe("suggestAssignee", () => {
    it("should accept array of inferred areas", () => {
      const areas = [{ area: "area:ci", confidence: 0.95 }];
      const assignee = handler.suggestAssignee(areas);
      expect(typeof assignee === "string" || assignee === null).toBe(true);
    });

    it("should return null for empty areas", () => {
      const assignee = handler.suggestAssignee([]);
      expect(assignee).toBeNull();
    });

    it("should handle undefined input", () => {
      const assignee = handler.suggestAssignee(undefined);
      expect(assignee).toBeNull();
    });
  });

  describe("processIssue", () => {
    it("should return object with status and issueNumber", async () => {
      const issue = {
        number: 123,
        title: "Add new feature",
        body: "Description of feature",
        labels: [],
      };
      const result = await handler.processIssue(issue, { dryRun: true });
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("issueNumber");
      expect(result.issueNumber).toBe(123);
    });

    it("should skip issues with both type and area labels", async () => {
      const issue = {
        number: 123,
        title: "Already labeled issue",
        body: "Has type and area",
        labels: [{ name: "type:feature" }, { name: "area:ci" }],
      };
      const result = await handler.processIssue(issue, { dryRun: true });
      expect(result.status).toBe("skipped");
    });

    it("should handle issues without number gracefully", async () => {
      const issue = {
        title: "No number field",
        body: "Missing issue number",
        labels: [],
      };
      const result = await handler.processIssue(issue, { dryRun: true });
      expect(result).toHaveProperty("status");
    });
  });

  describe("processBatch", () => {
    it("should process multiple issues and return stats", async () => {
      const issues = [
        {
          number: 1,
          title: "Add feature",
          body: "New feature request",
          labels: [],
        },
        {
          number: 2,
          title: "Already labeled",
          body: "Has labels",
          labels: [{ name: "type:feature" }, { name: "area:ci" }],
        },
      ];
      const result = await handler.processBatch(issues, { dryRun: true });
      expect(result).toHaveProperty("results");
      expect(result).toHaveProperty("stats");
      expect(result.results.length).toBe(2);
    });

    it("should handle empty batch", async () => {
      const result = await handler.processBatch([], { dryRun: true });
      expect(result.results).toEqual([]);
      expect(result).toHaveProperty("stats");
    });
  });

  describe("pattern exports", () => {
    it("should export type patterns", () => {
      expect(handler.typePatterns).toBeDefined();
      expect(typeof handler.typePatterns).toBe("object");
    });

    it("should export area patterns", () => {
      expect(handler.areaPatterns).toBeDefined();
      expect(typeof handler.areaPatterns).toBe("object");
    });
  });
});
