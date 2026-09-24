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

function median(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Aggregate run records into report figures.
 * @param {Array<object>} records Run records (see data-model.md → Run record).
 * @param {{tokensPerRun?: number, pricePerMtok?: number}} [options]
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

function table(rows, headers) {
  const lines = [`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`];
  for (const row of rows) lines.push(`| ${row.join(' | ')} |`);
  return lines.join('\n');
}

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

/** Extract the named file from a zip archive (GitHub artefact archives: stored or deflate). */
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
