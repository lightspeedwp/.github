#!/usr/bin/env node

/**
 * Validates workflow organization to prevent duplicates and ensure correct placement.
 *
 * Rules:
 * 1. No workflow file should exist in both workflows/ and .github/workflows/
 * 2. Workflows in workflows/ should use `on: workflow_call` (reusable)
 * 3. Workflows in .github/workflows/ should have trigger conditions (push, pull_request, schedule, etc.)
 */

import fs from "fs";
import path from "path";
import { load } from "js-yaml";

const CONTROL_PLANE_DIR = ".github/workflows";
const REUSABLE_DIR = "workflows";

let errors = [];
let warnings = [];

// Read all workflow files
function getWorkflowFiles(dir) {
  if (!fs.existsSync(dir)) {
    return {};
  }

  const files = {};
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    if (item.endsWith(".yml") || item.endsWith(".yaml")) {
      try {
        const content = fs.readFileSync(itemPath, "utf8");
        files[item] = { path: itemPath, content };
      } catch (err) {
        warnings.push(`⚠️  Could not read ${itemPath}: ${err.message}`);
      }
    }
  }

  return files;
}

// Parse YAML workflow content
function parseWorkflow(content) {
  try {
    return load(content);
  } catch (err) {
    return null;
  }
}

// Check for duplicates
function checkDuplicates() {
  const controlPlaneFiles = getWorkflowFiles(CONTROL_PLANE_DIR);
  const reusableFiles = getWorkflowFiles(REUSABLE_DIR);

  for (const filename in reusableFiles) {
    if (filename in controlPlaneFiles) {
      errors.push(
        `❌ Duplicate workflow: ${filename}\n` +
          `   - Root:       ${reusableFiles[filename].path}\n` +
          `   - Control:    ${controlPlaneFiles[filename].path}\n` +
          `   Action: Remove the duplicate file or clarify which is canonical.`,
      );
    }
  }
}

// Check workflow trigger types
function checkTriggerTypes() {
  const reusableFiles = getWorkflowFiles(REUSABLE_DIR);

  for (const filename in reusableFiles) {
    const workflow = parseWorkflow(reusableFiles[filename].content);
    if (!workflow) continue;

    const { on: triggers } = workflow;
    if (!triggers) {
      warnings.push(`⚠️  ${filename}: No 'on' trigger defined`);
      continue;
    }

    // Reusable workflows should have workflow_call
    if (typeof triggers === "object" && "workflow_call" in triggers) {
      // OK - this is a reusable workflow
    } else if (typeof triggers === "string" && triggers === "workflow_call") {
      // OK - this is a reusable workflow
    } else {
      // Not a reusable workflow in the reusable directory
      const triggerKeys =
        typeof triggers === "object" ? Object.keys(triggers) : [triggers];
      warnings.push(
        `⚠️  ${filename} in workflows/ doesn't use 'workflow_call'.\n` +
          `   This may indicate it's control-plane specific and should be in .github/workflows/\n` +
          `   Current triggers: ${triggerKeys.join(", ")}`,
      );
    }
  }

  // Check control plane workflows
  const controlPlaneFiles = getWorkflowFiles(CONTROL_PLANE_DIR);
  for (const filename in controlPlaneFiles) {
    const workflow = parseWorkflow(controlPlaneFiles[filename].content);
    if (!workflow) continue;

    const { on: triggers } = workflow;
    if (!triggers) {
      errors.push(`❌ ${filename}: No 'on' trigger defined`);
      continue;
    }

    // Control plane workflows should NOT be workflow_call only
    if (typeof triggers === "string" && triggers === "workflow_call") {
      errors.push(
        `❌ ${filename} in .github/workflows/ uses only 'workflow_call'.\n` +
          `   This should be in workflows/ instead.`,
      );
    } else if (
      typeof triggers === "object" &&
      Object.keys(triggers).length === 1 &&
      "workflow_call" in triggers
    ) {
      warnings.push(
        `⚠️  ${filename} in .github/workflows/ is only callable via workflow_call.\n` +
          `   Consider moving to workflows/ if it's truly reusable.`,
      );
    }
  }
}

// Report results
function report() {
  console.log("\n📋 Workflow Validation Report\n");

  if (errors.length === 0 && warnings.length === 0) {
    console.log("✅ All workflow validation checks passed!\n");
    process.exit(0);
  }

  if (errors.length > 0) {
    console.log("❌ ERRORS:\n");
    errors.forEach((error) => {
      console.log(`${error}\n`);
    });
  }

  if (warnings.length > 0) {
    console.log("⚠️  WARNINGS:\n");
    warnings.forEach((warning) => {
      console.log(`${warning}\n`);
    });
  }

  if (errors.length > 0) {
    console.log(`\n❌ Validation failed with ${errors.length} error(s).`);
    process.exit(1);
  } else {
    console.log(`\n⚠️  Validation passed with ${warnings.length} warning(s).`);
    process.exit(0);
  }
}

// Run validation
checkDuplicates();
checkTriggerTypes();
report();
