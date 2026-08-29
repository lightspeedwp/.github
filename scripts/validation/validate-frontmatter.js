#!/usr/bin/env node

/**
 * Frontmatter validation runner covering markdown and YAML files across the repo.
 * Ensures compliance with the shared frontmatter schema.
 *
 * @module scripts/validation/validate-frontmatter
 * @fileoverview Comprehensive frontmatter validation for LightSpeedWP .github repository
 * @see .schemas/frontmatter.schema.json
 * @author LightSpeedWP Team
 * @version 1.0.0
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const glob = require("glob");

// Configuration
const CONFIG = {
  schemaPath: path.join(__dirname, "../../.schemas/frontmatter.schema.json"),
  rootDir: path.join(__dirname, "../.."),
  logDir: path.join(__dirname, "../../logs/validation"),
  outputFile: path.join(
    __dirname,
    "../../logs/validation/frontmatter-validation.log",
  ),
  patterns: [
    "**/*.md",
    "**/*.yml",
    "**/*.yaml",
    ".github/**/*.md",
    ".github/**/*.yml",
    ".github/**/*.yaml",
  ],
  excludePatterns: [
    "node_modules/**",
    ".git/**",
    "coverage/**",
    "logs/**",
    "**/package-lock.json",
  ],
  targetFiles: [],
};

// Logging utility
class Logger {
  constructor(logFile) {
    this.logFile = logFile;
    this.logs = [];

    // Ensure log directory exists
    const logDir = path.dirname(logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(level, message, file = null, details = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      file,
      details,
    };

    this.logs.push(logEntry);

    // Console output with color coding
    const colors = {
      ERROR: "\x1b[31m", // Red
      WARN: "\x1b[33m", // Yellow
      INFO: "\x1b[36m", // Cyan
      SUCCESS: "\x1b[32m", // Green
      RESET: "\x1b[0m",
    };

    const color = colors[level] || colors.RESET;
    const fileInfo = file ? ` [${path.relative(CONFIG.rootDir, file)}]` : "";
    console.log(`${color}[${level}]${colors.RESET} ${message}${fileInfo}`);

    if (details) {
      console.log(`  ${JSON.stringify(details, null, 2)}`);
    }
  }

  error(message, file, details) {
    this.log("ERROR", message, file, details);
  }

  warn(message, file, details) {
    this.log("WARN", message, file, details);
  }

  info(message, file, details) {
    this.log("INFO", message, file, details);
  }

  success(message, file, details) {
    this.log("SUCCESS", message, file, details);
  }

  writeToFile() {
    const logContent = this.logs
      .map(
        (entry) =>
          `[${entry.timestamp}] ${entry.level}: ${entry.message}` +
          (entry.file ? ` [${entry.file}]` : "") +
          (entry.details
            ? `\n  Details: ${JSON.stringify(entry.details)}`
            : ""),
      )
      .join("\n");

    fs.writeFileSync(this.logFile, logContent);
    this.info(`Validation log written to: ${this.logFile}`);
  }
}

// Frontmatter extractor
class FrontmatterExtractor {
  static extract(content, filePath) {
    const yamlFrontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(yamlFrontmatterRegex);

    if (!match) {
      return { frontmatter: null, hasYamlBlock: false };
    }

    try {
      const frontmatter = yaml.load(match[1]);
      return { frontmatter, hasYamlBlock: true };
    } catch (error) {
      throw new Error(
        `Invalid YAML frontmatter in ${filePath}: ${error.message}`,
      );
    }
  }
}

// Validation engine
class FrontmatterValidator {
  constructor(schemaPath, logger) {
    this.logger = logger;
    this.schema = this.loadSchema(schemaPath);
    this.ajv = new Ajv({ allErrors: true, verbose: true, strict: false });
    addFormats(this.ajv);
    this.validate = this.ajv.compile(this.schema);
    this.stats = {
      total: 0,
      validated: 0,
      errors: 0,
      warnings: 0,
      skipped: 0,
    };
  }

  loadSchema(schemaPath) {
    try {
      const schemaContent = fs.readFileSync(schemaPath, "utf8");
      return JSON.parse(schemaContent);
    } catch (error) {
      throw new Error(
        `Failed to load schema from ${schemaPath}: ${error.message}`,
      );
    }
  }

  validateFile(filePath) {
    this.stats.total++;

    try {
      const content = fs.readFileSync(filePath, "utf8");
      const { frontmatter, hasYamlBlock } = FrontmatterExtractor.extract(
        content,
        filePath,
      );

      // Skip files without frontmatter for certain file types
      if (!hasYamlBlock) {
        const shouldHaveFrontmatter = this.shouldHaveFrontmatter(filePath);
        if (shouldHaveFrontmatter) {
          this.logger.warn("Missing frontmatter", filePath, {
            reason:
              "File should have frontmatter according to LightSpeed standards",
            fileType: this.getFileType(filePath),
          });
          this.stats.warnings++;
        } else {
          this.stats.skipped++;
        }
        return;
      }

      // Validate frontmatter against schema
      const isValid = this.validate(frontmatter);

      if (isValid) {
        this.logger.success("Valid frontmatter", filePath);
        this.stats.validated++;
      } else {
        this.logger.error("Invalid frontmatter", filePath, {
          errors: this.validate.errors.map((error) => ({
            instancePath: error.instancePath,
            schemaPath: error.schemaPath,
            keyword: error.keyword,
            params: error.params,
            message: error.message,
          })),
        });
        this.stats.errors++;
      }

      // Additional LightSpeed-specific validations
      this.performLightSpeedValidations(frontmatter, filePath);
    } catch (error) {
      this.logger.error("Validation failed", filePath, {
        error: error.message,
      });
      this.stats.errors++;
    }
  }

  shouldHaveFrontmatter(filePath) {
    // Define file patterns that should have frontmatter
    const shouldHavePatterns = [
      /\.github\/agents\//,
      /\.github\/chatmodes\//,
      /\.github\/instructions\//,
      /\.github\/prompts\//,
      /\.github\/collections\//,
      /\.github\/ISSUE_TEMPLATE\//,
      /\.github\/PULL_REQUEST_TEMPLATE\//,
      /\.github\/DISCUSSION_TEMPLATE\//,
      /\.github\/SAVED_REPLIES\//,
      /README\.md$/,
      /\.github\/[^/]+\.md$/, // Main .github files
    ];

    return shouldHavePatterns.some((pattern) => pattern.test(filePath));
  }

  getFileType(filePath) {
    if (filePath.includes("/agents/") || filePath.includes("/.github/agents/"))
      return "agent";
    if (filePath.includes("/.github/chatmodes/")) return "chatmode";
    if (filePath.includes("/.github/instructions/")) return "instruction";
    if (filePath.includes("/.github/prompts/")) return "prompt";
    if (filePath.includes("/.github/collections/")) return "collection";
    if (filePath.includes("/ISSUE_TEMPLATE/")) return "issue_template";
    if (filePath.includes("/PULL_REQUEST_TEMPLATE/"))
      return "pull_request_template";
    if (filePath.includes("/DISCUSSION_TEMPLATE/"))
      return "discussion_template";
    if (filePath.includes("/SAVED_REPLIES/")) return "saved_reply";
    if (filePath.endsWith("README.md")) return "readme";
    if (filePath.includes("/.github/") && filePath.endsWith(".md"))
      return "documentation";
    return "unknown";
  }

  performLightSpeedValidations(frontmatter, filePath) {
    const fileType = this.getFileType(filePath);

    // Ensure the removed `references` field is not present
    if (
      frontmatter &&
      Object.prototype.hasOwnProperty.call(frontmatter, "references")
    ) {
      this.logger.error(
        "The frontmatter 'references' field has been removed; convert any links to inline citations instead.",
        filePath,
      );
      this.stats.errors++;
    }

    // Check for required fields based on file type
    const requiredFields = this.getRequiredFieldsByType(fileType);
    const missingFields = requiredFields.filter(
      (field) =>
        !Object.prototype.hasOwnProperty.call(frontmatter, field) ||
        frontmatter[field] === null ||
        frontmatter[field] === undefined ||
        frontmatter[field] === "",
    );

    if (missingFields.length > 0) {
      this.logger.warn("Missing required fields", filePath, {
        fileType,
        missingFields,
        recommendation: `Add the following fields: ${missingFields.join(", ")}`,
      });
      this.stats.warnings++;
    }

    // Check for recommended fields
    const recommendedFields = this.getRecommendedFieldsByType(fileType);
    const missingRecommended = recommendedFields.filter(
      (field) => !Object.prototype.hasOwnProperty.call(frontmatter, field),
    );

    if (missingRecommended.length > 0) {
      this.logger.info("Missing recommended fields", filePath, {
        fileType,
        missingRecommended,
        suggestion: `Consider adding: ${missingRecommended.join(", ")}`,
      });
    }
  }

  getRequiredFieldsByType(fileType) {
    const requirements = {
      agent: ["file_type", "name", "description"],
      chatmode: ["file_type", "description"],
      instruction: ["file_type", "description"], // apply_to/applyTo verified separately if present
      prompt: ["file_type", "description"],
      collection: ["file_type", "name", "description"],
      issue_template: ["file_type", "name", "description"],
      pull_request_template: ["file_type", "title"],
      discussion_template: ["file_type", "name", "description"],
      saved_reply: ["file_type", "title"],
      readme: ["file_type", "title", "description"],
      documentation: ["file_type", "description"],
    };

    return requirements[fileType] || ["file_type"];
  }

  getRecommendedFieldsByType(fileType) {
    const recommendations = {
      agent: ["version", "last_updated", "owners", "tags"],
      chatmode: [
        "tools",
        "model",
        "owners",
        "tags",
        "context_window",
        "temperature",
        "max_tokens",
      ],
      instruction: ["owners", "tags", "version"],
      prompt: ["mode", "model", "tools", "tags"],
      collection: ["version", "last_updated", "tags"],
      readme: ["version", "last_updated", "owners", "tags"],
      documentation: ["owners", "tags"],
    };

    return recommendations[fileType] || ["owners", "tags"];
  }

  getStats() {
    return { ...this.stats };
  }
}

// File discovery
class FileDiscovery {
  static findFiles(patterns, excludePatterns, rootDir) {
    const allFiles = [];

    patterns.forEach((pattern) => {
      const files = glob.sync(pattern, {
        cwd: rootDir,
        ignore: excludePatterns,
        absolute: true,
      });
      allFiles.push(...files);
    });

    // Remove duplicates and sort
    return [...new Set(allFiles)].sort();
  }
}

function resolveCliTargetFiles(fileArgs, rootDir) {
  if (!Array.isArray(fileArgs) || fileArgs.length === 0) {
    return [];
  }

  return [
    ...new Set(
      fileArgs.map((filePath) =>
        path.isAbsolute(filePath) ? filePath : path.resolve(rootDir, filePath),
      ),
    ),
  ].filter((filePath) => fs.existsSync(filePath));
}

function runAltValidation() {
  try {
    const schemaContent = fs.readFileSync(CONFIG.schemaPath, "utf8");
    const schema = JSON.parse(schemaContent);
    const files = FileDiscovery.findFiles(
      CONFIG.patterns,
      CONFIG.excludePatterns,
      CONFIG.rootDir,
    );

    console.log("Alt frontmatter validation placeholder.");
    console.log(
      `Schema title: ${schema.title || "unknown"} | Files discovered: ${files.length}`,
    );

    process.exit(0);
  } catch (error) {
    console.error("Alt frontmatter validation failed:", error.message);
    process.exit(1);
  }
}

// Main validation function
async function validateFrontmatter() {
  const logger = new Logger(CONFIG.outputFile);

  logger.info("Starting frontmatter validation", null, {
    schema: CONFIG.schemaPath,
    rootDir: CONFIG.rootDir,
    patterns: CONFIG.patterns,
    excludePatterns: CONFIG.excludePatterns,
    targetFiles: CONFIG.targetFiles,
  });

  try {
    // Initialize validator
    const validator = new FrontmatterValidator(CONFIG.schemaPath, logger);

    // Discover files
    const files =
      CONFIG.targetFiles.length > 0
        ? resolveCliTargetFiles(CONFIG.targetFiles, CONFIG.rootDir)
        : FileDiscovery.findFiles(
            CONFIG.patterns,
            CONFIG.excludePatterns,
            CONFIG.rootDir,
          );

    logger.info(`Found ${files.length} files to validate`);

    // Validate each file
    files.forEach((file) => {
      validator.validateFile(file);
    });

    // Generate summary
    const stats = validator.getStats();
    logger.info("Validation completed", null, stats);

    // Write log file
    logger.writeToFile();

    // Exit with appropriate code
    const hasErrors = stats.errors > 0;
    process.exit(hasErrors ? 1 : 0);
  } catch (error) {
    logger.error("Validation failed", null, { error: error.message });
    logger.writeToFile();
    process.exit(1);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  const altMode = args.includes("--alt");

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Frontmatter Validation Script

Usage: node validate-frontmatter.js [options]

Options:
  --help, -h     Show this help message
  --schema PATH  Custom schema file path
  --root PATH    Custom root directory
  --output PATH  Custom output log file

Examples:
  node validate-frontmatter.js
  node validate-frontmatter.js --schema ./custom-schema.json
  node validate-frontmatter.js --root /path/to/repo --output ./validation.log
    `);
    process.exit(0);
  }

  // Parse command line arguments
  const schemaIndex = args.indexOf("--schema");
  if (schemaIndex !== -1 && args[schemaIndex + 1]) {
    CONFIG.schemaPath = path.resolve(args[schemaIndex + 1]);
  }

  const rootIndex = args.indexOf("--root");
  if (rootIndex !== -1 && args[rootIndex + 1]) {
    CONFIG.rootDir = path.resolve(args[rootIndex + 1]);
  }

  const outputIndex = args.indexOf("--output");
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    CONFIG.outputFile = path.resolve(args[outputIndex + 1]);
  }

  const knownOptionIndices = new Set();
  for (let i = 0; i < args.length; i++) {
    if (
      args[i] === "--schema" ||
      args[i] === "--root" ||
      args[i] === "--output"
    ) {
      knownOptionIndices.add(i);
      knownOptionIndices.add(i + 1);
    } else if (
      args[i] === "--help" ||
      args[i] === "-h" ||
      args[i] === "--alt"
    ) {
      knownOptionIndices.add(i);
    }
  }
  CONFIG.targetFiles = args.filter(
    (_, index) => !knownOptionIndices.has(index),
  );

  if (altMode) {
    runAltValidation();
  } else {
    validateFrontmatter();
  }
}

module.exports = {
  FrontmatterValidator,
  FrontmatterExtractor,
  FileDiscovery,
  Logger,
  CONFIG,
  resolveCliTargetFiles,
};
