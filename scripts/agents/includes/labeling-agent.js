/**
 * LabelingAgent — Intelligent label assignment for GitHub issues
 * Assigns type, area, and priority labels based on issue metadata and content
 *
 * Features:
 * - Type detection (bug, feature, task, epic, story, improvement, chore, docs, design, refactor)
 * - Area routing (ci, scripts, tests, docs, governance, performance, security)
 * - Priority extraction (urgent, high, normal, low)
 * - Batch processing with confidence scoring
 * - Dry-run preview mode
 */

const LABEL_RULES = {
  type: {
    bug: {
      confidence: 0.95,
      keywords: ["bug", "error", "crash", "failure", "defect", "broken"],
      templateSection: "Root Cause",
      description: "Reproducible defect or error",
    },
    feature: {
      confidence: 0.95,
      keywords: [
        "feature",
        "enhancement",
        "new capability",
        "new functionality",
      ],
      templateSection: "Acceptance Criteria",
      description: "New capability or user-visible enhancement",
    },
    task: {
      confidence: 0.9,
      keywords: ["task", "implementation", "setup", "configure"],
      templateSection: "Steps",
      description: "Scoped work with clear deliverable",
    },
    epic: {
      confidence: 0.85,
      keywords: ["epic", "initiative", "phase", "program"],
      templateSection: "User Stories",
      description: "Large multi-part initiative",
    },
    story: {
      confidence: 0.9,
      keywords: ["story", "user story", "narrative"],
      templateSection: "Acceptance Criteria",
      description: "User-centric narrative with AC",
    },
    improvement: {
      confidence: 0.85,
      keywords: ["improvement", "optimization", "enhancement", "better"],
      templateSection: "Proposed Solution",
      description: "Enhancement to existing functionality",
    },
    chore: {
      confidence: 0.8,
      keywords: [
        "chore",
        "maintenance",
        "cleanup",
        "housekeeping",
        "dependency",
      ],
      templateSection: "Changes",
      description: "Maintenance and housekeeping",
    },
    documentation: {
      confidence: 0.9,
      keywords: ["documentation", "docs", "readme", "guide", "tutorial"],
      templateSection: "Documentation",
      description: "Documentation and content",
    },
    design: {
      confidence: 0.85,
      keywords: [
        "design",
        "ui",
        "ux",
        "accessibility",
        "a11y",
        "token",
        "theme",
      ],
      templateSection: "Design Specs",
      description: "UI/UX, tokens, and accessibility",
    },
    "code-refactor": {
      confidence: 0.85,
      keywords: [
        "refactor",
        "refactoring",
        "simplify",
        "clean up",
        "restructure",
      ],
      templateSection: "Changes",
      description: "Code cleanup without changing behavior",
    },
  },

  area: {
    ci: {
      keywords: [
        "workflow",
        "github-actions",
        "action",
        "ci",
        "cd",
        "github actions",
      ],
      patterns: [/.github\/workflows/, /\.yml$/],
      description: "CI/CD workflows and GitHub Actions",
    },
    scripts: {
      keywords: [
        "script",
        "automation",
        "node",
        "javascript",
        "script",
        "executable",
      ],
      patterns: [/scripts\//, /\.js$/],
      description: "Scripts and automation tools",
    },
    tests: {
      keywords: [
        "test",
        "spec",
        "coverage",
        "unit",
        "e2e",
        "integration",
        "jest",
      ],
      patterns: [/\.test\.js$/, /\.spec\.js$/, /__tests__/, /\/test\//],
      description: "Testing and test coverage",
    },
    docs: {
      keywords: ["documentation", "readme", "guide", "spec", "doc"],
      patterns: [/docs\//, /\.md$/],
      description: "Documentation and guides",
    },
    governance: {
      keywords: [
        "governance",
        "policy",
        "rule",
        "enforcement",
        "template",
        "standard",
      ],
      patterns: [/AGENTS\.md/, /CLAUDE\.md/, /governance/],
      description: "Governance, policy, and standards",
    },
    performance: {
      keywords: [
        "performance",
        "speed",
        "latency",
        "optimization",
        "benchmark",
      ],
      patterns: [/perf\//, /performance/],
      description: "Performance and optimization",
    },
    security: {
      keywords: ["security", "vulnerability", "auth", "encryption", "secure"],
      patterns: [/security\//, /security/],
      description: "Security and vulnerability fixes",
    },
  },

  priority: {
    urgent: {
      keywords: [
        "critical",
        "blocker",
        "production down",
        "urgent",
        "emergency",
        "asap",
      ],
      sla: "4 hours",
    },
    high: {
      keywords: ["high priority", "important", "significant", "blocking"],
      sla: "1 day",
    },
    normal: {
      keywords: ["normal", "standard", "regular"],
      sla: "1 week",
    },
    low: {
      keywords: ["low priority", "nice-to-have", "cosmetic", "future"],
      sla: "no SLA",
    },
  },
};

class LabelingAgent {
  constructor(github, owner, repo) {
    this.github = github;
    this.owner = owner;
    this.repo = repo;
    this.labelCache = null;
  }

  /**
   * Load available labels from repository
   */
  async loadLabels() {
    if (this.labelCache) {
      return this.labelCache;
    }

    try {
      const labels = await this.github.paginate(
        this.github.rest.issues.listLabels,
        {
          owner: this.owner,
          repo: this.repo,
          per_page: 100,
        },
      );
      this.labelCache = labels.map((label) => label.name);
      return this.labelCache;
    } catch (error) {
      console.error(`Failed to load labels: ${error.message}`);
      return [];
    }
  }

  /**
   * Detect type label for issue
   */
  detectType(issue) {
    const results = [];

    for (const [typeKey, typeRule] of Object.entries(LABEL_RULES.type)) {
      const titleMatch = this.matchesKeywords(issue.title, typeRule.keywords);
      const bodyMatch = this.matchesKeywords(
        issue.body || "",
        typeRule.keywords,
      );
      const sectionMatch = (issue.body || "").includes(
        `## ${typeRule.templateSection}`,
      );

      let confidence = 0;
      if (titleMatch && sectionMatch) {
        confidence = typeRule.confidence;
      } else if (titleMatch || (bodyMatch && sectionMatch)) {
        confidence = typeRule.confidence * 0.9;
      } else if (bodyMatch) {
        confidence = typeRule.confidence * 0.7;
      }

      if (confidence > 0) {
        results.push({
          label: `type:${typeKey}`,
          confidence,
          reason: `Detected from keywords and template sections`,
        });
      }
    }

    // Return highest confidence match
    return results.length > 0
      ? results.sort((a, b) => b.confidence - a.confidence)[0]
      : null;
  }

  /**
   * Detect area labels for issue
   */
  detectAreas(issue) {
    const areas = [];
    const titleBody = `${issue.title} ${issue.body || ""}`.toLowerCase();

    for (const [areaKey, areaRule] of Object.entries(LABEL_RULES.area)) {
      let detected = false;

      // Check keywords
      if (this.matchesKeywords(titleBody, areaRule.keywords)) {
        detected = true;
      }

      // Check patterns (if provided)
      if (
        areaRule.patterns &&
        areaRule.patterns.some((pattern) => pattern.test(titleBody))
      ) {
        detected = true;
      }

      if (detected) {
        areas.push({
          label: `area:${areaKey}`,
          confidence: 0.85,
          reason: `Detected from keywords and patterns`,
        });
      }
    }

    return areas;
  }

  /**
   * Detect priority label for issue
   */
  detectPriority(issue) {
    const titleBody = `${issue.title} ${issue.body || ""}`.toLowerCase();

    // Check existing priority labels
    const existingPriority = (issue.labels || []).find((label) =>
      label.name?.startsWith("priority:"),
    );
    if (existingPriority) {
      return null; // Don't override existing priority
    }

    for (const [priorityKey, priorityRule] of Object.entries(
      LABEL_RULES.priority,
    )) {
      if (this.matchesKeywords(titleBody, priorityRule.keywords)) {
        return {
          label: `priority:${priorityKey}`,
          confidence: 0.9,
          reason: `Detected from keywords in title/body`,
        };
      }
    }

    return null;
  }

  /**
   * Assign labels to a single issue
   */
  async assignLabels(issue, options = {}) {
    const { dryRun = true } = options;
    const labelsToAdd = [];

    // Detect type label
    const typeLabel = this.detectType(issue);
    if (typeLabel) {
      labelsToAdd.push(typeLabel);
    }

    // Detect area labels
    const areaLabels = this.detectAreas(issue);
    labelsToAdd.push(...areaLabels);

    // Detect priority label
    const priorityLabel = this.detectPriority(issue);
    if (priorityLabel) {
      labelsToAdd.push(priorityLabel);
    }

    // Apply labels if not dry-run
    if (!dryRun && labelsToAdd.length > 0) {
      try {
        const existingLabels = (issue.labels || []).map((l) => l.name);
        const newLabels = labelsToAdd.map((l) => l.label);
        const allLabels = [...new Set([...existingLabels, ...newLabels])];

        await this.github.rest.issues.update({
          owner: this.owner,
          repo: this.repo,
          issue_number: issue.number,
          labels: allLabels,
        });
      } catch (error) {
        console.error(
          `Failed to update labels for issue #${issue.number}: ${error.message}`,
        );
        return {
          number: issue.number,
          status: "error",
          error: error.message,
          labelsDetected: labelsToAdd,
        };
      }
    }

    return {
      number: issue.number,
      status: dryRun ? "dry-run-preview" : "applied",
      labelsDetected: labelsToAdd,
      alternatives: this.detectType(issue) ? [this.detectType(issue)] : [],
    };
  }

  /**
   * Bulk assign labels to multiple issues
   */
  async bulkAssignLabels(issues, options = {}) {
    const { dryRun = true, batchSize = 50 } = options;
    console.log(
      `[labeling-agent] Starting bulk assignment for ${issues.length} issue(s)...`,
    );

    const results = [];

    for (let i = 0; i < issues.length; i += batchSize) {
      const batch = issues.slice(i, i + batchSize);
      const batchPromises = batch.map((issue) =>
        this.assignLabels(issue, { dryRun }),
      );
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    console.log(
      `[labeling-agent] Completed bulk assignment. ${results.filter((r) => r.status !== "error").length}/${issues.length} succeeded`,
    );

    return results;
  }

  /**
   * Helper: Check if text matches any keywords
   */
  matchesKeywords(text, keywords) {
    const lowerText = text.toLowerCase();
    return keywords.some((keyword) =>
      lowerText.includes(keyword.toLowerCase()),
    );
  }

  /**
   * Generate labeling report
   */
  generateReport(results) {
    const summary = {
      total: results.length,
      succeeded: results.filter((r) => r.status !== "error").length,
      errors: results.filter((r) => r.status === "error").length,
      typeLabelsApplied: results.filter((r) =>
        r.labelsDetected.some((l) => l.label.startsWith("type:")),
      ).length,
      areaLabelsApplied: results.filter((r) =>
        r.labelsDetected.some((l) => l.label.startsWith("area:")),
      ).length,
      priorityLabelsApplied: results.filter((r) =>
        r.labelsDetected.some((l) => l.label.startsWith("priority:")),
      ).length,
    };

    return {
      timestamp: new Date().toISOString(),
      summary,
      results,
    };
  }
}

module.exports = { LabelingAgent };
