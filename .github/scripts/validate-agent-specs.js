#!/usr/bin/env node

/**
 * Agent Specification Validation Script - Phase 3
 *
 * Validates cross-references between agent .agent.md spec files and
 * their implementation folders, ensuring consistency and completeness.
 */

import fs from "fs";
import path from "path";
import url from "url";
import * as YAML from "js-yaml";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Configuration
const AGENTS_DIR = path.join(__dirname, "../../agents");
const SPEC_EXTENSION = ".agent.md";

// Results collection
const results = {
  agents: [],
  summary: {
    totalDirectories: 0,
    totalSpecFiles: 0,
    specsWithValidReferences: 0,
    specsMissingReferences: 0,
    directoryMissingSpec: 0,
    consistencyIssues: [],
    metadataIssues: [],
  },
};

/**
 * Parse frontmatter from markdown file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return YAML.load(match[1]);
  } catch (e) {
    return null;
  }
}

/**
 * Normalize agent names for comparison
 */
function normalizeAgentName(name) {
  return name
    .replace(/^agents\//, "")
    .replace(/\.agent\.md$/, "")
    .replace(/-agent$/, "")
    .toLowerCase()
    .replace(/-/g, "_");
}

/**
 * Check if a directory exists
 */
function directoryExists(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if entry point files exist in implementation directory
 */
function checkEntryPoints(implementationDir) {
  const entryPoints = [
    "AGENT.md",
    "README.md",
    "SKILL.md",
    "index.js",
    "index.ts",
  ];
  const found = [];

  for (const entry of entryPoints) {
    const fullPath = path.join(implementationDir, entry);
    if (fs.existsSync(fullPath)) {
      found.push(entry);
    }
  }

  return found;
}

/**
 * Validate spec file frontmatter
 */
function validateFrontmatter(frontmatter, specFile) {
  const issues = [];
  const required = [
    "name",
    "description",
    "file_type",
    "category",
    "status",
    "version",
    "created_date",
    "last_updated",
    "author",
    "implementation",
  ];

  for (const field of required) {
    if (!frontmatter[field]) {
      issues.push(`Missing required field: ${field}`);
    }
  }

  // Check date formats
  if (frontmatter.created_date && !isValidDate(frontmatter.created_date)) {
    issues.push(`Invalid created_date format: ${frontmatter.created_date}`);
  }
  if (frontmatter.last_updated && !isValidDate(frontmatter.last_updated)) {
    issues.push(`Invalid last_updated format: ${frontmatter.last_updated}`);
  }

  return issues;
}

/**
 * Check if string is valid date (YYYY-MM-DD)
 */
function isValidDate(dateStr) {
  if (typeof dateStr !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

/**
 * Get all agent directories
 */
function getAgentDirectories() {
  const entries = fs.readdirSync(AGENTS_DIR);
  const dirs = {};

  for (const entry of entries) {
    const fullPath = path.join(AGENTS_DIR, entry);
    if (directoryExists(fullPath) && !entry.startsWith(".")) {
      dirs[entry] = fullPath;
    }
  }

  return dirs;
}

/**
 * Get all spec files
 */
function getSpecFiles() {
  const entries = fs.readdirSync(AGENTS_DIR);
  const specs = {};

  for (const entry of entries) {
    if (entry.endsWith(SPEC_EXTENSION)) {
      const name = entry.replace(SPEC_EXTENSION, "");
      specs[name] = path.join(AGENTS_DIR, entry);
    }
  }

  return specs;
}

/**
 * Main validation function
 */
function validate() {
  console.log("Starting Agent Specification Validation...\n");

  const directories = getAgentDirectories();
  const specs = getSpecFiles();

  results.summary.totalDirectories = Object.keys(directories).length;
  results.summary.totalSpecFiles = Object.keys(specs).length;

  console.log(`Found ${results.summary.totalDirectories} agent directories`);
  console.log(`Found ${results.summary.totalSpecFiles} spec files\n`);

  const processedSpecs = new Set();

  // Process each spec file
  console.log("Validating spec files...\n");
  for (const [specName, specPath] of Object.entries(specs)) {
    processedSpecs.add(specName);
    const specContent = fs.readFileSync(specPath, "utf8");
    const frontmatter = parseFrontmatter(specContent);

    const agentRecord = {
      specFile: specName + SPEC_EXTENSION,
      specPath: specPath,
      implementationPath: null,
      implementationExists: false,
      entryPoints: [],
      frontmatterValid: false,
      frontmatterIssues: [],
      referenceResolved: false,
    };

    // Validate frontmatter
    if (frontmatter) {
      agentRecord.frontmatterValid = true;
      agentRecord.frontmatterIssues = validateFrontmatter(
        frontmatter,
        specPath,
      );

      // Check implementation reference
      if (frontmatter.implementation) {
        const implPath = path.join(AGENTS_DIR, frontmatter.implementation);
        if (directoryExists(implPath)) {
          agentRecord.implementationPath = frontmatter.implementation;
          agentRecord.implementationExists = true;
          agentRecord.entryPoints = checkEntryPoints(implPath);
          agentRecord.referenceResolved = true;
          results.summary.specsWithValidReferences++;
        } else {
          agentRecord.implementationPath = frontmatter.implementation;
          agentRecord.referenceResolved = false;
          results.summary.specsMissingReferences++;
        }
      } else {
        results.summary.specsMissingReferences++;
        agentRecord.frontmatterIssues.push("Missing implementation field");
      }
    } else {
      agentRecord.frontmatterIssues.push("Could not parse frontmatter");
      results.summary.specsMissingReferences++;
    }

    if (agentRecord.frontmatterIssues.length > 0) {
      results.summary.metadataIssues.push({
        file: agentRecord.specFile,
        issues: agentRecord.frontmatterIssues,
      });
    }

    results.agents.push(agentRecord);
  }

  // Check for directories without specs
  console.log("Checking for directories without spec files...\n");
  for (const [dirName, dirPath] of Object.entries(directories)) {
    // Try to find matching spec
    let foundSpec = false;

    // Direct match
    if (specs[dirName]) {
      foundSpec = true;
    } else {
      // Try normalized matches
      const normalized = normalizeAgentName(dirName);
      for (const specName of Object.keys(specs)) {
        if (normalizeAgentName(specName) === normalized) {
          foundSpec = true;
          break;
        }
      }
    }

    if (!foundSpec) {
      results.summary.directoryMissingSpec++;
      results.agents.push({
        directory: dirName,
        directoryPath: dirPath,
        specFile: null,
        issue: "No corresponding spec file found",
        entryPoints: checkEntryPoints(dirPath),
      });
    }
  }

  // Report results
  reportResults();
}

/**
 * Generate report
 */
function reportResults() {
  console.log(
    "\n═══════════════════════════════════════════════════════════\n",
  );
  console.log("VALIDATION SUMMARY");
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log(`Total Agent Directories: ${results.summary.totalDirectories}`);
  console.log(`Total Spec Files: ${results.summary.totalSpecFiles}`);
  console.log(
    `Specs with Valid References: ${results.summary.specsWithValidReferences}`,
  );
  console.log(
    `Specs Missing References: ${results.summary.specsMissingReferences}`,
  );
  console.log(
    `Directories Missing Specs: ${results.summary.directoryMissingSpec}\n`,
  );

  // Detailed findings
  if (results.summary.specsMissingReferences > 0) {
    console.log("\n⚠️  MISSING IMPLEMENTATION REFERENCES:\n");
    const missing = results.agents.filter(
      (a) => !a.referenceResolved && a.specFile,
    );
    for (const agent of missing) {
      console.log(`  • ${agent.specFile}`);
      if (agent.frontmatterIssues.length > 0) {
        console.log(`    Issues: ${agent.frontmatterIssues.join(", ")}`);
      }
    }
  }

  if (results.summary.directoryMissingSpec > 0) {
    console.log("\n⚠️  DIRECTORIES WITHOUT SPEC FILES:\n");
    const missingSpecs = results.agents.filter(
      (a) => a.directory && !a.specFile,
    );
    for (const agent of missingSpecs) {
      console.log(`  • ${agent.directory}/`);
      if (agent.entryPoints.length > 0) {
        console.log(`    Entry points: ${agent.entryPoints.join(", ")}`);
      }
    }
  }

  if (results.summary.metadataIssues.length > 0) {
    console.log("\n⚠️  METADATA ISSUES:\n");
    for (const issue of results.summary.metadataIssues) {
      console.log(`  • ${issue.file}`);
      for (const problem of issue.issues) {
        console.log(`    - ${problem}`);
      }
    }
  }

  console.log(
    "\n═══════════════════════════════════════════════════════════\n",
  );

  // Output JSON for further processing
  const outputPath = path.join(
    __dirname,
    "../../.github/reports/audit/agent-specs-phase3-validation.json",
  );
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`✅ Validation results saved to: ${outputPath}\n`);
}

// Run validation
try {
  validate();
} catch (error) {
  console.error("Validation failed:", error);
  process.exit(1);
}
