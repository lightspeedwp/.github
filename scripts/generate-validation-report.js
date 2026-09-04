#!/usr/bin/env node

/**
 * Validation Report Generator
 *
 * Generates comprehensive validation reports for agent specifications
 * across multiple formats (JSON, CSV, HTML, text summary).
 *
 * Usage:
 *   node scripts/generate-validation-report.js [options]
 *
 * Options:
 *   --format [json|csv|html|text|all]  Output format (default: text)
 *   --output <path>                     Output file path
 *   --specs <path>                      Specifications directory (default: agents)
 *   --include-warnings                  Include warning-level issues
 *   --strict                            Fail on any issue
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// Severity levels for issue categorization (reference for validation)
const _SEVERITY_LEVELS = {
  error: 0,
  warning: 1,
  info: 2,
};

const AGENT_DIR = path.resolve(__dirname, "../agents");
const SPECS_PATTERN = /\.agent\.md$/;

class ValidationReporter {
  constructor(options = {}) {
    this.options = {
      format: "text",
      output: null,
      specsDir: AGENT_DIR,
      includeWarnings: false,
      strict: false,
      ...options,
    };
    this.validations = [];
    this.agents = [];
  }

  /**
   * Run full validation and generate reports
   */
  async generate() {
    try {
      this.scanAgentSpecifications();
      this.validateAllAgents();
      this.generateReports();
      return this.getResults();
    } catch (error) {
      console.error("Report generation failed:", error.message);
      process.exit(1);
    }
  }

  /**
   * Scan directory for agent specifications
   */
  scanAgentSpecifications() {
    if (!fs.existsSync(this.options.specsDir)) {
      throw new Error(
        `Specifications directory not found: ${this.options.specsDir}`,
      );
    }

    const scanDir = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (SPECS_PATTERN.test(file)) {
          this.agents.push(fullPath);
        }
      });
    };

    scanDir(this.options.specsDir);
  }

  /**
   * Validate all agent specifications
   */
  validateAllAgents() {
    this.agents.forEach((agentPath) => {
      this.validateAgent(agentPath);
    });
  }

  /**
   * Validate single agent specification
   */
  validateAgent(agentPath) {
    try {
      const content = fs.readFileSync(agentPath, "utf8");
      const [frontmatter, body] = this.extractFrontmatter(content);

      const findings = [];
      findings.push(...this.validateFrontmatter(frontmatter, agentPath));
      findings.push(...this.validateContent(body, agentPath));
      findings.push(...this.validateStructure(agentPath));

      this.validations.push({
        file: path.relative(process.cwd(), agentPath),
        findings,
        passed: findings.every((f) => f.severity !== "error"),
        issueCount: findings.length,
      });
    } catch (_error) {
      this.validations.push({
        file: path.relative(process.cwd(), agentPath),
        findings: [
          {
            severity: "error",
            message: `Failed to read file: ${_error.message}`,
            line: 0,
          },
        ],
        passed: false,
        issueCount: 1,
      });
    }
  }

  /**
   * Extract frontmatter from agent specification
   */
  extractFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      return [{}, content];
    }
    try {
      return [yaml.load(match[1]), match[2]];
    } catch (_error) {
      return [{}, content];
    }
  }

  /**
   * Validate frontmatter fields
   */
  validateFrontmatter(frontmatter) {
    const findings = [];
    const required = [
      "name",
      "description",
      "category",
      "status",
      "version",
      "created_date",
      "created_by",
    ];

    required.forEach((field) => {
      if (!frontmatter[field]) {
        findings.push({
          severity: "error",
          field,
          message: `Missing required field: ${field}`,
        });
      }
    });

    // Validate field formats
    if (frontmatter.version && !/^\d+\.\d+\.\d+/.test(frontmatter.version)) {
      findings.push({
        severity: "error",
        field: "version",
        message: `Invalid semantic version format: ${frontmatter.version}`,
      });
    }

    if (
      frontmatter.created_date &&
      !/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.created_date)
    ) {
      findings.push({
        severity: "error",
        field: "created_date",
        message: `Invalid date format (expected YYYY-MM-DD): ${frontmatter.created_date}`,
      });
    }

    const validCategories = [
      "governance",
      "analysis",
      "generation",
      "automation",
      "integration",
    ];
    if (
      frontmatter.category &&
      !validCategories.includes(frontmatter.category)
    ) {
      findings.push({
        severity: "error",
        field: "category",
        message: `Invalid category. Expected one of: ${validCategories.join(", ")}`,
      });
    }

    const validStatuses = ["active", "draft", "deprecated", "archived"];
    if (frontmatter.status && !validStatuses.includes(frontmatter.status)) {
      findings.push({
        severity: "warning",
        field: "status",
        message: `Unusual status value: ${frontmatter.status}`,
      });
    }

    return findings;
  }

  /**
   * Validate content sections
   */
  validateContent(content) {
    const findings = [];

    if (!content.includes("## Overview")) {
      findings.push({
        severity: "warning",
        message: 'Missing "Overview" section',
      });
    }

    if (!content.includes("## Implementation Requirements")) {
      findings.push({
        severity: "warning",
        message: 'Missing "Implementation Requirements" section',
      });
    }

    // Check for UK English spelling
    const americanisms = [
      { pattern: /\boptimize/g, replacement: "optimise" },
      { pattern: /\bcustomize/g, replacement: "customise" },
      { pattern: /\borganization/g, replacement: "organisation" },
    ];

    americanisms.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        findings.push({
          severity: "info",
          message: `Consider using UK English spelling: "${replacement}"`,
        });
      }
    });

    return findings;
  }

  /**
   * Validate file structure and references
   */
  validateStructure(agentPath) {
    const findings = [];
    const agentName = path.basename(agentPath, ".agent.md");
    const implDir = path.join(path.dirname(agentPath), agentName);

    if (!fs.existsSync(implDir)) {
      findings.push({
        severity: "warning",
        message: `Implementation directory not found: ${path.relative(process.cwd(), implDir)}`,
      });
    } else {
      const requiredFiles = ["SKILL.md", "README.md"];
      requiredFiles.forEach((file) => {
        const filePath = path.join(implDir, file);
        if (!fs.existsSync(filePath)) {
          findings.push({
            severity: "warning",
            message: `Missing file: ${path.relative(process.cwd(), filePath)}`,
          });
        }
      });
    }

    return findings;
  }

  /**
   * Generate reports in configured formats
   */
  generateReports() {
    const formats =
      this.options.format === "all"
        ? ["text", "json", "csv", "html"]
        : [this.options.format];

    formats.forEach((format) => {
      this.generateReport(format);
    });
  }

  /**
   * Generate single report
   */
  generateReport(format) {
    const report = this.buildReport();
    let output;

    switch (format) {
      case "json":
        output = this.formatJSON(report);
        this.writeOutput(output, format);
        break;
      case "csv":
        output = this.formatCSV(report);
        this.writeOutput(output, format);
        break;
      case "html":
        output = this.formatHTML(report);
        this.writeOutput(output, format);
        break;
      case "text":
      default:
        output = this.formatText(report);
        this.writeOutput(output, format);
    }
  }

  /**
   * Build report data structure
   */
  buildReport() {
    const allFindings = [];
    const passedCount = this.validations.filter((v) => v.passed).length;
    const errorCount = this.validations.reduce(
      (sum, v) => sum + v.findings.filter((f) => f.severity === "error").length,
      0,
    );
    const warningCount = this.validations.reduce(
      (sum, v) =>
        sum + v.findings.filter((f) => f.severity === "warning").length,
      0,
    );

    this.validations.forEach((validation) => {
      validation.findings.forEach((finding) => {
        if (finding.severity !== "info" || this.options.includeWarnings) {
          allFindings.push({
            file: validation.file,
            ...finding,
          });
        }
      });
    });

    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalAgents: this.agents.length,
        passedAgents: passedCount,
        failedAgents: this.agents.length - passedCount,
        totalIssues: allFindings.length,
        errors: errorCount,
        warnings: warningCount,
      },
      validations: this.validations,
      findings: allFindings,
    };
  }

  /**
   * Format report as JSON
   */
  formatJSON(report) {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Format report as CSV
   */
  formatCSV(report) {
    const headers = ["File", "Severity", "Message", "Field"];
    const rows = report.findings.map((f) => [
      f.file,
      f.severity,
      f.message,
      f.field || "",
    ]);

    return [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
  }

  /**
   * Format report as HTML
   */
  formatHTML(report) {
    const { summary, validations } = report;
    const statusColor = summary.errors === 0 ? "#28a745" : "#dc3545";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agent Specification Validation Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    .summary { background: ${statusColor}; color: white; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .stat { background: rgba(255,255,255,0.2); padding: 10px; border-radius: 4px; text-align: center; }
    .stat-value { font-size: 24px; font-weight: bold; }
    .stat-label { font-size: 12px; margin-top: 5px; }
    .agent-result { border: 1px solid #ddd; margin-bottom: 10px; border-radius: 4px; overflow: hidden; }
    .agent-header { background: #f9f9f9; padding: 10px; font-weight: bold; cursor: pointer; }
    .agent-header.passed { border-left: 4px solid #28a745; }
    .agent-header.failed { border-left: 4px solid #dc3545; }
    .findings { padding: 10px; background: white; display: none; }
    .findings.show { display: block; }
    .finding { padding: 8px; margin: 5px 0; border-radius: 4px; }
    .finding.error { background: #f8d7da; color: #721c24; }
    .finding.warning { background: #fff3cd; color: #856404; }
    .finding.info { background: #d1ecf1; color: #0c5460; }
    .severity { font-weight: bold; text-transform: uppercase; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Agent Specification Validation Report</h1>
    <p>Generated: ${report.timestamp}</p>

    <div class="summary">
      <h2 style="margin-top: 0;">Validation Summary</h2>
      <div class="stats">
        <div class="stat">
          <div class="stat-value">${summary.totalAgents}</div>
          <div class="stat-label">Total Agents</div>
        </div>
        <div class="stat">
          <div class="stat-value">${summary.passedAgents}</div>
          <div class="stat-label">Passed</div>
        </div>
        <div class="stat">
          <div class="stat-value">${summary.errors}</div>
          <div class="stat-label">Errors</div>
        </div>
        <div class="stat">
          <div class="stat-value">${summary.warnings}</div>
          <div class="stat-label">Warnings</div>
        </div>
      </div>
    </div>

    <h2>Validation Results</h2>
    ${validations
      .map(
        (v, _i) => `
      <div class="agent-result">
        <div class="agent-header ${v.passed ? "passed" : "failed"}" onclick="this.nextElementSibling.classList.toggle('show')">
          ${v.passed ? "✓" : "✗"} ${v.file} (${v.issueCount} issue${v.issueCount !== 1 ? "s" : ""})
        </div>
        <div class="findings">
          ${
            v.findings.length === 0
              ? '<p style="color: #28a745;">✓ No issues found</p>'
              : v.findings
                  .map(
                    (f) => `
            <div class="finding ${f.severity}">
              <span class="severity">${f.severity}</span>: ${f.message}
              ${f.field ? ` (${f.field})` : ""}
            </div>
          `,
                  )
                  .join("")
          }
        </div>
      </div>
    `,
      )
      .join("")}
  </div>
</body>
</html>`;
  }

  /**
   * Format report as text summary
   */
  formatText(report) {
    const { summary, validations } = report;
    const lines = [
      "╔════════════════════════════════════════════════════════════╗",
      "║  Agent Specification Validation Report                    ║",
      "╚════════════════════════════════════════════════════════════╝",
      "",
      "📊 SUMMARY",
      `  Total Agents: ${summary.totalAgents}`,
      `  Passed: ${summary.passedAgents}`,
      `  Failed: ${summary.failedAgents}`,
      `  Total Issues: ${summary.totalIssues}`,
      `  Errors: ${summary.errors}`,
      `  Warnings: ${summary.warnings}`,
      "",
      "📋 VALIDATION RESULTS",
    ];

    validations.forEach((v) => {
      const icon = v.passed ? "✓" : "✗";
      lines.push(`  ${icon} ${v.file}`);
      if (v.findings.length > 0) {
        v.findings.forEach((f) => {
          const severity = f.severity.toUpperCase().padEnd(7);
          const field = f.field ? ` (${f.field})` : "";
          lines.push(`      [${severity}] ${f.message}${field}`);
        });
      }
    });

    lines.push("", "✨ Report generated: " + report.timestamp);

    return lines.join("\n");
  }

  /**
   * Write output to file or console
   */
  writeOutput(output, format) {
    if (this.options.output) {
      const extension =
        format === "json"
          ? "json"
          : format === "csv"
            ? "csv"
            : format === "html"
              ? "html"
              : "txt";
      const filename = this.options.output.replace(/\.[^.]+$/, `.${extension}`);
      fs.writeFileSync(filename, output);
      console.log(`Report written to: ${filename}`);
    } else {
      console.log(output);
    }
  }

  /**
   * Get validation results
   */
  getResults() {
    const report = this.buildReport();
    return {
      success: report.summary.errors === 0,
      report,
    };
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
    } else if (args[i] === "--specs") {
      options.specsDir = args[++i];
    } else if (args[i] === "--include-warnings") {
      options.includeWarnings = true;
    } else if (args[i] === "--strict") {
      options.strict = true;
    }
  }

  const reporter = new ValidationReporter(options);
  reporter.generate().then((result) => {
    if (options.strict && !result.success) {
      process.exit(1);
    }
  });
}

module.exports = ValidationReporter;
