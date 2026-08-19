#!/usr/bin/env node

/**
 * Metrics Collection Orchestrator
 *
 * Coordinates metrics collection across multiple repository contexts.
 * Runs metrics-agent with configured profiles and outputs structured results.
 *
 * Usage:
 *   node scripts/workflows/metrics/collect-metrics.js
 *   node scripts/workflows/metrics/collect-metrics.js --context github-control-plane
 *   node scripts/workflows/metrics/collect-metrics.js --context all --output /path/to/output
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const CONTEXTS = [
  "github-control-plane",
  "wordpress-plugin",
  "wordpress-theme",
];
const OUTPUT_DIR = path.join(
  __dirname,
  "../../..",
  ".githu./.github/reports/metrics",
);
const CONFIG_DIR = path.join(__dirname, "../../metrics/config");
const METRICS_AGENT = path.join(__dirname, "../../metrics/metrics-agent.js");

class MetricsCollectionOrchestrator {
  constructor(options = {}) {
    this.context = options.context || "all";
    this.outputDir = options.outputDir || OUTPUT_DIR;
    this.dry = options.dry || false;
    this.verbose = options.verbose || false;
    this.results = {
      timestamp: new Date().toISOString(),
      contexts: {},
      summary: {
        total: 0,
        successful: 0,
        failed: 0,
      },
    };
  }

  log(message, level = "info") {
    if (this.verbose || level !== "debug") {
      const prefix = level === "error" ? "❌" : level === "warn" ? "⚠️" : "ℹ️";
      console.log(`${prefix} [${level.toUpperCase()}] ${message}`);
    }
  }

  getContexts() {
    if (this.context === "all") {
      return CONTEXTS;
    }
    if (CONTEXTS.includes(this.context)) {
      return [this.context];
    }
    throw new Error(
      `Unknown context: ${this.context}. Valid options: ${CONTEXTS.join(", ")}`,
    );
  }

  validateSetup() {
    if (!fs.existsSync(METRICS_AGENT)) {
      throw new Error(`Metrics agent not found: ${METRICS_AGENT}`);
    }
    if (!fs.existsSync(CONFIG_DIR)) {
      throw new Error(`Config directory not found: ${CONFIG_DIR}`);
    }
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
      this.log(`Created output directory: ${this.outputDir}`);
    }
  }

  async collectMetrics(context) {
    this.results.summary.total++;

    try {
      const configPath = path.join(CONFIG_DIR, `${context}.json`);

      if (!fs.existsSync(configPath)) {
        throw new Error(`Config not found for context: ${context}`);
      }

      this.log(`Collecting metrics for context: ${context}`, "debug");

      if (this.dry) {
        this.log(
          `[DRY RUN] Would execute: node ${METRICS_AGENT} ${configPath}`,
        );
        this.results.contexts[context] = {
          status: "dry-run",
          timestamp: new Date().toISOString(),
        };
        this.results.summary.successful++;
        return;
      }

      // Execute metrics collection
      const output = execSync(`node ${METRICS_AGENT} ${configPath}`, {
        cwd: path.dirname(METRICS_AGENT),
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      });

      // Parse output to extract report file location
      const reportMatch = output.match(/Report saved to: (.+)/);
      const reportFile = reportMatch ? reportMatch[1] : null;

      this.results.contexts[context] = {
        status: "success",
        timestamp: new Date().toISOString(),
        reportFile,
        output: output.substring(0, 200), // Store first 200 chars of output
      };

      this.log(`✓ Metrics collected for ${context}`, "debug");
      this.results.summary.successful++;
    } catch (error) {
      this.log(
        `Failed to collect metrics for ${context}: ${error.message}`,
        "error",
      );

      this.results.contexts[context] = {
        status: "failed",
        timestamp: new Date().toISOString(),
        error: error.message,
      };

      this.results.summary.failed++;
    }
  }

  async collect() {
    try {
      this.log("Starting metrics collection orchestrator");
      this.validateSetup();
      this.ensureOutputDir();

      const contexts = this.getContexts();
      this.log(
        `Collecting metrics for ${contexts.length} context(s): ${contexts.join(", ")}`,
      );

      for (const context of contexts) {
        await this.collectMetrics(context);
      }

      // Save orchestration results
      const resultsFile = path.join(
        this.outputDir,
        `collection-${this.getTimestamp()}.json`,
      );
      fs.writeFileSync(resultsFile, JSON.stringify(this.results, null, 2));
      this.log(`Collection results saved to: ${resultsFile}`);

      // Set GitHub Actions output
      if (process.env.GITHUB_OUTPUT) {
        const timestamp = this.getTimestamp();
        fs.appendFileSync(
          process.env.GITHUB_OUTPUT,
          `collection_timestamp=${timestamp}\n`,
        );
        fs.appendFileSync(
          process.env.GITHUB_OUTPUT,
          `results_file=${resultsFile}\n`,
        );
        fs.appendFileSync(
          process.env.GITHUB_OUTPUT,
          `successful=${this.results.summary.successful}\n`,
        );
        fs.appendFileSync(
          process.env.GITHUB_OUTPUT,
          `failed=${this.results.summary.failed}\n`,
        );
      }

      if (this.results.summary.failed > 0) {
        throw new Error(
          `${this.results.summary.failed} context(s) failed to collect metrics`,
        );
      }

      this.log("✓ All metrics collected successfully");
      return this.results;
    } catch (error) {
      this.log(`Fatal error: ${error.message}`, "error");
      process.exit(1);
    }
  }

  getTimestamp() {
    return new Date().toISOString().split("T")[0];
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const options = {
    context: "all",
    outputDir: OUTPUT_DIR,
    dry: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--context":
        options.context = args[++i];
        break;
      case "--output":
        options.outputDir = args[++i];
        break;
      case "--dry":
        options.dry = true;
        break;
      case "--verbose":
        options.verbose = true;
        break;
      case "--help":
        console.log(`
Usage: node scripts/workflows/metrics/collect-metrics.js [options]

Options:
  --context CONTEXT       Metrics context: all, github-control-plane, wordpress-plugin, wordpress-theme
  --output PATH          Output directory (default: .githu./.github/reports/metrics)
  --dry                  Dry run (don't execute, show what would happen)
  --verbose              Verbose output
  --help                 Show this help message
        `);
        process.exit(0);
    }
  }

  const orchestrator = new MetricsCollectionOrchestrator(options);
  await orchestrator.collect();
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

module.exports = MetricsCollectionOrchestrator;
