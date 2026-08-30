#!/usr/bin/env node

/**
 * Generate badge schema from existing workflows
 * Scans .github/workflows/ and creates badge definitions
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const WORKFLOWS_DIR = path.join(process.cwd(), ".github/workflows");
const SCHEMA_PATH = path.join(
  process.cwd(),
  ".github/automation/badges.schema.yml",
);

/**
 * Convert workflow name to display label
 */
function workflowNameToLabel(workflowName) {
  return workflowName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generate workflow badge definition
 */
function generateWorkflowDefinition(workflowName) {
  return {
    label: workflowNameToLabel(workflowName),
    description: `Auto-generated badge for ${workflowName}`,
    branch: "develop",
  };
}

/**
 * Scan workflows directory
 */
function scanWorkflows() {
  if (!fs.existsSync(WORKFLOWS_DIR)) {
    throw new Error(`Workflows directory not found: ${WORKFLOWS_DIR}`);
  }

  const workflows = fs
    .readdirSync(WORKFLOWS_DIR)
    .filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"))
    .map((file) => file.replace(/\.(yml|yaml)$/, ""))
    .sort();

  console.log(`Found ${workflows.length} workflows`);
  return workflows;
}

/**
 * Load existing schema
 */
function loadExistingSchema() {
  if (!fs.existsSync(SCHEMA_PATH)) {
    console.log("No existing schema found, creating new one");
    return null;
  }

  const content = fs.readFileSync(SCHEMA_PATH, "utf-8");
  return load(content);
}

/**
 * Merge workflows with existing schema
 */
function mergeWithExisting(newWorkflows, existingSchema) {
  if (!existingSchema) {
    return null;
  }

  const merged = { ...existingSchema };

  if (!merged.badges) {
    merged.badges = {};
  }

  if (!merged.badges.workflow) {
    merged.badges.workflow = {};
  }

  // Keep existing definitions, add new ones
  newWorkflows.forEach((workflow) => {
    if (!merged.badges.workflow[workflow]) {
      merged.badges.workflow[workflow] = generateWorkflowDefinition(workflow);
    }
  });

  return merged;
}

/**
 * Create new schema from workflows
 */
function createSchema(workflows) {
  const badges = {
    workflow: {},
  };

  // Create workflow badges
  workflows.forEach((workflow) => {
    badges.workflow[workflow] = generateWorkflowDefinition(workflow);
  });

  // Add metadata badges
  badges.meta = {
    license: {
      label: "License",
      description: "License badge from frontmatter",
      color: "blue",
    },
    "file-type": {
      label: "File Type",
      description: "Document file type badge",
      color: "lightgrey",
    },
    status: {
      label: "Status",
      description: "Document status badge",
      color: "yellow",
    },
  };

  // Create basic mapping rules
  const mapping = [
    {
      when: {
        has_front_matter: true,
      },
      add: [
        "workflow.checks",
        "workflow.docs-validation",
        "workflow.gitleaks",
        "workflow.main-branch-guard",
        "workflow.release",
      ],
    },
  ];

  // Create configuration
  const config = {
    repository: "lightspeedwp/.github",
    default_branch: "develop",
    format: "stacked",
    enabled: true,
    markers: {
      start: "<!-- BADGES-START -->",
      end: "<!-- BADGES-END -->",
    },
    validation: {
      validate_links: true,
      validation_frequency: 7,
      report_broken_links: true,
      link_timeout: 10,
    },
    coverage: {
      track_coverage: true,
      target_coverage: 75,
      report_metrics: true,
    },
  };

  return {
    badges,
    mapping,
    config,
  };
}

/**
 * Save schema to file
 */
function saveSchema(schema) {
  const yamlContent = yaml.dump(schema, {
    lineWidth: 100,
    noRefs: true,
  });

  // Add header comment
  const header = `---
# Badge Schema Configuration
# Auto-generated from workflow discovery
# Generated: ${new Date().toISOString()}
# Workflow Count: ${Object.keys(schema.badges.workflow).length}

`;

  const fullContent = header + yamlContent;

  fs.writeFileSync(SCHEMA_PATH, fullContent);
  console.log(`Schema saved to ${SCHEMA_PATH}`);
}

/**
 * Generate and save schema
 */
async function generateSchema() {
  console.log("\n📋 Schema Generation\n");

  try {
    // Scan workflows
    console.log("Step 1: Scanning workflows...");
    const workflows = scanWorkflows();

    // Load existing schema
    console.log("\nStep 2: Checking for existing schema...");
    const existingSchema = loadExistingSchema();

    // Create or merge schema
    console.log("\nStep 3: Creating schema...");
    let schema;

    if (existingSchema) {
      console.log("Merging with existing schema");
      schema = mergeWithExisting(workflows, existingSchema);
    } else {
      console.log("Creating new schema from scratch");
      schema = createSchema(workflows);
    }

    // Save schema
    console.log("\nStep 4: Saving schema...");
    saveSchema(schema);

    // Print summary
    console.log("\n✅ Schema generation complete");
    console.log(`\nSummary:`);
    console.log(`  Workflows: ${Object.keys(schema.badges.workflow).length}`);
    console.log(`  Mapping Rules: ${schema.mapping.length}`);
    console.log(`  Workflow Groups: ${Object.keys(schema.groups).length}`);
    console.log(`  Configuration: Enabled`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run schema generation
generateSchema();
