/**
 * Handler: status:needs-template-fix
 *
 * Automatically detects and fixes invalid issue templates by:
 * 1. Identifying correct template based on issue type
 * 2. Regenerating missing DoR/DoD sections
 * 3. Validating structure after fix
 * 4. Removing status:needs-template-fix label
 *
 * Reuses template logic from scripts/automation/add-issue-template-sections.js (PR #1669)
 *
 * Usage:
 *   import { processIssue } from './handle-needs-template-fix.js';
 *   const result = await processIssue(issue, { dryRun: true, githubRequest });
 *
 * Note: Handles both DoR and DoD sections as required. Validates template
 * structure and regenerates sections with appropriate behaviour for issue type.
 */

// Issue type to template section mapping (reused from PR #1669)
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

  story: {
    dor: `## Definition of Ready (DoR)

- [ ] User story clearly written (As a... I want... So that...)
- [ ] Acceptance criteria defined and clear
- [ ] Dependencies and epic linkage identified
- [ ] Design/spec reviews completed (if applicable)
- [ ] Estimate provided
- [ ] Stakeholder sign-off confirmed`,

    dod: `## Definition of Done (DoD)

- [ ] All acceptance criteria met
- [ ] Tests added and passing; CI green
- [ ] Code review approved
- [ ] Documentation updated
- [ ] Performance verified (no regressions)
- [ ] Accessibility: WCAG 2.2 AA verified
- [ ] QA sign-off received`,
  },

  task: {
    dor: `## Definition of Ready (DoR)

- [ ] Clear scope and expected outcome defined
- [ ] Acceptance criteria written
- [ ] Blockers and dependencies identified
- [ ] Effort estimated`,

    dod: `## Definition of Done (DoD)

- [ ] All acceptance criteria met
- [ ] Changes tested and verified
- [ ] Documentation updated (if applicable)
- [ ] Code review approved (if applicable)
- [ ] Merged to develop`,
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

// Get issue type from labels
function getIssueType(issue) {
  const labels = (issue.labels || []).map((l) => l.name || l);

  if (labels.includes("type:feature")) return "feature";
  if (labels.includes("type:bug")) return "bug";
  if (labels.includes("type:epic")) return "epic";
  if (labels.includes("type:story")) return "story";
  if (labels.includes("type:task")) return "task";

  return "default";
}

// Check if issue already has BOTH DoR and DoD sections
function hasTemplateSections(body) {
  return (
    body &&
    body.includes("## Definition of Ready") &&
    body.includes("## Definition of Done")
  );
}

// Get template sections for issue type
function getTemplateSections(issueType) {
  const template = templates[issueType] || templates.default;
  return `${template.dor}\n\n${template.dod}`;
}

// Add template sections to issue body
function addTemplateSections(body, sections) {
  if (!body) {
    return sections;
  }

  let cleanedBody = body
    .replace(/\n*## Definition of Ready.*?(?=\n##|$)/s, "")
    .replace(/\n*## Definition of Done.*?(?=\n##|$)/s, "")
    .trim();

  return `${cleanedBody}\n\n---\n\n${sections}`;
}

// Validate template structure
function validateTemplateStructure(body) {
  const issues = [];

  if (!body.includes("## Definition of Ready")) {
    issues.push("Missing Definition of Ready section");
  }

  if (!body.includes("## Definition of Done")) {
    issues.push("Missing Definition of Done section");
  }

  // Check for checkbox format
  const checkboxCount = (body.match(/- \[/g) || []).length;
  if (checkboxCount < 4) {
    issues.push("Few or no checkboxes in DoR/DoD sections");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// Process a single issue
async function processIssue(issue, options = {}) {
  const {
    dryRun = true,
    githubRequest = null,
    owner = "lightspeedwp",
    repo = ".github",
  } = options;

  const issueNumber = issue.number;
  const issueType = getIssueType(issue);

  // Check if already has template sections
  if (hasTemplateSections(issue.body)) {
    return {
      status: "skipped",
      reason: "already has template sections",
      issueNumber,
      issueType,
    };
  }

  // Generate new template
  const sections = getTemplateSections(issueType);
  const newBody = addTemplateSections(issue.body || "", sections);

  // Validate new template
  const validation = validateTemplateStructure(newBody);

  if (!validation.valid) {
    return {
      status: "warning",
      reason: `validation failed: ${validation.issues.join(", ")}`,
      issueNumber,
      issueType,
      validation,
    };
  }

  // If dry-run, return preview
  if (dryRun) {
    return {
      status: "preview",
      dryRun: true,
      issueNumber,
      issueType,
      title: issue.title,
      bodyDiffSize: newBody.length - (issue.body?.length || 0),
      newSections: sections,
    };
  }

  // Apply changes (requires githubRequest function)
  if (!githubRequest) {
    return {
      status: "error",
      reason: "githubRequest function not provided",
      issueNumber,
    };
  }

  try {
    // Update issue body
    const updatePath = `/repos/${owner}/${repo}/issues/${issueNumber}`;
    await githubRequest("PATCH", updatePath, { body: newBody });

    // Try to remove label
    let labelRemoved = false;
    try {
      const removeLabel = `/repos/${owner}/${repo}/issues/${issueNumber}/labels/status%3Aneeds-template-fix`;
      await githubRequest("DELETE", removeLabel);
      labelRemoved = true;
    } catch {
      // Label removal failed but issue was updated
    }

    return {
      status: "updated",
      issueNumber,
      issueType,
      labelRemoved,
    };
  } catch (error) {
    return {
      status: "error",
      reason: error.message,
      issueNumber,
      issueType,
    };
  }
}

// Batch process multiple issues
async function processBatch(issues, options = {}) {
  const results = [];
  const stats = {
    preview: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    warnings: 0,
  };

  for (const issue of issues) {
    const result = await processIssue(issue, options);
    results.push(result);

    if (result.status === "preview") stats.preview++;
    else if (result.status === "updated") stats.updated++;
    else if (result.status === "skipped") stats.skipped++;
    else if (result.status === "error") stats.errors++;
    else if (result.status === "warning") stats.warnings++;
  }

  return { results, stats };
}

// Export for use in orchestrator
export { processIssue, processBatch, getIssueType, getTemplateSections };
