#!/usr/bin/env node
/**
 * Agent Spec Validator Hook
 *
 * Validates an agent's AGENT.md YAML frontmatter for the required
 * multi-provider fields and value formats.
 *
 * @module hooks/agent-spec-validator
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const REQUIRED_FIELDS = ["name", "description", "providers", "capabilities"];
const VALID_PROVIDERS = ["claude", "copilot", "openai", "gemini"];
const VALID_STATUSES = ["active", "deprecated", "draft", "experimental"];
const SEMVER = /^[0-9]+\.[0-9]+\.[0-9]+$/;

/**
 * Validate the AGENT.md file inside an agent directory.
 * @param {string} agentPath Absolute or relative path to the agent directory.
 * @returns {{valid: boolean, errors: string[], warnings: string[]}}
 */
function validate(agentPath) {
  const errors = [];
  const warnings = [];
  const agentMdPath = path.join(agentPath, "AGENT.md");

  if (!fs.existsSync(agentMdPath)) {
    return { valid: false, errors: ["AGENT.md not found"], warnings };
  }

  const content = fs.readFileSync(agentMdPath, "utf8");
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return { valid: false, errors: ["No YAML frontmatter found"], warnings };
  }

  let frontmatter;
  try {
    frontmatter = yaml.load(match[1]);
  } catch (error) {
    return {
      valid: false,
      errors: [`YAML parse error: ${error.message}`],
      warnings,
    };
  }

  for (const field of REQUIRED_FIELDS) {
    const value = frontmatter ? frontmatter[field] : undefined;
    if (value === undefined || value === null || value === "") {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (Array.isArray(frontmatter.providers)) {
    const invalid = frontmatter.providers.filter(
      (p) => !VALID_PROVIDERS.includes(p),
    );
    if (invalid.length > 0) {
      errors.push(
        `Invalid providers: ${invalid.join(", ")} (allowed: ${VALID_PROVIDERS.join(", ")})`,
      );
    }
    if (frontmatter.providers.length < 1) {
      errors.push("At least one provider is required");
    }
  } else if (frontmatter.providers !== undefined) {
    errors.push("Field 'providers' must be an array");
  }

  if (frontmatter.version && !SEMVER.test(String(frontmatter.version))) {
    errors.push(
      `Invalid version '${frontmatter.version}' (expected semantic version X.Y.Z)`,
    );
  }

  if (frontmatter.status && !VALID_STATUSES.includes(frontmatter.status)) {
    errors.push(
      `Invalid status '${frontmatter.status}' (allowed: ${VALID_STATUSES.join(", ")})`,
    );
  }

  if (frontmatter.capabilities !== undefined) {
    if (!Array.isArray(frontmatter.capabilities)) {
      errors.push("Field 'capabilities' must be an array");
    } else if (frontmatter.capabilities.length === 0) {
      errors.push("At least one capability is required");
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

module.exports = {
  name: "agent-spec-validator",
  description: "Validates agent AGENT.md YAML frontmatter",
  validate,
};

if (require.main === module) {
  const target = process.argv[2] || process.cwd();
  const result = validate(target);
  for (const w of result.warnings) console.warn(`⚠️  ${w}`);
  if (result.valid) {
    console.log(`✅ agent-spec-validator: ${target} is valid`);
    process.exit(0);
  }
  console.error(`❌ agent-spec-validator: ${target}`);
  for (const e of result.errors) console.error(`- ${e}`);
  process.exit(1);
}
