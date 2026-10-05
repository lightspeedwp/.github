/**
 * Unit tests for label-inventory.js (spec 008, task T041).
 * @module scripts/automation/__tests__/label-inventory.test.js
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, it, expect } from '@jest/globals';
import {
  PER_PAGE,
  collectPages,
  buildInventory,
  incompleteRepositories,
  incompleteRepositoryLabels,
  isInsidePublicRepository,
  privateRepositoryGap,
  publicRepositoryName,
  redactInventory,
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

  // This repository is public, so the tracked evidence must not name a private
  // repository or list its labels (decision of 2026-10-04), while completeness is
  // still judged on every repository.
  describe('redacting private repositories', () => {
    const inventory = {
      generated_at: '2026-10-04T00:00:00.000Z',
      organisation: 'lightspeedwp',
      repository_count: 3,
      private_repository_count: 2,
      reported_private_repository_count: 2,
      label_total: 12,
      repositories: [
        {
          repository: 'lightspeedwp/public-tool',
          archived: false,
          fork: false,
          private: false,
          label_count: 2,
          pages_read: 1,
          labels: [{ name: 'type:bug', color: 'AAAAAA', description: 'x' }],
        },
        {
          repository: 'lightspeedwp/acme-client-site',
          archived: false,
          fork: false,
          private: true,
          label_count: 7,
          pages_read: 1,
          labels: [{ name: 'acme-launch', color: 'BBBBBB', description: 'secret' }],
        },
        {
          repository: 'lightspeedwp/other-client-site',
          archived: true,
          fork: false,
          private: true,
          label_count: 3,
          pages_read: 1,
          labels: [],
        },
      ],
    };

    it('names no private repository and lists none of its labels', () => {
      const text = JSON.stringify(redactInventory(inventory));
      for (const leaked of ['acme-client-site', 'other-client-site', 'acme-launch', 'secret']) {
        expect(text).not.toContain(leaked);
      }
    });

    it('keeps public repositories whole and private ones as counts under placeholders', () => {
      const redacted = redactInventory(inventory);
      expect(redacted.repositories[0]).toEqual(inventory.repositories[0]);
      expect(redacted.repositories[1]).toEqual({
        repository: 'lightspeedwp/private-repository-001',
        archived: false,
        fork: false,
        private: true,
        label_count: 7,
        pages_read: 1,
      });
      expect(redacted.repositories[2].repository).toBe('lightspeedwp/private-repository-002');
      expect(redacted.redacted).toBe(true);
      expect(redacted.private_repository_count).toBe(2);
      expect(redacted.label_total).toBe(12);
    });

    it('leaves the full inventory untouched', () => {
      redactInventory(inventory);
      expect(inventory.repositories[1].repository).toBe('lightspeedwp/acme-client-site');
      expect(inventory.repositories[1].labels).toHaveLength(1);
    });

    it('still passes the completeness checks, because they ran on the full inventory', () => {
      const redacted = redactInventory(inventory);
      expect(incompleteRepositories(redacted)).toEqual([]);
      expect(privateRepositoryGap(redacted)).toBeNull();
    });

    it('says a private repository in a message, not its name', () => {
      expect(publicRepositoryName(inventory.repositories[0])).toBe('lightspeedwp/public-tool');
      expect(publicRepositoryName(inventory.repositories[1])).toBe('a private repository');
      const broken = {
        ...inventory,
        repositories: inventory.repositories.map((repo) => ({ ...repo, pages_read: 0 })),
      };
      const labels = incompleteRepositoryLabels(broken);
      expect(labels).toContain('lightspeedwp/public-tool');
      expect(labels.join(' ')).not.toContain('client-site');
    });

    it('refuses a full-output path anywhere inside the public repository except .private-evidence', () => {
      const cwd = '/repo';
      for (const refused of [
        '.github/reports/full.json',
        '.github',
        'full.json',
        'docs/full.json',
        'scripts/automation/full.json',
        '.githubx/full.json',
        '.private-evidencex/full.json',
        '.',
        'docs/../full.json',
      ]) {
        expect(isInsidePublicRepository(refused, cwd)).toBe(true);
      }
      for (const allowed of [
        '.private-evidence/full.json',
        '.private-evidence/nested/full.json',
        '/tmp/full.json',
        '../outside/full.json',
      ]) {
        expect(isInsidePublicRepository(allowed, cwd)).toBe(false);
      }
    });

    it('is not fooled by a path that climbs out of .private-evidence or a symlink into the repository', () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'inventory-root-'));
      const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'inventory-outside-'));
      try {
        fs.mkdirSync(path.join(root, '.private-evidence'));
        fs.mkdirSync(path.join(root, 'docs'));
        expect(isInsidePublicRepository('.private-evidence/../docs/full.json', root)).toBe(true);
        fs.symlinkSync(path.join(root, 'docs'), path.join(outside, 'link'));
        expect(isInsidePublicRepository(path.join(outside, 'link', 'full.json'), root)).toBe(true);
        fs.symlinkSync(outside, path.join(root, '.private-evidence', 'out'));
        expect(isInsidePublicRepository('.private-evidence/out/full.json', root)).toBe(false);
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
        fs.rmSync(outside, { recursive: true, force: true });
      }
    });
  });
});
