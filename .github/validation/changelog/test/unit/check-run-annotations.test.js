import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { CheckRunReporter } from '../../lib/check-run-reporter.js';

/**
 * The Checks API requires path, start_line, end_line, annotation_level and
 * message on every annotation; a request missing any of them is rejected and no
 * check run is created. These assert the full required set rather than merely
 * that an object comes back.
 */
const REQUIRED = ['path', 'start_line', 'end_line', 'annotation_level', 'message'];
const LEVELS = new Set(['notice', 'warning', 'failure']);

describe('reportCheckRun annotations', () => {
  let reporter;
  let created;
  const context = { sha: 'abc', payload: {} };

  const violation = {
    rule_id: 'CHANGELOG_MAX_LENGTH',
    severity: 'critical',
    message: 'Entry exceeds 250 characters',
  };

  // The shape `bin/validate.js --output json` actually emits: violations are
  // per entry under `validations`, and carry no entry_id of their own.
  const perEntryReport = {
    summary: { total_entries: 2, passed: 1, failed: 1, pass_rate: '50' },
    validations: [
      { entry_id: 'good', violations: [], passed: true },
      { entry_id: 'bad', violations: [violation], passed: false },
    ],
  };

  beforeEach(() => {
    created = [];
    reporter = new CheckRunReporter('token', 'owner', 'repo');
    reporter.octokit = {
      rest: {
        checks: {
          create: async (args) => {
            created.push(args);
            return { id: 1, data: { html_url: 'https://example.test/checks/1' } };
          },
        },
      },
    };
  });

  it('builds an annotation from the per-entry report the validator emits', async () => {
    await reporter.reportCheckRun(context, perEntryReport);

    const { annotations } = created[0].output;
    assert.equal(annotations.length, 1, 'the nested violation must not be dropped');
    assert.equal(annotations[0].title, '[CHANGELOG_MAX_LENGTH] Entry bad');
  });

  it('supplies every field the Checks API requires, and nothing undefined', async () => {
    await reporter.reportCheckRun(context, perEntryReport);

    const [annotation] = created[0].output.annotations;
    for (const key of REQUIRED) {
      assert.ok(key in annotation, `missing required field: ${key}`);
      assert.notEqual(annotation[key], undefined, `required field is undefined: ${key}`);
    }
    assert.ok(LEVELS.has(annotation.annotation_level), 'annotation_level must be in the API enum');
    assert.ok(annotation.message.length > 0, 'message must not be empty');
  });

  it('sets end_line alongside start_line, which the API requires', async () => {
    await reporter.reportCheckRun(context, perEntryReport);

    const [annotation] = created[0].output.annotations;
    assert.equal(typeof annotation.start_line, 'number');
    assert.equal(annotation.end_line, annotation.start_line);
  });

  it('anchors to line 1 because the rule engine does not carry line numbers onto violations', async () => {
    await reporter.reportCheckRun(context, perEntryReport);

    const [annotation] = created[0].output.annotations;
    assert.equal(annotation.start_line, 1);
    assert.equal(annotation.end_line, 1);
    assert.equal(annotation.path, 'CHANGELOG.md');
  });

  it('accepts a report that already carries a top-level violations array', async () => {
    await reporter.reportCheckRun(context, {
      summary: { passed: 0, failed: 1, warnings: 0 },
      violations: [{ entry_id: 'e1', ...violation }],
    });

    const { annotations } = created[0].output;
    assert.equal(annotations.length, 1);
    assert.equal(annotations[0].title, '[CHANGELOG_MAX_LENGTH] Entry e1');
  });

  it('sends the check run for the right repository and pull request head', async () => {
    await reporter.reportCheckRun(context, perEntryReport);

    assert.equal(created[0].owner, 'owner');
    assert.equal(created[0].repo, 'repo');
    assert.equal(created[0].head_sha, 'abc');
    assert.equal(created[0].name, 'Changelog Validation');
  });
});

describe('flattenViolations edge cases', () => {
  let reporter;
  let created;
  const context = { sha: 'abc', payload: {} };
  const violation = { rule_id: 'R', severity: 'critical', message: 'm' };

  beforeEach(() => {
    created = [];
    reporter = new CheckRunReporter('token', 'owner', 'repo');
    reporter.octokit = {
      rest: {
        checks: {
          create: async (a) => {
            created.push(a);
            return { id: 1, data: { html_url: 'x' } };
          },
        },
      },
    };
  });

  it('merges top-level and nested violations instead of letting one replace the other', async () => {
    await reporter.reportCheckRun(context, {
      summary: { failed: 2 },
      violations: [{ entry_id: 'top', ...violation }],
      validations: [{ entry_id: 'nested', violations: [violation] }],
    });

    const titles = created[0].output.annotations.map((a) => a.title);
    assert.deepEqual(titles.sort(), ['[R] Entry nested', '[R] Entry top']);
  });

  it('keeps nested violations when a top-level violations array is empty', async () => {
    await reporter.reportCheckRun(context, {
      summary: { failed: 1 },
      violations: [],
      validations: [{ entry_id: 'nested', violations: [violation] }],
    });

    assert.equal(created[0].output.annotations.length, 1);
    assert.equal(created[0].output.annotations[0].title, '[R] Entry nested');
  });

  it("lets a violation's own entry_id win over the parent entry's", async () => {
    await reporter.reportCheckRun(context, {
      summary: { failed: 1 },
      validations: [{ entry_id: 'parent', violations: [{ entry_id: 'child', ...violation }] }],
    });

    assert.equal(created[0].output.annotations[0].title, '[R] Entry child');
  });

  it('falls back to unknown for a null entry_id rather than rendering "null"', async () => {
    await reporter.reportCheckRun(context, {
      summary: { failed: 1 },
      validations: [{ entry_id: null, violations: [violation] }],
    });

    assert.equal(created[0].output.annotations[0].title, '[R] Entry unknown');
  });

  it('ignores a non-array validations value instead of throwing', async () => {
    await reporter.reportCheckRun(context, { summary: { failed: 0 }, validations: { a: 1 } });

    assert.deepEqual(created[0].output.annotations, []);
  });

  it('ignores a validations entry whose violations value is not an array', async () => {
    await reporter.reportCheckRun(context, {
      summary: { failed: 0 },
      validations: [{ entry_id: 'a', violations: { oops: true } }],
    });

    assert.deepEqual(created[0].output.annotations, []);
  });

  it('ignores a validations entry with no violations key', async () => {
    await reporter.reportCheckRun(context, {
      summary: { failed: 0 },
      validations: [{ entry_id: 'a' }, null],
    });

    assert.deepEqual(created[0].output.annotations, []);
  });

  it('puts structured rule details in raw_details, never in the message', async () => {
    await reporter.reportCheckRun(context, {
      summary: { failed: 1 },
      validations: [
        {
          entry_id: 'a',
          violations: [{ ...violation, details: { contentLength: 630, maxLength: 250 } }],
        },
      ],
    });

    const [annotation] = created[0].output.annotations;
    assert.equal(annotation.message, 'm');
    assert.match(annotation.raw_details, /"contentLength": 630/);
    assert.doesNotMatch(JSON.stringify(annotation), /\[object Object\]/);
  });

  it('keeps a string detail in raw_details unchanged', async () => {
    await reporter.reportCheckRun(context, {
      summary: { failed: 1 },
      validations: [{ entry_id: 'a', violations: [{ ...violation, details: 'plain text' }] }],
    });

    assert.equal(created[0].output.annotations[0].raw_details, 'plain text');
  });

  it('sends at most 50 annotations, as the Checks API caps each request', async () => {
    const validations = Array.from({ length: 40 }, (_, i) => ({
      entry_id: `e${i}`,
      violations: Array.from({ length: 4 }, () => violation),
    }));

    await reporter.reportCheckRun(context, { summary: { failed: 40 }, validations });

    assert.equal(created[0].output.annotations.length, 50);
  });

  it('uses the pull request head sha when the context carries one', async () => {
    await reporter.reportCheckRun(
      { payload: { pull_request: { head: { sha: 'prhead' } } } },
      { summary: { failed: 0 } }
    );

    assert.equal(created[0].head_sha, 'prhead');
  });
});
