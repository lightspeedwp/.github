/**
 * integration-workflow-staging-helpers.js
 * Shared helper functions for staging environment validation and production readiness
 * Used by integration-workflow-staging.test.js and related staging workflows
 */

/**
 * Validates staging environment configuration and services
 */
function validateStagingEnvironment(environment) {
  const validation = {
    environment: environment.name,
    timestamp: new Date().toISOString(),
    validators: {},
    overallStatus: "PASS",
    criticalIssues: [],
  };

  // Validator 1: Configuration Integrity
  validation.validators.configIntegrity = {
    name: "Configuration Integrity",
    status:
      environment.config &&
      environment.config.database &&
      environment.config.secrets &&
      environment.config.api_keys
        ? "PASS"
        : "FAIL",
    checks: {
      database: !!environment.config?.database,
      secrets: !!environment.config?.secrets,
      api_keys: !!environment.config?.api_keys,
    },
  };

  if (validation.validators.configIntegrity.status === "FAIL") {
    validation.overallStatus = "FAIL";
    validation.criticalIssues.push("Configuration integrity check failed");
  }

  // Validator 2: Service Health
  const apiHealthy = environment.services?.some(
    (s) => s.name === "api" && s.status === "healthy",
  );
  const dbHealthy = environment.services?.some(
    (s) => s.name === "db" && s.status === "healthy",
  );
  validation.validators.serviceHealth = {
    name: "Service Health",
    status: apiHealthy && dbHealthy ? "PASS" : "FAIL",
    checks: {
      api_service: apiHealthy,
      database_service: dbHealthy,
    },
  };

  if (validation.validators.serviceHealth.status === "FAIL") {
    validation.overallStatus = "FAIL";
    validation.criticalIssues.push("Service health check failed");
  }

  // Validator 3: Data Compliance
  validation.validators.dataCompliance = {
    name: "Data Compliance",
    status:
      environment.compliance?.encrypted && environment.compliance?.audited
        ? "PASS"
        : "FAIL",
    checks: {
      data_encrypted: environment.compliance?.encrypted ?? false,
      audit_enabled: environment.compliance?.audited ?? false,
      backups: environment.compliance?.backups_enabled ?? false,
    },
  };

  if (validation.validators.dataCompliance.status === "FAIL") {
    if (validation.overallStatus !== "FAIL") {
      validation.overallStatus = "WARN";
    }
  }

  return validation;
}

/**
 * Runs performance benchmarks against staging environment
 */
function runPerformanceBench(environment, scenarios) {
  const results = {
    environment: environment.name,
    startTime: Date.now(),
    scenarios: [],
    summary: {
      totalTests: 0,
      passed: 0,
      failed: 0,
      avgLatency: 0,
    },
  };

  const latencies = [];

  scenarios.forEach((scenario) => {
    const scenarioResult = {
      name: scenario.name,
      operations: scenario.operations ?? 100,
      latencies: [],
      status: "PASS",
    };

    for (let i = 0; i < (scenario.operations ?? 100); i++) {
      const latency = Math.random() * 200 + 50; // Simulated latency 50-250ms
      scenarioResult.latencies.push(latency);
      latencies.push(latency);

      if (latency > (scenario.threshold ?? 500)) {
        scenarioResult.status = "SLOW";
      }
    }

    scenarioResult.avgLatency =
      scenarioResult.latencies.length > 0
        ? scenarioResult.latencies.reduce((a, b) => a + b, 0) /
          scenarioResult.latencies.length
        : 0;
    results.scenarios.push(scenarioResult);
    results.summary.totalTests += scenario.operations ?? 100;
  });

  results.summary.passed = results.scenarios.filter(
    (s) => s.status === "PASS",
  ).length;
  results.summary.failed = results.scenarios.filter(
    (s) => s.status === "SLOW",
  ).length;
  results.summary.avgLatency =
    latencies.length > 0
      ? latencies.reduce((a, b) => a + b, 0) / latencies.length
      : 0;
  results.endTime = Date.now();
  results.duration = results.endTime - results.startTime;

  return results;
}

/**
 * Validates data integrity of staging environment
 */
function validateDataIntegrity(environment, auditRules) {
  const validation = {
    environment: environment.name,
    dataChecks: [],
    indexing: {},
    consistency: { status: "PASS", issues: [] },
  };

  // Check data presence
  if (environment.data) {
    validation.dataChecks.push({
      type: "data_presence",
      status: environment.data.count > 0 ? "PASS" : "FAIL",
      count: environment.data.count,
    });

    // Check indexing
    validation.indexing = {
      indexed: environment.data.indexed ?? false,
      lastIndexed: environment.data.lastIndexed,
      status: environment.data.indexed ? "PASS" : "WARN",
    };
  }

  // Check consistency
  if (
    environment.data?.inconsistencies &&
    environment.data.inconsistencies.length > 0
  ) {
    validation.consistency.status = "FAIL";
    validation.consistency.issues = environment.data.inconsistencies;
  }

  return validation;
}

/**
 * Runs compliance checks against staging environment
 */
function runComplianceChecks(environment, complianceRules) {
  const results = {
    environment: environment.name,
    checks: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
    },
  };

  // GDPR Check
  const gdprCheck = {
    name: "GDPR Compliance",
    required: complianceRules.requireGDPR,
    status: environment.compliance?.gdpr_compliant ? "PASS" : "FAIL",
  };
  results.checks.push(gdprCheck);

  // Data Retention Check
  const retentionCheck = {
    name: "Data Retention Policy",
    required: complianceRules.requireRetention,
    status:
      environment.compliance?.retention_policy &&
      environment.compliance.retention_days >=
        (complianceRules.minRetentionDays ?? 0)
        ? "PASS"
        : "FAIL",
  };
  results.checks.push(retentionCheck);

  // Encryption Check
  const encryptionCheck = {
    name: "Encryption Standard",
    required: true,
    status: environment.compliance?.encryption === "AES-256" ? "PASS" : "WARN",
  };
  results.checks.push(encryptionCheck);

  // Access Control Check
  const accessCheck = {
    name: "Access Control",
    required: true,
    status: environment.security?.rbac_enabled ? "PASS" : "FAIL",
  };
  results.checks.push(accessCheck);

  results.checks.forEach((check) => {
    results.summary.total++;
    if (check.status === "PASS") {
      results.summary.passed++;
    } else if (check.status === "WARN") {
      results.summary.warnings++;
    } else {
      results.summary.failed++;
    }
  });

  return results;
}

/**
 * Calculates readiness score for staging environment
 */
function calculateReadinessScore(
  envValidation,
  dataIntegrity,
  complianceResults,
) {
  let score = 100;

  if (envValidation.validators.configIntegrity.status === "FAIL") score -= 25;
  if (envValidation.validators.serviceHealth.status === "FAIL") score -= 25;
  if (envValidation.validators.dataCompliance.status === "FAIL") score -= 10;
  if (dataIntegrity.consistency.status === "FAIL") score -= 20;
  if (complianceResults.summary.failed > 0)
    score -= complianceResults.summary.failed * 5;

  return Math.max(0, score);
}

/**
 * Determines if environment is ready to promote to production
 */
function canPromoteToProduction(
  envValidation,
  dataIntegrity,
  complianceResults,
) {
  return (
    envValidation.validators.configIntegrity.status === "PASS" &&
    envValidation.validators.serviceHealth.status === "PASS" &&
    envValidation.validators.dataCompliance.status === "PASS" &&
    dataIntegrity.consistency.status === "PASS" &&
    complianceResults.summary.failed === 0
  );
}

/**
 * Generates comprehensive staging to production readiness report
 */
function generateStagingReport(
  envValidation,
  perfBench,
  dataIntegrity,
  complianceResults,
) {
  return {
    timestamp: new Date().toISOString(),
    environment: envValidation.environment,
    readinessScore: calculateReadinessScore(
      envValidation,
      dataIntegrity,
      complianceResults,
    ),
    validationSummary: {
      configIntegrity: envValidation.validators.configIntegrity.status,
      serviceHealth: envValidation.validators.serviceHealth.status,
      dataCompliance: envValidation.validators.dataCompliance.status,
    },
    performanceSummary: {
      avgLatency: perfBench.summary.avgLatency,
      duration: perfBench.duration,
      scenarios: perfBench.summary.totalTests,
    },
    dataSummary: {
      consistency: dataIntegrity.consistency.status,
      indexing: dataIntegrity.indexing.status,
    },
    complianceSummary: {
      passed: complianceResults.summary.passed,
      total: complianceResults.summary.total,
      issues: complianceResults.summary.failed,
    },
    ready: canPromoteToProduction(
      envValidation,
      dataIntegrity,
      complianceResults,
    ),
  };
}

module.exports = {
  validateStagingEnvironment,
  runPerformanceBench,
  validateDataIntegrity,
  runComplianceChecks,
  calculateReadinessScore,
  canPromoteToProduction,
  generateStagingReport,
};
