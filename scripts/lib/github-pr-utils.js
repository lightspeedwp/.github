/**
 * github-pr-utils.js — GitHub PR detection via GitHub CLI.
 *
 * Implements PR detection using `gh pr list` with error handling
 * for missing gh CLI, auth failures, and rate limits.
 *
 * @module scripts/lib/github-pr-utils
 */

import { spawnSync } from 'child_process';

const OPEN_PR_LIMIT = 250;

/**
 * Check whether the GitHub CLI can be invoked successfully.
 *
 * @returns {boolean} Whether gh --version succeeds.
 */
export function isGhAvailable() {
  const result = spawnSync('gh', ['--version'], { encoding: 'utf8' });
  return result.status === 0;
}

/**
 * Get open pull request head branch names via the GitHub CLI.
 * Missing CLI, failed requests, and lists reaching the 250-PR limit return
 * null, not an empty Set; only a successful confirmed empty list is empty.
 *
 * @returns {Set<string>|null} Open PR branch names, or null when unverified.
 */
export function getOpenPRs() {
  if (!isGhAvailable()) {
    console.warn('⚠️  GitHub CLI (gh) not found. Open-PR verification is unavailable.');
    return null;
  }

  const result = spawnSync(
    'gh',
    [
      'pr',
      'list',
      '--state',
      'open',
      '--limit',
      String(OPEN_PR_LIMIT),
      '--json',
      'headRefName',
      '--jq',
      '.[].headRefName',
    ],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        GH_TOKEN: process.env.GH_TOKEN || process.env.GITHUB_TOKEN,
      },
    }
  );

  if (result.status !== 0) {
    const stderr = (result.stderr || '').trim();
    if (stderr.includes('rate limit')) {
      console.warn('⚠️  GitHub API rate limit reached. Open-PR verification is unavailable.');
    } else if (stderr.includes('unauthorized') || stderr.includes('not authenticated')) {
      console.warn(
        '⚠️  GitHub auth failed (set GH_TOKEN or GITHUB_TOKEN). Open-PR verification is unavailable.'
      );
    } else {
      console.warn(`⚠️  Could not fetch open PRs: ${stderr || 'unknown error'}`);
    }
    return null;
  }

  const output = (result.stdout || '').trim();
  const prBranches = output
    .split('\n')
    .map((b) => b.trim())
    .filter(Boolean);

  if (prBranches.length >= OPEN_PR_LIMIT) {
    console.warn(
      `⚠️  Open PR list truncated at ${OPEN_PR_LIMIT}. Open-PR verification is unavailable.`
    );
    return null;
  }

  return new Set(prBranches);
}

/**
 * Check a branch against confirmed open PR names, fetching them when omitted.
 *
 * @param {string} branch - Branch name to check.
 * @param {Set<string>} openPRs - Previously verified names, if available.
 * @returns {boolean} Whether the branch has an open PR.
 * @throws {Error} When open-PR verification is unavailable.
 */
export function hasOpenPR(branch, openPRs) {
  const cached = openPRs === undefined ? getOpenPRs() : openPRs;
  if (!(cached instanceof Set)) {
    throw new Error('Open-PR verification is unavailable; deletion is unsafe');
  }
  return cached.has(branch);
}

/**
 * Fetch open PR head names, titles, and authors via the GitHub CLI.
 * Returns null if the CLI is missing, the query fails, the JSON is invalid,
 * or the result reaches the 250-PR limit; an empty successful list is [].
 *
 * @returns {*} Parsed JSON (normally an array), or null when unavailable.
 */
export function getOpenPRDetails() {
  if (!isGhAvailable()) {
    return null;
  }

  const result = spawnSync(
    'gh',
    [
      'pr',
      'list',
      '--state',
      'open',
      '--limit',
      String(OPEN_PR_LIMIT),
      '--json',
      'headRefName,title,author',
    ],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        GH_TOKEN: process.env.GH_TOKEN || process.env.GITHUB_TOKEN,
      },
    }
  );

  if (result.status !== 0) {
    return null;
  }

  try {
    const output = (result.stdout || '').trim();
    const details = output ? JSON.parse(output) : [];
    if (Array.isArray(details) && details.length >= OPEN_PR_LIMIT) {
      console.warn(
        `⚠️  Open PR details truncated at ${OPEN_PR_LIMIT}. Open-PR verification is unavailable.`
      );
      return null;
    }
    return details;
  } catch {
    return null;
  }
}
