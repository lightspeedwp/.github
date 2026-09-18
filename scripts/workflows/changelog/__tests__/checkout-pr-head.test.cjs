#!/usr/bin/env node

const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { afterEach, beforeEach, describe, it } = require('node:test');

const repositoryRoot = path.resolve(__dirname, '../../../..');
const workflowPath = path.join(repositoryRoot, '.github/workflows/changelog-management.yml');

const extractCheckoutScript = () => {
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(
    /- name: Checkout repository\n\s+run: \|\n(?<script>[\s\S]*?)\n\s+shell: bash/
  );

  assert.ok(match?.groups?.script, 'checkout step must contain a Bash script');

  return match.groups.script
    .split('\n')
    .map((line) => line.replace(/^ {10}/, ''))
    .join('\n');
};

const isolatedGitEnv = {
  ...process.env,
  GIT_CONFIG_GLOBAL: os.devNull,
  GIT_CONFIG_NOSYSTEM: '1',
};

const git = (args, cwd) =>
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: isolatedGitEnv,
  }).trim();

describe('changelog workflow PR-head checkout', () => {
  let checkoutDirectory;
  let baseSha;
  let featureSha;
  let remoteUrl;
  let temporaryDirectory;

  beforeEach(() => {
    temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'changelog-checkout-'));
    const remotePath = path.join(temporaryDirectory, 'remote.git');
    const seedPath = path.join(temporaryDirectory, 'seed');
    checkoutDirectory = path.join(temporaryDirectory, 'checkout');

    git(['init', '--bare', remotePath], temporaryDirectory);
    git(['init', seedPath], temporaryDirectory);
    git(['config', 'user.name', 'Workflow Test'], seedPath);
    git(['config', 'user.email', 'workflow-test@example.invalid'], seedPath);

    fs.writeFileSync(path.join(seedPath, 'tracked.txt'), 'base\n');
    git(['add', 'tracked.txt'], seedPath);
    git(['commit', '-m', 'base'], seedPath);
    git(['branch', '-M', 'develop'], seedPath);
    git(['remote', 'add', 'origin', remotePath], seedPath);
    git(['push', 'origin', 'develop'], seedPath);
    baseSha = git(['rev-parse', 'develop'], seedPath);
    git(['symbolic-ref', 'HEAD', 'refs/heads/develop'], remotePath);

    fs.writeFileSync(path.join(seedPath, 'tracked.txt'), 'pull request\n');
    git(['commit', '-am', 'pull request head'], seedPath);
    featureSha = git(['rev-parse', 'HEAD'], seedPath);
    git(['push', 'origin', `HEAD:refs/pull/3375/head`], seedPath);

    fs.mkdirSync(checkoutDirectory);
    remoteUrl = `file://${remotePath}`;
  });

  afterEach(() => {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  const prepareScript = () =>
    extractCheckoutScript()
      .replace('https://github.com/lightspeedwp/.github.git', remoteUrl)
      .replaceAll('${{ github.event.pull_request.base.sha }}', baseSha)
      .replaceAll('${{ github.event.pull_request.head.sha }}', featureSha);

  it('uses the supported no-recurse-submodules clone option', () => {
    const checkoutScript = extractCheckoutScript();

    assert.match(checkoutScript, /git clone .* --no-recurse-submodules /);
    assert.doesNotMatch(checkoutScript, /--no-submodules/);
  });

  it('fetches and checks out a PR head excluded from the shallow clone', () => {
    const result = spawnSync('bash', ['-euo', 'pipefail', '-c', prepareScript()], {
      cwd: checkoutDirectory,
      encoding: 'utf8',
      env: isolatedGitEnv,
    });

    assert.equal(result.status, 0, result.stderr);
    assert.equal(git(['rev-parse', 'HEAD'], checkoutDirectory), featureSha);
    assert.equal(git(['cat-file', '-t', baseSha], checkoutDirectory), 'commit');
    assert.equal(
      fs.readFileSync(path.join(checkoutDirectory, 'tracked.txt'), 'utf8'),
      'pull request\n'
    );
    assert.equal(git(['rev-parse', '--is-shallow-repository'], checkoutDirectory), 'true');
  });

  it('fails to check out the PR head when the explicit fetch is omitted', () => {
    const scriptWithoutFetch = prepareScript().replace(/^git fetch --depth 1 origin .*\n/m, '');
    const result = spawnSync('bash', ['-euo', 'pipefail', '-c', scriptWithoutFetch], {
      cwd: checkoutDirectory,
      encoding: 'utf8',
      env: isolatedGitEnv,
    });

    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /unable to read tree|reference is not a tree|pathspec .* did not match/
    );
  });
});
