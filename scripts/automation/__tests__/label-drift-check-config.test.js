/**
 * Guards the wiring invariants the label drift check depends on. Each was
 * broken once already, silently, which is why they are asserted here rather
 * than left to a code review to catch:
 *
 * 1. The repository secret is LINEAR_API_KEY (FR-018). An earlier draft of
 *    the sync workflow read secrets.LINEAR_TOKEN, which does not exist, so
 *    the job received an empty value and could never authenticate.
 *
 * 2. The workflow_dispatch dry_run input must actually reach the script as
 *    --dry-run. An earlier draft declared the input and never referenced it,
 *    so "read-only dry run" still wrote the report issue.
 *
 * 3. Every `npm run <script>` step must name a script package.json declares
 *    (the validate-workflow-npm-scripts failure mode).
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const WORKFLOW = '.github/workflows/label-drift-check.yml';

function loadWorkflow() {
  return yaml.load(fs.readFileSync(path.join(REPO_ROOT, WORKFLOW), 'utf8'));
}

function workflowText() {
  return fs.readFileSync(path.join(REPO_ROOT, WORKFLOW), 'utf8');
}

describe('label drift check wiring', () => {
  it('reads the LINEAR_API_KEY secret, never LINEAR_TOKEN', () => {
    expect(workflowText()).toContain('secrets.LINEAR_API_KEY');
    expect(workflowText()).not.toContain('LINEAR_TOKEN');
    const inventory = fs.readFileSync(
      path.join(REPO_ROOT, 'scripts/automation/linear-label-inventory.js'),
      'utf8'
    );
    expect(inventory).toContain('process.env.LINEAR_API_KEY');
    expect(inventory).not.toContain('LINEAR_TOKEN');
  });

  it('runs weekly and offers a dry run that reaches the script', () => {
    const doc = loadWorkflow();
    const crons = doc.on.schedule.map((entry) => entry.cron);
    expect(crons).toContain('0 2 * * 0');
    expect(doc.on.workflow_dispatch.inputs.dry_run).toBeDefined();
    const runStep = Object.values(doc.jobs)
      .flatMap((job) => job.steps)
      .find((step) => typeof step.run === 'string' && step.run.includes('labels:drift-check'));
    expect(runStep).toBeDefined();
    expect(runStep.run).toContain('--dry-run');
  });

  it('serialises runs so overlapping schedules cannot duplicate the issue', () => {
    const doc = loadWorkflow();
    const job = Object.values(doc.jobs)[0];
    expect(job.concurrency.group).toBe('label-drift-check');
    expect(job.concurrency['cancel-in-progress']).toBe(false);
  });

  it('keeps the App token within FR-018 least privilege', () => {
    const doc = loadWorkflow();
    const steps = Object.values(doc.jobs).flatMap((job) => job.steps);
    const tokenStep = steps.find(
      (step) =>
        typeof step.uses === 'string' && step.uses.startsWith('actions/create-github-app-token@')
    );
    expect(tokenStep).toBeDefined();
    const granted = Object.keys(tokenStep.with || {}).filter((key) =>
      key.startsWith('permission-')
    );
    expect(granted.length).toBeGreaterThan(0);
    for (const key of granted) {
      expect(['permission-issues', 'permission-metadata']).toContain(key);
    }
  });

  it('only invokes npm scripts that package.json declares', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
    const doc = loadWorkflow();
    const names = new Set();
    for (const job of Object.values(doc.jobs)) {
      for (const step of job.steps || []) {
        if (typeof step.run !== 'string') continue;
        for (const match of step.run.matchAll(/\bnpm\s+run\s+([\w:.-]+)/g)) {
          names.add(match[1]);
        }
      }
    }
    expect(names.size).toBeGreaterThan(0);
    for (const name of names) {
      expect(Object.prototype.hasOwnProperty.call(pkg.scripts, name)).toBe(true);
    }
  });

  it('pins every third-party action to a commit SHA', () => {
    const doc = loadWorkflow();
    const uses = [];
    for (const job of Object.values(doc.jobs)) {
      for (const step of job.steps || []) {
        if (typeof step.uses === 'string') uses.push(step.uses);
      }
    }
    expect(uses.length).toBeGreaterThan(0);
    for (const ref of uses) {
      expect(ref).toMatch(/@[0-9a-f]{40}( # .+)?$/);
    }
  });
});
