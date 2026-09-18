const ruleLoader = require('../../includes/ruleLoader.cjs');
const path = require('path');

describe('RuleLoader', () => {
  const testRulesPath = path.join(__dirname, '../../../../.github/changelog-rules.yml');

  beforeEach(() => {
    ruleLoader.clearCache();
  });

  describe('loadRules', () => {
    test('should load rules from YAML file', () => {
      const rulesData = ruleLoader.loadRules(testRulesPath);
      expect(rulesData).toBeDefined();
      expect(rulesData.metadata).toBeDefined();
      expect(rulesData.rules).toBeInstanceOf(Array);
    });

    test('should cache rules', () => {
      const first = ruleLoader.loadRules(testRulesPath);
      const second = ruleLoader.loadRules(testRulesPath);
      expect(first).toBe(second);
    });

    test('should allow cache bypass', () => {
      ruleLoader.loadRules(testRulesPath);
      const fresh = ruleLoader.loadRules(testRulesPath, false);
      expect(fresh.rules).toBeDefined();
    });

    test('should throw on missing file', () => {
      expect(() => {
        ruleLoader.loadRules('/nonexistent/path.yml');
      }).toThrow();
    });
  });

  describe('validateRulesSchema', () => {
    test('should validate metadata section', () => {
      const invalidData = { rules: [] };
      expect(() => {
        ruleLoader.validateRulesSchema(invalidData);
      }).toThrow();
    });

    test('should validate rules array', () => {
      const invalidData = { metadata: { version: '1.0', total_rules: 0 }, rules: 'not array' };
      expect(() => {
        ruleLoader.validateRulesSchema(invalidData);
      }).toThrow();
    });
  });

  describe('validateRule', () => {
    test('should validate required fields', () => {
      const invalidRule = { id: 'R001' };
      expect(() => {
        ruleLoader.validateRule(invalidRule, 0);
      }).toThrow();
    });

    test('should validate rule_type', () => {
      const invalidRule = {
        id: 'R001',
        name: 'test',
        version: '1.0',
        rule_type: 'invalid',
        severity: 'error',
        description: 'test'
      };
      expect(() => {
        ruleLoader.validateRule(invalidRule, 0);
      }).toThrow();
    });

    test('should validate severity', () => {
      const invalidRule = {
        id: 'R001',
        name: 'test',
        version: '1.0',
        rule_type: 'format',
        severity: 'invalid',
        description: 'test'
      };
      expect(() => {
        ruleLoader.validateRule(invalidRule, 0);
      }).toThrow();
    });

    test('should set defaults for optional fields', () => {
      const rule = {
        id: 'R001',
        name: 'test',
        version: '1.0',
        rule_type: 'format',
        severity: 'error',
        description: 'test'
      };
      const validated = ruleLoader.validateRule(rule, 0);
      expect(validated.enabled).toBe(true);
      expect(validated.priority).toBe(50);
      expect(validated.patterns).toEqual([]);
    });
  });

  describe('getRuleById', () => {
    test('should find rule by ID', () => {
      const rule = ruleLoader.getRuleById('R001', testRulesPath);
      expect(rule).toBeDefined();
      expect(rule.id).toBe('R001');
    });

    test('should return null for missing rule', () => {
      const rule = ruleLoader.getRuleById('R999', testRulesPath);
      expect(rule).toBeNull();
    });
  });

  describe('getEnabledRules', () => {
    test('should return only enabled rules', () => {
      const rules = ruleLoader.getEnabledRules(testRulesPath);
      expect(rules).toBeInstanceOf(Array);
      expect(rules.every(r => r.enabled)).toBe(true);
    });

    test('should sort by priority', () => {
      const rules = ruleLoader.getEnabledRules(testRulesPath);
      for (let i = 1; i < rules.length; i++) {
        expect(rules[i].priority).toBeGreaterThanOrEqual(rules[i - 1].priority);
      }
    });
  });

  describe('getRulesByType', () => {
    test('should filter rules by type', () => {
      const formatRules = ruleLoader.getRulesByType('format', testRulesPath);
      expect(formatRules.every(r => r.rule_type === 'format')).toBe(true);
    });

    test('should handle invalid types', () => {
      const rules = ruleLoader.getRulesByType('invalid', testRulesPath);
      expect(rules).toEqual([]);
    });
  });

  describe('clearCache', () => {
    test('should clear cached rules', () => {
      ruleLoader.loadRules(testRulesPath);
      expect(ruleLoader.rulesCache).toBeDefined();
      ruleLoader.clearCache();
      expect(ruleLoader.rulesCache).toBeNull();
    });
  });
});
