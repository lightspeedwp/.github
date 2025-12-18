/**
 * Jest suite verifying the baseline behaviour of `build-label-alias-map.js`.
 * @see ../build-label-alias-map.js
 */
const fs = require("fs");
const yaml = require("js-yaml");
const { buildLabelAliasMap } = require("../build-label-alias-map");

// Mock dependencies
jest.mock("fs");
jest.mock("js-yaml");

describe("build-label-alias-map.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("buildLabelAliasMap", () => {
    it("should use default path if no path provided", () => {
      fs.readFileSync.mockReturnValue("[]");
      yaml.load.mockReturnValue([]);

      buildLabelAliasMap();

      expect(fs.readFileSync).toHaveBeenCalledWith(
        ".github/labels.yml",
        "utf8",
      );
    });

    it("should use custom path when provided", () => {
      fs.readFileSync.mockReturnValue("[]");
      yaml.load.mockReturnValue([]);

      buildLabelAliasMap("custom/path/labels.yml");

      expect(fs.readFileSync).toHaveBeenCalledWith(
        "custom/path/labels.yml",
        "utf8",
      );
    });

    it("should return empty object if no labels in file", () => {
      fs.readFileSync.mockReturnValue("[]");
      yaml.load.mockReturnValue([]);

      const result = buildLabelAliasMap();

      expect(result).toEqual({});
    });

    it("should build alias map for labels with aliases", () => {
      const labelsData = [
        {
          name: "bug",
          aliases: ["defect", "error", "issue"],
        },
        {
          name: "enhancement",
          aliases: ["feature", "improvement"],
        },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = buildLabelAliasMap();

      expect(result).toEqual({
        defect: "bug",
        error: "bug",
        issue: "bug",
        feature: "enhancement",
        improvement: "enhancement",
      });
    });

    it("should skip labels without aliases property", () => {
      const labelsData = [
        {
          name: "bug",
          aliases: ["defect"],
        },
        {
          name: "wontfix",
          // No aliases property
        },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = buildLabelAliasMap();

      expect(result).toEqual({
        defect: "bug",
      });
    });

    it("should skip labels with empty aliases array", () => {
      const labelsData = [
        {
          name: "bug",
          aliases: ["defect"],
        },
        {
          name: "enhancement",
          aliases: [],
        },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = buildLabelAliasMap();

      expect(result).toEqual({
        defect: "bug",
      });
    });

    it("should throw error on null label entries", () => {
      const labelsData = [
        {
          name: "bug",
          aliases: ["defect"],
        },
        "invalid-entry",
        null,
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      // The actual implementation doesn't handle null properly
      // This documents the current behavior
      expect(() => buildLabelAliasMap()).toThrow();
    });

    it("should skip labels with non-array aliases", () => {
      const labelsData = [
        {
          name: "bug",
          aliases: ["defect"],
        },
        {
          name: "enhancement",
          aliases: "not-an-array",
        },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = buildLabelAliasMap();

      expect(result).toEqual({
        defect: "bug",
      });
    });

    it("should handle labels with color and description", () => {
      const labelsData = [
        {
          name: "bug",
          color: "d73a4a",
          description: "Something isn't working",
          aliases: ["defect", "error"],
        },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = buildLabelAliasMap();

      expect(result).toEqual({
        defect: "bug",
        error: "bug",
      });
    });

    it("should handle multiple labels with multiple aliases", () => {
      const labelsData = [
        {
          name: "bug",
          aliases: ["defect", "error", "issue", "problem"],
        },
        {
          name: "enhancement",
          aliases: ["feature", "improvement", "request"],
        },
        {
          name: "documentation",
          aliases: ["docs", "readme"],
        },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = buildLabelAliasMap();

      expect(result).toEqual({
        defect: "bug",
        error: "bug",
        issue: "bug",
        problem: "bug",
        feature: "enhancement",
        improvement: "enhancement",
        request: "enhancement",
        docs: "documentation",
        readme: "documentation",
      });
    });

    it("should handle case-sensitive aliases", () => {
      const labelsData = [
        {
          name: "bug",
          aliases: ["Bug", "BUG", "defect"],
        },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = buildLabelAliasMap();

      expect(result).toEqual({
        Bug: "bug",
        BUG: "bug",
        defect: "bug",
      });
      expect(result.Bug).toBe("bug");
      expect(result.BUG).toBe("bug");
    });

    it("should handle aliases with special characters", () => {
      const labelsData = [
        {
          name: "in-progress",
          aliases: ["in progress", "work-in-progress", "WIP"],
        },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = buildLabelAliasMap();

      expect(result).toEqual({
        "in progress": "in-progress",
        "work-in-progress": "in-progress",
        WIP: "in-progress",
      });
    });

    it("should throw error if file reading fails", () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error("File not found");
      });

      expect(() => buildLabelAliasMap()).toThrow("File not found");
    });

    it("should throw error if YAML parsing fails", () => {
      fs.readFileSync.mockReturnValue("invalid: yaml: content:");
      yaml.load.mockImplementation(() => {
        throw new Error("YAML parse error");
      });

      expect(() => buildLabelAliasMap()).toThrow("YAML parse error");
    });

    it("should throw error with mixed valid and null entries", () => {
      const labelsData = [
        {
          name: "bug",
          aliases: ["defect"],
        },
        null,
        {
          name: "enhancement",
          aliases: ["feature"],
        },
        {},
        {
          name: "docs",
          aliases: null,
        },
        {
          name: "test",
          aliases: ["testing"],
        },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      // The actual implementation doesn't handle null properly
      // This documents the current behavior
      expect(() => buildLabelAliasMap()).toThrow();
    });

    it("should handle empty YAML file", () => {
      fs.readFileSync.mockReturnValue("");
      yaml.load.mockReturnValue(null);

      expect(() => buildLabelAliasMap()).toThrow();
    });

    it("should handle YAML file with single label", () => {
      const labelsData = [
        {
          name: "bug",
          aliases: ["defect"],
        },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = buildLabelAliasMap();

      expect(result).toEqual({
        defect: "bug",
      });
    });

    it("should overwrite duplicate aliases with last occurrence", () => {
      const labelsData = [
        {
          name: "bug",
          aliases: ["issue"],
        },
        {
          name: "task",
          aliases: ["issue"],
        },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = buildLabelAliasMap();

      // Last label wins for duplicate alias
      expect(result.issue).toBe("task");
    });

    it("should handle real-world labels.yml structure", () => {
      const labelsData = [
        {
          name: "Type: Bug",
          color: "d73a4a",
          description: "Something isn't working",
          aliases: ["bug", "defect", "error"],
        },
        {
          name: "Type: Enhancement",
          color: "a2eeef",
          description: "New feature or request",
          aliases: ["enhancement", "feature", "improvement"],
        },
        {
          name: "Priority: High",
          color: "ff0000",
          description: "High priority",
          aliases: ["high-priority", "urgent", "critical"],
        },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = buildLabelAliasMap();

      expect(result).toEqual({
        bug: "Type: Bug",
        defect: "Type: Bug",
        error: "Type: Bug",
        enhancement: "Type: Enhancement",
        feature: "Type: Enhancement",
        improvement: "Type: Enhancement",
        "high-priority": "Priority: High",
        urgent: "Priority: High",
        critical: "Priority: High",
      });
    });
  });
});
