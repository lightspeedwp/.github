/**
 * Tests for OpenSpec Status Labels
 * Validates label configuration and lifecycle tracking
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('OpenSpec Status Labels', () => {
  let labelsConfig;

  beforeAll(() => {
    const labelsPath = path.join(__dirname, '..', 'labels.yml');
    const fileContent = fs.readFileSync(labelsPath, 'utf8');
    labelsConfig = yaml.safeLoad(fileContent);
  });

  describe('Label Configuration', () => {
    it('should have openspec labels defined', () => {
      expect(labelsConfig).toBeDefined();
      expect(Array.isArray(labelsConfig)).toBe(true);
    });

    it('should have all 6 OpenSpec labels', () => {
      const openspecLabels = labelsConfig.filter(l => l.name.startsWith('openspec:'));
      expect(openspecLabels).toHaveLength(6);
    });

    it('should have specification-pending label', () => {
      const label = labelsConfig.find(l => l.name === 'openspec:specification-pending');
      expect(label).toBeDefined();
      expect(label.color).toBe('C5DEF5'); // Blue
      expect(label.description).toContain('OpenSpec specification needed');
    });

    it('should have specification-in-progress label', () => {
      const label = labelsConfig.find(l => l.name === 'openspec:specification-in-progress');
      expect(label).toBeDefined();
      expect(label.color).toBe('F2D06D'); // Yellow
      expect(label.description).toContain('specification being written');
    });

    it('should have specification-complete label', () => {
      const label = labelsConfig.find(l => l.name === 'openspec:specification-complete');
      expect(label).toBeDefined();
      expect(label.color).toBe('1A7F37'); // Green
      expect(label.description).toContain('specification complete');
    });

    it('should have implementation-pending label', () => {
      const label = labelsConfig.find(l => l.name === 'openspec:implementation-pending');
      expect(label).toBeDefined();
      expect(label.color).toBe('C5DEF5'); // Blue
      expect(label.description).toContain('Implementation pending');
    });

    it('should have implementation-in-progress label', () => {
      const label = labelsConfig.find(l => l.name === 'openspec:implementation-in-progress');
      expect(label).toBeDefined();
      expect(label.color).toBe('F2D06D'); // Yellow
      expect(label.description).toContain('Implementation in progress');
    });

    it('should have implementation-complete label', () => {
      const label = labelsConfig.find(l => l.name === 'openspec:implementation-complete');
      expect(label).toBeDefined();
      expect(label.color).toBe('1A7F37'); // Green
      expect(label.description).toContain('Implementation complete');
    });
  });

  describe('Color Scheme', () => {
    it('should follow Blue→Yellow→Green lifecycle', () => {
      const colors = {
        pending: 'C5DEF5',      // Blue
        inProgress: 'F2D06D',   // Yellow
        complete: '1A7F37'      // Green
      };

      // Specification colors
      const specPending = labelsConfig.find(l => l.name === 'openspec:specification-pending');
      const specProgress = labelsConfig.find(l => l.name === 'openspec:specification-in-progress');
      const specComplete = labelsConfig.find(l => l.name === 'openspec:specification-complete');

      expect(specPending.color).toBe(colors.pending);
      expect(specProgress.color).toBe(colors.inProgress);
      expect(specComplete.color).toBe(colors.complete);

      // Implementation colors
      const implPending = labelsConfig.find(l => l.name === 'openspec:implementation-pending');
      const implProgress = labelsConfig.find(l => l.name === 'openspec:implementation-in-progress');
      const implComplete = labelsConfig.find(l => l.name === 'openspec:implementation-complete');

      expect(implPending.color).toBe(colors.pending);
      expect(implProgress.color).toBe(colors.inProgress);
      expect(implComplete.color).toBe(colors.complete);
    });
  });

  describe('Naming Convention', () => {
    it('should follow naming pattern: openspec:{phase}-{status}', () => {
      const openspecLabels = labelsConfig.filter(l => l.name.startsWith('openspec:'));
      const pattern = /^openspec:(specification|implementation)-(pending|in-progress|complete)$/;

      openspecLabels.forEach(label => {
        expect(label.name).toMatch(pattern);
      });
    });

    it('should have proper descriptions', () => {
      const openspecLabels = labelsConfig.filter(l => l.name.startsWith('openspec:'));

      openspecLabels.forEach(label => {
        expect(label.description).toBeDefined();
        expect(label.description.length).toBeGreaterThan(0);
        expect(label.description.length).toBeLessThan(200);
      });
    });
  });

  describe('Phase Progression', () => {
    it('should define both specification and implementation phases', () => {
      const phases = new Set();
      const openspecLabels = labelsConfig.filter(l => l.name.startsWith('openspec:'));

      openspecLabels.forEach(label => {
        const [phase] = label.name.replace('openspec:', '').split('-');
        phases.add(phase);
      });

      expect(phases).toContain('specification');
      expect(phases).toContain('implementation');
      expect(phases.size).toBe(2);
    });

    it('should have all three statuses for each phase', () => {
      const statuses = { specification: new Set(), implementation: new Set() };
      const openspecLabels = labelsConfig.filter(l => l.name.startsWith('openspec:'));

      openspecLabels.forEach(label => {
        const parts = label.name.replace('openspec:', '').split('-');
        const phase = parts[0];
        const status = parts.slice(1).join('-');
        if (phase in statuses) {
          statuses[phase].add(status);
        }
      });

      expect(statuses.specification.size).toBe(3);
      expect(statuses.implementation.size).toBe(3);
      expect(statuses.specification).toContain('pending');
      expect(statuses.specification).toContain('in-progress');
      expect(statuses.specification).toContain('complete');
    });
  });

  describe('Integration with Existing Labels', () => {
    it('should not conflict with existing type labels', () => {
      const typeLabels = labelsConfig.filter(l => l.name.startsWith('type:'));
      const openspecLabels = labelsConfig.filter(l => l.name.startsWith('openspec:'));

      const allNames = new Set();
      [...typeLabels, ...openspecLabels].forEach(l => {
        expect(allNames.has(l.name)).toBe(false);
        allNames.add(l.name);
      });
    });

    it('should be compatible with status labels', () => {
      const statusLabels = labelsConfig.filter(l => l.name.startsWith('status:'));
      expect(statusLabels.length).toBeGreaterThan(0);

      // OpenSpec labels should be distinguishable from status labels
      const statusNames = statusLabels.map(l => l.name);
      const openspecNames = labelsConfig
        .filter(l => l.name.startsWith('openspec:'))
        .map(l => l.name);

      openspecNames.forEach(name => {
        expect(statusNames).not.toContain(name);
      });
    });
  });

  describe('Documentation', () => {
    it('should have clear descriptions for each label', () => {
      const openspecLabels = labelsConfig.filter(l => l.name.startsWith('openspec:'));
      const requiredTerms = ['OpenSpec', 'specification', 'implementation'];

      openspecLabels.forEach(label => {
        const description = label.description;
        const hasRelevantTerm = requiredTerms.some(term =>
          description.includes(term) || label.name.includes(term)
        );
        expect(hasRelevantTerm).toBe(true);
      });
    });
  });

  describe('Lifecycle Tracking', () => {
    it('should enable tracking specification→implementation flow', () => {
      const labels = labelsConfig.filter(l => l.name.startsWith('openspec:'));

      // Should be able to track: pending → in-progress → complete
      const specProgression = ['pending', 'in-progress', 'complete'];
      const implProgression = ['pending', 'in-progress', 'complete'];

      specProgression.forEach(status => {
        expect(labels.find(l => l.name === `openspec:specification-${status}`)).toBeDefined();
      });

      implProgression.forEach(status => {
        expect(labels.find(l => l.name === `openspec:implementation-${status}`)).toBeDefined();
      });
    });

    it('should allow parallel specification and implementation tracking', () => {
      // An issue could have both a specification and implementation label
      const specLabel = labelsConfig.find(l => l.name === 'openspec:specification-complete');
      const implLabel = labelsConfig.find(l => l.name === 'openspec:implementation-in-progress');

      expect(specLabel).toBeDefined();
      expect(implLabel).toBeDefined();
      expect(specLabel.name).not.toEqual(implLabel.name);
    });
  });
});
