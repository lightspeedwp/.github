/**
 * Unit tests for label-drift-check.js (spec 008, task T072; FR-017, FR-018).
 *
 * Pure diff/render logic is tested directly; GitHub writes are tested
 * against a mock client. No network access, no repository writes.
 * @module scripts/automation/__tests__/label-drift-check.test.js
 */

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';
import { describe, it, expect } from '@jest/globals';
import {
  DRIFT_ISSUE_TITLE,
  DRIFT_ISSUE_LABELS,
  MAX_COUNTED_ROWS,
  MAX_FIRST_SEEN_BYTES,
  normaliseColor,
  escapeCell,
  splitCells,
  diffGithubRepo,
  diffLinearLabels,
  countGithubItems,
  enrichAllGithubRows,
  enrichGithubRows,
  parseFirstSeen,
  parseFirstSeenBlock,
  parseFirstSeenTables,
  buildFirstSeenBlock,
  renderReport,
  upsertDriftIssue,
  PRIVATE_DRIFT_ISSUE_TITLE,
  summarisePrivate,
  renderPrivateSummary,
  renderPrivateReport,
  maskCommands,
  assertPrivateRepository,
  resolvePrivateSink,
  writeRedactedInventory,
  DEFAULT_INVENTORY_OUTPUT,
} from '../label-drift-check.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptSource = fs.readFileSync(path.join(__dirname, '../label-drift-check.js'), 'utf8');

const canonical = new Map([
  ['status:done', { color: '0E8A16', description: 'Finished' }],
  ['type:task', { color: 'FBCA04', description: 'Work item' }],
]);

describe('label-drift-check', () => {
  it('loads the real approved label set from labels.yml under plain Node', () => {
    // Jest's module interop hides import-shape bugs (js-yaml 5 has no default
    // export), so exercise the loader the way the workflow runs it.
    const labelsPath = path.join(__dirname, '../../../.github/labels.yml');
    const scriptPath = path.join(__dirname, '../label-drift-check.js');
    const out = execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import { loadCanonicalLabels } from ${JSON.stringify(pathToFileURL(scriptPath).href)};
         const m = await loadCanonicalLabels(${JSON.stringify(labelsPath)});
         console.log(JSON.stringify({ size: m.size, audit: m.has('type:audit') }));`,
      ],
      { encoding: 'utf8' }
    );
    const result = JSON.parse(out.trim().split('\n').pop());
    expect(result.size).toBeGreaterThan(50);
    expect(result.audit).toBe(true);
  });

  it('never calls a label-mutating GitHub endpoint', () => {
    for (const call of [
      'createLabel',
      'updateLabel',
      'deleteLabel',
      'setLabels',
      'addLabels',
      'removeLabel',
      'removeAllLabels',
    ]) {
      expect(scriptSource).not.toContain(call);
    }
    expect(scriptSource).toContain('rest.issues.create');
    expect(scriptSource).toContain('rest.issues.update');
  });

  it('normalises colours the same way on both sides', () => {
    expect(normaliseColor('#0e8a16')).toBe('0E8A16');
    expect(normaliseColor('0E8A16')).toBe('0E8A16');
    expect(normaliseColor(null)).toBe('');
  });

  it('flags unapproved, mismatched and missing GitHub labels', () => {
    const rows = diffGithubRepo(
      {
        repository: 'o/r',
        labels: [
          { name: 'status:done', color: '0e8a16', description: 'Finished' },
          { name: 'stray:label', color: 'ffffff', description: '' },
          { name: 'type:task', color: '000000', description: 'Work item' },
          { name: 'type:task-x', color: 'FBCA04', description: 'other' },
        ],
      },
      new Map([
        ['status:done', { color: '0E8A16', description: 'Finished' }],
        ['type:task', { color: 'FBCA04', description: 'Work item' }],
        ['type:task-x', { color: 'FBCA04', description: 'Work item' }],
      ])
    );
    expect(rows).toEqual([
      { location: 'o/r', label: 'stray:label', difference: 'unapproved' },
      { location: 'o/r', label: 'type:task', difference: 'colour mismatch' },
      { location: 'o/r', label: 'type:task-x', difference: 'description mismatch' },
    ]);
  });

  it('reports canonical labels missing from the repository', () => {
    const rows = diffGithubRepo({ repository: 'o/r', labels: [] }, canonical);
    expect(rows).toEqual([
      { location: 'o/r', label: 'status:done', difference: 'missing' },
      { location: 'o/r', label: 'type:task', difference: 'missing' },
    ]);
  });

  it('skips archived Linear labels and lists documented team labels as allowed', () => {
    const { rows, allowed } = diffLinearLabels(
      [
        {
          name: 'status:done',
          scope: 'workspace',
          color: '#0E8A16',
          description: 'Finished',
          retired_at: null,
          issue_count: 3,
        },
        {
          name: 'area:flow',
          scope: 'FLO',
          color: '#ededed',
          description: '',
          retired_at: null,
          issue_count: 9,
        },
        {
          name: 'old:label',
          scope: 'workspace',
          color: '#fff',
          description: '',
          retired_at: '2026-01-01T00:00:00Z',
          issue_count: 2,
        },
        {
          name: 'stray',
          scope: 'LS',
          color: '#fff',
          description: '',
          retired_at: null,
          issue_count: 0,
        },
      ],
      canonical
    );
    expect(rows).toEqual([
      { location: 'Linear (LS)', label: 'stray', difference: 'unapproved', items: 0 },
      { location: 'Linear (workspace)', label: 'type:task', difference: 'missing', items: '' },
    ]);
    expect(allowed.map((l) => l.name)).toEqual(['area:flow']);
    // Archived labels are neither drift nor allowed.
    expect(rows.some((r) => r.label === 'old:label')).toBe(false);
  });

  it('keeps first-seen dates for continuing drift', () => {
    const body = [
      '| Location | Label | Difference | First seen | Items |',
      '| --- | --- | --- | --- | --- |',
      '| o/r | stray:label | unapproved | 2026-09-01 | 4 |',
    ].join('\n');
    const seen = parseFirstSeen(body);
    expect(seen.get('o/r stray:label unapproved')).toBeUndefined();
    expect(seen.get('o/r\0stray:label\0unapproved')).toBe('2026-09-01');
  });

  it('renders No drift with the contract sections', () => {
    const body = renderReport({
      generatedAt: '2026-10-02T00:00:00.000Z',
      canonicalCommit: 'abc123',
      githubRows: [],
      linearRows: [],
      allowed: [],
      skippedRepos: [],
      org: 'lightspeedwp',
      firstSeen: new Map(),
    });
    for (const section of [
      '## Summary',
      '## GitHub repositories',
      '## Linear',
      '## Allowed exceptions',
      '## Run details',
    ]) {
      expect(body).toContain(section);
    }
    expect(body).toContain('No drift.');
  });

  it('truncates long tables but keeps every row in the JSON report', () => {
    const rows = Array.from({ length: 250 }, (_, i) => ({
      location: 'o/r',
      label: `label-${String(i).padStart(3, '0')}`,
      difference: 'unapproved',
      items: 0,
    }));
    const body = renderReport({
      generatedAt: '2026-10-02T00:00:00.000Z',
      canonicalCommit: 'abc123',
      githubRows: rows,
      linearRows: [],
      allowed: [],
      skippedRepos: [],
      org: 'lightspeedwp',
      firstSeen: new Map(),
      maxTableRows: 200,
    });
    expect(body).toContain('Showing 200 of 250; see the run artifact for all rows.');
    expect(body).toContain('| o/r | label-199 | unapproved |');
    expect(body).not.toContain('| o/r | label-200 | unapproved |');
  });

  it('never lets a team duplicate mask a missing workspace label (FR-023 point 7)', () => {
    const { rows, allowed } = diffLinearLabels(
      [
        {
          name: 'type:task',
          scope: 'LS',
          color: '#FBCA04',
          description: 'Work item',
          retired_at: null,
          issue_count: 5,
        },
      ],
      canonical
    );
    // The team entry is its own unapproved row; the workspace entry is missing.
    expect(rows).toEqual([
      { location: 'Linear (LS)', label: 'type:task', difference: 'unapproved', items: 5 },
      { location: 'Linear (workspace)', label: 'status:done', difference: 'missing', items: '' },
      { location: 'Linear (workspace)', label: 'type:task', difference: 'missing', items: '' },
    ]);
    expect(allowed).toEqual([]);
  });

  it('round-trips label names containing pipes through render and parse', () => {
    expect(escapeCell('a|b')).toBe('a\\|b');
    expect(splitCells('| o/r | a\\|b | unapproved | 2026-09-01 | 4 |')).toEqual([
      '',
      'o/r',
      'a|b',
      'unapproved',
      '2026-09-01',
      '4',
      '',
    ]);
    const body = renderReport({
      generatedAt: '2026-10-02T00:00:00.000Z',
      canonicalCommit: 'abc123',
      githubRows: [{ location: 'o/r', label: 'a|b', difference: 'unapproved', items: 4 }],
      linearRows: [],
      allowed: [],
      skippedRepos: [],
      org: 'lightspeedwp',
      firstSeen: new Map(),
    });
    expect(body).toContain('| o/r | a\\|b | unapproved |');
    expect(parseFirstSeen(body).get('o/r\0a|b\0unapproved')).toBe('2026-10-02');
  });

  it('caps GitHub count enrichment and discloses the remainder', async () => {
    const client = {
      rest: {
        search: {
          issuesAndPullRequests: async () => ({ data: { total_count: 3 } }),
        },
      },
    };
    const rows = [
      { location: 'o/r', label: 'b', difference: 'unapproved' },
      { location: 'o/r', label: 'a', difference: 'unapproved' },
      { location: 'o/r', label: 'gone', difference: 'missing' },
    ];
    const { counted, uncounted } = await enrichGithubRows(client, rows, {
      maxRows: 1,
      paceMs: 0,
    });
    expect(counted).toBe(1);
    expect(uncounted).toBe(1);
    expect(MAX_COUNTED_ROWS).toBeGreaterThan(0);
    // Deterministic order: 'a' is counted, 'b' is capped, 'gone' needs none.
    expect(rows.find((r) => r.label === 'a').items).toBe(3);
    expect(rows.find((r) => r.label === 'b').items).toBe('');
    expect(rows.find((r) => r.label === 'gone').items).toBe('');
    expect(await countGithubItems(client, 'o/r', 'a')).toBe(3);
  });

  describe('one search budget for the public and private passes', () => {
    const makeClient = () => {
      const queries = [];
      return {
        queries,
        rest: {
          search: {
            issuesAndPullRequests: async ({ q }) => {
              queries.push(q);
              return { data: { total_count: 1 } };
            },
          },
        },
      };
    };
    const rowsFor = (repo, count) =>
      Array.from({ length: count }, (_, i) => ({
        location: repo,
        label: `label-${i}`,
        difference: 'unapproved',
      }));

    it('gives the private pass only what the public pass left unused', async () => {
      const client = makeClient();
      const publicRows = rowsFor('o/public', 3);
      const privateRows = rowsFor('o/private', 5);
      const result = await enrichAllGithubRows(client, publicRows, privateRows, {
        includePrivate: true,
        maxRows: 5,
        paceMs: 0,
      });
      expect(result).toEqual({ counted: 3, uncounted: 0, privateCounted: 2 });
      expect(client.queries).toHaveLength(5);
      expect(privateRows.filter((row) => row.items === 1)).toHaveLength(2);
      expect(privateRows.filter((row) => row.items === '')).toHaveLength(3);
    });

    it('never exceeds the shared cap across both passes', async () => {
      const client = makeClient();
      await enrichAllGithubRows(client, rowsFor('o/public', 4), rowsFor('o/private', 4), {
        includePrivate: true,
        maxRows: 6,
        paceMs: 0,
      });
      expect(client.queries).toHaveLength(6);
    });

    it('makes no private search when the public pass used the whole budget', async () => {
      const client = makeClient();
      const privateRows = rowsFor('o/private', 3);
      const result = await enrichAllGithubRows(client, rowsFor('o/public', 4), privateRows, {
        includePrivate: true,
        maxRows: 4,
        paceMs: 0,
      });
      expect(result.privateCounted).toBe(0);
      expect(client.queries.some((q) => q.includes('o/private'))).toBe(false);
      expect(privateRows.every((row) => row.items === '')).toBe(true);
    });

    it('skips the private pass entirely when it is not included, as in a dry run', async () => {
      const client = makeClient();
      const privateRows = rowsFor('o/private', 3);
      const result = await enrichAllGithubRows(client, rowsFor('o/public', 2), privateRows, {
        includePrivate: false,
        maxRows: 10,
        paceMs: 0,
      });
      expect(result).toEqual({ counted: 2, uncounted: 0, privateCounted: 0 });
      expect(client.queries.every((q) => q.includes('o/public'))).toBe(true);
      expect(privateRows.every((row) => row.items === undefined)).toBe(true);
    });

    it('does not spend budget on missing rows', async () => {
      const client = makeClient();
      const publicRows = [
        ...rowsFor('o/public', 1),
        { location: 'o/public', label: 'gone', difference: 'missing' },
      ];
      const result = await enrichAllGithubRows(client, publicRows, rowsFor('o/private', 2), {
        includePrivate: true,
        maxRows: 2,
        paceMs: 0,
      });
      expect(result.counted).toBe(1);
      expect(result.privateCounted).toBe(1);
    });
  });

  it('persists first-seen dates for rows omitted from the tables', () => {
    const rows = Array.from({ length: 5 }, (_, i) => ({
      location: 'o/r',
      label: `label-${i}`,
      difference: 'unapproved',
      items: i,
    }));
    const seen = new Map([[`o/r\0label-4\0unapproved`, '2026-09-01']]);
    const body = renderReport({
      generatedAt: '2026-10-02T00:00:00.000Z',
      canonicalCommit: 'abc123',
      githubRows: rows,
      linearRows: [],
      allowed: [],
      skippedRepos: [],
      org: 'lightspeedwp',
      firstSeen: seen,
      maxTableRows: 2,
    });
    // label-4 is past the table cap, but its date survives via the block.
    expect(body).not.toContain('| o/r | label-4 | unapproved |');
    expect(parseFirstSeen(body).get('o/r\0label-4\0unapproved')).toBe('2026-09-01');
    expect(parseFirstSeenTables(body).get('o/r\0label-4\0unapproved')).toBeUndefined();
  });

  it('caps the persisted map within budget and degrades gracefully', () => {
    const rows = Array.from({ length: 10 }, (_, i) => ({
      location: 'o/r',
      label: `label-${i}`,
      difference: 'unapproved',
      firstSeen: '2026-09-01',
      items: 0,
    }));
    const tiny = buildFirstSeenBlock(rows, 100);
    expect(tiny.json).not.toBeNull();
    expect(tiny.kept).toBeGreaterThan(0);
    expect(tiny.kept).toBeLessThan(rows.length);
    expect(MAX_FIRST_SEEN_BYTES).toBeGreaterThan(1000);
    // Nothing persists when even one entry exceeds the budget.
    expect(buildFirstSeenBlock(rows, 10).json).toBeNull();
  });

  it('falls back to tables on a missing or malformed block', () => {
    const tableBody = [
      '| Location | Label | Difference | First seen | Items |',
      '| --- | --- | --- | --- | --- |',
      '| o/r | stray | unapproved | 2026-09-01 | 4 |',
    ].join('\n');
    expect(parseFirstSeenBlock(tableBody)).toBeNull();
    expect(parseFirstSeenBlock('<!-- drift-first-seen\n{invalid\n-->')).toBeNull();
    expect(parseFirstSeenBlock('<!-- drift-first-seen\n[1,2]\n-->')).toBeNull();
    expect(parseFirstSeen(tableBody).get('o/r\0stray\0unapproved')).toBe('2026-09-01');
  });

  it('creates the issue once, then updates it in place', async () => {
    const readCalls = [];
    const writeCalls = [];
    const readClient = {
      rest: {
        search: {
          issuesAndPullRequests: async (params) => {
            readCalls.push(params);
            return { data: { items: [], total_count: 0 } };
          },
        },
        issues: {
          create: async () => {
            throw new Error('read client must never write');
          },
          update: async () => {
            throw new Error('read client must never write');
          },
        },
      },
    };
    const writeClient = {
      rest: {
        issues: {
          create: async (params) => {
            writeCalls.push(['create', params]);
            return { data: { number: 7 } };
          },
          update: async (params) => {
            writeCalls.push(['update', params]);
            return { data: { number: 7 } };
          },
        },
      },
    };
    const created = await upsertDriftIssue(readClient, writeClient, 'o', 'r', 'body one');
    expect(created).toEqual({ issue: { number: 7 }, created: true });
    expect(writeCalls[0][1].title).toBe(DRIFT_ISSUE_TITLE);
    expect(writeCalls[0][1].labels).toEqual(DRIFT_ISSUE_LABELS);
    expect(readCalls).toHaveLength(1);

    readClient.rest.search.issuesAndPullRequests = async () => ({
      data: { items: [{ title: DRIFT_ISSUE_TITLE, number: 7, body: 'body one' }], total_count: 1 },
    });
    const updated = await upsertDriftIssue(readClient, writeClient, 'o', 'r', 'body two');
    expect(updated.created).toBe(false);
    expect(writeCalls[1]).toEqual([
      'update',
      { owner: 'o', repo: 'r', issue_number: 7, body: 'body two' },
    ]);
  });

  // This repository is public, so a private repository is counted and never
  // named, in the issue, the artifact or the log (decision of 2026-10-04).
  describe('private repositories', () => {
    const privateRepos = [
      { repository: 'lightspeedwp/acme-client-site', private: true, labels: [] },
      { repository: 'lightspeedwp/other-client-site', private: true, labels: [] },
    ];
    const privateRows = [
      { location: 'lightspeedwp/acme-client-site', label: 'acme-launch', difference: 'unapproved' },
      {
        location: 'lightspeedwp/acme-client-site',
        label: 'type:bug',
        difference: 'colour mismatch',
      },
      { location: 'lightspeedwp/other-client-site', label: 'area:core', difference: 'missing' },
    ];

    it('counts private drift without naming a repository or a label', () => {
      const summary = summarisePrivate(privateRepos, privateRows);
      expect(summary).toEqual({
        checked: 2,
        withDifferences: 2,
        differences: 3,
        byKind: { unapproved: 1, 'colour mismatch': 1, missing: 1 },
      });
      const text = renderPrivateSummary(summary);
      for (const leaked of ['acme', 'other-client', 'acme-launch', 'area:core']) {
        expect(text).not.toContain(leaked);
      }
      expect(text).toContain('2 private repositories were checked');
      expect(text).toContain('3 difference(s)');
    });

    it('says so plainly when no private repository has drift', () => {
      expect(renderPrivateSummary(summarisePrivate(privateRepos, []))).toContain(
        'None of them has drift.'
      );
    });

    it('puts the summary in the public report and counts it in the total', () => {
      const body = renderReport({
        generatedAt: '2026-10-04T00:00:00.000Z',
        canonicalCommit: 'abc123',
        githubRows: [],
        linearRows: [],
        allowed: [],
        skippedRepos: [],
        org: 'lightspeedwp',
        firstSeen: new Map(),
        privateSummary: summarisePrivate(privateRepos, privateRows),
      });
      expect(body).toContain('## Private repositories');
      expect(body).toContain('3 difference(s) across GitHub and Linear.');
      expect(body).toContain('Private repository differences (names withheld): 3');
      for (const leaked of ['acme-client-site', 'other-client-site', 'acme-launch']) {
        expect(body).not.toContain(leaked);
      }
    });

    it('writes the detail only into the private report', () => {
      const body = renderPrivateReport({
        generatedAt: '2026-10-04T00:00:00.000Z',
        canonicalCommit: 'abc123',
        rows: privateRows,
        org: 'lightspeedwp',
      });
      expect(body).toContain('lightspeedwp/acme-client-site');
      expect(body).toContain('3 difference(s)');
    });

    it('registers every private name as a log mask inside GitHub Actions only', () => {
      const inventory = {
        repositories: [{ repository: 'lightspeedwp/public-tool', private: false }, ...privateRepos],
      };
      expect(maskCommands(inventory, { GITHUB_ACTIONS: 'true' })).toEqual([
        '::add-mask::lightspeedwp/acme-client-site',
        '::add-mask::acme-client-site',
        '::add-mask::lightspeedwp/other-client-site',
        '::add-mask::other-client-site',
      ]);
      expect(maskCommands(inventory, {})).toEqual([]);
    });

    it('refuses to write the private report to a repository that is not private', async () => {
      const publicClient = { rest: { repos: { get: async () => ({ data: { private: false } }) } } };
      await expect(assertPrivateRepository(publicClient, 'o', 'r')).rejects.toThrow(
        /not a private repository/
      );
      const privateClient = { rest: { repos: { get: async () => ({ data: { private: true } }) } } };
      await expect(assertPrivateRepository(privateClient, 'o', 'r')).resolves.toBeUndefined();
    });

    it('has no private sink unless one is configured, and needs its token and a valid name', async () => {
      await expect(resolvePrivateSink({})).resolves.toBeNull();
      await expect(resolvePrivateSink({ PRIVATE_REPORT_REPO: 'bad' })).rejects.toThrow(
        /owner\/repository/
      );
      // Extra segments would be dropped silently, and the privacy check would run
      // against a different repository than the one configured.
      for (const value of ['org/repo/extra', 'org/repo/', '/repo', 'org/']) {
        await expect(resolvePrivateSink({ PRIVATE_REPORT_REPO: value })).rejects.toThrow(
          /owner\/repository/
        );
      }
      await expect(resolvePrivateSink({ PRIVATE_REPORT_REPO: 'o/r' })).rejects.toThrow(
        /PRIVATE_REPORT_TOKEN/
      );
      const client = { rest: { repos: { get: async () => ({ data: { private: true } }) } } };
      const sink = await resolvePrivateSink(
        { PRIVATE_REPORT_REPO: 'o/r', PRIVATE_REPORT_TOKEN: 't' },
        () => client
      );
      expect(sink).toEqual({ client, owner: 'o', repo: 'r' });
    });

    it('upserts the private report under its own title', async () => {
      const creates = [];
      const client = {
        rest: {
          search: { issuesAndPullRequests: async () => ({ data: { items: [] } }) },
          issues: {
            create: async (params) => {
              creates.push(params);
              return { data: { number: 1 } };
            },
          },
        },
      };
      await upsertDriftIssue(client, client, 'o', 'r', 'b', PRIVATE_DRIFT_ISSUE_TITLE);
      expect(creates[0].title).toBe('Label drift report (private repositories)');
    });
  });
});

describe('writeRedactedInventory (T041)', () => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const inventory = {
    generated_at: '2026-10-06T00:00:00.000Z',
    organisation: 'lightspeedwp',
    repository_count: 2,
    private_repository_count: 1,
    reported_private_repository_count: 1,
    label_total: 3,
    repositories: [
      {
        repository: 'lightspeedwp/public-repo',
        archived: false,
        fork: false,
        private: false,
        label_count: 1,
        pages_read: 2,
        labels: [{ name: 'type:bug', color: 'D73A4A', description: 'Bug' }],
      },
      {
        repository: 'lightspeedwp/secret-client-site',
        archived: false,
        fork: false,
        private: true,
        label_count: 2,
        pages_read: 2,
        labels: [
          { name: 'client-secret-label', color: 'FFFFFF', description: '' },
          { name: 'type:bug', color: 'D73A4A', description: 'Bug' },
        ],
      },
    ],
  };

  it('writes the public repository with its labels and keeps private counts only', () => {
    const dir = fs.mkdtempSync(path.join(here, 'inv-'));
    try {
      const out = path.join(dir, 'nested', 'github-api-labels.json');
      writeRedactedInventory(inventory, out);
      const text = fs.readFileSync(out, 'utf8');
      const saved = JSON.parse(text);
      expect(saved.redacted).toBe(true);
      expect(saved.repositories[0].labels).toHaveLength(1);
      expect(saved.repositories[1]).toMatchObject({
        repository: 'lightspeedwp/private-repository-001',
        private: true,
        label_count: 2,
        pages_read: 2,
      });
      expect(saved.repositories[1].labels).toBeUndefined();
      expect(text).not.toContain('secret-client-site');
      expect(text).not.toContain('client-secret-label');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('writes to the evidence file the spec names, and the workflow uploads it', () => {
    expect(DEFAULT_INVENTORY_OUTPUT.split(path.sep).join('/')).toBe(
      '.github/reports/audits/2026-09-14-label-audit/evidence/github-api-labels.json'
    );
    const workflow = fs.readFileSync(
      path.join(here, '../../../.github/workflows/label-drift-check.yml'),
      'utf8'
    );
    expect(workflow).toContain('evidence/github-api-labels.json');
    expect(workflow).toContain('evidence/linear-drift-report.json');
  });
});
