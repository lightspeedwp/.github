#!/usr/bin/env node
/* global console, process */
/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const { getOctokit } = require("@actions/github");
const {
  readConfig,
  getMilestoneForIssue,
} = require("./milestone-allocation.cjs");

function getItemFromEvent(event) {
  if (event.pull_request) {
    return {
      kind: "pull_request",
      number: event.pull_request.number,
      title: event.pull_request.title || "",
      body: event.pull_request.body || "",
      labels: Array.isArray(event.pull_request.labels)
        ? event.pull_request.labels
        : [],
      milestone: event.pull_request.milestone || null,
      type: event.pull_request.type || null,
    };
  }

  return {
    kind: "issue",
    number: event.issue.number,
    title: event.issue.title || "",
    body: event.issue.body || "",
    labels: Array.isArray(event.issue.labels) ? event.issue.labels : [],
    milestone: event.issue.milestone || null,
    type: event.issue.type || null,
  };
}

async function getMilestoneByTitle(github, owner, repo, title) {
  if (!title) return null;

  try {
    const { data: milestones } = await github.rest.issues.listMilestones({
      owner,
      repo,
      state: "open",
      per_page: 100,
    });

    return milestones.find((m) => m.title === title) || null;
  } catch (error) {
    console.info(`Could not fetch milestones: ${error.message}`);
    return null;
  }
}

async function allocateMilestone({
  github,
  owner,
  repo,
  item,
  milestoneTitle,
}) {
  if (!milestoneTitle) {
    console.info(`#${item.number}: No milestone allocation required (backlog)`);
    return null;
  }

  // Skip if item already has a milestone
  if (item.milestone) {
    console.info(
      `#${item.number}: Already has milestone '${item.milestone.title}', skipping allocation`,
    );
    return item.milestone.title;
  }

  try {
    const milestone = await getMilestoneByTitle(
      github,
      owner,
      repo,
      milestoneTitle,
    );

    if (!milestone) {
      console.warn(
        `#${item.number}: Milestone '${milestoneTitle}' not found, skipping allocation`,
      );
      return null;
    }

    await github.rest.issues.update({
      owner,
      repo,
      issue_number: item.number,
      milestone: milestone.number,
    });

    console.info(`#${item.number}: Allocated to milestone '${milestoneTitle}'`);
    return milestoneTitle;
  } catch (error) {
    console.warn(
      `#${item.number}: Could not allocate to milestone '${milestoneTitle}': ${error.message}`,
    );
    return null;
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

  // Only allocate on issue/PR open or reopen (not on edit/sync)
  const shouldAllocate =
    event.action === "opened" || event.action === "reopened";

  if (!shouldAllocate) {
    console.info(
      `#${item.number}: Skipping allocation (action: ${event.action})`,
    );
    return { allocated: false, milestone: item.milestone?.title || "" };
  }

  const targetMilestone = getMilestoneForIssue(item, config);
  const allocated = await allocateMilestone({
    github,
    owner,
    repo: repoName,
    item,
    milestoneTitle: targetMilestone,
  });

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      [
        `milestone_allocated=${allocated ? "true" : "false"}`,
        `milestone_title=${allocated || ""}`,
      ].join("\n") + "\n",
    );
  }

  return {
    allocated: !!allocated,
    milestone: allocated || "",
  };
}

if (require.main === module) {
  run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { allocateMilestone, getMilestoneByTitle };
