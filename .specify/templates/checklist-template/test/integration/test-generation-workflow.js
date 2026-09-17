/**
 * Integration Tests for Full Checklist Generation Workflow
 * T048: Integration test for full generation workflow
 */

const { generateChecklist, applyVariant } = require('../../lib/generator.cjs');
const { mergeCustomItems } = require('../../lib/custom-merger.cjs');
const { sequenceIds, validateIdSequence } = require('../../lib/id-sequencer.cjs');
const { renderAudienceChecklist } = require('../../lib/audience-generator');
const { checklistValidator } = require('../../lib/checklist-validator.cjs');

describe('Full Checklist Generation Workflow', () => {
  describe('Base Checklist Generation', () => {
    it('should generate base checklist with all required properties', () => {
      const base = generateChecklist({
        items: [
          { question: 'Item 1', dimension: 'Completeness' },
          { question: 'Item 2', dimension: 'Clarity' },
        ],
        metadata: { title: 'Test' },
      });

      expect(base).toBeDefined();
      expect(base.items).toBeDefined();
      expect(base.items.length).toBe(2);
      expect(base.metadata.generatedAt).toBeDefined();
    });

    it('should validate generated base checklist', () => {
      const base = generateChecklist({
        items: [
          { id: 'CHK-001-Completeness', question: 'Item 1', dimension: 'Completeness' },
          { id: 'CHK-002-Clarity', question: 'Item 2', dimension: 'Clarity' },
        ],
      });

      const validation = checklistValidator(base);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Variant Application Workflow', () => {
    it('should apply single variant to base checklist', () => {
      const base = generateChecklist({
        items: [{ id: 'CHK-001-Completeness', question: 'Base item', dimension: 'Completeness' }],
      });

      const variant = {
        items: [{ id: 'CHK-046-UX-Completeness', question: 'UX item', dimension: 'Completeness' }],
      };

      const withVariant = applyVariant(base, variant);

      expect(withVariant.items.length).toBe(2);
      expect(withVariant.metadata.domain).toBeUndefined();
    });

    it('should apply multiple variants sequentially', () => {
      const base = generateChecklist({
        items: [{ id: 'CHK-001-Completeness', question: 'Base', dimension: 'Completeness' }],
      });

      const uiVariant = {
        items: [{ id: 'CHK-046-UX-Completeness', question: 'UX', dimension: 'Completeness' }],
      };

      const apiVariant = {
        items: [{ id: 'CHK-047-API-Completeness', question: 'API', dimension: 'Completeness' }],
      };

      let result = applyVariant(base, uiVariant);
      result = applyVariant(result, apiVariant);

      expect(result.items.length).toBe(3);
      expect(result.items.some((i) => i.id === 'CHK-001-Completeness')).toBe(true);
      expect(result.items.some((i) => i.id === 'CHK-046-UX-Completeness')).toBe(true);
      expect(result.items.some((i) => i.id === 'CHK-047-API-Completeness')).toBe(true);
    });
  });

  describe('Custom Item Integration Workflow', () => {
    it('should merge custom items with generated checklist', () => {
      const base = generateChecklist({
        items: [
          { id: 'CHK-001-Completeness', question: 'Base 1', dimension: 'Completeness' },
          { id: 'CHK-002-Clarity', question: 'Base 2', dimension: 'Clarity' },
        ],
      });

      const custom = [
        { id: 'CHK-101-Custom-Completeness', question: 'Custom 1', dimension: 'Completeness' },
        { id: 'CHK-102-Custom-Clarity', question: 'Custom 2', dimension: 'Clarity' },
      ];

      const result = mergeCustomItems(base, custom);

      expect(result.items.length).toBe(4);
      expect(result.stats.baseItemCount).toBe(2);
      expect(result.stats.customItemCount).toBe(2);
    });

    it('should deduplicate when custom items overlap with base', () => {
      const base = generateChecklist({
        items: [{ id: 'CHK-001-Completeness', question: 'Base 1', dimension: 'Completeness' }],
      });

      const customWithDuplicate = [
        { id: 'CHK-001-Completeness', question: 'Override', dimension: 'Completeness' },
      ];

      const result = mergeCustomItems(base, customWithDuplicate);

      // Should deduplicate
      expect(result.items.filter((i) => i.id === 'CHK-001-Completeness')).toHaveLength(1);
    });
  });

  describe('ID Sequencing in Generation', () => {
    it('should sequence IDs after applying variants and custom items', () => {
      const unsequenced = {
        items: [
          { question: 'Item 1', dimension: 'Completeness' },
          { question: 'Item 2', dimension: 'Clarity' },
          { question: 'Item 3', dimension: 'Consistency' },
        ],
      };

      const sequenced = sequenceIds(unsequenced.items);

      expect(sequenced[0].id).toBe('CHK-001-Completeness');
      expect(sequenced[1].id).toBe('CHK-002-Clarity');
      expect(sequenced[2].id).toBe('CHK-003-Consistency');
    });

    it('should resequence after merging custom items', () => {
      const base = {
        items: [
          { id: 'CHK-001-Completeness', question: 'Base 1', dimension: 'Completeness' },
          { id: 'CHK-003-Clarity', question: 'Base 2', dimension: 'Clarity' },
        ],
      };

      const merged = mergeCustomItems(base, []);
      const resequenced = sequenceIds(merged.items);

      expect(resequenced[0].id).toBe('CHK-001-Completeness');
      expect(resequenced[1].id).toBe('CHK-002-Clarity');
    });

    it('should validate ID sequence after full workflow', () => {
      const base = generateChecklist({
        items: [{ question: 'Item', dimension: 'Completeness' }],
      });

      const sequenced = sequenceIds(base.items);
      const validation = validateIdSequence(sequenced);

      expect(validation.isValid).toBe(true);
    });
  });

  describe('Audience Rendering in Workflow', () => {
    it('should render checklist for author audience', () => {
      const base = generateChecklist({
        items: [{ id: 'CHK-001-Completeness', question: 'Item 1', dimension: 'Completeness' }],
      });

      const authorChecklist = renderAudienceChecklist(base, 'author');

      expect(authorChecklist.audience).toBe('author');
      expect(authorChecklist.guidance).toBeDefined();
      expect(authorChecklist.estimatedTime).toBe(30);
    });

    it('should render checklist for peer audience', () => {
      const base = generateChecklist({
        items: [{ id: 'CHK-001-Completeness', question: 'Item 1', dimension: 'Completeness' }],
      });

      const peerChecklist = renderAudienceChecklist(base, 'peer');

      expect(peerChecklist.audience).toBe('peer');
      expect(peerChecklist.prioritized).toBeDefined();
      expect(peerChecklist.estimatedTime).toBe(45);
    });

    it('should render checklist for stakeholder audience', () => {
      const base = generateChecklist({
        items: [{ id: 'CHK-001-Completeness', question: 'Item 1', dimension: 'Completeness' }],
      });

      const stakeholderChecklist = renderAudienceChecklist(base, 'stakeholder');

      expect(stakeholderChecklist.audience).toBe('stakeholder');
      expect(stakeholderChecklist.decision).toBeDefined();
      expect(stakeholderChecklist.estimatedTime).toBe(15);
    });
  });

  describe('Complete Workflow: End-to-End', () => {
    it('should execute complete workflow: base → variants → custom → sequence → validate → render', () => {
      // 1. Generate base
      const base = generateChecklist({
        items: [
          { question: 'Requirement 1', dimension: 'Completeness' },
          { question: 'Requirement 2', dimension: 'Clarity' },
        ],
      });

      // 2. Apply variant
      const withVariant = applyVariant(base, {
        items: [{ question: 'UX requirement', dimension: 'Completeness' }],
      });

      // 3. Merge custom items
      const withCustom = mergeCustomItems(withVariant, [
        { question: 'Organization-specific item', dimension: 'Consistency' },
      ]);

      // 4. Sequence IDs
      const sequenced = sequenceIds(withCustom.items);

      // 5. Validate
      const validation = validateIdSequence(sequenced);
      expect(validation.isValid).toBe(true);

      // 6. Render for author
      const checklist = { ...withCustom, items: sequenced };
      const forAuthor = renderAudienceChecklist(checklist, 'author');

      expect(forAuthor.items.length).toBe(3);
      expect(forAuthor.audience).toBe('author');
      expect(forAuthor.guidance).toBeDefined();
    });

    it('should maintain data integrity through workflow', () => {
      const base = generateChecklist({
        items: [
          {
            question: 'Test question',
            dimension: 'Completeness',
            guidance: 'Test guidance',
          },
        ],
      });

      const sequenced = sequenceIds(base.items);
      const rendered = renderAudienceChecklist({ ...base, items: sequenced }, 'author');

      const item = rendered.items[0];
      expect(item.question).toBe('Test question');
      expect(item.dimension).toBe('Completeness');
      expect(item.guidance).toBe('Test guidance');
    });
  });

  describe('Error handling in workflow', () => {
    it('should handle invalid items gracefully', () => {
      const invalid = {
        items: [{ question: 'Missing dimension' }],
      };

      expect(() => generateChecklist(invalid)).not.toThrow();
    });

    it('should recover from duplicate detection', () => {
      const base = generateChecklist({
        items: [{ id: 'CHK-001-Completeness', question: 'Item', dimension: 'Completeness' }],
      });

      const duplicate = mergeCustomItems(base, [
        { id: 'CHK-001-Completeness', question: 'Different', dimension: 'Completeness' },
      ]);

      // Should have deduped
      expect(duplicate.items.filter((i) => i.id === 'CHK-001-Completeness')).toHaveLength(1);
    });
  });

  describe('Workflow performance', () => {
    it('should complete workflow for 50-item checklist in reasonable time', () => {
      const start = Date.now();

      const base = generateChecklist({
        items: Array.from({ length: 50 }, (_, i) => ({
          question: `Item ${i + 1}`,
          dimension: i % 8 === 0 ? 'Completeness' : 'Clarity',
        })),
      });

      const sequenced = sequenceIds(base.items);
      const rendered = renderAudienceChecklist({ ...base, items: sequenced }, 'author');

      const elapsed = Date.now() - start;

      expect(rendered.items.length).toBe(50);
      expect(elapsed).toBeLessThan(1000); // Should complete in <1 second
    });
  });
});
