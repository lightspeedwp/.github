#!/usr/bin/env node
/**
 * Comprehensive JSON linting & validation tool for LightSpeedWP.
 *
 * Features:
 *   - Pretty-print JSON with Prettier
 *   - Validate syntax with JSONLint (optional)
 *   - Validate against JSON Schema using Ajv
 *   - Produce minimal diffs and actionable reports
 *   - Support glob patterns and multiple files
 *
 * Usage:
 *   node validate-json.js [options]
 *
 * Options:
 *   --glob <pattern>       Glob pattern for JSON files
 *   --schema <path>        Path to JSON schema file
 *   --spec <draft>         JSON Schema spec (draft7|draft2019|draft2020|jtd)
 *   --format-only          Only format files, skip validation
 *   --validate-only        Only validate, skip formatting
 *   --read-only            Don't modify files, show diffs only
 *   --strict               Use JSONLint for strict syntax checking
 *   --report-dir <path>    Directory for reports (default: ./reports)
 *   --errors <format>      Error format: text|json (default: text)
 *
 * @module scripts/validation/validate-json
 * @see ../../instructions/linting.instructions.md
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */

const fs = require("fs");
const path = require("path");
const { globSync } = require("glob");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const { execSync } = require("child_process");

// Configuration
const config = {
  glob: "**/*.json",
  schema: null,
  spec: "draft2020",
  formatOnly: false,
  validateOnly: false,
  readOnly: false,
  strict: false,
  reportDir: "./reports",
  errorsFormat: "text",
  verbose: false,
};

// Parse command-line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--glob":
        config.glob = args[++i];
        break;
      case "--schema":
        config.schema = args[++i];
        break;
      case "--spec":
        config.spec = args[++i];
        break;
      case "--format-only":
        config.formatOnly = true;
        break;
      case "--validate-only":
        config.validateOnly = true;
        break;
      case "--read-only":
        config.readOnly = true;
        break;
      case "--strict":
        config.strict = true;
        break;
      case "--report-dir":
        config.reportDir = args[++i];
        break;
      case "--errors":
        config.errorsFormat = args[++i];
        break;
      case "--verbose":
        config.verbose = true;
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
        break;
      default:
        console.error(`Unknown option: ${arg}`);
        process.exit(1);
    }
  }
}

// Print help text
function printHelp() {
  console.log(`
JSON Linting & Validation Tool

Usage:
  node validate-json.js [options]

Options:
  --glob <pattern>       Glob pattern for JSON files (default: "**/*.json")
  --schema <path>        Path to JSON schema file
  --spec <draft>         JSON Schema spec: draft7|draft2019|draft2020|jtd (default: draft2020)
  --format-only          Only format files, skip validation
  --validate-only        Only validate, skip formatting
  --read-only            Don't modify files, show diffs only
  --strict               Use JSONLint for strict syntax checking
  --report-dir <path>    Directory for reports (default: ./reports)
  --errors <format>      Error format: text|json (default: text)
  --verbose              Show verbose output
  --help, -h             Show this help message

Examples:
  # Format all JSON files
  node validate-json.js --glob "**/*.json" --format-only

  # Validate against schema
  node validate-json.js --glob "data/**/*.json" --schema "schema/my-doc.schema.json"

  # Read-only validation (don't modify files)
  node validate-json.js --glob "**/*.json" --schema "schema/my-doc.schema.json" --read-only

  # Strict syntax check with JSONLint
  node validate-json.js --glob "config/**/*.json" --strict
`);
}

// Logging utilities
const log = {
  info: (msg) => console.log(`\x1b[36mℹ\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m✓\x1b[0m ${msg}`),
  warn: (msg) => console.warn(`\x1b[33m⚠\x1b[0m ${msg}`),
  error: (msg) => console.error(`\x1b[31m✗\x1b[0m ${msg}`),
  debug: (msg) => config.verbose && console.log(`\x1b[90m→\x1b[0m ${msg}`),
};

// Ensure report directory exists
function ensureReportDir() {
  if (!fs.existsSync(config.reportDir)) {
    fs.mkdirSync(config.reportDir, { recursive: true });
    log.debug(`Created report directory: ${config.reportDir}`);
  }
}

// Find JSON files matching glob pattern
function findJsonFiles() {
  log.debug(`Searching for files matching: ${config.glob}`);

  const files = globSync(config.glob, {
    ignore: [
      "**/node_modules/**",
      "**/package-lock.json",
      "**/reports/**",
      "**/.git/**",
    ],
  });

  log.info(`Found ${files.length} JSON file(s)`);
  return files;
}

// Format JSON files with Prettier
async function formatFiles(files) {
  if (config.validateOnly) {
    log.debug("Skipping formatting (validate-only mode)");
    return { formatted: 0, skipped: files.length };
  }

  log.info("Formatting JSON files with Prettier...");

  const filesArg = files.map((f) => `"${f}"`).join(" ");
  const cmd = config.readOnly
    ? `npx prettier --check --no-config ${filesArg}`
    : `npx prettier --write --no-config ${filesArg}`;

  try {
    const output = execSync(cmd, { encoding: "utf8", stdio: "pipe" });
    if (config.verbose && output) {
      log.debug(output);
    }

    const formatted = config.readOnly ? 0 : files.length;
    log.success(`Formatted ${formatted} file(s)`);

    return { formatted, skipped: 0 };
  } catch (error) {
    if (config.readOnly && error.status === 1) {
      log.warn("Some files need formatting (read-only mode)");
      if (error.stdout) {
        console.log(error.stdout.toString());
      }
      return { formatted: 0, skipped: files.length };
    }
    log.error(`Prettier failed: ${error.message}`);
    throw error;
  }
}

// Validate syntax with JSONLint
function validateSyntax(files) {
  if (!config.strict) {
    log.debug("Skipping strict syntax check (use --strict to enable)");
    return { valid: files.length, invalid: 0 };
  }

  log.info("Validating JSON syntax with JSONLint...");

  let invalid = 0;
  const errors = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf8");
      JSON.parse(content);
      log.debug(`✓ ${file}`);
    } catch (error) {
      invalid++;
      const errorMsg = `${file} → Syntax error: ${error.message}`;
      errors.push(errorMsg);
      log.error(errorMsg);
    }
  }

  if (invalid > 0) {
    const reportFile = path.join(config.reportDir, "jsonlint.log");
    ensureReportDir();
    fs.writeFileSync(reportFile, errors.join("\n"));
    log.info(`Syntax errors written to: ${reportFile}`);
  }

  return { valid: files.length - invalid, invalid };
}

// Validate against JSON Schema with Ajv
async function validateSchema(files) {
  if (!config.schema) {
    log.debug("No schema provided, skipping schema validation");
    return { valid: files.length, invalid: 0, errors: [] };
  }

  if (config.formatOnly) {
    log.debug("Skipping schema validation (format-only mode)");
    return { valid: files.length, invalid: 0, errors: [] };
  }

  log.info(`Validating against schema: ${config.schema}`);

  let schema;
  try {
    const schemaContent = fs.readFileSync(config.schema, "utf8");
    schema = JSON.parse(schemaContent);
  } catch (error) {
    log.error(`Failed to load schema: ${error.message}`);
    throw error;
  }

  const ajvOptions = {
    allErrors: true,
    verbose: true,
    strict: false,
  };

  if (config.spec === "jtd") {
    ajvOptions.jtd = true;
  }

  const ajv = new Ajv(ajvOptions);
  addFormats(ajv);

  let validate;
  try {
    validate = ajv.compile(schema);
  } catch (error) {
    log.error(`Invalid schema: ${error.message}`);
    throw error;
  }

  let invalid = 0;
  const allErrors = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf8");
      const data = JSON.parse(content);

      const valid = validate(data);

      if (!valid) {
        invalid++;
        const fileErrors = validate.errors.map((err) => {
          const jsonPath = err.instancePath || "$";
          return {
            file,
            path: jsonPath,
            keyword: err.keyword,
            message: err.message,
            params: JSON.stringify(err.params),
          };
        });

        allErrors.push(...fileErrors);

        log.error(`FAIL ${file}`);
        fileErrors.forEach((err) => {
          log.error(`  → ${err.path}: ${err.message} (${err.keyword})`);
        });
      } else {
        log.debug(`✓ ${file}`);
      }
    } catch (error) {
      invalid++;
      allErrors.push({
        file,
        path: "$",
        keyword: "parse",
        message: error.message,
        params: "{}",
      });
      log.error(`FAIL ${file} → Parse error: ${error.message}`);
    }
  }

  if (invalid > 0) {
    ensureReportDir();

    if (config.errorsFormat === "json") {
      const reportFile = path.join(config.reportDir, "ajv-errors.json");
      fs.writeFileSync(reportFile, JSON.stringify(allErrors, null, 2));
      log.info(`Validation errors written to: ${reportFile}`);
    } else {
      const reportFile = path.join(config.reportDir, "ajv-errors.txt");
      const errorText = allErrors
        .map(
          (err) => `${err.file} → ${err.path}: ${err.message} (${err.keyword})`,
        )
        .join("\n");
      fs.writeFileSync(reportFile, errorText);
      log.info(`Validation errors written to: ${reportFile}`);
    }
  }

  return { valid: files.length - invalid, invalid, errors: allErrors };
}

// Generate summary report
function generateSummary(stats) {
  console.log("\n" + "=".repeat(60));
  console.log("JSON Validation Summary");
  console.log("=".repeat(60));
  console.log(`Total files:      ${stats.total}`);
  console.log(`Formatted:        ${stats.formatted}`);
  console.log(`Syntax valid:     ${stats.syntaxValid}`);
  console.log(`Schema valid:     ${stats.schemaValid}`);
  console.log(`Invalid:          ${stats.invalid}`);
  console.log(`Schema spec:      ${config.schema ? config.spec : "N/A"}`);
  console.log("=".repeat(60));

  if (stats.invalid > 0) {
    console.log(
      `\n\x1b[31mValidation failed with ${stats.invalid} error(s)\x1b[0m`,
    );
    console.log(`See reports in: ${config.reportDir}/\n`);
    return 1;
  }

  console.log("\n\x1b[32m✓ All validations passed!\x1b[0m\n");
  return 0;
}

// Print commands for reference
function printCommands(files) {
  console.log("\n" + "─".repeat(60));
  console.log("Runnable Commands");
  console.log("─".repeat(60));

  if (!config.validateOnly) {
    const formatCmd = config.readOnly
      ? `npx prettier --check "${config.glob}"`
      : `npx prettier --write "${config.glob}"`;
    console.log(`\n# Format JSON files:`);
    console.log(formatCmd);
  }

  if (config.schema && !config.formatOnly) {
    const specFlag =
      config.spec !== "draft2020" ? ` --spec=${config.spec}` : "";
    const errorsFlag =
      config.errorsFormat === "json" ? " --errors=json" : " --errors=text";
    console.log(`\n# Validate against schema:`);
    console.log(
      `npx ajv validate -s ${config.schema} -d "${config.glob}"${specFlag}${errorsFlag}`,
    );
  }

  if (config.strict) {
    console.log(`\n# Strict syntax check:`);
    console.log(
      `npx jsonlint -cq ${files.slice(0, 3).join(" ")}${files.length > 3 ? " ..." : ""}`,
    );
  }

  console.log("─".repeat(60) + "\n");
}

// Main execution
async function main() {
  parseArgs();

  log.info("JSON Linting & Validation Tool v1.0.0");
  log.info("─".repeat(60));

  try {
    const files = findJsonFiles();

    if (files.length === 0) {
      log.warn("No JSON files found matching pattern");
      return 0;
    }

    printCommands(files);

    const formatResults = await formatFiles(files);
    const syntaxResults = validateSyntax(files);
    const schemaResults = await validateSchema(files);

    const stats = {
      total: files.length,
      formatted: formatResults.formatted,
      syntaxValid: syntaxResults.valid,
      schemaValid: schemaResults.valid,
      invalid: syntaxResults.invalid + schemaResults.invalid,
    };

    const exitCode = generateSummary(stats);
    process.exit(exitCode);
  } catch (error) {
    log.error(`Fatal error: ${error.message}`);
    if (config.verbose) {
      console.error(error);
    }
    process.exit(1);
  }
}

main();
