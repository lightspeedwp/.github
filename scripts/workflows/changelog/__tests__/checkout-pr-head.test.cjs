#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');

const repositoryRoot = path.resolve(__dirname, '../../../..');
const workflowPath = path.join(repositoryRoot, '.github/workflows/changelog-unified.yml');
const workflow = fs.readFileSync(workflowPath, 'utf8');

const extractJob = (jobName, nextJobName) => {
  const end = nextJobName ? `\n  ${nextJobName}:` : '(?![\\s\\S])';
  const match = workflow.match(new RegExp(`^  ${jobName}:(?<job>[\\s\\S]*?)${end}`, 'm'));

  assert.ok(match?.groups?.job, `${jobName} job must be present`);
  return match.groups.job;
};

describe('changelog workflow checkout configuration', () => {
  it('checks out the pull request head with full history and no persisted credentials', () => {
    const requireGate = extractJob('require-gate', 'quality');
    const quality = extractJob('quality', 'sync');

    for (const job of [requireGate, quality]) {
      assert.match(job, /uses: actions\/checkout@v7/u);
      assert.match(job, /fetch-depth: 0/u);
      assert.match(job, /submodules: false/u);
      assert.match(job, /persist-credentials: false/u);
    }
  });

  it('does not use the retired manual clone implementation', () => {
    assert.doesNotMatch(workflow, /git clone/u);
    assert.doesNotMatch(workflow, /git checkout "?\$\{\{ github\.event\.pull_request\.head\.sha/u);
  });

  it('checks out develop with write credentials only for the merged-entry sync job', () => {
    const sync = extractJob('sync');

    assert.match(sync, /uses: actions\/checkout@v7/u);
    assert.match(sync, /ref: develop/u);
    assert.match(sync, /fetch-depth: 0/u);
    assert.doesNotMatch(sync, /persist-credentials: false/u);
  });
});
