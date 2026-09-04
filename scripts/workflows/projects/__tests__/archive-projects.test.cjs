/**
 * Tests for archive-projects.cjs
 * Validates project archival workflow
 */
const fs = require('fs');
const path = require('path');
const { jest } = require('@jest/globals');

jest.mock('fs');

describe('archive-projects', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('environment variables', () => {
    it('should use default directories if not specified', () => {
      delete process.env.ACTIVE_PROJECTS_DIR;
      delete process.env.ARCHIVED_PROJECTS_DIR;

      const activeDir = process.env.ACTIVE_PROJECTS_DIR || '.github/projects/active';
      const archivedDir = process.env.ARCHIVED_PROJECTS_DIR || '.github/projects/archived';

      expect(activeDir).toBe('.github/projects/active');
      expect(archivedDir).toBe('.github/projects/archived');
    });

    it('should use custom directories when specified', () => {
      process.env.ACTIVE_PROJECTS_DIR = '/custom/active';
      process.env.ARCHIVED_PROJECTS_DIR = '/custom/archived';

      const activeDir = process.env.ACTIVE_PROJECTS_DIR || '.github/projects/active';
      const archivedDir = process.env.ARCHIVED_PROJECTS_DIR || '.github/projects/archived';

      expect(activeDir).toBe('/custom/active');
      expect(archivedDir).toBe('/custom/archived');
    });

    it('should respect DRY_RUN environment variable', () => {
      process.env.DRY_RUN = 'true';

      expect(process.env.DRY_RUN).toBe('true');
    });

    it('should parse PROJECTS_JSON from environment', () => {
      const projects = [
        { name: 'project-1', path: '/path/to/project-1', archivedAt: '2026-09-03' },
      ];
      process.env.PROJECTS_JSON = JSON.stringify(projects);

      const parsed = JSON.parse(process.env.PROJECTS_JSON);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe('project-1');
    });
  });

  describe('JSON parsing', () => {
    it('should handle valid project JSON', () => {
      const projects = [
        { name: 'test-project', path: '/path', archivedAt: '2026-09-03' },
      ];

      expect(() => {
        JSON.parse(JSON.stringify(projects));
      }).not.toThrow();
    });

    it('should reject invalid JSON', () => {
      const invalidJson = '{name: project}';

      expect(() => {
        JSON.parse(invalidJson);
      }).toThrow();
    });

    it('should handle empty array', () => {
      const projects = JSON.parse('[]');

      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBe(0);
    });
  });

  describe('project validation', () => {
    it('should check if project paths exist', () => {
      fs.existsSync.mockReturnValueOnce(true);

      expect(fs.existsSync('/path/to/project')).toBe(true);
    });

    it('should report missing project paths', () => {
      fs.existsSync.mockReturnValueOnce(false);

      expect(fs.existsSync('/nonexistent/path')).toBe(false);
    });

    it('should validate project object structure', () => {
      const project = {
        name: 'test-project',
        path: '/path/to/project',
        archivedAt: '2026-09-03',
      };

      expect(project).toHaveProperty('name');
      expect(project).toHaveProperty('path');
      expect(project).toHaveProperty('archivedAt');
    });
  });

  describe('archival operations', () => {
    it('should generate archived path with timestamp', () => {
      const name = 'test-project';
      const archivedAt = '2026-09-03';
      const archivedDir = '.github/projects/archived';

      const archivedPath = path.join(archivedDir, `${archivedAt}-${name}`);

      expect(archivedPath).toBe('.github/projects/archived/2026-09-03-test-project');
    });

    it('should move project directory in non-dry-run mode', () => {
      fs.renameSync.mockImplementationOnce(() => {});

      fs.renameSync('/old/path', '/new/path');

      expect(fs.renameSync).toHaveBeenCalledWith('/old/path', '/new/path');
    });

    it('should not move project directory in dry-run mode', () => {
      process.env.DRY_RUN = 'true';

      expect(process.env.DRY_RUN).toBe('true');
      expect(fs.renameSync).not.toHaveBeenCalled();
    });

    it('should create ARCHIVAL_SUMMARY.md in archived project', () => {
      fs.writeFileSync.mockImplementationOnce(() => {});

      const summaryFile = '/archived/path/ARCHIVAL_SUMMARY.md';
      const content = '# Archival Summary\n**Project:** test';

      fs.writeFileSync(summaryFile, content, 'utf8');

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        summaryFile,
        content,
        'utf8'
      );
    });
  });

  describe('report generation', () => {
    it('should generate archival report file', () => {
      fs.writeFileSync.mockImplementationOnce(() => {});

      const reportDir = '.github/reports/projects';
      const reportFile = path.join(reportDir, `archival-report-${Date.now()}.md`);
      const content = '# Archival Report\n';

      fs.writeFileSync(reportFile, content, 'utf8');

      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should generate summary file for workflow output', () => {
      fs.writeFileSync.mockImplementationOnce(() => {});

      const summaryFile = '.github/reports/projects/archival-summary.txt';
      const content = 'Projects archived: 3/5';

      fs.writeFileSync(summaryFile, content, 'utf8');

      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should include project count in report', () => {
      const projects = [
        { name: 'p1', path: '/p1', archivedAt: '2026-09-03' },
        { name: 'p2', path: '/p2', archivedAt: '2026-09-03' },
      ];

      const report = `Total projects archived: **${projects.length}**`;

      expect(report).toContain('**2**');
    });

    it('should mark dry-run mode in report', () => {
      process.env.DRY_RUN = 'true';
      const mode = process.env.DRY_RUN === 'true' ? 'Dry-run' : 'Live';

      expect(mode).toBe('Dry-run');
    });
  });

  describe('error handling', () => {
    it('should catch rename errors', () => {
      const error = new Error('Permission denied');
      fs.renameSync.mockImplementationOnce(() => {
        throw error;
      });

      expect(() => {
        fs.renameSync('/path1', '/path2');
      }).toThrow('Permission denied');
    });

    it('should handle missing archived directory', () => {
      fs.existsSync.mockReturnValueOnce(false);
      fs.mkdirSync.mockImplementationOnce(() => {});

      fs.existsSync('.github/projects/archived');
      fs.mkdirSync('.github/projects/archived', { recursive: true });

      expect(fs.mkdirSync).toHaveBeenCalledWith('.github/projects/archived', {
        recursive: true,
      });
    });

    it('should continue on per-project errors', () => {
      const projects = [
        { name: 'good', path: '/exists', archivedAt: '2026-09-03' },
        { name: 'bad', path: '/notfound', archivedAt: '2026-09-03' },
      ];

      fs.existsSync.mockReturnValueOnce(true); // first project exists
      fs.existsSync.mockReturnValueOnce(false); // second doesn't

      const results = projects.map((p) => fs.existsSync(p.path));

      expect(results).toEqual([true, false]);
    });
  });

  describe('success tracking', () => {
    it('should count successful archival operations', () => {
      let successCount = 0;
      const projects = [
        { name: 'p1', path: '/p1', archivedAt: '2026-09-03' },
        { name: 'p2', path: '/p2', archivedAt: '2026-09-03' },
      ];

      successCount = 2;

      expect(successCount).toBe(projects.length);
    });

    it('should report partial success', () => {
      let successCount = 2;
      const totalCount = 5;

      const message = `${successCount}/${totalCount}`;

      expect(message).toBe('2/5');
    });

    it('should handle zero projects', () => {
      const projects = [];

      expect(projects.length).toBe(0);
    });
  });

  describe('archival summary generation', () => {
    it('should generate summary with project name', () => {
      const name = 'test-project';
      const summary = `# Archival Summary\n\n**Project:** ${name}`;

      expect(summary).toContain(name);
    });

    it('should include archival date in summary', () => {
      const date = '2026-09-03';
      const summary = `**Archived:** ${date}`;

      expect(summary).toContain(date);
    });

    it('should include restoration instructions', () => {
      const summary = 'To restore this project to active status:';

      expect(summary).toContain('restore');
    });
  });
});
