const patternEngine = require('../../includes/patternEngine.cjs');

describe('PatternEngine', () => {
  describe('compilePatterns', () => {
    test('should compile valid regex patterns', () => {
      const patterns = [{ regex: 'test' }, { regex: '\\d+', flags: 'i' }];
      const compiled = patternEngine.compilePatterns(patterns);
      expect(compiled).toHaveLength(2);
      expect(compiled[0].regex).toBeInstanceOf(RegExp);
    });

    test('should throw on invalid regex', () => {
      const patterns = [{ regex: '[invalid' }];
      expect(() => patternEngine.compilePatterns(patterns)).toThrow();
    });

    test('should throw on missing regex field', () => {
      const patterns = [{ description: 'missing regex' }];
      expect(() => patternEngine.compilePatterns(patterns)).toThrow();
    });
  });

  describe('applyPatterns', () => {
    test('should find matches in text', () => {
      const patterns = [{ regex: '\\b(function|const)\\b', flags: 'g' }];
      const compiled = patternEngine.compilePatterns(patterns);
      const matches = patternEngine.applyPatterns('function test() { const x = 1; }', compiled);
      expect(matches.length).toBeGreaterThan(0);
    });

    test('should return empty array for no matches', () => {
      const patterns = [{ regex: 'xyz123' }];
      const compiled = patternEngine.compilePatterns(patterns);
      const matches = patternEngine.applyPatterns('normal text here', compiled);
      expect(matches).toEqual([]);
    });

    test('should include context when requested', () => {
      const patterns = [{ regex: 'test', context: true, contextLength: 10 }];
      const compiled = patternEngine.compilePatterns(patterns);
      const matches = patternEngine.applyPatterns('prefix test suffix', compiled);
      expect(matches[0].context).toBeDefined();
      expect(matches[0].context.matched).toBe('test');
    });

    test('should respect limit parameter', () => {
      const patterns = [{ regex: 'a', flags: 'g' }];
      const compiled = patternEngine.compilePatterns(patterns);
      const matches = patternEngine.applyPatterns('a a a a', compiled, { limit: 2 });
      expect(matches).toHaveLength(2);
    });
  });

  describe('matches', () => {
    test('should return true for matching patterns', () => {
      const patterns = [{ regex: 'code' }];
      const compiled = patternEngine.compilePatterns(patterns);
      expect(patternEngine.matches('some code here', compiled)).toBe(true);
    });

    test('should return false for non-matching patterns', () => {
      const patterns = [{ regex: 'code' }];
      const compiled = patternEngine.compilePatterns(patterns);
      expect(patternEngine.matches('plain text', compiled)).toBe(false);
    });

    test('should return false for invalid input', () => {
      const patterns = [{ regex: 'code' }];
      const compiled = patternEngine.compilePatterns(patterns);
      expect(patternEngine.matches(null, compiled)).toBe(false);
      expect(patternEngine.matches(undefined, compiled)).toBe(false);
    });
  });

  describe('getLineNumber and getColumnNumber', () => {
    test('should calculate line numbers correctly', () => {
      const text = 'line1\nline2\nline3';
      expect(patternEngine.getLineNumber(text, 0)).toBe(1);
      expect(patternEngine.getLineNumber(text, 6)).toBe(2);
      expect(patternEngine.getLineNumber(text, 12)).toBe(3);
    });

    test('should calculate column numbers correctly', () => {
      const text = 'hello\nworld';
      expect(patternEngine.getColumnNumber(text, 0)).toBe(0);
      expect(patternEngine.getColumnNumber(text, 6)).toBe(0);
      expect(patternEngine.getColumnNumber(text, 8)).toBe(2);
    });
  });

  describe('countMatches', () => {
    test('should count all matches', () => {
      const patterns = [{ regex: '\\b\\w+\\b', flags: 'g' }];
      const compiled = patternEngine.compilePatterns(patterns);
      const count = patternEngine.countMatches('one two three', compiled);
      expect(count).toBe(3);
    });

    test('should return 0 for no matches', () => {
      const patterns = [{ regex: 'xyz' }];
      const compiled = patternEngine.compilePatterns(patterns);
      const count = patternEngine.countMatches('abc def', compiled);
      expect(count).toBe(0);
    });
  });

  describe('testPattern', () => {
    test('should test regex patterns', () => {
      expect(patternEngine.testPattern('\\d+', '123')).toBe(true);
      expect(patternEngine.testPattern('\\d+', 'abc')).toBe(false);
    });

    test('should handle invalid patterns gracefully', () => {
      expect(patternEngine.testPattern('[invalid', 'text')).toBe(false);
    });
  });
});
