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

/**
 * Every action directory under `.github/actions/`, as paths relative to that
 * directory. An action is a directory containing `action.yml`, so nested
 * actions (`foo/bar/action.yml`) are found too and reported as `foo/bar` — the
 * same shape a `uses:` reference produces.
 */
function listActionDirectories(directory = actionsDirectory, prefix = '') {
  const found = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === '__tests__') {
      continue;
    }

    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = path.join(directory, entry.name);

    if (fs.existsSync(path.join(absolute, 'action.yml'))) {
      found.push(relative);
    }

    found.push(...listActionDirectories(absolute, relative));
  }

  return found.sort();
}

/**
 * Why a local `uses:` reference is unusable, or null when it is well-formed and
 * resolvable. GitHub distinguishes the two kinds of local reference: a
 * `uses:` to `.github/workflows/<file>` calls that workflow file, while a
 * `uses:` to `.github/actions/<dir>` calls the directory's `action.yml`.
 * Pointing an action reference at the `action.yml` file itself is not a valid
 * form, so an existing file is not on its own proof of a valid reference.
 */
function describeUnresolvableReference(reference) {
  const target = path.join(repositoryRoot, reference.slice(2));

  if (reference.startsWith('./.github/actions/')) {
    if (/(^|\/)[^/]+\.ya?ml$/.test(reference)) {
      return 'points at a file; a local action reference must name the action directory';
    }

    return fs.existsSync(path.join(target, 'action.yml'))
      ? null
      : 'no action.yml in that directory';
  }

  return fs.existsSync(target) ? null : 'no such file';
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

  test('every local uses: reference in an active workflow is well-formed and resolves', () => {
    const unresolved = [];

    for (const [workflow, reference] of listLocalReferences()) {
      const problem = describeUnresolvableReference(reference);

      if (problem) {
        unresolved.push(`${workflow}: ${reference} (${problem})`);
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

    const orphans = listActionDirectories().filter((name) => !callers.has(name));

    expect(orphans).toEqual([]);
  });

  test('the composite action contract suite covers every live composite action', () => {
    const contractTest = fs.readFileSync(
      path.join(__dirname, 'workflow-consolidation-actions.test.js'),
      'utf8'
    );

    for (const name of listActionDirectories()) {
      expect(contractTest).toContain(`'${name}'`);
    }
  });
});
