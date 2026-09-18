/**
 * Utility functions for changelog validation system
 */

const fs = require('fs');
const path = require('path');

/**
 * Read YAML or JSON file safely
 * @param {string} filePath - Path to file
 * @returns {object|null} Parsed content or null if error
 */
function readFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error.message}`);
  }
}

/**
 * Write file safely with directory creation
 * @param {string} filePath - Path to file
 * @param {string} content - Content to write
 */
function writeFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error.message}`);
  }
}

/**
 * Extract PR/issue references from text
 * Pattern: #123, #456, etc.
 * @param {string} text - Text to search
 * @returns {number[]} Array of PR/issue numbers
 */
function extractReferences(text) {
  const regex = /#(\d+)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(parseInt(match[1], 10));
  }
  return [...new Set(matches)]; // Remove duplicates
}

/**
 * Check if string is valid ISO 8601 date
 * @param {string} dateString - Date to check
 * @returns {boolean} True if valid ISO 8601
 */
function isValidISO8601Date(dateString) {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}Z?)?$/;
  return iso8601Regex.test(dateString);
}

/**
 * Check if text contains any pattern from patterns array
 * @param {string} text - Text to search
 * @param {RegExp[]} patterns - Array of regex patterns
 * @returns {object[]} Array of matches with context
 */
function findPatternMatches(text, patterns) {
  const matches = [];
  patterns.forEach((pattern) => {
    const regex = new RegExp(pattern.pattern, pattern.flags || 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        pattern: pattern.pattern,
        context: pattern.context,
        matchedText: match[0],
        index: match.index,
      });
    }
  });
  return matches;
}

/**
 * Sleep for given milliseconds (async)
 * @param {number} ms - Milliseconds to sleep
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format date as ISO 8601
 * @param {Date} date - Date to format
 * @returns {string} ISO 8601 formatted date
 */
function formatISO8601(date = new Date()) {
  return date.toISOString().split('T')[0];
}

/**
 * Deep clone object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = {
  readFile,
  writeFile,
  extractReferences,
  isValidISO8601Date,
  findPatternMatches,
  sleep,
  formatISO8601,
  deepClone,
};
