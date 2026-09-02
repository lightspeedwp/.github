#!/usr/bin/env node

/**
 * Remediation Checklist Generator
 *
 * Generates per-issue DoR/DoD remediation checklists based on:
 * - Issue type
 * - Missing template sections
 * - Issue context and labels
 *
 * Output: Individual checklist comments for each non-compliant issue
 */

class RemediationChecklistGenerator {
  constructor(github, owner, repo) {
    this.github = github;
    this.owner = owner;
    this.repo = repo;
  }

  /**
   * Analyze issue for template compliance gaps
   */
  analyzeCompliance(issue) {
    const body = (issue.body || "").toLowerCase();
    const labels = (issue.labels || []).map((l) =>
      typeof l === "string" ? l : l.name,
    );

    const hasDoR = /definition of ready \(dor\)/i.test(body);
    const hasDoD = /definition of done \(dod\)/i.test(body);

    return {
      issueNumber: issue.number,
      title: issue.title,
      type: labels.find((l) => l.startsWith("type:")) || "unknown",
      hasDoR,
      hasDoD,
      missingDoR: !hasDoR,
      missingDoD: !hasDoD,
      isNonCompliant: !hasDoR || !hasDoD,
    };
  }

  /**
   * Generate type-specific DoR template
   */
  generateDoRTemplate(issueType) {
    const templates = {
      "type:task": [
        "- [ ] Acceptance criteria clearly defined",
        "- [ ] Scope is bounded (no scope creep)",
        "- [ ] Dependencies identified",
        "- [ ] Blockers (if any) documented",
      ],
      "type:bug": [
        "- [ ] Reproducible with clear steps",
        "- [ ] Environment details (OS, browser, version) provided",
        "- [ ] Expected vs actual behavior documented",
        "- [ ] Screenshots/logs attached (if applicable)",
      ],
      "type:feature": [
        "- [ ] User story or business value defined",
        "- [ ] Acceptance criteria written",
        "- [ ] Mock-ups or design comps linked (if applicable)",
        "- [ ] Dependencies and integrations identified",
      ],
      "type:design": [
        "- [ ] Design goals and constraints documented",
        "- [ ] Reference designs or inspiration linked",
        "- [ ] Figma file or design artifact created",
        "- [ ] Success criteria defined (e.g., WCAG AA compliance)",
      ],
      "type:epic": [
        "- [ ] Epic description and business goal defined",
        "- [ ] Child issues/stories created and linked",
        "- [ ] Milestones and timeline documented",
        "- [ ] Stakeholders and reviewers identified",
      ],
      "type:story": [
        "- [ ] User persona and context defined",
        "- [ ] Acceptance criteria (GIVEN/WHEN/THEN format preferred)",
        "- [ ] Related issues and dependencies linked",
        "- [ ] Design/wireframe artifacts linked (if applicable)",
      ],
      "type:refactor": [
        "- [ ] Scope of refactoring clearly defined",
        "- [ ] Performance/complexity metrics baseline captured",
        "- [ ] Test coverage verified for affected code",
        "- [ ] Backward compatibility considerations documented",
      ],
      "type:test": [
        "- [ ] Test coverage target defined",
        "- [ ] Testing strategy documented",
        "- [ ] Related issues/features linked",
        "- [ ] Test data or fixtures identified",
      ],
      "type:a11y": [
        "- [ ] WCAG 2.2 level specified (A/AA/AAA)",
        "- [ ] Affected components/pages listed",
        "- [ ] Automated/manual testing plan documented",
        "- [ ] Assistive technology requirements specified",
      ],
      "type:security": [
        "- [ ] Vulnerability severity assessed",
        "- [ ] Affected systems/versions documented",
        "- [ ] Reproduction steps (if not public)",
        "- [ ] Proposed mitigation strategy outlined",
      ],
    };

    return templates[issueType] || templates["type:task"];
  }

  /**
   * Generate type-specific DoD template
   */
  generateDoDTemplate(issueType) {
    const templates = {
      "type:task": [
        "- [ ] Implementation complete and tested",
        "- [ ] Code review approved",
        "- [ ] Merged to develop",
        "- [ ] Documented (if applicable)",
      ],
      "type:bug": [
        "- [ ] Root cause identified and documented",
        "- [ ] Fix implemented and tested",
        "- [ ] Regression test added",
        "- [ ] Release notes updated",
      ],
      "type:feature": [
        "- [ ] Feature implemented and tested",
        "- [ ] Documentation/guides created",
        "- [ ] Merged to develop",
        "- [ ] Changelog entry added",
      ],
      "type:design": [
        "- [ ] Design finalized and approved",
        "- [ ] Design system updated (if applicable)",
        "- [ ] Handoff to development complete",
        "- [ ] Design documentation published",
      ],
      "type:epic": [
        "- [ ] All child issues closed",
        "- [ ] Integration testing completed",
        "- [ ] Release notes prepared",
        "- [ ] Stakeholder sign-off obtained",
      ],
      "type:story": [
        "- [ ] Implementation complete",
        "- [ ] Acceptance criteria verified",
        "- [ ] Code review approved",
        "- [ ] QA sign-off obtained",
      ],
      "type:refactor": [
        "- [ ] Refactoring complete",
        "- [ ] All tests passing",
        "- [ ] Performance metrics compared",
        "- [ ] Code review approved",
      ],
      "type:test": [
        "- [ ] Tests implemented",
        "- [ ] Coverage target met",
        "- [ ] All tests passing",
        "- [ ] Merged to develop",
      ],
      "type:a11y": [
        "- [ ] Accessibility fixes implemented",
        "- [ ] Automated a11y testing passing",
        "- [ ] Manual testing with assistive tech complete",
        "- [ ] WCAG compliance verified",
      ],
      "type:security": [
        "- [ ] Security fix implemented",
        "- [ ] Security testing completed",
        "- [ ] CVE update published (if applicable)",
        "- [ ] Release coordinated",
      ],
    };

    return templates[issueType] || templates["type:task"];
  }

  /**
   * Generate remediation checklist comment for an issue
   */
  generateRemediationComment(compliance) {
    if (!compliance.isNonCompliant) {
      return null;
    }

    const parts = [
      "<!-- remediation-checklist -->",
      "## 📋 Remediation Checklist",
      "",
    ];

    // Missing sections
    if (compliance.missingDoR || compliance.missingDoD) {
      parts.push("**Missing required sections:**");
      if (compliance.missingDoR) parts.push("- [ ] Definition of Ready (DoR)");
      if (compliance.missingDoD) parts.push("- [ ] Definition of Done (DoD)");
      parts.push("");
    }

    // Generate template sections to add
    if (compliance.missingDoR) {
      const dorItems = this.generateDoRTemplate(compliance.type);
      parts.push("### Definition of Ready (DoR)");
      parts.push("Before work begins, ensure these items are complete:");
      parts.push("");
      dorItems.forEach((item) => parts.push(item));
      parts.push("");
    }

    if (compliance.missingDoD) {
      const dodItems = this.generateDoDTemplate(compliance.type);
      parts.push("### Definition of Done (DoD)");
      parts.push("Before marking this issue as complete, verify:");
      parts.push("");
      dodItems.forEach((item) => parts.push(item));
      parts.push("");
    }

    parts.push("### How to Apply This Checklist");
    parts.push("1. Copy the sections above into the issue body");
    parts.push(
      '2. Position DoR before any "Work Items" or implementation sections',
    );
    parts.push("3. Position DoD at the end of the issue body");
    parts.push("4. Update the checklist items with any issue-specific details");
    parts.push("5. Save the issue (this comment will auto-resolve)");
    parts.push("");
    parts.push(
      "**Issue template reference:** https://github.com/lightspeedwp/.github/issues/new/choose",
    );

    return parts.join("\n");
  }

  /**
   * Post remediation checklists to non-compliant issues
   */
  async postRemediationChecklists(issues, options = {}) {
    const dryRun = options.dryRun || false;
    const results = [];

    console.log(
      `[remediation-checklist] Analyzing ${issues.length} issue(s)...`,
    );

    for (const issue of issues) {
      const compliance = this.analyzeCompliance(issue);

      if (!compliance.isNonCompliant) {
        results.push({
          issueNumber: compliance.issueNumber,
          status: "compliant",
        });
        continue;
      }

      const checklistComment = this.generateRemediationComment(compliance);

      if (dryRun) {
        results.push({
          issueNumber: compliance.issueNumber,
          status: "ready-to-post",
          comment: checklistComment,
        });
      } else {
        try {
          // Check if checklist already exists
          const comments = await this.github.paginate(
            this.github.rest.issues.listComments,
            {
              owner: this.owner,
              repo: this.repo,
              issue_number: issue.number,
              per_page: 100,
            },
          );

          const existingChecklist = comments.find((c) =>
            c.body?.includes("<!-- remediation-checklist -->"),
          );

          if (existingChecklist) {
            // Update existing checklist
            await this.github.rest.issues.updateComment({
              owner: this.owner,
              repo: this.repo,
              comment_id: existingChecklist.id,
              body: checklistComment,
            });

            results.push({
              issueNumber: compliance.issueNumber,
              status: "checklist-updated",
            });
          } else {
            // Post new checklist
            await this.github.rest.issues.createComment({
              owner: this.owner,
              repo: this.repo,
              issue_number: issue.number,
              body: checklistComment,
            });

            results.push({
              issueNumber: compliance.issueNumber,
              status: "checklist-posted",
            });
          }
        } catch (error) {
          results.push({
            issueNumber: compliance.issueNumber,
            status: "error",
            error: error.message,
          });
        }
      }
    }

    return results;
  }
}

export { RemediationChecklistGenerator };
