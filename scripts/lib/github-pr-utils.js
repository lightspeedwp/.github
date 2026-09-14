/**
 * github-pr-utils.js — GitHub PR detection via GitHub CLI.
 *
 * Implements PR detection using `gh pr list` with error handling
 * for missing gh CLI, auth failures, and rate limits.
 *
 * @module scripts/lib/github-pr-utils
 */

import { spawnSync } from "child_process";

export function isGhAvailable() {
  const result = spawnSync("gh", ["--version"], { encoding: "utf8" });
  return result.status === 0;
}

export function getOpenPRs() {
  if (!isGhAvailable()) {
    console.warn(
      "⚠️  GitHub CLI (gh) not found. Install gh for full safety verification.",
    );
    return new Set();
  }

  const result = spawnSync(
    "gh",
    [
      "pr",
      "list",
      "--state",
      "open",
      "--json",
      "headRefName",
      "--jq",
      ".[].headRefName",
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        GH_TOKEN: process.env.GH_TOKEN || process.env.GITHUB_TOKEN,
      },
    },
  );

  if (result.status !== 0) {
    const stderr = (result.stderr || "").trim();
    if (stderr.includes("rate limit")) {
      console.warn("⚠️  GitHub API rate limit reached. Skipping PR check.");
    } else if (
      stderr.includes("unauthorized") ||
      stderr.includes("not authenticated")
    ) {
      console.warn(
        "⚠️  GitHub auth failed (set GH_TOKEN or GITHUB_TOKEN). Skipping PR check.",
      );
    } else {
      console.warn(
        `⚠️  Could not fetch open PRs: ${stderr || "unknown error"}`,
      );
    }
    return new Set();
  }

  const output = (result.stdout || "").trim();
  const prBranches = output
    .split("\n")
    .map((b) => b.trim())
    .filter(Boolean);

  return new Set(prBranches);
}

export function hasOpenPR(branch, openPRs) {
  const cached = openPRs || getOpenPRs();
  return cached.has(branch);
}

export function getOpenPRDetails() {
  if (!isGhAvailable()) {
    return [];
  }

  const result = spawnSync(
    "gh",
    [
      "pr",
      "list",
      "--state",
      "open",
      "--json",
      "headRefName,title,author",
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        GH_TOKEN: process.env.GH_TOKEN || process.env.GITHUB_TOKEN,
      },
    },
  );

  if (result.status !== 0) {
    return [];
  }

  try {
    const output = (result.stdout || "").trim();
    return output ? JSON.parse(output) : [];
  } catch {
    return [];
  }
}
