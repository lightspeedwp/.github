/**
 * Tests for Completeness Calculator
 */

const {
  calculateMetrics,
  determineStatus,
  calculateReport,
  isGoodEnoughToImplement,
} = require('../../lib/completeness-calculator');

describe('Completeness Calculator', () => {
  const baseItems = [
    {
      id: 'CHK-001-Completeness',
      question: 'Are error handling requirements defined?',
      dimension: 'Completeness',
      state: 'checked',
    },
    {
      id: 'CHK-002-Completeness',
      question: 'Are non-functional requirements covered?',
      dimension: 'Completeness',
      state: 'checked',
    },
    {
      id: 'CHK-003-Completeness',
      question: 'Are external dependencies documented?',
      dimension: 'Completeness',
      state: 'unchecked',
    },
  ];

  describe('calculateMetrics', () => {
    it('should calculate metrics for valid items', () => {
      const metrics = calculateMetrics(baseItems);

      expect(metrics.totalItems).toBe(3);
      expect(metrics.checkedItems).toBe(2);
      expect(metrics.uncheckedItems).toBe(1);
      expect(metrics.completionPercent).toBe(67);
    });

    it('should handle empty items array', () => {
      const metrics = calculateMetrics([]);

      expect(metrics.totalItems).toBe(0);
      expect(metrics.checkedItems).toBe(0);
      expect(metrics.completionPercent).toBe(0);
    });

    it('should count gaps and ambiguities', () => {
      const items = [
        { state: 'checked', dimension: 'Completeness', question: 'q', id: 'CHK-001-Completeness' },
        { state: 'gap', dimension: 'Clarity', question: 'q', id: 'CHK-002-Clarity' },
        { state: 'ambiguity', dimension: 'Consistency', question: 'q', id: 'CHK-003-Consistency' },
        {
          state: 'ambiguity-critical',
          dimension: 'Measurability',
          question: 'q',
          id: 'CHK-004-Measurability',
        },
      ];

      const metrics = calculateMetrics(items);

      expect(metrics.gaps).toBe(1);
      expect(metrics.ambiguities).toBe(1);
      expect(metrics.criticalAmbiguities).toBe(1);
    });
  });

  describe('determineStatus', () => {
    it('should return pass for complete checklist', () => {
      const metrics = {
        totalItems: 10,
        checkedItems: 10,
        uncheckedItems: 0,
        gaps: 0,
        ambiguities: 0,
        criticalAmbiguities: 0,
        completionPercent: 100,
      };

      const status = determineStatus(metrics);

      expect(status).toBe('pass');
    });

    it('should return caution for incomplete but acceptable checklist', () => {
      const metrics = {
        totalItems: 10,
        checkedItems: 9,
        uncheckedItems: 1,
        gaps: 1,
        ambiguities: 2,
        criticalAmbiguities: 0,
        completionPercent: 90,
      };

      const status = determineStatus(metrics);

      expect(status).toBe('caution');
    });

    it('should return fail for critical ambiguities', () => {
      const metrics = {
        totalItems: 10,
        checkedItems: 8,
        uncheckedItems: 2,
        gaps: 0,
        ambiguities: 0,
        criticalAmbiguities: 2,
        completionPercent: 80,
      };

      const status = determineStatus(metrics);

      expect(status).toBe('fail');
    });

    it('should return fail for 3+ gaps', () => {
      const metrics = {
        totalItems: 10,
        checkedItems: 8,
        uncheckedItems: 2,
        gaps: 3,
        ambiguities: 0,
        criticalAmbiguities: 0,
        completionPercent: 80,
      };

      const status = determineStatus(metrics);

      expect(status).toBe('fail');
    });

    it('should return empty for no items', () => {
      const metrics = {
        totalItems: 0,
        checkedItems: 0,
        uncheckedItems: 0,
        gaps: 0,
        ambiguities: 0,
        criticalAmbiguities: 0,
        completionPercent: 0,
      };

      const status = determineStatus(metrics);

      expect(status).toBe('empty');
    });
  });

  describe('calculateReport', () => {
    it('should generate report for valid checklist', () => {
      const items = Array(10)
        .fill(null)
        .map((_, i) => ({
          id: `CHK-${String(i + 1).padStart(3, '0')}-Completeness`,
          question: `Question ${i + 1}`,
          dimension: 'Completeness',
          state: i < 8 ? 'checked' : 'unchecked',
        }));

      const report = calculateReport(items);

      expect(report.status).toBe('caution');
      expect(report.warnings.length).toBeGreaterThan(0);
      expect(report.canProceed).toBe(true);
    });

    it('should identify blocking issues', () => {
      const items = [
        {
          id: 'CHK-001-Completeness',
          question: 'Question',
          dimension: 'Completeness',
          state: 'ambiguity-critical',
        },
        {
          id: 'CHK-002-Completeness',
          question: 'Question',
          dimension: 'Completeness',
          state: 'gap',
        },
        {
          id: 'CHK-003-Completeness',
          question: 'Question',
          dimension: 'Completeness',
          state: 'gap',
        },
      ];

      const report = calculateReport(items);

      expect(report.blockingIssues.length).toBeGreaterThan(0);
      expect(report.needsReview).toBe(true);
    });
  });

  describe('isGoodEnoughToImplement', () => {
    it('should approve complete specification', () => {
      const items = Array(45)
        .fill(null)
        .map((_, i) => ({
          id: `CHK-${String(i + 1).padStart(3, '0')}-Completeness`,
          question: `Question ${i + 1}`,
          dimension: 'Completeness',
          state: 'checked',
        }));

      const approval = isGoodEnoughToImplement(items);

      expect(approval.approved).toBe(true);
      expect(approval.blocked).toBe(false);
    });

    it('should require acknowledgement for caution status', () => {
      const items = Array(45)
        .fill(null)
        .map((_, i) => ({
          id: `CHK-${String(i + 1).padStart(3, '0')}-Completeness`,
          question: `Question ${i + 1}`,
          dimension: 'Completeness',
          state: i < 37 ? 'checked' : i < 39 ? 'gap' : 'unchecked',
        }));

      const approval = isGoodEnoughToImplement(items);

      expect(approval.approvedWithCautions).toBe(true);
      expect(approval.rationale.length).toBeGreaterThan(0);
    });

    it('should block specification with critical issues', () => {
      const items = Array(10)
        .fill(null)
        .map((_, i) => ({
          id: `CHK-${String(i + 1).padStart(3, '0')}-Completeness`,
          question: `Question ${i + 1}`,
          dimension: 'Completeness',
          state: i < 5 ? 'ambiguity-critical' : i < 7 ? 'gap' : 'unchecked',
        }));

      const approval = isGoodEnoughToImplement(items);

      expect(approval.blocked).toBe(true);
      expect(approval.rationale.length).toBeGreaterThan(0);
    });
  });
});
