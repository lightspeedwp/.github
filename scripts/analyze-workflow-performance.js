#!/usr/bin/env node
/**
 * Workflow performance analysis tool.
 * Identifies optimization opportunities for concurrency, caching, and fetch-depth.
 * Related to: Issue #2799 - Optimize workflow performance
 * @see .github/projects/active/phase-2-label-remediation-security-hardening-2026-09-04/
 */

import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";

// ============================================================================
// ANALYSIS CONFIGURATION
// ============================================================================

const ANALYSIS_CONFIG = {
  workflowsDir: ".github/workflows",
  reportDir: ".github/reports/performance-analysis",
  optimizations: {
    concurrency: {
      description: "Add concurrency control to prevent overlapping runs",
      impact: "Reduces duplicate work and resource usage",
      effort: "Low - Add 3-4 lines per workflow",
      currentlyMissing: 0,
    },
    caching: {
      description: "Add dependency caching (npm/pip/gems)",
      impact: "Reduces install time by 50-80%",
      effort: "Low - Add 5-7 lines per workflow",
      currentlyMissing: 0,
    },
    fetchDepth: {
      description: "Use fetch-depth to minimize checkout",
      impact: "Reduces checkout time by 30-50%",
      effort: "Low - Modify checkout step",
      currentlyMissing: 0,
    },
  },
};

// ============================================================================
// ANALYSIS CLASS
// ============================================================================

class WorkflowPerformanceAnalysis {
  constructor() {
    this.workflows = [];
    this.analysis = {
      total: 0,
      byOptimization: {
        needsConcurrency: [],
        needsCaching: [],
        needsFetchDepth: [],
      },
      opportunitiesByWorkflow: {},
      totalTimeToSave: 0,
      totalEstimatedTimeMinutes: 0,
    };
    this.timestamp = new Date().toISOString();
  }

  /**
   * Load all workflow files
   */
  loadWorkflows() {
    const workflowPath = path.join(process.cwd(), ANALYSIS_CONFIG.workflowsDir);
    const files = fs
      .readdirSync(workflowPath)
      .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"));

    this.workflows = files.map((file) => ({
      filename: file,
      path: path.join(workflowPath, file),
      content: fs.readFileSync(path.join(workflowPath, file), "utf-8"),
    }));

    console.log(`📋 Loaded ${this.workflows.length} workflows for analysis`);
    return this.workflows;
  }

  /**
   * Analyze a single workflow for performance opportunities
   */
  analyzeWorkflow(workflow) {
    try {
      const parsed = yaml.load(workflow.content);
      const result = {
        filename: workflow.filename,
        opportunities: [],
        currentOptimizations: {
          hasConcurrency: !!parsed.concurrency,
          hasCaching: false,
          hasFetchDepth: false,
        },
        estimatedTimeSaveSeconds: 0,
      };

      if (!parsed.jobs) {
        return result;
      }

      // Check for concurrency
      if (!parsed.concurrency) {
        result.opportunities.push("concurrency");
        result.estimatedTimeSaveSeconds += 15; // Prevents re-runs
      }

      // Check each job for caching and fetch-depth
      let jobsNeedCaching = 0;
      let jobsNeedFetchDepth = 0;

      for (const [jobName, job] of Object.entries(parsed.jobs)) {
        if (!job.steps) continue;

        let jobNeedsCaching = false;
        let jobHasFetchDepth = false;

        for (const step of job.steps) {
          // Check for cache usage
          if (step.uses && step.uses.includes("cache")) {
            result.currentOptimizations.hasCaching = true;
            jobNeedsCaching = false;
          }

          // Check for npm/pip/gem install patterns
          if (
            step.run &&
            (step.run.includes("npm install") ||
              step.run.includes("npm ci") ||
              step.run.includes("pip install") ||
              step.run.includes("bundle install") ||
              step.run.includes("yarn install"))
          ) {
            jobNeedsCaching = true;
          }

          // Check for checkout step
          if (
            step.uses &&
            step.uses.includes("actions/checkout") &&
            (!step.with || !step.with["fetch-depth"])
          ) {
            jobHasFetchDepth = false;
          }

          if (
            step.uses &&
            step.uses.includes("actions/checkout") &&
            step.with &&
            step.with["fetch-depth"]
          ) {
            result.currentOptimizations.hasFetchDepth = true;
            jobHasFetchDepth = true;
          }
        }

        if (jobNeedsCaching) {
          jobsNeedCaching++;
        }
        if (
          !jobHasFetchDepth &&
          job.steps.some((s) => s.uses && s.uses.includes("checkout"))
        ) {
          jobsNeedFetchDepth++;
        }
      }

      // Add optimization opportunities
      if (jobsNeedCaching > 0) {
        result.opportunities.push("caching");
        result.estimatedTimeSaveSeconds += jobsNeedCaching * 30; // 30sec per cached dependency
      }

      if (jobsNeedFetchDepth > 0) {
        result.opportunities.push("fetchDepth");
        result.estimatedTimeSaveSeconds += jobsNeedFetchDepth * 20; // 20sec per fetch-depth
      }

      return result;
    } catch (error) {
      console.error(`Error analyzing ${workflow.filename}:`, error.message);
      return {
        filename: workflow.filename,
        opportunities: [],
        error: error.message,
      };
    }
  }

  /**
   * Run complete analysis
   */
  runAnalysis() {
    console.log("\n🔍 Starting workflow performance analysis...\n");

    this.workflows.forEach((workflow) => {
      const result = this.analyzeWorkflow(workflow);

      this.analysis.opportunitiesByWorkflow[workflow.filename] = result;

      result.opportunities.forEach((opp) => {
        switch (opp) {
          case "concurrency":
            this.analysis.byOptimization.needsConcurrency.push(
              workflow.filename,
            );
            break;
          case "caching":
            this.analysis.byOptimization.needsCaching.push(workflow.filename);
            break;
          case "fetchDepth":
            this.analysis.byOptimization.needsFetchDepth.push(
              workflow.filename,
            );
            break;
        }
      });

      this.analysis.totalTimeToSave += result.estimatedTimeSaveSeconds;
    });

    this.analysis.total = this.workflows.length;
    this.analysis.totalEstimatedTimeMinutes = Math.round(
      this.analysis.totalTimeToSave / 60,
    );

    return this.analysis;
  }

  /**
   * Generate detailed report
   */
  generateReport() {
    const report = [];

    report.push("# Workflow Performance Analysis Report");
    report.push("");
    report.push(`**Analysis Date**: ${this.timestamp}`);
    report.push(
      `**Scope**: All ${this.analysis.total} GitHub Actions workflows`,
    );
    report.push("");

    // Summary
    report.push("## Summary");
    report.push("");
    report.push(`- **Total Workflows Analyzed**: ${this.analysis.total}`);
    report.push(
      `- **Workflows Needing Concurrency**: ${this.analysis.byOptimization.needsConcurrency.length}`,
    );
    report.push(
      `- **Workflows Needing Caching**: ${this.analysis.byOptimization.needsCaching.length}`,
    );
    report.push(
      `- **Workflows Needing Fetch-Depth**: ${this.analysis.byOptimization.needsFetchDepth.length}`,
    );
    report.push(
      `- **Estimated Total Time Savings**: ${this.analysis.totalEstimatedTimeMinutes} minutes per month`,
    );
    report.push("");

    // Optimization opportunities by type
    report.push("## Optimization Opportunities");
    report.push("");

    report.push("### 1. Concurrency Control");
    report.push("");
    report.push(
      `**Impact**: Prevents overlapping workflow runs, reduces duplicate work`,
    );
    report.push(
      `**Workflows Needing This**: ${this.analysis.byOptimization.needsConcurrency.length}/${this.analysis.total}`,
    );
    report.push("");

    if (this.analysis.byOptimization.needsConcurrency.length > 0) {
      report.push("**Workflows to Update**:");
      this.analysis.byOptimization.needsConcurrency.forEach((w) => {
        report.push(`- ${w}`);
      });
      report.push("");
    }

    report.push("**Example Implementation**:");
    report.push("");
    report.push("```yaml");
    report.push("concurrency:");
    report.push("  group: ${{ github.workflow }}-${{ github.ref }}");
    report.push("  cancel-in-progress: true");
    report.push("```");
    report.push("");

    report.push("### 2. Dependency Caching");
    report.push("");
    report.push(
      `**Impact**: Reduces npm/pip install time by 50-80% on cache hits`,
    );
    report.push(
      `**Workflows Needing This**: ${this.analysis.byOptimization.needsCaching.length}/${this.analysis.total}`,
    );
    report.push("");

    if (this.analysis.byOptimization.needsCaching.length > 0) {
      report.push("**Workflows to Update**:");
      this.analysis.byOptimization.needsCaching.forEach((w) => {
        report.push(`- ${w}`);
      });
      report.push("");
    }

    report.push("**Example Implementation (npm)**:");
    report.push("");
    report.push("```yaml");
    report.push("- name: Cache npm dependencies");
    report.push("  uses: actions/cache@v4");
    report.push("  with:");
    report.push("    path: ~/.npm");
    report.push(
      "    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}",
    );
    report.push("    restore-keys: |");
    report.push("      ${{ runner.os }}-npm-");
    report.push("```");
    report.push("");

    report.push("### 3. Fetch Depth Optimization");
    report.push("");
    report.push(
      `**Impact**: Reduces checkout time by 30-50% for shallow clones`,
    );
    report.push(
      `**Workflows Needing This**: ${this.analysis.byOptimization.needsFetchDepth.length}/${this.analysis.total}`,
    );
    report.push("");

    if (this.analysis.byOptimization.needsFetchDepth.length > 0) {
      report.push("**Workflows to Update**:");
      this.analysis.byOptimization.needsFetchDepth.forEach((w) => {
        report.push(`- ${w}`);
      });
      report.push("");
    }

    report.push("**Example Implementation**:");
    report.push("");
    report.push("```yaml");
    report.push("- uses: actions/checkout@v4");
    report.push("  with:");
    report.push("    fetch-depth: 1");
    report.push("```");
    report.push("");

    // Recommendations
    report.push("## Recommendations");
    report.push("");
    report.push(
      "1. **Phase 1 (Week 1)**: Add concurrency control to all workflows",
    );
    report.push("");
    report.push(
      "2. **Phase 2 (Week 2)**: Add dependency caching to workflows with package managers",
    );
    report.push("");
    report.push(
      "3. **Phase 3 (Week 3)**: Add fetch-depth optimization to all checkout steps",
    );
    report.push("");

    // Validation
    report.push("## Validation");
    report.push("");
    report.push(
      "After applying optimizations, run the validator to ensure compliance:",
    );
    report.push("");
    report.push("```bash");
    report.push("npm run validate:workflows");
    report.push("```");
    report.push("");
    report.push("Expected improvements:");
    report.push("- Warnings reduced from 174 to <50");
    report.push("- CI/CD execution time reduced by ~30-50%");
    report.push("- No functional regressions");
    report.push("");

    // Related documentation
    report.push("## Related Documentation");
    report.push("");
    report.push(
      "- Issue #2799: [Optimize workflow performance](https://github.com/lightspeedwp/.github/issues/2799)",
    );
    report.push("");
    report.push(
      "- Project: [Phase 2 Label Remediation - Workflow Security Hardening](./.github/projects/active/phase-2-label-remediation-security-hardening-2026-09-04/)",
    );
    report.push("");
    report.push(
      "- Implementation Plan: [03-IMPLEMENTATION-PLAN.md](./.github/projects/active/phase-2-label-remediation-security-hardening-2026-09-04/03-IMPLEMENTATION-PLAN.md#2-performance-optimizations)",
    );
    report.push("");

    return report.join("\n");
  }

  /**
   * Generate JSON report
   */
  generateJsonReport() {
    return {
      timestamp: this.timestamp,
      summary: {
        totalWorkflows: this.analysis.total,
        needsConcurrency: this.analysis.byOptimization.needsConcurrency.length,
        needsCaching: this.analysis.byOptimization.needsCaching.length,
        needsFetchDepth: this.analysis.byOptimization.needsFetchDepth.length,
        estimatedTimeSaveMinutes: this.analysis.totalEstimatedTimeMinutes,
      },
      optimizations: this.analysis.byOptimization,
      details: this.analysis.opportunitiesByWorkflow,
    };
  }

  /**
   * Save reports
   */
  saveReports() {
    const reportDir = ANALYSIS_CONFIG.reportDir;

    // Create report directory if it doesn't exist
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    // Save markdown report
    const markdownReport = this.generateReport();
    const markdownPath = path.join(
      reportDir,
      `performance-analysis-${new Date().toISOString().split("T")[0]}.md`,
    );
    fs.writeFileSync(markdownPath, markdownReport);

    // Save JSON report
    const jsonReport = this.generateJsonReport();
    const jsonPath = path.join(reportDir, "performance-analysis-latest.json");
    fs.writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2));

    console.log(`\n📄 Reports saved:`);
    console.log(`  - Markdown: ${markdownPath}`);
    console.log(`  - JSON: ${jsonPath}`);

    return {
      markdown: markdownPath,
      json: jsonPath,
    };
  }

  /**
   * Print summary
   */
  printSummary() {
    console.log("\n" + "=".repeat(80));
    console.log("📊 WORKFLOW PERFORMANCE ANALYSIS SUMMARY");
    console.log("=".repeat(80));
    console.log("");
    console.log(`Total Workflows: ${this.analysis.total}`);
    console.log(
      `Workflows Needing Concurrency: ${this.analysis.byOptimization.needsConcurrency.length}`,
    );
    console.log(
      `Workflows Needing Caching: ${this.analysis.byOptimization.needsCaching.length}`,
    );
    console.log(
      `Workflows Needing Fetch-Depth: ${this.analysis.byOptimization.needsFetchDepth.length}`,
    );
    console.log("");
    console.log(
      `Estimated Time Savings: ${this.analysis.totalEstimatedTimeMinutes} minutes/month`,
    );
    console.log("=".repeat(80) + "\n");
  }
}

// ============================================================================
// MAIN
// ============================================================================

const main = async () => {
  const analysis = new WorkflowPerformanceAnalysis();

  analysis.loadWorkflows();
  analysis.runAnalysis();
  analysis.printSummary();
  analysis.saveReports();

  process.exit(0);
};

main().catch((error) => {
  console.error("Analysis failed:", error);
  process.exit(1);
});
