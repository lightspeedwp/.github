/**
 * Unit tests for handle-needs-review.js
 */

import { describe, it, expect } from "@jest/globals";
import * as handler from "../handlers/handle-needs-review";

describe("handle-needs-review", () => {
  describe("inferReviewType", () => {
    it("should detect code review type", () => {
      const issue = {
        title: "Fix critical bug in authentication",
        body: "Code implementation issue",
      };
      const result = handler.inferReviewType(issue);
      expect(["code", "documentation"]).toContain(result.type);
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it("should detect design review type", () => {
      const issue = {
        title: "Design new dashboard UI",
        body: "Figma component design needed",
      };
      const result = handler.inferReviewType(issue);
      expect(["design", "code"]).toContain(result.type);
      expect(result.confidence).toBeGreaterThan(0.4);
    });

    it("should detect spec review type", () => {
      const issue = {
        title: "Architecture specification for new module",
        body: "Review proposal for API specification",
      };
      const result = handler.inferReviewType(issue);
      expect(["spec", "code"]).toContain(result.type);
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it("should return scores for all types", () => {
      const issue = {
        title: "Fix code bug",
        body: "Implementation issue",
      };
      const result = handler.inferReviewType(issue);
      expect(result.scores).toBeDefined();
      expect(Object.keys(result.scores).length).toBeGreaterThan(0);
    });
  });

  describe("suggestReviewers", () => {
    it("should suggest reviewers for code review", () => {
      const issue = { title: "Code fix", body: "" };
      const reviewType = { type: "code", confidence: 0.9 };
      const result = handler.suggestReviewers(issue, reviewType, null);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should suggest reviewers for area label", () => {
      const issue = { title: "CI issue", body: "" };
      const reviewType = { type: "code", confidence: 0.9 };
      const result = handler.suggestReviewers(issue, reviewType, "area:ci");
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return max 3 reviewers", () => {
      const issue = { title: "Issue", body: "" };
      const reviewType = { type: "code", confidence: 0.9 };
      const result = handler.suggestReviewers(issue, reviewType, "area:ci");
      expect(result.length).toBeLessThanOrEqual(3);
    });

    it("should return empty array when no reviewers found", () => {
      const issue = { title: "Unknown issue", body: "" };
      const reviewType = { type: "unknown", confidence: 0.1 };
      const result = handler.suggestReviewers(issue, reviewType, null);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("processIssue", () => {
    const mockIssueNeedsReview = {
      number: 200,
      title: "Review: Code implementation",
      body: "Needs code review",
      labels: [{ name: "status:needs-review" }],
      assignees: [],
    };

    const mockIssueAlreadyAssigned = {
      number: 201,
      title: "Already assigned",
      body: "Has reviewers",
      labels: [{ name: "status:needs-review" }],
      assignees: [{ login: "ashleyshaw" }],
    };

    it("should return preview in dry-run mode", async () => {
      const result = await handler.processIssue(mockIssueNeedsReview, {
        dryRun: true,
      });
      expect(result.status).toBe("preview");
      expect(result.dryRun).toBe(true);
      expect(result.issueNumber).toBe(200);
    });

    it("should suggest reviewers in preview", async () => {
      const result = await handler.processIssue(mockIssueNeedsReview, {
        dryRun: true,
      });
      expect(["preview", "warning"]).toContain(result.status);
      if (result.status === "preview") {
        expect(result.suggestedReviewers).toBeDefined();
      }
    });

    it("should skip already-assigned issues", async () => {
      const result = await handler.processIssue(mockIssueAlreadyAssigned, {
        dryRun: true,
      });
      expect(result.status).toBe("skipped");
      expect(result.reason).toContain("already has");
    });

    it("should return error if githubRequest not provided", async () => {
      const result = await handler.processIssue(mockIssueNeedsReview, {
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
        number: 300,
        title: "Issue 1",
        body: "Code review needed",
        labels: [{ name: "status:needs-review" }],
        assignees: [],
      },
      {
        number: 301,
        title: "Issue 2",
        body: "Design review needed",
        labels: [{ name: "status:needs-review" }],
        assignees: [{ login: "reviewer" }],
      },
      {
        number: 302,
        title: "Issue 3",
        body: "Review needed",
        labels: [{ name: "status:needs-review" }],
        assignees: [],
      },
    ];

    it("should process multiple issues", async () => {
      const result = await handler.processBatch(mockIssues, { dryRun: true });
      expect(result.results).toHaveLength(3);
      expect(result.stats).toBeDefined();
    });

    it("should track statistics", async () => {
      const result = await handler.processBatch(mockIssues, { dryRun: true });
      expect(
        result.stats.preview + result.stats.skipped + result.stats.warnings,
      ).toBe(3);
    });

    it("should handle empty batch", async () => {
      const result = await handler.processBatch([], { dryRun: true });
      expect(result.results).toHaveLength(0);
      expect(result.stats.preview).toBe(0);
    });
  });
});
