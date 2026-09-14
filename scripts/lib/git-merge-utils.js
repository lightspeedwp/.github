/**
 * git-merge-utils.js — Git merge detection utilities.
 *
 * Implements safe merge detection via git merge-base, checking if branches
 * are merged to develop, main, or both.
 *
 * @module scripts/lib/git-merge-utils
 */

import { execSync, spawnSync } from "child_process";

function run(cmd) {
  try {
    return execSync(cmd, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
  } catch {
    return "";
  }
}

function runLines(cmd) {
  return run(cmd)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function hasRemoteRef(ref) {
  return (
    spawnSync("git", ["show-ref", "--verify", "--quiet", `refs/remotes/${ref}`])
      .status === 0
  );
}

export function getBaseRef() {
  if (hasRemoteRef("origin/develop")) return "origin/develop";
  if (hasRemoteRef("origin/main")) return "origin/main";
  return "origin/HEAD";
}

export function getMergeBase(baseRef, branchRef) {
  return run(`git merge-base ${baseRef} ${branchRef}`);
}

export function isMergedToDevelop(branch) {
  const branchRef = `origin/${branch}`;
  const developMerged = runLines(
    "git branch -r --merged origin/develop 2>/dev/null",
  );
  return developMerged.includes(branchRef);
}

export function isMergedToMain(branch) {
  const branchRef = `origin/${branch}`;
  const mainMerged = runLines("git branch -r --merged origin/main 2>/dev/null");
  return mainMerged.includes(branchRef);
}

export function getMergeStatus(branch) {
  const mergedToDevelop = isMergedToDevelop(branch);
  const mergedToMain = isMergedToMain(branch);

  let state = "unmerged";
  if (mergedToDevelop && mergedToMain) {
    state = "both";
  } else if (mergedToDevelop) {
    state = "develop";
  } else if (mergedToMain) {
    state = "main";
  }

  return {
    state,
    merged: mergedToDevelop || mergedToMain,
    mergedToDevelop,
    mergedToMain,
  };
}

export function getUniqueCommitCount(branch, baseRef) {
  const branchRef = `origin/${branch}`;
  const mergeBase = getMergeBase(baseRef, branchRef);
  if (!mergeBase) return 0;

  const countStr = run(`git rev-list --count ${mergeBase}..${branchRef}`);
  const count = parseInt(countStr.trim(), 10);
  return Number.isNaN(count) ? 0 : count;
}
