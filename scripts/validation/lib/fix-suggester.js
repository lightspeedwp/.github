/**
 * Fix Suggester (T023)
 * Suggests corrections for broken references using fuzzy matching
 * and contextual analysis
 */

export class FixSuggester {
  constructor(options = {}) {
    this.agentIndex = options.agentIndex || new Map();
    this.skillIndex = options.skillIndex || new Map();
    this.similarityThreshold = options.similarityThreshold || 0.6;
  }

  /**
   * Calculate edit distance (Levenshtein) for fuzzy matching
   */
  levenshteinDistance(str1, str2) {
    const track = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(0));

    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }

    return track[str2.length][str1.length];
  }

  /**
   * Calculate similarity score (0-1, where 1 is identical)
   */
  calculateSimilarity(str1, str2) {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - distance / maxLength;
  }

  /**
   * Find similar candidates for a broken reference
   */
  findCandidates(brokenReference, targetType = 'agent') {
    const index = targetType === 'agent' ? this.agentIndex : this.skillIndex;
    const candidates = [];

    for (const [name, _value] of index) {
      const similarity = this.calculateSimilarity(brokenReference, name);
      if (similarity >= this.similarityThreshold) {
        candidates.push({
          suggestion: name,
          similarity: Math.round(similarity * 100) / 100,
          confidence: similarity > 0.8 ? 'high' : similarity > 0.6 ? 'medium' : 'low',
        });
      }
    }

    // Sort by similarity, highest first
    return candidates.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Suggest fix for a broken reference
   */
  suggestFix(brokenReference, _referenceType, targetType = 'agent') {
    const candidates = this.findCandidates(brokenReference, targetType);

    if (candidates.length === 0) {
      return {
        reference: brokenReference,
        suggestion: null,
        reason: `No similar ${targetType} found (threshold: ${this.similarityThreshold})`,
        candidates: [],
      };
    }

    return {
      reference: brokenReference,
      suggestion: candidates[0].suggestion,
      confidence: candidates[0].confidence,
      similarity: candidates[0].similarity,
      alternativeCandidates: candidates.slice(1, 3),
      reason: `Best match found with ${Math.round(candidates[0].similarity * 100)}% similarity`,
    };
  }

  /**
   * Suggest fixes for multiple broken references
   */
  suggestFixesBatch(brokenReferences) {
    return brokenReferences.map((ref) =>
      this.suggestFix(ref.value, ref.type, ref.targetType || 'agent')
    );
  }

  /**
   * Add index entry for agents or skills
   */
  addToIndex(name, targetType = 'agent') {
    const index = targetType === 'agent' ? this.agentIndex : this.skillIndex;
    index.set(name, true);
  }

  /**
   * Build index from list of names
   */
  buildIndex(names, targetType = 'agent') {
    for (const name of names) {
      this.addToIndex(name, targetType);
    }
  }
}

export default FixSuggester;
