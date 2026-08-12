const {
  getMilestoneForIssue,
  getProjectForIssue,
  checkMilestoneCapacity,
  getActiveMilestones,
  extractTypeFromLabels,
} = require("../milestone-allocation.cjs");

// Mock config for testing
const mockConfig = {
  milestone_strategy: {
    allocation: {
      high_priority_labels: ["security", "critical-bug"],
      next_milestone: "v1.0",
      backlog_labels: ["research", "enhancement"],
      backlog_milestone: null,
      default_milestone: "v1.0",
    },
    active_milestones: ["v1.0", "v1.1", "v1.2"],
    capacity: {
      warn_threshold: 50,
      error_threshold: 100,
      exclude_types: ["chore", "task", "documentation"],
    },
  },
};

describe("milestone-allocation", () => {
  describe("extractTypeFromLabels", () => {
    test("extracts type from labels", () => {
      const labels = [{ name: "type:bug" }, { name: "area:core" }];
      expect(extractTypeFromLabels(labels)).toBe("bug");
    });

    test("returns null when type label not found", () => {
      const labels = [{ name: "area:core" }, { name: "priority:high" }];
      expect(extractTypeFromLabels(labels)).toBeNull();
    });

    test("handles label strings (not objects)", () => {
      const labels = ["type:feature", "area:ai"];
      expect(extractTypeFromLabels(labels)).toBe("feature");
    });
  });

  describe("getMilestoneForIssue", () => {
    test("allocates high-priority labels to next milestone", () => {
      const issue = {
        labels: [{ name: "security" }],
        milestone: null,
      };
      const milestone = getMilestoneForIssue(issue, mockConfig);
      expect(milestone).toBe("v1.0");
    });

    test("allocates backlog labels to null (no milestone)", () => {
      const issue = {
        labels: [{ name: "research" }],
        milestone: null,
      };
      const milestone = getMilestoneForIssue(issue, mockConfig);
      expect(milestone).toBeNull();
    });

    test("allocates default for untagged issues", () => {
      const issue = {
        labels: [],
        milestone: null,
      };
      const milestone = getMilestoneForIssue(issue, mockConfig);
      expect(milestone).toBe("v1.0");
    });

    test("prioritizes high-priority over backlog when both present", () => {
      const issue = {
        labels: [{ name: "security" }, { name: "enhancement" }],
        milestone: null,
      };
      const milestone = getMilestoneForIssue(issue, mockConfig);
      expect(milestone).toBe("v1.0");
    });

    test("handles critical-bug label", () => {
      const issue = {
        labels: [{ name: "critical-bug" }],
        milestone: null,
      };
      const milestone = getMilestoneForIssue(issue, mockConfig);
      expect(milestone).toBe("v1.0");
    });
  });

  describe("checkMilestoneCapacity", () => {
    test("returns no warnings when below threshold", () => {
      const warnings = checkMilestoneCapacity("v1.0", 30, mockConfig);
      expect(warnings).toEqual([]);
    });

    test("returns warn when at warn threshold", () => {
      const warnings = checkMilestoneCapacity("v1.0", 50, mockConfig);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].level).toBe("warn");
      expect(warnings[0].message).toContain("approaching capacity");
    });

    test("returns error when at error threshold", () => {
      const warnings = checkMilestoneCapacity("v1.0", 100, mockConfig);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].level).toBe("error");
      expect(warnings[0].message).toContain("exceeds error threshold");
    });

    test("returns error when exceeding error threshold", () => {
      const warnings = checkMilestoneCapacity("v1.0", 120, mockConfig);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].level).toBe("error");
    });
  });

  describe("getActiveMilestones", () => {
    test("returns active milestones from config", () => {
      const milestones = getActiveMilestones(mockConfig);
      expect(milestones).toEqual(["v1.0", "v1.1", "v1.2"]);
    });

    test("returns empty array when not configured", () => {
      const config = { milestone_strategy: {} };
      const milestones = getActiveMilestones(config);
      expect(milestones).toEqual([]);
    });
  });

  describe("getProjectForIssue", () => {
    test("returns default project when no routes match", () => {
      const config = {
        default_project: { url: "https://github.com/orgs/test/projects/1" },
        routes: [],
      };
      const issue = { labels: [], type: "feature" };
      const project = getProjectForIssue(issue, config);
      expect(project).toBe("https://github.com/orgs/test/projects/1");
    });

    test("returns project for matching type filter", () => {
      const config = {
        default_project: { url: "https://github.com/orgs/test/projects/1" },
        routes: [
          {
            enabled: true,
            filter: { type: ["bug", "feature"] },
            project_url: "https://github.com/orgs/test/projects/2",
          },
        ],
      };
      const issue = { labels: [], type: "bug" };
      const project = getProjectForIssue(issue, config);
      expect(project).toBe("https://github.com/orgs/test/projects/2");
    });

    test("returns project for matching label filter", () => {
      const config = {
        default_project: { url: "https://github.com/orgs/test/projects/1" },
        routes: [
          {
            enabled: true,
            filter: { label: ["security", "compliance"] },
            project_url: "https://github.com/orgs/test/projects/3",
          },
        ],
      };
      const issue = { labels: [{ name: "security" }], type: null };
      const project = getProjectForIssue(issue, config);
      expect(project).toBe("https://github.com/orgs/test/projects/3");
    });

    test("skips disabled routes", () => {
      const config = {
        default_project: { url: "https://github.com/orgs/test/projects/1" },
        routes: [
          {
            enabled: false,
            filter: { type: ["bug"] },
            project_url: "https://github.com/orgs/test/projects/2",
          },
        ],
      };
      const issue = { labels: [], type: "bug" };
      const project = getProjectForIssue(issue, config);
      expect(project).toBe("https://github.com/orgs/test/projects/1");
    });
  });
});
