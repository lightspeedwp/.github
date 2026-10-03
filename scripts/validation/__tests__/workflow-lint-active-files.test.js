/**
 * Guards the explicit actionlint file list in
 * scripts/validation/lint-actionlint.sh.
 *
 * A path present in the list but missing on disk makes actionlint exit early
 * with `could not read "<file>"`, so the required `actionlint` status check
 * fails before a single workflow is linted. That happened once already: a
 * workflow that existed only in an uncommitted working tree was added to the
 * list, and the list was committed without the file.
 *
 * The second test keeps the list single-sourced. The invocation used to be
 * duplicated between package.json's lint:actionlint and the workflow's run
 * step, and the two copies drifted. The workflow now delegates to the script,
 * and this test fails if someone inlines a second copy again.
 */

const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const repositoryRoot = path.resolve(__dirname, '../../..');
const actionlintScriptPath = path.join(repositoryRoot, 'scripts/validation/lint-actionlint.sh');
const workflowLintPath = path.join(repositoryRoot, '.github/workflows/workflow-lint.yml');

describe('actionlint file list', () => {
  it('names only workflow files that exist', () => {
    const script = fs.readFileSync(actionlintScriptPath, 'utf8');
    const listed = [...script.matchAll(/\.github\/workflows\/[\w.-]+\.yml/g)].map(
      (match) => match[0]
    );

    // Guard the parser itself: an empty result means the script changed shape
    // and this test stopped testing anything.
    expect(listed.length).toBeGreaterThan(0);

    const missing = listed.filter((file) => !fs.existsSync(path.join(repositoryRoot, file)));

    expect(missing).toEqual([]);
  });

  it('is invoked from the workflow via the shared script, not a second copy', () => {
    const lintWorkflow = YAML.parse(fs.readFileSync(workflowLintPath, 'utf8'));
    const actionlint = lintWorkflow.jobs.actionlint.steps.find(
      (step) => step.name === 'Run actionlint on active workflows'
    );

    expect(actionlint).toBeDefined();
    expect(actionlint.run).toContain('npm run lint:actionlint');
    expect(actionlint.run).not.toContain('./actionlint');
    expect(actionlint.run).not.toContain('-ignore');
  });
});
