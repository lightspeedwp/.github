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
 * Load footer configuration from footers.yml
 */
function loadFooterConfig() {
  const configPath = path.join(process.cwd(), ".github/automation/footers.yml");
  if (!fs.existsSync(configPath)) {
    return null;
  }
  const content = fs.readFileSync(configPath, "utf-8");
  return yaml.load(content);
}

/**
 * Standard footer variants (fallback if config not found)
 */
const DEFAULT_FOOTERS = [
  "_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_\n[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)",
  "_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_\n[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)",
  "_Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP_\n[Contact](https://lightspeedwp.agency/contact)",
  "_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._\n[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)",
  "_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_",
];

/**
 * Get footer phrases for a given category
 * @param {string} category - Category from front matter or 'default'
 * @returns {Array<string>} Array of footer phrases
 */
function getFooterPhrases(category = "default") {
  const config = loadFooterConfig();
  if (!config || !config.categories) {
    return DEFAULT_FOOTERS;
  }

  // Try to get category-specific footers
  if (config.categories[category] && config.categories[category].phrases) {
    return config.categories[category].phrases;
  }

  // Fall back to default category
  if (config.categories.default && config.categories.default.phrases) {
    return config.categories.default.phrases;
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
 */
// List of footer patterns to match (add or update as needed)
const FOOTER_PATTERNS = [
  "_Maintained with ❤️[\\s\\S]*?(?:\\n\\[.*?\\]\\(.*?\\))?",
  "_Built by 🧱[\\s\\S]*?(?:\\n\\[.*?\\]\\(.*?\\))?",
  "_Have questions\\?[\\s\\S]*?(?:\\n\\[.*?\\]\\(.*?\\))?",
  "_This page brought to you by[\\s\\S]*?(?:\\n\\[.*?\\]\\(.*?\\))?",
  "_Docs signed by 🤖[\\s\\S]*?",
  "Made with ❤️[\\s\\S]*?(?:\\n\\[.*?\\]\\(.*?\\))?",
  "Questions\\?[\\s\\S]*?",
  "Prefer a guided[\\s\\S]*?",
  "Clarity first[\\s\\S]*?",
  "Improvements welcome[\\s\\S]*?",
  "Copy, adapt[\\s\\S]*?",
  "Tweak the variables[\\s\\S]*?",
  "Your feedback shapes[\\s\\S]*?",
  "Reuse beats[\\s\\S]*?",
  "Keep prompts[\\s\\S]*?",
  "Use responsibly[\\s\\S]*?",
  "Keep tone[\\s\\S]*?",
  "Update when[\\s\\S]*?",
  "Link policies[\\s\\S]*?",
  "Thanks for helping[\\s\\S]*?",
  "Need help\\?[\\s\\S]*?",
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

  if (FOOTER_REGEX.test(content)) {
    content = content.replace(FOOTER_REGEX, nextFooter);
    fs.writeFileSync(file, content);
    return true;
  }

  if (!content.endsWith("\n")) {
    content += "\n";
  }
  content += "\n" + nextFooter + "\n";
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
async function insertHeaderFooter(filePath, config = {}, options = {}) {
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
