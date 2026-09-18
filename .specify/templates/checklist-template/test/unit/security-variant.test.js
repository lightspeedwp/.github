/**
 * Unit tests for Security domain variant
 * Validates that Security variant contains required items and covers key security dimensions
 */

const fs = require('fs');
const path = require('path');

const SECURITY_VARIANT_PATH = path.join(__dirname, '../../checklist-variants/security.md');

describe('Security Requirements Quality Variant', () => {
  let variantContent;

  beforeAll(() => {
    variantContent = fs.readFileSync(SECURITY_VARIANT_PATH, 'utf-8');
  });

  describe('Item Count and Structure', () => {
    it('should have at least 15 Security-specific items', () => {
      const itemMatches = variantContent.match(/\*\*CHK-\d+-Security-/g) || [];
      expect(itemMatches.length).toBeGreaterThanOrEqual(15);
    });

    it('should have 18 Security-specific items per specification', () => {
      const itemMatches = variantContent.match(/\*\*CHK-\d+-Security-/g) || [];
      expect(itemMatches.length).toBe(18);
    });

    it('should have consistent item ID format CHK-###-Security-{Dimension}', () => {
      const validIds =
        variantContent.match(
          /\*\*CHK-\d+-Security-(Completeness|Clarity|Consistency|Measurability|Scenario-Coverage|Edge-Cases|Dependencies|Ambiguities)\*\*/g
        ) || [];
      expect(validIds.length).toBe(18);
    });
  });

  describe('Security-Specific Content Coverage', () => {
    it('should include threat model and attack vector documentation', () => {
      expect(variantContent).toContain('threat');
      expect(variantContent).toContain('attack');
    });

    it('should include data classification requirements', () => {
      expect(variantContent).toContain('data classification');
      expect(variantContent).toContain('sensitive');
    });

    it('should include authentication and credential management', () => {
      expect(variantContent).toContain('authentication');
      expect(variantContent).toContain('credential');
    });

    it('should include encryption and key management', () => {
      expect(variantContent).toContain('encryption');
      expect(variantContent).toContain('key');
    });

    it('should include compliance requirements (GDPR, HIPAA, PCI-DSS)', () => {
      expect(variantContent).toContain('GDPR');
      expect(variantContent).toContain('compliance');
    });

    it('should include security headers and HTTP protections', () => {
      expect(variantContent).toContain('header');
      expect(variantContent).toContain('TLS');
    });

    it('should include vulnerability management and testing', () => {
      expect(variantContent).toContain('vulnerab');
      expect(variantContent).toContain('penetration');
    });

    it('should include access control and authorization', () => {
      expect(variantContent).toContain('access control');
      expect(variantContent).toContain('authorization');
    });

    it('should include incident response and breach notification', () => {
      expect(variantContent).toContain('incident');
      expect(variantContent).toContain('breach');
    });

    it('should include third-party vendor assessment', () => {
      expect(variantContent).toContain('vendor');
      expect(variantContent).toContain('third-party');
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

    it('should include guidance on when to use Security variant', () => {
      expect(variantContent).toContain('When to Use');
      expect(variantContent).toContain('Security variant');
    });

    it('should reference base template items', () => {
      expect(variantContent).toContain('base template');
      expect(variantContent).toContain('base items');
    });

    it('should document total item count (base + variant)', () => {
      expect(variantContent).toMatch(/~58-63\s+items|58-63\s+items/);
    });
  });

  describe('Security-Specific Dimensions', () => {
    it('should include completeness items for threat modeling', () => {
      expect(variantContent).toMatch(/CHK-\d+-Security-Completeness/);
    });

    it('should include clarity items for data classification', () => {
      expect(variantContent).toMatch(/CHK-\d+-Security-Clarity/);
    });

    it('should include consistency items for compliance alignment', () => {
      expect(variantContent).toMatch(/CHK-\d+-Security-Consistency/);
    });

    it('should include measurability items for security testing', () => {
      expect(variantContent).toMatch(/CHK-\d+-Security-Measurability/);
    });

    it('should include scenario coverage for incident response', () => {
      expect(variantContent).toMatch(/CHK-\d+-Security-Scenario-Coverage/);
    });

    it('should include edge cases for supply chain risk', () => {
      expect(variantContent).toMatch(/CHK-\d+-Security-Edge-Cases/);
    });

    it('should include dependencies for data residency', () => {
      expect(variantContent).toMatch(/CHK-\d+-Security-Dependencies/);
    });

    it('should include ambiguities for cryptography and monitoring', () => {
      expect(variantContent).toMatch(/CHK-\d+-Security-Ambiguities/);
    });
  });

  describe('Compliance Coverage', () => {
    it('should address GDPR requirements', () => {
      expect(variantContent).toContain('GDPR');
    });

    it('should address data protection and privacy', () => {
      expect(variantContent).toContain('privacy');
    });

    it('should address breach notification requirements', () => {
      expect(variantContent).toContain('notification');
    });
  });
});
