#!/usr/bin/env node

/**
 * Organisation-wide label inventory (spec 008, task T041).
 *
 * Lists every repository in an organisation and pages through each
 * repository's labels 100 at a time until no further page remains, so no
 * label is missed (`gh label list` defaults to 30 and the older
 * label-sync.js read only the first 100). Read-only: it never creates,
 * edits or deletes labels.
 *
 * Usage:
 *   GITHUB_TOKEN=... node scripts/automation/label-inventory.js [--org lightspeedwp] [--output path]
 */

import fs from 'fs';
import path from 'path';

export const PER_PAGE = 100;

const DEFAULT_OUTPUT = path.join(
  '.github',
  'reports',
  'audits',
  '2026-09-14-label-audit',
  'evidence',
  'github-api-labels.json'
);

/**
 * Collect every page from a paginated list call.
 * @param {(page: number) => Promise<Array<object>>} fetchPage Returns one page of results.
 * @returns {Promise<{items: Array<object>, pagesRead: number}>}
 */
export async function collectPages(fetchPage) {
  const items = [];
  let pagesRead = 0;
  for (let page = 1; ; page += 1) {
    const batch = await fetchPage(page);
    pagesRead += 1;
    items.push(...batch);
    if (batch.length < PER_PAGE) break;
  }
  return { items, pagesRead };
}

/**
 * Build the inventory for an organisation.
 * @param {object} client Octokit-style client exposing `rest.repos.listForOrg` and `rest.issues.listLabelsForRepo`.
 * @param {string} org Organisation login.
 * @returns {Promise<object>} Inventory with one entry per repository.
 */
export async function buildInventory(client, org) {
  const { items: repos } = await collectPages(async (page) => {
    const { data } = await client.rest.repos.listForOrg({
      org,
      type: 'all',
      per_page: PER_PAGE,
      page,
    });
    return data;
  });

  const repositories = [];
  for (const repo of repos) {
    const { items: labels, pagesRead } = await collectPages(async (page) => {
      const { data } = await client.rest.issues.listLabelsForRepo({
        owner: org,
        repo: repo.name,
        per_page: PER_PAGE,
        page,
      });
      return data;
    });
    repositories.push({
      repository: `${org}/${repo.name}`,
      archived: Boolean(repo.archived),
      fork: Boolean(repo.fork),
      label_count: labels.length,
      pages_read: pagesRead,
      labels: labels.map((l) => ({
        name: l.name,
        color: String(l.color || '').toUpperCase(),
        description: l.description || '',
      })),
    });
  }

  return {
    generated_at: new Date().toISOString(),
    organisation: org,
    repository_count: repositories.length,
    label_total: repositories.reduce((n, r) => n + r.label_count, 0),
    repositories,
  };
}

/**
 * Check the completeness rule from the dry-run contract:
 * pages_read × 100 must be at least label_count, and a repository whose
 * count is an exact multiple of 100 must have read one extra (empty) page.
 * @param {object} inventory Result of buildInventory.
 * @returns {string[]} Repositories that fail the rule.
 */
export function incompleteRepositories(inventory) {
  return inventory.repositories
    .filter(
      (r) =>
        r.pages_read * PER_PAGE < r.label_count ||
        r.pages_read <= Math.floor(r.label_count / PER_PAGE)
    )
    .map((r) => r.repository);
}

function parseArgs(argv) {
  const args = { org: 'lightspeedwp', output: DEFAULT_OUTPUT };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--org') args.org = argv[(i += 1)];
    else if (argv[i] === '--output') args.output = argv[(i += 1)];
  }
  return args;
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }
  const { Octokit } = await import('octokit');
  const client = new Octokit({ auth: token });
  const { org, output } = parseArgs(process.argv.slice(2));

  const inventory = await buildInventory(client, org);
  const incomplete = incompleteRepositories(inventory);
  if (incomplete.length > 0) {
    console.error(`❌ Incomplete pagination for: ${incomplete.join(', ')}`);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(inventory, null, 2)}\n`);
  console.log(
    `✅ ${inventory.repository_count} repositories, ${inventory.label_total} labels → ${output}`
  );
}

if (process.argv[1] && path.basename(process.argv[1]) === 'label-inventory.js') {
  main().catch((err) => {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  });
}
