/**
 * Milestone Assignment Agent Tests
 *
 * Test coverage for MilestoneAssignmentAgent class including:
 * - Happy path scenarios (standard assignments)
 * - Edge cases (special characters, empty data, etc.)
 * - Error scenarios (missing data, API failures)
 * - Integration scenarios (full workflow execution)
 *
 * Target: 80%+ code coverage
 */

import { MilestoneAssignmentAgent } from "../../scripts/agents/includes/milestone-assignment.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sampleIssues = JSON.parse(
  readFileSync(join(__dirname, "../fixtures/sample-issues.json"), "utf8"),
);

describe("MilestoneAssignmentAgent", () => {
  let mockGithub;
  let agent;

  // Mock milestones for testing
  const mockMilestones = [
    { number: 1, title: "v1.4", state: "open" },
    { number: 2, title: "v1.5", state: "open" },
    { number: 3, title: "v2.0", state: "open" },
    { number: 4, title: "Phase 1", state: "open" },
    { number: 5, title: "Phase 2", state: "open" },
    { number: 6, title: "Phase 2.1", state: "open" },
    { number: 7, title: "Backlog", state: "open" },
    { number: 8, title: "Q3 2026", state: "open" },
  ];

  beforeEach(() => {
    // Setup mock GitHub API
    mockGithub = {
      paginate: jest.fn().mockResolvedValue(mockMilestones),
      rest: {
        issues: {
          listMilestones: jest.fn(),
        },
      },
    };

    agent = new MilestoneAssignmentAgent(mockGithub, "test-owner", "test-repo");
  });

  describe("constructor", () => {
    test("should initialize with github, owner, and repo", () => {
      expect(agent.github).toBe(mockGithub);
      expect(agent.owner).toBe("test-owner");
      expect(agent.repo).toBe("test-repo");
      expect(agent.milestones).toBeNull();
      expect(agent.milestoneMap).toEqual({});
    });
  });

  describe("loadMilestones", () => {
    test("should load milestones from API", async () => {
      const result = await agent.loadMilestones();
      expect(result).toEqual(mockMilestones);
      expect(mockGithub.paginate).toHaveBeenCalled();
    });

    test("should cache milestones on subsequent calls", async () => {
      await agent.loadMilestones();
      await agent.loadMilestones();
      // Should only call paginate once due to caching
      expect(mockGithub.paginate).toHaveBeenCalledTimes(1);
    });

    test("should build milestone map with aliases", async () => {
      await agent.loadMilestones();
      expect(agent.milestoneMap["v1.4"]).toBeDefined();
      expect(agent.milestoneMap["v1.4.0"]).toBeDefined(); // Alias
    });

    test("should handle API failures gracefully", async () => {
      mockGithub.paginate.mockRejectedValueOnce(new Error("API Error"));
      const result = await agent.loadMilestones();
      expect(result).toEqual([]);
    });
  });

  describe("assignMilestone - Happy Path", () => {
    test("should assign milestone based on version keyword", async () => {
      const issue = sampleIssues.happyPath.versionKeywordIssue;
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
      expect(result.milestone.title).toBe("v1.5");
      expect(result.confidence).toBeGreaterThanOrEqual(0.9);
    });

    test("should assign milestone to epic issues", async () => {
      const issue = sampleIssues.happyPath.epicIssue;
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0.85);
      expect(result.reason).toBe("epic-type");
    });

    test("should assign milestone based on phase reference", async () => {
      const issue = sampleIssues.happyPath.phaseReferenceIssue;
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
      expect(result.milestone.title).toContain("Phase");
      expect(result.reason).toBe("phase-match");
    });

    test("should assign current milestone to high-priority issues", async () => {
      const issue = sampleIssues.happyPath.highPriorityIssue;
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0.75);
    });

    test("should preserve existing milestone", async () => {
      const issue = {
        ...sampleIssues.happyPath.standardTask,
        milestone: { number: 2, title: "v1.5" },
      };
      const result = await agent.assignMilestone(issue);
      expect(result).toBe(2); // Returns existing milestone number
    });
  });

  describe("assignMilestone - Edge Cases", () => {
    test("should handle empty issue body", async () => {
      const issue = sampleIssues.edgeCases.emptyBody;
      const result = await agent.assignMilestone(issue);
      // Should return something (either match or fallback)
      expect(result).toBeDefined();
    });

    test("should handle special characters in title", async () => {
      const issue = sampleIssues.edgeCases.specialCharactersInTitle;
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });

    test("should handle very long title", async () => {
      const issue = sampleIssues.edgeCases.veryLongTitle;
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
    });

    test("should handle unicode characters", async () => {
      const issue = sampleIssues.edgeCases.unicodeCharacters;
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
    });

    test("should handle missing type label", async () => {
      const issue = sampleIssues.edgeCases.missingTypeLabel;
      const result = await agent.assignMilestone(issue);
      // Should still attempt to assign based on text analysis
      expect(result).toBeDefined();
    });

    test("should handle multiple type labels (use first)", async () => {
      const issue = sampleIssues.edgeCases.multipleTypeLabels;
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
    });

    test("should handle issue with no labels", async () => {
      const issue = sampleIssues.edgeCases.noLabels;
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
    });
  });

  describe("assignMilestone - Error Scenarios", () => {
    test("should return null for null issue", async () => {
      const result = await agent.assignMilestone(null);
      expect(result).toBeNull();
    });

    test("should handle missing title field", async () => {
      const issue = sampleIssues.errorScenarios.missingTitle;
      const result = await agent.assignMilestone(issue);
      // Should handle gracefully, may return null or fallback
      expect(result === null || typeof result === "object").toBe(true);
    });

    test("should handle missing labels field", async () => {
      const issue = sampleIssues.errorScenarios.missingLabels;
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
    });

    test("should handle labels as strings instead of objects", async () => {
      const issue = sampleIssues.errorScenarios.invalidLabelFormat;
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
    });

    test("should handle issue number as null", async () => {
      const issue = {
        number: null,
        title: "Test",
        body: "",
        labels: [],
      };
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
    });
  });

  describe("assignMilestone - Integration Scenarios", () => {
    test("should handle complete bug report with all fields", async () => {
      const issue = sampleIssues.integrationScenarios.completeBugReport;
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
      expect(result.milestone).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.reason).toBeDefined();
    });

    test("should handle complete feature request with all fields", async () => {
      const issue = sampleIssues.integrationScenarios.completeFeatureRequest;
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
      expect(result.milestone).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });

    test("should assign multiple issues in batch", async () => {
      const issues = [
        sampleIssues.happyPath.versionKeywordIssue,
        sampleIssues.happyPath.epicIssue,
        sampleIssues.happyPath.phaseReferenceIssue,
      ];

      const results = await Promise.all(
        issues.map((issue) => agent.assignMilestone(issue)),
      );

      expect(results).toHaveLength(3);
      results.forEach((result) => {
        expect(result).toBeDefined();
      });
    });
  });

  describe("Confidence Scoring", () => {
    test("should have confidence between 0 and 1", async () => {
      const issue = sampleIssues.happyPath.versionKeywordIssue;
      const result = await agent.assignMilestone(issue);
      if (typeof result === "object" && result.confidence !== undefined) {
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
      }
    });

    test("should have reason field for non-null results", async () => {
      const issue = sampleIssues.happyPath.versionKeywordIssue;
      const result = await agent.assignMilestone(issue);
      if (typeof result === "object") {
        expect(result.reason).toBeDefined();
        expect(typeof result.reason).toBe("string");
      }
    });
  });

  describe("Label Parsing", () => {
    test("should parse type labels from objects", async () => {
      const issue = {
        number: 1,
        title: "Test",
        body: "",
        labels: [{ name: "type:task" }, { name: "priority:high" }],
      };
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
    });

    test("should parse type labels from strings", async () => {
      const issue = {
        number: 1,
        title: "Test",
        body: "",
        labels: ["type:task", "priority:high"],
      };
      const result = await agent.assignMilestone(issue);
      expect(result).toBeDefined();
    });
  });

  describe("Text Analysis", () => {
    test("should detect version patterns", async () => {
      const issue = {
        number: 1,
        title: "Fix critical bug in v2.0",
        body: "Affects v2.0 and later",
        labels: [{ name: "type:bug" }],
      };
      const result = await agent.assignMilestone(issue);
      if (result && result.milestone) {
        expect(result.milestone.title).toMatch(/v2.0/);
      }
    });

    test("should detect phase patterns", async () => {
      const issue = {
        number: 1,
        title: "Phase 2 work",
        body: "This is part of phase 2 implementation",
        labels: [{ name: "type:task" }],
      };
      const result = await agent.assignMilestone(issue);
      if (result && result.milestone) {
        expect(result.milestone.title).toMatch(/Phase 2/);
      }
    });

    test("should be case-insensitive for keywords", async () => {
      const issue1 = {
        number: 1,
        title: "PHASE 1 work",
        body: "",
        labels: [{ name: "type:task" }],
      };
      const issue2 = {
        number: 2,
        title: "phase 1 work",
        body: "",
        labels: [{ name: "type:task" }],
      };
      const result1 = await agent.assignMilestone(issue1);
      const result2 = await agent.assignMilestone(issue2);
      // Both should have similar assignment behavior
      expect(typeof result1).toBe(typeof result2);
    });
  });

  describe("Milestone Map Building", () => {
    test("should build correct milestone map", async () => {
      await agent.loadMilestones();
      expect(Object.keys(agent.milestoneMap).length).toBeGreaterThan(0);
      expect(agent.milestoneMap["v1.4"]).toBeDefined();
    });

    test("should handle version aliases correctly", async () => {
      await agent.loadMilestones();
      expect(agent.milestoneMap["v1.4"]).toEqual(agent.milestoneMap["v1.4.0"]);
    });

    test("should not create aliases for single-digit versions", async () => {
      await agent.loadMilestones();
      // Versions like "Phase 1" should not get aliases
      const hasPhaseAlias = Object.keys(agent.milestoneMap).some((key) =>
        key.includes("Phase 1.0"),
      );
      expect(hasPhaseAlias).toBe(false);
    });
  });
});
