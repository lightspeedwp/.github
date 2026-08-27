#!/usr/bin/env node

/**
 * Bulk fix script: Add missing DoR/DoD sections to issues
 *
 * This script automatically adds Definition of Ready (DoR) and Definition of Done (DoD)
 * sections to issues that are missing them, based on the issue type/labels.
 *
 * Usage:
 *   node add-issue-template-sections.js [options]
 *
 * Options:
 *   --dry-run              Preview changes without applying them
 *   --limit=N              Process only N issues (default: 10)
 *   --issue=ID             Process specific issue ID only
 *   --start-from=N         Start processing from issue N (pagination)
 *   --label=LABEL          Filter by specific label (default: status:needs-more-info)
 */

import https from "https";

// Configuration
const config = {
  owner: "lightspeedwp",
  repo: ".github",
  label: "status:needs-more-info",
  perPage: 30,
  dryRun: process.argv.includes("--dry-run"),
  limit: parseInt(
    process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1] ||
      "10",
  ),
  specificIssue: parseInt(
    process.argv.find((arg) => arg.startsWith("--issue="))?.split("=")[1] ||
      "0",
  ),
  startFrom: parseInt(
    process.argv
      .find((arg) => arg.startsWith("--start-from="))
      ?.split("=")[1] || "1",
  ),
};

// GitHub API token from environment
const token = process.env.GITHUB_TOKEN;
if (!token && !config.dryRun) {
  console.error("Error: GITHUB_TOKEN environment variable not set");
  process.exit(1);
}

// Issue type to template section mapping
const templates = {
  feature: {
    dor: `## Definition of Ready (DoR)

- [ ] Problem statement and outcome defined
- [ ] Acceptance criteria written (Given/When/Then)
- [ ] Designs/specs/references attached (if relevant)
- [ ] Dependencies mapped
- [ ] Estimate added
- [ ] Stakeholders/approvers listed
- [ ] Milestone/iteration assigned (if applicable)`,

    dod: `## Definition of Done (DoD)

- [ ] All acceptance criteria met
- [ ] Tests added/updated; CI green
- [ ] Accessibility: WCAG 2.2 AA compliance verified (semantic HTML, keyboard support, colour contrast)
- [ ] Security: input validated, output escaped, no [OWASP Top 10](https://owasp.org/www-project-top-ten/) vulnerabilities
- [ ] Performance: no measurable regression introduced
- [ ] Docs/changelog updated
- [ ] Feature toggles/rollout considered
- [ ] QA verified/UAT approved (if applicable)
- [ ] Release notes prepared; monitoring/alerts set`,
  },

  bug: {
    dor: `## Definition of Ready (DoR)

- [ ] Reproduction steps clearly documented
- [ ] Expected vs actual behavior defined
- [ ] Environment/version information captured
- [ ] Related issues/PRs linked
- [ ] Severity/impact assessed
- [ ] Acceptance criteria for fix defined`,

    dod: `## Definition of Done (DoD)

- [ ] Bug fix verified and reproduction steps no longer apply
- [ ] Root cause identified and documented
- [ ] Tests added/updated to prevent regression; CI green
- [ ] No new warnings or errors introduced
- [ ] Docs/changelog updated
- [ ] Backport considered (if applicable)
- [ ] Release notes prepared`,
  },

  epic: {
    dor: `## Definition of Ready (DoR)

- [ ] Epic vision and scope clearly defined
- [ ] Success criteria and measurable outcomes documented
- [ ] High-level tasks/stories identified
- [ ] Dependencies and risks mapped
- [ ] Timeline and resource estimates provided
- [ ] Stakeholder alignment confirmed`,

    dod: `## Definition of Done (DoD)

- [ ] All child issues/stories completed
- [ ] Epic acceptance criteria met
- [ ] Epic documentation and summary updated
- [ ] Release notes and announcement prepared
- [ ] Post-launch monitoring and support plan in place
- [ ] Retrospective completed (if applicable)`,
  },

  default: {
    dor: `## Definition of Ready (DoR)

- [ ] Clear problem statement and expected outcome
- [ ] Acceptance criteria defined
- [ ] Related issues/dependencies identified
- [ ] Required resources/approvals listed`,

    dod: `## Definition of Done (DoD)

- [ ] All acceptance criteria met
- [ ] Changes tested and validated
- [ ] Documentation updated
- [ ] Changes merged and deployed
- [ ] Stakeholders notified`,
  },
};

// Utility: Make GitHub API request
async function githubRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path,
      method,
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "LightSpeed-Issues-Fixer",
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

// Determine issue type from labels
function getIssueType(issue) {
  const labels = (issue.labels || []).map((l) => l.name || l);

  if (labels.includes("type:feature")) return "feature";
  if (labels.includes("type:bug")) return "bug";
  if (labels.includes("type:epic")) return "epic";
  if (labels.includes("type:story")) return "epic";

  return "default";
}

// Check if issue already has DoR/DoD sections
function hasTemplateSections(body) {
  return (
    body &&
    (body.includes("## Definition of Ready") ||
      body.includes("## Definition of Done"))
  );
}

// Get appropriate template sections for issue type
function getTemplateSections(issueType) {
  const template = templates[issueType] || templates.default;
  return `${template.dor}\n\n${template.dod}`;
}

// Add template sections to issue body
function addTemplateSections(body, sections) {
  if (!body) {
    return sections;
  }

  // Remove existing placeholder sections if present
  let cleanedBody = body
    .replace(/\n*## Definition of Ready.*?(?=\n##|$)/s, "")
    .replace(/\n*## Definition of Done.*?(?=\n##|$)/s, "")
    .trim();

  return `${cleanedBody}\n\n---\n\n${sections}`;
}

// Process a single issue
async function processIssue(issue) {
  const issueNumber = issue.number;
  const issueType = getIssueType(issue);

  // Check if already has template sections
  if (hasTemplateSections(issue.body)) {
    console.log(
      `⏭️  #${issueNumber} - Already has template sections (${issueType})`,
    );
    return { skipped: true, reason: "already has sections" };
  }

  const sections = getTemplateSections(issueType);
  const newBody = addTemplateSections(issue.body, sections);

  if (config.dryRun) {
    console.log(
      `\n📋 DRY RUN: Would update #${issueNumber} (type: ${issueType})`,
    );
    console.log(`   Title: ${issue.title}`);
    console.log(
      `   Change: +${newBody.length - (issue.body?.length || 0)} chars`,
    );
    return { updated: true, dryRun: true };
  }

  try {
    // Update issue
    const updatePath = `/repos/${config.owner}/${config.repo}/issues/${issueNumber}`;
    await githubRequest("PATCH", updatePath, { body: newBody });

    // Remove status:needs-more-info label
    const removeLabel = `/repos/${config.owner}/${config.repo}/issues/${issueNumber}/labels/status%3Aneeds-more-info`;
    try {
      await githubRequest("DELETE", removeLabel);
      console.log(`✅ #${issueNumber} - Fixed (${issueType}) - label removed`);
    } catch (e) {
      console.log(
        `✅ #${issueNumber} - Fixed (${issueType}) - label removal failed: ${e.message}`,
      );
    }

    return { updated: true };
  } catch (error) {
    console.error(`❌ #${issueNumber} - Error: ${error.message}`);
    return { error: error.message };
  }
}

// Fetch issues with status:needs-more-info label (with pagination support)
async function fetchIssues() {
  const query = `repo:${config.owner}/${config.repo} label:${config.label} is:open`;
  let allIssues = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const path = `/search/issues?q=${encodeURIComponent(query)}&per_page=${config.perPage}&page=${page}&sort=created&order=asc`;

    try {
      const response = await githubRequest("GET", path);
      const data = response.data.items || response.data;

      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        allIssues = allIssues.concat(data);
        if (data.length < config.perPage) {
          hasMore = false;
        } else {
          page++;
        }
      }
    } catch (error) {
      console.error(`Failed to fetch issues (page ${page}): ${error.message}`);
      hasMore = false;
    }
  }

  return allIssues;
}

// Main execution
async function main() {
  console.log("🔧 Issue Template Section Fixer\n");
  console.log(`📋 Configuration:`);
  console.log(`   Repository: ${config.owner}/${config.repo}`);
  console.log(`   Label: ${config.label}`);
  console.log(`   Limit: ${config.limit} issues`);
  console.log(`   Dry Run: ${config.dryRun ? "YES" : "NO"}\n`);

  // Fetch issues
  console.log("📥 Fetching issues...");
  const issues = await fetchIssues();

  if (!issues || issues.length === 0) {
    console.log("✨ No issues found with the specified label.");
    return;
  }

  console.log(`✅ Found ${issues.length} issues with ${config.label}\n`);

  // Filter to specific issue if requested
  let issuesToProcess = issues;
  if (config.specificIssue) {
    issuesToProcess = issues.filter((i) => i.number === config.specificIssue);
    if (issuesToProcess.length === 0) {
      console.log(
        `❌ Issue #${config.specificIssue} not found or doesn't have the label.`,
      );
      return;
    }
  }

  // Apply offset and limit (clamp start index to prevent negative slice)
  const startIdx = Math.max(0, config.startFrom - 1);
  issuesToProcess = issuesToProcess.slice(startIdx, startIdx + config.limit);

  // Process issues
  console.log(`\n🚀 Processing ${issuesToProcess.length} issue(s)...\n`);

  let stats = { updated: 0, skipped: 0, errors: 0, dryRun: 0 };

  for (const issue of issuesToProcess) {
    const result = await processIssue(issue);
    if (result.dryRun) stats.dryRun++;
    else if (result.updated) stats.updated++;
    else if (result.skipped) stats.skipped++;
    else if (result.error) stats.errors++;
  }

  // Summary
  console.log(`\n📊 Summary:`);
  console.log(`   Processed: ${issuesToProcess.length}`);
  if (config.dryRun) {
    console.log(`   Would update: ${stats.dryRun}`);
  } else {
    console.log(`   Updated: ${stats.updated}`);
    console.log(`   Skipped: ${stats.skipped}`);
    console.log(`   Errors: ${stats.errors}`);
  }

  if (config.dryRun) {
    console.log(`\n💡 Run without --dry-run to apply changes.`);
  }
}

// Error handling
main().catch((error) => {
  console.error(`\n❌ Fatal error: ${error.message}`);
  process.exit(1);
});
