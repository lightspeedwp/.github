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
      source: 'coderabbit',
      findings: [
        {
          type: 'security',
          severity: 'critical',
          message: 'SQL injection vulnerability',
          file: 'db.js',
          line: 42,
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
      source: 'mixed',
      findings: [
        {
          source: 'coderabbit',
          type: 'security',
          severity: 'critical',
          message: 'Hardcoded password',
          file: 'config.js',
        },
        {
          source: 'code-quality',
          type: 'complexity',
          severity: 'high',
          message: 'Function too complex',
          file: 'utils.js',
        },
      ],
    };

    const normalized = processor.process(feedback);
    expect(normalized.findings).toBeDefined();
    expect(normalized.findings.length).toBeGreaterThan(0);
  });

  test('should generate comment output', () => {
    const feedback = {
      source: 'coderabbit',
      findings: [
        {
          type: 'security',
          severity: 'critical',
          message: 'Vulnerability found',
          file: 'lib.js',
        },
      ],
    };

    const normalized = processor.process(feedback);
    const decisions = engine.decide(normalized);
    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
    expect(typeof comment).toBe('string');
    expect(comment.length).toBeGreaterThan(0);
  });

  test('should handle configuration loading', () => {
    const cfg = config.loadConfig({
      repoType: 'plugin',
      path: '/test/plugin',
    });

    expect(cfg).toBeDefined();
    expect(cfg.rules).toBeDefined();
  });

  test('should process large feedback batch', () => {
    const largeFeedback = {
      source: 'coderabbit',
      findings: Array.from({ length: 50 }, (_, i) => ({
        type: i % 2 === 0 ? 'security' : 'style',
        severity: ['critical', 'high', 'normal', 'low'][i % 4],
        message: `Issue ${i}`,
        file: `file${i}.js`,
      })),
    };

    const normalized = processor.process(largeFeedback);
    const decisions = engine.decide(normalized);
    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
  });

  test('should handle empty findings gracefully', () => {
    const feedback = {
      source: 'coderabbit',
      findings: [],
    };

    const normalized = processor.process(feedback);
    const decisions = engine.decide(normalized);
    const comment = generator.generate(decisions);

    expect(comment).toBeDefined();
  });

  test('should respect configuration priorities', () => {
    const cfg = config.loadConfig({
      repoType: 'plugin',
      rules: {
        minSeverity: 'high',
      },
    });

    expect(cfg.rules.minSeverity).toBe('high');
  });

  test('should handle malformed feedback', () => {
    const malformed = {
      source: 'invalid',
      findings: null,
    };

    expect(() => {
      processor.process(malformed);
    }).not.toThrow();
  });
});
