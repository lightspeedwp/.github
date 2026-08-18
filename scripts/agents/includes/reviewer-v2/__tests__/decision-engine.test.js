const { DecisionEngine } = require('../decision-engine');

describe('DecisionEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new DecisionEngine();
  });

  describe('initialization', () => {
    test('should create with default rules', () => {
      expect(engine.rules.excludedFiles).toEqual([]);
      expect(engine.rules.excludedCategories).toEqual([]);
      expect(engine.rules.autoResolvePatterns).toEqual([]);
      expect(engine.rules.escalatePatterns).toEqual([]);
      expect(engine.rules.suppressFalsePositives).toEqual([]);
    });

    test('should initialize with custom rules', () => {
      const customRules = {
        excludedFiles: ['*.test.js'],
        excludedCategories: ['style'],
      };

      const customEngine = new DecisionEngine(customRules);
      expect(customEngine.rules.excludedFiles).toEqual(['*.test.js']);
      expect(customEngine.rules.excludedCategories).toEqual(['style']);
    });
  });

  describe('process', () => {
    test('should return empty results for null input', () => {
      const result = engine.process(null);

      expect(result.auto_resolved).toEqual([]);
      expect(result.suppressed).toEqual([]);
      expect(result.requires_review).toEqual([]);
    });

    test('should return empty results for undefined input', () => {
      const result = engine.process(undefined);

      expect(result.auto_resolved).toEqual([]);
      expect(result.suppressed).toEqual([]);
      expect(result.requires_review).toEqual([]);
    });

    test('should return empty results for non-array input', () => {
      const result = engine.process({ not: 'array' });

      expect(result.auto_resolved).toEqual([]);
      expect(result.suppressed).toEqual([]);
      expect(result.requires_review).toEqual([]);
    });

    test('should categorize findings correctly', () => {
      const findings = [
        {
          id: '1',
          file: 'app.js',
          line: 10,
          suggestion: 'Security issue',
          severity: 'critical',
          category: 'security',
        },
        {
          id: '2',
          file: 'style.css',
          line: 5,
          suggestion: 'Style issue',
          severity: 'minor',
          category: 'style',
        },
      ];

      const customEngine = new DecisionEngine({
        excludedCategories: ['style'],
      });

      const result = customEngine.process(findings);

      expect(result.requires_review).toHaveLength(1);
      expect(result.suppressed).toHaveLength(1);
      expect(result.suppressed[0].id).toBe('2');
    });

    test('should handle mixed findings', () => {
      const findings = [
        {
          id: '1',
          file: 'app.js',
          line: 10,
          suggestion: 'fixable issue',
          severity: 'major',
          category: 'code-quality',
        },
        {
          id: '2',
          file: 'test.js',
          line: 5,
          suggestion: 'Test issue',
          severity: 'minor',
          category: 'testing',
        },
        {
          id: '3',
          file: 'secure.js',
          line: 15,
          suggestion: 'Security concern',
          severity: 'critical',
          category: 'security',
        },
      ];

      const customEngine = new DecisionEngine({
        autoResolvePatterns: ['fixable issue'],
      });

      const result = customEngine.process(findings);

      expect(result.auto_resolved).toHaveLength(1);
      expect(result.requires_review).toHaveLength(2);
    });
  });

  describe('makeDecision', () => {
    test('should create decision with proper structure', () => {
      const finding = {
        id: '1',
        file: 'app.js',
        line: 10,
        suggestion: 'Issue',
        severity: 'major',
        category: 'code-quality',
      };

      const decision = engine.makeDecision(finding);

      expect(decision).toHaveProperty('status');
      expect(decision).toHaveProperty('decision_reason');
      expect(decision).toHaveProperty('id', '1');
      expect(Array.isArray(decision.decision_reason)).toBe(true);
    });

    test('should suppress excluded files', () => {
      const engine = new DecisionEngine({
        excludedFiles: ['*.test.js', 'docs/*'],
      });

      const finding1 = {
        id: '1',
        file: 'app.test.js',
        line: 10,
        suggestion: 'Issue',
        severity: 'major',
        category: 'code-quality',
      };

      const finding2 = {
        id: '2',
        file: 'docs/README.md',
        line: 5,
        suggestion: 'Issue',
        severity: 'major',
        category: 'code-quality',
      };

      const decision1 = engine.makeDecision(finding1);
      const decision2 = engine.makeDecision(finding2);

      expect(decision1.status).toBe('suppressed');
      expect(decision2.status).toBe('suppressed');
      expect(decision1.decision_reason).toContain('File is in excluded files list');
    });

    test('should suppress excluded categories', () => {
      const engine = new DecisionEngine({
        excludedCategories: ['style', 'documentation'],
      });

      const finding = {
        id: '1',
        file: 'app.js',
        line: 10,
        suggestion: 'Issue',
        severity: 'major',
        category: 'style',
      };

      const decision = engine.makeDecision(finding);

      expect(decision.status).toBe('suppressed');
      expect(decision.decision_reason).toContain('Category is excluded');
    });

    test('should suppress known false positives', () => {
      const engine = new DecisionEngine({
        suppressFalsePositives: [
          {
            tool: 'coderabbit',
            category: 'performance',
            message: 'unnecessary loop',
          },
        ],
      });

      const finding = {
        id: '1',
        file: 'app.js',
        line: 10,
        suggestion: 'This loop is unnecessary loop overhead',
        severity: 'major',
        category: 'performance',
        tool: 'coderabbit',
      };

      const decision = engine.makeDecision(finding);

      expect(decision.status).toBe('suppressed');
      expect(decision.decision_reason).toContain('Known false positive pattern');
    });

    test('should auto-resolve matching patterns', () => {
      const engine = new DecisionEngine({
        autoResolvePatterns: ['Use const instead of let', /^Unused variable/],
      });

      const finding1 = {
        id: '1',
        file: 'app.js',
        line: 10,
        suggestion: 'Use const instead of let for immutability',
        severity: 'major',
        category: 'code-quality',
      };

      const finding2 = {
        id: '2',
        file: 'app.js',
        line: 15,
        suggestion: 'Unused variable x is declared but not used',
        severity: 'major',
        category: 'code-quality',
      };

      const decision1 = engine.makeDecision(finding1);
      const decision2 = engine.makeDecision(finding2);

      expect(decision1.status).toBe('resolved');
      expect(decision2.status).toBe('resolved');
      expect(decision1.decision_reason).toContain('Matches auto-resolve pattern');
    });

    test('should escalate critical findings', () => {
      const finding = {
        id: '1',
        file: 'app.js',
        line: 10,
        suggestion: 'Security vulnerability',
        severity: 'critical',
        category: 'security',
      };

      const decision = engine.makeDecision(finding);

      expect(decision.status).toBe('requires_review');
      expect(decision.escalated).toBe(true);
      expect(decision.decision_reason.some(r => r.includes('escalated'))).toBe(true);
    });

    test('should escalate matching escalate patterns', () => {
      const engine = new DecisionEngine({
        escalatePatterns: [
          { severity: 'major', category: 'security' },
          { category: 'performance', file: '*.js' },
        ],
      });

      const finding1 = {
        id: '1',
        file: 'auth.js',
        line: 10,
        suggestion: 'Security issue',
        severity: 'major',
        category: 'security',
      };

      const finding2 = {
        id: '2',
        file: 'loop.js',
        line: 15,
        suggestion: 'Performance issue',
        severity: 'minor',
        category: 'performance',
      };

      const decision1 = engine.makeDecision(finding1);
      const decision2 = engine.makeDecision(finding2);

      expect(decision1.escalated).toBe(true);
      expect(decision2.escalated).toBe(true);
    });
  });

  describe('pattern matching', () => {
    test('should match string patterns with wildcards', () => {
      const matches1 = engine.matchPattern('src/app.test.js', '*.test.js');
      const matches2 = engine.matchPattern('src/utils/helpers.js', 'src/*/*.js');
      const matches3 = engine.matchPattern('docs/README.md', 'docs/*');

      expect(matches1).toBe(true);
      expect(matches2).toBe(true);
      expect(matches3).toBe(true);
    });

    test('should match simple string patterns', () => {
      const matches1 = engine.matchPattern('app.test.js', 'test');
      const matches2 = engine.matchPattern('app.prod.js', 'test');

      expect(matches1).toBe(true);
      expect(matches2).toBe(false);
    });

    test('should match regex patterns', () => {
      const regex = /^src\/.*\.js$/;
      const matches1 = engine.matchPattern('src/app.js', regex);
      const matches2 = engine.matchPattern('test/app.js', regex);

      expect(matches1).toBe(true);
      expect(matches2).toBe(false);
    });

    test('should handle null/undefined patterns gracefully', () => {
      const matches1 = engine.matchPattern('file.js', null);
      const matches2 = engine.matchPattern(null, 'pattern');
      const matches3 = engine.matchPattern(null, null);

      expect(matches1).toBe(false);
      expect(matches2).toBe(false);
      expect(matches3).toBe(false);
    });
  });

  describe('false positive matching', () => {
    test('should match false positive by tool and message', () => {
      const engine = new DecisionEngine({
        suppressFalsePositives: [
          { tool: 'coderabbit', message: 'generic warning' },
        ],
      });

      const finding = {
        id: '1',
        file: 'app.js',
        line: 10,
        suggestion: 'This is a generic warning message',
        severity: 'major',
        category: 'code-quality',
        tool: 'coderabbit',
      };

      const decision = engine.makeDecision(finding);

      expect(decision.status).toBe('suppressed');
    });

    test('should not match false positive with different tool', () => {
      const engine = new DecisionEngine({
        suppressFalsePositives: [
          { tool: 'coderabbit', message: 'Generic warning' },
        ],
      });

      const finding = {
        id: '1',
        file: 'app.js',
        line: 10,
        suggestion: 'This is a generic warning message',
        severity: 'major',
        category: 'code-quality',
        tool: 'copilot',
      };

      const decision = engine.makeDecision(finding);

      expect(decision.status).toBe('requires_review');
    });

    test('should match false positive by file pattern', () => {
      const engine = new DecisionEngine({
        suppressFalsePositives: [
          { file: '*.test.js', message: 'test context' },
        ],
      });

      const finding = {
        id: '1',
        file: 'app.test.js',
        line: 10,
        suggestion: 'Issue in test context setup',
        severity: 'major',
        category: 'code-quality',
      };

      const decision = engine.makeDecision(finding);

      expect(decision.status).toBe('suppressed');
    });
  });

  describe('setRules', () => {
    test('should update rules', () => {
      engine.setRules({
        excludedFiles: ['*.test.js'],
        newField: 'value',
      });

      expect(engine.rules.excludedFiles).toEqual(['*.test.js']);
      expect(engine.rules.newField).toBe('value');
    });

    test('should merge new rules with existing', () => {
      engine.setRules({
        excludedFiles: ['*.test.js'],
      });

      engine.setRules({
        excludedCategories: ['style'],
      });

      expect(engine.rules.excludedFiles).toEqual(['*.test.js']);
      expect(engine.rules.excludedCategories).toEqual(['style']);
    });
  });

  describe('reset', () => {
    test('should clear decisions', () => {
      engine.decisions = [{ id: '1', status: 'reviewed' }];

      engine.reset();

      expect(engine.decisions).toEqual([]);
    });
  });

  describe('integration tests', () => {
    test('should process complex ruleset correctly', () => {
      const engine = new DecisionEngine({
        excludedFiles: ['*.test.js', 'docs/*', 'node_modules/*'],
        excludedCategories: ['style', 'documentation'],
        autoResolvePatterns: ['Use const', /^Unused variable/],
        escalatePatterns: [{ severity: 'critical' }, { category: 'security' }],
        suppressFalsePositives: [
          { tool: 'coderabbit', message: 'false positive' },
        ],
      });

      const findings = [
        {
          id: '1',
          file: 'app.test.js',
          line: 10,
          suggestion: 'Issue',
          severity: 'major',
          category: 'code-quality',
        },
        {
          id: '2',
          file: 'src/app.js',
          line: 5,
          suggestion: 'Use const instead of let',
          severity: 'minor',
          category: 'code-quality',
        },
        {
          id: '3',
          file: 'src/auth.js',
          line: 20,
          suggestion: 'Security vulnerability',
          severity: 'critical',
          category: 'security',
        },
        {
          id: '4',
          file: 'src/style.js',
          line: 15,
          suggestion: 'Style issue',
          severity: 'minor',
          category: 'style',
        },
      ];

      const result = engine.process(findings);

      expect(result.suppressed).toHaveLength(2);
      expect(result.auto_resolved).toHaveLength(1);
      expect(result.requires_review).toHaveLength(1);
      expect(result.requires_review[0].escalated).toBe(true);
    });

    test('should prioritize decision order (exclude > false positive > auto-resolve > escalate)', () => {
      const engine = new DecisionEngine({
        excludedFiles: ['skip.js'],
        suppressFalsePositives: [
          { tool: 'coderabbit', message: 'false positive' },
        ],
        autoResolvePatterns: ['auto resolve'],
      });

      const findings = [
        {
          id: '1',
          file: 'skip.js',
          line: 10,
          suggestion: 'This matches auto resolve but file is excluded',
          severity: 'major',
          category: 'code-quality',
          tool: 'coderabbit',
        },
      ];

      const result = engine.process(findings);

      expect(result.suppressed).toHaveLength(1);
      expect(result.auto_resolved).toHaveLength(0);
    });
  });
});
