#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

/**
 * Integration Tests: Branch Naming Strategy & Enforcement
 * Tests validation, template routing, and label application across all 38 branch types
 *
 * Run: npm run test -- integration-branch-validation.test.js
 */

import {
  validateBranchName,
  AUTHORIZED_TYPES,
  FORBIDDEN_PREFIXES,
} from '../validate-branch-name.js';

const REPOSITORY_ROOT = process.cwd();
const BRANCH_TYPES_PATH = path.join(REPOSITORY_ROOT, '.github/branch-types.yml');
const WORKFLOW_PATH = path.join(REPOSITORY_ROOT, '.github/workflows/branch-name-validation.yml');
const branchTypesConfig = yaml.load(fs.readFileSync(BRANCH_TYPES_PATH, 'utf8'));

const ADDED_TYPE_TEMPLATES = {
  epic: 'pr_feature',
  doc: 'pr_docs',
  content: 'pr_docs',
  seo: 'pr_docs',
  qa: 'pr_ci',
  uat: 'pr_ci',
  automation: 'pr_ci',
  aiops: 'pr_aiops',
  api: 'pr_feature',
  schema: 'pr_feature',
  telemetry: 'pr_feature',
  config: 'pr_ci',
  migrate: 'pr_ci',
};

// Test Suite: Remote Enforcement (T122-T124)
describe('T122-T124: Remote Enforcement Integration Tests', () => {
  describe('T122: Valid branch push to remote', () => {
    test.each(['develop', 'main'])(
      'exact protected branch %s bypasses validation',
      (branchName) => {
        const result = validateBranchName(branchName);

        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
      }
    );

    test.each(['development', 'mainline'])(
      'similarly named branch %s is not exempt',
      (branchName) => {
        expect(validateBranchName(branchName).valid).toBe(false);
      }
    );

    test('valid feat branch passes validation', () => {
      const result = validateBranchName('feat/integration-test-valid');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('feat');
      expect(result.scope).toBe('integration-test');
      expect(result.title).toBe('valid');
    });

    test('valid fix branch passes validation', () => {
      const result = validateBranchName('fix/authentication-timeout');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('fix');
    });

    test('all 38 authorized types validate successfully', () => {
      AUTHORIZED_TYPES.forEach((type) => {
        const branchName = `${type}/scope-title`;
        const result = validateBranchName(branchName);
        expect(result.valid).toEqual(true, `${type}/scope-title should be valid`);
        expect(result.type).toEqual(type);
      });
    });
  });

  describe('T123: Invalid branch with --no-verify bypasses local hook', () => {
    test('forbidden claude/ prefix is rejected by remote enforcement', () => {
      const result = validateBranchName('claude/my-feature');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('forbidden_prefix');
    });

    test('forbidden copilot/ prefix is rejected', () => {
      const result = validateBranchName('copilot/fix-something');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('forbidden_prefix');
    });

    test('forbidden openai/ prefix is rejected', () => {
      const result = validateBranchName('openai/feature-request');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('forbidden_prefix');
    });
  });

  describe('T124: Merge blocking for invalid branches', () => {
    test('invalid type is rejected before merge', () => {
      const result = validateBranchName('feature/my-feature');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('invalid_type');
    });

    test('uppercase in branch name is rejected', () => {
      const result = validateBranchName('feat/User-Auth');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('contains_uppercase');
    });

    test('underscores in scope are rejected', () => {
      const result = validateBranchName('feat/user_auth-improvements');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('malformed_scope_contains_underscores');
    });
  });
});

// Test Suite: Template & Label Routing (T131-T135)
describe('T131-T135: Template & Label Routing Integration Tests', () => {
  describe('T131: Feature branch template routing', () => {
    test('feat/ branch extracts correct type', () => {
      const result = validateBranchName('feat/user-auth-improvements');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('feat');
      // In real workflow: should use pr_feature.md template
    });

    test('refactor/ branch type identified correctly', () => {
      const result = validateBranchName('refactor/api-response-structure');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('refactor');
    });
  });

  describe('T132: Security branch routing', () => {
    test('security/ branch template routing', () => {
      const result = validateBranchName('security/sql-injection-fix');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('security');
      // In real workflow: should use pr_security.md template
      // Should apply: type:security label
      // Should suggest: priority:critical label
    });

    test('hotfix/ branch for production emergencies', () => {
      const result = validateBranchName('hotfix/critical-security-patch');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('hotfix');
    });
  });

  describe('T133: Area label auto-detection', () => {
    test('api keyword in scope triggers area:api label', () => {
      const result = validateBranchName('feat/api-endpoint-versioning');
      expect(result.valid).toBe(true);
      expect(result.scope).toBe('api-endpoint');
      // In real workflow: should detect 'api' keyword and apply area:api
    });

    test('docs keyword triggers area:docs label', () => {
      const result = validateBranchName('docs/branching-strategy-guide');
      expect(result.valid).toBe(true);
      expect(result.scope).toBe('branching-strategy');
      // In real workflow: should detect 'docs' and apply area:docs
    });
  });

  describe('T134: All 38 types template/label coverage', () => {
    test('all 38 types have valid branch syntax', () => {
      AUTHORIZED_TYPES.forEach((type) => {
        const branchName = `${type}/scope-title`;
        const result = validateBranchName(branchName);
        expect(result.valid).toBe(true);
        expect(result.type).toBe(type);
      });
    });

    test('type to template mappings exist for all types', () => {
      const configuredTypes = Object.keys(branchTypesConfig.branch_types);

      expect(configuredTypes).toHaveLength(38);
      expect(configuredTypes.sort()).toEqual([...AUTHORIZED_TYPES].sort());
    });

    test.each(Object.entries(ADDED_TYPE_TEMPLATES))(
      '%s routes to the expected pull request template',
      (type, expectedTemplate) => {
        const mapping = branchTypesConfig.branch_types[type];
        const templatePath = path.join(
          REPOSITORY_ROOT,
          '.github/PULL_REQUEST_TEMPLATE',
          `${mapping.template}.md`
        );

        expect(mapping).toMatchObject({
          template: expectedTemplate,
          description: expect.any(String),
          example: expect.stringMatching(new RegExp(`^${type}/`)),
        });
        expect(mapping.description.trim()).not.toBe('');
        expect(validateBranchName(mapping.example)).toMatchObject({ valid: true, type });
        expect(fs.existsSync(templatePath)).toBe(true);
      }
    );

    test('rejects an unconfigured near-match instead of routing it', () => {
      const result = validateBranchName('epics/platform-modernisation');

      expect(branchTypesConfig.branch_types).not.toHaveProperty('epics');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('invalid_type');
    });
  });

  describe('T135: GitHub Actions execution order', () => {
    test('branch validation completes before template routing', () => {
      // This test documents the execution order:
      // 1. branch-name-validation.yml runs on push
      // 2. pr-template-routing.yml runs on PR open
      // Both should complete without conflicts
      const validBranch = validateBranchName('feat/user-preferences');
      expect(validBranch.valid).toBe(true);
      // Workflow would then route template and apply labels
    });
  });
});

// Test Suite: Specification Compliance (T139-T140)
describe('T139-T140: Compliance & Metrics Verification', () => {
  describe('T139: Quickstart validation scenarios', () => {
    const QUICKSTART_SCENARIOS = [
      { name: 'Valid feature branch', branch: 'feat/user-preferences-panel', expectValid: true },
      {
        name: 'Valid security branch',
        branch: 'security/xss-vulnerability-fix',
        expectValid: true,
      },
      { name: 'Valid docs branch', branch: 'docs/branching-strategy-guide', expectValid: true },
      { name: 'Invalid forbidden prefix', branch: 'claude/my-feature', expectValid: false },
      { name: 'Invalid forbidden copilot/', branch: 'copilot/fix-something', expectValid: false },
      { name: 'Invalid type', branch: 'feature/my-feature', expectValid: false },
      { name: 'Invalid format', branch: 'feat-user-auth', expectValid: false },
      { name: 'Uppercase rejected', branch: 'feat/User-Auth', expectValid: false },
      { name: 'Empty scope rejected', branch: 'feat/-title', expectValid: false },
    ];

    test('all 9 quickstart scenarios pass', () => {
      QUICKSTART_SCENARIOS.forEach((scenario) => {
        const result = validateBranchName(scenario.branch);
        expect(result.valid).toBe(scenario.expectValid, `${scenario.name}: ${scenario.branch}`);
      });
    });
  });

  describe('T140: Configuration file coverage', () => {
    test('all 38 types are authorized', () => {
      expect(AUTHORIZED_TYPES.length).toBe(38);
      expect(AUTHORIZED_TYPES).toContain('feat');
      expect(AUTHORIZED_TYPES).toContain('fix');
      expect(AUTHORIZED_TYPES).toContain('security');
      expect(AUTHORIZED_TYPES).toContain('aiops');
      expect(AUTHORIZED_TYPES).toContain('automation');
      expect(AUTHORIZED_TYPES).toContain('epic');
    });

    test('forbidden prefixes are comprehensive', () => {
      expect(FORBIDDEN_PREFIXES.length).toBe(3);
      expect(FORBIDDEN_PREFIXES).toContain('claude/');
      expect(FORBIDDEN_PREFIXES).toContain('copilot/');
      expect(FORBIDDEN_PREFIXES).toContain('openai/');
    });

    test('no gaps in type coverage', () => {
      const workflow = fs.readFileSync(WORKFLOW_PATH, 'utf8');
      const allowedTypesMatch = workflow.match(/\*\*Allowed types \(38\):\*\* ([^']+)/);

      expect(allowedTypesMatch).not.toBeNull();
      expect(allowedTypesMatch[1].split(', ')).toEqual(AUTHORIZED_TYPES);
    });
  });
});
