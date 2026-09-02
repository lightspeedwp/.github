#!/usr/bin/env node

/**
 * Agent Specification Generator CLI
 *
 * Interactive tool to scaffold new agent specifications.
 * Usage: npm run create:agent
 * Usage: npm run create:agent -- --category governance
 * Usage: npm run create:agent -- --batch agents.json
 *
 * @module scripts/create-agent-spec
 */

import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Configuration
const AGENTS_DIR = path.join(__dirname, "../agents");
const TEMPLATE_PATH = path.join(__dirname, "templates/agent.template.md");
const VALID_CATEGORIES = [
  "governance",
  "automation",
  "planning",
  "tooling",
  "integration",
  "mode",
  "analysis",
  "infrastructure",
  "data",
  "communication",
];
const VALID_STATUSES = ["active", "draft", "deprecated"];
const DEFAULT_VERSION = "v1.0";

/**
 * Parse command-line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    category: null,
    batchFile: null,
    help: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--category" && args[i + 1]) {
      result.category = args[++i];
    } else if (args[i] === "--batch" && args[i + 1]) {
      result.batchFile = args[++i];
    } else if (args[i] === "--help" || args[i] === "-h") {
      result.help = true;
    } else if (args[i] === "--verbose" || args[i] === "-v") {
      result.verbose = true;
    }
  }

  return result;
}

/**
 * Print help message
 */
function printHelp() {
  console.log(`
Agent Specification Generator CLI

Usage:
  npm run create:agent [options]

Options:
  --category <name>    Pre-fill category (governance, automation, planning, tooling, integration, mode, analysis, infrastructure, data, communication)
  --batch <file>       Generate multiple agents from JSON file
  --verbose            Show detailed output
  --help               Show this help message

Examples:
  npm run create:agent
  npm run create:agent -- --category governance
  npm run create:agent -- --batch agents.json

Batch File Format (agents.json):
[
  {
    "name": "Agent Name",
    "description": "Agent description",
    "category": "governance",
    "author": "Your Name",
    "implementation": "agents/agent-name/",
    "purpose": "What this agent does"
  }
]
`);
}

/**
 * Validate agent name (kebab-case)
 */
function validateAgentName(name) {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "Agent name cannot be empty" };
  }

  const trimmed = name.trim();

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Agent name must be lowercase kebab-case (e.g., "my-agent")',
    };
  }

  if (trimmed.length < 3) {
    return { valid: false, error: "Agent name must be at least 3 characters" };
  }

  if (trimmed.length > 50) {
    return {
      valid: false,
      error: "Agent name must be no more than 50 characters",
    };
  }

  const agentPath = path.join(AGENTS_DIR, `${trimmed}.agent.md`);
  if (fs.existsSync(agentPath)) {
    return { valid: false, error: `Agent "${trimmed}" already exists` };
  }

  return { valid: true };
}

/**
 * Validate description
 */
function validateDescription(desc) {
  if (!desc || desc.trim().length === 0) {
    return { valid: false, error: "Description cannot be empty" };
  }

  if (desc.trim().length < 10) {
    return {
      valid: false,
      error: "Description must be at least 10 characters",
    };
  }

  if (desc.trim().length > 200) {
    return {
      valid: false,
      error: "Description must be no more than 200 characters",
    };
  }

  return { valid: true };
}

/**
 * Validate category
 */
function validateCategory(category) {
  if (!VALID_CATEGORIES.includes(category)) {
    return {
      valid: false,
      error: `Invalid category. Choose from: ${VALID_CATEGORIES.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Validate status
 */
function validateStatus(status) {
  if (!VALID_STATUSES.includes(status)) {
    return {
      valid: false,
      error: `Invalid status. Choose from: ${VALID_STATUSES.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Validate author name
 */
function validateAuthor(author) {
  if (!author || author.trim().length === 0) {
    return { valid: false, error: "Author cannot be empty" };
  }

  if (author.trim().length < 2) {
    return { valid: false, error: "Author name must be at least 2 characters" };
  }

  return { valid: true };
}

/**
 * Validate version format (semantic versioning)
 */
function validateVersion(version) {
  if (!version || version.trim().length === 0) {
    return { valid: false, error: "Version cannot be empty" };
  }

  if (!/^v?\d+\.\d+\.\d+(?:-[a-z0-9]+)?$/.test(version.trim())) {
    return {
      valid: false,
      error: 'Version must be in semantic format (e.g., "v1.0.0" or "1.0.0")',
    };
  }

  return { valid: true };
}

/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Interactive prompt for user input
 */
async function prompt(question, defaultValue = null, validator = null) {
  const { createInterface } = await import("readline");
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const promptText = defaultValue
      ? `${question} [${defaultValue}]: `
      : `${question}: `;

    rl.question(promptText, (answer) => {
      rl.close();
      const value = answer.trim() || defaultValue;

      if (validator) {
        const result = validator(value);
        if (!result.valid) {
          console.error(`❌ ${result.error}`);
          resolve(null);
          return;
        }
      }

      resolve(value);
    });
  });
}

/**
 * Interactive flow to gather agent specification details
 */
async function gatherAgentDetails(prefilledCategory = null) {
  console.log("\n🚀 Agent Specification Generator\n");
  console.log(
    "Answer the following questions to create your agent specification.\n",
  );

  // Agent name
  let agentName = null;
  while (!agentName) {
    agentName = await prompt(
      "Agent name (kebab-case, e.g., 'my-agent')",
      null,
      validateAgentName,
    );
  }

  // Display name (for markdown)
  const displayName =
    agentName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") + " Agent";

  // Description
  let description = null;
  while (!description) {
    description = await prompt(
      "Short description (10-200 characters)",
      null,
      validateDescription,
    );
  }

  // Category
  let category = prefilledCategory;
  if (!category || !VALID_CATEGORIES.includes(category)) {
    console.log(`\nValid categories: ${VALID_CATEGORIES.join(", ")}`);
    while (!category) {
      category = await prompt("Category", "automation", validateCategory);
    }
  } else {
    console.log(`Category: ${category} (pre-filled)`);
  }

  // Status
  let status = null;
  console.log(`\nValid statuses: ${VALID_STATUSES.join(", ")}`);
  while (!status) {
    status = await prompt("Status", "draft", validateStatus);
  }

  // Version
  let version = null;
  while (!version) {
    version = await prompt("Version", DEFAULT_VERSION, validateVersion);
  }

  // Author
  let author = null;
  while (!author) {
    author = await prompt("Author name", "LightSpeed Team", validateAuthor);
  }

  // Purpose
  let purpose = null;
  while (!purpose) {
    purpose = await prompt(
      "Purpose description (2-3 sentences)",
      null,
      (val) =>
        val.length > 0
          ? { valid: true }
          : { valid: false, error: "Purpose cannot be empty" },
    );
  }

  // Implementation directory
  const implementationDir = `agents/${agentName}/`;
  console.log(`Implementation directory: ${implementationDir}`);

  const createdDate = getCurrentDate();
  const lastUpdated = getCurrentDate();

  return {
    agentName,
    displayName,
    description,
    category,
    status,
    version,
    author,
    purpose,
    implementationDir,
    createdDate,
    lastUpdated,
  };
}

/**
 * Generate spec file content from template and values
 */
function generateSpecContent(details) {
  let content = fs.readFileSync(TEMPLATE_PATH, "utf-8");

  const replacements = {
    "{{NAME}}": details.agentName,
    "{{DISPLAY_NAME}}": details.displayName,
    "{{DESCRIPTION}}": details.description,
    "{{CATEGORY}}": details.category,
    "{{STATUS}}": details.status,
    "{{VERSION}}": details.version,
    "{{CREATED_DATE}}": details.createdDate,
    "{{LAST_UPDATED}}": details.lastUpdated,
    "{{AUTHOR}}": details.author,
    "{{IMPLEMENTATION}}": details.implementationDir,
    "{{IMPLEMENTATION_DIR}}": details.implementationDir.replace(/\/$/, ""),
    "{{PURPOSE}}": details.purpose,
  };

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key, "g"), value);
  }

  return content;
}

/**
 * Write spec file to disk
 */
function writeSpecFile(details, content) {
  const specFilePath = path.join(AGENTS_DIR, `${details.agentName}.agent.md`);
  fs.writeFileSync(specFilePath, content, "utf-8");
  return specFilePath;
}

/**
 * Create directory structure for implementation
 */
function createImplementationDirectory(details) {
  const implPath = path.join(__dirname, "..", details.implementationDir);

  if (!fs.existsSync(implPath)) {
    fs.mkdirSync(implPath, { recursive: true });

    // Create basic entry files
    const skillMdPath = path.join(implPath, "SKILL.md");
    const readmePath = path.join(implPath, "README.md");

    fs.writeFileSync(
      skillMdPath,
      `# ${details.displayName}\n\n${details.description}\n`,
      "utf-8",
    );

    fs.writeFileSync(
      readmePath,
      `# ${details.displayName} Implementation\n\nImplementation details coming soon.\n`,
      "utf-8",
    );

    return true;
  }

  return false;
}

/**
 * Process batch file for bulk generation
 */
async function processBatchFile(batchFilePath) {
  if (!fs.existsSync(batchFilePath)) {
    console.error(`❌ Batch file not found: ${batchFilePath}`);
    process.exit(1);
  }

  const batchContent = fs.readFileSync(batchFilePath, "utf-8");
  let agents;

  try {
    agents = JSON.parse(batchContent);
  } catch (error) {
    console.error(`❌ Invalid JSON in batch file: ${error.message}`);
    process.exit(1);
  }

  if (!Array.isArray(agents)) {
    console.error(
      "❌ Batch file must contain an array of agent specifications",
    );
    process.exit(1);
  }

  console.log(`\n📋 Processing ${agents.length} agents from batch file...\n`);

  let successful = 0;
  let failed = 0;

  for (const agent of agents) {
    // Construct details from batch entry
    const details = {
      agentName: agent.name.toLowerCase().replace(/\s+/g, "-"),
      displayName: agent.name,
      description: agent.description,
      category: agent.category || "automation",
      status: agent.status || "draft",
      version: agent.version || DEFAULT_VERSION,
      author: agent.author || "LightSpeed Team",
      purpose: agent.purpose || agent.description,
      implementationDir:
        agent.implementation ||
        `agents/${agent.name.toLowerCase().replace(/\s+/g, "-")}/`,
      createdDate: getCurrentDate(),
      lastUpdated: getCurrentDate(),
    };

    // Validate details
    const nameValidation = validateAgentName(details.agentName);
    const categoryValidation = validateCategory(details.category);

    if (!nameValidation.valid) {
      console.error(`❌ ${agent.name}: ${nameValidation.error}`);
      failed++;
      continue;
    }

    if (!categoryValidation.valid) {
      console.error(`❌ ${agent.name}: ${categoryValidation.error}`);
      failed++;
      continue;
    }

    try {
      const content = generateSpecContent(details);
      writeSpecFile(details, content);
      createImplementationDirectory(details);

      console.log(`✅ Created: ${details.agentName}`);
      successful++;
    } catch (error) {
      console.error(`❌ ${agent.name}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${successful} successful, ${failed} failed\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

/**
 * Main entry point
 */
async function main() {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  if (options.batchFile) {
    await processBatchFile(options.batchFile);
    return;
  }

  // Interactive mode
  const details = await gatherAgentDetails(options.category);

  if (!details) {
    console.error("\n❌ Specification generation cancelled");
    process.exit(1);
  }

  console.log("\n📝 Generating specification...\n");

  const content = generateSpecContent(details);
  const specPath = writeSpecFile(details, content);

  console.log(`✅ Spec file created: ${specPath}`);

  // Create implementation directory
  const dirCreated = createImplementationDirectory(details);
  if (dirCreated) {
    console.log(
      `✅ Implementation directory created: ${details.implementationDir}`,
    );
  }

  console.log("\n✨ Agent specification generated successfully!\n");
  console.log("📋 Next steps:");
  console.log(`   1. Review the generated spec at: ${specPath}`);
  console.log(
    `   2. Add implementation files to: ${details.implementationDir}`,
  );
  console.log(`   3. Run validation: npm run validate:agent-specs`);
  console.log(`   4. Commit and push to your branch\n`);
}

// Run main
main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
