// Category D: Error Recovery Workflows (8 tests)
// Test graceful error handling and recovery

import { describe, test, expect, beforeEach } from '@jest/globals';
import { validateBranchName } from '../../skills/validate-branch-name.js';
import { routePrTemplate } from '../../skills/route-pr-template.js';
import { validateAndApplyLabels } from '../../skills/validate-and-apply-labels.js';
import { orchestratePrCreation } from '../../skills/orchestrate-pr-creation.js';
import { MockGitHub, createMockConfig } from './setup.js';

describe('Category D: Error Recovery Workflows', () => {
  let mockGitHub;
  let config;

  beforeEach(() => {
    mockGitHub = new MockGitHub();
    config = createMockConfig();
  });

  test('Test D1: Branch Validation Timeout → Fallback, continue', async () => {
    mockGitHub = new MockGitHub({ branchError: 'Timeout' });

    const branchName = 'feat/test-branch';

    const result = await validateBranchName({
      branchName,
      config,
      timeout: 5000,
    });

    expect(result.error).toBeDefined();
    expect(result.fallback).toBe(true);
    expect(result.warning).toContain('timeout');
  });

  test('Test D2: GitHub API Failure → Retry with backoff', async () => {
    const prData = {
      owner: 'lightspeedwp',
      repo: '.github',
      title: 'Test PR',
      body: 'Test',
      head: 'feat/test',
      base: 'develop',
    };

    const result = await orchestratePrCreation({
      pr: prData,
      mockGitHub,
      config,
      retryConfig: {
        maxRetries: 3,
        backoffMs: 100,
      },
    });

    // Should succeed after retry
    expect(result.success).toBe(true);
    expect(result.retries).toBeLessThanOrEqual(3);
  });

  test('Test D3: Template File Missing → Use default template', async () => {
    mockGitHub = new MockGitHub({ templateError: 'Not found' });

    const branchName = 'feat/new-feature';

    const result = await routePrTemplate({
      branchName,
      config,
    });

    expect(result.fallback).toBe(true);
    expect(result.template).toBe('pull_request_template.md');
    expect(result.reason).toContain('fallback');
  });

  test('Test D4: Invalid JSON in Config → Validation error, halt', async () => {
    const invalidConfig = {
      template_routing: 'not-a-json-object',
    };

    const result = await routePrTemplate({
      branchName: 'feat/test',
      config: invalidConfig,
    });

    expect(result.error).toBeDefined();
    expect(result.valid).toBe(false);
    expect(result.halted).toBe(true);
  });

  test('Test D5: Partial Label Application Failure → Log error, apply remaining labels', async () => {
    const labels = ['type:feature', 'area:agents'];

    mockGitHub.issues.addLabels = async ({ labels: labelsToAdd }) => {
      // Fail on second label
      if (labelsToAdd.includes('area:agents')) {
        throw new Error('Failed to apply area:agents');
      }
      return { labels: labelsToAdd.map(name => ({ name, color: '0366d6' })) };
    };

    const result = await validateAndApplyLabels({
      labels,
      config,
      mockGitHub: mockGitHub.issues,
      continueOnError: true,
    });

    expect(result.partialSuccess).toBe(true);
    expect(result.appliedLabels).toContain('type:feature');
    expect(result.failedLabels).toContain('area:agents');
  });

  test('Test D6: PR Creation Failure After Validation → Error message, no retries', async () => {
    mockGitHub = new MockGitHub({ prCreationError: 'Permission denied' });

    const prData = {
      owner: 'lightspeedwp',
      repo: '.github',
      title: 'Test PR',
      body: 'Test',
      head: 'feat/test',
      base: 'develop',
    };

    const result = await orchestratePrCreation({
      pr: prData,
      mockGitHub,
      config,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Permission denied');
    expect(result.retried).toBe(false);
  });

  test('Test D7: Network Timeout During Labeling → Retry up to 3 times', async () => {
    let attemptCount = 0;
    mockGitHub.issues.addLabels = async ({ labels: labelsToAdd }) => {
      attemptCount++;
      if (attemptCount < 3) {
        throw new Error('Network timeout');
      }
      return { labels: labelsToAdd.map(name => ({ name, color: '0366d6' })) };
    };

    const result = await validateAndApplyLabels({
      labels: ['type:feature'],
      config,
      mockGitHub: mockGitHub.issues,
      retryConfig: {
        maxRetries: 3,
        backoffMs: 100,
      },
    });

    expect(result.valid).toBe(true);
    expect(attemptCount).toBe(3);
  });

  test('Test D8: Concurrent Workflow Conflicts → Handle race conditions', async () => {
    // Simulate two concurrent workflows trying to create PRs
    const prData1 = {
      owner: 'lightspeedwp',
      repo: '.github',
      title: 'PR 1',
      body: 'Test 1',
      head: 'feat/test-1',
      base: 'develop',
    };

    const prData2 = {
      owner: 'lightspeedwp',
      repo: '.github',
      title: 'PR 2',
      body: 'Test 2',
      head: 'feat/test-2',
      base: 'develop',
    };

    const [result1, result2] = await Promise.all([
      orchestratePrCreation({ pr: prData1, mockGitHub, config }),
      orchestratePrCreation({ pr: prData2, mockGitHub, config }),
    ]);

    // Both should succeed without interference
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(result1.number).not.toBe(result2.number);
  });
});
