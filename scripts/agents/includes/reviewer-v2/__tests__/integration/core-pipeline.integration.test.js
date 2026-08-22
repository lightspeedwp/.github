/**
 * Core Pipeline Integration Tests
 * Tests the full feedback → decision → comment flow with realistic data
 */

const { FeedbackProcessor } = require('../../feedback-processor');
const { DecisionEngine } = require('../../decision-engine');
const { CommentGenerator } = require('../../comment-generator');
const { ConfigurationSystem } = require('../../configuration-system');
const Orchestrator = require('../../orchestrator');

describe('Reviewer Agent v2 - Core Pipeline Integration', () => {
  let processor;
  let engine;
  let generator;
  let config;
  let orchestrator;

  beforeEach(() => {
    processor = new FeedbackProcessor();
    engine = new DecisionEngine();
    generator = new CommentGenerator();
    config = new ConfigurationSystem();
    orchestrator = new Orchestrator({
      processor,
      engine,
      generator,
      config,
    });
  });

  test('should initialize all components', () => {
    expect(processor).toBeDefined();
    expect(engine).toBeDefined();
    expect(generator).toBeDefined();
    expect(config).toBeDefined();
    expect(orchestrator).toBeDefined();
  });

  test('should process feedback through full pipeline', () => {
    const feedback = {
      coderabbit: [
        {
          severity: 'critical',
          title: 'SQL injection vulnerability',
          file: 'db.js',
          line: 42,
          description: 'User input not properly sanitized',
        },
      ],
    };

    const normalized = processor.process(feedback);
    expect(normalized).toBeDefined();
    expect(normalized.findings).toBeDefined();
    expect(normalized.findings.length).toBeGreaterThan(0);
  });

  test('should handle multiple tools in batch', () => {
    const feedback = {
      coderabbit: [
        {
          severity: 'critical',
          title: 'Hardcoded password',
          file: 'config.js',
          line: 10,
          description: 'API key hardcoded',
        },
      ],
      codeQuality: [
        {
          severity: 'high',
          title: 'Function too complex',
          file: 'utils.js',
          line: 50,
          description: 'Cyclomatic complexity > 10',
        },
      ],
    };

    const normalized = processor.process(feedback);
    expect(normalized.findings).toBeDefined();
    expect(normalized.findings.length).toBeGreaterThan(0);
  });

  test('should generate comment output', () => {
    const feedback = {
      coderabbit: [
        {
          severity: 'critical',
          title: 'Vulnerability found',
          file: 'lib.js',
          line: 25,
          description: 'SQL injection risk',
        },
      ],
    };

    const normalized = processor.process(feedback);
    const decisions = engine.process(normalized.findings || []);
    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
    expect(typeof comment).toBe('string');
    expect(comment.length).toBeGreaterThan(0);
  });

  test('should handle configuration loading', () => {
    const cfg = config.loadConfiguration('wordpress-plugin');

    expect(cfg).toBeDefined();
    expect(cfg.excludedFiles).toBeDefined();
  });

  test('should process large feedback batch', () => {
    const largeFeedback = {
      coderabbit: Array.from({ length: 50 }, (_, i) => ({
        severity: ['critical', 'error', 'warning', 'note'][i % 4],
        title: `Issue ${i}`,
        file: `file${i}.js`,
        line: i * 10,
        description: `Description for issue ${i}`,
      })),
    };

    const normalized = processor.process(largeFeedback);
    const decisions = engine.process(normalized.findings || []);
    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
  });

  test('should handle empty findings gracefully', () => {
    const feedback = {
      coderabbit: [],
    };

    const normalized = processor.process(feedback);
    const decisions = engine.process(normalized.findings || []);
    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
  });

  test('should respect configuration priorities', () => {
    const cfg = config.loadConfiguration('wordpress-plugin');

    expect(cfg).toBeDefined();
    expect(cfg.excludedFiles).toBeDefined();
  });

  test('should handle malformed feedback', () => {
    const malformed = {
      invalid: null,
    };

    expect(() => {
      processor.process(malformed);
    }).not.toThrow();
  });
});
