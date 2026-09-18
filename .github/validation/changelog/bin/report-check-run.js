#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import CheckRunReporter from '../lib/check-run-reporter.js';
import fs from 'fs';

const argv = yargs(hideBin(process.argv))
  .option('report-path', {
    alias: 'r',
    describe: 'Path to validation-report.json',
    type: 'string',
    required: true,
  })
  .option('github-token', {
    describe: 'GitHub API token',
    type: 'string',
    required: true,
  })
  .option('owner', {
    describe: 'GitHub repository owner',
    type: 'string',
    required: true,
  })
  .option('repo', {
    describe: 'GitHub repository name',
    type: 'string',
    required: true,
  })
  .option('sha', {
    describe: 'Git commit SHA (head_sha for check run)',
    type: 'string',
    required: true,
  })
  .option('pr-number', {
    describe: 'Pull request number (optional, for context)',
    type: 'number',
  })
  .option('verbose', {
    alias: 'v',
    describe: 'Enable verbose output',
    type: 'boolean',
    default: false,
  })
  .help()
  .alias('help', 'h')
  .parseSync();

async function main() {
  try {
    const reportPath = argv['report-path'];
    const token = argv['github-token'];
    const owner = argv.owner;
    const repo = argv.repo;
    const sha = argv.sha;
    const prNumber = argv['pr-number'];
    const verbose = argv.verbose;

    // Validate report file exists
    if (!fs.existsSync(reportPath)) {
      console.error(`✗ Validation report not found at ${reportPath}`);
      process.exit(1);
    }

    if (verbose) {
      console.error(`Reading validation report from ${reportPath}...`);
    }

    // Read validation report
    const reportContent = fs.readFileSync(reportPath, 'utf-8');
    const validationResult = JSON.parse(reportContent);

    if (verbose) {
      console.error(
        `Parsed report: ${validationResult.summary.passed} passed, ${validationResult.summary.failed} failed`
      );
    }

    // Create check run reporter
    const reporter = new CheckRunReporter(token, owner, repo);

    // Create mock GitHub Actions context
    // In the workflow, this will be replaced with actual context
    const context = {
      payload: {
        pull_request: prNumber ? { head: { sha } } : undefined,
      },
      sha,
    };

    if (verbose) {
      console.error(`Creating check run for SHA: ${sha}`);
      if (prNumber) console.error(`PR Number: ${prNumber}`);
    }

    // Report check run
    const checkRun = await reporter.reportCheckRun(context, validationResult);

    if (verbose) {
      console.error(`✓ Check run created: ${checkRun.data.html_url}`);
    }

    console.log(JSON.stringify(checkRun.data, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('✗ Failed to report check run:');
    console.error(`  ${error.message}`);

    if (argv.verbose) {
      console.error(error.stack);
    }

    process.exit(1);
  }
}

main();
