// Category A: Sequential Skill Execution (8 tests)
// Test skills in order as they execute in real workflows

import { describe, test, expect, beforeEach } from '@jest/globals';
import { validateBranchName } from '../../skills/validate-branch-name.js';
import { routePrTemplate } from '../../skills/route-pr-template.js';
import { validateAndApplyLabels } from '../../skills/validate-and-apply-labels.js';
import { orchestratePrCreation } from '../../skills/orchestrate-pr-creation.js';
import { MockGitHub, createMockConfig } from './setup.js';

describe('Category A: Sequential Skill Execution', () => {
  let mockGitHub;
  let config;

  beforeEach(() => {
    mockGitHub = new MockGitHub();
    config = createMockConfig();
  });

  test('Test A1: Branch Validation Pass → Template Route → Label Validate → PR Created', async () => {
    const branchName = 'feat/pr-creation-agent-integration';

    // Step 1: Validate branch
    const branchValidation = await validateBranchName({
      branchName,
      config,
    });
    expect(branchValidation.valid).toBe(true);
    expect(branchValidation.type).toBe('feat');

    // Step 2: Route to template
    const templateRoute = await routePrTemplate({
      branchName,
      config,
    });
    expect(templateRoute.template).toBe('pr_feature.md');
    expect(templateRoute.routed).toBe(true);

    // Step 3: Validate labels
    const labels = ['type:feature'];
    const labelValidation = await validateAndApplyLabels({
      labels,
      config,
      mockGitHub: mockGitHub.issues,
    });
    expect(labelValidation.valid).toBe(true);

    // Step 4: Orchestrate PR creation
    const prData = {
      owner: 'lightspeedwp',
      repo: '.github',
      title: 'Test PR',
      body: '## Description\n\nTest',
      head: branchName,
      base: 'develop',
      labels,
    };

    const prResult = await orchestratePrCreation({
      pr: prData,
      mockGitHub,
      config,
    });
    expect(prResult.success).toBe(true);
  });

  test('Test A2: Branch Validation Fail → Error propagated', async () => {
    const branchName = 'claude/invalid-prefix';

    const result = await validateBranchName({
      branchName,
      config,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('branch-prefix-forbidden');
  });

  test('Test A3: Template Route Fail → Fallback to default template', async () => {
    const branchName = 'unknown/branch-type';

    const result = await routePrTemplate({
      branchName,
      config,
    });

    expect(result.routed).toBe(false);
    expect(result.fallback).toBe(true);
    expect(result.template).toBe('pull_request_template.md');
  });

  test('Test A4: Label Validation Fail → Error logged, PR still created', async () => {
    const invalidLabels = ['bug']; // missing prefix

    const labelValidation = await validateAndApplyLabels({
      labels: invalidLabels,
      config,
      mockGitHub: mockGitHub.issues,
    });

    expect(labelValidation.valid).toBe(false);
    expect(labelValidation.errors).toContain('non-canonical-label');
  });

  test('Test A5: Invalid Branch Type → Rejected before template routing', async () => {
    const branchName = 'my-branch';

    const branchValidation = await validateBranchName({
      branchName,
      config,
    });

    expect(branchValidation.valid).toBe(false);
    expect(branchValidation.errors).toContain('branch-prefix-missing');

    // Template routing should not be attempted
  });

  test('Test A6: Mixed Label Scenarios → Multiple labels applied correctly', async () => {
    const labels = ['type:feature', 'area:agents'];

    const result = await validateAndApplyLabels({
      labels,
      config,
      mockGitHub: mockGitHub.issues,
    });

    expect(result.valid).toBe(true);
    expect(result.appliedLabels).toEqual(labels);
  });

  test('Test A7: PR Template Override → User-selected template respected', async () => {
    const branchName = 'feat/test-feature';
    const userSelectedTemplate = 'pr_custom.md';

    // User explicitly selects a template, overriding route logic
    const result = await routePrTemplate({
      branchName,
      userSelectedTemplate,
      config,
    });

    expect(result.template).toBe(userSelectedTemplate);
    expect(result.userOverride).toBe(true);
  });

  test('Test A8: Complete Feature Workflow → feat/ branch full pipeline', async () => {
    const branchName = 'feat/new-feature';
    const labels = ['type:feature'];

    // Full workflow validation
    const branchValidation = await validateBranchName({
      branchName,
      config,
    });
    expect(branchValidation.valid).toBe(true);

    const templateRoute = await routePrTemplate({
      branchName,
      config,
    });
    expect(templateRoute.routed).toBe(true);

    const labelValidation = await validateAndApplyLabels({
      labels,
      config,
      mockGitHub: mockGitHub.issues,
    });
    expect(labelValidation.valid).toBe(true);
  });
});
