/**
 * Tests for ID Sequencing
 * T047: Unit test for ID sequencing
 */

const { sequenceIds, validateIdSequence, getNextId } = require('../../lib/id-sequencer.cjs');

describe('ID Sequencing', () => {
  const itemsWithoutIds = [
    { question: 'Item 1', dimension: 'Completeness' },
    { question: 'Item 2', dimension: 'Clarity' },
    { question: 'Item 3', dimension: 'Completeness' },
  ];

  const itemsWithGaps = [
    { id: 'CHK-001-Completeness', question: 'Item 1', dimension: 'Completeness' },
    { id: 'CHK-003-Clarity', question: 'Item 2', dimension: 'Clarity' },
    { id: 'CHK-005-Completeness', question: 'Item 3', dimension: 'Completeness' },
  ];

  const itemsWithWrongIds = [
    { id: 'ITEM-001', question: 'Item 1', dimension: 'Completeness' },
    { id: 'ITEM-002', question: 'Item 2', dimension: 'Clarity' },
  ];

  describe('sequenceIds', () => {
    it('should assign sequential IDs to items without IDs', () => {
      const result = sequenceIds(itemsWithoutIds);

      expect(result[0].id).toBe('CHK-001-Completeness');
      expect(result[1].id).toBe('CHK-002-Clarity');
      expect(result[2].id).toBe('CHK-003-Completeness');
    });

    it('should maintain ID format CHK-###-Dimension', () => {
      const result = sequenceIds(itemsWithoutIds);

      result.forEach((item) => {
        expect(item.id).toMatch(/^CHK-\d{3}-\w+$/);
      });
    });

    it('should fix gaps in existing IDs', () => {
      const result = sequenceIds(itemsWithGaps);

      expect(result[0].id).toBe('CHK-001-Completeness');
      expect(result[1].id).toBe('CHK-002-Clarity');
      expect(result[2].id).toBe('CHK-003-Completeness');
    });

    it('should handle mixed items with and without IDs', () => {
      const mixed = [
        { id: 'CHK-001-Completeness', question: 'Item 1', dimension: 'Completeness' },
        { question: 'Item 2', dimension: 'Clarity' },
        { question: 'Item 3', dimension: 'Completeness' },
      ];

      const result = sequenceIds(mixed);

      expect(result[0].id).toBe('CHK-001-Completeness');
      expect(result[1].id).toBe('CHK-002-Clarity');
      expect(result[2].id).toBe('CHK-003-Completeness');
    });

    it('should fix incorrect ID formats', () => {
      const result = sequenceIds(itemsWithWrongIds);

      expect(result[0].id).toBe('CHK-001-Completeness');
      expect(result[1].id).toBe('CHK-002-Clarity');
    });

    it('should preserve other item properties', () => {
      const itemsWithProperties = [
        {
          question: 'Item 1',
          dimension: 'Completeness',
          guidance: 'Test guidance',
          priority: 'high',
        },
      ];

      const result = sequenceIds(itemsWithProperties);

      expect(result[0].guidance).toBe('Test guidance');
      expect(result[0].priority).toBe('high');
    });

    it('should handle empty item array', () => {
      const result = sequenceIds([]);

      expect(result).toEqual([]);
    });
  });

  describe('validateIdSequence', () => {
    it('should validate properly sequenced IDs', () => {
      const validItems = [
        { id: 'CHK-001-Completeness', dimension: 'Completeness' },
        { id: 'CHK-002-Clarity', dimension: 'Clarity' },
        { id: 'CHK-003-Consistency', dimension: 'Consistency' },
      ];

      const result = validateIdSequence(validItems);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect gaps in sequence', () => {
      const gappedItems = [
        { id: 'CHK-001-Completeness', dimension: 'Completeness' },
        { id: 'CHK-003-Clarity', dimension: 'Clarity' },
      ];

      const result = validateIdSequence(gappedItems);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('gap'))).toBe(true);
    });

    it('should detect duplicate IDs', () => {
      const duplicateItems = [
        { id: 'CHK-001-Completeness', dimension: 'Completeness' },
        { id: 'CHK-001-Completeness', dimension: 'Completeness' },
      ];

      const result = validateIdSequence(duplicateItems);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('duplicate'))).toBe(true);
    });

    it('should detect incorrect ID format', () => {
      const badFormatItems = [
        { id: 'INVALID-001', dimension: 'Completeness' },
        { id: 'CHK-002-Clarity', dimension: 'Clarity' },
      ];

      const result = validateIdSequence(badFormatItems);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('format'))).toBe(true);
    });

    it('should warn about dimension-ID mismatch', () => {
      const mismatchItems = [{ id: 'CHK-001-Completeness', dimension: 'Clarity' }];

      const result = validateIdSequence(mismatchItems);

      expect(result.warnings).toBeDefined();
      expect(result.warnings.some((w) => w.includes('mismatch'))).toBe(true);
    });

    it('should handle empty array', () => {
      const result = validateIdSequence([]);

      expect(result.isValid).toBe(true);
    });
  });

  describe('getNextId', () => {
    it('should return next sequential ID', () => {
      const items = [
        { id: 'CHK-001-Completeness' },
        { id: 'CHK-002-Clarity' },
        { id: 'CHK-003-Consistency' },
      ];

      const nextId = getNextId(items, 'Measurability');

      expect(nextId).toBe('CHK-004-Measurability');
    });

    it('should handle empty item list', () => {
      const nextId = getNextId([], 'Completeness');

      expect(nextId).toBe('CHK-001-Completeness');
    });

    it('should find highest ID and increment', () => {
      const items = [
        { id: 'CHK-005-Completeness' },
        { id: 'CHK-002-Clarity' },
        { id: 'CHK-010-Consistency' },
      ];

      const nextId = getNextId(items, 'Measurability');

      expect(nextId).toBe('CHK-011-Measurability');
    });

    it('should format ID with correct dimension', () => {
      const items = [{ id: 'CHK-001-Completeness' }];

      const nextId = getNextId(items, 'Edge Cases');

      expect(nextId).toMatch(/^CHK-\d{3}-Edge-Cases$/);
    });

    it('should zero-pad ID number', () => {
      const items = Array.from({ length: 99 }, (_, i) => ({
        id: `CHK-${String(i + 1).padStart(3, '0')}-Completeness`,
      }));

      const nextId = getNextId(items, 'Clarity');

      expect(nextId).toBe('CHK-100-Clarity');
    });
  });

  describe('Sequencing workflow', () => {
    it('should sequence then validate', () => {
      const sequenced = sequenceIds(itemsWithoutIds);
      const validation = validateIdSequence(sequenced);

      expect(validation.isValid).toBe(true);
    });

    it('should handle large item sets', () => {
      const largeSet = Array.from({ length: 100 }, (_, i) => ({
        question: `Item ${i + 1}`,
        dimension: i % 8 === 0 ? 'Completeness' : 'Clarity',
      }));

      const sequenced = sequenceIds(largeSet);

      expect(sequenced.length).toBe(100);
      expect(sequenced[0].id).toBe('CHK-001-Completeness');
      expect(sequenced[99].id).toBe('CHK-100-Clarity');
    });
  });

  describe('ID format requirements', () => {
    it('should always use CHK prefix', () => {
      const result = sequenceIds(itemsWithoutIds);

      result.forEach((item) => {
        expect(item.id.startsWith('CHK-')).toBe(true);
      });
    });

    it('should use 3-digit numbering', () => {
      const result = sequenceIds(itemsWithoutIds);

      result.forEach((item) => {
        const match = item.id.match(/CHK-(\d+)-/);
        expect(match[1]).toHaveLength(3);
      });
    });

    it('should include dimension in ID', () => {
      const result = sequenceIds(itemsWithoutIds);

      result.forEach((item) => {
        expect(item.id).toContain(item.dimension.replace(/ /g, '-'));
      });
    });
  });
});
