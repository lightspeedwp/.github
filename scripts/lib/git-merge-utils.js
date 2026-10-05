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
 * Report whether an origin branch is merged into one base.
 *
 * Three outcomes are kept apart on purpose. `true` and `false` are answers Git
 * gave. `null` means the query itself failed, which is not the same claim as
 * "not merged" and must not be reported as one.
 *
 * @param {string} branch - Branch name without origin/.
 * @param {string} base - Base branch name without origin/.
 * @returns {boolean|null} Whether the branch is merged into origin/{base}, or
 *   null when the query failed.
 */
function queryMerged(branch, base) {
  const baseRef = `origin/${base}`;

  // A missing base answers the question: the branch cannot be merged into a
  // base that does not exist here. Only an unusable Git answers null.
  const refCheck = spawnSync('git', ['show-ref', '--verify', '--quiet', `refs/remotes/${baseRef}`]);
  if (refCheck.status === 1) return false;
  if (refCheck.status !== 0) return null;

  try {
    const merged = execFileSync('git', ['branch', '-r', '--merged', baseRef], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    return merged
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .includes(`origin/${branch}`);
  } catch {
    return null;
  }
}

/**
 * Check whether an origin branch appears in Git's branches merged into develop.
 *
 * @param {string} branch - Branch name without origin/.
 * @returns {boolean|null} Whether the branch is merged into origin/develop, or
 *   null when the query failed.
 */
export function isMergedToDevelop(branch) {
  return queryMerged(branch, 'develop');
}

/**
 * Check whether an origin branch appears in Git's branches merged into main.
 *
 * @param {string} branch - Branch name without origin/.
 * @returns {boolean|null} Whether the branch is merged into origin/main, or null
 *   when the query failed.
 */
export function isMergedToMain(branch) {
  return queryMerged(branch, 'main');
}

/**
 * Report which of origin/develop and origin/main contain an origin branch.
 *
 * A base that answers true settles the verdict even when the other base could
 * not be queried, because a proven merge is a stronger fact than a failed
 * query. `state` is unknown only when no available base proved a merge and at
 * least one base failed.
 *
 * @param {string} branch - Branch name without origin/.
 * @returns {{state: string, merged: boolean, mergedToDevelop: boolean|null, mergedToMain: boolean|null}}
 *   Merge status; state is unmerged, develop, main, both, or unknown.
 */
export function getMergeStatus(branch) {
  const mergedToDevelop = isMergedToDevelop(branch);
  const mergedToMain = isMergedToMain(branch);
  const merged = mergedToDevelop === true || mergedToMain === true;

  let state = 'unmerged';
  if (mergedToDevelop === true && mergedToMain === true) {
    state = 'both';
  } else if (mergedToDevelop === true) {
    state = 'develop';
  } else if (mergedToMain === true) {
    state = 'main';
  } else if (mergedToDevelop === null || mergedToMain === null) {
    state = 'unknown';
  }

  return {
    state,
    merged,
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
