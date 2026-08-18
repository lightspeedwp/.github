#!/usr/bin/env node

/**
 * Comprehensive Auto-Update Script
 * 1. Auto-applies labels (type + priority)
 * 2. Updates descriptions with correct template sections
 */

const { execFileSync } = require("child_process");

const OWNER = "lightspeedwp";
const REPO = ".github";
const DRY_RUN = process.argv.includes("--dry-run");
const VERBOSE = process.argv.includes("--verbose");

let BATCH_SIZE = 10;
if (process.argv.includes("--batch")) {
  const batchIndex = process.argv.indexOf("--batch");
  const batchValue = parseInt(process.argv[batchIndex + 1], 10);
  if (!Number.isInteger(batchValue) || batchValue <= 0) {
    console.error("Error: --batch must be a positive integer");
    process.exit(1);
  }
  BATCH_SIZE = batchValue;
}

const stats = {
  issuesProcessed: 0,
  issuesLabeledAdded: 0,
  issuesDescriptionUpdated: 0,
  prsProcessed: 0,
  prsDescriptionUpdated: 0,
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
    return result.trim();
  } catch (error) {
    if (!silent) log(`Command failed: gh ${args.join(" ")}`, "error");
    stats.errors.push(`gh ${args.join(" ")}`);
    throw error;
  }
}

function getOpenIssues() {
  log("Fetching open issues...", "info");
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
        "300",
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

function getOpenPRs() {
  log("Fetching open PRs...", "info");
  try {
    const result = exec(
      [
        "pr",
        "list",
        "--repo",
        `${OWNER}/${REPO}`,
        "--state",
        "open",
        "--limit",
        "100",
        "--json",
        "number,title,labels,body",
      ],
      true,
    );
    return JSON.parse(result || "[]");
  } catch (error) {
    log("Failed to fetch PRs", "error");
    return [];
  }
}

function detectIssueType(title) {
  title = title.toLowerCase();
  if (/bug|fix|issue|error|fail|break/i.test(title)) return "type:bug";
  if (/feature|add|new|implement|create|build/i.test(title))
    return "type:feature";
  if (/epic|phase|initiative|release/i.test(title)) return "type:epic";
  if (/design|ui|ux|mockup|wireframe/i.test(title)) return "type:design";
  if (/refactor|cleanup|simplify|improve/i.test(title)) return "type:refactor";
  if (/doc|guide|readme|help|tutorial/i.test(title))
    return "type:documentation";
  if (/test|coverage|qa|assert/i.test(title)) return "type:test";
  if (/perf|speed|optim|memory|cache/i.test(title)) return "type:performance";
  if (/security|vuln|auth|encrypt|protect/i.test(title)) return "type:security";
  return "type:task";
}

function hasTypeLabel(labels) {
  return labels && labels.some((l) => l.name.startsWith("type:"));
}

function hasPriorityLabel(labels) {
  return labels && labels.some((l) => l.name.startsWith("priority:"));
}

function addLabelToIssue(number, label) {
  if (DRY_RUN) {
    log(`[DRY RUN] Would add label "${label}" to issue #${number}`, "debug");
    return true;
  }

  try {
    exec(
      [
        "issue",
        "edit",
        String(number),
        "--repo",
        `${OWNER}/${REPO}`,
        "--add-label",
        label,
      ],
      true,
    );
    log(`Added label "${label}" to issue #${number}`, "success");
    return true;
  } catch (error) {
    log(`Failed to add label to issue #${number}`, "error");
    return false;
  }
}

function updateIssueDescription(number, body) {
  let updated = false;
  let newBody = body || "";

  const hasDoR = /## Definition of Ready|## DoR/i.test(newBody);
  const hasDoD = /## Definition of Done|## DoD/i.test(newBody);

  if (!hasDoR) {
    newBody = `${newBody}\n\n## Definition of Ready (DoR)\n\n- [ ] Issue has clear acceptance criteria\n- [ ] Related issues are linked\n- [ ] Scope is well-defined`;
    updated = true;
  }

  if (!hasDoD) {
    newBody = `${newBody}\n\n## Definition of Done (DoD)\n\n- [ ] Code is reviewed and approved\n- [ ] Tests pass (unit + integration)\n- [ ] Documentation updated\n- [ ] Changelog entry added (if applicable)`;
    updated = true;
  }

  if (updated) {
    if (DRY_RUN) {
      log(`[DRY RUN] Would update description for issue #${number}`, "debug");
      return true;
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
      log(`Updated description for issue #${number}`, "success");
      return true;
    } catch (error) {
      log(`Failed to update issue #${number} description`, "error");
      return false;
    }
  }

  return false;
}

function updatePRDescription(number, body) {
  let updated = false;
  let newBody = body || "";

  const hasReadme = /## Summary|## Changes/i.test(newBody);
  const hasTestPlan = /## Test plan|## Testing/i.test(newBody);
  const hasChangelog = /## Changelog|### Added|### Changed|### Fixed/i.test(
    newBody,
  );

  if (!hasReadme) {
    newBody = `## Summary\n\n[Brief description of changes]\n\n${newBody}`;
    updated = true;
  }

  if (!hasTestPlan) {
    newBody = `${newBody}\n\n## Test plan\n\n- [ ] Manual testing complete\n- [ ] Automated tests pass\n- [ ] No regressions detected`;
    updated = true;
  }

  if (!hasChangelog) {
    newBody = `${newBody}\n\n## Changelog\n\n### Added\n- \n\n### Changed\n- \n\n### Fixed\n- `;
    updated = true;
  }

  if (updated) {
    if (DRY_RUN) {
      log(`[DRY RUN] Would update description for PR #${number}`, "debug");
      return true;
    }

    try {
      exec(
        [
          "pr",
          "edit",
          String(number),
          "--repo",
          `${OWNER}/${REPO}`,
          "--body",
          newBody,
        ],
        true,
      );
      log(`Updated description for PR #${number}`, "success");
      return true;
    } catch (error) {
      log(`Failed to update PR #${number} description`, "error");
      return false;
    }
  }

  return false;
}

function processBatch(items, processor) {
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    batch.forEach((item, index) => {
      const globalIndex = i + index;
      processor(item, globalIndex, items.length);
    });
    log(
      `Progress: ${Math.min(i + BATCH_SIZE, items.length)}/${items.length}`,
      "debug",
    );
  }
}

function processIssues(issues) {
  log(`\n📋 Processing ${issues.length} issues...`, "info");

  processBatch(issues, (issue) => {
    stats.issuesProcessed++;

    const labelsToAdd = [];

    if (!hasTypeLabel(issue.labels)) {
      labelsToAdd.push(detectIssueType(issue.title));
    }

    if (!hasPriorityLabel(issue.labels)) {
      labelsToAdd.push("priority:normal");
    }

    labelsToAdd.forEach((label) => {
      if (addLabelToIssue(issue.number, label)) {
        stats.issuesLabeledAdded++;
      }
    });

    if (updateIssueDescription(issue.number, issue.body)) {
      stats.issuesDescriptionUpdated++;
    }
  });

  log(`✅ Issues processed: ${stats.issuesProcessed}`, "success");
  log(`✅ Labels added: ${stats.issuesLabeledAdded}`, "success");
  log(`✅ Descriptions updated: ${stats.issuesDescriptionUpdated}`, "success");
}

function processPRs(prs) {
  log(`\n📋 Processing ${prs.length} PRs...`, "info");

  processBatch(prs, (pr) => {
    stats.prsProcessed++;

    if (updatePRDescription(pr.number, pr.body)) {
      stats.prsDescriptionUpdated++;
    }
  });

  log(`✅ PRs processed: ${stats.prsProcessed}`, "success");
  log(`✅ PR descriptions updated: ${stats.prsDescriptionUpdated}`, "success");
}

function main() {
  log("🚀 Starting comprehensive auto-update...", "info");
  log(`DRY_RUN: ${DRY_RUN}, BATCH_SIZE: ${BATCH_SIZE}\n`, "debug");

  try {
    const issues = getOpenIssues();
    const prs = getOpenPRs();

    processIssues(issues);
    processPRs(prs);

    log("\n📊 Final Summary:", "info");
    log(`  Issues processed: ${stats.issuesProcessed}`, "debug");
    log(`  Labels added: ${stats.issuesLabeledAdded}`, "success");
    log(
      `  Issue descriptions updated: ${stats.issuesDescriptionUpdated}`,
      "success",
    );
    log(`  PRs processed: ${stats.prsProcessed}`, "debug");
    log(`  PR descriptions updated: ${stats.prsDescriptionUpdated}`, "success");

    if (stats.errors.length > 0) {
      log(`\n⚠️  Errors encountered: ${stats.errors.length}`, "warning");
      stats.errors.slice(0, 5).forEach((err) => log(`  - ${err}`, "error"));
      if (stats.errors.length > 5) {
        log(`  ... and ${stats.errors.length - 5} more`, "error");
      }
      process.exit(1);
    }

    log("\n✅ Auto-update complete!", "success");
  } catch (error) {
    log(`Fatal error: ${error.message}`, "error");
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  detectIssueType,
  hasTypeLabel,
  hasPriorityLabel,
  addLabelToIssue,
  updateIssueDescription,
  updatePRDescription,
};
