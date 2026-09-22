/**
 * github-pr-utils.js — GitHub PR detection via GitHub CLI.
 *
 * Implements PR detection using `gh pr list` with error handling
 * for missing gh CLI, auth failures, and rate limits.
 *
 * @module scripts/lib/github-pr-utils
 */

import { spawnSync } from 'child_process';

export function isGhAvailable() {
  const result = spawnSync('gh', ['--version'], { encoding: 'utf8' });
  return result.status === 0;
}

export function getOpenPRs() {
  if (!isGhAvailable()) {
    console.warn('⚠️  GitHub CLI (gh) not found. Open-PR verification is unavailable.');
    return null;
  }

  const result = spawnSync(
    'gh',
    ['pr', 'list', '--state', 'open', '--json', 'headRefName', '--jq', '.[].headRefName'],
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

  return new Set(prBranches);
}

export function hasOpenPR(branch, openPRs) {
  const cached = openPRs === undefined ? getOpenPRs() : openPRs;
  if (!(cached instanceof Set)) {
    throw new Error('Open-PR verification is unavailable; deletion is unsafe');
  }
  return cached.has(branch);
}

export function getOpenPRDetails() {
  if (!isGhAvailable()) {
    return null;
  }

  const result = spawnSync(
    'gh',
    ['pr', 'list', '--state', 'open', '--json', 'headRefName,title,author'],
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
    return output ? JSON.parse(output) : [];
  } catch {
    return null;
  }
}
