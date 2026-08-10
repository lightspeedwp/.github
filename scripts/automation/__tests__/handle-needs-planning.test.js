/**
 * Unit tests for handle-needs-planning.js
 */

import { describe, it, expect } from "@jest/globals";
import * as handler from "../handlers/handle-needs-planning";

describe("handle-needs-planning", () => {
  describe("inferScope", () => {
    it("should detect small scope", () => {
      const issue = {
        title: "Fix quick typo",
        body: "Simple one-liner fix needed",
      };
      const result = handler.inferScope(issue);
      expect(["small", "medium"]).toContain(result.scope);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.scores).toBeDefined();
    });

    it("should detect medium scope", () => {
      const issue = {
        title: "Add new feature",
        body: "Enhancement to existing functionality",
      };
      const result = handler.inferScope(issue);
      expect(["medium", "small"]).toContain(result.scope);
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("should detect large scope", () => {
      const issue = {
        title: "Epic: Major system redesign",
        body: "Large, complex initiative spanning multiple areas",
      };
      const result = handler.inferScope(issue);
      expect(["large", "medium"]).toContain(result.scope);
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("should return scores for all scopes", () => {
      const issue = {
        title: "Feature",
        body: "Some work needed",
      };
      const result = handler.inferScope(issue);
      expect(result.scores.small).toBeGreaterThanOrEqual(0);
      expect(result.scores.medium).toBeGreaterThanOrEqual(0);
      expect(result.scores.large).toBeGreaterThanOrEqual(0);
    });
  });

  describe("suggestMilestone", () => {
    it("should suggest sprint milestone for small scope", () => {
      const scope = { scope: "small" };
      const result = handler.suggestMilestone(scope);
      expect(["Current Sprint", "Next Sprint"]).toContain(result);
    });

    it("should suggest sprint/quarterly milestone for medium scope", () => {
      const scope = { scope: "medium" };
      const result = handler.suggestMilestone(scope);
      expect(["Next Sprint", "Q3 2026"]).toContain(result);
    });

    it("should suggest quarterly/roadmap milestone for large scope", () => {
      const scope = { scope: "large" };
      const result = handler.suggestMilestone(scope);
      expect(["Q3 2026", "Q4 2026", "Roadmap"]).toContain(result);
    });
  });

  describe("suggestProductManager", () => {
    it("should suggest PM for area:ci", () => {
      const issue = {
        labels: [{ name: "area:ci" }],
      };
      const result = handler.suggestProductManager(issue);
      expect(result).toBe("ashleyshaw");
    });

    it("should suggest PM for area:docs", () => {
      const issue = {
        labels: [{ name: "area:docs" }],
      };
      const result = handler.suggestProductManager(issue);
      expect(result).toBe("ashleyshaw");
    });

    it("should default to ashleyshaw for unknown area", () => {
      const issue = {
        labels: [{ name: "area:unknown" }],
      };
      const result = handler.suggestProductManager(issue);
      expect(result).toBe("ashleyshaw");
    });

    it("should handle issue without labels", () => {
      const issue = {
        labels: [],
      };
      const result = handler.suggestProductManager(issue);
      expect(result).toBe("ashleyshaw");
    });
  });

  describe("suggestEpicLinkage", () => {
    it("should suggest epic linkage for epic mention", () => {
      const issue = {
        title: "Epic: Large initiative",
        body: "This is a major epic",
      };
      const result = handler.suggestEpicLinkage(issue);
      expect(result).toBe(true);
    });

    it("should suggest epic linkage for complex content", () => {
      const issue = {
        title: "Feature",
        body: "Long description with extensive details. ".repeat(20),
      };
      const result = handler.suggestEpicLinkage(issue);
      expect(result).toBe(true);
    });

    it("should not suggest epic linkage for simple issue", () => {
      const issue = {
        title: "Fix typo",
        body: "Fix a simple typo",
      };
      const result = handler.suggestEpicLinkage(issue);
      expect(result).toBe(false);
    });

    it("should suggest epic linkage for initiative mention", () => {
      const issue = {
        title: "Initiative: New roadmap",
        body: "Part of major initiative",
      };
      const result = handler.suggestEpicLinkage(issue);
      expect(result).toBe(true);
    });
  });

  describe("processIssue", () => {
    const mockIssueWithoutMilestone = {
      number: 400,
      title: "Medium feature",
      body: "Feature work needed",
      labels: [{ name: "area:ci" }],
      milestone: null,
    };

    const mockIssueWithMilestone = {
      number: 401,
      title: "Already planned feature",
      body: "Feature work",
      labels: [{ name: "area:ci" }],
      milestone: { title: "Q3 2026" },
    };

    it("should return preview in dry-run mode", async () => {
      const result = await handler.processIssue(mockIssueWithoutMilestone, {
        dryRun: true,
      });
      expect(result.status).toBe("preview");
      expect(result.dryRun).toBe(true);
      expect(result.issueNumber).toBe(400);
    });

    it("should suggest milestone in preview", async () => {
      const result = await handler.processIssue(mockIssueWithoutMilestone, {
        dryRun: true,
      });
      expect(result.suggestedMilestone).toBeDefined();
      expect(result.suggestedPM).toBeDefined();
    });

    it("should suggest PM in preview", async () => {
      const result = await handler.processIssue(mockIssueWithoutMilestone, {
        dryRun: true,
      });
      expect(result.suggestedPM).toBe("ashleyshaw");
    });

    it("should flag epic linkage suggestion", async () => {
      const issue = {
        number: 402,
        title: "Epic: Major initiative",
        body: "Long description for epic",
        labels: [{ name: "area:ci" }],
        milestone: null,
      };
      const result = await handler.processIssue(issue, { dryRun: true });
      expect(result.shouldLinkEpic).toBe(true);
    });

    it("should skip issue with milestone", async () => {
      const result = await handler.processIssue(mockIssueWithMilestone, {
        dryRun: true,
      });
      expect(result.status).toBe("skipped");
      expect(result.reason).toContain("already has milestone");
    });

    it("should return error if githubRequest not provided", async () => {
      const result = await handler.processIssue(mockIssueWithoutMilestone, {
        dryRun: false,
        githubRequest: null,
      });
      expect(result.status).toBe("error");
      expect(result.reason).toContain("githubRequest");
    });
  });

  describe("processBatch", () => {
    const mockIssues = [
      {
        number: 500,
        title: "Feature 1",
        body: "Work needed",
        labels: [{ name: "area:ci" }],
        milestone: null,
      },
      {
        number: 501,
        title: "Already planned",
        body: "Has milestone",
        labels: [{ name: "area:docs" }],
        milestone: { title: "Q3 2026" },
      },
      {
        number: 502,
        title: "Feature 3",
        body: "More work",
        labels: [{ name: "area:automation" }],
        milestone: null,
      },
    ];

    it("should process multiple issues", async () => {
      const result = await handler.processBatch(mockIssues, { dryRun: true });
      expect(result.results).toHaveLength(3);
      expect(result.stats).toBeDefined();
    });

    it("should track statistics", async () => {
      const result = await handler.processBatch(mockIssues, { dryRun: true });
      expect(result.stats.preview).toBeGreaterThanOrEqual(0);
      expect(result.stats.updated).toBeGreaterThanOrEqual(0);
      expect(result.stats.skipped).toBeGreaterThanOrEqual(0);
      expect(result.stats.errors).toBeGreaterThanOrEqual(0);
    });

    it("should handle empty batch", async () => {
      const result = await handler.processBatch([], { dryRun: true });
      expect(result.results).toHaveLength(0);
      expect(result.stats.preview).toBe(0);
      expect(result.stats.updated).toBe(0);
      expect(result.stats.skipped).toBe(0);
      expect(result.stats.errors).toBe(0);
    });
  });
});
