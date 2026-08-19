#!/usr/bin/env node
/**
 * Workflow validation runner that enforces guardrails on GitHub Actions files.
 * @module scripts/validation/validate-workflows
 * @see ../../instructions/quality-assurance.instructions.md
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// ============================================================================
// GUARDRAILS CONFIGURATION
// ============================================================================

const GUARDRAILS = {
  // Security guardrails
  security: {
    enabled: true,
    rules: {
      // Workflows must explicitly define permissions
      explicitPermissions: {
        enabled: true,
        message: "Workflow must define explicit permissions block",
        level: "error",
      },
      // No secrets passed to shell
      noSecretsInShell: {
        enabled: true,
        message: "Do not pass secrets directly to shell commands",
        level: "error",
      },
      // Use pinned action versions
      pinnedActionVersions: {
        enabled: true,
        message: "All actions must use pinned versions (e.g., @v4, not @main)",
        level: "warning",
      },
      // No credentials in environment
      noCredsInEnv: {
        enabled: true,
        message: "Do not hardcode credentials in environment variables",
        level: "error",
      },
    },
  },

  // Performance guardrails
  performance: {
    enabled: true,
    rules: {
      // Workflows should use concurrency
      concurrencyControl: {
        enabled: true,
        message:
          "Workflow should define concurrency to prevent overlapping runs",
        level: "warning",
      },
      // Cache dependencies
      cacheDependencies: {
        enabled: true,
        message: "Use caching for npm/pip dependencies to improve performance",
        level: "warning",
      },
      // Minimize checkout depth
      checkoutDepth: {
        enabled: true,
        message: "Use fetch-depth to minimize checkout time",
        level: "warning",
      },
    },
  },

  // Quality guardrails
  quality: {
    enabled: true,
    rules: {
      // Clear job names
      clearJobNames: {
        enabled: true,
        message: "Job names should be clear and descriptive",
        level: "warning",
      },
      // Clear step names
      clearStepNames: {
        enabled: true,
        message: "Steps should have descriptive names (run: should have name:)",
        level: "warning",
      },
      // Use latest Node
      nodeVersion: {
        enabled: true,
        message: "Use LTS or latest Node version (>=18)",
        level: "warning",
      },
      // Proper error handling
      errorHandling: {
        enabled: true,
        message:
          "Use continue-on-error carefully; most jobs should fail on error",
        level: "warning",
      },
      // Keep workflow custom logic in Node scripts
      noBashWorkflowLogic: {
        enabled: true,
        message:
          "Do not use bash shell blocks for repo-owned workflow logic; use Node scripts",
        level: "error",
      },
    },
  },

  // Consistency guardrails
  consistency: {
    enabled: true,
    rules: {
      // Consistent trigger events
      triggerEvents: {
        enabled: true,
        message:
          "Workflows should use consistent trigger events (push, pull_request, workflow_dispatch)",
        level: "warning",
      },
      // Ubuntu latest
      osVersion: {
        enabled: true,
        message:
          "Use ubuntu-latest for consistency (avoid ubuntu-20.04, ubuntu-22.04)",
        level: "warning",
      },
    },
  },
};

const BASH_POLICY_ALLOWLIST = {
  shellBash: {
    "issue-labeling-automation.yml": ["Apply labels"],
    "issue-remediation-bulk.yml": ["Assign milestones"],
    "project-maintenance-nightly.yml": [
      "Run unified project maintenance script",
    ],
    "project-maintenance-on-demand.yml": [
      "Validate operation input",
      "Run audit mode",
      "Run create-docs mode",
      "Run validate mode",
      "Generate workflow summary",
    ],
  },
  multilineControlFlow: {
    "allocate-pr-issue-to-milestone.yml": [
      "Determine target PR/Issue",
      "Run allocation script",
    ],
    "badges-documentation-update.yml": [
      "Detect changed files",
      "Validate badge schema",
      "Generate and update badges",
    ],
    "badges-health-check.yml": [
      "Extract badge URLs",
      "Validate badge URLs",
      "Generate health report",
      "Find or create tracking issue",
      "Update or create issue",
      "Post workflow summary",
    ],
    "badges-readme-status.yml": [
      "Query workflow status",
      "Update README.md",
      "Validate badge URLs",
      "Report summary",
    ],
    "badges-workflow-audit.yml": [
      "Scan workflow directory",
      "Add new workflows to schema",
      "Report coverage metrics",
    ],
    "branch-name-validation.yml": [
      "Validate branch name",
      "Set status check status",
    ],
    "docs-maintenance.yml": ["Resolve impacted README files"],
    "docs-validation.yml": ["Identify changed README files"],
    "gitleaks-reusable.yml": ["Scan"],
    "gitleaks-update.yml": [
      "Resolve the latest stable release and its checksum",
      "Open the update pull request",
    ],
    "issue-remediation-automation.yml": [
      "Determine remediation target",
      "Aggregate remediation results",
      "Post remediation summary to job summary",
    ],
    "meta-agent-validation.yml": ["Validate frontmatter on changed files"],
    "project-maintenance-on-demand.yml": [
      "Validate operation input",
      "Run create-docs mode",
      "Run validate mode",
    ],
    "release.yml": ["Check branch is develop", "Verify VERSION file exists"],
    "validate-dor-dod-sections.yml": ["Run DoR/DoD Validation & Injection"],
    "validate-mermaid-pr.yml": [
      "Identify changed Markdown files",
      "Check for Mermaid diagrams in changed files",
      "Collect results",
    ],
    "validate-project-linking.yml": [
      "Check all active projects have related issues",
      "Validate issue numbers in related issues tables",
      "Report summary",
    ],
    "meta.yml": [
      "Validate frontmatter freshness",
      "Lint changed Markdown",
      "Collect Link Targets",
      "Update Metrics Snapshot",
    ],
    "project-meta-sync.yml": [
      "Preflight project sync configuration",
      "Collect labels from item",
    ],
    "readme-regen.yml": [
      "Resolve impacted README files",
      "Run README regeneration",
    ],
    "reporting.yml": [
      "Validate report structure",
      "Check for uppercase filenames",
      "Find stale reports",
      "Update main README",
    ],
  },
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

class WorkflowValidator {
  constructor(guardrails) {
    this.guardrails = guardrails;
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      warningCount: 0,
      errors: [],
      warnings: [],
    };
  }

  isAllowlistedMultilineControlFlow(filename, stepName) {
    if (!stepName) {
      return false;
    }

    const entries = BASH_POLICY_ALLOWLIST.multilineControlFlow[filename] || [];
    return entries.includes(stepName);
  }

  isAllowlistedShellBash(filename, stepName) {
    if (!stepName) {
      return false;
    }

    const entries = BASH_POLICY_ALLOWLIST.shellBash[filename] || [];
    return entries.includes(stepName);
  }

  validate(filename, content) {
    try {
      const workflow = yaml.load(content);

      if (!workflow) {
        this.addError(filename, "Invalid YAML content");
        return false;
      }

      let hasErrors = false;
      let hasWarnings = false;

      // Security checks
      if (this.guardrails.security.enabled) {
        hasErrors |= this.validateSecurity(filename, workflow);
      }

      // Performance checks
      if (this.guardrails.performance.enabled) {
        hasWarnings |= this.validatePerformance(filename, workflow);
      }

      // Quality checks
      if (this.guardrails.quality.enabled) {
        const qualityResult = this.validateQuality(filename, workflow, content);
        hasWarnings |= qualityResult.hasWarnings;
        hasErrors |= qualityResult.hasErrors;
      }

      // Consistency checks
      if (this.guardrails.consistency.enabled) {
        hasWarnings |= this.validateConsistency(filename, workflow);
      }

      this.results.total++;
      if (!hasErrors) {
        this.results.passed++;
      } else {
        this.results.failed++;
      }
      if (hasWarnings) {
        this.results.warningCount++;
      }

      return !hasErrors;
    } catch (error) {
      this.addError(filename, `Parse error: ${error.message}`);
      this.results.total++;
      this.results.failed++;
      return false;
    }
  }

  validateSecurity(filename, workflow) {
    let hasErrors = false;

    // Check for explicit permissions
    if (this.guardrails.security.rules.explicitPermissions.enabled) {
      if (
        !workflow.permissions &&
        Object.keys(workflow.jobs || {}).length > 0
      ) {
        this.addWarning(
          filename,
          "Missing permissions block (should default to contents: read)",
        );
      }
    }

    // Check for secrets in shell
    if (this.guardrails.security.rules.noSecretsInShell.enabled) {
      for (const job of Object.values(workflow.jobs || {})) {
        for (const step of job.steps || []) {
          if (!step.run) {
            continue;
          }

          const runScript = String(step.run);
          if (runScript.includes("${{ secrets.")) {
            this.addError(
              filename,
              "Do not pass secrets directly to shell commands (use env or input)",
            );
            hasErrors = true;
          }
        }
      }
    }

    // Check action versions
    if (this.guardrails.security.rules.pinnedActionVersions.enabled) {
      for (const [jobName, job] of Object.entries(workflow.jobs || {})) {
        for (const step of job.steps || []) {
          if (step.uses) {
            if (step.uses.includes("@main") || step.uses.includes("@master")) {
              this.addWarning(
                filename,
                `Job "${jobName}": Avoid using @main/@master, use pinned version`,
              );
            }
          }
        }
      }
    }

    return hasErrors;
  }

  validatePerformance(filename, workflow) {
    let hasWarnings = false;

    // Check for concurrency
    if (this.guardrails.performance.rules.concurrencyControl.enabled) {
      if (!workflow.concurrency) {
        this.addWarning(
          filename,
          "Consider adding concurrency to prevent overlapping runs",
        );
        hasWarnings = true;
      }
    }

    // Check for caching
    if (this.guardrails.performance.rules.cacheDependencies.enabled) {
      const jobsContent = JSON.stringify(workflow.jobs || {});
      const hasNpmInstall =
        jobsContent.includes("npm install") ||
        jobsContent.includes("npm ci") ||
        jobsContent.includes("pip install");
      const hasCache = jobsContent.includes("cache:");

      if (hasNpmInstall && !hasCache) {
        this.addWarning(
          filename,
          "Consider adding caching for dependencies (npm/pip)",
        );
        hasWarnings = true;
      }
    }

    // Check checkout depth
    if (this.guardrails.performance.rules.checkoutDepth.enabled) {
      const jobsContent = JSON.stringify(workflow.jobs || {});
      if (
        jobsContent.includes("actions/checkout") &&
        !jobsContent.includes("fetch-depth")
      ) {
        this.addWarning(
          filename,
          "Consider using fetch-depth for faster checkout",
        );
        hasWarnings = true;
      }
    }

    return hasWarnings;
  }

  validateQuality(filename, workflow, rawContent = "") {
    let hasWarnings = false;
    let hasErrors = false;

    // Check job names
    if (this.guardrails.quality.rules.clearJobNames.enabled) {
      for (const jobName of Object.keys(workflow.jobs || {})) {
        if (jobName.length < 3) {
          this.addWarning(
            filename,
            `Job name "${jobName}" is too short; use descriptive names`,
          );
          hasWarnings = true;
        }
      }
    }

    // Check step names
    if (this.guardrails.quality.rules.clearStepNames.enabled) {
      for (const [jobName, job] of Object.entries(workflow.jobs || {})) {
        for (const step of job.steps || []) {
          if (step.run && !step.name) {
            this.addWarning(
              filename,
              `Job "${jobName}": Step with run: should have descriptive name:`,
            );
            hasWarnings = true;
          }
        }
      }
    }

    // Check Node version
    if (this.guardrails.quality.rules.nodeVersion.enabled) {
      const jobsContent = JSON.stringify(workflow.jobs || {});
      if (jobsContent.includes("setup-node") && !jobsContent.includes("20")) {
        const nodeMatch = jobsContent.match(/node-version['":\s]+['"]?(\d+)/);
        if (nodeMatch && nodeMatch[1] < 18) {
          this.addWarning(
            filename,
            `Node version ${nodeMatch[1]} is outdated; use >=18`,
          );
          hasWarnings = true;
        }
      }
    }

    // Disallow bash-oriented workflow logic for repo-owned run steps.
    if (this.guardrails.quality.rules.noBashWorkflowLogic.enabled) {
      for (const [jobName, job] of Object.entries(workflow.jobs || {})) {
        for (const step of job.steps || []) {
          if (!step.run) {
            continue;
          }

          if (
            step.shell &&
            String(step.shell).trim().toLowerCase() === "bash" &&
            !this.isAllowlistedShellBash(filename, step.name)
          ) {
            this.addError(
              filename,
              `Job "${jobName}"${step.name ? ` / Step "${step.name}"` : ""}: explicit shell:bash is not allowed for repo-owned run steps`,
            );
            hasErrors = true;
          }

          const runScript = String(step.run);
          const hasControlFlow =
            /(^|\n)\s*(if\s+\[|if\s+\[\[|case\s+|for\s+|while\s+|until\s+|select\s+)/m.test(
              runScript,
            );
          const isMultiline = runScript.includes("\n");

          if (
            isMultiline &&
            hasControlFlow &&
            !this.isAllowlistedMultilineControlFlow(filename, step.name)
          ) {
            this.addError(
              filename,
              `Job "${jobName}"${step.name ? ` / Step "${step.name}"` : ""}: multiline shell control-flow is not allowed in run blocks; move logic to Node script`,
            );
            hasErrors = true;
          }
        }
      }

      if (/(^|\n)\s*shell:\s*bash\b/m.test(rawContent)) {
        // Defensive guard in case parser representation misses a non-standard shell declaration.
        this.addWarning(
          filename,
          "Raw workflow contains shell:bash declaration; ensure this is not repo-owned custom logic",
        );
        hasWarnings = true;
      }
    }

    return { hasWarnings, hasErrors };
  }

  validateConsistency(filename, workflow) {
    let hasWarnings = false;

    // Check OS version
    if (this.guardrails.consistency.rules.osVersion.enabled) {
      for (const [jobName, job] of Object.entries(workflow.jobs || {})) {
        if (job["runs-on"] && job["runs-on"] !== "ubuntu-latest") {
          if (
            !job["runs-on"].includes("macos") &&
            !job["runs-on"].includes("windows")
          ) {
            this.addWarning(
              filename,
              `Job "${jobName}": Use ubuntu-latest instead of ${job["runs-on"]} for consistency`,
            );
            hasWarnings = true;
          }
        }
      }
    }

    return hasWarnings;
  }

  addError(filename, message) {
    this.results.errors.push({ file: filename, message, level: "error" });
  }

  addWarning(filename, message) {
    this.results.warnings.push({ file: filename, message, level: "warning" });
  }

  printResults() {
    console.log("🔍 Workflow Validation Results\n");
    console.log("=".repeat(80));

    if (this.results.errors.length > 0) {
      console.log("\n❌ ERRORS:");
      this.results.errors.forEach((err) => {
        console.log(`   ${err.file}: ${err.message}`);
      });
    }

    if (this.results.warnings.length > 0) {
      console.log("\n⚠️  WARNINGS:");
      this.results.warnings.forEach((warn) => {
        console.log(`   ${warn.file}: ${warn.message}`);
      });
    }

    console.log("\n" + "=".repeat(80));
    console.log("\n📊 Summary:");
    console.log(`   Total workflows: ${this.results.total}`);
    console.log(`   ✅ Passed: ${this.results.passed}`);
    console.log(`   ❌ Failed: ${this.results.failed}`);
    console.log(`   ⚠️  Warnings: ${this.results.warnings.length}`);

    if (this.results.failed > 0) {
      console.log("\n❌ Validation failed. Please fix errors above.");
      return false;
    }

    if (this.results.warnings.length > 0) {
      console.log(
        "\n⚠️  Validation passed with warnings. Consider addressing warnings above.",
      );
      return true;
    }

    console.log("\n✅ All workflows validated successfully!");
    return true;
  }
}

// ============================================================================
// MAIN
// ============================================================================

function runValidation(
  workflowDir = path.join(__dirname, "../../.github/workflows"),
) {
  if (!fs.existsSync(workflowDir)) {
    console.error(`Workflows directory not found: ${workflowDir}`);
    return false;
  }

  const validator = new WorkflowValidator(GUARDRAILS);

  const workflowFiles = fs
    .readdirSync(workflowDir)
    .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))
    .sort();

  console.log(`Found ${workflowFiles.length} workflow files to validate\n`);

  workflowFiles.forEach((filename) => {
    const filePath = path.join(workflowDir, filename);
    const content = fs.readFileSync(filePath, "utf8");
    validator.validate(filename, content);
  });

  return validator.printResults();
}

if (require.main === module) {
  const success = runValidation();
  process.exit(success ? 0 : 1);
}

module.exports = {
  WorkflowValidator,
  GUARDRAILS,
  runValidation,
};
