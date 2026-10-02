/**
 * Unit tests for linear-label-inventory.js (spec 008, tasks T042/T072; FR-018).
 *
 * No network access: every test injects a mock fetch implementation.
 * @module scripts/automation/__tests__/linear-label-inventory.test.js
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  PER_PAGE,
  LinearApiError,
  linearGraphQL,
  fetchAllLabels,
  countIssuesForLabel,
  labelScope,
  toInventoryRecord,
  buildLinearInventory,
} from '../linear-label-inventory.js';

const TOKEN = 'test-linear-key';

function mockResponse({ status = 200, jsonBody = {}, retryAfter = null } = {}) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: (name) => (name.toLowerCase() === 'retry-after' ? retryAfter : null) },
    json: async () => jsonBody,
    text: async () => JSON.stringify(jsonBody).slice(0, 500),
  };
}

const labelNode = (id, team = null) => ({
  id,
  name: `label-${id}`,
  color: '#abcdef',
  description: '',
  isGroup: false,
  archivedAt: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  parent: null,
  inheritedFrom: null,
  team,
});

const labelPage = (labels, hasNextPage, endCursor = null) => ({
  data: {
    issueLabels: {
      nodes: labels,
      pageInfo: { hasNextPage, endCursor },
    },
  },
});

describe('linear-label-inventory', () => {
  let savedToken;
  beforeEach(() => {
    savedToken = process.env.LINEAR_API_KEY;
    delete process.env.LINEAR_API_KEY;
  });
  afterEach(() => {
    if (savedToken === undefined) delete process.env.LINEAR_API_KEY;
    else process.env.LINEAR_API_KEY = savedToken;
  });

  it('requires LINEAR_API_KEY, not LINEAR_TOKEN', async () => {
    await expect(linearGraphQL('query { x }', { token: undefined })).rejects.toThrow(
      /LINEAR_API_KEY/
    );
    process.env.LINEAR_TOKEN = 'wrong-name';
    await expect(
      linearGraphQL('query { x }', { fetchImpl: async () => mockResponse() })
    ).rejects.toThrow(/LINEAR_API_KEY/);
    delete process.env.LINEAR_TOKEN;
  });

  it('follows pageInfo.hasNextPage, not a top-level flag', async () => {
    const calls = [];
    const fetchImpl = async (url, { body }) => {
      calls.push(JSON.parse(body).query);
      if (calls.length === 1) {
        return mockResponse({
          jsonBody: labelPage(
            Array.from({ length: PER_PAGE }, (_, i) => labelNode(`l${i}`)),
            true,
            'CURSOR_1'
          ),
        });
      }
      return mockResponse({ jsonBody: labelPage([labelNode('last')], false, null) });
    };
    const { labels, pagesRead } = await fetchAllLabels({ token: TOKEN, fetchImpl });
    expect(labels).toHaveLength(PER_PAGE + 1);
    expect(pagesRead).toBe(2);
    // The second request must carry the cursor from pageInfo.endCursor.
    expect(calls[1]).toContain('after: "CURSOR_1"');
    // A full first page alone must not stop pagination.
    expect(calls).toHaveLength(2);
  });

  it('fails loudly on GraphQL errors with null data', async () => {
    const fetchImpl = async () =>
      mockResponse({
        jsonBody: {
          errors: [{ message: 'Cannot query field "scope" on type "IssueLabel".' }],
          data: null,
        },
      });
    await expect(fetchAllLabels({ token: TOKEN, fetchImpl })).rejects.toThrow(
      /Cannot query field "scope"/
    );
  });

  it('fails loudly on non-2xx responses without swallowing the body', async () => {
    const fetchImpl = async () =>
      mockResponse({ status: 401, jsonBody: { message: 'Unauthorized' } });
    await expect(fetchAllLabels({ token: TOKEN, fetchImpl })).rejects.toThrow(
      /\[401\].*Unauthorized/
    );
  });

  it('retries once on 429 and then succeeds', async () => {
    let calls = 0;
    const fetchImpl = async () => {
      calls += 1;
      if (calls === 1) return mockResponse({ status: 429, retryAfter: '0' });
      return mockResponse({ jsonBody: labelPage([labelNode('l1')], false, null) });
    };
    const { labels } = await fetchAllLabels({ token: TOKEN, fetchImpl });
    expect(labels).toHaveLength(1);
    expect(calls).toBe(2);
  });

  it('derives workspace scope from a null team', () => {
    expect(labelScope(labelNode('a', null))).toBe('workspace');
    expect(labelScope(labelNode('b', { id: 't1', key: 'LS', name: 'LightSpeed' }))).toBe('LS');
  });

  it('counts issues across pages until a short page', async () => {
    const ids = Array.from({ length: PER_PAGE + 3 }, (_, i) => ({ id: `i${i}` }));
    const fetchImpl = async (url, { body }) => {
      const query = JSON.parse(body).query;
      // The count query must filter by exact label ID and include archived issues.
      expect(query).toContain('labels: { some: { id: { eq: "label-9" } } }');
      expect(query).toContain('includeArchived: true');
      const after = /after: "([^"]+)"/.exec(query)?.[1];
      const start = after === 'C1' ? PER_PAGE : 0;
      const batch = ids.slice(start, start + PER_PAGE);
      return mockResponse({
        jsonBody: {
          data: {
            issues: {
              nodes: batch,
              pageInfo: {
                hasNextPage: start + batch.length < ids.length,
                endCursor: 'C1',
              },
            },
          },
        },
      });
    };
    await expect(countIssuesForLabel('label-9', { token: TOKEN, fetchImpl })).resolves.toBe(
      PER_PAGE + 3
    );
  });

  it('builds records with counts, scopes and team lists', async () => {
    const team = { id: 't1', key: 'LS', name: 'LightSpeed' };
    const fetchImpl = async (url, { body }) => {
      const query = JSON.parse(body).query;
      if (query.includes('issueLabels')) {
        return mockResponse({
          jsonBody: labelPage([labelNode('a', null), labelNode('b', team)], false, null),
        });
      }
      return mockResponse({
        jsonBody: {
          data: {
            issues: { nodes: [{ id: 'i1' }], pageInfo: { hasNextPage: false, endCursor: null } },
          },
        },
      });
    };
    const inventory = await buildLinearInventory({ token: TOKEN, fetchImpl });
    expect(inventory.labels).toHaveLength(2);
    expect(inventory.labels.map((l) => [l.name, l.scope, l.issue_count]).sort()).toEqual([
      ['label-a', 'workspace', 1],
      ['label-b', 'LS', 1],
    ]);
    expect(inventory.sources.linear_workspace_count).toBe(1);
    expect(inventory.sources.linear_team_label_count).toBe(1);
    expect(inventory.sources.linear_teams).toEqual([team]);
    expect(new Date(inventory.generated_at).toISOString()).toBe(inventory.generated_at);
  });

  it('skips counts with --no-counts equivalent', async () => {
    let issueCalls = 0;
    const fetchImpl = async (url, { body }) => {
      const query = JSON.parse(body).query;
      if (query.includes('issueLabels')) {
        return mockResponse({ jsonBody: labelPage([labelNode('a')], false, null) });
      }
      issueCalls += 1;
      return mockResponse({
        jsonBody: {
          data: { issues: { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } } },
        },
      });
    };
    const inventory = await buildLinearInventory({ token: TOKEN, fetchImpl, counts: false });
    expect(inventory.labels[0].issue_count).toBe(0);
    expect(issueCalls).toBe(0);
  });

  it('does not query issue counts for group labels', async () => {
    const group = { ...labelNode('g'), isGroup: true };
    let issueCalls = 0;
    const fetchImpl = async (url, { body }) => {
      const query = JSON.parse(body).query;
      if (query.includes('issueLabels')) {
        return mockResponse({ jsonBody: labelPage([group], false, null) });
      }
      issueCalls += 1;
      return mockResponse({
        jsonBody: {
          data: { issues: { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } } },
        },
      });
    };
    const inventory = await buildLinearInventory({ token: TOKEN, fetchImpl });
    expect(inventory.labels[0].issue_count).toBe(0);
    expect(issueCalls).toBe(0);
  });

  it('keeps an explicit record shape', () => {
    const record = toInventoryRecord(labelNode('a', null), 7);
    expect(record).toEqual({
      id: 'a',
      name: 'label-a',
      scope: 'workspace',
      team: null,
      parent_id: null,
      inherited_from_id: null,
      is_group: false,
      color: '#abcdef',
      description: '',
      retired_at: null,
      issue_count: 7,
    });
    expect(LinearApiError).toBeDefined();
  });
});
