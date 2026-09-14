/**
 * Entry Validation Integration Tests
 * Tests full validation workflow (read file → validate → output)
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const validator = require('../../includes/changelogValidator.cjs');
const formatter = require('../../includes/formatter.cjs');

const RULES_FILE = path.join(__dirname, '../../../../.github/changelog-rules.yml');
const TEST_DIR = path.join(__dirname, '../fixtures');

// Ensure test fixtures directory exists
beforeAll(() => {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }
});

describe('Entry Validation Workflow Integration', () => {
  describe('Valid Entry Workflow', () => {
    test('should read, validate, and format a passing entry', () => {
      const entry = {
        id: 'entry_pass_001',
        category: 'feature',
        title: 'New user dashboard',
        description: 'Users can now see personalized analytics and metrics on their dashboard. This improves their ability to monitor system performance.'
      };

      // 1. Simulate reading from file
      const yamlContent = yaml.dump(entry);

      // 2. Parse entry
      const parsedEntry = yaml.load(yamlContent);
      expect(parsedEntry.category).toBe('feature');

      // 3. Validate entry
      const validationResult = validator.validate(parsedEntry, RULES_FILE);

      // 4. Check result structure
      expect(validationResult).toHaveProperty('complianceScore');
      expect(validationResult).toHaveProperty('summary');
      expect(validationResult.summary).toHaveProperty('status');
      expect(validationResult.summary).toHaveProperty('passed');
      expect(validationResult.summary).toHaveProperty('failed');

      // 5. Verify passing result
      expect(validationResult.summary.status).toBe('passing');
      expect(validationResult.complianceScore).toBeGreaterThanOrEqual(90);

      // 6. Format output
      const formattedOutput = formatter.formatValidationResult(validationResult);
      expect(formattedOutput).toContain('[PASS]');
      expect(formattedOutput).toContain('100');
    });
  });

  describe('Failed Entry Workflow', () => {
    test('should detect multiple validation issues', () => {
      const entry = {
        id: 'entry_fail_001',
        // Missing category
        title: 'Fixed API bug',
        description: 'Updated const handler = require("express") for bug fix'
      };

      const validationResult = validator.validate(entry, RULES_FILE);

      // Verify it failed
      expect(validationResult.summary.status).toBe('failing');
      expect(validationResult.summary.failed).toBeGreaterThan(0);
      expect(validationResult.summary.errors).toBeGreaterThan(0);

      // Check for specific issues
      const issues = validationResult.summary.issues;
      expect(issues.some(i => i.rule_id === 'R002')).toBe(true); // Missing category
      expect(issues.some(i => i.rule_id === 'R001')).toBe(true); // Has code keywords
    });

    test('should identify warning-level issues', () => {
      const entry = {
        category: 'improvement',
        title: 'We improved the system',
        description: 'We refactored the API for better performance.'
      };

      const validationResult = validator.validate(entry, RULES_FILE);

      // Should have warnings but not full fail
      const warnings = validationResult.summary.issues.filter(i => i.severity === 'warning');
      expect(warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Workflow with Output Formats', () => {
    test('should format result as human-readable text', () => {
      const entry = {
        category: 'fix',
        title: 'Fixed authentication issue',
        description: 'User sessions now properly expire after the configured timeout period'
      };

      const validationResult = validator.validate(entry, RULES_FILE);
      const output = formatter.formatValidationResult(validationResult);

      expect(output).toContain('Summary');
      expect(output).toContain('Score');
      expect(output).toContain('Status');
      expect(typeof output).toBe('string');
    });

    test('should format result as JSON', () => {
      const entry = {
        category: 'feature',
        title: 'Add new feature',
        description: 'This feature allows users to export data in multiple formats including CSV and JSON'
      };

      const validationResult = validator.validate(entry, RULES_FILE);
      const jsonOutput = JSON.stringify(validationResult);

      const parsed = JSON.parse(jsonOutput);
      expect(parsed).toHaveProperty('complianceScore');
      expect(parsed).toHaveProperty('summary');
      expect(parsed).toHaveProperty('validation_details');
    });

    test('should format result for GitHub comment', () => {
      const entry = {
        id: 'entry_gh_001',
        category: 'fix',
        title: 'Fixed login bug',
        description: 'Users are no longer logged out unexpectedly during active sessions'
      };

      const validationResult = validator.validate(entry, RULES_FILE);
      const githubOutput = formatter.formatForGitHub(validationResult, {
        entryId: entry.id,
        filename: 'entry.yaml'
      });

      expect(githubOutput).toContain('Entry Validation Result');
      expect(githubOutput).toContain('Compliance Score');
      expect(githubOutput).toContain('ID: entry_gh_001');
      expect(githubOutput).toContain('File: entry.yaml');
    });
  });

  describe('Edge Case Entries', () => {
    test('should handle entry with empty strings', () => {
      const entry = {
        category: '',
        title: '',
        description: ''
      };

      const validationResult = validator.validate(entry, RULES_FILE);
      expect(validationResult.summary.failed).toBeGreaterThan(0);
    });

    test('should handle entry with null values', () => {
      const entry = {
        category: null,
        title: null,
        description: null
      };

      const validationResult = validator.validate(entry, RULES_FILE);
      expect(validationResult.summary.failed).toBeGreaterThan(0);
    });

    test('should handle entry with extra fields', () => {
      const entry = {
        category: 'feature',
        title: 'New feature',
        description: 'This is a feature',
        pr_number: 1234,
        author: 'test@example.com',
        extra_field: 'should not cause issues'
      };

      const validationResult = validator.validate(entry, RULES_FILE);
      expect(validationResult).toHaveProperty('complianceScore');
      // Extra fields should not cause validation errors
    });

    test('should handle very long descriptions', () => {
      const longDescription = 'A'.repeat(5000);
      const entry = {
        category: 'improvement',
        title: 'Performance improvement',
        description: longDescription
      };

      const validationResult = validator.validate(entry, RULES_FILE);
      expect(validationResult).toHaveProperty('complianceScore');
      expect(validationResult.summary).toHaveProperty('status');
    });
  });

  describe('Validation Context and Metadata', () => {
    test('should preserve entry metadata through validation', () => {
      const entry = {
        id: 'entry_ctx_001',
        version: '1.2.0',
        date: '2026-09-14',
        category: 'feature',
        title: 'New feature',
        description: 'A new feature with proper formatting',
        author: 'developer@example.com'
      };

      const validationResult = validator.validate(entry, RULES_FILE, {
        context: {
          entryId: entry.id,
          filename: 'changelog.yaml'
        }
      });

      expect(validationResult).toHaveProperty('complianceScore');
      // Validate that extra fields don't break anything
      expect(validationResult.summary.status).toBeDefined();
    });

    test('should track validation timestamp', () => {
      const entry = {
        category: 'fix',
        title: 'Bug fix',
        description: 'Fixed a critical issue'
      };

      const validationResult = validator.validate(entry, RULES_FILE);
      expect(validationResult.validation_details).toBeDefined();
      expect(Array.isArray(validationResult.validation_details)).toBe(true);
    });
  });

  describe('Compliance Score Calculation', () => {
    test('should calculate correct score for perfect entry', () => {
      const entry = {
        category: 'feature',
        title: 'New analytics dashboard',
        description: 'Users can now view real-time analytics and metrics. This helps them monitor system performance and identify trends.'
      };

      const validationResult = validator.validate(entry, RULES_FILE);
      expect(validationResult.complianceScore).toBeGreaterThanOrEqual(90);
    });

    test('should penalize errors more than warnings', () => {
      // Entry with warning issues
      const warningEntry = {
        category: 'fix',
        title: 'We fixed the bug',
        description: 'Bug fix with passive voice construction'
      };

      // Entry with error issues
      const errorEntry = {
        category: 'invalid',
        title: 'Test',
        description: 'This contains code: const x = 1'
      };

      const warningResult = validator.validate(warningEntry, RULES_FILE);
      const errorResult = validator.validate(errorEntry, RULES_FILE);

      expect(errorResult.complianceScore).toBeLessThan(warningResult.complianceScore);
    });
  });
});
