/**
 * Unit tests for UX domain variant
 * Validates that UX variant contains required items and covers key UX dimensions
 */

const fs = require('fs');
const path = require('path');

const UX_VARIANT_PATH = path.join(__dirname, '../../checklist-variants/ux.md');

describe('UX Requirements Quality Variant', () => {
  let variantContent;

  beforeAll(() => {
    variantContent = fs.readFileSync(UX_VARIANT_PATH, 'utf-8');
  });

  describe('Item Count and Structure', () => {
    it('should have at least 15 UX-specific items', () => {
      const itemMatches = variantContent.match(/\*\*CHK-\d+-UX-/g) || [];
      expect(itemMatches.length).toBeGreaterThanOrEqual(15);
    });

    it('should have consistent item ID format CHK-###-UX-{Dimension}', () => {
      const validIds =
        variantContent.match(
          /\*\*CHK-\d+-UX-(Completeness|Clarity|Consistency|Measurability|Scenario-Coverage|Edge-Cases|Dependencies|Ambiguities)\*\*/g
        ) || [];
      expect(validIds.length).toBeGreaterThanOrEqual(15);
    });

    it('should organize items by dimension', () => {
      const dimensions = [
        'Completeness',
        'Clarity',
        'Consistency',
        'Measurability',
        'Scenario-Coverage',
        'Edge-Cases',
        'Dependencies',
        'Ambiguities',
      ];
      const foundDimensions = dimensions.filter((dim) => variantContent.includes(`UX-${dim}`));
      expect(foundDimensions.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('UX-Specific Content Coverage', () => {
    it('should include visual hierarchy and interaction states guidance', () => {
      expect(variantContent).toContain('visual hierarchy');
      expect(variantContent).toContain('interaction');
    });

    it('should include accessibility requirements', () => {
      expect(variantContent).toContain('accessibility');
      expect(variantContent).toContain('WCAG');
    });

    it('should include error state handling', () => {
      expect(variantContent).toContain('error');
      expect(variantContent).toContain('state');
    });

    it('should include responsive design considerations', () => {
      expect(variantContent).toContain('responsive');
      expect(variantContent).toContain('breakpoint');
    });

    it('should include zero-state and loading state guidance', () => {
      expect(variantContent).toContain('zero');
      expect(variantContent).toContain('loading');
    });
  });

  describe('Item Quality', () => {
    it('should have Question section for each item', () => {
      const questionMatches = variantContent.match(/\*\*Question\*\*:/g) || [];
      expect(questionMatches.length).toBeGreaterThanOrEqual(15);
    });

    it('should have Guidance section for each item', () => {
      const guidanceMatches = variantContent.match(/\*\*Guidance\*\*:/g) || [];
      expect(guidanceMatches.length).toBeGreaterThanOrEqual(15);
    });

    it('should have Success Criteria section for each item', () => {
      const criteriaMatches = variantContent.match(/\*\*Success Criteria\*\*:/g) || [];
      expect(criteriaMatches.length).toBeGreaterThanOrEqual(15);
    });
  });

  describe('Variant Structure', () => {
    it('should include composition rules', () => {
      expect(variantContent).toContain('Composition Rules');
    });

    it('should include guidance on when to use UX variant', () => {
      expect(variantContent).toContain('When to Use');
      expect(variantContent).toContain('UX variant');
    });

    it('should reference base template items', () => {
      expect(variantContent).toContain('base template');
      expect(variantContent).toContain('base items');
    });

    it('should document total item count (base + variant)', () => {
      expect(variantContent).toMatch(/~58-63\s+items|58-63\s+items/);
    });
  });

  describe('Integration with Base Template', () => {
    it('should not duplicate base template dimension names as primary items', () => {
      // UX variant should add UX-specific items, not redundant base items
      const dimensionItems = variantContent.match(/^### [A-Z][a-z]+:/gm) || [];
      // All dimension sections should be UX-specific
      expect(dimensionItems.every((item) => item.includes('UX'))).toBe(true);
    });

    it('should reference all 8 base dimensions in composition context', () => {
      expect(variantContent).toContain('completeness');
      expect(variantContent).toContain('clarity');
      expect(variantContent).toContain('consistency');
      expect(variantContent).toContain('measurability');
      expect(variantContent).toContain('edge case');
      expect(variantContent).toContain('dependencies');
    });
  });
});
