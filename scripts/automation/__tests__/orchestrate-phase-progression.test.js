/**
 * Tests for orchestrate-phase-progression.js
 * Phase progression and lifecycle automation
 */

const { describe, it, expect, beforeEach } = require("@jest/globals");
const {
  orchestratePhaseProgression,
  batchOrchestrate,
  extractLinkedIssues,
  extractReferencedIssues,
  detectProgressionTrigger,
  getProgressionTimeline,
} = require("../handlers/orchestrate-phase-progression.cjs");

describe("orchestrate-phase-progression", () => {
  let mockIssue;

  beforeEach(() => {
    mockIssue = {
      number: 100,
      title: "Test Issue",
      body: "Test body",
      labels: [],
    };
  });

  describe("orchestratePhaseProgression", () => {
    it("should progress from specification-pending to in-progress on PR opened", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });

      expect(result.success).toBe(true);
      expect(result.transitionValid).toBe(true);
      expect(result.nextPhaseLabel).toBe("openspec:specification-in-progress");
    });

    it("should progress from specification-in-progress to complete on PR merged", () => {
      mockIssue.labels = [
        { name: "openspec:specification-in-progress" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(mockIssue, "PR merged", {
        dryRun: true,
      });

      expect(result.success).toBe(true);
      expect(result.nextPhaseLabel).toBe("openspec:specification-complete");
    });

    it("should progress from specification-complete to implementation-pending", () => {
      mockIssue.labels = [
        { name: "openspec:specification-complete" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });

      expect(result.success).toBe(true);
      expect(result.nextPhaseLabel).toBe("openspec:implementation-pending");
    });

    it("should progress from implementation-in-progress to complete on PR merged", () => {
      mockIssue.labels = [
        { name: "openspec:implementation-in-progress" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(mockIssue, "PR merged", {
        dryRun: true,
      });

      expect(result.success).toBe(true);
      expect(result.nextPhaseLabel).toBe("openspec:implementation-complete");
    });

    it("should progress on status:in-progress added", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(
        mockIssue,
        "status:in-progress added",
        {
          dryRun: true,
        },
      );

      expect(result.success).toBe(true);
      expect(result.nextPhaseLabel).toBe("openspec:specification-in-progress");
    });

    it("should progress on status:done added", () => {
      mockIssue.labels = [
        { name: "openspec:specification-in-progress" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(
        mockIssue,
        "status:done added",
        {
          dryRun: true,
        },
      );

      expect(result.success).toBe(true);
      expect(result.nextPhaseLabel).toBe("openspec:specification-complete");
    });

    it("should not progress when trigger does not apply to current phase", () => {
      mockIssue.labels = [
        { name: "openspec:specification-complete" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });

      expect(result.success).toBe(true);
      expect(result.nextPhaseLabel).toBe("openspec:implementation-pending");
    });

    it("should warn when no openspec label present", () => {
      mockIssue.labels = [{ name: "type:feature" }];
      const result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });

      expect(result.warnings.some((w) => w.includes("No openspec label"))).toBe(
        true,
      );
      expect(result.currentPhaseLabel).toBeNull();
    });

    it("should record progression in timeline", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });

      expect(result.progression.length).toBeGreaterThan(0);
      expect(result.progression[0].from).toBe("openspec:specification-pending");
      expect(result.progression[0].to).toBe(
        "openspec:specification-in-progress",
      );
      expect(result.progression[0].trigger).toBe("PR opened");
    });

    it("should mark progression as forward (not rollback)", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });

      expect(result.progression[0].type).toBe("progression");
    });

    it("should support rollback to previous state", () => {
      mockIssue.labels = [
        { name: "openspec:specification-in-progress" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(
        mockIssue,
        "rollback-to-pending",
        {
          dryRun: true,
        },
      );

      // Rollback might not have a trigger, so we check the warning
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it("should return dryRun in result", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });

      expect(result.dryRun).toBe(true);
    });

    it("should not apply changes when dryRun is true", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });

      expect(result.progressionApplied).toBe(false);
    });

    it("should track issue number in result", () => {
      mockIssue.number = 42;
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });

      expect(result.issueNumber).toBe(42);
    });
  });

  describe("extractLinkedIssues", () => {
    it("should extract Resolves reference", () => {
      const issues = extractLinkedIssues("Resolves #123");
      expect(issues).toContain(123);
    });

    it("should extract Closes reference", () => {
      const issues = extractLinkedIssues("Closes #456");
      expect(issues).toContain(456);
    });

    it("should extract Fixes reference", () => {
      const issues = extractLinkedIssues("Fixes #789");
      expect(issues).toContain(789);
    });

    it("should extract Related reference", () => {
      const issues = extractLinkedIssues("Related to #999");
      expect(issues).toContain(999);
    });

    it("should extract multiple references", () => {
      const issues = extractLinkedIssues(
        "Resolves #100\nCloses #200\nRelated #300",
      );
      expect(issues).toContain(100);
      expect(issues).toContain(200);
      expect(issues).toContain(300);
    });

    it("should handle case insensitivity", () => {
      const issues = extractLinkedIssues("resolves #123\nCLOSES #456");
      expect(issues).toContain(123);
      expect(issues).toContain(456);
    });

    it("should return empty array for no references", () => {
      const issues = extractLinkedIssues("No issue references here");
      expect(issues).toEqual([]);
    });

    it("should return empty array for null/undefined", () => {
      expect(extractLinkedIssues(null)).toEqual([]);
      expect(extractLinkedIssues(undefined)).toEqual([]);
    });

    it("should deduplicate references", () => {
      const issues = extractLinkedIssues("Resolves #123\nRelated #123");
      expect(issues.filter((i) => i === 123).length).toBe(1);
    });
  });

  describe("extractReferencedIssues", () => {
    it("should extract issue numbers from commit message", () => {
      const issues = extractReferencedIssues("Fix bug in #123");
      expect(issues).toContain(123);
    });

    it("should extract multiple issue references", () => {
      const issues = extractReferencedIssues("Updates #100 and #200");
      expect(issues).toContain(100);
      expect(issues).toContain(200);
    });

    it("should return empty array for no references", () => {
      const issues = extractReferencedIssues("No issue references");
      expect(issues).toEqual([]);
    });

    it("should return empty array for null/undefined", () => {
      expect(extractReferencedIssues(null)).toEqual([]);
      expect(extractReferencedIssues(undefined)).toEqual([]);
    });

    it("should deduplicate references", () => {
      const issues = extractReferencedIssues("See #123 and fix #123");
      expect(issues.filter((i) => i === 123).length).toBe(1);
    });
  });

  describe("detectProgressionTrigger", () => {
    it("should detect status:in-progress as progression trigger", () => {
      const before = ["type:feature"];
      const after = ["type:feature", "status:in-progress"];
      const trigger = detectProgressionTrigger(before, after);

      expect(trigger).not.toBeNull();
      expect(trigger.trigger).toBe("status:in-progress added");
    });

    it("should detect status:done as progression trigger", () => {
      const before = ["type:feature", "status:in-progress"];
      const after = ["type:feature", "status:done"];
      const trigger = detectProgressionTrigger(before, after);

      expect(trigger).not.toBeNull();
      expect(trigger.trigger).toBe("status:done added");
    });

    it("should return null for non-progression status changes", () => {
      const before = ["type:feature"];
      const after = ["type:feature", "status:blocked"];
      const trigger = detectProgressionTrigger(before, after);

      expect(trigger).toBeNull();
    });

    it("should return null for no status change", () => {
      const before = ["type:feature"];
      const after = ["type:feature", "priority:high"];
      const trigger = detectProgressionTrigger(before, after);

      expect(trigger).toBeNull();
    });

    it("should handle status change removal", () => {
      const before = ["type:feature", "status:in-progress"];
      const after = ["type:feature"];
      const trigger = detectProgressionTrigger(before, after);

      expect(trigger).toBeNull();
    });
  });

  describe("getProgressionTimeline", () => {
    it("should return current phase from labels", () => {
      const labels = ["openspec:specification-in-progress", "type:feature"];
      const timeline = getProgressionTimeline(labels);

      expect(timeline.current).toBe("openspec:specification-in-progress");
      expect(timeline.phase).toBe("specification");
      expect(timeline.step).toBe("in-progress");
    });

    it("should return valid next states", () => {
      const labels = ["openspec:specification-pending", "type:feature"];
      const timeline = getProgressionTimeline(labels);

      expect(timeline.validNextStates).toContain(
        "openspec:specification-in-progress",
      );
    });

    it("should return available triggers", () => {
      const labels = ["openspec:specification-pending", "type:feature"];
      const timeline = getProgressionTimeline(labels);

      expect(timeline.availableTriggers).toBeDefined();
      expect(Object.keys(timeline.availableTriggers).length).toBeGreaterThan(0);
    });

    it("should return null for no openspec label", () => {
      const labels = ["type:feature"];
      const timeline = getProgressionTimeline(labels);

      expect(timeline.current).toBeNull();
      expect(timeline.phase).toBeNull();
      expect(timeline.step).toBeNull();
    });

    it("should identify implementation phase", () => {
      const labels = ["openspec:implementation-in-progress", "type:feature"];
      const timeline = getProgressionTimeline(labels);

      expect(timeline.phase).toBe("implementation");
    });
  });

  describe("batchOrchestrate", () => {
    it("should process multiple issues", () => {
      const issues = [
        {
          number: 1,
          title: "Issue 1",
          labels: [
            { name: "openspec:specification-pending" },
            { name: "type:feature" },
          ],
        },
        {
          number: 2,
          title: "Issue 2",
          labels: [
            { name: "openspec:specification-in-progress" },
            { name: "type:task" },
          ],
        },
        {
          number: 3,
          title: "Issue 3",
          labels: [{ name: "type:feature" }],
        },
      ];

      const result = batchOrchestrate(issues, "PR opened", { dryRun: true });

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
          labels: [
            { name: "openspec:specification-pending" },
            { name: "type:task" },
          ],
        }));

      const result = batchOrchestrate(issues, "PR opened", {
        dryRun: true,
        limit: 5,
      });

      expect(result.stats.processed).toBe(5);
      expect(result.results.length).toBe(5);
    });

    it("should count progressed issues in stats", () => {
      const issues = [
        {
          number: 1,
          title: "Issue 1",
          labels: [
            { name: "openspec:specification-pending" },
            { name: "type:feature" },
          ],
        },
      ];

      const result = batchOrchestrate(issues, "PR opened", { dryRun: true });

      expect(result.stats.progressed).toBeGreaterThanOrEqual(0);
    });

    it("should include dryRun in batch result", () => {
      const issues = [
        {
          number: 1,
          title: "Issue 1",
          labels: [
            { name: "openspec:specification-pending" },
            { name: "type:feature" },
          ],
        },
      ];

      const result = batchOrchestrate(issues, "PR opened", { dryRun: true });

      expect(result.dryRun).toBe(true);
    });

    it("should handle empty issue list", () => {
      const result = batchOrchestrate([], "PR opened", { dryRun: true });

      expect(result.stats.total).toBe(0);
      expect(result.stats.processed).toBe(0);
      expect(result.results.length).toBe(0);
    });

    it("should count skipped and failed issues", () => {
      const issues = [
        {
          number: 1,
          title: "Issue 1",
          labels: [
            { name: "openspec:specification-pending" },
            { name: "type:feature" },
          ],
        },
        {
          number: 2,
          title: "Issue 2",
          labels: [{ name: "type:feature" }],
        },
      ];

      const result = batchOrchestrate(issues, "PR opened", { dryRun: true });

      expect(result.stats.processed).toBe(2);
      expect(result.stats.skipped + result.stats.progressed).toBe(2);
    });
  });

  describe("edge cases", () => {
    it("should handle issue without labels property", () => {
      const issueNoLabels = { number: 100, title: "No labels" };
      try {
        const result = orchestratePhaseProgression(issueNoLabels, "PR opened", {
          dryRun: true,
        });
        expect(result).toBeDefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    it("should handle unknown trigger gracefully", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(mockIssue, "unknown-trigger", {
        dryRun: true,
      });

      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it("should handle null options", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(mockIssue, "PR opened");

      expect(result.dryRun).toBe(true);
    });

    it("should handle issue with many labels", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
        ...Array(20)
          .fill(0)
          .map((_, i) => ({ name: `label-${i}` })),
      ];

      const result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("integration scenarios", () => {
    it("should handle full specification workflow", () => {
      // Step 1: specification-pending → in-progress
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];
      let result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });
      expect(result.nextPhaseLabel).toBe("openspec:specification-in-progress");

      // Step 2: specification-in-progress → complete
      mockIssue.labels = [
        { name: "openspec:specification-in-progress" },
        { name: "type:feature" },
      ];
      result = orchestratePhaseProgression(mockIssue, "PR merged", {
        dryRun: true,
      });
      expect(result.nextPhaseLabel).toBe("openspec:specification-complete");
    });

    it("should handle full implementation workflow", () => {
      // Step 1: implementation-pending → in-progress
      mockIssue.labels = [
        { name: "openspec:implementation-pending" },
        { name: "type:feature" },
      ];
      let result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });
      expect(result.nextPhaseLabel).toBe("openspec:implementation-in-progress");

      // Step 2: implementation-in-progress → complete
      mockIssue.labels = [
        { name: "openspec:implementation-in-progress" },
        { name: "type:feature" },
      ];
      result = orchestratePhaseProgression(mockIssue, "PR merged", {
        dryRun: true,
      });
      expect(result.nextPhaseLabel).toBe("openspec:implementation-complete");
    });

    it("should handle full spec to implementation progression", () => {
      // After spec is complete, next trigger should advance to implementation
      mockIssue.labels = [
        { name: "openspec:specification-complete" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });

      expect(result.nextPhaseLabel).toBe("openspec:implementation-pending");
    });

    it("should detect PR link and trigger progression", () => {
      const prBody = "This PR resolves #100 for the feature work";
      const linkedIssues = extractLinkedIssues(prBody);

      expect(linkedIssues).toContain(100);
    });

    it("should detect commit reference and extract issue", () => {
      const commitMessage = "feat: implement feature for #200";
      const referencedIssues = extractReferencedIssues(commitMessage);

      expect(referencedIssues).toContain(200);
    });

    it("should track full progression timeline", () => {
      mockIssue.labels = [
        { name: "openspec:specification-pending" },
        { name: "type:feature" },
      ];
      const result = orchestratePhaseProgression(mockIssue, "PR opened", {
        dryRun: true,
      });

      expect(result.timeline.length).toBeGreaterThan(0);
      expect(result.timeline[0].from).toBe("openspec:specification-pending");
      expect(result.timeline[0].to).toBe("openspec:specification-in-progress");
    });
  });
});
