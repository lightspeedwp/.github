/**
 * Jest test suite for PR template router
 * Tests branch type extraction, template routing, and label assignment
 */

import {
  loadConfig,
  extractBranchType,
  getTemplate,
  getLabels,
  extractScope,
  getAreaLabels,
  routePR,
} from '../pr-template-router.js';
import fs from 'fs';

jest.mock('fs');
jest.mock('js-yaml');

describe('PR Template Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('extractBranchType', () => {
    test.each([
      ['feat/user-dashboard', 'feat'],
      ['fix/navigation-bug', 'fix'],
      ['docs/api-reference', 'docs'],
      ['test/e2e-suite', 'test'],
      ['chore/dependencies', 'chore'],
      ['release/v1.0.0', 'release'],
      ['ci/github-actions', 'ci'],
      ['build/webpack-config', 'build'],
      ['perf/image-optimization', 'perf'],
      ['security/xss-fix', 'security'],
      ['hotfix/critical-issue', 'hotfix'],
      ['refactor/api-structure', 'refactor'],
      ['task/epic-work', 'task'],
      ['a11y/wcag-compliance', 'a11y'],
      ['design/button-component', 'design'],
      ['ux/form-validation', 'ux'],
      ['i18n/german-pack', 'i18n'],
      ['ops/database-migration', 'ops'],
      ['audit/security-review', 'audit'],
      ['research/benchmarks', 'research'],
      ['api/rest-endpoints', 'api'],
      ['schema/user-model', 'schema'],
      ['telemetry/event-tracking', 'telemetry'],
      ['content/blog-posts', 'content'],
      ['seo/meta-tags', 'seo'],
      ['config/environment', 'config'],
      ['migrate/user-table', 'migrate'],
      ['qa/test-automation', 'qa'],
      ['uat/staging-validation', 'uat'],
      ['codex/auto-docs', 'codex'],
      ['aiops/model-monitoring', 'aiops'],
      ['automation/issue-routing', 'automation'],
      ['epic/platform-modernization', 'epic'],
      ['proto/new-cache', 'proto'],
      ['ds/component-library', 'ds'],
      ['doc/readme-update', 'doc'],
      ['revert/pr-123', 'revert'],
      ['deps/npm-update', 'deps'],
    ])('should extract "%s" as "%s"', (branch, expectedType) => {
      const result = extractBranchType(branch);
      expect(result).toBe(expectedType);
    });

    test('should return null for branch without slash', () => {
      expect(extractBranchType('nobranch')).toBeNull();
    });

    test('should return null for empty string', () => {
      expect(extractBranchType('')).toBeNull();
    });

    test('should handle numbers in type', () => {
      expect(extractBranchType('feat123/branch')).toBe('feat123');
    });
  });

  describe('extractScope', () => {
    test.each([
      ['feat/user-dashboard', 'user-dashboard'],
      ['fix/navigation-bug', 'navigation-bug'],
      ['docs/api-reference-guide', 'api-reference-guide'],
      ['test/e2e-checkout-flow', 'e2e-checkout-flow'],
      ['chore/update-all-deps', 'update-all-deps'],
    ])('should extract scope from "%s" as "%s"', (branch, expectedScope) => {
      const result = extractScope(branch);
      expect(result).toBe(expectedScope);
    });

    test('should return empty string for branch without slash', () => {
      expect(extractScope('nobranch')).toBe('');
    });

    test('should handle multiple hyphens in scope', () => {
      expect(extractScope('feat/user-dashboard-dark-mode-v2')).toBe('user-dashboard-dark-mode-v2');
    });
  });

  describe('getTemplate', () => {
    test('should return mapped template for known branch type', () => {
      const typesConfig = {
        branch_types: {
          feat: { template: 'pr_feature' },
          fix: { template: 'pr_bugfix' },
          docs: { template: 'pr_docs' },
        },
        fallback_template: 'pr_default',
      };
      expect(getTemplate('feat', typesConfig)).toBe('pr_feature');
      expect(getTemplate('fix', typesConfig)).toBe('pr_bugfix');
      expect(getTemplate('docs', typesConfig)).toBe('pr_docs');
    });

    test('should return fallback template for unknown type', () => {
      const typesConfig = {
        branch_types: {
          feat: { template: 'pr_feature' },
        },
        fallback_template: 'pr_default',
      };
      expect(getTemplate('unknown', typesConfig)).toBe('pr_default');
    });

    test('should use fallback if type config lacks template', () => {
      const typesConfig = {
        branch_types: {
          feat: {}, // No template field
        },
        fallback_template: 'pr_generic',
      };
      expect(getTemplate('feat', typesConfig)).toBe('pr_generic');
    });

    test('should return "pr_feature" as ultimate fallback', () => {
      expect(getTemplate('feat', null)).toBe('pr_feature');
      expect(getTemplate('feat', {})).toBe('pr_feature');
      expect(getTemplate('feat', { branch_types: {} })).toBe('pr_feature');
    });

    test('should handle undefined config gracefully', () => {
      expect(getTemplate('feat', undefined)).toBe('pr_feature');
    });
  });

  describe('getLabels', () => {
    test('should return labels for known branch type', () => {
      const labelsConfig = {
        branch_labels: {
          feat: { default_labels: ['type:feature', 'priority:normal'] },
          fix: { default_labels: ['type:bug', 'priority:high'] },
          docs: { default_labels: ['type:documentation'] },
        },
      };
      expect(getLabels('feat', labelsConfig)).toEqual(['type:feature', 'priority:normal']);
      expect(getLabels('fix', labelsConfig)).toEqual(['type:bug', 'priority:high']);
      expect(getLabels('docs', labelsConfig)).toEqual(['type:documentation']);
    });

    test('should return empty array for unknown type', () => {
      const labelsConfig = {
        branch_labels: {
          feat: { default_labels: ['type:feature'] },
        },
      };
      expect(getLabels('unknown', labelsConfig)).toEqual([]);
    });

    test('should return empty array if type has no default_labels', () => {
      const labelsConfig = {
        branch_labels: {
          feat: {}, // No default_labels
        },
      };
      expect(getLabels('feat', labelsConfig)).toEqual([]);
    });

    test('should handle missing config gracefully', () => {
      expect(getLabels('feat', null)).toEqual([]);
      expect(getLabels('feat', {})).toEqual([]);
      expect(getLabels('feat', { branch_labels: null })).toEqual([]);
    });
  });

  describe('getAreaLabels', () => {
    test('should identify area labels based on scope keywords', () => {
      const labelsConfig = {
        area_keywords_reference: {
          ui: {
            label: 'area:ui',
            keywords: ['button', 'form', 'input'],
          },
          api: {
            label: 'area:api',
            keywords: ['endpoint', 'rest', 'graphql'],
          },
          docs: {
            label: 'area:docs',
            keywords: ['doc', 'readme', 'guide'],
          },
        },
        branch_labels: {},
      };

      expect(getAreaLabels('button-styling', labelsConfig)).toEqual(['area:ui']);
      expect(getAreaLabels('form-validation', labelsConfig)).toEqual(['area:ui']);
      expect(getAreaLabels('rest-endpoint-versioning', labelsConfig)).toEqual(['area:api']);
      expect(getAreaLabels('readme-update-guide', labelsConfig)).toEqual(['area:docs']);
    });

    test('should handle multiple matching area labels', () => {
      const labelsConfig = {
        area_keywords_reference: {
          ui: {
            label: 'area:ui',
            keywords: ['button'],
          },
          forms: {
            label: 'area:forms',
            keywords: ['button', 'input'],
          },
        },
        branch_labels: {},
      };

      const result = getAreaLabels('button-form-input', labelsConfig);
      expect(result).toContain('area:ui');
      expect(result).toContain('area:forms');
      expect(result.length).toBe(2);
    });

    test('should deduplicate area labels', () => {
      const labelsConfig = {
        area_keywords_reference: {
          ui: {
            label: 'area:ui',
            keywords: ['button', 'form'],
          },
        },
        branch_labels: {},
      };

      const result = getAreaLabels('button-form-button', labelsConfig);
      expect(result).toEqual(['area:ui']);
      expect(result.length).toBe(1);
    });

    test('should return empty array for empty scope', () => {
      const labelsConfig = {
        area_keywords_reference: {
          ui: {
            label: 'area:ui',
            keywords: ['button'],
          },
        },
        branch_labels: {},
      };

      expect(getAreaLabels('', labelsConfig)).toEqual([]);
      expect(getAreaLabels(null, labelsConfig)).toEqual([]);
    });

    test('should return empty array for missing config', () => {
      expect(getAreaLabels('scope', null)).toEqual([]);
      expect(getAreaLabels('scope', {})).toEqual([]);
      expect(getAreaLabels('scope', { branch_labels: {} })).toEqual([]);
    });

    test('should handle malformed area_keywords_reference', () => {
      const labelsConfig = {
        area_keywords_reference: {
          ui: {
            label: 'area:ui',
            // Missing keywords array
          },
        },
        branch_labels: {},
      };

      expect(getAreaLabels('button', labelsConfig)).toEqual([]);
    });
  });

  describe('loadConfig', () => {
    test('should load and parse YAML file', () => {
      const yaml = require('js-yaml');
      fs.readFileSync.mockReturnValue('key: value\ntype: test');
      yaml.load.mockReturnValue({ key: 'value', type: 'test' });

      const result = loadConfig('test.yml');
      expect(result).toEqual({ key: 'value', type: 'test' });
      expect(fs.readFileSync).toHaveBeenCalledWith('test.yml', 'utf8');
    });

    test('should return null if file does not exist', () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error('ENOENT');
      });

      const result = loadConfig('missing.yml');
      expect(result).toBeNull();
    });

    test('should return null if YAML parsing fails', () => {
      const yaml = require('js-yaml');
      fs.readFileSync.mockReturnValue('invalid: [yaml');
      yaml.load.mockImplementation(() => {
        throw new Error('Invalid YAML');
      });

      const result = loadConfig('invalid.yml');
      expect(result).toBeNull();
    });
  });

  describe('routePR', () => {
    test('should route a complete PR branch correctly', () => {
      const yaml = require('js-yaml');
      const typesConfig = {
        branch_types: {
          feat: { template: 'pr_feature' },
          fix: { template: 'pr_bugfix' },
        },
        fallback_template: 'pr_feature',
      };
      const labelsConfig = {
        branch_labels: {
          feat: { default_labels: ['type:feature', 'priority:normal'] },
          fix: { default_labels: ['type:bug', 'priority:high'] },
        },
        area_keywords_reference: {
          ui: {
            label: 'area:ui',
            keywords: ['button', 'form'],
          },
        },
      };

      fs.readFileSync.mockImplementation((file) => {
        if (file.includes('branch-types')) return JSON.stringify(typesConfig);
        if (file.includes('branch-labels')) return JSON.stringify(labelsConfig);
      });
      yaml.load.mockImplementation((content) => {
        return JSON.parse(content);
      });

      const result = routePR('feat/button-styling');

      expect(result.branch_type).toBe('feat');
      expect(result.template).toBe('pr_feature');
      expect(result.scope).toBe('button-styling');
      expect(result.default_labels).toEqual(['type:feature', 'priority:normal']);
      expect(result.area_labels).toContain('area:ui');
      expect(result.all_labels).toContain('type:feature');
      expect(result.all_labels).toContain('area:ui');
    });

    test('should throw error if branch-types.yml is missing', () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      expect(() => routePR('feat/test')).toThrow('Failed to load branch-types.yml');
    });

    test('should throw error if branch-labels.yml is missing', () => {
      const yaml = require('js-yaml');
      fs.readFileSync.mockImplementation((file) => {
        if (file.includes('branch-types')) return 'key: value';
        throw new Error('File not found');
      });
      yaml.load.mockReturnValue({ branch_types: { feat: {} } });

      expect(() => routePR('feat/test')).toThrow('Failed to load branch-labels.yml');
    });

    test('should throw error if branch name lacks type', () => {
      const yaml = require('js-yaml');
      fs.readFileSync.mockReturnValue('{}');
      yaml.load.mockReturnValue({});

      expect(() => routePR('no-type-here')).toThrow('Could not extract branch type');
    });

    test('should deduplicate labels across default and area labels', () => {
      const yaml = require('js-yaml');
      const typesConfig = {
        branch_types: {
          feat: { template: 'pr_feature' },
        },
      };
      const labelsConfig = {
        branch_labels: {
          feat: { default_labels: ['area:ui', 'type:feature'] },
        },
        area_keywords_reference: {
          ui: {
            label: 'area:ui',
            keywords: ['button'],
          },
        },
      };

      fs.readFileSync.mockImplementation((file) => {
        if (file.includes('branch-types')) return JSON.stringify(typesConfig);
        if (file.includes('branch-labels')) return JSON.stringify(labelsConfig);
      });
      yaml.load.mockImplementation((content) => {
        return JSON.parse(content);
      });

      const result = routePR('feat/button-update');

      // Should have area:ui only once even though it appears in both default and area labels
      const areaUiCount = result.all_labels.filter((l) => l === 'area:ui').length;
      expect(areaUiCount).toBe(1);
    });
  });
});
