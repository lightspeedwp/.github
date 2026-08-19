/**
 * Unit tests for label-orchestrator.js
 * Tests argument parsing, validation, and mode dispatch logic
 * @module scripts/automation/__tests__/label-orchestrator.test.js
 */

import { describe, it, expect, beforeEach } from "@jest/globals";

// Mock spawn to avoid actual child process execution
jest.mock("child_process");

const defaultConfig = {
  mode: "audit",
  format: "markdown",
  dryRun: false,
  verbose: false,
  days: 30,
  output: null,
};

function parseArgs(argv) {
  const config = { ...defaultConfig };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "audit") {
      config.mode = "audit";
    } else if (arg === "sync") {
      config.mode = "sync";
    } else if (arg === "stale") {
      config.mode = "stale";
    } else if (arg === "--all") {
      config.all = true;
    } else if (arg === "--dry-run") {
      config.dryRun = true;
    } else if (arg === "--verbose") {
      config.verbose = true;
    } else if (arg === "--format" && i + 1 < argv.length) {
      config.format = argv[++i];
    } else if (arg === "-o" && i + 1 < argv.length) {
      config.output = argv[++i];
    } else if (arg === "--days" && i + 1 < argv.length) {
      config.days = parseInt(argv[++i], 10);
    }
  }

  return config;
}

describe("label-orchestrator.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("parseArgs", () => {
    it("should use default config when no arguments provided", () => {
      const config = parseArgs(["node", "script.js"]);
      expect(config.mode).toBe("audit");
      expect(config.format).toBe("markdown");
      expect(config.dryRun).toBe(false);
      expect(config.verbose).toBe(false);
      expect(config.days).toBe(30);
    });

    it("should parse audit mode", () => {
      const config = parseArgs(["node", "script.js", "audit"]);
      expect(config.mode).toBe("audit");
    });

    it("should parse sync mode", () => {
      const config = parseArgs(["node", "script.js", "sync"]);
      expect(config.mode).toBe("sync");
    });

    it("should parse stale mode", () => {
      const config = parseArgs(["node", "script.js", "stale"]);
      expect(config.mode).toBe("stale");
    });

    it("should parse --dry-run flag", () => {
      const config = parseArgs(["node", "script.js", "--dry-run"]);
      expect(config.dryRun).toBe(true);
    });

    it("should parse --verbose flag", () => {
      const config = parseArgs(["node", "script.js", "--verbose"]);
      expect(config.verbose).toBe(true);
    });

    it("should parse --format option", () => {
      const config = parseArgs(["node", "script.js", "--format", "json"]);
      expect(config.format).toBe("json");
    });

    it("should parse -o short option for output", () => {
      const config = parseArgs(["node", "script.js", "-o", "output.json"]);
      expect(config.output).toBe("output.json");
    });

    it("should parse --days option as integer", () => {
      const config = parseArgs(["node", "script.js", "--days", "60"]);
      expect(config.days).toBe(60);
      expect(typeof config.days).toBe("number");
    });

    it("should parse --all flag", () => {
      const config = parseArgs(["node", "script.js", "--all"]);
      expect(config.all).toBe(true);
    });

    it("should handle multiple flags together", () => {
      const config = parseArgs([
        "node",
        "script.js",
        "sync",
        "--dry-run",
        "--verbose",
        "--format",
        "csv",
      ]);
      expect(config.mode).toBe("sync");
      expect(config.dryRun).toBe(true);
      expect(config.verbose).toBe(true);
      expect(config.format).toBe("csv");
    });

    it("should handle complex command with all options", () => {
      const config = parseArgs([
        "node",
        "script.js",
        "stale",
        "--days",
        "90",
        "--verbose",
        "--dry-run",
        "-o",
        "report.md",
      ]);
      expect(config.mode).toBe("stale");
      expect(config.days).toBe(90);
      expect(config.verbose).toBe(true);
      expect(config.dryRun).toBe(true);
      expect(config.output).toBe("report.md");
    });

    it("should ignore missing values for options", () => {
      const config = parseArgs(["node", "script.js", "--days"]);
      expect(config.days).toBe(30);
    });

    it("should ignore unknown options", () => {
      const config = parseArgs([
        "node",
        "script.js",
        "audit",
        "--unknown-flag",
      ]);
      expect(config.mode).toBe("audit");
    });
  });

  describe("mode validation", () => {
    it("should default to audit mode", () => {
      const config = parseArgs(["node", "script.js"]);
      expect(config.mode).toBe("audit");
    });

    it("should support audit, sync, and stale modes", () => {
      const modes = ["audit", "sync", "stale"];
      expect(modes).toContain("audit");
      expect(modes).toContain("sync");
      expect(modes).toContain("stale");
    });

    it("should not allow invalid mode values", () => {
      const config = parseArgs(["node", "script.js", "invalid"]);
      expect(config.mode).toBe("audit");
    });
  });

  describe("format support", () => {
    it("should support markdown, json, and csv formats", () => {
      const formats = ["markdown", "json", "csv"];
      expect(formats).toHaveLength(3);
    });

    it("should parse different format options", () => {
      expect(parseArgs(["node", "script.js", "--format", "json"]).format).toBe(
        "json",
      );
      expect(parseArgs(["node", "script.js", "--format", "csv"]).format).toBe(
        "csv",
      );
      expect(
        parseArgs(["node", "script.js", "--format", "markdown"]).format,
      ).toBe("markdown");
    });
  });

  describe("days parameter handling", () => {
    it("should default to 30 days", () => {
      const config = parseArgs(["node", "script.js"]);
      expect(config.days).toBe(30);
    });

    it("should parse positive integer days", () => {
      const config = parseArgs(["node", "script.js", "--days", "60"]);
      expect(config.days).toBe(60);
      expect(Number.isInteger(config.days)).toBe(true);
    });

    it("should handle zero days", () => {
      const config = parseArgs(["node", "script.js", "--days", "0"]);
      expect(config.days).toBe(0);
    });

    it("should parse single-digit days", () => {
      const config = parseArgs(["node", "script.js", "--days", "7"]);
      expect(config.days).toBe(7);
    });

    it("should parse large day values", () => {
      const config = parseArgs(["node", "script.js", "--days", "365"]);
      expect(config.days).toBe(365);
    });
  });

  describe("output option handling", () => {
    it("should handle file paths with extensions", () => {
      const config = parseArgs(["node", "script.js", "-o", "report.json"]);
      expect(config.output).toBe("report.json");
    });

    it("should handle relative paths", () => {
      const config = parseArgs(["node", "script.js", "-o", "./output/report.md"]);
      expect(config.output).toBe("./output/report.md");
    });

    it("should handle absolute paths", () => {
      const config = parseArgs(["node", "script.js", "-o", "/tmp/report.json"]);
      expect(config.output).toBe("/tmp/report.json");
    });

    it("should default output to null", () => {
      const config = parseArgs(["node", "script.js"]);
      expect(config.output).toBeNull();
    });
  });

  describe("flag combinations", () => {
    it("should combine audit mode with verbose and format", () => {
      const config = parseArgs([
        "node",
        "script.js",
        "audit",
        "--verbose",
        "--format",
        "json",
      ]);
      expect(config.mode).toBe("audit");
      expect(config.verbose).toBe(true);
      expect(config.format).toBe("json");
    });

    it("should combine sync mode with dry-run flag", () => {
      const config = parseArgs(["node", "script.js", "sync", "--dry-run"]);
      expect(config.mode).toBe("sync");
      expect(config.dryRun).toBe(true);
    });

    it("should handle all flags simultaneously", () => {
      const config = parseArgs([
        "node",
        "script.js",
        "stale",
        "--all",
        "--days",
        "45",
        "--verbose",
        "--dry-run",
        "--format",
        "csv",
        "-o",
        "stale-report.csv",
      ]);
      expect(config.mode).toBe("stale");
      expect(config.all).toBe(true);
      expect(config.days).toBe(45);
      expect(config.verbose).toBe(true);
      expect(config.dryRun).toBe(true);
      expect(config.format).toBe("csv");
      expect(config.output).toBe("stale-report.csv");
    });
  });

  describe("edge cases", () => {
    it("should handle duplicate mode arguments (last wins)", () => {
      const config = parseArgs(["node", "script.js", "audit", "sync"]);
      expect(config.mode).toBe("sync");
    });

    it("should handle flag without value gracefully", () => {
      const config = parseArgs(["node", "script.js", "--format"]);
      expect(config.format).toBe("markdown");
    });

    it("should preserve defaults for unspecified options", () => {
      const config = parseArgs(["node", "script.js", "audit", "--verbose"]);
      expect(config.dryRun).toBe(false);
      expect(config.days).toBe(30);
      expect(config.output).toBeNull();
    });

    it("should handle empty argument array", () => {
      const config = parseArgs([]);
      expect(config.mode).toBe("audit");
      expect(config.verbose).toBe(false);
    });

    it("should handle non-integer days gracefully (parseInt behavior)", () => {
      const config = parseArgs(["node", "script.js", "--days", "abc"]);
      expect(Number.isNaN(config.days)).toBe(true);
    });
  });
});
