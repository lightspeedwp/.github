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

function main() {
  const configPath = process.env.ISSUE_FIELDS_CONFIG
    ? path.resolve(process.env.ISSUE_FIELDS_CONFIG)
    : path.resolve(".github/issue-fields.yml");

  const cfg = readConfig(configPath);
  const labels = (process.env.LABELS || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const eventName = process.env.EVENT_NAME || "";
  const eventAction = process.env.EVENT_ACTION || "";
  const prMerged = (process.env.PR_MERGED || "false").toLowerCase() === "true";

  const mappings = cfg.project_field_mappings || {};

  let status = firstMatch(labels, mappings.Status);
  const priority = firstMatch(labels, mappings.Priority);
  let type = firstMatch(labels, mappings.Type);

  if (eventName === "issues" && eventAction === "closed") {
    status = mappings.Status?.[cfg.defaults?.issue?.status_label_closed] || "Done";
  }

  if (eventName === "pull_request" && eventAction === "closed" && prMerged) {
    status =
      mappings.Status?.[cfg.defaults?.pull_request?.status_label_merged] || "Done";
  }

  if (!status) status = mappings.Status?.["status:needs-triage"] || "Triage";
  if (!type) type = "";

  const output = process.env.GITHUB_OUTPUT;
  const lines = [
    `status=${status}`,
    `priority=${priority || ""}`,
    `type=${type}`,
  ];

  if (output) {
    fs.appendFileSync(output, `${lines.join("\n")}\n`);
  } else {
    for (const line of lines) console.log(line);
  }
}

main();
