/**
 * Unit tests for Performance domain variant
 * Validates that Performance variant contains required items and covers key performance dimensions
 */

const fs = require('fs');
const path = require('path');

const PERFORMANCE_VARIANT_PATH = path.join(__dirname, '../../checklist-variants/performance.md');

describe('Performance Requirements Quality Variant', () => {
  let variantContent;

  beforeAll(() => {
    variantContent = fs.readFileSync(PERFORMANCE_VARIANT_PATH, 'utf-8');
  });

  describe('Item Count and Structure', () => {
    it('should have at least 15 Performance-specific items', () => {
      const itemMatches = variantContent.match(/\*\*CHK-\d+-Performance-/g) || [];
      expect(itemMatches.length).toBeGreaterThanOrEqual(15);
    });

    it('should have 18 Performance-specific items per specification', () => {
      const itemMatches = variantContent.match(/\*\*CHK-\d+-Performance-/g) || [];
      expect(itemMatches.length).toBe(18);
    });

    it('should have consistent item ID format CHK-###-Performance-{Dimension}', () => {
      const validIds =
        variantContent.match(
          /\*\*CHK-\d+-Performance-(Completeness|Clarity|Consistency|Measurability|Scenario-Coverage|Edge-Cases|Dependencies|Ambiguities)\*\*/g
        ) || [];
      expect(validIds.length).toBe(18);
    });
  });

  describe('Performance-Specific Content Coverage', () => {
    it('should include response time and latency requirements', () => {
      expect(variantContent).toContain('response');
      expect(variantContent).toContain('latency');
    });

    it('should include throughput and concurrency requirements', () => {
      expect(variantContent).toContain('throughput');
      expect(variantContent).toContain('concurrency');
    });

    it('should include resource utilization and capacity planning', () => {
      expect(variantContent).toContain('resource');
      expect(variantContent).toContain('capacity');
    });

    it('should include caching and optimization strategies', () => {
      expect(variantContent).toContain('cach');
      expect(variantContent).toContain('optimi');
    });

    it('should include database performance and query optimization', () => {
      expect(variantContent).toContain('database');
      expect(variantContent).toContain('query');
    });

    it('should include connection pools and thread management', () => {
      expect(variantContent).toContain('connection');
      expect(variantContent).toContain('pool');
    });

    it('should include load handling and graceful degradation', () => {
      expect(variantContent).toContain('load');
      expect(variantContent).toContain('degrad');
    });

    it('should include monitoring and alerting thresholds', () => {
      expect(variantContent).toContain('monitor');
      expect(variantContent).toContain('alert');
    });

    it('should include cost and resource efficiency metrics', () => {
      expect(variantContent).toContain('cost');
      expect(variantContent).toContain('efficiency');
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

    it('should include guidance on when to use Performance variant', () => {
      expect(variantContent).toContain('When to Use');
      expect(variantContent).toContain('Performance variant');
    });

    it('should reference base template items', () => {
      expect(variantContent).toContain('base template');
      expect(variantContent).toContain('base items');
    });

    it('should document total item count (base + variant)', () => {
      expect(variantContent).toMatch(/~58-63\s+items|58-63\s+items/);
    });
  });

  describe('Performance-Specific Dimensions', () => {
    it('should include completeness items for performance objectives', () => {
      expect(variantContent).toMatch(/CHK-\d+-Performance-Completeness/);
    });

    it('should include clarity items for latency and throughput targets', () => {
      expect(variantContent).toMatch(/CHK-\d+-Performance-Clarity/);
    });

    it('should include consistency items for baseline performance', () => {
      expect(variantContent).toMatch(/CHK-\d+-Performance-Consistency/);
    });

    it('should include measurability items for performance metrics', () => {
      expect(variantContent).toMatch(/CHK-\d+-Performance-Measurability/);
    });

    it('should include scenario coverage for resource utilization', () => {
      expect(variantContent).toMatch(/CHK-\d+-Performance-Scenario-Coverage/);
    });

    it('should include edge cases for traffic spikes and degradation', () => {
      expect(variantContent).toMatch(/CHK-\d+-Performance-Edge-Cases/);
    });

    it('should include dependencies for third-party service SLAs', () => {
      expect(variantContent).toMatch(/CHK-\d+-Performance-Dependencies/);
    });

    it('should include ambiguities for cold-start and test data', () => {
      expect(variantContent).toMatch(/CHK-\d+-Performance-Ambiguities/);
    });
  });

  describe('Performance Metrics and SLAs', () => {
    it('should address response time requirements', () => {
      expect(variantContent).toContain('response');
    });

    it('should address availability and uptime targets', () => {
      expect(variantContent).toContain('availability');
    });

    it('should address error rate and reliability', () => {
      expect(variantContent).toContain('error');
    });
  });
});
