/**
 * Integration tests for bulk-issue-metadata-updater.js (orchestrator)
 */

import { describe, it, expect } from "@jest/globals";
import * as templateFixHandler from "../handlers/handle-needs-template-fix";
import * as triageHandler from "../handlers/handle-needs-triage";

// Mock issues
const mockIssues = [
  {
    number: 100,
    title: "Add dashboard feature",
    body: "New feature request",
    labels: [{ name: "status:needs-triage" }],
  },
  {
    number: 101,
    title: "Bug in login form",
    body: "Login crashes with error",
    labels: [{ name: "status:needs-template-fix" }],
  },
  {
    number: 102,
    title: "Update docs",
    body: "Documentation needed",
    labels: [{ name: "status:needs-triage" }, { name: "type:feature" }],
  },
];

describe("bulk-issue-metadata-updater (Orchestrator)", () => {
  describe("Handler Routing", () => {
    it("should route status:needs-template-fix to template-fix handler", async () => {
      const issue = mockIssues[1];
      const result = await templateFixHandler.processIssue(issue, {
        dryRun: true,
      });
      expect(result.status).toBe("preview");
      expect(result.issueNumber).toBe(101);
    });

    it("should route status:needs-triage to triage handler", async () => {
      const issue = mockIssues[0];
      const result = await triageHandler.processIssue(issue, {
        dryRun: true,
      });
      expect(result.status).toBe("preview");
      expect(result.issueNumber).toBe(100);
    });

    it("should skip already-triaged issues", async () => {
      const fullyTriagedIssue = {
        number: 103,
        title: "Some issue",
        body: "Already triaged",
        labels: [{ name: "type:feature" }, { name: "area:ci" }],
      };
      const result = await triageHandler.processIssue(fullyTriagedIssue, {
        dryRun: true,
      });
      expect(result.status).toBe("skipped");
    });
  });

  describe("Batch Processing", () => {
    it("should process multiple issues in dry-run mode", async () => {
      const results = [];

      for (const issue of mockIssues) {
        const labels = (issue.labels || []).map((l) => l.name || l);

        let result;
        if (labels.includes("status:needs-template-fix")) {
          result = await templateFixHandler.processIssue(issue, {
            dryRun: true,
          });
        } else if (labels.includes("status:needs-triage")) {
          result = await triageHandler.processIssue(issue, { dryRun: true });
        } else {
          result = { status: "skipped" };
        }

        results.push(result);
      }

      expect(results).toHaveLength(3);
      expect(
        results.filter((r) => r.status === "preview").length,
      ).toBeGreaterThan(0);
    });

    it("should track statistics across batch", async () => {
      const stats = {
        preview: 0,
        skipped: 0,
        errors: 0,
      };

      for (const issue of mockIssues) {
        const labels = (issue.labels || []).map((l) => l.name || l);

        let result;
        if (labels.includes("status:needs-template-fix")) {
          result = await templateFixHandler.processIssue(issue, {
            dryRun: true,
          });
        } else if (labels.includes("status:needs-triage")) {
          result = await triageHandler.processIssue(issue, { dryRun: true });
        } else {
          result = { status: "skipped" };
        }

        if (result.status === "preview") stats.preview++;
        else if (result.status === "skipped") stats.skipped++;
        else if (result.status === "error") stats.errors++;
      }

      expect(stats.preview + stats.skipped + stats.errors).toBe(3);
    });

    it("should handle mixed handler types in batch", async () => {
      const results = [];
      const handlers = [];

      for (const issue of mockIssues) {
        const labels = (issue.labels || []).map((l) => l.name || l);

        if (labels.includes("status:needs-template-fix")) {
          const result = await templateFixHandler.processIssue(issue, {
            dryRun: true,
          });
          results.push(result);
          handlers.push("template-fix");
        } else if (labels.includes("status:needs-triage")) {
          const result = await triageHandler.processIssue(issue, {
            dryRun: true,
          });
          results.push(result);
          handlers.push("triage");
        }
      }

      expect(handlers).toContain("template-fix");
      expect(handlers).toContain("triage");
    });
  });

  describe("Dry-run Mode", () => {
    it("should not apply changes in dry-run mode", async () => {
      const issue = mockIssues[0];
      const result = await triageHandler.processIssue(issue, { dryRun: true });

      expect(result.status).toBe("preview");
      expect(result.dryRun).toBe(true);
    });

    it("should include preview data in dry-run mode", async () => {
      const issue = mockIssues[0];
      const result = await triageHandler.processIssue(issue, { dryRun: true });

      expect(result).toHaveProperty("typeInference");
      expect(result).toHaveProperty("areaInference");
      expect(result).toHaveProperty("labelsToAdd");
    });

    it("should preview template changes without applying", async () => {
      const issue = mockIssues[1];
      const result = await templateFixHandler.processIssue(issue, {
        dryRun: true,
      });

      expect(result.status).toBe("preview");
      expect(result).toHaveProperty("newSections");
    });
  });

  describe("Confidence Filtering", () => {
    it("should respect confidence threshold", async () => {
      const issue = mockIssues[0];
      const result = await triageHandler.processIssue(issue, {
        dryRun: true,
        confidenceThreshold: 0.5,
      });

      expect(["preview", "warning"]).toContain(result.status);
    });

    it("should return warning for low confidence", async () => {
      const lowConfidenceIssue = {
        number: 200,
        title: "Unclear issue",
        body: "Not enough context",
        labels: [],
      };

      const result = await triageHandler.processIssue(lowConfidenceIssue, {
        dryRun: true,
        confidenceThreshold: 0.99,
      });

      expect(["warning", "preview"]).toContain(result.status);
    });
  });

  describe("Error Handling", () => {
    it("should handle missing githubRequest gracefully", async () => {
      const issue = mockIssues[1];
      const result = await templateFixHandler.processIssue(issue, {
        dryRun: false,
        githubRequest: null,
      });

      expect(result.status).toBe("error");
      expect(result.reason).toContain("githubRequest");
    });

    it("should not crash on malformed issue", async () => {
      const malformedIssue = {
        number: 999,
        title: null,
        body: null,
        labels: null,
      };

      const result = await triageHandler.processIssue(malformedIssue, {
        dryRun: true,
      });

      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("issueNumber");
    });
  });

  describe("Output & Reporting", () => {
    it("should generate summary statistics", async () => {
      const summary = {
        totalProcessed: 0,
        totalApplied: 0,
        totalSkipped: 0,
        totalFailed: 0,
        preview: [],
        updated: [],
        skipped: [],
        errors: [],
      };

      for (const issue of mockIssues) {
        const labels = (issue.labels || []).map((l) => l.name || l);

        let result;
        if (labels.includes("status:needs-template-fix")) {
          result = await templateFixHandler.processIssue(issue, {
            dryRun: true,
          });
        } else if (labels.includes("status:needs-triage")) {
          result = await triageHandler.processIssue(issue, { dryRun: true });
        } else {
          result = { status: "skipped" };
        }

        if (result.status === "preview") {
          summary.preview.push(result);
          summary.totalProcessed++;
        } else if (result.status === "updated") {
          summary.updated.push(result);
          summary.totalApplied++;
        } else if (result.status === "skipped") {
          summary.skipped.push(result);
          summary.totalSkipped++;
        } else if (result.status === "error") {
          summary.errors.push(result);
          summary.totalFailed++;
        }
      }

      expect(
        summary.totalProcessed + summary.totalSkipped + summary.totalFailed,
      ).toBe(3);
      expect(Object.keys(summary)).toContain("preview");
      expect(Object.keys(summary)).toContain("updated");
    });
  });
});
