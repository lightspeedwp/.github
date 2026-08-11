#!/usr/bin/env node

/**
 * Review Status Labels Script
 * Audit status:needs-review and status:needs-triage labels for age and blockers
 * @module scripts/automation/review-status-labels.js
 */

import { LabelManager } from "./includes/label-management.js";
import { ReportGenerator } from "./includes/report-generator.js";
import { ActivityAnalyzer } from "./includes/activity-analyzer.js";
import path from "path";
import { fileURLToPath } from "url";

const STATUS_LABELS = ["status:needs-review", "status:needs-triage"];

/**
 * Categorize issue age by days in status
 */
function categorizeAge(daysSinceUpdate) {
  if (daysSinceUpdate <= 3) return "fresh";
  if (daysSinceUpdate <= 7) return "pending";
  return "overdue";
}

/**
 * Extract blocker issue numbers from issue body/comments
 */
function extractBlockers(issue) {
  const blockers = new Set();

  if (issue.body) {
    // Match any issue reference in context of blocker keywords
    const blockerPattern = /#(\d+)/g;

    // Check if the body mentions any blocker keywords
    if (/(blocks?|blocking|duplicate\s+of|and\s+#)/i.test(issue.body)) {
      let match;
      blockerPattern.lastIndex = 0;
      while ((match = blockerPattern.exec(issue.body))) {
        blockers.add(parseInt(match[1]));
      }
    }
  }

  return Array.from(blockers);
}

/**
 * Check if issue has a PR linked
 */
function hasPRLinked(issue) {
  const labels = issue.labels?.map((l) => l.name) || [];
  return labels.includes("meta:has-pr");
}

/**
 * Check if issue is assigned
 */
function isAssigned(issue) {
  return (
    issue.assignee !== null || (issue.assignees && issue.assignees.length > 0)
  );
}

/**
 * Analyze an issue for status label audit
 */
function analyzeStatusIssue(issue, activityAnalyzer) {
  const labels = issue.labels?.map((l) => l.name) || [];
  const statusLabels = labels.filter((l) => l.startsWith("status:"));
  const daysSinceUpdate = activityAnalyzer.getDaysSinceActivity(issue);
  const ageCategory = categorizeAge(daysSinceUpdate);

  return {
    number: issue.number,
    title: issue.title,
    statusLabels,
    daysSinceUpdate,
    ageCategory,
    isAssigned: isAssigned(issue),
    hasPR: hasPRLinked(issue),
    blockers: extractBlockers(issue),
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
  };
}

/**
 * Generate recommendations for analyzed issues
 */
function generateRecommendations(analysis) {
  const recommendations = [];
  const blockerIssueMap = new Map();

  // Build blocker map
  analysis.issues.forEach((issue) => {
    issue.blockers.forEach((blocker) => {
      if (!blockerIssueMap.has(blocker)) {
        blockerIssueMap.set(blocker, []);
      }
      blockerIssueMap.get(blocker).push(issue.number);
    });
  });

  // Find issues that need attention
  analysis.issues.forEach((issue) => {
    // Overdue unassigned issues
    if (issue.ageCategory === "overdue" && !issue.isAssigned) {
      recommendations.push({
        issue: issue.number,
        severity: "high",
        type: "unassigned-overdue",
        message: `Issue #${issue.number} has been in ${issue.statusLabels[0]} for ${issue.daysSinceUpdate} days and is unassigned`,
        action: "Assign or close",
      });
    }

    // Overdue without PR
    if (
      issue.ageCategory === "overdue" &&
      !issue.hasPR &&
      issue.statusLabels.includes("status:needs-review")
    ) {
      recommendations.push({
        issue: issue.number,
        severity: "medium",
        type: "needs-pr",
        message: `Issue #${issue.number} in needs-review for ${issue.daysSinceUpdate} days with no linked PR`,
        action: "Link PR or update status",
      });
    }

    // Blocking other issues
    if (issue.blockers.length === 0 && blockerIssueMap.has(issue.number)) {
      const blockedCount = blockerIssueMap.get(issue.number).length;
      recommendations.push({
        issue: issue.number,
        severity: "high",
        type: "blocking-issues",
        message: `Issue #${issue.number} is blocking ${blockedCount} other issue(s)`,
        action: "Prioritize resolution",
      });
    }

    // Pending issues approaching overdue
    if (issue.ageCategory === "pending" && issue.daysSinceUpdate > 6) {
      recommendations.push({
        issue: issue.number,
        severity: "low",
        type: "approaching-overdue",
        message: `Issue #${issue.number} approaching overdue (${issue.daysSinceUpdate} days)`,
        action: "Review progress",
      });
    }
  });

  return recommendations;
}

/**
 * Main audit function
 */
async function auditStatusLabels(options = {}) {
  const {
    verbose = false,
    dryRun = false,
    format = "json",
    output = null,
    label = null,
  } = options;

  const startTime = Date.now();

  try {
    const manager = new LabelManager({ verbose });
    const reporter = new ReportGenerator({ verbose });
    const analyzer = new ActivityAnalyzer({ verbose });

    if (verbose) {
      console.log("Starting status labels audit...");
      if (dryRun) console.log("DRY RUN MODE - no changes will be applied");
      console.log(`Fetching issues with status labels...`);
    }

    // Fetch issues with each status label
    const allIssues = new Map();
    const issuesByLabel = {};

    for (const statusLabel of STATUS_LABELS) {
      if (verbose) console.log(`Fetching issues with ${statusLabel}...`);

      const issues = await manager.fetchIssuesWithLabel(statusLabel, {
        limit: 500,
      });
      issuesByLabel[statusLabel] = issues.length;

      issues.forEach((issue) => {
        if (!allIssues.has(issue.number)) {
          allIssues.set(issue.number, issue);
        }
      });
    }

    if (verbose) {
      console.log(`Total issues with status labels: ${allIssues.size}`);
      console.log("Analyzing issues...");
    }

    // Analyze each issue
    const analyzedIssues = [];
    const ageDistribution = {
      fresh: 0,
      pending: 0,
      overdue: 0,
    };

    const assignmentStats = {
      assigned: 0,
      unassigned: 0,
    };

    const blockerStats = {
      hasBlockers: 0,
      blockedBy: 0,
      blocking: 0,
    };

    allIssues.forEach((issue) => {
      const analysis = analyzeStatusIssue(issue, analyzer);
      analyzedIssues.push(analysis);

      // Update distributions
      ageDistribution[analysis.ageCategory]++;

      if (analysis.isAssigned) {
        assignmentStats.assigned++;
      } else {
        assignmentStats.unassigned++;
      }

      // If issue references blockers, it is blocking those issues
      if (analysis.blockers.length > 0) {
        blockerStats.blocking++;
      }
    });

    // Find issues that are blocked by others
    const blockedByIssues = new Set();
    analyzedIssues.forEach((issue) => {
      issue.blockers.forEach((b) => {
        blockedByIssues.add(b);
      });
    });

    blockerStats.blockedBy = blockedByIssues.size;

    // Sort by age (oldest first)
    const sortedByAge = [...analyzedIssues].sort(
      (a, b) => b.daysSinceUpdate - a.daysSinceUpdate,
    );

    // Get oldest issues in each status
    const oldestByStatus = {};
    STATUS_LABELS.forEach((label) => {
      const issuesWithLabel = analyzedIssues.filter((i) =>
        i.statusLabels.includes(label),
      );
      issuesWithLabel.sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate);
      oldestByStatus[label] = issuesWithLabel.slice(0, 5);
    });

    // Generate recommendations
    const recommendations = generateRecommendations({
      issues: analyzedIssues,
    });

    // Sort recommendations by severity
    recommendations.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

    // Build report
    const report = {
      audit_date: new Date().toISOString(),
      total_issues: allIssues.size,
      issues_by_label: issuesByLabel,
      age_distribution: ageDistribution,
      assignment_stats: assignmentStats,
      blocker_stats: blockerStats,
      oldest_issues: sortedByAge.slice(0, 10),
      oldest_by_status: oldestByStatus,
      recommendations: recommendations.slice(0, 50),
      all_issues: analyzedIssues,
      summary: {
        total_recommendations: recommendations.length,
        critical_unassigned_overdue: recommendations.filter(
          (r) => r.severity === "high" && r.type === "unassigned-overdue",
        ).length,
        blocking_issues: recommendations.filter(
          (r) => r.type === "blocking-issues",
        ).length,
        action_items: recommendations.filter((r) => r.severity !== "low")
          .length,
      },
    };

    // Filter by specific label if requested
    if (label && !STATUS_LABELS.includes(label)) {
      return {
        success: false,
        error: `Label not found: ${label}. Available labels: ${STATUS_LABELS.join(", ")}`,
        duration: Date.now() - startTime,
      };
    }

    if (label) {
      const filtered = {
        ...report,
        issues_by_label: {
          [label]: report.issues_by_label[label],
        },
        oldest_by_status: {
          [label]: report.oldest_by_status[label],
        },
        all_issues: analyzedIssues.filter((i) =>
          i.statusLabels.includes(label),
        ),
      };
      return {
        success: true,
        report: filtered,
        duration: Date.now() - startTime,
        dryRun,
      };
    }

    // Export if output path provided
    if (output) {
      const ext =
        format === "json"
          ? ".json"
          : format === "markdown"
            ? ".md"
            : `.${format}`;
      const outputPath = output.endsWith(ext) ? output : `${output}${ext}`;

      // For CSV, use simplified data
      if (format === "csv") {
        reporter.exportToFile(format, analyzedIssues, outputPath);
      } else {
        reporter.exportToFile(format, report, outputPath);
      }

      if (verbose) {
        console.log(`Report saved to: ${outputPath}`);
      }
    }

    if (verbose) {
      console.log(`Audit completed in ${Date.now() - startTime}ms`);
    }

    return {
      success: true,
      report,
      duration: Date.now() - startTime,
      dryRun,
    };
  } catch (error) {
    console.error(`Audit failed: ${error.message}`);
    return {
      success: false,
      error: error.message,
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const SUPPORTED_FORMATS = ["json", "csv", "markdown", "md"];
  const options = {
    verbose: args.includes("-v") || args.includes("--verbose"),
    dryRun: args.includes("--dry-run"),
    format: "json",
    output: null,
    label: null,
  };

  // Parse and validate format
  const formatIdx = args.findIndex((a) => a === "--format");
  if (formatIdx > -1) {
    const value = args[formatIdx + 1];
    if (!value || value.startsWith("--")) {
      throw new Error("Missing value for --format");
    }
    if (!SUPPORTED_FORMATS.includes(value)) {
      throw new Error(
        `Unsupported format: ${value}. Supported: ${SUPPORTED_FORMATS.join(", ")}`,
      );
    }
    options.format = value;
  }

  // Parse and validate output
  const outputIdx = args.findIndex((a) => a === "--output");
  if (outputIdx > -1) {
    const value = args[outputIdx + 1];
    if (!value || value.startsWith("--")) {
      throw new Error("Missing value for --output");
    }
    options.output = value;
  }

  // Parse and validate label
  const labelIdx = args.findIndex((a) => a === "--label");
  if (labelIdx > -1) {
    const value = args[labelIdx + 1];
    if (!value || value.startsWith("--")) {
      throw new Error("Missing value for --label");
    }
    options.label = value;
  }

  return options;
}

/**
 * Main entry point
 */
async function main() {
  const options = parseArgs();

  if (options.verbose) {
    console.log("Status Labels Audit Script");
    console.log(`Mode: ${options.dryRun ? "dry-run" : "audit"}`);
    console.log(`Format: ${options.format}`);
    if (options.output) console.log(`Output: ${options.output}`);
    if (options.label) console.log(`Filter: ${options.label}`);
    console.log("");
  }

  const result = await auditStatusLabels(options);

  if (result.success) {
    // Print summary
    console.log("\n=== Status Labels Audit Summary ===\n");
    console.log(`Total Issues Analyzed: ${result.report.total_issues}`);
    console.log(`Status Labels Found:`);
    Object.entries(result.report.issues_by_label).forEach(([label, count]) => {
      console.log(`  ${label}: ${count} issues`);
    });

    console.log(`\nAge Distribution:`);
    console.log(`  Fresh (0-3 days): ${result.report.age_distribution.fresh}`);
    console.log(
      `  Pending (4-7 days): ${result.report.age_distribution.pending}`,
    );
    console.log(
      `  Overdue (7+ days): ${result.report.age_distribution.overdue}`,
    );

    console.log(`\nAssignment Status:`);
    console.log(`  Assigned: ${result.report.assignment_stats.assigned}`);
    console.log(`  Unassigned: ${result.report.assignment_stats.unassigned}`);

    console.log(`\nBlocker Relationships:`);
    console.log(
      `  Issues blocked by others: ${result.report.blocker_stats.blockedBy}`,
    );
    console.log(
      `  Issues blocking others: ${result.report.blocker_stats.blocking}`,
    );

    console.log(
      `\nRecommendations: ${result.report.summary.total_recommendations}`,
    );
    console.log(
      `  Critical: ${result.report.summary.critical_unassigned_overdue}`,
    );
    console.log(`  Blocking: ${result.report.summary.blocking_issues}`);

    if (result.report.oldest_issues.length > 0) {
      console.log(`\nOldest Issues:`);
      result.report.oldest_issues.slice(0, 5).forEach((issue) => {
        console.log(
          `  #${issue.number} (${issue.daysSinceUpdate}d): ${issue.title.substring(0, 60)}`,
        );
      });
    }

    console.log(`\nDuration: ${result.duration}ms\n`);

    if (!options.output) {
      console.log("JSON Output:");
      console.log(JSON.stringify(result.report, null, 2));
    }
  } else {
    console.error(`\nAudit Failed: ${result.error}`);
    console.error(`Duration: ${result.duration}ms\n`);
    process.exit(1);
  }
}

// Run if called directly
if (
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1])
) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}

export {
  auditStatusLabels,
  analyzeStatusIssue,
  categorizeAge,
  extractBlockers,
  generateRecommendations,
};
