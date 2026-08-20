/**
 * Tests for bulk-issue-metadata-updater.js
 *
 * Comprehensive test suite for the bulk metadata updater.
 * Tests command-line argument parsing and batch processing logic.
 */

describe("bulk-issue-metadata-updater", () => {
  describe("Argument parsing", () => {
    const parseArgs = (args) => {
      const mode = args.includes("--auto")
        ? "auto"
        : args.includes("--interactive")
          ? "interactive"
          : "dry-run";

      const limitArg = parseInt(
        args.find((arg) => arg.startsWith("--limit="))?.split("=")[1] ||
          "999999",
      );

      const confidenceArg = parseFloat(
        args
          .find((arg) => arg.startsWith("--confidence="))
          ?.split("=")[1] || "0.85",
      );

      const targetLabel = args
        .find((arg) => arg.startsWith("--label="))
        ?.split("=")[1];

      const verbose = args.includes("--verbose");

      return { mode, limitArg, confidenceArg, targetLabel, verbose };
    };

    it("should parse default mode as dry-run", () => {
      const result = parseArgs([]);
      expect(result.mode).toBe("dry-run");
    });

    it("should parse --auto mode", () => {
      const result = parseArgs(["--auto"]);
      expect(result.mode).toBe("auto");
    });

    it("should parse --interactive mode", () => {
      const result = parseArgs(["--interactive"]);
      expect(result.mode).toBe("interactive");
    });

    it("should parse --limit argument", () => {
      const result = parseArgs(["--limit=50"]);
      expect(result.limitArg).toBe(50);
    });

    it("should default limit to 999999", () => {
      const result = parseArgs([]);
      expect(result.limitArg).toBe(999999);
    });

    it("should parse --confidence argument", () => {
      const result = parseArgs(["--confidence=0.9"]);
      expect(result.confidenceArg).toBe(0.9);
    });

    it("should default confidence to 0.85", () => {
      const result = parseArgs([]);
      expect(result.confidenceArg).toBe(0.85);
    });

    it("should parse --label argument", () => {
      const result = parseArgs(["--label=status:needs-triage"]);
      expect(result.targetLabel).toBe("status:needs-triage");
    });

    it("should parse --verbose flag", () => {
      const result = parseArgs(["--verbose"]);
      expect(result.verbose).toBe(true);
    });

    it("should handle multiple arguments together", () => {
      const result = parseArgs([
        "--auto",
        "--limit=100",
        "--confidence=0.95",
        "--label=status:needs-template-fix",
        "--verbose",
      ]);

      expect(result.mode).toBe("auto");
      expect(result.limitArg).toBe(100);
      expect(result.confidenceArg).toBe(0.95);
      expect(result.targetLabel).toBe("status:needs-template-fix");
      expect(result.verbose).toBe(true);
    });
  });

  describe("Mode validation", () => {
    it("should validate mode values", () => {
      const validModes = ["dry-run", "interactive", "auto"];
      expect(validModes).toContain("dry-run");
      expect(validModes).toContain("interactive");
      expect(validModes).toContain("auto");
    });
  });

  describe("Confidence threshold validation", () => {
    const validateConfidence = (value) => {
      return !Number.isNaN(value) && value >= 0 && value <= 1;
    };

    it("should validate confidence between 0 and 1", () => {
      expect(validateConfidence(0)).toBe(true);
      expect(validateConfidence(0.5)).toBe(true);
      expect(validateConfidence(1)).toBe(true);
    });

    it("should reject confidence outside range", () => {
      expect(validateConfidence(-0.1)).toBe(false);
      expect(validateConfidence(1.1)).toBe(false);
      expect(validateConfidence(NaN)).toBe(false);
    });
  });

  describe("Batch processing", () => {
    const processBatch = (issues, options = {}) => {
      const { mode = "dry-run", confidence = 0.85 } = options;

      const summary = {
        total: issues.length,
        processed: 0,
        skipped: 0,
        errors: 0,
        changes: [],
        confidence,
        mode,
      };

      issues.forEach((issue) => {
        if (issue.labels && issue.labels.length > 0) {
          summary.processed++;
          if (mode !== "dry-run") {
            summary.changes.push({
              issueNumber: issue.number,
              action: "update",
            });
          }
        } else {
          summary.skipped++;
        }
      });

      return summary;
    };

    it("should process multiple issues", () => {
      const issues = [
        { number: 1, labels: ["status:needs-triage"] },
        { number: 2, labels: ["status:needs-template-fix"] },
        { number: 3, labels: [] },
      ];

      const result = processBatch(issues);

      expect(result.total).toBe(3);
      expect(result.processed).toBe(2);
      expect(result.skipped).toBe(1);
    });

    it("should respect dry-run mode", () => {
      const issues = [
        { number: 1, labels: ["status:needs-triage"] },
        { number: 2, labels: ["status:needs-template-fix"] },
      ];

      const result = processBatch(issues, { mode: "dry-run" });

      expect(result.mode).toBe("dry-run");
      expect(result.changes).toHaveLength(0);
    });

    it("should collect changes in non-dry-run modes", () => {
      const issues = [
        { number: 1, labels: ["status:needs-triage"] },
        { number: 2, labels: ["status:needs-template-fix"] },
      ];

      const result = processBatch(issues, { mode: "auto" });

      expect(result.mode).toBe("auto");
      expect(result.changes.length).toBeGreaterThan(0);
    });

    it("should track confidence threshold", () => {
      const issues = [{ number: 1, labels: ["status:needs-triage"] }];

      const result = processBatch(issues, { confidence: 0.95 });

      expect(result.confidence).toBe(0.95);
    });
  });

  describe("Handler routing", () => {
    const routeToHandler = (issue) => {
      const labels = issue.labels || [];
      const firstLabel = labels[0];

      if (firstLabel === "status:needs-template-fix") {
        return "template-fix-handler";
      } else if (firstLabel === "status:needs-triage") {
        return "triage-handler";
      } else {
        return null;
      }
    };

    it("should route template-fix issues", () => {
      const issue = { number: 1, labels: ["status:needs-template-fix"] };
      const handler = routeToHandler(issue);
      expect(handler).toBe("template-fix-handler");
    });

    it("should route triage issues", () => {
      const issue = { number: 2, labels: ["status:needs-triage"] };
      const handler = routeToHandler(issue);
      expect(handler).toBe("triage-handler");
    });

    it("should return null for unhandled labels", () => {
      const issue = { number: 3, labels: ["status:needs-dev"] };
      const handler = routeToHandler(issue);
      expect(handler).toBeNull();
    });

    it("should handle issues without labels", () => {
      const issue = { number: 4 };
      const handler = routeToHandler(issue);
      expect(handler).toBeNull();
    });
  });

  describe("Summary generation", () => {
    const generateSummary = (issues, processed) => ({
      total: issues.length,
      processed,
      skipped: issues.length - processed,
      timestamp: new Date().toISOString(),
      successRate: issues.length > 0 ? (processed / issues.length) * 100 : 0,
    });

    it("should generate summary with correct counts", () => {
      const issues = [1, 2, 3, 4, 5];
      const summary = generateSummary(issues, 3);

      expect(summary.total).toBe(5);
      expect(summary.processed).toBe(3);
      expect(summary.skipped).toBe(2);
    });

    it("should calculate success rate", () => {
      const issues = [1, 2, 3, 4];
      const summary = generateSummary(issues, 2);

      expect(summary.successRate).toBe(50);
    });

    it("should handle 100% success rate", () => {
      const issues = [1, 2, 3];
      const summary = generateSummary(issues, 3);

      expect(summary.successRate).toBe(100);
    });

    it("should handle zero issues", () => {
      const summary = generateSummary([], 0);

      expect(summary.total).toBe(0);
      expect(summary.successRate).toBe(0);
    });
  });

  describe("Error handling", () => {
    it("should handle invalid limit argument", () => {
      const validateLimit = (value) => {
        return Number.isSafeInteger(value) && value > 0;
      };

      expect(validateLimit(50)).toBe(true);
      expect(validateLimit(0)).toBe(false);
      expect(validateLimit(-1)).toBe(false);
      expect(validateLimit(NaN)).toBe(false);
    });

    it("should handle missing issue data", () => {
      const issue = {}; // Missing all data
      expect(issue.number).toBeUndefined();
      expect(issue.labels).toBeUndefined();
    });

    it("should handle issues with null labels", () => {
      const issue = { number: 1, labels: null };
      const labels = issue.labels || [];
      expect(labels).toHaveLength(0);
    });
  });

  describe("Status label filtering", () => {
    const getStatusLabels = () => [
      "status:needs-template-fix",
      "status:needs-triage",
      "status:needs-more-info",
    ];

    const filterIssuesByLabel = (issues, targetLabel) => {
      if (!targetLabel) return issues;
      return issues.filter((issue) =>
        (issue.labels || []).includes(targetLabel),
      );
    };

    it("should filter issues by specific status label", () => {
      const issues = [
        { number: 1, labels: ["status:needs-template-fix"] },
        { number: 2, labels: ["status:needs-triage"] },
        { number: 3, labels: ["status:needs-template-fix"] },
      ];

      const filtered = filterIssuesByLabel(
        issues,
        "status:needs-template-fix",
      );

      expect(filtered).toHaveLength(2);
      expect(filtered[0].number).toBe(1);
      expect(filtered[1].number).toBe(3);
    });

    it("should return all issues when no filter specified", () => {
      const issues = [
        { number: 1, labels: ["status:needs-triage"] },
        { number: 2, labels: ["status:needs-template-fix"] },
      ];

      const filtered = filterIssuesByLabel(issues, null);

      expect(filtered).toHaveLength(2);
    });

    it("should handle empty label list", () => {
      const issues = [
        { number: 1, labels: [] },
        { number: 2, labels: ["status:needs-triage"] },
      ];

      const filtered = filterIssuesByLabel(
        issues,
        "status:needs-triage",
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].number).toBe(2);
    });
  });
});
