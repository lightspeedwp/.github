const fs = require("fs");
const yaml = require("js-yaml");
const { fetchCanonicalLabels } = require("../fetch-canonical-labels");

// Mock dependencies
jest.mock("fs");
jest.mock("js-yaml");

describe("fetch-canonical-labels.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchCanonicalLabels", () => {
    it("should use default path if no path provided", () => {
      fs.readFileSync.mockReturnValue("[]");
      yaml.load.mockReturnValue([]);

      fetchCanonicalLabels();

      expect(fs.readFileSync).toHaveBeenCalledWith(
        ".github/labels.yml",
        "utf8",
      );
    });

    it("should use custom path when provided", () => {
      fs.readFileSync.mockReturnValue("[]");
      yaml.load.mockReturnValue([]);

      fetchCanonicalLabels("custom/path/labels.yml");

      expect(fs.readFileSync).toHaveBeenCalledWith(
        "custom/path/labels.yml",
        "utf8",
      );
    });

    it("should return empty array for empty labels file", () => {
      fs.readFileSync.mockReturnValue("[]");
      yaml.load.mockReturnValue([]);

      const result = fetchCanonicalLabels();

      expect(result).toEqual([]);
    });

    it("should extract label names from object format", () => {
      const labelsData = [
        { name: "bug", color: "d73a4a", description: "Bug report" },
        {
          name: "enhancement",
          color: "a2eeef",
          description: "Feature request",
        },
        { name: "documentation", color: "0075ca", description: "Docs update" },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual(["bug", "enhancement", "documentation"]);
    });

    it("should handle string format labels", () => {
      const labelsData = ["bug", "enhancement", "documentation"];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual(["bug", "enhancement", "documentation"]);
    });

    it("should handle mixed string and object format", () => {
      const labelsData = [
        "bug",
        { name: "enhancement", color: "a2eeef" },
        "documentation",
        { name: "wontfix", color: "ffffff" },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual([
        "bug",
        "enhancement",
        "documentation",
        "wontfix",
      ]);
    });

    it("should handle labels with additional properties", () => {
      const labelsData = [
        {
          name: "bug",
          color: "d73a4a",
          description: "Bug report",
          aliases: ["defect", "error"],
        },
        {
          name: "enhancement",
          color: "a2eeef",
          description: "Feature request",
          aliases: ["feature"],
        },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual(["bug", "enhancement"]);
    });

    it("should preserve label name order", () => {
      const labelsData = [
        { name: "zzz-last" },
        { name: "aaa-first" },
        { name: "mmm-middle" },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual(["zzz-last", "aaa-first", "mmm-middle"]);
    });

    it("should handle labels with special characters", () => {
      const labelsData = [
        { name: "Type: Bug" },
        { name: "Status: In Progress" },
        { name: "Priority: High" },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual([
        "Type: Bug",
        "Status: In Progress",
        "Priority: High",
      ]);
    });

    it("should handle labels with emojis", () => {
      const labelsData = [
        { name: "🐛 bug" },
        { name: "✨ enhancement" },
        { name: "📚 documentation" },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual(["🐛 bug", "✨ enhancement", "📚 documentation"]);
    });

    it("should handle single label", () => {
      const labelsData = [{ name: "bug" }];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual(["bug"]);
    });

    it("should handle labels with hyphenated names", () => {
      const labelsData = [
        { name: "good-first-issue" },
        { name: "help-wanted" },
        { name: "work-in-progress" },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual([
        "good-first-issue",
        "help-wanted",
        "work-in-progress",
      ]);
    });

    it("should handle labels with uppercase names", () => {
      const labelsData = [
        { name: "WIP" },
        { name: "RFC" },
        { name: "BREAKING_CHANGE" },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual(["WIP", "RFC", "BREAKING_CHANGE"]);
    });

    it("should handle real-world labels.yml structure", () => {
      const labelsData = [
        {
          name: "Type: Bug",
          color: "d73a4a",
          description: "Something isn't working",
          aliases: ["bug", "defect"],
        },
        {
          name: "Type: Enhancement",
          color: "a2eeef",
          description: "New feature or request",
          aliases: ["enhancement", "feature"],
        },
        {
          name: "Priority: High",
          color: "ff0000",
          description: "High priority",
        },
        "good-first-issue",
        "help-wanted",
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual([
        "Type: Bug",
        "Type: Enhancement",
        "Priority: High",
        "good-first-issue",
        "help-wanted",
      ]);
    });

    it("should throw error if file reading fails", () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error("File not found");
      });

      expect(() => fetchCanonicalLabels()).toThrow("File not found");
    });

    it("should throw error if YAML parsing fails", () => {
      fs.readFileSync.mockReturnValue("invalid: yaml: content:");
      yaml.load.mockImplementation(() => {
        throw new Error("YAML parse error");
      });

      expect(() => fetchCanonicalLabels()).toThrow("YAML parse error");
    });

    it("should handle null or undefined YAML content", () => {
      fs.readFileSync.mockReturnValue("");
      yaml.load.mockReturnValue(null);

      expect(() => fetchCanonicalLabels()).toThrow();
    });

    it("should return array of strings only", () => {
      const labelsData = [
        { name: "bug", color: "d73a4a" },
        { name: "enhancement", color: "a2eeef" },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(Array.isArray(result)).toBe(true);
      result.forEach((label) => {
        expect(typeof label).toBe("string");
      });
    });

    it("should handle labels with only name property", () => {
      const labelsData = [{ name: "bug" }, { name: "enhancement" }];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual(["bug", "enhancement"]);
    });

    it("should handle large number of labels", () => {
      const labelsData = Array.from({ length: 100 }, (_, i) => ({
        name: `label-${i}`,
      }));

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toHaveLength(100);
      expect(result[0]).toBe("label-0");
      expect(result[99]).toBe("label-99");
    });

    it("should handle labels with numeric names", () => {
      const labelsData = [
        { name: "v1.0.0" },
        { name: "2023-Q1" },
        { name: "PR-123" },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual(["v1.0.0", "2023-Q1", "PR-123"]);
    });

    it("should handle labels with underscores", () => {
      const labelsData = [
        { name: "good_first_issue" },
        { name: "help_wanted" },
        { name: "in_progress" },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual([
        "good_first_issue",
        "help_wanted",
        "in_progress",
      ]);
    });

    it("should handle labels with dots", () => {
      const labelsData = [
        { name: "version.1.0" },
        { name: "node.js" },
        { name: "v1.0.0" },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual(["version.1.0", "node.js", "v1.0.0"]);
    });

    it("should handle empty string label names", () => {
      const labelsData = [{ name: "" }, { name: "bug" }, { name: "" }];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual(["", "bug", ""]);
    });

    it("should call yaml.load with file content", () => {
      const content = "- name: bug\n- name: enhancement";
      fs.readFileSync.mockReturnValue(content);
      yaml.load.mockReturnValue([{ name: "bug" }, { name: "enhancement" }]);

      fetchCanonicalLabels();

      expect(yaml.load).toHaveBeenCalledWith(content);
    });

    it("should handle labels with whitespace in names", () => {
      const labelsData = [
        { name: "  bug  " },
        { name: "enhancement  " },
        { name: "  documentation" },
      ];

      fs.readFileSync.mockReturnValue(JSON.stringify(labelsData));
      yaml.load.mockReturnValue(labelsData);

      const result = fetchCanonicalLabels();

      expect(result).toEqual(["  bug  ", "enhancement  ", "  documentation"]);
    });
  });
});
