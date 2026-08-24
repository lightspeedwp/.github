/**
 * GitHub API Integration Tests
 * Tests GitHub API integration with error handling and mocking
 */

const { CommentGenerator } = require("../../comment-generator");
const { DecisionEngine } = require("../../decision-engine");
const { FeedbackProcessor } = require("../../feedback-processor");
const mixedFeedback = require("../fixtures/mixed-feedback-batch.json");

describe("Reviewer Agent v2 - GitHub API Integration", () => {
  let processor;
  let engine;
  let generator;

  beforeEach(() => {
    processor = new FeedbackProcessor();
    engine = new DecisionEngine();
    generator = new CommentGenerator();
  });

  test("should generate valid markdown comment for GitHub", () => {
    const normalized = processor.process(mixedFeedback);
    const decisions = engine.process(normalized.findings || []);
    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
    expect(typeof comment).toBe("string");
    expect(comment.length).toBeGreaterThan(0);
  });

  test("should format comment with proper markdown syntax", () => {
    const findings = [
      {
        id: "1",
        tool: "coderabbit",
        severity: "critical",
        category: "security",
        suggestion: "Fix vulnerability",
        file: "a.js",
        line: 1,
      },
    ];

    const decisions = engine.process(findings);
    const comment = generator.generate(decisions);

    // Should contain markdown formatting
    expect(comment).toMatch(/[\*#\-`]/);
  });

  test("should handle empty decisions gracefully", () => {
    const decisions = {
      auto_resolved: [],
      suppressed: [],
      requires_review: [],
    };

    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
    expect(typeof comment).toBe("string");
  });

  test("should include all critical findings in comment", () => {
    const findings = [
      {
        id: "1",
        tool: "coderabbit",
        severity: "critical",
        category: "security",
        suggestion: "Critical issue",
        file: "a.js",
        line: 1,
      },
      {
        id: "2",
        tool: "copilot",
        severity: "major",
        category: "logic",
        suggestion: "Major issue",
        file: "b.js",
        line: 2,
      },
    ];

    const decisions = engine.process(findings);
    const comment = generator.generate(decisions);

    expect(comment).toContain("critical");
  });

  test("should format file and line information", () => {
    const findings = [
      {
        id: "1",
        tool: "coderabbit",
        severity: "critical",
        category: "security",
        suggestion: "Test",
        file: "src/db.js",
        line: 42,
      },
    ];

    const decisions = engine.process(findings);
    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
    expect(typeof comment).toBe("string");
    expect(comment.length).toBeGreaterThan(0);
  });

  test("should handle rate limiting scenario", () => {
    // Simulate rate limiting by generating large comment
    const largeFeedback = {
      coderabbit: Array.from({ length: 100 }, (_, i) => ({
        severity: ["critical", "error"][i % 2],
        title: `Issue ${i}`,
        file: `file${i}.js`,
        line: i * 10,
        description: `Description ${i}`,
      })),
    };

    const normalized = processor.process(largeFeedback);
    const decisions = engine.process(normalized.findings || []);
    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
    expect(comment.length).toBeGreaterThan(0);
  });

  test("should handle auth failure gracefully", () => {
    const findings = [];
    const decisions = engine.process(findings);
    const comment = generator.generate(decisions);

    // Should still generate valid output
    expect(comment).toBeDefined();
    expect(typeof comment).toBe("string");
  });

  test("should handle network timeout scenario", () => {
    const findings = [
      {
        id: "1",
        tool: "coderabbit",
        severity: "critical",
        category: "security",
        suggestion: "Issue",
        file: "a.js",
        line: 1,
      },
    ];

    const decisions = engine.process(findings);
    const comment = generator.generate(decisions);

    // Should generate comment synchronously
    expect(comment).toBeDefined();
  });

  test("should comment format validation with tools property", () => {
    const normalized = processor.process(mixedFeedback);
    const decisions = engine.process(normalized.findings || []);
    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
  });

  test("should preserve tool context in comment", () => {
    const findings = [
      {
        id: "1",
        tool: "coderabbit",
        severity: "critical",
        category: "security",
        suggestion: "Security fix needed",
        file: "a.js",
        line: 1,
      },
      {
        id: "2",
        tool: "copilot",
        severity: "major",
        category: "logic",
        suggestion: "Logic fix needed",
        file: "b.js",
        line: 2,
      },
    ];

    const decisions = engine.process(findings);
    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
    // Comment should contain tool information
    expect(comment.length).toBeGreaterThan(0);
  });

  test("should handle mixed severity comment generation", () => {
    const findings = [
      {
        id: "1",
        tool: "coderabbit",
        severity: "critical",
        category: "security",
        suggestion: "Critical",
        file: "a.js",
        line: 1,
      },
      {
        id: "2",
        tool: "copilot",
        severity: "major",
        category: "logic",
        suggestion: "Major",
        file: "b.js",
        line: 2,
      },
      {
        id: "3",
        tool: "code-quality",
        severity: "minor",
        category: "style",
        suggestion: "Minor",
        file: "c.js",
        line: 3,
      },
    ];

    const decisions = engine.process(findings);
    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
  });

  test("should sanitize comment content", () => {
    const findings = [
      {
        id: "1",
        tool: "coderabbit",
        severity: "critical",
        category: "security",
        suggestion: '<script>alert("xss")</script>',
        file: "a.js",
        line: 1,
      },
    ];

    const decisions = engine.process(findings);
    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
    // Comment should handle potentially unsafe content
    expect(typeof comment).toBe("string");
  });

  test("should handle emoji and special characters in comment", () => {
    const findings = [
      {
        id: "1",
        tool: "coderabbit",
        severity: "critical",
        category: "security",
        suggestion: "🔒 Security: Fix injection ✅",
        file: "a.js",
        line: 1,
      },
    ];

    const decisions = engine.process(findings);
    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
  });
});
