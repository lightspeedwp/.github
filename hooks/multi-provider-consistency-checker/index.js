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
  return String(text).replace(/\s+/g, " ").trim();
}

/**
 * Resolve a declared relative path strictly beneath `baseDir`.
 *
 * `consistency.json` is PR-controlled, so a declared path must not be able to
 * reach outside the agent directory. Without this, the pass/fail result acts as
 * a boolean oracle over the contents of any file the runner can read — a
 * low-bandwidth way to confirm secrets in CI. Symlinks are resolved and
 * re-checked, because a link inside the agent directory can still point out.
 *
 * @param {string} baseDir Directory the path must stay within.
 * @param {string} relative Declared relative path.
 * @returns {{path: string}|{error: 'escapes'|'missing'|'not-a-file'}}
 */
function resolveWithin(baseDir, relative) {
  let base;
  try {
    base = fs.realpathSync(baseDir);
  } catch {
    return { error: "missing" };
  }

  const contained = (candidate) => {
    const rel = path.relative(base, candidate);
    return rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel);
  };

  // Absolute declared paths resolve away from base and are rejected here too.
  const candidate = path.resolve(base, relative);
  if (!contained(candidate)) return { error: "escapes" };
  if (!fs.existsSync(candidate)) return { error: "missing" };

  let real;
  try {
    real = fs.realpathSync(candidate);
  } catch {
    return { error: "missing" };
  }
  if (!contained(real)) return { error: "escapes" };
  if (!fs.statSync(real).isFile()) return { error: "not-a-file" };

  return { path: real };
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

  if (config === null || typeof config !== "object" || Array.isArray(config)) {
    errors.push(`${CONSISTENCY_FILE} must contain a JSON object at the root`);
    return { errors, warnings };
  }

  if (
    config.sharedPhrases !== undefined &&
    !Array.isArray(config.sharedPhrases)
  ) {
    errors.push(`${CONSISTENCY_FILE}: 'sharedPhrases' must be an array`);
    return { errors, warnings };
  }

  const phrases = config.sharedPhrases || [];
  if (phrases.length === 0) {
    warnings.push(`${CONSISTENCY_FILE} declares no sharedPhrases`);
    return { errors, warnings };
  }

  const isNonEmptyString = (value) =>
    typeof value === "string" && value.trim() !== "";

  for (const [index, phrase] of phrases.entries()) {
    if (
      phrase === null ||
      typeof phrase !== "object" ||
      Array.isArray(phrase)
    ) {
      errors.push(
        `${CONSISTENCY_FILE}: sharedPhrases[${index}] must be an object`,
      );
      continue;
    }

    const { name, text, files } = phrase;
    if (!isNonEmptyString(name) || !isNonEmptyString(text)) {
      errors.push(
        `${CONSISTENCY_FILE}: sharedPhrases[${index}] needs non-empty string 'name' and 'text'`,
      );
      continue;
    }
    if (!Array.isArray(files) || files.length < 2) {
      errors.push(
        `${CONSISTENCY_FILE}: shared phrase '${name}' needs at least two 'files'`,
      );
      continue;
    }
    if (!files.every(isNonEmptyString)) {
      errors.push(
        `${CONSISTENCY_FILE}: shared phrase '${name}' has a non-string entry in 'files'`,
      );
      continue;
    }

    const needle = normaliseWhitespace(text);
    for (const relative of files) {
      const resolved = resolveWithin(agentPath, relative);
      if (resolved.error === "escapes") {
        errors.push(
          `Shared phrase '${name}' declares ${relative}, which resolves outside the agent directory`,
        );
        continue;
      }
      if (resolved.error === "missing") {
        errors.push(`Shared phrase '${name}' references missing ${relative}`);
        continue;
      }
      if (resolved.error === "not-a-file") {
        errors.push(
          `Shared phrase '${name}' declares ${relative}, which is not a regular file`,
        );
        continue;
      }

      const haystack = normaliseWhitespace(
        fs.readFileSync(resolved.path, "utf8"),
      );
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
  } catch (_error) {
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
  resolveWithin,
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
