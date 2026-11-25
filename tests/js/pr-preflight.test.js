/**
 * Tests for the pull request opening rules shared by CI and the local
 * preflight (scripts/pr-preflight-rules.js, scripts/pr-preflight.js).
 *
 * Every rule here is one a required check enforces, so these tests also pin
 * the contract between the workflow sources and the shared module.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  RESTRICTED_TYPES,
  SKELETON_MARKER,
  bodyFailureMessage,
  checkPrBody,
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

  it('keeps the exempt authors, docs-only rule and failure messages in step with the changelog workflow', () => {
    const source = read('.github/workflows/changelog-unified.yml');
    for (const fragment of [
      'slug(author) === "dependabot"',
      'slug(author) === "renovate"',
      'slug(author) === "lightspeed-docs-bot"',
      'file.startsWith("docs/") || file.endsWith(".md")',
      'changed.includes("CHANGELOG.md")',
      'PR cannot include both meta:needs-changelog and meta:no-changelog.',
      'meta:no-changelog is not allowed for high-impact release-related change types.',
      'PR requires a CHANGELOG.md update or the meta:no-changelog label.',
    ]) {
      expect(source).toContain(fragment);
    }
  });

  it('runs the shared body check from the routing workflow and keeps its author exemptions', () => {
    const source = read('.github/workflows/pr-template-routing.yml');
    expect(source).toContain('scripts/pr-preflight-rules.js');
    expect(source).toContain("'dependabot[bot]'");
    expect(source).toContain("'lightspeed-docs-bot[bot]'");
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
});
