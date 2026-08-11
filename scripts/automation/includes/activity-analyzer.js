/**
 * Activity Analysis Utilities
 * Analyze issue activity and detect stale issues
 * @module scripts/automation/includes/activity-analyzer.js
 */

/**
 * ActivityAnalyzer provides activity detection and staleness analysis
 */
export class ActivityAnalyzer {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
  }

  /**
   * Get the last activity date for an issue
   * Considers: updated_at, last comment, any recent changes
   * @param {object} issue - Issue object from GitHub API
   * @returns {Date} Last activity date
   */
  getLastActivityDate(issue) {
    if (!issue) {
      return new Date(0); // Epoch
    }

    const dates = [];

    // Issue update date
    if (issue.updated_at) {
      dates.push(new Date(issue.updated_at));
    }

    // Issue creation date (fallback)
    if (issue.created_at) {
      dates.push(new Date(issue.created_at));
    }

    // Return most recent
    return dates.length > 0
      ? new Date(Math.max(...dates.map((d) => d.getTime())))
      : new Date(0);
  }

  /**
   * Get days since last activity
   * @param {object} issue - Issue object from GitHub API
   * @returns {number} Days since last activity
   */
  getDaysSinceActivity(issue) {
    const lastActivity = this.getLastActivityDate(issue);
    const now = new Date();
    const diffMs = now.getTime() - lastActivity.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
   * Check if an issue is stale (no activity for N days)
   * @param {object} issue - Issue object from GitHub API
   * @param {number} thresholdDays - Days threshold for staleness (default 30)
   * @returns {boolean} True if issue is stale
   */
  isStale(issue, thresholdDays = 30) {
    if (!issue) {
      return false;
    }

    const daysSinceActivity = this.getDaysSinceActivity(issue);
    return daysSinceActivity >= thresholdDays;
  }

  /**
   * Check if an issue has recent activity of a specific type
   * @param {object} issue - Issue object from GitHub API
   * @param {string} type - Type of activity: 'update', 'comment', 'label', 'assignment'
   * @param {number} thresholdDays - Days threshold for "recent" (default 7)
   * @returns {boolean} True if has recent activity of type
   */
  hasRecentChange(issue, type = "update", thresholdDays = 7) {
    if (!issue) {
      return false;
    }

    const daysSinceActivity = this.getDaysSinceActivity(issue);

    switch (type) {
      case "update":
      case "comment":
        // Check updated_at (covers both)
        return daysSinceActivity < thresholdDays;

      case "label":
      case "assignment":
      case "status":
        // For these, updated_at still applies
        return daysSinceActivity < thresholdDays;

      default:
        return false;
    }
  }

  /**
   * Calculate age of an issue (in days)
   * @param {object} issue - Issue object from GitHub API
   * @returns {number} Age in days
   */
  getIssueAgeDays(issue) {
    if (!issue || !issue.created_at) {
      return 0;
    }

    const created = new Date(issue.created_at);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
   * Categorize issue by activity level
   * @param {object} issue - Issue object from GitHub API
   * @returns {string} Activity level: 'active', 'stale', 'dormant', 'forgotten'
   */
  categorizeByActivity(issue) {
    const daysSince = this.getDaysSinceActivity(issue);

    if (daysSince < 7) {
      return "active";
    }
    if (daysSince < 30) {
      return "stale";
    }
    if (daysSince < 90) {
      return "dormant";
    }
    return "forgotten";
  }

  /**
   * Check if issue should be excluded from stale marking
   * @param {object} issue - Issue object from GitHub API
   * @returns {boolean} True if issue should be excluded
   */
  shouldExcludeFromStale(issue) {
    if (!issue) {
      return false;
    }

    const labels = issue.labels?.map((l) => l.name) || [];

    // Exclusion rules
    const exclusions = [
      "type:epic", // Long-running initiatives
      "status:in-progress", // Actively being worked
      "priority:critical", // Security/urgent items
      "status:blocked", // Waiting on dependency
    ];

    for (const exclusion of exclusions) {
      if (labels.includes(exclusion)) {
        return true;
      }
    }

    // Also exclude if in a milestone
    if (issue.milestone) {
      return true;
    }

    return false;
  }

  /**
   * Analyze a batch of issues and return activity summary
   * @param {object[]} issues - Array of issue objects
   * @returns {object} Activity analysis summary
   */
  analyzeBatch(issues) {
    if (!Array.isArray(issues)) {
      return {
        total: 0,
        active: 0,
        stale: 0,
        dormant: 0,
        forgotten: 0,
        avgDaysSinceActivity: 0,
      };
    }

    const analysis = {
      total: issues.length,
      active: 0,
      stale: 0,
      dormant: 0,
      forgotten: 0,
      avgDaysSinceActivity: 0,
      oldestIssue: null,
      newestIssue: null,
    };

    let totalDays = 0;
    let oldestDays = 0;
    let newestDays = Infinity;

    issues.forEach((issue) => {
      const days = this.getDaysSinceActivity(issue);
      totalDays += days;

      if (days >= oldestDays) {
        oldestDays = days;
        analysis.oldestIssue = {
          number: issue.number,
          title: issue.title,
          daysSinceActivity: days,
        };
      }

      if (days < newestDays) {
        newestDays = days;
        analysis.newestIssue = {
          number: issue.number,
          title: issue.title,
          daysSinceActivity: days,
        };
      }

      // Categorize
      const category = this.categorizeByActivity(issue);
      analysis[category]++;
    });

    analysis.avgDaysSinceActivity =
      issues.length > 0 ? Math.round(totalDays / issues.length) : 0;

    return analysis;
  }

  /**
   * Find issues that are stale but have exclusion labels
   * Useful for identifying false negatives
   * @param {object[]} issues - Array of issue objects
   * @param {number} thresholdDays - Staleness threshold
   * @returns {object[]} Stale but excluded issues
   */
  findExcludedStaleIssues(issues, thresholdDays = 30) {
    if (!Array.isArray(issues)) {
      return [];
    }

    return issues.filter((issue) => {
      const stale = this.isStale(issue, thresholdDays);
      const excluded = this.shouldExcludeFromStale(issue);
      return stale && excluded;
    });
  }
}

export default ActivityAnalyzer;
