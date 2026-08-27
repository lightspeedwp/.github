#!/usr/bin/env node
/**
 * Plugin Integrity Checker Hook
 *
 * Validates a plugin's manifests and folder structure: the four provider
 * manifests must exist and be valid JSON, and any agent/skill refs they declare
 * must resolve to real files.
 *
 * @module hooks/plugin-integrity-checker
 */

const fs = require("fs");
const path = require("path");

const REQUIRED_MANIFESTS = [
  "copilot-plugin.json",
  ".claude-plugin/plugin.json",
  ".codex-plugin/plugin.json",
  ".gemini-plugin/plugin.json",
];

function collectRefs(data) {
  const refs = [];
  if (Array.isArray(data.agents)) refs.push(...data.agents);
  if (Array.isArray(data.skills)) refs.push(...data.skills);
  if (data.includes) {
    if (Array.isArray(data.includes.agents)) refs.push(...data.includes.agents);
    if (Array.isArray(data.includes.skills)) refs.push(...data.includes.skills);
  }
  return refs.filter((ref) => typeof ref === "string");
}

/**
 * @param {string} pluginPath Path to the plugin directory.
 * @returns {{valid: boolean, errors: string[], warnings: string[]}}
 */
function validate(pluginPath) {
  const errors = [];
  const warnings = [];

  for (const manifest of REQUIRED_MANIFESTS) {
    const manifestPath = path.join(pluginPath, manifest);
    if (!fs.existsSync(manifestPath)) {
      errors.push(`Missing plugin manifest: ${manifest}`);
      continue;
    }
    let data;
    try {
      data = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    } catch (error) {
      errors.push(`Invalid JSON in ${manifest}: ${error.message}`);
      continue;
    }
    for (const ref of collectRefs(data)) {
      if (ref.startsWith("/") || ref.includes("..")) {
        errors.push(`Unsafe manifest path in ${manifest}: ${ref}`);
        continue;
      }
      if (!fs.existsSync(path.join(pluginPath, ref))) {
        errors.push(`Missing referenced file in ${manifest}: ${ref}`);
      }
    }
  }

  const readmePath = path.join(pluginPath, "README.md");
  if (!fs.existsSync(readmePath)) {
    warnings.push("Missing README.md");
  }

  return { valid: errors.length === 0, errors, warnings };
}

module.exports = {
  name: "plugin-integrity-checker",
  description: "Validates plugin manifests and structure",
  validate,
};

if (require.main === module) {
  const target = process.argv[2] || process.cwd();
  const result = validate(target);
  for (const w of result.warnings) console.warn(`⚠️  ${w}`);
  if (result.valid) {
    console.log(`✅ plugin-integrity-checker: ${target} is valid`);
    process.exit(0);
  }
  console.error(`❌ plugin-integrity-checker: ${target}`);
  for (const e of result.errors) console.error(`- ${e}`);
  process.exit(1);
}
