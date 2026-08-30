#!/usr/bin/env node

/**
 * Generate Missing Agent Specifications
 *
 * Creates .agent.md specification files for agent directories that lack them.
 * Extracts metadata from AGENT.md or README.md when available.
 */

import fs from "fs";
import path from "path";
import url from "url";
import * as YAML from "js-yaml";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const AGENTS_DIR = path.join(__dirname, "../../agents");

// Directories that need spec files (21 total)
const MISSING_SPECS = [
  "ai-readiness-estimator-agent",
  "changelog",
  "chat-closure-agent",
  "client-website-discovery-assistant-agent",
  "design-partner-agent",
  "harvest-analytical-agent",
  "linear-advisor-agent",
  "metadata-agent",
  "pagespeed-agent",
  "pr-creation-agent",
  "prd-agent",
  "prd-factory-planner-agent",
  "proposal-desk-agent",
  "tour-operator-config-agent",
  "website-content-strategist-agent",
  "website-scope-estimator-agent",
  "woo-config-agent",
  "wordpress",
  "wp-config-agent",
  "zendesk-support-agent",
];

/**
 * Extract frontmatter from markdown content
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  try {
    return YAML.load(match[1]);
  } catch {
    return null;
  }
}

/**
 * Try to find and extract metadata from AGENT.md or README.md
 */
function extractMetadata(dirPath) {
  const agentMdPath = path.join(dirPath, "AGENT.md");
  const readmePath = path.join(dirPath, "README.md");
  let metadata = {};

  // Try AGENT.md first
  if (fs.existsSync(agentMdPath)) {
    const content = fs.readFileSync(agentMdPath, "utf8");
    const frontmatter = extractFrontmatter(content);

    if (frontmatter) {
      metadata = {
        description: frontmatter.description || extractHeading(content),
        created_date:
          frontmatter.created_date || new Date().toISOString().split("T")[0],
        last_updated:
          frontmatter.last_updated || new Date().toISOString().split("T")[0],
        status: frontmatter.status || "active",
        tags: frontmatter.tags || [],
      };
    }
  } else if (fs.existsSync(readmePath)) {
    // Fall back to README.md
    const content = fs.readFileSync(readmePath, "utf8");
    metadata = {
      description: extractHeading(content),
      created_date: new Date().toISOString().split("T")[0],
      last_updated: new Date().toISOString().split("T")[0],
      status: "active",
      tags: [],
    };
  }

  return metadata;
}

/**
 * Extract first heading from markdown as description
 */
function extractHeading(content) {
  const match = content.match(/^#+ (.+)/m);
  if (match) {
    return match[1].replace(/\s*\(.*\)$/, "").trim();
  }
  return "Agent specification";
}

/**
 * Convert directory name to agent name
 */
function dirToAgentName(dir) {
  return dir
    .replace(/-agent$/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Create spec filename from directory name
 */
function getSpecFileName(dir) {
  return dir.replace(/-agent$/, "").toLowerCase() + ".agent.md";
}

/**
 * Generate frontmatter object
 */
function generateFrontmatter(dirName, metadata) {
  const agentName = dirToAgentName(dirName);

  return {
    name: agentName,
    description: metadata.description || `${agentName} agent`,
    file_type: "agent",
    category: determinateCategory(dirName),
    status: metadata.status || "active",
    version: "v1.0",
    created_date: metadata.created_date,
    last_updated: metadata.last_updated,
    author: "LightSpeed Team",
    maintainer: "LightSpeed Team",
    implementation: dirName,
    language: "en",
    visibility: "public",
    tags: metadata.tags || [],
  };
}

/**
 * Determine category based on directory name
 */
function determinateCategory(dir) {
  if (dir.includes("config")) return "configuration";
  if (dir.includes("wordpress") || dir.includes("woo")) return "configuration";
  if (dir.includes("website") || dir.includes("pagespeed")) return "analysis";
  if (dir.includes("prd") || dir.includes("proposal")) return "planning";
  if (dir.includes("creation") || dir.includes("changelog"))
    return "automation";
  if (dir.includes("closure") || dir.includes("chat")) return "integration";
  if (
    dir.includes("harvest") ||
    dir.includes("zendesk") ||
    dir.includes("linear")
  )
    return "integration";
  if (dir.includes("design") || dir.includes("partner")) return "planning";
  if (dir.includes("tour") || dir.includes("operator")) return "configuration";
  if (dir.includes("metadata")) return "governance";
  return "tooling";
}

/**
 * Generate markdown content
 */
function generateMarkdown(agentName) {
  return `## Purpose

Provide comprehensive support and automation for ${agentName.toLowerCase()} operations.

## Core Responsibilities

- Manage and automate ${agentName.toLowerCase()} workflows
- Provide intelligent analysis and recommendations
- Integration with relevant platforms and services
- Quality assurance and validation

## Key Features

- Automated workflows
- Integration support
- Analysis and reporting
- Quality validation

## Operating Modes

### Default Mode

Standard operation with full feature set and integrations enabled.

### Analysis Mode

Focus on assessment and reporting with reduced automation.

## Implementation Reference

This agent is implemented in the \`agents/${agentName.replace(/ /g, "-").toLowerCase()}/\` directory.

Entry point: AGENT.md or README.md in the implementation directory.

## Related Files

- Agent implementation: \`agents/[directory]/AGENT.md\`
- Dependencies: Refer to package.json in agent directory
`;
}

/**
 * Create a spec file
 */
function createSpecFile(dirName) {
  const dirPath = path.join(AGENTS_DIR, dirName);

  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    console.warn(`⚠️  Directory not found: ${dirName}`);
    return false;
  }

  // Extract metadata
  const metadata = extractMetadata(dirPath);

  // Generate frontmatter
  const frontmatter = generateFrontmatter(dirName, metadata);
  const agentName = dirToAgentName(dirName);

  // Generate markdown content
  const markdownContent = generateMarkdown(agentName);

  // Create spec file
  const specFileName = getSpecFileName(dirName);
  const specPath = path.join(AGENTS_DIR, specFileName);

  if (fs.existsSync(specPath)) {
    console.warn(`⚠️  Spec file already exists: ${specFileName}`);
    return false;
  }

  // Build final content
  const yamlStr = YAML.dump(frontmatter, { indent: 2 });
  const content = `---\n${yamlStr}---\n\n# ${agentName} Agent\n${markdownContent}`;

  // Write file
  fs.writeFileSync(specPath, content, "utf8");
  console.log(`✅ Created ${specFileName}`);
  return true;
}

/**
 * Main function
 */
function main() {
  console.log(
    `Generating ${MISSING_SPECS.length} missing agent specifications...\n`,
  );

  let successCount = 0;
  let failureCount = 0;

  for (const dir of MISSING_SPECS) {
    if (createSpecFile(dir)) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  console.log(`\n${"═".repeat(60)}`);
  console.log(`\nResults: ${successCount} created, ${failureCount} failed\n`);

  if (failureCount > 0) {
    process.exit(1);
  }
}

main();
