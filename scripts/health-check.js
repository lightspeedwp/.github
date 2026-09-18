#!/usr/bin/env node

/**
 * Agent Specification System Health Check
 *
 * Performs comprehensive health checks on the agent specification system
 * including file integrity, validation status, dependencies, and performance.
 *
 * Usage:
 *   node scripts/health-check.js [options]
 *
 * Options:
 *   --format [json|text]  Output format (default: text)
 *   --output <path>       Write results to file
 *   --verbose             Show detailed results
 */

const fs = require("fs");
// eslint-disable-next-line no-unused-vars
const _path = require("path");
const { execSync } = require("child_process");

class HealthChecker {
  constructor(options = {}) {
    this.options = {
      format: "text",
      output: null,
      verbose: false,
      ...options,
    };

    this.checks = [];
    this.startTime = Date.now();
  }

  /**
   * Run all health checks
   */
  async runHealthChecks() {
    try {
      console.log("🏥 Running health checks...\n");

      this.checkFileIntegrity();
      this.checkDependencies();
      this.checkNodeVersion();
      this.checkNpmVersion();
      this.checkProjectStructure();
      this.checkValidationTools();
      this.checkTestInfrastructure();

      const report = this.generateReport();
      this.outputResults(report);

      return report;
    } catch (error) {
      console.error("❌ Health check failed:", error.message);
      process.exit(1);
    }
  }

  /**
   * Check file integrity
   */
  checkFileIntegrity() {
    this.logCheck("File Integrity", "running");

    try {
      const requiredFiles = [
        "package.json",
        "CHANGELOG.md",
        ".github/AGENTS.md",
        ".github/CLAUDE.md",
      ];

      let missing = 0;
      requiredFiles.forEach((file) => {
        if (!fs.existsSync(file)) {
          missing++;
        }
      });

      if (missing === 0) {
        this.logCheck("File Integrity", "passed", {
          files: requiredFiles.length,
        });
      } else {
        this.logCheck("File Integrity", "warning", {
          missing,
          total: requiredFiles.length,
        });
      }
    } catch (error) {
      this.logCheck("File Integrity", "failed", { error: error.message });
    }
  }

  /**
   * Check Node.js version
   */
  checkNodeVersion() {
    this.logCheck("Node.js Version", "running");

    try {
      const version = process.version;
      const major = parseInt(version.slice(1).split(".")[0]);

      if (major >= 24) {
        this.logCheck("Node.js Version", "passed", { version });
      } else if (major >= 20) {
        this.logCheck("Node.js Version", "warning", {
          version,
          minimum: "20.x",
        });
      } else {
        this.logCheck("Node.js Version", "failed", {
          version,
          minimum: "20.x",
        });
      }
    } catch (error) {
      this.logCheck("Node.js Version", "failed", { error: error.message });
    }
  }

  /**
   * Check npm version
   */
  checkNpmVersion() {
    this.logCheck("npm Version", "running");

    try {
      const output = execSync("npm --version", { encoding: "utf8" }).trim();
      const major = parseInt(output.split(".")[0]);

      if (major >= 10) {
        this.logCheck("npm Version", "passed", { version: output });
      } else if (major >= 8) {
        this.logCheck("npm Version", "warning", {
          version: output,
          minimum: "10.x",
        });
      } else {
        this.logCheck("npm Version", "failed", {
          version: output,
          minimum: "10.x",
        });
      }
    } catch (error) {
      this.logCheck("npm Version", "failed", { error: error.message });
    }
  }

  /**
   * Check dependencies
   */
  checkDependencies() {
    this.logCheck("Dependencies", "running");

    try {
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      const requiredDeps = ["js-yaml", "eslint", "prettier", "jest"];
      const missing = requiredDeps.filter((dep) => !allDeps[dep]);

      if (missing.length === 0) {
        this.logCheck("Dependencies", "passed", {
          count: Object.keys(allDeps).length,
        });
      } else {
        this.logCheck("Dependencies", "warning", { missing });
      }
    } catch (error) {
      this.logCheck("Dependencies", "failed", { error: error.message });
    }
  }

  /**
   * Check project structure
   */
  checkProjectStructure() {
    this.logCheck("Project Structure", "running");

    try {
      const requiredDirs = ["agents", "scripts", "docs", ".github"];

      let missing = 0;
      requiredDirs.forEach((dir) => {
        if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
          missing++;
        }
      });

      if (missing === 0) {
        this.logCheck("Project Structure", "passed", {
          directories: requiredDirs.length,
        });
      } else {
        this.logCheck("Project Structure", "warning", { missing });
      }
    } catch (error) {
      this.logCheck("Project Structure", "failed", { error: error.message });
    }
  }

  /**
   * Check validation tools
   */
  checkValidationTools() {
    this.logCheck("Validation Tools", "running");

    try {
      const tools = [
        "scripts/validate.js",
        "scripts/create-agent-spec.js",
        "scripts/generate-validation-report.js",
        "scripts/validate-with-debug.js",
      ];

      let missing = 0;
      tools.forEach((tool) => {
        if (!fs.existsSync(tool)) {
          missing++;
        }
      });

      if (missing === 0) {
        this.logCheck("Validation Tools", "passed", { tools: tools.length });
      } else {
        this.logCheck("Validation Tools", "warning", {
          missing,
          total: tools.length,
        });
      }
    } catch (error) {
      this.logCheck("Validation Tools", "failed", { error: error.message });
    }
  }

  /**
   * Check test infrastructure
   */
  checkTestInfrastructure() {
    this.logCheck("Test Infrastructure", "running");

    try {
      const testDirs = ["scripts/__tests__", ".github/scripts/__tests__"];

      let found = 0;
      testDirs.forEach((dir) => {
        if (fs.existsSync(dir)) {
          found++;
        }
      });

      if (found > 0) {
        this.logCheck("Test Infrastructure", "passed", { directories: found });
      } else {
        this.logCheck("Test Infrastructure", "warning", {
          message: "No test directories found",
        });
      }
    } catch (error) {
      this.logCheck("Test Infrastructure", "failed", { error: error.message });
    }
  }

  /**
   * Log a check result
   */
  logCheck(name, status, details = {}) {
    const check = {
      name,
      status,
      timestamp: Date.now() - this.startTime,
      details,
    };

    this.checks.push(check);

    if (this.options.verbose) {
      const icon = status === "passed" ? "✓" : status === "failed" ? "✗" : "⚠";
      console.log(`  ${icon} ${name}: ${status}`);
      if (Object.keys(details).length > 0) {
        console.log(`    ${JSON.stringify(details)}`);
      }
    }
  }

  /**
   * Generate health report
   */
  generateReport() {
    const passedCount = this.checks.filter((c) => c.status === "passed").length;
    const warningCount = this.checks.filter(
      (c) => c.status === "warning",
    ).length;
    const failedCount = this.checks.filter((c) => c.status === "failed").length;

    const overallStatus =
      failedCount > 0 ? "critical" : warningCount > 0 ? "warning" : "healthy";

    return {
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      status: overallStatus,
      summary: {
        total: this.checks.length,
        passed: passedCount,
        warnings: warningCount,
        failed: failedCount,
      },
      checks: this.checks,
    };
  }

  /**
   * Output results
   */
  outputResults(report) {
    const output =
      this.options.format === "json"
        ? JSON.stringify(report, null, 2)
        : this.formatTextOutput(report);

    if (this.options.output) {
      fs.writeFileSync(this.options.output, output);
      console.log(`\n📋 Report written to: ${this.options.output}`);
    } else {
      console.log(output);
    }
  }

  /**
   * Format output as text
   */
  formatTextOutput(report) {
    const { status, summary, checks, duration } = report;

    const statusIcon =
      status === "healthy" ? "✓" : status === "warning" ? "⚠" : "✗";
    // statusColor reserved for future styled output
    // const statusColor = status === 'healthy' ? 'green' : status === 'warning' ? 'yellow' : 'red';

    const lines = [
      "",
      "╔════════════════════════════════════════════════════════════╗",
      "║         Agent Specification System Health Report           ║",
      "╚════════════════════════════════════════════════════════════╝",
      "",
      `Status: ${statusIcon} ${status.toUpperCase()}`,
      `Duration: ${duration}ms`,
      "",
      "📊 Summary",
      `  Total Checks: ${summary.total}`,
      `  Passed: ${summary.passed}`,
      `  Warnings: ${summary.warnings}`,
      `  Failed: ${summary.failed}`,
      "",
    ];

    if (summary.failed > 0) {
      lines.push("❌ Failed Checks");
      checks
        .filter((c) => c.status === "failed")
        .forEach((check) => {
          lines.push(`  - ${check.name}`);
          if (check.details.error) {
            lines.push(`    Error: ${check.details.error}`);
          }
        });
      lines.push("");
    }

    if (summary.warnings > 0) {
      lines.push("⚠️  Warnings");
      checks
        .filter((c) => c.status === "warning")
        .forEach((check) => {
          lines.push(`  - ${check.name}`);
          if (check.details.message) {
            lines.push(`    ${check.details.message}`);
          }
          if (check.details.missing) {
            lines.push(`    Missing: ${check.details.missing}`);
          }
        });
      lines.push("");
    }

    if (summary.passed > 0) {
      lines.push("✅ Passed Checks");
      checks
        .filter((c) => c.status === "passed")
        .forEach((check) => {
          lines.push(`  ✓ ${check.name}`);
        });
      lines.push("");
    }

    lines.push(`Report Generated: ${report.timestamp}`);
    lines.push("");

    return lines.join("\n");
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--format") {
      options.format = args[++i] || "text";
    } else if (args[i] === "--output") {
      options.output = args[++i];
    } else if (args[i] === "--verbose") {
      options.verbose = true;
    }
  }

  const checker = new HealthChecker(options);
  checker.runHealthChecks().then((report) => {
    const exitCode = report.status === "critical" ? 1 : 0;
    process.exit(exitCode);
  });
}

module.exports = HealthChecker;
