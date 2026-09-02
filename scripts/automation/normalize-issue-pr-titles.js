#!/usr/bin/env node

/**
 * Normalize Issue/PR Title Script
 *
 * Adds type prefixes to issue and PR titles based on labels or linked issues.
 * Ensures consistent title formatting across all issues and PRs.
 *
 * Usage:
 *   node normalize-issue-pr-titles.js [options]
 *
 * Options:
 *   --issue <number>    Process single issue
 *   --pr <number>       Process single PR
 *   --state <state>     Filter by state: open, closed, all (default: open)
 *   --since <date>      Process only since YYYY-MM-DD
 *   --type <type>       Process only: issue, pr, all (default: all)
 *   --dry-run           Show changes without applying
 *   --format <format>   Report format: text, json (default: text)
 *   --verbose           Enable detailed logging
 *   --help              Show this help message
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Configuration
const config = {
  owner: "lightspeedwp",
  repo: ".github",
  typeToDisplayName: {
    bug: "Bug",
    feature: "Feature",
    documentation: "Documentation",
    docs: "Documentation",
    chore: "Chore",
    ci: "Build & CI",
    build: "Build & CI",
    refactor: "Refactor",
    security: "Security",
    test: "Test",
    task: "Task",
    hotfix: "Hotfix",
    perf: "Performance",
    performance: "Performance",
    design: "Design",
    a11y: "Accessibility",
    accessibility: "Accessibility",
    ux: "UX",
    release: "Release",
    research: "Research",
    revert: "Revert",
    i18n: "Internationalization",
    ops: "Operations",
    proto: "Prototype",
    ds: "Design System",
    api: "API",
    schema: "Schema",
    telemetry: "Telemetry",
    content: "Content",
    seo: "SEO",
    config: "Configuration",
    migrate: "Migration",
    migration: "Migration",
    qa: "QA",
    uat: "UAT",
    audit: "Audit",
    deps: "Dependencies",
    dependency: "Dependencies",
  },
  prefixPattern: /^(\w+):\s+/,
};

// Parse arguments
const args = process.argv.slice(2);
const options = parseArgs(args);

if (options.help) {
  showHelp();
  process.exit(0);
}

// Main execution
async function main() {
  const log = createLogger(options.verbose);
  const report = {
    startTime: new Date(),
    total: 0,
    skipped: 0,
    updated: 0,
    errors: 0,
    details: [],
    errors_list: [],
  };

  try {
    log("Starting title normalization...");

    if (options.issue) {
      // Process single issue
      await processSingleIssue(options.issue, report, log);
    } else if (options.pr) {
      // Process single PR
      await processSinglePR(options.pr, report, log);
    } else {
      // Batch processing
      await processBatch(report, log);
    }

    report.endTime = new Date();
    report.duration = Math.round((report.endTime - report.startTime) / 1000);

    // Output report
    outputReport(report, options.format, log);
  } catch (error) {
    console.error("Fatal error:", error.message);
    process.exit(1);
  }
}

async function processSingleIssue(issueNumber, report, log) {
  log(`Processing single issue #${issueNumber}...`);

  try {
    const issue = JSON.parse(
      execSync(
        `gh issue view ${issueNumber} --repo ${config.owner}/${config.repo} --json number,title,labels`,
        { encoding: "utf-8" },
      ),
    );

    report.total++;
    const { newTitle, type, skipped } = await generateNewTitle(
      issue,
      "issue",
      report,
      log,
    );

    if (skipped) {
      report.skipped++;
      report.details.push({
        number: issue.number,
        type: "issue",
        oldTitle: issue.title,
        newTitle: issue.title,
        reason: "Already prefixed",
        action: "skipped",
      });
    } else if (!options.dryRun) {
      updateIssueTitle(issue.number, newTitle, log);
      report.updated++;
      report.details.push({
        number: issue.number,
        type: "issue",
        oldTitle: issue.title,
        newTitle: newTitle,
        typePrefix: type,
        action: "updated",
      });
    } else {
      report.details.push({
        number: issue.number,
        type: "issue",
        oldTitle: issue.title,
        newTitle: newTitle,
        typePrefix: type,
        action: "would-update",
      });
    }
  } catch (error) {
    report.errors++;
    report.errors_list.push({ issue: issueNumber, error: error.message });
  }
}

async function processSinglePR(prNumber, report, log) {
  log(`Processing single PR #${prNumber}...`);

  try {
    const pr = JSON.parse(
      execSync(
        `gh pr view ${prNumber} --repo ${config.owner}/${config.repo} --json number,title,labels,body`,
        { encoding: "utf-8" },
      ),
    );

    report.total++;
    const { newTitle, type, skipped } = await generateNewTitle(
      pr,
      "pr",
      report,
      log,
    );

    if (skipped) {
      report.skipped++;
      report.details.push({
        number: pr.number,
        type: "pr",
        oldTitle: pr.title,
        newTitle: pr.title,
        reason: "Already prefixed",
        action: "skipped",
      });
    } else if (!options.dryRun) {
      updatePRTitle(pr.number, newTitle, log);
      report.updated++;
      report.details.push({
        number: pr.number,
        type: "pr",
        oldTitle: pr.title,
        newTitle: newTitle,
        typePrefix: type,
        action: "updated",
      });
    } else {
      report.details.push({
        number: pr.number,
        type: "pr",
        oldTitle: pr.title,
        newTitle: newTitle,
        typePrefix: type,
        action: "would-update",
      });
    }
  } catch (error) {
    report.errors++;
    report.errors_list.push({ pr: prNumber, error: error.message });
  }
}

async function processBatch(report, log) {
  const issueStates = options.state === "all" ? "open,closed" : options.state;

  let query = `repo:${config.owner}/${config.repo} is:issue state:${issueStates}`;
  if (options.since) {
    query += ` created:>=${options.since}`;
  }

  if (options.type === "issue" || options.type === "all") {
    log("Fetching issues...");
    const issues = JSON.parse(
      execSync(
        `gh search issues --repo ${config.owner}/${config.repo} --state ${issueStates} --json number,title,labels --limit 1000`,
        { encoding: "utf-8" },
      ),
    );

    for (const issue of issues) {
      await processItem(issue, "issue", report, log);
    }
  }

  if (options.type === "pr" || options.type === "all") {
    log("Fetching pull requests...");
    const prs = JSON.parse(
      execSync(
        `gh search prs --repo ${config.owner}/${config.repo} --state ${issueStates} --json number,title,labels,body --limit 1000`,
        { encoding: "utf-8" },
      ),
    );

    for (const pr of prs) {
      await processItem(pr, "pr", report, log);
    }
  }
}

async function processItem(item, itemType, report, log) {
  report.total++;

  try {
    const { newTitle, type, skipped } = await generateNewTitle(
      item,
      itemType,
      report,
      log,
    );

    if (skipped) {
      report.skipped++;
      report.details.push({
        number: item.number,
        type: itemType,
        oldTitle: item.title,
        newTitle: item.title,
        reason: "Already prefixed",
        action: "skipped",
      });
    } else if (!options.dryRun) {
      if (itemType === "issue") {
        updateIssueTitle(item.number, newTitle, log);
      } else {
        updatePRTitle(item.number, newTitle, log);
      }
      report.updated++;
      report.details.push({
        number: item.number,
        type: itemType,
        oldTitle: item.title,
        newTitle: newTitle,
        typePrefix: type,
        action: "updated",
      });
    } else {
      report.details.push({
        number: item.number,
        type: itemType,
        oldTitle: item.title,
        newTitle: newTitle,
        typePrefix: type,
        action: "would-update",
      });
    }
  } catch (error) {
    report.errors++;
    report.errors_list.push({ item: item.number, error: error.message });
  }
}

async function generateNewTitle(item, itemType, report, log) {
  const currentTitle = item.title;

  // Check if already prefixed
  if (config.prefixPattern.test(currentTitle)) {
    return { newTitle: currentTitle, type: null, skipped: true };
  }

  // Detect type
  let type = await detectType(item, itemType, log);

  const displayName = config.typeToDisplayName[type] || "Feature";
  const newTitle = `${displayName}: ${currentTitle}`;

  return { newTitle, type, skipped: false };
}

async function detectType(item, itemType, log) {
  // For issues: Check labels first
  if (itemType === "issue" && item.labels && item.labels.length > 0) {
    for (const label of item.labels) {
      const labelName = label.name.toLowerCase();
      if (labelName.startsWith("type:")) {
        const type = labelName.replace("type:", "");
        log(`  Issue #${item.number}: detected type from label: ${type}`);
        return type;
      }
    }
  }

  // For PRs: Check linked issue first
  if (itemType === "pr" && item.body) {
    const issueMatch = item.body.match(
      /(close|closes|fix|fixes|resolve|resolves)\s+#(\d+)/i,
    );
    if (issueMatch) {
      const linkedIssueNumber = parseInt(issueMatch[2]);
      try {
        const linkedIssue = JSON.parse(
          execSync(
            `gh issue view ${linkedIssueNumber} --repo ${config.owner}/${config.repo} --json labels`,
            { encoding: "utf-8" },
          ),
        );

        if (linkedIssue.labels && linkedIssue.labels.length > 0) {
          for (const label of linkedIssue.labels) {
            const labelName = label.name.toLowerCase();
            if (labelName.startsWith("type:")) {
              const type = labelName.replace("type:", "");
              log(
                `  PR #${item.number}: detected type from linked issue #${linkedIssueNumber}: ${type}`,
              );
              return type;
            }
          }
        }
      } catch (error) {
        // Linked issue not found, continue with other detection methods
      }
    }
  }

  // Check PR/issue labels (fallback)
  if (item.labels && item.labels.length > 0) {
    for (const label of item.labels) {
      const labelName = label.name.toLowerCase();
      if (labelName.startsWith("type:")) {
        const type = labelName.replace("type:", "");
        log(
          `  ${itemType.toUpperCase()} #${item.number}: detected type from label: ${type}`,
        );
        return type;
      }
    }
  }

  // Scan body/description for type indicators
  if (item.body) {
    const bodyMatch = item.body.match(/type:\s*(\w+)/i);
    if (bodyMatch) {
      const type = bodyMatch[1].toLowerCase();
      log(
        `  ${itemType.toUpperCase()} #${item.number}: detected type from body: ${type}`,
      );
      return type;
    }
  }

  log(
    `  ${itemType.toUpperCase()} #${item.number}: using default type: feature`,
  );
  return "feature";
}

function updateIssueTitle(issueNumber, newTitle, log) {
  try {
    execSync(
      `gh issue edit ${issueNumber} --repo ${config.owner}/${config.repo} --title "${escapeShellArg(newTitle)}"`,
      { encoding: "utf-8" },
    );
    log(`  Updated issue #${issueNumber}`);
  } catch (error) {
    throw new Error(`Failed to update issue #${issueNumber}: ${error.message}`);
  }
}

function updatePRTitle(prNumber, newTitle, log) {
  try {
    execSync(
      `gh pr edit ${prNumber} --repo ${config.owner}/${config.repo} --title "${escapeShellArg(newTitle)}"`,
      { encoding: "utf-8" },
    );
    log(`  Updated PR #${prNumber}`);
  } catch (error) {
    throw new Error(`Failed to update PR #${prNumber}: ${error.message}`);
  }
}

function parseArgs(args) {
  const options = {
    issue: null,
    pr: null,
    state: "open",
    since: null,
    type: "all",
    dryRun: false,
    format: "text",
    verbose: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--issue":
        options.issue = parseInt(args[++i]);
        break;
      case "--pr":
        options.pr = parseInt(args[++i]);
        break;
      case "--state":
        options.state = args[++i];
        break;
      case "--since":
        options.since = args[++i];
        break;
      case "--type":
        options.type = args[++i];
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--format":
        options.format = args[++i];
        break;
      case "--verbose":
        options.verbose = true;
        break;
      case "--help":
        options.help = true;
        break;
    }
  }

  return options;
}

function createLogger(verbose) {
  return (message) => {
    if (verbose) {
      console.log(`[${new Date().toISOString()}] ${message}`);
    }
  };
}

function outputReport(report, format, log) {
  if (format === "json") {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log("\n" + "=".repeat(60));
    console.log("TITLE NORMALIZATION REPORT");
    console.log("=".repeat(60));
    console.log(`\nStart time:  ${report.startTime.toISOString()}`);
    console.log(`End time:    ${report.endTime.toISOString()}`);
    console.log(`Duration:    ${report.duration}s`);
    console.log(`\nTotal processed:  ${report.total}`);
    console.log(`Updated:          ${report.updated}`);
    console.log(`Skipped:          ${report.skipped}`);
    console.log(`Errors:           ${report.errors}`);

    if (report.details.length > 0) {
      console.log("\nDETAILS:");
      for (const detail of report.details) {
        const action =
          detail.action === "would-update"
            ? "→ WOULD UPDATE"
            : detail.action.toUpperCase();
        console.log(
          `  [${detail.type.toUpperCase()}#${detail.number}] ${action}: "${detail.oldTitle}" → "${detail.newTitle}"`,
        );
      }
    }

    if (report.errors_list.length > 0) {
      console.log("\nERRORS:");
      for (const error of report.errors_list) {
        console.log(`  Error: ${error.error}`);
      }
    }

    console.log("\n" + "=".repeat(60) + "\n");
  }

  // Log to file
  const logFile = path.join(__dirname, "normalize-titles.log");
  fs.appendFileSync(
    logFile,
    `\n${new Date().toISOString()} - Processed: ${report.total}, Updated: ${report.updated}, Skipped: ${report.skipped}, Errors: ${report.errors}\n`,
  );
}

function showHelp() {
  console.log(`
Normalize Issue/PR Title Script

Usage:
  node normalize-issue-pr-titles.js [options]

Options:
  --issue <number>    Process single issue
  --pr <number>       Process single PR
  --state <state>     Filter by state: open, closed, all (default: open)
  --since <date>      Process only since YYYY-MM-DD
  --type <type>       Process only: issue, pr, all (default: all)
  --dry-run           Show changes without applying
  --format <format>   Report format: text, json (default: text)
  --verbose           Enable detailed logging
  --help              Show this help message

Examples:
  # Process all open issues and PRs
  node normalize-issue-pr-titles.js

  # Process single issue #123
  node normalize-issue-pr-titles.js --issue 123

  # Process all open PRs with dry-run
  node normalize-issue-pr-titles.js --type pr --dry-run

  # Process closed issues since 2026-08-01
  node normalize-issue-pr-titles.js --type issue --state closed --since 2026-08-01

  # Get JSON report
  node normalize-issue-pr-titles.js --format json
`);
}

function escapeShellArg(arg) {
  return arg.replace(/"/g, '\\"');
}

// Run
main().catch((error) => {
  console.error("Script failed:", error.message);
  process.exit(1);
});
