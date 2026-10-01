import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import CheckRunReporter from '../../lib/check-run-reporter.js';

/**
 * Integration-level coverage for the check run reporter: what actually reaches
 * `checks.create` for a given report, rather than the individual methods in
 * isolation.
 *
 * Runs on the package's own `node --test` runner. This file previously imported
 * vitest, which the package does not depend on, so it was never executed by any
 * script: `grep` found no reference to it in package.json, any jest config or
 * any workflow.
 */
describe('CheckRunReporter - GitHub Check Run Integration', () => {
  let reporter;
  let calls;
  let createError;
  let mockContext;
  let mockValidationResult;

  const response = {
    data: {
      id: 12345,
      name: 'Changelog Validation',
      html_url: 'https://github.com/owner/repo/runs/12345',
      status: 'completed',
      conclusion: 'failure',
      head_sha: 'abc123def456',
    },
  };

  beforeEach(() => {
    calls = [];
    createError = null;

    const create = async (args) => {
      calls.push(args);
      if (createError) throw createError;
      return response;
    };
    create.calls = calls;

    reporter = new CheckRunReporter('test-token', 'owner', 'repo');
    reporter.octokit = { rest: { checks: { create } } };

    mockContext = {
      payload: { pull_request: { head: { sha: 'abc123def456' } } },
      sha: 'abc123def456',
    };

    mockValidationResult = {
      // total_entries is what the validator reports; warnings are not a
      // disjoint class of entry, so the total is not passed+failed+warnings.
      summary: { total_entries: 5, passed: 2, failed: 3, warnings: 1 },
      violations: [
        {
          entry_id: 'entry-1',
          line_number: 41,
          rule_id: 'ENTRY_LENGTH',
          severity: 'high',
          message: 'Entry exceeds 250 character limit',
          details: 'Entry is 385 characters long (135 characters over limit)',
        },
        {
          entry_id: 'entry-2',
          line_number: 57,
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
  });

  afterEach(() => {
    calls.length = 0;
  });

  describe('reportCheckRun', () => {
    it('creates a check run with failure conclusion when there are failed entries', async () => {
      await reporter.reportCheckRun(mockContext, mockValidationResult);

      assert.equal(calls.length, 1);
      const args = calls[0];
      assert.equal(args.owner, 'owner');
      assert.equal(args.repo, 'repo');
      assert.equal(args.name, 'Changelog Validation');
      assert.equal(args.head_sha, 'abc123def456');
      assert.equal(args.status, 'completed');
      assert.equal(args.conclusion, 'failure');
    });

    it('creates check run output with title, summary, and annotations', async () => {
      await reporter.reportCheckRun(mockContext, mockValidationResult);

      const { output } = calls[0];
      assert.match(output.title, /failed/);
      assert.match(output.title, /3 error\(s\)/);
      assert.match(output.summary, /3 of 5 entries have validation errors/);
      assert.ok(Array.isArray(output.annotations));
      assert.ok(output.annotations.length > 0);
    });

    it('converts violations to GitHub annotations', async () => {
      await reporter.reportCheckRun(mockContext, mockValidationResult);

      const { annotations } = calls[0].output;
      assert.equal(annotations.length, mockValidationResult.violations.length);

      for (const annotation of annotations) {
        assert.equal(annotation.path, 'CHANGELOG.md');
        assert.equal(typeof annotation.start_line, 'number');
        assert.equal(typeof annotation.end_line, 'number');
        assert.equal(typeof annotation.annotation_level, 'string');
        assert.equal(typeof annotation.title, 'string');
        assert.equal(typeof annotation.message, 'string');
      }
    });

    it('anchors each annotation to its own entry line', async () => {
      await reporter.reportCheckRun(mockContext, mockValidationResult);

      const { annotations } = calls[0].output;
      assert.equal(annotations[0].start_line, 41);
      assert.equal(annotations[0].end_line, 41);
      assert.equal(annotations[1].start_line, 57);
      // The third violation carries no line number and falls back to line 1.
      assert.equal(annotations[2].start_line, 1);
    });

    it('respects the 50 annotation limit per GitHub API request', async () => {
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

      assert.equal(calls[0].output.annotations.length, 50);
    });

    it('sets conclusion to success when all entries pass', async () => {
      const successResult = {
        summary: { passed: 10, failed: 0, warnings: 0 },
        violations: [],
      };

      await reporter.reportCheckRun(mockContext, successResult);

      assert.equal(calls[0].conclusion, 'success');
    });

    it('sets conclusion to neutral when there are only warnings', async () => {
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

      assert.equal(calls[0].conclusion, 'neutral');
    });

    it('concludes on failures this change introduced, not the branch total', async () => {
      // Legacy Unreleased debt: the branch still fails three entries, but this
      // pull request introduces none. The gate in changelog-unified.yml is
      // keyed on new_failed, and the check run has to agree with it.
      const inheritedDebt = {
        summary: { passed: 2, failed: 3, warnings: 0, new_failed: 0 },
        violations: mockValidationResult.violations,
      };

      await reporter.reportCheckRun(mockContext, inheritedDebt);

      assert.equal(calls[0].conclusion, 'success');
    });

    it('concludes failure when this change introduces a failure', async () => {
      const introduced = {
        summary: { passed: 2, failed: 3, warnings: 0, new_failed: 1 },
        violations: mockValidationResult.violations,
      };

      await reporter.reportCheckRun(mockContext, introduced);

      assert.equal(calls[0].conclusion, 'failure');
    });

    it('uses the PR head SHA when available', async () => {
      const prContext = {
        payload: { pull_request: { head: { sha: 'pr-specific-sha-123' } } },
        sha: 'fallback-sha-456',
      };

      await reporter.reportCheckRun(prContext, mockValidationResult);

      assert.equal(calls[0].head_sha, 'pr-specific-sha-123');
    });

    it('falls back to context.sha when the PR head SHA is not available', async () => {
      await reporter.reportCheckRun({ payload: {}, sha: 'fallback-sha-456' }, mockValidationResult);

      assert.equal(calls[0].head_sha, 'fallback-sha-456');
    });

    it('surfaces API errors to the caller', async () => {
      createError = new Error('API Error: 403 Forbidden');

      await assert.rejects(
        () => reporter.reportCheckRun(mockContext, mockValidationResult),
        /API Error: 403 Forbidden/
      );
    });
  });

  describe('determineConclusion', () => {
    it('returns success when no violations', () => {
      assert.equal(
        reporter.determineConclusion({ summary: { failed: 0, warnings: 0 }, violations: [] }),
        'success'
      );
    });

    it('returns failure when there are failed entries', () => {
      assert.equal(
        reporter.determineConclusion({ summary: { failed: 2, warnings: 0 }, violations: [] }),
        'failure'
      );
    });

    it('returns neutral when only warnings', () => {
      assert.equal(
        reporter.determineConclusion({ summary: { failed: 0, warnings: 1 }, violations: [] }),
        'neutral'
      );
    });

    it('returns neutral when there is no validation result', () => {
      assert.equal(reporter.determineConclusion(null), 'neutral');
      assert.equal(reporter.determineConclusion({}), 'neutral');
    });
  });

  describe('buildCheckOutput', () => {
    it('builds output with title and summary for failures', () => {
      const output = reporter.buildCheckOutput(mockValidationResult);

      assert.match(output.title, /failed/);
      assert.match(output.summary, /validation errors/);
      assert.ok(Array.isArray(output.annotations));
    });

    it('builds output for the success case', () => {
      const output = reporter.buildCheckOutput({
        summary: { passed: 5, failed: 0, warnings: 0 },
        violations: [],
      });

      assert.match(output.summary, /quality standards|All 5 entries/);
      assert.equal(output.annotations.length, 0);
    });

    it('builds output for the warnings case', () => {
      const output = reporter.buildCheckOutput({
        summary: { passed: 5, failed: 0, warnings: 2 },
        violations: [],
      });

      assert.equal(typeof output.title, 'string');
      assert.equal(typeof output.summary, 'string');
    });
  });

  describe('buildAnnotations', () => {
    it('creates annotations for violations', () => {
      const annotations = reporter.buildAnnotations(mockValidationResult.violations);

      assert.equal(annotations.length, mockValidationResult.violations.length);
      assert.equal(annotations[0].annotation_level, 'failure');
      assert.equal(annotations[1].annotation_level, 'warning');
      assert.equal(annotations[3].annotation_level, 'notice');
    });

    it('returns an empty array for empty or non-array violations', () => {
      assert.deepEqual(reporter.buildAnnotations([]), []);
      assert.deepEqual(reporter.buildAnnotations(null), []);
      assert.deepEqual(reporter.buildAnnotations(undefined), []);
    });
  });

  describe('severityToAnnotationLevel', () => {
    it('maps critical and high to failure', () => {
      assert.equal(reporter.severityToAnnotationLevel('critical'), 'failure');
      assert.equal(reporter.severityToAnnotationLevel('high'), 'failure');
    });

    it('maps medium to warning', () => {
      assert.equal(reporter.severityToAnnotationLevel('medium'), 'warning');
    });

    it('maps low and unknown to notice', () => {
      assert.equal(reporter.severityToAnnotationLevel('low'), 'notice');
      assert.equal(reporter.severityToAnnotationLevel('nonsense'), 'notice');
    });
  });
});
