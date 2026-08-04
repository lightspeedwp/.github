const {
  checkMilestoneCapacity,
  extractTypeFromLabels,
} = require("../milestone-allocation.cjs");

const mockConfig = {
  milestone_strategy: {
    capacity: {
      warn_threshold: 50,
      error_threshold: 100,
      exclude_types: ["chore", "task", "documentation"],
    },
  },
};

describe("milestone capacity", () => {
  describe("exclude_types filtering", () => {
    test("should exclude chore type from capacity warnings", () => {
      const filterIssues = (issues, config) => {
        const excludeTypes =
          config?.milestone_strategy?.capacity?.exclude_types || [];
        return issues.filter(
          (issue) =>
            !excludeTypes.includes(
              issue.type || extractTypeFromLabels(issue.labels),
            ),
        );
      };

      const issues = [
        { number: 1, type: "bug" },
        { number: 2, type: "chore" },
        { number: 3, type: "feature" },
        { number: 4, type: "task" },
      ];

      const filtered = filterIssues(issues, mockConfig);
      expect(filtered).toHaveLength(2);
      expect(filtered.map((i) => i.number)).toEqual([1, 3]);
    });

    test("should exclude task and documentation types", () => {
      const filterIssues = (issues, config) => {
        const excludeTypes =
          config?.milestone_strategy?.capacity?.exclude_types || [];
        return issues.filter(
          (issue) =>
            !excludeTypes.includes(
              issue.type || extractTypeFromLabels(issue.labels),
            ),
        );
      };

      const issues = [
        { number: 1, type: "bug" },
        { number: 2, type: "documentation" },
        { number: 3, type: "feature" },
        { number: 4, type: "task" },
        { number: 5, type: "documentation" },
      ];

      const filtered = filterIssues(issues, mockConfig);
      expect(filtered).toHaveLength(2);
      expect(filtered.map((i) => i.number)).toEqual([1, 3]);
    });

    test("should not warn when all issues are excluded types", () => {
      const allIssues = [
        { number: 1, type: "chore" },
        { number: 2, type: "task" },
        { number: 3, type: "documentation" },
      ];

      const excludeTypes = mockConfig.milestone_strategy.capacity.exclude_types;
      const filtered = allIssues.filter((i) => !excludeTypes.includes(i.type));
      const warnings = checkMilestoneCapacity(
        "v1.0",
        filtered.length,
        mockConfig,
      );

      expect(warnings).toEqual([]);
    });

    test("should warn when non-excluded issues reach threshold", () => {
      const allIssues = Array.from({ length: 80 }, (_, i) => ({
        number: i + 1,
        type: i % 4 === 0 ? "chore" : "bug", // 20 chores, 60 bugs
      }));

      const excludeTypes = mockConfig.milestone_strategy.capacity.exclude_types;
      const filtered = allIssues.filter((i) => !excludeTypes.includes(i.type));
      const warnings = checkMilestoneCapacity(
        "v1.0",
        filtered.length,
        mockConfig,
      );

      expect(warnings).toHaveLength(1);
      expect(warnings[0].level).toBe("warn");
    });
  });

  describe("capacity thresholds with exclusion", () => {
    test("warn threshold (50) should trigger with 50+ non-excluded issues", () => {
      const warnings = checkMilestoneCapacity("v1.0", 50, mockConfig);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].level).toBe("warn");
    });

    test("error threshold (100) should trigger with 100+ non-excluded issues", () => {
      const warnings = checkMilestoneCapacity("v1.0", 100, mockConfig);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].level).toBe("error");
    });

    test("should not warn with 49 non-excluded issues", () => {
      const warnings = checkMilestoneCapacity("v1.0", 49, mockConfig);
      expect(warnings).toEqual([]);
    });

    test("should not error with 99 non-excluded issues", () => {
      const warnings = checkMilestoneCapacity("v1.0", 99, mockConfig);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].level).toBe("warn");
    });
  });
});
