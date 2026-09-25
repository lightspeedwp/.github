const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const YAML = require('yaml');

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

  return step;
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

  const step = getStep(actionName, stepId);
  const expressions = options.expressions || {};
  const script = `${options.preamble || ''}\n${renderExpressions(step.run, expressions)}`;
  // Mirror the runner: a step's `env:` values are expression-rendered and
  // exported to its script, which reads inputs from them rather than inline.
  // Unsupplied expressions (e.g. tokens) render empty, as an unset context does.
  const stepEnv = Object.fromEntries(
    Object.entries(step.env || {}).map(([name, value]) => [
      name,
      String(value).replace(/\$\{\{\s*([^}]+?)\s*\}\}/g, (_match, expression) =>
        Object.hasOwn(expressions, expression.trim()) ? expressions[expression.trim()] : ''
      ),
    ])
  );
  const result = spawnSync('/bin/bash', ['-c', script], {
    cwd: workingDirectory,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...stepEnv,
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
  test.each(['apply-labels', 'collect-metrics'])(
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
