#!/usr/bin/env node

/**
 * Example usage of the audit-label-coverage skill
 *
 * Usage:
 *   node example-usage.js
 *
 * Requirements:
 *   - GITHUB_TOKEN environment variable set
 *   - Authenticated Octokit instance
 */

const { AuditLabelCoverageSkill } = require("./index");

async function main() {
  // In real usage, would initialize Octokit with GitHub token
  // const { Octokit } = require('@octokit/rest');
  // const octokit = new Octokit({
  //   auth: process.env.GITHUB_TOKEN,
  // });

  // For this example, we'll show the structure:
  console.log("audit-label-coverage Skill - Example Usage");
  console.log("=========================================\n");

  console.log("1. Basic audit of open issues/PRs:");
  console.log(`
  const skill = new AuditLabelCoverageSkill(octokit, 'owner', 'repo');
  const result = await skill.audit({
    state: 'open',
    outputFormat: 'all',
    outputPath: '.github/reports/audit-label-coverage',
  });
  console.log(result.reports.cli);
  `);

  console.log("\n2. Get recommendations for a single issue:");
  console.log(`
  const rec = await skill.getRecommendations(123);
  console.log('Issue #' + rec.number + ' coverage: ' + rec.coverage + '%');
  console.log('Missing labels:', rec.missing);
  console.log('Suggestions:', rec.suggestions);
  `);

  console.log("\n3. Save reports to files:");
  console.log(`
  const result = await skill.audit({
    state: 'open',
    outputFormat: 'all',
    outputPath: '.github/reports/audit-label-coverage',
  });
  // Creates:
  // - .github/reports/audit-label-coverage/audit-report.txt
  // - .github/reports/audit-label-coverage/audit-report.md
  // - .github/reports/audit-label-coverage/audit-report.json
  `);

  console.log("\n4. Use in GitHub Actions workflow:");
  console.log(`
  name: Label Audit
  on:
    schedule:
      - cron: '0 2 * * 1'

  jobs:
    audit:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - name: Audit labels
          run: node skills/audit-label-coverage/example-usage.js
  `);
}

main().catch(console.error);
