const dorDodTemplates = require('../dor-dod-templates');

describe('DoR/DoD Templates', () => {
  describe('TEMPLATES data structure', () => {
    it('should have TEMPLATES object exported', () => {
      expect(dorDodTemplates.TEMPLATES).toBeDefined();
      expect(typeof dorDodTemplates.TEMPLATES).toBe('object');
    });

    it('should have at least 15 issue types', () => {
      const templateCount = Object.keys(dorDodTemplates.TEMPLATES).length;
      expect(templateCount).toBeGreaterThanOrEqual(15);
    });

    it('each template should have name, dor, and dod properties', () => {
      Object.entries(dorDodTemplates.TEMPLATES).forEach(([typeLabel, template]) => {
        expect(template.name).toBeDefined();
        expect(typeof template.name).toBe('string');
        expect(template.dor).toBeDefined();
        expect(typeof template.dor).toBe('string');
        expect(template.dod).toBeDefined();
        expect(typeof template.dod).toBe('string');
      });
    });

    it('all templates should have ## headers for DoR and DoD', () => {
      Object.entries(dorDodTemplates.TEMPLATES).forEach(([typeLabel, template]) => {
        expect(template.dor).toMatch(/## Definition of Ready|## DoR/i);
        expect(template.dod).toMatch(/## Definition of Done|## DoD/i);
      });
    });

    it('DoR and DoD sections should not be identical', () => {
      Object.entries(dorDodTemplates.TEMPLATES).forEach(([typeLabel, template]) => {
        expect(template.dor).not.toBe(template.dod);
      });
    });

    it('all templates should have checklist items', () => {
      Object.entries(dorDodTemplates.TEMPLATES).forEach(([typeLabel, template]) => {
        expect(template.dor).toContain('[ ]');
        expect(template.dod).toContain('[ ]');
      });
    });
  });

  describe('getTemplate() function', () => {
    it('should return template for valid type label', () => {
      const template = dorDodTemplates.getTemplate('type:bug');
      expect(template).toBeDefined();
      expect(template.name).toBe('Bug');
    });

    it('should return null for invalid type label', () => {
      const template = dorDodTemplates.getTemplate('type:invalid');
      expect(template).toBeNull();
    });

    it('should return null for null input', () => {
      const template = dorDodTemplates.getTemplate(null);
      expect(template).toBeNull();
    });
  });

  describe('hasDoR() function', () => {
    it('should detect ## Definition of Ready', () => {
      const body = '## Definition of Ready\n- [ ] item';
      expect(dorDodTemplates.hasDoR(body)).toBe(true);
    });

    it('should detect ## DoR', () => {
      const body = '## DoR\n- [ ] item';
      expect(dorDodTemplates.hasDoR(body)).toBe(true);
    });

    it('should detect ### Definition of Ready', () => {
      const body = '### Definition of Ready\n- [ ] item';
      expect(dorDodTemplates.hasDoR(body)).toBe(true);
    });

    it('should be case insensitive', () => {
      const body = '## DEFINITION OF READY\n- [ ] item';
      expect(dorDodTemplates.hasDoR(body)).toBe(true);
    });

    it('should return false for missing section', () => {
      const body = 'Some content without DoR';
      expect(dorDodTemplates.hasDoR(body)).toBe(false);
    });

    it('should return false for null body', () => {
      expect(dorDodTemplates.hasDoR(null)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(dorDodTemplates.hasDoR('')).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(dorDodTemplates.hasDoR(undefined)).toBe(false);
    });
  });

  describe('hasDoD() function', () => {
    it('should detect ## Definition of Done', () => {
      const body = '## Definition of Done\n- [ ] item';
      expect(dorDodTemplates.hasDoD(body)).toBe(true);
    });

    it('should detect ## DoD', () => {
      const body = '## DoD\n- [ ] item';
      expect(dorDodTemplates.hasDoD(body)).toBe(true);
    });

    it('should detect ### Definition of Done', () => {
      const body = '### Definition of Done\n- [ ] item';
      expect(dorDodTemplates.hasDoD(body)).toBe(true);
    });

    it('should be case insensitive', () => {
      const body = '## DEFINITION OF DONE\n- [ ] item';
      expect(dorDodTemplates.hasDoD(body)).toBe(true);
    });

    it('should return false for missing section', () => {
      const body = 'Some content without DoD';
      expect(dorDodTemplates.hasDoD(body)).toBe(false);
    });

    it('should return false for null body', () => {
      expect(dorDodTemplates.hasDoD(null)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(dorDodTemplates.hasDoD('')).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(dorDodTemplates.hasDoD(undefined)).toBe(false);
    });
  });

  describe('detectTypeFromLabels() function', () => {
    it('should detect type:bug label', () => {
      const labels = [
        { name: 'type:bug' },
        { name: 'priority:important' },
      ];
      const type = dorDodTemplates.detectTypeFromLabels(labels);
      expect(type).toBe('type:bug');
    });

    it('should detect first type: label when multiple', () => {
      const labels = [
        { name: 'type:feature' },
        { name: 'type:bug' },
      ];
      const type = dorDodTemplates.detectTypeFromLabels(labels);
      expect(type).toBe('type:feature');
    });

    it('should return null when no type label', () => {
      const labels = [
        { name: 'priority:important' },
        { name: 'area:ci' },
      ];
      const type = dorDodTemplates.detectTypeFromLabels(labels);
      expect(type).toBeNull();
    });

    it('should return null for empty labels array', () => {
      const type = dorDodTemplates.detectTypeFromLabels([]);
      expect(type).toBeNull();
    });

    it('should return null for null input', () => {
      const type = dorDodTemplates.detectTypeFromLabels(null);
      expect(type).toBeNull();
    });

    it('should handle labels with missing name property', () => {
      const labels = [
        { },
        { name: 'type:task' },
      ];
      const type = dorDodTemplates.detectTypeFromLabels(labels);
      expect(type).toBe('type:task');
    });
  });

  describe('Integration scenarios', () => {
    it('all 17 types should have consistent templates', () => {
      const templates = dorDodTemplates.getAllTemplates();
      Object.entries(templates).forEach(([typeLabel, template]) => {
        expect(template.dor.length).toBeGreaterThan(50);
        expect(template.dod.length).toBeGreaterThan(50);
      });
    });

    it('bug template should include security and accessibility items', () => {
      const bugTemplate = dorDodTemplates.getTemplate('type:bug');
      expect(bugTemplate.dod.toLowerCase()).toContain('security');
      expect(bugTemplate.dod.toLowerCase()).toContain('accessibility');
    });

    it('epic template should mention stories and tasks', () => {
      const epicTemplate = dorDodTemplates.getTemplate('type:epic');
      expect(epicTemplate.dor).toContain('stories');
      expect(epicTemplate.dor).toContain('tasks');
    });

    it('templates requiring branch prefix should be documented', () => {
      const typesWithBranchPrefixRequirement = [
        'type:bug',
        'type:feature',
        'type:design',
        'type:chore',
        'type:a11y',
        'type:security',
      ];

      const typesWithPrefix = [];
      typesWithBranchPrefixRequirement.forEach(type => {
        const template = dorDodTemplates.getTemplate(type);
        if (template.dod.toLowerCase().includes('branch prefix')) {
          typesWithPrefix.push(type);
        }
      });

      // At least one type should mention branch prefix
      expect(typesWithPrefix.length).toBeGreaterThan(0);
    });
  });
});
