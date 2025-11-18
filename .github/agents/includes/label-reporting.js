#!/usr/bin/env node
/**
 * ============================================================================
 * Script Name: label-reporting.js
 * Location: scripts/utility/label-reporting.js
 * Description: Markdown reporting helpers for labeling and standardization actions.
 * Version: v1.0.0
 * Author: LightSpeed WP Team
 * License: GPL v3 or later
 * ============================================================================
 */

/**
 * Build a markdown report for auto-labeling actions.
 */
function buildLabelingReport({ type, newLabels, suggestions }) {
    let report = `## 🏷️ Auto-Labeling Report\n\n**Type:** ${type}\n**Labels Applied:**\n`;
    report +=
        newLabels && newLabels.length
            ? newLabels.map((l) => `- \`${l}\``).join('\n')
            : '*No new labels applied*';
    if (suggestions && suggestions.length > 0) {
        report += `\n\n**Canonicalization/Migration Suggestions:**\n`;
        for (const s of suggestions) {
            if (s.to) report += `- \`${s.from}\` → \`${s.to}\`\n`;
            else report += `- \`${s.from}\` is non-standard and was removed\n`;
        }
    }
    report += `\n\n*Labels assigned based on content, file changes, branch rules, and org-wide standards.*`;
    return report;
}

/**
 * Build a markdown report for label standardization actions.
 */
function buildStandardizationReport({ nonStandardLabels, migratedLabels }) {
    let report = `## 🏷️ Label Standardization Report\n\n**Non-standard labels found:**\n`;
    report +=
        nonStandardLabels && nonStandardLabels.length
            ? nonStandardLabels.map((l) => `- \`${l}\``).join('\n')
            : '*No non-standard labels found*';
    if (migratedLabels && migratedLabels.length > 0) {
        report += `\n\n**Migrated Labels:**\n`;
        migratedLabels.forEach((m) => {
            report += `- \`${m.from}\` → \`${m.to}\`\n`;
        });
    }
    report += `\n\n*Repository labels now conform to org-wide standards.*`;
    return report;
}

export {
    buildLabelingReport,
    buildStandardizationReport,
};
