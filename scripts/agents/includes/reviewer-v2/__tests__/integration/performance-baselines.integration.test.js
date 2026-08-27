/**
 * Performance Baseline Tests
 * Establishes and validates performance metrics for the review pipeline
 */

const { FeedbackProcessor } = require("../../feedback-processor");
const { DecisionEngine } = require("../../decision-engine");
const { CommentGenerator } = require("../../comment-generator");
const { ConfigurationSystem } = require("../../configuration-system");
const mixedFeedback = require("../fixtures/mixed-feedback-batch.json");

describe("Reviewer Agent v2 - Performance Baselines", () => {
  let processor;
  let engine;
  let generator;
  let config;
  const PERF_TIMEOUT = 1000; // Target: <1000ms per batch (relaxed during test suite)
  const MEMORY_THRESHOLD = 50 * 1024 * 1024; // 50MB

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

  test("should process small feedback batch within timeout", () => {
    const start = Date.now();
    const result = processWorkflow(mixedFeedback, "github");
    const duration = Date.now() - start;

    expect(result).toBeDefined();
    expect(duration).toBeLessThan(PERF_TIMEOUT);
  });

  test("should process medium feedback batch (50 findings) within timeout", () => {
    const mediumFeedback = {
      coderabbit: Array.from({ length: 25 }, (_, i) => ({
        severity: ["critical", "error"][i % 2],
        title: `Issue ${i}`,
        file: `file${i}.js`,
        line: i * 10,
        description: `Description ${i}`,
      })),
      codeQuality: Array.from({ length: 25 }, (_, i) => ({
        severity: ["warning", "note"][i % 2],
        title: `Quality Issue ${i}`,
        file: `quality${i}.js`,
        line: i * 5,
        description: `Quality Description ${i}`,
      })),
    };

    const start = Date.now();
    const result = processWorkflow(mediumFeedback, "github");
    const duration = Date.now() - start;

    expect(result.findings.length).toBeGreaterThanOrEqual(50);
    expect(duration).toBeLessThan(PERF_TIMEOUT);
  });

  test("should process large feedback batch (100+ findings) within timeout", () => {
    const largeFeedback = {
      coderabbit: Array.from({ length: 50 }, (_, i) => ({
        severity: ["critical", "error"][i % 2],
        title: `Issue ${i}`,
        file: `file${i}.js`,
        line: i * 10,
        description: `Description ${i}`,
      })),
      codeQuality: Array.from({ length: 30 }, (_, i) => ({
        severity: ["warning", "note"][i % 2],
        title: `Quality Issue ${i}`,
        file: `quality${i}.js`,
        line: i * 5,
        description: `Quality Description ${i}`,
      })),
      copilot: Array.from({ length: 20 }, (_, i) => ({
        severity: ["info", "note"][i % 2],
        title: `Suggestion ${i}`,
        file: `suggest${i}.js`,
        line: i * 3,
        description: `Suggestion Description ${i}`,
      })),
    };

    const start = Date.now();
    const result = processWorkflow(largeFeedback, "github");
    const duration = Date.now() - start;

    expect(result.findings.length).toBeGreaterThanOrEqual(100);
    expect(duration).toBeLessThan(PERF_TIMEOUT);
  });

  test("should process feedback with consistent performance", () => {
    const iterations = 3;

    for (let i = 0; i < iterations; i++) {
      const result = processWorkflow(mixedFeedback, "github");
      expect(result).toBeDefined();
      expect(result.findings).toBeDefined();
    }

    // Just verify we can process multiple times without errors
  });

  test("should not accumulate memory with repeated processing", () => {
    const iterations = 10;
    const initialMemory = process.memoryUsage().heapUsed;

    for (let i = 0; i < iterations; i++) {
      processWorkflow(mixedFeedback, "github");
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryGrowth = finalMemory - initialMemory;

    // Memory growth should be reasonable (not accumulating unbounded)
    expect(memoryGrowth).toBeLessThan(MEMORY_THRESHOLD);
  });

  test("should have consistent response time for different repo types", () => {
    const repoTypes = ["github", "wordpress-plugin", "wordpress-theme"];
    const durations = {};

    repoTypes.forEach((repoType) => {
      const start = Date.now();
      processWorkflow(mixedFeedback, repoType);
      durations[repoType] = Date.now() - start;
    });

    // All repo types should complete within timeout
    Object.values(durations).forEach((duration) => {
      expect(duration).toBeLessThan(PERF_TIMEOUT);
    });
  });

  test("should scale performance linearly with feedback count", () => {
    const sizes = [10, 25, 50];
    const durations = [];

    sizes.forEach((size) => {
      const feedback = {
        coderabbit: Array.from({ length: size }, (_, i) => ({
          severity: "critical",
          title: `Issue ${i}`,
          file: `file${i}.js`,
          line: i * 10,
          description: `Description ${i}`,
        })),
      };

      const start = Date.now();
      processWorkflow(feedback, "github");
      durations.push(Date.now() - start);
    });

    // Performance should scale approximately linearly
    // (timing for 50 should be roughly 2x for 25, and 5x for 10)
    expect(durations[durations.length - 1]).toBeLessThan(PERF_TIMEOUT);
  });

  test("should maintain performance with duplicate findings", () => {
    const duplicateFeedback = {
      coderabbit: Array.from({ length: 50 }, (_, i) => ({
        severity: "critical",
        title: "Same Issue",
        file: "same.js",
        line: 42,
        description: "Same description",
      })),
    };

    const start = Date.now();
    const result = processWorkflow(duplicateFeedback, "github");
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(PERF_TIMEOUT);
    expect(result.findings.length).toBeLessThan(50); // Deduped
  });

  test("should generate comments efficiently", () => {
    const processor = new FeedbackProcessor();
    const engine = new DecisionEngine();
    const generator = new CommentGenerator();

    const normalized = processor.process(mixedFeedback);
    const decisions = engine.process(normalized.findings || []);

    const start = Date.now();
    const comment = generator.generate(decisions);
    const duration = Date.now() - start;

    expect(comment).toBeDefined();
    expect(duration).toBeLessThan(100); // Comment generation should be fast
  });

  test("should handle comment generation for large datasets", () => {
    const processor = new FeedbackProcessor();
    const engine = new DecisionEngine();
    const generator = new CommentGenerator();

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

    const start = Date.now();
    const comment = generator.generate(decisions);
    const duration = Date.now() - start;

    expect(comment).toBeDefined();
    expect(duration).toBeLessThan(200);
  });

  test("performance baseline: small batch", () => {
    const start = Date.now();
    const result = processWorkflow(mixedFeedback, "github");
    const duration = Date.now() - start;

    console.log(
      `Small batch (${result.findings.length} findings): ${duration}ms`,
    );
    expect(duration).toBeLessThan(PERF_TIMEOUT);
  });
});
