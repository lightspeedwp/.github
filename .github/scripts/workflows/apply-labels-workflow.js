#!/usr/bin/env node

/**
 * Apply labels to GitHub issues using LabelingAgent
 * Reads issues from JSON file and applies labels based on intelligent detection rules
 */

const fs = require("fs");
const path = require("path");
const { Octokit } = require("@octokit/rest");

// Load configuration from environment
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const DRY_RUN = process.env.DRY_RUN === "true";
const ISSUES_FILE = process.env.ISSUES_FILE || "issues-to-label.json";
const LABEL_TYPES = process.env.LABEL_TYPES || "all";
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "50", 10);

// Load the LabelingAgent
const agentPath = path.join(
  __dirname,
  "../../scripts/agents/includes/labeling-agent.js",
);
const { LabelingAgent } = require(agentPath);

const context = JSON.parse(
  fs.readFileSync(process.env.GITHUB_CONTEXT || "{}", "utf8"),
);
const OWNER =
  context.repo?.owner || process.env.GITHUB_REPOSITORY?.split("/")[0];
const REPO = context.repo?.repo || process.env.GITHUB_REPOSITORY?.split("/")[1];

if (!OWNER || !REPO) {
  console.error("❌ Failed to determine repository owner and name");
  process.exit(1);
}

if (!GITHUB_TOKEN) {
  console.error("❌ GITHUB_TOKEN environment variable not set");
  process.exit(1);
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log(`🏷️  Starting label application workflow`);
    console.log(`📦 Repository: ${OWNER}/${REPO}`);
    console.log(
      `⚙️  Mode: ${DRY_RUN ? "DRY-RUN (preview only)" : "APPLY (actual changes)"}`,
    );
    console.log(`🏷️  Label types: ${LABEL_TYPES}`);

    // Initialize GitHub API
    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    // Initialize agent
    const agent = new LabelingAgent(octokit, OWNER, REPO);

    // Load issues from file
    if (!fs.existsSync(ISSUES_FILE)) {
      console.log(`📋 No issues file found at ${ISSUES_FILE}`);
      process.exit(0);
    }

    const issues = JSON.parse(fs.readFileSync(ISSUES_FILE, "utf8"));
    console.log(`📋 Loaded ${issues.length} issue(s) to process`);

    if (issues.length === 0) {
      console.log(`✅ No issues to label`);
      process.exit(0);
    }

    // Apply labels in batches
    console.log(`\n🔄 Processing issues in batches of ${BATCH_SIZE}...`);
    const results = await agent.bulkAssignLabels(issues, {
      dryRun: DRY_RUN,
      batchSize: BATCH_SIZE,
    });

    // Generate report
    console.log(`\n📊 Generating labeling report...`);
    const report = agent.generateReport(results);

    // Save report
    fs.writeFileSync("labeling-report.json", JSON.stringify(report, null, 2));
    console.log(`✅ Report saved to labeling-report.json`);

    // Print summary
    console.log(`\n📈 Summary:`);
    console.log(`   Total processed: ${report.summary.total}`);
    console.log(`   Succeeded: ${report.summary.succeeded}`);
    console.log(`   Errors: ${report.summary.errors}`);
    console.log(`   Type labels applied: ${report.summary.typeLabelsApplied}`);
    console.log(`   Area labels applied: ${report.summary.areaLabelsApplied}`);
    console.log(
      `   Priority labels applied: ${report.summary.priorityLabelsApplied}`,
    );

    // Print detailed results if there are errors
    if (report.summary.errors > 0) {
      console.log(`\n⚠️  Errors encountered:`);
      results
        .filter((r) => r.status === "error")
        .forEach((r) => {
          console.log(`   Issue #${r.number}: ${r.error}`);
        });
    }

    console.log(`\n✅ Label application workflow completed`);
  } catch (error) {
    console.error(`❌ Fatal error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run main function
main();
