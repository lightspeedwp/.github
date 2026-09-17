/**
 * Tests for Audience-Specific Guidance Rendering
 * T037: Unit test for guidance rendering
 */

const {
  renderGuidance,
  loadAudienceGuidance,
  getGuidanceForAudience,
  formatGuidanceSection,
} = require('../../lib/guidance-renderer');

describe('Guidance Rendering', () => {
  describe('renderGuidance', () => {
    it('should render author guidance for author audience', () => {
      const guidance = renderGuidance('author');

      expect(guidance).toBeDefined();
      expect(guidance.audience).toBe('author');
      expect(guidance.title).toContain('Author');
      expect(guidance.timeEstimate).toBe(30);
    });

    it('should render peer guidance for peer audience', () => {
      const guidance = renderGuidance('peer');

      expect(guidance).toBeDefined();
      expect(guidance.audience).toBe('peer');
      expect(guidance.title).toContain('Peer');
      expect(guidance.timeEstimate).toBe(45);
    });

    it('should render stakeholder guidance for stakeholder audience', () => {
      const guidance = renderGuidance('stakeholder');

      expect(guidance).toBeDefined();
      expect(guidance.audience).toBe('stakeholder');
      expect(guidance.title).toContain('Stakeholder');
      expect(guidance.timeEstimate).toBe(15);
    });

    it('should render integration guidance for integration audience', () => {
      const guidance = renderGuidance('integration');

      expect(guidance).toBeDefined();
      expect(guidance.audience).toBe('integration');
      expect(guidance.title).toContain('Integration');
    });

    it('should include introduction section', () => {
      const guidance = renderGuidance('author');

      expect(guidance.sections).toBeDefined();
      expect(guidance.sections.some((s) => s.type === 'introduction')).toBe(true);
    });

    it('should include instructions section', () => {
      const guidance = renderGuidance('author');

      expect(guidance.sections.some((s) => s.type === 'instructions')).toBe(true);
    });

    it('should include examples section', () => {
      const guidance = renderGuidance('author');

      expect(guidance.sections.some((s) => s.type === 'examples')).toBe(true);
    });

    it('should include tips section for author', () => {
      const guidance = renderGuidance('author');

      expect(guidance.sections.some((s) => s.type === 'tips')).toBe(true);
    });

    it('should throw error for invalid audience', () => {
      expect(() => renderGuidance('invalid')).toThrow();
    });
  });

  describe('loadAudienceGuidance', () => {
    it('should load author guidance from file', () => {
      const guidance = loadAudienceGuidance('author');

      expect(guidance).toBeDefined();
      expect(guidance.audience).toBe('author');
    });

    it('should load all audience guidance files', () => {
      const audiences = ['author', 'peer', 'stakeholder', 'integration'];

      audiences.forEach((audience) => {
        const guidance = loadAudienceGuidance(audience);
        expect(guidance).toBeDefined();
        expect(guidance.audience).toBe(audience);
      });
    });

    it('should cache loaded guidance', () => {
      const guidance1 = loadAudienceGuidance('author');
      const guidance2 = loadAudienceGuidance('author');

      expect(guidance1).toBe(guidance2);
    });
  });

  describe('getGuidanceForAudience', () => {
    it('should return guidance tailored to author needs', () => {
      const guidance = getGuidanceForAudience('author');

      expect(guidance).toContain('self-check');
      expect(guidance).toContain('30 min');
    });

    it('should return guidance tailored to peer reviewer needs', () => {
      const guidance = getGuidanceForAudience('peer');

      expect(guidance).toContain('feedback');
      expect(guidance).toContain('45 min');
    });

    it('should return guidance tailored to stakeholder needs', () => {
      const guidance = getGuidanceForAudience('stakeholder');

      expect(guidance).toContain('go/no-go');
      expect(guidance).toContain('15 min');
    });

    it('should return guidance tailored to integration reviewer needs', () => {
      const guidance = getGuidanceForAudience('integration');

      expect(guidance).toContain('dependency');
      expect(guidance).toContain('cross-project');
    });
  });

  describe('formatGuidanceSection', () => {
    it('should format introduction section correctly', () => {
      const section = {
        type: 'introduction',
        title: 'Welcome',
        content: 'This is an introduction',
      };

      const formatted = formatGuidanceSection(section);

      expect(formatted).toContain('Welcome');
      expect(formatted).toContain('This is an introduction');
    });

    it('should format instructions section with numbered steps', () => {
      const section = {
        type: 'instructions',
        steps: ['Step 1', 'Step 2', 'Step 3'],
      };

      const formatted = formatGuidanceSection(section);

      expect(formatted).toContain('Step 1');
      expect(formatted).toContain('Step 2');
      expect(formatted).toContain('Step 3');
    });

    it('should format tips section with bullet points', () => {
      const section = {
        type: 'tips',
        tips: ['Tip 1', 'Tip 2', 'Tip 3'],
      };

      const formatted = formatGuidanceSection(section);

      expect(formatted).toContain('Tip 1');
      expect(formatted).toContain('Tip 2');
      expect(formatted).toContain('Tip 3');
    });

    it('should format examples section with code blocks', () => {
      const section = {
        type: 'examples',
        examples: [
          {
            title: 'Good Example',
            code: 'example code',
          },
        ],
      };

      const formatted = formatGuidanceSection(section);

      expect(formatted).toContain('Good Example');
      expect(formatted).toContain('example code');
    });
  });
});
