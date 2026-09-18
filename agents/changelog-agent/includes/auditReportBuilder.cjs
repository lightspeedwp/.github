/**
 * Audit Report Builder
 * Constructs comprehensive ValidationReport from audit results
 */

/**
 * Determine compliance status based on percentage
 * @param {number} percentage - Compliance percentage (0-100)
 * @returns {string} Status: "PASS" | "CONDITIONAL_PASS" | "FAIL"
 */
function determineComplianceStatus(percentage) {
  if (percentage === 100) {
    return "PASS";
  } else if (percentage >= 90) {
    return "CONDITIONAL_PASS";
  }
  return "FAIL";
}

/**
 * Build issue breakdown by category from entries
 * @param {Array} entries - All validated entries
 * @returns {Object} Issues organized by category
 */
function buildIssueBreakdown(entries) {
  const breakdown = {};

  for (const entry of entries) {
    const { category, validation } = entry;

    if (!breakdown[category]) {
      breakdown[category] = {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0,
        issues: [],
      };
    }

    breakdown[category].total += 1;

    const status = validation?.complianceStatus || validation?.status;
    if (status === "passing") {
      breakdown[category].passed += 1;
    } else if (status === "failing") {
      breakdown[category].failed += 1;
      // Collect issues
      if (validation?.summary?.issues) {
        for (const issue of validation.summary.issues) {
          breakdown[category].issues.push({
            entry_text: entry.text.substring(0, 80),
            rule: issue.ruleId || issue.rule_id,
            message: issue.message || issue.issue,
            severity: issue.severity || "error",
          });
        }
      }
    } else if (status === "warning") {
      breakdown[category].warnings += 1;
      if (validation?.summary?.issues) {
        for (const issue of validation.summary.issues) {
          breakdown[category].issues.push({
            entry_text: entry.text.substring(0, 80),
            rule: issue.ruleId || issue.rule_id,
            message: issue.message || issue.issue,
            severity: issue.severity || "warning",
          });
        }
      }
    }
  }

  return breakdown;
}

/**
 * Generate remediation recommendations
 * @param {Array} failing_entries - Entries with compliance status failing
 * @param {Object} issue_breakdown - Issue breakdown by category
 * @returns {Array} Specific remediation recommendations
 */
function generateRecommendations(failing_entries, issue_breakdown) {
  const recommendations = [];

  // Rule-level recommendations
  const ruleIssues = {};
  for (const category in issue_breakdown) {
    const categoryData = issue_breakdown[category];
    for (const issue of categoryData.issues || []) {
      const ruleKey = issue.rule || issue.ruleId || issue.rule_id;
      if (!ruleIssues[ruleKey]) {
        ruleIssues[ruleKey] = {
          rule: ruleKey,
          count: 0,
          messages: [],
        };
      }
      ruleIssues[ruleKey].count += 1;
      if (
        !ruleIssues[ruleKey].messages.includes(issue.message)
      ) {
        ruleIssues[ruleKey].messages.push(issue.message);
      }
    }
  }

  // Build recommendations
  for (const rule in ruleIssues) {
    const data = ruleIssues[rule];
    recommendations.push({
      type: "rule_violation",
      rule_id: rule,
      affected_entries: data.count,
      guidance: data.messages[0] || `Fix violations of rule ${rule}`,
    });
  }

  // Category-level summary
  let lowestCategory = null;
  let lowestScore = 100;
  for (const category in issue_breakdown) {
    const stats = issue_breakdown[category];
    const score = stats.total > 0 ? (stats.passed / stats.total) * 100 : 100;
    if (score < lowestScore) {
      lowestScore = score;
      lowestCategory = category;
    }
  }

  if (lowestCategory && lowestScore < 100) {
    recommendations.push({
      type: "category_focus",
      category: lowestCategory,
      compliance: Math.round(lowestScore * 10) / 10,
      guidance: `Focus remediation efforts on "${lowestCategory}" entries (${lowestScore.toFixed(1)}% passing)`,
    });
  }

  return recommendations;
}

/**
 * Build comprehensive ValidationReport
 * @param {Object} auditResult - Result from auditRelease()
 * @returns {Object} ValidationReport JSON
 */
function buildValidationReport(auditResult) {
  const {
    audit_date,
    scope,
    version,
    total_entries,
    entries = [],
    passing_entries = [],
    failing_entries = [],
    warning_entries = [],
    compliance_percentage,
  } = auditResult;

  // Build issue breakdown
  const issues_by_category = buildIssueBreakdown(entries);

  // Determine status
  const compliance_status = determineComplianceStatus(compliance_percentage);

  // Generate recommendations
  const recommendations = generateRecommendations(
    failing_entries,
    issues_by_category,
  );

  return {
    report_date: audit_date,
    scope,
    version,
    total_entries_audited: total_entries,
    passed_count: passing_entries.length,
    failed_count: failing_entries.length,
    warning_count: warning_entries.length,
    compliance_percentage: Math.round(compliance_percentage * 10) / 10,
    compliance_status,
    issues_by_category,
    passing_entries: passing_entries.map((e) => ({
      index: e.index,
      category: e.category,
      text: e.text.substring(0, 250),
    })),
    failing_entries: failing_entries.map((e) => ({
      index: e.index,
      category: e.category,
      text: e.text.substring(0, 250),
      issues: e.validation?.summary?.issues || [],
    })),
    warning_entries: warning_entries.map((e) => ({
      index: e.index,
      category: e.category,
      text: e.text.substring(0, 250),
      issues: e.validation?.summary?.issues || [],
    })),
    recommendations,
  };
}

/**
 * Generate detailed remediation summary for each failing entry
 * @param {Array} failing_entries - Array of failing entries with validation details
 * @returns {Array} Remediation items with specific guidance per entry
 */
function generateRemediationSummary(failing_entries) {
  const remediations = [];

  for (const entry of failing_entries) {
    const item = {
      entry_index: entry.index,
      entry_text: entry.text,
      category: entry.category,
      fixes_needed: [],
    };

    if (entry.issues && entry.issues.length > 0) {
      for (const issue of entry.issues) {
        const ruleId = issue.ruleId || issue.rule_id || "unknown";
        let fixGuidance = "";

        // Provide rule-specific guidance
        switch (ruleId) {
          case "R001":
            fixGuidance =
              "Remove implementation details (code patterns, API names, internal terminology)";
            break;
          case "R002":
            fixGuidance =
              "Add required category field (feature, fix, improvement, breaking-change, security)";
            break;
          case "R003":
            fixGuidance = "Add descriptive title for this entry";
            break;
          case "R004":
            fixGuidance = "Add detailed description of the change";
            break;
          case "R009":
            fixGuidance = "Add or fix PR reference link (e.g., #123)";
            break;
          case "R010":
            fixGuidance =
              "Verify PR reference is valid and accessible (check link works)";
            break;
          default:
            fixGuidance =
              issue.remediation || issue.message || "Review and fix this issue";
        }

        item.fixes_needed.push({
          rule_id: ruleId,
          issue: issue.message || issue.issue,
          fix: fixGuidance,
          severity: issue.severity || "error",
        });
      }
    }

    remediations.push(item);
  }

  return remediations;
}

/**
 * Save ValidationReport to disk
 * @param {Object} report - ValidationReport to save
 * @param {string} reportsDir - Directory to save reports in (default: .github/reports/release-audits)
 * @returns {Object} Result with file path or error
 */
function saveReport(report, reportsDir = ".github/reports/release-audits") {
  const fs = require("fs");
  const path = require("path");

  const result = {
    success: false,
    file_path: null,
    error: null,
  };

  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `v${report.version}_${timestamp}.json`;
    const filepath = path.join(reportsDir, filename);

    // Write report to file
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2), "utf8");

    result.success = true;
    result.file_path = filepath;
  } catch (error) {
    result.error = error.message;
  }

  return result;
}

module.exports = {
  buildValidationReport,
  determineComplianceStatus,
  buildIssueBreakdown,
  generateRecommendations,
  generateRemediationSummary,
  saveReport,
};
