/**
 * Deduplication Detection Engine (T015)
 * Identifies exact and near-duplicate skills using:
 * - SHA-256 hashing for exact matches
 * - Cosine similarity @ 85% threshold for near-duplicates
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export class DedupEngine {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.similarityThreshold = options.similarityThreshold || 0.85;
    this.skillCache = new Map();
  }

  /**
   * Calculate SHA-256 hash of file content
   */
  calculateHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Tokenize text for similarity calculation
   */
  tokenize(text) {
    // Split into words, remove common words
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'is', 'are', 'to', 'for']);
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2 && !commonWords.has(word));
  }

  /**
   * Calculate cosine similarity between two texts
   */
  cosineSimilarity(text1, text2) {
    const tokens1 = this.tokenize(text1);
    const tokens2 = this.tokenize(text2);

    if (tokens1.length === 0 || tokens2.length === 0) {
      return 0;
    }

    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);

    const intersection = [...set1].filter((x) => set2.has(x));
    const union = new Set([...set1, ...set2]);

    return intersection.length / union.size;
  }

  /**
   * Detect exact duplicates (100% hash match)
   */
  findExactDuplicates(skills) {
    const hashMap = new Map();
    const duplicates = [];

    for (const skill of skills) {
      const hash = skill.hash;
      if (!hashMap.has(hash)) {
        hashMap.set(hash, []);
      }
      hashMap.get(hash).push(skill);
    }

    // Find groups with more than one skill
    for (const [hash, group] of hashMap.entries()) {
      if (group.length > 1) {
        duplicates.push({
          type: 'exact',
          hash,
          similarity: 1.0,
          skills: group,
          count: group.length,
        });
      }
    }

    return duplicates;
  }

  /**
   * Detect near-duplicates (>= 85% similarity)
   */
  findNearDuplicates(skills) {
    const nearDuplicates = [];
    const compared = new Set();

    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        const key = `${skills[i].path}-${skills[j].path}`;
        if (compared.has(key)) continue;
        compared.add(key);

        const similarity = this.cosineSimilarity(skills[i].content, skills[j].content);

        if (similarity >= this.similarityThreshold && similarity < 1.0) {
          nearDuplicates.push({
            type: 'near-duplicate',
            similarity: Math.round(similarity * 100) / 100,
            skills: [skills[i], skills[j]],
          });
        }
      }
    }

    return nearDuplicates;
  }

  /**
   * Load and hash all skills
   */
  loadSkills(skillPaths) {
    const skills = [];

    for (const skillPath of skillPaths) {
      const fullPath = path.join(this.rootDir, skillPath);
      if (!fs.existsSync(fullPath)) continue;

      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const hash = this.calculateHash(content);

        skills.push({
          path: skillPath,
          name: path.basename(skillPath, path.extname(skillPath)),
          content,
          hash,
          size: content.length,
        });
      } catch (error) {
        console.warn(`Cannot read skill ${skillPath}: ${error.message}`);
      }
    }

    return skills;
  }

  /**
   * Perform complete deduplication analysis
   */
  analyze(skillPaths) {
    const skills = this.loadSkills(skillPaths);

    const results = {
      totalSkills: skills.length,
      exactDuplicates: this.findExactDuplicates(skills),
      nearDuplicates: this.findNearDuplicates(skills),
      stats: {
        uniqueByHash: new Set(skills.map((s) => s.hash)).size,
        totalExactMatches: this.findExactDuplicates(skills).reduce(
          (sum, d) => sum + d.count - 1,
          0
        ),
        nearDuplicateCount: this.findNearDuplicates(skills).length,
      },
    };

    return results;
  }
}

export default DedupEngine;
