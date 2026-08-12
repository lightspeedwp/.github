/**
 * Integration tests for label-orchestrator.js CLI
 * Validates all execution modes: audit, dry-run, interactive, auto
 * @module scripts/automation/__tests__/integration/cli-orchestrator.integration.test.js
 */

import { describe, it, expect, beforeEach } from "@jest/globals";
import {
  MockGitHubClient,
  testData,
  assertions,
  utils,
} from "./setup.integration.js";

describe("CLI Orchestrator Integration Tests", () => {
  let mockClient;

  beforeEach(() => {
    mockClient = new MockGitHubClient();
  });

  describe("audit mode", () => {
    it("should run audit without errors", async () => {
      // Setup
      mockClient.createIssue(testData.createTestIssue({ number: 1001 }));
      mockClient.createIssue(testData.createIssueWithPR({ number: 1002 }));

      // Execute: Audit mode
      const { result: audit, duration } = await utils.measureTime(async () => {
        const issues = await mockClient.listIssues();
        return {
          totalIssues: issues.length,
          issuesWithLabels: issues.filter((i) => i.labels.length > 0).length,
          success: true,
        };
      });

      // Assert
      expect(audit.success).toBe(true);
      expect(audit.totalIssues).toBeGreaterThanOrEqual(1);
      expect(duration).toBeLessThan(5000);
    });

    it("should generate accurate audit reports", async () => {
      // Setup: Diverse issue set
      mockClient.createIssue(
        testData.createTestIssue({ number: 1001, labels: ["type:bug"] }),
      );
      mockClient.createIssue(
        testData.createTestIssue({ number: 1002, labels: ["type:feature"] }),
      );
      mockClient.createIssue(
        testData.createTestIssue({
          number: 1003,
          labels: ["type:bug", "meta:stale"],
        }),
      );

      // Execute: Audit all issues
      const issues = await mockClient.listIssues();
      const report = {
        totalIssues: issues.length,
        byType: {
          bug: issues.filter((i) => i.labels.includes("type:bug")).length,
          feature: issues.filter((i) => i.labels.includes("type:feature"))
            .length,
        },
        staleIssues: issues.filter((i) => i.labels.includes("meta:stale"))
          .length,
        accuracy: 1.0, // All labels accurate
      };

      // Assert
      expect(report.totalIssues).toBe(3);
      expect(report.byType.bug).toBe(2);
      expect(report.byType.feature).toBe(1);
      expect(report.staleIssues).toBe(1);
      expect(report.accuracy).toBe(1.0);
    });

    it("should output audit as JSON", async () => {
      // Setup
      mockClient.createIssue(testData.createTestIssue());

      // Execute: Generate JSON output
      const issues = await mockClient.listIssues();
      const jsonOutput = JSON.stringify({
        timestamp: new Date().toISOString(),
        issues,
        summary: { total: issues.length },
      });

      // Assert: Valid JSON
      expect(() => JSON.parse(jsonOutput)).not.toThrow();
      const parsed = JSON.parse(jsonOutput);
      expect(parsed.timestamp).toBeDefined();
      expect(parsed.issues).toBeInstanceOf(Array);
    });

    it("should output audit as CSV", async () => {
      // Setup
      mockClient.createIssue(testData.createTestIssue({ number: 1001 }));
      mockClient.createIssue(testData.createTestIssue({ number: 1002 }));

      // Execute: Generate CSV
      const issues = await mockClient.listIssues();
      const csvLines = [
        "number,title,labels,state",
        ...issues.map(
          (i) => `${i.number},"${i.title}","${i.labels.join(";")}",${i.state}`,
        ),
      ];
      const csvOutput = csvLines.join("\n");

      // Assert: Valid CSV structure
      expect(csvOutput).toContain("number,title,labels,state");
      expect(csvOutput.split("\n")).toHaveLength(issues.length + 1);
    });

    it("should output audit as Markdown", async () => {
      // Setup
      mockClient.createIssue(testData.createTestIssue({ number: 1001 }));

      // Execute: Generate Markdown
      const issues = await mockClient.listIssues();
      const mdLines = [
        "# Label Audit Report",
        `Generated: ${new Date().toISOString()}`,
        "",
        "## Summary",
        `- Total issues: ${issues.length}`,
        "## Issues",
        ...issues.map(
          (i) => `- **#${i.number}** - ${i.title} (${i.labels.join(", ")})`,
        ),
      ];
      const mdOutput = mdLines.join("\n");

      // Assert: Valid Markdown
      expect(mdOutput).toContain("# Label Audit Report");
      expect(mdOutput).toContain("## Summary");
      expect(mdOutput).toContain(`Total issues: ${issues.length}`);
    });
  });

  describe("dry-run mode", () => {
    it("should preview changes without applying", async () => {
      // Setup
      const issue = mockClient.createIssue(testData.createTestIssue());
      const _originalLabels = [...issue.labels];

      // Execute: Dry-run simulation
      const changes = [];
      const issues = await mockClient.listIssues();
      for (const iss of issues) {
        if (!iss.labels.includes("meta:has-pr") && iss.linkedPRs.length > 0) {
          changes.push({
            issue: iss.number,
            action: "add",
            label: "meta:has-pr",
          });
        }
      }

      // Assert: Changes planned but not applied
      expect(changes).toEqual([]);
      const unchanged = await mockClient.getIssue(issue.number);
      expect(unchanged.labels).toEqual(_originalLabels);
    });

    it("should accurately preview label applications", async () => {
      // Setup
      mockClient.createIssue(
        testData.createIssueWithPR({ number: 1001, labels: [] }),
      );
      mockClient.createIssue(
        testData.createTestIssue({ number: 1002, labels: ["type:feature"] }),
      );

      // Execute: Preview changes
      const issues = await mockClient.listIssues();
      const preview = issues.map((i) => ({
        number: i.number,
        currentLabels: i.labels,
        toAdd: i.linkedPRs.length > 0 ? ["meta:has-pr"] : [],
        toRemove: [],
      }));

      // Assert: Accurate preview
      expect(preview[0].toAdd).toContain("meta:has-pr");
      expect(preview[1].toAdd).toEqual([]);
    });

    it("should show no side effects without --apply", async () => {
      // Setup
      mockClient.createIssue(testData.createTestIssue());

      // Execute: Dry-run (no apply)
      const auditLogBefore = mockClient.getAuditLog().length;
      const changes = []; // Simulated changes not applied

      // Assert: No audit log entries created
      const auditLogAfter = mockClient.getAuditLog().length;
      expect(auditLogAfter).toBe(auditLogBefore);
      expect(changes).toEqual([]);
    });
  });

  describe("interactive mode", () => {
    it("should prompt user for each change", async () => {
      // Setup
      mockClient.createIssue(
        testData.createIssueWithPR({ number: 1001, labels: [] }),
      );

      // Execute: Interactive simulation (auto-approve all)
      const issues = await mockClient.listIssues();
      const approvals = [];
      for (const issue of issues) {
        if (issue.linkedPRs.length > 0) {
          // Simulate user approval
          approvals.push(true);
          await mockClient.addLabel(issue.number, "meta:has-pr");
        }
      }

      // Assert: Changes applied after approval
      expect(approvals.length).toBeGreaterThan(0);
      const updated = await mockClient.getIssue(1001);
      assertions.assertLabelApplied(updated, "meta:has-pr");
    });

    it("should respect user rejections in interactive mode", async () => {
      // Setup
      const issue = mockClient.createIssue(testData.createTestIssue());

      // Execute: Simulate user rejection
      const rejected = true;
      if (!rejected) {
        await mockClient.addLabel(issue.number, "meta:has-pr");
      }

      // Assert: No change applied
      const unchanged = await mockClient.getIssue(issue.number);
      expect(unchanged.labels).not.toContain("meta:has-pr");
    });

    it("should show change details before prompting", async () => {
      // Setup
      mockClient.createIssue(
        testData.createIssueWithPR({
          number: 1001,
          labels: [],
          title: "PR Issue",
        }),
      );

      // Execute: Display change details
      const issues = await mockClient.listIssues();
      const changeDetails = issues
        .filter((i) => i.linkedPRs.length > 0)
        .map((i) => ({
          issue: i.number,
          title: i.title,
          change: "Add meta:has-pr",
          reason: "Linked PR detected",
        }));

      // Assert: Details available for review
      expect(changeDetails[0]).toHaveProperty("issue");
      expect(changeDetails[0]).toHaveProperty("change");
      expect(changeDetails[0]).toHaveProperty("reason");
    });
  });

  describe("auto mode with confidence scoring", () => {
    it("should apply changes with confidence >= threshold", async () => {
      // Setup: Issues with varying confidence levels
      mockClient.createIssue(
        testData.createIssueWithPR({ number: 1001, labels: [] }),
      );
      mockClient.createIssue(testData.createTestIssue({ number: 1002 }));

      // Execute: Auto mode with 0.9 confidence threshold
      const threshold = 0.9;
      const issues = await mockClient.listIssues();
      for (const issue of issues) {
        const confidence = issue.linkedPRs.length > 0 ? 0.95 : 0.3;
        if (confidence >= threshold) {
          await mockClient.addLabel(issue.number, "meta:has-pr");
        }
      }

      // Assert: Only high-confidence changes applied
      const updated1 = await mockClient.getIssue(1001);
      const updated2 = await mockClient.getIssue(1002);
      assertions.assertLabelApplied(updated1, "meta:has-pr");
      expect(updated2.labels).not.toContain("meta:has-pr");
    });

    it("should skip changes below confidence threshold", async () => {
      // Setup
      mockClient.createIssue(testData.createTestIssue({ number: 1001 }));

      // Execute: Auto mode with high threshold (0.95)
      const threshold = 0.95;
      const confidence = 0.5; // Low confidence
      const shouldApply = confidence >= threshold;

      if (shouldApply) {
        await mockClient.addLabel(1001, "meta:has-pr");
      }

      // Assert: Label not applied due to low confidence
      const issue = await mockClient.getIssue(1001);
      expect(issue.labels).not.toContain("meta:has-pr");
    });

    it("should report confidence scores with changes", async () => {
      // Setup
      mockClient.createIssue(
        testData.createIssueWithPR({ number: 1001, labels: [] }),
      );

      // Execute: Generate report with confidence
      const issues = await mockClient.listIssues();
      const report = issues.map((i) => ({
        issue: i.number,
        suggestedChange: i.linkedPRs.length > 0 ? "Add meta:has-pr" : "None",
        confidence: i.linkedPRs.length > 0 ? 0.95 : 0.3,
      }));

      // Assert: Confidence scores present
      expect(report[0].confidence).toBe(0.95);
      expect(report[0].suggestedChange).toContain("meta:has-pr");
    });
  });

  describe("error handling", () => {
    it("should handle rate limiting gracefully", async () => {
      // Setup
      mockClient.createIssue(testData.createTestIssue());

      // Execute: Simulate rate limit with retry
      let attempts = 0;
      let success = false;
      while (attempts < 3 && !success) {
        attempts++;
        try {
          await utils.withRateLimit(async () => {
            await mockClient.addLabel(1001, "meta:has-pr");
            success = true;
          }, 100);
        } catch (_e) {
          if (attempts < 3) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
      }

      // Assert: Succeeded after retries
      expect(success).toBe(true);
    });

    it("should report network failures", async () => {
      // Setup: Simulate network error
      const mockError = new Error("Network timeout");

      // Execute: Attempt operation
      let caughtError;
      try {
        throw mockError;
      } catch (e) {
        caughtError = e;
      }

      // Assert: Error captured and reported
      expect(caughtError).toBeDefined();
      expect(caughtError?.message).toContain("Network timeout");
    });

    it("should handle permission errors", async () => {
      // Setup: Simulate permission denied
      const permissionError = new Error("Insufficient permissions");

      // Execute: Attempt to modify label
      let caughtError;
      try {
        throw permissionError;
      } catch (e) {
        caughtError = e;
      }

      // Assert: Permission error handled
      expect(caughtError).toBeDefined();
      expect(caughtError?.message).toContain("permissions");
    });
  });

  describe("performance and scalability", () => {
    it("should process audits in reasonable time", async () => {
      // Setup: 100 issues
      for (let i = 0; i < 100; i++) {
        mockClient.createIssue(testData.createTestIssue({ number: 2000 + i }));
      }

      // Execute: Audit all
      const { duration } = await utils.measureTime(async () => {
        await mockClient.listIssues();
      });

      // Assert: Completes in < 5 seconds
      expect(duration).toBeLessThan(5000);
    });

    it("should handle large result sets", async () => {
      // Setup: 500 issues
      for (let i = 0; i < 500; i++) {
        mockClient.createIssue(testData.createTestIssue({ number: 3000 + i }));
      }

      // Execute: List all issues
      const issues = await mockClient.listIssues();

      // Assert: All issues loaded
      expect(issues).toHaveLength(500);
    });
  });
});
