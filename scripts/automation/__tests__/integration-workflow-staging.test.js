// Import production helpers for staging environment validation workflow
const {
  validateStagingEnvironment,
  runPerformanceBench,
  validateDataIntegrity,
  runComplianceChecks,
  generateStagingReport,
} = require("../integration-workflow-staging-helpers.js");

describe("integration: staging & production readiness workflow", () => {
  describe("staging environment validation orchestration", () => {
    const mockStagingEnv = {
      name: "staging",
      config: {
        database: "postgres://staging",
        secrets: true,
        api_keys: true,
      },
      services: [
        { name: "api", status: "healthy" },
        { name: "db", status: "healthy" },
        { name: "cache", status: "healthy" },
      ],
      compliance: {
        encrypted: true,
        audited: true,
        backups_enabled: true,
        gdpr_compliant: true,
        retention_policy: true,
        retention_days: 30,
        encryption: "AES-256",
      },
      security: {
        rbac_enabled: true,
      },
      data: {
        count: 10000,
        indexed: true,
        lastIndexed: new Date().toISOString(),
        inconsistencies: [],
      },
    };

    it("validates staging environment configuration", () => {
      const validation = validateStagingEnvironment(mockStagingEnv);
      expect(validation.validators.configIntegrity.status).toBe("PASS");
    });

    it("checks all service health indicators", () => {
      const validation = validateStagingEnvironment(mockStagingEnv);
      expect(validation.validators.serviceHealth.status).toBe("PASS");
      expect(validation.validators.serviceHealth.checks.api_service).toBe(true);
      expect(validation.validators.serviceHealth.checks.database_service).toBe(
        true,
      );
    });

    it("validates data compliance settings", () => {
      const validation = validateStagingEnvironment(mockStagingEnv);
      expect(validation.validators.dataCompliance.status).toBe("PASS");
      expect(validation.validators.dataCompliance.checks.data_encrypted).toBe(
        true,
      );
      expect(validation.validators.dataCompliance.checks.audit_enabled).toBe(
        true,
      );
    });

    it("determines overall environment status from validators", () => {
      const validation = validateStagingEnvironment(mockStagingEnv);
      expect(validation.overallStatus).toBe("PASS");
      expect(validation.criticalIssues.length).toBe(0);
    });

    it("identifies critical issues during validation", () => {
      const brokenEnv = {
        ...mockStagingEnv,
        config: null,
      };

      const validation = validateStagingEnvironment(brokenEnv);
      expect(validation.overallStatus).toBe("FAIL");
      expect(validation.criticalIssues).toContain(
        "Configuration integrity check failed",
      );
    });
  });

  describe("performance benchmarking in staging", () => {
    it("runs performance scenarios against staging environment", () => {
      const scenarios = [
        { name: "API Response Time", operations: 100, threshold: 500 },
        { name: "Database Query Time", operations: 50, threshold: 1000 },
      ];

      const mockEnv = { name: "staging" };
      const perfResults = runPerformanceBench(mockEnv, scenarios);

      expect(perfResults.scenarios.length).toBe(2);
      expect(perfResults.summary.totalTests).toBe(150);
    });

    it("calculates average latency across all operations", () => {
      const scenarios = [
        { name: "Test Scenario", operations: 20, threshold: 500 },
      ];
      const mockEnv = { name: "staging" };
      const perfResults = runPerformanceBench(mockEnv, scenarios);

      expect(perfResults.summary.avgLatency).toBeGreaterThan(0);
      expect(perfResults.summary.avgLatency).toBeLessThan(300);
    });

    it("identifies slow operations exceeding thresholds", () => {
      // Mock Math.random to return a fixed value that produces latency > 60ms
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.6); // 0.6 * 200 + 50 = 170ms

      try {
        // Scenarios with strict thresholds should reveal slow operations
        const scenarios = [
          { name: "Strict Threshold", operations: 50, threshold: 60 },
        ];
        const mockEnv = { name: "staging" };
        const perfResults = runPerformanceBench(mockEnv, scenarios);

        expect(perfResults.summary.totalTests).toBeGreaterThan(0);
        // All operations will exceed 60ms threshold with fixed mock
        expect(perfResults.scenarios[0].avgLatency).toBeGreaterThan(60);
      } finally {
        Math.random = originalRandom;
      }
    });

    it("tracks performance duration for benchmarking", () => {
      const scenarios = [{ name: "Duration Test", operations: 10 }];
      const mockEnv = { name: "staging" };
      const perfResults = runPerformanceBench(mockEnv, scenarios);

      expect(perfResults.duration).toBeGreaterThanOrEqual(0);
      expect(perfResults.endTime).toBeGreaterThanOrEqual(perfResults.startTime);
    });
  });

  describe("data integrity validation", () => {
    it("checks data presence and count", () => {
      const env = {
        name: "staging",
        data: { count: 5000, indexed: true },
      };

      const validation = validateDataIntegrity(env, {});
      expect(validation.dataChecks[0].status).toBe("PASS");
      expect(validation.dataChecks[0].count).toBe(5000);
    });

    it("validates indexing status", () => {
      const env = {
        name: "staging",
        data: { indexed: true, lastIndexed: new Date().toISOString() },
      };

      const validation = validateDataIntegrity(env, {});
      expect(validation.indexing.status).toBe("PASS");
    });

    it("detects consistency issues", () => {
      const env = {
        name: "staging",
        data: {
          count: 1000,
          indexed: true,
          inconsistencies: ["orphaned_records: 5", "missing_references: 2"],
        },
      };

      const validation = validateDataIntegrity(env, {});
      expect(validation.consistency.status).toBe("FAIL");
      expect(validation.consistency.issues.length).toBe(2);
    });
  });

  describe("compliance checks orchestration", () => {
    it("runs GDPR compliance check", () => {
      const env = {
        name: "staging",
        compliance: {
          gdpr_compliant: true,
          retention_policy: true,
          retention_days: 30,
        },
      };

      const results = runComplianceChecks(env, {
        requireGDPR: true,
        requireRetention: true,
        minRetentionDays: 30,
      });
      expect(results.checks.some((c) => c.name === "GDPR Compliance")).toBe(
        true,
      );
    });

    it("validates data retention policies", () => {
      const env = {
        name: "staging",
        compliance: { retention_policy: true, retention_days: 90 },
      };

      const results = runComplianceChecks(env, { minRetentionDays: 30 });
      const retentionCheck = results.checks.find(
        (c) => c.name === "Data Retention Policy",
      );
      expect(retentionCheck.status).toBe("PASS");
    });

    it("checks encryption standards", () => {
      const env = {
        name: "staging",
        compliance: { encryption: "AES-256" },
        security: { rbac_enabled: true },
      };

      const results = runComplianceChecks(env, {});
      expect(
        results.checks.some(
          (c) => c.name === "Encryption Standard" && c.status === "PASS",
        ),
      ).toBe(true);
    });

    it("verifies access control mechanisms", () => {
      const env = {
        name: "staging",
        security: { rbac_enabled: true },
      };

      const results = runComplianceChecks(env, {});
      const accessCheck = results.checks.find(
        (c) => c.name === "Access Control",
      );
      expect(accessCheck.status).toBe("PASS");
    });

    it("counts passed and failed compliance checks", () => {
      const env = {
        name: "staging",
        compliance: {
          gdpr_compliant: true,
          retention_policy: true,
          retention_days: 30,
          encryption: "AES-256",
        },
        security: { rbac_enabled: true },
      };

      const results = runComplianceChecks(env, {
        requireGDPR: true,
        minRetentionDays: 30,
      });
      expect(results.summary.total).toBe(4);
      expect(results.summary.passed).toBeGreaterThan(0);
    });
  });

  describe("full staging to production readiness workflow", () => {
    it("completes full workflow: validate → bench → integrity → compliance → readiness report", () => {
      const stagingEnv = {
        name: "staging",
        config: {
          database: "postgres://staging",
          secrets: true,
          api_keys: true,
        },
        services: [
          { name: "api", status: "healthy" },
          { name: "db", status: "healthy" },
        ],
        compliance: {
          encrypted: true,
          audited: true,
          gdpr_compliant: true,
          retention_policy: true,
          retention_days: 30,
          encryption: "AES-256",
        },
        security: { rbac_enabled: true },
        data: { count: 5000, indexed: true, inconsistencies: [] },
      };

      // Step 1: Environment Validation
      const envValidation = validateStagingEnvironment(stagingEnv);
      expect(envValidation.overallStatus).toBe("PASS");

      // Step 2: Performance Benchmarking
      const perfBench = runPerformanceBench(stagingEnv, [
        { name: "API Test", operations: 50 },
      ]);
      expect(perfBench.summary.totalTests).toBe(50);

      // Step 3: Data Integrity
      const dataIntegrity = validateDataIntegrity(stagingEnv, {});
      expect(dataIntegrity.consistency.status).toBe("PASS");

      // Step 4: Compliance
      const compliance = runComplianceChecks(stagingEnv, {
        requireGDPR: true,
        requireRetention: true,
        minRetentionDays: 30,
      });
      expect(compliance.summary.total).toBeGreaterThan(0);

      // Step 5: Generate Readiness Report
      const report = generateStagingReport(
        envValidation,
        perfBench,
        dataIntegrity,
        compliance,
      );
      expect(report.environment).toBe("staging");
      expect(report.readinessScore).toBeGreaterThan(0);
      expect(report.ready).toBe(true);
    });

    it("identifies environment not ready for production", () => {
      const unreadyEnv = {
        name: "staging",
        config: null, // Missing critical config
        services: [{ name: "api", status: "down" }],
        compliance: { gdpr_compliant: false },
        security: { rbac_enabled: false },
        data: { count: 0, inconsistencies: ["critical_data_missing"] },
      };

      const envValidation = validateStagingEnvironment(unreadyEnv);
      const perfBench = runPerformanceBench(unreadyEnv, []);
      const dataIntegrity = validateDataIntegrity(unreadyEnv, {});
      const compliance = runComplianceChecks(unreadyEnv, { requireGDPR: true });

      const report = generateStagingReport(
        envValidation,
        perfBench,
        dataIntegrity,
        compliance,
      );
      expect(report.ready).toBe(false);
    });
  });

  describe("multi-validator orchestration", () => {
    it("coordinates multiple validators in single workflow", () => {
      const env = {
        name: "staging",
        config: { database: "test", secrets: true, api_keys: true },
        services: [
          { name: "api", status: "healthy" },
          { name: "db", status: "healthy" },
        ],
        compliance: {
          encrypted: true,
          audited: true,
          gdpr_compliant: true,
          encryption: "AES-256",
        },
        security: { rbac_enabled: true },
        data: { count: 1000, indexed: true, inconsistencies: [] },
      };

      const envVal = validateStagingEnvironment(env);
      const perfVal = runPerformanceBench(env, [
        { name: "Test", operations: 10 },
      ]);
      const dataVal = validateDataIntegrity(env, {});
      const compVal = runComplianceChecks(env, {});

      expect(envVal.overallStatus).toBe("PASS");
      expect(perfVal.summary.totalTests).toBe(10);
      expect(dataVal.consistency.status).toBe("PASS");
      expect(compVal.summary.total).toBeGreaterThan(0);
    });

    it("handles concurrent validator execution", () => {
      const env = {
        name: "staging",
        config: { database: "test", secrets: true, api_keys: true },
        services: [{ name: "api", status: "healthy" }],
        compliance: {
          encrypted: true,
          gdpr_compliant: true,
          encryption: "AES-256",
        },
        security: { rbac_enabled: true },
        data: { count: 5000, indexed: true, inconsistencies: [] },
      };

      const start = Date.now();

      const val1 = validateStagingEnvironment(env);
      const val2 = validateDataIntegrity(env, {});
      const val3 = runComplianceChecks(env, {});

      const elapsed = Date.now() - start;

      expect(val1).toBeDefined();
      expect(val2).toBeDefined();
      expect(val3).toBeDefined();
      expect(elapsed).toBeLessThan(1000); // All validators should complete quickly
    });
  });

  describe("error handling and recovery in staging workflow", () => {
    it("continues validation despite individual validator failures", () => {
      const partiallyBrokenEnv = {
        name: "staging",
        config: { database: null, secrets: null, api_keys: null },
        services: [{ name: "api", status: "healthy" }],
        compliance: { encrypted: true, audited: true, gdpr_compliant: true },
        security: { rbac_enabled: true },
        data: { count: 5000, indexed: true, inconsistencies: [] },
      };

      const envVal = validateStagingEnvironment(partiallyBrokenEnv);
      expect(envVal.overallStatus).toBe("FAIL");

      // But other validators should still run
      const dataVal = validateDataIntegrity(partiallyBrokenEnv, {});
      expect(dataVal.consistency.status).toBe("PASS");
    });

    it("handles missing data gracefully", () => {
      const incompleteEnv = {
        name: "staging",
        // Missing services, compliance, security, data
      };

      const validation = validateStagingEnvironment(incompleteEnv);
      expect(validation.validators.configIntegrity.status).toBe("FAIL");
    });
  });

  describe("staging readiness scoring", () => {
    it("calculates readiness score based on all validations", () => {
      const goodEnv = {
        name: "staging",
        config: { database: "test", secrets: true, api_keys: true },
        services: [
          { name: "api", status: "healthy" },
          { name: "db", status: "healthy" },
        ],
        compliance: { encrypted: true, audited: true, encryption: "AES-256" },
        security: { rbac_enabled: true },
        data: { count: 1000, indexed: true, inconsistencies: [] },
      };

      const envVal = validateStagingEnvironment(goodEnv);
      const dataVal = validateDataIntegrity(goodEnv, {});
      const compVal = runComplianceChecks(goodEnv, {});
      const perfVal = runPerformanceBench(goodEnv, []);

      const report = generateStagingReport(envVal, perfVal, dataVal, compVal);
      expect(report.readinessScore).toEqual(90);
    });

    it("penalizes environment readiness for critical failures", () => {
      const badEnv = {
        name: "staging",
        config: null,
        services: [{ name: "api", status: "down" }],
        compliance: { encrypted: false, encryption: "none" },
        security: { rbac_enabled: false },
        data: { count: 0, indexed: false, inconsistencies: ["critical_issue"] },
      };

      const envVal = validateStagingEnvironment(badEnv);
      const dataVal = validateDataIntegrity(badEnv, {});
      const compVal = runComplianceChecks(badEnv, {});
      const perfVal = runPerformanceBench(badEnv, []);

      const report = generateStagingReport(envVal, perfVal, dataVal, compVal);
      expect(report.readinessScore).toBeLessThan(50);
    });
  });

  describe("performance: large-scale staging validation", () => {
    it("handles validation of complex multi-service environments", () => {
      const complexEnv = {
        name: "staging",
        config: { database: "test", secrets: true, api_keys: true },
        services: Array.from({ length: 20 }, (_, i) => ({
          name: `service-${i}`,
          status: i % 3 === 0 ? "warning" : "healthy",
        })),
        compliance: {
          encrypted: true,
          audited: true,
          encryption: "AES-256",
        },
        security: { rbac_enabled: true },
        data: { count: 50000, indexed: true, inconsistencies: [] },
      };

      const start = Date.now();
      const validation = validateStagingEnvironment(complexEnv);
      const elapsed = Date.now() - start;

      expect(validation.validators).toBeDefined();
      expect(elapsed).toBeLessThan(500);
    });

    it("benchmarks performance across multiple large scenarios", () => {
      const scenarios = Array.from({ length: 10 }, (_, i) => ({
        name: `Scenario ${i}`,
        operations: 200,
        threshold: 500,
      }));

      const env = { name: "staging" };
      const start = Date.now();
      const results = runPerformanceBench(env, scenarios);
      const elapsed = Date.now() - start;

      expect(results.summary.totalTests).toBe(2000);
      expect(elapsed).toBeLessThan(2000);
    });
  });

  describe("state consistency in staging validation cycles", () => {
    it("maintains consistent validation results across re-runs", () => {
      const env = {
        name: "staging",
        config: { database: "test", secrets: true, api_keys: true },
        services: [{ name: "api", status: "healthy" }],
        compliance: {
          encrypted: true,
          gdpr_compliant: true,
          encryption: "AES-256",
        },
        security: { rbac_enabled: true },
        data: { count: 5000, indexed: true, inconsistencies: [] },
      };

      // First run
      const val1 = validateStagingEnvironment(env);
      const perf1 = runPerformanceBench(env, [
        { name: "Test", operations: 10 },
      ]);
      const data1 = validateDataIntegrity(env, {});
      const comp1 = runComplianceChecks(env, {});

      // Second run
      const val2 = validateStagingEnvironment(env);
      const perf2 = runPerformanceBench(env, [
        { name: "Test", operations: 10 },
      ]);
      const data2 = validateDataIntegrity(env, {});
      const comp2 = runComplianceChecks(env, {});

      // Results should be consistent
      expect(val1.overallStatus).toBe(val2.overallStatus);
      expect(perf1.summary.totalTests).toBe(perf2.summary.totalTests);
      expect(data1.consistency.status).toBe(data2.consistency.status);
      expect(comp1.summary.total).toBe(comp2.summary.total);
    });
  });
});
