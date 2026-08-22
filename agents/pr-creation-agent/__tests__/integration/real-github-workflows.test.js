// Category E: Real GitHub Workflows (10 tests)
// Test complete end-to-end workflows

import { describe, test, expect, beforeEach } from '@jest/globals';
import { validateBranchName } from '../../skills/validate-branch-name.js';
import { routePrTemplate } from '../../skills/route-pr-template.js';
import { validateAndApplyLabels } from '../../skills/validate-and-apply-labels.js';
import { orchestratePrCreation } from '../../skills/orchestrate-pr-creation.js';
import { MockGitHub, createMockConfig } from './setup.js';

describe('Category E: Real GitHub Workflows', () => {
  let mockGitHub;
  let config;

  beforeEach(() => {
    mockGitHub = new MockGitHub();
    config = createMockConfig();
  });

  test('Test E1: Feature Branch Complete Workflow → All 4 skills succeed', async () => {
    const branchName = 'feat/new-dashboard';
    const labels = ['type:feature'];

    // Validate branch
    const branchValidation = await validateBranchName({ branchName, config });
    expect(branchValidation.valid).toBe(true);

    // Route template
    const templateRoute = await routePrTemplate({ branchName, config });
    expect(templateRoute.routed).toBe(true);
    expect(templateRoute.template).toBe('pr_feature.md');

    // Validate labels
    const labelValidation = await validateAndApplyLabels({
      labels,
      config,
      mockGitHub: mockGitHub.issues,
    });
    expect(labelValidation.valid).toBe(true);

    // Orchestrate PR creation
    const prData = {
      owner: 'lightspeedwp',
      repo: '.github',
      title: 'Add new dashboard',
      body: '## Description\n\nNew dashboard feature',
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

  test('Test E2: Bug Fix Workflow → Branch validation → bug template → labels → PR', async () => {
    const branchName = 'fix/invalid-validation';
    const labels = ['type:bug', 'priority:critical'];

    const branchValidation = await validateBranchName({ branchName, config });
    expect(branchValidation.valid).toBe(true);
    expect(branchValidation.type).toBe('fix');

    const templateRoute = await routePrTemplate({ branchName, config });
    expect(templateRoute.template).toBe('pr_bug.md');

    const labelValidation = await validateAndApplyLabels({
      labels,
      config,
      mockGitHub: mockGitHub.issues,
    });
    expect(labelValidation.valid).toBe(true);
  });

  test('Test E3: Documentation Update → docs/ → docs template → minimal labels', async () => {
    const branchName = 'docs/branching-guide';
    const labels = ['type:docs'];

    const branchValidation = await validateBranchName({ branchName, config });
    expect(branchValidation.valid).toBe(true);

    const templateRoute = await routePrTemplate({ branchName, config });
    expect(templateRoute.template).toBe('pr_docs.md');

    const labelValidation = await validateAndApplyLabels({
      labels,
      config,
      mockGitHub: mockGitHub.issues,
    });
    expect(labelValidation.valid).toBe(true);
    expect(labelValidation.appliedLabels.length).toBe(1);
  });

  test('Test E4: Chore/Dependency Update → chore/ → chore template → meta labels', async () => {
    const branchName = 'chore/update-dependencies';

    const branchValidation = await validateBranchName({ branchName, config });
    expect(branchValidation.valid).toBe(true);

    const templateRoute = await routePrTemplate({ branchName, config });
    expect(templateRoute.template).toBe('pr_chore.md');
  });

  test('Test E5: Security Patch → security/ → bug template → security labels', async () => {
    const branchName = 'security/fix-xss-vulnerability';

    const branchValidation = await validateBranchName({ branchName, config });
    expect(branchValidation.valid).toBe(true);

    const templateRoute = await routePrTemplate({ branchName, config });
    expect(templateRoute.template).toBe('pr_bug.md');
  });

  test('Test E6: Multiple PRs Concurrent → Isolated workflows', async () => {
    const branches = [
      'feat/feature-1',
      'feat/feature-2',
      'fix/bug-1',
    ];

    const results = await Promise.all(
      branches.map(branch =>
        validateBranchName({ branchName: branch, config })
      )
    );

    expect(results).toHaveLength(3);
    results.forEach(result => {
      expect(result.valid).toBe(true);
    });
  });

  test('Test E7: PR with User-Selected Template → Override routing logic', async () => {
    const branchName = 'feat/new-feature';
    const userSelectedTemplate = 'pr_custom.md';

    const result = await routePrTemplate({
      branchName,
      userSelectedTemplate,
      config,
    });

    expect(result.template).toBe(userSelectedTemplate);
    expect(result.userOverride).toBe(true);
  });

  test('Test E8: PR with Custom Frontmatter → Parse & apply FEEDBACK_RESPONSE', async () => {
    const prData = {
      owner: 'lightspeedwp',
      repo: '.github',
      title: 'Feature with feedback response',
      body: `---
feedback_status: resolved
---

## Description

Test PR

## Feedback Response

- ✅ Addressed AI suggestion 1
- 📋 Deferred AI suggestion 2`,
      head: 'feat/test',
      base: 'develop',
    };

    const result = await orchestratePrCreation({
      pr: prData,
      mockGitHub,
      config,
      parseFrontmatter: true,
    });

    expect(result.success).toBe(true);
    expect(result.frontmatter).toBeDefined();
  });

  test('Test E9: GitHub Actions Triggered → PR runs workflow validation', async () => {
    const prData = {
      owner: 'lightspeedwp',
      repo: '.github',
      title: 'Feature with workflow trigger',
      body: '## Description\n\nTest PR',
      head: 'feat/test',
      base: 'develop',
      labels: ['type:feature'],
    };

    const result = await orchestratePrCreation({
      pr: prData,
      mockGitHub,
      config,
      triggerWorkflow: true,
    });

    expect(result.success).toBe(true);
    expect(result.workflowTriggered).toBe(true);
  });

  test('Test E10: AI Feedback Integration → Create FEEDBACK_RESPONSE.md if present', async () => {
    const prData = {
      owner: 'lightspeedwp',
      repo: '.github',
      title: 'Feature with AI feedback',
      body: '## Description\n\nFeedback-driven PR',
      head: 'feat/test',
      base: 'develop',
      labels: ['type:feature'],
    };

    const aiFeedback = [
      { suggestion: 'Add more tests', status: 'addressed' },
      { suggestion: 'Improve documentation', status: 'deferred' },
    ];

    const result = await orchestratePrCreation({
      pr: prData,
      mockGitHub,
      config,
      aiFeedback,
      createFeedbackResponse: true,
    });

    expect(result.success).toBe(true);
    expect(result.feedbackResponseCreated).toBe(true);
  });
});
