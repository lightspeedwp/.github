#!/usr/bin/env node
/**
 * Multi-Provider Consistency Checker Hook
 *
 * Detects divergences across an agent's provider configurations. Ensures the
 * shared core prompt exists and that every provider declared in AGENT.md has a
 * corresponding config file.
 *
 * @module hooks/multi-provider-consistency-checker
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const ALL_PROVIDERS = ["claude", "copilot", "openai", "gemini"];
const MIN_PROVIDERS = 2;

function readProviders(agentPath) {
  const agentMdPath = path.join(agentPath, "AGENT.md");
  if (!fs.existsSync(agentMdPath)) return [];
  const content = fs.readFileSync(agentMdPath, "utf8");
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return [];
  try {
    const fm = yaml.load(match[1]);
    return Array.isArray(fm.providers) ? fm.providers : [];
  } catch (error) {
    return [];
  }
}

/**
 * @param {string} agentPath Path to the agent directory.
 * @returns {{valid: boolean, errors: string[], warnings: string[]}}
 */
function validate(agentPath) {
  const errors = [];
  const warnings = [];

  const corePrompt = path.join(agentPath, "shared", "core-prompt.md");
  if (!fs.existsSync(corePrompt)) {
    errors.push("Missing shared/core-prompt.md (provider-agnostic core)");
  }

  const declared = readProviders(agentPath);
  if (declared.length === 0) {
    errors.push("AGENT.md declares no providers");
  }

  for (const provider of declared) {
    if (!ALL_PROVIDERS.includes(provider)) continue;
    const configPath = path.join(agentPath, provider, "agent.md");
    if (!fs.existsSync(configPath)) {
      errors.push(
        `Declared provider '${provider}' has no ${provider}/agent.md config`,
      );
    }
  }

  const present = ALL_PROVIDERS.filter((p) =>
    fs.existsSync(path.join(agentPath, p, "agent.md")),
  );
  if (present.length < MIN_PROVIDERS) {
    errors.push(
      `Insufficient provider coverage: ${present.length}/${ALL_PROVIDERS.length} (minimum ${MIN_PROVIDERS})`,
    );
  }

  for (const p of present) {
    if (!declared.includes(p)) {
      warnings.push(
        `Provider config ${p}/agent.md is not declared in AGENT.md`,
      );
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

module.exports = {
  name: "multi-provider-consistency-checker",
  description: "Detects divergences across provider configurations",
  validate,
};

if (require.main === module) {
  const target = process.argv[2] || process.cwd();
  const result = validate(target);
  for (const w of result.warnings) console.warn(`⚠️  ${w}`);
  if (result.valid) {
    console.log(
      `✅ multi-provider-consistency-checker: ${target} is consistent`,
    );
    process.exit(0);
  }
  console.error(`❌ multi-provider-consistency-checker: ${target}`);
  for (const e of result.errors) console.error(`- ${e}`);
  process.exit(1);
}
