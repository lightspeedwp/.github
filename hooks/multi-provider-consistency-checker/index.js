#!/usr/bin/env node
/**
 * Multi-Provider Consistency Checker Hook
 *
 * Detects divergences across an agent's provider configurations. Ensures the
 * shared core prompt exists and that every provider declared in AGENT.md has a
 * corresponding config file.
 *
 * Optionally enforces content parity: when an agent ships a `consistency.json`
 * declaring shared phrases, each phrase must appear in every file listed. This
 * catches drift in text an agent deliberately restates in more than one place
 * (e.g. a taxonomy repeated in the core prompt, AGENT.md and a skill), which
 * file-presence checks alone cannot detect.
 *
 * @module hooks/multi-provider-consistency-checker
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const ALL_PROVIDERS = ["claude", "copilot", "openai", "gemini"];
const MIN_PROVIDERS = 2;
const CONSISTENCY_FILE = "consistency.json";

/**
 * Collapse all whitespace runs to single spaces so a phrase still matches when
 * it is line-wrapped differently between files.
 *
 * @param {string} text Raw text.
 * @returns {string} Whitespace-normalised text.
 */
function normaliseWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Enforce declared shared-phrase parity across an agent's files.
 *
 * No-ops when the agent ships no `consistency.json`, so agents that declare
 * nothing are unaffected.
 *
 * @param {string} agentPath Path to the agent directory.
 * @returns {{errors: string[], warnings: string[]}}
 */
function checkSharedPhrases(agentPath) {
  const errors = [];
  const warnings = [];
  const configPath = path.join(agentPath, CONSISTENCY_FILE);
  if (!fs.existsSync(configPath)) return { errors, warnings };

  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    errors.push(`${CONSISTENCY_FILE} is not valid JSON: ${error.message}`);
    return { errors, warnings };
  }

  const phrases = Array.isArray(config.sharedPhrases)
    ? config.sharedPhrases
    : [];
  if (phrases.length === 0) {
    warnings.push(`${CONSISTENCY_FILE} declares no sharedPhrases`);
    return { errors, warnings };
  }

  for (const phrase of phrases) {
    const { name, text, files } = phrase || {};
    if (!name || !text || !Array.isArray(files) || files.length < 2) {
      errors.push(
        `${CONSISTENCY_FILE}: each sharedPhrases entry needs 'name', 'text', and at least two 'files'`,
      );
      continue;
    }
    const needle = normaliseWhitespace(text);
    for (const relative of files) {
      const target = path.join(agentPath, relative);
      if (!fs.existsSync(target)) {
        errors.push(`Shared phrase '${name}' references missing ${relative}`);
        continue;
      }
      const haystack = normaliseWhitespace(fs.readFileSync(target, "utf8"));
      if (!haystack.includes(needle)) {
        errors.push(
          `Shared phrase '${name}' is out of sync: ${relative} does not contain the declared text`,
        );
      }
    }
  }

  return { errors, warnings };
}

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
    if (!ALL_PROVIDERS.includes(provider)) {
      errors.push(
        `Unsupported provider '${provider}' declared in AGENT.md (allowed: ${ALL_PROVIDERS.join(", ")})`,
      );
      continue;
    }
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

  const parity = checkSharedPhrases(agentPath);
  errors.push(...parity.errors);
  warnings.push(...parity.warnings);

  return { valid: errors.length === 0, errors, warnings };
}

module.exports = {
  name: "multi-provider-consistency-checker",
  description: "Detects divergences across provider configurations",
  validate,
  checkSharedPhrases,
  normaliseWhitespace,
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
