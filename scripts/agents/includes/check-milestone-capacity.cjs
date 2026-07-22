#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const { getOctokit } = require("@actions/github");
const {
  readConfig,
  checkMilestoneCapacity,
  getActiveMilestones,
  extractTypeFromLabels,
} = require("./milestone-allocation.cjs");

const COMMENT_MARKER = "<!-- milestone-capacity-check -->";

function getItemFromEvent(event) {
  return {
    kind: event.pull_request ? "pull_request" : "issue",
    number: event.pull_request
      ? event.pull_request.number
      : event.issue.number,
  };
}

async function getMilestoneStats(github, owner, repo, milestoneName, config) {
  try {
    const { data: issues } = await github.rest.issues.listForRepo({
      owner,
      repo,
      milestone: milestoneName,
      state: "open",
      per_page: 100,
    });

    // Filter out excluded types (chore, task, documentation, etc.)
    const milestoneStrategy = config?.milestone_strategy || {};
    const capacity = milestoneStrategy.capacity || {};
    const excludeTypes = capacity.exclude_types || [];

    const filteredIssues = issues.filter((issue) => {
      const issueType = issue.type || extractTypeFromLabels(issue.labels);
      return !excludeTypes.includes(issueType);
    });

    // Get actual count from headers if available
    const linkHeader = issues.headers?.link || "";
    const lastMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
    const pageCount = lastMatch ? parseInt(lastMatch[1], 10) : 1;
    const estimatedTotal = pageCount > 1 ? pageCount * 100 : issues.length;

    // Estimate filtered count based on filter ratio
    const filterRatio =
      issues.length > 0 ? filteredIssues.length / issues.length : 1;
    const estimatedFilteredCount = Math.ceil(estimatedTotal * filterRatio);

    return {
      milestone: milestoneName,
      open_issues: estimatedFilteredCount,
      total_issues: estimatedTotal,
      filtered_issues: filteredIssues.length,
    };
  } catch (error) {
    console.info(
      `Could not fetch stats for milestone '${milestoneName}': ${error.message}`,
    );
    return null;
  }
}

async function postCapacityWarning(github, owner, repo, number, warnings) {
  if (warnings.length === 0) return;

  const lines = [COMMENT_MARKER, "## ⚠️ Milestone Capacity Warning"];

  for (const warning of warnings) {
    const icon = warning.level === "error" ? "🚨" : "⚠️";
    lines.push(`${icon} **${warning.milestone}**: ${warning.message}`);
  }

  lines.push(
    "",
    "_Maintained by milestone capacity monitoring. Consider deferring lower-priority work to future milestones._",
  );

  const body = lines.join("\n");

  try {
    const { data: comments } = await github.rest.issues.listComments({
      owner,
      repo,
      issue_number: number,
      per_page: 100,
    });

    const existing = comments.find(
      (c) => c.user?.type === "Bot" && c.body?.includes(COMMENT_MARKER),
    );

    if (existing) {
      await github.rest.issues.updateComment({
        owner,
        repo,
        comment_id: existing.id,
        body,
      });
      console.info(`Updated capacity warning on #${number}`);
    } else {
      await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: number,
        body,
      });
      console.info(`Created capacity warning on #${number}`);
    }
  } catch (error) {
    console.warn(
      `Could not post capacity warning on #${number}: ${error.message}`,
    );
  }
}

async function run() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || "";
  const configPath = process.env.PROJECT_ROUTES_CONFIG
    ? path.resolve(process.env.PROJECT_ROUTES_CONFIG)
    : path.resolve(".github/project-routes.yml");

  if (!eventPath) throw new Error("GITHUB_EVENT_PATH is required");
  if (!token) throw new Error("GITHUB_TOKEN is required");
  if (!repo.includes("/")) throw new Error("GITHUB_REPOSITORY is required");

  const [owner, repoName] = repo.split("/");
  const event = JSON.parse(fs.readFileSync(eventPath, "utf8"));
  const config = readConfig(configPath);
  const github = getOctokit(token);
  const item = getItemFromEvent(event);

  // Only check on issue open/reopen (not PR or edit)
  if (
    event.pull_request ||
    (event.action !== "opened" && event.action !== "reopened")
  ) {
    console.info(`#${item.number}: Skipping capacity check`);
    return { checked: false, warnings: [] };
  }

  const activeMilestones = getActiveMilestones(config);
  const allWarnings = [];

  // Check capacity for all active milestones
  for (const milestoneName of activeMilestones) {
    const stats = await getMilestoneStats(
      github,
      owner,
      repoName,
      milestoneName,
      config,
    );
    if (!stats) continue;

    const warnings = checkMilestoneCapacity(
      milestoneName,
      stats.open_issues,
      config,
    );
    allWarnings.push(...warnings);
  }

  // Post warning if any milestones are at capacity
  if (allWarnings.length > 0) {
    await postCapacityWarning(
      github,
      owner,
      repoName,
      item.number,
      allWarnings,
    );

    // Log summary
    const errorCount = allWarnings.filter((w) => w.level === "error").length;
    const warnCount = allWarnings.filter((w) => w.level === "warn").length;
    console.warn(
      `Capacity warnings: ${errorCount} error(s), ${warnCount} warning(s)`,
    );
  }

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      [`capacity_checked=true`, `capacity_warnings=${allWarnings.length}`].join(
        "\n",
      ) + "\n",
    );
  }

  return {
    checked: true,
    warnings: allWarnings,
  };
}

if (require.main === module) {
  run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { postCapacityWarning, getMilestoneStats };
