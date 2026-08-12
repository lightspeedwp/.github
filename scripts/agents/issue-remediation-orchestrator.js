#!/usr/bin/env node

/**
 * Issue Remediation Orchestrator
 *
 * Coordinates Phase 2 triage analysis and Phase 3 handler execution.
 * Manages batch remediation across multiple issues with progress tracking.
 *
 * Usage:
 *   node issue-remediation-orchestrator.js --issue=1234
 *   node issue-remediation-orchestrator.js --label=status:needs-triage --batch=10
 *   node issue-remediation-orchestrator.js --label=status:needs-triage --dry-run
 */

import https from "https";
import {
  assessTriageNeeds,
  generateRemediationPlan,
  formatRemediationPlan,
} from "./scripts/agents/includes/handle-needs-triage.js";
import { handleNeedsTemplateFix } from "./scripts/agents/includes/handle-needs-template-fix.js";
import { handleNeedsType } from "./scripts/agents/includes/handle-needs-type.js";
import { handleNeedsAreas } from "./scripts/agents/includes/handle-needs-areas.js";
import { handleNeedsPriority } from "./scripts/agents/includes/handle-needs-priority.js";
import { handleNeedsAssignee } from "./scripts/agents/includes/handle-needs-assignee.js";
import { handleNeedsMilestone } from "./scripts/agents/includes/handle-needs-milestone.js";

// Configuration
const config = {
  owner: "lightspeedwp",
  repo: ".github",
  specificIssue: parseInt(
    process.argv.find((arg) => arg.startsWith("--issue="))?.split("=")[1] ||
      "0",
  ),
  label:
    process.argv.find((arg) => arg.startsWith("--label="))?.split("=")[1] ||
    null,
  batchSize: parseInt(
    process.argv.find((arg) => arg.startsWith("--batch="))?.split("=")[1] ||
      "10",
  ),
  dryRun: process.argv.includes("--dry-run"),
  verbose: process.argv.includes("--verbose"),
};

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("Error: GITHUB_TOKEN environment variable not set");
  process.exit(1);
}

// GitHub API helper
async function githubRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path,
      method,
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "LightSpeed-Issue-Remediation-Orchestrator",
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(
              new Error(
                `GitHub API error ${res.statusCode}: ${json.message || data}`,
              ),
            );
          } else {
            resolve({
              status: res.statusCode,
              data: json,
              headers: res.headers,
            });
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Fetch single issue
async function fetchIssue(issueNumber) {
  const path = `/repos/${config.owner}/${config.repo}/issues/${issueNumber}`;
  const response = await githubRequest("GET", path);
  return response.data;
}

// Fetch issues with label
async function fetchIssuesWithLabel(label, page = 1) {
  const path =
    `/repos/${config.owner}/${config.repo}/issues?` +
    `labels=${encodeURIComponent(label)}&state=open&per_page=${config.batchSize}&page=${page}`;

  const response = await githubRequest("GET", path);
  return {
    issues: response.data,
    hasMore: response.headers.link
      ? response.headers.link.includes('rel="next"')
      : false,
    nextPage: page + 1,
  };
}

// Remediate single issue
async function remediateIssue(issue) {
  console.log(`\n🔧 Remediating #${issue.number}: ${issue.title}`);

  try {
    // Phase 2: Analyze
    const triageAssessment = assessTriageNeeds(issue);
    const plan = generateRemediationPlan(issue, triageAssessment);

    console.log(formatRemediationPlan(plan));

    if (config.dryRun) {
      return {
        status: "dry-run",
        issueNumber: issue.number,
        plan,
      };
    }

    // Phase 3: Execute handlers
    const handlers = {
      "template-fix": (iss, rec) =>
        handleNeedsTemplateFix(iss, rec, { dryRun: false }),
      "type-assignment": (iss, rec) =>
        handleNeedsType(iss, rec, { dryRun: false }),
      "area-labeling": (iss, rec) =>
        handleNeedsAreas(iss, rec, { dryRun: false }),
      "priority-assessment": (iss, rec) =>
        handleNeedsPriority(iss, rec, { dryRun: false }),
      "assignee-suggestion": (iss, rec) =>
        handleNeedsAssignee(iss, rec, { dryRun: false }),
      "milestone-assignment": (iss, rec) =>
        handleNeedsMilestone(iss, rec, { dryRun: false }),
    };

    const results = {
      issueNumber: issue.number,
      executed: [],
      failed: [],
    };

    for (const handlerConfig of plan.handlers) {
      try {
        const handler = handlers[handlerConfig.handler];
        if (!handler) {
          if (config.verbose) {
            console.log(`  ⏭️  ${handlerConfig.handler}: Not yet implemented`);
          }
          continue;
        }

        const result = await handler(issue, plan.recommendations);
        results.executed.push({
          handler: handlerConfig.handler,
          ...result,
        });

        if (result.success) {
          console.log(`  ✅ ${handlerConfig.handler}: Success`);
        } else if (result.status === "skipped") {
          console.log(`  ⏭️  ${handlerConfig.handler}: Skipped`);
        } else {
          console.log(`  ❌ ${handlerConfig.handler}: Failed`);
          results.failed.push(handlerConfig.handler);
        }
      } catch (error) {
        console.log(`  ❌ ${handlerConfig.handler}: Error — ${error.message}`);
        results.failed.push(handlerConfig.handler);
      }
    }

    return {
      status: results.failed.length === 0 ? "success" : "partial",
      issueNumber: issue.number,
      results,
    };
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return {
      status: "error",
      issueNumber: issue.number,
      error: error.message,
    };
  }
}

// Main execution
async function main() {
  console.log("🤖 Issue Remediation Orchestrator\n");

  if (config.specificIssue) {
    // Remediate single issue
    const issue = await fetchIssue(config.specificIssue);
    await remediateIssue(issue);
  } else if (config.label) {
    // Remediate issues with label
    console.log(`📋 Processing issues with label: ${config.label}\n`);

    let page = 1;
    let totalProcessed = 0;
    let totalSuccess = 0;

    let hasMore = true;
    while (hasMore) {
      const { issues, hasMore: nextPage } = await fetchIssuesWithLabel(
        config.label,
        page,
      );

      if (issues.length === 0) {
        console.log("\n✅ No more issues to process");
        break;
      }

      for (const issue of issues) {
        const result = await remediateIssue(issue);
        totalProcessed++;

        if (result.status === "success" || result.status === "dry-run") {
          totalSuccess++;
        }
      }

      hasMore = nextPage;
      page++;
    }

    console.log(
      `\n📊 Summary: ${totalSuccess}/${totalProcessed} issues remediated successfully`,
    );
  } else {
    console.log(
      "ℹ️ Usage: node issue-remediation-orchestrator.js --issue=<number> [options]\n",
    );
    console.log("Options:");
    console.log("  --label=<label>      Process issues with label");
    console.log("  --batch=<N>          Batch size (default: 10)");
    console.log("  --dry-run            Preview without making changes");
    console.log("  --verbose            Show detailed output");
  }
}

// Run
main().catch((error) => {
  console.error(`\n❌ Fatal error: ${error.message}`);
  process.exit(1);
});
