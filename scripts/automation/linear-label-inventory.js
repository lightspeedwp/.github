#!/usr/bin/env node

/**
 * Linear label inventory (spec 008, tasks T042/T072; FR-017, FR-018).
 *
 * Read-only export of every Linear workspace and team label with per-label
 * issue counts (archived issues included). It never creates, edits, retires
 * or deletes labels, issues or anything else: the only GraphQL operations
 * it sends are `issueLabels` and `issues` queries.
 *
 * Field selection verified against @linear/sdk 97.0.0 generated types
 * (the SDK is generated from the live Linear schema): `IssueLabel` has no
 * `scope` and no `issueCount` field. Scope is derived from `team` (null =
 * workspace-level, per the schema docs), and counts come from the `issues`
 * connection filtered by exact label ID with `includeArchived: true`.
 * Cursor pagination reads `pageInfo.hasNextPage` / `pageInfo.endCursor`;
 * there is no top-level `hasNextPage` on the connection.
 *
 * Authentication (FR-018): a read-only Linear API key in `LINEAR_API_KEY`
 * (the repository secret of the same name). Linear keys carry Read, Write
 * or Admin permission levels, not per-resource scopes.
 *
 * Usage:
 *   LINEAR_API_KEY=... node scripts/automation/linear-label-inventory.js [--output path] [--no-counts]
 */

import fs from 'fs';
import path from 'path';

export const LINEAR_API_URL = 'https://api.linear.app/graphql';
export const PER_PAGE = 100;
export const MAX_LABEL_PAGES = 50;
export const MAX_ISSUE_PAGES_PER_LABEL = 100;
export const REQUEST_TIMEOUT_MS = 30000;
export const COUNT_CONCURRENCY = 4;

const DEFAULT_OUTPUT = path.join(
  '.github',
  'reports',
  'audits',
  '2026-09-14-label-audit',
  'evidence',
  'linear-inventory.json'
);

export class LinearApiError extends Error {}

/**
 * POST a GraphQL query to Linear with timeout, rate-limit honouring and
 * retries. Rejects on transport errors, non-2xx responses and GraphQL
 * `errors` (including unknown-field validation errors, which arrive with
 * `data: null`).
 * @param {string} query GraphQL query document.
 * @param {object} options Overrides for tests.
 * @param {string} [options.token] Linear API key (defaults to LINEAR_API_KEY).
 * @param {Function} [options.fetchImpl] fetch implementation (defaults to global fetch).
 * @param {number} [options.timeoutMs] Per-request timeout.
 * @returns {Promise<object>} The response `data` object (never null).
 */
export async function linearGraphQL(query, options = {}) {
  const token = options.token ?? process.env.LINEAR_API_KEY;
  if (!token) {
    throw new LinearApiError(
      'LINEAR_API_KEY environment variable is required (read-only Linear API key, FR-018).'
    );
  }
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;
  const maxAttempts = 4;
  let attempt = 0;

  while (true) {
    attempt += 1;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let response;
    try {
      response = await fetchImpl(LINEAR_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Personal API keys go in the header as-is; only OAuth access
          // tokens use "Bearer" (Linear rejects a Bearer-prefixed API key).
          Authorization: token.startsWith('lin_oauth_') ? `Bearer ${token}` : token,
        },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      if (attempt >= maxAttempts) {
        throw new LinearApiError(
          `Linear API request failed after ${attempt} attempts: ${err.message}`
        );
      }
      await sleep(backoffMs(attempt));
      continue;
    } finally {
      clearTimeout(timer);
    }

    if (response.status === 429) {
      if (attempt >= maxAttempts) {
        throw new LinearApiError('Linear API rate limit exceeded (429) after retries.');
      }
      await sleep(retryAfterMs(response));
      continue;
    }
    if (response.status >= 500) {
      if (attempt >= maxAttempts) {
        throw new LinearApiError(`Linear API request failed [${response.status}] after retries.`);
      }
      await sleep(backoffMs(attempt));
      continue;
    }
    if (!response.ok) {
      const body = await safeBody(response);
      throw new LinearApiError(`Linear API request failed [${response.status}]: ${body}`);
    }
    const json = await response.json();
    if (Array.isArray(json.errors) && json.errors.length > 0) {
      const messages = json.errors.map((e) => e.message).join('; ');
      throw new LinearApiError(`Linear API returned GraphQL errors: ${messages}`);
    }
    if (!json.data) {
      throw new LinearApiError('Linear API returned no data (and no errors).');
    }
    return json.data;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function backoffMs(attempt) {
  return Math.min(1000 * 2 ** (attempt - 1), 8000);
}

function retryAfterMs(response) {
  const header = response.headers?.get?.('retry-after');
  const seconds = Number(header);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(seconds * 1000, 60000);
  }
  return backoffMs(1);
}

async function safeBody(response) {
  try {
    const text = await response.text();
    return text.slice(0, 500);
  } catch {
    return '<unreadable body>';
  }
}

function labelSelection() {
  return `id
          name
          color
          description
          isGroup
          archivedAt
          createdAt
          updatedAt
          parent { id }
          inheritedFrom { id }
          team { id key name }`;
}

/**
 * Fetch one page of labels. Archived labels are included so retirements
 * stay visible; callers decide whether to compare them.
 * @param {string|null} after Pagination cursor.
 * @param {object} options Passed to linearGraphQL.
 * @returns {Promise<{labels: Array<object>, pageInfo: object}>}
 */
export async function fetchLabelPage(after, options = {}) {
  const afterArg = after ? `, after: ${JSON.stringify(after)}` : '';
  const data = await linearGraphQL(
    `query {
      issueLabels(first: ${PER_PAGE}${afterArg}, includeArchived: true) {
        nodes {
          ${labelSelection()}
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }`,
    options
  );
  return { labels: data.issueLabels.nodes, pageInfo: data.issueLabels.pageInfo };
}

/**
 * Fetch every label page until `pageInfo.hasNextPage` is false.
 * @param {object} options Passed to linearGraphQL.
 * @returns {Promise<{labels: Array<object>, pagesRead: number}>}
 */
export async function fetchAllLabels(options = {}) {
  const labels = [];
  let after = null;
  let pagesRead = 0;

  while (true) {
    const page = await fetchLabelPage(after, options);
    pagesRead += 1;
    labels.push(...page.labels);
    if (!page.pageInfo.hasNextPage) break;
    if (pagesRead >= MAX_LABEL_PAGES) {
      throw new LinearApiError(
        `Stopped after ${pagesRead} label pages: pagination did not terminate.`
      );
    }
    after = page.pageInfo.endCursor;
  }
  return { labels, pagesRead };
}

/**
 * Count issues carrying exactly one label ID, archived issues included.
 * The `issues` connection has no total count, so pages of IDs are counted
 * until a short page arrives.
 * @param {string} labelId Linear label ID.
 * @param {object} options Passed to linearGraphQL.
 * @returns {Promise<number>} Issue count (>= 0).
 */
export async function countIssuesForLabel(labelId, options = {}) {
  let count = 0;
  let after = null;
  let pagesRead = 0;

  while (true) {
    const afterArg = after ? `, after: ${JSON.stringify(after)}` : '';
    const data = await linearGraphQL(
      `query {
        issues(
          first: ${PER_PAGE}${afterArg},
          includeArchived: true,
          filter: { labels: { some: { id: { eq: ${JSON.stringify(labelId)} } } } }
        ) {
          nodes { id }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }`,
      options
    );
    const nodes = data.issues.nodes;
    pagesRead += 1;
    count += nodes.length;
    if (!data.issues.pageInfo.hasNextPage) break;
    if (pagesRead >= MAX_ISSUE_PAGES_PER_LABEL) {
      throw new LinearApiError(
        `Stopped counting issues for label ${labelId} after ${pagesRead} pages.`
      );
    }
    after = data.issues.pageInfo.endCursor;
  }
  return count;
}

/**
 * Derive the inventory scope for a label. Linear exposes no `scope` field;
 * a null team means workspace-level (schema docs on `IssueLabel.team`).
 * @param {object} label Label node with optional team.
 * @returns {string} 'workspace' or the team key.
 */
export function labelScope(label) {
  return label.team?.key ?? 'workspace';
}

/**
 * Normalise one label node to the inventory record shape.
 * @param {object} label Label node.
 * @param {number} issueCount Issues carrying the label (archived included).
 * @returns {object} Inventory record.
 */
export function toInventoryRecord(label, issueCount) {
  return {
    id: label.id,
    name: label.name,
    scope: labelScope(label),
    team: label.team ? { id: label.team.id, key: label.team.key, name: label.team.name } : null,
    parent_id: label.parent?.id ?? null,
    inherited_from_id: label.inheritedFrom?.id ?? null,
    is_group: Boolean(label.isGroup),
    color: label.color ?? null,
    description: label.description ?? null,
    retired_at: label.archivedAt ?? null,
    issue_count: issueCount,
  };
}

async function mapPool(items, size, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

/**
 * Build the full Linear label inventory: every label plus its issue count.
 * @param {object} options Passed to linearGraphQL; `counts` (default true)
 *   skips per-label issue counting when false.
 * @returns {Promise<object>} Inventory with `labels` records and `sources`.
 */
export async function buildLinearInventory(options = {}) {
  const { counts = true, ...requestOptions } = options;
  const { labels, pagesRead } = await fetchAllLabels(requestOptions);
  const teams = new Map();
  for (const label of labels) {
    if (label.team) teams.set(label.team.id, label.team);
  }
  const issueCounts = counts
    ? await mapPool(labels, COUNT_CONCURRENCY, (label) =>
        // Group labels cannot be applied to issues (schema docs on
        // `IssueLabel.isGroup`), so their count is definitionally zero.
        label.isGroup ? 0 : countIssuesForLabel(label.id, requestOptions)
      )
    : labels.map(() => 0);
  const records = labels.map((label, index) => toInventoryRecord(label, issueCounts[index]));
  const workspace = records.filter((r) => r.scope === 'workspace');
  return {
    generated_at: new Date().toISOString(),
    sources: {
      linear_workspace_count: workspace.length,
      linear_team_label_count: records.length - workspace.length,
      linear_label_pages_read: pagesRead,
      linear_teams: [...teams.values()].map((team) => ({
        id: team.id,
        key: team.key,
        name: team.name,
      })),
      method:
        'issueLabels(includeArchived: true) paginated via pageInfo, counts via issues(filter: exact label ID, includeArchived: true); read-only',
    },
    labels: records,
  };
}

function parseArgs(argv) {
  const args = { output: DEFAULT_OUTPUT, counts: true };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--output') args.output = argv[(i += 1)];
    else if (argv[i] === '--no-counts') args.counts = false;
  }
  return args;
}

async function main() {
  const { output, counts } = parseArgs(process.argv.slice(2));
  const inventory = await buildLinearInventory({ counts });
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(inventory, null, 2)}\n`);
  console.log(
    `✅ ${inventory.labels.length} Linear labels ` +
      `(${inventory.sources.linear_workspace_count} workspace, ` +
      `${inventory.sources.linear_team_label_count} team) → ${output}`
  );
}

if (process.argv[1] && path.basename(process.argv[1]) === 'linear-label-inventory.js') {
  main().catch((err) => {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  });
}
