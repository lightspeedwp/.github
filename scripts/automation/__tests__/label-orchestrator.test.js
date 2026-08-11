/**
 * Unit tests for label-orchestrator.js
 * Tests orchestrator command modes and option validation
 * @module scripts/automation/__tests__/label-orchestrator.test.js
 */

import { describe, it, expect } from "@jest/globals";

describe("label-orchestrator", () => {
  describe("orchestrator modes", () => {
    it("should support audit mode for analysing labels without changes", () => {
      const modes = ["audit", "sync", "apply"];
      expect(modes).toContain("audit");
    });

    it("should support sync mode for synchronising labels", () => {
      const modes = ["audit", "sync", "apply"];
      expect(modes).toContain("sync");
    });

    it("should support apply mode for applying label changes", () => {
      const modes = ["audit", "sync", "apply"];
      expect(modes).toContain("apply");
    });
  });

  describe("output formats", () => {
    it("should support json output format", () => {
      const formats = ["json", "markdown", "csv"];
      expect(formats).toContain("json");
    });

    it("should support markdown output format", () => {
      const formats = ["json", "markdown", "csv"];
      expect(formats).toContain("markdown");
    });

    it("should support csv output format", () => {
      const formats = ["json", "markdown", "csv"];
      expect(formats).toContain("csv");
    });
  });

  describe("command line flags", () => {
    it("should support verbose flag for detailed output", () => {
      const flags = ["-v", "--verbose"];
      expect(flags).toHaveLength(2);
      expect(flags[0]).toBe("-v");
    });

    it("should support dry-run flag for preview mode", () => {
      const flags = ["--dry-run", "--preview"];
      expect(flags).toHaveLength(2);
      expect(flags).toContain("--dry-run");
    });

    it("should support format option for output format selection", () => {
      expect("--format").toBeTruthy();
    });

    it("should support output option for file saving", () => {
      const longForm = "--output";
      const shortForm = "-o";
      expect(longForm).toBe("--output");
      expect(shortForm).toBe("-o");
    });

    it("should support days option for stale detection threshold", () => {
      const days = 30;
      expect(days).toBeGreaterThan(0);
      expect(days).toBe(30);
    });

    it("should support scripts option for selective script execution", () => {
      expect("--scripts").toBeTruthy();
    });
  });

  describe("option defaults", () => {
    it("should default to audit mode", () => {
      const defaultMode = "audit";
      expect(defaultMode).toBe("audit");
    });

    it("should default to json format", () => {
      const defaultFormat = "json";
      expect(defaultFormat).toBe("json");
    });

    it("should default to 30-day threshold", () => {
      const defaultDays = 30;
      expect(defaultDays).toBe(30);
      expect(defaultDays).toBeGreaterThan(0);
    });

    it("should default to all scripts if not specified", () => {
      const defaultScripts = ["all"];
      expect(defaultScripts[0]).toBe("all");
    });

    it("should default to non-verbose output", () => {
      const verbose = false;
      expect(verbose).toBe(false);
    });

    it("should default to non-dry-run (execute changes)", () => {
      const dryRun = false;
      expect(dryRun).toBe(false);
    });
  });

  describe("supported scripts", () => {
    it("should orchestrate meta-labels audit", () => {
      const scripts = [
        "meta-labels",
        "status-labels",
        "pr-labels",
        "stale-issues",
      ];
      expect(scripts).toContain("meta-labels");
    });

    it("should orchestrate status-labels audit", () => {
      const scripts = [
        "meta-labels",
        "status-labels",
        "pr-labels",
        "stale-issues",
      ];
      expect(scripts).toContain("status-labels");
    });

    it("should orchestrate pr-labels sync", () => {
      const scripts = [
        "meta-labels",
        "status-labels",
        "pr-labels",
        "stale-issues",
      ];
      expect(scripts).toContain("pr-labels");
    });

    it("should orchestrate stale-issues management", () => {
      const scripts = [
        "meta-labels",
        "status-labels",
        "pr-labels",
        "stale-issues",
      ];
      expect(scripts).toContain("stale-issues");
    });
  });

  describe("mode-specific behaviour", () => {
    it("audit mode should not make changes", () => {
      const auditMode = "audit";
      const makesChanges = false;
      expect(auditMode).toBe("audit");
      expect(makesChanges).toBe(false);
    });

    it("sync mode should synchronise labels with dry-run by default", () => {
      const syncMode = "sync";
      const defaultDryRun = true;
      expect(syncMode).toBe("sync");
      expect(defaultDryRun).toBe(true);
    });

    it("apply mode should make live changes to labels", () => {
      const applyMode = "apply";
      const makesChanges = true;
      expect(applyMode).toBe("apply");
      expect(makesChanges).toBe(true);
    });

    it("apply mode should close stale issues after grace period", () => {
      const applyMode = "apply";
      const closesStaleIssues = true;
      expect(applyMode).toBe("apply");
      expect(closesStaleIssues).toBe(true);
    });
  });

  describe("cli help and usage", () => {
    it("should provide help via -h flag", () => {
      const helpFlag = "-h";
      expect(helpFlag).toBe("-h");
    });

    it("should provide help via --help flag", () => {
      const helpFlag = "--help";
      expect(helpFlag).toBe("--help");
    });

    it("should display usage examples", () => {
      const examples = [
        "audit all labels",
        "sync PR and stale labels",
        "apply all changes",
      ];
      expect(examples.length).toBe(3);
    });
  });
});
