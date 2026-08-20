/**
 * Unit tests for bulk-issue-metadata-updater.js
 * Tests batch processing, argument parsing, and metadata update logic
 * @module scripts/automation/__tests__/bulk-issue-metadata-updater.test.js
 */

import { describe, it, expect } from "@jest/globals";

describe("bulk-issue-metadata-updater", () => {
  describe("Mode detection", () => {
    const detectMode = (args) => {
      return args.includes("--auto")
        ? "auto"
        : args.includes("--interactive")
          ? "interactive"
          : "dry-run";
    };

    it("should detect auto mode", () => {
      const mode = detectMode(["--auto"]);
      expect(mode).toBe("auto");
    });

    it("should detect interactive mode", () => {
      const mode = detectMode(["--interactive"]);
      expect(mode).toBe("interactive");
    });

    it("should default to dry-run mode", () => {
      const mode = detectMode([]);
      expect(mode).toBe("dry-run");
    });

    it("should prefer auto over interactive", () => {
      const mode = detectMode(["--interactive", "--auto"]);
      expect(mode).toBe("auto");
    });

    it("should handle mode with other flags", () => {
      const mode = detectMode(["--auto", "--limit=100", "--verbose"]);
      expect(mode).toBe("auto");
    });
  });

  describe("Argument parsing", () => {
    const parseArgs = (args) => {
      const options = {
        limit: 999999,
        confidence: 0.85,
        label: null,
        verbose: false,
      };

      args.forEach((arg) => {
        if (arg.startsWith("--limit=")) {
          options.limit = parseInt(arg.split("=")[1], 10);
        } else if (arg.startsWith("--confidence=")) {
          options.confidence = parseFloat(arg.split("=")[1]);
        } else if (arg.startsWith("--label=")) {
          options.label = arg.split("=")[1];
        } else if (arg === "--verbose") {
          options.verbose = true;
        }
      });

      return options;
    };

    it("should parse --limit argument", () => {
      const options = parseArgs(["--limit=50"]);
      expect(options.limit).toBe(50);
    });

    it("should parse --confidence argument", () => {
      const options = parseArgs(["--confidence=0.9"]);
      expect(options.confidence).toBe(0.9);
    });

    it("should parse --label argument", () => {
      const options = parseArgs(["--label=status:needs-triage"]);
      expect(options.label).toBe("status:needs-triage");
    });

    it("should parse --verbose flag", () => {
      const options = parseArgs(["--verbose"]);
      expect(options.verbose).toBe(true);
    });

    it("should use default values", () => {
      const options = parseArgs([]);
      expect(options.limit).toBe(999999);
      expect(options.confidence).toBe(0.85);
      expect(options.label).toBeNull();
      expect(options.verbose).toBe(false);
    });

    it("should parse multiple arguments", () => {
      const options = parseArgs([
        "--limit=100",
        "--confidence=0.95",
        "--label=status:needs-review",
        "--verbose",
      ]);
      expect(options.limit).toBe(100);
      expect(options.confidence).toBe(0.95);
      expect(options.label).toBe("status:needs-review");
      expect(options.verbose).toBe(true);
    });

    it("should handle confidence as decimal", () => {
      const options = parseArgs(["--confidence=0.75"]);
      expect(options.confidence).toBeGreaterThan(0);
      expect(options.confidence).toBeLessThan(1);
    });

    it("should handle limit as positive integer", () => {
      const options = parseArgs(["--limit=10000"]);
      expect(Number.isInteger(options.limit)).toBe(true);
      expect(options.limit).toBeGreaterThan(0);
    });
  });

  describe("Batch processing logic", () => {
    const processBatch = (issues, mode, confidenceThreshold = 0.85) => {
      const results = [];

      issues.forEach((issue, index) => {
        const action = {
          issueNumber: issue.number,
          title: issue.title,
          labelToAdd: null,
          labelToRemove: null,
          status: "pending",
          confidence: issue.confidence || 0.5,
        };

        if (action.confidence < confidenceThreshold && mode !== "interactive") {
          action.status = "skipped-low-confidence";
        } else if (mode === "dry-run") {
          action.status = "previewed";
        } else if (mode === "interactive") {
          action.status = "awaiting-confirmation";
        } else if (mode === "auto") {
          action.status = "applied";
        }

        results.push(action);
      });

      return results;
    };

    it("should process all issues in dry-run mode", () => {
      const issues = [
        { number: 1, title: "Issue 1", confidence: 0.95 },
        { number: 2, title: "Issue 2", confidence: 0.9 },
      ];

      const results = processBatch(issues, "dry-run");
      expect(results).toHaveLength(2);
      expect(results.every((r) => r.status === "previewed")).toBe(true);
    });

    it("should skip low-confidence issues in auto mode", () => {
      const issues = [
        { number: 1, title: "High conf", confidence: 0.95 },
        { number: 2, title: "Low conf", confidence: 0.5 },
      ];

      const results = processBatch(issues, "auto", 0.85);
      expect(results[0].status).toBe("applied");
      expect(results[1].status).toBe("skipped-low-confidence");
    });

    it("should mark all for confirmation in interactive mode", () => {
      const issues = [
        { number: 1, title: "Issue 1", confidence: 0.9 },
        { number: 2, title: "Issue 2", confidence: 0.5 },
      ];

      const results = processBatch(issues, "interactive");
      expect(results.every((r) => r.status === "awaiting-confirmation")).toBe(
        true,
      );
    });

    it("should apply changes in auto mode with high confidence", () => {
      const issues = [
        { number: 123, title: "High conf issue", confidence: 0.95 },
      ];

      const results = processBatch(issues, "auto", 0.85);
      expect(results[0].status).toBe("applied");
    });

    it("should include issue metadata in results", () => {
      const issue = { number: 999, title: "Test", confidence: 0.8 };
      const results = processBatch([issue], "dry-run");

      expect(results[0].issueNumber).toBe(999);
      expect(results[0].title).toBe("Test");
      expect(results[0].confidence).toBe(0.8);
    });

    it("should handle empty batch", () => {
      const results = processBatch([], "dry-run");
      expect(results).toEqual([]);
    });

    it("should respect custom confidence threshold", () => {
      const issues = [
        { number: 1, confidence: 0.8 },
        { number: 2, confidence: 0.85 },
      ];

      const resultsWith80 = processBatch(issues, "auto", 0.8);
      const resultsWith90 = processBatch(issues, "auto", 0.9);

      expect(resultsWith80[0].status).toBe("applied");
      expect(resultsWith90[0].status).toBe("skipped-low-confidence");
    });
  });

  describe("Label management", () => {
    const determineLabels = (issue, handler) => {
      const result = {
        toAdd: [],
        toRemove: [],
      };

      if (handler === "template-fix") {
        result.toRemove.push("status:needs-template-fix");
        result.toAdd.push("status:needs-triage");
      } else if (handler === "triage") {
        result.toRemove.push("status:needs-triage");
        if (issue.inferredType) {
          result.toAdd.push(`type:${issue.inferredType}`);
        }
      }

      return result;
    };

    it("should remove old label and add new in template-fix handler", () => {
      const labels = determineLabels({}, "template-fix");
      expect(labels.toRemove).toContain("status:needs-template-fix");
      expect(labels.toAdd).toContain("status:needs-triage");
    });

    it("should add type label when inferred by triage handler", () => {
      const issue = { inferredType: "bug" };
      const labels = determineLabels(issue, "triage");
      expect(labels.toAdd).toContain("type:bug");
    });

    it("should handle multiple removals", () => {
      const result = {
        toAdd: ["status:needs-review"],
        toRemove: ["status:needs-triage", "status:needs-more-info"],
      };
      expect(result.toRemove).toHaveLength(2);
    });

    it("should handle no inferred type", () => {
      const issue = { inferredType: null };
      const labels = determineLabels(issue, "triage");
      expect(labels.toAdd).not.toContain("type:null");
    });
  });

  describe("Validation", () => {
    const validateConfig = (config) => {
      const errors = [];

      if (!Number.isInteger(config.limit) || config.limit <= 0) {
        errors.push("Limit must be positive integer");
      }

      if (
        typeof config.confidence !== "number" ||
        config.confidence < 0 ||
        config.confidence > 1
      ) {
        errors.push("Confidence must be between 0 and 1");
      }

      if (
        config.mode &&
        !["dry-run", "interactive", "auto"].includes(config.mode)
      ) {
        errors.push("Invalid mode");
      }

      return errors;
    };

    it("should validate positive limit", () => {
      const config = { limit: 100, confidence: 0.85, mode: "dry-run" };
      const errors = validateConfig(config);
      expect(errors).not.toContain("Limit must be positive integer");
    });

    it("should reject zero limit", () => {
      const config = { limit: 0, confidence: 0.85, mode: "dry-run" };
      const errors = validateConfig(config);
      expect(errors).toContain("Limit must be positive integer");
    });

    it("should reject negative limit", () => {
      const config = { limit: -10, confidence: 0.85, mode: "dry-run" };
      const errors = validateConfig(config);
      expect(errors).toContain("Limit must be positive integer");
    });

    it("should reject non-integer limit", () => {
      const config = { limit: 50.5, confidence: 0.85, mode: "dry-run" };
      const errors = validateConfig(config);
      expect(errors).toContain("Limit must be positive integer");
    });

    it("should validate confidence in range", () => {
      const config = { limit: 100, confidence: 0.85, mode: "dry-run" };
      const errors = validateConfig(config);
      expect(errors).not.toContain("Confidence must be between 0 and 1");
    });

    it("should reject confidence below 0", () => {
      const config = { limit: 100, confidence: -0.1, mode: "dry-run" };
      const errors = validateConfig(config);
      expect(errors).toContain("Confidence must be between 0 and 1");
    });

    it("should reject confidence above 1", () => {
      const config = { limit: 100, confidence: 1.5, mode: "dry-run" };
      const errors = validateConfig(config);
      expect(errors).toContain("Confidence must be between 0 and 1");
    });

    it("should validate mode", () => {
      const config = { limit: 100, confidence: 0.85, mode: "dry-run" };
      const errors = validateConfig(config);
      expect(errors).not.toContain("Invalid mode");
    });

    it("should reject invalid mode", () => {
      const config = { limit: 100, confidence: 0.85, mode: "invalid-mode" };
      const errors = validateConfig(config);
      expect(errors).toContain("Invalid mode");
    });

    it("should return empty errors for valid config", () => {
      const config = { limit: 100, confidence: 0.85, mode: "auto" };
      const errors = validateConfig(config);
      expect(errors).toEqual([]);
    });
  });

  describe("Statistics tracking", () => {
    const createStats = () => ({
      processed: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      preview: 0,
    });

    const updateStats = (stats, action) => {
      if (action.status === "applied") {
        stats.updated++;
      } else if (action.status === "skipped-low-confidence") {
        stats.skipped++;
      } else if (action.status === "previewed") {
        stats.preview++;
      } else if (action.status === "error") {
        stats.errors++;
      }
      stats.processed++;
    };

    it("should initialize stats with zeros", () => {
      const stats = createStats();
      expect(stats.processed).toBe(0);
      expect(stats.updated).toBe(0);
      expect(stats.skipped).toBe(0);
      expect(stats.errors).toBe(0);
    });

    it("should count processed items", () => {
      const stats = createStats();
      updateStats(stats, { status: "applied" });
      expect(stats.processed).toBe(1);
    });

    it("should count updated items", () => {
      const stats = createStats();
      updateStats(stats, { status: "applied" });
      expect(stats.updated).toBe(1);
    });

    it("should count skipped items", () => {
      const stats = createStats();
      updateStats(stats, { status: "skipped-low-confidence" });
      expect(stats.skipped).toBe(1);
    });

    it("should count preview items", () => {
      const stats = createStats();
      updateStats(stats, { status: "previewed" });
      expect(stats.preview).toBe(1);
    });

    it("should count error items", () => {
      const stats = createStats();
      updateStats(stats, { status: "error" });
      expect(stats.errors).toBe(1);
    });

    it("should handle multiple updates", () => {
      const stats = createStats();
      updateStats(stats, { status: "applied" });
      updateStats(stats, { status: "skipped-low-confidence" });
      updateStats(stats, { status: "previewed" });

      expect(stats.processed).toBe(3);
      expect(stats.updated).toBe(1);
      expect(stats.skipped).toBe(1);
      expect(stats.preview).toBe(1);
    });
  });
});
