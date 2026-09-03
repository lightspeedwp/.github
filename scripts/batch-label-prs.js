#!/usr/bin/env node

/**
 * Batch labeling script for all open PRs
 * Applies labels based on branch name, changed files, and PR content
 * Usage: node scripts/batch-label-prs.js [--dry-run] [--pr=<number>]
 */

import fs from "fs";
import { load } from "js-yaml";
import github from "@actions/github";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = "lightspeedwp";
const REPO = ".github";
const LABELS_CONFIG = ".github/labels.yml";
const DRY_RUN = process.argv.includes("--dry-run");
const SPECIFIC_PR = process.argv
  .find((arg) => arg.startsWith("--pr="))
  ?.split("=")[1];

// Branch prefix to type mapping
const BRANCH_PREFIX_TYPE_MAP = {
  "feat/": "type:feature",
  "fix/": "type:bug",
  "docs/": "type:documentation",
  "docs-": "type:documentation",
  "test/": "type:test",
  "tests/": "type:test",
  "perf/": "type:performance",
  "refactor/": "type:refactor",
  "chore/": "type:chore",
  "build/": "type:chore",
  "ci/": "type:ci",
  "deps/": "type:dependencies",
  "security/": "type:security",
  "a11y/": "type:a11y",
  "design/": "type:design",
  "release/": "type:release",
  "hotfix/": "type:bug",
};

/**
 * Log a message with timestamp and level.
 * @param {string} message - The message to log.
 * @param {string} level - Log level (info, error, warn).
 */
function log(message, level = "info") {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}

/**
 * Load canonical labels from the labels configuration file.
 * @returns {Set<string>} Set of canonical label names.
 */
function loadCanonicalLabels() {
  if (!fs.existsSync(LABELS_CONFIG)) {
    log(`Labels config not found at ${LABELS_CONFIG}`, "error");
    return new Set();
  }
  const raw = fs.readFileSync(LABELS_CONFIG, "utf8");
  const data = load(raw);
  if (!Array.isArray(data)) {
    log("Labels config is not an array", "error");
    return new Set();
  }
  return new Set(
    data.map((l) => (typeof l === "string" ? l : l.name)).filter(Boolean),
  );
}

/**
 * Detect PR type label from branch name prefix.
 * @param {string} branchName - The branch name to analyze.
 * @returns {string|null} The detected type label or null.
 */
function detectTypeFromBranch(branchName = "") {
  if (!branchName) return null;

  const lowerBranch = branchName.toLowerCase();
  for (const [prefix, typeLabel] of Object.entries(BRANCH_PREFIX_TYPE_MAP)) {
    if (lowerBranch.startsWith(prefix)) {
      log(`Detected type from branch '${prefix}': ${typeLabel}`);
      return typeLabel;
    }
  }
  return null;
}

/**
 * Detect PR type label from title and body content.
 * @param {string} title - The PR title.
 * @param {string} body - The PR body/description.
 * @returns {string|null} The detected type label or null.
 */
function detectTypeFromContent(title = "", body = "") {
  const lowerTitle = (title + " " + body).toLowerCase();

  if (lowerTitle.includes("fix") || lowerTitle.includes("bug")) {
    return "type:bug";
  }
  if (lowerTitle.includes("feat") || lowerTitle.includes("feature")) {
    return "type:feature";
  }
  if (lowerTitle.includes("doc") || lowerTitle.includes("documentation")) {
    return "type:documentation";
  }
  if (lowerTitle.includes("test") || lowerTitle.includes("testing")) {
    return "type:test";
  }
  if (lowerTitle.includes("perf") || lowerTitle.includes("performance")) {
    return "type:performance";
  }
  if (lowerTitle.includes("refactor")) {
    return "type:refactor";
  }
  if (lowerTitle.includes("security")) {
    return "type:security";
  }

  return null;
}

/**
 * Detect area labels based on file paths changed in PR.
 * @param {string[]} files - List of file paths.
 * @returns {string[]} Array of detected area labels.
 */
function detectAreasFromFiles(files = []) {
  const areas = new Set();

  for (const file of files) {
    // Check workflow files
    if (file.includes(".github/workflows")) {
      areas.add("area:ci");
    } else if (file.includes(".github")) {
      areas.add("area:ci");
    }

    // Check scripts
    if (file.includes("scripts/")) {
      areas.add("area:scripts");
    }

    // Check tests
    if (
      file.includes("tests/") ||
      file.includes("__tests__/") ||
      file.includes(".test.") ||
      file.includes(".spec.")
    ) {
      areas.add("area:tests");
    }

    // Check docs
    if (
      file.includes("docs/") ||
      file.endsWith(".md") ||
      file.endsWith("README.md")
    ) {
      areas.add("area:documentation");
    }

    // Check configuration
    if (file.includes("config") || file.endsWith(".json")) {
      areas.add("area:ci");
    }
  }

  return Array.from(areas);
}

/**
 * Detect language labels based on file extensions.
 * @param {string[]} files - List of file paths.
 * @returns {string[]} Array of detected language labels.
 */
function detectLangsFromFiles(files = []) {
  const langs = new Set();

  for (const file of files) {
    if (file.endsWith(".php")) langs.add("lang:php");
    if (file.endsWith(".js") || file.endsWith(".jsx")) langs.add("lang:js");
    if (file.endsWith(".ts") || file.endsWith(".tsx")) langs.add("lang:js");
    if (
      file.endsWith(".css") ||
      file.endsWith(".scss") ||
      file.endsWith(".sass")
    )
      langs.add("lang:css");
    if (file.endsWith(".md")) langs.add("lang:md");
    if (file.endsWith(".json")) langs.add("lang:json");
    if (file.endsWith(".yaml") || file.endsWith(".yml")) langs.add("lang:yaml");
  }

  return Array.from(langs);
}

/**
 * Get all files changed in a PR.
 * @param {object} octokit - Octokit client instance.
 * @param {number} prNumber - The PR number.
 * @returns {Promise<string[]>} Array of changed file paths.
 */
async function getPRChangedFiles(octokit, prNumber) {
  try {
    const files = await octokit.paginate(octokit.rest.pulls.listFiles, {
      owner: OWNER,
      repo: REPO,
      pull_number: prNumber,
      per_page: 100,
    });
    return files.map((f) => f.filename);
  } catch (error) {
    log(`Error fetching files for PR #${prNumber}: ${error.message}`, "error");
    return [];
  }
}

/**
 * Analyze PR and apply appropriate labels.
 * @param {object} octokit - Octokit client instance.
 * @param {number} prNumber - The PR number.
 * @param {object} pr - The PR object with title, body, labels, head ref.
 * @returns {Promise<object>} Result object with prNumber, applied labels, and optional error.
 */
async function labelPR(octokit, prNumber, pr) {
  try {
    const labelsToApply = new Set();
    const canonicalLabels = loadCanonicalLabels();

    log(`\nProcessing PR #${prNumber}: "${pr.title}"`);

    // 1. Detect type from branch name
    const branchType = detectTypeFromBranch(pr.head.ref);
    if (branchType && canonicalLabels.has(branchType)) {
      labelsToApply.add(branchType);
      log(`  ✓ Branch type: ${branchType}`);
    }

    // 2. Detect type from content if not found from branch
    if (!branchType) {
      const contentType = detectTypeFromContent(pr.title, pr.body || "");
      if (contentType && canonicalLabels.has(contentType)) {
        labelsToApply.add(contentType);
        log(`  ✓ Content type: ${contentType}`);
      }
    }

    // 3. Detect areas from files
    const changedFiles = await getPRChangedFiles(octokit, prNumber);
    const areas = detectAreasFromFiles(changedFiles);
    areas.forEach((area) => {
      if (canonicalLabels.has(area)) {
        labelsToApply.add(area);
      }
    });
    if (areas.length > 0) {
      log(`  ✓ Areas: ${areas.join(", ")}`);
    }

    // 4. Detect languages from files
    const langs = detectLangsFromFiles(changedFiles);
    langs.forEach((lang) => {
      if (canonicalLabels.has(lang)) {
        labelsToApply.add(lang);
      }
    });
    if (langs.length > 0) {
      log(`  ✓ Languages: ${langs.join(", ")}`);
    }

    // 5. Ensure PR has a status label (independent of type label)
    const hasStatusLabel = Array.from(labelsToApply).some((l) =>
      l.startsWith("status:"),
    );
    if (!hasStatusLabel) {
      labelsToApply.add("status:needs-review");
      log(`  ✓ Default status: status:needs-review`);
    }

    // Filter out labels already on PR
    const currentLabels = new Set(pr.labels?.map((l) => l.name) || []);
    const newLabels = Array.from(labelsToApply).filter(
      (l) => !currentLabels.has(l),
    );

    if (newLabels.length === 0) {
      log(`  ℹ No new labels to apply`);
      return { prNumber, applied: [] };
    }

    // Apply labels
    if (!DRY_RUN) {
      await octokit.rest.issues.addLabels({
        owner: OWNER,
        repo: REPO,
        issue_number: prNumber,
        labels: newLabels,
      });
      log(`  ✅ Applied labels: ${newLabels.join(", ")}`);
    } else {
      log(`  📋 [DRY RUN] Would apply: ${newLabels.join(", ")}`);
    }

    return { prNumber, applied: newLabels };
  } catch (error) {
    log(`❌ Error labeling PR #${prNumber}: ${error.message}`, "error");
    return { prNumber, applied: [], error: error.message };
  }
}

/**
 * Main entry point: label all open PRs or a specific PR.
 */
async function main() {
  if (!GITHUB_TOKEN) {
    log("GITHUB_TOKEN not set", "error");
    process.exit(1);
  }

  const octokit = github.getOctokit(GITHUB_TOKEN);

  log(
    `Starting batch labeling for ${OWNER}/${REPO}${DRY_RUN ? " [DRY RUN]" : ""}`,
  );
  if (SPECIFIC_PR) {
    log(`Targeting specific PR: #${SPECIFIC_PR}`);
  }

  try {
    // Fetch open PRs
    let prNumbers = [];

    if (SPECIFIC_PR) {
      prNumbers = [parseInt(SPECIFIC_PR)];
    } else {
      const prs = await octokit.paginate(octokit.rest.pulls.list, {
        owner: OWNER,
        repo: REPO,
        state: "open",
        per_page: 100,
      });

      prNumbers = prs.map((pr) => pr.number);
      log(`Found ${prNumbers.length} open PRs`);
    }

    // Process each PR
    const results = [];
    for (const prNumber of prNumbers) {
      const { data: pr } = await octokit.rest.pulls.get({
        owner: OWNER,
        repo: REPO,
        pull_number: prNumber,
      });

      const result = await labelPR(octokit, prNumber, pr);
      results.push(result);

      // Small delay between API calls to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Summary
    log("\n" + "=".repeat(60));
    log("SUMMARY");
    log("=".repeat(60));
    const successCount = results.filter((r) => !r.error).length;
    const errorCount = results.filter((r) => r.error).length;
    const totalApplied = results.reduce((sum, r) => sum + r.applied.length, 0);

    log(`PRs processed: ${results.length}`);
    log(`Labels applied: ${totalApplied}`);
    log(`Successful: ${successCount}`);
    log(`Errors: ${errorCount}`);

    // Write report file
    const report = {
      timestamp: new Date().toISOString(),
      dryRun: DRY_RUN,
      summary: {
        prsProcessed: results.length,
        labelsApplied: totalApplied,
        successful: successCount,
        errors: errorCount,
      },
      results,
    };
    fs.writeFileSync("labeling-report.json", JSON.stringify(report, null, 2));
    log("\n✅ Report written to labeling-report.json");

    if (!DRY_RUN) {
      log("✅ Batch labeling complete!");
    } else {
      log("📋 [DRY RUN] Completed - no changes made");
    }
  } catch (error) {
    log(`Fatal error: ${error.message}`, "error");
    process.exit(1);
  }
}

main().catch((error) => {
  log(`Unexpected error: ${error.message}`, "error");
  process.exit(1);
});
