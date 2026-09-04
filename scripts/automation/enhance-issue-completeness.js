#!/usr/bin/env node

/**
 * Enhanced Issue Completeness Script
 *
 * Adds missing Definition of Ready (DoR), Definition of Done (DoD), Owner sections,
 * and Acceptance Criteria to issues based on type.
 *
 * Usage:
 *   node enhance-issue-completeness.js [options]
 *
 * Options:
 *   --dry-run              Preview changes without applying them
 *   --limit=N              Process only N issues (default: 10)
 *   --issue=ID             Process specific issue ID only
 *   --start-from=N         Start processing from issue N (pagination)
 *   --label=LABEL          Filter by specific label (default: status:needs-more-info)
 *   --auto-owner           Try to assign owner based on author or area label
 */

import https from "https";

const config = {
  owner: "lightspeedwp",
  repo: ".github",
  label: "status:needs-more-info",
  perPage: 30,
  dryRun: process.argv.includes("--dry-run"),
  autoOwner: process.argv.includes("--auto-owner"),
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

const token = process.env.GITHUB_TOKEN;
if (!token && !config.dryRun) {
  console.error("Error: GITHUB_TOKEN environment variable not set");
  process.exit(1);
}

// Enhanced templates with Owner section
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

    owner: `## Owner / Assignee

**Responsible Party**: [To be assigned]

**Team/Area**: [Identify relevant team or codebase area]`,

    ac: `## Acceptance Criteria

- [ ] [Specific, testable requirement 1]
- [ ] [Specific, testable requirement 2]
- [ ] [Specific, testable requirement 3]`,
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

    owner: `## Owner / Assignee

**Responsible Party**: [To be assigned]

**Severity**: [Critical/High/Medium/Low]`,

    ac: `## Acceptance Criteria

- [ ] Bug is reproducible following documented steps
- [ ] Root cause identified and documented
- [ ] Fix implemented and verified
- [ ] Tests prevent regression`,
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

    owner: `## Epic Owner / Sponsor

**Sponsor/Owner**: [Who is driving this epic]

**Success Owner**: [Who validates completion]`,

    ac: `## Success Criteria

- [ ] All Phase milestones achieved
- [ ] Stakeholder sign-off obtained
- [ ] Team capacity and velocity met targets`,
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

    owner: `## Owner / Assignee

**Responsible Party**: [To be assigned]`,

    ac: `## Acceptance Criteria

- [ ] [Specific requirement 1]
- [ ] [Specific requirement 2]`,
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
        "User-Agent": "LightSpeed-Issues-Enhancer",
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

// Check what sections are missing
function checkMissingSections(body) {
  const missing = [];

  if (!body) {
    return [
      "Definition of Ready",
      "Definition of Done",
      "Owner",
      "Acceptance Criteria",
    ];
  }

  if (!body.includes("## Definition of Ready")) {
    missing.push("Definition of Ready");
  }
  if (!body.includes("## Definition of Done")) {
    missing.push("Definition of Done");
  }
  if (!body.includes("## Owner") && !body.includes("## Assignee")) {
    missing.push("Owner");
  }
  if (!body.includes("## Acceptance Criteria")) {
    missing.push("Acceptance Criteria");
  }

  return missing;
}

// Get appropriate template sections for issue type
function getTemplateSections(issueType, sectionsNeeded) {
  const template = templates[issueType] || templates.default;
  const sections = [];

  if (sectionsNeeded.includes("Definition of Ready")) {
    sections.push(template.dor);
  }
  if (sectionsNeeded.includes("Owner")) {
    sections.push(template.owner);
  }
  if (sectionsNeeded.includes("Acceptance Criteria")) {
    sections.push(template.ac);
  }
  if (sectionsNeeded.includes("Definition of Done")) {
    sections.push(template.dod);
  }

  return sections.join("\n\n");
}

// Add missing sections to issue body
function enhanceIssueBody(body, sections) {
  if (!body) {
    return sections;
  }

  // Clean up any existing partial/incomplete sections
  let cleanedBody = body
    .replace(/\n*## Definition of Ready.*?(?=\n##|$)/s, "")
    .replace(/\n*## Definition of Done.*?(?=\n##|$)/s, "")
    .replace(/\n*## Owner.*?(?=\n##|$)/s, "")
    .replace(/\n*## Assignee.*?(?=\n##|$)/s, "")
    .replace(/\n*## Acceptance Criteria.*?(?=\n##|$)/s, "")
    .trim();

  return `${cleanedBody}\n\n---\n\n${sections}`;
}

// Process a single issue
async function processIssue(issue) {
  const issueNumber = issue.number;
  const issueType = getIssueType(issue);
  const missingSections = checkMissingSections(issue.body);

  if (missingSections.length === 0) {
    return {
      skipped: true,
      reason: "all sections present",
      issue: issueNumber,
    };
  }

  const newSections = getTemplateSections(issueType, missingSections);
  const newBody = enhanceIssueBody(issue.body, newSections);

  if (config.dryRun) {
    console.log(
      `\n📋 DRY RUN: Would enhance #${issueNumber} (type: ${issueType})`,
    );
    console.log(`   Title: ${issue.title}`);
    console.log(`   Missing: ${missingSections.join(", ")}`);
    console.log(
      `   Change: +${newBody.length - (issue.body?.length || 0)} chars`,
    );
    return {
      preview: true,
      issue: issueNumber,
      type: issueType,
      missing: missingSections,
    };
  }

  try {
    // Update issue
    const updatePath = `/repos/${config.owner}/${config.repo}/issues/${issueNumber}`;
    await githubRequest("PATCH", updatePath, { body: newBody });

    // Try to remove status:needs-more-info label
    const removeLabel = `/repos/${config.owner}/${config.repo}/issues/${issueNumber}/labels/status%3Aneeds-more-info`;
    try {
      await githubRequest("DELETE", removeLabel);
      console.log(
        `✅ #${issueNumber} - Enhanced (${issueType}) - Added: ${missingSections.join(", ")}`,
      );
    } catch (e) {
      console.log(
        `✅ #${issueNumber} - Enhanced (${issueType}) - Label removal failed: ${e.message}`,
      );
    }

    return {
      updated: true,
      issue: issueNumber,
      type: issueType,
      added: missingSections,
    };
  } catch (error) {
    console.error(`❌ #${issueNumber} - Error: ${error.message}`);
    return {
      error: error.message,
      issue: issueNumber,
    };
  }
}

// Fetch issues with status:needs-more-info label
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
  console.log("🚀 Enhanced Issue Completeness Script\n");
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

  // Apply offset and limit
  const startIdx = Math.max(0, config.startFrom - 1);
  issuesToProcess = issuesToProcess.slice(startIdx, startIdx + config.limit);

  // Process issues
  console.log(`\n🚀 Processing ${issuesToProcess.length} issue(s)...\n`);

  let stats = { updated: 0, skipped: 0, errors: 0, preview: 0 };
  const results = [];

  for (const issue of issuesToProcess) {
    const result = await processIssue(issue);
    results.push(result);
    if (result.preview) stats.preview++;
    else if (result.updated) stats.updated++;
    else if (result.skipped) stats.skipped++;
    else if (result.error) stats.errors++;
  }

  // Summary
  console.log(`\n📊 Summary:`);
  console.log(`   Processed: ${issuesToProcess.length}`);
  if (config.dryRun) {
    console.log(`   Would update: ${stats.preview}`);
  } else {
    console.log(`   Updated: ${stats.updated}`);
    console.log(`   Skipped: ${stats.skipped}`);
    console.log(`   Errors: ${stats.errors}`);
  }

  if (config.dryRun) {
    console.log(`\n💡 Run without --dry-run to apply changes.`);
  }

  // Detailed results if not too many
  if (issuesToProcess.length <= 10 && !config.dryRun) {
    console.log(`\n📝 Detailed Results:`);
    results.forEach((r) => {
      if (r.updated) {
        console.log(`   ✅ #${r.issue}: Added ${r.added?.join(", ")}`);
      } else if (r.skipped) {
        console.log(`   ⏭️  #${r.issue}: Already complete`);
      } else if (r.error) {
        console.log(`   ❌ #${r.issue}: ${r.error}`);
      }
    });
  }
}

// Error handling
main().catch((error) => {
  console.error(`\n❌ Fatal error: ${error.message}`);
  process.exit(1);
});
