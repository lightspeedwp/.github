/**
 * Unit tests for API domain variant
 * Validates that API variant contains required items and covers key API dimensions
 */

const fs = require('fs');
const path = require('path');

const API_VARIANT_PATH = path.join(__dirname, '../../checklist-variants/api.md');

describe('API Requirements Quality Variant', () => {
  let variantContent;

  beforeAll(() => {
    variantContent = fs.readFileSync(API_VARIANT_PATH, 'utf-8');
  });

  describe('Item Count and Structure', () => {
    it('should have at least 15 API-specific items', () => {
      const itemMatches = variantContent.match(/\*\*CHK-\d+-API-/g) || [];
      expect(itemMatches.length).toBeGreaterThanOrEqual(15);
    });

    it('should have 18 API-specific items per specification', () => {
      const itemMatches = variantContent.match(/\*\*CHK-\d+-API-/g) || [];
      expect(itemMatches.length).toBe(18);
    });

    it('should have consistent item ID format CHK-###-API-{Dimension}', () => {
      const validIds =
        variantContent.match(
          /\*\*CHK-\d+-API-(Completeness|Clarity|Consistency|Measurability|Scenario-Coverage|Edge-Cases|Dependencies|Ambiguities)\*\*/g
        ) || [];
      expect(validIds.length).toBe(18);
    });
  });

  describe('API-Specific Content Coverage', () => {
    it('should include endpoint specification requirements', () => {
      expect(variantContent).toContain('endpoint');
      expect(variantContent).toContain('HTTP');
    });

    it('should include request/response schema documentation', () => {
      expect(variantContent).toContain('schema');
      expect(variantContent).toContain('JSON');
    });

    it('should include error response format guidance', () => {
      expect(variantContent).toContain('error');
      expect(variantContent).toContain('response');
    });

    it('should include rate limiting requirements', () => {
      expect(variantContent).toContain('rate limit');
      expect(variantContent).toContain('throttl');
    });

    it('should include versioning and backwards compatibility', () => {
      expect(variantContent).toContain('versioning');
      expect(variantContent).toContain('backwards');
    });

    it('should include idempotency and retry logic', () => {
      expect(variantContent).toContain('idempotent');
      expect(variantContent).toContain('retry');
    });

    it('should include authentication and authorization mechanisms', () => {
      expect(variantContent).toContain('authentication');
      expect(variantContent).toContain('authorization');
    });

    it('should include pagination and data serialization', () => {
      expect(variantContent).toContain('pagination');
      expect(variantContent).toContain('serializ');
    });

    it('should include API documentation and discoverability', () => {
      expect(variantContent).toContain('documentation');
      expect(variantContent).toContain('OpenAPI');
    });
  });

  describe('Item Quality', () => {
    it('should have Question section for each item', () => {
      const questionMatches = variantContent.match(/\*\*Question\*\*:/g) || [];
      expect(questionMatches.length).toBe(18);
    });

    it('should have Guidance section for each item', () => {
      const guidanceMatches = variantContent.match(/\*\*Guidance\*\*:/g) || [];
      expect(guidanceMatches.length).toBe(18);
    });

    it('should have Success Criteria section for each item', () => {
      const criteriaMatches = variantContent.match(/\*\*Success Criteria\*\*:/g) || [];
      expect(criteriaMatches.length).toBe(18);
    });
  });

  describe('Variant Structure', () => {
    it('should include composition rules', () => {
      expect(variantContent).toContain('Composition Rules');
    });

    it('should include guidance on when to use API variant', () => {
      expect(variantContent).toContain('When to Use');
      expect(variantContent).toContain('API variant');
    });

    it('should reference base template items', () => {
      expect(variantContent).toContain('base template');
      expect(variantContent).toContain('base items');
    });

    it('should document total item count (base + variant)', () => {
      expect(variantContent).toMatch(/~58-63\s+items|58-63\s+items/);
    });
  });

  describe('API-Specific Dimensions', () => {
    it('should include completeness items for API endpoints', () => {
      expect(variantContent).toMatch(/CHK-\d+-API-Completeness/);
    });

    it('should include clarity items for request/response schemas', () => {
      expect(variantContent).toMatch(/CHK-\d+-API-Clarity/);
    });

    it('should include consistency items for versioning', () => {
      expect(variantContent).toMatch(/CHK-\d+-API-Consistency/);
    });

    it('should include measurability items for performance and documentation', () => {
      expect(variantContent).toMatch(/CHK-\d+-API-Measurability/);
    });

    it('should include scenario coverage for authentication and idempotency', () => {
      expect(variantContent).toMatch(/CHK-\d+-API-Scenario-Coverage/);
    });

    it('should include edge cases for timeouts and partial failures', () => {
      expect(variantContent).toMatch(/CHK-\d+-API-Edge-Cases/);
    });

    it('should include dependencies for rate limiting and external services', () => {
      expect(variantContent).toMatch(/CHK-\d+-API-Dependencies/);
    });

    it('should include ambiguities for pagination and data formats', () => {
      expect(variantContent).toMatch(/CHK-\d+-API-Ambiguities/);
    });
  });
});
