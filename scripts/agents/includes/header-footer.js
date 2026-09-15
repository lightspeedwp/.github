/**
 * header-footer.js
 * Header and footer insertion for the meta agent
 * Integrates functionality from includes/footerUtils.js
 */

// TODO: Align this helper with the latest automation spec updates.

import fs from "fs";
import path from "path";
import { load } from "js-yaml";

/**
 * Load footer configuration from footers.yml
 */
function loadFooterConfig() {
  const configPath = path.join(process.cwd(), ".github/automation/footers.yml");
  if (!fs.existsSync(configPath)) {
    return null;
  }
  const content = fs.readFileSync(configPath, "utf-8");
  return load(content);
}

/**
 * Standard footer variants (fallback if config not found)
 */
const DEFAULT_FOOTERS = [
  "_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_\n[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)",
  "_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_\n[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)",
  "*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*",
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
// Each pattern's body is deliberately bounded to a single line ([^\n]*,
// not [\s\S]*?): footer phrases are always one line, optionally followed
// by exactly one link line. An earlier version used [\s\S]*? here, which
// can match across newlines -- combined with the outer buildFooterRegex()
// anchoring on end-of-string, that let a footer phrase merely quoted or
// re-used mid-document (matching only because it starts a line) expand
// all the way to the true end of the file, and ensureFooter()'s replace
// path would then delete every real line of content after it.
const FOOTER_PATTERNS = [
  "_Maintained with ❤️[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?",
  "_Built by 🧱[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?",
  "[*_]?Have questions\\?[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?",
  "_This page brought to you by[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?",
  "_Docs signed by 🤖[^\\n]*",
  "Made with ❤️[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?",
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
  // Join all patterns with alternation, anchored to the end of the whole
  // file and required to *start* its own line (right after "\n", or at
  // the very start of the file). Both anchors matter:
  //  - No "m" flag on the trailing $: a multiline end-of-file anchor
  //    would match end-of-line for every line, letting a footer phrase
  //    merely mentioned mid-body (as prose, not as a real footer) match
  //    all the way to EOF via the patterns' own permissive `[\s\S]*?`
  //    and get "replaced" in place -- wiping it out instead of leaving
  //    it alone and appending a separate new footer.
  //  - The explicit (?:^|\n) start guard rules out a phrase embedded
  //    mid-sentence (e.g. "This note mentions Have questions? ..."),
  //    which doesn't begin its own line, from matching at all.
  // The original source baked "$/m" into the pattern as literal text
  // (matching the literal characters "$", "/", "m"), which happened to
  // never match at all rather than over-matching.
  //
  // A trailing "\n?" before the final anchor tolerates the single
  // trailing newline ensureFooter()'s own append path always writes
  // (`nextFooter + "\n"`) -- without it, a footer this function itself
  // previously wrote could never be found and replaced on a later call
  // (the match would end one character before the file's true end), so
  // ensureFooter() was not idempotent: calling it twice appended two
  // footers instead of replacing the first.
  const pattern = `(^|\\n)(?:${FOOTER_PATTERNS.join("|")})\\n?$`;
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
    // Replace only the matched footer text itself, preserving whichever
    // boundary (start-of-file "" or the preceding "\n") the regex
    // captured as its first group. The match itself can extend all the
    // way to end-of-string (no "m" flag), swallowing a trailing newline
    // if the file had one -- restore it so files that end with '\n'
    // still do after the footer is replaced.
    const hadTrailingNewline = content.endsWith("\n");
    content = content.replace(
      FOOTER_REGEX,
      (_match, boundary) => boundary + nextFooter,
    );
    if (hadTrailingNewline && !content.endsWith("\n")) {
      content += "\n";
    }
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
