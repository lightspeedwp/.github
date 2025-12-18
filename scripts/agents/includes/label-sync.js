#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: label-sync.js
 * Location: scripts/agents/includes/label-sync.js
 * Description: Utilities for syncing repository labels with canonical org standards.
 *   Includes functions for validation, standardization, and migration.
 * Version: v1.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * ============================================================================
 */
// TODO: Align this helper with the latest automation spec updates.

import { findStandardLabel } from "./label-lookup.js";

/**
 * Sync repository labels with canonical set.
 * Creates, updates, and removes labels to match the canonical set.
 * @param {Object} octokit - GitHub API client
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {Array} canonicalLabels - Array of canonical label objects with name, color, description
 * @param {boolean} dryRun - If true, only report what would be changed
 * @returns {Promise<Object>} Sync report with created, updated, deleted counts
 */
async function syncLabelsWithCanonical(
  octokit,
  owner,
  repo,
  canonicalLabels,
  dryRun = false,
) {
  try {
    // Fetch current repository labels
    const { data: repoLabels } = await octokit.rest.issues.listLabelsForRepo({
      owner,
      repo,
      per_page: 100,
    });

    const canonicalMap = new Map();
    canonicalLabels.forEach((label) => {
      const labelName = typeof label === "string" ? label : label.name;
      canonicalMap.set(labelName, label);
    });

    const repoLabelMap = new Map();
    repoLabels.forEach((label) => repoLabelMap.set(label.name, label));

    const report = {
      created: [],
      updated: [],
      deleted: [],
      unchanged: [],
      errors: [],
    };

    // Create or update canonical labels
    for (const [labelName, canonicalLabel] of canonicalMap) {
      const existingLabel = repoLabelMap.get(labelName);
      const labelObj =
        typeof canonicalLabel === "string"
          ? { name: canonicalLabel, color: "E1E4E8", description: "" }
          : canonicalLabel;

      if (!existingLabel) {
        // Create new label
        if (!dryRun) {
          try {
            await octokit.rest.issues.createLabel({
              owner,
              repo,
              name: labelObj.name,
              color: labelObj.color || "E1E4E8",
              description: labelObj.description || "",
            });
          } catch (error) {
            report.errors.push({
              action: "create",
              label: labelName,
              error: error.message,
            });
            continue;
          }
        }
        report.created.push(labelName);
      } else {
        // Check if update is needed
        const needsUpdate =
          (labelObj.color &&
            existingLabel.color !== labelObj.color.replace("#", "")) ||
          (labelObj.description &&
            existingLabel.description !== labelObj.description);

        if (needsUpdate) {
          if (!dryRun) {
            try {
              await octokit.rest.issues.updateLabel({
                owner,
                repo,
                name: labelName,
                color: labelObj.color
                  ? labelObj.color.replace("#", "")
                  : existingLabel.color,
                description:
                  labelObj.description !== undefined
                    ? labelObj.description
                    : existingLabel.description,
              });
            } catch (error) {
              report.errors.push({
                action: "update",
                label: labelName,
                error: error.message,
              });
              continue;
            }
          }
          report.updated.push(labelName);
        } else {
          report.unchanged.push(labelName);
        }
      }
    }

    // Identify labels to delete (repo labels not in canonical set)
    for (const [labelName] of repoLabelMap) {
      if (!canonicalMap.has(labelName)) {
        // Check if it's being used before deleting
        try {
          const { data: issues } =
            await octokit.rest.search.issuesAndPullRequests({
              q: `repo:${owner}/${repo} label:"${labelName}" state:open`,
              per_page: 1,
            });

          if (issues.total_count === 0) {
            if (!dryRun) {
              await octokit.rest.issues.deleteLabel({
                owner,
                repo,
                name: labelName,
              });
            }
            report.deleted.push(labelName);
          } else {
            report.errors.push({
              action: "delete",
              label: labelName,
              error: `Label is in use on ${issues.total_count} open items`,
            });
          }
        } catch (error) {
          report.errors.push({
            action: "delete",
            label: labelName,
            error: error.message,
          });
        }
      }
    }

    return report;
  } catch (error) {
    throw new Error(`Failed to sync labels: ${error.message}`);
  }
}

/**
 * Validate repository labels against org standards.
 * @param {Object} octokit - GitHub API client
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {Array} canonicalLabels - Array of canonical label names/objects
 * @returns {Promise<Object>} Validation report with missing, extra, and non-compliant labels
 */
async function validateRepoLabels(octokit, owner, repo, canonicalLabels) {
  try {
    const { data: repoLabels } = await octokit.rest.issues.listLabelsForRepo({
      owner,
      repo,
      per_page: 100,
    });

    const canonicalSet = new Set();
    const canonicalMap = new Map();

    canonicalLabels.forEach((label) => {
      const labelName = typeof label === "string" ? label : label.name;
      canonicalSet.add(labelName);
      if (typeof label === "object") {
        canonicalMap.set(labelName, label);
      }
    });

    const repoLabelNames = repoLabels.map((l) => l.name);
    const repoLabelSet = new Set(repoLabelNames);

    const report = {
      valid: true,
      missing: Array.from(canonicalSet).filter(
        (name) => !repoLabelSet.has(name),
      ),
      extra: repoLabelNames.filter((name) => !canonicalSet.has(name)),
      nonCompliant: [],
      summary: {
        totalCanonical: canonicalSet.size,
        totalRepo: repoLabels.length,
        missingCount: 0,
        extraCount: 0,
        nonCompliantCount: 0,
      },
    };

    // Check for non-compliant labels (wrong color/description)
    for (const repoLabel of repoLabels) {
      const canonicalLabel = canonicalMap.get(repoLabel.name);
      if (canonicalLabel) {
        const issues = [];
        if (
          canonicalLabel.color &&
          repoLabel.color !== canonicalLabel.color.replace("#", "")
        ) {
          issues.push(
            `color: expected ${canonicalLabel.color}, got ${repoLabel.color}`,
          );
        }
        if (
          canonicalLabel.description &&
          repoLabel.description !== canonicalLabel.description
        ) {
          issues.push(
            `description: expected "${canonicalLabel.description}", got "${repoLabel.description}"`,
          );
        }
        if (issues.length > 0) {
          report.nonCompliant.push({
            name: repoLabel.name,
            issues,
          });
        }
      }
    }

    report.summary.missingCount = report.missing.length;
    report.summary.extraCount = report.extra.length;
    report.summary.nonCompliantCount = report.nonCompliant.length;
    report.valid =
      report.missing.length === 0 &&
      report.extra.length === 0 &&
      report.nonCompliant.length === 0;

    return report;
  } catch (error) {
    throw new Error(`Failed to validate labels: ${error.message}`);
  }
}

/**
 * Standardize labels in repo: migrate non-standard labels to canonical ones on issues/PRs.
 * @param {Object} octokit - GitHub API client
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {Object} aliasMap - Map of alias labels to canonical labels
 * @param {Set} canonicalSet - Set of canonical label names
 * @param {boolean} dryRun - If true, only report what would be changed
 * @returns {Promise<Object>} Standardization report
 */
async function standardizeLabelsOnRepo(
  octokit,
  owner,
  repo,
  aliasMap,
  canonicalSet,
  dryRun = false,
) {
  try {
    const report = {
      itemsProcessed: 0,
      labelsChanged: 0,
      migrations: [],
      errors: [],
    };

    // Search for issues and PRs with non-standard labels
    const nonStandardLabels = Object.keys(aliasMap);

    for (const nonStandardLabel of nonStandardLabels) {
      try {
        const { data: items } = await octokit.rest.search.issuesAndPullRequests(
          {
            q: `repo:${owner}/${repo} label:"${nonStandardLabel}"`,
            per_page: 100,
          },
        );

        for (const item of items.items) {
          const canonicalLabel = findStandardLabel(
            nonStandardLabel,
            aliasMap,
            canonicalSet,
          );
          if (!canonicalLabel) continue;

          const itemNumber = item.number;
          const itemType = item.pull_request ? "PR" : "Issue";

          try {
            if (!dryRun) {
              // Remove non-standard label
              await octokit.rest.issues.removeLabel({
                owner,
                repo,
                issue_number: itemNumber,
                name: nonStandardLabel,
              });

              // Add canonical label
              await octokit.rest.issues.addLabels({
                owner,
                repo,
                issue_number: itemNumber,
                labels: [canonicalLabel],
              });
            }

            report.migrations.push({
              item: `${itemType} #${itemNumber}`,
              from: nonStandardLabel,
              to: canonicalLabel,
            });
            report.labelsChanged++;
          } catch (error) {
            report.errors.push({
              item: `${itemType} #${itemNumber}`,
              from: nonStandardLabel,
              to: canonicalLabel,
              error: error.message,
            });
          }
        }

        report.itemsProcessed += items.items.length;
      } catch (error) {
        report.errors.push({
          label: nonStandardLabel,
          error: `Failed to search for label: ${error.message}`,
        });
      }
    }

    return report;
  } catch (error) {
    throw new Error(`Failed to standardize labels: ${error.message}`);
  }
}

/**
 * Generate a markdown report for label sync operations.
 * @param {Object} syncReport - Report from syncLabelsWithCanonical
 * @param {Object} validationReport - Report from validateRepoLabels
 * @param {Object} standardizationReport - Report from standardizeLabelsOnRepo
 * @returns {string} Markdown formatted report
 */
function generateSyncReport(
  syncReport,
  validationReport,
  standardizationReport,
) {
  let report = "# 🏷️ Label Sync Report\n\n";

  if (syncReport) {
    report += "## Repository Label Sync\n\n";
    report += `- **Created:** ${syncReport.created.length} labels\n`;
    report += `- **Updated:** ${syncReport.updated.length} labels\n`;
    report += `- **Deleted:** ${syncReport.deleted.length} labels\n`;
    report += `- **Unchanged:** ${syncReport.unchanged.length} labels\n`;
    report += `- **Errors:** ${syncReport.errors.length}\n\n`;

    if (syncReport.created.length > 0) {
      report += "### Created Labels\n";
      syncReport.created.forEach((label) => (report += `- \`${label}\`\n`));
      report += "\n";
    }

    if (syncReport.updated.length > 0) {
      report += "### Updated Labels\n";
      syncReport.updated.forEach((label) => (report += `- \`${label}\`\n`));
      report += "\n";
    }

    if (syncReport.errors.length > 0) {
      report += "### Errors\n";
      syncReport.errors.forEach((error) => {
        report += `- **${error.action}** \`${error.label}\`: ${error.error}\n`;
      });
      report += "\n";
    }
  }

  if (validationReport) {
    report += "## Validation Results\n\n";
    report += `**Status:** ${validationReport.valid ? "✅ Valid" : "❌ Issues Found"}\n\n`;
    report += `- **Total Canonical:** ${validationReport.summary.totalCanonical}\n`;
    report += `- **Total Repository:** ${validationReport.summary.totalRepo}\n`;
    report += `- **Missing:** ${validationReport.summary.missingCount}\n`;
    report += `- **Extra:** ${validationReport.summary.extraCount}\n`;
    report += `- **Non-compliant:** ${validationReport.summary.nonCompliantCount}\n\n`;
  }

  if (standardizationReport) {
    report += "## Label Standardization\n\n";
    report += `- **Items Processed:** ${standardizationReport.itemsProcessed}\n`;
    report += `- **Labels Changed:** ${standardizationReport.labelsChanged}\n`;
    report += `- **Migrations:** ${standardizationReport.migrations.length}\n`;
    report += `- **Errors:** ${standardizationReport.errors.length}\n\n`;

    if (standardizationReport.migrations.length > 0) {
      report += "### Label Migrations\n";
      standardizationReport.migrations.forEach((migration) => {
        report += `- ${migration.item}: \`${migration.from}\` → \`${migration.to}\`\n`;
      });
      report += "\n";
    }
  }

  report += "_Generated by LightSpeedWP Label Sync Agent_";
  return report;
}

export {
  syncLabelsWithCanonical,
  validateRepoLabels,
  standardizeLabelsOnRepo,
  generateSyncReport,
};
