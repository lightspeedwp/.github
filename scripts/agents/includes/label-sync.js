#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: label-sync.js
 * Location: scripts/agents/includes/label-sync.js
 * Description: Utilities for syncing repository labels with canonical org standards.
 *   Includes functions for validation, standardization, and migration.
 * Version: v1.1.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * ============================================================================
 */

import { findStandardLabel } from "./label-lookup.js";
import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";
import github from "@actions/github";

async function syncLabelsWithCanonical(
  octokit,
  owner,
  repo,
  canonicalLabels,
  dryRun = false,
  options = {},
) {
  const {
    deletionMode = "none",
    approvedDeletionSet = new Set(),
    protectedDeletionSet = new Set(),
  } = options;

  try {
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
      deferredDeletes: [],
      unchanged: [],
      errors: [],
    };

    for (const [labelName, canonicalLabel] of canonicalMap) {
      const existingLabel = repoLabelMap.get(labelName);
      const labelObj =
        typeof canonicalLabel === "string"
          ? { name: canonicalLabel, color: "E1E4E8", description: "" }
          : canonicalLabel;

      if (!existingLabel) {
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
        const colorStr = labelObj.color != null ? String(labelObj.color) : null;
        const needsUpdate =
          (colorStr && existingLabel.color !== colorStr.replace("#", "")) ||
          (labelObj.description &&
            existingLabel.description !== labelObj.description);

        if (needsUpdate) {
          if (!dryRun) {
            try {
              await octokit.rest.issues.updateLabel({
                owner,
                repo,
                name: labelName,
                color: colorStr
                  ? colorStr.replace("#", "")
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

    for (const [labelName] of repoLabelMap) {
      if (!canonicalMap.has(labelName)) {
        if (protectedDeletionSet.has(labelName)) {
          report.deferredDeletes.push({
            label: labelName,
            reason: "protected-by-policy",
          });
          continue;
        }

        if (
          deletionMode !== "approved" ||
          !approvedDeletionSet.has(labelName)
        ) {
          report.deferredDeletes.push({
            label: labelName,
            reason:
              deletionMode === "approved"
                ? "not-approved-for-delete"
                : "destructive-delete-disabled",
          });
          continue;
        }

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
    throw new Error(`Failed to sync labels: ${error.message}`, {
      cause: error,
    });
  }
}

async function validateRepoLabels(
  octokit,
  owner,
  repo,
  canonicalLabels,
  allowedExtraSet = new Set(),
) {
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
      extra: repoLabelNames.filter(
        (name) => !canonicalSet.has(name) && !allowedExtraSet.has(name),
      ),
      allowedExtra: repoLabelNames.filter(
        (name) => !canonicalSet.has(name) && allowedExtraSet.has(name),
      ),
      nonCompliant: [],
      summary: {
        totalCanonical: canonicalSet.size,
        totalRepo: repoLabels.length,
        missingCount: 0,
        extraCount: 0,
        allowedExtraCount: 0,
        nonCompliantCount: 0,
      },
    };

    for (const repoLabel of repoLabels) {
      const canonicalLabel = canonicalMap.get(repoLabel.name);
      if (canonicalLabel) {
        const issues = [];
        const canonicalColorStr =
          canonicalLabel.color != null ? String(canonicalLabel.color) : null;
        if (
          canonicalColorStr &&
          repoLabel.color !== canonicalColorStr.replace("#", "")
        ) {
          issues.push(
            `color: expected ${canonicalColorStr}, got ${repoLabel.color}`,
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
    report.summary.allowedExtraCount = report.allowedExtra.length;
    report.summary.nonCompliantCount = report.nonCompliant.length;
    report.valid =
      report.missing.length === 0 &&
      report.extra.length === 0 &&
      report.nonCompliant.length === 0;

    return report;
  } catch (error) {
    throw new Error(`Failed to validate labels: ${error.message}`, {
      cause: error,
    });
  }
}

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
              await octokit.rest.issues.removeLabel({
                owner,
                repo,
                issue_number: itemNumber,
                name: nonStandardLabel,
              });

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
    throw new Error(`Failed to standardize labels: ${error.message}`, {
      cause: error,
    });
  }
}

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
    report += `- **Deferred Deletes:** ${syncReport.deferredDeletes.length} labels\n`;
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

    if (syncReport.deferredDeletes.length > 0) {
      report += "### Deferred Deletes (Policy-Gated)\n";
      syncReport.deferredDeletes.forEach((entry) => {
        report += `- \`${entry.label}\` (${entry.reason})\n`;
      });
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
    report += `- **Allowed extra:** ${validationReport.summary.allowedExtraCount}\n`;
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

function loadYamlArray(filePath, purpose) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${purpose} file at: ${filePath}`);
  }
  const data = yaml.load(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(data)) {
    throw new Error(`Expected array in ${purpose} file: ${filePath}`);
  }
  return data;
}

function loadPolicy(policyPath) {
  if (!fs.existsSync(policyPath)) {
    return null;
  }
  const data = yaml.load(fs.readFileSync(policyPath, "utf8"));
  return data && typeof data === "object" ? data : null;
}

function asStringSet(value) {
  if (!Array.isArray(value)) return new Set();
  return new Set(value.filter((item) => typeof item === "string"));
}

function asBoolean(value) {
  if (!value) return false;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function resolveDeletionMode(policy) {
  const envRequested = asBoolean(process.env.LABEL_SYNC_ALLOW_DESTRUCTIVE);
  const policyEnabled = Boolean(policy?.destructive_cleanup?.enabled);
  if (envRequested && policyEnabled) return "approved";
  return "none";
}

async function runCli() {
  const token = process.env.GITHUB_TOKEN;
  const repoSlug = process.env.GITHUB_REPOSITORY;
  if (!token || !repoSlug) {
    console.log(
      "[label-sync] Skipping sync: requires GITHUB_TOKEN and GITHUB_REPOSITORY.",
    );
    return;
  }

  const labelsConfigPath = process.env.LABELS_CONFIG || ".github/labels.yml";
  const policyPath = ".github/label-governance-policy.yml";
  const reportPath =
    process.env.LABEL_SYNC_REPORT_PATH ||
    path.join(".github", "reports", "labeling", "label-sync-report.md");
  const dryRun =
    asBoolean(process.env.LABEL_SYNC_DRY_RUN) || asBoolean(process.env.DRY_RUN);

  const canonicalLabels = loadYamlArray(labelsConfigPath, "labels config");
  const policy = loadPolicy(policyPath);
  const deletionMode = resolveDeletionMode(policy);
  const approvedDeletionSet = asStringSet(
    policy?.destructive_cleanup?.approved_orphan_labels,
  );
  const protectedDeletionSet = asStringSet(
    policy?.destructive_cleanup?.never_delete_labels,
  );

  const [owner, repo] = repoSlug.split("/");
  const octokit = github.getOctokit(token);

  const syncReport = await syncLabelsWithCanonical(
    octokit,
    owner,
    repo,
    canonicalLabels,
    dryRun,
    {
      deletionMode,
      approvedDeletionSet,
      protectedDeletionSet,
    },
  );

  const validationReport = await validateRepoLabels(
    octokit,
    owner,
    repo,
    canonicalLabels,
    protectedDeletionSet,
  );

  const report = generateSyncReport(syncReport, validationReport, null);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${report}\n`);

  console.log(
    `[label-sync] Created ${syncReport.created.length}, updated ${syncReport.updated.length}, deleted ${syncReport.deleted.length}, deferred ${syncReport.deferredDeletes.length}`,
  );
  console.log(
    `[label-sync] Deletion mode: ${deletionMode} (policy + env gate)`,
  );

  if (!validationReport.valid && dryRun) {
    console.warn(
      `[label-sync] Dry-run detected label drift (missing=${validationReport.summary.missingCount}, extra=${validationReport.summary.extraCount}, nonCompliant=${validationReport.summary.nonCompliantCount})`,
    );
    return;
  }

  if (!validationReport.valid) {
    throw new Error(
      `Label validation failed (missing=${validationReport.summary.missingCount}, extra=${validationReport.summary.extraCount}, nonCompliant=${validationReport.summary.nonCompliantCount})`,
    );
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCli().catch((error) => {
    console.error(`[label-sync] ${error.message}`);
    process.exit(1);
  });
}

export {
  syncLabelsWithCanonical,
  validateRepoLabels,
  standardizeLabelsOnRepo,
  generateSyncReport,
};
