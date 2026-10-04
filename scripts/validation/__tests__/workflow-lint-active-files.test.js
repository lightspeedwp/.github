/**
 * Guards the explicit actionlint file list in workflow-lint.yml.
 *
 * The list names every active workflow. A path present in the list but
 * missing on disk makes actionlint exit early with `could not read "<file>"`,
 * so the required `actionlint` status check fails before a single workflow is
 * linted. That happened once already: a workflow that existed only in an
 * uncommitted working tree was added to the list, and the list was committed
 * without the file. Asserting existence here surfaces the mistake as a test
 * failure during review instead of as a red required check on GitHub.
 */

const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const repositoryRoot = path.resolve(__dirname, '../../..');
const workflowLintPath = path.join(repositoryRoot, '.github/workflows/workflow-lint.yml');

describe('workflow-lint actionlint file list', () => {
  it('names only workflow files that exist', () => {
    const lintWorkflow = YAML.parse(fs.readFileSync(workflowLintPath, 'utf8'));
    const actionlint = lintWorkflow.jobs.actionlint.steps.find(
      (step) => step.name === 'Run actionlint on active workflows'
    );

    expect(actionlint).toBeDefined();

    const listed = [...actionlint.run.matchAll(/\.github\/workflows\/[\w.-]+\.yml/g)].map(
      (match) => match[0]
    );

    // Guard the parser itself: an empty result means the step changed shape
    // and this test stopped testing anything.
    expect(listed.length).toBeGreaterThan(0);

    const missing = listed.filter((file) => !fs.existsSync(path.join(repositoryRoot, file)));

    expect(missing).toEqual([]);
  });
});
