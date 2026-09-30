/**
 * footer-phrases.js
 * Single source of truth for footer phrase/config selection (#3544).
 *
 * `scripts/agents/includes/header-footer.js` (used by the meta agent) and
 * `scripts/agents/branding.agent.js` previously carried independent copies
 * of this algorithm, forcing every fallback fix (#3446, #3456, #3538) to be
 * applied twice. Both modules now delegate here through thin wrappers that
 * preserve their exact public signatures and their own DEFAULT_FOOTERS
 * fallback values (which intentionally differ, so the fallback stays
 * injectable rather than shared).
 */

import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';

/**
 * Load footer configuration from footers.yml
 * @returns {object|null} Parsed configuration, or null when the file is absent
 */
export function loadFooterConfig() {
  const configPath = path.join(process.cwd(), '.github/footers.yml');
  if (!fs.existsSync(configPath)) {
    return null;
  }
  const content = fs.readFileSync(configPath, 'utf-8');
  return load(content);
}

/**
 * Resolve the phrase list for a category from a loaded config.
 * @param {object|null} config - Parsed footers.yml (or null when absent)
 * @param {string} category - Category name (defaults to 'default' at callers)
 * @param {Array<string>} fallbackFooters - Caller-specific hardcoded fallback
 * @returns {Array<string>} Phrases from the category, the top-level default
 * block, or the caller fallback, in that order
 */
export function resolveFooterPhrases(config, category, fallbackFooters) {
  if (!config) {
    return fallbackFooters;
  }

  // Try to get category-specific footers
  if (config.categories && config.categories[category] && config.categories[category].phrases) {
    return config.categories[category].phrases;
  }

  // Fall back to the top-level default block (footers.yml has `default`
  // as a sibling of `categories`, not nested inside it).
  if (config.default && config.default.phrases) {
    return config.default.phrases;
  }

  return fallbackFooters;
}

/**
 * Select a footer phrase (random or seeded)
 * @param {Array<string>} phrases - Available phrases
 * @param {string|null} seed - Optional seed for deterministic selection
 * @param {string} fallbackPhrase - Used when phrases is empty/missing
 * @returns {string} Selected footer phrase
 */
export function selectFooterPhrase(phrases, seed, fallbackPhrase) {
  if (!phrases || phrases.length === 0) {
    return fallbackPhrase;
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
 * Resolve phrases for a category and select one.
 * @param {object|null} config - Parsed footers.yml (or null when absent)
 * @param {string} category - Category name
 * @param {string|null} seed - Optional seed for deterministic selection
 * @param {Array<string>} fallbackFooters - Caller-specific hardcoded fallback
 * @returns {string} Selected footer phrase
 */
export function getRandomFooterPhrase(config, category, seed, fallbackFooters) {
  const phrases = resolveFooterPhrases(config, category, fallbackFooters);
  return selectFooterPhrase(phrases, seed, fallbackFooters[0]);
}
