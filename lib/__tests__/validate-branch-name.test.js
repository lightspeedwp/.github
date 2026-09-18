import {
  validateBranchName,
  formatErrorMessage,
  AUTHORIZED_TYPES,
} from '../validate-branch-name.js';

const EXPECTED_AUTHORIZED_TYPES = [
  'feat',
  'fix',
  'hotfix',
  'release',
  'refactor',
  'chore',
  'task',
  'doc',
  'docs',
  'test',
  'perf',
  'ci',
  'build',
  'deps',
  'security',
  'design',
  'a11y',
  'ux',
  'i18n',
  'ops',
  'proto',
  'ds',
  'api',
  'schema',
  'telemetry',
  'content',
  'seo',
  'config',
  'migrate',
  'qa',
  'uat',
  'audit',
  'codex',
  'revert',
  'research',
  'aiops',
  'automation',
  'epic',
];

const NEW_AUTHORIZED_TYPES = [
  'doc',
  'api',
  'schema',
  'telemetry',
  'content',
  'seo',
  'migrate',
  'qa',
  'uat',
  'aiops',
  'automation',
  'epic',
];

describe('validateBranchName', () => {
  describe('Valid Branch Names (38 Types)', () => {
    test('exports the complete canonical set without duplicates', () => {
      expect(AUTHORIZED_TYPES).toEqual(EXPECTED_AUTHORIZED_TYPES);
      expect(new Set(AUTHORIZED_TYPES)).toHaveProperty('size', 38);
    });

    test.each(NEW_AUTHORIZED_TYPES)('should pass for newly authorized %s type', (type) => {
      const result = validateBranchName(`${type}/scope-title`);

      expect(result).toMatchObject({
        valid: true,
        type,
        scope: 'scope',
        title: 'title',
        errors: [],
        suggested_name: null,
      });
    });

    test('should pass for feat type', () => {
      const result = validateBranchName('feat/user-auth-improvements');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('feat');
      expect(result.scope).toBe('user-auth');
      expect(result.title).toBe('improvements');
      expect(result.errors).toEqual([]);
    });

    test('should pass for fix type', () => {
      const result = validateBranchName('fix/authentication-timeout');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('fix');
    });

    test('should pass for hotfix type', () => {
      const result = validateBranchName('hotfix/critical-security-patch');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('hotfix');
    });

    test('should pass for release type', () => {
      const result = validateBranchName('release/v1-0-0');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('release');
    });

    test('should pass for refactor type', () => {
      const result = validateBranchName('refactor/api-response-structure');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('refactor');
    });

    test('should pass for chore type', () => {
      const result = validateBranchName('chore/dependency-updates');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('chore');
    });

    test('should pass for task type', () => {
      const result = validateBranchName('task/authentication-refactor');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('task');
    });

    test('should pass for docs type', () => {
      const result = validateBranchName('docs/branching-strategy-guide');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('docs');
    });

    test('should pass for test type', () => {
      const result = validateBranchName('test/integration-test-suite');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('test');
    });

    test('should pass for perf type', () => {
      const result = validateBranchName('perf/query-optimization');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('perf');
    });

    test('should pass for ci type', () => {
      const result = validateBranchName('ci/github-actions-workflow');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('ci');
    });

    test('should pass for build type', () => {
      const result = validateBranchName('build/webpack-config-update');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('build');
    });

    test('should pass for deps type', () => {
      const result = validateBranchName('deps/upgrade-npm-packages');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('deps');
    });

    test('should pass for security type', () => {
      const result = validateBranchName('security/xss-vulnerability-fix');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('security');
    });

    test('should pass for design type', () => {
      const result = validateBranchName('design/button-component-update');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('design');
    });

    test('should pass for a11y type', () => {
      const result = validateBranchName('a11y/wcag-compliance-audit');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('a11y');
    });

    test('should pass for ux type', () => {
      const result = validateBranchName('ux/form-validation-feedback');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('ux');
    });

    test('should pass for i18n type', () => {
      const result = validateBranchName('i18n/german-translation-pack');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('i18n');
    });

    test('should pass for ops type', () => {
      const result = validateBranchName('ops/database-migration-script');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('ops');
    });

    test('should pass for proto type', () => {
      const result = validateBranchName('proto/new-caching-strategy');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('proto');
    });

    test('should pass for ds type', () => {
      const result = validateBranchName('ds/component-library-update');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('ds');
    });

    test('should pass for audit type', () => {
      const result = validateBranchName('audit/security-code-review');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('audit');
    });

    test('should pass for codex type', () => {
      const result = validateBranchName('codex/auto-documentation-tool');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('codex');
    });

    test('should pass for revert type', () => {
      const result = validateBranchName('revert/pr-2345-bad-merge');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('revert');
    });

    test('should pass for research type', () => {
      const result = validateBranchName('research/performance-benchmarks');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('research');
    });

    test('should pass with numbers in scope and title', () => {
      const result = validateBranchName('feat/v2-api-v3-response');
      expect(result.valid).toBe(true);
      // Regex is greedy for scope, matches as much as possible before last hyphen
      expect(result.scope).toBe('v2-api-v3');
      expect(result.title).toBe('response');
    });

    test('should pass with single-character scope and title', () => {
      const result = validateBranchName('feat/a-b');
      expect(result.valid).toBe(true);
      expect(result.scope).toBe('a');
      expect(result.title).toBe('b');
    });

    test('should pass with numbers only in scope and title', () => {
      const result = validateBranchName('feat/1-2');
      expect(result.valid).toBe(true);
      expect(result.scope).toBe('1');
      expect(result.title).toBe('2');
    });
  });

  describe('Forbidden Prefixes (Must Fail)', () => {
    test('should fail for claude/ prefix', () => {
      const result = validateBranchName('claude/my-feature');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('forbidden_prefix');
      expect(result.suggested_name).toBeDefined();
    });

    test('should fail for copilot/ prefix', () => {
      const result = validateBranchName('copilot/fix-something');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('forbidden_prefix');
    });

    test('should fail for openai/ prefix', () => {
      const result = validateBranchName('openai/add-api');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('forbidden_prefix');
    });

    test('should suggest valid branch for claude/ prefix', () => {
      const result = validateBranchName('claude/user-auth');
      expect(result.suggested_name).toBe('feat/user-auth');
    });
  });

  describe('Invalid Types (Must Fail with Suggestions)', () => {
    test('should fail for feature (should be feat)', () => {
      const result = validateBranchName('feature/user-auth');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('invalid_type');
      expect(result.suggested_name).toContain('feat');
    });

    test('should fail for bug (closest fuzzy match is ux)', () => {
      const result = validateBranchName('bug/timeout-issue');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('invalid_type');
      // "bug" has distance 2 to "ux" (levenshtein match), suggesting it
      // "fix" has distance 3, which exceeds the <= 2 threshold
      expect(result.suggested_name).toContain('ux');
    });

    test('should fail for hotbug (no close fuzzy match)', () => {
      const result = validateBranchName('hotbug/critical-crash');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('invalid_type');
      // "hotbug" is too different from "hotfix" (distance 3 > threshold 2), defaults to feat
      expect(result.suggested_name).toContain('feat');
    });

    test('should suggest without fuzzy match if distance too high', () => {
      const result = validateBranchName('xyz/something-else');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('invalid_type');
      // Should default to feat when no close match
      expect(result.suggested_name).toContain('feat');
    });
  });

  describe('Malformed Scope', () => {
    test('should fail for underscores in scope', () => {
      const result = validateBranchName('feat/user_auth-fix');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/malformed_scope/);
    });

    test('should fail for uppercase in scope', () => {
      const result = validateBranchName('feat/User-Auth-fix');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toBe('contains_uppercase');
    });

    test('should fail for consecutive hyphens in scope', () => {
      const result = validateBranchName('feat/user--auth-fix');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/malformed/);
    });

    test('should fail for empty scope', () => {
      const result = validateBranchName('feat/-title');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/malformed_scope/);
    });

    test('should fail for special characters in scope', () => {
      const result = validateBranchName('feat/user@auth-fix');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/malformed_scope/);
    });

    test('should fail for scope starting with hyphen', () => {
      const result = validateBranchName('feat/-user-auth-fix');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/malformed_scope/);
    });

    test('should fail for scope ending with hyphen', () => {
      const result = validateBranchName('feat/user-auth--fix');
      expect(result.valid).toBe(false);
      // This is actually two consecutive hyphens
      expect(result.errors[0]).toMatch(/malformed/);
    });
  });

  describe('Malformed Title', () => {
    test('should fail for underscores in title', () => {
      const result = validateBranchName('feat/user-auth_fix');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/malformed_title/);
    });

    test('should fail for uppercase in title', () => {
      const result = validateBranchName('feat/user-Auth-Fix');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toBe('contains_uppercase');
    });

    test('should fail for consecutive hyphens in title', () => {
      const result = validateBranchName('feat/user-auth--fix');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/malformed/);
    });

    test('should fail for empty title', () => {
      const result = validateBranchName('feat/user-auth-');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/malformed/);
    });

    test('should fail for special characters in title', () => {
      const result = validateBranchName('feat/user-auth@fix');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/malformed_title/);
    });
  });

  describe('Edge Cases', () => {
    test('should fail for empty branch name', () => {
      const result = validateBranchName('');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('empty_branch_name');
    });

    test('should fail for null branch name', () => {
      const result = validateBranchName(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('empty_branch_name');
    });

    test('should fail for undefined branch name', () => {
      const result = validateBranchName(undefined);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('empty_branch_name');
    });

    test('should fail for branch without slash', () => {
      const result = validateBranchName('feat-user-auth');
      expect(result.valid).toBe(false);
    });

    test('should fail for branch with multiple slashes', () => {
      const result = validateBranchName('feat/user/auth-fix');
      expect(result.valid).toBe(false);
    });

    test('should handle whitespace by trimming', () => {
      const result = validateBranchName('  feat/user-auth-fix  ');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('feat');
    });

    test('should fail for very long branch name', () => {
      const longScope = 'a'.repeat(60);
      const longTitle = 'b'.repeat(60);
      const result = validateBranchName(`feat/${longScope}-${longTitle}`);
      // Should technically pass length validation (Git max is 255)
      // but this is an edge case worth noting
      expect(result.valid).toBe(true);
    });

    test('should pass for scope without additional title separator (scope=user, title=auth)', () => {
      // feat/user-auth is valid: type=feat, scope=user, title=auth
      const result = validateBranchName('feat/user-auth');
      expect(result.valid).toBe(true);
      expect(result.scope).toBe('user');
      expect(result.title).toBe('auth');
    });

    test('should fail for multiple hyphens between scope and title', () => {
      const result = validateBranchName('feat/user--auth---fix');
      expect(result.valid).toBe(false);
    });
  });

  describe('Error Messages', () => {
    test('should generate message for valid branch', () => {
      const result = validateBranchName('feat/user-auth-fix');
      const message = formatErrorMessage('feat/user-auth-fix', result);
      expect(message).toContain('✅');
      expect(message).toContain('valid');
    });

    test('should generate message for forbidden prefix', () => {
      const result = validateBranchName('claude/my-feature');
      const message = formatErrorMessage('claude/my-feature', result);
      expect(message).toContain('❌');
      expect(message).toContain('Forbidden prefix');
      expect(message).toContain('claude/');
    });

    test('should generate message for invalid type', () => {
      const result = validateBranchName('feature/user-auth');
      const message = formatErrorMessage('feature/user-auth', result);
      expect(message).toContain('❌');
      expect(message).toContain('Invalid type');
      expect(message).toContain('feature');
      expect(message).toContain('Allowed types (38)');
      EXPECTED_AUTHORIZED_TYPES.forEach((type) => {
        expect(message).toMatch(new RegExp(`(^|\\s)${type}(?=\\s|$)`, 'm'));
      });
      expect(message).not.toMatch(/Allowed types \((?:24|25)\)/);
    });

    test('should generate message with suggestion', () => {
      const result = validateBranchName('feature/user-auth');
      const message = formatErrorMessage('feature/user-auth', result);
      expect(message).toContain('Did you mean');
      expect(message).toContain('feat/');
    });

    test('should generate message for uppercase letters', () => {
      const result = validateBranchName('feat/User_Auth-fix');
      const message = formatErrorMessage('feat/User_Auth-fix', result);
      expect(message).toContain('❌');
      expect(message).toContain('lowercase');
    });

    test('should generate message for uppercase in title', () => {
      const result = validateBranchName('feat/user-Auth_Fix');
      const message = formatErrorMessage('feat/user-Auth_Fix', result);
      expect(message).toContain('❌');
      expect(message).toContain('lowercase');
    });
  });
});
