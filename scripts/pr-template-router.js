#!/usr/bin/env node

/**
 * PR Template Router
 * Resolves branch type to PR template and labels based on configuration files
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * Load YAML configuration file
 */
function loadConfig(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return yaml.load(content);
  } catch (error) {
    console.error(`Error loading config ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Extract branch type from branch name
 * Pattern: {type}/{scope}-{title}
 */
function extractBranchType(branchName) {
  const match = branchName.match(/^([a-z0-9]+)\//);
  return match ? match[1] : null;
}

/**
 * Get PR template for branch type
 */
function getTemplate(branchType, typesConfig) {
  if (
    !typesConfig ||
    !typesConfig.branch_types ||
    !typesConfig.branch_types[branchType]
  ) {
    return typesConfig?.fallback_template || "pr_feature";
  }
  return (
    typesConfig.branch_types[branchType].template ||
    typesConfig.fallback_template ||
    "pr_feature"
  );
}

/**
 * Get default labels for branch type
 */
function getLabels(branchType, labelsConfig) {
  if (
    !labelsConfig ||
    !labelsConfig.branch_labels ||
    !labelsConfig.branch_labels[branchType]
  ) {
    return [];
  }

  const typeConfig = labelsConfig.branch_labels[branchType];
  return typeConfig.default_labels || [];
}

/**
 * Extract scope from branch name
 */
function extractScope(branchName) {
  const match = branchName.match(/^[^/]+\/(.+)/);
  return match ? match[1] : "";
}

/**
 * Get area labels based on scope keywords
 */
function getAreaLabels(scope, labelsConfig) {
  if (!scope || !labelsConfig || !labelsConfig.branch_labels) {
    return [];
  }

  const areaLabels = [];
  const keywords = labelsConfig.area_keywords_reference || {};

  // Check each keyword category
  Object.entries(keywords).forEach(([category, config]) => {
    if (config.keywords && Array.isArray(config.keywords)) {
      config.keywords.forEach((keyword) => {
        if (scope.includes(keyword)) {
          if (!areaLabels.includes(config.label)) {
            areaLabels.push(config.label);
          }
        }
      });
    }
  });

  return areaLabels;
}

/**
 * Main routing function
 */
function routePR(branchName) {
  console.log(`Processing branch: ${branchName}`);

  // Load configurations
  const typesConfig = loadConfig(".github/branch-types.yml");
  const labelsConfig = loadConfig(".github/branch-labels.yml");

  if (!typesConfig) {
    console.error("Failed to load branch-types.yml");
    process.exit(1);
  }

  if (!labelsConfig) {
    console.error("Failed to load branch-labels.yml");
    process.exit(1);
  }

  // Extract branch type
  const branchType = extractBranchType(branchName);
  if (!branchType) {
    console.error(`Could not extract branch type from: ${branchName}`);
    process.exit(1);
  }

  // Get template
  const template = getTemplate(branchType, typesConfig);
  console.log(`Template: ${template}`);

  // Get default labels
  const defaultLabels = getLabels(branchType, labelsConfig);
  console.log(`Default labels: ${defaultLabels.join(", ")}`);

  // Get area labels from scope
  const scope = extractScope(branchName);
  const areaLabels = getAreaLabels(scope, labelsConfig);
  if (areaLabels.length > 0) {
    console.log(`Area labels detected: ${areaLabels.join(", ")}`);
  }

  // Combine all labels
  const allLabels = [...new Set([...defaultLabels, ...areaLabels])];
  console.log(`All labels: ${allLabels.join(", ")}`);

  // Output as JSON for GitHub Actions
  console.log(
    JSON.stringify({
      branch_type: branchType,
      template: template,
      default_labels: defaultLabels,
      area_labels: areaLabels,
      all_labels: allLabels,
      scope: scope,
    }),
  );
}

// Get branch name from command line or environment
const branchName = process.argv[2] || process.env.BRANCH_NAME;

if (!branchName) {
  console.error(
    "Branch name required. Usage: pr-template-router.js <branch-name>",
  );
  process.exit(1);
}

routePR(branchName);
