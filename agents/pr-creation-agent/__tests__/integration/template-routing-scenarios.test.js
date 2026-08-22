// Category C: Template Routing Scenarios (8 tests)
// Test PR template selection for all branch types

import { describe, test, expect, beforeEach } from '@jest/globals';
import { routePrTemplate } from '../../skills/route-pr-template.js';
import { MockGitHub, createMockConfig } from './setup.js';

describe('Category C: Template Routing Scenarios', () => {
  let mockGitHub;
  let config;

  beforeEach(() => {
    mockGitHub = new MockGitHub();
    config = createMockConfig();
  });

  test('Test C1: feat/ branch → pr_feature.md template', async () => {
    const branchName = 'feat/new-feature';

    const result = await routePrTemplate({
      branchName,
      config,
    });

    expect(result.routed).toBe(true);
    expect(result.template).toBe('pr_feature.md');
    expect(result.reason).toBe('feat-type-matched');
  });

  test('Test C2: fix/ branch → pr_bug.md template', async () => {
    const branchName = 'fix/bug-fix';

    const result = await routePrTemplate({
      branchName,
      config,
    });

    expect(result.routed).toBe(true);
    expect(result.template).toBe('pr_bug.md');
    expect(result.reason).toBe('fix-type-matched');
  });

  test('Test C3: hotfix/ branch → pr_hotfix.md template', async () => {
    const branchName = 'hotfix/critical-security';

    const result = await routePrTemplate({
      branchName,
      config,
    });

    expect(result.routed).toBe(true);
    expect(result.template).toBe('pr_hotfix.md');
    expect(result.reason).toBe('hotfix-type-matched');
  });

  test('Test C4: docs/ branch → pr_docs.md template', async () => {
    const branchName = 'docs/branching-strategy';

    const result = await routePrTemplate({
      branchName,
      config,
    });

    expect(result.routed).toBe(true);
    expect(result.template).toBe('pr_docs.md');
    expect(result.reason).toBe('docs-type-matched');
  });

  test('Test C5: chore/ branch → pr_chore.md template', async () => {
    const branchName = 'chore/dependency-update';

    const result = await routePrTemplate({
      branchName,
      config,
    });

    expect(result.routed).toBe(true);
    expect(result.template).toBe('pr_chore.md');
    expect(result.reason).toBe('chore-type-matched');
  });

  test('Test C6: test/ branch → pr_chore.md template', async () => {
    const branchName = 'test/add-unit-tests';

    const result = await routePrTemplate({
      branchName,
      config,
    });

    expect(result.routed).toBe(true);
    expect(result.template).toBe('pr_chore.md');
    expect(result.reason).toBe('test-type-matched');
  });

  test('Test C7: refactor/ branch → pr_refactor.md template', async () => {
    const branchName = 'refactor/simplify-validation';

    const result = await routePrTemplate({
      branchName,
      config,
    });

    expect(result.routed).toBe(true);
    expect(result.template).toBe('pr_refactor.md');
    expect(result.reason).toBe('refactor-type-matched');
  });

  test('Test C8: Unknown branch type → Default template with warning', async () => {
    const branchName = 'unknown/branch-type';

    const result = await routePrTemplate({
      branchName,
      config,
    });

    expect(result.routed).toBe(false);
    expect(result.fallback).toBe(true);
    expect(result.template).toBe('pull_request_template.md');
    expect(result.warning).toBeDefined();
  });
});
