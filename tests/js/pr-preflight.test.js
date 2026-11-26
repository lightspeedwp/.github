/**
 * Tests for the pull request opening rules shared by CI and the local
 * preflight (scripts/pr-preflight-rules.js, scripts/pr-preflight.js).
 *
 * Every rule here is one a required check enforces, so these tests also pin
 * the contract between the workflow sources and the shared module.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import YAML from 'yaml';
import {
  RESTRICTED_TYPES,
  SKELETON_MARKER,
  bodyFailureMessage,
  checkPrBody,
  evaluateChangelogGate,
  isTestFile,
  predictChangelogGate,
  renderSkeleton,
  requiredSections,
} from '../../scripts/pr-preflight-rules.js';

const repoRoot = path.resolve(__dirname, '../..');
const read = (file) => fs.readFileSync(path.join(repoRoot, file), 'utf8');

const template = [
  '# Title',
  '',
  '## Linked issues',
  '<!-- List the issues -->',
  '',
  '## Preview / Screenshots',
  '<!-- Add images -->',
  '',
  '## Notes',
  'Default note text.',
  '',
].join('\n');

const goodBody = [
  '## Linked issues',
  'GIT-2308',
  '',
  '## Preview / Screenshots',
  'N/A: Markdown only.',
  '',
  '## Notes',
  'Adds the task list.',
].join('\n');

describe('requiredSections', () => {
  it('lists every level-2 heading in order', () => {
    expect(requiredSections(template)).toEqual(['Linked issues', 'Preview / Screenshots', 'Notes']);
  });
});

describe('checkPrBody', () => {
  it('passes a body with every section filled in', () => {
    const result = checkPrBody({ template, body: goodBody });
    expect(result.missing).toEqual([]);
    expect(result.empty).toEqual([]);
    expect(bodyFailureMessage({ templateName: 'pr_docs', result })).toBeNull();
  });

  it('reports a missing section, as happened with Preview / Screenshots', () => {
    const body = goodBody.replace('## Preview / Screenshots\nN/A: Markdown only.\n\n', '');
    const result = checkPrBody({ template, body });
    expect(result.missing).toEqual(['Preview / Screenshots']);
    expect(bodyFailureMessage({ templateName: 'pr_docs', result })).toBe(
      'PR body is missing 1 section(s) from pr_docs.md: "## Preview / Screenshots". ' +
        'Copy the template sections into the PR body (see .github/PULL_REQUEST_TEMPLATE/pr_docs.md).'
    );
  });

  it('matches headings case-insensitively', () => {
    const result = checkPrBody({ template, body: goodBody.replace('## Notes', '## NOTES') });
    expect(result.missing).toEqual([]);
  });

  it('reports blank sections and unchanged template text', () => {
    const body = goodBody
      .replace('N/A: Markdown only.', '<!-- nothing -->')
      .replace('Adds the task list.', 'Default note text.');
    const result = checkPrBody({ template, body });
    expect(result.empty).toEqual(['Preview / Screenshots', 'Notes']);
    expect(bodyFailureMessage({ templateName: 'pr_docs', result })).toContain(
      '2 empty or unmodified section(s)'
    );
  });

  it('reports the skeleton marker locally even though the required check accepts it', () => {
    const result = checkPrBody({ template, body: goodBody.replace('GIT-2308', SKELETON_MARKER) });
    expect(result.todo).toEqual(['Linked issues']);
    expect(bodyFailureMessage({ templateName: 'pr_docs', result })).toBeNull();
  });

  it('does not treat the word TODO in real content as unfinished', () => {
    const result = checkPrBody({
      template,
      body: goodBody.replace('Adds the task list.', 'Removes stale TODO comments from the router.'),
    });
    expect(result.todo).toEqual([]);
  });

  it('recognises Jest test files by the repository patterns', () => {
    expect(isTestFile('tests/js/a.test.js')).toBe(true);
    expect(isTestFile('scripts/workflows/__tests__/a.test.mjs')).toBe(true);
    expect(isTestFile('agents/release-agent/__tests__/a.test.cjs')).toBe(true);
    expect(isTestFile('scripts/a.js')).toBe(false);
    expect(isTestFile('tests/fixtures/a.md')).toBe(false);
  });

  it('treats a rendered skeleton as unfinished', () => {
    const result = checkPrBody({ template, body: renderSkeleton(template) });
    expect(result.missing).toEqual([]);
    expect(result.todo).toEqual(['Linked issues', 'Preview / Screenshots', 'Notes']);
  });
});

describe('predictChangelogGate', () => {
  it('passes a docs-only diff', () => {
    const result = predictChangelogGate({
      changed: ['.github/specs/016/tasks.md', 'docs/a.md'],
      labels: ['meta:needs-changelog'],
    });
    expect(result.outcome).toBe('pass');
  });

  it('fails a code diff with neither a changelog entry nor the skip label', () => {
    const result = predictChangelogGate({
      changed: ['scripts/a.js'],
      labels: ['meta:needs-changelog'],
    });
    expect(result).toEqual({
      outcome: 'fail',
      reason: 'PR requires a CHANGELOG.md update or the meta:no-changelog label.',
    });
  });

  it('passes a code diff that includes CHANGELOG.md', () => {
    expect(
      predictChangelogGate({ changed: ['scripts/a.js', 'CHANGELOG.md'], labels: [] }).outcome
    ).toBe('pass');
  });

  it('passes a code diff with meta:no-changelog on a permitted type', () => {
    expect(
      predictChangelogGate({ changed: ['scripts/a.js'], labels: ['meta:no-changelog', 'type:ci'] })
        .outcome
    ).toBe('pass');
  });

  it('refuses meta:no-changelog on a high-impact type', () => {
    expect(
      predictChangelogGate({ changed: ['scripts/a.js'], labels: ['meta:no-changelog', 'type:bug'] })
        .outcome
    ).toBe('fail');
  });

  it('refuses both changelog labels together', () => {
    expect(
      predictChangelogGate({
        changed: ['a.md'],
        labels: ['meta:no-changelog', 'meta:needs-changelog'],
      }).outcome
    ).toBe('fail');
  });

  it('exempts automated authors in either login shape', () => {
    expect(predictChangelogGate({ changed: ['a.js'], author: 'renovate[bot]' }).outcome).toBe(
      'pass'
    );
    expect(predictChangelogGate({ changed: ['a.js'], author: 'app/dependabot' }).outcome).toBe(
      'pass'
    );
  });
});

describe('workflow contract', () => {
  it('keeps the restricted change types in step with the changelog workflow', () => {
    const source = read('.github/workflows/changelog-unified.yml');
    const block = source.match(/restrictedTypes = new Set\(\[([\s\S]*?)\]\)/);
    const types = [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    expect(types).toEqual(RESTRICTED_TYPES);
  });

  it('uses the same failure messages as the changelog workflow', () => {
    const source = read('.github/workflows/changelog-unified.yml');
    const failures = [
      { changed: ['a.js'], labels: ['meta:needs-changelog', 'meta:no-changelog'] },
      { changed: ['a.js'], labels: ['meta:no-changelog', 'type:bug'] },
      { changed: ['a.js'], labels: [] },
    ].map((input) => evaluateChangelogGate(input));
    for (const { outcome, reason } of failures) {
      expect(outcome).toBe('fail');
      expect(source).toContain(reason);
    }
  });

  it('runs the shared body check from the routing workflow and keeps its author exemptions', () => {
    const source = read('.github/workflows/pr-template-routing.yml');
    expect(source).toContain('scripts/pr-preflight-rules.js');
    expect(source).toContain("'dependabot[bot]'");
    expect(source).toContain("'lightspeed-docs-bot[bot]'");
  });
});

describe('changelog gate parity with the workflow', () => {
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const workflow = YAML.parse(read('.github/workflows/changelog-unified.yml'));
  const gateStep = Object.values(workflow.jobs)
    .flatMap((job) => job.steps ?? [])
    .find((step) => step?.id === 'gate');
  // Compile the workflow's script once; each run supplies fresh stubs.
  let compiledGate;
  const gateFunction = () => {
    compiledGate ??= new AsyncFunction('github', 'context', 'core', gateStep.with.script);
    return compiledGate;
  };

  // Runs the workflow's own gate script against stubs, as actions/github-script would.
  async function runWorkflowGate({ changed, totalChanged, labels, author }) {
    const outputs = {};
    let failed = false;
    const core = {
      info() {},
      warning() {},
      setFailed() {
        failed = true;
      },
      setOutput(key, value) {
        outputs[key] = value;
      },
    };
    const context = {
      repo: { owner: 'o', repo: 'r' },
      payload: {
        pull_request: {
          number: 1,
          user: { login: author },
          labels: labels.map((name) => ({ name })),
          changed_files: totalChanged ?? changed.length,
        },
      },
    };
    const github = {
      paginate: async () => changed.map((filename) => ({ filename })),
      rest: { pulls: { listFiles() {} } },
    };
    await gateFunction()(github, context, core);
    if (failed) return 'fail';
    return outputs.run_validation === 'true' ? 'validate' : 'skip';
  }

  it('finds the gate step in the workflow', () => {
    expect(gateStep).toBeDefined();
    expect(gateStep.with.script).toContain('PR requires a CHANGELOG.md update');
  });

  it('gives the same outcome as evaluateChangelogGate for every combination', async () => {
    const authors = [
      'contributor',
      'renovate[bot]',
      'dependabot[bot]',
      'app/dependabot',
      'lightspeed-docs-bot[bot]',
      'app/lightspeed-docs-bot',
    ];
    const labelSets = [
      [],
      ['meta:needs-changelog'],
      ['meta:no-changelog'],
      ...RESTRICTED_TYPES.map((type) => ['meta:no-changelog', type]),
      ['meta:needs-changelog', 'meta:no-changelog'],
      ['type:ci', 'meta:no-changelog'],
    ];
    const changedSets = [
      [],
      ['docs/a.md'],
      ['README.md', 'docs/b.md'],
      ['scripts/a.js'],
      ['scripts/a.js', 'CHANGELOG.md'],
      ['docs/CHANGELOG.md'],
      ['CHANGELOG.md'],
    ];
    const mismatches = [];
    for (const author of authors) {
      for (const labels of labelSets) {
        for (const changed of changedSets) {
          for (const totalChanged of [undefined, changed.length + 5]) {
            const expected = evaluateChangelogGate({
              changed,
              totalChanged,
              labels,
              author,
            }).outcome;
            const actual = await runWorkflowGate({ changed, totalChanged, labels, author });
            if (actual !== expected) {
              mismatches.push({ author, labels, changed, totalChanged, expected, actual });
            }
          }
        }
      }
    }
    expect(mismatches).toEqual([]);
  });
});

describe('scripts/pr-preflight.js', () => {
  const run = (args) =>
    execFileSync('node', ['scripts/pr-preflight.js', ...args], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

  it('prints a skeleton of the routed template for a docs branch', () => {
    const output = run(['--branch', 'docs/example-change', '--skeleton']);
    const routed = read('.github/PULL_REQUEST_TEMPLATE/pr_docs.md');
    for (const heading of requiredSections(routed)) {
      expect(output).toContain(`## ${heading}`);
    }
    expect(output).toContain('TODO');
  });

  it('runs from a subdirectory by resolving the repository root', () => {
    const output = execFileSync(
      'node',
      ['../scripts/pr-preflight.js', '--branch', 'ci/x', '--skeleton'],
      {
        cwd: path.join(repoRoot, 'scripts'),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );
    expect(output).toContain(
      `## ${requiredSections(read('.github/PULL_REQUEST_TEMPLATE/pr_ci.md'))[0]}`
    );
  });

  it('exits non-zero without a branch name', () => {
    expect(() => run([])).toThrow();
  });

  it.each([[[]], [['--skeleton']]])('rejects --body-file without a path (%j)', (flags) => {
    const result = spawnSync(
      'node',
      ['scripts/pr-preflight.js', '--branch', 'docs/example-change', '--body-file', ...flags],
      { cwd: repoRoot, encoding: 'utf8' }
    );
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('--body-file requires a file path.');
  });

  it('predicts the gate from the net working tree changes and the intended PR author', () => {
    const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'pr-preflight-'));
    // Hermetic git: a developer's global or system config (commit or tag
    // signing, hooks, an editor) must not reach the fixture, where a prompt
    // would block with no terminal. Every call also has a timeout.
    const hermeticEnv = {
      ...process.env,
      GIT_CONFIG_GLOBAL: os.devNull,
      GIT_CONFIG_NOSYSTEM: '1',
      GIT_TERMINAL_PROMPT: '0',
    };
    const git = (...args) =>
      execFileSync('git', args, {
        cwd: fixture,
        env: hermeticEnv,
        stdio: 'pipe',
        timeout: 30000,
      });
    const write = (file, content) => fs.writeFileSync(path.join(fixture, file), content);
    const preflight = (...args) =>
      spawnSync(
        'node',
        ['scripts/pr-preflight.js', '--branch', 'docs/example-change', '--base', 'base', ...args],
        { cwd: fixture, encoding: 'utf8', env: hermeticEnv, timeout: 60000 }
      );

    try {
      git('init');
      git('config', 'user.name', 'Preflight test');
      git('config', 'user.email', 'preflight@example.invalid');
      git('config', 'commit.gpgSign', 'false');
      for (const file of [
        'scripts/pr-preflight.js',
        'scripts/pr-preflight-rules.js',
        'scripts/pr-template-router.js',
        '.github/branch-types.yml',
        '.github/branch-labels.yml',
        '.github/PULL_REQUEST_TEMPLATE/pr_docs.md',
      ]) {
        fs.mkdirSync(path.dirname(path.join(fixture, file)), { recursive: true });
        fs.copyFileSync(path.join(repoRoot, file), path.join(fixture, file));
      }
      fs.symlinkSync(
        path.join(repoRoot, 'node_modules'),
        path.join(fixture, 'node_modules'),
        'junction'
      );
      write('.gitignore', 'node_modules\nbody.md\n');
      write('package.json', '{"type":"module"}');
      write('tracked.js', 'base\n');
      git('add', '.');
      git('commit', '-m', 'Base');
      git('tag', 'base');
      write('tracked.js', 'committed change\n');
      git('commit', '-am', 'Change');
      write('tracked.js', 'base\n');
      write('note.md', 'Untracked documentation\n');
      write(
        'body.md',
        requiredSections(read('.github/PULL_REQUEST_TEMPLATE/pr_docs.md'))
          .map((heading) => `## ${heading}\nFilled for this test.\n`)
          .join('\n')
      );

      const restored = preflight('--body-file', 'body.md');
      expect(restored.status).toBe(0);
      expect(restored.stdout).toContain('PR body has every template section with content');
      expect(restored.stdout).toContain('Docs-only diff');

      write('tracked.js', 'pending change\n');
      expect(preflight().stderr).toContain('PR requires a CHANGELOG.md update');
      git('add', 'tracked.js');
      expect(preflight().stderr).toContain('PR requires a CHANGELOG.md update');
      write('tracked.js', 'base\n');
      write('untracked.js', 'new file\n');
      expect(preflight().stderr).toContain('PR requires a CHANGELOG.md update');

      const automated = preflight('--author', 'renovate[bot]');
      expect(automated.status).toBe(0);
      expect(automated.stdout).toContain('Automated author is exempt');
    } finally {
      fs.rmSync(fixture, { recursive: true, force: true });
    }
  });
});
