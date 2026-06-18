#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function readConfig(configPath) {
  const raw = fs.readFileSync(configPath, "utf8");
  return yaml.load(raw);
}

function firstMatch(labels, mapping) {
  if (!mapping || typeof mapping !== "object") return "";
  for (const label of labels) {
    if (Object.prototype.hasOwnProperty.call(mapping, label)) {
      return mapping[label];
    }
  }
  return "";
}

function deriveProjectFieldValues({
  cfg,
  labels = [],
  eventName = "",
  eventAction = "",
  prMerged = false,
  itemCreatedAt = "",
  milestoneDueOn = "",
} = {}) {
  const mappings = cfg.project_field_mappings || {};
  const orgFields = cfg.organization_issue_fields || {};
  const customFields = Array.isArray(orgFields.custom_fields)
    ? orgFields.custom_fields
    : [];
  const effortField = customFields.find((field) => field?.key === "Effort") || {};
  const effortDefault = typeof effortField.default === "string" ? effortField.default : "";

  let status = firstMatch(labels, mappings.Status);
  const priority = firstMatch(labels, mappings.Priority);
  let type = firstMatch(labels, mappings.Type);
  let effort = effortDefault;
  let startDate = "";
  let targetDate = "";

  const isKickoff =
    labels.includes("status:ready") || labels.includes("status:in-progress");

  if (eventName === "issues" && eventAction === "closed") {
    status = mappings.Status?.[cfg.defaults?.issue?.status_label_closed] || "Done";
  }

  if (eventName === "pull_request" && eventAction === "closed" && prMerged) {
    status =
      mappings.Status?.[cfg.defaults?.pull_request?.status_label_merged] || "Done";
  }

  if (!status) status = mappings.Status?.["status:needs-triage"] || "Triage";
  if (!type) type = "";

  if (itemCreatedAt && isKickoff && status !== "Done") {
    startDate = itemCreatedAt.slice(0, 10);
  }

  if (milestoneDueOn && isKickoff && status !== "Done") {
    targetDate = milestoneDueOn.slice(0, 10);
  }

  return {
    status,
    priority,
    type,
    effort,
    startDate,
    targetDate,
  };
}

function main() {
  const configPath = process.env.ISSUE_FIELDS_CONFIG
    ? path.resolve(process.env.ISSUE_FIELDS_CONFIG)
    : path.resolve(".github/issue-fields.yml");

  const cfg = readConfig(configPath);
  const labels = (process.env.LABELS || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const result = deriveProjectFieldValues({
    cfg,
    labels,
    eventName: process.env.EVENT_NAME || "",
    eventAction: process.env.EVENT_ACTION || "",
    prMerged: (process.env.PR_MERGED || "false").toLowerCase() === "true",
    itemCreatedAt: process.env.ITEM_CREATED_AT || "",
    milestoneDueOn: process.env.ITEM_MILESTONE_DUE_ON || "",
  });

  const output = process.env.GITHUB_OUTPUT;
  const lines = [
    `status=${result.status}`,
    `priority=${result.priority || ""}`,
    `type=${result.type}`,
    `effort=${result.effort || ""}`,
    `start_date=${result.startDate}`,
    `target_date=${result.targetDate}`,
  ];

  if (output) {
    fs.appendFileSync(output, `${lines.join("\n")}\n`);
  } else {
    for (const line of lines) console.log(line);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  deriveProjectFieldValues,
  firstMatch,
  readConfig,
};
