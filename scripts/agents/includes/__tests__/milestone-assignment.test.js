/**
 * Unit tests for MilestoneAssignmentAgent
 * Tests all 6 assignment rules and edge cases
 */

const { MilestoneAssignmentAgent } = require("../milestone-assignment.js");

describe("MilestoneAssignmentAgent", () => {
  let agent;
  let mockGithub;

  beforeEach(() => {
    // Mock GitHub API
    mockGithub = {
      paginate: jest.fn(),
      rest: {
        issues: {
          listMilestones: jest.fn(),
          update: jest.fn(),
        },
      },
    };

    agent = new MilestoneAssignmentAgent(mockGithub, "owner", "repo");
  });

  describe("loadMilestones", () => {
    it("should load and cache milestones from the repository", async () => {
      const mockMilestones = [
        { title: "v1.0", number: 1, closed_at: "2026-01-01T00:00:00Z" },
        { title: "v2.0", number: 2, closed_at: null },
        { title: "v2.1", number: 3, closed_at: null },
        { title: "Backlog", number: 4, closed_at: null },
      ];

      mockGithub.paginate.mockResolvedValueOnce(mockMilestones);

      const result = await agent.loadMilestones();

      expect(result).toEqual(mockMilestones);
      expect(mockGithub.paginate).toHaveBeenCalledWith(
        mockGithub.rest.issues.listMilestones,
        expect.objectContaining({
          owner: "owner",
          repo: "repo",
          state: "all",
        }),
      );
    });

    it("should return cached milestones on subsequent calls", async () => {
      const mockMilestones = [
        { title: "v1.0", number: 1 },
        { title: "v2.0", number: 2 },
      ];

      mockGithub.paginate.mockResolvedValueOnce(mockMilestones);

      await agent.loadMilestones();
      await agent.loadMilestones();

      expect(mockGithub.paginate).toHaveBeenCalledTimes(1);
    });

    it("should handle API errors gracefully", async () => {
      mockGithub.paginate.mockRejectedValueOnce(new Error("API Error"));

      const result = await agent.loadMilestones();

      expect(result).toEqual([]);
    });

    it("should build version aliases for milestone lookup", async () => {
      const mockMilestones = [
        { title: "v1.5", number: 1 },
        { title: "v2.0", number: 2 },
      ];

      mockGithub.paginate.mockResolvedValueOnce(mockMilestones);
      await agent.loadMilestones();

      // Verify that v1.5.0 is aliased to v1.5 milestone
      expect(agent.milestoneMap["v1.5"]).toEqual(mockMilestones[0]);
      expect(agent.milestoneMap["v1.5.0"]).toEqual(mockMilestones[0]);
    });
  });

  describe("Rule 1: Version-specific keywords (95% confidence)", () => {
    beforeEach(async () => {
      mockGithub.paginate.mockResolvedValueOnce([
        { title: "v1.5", number: 1 },
        { title: "v2.0", number: 2 },
        { title: "v3.0", number: 3 },
      ]);
      await agent.loadMilestones();
    });

    it("should detect version keyword in title and assign matching milestone", async () => {
      const issue = {
        number: 100,
        title: "Fix bug affecting v2.0 release",
        body: "This bug should be fixed in v2.0",
        labels: [],
      };

      const result = await agent.assignMilestone(issue);

      expect(result.milestoneNumber).toBe(2);
      expect(result.milestoneTitle).toBe("v2.0");
      expect(result.confidence).toBe(0.95);
      expect(result.reason).toBe("version-keyword");
    });

    it("should detect version with patch number (v1.5.0 -> v1.5)", async () => {
      const issue = {
        number: 101,
        title: "Enhancement for v1.5.0",
        body: "",
        labels: [],
      };

      const result = await agent.assignMilestone(issue);

      expect(result.milestoneNumber).toBe(1);
      expect(result.milestoneTitle).toBe("v1.5");
    });

    it("should prioritize version keyword rule over other rules", async () => {
      const issue = {
        number: 102,
        title: "Epic: Build API v2.0",
        body: "Work for next release",
        labels: [{ name: "type:epic" }],
      };

      const result = await agent.assignMilestone(issue);

      // Should use version keyword (0.95) not epic rule (0.9)
      expect(result.reason).toBe("version-keyword");
      expect(result.confidence).toBe(0.95);
    });
  });

  describe("Rule 2: Epic issues (90% confidence)", () => {
    beforeEach(async () => {
      mockGithub.paginate.mockResolvedValueOnce([
        { title: "v2.0", number: 1, closed_at: "2026-01-01T00:00:00Z" },
        { title: "v3.0", number: 2, closed_at: null },
      ]);
      await agent.loadMilestones();
    });

    it("should assign next major milestone to epic issues", async () => {
      const issue = {
        number: 200,
        title: "Epic: Rebuild authentication system",
        body: "Planned for next major version",
        labels: [{ name: "type:epic" }],
      };

      const result = await agent.assignMilestone(issue);

      expect(result.reason).toBe("epic-type");
      expect(result.confidence).toBe(0.9);
      expect(result.milestoneTitle).toBe("v3.0");
    });

    it("should skip epic rule if version keyword is present", async () => {
      const issue = {
        number: 201,
        title: "Epic: Features for v2.0",
        body: "",
        labels: [{ name: "type:epic" }],
      };

      const result = await agent.assignMilestone(issue);

      expect(result.reason).toBe("version-keyword");
    });
  });

  describe("Rule 3: Release issues (90% confidence)", () => {
    beforeEach(async () => {
      mockGithub.paginate.mockResolvedValueOnce([
        { title: "release-2.0", number: 1 },
        { title: "release-2.1", number: 2 },
        { title: "v3.0", number: 3 },
      ]);
      await agent.loadMilestones();
    });

    it("should assign release milestone to release issues", async () => {
      const issue = {
        number: 300,
        title: "Release: planning and coordination",
        body: "",
        labels: [{ name: "type:release" }],
      };

      const result = await agent.assignMilestone(issue);

      expect(result.reason).toBe("release-type");
      expect(result.confidence).toBe(0.9);
      expect(result.milestoneTitle).toBe("release-2.0");
    });
  });

  describe("Rule 4: Phase-based milestone assignment (85% confidence)", () => {
    beforeEach(async () => {
      mockGithub.paginate.mockResolvedValueOnce([
        { title: "Phase 1", number: 1 },
        { title: "Phase 2", number: 2 },
        { title: "Phase 2.1", number: 3 },
      ]);
      await agent.loadMilestones();
    });

    it("should detect phase number and assign matching milestone", async () => {
      const issue = {
        number: 400,
        title: "Feature for Phase 2",
        body: "Work related to Phase 2 of the project",
        labels: [],
      };

      const result = await agent.assignMilestone(issue);

      expect(result.reason).toBe("phase-match");
      expect(result.confidence).toBe(0.85);
      expect(result.milestoneTitle).toBe("Phase 2");
    });

    it("should match phase with decimal (Phase 2.1)", async () => {
      const issue = {
        number: 401,
        title: "Phase 2.1 implementation",
        body: "",
        labels: [],
      };

      const result = await agent.assignMilestone(issue);

      expect(result.milestoneTitle).toBe("Phase 2.1");
    });
  });

  describe("Rule 5: High-priority issues (80% confidence)", () => {
    beforeEach(async () => {
      mockGithub.paginate.mockResolvedValueOnce([
        {
          title: "Current Sprint",
          number: 1,
          closed_at: null,
          due_on: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        { title: "Backlog", number: 2, closed_at: null },
      ]);
      await agent.loadMilestones();
    });

    it("should assign current milestone to urgent issues", async () => {
      const issue = {
        number: 500,
        title: "Critical security vulnerability",
        body: "Must fix immediately",
        labels: [{ name: "priority:urgent" }],
      };

      const result = await agent.assignMilestone(issue);

      expect(result.reason).toBe("high-priority");
      expect(result.confidence).toBe(0.8);
      expect(result.milestoneTitle).toBe("Current Sprint");
    });

    it("should assign current milestone to high-priority issues", async () => {
      const issue = {
        number: 501,
        title: "Important fix",
        body: "",
        labels: [{ name: "priority:high" }],
      };

      const result = await agent.assignMilestone(issue);

      expect(result.reason).toBe("high-priority");
      expect(result.confidence).toBe(0.8);
    });

    it("should not apply high-priority rule without priority label", async () => {
      const issue = {
        number: 502,
        title: "Regular feature",
        body: "",
        labels: [],
      };

      const result = await agent.assignMilestone(issue);

      expect(result.reason).not.toBe("high-priority");
    });
  });

  describe("Rule 6: Default milestone (50% confidence)", () => {
    beforeEach(async () => {
      mockGithub.paginate.mockResolvedValueOnce([
        { title: "v2.0", number: 1, closed_at: "2026-01-01T00:00:00Z" },
        { title: "Backlog", number: 2, closed_at: null },
      ]);
      await agent.loadMilestones();
    });

    it("should assign backlog milestone to unmatched issues", async () => {
      const issue = {
        number: 600,
        title: "Some feature",
        body: "No matching rules",
        labels: [],
      };

      const result = await agent.assignMilestone(issue);

      expect(result.reason).toBe("default");
      expect(result.confidence).toBe(0.5);
      expect(result.milestoneTitle).toBe("Backlog");
    });

    it("should use next open milestone if backlog not found", async () => {
      agent.milestones = [
        { title: "v2.0", number: 1, closed_at: "2026-01-01T00:00:00Z" },
        { title: "v3.0", number: 2, closed_at: null },
      ];
      agent.milestoneMap = {
        "v2.0": agent.milestones[0],
        "v3.0": agent.milestones[1],
      };

      const issue = {
        number: 601,
        title: "Generic feature",
        body: "",
        labels: [],
      };

      const result = await agent.assignMilestone(issue);

      expect(result.milestoneNumber).toBe(2);
      expect(result.milestoneTitle).toBe("v3.0");
    });
  });

  describe("assignMilestone edge cases", () => {
    beforeEach(async () => {
      mockGithub.paginate.mockResolvedValueOnce([
        { title: "v1.0", number: 1 },
        { title: "v2.0", number: 2 },
      ]);
      await agent.loadMilestones();
    });

    it("should handle issues with existing milestone", async () => {
      const issue = {
        number: 700,
        title: "Already assigned",
        body: "",
        labels: [],
        milestone: { number: 1, title: "v1.0" },
      };

      const result = await agent.assignMilestone(issue);

      expect(result).toBe(1);
    });

    it("should handle string labels", async () => {
      const issue = {
        number: 701,
        title: "Epic: New feature",
        body: "",
        labels: ["type:epic", "priority:high"],
      };

      const result = await agent.assignMilestone(issue);

      expect(result).toBeDefined();
    });

    it("should handle missing body gracefully", async () => {
      const issue = {
        number: 702,
        title: "Issue v2.0",
        body: null,
        labels: [],
      };

      const result = await agent.assignMilestone(issue);

      expect(result.reason).toBe("version-keyword");
    });

    it("should return null when no milestones exist", async () => {
      agent.milestones = [];
      agent.milestoneMap = {};

      const issue = {
        number: 703,
        title: "Feature",
        body: "",
        labels: [],
      };

      const result = await agent.assignMilestone(issue);

      expect(result).toBeNull();
    });
  });

  describe("bulkAssignMilestones", () => {
    beforeEach(async () => {
      mockGithub.paginate.mockResolvedValueOnce([
        { title: "v1.0", number: 1 },
        { title: "v2.0", number: 2 },
        { title: "Backlog", number: 3 },
      ]);
      await agent.loadMilestones();
    });

    it("should process multiple issues and return results", async () => {
      const issues = [
        {
          number: 100,
          title: "Feature v2.0",
          body: "",
          labels: [],
        },
        {
          number: 101,
          title: "Generic issue",
          body: "",
          labels: [],
        },
      ];

      const results = await agent.bulkAssignMilestones(issues, {
        dryRun: true,
      });

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe("dry-run-success");
      expect(results[0].milestone).toBe("v2.0");
      expect(results[1].status).toBe("dry-run-success");
      expect(results[1].milestone).toBe("Backlog");
    });

    it("should make API calls in apply mode (not dry-run)", async () => {
      mockGithub.rest.issues.update.mockResolvedValue({});

      const issues = [
        {
          number: 200,
          title: "Feature v2.0",
          body: "",
          labels: [],
        },
      ];

      await agent.bulkAssignMilestones(issues, { dryRun: false });

      expect(mockGithub.rest.issues.update).toHaveBeenCalledWith(
        expect.objectContaining({
          owner: "owner",
          repo: "repo",
          issue_number: 200,
          milestone: 2,
        }),
      );
    });

    it("should catch and record errors for individual issues", async () => {
      mockGithub.rest.issues.update.mockRejectedValue(new Error("API Error"));

      const issues = [
        {
          number: 300,
          title: "Issue",
          body: "",
          labels: [],
        },
      ];

      const results = await agent.bulkAssignMilestones(issues, {
        dryRun: false,
      });

      expect(results[0].status).toBe("error");
      expect(results[0].error).toContain("API Error");
    });

    it("should include confidence and reason in bulk results", async () => {
      const issues = [
        {
          number: 400,
          title: "Epic for v2.0",
          body: "Phase 2 work",
          labels: [{ name: "type:epic" }],
        },
      ];

      const results = await agent.bulkAssignMilestones(issues, {
        dryRun: true,
      });

      // When version keyword is detected (95%), bulkAssignMilestones returns the selected result
      expect(results[0].status).toBe("dry-run-success");
      expect(results[0].reason).toBe("version-keyword");
      expect(results[0].confidence).toBe(0.95);
      expect(results[0].milestone).toBe("v2.0");
    });
  });

  describe("Milestone helper methods", () => {
    beforeEach(async () => {
      const now = new Date();
      const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      mockGithub.paginate.mockResolvedValueOnce([
        { title: "v1.0", number: 1, closed_at: "2026-01-01T00:00:00Z" },
        {
          title: "Current",
          number: 2,
          closed_at: null,
          due_on: future.toISOString(),
        },
        { title: "v2.0", number: 3, closed_at: null, due_on: null },
        { title: "v3.0", number: 4, closed_at: null, due_on: null },
      ]);
      await agent.loadMilestones();
    });

    it("should find current milestone by due date", () => {
      const current = agent.findCurrentMilestone();

      expect(current.title).toBe("Current");
    });

    it("should find next major milestone", () => {
      const next = agent.findNextMajorMilestone();

      expect(next.title).toBe("v2.0");
    });
  });

  describe("Confidence ranking", () => {
    beforeEach(async () => {
      mockGithub.paginate.mockResolvedValueOnce([
        { title: "v2.0", number: 1 },
        { title: "Phase 2", number: 2 },
        { title: "Backlog", number: 3 },
      ]);
      await agent.loadMilestones();
    });

    it("should select highest confidence candidate when multiple match", async () => {
      const issue = {
        number: 500,
        title: "Phase 2 work for v2.0",
        body: "",
        labels: [],
      };

      const result = await agent.assignMilestone(issue);

      // Version keyword (0.95) should beat phase match (0.85)
      expect(result.reason).toBe("version-keyword");
      expect(result.confidence).toBe(0.95);
      expect(result.alternatives).toContainEqual(
        expect.objectContaining({ reason: "phase-match" }),
      );
    });
  });
});
