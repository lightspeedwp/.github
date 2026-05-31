#!/usr/bin/env node
/**
 * ============================================================================
 * Module: duplicateDetector.js
 * Location: scripts/agents/includes/duplicateDetector.js
 * Description:
 *   - Enhanced duplicate detection using fuzzy matching
 *   - Content analysis beyond simple string normalization
 *   - Handles variations in wording and formatting
 * Standards:
 *   - Follows LightSpeed Coding Standards
 * ============================================================================
 */

/**
 * Normalize text for comparison
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
function normalize(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "");
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 */
function levenshteinDistance(str1, str2) {
  if (!str1 || !str2) {
    return Math.max((str1 || "").length, (str2 || "").length);
  }

  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(0));

  // Initialize first row and column
  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  // Fill matrix
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost,
      );
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity ratio between two strings (0-1)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity ratio (0 = no match, 1 = identical)
 */
function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) {
    return str1 === str2 ? 1 : 0;
  }

  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) {
    return 1;
  }

  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLength;
}

/**
 * Check if two descriptions are likely duplicates (fuzzy match)
 * @param {string} desc1 - First description
 * @param {string} desc2 - Second description
 * @param {number} threshold - Similarity threshold (default 0.85)
 * @returns {boolean} True if likely duplicates
 */
function isFuzzyDuplicate(desc1, desc2, threshold = 0.85) {
  if (
    !desc1 ||
    !desc2 ||
    typeof desc1 !== "string" ||
    typeof desc2 !== "string"
  ) {
    return false;
  }

  const norm1 = normalize(desc1);
  const norm2 = normalize(desc2);

  // Exact match after normalization
  if (norm1 === norm2) {
    return true;
  }

  // Fuzzy match with similarity threshold
  const similarity = calculateSimilarity(norm1, norm2);
  return similarity >= threshold;
}

/**
 * Check if description contains keywords indicating it's likely duplicate
 * @param {string} desc - Description to check
 * @param {string[]} existingDescriptions - Array of existing descriptions
 * @returns {boolean} True if likely a variation of existing entry
 */
function hasSemanticDuplicate(desc, existingDescriptions = []) {
  if (!desc || typeof desc !== "string") {
    return false;
  }

  const safeExisting = Array.isArray(existingDescriptions)
    ? existingDescriptions
    : [];

  // Extract key terms (ignore common words)
  const stopWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "is",
    "was",
    "are",
    "be",
  ];

  const extractKeyTerms = (text) => {
    return normalize(text)
      .split(" ")
      .filter((word) => word.length > 2 && !stopWords.includes(word));
  };

  const descTerms = extractKeyTerms(desc);
  if (descTerms.length === 0) {
    return false;
  }

  // Check if any existing description shares key terms
  return safeExisting.some((existing) => {
    const existingTerms = extractKeyTerms(existing);
    const commonTerms = descTerms.filter((term) =>
      existingTerms.includes(term),
    );
    const overlap =
      commonTerms.length / Math.min(descTerms.length, existingTerms.length);

    // If 60% or more terms overlap, likely a duplicate
    return overlap >= 0.6;
  });
}

/**
 * Find best matching duplicate in list
 * @param {string} description - Description to check
 * @param {string[]} existingDescriptions - List of existing descriptions
 * @param {number} threshold - Similarity threshold (default 0.85)
 * @returns {Object} Match result {matched, matchedEntry, similarity} or null if no match
 */
function findBestMatch(
  description,
  existingDescriptions = [],
  threshold = 0.85,
) {
  if (!description || typeof description !== "string") {
    return null;
  }

  const safeExisting = Array.isArray(existingDescriptions)
    ? existingDescriptions
    : [];

  if (safeExisting.length === 0) {
    return null;
  }

  let bestMatch = null;
  let highestSimilarity = threshold;

  const normDesc = normalize(description);

  safeExisting.forEach((existing) => {
    const normExisting = normalize(existing);
    const similarity = calculateSimilarity(normDesc, normExisting);

    if (similarity >= highestSimilarity) {
      highestSimilarity = similarity;
      bestMatch = existing;
    }
  });

  return bestMatch
    ? {
        matched: true,
        matchedEntry: bestMatch,
        similarity: highestSimilarity,
      }
    : null;
}

/**
 * Deduplicate entries with fuzzy matching
 * @param {Object[]} entries - Array of entry objects with description property
 * @param {number} threshold - Similarity threshold (default 0.85)
 * @returns {Object[]} Deduplicated entries
 */
function deduplicateEntries(entries, threshold = 0.85) {
  if (!Array.isArray(entries)) {
    return [];
  }

  const deduped = [];
  const seenDescriptions = [];

  entries.forEach((entry) => {
    if (!entry || typeof entry !== "object" || !entry.description) {
      return;
    }

    // Check if this entry is a fuzzy duplicate of any seen
    const isDuplicate = seenDescriptions.some((seen) =>
      isFuzzyDuplicate(entry.description, seen, threshold),
    );

    if (!isDuplicate) {
      deduped.push(entry);
      seenDescriptions.push(entry.description);
    }
  });

  return deduped;
}

/**
 * Analyze entry similarity across multiple entries
 * @param {Object[]} entries - Array of entry objects
 * @param {number} threshold - Similarity threshold
 * @returns {Array} Array of duplicate groups [[entry1, entry2], [entry3], ...]
 */
function groupDuplicates(entries, threshold = 0.85) {
  if (!Array.isArray(entries)) {
    return [];
  }

  const groups = [];
  const used = new Set();

  entries.forEach((entry, index) => {
    if (used.has(index) || !entry || !entry.description) {
      return;
    }

    const group = [entry];
    used.add(index);

    entries.forEach((other, otherIndex) => {
      if (
        used.has(otherIndex) ||
        otherIndex <= index ||
        !other ||
        !other.description
      ) {
        return;
      }

      if (isFuzzyDuplicate(entry.description, other.description, threshold)) {
        group.push(other);
        used.add(otherIndex);
      }
    });

    groups.push(group);
  });

  return groups;
}

module.exports = {
  normalize,
  levenshteinDistance,
  calculateSimilarity,
  isFuzzyDuplicate,
  hasSemanticDuplicate,
  findBestMatch,
  deduplicateEntries,
  groupDuplicates,
};
