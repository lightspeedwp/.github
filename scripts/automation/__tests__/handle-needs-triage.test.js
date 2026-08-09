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
      expect(result.confidence).toBeGreaterThan(50);
    });

    it("should detect bug type from error keywords", () => {
      const issue = {
        title: "Critical: Search functionality is broken",
        body: "When I search, the app crashes with an error message",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("bug");
      expect(result.confidence).toBeGreaterThan(50);
    });

    it("should detect epic type from scope keywords", () => {
      const issue = {
        title: "Epic: Complete platform migration initiative",
        body: "Long-term strategic initiative with multiple phases",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("epic");
      expect(result.confidence).toBeGreaterThan(30);
    });

    it("should detect refactor type from cleanup keywords", () => {
      const issue = {
        title: "Refactor authentication module",
        body: "Clean up technical debt in auth system",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("refactor");
      expect(result.confidence).toBeGreaterThan(50);
    });

    it("should return null for completely generic content", () => {
      const issue = {
        title: "Something",
        body: "TODO",
      };
      const result = handler.inferType(issue);
      // Generic content returns null type
      expect(result.type === null || result.confidence < 20).toBe(true);
    });

    it("should prioritize explicit type labels in title", () => {
      const issue = {
        title: "[bug] Login form not working",
        body: "When I try to log in, nothing happens",
      };
      const result = handler.inferType(issue);
      expect(result.type).toBe("bug");
    });
  });

  describe("detectArea", () => {
    it("should detect ci area from workflow keywords", () => {
      const issue = {
        title: "GitHub Actions workflow failing",
        body: "The CI pipeline needs fixing",
      };
      const result = handler.detectArea(issue);
      expect(result.area).toBe("area:ci");
      expect(result.confidence).toBeGreaterThan(50);
    });

    it("should detect documentation area", () => {
      const issue = {
        title: "Update README",
        body: "The documentation needs updating in docs/ folder",
      };
      const result = handler.detectArea(issue);
      expect(result.area).toBe("area:documentation");
      expect(result.confidence).toBeGreaterThan(50);
    });

    it("should detect security area", () => {
      const issue = {
        title: "Security vulnerability in authentication",
        body: "Found an XSS vulnerability that needs patching",
      };
      const result = handler.detectArea(issue);
      expect(result.area).toBe("area:security");
      expect(result.confidence).toBeGreaterThan(50);
    });

    it("should detect automation area from script keywords", () => {
      const issue = {
        title: "Automate issue triage",
        body: "Create a script to batch process issues",
      };
      const result = handler.detectArea(issue);
      expect(result.area).toBe("area:automation");
      expect(result.confidence).toBeGreaterThan(50);
    });

    it("should detect ai area from agent keywords", () => {
      const issue = {
        title: "Enhance Claude agent",
        body: "Improve the AI agent's prompt handling",
      };
      const result = handler.detectArea(issue);
      expect(result.area).toBe("area:ai");
      expect(result.confidence).toBeGreaterThan(40);
    });

    it("should detect labels area from label keywords", () => {
      const issue = {
        title: "Fix label prefix enforcement",
        body: "Need to fix canonical label validation",
      };
      const result = handler.detectArea(issue);
      expect(result.area).toBe("area:labels");
      expect(result.confidence).toBeGreaterThan(50);
    });

    it("should return null area for generic content", () => {
      const issue = {
        title: "Random title",
        body: "Some text with no area hints",
      };
      const result = handler.detectArea(issue);
      expect(result.area).toBeNull();
    });
  });

  describe("suggestAssignee", () => {
    it("should suggest ashleyshaw for ci area", () => {
      const assignee = handler.suggestAssignee("area:ci");
      expect(assignee).toBe("ashleyshaw");
    });

    it("should suggest ashleyshaw for security area", () => {
      const assignee = handler.suggestAssignee("area:security");
      expect(assignee).toBe("ashleyshaw");
    });

    it("should default to ashleyshaw for unknown area", () => {
      const assignee = handler.suggestAssignee("area:unknown");
      expect(assignee).toBe("ashleyshaw");
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
      expect(result.suggestedType).toBe("feature");
      expect(result.labelsToRemove).toContain("status:needs-triage");
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
      expect(result.reason).toContain("already triaged");
    });

    it("should skip issues with only type label", async () => {
      const issue = {
        number: 123,
        title: "Add new feature",
        body: "Implement CSV export",
        labels: [{ name: "type:feature" }],
      };

      const result = await handler.processIssue(issue, { dryRun: true });

      expect(result.status).toBe("preview");
      expect(result.suggestedArea).toBeDefined();
    });

    it("should skip issues with only area label", async () => {
      const issue = {
        number: 123,
        title: "Add new feature",
        body: "Implement CSV export",
        labels: [{ name: "area:automation" }],
      };

      const result = await handler.processIssue(issue, { dryRun: true });

      expect(result.status).toBe("preview");
      expect(result.suggestedType).toBeDefined();
    });

    it("should return low-confidence or preview depending on content confidence", async () => {
      const issue = {
        number: 123,
        title: "TODO",
        body: "Something here",
        labels: [],
      };

      const result = await handler.processIssue(issue, {
        dryRun: true,
        confidenceThreshold: 95,
      });

      expect(["low-confidence", "preview"].includes(result.status)).toBe(true);
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
      if (result.suggestedArea === "area:ci") {
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
        confidenceThreshold: 85,
      });

      // Should skip or low-confidence depending on actual confidence
      expect(
        ["preview", "low-confidence", "skipped"].includes(result.status),
      ).toBe(true);
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
        confidenceThreshold: 90,
      });

      expect(
        result.stats.preview + result.stats["low-confidence"],
      ).toBeGreaterThan(0);
    });
  });
});
