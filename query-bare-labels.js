#!/usr/bin/env node

/**
 * Query script to identify issues/PRs with bare labels
 * Uses GitHub REST API via Octokit
 */

import fs from "fs";
import path from "path";
import { Octokit } from "octokit";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get token from environment
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("❌ GITHUB_TOKEN environment variable is required");
  process.exit(1);
}

const octokit = new Octokit({ auth: token });

// Load the bare label mapping
function loadMapping() {
  const mappingPath = path.join(
    __dirname,
    ".github",
    "reports",
    "label-remediation",
    "bare-label-mapping.json",
  );
  const content = fs.readFileSync(mappingPath, "utf8");
  return JSON.parse(content);
}

// Query issues and PRs with bare labels
async function queryBareLabels(owner, repo) {
  const mapping = loadMapping();
  const bareLabels = Object.keys(mapping);

  console.log(`\n🔍 Searching for bare labels in ${owner}/${repo}...\n`);

  const findings = {
    issues: [],
    pullRequests: [],
    summary: {},
  };

  // Query each bare label
  for (const bareLabel of bareLabels) {
    try {
      // Query issues
      const issuesResponse = await octokit.rest.issues.listForRepo({
        owner,
        repo,
        labels: bareLabel,
        state: "all",
        per_page: 100,
      });

      if (issuesResponse.data.length > 0) {
        // Filter to actual issues (not PRs)
        const issues = issuesResponse.data.filter((item) => !item.pull_request);
        const prs = issuesResponse.data.filter((item) => item.pull_request);

        if (issues.length > 0) {
          findings.summary[bareLabel] = {
            issues: issues.length,
            prs: prs.length,
          };

          issues.forEach((issue) => {
            findings.issues.push({
              number: issue.number,
              title: issue.title,
              bareLabel,
              canonicalLabel: mapping[bareLabel],
              url: issue.html_url,
              state: issue.state,
            });
          });
        }

        if (prs.length > 0) {
          prs.forEach((pr) => {
            findings.pullRequests.push({
              number: pr.number,
              title: pr.title,
              bareLabel,
              canonicalLabel: mapping[bareLabel],
              url: pr.html_url,
              state: pr.state,
            });
          });
        }
      }
    } catch (error) {
      if (error.status !== 404) {
        console.warn(
          `⚠️  Error querying label "${bareLabel}": ${error.message}`,
        );
      }
    }
  }

  return findings;
}

// Generate report
function generateReport(findings) {
  console.log("\n📊 Bare Label Query Results\n");
  console.log("=".repeat(80));

  if (findings.issues.length === 0 && findings.pullRequests.length === 0) {
    console.log("\n✅ No bare labels found! Repository is compliant.");
    return;
  }

  if (findings.issues.length > 0) {
    console.log(
      `\n📝 Issues with bare labels (${findings.issues.length} total):\n`,
    );
    findings.issues.forEach((issue) => {
      console.log(`  #${issue.number}: ${issue.title}`);
      console.log(
        `    • Bare label: ${issue.bareLabel} → ${issue.canonicalLabel}`,
      );
      console.log(`    • State: ${issue.state}`);
      console.log();
    });
  }

  if (findings.pullRequests.length > 0) {
    console.log(
      `\n🔄 Pull Requests with bare labels (${findings.pullRequests.length} total):\n`,
    );
    findings.pullRequests.forEach((pr) => {
      console.log(`  #${pr.number}: ${pr.title}`);
      console.log(`    • Bare label: ${pr.bareLabel} → ${pr.canonicalLabel}`);
      console.log(`    • State: ${pr.state}`);
      console.log();
    });
  }

  console.log("\n📋 Summary by bare label:\n");
  Object.entries(findings.summary)
    .sort(([a], [b]) => b.localeCompare(a))
    .forEach(([label, counts]) => {
      console.log(`  ${label}: ${counts.issues} issues, ${counts.prs} PRs`);
    });

  // Save detailed findings
  const reportDir = path.join(
    __dirname,
    ".github",
    "reports",
    "label-remediation",
  );
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = path.join(reportDir, "bare-labels-found.json");
  fs.writeFileSync(reportPath, JSON.stringify(findings, null, 2));
  console.log(
    `\n📄 Detailed findings saved to: ${path.relative(process.cwd(), reportPath)}`,
  );

  return findings;
}

// Main
async function main() {
  try {
    const findings = await queryBareLabels("lightspeedwp", ".github");
    generateReport(findings);

    console.log(
      `\n✓ Total issues/PRs to remediate: ${findings.issues.length + findings.pullRequests.length}`,
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main();
