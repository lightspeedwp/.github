/**
 * Reporting Agent v2 integration example tests.
 */

const fs = require("fs");
const path = require("path");
const {
  buildPrdAgentExample,
  buildTestingAgentExample,
  buildMetricsAgentExample,
  buildAllAgentExamples,
} = require("../agent-integration-examples");

describe("agent-integration-examples", () => {
  const fixturesDir = path.join(__dirname, "fixtures");
  const sampleMetrics = JSON.parse(
    fs.readFileSync(path.join(fixturesDir, "sample-metrics.json"), "utf8"),
  );

  describe("module exports", () => {
    test("exports PRD example builder", () => {
      expect(typeof buildPrdAgentExample).toBe("function");
    });

    test("exports Testing example builder", () => {
      expect(typeof buildTestingAgentExample).toBe("function");
    });

    test("exports Metrics example builder", () => {
      expect(typeof buildMetricsAgentExample).toBe("function");
    });

    test("exports aggregate example builder", () => {
      expect(typeof buildAllAgentExamples).toBe("function");
    });
  });

  describe("buildPrdAgentExample", () => {
    test("sets agent name", () => {
      expect(buildPrdAgentExample(sampleMetrics).agent).toBe("prd-agent");
    });

    test("sets integration identifier", () => {
      expect(buildPrdAgentExample(sampleMetrics).integration).toBe(
        "reporting-agent-v2",
      );
    });

    test("defaults to weekly report type", () => {
      expect(buildPrdAgentExample(sampleMetrics).reportType).toBe("weekly");
    });

    test("accepts custom report type", () => {
      expect(
        buildPrdAgentExample(sampleMetrics, { reportType: "monthly" })
          .reportType,
      ).toBe("monthly");
    });

    test("includes formatted report payload", () => {
      const payload = buildPrdAgentExample(sampleMetrics);
      expect(payload.report.type).toBe("metrics-report");
    });

    test("maps executive summary into PRD sections", () => {
      const payload = buildPrdAgentExample(sampleMetrics);
      expect(payload.prdSections.executiveSummary).toEqual(
        payload.report.executive_summary,
      );
    });

    test("maps success metrics into PRD sections", () => {
      const payload = buildPrdAgentExample(sampleMetrics);
      expect(payload.prdSections.successMetrics).toEqual(
        payload.report.metrics,
      );
    });

    test("maps anomalies into PRD risks", () => {
      const payload = buildPrdAgentExample(sampleMetrics);
      expect(payload.prdSections.risks).toEqual(payload.report.anomalies);
    });

    test("maps recommendations into PRD actions", () => {
      const payload = buildPrdAgentExample(sampleMetrics);
      expect(payload.prdSections.recommendedActions).toEqual(
        payload.report.recommendations,
      );
    });

    test("keeps anomaly count from source report", () => {
      const payload = buildPrdAgentExample(sampleMetrics);
      expect(payload.prdSections.risks).toHaveLength(2);
    });

    test("creates report period label", () => {
      const payload = buildPrdAgentExample(sampleMetrics);
      expect(payload.report.period.label).toContain("Week of");
    });

    test("includes report links", () => {
      const payload = buildPrdAgentExample(sampleMetrics);
      expect(payload.report.reportLinks.fullReport).toContain("github.com");
    });
  });

  describe("buildTestingAgentExample", () => {
    test("sets agent name", () => {
      expect(buildTestingAgentExample(sampleMetrics).agent).toBe(
        "testing-agent",
      );
    });

    test("sets integration identifier", () => {
      expect(buildTestingAgentExample(sampleMetrics).integration).toBe(
        "reporting-agent-v2",
      );
    });

    test("maps quality gate from report summary", () => {
      expect(buildTestingAgentExample(sampleMetrics).qualityGate).toBe(
        "at-risk",
      );
    });

    test("returns default scenario limit", () => {
      expect(buildTestingAgentExample(sampleMetrics).scenarios).toHaveLength(2);
    });

    test("respects custom maxScenarios", () => {
      expect(
        buildTestingAgentExample(sampleMetrics, { maxScenarios: 1 }).scenarios,
      ).toHaveLength(1);
    });

    test("handles maxScenarios above available anomalies", () => {
      expect(
        buildTestingAgentExample(sampleMetrics, { maxScenarios: 10 }).scenarios,
      ).toHaveLength(2);
    });

    test("creates scenario title", () => {
      const scenario = buildTestingAgentExample(sampleMetrics).scenarios[0];
      expect(scenario.scenario).toContain("Validate");
    });

    test("copies severity into each scenario", () => {
      const scenario = buildTestingAgentExample(sampleMetrics).scenarios[0];
      expect(["moderate", "high"]).toContain(scenario.severity);
    });

    test("adds traceability identifier", () => {
      const scenario = buildTestingAgentExample(sampleMetrics).scenarios[0];
      expect(scenario.traceability).toMatch(/^metrics:/);
    });

    test("copies expected outcome text", () => {
      const scenario = buildTestingAgentExample(sampleMetrics).scenarios[0];
      expect(scenario.expectedOutcome).toContain("Review");
    });

    test("includes next steps", () => {
      expect(
        buildTestingAgentExample(sampleMetrics).nextSteps.length,
      ).toBeGreaterThan(0);
    });

    test("returns empty scenarios when no anomalies", () => {
      const metrics = { ...sampleMetrics, anomalies: [] };
      expect(buildTestingAgentExample(metrics).scenarios).toEqual([]);
    });
  });

  describe("buildMetricsAgentExample", () => {
    test("sets agent name", () => {
      expect(buildMetricsAgentExample(sampleMetrics).agent).toBe(
        "metrics-agent",
      );
    });

    test("sets integration identifier", () => {
      expect(buildMetricsAgentExample(sampleMetrics).integration).toBe(
        "reporting-agent-v2",
      );
    });

    test("sets default report type", () => {
      expect(buildMetricsAgentExample(sampleMetrics).handoff.reportType).toBe(
        "weekly",
      );
    });

    test("accepts custom report type", () => {
      expect(
        buildMetricsAgentExample(sampleMetrics, { reportType: "quarterly" })
          .handoff.reportType,
      ).toBe("quarterly");
    });

    test("includes source type in handoff", () => {
      expect(buildMetricsAgentExample(sampleMetrics).handoff.sourceType).toBe(
        "metrics-collection",
      );
    });

    test("falls back source type when missing", () => {
      const metrics = { ...sampleMetrics, type: undefined };
      expect(buildMetricsAgentExample(metrics).handoff.sourceType).toBe(
        "metrics-collection",
      );
    });

    test("includes context in handoff", () => {
      expect(buildMetricsAgentExample(sampleMetrics).handoff.context).toBe(
        "control-plane",
      );
    });

    test("falls back context when missing", () => {
      const metrics = { ...sampleMetrics, context: undefined };
      expect(buildMetricsAgentExample(metrics).handoff.context).toBe(
        "control-plane",
      );
    });

    test("passes through timestamp", () => {
      expect(buildMetricsAgentExample(sampleMetrics).handoff.timestamp).toBe(
        sampleMetrics.timestamp,
      );
    });

    test("includes formatted report payload", () => {
      expect(buildMetricsAgentExample(sampleMetrics).handoff.report.type).toBe(
        "metrics-report",
      );
    });
  });

  describe("buildAllAgentExamples", () => {
    test("returns PRD section", () => {
      expect(buildAllAgentExamples(sampleMetrics).prdAgent.agent).toBe(
        "prd-agent",
      );
    });

    test("returns Testing section", () => {
      expect(buildAllAgentExamples(sampleMetrics).testingAgent.agent).toBe(
        "testing-agent",
      );
    });

    test("returns Metrics section", () => {
      expect(buildAllAgentExamples(sampleMetrics).metricsAgent.agent).toBe(
        "metrics-agent",
      );
    });

    test("returns three integration payloads", () => {
      expect(Object.keys(buildAllAgentExamples(sampleMetrics))).toEqual([
        "prdAgent",
        "testingAgent",
        "metricsAgent",
      ]);
    });

    test("keeps PRD integration marker", () => {
      expect(buildAllAgentExamples(sampleMetrics).prdAgent.integration).toBe(
        "reporting-agent-v2",
      );
    });

    test("keeps Testing integration marker", () => {
      expect(
        buildAllAgentExamples(sampleMetrics).testingAgent.integration,
      ).toBe("reporting-agent-v2");
    });

    test("keeps Metrics integration marker", () => {
      expect(
        buildAllAgentExamples(sampleMetrics).metricsAgent.integration,
      ).toBe("reporting-agent-v2");
    });

    test("builds deterministic report type defaults", () => {
      const all = buildAllAgentExamples(sampleMetrics);
      expect(all.prdAgent.reportType).toBe("weekly");
      expect(all.metricsAgent.handoff.reportType).toBe("weekly");
    });
  });
});
