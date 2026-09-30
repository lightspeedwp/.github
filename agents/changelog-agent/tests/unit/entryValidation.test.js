/**
 * Entry Validation Tests
 * Tests individual validation rules on changelog entries
 */

const validator = require('../../includes/changelogValidator.cjs');
const path = require('path');

const RULES_FILE = path.join(__dirname, '../../../../.github/changelog-rules.yml');

describe('Entry Validation - Individual Rules', () => {
  describe('R001: No Implementation Details', () => {
    test('should fail when entry contains code keywords', () => {
      const entry = {
        category: 'fix',
        title: 'Fixed authentication bug',
        description: 'Resolved issue with const jwt = require("jsonwebtoken") and API responses'
      };

      const result = validator.validate(entry, RULES_FILE);
      expect(result.validation.summary.failed).toBeGreaterThan(0);
    });

    test('should pass when entry has no code patterns', () => {
      const entry = {
        category: 'feature',
        title: 'New user preferences',
        description: 'Users can now customize their dashboard theme and notification settings'
      };

      const result = validator.validate(entry, RULES_FILE);
      const r001 = result.validation.ruleResults?.find(r => r.ruleId === 'R001');
      expect(r001?.status).toBe('passed');
    });
  });

  describe('R002: Has Category', () => {
    test('should fail when category is missing', () => {
      const entry = {
        title: 'Some change',
        description: 'This is a change'
      };

      const result = validator.validate(entry, RULES_FILE);
      const r002 = result.validation.ruleResults?.find(r => r.ruleId === 'R002');
      expect(r002?.status).toBe('failed');
    });

    test('should pass when category is present', () => {
      const entry = {
        category: 'feature',
        title: 'New dashboard',
        description: 'Added dashboard view for analytics'
      };

      const result = validator.validate(entry, RULES_FILE);
      const r002 = result.validation.ruleResults?.find(r => r.ruleId === 'R002');
      expect(r002?.status).toBe('passed');
    });
  });

  describe('R003: Has Title', () => {
    test('should fail when title is missing', () => {
      const entry = {
        category: 'fix',
        description: 'This is a fix'
      };

      const result = validator.validate(entry, RULES_FILE);
      const r003 = result.validation.ruleResults?.find(r => r.ruleId === 'R003');
      expect(r003?.status).toBe('failed');
    });

    test('should pass when title is present', () => {
      const entry = {
        category: 'fix',
        title: 'Fixed login timeout',
        description: 'Users no longer get logged out during active sessions'
      };

      const result = validator.validate(entry, RULES_FILE);
      const r003 = result.validation.ruleResults?.find(r => r.ruleId === 'R003');
      expect(r003?.status).toBe('passed');
    });
  });

  describe('R004: Has Description', () => {
    test('should fail when description is missing', () => {
      const entry = {
        category: 'feature',
        title: 'New feature'
      };

      const result = validator.validate(entry, RULES_FILE);
      const r004 = result.validation.ruleResults?.find(r => r.ruleId === 'R004');
      expect(r004?.status).toBe('failed');
    });
  });

  describe('R006: Proper Formatting', () => {
    test('should pass for valid object', () => {
      const entry = {
        category: 'feature',
        title: 'Test',
        description: 'Test description'
      };

      const result = validator.validate(entry, RULES_FILE);
      const r006 = result.validation.ruleResults?.find(r => r.ruleId === 'R006');
      expect(r006?.status).toBe('passed');
    });

    test('should fail for null or invalid input', () => {
      const result = validator.validate(null, RULES_FILE);
      const r006 = result.validation.ruleResults?.find(r => r.ruleId === 'R006');
      expect(r006?.status).toBe('failed');
    });
  });

  describe('R007: No Backticks', () => {
    test('should fail when entry contains backticks', () => {
      const entry = {
        category: 'fix',
        title: 'Fixed `parseJSON` error',
        description: 'The `parseJSON()` function now handles edge cases correctly'
      };

      const result = validator.validate(entry, RULES_FILE);
      const r007 = result.validation.ruleResults?.find(r => r.ruleId === 'R007');
      expect(r007?.status).toBe('failed');
    });

    test('should pass without backticks', () => {
      const entry = {
        category: 'feature',
        title: 'Improved error handling',
        description: 'Better error messages when operations fail'
      };

      const result = validator.validate(entry, RULES_FILE);
      const r007 = result.validation.ruleResults?.find(r => r.ruleId === 'R007');
      expect(r007?.status).toBe('passed');
    });
  });

  describe('R011: Meaningful Description', () => {
    test('should fail when description is too short', () => {
      const entry = {
        category: 'fix',
        title: 'Fixed bug',
        description: 'Short fix'
      };

      const result = validator.validate(entry, RULES_FILE);
      const r011 = result.validation.ruleResults?.find(r => r.ruleId === 'R011');
      expect(r011?.status).toBe('failed');
    });

    test('should pass when description is substantial', () => {
      const entry = {
        category: 'feature',
        title: 'New dashboard',
        description: 'Users can now see detailed analytics and metrics on their personal dashboard'
      };

      const result = validator.validate(entry, RULES_FILE);
      const r011 = result.validation.ruleResults?.find(r => r.ruleId === 'R011');
      expect(r011?.status).toBe('passed');
    });
  });

  describe('R015: Proper Dates (ISO 8601)', () => {
    test('should pass with ISO 8601 date format', () => {
      const entry = {
        category: 'feature',
        title: 'New feature',
        description: 'A new feature',
        date: '2026-09-14'
      };

      const result = validator.validate(entry, RULES_FILE);
      const r015 = result.validation.ruleResults?.find(r => r.ruleId === 'R015');
      expect(r015?.status).toBe('passed');
    });

    test('should fail with incorrect date format', () => {
      const entry = {
        category: 'feature',
        title: 'New feature',
        description: 'A new feature',
        date: '09-14-2026'
      };

      const result = validator.validate(entry, RULES_FILE);
      const r015 = result.validation.ruleResults?.find(r => r.ruleId === 'R015');
      expect(r015?.status).toBe('failed');
    });
  });

  describe('R020: Valid Category', () => {
    test('should pass with valid categories', () => {
      const validCategories = ['feature', 'fix', 'improvement', 'breaking-change', 'security', 'performance'];

      validCategories.forEach(category => {
        const entry = {
          category,
          title: 'Test',
          description: 'Test description'
        };

        const result = validator.validate(entry, RULES_FILE);
        const r020 = result.validation.ruleResults?.find(r => r.ruleId === 'R020');
        expect(r020?.status).toBe('passed');
      });
    });

    test('should fail with invalid category', () => {
      const entry = {
        category: 'invalid-category',
        title: 'Test',
        description: 'Test description'
      };

      const result = validator.validate(entry, RULES_FILE);
      const r020 = result.validation.ruleResults?.find(r => r.ruleId === 'R020');
      expect(r020?.status).toBe('failed');
    });
  });
});
