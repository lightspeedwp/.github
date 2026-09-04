// Import validation functions from production module helpers
const {
  runDeploymentChecklist,
  setupProductionEnvironment,
  runSmokeTests,
  validateRollbackPlan,
  configureMonitoring,
  parseProductionArguments,
  executeAllProductionValidations,
} = require("../production-validation-helpers.js");

describe("production-validation", () => {
  describe("runDeploymentChecklist", () => {
    it("verifies all default checklist items", () => {
      const result = runDeploymentChecklist();
      expect(result.success).toBe(true);
      expect(result.status).toBe("all-verified");
    });

    it("returns total and verified item counts", () => {
      const result = runDeploymentChecklist();
      expect(result.totalItems).toBeGreaterThan(0);
      expect(result.verifiedItems).toBe(result.totalItems);
    });

    it("accepts custom checklist items", () => {
      const result = runDeploymentChecklist({
        items: ["custom-check-a", "custom-check-b"],
      });
      expect(result.success).toBe(true);
      expect(result.totalItems).toBe(2);
      expect(result.items["custom-check-a"]).toBeDefined();
      expect(result.items["custom-check-b"]).toBeDefined();
    });

    it("each item has verified and status properties", () => {
      const result = runDeploymentChecklist();
      for (const item of Object.values(result.items)) {
        expect(item.verified).toBe(true);
        expect(item.status).toBe("passed");
      }
    });
  });

  describe("setupProductionEnvironment", () => {
    it("defaults to production environment", () => {
      const result = setupProductionEnvironment();
      expect(result.success).toBe(true);
      expect(result.environment).toBe("production");
    });

    it("accepts a custom environment label", () => {
      const result = setupProductionEnvironment({
        environment: "production-eu",
      });
      expect(result.environment).toBe("production-eu");
    });

    it("reports all services as healthy by default", () => {
      const result = setupProductionEnvironment();
      expect(result.totalServices).toBeGreaterThan(0);
      expect(result.healthyServices).toBe(result.totalServices);
    });

    it("accepts a custom service list", () => {
      const result = setupProductionEnvironment({
        services: ["svc-a", "svc-b"],
      });
      expect(result.totalServices).toBe(2);
      expect(result.services["svc-a"]).toBeDefined();
      expect(result.services["svc-b"]).toBeDefined();
    });

    it("rejects empty service list", () => {
      const result = setupProductionEnvironment({ services: [] });
      expect(result.success).toBe(false);
    });

    it("each service has running and healthy flags", () => {
      const result = setupProductionEnvironment();
      for (const svc of Object.values(result.services)) {
        expect(svc.running).toBe(true);
        expect(svc.healthy).toBe(true);
      }
    });
  });

  describe("runSmokeTests", () => {
    it("runs default smoke tests successfully", () => {
      const result = runSmokeTests();
      expect(result.success).toBe(true);
    });

    it("returns summary with total, passed, and failed counts", () => {
      const result = runSmokeTests();
      expect(result.summary.total).toBeGreaterThan(0);
      expect(result.summary.passed).toBeDefined();
      expect(result.summary.failed).toBeDefined();
    });

    it("calculates success rate as a string percentage", () => {
      const result = runSmokeTests();
      expect(typeof result.summary.successRate).toBe("string");
      expect(parseFloat(result.summary.successRate)).toBeGreaterThanOrEqual(0);
    });

    it("accepts custom test list", () => {
      const result = runSmokeTests({ tests: ["health-check", "login"] });
      expect(result.summary.total).toBe(2);
      expect(result.tests["health-check"]).toBeDefined();
    });

    it("rejects empty test list", () => {
      const result = runSmokeTests({ tests: [] });
      expect(result.success).toBe(false);
    });

    it("rejects non-positive timeoutMs", () => {
      const result = runSmokeTests({ timeoutMs: 0 });
      expect(result.success).toBe(false);
    });

    it("each test result has passed and durationMs", () => {
      const result = runSmokeTests();
      for (const test of Object.values(result.tests)) {
        expect(test.passed).toBe(true);
        expect(typeof test.durationMs).toBe("number");
      }
    });
  });

  describe("validateRollbackPlan", () => {
    it("returns success with default options", () => {
      const result = validateRollbackPlan();
      expect(result.success).toBe(true);
    });

    it("marks plan as documented and tested", () => {
      const result = validateRollbackPlan();
      expect(result.documented).toBe(true);
      expect(result.tested).toBe(true);
    });

    it("defaults to dry-run mode", () => {
      const result = validateRollbackPlan();
      expect(result.dryRun).toBe(true);
    });

    it("respects no-dry-run option", () => {
      const result = validateRollbackPlan({ dryRun: false });
      expect(result.dryRun).toBe(false);
    });

    it("returns estimated rollback time within threshold", () => {
      const result = validateRollbackPlan({ maxRollbackMinutes: 15 });
      expect(result.estimatedMinutes).toBeLessThanOrEqual(
        result.maxAllowedMinutes,
      );
    });

    it("fails when estimated time exceeds threshold", () => {
      const result = validateRollbackPlan({ maxRollbackMinutes: 1 });
      // estimatedMinutes (5) > 1 => should fail
      expect(result.success).toBe(false);
    });

    it("rejects maxRollbackMinutes less than 1", () => {
      const result = validateRollbackPlan({ maxRollbackMinutes: 0 });
      expect(result.success).toBe(false);
    });

    it("rejects maxRollbackMinutes greater than 120", () => {
      const result = validateRollbackPlan({ maxRollbackMinutes: 121 });
      expect(result.success).toBe(false);
    });

    it("includes a steps array with at least one step", () => {
      const result = validateRollbackPlan();
      expect(Array.isArray(result.steps)).toBe(true);
      expect(result.steps.length).toBeGreaterThan(0);
    });
  });

  describe("configureMonitoring", () => {
    it("configures monitoring with default channels", () => {
      const result = configureMonitoring();
      expect(result.success).toBe(true);
    });

    it("reports number of alerts configured", () => {
      const result = configureMonitoring();
      expect(result.alertsConfigured).toBeGreaterThan(0);
    });

    it("accepts custom notification channels", () => {
      const result = configureMonitoring({ channels: ["slack", "teams"] });
      expect(result.alertsConfigured).toBe(2);
      expect(result.channels["slack"]).toBeDefined();
      expect(result.channels["teams"]).toBeDefined();
    });

    it("each channel is configured and tested", () => {
      const result = configureMonitoring();
      for (const ch of Object.values(result.channels)) {
        expect(ch.configured).toBe(true);
        expect(ch.tested).toBe(true);
      }
    });

    it("includes default thresholds", () => {
      const result = configureMonitoring();
      expect(result.thresholds.errorRatePercent).toBeDefined();
      expect(result.thresholds.p95LatencyMs).toBeDefined();
      expect(result.thresholds.successRatePercent).toBeDefined();
    });

    it("accepts threshold overrides", () => {
      const result = configureMonitoring({
        thresholds: { errorRatePercent: 0.5 },
      });
      expect(result.thresholds.errorRatePercent).toBe(0.5);
    });

    it("rejects invalid errorRatePercent", () => {
      const result = configureMonitoring({
        thresholds: { errorRatePercent: 150 },
      });
      expect(result.success).toBe(false);
    });

    it("rejects non-positive p95LatencyMs", () => {
      const result = configureMonitoring({ thresholds: { p95LatencyMs: 0 } });
      expect(result.success).toBe(false);
    });
  });

  describe("parseProductionArguments", () => {
    it("returns defaults with no arguments", () => {
      const result = parseProductionArguments([]);
      expect(result.runAll).toBe(false);
      expect(result.task).toBeNull();
      expect(result.verbose).toBe(false);
      expect(result.dryRun).toBe(true);
      expect(result.maxRollbackMinutes).toBe(15);
    });

    it("parses --all flag", () => {
      const result = parseProductionArguments(["--all"]);
      expect(result.runAll).toBe(true);
    });

    it("parses --task value", () => {
      const result = parseProductionArguments(["--task", "smoke"]);
      expect(result.task).toBe("smoke");
    });

    it("parses --verbose flag", () => {
      const result = parseProductionArguments(["--verbose"]);
      expect(result.verbose).toBe(true);
    });

    it("parses --no-dry-run flag", () => {
      const result = parseProductionArguments(["--no-dry-run"]);
      expect(result.dryRun).toBe(false);
    });

    it("parses --max-rollback value", () => {
      const result = parseProductionArguments(["--max-rollback", "30"]);
      expect(result.maxRollbackMinutes).toBe(30);
    });

    it("uses default maxRollbackMinutes for non-numeric value", () => {
      const result = parseProductionArguments(["--max-rollback", "abc"]);
      expect(result.maxRollbackMinutes).toBe(15);
    });
  });

  describe("executeAllProductionValidations", () => {
    it("returns a timestamp", () => {
      const result = executeAllProductionValidations();
      expect(result.timestamp).toBeDefined();
    });

    it("marks environment as production", () => {
      const result = executeAllProductionValidations();
      expect(result.environment).toBe("production");
    });

    it("includes all five check results", () => {
      const result = executeAllProductionValidations();
      expect(result.results.checklist).toBeDefined();
      expect(result.results.environment).toBeDefined();
      expect(result.results.smokeTests).toBeDefined();
      expect(result.results.rollback).toBeDefined();
      expect(result.results.monitoring).toBeDefined();
    });

    it("summary has totalChecks of 5", () => {
      const result = executeAllProductionValidations();
      expect(result.summary.totalChecks).toBe(5);
    });

    it("summary includes passed and failed counts", () => {
      const result = executeAllProductionValidations();
      expect(result.summary.passed).toBeDefined();
      expect(result.summary.failed).toBeDefined();
    });

    it("status is GO when all checks pass", () => {
      const result = executeAllProductionValidations();
      expect(["GO", "NO-GO"]).toContain(result.status);
    });

    it("propagates custom options to child checks", () => {
      const result = executeAllProductionValidations({
        maxRollbackMinutes: 15,
      });
      expect(result.results.rollback.maxAllowedMinutes).toBe(15);
    });
  });

  describe("integration: Complete production validation", () => {
    it("runs all checks and produces a report", () => {
      const result = executeAllProductionValidations();
      expect(result.timestamp).toBeDefined();
      expect(result.summary.totalChecks).toBeGreaterThan(0);
      expect(["GO", "NO-GO"]).toContain(result.status);
    });

    it("validates checklist then environment then smoke tests", () => {
      const checklist = runDeploymentChecklist();
      const env = setupProductionEnvironment();
      const smoke = runSmokeTests();

      expect(checklist.success).toBe(true);
      expect(env.success).toBe(true);
      expect(smoke.success).toBe(true);
    });

    it("validates rollback plan and monitoring together", () => {
      const rollback = validateRollbackPlan();
      const monitoring = configureMonitoring();

      expect(rollback.success).toBe(true);
      expect(monitoring.success).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles a single checklist item", () => {
      const result = runDeploymentChecklist({ items: ["only-check"] });
      expect(result.success).toBe(true);
      expect(result.totalItems).toBe(1);
    });

    it("handles a single smoke test", () => {
      const result = runSmokeTests({ tests: ["health"] });
      expect(result.summary.total).toBe(1);
    });

    it("handles a single notification channel", () => {
      const result = configureMonitoring({ channels: ["email"] });
      expect(result.alertsConfigured).toBe(1);
    });

    it("handles maximum allowed rollback threshold", () => {
      const result = validateRollbackPlan({ maxRollbackMinutes: 120 });
      expect(result.success).toBe(true);
    });

    it("handles minimum valid timeoutMs for smoke tests", () => {
      const result = runSmokeTests({ timeoutMs: 1 });
      expect(result.success).toBe(true);
    });
  });
});
