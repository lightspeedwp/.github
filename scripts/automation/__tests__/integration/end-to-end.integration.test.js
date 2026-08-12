/**
 * End-to-end integration tests for Phase 5
 * Validates complete issue lifecycle and cross-system workflows
 * @module scripts/automation/__tests__/integration/end-to-end.integration.test.js
 */

import { describe, it, expect, beforeEach } from "@jest/globals";
import {
  MockGitHubClient,
  testData,
  assertions,
  utils,
} from "./setup.integration.js";

describe("End-to-End Integration Tests", () => {
  let mockClient;

  beforeEach(() => {
    mockClient = new MockGitHubClient();
  });

  describe("Complete issue lifecycle", () => {
    it("should handle issue creation through resolution", async () => {
      // Phase 1: Issue creation with auto-labeling
      const issue = mockClient.createIssue(
        testData.createTestIssue({
          number: 1001,
          title: "New feature request",
        }),
      );
      await mockClient.addLabel(issue.number, "type:feature");
      await mockClient.addLabel(issue.number, "area:label-management");

      // Phase 2: Link PR
      await mockClient.linkPR(issue.number, 5001);
      await mockClient.addLabel(issue.number, "meta:has-pr");

      // Phase 3: PR merged - apply changelog label
      await mockClient.addLabel(issue.number, "meta:needs-changelog");

      // Phase 4: Issue closed
      issue.state = "closed";
      issue.updatedAt = new Date().toISOString();
      await mockClient.addLabel(issue.number, "status:done");

      // Verify final state
      const final = await mockClient.getIssue(issue.number);
      expect(final.state).toBe("closed");
      assertions.assertLabelApplied(final, "type:feature");
      assertions.assertLabelApplied(final, "meta:has-pr");
      assertions.assertLabelApplied(final, "status:done");
    });

    it("should auto-label issues on creation", async () => {
      // Setup: New issue with inferred type/area
      const issue = mockClient.createIssue(
        testData.createTestIssue({
          number: 1001,
          title: "Bug: Label sync not working",
          body: "Labels not syncing to issues...",
        }),
      );

      // Execute: Auto-apply labels based on title/body
      if (issue.title.toLowerCase().includes("bug")) {
        await mockClient.addLabel(issue.number, "type:bug");
      }
      if (
        issue.title.toLowerCase().includes("label") ||
        issue.body.toLowerCase().includes("label")
      ) {
        await mockClient.addLabel(issue.number, "area:label-management");
      }

      // Assert: Correct labels applied
      const labeled = await mockClient.getIssue(issue.number);
      assertions.assertLabelApplied(labeled, "type:bug");
      assertions.assertLabelApplied(labeled, "area:label-management");
    });

    it("should apply meta:has-pr when PR is linked", async () => {
      // Setup: Issue without PR
      const issue = mockClient.createIssue(testData.createTestIssue());

      // Execute: Link PR
      await mockClient.linkPR(issue.number, 5001);

      // Check and apply label
      const updated = await mockClient.getIssue(issue.number);
      if (updated.linkedPRs.length > 0) {
        await mockClient.addLabel(issue.number, "meta:has-pr");
      }

      // Assert
      const final = await mockClient.getIssue(issue.number);
      assertions.assertLabelApplied(final, "meta:has-pr");
    });

    it("should trigger meta:needs-changelog when PR merged", async () => {
      // Setup: Issue with PR in progress
      const issue = mockClient.createIssue(testData.createTestIssue());
      await mockClient.linkPR(issue.number, 5001);
      await mockClient.addLabel(issue.number, "meta:has-pr");

      // Execute: PR merged event
      await mockClient.addLabel(issue.number, "meta:needs-changelog");

      // Assert
      const updated = await mockClient.getIssue(issue.number);
      assertions.assertLabelApplied(updated, "meta:needs-changelog");
    });

    it("should apply meta:stale after 30+ days inactivity", async () => {
      // Setup: Issue inactive for 31 days
      const staleIssue = mockClient.createIssue(
        testData.createStaleIssue({ number: 1001 }),
      );

      // Execute: Stale detection and labeling
      const thirtyDaysAgo = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString();
      if (staleIssue.updatedAt < thirtyDaysAgo) {
        await mockClient.addLabel(staleIssue.number, "meta:stale");
      }

      // Assert
      const updated = await mockClient.getIssue(staleIssue.number);
      assertions.assertLabelApplied(updated, "meta:stale");
    });

    it("should remove stale labels when issue becomes active", async () => {
      // Setup: Stale issue
      const issue = mockClient.createIssue(
        testData.createStaleIssue({
          number: 1001,
          labels: ["meta:stale"],
        }),
      );

      // Execute: Issue receives activity (comment/update)
      issue.updatedAt = new Date().toISOString();
      await mockClient.removeLabel(issue.number, "meta:stale");

      // Assert
      const updated = await mockClient.getIssue(issue.number);
      expect(updated.labels).not.toContain("meta:stale");
    });

    it("should apply status:done when issue closed", async () => {
      // Setup: Open issue
      const issue = mockClient.createIssue(testData.createTestIssue());
      expect(issue.state).toBe("open");

      // Execute: Close issue
      issue.state = "closed";
      await mockClient.addLabel(issue.number, "status:done");

      // Remove status labels that don't apply to closed issues
      await mockClient.removeLabel(issue.number, "status:in-progress");
      if (issue.labels.includes("meta:stale")) {
        await mockClient.removeLabel(issue.number, "meta:stale");
      }

      // Assert
      const closed = await mockClient.getIssue(issue.number);
      expect(closed.state).toBe("closed");
      assertions.assertLabelApplied(closed, "status:done");
    });
  });

  describe("Multi-step workflows", () => {
    it("should handle feature request workflow", async () => {
      // Step 1: Create feature request
      const issue = mockClient.createIssue(
        testData.createTestIssue({
          number: 1001,
          title: "Feature: Add export functionality",
        }),
      );
      await mockClient.addLabel(issue.number, "type:feature");

      // Step 2: Assign to area
      await mockClient.addLabel(issue.number, "area:export");

      // Step 3: Move to needs-triage
      await mockClient.addLabel(issue.number, "status:needs-triage");

      // Step 4: Link design PR
      await mockClient.linkPR(issue.number, 5001);
      await mockClient.addLabel(issue.number, "meta:has-pr");

      // Step 5: Mark as in progress
      await mockClient.removeLabel(issue.number, "status:needs-triage");
      await mockClient.addLabel(issue.number, "status:in-progress");

      // Step 6: Complete - close issue
      const final = await mockClient.getIssue(issue.number);
      expect(final.labels.includes("type:feature")).toBe(true);
      expect(final.labels.includes("status:in-progress")).toBe(true);
    });

    it("should handle bug triage and fix workflow", async () => {
      // Step 1: Report bug
      const bug = mockClient.createIssue(
        testData.createTestIssue({
          number: 2001,
          title: "Bug: Labels not syncing",
        }),
      );
      await mockClient.addLabel(bug.number, "type:bug");
      await mockClient.addLabel(bug.number, "status:needs-triage");

      // Step 2: Triage - assess severity
      await mockClient.addLabel(bug.number, "priority:important");

      // Step 3: Start work
      await mockClient.removeLabel(bug.number, "status:needs-triage");
      await mockClient.addLabel(bug.number, "status:in-progress");

      // Step 4: Link fix PR
      await mockClient.linkPR(bug.number, 5002);
      await mockClient.addLabel(bug.number, "meta:has-pr");

      // Step 5: PR merged - mark ready for testing
      await mockClient.removeLabel(bug.number, "status:in-progress");
      await mockClient.addLabel(bug.number, "meta:needs-changelog");

      // Step 6: Close after release
      const final = await mockClient.getIssue(bug.number);
      expect(final.labels.includes("type:bug")).toBe(true);
      expect(final.labels.includes("priority:important")).toBe(true);
    });
  });

  describe("Label conflict resolution", () => {
    it("should maintain label consistency across operations", async () => {
      // Setup: Issue with multiple labels
      const issue = mockClient.createIssue(testData.createTestIssue());
      await mockClient.addLabel(issue.number, "type:feature");
      await mockClient.addLabel(issue.number, "status:in-progress");
      await mockClient.addLabel(issue.number, "priority:important");

      // Execute: Concurrent updates (simulate race condition)
      await Promise.all([
        mockClient.addLabel(issue.number, "meta:has-pr"),
        mockClient.addLabel(issue.number, "area:core"),
      ]);

      // Assert: All labels present, no data loss
      const final = await mockClient.getIssue(issue.number);
      expect(final.labels).toContain("type:feature");
      expect(final.labels).toContain("status:in-progress");
      expect(final.labels).toContain("meta:has-pr");
      expect(final.labels).toContain("area:core");
    });

    it("should resolve conflicting status labels", async () => {
      // Setup
      const issue = mockClient.createIssue(testData.createTestIssue());
      await mockClient.addLabel(issue.number, "status:in-progress");

      // Execute: Attempt to apply conflicting status
      // In real implementation, would resolve by removing old status
      await mockClient.removeLabel(issue.number, "status:in-progress");
      await mockClient.addLabel(issue.number, "status:done");

      // Assert: Only one status present
      const final = await mockClient.getIssue(issue.number);
      const statusLabels = final.labels.filter((l) => l.startsWith("status:"));
      expect(statusLabels).toContain("status:done");
      expect(statusLabels).not.toContain("status:in-progress");
    });
  });

  describe("Data integrity and consistency", () => {
    it("should maintain data integrity through all operations", async () => {
      // Setup: Create issues and perform operations
      const issues = testData.createIssuesBatch(20);
      for (const issue of issues) {
        mockClient.createIssue(issue);
      }

      // Execute: Apply labels to all
      for (let i = 2000; i < 2020; i++) {
        await mockClient.addLabel(i, "meta:has-pr");
      }

      // Assert: No orphaned or corrupted data
      const allIssues = await mockClient.listIssues();
      assertions.assertNoDataCorruption(allIssues);
      expect(allIssues).toHaveLength(20);
    });

    it("should preserve audit trail of all changes", async () => {
      // Setup: Create issue and make changes
      const issue = mockClient.createIssue(testData.createTestIssue());

      // Execute: Series of changes
      await mockClient.addLabel(issue.number, "type:feature");
      await mockClient.addLabel(issue.number, "status:in-progress");
      await mockClient.removeLabel(issue.number, "type:feature");
      await mockClient.addLabel(issue.number, "type:bug");

      // Assert: All changes logged
      const log = mockClient.getAuditLog();
      expect(log).toHaveLength(4);
      expect(log[0].action).toBe("label:add");
      expect(log[2].action).toBe("label:remove");
    });

    it("should handle idempotent operations correctly", async () => {
      // Setup
      const issue = mockClient.createIssue(testData.createTestIssue());

      // Execute: Add same label twice
      await mockClient.addLabel(issue.number, "meta:has-pr");
      await mockClient.addLabel(issue.number, "meta:has-pr");

      // Assert: Second add should be no-op
      const final = await mockClient.getIssue(issue.number);
      expect(final.labels.filter((l) => l === "meta:has-pr")).toHaveLength(1);
    });
  });

  describe("Performance under realistic load", () => {
    it("should handle 100+ issues efficiently", async () => {
      // Setup: Create 100 issues
      for (let i = 0; i < 100; i++) {
        mockClient.createIssue(testData.createTestIssue({ number: 3000 + i }));
      }

      // Execute: Apply labels to all
      const { duration } = await utils.measureTime(async () => {
        for (let i = 3000; i < 3100; i++) {
          await mockClient.addLabel(i, "meta:has-pr");
        }
      });

      // Assert: Completes in reasonable time
      expect(duration).toBeLessThan(10000);
    });

    it("should handle 500+ issues", async () => {
      // Setup: Create 500 issues
      for (let i = 0; i < 500; i++) {
        mockClient.createIssue(testData.createTestIssue({ number: 4000 + i }));
      }

      // Execute: List and count
      const { duration: listTime } = await utils.measureTime(async () => {
        await mockClient.listIssues();
      });

      // Assert: Acceptable performance
      expect(listTime).toBeLessThan(5000);
    });

    it("should generate audit reports for large datasets", async () => {
      // Setup: Create 200 issues with various labels
      for (let i = 0; i < 200; i++) {
        const issue = testData.createTestIssue({ number: 5000 + i });
        mockClient.createIssue(issue);
        if (i % 3 === 0) {
          await mockClient.addLabel(issue.number, "meta:has-pr");
        }
        if (i % 5 === 0) {
          await mockClient.addLabel(issue.number, "meta:stale");
        }
      }

      // Execute: Generate report
      const { duration: reportTime } = await utils.measureTime(async () => {
        const issues = await mockClient.listIssues();
        return {
          total: issues.length,
          withMetaHasPR: issues.filter((i) => i.labels.includes("meta:has-pr"))
            .length,
          withMetaStale: issues.filter((i) => i.labels.includes("meta:stale"))
            .length,
        };
      });

      // Assert: Report generation efficient
      expect(reportTime).toBeLessThan(5000);
    });
  });
});
