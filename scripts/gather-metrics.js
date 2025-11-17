#!/usr/bin/env node

/**
 * gather-metrics.js - Collects CI and repo metrics for analysis.
 *
 * This script is a placeholder. In a future iteration, it will use the GitHub API (via Octokit)
 * to fetch data on workflow runs, pull requests, and repository contents to compute the metrics defined in docs/METRICS.md.
 */

console.log("🔍 Gathering CI and repository metrics...");

// Placeholder for CI failure analysis:
console.log("Analyzing recent CI workflow runs...");
// TODO: Use Octokit to list recent workflow runs and count failures by category (lint, test, etc.).

// Placeholder for PR cycle time:
console.log("Calculating PR merge durations...");
// TODO: Fetch recent merged PRs, compute time from open to merge for each, derive medians.

// Placeholder for formatting churn:
console.log("Computing formatting vs code change ratio...");
// TODO: Perhaps analyze a sample of recent PR diffs or commits for percentage of whitespace-only changes.

// Placeholder for lint rule churn:
console.log("Checking lint rule changes...");
// TODO: Could track changes to ESLint config or count of disable comments over time.

console.log("✅ Metrics collection complete (stub).");

// Exit with success (always, since this is a stub).
process.exit(0);

(This script is currently a stub. It outlines the steps we will implement. For now, it just prints placeholders. In the future, it will gather real data via GitHub’s API. We schedule it to run so that when it’s implemented, the infrastructure is in place.)
scripts/verify-docs-commands.js – Docs ↔ Scripts Parity Test
#!/usr/bin/env node

/**
 * verify-docs-commands.js
 * Checks that any "npm run ___" command mentioned in docs actually exists in package.json.
 */

const fs = require('fs');
const path = require('path');

const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json');
const DOC_FILES = [
  path.join(__dirname, '..', 'docs', 'LINTING.md'),
  path.join(__dirname, '..', 'docs', 'HUSKY-PRECOMMITS.md'),
  // add other docs to verify as needed
];

let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
} catch (err) {
  console.error("Failed to read package.json:", err);
  process.exit(1);
}

const scriptNames = pkg.scripts ? Object.keys(pkg.scripts) : [];
let allGood = true;

DOC_FILES.forEach(docPath => {
  if (!fs.existsSync(docPath)) return;  // skip if file not present
  const content = fs.readFileSync(docPath, 'utf8');
  const regex = /npm run (\w+[\w:-]*)/g;  // match "npm run script:name"
  let match;
  while ((match = regex.exec(content)) !== null) {
    const script = match[1];
    if (!scriptNames.includes(script)) {
      console.error(`❌ Doc reference to "npm run ${script}" not found in package.json scripts (${path.basename(docPath)})`);
      allGood = false;
    }
  }
});

if (!allGood) {
  console.error("Documentation references undefined npm scripts. 🚫");
  process.exit(1);
} else {
  console.log("👍 Docs scripts verification passed: all referenced scripts exist.");
}

console.log("🔍 Gathering CI and repository metrics...");

// Placeholder for CI failure analysis:
console.log("Analyzing recent CI workflow runs...");
// TODO: Use Octokit to list recent workflow runs and count failures by category (lint, test, etc.).

// Placeholder for PR cycle time:
console.log("Calculating PR merge durations...");
// TODO: Fetch recent merged PRs, compute time from open to merge for each, derive medians.

// Placeholder for formatting churn:
console.log("Computing formatting vs code change ratio...");
// TODO: Perhaps analyze a sample of recent PR diffs or commits for percentage of whitespace-only changes.

// Placeholder for lint rule churn:
console.log("Checking lint rule changes...");
// TODO: Could track changes to ESLint config or count of disable comments over time.

console.log("✅ Metrics collection complete (stub).");

// TODO: Implement proper error handling and exit codes when real metrics collection is added.
process.exit(0);
