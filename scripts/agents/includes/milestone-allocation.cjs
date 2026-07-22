#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function readConfig(configPath) {
  const fullPath = path.resolve(configPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Config file not found: ${fullPath}`);
  }
  return yaml.load(fs.readFileSync(fullPath, "utf8"));
}

function getMilestoneForIssue(issue, config) {
  const milestoneStrategy = config?.milestone_strategy || {};
  const allocation = milestoneStrategy.allocation || {};
  const labels = issue.labels.map((l) => l.name || l);

  // Check if issue has a high-priority label
  const highPriorityLabels = allocation.high_priority_labels || [];
  if (
    highPriorityLabels.some((label) => labels.includes(label))
  ) {
    return allocation.next_milestone || "v1.0";
  }

  // Check if issue should go to backlog
  const backlogLabels = allocation.backlog_labels || [];
  if (backlogLabels.some((label) => labels.includes(label))) {
    return allocation.backlog_milestone || null;
  }

  // Default allocation
  return allocation.default_milestone || null;
}

function getProjectForIssue(issue, config) {
  const routes = config?.routes || [];

  // Get issue type from the type field or extract from labels
  const issueType = issue.type || extractTypeFromLabels(issue.labels);
  const labels = issue.labels.map((l) => l.name || l);

  for (const route of routes) {
    if (!route.enabled) continue;

    const filter = route.filter || {};

    // Check type filter
    if (filter.type && Array.isArray(filter.type)) {
      if (filter.type.includes(issueType)) {
        return route.project_url;
      }
    }

    // Check label filter
    if (filter.label && Array.isArray(filter.label)) {
      if (filter.label.some((label) => labels.includes(label))) {
        return route.project_url;
      }
    }
  }

  // Fall back to default project
  return config?.default_project?.url || null;
}

function extractTypeFromLabels(labels) {
  const labelNames = labels.map((l) => l.name || l);
  const typeLabel = labelNames.find((l) => l.startsWith("type:"));
  if (typeLabel) {
    return typeLabel.replace("type:", "");
  }
  return null;
}

function checkMilestoneCapacity(milestoneName, openIssuesCount, config) {
  const milestoneStrategy = config?.milestone_strategy || {};
  const capacity = milestoneStrategy.capacity || {};
  const warnThreshold = capacity.warn_threshold || 50;
  const errorThreshold = capacity.error_threshold || 100;

  const warnings = [];

  if (openIssuesCount >= errorThreshold) {
    warnings.push({
      level: "error",
      milestone: milestoneName,
      count: openIssuesCount,
      message: `Milestone '${milestoneName}' exceeds error threshold (${openIssuesCount} >= ${errorThreshold} issues)`,
    });
  } else if (openIssuesCount >= warnThreshold) {
    warnings.push({
      level: "warn",
      milestone: milestoneName,
      count: openIssuesCount,
      message: `Milestone '${milestoneName}' approaching capacity (${openIssuesCount} >= ${warnThreshold} issues)`,
    });
  }

  return warnings;
}

function getActiveMilestones(config) {
  const milestoneStrategy = config?.milestone_strategy || {};
  return milestoneStrategy.active_milestones || [];
}

module.exports = {
  readConfig,
  getMilestoneForIssue,
  getProjectForIssue,
  extractTypeFromLabels,
  checkMilestoneCapacity,
  getActiveMilestones,
};
