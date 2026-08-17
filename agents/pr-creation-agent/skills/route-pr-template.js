/**
 * Skill: route-pr-template
 * Routes pull requests to correct template based on branch type
 *
 * @param {Object} input - Input object
 * @param {string} input.branchType - Branch type (e.g. "feat", "fix", "docs")
 * @param {Object} input.config - Optional routing configuration override
 * @returns {Object} Routing result with template info and metadata
 */

import * as fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";

const DEFAULT_CONFIG_PATH =
  ".github/PULL_REQUEST_TEMPLATE/config.yml";

export async function routePrTemplate(input) {
  const { branchType, config: customConfig } = input;

  if (!branchType || typeof branchType !== "string") {
    return {
      valid: false,
      error: "Branch type is required and must be a string",
      templateFile: null,
      templatePath: null,
      content: null,
      metadata: null,
    };
  }

  try {
    // Load routing configuration
    const configPath = customConfig?.configPath || DEFAULT_CONFIG_PATH;
    const config = await loadConfig(configPath);

    if (!config) {
      return {
        valid: false,
        error: `Failed to load routing config from ${configPath}`,
        templateFile: null,
        templatePath: null,
        content: null,
        metadata: null,
      };
    }

    // Find matching template file
    const templateFile = findTemplateForBranchType(
      branchType,
      config
    );

    if (!templateFile) {
      return {
        valid: false,
        error: `No template found for branch type: ${branchType}`,
        branchType,
        templateFile: null,
        templatePath: null,
        content: null,
        metadata: null,
      };
    }

    // Read template file
    const templatePath = path.join(
      ".github/PULL_REQUEST_TEMPLATE",
      templateFile
    );
    const content = await readTemplateFile(templatePath);

    if (!content) {
      return {
        valid: false,
        error: `Failed to read template file: ${templatePath}`,
        branchType,
        templateFile,
        templatePath,
        content: null,
        metadata: null,
      };
    }

    // Extract metadata from template
    const metadata = extractTemplateMetadata(content, templateFile);

    return {
      valid: true,
      branchType,
      templateFile,
      templatePath,
      content,
      metadata,
    };
  } catch (error) {
    return {
      valid: false,
      error: `Error routing template: ${error.message}`,
      branchType,
      templateFile: null,
      templatePath: null,
      content: null,
      metadata: null,
    };
  }
}

/**
 * Load routing configuration from YAML file
 */
async function loadConfig(configPath) {
  try {
    const content = await fs.readFile(configPath, "utf8");
    return yaml.load(content, { schema: yaml.DEFAULT_SAFE_SCHEMA });
  } catch (error) {
    console.error(`Failed to load config from ${configPath}:`, error.message);
    return null;
  }
}

/**
 * Find template file for given branch type
 */
function findTemplateForBranchType(branchType, config) {
  // Exact match first
  if (config.routes && config.routes[`${branchType}/`]) {
    return config.routes[`${branchType}/`];
  }

  // Check against available templates
  if (config.default_template) {
    return config.default_template;
  }

  return null;
}

/**
 * Read template file content
 */
async function readTemplateFile(templatePath) {
  try {
    return await fs.readFile(templatePath, "utf8");
  } catch (error) {
    console.error(`Failed to read template file ${templatePath}:`, error.message);
    return null;
  }
}

/**
 * Extract metadata from template content
 * Identifies sections, required fields, and frontmatter
 */
function extractTemplateMetadata(content, templateFile) {
  const lines = content.split("\n");
  const sections = [];
  const requiredSections = [
    "Linked issues",
    "Changelog",
    "Checklist (Global DoD / PR)",
  ];
  const foundSections = [];
  const frontmatter = {};

  let inFrontmatter = false;
  let frontmatterLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle frontmatter
    if (i === 0 && line.trim() === "---") {
      inFrontmatter = true;
      continue;
    }

    if (inFrontmatter) {
      if (line.trim() === "---") {
        inFrontmatter = false;
        // Parse frontmatter
        parseFrontmatter(frontmatterLines, frontmatter);
        continue;
      }
      frontmatterLines.push(line);
      continue;
    }

    // Extract sections (## headers)
    if (line.startsWith("## ")) {
      const sectionName = line.substring(3).trim();
      sections.push(sectionName);

      // Check if it's a required section
      if (requiredSections.includes(sectionName)) {
        foundSections.push(sectionName);
      }
    }
  }

  // Determine which required sections are missing
  const missingSections = requiredSections.filter(
    (s) => !foundSections.includes(s)
  );

  return {
    templateFile,
    frontmatter: {
      ...frontmatter,
      version: frontmatter.version || "unknown",
    },
    sections,
    foundSections,
    requiredSections,
    missingSections,
    complete: missingSections.length === 0,
    contentLength: content.length,
    lineCount: lines.length,
  };
}

/**
 * Parse YAML frontmatter
 */
function parseFrontmatter(lines, target) {
  for (const line of lines) {
    if (line.trim() === "") continue;
    const match = line.match(/^([^:]+):\s*"?([^"]*)"?$/);
    if (match) {
      const [, key, value] = match;
      target[key.trim()] = value.trim();
    }
  }
}

export default routePrTemplate;
