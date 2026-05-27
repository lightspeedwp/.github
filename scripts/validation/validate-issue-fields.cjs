#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, '.github/issue-fields.yml');
const DOC_PATH = path.join(ROOT, 'docs/ISSUE-FIELDS.md');

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
  return fs.readFileSync(p, 'utf8');
}

function parseYaml(raw) {
  try {
    return yaml.load(raw);
  } catch (err) {
    fail(`Invalid YAML in .github/issue-fields.yml: ${err.message}`);
    return null;
  }
}

function collectKeys(obj) {
  return Object.keys(obj || {});
}

function main() {
  const cfgRaw = readFileSafe(CONFIG_PATH);
  const docRaw = readFileSafe(DOC_PATH);
  if (!cfgRaw || !docRaw) return;

  const cfg = parseYaml(cfgRaw);
  if (!cfg) return;

  const requiredTopLevel = ['version', 'defaults', 'project_field_mappings', 'profiles'];
  for (const key of requiredTopLevel) {
    if (!(key in cfg)) fail(`Missing top-level key in issue-fields config: ${key}`);
  }

  const issueDefaults = cfg.defaults?.issue || {};
  const prDefaults = cfg.defaults?.pull_request || {};
  const requiredIssueDefaults = ['assignee', 'status_label_open', 'status_label_closed', 'priority_label', 'type_label'];
  const requiredPrDefaults = ['status_label_open', 'status_label_merged', 'priority_label', 'type_label'];

  for (const key of requiredIssueDefaults) {
    if (!issueDefaults[key]) fail(`Missing defaults.issue.${key}`);
  }
  for (const key of requiredPrDefaults) {
    if (!prDefaults[key]) fail(`Missing defaults.pull_request.${key}`);
  }

  const fieldMappings = cfg.project_field_mappings || {};
  for (const field of ['Status', 'Priority', 'Type']) {
    if (!fieldMappings[field] || typeof fieldMappings[field] !== 'object') {
      fail(`Missing or invalid project_field_mappings.${field}`);
    }
  }

  const docMustContain = [
    '.github/issue-fields.yml',
    '.github/workflows/project-meta-sync.yml',
    'dotgithub',
    'wordpress_block_theme',
    'wordpress_block_plugin',
  ];

  for (const needle of docMustContain) {
    if (!docRaw.includes(needle)) {
      fail(`docs/ISSUE-FIELDS.md missing required reference: ${needle}`);
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
    'Status',
    'Priority',
    'Type',
  ];

  const missingLabelMentions = canonicalDocAnchors.filter((label) => !docRaw.includes(label));
  if (missingLabelMentions.length > 0) {
    fail(
      `docs/ISSUE-FIELDS.md is missing canonical label references (${missingLabelMentions.length}): ${missingLabelMentions.slice(0, 12).join(', ')}${missingLabelMentions.length > 12 ? ', ...' : ''}`,
    );
  }

  if (!process.exitCode) {
    ok('Issue-fields config YAML parsed and required structure is valid');
    ok('docs/ISSUE-FIELDS.md references canonical mappings and profile keys');
  }
}

main();
