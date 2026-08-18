const validators = require("./adr-validators");

class ValidationOrchestrator {
  constructor(adrDirectory, config = {}) {
    this.adrDirectory = adrDirectory;
    this.config = {
      enforceUniqueTitles: true,
      enforceValidReferences: true,
      enforceStatusTransitions: true,
      enforceFormat: true,
      enforceFilenameFormat: true,
      enforceMetadata: true,
      customMetadataFields: [],
      ...config,
    };
    this.results = null;
  }

  run() {
    const results = {
      summary: {
        valid: true,
        totalErrors: 0,
        totalWarnings: 0,
        rules: [],
      },
      details: {},
    };

    const rules = [
      {
        name: "enforce-unique-titles",
        enabled: this.config.enforceUniqueTitles,
        validator: () => validators.enforceUniqueTitles(this.adrDirectory),
      },
      {
        name: "enforce-valid-references",
        enabled: this.config.enforceValidReferences,
        validator: () => validators.enforceValidReferences(this.adrDirectory),
      },
      {
        name: "enforce-status-transitions",
        enabled: this.config.enforceStatusTransitions,
        validator: () =>
          validators.enforceStatusTransitions(this.adrDirectory),
      },
      {
        name: "enforce-format",
        enabled: this.config.enforceFormat,
        validator: () => validators.enforceFormat(this.adrDirectory),
      },
      {
        name: "enforce-filename-format",
        enabled: this.config.enforceFilenameFormat,
        validator: () => validators.enforceFilenameFormat(this.adrDirectory),
      },
      {
        name: "enforce-metadata",
        enabled: this.config.enforceMetadata,
        validator: () => {
          const requiredFields = [
            "title",
            "date",
            "status",
            "authors",
            ...this.config.customMetadataFields,
          ];
          return validators.enforceMetadata(this.adrDirectory, requiredFields);
        },
      },
    ];

    for (const rule of rules) {
      if (!rule.enabled) continue;

      try {
        const result = rule.validator();

        results.details[rule.name] = result;

        if (!result.valid) {
          results.summary.valid = false;
          results.summary.totalErrors += result.errors.length;

          results.summary.rules.push({
            rule: rule.name,
            status: "FAIL",
            errorCount: result.errors.length,
            errors: result.errors,
          });
        } else {
          results.summary.rules.push({
            rule: rule.name,
            status: "PASS",
            errorCount: 0,
          });
        }
      } catch (error) {
        results.summary.valid = false;
        results.summary.totalErrors++;

        results.summary.rules.push({
          rule: rule.name,
          status: "ERROR",
          errorCount: 1,
          error: error.message,
        });

        results.details[rule.name] = {
          valid: false,
          error: error.message,
        };
      }
    }

    this.results = results;
    return results;
  }

  report(format = "json") {
    if (!this.results) {
      throw new Error(
        "No validation results. Run validation first with run()",
      );
    }

    switch (format) {
      case "json":
        return JSON.stringify(this.results, null, 2);

      case "text":
        return this.reportText();

      case "summary":
        return this.reportSummary();

      default:
        throw new Error(`Unknown report format: ${format}`);
    }
  }

  reportText() {
    const { summary, details } = this.results;
    let output = [];

    output.push("=".repeat(60));
    output.push("ADR Validation Report");
    output.push("=".repeat(60));

    output.push(
      `\nOverall Status: ${summary.valid ? "✅ PASS" : "❌ FAIL"}`,
    );
    output.push(`Total Errors: ${summary.totalErrors}`);
    output.push(`\nRules Checked: ${summary.rules.length}`);

    output.push("\n" + "-".repeat(60));
    output.push("Rule Results:");
    output.push("-".repeat(60));

    for (const rule of summary.rules) {
      const status = this.statusIcon(rule.status);
      output.push(`\n${status} ${rule.rule}`);

      if (rule.status === "PASS") {
        output.push("  Status: PASS");
      } else if (rule.status === "ERROR") {
        output.push(`  Status: ERROR - ${rule.error}`);
      } else {
        output.push(`  Status: FAIL (${rule.errorCount} errors)`);
        if (rule.errors && rule.errors.length > 0) {
          for (const error of rule.errors.slice(0, 3)) {
            output.push(`    - ${error.message}`);
          }
          if (rule.errors.length > 3) {
            output.push(`    ... and ${rule.errors.length - 3} more`);
          }
        }
      }
    }

    output.push("\n" + "=".repeat(60));
    return output.join("\n");
  }

  reportSummary() {
    const { summary } = this.results;
    return {
      valid: summary.valid,
      totalErrors: summary.totalErrors,
      rules: summary.rules.map((r) => ({
        rule: r.rule,
        status: r.status,
        errorCount: r.errorCount,
      })),
    };
  }

  statusIcon(status) {
    switch (status) {
      case "PASS":
        return "✅";
      case "FAIL":
        return "❌";
      case "ERROR":
        return "⚠️ ";
      default:
        return "❓";
    }
  }

  getDetailedErrors() {
    if (!this.results) {
      return [];
    }

    const allErrors = [];

    for (const [ruleName, detail] of Object.entries(this.results.details)) {
      if (detail.errors && Array.isArray(detail.errors)) {
        for (const error of detail.errors) {
          allErrors.push({
            rule: ruleName,
            ...error,
          });
        }
      }
    }

    return allErrors;
  }
}

module.exports = {
  ValidationOrchestrator,
};
