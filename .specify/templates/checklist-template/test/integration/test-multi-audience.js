/**
 * Integration Tests for Multi-Audience Support
 * T038: Integration test for multi-audience support
 */

const { renderAudienceChecklist } = require('../../lib/audience-generator');
const { detectAudience } = require('../../lib/audience-detector');
const { renderGuidance } = require('../../lib/guidance-renderer');

describe('Multi-Audience Support Integration', () => {
  const sampleChecklist = {
    metadata: {
      title: 'Sample Specification',
      domain: 'api',
    },
    items: [
      {
        id: 'CHK-001-Completeness',
        question: 'Are error handling requirements defined?',
        dimension: 'Completeness',
        state: 'checked',
      },
      {
        id: 'CHK-002-Clarity',
        question: 'Are vague terms replaced?',
        dimension: 'Clarity',
        state: 'unchecked',
      },
      {
        id: 'CHK-003-Consistency',
        question: 'Is terminology consistent?',
        dimension: 'Consistency',
        state: 'checked',
      },
    ],
  };

  describe('Author Pre-Review Workflow', () => {
    it('should generate checklist with author guidance', () => {
      const context = {
        workflowStage: 'pre-review',
        actor: 'spec-author',
      };

      const audience = detectAudience(context);
      const checklist = renderAudienceChecklist(sampleChecklist, audience.audience);

      expect(checklist).toBeDefined();
      expect(checklist.audience).toBe('author');
      expect(checklist.guidance).toBeDefined();
      expect(checklist.guidance.timeEstimate).toBe(30);
    });

    it('should highlight gaps for author review', () => {
      const checklist = renderAudienceChecklist(sampleChecklist, 'author');

      expect(checklist.highlighted).toBeDefined();
      expect(checklist.highlighted.uncheckedCount).toBe(1);
      expect(checklist.highlighted.uncheckedItems).toContain('CHK-002-Clarity');
    });

    it('should provide self-check tips for author', () => {
      const checklist = renderAudienceChecklist(sampleChecklist, 'author');

      expect(checklist.tips).toBeDefined();
      expect(checklist.tips.length).toBeGreaterThan(0);
    });

    it('should estimate completion time for author', () => {
      const checklist = renderAudienceChecklist(sampleChecklist, 'author');

      expect(checklist.estimatedTime).toBeLessThanOrEqual(30);
    });
  });

  describe('Peer Reviewer Workflow', () => {
    it('should generate checklist with peer guidance', () => {
      const context = {
        workflowStage: 'peer-review',
        actor: 'team-member',
        canApprove: true,
      };

      const audience = detectAudience(context);
      const checklist = renderAudienceChecklist(sampleChecklist, audience.audience);

      expect(checklist).toBeDefined();
      expect(checklist.audience).toBe('peer');
      expect(checklist.guidance).toBeDefined();
      expect(checklist.guidance.timeEstimate).toBe(45);
    });

    it('should prioritize failed items for peer review', () => {
      const checklist = renderAudienceChecklist(sampleChecklist, 'peer');

      expect(checklist.prioritized).toBeDefined();
      expect(checklist.prioritized.failedItems).toBeDefined();
      expect(checklist.prioritized.failedItems.length).toBeGreaterThan(0);
    });

    it('should provide feedback guidance for peer', () => {
      const checklist = renderAudienceChecklist(sampleChecklist, 'peer');

      expect(checklist.feedbackGuidance).toBeDefined();
    });

    it('should include verification checklist for peer', () => {
      const checklist = renderAudienceChecklist(sampleChecklist, 'peer');

      expect(checklist.verificationSteps).toBeDefined();
    });
  });

  describe('Stakeholder Gate Decision Workflow', () => {
    it('should generate checklist with stakeholder guidance', () => {
      const context = {
        workflowStage: 'gate-decision',
        actor: 'stakeholder',
        decisionAuthority: true,
      };

      const audience = detectAudience(context);
      const checklist = renderAudienceChecklist(sampleChecklist, audience.audience);

      expect(checklist).toBeDefined();
      expect(checklist.audience).toBe('stakeholder');
      expect(checklist.guidance).toBeDefined();
      expect(checklist.guidance.timeEstimate).toBe(15);
    });

    it('should provide go/no-go decision summary for stakeholder', () => {
      const checklist = renderAudienceChecklist(sampleChecklist, 'stakeholder');

      expect(checklist.decision).toBeDefined();
      expect(checklist.decision).toHaveProperty('recommendation');
      expect(checklist.decision).toHaveProperty('rationale');
    });

    it('should show critical items only for stakeholder', () => {
      const checklist = renderAudienceChecklist(sampleChecklist, 'stakeholder');

      expect(checklist.criticalItems).toBeDefined();
    });

    it('should provide executive summary for stakeholder', () => {
      const checklist = renderAudienceChecklist(sampleChecklist, 'stakeholder');

      expect(checklist.executiveSummary).toBeDefined();
    });
  });

  describe('Integration Reviewer Workflow', () => {
    it('should generate checklist with integration guidance', () => {
      const context = {
        workflowStage: 'dependency-check',
        actor: 'integration-reviewer',
        checksDependencies: true,
      };

      const audience = detectAudience(context);
      const checklist = renderAudienceChecklist(sampleChecklist, audience.audience);

      expect(checklist).toBeDefined();
      expect(checklist.audience).toBe('integration');
      expect(checklist.guidance).toBeDefined();
    });

    it('should verify dependencies for integration reviewer', () => {
      const checklist = renderAudienceChecklist(sampleChecklist, 'integration');

      expect(checklist.dependencyCheck).toBeDefined();
    });

    it('should show cross-project alignment for integration', () => {
      const checklist = renderAudienceChecklist(sampleChecklist, 'integration');

      expect(checklist.crossProjectAlignment).toBeDefined();
    });

    it('should assess parallel work capability for integration', () => {
      const checklist = renderAudienceChecklist(sampleChecklist, 'integration');

      expect(checklist.parallelWorkCapability).toBeDefined();
    });
  });

  describe('Audience Switching', () => {
    it('should switch between audiences cleanly', () => {
      const authorChecklist = renderAudienceChecklist(sampleChecklist, 'author');
      const peerChecklist = renderAudienceChecklist(sampleChecklist, 'peer');

      expect(authorChecklist.audience).toBe('author');
      expect(peerChecklist.audience).toBe('peer');
      expect(authorChecklist.audience).not.toBe(peerChecklist.audience);
    });

    it('should preserve checklist data across audience switches', () => {
      const authorChecklist = renderAudienceChecklist(sampleChecklist, 'author');
      const peerChecklist = renderAudienceChecklist(sampleChecklist, 'peer');

      expect(authorChecklist.items).toEqual(peerChecklist.items);
    });
  });

  describe('Consistency Across Audiences', () => {
    it('should use same base checklist items for all audiences', () => {
      const audiences = ['author', 'peer', 'stakeholder', 'integration'];

      const checklists = audiences.map((audience) =>
        renderAudienceChecklist(sampleChecklist, audience)
      );

      const baseItems = new Set(sampleChecklist.items.map((item) => item.id));

      checklists.forEach((checklist) => {
        const checklistItems = new Set(checklist.items.map((item) => item.id));
        expect(checklistItems).toEqual(baseItems);
      });
    });

    it('should maintain consistency in guidance structure', () => {
      const audiences = ['author', 'peer', 'stakeholder', 'integration'];

      audiences.forEach((audience) => {
        const guidance = renderGuidance(audience);
        expect(guidance.sections).toBeDefined();
        expect(Array.isArray(guidance.sections)).toBe(true);
      });
    });
  });
});
