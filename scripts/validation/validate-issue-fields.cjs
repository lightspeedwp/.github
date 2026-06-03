#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, ".github/issue-fields.yml");
const LABELS_PATH = path.join(ROOT, ".github/labels.yml");
const ISSUE_TYPES_PATH = path.join(ROOT, ".github/issue-types.yml");
const DOC_PATH = path.join(ROOT, "docs/ISSUE_FIELDS.md");

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`✅ ${msg}`);
}

function readFileSafe(p) {
  if (!fs.existsSync(p)) {
    fail(`Missing required file: ${path.relative(ROOT, p)}`);
    return null;
  }
  return fs.readFileSync(p, "utf8");
}

function parseYaml(raw, sourceLabel) {
  try {
    return yaml.load(raw);
  } catch (err) {
    fail(`Invalid YAML in ${sourceLabel}: ${err.message}`);
    return null;
  }
}

function collectKeys(obj) {
  return Object.keys(obj || {});
}

function collectLabelNames(labelsCfg) {
  if (!Array.isArray(labelsCfg)) {
    fail(
      ".github/labels.yml must contain a top-level array of label definitions",
    );
    return new Set();
  }

  return new Set(labelsCfg.map((label) => label?.name).filter(Boolean));
}

function collectIssueTypeLabels(issueTypesCfg) {
  const issueTypes = issueTypesCfg?.issue_types;
  if (!Array.isArray(issueTypes)) {
    fail(".github/issue-types.yml must contain an issue_types array");
    return new Set();
  }

  return new Set(
    issueTypes.map((issueType) => issueType?.label).filter(Boolean),
  );
}

function reportMissingFromSet(label, values, expectedSet) {
  const missing = values.filter((value) => !expectedSet.has(value));
  if (missing.length > 0) {
    fail(
      `${label} missing canonical entries (${missing.length}): ${missing.join(", ")}`,
    );
  }
}

function main() {
  const cfgRaw = readFileSafe(CONFIG_PATH);
  const labelsRaw = readFileSafe(LABELS_PATH);
  const issueTypesRaw = readFileSafe(ISSUE_TYPES_PATH);
  const docRaw = readFileSafe(DOC_PATH);
  if (!cfgRaw || !labelsRaw || !issueTypesRaw || !docRaw) return;

  const cfg = parseYaml(cfgRaw, ".github/issue-fields.yml");
  const labelsCfg = parseYaml(labelsRaw, ".github/labels.yml");
  const issueTypesCfg = parseYaml(issueTypesRaw, ".github/issue-types.yml");
  if (!cfg || !labelsCfg || !issueTypesCfg) return;

  const labelNames = collectLabelNames(labelsCfg);
  const issueTypeLabels = collectIssueTypeLabels(issueTypesCfg);

  const requiredTopLevel = [
    "version",
    "description",
    "organization",
    "defaults",
    "project_field_mappings",
    "organization_issue_fields",
    "project_fields",
    "profiles",
  ];
  for (const key of requiredTopLevel) {
    if (!(key in cfg))
      fail(`Missing top-level key in issue-fields config: ${key}`);
  }

  if (cfg.version !== 2)
    fail(`Expected issue-fields version 2, found: ${cfg.version}`);

  const issueDefaults = cfg.defaults?.issue || {};
  const prDefaults = cfg.defaults?.pull_request || {};
  const requiredIssueDefaults = [
    "assignee",
    "status_label_open",
    "status_label_closed",
    "priority_label",
    "type_label",
  ];
  const requiredPrDefaults = [
    "status_label_open",
    "status_label_merged",
    "priority_label",
    "type_label",
  ];

  for (const key of requiredIssueDefaults) {
    if (!issueDefaults[key]) fail(`Missing defaults.issue.${key}`);
  }
  for (const key of requiredPrDefaults) {
    if (!prDefaults[key]) fail(`Missing defaults.pull_request.${key}`);
  }

  const fieldMappings = cfg.project_field_mappings || {};
  for (const field of ["Status", "Priority", "Type"]) {
    if (!fieldMappings[field] || typeof fieldMappings[field] !== "object") {
      fail(`Missing or invalid project_field_mappings.${field}`);
    }
  }

  reportMissingFromSet(
    "project_field_mappings.Status",
    collectKeys(fieldMappings.Status),
    labelNames,
  );
  reportMissingFromSet(
    "project_field_mappings.Priority",
    collectKeys(fieldMappings.Priority),
    labelNames,
  );

  const mappedTypeLabels = collectKeys(fieldMappings.Type);
  reportMissingFromSet(
    "project_field_mappings.Type vs labels",
    mappedTypeLabels,
    labelNames,
  );
  reportMissingFromSet(
    "project_field_mappings.Type vs issue-types",
    mappedTypeLabels,
    issueTypeLabels,
  );

  const missingTypeMappings = [...issueTypeLabels].filter(
    (label) => !fieldMappings.Type?.[label],
  );
  if (missingTypeMappings.length > 0) {
    fail(
      `Canonical issue types missing Type projection mappings (${missingTypeMappings.length}): ${missingTypeMappings.join(", ")}`,
    );
  }

  const orgFields = cfg.organization_issue_fields || {};
  if (
    !Array.isArray(orgFields.enabled_issue_types) ||
    orgFields.enabled_issue_types.length === 0
  ) {
    fail(
      "organization_issue_fields.enabled_issue_types must be a non-empty array",
    );
  }
  if (
    !Array.isArray(orgFields.pinned_per_issue_type) ||
    orgFields.pinned_per_issue_type.length === 0
  ) {
    fail(
      "organization_issue_fields.pinned_per_issue_type must be a non-empty array",
    );
  }
  if (orgFields.pinned_per_issue_type.length > 10) {
    fail(
      "organization_issue_fields.pinned_per_issue_type exceeds GitHub limit (10)",
    );
  }

  const policy = orgFields.policy || {};
  if (policy.max_pinned_fields_per_issue_type !== 10) {
    fail(
      "organization_issue_fields.policy.max_pinned_fields_per_issue_type must be 10",
    );
  }
  if (policy.max_issue_fields_per_org !== 25) {
    fail(
      "organization_issue_fields.policy.max_issue_fields_per_org must be 25",
    );
  }
  if (policy.single_select_max_options !== 50) {
    fail(
      "organization_issue_fields.policy.single_select_max_options must be 50",
    );
  }
  if (policy.project_total_field_limit !== 50) {
    fail(
      "organization_issue_fields.policy.project_total_field_limit must be 50",
    );
  }

  const customFields = orgFields.custom_fields;
  if (!Array.isArray(customFields) || customFields.length === 0) {
    fail("organization_issue_fields.custom_fields must be a non-empty array");
  } else {
    const requiredCustomKeys = [
      "Domain",
      "Delivery Track",
      "Team",
      "Effort",
      "Start date",
      "Target date",
      "Risk",
      "Customer Impact",
      "Technical Impact",
      "Spec Link",
    ];
    const keySet = new Set(customFields.map((f) => f.key));
    for (const key of requiredCustomKeys) {
      if (!keySet.has(key))
        fail(`Missing required custom field definition: ${key}`);
    }

    const validTypes = new Set(["single_select", "date", "text"]);
    for (const field of customFields) {
      if (!field.key || typeof field.key !== "string")
        fail("Each custom field requires a string key");
      if (!field.type || !validTypes.has(field.type)) {
        fail(
          `Custom field "${field.key || "unknown"}" has invalid type "${field.type}"`,
        );
      }
      if (field.type === "single_select") {
        if (!Array.isArray(field.options) || field.options.length === 0) {
          fail(
            `Single select custom field "${field.key}" must include options`,
          );
        }
        if (field.options.length > 50) {
          fail(`Single select custom field "${field.key}" exceeds 50 options`);
        }
      }
    }
  }

  const projectFields = cfg.project_fields || {};
  const hiddenIssues = projectFields.hidden_fields_to_enable?.issues || [];
  for (const requiredHidden of [
    "Parent issue",
    "Sub-issue progress",
    "Linked pull requests",
    "Reviewers",
    "Type",
  ]) {
    if (!hiddenIssues.includes(requiredHidden)) {
      fail(
        `project_fields.hidden_fields_to_enable.issues missing "${requiredHidden}"`,
      );
    }
  }

  const iteration = projectFields.iteration_field || {};
  if (iteration.key !== "Sprint")
    fail('project_fields.iteration_field.key must be "Sprint"');
  if (iteration.type !== "iteration")
    fail('project_fields.iteration_field.type must be "iteration"');
  if (iteration.duration_weeks !== 2)
    fail("project_fields.iteration_field.duration_weeks must be 2");
  if (iteration.auto_create_new_iterations !== true) {
    fail(
      "project_fields.iteration_field.auto_create_new_iterations must be true",
    );
  }

  const docMustContain = [
    ".github/issue-fields.yml",
    ".github/workflows/project-meta-sync.yml",
    "dotgithub",
    "wordpress_block_theme",
    "wordpress_block_plugin",
    "Parent issue",
    "Sub-issue progress",
    "Linked pull requests",
    "Reviewers",
    "Type",
    "Sprint",
    "single_select",
    "date",
    "text",
  ];

  const effortField = customFields.find((field) => field.key === "Effort");
  if (!effortField) {
    fail("Missing required custom field definition: Effort");
  } else {
    if (effortField.type !== "single_select") {
      fail('Effort custom field must use type "single_select"');
    }
    const expectedEffort = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    const gotEffort = Array.isArray(effortField.options)
      ? effortField.options
      : [];
    for (const option of expectedEffort) {
      if (!gotEffort.includes(option)) {
        fail(`Effort custom field missing expected option: ${option}`);
      }
    }
  }

  const fieldUsage = orgFields.field_usage || {};
  for (const key of ["Priority", "Start date", "Target date", "Effort"]) {
    if (!fieldUsage[key]) {
      fail(`organization_issue_fields.field_usage missing key: ${key}`);
    }
  }

  for (const needle of docMustContain) {
    if (!docRaw.includes(needle)) {
      fail(`docs/ISSUE_FIELDS.md missing required reference: ${needle}`);
    }
  }

  const canonicalDocAnchors = [
    issueDefaults.assignee,
    issueDefaults.status_label_open,
    issueDefaults.status_label_closed,
    issueDefaults.priority_label,
    issueDefaults.type_label,
    prDefaults.status_label_open,
    prDefaults.status_label_merged,
    prDefaults.priority_label,
    prDefaults.type_label,
    ...collectKeys(fieldMappings.Status),
    ...collectKeys(fieldMappings.Priority),
    ...collectKeys(fieldMappings.Type).slice(0, 5),
    "Status",
    "Priority",
    "Type",
    "25",
    "50",
    "10",
  ];

  const missingLabelMentions = canonicalDocAnchors.filter(
    (label) => !docRaw.includes(label),
  );
  if (missingLabelMentions.length > 0) {
    fail(
      `docs/ISSUE_FIELDS.md is missing canonical label references (${missingLabelMentions.length}): ${missingLabelMentions.slice(0, 12).join(", ")}${missingLabelMentions.length > 12 ? ", ..." : ""}`,
    );
  }

  if (!process.exitCode) {
    ok("Issue-fields config YAML parsed and required structure is valid");
    ok("Cross-file label and issue-type parity checks passed");
    ok("docs/ISSUE_FIELDS.md references canonical mappings and profile keys");
  }
}

main();
