/**
 * Jest suite verifying the behaviour of `linting.agent.js`.
 * @see ../linting.agent.js
 */
const agent = require("../linting.agent");

describe("linting.agent", () => {
  beforeEach(() => {
    agent.clearLintConfigCache();
  });

  describe("module surface", () => {
    it("exposes the lint orchestration helpers", () => {
      expect(typeof agent).toBe("function");
      expect(typeof agent.lintCodebase).toBe("function");
      expect(typeof agent.parseLintTargets).toBe("function");
      expect(typeof agent.selectRulesForFile).toBe("function");
      expect(typeof agent.formatLintReport).toBe("function");
    });
  });

  describe("target parsing", () => {
    it("normalises strings, arrays, and object inputs", () => {
      expect(
        agent.parseLintTargets(
          "src/index.js, docs/guide.md\nscripts/run.sh",
          "/repo",
        ),
      ).toEqual(["src/index.js", "docs/guide.md", "scripts/run.sh"]);

      expect(
        agent.parseLintTargets(
          ["src/index.js", "src/index.js", "docs/guide.md", ""],
          "/repo",
        ),
      ).toEqual(["src/index.js", "docs/guide.md"]);

      expect(
        agent.parseLintTargets(
          { files: ["src/index.js", "docs/guide.md"], paths: ["ignored.js"] },
          "/repo",
        ),
      ).toEqual(["src/index.js", "docs/guide.md"]);
    });

    it("returns an empty list for blank input", () => {
      expect(agent.parseLintTargets("", "/repo")).toEqual([]);
      expect(agent.parseLintTargets(null, "/repo")).toEqual([]);
      expect(agent.parseLintTargets({ files: 1 }, "/repo")).toEqual([]);
    });

    it("normalises absolute paths relative to the root directory", () => {
      expect(
        agent.normaliseFilePath("/repo/src/components/App.jsx", "/repo"),
      ).toBe("src/components/App.jsx");
    });
  });

  describe("rule selection", () => {
    it("selects matching rules in configured order", () => {
      const config = {
        rules: [
          { name: "markdownlint", extensions: [".md"], order: 2 },
          { name: "eslint", extensions: [".js", ".jsx"], order: 1 },
          { name: "shellcheck", extensions: [".sh"], enabled: false, order: 0 },
        ],
      };

      expect(agent.selectRulesForFile("src/index.js", config)).toEqual([
        "eslint",
      ]);
      expect(agent.selectRulesForFile("docs/readme.md", config)).toEqual([
        "markdownlint",
      ]);
      expect(agent.selectRulesForFile("bin/build.sh", config)).toEqual([]);
    });

    it("treats missing rule order as zero and keeps the original sequence stable", () => {
      const config = {
        rules: [
          { name: "eslint", extensions: [".js"] },
          { name: "custom-js", extensions: [".js"] },
        ],
      };

      expect(agent.selectRulesForFile("src/index.js", config)).toEqual([
        "eslint",
        "custom-js",
      ]);
    });

    it("falls back to the default rule map when no config is provided", () => {
      expect(agent.selectRulesForFile("src/index.ts")).toEqual(["eslint"]);
      expect(agent.selectRulesForFile("docs/readme.md")).toEqual([
        "markdownlint",
      ]);
    });
  });

  describe("config loading", () => {
    it("throws when the config file is missing", () => {
      const fsImpl = {
        existsSync: jest.fn(() => false),
        readFileSync: jest.fn(),
      };

      expect(() =>
        agent.readConfigFile("/repo/lint.config.json", fsImpl),
      ).toThrow("Lint config file not found");
    });

    it("throws when the config file is invalid JSON", () => {
      const fsImpl = {
        existsSync: jest.fn(() => true),
        readFileSync: jest.fn(() => "{not-json"),
      };

      expect(() =>
        agent.readConfigFile("/repo/lint.config.json", fsImpl),
      ).toThrow("Invalid lint config");
    });

    it("rejects null config payloads read from disk", () => {
      const fsImpl = {
        existsSync: jest.fn(() => true),
        readFileSync: jest.fn(() => "null"),
      };

      expect(() =>
        agent.readConfigFile("/repo/lint.config.json", fsImpl),
      ).toThrow("lint config must be an object");
    });

    it("validates object config shape", () => {
      expect(() => agent.normaliseConfig([], "/repo")).toThrow(
        "lint config must be an object",
      );
      expect(() => agent.normaliseConfig({ rules: {} }, "/repo")).toThrow(
        "lint config rules must be an array",
      );
    });

    it("resolves config paths and leaves invalid input unresolved", () => {
      expect(agent.resolveConfigPath("lint.config.json", "/repo")).toBe(
        "/repo/lint.config.json",
      );
      expect(agent.resolveConfigPath(null, "/repo")).toBeNull();
    });

    it("caches loaded configs by path and honours cache resets", () => {
      const responses = {
        "/repo/lint.config.json": JSON.stringify({
          reportTitle: "Lint A",
          rules: [{ name: "eslint", extensions: [".js"], order: 1 }],
        }),
      };
      const fsImpl = {
        existsSync: jest.fn((filePath) => Boolean(responses[filePath])),
        readFileSync: jest.fn((filePath) => responses[filePath]),
      };

      const first = agent.normaliseConfig("lint.config.json", "/repo", fsImpl);
      expect(first.reportTitle).toBe("Lint A");
      expect(fsImpl.readFileSync).toHaveBeenCalledTimes(1);

      responses["/repo/lint.config.json"] = JSON.stringify({
        reportTitle: "Lint B",
        rules: [{ name: "markdownlint", extensions: [".md"], order: 1 }],
      });

      const second = agent.normaliseConfig("lint.config.json", "/repo", fsImpl);
      expect(second.reportTitle).toBe("Lint A");
      expect(fsImpl.readFileSync).toHaveBeenCalledTimes(1);

      agent.clearLintConfigCache();

      const third = agent.normaliseConfig("lint.config.json", "/repo", fsImpl);
      expect(third.reportTitle).toBe("Lint B");
      expect(fsImpl.readFileSync).toHaveBeenCalledTimes(2);
    });
  });

  describe("finding processing", () => {
    it("normalises and rejects findings consistently", () => {
      expect(agent.normaliseFinding(null)).toBeNull();
      expect(
        agent.normaliseFinding({
          file: "src/index.js",
          text: "Unexpected console statement",
          ruleId: "eslint",
        }),
      ).toEqual({
        filePath: "src/index.js",
        message: "Unexpected console statement",
        rule: "eslint",
        severity: "error",
      });
      expect(agent.normaliseFinding({ filePath: "src/index.js" })).toBeNull();
      expect(agent.flattenFindings(null)).toEqual([]);
    });

    it("deduplicates and groups findings by file", () => {
      const findings = [
        {
          filePath: "src/index.js",
          rule: "eslint",
          message: "Missing semicolon",
          severity: "error",
        },
        {
          filePath: "src/index.js",
          rule: "eslint",
          message: "Missing semicolon",
          severity: "error",
        },
        {
          filePath: "docs/readme.md",
          rule: "markdownlint",
          message: "Line too long",
          severity: "warning",
        },
      ];

      const deduped = agent.dedupeFindings(findings);
      expect(deduped).toHaveLength(2);

      const grouped = agent.groupFindingsByFile(deduped);
      expect(Object.keys(grouped)).toEqual(["src/index.js", "docs/readme.md"]);
      expect(grouped["src/index.js"].count).toBe(1);
      expect(grouped["docs/readme.md"].severities.warning).toBe(1);
    });

    it("formats a report with and without findings", () => {
      const report = agent.formatLintReport({
        title: "Lint Report",
        summary: {
          filesScanned: 2,
          filesWithFindings: 1,
          totalFindings: 2,
          severityCounts: { error: 1, warning: 1 },
        },
        groupedFindings: {
          "src/index.js": {
            filePath: "src/index.js",
            findings: [
              {
                filePath: "src/index.js",
                rule: "eslint",
                message: "Missing semicolon",
                severity: "error",
              },
            ],
          },
        },
      });

      expect(report).toContain("# Lint Report");
      expect(report).toContain("Files scanned: 2");
      expect(report).toContain("[error] eslint: Missing semicolon");

      const emptyReport = agent.formatLintReport({
        title: "Lint Report",
        summary: {
          filesScanned: 0,
          filesWithFindings: 0,
          totalFindings: 0,
          severityCounts: {},
        },
        groupedFindings: {},
      });

      expect(emptyReport).toContain("No lint findings.");
    });
  });

  describe("orchestration", () => {
    it("supports async runners and reports failures", async () => {
      const logger = {
        info: jest.fn(),
        warn: jest.fn(),
      };

      const report = await agent.lintCodebase("/repo", {
        files: ["src/index.js", "docs/readme.md"],
        config: {
          reportTitle: "Custom Lint Report",
          rules: [
            { name: "eslint", extensions: [".js"], order: 1 },
            { name: "markdownlint", extensions: [".md"], order: 2 },
          ],
        },
        runner: async ({ filePath, rules }) => {
          if (filePath === "src/index.js") {
            return {
              findings: [
                {
                  filePath,
                  rule: rules[0],
                  message: "Unexpected console statement",
                  severity: "error",
                },
                {
                  filePath,
                  rule: rules[0],
                  message: "Unexpected console statement",
                  severity: "error",
                },
              ],
            };
          }

          return {
            findings: [
              {
                filePath,
                rule: rules[0],
                message: "Line too long",
                severity: "warning",
              },
            ],
          };
        },
        logger,
      });

      expect(report.status).toBe("failed");
      expect(report.summary.totalFindings).toBe(2);
      expect(report.summary.filesWithFindings).toBe(2);
      expect(report.findings).toHaveLength(2);
      expect(report.report).toContain("Custom Lint Report");
      expect(logger.info).toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(
        "[linting.agent] 2 lint finding(s) detected",
      );
    });

    it("uses the default runner when none is supplied", async () => {
      const logger = {
        info: jest.fn(),
        warn: jest.fn(),
      };

      const report = await agent.lintCodebase("/repo", {
        files: ["src/index.js"],
        logger,
      });

      expect(report.status).toBe("passed");
      expect(report.summary.totalFindings).toBe(0);
      expect(logger.info).toHaveBeenCalledWith(
        "[linting.agent] Linting src/index.js with 1 rule(s)",
      );
      expect(logger.info).toHaveBeenCalledWith(
        "[linting.agent] No lint findings detected",
      );
    });

    it("returns a clean report when no files are scheduled", async () => {
      const logger = {
        info: jest.fn(),
        warn: jest.fn(),
      };

      const report = await agent.lintCodebase("/repo", {
        files: [],
        logger,
      });

      expect(report.status).toBe("passed");
      expect(report.summary.totalFindings).toBe(0);
      expect(report.report).toContain("No lint findings.");
      expect(logger.info).toHaveBeenCalledWith(
        "[linting.agent] No files scheduled for linting",
      );
      expect(logger.warn).not.toHaveBeenCalled();
    });
  });
});
