/**
 * Guards the actionlint invocation in scripts/validation/run-actionlint.cjs.
 *
 * The wrapper reads the workflow list from `.github/workflows` instead of keeping
 * a curated copy. A curated list drifted twice: it once named a file that existed
 * only in an uncommitted working tree, which made actionlint fail before linting
 * anything, and it later omitted four live workflows, which went unchecked.
 *
 * The invocation is also single-sourced. It used to be duplicated between
 * package.json's lint:actionlint and the workflow's run step, and the copies
 * drifted. The workflow now delegates to the npm script, the npm script runs the
 * wrapper, and this test fails if a second copy is added.
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const YAML = require('yaml');
const { workflowFiles } = require('../run-actionlint.cjs');

const repositoryRoot = path.resolve(__dirname, '../../..');
const workflowsDir = path.join(repositoryRoot, '.github/workflows');
const workflowLintPath = path.join(workflowsDir, 'workflow-lint.yml');

function localPathViolations(file, document) {
  const outside = [];
  const check = (where, uses, directory) => {
    if (
      typeof uses === 'string' &&
      uses.startsWith('./') &&
      (!uses.startsWith(`./${directory}`) || !path.posix.normalize(uses).startsWith(directory))
    ) {
      outside.push(`${file}: ${where} uses ${uses}, which must be under ./${directory}`);
    }
  };
  let inspected = 0;
  for (const [jobId, job] of Object.entries(document?.jobs || {})) {
    check(`job ${jobId}`, job?.uses, '.github/workflows/');
    for (const [index, step] of (job?.steps || []).entries()) {
      inspected += 1;
      check(`job ${jobId} step ${index}`, step?.uses, '.github/actions/');
    }
  }
  for (const [index, step] of (document?.runs?.steps || []).entries()) {
    inspected += 1;
    check(`composite step ${index}`, step?.uses, '.github/actions/');
  }
  return { outside, inspected };
}

describe('actionlint workflow list', () => {
  it('is every top-level workflow file and nothing else', () => {
    const onDisk = fs
      .readdirSync(workflowsDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.ya?ml$/.test(entry.name))
      .map((entry) => `.github/workflows/${entry.name}`)
      .sort();

    // Guard the reader itself: an empty result means it stopped testing anything.
    expect(onDisk.length).toBeGreaterThan(0);
    expect(workflowFiles().map((file) => file.split(path.sep).join('/'))).toEqual(onDisk);
  });

  it('includes the workflows a curated list had left out', () => {
    const listed = workflowFiles().map((file) => path.basename(file));

    for (const name of [
      'claude-guard-tests.yml',
      'keep-pr-current.yml',
      'label-drift-check.yml',
      'linear-review-platform.yml',
    ]) {
      expect(listed).toContain(name);
    }
  });

  it('keeps local actions and reusable workflows under the directories checked out by actionlint', () => {
    // A local action missing from the sparse checkout loses actionlint's input
    // checks. The scope rule in scripts/workflows/ci-scope.sh also watches local
    // action metadata only under .github/actions. Parsing YAML covers flow-style
    // and anchored references.
    const outside = [];
    let inspected = 0;
    for (const file of workflowFiles()) {
      const document = YAML.parse(fs.readFileSync(path.join(repositoryRoot, file), 'utf8'));
      const result = localPathViolations(file, document);
      inspected += result.inspected;
      outside.push(...result.outside);
    }
    // Guard the walk itself: inspecting nothing would make this pass for any workflow.
    expect(inspected).toBeGreaterThan(0);

    const actionFiles = fs
      .readdirSync(path.join(repositoryRoot, '.github/actions'), { recursive: true })
      .map((entry) => entry.split(path.sep).join('/'))
      .filter((entry) => /(^|\/)action\.ya?ml$/.test(entry));
    expect(actionFiles.length).toBeGreaterThan(0);
    for (const entry of actionFiles) {
      const file = `.github/actions/${entry}`;
      const document = YAML.parse(fs.readFileSync(path.join(repositoryRoot, file), 'utf8'));
      outside.push(...localPathViolations(file, document).outside);
    }
    expect(outside).toEqual([]);
  });

  it('rejects a local step in .github/helpers and accepts a local reusable workflow', () => {
    const document = YAML.parse(`
jobs:
  reusable:
    uses: ./.github/workflows/reusable.yml
  build:
    steps:
      - uses: ./.github/actions/valid
      - uses: ./.github/helpers/invalid
`);
    expect(localPathViolations('fixture.yml', document).outside).toEqual([
      'fixture.yml: job build step 1 uses ./.github/helpers/invalid, which must be under ./.github/actions/',
    ]);
  });

  it('skips subdirectories and non-workflow files', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'actionlint-list-'));
    try {
      fs.mkdirSync(path.join(dir, 'archived'));
      fs.writeFileSync(path.join(dir, 'archived', 'old.yml'), '');
      fs.writeFileSync(path.join(dir, 'b.yml'), '');
      fs.writeFileSync(path.join(dir, 'a.yml'), '');
      // GitHub Actions treats a top-level .yaml file as a workflow too.
      fs.writeFileSync(path.join(dir, 'c.yaml'), '');
      fs.writeFileSync(path.join(dir, 'README.md'), '');

      expect(workflowFiles(dir).map((file) => path.basename(file))).toEqual([
        'a.yml',
        'b.yml',
        'c.yaml',
      ]);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('is invoked from the workflow through the npm script, not a second copy', () => {
    const lintWorkflow = YAML.parse(fs.readFileSync(workflowLintPath, 'utf8'));
    const actionlint = lintWorkflow.jobs.actionlint.steps.find(
      (step) => step.name === 'Run actionlint on active workflows'
    );
    const pkg = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'package.json'), 'utf8'));

    expect(actionlint).toBeDefined();
    expect(actionlint.run).toContain('npm run lint:actionlint');
    expect(actionlint.run).not.toContain('./actionlint');
    expect(actionlint.run).not.toContain('-ignore');
    expect(pkg.scripts['lint:actionlint']).toBe('node scripts/validation/run-actionlint.cjs');
    expect(fs.existsSync(path.join(repositoryRoot, 'scripts/validation/lint-actionlint.sh'))).toBe(
      false
    );
  });
});
