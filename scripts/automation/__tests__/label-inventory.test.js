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
  privateRepositoryGap,
  resolveToken,
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

  describe('token and private repository guards (T075)', () => {
    it('reads the token from LABEL_INVENTORY_TOKEN, not GITHUB_TOKEN', () => {
      expect(resolveToken({ LABEL_INVENTORY_TOKEN: 'org-token' })).toEqual({ token: 'org-token' });
      expect(resolveToken({ GITHUB_TOKEN: 'repo-token' }).error).toMatch(
        /LABEL_INVENTORY_TOKEN is required/
      );
    });

    it('refuses to run inside GitHub Actions even when a token is set', () => {
      const result = resolveToken({ GITHUB_ACTIONS: 'true', LABEL_INVENTORY_TOKEN: 'org-token' });
      expect(result.token).toBeUndefined();
      expect(result.error).toMatch(/refusing to run inside GitHub Actions/);
    });

    it('records private repositories and the organisation-reported count', async () => {
      const client = pagedClient([{ name: 'pub' }, { name: 'priv', private: true }], {
        pub: 1,
        priv: 2,
      });
      client.rest.orgs = { get: async () => ({ data: { total_private_repos: 1 } }) };
      const inv = await buildInventory(client, 'lightspeedwp');
      expect(inv.private_repository_count).toBe(1);
      expect(inv.reported_private_repository_count).toBe(1);
      expect(inv.repositories.find((r) => r.repository === 'lightspeedwp/priv').private).toBe(true);
      expect(privateRepositoryGap(inv)).toBeNull();
    });

    it('fails when the token cannot see every private repository', async () => {
      const client = pagedClient([{ name: 'pub' }], { pub: 1 });
      client.rest.orgs = { get: async () => ({ data: { total_private_repos: 3 } }) };
      const inv = await buildInventory(client, 'lightspeedwp');
      expect(privateRepositoryGap(inv)).toMatch(
        /listed 0 private repositories but lightspeedwp reports 3/
      );
    });

    it('fails when the organisation count is not readable', async () => {
      const inv = await buildInventory(pagedClient([{ name: 'a' }], { a: 1 }), 'lightspeedwp');
      expect(inv.reported_private_repository_count).toBeNull();
      expect(privateRepositoryGap(inv)).toMatch(
        /total_private_repos.*organisation-owner token is required/
      );
    });

    it.each([null, undefined])(
      'requires organisation-owner permission when the reported count is %s',
      (reported) => {
        expect(
          privateRepositoryGap({
            organisation: 'lightspeedwp',
            private_repository_count: 0,
            reported_private_repository_count: reported,
          })
        ).toMatch(/total_private_repos.*organisation-owner token is required/);
      }
    );

    it('accepts an organisation that reports zero private repositories', () => {
      expect(
        privateRepositoryGap({
          organisation: 'lightspeedwp',
          private_repository_count: 0,
          reported_private_repository_count: 0,
        })
      ).toBeNull();
    });
  });
});
