/**
 * header-footer.js
 * Header and footer insertion for the meta agent
 */

// TODO: Align this helper with the latest automation spec updates.

import fs from 'fs';
import {
  loadFooterConfig as loadSharedFooterConfig,
  resolveFooterPhrases,
  selectFooterPhrase,
} from './footer-phrases.js';
import { FOOTER_PATTERNS, buildFooterRegex, contributorsLink, repoUrl } from './footer-policy.js';

export { FOOTER_PATTERNS, buildFooterRegex };

/**
 * Load footer configuration from footers.yml
 */
function loadFooterConfig() {
  return loadSharedFooterConfig();
}

/**
 * Standard footer variants (fallback if config not found)
 */
// The repo-scoped links are derived from the current repository rather than
// written out, so they cannot name the wrong one. `Contributors` previously
// hardcoded `lightspeedwp/lsx-demo-theme` here and in branding.agent.js, which
// propagated a link to an unrelated project into every file that received this
// fallback. See `contributorsLink()` in ./footer-policy.js.
const DEFAULT_FOOTERS = [
  `*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*\n[Org Profile](${repoUrl('tree/main/profile')})`,
  `*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*\n${contributorsLink()}`,
  '*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*',
  `*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*\n[Automation Docs](${repoUrl('tree/main/instructions')})`,
  '*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*',
];

/**
 * Get footer phrases for a given category
 * @param {string} category - Category from front matter or 'default'
 * @returns {Array<string>} Array of footer phrases
 */
function getFooterPhrases(category = 'default') {
  return resolveFooterPhrases(loadFooterConfig(), category, DEFAULT_FOOTERS);
}

/**
 * Select a footer phrase (random or seeded)
 * @param {Array<string>} phrases - Available phrases
 * @param {string} seed - Optional seed for deterministic selection
 * @returns {string} Selected footer phrase
 */
function selectFooter(phrases, seed = null) {
  return selectFooterPhrase(phrases, seed, DEFAULT_FOOTERS[0]);
}

/**
 * Get a random footer from the list
 * @param {string} category - Optional category for footer selection
 * @param {string} seed - Optional seed for deterministic selection
 * @returns {string} Footer text
 */
function getRandomFooter(category = 'default', seed = null) {
  const phrases = getFooterPhrases(category);
  return selectFooter(phrases, seed);
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
  const { category = 'default', seed = null, backup = false } = options;

  if (!fs.existsSync(file)) {
    throw new Error(`File not found: ${file}`);
  }

  // Create backup if requested
  if (backup) {
    const backupPath = `${file}.backup`;
    fs.copyFileSync(file, backupPath);
  }

  let content = fs.readFileSync(file, 'utf-8');
  const nextFooter = getRandomFooter(category, seed);

  // Idempotency guard. The end-anchored matcher deliberately only recognises a
  // trailing block that is unmistakably a footer -- an unmistakable phrase or an
  // emphasised one -- because replacing a match is destructive and a bare
  // sentence like "Update when the API version changes." must not be swallowed.
  // Some configured footers are themselves bare and generic ("Need help? Say
  // hi--work with us."), so the matcher cannot see them, and without this check
  // a second run would fail to find the footer it had just written and append
  // another one instead. That is the compounding bug #3443 fixed, reintroduced
  // through a different door.
  //
  // Comparing against the exact text this call would write is safe in the other
  // direction too: if the file already ends with that footer, leaving it alone is
  // exactly right, and no ordinary sentence is being mistaken for a footer
  // because the comparison is with a literal the generator itself produced.
  const alreadyEndsWithFooter = (() => {
    const trimmed = content.replace(/\s+$/, '');
    const candidate = nextFooter.replace(/\s+$/, '');
    return trimmed === candidate || trimmed.endsWith(`\n${candidate}`);
  })();
  if (alreadyEndsWithFooter) {
    return false;
  }

  if (FOOTER_REGEX.test(content)) {
    // Replace only the matched footer text itself, preserving whichever
    // boundary (start-of-file "" or the preceding "\n") the regex
    // captured as its first group. The match itself can extend all the
    // way to end-of-string (no "m" flag), swallowing a trailing newline
    // if the file had one -- restore it so files that end with '\n'
    // still do after the footer is replaced.
    const hadTrailingNewline = content.endsWith('\n');
    content = content.replace(FOOTER_REGEX, (_match, boundary) => boundary + nextFooter);
    if (hadTrailingNewline && !content.endsWith('\n')) {
      content += '\n';
    }
    fs.writeFileSync(file, content);
    return true;
  }

  if (!content.endsWith('\n')) {
    content += '\n';
  }
  content += '\n' + nextFooter + '\n';
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
  const { backup = false, category = 'default', seed = null } = options;

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

  let content = fs.readFileSync(file, 'utf-8');

  if (FOOTER_REGEX.test(content)) {
    content = content.replace(FOOTER_REGEX, '').trim() + '\n';
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
