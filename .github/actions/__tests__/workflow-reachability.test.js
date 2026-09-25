const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const repositoryRoot = path.resolve(__dirname, '../../..');
const workflowsDirectory = path.join(repositoryRoot, '.github/workflows');
const actionsDirectory = path.join(repositoryRoot, '.github/actions');

/**
 * GitHub accepts either filename for action metadata; `action.yml` is the
 * preferred form. Both are discovered and both satisfy a reference.
 * https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax
 */
const ACTION_METADATA_FILES = ['action.yml', 'action.yaml'];

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
 * [workflowFile, normalisedReference, type] triples. A reference appears in
 * one of two places: a step's `uses:`, or a job's `uses:` when the job calls a
 * reusable workflow. Both are collected, because a job-level call to a missing
 * workflow is just as broken as a step-level one, and the two forms have
 * different target requirements.
 *
 * `$/` is GitHub's self-repository reference and resolves to the same
 * repository at the running commit, so it is normalised to `./` and checked
 * against the working tree like any other local path. It must not carry an
 * `@ref` suffix.
 * https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
 */
function listLocalReferences() {
  const references = [];

  for (const name of listWorkflows()) {
    const parsed = loadYaml(path.join(workflowsDirectory, name));

    for (const job of Object.values(parsed.jobs || {})) {
      if (typeof job.uses === 'string') {
        references.push([name, normaliseLocalReference(job.uses), 'job']);
      }

      for (const step of job.steps || []) {
        if (typeof step.uses === 'string') {
          references.push([name, normaliseLocalReference(step.uses), 'step']);
        }
      }
    }
  }

  return references.filter(([, reference]) => reference.startsWith('./'));
}

function normaliseLocalReference(reference) {
  return reference.startsWith('$/') ? `./${reference.slice(2)}` : reference;
}

function hasActionMetadata(absoluteDirectory) {
  return ACTION_METADATA_FILES.some((filename) =>
    fs.existsSync(path.join(absoluteDirectory, filename))
  );
}

/**
 * Every action directory under `.github/actions/`, as paths relative to that
 * directory. An action is a directory containing action metadata, so nested
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

    if (hasActionMetadata(absolute)) {
      found.push(relative);
    }

    found.push(...listActionDirectories(absolute, relative));
  }

  return found.sort();
}

/**
 * Why a local `uses:` reference is unusable, or null when it is well-formed and
 * resolvable.
 *
 * The reference type decides what a valid target is, so an arbitrary existing
 * path cannot satisfy a reference:
 *
 * - A `job` `uses:` calls a reusable workflow, which must be a file under
 *   `.github/workflows/`.
 * - A `step` `uses:` calls an action directory, which must contain `action.yml`
 *   or `action.yaml`. Naming the metadata file itself is not a valid form.
 */
function describeUnresolvableReference(reference, type) {
  const target = path.join(repositoryRoot, reference.slice(2));

  if (type === 'job') {
    if (!reference.startsWith('./.github/workflows/')) {
      return 'a job reference must name a reusable workflow under .github/workflows/';
    }

    return fs.existsSync(target) ? null : 'no such workflow file';
  }

  if (!reference.startsWith('./.github/actions/')) {
    return 'a step reference must name an action directory under .github/actions/';
  }

  if (/(^|\/)[^/]+\.ya?ml$/.test(reference)) {
    return 'points at a file; a local action reference must name the action directory';
  }

  return hasActionMetadata(target) ? null : 'no action.yml or action.yaml in that directory';
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

    for (const [workflow, reference, type] of listLocalReferences()) {
      const problem = describeUnresolvableReference(reference, type);

      if (problem) {
        unresolved.push(`${workflow}: ${reference} (${type}: ${problem})`);
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

  test('the composite action contract suite registers a case for every live action', () => {
    const contractTest = fs.readFileSync(
      path.join(__dirname, 'workflow-consolidation-actions.test.js'),
      'utf8'
    );
    // Compare against the names in the executable `test.each([...])` list, so a
    // name appearing only in a comment or another string is not counted as
    // coverage.
    const registered = [...contractTest.matchAll(/test\.each\(\[([^\]]*)\]/g)].flatMap((match) =>
      [...match[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1])
    );

    const uncovered = listActionDirectories().filter((name) => !registered.includes(name));

    expect(uncovered).toEqual([]);
  });
});
