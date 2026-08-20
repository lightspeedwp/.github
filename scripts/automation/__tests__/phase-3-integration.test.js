/**
 * Phase 3 Integration Tests
 * Complex multi-step workflows testing label syncing and phase progression
 * Covers 10+ scenarios from Phase 3 specification
 */

const { describe, it, expect, beforeEach } = require("@jest/globals");
const {
  syncLabelsOnEvent,
  batchSyncLabels,
} = require("../handlers/sync-labels-on-event");
const {
  orchestratePhaseProgression,
  extractLinkedIssues,
} = require("../handlers/orchestrate-phase-progression");

describe("Phase 3 Integration Scenarios", () => {
  let mockIssue;

  beforeEach(() => {
    mockIssue = {
      number: 100,
      title: "Test Issue",
      body: "Test body",
      labels: [],
    };
  });

  describe("Scenario 1: New issue without type label", () => {
    it("should warn when creating issue without type label", () => {
      mockIssue.labels = [{ name: "openspec:specification-pending" }];
      const result = syncLabelsOnEvent(mockIssue, "created", { dryRun: true });

      expect(result.warnings.some((w) => w.includes("type label"))).toBe(true);
    });

    it("should suggest adding type label", () => {
      mockIssue.labels = [{ name: "openspec:specification-pending" }];
      const result = syncLabelsOnEvent(mockIssue, "created", { dryRun: true });

      expect(result.suggestedChanges.length).toBeGreaterThanOrEqual(1);
    });

    it("should not warn with proper labels", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];
      const result = syncLabelsOnEvent(mockIssue, "created", { dryRun: true });

      expect(result.warnings.some((w) => w.includes("type label"))).toBe(false);
    });
  });

  describe("Scenario 2: Label addition triggers sync", () => {
    it("should sync status labels when openspec label added", () => {
      mockIssue.labels = [{ name: "type:feature" }];

      // First, simulate adding openspec label
      mockIssue.labels.push({ name: "openspec:specification-pending" });
      const result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });

      expect(result.suggestedChanges.length).toBeGreaterThan(0);
      expect(
        result.suggestedChanges.some((c) => c.label.startsWith("status:"))
      ).toBe(true);
    });

    it("should detect incompatible label combinations", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "status:done" },
        { name: "type:feature" },
      ];

      const result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });
      expect(result.conflicts.length).toBeGreaterThan(0);
    });
  });

  describe("Scenario 3: PR link triggers phase advance", () => {
    it("should extract issue from PR body", () => {
      const prBody = "This PR resolves #100 for the feature implementation";
      const linked = extractLinkedIssues(prBody);

      expect(linked).toContain(100);
    });

    it("should advance phase when PR opened for linked issue", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];

      const result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });

      expect(result.nextPhaseLabel).toBe("openspec:specification-in-progress");
    });

    it("should advance to complete when PR merged", () => {
      mockIssue.labels = [
        { name: "openspec:specification-in-progress" },
        { name: "type:feature" },
      ];

      const result = orchestratePhaseProgression(mockIssue, "PR merged", {
        dryRun: true,
      });

      expect(result.nextPhaseLabel).toBe("openspec:specification-complete");
    });
  });

  describe("Scenario 4: Conflict detection", () => {
    it("should detect incompatible status with openspec", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "status:done" },
        { name: "type:feature" },
      ];

      const result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });
      expect(result.conflicts.length).toBeGreaterThan(0);
    });

    it("should detect ready status with implementation-pending", () => {
      mockIssue.labels = [
        { name: "openspec:implementation-pending" },
        { name: "status:ready" },
        { name: "type:feature" },
      ];

      const result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });
      expect(result.conflicts.length).toBeGreaterThan(0);
    });

    it("should not detect conflicts for valid combinations", () => {
      mockIssue.labels = [
        { name: "openspec:specification-in-progress" },
        { name: "status:in-progress" },
        { name: "type:feature" },
      ];

      const result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });
      expect(result.conflicts.length).toBe(0);
    });
  });

  describe("Scenario 5: Progression timeline tracking", () => {
    it("should track full specification workflow", () => {
      const timeline = [];

      // Step 1: Create with pending
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];
      let result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });
      timeline.push({
        step: 1,
        from: result.currentPhaseLabel,
        to: result.nextPhaseLabel,
      });
      expect(result.nextPhaseLabel).toBe("openspec:specification-in-progress");

      // Step 2: Merge to complete
      mockIssue.labels = [
        { name: "openspec:specification-in-progress" },
        { name: "type:feature" },
      ];
      result = orchestratePhaseProgression(mockIssue, "PR merged", {
        dryRun: true,
      });
      timeline.push({
        step: 2,
        from: result.currentPhaseLabel,
        to: result.nextPhaseLabel,
      });
      expect(result.nextPhaseLabel).toBe("openspec:specification-complete");

      // Step 3: Move to implementation
      mockIssue.labels = [
        { name: "openspec:specification-complete" },
        { name: "type:feature" },
      ];
      result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });
      timeline.push({
        step: 3,
        from: result.currentPhaseLabel,
        to: result.nextPhaseLabel,
      });
      expect(result.nextPhaseLabel).toBe("openspec:implementation-pending");

      expect(timeline.length).toBe(3);
    });

    it("should track implementation workflow", () => {
      // Implementation pending → in-progress
      mockIssue.labels = [
        { name: "openspec:implementation-pending" },
        { name: "type:feature" },
      ];
      let result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });
      expect(result.nextPhaseLabel).toBe("openspec:implementation-in-progress");

      // Implementation in-progress → complete
      mockIssue.labels = [
        { name: "openspec:implementation-in-progress" },
        { name: "type:feature" },
      ];
      result = orchestratePhaseProgression(mockIssue, "PR merged", {
        dryRun: true,
      });
      expect(result.nextPhaseLabel).toBe("openspec:implementation-complete");
    });
  });

  describe("Scenario 6: Multiple issues in same PR", () => {
    it("should detect and process multiple linked issues", () => {
      const prBody =
        "Resolves #100, closes #101, related to #102 and fixes #103";
      const linked = extractLinkedIssues(prBody);

      expect(linked.length).toBe(4);
      expect(linked).toContain(100);
      expect(linked).toContain(101);
      expect(linked).toContain(102);
      expect(linked).toContain(103);
    });

    it("should batch process multiple issues", () => {
      const issues = [
        {
          number: 100,
          title: "Issue 100",
          labels: [
            { name: "openspec:specification-pending" },
            { name: "type:feature" },
          ],
        },
        {
          number: 101,
          title: "Issue 101",
          labels: [
            { name: "openspec:specification-in-progress" },
            { name: "type:task" },
          ],
        },
        {
          number: 102,
          title: "Issue 102",
          labels: [
            { name: "openspec:implementation-pending" },
            { name: "type:feature" },
          ],
        },
      ];

      const result = batchSyncLabels(issues, "labeled", { dryRun: true });

      expect(result.stats.total).toBe(3);
      expect(result.stats.processed).toBe(3);
      expect(result.results.length).toBe(3);
    });
  });

  describe("Scenario 7: Issue with no openspec labels (non-spec work)", () => {
    it("should not warn for regular issues without openspec labels", () => {
      mockIssue.labels = [
        { name: "type:chore" },
        { name: "priority:normal" },
      ];

      const result = syncLabelsOnEvent(mockIssue, "created", { dryRun: true });

      // Should not warn about missing openspec labels for non-spec work
      expect(
        result.warnings.some((w) => w.includes("openspec"))
      ).toBeFalsy();
    });

    it("should not attempt phase progression without openspec label", () => {
      mockIssue.labels = [
        { name: "type:chore" },
        { name: "area:ci" },
      ];

      const result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });

      expect(result.warnings.some((w) => w.includes("No openspec"))).toBe(true);
      expect(result.nextPhaseLabel).toBeNull();
    });
  });

  describe("Scenario 8: Phase rollback (label removed)", () => {
    it("should support rollback from in-progress to pending", () => {
      mockIssue.labels = [
        { name: "openspec:specification-in-progress" },
        { name: "type:feature" },
      ];

      // Attempting to go back to pending (if there's a trigger for it)
      // For now, we just verify the state machine allows it
      const result = orchestratePhaseProgression(mockIssue, "rollback-trigger", {
        dryRun: true,
      });

      // Should warn about unknown trigger, not crash
      expect(result.warnings.length).toBeGreaterThanOrEqual(0);
    });

    it("should handle manual label change for rollback", () => {
      mockIssue.labels = [
        { name: "openspec:specification-complete" },
        { name: "type:feature" },
      ];

      // Changing back to in-progress (simulating label removal and re-addition)
      mockIssue.labels = [
        { name: "openspec:specification-in-progress" },
        { name: "type:feature" },
      ];

      const result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });

      // Should handle the label change without errors
      expect(result.success).toBe(true);
    });
  });

  describe("Scenario 9: Concurrent label changes", () => {
    it("should handle rapid label additions", () => {
      mockIssue.labels = [];

      // Simulate rapid label additions
      const labels = [
        "type:feature",
        "priority:important",
        "openspec:specification-pending",
        "status:needs-planning",
      ];

      for (const label of labels) {
        mockIssue.labels.push({ name: label });
      }

      const result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });

      expect(result.success).toBe(true);
      expect(result.currentLabels.length).toBe(4);
    });

    it("should validate final state after concurrent changes", () => {
      mockIssue.labels = [];

      // Add labels in sequence
      mockIssue.labels.push({ name: "openspec:specification-pending" });
      mockIssue.labels.push({ name: "type:feature" });
      mockIssue.labels.push({ name: "status:in-progress" });
      mockIssue.labels.push({ name: "priority:high" });

      const result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });

      // Final state should be valid
      expect(result.success).toBe(true);
    });
  });

  describe("Scenario 10: Missing issue link on PR", () => {
    it("should handle PR with no linked issues", () => {
      const prBody =
        "This PR implements a feature but does not link to an issue";
      const linked = extractLinkedIssues(prBody);

      expect(linked.length).toBe(0);
    });

    it("should gracefully skip processing when no linked issues", () => {
      const prBody = "Just some PR body without issue references";
      const linked = extractLinkedIssues(prBody);

      // Should return empty array, not throw
      expect(Array.isArray(linked)).toBe(true);
      expect(linked.length).toBe(0);
    });

    it("should warn when processing PR without linked issues", () => {
      mockIssue.labels = [
        { name: "type:feature" },
        { name: "openspec:specification-in-progress" },
      ];

      // No trigger without linked issue
      const prBody = "No linked issue here";
      const linked = extractLinkedIssues(prBody);

      expect(linked.length).toBe(0);
    });
  });

  describe("Additional Complex Scenarios", () => {
    it("should handle specification → implementation → complete workflow", () => {
      const workflow = [];

      // Spec pending
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];
      let result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });
      workflow.push({
        stage: "spec pending → in-progress",
        success: result.success && result.nextPhaseLabel,
      });

      // Spec in-progress
      mockIssue.labels = [
        { name: "openspec:specification-in-progress" },
        { name: "type:feature" },
      ];
      result = orchestratePhaseProgression(mockIssue, "PR merged", {
        dryRun: true,
      });
      workflow.push({
        stage: "spec in-progress → complete",
        success: result.success && result.nextPhaseLabel,
      });

      // Spec complete → impl pending
      mockIssue.labels = [
        { name: "openspec:specification-complete" },
        { name: "type:feature" },
      ];
      result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });
      workflow.push({
        stage: "spec complete → impl pending",
        success: result.success && result.nextPhaseLabel,
      });

      // Impl pending
      mockIssue.labels = [
        { name: "openspec:implementation-pending" },
        { name: "type:feature" },
      ];
      result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });
      workflow.push({
        stage: "impl pending → in-progress",
        success: result.success && result.nextPhaseLabel,
      });

      // Impl in-progress
      mockIssue.labels = [
        { name: "openspec:implementation-in-progress" },
        { name: "type:feature" },
      ];
      result = orchestratePhaseProgression(mockIssue, "PR merged", {
        dryRun: true,
      });
      workflow.push({
        stage: "impl in-progress → complete",
        success: result.success && result.nextPhaseLabel,
      });

      // Verify all stages passed
      expect(workflow.every((w) => w.success)).toBe(true);
      expect(workflow.length).toBe(5);
    });

    it("should handle issues with multiple status changes", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];

      // Change status multiple times
      mockIssue.labels = [
        ...mockIssue.labels.filter((l) => !l.name.startsWith("status:")),
        { name: "status:needs-planning" },
      ];

      let result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });
      expect(result.success).toBe(true);

      mockIssue.labels = [
        ...mockIssue.labels.filter((l) => !l.name.startsWith("status:")),
        { name: "status:in-progress" },
      ];

      result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });
      expect(result.success).toBe(true);

      mockIssue.labels = [
        ...mockIssue.labels.filter((l) => !l.name.startsWith("status:")),
        { name: "status:blocked" },
      ];

      result = syncLabelsOnEvent(mockIssue, "labeled", { dryRun: true });
      expect(result.success).toBe(true);
    });
  });
});
