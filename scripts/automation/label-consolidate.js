#!/usr/bin/env node
/**
 * Label consolidation for the `lightspeedwp` organisation (spec 008, Stages 3
 * and 4; FR-011, FR-014, FR-016, FR-023).
 *
 * Dry run is the default: the tool reads each repository and writes its
 * `dry-run/{repo}.json` file, and changes nothing on GitHub. `--apply` makes
 * changes and needs `--confirm-gate <issue>`.
 *
 *   Stage 3 (--stage 3 --apply): renames in place, creates and updates labels
 *   from `.github/labels.yml` on `develop`, and adds each mapped target label
 *   to the items that carry a source label.
 *   Stage 4 (--stage 4 --apply): deletes every label outside the approved set,
 *   only in repositories whose dry run @ashleyshaw approved on the gate issue,
 *   and only if the repository still matches that dry run.
 *
 * A private repository keeps its dry run and log under `.private-evidence/` and
 * its gate in the private report repository (`PRIVATE_REPORT_REPO`,
 * `--private-gate-issue`); nothing about it is committed or posted publicly.
 *
 * Usage:
 *   LABEL_CONSOLIDATE_TOKEN=... node scripts/automation/label-consolidate.js --stage 4
 *   node scripts/automation/label-consolidate.js --stage 4 --apply --confirm-gate 1234
 *   node scripts/automation/label-consolidate.js --resume <run_id> --stage 4 --apply --confirm-gate 1234
 *   node scripts/automation/label-consolidate.js --abandon-run <run_id> --confirm-gate 1234
 *   node scripts/automation/label-consolidate.js post-summary --repo NAME --confirm-gate 1234
 *   node scripts/automation/label-consolidate.js record-approval --repo NAME --comment-url URL --confirm-gate 1234
 *   node scripts/automation/label-consolidate.js record --run-id <run_id> --repo NAME --json '{...}' [--op-id ID]
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import YAML from 'yaml';
import { createConsolidationClient } from './includes/consolidation-github.js';
import {
  ConsolidationError,
  approvedSetFrom,
  postSummary,
  recordApproval,
  recordManualStep,
  runStage,
} from './includes/consolidation-engine.js';
import { buildMappingIndex } from './includes/consolidation-plan.js';
import {
  LOCK_FILE_NAME,
  RunLockError,
  abandonRun,
  attachRun,
  resumeRun,
  startRun,
} from './includes/consolidation-run.js';
import { PUBLIC_EVIDENCE_DIR, PrivateEvidenceError } from './includes/private-evidence.js';
import { RunPausedError } from './includes/label-write-queue.js';

const USAGE = [
  'Label consolidation (spec 008, Stages 3 and 4). Dry run by default; --apply changes things and needs --confirm-gate.',
  '',
  '  label-consolidate.js --stage 3|4 [--org lightspeedwp] [--repo a,b]',
  '  label-consolidate.js --stage 3|4 --apply --confirm-gate N [--private-gate-issue N] [--resume RUN_ID]',
  '  label-consolidate.js --abandon-run RUN_ID --confirm-gate N',
  '  label-consolidate.js post-summary --repo NAME --confirm-gate N [--private-gate-issue N]',
  '  label-consolidate.js record-approval --repo NAME --comment-url URL --confirm-gate N [--private-gate-issue N]',
  "  label-consolidate.js record --run-id RUN_ID --repo NAME --json '{...}' [--op-id ID] --confirm-gate N",
  '',
  'Environment: LABEL_CONSOLIDATE_TOKEN, and for private repositories PRIVATE_REPORT_REPO and PRIVATE_REPORT_TOKEN.',
].join('\n');

const OPTIONS = {
  stage: { type: 'string' },
  org: { type: 'string', default: 'lightspeedwp' },
  repo: { type: 'string' },
  apply: { type: 'boolean', default: false },
  'confirm-gate': { type: 'string' },
  'private-gate-issue': { type: 'string' },
  resume: { type: 'string' },
  'abandon-run': { type: 'string' },
  'run-id': { type: 'string' },
  'comment-url': { type: 'string' },
  json: { type: 'string' },
  'op-id': { type: 'string' },
  mapping: { type: 'string' },
  root: { type: 'string' },
  help: { type: 'boolean', short: 'h', default: false },
};

/**
 * Parses an issue number option.
 * @param {string | undefined} value - Option value
 * @param {string} name - Option name, for the message
 * @returns {number | undefined} The number
 */
function issueNumber(value, name) {
  if (value === undefined) {
    return undefined;
  }
  if (!/^[1-9]\d*$/.test(value)) {
    throw new ConsolidationError(`--${name} must be an issue number`);
  }
  return Number(value);
}

/**
 * Reads the commit that last changed `labels.yml` on develop, and its contents.
 * @param {string} root - Checkout root
 * @returns {{ commit: string, entries: object[] }} Approved set source
 */
function readApprovedSet(root) {
  const run = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  const commit = run('log', '-1', '--format=%H', 'origin/develop', '--', '.github/labels.yml');
  if (!commit) {
    throw new ConsolidationError(
      'Cannot find .github/labels.yml on origin/develop; fetch develop first.'
    );
  }
  const entries = YAML.parse(run('show', 'origin/develop:.github/labels.yml'));
  if (!Array.isArray(entries)) {
    throw new ConsolidationError('.github/labels.yml on develop is not a list of labels');
  }
  return { commit, entries };
}

/**
 * Reads the label mapping. A missing file stops the run: planning without it
 * would leave every mapped label with no target, and a label whose items are
 * all closed would then be deleted without moving them.
 * @param {string} file - Path of the mapping file
 * @returns {{ mappings: object[] }} Parsed mapping
 */
export function loadMapping(file) {
  if (!fs.existsSync(file)) {
    throw new ConsolidationError(
      `Label mapping ${file} does not exist; refusing to plan without mappings. Check --mapping, or check out evidence/linear-labels.json.`
    );
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/**
 * Picks the repositories in scope: non-archived and not forks (FR-016).
 * @param {object[]} all - Repositories from the API
 * @param {string | undefined} only - Comma-separated names to keep
 * @returns {{ repos: object[], excluded: object[] }} In scope, and excluded
 */
function chooseRepos(all, only) {
  const wanted = only ? new Set(only.split(',').map((name) => name.trim())) : null;
  const repos = [];
  const excluded = [];
  for (const repo of all) {
    if (repo.archived || repo.fork) {
      excluded.push(repo);
    } else if (!wanted || wanted.has(repo.name)) {
      repos.push(repo);
    }
  }
  if (wanted) {
    const found = new Set(repos.map((repo) => repo.name));
    const missing = [...wanted].filter((name) => !found.has(name));
    if (missing.length > 0) {
      throw new ConsolidationError(
        `Not in scope (missing, archived or a fork): ${missing.join(', ')}`
      );
    }
  }
  return { repos, excluded };
}

/**
 * Prints a short usage message.
 */
function printHelp() {
  console.log(USAGE);
}

/**
 * Entry point.
 * @param {string[]} argv - Arguments after the script name
 * @param {NodeJS.ProcessEnv} env - Environment
 * @param {object} [deps] - Injected for tests
 * @returns {Promise<number>} Exit code
 */
export async function main(argv, env = process.env, deps = {}) {
  const { values, positionals } = parseArgs({
    args: argv,
    options: OPTIONS,
    allowPositionals: true,
  });
  if (values.help) {
    printHelp();
    return 0;
  }
  const command = positionals[0];
  const root = values.root ? path.resolve(values.root) : process.cwd();
  const token = env.LABEL_CONSOLIDATE_TOKEN;
  if (!token) {
    throw new ConsolidationError(
      'Set LABEL_CONSOLIDATE_TOKEN (a token that can read and write labels in the organisation).'
    );
  }
  const makeClient = deps.createClient ?? createConsolidationClient;
  const client = makeClient({ token });
  const privateRepository = env.PRIVATE_REPORT_REPO || undefined;
  const privateClient = env.PRIVATE_REPORT_TOKEN
    ? makeClient({ token: env.PRIVATE_REPORT_TOKEN })
    : undefined;
  const confirmGate = issueNumber(values['confirm-gate'], 'confirm-gate');
  const privateGateIssue = issueNumber(values['private-gate-issue'], 'private-gate-issue');
  const evidenceDir = path.join(root, PUBLIC_EVIDENCE_DIR);
  const publicRepository = `${values.org}/.github`;

  // Every write and every approval check needs the public gate issue.
  const needsGate = values.apply || command || values['abandon-run'];
  if (needsGate && confirmGate === undefined) {
    throw new ConsolidationError('This needs --confirm-gate <gate issue number>.');
  }
  if (confirmGate !== undefined) {
    const gateIssue = await client.getIssue(publicRepository, confirmGate);
    if (!gateIssue || gateIssue.pull_request || gateIssue.state !== 'open') {
      throw new ConsolidationError(
        `#${confirmGate} in ${publicRepository} is not an open issue; it cannot be the gate.`
      );
    }
  }

  if (values['abandon-run']) {
    const comments = await client.listIssueComments(publicRepository, confirmGate);
    const wanted = `Abandon run ${values['abandon-run']}`;
    const confirmed = comments.some(
      (c) => c.user?.login === 'ashleyshaw' && String(c.body).trim() === wanted
    );
    if (!confirmed) {
      throw new ConsolidationError(`@ashleyshaw has not commented "${wanted}" on #${confirmGate}.`);
    }
    const lock = abandonRun({ dir: evidenceDir, runId: values['abandon-run'] });
    console.log(`Abandoned ${lock.run_id}. Its unmatched records stay in the log for review.`);
    return 0;
  }

  const { commit, entries } = readApprovedSet(root);
  const mappingFile = path.resolve(
    root,
    values.mapping ?? path.join(PUBLIC_EVIDENCE_DIR, 'linear-labels.json')
  );
  const mapping = loadMapping(mappingFile);
  const { repos, excluded } = chooseRepos(await client.listRepos(values.org), values.repo);
  const runBy = await client.getViewerLogin();

  const ctx = {
    client,
    privateClient,
    org: values.org,
    root,
    apply: values.apply,
    runBy,
    approved: approvedSetFrom(entries),
    mappingIndex: buildMappingIndex(mapping),
    currentApprovedSetCommit: commit,
    gates: {
      publicRepository,
      publicIssue: confirmGate,
      privateRepository,
      privateIssue: privateGateIssue,
    },
    now: deps.now ?? (() => new Date()),
    done: [],
  };

  if (command === 'post-summary' || command === 'record-approval') {
    const repo = repos.find((r) => r.name === values.repo);
    if (!repo) {
      throw new ConsolidationError(`--repo ${values.repo ?? ''} is not in scope`);
    }
    if (command === 'post-summary') {
      const posted = await postSummary(ctx, repo);
      console.log(`Summary posted on ${posted.repository}#${posted.issue}.`);
      return 0;
    }
    const verdict = await recordApproval(ctx, repo, values['comment-url'] ?? '');
    console.log(verdict.ok ? 'Approval recorded.' : `Approval not recorded: ${verdict.reason}`);
    return verdict.ok ? 0 : 1;
  }

  if (command === 'record') {
    const repo = repos.find((r) => r.name === values.repo);
    if (!repo || !values['run-id'] || !values.json) {
      throw new ConsolidationError('record needs --run-id, --repo and --json');
    }
    ctx.run = attachRun({ dir: evidenceDir, runId: values['run-id'] });
    const id = recordManualStep(ctx, repo, JSON.parse(values.json), values['op-id']);
    console.log(`Recorded ${id}.`);
    return 0;
  }

  if (command) {
    throw new ConsolidationError(`Unknown command ${command}`);
  }
  if (!['3', '4'].includes(values.stage ?? '')) {
    throw new ConsolidationError('--stage must be 3 or 4');
  }
  if (values.apply) {
    ctx.run = values.resume
      ? resumeRun({ dir: evidenceDir, runId: values.resume })
      : startRun({ dir: evidenceDir, runBy, stage: values.stage });
    console.log(`Run ${ctx.run.runId} (epoch ${ctx.run.epoch}) holds ${LOCK_FILE_NAME}.`);
  }
  console.log(
    `${values.apply ? 'APPLY' : 'Dry run'}, Stage ${values.stage}: ${repos.length} repositories in scope; ${excluded.length} archived or forked excluded.`
  );

  let outcomes;
  try {
    outcomes = await runStage(ctx, repos, values.stage);
  } catch (error) {
    if (error instanceof RunPausedError) {
      console.error(`Paused: ${error.message}. Resume with --resume ${ctx.run?.runId}.`);
      return 2;
    }
    if (ctx.run) {
      console.error(
        `Stopped. The lock stays; resume with --resume ${ctx.run.runId} after fixing: ${error.message}`
      );
    }
    throw error;
  }

  for (const outcome of outcomes) {
    console.log(
      `${outcome.repository}: ${outcome.status}${outcome.reason ? ` (${outcome.reason})` : ''}${outcome.changes ? `, ${outcome.changes} changes` : ''}`
    );
  }
  if (ctx.run) {
    const incomplete = outcomes.some((o) => o.status === 'stale' || o.status === 'invalid');
    ctx.run.finish();
    console.log(
      `Run ${ctx.run.runId} finished.${incomplete ? ' Some repositories were skipped as stale; regenerate their dry runs.' : ''}`
    );
  }
  return outcomes.some((o) => o.status === 'invalid') ? 1 : 0;
}

if (process.argv[1] && path.basename(process.argv[1]) === 'label-consolidate.js') {
  main(process.argv.slice(2)).then(
    (code) => {
      process.exitCode = code;
    },
    (error) => {
      const known =
        error instanceof ConsolidationError ||
        error instanceof RunLockError ||
        error instanceof PrivateEvidenceError;
      console.error(known ? `❌ ${error.message}` : error);
      process.exitCode = 1;
    }
  );
}
