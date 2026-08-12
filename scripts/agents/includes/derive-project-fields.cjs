#!/usr/bin/env node
/* global console, process */
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

const BRANCH_PREFIX_TYPE_MAP = {
  "feat/": "type:feature",
  "feature/": "type:feature",
  "fix/": "type:bug",
  "bugfix/": "type:bug",
  "hotfix/": "type:bug",
  "docs/": "type:documentation",
  "doc/": "type:documentation",
  "test/": "type:test",
  "tests/": "type:test",
  "perf/": "type:performance",
  "refactor/": "type:refactor",
  "chore/": "type:chore",
  "ci/": "type:ci",
  "deps/": "type:dependency",
  "build/": "type:build",
  "security/": "type:security",
  "a11y/": "type:a11y",
};

const TYPE_KEYWORDS = [
  {
    label: "type:bug",
    patterns: [/\b(bug|defect|error|crash|broken|failure|fix)\b/i],
  },
  {
    label: "type:feature",
    patterns: [
      /\b(feature|enhancement|improvement|add|implement|build|develop)\b/i,
    ],
  },
  {
    label: "type:documentation",
    patterns: [
      /\b(documentation|docs|readme|guide|tutorial|document|explain|clarify)\b/i,
    ],
  },
  {
    label: "type:test",
    patterns: [/\b(test|testing|coverage|unit test|integration test|qa)\b/i],
  },
  {
    label: "type:performance",
    patterns: [
      /\b(performance|perf|optimi[sz]e|latency|slow|bottleneck|speed)\b/i,
    ],
  },
  {
    label: "type:security",
    patterns: [
      /\b(security|vulnerability|exploit|cve|ghsa|credential|token|password)\b/i,
    ],
  },
  {
    label: "type:refactor",
    patterns: [/\b(refactor|restructure|cleanup|simplify|moderni[sz]e)\b/i],
  },
  {
    label: "type:chore",
    patterns: [/\b(chore|maintenance|cleanup|housekeeping|tidy)\b/i],
  },
  {
    label: "type:automation",
    patterns: [/\b(automation|workflow|action|bot|script|pipeline)\b/i],
  },
  {
    label: "type:integration",
    patterns: [/\b(integration|dependency|compatibility|interop)\b/i],
  },
  {
    label: "type:release",
    patterns: [/\b(release|version bump|tag|publish)\b/i],
  },
  {
    label: "type:a11y",
    patterns: [/\b(a11y|accessibility|wcag)\b/i],
  },
];

const PRIORITY_KEYWORDS = [
  {
    label: "priority:critical",
    patterns: [/\b(critical|urgent|blocking|asap|severe)\b/i],
  },
  {
    label: "priority:important",
    patterns: [/\b(high priority|important|priority\s*1|p1)\b/i],
  },
  {
    label: "priority:minor",
    patterns: [/\b(low priority|minor|cosmetic|nice to have|p3)\b/i],
  },
];

function inferMappedValueFromText(text, rules, mapping) {
  const haystack = String(text || "");
  for (const rule of rules) {
    if (rule.patterns.some((pattern) => pattern.test(haystack))) {
      return mapping?.[rule.label] || "";
    }
  }
  return "";
}

function inferTypeFromContext({
  labels = [],
  title = "",
  body = "",
  headRef = "",
  mappings = {},
} = {}) {
  const labelType = firstMatch(labels, mappings.Type);
  if (labelType) return labelType;

  const lowerHeadRef = String(headRef || "").toLowerCase();
  for (const [prefix, typeLabel] of Object.entries(BRANCH_PREFIX_TYPE_MAP)) {
    if (lowerHeadRef.startsWith(prefix)) {
      return mappings.Type?.[typeLabel] || "";
    }
  }

  const titleMatch = inferMappedValueFromText(
    title,
    TYPE_KEYWORDS,
    mappings.Type,
  );
  if (titleMatch) return titleMatch;

  const bodyMatch = inferMappedValueFromText(
    body,
    TYPE_KEYWORDS,
    mappings.Type,
  );
  if (bodyMatch) return bodyMatch;

  return "";
}

function inferPriorityFromContext({
  labels = [],
  title = "",
  body = "",
  mappings = {},
} = {}) {
  const labelPriority = firstMatch(labels, mappings.Priority);
  if (labelPriority) return labelPriority;

  const titleMatch = inferMappedValueFromText(
    title,
    PRIORITY_KEYWORDS,
    mappings.Priority,
  );
  if (titleMatch) return titleMatch;

  const bodyMatch = inferMappedValueFromText(
    body,
    PRIORITY_KEYWORDS,
    mappings.Priority,
  );
  if (bodyMatch) return bodyMatch;

  return mappings.Priority?.["priority:normal"] || "Normal";
}

function deriveProjectFieldValues({
  cfg,
  labels = [],
  eventName = "",
  eventAction = "",
  prMerged = false,
  itemCreatedAt = "",
  milestoneDueOn = "",
  title = "",
  body = "",
  headRef = "",
} = {}) {
  const mappings = cfg.project_field_mappings || {};
  const orgFields = cfg.organization_issue_fields || {};
  const customFields = Array.isArray(orgFields.custom_fields)
    ? orgFields.custom_fields
    : [];
  const effortField =
    customFields.find((field) => field?.key === "Effort") || {};
  const effortDefault =
    typeof effortField.default === "string" ? effortField.default : "";

  let status = firstMatch(labels, mappings.Status);
  let priority = inferPriorityFromContext({ labels, title, body, mappings });
  let type = inferTypeFromContext({ labels, title, body, headRef, mappings });
  let effort = effortDefault;
  let startDate = "";
  let targetDate = "";

  const isKickoff =
    labels.includes("status:ready") || labels.includes("status:in-progress");

  if (eventName === "issues" && eventAction === "closed") {
    status =
      mappings.Status?.[cfg.defaults?.issue?.status_label_closed] || "Done";
  }

  if (eventName === "pull_request" && eventAction === "closed" && prMerged) {
    status =
      mappings.Status?.[cfg.defaults?.pull_request?.status_label_merged] ||
      "Done";
  }

  if (!status) {
    if (eventName === "pull_request") {
      status =
        mappings.Status?.[cfg.defaults?.pull_request?.status_label_open] ||
        mappings.Status?.["status:needs-review"] ||
        "In review";
    } else {
      status = mappings.Status?.["status:needs-triage"] || "Triage";
    }
  }

  if (!type) {
    type =
      eventName === "pull_request"
        ? mappings.Type?.[cfg.defaults?.pull_request?.type_label] || "Chore"
        : mappings.Type?.[cfg.defaults?.issue?.type_label] || "Task";
  }

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

function run() {
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
    title: process.env.ITEM_TITLE || "",
    body: process.env.ITEM_BODY || "",
    headRef: process.env.PR_HEAD_REF || "",
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
  run();
}

module.exports = {
  deriveProjectFieldValues,
  inferPriorityFromContext,
  inferTypeFromContext,
  firstMatch,
  readConfig,
  run,
};
