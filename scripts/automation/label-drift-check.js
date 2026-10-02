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
 * Authentication (FR-018): GitHub via an organisation-wide App installation
 * token passed as `GITHUB_TOKEN` (manual step T071a), Linear via the
 * read-only `LINEAR_API_KEY` repository secret.
 *
 * Usage:
 *   GITHUB_TOKEN=... LINEAR_API_KEY=... node scripts/automation/label-drift-check.js [--org lightspeedwp] [--repo lightspeedwp/.github] [--output path] [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { buildInventory, incompleteRepositories } from './label-inventory.js';
import { buildLinearInventory } from './linear-label-inventory.js';

export const DRIFT_ISSUE_TITLE = 'Label drift report';
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
  const { default: yaml } = await import('js-yaml');
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
 * @param {Array<object>} linearLabels Inventory records from buildLinearInventory.
 * @param {Map} canonical Approved labels.
 * @returns {{rows: Array<object>, allowed: Array<object>}} Drift rows and allowed exceptions.
 */
export function diffLinearLabels(linearLabels, canonical) {
  const rows = [];
  const allowed = [];
  const seen = new Set();
  for (const label of linearLabels) {
    if (label.retired_at) continue;
    seen.add(label.name);
    const approved = canonical.get(label.name);
    const location = label.scope === 'workspace' ? 'Linear (workspace)' : `Linear (${label.scope})`;
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
    } else if (normaliseColor(label.color) !== approved.color) {
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
  }
  for (const name of canonical.keys()) {
    if (!seen.has(name)) {
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
 * Read "First seen" dates from an existing report body so continuing drift
 * keeps its original date. Keys are location + label + difference.
 * @param {string} body Existing issue body.
 * @returns {Map<string, string>} Key to YYYY-MM-DD date.
 */
export function parseFirstSeen(body) {
  const firstSeen = new Map();
  for (const line of String(body ?? '').split('\n')) {
    const cells = line.split('|').map((cell) => cell.trim());
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
      firstSeen.set(`${location}\0${label}\0${difference}`, seen.slice(0, 10));
    }
  }
  return firstSeen;
}

/**
 * Render the report body per the drift-report contract.
 *
 * Issue bodies are capped by the API, so each table shows at most
 * `maxTableRows` rows; the JSON report artifact always holds every row.
 */
export const MAX_TABLE_ROWS = 200;

export function renderReport({
  generatedAt,
  canonicalCommit,
  githubRows,
  linearRows,
  allowed,
  skippedRepos,
  org,
  firstSeen,
  maxTableRows = MAX_TABLE_ROWS,
}) {
  const today = generatedAt.slice(0, 10);
  const rows = [...githubRows, ...linearRows].sort((a, b) =>
    `${a.location}\0${a.label}\0${a.difference}`.localeCompare(
      `${b.location}\0${b.label}\0${b.difference}`
    )
  );
  const withDates = rows.map((row) => ({
    ...row,
    firstSeen: firstSeen.get(`${row.location}\0${row.label}\0${row.difference}`) ?? today,
  }));
  const lines = [
    '## Summary',
    '',
    withDates.length === 0
      ? 'No drift.'
      : `${withDates.length} difference(s) across GitHub and Linear.`,
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
      `| ${row.location} | ${row.label} | ${row.difference} | ${row.firstSeen} | ${row.items ?? ''} |`
    );
  }
  if (githubOnly.length > maxTableRows) {
    lines.push(
      `| … | _Showing ${maxTableRows} of ${githubOnly.length}; see the run artifact for all rows._ | | | |`
    );
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
      `| ${row.location} | ${row.label} | ${row.difference} | ${row.firstSeen} | ${row.items ?? ''} |`
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
      lines.push(`| ${label.location} | ${label.name} | ${label.issue_count} |`);
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
    `- Linear differences: ${linearRows.length}`,
    `- Allowed team-scoped exceptions: ${allowed.length}`,
    skippedRepos.length === 0
      ? '- Skipped repositories: none'
      : `- Skipped repositories (archived/fork, out of scope per FR-016): ${skippedRepos.join(', ')}`
  );
  return lines.join('\n');
}

function sortRows(rows) {
  return [...rows].sort((a, b) =>
    `${a.location}\0${a.label}\0${a.difference}`.localeCompare(
      `${b.location}\0${b.label}\0${b.difference}`
    )
  );
}

/**
 * Find the open drift report issue by exact title.
 * @returns {Promise<object|null>} Issue or null.
 */
export async function findDriftIssue(client, owner, repo) {
  const { data } = await client.rest.search.issuesAndPullRequests({
    q: `repo:${owner}/${repo} "${DRIFT_ISSUE_TITLE}" in:title type:issue state:open`,
    per_page: 10,
  });
  return data.items.find((item) => item.title === DRIFT_ISSUE_TITLE) ?? null;
}

/**
 * Create the report issue or update its body in place (never a new issue
 * per run). Only the report issue is written; labels are never touched.
 */
export async function upsertDriftIssue(client, owner, repo, body) {
  const existing = await findDriftIssue(client, owner, repo);
  if (!existing) {
    const { data } = await client.rest.issues.create({
      owner,
      repo,
      title: DRIFT_ISSUE_TITLE,
      body,
      labels: DRIFT_ISSUE_LABELS,
    });
    return { issue: data, created: true };
  }
  const { data } = await client.rest.issues.update({
    owner,
    repo,
    issue_number: existing.number,
    body,
  });
  return { issue: data, created: false };
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
  const { Octokit } = await import('octokit');
  const client = new Octokit({ auth: token });
  const { org, repo, output, dryRun } = parseArgs(process.argv.slice(2));
  const [owner, repoName] = repo.split('/');
  const generatedAt = new Date().toISOString();

  const canonical = await loadCanonicalLabels(path.join(process.cwd(), '.github', 'labels.yml'));
  const inventory = await buildInventory(client, org);
  const incomplete = incompleteRepositories(inventory);
  if (incomplete.length > 0) {
    throw new Error(`Incomplete GitHub pagination for: ${incomplete.join(', ')}`);
  }
  const skippedRepos = inventory.repositories
    .filter((r) => r.archived || r.fork)
    .map((r) => r.repository);
  const activeRepos = inventory.repositories.filter((r) => !r.archived && !r.fork);

  const linear = await buildLinearInventory();
  const githubRows = [];
  for (const repoEntry of activeRepos) {
    githubRows.push(...diffGithubRepo(repoEntry, canonical));
  }
  const { rows: linearRows, allowed } = diffLinearLabels(linear.labels, canonical);

  // Enrich GitHub rows with issue/PR counts, paced for the search rate limit.
  for (const row of sortRows(githubRows)) {
    if (row.difference === 'missing') {
      row.items = '';
    } else {
      row.items = await countGithubItems(client, row.location, row.label);
      await new Promise((resolve) => setTimeout(resolve, 2200));
    }
  }

  let firstSeen = new Map();
  if (!dryRun) {
    const existing = await findDriftIssue(client, owner, repoName);
    if (existing) firstSeen = parseFirstSeen(existing.body);
  }
  const body = renderReport({
    generatedAt,
    canonicalCommit: process.env.GITHUB_SHA ?? 'local run',
    githubRows: sortRows(githubRows),
    linearRows: sortRows(linearRows),
    allowed,
    skippedRepos,
    org,
    firstSeen,
  });

  const report = {
    generated_at: generatedAt,
    organisation: org,
    canonical_labels: canonical.size,
    github_repositories: activeRepos.length,
    skipped_repositories: skippedRepos,
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
  const { issue, created } = await upsertDriftIssue(client, owner, repoName, body);
  console.log(
    `✅ ${report.differences.length} difference(s), ${allowed.length} allowed exception(s) → ${created ? 'created' : 'updated'} issue #${issue.number}`
  );
}

if (process.argv[1] && path.basename(process.argv[1]) === 'label-drift-check.js') {
  main().catch((err) => {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  });
}
