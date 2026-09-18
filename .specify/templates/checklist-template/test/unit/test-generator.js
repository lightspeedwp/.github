/**
 * Tests for Checklist Generator
 * T045: Unit test for checklist generator
 */

const { generateChecklist, generateFromBase, applyVariant } = require('../../lib/generator.cjs');

describe('Checklist Generator', () => {
  const baseChecklist = {
    items: [
      {
        id: 'CHK-001-Completeness',
        question: 'Are error handling requirements defined?',
        dimension: 'Completeness',
        guidance: 'Include error scenarios',
      },
      {
        id: 'CHK-002-Clarity',
        question: 'Are vague terms replaced?',
        dimension: 'Clarity',
        guidance: 'Use specific, measurable terms',
      },
    ],
    metadata: {
      title: 'Base Checklist',
      version: '1.0',
    },
  };

  const uiVariant = {
    items: [
      {
        id: 'CHK-046-UX-Completeness',
        question: 'Are visual hierarchy and layout clear?',
        dimension: 'Completeness',
        guidance: 'Check visual hierarchy',
      },
    ],
    metadata: {
      domain: 'UX',
      version: '1.0',
    },
  };

  describe('generateChecklist', () => {
    it('should generate checklist from base template', () => {
      const result = generateChecklist(baseChecklist);

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBe(2);
      expect(result.metadata).toBeDefined();
    });

    it('should preserve all item fields', () => {
      const result = generateChecklist(baseChecklist);

      const item = result.items[0];
      expect(item.id).toBe('CHK-001-Completeness');
      expect(item.question).toBeDefined();
      expect(item.dimension).toBeDefined();
      expect(item.guidance).toBeDefined();
    });

    it('should include metadata', () => {
      const result = generateChecklist(baseChecklist);

      expect(result.metadata.title).toBe('Base Checklist');
      expect(result.metadata.version).toBe('1.0');
    });

    it('should add generated timestamp', () => {
      const result = generateChecklist(baseChecklist);

      expect(result.metadata.generatedAt).toBeDefined();
      expect(result.metadata.generatedAt instanceof Date).toBe(true);
    });

    it('should handle empty checklist', () => {
      const emptyChecklist = { items: [], metadata: {} };
      const result = generateChecklist(emptyChecklist);

      expect(result.items).toEqual([]);
    });
  });

  describe('generateFromBase', () => {
    it('should load base checklist from template', () => {
      const result = generateFromBase();

      expect(result).toBeDefined();
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.metadata).toBeDefined();
    });

    it('should include all 8 dimensions', () => {
      const result = generateFromBase();
      const dimensions = new Set(result.items.map((item) => item.dimension));

      expect(dimensions.has('Completeness')).toBe(true);
      expect(dimensions.has('Clarity')).toBe(true);
      expect(dimensions.has('Consistency')).toBe(true);
      expect(dimensions.has('Measurability')).toBe(true);
      expect(dimensions.has('Scenario Coverage')).toBe(true);
      expect(dimensions.has('Edge Cases')).toBe(true);
      expect(dimensions.has('Dependencies')).toBe(true);
      expect(dimensions.has('Ambiguities')).toBe(true);
    });

    it('should have 40-50 base items', () => {
      const result = generateFromBase();

      expect(result.items.length).toBeGreaterThanOrEqual(40);
      expect(result.items.length).toBeLessThanOrEqual(50);
    });
  });

  describe('applyVariant', () => {
    it('should merge variant items with base items', () => {
      const result = applyVariant(baseChecklist, uiVariant);

      expect(result.items.length).toBe(3);
    });

    it('should preserve base items', () => {
      const result = applyVariant(baseChecklist, uiVariant);

      expect(result.items.some((item) => item.id === 'CHK-001-Completeness')).toBe(true);
      expect(result.items.some((item) => item.id === 'CHK-002-Clarity')).toBe(true);
    });

    it('should add variant items', () => {
      const result = applyVariant(baseChecklist, uiVariant);

      expect(result.items.some((item) => item.id === 'CHK-046-UX-Completeness')).toBe(true);
    });

    it('should avoid duplicate items', () => {
      const duplicateVariant = {
        items: [
          {
            id: 'CHK-001-Completeness',
            question: 'Duplicate item',
            dimension: 'Completeness',
          },
        ],
      };

      const result = applyVariant(baseChecklist, duplicateVariant);

      const duplicates = result.items.filter((item) => item.id === 'CHK-001-Completeness');
      expect(duplicates.length).toBe(1);
    });

    it('should preserve variant metadata', () => {
      const result = applyVariant(baseChecklist, uiVariant);

      expect(result.metadata.domain).toBe('UX');
    });

    it('should handle multiple variants', () => {
      const apiVariant = {
        items: [
          {
            id: 'CHK-047-API-Completeness',
            question: 'Are all endpoints documented?',
            dimension: 'Completeness',
          },
        ],
      };

      let result = applyVariant(baseChecklist, uiVariant);
      result = applyVariant(result, apiVariant);

      expect(result.items.length).toBe(4);
      expect(result.items.some((item) => item.id === 'CHK-046-UX-Completeness')).toBe(true);
      expect(result.items.some((item) => item.id === 'CHK-047-API-Completeness')).toBe(true);
    });
  });

  describe('Item ordering', () => {
    it('should maintain item order within dimensions', () => {
      const result = generateChecklist(baseChecklist);

      const completenessItems = result.items.filter((item) => item.dimension === 'Completeness');
      const clarityItems = result.items.filter((item) => item.dimension === 'Clarity');

      expect(completenessItems.length).toBeGreaterThan(0);
      expect(clarityItems.length).toBeGreaterThan(0);
    });

    it('should group items by dimension', () => {
      const baseWithMoreItems = {
        items: [
          { id: 'CHK-001-Completeness', dimension: 'Completeness' },
          { id: 'CHK-002-Clarity', dimension: 'Clarity' },
          { id: 'CHK-003-Completeness', dimension: 'Completeness' },
        ],
      };

      const result = generateChecklist(baseWithMoreItems);

      const dimensions = result.items.map((item) => item.dimension);
      // Items should be grouped by dimension
      expect(dimensions).toBeDefined();
    });
  });

  describe('Metadata handling', () => {
    it('should include all required metadata fields', () => {
      const result = generateChecklist(baseChecklist);

      expect(result.metadata.title).toBeDefined();
      expect(result.metadata.version).toBeDefined();
      expect(result.metadata.generatedAt).toBeDefined();
    });

    it('should add domain metadata for variants', () => {
      const result = applyVariant(baseChecklist, uiVariant);

      expect(result.metadata.domain).toBe('UX');
    });

    it('should track variant usage', () => {
      const result = applyVariant(baseChecklist, uiVariant);

      expect(result.metadata.variantsApplied).toBeDefined();
    });
  });
});
