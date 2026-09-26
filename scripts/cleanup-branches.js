#!/usr/bin/env node

/**
 * cleanup-branches.js — Identifies stale merged branches for review.
 *
 * Scans local and remote branches, filters out protected/open-PR branches,
 * and reports those that are fully merged and inactive beyond the threshold.
 *
 * Usage:
 *   node scripts/cleanup-branches.js [options]
 *
 * Options:
 *   --dryRun              Preview deletions without executing (default: true)
 *   --dryRun=false        Reserved for the approved draft-PR workflow
 *   --deleteLocal         Include local branch inventory in the preview
 *   --verbose             Enable detailed logging and debug output (default: false)
 *   --inactiveDays=N      Inactivity threshold in days (default: 30)
 *   --excludePatterns=RE  Pipe-separated regex patterns to preserve (e.g. "release/.*|hotfix/.*")
 *   --preserveAuthors=RE  Pipe-separated author patterns to preserve (e.g. "dependabot|renovate")
 *   --reportFormat=TYPE   Output format: markdown or json (default: markdown)
 *   --reportDir=PATH      Directory to write report (default: .github/reports)
 *
 * @module scripts/cleanup-branches
 */

import { execFileSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { categorizeBranch } from './lib/branch-categorization.js';
import { REASON_CODES } from './lib/constants.js';
import { getBaseRef, getUniqueCommitCount } from './lib/git-merge-utils.js';
import { getOpenPRs } from './lib/github-pr-utils.js';

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

function logTimestamp() {
  return new Date().toISOString().split('T')[1].split('.')[0];
}

function log(level, message) {
  const timestamp = logTimestamp();
  const prefix =
    level === 'error' ? '❌' : level === 'warn' ? '⚠️ ' : level === 'debug' ? '🔍' : 'ℹ️ ';
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

function logError(message, error) {
  log('error', message);
  if (error && opts.verbose) {
    console.error(`    ${error.message || error}`);
  }
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

/**
 * Read the first matching CLI option, accepting --name or --name=value.
 * A bare option yields "true"; an absent option yields the supplied default.
 *
 * @param {string} name - Option name without leading dashes.
 * @param {string} defaultValue - Value when the option is absent.
 * @returns {string} Option value.
 */
function getArg(name, defaultValue) {
  const longFlag = `--${name}=`;
  const boolFlag = `--${name}`;

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith(longFlag)) {
      return arg.slice(longFlag.length);
    }
    if (arg === boolFlag) {
      return 'true';
    }
  }
  return defaultValue;
}

/**
 * Accept only the strings "true" and "false" as Boolean options.
 * Other values use the supplied default.
 *
 * @param {string} value - CLI option value.
 * @param {boolean} defaultValue - Fallback for unrecognized values.
 * @returns {boolean} Parsed option.
 */
function parseBool(value, defaultValue = true) {
  if (value === 'false') return false;
  if (value === 'true') return true;
  return defaultValue;
}

const opts = {
  dryRun: parseBool(getArg('dryRun', 'true'), true),
  deleteLocal: parseBool(getArg('deleteLocal', 'false'), false),
  verbose: parseBool(getArg('verbose', 'false'), false),
  inactiveDays: parseInt(getArg('inactiveDays', '30'), 10),
  excludePatterns: getArg('excludePatterns', ''),
  preserveAuthors: getArg('preserveAuthors', ''),
  reportFormat: getArg('reportFormat', 'markdown'),
  reportDir: getArg('reportDir', '.github/reports'),
};

if (Number.isNaN(opts.inactiveDays) || opts.inactiveDays < 0) {
  logError('Invalid --inactiveDays value; defaulting to 30.');
  opts.inactiveDays = 30;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_EXCLUDE_PATTERN = /^(release\/|hotfix\/)/;

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const AVG_STORAGE_BYTES_PER_COMMIT = 4096;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Run Git with separate arguments and return trimmed stdout.
 * Git failures yield an empty string rather than reaching the caller.
 *
 * @param {string[]} args - Git arguments.
 * @returns {string} Git output or an empty string.
 */
function run(args) {
  try {
    return execFileSync('git', args, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return '';
  }
}

/**
 * Split Git output into nonempty trimmed lines; Git failures yield [].
 *
 * @param {string[]} args - Git arguments.
 * @returns {string[]} Output lines.
 */
function runLines(args) {
  return run(args)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function toPct(numerator, denominator) {
  if (denominator === 0) return '0.00%';
  return `${((numerator / denominator) * 100).toFixed(2)}%`;
}

/**
 * Choose a run exit code based on recorded errors and processed branches.
 *
 * @param {number} processedBranches - Number of branches processed.
 * @param {object[]} errors - Recorded branch errors.
 * @returns {number} Zero for no errors, two for partial failure, or one for fatal failure.
 */
function getRunExitCode(processedBranches, errors) {
  if (errors.length === 0) return 0;
  return processedBranches > 0 ? 2 : 1;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function branchTypeOf(branch) {
  if (branch.includes('/')) {
    return branch.split('/')[0];
  }
  return 'other';
}

function estimateStorageFreedBytes(commitCount) {
  return commitCount * AVG_STORAGE_BYTES_PER_COMMIT;
}

function daysSince(isoDate) {
  if (!isoDate) return 0;
  const then = new Date(isoDate);
  if (isNaN(then.getTime())) return 0;
  return (Date.now() - then.getTime()) / MS_PER_DAY;
}

/**
 * Build a branch-name exclusion regex with release/hotfix defaults.
 * Pipe-separated user patterns are added as alternatives; invalid regexes
 * warn and fall back to the default regex.
 *
 * @returns {RegExp} Exclusion pattern.
 */
function buildExcludeRegex() {
  const parts = [DEFAULT_EXCLUDE_PATTERN.source];
  if (opts.excludePatterns) {
    parts.push(
      ...opts.excludePatterns
        .split('|')
        .map((p) => p.trim())
        .filter(Boolean)
    );
  }

  const source = `(${parts.join('|')})`;
  try {
    return new RegExp(source);
  } catch (err) {
    console.warn(`⚠️  Invalid --excludePatterns regex; falling back to defaults: ${err.message}`);
    return DEFAULT_EXCLUDE_PATTERN;
  }
}

/**
 * Build a regex from pipe-separated author preservation patterns.
 * Empty input or invalid regexes disable author preservation; invalid
 * patterns also produce a warning.
 *
 * @returns {RegExp|null} Author pattern, or null when unavailable.
 */
function buildPreserveAuthorRegex() {
  if (!opts.preserveAuthors) return null;
  const parts = opts.preserveAuthors
    .split('|')
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) return null;

  const source = `(${parts.join('|')})`;
  try {
    return new RegExp(source);
  } catch (err) {
    console.warn(
      `⚠️  Invalid --preserveAuthors regex; disabling author preservation: ${err.message}`
    );
    return null;
  }
}

// ---------------------------------------------------------------------------
// Branch discovery
// ---------------------------------------------------------------------------

/**
 * Return the names of origin's remote-tracking branches, without "origin/".
 * Failed Git commands yield an empty list.
 *
 * @returns {string[]} Remote branch names.
 */
function getRemoteBranches() {
  return runLines(['for-each-ref', 'refs/remotes/origin', '--format=%(refname:short)']).map((b) =>
    b.replace(/^origin\//, '')
  );
}

/**
 * Return local branch names; failed Git commands yield an empty list.
 *
 * @returns {string[]} Local branch names.
 */
function getLocalBranches() {
  return runLines(['for-each-ref', 'refs/heads', '--format=%(refname:short)']);
}

/**
 * Check whether origin/develop or origin/main contains an origin branch.
 * A failed Git query for either base is treated as not merged for that base.
 *
 * @param {string} branch - Branch name without origin/.
 * @returns {boolean} Whether either base contains the branch.
 */
function isMerged(branch) {
  const branchRef = `origin/${branch}`;

  const developMerged = runLines(['branch', '-r', '--merged', 'origin/develop']);
  if (developMerged.includes(branchRef)) return true;

  const mainMerged = runLines(['branch', '-r', '--merged', 'origin/main']);
  if (mainMerged.includes(branchRef)) return true;

  return false;
}

function getLastCommitDate(branch) {
  return run(['log', '-1', '--format=%cI', `origin/${branch}`]) || '';
}

function getLastCommitAuthor(branch) {
  return run(['log', '-1', '--format=%ae', `origin/${branch}`]) || '';
}

function getLastCommitHash(branch) {
  return run(['log', '-1', '--format=%H', `origin/${branch}`]) || '';
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

/**
 * Create the report directory if absent, including missing parents.
 * Filesystem errors propagate to the caller.
 *
 * @param {string} reportDir - Output directory, defaulting to the CLI option.
 * @throws {Error} If the directory cannot be created.
 */
function ensureReportDir(reportDir = opts.reportDir) {
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
}

/**
 * Aggregate report counts, author names, commit totals, and storage estimates.
 * Entries in "deleted" are counted as successful even during a dry run;
 * errors are counted separately and per-record estimated storage is summed.
 *
 * @param {object[]} deleted - Deletion candidates recorded by the caller.
 * @param {object[]} preserved - Branches not selected for deletion.
 * @param {object[]} errors - Recorded branch errors.
 * @param {number} candidatesCount - Count of deletion candidates.
 * @returns {object} Summary metrics, including formatted size and percentage.
 */
function getMetrics(deleted, preserved, errors, candidatesCount) {
  const byType = {};
  const authorSet = new Set();
  let totalCommits = 0;
  let estimatedStorageBytes = 0;

  for (const b of deleted) {
    const type = b.type || branchTypeOf(b.branch);
    byType[type] = (byType[type] || 0) + 1;
    if (b.author) authorSet.add(b.author);
    totalCommits += b.commitCount || 0;
    estimatedStorageBytes += b.estimatedStorageBytes || 0;
  }

  const successfulDeletes = deleted.length;
  const failedDeletes = errors.length;
  const successRate = toPct(successfulDeletes, successfulDeletes + failedDeletes);
  const preservedDeletedRatio = deleted.length
    ? `${preserved.length}:${deleted.length}`
    : `${preserved.length}:0`;

  return {
    candidatesCount,
    successfulDeletes,
    failedDeletes,
    successRate,
    preservedDeletedRatio,
    byType,
    totalCommits,
    estimatedStorageBytes,
    estimatedStorageHuman: formatBytes(estimatedStorageBytes),
    authorsAffected: Array.from(authorSet).sort(),
  };
}

/**
 * Write a timestamped Markdown branch report to the requested directory.
 * Includes candidate, preservation, error, and rollback sections; the
 * "deleted" records are reported as deletions even in a dry run.
 * Filesystem errors propagate to the caller.
 *
 * @param {object[]} deleted - Candidate branch records.
 * @param {object[]} preserved - KEEP and DISCUSS branch records.
 * @param {object[]} errors - Recorded branch errors.
 * @param {object} metrics - Summary from getMetrics.
 * @param {object} reportOptions - Output directory, run mode, and age threshold.
 * @returns {string} Path to the written Markdown file.
 * @throws {Error} If the directory or file cannot be written.
 */
function writeMarkdownReport(deleted, preserved, errors, metrics, reportOptions = opts) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filePath = path.join(reportOptions.reportDir, `branch-cleanup-${timestamp}.md`);

  const lines = [
    `# Branch Cleanup Report`,
    ``,
    `**Date:** ${new Date().toISOString()}`,
    `**Mode:** ${reportOptions.dryRun ? 'Dry run (no deletions)' : 'Approval workflow'}`,
    `**Threshold:** ${reportOptions.inactiveDays} days inactive`,
    ``,
    `## Summary`,
    ``,
    `| Metric | Value |`,
    `| --- | --- |`,
    `| Branches considered for deletion | ${metrics.candidatesCount} |`,
    `| Auto-approved deletions (empty agent-session branches) | ${deleted.filter((b) => b.autoApproved).length} |`,
    `| Branches deleted | ${deleted.length} |`,
    `| Branches preserved | ${preserved.length} |`,
    `| Errors | ${errors.length} |`,
    `| Deletion success rate | ${metrics.successRate} |`,
    `| Preserved:Deleted ratio | ${metrics.preservedDeletedRatio} |`,
    `| Total commits removed (estimate) | ${metrics.totalCommits} |`,
    `| Estimated storage freed | ${metrics.estimatedStorageHuman} |`,
    ``,
  ];

  lines.push(`## Metrics`, ``);
  lines.push(`### Branches deleted by type`, ``);
  if (Object.keys(metrics.byType).length === 0) {
    lines.push(`- None`, ``);
  } else {
    for (const [type, count] of Object.entries(metrics.byType).sort()) {
      lines.push(`- **${type}**: ${count}`);
    }
    lines.push('');
  }

  lines.push(`### Authors affected (notification list)`, ``);
  if (metrics.authorsAffected.length === 0) {
    lines.push(`- None`, ``);
  } else {
    for (const author of metrics.authorsAffected) {
      lines.push(`- ${author}`);
    }
    lines.push('');
  }

  if (deleted.length) {
    lines.push(`## Deleted Branches`, ``);
    for (const b of deleted) {
      lines.push(
        `### \`${b.branch}\``,
        `- **Author:** ${b.author}`,
        `- **Last commit:** ${b.lastCommitDate}`,
        `- **Age:** ${b.age} days`,
        `- **Hash:** \`${b.hash}\``,
        `- **Type:** ${b.type || branchTypeOf(b.branch)}`,
        `- **Commits removed (estimate):** ${b.commitCount || 0}`,
        `- **Storage freed (estimate):** ${formatBytes(b.estimatedStorageBytes || 0)}`,
        `- **Reason:** ${b.reason}`,
        `- **Local deleted:** ${b.localDeleted ? 'Yes' : 'No'}`,
        ``
      );
    }
  }

  const kept = preserved.filter((branch) => branch.category !== 'DISCUSS');
  const discuss = preserved.filter((branch) => branch.category === 'DISCUSS');

  if (kept.length) {
    lines.push(`## KEEP Branches`, ``);
    for (const branch of kept) {
      lines.push(`- \`${branch.branch}\` — ${branch.reason}`);
    }
    lines.push(``);
  }

  if (discuss.length) {
    lines.push(`## DISCUSS Branches`, ``);
    for (const branch of discuss) {
      lines.push(`- \`${branch.branch}\` — ${branch.reason}`);
    }
    lines.push(``);
  }

  if (errors.length) {
    lines.push(`## Errors`, ``);
    for (const e of errors) {
      lines.push(`- \`${e.branch}\`: ${e.error}`);
    }
    lines.push(``);
  }

  lines.push(
    `## Rollback`,
    ``,
    `To restore a deleted branch from Git history:`,
    ``,
    '```bash',
    `git branch <branch-name> <commit-hash>`,
    `git push origin <branch-name>`,
    '```',
    ``,
    `> Hashes for deleted branches are listed in the Deleted Branches section above.`
  );

  const content = lines.join('\n');
  ensureReportDir(reportOptions.reportDir);
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

/**
 * Write a timestamped JSON branch report to the requested directory.
 * Preserved branches default to KEEP when their category is missing.
 * Filesystem and JSON serialization errors propagate to the caller.
 *
 * @param {object[]} deleted - Candidate branch records.
 * @param {object[]} preserved - Branch records not selected for deletion.
 * @param {object[]} errors - Recorded branch errors.
 * @param {object} metrics - Summary from getMetrics.
 * @param {object} reportOptions - Output directory, run mode, and age threshold.
 * @returns {string} Path to the written JSON file.
 * @throws {Error} If the report cannot be serialized or written.
 */
function writeJsonReport(deleted, preserved, errors, metrics, reportOptions = opts) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filePath = path.join(reportOptions.reportDir, `branch-cleanup-${timestamp}.json`);
  const report = {
    timestamp: new Date().toISOString(),
    dryRun: reportOptions.dryRun,
    inactiveDays: reportOptions.inactiveDays,
    summary: {
      candidates: metrics.candidatesCount,
      autoApprovedDelete: deleted.filter((b) => b.autoApproved).length,
      deleted: deleted.length,
      preserved: preserved.length,
      errors: errors.length,
      deletionSuccessRate: metrics.successRate,
      preservedDeletedRatio: metrics.preservedDeletedRatio,
      totalCommitsRemoved: metrics.totalCommits,
      estimatedStorageFreedBytes: metrics.estimatedStorageBytes,
      estimatedStorageFreedHuman: metrics.estimatedStorageHuman,
    },
    metrics: {
      deletedByType: metrics.byType,
      authorsAffected: metrics.authorsAffected,
    },
    deleted,
    preserved: preserved.map((p) => ({
      branch: p.branch,
      category: p.category || 'KEEP',
      reason: p.reason,
    })),
    errors,
  };
  ensureReportDir(reportOptions.reportDir);
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf8');
  return filePath;
}

// ---------------------------------------------------------------------------
// Pre-flight validation
// ---------------------------------------------------------------------------

/**
 * Require a Git checkout with a configured origin remote.
 *
 * @throws {Error} If the current directory is not in a Git repository or lacks origin.
 */
function validateEnvironment() {
  // Check if we're in a git repository
  const gitDirResult = spawnSync('git', ['rev-parse', '--git-dir'], {
    encoding: 'utf8',
  });
  if (gitDirResult.status !== 0) {
    throw new Error('Not a git repository. Run this script from a git repo.');
  }

  // Check if origin remote exists
  const remoteResult = spawnSync('git', ['remote', 'get-url', 'origin'], {
    encoding: 'utf8',
  });
  if (remoteResult.status !== 0 || !remoteResult.stdout.trim()) {
    throw new Error('No "origin" remote found. Ensure the repository has an origin remote.');
  }

  if (opts.verbose) {
    log('debug', `Git directory: ${gitDirResult.stdout.trim()}`);
    log('debug', 'Origin remote is configured');
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

/**
 * Preview remote branch classifications and write a Markdown or JSON report.
 * Fetches and prunes origin; never deletes branches, even when --dryRun=false
 * is requested. Unverified open PR status changes DELETE candidates to
 * DISCUSS; failed fetches, environment checks, and report writes exit with
 * status one.
 *
 * @returns {Promise<void>} The run exits the process with a status code.
 */
async function main() {
  try {
    console.log('🌿 Branch Cleanup Script');
    console.log('========================');
    console.log(
      `Mode:         ${opts.dryRun ? 'Dry run (preview only)' : 'Approval workflow required'}`
    );
    console.log(`Threshold:    ${opts.inactiveDays} days inactive`);
    console.log(`Delete local: ${opts.deleteLocal}`);
    if (opts.excludePatterns) console.log(`Exclude:      ${opts.excludePatterns}`);
    if (opts.preserveAuthors) console.log(`Preserve:     ${opts.preserveAuthors}`);
    console.log('');

    if (!opts.dryRun) {
      throw new Error(
        'Direct deletion is disabled. Use the draft-PR approval workflow; branches may be deleted only after human approval and merge.'
      );
    }

    // Pre-flight validation
    if (opts.verbose) log('debug', 'Validating environment...');
    validateEnvironment();

    // Fetch latest remote state
    log('debug', 'Fetching remote branch list...');
    const fetchResult = spawnSync('git', ['fetch', '--prune', 'origin'], {
      encoding: 'utf8',
    });
    if (fetchResult.status !== 0) {
      logError('Failed to fetch remote branches', fetchResult.stderr);
      if (!opts.verbose) {
        console.error('  Run with --verbose for details');
      }
      process.exit(1);
    }

    const remoteBranches = getRemoteBranches().filter((b) => b !== 'HEAD' && b.trim() !== '');
    const localBranches = opts.deleteLocal ? getLocalBranches() : [];
    const detectedOpenPRs = getOpenPRs();
    const prVerificationAvailable = detectedOpenPRs instanceof Set;
    const openPRBranches = prVerificationAvailable ? detectedOpenPRs : new Set();
    const excludeRe = buildExcludeRegex();
    const preserveAuthorRe = buildPreserveAuthorRegex();

    console.log(
      `📊 Found ${remoteBranches.length} remote branches, ${localBranches.length} local branches`
    );
    if (prVerificationAvailable) {
      console.log(`🔓 Open PR branches protected: ${openPRBranches.size}`);
    } else {
      console.warn(
        '⚠️  Open-PR verification unavailable; deletion candidates will fail closed as DISCUSS.'
      );
    }
    console.log('');

    const toDelete = [];
    const toPreserve = [];
    const baseRef = getBaseRef();

    for (const branch of remoteBranches) {
      const lastCommitDate = getLastCommitDate(branch);
      const author = getLastCommitAuthor(branch);
      const merged = isMerged(branch);
      let classification = categorizeBranch(
        branch,
        {
          author,
          lastCommitDate,
          mergeStatus: {
            merged,
            state: merged ? 'merged' : 'unmerged',
          },
        },
        openPRBranches,
        excludeRe,
        opts.inactiveDays
      );

      if (!prVerificationAvailable && classification.category === 'DELETE') {
        classification = {
          ...classification,
          category: 'DISCUSS',
          autoApproved: false,
          reason: REASON_CODES.DISCUSS.pr_verification_unavailable,
        };
      }

      if (preserveAuthorRe && preserveAuthorRe.test(author)) {
        classification = {
          ...classification,
          category: 'KEEP',
          autoApproved: false,
          reason: `${REASON_CODES.KEEP.author_preserved}: ${author}`,
        };
      }

      if (classification.category !== 'DELETE') {
        toPreserve.push({
          branch,
          category: classification.category,
          reason: classification.reason,
        });
      } else {
        const commitCount = getUniqueCommitCount(branch, baseRef);
        toDelete.push({
          branch,
          reason: classification.reason,
          autoApproved: classification.autoApproved === true,
          lastCommitDate: classification.metadata.lastCommitDate,
          author: classification.metadata.author,
          hash: getLastCommitHash(branch),
          age: Math.floor(classification.metadata.ageInDays),
          type: classification.metadata.type,
          commitCount,
          estimatedStorageBytes: estimateStorageFreedBytes(commitCount),
        });
      }
    }

    console.log(`🗑️  Branches eligible for deletion: ${toDelete.length}`);
    console.log(
      `✅ Branches to preserve: ${toPreserve.filter((branch) => branch.category === 'KEEP').length}`
    );
    console.log(
      `💬 Branches requiring discussion: ${toPreserve.filter((branch) => branch.category === 'DISCUSS').length}`
    );
    console.log('');

    if (toDelete.length === 0) {
      console.log('🎉 Nothing to delete. Repository is clean.');
    }

    const deleted = [];
    const errors = [];

    for (const branch of toDelete) {
      const prefix = opts.dryRun ? '[DRY RUN] ' : '';
      console.log(`${prefix}🗑️  ${branch.branch} (${branch.reason})`);

      deleted.push({ ...branch, localDeleted: false });
    }
    const metrics = getMetrics(deleted, toPreserve, errors, toDelete.length);

    // Write report
    let reportPath;
    if (opts.reportFormat === 'json') {
      reportPath = writeJsonReport(deleted, toPreserve, errors, metrics, opts);
    } else {
      reportPath = writeMarkdownReport(deleted, toPreserve, errors, metrics, opts);
    }

    console.log('');
    console.log('============================');
    console.log('📋 Cleanup Summary');
    console.log('============================');
    console.log(`Deleted:   ${deleted.length} branches${opts.dryRun ? ' (dry run)' : ''}`);
    console.log(`Preserved: ${toPreserve.length} branches`);
    if (errors.length) console.log(`Errors:    ${errors.length}`);
    console.log(`Success:   ${metrics.successRate}`);
    console.log(`Commits:   ${metrics.totalCommits} (estimate)`);
    console.log(`Storage:   ${metrics.estimatedStorageHuman} (estimate)`);
    console.log(`Report:    ${reportPath}`);
    console.log('');

    if (opts.dryRun && toDelete.length > 0) {
      console.log(
        'ℹ️  This was a dry run. Submit candidates through the draft-PR approval workflow before deletion.'
      );
    }

    process.exit(getRunExitCode(remoteBranches.length, errors));
  } catch (err) {
    logError('Unexpected error', err);
    if (opts.verbose) {
      console.error(err);
    }
    process.exit(1);
  }
}

if (
  process.env.CLEANUP_BRANCHES_SKIP_MAIN !== '1' &&
  process.argv[1] &&
  process.argv[1].includes('cleanup-branches.js')
) {
  main().catch((err) => {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  });
}

export {
  branchTypeOf,
  buildExcludeRegex,
  buildPreserveAuthorRegex,
  daysSince,
  estimateStorageFreedBytes,
  formatBytes,
  getMetrics,
  getRunExitCode,
  getRemoteBranches,
  getLocalBranches,
  isMerged,
  writeMarkdownReport,
  writeJsonReport,
};
