/**
 * Tests for Audience Context Detection
 * T036: Unit test for audience context detection
 */

const {
  detectAudience,
  validateAudience,
  VALID_AUDIENCES,
  getAudienceContext,
} = require('../../lib/audience-detector');

describe('Audience Context Detection', () => {
  describe('detectAudience', () => {
    it('should detect author audience from workflow context', () => {
      const context = {
        workflowStage: 'pre-review',
        actor: 'spec-author',
        timeAlloted: 30,
      };

      const result = detectAudience(context);

      expect(result.audience).toBe('author');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should detect peer reviewer audience', () => {
      const context = {
        workflowStage: 'peer-review',
        actor: 'team-member',
        timeAlloted: 45,
        canApprove: true,
      };

      const result = detectAudience(context);

      expect(result.audience).toBe('peer');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should detect stakeholder audience', () => {
      const context = {
        workflowStage: 'gate-decision',
        actor: 'stakeholder',
        timeAlloted: 15,
        decisionAuthority: true,
      };

      const result = detectAudience(context);

      expect(result.audience).toBe('stakeholder');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should detect integration reviewer audience', () => {
      const context = {
        workflowStage: 'dependency-check',
        actor: 'integration-reviewer',
        checksDependencies: true,
      };

      const result = detectAudience(context);

      expect(result.audience).toBe('integration');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should return ambiguous when detection confidence is low', () => {
      const context = {
        workflowStage: 'unknown',
        actor: 'generic-user',
      };

      const result = detectAudience(context);

      expect(result.audience).toBe('author');
      expect(result.confidence).toBeLessThan(0.6);
    });

    it('should handle empty context gracefully', () => {
      const result = detectAudience({});

      expect(result).toBeDefined();
      expect(result.audience).toBeDefined();
      expect(['author', 'peer', 'stakeholder', 'integration']).toContain(result.audience);
    });
  });

  describe('validateAudience', () => {
    it('should validate known audiences', () => {
      const validAudiences = ['author', 'peer', 'stakeholder', 'integration'];

      validAudiences.forEach((audience) => {
        expect(validateAudience(audience)).toBe(true);
      });
    });

    it('should reject unknown audiences', () => {
      const invalidAudiences = ['manager', 'executive', 'unknown', ''];

      invalidAudiences.forEach((audience) => {
        expect(validateAudience(audience)).toBe(false);
      });
    });
  });

  describe('VALID_AUDIENCES constant', () => {
    it('should define all supported audiences', () => {
      expect(VALID_AUDIENCES).toContain('author');
      expect(VALID_AUDIENCES).toContain('peer');
      expect(VALID_AUDIENCES).toContain('stakeholder');
      expect(VALID_AUDIENCES).toContain('integration');
      expect(VALID_AUDIENCES.length).toBe(4);
    });
  });

  describe('getAudienceContext', () => {
    it('should return author context for author audience', () => {
      const context = getAudienceContext('author');

      expect(context.name).toBe('Author (Pre-Review)');
      expect(context.timeAlloted).toBe(30);
      expect(context.focus).toContain('self-check');
    });

    it('should return peer context for peer audience', () => {
      const context = getAudienceContext('peer');

      expect(context.name).toBe('Peer Reviewer');
      expect(context.timeAlloted).toBe(45);
      expect(context.focus).toContain('feedback');
    });

    it('should return stakeholder context for stakeholder audience', () => {
      const context = getAudienceContext('stakeholder');

      expect(context.name).toBe('Stakeholder (Gate Decision)');
      expect(context.timeAlloted).toBe(15);
      expect(context.focus).toContain('go/no-go');
    });

    it('should return integration context for integration audience', () => {
      const context = getAudienceContext('integration');

      expect(context.name).toBe('Integration Reviewer');
      expect(context.focus).toContain('dependency');
    });

    it('should throw error for invalid audience', () => {
      expect(() => getAudienceContext('invalid')).toThrow();
    });
  });
});
