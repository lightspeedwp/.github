/**
 * badges.js
 * Badge generation and insertion for the meta agent
 * Aligned with automation spec (.github/automation/badges.schema.yml)
 * Supports both workflow and metadata badges with conditional rules
 */

import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";

/**
 * Validate badge schema structure
 *
 * TESTING NOTE (Phase 4): This function should be covered by unit tests:
 * - Test valid schema structure (all required sections present)
 * - Test missing required sections (badges, mapping, config)
 * - Test edge cases (empty arrays, null values, malformed YAML)
 * - Test schema versioning and compatibility
 *
 * TODO: Add comprehensive test suite via jest in tests/badges.schema.test.js
 *
 * @param {object} schema - Loaded schema object
 * @returns {boolean} true if valid, throws error if invalid
 */
function validateSchema(schema) {
  if (!schema) {
    throw new Error("Badge schema is empty or undefined");
  }

  if (!schema.badges) {
    throw new Error("Schema missing required 'badges' section");
  }

  if (!schema.mapping || !Array.isArray(schema.mapping)) {
    throw new Error("Schema missing required 'mapping' array");
  }

  if (!schema.config) {
    console.warn("Schema missing 'config' section, using defaults");
  }

  return true;
}

/**
 * Load badge schema configuration from .github/automation/badges.schema.yml
 * @returns {object|null} Parsed schema object or null if not found
 * @throws {Error} If schema exists but is invalid
 */
function loadBadgeSchema() {
  const schemaPath = path.join(
    process.cwd(),
    ".github/automation/badges.schema.yml",
  );

  if (!fs.existsSync(schemaPath)) {
    console.warn(
      `Badge schema not found at ${schemaPath} - badge generation disabled`,
    );
    return null;
  }

  try {
    const content = fs.readFileSync(schemaPath, "utf-8");
    const schema = yaml.load(content);
    validateSchema(schema);
    return schema;
  } catch (error) {
    throw new Error(
      `Failed to load badge schema: ${error instanceof Error ? error.message : String(error)}. Check .github/automation/badges.schema.yml`,
      { cause: error },
    );
  }
}

/**
 * Generate workflow badge markdown
 */
function generateWorkflowBadge(repo, workflowFile, branch = "main") {
  const workflowName = workflowFile.replace(/\.(yml|yaml)$/, "");
  const badgeUrl = `https://github.com/${repo}/actions/workflows/${workflowFile}/badge.svg?branch=${branch}`;
  const workflowUrl = `https://github.com/${repo}/actions/workflows/${workflowFile}`;
  return `[![${workflowName}](${badgeUrl})](${workflowUrl})`;
}

/**
 * Generate badge markdown for all workflows in .github/workflows/
 */
function generateWorkflowBadges(repo, branch = "main", format = "stacked") {
  const workflowsDir = path.join(process.cwd(), ".github", "workflows");
  if (!fs.existsSync(workflowsDir)) {
    return [];
  }
  const badges = [];
  fs.readdirSync(workflowsDir).forEach((file) => {
    if (file.endsWith(".yml") || file.endsWith(".yaml")) {
      badges.push(generateWorkflowBadge(repo, file, branch));
    }
  });
  if (badges.length === 0) {
    return [];
  }
  if (format === "inline") {
    return [badges.join(" ")];
  }
  return badges;
}

/**
 * Generate metadata badges from schema configuration
 *
 * Supports conditional badge generation based on document frontmatter:
 * - has_front_matter: Check if document has YAML frontmatter
 * - front_matter.license: Match license field against allowed values
 * - front_matter.tags: Match tags field with "any" or "all" logic
 *
 * Tag Matching (v1.1.0+):
 * Supports both simple array matching and advanced matching with match strategy:
 *   tags: ["workflow", "automation"]           # Simple: matches if any tag present
 *   tags: { match: "any", values: [...] }     # Advanced: explicit match strategy
 *   tags: { match: "all", values: [...] }     # Requires all tags to match
 *
 * @param {object} frontMatter - Document frontmatter object
 * @returns {array} Array of badge markdown strings
 */
function generateMetadataBadges(frontMatter) {
  const schema = loadBadgeSchema();
  if (!schema || !schema.badges || !schema.mapping) {
    return [];
  }

  const badges = [];

  // Process mapping rules
  for (const rule of schema.mapping) {
    if (!rule.when || !rule.add) continue;

    let conditionMet = true;

    // Check if front matter exists
    if (rule.when.has_front_matter && !frontMatter) {
      conditionMet = false;
    }

    // Check front matter license field
    if (
      rule.when.front_matter &&
      rule.when.front_matter.license &&
      frontMatter
    ) {
      const allowedLicenses = rule.when.front_matter.license;
      if (
        !frontMatter.license ||
        !allowedLicenses.includes(frontMatter.license)
      ) {
        conditionMet = false;
      }
    }

    // Check front matter tags field (supports both simple array and advanced matching)
    if (rule.when.front_matter && rule.when.front_matter.tags && frontMatter) {
      const tagsConfig = rule.when.front_matter.tags;
      const docTags = frontMatter.tags || [];

      if (Array.isArray(tagsConfig)) {
        // Simple array matching: match if any document tag is in allowed list
        const hasMatch = docTags.some((tag) => tagsConfig.includes(tag));
        if (!hasMatch) {
          conditionMet = false;
        }
      } else if (tagsConfig.match && tagsConfig.values) {
        // Advanced matching with explicit strategy
        const values = Array.isArray(tagsConfig.values)
          ? tagsConfig.values
          : [tagsConfig.values];

        if (tagsConfig.match === "any") {
          // Match if any document tag is in values list
          const hasMatch = docTags.some((tag) => values.includes(tag));
          if (!hasMatch) {
            conditionMet = false;
          }
        } else if (tagsConfig.match === "all") {
          // Match if all values are in document tags
          const hasAllMatch = values.every((tag) => docTags.includes(tag));
          if (!hasAllMatch) {
            conditionMet = false;
          }
        }
      }
    }

    if (conditionMet) {
      for (const badgeRef of rule.add) {
        const badge = resolveBadge(badgeRef, schema.badges, frontMatter);
        if (badge) {
          badges.push(badge);
        }
      }
    }
  }

  return badges;
}

/**
 * Resolve a badge reference from schema
 */
function resolveBadge(badgeRef, badgeDefs, frontMatter) {
  const parts = badgeRef.split(".");
  let current = badgeDefs;

  for (const part of parts) {
    if (current && current[part]) {
      current = current[part];
    } else {
      return null;
    }
  }

  if (!current || typeof current !== "object") {
    return null;
  }

  // Handle workflow badges
  if (badgeRef.startsWith("workflow.")) {
    const label = current.label || badgeRef;
    const successText = current.success_text || "OK";
    return `![${label}](https://img.shields.io/badge/${label}-${successText}-success.svg)`;
  }

  // Handle metadata badges
  if (
    badgeRef.startsWith("meta.license") &&
    frontMatter &&
    frontMatter.license
  ) {
    const license = frontMatter.license.toUpperCase();
    return `![License](https://img.shields.io/badge/license-${license}-blue.svg)`;
  }

  return null;
}

/**
 * Insert or update badge block in README.md between markers
 */
function updateReadmeBadges(readmeFile, badges) {
  const badgeStart = "<!-- BADGES-START -->";
  const badgeEnd = "<!-- BADGES-END -->";

  if (!fs.existsSync(readmeFile)) {
    throw new Error(`README file not found: ${readmeFile}`);
  }

  let content = fs.readFileSync(readmeFile, "utf-8");
  const badgeBlock = [badgeStart, ...badges, badgeEnd].join("\n");

  if (content.includes(badgeStart) && content.includes(badgeEnd)) {
    // Replace existing block
    content = content.replace(
      new RegExp(`${badgeStart}[\\s\\S]*?${badgeEnd}`, "m"),
      badgeBlock,
    );
  } else {
    // Insert after first header
    content = content.replace(/^(# .+\n)/, `$1\n${badgeBlock}\n`);
  }

  fs.writeFileSync(readmeFile, content);
  return true;
}

/**
 * Main entry point for updating badges in a README file
 *
 * @param {string} readmePath - Path to README.md file
 * @param {string} workflowsPath - Path to workflows directory (relative or absolute)
 * @param {object} options - Configuration options
 * @param {boolean} [options.backup=false] - Create backup before modifying
 * @param {string} [options.repo="lightspeedwp/.github"] - Repository identifier for badge URLs
 * @param {string} [options.branch="develop"] - Default branch for workflow badges
 * @param {string} [options.format="stacked"] - Badge format: "stacked" or "inline"
 * @param {object} [options.frontMatter=null] - Document frontmatter for conditional badges
 * @returns {boolean} true if badges were updated, false if skipped
 * @throws {Error} If README file not found or badge insertion fails
 *
 * @example
 * // Update README with workflow badges and metadata badges
 * await updateBadgesInReadme(
 *   "./README.md",
 *   "./.github/workflows",
 *   {
 *     repo: "lightspeedwp/.github",
 *     branch: "develop",
 *     frontMatter: { license: "MIT", tags: ["workflow"] }
 *   }
 * );
 */
async function updateBadgesInReadme(readmePath, workflowsPath, options = {}) {
  const {
    backup = false,
    repo = "lightspeedwp/.github",
    branch = "develop",
    format = "stacked",
    frontMatter = null,
  } = options;

  try {
    // Create backup if requested
    if (backup && fs.existsSync(readmePath)) {
      const backupPath = `${readmePath}.backup`;
      fs.copyFileSync(readmePath, backupPath);
      console.log(`Created backup: ${backupPath}`);
    }

    // Generate workflow badges
    const workflowBadges = generateWorkflowBadges(repo, branch, format);
    if (workflowBadges.length > 0) {
      console.log(`Generated ${workflowBadges.length} workflow badges`);
    }

    // Generate metadata badges from schema
    const metadataBadges = generateMetadataBadges(frontMatter);
    if (metadataBadges.length > 0) {
      console.log(`Generated ${metadataBadges.length} metadata badges`);
    }

    // Combine all badges
    const allBadges = [...metadataBadges, ...workflowBadges];

    if (allBadges.length === 0) {
      console.log("No badges generated for this file - skipping update");
      return false;
    }

    // Update the README
    updateReadmeBadges(readmePath, allBadges);
    console.log(`Updated badges in ${readmePath}`);

    return true;
  } catch (error) {
    console.error(`Error updating badges: ${error.message}`);
    throw error;
  }
}

export {
  generateWorkflowBadges,
  generateWorkflowBadge,
  generateMetadataBadges,
  updateReadmeBadges,
  updateBadgesInReadme,
  loadBadgeSchema,
  validateSchema,
  resolveBadge,
};
