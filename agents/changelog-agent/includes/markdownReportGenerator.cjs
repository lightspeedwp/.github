/**
 * Markdown Report Generator
 * Format ValidationReport as human-readable Markdown
 */

/**
 * Generate compliance status badge
 * @param {string} status - PASS | CONDITIONAL_PASS | FAIL
 * @returns {string} Markdown badge
 */
function getStatusBadge(status) {
  switch (status) {
    case "PASS":
      return "✅ **PASS**";
    case "CONDITIONAL_PASS":
      return "⚠️ **CONDITIONAL_PASS**";
    case "FAIL":
      return "❌ **FAIL**";
    default:
      return `🔄 **${status}**`;
  }
}

/**
 * Format a single failing entry for Markdown
 * @param {Object} entry - Failing entry with issues
 * @returns {string} Markdown formatted entry
 */
function formatFailingEntry(entry) {
  let output = `\n#### Entry ${entry.index}: ${entry.category}\n`;
  output += `\`\`\`\n${entry.text}\n\`\`\`\n\n`;
  output += `**Issues**:\n`;

  if (entry.issues && entry.issues.length > 0) {
    for (const issue of entry.issues) {
      const severity = issue.severity || "error";
      const icon = severity === "error" ? "❌" : "⚠️";
      const ruleId = issue.ruleId || issue.rule_id || "unknown";
      output += `- ${icon} **${ruleId}**: ${issue.message || issue.issue}\n`;

      if (issue.remediation) {
        output += `  - 💡 Fix: ${issue.remediation}\n`;
      }
    }
  } else {
    output += `- No specific issues captured\n`;
  }

  return output;
}

/**
 * Format category breakdown section
 * @param {Object} issues_by_category - Breakdown by category
 * @returns {string} Markdown formatted breakdown
 */
function formatCategoryBreakdown(issues_by_category) {
  let output = `## Issue Breakdown by Category\n\n`;
  output += `| Category | Total | Passed | Failed | Warnings | Pass % |\n`;
  output += `|----------|-------|--------|--------|----------|--------|\n`;

  for (const category in issues_by_category) {
    const stats = issues_by_category[category];
    const passPercent =
      stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : "N/A";
    output += `| ${category} | ${stats.total} | ${stats.passed} | ${stats.failed} | ${stats.warnings} | ${passPercent}% |\n`;
  }

  output += "\n";
  return output;
}

/**
 * Format remediation section
 * @param {Array} recommendations - Array of recommendations
 * @returns {string} Markdown formatted remediation
 */
function formatRecommendations(recommendations) {
  let output = `## Remediation Recommendations\n\n`;

  if (!recommendations || recommendations.length === 0) {
    output += `✅ No remediation needed - all entries pass!\n\n`;
    return output;
  }

  for (const rec of recommendations) {
    if (rec.type === "rule_violation") {
      output += `### Fix Rule Violations: ${rec.rule_id}\n`;
      output += `- **Affected Entries**: ${rec.affected_entries}\n`;
      output += `- **Guidance**: ${rec.guidance}\n\n`;
    } else if (rec.type === "category_focus") {
      output += `### Focus Area: ${rec.category}\n`;
      output += `- **Current Compliance**: ${rec.compliance}%\n`;
      output += `- **Guidance**: ${rec.guidance}\n\n`;
    }
  }

  return output;
}

/**
 * Generate complete Markdown report
 * @param {Object} report - ValidationReport from buildValidationReport()
 * @returns {string} Complete Markdown report
 */
function generateMarkdownReport(report) {
  let output = "";

  // Title
  output += `# Changelog Quality Audit Report\n\n`;
  output += `**Version**: ${report.version}\n`;
  output += `**Report Date**: ${report.report_date}\n`;
  output += `**Scope**: ${report.scope}\n\n`;

  // Summary section
  output += `## Summary\n\n`;
  output += `${getStatusBadge(report.compliance_status)}\n\n`;
  output += `**Compliance**: ${report.compliance_percentage}% (${report.passed_count}/${report.total_entries_audited} passing)\n\n`;
  output += `| Metric | Count |\n`;
  output += `|--------|-------|\n`;
  output += `| Total Entries | ${report.total_entries_audited} |\n`;
  output += `| Passing ✅ | ${report.passed_count} |\n`;
  output += `| Failing ❌ | ${report.failed_count} |\n`;
  output += `| Warnings ⚠️ | ${report.warning_count} |\n\n`;

  // Issue breakdown
  if (report.issues_by_category) {
    output += formatCategoryBreakdown(report.issues_by_category);
  }

  // Failing entries detail
  if (report.failing_entries && report.failing_entries.length > 0) {
    output += `## Failing Entries (${report.failing_entries.length})\n`;
    output += `These entries require remediation before release:\n`;

    for (const entry of report.failing_entries) {
      output += formatFailingEntry(entry);
    }
  }

  // Warning entries detail
  if (report.warning_entries && report.warning_entries.length > 0) {
    output += `## Entries with Warnings (${report.warning_entries.length})\n`;
    output += `These entries pass but have warnings:\n`;

    for (const entry of report.warning_entries) {
      output += formatFailingEntry(entry);
    }
  }

  // Recommendations
  if (report.recommendations) {
    output += formatRecommendations(report.recommendations);
  }

  // Next steps
  output += `## Next Steps\n\n`;
  if (report.compliance_status === "PASS") {
    output += `✅ All entries pass validation. You are ready to release!\n`;
  } else if (report.compliance_status === "CONDITIONAL_PASS") {
    output += `⚠️ Most entries pass, but review the recommendations above before release.\n`;
  } else {
    output += `❌ Entries require remediation. Address the issues above and re-run the audit.\n`;
  }

  output += `\nTo re-run this audit:\n`;
  output += `\`\`\`bash\n`;
  output += `changelog-validator audit --release ${report.version}\n`;
  output += `\`\`\`\n`;

  return output;
}

module.exports = {
  generateMarkdownReport,
  getStatusBadge,
  formatFailingEntry,
  formatCategoryBreakdown,
  formatRecommendations,
};
