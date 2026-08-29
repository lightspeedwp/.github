/**
 * badges.js
 * Badge generation and insertion for the meta agent
 * Based on includes/badgeUtils.js
 */

// TODO: Align this helper with the latest automation spec updates.

import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";

/**
 * Load badge schema configuration
 */
function loadBadgeSchema() {
  const schemaPath = path.join(
    process.cwd(),
    ".github/automation/badges.schema.yml",
  );
  if (!fs.existsSync(schemaPath)) {
    return null;
  }
  const content = fs.readFileSync(schemaPath, "utf-8");
  return yaml.load(content);
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
 * @param {string} readmePath - Path to README.md
 * @param {string} workflowsPath - Path to workflows directory (relative or absolute)
 * @param {object} options - Options: { backup: boolean, repo: string, branch: string, format: string, frontMatter: object }
 */
async function updateBadgesInReadme(readmePath, workflowsPath, options = {}) {
  const {
    backup = false,
    repo = "lightspeedwp/.github",
    branch = "develop",
    format = "stacked",
    frontMatter = null,
  } = options;

  // Create backup if requested
  if (backup && fs.existsSync(readmePath)) {
    const backupPath = `${readmePath}.backup`;
    fs.copyFileSync(readmePath, backupPath);
  }

  // Generate workflow badges
  const workflowBadges = generateWorkflowBadges(repo, branch, format);

  // Generate metadata badges from schema
  const metadataBadges = generateMetadataBadges(frontMatter);

  // Combine all badges
  const allBadges = [...metadataBadges, ...workflowBadges];

  if (allBadges.length === 0) {
    // No badges generated for this file; skipping badge update.
    return false;
  }

  // Update the README
  updateReadmeBadges(readmePath, allBadges);

  return true;
}

export {
  generateWorkflowBadges,
  generateWorkflowBadge,
  generateMetadataBadges,
  updateReadmeBadges,
  updateBadgesInReadme,
  loadBadgeSchema,
};
