/**
 * Unit tests for label-inventory.js (spec 008, task T041).
 * @module scripts/automation/__tests__/label-inventory.test.js
 */

import { describe, it, expect } from '@jest/globals';
import {
  PER_PAGE,
  collectPages,
  buildInventory,
  incompleteRepositories,
} from '../label-inventory.js';

const labelsOf = (n, prefix = 'l') =>
  Array.from({ length: n }, (_, i) => ({
    name: `${prefix}${i}`,
    color: 'abcdef',
    description: '',
  }));

function pagedClient(repos, labelCounts) {
  const page = (arr, p) => arr.slice((p - 1) * PER_PAGE, p * PER_PAGE);
  return {
    rest: {
      repos: {
        listForOrg: async ({ page: p }) => ({ data: page(repos, p) }),
      },
      issues: {
        listLabelsForRepo: async ({ repo, page: p }) => ({
          data: page(labelsOf(labelCounts[repo]), p),
        }),
      },
    },
  };
}

describe('label-inventory', () => {
  it('reads every page until a short page is returned', async () => {
    const data = labelsOf(250);
    const { items, pagesRead } = await collectPages(async (p) =>
      data.slice((p - 1) * PER_PAGE, p * PER_PAGE)
    );
    expect(items).toHaveLength(250);
    expect(pagesRead).toBe(3);
  });

  it('reads one extra empty page when the total is an exact multiple of 100', async () => {
    const data = labelsOf(200);
    const { items, pagesRead } = await collectPages(async (p) =>
      data.slice((p - 1) * PER_PAGE, p * PER_PAGE)
    );
    expect(items).toHaveLength(200);
    expect(pagesRead).toBe(3);
  });

  it('builds a per-repository inventory with counts and upper-case colours', async () => {
    const client = pagedClient([{ name: 'a' }, { name: 'b', archived: true }], { a: 169, b: 5 });
    const inv = await buildInventory(client, 'lightspeedwp');
    expect(inv.repository_count).toBe(2);
    expect(inv.label_total).toBe(174);
    const a = inv.repositories.find((r) => r.repository === 'lightspeedwp/a');
    expect(a.label_count).toBe(169);
    expect(a.pages_read).toBe(2);
    expect(a.labels[0].color).toBe('ABCDEF');
    expect(inv.repositories.find((r) => r.repository === 'lightspeedwp/b').archived).toBe(true);
    expect(incompleteRepositories(inv)).toEqual([]);
  });

  it('flags repositories whose pagination stopped early', () => {
    const inv = {
      repositories: [
        { repository: 'o/full', label_count: 100, pages_read: 1 },
        { repository: 'o/ok', label_count: 100, pages_read: 2 },
        { repository: 'o/short', label_count: 150, pages_read: 1 },
      ],
    };
    expect(incompleteRepositories(inv)).toEqual(['o/full', 'o/short']);
  });
});
