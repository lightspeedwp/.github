/**
 * Unit tests for label-drift-check.js (spec 008, task T072; FR-017, FR-018).
 *
 * Pure diff/render logic is tested directly; GitHub writes are tested
 * against a mock client. No network access, no repository writes.
 * @module scripts/automation/__tests__/label-drift-check.test.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect } from '@jest/globals';
import {
  DRIFT_ISSUE_TITLE,
  DRIFT_ISSUE_LABELS,
  MAX_COUNTED_ROWS,
  normaliseColor,
  escapeCell,
  splitCells,
  diffGithubRepo,
  diffLinearLabels,
  countGithubItems,
  enrichGithubRows,
  parseFirstSeen,
  renderReport,
  upsertDriftIssue,
} from '../label-drift-check.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptSource = fs.readFileSync(path.join(__dirname, '../label-drift-check.js'), 'utf8');

const canonical = new Map([
  ['status:done', { color: '0E8A16', description: 'Finished' }],
  ['type:task', { color: 'FBCA04', description: 'Work item' }],
]);

describe('label-drift-check', () => {
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
});
