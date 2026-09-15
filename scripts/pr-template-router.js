#!/usr/bin/env node

/**
 * PR Template Router
 * Resolves branch type to PR template and labels based on configuration files
 */

import fs from "fs";
import { load as yamlLoad } from "js-yaml";

/**
 * Load YAML configuration file
 */
function loadConfig(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return yamlLoad(content);
  } catch (error) {
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
 * Main routing function - returns routing data object
 */
function routePR(branchName) {
  // Load configurations
  const typesConfig = loadConfig(".github/branch-types.yml");
  const labelsConfig = loadConfig(".github/branch-labels.yml");

  if (!typesConfig) {
    throw new Error("Failed to load branch-types.yml");
  }

  if (!labelsConfig) {
    throw new Error("Failed to load branch-labels.yml");
  }

  // Extract branch type
  const branchType = extractBranchType(branchName);
  if (!branchType) {
    throw new Error(`Could not extract branch type from: ${branchName}`);
  }

  // Get template
  const template = getTemplate(branchType, typesConfig);

  // Get default labels
  const defaultLabels = getLabels(branchType, labelsConfig);

  // Get area labels from scope
  const scope = extractScope(branchName);
  const areaLabels = getAreaLabels(scope, labelsConfig);

  // Combine all labels
  const allLabels = [...new Set([...defaultLabels, ...areaLabels])];

  return {
    branch_type: branchType,
    template: template,
    default_labels: defaultLabels,
    area_labels: areaLabels,
    all_labels: allLabels,
    scope: scope,
  };
}

// Get branch name from command line or environment
const branchName = process.argv[2] || process.env.BRANCH_NAME;

if (!branchName) {
  console.error(
    "Branch name required. Usage: pr-template-router.js <branch-name>",
  );
  process.exit(1);
}

try {
  const result = routePR(branchName);
  // Only output the JSON - no debug messages
  console.log(JSON.stringify(result));
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
