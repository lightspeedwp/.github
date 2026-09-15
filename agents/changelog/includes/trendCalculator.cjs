/**
 * Trend Calculator
 * Calculates trend metrics from historical metrics snapshots
 */

/**
 * Simple linear regression calculation
 * Calculates slope and R-squared to determine trend direction
 * @param {Array} dataPoints - Array of { x: number, y: number } points
 * @returns {Object} { slope, intercept, rSquared, trend }
 */
function calculateLinearRegression(dataPoints = []) {
  if (dataPoints.length < 2) {
    return {
      slope: 0,
      intercept: 0,
      rSquared: 0,
      trend: "insufficient_data",
    };
  }

  const n = dataPoints.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0,
    sumY2 = 0;

  for (const point of dataPoints) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumX2 += point.x * point.x;
    sumY2 += point.y * point.y;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared
  const yMean = sumY / n;
  let ssTotal = 0,
    ssResidual = 0;

  for (const point of dataPoints) {
    const yPredicted = slope * point.x + intercept;
    ssTotal += Math.pow(point.y - yMean, 2);
    ssResidual += Math.pow(point.y - yPredicted, 2);
  }

  const rSquared = ssTotal === 0 ? 0 : 1 - ssResidual / ssTotal;

  // Determine trend direction
  let trend = "stable";
  if (Math.abs(slope) < 0.5) {
    trend = "stable";
  } else if (slope > 0.5) {
    trend = "improving";
  } else if (slope < -0.5) {
    trend = "declining";
  }

  return {
    slope: Math.round(slope * 1000) / 1000,
    intercept: Math.round(intercept * 10) / 10,
    rSquared: Math.round(rSquared * 1000) / 1000,
    trend,
  };
}

/**
 * Calculate compliance trend from historical snapshots
 * @param {Array} snapshots - Array of historical MetricsSnapshot objects
 * @returns {Object} Compliance trend analysis
 */
function calculateComplianceTrend(snapshots = []) {
  if (snapshots.length < 2) {
    return {
      trend: "insufficient_data",
      days: snapshots.length,
      average_compliance: snapshots.length > 0 ? snapshots[0].compliance_percentage : 0,
    };
  }

  // Sort by date
  const sorted = [...snapshots].sort(
    (a, b) =>
      new Date(a.snapshot_date).getTime() -
      new Date(b.snapshot_date).getTime(),
  );

  // Convert to regression data points
  const dataPoints = sorted.map((s, index) => ({
    x: index,
    y: s.compliance_percentage,
  }));

  const regression = calculateLinearRegression(dataPoints);

  return {
    trend: regression.trend,
    slope: regression.slope,
    regression_r_squared: regression.rSquared,
    days_analyzed: sorted.length,
    first_date: sorted[0].snapshot_date,
    last_date: sorted[sorted.length - 1].snapshot_date,
    first_compliance: sorted[0].compliance_percentage,
    last_compliance: sorted[sorted.length - 1].compliance_percentage,
    average_compliance: Math.round(
      (sorted.reduce((sum, s) => sum + s.compliance_percentage, 0) /
        sorted.length) *
        10,
    ) / 10,
    min_compliance: Math.min(...sorted.map((s) => s.compliance_percentage)),
    max_compliance: Math.max(...sorted.map((s) => s.compliance_percentage)),
  };
}

/**
 * Calculate velocity metrics (entries added per time period)
 * @param {Array} snapshots - Array of historical snapshots
 * @returns {Object} Velocity metrics
 */
function calculateVelocity(snapshots = []) {
  if (snapshots.length < 2) {
    return {
      entries_per_day: 0,
      entries_per_week: 0,
      entries_per_month: 0,
    };
  }

  const sorted = [...snapshots].sort(
    (a, b) =>
      new Date(a.snapshot_date).getTime() -
      new Date(b.snapshot_date).getTime(),
  );

  const firstDate = new Date(sorted[0].snapshot_date);
  const lastDate = new Date(sorted[sorted.length - 1].snapshot_date);
  const daysDiff =
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);

  const totalEntriesAdded =
    sorted[sorted.length - 1].total_entries - sorted[0].total_entries;

  const entriesPerDay = daysDiff > 0 ? totalEntriesAdded / daysDiff : 0;

  return {
    total_entries_added: totalEntriesAdded,
    days_analyzed: Math.max(daysDiff, 1),
    entries_per_day: Math.round(entriesPerDay * 100) / 100,
    entries_per_week: Math.round(entriesPerDay * 7 * 100) / 100,
    entries_per_month: Math.round(entriesPerDay * 30 * 100) / 100,
  };
}

/**
 * Identify most common violations over time
 * @param {Array} snapshots - Array of historical snapshots
 * @returns {Array} Top violations sorted by total occurrence
 */
function identifyCommonViolations(snapshots = []) {
  const violationTotals = {};

  for (const snapshot of snapshots) {
    if (snapshot.violations_by_rule) {
      for (const violation of snapshot.violations_by_rule) {
        const ruleId = violation.rule_id;

        if (!violationTotals[ruleId]) {
          violationTotals[ruleId] = {
            rule_id: ruleId,
            rule_name: violation.rule_name,
            total_occurrences: 0,
            snapshots_with_violation: 0,
          };
        }

        violationTotals[ruleId].total_occurrences += violation.count;
        violationTotals[ruleId].snapshots_with_violation += 1;
      }
    }
  }

  return Object.values(violationTotals)
    .sort((a, b) => b.total_occurrences - a.total_occurrences)
    .slice(0, 10); // Top 10
}

/**
 * Generate comprehensive trend report
 * @param {Array} snapshots - Array of historical snapshots (should be sorted by date)
 * @returns {Object} Complete trend analysis
 */
function generateTrendReport(snapshots = []) {
  if (snapshots.length === 0) {
    return {
      report_date: new Date().toISOString(),
      status: "no_data",
      message: "No metrics snapshots available for analysis",
    };
  }

  const complianceTrend = calculateComplianceTrend(snapshots);
  const velocity = calculateVelocity(snapshots);
  const commonViolations = identifyCommonViolations(snapshots);

  return {
    report_date: new Date().toISOString(),
    snapshots_analyzed: snapshots.length,
    period_start: snapshots[0].snapshot_date,
    period_end: snapshots[snapshots.length - 1].snapshot_date,

    compliance_trend: complianceTrend,
    velocity: velocity,
    common_violations: commonViolations,

    // Summary recommendation
    recommendation: generateRecommendation(complianceTrend, commonViolations),
  };
}

/**
 * Generate recommendation based on trends
 * @param {Object} complianceTrend - Compliance trend data
 * @param {Array} commonViolations - Top violations
 * @returns {string} Recommendation text
 */
function generateRecommendation(complianceTrend, commonViolations) {
  const parts = [];

  if (complianceTrend.trend === "declining") {
    parts.push(
      "⚠️ Compliance is declining. Investigate recent changes and provide team guidance.",
    );
  } else if (complianceTrend.trend === "improving") {
    parts.push(
      "✅ Compliance is improving. Continue current practices and maintain focus.",
    );
  } else {
    parts.push(
      "🔄 Compliance is stable. Monitor for changes and address any emerging patterns.",
    );
  }

  if (commonViolations.length > 0) {
    const topViolation = commonViolations[0];
    parts.push(
      `Focus remediation on ${topViolation.rule_name} (${topViolation.total_occurrences} occurrences across snapshots).`,
    );
  }

  return parts.join(" ");
}

module.exports = {
  calculateLinearRegression,
  calculateComplianceTrend,
  calculateVelocity,
  identifyCommonViolations,
  generateTrendReport,
  generateRecommendation,
};
