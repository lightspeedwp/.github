#!/usr/bin/env node

/**
 * Debug Mode Validator
 *
 * Enhanced validation with detailed debug output for troubleshooting.
 * Wraps existing validation logic to provide step-by-step diagnostics.
 *
 * Usage:
 *   node scripts/validate-with-debug.js [target] [options]
 *
 * Options:
 *   --verbose              Show all debug steps
 *   --trace                Show full call stack on errors
 *   --performance          Show timing information
 *   --suggestions          Include suggestions for fixes
 *   --format [text|json]   Output format (default: text)
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

class DebugValidator {
  constructor(options = {}) {
    this.options = {
      verbose: false,
      trace: false,
      performance: false,
      suggestions: true,
      format: "text",
      colors: process.stdout.isTTY,
      ...options,
    };
    this.debugLog = [];
    this.startTime = Date.now();
    this.timings = {};
  }

  /**
   * Color codes for console output
   */
  static colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m",
  };

  /**
   * Colorise text if colors enabled
   */
  colour(text, colorKey) {
    if (!this.options.colors) return text;
    const color = DebugValidator.colors[colorKey];
    return `${color}${text}${DebugValidator.colors.reset}`;
  }

  /**
   * Log debug message with timestamp
   */
  log(level, message, data = null) {
    const timestamp = Date.now() - this.startTime;
    const entry = {
      timestamp,
      level,
      message,
      data,
      stack: this.options.trace ? new Error().stack : undefined,
    };

    this.debugLog.push(entry);

    if (this.options.verbose) {
      const timeStr = `[${timestamp}ms]`.padEnd(10);
      const levelStr = level.toUpperCase().padEnd(7);
      const prefix = this.colour(
        `${timeStr} ${levelStr}`,
        level === "error" ? "red" : "cyan",
      );

      console.error(`${prefix} ${message}`);
      if (data) {
        console.error("  ", JSON.stringify(data, null, 2));
      }
    }
  }

  /**
   * Mark start of timing section
   */
  startTiming(label) {
    if (!this.options.performance) return;
    this.timings[label] = Date.now();
  }

  /**
   * Mark end of timing section
   */
  endTiming(label) {
    if (!this.options.performance) return;
    if (this.timings[label]) {
      const duration = Date.now() - this.timings[label];
      this.log("timing", `${label} completed in ${duration}ms`);
      delete this.timings[label];
    }
  }

  /**
   * Validate target (file or directory)
   */
  async validate(target) {
    this.log("info", "Starting validation", { target });
    this.startTiming("total-validation");

    try {
      if (!target) {
        return this.handleMissingTarget();
      }

      const fullPath = path.resolve(target);

      if (!fs.existsSync(fullPath)) {
        return this.handleNotFound(fullPath);
      }

      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        return this.validateDirectory(fullPath);
      } else if (stat.isFile()) {
        return this.validateFile(fullPath);
      } else {
        return this.handleInvalidTarget(fullPath);
      }
    } catch (error) {
      this.log("error", "Validation failed", { error: error.message });
      if (this.options.trace) {
        this.log("error", "Stack trace", { stack: error.stack });
      }
      return this.formatOutput(false);
    } finally {
      this.endTiming("total-validation");
    }
  }

  /**
   * Validate file
   */
  validateFile(filePath) {
    this.log("info", "Validating file", { file: filePath });
    this.startTiming("file-read");

    try {
      const content = fs.readFileSync(filePath, "utf8");
      this.endTiming("file-read");
      this.log("info", "File read successfully", { size: content.length });

      this.startTiming("frontmatter-parse");
      const [frontmatter, body] = this.parseFrontmatter(content);
      this.endTiming("frontmatter-parse");

      const findings = [];
      findings.push(...this.validateFrontmatter(frontmatter));
      findings.push(...this.validateBody(body));
      findings.push(...this.validateReferences(filePath, frontmatter));

      this.log("info", "Validation completed", {
        file: filePath,
        issueCount: findings.length,
        errors: findings.filter((f) => f.severity === "error").length,
      });

      return this.formatOutput(
        findings.every((f) => f.severity !== "error"),
        findings,
      );
    } catch (error) {
      this.log("error", "File validation failed", { error: error.message });
      return this.formatOutput(false, [
        {
          severity: "error",
          message: `Failed to validate: ${error.message}`,
        },
      ]);
    }
  }

  /**
   * Validate directory
   */
  validateDirectory(dirPath) {
    this.log("info", "Validating directory", { directory: dirPath });
    this.startTiming("directory-scan");

    const results = [];
    const scanDir = (dir) => {
      try {
        const files = fs.readdirSync(dir);
        this.log("info", "Scanned directory", {
          directory: dir,
          fileCount: files.length,
        });

        files.forEach((file) => {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            scanDir(fullPath);
          } else if (file.endsWith(".agent.md")) {
            this.log("info", "Found agent spec", { file: fullPath });
            const fileResult = this.validateFile(fullPath);
            results.push(fileResult);
          }
        });
      } catch (error) {
        this.log("error", "Directory scan failed", {
          directory: dir,
          error: error.message,
        });
      }
    };

    scanDir(dirPath);
    this.endTiming("directory-scan");

    const allPassed = results.every((r) => r.success);
    const allFindings = results.flatMap((r) => r.findings || []);

    this.log("info", "Directory validation completed", {
      directory: dirPath,
      filesProcessed: results.length,
      totalIssues: allFindings.length,
    });

    return this.formatOutput(allPassed, allFindings);
  }

  /**
   * Parse YAML frontmatter
   */
  parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      this.log("warning", "No frontmatter found");
      return [{}, content];
    }

    try {
      const frontmatter = yaml.load(match[1]);
      this.log("info", "Frontmatter parsed", {
        fields: Object.keys(frontmatter).length,
        keys: Object.keys(frontmatter),
      });
      return [frontmatter, match[2]];
    } catch (error) {
      this.log("error", "Frontmatter parse failed", { error: error.message });
      return [{}, content];
    }
  }

  /**
   * Validate frontmatter fields
   */
  validateFrontmatter(frontmatter) {
    this.log("info", "Validating frontmatter fields");
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
        const finding = {
          severity: "error",
          field,
          message: `Missing required field: ${field}`,
        };
        findings.push(finding);
        this.log("error", `Missing field: ${field}`);

        if (this.options.suggestions) {
          finding.suggestion = this.getSuggestion("missing-field", field);
        }
      }
    });

    // Validate semantic version
    if (frontmatter.version) {
      if (!/^\d+\.\d+\.\d+/.test(frontmatter.version)) {
        const finding = {
          severity: "error",
          field: "version",
          message: `Invalid semantic version: ${frontmatter.version}`,
          expected: "MAJOR.MINOR.PATCH format",
        };
        findings.push(finding);
        this.log("error", "Invalid version format", {
          version: frontmatter.version,
        });

        if (this.options.suggestions) {
          finding.suggestion = "Use format: X.Y.Z (e.g., 1.0.0)";
        }
      }
    }

    // Validate date format
    if (frontmatter.created_date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.created_date)) {
        const finding = {
          severity: "error",
          field: "created_date",
          message: `Invalid date format: ${frontmatter.created_date}`,
          expected: "YYYY-MM-DD format",
        };
        findings.push(finding);
        this.log("error", "Invalid date format", {
          date: frontmatter.created_date,
        });

        if (this.options.suggestions) {
          const today = new Date().toISOString().split("T")[0];
          finding.suggestion = `Use ISO 8601 format, for example: ${today}`;
        }
      }
    }

    // Validate category
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
      const finding = {
        severity: "error",
        field: "category",
        message: `Invalid category: ${frontmatter.category}`,
        expected: validCategories,
      };
      findings.push(finding);
      this.log("error", "Invalid category", { category: frontmatter.category });

      if (this.options.suggestions) {
        finding.suggestion = `Use one of: ${validCategories.join(", ")}`;
      }
    }

    this.log("info", "Frontmatter validation completed", {
      issueCount: findings.length,
    });
    return findings;
  }

  /**
   * Validate body content
   */
  validateBody(body) {
    this.log("info", "Validating body content");
    const findings = [];

    const sections = ["## Overview", "## Implementation Requirements"];
    sections.forEach((section) => {
      if (!body.includes(section)) {
        const finding = {
          severity: "warning",
          message: `Missing section: ${section}`,
        };
        findings.push(finding);
        this.log("warning", `Missing section: ${section}`);

        if (this.options.suggestions) {
          finding.suggestion = `Add a ${section.toLowerCase()} section to your specification`;
        }
      }
    });

    this.log("info", "Body validation completed", {
      issueCount: findings.length,
    });
    return findings;
  }

  /**
   * Validate file references
   */
  validateReferences(filePath, frontmatter) {
    this.log("info", "Validating file references");
    const findings = [];

    if (frontmatter.implementation_reference) {
      const refPath = path.resolve(
        path.dirname(filePath),
        "..",
        frontmatter.implementation_reference,
      );
      if (!fs.existsSync(refPath)) {
        const finding = {
          severity: "warning",
          message: `Implementation reference not found: ${frontmatter.implementation_reference}`,
          referencedPath: refPath,
        };
        findings.push(finding);
        this.log("warning", "Missing implementation reference", {
          path: refPath,
        });

        if (this.options.suggestions) {
          finding.suggestion =
            "Create the implementation directory or correct the reference path";
        }
      }
    }

    this.log("info", "Reference validation completed", {
      issueCount: findings.length,
    });
    return findings;
  }

  /**
   * Get suggestion for common issues
   */
  getSuggestion(issueType, field) {
    const suggestions = {
      "missing-field": {
        name: 'Specify a descriptive name for your agent (e.g., "Content Moderator")',
        description: "Write a 2-5 sentence description of what the agent does",
        category:
          "Choose from: governance, analysis, generation, automation, integration",
        status: 'Use "active", "draft", "deprecated", or "archived"',
        version: "Use semantic versioning format: X.Y.Z (e.g., 1.0.0)",
        created_date: "Use ISO 8601 date format: YYYY-MM-DD",
        created_by: "Provide your email or username",
      },
    };

    return suggestions[issueType]?.[field] || "See documentation for details";
  }

  /**
   * Handle missing target
   */
  handleMissingTarget() {
    this.log("error", "No target specified");
    return this.formatOutput(false, [
      {
        severity: "error",
        message: "No file or directory specified for validation",
      },
    ]);
  }

  /**
   * Handle not found
   */
  handleNotFound(fullPath) {
    this.log("error", "Target not found", { path: fullPath });
    return this.formatOutput(false, [
      {
        severity: "error",
        message: `Path not found: ${fullPath}`,
      },
    ]);
  }

  /**
   * Handle invalid target
   */
  handleInvalidTarget(fullPath) {
    this.log("error", "Invalid target type", { path: fullPath });
    return this.formatOutput(false, [
      {
        severity: "error",
        message: `Not a file or directory: ${fullPath}`,
      },
    ]);
  }

  /**
   * Format output
   */
  formatOutput(success, findings = []) {
    const output = {
      success,
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      findings: findings || [],
      debug: this.options.verbose ? this.debugLog : undefined,
    };

    if (this.options.format === "json") {
      console.log(JSON.stringify(output, null, 2));
    } else {
      this.printTextOutput(output);
    }

    return output;
  }

  /**
   * Print text-formatted output
   */
  printTextOutput(output) {
    const { success, duration, findings } = output;

    const status = success
      ? this.colour("✓ PASSED", "green")
      : this.colour("✗ FAILED", "red");

    console.error(`\n${status} Validation completed in ${duration}ms\n`);

    if (findings.length === 0) {
      console.error(this.colour("✓ No issues found", "green"));
    } else {
      console.error(this.colour("Issues found:", "yellow"));
      findings.forEach((f) => {
        const severityColour = f.severity === "error" ? "red" : "yellow";
        const severity = this.colour(
          `[${f.severity.toUpperCase()}]`,
          severityColour,
        );
        console.error(`  ${severity} ${f.message}`);

        if (f.suggestion) {
          console.error(
            this.colour(`    💡 Suggestion: ${f.suggestion}`, "cyan"),
          );
        }
      });
    }

    if (this.options.performance && Object.keys(this.timings).length === 0) {
      const perfSummary = this.debugLog
        .filter((e) => e.level === "timing")
        .map((e) => `  ${e.message}`)
        .join("\n");

      if (perfSummary) {
        console.error("\n" + this.colour("Performance:", "cyan"));
        console.error(perfSummary);
      }
    }

    console.error("");
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  let target = null;
  const options = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      if (
        key === "verbose" ||
        key === "trace" ||
        key === "performance" ||
        key === "suggestions"
      ) {
        options[key] = true;
      } else if (key === "format") {
        options.format = args[++i];
      }
    } else if (!target) {
      target = args[i];
    }
  }

  const validator = new DebugValidator(options);
  validator.validate(target).then((result) => {
    if (!result.success) {
      process.exit(1);
    }
  });
}

module.exports = DebugValidator;
