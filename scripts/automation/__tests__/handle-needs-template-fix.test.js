/**
 * Unit tests for handle-needs-template-fix.js
 */

import { describe, it, expect } from "@jest/globals";
import * as handler from "../handlers/handle-needs-template-fix.js";

describe("handle-needs-template-fix", () => {
  describe("getIssueType", () => {
    it("should identify feature type from labels", () => {
      const issue = {
        labels: [{ name: "type:feature" }],
      };
      expect(handler.getIssueType(issue)).toBe("feature");
    });

    it("should identify bug type from labels", () => {
      const issue = {
        labels: [{ name: "type:bug" }],
      };
      expect(handler.getIssueType(issue)).toBe("bug");
    });

    it("should identify epic type from labels", () => {
      const issue = {
        labels: [{ name: "type:epic" }],
      };
      expect(handler.getIssueType(issue)).toBe("epic");
    });

    it("should identify story type from labels", () => {
      const issue = {
        labels: [{ name: "type:story" }],
      };
      expect(handler.getIssueType(issue)).toBe("story");
    });

    it("should return default when no type label", () => {
      const issue = {
        labels: [{ name: "area:ci" }],
      };
      expect(handler.getIssueType(issue)).toBe("default");
    });

    it("should handle empty labels", () => {
      const issue = { labels: [] };
      expect(handler.getIssueType(issue)).toBe("default");
    });
  });

  describe("getTemplateSections", () => {
    it("should return feature template sections", () => {
      const sections = handler.getTemplateSections("feature");
      expect(sections).toContain("## Definition of Ready");
      expect(sections).toContain("## Definition of Done");
      expect(sections).toContain("Acceptance criteria");
    });

    it("should return bug template sections", () => {
      const sections = handler.getTemplateSections("bug");
      expect(sections).toContain("## Definition of Ready");
      expect(sections).toContain("## Definition of Done");
      expect(sections).toContain("Reproduction steps");
    });

    it("should return default template for unknown type", () => {
      const sections = handler.getTemplateSections("unknown");
      expect(sections).toContain("## Definition of Ready");
      expect(sections).toContain("## Definition of Done");
    });

    it("should include checkboxes in sections", () => {
      const sections = handler.getTemplateSections("feature");
      expect(sections).toMatch(/- \[/);
    });
  });

  describe("processIssue", () => {
    const mockIssue = {
      number: 123,
      title: "Test issue",
      body: "Some existing content",
      labels: [{ name: "type:feature" }],
    };

    it("should skip if issue already has BOTH DoR and DoD sections", async () => {
      const issueWithTemplate = {
        ...mockIssue,
        body: "Content\n\n## Definition of Ready\n\n- [ ] Test\n\n## Definition of Done\n\n- [ ] Verify",
      };

      const result = await handler.processIssue(issueWithTemplate, {
        dryRun: true,
      });
      expect(result.status).toBe("skipped");
      expect(result.reason).toContain("already has");
    });

    it("should return preview in dry-run mode", async () => {
      const result = await handler.processIssue(mockIssue, { dryRun: true });
      expect(result.status).toBe("preview");
      expect(result.dryRun).toBe(true);
      expect(result.issueNumber).toBe(123);
      expect(result.issueType).toBe("feature");
      expect(result.newSections).toBeDefined();
    });

    it("should calculate body diff size correctly", async () => {
      const result = await handler.processIssue(mockIssue, { dryRun: true });
      expect(result.bodyDiffSize).toBeGreaterThan(0);
    });

    it("should handle issues without body", async () => {
      const issueNoBody = {
        number: 124,
        title: "No body issue",
        body: null,
        labels: [{ name: "type:feature" }],
      };

      const result = await handler.processIssue(issueNoBody, { dryRun: true });
      expect(result.status).toBe("preview");
      expect(result.newSections).toBeDefined();
    });

    it("should return error if githubRequest not provided for apply mode", async () => {
      const result = await handler.processIssue(mockIssue, { dryRun: false });
      expect(result.status).toBe("error");
      expect(result.reason).toContain("githubRequest");
    });
  });

  describe("processBatch", () => {
    const mockIssues = [
      {
        number: 1,
        title: "Issue 1",
        body: "Content 1",
        labels: [{ name: "type:feature" }],
      },
      {
        number: 2,
        title: "Issue 2",
        body: "Content 2\n\n## Definition of Ready\n- [ ] Test",
        labels: [{ name: "type:bug" }],
      },
      {
        number: 3,
        title: "Issue 3",
        body: "Content 3",
        labels: [{ name: "type:task" }],
      },
    ];

    it("should process multiple issues", async () => {
      const result = await handler.processBatch(mockIssues, { dryRun: true });
      expect(result.results).toHaveLength(3);
      expect(result.stats).toBeDefined();
    });

    it("should count statistics correctly", async () => {
      const result = await handler.processBatch(mockIssues, { dryRun: true });
      expect(result.stats.preview).toBe(3);
      expect(result.stats.skipped).toBe(0);
      expect(result.stats.updated).toBe(0);
      expect(result.stats.errors).toBe(0);
    });

    it("should handle empty batch", async () => {
      const result = await handler.processBatch([], { dryRun: true });
      expect(result.results).toHaveLength(0);
      expect(result.stats.preview).toBe(0);
    });
  });
});
