const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repositoryRoot = path.resolve(__dirname, '../../..');
const gitattributesPath = path.join(repositoryRoot, '.gitattributes');

const temporaryDirectories = [];

afterAll(() => {
  temporaryDirectories.forEach((directory) => {
    fs.rmSync(directory, { force: true, recursive: true });
  });
});

function git(cwd, args) {
  return spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'merge-strategy-test',
      GIT_AUTHOR_EMAIL: 'test@example.invalid',
      GIT_COMMITTER_NAME: 'merge-strategy-test',
      GIT_COMMITTER_EMAIL: 'test@example.invalid',
    },
  });
}

function addUnreleasedEntry(directory, label) {
  const file = path.join(directory, 'CHANGELOG.md');
  const contents = fs.readFileSync(file, 'utf8');

  fs.writeFileSync(
    file,
    contents.replace(
      '## [Unreleased]\n',
      `## [Unreleased]\n\n- **${label}** — a distinct entry added by this test. (#9001)\n`
    )
  );
}

/**
 * A self-contained repository with the same union attribute the real one
 * declares, so the merge is exercised through git rather than asserted on
 * the text of .gitattributes. Pass `union: false` to reproduce the state
 * before the attribute existed, which is what makes the pair of tests prove
 * the attribute is the cause rather than merely present.
 */
function buildFixtureRepository({ union = true } = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'changelog-merge-'));

  temporaryDirectories.push(directory);

  expect(git(directory, ['init', '--quiet', '--initial-branch=main']).status).toBe(0);
  fs.writeFileSync(path.join(directory, 'CHANGELOG.md'), '## [Unreleased]\n\n### Added\n');

  const attributes = fs
    .readFileSync(gitattributesPath, 'utf8')
    .split('\n')
    .filter((line) => !/^CHANGELOG\.md\s+merge=union$/.test(line))
    .join('\n');

  fs.writeFileSync(
    path.join(directory, '.gitattributes'),
    union ? fs.readFileSync(gitattributesPath, 'utf8') : attributes
  );
  expect(git(directory, ['add', '.']).status).toBe(0);
  expect(git(directory, ['commit', '--quiet', '-m', 'base']).status).toBe(0);

  const base = git(directory, ['rev-parse', 'HEAD']).stdout.trim();

  addUnreleasedEntry(directory, 'Entry contributed by the first branch');
  expect(git(directory, ['commit', '--quiet', '-am', 'first branch']).status).toBe(0);
  const first = git(directory, ['rev-parse', 'HEAD']).stdout.trim();

  git(directory, ['checkout', '--quiet', base]);
  addUnreleasedEntry(directory, 'Entry contributed by the second branch');
  expect(git(directory, ['commit', '--quiet', '-am', 'second branch']).status).toBe(0);
  const second = git(directory, ['rev-parse', 'HEAD']).stdout.trim();

  return { directory, first, second };
}

describe('changelog merge strategy (#3574)', () => {
  test('CHANGELOG.md is declared as union-merged', () => {
    const attributes = fs.readFileSync(gitattributesPath, 'utf8');

    expect(attributes).toMatch(/^CHANGELOG\.md\s+merge=union$/m);
  });

  test('git resolves that attribute for the changelog in this repository', () => {
    const result = git(repositoryRoot, ['check-attr', 'merge', '--', 'CHANGELOG.md']);

    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/^CHANGELOG\.md:\s+merge:\s+union$/m);
  });

  // The regression this guards: two open pull requests each add an entry to
  // the same `[Unreleased]` list, which a plain merge turns into a conflict.
  // The pull request that lands second is then stuck behind develop until
  // someone merges it in by hand, and Mergify's `update` action reports a
  // permanent red check because it cannot resolve a conflict.
  test('two branches adding different entries merge without conflict and keep both', () => {
    const { directory, first, second } = buildFixtureRepository();
    const merge = git(directory, ['merge', '--no-edit', first]);

    expect(merge.stdout + merge.stderr).not.toMatch(/CONFLICT/);

    const merged = fs.readFileSync(path.join(directory, 'CHANGELOG.md'), 'utf8');

    expect(merged).toContain('Entry contributed by the first branch');
    expect(merged).toContain('Entry contributed by the second branch');
    expect(merged).not.toMatch(/^<{7}/m);
    expect(git(directory, ['rev-parse', '--verify', '--quiet', 'MERGE_HEAD']).status).not.toBe(0);
    expect(git(directory, ['rev-parse', 'HEAD^']).stdout.trim()).toBe(second);
  });

  // The baseline this fixes. Without the attribute, the same two branches
  // conflict — so the passing test above demonstrates the attribute is the
  // cause of the difference, not an incidental property of the fixture.
  test('the same two branches conflict once the attribute is removed', () => {
    const { directory, first } = buildFixtureRepository({ union: false });
    const merge = git(directory, ['merge', '--no-edit', first]);

    expect(merge.stdout + merge.stderr).toMatch(/CONFLICT/);
    expect(fs.readFileSync(path.join(directory, 'CHANGELOG.md'), 'utf8')).toMatch(/^<{7}/m);
  });

  // A genuine duplicate still has to be caught somewhere, because union can
  // combine two identical entries. It is caught by the changelog validator's
  // CHK_UNIQUE_CONTENT rule, which flags entries more than 90% similar. That
  // guarantee is proved behaviourally, against the rule implementation, in
  // `changelog-unique-content.test.js` — an earlier version of this file only
  // asserted the rule was declared, which proved nothing about its behaviour.
});
