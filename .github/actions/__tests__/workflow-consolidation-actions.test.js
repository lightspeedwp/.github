const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const YAML = require('yaml');

const repositoryRoot = path.resolve(__dirname, '../../..');
const actionsRoot = path.resolve(__dirname, '..');
const temporaryDirectories = [];

afterAll(() => {
  temporaryDirectories.forEach((directory) => {
    fs.rmSync(directory, { force: true, recursive: true });
  });
});

function loadYaml(filePath) {
  return YAML.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadAction(name) {
  return loadYaml(path.join(actionsRoot, name, 'action.yml'));
}

function getStep(actionName, stepId) {
  const step = loadAction(actionName).runs.steps.find((candidate) => candidate.id === stepId);

  if (!step) {
    throw new Error(`Step ${stepId} was not found in ${actionName}`);
  }

  return step.run;
}

function renderExpressions(script, expressions) {
  return script.replace(/\$\{\{\s*([^}]+?)\s*\}\}/g, (_match, expression) => {
    const key = expression.trim();

    if (!Object.hasOwn(expressions, key)) {
      throw new Error(`No test value supplied for expression: ${key}`);
    }

    return expressions[key];
  });
}

function writeExecutable(directory, name, body) {
  const executable = path.join(directory, name);
  fs.writeFileSync(executable, `#!/usr/bin/env bash\n${body}\n`, {
    mode: 0o755,
  });
}

function runStep(actionName, stepId, options = {}) {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'workflow-consolidation-action-')
  );
  temporaryDirectories.push(temporaryDirectory);
  const mockBin = path.join(temporaryDirectory, 'bin');
  const outputFile = path.join(temporaryDirectory, 'github-output');
  const summaryFile = path.join(temporaryDirectory, 'step-summary');
  const callLog = path.join(temporaryDirectory, 'calls.log');
  const workingDirectory = options.workingDirectory || temporaryDirectory;

  fs.mkdirSync(mockBin);
  fs.writeFileSync(outputFile, '');
  fs.writeFileSync(summaryFile, '');

  Object.entries(options.commands || {}).forEach(([name, body]) => {
    writeExecutable(mockBin, name, body);
  });

  const script = `${options.preamble || ''}\n${renderExpressions(
    getStep(actionName, stepId),
    options.expressions || {}
  )}`;
  const result = spawnSync('/bin/bash', ['-c', script], {
    cwd: workingDirectory,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...options.env,
      CALL_LOG: callLog,
      GITHUB_OUTPUT: outputFile,
      GITHUB_STEP_SUMMARY: summaryFile,
      PATH: `${mockBin}:${process.env.PATH}`,
    },
  });
  const files = {
    calls: fs.existsSync(callLog) ? fs.readFileSync(callLog, 'utf8') : '',
    output: fs.readFileSync(outputFile, 'utf8'),
    summary: fs.readFileSync(summaryFile, 'utf8'),
  };

  return {
    ...result,
    files,
    temporaryDirectory,
  };
}

function outputValue(output, name) {
  const line = output.split('\n').find((candidate) => candidate.startsWith(`${name}=`));

  return line ? line.slice(name.length + 1) : undefined;
}

describe('workflow consolidation composite action contracts', () => {
  test.each(['aggregate-tests', 'apply-labels', 'collect-metrics', 'validate-check'])(
    '%s remains a composite action with declared outputs',
    (name) => {
      const action = loadAction(name);

      expect(action.runs.using).toBe('composite');
      expect(action.runs.steps.length).toBeGreaterThan(0);
      expect(Object.keys(action.outputs).length).toBeGreaterThan(0);
      Object.values(action.outputs).forEach((output) => {
        expect(output.value).toMatch(/^\$\{\{ steps\.[\w-]+\.outputs\.[\w-]+ \}\}$/);
      });
    }
  );
});

describe('aggregate-tests', () => {
  test.each(['0', '80', '100'])(
    'accepts the inclusive coverage threshold boundary %s',
    (threshold) => {
      const result = runStep('aggregate-tests', 'validate', {
        expressions: { 'inputs.coverage-threshold': threshold },
      });

      expect(result.status).toBe(0);
      expect(result.files.output).toContain(`coverage-threshold=${threshold}\n`);
    }
  );

  test.each(['-1', '101', '80.5', 'not-a-number', ''])(
    'rejects invalid coverage threshold %j',
    (threshold) => {
      const result = runStep('aggregate-tests', 'validate', {
        expressions: { 'inputs.coverage-threshold': threshold },
      });

      expect(result.status).toBe(1);
      expect(result.stderr).toContain('coverage-threshold must be a number between 0 and 100');
    }
  );

  test('aggregates multiple JUnit files and a fractional coverage report', () => {
    const resultsDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'aggregate-results-'));
    temporaryDirectories.push(resultsDirectory);
    fs.writeFileSync(
      path.join(resultsDirectory, 'first.xml'),
      '<testsuite tests="5" failures="1" />'
    );
    fs.writeFileSync(
      path.join(resultsDirectory, 'second.xml'),
      '<testsuite tests="3" failures="2" />'
    );
    fs.writeFileSync(
      path.join(resultsDirectory, 'coverage-summary.json'),
      JSON.stringify({ total: { lines: { pct: 87.5 } } })
    );

    const result = runStep('aggregate-tests', 'aggregate', {
      commands: {
        bc: 'read -r expression\nawk "BEGIN { print (${expression}) ? 1 : 0 }"',
      },
      expressions: {
        'inputs.test-results-path': resultsDirectory,
        'steps.validate.outputs.coverage-threshold': '80',
      },
    });

    expect(result.status).toBe(0);
    expect(outputValue(result.files.output, 'total-tests')).toBe('8');
    expect(outputValue(result.files.output, 'passed-tests')).toBe('5');
    expect(outputValue(result.files.output, 'failed-tests')).toBe('3');
    expect(outputValue(result.files.output, 'coverage-percent')).toBe('87.5');
    expect(outputValue(result.files.output, 'coverage-status')).toBe('PASS');
  });

  test('returns deterministic zero totals and failed coverage for a missing path', () => {
    const result = runStep('aggregate-tests', 'aggregate', {
      commands: {
        bc: 'read -r expression\nawk "BEGIN { print (${expression}) ? 1 : 0 }"',
      },
      expressions: {
        'inputs.test-results-path': '/path/that/does/not/exist',
        'steps.validate.outputs.coverage-threshold': '1',
      },
    });

    expect(result.status).toBe(0);
    expect(outputValue(result.files.output, 'total-tests')).toBe('0');
    expect(outputValue(result.files.output, 'passed-tests')).toBe('0');
    expect(outputValue(result.files.output, 'failed-tests')).toBe('0');
    expect(outputValue(result.files.output, 'coverage-status')).toBe('FAIL');
  });

  test.each([
    { failed: '0', coverageStatus: 'PASS', expectedStatus: 0 },
    { failed: '1', coverageStatus: 'PASS', expectedStatus: 1 },
    { failed: '0', coverageStatus: 'FAIL', expectedStatus: 1 },
  ])(
    'reports failed=$failed and coverage=$coverageStatus with exit $expectedStatus',
    ({ failed, coverageStatus, expectedStatus }) => {
      const result = runStep('aggregate-tests', 'report', {
        expressions: {
          'steps.aggregate.outputs.total-tests': '4',
          'steps.aggregate.outputs.passed-tests': String(4 - Number(failed)),
          'steps.aggregate.outputs.failed-tests': failed,
          'steps.aggregate.outputs.coverage-percent': '90',
          'steps.aggregate.outputs.coverage-status': coverageStatus,
        },
      });

      expect(result.status).toBe(expectedStatus);
      expect(result.files.summary).toContain('## Test Aggregation Report');
      expect(result.files.summary).toContain(`| Failed | ${failed} |`);
    }
  );
});

describe('apply-labels', () => {
  test.each([
    { pr: '', issue: '', labels: 'type:bug', error: 'Either pr-number or issue-number' },
    { pr: '12', issue: '', labels: '', error: 'labels input is required' },
  ])('rejects incomplete required inputs', ({ pr, issue, labels, error }) => {
    const result = runStep('apply-labels', 'validate', {
      expressions: {
        'inputs.pr-number': pr,
        'inputs.issue-number': issue,
        'inputs.labels': labels,
      },
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(error);
  });

  test('normalises the selected target and preserves comma-separated labels', () => {
    const result = runStep('apply-labels', 'validate', {
      expressions: {
        'inputs.pr-number': '',
        'inputs.issue-number': '34',
        'inputs.labels': 'type:bug, priority:high',
      },
    });

    expect(result.status).toBe(0);
    expect(result.files.output).toContain('issue-number=34\n');
    expect(result.files.output).toContain('labels=type:bug, priority:high\n');
  });

  test('warns about an unprefixed label without preventing valid labels', () => {
    const result = runStep('apply-labels', 'validate', {
      expressions: {
        'inputs.pr-number': '12',
        'inputs.issue-number': '',
        'inputs.labels': 'type:bug,legacy-label',
      },
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Label 'legacy-label' does not match required prefix pattern");
  });

  test('records successful and failed label updates independently', () => {
    const result = runStep('apply-labels', 'apply', {
      preamble: [
        'gh() {',
        '  printf \'%s\\n\' "$*" >> "$CALL_LOG"',
        '  if [[ "$1 $2" == "pull view" ]]; then return 1; fi',
        '  if [[ "$*" == *"--add-label area:ci"* ]]; then return 1; fi',
        '  return 0',
        '}',
      ].join('\n'),
      env: { GITHUB_REPOSITORY: 'lightspeedwp/.github' },
      expressions: {
        'steps.validate.outputs.pr-number': '3308',
        'steps.validate.outputs.issue-number': '',
        'steps.validate.outputs.labels': 'type:refactor, area:ci',
      },
    });

    expect(result.status).toBe(0);
    expect(outputValue(result.files.output, 'total-applied')).toBe('1');
    expect(outputValue(result.files.output, 'applied-labels')).toContain('type:refactor');
    expect(outputValue(result.files.output, 'failed-labels')).toContain('area:ci');
    expect(result.stderr).toContain('1 label(s) failed to apply');
    expect(result.files.calls).toContain('pull edit 3308');
  });

  test('skips empty list entries instead of issuing empty GitHub updates', () => {
    const result = runStep('apply-labels', 'apply', {
      preamble: 'gh() { printf \'%s\\n\' "$*" >> "$CALL_LOG"; return 1; }',
      env: { GITHUB_REPOSITORY: 'lightspeedwp/.github' },
      expressions: {
        'steps.validate.outputs.pr-number': '',
        'steps.validate.outputs.issue-number': '44',
        'steps.validate.outputs.labels': ', ,',
      },
    });

    expect(result.status).toBe(0);
    expect(outputValue(result.files.output, 'total-applied')).toBe('0');
    expect(result.files.calls).toBe('');
  });
});

describe('collect-metrics', () => {
  test.each([
    ['unit-test', 5],
    ['lint-yaml', 2],
    ['validate-inputs', 2],
    ['build-site', 3],
    ['deploy-production', 10],
    ['setup', 1],
  ])('classifies %s jobs as %i estimated minutes', (jobName, minutes) => {
    const result = runStep('collect-metrics', 'collect', {
      preamble: 'gh() { return 1; }',
      expressions: {
        'inputs.workflow-name': 'Consolidated CI',
        'inputs.job-name': jobName,
        'inputs.metrics-file': 'metrics.json',
        'github.repository': 'lightspeedwp/.github',
        'github.run_id': '12345',
      },
    });
    const metrics = JSON.parse(
      fs.readFileSync(path.join(result.temporaryDirectory, 'metrics.json'), 'utf8')
    );

    expect(result.status).toBe(0);
    expect(metrics).toMatchObject({
      workflow: 'Consolidated CI',
      job: jobName,
      run_id: '12345',
      repository: 'lightspeedwp/.github',
      metrics: { estimated_github_actions_minutes: minutes },
    });
    expect(metrics.timing.duration_seconds).toBeGreaterThanOrEqual(0);
    expect(outputValue(result.files.output, 'workflow-minutes')).toBe(String(minutes));
  });
});

describe('validate-check', () => {
  test.each(['queued', 'in_progress'])('accepts %s without a conclusion', (status) => {
    const result = runStep('validate-check', 'validate', {
      expressions: {
        'inputs.status': status,
        'inputs.conclusion': '',
      },
    });

    expect(result.status).toBe(0);
    expect(result.files.output).toContain(`status=${status}\n`);
  });

  test.each(['success', 'failure', 'neutral', 'cancelled', 'skipped', 'timed_out'])(
    'accepts completed with conclusion %s',
    (conclusion) => {
      const result = runStep('validate-check', 'validate', {
        expressions: {
          'inputs.status': 'completed',
          'inputs.conclusion': conclusion,
        },
      });

      expect(result.status).toBe(0);
      expect(result.files.output).toContain(`conclusion=${conclusion}\n`);
    }
  );

  test.each([
    ['waiting', '', 'Invalid status'],
    ['completed', '', 'Invalid conclusion'],
    ['completed', 'unknown', 'Invalid conclusion'],
  ])('rejects status %s with conclusion %j', (status, conclusion, error) => {
    const result = runStep('validate-check', 'validate', {
      expressions: {
        'inputs.status': status,
        'inputs.conclusion': conclusion,
      },
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(error);
  });

  test('creates a completed check and exposes its identifier', () => {
    const result = runStep('validate-check', 'create-check', {
      preamble: [
        'gh() {',
        '  printf \'%s\\n\' "$*" >> "$CALL_LOG"',
        '  if [[ "$1 $2" == "api graphql" ]]; then echo \'{}\'; return 0; fi',
        '  echo \'{"id":9876}\'',
        '}',
      ].join('\n'),
      env: { GH_REPO: 'lightspeedwp/.github' },
      expressions: {
        'inputs.check-name': 'Branch Validation',
        'steps.validate.outputs.status': 'completed',
        'steps.validate.outputs.conclusion': 'success',
        'inputs.details-url': '',
        'inputs.summary': 'Branch name is valid',
        'inputs.text': '',
        'inputs.annotations': '',
        'github.sha': 'abc123',
      },
    });

    expect(result.status).toBe(0);
    expect(outputValue(result.files.output, 'check-id')).toBe('9876');
    expect(outputValue(result.files.output, 'status')).toBe('completed');
    expect(result.files.calls).toContain('-f conclusion=success');
    expect(result.files.calls).toContain('-f head_sha=abc123');
  });

  test('fails clearly when the checks API does not return an identifier', () => {
    const result = runStep('validate-check', 'create-check', {
      preamble: "gh() { echo '{}'; }",
      env: { GH_REPO: 'lightspeedwp/.github' },
      expressions: {
        'inputs.check-name': 'Branch Validation',
        'steps.validate.outputs.status': 'queued',
        'steps.validate.outputs.conclusion': '',
        'inputs.details-url': '',
        'inputs.summary': 'Waiting',
        'inputs.text': '',
        'inputs.annotations': '',
        'github.sha': 'abc123',
      },
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Failed to create check run');
    expect(result.files.output).toBe('');
  });
});

describe('workflow test definitions', () => {
  test('the workflow harness keeps all supported workflow types in its matrix', () => {
    const workflow = loadYaml(path.join(repositoryRoot, '.github/tests/workflow-harness.yml'));
    const matrixStep = workflow.jobs['harness-setup'].steps.find((step) => step.id === 'matrix');

    expect(matrixStep.run).toContain(
      '["labeling","validation","testing","linting","quality-gates"]'
    );
    expect(workflow.jobs['harness-report'].if).toBe('always()');
    expect(workflow.jobs['harness-report'].needs).toEqual(
      expect.arrayContaining([
        'harness-setup',
        'test-labeling-unified',
        'test-validation-unified',
        'test-testing-unified',
        'test-linting-unified',
        'test-quality-gates',
      ])
    );
  });

  test('error isolation accepts only supported workflow types and always cleans up', () => {
    const workflow = loadYaml(path.join(repositoryRoot, '.github/tests/error-isolation-test.yml'));
    const expectedTypes = ['labeling', 'validation', 'testing', 'linting', 'quality-gates'];

    expect(workflow.on.workflow_dispatch.inputs['workflow-type'].options).toEqual(expectedTypes);
    expect(workflow.jobs.cleanup.if).toBe('always()');
    expect(workflow.jobs.cleanup.needs).toEqual(['setup', 'inject-failure', 'monitor-isolation']);
  });
});
