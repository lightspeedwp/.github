const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const repositoryRoot = path.resolve(__dirname, '../../..');
const workflowsDirectory = path.join(repositoryRoot, '.github/workflows');
const actionsDirectory = path.join(repositoryRoot, '.github/actions');

/**
 * Directories under `.github/` whose YAML is a copy-source template rather
 * than a workflow GitHub executes. `.github/examples/` feeds `gh workflow
 * new`, so a workflow file there is intentional and exempt from the
 * executable-workflow-location guard.
 *
 * The scan is deliberately limited to `.github/`. That is where a misplaced
 * workflow is always a mistake, and it keeps the guard clear of unrelated
 * repository data such as `skills/**\/references/*.yaml`, which is not
 * workflow-shaped and is not valid workflow YAML.
 */
const TEMPLATE_LOCATIONS = ['.github/examples/'];

function listFiles(directory, extensions, collected = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }

    const absolute = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      listFiles(absolute, extensions, collected);
    } else if (extensions.some((extension) => entry.name.endsWith(extension))) {
      collected.push(absolute);
    }
  }

  return collected;
}

function isTemplateFile(absolutePath) {
  const relativePath = path.relative(repositoryRoot, absolutePath).split(path.sep).join('/');

  return TEMPLATE_LOCATIONS.some((location) => relativePath.startsWith(location));
}

function listWorkflows() {
  return fs
    .readdirSync(workflowsDirectory)
    .filter((name) => name.endsWith('.yml') || name.endsWith('.yaml'))
    .sort();
}

function loadYaml(absolutePath) {
  return YAML.parse(fs.readFileSync(absolutePath, 'utf8'));
}

/**
 * Every repository-local `uses:` in the active workflows, as
 * [workflowFile, reference] pairs. A reference appears in one of two places:
 * a step's `uses:`, or a job's `uses:` when the job calls a reusable
 * workflow. Both are collected, because a job-level call to a missing
 * workflow is just as broken as a step-level one.
 */
function listLocalReferences() {
  const references = [];

  for (const name of listWorkflows()) {
    const parsed = loadYaml(path.join(workflowsDirectory, name));

    for (const job of Object.values(parsed.jobs || {})) {
      if (typeof job.uses === 'string') {
        references.push([name, job.uses]);
      }

      for (const step of job.steps || []) {
        if (typeof step.uses === 'string') {
          references.push([name, step.uses]);
        }
      }
    }
  }

  return references.filter(([, reference]) => reference.startsWith('./'));
}

// GitHub Actions only registers workflows in .github/workflows/, so a
// workflow-shaped file anywhere else can never run. These guards keep that
// from recurring silently, which is how the harness in .github/tests/
// survived while its contract tests passed.
describe('workflow reachability', () => {
  const governanceYaml = listFiles(path.join(repositoryRoot, '.github'), ['.yml', '.yaml']);

  test('every workflow-shaped YAML file is in .github/workflows/ or a template', () => {
    const misplaced = governanceYaml
      .filter((absolutePath) => !absolutePath.startsWith(workflowsDirectory + path.sep))
      .filter((absolutePath) => !isTemplateFile(absolutePath))
      .filter((absolutePath) => {
        const parsed = loadYaml(absolutePath);

        return parsed && typeof parsed === 'object' && Object.hasOwn(parsed, 'on');
      })
      .map((absolutePath) => path.relative(repositoryRoot, absolutePath));

    expect(misplaced).toEqual([]);
  });

  test('every local uses: reference in an active workflow resolves on disk', () => {
    const unresolved = [];

    for (const [workflow, reference] of listLocalReferences()) {
      const target = path.join(repositoryRoot, reference.slice(2));
      // A `uses:` to a workflow calls the file; a `uses:` to a composite
      // action calls its action.yml.
      const resolves = fs.existsSync(target) || fs.existsSync(path.join(target, 'action.yml'));

      if (!resolves) {
        unresolved.push(`${workflow}: ${reference}`);
      }
    }

    expect(unresolved).toEqual([]);
  });

  test('every composite action is called by at least one active workflow', () => {
    const callers = new Set(
      [...listLocalReferences()]
        .filter(([, reference]) => reference.startsWith('./.github/actions/'))
        .map(([, reference]) => reference.slice('./.github/actions/'.length))
    );

    const orphans = fs
      .readdirSync(actionsDirectory, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name !== '__tests__')
      .map((entry) => entry.name)
      .filter((name) => !callers.has(name))
      .sort();

    expect(orphans).toEqual([]);
  });

  test('the composite action contract suite covers every live composite action', () => {
    const contractTest = fs.readFileSync(
      path.join(__dirname, 'workflow-consolidation-actions.test.js'),
      'utf8'
    );

    for (const entry of fs.readdirSync(actionsDirectory, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name !== '__tests__') {
        expect(contractTest).toContain(`'${entry.name}'`);
      }
    }
  });
});
