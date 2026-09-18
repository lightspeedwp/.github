/**
 * Reviewer Agent v2 - State Manager
 * Persists feedback and tracking across PR cycles
 *
 * Responsibility:
 * - Persist findings to .github/data/reviews/{pr_number}/
 * - Track review cycles (cycle-1.json, cycle-2.json, etc.)
 * - Store decision log (.review-decisions.md)
 * - Load prior state when PR receives new commits
 * - Implement cleanup (retention: 90 days)
 * - Atomic writes to prevent corruption
 */

const fs = require("fs").promises;
const path = require("path");

const REVIEWS_DATA_DIR = ".github/data/reviews";
const RETENTION_DAYS = 90;

class StateManager {
  constructor(baseDir = process.cwd()) {
    this.baseDir = baseDir;
    this.reviewsDir = path.join(baseDir, REVIEWS_DATA_DIR);
  }

  /**
   * Get the PR review directory
   * @private
   */
  _getPrDir(prNumber) {
    return path.join(this.reviewsDir, String(prNumber));
  }

  /**
   * Get the cycle file path for a PR
   * @private
   */
  _getCycleFilePath(prNumber, cycle) {
    return path.join(this._getPrDir(prNumber), `cycle-${cycle}.json`);
  }

  /**
   * Get the decisions log file path
   * @private
   */
  _getDecisionsFilePath(prNumber) {
    return path.join(this._getPrDir(prNumber), ".review-decisions.md");
  }

  /**
   * Ensure PR directory exists
   * @private
   */
  async _ensurePrDir(prNumber) {
    const prDir = this._getPrDir(prNumber);
    try {
      await fs.mkdir(prDir, { recursive: true });
    } catch (error) {
      if (error.code !== "EEXIST") {
        throw error;
      }
    }
  }

  /**
   * Load prior state for a PR (all cycles)
   * @returns {Object} - Combined state from all cycles
   */
  async loadPrState(prNumber) {
    try {
      const prDir = this._getPrDir(prNumber);
      const files = await fs.readdir(prDir);
      const cycles = [];

      for (const file of files) {
        if (file.startsWith("cycle-") && file.endsWith(".json")) {
          const filePath = path.join(prDir, file);
          const content = await fs.readFile(filePath, "utf-8");
          cycles.push(JSON.parse(content));
        }
      }

      // Sort by cycle number (ascending)
      cycles.sort((a, b) => a.review_cycle - b.review_cycle);

      return {
        pr_number: prNumber,
        cycles,
        latest_cycle: cycles[cycles.length - 1] || null,
      };
    } catch (error) {
      if (error.code === "ENOENT") {
        return {
          pr_number: prNumber,
          cycles: [],
          latest_cycle: null,
        };
      }
      throw error;
    }
  }

  /**
   * Save findings for a specific cycle (atomic write)
   * @param {number} prNumber - PR number
   * @param {number} cycle - Cycle number
   * @param {Object} findings - Array of findings
   * @param {Array} toolsTriggered - Tools that were run
   * @returns {Promise<Object>} - Saved state object
   */
  async saveFinding(prNumber, cycle, findings, toolsTriggered = []) {
    await this._ensurePrDir(prNumber);

    const state = {
      pr_number: prNumber,
      review_cycle: cycle,
      review_timestamp: new Date().toISOString(),
      tools_triggered: toolsTriggered,
      findings: findings || [],
    };

    const filePath = this._getCycleFilePath(prNumber, cycle);
    const tempPath = `${filePath}.tmp`;

    // Atomic write: write to temp file, then rename
    try {
      await fs.writeFile(tempPath, JSON.stringify(state, null, 2));
      await fs.rename(tempPath, filePath);
    } catch (error) {
      // Clean up temp file on error
      try {
        await fs.unlink(tempPath);
      } catch (e) {
        // Ignore cleanup error
      }
      throw error;
    }

    return state;
  }

  /**
   * Mark a finding as resolved in a specific commit
   * Updates the latest cycle's finding status
   *
   * @param {number} prNumber - PR number
   * @param {string} findingId - Finding identifier
   * @param {string} commitSha - Commit SHA that resolved it
   */
  async markResolved(prNumber, findingId, commitSha) {
    const state = await this.loadPrState(prNumber);
    if (!state.latest_cycle) {
      return; // No cycle to update
    }

    const findings = state.latest_cycle.findings;
    const finding = findings.find((f) => f.id === findingId);
    if (finding) {
      finding.status = "resolved";
      finding.resolved_in_commit = commitSha;

      // Save updated cycle
      await this.saveFinding(
        prNumber,
        state.latest_cycle.review_cycle,
        findings,
        state.latest_cycle.tools_triggered,
      );
    }
  }

  /**
   * Get the next cycle number for a PR
   * @returns {Promise<number>} - Next cycle number (1-indexed)
   */
  async getNextCycle(prNumber) {
    const state = await this.loadPrState(prNumber);
    const latestCycle = state.latest_cycle?.review_cycle || 0;
    return latestCycle + 1;
  }

  /**
   * Append to the decisions log
   * @param {number} prNumber - PR number
   * @param {string} decision - Decision text to append
   */
  async appendDecision(prNumber, decision) {
    await this._ensurePrDir(prNumber);

    const filePath = this._getDecisionsFilePath(prNumber);
    const timestamp = new Date().toISOString();
    const entry = `\n## ${timestamp}\n${decision}\n`;

    try {
      await fs.appendFile(filePath, entry);
    } catch (error) {
      if (error.code === "ENOENT") {
        // File doesn't exist, create it
        await fs.writeFile(
          filePath,
          `# Review Decisions for PR #${prNumber}${entry}`,
        );
      } else {
        throw error;
      }
    }
  }

  /**
   * Clean up old reviews (older than retention period)
   * @param {number} retentionDays - Days to retain (default 90)
   * @returns {Promise<number>} - Number of reviews removed
   */
  async cleanupOldReviews(retentionDays = RETENTION_DAYS) {
    try {
      const dirs = await fs.readdir(this.reviewsDir);
      const cutoffTime = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
      let removedCount = 0;

      for (const dir of dirs) {
        const dirPath = path.join(this.reviewsDir, dir);
        const stats = await fs.stat(dirPath);

        if (stats.mtimeMs < cutoffTime) {
          await this._removeRecursive(dirPath);
          removedCount++;
        }
      }

      return removedCount;
    } catch (error) {
      if (error.code === "ENOENT") {
        return 0;
      }
      throw error;
    }
  }

  /**
   * Remove directory recursively
   * @private
   */
  async _removeRecursive(dirPath) {
    try {
      const files = await fs.readdir(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
          await this._removeRecursive(filePath);
        } else {
          await fs.unlink(filePath);
        }
      }
      await fs.rmdir(dirPath);
    } catch (error) {
      console.error(`Error removing directory ${dirPath}:`, error.message);
      throw error;
    }
  }
}

module.exports = StateManager;
