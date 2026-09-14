const changelogValidator = require('../../includes/changelogValidator.cjs');
const path = require('path');

describe('Changelog Validator - Integration Tests', () => {
  const rulesPath = path.join(__dirname, '../../../../.github/changelog-rules.yml');

  describe('Full validation flow', () => {
    test('should validate a perfect entry', () => {
      const entry = {
        category: 'feature',
        title: 'Add user export functionality',
        description: 'Users can now export their data in CSV format. This allows for better data portability and integration with external tools.',
        pr: '#1234',
        date: '2026-09-14'
      };

      const result = changelogValidator.validate(entry, rulesPath);

      expect(result).toBeDefined();
      expect(result.validation).toBeDefined();
      expect(result.validation.complianceScore).toBeGreaterThanOrEqual(75);
      expect(result.validation.summary.errors).toBe(0);
    });

    test('should detect missing required fields', () => {
      const entry = {
        title: 'Fix something'
      };

      const result = changelogValidator.validate(entry, rulesPath);
      expect(result.validation.summary.errors).toBeGreaterThan(0);
      expect(result.validation.complianceScore).toBeLessThan(75);
    });

    test('should detect implementation details', () => {
      const entry = {
        category: 'fix',
        title: 'Fixed API response handling',
        description: 'Updated the parseJSON() function in responses.js to handle edge cases. Changed regex pattern from /test/g to /test/gi.'
      };

      const result = changelogValidator.validate(entry, rulesPath);
      const failedRules = result.validation.ruleResults.filter(r => r.status === 'failed');
      const hasImplementationDetails = failedRules.some(r => r.ruleId === 'R001' || r.ruleId === 'R007');
      expect(hasImplementationDetails || failedRules.length > 0).toBe(true);
    });

    test('should detect code backticks', () => {
      const entry = {
        category: 'fix',
        title: 'Fixed null pointer issue',
        description: 'Fixed issue in `checkValue()` function where null values caused crashes.'
      };

      const result = changelogValidator.validate(entry, rulesPath);
      const failedRules = result.validation.ruleResults.filter(r => r.status === 'failed');
      expect(failedRules.length).toBeGreaterThan(0);
    });

    test('should detect invalid categories', () => {
      const entry = {
        category: 'invalid-category',
        title: 'Some change',
        description: 'This is a valid description with more than twenty characters.'
      };

      const result = changelogValidator.validate(entry, rulesPath);
      const failedRules = result.validation.ruleResults.filter(r => r.status === 'failed');
      expect(failedRules.some(r => r.ruleId === 'R020')).toBe(true);
    });

    test('should detect personal pronouns', () => {
      const entry = {
        category: 'improvement',
        title: 'We improved the search',
        description: 'We have optimized our search algorithm so you can find things faster.'
      };

      const result = changelogValidator.validate(entry, rulesPath);
      const failedRules = result.validation.ruleResults.filter(r => r.status === 'failed');
      expect(failedRules.length).toBeGreaterThan(0);
    });

    test('should detect marketing hype', () => {
      const entry = {
        category: 'feature',
        title: 'Revolutionary new feature',
        description: 'This amazing and groundbreaking feature will blow your mind with its incredible capabilities.'
      };

      const result = changelogValidator.validate(entry, rulesPath);
      const failedRules = result.validation.ruleResults.filter(r => r.status === 'failed');
      expect(failedRules.length).toBeGreaterThan(0);
    });

    test('should detect TODO comments', () => {
      const entry = {
        category: 'fix',
        title: 'Fix something',
        description: 'Fixed issue. TODO: add more details later. This should be complete.'
      };

      const result = changelogValidator.validate(entry, rulesPath);
      const failedRules = result.validation.ruleResults.filter(r => r.status === 'failed');
      expect(failedRules.some(r => r.ruleId === 'R016')).toBe(true);
    });

    test('should detect invalid dates', () => {
      const entry = {
        category: 'fix',
        title: 'Fix something',
        description: 'This is a valid description with sufficient detail.',
        date: '09/14/2026'
      };

      const result = changelogValidator.validate(entry, rulesPath);
      const failedRules = result.validation.ruleResults.filter(r => r.status === 'failed');
      expect(failedRules.some(r => r.ruleId === 'R015')).toBe(true);
    });

    test('should provide compliance score and status', () => {
      const entry = {
        category: 'feature',
        title: 'Add new export feature',
        description: 'Users can export data in multiple formats for better integration.'
      };

      const result = changelogValidator.validate(entry, rulesPath);
      expect(result.validation.complianceScore).toBeGreaterThanOrEqual(0);
      expect(result.validation.complianceScore).toBeLessThanOrEqual(100);
      expect(['passing', 'warning', 'failing']).toContain(result.validation.complianceStatus);
    });

    test('should include rule results with remediation guidance', () => {
      const entry = {
        category: 'fix',
        title: 'Fixed parsing bug',
        description: 'Fixed the JSON parser which used incorrect regex patterns /test/ to fix it.'
      };

      const result = changelogValidator.validate(entry, rulesPath);
      const failedRules = result.validation.ruleResults.filter(r => r.status === 'failed');

      failedRules.forEach(rule => {
        expect(rule.remediationGuidance).toBeDefined();
        expect(rule.message).toBeDefined();
      });
    });

    test('should track rule execution summary', () => {
      const entry = {
        category: 'feature',
        title: 'Add feature',
        description: 'Feature description here.'
      };

      const result = changelogValidator.validate(entry, rulesPath);
      expect(result.validation.summary).toBeDefined();
      expect(result.validation.summary.totalRulesExecuted).toBeGreaterThan(0);
      expect(result.validation.summary.passed).toBeGreaterThanOrEqual(0);
      expect(result.validation.summary.failed).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Validation layers', () => {
    test('should execute format layer before structure', () => {
      const entry = null;
      const result = changelogValidator.validate(entry, rulesPath);
      const formatFailed = result.validation.ruleResults.filter(
        r => r.ruleId === 'R006' && r.status === 'failed'
      );
      expect(formatFailed.length).toBeGreaterThan(0);
    });

    test('should handle stopOnError option', () => {
      const entry = {
        category: 'invalid',
        title: null,
        description: null
      };

      const result = changelogValidator.validate(entry, rulesPath, { stopOnError: true });
      expect(result.validation.summary.errors).toBeGreaterThan(0);
    });
  });

  describe('Context and metadata', () => {
    test('should track entry context', () => {
      const entry = {
        category: 'feature',
        title: 'Test entry',
        description: 'This is a test entry with sufficient detail for validation.'
      };

      const context = {
        entryId: 'test-123',
        filename: 'test.yml'
      };

      const result = changelogValidator.validate(entry, rulesPath, { context });
      expect(result.metadata.entryId).toBe('test-123');
      expect(result.metadata.filename).toBe('test.yml');
    });

    test('should include timestamp in result', () => {
      const entry = {
        category: 'fix',
        title: 'Fix issue',
        description: 'Fixed a problem in the system.'
      };

      const result = changelogValidator.validate(entry, rulesPath);
      expect(result.metadata.timestamp).toBeDefined();
      expect(new Date(result.metadata.timestamp)).toBeInstanceOf(Date);
    });
  });
});
