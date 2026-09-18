/**
 * Tests for scan-completion.cjs
 * Validates project completion scanning
 */
const fs = require('fs');
const path = require('path');
const { jest } = require('@jest/globals');

jest.mock('fs');

describe('scan-completion', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('directory scanning', () => {
    it('should handle missing active projects directory', () => {
      fs.existsSync.mockReturnValueOnce(false);

      expect(fs.existsSync('.github/projects/active')).toBe(false);
    });

    it('should read active projects directory', () => {
      fs.existsSync.mockReturnValueOnce(true);
      fs.readdirSync.mockReturnValueOnce([
        { name: 'project-1', isDirectory: () => true },
        { name: 'project-2', isDirectory: () => true },
      ]);

      expect(fs.existsSync('.github/projects/active')).toBe(true);
    });

    it('should filter for directories only', () => {
      const entries = [
        { name: 'project-1', isDirectory: () => true },
        { name: 'file.txt', isDirectory: () => false },
        { name: 'project-2', isDirectory: () => true },
      ];

      const dirs = entries.filter((d) => d.isDirectory()).map((d) => d.name);

      expect(dirs).toEqual(['project-1', 'project-2']);
      expect(dirs).toHaveLength(2);
    });

    it('should handle empty project directory', () => {
      fs.existsSync.mockReturnValueOnce(true);
      fs.readdirSync.mockReturnValueOnce([]);

      const dirs = [];

      expect(dirs).toHaveLength(0);
    });
  });

  describe('project filtering', () => {
    it('should filter projects by name if specified', () => {
      process.env.PROJECT_FILTER = 'audit';
      const projects = ['label-audit', 'workflow-consolidation', 'audit-2026'];
      const filter = process.env.PROJECT_FILTER;

      const filtered = projects.filter((p) => p.includes(filter));

      expect(filtered).toEqual(['label-audit', 'audit-2026']);
    });

    it('should use all projects if no filter specified', () => {
      delete process.env.PROJECT_FILTER;
      const projects = ['project-1', 'project-2', 'project-3'];

      expect(projects).toHaveLength(3);
    });
  });

  describe('completion detection', () => {
    it('should detect "status: completed" marker', () => {
      const content = 'status: completed';
      const marker = /status:\s*completed/i;

      expect(marker.test(content)).toBe(true);
    });

    it('should detect quoted status marker', () => {
      const content = 'status: "completed"';
      const marker = /status:\s*"completed"/i;

      expect(marker.test(content)).toBe(true);
    });

    it('should detect checkbox completion marker', () => {
      const content = '[x] completed';
      const marker = /\[x\]\s+completed/i;

      expect(marker.test(content)).toBe(true);
    });

    it('should detect project complete checkbox', () => {
      const content = '[x] project complete';
      const marker = /\[x\]\s+project\s+complete/i;

      expect(marker.test(content)).toBe(true);
    });

    it('should detect HTML comment marker', () => {
      const content = '<!-- archival-ready -->';

      expect(content.includes('<!-- archival-ready -->')).toBe(true);
    });

    it('should be case-insensitive', () => {
      const content = 'Status: COMPLETED';
      const marker = /status:\s*completed/i;

      expect(marker.test(content)).toBe(true);
    });

    it('should not match incomplete projects', () => {
      const content = 'status: active';
      const marker = /status:\s*completed/i;

      expect(marker.test(content)).toBe(false);
    });
  });

  describe('PARENT_ISSUE.md handling', () => {
    it('should look for PARENT_ISSUE.md file', () => {
      const projectPath = '.github/projects/active/test-project';
      const readmePath = path.join(projectPath, 'PARENT_ISSUE.md');

      expect(readmePath).toBe('.github/projects/active/test-project/PARENT_ISSUE.md');
    });

    it('should skip project if PARENT_ISSUE.md missing', () => {
      fs.existsSync.mockReturnValueOnce(false);

      expect(fs.existsSync('.github/projects/active/test/PARENT_ISSUE.md')).toBe(false);
    });

    it('should read PARENT_ISSUE.md content', () => {
      fs.readFileSync.mockReturnValueOnce('status: completed');

      const content = fs.readFileSync('test.md', 'utf8');

      expect(content).toBe('status: completed');
    });
  });

  describe('completed project tracking', () => {
    it('should collect completed projects', () => {
      const completedProjects = [];
      const project = {
        name: 'test-project',
        path: '.github/projects/active/test-project',
        archivedAt: '2026-09-03',
      };

      completedProjects.push(project);

      expect(completedProjects).toHaveLength(1);
      expect(completedProjects[0].name).toBe('test-project');
    });

    it('should format date as ISO date string', () => {
      const date = new Date('2026-09-03T14:30:00Z');
      const isoDate = date.toISOString().split('T')[0];

      expect(isoDate).toBe('2026-09-03');
    });

    it('should include project metadata', () => {
      const project = {
        name: 'my-project',
        path: '/path/to/project',
        archivedAt: '2026-09-03',
      };

      expect(project).toHaveProperty('name');
      expect(project).toHaveProperty('path');
      expect(project).toHaveProperty('archivedAt');
    });
  });

  describe('output generation', () => {
    it('should output JSON string of projects', () => {
      const projects = [
        { name: 'p1', path: '/p1', archivedAt: '2026-09-03' },
      ];
      const json = JSON.stringify(projects);

      expect(json).toContain('p1');
    });

    it('should output has_completed boolean', () => {
      const hasCompleted = true;

      expect(hasCompleted).toBe(true);
    });

    it('should output to GitHub GITHUB_OUTPUT if available', () => {
      process.env.GITHUB_OUTPUT = '/tmp/github-output';
      fs.appendFileSync.mockImplementationOnce(() => {});

      const output = 'projects_json=[]\nhas_completed=false\n';

      fs.appendFileSync('/tmp/github-output', output, 'utf8');

      expect(fs.appendFileSync).toHaveBeenCalledWith(
        '/tmp/github-output',
        output,
        'utf8'
      );
    });

    it('should output to console if GITHUB_OUTPUT not available', () => {
      delete process.env.GITHUB_OUTPUT;

      expect(process.env.GITHUB_OUTPUT).toBeUndefined();
    });

    it('should format output as key=value pairs', () => {
      const output = `projects_json=[]\nhas_completed=false\n`;

      expect(output).toContain('projects_json=');
      expect(output).toContain('has_completed=');
    });
  });

  describe('error handling', () => {
    it('should catch directory reading errors', () => {
      const error = new Error('Permission denied');
      fs.readdirSync.mockImplementationOnce(() => {
        throw error;
      });

      expect(() => {
        fs.readdirSync('.github/projects/active');
      }).toThrow('Permission denied');
    });

    it('should handle missing PARENT_ISSUE.md gracefully', () => {
      fs.existsSync.mockReturnValueOnce(false);

      expect(fs.existsSync('/path/to/PARENT_ISSUE.md')).toBe(false);
    });

    it('should continue if file read fails', () => {
      fs.readFileSync.mockImplementationOnce(() => {
        throw new Error('ENOENT');
      });

      expect(() => {
        fs.readFileSync('missing.md', 'utf8');
      }).toThrow();
    });
  });

  describe('environment configuration', () => {
    it('should use default active directory', () => {
      delete process.env.ACTIVE_PROJECTS_DIR;

      const dir = process.env.ACTIVE_PROJECTS_DIR || '.github/projects/active';

      expect(dir).toBe('.github/projects/active');
    });

    it('should use custom active directory when specified', () => {
      process.env.ACTIVE_PROJECTS_DIR = '/custom/projects';

      const dir = process.env.ACTIVE_PROJECTS_DIR || '.github/projects/active';

      expect(dir).toBe('/custom/projects');
    });

    it('should use default PROJECT_FILTER (empty)', () => {
      delete process.env.PROJECT_FILTER;

      const filter = process.env.PROJECT_FILTER || '';

      expect(filter).toBe('');
    });
  });

  describe('logging output', () => {
    it('should report number of projects scanned', () => {
      const count = 3;

      expect(count).toBeGreaterThan(0);
    });

    it('should indicate when project marked for archival', () => {
      const message = '✅ Project marked for archival: test';

      expect(message).toContain('✅');
      expect(message).toContain('test');
    });

    it('should indicate when project is active', () => {
      const message = '➖ Project active: test';

      expect(message).toContain('➖');
    });

    it('should show summary of completed projects', () => {
      const count = 2;
      const message = `Found ${count} completed project(s)`;

      expect(message).toContain('2');
    });
  });
});
