/**
 * git-merge-utils.js — Git merge detection utilities.
 *
 * Implements safe merge detection via git merge-base, checking if branches
 * are merged to develop, main, or both.
 *
 * @module scripts/lib/git-merge-utils
 */

import { execFileSync, spawnSync } from 'child_process';

/**
 * Run Git with argument separation, returning empty output if Git fails.
 *
 * @param {string[]} args - Git arguments.
 * @returns {string} Trimmed stdout, or an empty string on failure.
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
 * Split successful Git output into nonempty trimmed lines.
 * Failed Git commands yield an empty array.
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

/**
 * Check whether a remote-tracking reference exists locally.
 *
 * @param {string} ref - Remote reference, such as origin/main.
 * @returns {boolean} Whether Git verifies the reference.
 */
function hasRemoteRef(ref) {
  return spawnSync('git', ['show-ref', '--verify', '--quiet', `refs/remotes/${ref}`]).status === 0;
}

/**
 * Prefer the available origin/develop reference, then origin/main.
 * Fall back to origin/HEAD without checking whether it exists.
 *
 * @returns {string} Selected remote-tracking reference.
 */
export function getBaseRef() {
  if (hasRemoteRef('origin/develop')) return 'origin/develop';
  if (hasRemoteRef('origin/main')) return 'origin/main';
  return 'origin/HEAD';
}

/**
 * Find the common ancestor of two refs, returning an empty string on Git failure.
 *
 * @param {string} baseRef - Base Git reference.
 * @param {string} branchRef - Branch Git reference.
 * @returns {string} Merge-base commit hash, or an empty string.
 */
export function getMergeBase(baseRef, branchRef) {
  return run(['merge-base', baseRef, branchRef]);
}

/**
 * Check whether an origin branch appears in Git's branches merged into develop.
 * Git failures yield false.
 *
 * @param {string} branch - Branch name without origin/.
 * @returns {boolean} Whether the branch is merged into origin/develop.
 */
export function isMergedToDevelop(branch) {
  const branchRef = `origin/${branch}`;
  const developMerged = runLines(['branch', '-r', '--merged', 'origin/develop']);
  return developMerged.includes(branchRef);
}

/**
 * Check whether an origin branch appears in Git's branches merged into main.
 * Git failures yield false.
 *
 * @param {string} branch - Branch name without origin/.
 * @returns {boolean} Whether the branch is merged into origin/main.
 */
export function isMergedToMain(branch) {
  const branchRef = `origin/${branch}`;
  const mainMerged = runLines(['branch', '-r', '--merged', 'origin/main']);
  return mainMerged.includes(branchRef);
}

/**
 * Report which of origin/develop and origin/main contain an origin branch.
 * Failed Git queries are treated as not merged for that base.
 *
 * @param {string} branch - Branch name without origin/.
 * @returns {{state: string, merged: boolean, mergedToDevelop: boolean, mergedToMain: boolean}} Merge status; state is unmerged, develop, main, or both.
 */
export function getMergeStatus(branch) {
  const mergedToDevelop = isMergedToDevelop(branch);
  const mergedToMain = isMergedToMain(branch);

  let state = 'unmerged';
  if (mergedToDevelop && mergedToMain) {
    state = 'both';
  } else if (mergedToDevelop) {
    state = 'develop';
  } else if (mergedToMain) {
    state = 'main';
  }

  return {
    state,
    merged: mergedToDevelop || mergedToMain,
    mergedToDevelop,
    mergedToMain,
  };
}

/**
 * Count commits on an origin branch since its merge-base with a base ref.
 * Missing merge-bases, failed Git commands, and unparseable counts yield zero.
 *
 * @param {string} branch - Branch name without origin/.
 * @param {string} baseRef - Base Git reference.
 * @returns {number} Commit count since the common ancestor.
 */
export function getUniqueCommitCount(branch, baseRef) {
  const branchRef = `origin/${branch}`;
  const mergeBase = getMergeBase(baseRef, branchRef);
  if (!mergeBase) return 0;

  const countStr = run(['rev-list', '--count', `${mergeBase}..${branchRef}`]);
  const count = parseInt(countStr.trim(), 10);
  return Number.isNaN(count) ? 0 : count;
}
