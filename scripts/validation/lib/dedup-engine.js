/**
 * Deduplication Engine (T048-T052)
 * Phase 5: Consolidate & Deduplicate Agent Skills
 * Implements SHA-256 hashing and cosine similarity (85% threshold)
 */

import fs from 'fs';
import crypto from 'crypto';

class DedupEngine {
  constructor(options = {}) {
    this.similarityThreshold = options.threshold || 0.85;
  }

  /**
   * T048: Calculate SHA-256 hash of a file
   */
  calculateHash(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return crypto.createHash('sha256').update(content).digest('hex');
    } catch (error) {
      return null;
    }
  }

  /**
   * Tokenize content for similarity comparison
   */
  tokenize(content) {
    // Split into words and normalize
    return content
      .toLowerCase()
      .split(/\s+/)
      .filter((_token) => _token.length > 2); // Ignore short tokens
  }

  /**
   * Calculate Jaccard similarity between two token sets
   */
  jaccardSimilarity(tokens1, tokens2) {
    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);

    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    if (union.size === 0) return 1.0; // Both empty

    return intersection.size / union.size;
  }

  /**
   * Calculate cosine similarity between two token vectors (bag-of-words)
   */
  cosineSimilarity(tokens1, tokens2) {
    const freq1 = this.tokenFrequency(tokens1);
    const freq2 = this.tokenFrequency(tokens2);

    const keys = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);

    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    for (const key of keys) {
      const f1 = freq1[key] || 0;
      const f2 = freq2[key] || 0;

      dotProduct += f1 * f2;
      mag1 += f1 * f1;
      mag2 += f2 * f2;
    }

    const denominator = Math.sqrt(mag1) * Math.sqrt(mag2);
    if (denominator === 0) return 0;

    return dotProduct / denominator;
  }

  /**
   * Calculate token frequency
   */
  tokenFrequency(tokens) {
    const freq = {};

    for (const token of tokens) {
      freq[token] = (freq[token] || 0) + 1;
    }

    return freq;
  }

  /**
   * Calculate combined similarity (weighted: 60% cosine, 40% Jaccard)
   */
  calculateSimilarity(content1, content2) {
    const tokens1 = this.tokenize(content1);
    const tokens2 = this.tokenize(content2);

    const cosine = this.cosineSimilarity(tokens1, tokens2);
    const jaccard = this.jaccardSimilarity(tokens1, tokens2);

    // Weighted average: 60% cosine (content structure), 40% Jaccard (set overlap)
    const similarity = 0.6 * cosine + 0.4 * jaccard;

    return Math.round(similarity * 10000) / 10000; // 4 decimal places
  }

  /**
   * T049 & T052: Find near-duplicates using cosine similarity
   */
  findNearDuplicates(skills) {
    const nearDuplicates = [];
    const checked = new Set();

    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        const skill1 = skills[i];
        const skill2 = skills[j];

        const key = `${skill1.hash}:${skill2.hash}`;
        if (checked.has(key)) continue;

        checked.add(key);

        // Skip if either skill has no hash
        if (!skill1.hash || !skill2.hash) continue;

        // Skip if already exact duplicates
        if (skill1.hash === skill2.hash) continue;

        // Calculate similarity
        try {
          const content1 = fs.readFileSync(skill1.path, 'utf-8');
          const content2 = fs.readFileSync(skill2.path, 'utf-8');

          const similarity = this.calculateSimilarity(content1, content2);

          // Report if above threshold
          if (similarity >= this.similarityThreshold) {
            nearDuplicates.push({
              similarity: Math.round(similarity * 100),
              skill1: {
                name: skill1.name,
                path: skill1.path,
                category: skill1.category,
                hash: skill1.hash,
                size: skill1.size,
              },
              skill2: {
                name: skill2.name,
                path: skill2.path,
                category: skill2.category,
                hash: skill2.hash,
                size: skill2.size,
              },
            });
          }
        } catch (_error) {
          continue;
        }
      }
    }

    return nearDuplicates.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Analyze duplication patterns
   */
  analyzeDuplication(skills, exactDuplicates, nearDuplicates) {
    const analysis = {
      totalSkills: skills.length,
      exactDuplicateGroups: exactDuplicates.length,
      exactDuplicateCount: exactDuplicates.reduce((sum, g) => sum + g.count - 1, 0),
      nearDuplicatePairs: nearDuplicates.length,
      duplicatedSkillsEstimate: new Set(),
      consolidationOpportunities: 0,
    };

    // Count skills involved in exact duplicates
    for (const group of exactDuplicates) {
      for (const skill of group.skills) {
        analysis.duplicatedSkillsEstimate.add(skill.path);
      }
    }

    // Count skills involved in near duplicates
    for (const pair of nearDuplicates) {
      analysis.duplicatedSkillsEstimate.add(pair.skill1.path);
      analysis.duplicatedSkillsEstimate.add(pair.skill2.path);
    }

    analysis.duplicatedSkillsCount = analysis.duplicatedSkillsEstimate.size;
    analysis.consolidationOpportunities = analysis.exactDuplicateCount + nearDuplicates.length;
    // Convert before returning: this object is JSON.stringify'd downstream
    // (phase-5-skills-audit.js), and JSON.stringify(Set) serialises to "{}".
    analysis.duplicatedSkillsEstimate = [...analysis.duplicatedSkillsEstimate];

    return analysis;
  }

  /**
   * Generate deduplication recommendations
   */
  generateRecommendations(exactDuplicates, nearDuplicates) {
    const recommendations = [];

    // Priority 1: Exact duplicates
    for (const group of exactDuplicates) {
      const recommendation = {
        type: 'exact-duplicate',
        priority: 1,
        skills: group.skills,
        suggestedAction: `Consolidate ${group.count} exact duplicates`,
        consolidatedPath: this.suggestConsolidatedPath(group.skills),
        effort: 'low',
      };

      recommendations.push(recommendation);
    }

    // Priority 2: Near duplicates
    for (const pair of nearDuplicates) {
      const recommendation = {
        type: 'near-duplicate',
        priority: 2,
        similarity: pair.similarity,
        skill1: pair.skill1,
        skill2: pair.skill2,
        suggestedAction: `Review and potentially merge skills (${pair.similarity}% similar)`,
        effort: 'medium',
        review: 'requires-manual-review',
      };

      recommendations.push(recommendation);
    }

    return recommendations;
  }

  /**
   * Suggest consolidated path for exact duplicates
   */
  suggestConsolidatedPath(skills) {
    // Prefer root skills over agent skills
    const rootSkills = skills.filter((s) => !s.path.includes('/agents/'));
    if (rootSkills.length > 0) {
      return rootSkills[0].path;
    }

    // Otherwise use the most complete/largest one
    return skills.reduce((max, s) => (s.size > max.size ? s : max)).path;
  }
}

export default DedupEngine;
