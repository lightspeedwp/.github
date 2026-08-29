#!/usr/bin/env node
/**
 * Validates agent specs against the agent frontmatter schema and organisational rules.
 *
 * Usage:
 *   node scripts/validate-agents.js                    # Validate all agents
 *   node scripts/validate-agents.js labeling           # Validate specific agent
 *   node scripts/validate-agents.js --json             # Output JSON format
 *
 * @module scripts/validation/validate-agents
 * @see agents/agent.md
 */

import fs from "fs";
import path from "path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { load } from "js-yaml";
import { fileURLToPath } from "url";
import { globSync } from "glob";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "../..");
const AGENT_DIRS = [
  path.join(REPO_ROOT, "agents"),
  path.join(REPO_ROOT, ".github", "agents"),
].filter((dir) => fs.existsSync(dir));
const SCHEMAS_DIR = path.join(REPO_ROOT, ".schemas");
const WORKFLOWS_DIR = path.join(REPO_ROOT, ".github", "workflows");

// Configuration
const args = process.argv.slice(2);
const targetAgent = args.find((a) => !a.startsWith("--"));
const outputJson = args.includes("--json");
const verbose = args.includes("--verbose");

// Initialize Ajv validator
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Results tracking
const results = {
  total: 0,
  valid: 0,
  invalid: 0,
  skipped: 0,
  warnings: 0,
  errors: [],
  agents: {},
};

/**
 * Load JSON schema
 */
function loadSchema(schemaPath) {
  try {
    const content = fs.readFileSync(schemaPath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error(`Failed to load schema: ${schemaPath}`);
    console.error(err.message);
    process.exit(1);
  }
}

/**
 * Extract frontmatter from agent file
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return null;
  }
  try {
    return load(match[1]);
  } catch (err) {
    return { error: `Failed to parse YAML: ${err.message}` };
  }
}

/**
 * Validate agent file
 */
function validateAgent(filePath) {
  const fileName = path.basename(filePath);
  const agentName = fileName.replace(/\.agent\.md$/, "").replace(/\.md$/, "");

  results.total++;

  // Read file
  let content;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    results.invalid++;
    results.errors.push(`[${agentName}] Cannot read file: ${err.message}`);
    results.agents[agentName] = { valid: false, errors: [err.message] };
    return;
  }

  // Extract frontmatter
  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) {
    results.invalid++;
    results.errors.push(`[${agentName}] No frontmatter found`);
    results.agents[agentName] = {
      valid: false,
      errors: ["No frontmatter found"],
    };
    return;
  }

  if (frontmatter.error) {
    results.invalid++;
    results.errors.push(`[${agentName}] ${frontmatter.error}`);
    results.agents[agentName] = { valid: false, errors: [frontmatter.error] };
    return;
  }

  if (frontmatter.file_type && frontmatter.file_type !== "agent") {
    results.skipped++;
    results.agents[agentName] = {
      valid: true,
      skipped: true,
      frontmatter,
      errors: [],
      warnings: [`Skipped file_type=${frontmatter.file_type}`],
    };
    return;
  }

  // Validate against schema
  const schema = loadSchema(path.join(SCHEMAS_DIR, "frontmatter.schema.json"));
  const validate = ajv.compile(schema);
  const valid = validate(frontmatter);

  const agentResult = {
    valid,
    frontmatter,
    errors: [],
    warnings: [],
  };

  if (!valid) {
    results.invalid++;
    agentResult.errors = validate.errors.map(
      (e) => `${e.dataPath || "root"}: ${e.message}`,
    );
    results.errors.push(
      `[${agentName}] Schema validation failed: ${agentResult.errors.join("; ")}`,
    );
  } else {
    results.valid++;
  }

  // Additional validations
  validateTools(agentName, frontmatter, agentResult);
  validateHandoffs(agentName, frontmatter, agentResult);

  if (agentResult.warnings.length > 0) {
    results.warnings += agentResult.warnings.length;
  }

  results.agents[agentName] = agentResult;
}

/**
 * Validate tools
 */
function validateTools(agentName, frontmatter, result) {
  if (!frontmatter.tools) {
    result.warnings.push("No tools specified (will default to all available)");
    return;
  }

  const validTools = [
    "shell",
    "bash",
    "powershell",
    "read",
    "edit",
    "write",
    "search",
    "grep",
    "glob",
    "custom-agent",
    "task",
    "web",
    "websearch",
    "webfetch",
    "todo",
    "todowrite",
  ];

  if (typeof frontmatter.tools === "string") {
    if (frontmatter.tools !== "*") {
      result.warnings.push(`Invalid tool string: ${frontmatter.tools}`);
    }
  } else if (Array.isArray(frontmatter.tools)) {
    for (const tool of frontmatter.tools) {
      if (!validTools.includes(tool) && !tool.includes("/") && tool !== "*") {
        result.warnings.push(`Unknown tool: ${tool}`);
      }
    }
  }
}

/**
 * Validate handoffs
 */
function validateHandoffs(agentName, frontmatter, result) {
  if (!frontmatter.handoffs || !Array.isArray(frontmatter.handoffs)) {
    return;
  }

  for (const handoff of frontmatter.handoffs) {
    if (!handoff.agent) {
      result.errors.push("Handoff missing agent name");
      continue;
    }

    // Check for circular dependencies
    if (handoff.agent === agentName) {
      result.errors.push(`Circular handoff: ${agentName} hands off to itself`);
    }

    // Verify target agent exists
    const agentFile = findAgentFileByName(handoff.agent);
    if (!agentFile) {
      result.warnings.push(`Handoff target not found: ${handoff.agent}`);
    }
  }
}

/**
 * Find an agent file by base agent name across active agent directories.
 */
function findAgentFileByName(agentName) {
  for (const dir of AGENT_DIRS) {
    const agentFile = path.join(dir, `${agentName}.agent.md`);
    if (fs.existsSync(agentFile)) {
      return agentFile;
    }
  }
  return null;
}

/**
 * Find all agent files
 */
function findAgentFiles() {
  if (targetAgent) {
    const agentFile = findAgentFileByName(targetAgent);
    if (!agentFile) {
      console.error(`Agent not found: ${targetAgent}`);
      process.exit(1);
    }
    return [agentFile];
  }

  return AGENT_DIRS.flatMap((dir) => globSync(path.join(dir, "*.agent.md")));
}

/**
 * Generate report
 */
function generateReport() {
  if (outputJson) {
    console.log(JSON.stringify(results, null, 2));
    if (results.invalid > 0) {
      process.exit(1);
    }
    return;
  }

  console.log(
    "\n╔════════════════════════════════════════════════════════════╗",
  );
  console.log("║         Agent Frontmatter Validation Report               ║");
  console.log(
    "╚════════════════════════════════════════════════════════════╝\n",
  );

  console.log(`Total agents:    ${results.total}`);
  console.log(`Valid:           ${results.valid} ✓`);
  console.log(`Invalid:         ${results.invalid} ✗`);
  console.log(`Skipped:         ${results.skipped}`);
  console.log(`Warnings:        ${results.warnings} ⚠`);

  if (results.errors.length > 0) {
    console.log("\n📋 ERRORS:\n");
    results.errors.forEach((err) => console.log(`  • ${err}`));
  }

  if (!outputJson) {
    console.log("\n📊 AGENT DETAILS:\n");
    for (const [agentName, agentResult] of Object.entries(results.agents)) {
      const status = agentResult.valid ? "✓ VALID" : "✗ INVALID";
      console.log(`  ${agentName}: ${status}`);

      if (verbose && agentResult.errors.length > 0) {
        agentResult.errors.forEach((err) => console.log(`    • ${err}`));
      }

      if (verbose && agentResult.warnings.length > 0) {
        agentResult.warnings.forEach((warn) => console.log(`    ⚠ ${warn}`));
      }
    }
  }

  console.log("\n");

  // Exit with appropriate code
  if (results.invalid > 0) {
    process.exit(1);
  }
}

/**
 * Main execution
 */
function main() {
  if (verbose) {
    console.log(`Validating agents in: ${AGENT_DIRS.join(", ")}\n`);
  }

  const agentFiles = findAgentFiles();

  if (agentFiles.length === 0) {
    console.error("No agent files found");
    process.exit(1);
  }

  for (const file of agentFiles) {
    validateAgent(file);
  }

  generateReport();
}

main();
