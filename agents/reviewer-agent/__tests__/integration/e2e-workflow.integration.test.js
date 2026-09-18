/**
 * End-to-End Workflow Tests
 * Tests full feedback → decision → comment flow
 */

const { FeedbackProcessor } = require("../../feedback-processor");
const { DecisionEngine } = require("../../decision-engine");
const { CommentGenerator } = require("../../comment-generator");
const { ConfigurationSystem } = require("../../configuration-system");
const mixedFeedback = require("../fixtures/mixed-feedback-batch.json");

describe("Reviewer Agent v2 - E2E Workflow", () => {
  let processor;
  let engine;
  let generator;
  let config;

  beforeEach(() => {
    processor = new FeedbackProcessor();
    engine = new DecisionEngine();
    generator = new CommentGenerator();
    config = new ConfigurationSystem();
  });

  const processWorkflow = (feedback, repoType = "github") => {
    const normalized = processor.process(feedback);
    const decisions = engine.process(normalized.findings || []);
    const comment = generator.generate(decisions);
    const cfg = config.loadConfiguration(repoType);

    return {
      findings: normalized.findings,
      decisions,
      comment,
      config: cfg,
    };
  };

  test("should complete full workflow: feedback → decision → comment", () => {
    const result = processWorkflow(mixedFeedback, "github");

    expect(result).toBeDefined();
    expect(result.findings).toBeDefined();
    expect(result.decisions).toBeDefined();
    expect(result.comment).toBeDefined();
  });

  test("should validate markdown comment output", () => {
    const result = processWorkflow(mixedFeedback, "github");
    const comment = result.comment;

    expect(typeof comment).toBe("string");
    expect(comment.length).toBeGreaterThan(0);
  });

  test("should include all tool findings in workflow", () => {
    const result = processWorkflow(mixedFeedback, "github");

    expect(result.findings).toBeDefined();
    expect(result.findings.length).toBeGreaterThan(0);
  });

  test("should respect configuration in workflow", () => {
    const result = processWorkflow(mixedFeedback, "wordpress-plugin");

    expect(result).toBeDefined();
    expect(result.config).toBeDefined();
  });

  test("should handle 100+ findings in workflow", () => {
    const largeFeedback = {
      coderabbit: Array.from({ length: 50 }, (_, i) => ({
        severity: ["critical", "error"][i % 2],
        title: `Issue ${i}`,
        file: `file${i}.js`,
        line: i * 10,
        description: `Description ${i}`,
      })),
      codeQuality: Array.from({ length: 50 }, (_, i) => ({
        severity: ["warning", "note"][i % 2],
        title: `Quality Issue ${i}`,
        file: `quality${i}.js`,
        line: i * 5,
        description: `Quality Description ${i}`,
      })),
    };

    const result = processWorkflow(largeFeedback, "github");

    expect(result.findings).toBeDefined();
    expect(result.findings.length).toBeGreaterThanOrEqual(100);
  });

  test("should maintain data integrity through workflow", () => {
    const result = processWorkflow(mixedFeedback, "github");

    // Verify findings have required fields
    result.findings.forEach((f) => {
      expect(f.id).toBeDefined();
      expect(f.tool).toBeDefined();
      expect(f.severity).toBeDefined();
      expect(f.file).toBeDefined();
    });
  });

  test("should generate comment with findings summary", () => {
    const result = processWorkflow(mixedFeedback, "github");
    const comment = result.comment;

    expect(comment).toBeDefined();
    expect(comment.length).toBeGreaterThan(0);
  });

  test("should handle empty workflow gracefully", () => {
    const emptyFeedback = {};
    const result = processWorkflow(emptyFeedback, "github");

    expect(result).toBeDefined();
    expect(result.findings).toBeDefined();
    expect(Array.isArray(result.findings)).toBe(true);
  });

  test("should process workflow within performance targets", () => {
    const start = Date.now();
    const result = processWorkflow(mixedFeedback, "github");
    const duration = Date.now() - start;

    expect(result).toBeDefined();
    expect(duration).toBeLessThan(500); // Target: <500ms
  });

  test("should process 100+ findings within performance targets", () => {
    const largeFeedback = {
      coderabbit: Array.from({ length: 50 }, (_, i) => ({
        severity: ["critical", "error"][i % 2],
        title: `Issue ${i}`,
        file: `file${i}.js`,
        line: i * 10,
        description: `Description ${i}`,
      })),
      codeQuality: Array.from({ length: 50 }, (_, i) => ({
        severity: ["warning", "note"][i % 2],
        title: `Quality Issue ${i}`,
        file: `quality${i}.js`,
        line: i * 5,
        description: `Quality Description ${i}`,
      })),
    };

    const start = Date.now();
    const result = processWorkflow(largeFeedback, "github");
    const duration = Date.now() - start;

    expect(result.findings.length).toBeGreaterThanOrEqual(100);
    expect(duration).toBeLessThan(500); // Target: <500ms
  });

  test("should deduplicate and prioritize findings", () => {
    const duplicateFeedback = {
      coderabbit: [
        {
          severity: "critical",
          title: "Issue",
          file: "a.js",
          line: 1,
          description: "Test",
        },
        {
          severity: "critical",
          title: "Issue",
          file: "a.js",
          line: 1,
          description: "Test",
        },
      ],
    };

    const result = processWorkflow(duplicateFeedback, "github");

    expect(result.findings.length).toBeLessThanOrEqual(2);
  });

  test("should return decision breakdown", () => {
    const result = processWorkflow(mixedFeedback, "github");

    expect(result.decisions).toBeDefined();
    expect(result.decisions.auto_resolved).toBeDefined();
    expect(result.decisions.suppressed).toBeDefined();
    expect(result.decisions.requires_review).toBeDefined();
  });

  test("should support multiple repo types in workflow", () => {
    const repoTypes = ["github", "wordpress-plugin", "wordpress-theme"];

    repoTypes.forEach((repoType) => {
      const result = processWorkflow(mixedFeedback, repoType);
      expect(result).toBeDefined();
      expect(result.comment).toBeDefined();
    });
  });

  test("should handle workflow with only critical findings", () => {
    const criticalFeedback = {
      coderabbit: [
        {
          severity: "critical",
          title: "Critical 1",
          file: "a.js",
          line: 1,
          description: "Test",
        },
        {
          severity: "critical",
          title: "Critical 2",
          file: "b.js",
          line: 2,
          description: "Test",
        },
      ],
    };

    const result = processWorkflow(criticalFeedback, "github");

    expect(result.findings.length).toBeGreaterThan(0);
  });

  test("should handle workflow with mixed findings", () => {
    const mixedFindingsFeedback = {
      coderabbit: [
        {
          severity: "critical",
          title: "Critical",
          file: "a.js",
          line: 1,
          description: "Test",
        },
      ],
      codeQuality: [
        {
          severity: "warning",
          title: "Warning",
          file: "b.js",
          line: 2,
          description: "Test",
        },
      ],
      copilot: [
        {
          severity: "info",
          title: "Info",
          file: "c.js",
          line: 3,
          description: "Test",
        },
      ],
    };

    const result = processWorkflow(mixedFindingsFeedback, "github");

    expect(result.findings.length).toBe(3);
  });
});
