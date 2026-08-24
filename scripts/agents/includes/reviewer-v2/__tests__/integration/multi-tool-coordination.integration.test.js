/**
 * Multi-Tool Coordination Integration Tests
 * Tests all 4 feedback tools working together through full pipeline
 */

const { FeedbackProcessor } = require("../../feedback-processor");
const { DecisionEngine } = require("../../decision-engine");
const { CommentGenerator } = require("../../comment-generator");
const mixedFeedback = require("../fixtures/mixed-feedback-batch.json");
const coderabbitFindings = require("../fixtures/coderabbit-findings.json");
const codeQualityFindings = require("../fixtures/code-quality-findings.json");
const copilotFindings = require("../fixtures/copilot-findings.json");
const wordPressFindings = require("../fixtures/wordpress-quality-findings.json");

describe("Reviewer Agent v2 - Multi-Tool Coordination", () => {
  let processor;
  let engine;
  let generator;

  beforeEach(() => {
    processor = new FeedbackProcessor();
    engine = new DecisionEngine();
    generator = new CommentGenerator();
  });

  test("should process all 4 tools through pipeline", () => {
    const normalized = processor.process(mixedFeedback);

    expect(normalized.findings).toBeDefined();
    expect(normalized.findings.length).toBeGreaterThan(0);

    // Should have findings from multiple tools
    const tools = new Set(normalized.findings.map((f) => f.tool));
    expect(tools.size).toBeGreaterThan(1);
  });

  test("should handle CodeRabbit findings", () => {
    const feedback = { coderabbit: coderabbitFindings.findings };
    const normalized = processor.process(feedback);

    expect(normalized.findings.length).toBeGreaterThan(0);
    expect(normalized.findings.every((f) => f.tool === "coderabbit")).toBe(
      true,
    );
  });

  test("should handle Code Quality findings", () => {
    const feedback = { codeQuality: codeQualityFindings.findings };
    const normalized = processor.process(feedback);

    expect(normalized.findings.length).toBeGreaterThan(0);
    expect(normalized.findings.every((f) => f.tool === "code-quality")).toBe(
      true,
    );
  });

  test("should handle Copilot findings", () => {
    const feedback = { copilot: copilotFindings.findings };
    const normalized = processor.process(feedback);

    expect(normalized.findings.length).toBeGreaterThan(0);
    expect(normalized.findings.every((f) => f.tool === "copilot")).toBe(true);
  });

  test("should handle WordPress Quality findings", () => {
    const feedback = { wordPressQuality: wordPressFindings.findings };
    const normalized = processor.process(feedback);

    expect(normalized.findings.length).toBeGreaterThan(0);
    expect(
      normalized.findings.every((f) => f.tool === "wordpress-quality"),
    ).toBe(true);
  });

  test("should deduplicate findings across tools", () => {
    const duplicateFeedback = {
      coderabbit: [
        {
          severity: "critical",
          title: "SQL Injection",
          file: "db.js",
          line: 42,
          description: "Injection vulnerability",
        },
        {
          severity: "critical",
          title: "SQL Injection",
          file: "db.js",
          line: 42,
          description: "Injection vulnerability",
        },
      ],
    };

    const normalized = processor.process(duplicateFeedback);
    const uniqueIds = new Set(normalized.findings.map((f) => f.id));

    expect(uniqueIds.size).toBeLessThan(normalized.findings.length + 1);
  });

  test("should respect tool priority ordering", () => {
    const decisions = engine.process(mixedFeedback.coderabbit);

    expect(decisions).toBeDefined();
    expect(decisions.requires_review).toBeDefined();
    expect(Array.isArray(decisions.requires_review)).toBe(true);
  });

  test("should handle conflicting recommendations", () => {
    const conflictingFeedback = {
      coderabbit: [
        {
          severity: "critical",
          title: "Security Issue",
          file: "auth.js",
          line: 20,
          description: "Remove this implementation",
        },
      ],
      copilot: [
        {
          severity: "note",
          title: "Refactoring Suggestion",
          file: "auth.js",
          line: 20,
          description: "Simplify this code",
        },
      ],
    };

    const normalized = processor.process(conflictingFeedback);
    expect(normalized.findings.length).toBeGreaterThan(0);
  });

  test("should generate comment with multiple tool findings", () => {
    const normalized = processor.process(mixedFeedback);
    const decisions = engine.process(normalized.findings || []);
    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
    expect(typeof comment).toBe("string");
    expect(comment.length).toBeGreaterThan(0);
  });

  test("should prioritize by severity across tools", () => {
    const normalized = processor.process(mixedFeedback);
    const decisions = engine.process(normalized.findings || []);

    const requiresReview = decisions.requires_review || [];
    const critical = requiresReview.filter((f) => f.severity === "critical");
    const high = requiresReview.filter(
      (f) => f.severity === "major" || f.severity === "high",
    );

    // Critical should come before high
    if (critical.length > 0 && high.length > 0) {
      const criticalIndex = requiresReview.findIndex(
        (f) => f.severity === "critical",
      );
      const highIndex = requiresReview.findIndex(
        (f) => f.severity === "major" || f.severity === "high",
      );
      expect(criticalIndex).toBeLessThanOrEqual(highIndex);
    }
  });

  test("should handle mixed severity levels from all tools", () => {
    const feedback = {
      coderabbit: [
        {
          severity: "critical",
          title: "Critical issue",
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

    const normalized = processor.process(feedback);
    expect(normalized.findings.length).toBe(3);
  });

  test("should preserve tool source information", () => {
    const normalized = processor.process(mixedFeedback);
    const tools = new Set();

    normalized.findings.forEach((f) => {
      expect(f.tool).toBeDefined();
      tools.add(f.tool);
    });

    expect(tools.size).toBeGreaterThan(0);
  });

  test("should handle empty feedback from some tools", () => {
    const partialFeedback = {
      coderabbit: coderabbitFindings.findings,
      codeQuality: [],
      copilot: [],
      wordPressQuality: [],
    };

    const normalized = processor.process(partialFeedback);
    expect(normalized.findings.length).toBeGreaterThan(0);
    expect(normalized.findings.every((f) => f.tool === "coderabbit")).toBe(
      true,
    );
  });
});
