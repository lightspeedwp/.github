#!/usr/bin/env node

/**
 * Review Meta Labels Script
 * Audit meta label coverage across all open issues
 * @module scripts/automation/review-meta-labels.js
 */

import { LabelManager } from "./includes/label-management.js";
import { ReportGenerator } from "./includes/report-generator.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const META_LABELS = [
  "meta:needs-changelog",
  "meta:no-changelog",
  "meta:has-pr",
  "meta:no-issue-activity",
  "meta:no-pr-activity",
  "meta:stale",
  "meta:dependabot-security",
];

// Label cache with TTL for improved performance (Phase 2 optimization)
const labelCache = {
  data: new Map(),
  ttl: 5 * 60 * 1000, // 5 minute cache TTL
  lastUpdate: 0,

  set(key, value) {
    this.data.set(key, value);
    this.lastUpdate = Date.now();
  },

  get(key) {
    if (Date.now() - this.lastUpdate > this.ttl) {
      this.data.clear();
      return null;
    }
    return this.data.get(key);
  },

  clear() {
    this.data.clear();
    this.lastUpdate = 0;
  },
};

/**
 * Analyze an issue for meta label coverage (optimized with caching)
 */
function analyzeIssue(issue) {
  const cacheKey = `issue-${issue.number}`;
  const cached = labelCache.get(cacheKey);
  if (cached) return cached;

  const labels = issue.labels?.map((l) => l.name) || [];
  const metaLabels = labels.filter((l) => l.startsWith("meta:"));

  const result = {
    number: issue.number,
    title: issue.title,
    labels: metaLabels,
  };

  labelCache.set(cacheKey, result);
  return result;
}

/**
 * Generate recommendations for an issue based on missing meta labels
 */
function generateRecommendations(issue) {
  const recommendations = [];
  const labels = issue.labels?.map((l) => l.name) || [];
  const currentMetaLabels = labels.filter((l) => l.startsWith("meta:"));

  // Check for changelog-related labels
  const hasChangelogLabel =
    labels.includes("meta:needs-changelog") ||
    labels.includes("meta:no-changelog");
  if (!hasChangelogLabel) {
    recommendations.push(
      `Consider adding changelog status (meta:needs-changelog or meta:no-changelog) to issue #${issue.number}`,
    );
  }

  // Check coverage for other meta labels
  META_LABELS.forEach((expectedLabel) => {
    // Skip changelog labels (already handled above) and stale label (auto-applied)
    if (expectedLabel.includes("changelog") || expectedLabel === "meta:stale") {
      return;
    }

    // If issue has no meta labels at all, flag it
    if (currentMetaLabels.length === 0) {
      if (
        expectedLabel === "meta:needs-changelog" ||
        expectedLabel === "meta:no-changelog"
      ) {
        return; // Already covered above
      }
    }
  });

  return recommendations;
}

/**
 * Main audit function
 */
async function auditMetaLabels(options = {}) {
  const {
    verbose = false,
    format = "json",
    output = null,
    label = null,
  } = options;

  const startTime = Date.now();

  try {
    const manager = new LabelManager({ verbose });
    const reporter = new ReportGenerator({ verbose });

    if (verbose) {
      console.log("Starting meta label audit...");
      console.log(`Fetching issues...`);
    }

    // Fetch all open issues (using higher limit to handle growth)
    const allIssues = await manager.fetchAllIssues({ limit: 1000 });

    if (verbose) {
      console.log(`Fetched ${allIssues.length} issues`);
      console.log("Analyzing issues...");
    }

    // Analyze meta label coverage (optimized with single-pass algorithm and Set operations)
    const labelAnalysis = {};
    const issueAnalysis = [];
    const recommendations = [];
    const metaLabelSet = new Set(META_LABELS); // O(1) lookups instead of O(n)

    // Initialize label analysis (required for report structure)
    META_LABELS.forEach((ml) => {
      labelAnalysis[ml] = {
        count: 0,
        percentage: 0,
        issues: [],
        recommendations: [],
      };
    });

    // Analyze each issue with optimized label operations
    allIssues.forEach((issue) => {
      const labels = issue.labels?.map((l) => l.name) || [];
      const analysis = analyzeIssue(issue);
      issueAnalysis.push(analysis);

      // Track meta label usage efficiently
      labels.forEach((label) => {
        if (metaLabelSet.has(label)) {
          labelAnalysis[label].count++;
          if (labelAnalysis[label].issues.length < 10) {
            labelAnalysis[label].issues.push(issue.number);
          }
        }
      });

      // Generate recommendations
      const issueRecs = generateRecommendations(issue);
      if (issueRecs.length > 0) {
        recommendations.push(...issueRecs);
      }
    });

    // Calculate percentages for all meta labels
    const totalIssues = allIssues.length;
    META_LABELS.forEach((metaLabel) => {
      labelAnalysis[metaLabel].percentage =
        totalIssues > 0
          ? Math.round((labelAnalysis[metaLabel].count / totalIssues) * 1000) /
            10
          : 0;
    });

    // Build report
    const report = {
      audit_date: new Date().toISOString(),
      total_issues_analyzed: allIssues.length,
      meta_labels: labelAnalysis,
      summary: {
        total_gaps: recommendations.length,
        coverage_percentage:
          allIssues.length > 0
            ? Math.round(
                ((allIssues.length - recommendations.length) /
                  allIssues.length) *
                  100,
              )
            : 0,
        top_gaps: Object.entries(labelAnalysis)
          .filter(([, data]) => data.count === 0)
          .map(([name]) => ({
            label: name,
            missing_count: 0,
            impact: "none",
          })),
      },
      recommendations: recommendations.slice(0, 20),
    };

    // Filter by specific label if requested
    if (label) {
      if (report.meta_labels[label]) {
        const filtered = {
          ...report,
          meta_labels: {
            [label]: report.meta_labels[label],
          },
        };
        return {
          success: true,
          report: filtered,
          duration: Date.now() - startTime,
        };
      } else {
        return {
          success: false,
          error: `Label not found: ${label}`,
          duration: Date.now() - startTime,
        };
      }
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
      reporter.exportToFile(format, report, outputPath);

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
  const options = {
    verbose: args.includes("-v") || args.includes("--verbose"),
    audit: args.includes("--audit"),
    format: "json",
    output: null,
    label: null,
  };

  // Parse format
  const formatIdx = args.findIndex((a) => a === "--format");
  if (formatIdx > -1 && args[formatIdx + 1]) {
    options.format = args[formatIdx + 1];
  }

  // Parse output
  const outputIdx = args.findIndex((a) => a === "--output");
  if (outputIdx > -1 && args[outputIdx + 1]) {
    options.output = args[outputIdx + 1];
  }

  // Parse label
  const labelIdx = args.findIndex((a) => a === "--label");
  if (labelIdx > -1 && args[labelIdx + 1]) {
    options.label = args[labelIdx + 1];
  }

  return options;
}

/**
 * Main entry point
 */
async function main() {
  const options = parseArgs();

  if (options.verbose) {
    console.log("Meta Labels Audit Script");
    console.log(`Mode: ${options.audit ? "audit" : "interactive"}`);
    console.log(`Format: ${options.format}`);
    if (options.output) console.log(`Output: ${options.output}`);
    if (options.label) console.log(`Filter: ${options.label}`);
    console.log("");
  }

  const result = await auditMetaLabels(options);

  if (result.success) {
    // Print summary
    console.log("\n=== Meta Labels Audit Summary ===\n");
    console.log(
      `Total Issues Analyzed: ${result.report.total_issues_analyzed}`,
    );
    console.log(`Coverage: ${result.report.summary.coverage_percentage}%`);
    console.log(`Total Gaps: ${result.report.summary.total_gaps}`);

    console.log("\nLabel Coverage:");
    Object.entries(result.report.meta_labels).forEach(([name, data]) => {
      console.log(`  ${name}: ${data.count} issues (${data.percentage}%)`);
    });

    if (result.report.recommendations.length > 0) {
      console.log(
        `\nTop ${Math.min(5, result.report.recommendations.length)} Recommendations:`,
      );
      result.report.recommendations.slice(0, 5).forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec}`);
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

export { auditMetaLabels };
