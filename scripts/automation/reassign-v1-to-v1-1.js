#!/usr/bin/env node

/**
 * reassign-v1-to-v1-1.js
 *
 * Reassigns all open issues from milestone v1.0 to milestone v1.1
 *
 * OVERVIEW:
 * - Fetches all open issues assigned to milestone v1.0
 * - Reassigns them to milestone v1.1
 * - Provides detailed logging and statistics
 *
 * USAGE:
 *   node reassign-v1-to-v1-1.js [--dry-run] [--verbose]
 *
 * OPTIONS:
 *   --dry-run        Show what would be changed without making API calls
 *   --verbose        Enable detailed logging of each operation
 *
 * ENVIRONMENT:
 *   GITHUB_TOKEN  - Required. Personal Access Token with 'repo' scope
 *   GITHUB_OWNER  - Optional. Repository owner/organization (default: lightspeedwp)
 *   GITHUB_REPO   - Optional. Repository name (default: .github)
 */

import { Octokit } from "octokit";

class MilestoneReassigner {
  constructor(options = {}) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error("GITHUB_TOKEN environment variable is required");
    }

    this.octokit = new Octokit({ auth: token });
    this.owner = options.owner || process.env.GITHUB_OWNER || "lightspeedwp";
    this.repo = options.repo || process.env.GITHUB_REPO || ".github";
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;

    this.stats = {
      found: 0,
      reassigned: 0,
      skipped: 0,
      errors: 0,
    };

    this.errors = [];
  }

  log(level, message) {
    const emoji = {
      success: "✅",
      skip: "⏭️",
      warn: "⚠️",
      error: "❌",
      info: "ℹ️",
    };
    const timestamp = new Date().toISOString();
    console.log(
      `${emoji[level] || "📝"} ${timestamp} [reassign-v1-to-v1-1] ${message}`,
    );
  }

  verbose_log(message) {
    if (this.verbose) {
      console.log(`  → ${message}`);
    }
  }

  async findMilestones() {
    try {
      this.verbose_log("Fetching all milestones...");

      const response = await this.octokit.rest.issues.listMilestones({
        owner: this.owner,
        repo: this.repo,
        state: "all",
        per_page: 100,
      });

      const milestones = {};
      for (const milestone of response.data) {
        milestones[milestone.title] = milestone;
      }

      this.verbose_log(
        `Found ${response.data.length} milestone(s): ${Object.keys(milestones).join(", ")}`,
      );

      return milestones;
    } catch (err) {
      throw new Error(`Failed to fetch milestones: ${err.message}`);
    }
  }

  async fetchIssuesWithMilestone(milestoneNumber) {
    try {
      this.verbose_log(
        `Fetching open issues with milestone #${milestoneNumber}...`,
      );

      const response = await this.octokit.rest.issues.listForRepo({
        owner: this.owner,
        repo: this.repo,
        state: "open",
        milestone: milestoneNumber,
        per_page: 100,
      });

      this.log(
        "info",
        `Found ${response.data.length} open issue(s) with milestone #${milestoneNumber}`,
      );
      this.stats.found = response.data.length;

      return response.data;
    } catch (err) {
      throw new Error(`Failed to fetch issues with milestone: ${err.message}`);
    }
  }

  async reassignIssue(issueNumber, targetMilestoneNumber) {
    try {
      this.verbose_log(`Reassigning issue #${issueNumber}...`);

      if (this.dryRun) {
        this.log(
          "success",
          `[DRY-RUN] Would reassign issue #${issueNumber} to milestone #${targetMilestoneNumber}`,
        );
        this.stats.reassigned++;
        return { status: "dry-run" };
      }

      await this.octokit.rest.issues.update({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        milestone: targetMilestoneNumber,
      });

      this.log(
        "success",
        `Reassigned issue #${issueNumber} to milestone #${targetMilestoneNumber}`,
      );
      this.stats.reassigned++;
      return { status: "reassigned" };
    } catch (err) {
      const errorMsg = `Failed to reassign issue #${issueNumber}: ${err.message}`;
      this.log("error", errorMsg);
      this.stats.errors++;
      this.errors.push(errorMsg);
      return { status: "error", error: err.message };
    }
  }

  async reassignMilestone(sourceMilestoneNumber, targetMilestoneNumber) {
    try {
      this.log("success", "Starting milestone reassignment...");

      const issues = await this.fetchIssuesWithMilestone(sourceMilestoneNumber);

      if (issues.length === 0) {
        this.log("skip", "No issues found with source milestone");
        return { success: true, stats: this.stats };
      }

      this.log("info", `Processing ${issues.length} issue(s)...`);

      for (const issue of issues) {
        await this.reassignIssue(issue.number, targetMilestoneNumber);
      }

      this.logSummary();
      return { success: true, stats: this.stats };
    } catch (err) {
      this.log("error", `${err.message}`);
      return {
        success: false,
        error: err.message,
        stats: this.stats,
      };
    }
  }

  logSummary() {
    const summary = [
      `Reassignment complete.`,
      `Reassigned: ${this.stats.reassigned}`,
      `Skipped: ${this.stats.skipped}`,
      `Errors: ${this.stats.errors}`,
    ].join(" | ");
    this.log("success", summary);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    verbose: false,
    sourceMilestone: "v1.0",
    targetMilestone: "v1.1",
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") {
      options.dryRun = true;
    } else if (args[i] === "--verbose") {
      options.verbose = true;
    } else if (args[i] === "--source" && args[i + 1]) {
      options.sourceMilestone = args[i + 1];
      i++;
    } else if (args[i] === "--target" && args[i + 1]) {
      options.targetMilestone = args[i + 1];
      i++;
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();

  try {
    const reassigner = new MilestoneReassigner(options);

    // Find milestone numbers by title
    const milestones = await reassigner.findMilestones();
    const sourceMilestone = milestones[options.sourceMilestone];
    const targetMilestone = milestones[options.targetMilestone];

    if (!sourceMilestone) {
      console.error(`❌ Milestone "${options.sourceMilestone}" not found`);
      process.exit(1);
    }

    if (!targetMilestone) {
      console.error(`❌ Milestone "${options.targetMilestone}" not found`);
      process.exit(1);
    }

    const result = await reassigner.reassignMilestone(
      sourceMilestone.number,
      targetMilestone.number,
    );

    process.exit(result.success ? 0 : 1);
  } catch (err) {
    console.error(`❌ Fatal error: ${err.message}`);
    process.exit(1);
  }
}

export { MilestoneReassigner };

if (typeof eval !== "undefined") {
  try {
    const meta = eval("typeof import.meta !== 'undefined' && import.meta");
    if (meta && meta.url === `file://${process.argv[1]}`) {
      main();
    }
  } catch {
    // CommonJS context
  }
}
