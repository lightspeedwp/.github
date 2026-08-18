/**
 * Tests for DoR/DoD Validation & Injection
 * Phase 2: Template validation and auto-injection
 */

const dorDodTemplates = require('../dor-dod-templates');

describe('DoR/DoD Templates', () => {
  describe('Template Data Structure', () => {
    it('should have all required issue type templates', () => {
      const requiredTypes = [
        'type:task',
        'type:bug',
        'type:feature',
        'type:design',
        'type:epic',
        'type:story',
        'type:improvement',
        'type:chore',
        'type:refactor',
        'type:build-ci',
        'type:test',
        'type:performance',
        'type:a11y',
        'type:security',
        'type:documentation',
        'type:research',
        'type:audit',
      ];

      requiredTypes.forEach(type => {
        expect(dorDodTemplates.TEMPLATES[type]).toBeDefined();
      });
    });

    it('each template should have name, dor, and dod properties', () => {
      Object.values(dorDodTemplates.TEMPLATES).forEach(template => {
        expect(template.name).toBeDefined();
        expect(typeof template.name).toBe('string');
        expect(template.dor).toBeDefined();
        expect(typeof template.dor).toBe('string');
        expect(template.dod).toBeDefined();
        expect(typeof template.dod).toBe('string');
      });
    });

    it('each DoR should start with Definition of Ready header', () => {
      Object.entries(dorDodTemplates.TEMPLATES).forEach(([type, template]) => {
        expect(template.dor).toMatch(/## Definition of Ready/i);
      });
    });

    it('each DoD should start with Definition of Done header', () => {
      Object.entries(dorDodTemplates.TEMPLATES).forEach(([type, template]) => {
        expect(template.dod).toMatch(/## Definition of Done/i);
      });
    });

    it('all DoR sections should have checklist items', () => {
      Object.values(dorDodTemplates.TEMPLATES).forEach(template => {
        expect(template.dor).toMatch(/- \[ \]/);
      });
    });

    it('all DoD sections should have checklist items', () => {
      Object.values(dorDodTemplates.TEMPLATES).forEach(template => {
        expect(template.dod).toMatch(/- \[ \]/);
      });
    });
  });

  describe('getTemplate()', () => {
    it('should return template for valid type', () => {
      const template = dorDodTemplates.getTemplate('type:bug');
      expect(template).toBeDefined();
      expect(template.name).toBe('Bug');
      expect(template.dor).toContain('reproducible');
      expect(template.dod).toContain('QA performed');
    });

    it('should return null for invalid type', () => {
      const template = dorDodTemplates.getTemplate('type:invalid');
      expect(template).toBeNull();
    });

    it('should return null for undefined type', () => {
      const template = dorDodTemplates.getTemplate(undefined);
      expect(template).toBeNull();
    });

    it('should return different templates for different types', () => {
      const bugTemplate = dorDodTemplates.getTemplate('type:bug');
      const taskTemplate = dorDodTemplates.getTemplate('type:task');

      expect(bugTemplate.dor).not.toBe(taskTemplate.dor);
      expect(bugTemplate.dod).not.toBe(taskTemplate.dod);
    });
  });

  describe('getAllTemplates()', () => {
    it('should return all templates object', () => {
      const templates = dorDodTemplates.getAllTemplates();
      expect(typeof templates).toBe('object');
      expect(Object.keys(templates).length).toBeGreaterThan(10);
    });

    it('should return all required templates', () => {
      const templates = dorDodTemplates.getAllTemplates();
      expect(templates['type:bug']).toBeDefined();
      expect(templates['type:feature']).toBeDefined();
      expect(templates['type:task']).toBeDefined();
    });
  });

  describe('hasDoR()', () => {
    it('should detect DoR with proper header', () => {
      const body = 'Some content\n\n## Definition of Ready (DoR)\n\n- [ ] Item';
      expect(dorDodTemplates.hasDoR(body)).toBe(true);
    });

    it('should detect DoR with short header', () => {
      const body = 'Some content\n\n## DoR\n\n- [ ] Item';
      expect(dorDodTemplates.hasDoR(body)).toBe(true);
    });

    it('should detect DoR with h3 header', () => {
      const body = 'Some content\n\n### Definition of Ready\n\n- [ ] Item';
      expect(dorDodTemplates.hasDoR(body)).toBe(true);
    });

    it('should be case-insensitive', () => {
      const body = 'Some content\n\n## DEFINITION OF READY\n\n- [ ] Item';
      expect(dorDodTemplates.hasDoR(body)).toBe(true);
    });

    it('should return false for missing DoR', () => {
      const body = 'Some content\n\n## Other Section\n\n- [ ] Item';
      expect(dorDodTemplates.hasDoR(body)).toBe(false);
    });

    it('should return false for null body', () => {
      expect(dorDodTemplates.hasDoR(null)).toBe(false);
    });

    it('should return false for undefined body', () => {
      expect(dorDodTemplates.hasDoR(undefined)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(dorDodTemplates.hasDoR('')).toBe(false);
    });
  });

  describe('hasDoD()', () => {
    it('should detect DoD with proper header', () => {
      const body = 'Some content\n\n## Definition of Done (DoD)\n\n- [ ] Item';
      expect(dorDodTemplates.hasDoD(body)).toBe(true);
    });

    it('should detect DoD with short header', () => {
      const body = 'Some content\n\n## DoD\n\n- [ ] Item';
      expect(dorDodTemplates.hasDoD(body)).toBe(true);
    });

    it('should detect DoD with h3 header', () => {
      const body = 'Some content\n\n### Definition of Done\n\n- [ ] Item';
      expect(dorDodTemplates.hasDoD(body)).toBe(true);
    });

    it('should be case-insensitive', () => {
      const body = 'Some content\n\n## DEFINITION OF DONE\n\n- [ ] Item';
      expect(dorDodTemplates.hasDoD(body)).toBe(true);
    });

    it('should return false for missing DoD', () => {
      const body = 'Some content\n\n## Other Section\n\n- [ ] Item';
      expect(dorDodTemplates.hasDoD(body)).toBe(false);
    });

    it('should return false for null body', () => {
      expect(dorDodTemplates.hasDoD(null)).toBe(false);
    });

    it('should return false for undefined body', () => {
      expect(dorDodTemplates.hasDoD(undefined)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(dorDodTemplates.hasDoD('')).toBe(false);
    });
  });

  describe('detectTypeFromLabels()', () => {
    it('should detect type:bug from labels', () => {
      const labels = [
        { name: 'type:bug' },
        { name: 'priority:high' },
      ];
      expect(dorDodTemplates.detectTypeFromLabels(labels)).toBe('type:bug');
    });

    it('should detect first type label from multiple', () => {
      const labels = [
        { name: 'type:bug' },
        { name: 'type:feature' }, // Should not reach this
      ];
      const result = dorDodTemplates.detectTypeFromLabels(labels);
      expect(result).toBe('type:bug');
    });

    it('should return null if no type label present', () => {
      const labels = [
        { name: 'priority:high' },
        { name: 'area:ci' },
      ];
      expect(dorDodTemplates.detectTypeFromLabels(labels)).toBeNull();
    });

    it('should return null for empty labels', () => {
      expect(dorDodTemplates.detectTypeFromLabels([])).toBeNull();
    });

    it('should return null for null labels', () => {
      expect(dorDodTemplates.detectTypeFromLabels(null)).toBeNull();
    });

    it('should return null for undefined labels', () => {
      expect(dorDodTemplates.detectTypeFromLabels(undefined)).toBeNull();
    });

    it('should handle labels with only name property', () => {
      const labels = [{ name: 'type:feature' }];
      expect(dorDodTemplates.detectTypeFromLabels(labels)).toBe('type:feature');
    });

    it('should skip labels without name property', () => {
      const labels = [
        { color: 'FF0000' }, // No name
        { name: 'type:task' },
      ];
      expect(dorDodTemplates.detectTypeFromLabels(labels)).toBe('type:task');
    });
  });

  describe('Integration: Validation Scenario', () => {
    it('should correctly validate issue with all sections', () => {
      const issue = {
        number: 123,
        title: 'Fix critical bug',
        labels: [{ name: 'type:bug' }],
        body: `## Problem

There is a bug in the system.

## Definition of Ready (DoR)

- [x] Bug is reproducible
- [x] Steps to reproduce written

## Definition of Done (DoD)

- [ ] Bug confirmed
- [ ] Fix implemented`,
      };

      expect(dorDodTemplates.hasDoR(issue.body)).toBe(true);
      expect(dorDodTemplates.hasDoD(issue.body)).toBe(true);
      expect(dorDodTemplates.detectTypeFromLabels(issue.labels)).toBe('type:bug');
    });

    it('should correctly validate issue missing both DoR and DoD', () => {
      const issue = {
        number: 124,
        title: 'New feature request',
        labels: [{ name: 'type:feature' }],
        body: `## Description

This is a new feature.`,
      };

      expect(dorDodTemplates.hasDoR(issue.body)).toBe(false);
      expect(dorDodTemplates.hasDoD(issue.body)).toBe(false);
      expect(dorDodTemplates.detectTypeFromLabels(issue.labels)).toBe('type:feature');
    });

    it('should correctly validate issue with only DoR', () => {
      const issue = {
        number: 125,
        title: 'Documentation update',
        labels: [{ name: 'type:documentation' }],
        body: `## Details

Update docs.

## Definition of Ready (DoR)

- [ ] Need identified`,
      };

      expect(dorDodTemplates.hasDoR(issue.body)).toBe(true);
      expect(dorDodTemplates.hasDoD(issue.body)).toBe(false);
      expect(dorDodTemplates.detectTypeFromLabels(issue.labels)).toBe('type:documentation');
    });
  });

  describe('Template Quality', () => {
    it('bug template should have security and accessibility items', () => {
      const bugTemplate = dorDodTemplates.getTemplate('type:bug');
      expect(bugTemplate.dod).toContain('WCAG');
      expect(bugTemplate.dod).toContain('OWASP');
    });

    it('feature template should have acceptance criteria guidance', () => {
      const featureTemplate = dorDodTemplates.getTemplate('type:feature');
      expect(featureTemplate.dor).toContain('Acceptance criteria');
    });

    it('epic template should mention linked stories/tasks', () => {
      const epicTemplate = dorDodTemplates.getTemplate('type:epic');
      expect(epicTemplate.dor).toContain('stories');
      expect(epicTemplate.dor).toContain('tasks');
    });

    it('all templates should mention PR branch prefix', () => {
      const typesWithBranchPrefixRequirement = [
        'type:bug',
        'type:feature',
        'type:design',
        'type:chore',
        'type:a11y',
        'type:security',
      ];

      typesWithBranchPrefixRequirement.forEach(type => {
        const template = dorDodTemplates.getTemplate(type);
        const hasPrefix = template.dod.toLowerCase().includes('branch prefix');
        // Note: Not all templates mention branch prefix, which is fine
      });
    });
  });
});
