import ChangelogParser from './parser.js';
import ComplianceChecker from './compliance-checker.js';
import MetricsAggregator from './metrics-aggregator.js';
import CIContext from './ci-context.js';

class ValidationWorkflow {
  constructor(options = {}) {
    this.changelogPath = options.changelogPath || 'CHANGELOG.md';
    this.metricsPath = options.metricsPath || '.github/validation/changelog/data/metrics.json';
    this.githubToken = options.githubToken || process.env.GITHUB_TOKEN;
    this.verbose = options.verbose || false;
    this.saveMetrics = options.saveMetrics !== false;

    this.parser = new ChangelogParser(this.changelogPath);
    this.checker = new ComplianceChecker();
    this.aggregator = new MetricsAggregator(this.metricsPath);
    this.ciContext = new CIContext(process.env);
  }

  async validate() {
    try {
      this.log('Starting changelog validation workflow...');

      // Parse changelog
      this.log('Parsing changelog...');
      const parseResult = this.parser.parseChangelog();

      if (parseResult.errors && parseResult.errors.length > 0) {
        return this.createErrorResult('Parsing failed', parseResult.errors);
      }

      const entries = parseResult.entries || [];

      if (entries.length === 0) {
        this.log('No entries found in [Unreleased] section');
        return this.createEmptyResult();
      }

      this.log(`Found ${entries.length} entries`);

      // Check entries for compliance
      this.log('Validating entries...');
      const validationContext = {
        githubToken: this.githubToken,
        allEntries: entries,
        validateLinks: false,
      };

      const validationResult = await this.checker.checkEntries(entries, validationContext);

      this.log(
        `Validation complete: ${validationResult.passed}/${validationResult.total_entries} passed`
      );

      // Aggregate metrics
      this.log('Aggregating metrics...');
      let snapshot = null;
      if (this.saveMetrics) {
        snapshot = this.aggregator.aggregateValidation(validationResult);
        const metricsSaveResult = this.aggregator.saveMetrics(snapshot);
        this.log(`Metrics saved: ${metricsSaveResult.success}`);
      }

      // Build report
      const report = this.buildReport(validationResult, snapshot);

      this.log('Validation workflow completed');

      return {
        success: true,
        report,
        validationResult,
        snapshot,
      };
    } catch (error) {
      return this.createErrorResult('Validation failed', [error.message]);
    }
  }

  buildReport(validationResult, snapshot) {
    const { total_entries, passed, failed, pass_rate } = validationResult;

    let gateResult = 'pass';
    let recommendation = 'approved';

    const passRate = parseFloat(pass_rate);

    if (passRate === 100) {
      // gateResult stays 'pass', recommendation stays 'approved'
    } else if (passRate >= 90) {
      gateResult = 'warning';
      recommendation = 'review';
    } else if (passRate >= 75) {
      gateResult = 'warning';
      recommendation = 'review_required';
    } else {
      gateResult = 'fail';
      recommendation = 'blocked';
    }

    const violationsByRule = this.categorizeViolations(validationResult.validations || []);

    return {
      summary: {
        total_entries,
        passed,
        failed,
        pass_rate,
      },
      violations_by_rule: violationsByRule,
      ci_gate_result: gateResult,
      recommendation,
      timestamp: new Date().toISOString(),
      ci_context: this.ciContext.getSummary(),
      metrics_snapshot: snapshot ? snapshot.snapshot_id : null,
      trigger: this.ciContext.getValidationTrigger(),
    };
  }

  categorizeViolations(validations) {
    const byRule = {};

    for (const validation of validations) {
      if (!validation.violations || validation.violations.length === 0) {
        continue;
      }

      for (const violation of validation.violations) {
        const ruleId = violation.rule_id;
        if (!byRule[ruleId]) {
          byRule[ruleId] = {
            rule_id: ruleId,
            severity: violation.severity,
            count: 0,
            entries: [],
          };
        }

        byRule[ruleId].count++;
        if (byRule[ruleId].entries.length < 5) {
          byRule[ruleId].entries.push({
            entry_id: validation.entry_id,
            message: violation.message,
          });
        }
      }
    }

    return Object.values(byRule).sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity] || b.count - a.count;
    });
  }

  createErrorResult(title, errors) {
    return {
      success: false,
      report: {
        error: title,
        errors,
        timestamp: new Date().toISOString(),
        ci_context: this.ciContext.getSummary(),
      },
    };
  }

  createEmptyResult() {
    return {
      success: true,
      report: {
        summary: {
          total_entries: 0,
          passed: 0,
          failed: 0,
          pass_rate: 0,
        },
        violations_by_rule: [],
        ci_gate_result: 'pass',
        recommendation: 'no_action_needed',
        timestamp: new Date().toISOString(),
        ci_context: this.ciContext.getSummary(),
      },
    };
  }

  log(message) {
    if (this.verbose) {
      console.error(`[ValidationWorkflow] ${message}`);
    }
  }

  getReport() {
    return this.report;
  }
}

export default ValidationWorkflow;
