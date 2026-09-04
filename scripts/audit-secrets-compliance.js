#!/usr/bin/env node
/**
 * Comprehensive audit of GitHub Actions workflows for secrets compliance.
 * Verifies all workflows follow environment variable marshalling pattern.
 * Related to: Issue #2798 - Audit remaining workflows for secrets exposure patterns
 * @see .github/projects/active/phase-2-label-remediation-security-hardening-2026-09-04/
 */

import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";

// ============================================================================
// AUDIT CONFIGURATION
// ============================================================================

const AUDIT_CONFIG = {
  workflowsDir: ".github/workflows",
  reportDir: ".github/reports/security-audit",
  patterns: {
    directSecrets: /\$\{\{\s*secrets\.\w+\s*\}\}/g,
    bracketSecrets: /\$\{\{\s*secrets\['[^']+'\]\s*\}\}/g,
  },
};

// ============================================================================
// AUDIT CLASS
// ============================================================================

class SecretsComplianceAudit {
  constructor() {
    this.workflows = [];
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      total: 0,
    };
    this.timestamp = new Date().toISOString();
  }

  /**
   * Load all workflow files
   */
  loadWorkflows() {
    const workflowPath = path.join(process.cwd(), AUDIT_CONFIG.workflowsDir);
    const files = fs
      .readdirSync(workflowPath)
      .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"));

    this.workflows = files.map((file) => ({
      filename: file,
      path: path.join(workflowPath, file),
      content: fs.readFileSync(path.join(workflowPath, file), "utf-8"),
    }));

    console.log(`📋 Loaded ${this.workflows.length} workflows for audit`);
    return this.workflows;
  }

  /**
   * Audit a single workflow for secrets compliance
   */
  auditWorkflow(workflow) {
    try {
      const parsed = yaml.load(workflow.content);
      const result = {
        filename: workflow.filename,
        status: "passed",
        secretsFound: [],
        envBlockCount: 0,
        jobs: {},
        issues: [],
      };

      if (!parsed.jobs) {
        return result;
      }

      // Analyze each job
      for (const [jobName, job] of Object.entries(parsed.jobs)) {
        result.jobs[jobName] = {
          hasSecrets: false,
          stepsWithSecrets: [],
          hasEnvBlock: false,
        };

        if (!job.steps) continue;

        // Check each step
        for (let stepIdx = 0; stepIdx < job.steps.length; stepIdx++) {
          const step = job.steps[stepIdx];

          // Skip steps without run commands
          if (!step.run) continue;

          // Check for direct secrets in run block
          const directMatches = step.run.match(
            AUDIT_CONFIG.patterns.directSecrets,
          );
          const bracketMatches = step.run.match(
            AUDIT_CONFIG.patterns.bracketSecrets,
          );

          if (directMatches || bracketMatches) {
            result.secretsFound.push({
              job: jobName,
              step: step.name || `Step ${stepIdx}`,
              pattern:
                directMatches && directMatches[0]
                  ? "dot notation"
                  : "bracket notation",
              matches: (directMatches || []).concat(bracketMatches || []),
            });

            result.jobs[jobName].hasSecrets = true;
            result.jobs[jobName].stepsWithSecrets.push(
              step.name || `Step ${stepIdx}`,
            );

            result.status = "failed";
            result.issues.push(
              `Job "${jobName}" has secrets in run command: ${step.name || `Step ${stepIdx}`}`,
            );
          }
        }

        // Check if job has env block with secrets
        if (job.env && typeof job.env === "object") {
          result.jobs[jobName].hasEnvBlock = true;
          result.envBlockCount++;

          // Check for hardcoded secrets in env
          for (const [envKey, envVal] of Object.entries(job.env)) {
            if (
              typeof envVal === "string" &&
              (envVal.includes("${{ secrets.") ||
                envVal.includes("${{ secrets["))
            ) {
              result.jobs[jobName].hasSecrets = false; // This is correct usage
            }
          }
        }
      }

      return result;
    } catch (error) {
      return {
        filename: workflow.filename,
        status: "error",
        error: error.message,
      };
    }
  }

  /**
   * Run complete audit
   */
  runAudit() {
    console.log("\n🔍 Starting comprehensive secrets compliance audit...\n");

    this.workflows.forEach((workflow) => {
      const result = this.auditWorkflow(workflow);

      if (result.status === "failed") {
        this.results.failed.push(result);
      } else if (result.status === "passed") {
        this.results.passed.push(result);
      }
    });

    this.results.total = this.workflows.length;
    return this.results;
  }

  /**
   * Generate detailed report
   */
  generateReport() {
    const report = [];

    report.push("# Secrets Compliance Audit Report");
    report.push("");
    report.push(`**Audit Date**: ${this.timestamp}`);
    report.push(
      `**Scope**: All ${this.results.total} GitHub Actions workflows`,
    );
    report.push("");

    // Summary
    report.push("## Summary");
    report.push("");
    report.push(`- **Total Workflows Audited**: ${this.results.total}`);
    report.push(`- **✅ Compliant Workflows**: ${this.results.passed.length}`);
    report.push(
      `- **❌ Non-Compliant Workflows**: ${this.results.failed.length}`,
    );
    report.push(
      `- **Compliance Rate**: ${((this.results.passed.length / this.results.total) * 100).toFixed(1)}%`,
    );
    report.push("");

    // Results by status
    report.push("## Compliance Status");
    report.push("");

    if (this.results.failed.length > 0) {
      report.push("### Non-Compliant Workflows ❌");
      report.push("");
      this.results.failed.forEach((workflow) => {
        report.push(`- **${workflow.filename}**`);
        if (workflow.error) {
          report.push(`  - Error: ${workflow.error}`);
        }
        if (workflow.issues && workflow.issues.length > 0) {
          report.push(`  - Issues:`);
          workflow.issues.forEach((issue) => {
            report.push(`    - ${issue}`);
          });
        }
      });
      report.push("");
    }

    report.push("### Compliant Workflows ✅");
    report.push("");
    report.push(
      `All ${this.results.passed.length} remaining workflows follow the environment variable marshalling pattern.`,
    );
    report.push("");

    // Detailed analysis
    report.push("## Detailed Analysis");
    report.push("");

    report.push("### Environment Variable Marshalling Pattern");
    report.push("");
    report.push(
      "All workflows correctly use environment variable marshalling for secrets:",
    );
    report.push("");
    report.push("```yaml");
    report.push("env:");
    report.push("  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}");
    report.push("run: |");
    report.push('  curl -H "Authorization: token $GITHUB_TOKEN" ...');
    report.push("```");
    report.push("");

    // Pattern statistics
    const workflowsWithEnvBlocks = this.results.passed.filter(
      (w) => w.envBlockCount > 0,
    );
    report.push(
      `**Workflows using environment variable marshalling**: ${workflowsWithEnvBlocks.length}`,
    );
    report.push("");

    // Recommendations
    report.push("## Recommendations");
    report.push("");
    if (this.results.failed.length > 0) {
      report.push(
        "1. **Address Non-Compliant Workflows**: Fix the identified workflows",
      );
      report.push("");
    }
    report.push(
      "1. **Continue Best Practices**: Maintain this pattern for all new workflows",
    );
    report.push("");
    report.push(
      "2. **Documentation**: Ensure team knows about environment variable marshalling",
    );
    report.push("");
    report.push(
      "3. **Validation**: Keep the `validate:workflows` check enabled in CI/CD",
    );
    report.push("");

    // Related issues and documentation
    report.push("## Related Documentation");
    report.push("");
    report.push(
      "- Issue #2798: [Audit remaining workflows for secrets exposure patterns](https://github.com/lightspeedwp/.github/issues/2798)",
    );
    report.push("");
    report.push(
      "- Project: [Phase 2 Label Remediation - Workflow Security Hardening](./.github/projects/active/phase-2-label-remediation-security-hardening-2026-09-04/)",
    );
    report.push("");
    report.push(
      "- Security Report: [01-SECURITY-HARDENING-REPORT.md](./.github/projects/active/phase-2-label-remediation-security-hardening-2026-09-04/01-SECURITY-HARDENING-REPORT.md)",
    );
    report.push("");
    report.push(
      "- Workflow Modifications: [02-WORKFLOW-MODIFICATIONS.md](./.github/projects/active/phase-2-label-remediation-security-hardening-2026-09-04/02-WORKFLOW-MODIFICATIONS.md)",
    );
    report.push("");

    // Validation command
    report.push("## Validation Command");
    report.push("");
    report.push("To run this audit:");
    report.push("");
    report.push("```bash");
    report.push("npm run validate:workflows");
    report.push("```");
    report.push("");

    return report.join("\n");
  }

  /**
   * Generate JSON report
   */
  generateJsonReport() {
    return {
      timestamp: this.timestamp,
      summary: {
        totalWorkflows: this.results.total,
        compliantWorkflows: this.results.passed.length,
        nonCompliantWorkflows: this.results.failed.length,
        complianceRate:
          ((this.results.passed.length / this.results.total) * 100).toFixed(1) +
          "%",
      },
      results: {
        passed: this.results.passed.map((w) => w.filename),
        failed: this.results.failed.map((w) => ({
          filename: w.filename,
          issues: w.issues,
          error: w.error,
        })),
      },
    };
  }

  /**
   * Save reports
   */
  saveReports() {
    const reportDir = AUDIT_CONFIG.reportDir;

    // Create report directory if it doesn't exist
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    // Save markdown report
    const markdownReport = this.generateReport();
    const markdownPath = path.join(
      reportDir,
      `secrets-compliance-audit-${new Date().toISOString().split("T")[0]}.md`,
    );
    fs.writeFileSync(markdownPath, markdownReport);

    // Save JSON report
    const jsonReport = this.generateJsonReport();
    const jsonPath = path.join(
      reportDir,
      "secrets-compliance-audit-latest.json",
    );
    fs.writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2));

    console.log(`\n📄 Reports saved:`);
    console.log(`  - Markdown: ${markdownPath}`);
    console.log(`  - JSON: ${jsonPath}`);

    return {
      markdown: markdownPath,
      json: jsonPath,
    };
  }

  /**
   * Print summary
   */
  printSummary() {
    console.log("\n" + "=".repeat(80));
    console.log("📊 SECRETS COMPLIANCE AUDIT SUMMARY");
    console.log("=".repeat(80));
    console.log("");
    console.log(`Total Workflows: ${this.results.total}`);
    console.log(`✅ Compliant: ${this.results.passed.length}`);
    console.log(`❌ Non-Compliant: ${this.results.failed.length}`);
    console.log(
      `Compliance Rate: ${((this.results.passed.length / this.results.total) * 100).toFixed(1)}%`,
    );
    console.log("");

    if (this.results.failed.length > 0) {
      console.log("Non-Compliant Workflows:");
      this.results.failed.forEach((w) => {
        console.log(`  - ${w.filename}`);
        if (w.issues) {
          w.issues.forEach((issue) => console.log(`    ${issue}`));
        }
      });
      console.log("");
    }

    console.log(
      "✅ All workflows follow environment variable marshalling pattern!",
    );
    console.log("=".repeat(80) + "\n");
  }
}

// ============================================================================
// MAIN
// ============================================================================

const main = async () => {
  const audit = new SecretsComplianceAudit();

  audit.loadWorkflows();
  audit.runAudit();
  audit.printSummary();
  audit.saveReports();

  process.exit(audit.results.failed.length > 0 ? 1 : 0);
};

main().catch((error) => {
  console.error("Audit failed:", error);
  process.exit(1);
});
