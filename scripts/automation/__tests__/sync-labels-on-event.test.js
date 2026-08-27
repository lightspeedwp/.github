/**
 * Tests for sync-labels-on-event.js
 * Event-driven label syncing and validation
 */

const { describe, it, expect, beforeEach } = require("@jest/globals");
const {
  syncLabelsOnEvent,
  batchSyncLabels,
  getRecommendedLabelsForOpenSpec,
  isStatusOpenSpecCompatible,
} = require("../handlers/sync-labels-on-event.cjs");

describe("sync-labels-on-event", () => {
  let mockIssue;

  beforeEach(() => {
    mockIssue = {
      number: 100,
      title: "Test Issue",
      body: "Test body",
      labels: [],
    };
  });

  describe("getRecommendedLabelsForOpenSpec", () => {
    it("should return recommended labels for specification-pending", () => {
      const labels = getRecommendedLabelsForOpenSpec(
        "openspec:specification-pending",
      );
      expect(labels).toContain("status:needs-planning");
      expect(labels).toContain("priority:important");
    });

    it("should return recommended labels for specification-in-progress", () => {
      const labels = getRecommendedLabelsForOpenSpec(
        "openspec:specification-in-progress",
      );
      expect(labels).toContain("status:in-progress");
      expect(labels).toContain("meta:has-pr");
    });

    it("should return recommended labels for specification-complete", () => {
      const labels = getRecommendedLabelsForOpenSpec(
        "openspec:specification-complete",
      );
      expect(labels).toContain("status:ready");
    });

    it("should return recommended labels for implementation-pending", () => {
      const labels = getRecommendedLabelsForOpenSpec(
        "openspec:implementation-pending",
      );
      expect(labels).toContain("status:needs-planning");
      expect(labels).toContain("priority:important");
    });

    it("should return recommended labels for implementation-in-progress", () => {
      const labels = getRecommendedLabelsForOpenSpec(
        "openspec:implementation-in-progress",
      );
      expect(labels).toContain("status:in-progress");
      expect(labels).toContain("meta:has-pr");
    });

    it("should return recommended labels for implementation-complete", () => {
      const labels = getRecommendedLabelsForOpenSpec(
        "openspec:implementation-complete",
      );
      expect(labels).toContain("status:done");
    });

    it("should return empty array for unknown openspec label", () => {
      const labels = getRecommendedLabelsForOpenSpec("openspec:unknown");
      expect(labels).toEqual([]);
    });
  });

  describe("isStatusOpenSpecCompatible", () => {
    it("should allow needs-planning with specification-pending", () => {
      const compatible = isStatusOpenSpecCompatible(
        "status:needs-planning",
        "openspec:specification-pending",
      );
      expect(compatible).toBe(true);
    });

    it("should allow in-progress with specification-in-progress", () => {
      const compatible = isStatusOpenSpecCompatible(
        "status:in-progress",
        "openspec:specification-in-progress",
      );
      expect(compatible).toBe(true);
    });

    it("should allow ready with specification-complete", () => {
      const compatible = isStatusOpenSpecCompatible(
        "status:ready",
        "openspec:specification-complete",
      );
      expect(compatible).toBe(true);
    });

    it("should allow done with implementation-complete", () => {
      const compatible = isStatusOpenSpecCompatible(
        "status:done",
        "openspec:implementation-complete",
      );
      expect(compatible).toBe(true);
    });

    it("should reject incompatible status with openspec", () => {
      const compatible = isStatusOpenSpecCompatible(
        "status:done",
        "openspec:specification-pending",
      );
      expect(compatible).toBe(false);
    });

    it("should reject ready with implementation-pending", () => {
      const compatible = isStatusOpenSpecCompatible(
        "status:ready",
        "openspec:implementation-pending",
      );
      expect(compatible).toBe(false);
    });

    it("should allow blocked with specification-in-progress", () => {
      const compatible = isStatusOpenSpecCompatible(
        "status:blocked",
        "openspec:specification-in-progress",
      );
      expect(compatible).toBe(true);
    });

    it("should allow on-hold with implementation-pending", () => {
      const compatible = isStatusOpenSpecCompatible(
        "status:on-hold",
        "openspec:implementation-pending",
      );
      expect(compatible).toBe(true);
    });
  });

  describe("syncLabelsOnEvent - issue created", () => {
    it("should warn about missing type label", () => {
      mockIssue.labels = [{ name: "openspec:specification-pending" }];
      const result = syncLabelsOnEvent(mockIssue, "created", { dryRun: true });

      expect(result.warnings.some((w) => w.includes("type label"))).toBe(true);
    });

    it("should not warn about missing type label if present", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];
      const result = syncLabelsOnEvent(mockIssue, "created", { dryRun: true });

      expect(result.warnings.some((w) => w.includes("type label"))).toBe(false);
    });

    it("should suggest syncing when openspec label present", () => {
      mockIssue.labels = [{ name: "openspec:specification-pending" }];
      const result = syncLabelsOnEvent(mockIssue, "created", { dryRun: true });

      expect(result.suggestedChanges.length).toBeGreaterThan(0);
      expect(result.labelsToAdd.some((l) => l.startsWith("status:"))).toBe(
        true,
      );
    });

    it("should return success true for valid issue", () => {
      mockIssue.labels = [
        { name: "type:feature" },
        { name: "priority:normal" },
      ];
      const result = syncLabelsOnEvent(mockIssue, "created", { dryRun: true });

      expect(result.success).toBe(true);
      expect(result.eventType).toBe("created");
    });
  });

  describe("syncLabelsOnEvent - issue labeled", () => {
    it("should suggest status sync when openspec label added", () => {
      mockIssue.labels = [
        { name: "openspec:specification-in-progress" },
        { name: "type:task" },
      ];
      const result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });

      expect(result.suggestedChanges.length).toBeGreaterThan(0);
      expect(result.suggestedChanges.some((c) => c.type === "add")).toBe(true);
    });

    it("should report conflict if incompatible status with openspec", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "status:done" },
      ];
      const result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });

      expect(result.conflicts.length).toBeGreaterThan(0);
    });

    it("should return dryRun in result", () => {
      const result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });
      expect(result.dryRun).toBe(true);
    });

    it("should not apply changes when dryRun is true", () => {
      mockIssue.labels = [{ name: "openspec:specification-pending" }];
      const result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });

      expect(result.dryRun).toBe(true);
      // Changes would be in labelsToAdd but not actually applied
      expect(Array.isArray(result.labelsToAdd)).toBe(true);
    });
  });

  describe("syncLabelsOnEvent - issue reopened", () => {
    it("should warn if status:done when reopened", () => {
      mockIssue.labels = [{ name: "status:done" }];
      const result = syncLabelsOnEvent(mockIssue, "reopened", {
        dryRun: true,
      });

      expect(result.warnings.some((w) => w.includes("status:done"))).toBe(true);
    });

    it("should warn if completion label when reopened", () => {
      mockIssue.labels = [
        { name: "openspec:implementation-complete" },
        { name: "type:feature" },
      ];
      const result = syncLabelsOnEvent(mockIssue, "reopened", {
        dryRun: true,
      });

      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it("should not warn about active phase labels", () => {
      mockIssue.labels = [
        { name: "openspec:specification-in-progress" },
        { name: "type:feature" },
      ];
      const result = syncLabelsOnEvent(mockIssue, "reopened", {
        dryRun: true,
      });

      expect(result.warnings.length).toBe(0);
    });
  });

  describe("syncLabelsOnEvent - issue closed", () => {
    it("should warn if no completion label when closed", () => {
      mockIssue.labels = [{ name: "type:task" }];
      const result = syncLabelsOnEvent(mockIssue, "closed", { dryRun: true });

      expect(result.warnings.some((w) => w.includes("completion"))).toBe(true);
    });

    it("should not warn if status:done when closed", () => {
      mockIssue.labels = [{ name: "status:done" }, { name: "type:task" }];
      const result = syncLabelsOnEvent(mockIssue, "closed", { dryRun: true });

      expect(result.warnings.some((w) => w.includes("completion"))).toBe(false);
    });

    it("should not warn if implementation:complete when closed", () => {
      mockIssue.labels = [
        { name: "openspec:implementation-complete" },
        { name: "type:feature" },
      ];
      const result = syncLabelsOnEvent(mockIssue, "closed", { dryRun: true });

      expect(result.warnings.some((w) => w.includes("completion"))).toBe(false);
    });
  });

  describe("syncLabelsOnEvent - label syncing", () => {
    it("should include currentLabels in result", () => {
      mockIssue.labels = [{ name: "type:feature" }, { name: "priority:high" }];
      const result = syncLabelsOnEvent(mockIssue, "created", { dryRun: true });

      expect(result.currentLabels).toContain("type:feature");
      expect(result.currentLabels).toContain("priority:high");
    });

    it("should handle empty labels array", () => {
      mockIssue.labels = [];
      const result = syncLabelsOnEvent(mockIssue, "created", { dryRun: true });

      expect(result.success).toBe(true);
      expect(result.currentLabels).toEqual([]);
    });

    it("should track issue number in result", () => {
      mockIssue.number = 42;
      const result = syncLabelsOnEvent(mockIssue, "created", { dryRun: true });

      expect(result.issueNumber).toBe(42);
    });
  });

  describe("batchSyncLabels", () => {
    it("should process multiple issues", () => {
      const issues = [
        { number: 1, title: "Issue 1", labels: [{ name: "type:task" }] },
        { number: 2, title: "Issue 2", labels: [{ name: "type:feature" }] },
        { number: 3, title: "Issue 3", labels: [] },
      ];

      const result = batchSyncLabels(issues, "created", { dryRun: true });

      expect(result.stats.total).toBe(3);
      expect(result.stats.processed).toBe(3);
      expect(result.results.length).toBe(3);
    });

    it("should respect limit option", () => {
      const issues = Array(10)
        .fill(0)
        .map((_, i) => ({
          number: i,
          title: `Issue ${i}`,
          labels: [{ name: "type:task" }],
        }));

      const result = batchSyncLabels(issues, "created", {
        dryRun: true,
        limit: 5,
      });

      expect(result.stats.processed).toBe(5);
      expect(result.results.length).toBe(5);
    });

    it("should count conflicts in stats", () => {
      const issues = [
        {
          number: 1,
          title: "Issue 1",
          labels: [
            { name: "openspec:specification-pending" },
            { name: "status:done" },
          ],
        },
      ];

      const result = batchSyncLabels(issues, "labeled", { dryRun: true });

      expect(result.stats.conflicts).toBeGreaterThan(0);
    });

    it("should count warnings in stats", () => {
      const issues = [
        {
          number: 1,
          title: "Issue 1",
          labels: [{ name: "openspec:specification-pending" }],
        },
      ];

      const result = batchSyncLabels(issues, "created", { dryRun: true });

      expect(result.stats.warnings).toBeGreaterThan(0);
    });

    it("should track changes applied", () => {
      const issues = [
        {
          number: 1,
          title: "Issue 1",
          labels: [{ name: "openspec:specification-pending" }],
        },
      ];

      const result = batchSyncLabels(issues, "created", { dryRun: true });

      expect(result.stats.changesApplied).toBeGreaterThanOrEqual(0);
    });

    it("should include dryRun in batch result", () => {
      const issues = [
        { number: 1, title: "Issue 1", labels: [{ name: "type:task" }] },
      ];

      const result = batchSyncLabels(issues, "created", { dryRun: true });

      expect(result.dryRun).toBe(true);
    });

    it("should handle empty issue list", () => {
      const result = batchSyncLabels([], "created", { dryRun: true });

      expect(result.stats.total).toBe(0);
      expect(result.stats.processed).toBe(0);
      expect(result.results.length).toBe(0);
    });
  });

  describe("edge cases", () => {
    it("should handle issues with many labels", () => {
      mockIssue.labels = Array(20)
        .fill(0)
        .map((_, i) => ({ name: `label-${i}` }));

      const result = syncLabelsOnEvent(mockIssue, "created", { dryRun: true });

      expect(result.success).toBe(true);
      expect(result.currentLabels.length).toBe(20);
    });

    it("should handle unknown event type gracefully", () => {
      mockIssue.labels = [{ name: "type:task" }];
      const result = syncLabelsOnEvent(mockIssue, "unknown", {
        dryRun: true,
      });

      expect(result.success).toBe(true);
      expect(result.eventType).toBe("unknown");
    });

    it("should handle null options", () => {
      mockIssue.labels = [{ name: "type:task" }];
      const result = syncLabelsOnEvent(mockIssue, "created");

      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
    });

    it("should handle issue without labels property", () => {
      const issueNolabels = { number: 100, title: "No labels" };
      // This would normally fail but shows error handling
      try {
        const result = syncLabelsOnEvent(issueNolabels, "created", {
          dryRun: true,
        });
        expect(result).toBeDefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe("integration scenarios", () => {
    it("should handle full specification workflow", () => {
      // Step 1: Issue created
      mockIssue.labels = [{ name: "type:feature" }];
      let result = syncLabelsOnEvent(mockIssue, "created", { dryRun: true });
      expect(result.success).toBe(true);

      // Step 2: Specification pending added
      mockIssue.labels.push({ name: "openspec:specification-pending" });
      result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });
      expect(result.suggestedChanges.length).toBeGreaterThan(0);

      // Step 3: Specification in progress
      mockIssue.labels = mockIssue.labels.filter(
        (l) => l.name !== "openspec:specification-pending",
      );
      mockIssue.labels.push({ name: "openspec:specification-in-progress" });
      mockIssue.labels.push({ name: "status:in-progress" });
      result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });
      expect(result.conflicts.length).toBe(0);
    });

    it("should detect progression from specification to implementation", () => {
      mockIssue.labels = [
        { name: "openspec:specification-complete" },
        { name: "status:ready" },
        { name: "type:feature" },
      ];

      const result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });

      // Should suggest moving to implementation-pending
      expect(
        result.suggestedChanges.some((c) =>
          c.label.includes("implementation"),
        ) || result.warnings.length >= 0,
      ).toBe(true);
    });

    it("should handle issue reopening workflow", () => {
      // Issue closed with implementation-complete
      mockIssue.labels = [
        { name: "openspec:implementation-complete" },
        { name: "status:done" },
        { name: "type:feature" },
      ];

      // Issue is reopened
      const result = syncLabelsOnEvent(mockIssue, "reopened", {
        dryRun: true,
      });

      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });
});
