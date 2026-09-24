#!/usr/bin/env node
/**
 * Qodo PR-Agent pilot report.
 *
 * Aggregates the `qodo-pr-agent-run-*` artefacts written by
 * .github/workflows/qodo-pr-agent-reusable.yml into a Markdown report:
 * runs per tool, outcomes, durations, the SC-001 "within 10 minutes" rate and an
 * estimated spend.
 *
 * Usage:
 *   GITHUB_TOKEN=<token with actions:read> node scripts/metrics/qodo-pr-agent-report.cjs \
 *     --since 2026-10-01 --out .github/reports/metrics/qodo-pr-agent/ \
 *     [--repo lightspeedwp/.github] [--workflow qodo-pr-agent.yml] \
 *     [--tokens-per-run 20000] [--price-per-mtok 6]
 *
 * Spec: .github/specs/017-qodo-pr-agent-integration/ (FR-021, SC-001, SC-008)
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const SC001_LIMIT_SECONDS = 600;

/**
 * Parse report flags, applying defaults for the repository, workflow and cost estimate.
 * @param {string[]} argv - Flag/value pairs from the command line.
 * @returns {object} Report options, including the required YYYY-MM-DD start date.
 * @throws {Error} If --since is missing or malformed, or a flag is unrecognized.
 */
function parseArgs(argv) {
  const args = {
    repo: 'lightspeedwp/.github',
    workflow: 'qodo-pr-agent.yml',
    tokensPerRun: 20000,
    pricePerMtok: 6,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    switch (key) {
      case '--since':
        args.since = value;
        break;
      case '--out':
        args.out = value;
        break;
      case '--repo':
        args.repo = value;
        break;
      case '--workflow':
        args.workflow = value;
        break;
      case '--tokens-per-run':
        args.tokensPerRun = Number(value);
        break;
      case '--price-per-mtok':
        args.pricePerMtok = Number(value);
        break;
      default:
        throw new Error(`Unknown argument: ${key}`);
    }
    i += 1;
  }
  if (!args.since || !/^\d{4}-\d{2}-\d{2}$/.test(args.since)) {
    throw new Error('--since YYYY-MM-DD is required');
  }
  return args;
}

/**
 * Find the median without changing the input order.
 * @param {number[]} values - Values to include in the median.
 * @returns {number|null} The middle value (or mean of two middle values), or null if empty.
 */
function median(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Count all run records, but use only successful and failed runs for duration and spend.
 * The 10-minute rate covers successful automatic runs with both event and start times.
 * @param {Array<object>} records - Run records (see data-model.md → Run record).
 * @param {{tokensPerRun?: number, pricePerMtok?: number}} [options] - Estimated
 *   tokens per executed run and USD per million tokens; defaults to 20000 and 6.
 * @returns {object} Counts, median duration in seconds, estimated USD spend and
 *   automatic-run rate (null when no runs qualify for the rate).
 */
function aggregate(records, options = {}) {
  const tokensPerRun = options.tokensPerRun ?? 20000;
  const pricePerMtok = options.pricePerMtok ?? 6;
  const byTool = {};
  const outcomes = {};
  const durations = [];
  let automatic = 0;
  let automaticWithinLimit = 0;

  for (const record of records) {
    const tool = record.tool || 'unknown';
    const outcome = record.outcome || 'unknown';
    byTool[tool] = (byTool[tool] || 0) + 1;
    outcomes[outcome] = (outcomes[outcome] || 0) + 1;

    if (outcome === 'success' || outcome === 'failure') {
      durations.push(Number(record.duration_seconds) || 0);
    }

    if (tool === 'auto' && outcome === 'success' && record.event_at && record.started_at) {
      automatic += 1;
      const finished =
        Date.parse(record.started_at) + (Number(record.duration_seconds) || 0) * 1000;
      if ((finished - Date.parse(record.event_at)) / 1000 <= SC001_LIMIT_SECONDS) {
        automaticWithinLimit += 1;
      }
    }
  }

  const executed = (outcomes.success || 0) + (outcomes.failure || 0);
  return {
    total: records.length,
    executed,
    byTool,
    outcomes,
    medianDurationSeconds: median(durations),
    sc001: {
      automatic,
      withinLimit: automaticWithinLimit,
      rate: automatic ? automaticWithinLimit / automatic : null,
    },
    estimatedSpendUsd: (executed * tokensPerRun * pricePerMtok) / 1_000_000,
  };
}

/**
 * Format headers and rows as a Markdown table without escaping cell contents.
 * @param {Array<Array<string|number>>} rows - Cells to display beneath the header.
 * @param {string[]} headers - Column headings.
 * @returns {string} The Markdown table.
 */
function table(rows, headers) {
  const lines = [`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`];
  for (const row of rows) lines.push(`| ${row.join(' | ')} |`);
  return lines.join('\n');
}

/**
 * Render the pilot summary with its reporting period and cost assumptions.
 * @param {object} summary - Figures returned by aggregate.
 * @param {object} meta - Repository, workflow, since/generated dates and cost inputs.
 * @returns {string} The Markdown report, including n/a for unavailable metrics.
 */
function renderReport(summary, meta) {
  const rate = summary.sc001.rate === null ? 'n/a' : `${(summary.sc001.rate * 100).toFixed(1)}%`;
  return `# Qodo PR-Agent pilot report — ${meta.generated}

Repository: \`${meta.repo}\` · Period: ${meta.since} to ${meta.generated} · Source: \`${meta.workflow}\` run-record artefacts

## Runs per tool

${table(
  Object.entries(summary.byTool)
    .sort()
    .map(([tool, count]) => [`\`${tool}\``, count]),
  ['Tool', 'Records']
)}

## Outcomes

${table(
  Object.entries(summary.outcomes)
    .sort()
    .map(([outcome, count]) => [`\`${outcome}\``, count]),
  ['Outcome', 'Count']
)}

- Executed runs (success or failure): **${summary.executed}** of ${summary.total} records
- Median run duration: **${summary.medianDurationSeconds ?? 'n/a'} s**
- SC-001, automatic output within 10 minutes of the PR event: **${rate}** (${summary.sc001.withinLimit} of ${summary.sc001.automatic}; target 95%)

## Estimated spend

**≈ $${summary.estimatedSpendUsd.toFixed(2)}**. This is an estimate: executed runs × ${meta.tokensPerRun} tokens × $${meta.pricePerMtok} per million tokens. Cross-check it against the exact usage of the dedicated \`ANTHROPIC_API_KEY_QODO_PR_AGENT\` key in the Anthropic console.

_Generated by scripts/metrics/qodo-pr-agent-report.cjs._
`;
}

/**
 * Read a named entry from a GitHub artifact zip with stored or deflated data.
 * @param {Buffer} buffer - Archive contents.
 * @param {string} fileName - Exact entry name to read.
 * @returns {string|null} UTF-8 contents, or null if the entry is absent.
 * @throws {Error} If decompression of the matching entry fails.
 */
function readFromZip(buffer, fileName) {
  let offset = 0;
  while (offset + 30 <= buffer.length && buffer.readUInt32LE(offset) === 0x04034b50) {
    const method = buffer.readUInt16LE(offset + 8);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const nameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const name = buffer.toString('utf8', offset + 30, offset + 30 + nameLength);
    const dataStart = offset + 30 + nameLength + extraLength;
    const data = buffer.subarray(dataStart, dataStart + compressedSize);
    if (name === fileName) {
      return method === 0 ? data.toString('utf8') : zlib.inflateRawSync(data).toString('utf8');
    }
    offset = dataStart + compressedSize;
  }
  return null;
}

/**
 * Fetch JSON or a binary artifact from the GitHub API.
 * @param {string} url - API or artifact download URL.
 * @param {string} token - Bearer token for the request.
 * @param {boolean} [raw=false] - Return archive bytes instead of parsed JSON.
 * @returns {Promise<object|Buffer>} Parsed response or archive bytes.
 * @throws {Error} On a non-success response; network and response parsing errors propagate.
 */
async function github(url, token, raw = false) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!response.ok) throw new Error(`GitHub API ${response.status} for ${url}`);
  return raw ? Buffer.from(await response.arrayBuffer()) : response.json();
}

/**
 * Collect records from the first unexpired matching artifact for each workflow run.
 * Searches at most 10 pages of 100 runs since the requested date, skipping runs
 * without a matching artifact or a nonempty run-record file.
 * @param {{repo: string, workflow: string, since: string}} options - Repository,
 *   workflow file name and YYYY-MM-DD lower bound for run creation.
 * @param {string} token - GitHub API bearer token.
 * @returns {Promise<object[]>} Parsed run records.
 * @throws {Error} If a request, archive extraction or record parsing fails.
 */
async function collectRecords({ repo, workflow, since }, token) {
  const api = `https://api.github.com/repos/${repo}`;
  const records = [];
  for (let page = 1; page <= 10; page += 1) {
    const runs = await github(
      `${api}/actions/workflows/${workflow}/runs?created=%3E%3D${since}&per_page=100&page=${page}`,
      token
    );
    for (const run of runs.workflow_runs) {
      const { artifacts } = await github(`${api}/actions/runs/${run.id}/artifacts`, token);
      const artefact = artifacts.find((a) => a.name.startsWith('qodo-pr-agent-run-') && !a.expired);
      if (!artefact) continue;
      const zip = await github(artefact.archive_download_url, token, true);
      const json = readFromZip(zip, 'qodo-pr-agent-run.json');
      if (json) records.push(JSON.parse(json));
    }
    if (runs.workflow_runs.length < 100) break;
  }
  return records;
}

/**
 * Generate the report and write it to --out, the GitHub step summary or stdout.
 * Writes to both destinations when --out and GITHUB_STEP_SUMMARY are set.
 * @returns {Promise<void>} Resolves after the report is written.
 * @throws {Error} If arguments are invalid, GITHUB_TOKEN is absent, or collection
 *   or output fails; the CLI caller reports the error and exits nonzero.
 */
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is required');
  const records = await collectRecords(args, token);
  const summary = aggregate(records, args);
  const generated = new Date().toISOString().slice(0, 10);
  const report = renderReport(summary, { ...args, generated });
  if (args.out) {
    fs.mkdirSync(args.out, { recursive: true });
    const file = path.join(args.out, `pilot-report-${generated}.md`);
    fs.writeFileSync(file, report);
    console.log(`Wrote ${file}`);
  }
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
  if (!args.out && !process.env.GITHUB_STEP_SUMMARY) process.stdout.write(report);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = { aggregate, renderReport, readFromZip, parseArgs };
