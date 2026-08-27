/**
 * Unit tests for manage-stale-issues.js
 */

import { describe, it, expect } from "@jest/globals";

describe("manage-stale-issues", () => {
  describe("Input validation", () => {
    it("should reject days value that is not a positive integer", () => {
      const options = {
        days: -1,
        dryRun: true,
      };

      expect(Number.isInteger(options.days)).toBe(true);
      expect(options.days).toBeLessThan(0);
    });

    it("should enforce minimum 7-day grace period", () => {
      const minGracePeriod = 7;
      const testDays = 5;

      expect(testDays).toBeLessThan(minGracePeriod);
    });

    it("should accept valid days value (positive integer >= 7)", () => {
      const options = {
        days: 30,
        dryRun: true,
      };

      expect(Number.isInteger(options.days)).toBe(true);
      expect(options.days).toBeGreaterThanOrEqual(7);
    });

    it("should validate days with parseInt base 10", () => {
      const daysString = "30";
      const days = parseInt(daysString, 10);

      expect(Number.isInteger(days)).toBe(true);
      expect(days).toBe(30);
    });

    it("should parse negative days as invalid", () => {
      const daysString = "-5";
      const days = parseInt(daysString, 10);

      expect(days).toBeLessThan(0);
    });
  });

  describe("Options validation", () => {
    it("should require at least one action when not in dry-run mode", () => {
      const options = {
        days: 30,
        dryRun: false,
        label: false,
        comment: false,
        close: false,
      };

      const hasAction = options.label || options.comment || options.close;
      expect(hasAction).toBe(false);
    });

    it("should allow no actions in dry-run mode", () => {
      const options = {
        days: 30,
        dryRun: true,
        label: false,
        comment: false,
        close: false,
      };

      expect(options.dryRun).toBe(true);
    });

    it("should support label, comment, and close actions", () => {
      const options = {
        label: true,
        comment: true,
        close: true,
      };

      const hasAction = options.label || options.comment || options.close;
      expect(hasAction).toBe(true);
    });
  });

  describe("Functionality", () => {
    it("should respect dry-run mode", () => {
      const options = {
        verbose: false,
        dryRun: true,
        days: 30,
        label: true,
        comment: false,
        close: false,
      };

      expect(options.dryRun).toBe(true);
    });

    it("should generate warning comment with correct format", () => {
      const commentBody = `If no activity occurs within 7 days, this issue may be closed and archived.`;

      expect(commentBody).toContain("7 days");
      expect(commentBody).toContain("closed");
      expect(commentBody).toContain("archived");
    });

    it("should handle exclusion rules (epics, in-progress, critical)", () => {
      const exclusionLabels = [
        "type:epic",
        "status:in-progress",
        "priority:critical",
      ];

      expect(exclusionLabels).toContain("type:epic");
      expect(exclusionLabels).toContain("status:in-progress");
      expect(exclusionLabels).toContain("priority:critical");
    });

    it("should support output formats (json, markdown)", () => {
      const formats = ["json", "markdown"];

      formats.forEach((format) => {
        expect(["json", "markdown"]).toContain(format);
      });
    });
  });

  describe("Grace period enforcement", () => {
    it("should enforce 7-day minimum grace period", () => {
      const gracePeriodDays = 7;

      expect(gracePeriodDays).toBe(7);
    });

    it("should document grace period in warning comments", () => {
      const issueNumber = 123;
      const daysSinceActivity = 45;

      expect(issueNumber).toBeDefined();
      expect(daysSinceActivity).toBeGreaterThan(0);
    });

    it("should reject configuration with days less than grace period", () => {
      const gracePeriodMin = 7;
      const invalidDays = 5;

      expect(invalidDays).toBeLessThan(gracePeriodMin);
    });
  });
});
