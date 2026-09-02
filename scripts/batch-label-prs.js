#!/usr/bin/env node

/**
 * Batch labeling script for all open PRs
 * Applies labels based on branch name, changed files, and PR content
 * Usage: node scripts/batch-label-prs.js [--dry-run] [--pr=<number>]
 */

import fs from "fs";
import { load } from "js-yaml";
import github from "@actions/github";
import core from "@actions/core";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = "lightspeedwp";
const REPO = ".github";
const LABELS_CONFIG = ".github/labels.yml";
const LABELER_RULES = ".github/labeler.yml";
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

// File pattern to area mapping
const FILE_TO_AREA_MAP = {
  ".github/workflows/": "area:ci",
  ".github/actions/": "area:ci",
  "scripts/": "area:scripts",
  "docs/": "area:documentation",
  "README.md": "area:documentation",
  "**/*.md": "area:documentation",
  "tests/": "area:tests",
  "**/*.test.": "area:tests",
  "**/*.spec.": "area:tests",
  "__tests__/": "area:tests",
};

// Language mapping
const FILE_TO_LANG_MAP = {
  "**/*.php": "lang:php",
  "**/*.js": "lang:js",
  "**/*.jsx": "lang:js",
  "**/*.ts": "lang:js",
  "**/*.tsx": "lang:js",
  "**/*.css": "lang:css",
  "**/*.scss": "lang:css",
  "**/*.sass": "lang:css",
  "**/*.less": "lang:css",
  "**/*.md": "lang:md",
  "**/*.json": "lang:json",
  "**/*.yaml": "lang:yaml",
  "**/*.yml": "lang:yaml",
};

function log(message, level = "info") {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}

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

async function getPRChangedFiles(octokit, prNumber) {
  try {
    const { data: files } = await octokit.rest.pulls.listFiles({
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

    // 5. Add status label for new PRs
    if (
      labelsToApply.size === 0 ||
      !Array.from(labelsToApply).some((l) => l.startsWith("type:"))
    ) {
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
      const { data: prs } = await octokit.rest.pulls.list({
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

    if (!DRY_RUN) {
      log("\n✅ Batch labeling complete!");
    } else {
      log("\n📋 [DRY RUN] Completed - no changes made");
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
