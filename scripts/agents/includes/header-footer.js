/**
 * header-footer.js
 * Header and footer insertion for the meta agent
 * Integrates functionality from includes/footerUtils.js
 */

// TODO: Align this helper with the latest automation spec updates.

import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";

/**
 * Resolve the canonical footer configuration path.
 */
function resolveFooterConfigPath() {
  const explicitPath = process.env.BRANDING_FOOTER_CONFIG?.trim();
  const projectRoot = process.cwd();
  const candidatePaths = [
    explicitPath ? path.resolve(explicitPath) : null,
    path.join(projectRoot, "config/footers.config.yaml"),
    path.join(projectRoot, ".github/automation/footers.yml"),
  ].filter(Boolean);

  return (
    candidatePaths.find((candidatePath) => fs.existsSync(candidatePath)) || null
  );
}

/**
 * Load footer configuration from the canonical branding config.
 */
function loadFooterConfig() {
  const configPath = resolveFooterConfigPath();
  if (!configPath) {
    return null;
  }

  const content = fs.readFileSync(configPath, "utf-8");
  return yaml.load(content);
}

/**
 * Standard footer variants (fallback if config not found)
 * NOTE: No references below the footer line — design policy requires quirky line only.
 */
const DEFAULT_FOOTERS = [
  "*Maintained by the 🤖 LightSpeedWP Automation Team*",
  "*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*",
  "*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*",
  "*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*",
  "*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*",
];

const DEFAULT_FOOTER_SIGNATURES = [
  "*Maintained by the 🤖",
  "*Built by 🧱",
  "*Have questions?",
  "*This page brought to you by",
  "*Docs signed by 🤖",
  "Maintained by the 🤖 LightSpeedWP Automation Team",
];

function getCanonicalFooterTemplates() {
  const config = loadFooterConfig();
  if (!config?.categories || !config?.footers) {
    return [];
  }

  return Object.entries(config.categories)
    .map(([, categoryConfig]) => config.footers[categoryConfig?.default_footer])
    .filter((footer) => typeof footer?.template === "string")
    .map((footer) => footer.template.trimEnd());
}

function getFooterSignatures() {
  const canonicalTemplates = getCanonicalFooterTemplates();
  const canonicalSignatures = canonicalTemplates
    .map((template) =>
      template
        .split("\n")
        .map((line) => line.trim())
        .find(Boolean),
    )
    .filter(Boolean);

  return [...new Set([...DEFAULT_FOOTER_SIGNATURES, ...canonicalSignatures])];
}

function stripFrontmatter(content) {
  return content.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

function extractFooterTail(content) {
  const stripped = stripFrontmatter(content);
  const lastSeparatorIndex = stripped.lastIndexOf("\n---\n");

  if (lastSeparatorIndex === -1) {
    return "";
  }

  return stripped.slice(lastSeparatorIndex + 1).trim();
}

function buildFooterBlock(footerText) {
  const trimmed = footerText.trimEnd();
  // Footer templates sourced from config/footers.config.yaml already include
  // their own leading `---` divider; the legacy DEFAULT_FOOTERS phrases do
  // not. Avoid emitting a duplicate divider for the former.
  if (/^---\s*\n/.test(trimmed)) {
    return `\n${trimmed}\n`;
  }
  return `\n---\n\n${trimmed}\n`;
}

function hasKnownFooter(content) {
  const tail = extractFooterTail(content);
  const signatures = getFooterSignatures();
  return signatures.some((signature) => tail.includes(signature));
}

/**
 * Get footer phrases for a given category
 * @param {string} category - Category from front matter or 'default'
 * @returns {Array<string>} Array of footer phrases
 */
function getFooterPhrases(category = "default") {
  const config = loadFooterConfig();
  if (!config || !config.categories || !config.footers) {
    return DEFAULT_FOOTERS;
  }

  const categoryConfig =
    config.categories[category] ||
    config.categories.docs ||
    config.categories.readme ||
    null;

  const footerId = categoryConfig?.default_footer;
  const footerTemplate = footerId && config.footers[footerId]?.template;
  if (typeof footerTemplate === "string") {
    return [footerTemplate.trimEnd()];
  }

  // Fall back to a known default if the config is partial or missing the category mapping.
  if (categoryConfig?.allowed_footers?.length) {
    const fallbackFooter =
      config.footers[categoryConfig.allowed_footers[0]]?.template;
    if (typeof fallbackFooter === "string") {
      return [fallbackFooter.trimEnd()];
    }
  }

  return DEFAULT_FOOTERS;
}

/**
 * Select a footer phrase (random or seeded)
 * @param {Array<string>} phrases - Available phrases
 * @param {string} seed - Optional seed for deterministic selection
 * @returns {string} Selected footer phrase
 */
function selectFooter(phrases, seed = null) {
  if (!phrases || phrases.length === 0) {
    return DEFAULT_FOOTERS[0];
  }

  if (seed) {
    // Simple hash function for deterministic selection
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash = hash | 0; // Convert to 32-bit integer
    }
    const index = Math.abs(hash) % phrases.length;
    return phrases[index];
  }

  // Random selection
  return phrases[Math.floor(Math.random() * phrases.length)];
}

/**
 * Get a random footer from the list
 * @param {string} category - Optional category for footer selection
 * @param {string} seed - Optional seed for deterministic selection
 * @returns {string} Footer text
 */
function getRandomFooter(category = "default", seed = null) {
  const phrases = getFooterPhrases(category);
  return selectFooter(phrases, seed);
}

/**
 * Regex pattern to match existing footers
 * Footers are single-line quirky statements with NO references below
 */
// List of footer patterns to match (add or update as needed)
const FOOTER_PATTERNS = [
  "\\*Maintained by the 🤖[^\\n]*\\*",
  "\\*Built by 🧱[^\\n]*\\*",
  "\\*Have questions\\?[^\\n]*\\*",
  "\\*This page brought to you by[^\\n]*\\*",
  "\\*Docs signed by 🤖[^\\n]*\\*",
  "Maintained with ❤️[^\\n]*",
  "_Maintained with ❤️[^\\n]*_",
  "Made with 💚[^\\n]*",
  "Questions\\?[^\\n]*",
  "Prefer a guided[^\\n]*",
  "Clarity first[^\\n]*",
  "Improvements welcome[^\\n]*",
  "Copy, adapt[^\\n]*",
  "Tweak the variables[^\\n]*",
  "Your feedback shapes[^\\n]*",
  "Reuse beats[^\\n]*",
  "Keep prompts[^\\n]*",
  "Use responsibly[^\\n]*",
  "Keep tone[^\\n]*",
  "Update when[^\\n]*",
  "Link policies[^\\n]*",
  "Thanks for helping[^\\n]*",
  "Need help\\?[^\\n]*",
];

/**
 * Build the footer regex from the patterns array.
 * @returns {RegExp}
 */
function buildFooterRegex() {
  // Join all patterns with alternation and anchor to end of file/line
  const pattern = `(${FOOTER_PATTERNS.join("|")})$/m`;
  return new RegExp(pattern);
}

// Build the regex once for use
const FOOTER_REGEX = buildFooterRegex();

/**
 * Ensure the README or doc file ends with a fun footer
 * @param {string} file - Path to file
 * @param {object} options - Options: { category: string, seed: string, backup: boolean }
 * @returns {boolean} true if file was updated
 */
function ensureFooter(file, options = {}) {
  const { category = "default", seed = null, backup = false } = options;

  if (!fs.existsSync(file)) {
    throw new Error(`File not found: ${file}`);
  }

  // Create backup if requested
  if (backup) {
    const backupPath = `${file}.backup`;
    fs.copyFileSync(file, backupPath);
  }

  let content = fs.readFileSync(file, "utf-8");
  const nextFooter = getRandomFooter(category, seed);
  const footerBlock = buildFooterBlock(nextFooter);

  // buildFooterBlock's own leading newline is not sufficient to guarantee a
  // *blank* line before the block — without one, a `---` directly abutting
  // the preceding paragraph is parsed by CommonMark as a setext-heading
  // underline for that paragraph rather than a thematic break. Strip it and
  // always join with an explicit blank line instead.
  const footerBlockBody = footerBlock.replace(/^\n+/, "");

  if (hasKnownFooter(content)) {
    const frontmatterStripped = stripFrontmatter(content);
    const lastSeparatorIndex = frontmatterStripped.lastIndexOf("\n---\n");

    if (lastSeparatorIndex !== -1) {
      const prefix = content.slice(
        0,
        content.length - frontmatterStripped.length,
      );
      const bodyWithoutFooter = frontmatterStripped.slice(
        0,
        lastSeparatorIndex,
      );
      content = `${prefix}${bodyWithoutFooter.replace(/\s+$/, "")}\n\n${footerBlockBody}`;
    } else {
      content = `${content.replace(/\s+$/, "")}\n\n${footerBlockBody}`;
    }
  } else {
    content = `${content.replace(/\s+$/, "")}\n\n${footerBlockBody}`;
  }

  fs.writeFileSync(file, content);
  return true;
}

/**
 * Insert or update header and footer in a markdown file
 * @param {string} filePath - Path to markdown file
 * @param {object} config - Configuration: { headers: object, footers: object }
 * @param {object} options - Options: { backup: boolean, category: string, seed: string }
 * @returns {Promise<boolean>} true if successful
 */
async function insertHeaderFooter(filePath, _config = {}, options = {}) {
  const { backup = false, category = "default", seed = null } = options;

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // For now, we'll just handle footers
  // Headers are typically handled by the meta agent's applyHeader function
  ensureFooter(filePath, { category, seed, backup });

  return true;
}

/**
 * Remove footer from a file
 * @param {string} file - Path to file
 * @returns {boolean} true if footer was removed
 */
function removeFooter(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`File not found: ${file}`);
  }

  let content = fs.readFileSync(file, "utf-8");

  if (FOOTER_REGEX.test(content)) {
    content = content.replace(FOOTER_REGEX, "").trim() + "\n";
    fs.writeFileSync(file, content);
    return true;
  }

  return false;
}

export {
  insertHeaderFooter,
  ensureFooter,
  removeFooter,
  getRandomFooter,
  getFooterPhrases,
  selectFooter,
  loadFooterConfig,
  DEFAULT_FOOTERS,
};
