import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parse } from 'yaml';

const repoRoot = path.resolve(__dirname, '../../..');
const actionRoot = path.join(repoRoot, '.github/actions');
const temporaryDirectories = [];

function createTemporaryDirectory() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'composite-action-test-'));
  temporaryDirectories.push(directory);
  return directory;
}

function loadAction(name) {
  return parse(fs.readFileSync(path.join(actionRoot, name, 'action.yml'), 'utf8'));
}

function resolveInputExpressions(value, inputs) {
  if (typeof value !== 'string') {
    return String(value);
  }

  return value.replace(/\$\{\{\s*inputs\.([a-z_]+)\s*\}\}/gi, (_, inputName) => {
    return String(inputs[inputName] ?? '');
  });
}

function parseOutputs(outputFile) {
  if (!fs.existsSync(outputFile)) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(outputFile, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf('=');
        return [line.slice(0, separator), line.slice(separator + 1)];
      })
  );
}

function runStep(actionName, stepId, options = {}) {
  const action = loadAction(actionName);
  const inputs = Object.fromEntries(
    Object.entries(action.inputs ?? {}).map(([name, definition]) => [
      name,
      definition.default ?? '',
    ])
  );
  Object.assign(inputs, options.inputs);

  const step = action.runs.steps.find(({ id }) => id === stepId);
  if (!step) {
    throw new Error(`Action ${actionName} does not define step ${stepId}`);
  }

  const workingDirectory = options.cwd ?? createTemporaryDirectory();
  const outputFile = path.join(workingDirectory, 'github-output.txt');
  const stepEnvironment = Object.fromEntries(
    Object.entries(step.env ?? {}).map(([name, value]) => [
      name,
      resolveInputExpressions(value, inputs),
    ])
  );
  const script = resolveInputExpressions(step.run, inputs);
  const result = spawnSync(
    '/usr/bin/bash',
    ['--noprofile', '--norc', '-e', '-o', 'pipefail', '-c', script],
    {
      cwd: workingDirectory,
      encoding: 'utf8',
      timeout: 5_000,
      env: {
        ...process.env,
        ...stepEnvironment,
        ...options.env,
        GITHUB_OUTPUT: outputFile,
      },
    }
  );

  return {
    ...result,
    outputFile,
    outputs: parseOutputs(outputFile),
  };
}

function installCurlStub(directory, response) {
  const binaryDirectory = path.join(directory, 'bin');
  const stub = path.join(binaryDirectory, 'curl');
  fs.mkdirSync(binaryDirectory, { recursive: true });
  fs.writeFileSync(
    stub,
    '#!/usr/bin/env bash\nif [[ -n "${CURL_LOG:-}" ]]; then : > "$CURL_LOG"; fi\nprintf \'%s\' "$MOCK_CURL_RESPONSE"\n'
  );
  fs.chmodSync(stub, 0o755);

  return {
    MOCK_CURL_RESPONSE: response,
    PATH: `${binaryDirectory}:${process.env.PATH}`,
  };
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('workflow consolidation composite actions', () => {
  test.each(['aggregate-tests', 'apply-labels', 'collect-metrics', 'validate-check'])(
    '%s maps every declared output to a value emitted by its source step',
    (actionName) => {
      const action = loadAction(actionName);
      const missingOutputs = [];

      for (const [outputName, output] of Object.entries(action.outputs)) {
        const mapping = output.value.match(/^\$\{\{\s*steps\.([^.]+)\.outputs\.([^.\s]+)\s*\}\}$/);
        expect(mapping).not.toBeNull();

        const [, stepId, stepOutput] = mapping;
        const sourceStep = action.runs.steps.find(({ id }) => id === stepId);
        if (!sourceStep?.run.includes(`${stepOutput}=`)) {
          missingOutputs.push(outputName);
        }
      }

      expect(missingOutputs).toEqual([]);
    }
  );

  describe('apply-labels', () => {
    test.each([
      ['pull_request', 'frontmatter'],
      ['pull_request', 'type'],
      ['issue', 'custom'],
    ])('accepts target type %s with source %s', (targetType, source) => {
      const result = runStep('apply-labels', 'validate', {
        inputs: { target_type: targetType, source },
      });

      expect(result.status).toBe(0);
      expect(result.stdout).toContain('Input validation passed');
    });

    test.each([
      [{ target_type: 'discussion', source: 'type' }, 'Invalid target_type'],
      [{ target_type: 'issue', source: 'automatic' }, 'Invalid source'],
    ])('rejects invalid input %#', (inputs, expectedMessage) => {
      const result = runStep('apply-labels', 'validate', { inputs });

      expect(result.status).toBe(1);
      expect(result.stdout).toContain(expectedMessage);
    });

    test('normalises comma-separated labels and performs no HTTP request in dry-run mode', () => {
      const directory = createTemporaryDirectory();
      const curlLog = path.join(directory, 'curl-called');
      const result = runStep('apply-labels', 'apply', {
        cwd: directory,
        inputs: {
          target_type: 'pull_request',
          target_id: '3359',
          source: 'type',
          labels: ' type:feature, area:ci, ,priority:high ',
          dry_run: 'true',
          github_token: 'local-test-token',
          github_repository: 'lightspeedwp/.github',
        },
        env: {
          ...installCurlStub(directory, '{}'),
          CURL_LOG: curlLog,
        },
      });

      expect(result.status).toBe(0);
      expect(JSON.parse(result.outputs.labels_applied)).toEqual([
        'type:feature',
        'area:ci',
        'priority:high',
      ]);
      expect(result.outputs.total_labels).toBe('3');
      expect(result.outputs.status).toBe('success');
      expect(fs.existsSync(curlLog)).toBe(false);
    });

    test('reports an empty label list as a partial success', () => {
      const result = runStep('apply-labels', 'apply', {
        inputs: {
          target_type: 'issue',
          target_id: '42',
          source: 'custom',
          labels: '',
          dry_run: 'true',
          github_token: 'local-test-token',
          github_repository: 'lightspeedwp/.github',
        },
      });

      expect(result.status).toBe(0);
      expect(result.outputs.labels_applied).toBe('[]');
      expect(result.outputs.total_labels).toBe('0');
      expect(result.outputs.status).toBe('partial_success');
    });

    test('propagates a GitHub API error through action outputs', () => {
      const directory = createTemporaryDirectory();
      const result = runStep('apply-labels', 'apply', {
        cwd: directory,
        inputs: {
          target_type: 'issue',
          target_id: '42',
          source: 'custom',
          labels: 'type:bug',
          dry_run: 'false',
          github_token: 'local-test-token',
          github_repository: 'lightspeedwp/.github',
        },
        env: installCurlStub(directory, '{"message":"permission denied"}'),
      });

      expect(result.status).toBe(0);
      expect(result.outputs.status).toBe('failure');
      expect(result.outputs.error_message).toBe('permission denied');
      expect(result.outputs.labels_applied).toBe('[]');
    });

    test('serialises removed labels according to the declared JSON output contract', () => {
      const result = runStep('apply-labels', 'apply', {
        inputs: {
          target_type: 'issue',
          target_id: '42',
          source: 'custom',
          labels: 'type:bug',
          remove_labels: ' status:needs-triage, priority:low ',
          dry_run: 'true',
          github_token: 'local-test-token',
          github_repository: 'lightspeedwp/.github',
        },
      });

      expect(JSON.parse(result.outputs.labels_removed)).toEqual([
        'status:needs-triage',
        'priority:low',
      ]);
    });

    test('rejects labels that are absent from the canonical label configuration', () => {
      const result = runStep('apply-labels', 'apply', {
        inputs: {
          target_type: 'issue',
          target_id: '42',
          source: 'custom',
          labels: 'feature',
          dry_run: 'true',
          github_token: 'local-test-token',
          github_repository: 'lightspeedwp/.github',
        },
      });

      expect(JSON.parse(result.outputs.labels_applied)).toEqual([]);
      expect(result.outputs.status).toBe('partial_success');
      expect(result.outputs.error_message).toContain('feature');
    });
  });

  describe('aggregate-tests', () => {
    function writeJson(directory, filename, value) {
      const file = path.join(directory, filename);
      fs.writeFileSync(file, JSON.stringify(value));
      return file;
    }

    test('aggregates unit, integration, and E2E counts into the declared outputs and report file', () => {
      const directory = createTemporaryDirectory();
      const unit = writeJson(directory, 'unit.json', {
        total: 10,
        passed: 8,
        failed: 1,
        skipped: 1,
        duration_seconds: 4,
      });
      const integration = writeJson(directory, 'integration.json', {
        total: 5,
        passed: 5,
        failed: 0,
        skipped: 0,
        duration_seconds: 6,
      });
      const e2e = writeJson(directory, 'e2e.json', {
        total: 2,
        passed: 1,
        failed: 1,
        skipped: 0,
        duration_seconds: 10,
      });
      const output = path.join(directory, 'results', 'aggregated.json');
      fs.mkdirSync(path.dirname(output), { recursive: true });

      const result = runStep('aggregate-tests', 'aggregate', {
        cwd: directory,
        inputs: {
          unit_test_result: unit,
          integration_test_result: integration,
          e2e_test_result: e2e,
          output_file: output,
        },
      });

      expect(result.status).toBe(0);
      expect(result.outputs.total_tests).toBe('17');
      expect(result.outputs.failed_count).toBe('2');
      expect(result.outputs.status).toBe('failure');
      expect(JSON.parse(result.outputs.aggregated_results)).toMatchObject({
        total_tests: 17,
        passed: 14,
        failed: 2,
        skipped: 1,
        duration_seconds: 20,
        status: 'failure',
      });
      expect(JSON.parse(fs.readFileSync(output, 'utf8'))).toEqual(
        JSON.parse(result.outputs.aggregated_results)
      );
    });

    test.each([
      ['missing result file', 'does-not-exist.json'],
      ['malformed result JSON', 'malformed.json'],
    ])('reports failure for a %s', (_, filename) => {
      const directory = createTemporaryDirectory();
      const resultFile = path.join(directory, filename);
      if (filename === 'malformed.json') {
        fs.writeFileSync(resultFile, '{not valid json');
      }

      const result = runStep('aggregate-tests', 'aggregate', {
        cwd: directory,
        inputs: {
          unit_test_result: resultFile,
          integration_test_result: 'skip',
          e2e_test_result: 'skip',
        },
      });

      expect(result.outputs.status).toBe('failure');
    });

    test('fails when line coverage is below the configured threshold', () => {
      const directory = createTemporaryDirectory();
      const coverage = path.join(directory, 'lcov.info');
      fs.writeFileSync(coverage, 'SF:example.js\nDA:1,1\nDA:2,0\nend_of_record\n');

      const result = runStep('aggregate-tests', 'aggregate', {
        cwd: directory,
        inputs: {
          unit_test_result: 'skip',
          integration_test_result: 'skip',
          e2e_test_result: 'skip',
          coverage_file: coverage,
          coverage_threshold: '80',
        },
      });

      expect(result.outputs.coverage_percent).toBe('50');
      expect(result.outputs.status).toBe('failure');
    });
  });

  describe('collect-metrics', () => {
    test.each(['minutes_used', 'duration_seconds', 'job_count', 'all'])(
      'accepts metric type %s',
      (metricType) => {
        const result = runStep('collect-metrics', 'validate', {
          inputs: { metric_type: metricType },
        });
        expect(result.status).toBe(0);
      }
    );

    test('rejects an unsupported metric type', () => {
      const result = runStep('collect-metrics', 'validate', {
        inputs: { metric_type: 'billing_total' },
      });
      expect(result.status).toBe(1);
      expect(result.stdout).toContain('Invalid metric_type');
    });

    test('rejects an unsupported output format', () => {
      const result = runStep('collect-metrics', 'validate', {
        inputs: { metric_type: 'all', output_format: 'xml' },
      });
      expect(result.status).toBe(1);
      expect(result.stdout).toContain('Invalid output_format');
    });

    test('returns internally consistent metric values', () => {
      const result = runStep('collect-metrics', 'collect', {
        inputs: { workflow_name: 'testing-unified', workflow_run_id: '1234' },
      });
      const metrics = JSON.parse(result.outputs.metrics_json);
      const minutes = Number(result.outputs.minutes_used);
      const duration = Number(result.outputs.duration_seconds);

      expect(result.status).toBe(0);
      expect(result.outputs.status).toBe('success');
      expect(minutes).toBeGreaterThanOrEqual(0);
      expect(minutes).toBeLessThan(10);
      expect(duration).toBe(minutes * 60);
      expect(metrics).toMatchObject({
        workflow_name: 'testing-unified',
        workflow_run_id: '1234',
        minutes_used: minutes,
        duration_seconds: duration,
      });
    });
  });

  describe('validate-check', () => {
    test.each(['success', 'failure', 'neutral'])('accepts status %s', (status) => {
      const result = runStep('validate-check', 'validate', {
        inputs: { status, check_name: 'validation-unified' },
      });
      expect(result.status).toBe(0);
    });

    test.each([
      [{ status: 'warning', check_name: 'validation-unified' }, 'Invalid status'],
      [{ status: 'success', check_name: '' }, 'check_name cannot be empty'],
    ])('rejects invalid check input %#', (inputs, expectedMessage) => {
      const result = runStep('validate-check', 'validate', { inputs });
      expect(result.status).toBe(1);
      expect(result.stdout).toContain(expectedMessage);
    });

    test.each([
      ['false', ''],
      ['true', 'comment_'],
    ])('reports a check when post_comment is %s', (postComment, commentPrefix) => {
      const result = runStep('validate-check', 'report', {
        inputs: {
          github_token: 'local-test-token',
          check_name: 'validation-unified',
          status: 'neutral',
          title: 'Validation result',
          summary: 'No applicable checks',
          details: '[{"check":"branch","passed":true}]',
          post_comment: postComment,
        },
      });

      expect(result.status).toBe(0);
      expect(result.outputs.check_id).toMatch(/^check_\d+$/);
      expect(result.outputs.comment_id).toMatch(
        commentPrefix ? new RegExp(`^${commentPrefix}\\d+$`) : /^$/
      );
      expect(result.outputs.status).toBe('success');
      expect(result.outputs.message).toBe("Check 'validation-unified' reported as neutral");
    });

    test('treats Markdown summary content as data rather than executable shell', () => {
      const directory = createTemporaryDirectory();
      const sentinel = path.join(directory, 'executed');
      const summary = `$(touch ${sentinel})`;
      const result = runStep('validate-check', 'report', {
        cwd: directory,
        inputs: {
          github_token: 'local-test-token',
          check_name: 'validation-unified',
          status: 'success',
          title: 'Security regression',
          summary,
          details: '[]',
          post_comment: 'false',
        },
      });

      expect(result.status).toBe(0);
      expect(result.stdout).toContain(summary);
      expect(fs.existsSync(sentinel)).toBe(false);
    });
  });
});
