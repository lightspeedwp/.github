#!/usr/bin/env node

/**
 * Milestone assignment workflow script
 * Runs in GitHub Actions context with access to GITHUB_TOKEN
 */

const github = require("@actions/github");
const core = require("@actions/core");
const {
  MilestoneAssignmentAgent,
} = require("../agents/includes/milestone-assignment.cjs");

async function main() {
  try {
    // Get inputs from environment (passed from workflow)
    const issuesJson = process.env.ISSUES_JSON;
    const dryRun = process.env.DRY_RUN === "true";
    const runId = process.env.RUN_ID;

    if (!issuesJson) {
      throw new Error("ISSUES_JSON environment variable not set");
    }

    const issues = JSON.parse(issuesJson);
    core.info(
      `Starting milestone assignment for ${issues.length} issues (dry-run: ${dryRun})`,
    );

    // Create GitHub API client
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
    const { owner, repo } = github.context.repo;

    // Create agent and perform bulk assignment
    const agent = new MilestoneAssignmentAgent(octokit, owner, repo);
    const results = await agent.bulkAssignMilestones(issues, {
      dryRun,
      reportPath: `.github/reports/remediation/milestone-assignment-${runId}.md`,
    });

    // Summary stats
    const assigned = results.filter(
      (r) => r.status === "assigned" || r.status === "dry-run-success",
    ).length;
    const errors = results.filter((r) => r.status === "error").length;
    const skipped = results.filter(
      (r) => r.status === "no-milestone-found",
    ).length;

    core.info(
      `✅ Milestone assignment complete: ${assigned} assigned, ${skipped} skipped, ${errors} errors`,
    );
    process.exit(0);
  } catch (error) {
    core.error(`Milestone assignment failed: ${error.message}`);
    core.error(error.stack);
    process.exit(1);
  }
}

main();
