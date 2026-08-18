const { FeedbackProcessor, TOOL_TYPES } = require('../feedback-processor');

describe('FeedbackProcessor', () => {
  let processor;

  beforeEach(() => {
    processor = new FeedbackProcessor();
  });

  describe('initialization', () => {
    test('should create an instance with empty findings', () => {
      expect(processor.findings).toEqual([]);
      expect(processor.seenIds).toBeInstanceOf(Set);
      expect(processor.seenIds.size).toBe(0);
    });
  });

  describe('process', () => {
    test('should return empty findings for null input', () => {
      const result = processor.process(null);
      expect(result.findings).toEqual([]);
      expect(result.errors).toEqual([]);
    });

    test('should return empty findings for undefined input', () => {
      const result = processor.process(undefined);
      expect(result.findings).toEqual([]);
      expect(result.errors).toEqual([]);
    });

    test('should return empty findings for non-object input', () => {
      const result = processor.process('invalid');
      expect(result.findings).toEqual([]);
      expect(result.errors).toEqual([]);
    });

    test('should process all tool types in one call', () => {
      const input = {
        coderabbit: [{ file: 'a.js', line: 10, title: 'Security issue', severity: 'error' }],
        codeQuality: [{ path: 'b.js', line: 20, message: 'Bad style', severity: 'warning' }],
        copilot: [{ file: 'c.js', line: 30, message: 'Suggestion', severity: 'note' }],
        wordPressQuality: [{ file: 'd.php', line: 40, message: 'WP issue', severity: 'info' }],
      };

      const result = processor.process(input);
      expect(result.findings.length).toBe(4);
      expect(result.errors).toEqual([]);
    });

    test('should capture conversion errors gracefully', () => {
      const input = {
        coderabbit: 'not an array',
      };

      const result = processor.process(input);
      expect(result.findings).toEqual([]);
      expect(result.errors).toEqual([]);
    });
  });

  describe('convertCodeRabbit', () => {
    test('should convert valid CodeRabbit finding', () => {
      const findings = [
        {
          file: 'src/app.js',
          line: 42,
          title: 'Potential SQL injection vulnerability',
          severity: 'error',
          description: 'User input not sanitized',
        },
      ];

      const result = processor.convertCodeRabbit(findings);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          tool: TOOL_TYPES.CODERABBIT,
          severity: 'critical',
          category: 'security',
          file: 'src/app.js',
          line: 42,
          status: 'open',
          suggestion: 'Potential SQL injection vulnerability',
        })
      );
    });

    test('should return empty array for null input', () => {
      const result = processor.convertCodeRabbit(null);
      expect(result).toEqual([]);
    });

    test('should map severity levels correctly', () => {
      const findings = [
        { file: 'a.js', line: 1, title: 'Error', severity: 'error' },
        { file: 'b.js', line: 2, title: 'Warning', severity: 'warning' },
        { file: 'c.js', line: 3, title: 'Note', severity: 'note' },
      ];

      const result = processor.convertCodeRabbit(findings);
      expect(result[0].severity).toBe('critical');
      expect(result[1].severity).toBe('major');
      expect(result[2].severity).toBe('minor');
    });

    test('should extract category from title', () => {
      const findings = [
        { file: 'a.js', line: 1, title: 'Security vulnerability' },
        { file: 'b.js', line: 2, title: 'Performance issue: slow loop' },
        { file: 'c.js', line: 3, title: 'Test coverage missing' },
        { file: 'd.js', line: 4, title: 'Style issue with formatting' },
        { file: 'e.js', line: 5, title: 'Architecture violation' },
        { file: 'f.js', line: 6, title: 'Comment documentation needed' },
        { file: 'g.js', line: 7, title: 'Generic code quality issue' },
      ];

      const result = processor.convertCodeRabbit(findings);
      expect(result[0].category).toBe('security');
      expect(result[1].category).toBe('performance');
      expect(result[2].category).toBe('testing');
      expect(result[3].category).toBe('style');
      expect(result[4].category).toBe('architecture');
      expect(result[5].category).toBe('documentation');
      expect(result[6].category).toBe('code-quality');
    });

    test('should generate consistent IDs', () => {
      const finding = { file: 'app.js', line: 10, title: 'Issue', severity: 'error' };
      const result1 = processor.convertCodeRabbit([finding]);
      const result2 = processor.convertCodeRabbit([finding]);

      expect(result1[0].id).toBe(result2[0].id);
    });
  });

  describe('convertCodeQuality', () => {
    test('should convert valid code quality finding', () => {
      const findings = [
        {
          path: 'src/utils.js',
          line: 5,
          message: 'Unused variable',
          rule: 'no-unused-vars',
          severity: 'warning',
        },
      ];

      const result = processor.convertCodeQuality(findings);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          tool: TOOL_TYPES.CODE_QUALITY,
          severity: 'major',
          category: 'no-unused-vars',
          file: 'src/utils.js',
          line: 5,
          status: 'open',
        })
      );
    });

    test('should return empty array for non-array input', () => {
      const result = processor.convertCodeQuality({ invalid: 'object' });
      expect(result).toEqual([]);
    });
  });

  describe('convertCopilot', () => {
    test('should convert valid Copilot finding', () => {
      const findings = [
        {
          file: 'src/handler.js',
          line: 20,
          message: 'Consider using async/await',
          category: 'suggestion',
          severity: 'note',
        },
      ];

      const result = processor.convertCopilot(findings);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          tool: TOOL_TYPES.COPILOT,
          severity: 'minor',
          category: 'suggestion',
          file: 'src/handler.js',
          line: 20,
          status: 'open',
        })
      );
    });

    test('should return empty array for null input', () => {
      const result = processor.convertCopilot(null);
      expect(result).toEqual([]);
    });
  });

  describe('convertWordPress', () => {
    test('should convert valid WordPress finding', () => {
      const findings = [
        {
          file: 'functions.php',
          line: 50,
          message: 'Direct database query without prepared statement',
          check: 'db-security',
          severity: 'error',
        },
      ];

      const result = processor.convertWordPress(findings);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          tool: TOOL_TYPES.WORDPRESS,
          severity: 'critical',
          category: 'db-security',
          file: 'functions.php',
          line: 50,
          status: 'open',
        })
      );
    });

    test('should return empty array for non-array input', () => {
      const result = processor.convertWordPress('invalid');
      expect(result).toEqual([]);
    });
  });

  describe('deduplicateFindings', () => {
    test('should not deduplicate different findings', () => {
      const findings1 = processor.convertCodeRabbit([
        { file: 'a.js', line: 1, title: 'Issue A' },
        { file: 'b.js', line: 2, title: 'Issue B' },
      ]);

      processor.addFindings(findings1);
      const result = processor.deduplicateFindings();

      expect(result).toHaveLength(2);
    });

    test('should deduplicate exact duplicates across tools', () => {
      const coderabbitFinding = { file: 'app.js', line: 10, title: 'Same issue' };
      const codeQualityFinding = {
        path: 'app.js',
        line: 10,
        message: 'Same issue',
        rule: 'some-rule',
      };

      const cr = processor.convertCodeRabbit([coderabbitFinding]);
      const cq = processor.convertCodeQuality([codeQualityFinding]);

      processor.addFindings(cr);
      processor.addFindings(cq);

      const result = processor.deduplicateFindings();
      expect(result).toHaveLength(1);
      expect(result[0].tools).toEqual([TOOL_TYPES.CODERABBIT, TOOL_TYPES.CODE_QUALITY]);
    });

    test('should merge duplicate findings with correct severity', () => {
      const minor = processor.convertCodeRabbit([
        { file: 'a.js', line: 1, title: 'Issue', severity: 'note' },
      ]);
      const critical = processor.convertCodeRabbit([
        { file: 'a.js', line: 1, title: 'Issue', severity: 'error' },
      ]);

      processor.addFindings(minor);
      processor.addFindings(critical);

      const result = processor.deduplicateFindings();
      expect(result).toHaveLength(1);
      expect(result[0].severity).toBe('critical');
    });

    test('should preserve original data in merged findings', () => {
      const finding1 = { file: 'a.js', line: 1, title: 'Issue', severity: 'error' };
      const finding2 = { file: 'a.js', line: 1, title: 'Issue', severity: 'warning' };

      const cr1 = processor.convertCodeRabbit([finding1]);
      const cr2 = processor.convertCodeRabbit([finding2]);

      processor.addFindings(cr1);
      processor.addFindings(cr2);

      const result = processor.deduplicateFindings();
      expect(result[0].originalData).toHaveLength(2);
    });
  });

  describe('reset', () => {
    test('should clear all findings', () => {
      processor.addFindings(
        processor.convertCodeRabbit([{ file: 'a.js', line: 1, title: 'Issue' }])
      );

      expect(processor.findings.length).toBeGreaterThan(0);

      processor.reset();

      expect(processor.findings).toEqual([]);
      expect(processor.seenIds.size).toBe(0);
    });
  });

  describe('ID generation', () => {
    test('should generate consistent IDs for same input', () => {
      const id1 = processor.generateId(TOOL_TYPES.CODERABBIT, 'file.js', 10, 'Issue');
      const id2 = processor.generateId(TOOL_TYPES.CODERABBIT, 'file.js', 10, 'Issue');

      expect(id1).toBe(id2);
    });

    test('should generate different IDs for different inputs', () => {
      const id1 = processor.generateId(TOOL_TYPES.CODERABBIT, 'file.js', 10, 'Issue 1');
      const id2 = processor.generateId(TOOL_TYPES.CODERABBIT, 'file.js', 10, 'Issue 2');

      expect(id1).not.toBe(id2);
    });

    test('should generate valid hex IDs', () => {
      const id = processor.generateId(TOOL_TYPES.CODERABBIT, 'file.js', 10, 'Issue');

      expect(id).toMatch(/^[a-f0-9]{16}$/);
    });
  });

  describe('integration tests', () => {
    test('should process complex multi-tool input with deduplication', () => {
      const input = {
        coderabbit: [
          { file: 'src/app.js', line: 42, title: 'Security issue', severity: 'error' },
          { file: 'src/app.js', line: 50, title: 'Performance issue', severity: 'warning' },
        ],
        codeQuality: [
          { path: 'src/app.js', line: 42, message: 'Security issue', severity: 'error' },
        ],
        copilot: [
          { file: 'src/utils.js', line: 5, message: 'Suggestion', severity: 'note' },
        ],
      };

      const result = processor.process(input);

      expect(result.findings.length).toBe(3);
      expect(result.errors).toEqual([]);

      const merged = result.findings.find(f => f.line === 42);
      expect(merged.tools).toContain(TOOL_TYPES.CODERABBIT);
      expect(merged.tools).toContain(TOOL_TYPES.CODE_QUALITY);
    });

    test('should handle mixed valid and empty tool results', () => {
      const input = {
        coderabbit: [
          { file: 'a.js', line: 1, title: 'Issue', severity: 'error' },
        ],
        codeQuality: [],
        copilot: null,
      };

      const result = processor.process(input);

      expect(result.findings.length).toBe(1);
      expect(result.findings[0].tool).toBe(TOOL_TYPES.CODERABBIT);
      expect(result.errors).toEqual([]);
    });

    test('should process empty object gracefully', () => {
      const result = processor.process({});

      expect(result.findings).toEqual([]);
      expect(result.errors).toEqual([]);
    });
  });

  describe('edge cases', () => {
    test('should handle findings with missing optional fields', () => {
      const findings = [
        {
          file: 'app.js',
        },
      ];

      const result = processor.convertCodeRabbit(findings);
      expect(result).toHaveLength(1);
      expect(result[0].line).toBe(0);
      expect(result[0].suggestion).toBe('');
      expect(result[0].severity).toBe('major');
    });

    test('should handle very long suggestion text', () => {
      const longText = 'A'.repeat(1000);
      const findings = [
        {
          file: 'a.js',
          line: 1,
          title: longText,
          severity: 'error',
        },
      ];

      const result = processor.convertCodeRabbit(findings);
      expect(result[0].suggestion).toBe(longText);
    });

    test('should handle special characters in file paths', () => {
      const findings = [
        {
          file: 'src/@scoped/lib/[dynamic]/file.js',
          line: 1,
          title: 'Issue',
        },
      ];

      const result = processor.convertCodeRabbit(findings);
      expect(result[0].file).toBe('src/@scoped/lib/[dynamic]/file.js');
    });

    test('should handle line numbers as strings', () => {
      const findings = [
        {
          file: 'app.js',
          line: '42',
          title: 'Issue',
        },
      ];

      const result = processor.convertCodeRabbit(findings);
      expect(result[0].line).toBe('42');
    });

    test('should handle case-insensitive severity mapping', () => {
      const findings = [
        { file: 'a.js', line: 1, title: 'Issue', severity: 'ERROR' },
        { file: 'b.js', line: 1, title: 'Issue', severity: 'WaRnInG' },
        { file: 'c.js', line: 1, title: 'Issue', severity: 'NOTE' },
      ];

      const result = processor.convertCodeRabbit(findings);
      expect(result[0].severity).toBe('critical');
      expect(result[1].severity).toBe('major');
      expect(result[2].severity).toBe('minor');
    });
  });
});
