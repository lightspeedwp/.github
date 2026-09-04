#!/usr/bin/env node

/**
 * Issue Completeness Audit Script
 *
 * Analyzes all open issues to identify missing sections, labels, and metadata.
 * Generates comprehensive audit report with recommendations.
 *
 * Usage:
 *   node audit-issue-completeness.js [options]
 *
 * Options:
 *   --label=LABEL          Filter by label (default: all open issues)
 *   --output=FILE          Save report to JSON file
 *   --format=csv           Output as CSV instead of JSON
 *   --limit=N              Analyze only first N issues
 */

import https from "https";
import fs from "fs";
import path from "path";

const config = {
  owner: "lightspeedwp",
  repo: ".github",
  label: process.argv.find((arg) => arg.startsWith("--label="))?.split("=")[1],
  output: process.argv.find((arg) => arg.startsWith("--output="))?.split("=")[1],
  format: process.argv.find((arg) => arg.startsWith("--format="))?.split("=")[1] || "json",
  limit: parseInt(
    process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1] ||
      "999999",
  ),
};

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("Error: GITHUB_TOKEN environment variable not set");
  process.exit(1);
}

// Make GitHub API request
async function githubRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path,
      method,
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "LightSpeed-Issues-Auditor",
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
            resolve({ status: res.statusCode, data: json });
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

// Check what sections are missing
function analyzeMissingSections(body, labels) {
  const missing = [];
  const present = [];

  if (!body) {
    return {
      missing: ["Definition of Ready", "Definition of Done", "Owner", "Acceptance Criteria"],
      present: [],
    };
  }

  // Check for Definition of Ready
  if (body.includes("## Definition of Ready")) {
    present.push("Definition of Ready");
  } else {
    missing.push("Definition of Ready");
  }

  // Check for Definition of Done
  if (body.includes("## Definition of Done")) {
    present.push("Definition of Done");
  } else {
    missing.push("Definition of Done");
  }

  // Check for Owner/Assignee
  if (body.includes("## Owner") || body.includes("## Assignee")) {
    present.push("Owner");
  } else {
    missing.push("Owner");
  }

  // Check for Acceptance Criteria
  if (body.includes("## Acceptance Criteria")) {
    present.push("Acceptance Criteria");
  } else {
    missing.push("Acceptance Criteria");
  }

  // Check for Technical Details/Implementation Notes
  if (
    body.includes("## Technical") ||
    body.includes("## Implementation") ||
    body.includes("## Design")
  ) {
    present.push("Technical Details");
  }

  // Check for Testing Strategy
  if (body.includes("## Testing") || body.includes("## Test")) {
    present.push("Testing Strategy");
  }

  return { missing, present };
}

// Calculate completeness score
function calculateCompletenessScore(analysis) {
  const maxScore = 6; // DoR, DoD, Owner, AC, Technical, Testing
  const present = analysis.present.length;
  return Math.round((present / maxScore) * 100);
}

// Analyze a single issue
function analyzeIssue(issue) {
  const labels = (issue.labels || []).map((l) => l.name || l);
  const typeLabel = labels.find((l) => l.startsWith("type:"));
  const statusLabels = labels.filter((l) => l.startsWith("status:"));
  const areaLabel = labels.find((l) => l.startsWith("area:"));

  const analysis = analyzeMissingSections(issue.body, labels);
  const completenessScore = calculateCompletenessScore(analysis);

  return {
    number: issue.number,
    title: issue.title,
    type: typeLabel || "unknown",
    status: statusLabels,
    area: areaLabel || "unassigned",
    assignee: issue.assignee?.login || null,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    body_length: issue.body?.length || 0,
    missing_sections: analysis.missing,
    present_sections: analysis.present,
    completeness_score: completenessScore,
    needs_owner: !issue.assignee && !issue.body?.includes("Owner"),
    needs_dor: !issue.body?.includes("Definition of Ready"),
    needs_dod: !issue.body?.includes("Definition of Done"),
    needs_ac: !issue.body?.includes("Acceptance Criteria"),
  };
}

// Fetch issues
async function fetchIssues() {
  let query = `repo:${config.owner}/${config.repo} is:open is:issue`;
  if (config.label) {
    query += ` label:${config.label}`;
  }

  let allIssues = [];
  let page = 1;
  let hasMore = true;

  console.log(`🔍 Fetching issues (${query})...`);

  while (hasMore && allIssues.length < config.limit) {
    const path = `/search/issues?q=${encodeURIComponent(query)}&per_page=100&page=${page}&sort=updated&order=desc`;

    try {
      const response = await githubRequest("GET", path);
      const data = response.data.items || [];

      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        allIssues = allIssues.concat(data);
        if (data.length < 100) {
          hasMore = false;
        } else {
          page++;
        }
      }

      process.stdout.write(`.`); // Progress indicator
    } catch (error) {
      console.error(`\nFailed to fetch issues (page ${page}): ${error.message}`);
      hasMore = false;
    }
  }

  console.log(`\n✅ Fetched ${allIssues.length} issues\n`);
  return allIssues.slice(0, config.limit);
}

// Generate CSV output
function generateCSV(audits) {
  const headers = [
    "Issue #",
    "Title",
    "Type",
    "Status",
    "Area",
    "Assignee",
    "Completeness %",
    "Missing DoR",
    "Missing DoD",
    "Missing Owner",
    "Missing AC",
    "Missing Sections",
  ];

  const rows = audits.map((a) => [
    a.number,
    `"${a.title.replace(/"/g, '""')}"`,
    a.type,
    a.status.join("|"),
    a.area,
    a.assignee || "unassigned",
    a.completeness_score,
    a.needs_dor ? "Yes" : "No",
    a.needs_dod ? "Yes" : "No",
    a.needs_owner ? "Yes" : "No",
    a.needs_ac ? "Yes" : "No",
    `"${a.missing_sections.join(", ")}"`,
  ]);

  return [headers, ...rows].map((row) => row.join(",")).join("\n");
}

// Generate summary statistics
function generateSummary(audits) {
  const total = audits.length;
  const avgCompleteness = Math.round(
    audits.reduce((sum, a) => sum + a.completeness_score, 0) / total,
  );

  const needsDOR = audits.filter((a) => a.needs_dor).length;
  const needsDOD = audits.filter((a) => a.needs_dod).length;
  const needsOwner = audits.filter((a) => a.needs_owner).length;
  const needsAC = audits.filter((a) => a.needs_ac).length;

  const byType = {};
  audits.forEach((a) => {
    if (!byType[a.type]) {
      byType[a.type] = { total: 0, avgScore: 0 };
    }
    byType[a.type].total++;
    byType[a.type].avgScore += a.completeness_score;
  });

  Object.keys(byType).forEach((type) => {
    byType[type].avgScore = Math.round(byType[type].avgScore / byType[type].total);
  });

  return {
    total_issues: total,
    average_completeness: avgCompleteness,
    issues_needing_dor: needsDOR,
    issues_needing_dod: needsDOD,
    issues_needing_owner: needsOwner,
    issues_needing_ac: needsAC,
    issues_by_type: byType,
    timestamp: new Date().toISOString(),
  };
}

// Main execution
async function main() {
  console.log("📊 Issue Completeness Audit\n");
  console.log(`📋 Configuration:`);
  console.log(`   Repository: ${config.owner}/${config.repo}`);
  if (config.label) console.log(`   Label Filter: ${config.label}`);
  console.log(`   Output Format: ${config.format}\n`);

  // Fetch issues
  const issues = await fetchIssues();

  if (!issues || issues.length === 0) {
    console.log("✨ No issues found.");
    return;
  }

  // Analyze issues
  console.log(`\n🔬 Analyzing ${issues.length} issues...\n`);
  const audits = issues.map(analyzeIssue);

  // Generate summary
  const summary = generateSummary(audits);

  // Output
  console.log("📊 Summary Statistics:");
  console.log(`   Total Issues: ${summary.total_issues}`);
  console.log(`   Avg Completeness: ${summary.average_completeness}%`);
  console.log(`   Missing DoR: ${summary.issues_needing_dor} (${Math.round((summary.issues_needing_dor / summary.total_issues) * 100)}%)`);
  console.log(`   Missing DoD: ${summary.issues_needing_dod} (${Math.round((summary.issues_needing_dod / summary.total_issues) * 100)}%)`);
  console.log(`   Missing Owner: ${summary.issues_needing_owner} (${Math.round((summary.issues_needing_owner / summary.total_issues) * 100)}%)`);
  console.log(`   Missing AC: ${summary.issues_needing_ac} (${Math.round((summary.issues_needing_ac / summary.total_issues) * 100)}%)`);

  console.log("\n📊 By Type:");
  Object.entries(summary.issues_by_type).forEach(([type, stats]) => {
    console.log(`   ${type}: ${stats.total} issues, avg ${stats.avgScore}% complete`);
  });

  // Save output
  let output;
  if (config.format === "csv") {
    output = generateCSV(audits);
  } else {
    output = JSON.stringify(
      {
        summary,
        issues: audits,
      },
      null,
      2,
    );
  }

  if (config.output) {
    const dir = path.dirname(config.output);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(config.output, output);
    console.log(`\n💾 Audit report saved to: ${config.output}`);
  } else {
    console.log("\n" + "=".repeat(60));
    console.log("AUDIT REPORT");
    console.log("=".repeat(60));
    console.log(output);
  }
}

// Error handling
main().catch((error) => {
  console.error(`\n❌ Fatal error: ${error.message}`);
  process.exit(1);
});
