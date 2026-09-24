const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const YAML = require('yaml');

const repositoryRoot = path.resolve(__dirname, '../../..');
const workflowPath = path.join(
  repositoryRoot,
  '.github/workflows/branch-validation-metrics-aggregator.yml'
);
const workflow = YAML.parse(fs.readFileSync(workflowPath, 'utf8'));
const temporaryDirectories = [];

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

function metricFile(overrides = {}) {
  return JSON.stringify({
    timestamp: '2026-09-24T00:00:00Z',
    branch_name: 'feat/example',
    valid: true,
    errors: '',
    actor: 'test',
    event: 'push',
    ref: 'refs/heads/feat/example',
    sha: 'abc123',
    ...overrides,
  });
}

// Runs the real `aggregate` step against a fixture metrics-artifacts
// directory. Returns exit status, combined output, the generated summary
// JSON and the `total=` step output.
function runAggregateStep(files, options = {}) {
  const aggregateStep = findStep('aggregate-metrics', 'aggregate');
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'metrics-aggregator-'));
  const outputPath = path.join(temporaryDirectory, 'github-output');
  const artifactsDirectory = path.join(temporaryDirectory, 'metrics-artifacts');

  temporaryDirectories.push(temporaryDirectory);
  fs.mkdirSync(artifactsDirectory, { recursive: true });
  fs.writeFileSync(outputPath, '');

  for (const [name, contents] of Object.entries(files)) {
    fs.writeFileSync(path.join(artifactsDirectory, name), contents);
  }

  const result = spawnSync('/bin/bash', ['-euo', 'pipefail', '-c', aggregateStep.run], {
    cwd: temporaryDirectory,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...options.env,
      GITHUB_OUTPUT: outputPath,
    },
  });

  const summaryPath = path.join(
    temporaryDirectory,
    '.github/reports/branch-validation/metrics-summary.json'
  );
  const summary = fs.existsSync(summaryPath)
    ? JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
    : null;
  const totalOutput = fs
    .readFileSync(outputPath, 'utf8')
    .split('\n')
    .find((line) => line.startsWith('total='))
    ?.slice('total='.length);

  return {
    ...result,
    combinedOutput: `${result.stdout || ''}${result.stderr || ''}`,
    summary,
    totalOutput,
  };
}

describe('branch validation metrics aggregator', () => {
  test('all valid artifacts aggregate with unchanged category counts', () => {
    const result = runAggregateStep({
      '20260924-000001-1.json': metricFile({ valid: true }),
      '20260924-000002-2.json': metricFile({
        valid: false,
        errors: 'invalid_type: bad prefix',
      }),
    });

    expect(result.status).toBe(0);
    expect(result.summary.total_validations).toBe(2);
    expect(result.summary.valid_count).toBe(1);
    expect(result.summary.failed_validations).toBe(1);
    expect(result.summary.error_breakdown.invalid_type).toBe(1);
    expect(result.summary.error_breakdown.forbidden_prefix).toBe(0);
    expect(result.summary.error_breakdown.malformed_format).toBe(0);
    expect(result.totalOutput).toBe('2');
    expect(result.combinedOutput).not.toMatch(/malformed metrics artifact/);
  });

  test('mixed valid and malformed artifacts aggregate the valid files (#3528)', () => {
    const result = runAggregateStep({
      '20260924-000001-1.json': metricFile({ valid: true }),
      '20260924-000002-2.json': metricFile({
        valid: false,
        errors: 'forbidden_prefix: copilot/',
      }),
      '20260924-000003-3.json': 'NOT JSON{{{',
    });

    expect(result.status).toBe(0);
    expect(result.summary.total_validations).toBe(2);
    expect(result.summary.valid_count).toBe(1);
    expect(result.summary.error_breakdown.forbidden_prefix).toBe(1);
    expect(result.totalOutput).toBe('2');
    expect(result.combinedOutput).toMatch(/Skipping malformed metrics artifact/);
    expect(result.combinedOutput).toMatch(/20260924-000003-3\.json/);
  });

  test('empty input retains the zero semantics', () => {
    const result = runAggregateStep({});

    expect(result.status).toBe(0);
    expect(result.summary.total_validations).toBe(0);
    expect(result.summary.pass_rate_percent).toBe(0);
    expect(result.totalOutput).toBe('0');
    expect(result.combinedOutput).not.toMatch(/malformed metrics artifact/);
  });

  test('all malformed input reports zeros with a warning, not misleading metrics', () => {
    const result = runAggregateStep({
      '20260924-000001-1.json': 'NOT JSON{{{',
      '20260924-000002-2.json': '{"truncated": true,',
    });

    expect(result.status).toBe(0);
    expect(result.summary.total_validations).toBe(0);
    expect(result.totalOutput).toBe('0');
    expect(result.combinedOutput).toMatch(/Skipping malformed metrics artifact/);
  });

  test('metric error classifications still count (malformed branch input is not a malformed artifact)', () => {
    const result = runAggregateStep({
      '20260924-000001-1.json': metricFile({
        valid: false,
        errors: 'malformed: cannot parse branch',
      }),
      '20260924-000002-2.json': metricFile({
        valid: false,
        errors: 'forbidden_prefix, invalid_type',
      }),
    });

    expect(result.status).toBe(0);
    expect(result.summary.total_validations).toBe(2);
    expect(result.summary.error_breakdown.malformed_format).toBe(1);
    expect(result.summary.error_breakdown.forbidden_prefix).toBe(1);
    expect(result.summary.error_breakdown.invalid_type).toBe(1);
    expect(result.totalOutput).toBe('2');
  });

  test('unusual filenames aggregate safely', () => {
    const result = runAggregateStep({
      '20260924-000001-1 with space.json': metricFile({ valid: true }),
      '-20260924-000002-2.json': metricFile({ valid: false, errors: 'invalid_type' }),
      '20260924-000003-3.json': 'garbage{{{',
    });

    expect(result.status).toBe(0);
    expect(result.summary.total_validations).toBe(2);
    expect(result.totalOutput).toBe('2');
  });
});
