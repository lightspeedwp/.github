import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import CheckRunReporter from '../../lib/check-run-reporter.js';

describe('CheckRunReporter - GitHub Check Run Integration', () => {
  let reporter;
  let mockOctokit;
  let mockContext;
  let mockValidationResult;

  beforeEach(() => {
    // Mock GitHub API client
    mockOctokit = {
      rest: {
        checks: {
          create: vi.fn().mockResolvedValue({
            data: {
              id: 12345,
              name: 'Changelog Validation',
              html_url: 'https://github.com/owner/repo/runs/12345',
              status: 'completed',
              conclusion: 'failure',
              head_sha: 'abc123def456',
            },
          }),
        },
      },
    };

    // Mock GitHub Actions context
    mockContext = {
      payload: {
        pull_request: {
          head: {
            sha: 'abc123def456',
          },
        },
      },
      sha: 'abc123def456',
    };

    // Mock validation result with failures
    mockValidationResult = {
      summary: {
        passed: 2,
        failed: 3,
        warnings: 1,
      },
      violations: [
        {
          entry_id: 'entry-1',
          rule_id: 'ENTRY_LENGTH',
          severity: 'high',
          message: 'Entry exceeds 250 character limit',
          details: 'Entry is 385 characters long (135 characters over limit)',
        },
        {
          entry_id: 'entry-2',
          rule_id: 'NO_IMPLEMENTATION_DETAILS',
          severity: 'medium',
          message: 'Entry contains implementation details',
          details: 'Found references to internal APIs and code structure',
        },
        {
          entry_id: 'entry-3',
          rule_id: 'ENTRY_LENGTH',
          severity: 'high',
          message: 'Entry exceeds 250 character limit',
          details: 'Entry is 412 characters long (162 characters over limit)',
        },
        {
          entry_id: 'entry-4',
          rule_id: 'NO_GITHUB_LINKS',
          severity: 'low',
          message: 'Entry references GitHub issue/PR but not linked',
          details: 'Reference to PR#123 found but no link present',
        },
      ],
    };

    // Create reporter with mocked octokit
    reporter = new CheckRunReporter('test-token', 'owner', 'repo');
    reporter.octokit = mockOctokit;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('reportCheckRun', () => {
    it('should create a check run with failure conclusion when there are failed entries', async () => {
      await reporter.reportCheckRun(mockContext, mockValidationResult);

      expect(mockOctokit.rest.checks.create).toHaveBeenCalledWith(
        expect.objectContaining({
          owner: 'owner',
          repo: 'repo',
          name: 'Changelog Validation',
          head_sha: 'abc123def456',
          status: 'completed',
          conclusion: 'failure',
        })
      );
    });

    it('should create check run output with title, summary, and annotations', async () => {
      await reporter.reportCheckRun(mockContext, mockValidationResult);

      const callArgs = mockOctokit.rest.checks.create.mock.calls[0][0];
      const output = callArgs.output;

      expect(output.title).toContain('failed');
      expect(output.title).toContain('3 error(s)');
      expect(output.summary).toContain('3 of 6 entries have validation errors');
      expect(Array.isArray(output.annotations)).toBe(true);
      expect(output.annotations.length).toBeGreaterThan(0);
    });

    it('should convert violations to GitHub annotations', async () => {
      await reporter.reportCheckRun(mockContext, mockValidationResult);

      const callArgs = mockOctokit.rest.checks.create.mock.calls[0][0];
      const annotations = callArgs.output.annotations;

      // Should have annotations for each violation
      expect(annotations.length).toBe(mockValidationResult.violations.length);

      // Check structure of annotations
      annotations.forEach((annotation) => {
        expect(annotation).toHaveProperty('path', 'CHANGELOG.md');
        expect(annotation).toHaveProperty('start_line');
        expect(annotation).toHaveProperty('annotation_level');
        expect(annotation).toHaveProperty('title');
        expect(annotation).toHaveProperty('message');
      });
    });

    it('should respect 50 annotation limit per GitHub API', async () => {
      // Create a result with 60 violations
      const largeResult = {
        summary: { passed: 0, failed: 60, warnings: 0 },
        violations: Array.from({ length: 60 }, (_, i) => ({
          entry_id: `entry-${i}`,
          rule_id: 'ENTRY_LENGTH',
          severity: 'high',
          message: `Violation ${i}`,
        })),
      };

      await reporter.reportCheckRun(mockContext, largeResult);

      const callArgs = mockOctokit.rest.checks.create.mock.calls[0][0];
      expect(callArgs.output.annotations.length).toBe(50);
    });

    it('should set conclusion to success when all entries pass', async () => {
      const successResult = {
        summary: { passed: 10, failed: 0, warnings: 0 },
        violations: [],
      };

      await reporter.reportCheckRun(mockContext, successResult);

      const callArgs = mockOctokit.rest.checks.create.mock.calls[0][0];
      expect(callArgs.conclusion).toBe('success');
    });

    it('should set conclusion to neutral when there are only warnings', async () => {
      const warningResult = {
        summary: { passed: 8, failed: 0, warnings: 2 },
        violations: [
          {
            entry_id: 'entry-1',
            rule_id: 'MINOR_ISSUE',
            severity: 'low',
            message: 'Minor issue detected',
          },
        ],
      };

      await reporter.reportCheckRun(mockContext, warningResult);

      const callArgs = mockOctokit.rest.checks.create.mock.calls[0][0];
      expect(callArgs.conclusion).toBe('neutral');
    });

    it('should use PR head SHA when available', async () => {
      const prContext = {
        payload: {
          pull_request: {
            head: {
              sha: 'pr-specific-sha-123',
            },
          },
        },
        sha: 'fallback-sha-456',
      };

      await reporter.reportCheckRun(prContext, mockValidationResult);

      const callArgs = mockOctokit.rest.checks.create.mock.calls[0][0];
      expect(callArgs.head_sha).toBe('pr-specific-sha-123');
    });

    it('should fall back to context.sha when PR head SHA not available', async () => {
      const contextNopr = {
        payload: {},
        sha: 'fallback-sha-456',
      };

      await reporter.reportCheckRun(contextNopr, mockValidationResult);

      const callArgs = mockOctokit.rest.checks.create.mock.calls[0][0];
      expect(callArgs.head_sha).toBe('fallback-sha-456');
    });

    it('should handle API errors gracefully', async () => {
      mockOctokit.rest.checks.create.mockRejectedValueOnce(new Error('API Error: 403 Forbidden'));

      await expect(reporter.reportCheckRun(mockContext, mockValidationResult)).rejects.toThrow(
        'API Error: 403 Forbidden'
      );
    });
  });

  describe('determineConclusion', () => {
    it('should return success when no violations', () => {
      const result = { summary: { failed: 0, warnings: 0 } };
      expect(reporter.determineConclusion(result)).toBe('success');
    });

    it('should return failure when there are failed entries', () => {
      const result = { summary: { failed: 3, warnings: 0 } };
      expect(reporter.determineConclusion(result)).toBe('failure');
    });

    it('should return neutral when only warnings', () => {
      const result = { summary: { failed: 0, warnings: 5 } };
      expect(reporter.determineConclusion(result)).toBe('neutral');
    });

    it('should return neutral when no validation result', () => {
      expect(reporter.determineConclusion(null)).toBe('neutral');
      expect(reporter.determineConclusion(undefined)).toBe('neutral');
    });
  });

  describe('buildCheckOutput', () => {
    it('should build output with title and summary for failures', () => {
      const output = reporter.buildCheckOutput(mockValidationResult);

      expect(output.title).toContain('failed');
      expect(output.summary).toContain('3 of 6 entries');
      expect(output.summary).toContain('Passing: 2');
      expect(output.summary).toContain('Failing: 3');
    });

    it('should build output for success case', () => {
      const successResult = {
        summary: { passed: 10, failed: 0, warnings: 0 },
        violations: [],
      };

      const output = reporter.buildCheckOutput(successResult);

      expect(output.title).toContain('pass');
      expect(output.summary).toContain('All 10 entries');
    });

    it('should build output for warnings case', () => {
      const warningResult = {
        summary: { passed: 8, failed: 0, warnings: 2 },
        violations: [],
      };

      const output = reporter.buildCheckOutput(warningResult);

      expect(output.title).toContain('warning');
      expect(output.title).toContain('2 warning(s)');
    });
  });

  describe('buildAnnotations', () => {
    it('should create annotations for violations', () => {
      const annotations = reporter.buildAnnotations(mockValidationResult.violations);

      expect(annotations.length).toBe(4);
      annotations.forEach((annotation) => {
        expect(annotation.path).toBe('CHANGELOG.md');
        expect(annotation.start_line).toBe(1);
        expect(['failure', 'warning', 'notice']).toContain(annotation.annotation_level);
        expect(annotation.title).toMatch(/\[.*\]/); // Should have rule_id in brackets
        expect(annotation.message).toBeTruthy();
      });
    });

    it('should return empty array for empty violations', () => {
      expect(reporter.buildAnnotations([])).toEqual([]);
      expect(reporter.buildAnnotations(null)).toEqual([]);
      expect(reporter.buildAnnotations(undefined)).toEqual([]);
    });
  });

  describe('severityToAnnotationLevel', () => {
    it('should map critical and high to failure', () => {
      expect(reporter.severityToAnnotationLevel('critical')).toBe('failure');
      expect(reporter.severityToAnnotationLevel('high')).toBe('failure');
      expect(reporter.severityToAnnotationLevel('CRITICAL')).toBe('failure');
      expect(reporter.severityToAnnotationLevel('HIGH')).toBe('failure');
    });

    it('should map medium to warning', () => {
      expect(reporter.severityToAnnotationLevel('medium')).toBe('warning');
      expect(reporter.severityToAnnotationLevel('MEDIUM')).toBe('warning');
    });

    it('should map low and unknown to notice', () => {
      expect(reporter.severityToAnnotationLevel('low')).toBe('notice');
      expect(reporter.severityToAnnotationLevel('unknown')).toBe('notice');
      expect(reporter.severityToAnnotationLevel(null)).toBe('notice');
      expect(reporter.severityToAnnotationLevel(undefined)).toBe('notice');
    });
  });
});
