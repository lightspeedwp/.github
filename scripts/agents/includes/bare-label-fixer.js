#!/usr/bin/env node
/**
 * Bare Label Fixer Agent
 *
 * Systematically audits and fixes issues/PRs with bare labels.
 * Removes non-canonical bare labels and applies proper prefixed equivalents.
 *
 * Usage:
 *   GITHUB_TOKEN=<token> node bare-label-fixer.js --dry-run
 *   GITHUB_TOKEN=<token> node bare-label-fixer.js --owner lightspeedwp --repo .github
 *
 * Environment:
 *   GITHUB_TOKEN - GitHub API token (required)
 *   DRY_RUN - If true, report changes without applying them (default: true)
 *   ISSUE_RANGE - Issue number range to limit scope (e.g., "1500-1600")
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { Octokit } = require("octokit");

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  dry_run: process.env.DRY_RUN !== "false",
  owner: process.env.OWNER || "lightspeedwp",
  repo: process.env.REPO || ".github",
  github_token: process.env.GITHUB_TOKEN,
  issue_range: process.env.ISSUE_RANGE, // e.g., "1500-1600"
  canonical_labels_file: ".github/labels.yml",
};

// Bare label → Proper prefixed label mapping
const BARE_LABEL_MAPPING = {
  // Type labels (high confidence)
  automation: "type:automation",
  bug: "type:bug",
  feature: "type:feature",
  refactor: "type:refactor",
  maintenance: "type:maintenance",
  epic: "type:epic",
  documentation: "type:documentation",
  testing: "type:test",
  "agent-audit": "type:audit",

  // Language labels
  javascript: "lang:javascript",

  // Area labels
  infrastructure: "area:infrastructure",
  cleanup: "type:chore",
  ci: "area:ci",

  // Documentation-related (ambiguous, map to type:documentation)
  governance: "type:documentation",
  standards: "type:documentation",

  // Custom/special labels (to be removed or decided)
  // These require manual review before removal
  migration: null, // Unclear: type:migration or custom?
  "phase-2": null, // Custom phase label
  "phase-3-polish": null, // Custom phase label
  "wceu-2026": null, // Event label
  "critical-path": null, // Custom
  glossary: null, // Custom
  templates: null, // Ambiguous context
  coderabbit: null, // Tooling-specific
  workflows: "area:automation",
};

const BARE_LABELS_TO_REMOVE = new Set(
  Object.keys(BARE_LABEL_MAPPING).filter((k) => BARE_LABEL_MAPPING[k] === null),
);
const BARE_LABELS_TO_FIX = new Map(
  Object.entries(BARE_LABEL_MAPPING).filter(([, v]) => v !== null),
);

// ============================================================================
// Utilities
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { ...CONFIG };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") {
      opts.dry_run = true;
    } else if (args[i] === "--no-dry-run") {
      opts.dry_run = false;
    } else if (args[i] === "--owner" && i + 1 < args.length) {
      opts.owner = args[++i];
    } else if (args[i] === "--repo" && i + 1 < args.length) {
      opts.repo = args[++i];
    } else if (args[i] === "--range" && i + 1 < args.length) {
      opts.issue_range = args[++i];
    }
  }

  if (!opts.github_token) {
    throw new Error("GITHUB_TOKEN environment variable is required");
  }

  return opts;
}

function loadCanonicalLabels(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const data = yaml.load(content);
    return new Set(data.map((l) => l.name));
  } catch (error) {
    console.warn(`⚠️  Could not load canonical labels: ${error.message}`);
    return new Set();
  }
}

function parseIssueRange(rangeStr) {
  if (!rangeStr) return null;
  const [start, end] = rangeStr.split("-").map(Number);
  return { start, end };
}

function isInRange(issueNumber, range) {
  if (!range) return true;
  return issueNumber >= range.start && issueNumber <= range.end;
}

// ============================================================================
// GitHub API
// ============================================================================

async function fetchIssuesWithBareLabels(octokit, owner, repo, range) {
  const issues = [];
  const allBareLabels = Array.from(BARE_LABELS_TO_FIX.keys()).concat(
    Array.from(BARE_LABELS_TO_REMOVE),
  );

  console.log(
    `🔍 Searching for issues with bare labels: ${allBareLabels.join(", ")}`,
  );

  for (const bareLabel of allBareLabels) {
    try {
      const response = await octokit.rest.issues.listForRepo({
        owner,
        repo,
        labels: bareLabel,
        per_page: 100,
        state: "all",
      });

      for (const issue of response.data) {
        if (isInRange(issue.number, range)) {
          const existing = issues.find((i) => i.number === issue.number);
          if (existing) {
            // Merge labels
            existing.labels_raw = [
              ...new Set([...existing.labels_raw, bareLabel]),
            ];
          } else {
            issues.push({
              number: issue.number,
              title: issue.title,
              labels_raw: [bareLabel],
              current_labels: issue.labels.map((l) => l.name),
            });
          }
        }
      }
    } catch (error) {
      console.error(
        `❌ Error fetching issues with label "${bareLabel}": ${error.message}`,
      );
    }
  }

  return issues;
}

// ============================================================================
// Label Fixing Logic
// ============================================================================

function calculateLabelChanges(issue) {
  const removals = [];
  const additions = [];

  // Identify bare labels to remove
  for (const bareLabel of issue.labels_raw) {
    if (BARE_LABELS_TO_FIX.has(bareLabel)) {
      removals.push(bareLabel);
      const replacement = BARE_LABELS_TO_FIX.get(bareLabel);
      if (replacement && !issue.current_labels.includes(replacement)) {
        additions.push(replacement);
      }
    } else if (BARE_LABELS_TO_REMOVE.has(bareLabel)) {
      removals.push(bareLabel);
    }
  }

  return { removals, additions };
}

async function fixIssueLabels(
  octokit,
  owner,
  repo,
  issueNumber,
  removals,
  additions,
) {
  if (removals.length === 0 && additions.length === 0) {
    return { success: true, message: "No changes needed" };
  }

  try {
    // Remove bare labels
    for (const label of removals) {
      await octokit.rest.issues.removeLabel({
        owner,
        repo,
        issue_number: issueNumber,
        name: label,
      });
    }

    // Add proper prefixed labels
    if (additions.length > 0) {
      await octokit.rest.issues.addLabels({
        owner,
        repo,
        issue_number: issueNumber,
        labels: additions,
      });
    }

    return {
      success: true,
      removed: removals,
      added: additions,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================================================
// Reporting
// ============================================================================

function generateReport(issues, changes) {
  const report = {
    timestamp: new Date().toISOString(),
    scope: "bare-label-fixer",
    total_issues_found: issues.length,
    total_changes: changes.filter(
      (c) => c.removals.length > 0 || c.additions.length > 0,
    ).length,
    changes: changes,
    summary: {
      successful: changes.filter((c) => c.result?.success).length,
      failed: changes.filter((c) => !c.result?.success).length,
      unchanged: changes.filter(
        (c) => c.removals.length === 0 && c.additions.length === 0,
      ).length,
    },
  };

  return report;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  try {
    const opts = parseArgs();
    const range = parseIssueRange(opts.issue_range);

    console.log(`
═══════════════════════════════════════════════════════════
Bare Label Fixer Agent
═══════════════════════════════════════════════════════════
Repository: ${opts.owner}/${opts.repo}
Mode: ${opts.dry_run ? "DRY RUN (no changes)" : "LIVE (changes applied)"}
Issue Range: ${range ? `${range.start}-${range.end}` : "All"}
    `);

    const octokit = new Octokit({ auth: opts.github_token });

    // Load canonical labels
    const canonicalLabels = loadCanonicalLabels(opts.canonical_labels_file);
    console.log(`✅ Loaded ${canonicalLabels.size} canonical labels`);

    // Fetch issues with bare labels
    console.log(`\n🔍 Scanning for issues with bare labels...`);
    const issues = await fetchIssuesWithBareLabels(
      octokit,
      opts.owner,
      opts.repo,
      range,
    );
    console.log(`📊 Found ${issues.length} issue(s) with bare labels`);

    if (issues.length === 0) {
      console.log("\n✅ No issues with bare labels found!");
      return;
    }

    // Calculate changes for each issue
    console.log(`\n📋 Calculating label changes...`);
    const changes = issues.map((issue) => {
      const { removals, additions } = calculateLabelChanges(issue);
      return {
        issue_number: issue.number,
        title: issue.title,
        removals,
        additions,
        current_labels: issue.current_labels,
      };
    });

    // Display changes
    console.log(`\n📝 Label Changes to Apply:`);
    console.log(`${"─".repeat(80)}`);
    for (const change of changes) {
      if (change.removals.length > 0 || change.additions.length > 0) {
        console.log(`\n#${change.issue_number}: ${change.title}`);
        if (change.removals.length > 0) {
          console.log(`  🗑️  Remove: ${change.removals.join(", ")}`);
        }
        if (change.additions.length > 0) {
          console.log(`  ✅ Add: ${change.additions.join(", ")}`);
        }
      } else {
        console.log(`\n#${change.issue_number}: No changes needed`);
      }
    }

    // Apply changes (if not dry-run)
    if (!opts.dry_run) {
      console.log(
        `\n🚀 Applying ${changes.filter((c) => c.removals.length > 0 || c.additions.length > 0).length} change(s)...`,
      );
      for (const change of changes) {
        const result = await fixIssueLabels(
          octokit,
          opts.owner,
          opts.repo,
          change.issue_number,
          change.removals,
          change.additions,
        );
        change.result = result;

        if (result.success) {
          console.log(`  ✅ #${change.issue_number}`);
        } else {
          console.log(`  ❌ #${change.issue_number}: ${result.error}`);
        }
      }
    } else {
      console.log(
        `\n⏸️  DRY RUN MODE: No changes applied. Run with --no-dry-run to apply changes.`,
      );
    }

    // Generate report
    const report = generateReport(issues, changes);
    console.log(`\n${"═".repeat(80)}`);
    console.log(`Summary:`);
    console.log(`  Total issues: ${report.total_issues_found}`);
    console.log(`  Total changes: ${report.total_changes}`);
    console.log(`  Successful: ${report.summary.successful}`);
    console.log(`  Failed: ${report.summary.failed}`);
    console.log(`  Unchanged: ${report.summary.unchanged}`);

    // Save report
    const reportPath = `.github/reports/bare-label-fixes/report-${Date.now()}.json`;
    const reportDir = path.dirname(reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Report saved to ${reportPath}`);
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
