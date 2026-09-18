/**
 * Reporting Agent v2 integration examples for downstream agents.
 *
 * Provides deterministic payload builders for PRD Agent, Testing Agent,
 * and Metrics Agent to demonstrate how each agent can consume
 * Reporting Agent v2 formatted output.
 */

const MetricsReportFormatter = require("./reporting-agent-input");

/**
 * Build PRD Agent integration payload.
 *
 * @param {Object} rawMetrics
 * @param {Object} [options]
 * @param {string} [options.reportType]
 * @returns {Object}
 */
function buildPrdAgentExample(rawMetrics, options = {}) {
  const reportType = options.reportType || "weekly";
  const formatter = new MetricsReportFormatter();
  const report = formatter.formatForReportingAgent(rawMetrics, reportType);

  return {
    agent: "prd-agent",
    integration: "reporting-agent-v2",
    reportType,
    report,
    prdSections: {
      executiveSummary: report.executive_summary,
      successMetrics: report.metrics,
      risks: report.anomalies,
      recommendedActions: report.recommendations,
    },
  };
}

/**
 * Build Testing Agent integration payload.
 *
 * @param {Object} rawMetrics
 * @param {Object} [options]
 * @param {number} [options.maxScenarios]
 * @returns {Object}
 */
function buildTestingAgentExample(rawMetrics, options = {}) {
  const maxScenarios =
    Number.isFinite(options.maxScenarios) && options.maxScenarios >= 0
      ? Math.floor(options.maxScenarios)
      : 3;
  const formatter = new MetricsReportFormatter();
  const report = formatter.generateWeeklyReport(rawMetrics);
  const scenarios = report.anomalies.slice(0, maxScenarios).map((anomaly) => ({
    scenario: `Validate ${anomaly.metric} remediation`,
    severity: anomaly.severity,
    expectedOutcome: anomaly.recommendation,
    traceability: `metrics:${anomaly.metric}`,
  }));

  return {
    agent: "testing-agent",
    integration: "reporting-agent-v2",
    qualityGate: report.executive_summary.status,
    scenarios,
    nextSteps: report.nextSteps,
  };
}

/**
 * Build Metrics Agent integration payload.
 *
 * @param {Object} rawMetrics
 * @param {Object} [options]
 * @param {string} [options.reportType]
 * @returns {Object}
 */
function buildMetricsAgentExample(rawMetrics, options = {}) {
  const reportType = options.reportType || "weekly";
  const formatter = new MetricsReportFormatter();
  const report = formatter.formatForReportingAgent(rawMetrics, reportType);

  return {
    agent: "metrics-agent",
    integration: "reporting-agent-v2",
    handoff: {
      sourceType: rawMetrics.type || "metrics-collection",
      context: rawMetrics.context || "control-plane",
      timestamp: rawMetrics.timestamp,
      reportType,
      report,
    },
  };
}

/**
 * Build all downstream integration examples in one response.
 *
 * @param {Object} rawMetrics
 * @returns {Object}
 */
function buildAllAgentExamples(rawMetrics) {
  return {
    prdAgent: buildPrdAgentExample(rawMetrics),
    testingAgent: buildTestingAgentExample(rawMetrics),
    metricsAgent: buildMetricsAgentExample(rawMetrics),
  };
}

module.exports = {
  buildPrdAgentExample,
  buildTestingAgentExample,
  buildMetricsAgentExample,
  buildAllAgentExamples,
};
