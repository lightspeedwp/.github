#!/usr/bin/env node

/**
 * Metrics Report Generator
 *
 * Transforms collected metrics data into formatted Markdown reports
 * with insights, trends, and recommendations.
 *
 * Usage:
 *   node scripts/workflows/metrics/generate-metrics-report.js <metrics-file>
 *   node scripts/workflows/metrics/generate-metrics-report.js <metrics-file> --output /path/to/reports
 */

const fs = require("fs");
const path = require("path");

class MetricsReportGenerator {
  constructor(options = {}) {
    this.outputDir =
      options.outputDir ||
      path.join(__dirname, "../../../.githu./.github/reports/metrics");
    this.verbose = options.verbose || false;
  }

  log(message, level = "info") {
    if (this.verbose || level !== "debug") {
      const prefix = level === "error" ? "❌" : level === "warn" ? "⚠️" : "ℹ️";
      console.log(`${prefix} [${level.toUpperCase()}] ${message}`);
    }
  }

  generateReport(metricsData) {
    try {
      this.validateMetrics(metricsData);

      const report = {
        title: this.generateTitle(metricsData),
        frontmatter: this.generateFrontmatter(metricsData),
        summary: this.generateSummary(metricsData),
        details: this.generateDetails(metricsData),
        insights: this.generateInsights(metricsData),
        recommendations: this.generateRecommendations(metricsData),
      };

      return this.formatReport(report);
    } catch (error) {
      this.log(`Error generating report: ${error.message}`, "error");
      throw error;
    }
  }

  validateMetrics(data) {
    if (!data || typeof data !== "object") {
      throw new Error("Metrics data must be an object");
    }
    if (!data.context) {
      throw new Error("Metrics must have a context property");
    }
    if (!data.metrics) {
      throw new Error("Metrics must have a metrics property");
    }
  }

  generateTitle(metrics) {
    const date = new Date().toISOString().split("T")[0];
    return `Metrics Report — ${metrics.context} (${date})`;
  }

  generateFrontmatter(metrics) {
    return `---
name: Metrics Report
description: Repository health metrics and insights
type: metrics-report
context: ${metrics.context}
period: ${metrics.collection_period || 7} days
generated: ${new Date().toISOString()}
version: '1.0'
---`;
  }

  generateSummary(metrics) {
    const m = metrics.metrics;
    const lines = [
      "## Summary",
      "",
      `**Context:** ${metrics.context}  `,
      `**Collection Period:** ${metrics.collection_period || 7} days  `,
      `**Generated:** ${new Date().toLocaleDateString()}  `,
      "",
      "### Key Metrics",
      "",
    ];

    // Add key metrics based on available data
    if (m.total_issues !== undefined) {
      lines.push(`- **Total Issues:** ${m.total_issues}`);
    }
    if (m.total_prs !== undefined) {
      lines.push(`- **Total Pull Requests:** ${m.total_prs}`);
    }
    if (m.avg_issue_closure_rate !== undefined) {
      lines.push(`- **Issue Closure Rate:** ${m.avg_issue_closure_rate}%`);
    }
    if (m.avg_pr_merge_rate !== undefined) {
      lines.push(`- **PR Merge Rate:** ${m.avg_pr_merge_rate}%`);
    }
    if (m.total_contributors !== undefined) {
      lines.push(`- **Active Contributors:** ${m.total_contributors}`);
    }
    if (metrics.health_score !== undefined) {
      lines.push(`- **Health Score:** ${metrics.health_score}/100`);
    }

    lines.push("");
    return lines.join("\n");
  }

  generateDetails(metrics) {
    const m = metrics.metrics;
    const lines = ["## Detailed Metrics", ""];

    if (Object.keys(m).length === 0) {
      lines.push("*No detailed metrics available*");
      return lines.join("\n");
    }

    lines.push("| Metric | Value |");
    lines.push("|--------|-------|");

    for (const [key, value] of Object.entries(m)) {
      const readable = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      lines.push(`| ${readable} | ${value} |`);
    }

    lines.push("");
    return lines.join("\n");
  }

  generateInsights(metrics) {
    const insights = metrics.insights || [];
    const lines = ["## Insights", ""];

    if (insights.length === 0) {
      lines.push("*No insights available at this time*");
      return lines.join("\n");
    }

    for (const insight of insights) {
      const emoji = this.getSeverityEmoji(insight.severity);
      lines.push(
        `${emoji} **${insight.type.replace(/-/g, " ")} (${insight.severity})**`,
      );
      lines.push(`${insight.message}`);
      lines.push("");
    }

    return lines.join("\n");
  }

  generateRecommendations(metrics) {
    const recommendations = metrics.recommendations || [];
    const lines = ["## Recommendations", ""];

    if (recommendations.length === 0) {
      lines.push("*No recommendations available at this time*");
      return lines.join("\n");
    }

    lines.push("| Priority | Action | Description |");
    lines.push("|----------|--------|-------------|");

    for (const rec of recommendations) {
      lines.push(
        `| ${rec.priority} | ${rec.action.replace(/-/g, " ")} | ${rec.description} |`,
      );
    }

    lines.push("");
    return lines.join("\n");
  }

  getSeverityEmoji(severity) {
    const map = {
      critical: "🔴",
      error: "🔴",
      warning: "🟡",
      info: "🔵",
      success: "🟢",
    };
    return map[severity] || "⚪";
  }

  formatReport(report) {
    return [
      report.frontmatter,
      "",
      `# ${report.title}`,
      "",
      report.summary,
      report.details,
      report.insights,
      report.recommendations,
      "---",
      "",
      "*Report generated by Metrics Agent Phase 2 (Task 2.4)*",
    ].join("\n");
  }

  saveReport(markdown, context) {
    try {
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `metrics-report-${context}-${timestamp}.md`;
      const filepath = path.join(this.outputDir, filename);

      fs.writeFileSync(filepath, markdown, "utf8");
      this.log(`Report saved to: ${filepath}`);

      // Also save "latest" version
      const latestPath = path.join(
        this.outputDir,
        `metrics-report-${context}-latest.md`,
      );
      fs.writeFileSync(latestPath, markdown, "utf8");

      return filepath;
    } catch (error) {
      this.log(`Failed to save report: ${error.message}`, "error");
      throw error;
    }
  }

  async generate(metricsFile, options = {}) {
    try {
      this.log(`Loading metrics from: ${metricsFile}`);

      if (!fs.existsSync(metricsFile)) {
        throw new Error(`Metrics file not found: ${metricsFile}`);
      }

      const metricsJson = fs.readFileSync(metricsFile, "utf8");
      const metricsData = JSON.parse(metricsJson);

      this.log(`Generating report for context: ${metricsData.context}`);

      const markdown = this.generateReport(metricsData);
      const filepath = this.saveReport(markdown, metricsData.context);

      if (process.env.GITHUB_OUTPUT) {
        fs.appendFileSync(
          process.env.GITHUB_OUTPUT,
          `report_file=${filepath}\n`,
        );
        fs.appendFileSync(
          process.env.GITHUB_OUTPUT,
          `context=${metricsData.context}\n`,
        );
      }

      this.log("✓ Report generated successfully");
      return { filepath, markdown, context: metricsData.context };
    } catch (error) {
      this.log(`Fatal error: ${error.message}`, "error");
      process.exit(1);
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help")) {
    console.log(`
Usage: node scripts/workflows/metrics/generate-metrics-report.js <metrics-file> [options]

Arguments:
  metrics-file      Path to metrics JSON file (required)

Options:
  --output PATH     Output directory (default: .githu./.github/reports/metrics)
  --verbose         Verbose output
  --help            Show this help message

Examples:
  node scripts/workflows/metrics/generate-metrics-report.js .githu./.github/reports/metrics/collection-2026-08-18.json
  node scripts/workflows/metrics/generate-metrics-report.js metrics.json --output /tmp/reports --verbose
    `);
    process.exit(args.includes("--help") ? 0 : 1);
  }

  const metricsFile = args[0];
  const options = {
    outputDir: undefined,
    verbose: false,
  };

  for (let i = 1; i < args.length; i++) {
    if (args[i] === "--output") {
      options.outputDir = args[++i];
    } else if (args[i] === "--verbose") {
      options.verbose = true;
    }
  }

  const generator = new MetricsReportGenerator(options);
  await generator.generate(metricsFile);
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

module.exports = MetricsReportGenerator;
