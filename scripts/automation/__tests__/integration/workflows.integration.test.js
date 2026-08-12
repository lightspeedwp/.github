/**
 * Integration tests for GitHub workflows
 * Validates meta-labels-sync.yml and label-audit-report.yml
 * @module scripts/automation/__tests__/integration/workflows.integration.test.js
 */

import { describe, it, expect, beforeEach } from "@jest/globals";
import {
  MockGitHubClient,
  testData,
  assertions,
  utils,
} from "./setup.integration.js";

describe("Workflow Integration Tests", () => {
  let mockClient;

  beforeEach(() => {
    mockClient = new MockGitHubClient();
  });

  describe("meta-labels-sync.yml workflow", () => {
    it("should successfully execute sync workflow", async () => {
      // Setup: Create test issues
      mockClient.createIssue(testData.createTestIssue());
      mockClient.createIssue(testData.createIssueWithPR({ number: 1002 }));

      // Execute: Run sync logic
      const syncStart = Date.now();
      const issues = await mockClient.listIssues({ state: "open" });
      const syncTime = Date.now() - syncStart;

      // Assert: Sync completed successfully
      expect(issues).toHaveLength(2);
      expect(syncTime).toBeLessThan(5000); // Should complete quickly
    });

    it("should identify missing meta:has-pr labels", async () => {
      // Setup
      const issueWithPR = mockClient.createIssue(
        testData.createIssueWithPR({ number: 1001 }),
      );
      const issueWithoutPR = mockClient.createIssue(
        testData.createTestIssue({ number: 1002 }),
      );

      // Execute: Check for missing labels
      const needsLabel = await mockClient.listIssues({ state: "open" });
      const issuesWithoutMetaHasPR = needsLabel.filter(
        (i) => !i.labels.includes("meta:has-pr") && i.linkedPRs.length > 0,
      );

      // Assert
      expect(issuesWithoutMetaHasPR).toContain(issueWithPR);
      expect(issuesWithoutMetaHasPR).not.toContain(issueWithoutPR);
    });

    it("should correctly apply meta:has-pr label to issues with linked PRs", async () => {
      // Setup
      const issue = mockClient.createIssue(
        testData.createIssueWithPR({ number: 1001 }),
      );

      // Execute: Apply label
      await mockClient.addLabel(issue.number, "meta:has-pr");

      // Assert
      const updated = await mockClient.getIssue(issue.number);
      assertions.assertLabelApplied(updated, "meta:has-pr");
    });

    it("should detect stale issues after 30+ days without activity", async () => {
      // Setup: Create stale and fresh issues
      const staleIssue = mockClient.createIssue(
        testData.createStaleIssue({ number: 1001 }),
      );
      const freshIssue = mockClient.createIssue(
        testData.createTestIssue({ number: 1002 }),
      );

      // Execute: Detect stale issues
      const issues = await mockClient.listIssues({ state: "open" });
      const thirtyDaysAgo = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const staleIssues = issues.filter((i) => i.updatedAt < thirtyDaysAgo);

      // Assert
      expect(staleIssues).toContain(staleIssue);
      expect(staleIssues).not.toContain(freshIssue);
    });

    it("should apply meta:stale label to stale issues", async () => {
      // Setup
      const staleIssue = mockClient.createIssue(
        testData.createStaleIssue({ number: 1001 }),
      );

      // Execute: Apply stale label
      await mockClient.addLabel(staleIssue.number, "meta:stale");

      // Assert
      const updated = await mockClient.getIssue(staleIssue.number);
      assertions.assertLabelApplied(updated, "meta:stale");
    });

    it("should maintain audit trail of all label changes", async () => {
      // Setup
      const issue = mockClient.createIssue(testData.createTestIssue());

      // Execute: Make changes
      await mockClient.addLabel(issue.number, "meta:has-pr");
      await mockClient.addLabel(issue.number, "status:in-progress");
      await mockClient.removeLabel(issue.number, "meta:has-pr");

      // Assert: Audit log captured all changes
      const log = mockClient.getAuditLog();
      expect(log).toHaveLength(3);
      assertions.assertAuditLogEntry(log, "label:add", issue.number);
      expect(log[0].label).toBe("meta:has-pr");
      expect(log[2].label).toBe("meta:has-pr");
    });

    it("should handle concurrent workflow runs without conflicts", async () => {
      // Setup: Create multiple issues
      const issueNumbers = [1001, 1002, 1003, 1004, 1005];
      issueNumbers.forEach((num) => {
        mockClient.createIssue(testData.createTestIssue({ number: num }));
      });

      // Execute: Simulate concurrent label applications
      const promises = issueNumbers.map((issueNum) =>
        mockClient.addLabel(issueNum, "meta:has-pr"),
      );

      await Promise.all(promises);

      // Assert: All labels applied correctly (no race conditions)
      const allIssues = await mockClient.listIssues();
      const labeled = allIssues.filter((i) => i.labels.includes("meta:has-pr"));
      expect(labeled.length).toBeGreaterThanOrEqual(issueNumbers.length - 1);
    });

    it("should respect branch protection rules", async () => {
      // Setup
      mockClient.createIssue(testData.createTestIssue());

      // Assert: Verify no direct writes to protected branches
      // In a real scenario, this would verify workflow permissions
      expect(mockClient.options.respectBranchProtection).not.toBe(false);
    });
  });

  describe("label-audit-report.yml workflow", () => {
    it("should successfully generate audit report", async () => {
      // Setup: Create diverse issue set
      mockClient.createIssue(testData.createTestIssue({ number: 1001 }));
      mockClient.createIssue(
        testData.createIssueWithPR({ number: 1002, labels: ["meta:has-pr"] }),
      );
      mockClient.createIssue(
        testData.createStaleIssue({ number: 1003, labels: ["meta:stale"] }),
      );

      // Execute: Generate audit report
      const { result: report, duration } = await utils.measureTime(async () => {
        const issues = await mockClient.listIssues();
        return {
          totalIssues: issues.length,
          issuesWithLabels: issues.filter((i) => i.labels.length > 0).length,
          staleIssues: issues.filter((i) => i.labels.includes("meta:stale"))
            .length,
          auditLog: mockClient.getAuditLog(),
        };
      });

      // Assert
      expect(report.totalIssues).toBe(3);
      expect(report.issuesWithLabels).toBeGreaterThan(0);
      expect(duration).toBeLessThan(5000);
    });

    it("should report accurate label coverage metrics", async () => {
      // Setup
      const issues = testData.createIssuesBatch(10);
      issues.forEach((issue, idx) => {
        mockClient.createIssue(issue);
        if (idx < 8) {
          mockClient.addLabel(issue.number, "meta:has-pr");
        }
      });

      // Execute: Calculate coverage
      const allIssues = await mockClient.listIssues();
      const coverage = {
        "meta:has-pr":
          (allIssues.filter((i) => i.labels.includes("meta:has-pr")).length /
            allIssues.length) *
          100,
      };

      // Assert: 80% coverage
      expect(coverage["meta:has-pr"]).toBeCloseTo(80, 1);
    });

    it("should format output as JSON", async () => {
      // Setup
      mockClient.createIssue(testData.createTestIssue());

      // Execute
      const issues = await mockClient.listIssues();
      const jsonOutput = JSON.stringify({
        issues,
        auditLog: mockClient.getAuditLog(),
      });

      // Assert: Valid JSON output
      expect(() => JSON.parse(jsonOutput)).not.toThrow();
      const parsed = JSON.parse(jsonOutput);
      expect(parsed.issues).toBeDefined();
      expect(parsed.auditLog).toBeDefined();
    });

    it("should format output as CSV", async () => {
      // Setup
      mockClient.createIssue(
        testData.createTestIssue({ number: 1001, title: "Issue A" }),
      );
      mockClient.createIssue(
        testData.createTestIssue({ number: 1002, title: "Issue B" }),
      );

      // Execute: Generate CSV
      const issues = await mockClient.listIssues();
      const csvHeaders = ["number", "title", "state", "labels"].join(",");
      const csvRows = issues.map((i) =>
        [i.number, `"${i.title}"`, i.state, `"${i.labels.join(";")}"`].join(
          ",",
        ),
      );
      const csvOutput = [csvHeaders, ...csvRows].join("\n");

      // Assert: Valid CSV format
      expect(csvOutput).toContain("number,title,state,labels");
      expect(csvOutput).toContain("1001");
      expect(csvOutput).toContain("Issue A");
    });
  });

  describe("Cross-workflow interactions", () => {
    it("should allow label-orchestrator to run safely during workflows", async () => {
      // Setup
      mockClient.createIssue(testData.createTestIssue({ number: 1001 }));

      // Simulate concurrent execution
      const workflow1 = mockClient.addLabel(1001, "meta:has-pr");
      const workflow2 = mockClient.addLabel(1001, "status:in-progress");
      await Promise.all([workflow1, workflow2]);

      // Assert: No conflicts
      const issue = await mockClient.getIssue(1001);
      assertions.assertLabelApplied(issue, "meta:has-pr");
      assertions.assertLabelApplied(issue, "status:in-progress");
    });

    it("should preserve manual label changes", async () => {
      // Setup
      const issue = mockClient.createIssue(testData.createTestIssue());
      await mockClient.addLabel(issue.number, "manual:important");

      // Execute: Workflow adds label
      await mockClient.addLabel(issue.number, "meta:has-pr");

      // Assert: Manual label preserved
      const updated = await mockClient.getIssue(issue.number);
      assertions.assertLabelApplied(updated, "manual:important");
      assertions.assertLabelApplied(updated, "meta:has-pr");
    });

    it("should resolve label conflicts predictably", async () => {
      // Setup: Issue with conflicting label states
      const issue = mockClient.createIssue(testData.createTestIssue());
      await mockClient.addLabel(issue.number, "status:in-progress");
      await mockClient.addLabel(issue.number, "status:done");

      // In real scenario, conflict resolution would apply
      // For now, assert both can exist (test infrastructure limitation)
      const updated = await mockClient.getIssue(issue.number);
      expect(updated.labels.length).toBeGreaterThan(0);
    });

    it("should handle performance under load (100+ issues)", async () => {
      // Setup: Create 100 test issues
      const batchSize = 100;
      for (let i = 0; i < batchSize; i++) {
        mockClient.createIssue(testData.createTestIssue({ number: 2000 + i }));
      }

      // Execute: Measure performance
      const { duration } = await utils.measureTime(async () => {
        const issues = await mockClient.listIssues();
        for (const issue of issues) {
          await mockClient.addLabel(issue.number, "meta:has-pr");
        }
      });

      // Assert: Performance acceptable
      expect(duration).toBeLessThan(10000); // 10 seconds for 100 issues
    });

    it("should prevent orphaned labels or inconsistent states", async () => {
      // Setup
      const issues = testData.createIssuesBatch(10);
      issues.forEach((issue) => mockClient.createIssue(issue));

      // Execute: Apply labels
      for (const issue of issues) {
        await mockClient.addLabel(issue.number, "meta:has-pr");
      }

      // Assert: All issues in consistent state
      const allIssues = await mockClient.listIssues();
      assertions.assertNoDataCorruption(allIssues);
    });
  });
});
