#!/usr/bin/env node

/**
 * Metrics Reporting Orchestrator
 * Generates metrics reports and manages GitHub issues
 */

const fs = require("fs");
const path = require("path");
const { MetricsStorage } = require("../metrics/metrics-storage.cjs");
const { MetricsReporter } = require("../metrics/metrics-reporter");
const { TrendAnalyzer } = require("../metrics/trend-analyzer.cjs");
const { AnomalyDetector } = require("../metrics/anomaly-detector.cjs");
const {
  createTelemetryClient,
} = require("../telemetry/telemetry-client.js");
const { EVENT_SCHEMAS } = require("../telemetry/event-schemas.js");

class MetricsReportingOrchestrator {
  constructor() {
    this.storage = new MetricsStorage(".github/reports/metrics");
    this.trendAnalyzer = new TrendAnalyzer();
    this.anomalyDetector = new AnomalyDetector();
    this.reporter = new MetricsReporter(
      this.storage,
      this.trendAnalyzer,
      this.anomalyDetector,
    );
    this.reports = [];
    
    // Initialize telemetry client
    this.telemetry = createTelemetryClient({
      eventSchemas: EVENT_SCHEMAS,
    });
  }

  async generateReports(repositories, period = "weekly") {
    console.log(`\n📊 Generating ${period} metrics reports...`);
    console.log(`📦 Repositories to report on: ${repositories.length}`);

    for (const repo of repositories) {
      try {
        const reportKey = `${repo.owner}/${repo.repo}`;
        console.log(`\n📝 Generating report for ${reportKey}...`);
        
        const reportStartTime = Date.now();

        const report = await this.reporter.generateReport(reportKey, {
          period,
          includeTrends: true,
          includeAnomalies: true,
        });

        if (!report) {
          console.warn(`⚠️  No data available for ${reportKey}`);
          continue;
        }

        // Save report to file
        const reportPath = this.saveReport(reportKey, report, period);
        
        const generationDuration = Date.now() - reportStartTime;

        // Emit: metrics.report.generated
        const fileSize = fs.statSync(reportPath).size;
        const metricsIncluded = (report.match(/###/g) || []).length; // Rough count of metrics sections
        
        this.telemetry.emit('metrics.report.generated', {
          safe: {
            reportType: 'metrics-report',
            period,
            metricsIncluded,
            trendsIncluded: true,
            anomaliesIncluded: true,
            generationDuration
          },
          restricted: {
            repository: reportKey,
            reportPath,
            fileSize
          }
        });

        this.reports.push({
          repository: reportKey,
          status: "success",
          reportPath,
          period,
          timestamp: new Date().toISOString(),
        });

        console.log(`✅ Report saved to: ${reportPath}`);
      } catch (error) {
        console.error(
          `❌ Error generating report for ${repo.owner}/${repo.repo}:`,
          error.message,
        );

        this.reports.push({
          repository: `${repo.owner}/${repo.repo}`,
          status: "error",
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return this.reports;
  }

  saveReport(repository, report, period) {
    const reportDir = path.join(".github/reports/metrics");
    fs.mkdirSync(reportDir, { recursive: true });

    const dateString = new Date().toISOString().split("T")[0];
    const reportFileName = `report-${repository.replace("/", "-")}-${period}-${dateString}.md`;
    const reportPath = path.join(reportDir, reportFileName);

    fs.writeFileSync(reportPath, report);
    return reportPath;
  }

  generateSummary() {
    const successCount = this.reports.filter(
      (r) => r.status === "success",
    ).length;
    const errorCount = this.reports.filter((r) => r.status === "error").length;
    const totalCount = this.reports.length;

    const summary = {
      timestamp: new Date().toISOString(),
      execution: {
        repositories: {
          total: totalCount,
          successful: successCount,
          failed: errorCount,
        },
      },
      reports: this.reports,
    };

    console.log("\n📈 Reporting Summary");
    console.log(`✅ Successful: ${successCount}/${totalCount}`);
    console.log(`❌ Failed: ${errorCount}/${totalCount}`);

    // Save summary
    const summaryPath = path.join(
      ".github/reports/metrics",
      `reporting-summary-${new Date().toISOString().split("T")[0]}.json`,
    );
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`💾 Summary saved to: ${summaryPath}`);

    return summary;
  }

  async run(period = "weekly") {
    try {
      // Get list of repositories from config
      const configPath = path.join(
        "scripts/workflows/metrics-config.json",
      );
      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      const repositories = config.repositories.filter(
        (r) => r.enabled !== false,
      );

      // Generate reports
      await this.generateReports(repositories, period);

      // Generate summary
      const summary = this.generateSummary();

      console.log("\n✨ Reporting completed successfully");
      return summary;
    } catch (error) {
      console.error("\n💥 Fatal error during reporting:", error.message);
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const reportType = args.includes("--reportType")
    ? args[args.indexOf("--reportType") + 1]
    : "weekly";
  const includeArchive = args.includes("--includeArchive")
    ? args[args.indexOf("--includeArchive") + 1] === "true"
    : false;

  console.log(`🔧 Report Type: ${reportType}`);
  console.log(`📦 Include Archive: ${includeArchive}`);

  const orchestrator = new MetricsReportingOrchestrator();
  await orchestrator.run(reportType);

  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

module.exports = { MetricsReportingOrchestrator };
