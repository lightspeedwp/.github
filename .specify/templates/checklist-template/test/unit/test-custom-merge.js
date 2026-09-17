/**
 * Tests for Custom Item Merging
 * T046: Unit test for custom item merging
 */

const {
  mergeCustomItems,
  deduplicateItems,
  validateCustomItems,
} = require('../../lib/custom-merger');

describe('Custom Item Merging', () => {
  const baseChecklist = {
    items: [
      {
        id: 'CHK-001-Completeness',
        question: 'Are error handling requirements defined?',
        dimension: 'Completeness',
      },
      {
        id: 'CHK-002-Clarity',
        question: 'Are vague terms replaced?',
        dimension: 'Clarity',
      },
    ],
  };

  const customItems = [
    {
      id: 'CHK-101-Custom-Completeness',
      question: 'Custom completeness item',
      dimension: 'Completeness',
    },
    {
      id: 'CHK-102-Custom-Clarity',
      question: 'Custom clarity item',
      dimension: 'Clarity',
    },
  ];

  describe('mergeCustomItems', () => {
    it('should merge custom items with base checklist', () => {
      const result = mergeCustomItems(baseChecklist, customItems);

      expect(result.items.length).toBe(4);
    });

    it('should preserve all base items', () => {
      const result = mergeCustomItems(baseChecklist, customItems);

      expect(result.items.some((item) => item.id === 'CHK-001-Completeness')).toBe(true);
      expect(result.items.some((item) => item.id === 'CHK-002-Clarity')).toBe(true);
    });

    it('should add all custom items', () => {
      const result = mergeCustomItems(baseChecklist, customItems);

      expect(result.items.some((item) => item.id === 'CHK-101-Custom-Completeness')).toBe(true);
      expect(result.items.some((item) => item.id === 'CHK-102-Custom-Clarity')).toBe(true);
    });

    it('should handle empty custom items', () => {
      const result = mergeCustomItems(baseChecklist, []);

      expect(result.items.length).toBe(2);
    });

    it('should handle empty base checklist', () => {
      const emptyBase = { items: [] };
      const result = mergeCustomItems(emptyBase, customItems);

      expect(result.items.length).toBe(2);
    });

    it('should preserve item properties', () => {
      const result = mergeCustomItems(baseChecklist, customItems);

      const customItem = result.items.find((item) => item.id === 'CHK-101-Custom-Completeness');
      expect(customItem.question).toBe('Custom completeness item');
      expect(customItem.dimension).toBe('Completeness');
    });

    it('should mark custom items', () => {
      const result = mergeCustomItems(baseChecklist, customItems);

      const customItem = result.items.find((item) => item.id === 'CHK-101-Custom-Completeness');
      expect(customItem.isCustom).toBe(true);
    });
  });

  describe('deduplicateItems', () => {
    it('should remove duplicate items by ID', () => {
      const itemsWithDuplicates = [
        { id: 'CHK-001-Completeness', question: 'Item 1' },
        { id: 'CHK-002-Clarity', question: 'Item 2' },
        { id: 'CHK-001-Completeness', question: 'Item 1 duplicate' },
      ];

      const result = deduplicateItems(itemsWithDuplicates);

      expect(result.length).toBe(2);
      expect(result.filter((item) => item.id === 'CHK-001-Completeness')).toHaveLength(1);
    });

    it('should keep first occurrence of duplicate', () => {
      const itemsWithDuplicates = [
        { id: 'CHK-001-Completeness', question: 'Original' },
        { id: 'CHK-001-Completeness', question: 'Duplicate' },
      ];

      const result = deduplicateItems(itemsWithDuplicates);

      expect(result[0].question).toBe('Original');
    });

    it('should handle empty array', () => {
      const result = deduplicateItems([]);

      expect(result).toEqual([]);
    });

    it('should handle no duplicates', () => {
      const result = deduplicateItems(baseChecklist.items);

      expect(result.length).toBe(2);
    });

    it('should remove duplicates across merged sets', () => {
      const merged = [...baseChecklist.items, ...customItems];
      const duplicateInBoth = [
        { id: 'CHK-001-Completeness', question: 'Base version' },
        { id: 'CHK-001-Completeness', question: 'Custom version' },
      ];

      const result = deduplicateItems(duplicateInBoth);

      expect(result.length).toBe(1);
    });
  });

  describe('validateCustomItems', () => {
    it('should validate well-formed custom items', () => {
      const result = validateCustomItems(customItems);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject items without ID', () => {
      const invalidItems = [
        {
          question: 'Missing ID',
          dimension: 'Completeness',
        },
      ];

      const result = validateCustomItems(invalidItems);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('id'))).toBe(true);
    });

    it('should reject items without question', () => {
      const invalidItems = [
        {
          id: 'CHK-101-Custom',
          dimension: 'Completeness',
        },
      ];

      const result = validateCustomItems(invalidItems);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('question'))).toBe(true);
    });

    it('should reject items without dimension', () => {
      const invalidItems = [
        {
          id: 'CHK-101-Custom',
          question: 'Custom item',
        },
      ];

      const result = validateCustomItems(invalidItems);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('dimension'))).toBe(true);
    });

    it('should reject invalid dimension', () => {
      const invalidItems = [
        {
          id: 'CHK-101-Custom',
          question: 'Custom item',
          dimension: 'InvalidDimension',
        },
      ];

      const result = validateCustomItems(invalidItems);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('dimension'))).toBe(true);
    });

    it('should warn about IDs that may conflict', () => {
      const conflictingItems = [
        {
          id: 'CHK-001-Completeness',
          question: 'Conflicts with base',
          dimension: 'Completeness',
        },
      ];

      const result = validateCustomItems(conflictingItems);

      expect(result.warnings).toBeDefined();
      expect(result.warnings.some((w) => w.includes('CHK-001'))).toBe(true);
    });

    it('should handle empty array', () => {
      const result = validateCustomItems([]);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Merging workflow', () => {
    it('should merge and deduplicate in sequence', () => {
      const itemsWithDuplicates = [
        ...baseChecklist.items,
        ...customItems,
        {
          id: 'CHK-001-Completeness',
          question: 'Duplicate of base',
          dimension: 'Completeness',
        },
      ];

      const deduplicated = deduplicateItems(itemsWithDuplicates);

      expect(deduplicated.length).toBe(4);
    });

    it('should validate before merging', () => {
      const result = validateCustomItems(customItems);
      expect(result.isValid).toBe(true);

      const merged = mergeCustomItems(baseChecklist, customItems);
      expect(merged.items.length).toBe(4);
    });

    it('should report merge stats', () => {
      const result = mergeCustomItems(baseChecklist, customItems);

      expect(result.stats).toBeDefined();
      expect(result.stats.baseItemCount).toBe(2);
      expect(result.stats.customItemCount).toBe(2);
      expect(result.stats.totalItemCount).toBe(4);
    });
  });

  describe('Edge cases', () => {
    it('should handle custom items with extended properties', () => {
      const richCustomItems = [
        {
          id: 'CHK-101-Custom',
          question: 'Custom item',
          dimension: 'Completeness',
          guidance: 'Custom guidance',
          examples: ['Example 1'],
          references: ['Ref 1'],
        },
      ];

      const result = mergeCustomItems(baseChecklist, richCustomItems);
      const merged = result.items.find((item) => item.id === 'CHK-101-Custom');

      expect(merged.guidance).toBe('Custom guidance');
      expect(merged.examples).toEqual(['Example 1']);
    });

    it('should handle very large custom item sets', () => {
      const largeCustomSet = Array.from({ length: 100 }, (_, i) => ({
        id: `CHK-200-Custom-${i}`,
        question: `Custom item ${i}`,
        dimension: 'Completeness',
      }));

      const result = mergeCustomItems(baseChecklist, largeCustomSet);

      expect(result.items.length).toBe(102);
    });
  });
});
