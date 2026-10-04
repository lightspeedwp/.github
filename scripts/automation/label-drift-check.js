#!/usr/bin/env node

/**
 * Weekly label drift check (spec 008, task T072; FR-017, FR-018).
 *
 * Compares every `lightspeedwp` repository's labels and the Linear workspace
 * labels against the approved set in `.github/labels.yml`, then creates or
 * updates the single "Label drift report" issue per
 * `contracts/dry-run-and-drift-report-schema.md`.
 *
 * Read-only by construction: the only GitHub operations are label/repo
 * reads, issue search, and create/update of the one report issue. It never
 * creates, edits or deletes labels (FR-017 rule 2, FR-018).
 *
 * Private repositories (decision of 2026-10-04): this repository is public, so
 * the issue, the JSON artifact and the log count private repositories but never
 * name one or list its labels. Their detail goes only to a private repository,
 * when `PRIVATE_REPORT_REPO` (owner/name) and `PRIVATE_REPORT_TOKEN` (issues
 * write on that repository, minted by the workflow from the installed App) are
 * set; the repository is confirmed private before anything is written, and
 * without them the detail is withheld.
 *
 * Authentication (FR-018): GitHub via an organisation-wide App installation
 * token passed as `GITHUB_TOKEN` (manual step T071a) for reads, plus a
 * report-scoped token as `GITHUB_WRITE_TOKEN` (issues write on the report
 * repository only) for the single report-issue write. Linear via the
 * read-only `LINEAR_API_KEY` repository secret.
 *
 * Usage:
 *   GITHUB_TOKEN=... GITHUB_WRITE_TOKEN=... LINEAR_API_KEY=... node scripts/automation/label-drift-check.js [--org lightspeedwp] [--repo lightspeedwp/.github] [--output path] [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';
import { buildInventory, incompleteRepositoryLabels } from './label-inventory.js';
import { buildLinearInventory } from './linear-label-inventory.js';

export const DRIFT_ISSUE_TITLE = 'Label drift report';
export const PRIVATE_DRIFT_ISSUE_TITLE = 'Label drift report (private repositories)';
export const DRIFT_ISSUE_LABELS = ['type:audit', 'area:labels', 'status:needs-triage'];

// Team-scoped Linear labels documented in spec 008 FR-012 as project labels
// that must live at team scope rather than be imported. They are reported
// under "Allowed exceptions", never as drift.
export const ALLOWED_TEAM_SCOPED_LABELS = new Set([
  'area:xero',
  'area:flow',
  'area:jobs',
  'area:monorepo',
]);

const DEFAULT_OUTPUT = path.join(
  '.github',
  'reports',
  'audits',
  '2026-09-14-label-audit',
  'evidence',
  'linear-drift-report.json'
);

/**
 * Load the approved label set from labels.yml.
 * @param {string} labelsPath Path to labels.yml.
 * @returns {Promise<Map<string, {color: string, description: string}>>}
 */
export async function loadCanonicalLabels(labelsPath) {
  const entries = yaml.load(fs.readFileSync(labelsPath, 'utf8'));
  const map = new Map();
  for (const entry of entries) {
    map.set(entry.name, {
      color: normaliseColor(entry.color),
      description: entry.description ?? '',
    });
  }
  return map;
}

/**
 * Normalise a hex colour for comparison: strip `#`, upper-case.
 * @param {string|null|undefined} color Colour value.
 * @returns {string} Normalised colour ('' when absent).
 */
export function normaliseColor(color) {
  return String(color ?? '')
    .replace(/^#/, '')
    .toUpperCase();
}

/**
 * Escape a value for a Markdown table cell so a `|` in a label name cannot
 * add columns (which would corrupt parseFirstSeen and the rendering).
 * @param {*} value Cell value.
 * @returns {string} Escaped cell text.
 */
export function escapeCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|');
}

/**
 * Split a Markdown table row on unescaped pipes and restore escaped ones.
 * @param {string} line Table row.
 * @returns {string[]} Trimmed cell values.
 */
export function splitCells(line) {
  return String(line)
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim().replace(/\\\|/g, '|'));
}

/**
 * Diff one GitHub repository's labels against the approved set.
 * @param {object} repo One repository entry from buildInventory.
 * @param {Map} canonical Approved labels.
 * @returns {Array<object>} Drift rows (without item counts).
 */
export function diffGithubRepo(repo, canonical) {
  const rows = [];
  const seen = new Set();
  for (const label of repo.labels) {
    seen.add(label.name);
    const approved = canonical.get(label.name);
    if (!approved) {
      rows.push({ location: repo.repository, label: label.name, difference: 'unapproved' });
    } else if (normaliseColor(label.color) !== approved.color) {
      rows.push({ location: repo.repository, label: label.name, difference: 'colour mismatch' });
    } else if ((label.description ?? '') !== approved.description) {
      rows.push({
        location: repo.repository,
        label: label.name,
        difference: 'description mismatch',
      });
    }
  }
  for (const name of canonical.keys()) {
    if (!seen.has(name)) {
      rows.push({ location: repo.repository, label: name, difference: 'missing' });
    }
  }
  return rows;
}

/**
 * Diff Linear labels against the approved set. Archived (retired) labels
 * are skipped: they are no longer usable and must not read as drift.
 * Presence is tracked per scope (FR-023 point 7): labels are identified by
 * ID and scope, never by name alone, so a team label sharing a canonical
 * name neither satisfies the workspace entry nor escapes its own row.
 * @param {Array<object>} linearLabels Inventory records from buildLinearInventory.
 * @param {Map} canonical Approved labels.
 * @returns {{rows: Array<object>, allowed: Array<object>}} Drift rows and allowed exceptions.
 */
export function diffLinearLabels(linearLabels, canonical) {
  const rows = [];
  const allowed = [];
  const seenWorkspace = new Set();
  for (const label of linearLabels) {
    if (label.retired_at) continue;
    const approved = canonical.get(label.name);
    const location = label.scope === 'workspace' ? 'Linear (workspace)' : `Linear (${label.scope})`;
    if (label.scope === 'workspace') seenWorkspace.add(label.name);
    if (!approved) {
      if (label.scope !== 'workspace' && ALLOWED_TEAM_SCOPED_LABELS.has(label.name)) {
        allowed.push({ ...label, location });
      } else {
        rows.push({
          location,
          label: label.name,
          difference: 'unapproved',
          items: label.issue_count,
        });
      }
    } else if (label.scope === 'workspace') {
      if (normaliseColor(label.color) !== approved.color) {
        rows.push({
          location,
          label: label.name,
          difference: 'colour mismatch',
          items: label.issue_count,
        });
      } else if ((label.description ?? '') !== approved.description) {
        rows.push({
          location,
          label: label.name,
          difference: 'description mismatch',
          items: label.issue_count,
        });
      }
    } else {
      // Same name as a canonical label but team-scoped: a separate entry
      // (FR-023 point 7), reported at its own scope, never as the workspace label.
      rows.push({
        location,
        label: label.name,
        difference: 'unapproved',
        items: label.issue_count,
      });
    }
  }
  for (const name of canonical.keys()) {
    if (!seenWorkspace.has(name)) {
      rows.push({ location: 'Linear (workspace)', label: name, difference: 'missing', items: '' });
    }
  }
  return { rows, allowed };
}

/**
 * Count issues and PRs carrying a label in one repository via search.
 * @param {object} client Octokit-style client.
 * @param {string} repository 'org/repo'.
 * @param {string} label Label name.
 * @returns {Promise<number>} total_count.
 */
export async function countGithubItems(client, repository, label) {
  const escaped = label.replace(/"/g, '\\"');
  const { data } = await client.rest.search.issuesAndPullRequests({
    q: `repo:${repository} label:"${escaped}"`,
    per_page: 1,
  });
  return data.total_count;
}

/**
 * Join the identity of one drift row. The NUL separator keeps names that
 * contain spaces or pipes unambiguous; it round-trips through JSON as \u0000.
 */
export function firstSeenKey(location, label, difference) {
  return `${location}\0${label}\0${difference}`;
}

/**
 * Read the hidden first-seen map from a report body, if present and valid.
 * @param {string} body Existing issue body.
 * @returns {Map<string, string>|null} Key to YYYY-MM-DD date, or null.
 */
export function parseFirstSeenBlock(body) {
  const match = /<!-- drift-first-seen\n([\s\S]*?)\n-->/.exec(String(body ?? ''));
  if (!match) return null;
  let parsed;
  try {
    parsed = JSON.parse(match[1]);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  const firstSeen = new Map();
  for (const [key, seen] of Object.entries(parsed)) {
    if (typeof key === 'string' && typeof seen === 'string' && /^\d{4}-\d{2}-\d{2}/.test(seen)) {
      firstSeen.set(key, seen.slice(0, 10));
    }
  }
  return firstSeen;
}

/**
 * Read "First seen" dates from an existing report body so continuing drift
 * keeps its original date. Prefers the hidden map (covers rows omitted from
 * the displayed tables); falls back to parsing table rows for bodies
 * written before the map existed.
 * @param {string} body Existing issue body.
 * @returns {Map<string, string>} Key to YYYY-MM-DD date.
 */
export function parseFirstSeen(body) {
  return parseFirstSeenBlock(body) ?? parseFirstSeenTables(body);
}

/**
 * Read "First seen" dates from rendered table rows only.
 */
export function parseFirstSeenTables(body) {
  const firstSeen = new Map();
  for (const line of String(body ?? '').split('\n')) {
    const cells = splitCells(line);
    if (
      cells.length < 7 ||
      cells[0] !== '' ||
      cells[1] === 'Location' ||
      /^:?-{3,}:?$/.test(cells[1])
    ) {
      continue;
    }
    const [, location, label, difference, seen] = cells;
    if (location && label && difference && /^\d{4}-\d{2}-\d{2}/.test(seen)) {
      firstSeen.set(firstSeenKey(location, label, difference), seen.slice(0, 10));
    }
  }
  return firstSeen;
}

/**
 * Render the report body per the drift-report contract.
 *
 * Issue bodies are capped by the API, so each table shows at most
 * `maxTableRows` rows; the JSON report artifact always holds every row.
 * First-seen dates for every row (including truncated ones) persist in a
 * hidden map at the end of the body, bounded by `maxFirstSeenBytes` so a
 * giant pre-consolidation report cannot overflow the API body limit; rows
 * past the budget fall back to table parsing like before.
 */
export const MAX_TABLE_ROWS = 200;
export const MAX_FIRST_SEEN_BYTES = 15000;

/**
 * Serialise first-seen dates for as many rows as fit the byte budget, in
 * sorted order, for the hidden persistence block.
 * @param {Array<object>} withDates Rows carrying firstSeen dates.
 * @param {number} maxBytes Payload budget (excluding markers).
 * @returns {{json: string|null, kept: number}} Block payload and row count.
 */
export function buildFirstSeenBlock(withDates, maxBytes = MAX_FIRST_SEEN_BYTES) {
  const parts = [];
  let size = 2; // enclosing braces
  for (const row of withDates) {
    const part = `${JSON.stringify(firstSeenKey(row.location, row.label, row.difference))}:${JSON.stringify(row.firstSeen)}`;
    if (size + part.length + 1 > maxBytes) break;
    parts.push(part);
    size += part.length + 1;
  }
  if (parts.length === 0) return { json: null, kept: 0 };
  return { json: `{${parts.join(',')}}`, kept: parts.length };
}

export function renderReport({
  generatedAt,
  canonicalCommit,
  githubRows,
  linearRows,
  allowed,
  skippedRepos,
  org,
  firstSeen,
  uncountedRows = 0,
  maxTableRows = MAX_TABLE_ROWS,
  maxFirstSeenBytes = MAX_FIRST_SEEN_BYTES,
  privateSummary = null,
}) {
  const today = generatedAt.slice(0, 10);
  const rows = [...githubRows, ...linearRows].sort((a, b) =>
    firstSeenKey(a.location, a.label, a.difference).localeCompare(
      firstSeenKey(b.location, b.label, b.difference)
    )
  );
  const withDates = rows.map((row) => ({
    ...row,
    firstSeen: firstSeen.get(firstSeenKey(row.location, row.label, row.difference)) ?? today,
  }));
  const persisted = buildFirstSeenBlock(withDates, maxFirstSeenBytes);
  const lines = [
    '## Summary',
    '',
    withDates.length + (privateSummary?.differences ?? 0) === 0
      ? 'No drift.'
      : `${withDates.length + (privateSummary?.differences ?? 0)} difference(s) across GitHub and Linear.`,
    '',
    '## GitHub repositories',
    '',
    '| Location | Label | Difference | First seen | Items |',
    '| --- | --- | --- | --- | --- |',
  ];
  const githubOnly = withDates.filter((row) => !row.location.startsWith('Linear ('));
  if (githubOnly.length === 0) lines.push('| — | — | — | — | — |');
  for (const row of githubOnly.slice(0, maxTableRows)) {
    lines.push(
      `| ${escapeCell(row.location)} | ${escapeCell(row.label)} | ${row.difference} | ${row.firstSeen} | ${row.items ?? ''} |`
    );
  }
  if (githubOnly.length > maxTableRows) {
    lines.push(
      `| … | _Showing ${maxTableRows} of ${githubOnly.length}; see the run artifact for all rows._ | | | |`
    );
  }
  if (privateSummary) {
    // This repository is public. A private repository is counted, never named,
    // and its labels are not listed (decision of 2026-10-04).
    lines.push('', '## Private repositories', '', renderPrivateSummary(privateSummary));
  }
  lines.push(
    '',
    '## Linear',
    '',
    '| Location | Label | Difference | First seen | Items |',
    '| --- | --- | --- | --- | --- |'
  );
  const linearOnly = withDates.filter((row) => row.location.startsWith('Linear ('));
  if (linearOnly.length === 0) lines.push('| — | — | — | — | — |');
  for (const row of linearOnly.slice(0, maxTableRows)) {
    lines.push(
      `| ${escapeCell(row.location)} | ${escapeCell(row.label)} | ${row.difference} | ${row.firstSeen} | ${row.items ?? ''} |`
    );
  }
  if (linearOnly.length > maxTableRows) {
    lines.push(
      `| … | _Showing ${maxTableRows} of ${linearOnly.length}; see the run artifact for all rows._ | | | |`
    );
  }
  lines.push('', '## Allowed exceptions', '');
  if (allowed.length === 0) {
    lines.push('None.');
  } else {
    lines.push('| Location | Label | Items |', '| --- | --- | --- |');
    for (const label of allowed) {
      lines.push(
        `| ${escapeCell(label.location)} | ${escapeCell(label.name)} | ${label.issue_count} |`
      );
    }
  }
  lines.push(
    '',
    '## Run details',
    '',
    `- Generated at: ${generatedAt}`,
    `- Organisation: ${org}`,
    `- Approved set: .github/labels.yml at ${canonicalCommit}`,
    `- GitHub differences: ${githubRows.length}`,
    ...(privateSummary
      ? [`- Private repository differences (names withheld): ${privateSummary.differences}`]
      : []),
    `- Linear differences: ${linearRows.length}`,
    `- Allowed team-scoped exceptions: ${allowed.length}`,
    uncountedRows === 0
      ? '- Rows without issue counts: none'
      : `- Rows without issue counts: ${uncountedRows} (count cap ${MAX_COUNTED_ROWS}; see the JSON artifact)`,
    `- First-seen dates persisted: ${persisted.kept} of ${withDates.length} rows`,
    skippedRepos.length === 0
      ? '- Skipped repositories: none'
      : `- Skipped repositories (archived/fork, out of scope per FR-016): ${skippedRepos.join(', ')}`
  );
  if (persisted.json !== null) {
    lines.push('', '<!-- drift-first-seen', persisted.json, '-->');
  }
  return lines.join('\n');
}

/**
 * Counts for the private repositories, safe for a public report: no name and no
 * label appears in it.
 * @param {Array<object>} privateRepos Private inventory entries.
 * @param {Array<object>} privateRows Drift rows for those repositories.
 * @returns {{checked: number, withDifferences: number, differences: number, byKind: Record<string, number>}}
 */
export function summarisePrivate(privateRepos, privateRows) {
  const byKind = {};
  for (const row of privateRows) byKind[row.difference] = (byKind[row.difference] ?? 0) + 1;
  return {
    checked: privateRepos.length,
    withDifferences: new Set(privateRows.map((row) => row.location)).size,
    differences: privateRows.length,
    byKind,
  };
}

/**
 * The paragraph for the public report.
 * @param {ReturnType<typeof summarisePrivate>} summary
 * @returns {string}
 */
export function renderPrivateSummary(summary) {
  const kinds = Object.entries(summary.byKind)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([kind, count]) => `${count} ${kind}`)
    .join(', ');
  return [
    `${summary.checked} private repositories were checked. Their names and labels are withheld from this public repository.`,
    summary.differences === 0
      ? 'None of them has drift.'
      : `${summary.withDifferences} of them have drift: ${summary.differences} difference(s) (${kinds}). The detail is in the private report, when one is configured.`,
  ].join('\n\n');
}

/**
 * The report for a private repository, which names the repositories and so must
 * only ever be written to a private repository.
 * @param {object} options
 * @returns {string}
 */
export function renderPrivateReport({ generatedAt, canonicalCommit, rows, org, maxRows = 400 }) {
  const sorted = sortRows(rows);
  const lines = [
    '## Summary',
    '',
    sorted.length === 0
      ? 'No drift in private repositories.'
      : `${sorted.length} difference(s) across ${org}'s private repositories.`,
    '',
    '## Private repositories',
    '',
    '| Location | Label | Difference | Items |',
    '| --- | --- | --- | --- |',
  ];
  if (sorted.length === 0) lines.push('| — | — | — | — |');
  for (const row of sorted.slice(0, maxRows)) {
    lines.push(
      `| ${escapeCell(row.location)} | ${escapeCell(row.label)} | ${row.difference} | ${row.items ?? ''} |`
    );
  }
  if (sorted.length > maxRows) {
    lines.push(`| … | _Showing ${maxRows} of ${sorted.length}._ | | |`);
  }
  lines.push(
    '',
    '## Run details',
    '',
    `- Generated at: ${generatedAt}`,
    `- Organisation: ${org}`,
    `- Approved set: .github/labels.yml at ${canonicalCommit}`
  );
  return lines.join('\n');
}

function sortRows(rows) {
  return [...rows].sort((a, b) =>
    firstSeenKey(a.location, a.label, a.difference).localeCompare(
      firstSeenKey(b.location, b.label, b.difference)
    )
  );
}

/**
 * Maximum GitHub rows enriched with issue/PR counts per run. Search is
 * rate-limited and paced, so an unbounded pre-consolidation drift set could
 * outlast the job timeout and produce no report at all. Rows past the cap
 * keep an empty Items cell and are disclosed in Run details; the JSON
 * artifact records which rows lack counts.
 */
export const MAX_COUNTED_ROWS = 300;

const SEARCH_PACING_MS = 2200;

/**
 * Find the open drift report issue by exact title.
 * @returns {Promise<object|null>} Issue or null.
 */
export async function findDriftIssue(client, owner, repo, title = DRIFT_ISSUE_TITLE) {
  const { data } = await client.rest.search.issuesAndPullRequests({
    q: `repo:${owner}/${repo} "${title}" in:title type:issue state:open`,
    per_page: 10,
  });
  return data.items.find((item) => item.title === title) ?? null;
}

/**
 * Refuse to name private repositories anywhere that is not private. The private
 * report is only written to a repository this call has confirmed is private.
 * @param {object} client Octokit-style client with read access to the repository.
 * @param {string} owner Repository owner.
 * @param {string} repo Repository name.
 * @returns {Promise<void>}
 */
export async function assertPrivateRepository(client, owner, repo) {
  const { data } = await client.rest.repos.get({ owner, repo });
  if (data.private !== true) {
    throw new Error(
      'PRIVATE_REPORT_REPO is not a private repository, so the private report is not written: it names private repositories'
    );
  }
}

/**
 * Create the report issue or update its body in place (never a new issue
 * per run). Only the report issue is written; labels are never touched.
 * Lookup runs on the read client; the create/update runs on the
 * report-scoped write client, so a read-only run cannot write at all.
 */
export async function upsertDriftIssue(
  readClient,
  writeClient,
  owner,
  repo,
  body,
  title = DRIFT_ISSUE_TITLE
) {
  const existing = await findDriftIssue(readClient, owner, repo, title);
  if (!existing) {
    const { data } = await writeClient.rest.issues.create({
      owner,
      repo,
      title,
      body,
      labels: DRIFT_ISSUE_LABELS,
    });
    return { issue: data, created: true };
  }
  const { data } = await writeClient.rest.issues.update({
    owner,
    repo,
    issue_number: existing.number,
    body,
  });
  return { issue: data, created: false };
}

/**
 * Enrich GitHub drift rows with issue/PR counts, paced for the search rate
 * limit. `missing` rows carry no items; rows past MAX_COUNTED_ROWS keep an
 * empty Items cell so a huge pre-consolidation drift set cannot outlast the
 * job timeout.
 * @param {object} client Octokit-style client.
 * @param {Array<object>} rows Drift rows (mutated in place).
 * @param {object} [options] Overrides: maxRows, paceMs.
 * @returns {Promise<{counted: number, uncounted: number}>}
 */
export async function enrichGithubRows(client, rows, options = {}) {
  const maxRows = options.maxRows ?? MAX_COUNTED_ROWS;
  const paceMs = options.paceMs ?? SEARCH_PACING_MS;
  let counted = 0;
  let uncounted = 0;
  for (const row of sortRows(rows)) {
    if (row.difference === 'missing') {
      row.items = '';
    } else if (counted >= maxRows) {
      row.items = '';
      uncounted += 1;
    } else {
      row.items = await countGithubItems(client, row.location, row.label);
      counted += 1;
      await new Promise((resolve) => setTimeout(resolve, paceMs));
    }
  }
  return { counted, uncounted };
}

/**
 * Actions workflow commands that mask every private repository name in the log.
 * `add-mask` only covers the log, so it is a backstop and not the control: the
 * control is that no name is ever written to the issue, the artifact or the log.
 * @param {object} inventory Result of buildInventory.
 * @param {Record<string, string|undefined>} [env] Environment.
 * @returns {string[]} Lines to print, empty outside GitHub Actions.
 */
export function maskCommands(inventory, env = process.env) {
  if (env.GITHUB_ACTIONS !== 'true') return [];
  const lines = [];
  for (const repo of inventory.repositories) {
    if (!repo.private) continue;
    lines.push(`::add-mask::${repo.repository}`);
    const bare = repo.repository.split('/').pop();
    if (bare) lines.push(`::add-mask::${bare}`);
  }
  return lines;
}

/**
 * The private report target, when one is configured.
 * @param {Record<string, string|undefined>} env Environment.
 * @param {(options: object) => object} [makeClient] Builds an Octokit-style client.
 * @returns {Promise<{client: object, owner: string, repo: string}|null>} Null when
 *   PRIVATE_REPORT_REPO is not set.
 */
export async function resolvePrivateSink(env, makeClient = null) {
  const target = env.PRIVATE_REPORT_REPO;
  if (!target) return null;
  const [owner, repo] = target.split('/');
  if (!owner || !repo) {
    throw new Error('PRIVATE_REPORT_REPO must be owner/repository');
  }
  const token = env.PRIVATE_REPORT_TOKEN;
  if (!token) {
    throw new Error(
      'PRIVATE_REPORT_TOKEN is required when PRIVATE_REPORT_REPO is set (issues write on that private repository only)'
    );
  }
  const client = makeClient
    ? makeClient({ auth: token })
    : new (await import('octokit')).Octokit({ auth: token });
  await assertPrivateRepository(client, owner, repo);
  return { client, owner, repo };
}

function parseArgs(argv) {
  const args = {
    org: 'lightspeedwp',
    repo: 'lightspeedwp/.github',
    output: DEFAULT_OUTPUT,
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--org') args.org = argv[(i += 1)];
    else if (argv[i] === '--repo') args.repo = argv[(i += 1)];
    else if (argv[i] === '--output') args.output = argv[(i += 1)];
    else if (argv[i] === '--dry-run') args.dryRun = true;
  }
  return args;
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      'GITHUB_TOKEN environment variable is required: pass the organisation-wide GitHub App installation token (manual step T071a, FR-018).'
    );
  }
  const writeToken = process.env.GITHUB_WRITE_TOKEN;
  if (!writeToken) {
    throw new Error(
      'GITHUB_WRITE_TOKEN environment variable is required: pass the report-scoped App token (issues write on the report repository only). For local runs it may equal GITHUB_TOKEN.'
    );
  }
  const { Octokit } = await import('octokit');
  const client = new Octokit({ auth: token });
  const writeClient = new Octokit({ auth: writeToken });
  const { org, repo, output, dryRun } = parseArgs(process.argv.slice(2));
  const [owner, repoName] = repo.split('/');
  const generatedAt = new Date().toISOString();

  const canonical = await loadCanonicalLabels(path.join(process.cwd(), '.github', 'labels.yml'));
  const inventory = await buildInventory(client, org);
  // Defence in depth for the Actions log: the names below are never printed, but
  // registering them as masks means an accidental print is replaced by asterisks.
  for (const line of maskCommands(inventory)) console.log(line);
  const incomplete = incompleteRepositoryLabels(inventory);
  if (incomplete.length > 0) {
    throw new Error(`Incomplete GitHub pagination for: ${incomplete.join(', ')}`);
  }
  // This repository is public, so a private repository is never named in the
  // issue, the artifact or the log (decision of 2026-10-04). It is still checked.
  const publicSkipped = inventory.repositories
    .filter((r) => !r.private && (r.archived || r.fork))
    .map((r) => r.repository);
  const activeRepos = inventory.repositories.filter((r) => !r.archived && !r.fork);
  const activePublic = activeRepos.filter((r) => !r.private);
  const activePrivate = activeRepos.filter((r) => r.private);

  const linear = await buildLinearInventory();
  const githubRows = [];
  for (const repoEntry of activePublic) {
    githubRows.push(...diffGithubRepo(repoEntry, canonical));
  }
  const privateRows = [];
  for (const repoEntry of activePrivate) {
    privateRows.push(...diffGithubRepo(repoEntry, canonical));
  }
  const { rows: linearRows, allowed } = diffLinearLabels(linear.labels, canonical);

  // Where the private detail goes, if anywhere: a private repository, confirmed
  // private before anything is written to it.
  const privateSink = await resolvePrivateSink(process.env);

  // Enrich GitHub rows with issue/PR counts, paced for the search rate limit.
  const { uncounted: uncountedRows } = await enrichGithubRows(client, githubRows);
  if (privateSink) await enrichGithubRows(client, privateRows);

  let firstSeen = new Map();
  if (!dryRun) {
    const existing = await findDriftIssue(client, owner, repoName);
    if (existing) firstSeen = parseFirstSeen(existing.body);
  }
  const privateSummary = summarisePrivate(activePrivate, privateRows);
  const canonicalCommit = process.env.GITHUB_SHA ?? 'local run';
  const body = renderReport({
    generatedAt,
    canonicalCommit,
    githubRows: sortRows(githubRows),
    linearRows: sortRows(linearRows),
    allowed,
    skippedRepos: publicSkipped,
    org,
    firstSeen,
    uncountedRows,
    privateSummary,
  });

  const report = {
    generated_at: generatedAt,
    organisation: org,
    canonical_labels: canonical.size,
    github_repositories: activePublic.length,
    private_repositories: privateSummary,
    skipped_repositories: publicSkipped,
    linear_labels: linear.labels.length,
    differences: sortRows([...githubRows, ...linearRows]),
    allowed_exceptions: allowed.map((label) => ({
      location: label.location,
      name: label.name,
      issue_count: label.issue_count,
    })),
    markdown: body,
  };
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);

  if (dryRun) {
    console.log(body);
    return;
  }
  const { issue, created } = await upsertDriftIssue(client, writeClient, owner, repoName, body);
  console.log(
    `✅ ${report.differences.length} difference(s), ${allowed.length} allowed exception(s) → ${created ? 'created' : 'updated'} issue #${issue.number}`
  );
  if (privateSink) {
    const privateBody = renderPrivateReport({
      generatedAt,
      canonicalCommit,
      rows: privateRows,
      org,
    });
    const written = await upsertDriftIssue(
      privateSink.client,
      privateSink.client,
      privateSink.owner,
      privateSink.repo,
      privateBody,
      PRIVATE_DRIFT_ISSUE_TITLE
    );
    console.log(
      `✅ private repositories: ${privateSummary.differences} difference(s) → ${written.created ? 'created' : 'updated'} the private report (names withheld here)`
    );
  } else if (privateSummary.differences > 0) {
    console.log(
      `ℹ️ ${privateSummary.differences} private repository difference(s) found; the detail is withheld because PRIVATE_REPORT_REPO is not set`
    );
  }
}

if (process.argv[1] && path.basename(process.argv[1]) === 'label-drift-check.js') {
  main().catch((err) => {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  });
}
