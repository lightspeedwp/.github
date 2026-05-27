const {
  matchesBranchPattern,
  matchesFilePatterns,
  determineLabelsFromRules,
} = require("../labeler-utils.js");

describe("labeler-utils", () => {
  describe("matchesBranchPattern", () => {
    test("matches regex and glob patterns", () => {
      expect(matchesBranchPattern("feat/new-flow", ["^feat/.*"])).toBe(true);
      expect(matchesBranchPattern("docs/readme", ["docs/*"])).toBe(true);
      expect(matchesBranchPattern("fix/bug", ["^feat/.*", "docs/*"])).toBe(
        false,
      );
    });

    test("returns false for invalid regex patterns", () => {
      expect(matchesBranchPattern("feat/new-flow", ["^(feat"])).toBe(false);
    });
  });

  describe("matchesFilePatterns", () => {
    const changedFiles = [
      ".github/workflows/labeling.yml",
      "docs/ISSUE_LABELS.md",
      "scripts/agents/labeling.agent.js",
    ];

    test("supports any-glob-to-any-file", () => {
      const config = {
        "any-glob-to-any-file": [".github/workflows/**", "src/**"],
      };
      expect(matchesFilePatterns(changedFiles, config)).toBe(true);
    });

    test("supports all-globs-to-all-files", () => {
      const config = {
        "all-globs-to-all-files": [".github/workflows/**", "docs/**"],
      };
      expect(matchesFilePatterns(changedFiles, config)).toBe(true);
    });

    test("supports any-glob-to-all-files", () => {
      const markdownFiles = ["docs/ISSUE_LABELS.md", "docs/ISSUE_TYPES.md"];
      const config = {
        "any-glob-to-all-files": ["docs/**/*.md", "scripts/**/*.js"],
      };
      expect(matchesFilePatterns(markdownFiles, config)).toBe(true);
    });
  });

  describe("determineLabelsFromRules", () => {
    test("applies branch and file labels exactly once", () => {
      const context = {
        payload: {
          pull_request: {
            number: 427,
            head: { ref: "feat/label-hardening" },
          },
        },
      };

      const labelerRules = {
        "type:feature": {
          "head-branch": ["^feat/.*"],
        },
        "area:ci": {
          "changed-files": {
            "any-glob-to-any-file": [".github/workflows/**"],
          },
        },
        "area:labels": {
          "head-branch": ["^feat/.*"],
          "changed-files": {
            "any-glob-to-any-file": ["scripts/agents/**"],
          },
        },
      };

      const changedFiles = [
        ".github/workflows/labeling.yml",
        "scripts/agents/labeling.agent.js",
      ];

      const labels = determineLabelsFromRules(
        context,
        labelerRules,
        changedFiles,
      );

      expect(labels).toContain("type:feature");
      expect(labels).toContain("area:ci");
      expect(labels).toContain("area:labels");
      expect(labels.filter((label) => label === "area:labels")).toHaveLength(1);
    });
  });
});
