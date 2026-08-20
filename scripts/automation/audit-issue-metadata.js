#!/usr/bin/env node

/**
 * Bulk audit script: Analyze metadata completeness across all open issues
 *
 * Audits all open issues and generates a comprehensive report showing:
 * - Type labels (feature, bug, epic, story, task, etc.)
 * - Area labels (ci, docs, security, etc.)
 * - Status labels (needs-triage, needs-design, etc.)
 * - Priority labels
 * - Assignee coverage
 * - Milestone assignment
 * - Project association
 * - PR linkage
 * - Issue relationships
 *
 * Usage:
 *   node audit-issue-metadata.js [options]
 *
 * Options:
 *   --output-dir=PATH      Directory for reports (default: .github/projects/active/issue-metadata-triage-expansion/reports)
 *   --limit=N              Process only N issues (default: process all)
 *   --filter=LABEL         Filter by label (e.g., status:needs-triage)
 *   --verbose              Show detailed progress
 */

import https from "https";
import fs from "fs";
import path from "path";

// Configuration
const limitArg = parseInt(
  process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1] ||
    "999999",
);

if (!Number.isSafeInteger(limitArg) || limitArg <= 0) {
  console.error(`Error: --limit must be a positive integer, got "${limitArg}"`);
  process.exit(1);
}

const config = {
  owner: "lightspeedwp",
  repo: ".github",
  perPage: 100,
  outputDir:
    process.argv
      .find((arg) => arg.startsWith("--output-dir="))
      ?.split("=")[1] ||
    ".github/projects/active/issue-metadata-triage-expansion/reports",
  limit: limitArg,
  filter:
    process.argv.find((arg) => arg.startsWith("--filter="))?.split("=")[1] ||
    null,
  verbose: process.argv.includes("--verbose"),
};

// GitHub API token
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("Error: GITHUB_TOKEN environment variable not set");
  process.exit(1);
}

// Status labels to audit (the 9 categories from spec)
const statusLabelsToAudit = [
  "status:needs-triage",
  "status:needs-template-fix",
  "status:needs-more-info",
  "status:needs-audit",
  "status:needs-documentation",
  "status:needs-review",
  "status:needs-planning",
  "status:needs-design",
  "status:needs-dev",
];

// Utility: Make GitHub API request
async function githubRequest(method, path, body = null, token = process.env.GITHUB_TOKEN) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path,
      method,
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "Audit-Issue-Metadata",
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

// Parse labels into categories
function categorizeLabels(labels) {
  const result = { type: [], area: [], status: [], priority: [], other: [] };

  for (const label of labels) {
    const name = label.name || label;
    if (name.startsWith("type:")) {
      result.type.push(name);
    } else if (name.startsWith("area:")) {
      result.area.push(name);
    } else if (name.startsWith("status:")) {
      result.status.push(name);
    } else if (name.startsWith("priority:")) {
      result.priority.push(name);
    } else {
      result.other.push(name);
    }
  }

  return result;
}

// Analyze a single issue
function analyzeIssue(issue) {
  const labels = categorizeLabels(issue.labels || []);
  const gaps = [];

  // Check for missing metadata
  if (labels.type.length === 0) gaps.push("type");
  if (labels.area.length === 0) gaps.push("area");
  if (labels.status.length === 0) gaps.push("status");
  if (labels.priority.length === 0) gaps.push("priority");

  if (!issue.assignee) gaps.push("assignee");
  if (!issue.milestone) gaps.push("milestone");

  // Check for PR linkage
  const hasPRLink =
    issue.body &&
    (issue.body.includes("Resolves #") || issue.body.includes("Closes #"));
  if (
    !hasPRLink &&
    (labels.type.includes("type:feature") || labels.type.includes("type:bug"))
  ) {
    gaps.push("pr-link");
  }

  return {
    number: issue.number,
    title: issue.title,
    labels,
    assignees: issue.assignees || [],
    milestone: issue.milestone?.title || null,
    gapCount: gaps.length,
    gaps,
    statusLabels: labels.status,
  };
}

// Fetch all open issues with pagination
async function fetchAllIssues(fetchConfig = config, fetchToken = token) {
  const allIssues = [];
  let page = 1;
  let hasMore = true;

  console.log("📥 Fetching all open issues...");

  while (hasMore && allIssues.length < fetchConfig.limit) {
    // Build path using labels parameter if filter is specified
    let path = `/repos/${fetchConfig.owner}/${fetchConfig.repo}/issues?state=open&per_page=${fetchConfig.perPage}&page=${page}&sort=created&order=asc`;
    if (fetchConfig.filter) {
      path += `&labels=${encodeURIComponent(fetchConfig.filter)}`;
    }

    try {
      const response = await githubRequest("GET", path, null, fetchToken);
      const rawPage = response.data;
      const pageSize = rawPage?.length || 0;

      if (pageSize === 0) {
        hasMore = false;
      } else {
        // Filter out pull requests (API returns both issues and PRs)
        const issues = rawPage.filter((item) => !item.pull_request);
        allIssues.push(...issues);

        if (fetchConfig.verbose) {
          console.log(
            `  ✓ Fetched page ${page} (${issues.length} issues, total: ${allIssues.length})`,
          );
        }

        // Use raw page size to determine if more pages exist
        if (pageSize < fetchConfig.perPage) {
          hasMore = false;
        } else {
          page++;
        }
      }
    } catch (error) {
      console.error(`Error: Failed to fetch page ${page}: ${error.message}`);
      console.error(
        "Aborting audit due to fetch failure (partial data is unreliable)",
      );
      process.exit(1);
    }

    // Rate limit protection: sleep briefly between requests
    if (hasMore) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return allIssues.slice(0, config.limit);
}

// Generate comprehensive audit report
function generateAuditReport(analyzedIssues) {
  const stats = {
    total: analyzedIssues.length,
    metrics: {
      typeLabels: 0,
      areaLabels: 0,
      statusLabels: 0,
      priorityLabels: 0,
      assignees: 0,
      milestones: 0,
      prLinks: 0,
    },
    gaps: {
      type: 0,
      area: 0,
      status: 0,
      priority: 0,
      assignee: 0,
      milestone: 0,
      "pr-link": 0,
    },
    statusLabelDistribution: {},
    topGaps: [],
    issuesByStatusLabel: {},
  };

  // Initialize status label distributions
  statusLabelsToAudit.forEach((label) => {
    stats.statusLabelDistribution[label] = 0;
    stats.issuesByStatusLabel[label] = [];
  });

  // Analyze all issues
  analyzedIssues.forEach((issue) => {
    // Count metrics
    if (issue.labels.type.length > 0) stats.metrics.typeLabels++;
    if (issue.labels.area.length > 0) stats.metrics.areaLabels++;
    if (issue.labels.status.length > 0) stats.metrics.statusLabels++;
    if (issue.labels.priority.length > 0) stats.metrics.priorityLabels++;
    if (issue.assignees.length > 0) stats.metrics.assignees++;
    if (issue.milestone) stats.metrics.milestones++;
    if (!issue.gaps.includes("pr-link")) stats.metrics.prLinks++;

    // Count gaps
    issue.gaps.forEach((gap) => {
      if (stats.gaps[gap] !== undefined) {
        stats.gaps[gap]++;
      }
    });

    // Distribute by status label
    if (issue.statusLabels.length === 0) {
      stats.statusLabelDistribution["(no status label)"] =
        (stats.statusLabelDistribution["(no status label)"] || 0) + 1;
      stats.issuesByStatusLabel["(no status label)"] =
        stats.issuesByStatusLabel["(no status label)"] || [];
      stats.issuesByStatusLabel["(no status label)"].push(issue);
    } else {
      issue.statusLabels.forEach((label) => {
        if (stats.statusLabelDistribution[label] !== undefined) {
          stats.statusLabelDistribution[label]++;
          stats.issuesByStatusLabel[label].push(issue);
        }
      });
    }
  });

  // Calculate coverage percentages
  const coverage = {
    typeLabels: Math.round((stats.metrics.typeLabels / stats.total) * 100),
    areaLabels: Math.round((stats.metrics.areaLabels / stats.total) * 100),
    statusLabels: Math.round((stats.metrics.statusLabels / stats.total) * 100),
    priorityLabels: Math.round(
      (stats.metrics.priorityLabels / stats.total) * 100,
    ),
    assignees: Math.round((stats.metrics.assignees / stats.total) * 100),
    milestones: Math.round((stats.metrics.milestones / stats.total) * 100),
    prLinks: Math.round((stats.metrics.prLinks / stats.total) * 100),
  };

  // Find top gaps
  const gapsSorted = Object.entries(stats.gaps)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  stats.topGaps = gapsSorted.map(([gap, count]) => ({
    gap,
    count,
    percentage: Math.round((count / stats.total) * 100),
  }));

  return { stats, coverage, analyzedIssues };
}

// Export as JSON
function exportJSON(data, exportConfig = config) {
  const filename = path.join(exportConfig.outputDir, "audit-results.json");
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`✅ JSON export: ${filename}`);
  return filename;
}

// Export as CSV
function exportCSV(data, exportConfig = config) {
  const filename = path.join(exportConfig.outputDir, "audit-results.csv");

  const rows = [
    "Issue #,Title,Type Labels,Area Labels,Status Labels,Priority Labels,Assignees,Milestone,Gaps",
  ];

  data.analyzedIssues.forEach((issue) => {
    const row = [
      issue.number,
      `"${issue.title.replace(/"/g, '""')}"`,
      issue.labels.type.join(";"),
      issue.labels.area.join(";"),
      issue.labels.status.join(";"),
      issue.labels.priority.join(";"),
      issue.assignees.map((a) => a.login).join(";"),
      issue.milestone || "",
      issue.gaps.join(";"),
    ];
    rows.push(row.join(","));
  });

  fs.writeFileSync(filename, rows.join("\n"));
  console.log(`✅ CSV export: ${filename}`);
  return filename;
}

// Generate markdown report
function generateMarkdownReport(data, reportConfig = config) {
  const { stats, coverage } = data;

  let markdown = `# Issue Metadata Audit Report

**Generated:** ${new Date().toISOString()}
**Repository:** \`${reportConfig.owner}/${reportConfig.repo}\`
**Total Issues Analyzed:** ${stats.total}

## Executive Summary

### Overall Metadata Coverage

| Metric | Count | Coverage |
|--------|-------|----------|
| Type Labels | ${stats.metrics.typeLabels}/${stats.total} | **${coverage.typeLabels}%** |
| Area Labels | ${stats.metrics.areaLabels}/${stats.total} | **${coverage.areaLabels}%** |
| Status Labels | ${stats.metrics.statusLabels}/${stats.total} | **${coverage.statusLabels}%** |
| Priority Labels | ${stats.metrics.priorityLabels}/${stats.total} | **${coverage.priorityLabels}%** |
| Assignees | ${stats.metrics.assignees}/${stats.total} | **${coverage.assignees}%** |
| Milestones | ${stats.metrics.milestones}/${stats.total} | **${coverage.milestones}%** |
| PR Links | ${stats.metrics.prLinks}/${stats.total} | **${coverage.prLinks}%** |

### Top 5 Metadata Gaps

${stats.topGaps
  .map(
    (gap, idx) =>
      `${idx + 1}. **${gap.gap}**: ${gap.count} issues (${gap.percentage}%)`,
  )
  .join("\n")}

## Distribution by Status Label

### Status Label Breakdown

${statusLabelsToAudit
  .filter((label) => (stats.statusLabelDistribution[label] || 0) > 0)
  .map((label) => {
    const count = stats.statusLabelDistribution[label] || 0;
    const pct = Math.round((count / stats.total) * 100);
    return `- **${label}**: ${count} issues (${pct}%)`;
  })
  .join("\n")}

${
  (stats.statusLabelDistribution["(no status label)"] || 0) > 0
    ? `- **(no status label)**: ${stats.statusLabelDistribution["(no status label)"]} issues (${Math.round((stats.statusLabelDistribution["(no status label)"] / stats.total) * 100)}%)`
    : ""
}

## Recommendations

### Immediate Actions (Priority: Critical)
1. **Type Labels**: ${coverage.typeLabels < 80 ? `Only ${coverage.typeLabels}% coverage. Implement handler: \`handle-needs-triage.js\`` : "✅ Good coverage"}
2. **Area Labels**: ${coverage.areaLabels < 80 ? `Only ${coverage.areaLabels}% coverage. Consider auto-detection from issue content.` : "✅ Good coverage"}
3. **Status Labels**: ${coverage.statusLabels < 90 ? `Only ${coverage.statusLabels}% coverage. Implement auto-labeling for new issues.` : "✅ Good coverage"}

### Handler Priority

| Priority | Handler | Target Issues | Effort |
|----------|---------|----------------|--------|
| **Critical** | \`handle-needs-triage\` | ${stats.statusLabelDistribution["status:needs-triage"] || 0} | Phase 2.2 |
| **Critical** | \`handle-needs-template-fix\` | ${stats.statusLabelDistribution["status:needs-template-fix"] || 0} | Phase 2.1 |
| **High** | \`handle-needs-review\` | ${stats.statusLabelDistribution["status:needs-review"] || 0} | Phase 3 |
| **High** | \`handle-needs-design\` | ${stats.statusLabelDistribution["status:needs-design"] || 0} | Phase 4 |

## Technical Details

### Metadata Coverage by Category

**Type Labels:** ${coverage.typeLabels}%
- Issues with type: ${stats.metrics.typeLabels}
- Issues missing type: ${stats.gaps.type}

**Area Labels:** ${coverage.areaLabels}%
- Issues with area: ${stats.metrics.areaLabels}
- Issues missing area: ${stats.gaps.area}

**Status Labels:** ${coverage.statusLabels}%
- Issues with status: ${stats.metrics.statusLabels}
- Issues missing status: ${stats.gaps.status}

**Priority Labels:** ${coverage.priorityLabels}%
- Issues with priority: ${stats.metrics.priorityLabels}
- Issues missing priority: ${stats.gaps.priority}

**Assignees:** ${coverage.assignees}%
- Issues assigned: ${stats.metrics.assignees}
- Issues unassigned: ${stats.gaps.assignee}

**Milestones:** ${coverage.milestones}%
- Issues with milestone: ${stats.metrics.milestones}
- Issues without milestone: ${stats.gaps.milestone}

**PR Links:** ${coverage.prLinks}%
- Issues with PR links: ${stats.metrics.prLinks}
- Feature/bug issues without PR links: ${stats.gaps.prLink}

## Next Steps

1. Review detailed audit data in \`audit-results.csv\`
2. Export full JSON data in \`audit-results.json\` for programmatic analysis
3. Prioritize handlers based on gap analysis (see \`Handler Priority\` table above)
4. See Phase 1.2 issue for detailed recommendations

---

*Generated by audit-issue-metadata.js*
*See .github/projects/active/issue-metadata-triage-expansion/ for full project details*
`;

  return markdown;
}

// Main execution
async function main() {
  console.log("🔧 Issue Metadata Audit Script\n");
  console.log("📋 Configuration:");
  console.log(`   Repository: ${config.owner}/${config.repo}`);
  console.log(`   Output Dir: ${config.outputDir}`);
  if (config.filter) console.log(`   Filter: ${config.filter}`);
  console.log(
    `   Limit: ${config.limit === 999999 ? "unlimited" : config.limit} issues\n`,
  );

  // Ensure output directory exists
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  // Fetch all issues
  const issues = await fetchAllIssues();

  if (!issues || issues.length === 0) {
    console.log("✨ No open issues found.");
    return;
  }

  console.log(`✅ Fetched ${issues.length} open issues\n`);

  // Analyze each issue
  console.log("📊 Analyzing issues...");
  const analyzedIssues = issues.map((issue) => analyzeIssue(issue));

  // Generate report
  console.log("📈 Generating report...");
  const reportData = generateAuditReport(analyzedIssues);

  // Export results
  console.log("\n📤 Exporting results...");
  exportJSON(reportData);
  exportCSV(reportData);

  const markdownReport = generateMarkdownReport(reportData);
  const mdFilename = path.join(config.outputDir, "AUDIT_RESULTS.md");
  fs.writeFileSync(mdFilename, markdownReport);
  console.log(`✅ Markdown export: ${mdFilename}`);

  // Summary
  console.log("\n📊 Summary:");
  console.log(`   Total Issues: ${reportData.stats.total}`);
  console.log(`   Type Coverage: ${reportData.coverage.typeLabels}%`);
  console.log(`   Area Coverage: ${reportData.coverage.areaLabels}%`);
  console.log(`   Status Coverage: ${reportData.coverage.statusLabels}%`);
  console.log(`   Priority Coverage: ${reportData.coverage.priorityLabels}%`);
  console.log(`   Assignee Coverage: ${reportData.coverage.assignees}%`);
  console.log(`   Milestone Coverage: ${reportData.coverage.milestones}%`);
  console.log(
    `\n   Top Gap: ${reportData.stats.topGaps[0]?.gap} (${reportData.stats.topGaps[0]?.count} issues)`,
  );
  console.log(`\n✅ Audit complete. Reports saved to: ${config.outputDir}`);
}

// Export functions for testing
export {
  githubRequest,
  categorizeLabels,
  analyzeIssue,
  fetchAllIssues,
  generateAuditReport,
  exportJSON,
  exportCSV,
  generateMarkdownReport,
  main,
};

// Error handling (only for CLI execution)
// Check if this module is being run directly as a script
try {
  const currentFileUrl = new URL(import.meta.url).pathname;
  const argv1Path = process.argv[1];
  if (currentFileUrl === argv1Path || currentFileUrl.endsWith(argv1Path)) {
    main().catch((error) => {
      console.error(`\n❌ Fatal error: ${error.message}`);
      process.exit(1);
    });
  }
} catch (e) {
  // import.meta.url not available in CommonJS context, skip auto-execution
}
