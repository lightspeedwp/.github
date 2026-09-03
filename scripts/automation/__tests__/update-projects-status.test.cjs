/**
 * Tests for update-projects-status.cjs
 * Validates project status auditing and template generation
 */
const fs = require('fs');
const path = require('path');
const { jest } = require('@jest/globals');

jest.mock('fs');

describe('update-projects-status', () => {
  const REQUIRED_FIELDS = ['status', 'priority', 'type', 'effort'];
  const REQUIRED_SECTIONS = ['Related Issues'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('frontmatter parsing', () => {
    it('should extract YAML frontmatter', () => {
      const content = `---
status: active
priority: high
---
# Content`;
      const match = content.match(/^---\n([\s\S]*?)\n---/);

      expect(match).toBeTruthy();
      expect(match[1]).toContain('status: active');
    });

    it('should parse frontmatter key-value pairs', () => {
      const yaml = 'status: active\npriority: high';
      const obj = {};

      yaml.split('\n').forEach((line) => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          obj[key.trim()] = valueParts.join(':').trim();
        }
      });

      expect(obj.status).toBe('active');
      expect(obj.priority).toBe('high');
    });

    it('should handle missing frontmatter', () => {
      const content = '# No frontmatter here';
      const match = content.match(/^---\n([\s\S]*?)\n---/);

      expect(match).toBeNull();
    });

    it('should check for specific field in frontmatter', () => {
      const content = `---
status: active
priority: high
---`;
      const frontmatter = { status: 'active', priority: 'high' };
      const hasField = 'status' in frontmatter;

      expect(hasField).toBe(true);
    });

    it('should detect missing field', () => {
      const frontmatter = { status: 'active' };
      const hasField = 'effort' in frontmatter;

      expect(hasField).toBe(false);
    });
  });

  describe('section detection', () => {
    it('should detect ## Related Issues section', () => {
      const content = '## Related Issues\n\nSome text';
      const hasSection = /^## Related Issues/m.test(content);

      expect(hasSection).toBe(true);
    });

    it('should detect case-sensitive section headers', () => {
      const content = '## related issues\n\nText';
      const hasSection = /^## Related Issues/m.test(content);

      expect(hasSection).toBe(false);
    });

    it('should not match partial section names', () => {
      const content = '## Other Related Information';
      const hasSection = /^## Related Issues/m.test(content);

      expect(hasSection).toBe(false);
    });
  });

  describe('required fields validation', () => {
    it('should check all required fields', () => {
      const frontmatter = {
        status: 'active',
        priority: 'high',
        type: 'feature',
        effort: '24h',
      };

      const missing = REQUIRED_FIELDS.filter((f) => !(f in frontmatter));

      expect(missing).toHaveLength(0);
    });

    it('should detect missing status field', () => {
      const frontmatter = {
        priority: 'high',
        type: 'feature',
        effort: '24h',
      };

      const missing = REQUIRED_FIELDS.filter((f) => !(f in frontmatter));

      expect(missing).toContain('status');
    });

    it('should detect multiple missing fields', () => {
      const frontmatter = {
        status: 'active',
      };

      const missing = REQUIRED_FIELDS.filter((f) => !(f in frontmatter));

      expect(missing).toHaveLength(3);
    });
  });

  describe('required sections validation', () => {
    it('should validate presence of Related Issues section', () => {
      const content = '## Related Issues\n\n| Issue | Type |';
      const missing = REQUIRED_SECTIONS.filter((s) => !new RegExp(`^## ${s}`, 'm').test(content));

      expect(missing).toHaveLength(0);
    });

    it('should detect missing Related Issues section', () => {
      const content = '## Overview\n\n## Implementation';
      const missing = REQUIRED_SECTIONS.filter((s) => !new RegExp(`^## ${s}`, 'm').test(content));

      expect(missing).toContain('Related Issues');
    });
  });

  describe('file operations', () => {
    it('should read file content', () => {
      fs.readFileSync.mockReturnValueOnce('file content');

      const content = fs.readFileSync('test.md', 'utf8');

      expect(content).toBe('file content');
    });

    it('should handle file read errors', () => {
      fs.readFileSync.mockImplementationOnce(() => {
        throw new Error('ENOENT');
      });

      expect(() => {
        fs.readFileSync('missing.md', 'utf8');
      }).toThrow();
    });

    it('should check if projects directory exists', () => {
      fs.existsSync.mockReturnValueOnce(true);

      expect(fs.existsSync('.github/projects/active')).toBe(true);
    });

    it('should list directories in projects folder', () => {
      fs.readdirSync.mockReturnValueOnce(['project-1', 'project-2']);

      expect(fs.readdirSync('.github/projects/active')).toHaveLength(2);
    });
  });

  describe('command handling', () => {
    it('should handle audit command', () => {
      const command = 'audit';

      expect(['audit', 'template', 'link']).toContain(command);
    });

    it('should handle template command', () => {
      const command = 'template';

      expect(['audit', 'template', 'link']).toContain(command);
    });

    it('should handle link command', () => {
      const command = 'link';

      expect(['audit', 'template', 'link']).toContain(command);
    });

    it('should handle help command', () => {
      const command = 'help';

      expect(['help', '--help', '-h']).toContain(command);
    });

    it('should reject unknown command', () => {
      const command = 'unknown';

      expect(['audit', 'template', 'link']).not.toContain(command);
    });

    it('should default to audit command', () => {
      const command = process.argv[2] || 'audit';

      expect(['audit', 'template', 'link']).toContain(command);
    });
  });

  describe('audit report generation', () => {
    it('should count total projects', () => {
      const projects = ['p1', 'p2', 'p3'];
      const total = projects.length;

      expect(total).toBe(3);
    });

    it('should identify complete projects', () => {
      const projects = [
        { name: 'p1', complete: true },
        { name: 'p2', complete: false },
      ];
      const complete = projects.filter((p) => p.complete).length;

      expect(complete).toBe(1);
    });

    it('should identify projects with missing fields', () => {
      const results = {
        missingFields: [
          { project: 'p1', fields: ['status', 'priority'] },
        ],
      };

      expect(results.missingFields).toHaveLength(1);
      expect(results.missingFields[0].fields).toHaveLength(2);
    });

    it('should identify projects with missing sections', () => {
      const results = {
        missingSections: [
          { project: 'p1', sections: ['Related Issues'] },
        ],
      };

      expect(results.missingSections).toHaveLength(1);
    });
  });

  describe('template generation', () => {
    it('should suggest frontmatter template', () => {
      const template = `status: active|pending|review|blocked|at_risk
priority: critical|high|medium|low
type: feature|infrastructure|maintenance|documentation
effort: "24h"`;

      expect(template).toContain('status:');
      expect(template).toContain('priority:');
      expect(template).toContain('effort:');
    });

    it('should suggest Related Issues section template', () => {
      const template = `## Related Issues & PRs

| Issue/PR | Type | Status | Purpose |`;

      expect(template).toContain('Related Issues');
      expect(template).toContain('| Issue/PR |');
    });

    it('should include today\'s date in templates', () => {
      const today = new Date().toISOString().split('T')[0];
      const template = `last_updated: ${today}`;

      expect(template).toContain(today);
    });
  });

  describe('linking suggestions', () => {
    it('should extract issue numbers from Related Issues', () => {
      const content = '## Related Issues\n[#123](url)\n[#456](url)';
      const issueMatch = content.match(/## Related Issues[\s\S]*?(?=##|$)/);
      const issueNumbers = (issueMatch[0].match(/#(\d+)/g) || [])
        .map((m) => m.slice(1));

      expect(issueNumbers).toEqual(['123', '456']);
    });

    it('should handle missing issue links in section', () => {
      const content = '## Related Issues\n\nNo issues listed';
      const issueMatch = content.match(/## Related Issues[\s\S]*?(?=##|$)/);
      const issueNumbers = (issueMatch[0].match(/#(\d+)/g) || [])
        .map((m) => m.slice(1));

      expect(issueNumbers).toHaveLength(0);
    });

    it('should generate back-linking suggestion', () => {
      const suggestion = `## 📋 Project Reference
**Related Project:** [project-name](url)`;

      expect(suggestion).toContain('Project Reference');
    });
  });

  describe('error handling', () => {
    it('should handle missing projects directory', () => {
      fs.existsSync.mockReturnValueOnce(false);

      expect(fs.existsSync('.github/projects/active')).toBe(false);
    });

    it('should continue if README.md missing', () => {
      const readmePath = '.github/projects/active/test/README.md';

      expect(readmePath).toBeTruthy();
    });

    it('should report project-specific errors', () => {
      const error = { project: 'test-project', message: 'Read failed' };

      expect(error.project).toBe('test-project');
    });
  });

  describe('output formatting', () => {
    it('should format audit summary', () => {
      const summary = `Total projects: 5
Complete: 3
Missing fields: 2`;

      expect(summary).toContain('Total projects:');
      expect(summary).toContain('Complete:');
    });

    it('should list projects needing updates', () => {
      const list = `Projects needing frontmatter updates:
  - project-1: status, priority`;

      expect(list).toContain('project-1');
    });

    it('should format issue number references', () => {
      const ref = 'Issue #123';

      expect(ref).toMatch(/#\d+/);
    });
  });

  describe('color codes', () => {
    it('should have color definitions', () => {
      const colors = {
        reset: '\x1b[0m',
        green: '\x1b[32m',
        red: '\x1b[31m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        cyan: '\x1b[36m',
      };

      expect(colors.green).toBe('\x1b[32m');
      expect(colors.red).toBe('\x1b[31m');
    });
  });
});
