/**
 * Metrics Snapshot Builder
 * Builds MetricsSnapshot JSON from changelog validation results
 */

/**
 * Calculate violation distribution by rule
 * @param {Array} ruleResults - All rule validation results
 * @returns {Array} Violations sorted by frequency
 */
function calculateViolationDistribution(ruleResults = []) {
  const violations = {};
  let totalViolations = 0;

  for (const result of ruleResults) {
    if (result.status === "failed") {
      const ruleId = result.ruleId || result.rule_id || "unknown";

      if (!violations[ruleId]) {
        violations[ruleId] = {
          rule_id: ruleId,
          rule_name: result.ruleName || result.rule_name || "unknown",
          count: 0,
          percentage: 0,
        };
      }

      violations[ruleId].count += 1;
      totalViolations += 1;
    }
  }

  // Calculate percentages and sort
  const sorted = Object.values(violations)
    .map((v) => ({
      ...v,
      percentage:
        totalViolations > 0 ? Math.round((v.count / totalViolations) * 100 * 10) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return sorted;
}

/**
 * Calculate compliance trend metric
 * @param {number} totalEntries - Total entries validated
 * @param {number} compliantEntries - Entries that passed validation
 * @returns {Object} Compliance metrics
 */
function calculateComplianceMetrics(totalEntries, compliantEntries) {
  const compliance = totalEntries > 0 ? compliantEntries / totalEntries : 0;
  const compliancePercentage = Math.round(compliance * 1000) / 10;

  return {
    total_entries: totalEntries,
    compliant_entries: compliantEntries,
    non_compliant_entries: totalEntries - compliantEntries,
    compliance_percentage: compliancePercentage,
  };
}

/**
 * Build category distribution from entries
 * @param {Array} entries - All changelog entries with validation status
 * @returns {Object} Entries by category
 */
function buildCategoryDistribution(entries = []) {
  const distribution = {};

  for (const entry of entries) {
    const category = entry.category || "Other";

    if (!distribution[category]) {
      distribution[category] = {
        total: 0,
        compliant: 0,
        non_compliant: 0,
        warnings: 0,
      };
    }

    distribution[category].total += 1;

    const status = entry.status || entry.validation?.complianceStatus;
    if (status === "passing") {
      distribution[category].compliant += 1;
    } else if (status === "warning") {
      distribution[category].warnings += 1;
    } else {
      distribution[category].non_compliant += 1;
    }
  }

  return distribution;
}

/**
 * Build complete MetricsSnapshot
 * @param {Object} data - Data for snapshot
 * @returns {Object} MetricsSnapshot JSON
 */
function buildMetricsSnapshot(data = {}) {
  const {
    snapshot_date = new Date().toISOString(),
    total_entries = 0,
    compliant_entries = 0,
    entries = [],
    rule_results = [],
    version = null,
  } = data;

  const compliance = calculateComplianceMetrics(
    total_entries,
    compliant_entries,
  );

  const violations = calculateViolationDistribution(rule_results);

  const categoryDistribution = buildCategoryDistribution(entries);

  return {
    snapshot_date,
    snapshot_timestamp: new Date(snapshot_date).getTime(),
    scope: version ? `release:${version}` : "full",
    version,

    // Summary statistics
    total_entries: compliance.total_entries,
    compliant_entries: compliance.compliant_entries,
    non_compliant_entries: compliance.non_compliant_entries,
    compliance_percentage: compliance.compliance_percentage,

    // Warning and error counts
    warning_count: entries.filter(e => e.status === "warning").length,
    error_count: entries.filter(e => e.status === "failing").length,

    // Violations breakdown
    violations_by_rule: violations,
    most_common_violations: violations.slice(0, 5),
    total_violations: violations.reduce((sum, v) => sum + v.count, 0),

    // Category distribution
    entries_by_category: categoryDistribution,

    // Average quality score (if available)
    average_quality_score: calculateAverageScore(entries),

    // Trend indicators
    quality_trend: "stable", // stable | improving | declining (set by trend calculator)
  };
}

/**
 * Calculate average quality score from entries
 * @param {Array} entries - Entries with validation data
 * @returns {number} Average score 0-100
 */
function calculateAverageScore(entries = []) {
  if (entries.length === 0) return 0;

  const scores = entries
    .map((e) => e.validation?.complianceScore || 0)
    .filter((s) => s > 0);

  if (scores.length === 0) return 0;

  const sum = scores.reduce((a, b) => a + b, 0);
  return Math.round((sum / scores.length) * 10) / 10;
}

/**
 * Save MetricsSnapshot to disk
 * @param {Object} snapshot - MetricsSnapshot to save
 * @param {string} metricsDir - Directory to save snapshots
 * @returns {Object} Result with file path or error
 */
function saveMetricsSnapshot(
  snapshot,
  metricsDir = ".github/reports/changelog-metrics",
) {
  const fs = require("fs");
  const path = require("path");

  const result = {
    success: false,
    file_path: null,
    error: null,
  };

  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(metricsDir)) {
      fs.mkdirSync(metricsDir, { recursive: true });
    }

    // Generate filename: YYYYMMDD.json
    const date = new Date(snapshot.snapshot_date);
    const dateStr = date
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "");
    const filename = `${dateStr}.json`;
    const filepath = path.join(metricsDir, filename);

    // Write snapshot to file
    fs.writeFileSync(filepath, JSON.stringify(snapshot, null, 2), "utf8");

    result.success = true;
    result.file_path = filepath;
  } catch (error) {
    result.error = error.message;
  }

  return result;
}

/**
 * Load metrics snapshot from file
 * @param {string} dateStr - Date string (YYYYMMDD or YYYY-MM-DD)
 * @param {string} metricsDir - Directory containing metrics
 * @returns {Object|null} MetricsSnapshot or null if not found
 */
function loadMetricsSnapshot(
  dateStr,
  metricsDir = ".github/reports/changelog-metrics",
) {
  const fs = require("fs");
  const path = require("path");

  try {
    // Normalize date format
    const normalized = dateStr.replace(/-/g, "");
    const filename = `${normalized}.json`;
    const filepath = path.join(metricsDir, filename);

    if (!fs.existsSync(filepath)) {
      return null;
    }

    const content = fs.readFileSync(filepath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

module.exports = {
  buildMetricsSnapshot,
  calculateComplianceMetrics,
  calculateViolationDistribution,
  buildCategoryDistribution,
  calculateAverageScore,
  saveMetricsSnapshot,
  loadMetricsSnapshot,
};
