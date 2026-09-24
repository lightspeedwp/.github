const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const YAML = require('yaml');

const repositoryRoot = path.resolve(__dirname, '../../../..');
const workflowPath = path.join(repositoryRoot, '.github/workflows/changelog-unified.yml');
const workflowLintPath = path.join(repositoryRoot, '.github/workflows/workflow-lint.yml');
const workflowSource = fs.readFileSync(workflowPath, 'utf8');
const workflow = YAML.parse(workflowSource);
const temporaryDirectories = [];
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

afterAll(() => {
  for (const directory of temporaryDirectories) {
    fs.rmSync(directory, { force: true, recursive: true });
  }
});

function findStep(jobName, identifier) {
  const step = workflow.jobs[jobName].steps.find(
    (candidate) => candidate.id === identifier || candidate.name === identifier
  );

  if (!step) {
    throw new Error(`Step ${identifier} was not found in the ${jobName} job`);
  }

  return step;
}

function renderExpressions(script, expressions) {
  return script.replace(/\$\{\{\s*([^}]+?)\s*\}\}/gu, (_match, expression) => {
    const key = expression.trim();

    if (!Object.hasOwn(expressions, key)) {
      throw new Error(`No test value supplied for expression: ${key}`);
    }

    return expressions[key];
  });
}

async function runGithubScript(script, options = {}) {
  const core = {
    info: jest.fn(),
    setFailed: jest.fn(),
    setOutput: jest.fn(),
  };
  const childProcess = {
    execSync: jest.fn(() => (options.changedFiles || []).join('\n')),
  };
  const requireModule = jest.fn((moduleName) => {
    if (moduleName === 'node:child_process') {
      return childProcess;
    }

    throw new Error(`Unexpected module request: ${moduleName}`);
  });
  const context = options.context || {
    issue: { number: 3405 },
    payload: {
      pull_request: {
        base: { sha: 'base-sha' },
        head: { sha: 'head-sha' },
        labels: [],
        user: { login: 'contributor' },
      },
    },
    repo: { owner: 'lightspeedwp', repo: '.github' },
  };
  const github = options.github || { rest: { issues: {}, pulls: {} } };
  const processValue = { env: options.env || {} };
  const execute = new AsyncFunction('context', 'core', 'github', 'require', 'process', script);

  await execute(context, core, github, requireModule, processValue);

  return { childProcess, context, core, github };
}

function contextWith({ author = 'contributor', labels = [] } = {}) {
  return {
    issue: { number: 3405 },
    payload: {
      pull_request: {
        base: { sha: 'base-sha' },
        head: { sha: 'head-sha' },
        labels: labels.map((name) => ({ name })),
        user: { login: author },
      },
    },
    repo: { owner: 'lightspeedwp', repo: '.github' },
  };
}

function outputValue(core, name) {
  const call = core.setOutput.mock.calls.find(([outputName]) => outputName === name);
  return call?.[1];
}

function writeExecutable(directory, name, source) {
  const executable = path.join(directory, name);
  fs.writeFileSync(executable, `#!/usr/bin/env bash\n${source}\n`, { mode: 0o755 });
}

// Mirror the runner: a step's `env:` values are expression-rendered and
// exported to its script. Only entries whose expressions the test supplies
// are exported, so the harness defaults below stand in for secrets.
function renderStepEnv(step, expressions) {
  return Object.fromEntries(
    Object.entries(step.env || {}).flatMap(([name, value]) => {
      const keys = [...String(value).matchAll(/\$\{\{\s*([^}]+?)\s*\}\}/gu)].map((match) =>
        match[1].trim()
      );

      return keys.every((key) => Object.hasOwn(expressions, key))
        ? [[name, renderExpressions(String(value), expressions)]]
        : [];
    })
  );
}

function runBashStep(step, options = {}) {
  const script = step.run;
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'changelog-unified-'));
  const mockBin = path.join(temporaryDirectory, 'bin');
  const outputPath = path.join(temporaryDirectory, 'github-output');
  const validatorDirectory = path.join(temporaryDirectory, '.github/validation/changelog');
  const baseChangelogPath = path.join(temporaryDirectory, 'base-changelog.md');

  temporaryDirectories.push(temporaryDirectory);
  fs.mkdirSync(mockBin);
  fs.mkdirSync(validatorDirectory, { recursive: true });
  fs.writeFileSync(outputPath, '');

  for (const [name, source] of Object.entries(options.commands || {})) {
    writeExecutable(mockBin, name, source);
  }

  const renderedScript = renderExpressions(script, options.expressions || {}).replaceAll(
    '/tmp/base-changelog.md',
    baseChangelogPath
  );
  const result = spawnSync('/bin/bash', ['-euo', 'pipefail', '-c', renderedScript], {
    cwd: temporaryDirectory,
    encoding: 'utf8',
    env: {
      ...process.env,
      BASE_SHA: 'base-sha',
      CHANGELOG_GITHUB_TOKEN: 'test-token',
      HEAD_REF: 'fix/changelog-unified',
      PR_NUMBER: '3405',
      ...renderStepEnv(step, options.expressions || {}),
      ...options.env,
      GITHUB_OUTPUT: outputPath,
      PATH: `${mockBin}:${process.env.PATH}`,
    },
  });

  return {
    ...result,
    output: fs.readFileSync(outputPath, 'utf8'),
  };
}

function outputLine(output, name) {
  return output
    .split('\n')
    .find((line) => line.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

describe('changelog unified workflow contract', () => {
  test('uses the consolidated trigger set and concurrency group', () => {
    expect(workflow.on.pull_request.branches).toEqual(['develop', 'main']);
    expect(workflow.on.pull_request.types).toEqual([
      'opened',
      'synchronize',
      'reopened',
      'edited',
      'ready_for_review',
      'closed',
      'labeled',
      'unlabeled',
    ]);
    expect(workflow.concurrency).toEqual({
      group: 'changelog-unified-${{ github.event.pull_request.number || github.ref }}',
      'cancel-in-progress': true,
    });
  });

  test('wires quality behind the gate while keeping merged-PR sync independent', () => {
    expect(Object.keys(workflow.jobs)).toEqual(['require-gate', 'quality', 'sync']);
    expect(workflow.jobs.quality.needs).toBe('require-gate');
    expect(workflow.jobs.quality.if).toBe(
      "${{ !cancelled() && needs.require-gate.outputs.run_validation == 'true' }}"
    );
    expect(workflow.jobs.sync.needs).toBeUndefined();
    expect(workflow.jobs.sync.if).toBe(
      "github.event.action == 'closed' && github.event.pull_request.merged == true"
    );
  });

  test('limits elevated permissions to feedback and merged-entry synchronisation', () => {
    expect(workflow.permissions).toEqual({
      contents: 'read',
    });
    expect(workflow.jobs.quality.permissions).toEqual({
      contents: 'read',
      'pull-requests': 'write',
    });
    expect(workflow.jobs.sync.permissions).toEqual({
      contents: 'write',
      'pull-requests': 'read',
    });
    expect(workflow.jobs['require-gate']['timeout-minutes']).toBe(5);
    expect(workflow.jobs.quality['timeout-minutes']).toBe(10);
    expect(workflow.jobs.sync['timeout-minutes']).toBe(10);
  });

  test('runs validation and feedback only when their preceding outputs require it', () => {
    expect(findStep('require-gate', 'Setup Node').if).toBe(
      "steps.gate.outputs.run_validation == 'true'"
    );
    expect(findStep('require-gate', 'Validate changelog schema').if).toBe(
      "steps.gate.outputs.run_validation == 'true'"
    );
    expect(findStep('quality', 'Post PR comment').if).toBe(
      "steps.changed-files.outputs.any_changed == 'true'"
    );
    expect(findStep('quality', 'Set status check (new failures only)').if).toBe(
      "steps.changed-files.outputs.any_changed == 'true'"
    );
  });

  test('passes pull request values through environment variables in executable steps', () => {
    const validate = findStep('quality', 'validate');
    const comment = findStep('quality', 'Post PR comment');

    expect(validate.env).toMatchObject({
      PR_NUMBER: '${{ github.event.pull_request.number }}',
      HEAD_REF: '${{ github.head_ref }}',
      BASE_SHA: '${{ github.event.pull_request.base.sha }}',
    });
    expect(validate.run).not.toMatch(/\$\{\{\s*github\.(?:head_ref|event\.pull_request\.number)/u);
    expect(comment.env).toMatchObject({
      PR_NUMBER: '${{ github.event.pull_request.number }}',
      HEAD_REF: '${{ github.head_ref }}',
    });
    expect(comment.with.script).toContain('process.env.PR_NUMBER');
    expect(comment.with.script).toContain('process.env.HEAD_REF');
  });

  test('keeps only the unified changelog workflow in the active actionlint list', () => {
    const lintWorkflow = YAML.parse(fs.readFileSync(workflowLintPath, 'utf8'));
    const actionlint = lintWorkflow.jobs.actionlint.steps.find(
      (step) => step.name === 'Run actionlint on active workflows'
    );

    expect(actionlint.run).toContain('.github/workflows/changelog-unified.yml');
    expect(actionlint.run).not.toContain('.github/workflows/changelog-management.yml');
    expect(actionlint.run).not.toContain('.github/workflows/changelog-validation.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);
    expect(
      fs.existsSync(path.join(repositoryRoot, '.github/workflows/changelog-management.yml'))
    ).toBe(false);
    expect(
      fs.existsSync(path.join(repositoryRoot, '.github/workflows/changelog-validation.yml'))
    ).toBe(false);
  });
});

describe('require-gate inline script', () => {
  const gateScript = findStep('require-gate', 'gate').with.script;

  test.each(['dependabot[bot]', 'app/dependabot'])(
    'skips changelog validation for %s',
    async (author) => {
      const result = await runGithubScript(gateScript, {
        context: contextWith({ author }),
      });

      expect(outputValue(result.core, 'run_validation')).toBe('false');
      expect(result.core.setFailed).not.toHaveBeenCalled();
      expect(result.childProcess.execSync).not.toHaveBeenCalled();
    }
  );

  test('rejects mutually exclusive changelog labels before inspecting the diff', async () => {
    const result = await runGithubScript(gateScript, {
      context: contextWith({ labels: ['meta:needs-changelog', 'meta:no-changelog'] }),
    });

    expect(result.core.setFailed).toHaveBeenCalledWith(
      'PR cannot include both meta:needs-changelog and meta:no-changelog.'
    );
    expect(result.childProcess.execSync).not.toHaveBeenCalled();
  });

  test.each([
    'type:feature',
    'type:bug',
    'type:performance',
    'type:security',
    'type:release',
    'type:hotfix',
  ])('rejects meta:no-changelog for restricted %s changes', async (restrictedType) => {
    const result = await runGithubScript(gateScript, {
      context: contextWith({ labels: ['meta:no-changelog', restrictedType] }),
    });

    expect(result.core.setFailed).toHaveBeenCalledWith(
      'meta:no-changelog is not allowed for high-impact release-related change types.'
    );
    expect(result.childProcess.execSync).not.toHaveBeenCalled();
  });

  test('runs validation when the root changelog changed', async () => {
    const result = await runGithubScript(gateScript, {
      changedFiles: ['scripts/example.js', 'CHANGELOG.md'],
    });

    expect(result.childProcess.execSync).toHaveBeenCalledWith(
      'git diff --name-only base-sha head-sha',
      expect.objectContaining({ encoding: 'utf8' })
    );
    expect(outputValue(result.core, 'run_validation')).toBe('true');
    expect(result.core.setFailed).not.toHaveBeenCalled();
  });

  test('skips validation for docs-bot normalization PRs', async () => {
    const result = await runGithubScript(gateScript, {
      changedFiles: ['docs/guide.md'],
      context: contextWith({ author: 'app/lightspeed-docs-bot' }),
    });

    expect(outputValue(result.core, 'run_validation')).toBe('false');
    expect(result.core.setFailed).not.toHaveBeenCalled();
    expect(result.childProcess.execSync).not.toHaveBeenCalled();
  });

  test('exempts docs-only changes without requiring a label', async () => {
    const result = await runGithubScript(gateScript, {
      changedFiles: ['docs/guide.md', 'README.md'],
      context: contextWith({ labels: ['type:docs'] }),
    });

    expect(outputValue(result.core, 'run_validation')).toBe('false');
    expect(result.core.setFailed).not.toHaveBeenCalled();
  });

  test('allows an explicit skip for a non-restricted change', async () => {
    const result = await runGithubScript(gateScript, {
      changedFiles: ['docs/guide.md'],
      context: contextWith({ labels: ['meta:no-changelog', 'type:docs'] }),
    });

    expect(outputValue(result.core, 'run_validation')).toBe('false');
    expect(result.core.setFailed).not.toHaveBeenCalled();
  });

  test('fails when neither the changelog nor an allowed skip label is present', async () => {
    const result = await runGithubScript(gateScript, {
      changedFiles: ['scripts/example.js'],
    });

    expect(result.core.setFailed).toHaveBeenCalledWith(
      'PR requires a CHANGELOG.md update or the meta:no-changelog label.'
    );
    expect(result.core.setOutput).not.toHaveBeenCalled();
  });

  test('exempts a nested CHANGELOG.md under docs/ as docs-only', async () => {
    const result = await runGithubScript(gateScript, {
      changedFiles: ['docs/CHANGELOG.md'],
    });

    expect(outputValue(result.core, 'run_validation')).toBe('false');
    expect(result.core.setFailed).not.toHaveBeenCalled();
  });
});

describe('quality validation shell steps', () => {
  const validationScript = findStep('quality', 'validate');
  const statusScript = findStep('quality', 'Set status check (new failures only)');
  const nodeCommand = [
    'if [[ "$*" == *"base-changelog.md"* ]]; then',
    '  printf \'%s\\n\' "$BASE_REPORT"',
    'else',
    '  printf \'%s\\n\' "$PRIMARY_REPORT"',
    'fi',
  ].join('\n');
  const gitCommand = [
    'if [[ "$1" == "show" ]]; then',
    "  printf '# Changelog\\n'",
    '  exit "${GIT_SHOW_STATUS:-0}"',
    'fi',
    'exit 1',
  ].join('\n');

  test('returns deterministic zero outputs when no changelog file changed', () => {
    const result = runBashStep(validationScript, {
      expressions: { 'steps.changed-files.outputs.any_changed': 'false' },
    });

    expect(result.status).toBe(0);
    expect(result.output).toContain('passed=0\n');
    expect(result.output).toContain('failed=0\n');
    expect(result.output).toContain('new_failed=0\n');
    expect(result.output).toContain('base_failed=0\n');
    expect(result.output).toContain('result=No changelog files modified in this PR\n');
  });

  test('subtracts pre-existing failures and exposes only newly introduced failures', () => {
    const result = runBashStep(validationScript, {
      commands: { git: gitCommand, node: nodeCommand },
      env: {
        BASE_REPORT: JSON.stringify({ summary: { failed: 3 } }),
        GIT_SHOW_STATUS: '0',
        PRIMARY_REPORT: JSON.stringify({
          summary: { passed: 7, failed: 5 },
          recommendation: 'Fix new entries',
          ci_gate_result: 'fail',
        }),
      },
      expressions: { 'steps.changed-files.outputs.any_changed': 'true' },
    });

    expect(result.status).toBe(0);
    expect(outputLine(result.output, 'failed')).toBe('5');
    expect(outputLine(result.output, 'base_failed')).toBe('3');
    expect(outputLine(result.output, 'new_failed')).toBe('2');
    expect(outputLine(result.output, 'gate_result')).toBe('fail');
  });

  test('clamps the new-failure count at zero when the PR reduces existing debt', () => {
    const result = runBashStep(validationScript, {
      commands: { git: gitCommand, node: nodeCommand },
      env: {
        BASE_REPORT: JSON.stringify({ summary: { failed: 4 } }),
        GIT_SHOW_STATUS: '0',
        PRIMARY_REPORT: JSON.stringify({
          summary: { passed: 9, failed: 2 },
          recommendation: 'Improved',
          ci_gate_result: 'warning',
        }),
      },
      expressions: { 'steps.changed-files.outputs.any_changed': 'true' },
    });

    expect(result.status).toBe(0);
    expect(outputLine(result.output, 'base_failed')).toBe('4');
    expect(outputLine(result.output, 'new_failed')).toBe('0');
  });

  test('fails closed when the validator report is malformed and the base is unavailable', () => {
    const result = runBashStep(validationScript, {
      commands: { git: gitCommand, node: nodeCommand },
      env: {
        BASE_REPORT: '{}',
        GIT_SHOW_STATUS: '1',
        PRIMARY_REPORT: '{}',
      },
      expressions: { 'steps.changed-files.outputs.any_changed': 'true' },
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Validation report missing or malformed; failing closed');
    expect(outputLine(result.output, 'failed')).toBe('1');
    expect(outputLine(result.output, 'new_failed')).toBe('1');
    expect(outputLine(result.output, 'gate_result')).toBe('fail');
  });

  test('fails closed when the validator report carries fractional counts', () => {
    const result = runBashStep(validationScript, {
      commands: { git: gitCommand, node: nodeCommand },
      env: {
        BASE_REPORT: JSON.stringify({ summary: { failed: 0 } }),
        GIT_SHOW_STATUS: '0',
        PRIMARY_REPORT: JSON.stringify({
          summary: { passed: 7, failed: 1.5 },
          recommendation: 'Fix new entries',
          ci_gate_result: 'fail',
        }),
      },
      expressions: { 'steps.changed-files.outputs.any_changed': 'true' },
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Validation report missing or malformed; failing closed');
    expect(outputLine(result.output, 'failed')).toBe('1');
    expect(outputLine(result.output, 'new_failed')).toBe('1');
    expect(outputLine(result.output, 'gate_result')).toBe('fail');
  });

  test.each([
    ['0', 0],
    ['1', 1],
    ['12', 1],
    ['', 0],
    ['not-a-number', 0],
    ['-1', 0],
  ])('status check handles new_failed=%j with exit code %i', (newFailed, expectedStatus) => {
    const result = runBashStep(statusScript, {
      expressions: { 'steps.validate.outputs.new_failed': newFailed },
    });

    expect(result.status).toBe(expectedStatus);
  });
});

describe('quality feedback inline script', () => {
  const commentScript = findStep('quality', 'Post PR comment').with.script;

  function githubWithComments(comments = []) {
    return {
      paginate: jest.fn().mockResolvedValue(comments),
      rest: {
        issues: {
          createComment: jest.fn(),
          updateComment: jest.fn(),
        },
      },
    };
  }

  test('creates actionable failure feedback when the PR introduces errors', async () => {
    const github = githubWithComments();

    await runGithubScript(commentScript, {
      env: {
        BASE_FAILED: '2',
        FAILED: '3',
        HEAD_REF: 'fix/changelog-unified',
        NEW_FAILED: '1',
        PASSED: '8',
        PR_NUMBER: '3405',
      },
      github,
    });

    expect(github.rest.issues.createComment).toHaveBeenCalledTimes(1);
    const request = github.rest.issues.createComment.mock.calls[0][0];
    expect(request).toMatchObject({
      owner: 'lightspeedwp',
      repo: '.github',
      issue_number: 3405,
    });
    expect(request.body).toContain('This PR introduces 1 new changelog failure(s)');
    expect(request.body).toContain('| 📦 Pre-existing failures | 2 |');
    expect(request.body).toContain('--pr-number 3405 --branch fix/changelog-unified');
  });

  test('updates the existing bot report instead of creating a duplicate', async () => {
    const github = githubWithComments([
      {
        id: 99,
        body: '## 📋 Changelog Quality Validation\nOld report',
        user: { type: 'Bot' },
      },
    ]);

    await runGithubScript(commentScript, {
      env: {
        BASE_FAILED: '1',
        FAILED: '1',
        HEAD_REF: 'fix/changelog-unified',
        NEW_FAILED: '0',
        PASSED: '10',
        PR_NUMBER: '3405',
      },
      github,
    });

    expect(github.rest.issues.updateComment).toHaveBeenCalledWith(
      expect.objectContaining({ comment_id: 99 })
    );
    expect(github.rest.issues.updateComment.mock.calls[0][0].body).toContain(
      'No new failures introduced by this PR'
    );
    expect(github.rest.issues.updateComment.mock.calls[0][0].body).toContain(
      '1 pre-existing failure(s) remain'
    );
    expect(github.rest.issues.createComment).not.toHaveBeenCalled();
  });

  test('does not overwrite a human comment that happens to use the report heading', async () => {    const github = githubWithComments([
      {
        id: 100,
        body: '## 📋 Changelog Quality Validation\nHuman-authored note',
        user: { type: 'User' },
      },
    ]);

    await runGithubScript(commentScript, {
      env: {
        BASE_FAILED: '0',
        FAILED: '0',
        HEAD_REF: 'docs/example',
        NEW_FAILED: '0',
        PASSED: '4',
        PR_NUMBER: '3405',
      },
      github,
    });

    expect(github.rest.issues.updateComment).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).toHaveBeenCalledTimes(1);
  });

  test('searches all comment pages for the existing bot report', async () => {
    const github = githubWithComments();

    await runGithubScript(commentScript, {
      env: {
        BASE_FAILED: '0',
        FAILED: '0',
        HEAD_REF: 'docs/example',
        NEW_FAILED: '0',
        PASSED: '4',
        PR_NUMBER: '3405',
      },
      github,
    });

    expect(github.paginate).toHaveBeenCalledWith(github.rest.issues.listComments, {
      owner: 'lightspeedwp',
      repo: '.github',
      issue_number: 3405,
      per_page: 100,
    });
  });
});

describe('merged changelog sync inline script', () => {
  const detectionScript = findStep('sync', 'check_changelog').with.script;

  test('detects CHANGELOG.md beyond the first GitHub API page', async () => {
    const files = Array.from({ length: 75 }, (_value, index) => ({
      filename: `file-${index}.txt`,
    }));
    files.push({ filename: 'CHANGELOG.md' });
    const github = {
      paginate: jest.fn().mockResolvedValue(files),
      rest: { pulls: { listFiles: jest.fn() } },
    };
    const result = await runGithubScript(detectionScript, { github });

    expect(github.paginate).toHaveBeenCalledWith(github.rest.pulls.listFiles, {
      owner: 'lightspeedwp',
      repo: '.github',
      pull_number: 3405,
      per_page: 100,
    });
    expect(outputValue(result.core, 'has_changelog')).toBe(true);
  });

  test('reports false when the merged pull request did not change the changelog', async () => {
    const github = {
      paginate: jest.fn().mockResolvedValue([{ filename: 'README.md' }]),
      rest: { pulls: { listFiles: jest.fn() } },
    };
    const result = await runGithubScript(detectionScript, { github });

    expect(outputValue(result.core, 'has_changelog')).toBe(false);
  });

  test('guards every mutation step behind the extracted-entry output', () => {    for (const stepName of [
      'Validate extracted entries',
      'Merge changelog entries',
      'Validate final changelog schema',
      'Commit changelog update',
    ]) {
      expect(findStep('sync', stepName).if).toBe("steps.extract.outputs.has_entries == 'true'");
    }

    expect(findStep('sync', 'Extract PR changelog entries').env).toEqual({
      PR_NUMBER: '${{ github.event.pull_request.number }}',
      PR_BASE_SHA: '${{ github.event.pull_request.base.sha }}',
      PR_HEAD_SHA: '${{ github.event.pull_request.head.sha }}',
      CHANGELOG_PATH: 'CHANGELOG.md',
    });
  });

  test('fetches the PR head ref before extraction so missing SHAs fail visibly', () => {
    const fetchHead = findStep('sync', 'Fetch PR head');

    expect(fetchHead.if).toBe("steps.check_changelog.outputs.has_changelog == 'true'");
    expect(fetchHead.env).toEqual({
      PR_NUMBER: '${{ github.event.pull_request.number }}',
    });
    expect(fetchHead.run).toContain('refs/pull/${PR_NUMBER}/head');
  });
});
