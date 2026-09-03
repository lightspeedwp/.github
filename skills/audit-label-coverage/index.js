#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { GitHubClient } = require("./lib/github-client");
const { AuditEngine } = require("./lib/audit-engine");
const { ReportGenerator } = require("./lib/report-generator");

class AuditLabelCoverageSkill {
  constructor(octokit, owner, repo) {
    this.octokit = octokit;
    this.owner = owner;
    this.repo = repo;
    this.client = new GitHubClient(octokit, owner, repo);
    this.engine = new AuditEngine(this.client, this._getLabelConfig());
    this.generator = new ReportGenerator();
  }

  _getLabelConfig() {
    // Required label families for open issues/PRs
    const required = {
      type: { required: true, multiple: false },
      status: { required: true, multiple: false },
      priority: { required: true, multiple: false },
      area: { required: true, multiple: true },
    };

    // Optional label families
    const optional = {
      meta: { required: false, multiple: true },
      release: { required: false, multiple: true },
      comp: { required: false, multiple: true },
    };

    return { required, optional };
  }

  async audit(options = {}) {
    const {
      state = "open",
      outputFormat = "all", // cli, markdown, json, all
      outputPath,
      dryRun = false,
    } = options;

    console.log(`📊 Auditing label coverage for ${state} issues/PRs...`);

    // Fetch open issues and PRs
    const issues = await this.client.fetchIssues({ state, perPage: 100 });
    console.log(`✓ Fetched ${issues.length} issues/PRs`);

    // Audit batch
    const auditResult = await this.engine.auditBatch(issues);
    console.log(
      `✓ Audit complete: ${auditResult.fullyLabeled} fully labeled, ${auditResult.partiallyLabeled} partial, ${auditResult.unlabeled} unlabeled`,
    );

    // Generate reports
    const reports = this._generateReports(auditResult, outputFormat);

    if (outputPath) {
      this._saveReports(reports, outputPath, outputFormat);
    }

    return {
      success: true,
      auditResult,
      reports,
      dryRun,
    };
  }

  _generateReports(auditResult, format) {
    const reports = {};

    if (format === "all" || format === "cli") {
      reports.cli = this.generator.generateCliReport(auditResult);
    }

    if (format === "all" || format === "markdown") {
      reports.markdown = this.generator.generateMarkdownReport(auditResult);
    }

    if (format === "all" || format === "json") {
      reports.json = this.generator.generateJsonReport(auditResult);
    }

    return reports;
  }

  _saveReports(reports, basePath, format) {
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
    }

    if (reports.cli) {
      const cliPath = path.join(basePath, "audit-report.txt");
      fs.writeFileSync(cliPath, reports.cli);
      console.log(`✓ CLI report saved to ${cliPath}`);
    }

    if (reports.markdown) {
      const mdPath = path.join(basePath, "audit-report.md");
      fs.writeFileSync(mdPath, reports.markdown);
      console.log(`✓ Markdown report saved to ${mdPath}`);
    }

    if (reports.json) {
      const jsonPath = path.join(basePath, "audit-report.json");
      fs.writeFileSync(jsonPath, reports.json);
      console.log(`✓ JSON report saved to ${jsonPath}`);
    }
  }

  async getRecommendations(issueNumber) {
    // Fetch single issue
    const issue = await this.client.octokit.rest.issues.get({
      owner: this.owner,
      repo: this.repo,
      issue_number: issueNumber,
    });

    // Audit single issue
    const audit = this.engine.auditIssue(issue.data);

    return {
      number: issueNumber,
      coverage: audit.coverage,
      missing: audit.missing,
      suggestions: audit.suggestions,
    };
  }
}

// Export for programmatic use
module.exports = { AuditLabelCoverageSkill };

// CLI usage
if (require.main === module) {
  // Note: In real usage, would need proper GitHub authentication
  console.log('Usage: require("./index.js").AuditLabelCoverageSkill');
  console.log("");
  console.log("Example:");
  console.log('  const { AuditLabelCoverageSkill } = require("./index.js");');
  console.log(
    '  const skill = new AuditLabelCoverageSkill(octokit, "owner", "repo");',
  );
  console.log(
    '  const result = await skill.audit({ outputFormat: "all", outputPath: "./reports" });',
  );
}
