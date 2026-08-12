#!/usr/bin/env node

/**
 * cleanup-branches.js — Identifies and removes stale merged branches.
 *
 * Scans local and remote branches, filters out protected/open-PR branches,
 * and deletes those that are fully merged and inactive beyond the threshold.
 *
 * Usage:
 *   node scripts/cleanup-branches.js [options]
 *
 * Options:
 *   --dryRun              Preview deletions without executing (default: true)
 *   --dryRun=false        Execute deletions
 *   --deleteLocal         Also delete local branches (default: false)
 *   --inactiveDays=N      Inactivity threshold in days (default: 30)
 *   --excludePatterns=RE  Pipe-separated regex patterns to preserve (e.g. "release/.*|hotfix/.*")
 *   --preserveAuthors=RE  Pipe-separated author patterns to preserve (e.g. "dependabot|renovate")
 *   --reportFormat=TYPE   Output format: markdown or json (default: markdown)
 *   --reportDir=PATH      Directory to write report (default: .github/reports)
 *
 * @module scripts/cleanup-branches
 */

import { execSync, spawnSync } from "child_process";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function getArg(name, defaultValue) {
  const longFlag = `--${name}=`;
  const boolFlag = `--${name}`;

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith(longFlag)) {
      return arg.slice(longFlag.length);
    }
    if (arg === boolFlag) {
      return "true";
    }
  }
  return defaultValue;
}

function parseBool(value, defaultValue = true) {
  if (value === "false") return false;
  if (value === "true") return true;
  return defaultValue;
}

const opts = {
  dryRun: parseBool(getArg("dryRun", "true"), true),
  deleteLocal: parseBool(getArg("deleteLocal", "false"), false),
  inactiveDays: parseInt(getArg("inactiveDays", "30"), 10),
  excludePatterns: getArg("excludePatterns", ""),
  preserveAuthors: getArg("preserveAuthors", ""),
  reportFormat: getArg("reportFormat", "markdown"),
  reportDir: getArg("reportDir", ".github/reports"),
};

if (Number.isNaN(opts.inactiveDays) || opts.inactiveDays < 0) {
  console.warn("⚠️  Invalid --inactiveDays value; defaulting to 30.");
  opts.inactiveDays = 30;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PROTECTED_BRANCHES = new Set(["main", "develop", "production"]);

const DEFAULT_EXCLUDE_PATTERN = /^(release\/|hotfix\/)/;

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const AVG_STORAGE_BYTES_PER_COMMIT = 4096;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function toInt(value, fallback = 0) {
  const parsed = parseInt(String(value).trim(), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function toPct(numerator, denominator) {
  if (denominator === 0) return "0.00%";
  return `${((numerator / denominator) * 100).toFixed(2)}%`;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function branchTypeOf(branch) {
  if (branch.includes("/")) {
    return branch.split("/")[0];
  }
  return "other";
}

function hasRemoteRef(ref) {
  return (
    spawnSync("git", ["show-ref", "--verify", "--quiet", `refs/remotes/${ref}`])
      .status === 0
  );
}

function getBaseRef() {
  if (hasRemoteRef("origin/develop")) return "origin/develop";
  if (hasRemoteRef("origin/main")) return "origin/main";
  return "origin/HEAD";
}

function getMergeBase(baseRef, branchRef) {
  return run(`git merge-base ${baseRef} ${branchRef}`);
}

function estimateStorageFreedBytes(commitCount) {
  return commitCount * AVG_STORAGE_BYTES_PER_COMMIT;
}

function getUniqueCommitCount(branch, baseRef) {
  const branchRef = `origin/${branch}`;
  const mergeBase = getMergeBase(baseRef, branchRef);
  if (!mergeBase) return 0;
  return toInt(run(`git rev-list --count ${mergeBase}..${branchRef}`), 0);
}

function daysSince(isoDate) {
  if (!isoDate) return 0;
  const then = new Date(isoDate);
  if (isNaN(then.getTime())) return 0;
  return (Date.now() - then.getTime()) / MS_PER_DAY;
}

function buildExcludeRegex() {
  const parts = [DEFAULT_EXCLUDE_PATTERN.source];
  if (opts.excludePatterns) {
    parts.push(
      ...opts.excludePatterns
        .split("|")
        .map((p) => p.trim())
        .filter(Boolean),
    );
  }

  const source = `(${parts.join("|")})`;
  try {
    return new RegExp(source);
  } catch (err) {
    console.warn(
      `⚠️  Invalid --excludePatterns regex; falling back to defaults: ${err.message}`,
    );
    return DEFAULT_EXCLUDE_PATTERN;
  }
}

function buildPreserveAuthorRegex() {
  if (!opts.preserveAuthors) return null;
  const parts = opts.preserveAuthors
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) return null;

  const source = `(${parts.join("|")})`;
  try {
    return new RegExp(source);
  } catch (err) {
    console.warn(
      `⚠️  Invalid --preserveAuthors regex; disabling author preservation: ${err.message}`,
    );
    return null;
  }
}

// ---------------------------------------------------------------------------
// Branch discovery
// ---------------------------------------------------------------------------

function getRemoteBranches() {
  return runLines(
    "git for-each-ref refs/remotes/origin --format='%(refname:short)'",
  ).map((b) => b.replace(/^origin\//, ""));
}

function getLocalBranches() {
  return runLines("git for-each-ref refs/heads --format='%(refname:short)'");
}

function isMerged(branch) {
  const branchRef = `origin/${branch}`;

  const developMerged = runLines(
    "git branch -r --merged origin/develop 2>/dev/null",
  );
  if (developMerged.includes(branchRef)) return true;

  const mainMerged = runLines("git branch -r --merged origin/main 2>/dev/null");
  if (mainMerged.includes(branchRef)) return true;

  return false;
}

function getLastCommitDate(branch) {
  return run(`git log -1 --format=%cI "origin/${branch}" 2>/dev/null`) || "";
}

function getLastCommitAuthor(branch) {
  return run(`git log -1 --format=%ae "origin/${branch}" 2>/dev/null`) || "";
}

function getLastCommitHash(branch) {
  return run(`git log -1 --format=%H "origin/${branch}" 2>/dev/null`) || "";
}

function getOpenPRBranches() {
  const ghAvailable = spawnSync("gh", ["--version"], { encoding: "utf8" });
  if (ghAvailable.status !== 0) {
    console.warn(
      "⚠️  GitHub CLI (gh) not found — open PR check skipped. Install gh for full safety.",
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
    console.warn(
      `⚠️  Could not fetch open PRs via gh CLI — skipping open PR check: ${(result.stderr || "").trim()}`,
    );
    return new Set();
  }

  const output = (result.stdout || "").trim();
  return new Set(
    output
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean),
  );
}

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------

function classifyBranch(branch, openPRBranches, excludeRe, preserveAuthorRe) {
  if (PROTECTED_BRANCHES.has(branch)) {
    return { keep: true, reason: "protected branch" };
  }

  if (excludeRe.test(branch)) {
    return { keep: true, reason: "matches exclude pattern" };
  }

  if (openPRBranches.has(branch)) {
    return { keep: true, reason: "has open pull request" };
  }

  const lastCommitDate = getLastCommitDate(branch);
  const author = getLastCommitAuthor(branch);

  if (preserveAuthorRe && preserveAuthorRe.test(author)) {
    return { keep: true, reason: `author preserved (${author})` };
  }

  if (!isMerged(branch)) {
    return { keep: true, reason: "not fully merged" };
  }

  const age = daysSince(lastCommitDate);
  if (age < opts.inactiveDays) {
    return {
      keep: true,
      reason: `active within ${opts.inactiveDays} days (${Math.floor(age)}d ago)`,
    };
  }

  return {
    keep: false,
    reason: `merged and inactive for ${Math.floor(age)} days`,
    lastCommitDate,
    author,
    hash: getLastCommitHash(branch),
    age: Math.floor(age),
    type: branchTypeOf(branch),
  };
}

// ---------------------------------------------------------------------------
// Deletion
// ---------------------------------------------------------------------------

function deleteRemoteBranch(branch) {
  if (opts.dryRun) return { ok: true, dryRun: true };
  const result = spawnSync("git", ["push", "origin", "--delete", branch], {
    encoding: "utf8",
  });
  if (result.status === 0) {
    return { ok: true };
  }
  return { ok: false, error: (result.stderr || "").trim() };
}

function deleteLocalBranch(branch) {
  if (opts.dryRun) return { ok: true, dryRun: true };
  const result = spawnSync("git", ["branch", "-d", branch], {
    encoding: "utf8",
  });
  if (result.status === 0) {
    return { ok: true };
  }
  return { ok: false, error: (result.stderr || "").trim() };
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function ensureReportDir(reportDir = opts.reportDir) {
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
}

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
  const successRate = toPct(
    successfulDeletes,
    successfulDeletes + failedDeletes,
  );
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

function writeMarkdownReport(
  deleted,
  preserved,
  errors,
  metrics,
  reportOptions = opts,
) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filePath = path.join(
    reportOptions.reportDir,
    `branch-cleanup-${timestamp}.md`,
  );

  const lines = [
    `# Branch Cleanup Report`,
    ``,
    `**Date:** ${new Date().toISOString()}`,
    `**Mode:** ${reportOptions.dryRun ? "Dry run (no deletions)" : "Live execution"}`,
    `**Threshold:** ${reportOptions.inactiveDays} days inactive`,
    ``,
    `## Summary`,
    ``,
    `| Metric | Value |`,
    `| --- | --- |`,
    `| Branches considered for deletion | ${metrics.candidatesCount} |`,
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
    lines.push("");
  }

  lines.push(`### Authors affected (notification list)`, ``);
  if (metrics.authorsAffected.length === 0) {
    lines.push(`- None`, ``);
  } else {
    for (const author of metrics.authorsAffected) {
      lines.push(`- ${author}`);
    }
    lines.push("");
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
        `- **Local deleted:** ${b.localDeleted ? "Yes" : "No"}`,
        ``,
      );
    }
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
    "```bash",
    `git branch <branch-name> <commit-hash>`,
    `git push origin <branch-name>`,
    "```",
    ``,
    `> Hashes for deleted branches are listed in the Deleted Branches section above.`,
  );

  const content = lines.join("\n");
  ensureReportDir(reportOptions.reportDir);
  fs.writeFileSync(filePath, content, "utf8");
  return filePath;
}

function writeJsonReport(
  deleted,
  preserved,
  errors,
  metrics,
  reportOptions = opts,
) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filePath = path.join(
    reportOptions.reportDir,
    `branch-cleanup-${timestamp}.json`,
  );
  const report = {
    timestamp: new Date().toISOString(),
    dryRun: reportOptions.dryRun,
    inactiveDays: reportOptions.inactiveDays,
    summary: {
      candidates: metrics.candidatesCount,
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
    preserved: preserved.map((p) => ({ branch: p.branch, reason: p.reason })),
    errors,
  };
  ensureReportDir(reportOptions.reportDir);
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2), "utf8");
  return filePath;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("🌿 Branch Cleanup Script");
  console.log("========================");
  console.log(
    `Mode:         ${opts.dryRun ? "Dry run (preview only)" : "Live execution"}`,
  );
  console.log(`Threshold:    ${opts.inactiveDays} days inactive`);
  console.log(`Delete local: ${opts.deleteLocal}`);
  if (opts.excludePatterns)
    console.log(`Exclude:      ${opts.excludePatterns}`);
  if (opts.preserveAuthors)
    console.log(`Preserve:     ${opts.preserveAuthors}`);
  console.log("");

  // Fetch latest remote state
  console.log("🔄 Fetching remote branch list...");
  run("git fetch --prune origin");

  const remoteBranches = getRemoteBranches().filter(
    (b) => b !== "HEAD" && b.trim() !== "",
  );
  const localBranches = opts.deleteLocal ? getLocalBranches() : [];
  const openPRBranches = getOpenPRBranches();
  const excludeRe = buildExcludeRegex();
  const preserveAuthorRe = buildPreserveAuthorRegex();

  console.log(
    `📊 Found ${remoteBranches.length} remote branches, ${localBranches.length} local branches`,
  );
  console.log(`🔓 Open PR branches protected: ${openPRBranches.size}`);
  console.log("");

  const toDelete = [];
  const toPreserve = [];
  const baseRef = getBaseRef();

  for (const branch of remoteBranches) {
    const classification = classifyBranch(
      branch,
      openPRBranches,
      excludeRe,
      preserveAuthorRe,
    );

    if (classification.keep) {
      toPreserve.push({ branch, reason: classification.reason });
    } else {
      const commitCount = getUniqueCommitCount(branch, baseRef);
      toDelete.push({
        branch,
        ...classification,
        commitCount,
        estimatedStorageBytes: estimateStorageFreedBytes(commitCount),
      });
    }
  }

  console.log(`🗑️  Branches eligible for deletion: ${toDelete.length}`);
  console.log(`✅ Branches to preserve: ${toPreserve.length}`);
  console.log("");

  if (toDelete.length === 0) {
    console.log("🎉 Nothing to delete. Repository is clean.");
  }

  const deleted = [];
  const errors = [];

  for (const branch of toDelete) {
    const prefix = opts.dryRun ? "[DRY RUN] " : "";
    console.log(`${prefix}🗑️  ${branch.branch} (${branch.reason})`);

    if (!opts.dryRun) {
      const remoteResult = deleteRemoteBranch(branch.branch);
      if (!remoteResult.ok) {
        console.error(`  ❌ Remote deletion failed: ${remoteResult.error}`);
        errors.push({ branch: branch.branch, error: remoteResult.error });
        continue;
      }
    }

    let localDeleted = false;
    if (opts.deleteLocal) {
      const localExists = localBranches.includes(branch.branch);
      if (localExists) {
        const localResult = deleteLocalBranch(branch.branch);
        if (!localResult.ok) {
          console.warn(`  ⚠️  Local deletion failed: ${localResult.error}`);
        } else {
          localDeleted = true;
        }
      }
    }

    deleted.push({ ...branch, localDeleted });
  }
  const metrics = getMetrics(deleted, toPreserve, errors, toDelete.length);

  // Write report
  let reportPath;
  if (opts.reportFormat === "json") {
    reportPath = writeJsonReport(deleted, toPreserve, errors, metrics, opts);
  } else {
    reportPath = writeMarkdownReport(
      deleted,
      toPreserve,
      errors,
      metrics,
      opts,
    );
  }

  console.log("");
  console.log("============================");
  console.log("📋 Cleanup Summary");
  console.log("============================");
  console.log(
    `Deleted:   ${deleted.length} branches${opts.dryRun ? " (dry run)" : ""}`,
  );
  console.log(`Preserved: ${toPreserve.length} branches`);
  if (errors.length) console.log(`Errors:    ${errors.length}`);
  console.log(`Success:   ${metrics.successRate}`);
  console.log(`Commits:   ${metrics.totalCommits} (estimate)`);
  console.log(`Storage:   ${metrics.estimatedStorageHuman} (estimate)`);
  console.log(`Report:    ${reportPath}`);
  console.log("");

  if (opts.dryRun && toDelete.length > 0) {
    console.log(
      "ℹ️  This was a dry run. Run with --dryRun=false to execute deletions.",
    );
  }

  if (!opts.dryRun && toDelete.length > 0) {
    console.log("✅ Post-cleanup: run the following to sync local tracking:");
    console.log("   git remote update origin --prune");
    console.log("   git branch -vv");
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

if (
  process.env.CLEANUP_BRANCHES_SKIP_MAIN !== "1" &&
  process.argv[1] &&
  process.argv[1].includes("cleanup-branches.js")
) {
  main().catch((err) => {
    console.error("❌ Unexpected error:", err.message);
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
  getRemoteBranches,
  getLocalBranches,
  getOpenPRBranches,
  isMerged,
  classifyBranch,
  writeMarkdownReport,
  writeJsonReport,
};
