#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');

const repositoryRoot = path.resolve(__dirname, '../../../..');
const workflowPath = path.join(repositoryRoot, '.github/workflows/changelog-unified.yml');
const workflow = fs.readFileSync(workflowPath, 'utf8');

// Workflows pin actions to a full commit SHA with the release in a trailing comment, so accept
// either the tag form or the pinned form for major version 7.
const CHECKOUT_V7 = /uses: actions\/checkout@(?:v7\b|[0-9a-f]{40}\s+# v7\.)/u;

const extractJob = (jobName, nextJobName) => {
  const end = nextJobName ? `\n  ${nextJobName}:` : '(?![\\s\\S])';
  const match = workflow.match(new RegExp(`^  ${jobName}:(?<job>[\\s\\S]*?)${end}`, 'm'));

  assert.ok(match?.groups?.job, `${jobName} job must be present`);
  return match.groups.job;
};

describe('changelog workflow checkout configuration', () => {
  it('checks out the quality job with full history and no persisted credentials', () => {
    const quality = extractJob('quality', 'sync');

    assert.match(quality, CHECKOUT_V7);
    assert.match(quality, /fetch-depth: 0/u);
    assert.match(quality, /submodules: false/u);
    assert.match(quality, /persist-credentials: false/u);
  });

  it('keeps the require-gate checkout shallow and sparse, with no persisted credentials', () => {
    const requireGate = extractJob('require-gate', 'quality');

    assert.match(requireGate, CHECKOUT_V7);
    assert.match(requireGate, /fetch-depth: 1/u);
    assert.match(requireGate, /sparse-checkout: \|[\s\S]*CHANGELOG\.md/u);
    assert.match(requireGate, /submodules: false/u);
    assert.match(requireGate, /persist-credentials: false/u);
  });

  it('does not use the retired manual clone implementation', () => {
    assert.doesNotMatch(workflow, /git clone/u);
    assert.doesNotMatch(workflow, /git checkout "?\$\{\{ github\.event\.pull_request\.head\.sha/u);
  });

  it('checks out develop with write credentials only for the merged-entry sync job', () => {
    const sync = extractJob('sync');

    assert.match(sync, CHECKOUT_V7);
    assert.match(sync, /ref: develop/u);
    assert.match(sync, /fetch-depth: 0/u);
    assert.doesNotMatch(sync, /persist-credentials: false/u);
  });
});
