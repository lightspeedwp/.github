#!/usr/bin/env node

/**
 * Phase 2: DoR/DoD Template Validation & Auto-Injection
 *
 * Validates that issues have DoR/DoD sections and injects
 * type-specific templates for issues that are missing them
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const dorDodTemplates = require("./dor-dod-templates");

const OWNER = "lightspeedwp";
const REPO = ".github";
const DRY_RUN = process.argv.includes("--dry-run");
const VERBOSE = process.argv.includes("--verbose");

// Parse --limit with validation
let MAX_ISSUES = 300;
if (process.argv.includes("--limit")) {
  const limitIndex = process.argv.indexOf("--limit");
  const limitValue = process.argv[limitIndex + 1];
  const parsed = parseInt(limitValue, 10);
  if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 300) {
    MAX_ISSUES = parsed;
  } else {
    console.error(
      `❌ Invalid --limit value: ${limitValue} (must be integer 1-300)`,
    );
    process.exit(1);
  }
}

const stats = {
  issuesProcessed: 0,
  issuesMissingDoR: 0,
  issuesMissingDoD: 0,
  issuesMissingBoth: 0,
  issuesInjected: 0,
  issuesWouldInject: 0,
  issuesSkipped: 0,
  issuesWithoutType: 0,
  errors: [],
};

function log(msg, type = "info") {
  if (VERBOSE || type !== "debug") {
    const prefix =
      {
        info: "📋",
        success: "✅",
        warning: "⚠️",
        error: "❌",
        debug: "🔍",
      }[type] || "•";
    console.log(`${prefix} ${msg}`);
  }
}

function exec(args, silent = false) {
  try {
    const result = execFileSync("gh", args, {
      encoding: "utf-8",
      stdio: silent ? "pipe" : "inherit",
      maxBuffer: 10 * 1024 * 1024,
    });
    return silent ? result.trim() : null;
  } catch (error) {
    if (!silent) log(`Command failed: gh ${args.join(" ")}`, "error");
    stats.errors.push(`gh ${args.join(" ")}`);
    throw error;
  }
}

function getOpenIssues() {
  log(`Fetching open issues (limit: ${MAX_ISSUES})...`, "info");
  try {
    const result = exec(
      [
        "issue",
        "list",
        "--repo",
        `${OWNER}/${REPO}`,
        "--state",
        "open",
        "--limit",
        String(MAX_ISSUES),
        "--json",
        "number,title,labels,body",
      ],
      true,
    );
    return JSON.parse(result || "[]");
  } catch (error) {
    log("Failed to fetch issues", "error");
    return [];
  }
}

function validateIssue(issue) {
  const hasDoR = dorDodTemplates.hasDoR(issue.body);
  const hasDoD = dorDodTemplates.hasDoD(issue.body);
  const typeLabel = dorDodTemplates.detectTypeFromLabels(issue.labels);

  return {
    number: issue.number,
    title: issue.title,
    body: issue.body,
    labels: issue.labels,
    hasDoR,
    hasDoD,
    typeLabel,
    needsInjection: !hasDoR || !hasDoD,
  };
}

function injectDoRDoD(issue, validation) {
  let newBody = issue.body || "";
  const template = dorDodTemplates.getTemplate(validation.typeLabel);

  if (!template) {
    log(
      `⚠️  Issue #${validation.number} has no type label, skipping injection`,
      "warning",
    );
    stats.issuesWithoutType++;
    return null;
  }

  // Inject DoR if missing
  if (!validation.hasDoR) {
    newBody = `${newBody}\n\n${template.dor}`;
  }

  // Inject DoD if missing
  if (!validation.hasDoD) {
    newBody = `${newBody}\n\n${template.dod}`;
  }

  if (newBody === issue.body) {
    return null; // No changes needed
  }

  return newBody;
}

function updateIssue(number, newBody) {
  if (DRY_RUN) {
    log(`[DRY RUN] Would update issue #${number}`, "debug");
    stats.issuesWouldInject++;
    return false;
  }

  try {
    exec(
      [
        "issue",
        "edit",
        String(number),
        "--repo",
        `${OWNER}/${REPO}`,
        "--body",
        newBody,
      ],
      true,
    );
    log(`Updated issue #${number} with DoR/DoD sections`, "success");
    stats.issuesInjected++;
    return true;
  } catch (error) {
    log(`Failed to update issue #${number}`, "error");
    return false;
  }
}

function processIssues(issues) {
  log(`Processing ${issues.length} issues...`, "info");

  for (const issue of issues) {
    stats.issuesProcessed++;
    const validation = validateIssue(issue);

    // Log status
    if (!validation.hasDoR) stats.issuesMissingDoR++;
    if (!validation.hasDoD) stats.issuesMissingDoD++;
    if (!validation.hasDoR && !validation.hasDoD) stats.issuesMissingBoth++;

    // Check if injection is needed
    if (!validation.needsInjection) {
      log(`Issue #${validation.number} ✓ has both DoR & DoD`, "debug");
      continue;
    }

    // Validate type label exists
    if (!validation.typeLabel) {
      stats.issuesSkipped++;
      log(`Issue #${validation.number} skipped (no type label)`, "warning");
      continue;
    }

    // Inject DoR/DoD
    const newBody = injectDoRDoD(issue, validation);
    if (!newBody) {
      stats.issuesSkipped++;
      continue;
    }

    updateIssue(validation.number, newBody);
  }
}

function printSummary() {
  console.log("\n" + "=".repeat(60));
  console.log("📊 DoR/DoD Validation & Injection Summary");
  console.log("=".repeat(60));
  const injectionCount = DRY_RUN
    ? stats.issuesWouldInject
    : stats.issuesInjected;
  console.log(`
Issues Processed:           ${stats.issuesProcessed}
Issues Missing DoR:         ${stats.issuesMissingDoR}
Issues Missing DoD:         ${stats.issuesMissingDoD}
Issues Missing Both:        ${stats.issuesMissingBoth}
Issues Injected:            ${injectionCount}
Issues Without Type Label:  ${stats.issuesWithoutType}
Issues Skipped:             ${stats.issuesSkipped}

${DRY_RUN ? "[DRY RUN MODE] Changes shown above would be applied" : "[LIVE MODE] Changes have been applied"}
  `);

  if (stats.errors.length > 0) {
    console.log("❌ Errors:");
    stats.errors.forEach((err) => console.log(`  - ${err}`));
  }

  console.log("=".repeat(60) + "\n");

  return stats.errors.length === 0;
}

function writeReport() {
  const timestamp = new Date().toISOString().split("T")[0];
  const reportFile = `dor-dod-validation-${timestamp}.json`;
  const report = {
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    stats,
  };
  try {
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    log(`Report written to ${reportFile}`, "success");
  } catch (error) {
    log(`Failed to write report: ${error.message}`, "error");
  }
}

// Main execution
async function main() {
  log("Starting DoR/DoD Validation & Injection...", "info");

  if (DRY_RUN) {
    log("[DRY RUN MODE] No changes will be applied", "warning");
  }

  const issues = getOpenIssues();
  if (issues.length === 0) {
    log("No open issues found", "warning");
    return;
  }

  processIssues(issues);
  const success = printSummary();
  writeReport();

  process.exit(success ? 0 : 1);
}

main();
