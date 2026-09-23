/**
 * branding.agent.js
 * Consolidated module for header, footer, and badge generation
 * Provides branding utilities for documentation, READMEs, and automated content insertion
 */

import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';

// ============================================================================
// Footer Configuration & Functions
// ============================================================================

/**
 * Load footer configuration from `.github/footers.yml`.
 *
 * @returns {*|null} Parsed configuration, or `null` when the file is absent
 * @throws {Error} If the configuration cannot be read or parsed
 */
function loadFooterConfig() {
  const configPath = path.join(process.cwd(), '.github/footers.yml');
  if (!fs.existsSync(configPath)) {
    return null;
  }
  const content = fs.readFileSync(configPath, 'utf-8');
  return yaml.load(content);
}

/**
 * Standard footer variants (fallback if config not found)
 */
const DEFAULT_FOOTERS = [
  '_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_\n[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)',
  '_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_\n[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)',
  '_Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP_\n[Contact](https://lightspeedwp.agency/contact)',
  '_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._\n[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)',
  '_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_',
];

/**
 * Get footer phrases for a given category
 * @param {string} category - Category from front matter or 'default'
 * @returns {Array<string>} Array of footer phrases
 */
function getFooterPhrases(category = 'default') {
  const config = loadFooterConfig();
  if (!config || !config.categories) {
    return DEFAULT_FOOTERS;
  }

  if (config.categories[category] && config.categories[category].phrases) {
    return config.categories[category].phrases;
  }

  // Fall back to the top-level default block (footers.yml has `default`
  // as a sibling of `categories`, not nested inside it).
  if (config.default && config.default.phrases) {
    return config.default.phrases;
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
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash = hash | 0;
    }
    const index = Math.abs(hash) % phrases.length;
    return phrases[index];
  }

  return phrases[Math.floor(Math.random() * phrases.length)];
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

/**
 * Regex patterns to match existing footers.
 *
 * Ported from the corrected implementation in
 * scripts/agents/includes/header-footer.js (see #3443/#3446): each
 * pattern's body is bounded to a single line ([^\n]*, not [\s\S]*?) to
 * avoid over-matching across newlines, and the leading emphasis marker
 * is optional ([*_]?) so detection works regardless of whether the
 * footer is wrapped in _..._ or *...*.
 */
const FOOTER_PATTERNS = [
  '[*_]?Maintained with ❤️[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?',
  '[*_]?Built by 🧱[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?',
  '[*_]?Have questions\\?[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?',
  '[*_]?This page brought to you by[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?',
  '[*_]?Docs signed by 🤖[^\\n]*',
  '[*_]?Made with ❤️[^\\n]*(?:\\n\\[.*?\\]\\(.*?\\))?',
  '[*_]?Questions\\?[^\\n]*',
  '[*_]?Prefer a guided[^\\n]*',
  '[*_]?Clarity first[^\\n]*',
  '[*_]?Improvements welcome[^\\n]*',
  '[*_]?Copy, adapt[^\\n]*',
  '[*_]?Tweak the variables[^\\n]*',
  '[*_]?Your feedback shapes[^\\n]*',
  '[*_]?Reuse beats[^\\n]*',
  '[*_]?Keep prompts[^\\n]*',
  '[*_]?Use responsibly[^\\n]*',
  '[*_]?Keep tone[^\\n]*',
  '[*_]?Update when[^\\n]*',
  '[*_]?Link policies[^\\n]*',
  '[*_]?Thanks for helping[^\\n]*',
  '[*_]?Need help\\?[^\\n]*',
];

/**
 * Build the footer regex from the patterns array. Anchored to the end of
 * the whole file and required to start its own line (right after "\n", or
 * at the very start of the file) — see header-footer.js's buildFooterRegex
 * for the full rationale.
 * @returns {RegExp}
 */
function buildFooterRegex() {
  const pattern = `(^|\\n)(?:${FOOTER_PATTERNS.join('|')})\\n?$`;
  return new RegExp(pattern);
}

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

  if (backup) {
    const backupPath = `${file}.backup`;
    fs.copyFileSync(file, backupPath);
  }

  let content = fs.readFileSync(file, 'utf-8');
  const nextFooter = getRandomFooter(category, seed);

  if (FOOTER_REGEX.test(content)) {
    // Preserve the matched boundary (start-of-file "" or the preceding
    // "\n") and restore a trailing newline the match may have swallowed
    // (no "m" flag on the regex) -- see header-footer.js's ensureFooter
    // for the full rationale.
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

  ensureFooter(filePath, { category, seed, backup });

  return true;
}

// ============================================================================
// Badge Configuration & Functions
// ============================================================================

/**
 * Load badge schema configuration from `.github/automation/badges.schema.yml`.
 *
 * @returns {*|null} Parsed schema, or `null` when the file is absent
 * @throws {Error} If the schema cannot be read or parsed
 */
function loadBadgeSchema() {
  const schemaPath = path.join(process.cwd(), '.github/automation/badges.schema.yml');
  if (!fs.existsSync(schemaPath)) {
    return null;
  }
  const content = fs.readFileSync(schemaPath, 'utf-8');
  return yaml.load(content);
}

/**
 * Generate workflow badge markdown
 */
function generateWorkflowBadge(repo, workflowFile, branch = 'main') {
  const workflowName = workflowFile.replace(/\.(yml|yaml)$/, '');
  const badgeUrl = `https://github.com/${repo}/actions/workflows/${workflowFile}/badge.svg?branch=${branch}`;
  const workflowUrl = `https://github.com/${repo}/actions/workflows/${workflowFile}`;
  return `[![${workflowName}](${badgeUrl})](${workflowUrl})`;
}

/**
 * Generate badge markdown for all workflows in .github/workflows/
 */
function generateWorkflowBadges(repo, branch = 'main', format = 'stacked') {
  const workflowsDir = path.join(process.cwd(), '.github', 'workflows');
  if (!fs.existsSync(workflowsDir)) {
    return [];
  }
  const badges = [];
  fs.readdirSync(workflowsDir).forEach((file) => {
    if (file.endsWith('.yml') || file.endsWith('.yaml')) {
      badges.push(generateWorkflowBadge(repo, file, branch));
    }
  });
  if (badges.length === 0) {
    return [];
  }
  if (format === 'inline') {
    return [badges.join(' ')];
  }
  return badges;
}

/**
 * Generate metadata badges from schema configuration
 */
function generateMetadataBadges(frontMatter) {
  const schema = loadBadgeSchema();
  if (!schema || !schema.badges || !schema.mapping) {
    return [];
  }

  const badges = [];

  for (const rule of schema.mapping) {
    if (!rule.when || !rule.add) continue;

    let conditionMet = true;

    if (rule.when.has_front_matter && !frontMatter) {
      conditionMet = false;
    }

    if (rule.when.front_matter && rule.when.front_matter.license && frontMatter) {
      const allowedLicenses = rule.when.front_matter.license;
      if (!frontMatter.license || !allowedLicenses.includes(frontMatter.license)) {
        conditionMet = false;
      }
    }

    if (conditionMet) {
      for (const badgeRef of rule.add) {
        const badge = resolveBadge(badgeRef, schema.badges, frontMatter);
        if (badge) {
          badges.push(badge);
        }
      }
    }
  }

  return badges;
}

/**
 * Resolve a badge reference from schema
 */
function resolveBadge(badgeRef, badgeDefs, frontMatter) {
  const parts = badgeRef.split('.');
  let current = badgeDefs;

  for (const part of parts) {
    if (current && current[part]) {
      current = current[part];
    } else {
      return null;
    }
  }

  if (!current || typeof current !== 'object') {
    return null;
  }

  if (badgeRef.startsWith('workflow.')) {
    const label = current.label || badgeRef;
    const successText = current.success_text || 'OK';
    return `![${label}](https://img.shields.io/badge/${label}-${successText}-success.svg)`;
  }

  if (badgeRef.startsWith('meta.license') && frontMatter && frontMatter.license) {
    const license = frontMatter.license.toUpperCase();
    return `![License](https://img.shields.io/badge/license-${license}-blue.svg)`;
  }

  return null;
}

/**
 * Insert or update badge block in README.md between markers
 */
function updateReadmeBadges(readmeFile, badges) {
  const badgeStart = '<!-- BADGES-START -->';
  const badgeEnd = '<!-- BADGES-END -->';

  if (!fs.existsSync(readmeFile)) {
    throw new Error(`README file not found: ${readmeFile}`);
  }

  let content = fs.readFileSync(readmeFile, 'utf-8');
  const badgeBlock = [badgeStart, ...badges, badgeEnd].join('\n');

  if (content.includes(badgeStart) && content.includes(badgeEnd)) {
    content = content.replace(new RegExp(`${badgeStart}[\\s\\S]*?${badgeEnd}`, 'm'), badgeBlock);
  } else {
    content = content.replace(/^(# .+\n)/, `$1\n${badgeBlock}\n`);
  }

  fs.writeFileSync(readmeFile, content);
  return true;
}

/**
 * Main entry point for updating badges in a README file
 * @param {string} readmePath - Path to README.md
 * @param {string} workflowsPath - Path to workflows directory (relative or absolute)
 * @param {object} options - Options: { backup: boolean, repo: string, branch: string, format: string, frontMatter: object }
 */
async function updateBadgesInReadme(readmePath, workflowsPath, options = {}) {
  const {
    backup = false,
    repo = 'lightspeedwp/.github',
    branch = 'develop',
    format = 'stacked',
    frontMatter = null,
  } = options;

  if (backup && fs.existsSync(readmePath)) {
    const backupPath = `${readmePath}.backup`;
    fs.copyFileSync(readmePath, backupPath);
  }

  const workflowBadges = generateWorkflowBadges(repo, branch, format);
  const metadataBadges = generateMetadataBadges(frontMatter);
  const allBadges = [...metadataBadges, ...workflowBadges];

  if (allBadges.length === 0) {
    return false;
  }

  updateReadmeBadges(readmePath, allBadges);

  return true;
}

// ============================================================================
// Exports
// ============================================================================

export {
  insertHeaderFooter,
  ensureFooter,
  removeFooter,
  getRandomFooter,
  getFooterPhrases,
  selectFooter,
  loadFooterConfig,
  DEFAULT_FOOTERS,
  generateWorkflowBadges,
  generateWorkflowBadge,
  generateMetadataBadges,
  updateReadmeBadges,
  updateBadgesInReadme,
  loadBadgeSchema,
};
