/**
 * ============================================================================
 * Tests for labeler-utils utility functions
 * Location: .github/agents/includes/__tests__/labeler-utils.test.js
 * Description:
 *   - Tests labeler.yml rule parsing and application
 *   - Covers file glob matching and branch pattern matching
 * Standards:
 *   - Follows LightSpeedWP Coding Standards
 * ============================================================================
 */

const { fetchLabelerRules, applyLabelerRules } = require("../labeler-utils");

describe("labeler-utils.js", () => {
  describe("fetchLabelerRules", () => {
    test("fetches and parses labeler.yml from GitHub", async () => {
      const mockYaml = `
type:feature:
  head-branch: ['^feat/']
type:bug:
  head-branch: ['^fix/']
`;
      const mockOctokit = {
        rest: {
          repos: {
            getContent: jest.fn().mockResolvedValue({
              data: {
                content: Buffer.from(mockYaml).toString("base64"),
              },
            }),
          },
        },
      };

      const rules = await fetchLabelerRules(mockOctokit);

      expect(mockOctokit.rest.repos.getContent).toHaveBeenCalledWith({
        owner: "lightspeedwp",
        repo: ".github",
        path: ".github/labeler.yml",
      });
      expect(rules).toHaveProperty("type:feature");
      expect(rules).toHaveProperty("type:bug");
    });

    test("accepts custom owner, repo, and path parameters", async () => {
      const mockOctokit = {
        rest: {
          repos: {
            getContent: jest.fn().mockResolvedValue({
              data: {
                content: Buffer.from("{}").toString("base64"),
              },
            }),
          },
        },
      };

      await fetchLabelerRules(
        mockOctokit,
        "custom-org",
        "custom-repo",
        "custom/path.yml",
      );

      expect(mockOctokit.rest.repos.getContent).toHaveBeenCalledWith({
        owner: "custom-org",
        repo: "custom-repo",
        path: "custom/path.yml",
      });
    });

    test("handles API errors", async () => {
      const mockOctokit = {
        rest: {
          repos: {
            getContent: jest.fn().mockRejectedValue(new Error("API Error")),
          },
        },
      };

      await expect(fetchLabelerRules(mockOctokit)).rejects.toThrow("API Error");
    });

    test("handles invalid YAML", async () => {
      const mockOctokit = {
        rest: {
          repos: {
            getContent: jest.fn().mockResolvedValue({
              data: {
                content: Buffer.from("invalid: yaml: [").toString("base64"),
              },
            }),
          },
        },
      };

      await expect(fetchLabelerRules(mockOctokit)).rejects.toThrow();
    });
  });

  describe("applyLabelerRules", () => {
    describe("file-based matching", () => {
      test("matches files with any-glob-to-any-file pattern", () => {
        const rules = {
          "area:core": {
            "changed-files": {
              "any-glob-to-any-file": ["src/core/**/*.js"],
            },
          },
        };
        const changedFiles = ["src/core/utils/helper.js"];
        const branch = null;

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).toContain("area:core");
      });

      test("matches multiple file patterns", () => {
        const rules = {
          "lang:javascript": {
            "changed-files": {
              "any-glob-to-any-file": ["**/*.js", "**/*.jsx"],
            },
          },
        };
        const changedFiles = ["src/component.jsx"];
        const branch = null;

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).toContain("lang:javascript");
      });

      test("handles ** double-star glob patterns", () => {
        const rules = {
          "area:tests": {
            "changed-files": {
              "any-glob-to-any-file": ["**/*.test.js"],
            },
          },
        };
        const changedFiles = [
          "src/utils/helpers.test.js",
          "tests/integration/api.test.js",
        ];
        const branch = null;

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).toContain("area:tests");
      });

      test("handles * single-star glob patterns", () => {
        const rules = {
          "area:docs": {
            "changed-files": {
              "any-glob-to-any-file": ["docs/*.md"],
            },
          },
        };
        const changedFiles = ["docs/README.md"];
        const branch = null;

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).toContain("area:docs");
      });

      test("does not match files outside glob pattern", () => {
        const rules = {
          "area:frontend": {
            "changed-files": {
              "any-glob-to-any-file": ["src/frontend/**/*"],
            },
          },
        };
        const changedFiles = ["src/backend/api.js"];
        const branch = null;

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).not.toContain("area:frontend");
      });

      test("applies multiple labels for multiple matches", () => {
        const rules = {
          "lang:javascript": {
            "changed-files": {
              "any-glob-to-any-file": ["**/*.js"],
            },
          },
          "area:core": {
            "changed-files": {
              "any-glob-to-any-file": ["src/core/**/*"],
            },
          },
        };
        const changedFiles = ["src/core/utils.js"];
        const branch = null;

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).toContain("lang:javascript");
        expect(labels).toContain("area:core");
        expect(labels).toHaveLength(2);
      });
    });

    describe("branch-based matching", () => {
      test("matches branch with head-branch pattern", () => {
        const rules = {
          "type:feature": {
            "head-branch": ["^feat/.*"],
          },
        };
        const changedFiles = [];
        const branch = "feat/new-feature";

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).toContain("type:feature");
      });

      test("matches multiple branch patterns", () => {
        const rules = {
          "type:bug": {
            "head-branch": ["^fix/.*", "^bugfix/.*", "^hotfix/.*"],
          },
        };
        const changedFiles = [];

        expect(
          applyLabelerRules(rules, changedFiles, "fix/issue-123"),
        ).toContain("type:bug");
        expect(
          applyLabelerRules(rules, changedFiles, "bugfix/crash"),
        ).toContain("type:bug");
        expect(
          applyLabelerRules(rules, changedFiles, "hotfix/urgent"),
        ).toContain("type:bug");
      });

      test("handles wildcard patterns in branch names", () => {
        const rules = {
          release: {
            "head-branch": ["release/.*"],
          },
        };
        const changedFiles = [];
        const branch = "release/v1.2.0";

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).toContain("release");
      });

      test("does not match when branch does not match pattern", () => {
        const rules = {
          "type:feature": {
            "head-branch": ["^feat/.*"],
          },
        };
        const changedFiles = [];
        const branch = "fix/some-bug";

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).not.toContain("type:feature");
      });

      test("handles null branch gracefully", () => {
        const rules = {
          "type:feature": {
            "head-branch": ["^feat/.*"],
          },
        };
        const changedFiles = [];
        const branch = null;

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).toHaveLength(0);
      });
    });

    describe("combined file and branch matching", () => {
      test("applies label when both file and branch match", () => {
        const rules = {
          "area:core": {
            "changed-files": {
              "any-glob-to-any-file": ["src/core/**/*"],
            },
            "head-branch": ["^feat/.*"],
          },
        };
        const changedFiles = ["src/core/api.js"];
        const branch = "feat/new-api";

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).toContain("area:core");
      });

      test("applies label when either file or branch matches", () => {
        const rules = {
          "multi-rule": {
            "changed-files": {
              "any-glob-to-any-file": ["src/**/*"],
            },
            "head-branch": ["^feat/.*"],
          },
        };

        // File matches, branch doesn't
        expect(applyLabelerRules(rules, ["src/file.js"], "fix/bug")).toContain(
          "multi-rule",
        );

        // Branch matches, file doesn't
        expect(
          applyLabelerRules(rules, ["other/file.js"], "feat/new"),
        ).toContain("multi-rule");

        // Both match
        expect(applyLabelerRules(rules, ["src/file.js"], "feat/new")).toContain(
          "multi-rule",
        );
      });

      test("does not apply label when neither file nor branch match", () => {
        const rules = {
          "strict-rule": {
            "changed-files": {
              "any-glob-to-any-file": ["src/specific/**/*"],
            },
            "head-branch": ["^feat/.*"],
          },
        };
        const changedFiles = ["other/file.js"];
        const branch = "fix/bug";

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).not.toContain("strict-rule");
      });
    });

    describe("edge cases", () => {
      test("handles empty rules object", () => {
        const rules = {};
        const changedFiles = ["file.js"];
        const branch = "feat/test";

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).toHaveLength(0);
      });

      test("handles empty changedFiles array", () => {
        const rules = {
          "some-label": {
            "changed-files": {
              "any-glob-to-any-file": ["**/*"],
            },
          },
        };
        const changedFiles = [];
        const branch = null;

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).toHaveLength(0);
      });

      test("handles rules with only branch patterns", () => {
        const rules = {
          "branch-only": {
            "head-branch": ["^develop$"],
          },
        };
        const changedFiles = ["any-file.js"];
        const branch = "develop";

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).toContain("branch-only");
      });

      test("handles rules with only file patterns", () => {
        const rules = {
          "file-only": {
            "changed-files": {
              "any-glob-to-any-file": ["README.md"],
            },
          },
        };
        const changedFiles = ["README.md"];
        const branch = null;

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).toContain("file-only");
      });

      test("returns unique labels (no duplicates)", () => {
        const rules = {
          "duplicate-label": {
            "changed-files": {
              "any-glob-to-any-file": ["**/*.js", "**/*.jsx"],
            },
            "head-branch": ["^feat/.*"],
          },
        };
        const changedFiles = ["file.js", "component.jsx"];
        const branch = "feat/new";

        const labels = applyLabelerRules(rules, changedFiles, branch);

        // Should only appear once despite multiple matches
        expect(labels.filter((l) => l === "duplicate-label")).toHaveLength(1);
      });

      test("handles special characters in file paths", () => {
        const rules = {
          special: {
            "changed-files": {
              "any-glob-to-any-file": ["path-with-dashes/**/*"],
            },
          },
        };
        const changedFiles = ["path-with-dashes/file.name.js"];
        const branch = null;

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).toContain("special");
      });

      test("handles very long file paths", () => {
        const rules = {
          deep: {
            "changed-files": {
              "any-glob-to-any-file": ["**/*.js"],
            },
          },
        };
        const changedFiles = [
          "very/deep/nested/directory/structure/with/many/levels/file.js",
        ];
        const branch = null;

        const labels = applyLabelerRules(rules, changedFiles, branch);

        expect(labels).toContain("deep");
      });
    });

    describe("real-world scenarios", () => {
      test("LightSpeedWP typical labeler rules", () => {
        const rules = {
          "type:feature": {
            "head-branch": ["^feat/.*"],
          },
          "type:bug": {
            "head-branch": ["^fix/.*", "^bugfix/.*"],
          },
          "area:ci": {
            "changed-files": {
              "any-glob-to-any-file": [".github/workflows/**/*"],
            },
          },
          "area:docs": {
            "changed-files": {
              "any-glob-to-any-file": ["docs/**/*", "**/*.md"],
            },
          },
          "lang:php": {
            "changed-files": {
              "any-glob-to-any-file": ["**/*.php"],
            },
          },
        };

        // Feature PR with PHP changes
        let labels = applyLabelerRules(
          rules,
          ["src/includes/functions.php"],
          "feat/new-feature",
        );
        expect(labels).toContain("type:feature");
        expect(labels).toContain("lang:php");

        // Bug fix with CI changes
        labels = applyLabelerRules(
          rules,
          [".github/workflows/test.yml"],
          "fix/ci-issue",
        );
        expect(labels).toContain("type:bug");
        expect(labels).toContain("area:ci");

        // Documentation update
        labels = applyLabelerRules(
          rules,
          ["docs/README.md"],
          "docs/update-readme",
        );
        expect(labels).toContain("area:docs");
      });
    });
  });
});
