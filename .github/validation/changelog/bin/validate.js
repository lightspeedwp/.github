#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import ChangelogParser from '../lib/parser.js';
import ComplianceChecker from '../lib/compliance-checker.js';
import MetricsAggregator from '../lib/metrics-aggregator.js';
import CIContext from '../lib/ci-context.js';
import fs from 'fs';

const argv = yargs(hideBin(process.argv))
  .option('changelog-path', {
    alias: 'p',
    describe: 'Path to CHANGELOG.md file',
    type: 'string',
    default: 'CHANGELOG.md',
  })
  .option('trigger', {
    alias: 't',
    describe: 'Validation trigger type',
    type: 'string',
    choices: ['manual', 'pr_submission', 'scheduled_audit'],
    default: 'manual',
  })
  .option('pr-number', {
    describe: 'GitHub PR number (for pr_submission trigger)',
    type: 'number',
  })
  .option('branch', {
    describe: 'Git branch name',
    type: 'string',
  })
  .option('github-token', {
    describe: 'GitHub API token for link validation',
    type: 'string',
  })
  .option('output', {
    alias: 'o',
    describe: 'Output format',
    type: 'string',
    choices: ['text', 'json'],
    default: 'text',
  })
  .option('verbose', {
    alias: 'v',
    describe: 'Enable verbose output',
    type: 'boolean',
    default: false,
  })
  .option('metrics', {
    alias: 'm',
    describe: 'Save metrics snapshot',
    type: 'boolean',
    default: false,
  })
  .option('metrics-path', {
    describe: 'Path to metrics.json file',
    type: 'string',
  })
  .help()
  .alias('help', 'h')
  .parseSync();

async function main() {
  try {
    const changelogPath = argv['changelog-path'];
    const trigger = argv.trigger;
    const outputFormat = argv.output;
    const verbose = argv.verbose;
    const shouldSaveMetrics = argv.metrics;
    const metricsPath = argv['metrics-path'];

    // Detect CI context
    const ciContext = new CIContext(process.env);
    if (verbose) {
      console.error('CI Context:', JSON.stringify(ciContext.getSummary(), null, 2));
    }

    // Validate changelog file exists
    if (!fs.existsSync(changelogPath)) {
      const error = `CHANGELOG.md not found at ${changelogPath}`;
      if (outputFormat === 'json') {
        console.log(
          JSON.stringify(
            { error, exit_code: 1, trigger, ci_context: ciContext.getSummary() },
            null,
            2
          )
        );
      } else {
        console.error(`✗ ${error}`);
      }
      process.exit(1);
    }

    // Validate [Unreleased] section exists
    const changelogContent = fs.readFileSync(changelogPath, 'utf-8');
    if (!changelogContent.includes('[Unreleased]')) {
      const error = '[Unreleased] section not found in CHANGELOG.md';
      if (outputFormat === 'json') {
        console.log(
          JSON.stringify(
            { error, exit_code: 1, trigger, ci_context: ciContext.getSummary() },
            null,
            2
          )
        );
      } else {
        console.error(`✗ ${error}`);
      }
      process.exit(1);
    }

    if (verbose) {
      console.error(`Parsing changelog from ${changelogPath}...`);
    }

    // Parse changelog
    const parser = new ChangelogParser(changelogPath);
    const parseResult = parser.parseChangelog();

    if (parseResult.errors && parseResult.errors.length > 0) {
      if (outputFormat === 'json') {
        console.log(
          JSON.stringify(
            {
              error: 'Failed to parse changelog',
              errors: parseResult.errors,
              exit_code: 1,
              trigger,
              ci_context: ciContext.getSummary(),
            },
            null,
            2
          )
        );
      } else {
        console.error('✗ Failed to parse changelog');
        parseResult.errors.forEach((err) => console.error(`  - ${err}`));
      }
      process.exit(1);
    }

    const entries = parseResult.entries || [];

    if (entries.length === 0) {
      const warning = 'No changelog entries found in [Unreleased] section';
      if (outputFormat === 'json') {
        console.log(
          JSON.stringify(
            {
              summary: {
                total_entries: 0,
                passed: 0,
                failed: 0,
                pass_rate: 0,
              },
              ci_gate_result: 'pass',
              trigger,
              ci_context: ciContext.getSummary(),
              recommendation: 'no_action_needed',
              warning,
            },
            null,
            2
          )
        );
      } else {
        console.log(`⚠ ${warning}`);
      }
      process.exit(0);
    }

    if (verbose) {
      console.error(`Found ${entries.length} changelog entries`);
      console.error('Validating entries against rules...');
    }

    // Check entries for compliance
    const checker = new ComplianceChecker();
    const validationContext = {
      githubToken: argv['github-token'] || process.env.GITHUB_TOKEN,
      allEntries: entries,
      validateLinks: false,
    };

    const validationResult = await checker.checkEntries(entries, validationContext);

    if (verbose) {
      console.error(
        `Validation complete: ${validationResult.passed} of ${validationResult.total_entries} entries passed`
      );
    }

    // Prepare report
    const report = {
      summary: {
        total_entries: validationResult.total_entries,
        passed: validationResult.passed,
        failed: validationResult.failed,
        pass_rate: validationResult.pass_rate,
      },
      validations: validationResult.validations || [],
      trigger,
      ci_context: ciContext.getSummary(),
      timestamp: new Date().toISOString(),
    };

    // Determine gate result
    const passRate = parseFloat(validationResult.pass_rate);
    let gateResult;
    let recommendation;

    if (passRate === 100) {
      gateResult = 'pass';
      recommendation = 'approved';
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

    report.ci_gate_result = gateResult;
    report.recommendation = recommendation;

    // Save metrics if requested
    if (shouldSaveMetrics) {
      const aggregator = new MetricsAggregator(metricsPath);
      const snapshot = aggregator.aggregateValidation(validationResult);
      const metricsSaveResult = aggregator.saveMetrics(snapshot);

      if (verbose) {
        console.error('Metrics saved:', JSON.stringify(metricsSaveResult, null, 2));
      }

      report.metrics_saved = metricsSaveResult.success;
      if (metricsSaveResult.snapshot_id) {
        report.snapshot_id = metricsSaveResult.snapshot_id;
      }
    }

    // Output report
    if (outputFormat === 'json') {
      console.log(JSON.stringify(report, null, 2));
    } else {
      outputTextReport(report);
    }

    // Exit with appropriate code
    const exitCode = gateResult === 'pass' || gateResult === 'warning' ? 0 : 1;
    process.exit(exitCode);
  } catch (error) {
    const message = error.message || String(error);

    if (argv.output === 'json') {
      console.log(
        JSON.stringify(
          {
            error: 'Unexpected error during validation',
            message,
            exit_code: 1,
            trigger: argv.trigger,
          },
          null,
          2
        )
      );
    } else {
      console.error('✗ Validation failed with error:');
      console.error(`  ${message}`);
    }

    if (argv.verbose) {
      console.error(error.stack);
    }

    process.exit(1);
  }
}

function outputTextReport(report) {
  const { summary, ci_gate_result: gateResult, validations, recommendation } = report;

  console.log('');
  console.log('════════════════════════════════════════');
  console.log('    CHANGELOG VALIDATION REPORT');
  console.log('════════════════════════════════════════');
  console.log('');

  // Summary stats
  console.log(`Total Entries: ${summary.total_entries}`);
  console.log(`Compliant:    ${summary.passed} (${summary.pass_rate}%)`);
  console.log(`Non-Compliant: ${summary.failed}`);
  console.log('');

  // Gate result
  const gateIcon = gateResult === 'pass' ? '✓' : gateResult === 'warning' ? '⚠' : '✗';
  const gateStatus = gateResult === 'pass' ? 'PASS' : gateResult === 'warning' ? 'WARNING' : 'FAIL';

  console.log(`Gate Result: ${gateIcon} ${gateStatus}`);
  console.log(`Recommendation: ${recommendation}`);
  console.log('');

  // Violations summary
  if (validations && validations.length > 0) {
    const violationsByRule = {};

    for (const validation of validations) {
      if (validation.violations && validation.violations.length > 0) {
        for (const violation of validation.violations) {
          if (!violationsByRule[violation.rule_id]) {
            violationsByRule[violation.rule_id] = {
              count: 0,
              severity: violation.severity,
              examples: [],
            };
          }

          violationsByRule[violation.rule_id].count++;

          if (violationsByRule[violation.rule_id].examples.length < 2) {
            violationsByRule[violation.rule_id].examples.push({
              entry: validation.entry_id,
              message: violation.message,
            });
          }
        }
      }
    }

    if (Object.keys(violationsByRule).length > 0) {
      console.log('Issues Found:');
      console.log('─────────────────────────────────────');

      for (const [ruleId, info] of Object.entries(violationsByRule)) {
        console.log(`${ruleId} [${info.severity.toUpperCase()}]: ${info.count} violation(s)`);

        for (const example of info.examples) {
          console.log(`  → ${example.message}`);
        }
      }

      console.log('');
    }
  }

  console.log('════════════════════════════════════════');
  console.log('');
}

main().catch((error) => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
