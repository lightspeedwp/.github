const logger = require('./logger.cjs');
const { ValidationError } = require('./errors.cjs');

class PatternEngine {
  /**
   * Compile and cache regex patterns
   * @param {Array} patterns - Array of pattern objects with regex and optional context
   * @returns {Array} Compiled pattern objects with regex ready for use
   */
  compilePatterns(patterns) {
    if (!Array.isArray(patterns)) {
      throw new ValidationError('Patterns must be an array');
    }

    return patterns.map((pattern, index) => {
      if (!pattern.regex) {
        throw new ValidationError(`Pattern at index ${index} missing "regex" field`);
      }

      try {
        // Compile regex with flags if provided
        const regex = new RegExp(pattern.regex, pattern.flags || '');
        return {
          regex,
          description: pattern.description || pattern.regex,
          context: pattern.context || false,
          contextLength: pattern.contextLength || 50
        };
      } catch (error) {
        throw new ValidationError(
          `Invalid regex pattern at index ${index}: ${error.message}`
        );
      }
    });
  }

  /**
   * Apply patterns to text and return matches
   * @param {string} text - Text to search in
   * @param {Array} patterns - Compiled pattern objects
   * @param {Object} options - Options like startPos, endPos, limit
   * @returns {Array} Array of match objects with position and context
   */
  applyPatterns(text, patterns, options = {}) {
    if (typeof text !== 'string') {
      throw new ValidationError('Text must be a string');
    }

    if (!Array.isArray(patterns)) {
      throw new ValidationError('Patterns must be an array');
    }

    const matches = [];
    const { limit = Infinity } = options;

    for (const pattern of patterns) {
      if (!pattern.regex) {
        logger.warn('Skipping pattern without compiled regex');
        continue;
      }

      // Extract all matches globally
      const regex = pattern.regex.global
        ? pattern.regex
        : new RegExp(pattern.regex.source, (pattern.regex.flags || '') + 'g');

      let match;
      while ((match = regex.exec(text)) !== null && matches.length < limit) {
        const matchObj = this.buildMatchObject(match, text, pattern);
        matches.push(matchObj);
      }

      if (matches.length >= limit) break;
    }

    return matches;
  }

  /**
   * Build a match object with context information
   * @param {Object} match - RegExp match object
   * @param {string} text - Full text being searched
   * @param {Object} pattern - Pattern object with context settings
   * @returns {Object} Match object with position and optional context
   */
  buildMatchObject(match, text, pattern) {
    const matchObj = {
      matched: match[0],
      index: match.index,
      line: this.getLineNumber(text, match.index),
      column: this.getColumnNumber(text, match.index),
      description: pattern.description || pattern.regex.source,
      groups: match.groups || {}
    };

    // Add context if requested
    if (pattern.context) {
      const contextLength = pattern.contextLength || 50;
      const startPos = Math.max(0, match.index - contextLength);
      const endPos = Math.min(text.length, match.index + match[0].length + contextLength);

      matchObj.context = {
        before: text.substring(startPos, match.index),
        matched: match[0],
        after: text.substring(match.index + match[0].length, endPos)
      };
    }

    return matchObj;
  }

  /**
   * Get line number for a position in text
   * @param {string} text - Text content
   * @param {number} position - Character position
   * @returns {number} 1-indexed line number
   */
  getLineNumber(text, position) {
    if (position < 0 || position > text.length) return 1;
    return text.substring(0, position).split('\n').length;
  }

  /**
   * Get column number for a position in text
   * @param {string} text - Text content
   * @param {number} position - Character position
   * @returns {number} 0-indexed column number
   */
  getColumnNumber(text, position) {
    if (position < 0 || position > text.length) return 0;
    const lines = text.substring(0, position).split('\n');
    return lines[lines.length - 1].length;
  }

  /**
   * Test if text matches any pattern
   * @param {string} text - Text to test
   * @param {Array} patterns - Compiled pattern objects
   * @returns {boolean} True if any pattern matches
   */
  matches(text, patterns) {
    if (typeof text !== 'string') return false;
    if (!Array.isArray(patterns)) return false;

    for (const pattern of patterns) {
      if (!pattern.regex) continue;

      // Reset global flag for fresh matching
      const regex = pattern.regex.global
        ? pattern.regex
        : new RegExp(pattern.regex.source, (pattern.regex.flags || '') + 'g');

      // Test pattern
      regex.lastIndex = 0;
      if (regex.test(text)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Find first match in text
   * @param {string} text - Text to search
   * @param {Array} patterns - Compiled pattern objects
   * @returns {Object|null} First match object or null if not found
   */
  findFirst(text, patterns) {
    const matches = this.applyPatterns(text, patterns, { limit: 1 });
    return matches.length > 0 ? matches[0] : null;
  }

  /**
   * Count total matches across all patterns
   * @param {string} text - Text to search
   * @param {Array} patterns - Compiled pattern objects
   * @returns {number} Total number of matches
   */
  countMatches(text, patterns) {
    if (typeof text !== 'string') return 0;
    if (!Array.isArray(patterns)) return 0;

    let count = 0;
    for (const pattern of patterns) {
      if (!pattern.regex) continue;

      const regex = pattern.regex.global
        ? pattern.regex
        : new RegExp(pattern.regex.source, (pattern.regex.flags || '') + 'g');

      let match;
      while ((match = regex.exec(text)) !== null) {
        count++;
      }
    }

    return count;
  }

  /**
   * Extract all capturing groups from text using first matching pattern
   * @param {string} text - Text to search
   * @param {Array} patterns - Compiled pattern objects
   * @returns {Object|null} Captured groups from first match or null
   */
  extractGroups(text, patterns) {
    const match = this.findFirst(text, patterns);
    return match ? match.groups : null;
  }

  /**
   * Test individual regex pattern (for debugging)
   * @param {string} pattern - Regex pattern string
   * @param {string} text - Text to test
   * @param {string} flags - Optional regex flags
   * @returns {boolean} Whether pattern matches text
   */
  testPattern(pattern, text, flags = '') {
    try {
      const regex = new RegExp(pattern, flags);
      return regex.test(text);
    } catch (error) {
      logger.warn(`Invalid regex pattern: ${error.message}`);
      return false;
    }
  }
}

module.exports = new PatternEngine();
