#!/usr/bin/env node
/**
 * ============================================================================
 * Module: categoryMapper.js
 * Location: scripts/agents/includes/categoryMapper.js
 * Description:
 *   - Maps commit types and PR labels to changelog sections
 *   - Provides bi-directional mapping between conventional commits and Keep a Changelog
 * Standards:
 *   - Follows LightSpeed Coding Standards
 * ============================================================================
 */

// Mapping from conventional commit types to Keep a Changelog sections
const TYPE_TO_SECTION = {
  feat: "added",
  fix: "fixed",
  docs: "documentation",
  style: "changed",
  refactor: "changed",
  perf: "performance",
  test: "changed",
  chore: "changed",
};

// Mapping from GitHub PR labels to changelog sections
const LABEL_TO_SECTION = {
  "type: feature": "added",
  "type: bugfix": "fixed",
  "type: documentation": "documentation",
  "type: breaking": "changed",
  "type: deprecation": "deprecated",
  "type: enhancement": "changed",
  "type: security": "security",
  "type: performance": "performance",
  "priority: critical": "security",
  "priority: high": "changed",
};

// Reverse mappings for convenience
const SECTION_TO_TYPES = {};
Object.entries(TYPE_TO_SECTION).forEach(([type, section]) => {
  if (!SECTION_TO_TYPES[section]) {
    SECTION_TO_TYPES[section] = [];
  }
  SECTION_TO_TYPES[section].push(type);
});

const SECTION_TO_LABELS = {};
Object.entries(LABEL_TO_SECTION).forEach(([label, section]) => {
  if (!SECTION_TO_LABELS[section]) {
    SECTION_TO_LABELS[section] = [];
  }
  SECTION_TO_LABELS[section].push(label);
});

/**
 * Map commit type to changelog section
 * @param {string} type - Conventional commit type
 * @returns {string|null} Changelog section name or null if unmapped
 */
function mapCommitTypeToSection(type) {
  return TYPE_TO_SECTION[type?.toLowerCase()] || null;
}

/**
 * Map PR label to changelog section
 * @param {string} label - GitHub PR label
 * @returns {string|null} Changelog section name or null if unmapped
 */
function mapLabelToSection(label) {
  return LABEL_TO_SECTION[label?.toLowerCase()] || null;
}

/**
 * Determine changelog section from commit and labels
 * Priority: PR labels > Commit type
 * @param {string} type - Conventional commit type
 * @param {string[]} labels - PR labels
 * @returns {string|null} Changelog section name
 */
function determineSection(type, labels = []) {
  // Check labels first (higher priority)
  const safeLabels = Array.isArray(labels) ? labels : [];
  for (const label of safeLabels) {
    const section = mapLabelToSection(label);
    if (section) return section;
  }

  // Fall back to commit type
  if (type) {
    return mapCommitTypeToSection(type);
  }

  return null;
}

/**
 * Get all changelog section names
 * @returns {string[]} Array of valid section names
 */
function getAllSections() {
  return [
    "added",
    "changed",
    "deprecated",
    "removed",
    "fixed",
    "security",
    "documentation",
    "performance",
  ];
}

/**
 * Check if section is valid
 * @param {string} section - Section name
 * @returns {boolean} True if section is valid
 */
function isValidSection(section) {
  return getAllSections().includes(section?.toLowerCase());
}

module.exports = {
  mapCommitTypeToSection,
  mapLabelToSection,
  determineSection,
  getAllSections,
  isValidSection,
  TYPE_TO_SECTION,
  LABEL_TO_SECTION,
  SECTION_TO_TYPES,
  SECTION_TO_LABELS,
};
