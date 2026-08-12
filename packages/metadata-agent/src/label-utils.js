/**
 * Label Utilities Module
 *
 * Provides label parsing, validation, suggestion, and scoring functionality
 * for GitHub labels within the LightSpeedWP metadata agent ecosystem.
 *
 * @module label-utils
 */

import { findSimilar } from 'lodash';

/**
 * Canonical label families recognized by the system
 * @type {string[]}
 */
const LABEL_FAMILIES = [
  'type',
  'status',
  'area',
  'meta',
  'priority',
  'component',
  'affects',
  'requires'
];

/**
 * Canonical labels by family (reference set for validation)
 * @type {Object.<string, string[]>}
 */
const CANONICAL_LABELS = {
  type: [
    'type:bug',
    'type:feature',
    'type:task',
    'type:documentation',
    'type:chore',
    'type:refactor',
    'type:performance',
    'type:security',
    'type:accessibility'
  ],
  status: [
    'status:needs-triage',
    'status:in-progress',
    'status:review',
    'status:blocked',
    'status:done',
    'status:cancelled'
  ],
  area: [
    'area:ci',
    'area:docs',
    'area:security',
    'area:labels',
    'area:automation',
    'area:testing',
    'area:api',
    'area:ui'
  ],
  meta: [
    'meta:needs-changelog',
    'meta:has-pr',
    'meta:breaking-change',
    'meta:needs-review'
  ],
  priority: [
    'priority:critical',
    'priority:important',
    'priority:normal',
    'priority:low'
  ],
  component: [
    'component:block-editor',
    'component:theme',
    'component:cli',
    'component:api'
  ],
  affects: [
    'affects:performance',
    'affects:accessibility',
    'affects:security'
  ],
  requires: [
    'requires:design-review',
    'requires:security-review',
    'requires:performance-audit'
  ]
};

/**
 * Parse a label string into family and name components
 *
 * Extracts the label family (prefix before colon) and the label name
 * (value after colon). For labels without a colon, treats the entire
 * string as the name with no family.
 *
 * @param {string} label - The label string to parse (e.g., "type:bug")
 * @returns {{family: string|null, name: string, full: string}} Parsed label components
 *
 * @example
 * parse('type:bug')
 * // → { family: 'type', name: 'bug', full: 'type:bug' }
 *
 * @example
 * parse('urgent')
 * // → { family: null, name: 'urgent', full: 'urgent' }
 */
export function parse(label) {
  if (!label || typeof label !== 'string') {
    return { family: null, name: '', full: '' };
  }

  const trimmed = label.trim().toLowerCase();
  if (trimmed.includes(':')) {
    const [family, ...rest] = trimmed.split(':');
    const name = rest.join(':');
    return {
      family: family || null,
      name: name || '',
      full: trimmed
    };
  }

  return {
    family: null,
    name: trimmed,
    full: trimmed
  };
}

/**
 * Validate a label against the canonical label set
 *
 * Checks if a label exists in the canonical label registry. If the label
 * is not found, returns a suggestion for the closest matching canonical label.
 *
 * @param {string} label - The label to validate
 * @returns {{valid: boolean, label: string, suggestion: string|null, reason: string}}
 *         Validation result with optional suggestion
 *
 * @example
 * validate('type:bug')
 * // → { valid: true, label: 'type:bug', suggestion: null, reason: 'Label found in canonical set' }
 *
 * @example
 * validate('type:buge')
 * // → { valid: false, label: 'type:buge', suggestion: 'type:bug', reason: 'Not in canonical set' }
 */
export function validate(label) {
  if (!label || typeof label !== 'string') {
    return {
      valid: false,
      label: '',
      suggestion: null,
      reason: 'Label is empty or not a string'
    };
  }

  const trimmed = label.trim().toLowerCase();
  const allCanonical = Object.values(CANONICAL_LABELS).flat();

  if (allCanonical.includes(trimmed)) {
    return {
      valid: true,
      label: trimmed,
      suggestion: null,
      reason: 'Label found in canonical set'
    };
  }

  // Find closest match for suggestion
  const suggestion = findClosestLabel(trimmed, allCanonical);

  return {
    valid: false,
    label: trimmed,
    suggestion,
    reason: 'Not in canonical set'
  };
}

/**
 * Suggest similar labels for a given label string
 *
 * Finds canonical labels that are similar to the input label using
 * Levenshtein distance and returns them ranked by similarity.
 *
 * @param {string} label - The label to find suggestions for
 * @param {number} maxSuggestions - Maximum number of suggestions to return (default: 3)
 * @returns {string[]} Array of suggested labels, ordered by similarity
 *
 * @example
 * suggest('type:feat')
 * // → ['type:feature']
 *
 * @example
 * suggest('statu')
 * // → ['status:in-progress', 'status:needs-triage', 'status:blocked']
 */
export function suggest(label, maxSuggestions = 3) {
  if (!label || typeof label !== 'string') {
    return [];
  }

  const trimmed = label.trim().toLowerCase();
  const allCanonical = Object.values(CANONICAL_LABELS).flat();

  // Calculate similarity scores
  const scored = allCanonical
    .filter(candidate => candidate !== trimmed)
    .map(candidate => ({
      label: candidate,
      score: calculateSimilarity(trimmed, candidate)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions);

  return scored.map(item => item.label);
}

/**
 * Score a label's relevance to an issue based on context
 *
 * Calculates a relevance score (0-100) for a label when applied to a specific
 * issue. The score factors in whether the label family is present, whether the
 * label is canonical, and the label's context match.
 *
 * @param {string} label - The label to score
 * @param {Object} context - Context object for scoring
 * @param {string} [context.issueType] - Type of the issue (e.g., 'bug', 'feature')
 * @param {string[]} [context.existingLabels] - Labels already on the issue
 * @param {boolean} [context.isCanonical] - Whether to penalize non-canonical labels
 * @returns {number} Relevance score from 0 to 100
 *
 * @example
 * score('type:bug', { issueType: 'bug', existingLabels: [] })
 * // → 95 (highly relevant match)
 *
 * @example
 * score('priority:low', { issueType: 'feature', existingLabels: ['type:feature'] })
 * // → 60 (somewhat relevant, adds new dimension)
 */
export function score(label, context = {}) {
  if (!label || typeof label !== 'string') {
    return 0;
  }

  const {
    issueType = null,
    existingLabels = [],
    isCanonical = true
  } = context;

  const trimmed = label.trim().toLowerCase();
  const parsed = parse(trimmed);
  let score = 50; // Base score

  // Check if label is canonical
  const validation = validate(trimmed);
  if (validation.valid) {
    score += 30; // Canonical label bonus
  } else if (isCanonical) {
    score -= 25; // Non-canonical penalty
  }

  // Check for family conflicts
  if (parsed.family && existingLabels) {
    const hasConflict = existingLabels.some(existing => {
      const existingParsed = parse(existing);
      return existingParsed.family === parsed.family;
    });

    if (hasConflict) {
      score -= 30; // Conflict penalty
    }
  }

  // Check context match
  if (issueType && parsed.family === 'type') {
    if (trimmed.includes(issueType)) {
      score += 20; // Context match bonus
    }
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Get all canonical label families
 *
 * @returns {string[]} Array of canonical label family names
 */
export function getFamilies() {
  return [...LABEL_FAMILIES];
}

/**
 * Get all canonical labels in a given family
 *
 * @param {string} family - The label family to retrieve labels for
 * @returns {string[]} Array of canonical labels in the family, or empty array if family not found
 */
export function getLabelsByFamily(family) {
  const normalized = family.toLowerCase().replace(/[^a-z0-9-]/g, '');
  return CANONICAL_LABELS[normalized] || [];
}

/**
 * Get all canonical labels across all families
 *
 * @returns {string[]} Flattened array of all canonical labels
 */
export function getAllCanonical() {
  return Object.values(CANONICAL_LABELS).flat();
}

/**
 * Helper: Find the closest matching canonical label using Levenshtein distance
 *
 * @private
 * @param {string} input - Input label string
 * @param {string[]} candidates - Array of canonical labels to match against
 * @returns {string|null} Closest matching label or null if no match found
 */
function findClosestLabel(input, candidates) {
  if (!candidates || candidates.length === 0) {
    return null;
  }

  let closest = null;
  let maxScore = 0;

  for (const candidate of candidates) {
    const similarity = calculateSimilarity(input, candidate);
    if (similarity > maxScore && similarity >= 0.5) {
      maxScore = similarity;
      closest = candidate;
    }
  }

  return closest;
}

/**
 * Helper: Calculate similarity score between two strings (0-1)
 *
 * Uses a basic similarity algorithm based on:
 * - Substring matching
 * - Character overlap
 * - Levenshtein-inspired scoring
 *
 * @private
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Similarity score from 0 to 1
 */
function calculateSimilarity(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;

  const len = Math.max(a.length, b.length);
  let matches = 0;

  // Count character matches (simple algorithm)
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) matches++;
  }

  // Check if strings share common substrings
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  if (bLower.includes(aLower) || aLower.includes(bLower)) {
    matches += Math.min(a.length, b.length) * 0.5;
  }

  return Math.min(1, matches / len);
}

/**
 * Label utilities export object
 * Provides all label manipulation functions in a single namespace
 *
 * @type {Object}
 * @exports label-utils
 */
export const labelUtils = {
  parse,
  validate,
  suggest,
  score,
  getFamilies,
  getLabelsByFamily,
  getAllCanonical
};

export default labelUtils;
