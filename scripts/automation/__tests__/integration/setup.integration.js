/**
 * Integration test setup and utilities
 * Provides mock GitHub API, test data, and test helpers for Phase 5 integration tests
 * @module scripts/automation/__tests__/integration/setup.integration.js
 */

/**
 * Mock GitHub API client for integration testing
 */
export class MockGitHubClient {
  constructor(options = {}) {
    this.options = options;
    this.issues = new Map();
    this.labels = new Map();
    this.auditLog = [];
  }

  /**
   * Create mock issue
   */
  createIssue(issueData) {
    const issue = {
      number: this.issues.size + 1,
      title: issueData.title,
      body: issueData.body || "",
      labels: issueData.labels || [],
      createdAt: issueData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      state: "open",
      linkedPRs: issueData.linkedPRs || [],
      ...issueData,
    };
    this.issues.set(issue.number, issue);
    return issue;
  }

  /**
   * Get issue with labels
   */
  async getIssue(issueNumber) {
    return this.issues.get(issueNumber);
  }

  /**
   * List issues with optional filter
   */
  async listIssues(options = {}) {
    let issues = Array.from(this.issues.values());

    if (options.state) {
      issues = issues.filter((i) => i.state === options.state);
    }

    if (options.labels && options.labels.length > 0) {
      issues = issues.filter((i) =>
        options.labels.every((label) => i.labels.includes(label)),
      );
    }

    return issues;
  }

  /**
   * Add label to issue
   */
  async addLabel(issueNumber, label) {
    const issue = this.issues.get(issueNumber);
    if (issue && !issue.labels.includes(label)) {
      issue.labels.push(label);
      this.auditLog.push({
        action: "label:add",
        issue: issueNumber,
        label,
        timestamp: new Date().toISOString(),
      });
    }
    return issue;
  }

  /**
   * Remove label from issue
   */
  async removeLabel(issueNumber, label) {
    const issue = this.issues.get(issueNumber);
    if (issue) {
      issue.labels = issue.labels.filter((l) => l !== label);
      this.auditLog.push({
        action: "label:remove",
        issue: issueNumber,
        label,
        timestamp: new Date().toISOString(),
      });
    }
    return issue;
  }

  /**
   * Link PR to issue
   */
  async linkPR(issueNumber, prNumber) {
    const issue = this.issues.get(issueNumber);
    if (issue && !issue.linkedPRs.includes(prNumber)) {
      issue.linkedPRs.push(prNumber);
      this.auditLog.push({
        action: "pr:link",
        issue: issueNumber,
        pr: prNumber,
        timestamp: new Date().toISOString(),
      });
    }
    return issue;
  }

  /**
   * Get audit log
   */
  getAuditLog() {
    return this.auditLog;
  }

  /**
   * Clear state (for test isolation)
   */
  reset() {
    this.issues.clear();
    this.labels.clear();
    this.auditLog = [];
  }
}

/**
 * Test data generators
 */
export const testData = {
  /**
   * Create test issue with various states
   */
  createTestIssue(overrides = {}) {
    return {
      number: 1001,
      title: "Test Issue",
      body: "Test issue body",
      labels: [],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      updatedAt: new Date().toISOString(),
      state: "open",
      linkedPRs: [],
      ...overrides,
    };
  },

  /**
   * Create stale issue (30+ days without activity)
   */
  createStaleIssue(overrides = {}) {
    return this.createTestIssue({
      title: "Stale Test Issue",
      updatedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
      ...overrides,
    });
  },

  /**
   * Create issue with linked PR
   */
  createIssueWithPR(overrides = {}) {
    return this.createTestIssue({
      title: "Issue with PR",
      linkedPRs: [5001],
      ...overrides,
    });
  },

  /**
   * Create batch of test issues
   */
  createIssuesBatch(count, options = {}) {
    const issues = [];
    for (let i = 0; i < count; i++) {
      issues.push(
        this.createTestIssue({
          number: 2000 + i,
          title: `Batch Issue ${i + 1}`,
          ...options,
        }),
      );
    }
    return issues;
  },
};

/**
 * Assertion helpers for integration tests
 */
export const assertions = {
  /**
   * Assert label was applied
   */
  assertLabelApplied(issue, label) {
    expect(issue.labels).toContain(label);
  },

  /**
   * Assert label was removed
   */
  assertLabelRemoved(issue, label) {
    expect(issue.labels).not.toContain(label);
  },

  /**
   * Assert all issues have label
   */
  assertAllLabeled(issues, label) {
    issues.forEach((issue) => {
      expect(issue.labels).toContain(label);
    });
  },

  /**
   * Assert audit log entry exists
   */
  assertAuditLogEntry(auditLog, action, issueNumber) {
    const entry = auditLog.find(
      (e) => e.action === action && e.issue === issueNumber,
    );
    expect(entry).toBeDefined();
  },

  /**
   * Assert no data corruption (all labels valid)
   */
  assertNoDataCorruption(issues) {
    issues.forEach((issue) => {
      expect(Array.isArray(issue.labels)).toBe(true);
      issue.labels.forEach((label) => {
        expect(typeof label).toBe("string");
        expect(label).toMatch(/^[\w:.-]+$/); // Valid label format
      });
    });
  },

  /**
   * Assert performance metrics acceptable
   */
  assertPerformanceAcceptable(metrics, targets = {}) {
    const defaultTargets = {
      executionTime: 5000, // 5 seconds
      apiCalls: 100,
      errorRate: 0.01, // 1%
      ...targets,
    };

    expect(metrics.executionTime).toBeLessThanOrEqual(
      defaultTargets.executionTime,
    );
    expect(metrics.apiCalls).toBeLessThanOrEqual(defaultTargets.apiCalls);
    if (metrics.errorCount) {
      const actualErrorRate = metrics.errorCount / metrics.totalCount;
      expect(actualErrorRate).toBeLessThanOrEqual(defaultTargets.errorRate);
    }
  },
};

/**
 * Test utilities
 */
export const utils = {
  /**
   * Measure execution time
   */
  async measureTime(fn) {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    return { result, duration };
  },

  /**
   * Simulate API rate limiting
   */
  async withRateLimit(fn, delay = 100) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fn();
  },

  /**
   * Generate test report
   */
  generateReport(results) {
    return {
      totalTests: results.length,
      passed: results.filter((r) => r.passed).length,
      failed: results.filter((r) => !r.passed).length,
      passRate: `${(
        (results.filter((r) => r.passed).length / results.length) *
        100
      ).toFixed(1)}%`,
      timestamp: new Date().toISOString(),
    };
  },
};

export default {
  MockGitHubClient,
  testData,
  assertions,
  utils,
};
