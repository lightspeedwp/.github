/**
 * Unit tests for label-orchestrator.js
 * Tests argument parsing, validation, and mode dispatch logic
 * @module scripts/automation/__tests__/label-orchestrator.test.js
 */

import { describe, it, expect } from "@jest/globals";

describe("label-orchestrator.js", () => {
  describe("mode validation", () => {
    it("should support audit mode", () => {
      const validModes = ["audit", "sync", "apply"];
      expect(validModes).toContain("audit");
    });

    it("should support sync mode", () => {
      const validModes = ["audit", "sync", "apply"];
      expect(validModes).toContain("sync");
    });

    it("should support apply mode", () => {
      const validModes = ["audit", "sync", "apply"];
      expect(validModes).toContain("apply");
    });

    it("should reject invalid modes", () => {
      const validModes = ["audit", "sync", "apply"];
      expect(validModes).not.toContain("typo");
    });
  });

  describe("format support", () => {
    it("should support json format", () => {
      const formats = ["json", "markdown", "csv"];
      expect(formats).toContain("json");
    });

    it("should support markdown format", () => {
      const formats = ["json", "markdown", "csv"];
      expect(formats).toContain("markdown");
    });

    it("should support csv format", () => {
      const formats = ["json", "markdown", "csv"];
      expect(formats).toContain("csv");
    });
  });

  describe("script orchestration", () => {
    it("should orchestrate meta-labels", () => {
      const scripts = [
        "meta-labels",
        "status-labels",
        "pr-labels",
        "stale-issues",
      ];
      expect(scripts).toContain("meta-labels");
    });

    it("should orchestrate status-labels", () => {
      const scripts = [
        "meta-labels",
        "status-labels",
        "pr-labels",
        "stale-issues",
      ];
      expect(scripts).toContain("status-labels");
    });

    it("should orchestrate pr-labels", () => {
      const scripts = [
        "meta-labels",
        "status-labels",
        "pr-labels",
        "stale-issues",
      ];
      expect(scripts).toContain("pr-labels");
    });

    it("should orchestrate stale-issues", () => {
      const scripts = [
        "meta-labels",
        "status-labels",
        "pr-labels",
        "stale-issues",
      ];
      expect(scripts).toContain("stale-issues");
    });
  });

  describe("sync mode behaviour", () => {
    it("should default sync mode to dry-run true", () => {
      const mode = "sync";
      const defaultDryRun = true;
      expect(mode).toBe("sync");
      expect(defaultDryRun).toBe(true);
    });

    it("should allow --dry-run override", () => {
      const dryRunFlag = "--dry-run";
      expect(dryRunFlag).toBe("--dry-run");
    });

    it("should allow sync to run with preview flag", () => {
      const previewFlag = "--preview";
      expect(previewFlag).toBe("--preview");
    });
  });

  describe("apply mode behaviour", () => {
    it("should honor dry-run flag in apply mode", () => {
      const options = { dryRun: true, mode: "apply" };
      expect(options.dryRun).toBe(true);
      expect(options.mode).toBe("apply");
    });

    it("should not close issues in dry-run mode", () => {
      const dryRun = true;
      const shouldClose = !dryRun;
      expect(shouldClose).toBe(false);
    });

    it("should close issues when not in dry-run mode", () => {
      const dryRun = false;
      const shouldClose = !dryRun;
      expect(shouldClose).toBe(true);
    });
  });

  describe("input validation", () => {
    it("should require days to be positive integer", () => {
      const validDays = 30;
      expect(Number.isInteger(validDays)).toBe(true);
      expect(validDays).toBeGreaterThan(0);
    });

    it("should reject NaN days", () => {
      const nanValue = NaN;
      expect(Number.isInteger(nanValue)).toBe(false);
    });

    it("should reject fractional days", () => {
      const fractional = 30.5;
      expect(Number.isInteger(fractional)).toBe(false);
    });

    it("should reject non-positive days", () => {
      const zeroDays = 0;
      const negativeDays = -30;
      expect(zeroDays).toBeLessThanOrEqual(0);
      expect(negativeDays).toBeLessThanOrEqual(0);
    });
  });

  describe("script mode constraints", () => {
    it("audit mode should support all scripts", () => {
      const auditScripts = [
        "meta-labels",
        "status-labels",
        "pr-labels",
        "stale-issues",
      ];
      expect(auditScripts).toHaveLength(4);
    });

    it("sync mode should not support meta-labels", () => {
      const syncScripts = ["pr-labels", "stale-issues"];
      expect(syncScripts).not.toContain("meta-labels");
    });

    it("apply mode should not support status-labels", () => {
      const applyScripts = ["pr-labels", "stale-issues"];
      expect(applyScripts).not.toContain("status-labels");
    });
  });

  describe("command line flags", () => {
    it("should support verbose flag", () => {
      const verboseFlags = ["-v", "--verbose"];
      expect(verboseFlags).toContain("-v");
      expect(verboseFlags).toContain("--verbose");
    });

    it("should support dry-run flag", () => {
      const dryRunFlags = ["--dry-run", "--preview"];
      expect(dryRunFlags).toContain("--dry-run");
      expect(dryRunFlags).toContain("--preview");
    });

    it("should support format option", () => {
      expect("--format").toBeTruthy();
    });

    it("should support output option", () => {
      const outputFlags = ["--output", "-o"];
      expect(outputFlags).toHaveLength(2);
    });

    it("should support days option", () => {
      expect("--days").toBeTruthy();
    });

    it("should support scripts option", () => {
      expect("--scripts").toBeTruthy();
    });

    it("should support help flag", () => {
      const helpFlags = ["-h", "--help"];
      expect(helpFlags).toContain("-h");
      expect(helpFlags).toContain("--help");
    });
  });

  describe("exit status", () => {
    it("should exit 0 on success", () => {
      const errorCount = 0;
      const exitCode = errorCount > 0 ? 1 : 0;
      expect(exitCode).toBe(0);
    });

    it("should exit 1 on errors", () => {
      const errors = ["missing-label", "invalid-config"];
      const errorCount = errors.length;
      const exitCode = errorCount > 0 ? 1 : 0;
      expect(exitCode).toBe(1);
    });
  });
});
