import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import matter from 'gray-matter';
import { parse } from 'yaml';

const repoRoot = path.resolve(__dirname, '../..');
const workflowDirectory = path.join(repoRoot, '.github/workflows');
const scriptDirectory = path.join(repoRoot, '.github/scripts');
const workflowFiles = [
  'labeling-unified.yml',
  'validation-unified.yml',
  'testing-unified.yml',
  'linting-unified.yml',
  'quality-gates.yml',
];
const temporaryDirectories = [];

function createTemporaryDirectory() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'workflow-consolidation-test-'));
  temporaryDirectories.push(directory);
  return directory;
}

function loadYaml(relativePath) {
  return parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function loadWorkflow(filename) {
  return loadYaml(`.github/workflows/${filename}`);
}

function workflowSteps(workflow) {
  return Object.entries(workflow.jobs ?? {}).flatMap(([jobId, job]) =>
    (job.steps ?? []).map((step) => ({ jobId, step }))
  );
}

function runScript(filename, args = [], options = {}) {
  return spawnSync('/usr/bin/bash', [path.join(scriptDirectory, filename), ...args], {
    cwd: options.cwd ?? repoRoot,
    encoding: 'utf8',
    timeout: 5_000,
    env: {
      PATH: process.env.PATH,
      ...options.env,
    },
  });
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('unified workflow contracts', () => {
  test.each(workflowFiles)('%s is valid YAML with at least one job', (filename) => {
    const workflow = loadWorkflow(filename);

    expect(workflow.name).toEqual(expect.any(String));
    expect(workflow.on).toBeDefined();
    expect(Object.keys(workflow.jobs ?? {}).length).toBeGreaterThan(0);
  });

  test('uses the composite actions assigned to each consolidated workflow', () => {
    const expectedActions = {
      'labeling-unified.yml': ['apply-labels', 'collect-metrics', 'validate-check'],
      'validation-unified.yml': ['collect-metrics', 'validate-check'],
      'testing-unified.yml': ['aggregate-tests', 'collect-metrics'],
      'linting-unified.yml': ['collect-metrics', 'validate-check'],
      'quality-gates.yml': ['collect-metrics', 'validate-check'],
    };

    for (const [filename, expected] of Object.entries(expectedActions)) {
      const used = workflowSteps(loadWorkflow(filename))
        .map(({ step }) => step.uses?.match(/^\.\/\.github\/actions\/([^/]+)$/)?.[1])
        .filter(Boolean);

      expect(new Set(used)).toEqual(new Set(expected));
    }
  });

  test('supplies every required input when invoking a local composite action', () => {
    const missingInputs = [];

    for (const filename of workflowFiles) {
      for (const { jobId, step } of workflowSteps(loadWorkflow(filename))) {
        const actionName = step.uses?.match(/^\.\/\.github\/actions\/([^/]+)$/)?.[1];
        if (!actionName) {
          continue;
        }

        const action = loadYaml(`.github/actions/${actionName}/action.yml`);
        const required = Object.entries(action.inputs ?? {})
          .filter(([, definition]) => definition.required === true)
          .map(([name]) => name);

        for (const input of required) {
          if (!(input in (step.with ?? {}))) {
            missingInputs.push(`${filename}:${jobId}:${step.name}:${input}`);
          }
        }
      }
    }

    expect(missingInputs).toEqual([]);
  });

  test('checks out the repository before using a local composite action', () => {
    const orderingErrors = [];

    for (const filename of workflowFiles) {
      const workflow = loadWorkflow(filename);
      for (const [jobId, job] of Object.entries(workflow.jobs ?? {})) {
        const checkoutIndex = (job.steps ?? []).findIndex(({ uses }) =>
          uses?.startsWith('actions/checkout@')
        );
        const localActionIndex = (job.steps ?? []).findIndex(({ uses }) =>
          uses?.startsWith('./.github/actions/')
        );

        if (localActionIndex !== -1 && (checkoutIndex === -1 || checkoutIndex > localActionIndex)) {
          orderingErrors.push(`${filename}:${jobId}`);
        }
      }
    }

    expect(orderingErrors).toEqual([]);
  });

  test('routes attacker-controlled GitHub context through environment variables before shell use', () => {
    const directInterpolations = [];
    const untrustedContext =
      /\$\{\{[^}]*(?:github\.head_ref|github\.ref\b|github\.event\.pull_request\.(?:body|title)|github\.event\.issue\.(?:body|title))/g;

    for (const filename of workflowFiles) {
      for (const { jobId, step } of workflowSteps(loadWorkflow(filename))) {
        if (typeof step.run !== 'string') {
          continue;
        }

        for (const match of step.run.matchAll(untrustedContext)) {
          directInterpolations.push(`${filename}:${jobId}:${step.name}:${match[0]}`);
        }
      }
    }

    expect(directInterpolations).toEqual([]);
  });

  test('does not use unsupported pipe expressions in GitHub contexts', () => {
    const invalidExpressions = [];

    for (const filename of workflowFiles) {
      const source = fs.readFileSync(path.join(workflowDirectory, filename), 'utf8');
      for (const match of source.matchAll(/\$\{\{[^}\n]*(?<!\|)\|(?!\|)[^}\n]*\}\}/g)) {
        invalidExpressions.push(`${filename}:${match[0]}`);
      }
    }

    expect(invalidExpressions).toEqual([]);
  });

  test.each([
    ['.github/ISSUE_TEMPLATE/17-release.md', 'status:needs-planning'],
    ['.github/ISSUE_TEMPLATE/24-content-modelling.md', 'type:content-modelling'],
  ])('%s uses the corrected canonical label %s', (filename, expectedLabel) => {
    const labels = matter(fs.readFileSync(path.join(repoRoot, filename), 'utf8')).data.labels;
    const canonicalLabels = new Set(loadYaml('.github/labels.yml').map(({ name }) => name));

    const templateLabels = Array.isArray(labels)
      ? labels
      : labels.split(',').map((label) => label.trim());

    expect(templateLabels).toContain(expectedLabel);
    expect(canonicalLabels).toContain(expectedLabel);
  });
});

describe('workflow consolidation shell utilities', () => {
  describe('measure-actions-minutes.sh', () => {
    test('rejects an unknown option without creating metrics', () => {
      const directory = createTemporaryDirectory();
      const result = runScript('measure-actions-minutes.sh', ['--unknown'], { cwd: directory });

      expect(result.status).toBe(1);
      expect(result.stdout).toContain('Unknown option: --unknown');
      expect(fs.existsSync(path.join(directory, '.github/metrics'))).toBe(false);
    });

    test('requires a GitHub token', () => {
      const directory = createTemporaryDirectory();
      const result = runScript('measure-actions-minutes.sh', [], { cwd: directory });

      expect(result.status).toBe(1);
      expect(result.stdout).toContain('GITHUB_TOKEN environment variable not set');
    });

    test.each([
      ['json', 'release', 7],
      ['csv', '', 30],
      ['markdown', 'testing', 1],
    ])(
      'writes placeholder metrics for %s output without calling GitHub',
      (format, workflow, days) => {
        const directory = createTemporaryDirectory();
        const args = ['--output', format, '--days', String(days)];
        if (workflow) {
          args.push('--workflow', workflow);
        }

        const result = runScript('measure-actions-minutes.sh', args, {
          cwd: directory,
          env: { GITHUB_TOKEN: 'local-test-token' },
        });
        const metricsDirectory = path.join(directory, '.github/metrics');
        const generatedFiles = fs.readdirSync(metricsDirectory);

        expect(result.status).toBe(0);
        expect(generatedFiles).toHaveLength(1);
        const metrics = JSON.parse(
          fs.readFileSync(path.join(metricsDirectory, generatedFiles[0]), 'utf8')
        );
        expect(metrics).toMatchObject({
          workflow: workflow || 'all',
          period_days: days,
          total_runs: 0,
          total_minutes: 0,
          status: 'placeholder',
        });
      }
    );
  });

  describe('run-error-isolation-test.sh', () => {
    test.each(['--help', '-h'])('shows help for %s without requiring credentials', (flag) => {
      const result = runScript('run-error-isolation-test.sh', [flag], {
        cwd: createTemporaryDirectory(),
      });

      expect(result.status).toBe(0);
      expect(result.stdout).toContain('Error Isolation Test Runner');
      expect(result.stdout).toContain('quality_gates_fails');
    });

    test('rejects an invalid scenario before accessing GitHub', () => {
      const result = runScript('run-error-isolation-test.sh', ['unknown_scenario'], {
        cwd: createTemporaryDirectory(),
      });

      expect(result.status).toBe(1);
      expect(result.stdout).toContain('Invalid scenario: unknown_scenario');
    });

    test('requires a token after validating a supported scenario and workflow fixture', () => {
      const directory = createTemporaryDirectory();
      const fixtureDirectory = path.join(directory, '.github/tests');
      fs.mkdirSync(fixtureDirectory, { recursive: true });
      fs.writeFileSync(path.join(fixtureDirectory, 'error-isolation-test.yml'), 'name: fixture\n');

      const result = runScript('run-error-isolation-test.sh', ['labeling_fails'], {
        cwd: directory,
      });

      expect(result.status).toBe(1);
      expect(result.stdout).toContain('GITHUB_TOKEN environment variable not set');
    });
  });

  describe('test-rollback.sh', () => {
    test.each(['--help', '-h'])('shows help for %s without changing Git state', (flag) => {
      const directory = createTemporaryDirectory();
      const result = runScript('test-rollback.sh', [flag], { cwd: directory });

      expect(result.status).toBe(0);
      expect(result.stdout).toContain('Phase 2 Rollback Procedure Test');
      expect(fs.readdirSync(directory)).toEqual([]);
    });

    test('rejects unknown options', () => {
      const result = runScript('test-rollback.sh', ['--force'], {
        cwd: createTemporaryDirectory(),
      });

      expect(result.status).toBe(1);
      expect(result.stdout).toContain('Unknown option: --force');
    });

    test('dry-run reports the plan and preserves workflow fixtures byte-for-byte', () => {
      const directory = createTemporaryDirectory();
      const archive = path.join(directory, '.github/workflows/archived/2026-09-11');
      const workflows = path.join(directory, '.github/workflows');
      fs.mkdirSync(archive, { recursive: true });
      fs.writeFileSync(path.join(archive, 'legacy.yml'), 'name: Legacy\non: push\njobs: {}\n');
      fs.writeFileSync(
        path.join(workflows, 'testing-unified.yml'),
        'name: Unified\non: push\njobs: {}\n'
      );
      spawnSync('git', ['init', '--quiet'], { cwd: directory });
      const before = fs.readFileSync(path.join(workflows, 'testing-unified.yml'), 'utf8');

      const result = runScript('test-rollback.sh', ['--dry-run'], { cwd: directory });

      expect(result.status).toBe(0);
      expect(result.stdout).toContain('DRY-RUN MODE');
      expect(result.stdout).toContain('Phase 1 archived workflows: 1');
      expect(result.stdout).toContain('Phase 2 unified workflows: 1');
      expect(fs.readFileSync(path.join(workflows, 'testing-unified.yml'), 'utf8')).toBe(before);
      expect(fs.existsSync(path.join(workflows, 'testing-unified.yml.disabled'))).toBe(false);
      expect(fs.existsSync(path.join(workflows, 'legacy.yml'))).toBe(false);
    });
  });
});
