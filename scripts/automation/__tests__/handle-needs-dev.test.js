/**
 * Unit tests for handle-needs-dev.js
 */

import { describe, it, expect } from "@jest/globals";
import * as handler from "../handlers/handle-needs-dev";

describe("handle-needs-dev", () => {
  describe("validatePrerequisites", () => {
    it("should pass when all prerequisites present", async () => {
      const issue = {
        number: 100,
        title: "Feature",
        body: "Issue body",
        labels: [{ name: "type:feature" }, { name: "area:ci" }],
        project_cards: [{ name: "CI Pipeline" }],
      };
      const result = await handler.validatePrerequisites(issue);
      expect(result.valid).toBe(true);
      expect(result.issues.length).toBe(0);
    });

    it("should flag missing type label", async () => {
      const issue = {
        number: 101,
        title: "Bug",
        body: "Issue body",
        labels: [{ name: "area:ci" }],
        project_cards: [{ name: "CI Pipeline" }],
      };
      const result = await handler.validatePrerequisites(issue);
      expect(result.valid).toBe(false);
      expect(result.issues).toContain("missing type: label");
    });

    it("should flag missing area label", async () => {
      const issue = {
        number: 102,
        title: "Feature",
        body: "Issue body",
        labels: [{ name: "type:feature" }],
        project_cards: [{ name: "CI Pipeline" }],
      };
      const result = await handler.validatePrerequisites(issue);
      expect(result.valid).toBe(false);
      expect(result.issues).toContain("missing area: label");
    });

    it("should flag missing project assignment", async () => {
      const issue = {
        number: 103,
        title: "Feature",
        body: "Issue body",
        labels: [{ name: "type:feature" }, { name: "area:ci" }],
        project_cards: [],
      };
      const result = await handler.validatePrerequisites(issue);
      expect(result.valid).toBe(false);
      expect(result.issues).toContain("not assigned to project/sprint");
    });

    it("should detect design/spec reference", async () => {
      const issue = {
        number: 104,
        title: "Feature",
        body: "See figma design at https://figma.com/...",
        labels: [{ name: "type:feature" }, { name: "area:ci" }],
        project_cards: [{ name: "CI Pipeline" }],
      };
      const result = await handler.validatePrerequisites(issue);
      expect(result.hasDesignReference).toBe(true);
    });
  });

  describe("suggestProject", () => {
    it("should suggest CI/CD Pipeline for area:ci", () => {
      const issue = {
        labels: [{ name: "area:ci" }],
      };
      const result = handler.suggestProject(issue);
      expect(result).toBe("CI/CD Pipeline");
    });

    it("should suggest Documentation for area:docs", () => {
      const issue = {
        labels: [{ name: "area:docs" }],
      };
      const result = handler.suggestProject(issue);
      expect(result).toBe("Documentation");
    });

    it("should suggest Security Hardening for area:security", () => {
      const issue = {
        labels: [{ name: "area:security" }],
      };
      const result = handler.suggestProject(issue);
      expect(result).toBe("Security Hardening");
    });

    it("should return null for unknown area", () => {
      const issue = {
        labels: [{ name: "area:unknown" }],
      };
      const result = handler.suggestProject(issue);
      expect(result).toBe(null);
    });
  });

  describe("processIssue", () => {
    const mockIssueReady = {
      number: 200,
      title: "Feature: Add new dashboard",
      body: "All prerequisites met",
      labels: [{ name: "type:feature" }, { name: "area:ci" }],
      project_cards: [{ name: "CI Pipeline" }],
    };

    const mockIssueNotReady = {
      number: 201,
      title: "Incomplete issue",
      body: "Missing labels",
      labels: [],
      project_cards: [],
    };

    it("should return preview in dry-run mode", async () => {
      const result = await handler.processIssue(mockIssueReady, {
        dryRun: true,
      });
      expect(result.status).toBe("preview");
      expect(result.dryRun).toBe(true);
      expect(result.issueNumber).toBe(200);
    });

    it("should indicate ready status when all prerequisites met", async () => {
      const result = await handler.processIssue(mockIssueReady, {
        dryRun: true,
      });
      expect(result.isReady).toBe(true);
    });

    it("should preview with validation issues", async () => {
      const result = await handler.processIssue(mockIssueNotReady, {
        dryRun: true,
      });
      expect(result.status).toBe("preview");
      expect(result.validation).toBeDefined();
      expect(result.validation.issues.length).toBeGreaterThan(0);
    });

    it("should suggest project when needed", async () => {
      const result = await handler.processIssue(mockIssueNotReady, {
        dryRun: true,
      });
      expect(result.suggestedProject).toBeDefined();
    });

    it("should return warning when prerequisites missing (no dry-run)", async () => {
      const result = await handler.processIssue(mockIssueNotReady, {
        dryRun: false,
      });
      expect(result.status).toBe("warning");
      expect(result.reason).toContain("missing prerequisites");
    });

    it("should return error if githubRequest not provided", async () => {
      const result = await handler.processIssue(mockIssueReady, {
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
        title: "Feature 1",
        body: "Ready for dev",
        labels: [{ name: "type:feature" }, { name: "area:ci" }],
        project_cards: [{ name: "CI Pipeline" }],
      },
      {
        number: 301,
        title: "Incomplete feature",
        body: "Missing labels",
        labels: [],
        project_cards: [],
      },
      {
        number: 302,
        title: "Feature 3",
        body: "Ready for dev",
        labels: [{ name: "type:feature" }, { name: "area:docs" }],
        project_cards: [{ name: "Documentation" }],
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
      expect(result.stats.warnings).toBeGreaterThanOrEqual(0);
      expect(result.stats.errors).toBeGreaterThanOrEqual(0);
    });

    it("should handle empty batch", async () => {
      const result = await handler.processBatch([], { dryRun: true });
      expect(result.results).toHaveLength(0);
      expect(result.stats.preview).toBe(0);
      expect(result.stats.updated).toBe(0);
      expect(result.stats.warnings).toBe(0);
      expect(result.stats.errors).toBe(0);
    });
  });
});
